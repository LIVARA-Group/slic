# SLIC Threat Model

**Status:** Initial working draft  
**Last reviewed:** 2026-11-17  
**Owner:** SLIC maintainers

## 1. Purpose

This document identifies the security boundaries, assets, threat actors, and principal abuse cases that should guide SLIC's design and security testing.

It is a working threat model, not a certification or a claim that every listed control is already implemented. Each control must be verified against the current codebase and deployment configuration.

## 2. System context

SLIC is developed around two distinct operating contours:

- **Personal:** a local-first, user-sovereign knowledge environment.
- **Investigative:** an environment for investigative work where access control, separation of data, and the integrity and provenance of records are important.

The two contours must be treated as separate trust boundaries. Their separation must not depend solely on UI navigation, naming conventions, or client-side checks.

## 3. Security objectives

1. Prevent unauthorized access to user data and project resources.
2. Prevent cross-contour access between Personal and Investigative.
3. Enforce authorization at trusted server or operating-system boundaries, not only in the UI.
4. Protect credentials, cryptographic keys, tokens, and sensitive configuration.
5. Preserve the integrity and provenance of evidence and other security-sensitive records where those capabilities exist.
6. Make security-relevant actions reviewable without unnecessarily collecting sensitive content.
7. Treat imported files, external content, and AI outputs as untrusted until validated.
8. Support secure updates and reduce dependency and build-pipeline risk.

## 4. Assets to protect

| Asset | Security concern |
|---|---|
| Personal knowledge and files | Confidentiality, integrity, user control |
| Investigative records and evidence | Confidentiality, integrity, provenance, access history |
| Identity and session material | Account takeover and impersonation |
| Authorization rules and membership data | Privilege escalation and unauthorized sharing |
| Encryption keys and secrets | Data exposure and loss of control |
| Backups and synchronized copies | Replication of unauthorized access or deletion |
| Imported documents and attachments | Malicious content, parser exploits, data leakage |
| Audit and provenance records | Tampering, deletion, misleading history |
| AI prompts, context, and outputs | Prompt injection, cross-boundary disclosure, false assertions |
| Source code, dependencies, CI/CD credentials | Supply-chain compromise |

## 5. Trust boundaries

### 5.1 Personal contour

Personal data should remain under the user's control. Local-first behavior does not by itself guarantee confidentiality: local processes, extensions, backups, synchronization, telemetry, and operating-system accounts remain relevant threat surfaces.

### 5.2 Investigative contour

Investigative resources require explicit authorization and tenant/workspace isolation. Access must be checked for every relevant operation, including reads, writes, exports, background jobs, search, and file access.

### 5.3 Boundary between contours

Personal and Investigative must be isolated across all applicable layers:

- identity and session scope;
- authorization and policy evaluation;
- database schemas, records, and query paths;
- file storage and object access;
- encryption keys and key-encryption contexts;
- APIs, events, queues, caches, and background jobs;
- logs, exports, backups, and synchronization.

Any cross-contour transfer must be an explicit, user-authorized operation with a defined destination and reviewable behavior. Do not assume that a shared account or UI session authorizes data sharing between contours.

### 5.4 External inputs and integrations

Treat external websites, imported files, third-party APIs, plugins, model providers, and generated content as untrusted. Validate data at boundaries and apply least-privilege access to integrations.

## 6. Threat actors

- An unauthenticated internet attacker.
- An authenticated user attempting to exceed their permissions.
- A malicious or compromised tenant member.
- A compromised endpoint, browser extension, dependency, or integration.
- A malicious document or other imported payload.
- A compromised maintainer account or CI/CD credential.
- An AI model or tool workflow manipulated by hostile input.

These are threat scenarios, not assumptions about user intent.

## 7. Principal threat scenarios

| ID | Threat | Potential impact | Expected security response |
|---|---|---|---|
| TM-01 | Cross-contour data access | Exposure or modification of data across Personal and Investigative | Separate trust contexts; enforce server-side authorization and storage boundaries |
| TM-02 | Cross-tenant access | Disclosure or tampering across investigative workspaces | Scope every query and object lookup to an authorized tenant/workspace |
| TM-03 | Broken object-level authorization | Access to another user's or member's resource by changing an identifier | Authorize every object operation; test negative cases |
| TM-04 | Session or credential compromise | Account takeover | Secure session handling, secret hygiene, revocation, and appropriate MFA support |
| TM-05 | Malicious file or parser exploit | Code execution, service compromise, or data exfiltration | File type and size limits, isolated parsing, safe storage, patched parsers |
| TM-06 | Evidence alteration or provenance gaps | Reduced trust in investigative records | Restrict mutation, record provenance, and validate integrity mechanisms |
| TM-07 | Prompt injection or hostile retrieved content | Unauthorized tool use or disclosure of protected context | Treat retrieved content as data, constrain tools, and enforce authorization outside the model |
| TM-08 | AI-generated false assertion | Incorrect information treated as verified fact | Label generated content, preserve source references, require human review for consequential actions |
| TM-09 | Secret leakage in CI/CD | Repository, infrastructure, or data compromise | Secret scanning, least-privilege tokens, protected environments, rotation |
| TM-10 | Dependency or build compromise | Malicious code shipped to users | Dependency review, lockfile integrity, update policy, provenance where available |
| TM-11 | Unsafe export, backup, or sync | Persistent or unintended disclosure | Explicit access controls, encryption where implemented, retention and restore testing |
| TM-12 | Log over-collection | Sensitive content exposed through diagnostics | Minimize logged data, redact secrets, restrict log access and retention |

## 8. Security design requirements

The following are requirements to validate during implementation:

- Authorization is enforced on the trusted side of each boundary.
- Deny-by-default behavior is used where access is not explicitly granted.
- Every resource lookup is scoped to the caller's authorized context.
- Personal and Investigative do not share data stores, keys, or transit paths unless a documented, explicit design permits a narrowly scoped operation.
- Secrets are not committed to source control or exposed in logs.
- Imported content is parsed and rendered defensively.
- AI systems cannot grant themselves access or override application authorization.
- Security-sensitive changes have tests, review, and traceable rationale.
- Backups, exports, and deletion behavior are included in the threat model.
- Failures do not silently broaden access.

## 9. Verification and maintenance

For each requirement, maintainers should record:

- implementation location;
- automated test or other verification evidence;
- known limitations;
- owner and review date.

Review this model when a new trust boundary, storage provider, synchronization path, AI tool, integration, or deployment mode is introduced, and after a material security incident.

## 10. Open questions

Track unresolved design decisions here rather than implying that they are settled:

- Which components execute locally, remotely, or in both modes?
- What are the authoritative identity and authorization services for each contour?
- Which storage and key-management boundaries are enforced technically?
- What is the supported backup, recovery, and deletion model?
- Which AI models and tools can receive user data, and under what consent and access rules?
- What audit events are required, and what content must never be logged?
