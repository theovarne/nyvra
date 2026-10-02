import { freeze, hash, hasKeys, integer, isRecord } from './hash.js';

export interface Policy {
  readonly name: 'M';
  readonly version: 1;
  readonly threshold: number;
  readonly modulus: number;
}

export const DEFAULT_POLICY: Readonly<Policy> = freeze({ name: 'M', version: 1, threshold: 975, modulus: 997 } as const);
export function isPolicy(value: unknown): value is Policy {
  return isRecord(value) && hasKeys(value, ['name', 'version', 'threshold', 'modulus']) && value.name === 'M' && value.version === 1 && integer(value.modulus, 2, 1_000_000) && integer(value.threshold, 1, value.modulus - 1);
}
export function policyHash(policy: Policy): string {
  if (!isPolicy(policy)) throw new TypeError('Invalid policy.');
  return hash('nyvra/policy/v1', policy);
}
