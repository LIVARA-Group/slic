# 1. Purpose
Specify the Personal Contour's local storage as a subsystem with its own correctness properties, independent of whether IndexedDB or SQLite-WASM/OPFS is chosen (ADR-004, @OD@).

# 2. Scope
Adapters, repositories, transactions, queries, migrations, serialisation, identity, revisions, indexes, attachments, health, backup. Excludes sync (14) and import/export format (12).

# 3. Dependencies
Doc 06 (model), doc 05 (POC-01/02), doc 07 (ports). Verified facts: browser storage is best-effort by default; persistent mode can be requested with `navigator.storage.persist()` and may be denied @V@ (MDN, level 1); quotas are origin-wide and browser-specific @V@; IndexedDB `durability` is a hint (strict/relaxed/default) @V@ (MDN, level 1).

# 4. Requirements
REL-001 (no lost acknowledged write), REL-002 (safe migrations), REL-003 (quota/eviction surfaced), INT-001/002/003/004, FR-ATT-001, FR-STO-001, FR-BAK-001, FR-CAP-003, PERF-001. Principle @SD@: browser storage is not an absolute durability guarantee; the app must expose storage health, backup state, capacity and recovery status; clearing site data deletes OPFS data.

# 5. Design
## 5.1 Architecture
@@IMG|d12_storage_architecture|Figure 8.1 Storage architecture (engine-neutral ports; two candidate adapters)|@R@@@
Layers: services → **UnitOfWork** (multi-object transaction + outbox) → **Repository interfaces** → **Engine adapter**. Queries (search, neighbourhood, as-of) go through a **QueryPort** implemented per engine. Binaries go through **BlobStore**. All engine access happens in a dedicated storage worker.

## 5.2 Repository design
| Repository | Core operations | Specialised operations |
|---|---|---|
| EntityRepository | get, put(expected_rev), list(filter), tombstone | findByAlias, mergeRecord, listMerged |
| NoteRepository | get, commitRevision, list | listLinkedFrom, restoreRevision |
| SourceRepository | register, get | findByHash, listByOrigin |
| ObservationRepository | record, get | listBySource |
| ClaimRepository | put, get | listByEvidence, listBySubject, setAssessment (domain-guarded) |
| RelationRepository | link, unlink, get | outgoing/incoming(object, predicate, page), neighbourhood(object, depth, filter) |
| RevisionRepository | append, get, list | verifyChain(object) |
| AttachmentRepository | add(stream), get, release | verify(hash), orphans(), refcount recompute |
| CollectionRepository | create, addMember, removeMember | membersOf, collectionsOf |
Every mutating repository call takes a transaction handle from the UnitOfWork; direct writes outside a UoW are impossible by API.

## 5.3 Unit of work and outbox
A command opens one UoW: validates → writes object rows, revision, provenance links, derived-index *tasks* and sync *outbox rows* → commits. Acknowledgement to the UI occurs **only after** commit completion. Derived updates (lexical index, backlink cache) are performed after commit from the event stream and are idempotent; if interrupted they are redone on restart (index version + last-applied sequence stored).

## 5.4 Durability and consistency
- Atomicity: engine transactions; multi-object writes in one transaction.
- Durability: for IndexedDB, use the `strict` durability hint for commits that are acknowledged as saved (@V@ that it is a hint — verify effective behaviour per browser in POC-01 crash tests; browsers may treat it differently); autosave drafts may use `relaxed`. For SQLite-WASM, journaling/sync settings per VFS are verified in POC-01/02.
- Consistency: application-level referential integrity in repositories (IndexedDB has no foreign keys; SQLite FKs enabled where available) + integrity checker.
- Isolation across tabs: single-writer coordination mechanism (@OD@): candidate browser locking or leader election; evaluated in POC-01 scenario 6. Optimistic `expected_rev` is the fallback guard.
- Idempotency: commands carry idempotency keys stored in the UoW record; duplicates return the original result.

## 5.5 Engine mappings
**Logical schema** is Appendix B. Physical mappings are generated, not hand-written:
| Concern | IndexedDB adapter | SQLite-WASM adapter |
|---|---|---|
| Containers | object stores per type, `revision`, `outbox`, `idempotency`, `meta` | tables per type |
| Primary keys | keyPath `id`; revision keyPath `[object_id, rev]` | PK / composite PK |
| Secondary indexes | `by_subject_predicate`, `by_object_predicate`, `by_alias`, `by_source`, `by_tx_current` (current-only store or filtered key), `by_hash` | CREATE INDEX equivalents; partial indexes |
| Transactions | multi-store `readwrite` transaction; durability hint per commit | `BEGIN IMMEDIATE`…`COMMIT` |
| Joins / recursive traversal | application-level multi-get; bounded BFS in worker | SQL joins; recursive CTE (POC-03) |
| Full-text | derived index store (ADR-017) | FTS availability in the WASM build verified in POC-04 |
| Schema versioning | IndexedDB version + `meta.schema_version` | `PRAGMA user_version` + migrations table |
| Concurrency | multiple connections per origin; version-change blocking handled | single connection per file in some VFS variants (reported; verify) |
Both adapters pass the **same conformance suite** (T-STO-*, T-REV-*, T-INT-001, T-PRP-*) — this suite is the contract.

## 5.6 Queries
Port methods: `getById`, `listByType`, `findByAlias`, `outgoing/incoming`, `neighbourhood(depth≤N,page)`, `asOf(object, validAt, txAt)`, `search(query)`. Pagination is cursor-based; depth and fan-out limits protect against high-degree nodes (`DEPTH_LIMIT`).

