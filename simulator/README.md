# Deterministic simulator

Run from the repository root after `npm ci`:

```sh
npm run simulate
npm run simulate -- --start 1 --count 30 --seed 0
npm run simulate -- --start 421 --count 10 --seed 0 --json
```

Defaults are start 421, count 10, and seed 0. Sequence 425 is STRIKE under those
inputs. The CLI accepts start 1–10,000, count 1–1,000, and a uint32 seed. Unknown,
duplicate, fractional, and out-of-range arguments are rejected. `--help`
describes the flags. npm prints its own script headers; for clean JSON use:

```sh
npm run build
node build/simulator/simulator.js --start 1 --count 30 --seed 0 --json
```

Events use a fixed synthetic genesis time of 2026-10-01T00:00:00.000Z and a
12-second interval. These timestamps are test data, not execution dates.
For sequence `n` and seed `s`, score is:

```text
if (n + s) mod 45 = 20: 975 + ((n + s) mod 22)
otherwise: (37n + 17 + s) mod 975
```

The observation also includes a synthetic signal and seed. Policy M decides
STRIKE for scores at least 975, HOLD otherwise, within modulus 997. Every
record passes through the same core validator and history append operation.
No RPC, wallet, external market feed, or transaction is used.

The CLI reconstructs predecessors from genesis before displaying a window.
Its JSON checkpoint describes the omitted predecessor but does not authenticate
it. A sliced window is not independently verifiable as a genesis history.

`npm run fixtures` regenerates the committed 30-record
[sample history](fixtures/sample-history.json) and [examples](../examples/README.md).
`npm run validate:schemas` checks schema shape, semantic validity, and exact
reproducibility. All proof envelopes are labeled `SIMULATION`.
