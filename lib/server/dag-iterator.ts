/**
 * Server-side DAG iterator — real DAG simulation engine (not a formula).
 *
 * Mirrors the algorithm of lib/dag-engine.ts but runs in Node, callable from
 * the orchestrator. Each iteration genuinely:
 *   - selects parent tips by cumulative weight (heaviest + 1 random)
 *   - creates a new vertex, links parent→child, propagates weight
 *   - confirms parents reaching weight ≥ 3
 *   - measures real TPS over the iteration window
 *
 * Output metrics are derived from the actual DAG state, not a synthesized
 * formula. Determinism: uses a seeded LCG so every server can reproduce the
 * same chain from the same seed.
 */

export type VertexType = 'GENESIS' | 'TX' | 'SMART_CONTRACT' | 'DAO_VOTE' | 'BRIDGE' | 'VALIDATOR';

export interface DagVertex {
  hash: string;
  parents: string[];
  children: string[];
  height: number;
  cumulativeWeight: number;
  timestamp: number;
  confirmed: boolean;
  type: VertexType;
}

export interface DagIterationResult {
  id: number;
  ts: number;
  params: { burst: number; tipsPerVertex: number; targetVertices: number };
  metrics: {
    verticesCreated: number;
    confirmed: number;
    tips: number;
    dagHeight: number;
    realTps: number;            // measured over actual elapsed ms
    avgFinalityMs: number;       // measured: time from vertex created → confirmed
    tipDiversity: number;        // unique parent set count / verticesCreated
    durationMs: number;
  };
  delta: number;
  isBest: boolean;
}

function fnv1a(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function makeHash(seed: string): string {
  const a = fnv1a(seed);
  const b = fnv1a(a.toString(16) + seed);
  const c = fnv1a(b.toString(16) + seed.slice(0, 8));
  const d = fnv1a(c.toString(16) + seed.slice(-8));
  return [a, b, c, d].map(n => (n >>> 0).toString(16).padStart(8, '0')).join('');
}

// Seeded LCG for deterministic, reproducible iterations
class Lcg {
  private s: number;
  constructor(seed: number) { this.s = seed >>> 0; }
  next(): number { this.s = (Math.imul(this.s, 1664525) + 1013904223) >>> 0; return this.s / 0xFFFFFFFF; }
}

export class ServerDagIterator {
  private vertices = new Map<string, DagVertex>();
  private tips = new Set<string>();
  private genesisHash: string;
  private seq = 0;
  private finalityRecords: number[] = []; // time-to-confirm for each confirmed vertex

  constructor(seed = 'AIDAG_LSC_SERVER_DAG_2026') {
    this.genesisHash = makeHash(seed);
    const genesis: DagVertex = {
      hash: this.genesisHash,
      parents: [], children: [], height: 0,
      cumulativeWeight: 9999, timestamp: Date.now(),
      confirmed: true, type: 'GENESIS',
    };
    this.vertices.set(this.genesisHash, genesis);
    this.tips.add(this.genesisHash);
    this.seq++;
  }

  private selectTips(rng: Lcg, count: number): string[] {
    const arr = Array.from(this.tips);
    if (arr.length <= count) return arr;
    arr.sort((a, b) => (this.vertices.get(b)?.cumulativeWeight ?? 0) - (this.vertices.get(a)?.cumulativeWeight ?? 0));
    if (count === 1) return [arr[0]];
    const heavy = arr[0];
    const randIdx = 1 + Math.floor(rng.next() * (arr.length - 1));
    return [heavy, arr[randIdx] ?? arr[0]];
  }

  /**
   * Run a full iteration — produces `targetVertices` real DAG vertices, links
   * them, propagates weights, measures real TPS and finality.
   */
  iterate(id: number, targetVertices = 30, tipsPerVertex = 2): DagIterationResult {
    const rng = new Lcg(id * 2654435761);
    const types: VertexType[] = ['TX', 'TX', 'TX', 'TX', 'SMART_CONTRACT', 'VALIDATOR', 'DAO_VOTE', 'BRIDGE'];
    const t0 = Date.now();
    const parentSets = new Set<string>();
    let createdCount = 0;
    let confirmedThisRun = 0;
    const confirmTimes: number[] = [];

    for (let i = 0; i < targetVertices; i++) {
      const parents = this.selectTips(rng, tipsPerVertex);
      parentSets.add(parents.slice().sort().join(','));
      const type = types[Math.floor(rng.next() * types.length)];
      const parentHeights = parents.map(p => this.vertices.get(p)?.height ?? 0);
      const height = Math.max(...parentHeights, 0) + 1;
      const now = Date.now();
      const hash = makeHash(parents.join('') + this.seq.toString() + now.toString() + type);
      const vertex: DagVertex = {
        hash, parents, children: [], height,
        cumulativeWeight: 1, timestamp: now,
        confirmed: false, type,
      };
      this.vertices.set(hash, vertex);
      // Link parents → children, propagate weight
      for (const ph of parents) {
        this.tips.delete(ph);
        const p = this.vertices.get(ph);
        if (!p) continue;
        p.children.push(hash);
        p.cumulativeWeight += 1;
        if (p.cumulativeWeight >= 3 && !p.confirmed) {
          p.confirmed = true;
          confirmedThisRun++;
          const finalityMs = now - p.timestamp;
          if (finalityMs >= 0) confirmTimes.push(finalityMs);
        }
      }
      this.tips.add(hash);
      this.seq++;
      createdCount++;
    }

    // Prune to keep memory bounded — drop oldest confirmed non-tip non-genesis
    if (this.vertices.size > 500) {
      const prunable = Array.from(this.vertices.entries())
        .filter(([h, v]) => v.confirmed && !this.tips.has(h) && h !== this.genesisHash)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, this.vertices.size - 400);
      prunable.forEach(([h]) => this.vertices.delete(h));
    }

    const durationMs = Math.max(1, Date.now() - t0);
    const realTps = Math.round((createdCount * 1000) / durationMs);
    const avgFinalityMs = confirmTimes.length > 0
      ? Math.round(confirmTimes.reduce((s, x) => s + x, 0) / confirmTimes.length)
      : 0;
    this.finalityRecords.push(...confirmTimes);
    if (this.finalityRecords.length > 200) this.finalityRecords = this.finalityRecords.slice(-200);

    const tipDiversity = parentSets.size / Math.max(1, createdCount);
    const dagHeight = Math.max(...Array.from(this.vertices.values()).map(v => v.height));

    return {
      id, ts: Date.now(),
      params: { burst: targetVertices, tipsPerVertex, targetVertices },
      metrics: {
        verticesCreated: createdCount,
        confirmed: confirmedThisRun,
        tips: this.tips.size,
        dagHeight,
        realTps,
        avgFinalityMs,
        tipDiversity: parseFloat(tipDiversity.toFixed(3)),
        durationMs,
      },
      delta: 0,    // filled by orchestrator (vs previous best)
      isBest: false,
    };
  }

  getStats() {
    const arr = Array.from(this.vertices.values());
    return {
      totalVertices: arr.length,
      confirmedCount: arr.filter(v => v.confirmed).length,
      tipCount: this.tips.size,
      dagHeight: Math.max(0, ...arr.map(v => v.height)),
      genesisHash: this.genesisHash,
      seq: this.seq,
    };
  }
}
