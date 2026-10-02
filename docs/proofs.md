# Proofs and encoding

**Current proof implementation: SIMULATION envelope. Production ZK circuit: PLANNED.**

The envelope is `{scheme:"SIMULATION", version:1, transitionHash, proofHash, valid}`. The `valid` boolean is descriptive data, never a sufficient acceptance condition. `verifyProof` recomputes the expected public checksum, checks the scheme/version, and binds it to the expected statement hash.

## Canonical representation

`core/hash.ts` serializes plain JSON objects with sorted keys, preserves array order and uses JavaScript JSON string escaping. Numbers must be safe integers. Unsupported values, non-finite/fractional numbers and undefined fields are rejected. Output is UTF-8. This is the repository's restricted canonical format, **not a claim of RFC 8785 compatibility**.

Each commitment hashes `domain + "\n" + canonical(value)` using SHA-256 and prints `0x` plus 64 lowercase hexadecimal digits.

| Domain | Committed value |
| --- | --- |
| `nyvra/observation-state/v1` | Score, signal, seed |
| `nyvra/observation/v1` | Complete observation including its state commitment |
| `nyvra/policy/v1` | Explicit policy object |
| `nyvra/transition/v1` | Version, ID, sequence, time, predecessor, observation/policy commitments and decision |
| `nyvra/simulation-proof/v1` | Scheme, envelope version and transition hash |
| `nyvra/block/v1` | Transition hash and complete proof envelope |

The transition body excludes its proof and final block hash, avoiding a circular commitment. The full observation is present in the record and separately recomputed against its commitment. A successor references **blockHash**, not merely transitionHash.

## Limits

Anyone can recompute these hashes. They provide local consistency and change detection relative to a trusted context; they do not prove identity, origin, liveness, confidentiality or authorization. A false `valid` flag is rejected, but a true flag is never trusted on its own. No cryptographic signatures are produced.

The [fixture](../simulator/fixtures/sample-history.json) supplies reproducible test vectors. Run `npm run validate:schemas` to check both their shape and semantics.

The planned relation is `decision = Policy(observation)` under committed policy and observation inputs. See the [Groth16 draft](../circuits/specification.md) for unresolved witness, encoding, setup and verification work.
