import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonical, hash } from '../build/core/hash.js';
import { History, verifyHistory } from '../build/core/history.js';
import { DEFAULT_POLICY, policyHash } from '../build/core/policy.js';
import { createProof, verifyProof } from '../build/core/proof.js';
import { blockHash, transitionHash, createTransition, validateTransition } from '../build/core/transition.js';
import { createObservation } from '../build/simulator/events.js';
import { generateHistory } from '../build/simulator/blocks.js';
import { parseArgs } from '../build/simulator/simulator.js';

test('canonical commitments are order-independent, domain-separated and strict', () => {
  assert.equal(canonical({ b: 2, a: 1 }), canonical({ a: 1, b: 2 }));
  assert.notEqual(hash('one', {}), hash('two', {}));
  for (const value of [undefined, NaN, Infinity, 1.1, { v: undefined }, new Date(), Array(1)]) assert.throws(() => canonical(value));
});
test('seeded stream is reproducible, contains mostly HOLD and matches website decision cadence', () => {
  const a = generateHistory(997), b = generateHistory(997);
  assert.deepEqual(a, b); assert.notDeepEqual(generateHistory(5, 1), generateHistory(5, 0));
  assert.equal(a.filter(t => t.decision === 'STRIKE').length, 22);
  assert.equal(a[424].decision, 'STRIKE'); assert.equal(a[420].decision, 'HOLD');
  assert(verifyHistory(a).valid);
});
test('all critical fields are checked, not the envelope valid flag', () => {
  const [first, second] = generateHistory(2);
  const changes = [t => { t.policyHash = '0x' + '0'.repeat(64); }, t => { t.decision = 'STRIKE'; }, t => { t.observation.state.score++; }, t => { t.previousHash = null; }, t => { t.sequence++; }, t => { t.timestamp--; }, t => { t.proof.proofHash = '0x' + '1'.repeat(64); }, t => { t.proof.valid = false; }, t => { t.blockHash = '0x' + '2'.repeat(64); }, t => { delete t.observation; }, t => { t.extra = true; }];
  for (const change of changes) { const tampered = structuredClone(second); change(tampered); assert.equal(validateTransition(tampered, { policy: DEFAULT_POLICY, previous: first }).valid, false); }
  assert.equal(verifyProof({ ...second.proof, proofHash: first.proof.proofHash, valid: true }, second.transitionHash), false);
  for (const malformed of [null, [], {}, { decision: 'BUY' }]) assert.equal(validateTransition(malformed, { policy: DEFAULT_POLICY, previous: null }).valid, false);
});
test('history rejects replay, gaps, forks, reordering and policy substitution atomically', () => {
  const records = generateHistory(4), history = new History(); history.append(records[0]);
  for (const t of [records[0], records[2], { ...records[1], previousHash: records[3].blockHash }]) { assert.throws(() => history.append(t)); assert.equal(history.length, 1); }
  const replacement = { ...DEFAULT_POLICY, threshold: 974 };
  const switched = createTransition(createObservation(2), { policy: replacement, previous: records[0] });
  assert.throws(() => history.append(switched), /POLICY_MISMATCH/);
  history.append(records[1]); assert.equal(history.length, 2);
  assert.equal(verifyHistory([records[1], records[0]]).valid, false);
  assert.equal(verifyHistory(records.slice(1)).valid, false);
});
test('recomputed simulation hashes cannot authorize a decision that violates policy', () => {
  const forged = structuredClone(generateHistory(1)[0]);
  forged.decision = 'STRIKE';
  forged.transitionHash = transitionHash(forged);
  forged.proof = createProof(forged.transitionHash);
  forged.blockHash = blockHash(forged);
  assert.deepEqual(validateTransition(forged, { policy: DEFAULT_POLICY, previous: null }), { valid: false, errors: ['DECISION_MISMATCH'] });
});
test('input mutations and returned snapshots cannot rewrite accepted history', () => {
  const policy = { ...DEFAULT_POLICY }, history = new History(policy), input = structuredClone(generateHistory(1)[0]);
  history.append(input); input.observation.state.score = 999; policy.threshold = 1;
  assert.notEqual(history.tip.observation.state.score, 999); assert.equal(policyHash(history.policy), policyHash(DEFAULT_POLICY));
  assert.throws(() => { history.tip.observation.state.score = 10; });
  assert.throws(() => history.snapshot().pop());
});
test('proof is explicitly simulated and generator inputs are bounded', () => {
  assert.equal(createProof('0x' + 'a'.repeat(64)).scheme, 'SIMULATION');
  assert.throws(() => generateHistory(-1)); assert.throws(() => generateHistory(1, -1));
  assert.throws(() => createObservation(0)); assert.throws(() => createProof('invalid'));
  assert.throws(() => parseArgs(['--count', '-1'])); assert.throws(() => parseArgs(['--seed', '0', '--seed', '1']));
  assert.throws(() => parseArgs(['--count', '1001'])); assert.throws(() => parseArgs(['--typo']));
  assert.deepEqual(parseArgs(['--start', '1', '--count', '20', '--seed', '42', '--json']), { start: 1, count: 20, seed: 42, json: true, help: false });
});