## 5.7 Serialisation and identity
Canonical JSON serialisation (stable key order, NFC strings, UTC timestamps) used for hashing, export and tests (T-PRP-004). IDs are UUIDv7 (ADR-011). `content_hash` computed over canonical serialisation. Unknown fields are preserved on read/write.

## 5.8 Revision handling
Full snapshots per revision with `prev_hash` (ADR-014). Revision append is part of the same UoW as the current-state update. Repository API has no update/delete for revisions; adapter-level guards detect attempts (T-REV-001). Storage growth is measured in POC-01; compaction (if ever) keeps hash continuity via checkpoint records.

## 5.9 Attachments
| Aspect | Specification @R@ (ADR-019 open) |
|---|---|
| Metadata | `attachment` record: content_hash, byte_length, media_type, original_filename, ref_count |
| Binary storage | OPFS file named by content hash, or IndexedDB Blob — per POC-02 |
| Naming | content-addressed (hash), never user filename on disk |
| Content types | Declared and sniffed types stored; rendering never trusts declared type |
| Size limits | Set from POC-02 safe envelope; typed `TOO_LARGE` error |
| Hashing | Streaming hash during write; verify on read and restore (INT-003) |
| Deduplication | By (scope, content_hash); reference counted |
| Encryption boundary | Local at-rest encryption is OQ-11; if later added, hash-addressing leaks equality — design must address (doc 11 §5.8) |
| Reference management | `ref_count` derived from source/attachment links; recomputable |
| Orphan cleanup | After grace period; never during open UoW; logged |
| Failure | Write to temp name, verify hash, then atomic rename/commit; partial files never referenced |

## 5.10 Storage health
The app calls storage-estimate and persistence APIs, requests persistent storage at a meaningful user moment, and shows: persisted status, usage vs quota, last backup age, integrity-check status, index status. Denied persistence is shown as a risk with a backup prompt @SD@ (03§4). Backup reminders are configurable (FR-STO-001). No claim of guaranteed durability appears in UI copy.

## 5.11 Backup (storage view; format in doc 12)
Snapshot at a single consistent transaction point; manifest with counts and hashes; verified restore into an empty vault; restore refuses incompatible versions with explicit error.

# 6. Technology
Candidates: native IndexedDB (optionally a thin wrapper), SQLite-WASM from the SQLite project (reported as the official WASM build; OPFS-backed VFS variants), OPFS via sync access handles in workers (worker-only synchronous access @SD@). Verification: OPFS is origin-private, quota-bound and clearing site data removes it @SD@ + @V@ (MDN level 1). **Primary-source confirmation of VFS header requirements and single-connection limits is a POC-02 task** (secondary sources only so far).

# 7. Implementation
1. Define ports, error types, conformance suite (WP-040 start). 2. Implement in-memory adapter (reference). 3. Implement chosen adapter(s) after SG1. 4. Migration runner with snapshot/resume (WP-034). 5. Integrity checker (WP-052). 6. Blob store + attachments (WP-046). 7. Health UI (WP-049). 8. Backup/restore (WP-051). 9. Crash-injection harness in CI nightly.

# 8. Data & Contracts
Appendix B (schema), Appendix C (errors). Internal records: `idempotency(key, result_ref, created_at)`, `outbox(seq, op, object_id, rev, state)`, `meta(schema_version, index_versions, last_applied_seq)`.

# 9. Security
Local data is plaintext unless OQ-11 decides otherwise; the browser profile is only as safe as the device and extensions (Appendix D). Storage keys/namespaces are Personal-only: no Investigative code can address them (T-ISO-001/002). No content in logs. XSS is the main path to local data exfiltration — CSP and sanitiser (doc 07).

# 10. Failure Handling
| Failure | Detection | Response |
|---|---|---|
| Interrupted write | UoW incomplete on restart | Engine rollback; outbox/index tasks replayed |
| Corrupt record or index | Integrity checker; hash mismatch | Report objects; rebuild derived data; restore from backup for canonical data |
| Quota exceeded | `QUOTA` error | Typed error; no partial commit; export/clean-up prompt |
| Eviction / site data cleared | Empty store with prior backup marker absent | Recovery screen offering restore; clear explanation |
| Migration interrupted | Migration state record | Resume or roll back to snapshot |
| Two tabs conflict | `STALE_REVISION` | Conflict UI |
| Engine unavailable (feature missing) | Capability check at start | Capability screen; never silently fall back to in-memory storage |

# 11. Testing
T-STO-001…005, T-REV-001, T-ATT-001/002, T-MIG-001/002, T-INT-001, T-BAK-001/002, T-PRP-001/002, T-PERF-001/002/003. Crash-injection harness is a first-class test tool.

# 12. Acceptance Criteria
SG3: conformance suite green on the selected adapter across the browser matrix; zero lost acknowledged writes in ≥1000-transaction crash runs; migration interruption tests pass; storage-health UI present; backup round-trip verified.

# 13. Deliverables
Ports + conformance suite, selected adapter(s), migration runner, integrity checker, blob store, health UI, crash harness, storage runbook for support.

# 14. Risks
RK-05 eviction/corruption; RK-11 no engine meets gates; RK-19 migration bug; browser-specific storage behaviour (Safari/iOS) discovered late.

# 15. Open Decisions
ADR-004, ADR-014, ADR-017, ADR-019; multi-tab coordination mechanism; OQ-06; OQ-11 (local encryption/app lock); attachment size limits.

# 16. References
Research Pack 03§4, 01§7, 06§4 @SD@; MDN Storage quotas and eviction criteria; MDN Storage API; MDN IDBDatabase.transaction / IDBTransaction.durability (all level 1, fetched 2026-11-14); SQLite WASM persistence (secondary, level 4).
