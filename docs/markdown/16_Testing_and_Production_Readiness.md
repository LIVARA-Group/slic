# 1. Purpose
Define how SLIC is shown to work correctly, safely and stably: test strategy, performance profiles, accessibility, security testing, operational readiness and production gates. A component is not ready because its interface works.

# 2. Scope
Both contours; Personal v1.0 gates (GP) first, then sync (GS), AI (GA), Investigative foundation (GI). Test definitions live in Appendix E (109 tests); this document explains strategy and gates.

# 3. Dependencies
Docs 02, 05, 08, 11, 15; Research Pack 06§4–5, 06§9–10, 04§12–13 @SD@.

# 4. Requirements
OPS-001…006, PERF-001, A11Y-001, SEC-003, REL-001…003, INT-001…005; every P0 requirement has an acceptance entry (Appendix E §4 and doc 17 §5.7).

# 5. Design
## 5.1 Test strategy by level @SD@/@R@
| Level | Scope | Examples (Appendix E) | Runs |
|---|---|---|---|
| Unit | Domain invariants, entity validation, relation constraints, temporal semantics, provenance, revision ordering, authorization policy functions, serialisation, crypto envelope handling | T-REL-001, T-TMP-001/002, T-EPI-001, T-CRY-002 | Every commit |
| Integration | Local DB adapters, PostgreSQL transactions and RLS, object storage, queue retry/idempotency, local search, sync, backup, restore, import/export | T-STO-*, T-INV-003, T-ING-002, T-BAK-*, T-IO-* | Every PR / nightly |
| Property-based | Graph invariants, CRDT convergence, revision ordering, idempotency, serialisation round trips, nonce uniqueness, data consistency | T-PRP-001…005 | Nightly with fixed + random seeds (failing seeds recorded) |
| End-to-end | Offline capture, edit, restart, search, navigation, export/import, restore, sync, device revocation, investigative authorization, evidence custody, dossier export | T-E2E-001/004, T-SYN-004, T-INV-002 | Nightly + release |
| Security | XSS, CSRF, SSRF, IDOR, SQL injection, cross-tenant leakage, privilege escalation, malicious file parsing, prompt injection, supply chain, secrets exposure | T-SEC-*, T-ING-003/004, T-AI-004 | Every PR (fast set) + release (full) |
| Performance | Named profiles (§5.3) | T-PERF-001…004 | Nightly trend + release |
| Accessibility | Keyboard, screen readers, focus, forms, contrast, graph alternatives, errors, responsive | T-A11Y-001/002/003 | Automated per PR; manual per release |
| Operational | Backup/restore, key compromise, failover, object-store recovery, queue backlog, telemetry redaction | T-OPS-003/004 | Drills |
Crash-injection and conformance suites (doc 08) are first-class. Test data is synthetic; generators are versioned (WP-010).

## 5.2 Test pyramid and flakiness policy
Prefer many fast unit/property tests; keep E2E to journeys. A flaky test is a defect: quarantined with an owner and expiry, never ignored. Every gate test is deterministic or seeded and records the seed.

## 5.3 Performance profiles (no invented SLAs)
| Profile | Dataset | Workload |
|---|---|---|
| Small | DS-P-S (≈1k objects) | capture, open, search, backlinks |
| Medium | DS-P-M (≈10k) | as above + mixed edits |
| Large | DS-P-L (≈100k) + large attachments | open, search, neighbourhood, import/export, backup |
| Dense graph | DS-G hub profile | 1–5 hop traversal, pagination |
| Search-heavy | DS-T | exact/lexical mix, incremental indexing during queries |
| Concurrent | 2 tabs + workers | write/read mix, no starvation |
| Offline/reconnect | scripted | outbox growth, resume (sync release) |
Targets are set **only after** measurement on named reference hardware and product agreement; reports include p50/p95/p99, environment manifest and raw data. Source targets (50k nodes at 60 FPS, sub-15 ms typing, sub-80 MB runtime) remain targets @SD@.

## 5.4 Accessibility
Conformance target WCAG 2.2 AA @SD@. Checks: keyboard navigation, screen readers (≥2 combinations declared in OQ-06), focus management (dialogs, route changes), forms and error messaging, contrast, reflow at 320 CSS px, reduced motion, graph alternatives (lists/trees/tables), responsive layout. Automated tools catch only part of issues; manual testing is mandatory per release (T-A11Y-002/003).

## 5.5 Security and privacy testing
Pass criteria per Research Pack 04§12 @SD@: tenant isolation (no data, counts, snippets or metadata leaks), RLS bypass attempts, XSS/key exposure, sync replay, recovery, crypto-erasure inspection, evidence tamper, prompt injection, insider abuse, restore drills. Canary strings validate PRV-002. Independent penetration test and cryptography review are scheduled before the relevant releases (SG5/SG6/SG7).

