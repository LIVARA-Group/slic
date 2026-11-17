#!/usr/bin/env bash
# Logical backup of the production database. Run on the server, e.g. daily from cron:
#   0 3 * * * cd /opt/app && ./backup-postgres.sh >> backup.log 2>&1
# Copy the files off the server too (object storage / another host): a backup on the same disk is not a backup.
set -euo pipefail
cd "$(dirname "$0")"
set -a; . ./.env; set +a
mkdir -p backups
out="backups/${POSTGRES_DB}-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner | gzip -9 > "$out"
gzip -t "$out"
find backups -name '*.sql.gz' -mtime +14 -delete
echo "backup written: $out ($(du -h "$out" | cut -f1))"
