# Roadmap

This is a research roadmap, not a delivery schedule or a claim of deployment.

## Available in this repository

- [x] Explicit HOLD / STRIKE policy and typed transition records.
- [x] Deterministic local simulator, fixtures, and JSON Schemas.
- [x] Hash-linked history validation and rejection tests.
- [x] Architecture and trust-boundary documentation.

## Protocol specification

- [ ] Specify observation provenance, completeness, and trusted time.
- [ ] Select field encoding, commitment primitives, and compatibility rules.
- [ ] Specify agent identity, policy activation, and anchored history tips.
- [ ] Define liveness, terminal failure, and recovery semantics.

## Proof system research

- [ ] Implement constraints and test vectors for a bounded policy statement.
- [ ] Choose a proving stack and document Groth16 setup and key provenance.
- [ ] Implement and adversarially test proof generation and verification.
- [ ] Benchmark actual artifacts and document results with reproducible inputs.

## Solana integration research

- [ ] Specify account layouts, authorities, replay protection, and lifecycle.
- [ ] Implement a program and verifier with local validator tests.
- [ ] Evaluate compute, size, rent, concurrency, and operational limits.
- [ ] Review security before any explicitly announced devnet deployment.

Mainnet, token issuance, market execution, external audits, and release dates
are not promised by this roadmap. See [circuits](circuits/README.md) and
[Solana planning](programs/solana/README.md).
