import { decide, type Decision } from './decision.js';
import { freeze, hash, hasKeys, integer, isHash, isRecord } from './hash.js';
import { isObservation, observationHash, validateObservation, type Observation } from './observation.js';
import { policyHash, type Policy } from './policy.js';
import { createProof, isProof, verifyProof, type ProofEnvelope } from './proof.js';

export interface Transition {
  readonly version: 1;
  readonly id: string;
  readonly sequence: number;
  readonly timestamp: number;
  readonly previousHash: string | null;
  readonly observation: Observation;
  readonly observationHash: string;
  readonly policyHash: string;
  readonly decision: Decision;
  readonly transitionHash: string;
  readonly proof: ProofEnvelope;
  readonly blockHash: string;
}
export interface ValidationContext { readonly policy: Policy; readonly previous: Transition | null }
export interface ValidationResult { readonly valid: boolean; readonly errors: readonly string[] }
type Body = Pick<Transition, 'version' | 'id' | 'sequence' | 'timestamp' | 'previousHash' | 'observationHash' | 'policyHash' | 'decision'>;
const body = (t: Body): Body => ({ version: t.version, id: t.id, sequence: t.sequence, timestamp: t.timestamp, previousHash: t.previousHash, observationHash: t.observationHash, policyHash: t.policyHash, decision: t.decision });
export const transitionHash = (t: Body): string => hash('nyvra/transition/v1', body(t));
export const blockHash = (t: Pick<Transition, 'transitionHash' | 'proof'>): string => hash('nyvra/block/v1', { transitionHash: t.transitionHash, proof: t.proof });

export function isTransition(value: unknown): value is Transition {
  return isRecord(value) && hasKeys(value, ['version', 'id', 'sequence', 'timestamp', 'previousHash', 'observation', 'observationHash', 'policyHash', 'decision', 'transitionHash', 'proof', 'blockHash']) && value.version === 1 && integer(value.sequence, 1) && value.id === `block-${String(value.sequence).padStart(6, '0')}` && integer(value.timestamp, 0, 8_640_000_000_000_000) && (value.previousHash === null || isHash(value.previousHash)) && isObservation(value.observation) && isHash(value.observationHash) && isHash(value.policyHash) && (value.decision === 'HOLD' || value.decision === 'STRIKE') && isHash(value.transitionHash) && isProof(value.proof) && isHash(value.blockHash);
}

/** The context must be the locally pinned policy and an already accepted tip. */
export function validateTransition(candidate: unknown, context: ValidationContext): ValidationResult {
  if (!isTransition(candidate)) return { valid: false, errors: ['INVALID_STRUCTURE'] };
  const t = candidate, previous = context.previous, errors: string[] = [];
  if (!validateObservation(t.observation) || t.observationHash !== observationHash(t.observation)) errors.push('OBSERVATION_COMMITMENT');
  if (t.policyHash !== policyHash(context.policy)) errors.push('POLICY_MISMATCH');
  if (t.sequence !== (previous?.sequence ?? 0) + 1 || t.observation.sequence !== t.sequence) errors.push('SEQUENCE_MISMATCH');
  if (t.timestamp !== t.observation.timestamp || (previous !== null && t.timestamp <= previous.timestamp)) errors.push('TIMESTAMP_ORDER');
  if (t.previousHash !== (previous?.blockHash ?? null)) errors.push('PREVIOUS_HASH_MISMATCH');
  try { if (t.decision !== decide({ observation: t.observation, policy: context.policy }).decision) errors.push('DECISION_MISMATCH'); }
  catch { errors.push('OBSERVATION_DOMAIN'); }
  const commitment = transitionHash(t);
  if (t.transitionHash !== commitment) errors.push('TRANSITION_HASH_MISMATCH');
  if (!verifyProof(t.proof, commitment)) errors.push('INVALID_SIMULATION_PROOF');
  if (t.blockHash !== blockHash(t)) errors.push('BLOCK_HASH_MISMATCH');
  return { valid: errors.length === 0, errors };
}

export function createTransition(observation: Observation, context: ValidationContext): Transition {
  const decision = decide({ observation, policy: context.policy });
  const value = { version: 1 as const, id: `block-${String(observation.sequence).padStart(6, '0')}`, sequence: observation.sequence, timestamp: observation.timestamp, previousHash: context.previous?.blockHash ?? null, ...decision };
  const commitment = transitionHash(value), proof = createProof(commitment);
  const result: Transition = { ...value, observation: structuredClone(observation), transitionHash: commitment, proof, blockHash: blockHash({ transitionHash: commitment, proof }) };
  const validation = validateTransition(result, context);
  if (!validation.valid) throw new Error(validation.errors.join(', '));
  return freeze(result);
}
