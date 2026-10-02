# Architecture

**STATUS: EXPERIMENTAL / OFF-CHAIN REFERENCE**

NYVRA is organized around five conceptual layers: Observation, Policy, Decision, Proof and History.

```text
Observer
   ↓
Policy Engine
   ↓
Decision Engine
   ↓
Proof Layer
   ↓
History Layer
   ↓
Execution / Verification (production integration planned)
```

## Responsibilities

1. **Observation** captures synthetic state and commits it. `core/observation.ts` defines its shape; `simulator/events.ts` supplies reproducible inputs. A source label is not source authentication.
2. **Policy** fixes a versioned threshold rule. `History` clones and freezes it at construction. A record cannot silently supply its own acceptance policy.
3. **Decision** evaluates the committed observation. Scores below the threshold yield HOLD; scores at or above it yield STRIKE. Out-of-domain observations are rejected.
4. **Proof** binds the transition statement into an explicitly public SIMULATION envelope. Anyone can recompute it. It does not authenticate an agent, hide a witness or authorize execution.
5. **History** validates then appends an immutable snapshot. The private collection has no update/delete API. All hashes and commitments are recomputed before acceptance.

The core has no network clients, timers, storage, wallets or external execution. Compilation produces ordinary Node ESM. Runtime dependencies are Node built-ins only.

## Dependency direction

`hash` → `policy / observation` → `decision / proof` → `transition` → `history`.

The simulator depends on the core, not the reverse. Schemas describe serialization; runtime checks enforce cross-field and predecessor relationships. Examples are generated from the same implementation and validated in CI.

## State and trust

The `ValidationContext` contains a locally pinned policy and an already accepted predecessor. This context must not be taken from an untrusted candidate. `verifyHistory` starts at genesis and builds that context by accepting each record in order.

All state is in memory. Hash continuity can reveal changes relative to a trusted tip, but this reference has no trusted external checkpoint. An attacker can regenerate an alternate self-consistent history. There is no consensus, durability, signature or claim of real-world observation completeness.

## Website and reference

The [website](https://www.nyvra.xyz/) and this implementation share seed-zero behavior: genesis at 2026-10-01 00:00 UTC, 12 simulated seconds per record, threshold 975 over modulus 997, and one STRIKE every 45 observations including block 425.

The repository adds versioned data shapes, observation IDs, source/seed commitments and sorted, domain-separated hashing. It is a separate reference wire format; existing browser checksums must not be imported as repository-valid records. Regenerate fixtures using this implementation. Any future shared wire format must be versioned and tested on both surfaces.

See [proof encoding](proofs.md), [verification](verification.md) and [threat model](threat-model.md).
