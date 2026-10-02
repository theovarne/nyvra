# Verification

Validation has two distinct layers:

1. JSON Schema 2020-12 checks object shape, primitive types, bounds, required fields, supported schemes and unexpected fields.
2. `validateTransition(candidate, {policy, previous})` checks relationships and recomputes the complete decision/commitment path. A schema-valid record can still be semantically invalid.

`policy` must be locally pinned, and `previous` must already be accepted. To check an untrusted full sequence, use `verifyHistory`, which starts from a null predecessor and accepts records in order. Do not trust a predecessor supplied alongside an isolated candidate.

| Error | Rejected condition |
| --- | --- |
| `INVALID_STRUCTURE` | Missing/extra fields, bad types, hashes, IDs, scheme or version |
| `OBSERVATION_COMMITMENT` | State or observation hash does not recompute |
| `POLICY_MISMATCH` | Candidate commitment differs from the pinned policy |
| `SEQUENCE_MISMATCH` | Replay, gap, or observation/transition sequence mismatch |
| `TIMESTAMP_ORDER` | Transition and observation time differ, or time fails to increase |
| `PREVIOUS_HASH_MISMATCH` | Candidate does not extend the accepted tip |
| `DECISION_MISMATCH` | HOLD/STRIKE differs from policy evaluation |
| `OBSERVATION_DOMAIN` | Observation cannot be evaluated in the policy domain |
| `TRANSITION_HASH_MISMATCH` | Statement hash does not recompute |
| `INVALID_SIMULATION_PROOF` | Envelope is false, malformed or not bound to the statement |
| `BLOCK_HASH_MISMATCH` | Final block commitment does not recompute |

Rejection is atomic: `History.append` does not advance the tip. It copies and deeply freezes accepted data so later mutation cannot alter it.

An empty sequence is a valid empty local history. It does not establish that any observations were made. A sliced history that does not begin at sequence 1 is rejected by `verifyHistory`; validating a slice requires a separately trusted checkpoint, which this CLI does not externally authenticate.

Validation does not establish that the source is honest, time is real, a STRIKE was executed, or an on-chain verifier exists.
