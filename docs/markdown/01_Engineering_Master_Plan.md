# 1. Purpose
Define the engineering programme from the present research state to SLIC v1.0: stages, work packages, dependencies, critical path, parallel tracks, gates, and definitions of done. It sequences work by **risk reduction and dependency**, not by feature volume @SD@ (Validation doc §1).

# 2. Scope
Covers the Personal v1.0 delivery, the Investigative technical foundation and the gated advanced capabilities. It does not give dates, headcount or cost: those need team and capacity data (OQ-16). Instead §10 gives estimation criteria.

# 3. Dependencies
Inputs: Research Pack (@SD@), Source Register inconsistency log (sources/Source_Register), requirements catalogue (doc 02). Hard prerequisites: a named decision owner and ratified v1.0 scope (WP-002, SG0).

# 4. Requirements
Programme-level requirements: (a) every stage ends with a gate backed by archived evidence; (b) POC results precede dependent ADR acceptance; (c) the Investigative track proceeds in parallel but cannot weaken Personal isolation (ADR-002); (d) no encrypted-sync or encrypted-backup release before independent cryptographic review (SEC-004); (e) advanced capabilities ship only when their own gates pass.

# 5. Design

## 5.1 Programme structure
@@IMG|d21_wbs_dependencies|Figure 1.1 Programme stages (solid = sequential, dashed = parallel/optional)|@R@@@

| Stage | Name | Documents | Outcome |
|---|---|---|---|
| S0 | Foundation & Architecture | 01–04 | Ratified scope, requirements baseline, architecture baseline, CI skeleton |
| S1 | Technical Risk Validation | 05 | Executed POCs; ADR-004/005/017/019 decided; blockers known |
| S2 | Domain & Application Foundation | 06–07 | Schema, contracts, migrations, package scaffold, design system |
| S3 | Personal Core | 08–10 | Capture, notes, entities, relations, sources, search, accessible navigation |
| S4 | Integrity & Portability | 11–12 | Export/import, backup/restore, integrity checker, client security, privacy controls |
| S5 | Advanced Capabilities | 13–14 | Encrypted sync, AI proposals — each under its own gate |
| S6 | Investigative Technical Track | 15 | Separate backend, authorization, evidence, audit, sandbox |
| S7 | Production Validation & Release | 16–17 | Release candidate, acceptance, v1.0 |

## 5.2 Release definition (summary; full text in doc 17 §5)
**SLIC v1.0 = Personal Contour first user-facing release** @R@, consistent with the pack's MVP boundary @SD@: capture, notes, typed entities, bidirectional relations, local persistence, revisions, sources and provenance, lexical search, accessible basic graph navigation, attachments, import/export, backup/restore. Investigative receives its own foundation and proof (S6) but is not in the v1.0 user release. Sync, AI automation, visual graph, timeline UI, collaboration, causal modelling and forensic certification are post-v1.0 (**v1.x** or **Later**) unless the business reverses the order (OQ-02), in which case isolation (ADR-002) still holds.

## 5.3 Parallelism
- After SG0, WPs 010–020 (POCs) run in parallel; WP-019/020 (Investigative isolation/sandbox) depend only on infrastructure and threat model, not on Personal POCs.
- After SG2, Personal core WPs 041–049 are largely parallel (they share WP-040).
- The Investigative track (WP-070…076) can start once WP-019 and WP-006 are complete and may run alongside S3/S4 with a separate team.
- S5 WPs run only after their own prerequisites: WP-060 (crypto review) gates WP-061/062/063; WP-064 depends on WP-044 and WP-033, not on sync.

## 5.4 Critical path
Computed as the longest dependency chain by **work-package count** (no durations are known):
WP-001 → 002 → 005 → 007 → 010 → 011 → 021 → 031 → 034 → 040 → 044 → 050 → 051 → 080 → 085 (15 packages). It runs through the benchmark harness, the local-database POC and decision, schema, migration framework, storage engine, provenance, export/restore and E2E validation. Anything that delays POC-01, ADR-004 or the storage engine delays v1.0.

## 5.5 Architectural blockers
| Blocker | Blocks | Resolution |
|---|---|---|
| No decision owner / scope not ratified | all | WP-002, SG0 |
| ADR-004 local database | schema mapping, storage, search, attachments | WP-011/012, SG1 |
| OQ-04 authoritative object model | domain schema, export | WP-030 workshop, SG2 |
| OQ-06 device/browser matrix | storage guarantees, OPFS/COOP-COEP choices | declare before SG1 conclusion |
| ADR-007 + OQ-01 + OQ-08 | any sync or encrypted backup | WP-018 → WP-060 review |
| OQ-02/OQ-03 | Investigative identity, hosting, retention, legal | business/legal decisions before SG6 |

