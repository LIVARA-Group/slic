# 1. Purpose
Define the technical structure of SLIC: actors, containers, components, trust and failure boundaries, data flows, and how the two contours stay separate. Each diagram states which parts are source-derived and which are proposals.

# 2. Scope
Logical and deployment architecture of both contours. Detailed designs: storage (08), domain (06), application (07), security (11), sync (14), investigative (15), infrastructure (04, App. F).

# 3. Dependencies
Doc 02 (requirements, ADR statuses); Research Pack 00 §5–6, 03 §2–5 @SD@. Open: ADR-001, 004, 013 (backend shape), OQ-02, OQ-06.

# 4. Requirements
| Architectural requirement | Source |
|---|---|
| AR-1 Two contours with separate storage, identity/session, keys, processing/ingestion, audit (SEC-001) | @SD@ 00§6 |
| AR-2 Modular monolith per contour as initial backend shape; no microservices without evidence | @SD@ 00§5 |
| AR-3 Local persistence is authoritative for Personal; server is optional ciphertext relay | @SD@ 01§2.1 |
| AR-4 Module boundaries follow domain boundaries with typed in-process interfaces | @R@ |
| AR-5 Untrusted-content processing isolated from privileged services | @SD@ 04§3 |
| AR-6 Every failure boundary has a defined degraded behaviour (§10) | @R@ |
| AR-7 Shared packages are pure and contain no identity, key, storage or audit code | @SD@ 01§3, enforced @R@ |

# 5. Design
## 5.1 System context
@@IMG|d02_c4_context|Figure 3.1 C4 level 1 — System context (actors and external systems are proposals; separation of trust models is Source-derived)|@SD@/@R@@@
Actors: Personal owner; Analyst, Supervisor, Custodian, Auditor, Platform administrator @SD@ (01§4). External systems: identity/authenticators, AI providers (tiered), external sources, optional timestamp authority/witness, object storage (provider not selected, ADR-022). **Platform administrator status never implies plaintext access** @SD@.

## 5.2 Contour separation
@@IMG|d01_contour_separation|Figure 3.2 Personal / Investigative separation (isolation axes @SD@; "Shared" package restriction @R@)|@SD@/@R@@@
Isolation axes and how each is realised:
| Axis | Personal | Investigative | Enforcement |
|---|---|---|---|
| Storage | Local store in the user's browser origin; optional ciphertext relay store | PostgreSQL + evidence object store | Separate origins, separate datastores, no shared namespace; T-ISO-001/003 |
| Identity / session | Device-bound credentials to relay; no account needed for local use | Organisation identity, strong authentication, step-up | Separate IdP clients, cookies/origins; no token accepted by both |
| Key hierarchy | Vault/device/object keys held by user | Service/KMS keys under organisational control | Different key stores and algorithms permitted; no key wrapping across |
| Processing / ingestion | Local workers | Server job queue + sandboxed parsers | Separate queues and workers; no shared worker pool |
| Audit | User-visible activity/revision history | Tamper-evident audit chain | Separate stores and verification tools |

## 5.3 Containers
@@IMG|d03_c4_container|Figure 3.3 C4 level 2 — Containers (technology labels are the baseline @R@; local persistence is @OD@)|@R@@@
| Container | Responsibility | Trust |
|---|---|---|
| Personal web client | UI, application layer, domain core | Trusted only while unlocked |
| Workers | Storage access, indexing, crypto, parsing off the main thread | Same origin as client |
| Local persistence | Canonical records, revisions, blobs, derived indexes | Plaintext unless OQ-11 decides otherwise |
| Sync relay | Authenticates devices, stores ciphertext, cursors | Honest-but-curious: sees metadata |
| Investigative web client | Analyst UI | Untrusted client; server authorises |
| Investigative API | Domain services, policy enforcement, audit | Trusted computing base of the contour |
| Job queue + parser workers | Ingestion in sandbox | Untrusted input; no credentials |
| PostgreSQL / object store | System of record / evidence bytes | Access via least-privilege service identities |
| AI gateway | Model routing, prompt assembly | Policy gate; no autonomous writes |

## 5.4 Components
@@IMG|d04_personal_components|Figure 3.4 Personal Contour components (v1.0: all solid; dashed = deferred)|@R@@@
Layering and rules: Shell → application services → Domain Core → repository interfaces → storage engine adapter. Services depend on Domain Core and repository **interfaces**, never on a concrete engine. Search and graph read through the query port; indexes are derived and rebuildable.

@@IMG|d05_investigative_components|Figure 3.5 Investigative Contour components (logical modules inside a modular monolith; extraction to services only on evidence)|@R@@@
Rules: every module call passes an authorization context; **Authorization** is the only module allowed to answer "may X do Y on Z"; Parser Workers return only validated, schema-checked output; AI Gateway output goes to staging, never to canonical tables.

## 5.5 Deployment
@@IMG|d06_deployment|Figure 3.6 Deployment topology (proposal; provider and sizing are @OD@, ADR-022)|@R@@@
Production Personal and Investigative live in separate accounts/projects with separate secrets, networks and backups @SD@ (03§11, 06§7). An air-gapped Investigative profile is a separate deployment profile with its own update and model distribution @SD@.

