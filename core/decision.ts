import { observationHash, validateObservation, type Observation } from './observation.js';
import { policyHash, type Policy } from './policy.js';

export type Decision = 'HOLD' | 'STRIKE';
export interface DecisionInput { readonly observation: Observation; readonly policy: Policy }
export interface DecisionResult { readonly decision: Decision; readonly observationHash: string; readonly policyHash: string }

export function decide({ observation, policy }: DecisionInput): DecisionResult {
  const commitment = policyHash(policy);
  if (!validateObservation(observation) || observation.state.score >= policy.modulus) throw new TypeError('Observation is invalid or its score lies outside the policy domain.');
  return Object.freeze({ decision: observation.state.score >= policy.threshold ? 'STRIKE' : 'HOLD', observationHash: observationHash(observation), policyHash: commitment });
}
