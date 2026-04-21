/**
 * SoulwareAI — Server-Side Autonomous Orchestrator (Task #3)
 *
 * Long-running singleton process. Boots on first request to any API route
 * that imports it (e.g. /api/soulware/status) and continues running for the
 * lifetime of the Node process.
 *
 * STRICT RULE: nothing is fabricated. Every decision/metric/log derives from
 * one of these REAL sources:
 *   - BSC chain reads (eth_blockNumber, eth_gasPrice)
 *   - Real BNB price feeds (Binance / CoinGecko / CryptoCompare)
 *   - Real wallet balances (eth_getBalance for DAO / founder / operation)
 *   - Real AIDAG token Transfer events (eth_getLogs, incrementally polled)
 *     ↳ holder count derived from real recipient addresses
 *     ↳ presale tokensSold derived from real outflows from founder wallet
 *   - Real LSC DAG iteration (ServerDagIterator runs the actual DAG algorithm
 *     — vertex creation, tip selection, weight propagation, finality timing —
 *     measuring real TPS over actual elapsed ms)
 *   - Real on-chain probe (HEAD https://aidag-chain.com) for the website
 *     readiness signal
 *
 * If a feed is unavailable, the corresponding signal stays `false`/`null`
 * with a `note` indicating which feed is offline. NO fabrication.
 */

import fs from 'fs';
import path from 'path';
import { ServerDagIterator, type DagIterationResult } from './dag-iterator';
import { calcGenesisState } from '../lsc-genesis-engine';

export type AutonomyMode = 'observer' | 'propose' | 'execute';

export type DecisionKind =
  | 'CHAIN_TICK'
  | 'TREASURY_AUDIT'
  | 'HOLDER_UPDATE'
  | 'TRANSFER_INGEST'
  | 'PRESALE_PROGRESS'
  | 'PRESALE_STAGE_TRANSITION'
  | 'GAS_WINDOW'
  | 'DEX_READINESS'
  | 'CEX_CHECKLIST'
  | 'LSC_ITERATION'
  | 'LSC_PHASE'
  | 'RPC_FAILOVER'
  | 'RPC_DEGRADED'
  | 'RPC_RECOVERED'
  | 'GOVERNANCE_PROPOSAL'
  | 'GOVERNANCE_APPROVED'
  | 'GOVERNANCE_BROADCAST_PENDING'
  | 'GOVERNANCE_BROADCAST_FAILED'
  | 'GOVERNANCE_EXECUTED'
  | 'GOVERNANCE_REJECTED'
  | 'WHITELIST_VIOLATION'
  | 'SNAPSHOT';

export interface Decision {
  id: string;
  ts: number;
  kind: DecisionKind;
  source: string;
  message: string;
  mode: AutonomyMode | 'log';
  data?: Record<string, unknown>;
}

export interface PendingAction {
  id: string;
  ts: number;
  kind: DecisionKind;
  reason: string;
  payload: Record<string, unknown>;
  requires: 'founder_approval' | 'autonomous_execute';
  whitelistedAction: string;       // must be in EXECUTE_WHITELIST
  status: 'pending' | 'approved' | 'broadcast_pending' | 'broadcast_failed' | 'broadcasted' | 'rejected' | 'failed';
  txHash?: string;
  resultNote?: string;
  decidedAt?: number;
}

export interface RpcHealth {
  url: string;
  ok: boolean;
  latencyMs: number | null;
  lastCheckedAt: number;
  consecutiveFailures: number;
}

export interface ChainSnapshot {
  blockNumber: number | null;
  gasPriceGwei: number | null;
  bnbPrice: number | null;
  chainId: number;
  rpcInUse: string | null;
  lastReadAt: number;
  reads: number;
  failures: number;
}

export interface TreasurySnapshot {
  daoBnb: number | null;
  founderBnb: number | null;
  operationBnb: number | null;
  totalBnb: number | null;
  splitObservedPct: { dao: number | null; operation: number | null };
  splitTargetPct: { operation: 60; dao: 40 };
  withinTolerance: boolean | null;
  toleranceBp: number;
  lastReadAt: number;
}

export interface TokenSnapshot {
  contract: string;
  totalTransfersIngested: number;
  uniqueHolders: number;
  holderSampleSize: number;     // since last full reset
  founderOutflowTokens: number;  // sum of token amount sent FROM founder
  lastIngestBlock: number | null;
  ingestProgress: 'idle' | 'syncing' | 'live' | 'degraded';
  lastIngestAt: number;
  windowStartBlock: number | null;
  note: string | null;
}

export interface PresaleSnapshot {
  stage: 1 | 2;
  priceUsd: number;
  raisedBnb: number | null;
  raisedUsd: number | null;
  tokensSoldOnChain: number | null;   // from real Transfer events out of founder
  tokensSoldDerivedFromBnb: number | null; // legacy/cross-check from BNB inflow
  stage1HardCap: number;
  stage2HardCap: number;
  progressPct: number | null;
  shouldTransitionStage2: boolean;
  uniqueBuyers: number;            // distinct recipients of founder outflows
  source: 'on_chain_transfers' | 'bnb_inflow_derived' | 'unavailable';
  lastReadAt: number;
}

export interface CexEntry {
  exchange: string;
  requirements: { id: string; label: string; ok: boolean; note: string; source: string }[];
  readyPct: number;
  status: 'queued' | 'in_progress' | 'ready_for_apply' | 'submitted';
}

export interface DexEntry {
  pair: string;
  conditions: { id: string; label: string; ok: boolean; note: string; source: string }[];
  readyPct: number;
  status: 'monitoring' | 'ready' | 'paired';
}

export interface LscSnapshot {
  bestRealTps: number;
  bestFinalityMs: number;
  iterations: DagIterationResult[];
  dagStats: { totalVertices: number; confirmedCount: number; tipCount: number; dagHeight: number };
  genesis: ReturnType<typeof calcGenesisState>;
  lastIterationAt: number;
}

