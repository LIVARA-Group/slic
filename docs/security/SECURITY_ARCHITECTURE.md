# SLIC Security Architecture

**Status:** Initial working draft  
**Last reviewed:** 2026-11-17  
**Owner:** SLIC maintainers

## 1. Purpose and status

This document defines the intended security architecture and the properties that implementations must demonstrate.

It distinguishes architectural requirements from verified implementation. A statement in this document is not evidence that a control is deployed. Link each requirement to code, configuration, and tests as those are established.

## 2. Architectural principles

- **Isolation by design:** Personal and Investigative are separate trust boundaries.
- **Least privilege:** identities and services receive only the permissions required for their task.
- **Deny by default:** access is denied unless an explicit policy permits it.
- **Defense in depth:** security does not depend on a single control or UI layer.
- **Data sovereignty:** Personal data handling should preserve user control and make external processing explicit.
- **Verifiable integrity:** integrity claims must be backed by defined mechanisms and tests.
- **Human oversight:** AI-generated content is not automatically a verified fact, decision, or authorized action.
- **Secure defaults:** deployment and development defaults should minimize exposure.

## 3. Security domains and boundaries

### 3.1 Personal

The Personal contour is intended to be local-first and user-sovereign.

Architecture should document:

- where source data is stored;
- which local processes can access it;
- whether and how data leaves the device;
- how synchronization and backups work;
- where keys and credentials are held;
- how imports, exports, and deletion are handled.

Local-first must not be described as equivalent to encrypted, private, or offline-only unless those properties are implemented and verified.

### 3.2 Investigative

The Investigative contour handles resources that require explicit access control and strong separation between workspaces or tenants.

Architecture should document:

- identity and membership model;
- tenant/workspace scoping;
- role and permission evaluation;
- API and background-job authorization;
- storage and object-access policies;
- audit and provenance requirements;
- administrative and recovery access.

### 3.3 Separation between contours

The Personal and Investigative contours must remain isolated across applicable layers:

| Layer | Required boundary |
|---|---|
| Identity | Explicitly defined identity and session scope |
| Authorization | Independent policy evaluation; no implicit permission inheritance |
| Data | Separate stores or technically enforced data partitioning |
| Files | Separate namespaces and access checks |
| Keys | Separate key scope and lifecycle |
| Transit | Explicit, authenticated, authorized transfer paths |
| Cache and queues | Context-aware keys, payloads, and access restrictions |
| Logs and exports | No accidental cross-contour content aggregation |
| Backups | Documented separation, access, retention, and restore procedures |

If a feature intentionally transfers information between contours, it must specify the initiating user, source, destination, data selected, authorization check, and resulting record.

## 4. Identity, authentication, and sessions

Requirements:

- Use established authentication mechanisms and secure password/credential handling.
- Protect session tokens from script access where cookie-based sessions are used; set appropriate `HttpOnly`, `Secure`, and `SameSite` attributes according to deployment needs.
- Rotate or invalidate sessions after relevant security events.
- Apply rate limits and abuse controls to authentication and recovery endpoints.
- Avoid leaking whether sensitive accounts or resources exist.
- Require authorization checks independently of successful authentication.
- Define maintainer and operational access separately from ordinary user access.

The exact authentication provider, MFA policy, session lifetime, and recovery flow must be documented from the actual implementation.

## 5. Authorization

Authorization must be enforced at trusted service boundaries.

- Check permissions for every read, write, delete, export, share, and administrative action.
- Scope resource queries to the authorized user, tenant, workspace, and contour.
- Do not rely on client-side route guards or hidden UI controls.
- Treat resource identifiers supplied by clients as untrusted.
- Re-check permissions in asynchronous jobs and file-download flows.
- Prefer explicit permission models and deny access when policy evaluation fails.
- Test both allowed and denied paths, including cross-tenant and cross-contour attempts.

## 6. Data protection and cryptography

Document and verify:

- data classification and sensitivity;
- encryption in transit and at rest, where implemented;
- key generation, storage, access, rotation, backup, and destruction;
- separation of keys between security domains;
- secret storage for application and CI/CD credentials;
- redaction of secrets and sensitive content from logs.

Do not claim end-to-end encryption, zero-knowledge architecture, or cryptographic immutability unless the design and implementation support those exact claims and have been reviewed.

## 7. Files, imports, and exports

- Treat uploaded and imported files as untrusted.
- Apply limits to size, type, and processing time.
- Use safe parsers and keep parsing libraries patched.
- Avoid executing imported content.
- Store files outside executable application paths where practical.
- Authorize every file read, preview, download, and export.
- Prevent path traversal and unsafe archive extraction.
- Define retention, deletion, and backup behavior.
- Avoid placing sensitive file contents in logs or error reports.

## 8. Evidence integrity and provenance

Where SLIC supports investigative evidence or provenance-sensitive records, define:

- what constitutes an evidence object;
- how source and acquisition context are recorded;
- which operations can modify the original;
- how derived copies and transformations are represented;
- which actors and timestamps are recorded;
- how integrity checks are generated and verified;
- how exports preserve relevant metadata.

A hash alone does not establish authenticity, chain of custody, or immutability. Describe only the guarantees provided by the complete implemented process.

## 9. AI and tool security

AI models and retrieved content are untrusted components.

- Enforce access control outside the model.
- Do not treat model instructions as authorization.
- Treat documents, webpages, retrieved passages, and tool output as untrusted data.
- Restrict tools to explicit capabilities and least privilege.
- Prevent one contour's context from entering another contour's model request or cache.
- Define what data may be sent to local or remote model providers.
- Make external processing and retention behavior explicit.
- Label generated or inferred content and preserve source references where applicable.
- Require human confirmation for consequential external actions.
- Record tool actions in a privacy-conscious, reviewable way.

## 10. Infrastructure and supply chain

- Keep dependencies updated and review security advisories.
- Commit lockfiles and use reproducible, controlled dependency installation where practical.
- Use least-privilege CI tokens and short-lived credentials where supported.
- Protect production deployment credentials and environments.
- Pin or constrain third-party GitHub Actions according to project policy.
- Run static analysis, dependency review, and secret scanning where available.
- Separate development, test, and production credentials and data.
- Restrict administrative access and review it periodically.

## 11. Logging, monitoring, and incident readiness

- Log security-relevant events with sufficient context for investigation.
- Do not log passwords, tokens, private keys, or unnecessary user content.
- Restrict access to logs and define retention.
- Protect audit records against unauthorized modification where required.
- Define alerting and escalation ownership before production operation.
- Document backup restoration and incident response procedures.

## 12. Verification checklist

For each deployed component, record status as **Not started**, **In progress**, **Implemented**, or **Verified**.

| Control | Status | Evidence / reference |
|---|---|---|
| Cross-contour access tests | Not started | |
| Cross-tenant authorization tests | Not started | |
| Server-side object authorization | Not started | |
| Session security review | Not started | |
| File upload and parser hardening | Not started | |
| Secret scanning | Not started | |
| Dependency vulnerability checks | Not started | |
| CI/CD permissions review | Not started | |
| Backup and restore test | Not started | |
| AI prompt-injection and tool-boundary tests | Not started | |
| Sensitive-log review | Not started | |

Update statuses only when supported by implementation evidence.
