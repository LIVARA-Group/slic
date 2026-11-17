# 1. Purpose
Single register of every architecture decision in the SLIC engineering programme. It carries the ten decisions from the Research Pack (ADR-001…ADR-010 @SD@) and sixteen new decisions identified during the audit (ADR-011…ADR-026 @R@). It is the authoritative place to read the status of a decision; other documents quote it.

# 2. Rules
- **Statuses** are exactly: Proposed, Accepted, Rejected, Superseded, Deferred. A decision is never promoted from Proposed to Accepted without the validation evidence listed in its record, and without a named decision owner (owner is still TBD — see OQ-16, WP-002).
- Only **ADR-002** is Accepted, on the basis that the Research Pack states it as a hard requirement @SD@ (Master Synthesis §7). Ratification by a named owner remains pending.
- "Chosen option" is left explicitly **None** where evidence is missing. "Provisional lean" is an engineering recommendation @R@, not a decision.
- History is never rewritten: changes are new records that supersede old ones.
- Review dates are expressed as gate or evidence triggers because calendar commitments cannot be made without team capacity data (OQ-16).

# 3. Decision register
@@ADR_SUM@@

# 4. Decision dependency map
| Decision | Blocked by / informed by | Blocks |
|---|---|---|
| ADR-004 Local DB | POC-01, POC-02, OQ-06 | ADR-017, ADR-019, ADR-014, WP-031, WP-040 |
| ADR-007 Encryption | OQ-01, OQ-08, POC-08, independent review | ADR-006 (sync envelope), WP-061/062/063 |
| ADR-006 Sync | POC-07, ADR-007 | WP-062 |
| ADR-003 / ADR-020 | OQ-02, POC-09 | WP-070/071 |
| ADR-009 Audit anchoring | OQ-02, OQ-10 | WP-074 |
| ADR-026 Epistemic model | OQ-04, OQ-13 | WP-030, WP-044, WP-064 |

# 5. Full records
@@ADR_FULL@@
