# Decisions

NYVRA recognizes two decision classes: **HOLD** and **STRIKE**.

HOLD means the policy evaluated the observation and selected no action. It is not missing data, an absent event, a timeout or evidence that the agent failed to look.

STRIKE means the rule selected action within the model. It is not proof that an action occurred, an instruction to trade, or execution authorization outside this local reference.

`decide({observation, policy})` returns a `DecisionResult` containing the decision and both commitments. It validates observation structure, state commitment and score bounds before evaluation. The result is deterministic and frozen.

```text
score < threshold   → HOLD
score >= threshold  → STRIKE
```

The core does not use randomness, prices, balances, wallets or remote feeds. A repeated observation/policy pair returns the same result. The simulator supplies occasional threshold-crossing observations; it does not force a different policy to make the output more active.

Changing a decision without updating its observation/policy relation causes semantic rejection, even if an attacker recalculates a public checksum. Conversely, a completely new self-consistent synthetic observation can pass: the reference cannot establish that the observation came from the outside world. See [threat model](threat-model.md).

Examples: [HOLD](../examples/hold-transition.json), [STRIKE](../examples/strike-transition.json).