## 5.6 Observability and privacy
Telemetry per contour @SD@: Personal opt-in and content-free (no note bodies, search terms, graph labels, attachment names, decrypted identifiers); Investigative operational events access-controlled and retention-governed; correlation IDs without content; secrets redacted; **logs are not an audit ledger**. Monitor: service health, queue lag, sync failures, storage pressure, search latency, policy denials, integrity failures, backup age. Alert on: anomalous export volume, repeated authorization failures, unusual case access, custody discontinuities.

## 5.7 SLO/SLI proposals (@OD@, to be set after baselines)
| Contour | SLI candidates |
|---|---|
| Personal local | durable-commit success rate; storage-health warnings shown; backup age; crash-recovery success |
| Personal relay | availability; push/pull success; replay-rejection counts |
| Investigative | availability; p95 latency; ingestion queue lag; audit-checkpoint verification success; restore-test success |
Availability targets are set separately for Personal local operation and Investigative hosted operation @SD@ (01§7).

## 5.8 Operational readiness and runbooks
Backup/restore drills; disaster recovery (RPO/RTO from OQ-10); incident response; rollback; **migration rollback strategy** (expand/contract; snapshots for Personal); support procedures. Runbooks (exercised before release): key compromise; breach assessment; restore (database + object store + audit chain); failed deployment/rollback; parser incident; suspected cross-tenant leak; lost-vault support policy (no provider recovery possible).

# 6. Technology
Candidate tooling (@R@): unit/integration runner, property-testing library, Playwright-class browser automation across the browser matrix, axe-class automated a11y checks plus manual screen-reader scripts, load/benchmark harness in `test-kit`, SAST/secret/dependency scanners, DAST for Investigative staging, fuzzers for parsers/envelopes. Selection at SG0/SG2.

# 7. Implementation
1. Test harness and fixtures (WP-010). 2. Contract and conformance suites alongside each subsystem. 3. CI wiring with fast/full sets (WP-007/083). 4. E2E suites per journey (WP-080). 5. Performance trend jobs (WP-081). 6. Accessibility pipeline (WP-082). 7. Drills (WP-084). 8. Traceability report generated from data (QA Report).

# 8. Data & Contracts
Test records (Appendix E), result artefact schema `{test_id, run_id, commit, env, seed, result, evidence_uri}`, evidence archive retention policy, traceability export.

# 9. Security
Test environments hold synthetic data only; hostile corpora handled as malware samples; red-team credentials separate; findings tracked with severity and expiry of waivers.

# 10. Failure Handling
Failing gate test blocks release; waivers require owner approval, expiry and risk entry (Appendix H); flaky tests quarantined with deadlines; inability to reproduce a failure is itself investigated.

# 11. Testing
Tests of the test system: generator determinism, ledger correctness, traceability checks (each requirement ↔ test ↔ WP), regression of past incidents.

# 12. Acceptance Criteria — production gates
No component is production-ready merely because its interface works. For each release the following gates must all pass @SD@ (06§10) and be evidenced:
| Gate | Required evidence | Applies to |
|---|---|---|
| Product acceptance | User task completion, usability evidence, support and export documentation; acceptance matrix (App. E §4) complete | GP |
| Data integrity acceptance | Migration, backup, restore, retention and deletion behaviour verified; integrity checker clean | GP, GI |
| Security review | Threat model signed; independent review; penetration test; key management; incident runbooks | GS, GI; GP for client scope |
| Isolation tests | Automated tenant/case/cross-contour negative tests + deployment boundary review | GP (cross-contour), GI |
| Backup/restore verification | Drill with tamper cases and recorded RPO/RTO | GP (Personal restore), GI |
| Performance validation | Named profiles measured, targets ratified, no regressions | GP |
| Accessibility verification | WCAG 2.2 AA automated + manual report | GP |
| Operational readiness | SLOs, monitoring, on-call ownership, DR and rollback tested | GI; Personal relay when shipped |
| AI gate | Gold-set metrics, injection red-team, human-review controls, model registry | GA |
| Evidence gate | Hash verification, custody history, timestamp validation, export verification | GI/GX |
| Legal/privacy review | Jurisdiction-specific review, lawful basis, DPIA where required, contracts, retention policy | Investigative and any network feature |

# 13. Deliverables
Test suites, fixtures, CI jobs, performance and accessibility reports, drill records, runbooks, gate evidence archive, traceability report.

# 14. Risks
RK-13, RK-14, RK-05; test-environment drift; insufficient device coverage; over-reliance on automated a11y tools.

# 15. Open Decisions
Browser/device matrix (OQ-06); threshold ratification (doc 05 §4.2); SLO targets; penetration-test vendor/timing; audit-sink failure policy (doc 15 §10).

# 16. References
Research Pack 06§4–5, §9–10, 04§12–13 @SD@; WCAG 2.2 (pack-cited).
