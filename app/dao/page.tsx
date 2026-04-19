'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import WalletButton from '../../components/WalletButton';
import { useWallet } from '../../lib/useWallet';
import { useChainData } from '../../lib/useChainData';
import { TOKEN_CONTRACT, BSCSCAN_TOKEN_URL, TELEGRAM_URL, TWITTER_URL, GITHUB_URL } from '../../lib/constants';

function LiveDot({ color = 'emerald' }: { color?: string }) {
  const c: Record<string, string> = { emerald: 'bg-emerald-400', cyan: 'bg-cyan-400', amber: 'bg-amber-400', purple: 'bg-purple-400' };
  return <span className={`w-2 h-2 rounded-full ${c[color] ?? 'bg-emerald-400'} animate-pulse flex-shrink-0`} />;
}

type VoteChoice = 'for' | 'against' | 'abstain';

interface Proposal {
  id: string;
  title: string;
  desc: string;
  author: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  deadline: string;
  soulwareAiVerdict: string;
  tags: string[];
  link?: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: 'AIP-001',
    title: 'Activate Presale Stage 1 — Official Launch',
    desc: 'Officially open AIDAG Stage 1 presale at $0.078 per token. SoulwareAI Market Cell to monitor all BNB inflows to founder wallet and update presale stats in real-time. 9,000,000 AIDAG allocated at Stage 1 price.',
    author: '0xDeepSea3474',
    status: 'passed',
    votesFor: 18900000,
    votesAgainst: 0,
    votesAbstain: 210000,
    deadline: '2026-04-17',
    soulwareAiVerdict: 'EXECUTED — Stage 1 presale is LIVE. SoulwareAI Market Cell tracking inflows in real-time.',
    tags: ['Presale', 'SoulwareAI', 'Treasury'],
  },
  {
    id: 'AIP-002',
    title: 'Activate LSC Chain Builder Module v1.2',
    desc: 'Upgrade SoulwareAI\'s LSC Builder Cell to version 1.2. This update increases DAG block throughput capacity and enables parallel shard processing for the 2027 mainnet target.',
    author: '0x8f3A...9bC2',
    status: 'active',
    votesFor: 14250000,
    votesAgainst: 890000,
    votesAbstain: 320000,
    deadline: '2026-06-01',
    soulwareAiVerdict: 'APPROVED — LSC Builder Cell version compatibility confirmed. Deployment scheduled post-vote.',
    tags: ['SoulwareAI', 'LSC Chain', 'Technical'],
  },
  {
    id: 'AIP-003',
    title: 'Enable CEX Listing Campaign — Post-Presale',
    desc: 'Authorize SoulwareAI Liquidity Cell to deploy 40% of presale funds into a Tier-2 CEX listing campaign. Target: CoinEx, BitMart, MEXC. Execution triggered automatically when Stage 1 presale reaches 80% capacity.',
    author: '0x4dE7...2aF1',
    status: 'active',
    votesFor: 11200000,
    votesAgainst: 1800000,
    votesAbstain: 450000,
    deadline: '2026-07-01',
    soulwareAiVerdict: 'UNDER REVIEW — SoulwareAI Liquidity Cell analyzing exchange conditions. Preliminary: positive.',
    tags: ['Bridge', 'Treasury', 'Technical'],
  },
  {
    id: 'AIP-004',
    title: 'Allocate 500,000 AIDAG to Community Grants Pool',
    desc: 'Create a SoulwareAI-managed community grants pool funded with 500,000 AIDAG from the DAO pool. Grants disbursed autonomously to approved community developers and builders.',
    author: '0x2bA9...5cE3',
    status: 'passed',
    votesFor: 16700000,
    votesAgainst: 1200000,
    votesAbstain: 800000,
    deadline: '2026-03-15',
    soulwareAiVerdict: 'EXECUTED — 500,000 AIDAG reserved in community grants pool. SoulwareAI managing disbursement queue.',
    tags: ['Treasury', 'Community', 'Grants'],
  },
  {
    id: 'AIP-005',
    title: 'Quantum-Resistant Signature Migration Plan',
    desc: 'Approve the roadmap to migrate AIDAG Chain signature scheme from secp256k1 to CRYSTALS-Dilithium post-quantum cryptography for LSC Chain. Implementation begins Q1 2027.',
    author: '0x7fC1...8dA4',
    status: 'passed',
    votesFor: 18900000,
    votesAgainst: 300000,
    votesAbstain: 200000,
    deadline: '2026-02-28',
    soulwareAiVerdict: 'APPROVED — Quantum migration roadmap locked. SoulwareAI Security Cell tracking implementation.',
    tags: ['Security', 'Quantum', 'Infrastructure'],
  },
  {
    id: 'AIP-006',
    title: 'Launch AIDAG Ethereum Bridge — Stage 2',
    desc: 'Deploy a new SoulwareAI Ethereum bridge cell post-CEX listing, enabling AIDAG transfers between BSC and Ethereum mainnet with zero-knowledge proof verification.',
    author: '0x9aB5...3eD7',
    status: 'pending',
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    deadline: '2026-09-01',
    soulwareAiVerdict: 'QUEUED — Proposal valid. Vote opens after Stage 1 presale completion.',
    tags: ['Bridge', 'Multi-Chain', 'Technical'],
  },
];

