import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import Ajv2020 from 'ajv/dist/2020.js';
import { decide } from '../build/core/decision.js';
import { DEFAULT_POLICY } from '../build/core/policy.js';
import { validateTransition } from '../build/core/transition.js';
import { verifyHistory } from '../build/core/history.js';
import { generateHistory } from '../build/simulator/blocks.js';
const load = path => JSON.parse(readFileSync(path, 'utf8'));
const ajv = new Ajv2020({ strict: true, allErrors: true });
for (const name of ['observation', 'decision', 'proof', 'transition']) ajv.addSchema(load(`schemas/${name}.schema.json`), name);
const check = (name, value) => { assert(ajv.validate(name, value), JSON.stringify(ajv.errors)); };
const history = load('simulator/fixtures/sample-history.json');
assert.deepEqual(history, generateHistory(30, 0), 'Fixture must exactly match the deterministic generator.');
assert(verifyHistory(history).valid);
for (const t of history) { check('transition', t); check('observation', t.observation); check('proof', t.proof); check('decision', decide({ observation: t.observation, policy: DEFAULT_POLICY })); }
for (const name of ['hold', 'strike', 'invalid']) {
  const t = load(`examples/${name}-transition.json`);
  check('transition', t);
  const result = validateTransition(t, { policy: DEFAULT_POLICY, previous: history[t.sequence - 2] ?? null });
  assert.equal(result.valid, name !== 'invalid');
  if (name === 'invalid') assert(result.errors.includes('POLICY_MISMATCH'));
}
const missing = structuredClone(history[0]); delete missing.proof;
assert.equal(ajv.validate('transition', missing), false);
const extra = { ...history[0], unexpected: true }; assert.equal(ajv.validate('transition', extra), false);
const wrong = structuredClone(history[0]); wrong.decision = 'BUY'; assert.equal(ajv.validate('transition', wrong), false);
console.log('Schemas, 30-block fixture, example validity and malformed-record rejection passed.');
