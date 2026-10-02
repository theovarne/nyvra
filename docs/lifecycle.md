# Lifecycle

**IMPLEMENTED: local reference lifecycle. PLANNED: execution and production proofs.**

1. **OBSERVE:** capture relevant state. Here this means a seeded, synthetic score/signal, sequence, source and simulated timestamp. Commit the state and observation.
2. **EVALUATE:** apply the policy pinned by the local history. Validate the observation domain before evaluating it.
3. **DECIDE:** produce HOLD or STRIKE together with the observation and policy hashes.
4. **PROVE:** compute the transition statement hash and public simulation proof envelope. This is the place a future proof adapter would occupy, not a ZK implementation.
5. **APPEND:** recompute commitments, decision and links. Only an accepted transition is cloned, deeply frozen and appended.
6. **EXECUTE:** only STRIKE transitions may proceed toward execution in the intended architecture. No execution adapter exists in this reference. A STRIKE log is not a trade or transaction.

HOLD follows exactly the same verification path as STRIKE. It consumes a sequence number and extends the chain.

## Rejection

`validateTransition` returns `{valid:false, errors:[...]}` for structurally invalid or semantically inconsistent JSON records. `History.append` throws on rejection and leaves the tip/length unchanged. A rejected attempt cannot become a predecessor.

The website's terminal-death narrative describes a proposed production lifecycle rule. The reference validator is a reusable library and does **not** permanently disable itself after a bad input; a subsequent valid candidate may be appended. Production terminal-state semantics remain to be specified with the verifier.

## Simulation time

Time is deterministic data, not the machine's wall clock. The generator advances 12 seconds per record. The core requires transition time to equal observation time and strictly increase after the predecessor; it does not prove real-world clock accuracy.

CLI runs have no background activity. They reconstruct history, print the requested range, then exit. Starting another run produces a new independent local history.
