# SLIC Security Testing Strategy

**Status:** Initial working draft  
**Last reviewed:** 2026-11-17  
**Owner:** SLIC maintainers

## 1. Purpose

This document defines a practical security-testing strategy for SLIC. It focuses on verifying security boundaries and preventing regressions.

A passing test suite is evidence for the scenarios it covers; it is not proof that the system is secure.

## 2. Testing principles

- Test both permitted and forbidden behavior.
- Prioritize trust boundaries and authorization decisions.
- Test through public interfaces as well as internal units where appropriate.
- Use synthetic data, never real user or investigative data.
- Keep security tests deterministic and repeatable.
- Record the tested version, environment, and evidence.
- Re-run relevant tests after changes to identity, authorization, storage, files, AI, or infrastructure.

## 3. Required test areas

### 3.1 Authentication and sessions

Verify:

- unauthenticated requests cannot access protected resources;
- invalid, expired, revoked, or malformed sessions are rejected;
- session cookies use appropriate security attributes for the deployment;
- authentication and recovery endpoints resist basic abuse;
- logout and credential rotation invalidate the expected sessions;
- errors do not expose secrets or unnecessary account information.

### 3.2 Authorization and object access

Verify:

- users cannot read, update, delete, export, or share resources outside their permissions;
- changing an object ID does not bypass authorization;
- permissions are checked on every relevant API operation;
- background jobs and download endpoints enforce the same access rules;
- revoked membership or permissions take effect as designed;
- authorization failures fail closed.

### 3.3 Personal / Investigative isolation

This is a release-blocking security area.

Verify that:

- Personal requests cannot access Investigative records;
- Investigative requests cannot access Personal records;
- identifiers from one contour cannot be used to resolve objects in the other;
- files, previews, exports, search, caches, and background jobs preserve contour boundaries;
- credentials, keys, and session context are not implicitly reused across contours;
- any explicit transfer requires the intended authorization and user action.

### 3.4 Tenant and workspace isolation

Verify:

- a member of one tenant cannot enumerate or access another tenant's resources;
- every query and object-storage operation is scoped correctly;
- search, pagination, counts, exports, and background jobs do not leak cross-tenant data;
- role changes and membership revocation are enforced consistently;
- administrative operations require the intended privileges.

### 3.5 File handling

Verify:

- file size and type limits are enforced server-side;
- malformed and oversized files fail safely;
- archive extraction cannot traverse paths or overwrite unintended files;
- file names and metadata cannot inject executable content into rendered views;
- parsers do not execute imported content;
- file previews and downloads require authorization;
- temporary files are cleaned up according to policy.

### 3.6 Data protection and secrets

Verify:

- secrets are absent from source, test fixtures, logs, and build artifacts;
- sensitive values are redacted from error responses and diagnostics;
- transport security is correctly configured in deployed environments;
- encryption and key-management claims match the actual implementation;
- backups and exports have documented access restrictions.

### 3.7 AI and external tools

Verify:

- prompt injection in documents or retrieved content cannot override application authorization;
- model output cannot independently grant permissions or perform unauthorized actions;
- tool calls are limited to explicitly granted capabilities;
- data from one contour is not included in another contour's context, cache, or tool request;
- remote model processing follows the documented data-sharing policy;
- generated claims are distinguishable from source-backed facts;
- consequential external actions require the configured human confirmation.

### 3.8 Supply chain and CI/CD

Verify:

- dependency vulnerabilities are reviewed and triaged;
- lockfiles are committed and changes reviewed;
- CI permissions follow least privilege;
- secrets are not exposed to untrusted pull-request code;
- release workflows restrict who can publish artifacts;
- third-party actions and build tools are reviewed and appropriately pinned;
- protected branches require the intended checks and reviews.

### 3.9 Logging and audit

Verify:

- security-relevant events are recorded where required;
- logs do not contain credentials, tokens, keys, or unnecessary sensitive content;
- access to logs is restricted;
- audit records cannot be modified by ordinary users where immutability or tamper resistance is required;
- timestamps and actor attribution are handled consistently.

## 4. Test techniques

Use a combination of:

- unit tests for policy and validation logic;
- integration tests for API authorization and storage boundaries;
- end-to-end tests for user-visible access flows;
- negative tests using identities from different tenants and contours;
- static analysis and dependency scanning;
- secret scanning;
- configuration review;
- targeted manual penetration testing before production milestones.

Automated scanners do not replace architecture-specific tests.

## 5. Safe test environment

- Use synthetic accounts, tenants, files, and evidence.
- Do not test against production data without explicit authorization and a documented plan.
- Avoid destructive tests on shared environments.
- Keep test credentials separate from production credentials.
- Restrict access to test artifacts that contain sensitive information.
- Clean up temporary accounts and test data after testing.

## 6. Pull request security checklist

Use the relevant subset for each change:

- [ ] Authorization is enforced on the server or other trusted boundary.
- [ ] Resource access is scoped to the correct user, tenant, and contour.
- [ ] Negative authorization tests cover denied access.
- [ ] File and external input validation is performed where applicable.
- [ ] No secrets or sensitive data are introduced into source, logs, or fixtures.
- [ ] Database migrations preserve intended isolation and access rules.
- [ ] Background jobs, caches, exports, and storage paths preserve the same boundaries.
- [ ] AI context and tool permissions are constrained where applicable.
- [ ] Dependencies and CI/CD changes have been reviewed.
- [ ] Security documentation and threat model are updated when boundaries or assumptions change.

## 7. Release security gates

Before a production release, define and enforce gates appropriate to the release scope. At minimum, the project should establish:

1. Required CI checks pass.
2. High-impact authorization and isolation tests pass.
3. No known unresolved critical vulnerability is accepted without an explicit, documented risk decision.
4. Secrets and deployment permissions are reviewed.
5. Backup and recovery procedures are tested for the relevant data stores.
6. Release artifacts are produced through the trusted pipeline.
7. Known limitations and residual risks are documented.

Do not mark a gate as satisfied until its evidence is available.

## 8. Findings and remediation tracking

For each finding, record:

- identifier and date;
- affected component and version;
- severity and rationale;
- reproducible steps using synthetic data;
- impact and affected trust boundary;
- remediation owner and target date;
- fix reference;
- regression test reference;
- verification result.

Re-test the original failure mode after remediation. Close a finding only when the fix and its regression coverage have been verified.

## 9. Review cadence

Review this strategy when:

- a new contour, tenant model, storage path, integration, or AI capability is introduced;
- authentication or authorization changes;
- file-processing behavior changes;
- CI/CD or deployment architecture changes;
- a security incident or significant finding occurs;
- preparing for a production release.
