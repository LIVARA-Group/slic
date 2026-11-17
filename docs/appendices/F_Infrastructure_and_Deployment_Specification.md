# 1. Purpose
Specification-level tables for infrastructure, to be instantiated by IaC once ADR-022 (provider) is decided. Values marked *TBD* need customer/legal inputs (OQ-02, OQ-03, OQ-10). Status: @R@.

# 2. Network topology
| Zone | Contents | Inbound | Outbound |
|---|---|---|---|
| Edge | Reverse proxy/TLS terminator (per contour) | Public HTTPS | To app zone only |
| Personal app | Relay service | From edge | To relay DB and blob store only |
| Investigative app | API | From edge (authenticated users) | To DB, object store, queue, KMS, AI gateway (if approved) |
| Investigative workers | Job runner | From queue | To object store (scoped), DB via worker role |
| Sandbox | Parser containers | None | **None** (egress denied) |
| Data | PostgreSQL, object store | From app/worker zones with service identities | Backup target only |
| Management | Bastion/admin path | MFA + time-boxed access | Audit sink |
No network path exists between Personal and Investigative zones (T-ISO-003).

# 3. Environment matrix
| Aspect | Local | CI | Test | Staging | Prod Personal | Prod Investigative |
|---|---|---|---|---|---|---|
| Config source | .env profiles per contour | CI variables (job-scoped) | Config repo | Config repo + secret manager | Config repo + secret manager | Config repo + KMS-backed secrets |
| Database | Compose PostgreSQL | Ephemeral | Shared test DB | Prod-like PostgreSQL | Minimal relay metadata DB | PostgreSQL primary + backup/PITR (RPO TBD) |
| Object storage | Emulator | Emulator | Test bucket | Separate bucket | Ciphertext blob bucket | Versioned, retention-locked bucket; separate exports bucket |
| Identity | Stub | Stub | Test IdP | Staging IdP tenant | Device-bound credentials | Production IdP, phishing-resistant auth |
| Logging | Console | Job logs | Central, redacted | Central, redacted | Content-free metrics | Access-controlled, purpose-limited, retention-governed |
| Monitoring | None | Test reports | Basic | Prod-like alerts | Health, error rate, storage | Queue lag, policy denials, integrity failures, backup age, export anomalies |
| Deploy | Manual | Pipeline | Pipeline | Pipeline + approval | Pipeline + approval | Pipeline + two-person approval |

# 4. PostgreSQL (Investigative) — baseline configuration @R@
Roles: `owner/migrator` (owns tables, used only by migrations); `app_rw` (non-owner, no BYPASSRLS, no SET ROLE rights); `worker_rw` (derivative writes only); `audit_writer` (INSERT only on audit tables); `report_ro`; `admin` (break-glass, audited). Every tenant table: `ENABLE` **and** `FORCE ROW LEVEL SECURITY`, policy keyed on transaction-local settings for tenant and case; default deny when no policy exists @V@ (PostgreSQL 18 docs, level 1). Tests must include owner/BYPASSRLS/SET ROLE paths (T-INV-003). Backups: base + WAL archiving candidate; restore tested into a clean environment (T-OPS-003).

# 5. Object storage policies @R@
Buckets: `evidence-originals` (versioning on, retention/legal-hold capability required, write-once semantics by policy), `derivatives`, `exports`. Access only via short-lived signed URLs or service identities; no public access; server-side encryption with separated key custody; every access logged to an audit sink. Hash verification by an independent verifier job.

# 6. Secrets and keys
KMS-managed key per environment; per-service identities; rotation schedule TBD with customer; no shared secrets between contours or between services; break-glass procedure with two-person control and audit.

# 7. Monitoring and alerting
SLI candidates (SLO targets are @OD@, set after baseline): API availability, p95 request latency, ingestion queue lag, parser failure rate, backup age, restore-test success, authorization denial rate, export volume anomalies, custody-chain gaps, audit-checkpoint verification result.

# 8. Backup and recovery
| Item | Method | RPO / RTO | Verification |
|---|---|---|---|
| PostgreSQL | Base + WAL, separate failure domain | TBD (OQ-10) | Quarterly restore drill |
| Evidence objects | Versioning + cross-domain replication | TBD | Hash re-verification after restore |
| Audit chain | Replicated + signed checkpoints stored separately | TBD | Verifier run |
| Personal relay | Ciphertext blobs + metadata DB | Lower criticality (user holds local copy) | Restore smoke test |
| Personal local data | User-driven backup (doc 12) | n/a | Backup-age UI; restore round-trip test |

# 9. Access policies
Least privilege; no standing production access; administrator ≠ plaintext access @SD@; production changes via pipeline; all privileged sessions logged to a sink the administrator cannot alter.

# 10. Air-gapped profile (optional)
Separate deployment profile @SD@: offline update channel, model distribution, patching, licence handling and evidence-import procedure defined before offering; no external egress.
