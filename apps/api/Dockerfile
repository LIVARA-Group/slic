# syntax=docker/dockerfile:1.7
# Build context is the REPOSITORY ROOT:  docker build -f apps/api/Dockerfile .
ARG NODE_VERSION=22
ARG PNPM_VERSION=12.21.0

FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION
ENV CI=true
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /repo

# --- install only what the API needs (cached while manifests are unchanged)
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
COPY packages/database/package.json packages/database/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir /pnpm-store --filter @repo/api...

# --- compile and produce a minimal production tree
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY packages/database packages/database
COPY apps/api apps/api
RUN pnpm --filter @repo/shared build \
    && pnpm --filter @repo/database build \
    && pnpm --filter @repo/brain build \
    && pnpm --filter @repo/api build
RUN pnpm --filter @repo/api deploy --prod /out

# --- runtime: no pnpm, no compilers, non-root
FROM node:${NODE_VERSION}-alpine AS runtime
ARG APP_VERSION=dev
ENV NODE_ENV=production PORT=3000 APP_VERSION=${APP_VERSION}
WORKDIR /app
COPY --from=build --chown=node:node /out/package.json ./
COPY --from=build --chown=node:node /out/node_modules ./node_modules
COPY --from=build --chown=node:node /out/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=4s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/main.js"]
