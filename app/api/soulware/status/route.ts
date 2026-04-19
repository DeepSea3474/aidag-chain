import { NextResponse } from 'next/server';
import { runAllCells, calculateEvolutionScore } from '../../../../lib/soulware-autonomous';
import { BRAIN_STATE, CORE_KNOWLEDGE } from '../../../../lib/soulware-knowledge-base';

export async function GET() {
  try {
    // Fetch live BSC data
    let bnbPrice = 600;
    let blockNumber = 40000000;
    let gasPrice = '5 Gwei';

    try {
      const [priceRes, blockRes] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT', {
          signal: AbortSignal.timeout(3000),
          next: { revalidate: 30 },
        }),
        fetch('https://bsc-dataseed1.binance.org', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
          signal: AbortSignal.timeout(3000),
        }),
      ]);
      if (priceRes.ok) {
        const p = await priceRes.json();
        bnbPrice = parseFloat(p.price) || 600;
      }
      if (blockRes.ok) {
        const b = await blockRes.json();
        blockNumber = parseInt(b.result, 16) || 40000000;
        gasPrice = '3 Gwei';
      }
    } catch { /* use defaults */ }

    const { decisions, lscLog, marketSignal } = runAllCells(blockNumber, bnbPrice);
    const evolutionScore = calculateEvolutionScore(
      BRAIN_STATE.autonomous_decisions + decisions.length,
      CORE_KNOWLEDGE.length,
      lscLog.nodes_built
    );

    return NextResponse.json({
      brain: {
        ...BRAIN_STATE,
        evolution_score: evolutionScore,
        knowledge_nodes: CORE_KNOWLEDGE.length,
        autonomous_decisions: BRAIN_STATE.autonomous_decisions + decisions.length,
        cells_active: 6,
        last_evolution: Date.now(),
      },
      live: {
        bnbPrice,
        blockNumber,
        gasPrice,
        aidagPriceUSD: 0.078,
        aidagPriceBNB: (0.078 / bnbPrice).toFixed(6),
      },
      decisions,
      lscLog,
      marketSignal,
      timestamp: Date.now(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'SoulwareAI status unavailable' }, { status: 500 });
  }
}
