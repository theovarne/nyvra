# Policy

**Policy is explicit. Policy is versioned. Policy changes must be visible.**

The reference is governed by Policy M:

```json
{ "name": "M", "version": 1, "threshold": 975, "modulus": 997 }
```

The accepted score domain is `0 <= score < modulus`. A score at or above `threshold` yields STRIKE; all other scores yield HOLD. This is an illustrative decision model, not a market strategy.

The policy commitment is `SHA-256("nyvra/policy/v1\n" + canonical(policy))`, with a lowercase `0x` hexadecimal representation. A `History` instance pins a cloned, frozen policy at genesis. Acceptance always compares against that policy; a candidate's `policyHash` is not treated as authority.

Silent policy replacement is not valid. A decision is valid only relative to the committed policy. Mutation of the original constructor argument cannot change the policy retained by the history.

There is no policy-update method. To experiment with a different valid threshold, create a new local history with a new genesis context. This does not define a production upgrade protocol. A future migration must specify authorization, version binding, public migration evidence and the relationship between old and new agent histories.

The seed belongs to the **synthetic observation generator**, not to a hidden policy prompt. The generator is defined in [simulator usage](../simulator/README.md); the core evaluates the supplied, validated observation without assuming its source is authentic.

No policy commitment is deployed on chain by this repository.
