import './globals.css';
import { WalletProvider } from '../lib/WalletContext';
import { LanguageProvider } from '../lib/LanguageContext';
import WalletModal from '../components/WalletModal';
import SoulwareBootstrap from '../components/SoulwareBootstrap';

export const metadata = {
  title: 'AIDAG DAO — AI-Managed Decentralized Chain',
  description: "The world's first fully autonomous AI-managed cryptocurrency. SoulwareAI — AIDAG Chain's own brain & cell system — governs the chain. 21M fixed supply on BSC.",
  keywords: 'AIDAG, DAO, SoulwareAI, cryptocurrency, BSC, autonomous, AI blockchain, LSC Chain, DeepSea3474',
  openGraph: {
    title: 'AIDAG DAO — SoulwareAI Autonomous Chain',
    description: "First fully autonomous AI-managed cryptocurrency. SoulwareAI + DAO governance. Not OpenAI. Not any external AI.",
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#020617] text-white antialiased">
        <div id="__err_overlay" style={{display:'none',position:'fixed',top:0,left:0,right:0,zIndex:99999,background:'#dc2626',color:'#fff',padding:'12px 16px',fontFamily:'monospace',fontSize:'12px',whiteSpace:'pre-wrap',maxHeight:'50vh',overflow:'auto'}}></div>
        <script dangerouslySetInnerHTML={{__html:`
          (function(){
            var box=document.getElementById('__err_overlay');
            function show(m){if(!box)return;box.style.display='block';box.textContent=(box.textContent?box.textContent+'\\n---\\n':'')+m;}
            window.addEventListener('error',function(e){show('ERROR: '+(e.message||'')+' @ '+(e.filename||'')+':'+(e.lineno||'')+'\\n'+(e.error&&e.error.stack||''));});
            window.addEventListener('unhandledrejection',function(e){show('PROMISE: '+(e.reason&&(e.reason.stack||e.reason.message)||String(e.reason)));});
          })();
        `}} />
        <LanguageProvider>
          <WalletProvider>
            <SoulwareBootstrap />
            {children}
            <WalletModal />
          </WalletProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
