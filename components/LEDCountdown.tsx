"use client"; // Bu satır en üstte olmalı

import React, { useState, useEffect } from 'react';

interface Props {
  title: string;
  targetDate: string;
}

const LEDCountdown: React.FC<Props> = ({ title, targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isMounted, setIsMounted] = useState(false); // Hidrasyon hatasını engellemek için

  useEffect(() => {
    setIsMounted(true); // Bileşen tarayıcıya yüklendiğinde aktif et
    
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Eğer henüz tarayıcıda değilsek hiçbir şey gösterme (Hata önleyici)
  if (!isMounted) return null;

  const Digit = ({ val, label }: { val: number, label: string }) => (
    <div className="led-unit">
      <div className="led-digit">{val.toString().padStart(2, '0')}</div>
      <div className="led-text">{label}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-black text-center">
      <h2 className="text-blue-500 font-bold tracking-[0.4em] uppercase mb-8 animate-pulse text-xs">
        {title}
      </h2>
      
      <div className="led-box-main mb-8">
        <Digit val={timeLeft.d} label="Gün" />
        <Digit val={timeLeft.h} label="Saat" />
        <Digit val={timeLeft.m} label="Dakika" />
        <Digit val={timeLeft.s} label="Saniye" />
      </div>

      <div className="max-w-2xl border-t border-blue-900/50 pt-6 mt-2">
        <p className="text-blue-400 text-sm font-medium tracking-wide leading-relaxed">
          <span className="text-blue-200">SYSTEM NOTIFICATION:</span> Ön satışlar web sitemizde <span className="text-cyan-400 italic">SoulwareAI</span> tarafından otonom olarak başlatılacaktır. 
          Eş zamanlı olarak <span className="text-cyan-400">Launchpad</span> sitelerinde ön satış süreci aktif edilecektir.
        </p>
        <p className="text-blue-700 text-[11px] mt-3 uppercase tracking-widest opacity-80">
          Pinksale listelemesi ve özel satış turu stratejik planlama dahilinde yakında duyurulacaktır.
        </p>
      </div>

      <div className="mt-8 text-blue-900 text-[9px] uppercase tracking-[0.3em]">
        Neural Time Protocol & Autonomous Deployment Active
      </div>
    </div>
  );
};

export default LEDCountdown;
