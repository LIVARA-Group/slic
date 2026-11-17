# SLIC Incident Response Plan

**Status:** Initial working draft  
**Last reviewed:** 2026-11-17  
**Owner:** SLIC maintainers

## 1. Purpose

This plan describes how maintainers should coordinate a response to a suspected or confirmed security incident affecting SLIC, its users, its infrastructure, or project credentials.

It is a response framework. Before production use, assign named roles, private communication channels, escalation contacts, and operational procedures.

## 2. What is a security incident?

Examples include:

- unauthorized access to an account, workspace, or data;
- suspected cross-contour or cross-tenant data exposure;
- leaked credentials, tokens, signing keys, or deployment secrets;
- malicious code or compromised dependencies entering a release;
- unauthorized modification or deletion of security-sensitive records;
- compromise of a build, release, or deployment pipeline;
- exploitation of a file parser or exposed service;
- unintended disclosure of sensitive data to an AI model or external integration.

A suspected incident should be handled cautiously until its scope is understood.

## 3. Response principles

- Protect people and sensitive data first.
- Limit ongoing harm before attempting a full investigation.
- Preserve relevant evidence and timestamps.
- Restrict incident information to people who need it.
- Do not publish secrets, personal data, or investigative material.
- Keep a factual timeline and distinguish confirmed facts from hypotheses.
- Communicate accurately; do not speculate about impact.
- Restore service only after the relevant risk is understood and mitigated.

## 4. Roles

Assign these roles for each incident. One person may hold multiple roles in a small project, but responsibilities should remain explicit.

| Role | Responsibility |
|---|---|
| Incident Lead | Coordinates response, decisions, and timeline |
| Technical Lead | Investigates affected systems and implements containment |
| Security Contact | Coordinates vulnerability reporter and disclosure |
| Communications Owner | Prepares user, maintainer, and public communications |
| Data/Privacy Owner | Assesses affected data and applicable notification obligations |

Record the assigned people and private contact methods in the incident record. Do not put private contact details in this public document.

## 5. Severity and prioritization

Use the following as an initial triage guide. Adjust severity based on actual exploitability, exposure, and impact.

| Severity | Examples | Initial priority |
|---|---|---|
| Critical | Confirmed broad data exposure, remote compromise of production, cross-contour compromise with sensitive data at risk | Immediate |
| High | Unauthorized access to another tenant's data, privileged account compromise, exploitable server-side code execution | Urgent |
| Medium | Limited-scope authorization bypass or exploitable weakness with meaningful constraints | Prompt |
| Low | Defense-in-depth weakness with no demonstrated direct impact | Planned |

Severity is provisional and may change as evidence is collected.

## 6. Response lifecycle

### Phase 1 — Detect and report

1. Receive the report through a private channel.
2. Record the time received and the reporter's supplied details.
3. Create a restricted incident record.
4. Acknowledge receipt when a safe reply channel exists.
5. Avoid requesting real user data or unnecessary sensitive material.

### Phase 2 — Triage

1. Determine whether the report is a security issue.
2. Identify affected products, contours, tenants, versions, and environments.
3. Assess confidentiality, integrity, and availability impact.
4. Determine whether exploitation is active or likely.
5. Assign an initial severity and incident lead.
6. Record unknowns explicitly.

### Phase 3 — Containment

Choose proportionate actions based on the incident. Examples:

- revoke or rotate compromised credentials and tokens;
- disable an affected integration, endpoint, feature, or deployment;
- restrict access to affected resources;
- isolate a compromised service or environment;
- pause releases or background jobs;
- block a malicious file or dependency version.

Do not destroy relevant evidence while containing the incident. Record what was changed, by whom, and when.

### Phase 4 — Investigation

1. Preserve relevant logs, configuration, build metadata, and affected artifacts.
2. Establish a timeline of events.
3. Identify the root cause and plausible attack path.
4. Determine what data or systems were accessed, modified, or exposed.
5. Assess whether Personal and Investigative boundaries were affected.
6. Identify affected users or tenants where possible.
7. Separate confirmed findings from assumptions.

Collect only the information needed for the investigation and restrict access to it.

### Phase 5 — Eradication and recovery

1. Fix the underlying vulnerability or remove the compromised component.
2. Rotate affected secrets and credentials.
3. Rebuild from trusted source and dependencies where compromise is suspected.
4. Restore from known-good backups only after validating their integrity.
5. Add regression tests for the failure mode.
6. Verify authorization and contour isolation before restoring affected functionality.
7. Monitor for recurrence.

### Phase 6 — Communication and disclosure

- Communicate with affected parties when appropriate and in accordance with applicable obligations.
- Coordinate public disclosure with the reporter where possible.
- Publish a GitHub Security Advisory when appropriate.
- State what is known, what users should do, and what remains under investigation.
- Do not disclose exploit details that would create unnecessary risk before mitigation is available.

### Phase 7 — Post-incident review

After containment and recovery:

- document root cause and contributing factors;
- record impact and response timeline;
- identify controls that failed or were missing;
- create remediation tasks with owners;
- add tests and monitoring;
- update the threat model and security architecture;
- review whether user-facing documentation needs correction.

The review should improve systems and processes, not assign blame.

## 7. Incident record template

Use a restricted record with the following fields:

- Incident ID:
- Date/time detected (UTC):
- Reporter / detection source:
- Incident Lead:
- Severity and rationale:
- Affected components and versions:
- Affected contour(s):
- Affected tenant(s), if applicable:
- Confirmed impact:
- Potential impact / unknowns:
- Containment actions and timestamps:
- Evidence locations and access restrictions:
- Root cause:
- Remediation:
- Recovery verification:
- Communications and notifications:
- Follow-up actions, owners, and due dates:
- Closure date:

Do not include passwords, access tokens, private keys, or unnecessary personal or investigative data in the record.

## 8. Readiness requirements

Before relying on this plan operationally, maintainers must:

- designate an incident lead and backup;
- configure a private reporting channel;
- establish restricted incident storage;
- document credential and key rotation procedures;
- know how to disable affected services and integrations;
- test backup restoration;
- identify applicable legal and contractual notification requirements;
- define who can approve public statements and releases.

## 9. Review

Review this plan after a material incident, major architecture change, or change in operational ownership, and at least periodically once SLIC is operated in production.
