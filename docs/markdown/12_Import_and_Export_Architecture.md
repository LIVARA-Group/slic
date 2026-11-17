# 1. Purpose
Guarantee portability and verifiable restore: users can leave SLIC with complete data in an open format, and back up and restore without loss. Avoid making the only copy of a user's knowledge depend on a proprietary database @SD@ (01§7).

# 2. Scope
Personal Contour native export/import, JSON/Markdown interoperability, backup/restore. Investigative dossier export is doc 15 §5.9. Encryption of exports depends on ADR-007 (OQ-12).

# 3. Dependencies
Docs 06, 08; ADR-018; INT-003; T-PRP-004. Source: PRD-001, recoverability NFR ("a successful login is not proof of content recovery") @SD@ (01§7).

# 4. Requirements
FR-IO-001, FR-IO-002 (P0), FR-IO-003 (P1), FR-BAK-001 (P0), INT-003, REL-002, SEC-002 (imported HTML), PRV-003. "Export can be imported back" is a tested property (T-PRP-004).

# 5. Design
## 5.1 Native archive format (ADR-018, Proposed)
ZIP container with:
```
slic-export/
  manifest.json            # format_version, schema_version, created_at, producer, object counts, file list + SHA-256 per file, logical_hash
  objects/<type>.jsonl     # one canonical-JSON object per line (note, entity, relation, source_artifact, observation, claim, ...)
  revisions/<type>.jsonl   # revision records with prev_hash
  provenance/*.jsonl       # activities, agents, provenance links, review events
  blobs/<hash-prefix>/<hash>   # attachment bytes, named by content hash
  extensions/              # unknown/forward-compat data preserved
  README.txt               # human-readable description of the format
```
The **logical hash** is a hash over canonical serialisation of all object classes in a fixed order; it is what round-trip tests compare (independent of ZIP ordering/compression).

## 5.2 What is exported
| Class | Included | Notes |
|---|---|---|
| Objects (all types), relations, revisions, provenance, review events | Fully | Full fidelity incl. revision history |
| Attachments | Fully | By hash; verified |
| Derived data (indexes, embeddings, caches) | **Excluded** | Rebuildable; embeddings optional flag (model version recorded) |
| Device/sync state, keys | Excluded | Never in plaintext export |
| UI preferences | Optional | Separate file |
| Tombstones | Included | So deletions survive restore |

## 5.3 Interoperability exports (v1.x)
Markdown (one file per note, front-matter with id/links/time, links as relative paths) and JSON (flattened). Lossy by design: they do not replace the native archive; the lossiness is stated in the file README.

## 5.4 Import flow
Validate archive → check `format_version`/`schema_version` (newer than supported → refuse with `VERSION_UNSUPPORTED`; older → migrate in memory) → verify file hashes and blob hashes → compute closure and reference integrity → detect duplicates by id and content hash → **dry-run validation report** (counts, warnings, conflicts, unknown fields) → user chooses merge/replace/partial scope → apply in batched transactions with idempotency (job id) → post-import integrity check → report.

| Concern | Rule |
|---|---|
| Unknown fields | Preserved in `extensions` and round-tripped |
| Unknown object types | Quarantined, reported, not dropped silently |
| Duplicates | Same id + same hash → skip; same id different content → conflict list (keep both as revisions or abort by choice) |
| Partial import | Select collection/type; dependency closure computed; unresolved references reported, never fabricated |
| Relations/links | Restored by id; unresolved targets shown as unresolved links |
| HTML in imports | Sanitised on render; never executed (SEC-002) |

## 5.5 Backup and restore
Backup = export snapshot taken at a single consistent point (T-BAK-001) + manifest + integrity verification pass (reads back and verifies hashes). Incremental backup is **not** in v1.0 (complexity vs. value unknown; revisit with sync). Restore into an empty vault (or new vault) reproduces the logical hash (T-E2E-004); restore into a non-empty vault is import-with-conflict-resolution. Compatibility checks precede any write. Failure handling: restore is transactional per batch with resumable job state; partial failures list the exact failing objects (T-BAK-002).

## 5.6 Encrypted export/backup
Out of v1.0 unless OQ-12 and ADR-007 allow a reviewed subset (SEC-004). Until then the UI states plainly that exports are **plaintext** and shows storage guidance. When added, encryption wraps the archive as a separate layer with algorithm ID and key epoch; recovery behaviour per doc 14 §5.7.

# 6. Technology
ZIP and JSON Lines (open formats); streaming implementation to avoid memory blow-ups; SHA-256 (or the hash chosen with ADR-007/018) via Web Crypto digest (primitives available @V@ in secure contexts, MDN pack-cited); File System Access/download APIs for saving files — browser support per OQ-06.

# 7. Implementation
1. Canonical serialiser (shared with storage). 2. Exporter with streaming and manifest. 3. Verifier CLI/library (independent of the app UI). 4. Importer with dry-run, closure and conflict logic. 5. Backup scheduler + reminders (FR-STO-001). 6. Property tests (export→import→export). 7. Large-dataset tests (100k objects + attachments).

# 8. Data & Contracts
Manifest schema (versioned JSON Schema), object JSONL schemas = Appendix B, error codes Appendix C (`VERSION_UNSUPPORTED`, `INTEGRITY`, `QUOTA`). Compatibility policy: readers support N and N-1 major format versions; unknown minor additions preserved.

# 9. Security
Imported archives are untrusted input: size/ratio limits, path sanitisation (no traversal), type sniffing, sanitised rendering, no auto-execution. Exports contain plaintext user data: warn, and never include keys. Hash match proves bytes equal at export time, not truth or provenance quality @SD@.

# 10. Failure Handling
Corrupt archive → precise list of failing files; storage full → abort with consistent partial state or rollback; interruption → resumable job; incompatible version → refuse with guidance; verification failure after backup → backup marked invalid, user alerted.

# 11. Testing
T-IO-001…004, T-BAK-001/002, T-E2E-004, T-PRP-004, T-ATT-002, T-MIG-001.

# 12. Acceptance Criteria
SG4: export→import→export identical logical hash on fixtures incl. attachments and revisions; tamper cases rejected; large dataset round trip within the recorded budget; independent verifier validates an archive without the app.

# 13. Deliverables
Format specification (public), exporter/importer, verifier, test corpus, user documentation on backups.

# 14. Risks
Silent data loss on import (mitigated by dry-run + report); format drift (versioned spec + tests); users never backing up (reminders, health UI); large-archive memory limits.

# 15. Open Decisions
ADR-018 (confirm), OQ-12, incremental backup (later), hash algorithm, whether embeddings may be exported.

# 16. References
Research Pack 01§7, 06§2 (Phase 3 exit gate) @SD@; MDN Web Crypto API (pack-cited).
