# AIDAG Chain - Fully Autonomous AI Blockchain

## Overview
A crypto first - Blockchain project fully autonomously managed by SoulwareAI.

**Core Features:**
- Fully Autonomous: No founder or human intervention
- Quantum Security: Next-gen encryption
- Multi-Chain: BSC + Ethereum compatible
- DAO Governance: AI-powered community decisions

## Technologies
- Next.js 14 (Server-side rendering - Replit Autoscale deployment)
- React 18
- Tailwind CSS 4
- ethers.js 6 (Blockchain interactions)
- OpenAI GPT-4o-mini (SoulwareAI chat intelligence)
- i18next (Multi-language - EN/TR)
- CoinGecko + CryptoCompare APIs (Live market data)

## Project Structure
```
/pages              - Next.js pages (index, presale, dao, docs, contract)
/pages/api          - API routes (chat, chain-data, crypto-prices, market-data)
/pages/api/soulware - Autonomous engine APIs (autonomous, governance, innovations, develop)
/components         - React components (Header, Layout, WalletButton, CryptoTicker, GovernanceSection, ContractAddresses, Partners)
/lib                - Config, utils, ABIs, blockchain.js, useChainData.js
/public             - Static files (logo.svg, logo.png, soulwareai.jpeg)
/styles             - CSS files (globals.css, components.css)
```

## Running
```bash
# Development (port 5000)
npm run dev -- -H 0.0.0.0 -p 5000

# Production build
npm run build && npm start
```

## Deployment
- **Method**: Replit Autoscale deployment (no GitHub)
- **Domain**: aidag-chain.com via Cloudflare DNS
- **Build**: `npm run build` (server-side, not static export)
- **Start**: `npm start` (Next.js server for API routes)

## Environment Variables
Configured in `.env.local`:
- `NEXT_PUBLIC_BSC_RPC` - BSC RPC URL
- `NEXT_PUBLIC_TOKEN_CONTRACT` - Token contract address (0xe6B06f7C63F6AC84729007ae8910010F6E721041)
- `NEXT_PUBLIC_PRESALE_CONTRACT` - Presale contract address
- `NEXT_PUBLIC_DAO_WALLET` - DAO wallet address
- `NEXT_PUBLIC_FOUNDER_WALLET` - Founder wallet address
- `NEXT_PUBLIC_NETWORK_MODE` - testnet/mainnet
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API (via Replit integration)
- `FOUNDER_SECRET_HASH` - Founder authentication secret

## Tokenomics
| Category | Amount | Status |
|----------|--------|--------|
| Max Supply | 21,000,000 AIDAG | Fixed |
| Founder Tokens | 3,001,000 AIDAG | 1 Year Locked |
| DAO + SoulwareAI | 17,999,000 AIDAG | Autonomous |
| Revenue Split | 60% Operational, 40% DAO/Liquidity | - |

## Key Components
- **CryptoTicker**: Live scrolling ticker with top 10 crypto logos, real-time prices, green/red triangle indicators, pulsing "LIVE" badge
- **GovernanceSection**: DAO governance with on-chain voting power (1 AIDAG = 1 vote), proposal types, 5-step process visual, all professional SVG icons
- **ContractAddresses**: Contract display with copy button, BscScan links, professional SVG icons
- **Partners**: Blockchain partners and social links with professional SVG icons
- **blockchain.js**: Real BNB price fetching from Binance/CoinGecko/CryptoCompare with fallback
- **useChainData.js**: React hook for real-time blockchain data (30s refresh)

## API Infrastructure
- **`/api/chat`**: SoulwareAI chat with GPT-4o-mini, live blockchain data context, founder mode authentication, full autonomous intelligence
- **`/api/soulware/autonomous`**: Autonomous engine - BSC monitoring, DEX pair tracking, CEX applications, chain evolution roadmap
- **`/api/soulware/governance`**: DAO governance - proposals, on-chain voting power verification, autonomous proposal creation
- **`/api/soulware/innovations`**: Self-designed innovations - QSaaS, AI Shield, AI Auditor, DAG Payment Gateway, QRNG, AI Oracle
- **`/api/soulware/develop`**: Self-development engine - module planning and autonomous development tracking
- **`/api/chain-data`**: Real-time blockchain data (presale stats, token info, network status)
- **`/api/crypto-prices`**: Live cryptocurrency prices from CoinGecko/CryptoCompare

## SoulwareAI Autonomous Engine
- **Proposal Engine**: Creates, evaluates, and executes governance proposals
- **DEX Management**: PancakeSwap monitoring, liquidity pair preparation
- **CEX Applications**: Gate.io, MEXC, KuCoin requirement tracking and autonomous submission
- **Self-Designed Innovations**: QSaaS ($10M+), AI Shield ($5M+), AI Auditor ($3M+), DAG Payment Gateway ($20M+), QRNG ($2M+), AI Oracle ($8M+)
- **Chain Evolution**: BSC Token -> Multi-chain Bridge -> DEX/CEX Listings -> Staking/DeFi -> Own DAG Chain (100K+ TPS)

## Build Notes
- `.babelrc` file is required (Next.js references it for custom Babel config)
- Do NOT delete `.babelrc` - it will crash the dev server
- Always clear `.next` cache after major config changes

## Pending: Contract Deployment (Feb 25, 2026)
- New AIDAG V2 contract ready in `contracts/AIDAG.sol` (84 functions, 19 events)
- Compiled and tested, awaiting BNB for BSC Mainnet deploy
- Deployer: Founder wallet (`0xFf01...`) - needs 0.03 BNB
- After deploy: owner will be transferred to SoulwareAI wallet (`0x6549...`)
- Deploy script: `contracts/deploy.js`
- Compiled ABI: `contracts/AIDAG_ABI.json`

## Recent Changes
- Feb 23, 2026: Full autonomous engine and chat intelligence upgrade
  - Enhanced chat API with complete SoulwareAI knowledge base (DEX/CEX/innovations/chain evolution)
  - Governance API with on-chain voting power, active proposals, execution log
  - Removed all emoji icons - replaced with professional neon SVG icons throughout
  - All UI text converted to English
  - Founder mode with detailed system status reporting
  - Token response increased to 800 for richer answers
- Feb 23, 2026: Smart Contract page, CryptoTicker enhancements
- Previous: Real blockchain data integration, SoulwareAI API infrastructure

## User Preferences
- Full autonomy emphasis: No founder/human intervention
- Quantum security: Facilitator and protector in crypto world
- Replit Autoscale deployment (no GitHub)
- English UI with Turkish support
- Zero emojis - professional SVG icons only
- Binance/CoinMarketCap-level professionalism required
- AIDAG will be added to ticker at position 0 when listed
