# Security policy

This repository is unaudited experimental software. Version 0.1.x is a local
reference and simulator, not a production verification service. There is no
deployed Solana program, trusted proof verifier, custody component, or trading
execution path here. Do not use it to secure assets or make financial decisions.

## Reporting

If GitHub displays **Report a vulnerability** under the repository's Security
tab, use that private reporting channel for sensitive findings. If that option
is unavailable, open an issue asking for a private contact without publishing
exploit details, credentials, or affected private data. No separate security
email or bug bounty is currently announced.

Include the affected commit, minimal reproduction, expected and observed
behavior, and impact. No response-time guarantee or paid reward is offered.
Only the current `main` branch is maintained; published snapshots carry no
long-term support commitment.

## Boundaries

Simulation proofs are public, recomputable checksums. They provide neither
zero-knowledge nor authentication. A hash-linked history detects inconsistent
edits relative to a trusted commitment; it cannot prevent a malicious party
from constructing a different consistent history. The policy and history tip
must be obtained through a separate trusted channel in any future integration.

Read the full [threat model](docs/threat-model.md) and
[verification contract](docs/verification.md) before using the code.
