# 1. Purpose
Create the security and integrity architecture for both contours: threat models, trust boundaries, cryptographic architecture requirements, privacy classification, Investigative security, and the exact scope of each integrity guarantee. Security is a system property of classification, boundaries, key lifecycle, access policy, implementation, operations and incident response — no single library, passkey, cipher or Merkle tree makes SLIC secure @SD@.

# 2. Scope
Cross-cutting design. Sync protocol specifics: doc 14. Investigative mechanics: doc 15. Matrices: Appendix D.

# 3. Dependencies
Research Pack 04 (all) @SD@; docs 03, 06; ADR-002, 007, 009; OQ-01, 02, 03, 08, 10, 11.

# 4. Requirements
@@REQ_SEC@@

# 5. Design
## 5.1 Threat models
**Personal** (assets: plaintext notes, graph edges, search terms, attachments, embeddings, identity, device keys, recovery material, sync metadata, backups). Actors @SD@: compromised cloud operator, malicious extension, endpoint malware, stolen unlocked device, malicious collaborator (deferred), network observer, account takeover, supply-chain compromise, accidental deletion. **Trust assumption @SD@: endpoint/browser trusted while unlocked; E2EE cannot protect plaintext on a compromised endpoint.** Goals: confidentiality from the sync operator, integrity of sync objects, availability/recovery, device revocation, metadata minimisation.
**Investigative** (assets: case data, identities, evidence bytes, source identities, authority manifests, custody records, findings, audit events, keys, exports). Actors @SD@: malicious tenant user, compromised analyst, privileged insider, compromised service, malicious evidence payload, unauthorised API client, storage administrator, colluding users, external adversary. Goals: tenant/case isolation, least privilege, source integrity, traceable access, controlled ingestion, secure export, retention, incident accountability.
Full matrices with mitigations and verification: **Appendix D**.

## 5.2 Trust boundaries
Defined in doc 03 §5.7 and §9 (TB1–TB4); each boundary lists required controls; Appendix D rows reference them.

## 5.3 Application security baseline (both clients)
Strict CSP (no inline script/eval), sanitised Markdown/HTML rendering, no secrets in DOM, dependency pinning/scanning/SBOM/signing, subresource and origin isolation, secure cookies/same-site for Investigative, CSRF protection, SSRF-safe fetchers (server-side only, egress allow-list), input validation at every boundary, content-free logs.

## 5.4 Investigative security design (summary; details doc 15)
Deny-by-default authorization; case-scoped permissions; purpose limitation (manifest); least privilege; separate service identities (ingestion, search, export, audit, admin); database isolation with non-owner application role, forced RLS, no BYPASSRLS; authorization decisions apply to metadata (autocomplete, counts, graph neighbourhoods, facets, error messages, logs, export manifests). **RLS is defence in depth, not a replacement for application-layer authorization** @SD@; PostgreSQL docs state superusers and BYPASSRLS roles always bypass RLS and table owners bypass unless `FORCE ROW LEVEL SECURITY` is set; with RLS enabled and no policy, access is default-deny @V@ (PostgreSQL 18 docs, level 1).

## 5.5 Authentication
Passkeys/WebAuthn provide public-key authentication scoped to a relying party; the authenticator protects its credential; the standard defines no general-purpose protocol for exporting/backing up that key @SD@ (W3C WebAuthn L3, pack-cited). Therefore: multiple registered authenticators; **content-key recovery designed independently**; phishing-resistant auth + step-up for Investigative export, role change, custody transfer and recovery; separate account identity, session auth, device identity, vault unlock and case authorization @SD@.

