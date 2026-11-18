# 1. Purpose
This appendix is intended to be the authoritative register for the ten decisions from the Research Pack (ADR-001…ADR-010 @SD@) and sixteen decisions identified during the audit (ADR-011…ADR-026 @R@). The record tables are not included in this repository edition, so decision status and evidence must be confirmed with the project owner before implementation.

# 2. Rules
- **Statuses** are exactly: Proposed, Accepted, Rejected, Superseded, Deferred. A decision is never promoted from Proposed to Accepted without the validation evidence listed in its record, and without a named decision owner (owner is still TBD — see OQ-16, WP-002).
- Only **ADR-002** is Accepted, on the basis that the Research Pack states it as a hard requirement @SD@ (Master Synthesis §7). Ratification by a named owner remains pending.
- "Chosen option" is left explicitly **None** where evidence is missing. "Provisional lean" is an engineering recommendation @R@, not a decision.
- History is never rewritten: changes are new records that supersede old ones.
- Review dates are expressed as gate or evidence triggers because calendar commitments cannot be made without team capacity data (OQ-16).

# 3. Decision register
> **Register gap:** The ADR summary rows (ADR-001…ADR-026) are not included in this repository edition. The rules above preserve the source's stated status that ADR-002 is Accepted but still awaits owner ratification; they do not establish the status of other decisions. Do not infer acceptance from a technology appearing in a design document.

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
> **Record gap:** Full ADR records, including options, consequences, validation evidence, and owners, are not included in this repository edition. Restore the records before treating this appendix as an operational decision register.
