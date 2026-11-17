# 1. Purpose
Register of every external reference used for technical statements, with the **verification level actually achieved** — so a reader can see which claims rest on retrieved primary text and which are only carried over from the Research Pack.

# 2. Verification levels
| Level | Meaning |
|---|---|
| L1 | Primary source text retrieved by this programme on 2026-11-15 (excerpt via search/fetch tools; the full page may not have been read) |
| L2 | Secondary source quoting a primary standard; primary document not retrieved |
| L3 | Cited by the Research Pack (and its scope description accepted); **not re-verified here** |
| L4 | Secondary or community source only; must be confirmed against primary documentation |
| L5 | Engineering knowledge of the authors, not verified in this programme |
A reference supports only its stated scope; it never certifies SLIC or proves a technology fits SLIC.

# 3. Register
| # | Reference | URL | Supports (statement in this package) | Limits | Level | Used in |
|---|---|---|---|---|---|---|
| X1 | MDN — Storage quotas and eviction criteria | https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria | Data is best-effort by default; persistent storage can be requested via `navigator.storage.persist()`; quotas are per origin and browser-specific | Numbers differ by browser/version; not re-measured | L1 | 03, 05, 08, 11, 17 |
| X2 | MDN — Storage API | https://developer.mozilla.org/en-US/docs/Web/API/Storage_API (read via a mirror of the page) | Bucket modes best-effort/persistent; `persist()`/`persisted()`; persistent buckets cleared only by user | Mirror copy; browser support table not re-checked | L2 | 08 |
| X3 | MDN — IDBDatabase.transaction() / IDBTransaction.durability | https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction/durability | `durability` option is a hint: strict, relaxed, default; widely available since 2024 (baseline) | A hint, not a guarantee; effective behaviour per browser tested in POC-01 | L1 | 05, 08 |
| X4 | PostgreSQL 18 — Row Security Policies | https://www.postgresql.org/docs/18/ddl-rowsecurity.html | Superusers and BYPASSRLS roles always bypass RLS; table owners bypass unless FORCE ROW LEVEL SECURITY; RLS enabled with no policy = default deny; TRUNCATE/REFERENCES not subject to RLS; permissive policies OR-ed, restrictive AND-ed | PostgreSQL 18 semantics; re-verify on upgrades | L1 | 06, 11, 15, F |
| X5 | PostgreSQL — supported versions banner | same page header | Version 18 listed as current on 2026-11-14 | Moves with releases | L1 | 04 |
| X6 | NIST SP 800-38D §8.3 (GCM) | https://csrc.nist.gov/pubs/sp/800/38/d/final | With random IVs, invocations per key limited to 2^32 (deterministic 96-bit construction excepted); IV/key uniqueness probability ≤ 2^-32 | Evidence is secondary quotations (AWS security blog, Apache Parquet encryption spec, community articles); primary PDF not read | L2 | 05, 11, 14 |
| X7 | SQLite WASM — OPFS VFS options | https://sqlite.org/wasm (primary) ; evidence: blog.openreplay.com/sqlite-browser-opfs | Default OPFS VFS reportedly needs COOP/COEP headers (SharedArrayBuffer); a pooled-handle VFS reportedly needs none but supports one connection | **Secondary only**; confirm in POC-02 against sqlite.org | L4 | 04, 05, 08 |
| X8 | MDN — Origin Private File System | https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system | OPFS is origin-private, quota-bound; synchronous access in workers | Pack-cited | L3 | 08 |
| X9 | MDN — Web Crypto API | https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API | Low-level primitives; key management/system design need expert review | Pack-cited | L3 | 11, 12 |
| X10 | W3C — WebAuthn Level 3 | https://www.w3.org/TR/webauthn-3/ | Credentials scoped to a relying party; no general content-key backup protocol | Pack-cited; PRF/unlock extension availability **not verified** | L3 | 11, 14 |
| X11 | W3C — PROV-O | https://www.w3.org/TR/prov-o/ | Entity–Activity–Agent provenance model | Pack-cited | L3 | 06 |
| X12 | W3C — SHACL | https://www.w3.org/TR/shacl/ | Validates RDF graphs; not a relational schema validator or a full ontology | Pack-cited | L3 | 06 |
| X13 | Yjs documentation | https://docs.yjs.dev/ | CRDT shared types merge concurrent changes; no product-level conflict semantics | Pack-cited | L3 | 14 |
| X14 | RFC 3161 — Time-Stamp Protocol | https://www.rfc-editor.org/rfc/rfc3161 | Timestamp token shows a datum existed before a time; not that it is true | Pack-cited | L3 | 11, 15 |
| X15 | RFC 6962 — Certificate Transparency | https://www.rfc-editor.org/rfc/rfc6962 | Merkle-tree append-only logs, consistency proofs; need governance/monitoring | Pack-cited | L3 | 11, 15 |
| X16 | European Commission — GDPR principles | https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en | Purpose limitation, minimisation, storage limitation, lawfulness, transparency, accountability | Not legal advice; applicability per operator/jurisdiction | L3 | 11, 15 |
| X17 | MDN — WebGPU API | https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API | Limited availability; secure contexts | Pack-cited | L3 | 03, 10 |
| X18 | OWASP — Top 10 for LLM Applications | https://owasp.org/www-project-top-10-for-large-language-model-applications/ | Threat taxonomy incl. prompt injection, insecure output handling | Pack-cited | L3 | 13 |
| X19 | NIST SP 800-207 — Zero Trust Architecture | https://csrc.nist.gov/pubs/sp/800/207/final | Zero trust is an architecture model, not a feature or synonym for encryption | Pack-cited | L3 | 11 |
| X20 | PostgreSQL — Full Text Search | https://www.postgresql.org/docs/current/textsearch.html | Native text search | Pack-cited | L3 | 10, 15 |
| X21 | W3C — WCAG 2.2 | https://www.w3.org/TR/WCAG22/ | AA conformance target named in the pack text | Not in the pack's reference list; not re-verified | L3 | 02, 07, 16 |
| X22 | RFC 9562 (UUID version 7) | https://www.rfc-editor.org/rfc/rfc9562 | Time-ordered UUID format (ADR-011) | Recalled, not retrieved | L5 | A, B |
| X23 | W3C Web Annotation Data Model (text selectors) | https://www.w3.org/TR/annotation-model/ | Inspiration for quote/position selectors (ADR-016) | Not retrieved | L5 | 06 |
| X24 | RFC 9106 (Argon2) / RFC 5869 (HKDF) | https://www.rfc-editor.org/rfc/rfc9106 | Candidate KDFs (doc 11) | Not retrieved | L5 | 11 |
| X25 | PostgreSQL range types and `btree_gist` exclusion constraints | https://www.postgresql.org/docs/current/rangetypes.html | Illustrative DDL in doc 06 | Not retrieved; DDL untested | L5 | 06 |
| X26 | Web performance "long task" convention (50 ms) | https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming | Candidate gate threshold (doc 05 §4.2) | Not retrieved; convention only | L5 | 05 |

# 4. Re-verification plan
Before any release decision relies on a statement: upgrade L2–L5 entries to L1 (read primary text, record date and version). Highest priority: X6 and X7 (affect ADR-004/007), X10 (passkey-assisted unlock), X4 re-run on version upgrades. Owner: documentation maintainer (OQ-16).
