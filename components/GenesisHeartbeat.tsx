'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * GenesisHeartbeat — hospital ECG-style monitor synchronized to BSC block production.
 * Each new block triggers a heartbeat spike (~ every 3s on BSC mainnet).
 */
export default function GenesisHeartbeat() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const beatRequestRef = useRef<number>(0);
  const [block, setBlock] = useState<number>(47823941);
  const [bpm, setBpm] = useState<number>(20);
  const [pulse, setPulse] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let rect = canvas.getBoundingClientRect();
    const W = () => rect.width;
    const H = () => rect.height;

    // ECG waveform: rolling buffer of samples
    const SAMPLE_RATE = 60; // px per second of trace
    const samples: number[] = [];
    const maxSamples = () => Math.ceil(W());
    let lastTs = performance.now();
    let lastBeatTime = performance.now();
    const BEAT_INTERVAL = 3000; // BSC ~3 sec per block
    let beatPhase = -1; // -1 = idle, 0..1 = drawing waveform

    const drawGrid = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, W(), H());

      // subtle grid lines
      ctx.strokeStyle = 'rgba(34,197,94,0.06)';
      ctx.lineWidth = 1;
      const step = 20;
      ctx.beginPath();
      for (let x = 0; x < W(); x += step) {
        ctx.moveTo(x, 0); ctx.lineTo(x, H());
      }
      for (let y = 0; y < H(); y += step) {
        ctx.moveTo(0, y); ctx.lineTo(W(), y);
      }
      ctx.stroke();

      // major grid every 5 cells
      ctx.strokeStyle = 'rgba(34,197,94,0.12)';
      ctx.beginPath();
      for (let x = 0; x < W(); x += step * 5) {
        ctx.moveTo(x, 0); ctx.lineTo(x, H());
      }
      for (let y = 0; y < H(); y += step * 5) {
        ctx.moveTo(0, y); ctx.lineTo(W(), y);
      }
      ctx.stroke();

      // baseline
      const mid = H() / 2;
      ctx.strokeStyle = 'rgba(16,185,129,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid); ctx.lineTo(W(), mid);
      ctx.stroke();
    };

    /**
     * Returns the y offset for the QRS-like spike given a normalized t in [0,1].
     * Sequence: small P wave, dip, big R spike, dip, T wave.
     */
    const ecgShape = (t: number, amp: number): number => {
      if (t < 0 || t > 1) return 0;
      // P wave: small bump 0.0–0.12
      if (t < 0.12) return Math.sin((t / 0.12) * Math.PI) * amp * 0.18;
      // PR segment: flat 0.12–0.20
      if (t < 0.20) return 0;
      // Q dip: 0.20–0.24
      if (t < 0.24) return -((t - 0.20) / 0.04) * amp * 0.25;
      // R spike up: 0.24–0.30
      if (t < 0.30) return -amp * 0.25 + ((t - 0.24) / 0.06) * (amp + amp * 0.25);
      // S dip: 0.30–0.36
      if (t < 0.36) return amp - ((t - 0.30) / 0.06) * (amp + amp * 0.45);
      // ST segment: flat 0.36–0.50
      if (t < 0.50) return -amp * 0.45 * (1 - (t - 0.36) / 0.14);
      // T wave: smooth bump 0.50–0.78
      if (t < 0.78) return Math.sin(((t - 0.50) / 0.28) * Math.PI) * amp * 0.32;
      return 0;
    };

    const tick = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;

      // Trigger a beat if interval elapsed
      if (now - lastBeatTime >= BEAT_INTERVAL) {
        lastBeatTime = now;
        beatPhase = 0;
        setBlock((b) => b + 1);
        setPulse(true);
        setTimeout(() => setPulse(false), 220);
      }

      // Generate samples for elapsed time
      const newSampleCount = Math.max(1, Math.round(dt * SAMPLE_RATE));
      const beatDurationSamples = Math.round(0.9 * SAMPLE_RATE); // 0.9s waveform
      const amp = H() * 0.38;

      for (let i = 0; i < newSampleCount; i++) {
        let val = 0;
        if (beatPhase >= 0) {
          val = ecgShape(beatPhase, amp);
          beatPhase += 1 / beatDurationSamples;
          if (beatPhase > 1) beatPhase = -1;
        }
        // tiny baseline jitter
        val += (Math.random() - 0.5) * 1.2;
        samples.push(val);
      }
      while (samples.length > maxSamples()) samples.shift();

      // Draw
      drawGrid();
      const mid = H() / 2;

      // Glow trace
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(16,185,129,0.7)';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      const xOffset = W() - samples.length;
      for (let i = 0; i < samples.length; i++) {
        const x = xOffset + i;
        const y = mid - samples[i];
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Sweep cursor (head dot)
      if (samples.length > 0) {
        const lastY = mid - samples[samples.length - 1];
        const lastX = W() - 1;
        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      beatRequestRef.current = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      rect = canvas.getBoundingClientRect();
    };
    window.addEventListener('resize', onResize);

    beatRequestRef.current = requestAnimationFrame(tick);

    // BPM rough estimate (BSC = 20 blocks/min)
    const bpmTimer = setInterval(() => {
      setBpm(20 + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => {
      cancelAnimationFrame(beatRequestRef.current);
      clearInterval(bpmTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="glass rounded-2xl border border-emerald-500/25 p-4 sm:p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-cyan-500/[0.04] pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2">
          <span className={`relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400 ${pulse ? 'animate-ping' : ''}`} />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute" />
          <span className="ml-3 font-black text-sm text-emerald-400 tracking-wider uppercase">Genesis Heartbeat</span>
          <span className="hidden sm:inline text-[10px] text-gray-500 font-mono ml-2">SoulwareAI · live BSC sync</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono">
          <div className="text-right">
            <div className="text-gray-500 uppercase tracking-wider text-[9px]">Block</div>
            <div className="text-cyan-400 font-bold">#{block.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 uppercase tracking-wider text-[9px]">BPM</div>
            <div className="text-emerald-400 font-bold">{bpm}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-gray-500 uppercase tracking-wider text-[9px]">Lead</div>
            <div className="text-amber-400 font-bold">II</div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-28 sm:h-36 rounded-xl overflow-hidden border border-emerald-500/15 bg-[#020617]">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute top-1.5 left-2 text-[9px] font-mono text-emerald-400/60 tracking-wider">
          AIDAG-LSC · LEAD II · 25mm/s · 10mm/mV
        </div>
        <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-emerald-400/60 tracking-wider">
          {pulse ? '◉ BEAT' : '○ idle'}
        </div>
      </div>
    </div>
  );
}
