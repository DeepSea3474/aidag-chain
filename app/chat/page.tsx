'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface MessageMeta {
  phase?: number;
  own_knowledge_used?: boolean;
  cell?: string;
  live_data?: boolean;
  bnbPrice?: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
  meta?: MessageMeta;
}

const SUGGESTIONS = [
  'AIDAG token nedir ve nasıl satın alırım?',
  'What is SoulwareAI and who owns it?',
  'LSC Coin ne zaman çıkacak?',
  'How does the DAO governance work?',
  'What is the max supply of AIDAG?',
  'SoulwareAI hücreleri nelerdir?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '⚡ Merhaba! Ben **SoulwareAI** — AIDAG Chain\'in özerk beyin & hücre sistemi. AIDAG Token, LSC Coin, DAO yönetişimi veya ekosisteminiz hakkında her şeyi sorun.\n\nHello! I\'m **SoulwareAI** — the proprietary autonomous brain of AIDAG Chain. Ask me anything about AIDAG Token, LSC Coin, DAO governance, or the ecosystem.',
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError('');

    const userMsg: Message = { role: 'user', content: text.trim(), ts: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, ts: Date.now(), meta: data.meta },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Connection error';
      setError(msg);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-700 text-cyan-300 px-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#020617]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              ← Ana Sayfa
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                  S
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#020617]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-none">SoulwareAI</p>
                <p className="text-xs text-green-400 leading-none mt-0.5">Online · AIDAG Chain Brain</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:block">gpt-4.1 powered</span>
            <span className="text-xs bg-purple-900/40 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded-full">
              AIDAG Chain
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {msg.role === 'assistant' ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  S
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs shrink-0 mt-1">
                  👤
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-sm'
                    : 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-tr-sm'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <span dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                ) : (
                  msg.content
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <p className={`text-xs ${msg.role === 'assistant' ? 'text-slate-500' : 'text-cyan-200/60'}`}>
                    {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {msg.role === 'assistant' && msg.meta && (
                    <>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                        msg.meta.own_knowledge_used
                          ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-800/50'
                          : 'bg-slate-700/50 text-slate-400'
                      }`}>
                        ⚡ {msg.meta.cell ?? 'Core Brain'}
                      </span>
                      {msg.meta.live_data && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-900/40 text-green-400 border border-green-800/40 font-mono">
                          📡 canlı veri
                        </span>
                      )}
                      <span className="text-xs text-slate-600 font-mono">
                        Faz {msg.meta.phase ?? 1}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                S
              </div>
              <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-800/50 text-red-300 rounded-xl px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Suggestions (shown only at start) */}
      {messages.length === 1 && (
        <div className="max-w-4xl mx-auto w-full px-4 pb-4">
          <p className="text-xs text-slate-500 mb-2 font-mono">— Hızlı sorular / Quick questions —</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-700 text-slate-300 hover:text-cyan-300 rounded-full px-3 py-1.5 transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-800 bg-[#020617]/95 backdrop-blur">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end bg-slate-800/60 border border-slate-700 hover:border-slate-600 focus-within:border-cyan-700 rounded-2xl px-4 py-3 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="SoulwareAI'ye sorun... / Ask SoulwareAI..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none outline-none text-sm leading-relaxed max-h-40"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 160) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shrink-0"
              aria-label="Send"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">
            SoulwareAI · AIDAG Chain&apos;in özerk zekası · Enter ile gönderin
          </p>
        </form>
      </div>
    </div>
  );
}
