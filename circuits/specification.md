# Candidate proof statement — specification draft

The intended statement is that a committed observation, evaluated under a
committed policy, produces an explicit HOLD or STRIKE decision linked to the
accepted predecessor. This draft does not constitute a circuit specification
ready for production.

## Candidate public inputs

- Protocol version and policy commitment.
- Observation commitment and decision encoding.
- Agent identity or domain identifier, sequence, and predecessor commitment.
- A transition commitment binding the statement above.

## Candidate witness and constraints

The witness could contain bounded observation fields and policy parameters
whose commitments match the public inputs. Constraints must enforce canonical
field encodings, integer ranges, comparator correctness, a boolean decision,
and commitment binding. For policy M, HOLD means score < 975; STRIKE means
975 <= score < 997. Merely proving that a hash can be computed is insufficient.

## Unresolved integration decisions

Select a field, curve, constraint language, hash primitive, byte-to-field
encoding, and proof/public-input serialization. Define how public commitments
map to the reference SHA-256 format or explicitly version a replacement. Specify
which policy fields are public and whether any observation privacy is useful.
For Groth16, document circuit-specific setup, key provenance, and upgrade rules.

The verifier outside the circuit still needs trusted predecessor state,
authorized identity, policy activation, replay protection, observation source
authentication, and time rules. A valid proof cannot establish that the agent
observed every external event or that an external source told the truth.
