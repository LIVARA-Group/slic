# 1. Purpose
Establish the requirements catalogue, the technology baseline status table, and the ADR system that all later documents build on.

# 2. Scope
Requirements for both contours at the level needed to derive architecture and tests; ADR structure and handling. Detailed designs live in later documents.

# 3. Dependencies
Research Pack docs 01 (requirements), 00 (decision register), 06 (readiness criteria). Decisions pending: OQ-04, OQ-06.

# 4. Requirements
## 4.1 Conventions
Priorities: **P0** required for the release named in its *Release* column; **P1** required but may follow; **P2** optional; **Deferred** explicitly not now. *Release* values: v1.0 (Personal), v1.x (Personal after v1.0), Inv-F (Investigative foundation), Later. Source column: `SD:<doc>§` = Research Pack; `ER` = this programme (@R@). Every requirement has an ID, priority, parent PRD, source, release, and verifying tests (Appendix E).

The twelve source PRD-IDs are preserved as **parents**; the catalogue refines them into 74 requirements.

| PRD | Source requirement @SD@ | Source priority | Refined here as |
|---|---|---|---|
| PRD-001 | Local-first capture and editing | P0 | FR-CAP-*, FR-NOT-001, FR-ATT-001, FR-IO-*, FR-BAK-001, FR-STO-001, REL-*, SEC-002/003, PRV-002, PERF-001, OPS-* |
| PRD-002 | Bidirectional links and typed entities | P0 | FR-NOT-002, FR-ENT-*, FR-REL-*, FR-COL-*, INT-001 |
| PRD-003 | Temporal revisions | P0 | FR-NOT-003, FR-TL-001, INT-002, INT-004 |
| PRD-004 | Source and claim provenance | P0 | FR-SRC-*, FR-HYP-001, INT-003 |
| PRD-005 | Local lexical search | P0 | FR-SRCH-* |
| PRD-006 | Encrypted backup/sync | P1 | FR-SYN-*, SEC-004/005, PRV-001/003 |
| PRD-007 | AI proposals with review | P1 | FR-AI-*, INT-005, SEC-010 |
| PRD-008 | Case authorization and role policy | P0 (Inv.) | FR-INV-001/002/007/009, SEC-006/008/009, PRV-004 |
| PRD-009 | Evidence custody events | P0 (Inv.) | FR-INV-003..006, SEC-007, OPS-003/004 |
| PRD-010 | Dossier export | P1 (Inv.) | FR-INV-008 |
| PRD-011 | Accessible graph navigation | P1 | FR-NAV-*, A11Y-001 |
| PRD-012 | Cross-contour transfer | Deferred | FR-XFR-001, SEC-001 |

**Priority departures from the source (all @R@, flagged for owner ratification):** FR-NAV-001 (accessible list navigation) is P0 for v1.0 because the v1.0 slice includes graph navigation (SI-06); FR-BAK-001/FR-IO-* are P0 because the pack's Phase 3 exit gate requires "export and restore" (SI-05) while encrypted backup/sync stays P1; A11Y-001 is P0 because WCAG 2.2 AA is the pack's stated target @SD@.

## 4.2 Functional requirements — Personal and shared
> **Catalogue gap:** The detailed Personal/shared requirement rows are not included in this repository edition. The parent PRDs and scope summary above remain useful for orientation, but do not substitute for individually testable requirements. Appendix E is also missing its generated test rows; restore both catalogues before treating traceability as complete.
## 4.3 Functional requirements — Investigative
> **Catalogue gap:** The detailed Investigative requirement rows are not included in this repository edition. This is not evidence that the Investigative scope is empty; consult the parent PRDs above and the [Investigative Contour Foundation](15_Investigative_Contour_Foundation.md). Restore the requirement rows before implementation planning.
## 4.4 Non-functional requirements by category
Categories by ID prefix: **REL** reliability, **INT** data integrity, **SEC** security, **PRV** privacy, **PERF** performance, **A11Y** accessibility, **OPS** operational.
> **Catalogue gap:** The detailed non-functional requirement rows are not included in this repository edition. The category definitions and selected constraints in this document are summaries, not a complete acceptance baseline. See [Security and Data Integrity](11_Security_and_Data_Integrity.md) and [Testing and Production Readiness](16_Testing_and_Production_Readiness.md) for the related design guidance.
Performance requirement PERF-001 deliberately contains **no numeric SLA**. The source targets — 50k nodes at 60 FPS, sub-15 ms typing, sub-80 MB runtime — are *benchmark targets* @SD@ to be turned into named profiles (small/medium/large) and measured; thresholds are ratified by the product owner after a baseline (RK-13).

# 5. Design
## 5.1 Principles inherited from the Research Pack @SD@
1 No implicit cross-contour data flow. 2 Isolation spans storage, identity/session, keys, processing/ingestion and audit. 3 Any transfer is explicit, authorised and verifiable. 4 AI output is never automatically a verified fact. 5 Source, Observation, Claim, Hypothesis, Decision and Event are distinct types. 6 Every analytical statement traces to source and transformations. 7 Valid time ≠ transaction time. 8 A hash does not prove truth or lawful acquisition. 9 Graph topology does not prove causation. 10 Append-only audit/Merkle structures give no automatic legal guarantee.

