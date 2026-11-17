# 1. Purpose
Specify the frontend and application layer so that implementation does not become a set of unrelated components: layers, dependency rules, services, state classes, worker contracts and design-system rules.

# 2. Scope
Personal web client (v1.0) and the shared UI/vocabulary packages; Investigative client follows the same layering with its own session/identity code. Storage internals: doc 08.

# 3. Dependencies
Doc 03 (components, boundary rules), doc 06 (domain), Appendix C (contracts). Open: ADR-001, ADR-025, OQ-06 (browsers), OQ-14 (languages).

# 4. Requirements
A11Y-001 (WCAG 2.2 AA), SEC-002 (XSS-safe rendering, CSP), PRV-002, REL-001 (ack after commit), FR-NAV-001, PERF-001. State rule @SD@: TanStack Query is not the source of truth for local data.

# 5. Design
## 5.1 Frontend baseline
| Concern | Baseline @SD@/@R@ | Status | Note |
|---|---|---|---|
| UI | React + TypeScript + Vite | @R@ | Rendering/interaction only |
| Routing | TanStack Router | @R@ | Typed routes, deep links; route guards are UX, not security |
| Remote state | TanStack Query | @R@ | Only for network resources (relay status, Investigative API) |
| Validation | Zod | @R@ | Same schemas as contracts |
| Concurrency | Web Workers | @R@ | Storage, search, crypto, parsing (POC-05) |
Final configuration is confirmed after POC-01/05 and the browser matrix; nothing here constrains the storage decision.

## 5.2 Layers and dependency rules
| Layer | Responsibility | May depend on |
|---|---|---|
| Presentation | Components, routes, forms, a11y, rendering of sanitised content | Application hooks, design system |
| Application | Commands/queries, use-case orchestration, event subscriptions, validation at boundaries | Domain, ports |
| Domain | Types, invariants, predicate registry, state machines — pure, no I/O | nothing |
| Infrastructure | Implements ports: storage adapters, worker bridges, crypto, network clients | Domain, ports |
| Persistence adapters | IndexedDB / SQLite-OPFS / blob store behind repository ports | Infrastructure |
Dependencies point inward; Domain imports nothing from other layers; presentation never touches adapters directly (lint-enforced).

## 5.3 Application services
| Service | Main responsibilities | Ports used |
|---|---|---|
| CaptureService | quick capture, drafts, promotion | UnitOfWork, BlobStore |
| NoteService | edit, autosave, commit revision, links | Repositories, SearchIndexer |
| EntityService | create/update, aliases, merge/split (v1.x) | Repositories |
| RelationService | link/unlink, validation vs predicates, derived backlinks | Repositories, PredicateRegistry |
| SourceService | register source, snapshots, hashes | BlobStore, Hasher |
| ProvenanceService | observations, claims, evidence links, activities | Repositories |
| RevisionService | history, diff, restore | Repositories |
| SearchService | exact/lexical queries, explanations | QueryPort |
| GraphService | neighbourhood, backlinks, filters | QueryPort |
| TimelineService (v1.x) | as-of and time-ordered views | QueryPort |
| ImportService / ExportService | validate, apply, export, backup/restore | Repositories, BlobStore |
| AttachmentService | add, dedupe, verify, cleanup | BlobStore |
| AIService (v1.x) | submit/review proposals via gateway | AIGateway port |
| SyncService (v1.x) | outbox, push/pull, conflicts | SyncPort, Crypto |
Services are modules, not separate packages; each exposes interfaces matching Appendix C operations.

## 5.4 State management
| State class | Examples | Owner | Persistence |
|---|---|---|---|
| UI state | open panels, selected tab | component/store | none or sessionStorage-class (non-sensitive) |
| Temporary interaction state | drag, in-progress form, unsaved editor buffer | component; editor drafts handed to CaptureService | draft autosave (FR-CAP-003) |
| Application state | current vault, route context, feature flags | app store | session |
| Durable domain state | notes, entities, relations, sources, claims | **Local repository** (single source of truth) | local store |
| Remote server state | relay status, Investigative API data | TanStack Query | cache only |
| Derived/indexed state | lexical index, backlink cache | workers/index store | rebuildable from canonical data |
Components read durable state through repository subscriptions (change events), never from the Query cache. Optimistic UI is allowed only after local commit semantics are defined: **"saved" is shown only after the durable commit acknowledgement**.

