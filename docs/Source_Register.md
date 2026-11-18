# 1. Purpose
Audit record of the evidence base: what was supplied, what was extracted, which inconsistencies and gaps were found, and how each was handled. Produced in Iteration 1 (Source Audit) and updated through Iteration 7.

# 2. Audited sources
| File | Pages | Content (as read) | Use in this programme |
|---|---|---|---|
| 00_Master_Synthesis_and_Decision_Register.pdf | 7 | Executive synthesis, source corrections, product identity, boundaries, target architecture, invariants, ADR-001…010 register, recursive review protocol, critical unknowns | Invariants, ADR baseline, open questions |
| 01_Product_and_System_Definition.pdf | 6 | Product definition, contours, reuse/separation, actors, journeys, PRD-001…012, NFRs to quantify, metrics, MVP boundary | Requirements, release scope |
| 02_Domain_Ontology_Epistemic_and_Temporal_Model.pdf | 6 | Pillars, object taxonomy, epistemic states, PROV-O alignment, temporal model, relationship taxonomy, confidence, schema proposal, invariants | Doc 06, Appendix B |
| 03_Technical_Architecture_and_Data_Platform.pdf | 6 | Context, frontend, local persistence options, backend modules, PostgreSQL/Drizzle, graph, search, sync, API, infrastructure, technology table, POC-A…E | Docs 03, 04, 05, 08 |
| 04_Security_Privacy_and_Forensic_Governance.pdf | 6 | Threat models, trust boundaries, crypto requirements, Web Crypto, passkeys, zero-knowledge limits, access control, evidence integrity, key deletion, legal, test programme, release gates | Docs 11, 14, 15, Appendix D |
| 05_AI_Reasoning_Retrieval_and_Evaluation.pdf | 5 | AI role, pipeline, lifecycle, retrieval, prompt injection, tiers, evaluation, hypotheses, causality, governance, first AI release | Doc 13 |
| 06_Validation_Roadmap_Operations_and_Governance.pdf | 6 | Phases 0–7, 30-day programme, benchmark protocol, test strategy, observability, environments, ADR governance, readiness, production gates, risks | Docs 01, 05, 16, 17 |
| README_and_Pack_Index.pdf | 3 | Reading guide, package contents, method, confidence and limitations, reference register | Method, labels |
All eight PDFs in the supplied research ZIP have an embedded text layer and were read in full. The research ZIP was supplied outside this repository; the original PDFs and a merged copy are not checked into this working tree.

**Not supplied:** *LIVARA Group.pdf* (4-page visual export: company identity, second-brain schema, secure backend diagrams, algorithm-core parts, feature hierarchy, phased lifecycle) and *SLIC-Research-and-Documentation-Checklist.pdf* (10 pages). Everything known about them is second-hand through the pack (OQ-18). Consequence: requirements or constraints that exist only in those files may be missing here.

# 3. Extraction summary
| Item | Count in source programme | Where referenced / status in this repository edition |
|---|---:|---|
| Source requirement IDs (PRD-001…012) | 12 | Summarised in doc 02 §4.1; the 74 refined requirement rows are not included in this checkout. |
| ADR entries | 26 (ADR-001…026) | Referenced in Appendix A and the engineering docs; the decision-record tables are not included, so most statuses cannot be verified here. |
| Architecture invariants | 5 explicit in Master §6; the programme brief lists 10 | Summarised in doc 02 §5.1; source distinctions and limits are retained, while the complete structured catalogue is not present. |
| Critical unknowns | 7 in Master §9; 10 in the programme brief | OQ IDs are referenced; Appendix H currently documents the missing register rows. |
| Pack risk register entries | 10 | RK IDs are referenced; Appendix H currently documents the missing register rows. |
| Pack POCs (A–E) | 5 | Mapped to the 10 experiment protocols in doc 05 §3; protocols are described, results are not executed. |
| Pack phases (0–7) | 8 | Stages S0–S7 in doc 01; detailed work-package and gate tables are not included. |
| Source "corrections" (claims to remove/qualify) | 9 | §5 below |