## 5.6 What can be deferred, and what cannot
Deferrable (with no effect on v1.0 architecture): visual graph (POC-06), timeline UI, semantic retrieval, AI, sync, Tauri, entity-merge UI, nested collections, Investigative analysis workflows (WP-076). **Not deferrable**: domain model, revision/provenance structures, bitemporal fields, locator strategy, export format, integrity checker, accessible navigation alternatives, contour isolation — retrofitting these is costly @R@.

# 6. Technology
Programme tooling @R@: Git + pull-request reviews; CI (doc 04); issue tracker mirroring the WP IDs; docs-as-code toolchain (Markdown + DOT, PDF build in CI). No product technology is selected here — see doc 02 §6.

# 7. Implementation
## 7.1 Work breakdown structure and dependency matrix
@@WP@@
The "Depends on" column is the dependency matrix; Figure 1.1 is its stage-level view.

## 7.2 Stage gates
@@GATES@@

## 7.3 Critical decisions register
| Decision | ADR / OQ | Needed by | Evidence needed |
|---|---|---|---|
| Ratify v1.0 scope and owner | WP-002 | SG0 | Recorded decision |
| Local database engine | ADR-004 | SG1 | POC-01, POC-02 |
| Graph persistence | ADR-005 | SG1 | POC-03 |
| Lexical engine | ADR-017 | SG1 | POC-04 |
| Epistemic/object model | ADR-026, OQ-04 | SG2 | Domain workshop on fixtures |
| Revision, time, locator models | ADR-014/015/016 | SG2 | Executable invariants |
| Encryption + recovery | ADR-007 | before WP-061/062 | POC-08 + independent review |
| Investigative auth stack, hosting | ADR-020/022, OQ-02/03 | SG6 | Business + legal input |

# 8. Data & Contracts
Programme data: WP table (§7.1), gate criteria (§7.2), and the shared requirement/test/ADR identifiers (docs 02, Appendices A, E). Identifier formats: PRD-nnn, FR/SEC/…-nnn, ADR-nnn, OQ-nn, RK-nn, WP-nnn, POC-nn, T-AREA-nnn, SG-n.

# 9. Security
Programme security controls: threat-model baseline before architecture approval (WP-008); no shared credentials or pipelines between contours; independent review gates for cryptography (SG5) and Investigative isolation (SG6).

# 10. Failure Handling
| Failure | Response |
|---|---|
| POC shows no candidate meets hard gates | Re-scope (e.g. reduce attachment limits, narrow browser matrix), revisit ADR-010 trigger, or re-plan S3 — recorded as new ADR |
| Decision owner unavailable | Proposed ADRs age visibly (RK-16); SG0 cannot pass |
| Gate evidence incomplete | Gate fails; no "conditional pass" without a recorded risk acceptance by the owner |
| Independent crypto review finds high issues | WP-061/062/063 do not start; protocol revised under new ADR |

## Effort estimation criteria
Estimate each WP after SG0 using: (a) new vs reused components; (b) number of requirements and tests it owns (Appendix E); (c) POC uncertainty remaining; (d) browser-matrix multiplier (OQ-06); (e) accessibility and security review overhead; (f) external review lead times (cryptography, penetration test). Report ranges, not points.

# 11. Testing
Each gate lists evidence types: archived test runs (Appendix E gates GP/GS/GA/GI), POC raw results (doc 05), review records. Programme-level checks include the mechanical traceability checks in the QA Report.

# 12. Acceptance Criteria — Definition of Done by stage
| Stage | Done when |
|---|---|
| S0 | SG0 criteria satisfied |
| S1 | SG1 criteria satisfied; second engineer reproduces at least POC-01 results |
| S2 | SG2 criteria; domain invariants executable as tests |
| S3 | SG3 criteria; Personal P0 FR tests green on declared matrix |
| S4 | SG4 criteria; backup/restore drill with tamper cases passed |
| S5 | SG5 criteria per capability (sync and AI independent) |
| S6 | SG6 criteria; independent evidence verifier passes |
| S7 | SG7 criteria; release gates in doc 16 §12 |

# 13. Deliverables
Ratified scope decision; baselined requirements; accepted/rejected ADRs; POC reports; schemas and contracts; implementation per WP; gate evidence archive; release candidate; this documentation set kept current.

# 14. Risks
Programme risks RK-01, RK-02, RK-11, RK-15, RK-16 (Appendix H) are the most relevant. Scope explosion is the most probable; the mitigation is the gate discipline and the explicit v1.0 slice.

# 15. Open Decisions
OQ-02 (Investigative nature), OQ-06 (device matrix), OQ-16 (capacity), WP-002 (decision owner). Source inconsistencies resolved provisionally here are listed in `sources/Source_Register.pdf` (SI-01…SI-14), notably: SI-04 (the pack bundles sync and AI in one phase; here they are separate gates), SI-05 and SI-06 (export/restore and accessible graph navigation are pulled into v1.0 although their source priorities are P1).

# 16. References
Research Pack: 00 §8–10; 06 §2–3, §9–10 @SD@. Method: staged risk reduction (pack 06 §1).