## 5.2 Engineering invariants added @R@
11 Local persistence is a subsystem with its own correctness tests, not a library call. 12 Derived data (indexes, embeddings, caches) is always rebuildable from canonical records. 13 Every network-visible field has a declared leakage entry before shipping (PRV-001). 14 Telemetry and logs never carry content. 15 Shared code between contours is limited to pure, side-effect-free packages.

# 6. Technology
## 6.1 Baseline status table
| Area | Research Pack direction @SD@ | Status here | Constraint |
|---|---|---|---|
| Frontend | React + TypeScript + Vite | @R@ | UI library only; not the persistence architecture |
| Routing / remote state | TanStack Router / Query | @R@ | Query cache is never the local source of truth (ADR-025) |
| Local persistence | IndexedDB / SQLite-WASM / OPFS | @OD@ ADR-004 | Decide by POC-01/02 |
| Backend | NestJS | @R@ | Not itself an isolation boundary (ADR-013) |
| Investigative DB | PostgreSQL | @R@ ADR-003 | Not automatically the Personal vault |
| ORM | Drizzle | @R@ | Does not replace constraints, transactions, authorization, migrations; Investigative only |
| Graph | Relational adjacency / recursive CTE | @R@ ADR-005 | Dedicated graph engine only after measured failure |
| Search | Lexical first, vector optional | @R@ ADR-017/008 | Measure each retriever before fusing |
| Background | Web Workers | @R@ | POC-05 |
| Sync | Yjs / Automerge / custom | @OD@ ADR-006 | CRDT is not a domain-conflict solution |
| Encryption | Reviewed envelope protocol | @OD@ ADR-007 | Security-critical; review mandatory |
| Desktop | Tauri | Deferred ADR-010 | Only if browser validation fails |
| Object storage | S3-compatible or managed | Candidate (ADR-022 deferred) | Provider not chosen |
| AI | Gateway + local/remote adapters | @R@ ADR-023 | Default off; no autonomous writes |

## 6.2 Ground rules for adopting a technology
A technology enters the baseline only with: (1) the requirement it serves, (2) alternatives compared, (3) a validation step (POC or standards check), (4) known failure modes and exit cost, (5) licence and supply-chain review (SEC-003), (6) an ADR.

# 7. Implementation
## 7.1 ADR system
Template fields (every record in Appendix A): ADR ID, Title, Status, Context, Problem, Decision Drivers, Options Considered, Chosen Option, Why This Option, Rejected Alternatives, Consequences, Security Implications, Performance Implications, Migration Implications, Validation Evidence, Dependencies, Review Date. Statuses: Proposed, Accepted, Rejected, Superseded, Deferred.

## 7.2 Process
1. Author opens a PR adding an ADR (status Proposed). 2. Reviewers include an architect and, for security/privacy-affecting ADRs, a security reviewer. 3. Acceptance requires the *Validation evidence* items to exist and a named owner's approval. 4. Supersession creates a new ADR; the old one is marked Superseded with a link. 5. Gate reviews check ADR statuses (SG0, SG1, SG2).

## 7.3 Current ADR set
The authoritative decision register belongs in [Appendix A](../appendices/A_Architecture_Decision_Records.md). Its detailed register is not present in this repository edition; the technology status table above records only the decisions and proposals explicitly summarized here. Confirm status and validation evidence in Appendix A before relying on any decision.

# 8. Data & Contracts
Requirement record: `{id, title, priority, scope, parent_prd, source, release, verified_by[]}`; test record: Appendix E; ADR record: Appendix A. These are generated from structured data so cross-references cannot drift.

# 9. Security
Security and privacy requirements are in §4.4 (SEC-, PRV-). Release security gates from the pack @SD@: signed threat models per contour; independent crypto review; cross-tenant and cross-contour negative tests in CI and staging; independently tested custody/audit verification; exercised runbooks; no unsupported claims ("unhackable", "immutable", "anonymous", "zero metadata").

# 10. Failure Handling
Requirement conflicts or ambiguity are logged as open questions (Appendix H), not resolved silently. A requirement without a feasible test is rewritten until it can be verified or is demoted to a documented constraint.

# 11. Testing
Mechanical checks: each requirement has ≥1 test; each test traces to ≥1 requirement; each requirement maps to ≥1 WP (QA Report). Semantic review is performed per gate.

# 12. Acceptance Criteria
SG0: requirements baseline approved by the owner; ADR process operating; every P0 requirement has verification defined.

# 13. Deliverables
Approved requirements baseline; ADR repository; technology baseline table kept current.

# 14. Risks
RK-13 targets taken as promises; RK-15 documentation drift; RK-16 decision bottleneck.

# 15. Open Decisions
OQ-04, OQ-06, OQ-07 (meaning of "100% verifiable provenance"; proposed operational definition in doc 06 §5.4), OQ-15 (licence).

# 16. References
Research Pack: 01 §6–9; 00 §5–7; 06 §8–10 @SD@. Standards: WCAG 2.2 (W3C) — pack-cited, level 3 in the reference register.
