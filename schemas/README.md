# JSON Schemas

These Draft 2020-12 schemas describe version 1 reference records:

| Schema | Record |
| --- | --- |
| [observation.schema.json](observation.schema.json) | Synthetic observation and state commitment |
| [decision.schema.json](decision.schema.json) | HOLD / STRIKE with observation and policy hashes |
| [proof.schema.json](proof.schema.json) | SIMULATION checksum envelope |
| [transition.schema.json](transition.schema.json) | Complete linked transition |

Register all four schemas with a Draft 2020-12 validator so their `urn:nyvra:`
references resolve locally. IDs are identifiers, not downloadable URLs.
Objects reject extra properties. Schema validation checks shape and ranges;
it cannot recompute hashes, evaluate decisions, or validate a history link.
Use the [core validator](../docs/verification.md) for those semantic checks.

An envelope with `valid: false` is structurally representable and semantically
rejected. This distinction allows rejected examples and diagnostic tooling.
Run `npm run validate:schemas` to check the committed fixtures with Ajv.