## 5.6 Data flows
@@IMG|d08_data_flow|Figure 3.7 Data flow diagrams (Personal capture to derived data; Investigative acquisition to analysis)|@R@@@
@@IMG|s01_capture_sequence|Figure 3.8 Sequence — offline capture (ack only after durable commit; indexing is asynchronous)|@R@@@
@@IMG|s03_evidence_sequence|Figure 3.9 Sequence — authorised evidence ingestion|@R@@@

## 5.7 Trust boundaries
@@IMG|d07_trust_boundaries|Figure 3.10 Trust boundaries TB1–TB4 (boundaries @SD@ 04§3; controls @R@)|@SD@/@R@@@
Controls per boundary are specified in doc 11 §5 and Appendix D.

# 6. Technology
Per doc 02 §6.1. Architecture-relevant constraints: web-first TypeScript (ADR-001, Proposed); NestJS only as module container, not a security boundary; PostgreSQL for Investigative (ADR-003); Personal local engine open (ADR-004). Browser features that influence the architecture and need verification per OQ-06: persistent-storage requests @V@ (MDN, level 1), OPFS availability in workers @SD@ + level 2, WebAuthn/passkeys @SD@, WebGPU (limited availability, secure contexts) @SD@.

# 7. Implementation
## 7.1 Module boundary rules @R@
1. A module exposes a TypeScript interface and event types; internals are not importable (enforced by lint, T-ISO-001).
2. Dependencies point inward: Presentation → Application → Domain; Infrastructure implements Domain-defined ports.
3. Contour packages (`personal/*`, `investigative/*`) may import only from `shared/pure/*` and never from each other.
4. `shared/pure` contains vocabulary types, validators and UI components with no I/O, no storage, no network, no key handling.
5. Cross-module state changes go through commands; reads through query ports; events are notifications, not RPC.

## 7.2 Failure boundaries
Defined in §10. Each boundary has a timeout, a retry policy and a degraded mode; none may produce partial commits.

# 8. Data & Contracts
Operation, event and error contracts are in Appendix C; the domain model and schemas in doc 06 and Appendix B. Module interfaces follow the same naming as Appendix C operations.

# 9. Security
| Boundary | Data crossing | Required controls (@SD@ 04§3, details @R@) |
|---|---|---|
| Browser ↔ Local storage | Plaintext records | Origin isolation, CSP, no secrets in DOM, storage health, optional app lock (OQ-11) |
| Browser ↔ Personal relay | Ciphertext + minimal metadata | TLS, device auth, AEAD envelopes with AAD, replay protection, rate limits |
| Browser ↔ Investigative API | Plaintext case data | TLS, strong auth, server-side case-scoped authorization, CSRF/XSS defences, audit |
| API ↔ DB | Queries/records | Least-privilege non-owner role, parameterised queries, FORCE RLS as defence in depth |
| API ↔ Object store | Evidence/exports | Separate buckets, versioning/retention, signed access, hash verification |
| Parser ↔ Untrusted content | Hostile bytes | Sandbox, no credentials, resource limits, no egress |
| AI ↔ Retrieved context | Excerpts + instructions | Data-tier policy, delimiting, output validation, no autonomous write |
| Personal ↔ Investigative | None by default | Deferred explicit reviewed workflow |

# 10. Failure Handling
| Boundary | Failure | Degraded behaviour |
|---|---|---|
| Local persistence | Quota exceeded, eviction, storage error | Typed error, no partial commit, export prompt, health UI |
| Worker | Crash/timeout | Restart worker; in-flight job retried idempotently; UI shows pending index state |
| Index | Corrupt/outdated | Rebuild from canonical records; search falls back to scan with notice |
| Relay | Unreachable | Local operation continues; outbox grows; limit with user notice |
| API/DB (Inv) | Database failover | Read-only mode until primary healthy; no unaudited writes |
| Object store | Unavailable | Ingestion paused; originals never written partially (verify hash before commit) |
| Parser | Resource limit, crash | Job fails closed; evidence untouched; audit event |
| AI provider | Unavailable/denied | Feature unavailable; no effect on canonical data |

# 11. Testing
Architecture conformance tests: T-ISO-001 (dependency graph), T-ISO-002/003 (runtime and deployment), failure-injection tests listed in doc 08 and doc 16.

# 12. Acceptance Criteria
SG0/SG2: architecture review signed by architect and security reviewer; boundary lint active and blocking; deployment boundary checklist complete (T-ISO-003) before first staging deployment.

# 13. Deliverables
Approved diagrams (sources in `source_package/diagrams`), module interface definitions, boundary lint configuration, trust-boundary table.

# 14. Risks
RK-02 contour coupling; RK-18 parser exploitation; RK-12 supply chain. Trade-off: duplicated infrastructure and pipelines cost more but are what makes isolation testable.

# 15. Open Decisions
ADR-001 (confirm), ADR-013 (relay shape; SI-07), ADR-022 (hosting), OQ-02, OQ-06, OQ-11.

# 16. References
Research Pack 00§5–6, 03§2–5, 04§3 @SD@. C4 model is used as a diagram convention only (no normative claim).
