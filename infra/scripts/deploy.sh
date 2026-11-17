#!/usr/bin/env bash
# Runs ON THE SERVER (copied by the release workflow). Pulls a tagged release, starts it,
# verifies it through the public edge and rolls back to the previous tag if verification fails.
# Usage: echo "$REGISTRY_TOKEN" | ./deploy.sh <tag> <image-prefix> <registry-user>
set -euo pipefail

TAG="${1:?tag required}"
IMAGE_PREFIX="${2:?image prefix required, e.g. ghcr.io/owner/repo}"
REGISTRY_USER="${3:?registry user required}"
COMPOSE=(docker compose -f docker-compose.prod.yml)

cd "$(dirname "$0")"
[ -f .env ] || { echo "ERROR: $(pwd)/.env is missing (see infra/scripts/bootstrap-server.sh)" >&2; exit 1; }
set -a; . ./.env; set +a
: "${DOMAIN:?DOMAIN must be set in .env}"

registry="${IMAGE_PREFIX%%/*}"
docker login "$registry" -u "$REGISTRY_USER" --password-stdin

PREVIOUS_TAG="$(cat .current_tag 2>/dev/null || true)"
export IMAGE_PREFIX

start_release() {
  export TAG="$1"
  "${COMPOSE[@]}" pull
  "${COMPOSE[@]}" up -d --remove-orphans --wait --wait-timeout 180
}

verify_release() {
  # Goes through Caddy/TLS exactly as users do; --resolve avoids depending on public DNS.
  curl -fsS --retry 12 --retry-delay 5 --retry-all-errors --max-time 8 \
    --resolve "${DOMAIN}:443:127.0.0.1" "https://${DOMAIN}/api/health/ready" >/dev/null
}

echo "==> Deploying ${TAG} (previous: ${PREVIOUS_TAG:-none})"
if start_release "$TAG" && verify_release; then
  echo "$TAG" > .current_tag
  docker image prune -f >/dev/null
  echo "==> Release ${TAG} is live"
  exit 0
fi

echo "!! Release ${TAG} failed verification" >&2
"${COMPOSE[@]}" logs --tail=80 api web caddy >&2 || true
if [ -n "$PREVIOUS_TAG" ]; then
  echo "==> Rolling back to ${PREVIOUS_TAG}" >&2
  start_release "$PREVIOUS_TAG" || echo "!! Rollback start failed; manual intervention required" >&2
fi
exit 1
