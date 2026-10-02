# Threat model

**Scope:** an unaudited, single-process, off-chain reference accepting JSON transitions under a locally trusted policy and predecessor. The observation generator is synthetic. Attackers may modify records or submit arbitrary JSON.

| Threat | Implemented response | Remaining boundary |
| --- | --- | --- |
| Policy substitution | Compare to pinned policy commitment; clone/freeze policy | Genesis policy origin is trusted locally |
| Invalid decision | Re-evaluate the committed observation | Does not prove observation truth |
| Broken history | Check predecessor hash, sequence and timestamps | No external anchor, durability or consensus |
| Forged proof | Recompute simulation checksum and reject mismatched envelopes | Anyone can create a new self-consistent envelope; no ZK/signature security |
| Replayed transition | Reject duplicate/out-of-order sequence within one history | Independent histories are not globally replay-protected |
| Inconsistent state | Recompute observation/transition/block hashes; reject extra/missing fields | A complete alternative chain can be regenerated |
| Unauthorized execution | No execution component exists | Future adapters need real authorization and policy binding |
| Post-acceptance mutation | Deeply frozen cloned records and private history collection | Host process compromise remains outside protection |

## Observation omissions and silence

A commitment proves neither that the agent looked at every relevant input nor that its source was honest. Withheld data, selective sampling, censorship and bribery at an observation source are not solved by a hash. A future observation protocol must define freshness, completeness, provenance, authenticated feeds and what constitutes a missed observation.

## Privileged attackers

An operator controlling the process can replace code, choose a different genesis or manufacture a full chain. Without external commitments, signatures or a verifier, the public cannot distinguish that chain from a real agent's history. Simulation checksums must never be marketed as live cryptographic proofs.

## Resource bounds

The CLI bounds seed, start and count. Runtime shape checks reject unknown fields and invalid primitive domains. The library is not a hardened public ingestion service: callers must separately enforce transport size, rate limits and isolation before parsing hostile inputs.

## Future work

Explicit proof/public-input versioning, authenticated agent identity, observation threat analysis, externally anchored genesis, replay-safe verifier state, execution authorization, upgrade rules and independent review are prerequisites for stronger claims. No audit or production security claim is made.
