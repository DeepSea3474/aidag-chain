'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ background: '#020617', color: '#fff', fontFamily: 'monospace', padding: 20, margin: 0 }}>
        <div style={{ background: '#dc2626', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 18 }}>CLIENT ERROR</h1>
        </div>
        <div style={{ background: '#1e293b', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.5, wordBreak: 'break-word' }}>
          <div style={{ color: '#fbbf24', marginBottom: 8 }}>name: {error.name}</div>
          <div style={{ color: '#fbbf24', marginBottom: 8 }}>message: {error.message}</div>
          <div style={{ color: '#fbbf24', marginBottom: 8 }}>digest: {error.digest || '(none)'}</div>
          <div style={{ color: '#94a3b8', marginTop: 12, fontSize: 11 }}>{error.stack}</div>
        </div>
        <button onClick={() => reset()} style={{ marginTop: 16, padding: '10px 20px', background: '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>Retry</button>
      </body>
    </html>
  );
}
