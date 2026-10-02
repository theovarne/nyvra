# History

**IMPLEMENTED: local append-only reference. PLANNED: signatures, durable anchoring and public consensus.**

Genesis has sequence 1 and `previousHash: null`. Every successor increments the sequence by one and references the previous accepted record's `blockHash`. IDs are derived as `block-` plus a decimal sequence padded to at least six digits. Observation IDs use the matching `obs-` prefix.

Each record carries the complete synthetic observation, observation and policy hashes, HOLD/STRIKE decision, simulated time, transition hash, proof envelope and block hash. Both kinds of decision occupy a full record.

`History` privately stores records and its pinned policy. `append` accepts only a valid successor and saves a deeply frozen clone. `snapshot` exposes a frozen array of immutable accepted records; there is no editing or deletion API. Invalid appends leave the collection unchanged.

Rewriting a record changes its block hash and breaks a later predecessor link unless the rest of the chain is recomputed. Because this reference has no external anchor or signature, an adversary **can** recompute an alternate complete history. Hash linkage alone is not proof of authenticity.

History exists only for a process lifetime. Restarting a simulator deterministically reconstructs a fresh sequence; this is replay, not persistence or recovery of a production agent. There is no database, disk journal, multi-writer coordination or fork-choice rule.

The JSON CLI output includes an informational predecessor checkpoint when displaying a later range. It must not be mistaken for an externally trusted checkpoint. The committed sample fixture starts at genesis so it can be independently validated in full.