# 4. Inconsistencies, gaps and resolutions
| ID | Observation in sources | Resolution here | Status |
|---|---|---|---|
| SI-01 | Product journey §5 says search returns "lexical, semantic and graph-derived candidates", while PRD-005 is lexical only (P0) and vector is optional (Arch §8) | v1.0 = exact + lexical; semantic is Later (ADR-008 Deferred); graph expansion v1.x | @R@ pending owner |
| SI-02 | Domain §4 "epistemic state" table mixes object kinds (source artifact, observation, hypothesis) with statuses (supported, disputed) | Object type and status separated into independent fields (doc 06 §5.2, ADR-026) | @R@ |
| SI-03 | "Reviewed conclusion" is listed as an epistemic *state*, yet Decision is a distinct type | Reviewed = `review_status`; Decision references reviewed items | @R@ |
| SI-04 | Roadmap Phase 4 bundles encrypted sync and AI assistance | Separate gates SG5-sync and SG5-AI; AI does not depend on sync | @R@ |
| SI-05 | PRD-006 (encrypted backup/sync) is P1 but Phase 3 exit gate demands "user can export and restore" | Plain export/backup/restore is P0 (FR-IO, FR-BAK); encrypted variants stay P1 (OQ-12) | @R@ |
| SI-06 | PRD-011 accessible graph navigation is P1, but the first-release slice includes graph navigation and WCAG 2.2 AA is a target | Accessible list navigation P0 (FR-NAV-001); visual graph P1 (FR-NAV-002) | @R@ |
| SI-07 | Arch doc places a NestJS "Personal Sync API"; the relay only stores ciphertext | Relay shape left open (ADR-013): framework not required for a ciphertext store | @OD@ |
| SI-08 | Pack cites "PostgreSQL 18" docs; no version policy | Pin a supported major at implementation; 18 listed as current on 2026-11-14 | @V@ L1 |
| SI-09 | Source proposes XChaCha20-Poly1305 although Web Crypto does not provide it (stated in the pack itself) | Algorithm suite left to ADR-007; both candidates evaluated | @OD@ |
| SI-10 | Two primary artefacts (LIVARA, Checklist) were not supplied | Limitation recorded; OQ-18 | @OD@ |
| SI-11 | Domain §12 asks whether cognitive objects / projects are first-class; Product doc lists projects in none of the MVP items | Collections are a grouping container, not Entity; Note is a separate type (OQ-13) | @R@ |
| SI-12 | Master ADR-006 "CRDT for document collaboration/sync" vs brief "Yjs vs Automerge or another synchronisation model"; Arch §9 separates multi-device sync from collaboration | ADR-006 broadened to "sync and conflict model"; collaboration out of scope (OQ-05) | @R@ |
| SI-13 | Pack has six relationship classes (Domain §7); the brief lists five (structural, semantic, temporal, provenance, analytical) | Seven predicate classes covering both (doc 06 §5.5) | @R@ |
| SI-14 | Domain §3.1 lists "Event" among entity types while §3 also defines Event-like concepts separately; the term "event" is also used for system/audit events | Event is its own type; "Application Event" is the software message term (Appendix G) | @R@ |

# 5. Source "corrections" carried forward
The pack lists claims to remove or qualify (Master §2): brain mapping (metaphor only), blind hashing (not a privacy boundary), zero-knowledge relay (define leakage), key shredding (conditional crypto-erasure), WebAuthn as hardware root (authentication, not key architecture), Merkle audit "immutable" (append-only + signed checkpoints + witnesses), causal DAGs (not proof of causation), 50k nodes at 60 FPS (benchmark profile), "FBI/NABU-ready / criminal attribution" (unsupported claim — removed). All are enforced in this package (see Appendix G disambiguations, doc 11 §5.7–5.9, doc 10 §5.5).

# 6. Items the brief asked for that the sources do not contain
Dates and effort; team/ownership; hosting/provider; jurisdictions; customer model; supported device matrix; language list; licence; measured performance; incident history. These appear as open questions (Appendix H) and are never filled by assumption.

# 7. Re-audit procedure
When originals are supplied: (1) extract requirements and diagrams; (2) diff against §3 counts; (3) log new inconsistencies as SI-n; (4) update requirements/ADRs/open questions; (5) re-run traceability checks.
