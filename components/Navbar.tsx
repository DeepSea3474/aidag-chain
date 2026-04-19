'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { openWeb3Modal } from '../lib/web3modal';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
];

const CHAINS = [
  { name: 'BSC', color: '#f0b90b', icon: '⬡' },
  { name: 'ETH', color: '#627eea', icon: '◈' },
  { name: 'Polygon', color: '#8247e5', icon: '⬟' },
];

interface NavbarProps {
  activePage?: 'home' | 'lsc' | 'dao' | 'presale' | 'docs';
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [scrolled, setScrolled] = useState(false);
  const [walletAddr, setWalletAddr] = useState('');
  const [lscOpen, setLscOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const lscRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (lscRef.current && !lscRef.current.contains(e.target as Node)) setLscOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const connectWallet = async () => {
    await openWeb3Modal();
  };

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <nav className={`navbar transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/50' : ''}`}>
      {/* Top micro-bar */}
      <div className="border-b border-white/[0.04] px-6 py-1.5 hidden md:flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-4 text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="live-dot" style={{ width: 6, height: 6 }}></span>
            <span className="text-emerald-400 font-semibold">SoulwareAI</span> ONLINE
          </span>
          <span className="text-gray-700">|</span>
          <span>BSC Block: <span className="text-cyan-400 font-mono">#{(47823941 + Math.floor(Date.now() / 3000)).toLocaleString()}</span></span>
          <span className="text-gray-700">|</span>
          <span>AIDAG: <span className="text-green-400 font-semibold">$0.078</span></span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          {CHAINS.map(c => (
            <span key={c.name} className="flex items-center gap-1">
              <span style={{ color: c.color }}>{c.icon}</span> {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div className="px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-500/40 blur-md group-hover:bg-cyan-500/60 transition-all" />
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all">
              <Image src="/aidag-logo.jpg" alt="AIDAG" width={36} height={36} className="rounded-full" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-black text-base text-gradient tracking-tight">AIDAG DAO</div>
            <div className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Chain</div>
          </div>
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {[
            { label: 'Home', href: '/', key: 'home' },
            { label: 'Presale', href: '/#presale', key: 'presale' },
            { label: 'DAO', href: '/#dao', key: 'dao' },
            { label: 'Docs', href: '/#docs', key: 'docs' },
          ].map(item => (
            <a
              key={item.key}
              href={item.href}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all group ${
                activePage === item.key
                  ? 'text-white bg-white/[0.06]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
              {activePage === item.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </a>
          ))}

          {/* LSC Chain dropdown */}
          <div className="relative" ref={lscRef}>
            <button
              onClick={() => setLscOpen(!lscOpen)}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 group ${
                activePage === 'lsc'
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/[0.06]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              LSC Chain
              <svg className={`w-3.5 h-3.5 transition-transform ${lscOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-full">2027</span>
            </button>

            {lscOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 glass rounded-2xl border border-amber-500/20 shadow-2xl shadow-amber-900/20 p-2 z-50">
                <div className="px-3 py-2 mb-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60 mb-1">2027 Roadmap</div>
                  <div className="text-xs text-gray-400">LSC Chain — 100,000+ TPS DAG Blockchain</div>
                </div>
                <a href="/lsc" className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-base mt-0.5 shrink-0">⬡</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">LSC Dashboard</div>
                    <div className="text-xs text-gray-500">Live DAG network, TPS, chain metrics</div>
                  </div>
                </a>
                <a href="/lsc#devlog" className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-base mt-0.5 shrink-0">📡</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Dev Log</div>
                    <div className="text-xs text-gray-500">SoulwareAI autonomous development updates</div>
                  </div>
                </a>
                <a href="/lsc#roadmap" className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-base mt-0.5 shrink-0">🗺</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Roadmap 2025–2027</div>
                    <div className="text-xs text-gray-500">Full autonomy milestones & progress</div>
                  </div>
                </a>
                <a href="/lsc#whitepaper" className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-base mt-0.5 shrink-0">📄</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Whitepaper</div>
                    <div className="text-xs text-gray-500">DAG architecture & consensus model</div>
                  </div>
                </a>
                <div className="mt-2 mx-3 mb-1 p-2 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="text-[10px] text-amber-400/70 font-medium">⚡ AIDAG holders get early LSC access</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all border border-white/[0.06] hover:border-white/[0.12]"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:block text-xs">{currentLang.code.toUpperCase()}</span>
              <svg className={`w-3 h-3 transition-transform hidden sm:block ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 glass rounded-2xl border border-white/[0.08] shadow-2xl p-1.5 z-50">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                      lang === l.code
                        ? 'bg-cyan-500/15 text-cyan-400'
                        : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="font-medium">{l.name}</span>
                    {lang === l.code && <span className="ml-auto text-cyan-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wallet connect */}
          {walletAddr ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-sm font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {walletAddr.slice(0, 6)}...{walletAddr.slice(-4)}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="btn btn-primary px-4 py-2 rounded-xl text-sm font-bold hidden md:flex"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Connect Wallet
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.05] bg-[#020617]/98 px-4 py-4 flex flex-col gap-1">
          {[
            { label: '🏠 Home', href: '/' },
            { label: '💰 Presale', href: '/#presale' },
            { label: '🗳️ DAO', href: '/#dao' },
            { label: '📄 Docs', href: '/#docs' },
          ].map(item => (
            <a key={item.label} href={item.href} className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all text-sm font-medium">
              {item.label}
            </a>
          ))}

          <div className="border-t border-white/[0.05] mt-2 pt-2">
            <a href="/lsc" className="px-4 py-3 rounded-xl flex items-center gap-2 text-amber-400 hover:bg-amber-500/10 transition-all text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              ⬡ LSC Chain Dashboard
              <span className="ml-auto text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">2027</span>
            </a>
          </div>

          <div className="border-t border-white/[0.05] mt-2 pt-3">
            <button
              onClick={connectWallet}
              className="btn btn-primary w-full py-3 rounded-xl text-sm font-bold"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
