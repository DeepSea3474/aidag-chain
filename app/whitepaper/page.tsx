"use client";
import React from 'react';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Üst Başlık ve Versiyon */}
        <header className="border-b border-zinc-800 pb-10 mb-12">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Aidag Chain Whitepaper
          </h1>
          <div className="flex items-center gap-4 text-sm font-mono text-zinc-500">
            <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-blue-400">v1.0</span>
            <span>January 2026</span>
            <span className="text-green-500">● Fully Autonomous</span>
          </div>
        </header>

        {/* Giriş Özeti */}
        <article className="prose prose-invert max-w-none">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 mb-12 italic text-blue-100/80 shadow-2xl shadow-blue-500/5">
            "The World's First Fully Autonomous AI-Managed Blockchain. Operates under complete control by SoulwareAI."
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <span className="text-blue-500">01.</span> Introduction
            </h2>
            <p className="text-lg leading-relaxed text-zinc-400">
              Aidag Chain represents a paradigm shift in cryptocurrency management. For the first time in blockchain history, an entire ecosystem operates under complete autonomous control by <span className="text-blue-400">SoulwareAI</span> — with <span className="text-red-500 font-bold">NO founder intervention</span> and <span className="text-red-500 font-bold">NO human intervention</span>.
            </p>
          </section>

          {/* Tokenomics Bölümü (Az önce hata veren kısım) */}
          <section className="mt-16 border-t border-zinc-800 pt-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-8">
              <span className="text-blue-500">04.</span> Tokenomics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-blue-500/50 transition-colors">
                <p className="text-zinc-500 text-xs uppercase font-mono">Total Supply</p>
                <p className="text-3xl font-bold text-white mt-1">21,000,000</p>
                <p className="text-blue-400 text-xs font-mono">AIDAG</p>
              </div>
              
              <div className="p-6 bg-zinc-900/50 border border-green-500/30 rounded-2xl hover:border-green-500/50 transition-colors">
                <p className="text-zinc-500 text-xs uppercase font-mono">DAO Allocation</p>
                <p className="text-3xl font-bold text-green-400 mt-1">85.7%</p>
                <p className="text-zinc-600 text-xs font-mono">SoulwareAI Managed</p>
              </div>

              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 text-xs uppercase font-mono">Network</p>
                <p className="text-xl font-semibold text-white mt-1">Binance Smart Chain</p>
                <p className="text-zinc-600 text-xs font-mono">BEP-20 (Chain ID: 56)</p>
              </div>
            </div>

            {/* Kontrat Adresi Paneli */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden font-mono text-sm shadow-inner">
              <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 text-zinc-400 flex justify-between">
                <span>Official Contract Address</span>
                <span className="text-blue-500 text-xs">Verified BEP-20</span>
              </div>
              <div className="p-6 text-blue-300 break-all text-center text-lg tracking-wider">
                0xe6B06f7C63F6AC84729007ae8910010F6E721041
              </div>
            </div>
          </section>

          {/* Otonom Yönetim Vurgusu */}
          <section className="mt-16 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Governance Lifecycle</h3>
            <div className="flex flex-col md:flex-row gap-4 text-xs font-mono text-zinc-500">
              <div className="flex-1 p-3 border border-zinc-800 rounded bg-black">1. Submission</div>
              <div className="flex-1 p-3 border border-zinc-800 rounded bg-black">2. Community Review (48h)</div>
              <div className="flex-1 p-3 border border-zinc-800 rounded bg-black">3. Voting Window (5d)</div>
              <div className="flex-1 p-3 border border-blue-900 rounded bg-zinc-900 text-blue-400 font-bold">4. AI Execution</div>
            </div>
          </section>
        </article>

        <footer className="mt-20 pt-10 border-t border-zinc-900 text-center text-zinc-600 text-sm italic">
          Aidag Chain Protocol - Managed by SoulwareAI Autonomous Neural Network
        </footer>
      </div>
    </div>
  );
}