## 5.5 Worker contracts
Versioned message envelope `{v, id, type, payload, cancel_token}`; request/response correlated by id; every long-running job supports cancellation, progress and idempotent retry (POC-05). Workers hold no UI state; errors are typed (Appendix C). The storage worker is the only code that touches the engine.

## 5.6 Design system
| Area | Rule |
|---|---|
| Tokens | Colour, spacing, typography, radius, elevation, motion defined as tokens; semantic aliases (e.g. `surface`, `danger`); high-contrast theme and reduced-motion respected |
| Typography | System-font stack baseline; scale by relative units; supports user zoom to 200% and 320 CSS px reflow (WCAG 2.2 AA @SD@) |
| Spacing/layout | Fixed scale; layout primitives (Stack, Cluster, Grid, Sidebar); no ad-hoc margins |
| Components | Headless/accessible primitives wrapped by SLIC components; each has keyboard behaviour, focus handling, states, tests |
| Forms | Label-associated inputs, inline errors with programmatic association, no placeholder-only labels, validation shared with domain |
| Navigation | Landmarks, skip links, predictable focus order, deep-linkable views |
| Dialogs | Focus trap and return, Escape closes, no silent data loss on dismiss |
| Notifications | Polite live regions; critical errors persist until acknowledged; storage warnings are first-class |
| Loading / empty / error | Every list/view defines all three; error states offer recovery actions (retry, export) |
| Responsive | Mobile-first breakpoints defined by OQ-06 matrix; touch targets sized per WCAG 2.2 AA |
| Security | Markdown rendered through an allow-list sanitiser; no `dangerouslySetInnerHTML` outside the sanitised renderer; strict CSP, no inline scripts; Trusted Types where supported (T-SEC-001/002) |
| Internationalisation | Message catalogue from day one; languages per OQ-14; locale-aware dates with explicit time-zone display for temporal fields |

# 6. Technology
React, Vite, TanStack Router/Query, Zod: @R@ baseline. Rich-text/Markdown editor, sanitiser, diff library, test runners: candidates chosen at SG2 with a supply-chain review (SEC-003). WebGPU is availability-limited and secure-context only @SD@ — not a baseline dependency.

# 7. Implementation
1. Scaffold packages and boundary lint (WP-032). 2. Define ports and in-memory test adapters. 3. Implement design-system foundation with a11y test harness (WP-035). 4. Build services against ports with unit tests. 5. Wire worker bridges. 6. Build screens per doc 09. 7. Run accessibility and security smoke tests continuously in CI.

# 8. Data & Contracts
Port interfaces (TypeScript): `UnitOfWork`, `EntityRepository`, `SourceRepository`, `ClaimRepository`, `RelationRepository`, `RevisionRepository`, `AttachmentRepository`, `CollectionRepository`, `QueryPort`, `BlobStore`, `SearchIndexer`, `PredicateRegistry`, `Clock`, `IdGenerator`. Command/query names follow Appendix C.

# 9. Security
CSP and sanitiser as above; no secrets in DOM/state; keys (when sync exists) live only in the crypto worker; extension risk documented (Appendix D); no content in logs/telemetry; route guards are not authorization.

# 10. Failure Handling
Storage error → typed error → UI recovery path; worker crash → restart + retry; stale revision → conflict dialog with diff; quota → export prompt; unsupported browser → capability screen listing missing features; unhandled exception → error boundary preserving unsaved drafts.

# 11. Testing
Unit tests per service with in-memory ports; component tests with accessibility assertions; E2E per doc 16; T-NOT-001, T-SEC-001/002, T-A11Y-001/002/003, T-CAP-001.

# 12. Acceptance Criteria
SG2: scaffold with enforced layering, design-system a11y harness green, services pass invariant tests against in-memory ports.

# 13. Deliverables
Package scaffold, ports, services, design system, worker bridge, CSP/sanitiser config, accessibility CI job.

# 14. Risks
RK-14 late accessibility; framework lock-in mitigated by Domain/Application independence from React; supply chain of UI dependencies.

# 15. Open Decisions
ADR-025 (confirm); editor technology; state-store library; OQ-06 breakpoints/platforms; OQ-14 localisation scope.

# 16. References
Research Pack 03§3, 01§7 (WCAG 2.2 AA target) @SD@. WCAG 2.2 (W3C) — pack-cited, level 3.
