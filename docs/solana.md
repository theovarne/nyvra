# Solana architecture

**STATUS: PLANNED. Current implementation: OFF-CHAIN / SIMULATION.**

Solana is the intended execution and verification layer, not a currently deployed component.

```text
NYVRA AGENT
     ↓
OBSERVATION
     ↓
DECISION
     ↓
ZK PROOF          (planned)
     ↓
SOLANA VERIFIER   (planned)
     ↓
ON-CHAIN HISTORY  (planned)
```

The intended layer would provide transition anchoring, proof verification, append-only history references and public verification. A prospective program would need to bind an agent identity and genesis policy to an accepted state root, sequence and predecessor, then check each proposed transition before updating state.

Still unresolved: account layout, signer/authority rules, proof public inputs, proof-system compatibility, serialization, compute limits, rent/storage costs, concurrency/replay rules, lifecycle failure behavior, upgrades, audits and deployment operations.

A public proof must not authorize arbitrary execution merely because a local policy relation holds. Execution adapters and their authorization boundaries need a separate specification.

There is no Rust/Anchor program, program ID, verifier binary, devnet/mainnet deployment, transaction example or contract address here. See [program status](../programs/solana/README.md) and [roadmap](../ROADMAP.md).