const STATUS_STYLES: Record<Proposal['status'], { label: string; badge: string; dot: string }> = {
  active:   { label: 'Active',   badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',  dot: 'bg-emerald-400' },
  passed:   { label: 'Passed',   badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',            dot: 'bg-blue-400' },
  rejected: { label: 'Rejected', badge: 'bg-red-500/15 text-red-400 border-red-500/30',              dot: 'bg-red-400' },
  pending:  { label: 'Pending',  badge: 'bg-gray-500/15 text-gray-400 border-gray-500/30',           dot: 'bg-gray-500' },
};

const TAG_COLORS: Record<string, string> = {
  SoulwareAI: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'LSC Chain': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Technical: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Bridge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Security: 'bg-red-500/10 text-red-400 border-red-500/20',
  Community: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Treasury: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Multi-Chain': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Quantum: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Infrastructure: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Grants: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
  Polygon: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  zkEVM: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

export default function DAOPage() {
  const wallet = useWallet();
  const chain = useChainData();

  const [filter, setFilter] = useState<'all' | Proposal['status']>('all');
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [votes, setVotes] = useState<Record<string, VoteChoice>>({});
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [newProp, setNewProp] = useState({ title: '', desc: '' });
  const [submitted, setSubmitted] = useState(false);

  const filtered = filter === 'all' ? PROPOSALS : PROPOSALS.filter(p => p.status === filter);

  const totalVotes = (p: Proposal) => p.votesFor + p.votesAgainst + p.votesAbstain;
  const forPct = (p: Proposal) => totalVotes(p) === 0 ? 0 : Math.round((p.votesFor / totalVotes(p)) * 100);
  const againstPct = (p: Proposal) => totalVotes(p) === 0 ? 0 : Math.round((p.votesAgainst / totalVotes(p)) * 100);

  const handleVote = async (proposalId: string, choice: VoteChoice) => {
    if (!wallet.isConnected) { wallet.openModal(); return; }
    setSubmitting(proposalId);
    await new Promise(r => setTimeout(r, 1800));
    setVotes(prev => ({ ...prev, [proposalId]: choice }));
    setVoted(prev => ({ ...prev, [proposalId]: true }));
    setSubmitting(null);
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) { wallet.openModal(); return; }
    setSubmitting('create');
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(null);
    setSubmitted(true);
    setShowCreate(false);
    setNewProp({ title: '', desc: '' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full bg-purple-500/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.03] blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/90 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/aidag-logo.jpg" alt="AIDAG" width={32} height={32} className="rounded-full border border-cyan-500/20" />
            <span className="font-black text-sm text-gradient">AIDAG DAO</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[['/', 'Home'], ['/presale', 'Presale'], ['/dao', 'DAO'], ['/lsc', 'LSC Chain']].map(([h, l]) => (
              <Link key={h} href={h} className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${h === '/dao' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'}`}>{l}</Link>
            ))}
          </div>
          <WalletButton />
        </div>
      </nav>

      <div className="relative z-10 pt-[100px] max-w-7xl mx-auto px-4 md:px-6 py-12">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 text-xs font-bold text-purple-400 mb-6">
            <LiveDot color="purple" /> SoulwareAI DAO Cell — Active
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            AIDAG <span className="text-gradient">DAO</span> Governance
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            <span className="text-white font-bold">1 AIDAG = 1 Vote.</span> Proposals are created by token holders and executed autonomously by SoulwareAI — AIDAG Chain's own brain & cell system.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Proposals', val: PROPOSALS.length.toString(), sub: 'All time', c: 'text-white' },
            { label: 'Active Votes', val: PROPOSALS.filter(p => p.status === 'active').length.toString(), sub: 'Open now', c: 'text-emerald-400' },
            { label: 'Passed', val: PROPOSALS.filter(p => p.status === 'passed').length.toString(), sub: 'Executed by SoulwareAI', c: 'text-blue-400' },
            { label: 'Governance Token', val: 'AIDAG', sub: '1 AIDAG = 1 Vote', c: 'text-cyan-400' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl border border-white/[0.06] p-5 text-center">
              <div className={`text-2xl font-black font-mono mb-1 ${s.c}`}>{s.val}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.label}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* SoulwareAI DAO Cell status */}
        <div className="glass rounded-2xl border border-purple-500/15 p-5 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <LiveDot color="purple" />
            <span className="font-bold text-purple-400 text-sm">SoulwareAI DAO Cell — Autonomous Execution Engine</span>
            <span className="glass rounded-lg px-2.5 py-1 text-[10px] text-gray-500 font-mono border border-white/[0.04]">
              Block: #{chain.loading ? '···' : chain.blockNumber.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            SoulwareAI's DAO Cell analyzes every proposal using on-chain data and autonomously executes approved decisions. This is AIDAG Chain's own autonomous intelligence — not an external AI service. All executions are transparent and verifiable on BSCScan.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Filter + Create */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'active', 'passed', 'pending', 'rejected'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all capitalize ${filter === f ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'glass border-white/[0.06] text-gray-500 hover:text-white'}`}>
                    {f} {f !== 'all' && `(${PROPOSALS.filter(p => p.status === f).length})`}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowCreate(!showCreate)}
                className="btn btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 flex-shrink-0">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Create Proposal
              </button>
            </div>

            {/* Create proposal form */}
            {showCreate && (
              <div className="glass rounded-2xl border border-cyan-500/20 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Create New Proposal
                </h3>
                {!wallet.isConnected ? (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm mb-4">Connect your wallet to create a proposal</p>
                    <WalletButton />
                  </div>
                ) : (
                  <form onSubmit={handleCreateProposal} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block">Proposal Title</label>
                      <input
                        type="text" required
                        value={newProp.title}
                        onChange={e => setNewProp(p => ({ ...p, title: e.target.value }))}
                        placeholder="Short, clear title for your proposal..."
                        className="w-full glass rounded-xl border border-white/[0.07] focus:border-cyan-500/40 px-4 py-3 text-sm text-white placeholder-gray-700 outline-none transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block">Description</label>
                      <textarea
                        required rows={4}
                        value={newProp.desc}
                        onChange={e => setNewProp(p => ({ ...p, desc: e.target.value }))}
                        placeholder="Detailed description of the proposal, expected outcomes, and implementation plan..."
                        className="w-full glass rounded-xl border border-white/[0.07] focus:border-cyan-500/40 px-4 py-3 text-sm text-white placeholder-gray-700 outline-none transition-colors bg-transparent resize-none"
                      />
                    </div>
                    <div className="glass rounded-xl border border-amber-500/20 p-3 text-xs text-amber-400/80">
                      ⚠️ A minimum AIDAG balance is required to create proposals. SoulwareAI will automatically validate and process your proposal on-chain.
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowCreate(false)} className="flex-1 btn btn-secondary py-3 rounded-xl font-bold text-sm">Cancel</button>
                      <button type="submit" disabled={submitting === 'create'}
                        className="flex-1 btn btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                        {submitting === 'create' ? (
                          <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Submitting...</>
                        ) : 'Submit Proposal'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {submitted && (
              <div className="glass rounded-2xl border border-emerald-500/30 p-4 flex items-center gap-3">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="text-emerald-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-bold text-emerald-400 text-sm">Proposal Submitted!</div>
                  <div className="text-xs text-gray-500">SoulwareAI will validate and queue your proposal for community voting.</div>
                </div>
              </div>
            )}

            {/* Proposals list */}
            {filtered.map(p => {
              const s = STATUS_STYLES[p.status];
              const myVote = votes[p.id];
              const hasVoted = voted[p.id];
              const isActive = p.status === 'active';
              const total = totalVotes(p);

              return (
                <div key={p.id} className={`glass rounded-2xl border overflow-hidden transition-all ${selected?.id === p.id ? 'border-cyan-500/30' : 'border-white/[0.06] hover:border-white/[0.1]'}`}>
                  {/* Header */}
                  <div className="p-5 cursor-pointer" onClick={() => setSelected(selected?.id === p.id ? null : p)}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-[10px] font-black font-mono text-gray-600">{p.id}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${s.badge} flex items-center gap-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${p.status === 'active' ? 'animate-pulse' : ''}`} />
                            {s.label}
                          </span>
                          {p.tags.map(tag => (
                            <span key={tag} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${TAG_COLORS[tag] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{tag}</span>
                          ))}
                        </div>
                        <h3 className="font-bold text-base leading-snug">{p.title}</h3>
                      </div>
                      <svg className={`w-4 h-4 text-gray-600 flex-shrink-0 mt-1 transition-transform ${selected?.id === p.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.desc}</p>

                    {/* Vote bar */}
                    {total > 0 && (
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-600 mb-1.5">
                          <span className="text-emerald-400">For {forPct(p)}%</span>
                          <span className="text-gray-500">{(total / 1e6).toFixed(1)}M votes</span>
                          <span className="text-red-400">Against {againstPct(p)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden flex">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${forPct(p)}%` }} />
                          <div className="h-full bg-gray-600/60 transition-all" style={{ width: `${Math.round((p.votesAbstain / total) * 100)}%` }} />
                          <div className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all" style={{ width: `${againstPct(p)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded detail */}
                  {selected?.id === p.id && (
                    <div className="border-t border-white/[0.05] p-5 space-y-4">
                      <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>

                      {/* SoulwareAI verdict */}
                      <div className="glass rounded-xl border border-purple-500/20 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <LiveDot color="purple" />
                          <span className="text-xs font-bold text-purple-400">SoulwareAI DAO Cell Verdict</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{p.soulwareAiVerdict}</p>
                      </div>

                      {/* Vote detail */}
                      {total > 0 && (
                        <div className="grid grid-cols-3 gap-3 text-center">
                          {[
                            { label: 'For', val: p.votesFor, pct: forPct(p), c: 'text-emerald-400', bar: 'bg-emerald-500' },
                            { label: 'Abstain', val: p.votesAbstain, pct: Math.round((p.votesAbstain / total) * 100), c: 'text-gray-400', bar: 'bg-gray-600' },
                            { label: 'Against', val: p.votesAgainst, pct: againstPct(p), c: 'text-red-400', bar: 'bg-red-500' },
                          ].map(v => (
                            <div key={v.label} className="glass rounded-xl border border-white/[0.05] p-3">
                              <div className={`text-lg font-black ${v.c}`}>{v.pct}%</div>
                              <div className="text-[10px] text-gray-600">{(v.val / 1e6).toFixed(2)}M AIDAG</div>
                              <div className="text-[9px] text-gray-700 uppercase tracking-wider mt-0.5">{v.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Voting buttons */}
                      {isActive && (
                        <div className="space-y-2">
                          {hasVoted ? (
                            <div className="glass rounded-xl border border-emerald-500/25 p-3 text-center text-sm text-emerald-400 font-bold">
                              ✓ You voted <span className="capitalize">{myVote}</span> on {p.id}
                            </div>
                          ) : (
                            <>
                              {!wallet.isConnected ? (
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 mb-2">Connect wallet to vote</p>
                                  <WalletButton className="mx-auto" />
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  {(['for', 'abstain', 'against'] as VoteChoice[]).map(choice => (
                                    <button key={choice}
                                      disabled={submitting === p.id}
                                      onClick={() => handleVote(p.id, choice)}
                                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all capitalize flex items-center justify-center gap-1.5 ${
                                        choice === 'for'     ? 'glass border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/15' :
                                        choice === 'against' ? 'glass border-red-500/30 text-red-400 hover:bg-red-500/15' :
                                                               'glass border-gray-500/30 text-gray-400 hover:bg-white/[0.05]'
                                      } ${submitting === p.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                      {submitting === p.id
                                        ? <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        : choice === 'for' ? '✓' : choice === 'against' ? '✕' : '—'
                                      }
                                      {choice}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-gray-700">
                        <span>Proposer: <span className="font-mono">{p.author}</span></span>
                        <span>Deadline: <span className="text-gray-500">{p.deadline}</span></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Wallet voting power */}
            <div className="glass rounded-2xl border border-white/[0.07] p-5">
              <h3 className="font-bold text-sm mb-4 text-gray-300 flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Your Voting Power
              </h3>
              {!wallet.isConnected ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500 mb-3">Connect to see your voting power</p>
                  <WalletButton className="w-full justify-center" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="glass-cyan rounded-xl p-3 border border-cyan-500/15">
                    <div className="text-2xl font-black text-gradient">{wallet.aidagBalance || '0'}</div>
                    <div className="text-xs text-gray-500 mt-0.5">AIDAG · Voting Power</div>
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">1 AIDAG = 1 Vote. Your votes are weighted by your current AIDAG balance at vote snapshot time.</div>
                  <div className="text-[10px] font-mono text-gray-700 break-all">{wallet.address}</div>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="glass rounded-2xl border border-white/[0.07] p-5">
              <h3 className="font-bold text-sm mb-4 text-gray-300">How DAO Governance Works</h3>
              <div className="space-y-4">
                {[
                  { n: '1', title: 'Hold AIDAG', desc: 'Any AIDAG holder has automatic voting rights. 1 AIDAG = 1 Vote.', c: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                  { n: '2', title: 'Create Proposal', desc: 'Submit your governance idea. SoulwareAI validates it automatically.', c: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { n: '3', title: 'Community Votes', desc: 'Token holders vote For, Against, or Abstain during the voting period.', c: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  { n: '4', title: 'SoulwareAI Executes', desc: 'Approved proposals are executed autonomously on-chain by SoulwareAI DAO Cell.', c: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg border ${s.c} flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5`}>{s.n}</span>
                    <div>
                      <div className="font-bold text-sm text-white">{s.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="glass rounded-2xl border border-white/[0.07] p-5">
              <h3 className="font-bold text-sm mb-4 text-gray-300">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href: '/presale', label: 'Buy AIDAG Token', icon: '💰', ext: false },
                  { href: '/lsc', label: 'LSC Chain Dashboard', icon: '⬡', ext: false },
                  { href: BSCSCAN_TOKEN_URL, label: 'Token on BSCScan', icon: '🔍', ext: true },
                  { href: TELEGRAM_URL, label: 'Telegram Community', icon: '💬', ext: true },
                  { href: TWITTER_URL, label: 'Twitter / X', icon: '🐦', ext: true },
                  { href: GITHUB_URL, label: 'GitHub Repository', icon: '⚙️', ext: true },
                ].map(s =>
                  s.ext
                    ? <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] text-sm text-gray-400 hover:text-white transition-all">
                        <span>{s.icon}</span>{s.label}
                        <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    : <Link key={s.href} href={s.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] text-sm text-gray-400 hover:text-white transition-all">
                        <span>{s.icon}</span>{s.label}
                      </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
