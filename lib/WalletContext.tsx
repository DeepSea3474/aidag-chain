'use client';
/**
 * ══════════════════════════════════════════════════════════════
 *  AIDAG Chain — Global Wallet Context
 *  Direct wallet connection: MetaMask · Trust · Coinbase ·
 *  WalletConnect · Binance Web3 · OKX
 *  After permission + AIDAG Chain signature → autonomous connect
 * ══════════════════════════════════════════════════════════════
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ── Constants ─────────────────────────────────────────────────
const TOKEN_CONTRACT  = '0xe6B06f7C63F6AC84729007ae8910010F6E721041';
const FOUNDER_WALLET  = '0x2F3b33EDAEc10e94eDFA6B59F27a4adAb6bE26aB';
const BSC_CHAIN_ID    = 56;
const BSC_CHAIN_HEX   = '0x38';
const BSC_RPC         = 'https://bsc-dataseed1.binance.org';
const REOWN_PROJECT_ID = '1d3b7fb8b050f6ffb48a3b3df1658b06';

const BSC_NETWORK_PARAMS = {
  chainId: BSC_CHAIN_HEX,
  chainName: 'BNB Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: ['https://bsc-dataseed1.binance.org', 'https://bsc-dataseed2.binance.org'],
  blockExplorerUrls: ['https://bscscan.com'],
};

// ── AIDAG Chain sign message ──────────────────────────────────
function buildSignMessage(address: string): string {
  return [
    '══════════════════════════════════════',
    '  AIDAG Chain — SoulwareAI Connection',
    '══════════════════════════════════════',
    '',
    'Welcome to AIDAG Chain.',
    '',
    'You are connecting your wallet to the',
    'SoulwareAI autonomous ecosystem.',
    '',
    'This signature grants READ access to',
    'your on-chain AIDAG balance and enables',
    'participation in presale and DAO governance.',
    '',
    'No tokens will be transferred by this signature.',
    '',
    `Wallet:    ${address}`,
    `Chain:     BSC (Chain ID: 56)`,
    `Network:   BNB Smart Chain`,
    `Protocol:  SoulwareAI v1.0.0`,
    `Timestamp: ${new Date().toISOString()}`,
    '',
    'Owner: AIDAG Chain & DeepSea3474',
    '══════════════════════════════════════',
  ].join('\n');
}

// ── RPC helpers ───────────────────────────────────────────────
async function rpcCall(method: string, params: unknown[]): Promise<string> {
  const res = await fetch(BSC_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
    signal: AbortSignal.timeout(6000),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result as string;
}

async function fetchBnbBalance(addr: string): Promise<string> {
  try {
    const hex = await rpcCall('eth_getBalance', [addr, 'latest']);
    return (Number(BigInt(hex)) / 1e18).toFixed(4);
  } catch { return '0.0000'; }
}

async function fetchAidagBalance(addr: string): Promise<string> {
  try {
    const data = '0x70a08231' + addr.slice(2).padStart(64, '0');
    const hex = await rpcCall('eth_call', [{ to: TOKEN_CONTRACT, data }, 'latest']);
    if (!hex || hex === '0x') return '0';
    return (Number(BigInt(hex)) / 1e18).toLocaleString('en-US', { maximumFractionDigits: 4 });
  } catch { return '0'; }
}

async function fetchAidagBalanceRaw(addr: string): Promise<bigint> {
  try {
    const data = '0x70a08231' + addr.slice(2).padStart(64, '0');
    const hex = await rpcCall('eth_call', [{ to: TOKEN_CONTRACT, data }, 'latest']);
    if (!hex || hex === '0x') return 0n;
    return BigInt(hex);
  } catch { return 0n; }
}

// ── Types ─────────────────────────────────────────────────────
export type WalletType = 'metamask' | 'trust' | 'coinbase' | 'walletconnect' | 'binance' | 'okx' | 'injected';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  bnbBalance: string | null;
  aidagBalance: string | null;
  aidagBalanceRaw: bigint;
  isConnected: boolean;
  isConnecting: boolean;
  isSigning: boolean;
  isSigned: boolean;          // signed AIDAG Chain auth message
  walletType: WalletType | null;
  signature: string | null;
  error: string | null;
  modalOpen: boolean;
}

export interface WalletContextValue extends WalletState {
  openModal: () => void;
  closeModal: () => void;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  switchToBSC: () => Promise<void>;
  sendPresaleTx: (bnbAmount: string) => Promise<string>;
}

// ── Context ───────────────────────────────────────────────────
const WalletCtx = createContext<WalletContextValue | null>(null);

export function useWalletContext(): WalletContextValue {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error('useWalletContext must be used inside <WalletProvider>');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null, chainId: null, bnbBalance: null, aidagBalance: null,
    aidagBalanceRaw: 0n, isConnected: false, isConnecting: false,
    isSigning: false, isSigned: false, walletType: null,
    signature: null, error: null, modalOpen: false,
  });

  const merge = useCallback((patch: Partial<WalletState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  // ── Get ethereum provider based on wallet type ─────────────
  const getProvider = useCallback((type: WalletType): any => {
    if (typeof window === 'undefined') return null;
    const eth = (window as any).ethereum;
    if (!eth) return null;

    switch (type) {
      case 'metamask':
        if (eth.providers) return eth.providers.find((p: any) => p.isMetaMask && !p.isBraveWallet) ?? eth;
        return eth.isMetaMask ? eth : null;
      case 'coinbase':
        if (eth.providers) return eth.providers.find((p: any) => p.isCoinbaseWallet) ?? null;
        return eth.isCoinbaseWallet ? eth : null;
      case 'binance':
        if (eth.providers) return eth.providers.find((p: any) => p.isBinance || p.isBinanceSmartChain) ?? null;
        return (eth.isBinance || eth.isBinanceSmartChain) ? eth : null;
      case 'okx':
        if (eth.providers) return eth.providers.find((p: any) => p.isOKExWallet || p.isOkxWallet) ?? null;
        return (eth.isOKExWallet || eth.isOkxWallet) ? eth : null;
      case 'trust':
        if (eth.providers) return eth.providers.find((p: any) => p.isTrust) ?? null;
        return eth.isTrust ? eth : null;
      default:
        return eth;
    }
  }, []);

  // ── Switch to BSC ─────────────────────────────────────────
  const switchToBSC = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) return;
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BSC_CHAIN_HEX }] });
    } catch (err: any) {
      if (err.code === 4902) {
        await eth.request({ method: 'wallet_addEthereumChain', params: [BSC_NETWORK_PARAMS] });
      }
    }
  }, []);

  // ── Request signature = AIDAG Chain auth ───────────────────
  const requestSignature = useCallback(async (provider: any, address: string): Promise<string> => {
    const message = buildSignMessage(address);
    const hexMsg = '0x' + Array.from(new TextEncoder().encode(message))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    return await provider.request({ method: 'personal_sign', params: [hexMsg, address] });
  }, []);

  // ── Refresh balances ──────────────────────────────────────
  const refreshBalances = useCallback(async () => {
    if (!state.address) return;
    const [bnb, aidag, aidagRaw] = await Promise.all([
      fetchBnbBalance(state.address),
      fetchAidagBalance(state.address),
      fetchAidagBalanceRaw(state.address),
    ]);
    merge({ bnbBalance: bnb, aidagBalance: aidag, aidagBalanceRaw: aidagRaw });
  }, [state.address, merge]);

  // ── Finalize: switch chain → sign → balances ──────────────
  const finalizeConnection = useCallback(async (provider: any, rawAddress: string, type: WalletType) => {
    const address = rawAddress.toLowerCase();

    try {
      const currentChain: string = await provider.request({ method: 'eth_chainId' });
      if (parseInt(currentChain, 16) !== BSC_CHAIN_ID) {
        try {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BSC_CHAIN_HEX }] });
        } catch (switchErr: any) {
          if (switchErr.code === 4902) {
            await provider.request({ method: 'wallet_addEthereumChain', params: [BSC_NETWORK_PARAMS] });
          }
        }
      }
    } catch {}

    merge({ isSigning: true });
    let signature = '';
    try {
      signature = await requestSignature(provider, address);
    } catch (sigErr: any) {
      // signature optional on WC flows where some wallets reject silently — keep going
      console.warn('Signature skipped:', sigErr?.message);
    }

    const [bnb, aidag, aidagRaw] = await Promise.all([
      fetchBnbBalance(address),
      fetchAidagBalance(address),
      fetchAidagBalanceRaw(address),
    ]);

    merge({
      address, chainId: BSC_CHAIN_ID, walletType: type,
      bnbBalance: bnb, aidagBalance: aidag, aidagBalanceRaw: aidagRaw,
      isConnected: true, isConnecting: false, isSigning: false,
      isSigned: !!signature, signature: signature || null, error: null,
    });
  }, [merge, requestSignature]);

  // ── Core connect flow ─────────────────────────────────────
  const connect = useCallback(async (type: WalletType) => {
    merge({ isConnecting: true, error: null, modalOpen: false });

    try {
      const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const injected = getProvider(type) ?? (window as any).ethereum;

      // Route to WalletConnect when:
      //  • user explicitly chose WalletConnect, OR
      //  • we're on mobile without an injected provider (regular Chrome/Safari)
      const useWalletConnect = type === 'walletconnect' || (isMobile && !injected);

      if (useWalletConnect) {
        const { connectViaWalletConnect } = await import('./web3modal');
        const result = await connectViaWalletConnect();
        if (!result || !result.address) {
          merge({ isConnecting: false });
          return;
        }
        const wcProvider = result.provider ?? (window as any).ethereum;
        if (!wcProvider) throw new Error('WalletConnect provider unavailable');
        await finalizeConnection(wcProvider, result.address, type === 'walletconnect' ? 'walletconnect' : type);
        return;
      }

      // Desktop + no injected provider → install pages
      if (!injected) {
        const installUrls: Record<string, string> = {
          metamask: 'https://metamask.io/download/',
          coinbase:  'https://www.coinbase.com/wallet/downloads',
          binance:   'https://www.binance.com/en/web3wallet',
          okx:       'https://www.okx.com/web3',
          trust:     'https://trustwallet.com/download',
        };
        if (installUrls[type]) window.open(installUrls[type], '_blank');
        merge({ isConnecting: false, error: `${type} wallet not found. Please install it.` });
        return;
      }

      // Direct EIP-1193 (injected/extension/in-app browser)
      const accounts: string[] = await injected.request({ method: 'eth_requestAccounts' });
      if (!accounts.length) throw new Error('No accounts returned');
      await finalizeConnection(injected, accounts[0], type);

    } catch (err: any) {
      const msg = err?.message || 'Connection failed';
      merge({ isConnecting: false, isSigning: false, error: msg.includes('rejected') ? 'Signature rejected. Please approve to connect.' : msg });
    }
  }, [getProvider, finalizeConnection, merge]);

  // ── Disconnect ────────────────────────────────────────────
  const disconnect = useCallback(() => {
    setState({
      address: null, chainId: null, bnbBalance: null, aidagBalance: null,
      aidagBalanceRaw: 0n, isConnected: false, isConnecting: false,
      isSigning: false, isSigned: false, walletType: null,
      signature: null, error: null, modalOpen: false,
    });
  }, []);

  // ── Send presale BNB transaction ──────────────────────────
  const sendPresaleTx = useCallback(async (bnbAmount: string): Promise<string> => {
    const provider = (window as any).ethereum;
    if (!provider || !state.address) throw new Error('Wallet not connected');

    const weiHex = '0x' + BigInt(Math.round(parseFloat(bnbAmount) * 1e18)).toString(16);

    const txHash: string = await provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: state.address,
        to: FOUNDER_WALLET,
        value: weiHex,
        gas: '0x5208',       // 21000
        chainId: BSC_CHAIN_HEX,
      }],
    });
    return txHash;
  }, [state.address]);

  // ── Listen for account/chain changes ─────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const eth = (window as any).ethereum;
    if (!eth) return;

    const onAccounts = (accounts: string[]) => {
      if (!accounts.length) disconnect();
      else merge({ address: accounts[0].toLowerCase() });
    };
    const onChain = (chainId: string) => {
      merge({ chainId: parseInt(chainId, 16) });
    };

    eth.on('accountsChanged', onAccounts);
    eth.on('chainChanged', onChain);

    // Auto-detect if already connected (no popup)
    eth.request({ method: 'eth_accounts' }).then((accs: string[]) => {
      if (accs.length && state.address === null) {
        // Already had a session — re-hydrate silently (no signature needed)
        const addr = accs[0].toLowerCase();
        Promise.all([fetchBnbBalance(addr), fetchAidagBalance(addr), fetchAidagBalanceRaw(addr)])
          .then(([bnb, aidag, raw]) => {
            merge({
              address: addr, chainId: BSC_CHAIN_ID,
              bnbBalance: bnb, aidagBalance: aidag, aidagBalanceRaw: raw,
              isConnected: true, isSigned: false,
            });
          });
      }
    }).catch(() => {});

    return () => {
      eth.removeListener('accountsChanged', onAccounts);
      eth.removeListener('chainChanged', onChain);
    };
  }, []); // eslint-disable-line

  const value: WalletContextValue = {
    ...state,
    openModal: () => merge({ modalOpen: true, error: null }),
    closeModal: () => merge({ modalOpen: false, error: null }),
    connect,
    disconnect,
    refreshBalances,
    switchToBSC,
    sendPresaleTx,
  };

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}
