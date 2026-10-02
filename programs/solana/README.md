# Solana integration — planned

No Rust/Anchor program, program ID, IDL, RPC integration, devnet deployment,
mainnet deployment, or transaction history is currently provided.

A future design could store agent identity, policy commitment, expected
sequence, accepted tip, and lifecycle status in program-owned state. An append
instruction would bind the supplied statement to this state, verify an actual
proof with approved verification material, and update the tip atomically only
after success. Account authorities, PDA derivation, initialization, policy
changes, concurrency, replay prevention, and upgrade controls remain unspecified.

Do not accept the reference `SIMULATION` envelope in any deployed verifier.
No amount of checking its `valid` field provides proof authenticity.

Before deployment: write the account/instruction specification; implement and
test verifier bindings; test malformed, replayed, stale, and unauthorized inputs;
measure actual compute and size constraints; define failure and recovery rules;
document key/setup provenance and undertake a security review. See the
[architecture notes](../../docs/solana.md) and [roadmap](../../ROADMAP.md).
