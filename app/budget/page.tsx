'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

interface ExpenseRow {
  id: string;
  label: string;
  min: number;
  max: number;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'optional';
  phase: string;
}
interface LiquidityStatus {
  enabled: boolean;
  mode: 'accumulate' | 'tranche_ready' | 'autonomous_execute';
  policy: {
    daoWalletAllocation: { liquidity: number; devAudit: number; operationalBuffer: number };
    initialPoolTargetUsd: number;
    trancheMinBnb: number;
    targetPairings: string[];
  };
  reserve: {
    daoBalanceBnb: number | null;
    earmarkedForLiquidityBnb: number | null;
    earmarkedForLiquidityUsd: number | null;
    cumulativeContributedUsd: number;
    tranchesReady: number;
    nextTrancheAtBnb: number;
  };
  pools: { dex: string; pairAddress: string | null; liquidityUsd: number; volume24hUsd: number; status: 'pending' | 'live' }[];
  lastReviewAt: number;
  lastTrancheReadyAt: number | null;
  note: string;
}
interface BudgetResponse {
  ok: boolean;
  mainnetTarget: string;
  note: string;
  revenue: {
    live: {
      daoWalletBnb: number;
      founderWalletBnb: number;
      derivedRaisedBnb: number;
      derivedRaisedUsd: number | null;
      bnbPrice: number | null;
      source: string;
    };
    projected: {
      stage1MaxUsd: number;
      stage2MaxUsd: number;
      totalPresaleMaxUsd: number;
      splitTargetPct: { founder: number; dao: number };
      founderShareProjectedUsd: number;
      daoShareProjectedUsd: number;
    };
  };
  expenses: {
    byCategory: ExpenseRow[];
    totals: { mandatoryMinUsd: number; mandatoryMaxUsd: number; withOptionalMaxUsd: number };
  };
  runway: { operatingBudgetUsd: number; monthsAtMaxBurn: number; monthsAtMinBurn: number };
  liquidity: LiquidityStatus;
  timeline: {
    plan: string;
    phases: { phase: string; window: string; parallel: boolean; status: string }[];
  };
}

function fmtUsd(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}
function fmtBnb(n: number | null | undefined, d = 4): string {
  if (n === null || n === undefined) return '—';
  return `${n.toFixed(d)} BNB`;
}
function priorityColor(p: string): string {
  return p === 'critical' ? 'text-red-400 bg-red-500/10' :
         p === 'high'     ? 'text-amber-400 bg-amber-500/10' :
         p === 'medium'   ? 'text-cyan-400 bg-cyan-500/10' :
         p === 'low'      ? 'text-emerald-400 bg-emerald-500/10' :
                            'text-gray-500 bg-white/[0.04]';
}