## 5.6 Cryptographic architecture (requirements and candidate design)
@@IMG|d14_key_hierarchy|Figure 11.1 Candidate key hierarchy — for specialist review, not an approved protocol (ADR-007)|@R@/@OD@@@
**Requirements @SD@ (04§4):** envelope encryption with explicit key hierarchy; authenticated encryption with unique nonces per key; AAD binding (object ID, vault ID, schema version, key epoch) to prevent object substitution; authentication credentials separate from content keys; key recovery defined **before** sync ships; model key rotation, device revocation, collaborator removal, backup retention, account deletion; reviewed libraries only; no invented primitives.
**Candidate design @R@:**
| Element | Candidate | Open point |
|---|---|---|
| Per-object DEK | Random 256-bit key per object revision or batch | Granularity vs overhead (POC-08) |
| Vault key (per key epoch) | Wraps DEKs; rotated on revocation | Epoch-change cost |
| Device keys | Key pair per device; vault key wrapped to each device public key | Algorithm availability in browsers (verify) |
| Recovery | User-held recovery factor wraps vault key (mechanism: phrase/file/multiple trusted devices) | OQ-08; provider escrow rejected as contradicting the zero-knowledge-for-content claim |
| AEAD | AES-256-GCM via Web Crypto **or** XChaCha20-Poly1305 via a vetted library | ADR-007; the source proposes XChaCha20-Poly1305 which Web Crypto does not provide @SD@ |
| Nonces | AES-GCM with random 96-bit IVs is limited to 2^32 invocations per key (NIST SP 800-38D §8.3 @V@, level 2); per-object DEKs keep counts tiny; XChaCha20 uses 192-bit nonces | Collision tests T-PRP-005 |
| KDF for passphrases | Memory-hard KDF (candidate Argon2id) | Library supply chain; parameters |
Web Crypto is a set of low-level primitives; its documentation warns that key management and system design need expert review @SD@ — it is not a vault protocol. **No encrypted sync or encrypted backup ships until independent review closes (SEC-004).**
Key rotation: new key epoch, re-wrap of DEKs (cheap) and optional content re-encryption for revocation of a shared object; revocation of a device triggers epoch change. Crypto-erasure is conditional: every recoverable key copy and all plaintext caches/exports/backups/indexes must be addressed; for shared content removal may need re-encryption @SD@ (04§10) — documented, not promised (PRV-003).

## 5.7 Zero-knowledge and metadata leakage
Use the narrow claim "**the sync operator cannot read note content**" only after the leakage profile is documented; never "the server knows nothing". A relay may learn account/device identifiers, device count, ciphertext sizes, upload/download timing, access patterns, sync frequency, IP addresses and retention behaviour @SD@. Plain hashes of predictable identifiers are not privacy-preserving blind indexes (dictionary and equality leakage); a keyed deterministic token reduces offline guessing but leaks equality/search patterns; padding and jitter trade bandwidth/latency/battery for reduced leakage and must be measured @SD@.

## 5.8 Privacy classification — what may leave the device
| Data item | Local only? | Encrypted | Synchronised (v1.x) | Visible to relay | Server-searchable | Leakage note / recommendation @R@ |
|---|---|---|---|---|---|---|
| Note body | Local unless sync on | Yes (E2EE) | Yes | No | No | Size/timing visible |
| Titles | Treat as content | Yes | Yes | No | No | OQ-01: titles often more revealing than bodies |
| Tags / labels | Treat as content | Yes | Yes | No | No | Equality leaks if deterministic tokens used |
| Graph edges / predicates | Treat as content | Yes | Yes | No | No | Edge counts leak via sizes |
| Attachments | Local unless sync on | Yes | Yes (chunked) | Size only | No | Large-file timing |
| Filenames | Treat as content | Yes | Yes (inside metadata) | No | No | Never in blob key |
| Embeddings | Local only (recommended) | n/a | No | No | No | Embeddings are content-bearing |
| Search terms | **Never leave device** | n/a | No | No | No | PRV-002 |
| Activity metadata (timestamps of edits) | Minimise | Yes where possible | Partially | Sync timing visible | No | Document residual |
| Device metadata | Minimal | Partially | Device id/public keys | Yes | n/a | Needed for revocation |
| Telemetry | Opt-in only | n/a | Content-free counters | Yes (if enabled) | n/a | PRV-002 |
Default recommendation = **maximal-confidentiality profile**: all content-bearing fields encrypted; relay sees opaque IDs, sizes (bucketed if padded), timing, device ids. Final profile is OQ-01 (@OD@).

