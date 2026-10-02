import { freeze, integer } from '../core/hash.js';
import { stateHash, type Observation } from '../core/observation.js';
export const GENESIS_TIMESTAMP = Date.parse('2026-10-01T00:00:00.000Z');
export const INTERVAL_MS = 12_000;
const SIGNALS = ['quiet order flow', 'market volatility detected', 'liquidity anomaly', 'spread within range', 'observation window closed'] as const;

export function createObservation(sequence: number, seed = 0): Observation {
  if (!integer(sequence, 1, 1_000_000) || !integer(seed, 0, 4_294_967_295)) throw new RangeError('Sequence must be 1..1000000 and seed must be uint32.');
  const phase = sequence + seed;
  const state = { score: phase % 45 === 20 ? 975 + phase % 22 : (sequence * 37 + 17 + seed) % 975, signal: SIGNALS[sequence % SIGNALS.length]!, seed };
  return freeze({ id: `obs-${String(sequence).padStart(6, '0')}`, sequence, timestamp: GENESIS_TIMESTAMP + sequence * INTERVAL_MS, source: 'SIMULATION' as const, state, stateHash: stateHash(state) });
}
