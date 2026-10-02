import { hash, hasKeys, integer, isHash, isRecord } from './hash.js';

export interface Observation {
  readonly id: string;
  readonly sequence: number;
  readonly timestamp: number;
  readonly source: 'SIMULATION';
  readonly state: { readonly score: number; readonly signal: string; readonly seed: number };
  readonly stateHash: string;
}
export function isObservation(value: unknown): value is Observation {
  if (!isRecord(value) || !hasKeys(value, ['id', 'sequence', 'timestamp', 'source', 'state', 'stateHash'])) return false;
  const state = value.state;
  return integer(value.sequence, 1) && value.id === `obs-${String(value.sequence).padStart(6, '0')}` && integer(value.timestamp, 0, 8_640_000_000_000_000) && value.source === 'SIMULATION' && isHash(value.stateHash) && isRecord(state) && hasKeys(state, ['score', 'signal', 'seed']) && integer(state.score, 0, 999_999) && typeof state.signal === 'string' && state.signal.length > 0 && state.signal.length <= 200 && integer(state.seed, 0, 4_294_967_295);
}
export const stateHash = (state: Observation['state']): string => hash('nyvra/observation-state/v1', state);
export const observationHash = (observation: Observation): string => hash('nyvra/observation/v1', observation);
export function validateObservation(value: unknown): value is Observation {
  return isObservation(value) && value.stateHash === stateHash(value.state);
}
