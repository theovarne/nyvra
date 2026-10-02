import { freeze } from './hash.js';
import { DEFAULT_POLICY, policyHash, type Policy } from './policy.js';
import { isTransition, validateTransition, type Transition, type ValidationResult } from './transition.js';

/** Local append-only reference store, not durable storage or consensus. */
export class History {
  readonly #policy: Readonly<Policy>;
  readonly #records: Transition[] = [];
  constructor(policy: Policy = DEFAULT_POLICY) { policyHash(policy); this.#policy = freeze(structuredClone(policy)); }
  get policy(): Readonly<Policy> { return this.#policy; }
  get length(): number { return this.#records.length; }
  get tip(): Transition | null { return this.#records.at(-1) ?? null; }
  snapshot(): readonly Transition[] { return Object.freeze(this.#records.slice()); }
  append(candidate: unknown): Transition {
    const result = validateTransition(candidate, { policy: this.#policy, previous: this.tip });
    if (!result.valid || !isTransition(candidate)) throw new Error('Rejected transition: ' + result.errors.join(', '));
    const accepted = freeze(structuredClone(candidate));
    this.#records.push(accepted);
    return accepted;
  }
}

export function verifyHistory(records: unknown, policy: Policy = DEFAULT_POLICY): ValidationResult {
  if (!Array.isArray(records)) return { valid: false, errors: ['HISTORY_NOT_ARRAY'] };
  const history = new History(policy);
  for (let i = 0; i < records.length; i++) {
    try { history.append(records[i]); }
    catch (error) { return { valid: false, errors: [`BLOCK_${i + 1}: ${error instanceof Error ? error.message : String(error)}`] }; }
  }
  return { valid: true, errors: [] };
}