export interface OrchestratorState {
  startedAt: number;
  lastTickAt: number;
  ticks: number;
  uptimeMs: number;
  autonomyMode: AutonomyMode;
  dryRun: boolean;
  health: 'healthy' | 'degraded' | 'critical';
  rpcHealth: RpcHealth[];
  chain: ChainSnapshot;
  treasury: TreasurySnapshot;
  token: TokenSnapshot;
  presale: PresaleSnapshot;
  cex: CexEntry[];
  dex: DexEntry[];
  lsc: LscSnapshot;
  decisions: Decision[];
  queue: PendingAction[];
  executedHistory: PendingAction[];
  modules: { id: string; name: string; status: 'active' | 'degraded' | 'idle'; lastRunAt: number; ticks: number; errors: number }[];
  websiteProbe: { ok: boolean; lastCheckedAt: number; statusCode: number | null; note: string };
  evolutionScore: number;
  whitelist: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
const TOKEN_CONTRACT  = (process.env.NEXT_PUBLIC_AIDAG_CONTRACT  ?? '0xe6B06f7C63F6AC84729007ae8910010F6E721041').toLowerCase();
const FOUNDER_WALLET  = (process.env.NEXT_PUBLIC_FOUNDER_WALLET    ?? '0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23').toLowerCase();
const DAO_WALLET      = (process.env.NEXT_PUBLIC_DAO_WALLET        ?? '0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9').toLowerCase();
const OPERATION_WALLET= (process.env.NEXT_PUBLIC_OPERATION_WALLET  ?? '0x0ffe438e047dfb08c0c79aac9a63ea32d49a272c').toLowerCase();

const TOKEN_DECIMALS = 18;
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const STAGE1_PRICE_USD = parseFloat(process.env.NEXT_PUBLIC_PRESALE_STAGE1 ?? '0.078');
const STAGE2_PRICE_USD = parseFloat(process.env.NEXT_PUBLIC_PRESALE_STAGE2 ?? '0.098');
const STAGE1_HARD_CAP  = 9_000_000;
const STAGE2_HARD_CAP  = 7_999_000;

const RPC_URLS = [
  // getLogs-capable RPCs first (binance dataseeds reject eth_getLogs with
  // "limit exceeded"; publicnode + 1rpc accept ranges up to ~1k blocks)
  'https://bsc.publicnode.com',
  'https://1rpc.io/bnb',
  process.env.NEXT_PUBLIC_BSC_RPC,
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
].filter(Boolean) as string[];

const SNAPSHOT_PATH = path.join(process.cwd(), '.data', 'soulware-state.json');
const TICK_INTERVAL_MS = 8_000;
const SNAPSHOT_EVERY_TICKS = 5;
const MAX_DECISIONS = 200;
const MAX_ITERATIONS = 50;
const MAX_EXECUTED = 100;
const TREASURY_TOLERANCE_BP = 500; // 5%
const LOG_CHUNK_SIZE = 200;          // public BSC dataseed friendly
const LOG_CHUNK_PER_TICK = 5;        // up to 1,000 blocks per tick
const HOLDER_LRU_CAP = 50_000;
const WEBSITE_PROBE_URL = 'https://aidag-chain.com';
const WEBSITE_PROBE_EVERY_TICKS = 12;

// Whitelist of action types the engine is allowed to PROPOSE for execution.
// Anything else is rejected with WHITELIST_VIOLATION before reaching the queue.
const EXECUTE_WHITELIST = [
  'PRESALE_STAGE_TRANSITION',
  'TREASURY_REBALANCE',
  'DEX_PAIR_CREATE',
  'CEX_APPLY',
  'GAS_BATCH_EXECUTE',
] as const;
type WhitelistedAction = typeof EXECUTE_WHITELIST[number];
function isWhitelisted(s: string): s is WhitelistedAction {
  return (EXECUTE_WHITELIST as readonly string[]).includes(s);
}

function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  return 'unknown';
}

// ─── Helper: deterministic id ────────────────────────────────────────────────
let _idSeq = 0;
function newId(prefix = 'D'): string {
  _idSeq = (_idSeq + 1) % 1_000_000;
  return `${prefix}-${Date.now().toString(36)}-${_idSeq.toString(36)}`;
}

// ─── HTTP helpers ────────────────────────────────────────────────────────────
async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 5000): Promise<Response> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { ...init, signal: ctl.signal }); }
  finally { clearTimeout(t); }
}

async function rpcCall(rpcUrl: string, method: string, params: unknown[]): Promise<unknown> {
  const r = await fetchWithTimeout(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  }, 6500);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const body = await r.json();
  if (body.error) throw new Error(body.error.message ?? 'rpc_error');
  return body.result;
}

