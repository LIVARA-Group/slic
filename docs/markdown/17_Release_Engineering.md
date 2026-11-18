# 1. Purpose
Define what "SLIC v1.0" means and the process for getting it released: preparation, acceptance, deployment, first production release, and versioned updates.

# 2. Scope
Personal Contour v1.0 release (primary). Release of Personal relay/sync (v1.x), AI (v1.x) and Investigative foundation (Inv-F) reuse the same process with their own gates.

# 3. Dependencies
Doc 16 (gates), docs 04/F (pipeline, environments), doc 01 (programme), Appendix E; Research Pack 01§9 (MVP boundary) @SD@.

# 4. Requirements
OPS-001, OPS-002, OPS-005, OPS-006, SEC-003, all P0 v1.0 requirements (doc 02 §4), acceptance matrix complete.

# 5. Design
## 5.1 Release definition
**SLIC v1.0 = the first complete user-facing Personal Contour release** @R@ (consistent with the pack's recommendation to build Personal first @SD@, OQ-02 may reverse the order but not the isolation).
| Included in v1.0 | Excluded (and why) |
|---|---|
| Capture + Inbox + drafts | Encrypted sync (SEC-004 review gate; v1.x) |
| Markdown notes with revisions and links | AI assistance (v1.x; staged after core stability) |
| Typed entities, aliases | Visual graph, timeline UI (POC-06/v1.x); accessible graph navigation **is** included |
| Typed bidirectional relations, backlinks | Entity merge/split UI, nested collections (v1.x) |
| Sources, observations with locators, claims with evidence (manual) | Hypothesis/Decision/Action UI (schema ready) |
| Attachments with hashes | Semantic search (Later); fuzzy search (v1.x) |
| Local persistence, storage health, integrity checker | Multi-user collaboration; Investigative runtime for users |
| Lexical search | Encrypted backup unless OQ-12/ADR-007 permit |
| Native export/import, backup/restore (plaintext, clearly labelled) | Desktop packaging (ADR-010) |
| WCAG 2.2 AA conformance | Forensic certification, legal-admissibility claims (never) |
Supported platforms: the browsers/devices declared in OQ-06 (@OD@) — v1.0 must not ship with an undeclared matrix.

## 5.2 Release preparation
Feature freeze (scope = §5.1) → release branch → version numbering (SemVer for the app; separate **schema version** and **export format version**) → build artefacts (hash, SBOM, signature) → database/schema migrations verified against N-1 fixtures → schema compatibility policy (reads N and N-1 exports) → configuration review → secrets review (none in artefacts) → release notes (changes, known limitations, migration notes) → documentation set updated (ADR statuses, open decisions, user docs).

## 5.3 Acceptance testing
Each P0 requirement for v1.0 has an acceptance entry (preconditions, test data, steps, expected result, failure conditions, evidence of passing) generated from the test catalogue — Section 5.7. Acceptance is executed on the declared matrix; evidence archived with run IDs and manifests.

## 5.4 Deployment
Build → artefact validation (hash/signature/SBOM) → deploy static client to staging → health checks → smoke + E2E on staging → promote to production → post-deployment verification → monitor; rollback = redeploy previous signed artefact; client-side data compatibility guaranteed by schema migration policy (a rollback must not leave local data unreadable: forward migrations are additive within a release train; destructive steps only in a later release after the rollback window) @R@. Personal v1.0 has no server data plane; Investigative releases additionally run DB migrations (expand/contract) and object-store checks.

## 5.5 First production release
| Item | Criterion |
|---|---|
| Release criteria | SG7 and doc 16 §12 gates satisfied for GP |
| Supported platforms | As declared; unsupported browsers see a capability screen |
| Known limitations | Published: browser storage is not guaranteed durable; backups are plaintext in v1.0 (unless OQ-12 resolves otherwise); no sync; no AI |
| Data backup requirements | In-app prompts + documentation; backup-age indicator |
| User documentation | Getting started, backup/restore, privacy statement (data local; no network features unless opted in), accessibility statement |
| Security disclosures | Vulnerability reporting channel and policy; no unsupported claims in copy |
| Support process | Triage categories, data-loss playbook (restore guidance), known-issue list |
| Incident procedure | Severity levels, communication, rollback, post-mortem |
| Version update strategy | Auto-update of the web client with migration safeguards (snapshot before migration), release channels (stable/beta), deprecation policy for export format |

## 5.6 Post-v1.0 trains
v1.x-A: fuzzy search, nested collections, entity merge/split, visual graph, timeline UI. v1.x-B: encrypted backup/sync (after SG5 crypto review). v1.x-C: AI proposals (after GA gate). Inv-F: Investigative foundation pilot (after SG6). Each train re-runs the full gate set relevant to its scope.


## 5.7 Acceptance matrix — Personal v1.0 P0 requirements
> **Acceptance-matrix gap:** The per-requirement acceptance cases are not included in this repository edition. The release scope above is a planning boundary, not evidence of acceptance. Restore the acceptance rows and link each P0 requirement to a reproducible test before declaring a release candidate ready.

# 6. Technology
CI/CD per doc 04; signing and SBOM tooling per SEC-003; feature flags for dark launches; static hosting for the client (COOP/COEP headers only if the selected storage engine requires them — POC-02).

# 7. Implementation
1. Freeze scope and cut the release branch (WP-085 start). 2. Run the full gate set on the declared browser matrix and archive evidence. 3. Execute N-1 upgrade, rollback and restore-from-backup rehearsals on staging. 4. Produce signed artefacts, SBOM, release notes and user documentation. 5. Obtain independent reviews required for client scope (security, accessibility). 6. Owner sign-off, production promotion, post-deployment verification, monitoring window. 7. Open the next train and record lessons in the risk register.

# 8. Data & Contracts
Release manifest `{version, schema_version, export_format_version, artefact_hashes, sbom_hash, migrations[], known_limitations_ref}`; release notes template; migration compatibility table.

# 9. Security
Signed artefacts; protected release branches; two-person approval for production promotion; secrets scan; dependency review; security.txt-style disclosure channel; no secrets/data in release logs.

# 10. Failure Handling
Failed health check → automatic rollback; migration failure on a user's device → restore snapshot and report; serious defect post-release → kill switch/feature flag, hotfix train, incident procedure; data-loss reports → playbook + restore guidance.

# 11. Testing
Pre-release: full gate set (doc 16 §12), upgrade tests from N-1 data, rollback test (T-OPS-002), browser-matrix run (T-BRW-001), documentation review (T-DOC-001).

# 12. Acceptance Criteria
v1.0 may be released when: all P0 v1.0 acceptance entries pass with archived evidence; independent reviews required for client scope are closed; known-limitations document published; rollback exercised; named owner signs release (WP-085).

# 13. Deliverables
Release candidate, signed artefacts, SBOM, release notes, user documentation, support playbook, release evidence archive.

# 14. Risks
RK-01 scope creep at freeze; RK-05 data loss reports; RK-14 accessibility regressions; undeclared platform expectations.

# 15. Open Decisions
OQ-06 (platforms), OQ-12 (encrypted backup), OQ-15 (licence/distribution), update channel mechanics, release owner.

# 16. References
Research Pack 01§9, 06§9–10 @SD@.
