# 1. Purpose
Translate the Personal v1.0 user functions into module specifications: responsibility, flows, UI, services, data, validation, events, errors, security, tests, acceptance.

# 2. Scope
Capture, Notes, Entities, Sources (with Observations/Claims), Relations, Projects/Collections. Search/graph/timeline are doc 10; import/export doc 12; AI doc 13; sync doc 14.

# 3. Dependencies
Docs 06, 07, 08; Research Pack 01§2.1, §5, §9 @SD@. Open: OQ-04, OQ-13, OQ-14.

# 4. Requirements
FR-CAP-001/002/003, FR-NOT-001/002/003, FR-ENT-001/002 (v1.0), FR-ENT-003 (v1.x), FR-REL-001/002, FR-SRC-001/002/003, FR-COL-001 (v1.0), FR-COL-002 (v1.x), FR-ATT-001. Core journey @SD@: capture to inbox with local acknowledgement and no network → edit/organise with durable save → link and inspect backlinks → search → revisit decisions through original context and revisions.

# 5. Design
Common module template: *Domain responsibility · User flows · UI components · Application service · Data model · Repository operations · Validation · Events · Error handling · Security · Tests · Acceptance*. Sections 5.1–5.6 follow it compactly.

## 5.1 Capture
| Aspect | Specification |
|---|---|
| Responsibility | Low-friction entry of text/URL/file into an Inbox; no classification burden |
| Flows | Global shortcut/button → input → submit → "saved" after commit → item in Inbox → later *promote* to Note, Entity, Source, or discard. Drafts autosave. Offline always works |
| UI | Quick-capture dialog (keyboard-first), Inbox list with filters (unprocessed, kind), promotion actions |
| Service | CaptureService: `CaptureCreate`, `CapturePromote` (App. C) |
| Data | `capture` item: raw_input (retained), normalised_text (NFC), kind, source_url (canonical), attachments[], status (inbox/promoted/discarded), tx fields. Source metadata captured: time, URL, title (as text, untrusted) |
| Repository ops | create, list(status), markPromoted, discard (tombstone) |
| Validation | size limits; URL parse/canonicalisation; file type sniff; no execution of content |
| Events | capture.created, capture.promoted |
| Errors | VALIDATION, QUOTA, TOO_LARGE, STORAGE_FAILURE |
| Security | Titles/URLs/filenames rendered as text only; fetching URL content, if ever offered, is an explicit opt-in network action with SSRF-safe handling server-side (not in v1.0) |
| Tests | T-CAP-001/002/003, T-E2E-001 |
| Acceptance | Ack after durable commit; survives kill; works with network disabled |
Conversion: promotion to Note copies text into a Note revision and keeps provenance link to the capture; promotion to Source registers a snapshot (hash) and links the capture.

## 5.2 Notes
| Aspect | Specification |
|---|---|
| Responsibility | Markdown authoring with durable history and links |
| Flows | Create/open → edit with autosave (draft buffer) → explicit/implicit *commit revision* at defined intervals/events → view history/diff → restore |
| UI | Editor with preview, link autocomplete (`[[`), backlink panel, revision drawer, unresolved-link indicators |
| Service | NoteService: `NoteCommitRevision`, `NoteRestoreRevision` |
| Data | `note` + `revision` (full snapshot, prev_hash); link extraction produces `relation` rows of class `semantic` (mentions) in the same UoW |
| Validation | Max size; title NFC; link targets resolved by id (display text may change); embeds limited to allow-list |
| Events | note.revised → index, backlinks, sync outbox |
| Errors | STALE_REVISION (two tabs), VALIDATION, QUOTA |
| Security | Markdown sanitised on render; stored raw; no HTML execution; imported HTML converted/sanitised |
| Conflict handling | Local multi-tab: optimistic `expected_rev` and conflict dialog with diff; cross-device conflicts are doc 14 |
| Tests | T-NOT-001/002, T-REV-001/002, T-PRP-001/002 |
| Acceptance | Every committed edit is a revision; restore adds a revision; backlinks consistent |
Autosave policy: draft buffer persisted frequently (relaxed durability); a *revision* is committed on pause/blur/explicit save with strict durability; interval values come from POC-01 measurements (@OD@).

## 5.3 Entities
| Aspect | Specification |
|---|---|
| Responsibility | Stable identity for people, organisations, assets, locations, etc. |
| Flows | Create typed entity (from capture, selection or manually) → add aliases/identifiers → link → (v1.x) merge/split duplicates |
| UI | Entity card per type (property forms generated from type schema), alias editor, relations panel |
| Service | EntityService: `EntityCreate`, `EntityUpdate`; (v1.x) `EntityMerge/Split` |
| Data | `entity`, `entity_alias` (namespace-scoped identifiers with validity), `properties` validated per type |
| Validation | Type schema; alias normalisation; duplicate-suspicion hints (not auto-merge) |
| Resolution (v1.x) | Merge is reversible, records evidence; relations re-pointed with provenance; original records restorable (T-ENT-003) |
| Events | entity.revised, entity.merged, entity.split |
| Errors | VALIDATION, STALE_REVISION, CONFLICT |
| Tests | T-ENT-001/002/003 |
| Acceptance | Alias lookup works; type changes are explicit (new entity + relation), never silent |

