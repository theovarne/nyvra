# Contributing

NYVRA is an experimental reference implementation. Small, reviewable changes
that improve correctness, reproducibility, or clarity are welcome.

## Local workflow

Use Node.js 22.13+ or 24 and npm. Clone the repository, then run:

```sh
npm ci
npm run validate
npm run simulate
```

Fork the repository if you do not have write access, then branch from `main`.
Describe the concrete problem, the resulting behavior, and
the checks you ran in your pull request. Add meaningful tests when changing
validation, policy evaluation, serialization, or history behavior. Keep docs,
schemas, and examples consistent with the implementation.

Run `npm run fixtures` after an intentional fixture change and explain the
changed inputs or format. Do not hand-edit generated history to make tests pass.
Changes to canonical encoding or hash domains require explicit compatibility
discussion; existing commitments may no longer verify.

## Scope and evidence

Separate implemented behavior from proposals. Do not add fabricated deployment
addresses, proof blobs, transaction signatures, audits, performance claims,
activity, or financial results. Keep every demonstration labeled SIMULATION.
Discuss actual circuit or Solana implementations in an issue before a large PR.

Use public issues for ordinary bugs and feature requests. Read
[SECURITY.md](SECURITY.md) before reporting a vulnerability and follow the
[code of conduct](CODE_OF_CONDUCT.md). Contributions are offered under the
repository's [MIT license](LICENSE).
