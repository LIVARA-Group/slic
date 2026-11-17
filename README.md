# Monorepo

TypeScript monorepo managed with **pnpm** and **Turborepo**:

| Path              | What it is                                          | Stack                                                              |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/web`        | Browser app                                         | React 19, Vite, TanStack Router (file-based) + TanStack Query, Zod |
| `apps/api`        | HTTP API                                            | NestJS (ESM), Terminus health checks, Helmet, Zod-validated env    |
| `packages/shared` | Contracts shared by both apps (Zod schemas + types) | Pure ESM, no framework imports                                     |
| `infra/`          | Reverse proxy config and server scripts             | Caddy, bash                                                        |
| `.github/`        | CI/CD, CodeQL, Dependabot                           | GitHub Actions                                                     |

Single long-lived branch: **`production`**. Pull requests target it; every push to it is verified, built into images and deployed.

## Quick start

```bash
nvm use                      # Node 22 (see .nvmrc)
corepack enable              # or: npm i -g pnpm@12.21.0
pnpm install
cp .env.example .env
pnpm infra:up                # optional: local Postgres (Docker)
pnpm dev                     # API on :3000, web on :5173 (proxies /api to the API)
```

Open http://localhost:5173 and the **API status** page: it calls `GET /api/v1/status`, validated with the schema from `@repo/shared`.

## Commands (run from the repository root)

| Command                             | Does                                                      |
| ----------------------------------- | --------------------------------------------------------- |
| `pnpm dev`                          | Watch mode for shared, api and web                        |
| `pnpm check`                        | Everything CI runs: format, lint, typecheck, tests, build |
| `pnpm test` / `pnpm test:e2e`       | Unit tests (Vitest) / API end-to-end tests (Supertest)    |
| `pnpm lint`                         | oxlint with type-aware rules and import-boundary rules    |
| `pnpm format`                       | Prettier                                                  |
| `pnpm --filter @repo/api add <pkg>` | Add a dependency to one package                           |

Versions used by several packages live in the `catalog:` section of `pnpm-workspace.yaml`.

## Architecture rules (enforced by lint)

- `apps/web` must not import NestJS/Express or `@repo/api`.
- `apps/api` must not import React, TanStack or `@repo/web`.
- `packages/shared` must stay pure: no React, Nest, TanStack, app imports or `node:*`.
- Anything both apps need (request/response shapes, constants) goes into `packages/shared`.

To add a package: create `packages/<name>` with `"name": "@repo/<name>"`, depend on it with `"workspace:*"`, and add its `package.json` to the `COPY` lines of the Dockerfiles that use it.

## Environments and deployment

```
push to production ─▶ ci (verify, audit, docker builds) ─▶ images (GHCR, tagged with the commit SHA)
                                                         ─▶ deploy over SSH ─▶ health check ─▶ done / automatic rollback
```

Runtime: one server running `docker-compose.prod.yml` — **Caddy** (automatic HTTPS, routes `/api/*` to the API and everything else to the web container), **web** (unprivileged nginx), **api**, **postgres** (internal network only).

### One-time setup

1. **Server** (Ubuntu/Debian): review and run `infra/scripts/bootstrap-server.sh` as root (`DOMAIN`, `ACME_EMAIL` required). Point DNS for the domain at the server.
2. **SSH key** for deployment: create a key pair, put the public key in the deploy user's `authorized_keys`. Get the pinned host key with `ssh-keyscan -t ed25519 <host>`.
3. **GitHub → Settings → Environments → `production`**: add required reviewers if you want manual approval, and set:

   | Kind     | Name                 | Value                        |
   | -------- | -------------------- | ---------------------------- |
   | Secret   | `DEPLOY_HOST`        | server host name or IP       |
   | Secret   | `DEPLOY_USER`        | the deploy user              |
   | Secret   | `DEPLOY_SSH_KEY`     | the **private** key          |
   | Secret   | `DEPLOY_KNOWN_HOSTS` | output of `ssh-keyscan`      |
   | Variable | `DEPLOY_PATH`        | optional, default `/opt/app` |
   | Variable | `PRODUCTION_URL`     | e.g. `https://example.com`   |

4. **Repository → Settings → Actions → General**: allow workflows to create packages (GHCR).
5. Protect the branch: `./infra/scripts/protect-production-branch.sh owner/repo` (needs `gh` and admin rights) or configure the same rules in the UI. Replace `@your-github-user` in `.github/CODEOWNERS`.

First push to `production` deploys. If verification fails after deploy, `deploy.sh` brings back the previous tag and the workflow fails.

### Operations

- Logs: `docker compose -f docker-compose.prod.yml logs -f api` (JSON in production).
- Backups: `infra/scripts/backup-postgres.sh` (schedule it with cron and **copy the files off the server**).
- Rollback by hand: re-run the `Release` workflow on an older commit, or on the server `TAG=<sha> IMAGE_PREFIX=ghcr.io/owner/repo docker compose -f docker-compose.prod.yml up -d`.
- Secrets live in `/opt/app/.env` on the server (created by the bootstrap script); never commit `.env`.

## Status of this scaffold — what was and was not verified

Verified on the day it was generated (Node 22, pnpm 12.21): fresh `pnpm install`; `pnpm build`, `typecheck`, `lint`, `test`, `test:e2e` all pass; the API starts, validates its environment, serves health and status endpoints with security headers and JSON logs; the Vite proxy reaches it; `pnpm deploy` produces a standalone API tree.

**Not verified** (no Docker daemon, GitHub or server was available): Docker image builds, `docker compose` runtime, the nginx CSP in a real browser, the GitHub workflows, SSH deployment and the rollback path. Expect to fix small things on the first CI/deploy run. GitHub Action versions (`@v4` etc.) were chosen from memory; Dependabot will propose updates.

## Not included (add when you need it)

A database layer/ORM and migrations (Postgres runs, `DATABASE_URL` is wired, nothing uses it yet), authentication, API documentation (`@nestjs/swagger`), error tracking, remote Turbo cache, staging environment.
