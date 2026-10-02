import { History } from '../core/history.js';
import { integer } from '../core/hash.js';
import { createTransition, type Transition } from '../core/transition.js';
import { createObservation } from './events.js';
import { SIMULATION_POLICY } from './policy.js';

export function generateHistory(count = 30, seed = 0): readonly Transition[] {
  if (!integer(count, 0, 100_000)) throw new RangeError('Count must be 0..100000.');
  if (!integer(seed, 0, 4_294_967_295)) throw new RangeError('Seed must be uint32.');
  const history = new History(SIMULATION_POLICY);
  for (let sequence = 1; sequence <= count; sequence++) history.append(createTransition(createObservation(sequence, seed), { policy: history.policy, previous: history.tip }));
  return history.snapshot();
}