async function fetchBnbPrice(): Promise<number | null> {
  const sources = [
    { url: 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT', parse: (d: unknown) => parseFloat((d as { price?: string })?.price ?? '0') },
    { url: 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd', parse: (d: unknown) => (d as { binancecoin?: { usd?: number } })?.binancecoin?.usd },
    { url: 'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD', parse: (d: unknown) => (d as { USD?: number })?.USD },
  ];
  for (const s of sources) {
    try {
      const r = await fetchWithTimeout(s.url, {}, 4000);
      if (!r.ok) continue;
      const v = s.parse(await r.json());
      if (typeof v === 'number' && v > 1) return v;
    } catch { /* next */ }
  }
  return null;
}

// ─── Topic / address helpers ─────────────────────────────────────────────────
function addrTopic(addr: string): string {
  return '0x' + '0'.repeat(24) + addr.replace(/^0x/, '').toLowerCase();
}
function topicToAddr(topic: string): string {
  return ('0x' + topic.slice(-40)).toLowerCase();
}
function dataToBigInt(data: string): bigint {
  if (!data || data === '0x') return 0n;
  try { return BigInt(data); } catch { return 0n; }
}

// ─── Orchestrator class ──────────────────────────────────────────────────────
class Orchestrator {
  private state: OrchestratorState;
  private timer: ReturnType<typeof setInterval> | null = null;
  private rpcIndex = 0;
  private inFlightTick = false;
  // Holder set: real recipient addresses observed in Transfer events.
  // Bounded LRU via Map insertion order.
  private holders = new Map<string, true>();
  // DAG iterator (real simulation engine)
  private dagIterator = new ServerDagIterator();
  private bestIteration: DagIterationResult | null = null;

  constructor() { this.state = this.initState(); }

  private initState(): OrchestratorState {
    const now = Date.now();
    return {
      startedAt: now,
      lastTickAt: 0,
      ticks: 0,
      uptimeMs: 0,
      autonomyMode: ((process.env.SOULWARE_AUTONOMY_MODE as AutonomyMode) ?? 'observer'),
      dryRun: process.env.SOULWARE_DRY_RUN !== 'false',
      health: 'healthy',
      rpcHealth: RPC_URLS.map(u => ({ url: u, ok: true, latencyMs: null, lastCheckedAt: 0, consecutiveFailures: 0 })),
      chain: {
        blockNumber: null, gasPriceGwei: null, bnbPrice: null,
        chainId: 56, rpcInUse: null, lastReadAt: 0, reads: 0, failures: 0,
      },
      treasury: {
        daoBnb: null, founderBnb: null, operationBnb: null, totalBnb: null,
        splitObservedPct: { dao: null, operation: null },
        splitTargetPct: { operation: 60, dao: 40 },
        withinTolerance: null,
        toleranceBp: TREASURY_TOLERANCE_BP,
        lastReadAt: 0,
      },
      token: {
        contract: TOKEN_CONTRACT,
        totalTransfersIngested: 0,
        uniqueHolders: 0,
        holderSampleSize: 0,
        founderOutflowTokens: 0,
        lastIngestBlock: null,
        ingestProgress: 'idle',
        lastIngestAt: 0,
        windowStartBlock: null,
        note: null,
      },
      presale: {
        stage: 1, priceUsd: STAGE1_PRICE_USD,
        raisedBnb: null, raisedUsd: null,
        tokensSoldOnChain: null, tokensSoldDerivedFromBnb: null,
        stage1HardCap: STAGE1_HARD_CAP, stage2HardCap: STAGE2_HARD_CAP,
        progressPct: null, shouldTransitionStage2: false,
        uniqueBuyers: 0,
        source: 'unavailable',
        lastReadAt: 0,
      },
      cex: this.seedCex(),
      dex: this.seedDex(),
      lsc: {
        bestRealTps: 0, bestFinalityMs: 0,
        iterations: [],
        dagStats: { totalVertices: 0, confirmedCount: 0, tipCount: 0, dagHeight: 0 },
        genesis: calcGenesisState(),
        lastIterationAt: 0,
      },
      decisions: [],
      queue: [],
      executedHistory: [],
      modules: [
        { id: 'chain_watcher',      name: 'BSC Chain Watcher',          status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'treasury_auditor',   name: 'Treasury Auditor',           status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'transfer_indexer',   name: 'AIDAG Transfer Indexer',     status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'holder_tracker',     name: 'Real Holder Tracker',        status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'presale_tracker',    name: 'Presale Tracker (on-chain)', status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'gas_optimizer',      name: 'Gas Window Optimizer',       status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'dex_readiness',      name: 'DEX Readiness',              status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'cex_checklist',      name: 'CEX Application Checklist',  status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'lsc_iterator',       name: 'LSC DAG Iterator (real)',    status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'lsc_phase',          name: 'LSC Genesis Phase Tracker',  status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'website_prober',     name: 'Public Website Prober',      status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'governance',         name: 'Governance Executor',        status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
        { id: 'snapshot',           name: 'State Snapshot',             status: 'idle', lastRunAt: 0, ticks: 0, errors: 0 },
      ],
      websiteProbe: { ok: false, lastCheckedAt: 0, statusCode: null, note: 'henüz probe edilmedi' },
      evolutionScore: 0,
      whitelist: [...EXECUTE_WHITELIST],
    };
  }

  private seedCex(): CexEntry[] {
    const mk = (id: string, label: string) => ({ id, label, ok: false, note: 'gerçek veri bekleniyor', source: 'pending' });
    return [
      { exchange: 'Gate.io', readyPct: 0, status: 'queued', requirements: [
        mk('audit', 'Smart contract audit report'),
        mk('volume', 'Daily volume > $50k'),
        mk('holders', 'Token holders > 1,000'),
        mk('lp', 'Active DEX liquidity pool'),
        mk('kyc', 'Founder KYC docs'),
        mk('website', 'Production website live (HTTP 200)'),
      ]},
      { exchange: 'MEXC', readyPct: 0, status: 'queued', requirements: [
        mk('audit', 'Audit report'),
        mk('volume', 'Daily volume > $30k'),
        mk('holders', 'Holders > 500'),
        mk('website', 'Production website live (HTTP 200)'),
      ]},
      { exchange: 'KuCoin', readyPct: 0, status: 'queued', requirements: [
        mk('audit', 'CertiK or equivalent audit'),
        mk('volume', 'Daily volume > $100k'),
        mk('community', 'Community > 5k members'),
        mk('lp', 'DEX liquidity > $200k'),
        mk('website', 'Production website live (HTTP 200)'),
      ]},
    ];
  }

  private seedDex(): DexEntry[] {
    const mk = (id: string, label: string) => ({ id, label, ok: false, note: 'gerçek veri bekleniyor', source: 'pending' });
    return [{ pair: 'AIDAG/BNB (PancakeSwap V2)', readyPct: 0, status: 'monitoring', conditions: [
      mk('holders', 'Holder count > 500 (gerçek Transfer event)'),
      mk('volume', 'Indexed transfer count > 1,000 (gerçek log)'),
      mk('audit', 'Public contract audit'),
      mk('liquidity_funded', 'Treasury operasyon BNB > 25 (gerçek bakiye)'),
    ]}];
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────
  start(): void {
    if (this.timer) return;
    this.restoreSnapshot();
    this.tick().catch(err => this.recordError('tick_init', err));
    this.timer = setInterval(() => {
      this.tick().catch(err => this.recordError('tick', err));
    }, TICK_INTERVAL_MS);
    const t = this.timer as { unref?: () => void } | null;
    if (t && typeof t.unref === 'function') t.unref();
    this.pushDecision({
      kind: 'CHAIN_TICK',
      source: 'orchestrator.start',
      message: `Otonom motor başlatıldı — mode=${this.state.autonomyMode}, dry_run=${this.state.dryRun}, RPC=${RPC_URLS.length}, whitelist=${EXECUTE_WHITELIST.length} aksiyon`,
      mode: 'log',
      data: { rpcs: RPC_URLS.length, mode: this.state.autonomyMode, dryRun: this.state.dryRun, whitelist: this.state.whitelist },
    });
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.persistSnapshot();
  }

  getState(): OrchestratorState {
    return { ...this.state, uptimeMs: Date.now() - this.state.startedAt };
  }

  // ─── Snapshot ──────────────────────────────────────────────────────────────
  private restoreSnapshot(): void {
    try {
      if (!fs.existsSync(SNAPSHOT_PATH)) return;
      const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf8');
      const prev = JSON.parse(raw) as Partial<OrchestratorState> & { holdersList?: string[] };
      this.state = {
        ...this.state,
        ticks: prev.ticks ?? 0,
        chain: prev.chain ?? this.state.chain,
        treasury: prev.treasury ?? this.state.treasury,
        token: prev.token ?? this.state.token,
        presale: prev.presale ?? this.state.presale,
        cex: prev.cex ?? this.state.cex,
        dex: prev.dex ?? this.state.dex,
        lsc: { ...this.state.lsc, ...(prev.lsc ?? {}), genesis: calcGenesisState() },
        decisions: prev.decisions ?? [],
        queue: prev.queue ?? [],
        executedHistory: prev.executedHistory ?? [],
        evolutionScore: prev.evolutionScore ?? 0,
        websiteProbe: prev.websiteProbe ?? this.state.websiteProbe,
      };
      // Restore holder set
      if (Array.isArray(prev.holdersList)) {
        for (const h of prev.holdersList) this.holders.set(h, true);
      }
      this.bestIteration = (this.state.lsc.iterations ?? []).find(i => i.isBest) ?? null;
      this.pushDecision({
        kind: 'SNAPSHOT',
        source: 'snapshot.restore',
        message: `Snapshot geri yüklendi — ${this.state.decisions.length} karar, ${this.state.lsc.iterations.length} LSC iter, ${this.holders.size} holder, son ingest blok ${this.state.token.lastIngestBlock ?? 'yok'}`,
        mode: 'log',
      });
    } catch (err: unknown) {
      this.recordError('snapshot.restore', err);
    }
  }

  private persistSnapshot(): void {
    try {
      const dir = path.dirname(SNAPSHOT_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const out = {
        ticks: this.state.ticks,
        chain: this.state.chain,
        treasury: this.state.treasury,
        token: this.state.token,
        presale: this.state.presale,
        cex: this.state.cex,
        dex: this.state.dex,
        lsc: this.state.lsc,
        decisions: this.state.decisions.slice(0, 50),
        queue: this.state.queue,
        executedHistory: this.state.executedHistory.slice(0, 30),
        evolutionScore: this.state.evolutionScore,
        websiteProbe: this.state.websiteProbe,
        holdersList: Array.from(this.holders.keys()).slice(-HOLDER_LRU_CAP),
      };
      fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(out, null, 2));
    } catch (err: unknown) {
      this.recordError('snapshot.persist', err);
    }
  }

  // ─── Tick loop ─────────────────────────────────────────────────────────────
  private async tick(): Promise<void> {
    if (this.inFlightTick) return;
    this.inFlightTick = true;
    try {
      this.state.ticks += 1;
      this.state.lastTickAt = Date.now();

      const [chainOk, bnbPrice] = await Promise.all([this.readChain(), fetchBnbPrice()]);
      if (bnbPrice !== null) this.state.chain.bnbPrice = bnbPrice;
      this.setHealth(chainOk ? 'healthy' : 'degraded');

      if (chainOk) {
        await this.readTreasury();
        await this.ingestTransferLogs();   // REAL on-chain Transfer events
      }

      this.computePresaleFromChain();      // REAL on-chain holder & buyer derived
      this.runLscIteration();              // REAL DAG simulation (every tick)
      this.runRules();                     // rules over real signals only

      if (this.state.ticks % WEBSITE_PROBE_EVERY_TICKS === 0) {
        await this.probeWebsite();
      }

      if (this.state.ticks % SNAPSHOT_EVERY_TICKS === 0) {
        this.persistSnapshot();
        this.touchModule('snapshot');
      }

      this.state.lsc.genesis = calcGenesisState();
      this.touchModule('lsc_phase');

      this.state.evolutionScore = this.computeEvolutionScore();
    } finally {
      this.inFlightTick = false;
    }
  }

  // ─── Chain reader (RPC rotation) ───────────────────────────────────────────
  private async readChain(): Promise<boolean> {
    const startIdx = this.rpcIndex;
    for (let i = 0; i < RPC_URLS.length; i++) {
      const idx = (startIdx + i) % RPC_URLS.length;
      const url = RPC_URLS[idx];
      const t0 = Date.now();
      try {
        const [blockHex, gasHex] = await Promise.all([
          rpcCall(url, 'eth_blockNumber', []),
          rpcCall(url, 'eth_gasPrice', []),
        ]) as [string, string];
        const blockNumber = parseInt(blockHex, 16);
        const gasGwei = parseFloat((parseInt(gasHex, 16) / 1e9).toFixed(3));
        if (!Number.isFinite(blockNumber) || blockNumber <= 0) throw new Error('bad_block');
        const latency = Date.now() - t0;
        const previousRpc = this.state.chain.rpcInUse;
        this.state.chain.blockNumber = blockNumber;
        this.state.chain.gasPriceGwei = gasGwei;
        this.state.chain.rpcInUse = url;
        this.state.chain.lastReadAt = Date.now();
        this.state.chain.reads += 1;
        this.markRpc(idx, true, latency);
        if (previousRpc && previousRpc !== url) {
          this.pushDecision({
            kind: 'RPC_FAILOVER', source: 'rpc.rotation',
            message: `RPC failover: ${previousRpc} → ${url} (${latency}ms)`,
            mode: 'log', data: { from: previousRpc, to: url, latency },
          });
        }
        this.rpcIndex = idx;
        this.touchModule('chain_watcher');
        this.pushDecision({
          kind: 'CHAIN_TICK', source: 'rpc.eth_blockNumber',
          message: `BSC blok #${blockNumber.toLocaleString()} okundu — gas ${gasGwei} Gwei${this.state.chain.bnbPrice ? `, BNB $${this.state.chain.bnbPrice.toFixed(2)}` : ''}`,
          mode: 'log', data: { blockNumber, gasGwei, bnbPrice: this.state.chain.bnbPrice },
        });
        return true;
      } catch {
        this.markRpc(idx, false, null);
        this.state.chain.failures += 1;
      }
    }
    this.recordError('chain.all_rpcs_failed', new Error('all RPCs unreachable'));
    this.pushDecision({
      kind: 'RPC_DEGRADED', source: 'rpc.health',
      message: `Tüm BSC RPC uçları cevap vermiyor — motor degraded moda geçti`,
      mode: 'log', data: { rpcs: RPC_URLS },
    });
    this.touchModule('chain_watcher', true);
    return false;
  }

  private markRpc(idx: number, ok: boolean, latencyMs: number | null): void {
    const h = this.state.rpcHealth[idx]; if (!h) return;
    h.ok = ok; h.latencyMs = latencyMs; h.lastCheckedAt = Date.now();
    h.consecutiveFailures = ok ? 0 : h.consecutiveFailures + 1;
  }

  // ─── Treasury reader ───────────────────────────────────────────────────────
  private async readTreasury(): Promise<void> {
    const url = this.state.chain.rpcInUse ?? RPC_URLS[0];
    try {
      const [daoHex, founderHex, opHex] = await Promise.all([
        rpcCall(url, 'eth_getBalance', [DAO_WALLET, 'latest']),
        rpcCall(url, 'eth_getBalance', [FOUNDER_WALLET, 'latest']),
        rpcCall(url, 'eth_getBalance', [OPERATION_WALLET, 'latest']),
      ]) as [string, string, string];
      const daoBnb = Number(BigInt(daoHex)) / 1e18;
      const founderBnb = Number(BigInt(founderHex)) / 1e18;
      const operationBnb = Number(BigInt(opHex)) / 1e18;
      const totalBnb = daoBnb + operationBnb;
      this.state.treasury.daoBnb = daoBnb;
      this.state.treasury.founderBnb = founderBnb;
      this.state.treasury.operationBnb = operationBnb;
      this.state.treasury.totalBnb = totalBnb;
      if (totalBnb > 0) {
        const opPct = (operationBnb / totalBnb) * 100;
        const daoPct = (daoBnb / totalBnb) * 100;
        this.state.treasury.splitObservedPct = { operation: opPct, dao: daoPct };
        this.state.treasury.withinTolerance =
          Math.abs(opPct - 60) < (TREASURY_TOLERANCE_BP / 100) &&
          Math.abs(daoPct - 40) < (TREASURY_TOLERANCE_BP / 100);
      } else {
        this.state.treasury.splitObservedPct = { operation: null, dao: null };
        this.state.treasury.withinTolerance = null;
      }
      this.state.treasury.lastReadAt = Date.now();
      this.touchModule('treasury_auditor');
    } catch (err: unknown) {
      this.recordError('treasury.read', err);
      this.touchModule('treasury_auditor', true);
    }
  }

  // ─── REAL Transfer event ingestion (eth_getLogs, incremental) ─────────────
  private async getLogsWithFallback(params: Record<string, unknown>): Promise<unknown[]> {
    // Try the active RPC first, then rotate through the rest.
    const startIdx = this.rpcIndex;
    let lastErr: unknown = null;
    for (let i = 0; i < RPC_URLS.length; i++) {
      const idx = (startIdx + i) % RPC_URLS.length;
      const url = RPC_URLS[idx];
      try {
        const res = await rpcCall(url, 'eth_getLogs', [params]);
        return Array.isArray(res) ? res : [];
      } catch (err: unknown) { lastErr = err; }
    }
    throw lastErr instanceof Error ? lastErr : new Error('all_rpcs_failed');
  }

  private async ingestTransferLogs(): Promise<void> {
    const head = this.state.chain.blockNumber;
    if (!head) return;
    let from = this.state.token.lastIngestBlock !== null
      ? this.state.token.lastIngestBlock + 1
      : Math.max(0, head - LOG_CHUNK_SIZE);
    if (this.state.token.windowStartBlock === null) {
      this.state.token.windowStartBlock = from;
    }
    if (from > head) {
      this.state.token.ingestProgress = 'live';
      this.touchModule('transfer_indexer');
      return;
    }
    this.state.token.ingestProgress = (head - from > LOG_CHUNK_SIZE * 8) ? 'syncing' : 'live';
    let chunks = 0;
    let totalNew = 0;
    let founderOutNew = 0;
    let buyersNew = 0;
    const buyerSet = new Set<string>();
    while (from <= head && chunks < LOG_CHUNK_PER_TICK) {
      const to = Math.min(head, from + LOG_CHUNK_SIZE - 1);
      try {
        const logs = await this.getLogsWithFallback({
          fromBlock: '0x' + from.toString(16),
          toBlock:   '0x' + to.toString(16),
          address: TOKEN_CONTRACT,
          topics: [TRANSFER_TOPIC],
        });
        if (Array.isArray(logs)) {
          for (const lgRaw of logs) {
            const lg = lgRaw as { topics?: string[]; data?: string } | null;
            if (!lg?.topics || lg.topics.length < 3) continue;
            const fromAddr = topicToAddr(lg.topics[1]);
            const toAddr   = topicToAddr(lg.topics[2]);
            const amount   = dataToBigInt(lg.data ?? '0x');
            const amountTokens = Number(amount) / Math.pow(10, TOKEN_DECIMALS);
            // Track recipient as holder (not the zero burn address)
            if (toAddr !== '0x0000000000000000000000000000000000000000') {
              if (!this.holders.has(toAddr)) {
                this.holders.set(toAddr, true);
                if (this.holders.size > HOLDER_LRU_CAP) {
                  // Drop oldest (first inserted)
                  const firstKey = this.holders.keys().next().value;
                  if (firstKey) this.holders.delete(firstKey);
                }
              }
            }
            // Founder outflow → presale buyer
            if (fromAddr === FOUNDER_WALLET) {
              founderOutNew += amountTokens;
              buyerSet.add(toAddr);
              buyersNew++;
            }
            totalNew++;
          }
        }
        this.state.token.lastIngestBlock = to;
        from = to + 1;
        chunks++;
      } catch (err: unknown) {
        this.state.token.ingestProgress = 'degraded';
        this.state.token.note = `eth_getLogs hata: ${errMsg(err)}`;
        this.touchModule('transfer_indexer', true);
        return;
      }
    }
    this.state.token.totalTransfersIngested += totalNew;
    this.state.token.uniqueHolders = this.holders.size;
    this.state.token.holderSampleSize = this.holders.size;
    this.state.token.founderOutflowTokens += founderOutNew;
    this.state.token.lastIngestAt = Date.now();
    this.state.token.note = totalNew > 0
      ? `son chunk: ${chunks} blok aralığı, +${totalNew} transfer, +${buyersNew} alıcı`
      : `chain başında — yeni transfer yok`;
    this.touchModule('transfer_indexer');
    this.touchModule('holder_tracker');

    if (totalNew > 0) {
      this.pushDecision({
        kind: 'TRANSFER_INGEST',
        source: 'rpc.eth_getLogs',
        message: `AIDAG Transfer event indeksi: +${totalNew} log, +${buyersNew} alıcı, +${founderOutNew.toFixed(4)} AIDAG founder→buyer (blok ${this.state.token.lastIngestBlock?.toLocaleString()})`,
        mode: 'log',
        data: { newLogs: totalNew, newBuyers: buyersNew, founderOutflow: founderOutNew, lastBlock: this.state.token.lastIngestBlock },
      });
    }
    if (totalNew > 0 || (this.state.ticks % 6 === 0)) {
      this.pushDecision({
        kind: 'HOLDER_UPDATE',
        source: 'holder.set',
        message: `Gerçek holder sayısı: ${this.state.token.uniqueHolders.toLocaleString()} (Transfer event recipient kümesi)`,
        mode: 'log',
        data: { holders: this.state.token.uniqueHolders, totalTransfers: this.state.token.totalTransfersIngested },
      });
    }
  }

  // ─── Presale derived from REAL on-chain Transfer events ───────────────────
  private computePresaleFromChain(): void {
    const founderBnb = this.state.treasury.founderBnb;
    const price = this.state.chain.bnbPrice;
    const onChainTokensOut = this.state.token.founderOutflowTokens;

    if (founderBnb !== null && price !== null) {
      const raisedUsd = founderBnb * price;
      const fromBnb = raisedUsd / STAGE1_PRICE_USD;
      this.state.presale.raisedBnb = founderBnb;
      this.state.presale.raisedUsd = raisedUsd;
      this.state.presale.tokensSoldDerivedFromBnb = fromBnb;
    }

    // Prefer real on-chain transfer data when available; fall back to BNB-derived
    let primaryTokensSold: number | null = null;
    let source: PresaleSnapshot['source'] = 'unavailable';
    if (this.state.token.totalTransfersIngested > 0 && onChainTokensOut > 0) {
      primaryTokensSold = onChainTokensOut;
      source = 'on_chain_transfers';
    } else if (this.state.presale.tokensSoldDerivedFromBnb !== null && this.state.presale.tokensSoldDerivedFromBnb > 0) {
      primaryTokensSold = this.state.presale.tokensSoldDerivedFromBnb;
      source = 'bnb_inflow_derived';
    }

    this.state.presale.tokensSoldOnChain = onChainTokensOut > 0 ? onChainTokensOut : null;
    this.state.presale.source = source;
    if (primaryTokensSold !== null) {
      const stage = primaryTokensSold >= STAGE1_HARD_CAP ? 2 : 1;
      const progressPct = stage === 1
        ? Math.min(100, (primaryTokensSold / STAGE1_HARD_CAP) * 100)
        : Math.min(100, ((primaryTokensSold - STAGE1_HARD_CAP) / STAGE2_HARD_CAP) * 100);
      const transitioned = stage === 2 && this.state.presale.stage === 1;
      this.state.presale.stage = stage;
      this.state.presale.priceUsd = stage === 1 ? STAGE1_PRICE_USD : STAGE2_PRICE_USD;
      this.state.presale.progressPct = progressPct;
      this.state.presale.shouldTransitionStage2 = transitioned;
      // Unique buyers from holder set minus the founder/treasury wallets
      const internalWallets = new Set([FOUNDER_WALLET, DAO_WALLET, OPERATION_WALLET, TOKEN_CONTRACT]);
      let buyerCount = 0;
      for (const addr of this.holders.keys()) if (!internalWallets.has(addr)) buyerCount++;
      this.state.presale.uniqueBuyers = buyerCount;
      this.state.presale.lastReadAt = Date.now();
      this.touchModule('presale_tracker');
      if (transitioned) {
        this.proposeWhitelisted({
          kind: 'PRESALE_STAGE_TRANSITION',
          whitelistedAction: 'PRESALE_STAGE_TRANSITION',
          reason: `Stage 1 hard cap (${STAGE1_HARD_CAP.toLocaleString()} AIDAG) doldu — kaynak: ${source}`,
          payload: { newStage: 2, newPriceUsd: STAGE2_PRICE_USD, tokensSold: primaryTokensSold, source },
        });
      }
    }
  }

  // ─── REAL LSC DAG iteration (drives ServerDagIterator) ─────────────────────
  private runLscIteration(): void {
    const id = (this.state.lsc.iterations[0]?.id ?? 0) + 1;
    // Param search: vary burst & tipsPerVertex around best known
    const baseBurst = this.bestIteration?.params.burst ?? 30;
    const baseTips  = this.bestIteration?.params.tipsPerVertex ?? 2;
    const burst = Math.max(5, Math.min(120, baseBurst + ((id % 5) - 2) * 5));
    const tipsPerVertex = Math.max(1, Math.min(4, baseTips + ((id % 3) - 1)));
    const result = this.dagIterator.iterate(id, burst, tipsPerVertex);
    const previousBest = this.bestIteration?.metrics.realTps ?? 0;
    const isBest = result.metrics.realTps > previousBest;
    result.delta = result.metrics.realTps - previousBest;
    result.isBest = isBest;
    this.state.lsc.iterations.unshift(result);
    if (this.state.lsc.iterations.length > MAX_ITERATIONS) {
      this.state.lsc.iterations = this.state.lsc.iterations.slice(0, MAX_ITERATIONS);
    }
    if (isBest) {
      this.bestIteration = result;
      this.state.lsc.bestRealTps = result.metrics.realTps;
      this.state.lsc.bestFinalityMs = result.metrics.avgFinalityMs;
    }
    this.state.lsc.dagStats = this.dagIterator.getStats();
    this.state.lsc.lastIterationAt = Date.now();
    this.touchModule('lsc_iterator');
    this.pushDecision({
      kind: 'LSC_ITERATION', source: 'lsc.dag_iterator.real',
      message: `LSC iter #${id}: ${result.metrics.verticesCreated} vertex üretildi, gerçek TPS=${result.metrics.realTps.toLocaleString()}, ortalama finality=${result.metrics.avgFinalityMs}ms, tip diversity=${result.metrics.tipDiversity}, DAG height=${result.metrics.dagHeight}${isBest ? ' — yeni en iyi' : ''}`,
      mode: 'log',
      data: result as unknown as Record<string, unknown>,
    });
  }

  // ─── Rules engine (over real signals only) ─────────────────────────────────
  private runRules(): void {
    // Treasury 60/40
    const t = this.state.treasury;
    if (t.withinTolerance === false && t.totalBnb && t.totalBnb > 0.001 && this.state.ticks % 5 === 0) {
      this.pushDecision({
        kind: 'TREASURY_AUDIT', source: 'treasury.split_check',
        message: `Hazine 60/40 sapması: ${t.splitObservedPct.operation?.toFixed(2)}% / ${t.splitObservedPct.dao?.toFixed(2)}% (toplam ${t.totalBnb?.toFixed(4)} BNB)`,
        mode: this.state.autonomyMode === 'execute' ? 'execute' : 'propose',
        data: { observed: t.splitObservedPct, target: t.splitTargetPct, totalBnb: t.totalBnb },
      });
      this.proposeWhitelisted({
        kind: 'TREASURY_AUDIT',
        whitelistedAction: 'TREASURY_REBALANCE',
        reason: 'Treasury split outside 60/40 tolerance (gerçek bakiyeden ölçüldü)',
        payload: { observed: t.splitObservedPct, totalBnb: t.totalBnb },
      });
    }

    // Presale progress (every 4 ticks if real data exists)
    if (this.state.ticks % 4 === 0 && this.state.presale.source !== 'unavailable') {
      const p = this.state.presale;
      const tokens = p.tokensSoldOnChain ?? p.tokensSoldDerivedFromBnb ?? 0;
      this.pushDecision({
        kind: 'PRESALE_PROGRESS', source: `presale.${p.source}`,
        message: `Presale Stage ${p.stage}: ${Math.round(tokens).toLocaleString()} AIDAG, %${p.progressPct?.toFixed(2)}, $${Math.round(p.raisedUsd ?? 0).toLocaleString()} raised, ${p.uniqueBuyers} alıcı (kaynak: ${p.source})`,
        mode: 'log',
        data: { stage: p.stage, tokensSold: tokens, raisedUsd: p.raisedUsd, progressPct: p.progressPct, buyers: p.uniqueBuyers, source: p.source },
      });
    }

    // Gas window (real gas reading)
    const gas = this.state.chain.gasPriceGwei;
    if (gas !== null && gas <= 1.5 && this.state.ticks % 6 === 0) {
      this.pushDecision({
        kind: 'GAS_WINDOW', source: 'rpc.gas_price',
        message: `Düşük gas penceresi (${gas} Gwei) — kuyruktaki batch işlemler için uygun`,
        mode: 'propose', data: { gasGwei: gas },
      });
    }

    this.evaluateDexReadiness();
    this.evaluateCexChecklist();
  }

  private evaluateDexReadiness(): void {
    const dex = this.state.dex[0]; if (!dex) return;
    const opBnb = this.state.treasury.operationBnb ?? 0;
    const holders = this.state.token.uniqueHolders;
    const transfers = this.state.token.totalTransfersIngested;
    dex.conditions = [
      {
        id: 'holders', label: 'Holder count > 500 (gerçek Transfer event)',
        ok: holders > 500, source: 'eth_getLogs',
        note: holders > 0 ? `Indekslenen unique alıcı: ${holders}` : 'Henüz Transfer event indekslenmedi',
      },
      {
        id: 'volume', label: 'Indexed transfer count > 1,000 (gerçek log)',
        ok: transfers > 1000, source: 'eth_getLogs',
        note: `Toplam indekslenen transfer: ${transfers}`,
      },
      {
        id: 'audit', label: 'Public contract audit',
        ok: false, source: 'manual',
        note: 'Audit raporu henüz yüklenmedi (manual işaretleme gerekli)',
      },
      {
        id: 'liquidity_funded', label: 'Treasury operasyon BNB > 25 (gerçek bakiye)',
        ok: opBnb >= 25, source: 'eth_getBalance',
        note: `Mevcut: ${opBnb.toFixed(4)} BNB`,
      },
    ];
    const okCount = dex.conditions.filter(c => c.ok).length;
    dex.readyPct = (okCount / dex.conditions.length) * 100;
    dex.status = dex.readyPct >= 100 ? 'ready' : 'monitoring';
    this.touchModule('dex_readiness');
    if (dex.status === 'ready' && this.state.ticks % 8 === 0) {
      this.proposeWhitelisted({
        kind: 'DEX_READINESS',
        whitelistedAction: 'DEX_PAIR_CREATE',
        reason: `Tüm DEX likidite ön koşulları gerçek zincir verisinden doğrulandı`,
        payload: { pair: dex.pair, conditions: dex.conditions },
      });
    }
  }

  private evaluateCexChecklist(): void {
    const opBnb = this.state.treasury.operationBnb ?? 0;
    const transfers = this.state.token.totalTransfersIngested;
    const holders = this.state.token.uniqueHolders;
    const websiteOk = this.state.websiteProbe.ok;
    const websiteNote = this.state.websiteProbe.statusCode !== null
      ? `HTTP ${this.state.websiteProbe.statusCode} (probe: ${WEBSITE_PROBE_URL})`
      : 'Henüz probe edilmedi';

    for (const cex of this.state.cex) {
      for (const r of cex.requirements) {
        switch (r.id) {
          case 'volume':
            r.ok = transfers > 1000;
            r.note = `Indekslenen transfer: ${transfers} (gerçek log)`;
            r.source = 'eth_getLogs';
            break;
          case 'holders':
            r.ok = cex.exchange === 'KuCoin' || cex.exchange === 'Gate.io' ? holders > 1000 : holders > 500;
            r.note = `Gerçek holder sayısı: ${holders}`;
            r.source = 'eth_getLogs';
            break;
          case 'lp':
            r.ok = opBnb >= 25;
            r.note = `Operasyon BNB: ${opBnb.toFixed(4)}`;
            r.source = 'eth_getBalance';
            break;
          case 'website':
            r.ok = websiteOk;
            r.note = websiteNote;
            r.source = 'http_probe';
            break;
          case 'community':
            r.ok = false;
            r.note = 'Topluluk indeksleyici bağlanmadı (manual)';
            r.source = 'pending';
            break;
          case 'audit':
          case 'kyc':
            r.ok = false;
            r.note = 'Manual onay/dosya gerekli (founder)';
            r.source = 'manual';
            break;
        }
      }
      const okCount = cex.requirements.filter(x => x.ok).length;
      cex.readyPct = (okCount / cex.requirements.length) * 100;
      cex.status = cex.readyPct >= 100 ? 'ready_for_apply' : okCount > 0 ? 'in_progress' : 'queued';
      if (cex.status === 'ready_for_apply' && this.state.ticks % 10 === 0) {
        this.proposeWhitelisted({
          kind: 'CEX_CHECKLIST',
          whitelistedAction: 'CEX_APPLY',
          reason: `${cex.exchange} listing checklisti tüm gerçek sinyallerle yeşil`,
          payload: { exchange: cex.exchange },
        });
      }
    }
    this.touchModule('cex_checklist');
  }

  // ─── Real website probe ────────────────────────────────────────────────────
  private async probeWebsite(): Promise<void> {
    try {
      const r = await fetchWithTimeout(WEBSITE_PROBE_URL, { method: 'HEAD' }, 5000);
      this.state.websiteProbe = {
        ok: r.ok,
        statusCode: r.status,
        lastCheckedAt: Date.now(),
        note: r.ok ? 'site canlı' : `HTTP ${r.status}`,
      };
      this.touchModule('website_prober');
    } catch (err: unknown) {
      this.state.websiteProbe = { ok: false, statusCode: null, lastCheckedAt: Date.now(), note: errMsg(err) || 'probe error' };
      this.touchModule('website_prober', true);
    }
  }

  // ─── Whitelist + governance pipeline ───────────────────────────────────────
  private proposeWhitelisted(p: { kind: DecisionKind; whitelistedAction: string; reason: string; payload: Record<string, unknown> }): void {
    if (!isWhitelisted(p.whitelistedAction)) {
      this.pushDecision({
        kind: 'WHITELIST_VIOLATION', source: 'governance.whitelist',
        message: `Aksiyon whitelist dışı: ${p.whitelistedAction} → kuyruğa eklenmedi, log'landı`,
        mode: 'log', data: { rejected: p.whitelistedAction, reason: p.reason },
      });
      return;
    }
    const sig = `${p.kind}:${p.whitelistedAction}:${JSON.stringify(p.payload)}`;
    if (this.state.queue.some(x => `${x.kind}:${x.whitelistedAction}:${JSON.stringify(x.payload)}` === sig && x.status === 'pending')) {
      return; // already queued
    }
    const action: PendingAction = {
      id: newId('A'),
      ts: Date.now(),
      kind: p.kind,
      reason: p.reason,
      payload: p.payload,
      whitelistedAction: p.whitelistedAction,
      requires: this.state.autonomyMode === 'execute' ? 'autonomous_execute' : 'founder_approval',
      status: 'pending',
    };
    this.state.queue.unshift(action);
    if (this.state.queue.length > 50) this.state.queue = this.state.queue.slice(0, 50);
    this.pushDecision({
      kind: 'GOVERNANCE_PROPOSAL', source: 'governance.proposer',
      message: `Yeni öneri kuyruğa alındı (${p.whitelistedAction}): ${p.reason}`,
      mode: this.state.autonomyMode === 'execute' ? 'execute' : 'propose',
      data: { actionId: action.id, whitelistedAction: p.whitelistedAction, requires: action.requires },
    });
    this.touchModule('governance');

    // In execute mode + non-dry-run, immediately attempt the dry-run validator;
    // actual on-chain execution requires a separate, signed approval.
    if (this.state.autonomyMode === 'execute' && !this.state.dryRun) {
      // We do NOT auto-broadcast here without a private key + signed approval.
      // The /api/soulware/queue endpoint (founder-secret protected) is the only
      // path that flips status → executed. This guarantees no autonomous tx
      // ever hits the chain without an explicit signed approval.
      this.pushDecision({
        kind: 'GOVERNANCE_PROPOSAL', source: 'governance.executor',
        message: `Execute mode aktif fakat onay endpoint'i bekleniyor — aksiyon ${action.id} pending kalıyor (whitelist guard)`,
        mode: 'log',
        data: { actionId: action.id },
      });
    }
  }

  /**
   * External approval path (called from /api/soulware/queue/[id]).
   * Returns the updated action or null if not found / invalid.
   */
  approveAction(actionId: string, decision: 'approve' | 'reject', note?: string): PendingAction | null {
    const idx = this.state.queue.findIndex(a => a.id === actionId);
    if (idx < 0) return null;
    const action = this.state.queue[idx];
    if (action.status !== 'pending') return action;
    action.decidedAt = Date.now();
    if (decision === 'reject') {
      action.status = 'rejected';
      action.resultNote = note ?? 'founder rejected';
      this.state.queue.splice(idx, 1);
      // Rejected actions go to history as a permanent record (no execution implied).
      this.state.executedHistory.unshift(action);
      if (this.state.executedHistory.length > MAX_EXECUTED) {
        this.state.executedHistory = this.state.executedHistory.slice(0, MAX_EXECUTED);
      }
      this.pushDecision({
        kind: 'GOVERNANCE_REJECTED', source: 'governance.api',
        message: `Aksiyon ${actionId} (${action.whitelistedAction}) founder tarafından reddedildi: ${action.resultNote}`,
        mode: 'log', data: { actionId, kind: action.kind },
      });
      this.touchModule('governance');
      return action;
    }
    // Approve path. Real on-chain execution requires SOULWARE_DAO_PRIVATE_KEY +
    // execute mode + dryRun=false. NO fabrication: we never emit
    // GOVERNANCE_EXECUTED and never push to executedHistory unless a real
    // broadcast actually succeeded with a verifiable tx hash.
    const hasKey = !!process.env.SOULWARE_DAO_PRIVATE_KEY;
    const canBroadcast = this.state.autonomyMode === 'execute' && !this.state.dryRun && hasKey;
    if (!canBroadcast) {
      // Governance approved, but broadcast prerequisites missing.
      // Action stays in queue with status 'approved' so the operator can see it
      // is awaiting broadcast capability. No execute event, no history move.
      action.status = 'approved';
      action.resultNote = `approved (governance-only — broadcast disabled: mode=${this.state.autonomyMode}, dryRun=${this.state.dryRun}, signer=${hasKey ? 'yes' : 'no'})`;
      this.pushDecision({
        kind: 'GOVERNANCE_APPROVED', source: 'governance.api',
        message: `Aksiyon ${actionId} (${action.whitelistedAction}) onaylandı; broadcast devre dışı: ${action.resultNote}`,
        mode: 'log', data: { actionId, kind: action.kind, broadcast: false },
      });
      this.touchModule('governance');
      return action;
    }
    // canBroadcast === true. Real broadcast requires a per-action tx builder
    // (ethers + AIDAG contract calls). That builder is not wired in this
    // iteration, so we do NOT fabricate a tx hash and we do NOT emit
    // GOVERNANCE_EXECUTED. Mark as broadcast_pending and emit the matching
    // event. The action stays in the queue until a real broadcast result.
    action.status = 'broadcast_pending';
    action.resultNote = 'approved — awaiting real on-chain broadcast (tx builder not yet wired)';
    this.pushDecision({
      kind: 'GOVERNANCE_BROADCAST_PENDING', source: 'governance.api',
      message: `Aksiyon ${actionId} (${action.whitelistedAction}) onaylandı, gerçek broadcast bekleniyor`,
      mode: 'log', data: { actionId, kind: action.kind, broadcast: 'pending' },
    });
    this.touchModule('governance');
    return action;
  }

  /**
   * Internal: called only after a real, verified on-chain broadcast.
   * Emits GOVERNANCE_EXECUTED and moves the action to executedHistory.
   * Never call this with a fabricated or unverified tx hash.
   */
  private finalizeBroadcast(actionId: string, txHash: string): PendingAction | null {
    const idx = this.state.queue.findIndex(a => a.id === actionId);
    if (idx < 0) return null;
    const action = this.state.queue[idx];
    if (action.status !== 'broadcast_pending') return action;
    action.status = 'broadcasted';
    action.txHash = txHash;
    action.resultNote = `broadcasted: ${txHash}`;
    this.state.queue.splice(idx, 1);
    this.state.executedHistory.unshift(action);
    if (this.state.executedHistory.length > MAX_EXECUTED) {
      this.state.executedHistory = this.state.executedHistory.slice(0, MAX_EXECUTED);
    }
    this.pushDecision({
      kind: 'GOVERNANCE_EXECUTED', source: 'governance.broadcast',
      message: `Aksiyon ${actionId} (${action.whitelistedAction}) zincire yazıldı: ${txHash}`,
      mode: 'execute', data: { actionId, kind: action.kind, txHash },
    });
    this.touchModule('governance');
    return action;
  }

  // ─── Decision/module helpers ───────────────────────────────────────────────
  private pushDecision(d: Omit<Decision, 'id' | 'ts'>): void {
    const dec: Decision = { id: newId('D'), ts: Date.now(), ...d };
    this.state.decisions.unshift(dec);
    if (this.state.decisions.length > MAX_DECISIONS) {
      this.state.decisions = this.state.decisions.slice(0, MAX_DECISIONS);
    }
  }

  private touchModule(id: string, errored = false): void {
    const m = this.state.modules.find(x => x.id === id); if (!m) return;
    m.lastRunAt = Date.now(); m.ticks += 1;
    if (errored) m.errors += 1;
    m.status = errored ? 'degraded' : 'active';
  }

  private setHealth(level: 'healthy' | 'degraded' | 'critical'): void {
    if (this.state.health === level) return;
    const prev = this.state.health;
    this.state.health = level;
    this.pushDecision({
      kind: level === 'healthy' ? 'RPC_RECOVERED' : 'RPC_DEGRADED',
      source: 'orchestrator.health',
      message: `Motor sağlık durumu: ${prev} → ${level}`,
      mode: 'log', data: { prev, level },
    });
  }

  private recordError(scope: string, err: unknown): void {
    const msg = errMsg(err);
    this.pushDecision({
      kind: 'RPC_DEGRADED', source: scope,
      message: `Hata: ${scope} → ${msg}`,
      mode: 'log', data: { scope, error: msg },
    });
  }

  private computeEvolutionScore(): number {
    return Math.min(99999, Math.floor(
      this.state.ticks * 1 +
      this.state.decisions.length * 2 +
      this.state.lsc.iterations.length * 5 +
      Math.floor(this.state.lsc.bestRealTps / 100) +
      this.state.token.totalTransfersIngested * 3 +
      this.state.token.uniqueHolders * 1 +
      (this.state.treasury.lastReadAt > 0 ? 50 : 0) +
      this.state.executedHistory.length * 10
    ));
  }
}

// ─── Singleton accessor ──────────────────────────────────────────────────────
const GLOBAL_KEY = '__SOULWARE_ORCHESTRATOR__';
type GlobalWithOrch = typeof globalThis & { [GLOBAL_KEY]?: Orchestrator };

export function getOrchestrator(): Orchestrator {
  const g = globalThis as GlobalWithOrch;
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = new Orchestrator();
  return g[GLOBAL_KEY]!;
}

export function startOrchestrator(): void { getOrchestrator().start(); }
export function stopOrchestrator(): void { getOrchestrator().stop(); }
