'use client';

let modal = null;

export async function initWeb3Modal() {
  if (typeof window === 'undefined') return null;
  if (modal) return modal;

  try {
    const { createAppKit, walletConnect } = await import('@reown/appkit');

    const projectId = '1d3b7fb8b050f6ffb48a3b3df1658b06';

    modal = createAppKit({
      adapters: [walletConnect({ projectId })],
      networks: [
        {
          chainId: 56,
          name: 'BNB Smart Chain',
          currency: 'BNB',
          explorerUrl: 'https://bscscan.com',
          rpcUrl: 'https://bsc-dataseed1.binance.org'
        }
      ],
      metadata: {
        name: 'AIDAG Chain',
        description: 'First AI-Managed Cryptocurrency',
        url: window.location.origin,
        icons: ['/aidag-logo.jpg']
      },
      projectId,
      features: { analytics: false },
      themeMode: 'dark'
    });
  } catch (err) {
    console.error('Web3Modal init error:', err);
  }

  return modal;
}

export async function openWeb3Modal() {
  const m = await initWeb3Modal();
  if (m) m.open();
}

export async function closeWeb3Modal() {
  const m = await initWeb3Modal();
  if (m) m.close();
}
