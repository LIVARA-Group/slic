#!/usr/bin/env bash
# Logical backup of the production database. Run on the server, e.g. daily from cron:
#   0 3 * * * cd /opt/app && ./backup-postgres.sh >> backup.log 2>&1
# Copy the files off the server too (object storage / another host): a backup on the same disk is not a backup.
set -euo pipefail
umask 077
cd "$(dirname "$0")"
set -a; . ./.env; set +a
mkdir -p backups
chmod 700 backups

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
out="backups/${POSTGRES_DB}-${stamp}.sql.gz"
tmp="$(mktemp "backups/.${POSTGRES_DB}-${stamp}.XXXXXX")"
trap 'rm -f -- "$tmp"' EXIT

docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner | gzip -9 > "$tmp"
gzip -t "$tmp"
mv -- "$tmp" "$out"
find backups -name '*.sql.gz' -mtime +14 -delete
echo "backup written: $out ($(du -h "$out" | cut -f1))"
