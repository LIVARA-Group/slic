# 1. Purpose
Specify the Personal Contour's encrypted multi-device synchronisation. **Single-user multi-device sync is a different problem from real-time multi-user collaboration** @SD@; this document covers the former only (OQ-05). Everything here is a candidate design pending POC-07/08 and independent cryptographic review.

# 2. Scope
Device identity, envelope, protocol, conflict handling, recovery. Release: v1.x, **gated** by SG5 (SEC-004). Collaboration/shared spaces are out of scope.

# 3. Dependencies
Doc 08 (outbox, storage), doc 11 §5.6 (crypto), POC-07/08, ADR-006/007, OQ-01/05/08/09; Research Pack 03§9, 04§4–7 @SD@.

# 4. Requirements
FR-SYN-001/002/003, SEC-004/005, PRV-001/003, T-SYN-001…005, T-CRY-001…004, T-PRP-005. Pack criteria @SD@: server cannot decrypt personal content; recovery is proven; convergence after concurrent/offline edits including delete/edit and permission changes; replay safety; sync metadata leakage inspected.

# 5. Design
## 5.1 Device identity
| Aspect | Candidate specification @R@ |
|---|---|
| Registration | New device generates key pair locally; registration approved by an existing device (or via recovery); relay stores device id + public keys |
| Device key | Wrapping key pair (receives vault key) + signing key (signs operations) — algorithm availability per browser to verify |
| Revocation | Existing device (or recovery) marks device revoked; relay refuses it; **key epoch advances** and DEKs are re-wrapped for remaining devices |
| Recovery | See §5.7 |
| Metadata | Minimal: device id, creation time, last-seen coarse time, user-agent class (optional) |
Authentication to the relay (account/session) is **separate** from content keys @SD@.

## 5.2 Encrypted envelope
| Field | Public (visible to relay) / Encrypted | Why |
|---|---|---|
| Envelope ID | Public | Idempotency, dedupe |
| Object ID | Public as opaque random ID (or encrypted if relay lookup is not needed — @OD@) | Addressing; leaks object count/identity of updates |
| Schema version | Public | Compatibility; low leakage |
| Actor / Device ID | Public | Auth, revocation, ordering |
| Causal metadata (device seq, version vector / HLC) | Public minimal counters; richer detail inside ciphertext | Ordering/replay protection vs leakage |
| Algorithm suite ID | Public | Agility, migration |
| Key epoch | Public | Selecting key; reveals rotation events |
| Nonce | Public | Required for decryption |
| Ciphertext | Encrypted | Payload: object payload, titles, labels, edges, filenames |
| Content hash | Inside ciphertext (and AAD-bound ID); plaintext hash must not be public | Plain hashes allow equality/dictionary testing @SD@ |
| Operation type | Public coarse (put/tombstone) or encrypted — @OD@ | Tombstone visibility vs deletion semantics |
| AAD | Binds object ID, vault ID, schema version, key epoch, device ID | Prevent substitution/replay across contexts |
Visible to relay regardless: sizes, timing, IP, access patterns, device count (leakage profile published per PRV-001).

## 5.3 Protocol
@@IMG|d15_sync_protocol|Figure 14.1 Sync protocol flow (candidate)|@R@@@
@@IMG|s02_sync_sequence|Figure 14.2 Sequence — two devices (candidate)|@R@@@
Steps: (1) local change detection through **outbox rows written in the same UoW** (doc 08 §5.3); (2) build/encrypt envelope; (3) upload idempotently (envelope ID); (4) relay authenticates device, stores ciphertext, assigns a **cursor**; (5) remote discovery by cursor; (6) download; (7) decrypt and verify AAD/hash; (8) validate schema and domain invariants; (9) merge by data class (§5.4); (10) acknowledge and advance cursor; (11) retry with backoff; **replay protection** via per-device monotonic sequence + object version + envelope-ID memory; **idempotency** by envelope ID; (12) **compaction** of superseded envelopes, key-epoch-aware, retaining enough history for late devices; tombstone retention window defined by POC-07. The relay is authoritative only for ordering and delivery, **never for authorization claims made by clients** @SD@ (03§9).