## 5.4 Sources, observations, claims
| Aspect | Specification |
|---|---|
| Responsibility | Preserve where knowledge came from; keep source, observation, claim distinct |
| Flows | Register source (URL/file/note revision) → select a span → record observation → state a claim linked to observations (supports/contradicts) → set assessment manually |
| UI | Source viewer with selection-to-observation, evidence panel on claims, "no provenance" badges, assessment and review controls (manual in v1.0) |
| Service | SourceService, ProvenanceService: `SourceRegister`, `ObservationRecord`, `ClaimAssert`, `ClaimReview` |
| Data | `source_artifact` (immutable snapshot + hash), `observation` (locator, ADR-016), `claim`, `claim_evidence`, `activity` (who/what captured/extracted) |
| Validation | Locator must resolve against the snapshot (quote equality test); claim needs subject and predicate; AI-origin cannot be accepted without review event (INT-005) |
| Events | source.registered, observation.recorded, claim.asserted |
| Errors | VALIDATION (locator), INTEGRITY, PROVENANCE_MISSING flag |
| Security | Source content rendered as inert text/preview; remote fetching deferred |
| Tests | T-SRC-001/002/003, T-EPI-001, T-PRP-003 |
| Acceptance | Every claim shows its evidence or a visible gap; source change creates new snapshot without altering old observations |
Hypothesis/Decision/Action: schema present, UI deferred (FR-HYP-001, P2).

## 5.5 Relations
| Aspect | Specification |
|---|---|
| Responsibility | Typed, directional links with validated semantics |
| Flows | Link from editor or entity card → choose predicate (filtered by endpoint types) → optional valid time → view in relations panel; inverse shown automatically |
| Service | RelationService: `RelationLink`, `RelationUnlink` |
| Data | `relation` + `predicate_def` registry v1 (identity, structural, semantic, temporal, provenance, analytical; causal predicates present but gated by required assumptions) |
| Validation | domain/range, class rules, temporal scope, duplicates, self-links per predicate |
| Directionality & inverses | Stored once; inverse derived from `inverse_key`; backlinks are queries, not rows |
| Deletion semantics | Per class (doc 06 §5.5): structural block/cascade, analytical tombstone, provenance protected |
| Traversal | Bounded, paginated, typed filters (doc 10) |
| Tests | T-REL-001/002/003, T-PRP-001 |
| Acceptance | No relation violates its predicate; derived backlinks equal recomputation |
Analytical and causal predicates never imply causation by themselves: causal predicates demand explicit model/assumption references @SD@.

## 5.6 Projects / Collections
| Aspect | Specification |
|---|---|
| Responsibility | Grouping and navigation scopes; not a substitute for Entity |
| v1.0 | Flat collections; kind `collection|project`; membership of any object type; filter lists/search by collection |
| v1.x | Nested (acyclic, depth-limited) and collection-based filters |
| Data | `collection`, `collection_member` |
| Semantics | Deleting a collection never deletes members; membership is not a relation with meaning |
| Tests | T-COL-001, T-COL-002 |
| Acceptance | Membership consistent across delete/import; no cycles (v1.x) |

# 6. Technology
Per doc 07 and 08. Markdown parser/sanitiser and editor are chosen at SG2 (candidate list, supply-chain review).

# 7. Implementation
Order within S3 after WP-040: capture (041) and notes (042) first (they create the durable data), then entities/relations (043), sources/claims (044), collections (045), attachments (046). Each module delivers: service + UI + tests + a11y check + docs update. Feature flags allow dark launch.

# 8. Data & Contracts
Operations and events: Appendix C. Fields: Appendix B. UI strings through the i18n catalogue.

# 9. Security
XSS-safe rendering; untrusted metadata (titles, URLs, filenames); no network from v1.0 content features except explicitly requested downloads; telemetry content-free; deletion semantics documented (PRV-003).

# 10. Failure Handling
Every command returns a typed result; UI maps errors to recoverable actions; drafts preserved on failure; no module may report success before commit.

# 11. Testing
Unit (domain rules), integration (repositories), E2E per journey; property tests for backlinks and revisions; accessibility tests on each screen; tests listed in §5 tables.

# 12. Acceptance Criteria
SG3: all FR requirements listed in §4 with release v1.0 pass; Appendix E acceptance matrix entries completed with archived evidence.

# 13. Deliverables
Modules with UI and services; fixtures; docs for users (limitations: browser storage, backups); updated data dictionary.

# 14. Risks
Scope creep into editor features; premature entity-resolution automation; unclear Note-vs-Source semantics (OQ-13).

# 15. Open Decisions
OQ-13, OQ-04, autosave/commit interval, editor technology, predicate registry v1 content, languages (OQ-14).

# 16. References
Research Pack 01§2.1, 01§5, 01§9, 02§3 @SD@.