## 5.9 Data integrity guarantees and exact scope
| Mechanism | Guarantees | Does **not** guarantee |
|---|---|---|
| Content hash | Byte equality with bytes hashed at a recorded point @SD@ | Truth, completeness, lawful acquisition, correct attribution |
| Revision hash chain | Detects modification of history relative to an external reference | Tamper-proofing against a party controlling all copies |
| Provenance validation | Structure of derivation is present/valid | Quality of the source or analysis |
| Evidence acquisition record + custody events | Recorded process history | Legal admissibility; correctness of the recorded facts |
| Signed checkpoints | Operator-signed audit state at a time | Protection from a colluding signer without witnesses |
| RFC 3161 timestamp | A digest existed before a stated time @SD@ | The datum is true |
| Merkle tree / transparency log | Inclusion/consistency proofs against signed roots @SD@ | Prevention of forks/omission without independent witnesses/monitoring |
| Export verification | Package matches its manifest | Anything beyond manifest scope |
Append-only audit and Merkle structures give **no automatic legal guarantee** of immutability or admissibility @SD@; absolute immutability is never promised.

## 5.10 Supply chain
Lockfiles; reviewed additions; avoiding very new releases without review @R@; SBOM; signature verification of artifacts; minimal dependency policy for crypto and parser code; reproducible builds where feasible.

# 6. Technology
Candidates only: Web Crypto API (AES-GCM, digests, HKDF-class derivation, key wrapping — availability in secure contexts and workers @SD@); vetted WASM/native libraries for XChaCha20-Poly1305 and Argon2id (to be selected with supply-chain review); WebAuthn for authentication; PostgreSQL RLS; KMS for Investigative service keys; RFC 3161 TSA and transparency-log designs for audit anchoring (ADR-009).

# 7. Implementation
1. Threat-model baseline per contour and sign-off (WP-008). 2. Client hardening (CSP, sanitiser, supply chain; WP-053). 3. Privacy controls: classification registry as code, telemetry schema validation, log canary tests (WP-054). 4. POC-08, then protocol specification and **independent review** (WP-060). 5. Investigative isolation POC and implementation (WP-019, WP-071). 6. Audit chain + verifier (WP-074). 7. Incident-response and key-compromise runbooks, exercised (doc 16 §5.8).

# 8. Data & Contracts
Sync envelope fields: doc 14 §5.2; classification table: §5.8 (to be encoded as machine-readable registry used by tests T-PRV-001); audit event schema: doc 15 §5.7; error codes: Appendix C.

# 9. Security
(This document.) Release gates @SD@: threat model signed per contour; crypto review by independent specialist; cross-tenant and cross-contour negative tests in CI/staging; custody/audit verification tested independently of the UI; incident/breach/restore/key-compromise runbooks exercised; no unsupported claims ("unhackable", "immutable", "anonymous", "zero metadata") in product or security copy.

# 10. Failure Handling
Key loss → documented recovery or declared irrecoverable (user informed at setup); key compromise → rotation + revocation runbook; failed AEAD verification → object quarantined, not silently dropped; audit-chain break → alert, freeze exports, investigate; dependency vulnerability → out-of-band patch process; incident → breach assessment under applicable law (legal input, OQ-03).

# 11. Testing
@@TESTS_SEC@@

# 12. Acceptance Criteria
SG4: client security tests green; leakage statements published and matched by traffic captures; SG5: crypto review closed, replay/revocation/recovery tests green; SG6: isolation, custody, audit tests green and independent verifier passes.

# 13. Deliverables
Signed threat models; leakage/classification registry; crypto protocol spec + review report; security test suites; runbooks; copy guidelines for security claims.

# 14. Risks
RK-04 weak recovery; RK-09 audit over-claim; RK-12 supply chain; RK-17 content in logs; RK-18 parser exploitation; RK-08 false forensic attribution.

# 15. Open Decisions
ADR-007, ADR-009, OQ-01, OQ-08, OQ-10, OQ-11, OQ-12; passkey PRF/unlock capability (verify availability); algorithm suite; padding/jitter policy; Argon2id parameters.

# 16. References
Research Pack 04 §1–13 @SD@; MDN Web Crypto; W3C WebAuthn L3; RFC 3161; RFC 6962; NIST SP 800-207 (zero trust is an architecture model, not a synonym for encryption); GDPR principles (EC); OWASP LLM Top 10 — all pack-cited (level 3) unless noted; PostgreSQL RLS (level 1); NIST SP 800-38D §8.3 (level 2).
