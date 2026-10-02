import { hash, hasKeys, isHash, isRecord } from './hash.js';

/** Public integrity checksum. Not a signature, ZK proof or authorization. */
export interface ProofEnvelope {
  readonly scheme: 'SIMULATION';
  readonly version: 1;
  readonly transitionHash: string;
  readonly proofHash: string;
  readonly valid: boolean;
}
export function isProof(value: unknown): value is ProofEnvelope {
  return isRecord(value) && hasKeys(value, ['scheme', 'version', 'transitionHash', 'proofHash', 'valid']) && value.scheme === 'SIMULATION' && value.version === 1 && isHash(value.transitionHash) && isHash(value.proofHash) && typeof value.valid === 'boolean';
}
export function createProof(transitionHash: string): ProofEnvelope {
  if (!isHash(transitionHash)) throw new TypeError('Invalid transition hash.');
  const statement = { scheme: 'SIMULATION' as const, version: 1 as const, transitionHash };
  return Object.freeze({ ...statement, proofHash: hash('nyvra/simulation-proof/v1', statement), valid: true });
}
export function verifyProof(value: unknown, expectedTransitionHash: string): boolean {
  return isProof(value) && value.valid === true && value.transitionHash === expectedTransitionHash && value.proofHash === createProof(expectedTransitionHash).proofHash;
}
