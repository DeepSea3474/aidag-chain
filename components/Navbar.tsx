'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WalletButton from './WalletButton';
import { useWalletContext } from '../lib/WalletContext';

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

interface NavbarProps {
  activePage?: 'home' | 'lsc' | 'dao' | 'presale' | 'soulware' | 'docs';
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  const { openModal, isConnected } = useWalletContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [scrolled, setScrolled] = useState(false);
  const [lscOpen, setLscOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const lscRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aidag_lang');
      if (saved) setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (lscRef.current && !lscRef.current.contains(e.target as Node)) setLscOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const changeLang = (code: string) => {
    setLang(code);
    setLangOpen(false);
    try { localStorage.setItem('aidag_lang', code); } catch {}
    window.dispatchEvent(new CustomEvent('aidag-lang-change', { detail: code }));
  };

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const navItems = [
    { label: 'Home',     href: '/',         key: 'home',     icon: '◇' },
    { label: 'Presale',  href: '/presale',  key: 'presale',  icon: '◈', accent: 'green' },
    { label: 'DAO',      href: '/dao',      key: 'dao',      icon: '⬢', accent: 'purple' },
    { label: 'SoulwareAI', href: '/soulware', key: 'soulware', icon: '◉', accent: 'cyan' },
  ];

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
          <span className="text-gray-700">|</span>
          <span className="text-amber-400/80">Stage 1 Live · Listing $0.12</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="flex items-center gap-1"><span style={{ color: '#f0b90b' }}>⬡</span> BSC</span>
          <span className="flex items-center gap-1"><span style={{ color: '#627eea' }}>◈</span> ETH</span>
          <span className="flex items-center gap-1"><span style={{ color: '#8247e5' }}>⬟</span> Polygon</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* ═══ Logo: AIDAG (navy gradient) CHAIN (white) with quantum glow ═══ */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group min-w-0">
          <div className="relative shrink-0">
            {/* Triple-layer pulsing glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-indigo-700 to-cyan-500 blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
            <div className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-md group-hover:bg-cyan-400/40 transition-all" />
            {/* Logo image */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-cyan-400/40 group-hover:border-cyan-300/70 transition-all shadow-lg shadow-cyan-500/30">
              <Image src="/aidag-logo.jpg" alt="AIDAG" width={44} height={44} className="rounded-full" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-cyan-400/10 to-blue-600/20 mix-blend-overlay" />
            </div>
          </div>
          <div className="leading-tight min-w-0">
            <div className="font-black text-lg sm:text-xl tracking-tight flex items-baseline gap-1.5 select-none">
              {/* AIDAG — navy/blue gradient with shimmer */}
              <span className="aidag-brand">AIDAG</span>
              {/* CHAIN — pure white with subtle glow */}
              <span className="chain-brand">CHAIN</span>
            </div>
            <div className="hidden sm:flex text-[9px] text-cyan-400/70 font-bold tracking-[0.25em] uppercase items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              SoulwareAI · Autonomous
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const active = activePage === item.key;
            const accentColor =
              item.accent === 'green' ? 'text-emerald-400' :
              item.accent === 'purple' ? 'text-purple-400' :
              item.accent === 'cyan' ? 'text-cyan-400' :
              'text-gray-300';
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  active
                    ? `${accentColor} bg-white/[0.06]`
                    : `text-gray-400 hover:text-white hover:bg-white/[0.04]`
                }`}
              >
                <span className={`text-[10px] ${active ? accentColor : 'opacity-50'}`}>{item.icon}</span>
                {item.label}
                {active && (
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full ${
                    item.accent === 'green' ? 'bg-emerald-400' :
                    item.accent === 'purple' ? 'bg-purple-400' :
                    item.accent === 'cyan' ? 'bg-cyan-400' :
                    'bg-cyan-400'
                  }`} />
                )}
              </Link>
            );
          })}

          {/* LSC Chain dropdown */}
          <div className="relative" ref={lscRef}>
            <button
              onClick={() => setLscOpen(!lscOpen)}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activePage === 'lsc'
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/[0.06]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              LSC Chain
              <svg className={`w-3 h-3 transition-transform ${lscOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute -top-1 -right-1 text-[8px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-black px-1.5 py-0.5 rounded-full shadow-lg shadow-amber-500/50">2027</span>
            </button>

            {lscOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 glass rounded-2xl border border-amber-500/20 shadow-2xl shadow-amber-900/20 p-2 z-50">
                <div className="px-3 py-2 mb-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60 mb-1">2027 Roadmap</div>
                  <div className="text-xs text-gray-400">LSC Chain — 100,000+ TPS DAG Blockchain</div>
                </div>
                <Link href="/lsc" onClick={() => setLscOpen(false)} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-base mt-0.5 shrink-0">⬡</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">LSC Dashboard</div>
                    <div className="text-xs text-gray-500">Live DAG · TPS · cell network</div>
                  </div>
                </Link>
                <Link href="/lsc#roadmap" onClick={() => setLscOpen(false)} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-base mt-0.5 shrink-0">🗺</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Roadmap 2025–2027</div>
                    <div className="text-xs text-gray-500">Autonomy milestones</div>
                  </div>
                </Link>
                <Link href="/lsc#whitepaper" onClick={() => setLscOpen(false)} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-base mt-0.5 shrink-0">📄</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Whitepaper</div>
                    <div className="text-xs text-gray-500">DAG architecture · consensus</div>
                  </div>
                </Link>
                <div className="mt-2 mx-3 mb-1 p-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="text-[10px] text-amber-400 font-bold">⚡ AIDAG holders → priority LSC allocation @ 1:100</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Buy AIDAG — prominent CTA, always visible */}
          <Link
            href="/presale"
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden md:inline">Buy AIDAG</span>
            <span className="md:hidden">Buy</span>
            <span className="hidden lg:inline text-[9px] bg-white/20 px-1 py-0.5 rounded ml-0.5">$0.078</span>
          </Link>

          {/* Language */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all border border-white/[0.06] hover:border-white/[0.12]"
              title="Change language"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:block text-[11px] font-bold">{currentLang.code.toUpperCase()}</span>
              <svg className={`w-3 h-3 transition-transform hidden sm:block ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 glass rounded-2xl border border-white/[0.08] shadow-2xl p-1.5 z-50">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
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

          {/* Wallet — full button on tablet+, icon-only on mobile */}
          <div className="hidden md:block">
            <WalletButton />
          </div>
          <button
            onClick={openModal}
            aria-label={isConnected ? 'Wallet connected' : 'Connect wallet'}
            title={isConnected ? 'Wallet connected' : 'Connect wallet'}
            className={`md:hidden relative p-2 rounded-xl border transition-all ${
              isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {isConnected && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden relative p-2 rounded-xl text-white bg-white/[0.04] border border-white/[0.08] hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.05] bg-[#020617]/98 px-4 py-4 flex flex-col gap-1.5">
          {navItems.map(item => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold ${
                activePage === item.key ? 'bg-white/[0.08] text-white' : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="text-base opacity-70">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <Link href="/lsc" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl flex items-center gap-3 text-amber-400 hover:bg-amber-500/10 transition-all text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            ⬡ LSC Chain Dashboard
            <span className="ml-auto text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">2027</span>
          </Link>

          <div className="border-t border-white/[0.05] mt-2 pt-3 space-y-2">
            <Link href="/presale" onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30">
              💰 Buy AIDAG — $0.078
            </Link>
            <Link href="/dao" onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20">
              ⬢ Become DAO Member
            </Link>
            <button
              onClick={() => { setMobileOpen(false); openModal(); }}
              className="btn btn-primary w-full py-3 rounded-xl text-sm font-bold"
            >
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