export default function BudgetPage() {
  const [data, setData] = useState<BudgetResponse | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/api/budget', { cache: 'no-store' });
        if (!r.ok) return;
        const j = (await r.json()) as BudgetResponse;
        if (alive) setData(j);
      } catch { /* keep last */ }
    };
    load();
    const iv = setInterval(load, 6000);
    return () => { alive = false; clearInterval(iv); };
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-gray-200">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-500">
          Bütçe verisi senkronize ediliyor…
        </div>
      </div>
    );
  }

  const r = data.revenue;
  const e = data.expenses;
  const liq = data.liquidity;
  const liqPct = liq.policy.initialPoolTargetUsd > 0
    ? Math.min(100, ((liq.reserve.earmarkedForLiquidityUsd ?? 0) / liq.policy.initialPoolTargetUsd) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live · Autonomous Treasury</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Finans <span className="text-gradient-gold">Şeffaflığı</span>
          </h1>
          <p className="text-gray-400 max-w-3xl">
            Tüm rakamlar canlı BSC zincirinden türetilir. Presale gelirinin %60&apos;ı founder cüzdanına kilitli,
            %40&apos;ı otonom DAO cüzdanına akar. SoulwareAI&apos;nin <span className="text-cyan-400 font-semibold">Liquidity Cell</span>&apos;i
            gelir akışının %40&apos;ını canlı olarak likidite rezervine earmark eder — bu süreç LSC Chain geliştirmesiyle
            paralel ve otonom yürür.
          </p>
        </div>

        {/* ── Revenue vs Expense summary ──────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl border border-emerald-500/20 p-5 bg-emerald-500/[0.03]">
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-2">Canlı Gelir (DAO cüzdanı)</div>
            <div className="text-3xl font-black font-mono text-emerald-400">{fmtBnb(r.live.daoWalletBnb, 4)}</div>
            <div className="text-sm text-gray-400 mt-1">{fmtUsd(r.live.derivedRaisedUsd)} toplam presale (%40 dilim)</div>
            <div className="text-[10px] text-gray-600 mt-2 font-mono">{r.live.source}</div>
          </div>
          <div className="glass rounded-2xl border border-cyan-500/20 p-5 bg-cyan-500/[0.03]">
            <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold mb-2">Projeksiyon (tüm stage&apos;ler)</div>
            <div className="text-3xl font-black font-mono text-cyan-400">{fmtUsd(r.projected.totalPresaleMaxUsd)}</div>
            <div className="text-sm text-gray-400 mt-1">
              %60 founder: {fmtUsd(r.projected.founderShareProjectedUsd)} · %40 DAO: {fmtUsd(r.projected.daoShareProjectedUsd)}
            </div>
            <div className="text-[10px] text-gray-600 mt-2">Stage 1 + Stage 2 hard cap&apos;te</div>
          </div>
          <div className="glass rounded-2xl border border-amber-500/20 p-5 bg-amber-500/[0.03]">
            <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold mb-2">Zorunlu Bütçe (min → max)</div>
            <div className="text-3xl font-black font-mono text-amber-400">{fmtUsd(e.totals.mandatoryMinUsd)}</div>
            <div className="text-sm text-gray-400 mt-1">→ {fmtUsd(e.totals.mandatoryMaxUsd)} (CEX hariç)</div>
            <div className="text-[10px] text-gray-600 mt-2">
              Runway: {data.runway.monthsAtMaxBurn}–{data.runway.monthsAtMinBurn} ay
            </div>
          </div>
        </div>

        {/* ── Parallel Liquidity Track (banner) ───────────────────────── */}
        <div className="glass rounded-2xl border border-violet-500/25 p-6 bg-gradient-to-r from-violet-500/[0.04] to-cyan-500/[0.04]">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">Parallel Track · Liquidity Cell</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  liq.mode === 'autonomous_execute' ? 'bg-emerald-500/20 text-emerald-400' :
                  liq.mode === 'tranche_ready'      ? 'bg-amber-500/20 text-amber-400' :
                                                     'bg-cyan-500/20 text-cyan-400'
                }`}>{liq.mode.replace('_', ' ').toUpperCase()}</span>
              </div>
              <h2 className="text-2xl font-black mb-1">Likidite Oluşumu — Otonom, Geliştirmeyle Paralel</h2>
              <p className="text-sm text-gray-400 max-w-2xl">
                SoulwareAI&apos;nin Liquidity Cell modülü her 8 saniyede bir DAO cüzdan bakiyesini canlı okur,
                politikaya göre %40&apos;ını likidite rezervine earmark eder. {liq.policy.trancheMinBnb} BNB dolduğunda
                tranche deployment için teklif üretir.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">Hedef Havuz</div>
              <div className="text-xl font-black font-mono text-violet-400">{fmtUsd(liq.policy.initialPoolTargetUsd)}</div>
              <div className="text-[10px] text-gray-600 mt-1">{liq.policy.targetPairings[0]}</div>
            </div>
          </div>

          {/* Progress bar toward initial pool target */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
              <span>Birikmiş likidite rezervi</span>
              <span className="font-mono">{fmtUsd(liq.reserve.earmarkedForLiquidityUsd)} / {fmtUsd(liq.policy.initialPoolTargetUsd)} ({liqPct.toFixed(2)}%)</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all"
                style={{ width: `${liqPct}%` }}
              />
            </div>
          </div>

          {/* Liquidity metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="glass rounded-xl border border-white/[0.05] p-3">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">DAO Cüzdan</div>
              <div className="font-mono font-bold text-cyan-400">{fmtBnb(liq.reserve.daoBalanceBnb, 4)}</div>
            </div>
            <div className="glass rounded-xl border border-white/[0.05] p-3">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">Earmarked LP</div>
              <div className="font-mono font-bold text-violet-400">{fmtBnb(liq.reserve.earmarkedForLiquidityBnb, 4)}</div>
            </div>
            <div className="glass rounded-xl border border-white/[0.05] p-3">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">Hazır Tranche</div>
              <div className="font-mono font-bold text-amber-400">{liq.reserve.tranchesReady}</div>
            </div>
            <div className="glass rounded-xl border border-white/[0.05] p-3">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">Sonraki Tranche</div>
              <div className="font-mono font-bold text-emerald-400">+{liq.reserve.nextTrancheAtBnb.toFixed(3)} BNB</div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-gray-500 border-t border-white/[0.05] pt-3">
            <span className="text-violet-400 font-semibold">Policy:</span> DAO cüzdanı akışının
            <span className="text-violet-400 font-mono"> %{(liq.policy.daoWalletAllocation.liquidity * 100).toFixed(0)}</span> likidite,
            <span className="text-cyan-400 font-mono"> %{(liq.policy.daoWalletAllocation.devAudit * 100).toFixed(0)}</span> dev+audit,
            <span className="text-gray-400 font-mono"> %{(liq.policy.daoWalletAllocation.operationalBuffer * 100).toFixed(0)}</span> ops rezervine ayrılır.
            Pre-mainnet: DAO imzacısı tranche&apos;leri PancakeSwap&apos;a seed eder. Post-mainnet (Q1 2027+): on-chain Liquidity Keeper otomatik yürütür.
          </div>
        </div>

        {/* ── Expense table ────────────────────────────────────────────── */}
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
            <span className="font-bold text-sm">Gider Kalemleri</span>
            <span className="text-[10px] text-gray-600 font-mono ml-auto">Senaryo A · Q1 2027 mainnet</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02] text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="text-left px-5 py-2.5 font-semibold">Kalem</th>
                  <th className="text-left px-3 py-2.5 font-semibold">Faz</th>
                  <th className="text-left px-3 py-2.5 font-semibold">Öncelik</th>
                  <th className="text-right px-3 py-2.5 font-semibold">Min</th>
                  <th className="text-right px-5 py-2.5 font-semibold">Max</th>
                </tr>
              </thead>
              <tbody>
                {e.byCategory.map(row => (
                  <tr key={row.id} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5">{row.label}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{row.phase}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${priorityColor(row.priority)}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-gray-400">{fmtUsd(row.min)}</td>
                    <td className="px-5 py-2.5 text-right font-mono font-bold">{fmtUsd(row.max)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-white/[0.08] bg-white/[0.02]">
                  <td className="px-5 py-3 font-black" colSpan={3}>TOPLAM (CEX opsiyonel hariç)</td>
                  <td className="px-3 py-3 text-right font-mono font-black text-amber-400">{fmtUsd(e.totals.mandatoryMinUsd)}</td>
                  <td className="px-5 py-3 text-right font-mono font-black text-amber-400">{fmtUsd(e.totals.mandatoryMaxUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Parallel timeline ────────────────────────────────────────── */}
        <div className="glass rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="font-bold text-lg">Paralel Takvim</span>
            <span className="text-[11px] text-gray-500">{data.timeline.plan}</span>
          </div>
          <div className="space-y-3">
            {data.timeline.phases.map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  p.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{p.phase}</span>
                    {p.parallel && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 uppercase tracking-wider">parallel</span>
                    )}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.04] text-gray-500'
                    }`}>{p.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 font-mono">{p.window}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer note ──────────────────────────────────────────────── */}
        <div className="glass rounded-xl border border-amber-500/[0.15] p-4 text-xs text-gray-500 bg-amber-500/[0.02]">
          <span className="text-amber-400 font-bold">Dürüstlük notu:</span> Presale kontratı henüz deploy edilmedi,
          bu yüzden canlı gelir 0 BNB&apos;dir. Kontrat deploy olduğu an 60/40 split otomatik uygulanır ve bu sayfa
          gerçek verilerle dolar. Beklenen mainnet: <span className="text-cyan-400 font-mono">{data.mainnetTarget}</span>.
          Likidite oluşumu geliştirme ile paralel, otonom yürür — founder müdahalesi gerektirmez.
        </div>

        <div className="text-center pt-4">
          <Link href="/lsc" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
            ← LSC Chain Dashboard&apos;a geri dön
          </Link>
        </div>

      </div>
    </div>
  );
}