## 5.4 Conflict resolution by data class
| Data class | Candidate strategy | Auto-merge? | User decision when |
|---|---|---|---|
| Note body text | Text CRDT (Yjs or Automerge) **if** POC-07 shows benefit; else 3-way merge with conflict markers | Often | Overlapping edits CRDT cannot reconcile semantically |
| Scalar properties (labels, status) | LWW by hybrid logical clock per field | Yes | Concurrent edits of same field flagged if both newer than last sync |
| Relations (add/remove) | Add-wins set with tombstones and validity | Yes | Add vs remove of semantically same relation |
| Entity merge/split | Domain command with explicit operation; not CRDT | No | Concurrent merges/splits/edits on same entities |
| Delete vs edit | Edit-wins with tombstone resurrection prompt (candidate) | No | Always notify |
| Revisions | Append-only union by (object, rev, device) with deterministic renumbering rules or per-device branches | Yes | Never lossy |
| Attachments | Content-addressed union | Yes | Never |
| Collections | Add-wins membership | Yes | Rare |
CRDTs are **not** a universal solution @SD@: entity identity, deletion, relationship conflicts, authorization revocation and (in Investigative) custody are handled by domain commands. Encrypted CRDT updates leak sizes/timing and complicate compaction — measured in POC-07/08. Candidates considered: last-write-wins, version vectors, operation-based merge, state-based CRDT, Yjs, Automerge (ADR-006, Proposed).

## 5.5 Failure and offline limits
Offline queue limits and user notices; clock skew handled by HLC and never trusted alone; partial uploads resumable; relay downtime tolerated; corrupted/forged envelopes quarantined and reported; incomplete sync recovered by cursor re-scan.

## 5.6 Cryptographic dependencies
Per doc 11 §5.6; key epoch changes on revocation; nonce uniqueness test T-PRP-005; no plaintext hash in public fields.

## 5.7 Recovery
**Recovery is security-critical and defined before sync ships** @SD@. Scenarios: new device onboarding (approval from an existing device, or recovery factor); lost device (revoke, rotate epoch); lost key (recovery factor only; provider cannot help — user informed at setup); recovery phrase/file or another mechanism (OQ-08); key rotation; revocation; recovery from incomplete sync (cursor rewind + verify). A design where recovery gives the provider plaintext access contradicts the zero-knowledge-for-content claim; a design that cannot recover after device loss is incomplete @SD@. WebAuthn is not the recovery mechanism.

## 5.8 Account deletion and erasure
Deleting the account removes ciphertext from the relay; documented residuals: backups under retention, copies on devices, caches; crypto-erasure only under the conditions in doc 11 §5.6.

# 6. Technology
Relay: minimal service (ADR-013: framework not required for a ciphertext store) over HTTPS; blob store; metadata DB with minimal fields; Yjs/Automerge only if POC-07 justifies; crypto per ADR-007 (not decided).

# 7. Implementation
1. Finish POC-07/08; write protocol spec; independent review (WP-060). 2. Outbox and envelope library with test vectors. 3. Relay (auth, store, cursors, quotas). 4. Sync engine + conflict UI. 5. Device lifecycle (WP-063). 6. Leakage inspection tool (what relay sees). 7. Soak tests with 2–5 devices (OQ-09).

# 8. Data & Contracts
Envelope (above); `SyncPush/SyncPull`, `DeviceRegister/DeviceRevoke` (App. C); errors `REPLAY`, `STALE_CURSOR`, `STEP_UP_REQUIRED`, `QUOTA`.

# 9. Security
Threats (Appendix D Personal rows 4–9, 14): relay reads/alters content, replay/rollback, nonce reuse, weak recovery, lost device, metadata analysis, account takeover. Controls: AEAD+AAD, signed device ops, sequence/version checks, key epochs, rate limits, step-up for device approval, leakage statement.

# 10. Failure Handling
Replay → reject/idempotent; decrypt failure → quarantine + alert; relay data loss → clients re-upload from local state (local is authoritative); divergent histories → conflict workflow; compaction bug → keep full log until verified; user locked out → recovery flow or declared loss.

# 11. Testing
T-SYN-001…005, T-CRY-001…004, T-PRP-005; property tests for convergence; fuzzing of envelope parser; leakage review.

# 12. Acceptance Criteria
SG5: independent crypto review closed; convergence, replay, revocation and recovery tests green; leakage statement equals observed relay data (T-SYN-003); POC-07 decisions recorded.

# 13. Deliverables
Protocol specification, test vectors, relay, sync engine, conflict UI, recovery UX, leakage report, runbooks.

# 14. Risks
RK-04, RK-06; protocol complexity; metadata leakage vs usability; compaction vs late devices; support burden of recovery.

# 15. Open Decisions
ADR-006, ADR-007, OQ-01, OQ-05, OQ-08, OQ-09; public vs encrypted object ID; tombstone policy; padding/jitter; algorithm suite; device key algorithms available in target browsers.

# 16. References
Research Pack 03§9, 04§4–7, 04§10, 06§4 @SD@; Yjs documentation (pack-cited: CRDT types merge concurrent changes but do not define product-level conflict semantics); NIST SP 800-38D §8.3 (level 2).
