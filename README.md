# NYVRA

**AN AUTONOMOUS AGENT THAT PROVES ITS DECISIONS.**

Observe. Decide. Prove. Append.

[Website](https://www.nyvra.xyz/) · [Documentation](docs/README.md) · [Architecture](docs/architecture.md) · [Roadmap](ROADMAP.md)

[![Validation](https://github.com/theovarne/nyvra/actions/workflows/validate.yml/badge.svg)](https://github.com/theovarne/nyvra/actions/workflows/validate.yml) · [MIT license](LICENSE) · **EXPERIMENTAL / SIMULATION**

NYVRA is an experimental autonomous-agent protocol built around a simple premise: an autonomous system should be able to prove not only what it did, but why a valid transition occurred.

The lifecycle is intentionally minimal:

```text
OBSERVE → DECIDE → PROVE → APPEND
```

A decision to act and a decision to hold are both explicit transitions.

> A HOLD is a decision.
>
> Every decision leaves a proof — the intended protocol requirement. The current reference uses a **simulation envelope**, not a zero-knowledge proof.

## Status

| Layer | Status | What exists today |
| --- | --- | --- |
| Core lifecycle | IMPLEMENTED / REFERENCE | Typed observations, pinned policy, deterministic decisions and transition validation |
| Simulator | IMPLEMENTED | Seeded inputs, reproducible history, CLI and checked fixtures |
| History | IMPLEMENTED / LOCAL | Immutable accepted records with SHA-256 predecessor links |
| Proof envelope | EXPERIMENTAL / SIMULATION | Recomputed public checksum; **no signatures or ZK security** |
| Proof specification | DRAFT | Statement, candidate bindings and unresolved design decisions |
| Groth16 circuit | PLANNED | No circuit, proving key or verifier implementation |
| Solana verifier / program | PLANNED | No program, deployment, transaction or on-chain history |
| Autonomous execution | PLANNED | No trading, wallet, external market feed or live autonomous agent |

This is a public protocol engineering workspace, not an audited or production-secure system. There is no token contract address.

## Run the reference

Node.js **22.13+ or 24** and npm are required. Development dependencies support compilation, lint and schema validation; the compiled runtime uses only Node built-ins.

```bash
git clone https://github.com/theovarne/nyvra.git
cd nyvra
npm ci
npm run simulate
```

The default run reconstructs blocks 1–420 and prints 421–430. Most are HOLD; block 425 is STRIKE. It does not send transactions.

```text
NYVRA / SIMULATION
OBSERVE → DECIDE → PROVE → APPEND

BLOCK 00421
OBSERVE  state committed
DECIDE   HOLD
PROVE    simulation checksum: VALID
APPEND   transition committed

BLOCK 00425
OBSERVE  state committed
DECIDE   STRIKE
PROVE    simulation checksum: VALID
APPEND   transition committed
```

Condensed above; the actual CLI includes full hashes and simulated UTC timestamps.

```bash
npm run simulate -- --start 1 --count 30 --seed 0
npm run build
node build/simulator/simulator.js --start 1 --count 30 --seed 0 --json
npm run validate
```

Identical seed and arguments yield identical records. Timestamps begin at a fixed simulation genesis and advance 12 seconds per observation. See [simulator usage](simulator/README.md).

## Core idea

```text
┌──────────────┐
│ OBSERVATION  │   Commit the state being evaluated.
└──────┬───────┘
       ▼
┌──────────────┐
│    POLICY    │   Apply an explicit, versioned policy.
└──────┬───────┘
       ▼
┌──────────────┐
│   DECISION   │   HOLD or STRIKE.
│ HOLD/STRIKE  │
└──────┬───────┘
       ▼
┌──────────────┐
│    PROOF     │   Bind the decision to its inputs.
└──────┬───────┘
       ▼
┌──────────────┐
│    APPEND    │   Extend accepted history.
└──────────────┘
```

- **Observation:** a committed representation of the state being evaluated. All inputs here are synthetic.
- **Policy:** the fixed, explicit decision rule pinned by the history constructor.
- **Decision:** the result of evaluating an observation under that policy.
- **Proof:** evidence for the intended relation; currently a clearly labeled public simulation checksum.
- **History:** an append-only sequence of locally validated transitions. This is not a consensus ledger.

## HOLD / STRIKE

**HOLD** means the policy evaluated the observation and determined that no action should be taken. It is an explicit decision, not an empty log entry.

**STRIKE** means the policy evaluated the observation and authorized an action within the model. The reference records this decision but has no execution adapter or real-world authorization.

Both require the same observation commitment, policy commitment, simulation proof and previous-hash linkage. Action is not the objective.

> A decision to hold is still a decision.

NYVRA makes transitions explicit and locally checkable in this reference. The production goal is to make them provable and append-only under a public verifier.

## Inspect the evidence

- [30-block deterministic fixture](simulator/fixtures/sample-history.json), starting at genesis.
- [HOLD example](examples/hold-transition.json) and [STRIKE example](examples/strike-transition.json).
- [Invalid example](examples/invalid-transition.json): wrong policy commitment and a false simulation-envelope flag; semantic validation rejects it.
- [Schemas](schemas/README.md): explicit data shapes; schemas alone do not establish validity.
- [Verification rules](docs/verification.md) and [threat model](docs/threat-model.md).

The website and reference share the seed-zero decision schedule, threshold, lifecycle and simulation boundary. This repository introduces a versioned canonical, domain-separated hash format; its hashes are **not byte-compatible with the earlier website demo format**. See [architecture](docs/architecture.md#website-and-reference).

## Source map

| Directory | Responsibility |
| --- | --- |
| `core/` | Typed models, commitments, policy evaluation, proof envelope, transition and history validation |
| `simulator/` | Deterministic observations, CLI and checked fixture |
| `schemas/` | JSON Schema 2020-12 models |
| `examples/` | Complete accepted/rejected transition examples |
| `docs/` | Architecture, lifecycle, policy, proof, history and security assumptions |
| `circuits/` | Planned Groth16 statement; no implemented circuit |
| `programs/solana/` | Planned Solana architecture; no deployed program |
| `tests/`, `scripts/` | Behavioral tests, schema/fixture and local-link validation |

## Development

`npm run validate` runs typechecking, lint, tests, schema checks, fixture reproduction and local documentation-link checks. CI runs validation on Node 22 and 24 and exercises the CLI simulator on Node 24. Fixtures are generated with `npm run fixtures`; CI rejects unexplained drift.

Architecture changes should be discussed before implementation. See [Contributing](CONTRIBUTING.md), [Security](SECURITY.md), [Code of Conduct](CODE_OF_CONDUCT.md) and the [Changelog](CHANGELOG.md).

**OFF-CHAIN → GROTH16 → SOLANA** is a roadmap, not a claim that the latter stages are live.
