# CI and GitHub Actions

The repository's automated checks live in [`.github/workflows/`](../.github/workflows/). Pull-request checks target `production`, matching the current release branch.

## Checks by priority

| Priority | Check | Workflow |
| --- | --- | --- |
| P0 | actionlint, Hadolint | `quality.yml` |
| P0 | Playwright browser E2E and axe WCAG 2.1 A/AA scan | `web-quality.yml`; also included in `ci.yml` |
| P0 | Gitleaks history scan, Trivy filesystem scan | `security.yml` |
| P1 | Nightly full-workspace `pnpm audit` | `nightly-audit.yml` |
| P1 | Local Markdown links and fragments | `docs.yml` |
| P2 | 500 KiB compressed-JavaScript budget | `web-quality.yml` |
| P2 | Conventional PR titles and draft release notes | `pull-requests.yml` |
| P2 | Stale issue and PR triage | `stale.yml` |
| P3 | Manual production rollback; automatic deploy rollback remains in `release.yml` | `rollback.yml` |
| P3 | Public API readiness probe every 15 minutes | `health-monitor.yml` |
| P3 | Daily retrieval, gzip check, and disposable PostgreSQL restore test | `backup-verification.yml` |
| P3 | Weekly GHCR retention of recent versions | `ghcr-cleanup.yml` |
| P3 | Dependabot patch/minor auto-merge | `dependabot-auto-merge.yml` |

Existing `codeql.yml`, `ci.yml`, `release.yml`, and `label.yml` continue to provide code analysis, build/test, deploy, and labeling.

## Repository configuration

Configure these repository **Actions variables** and **secrets** before enabling operations against production:

- Variable `PRODUCTION_URL`: public origin, for example `https://app.example.com`. Without it, the scheduled health check is skipped. The production GitHub Environment also uses it as its deployment URL.
- Optional variable `DEPLOY_PATH`: server application directory; defaults to `/opt/app`.
- Secrets `DEPLOY_USER`, `DEPLOY_HOST`, `DEPLOY_SSH_KEY`, and `DEPLOY_KNOWN_HOSTS`: pinned SSH deployment credentials. The backup verification and manual rollback workflows use these too.

The production environment should have required reviewers if approval is desired. Protect the `production` branch and require the CI/security checks before merge. The Dependabot workflow enables auto-merge only for patch/minor updates; GitHub branch protection and the repository's **Allow auto-merge** setting must be enabled for it to wait for required checks. Major dependency updates are left for review.

The GHCR cleanup job can delete package versions. It keeps the 20 most recent versions for each of the `api` and `web` images and deletes older versions, including their SHA tags. Confirm the container package names match `${owner}/${repository}/api` and `${owner}/${repository}/web` before its first run; older tags may no longer be available for manual rollback.

## Operational notes

- `rollback.yml` accepts an existing GHCR tag. Prefer the SHA of a previously deployed release. It uses the same deployment script and health verification as a normal release; if the selected tag is unhealthy, the script attempts to restore the currently recorded tag.
- `backup-verification.yml` downloads the latest `.sql.gz` from the server, validates gzip integrity, and restores it into an isolated PostgreSQL container on the GitHub runner. It requires the server backup job to have produced at least one backup. Backup archives contain production data; the workflow does not print their contents, but they transit the runner and are deleted after the restore test. Review your data-handling policy before enabling this hosted-runner workflow.
- The server backup script itself documents the expected daily schedule and recommends copying backups off-host. A restore test cannot recover data if the only copy on the server is lost.
- The JavaScript budget measures the combined gzip output of emitted `.js` assets and is intentionally set to 500 KiB. Lighthouse is not included because its Chrome sandbox is incompatible with the current hosted runner setup.
- Release Drafter maintains a draft; it does not publish a release or choose a production release date/version automatically.
- Scheduled workflows run on GitHub's schedule and may start later than the exact cron time.
