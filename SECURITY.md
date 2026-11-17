# Security Policy

## Supported Versions

SLIC is currently under active development and has not reached a stable production release.

Security fixes are prioritized for the latest development version.

Older development snapshots may not receive security updates.

| Version              | Supported         |
| -------------------- | ----------------- |
| Development (latest) | Yes               |
| Previous snapshots   | No                |
| Stable releases      | Not yet available |

## Reporting a Vulnerability

If you discover a potential security vulnerability in SLIC, please report it privately.

**Do not disclose security vulnerabilities through public GitHub Issues, Pull Requests, or Discussions.**

Preferred reporting channel:

- GitHub Private Vulnerability Reporting (when enabled).

If private reporting is unavailable, contact the maintainers through the designated private security contact.

Please include:

- A description of the vulnerability.
- Affected components and versions.
- Potential security impact.
- Steps to reproduce the issue.
- Proof of concept, if available.
- Any relevant mitigations.

Do not include real user data, personal information, credentials, private keys, or investigative evidence in vulnerability reports.

## Scope

Security reports are relevant to the following areas:

- Authentication and authorization.
- Identity, session, and access control.
- Personal and Investigative contour isolation.
- Tenant and data isolation.
- Cryptographic implementation and key management.
- Data storage, synchronization, and transport.
- File ingestion, parsing, and processing.
- API security and infrastructure configuration.
- Audit logging and evidence integrity.
- AI processing boundaries and unauthorized data access.
- Dependency and supply-chain vulnerabilities.
- CI/CD pipelines and GitHub Actions security.

## Out of Scope

The following are generally not considered security vulnerabilities:

- Issues without a demonstrated security impact.
- Bugs unrelated to security boundaries.
- Missing features or incomplete functionality.
- Vulnerabilities in unsupported third-party systems.
- Theoretical attacks without a plausible exploitation path.

Reports involving third-party dependencies may still be relevant if they create a demonstrable security impact on SLIC.

## Disclosure Process

The maintainers will:

1. Acknowledge receipt of the report.
2. Review and assess the reported vulnerability.
3. Determine affected components and potential impact.
4. Develop and validate an appropriate remediation.
5. Coordinate disclosure with the reporter.
6. Publish a security advisory when appropriate.

Please allow maintainers reasonable time to investigate and address reported vulnerabilities before public disclosure.

There is currently no guaranteed response or remediation SLA.

## Security Principles

SLIC follows these foundational security principles:

- **Isolation by design** — Personal and Investigative are separate trust boundaries.
- **Least privilege** — access is limited to explicitly authorized operations.
- **Data sovereignty** — Personal data remains under user control.
- **Defense in depth** — security is enforced across application, data, and infrastructure layers.
- **Verifiable integrity** — security-sensitive operations must be independently verifiable.
- **Human oversight** — AI-generated outputs do not automatically become verified facts or authorized actions.

These principles describe the project's engineering direction and do not constitute a guarantee that every mechanism is already implemented.

## Safe Harbor

Security research conducted in good faith and in accordance with applicable laws is welcome.

Researchers should:

- Avoid accessing, modifying, or exposing data belonging to other users.
- Avoid disrupting services or degrading system availability.
- Avoid destructive testing.
- Stop testing and report the issue if sensitive data is encountered.
- Respect the privacy and integrity of all SLIC data.

The project does not currently operate a paid bug bounty program.
