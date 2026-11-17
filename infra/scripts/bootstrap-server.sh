#!/usr/bin/env bash
# One-time preparation of a fresh Ubuntu/Debian server. REVIEW BEFORE RUNNING, run as root.
# Usage: DEPLOY_USER=deploy APP_DIR=/opt/app DOMAIN=example.com ACME_EMAIL=you@example.com ./bootstrap-server.sh
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-deploy}"
APP_DIR="${APP_DIR:-/opt/app}"
: "${DOMAIN:?set DOMAIN}"; : "${ACME_EMAIL:?set ACME_EMAIL}"

apt-get update -y
apt-get install -y ca-certificates curl ufw fail2ban unattended-upgrades
command -v docker >/dev/null || curl -fsSL https://get.docker.com | sh

id "$DEPLOY_USER" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "$DEPLOY_USER"
usermod -aG docker "$DEPLOY_USER"   # NOTE: docker group membership is root-equivalent on this host.
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 750 "$APP_DIR"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 700 "/home/$DEPLOY_USER/.ssh"

if [ ! -f "$APP_DIR/.env" ]; then
  umask 077
  cat > "$APP_DIR/.env" <<ENV
DOMAIN=${DOMAIN}
ACME_EMAIL=${ACME_EMAIL}
POSTGRES_USER=app
POSTGRES_PASSWORD=$(head -c 24 /dev/urandom | base64 | tr -d '/+=\n')
POSTGRES_DB=app
LOG_LEVEL=log
ENV
  chown "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR/.env"
fi

ufw default deny incoming; ufw default allow outgoing
ufw allow 22/tcp; ufw allow 80/tcp; ufw allow 443/tcp; ufw allow 443/udp
ufw --force enable
systemctl enable --now fail2ban unattended-upgrades

echo "Done. Next: add the CI deploy public key to /home/$DEPLOY_USER/.ssh/authorized_keys,"
echo "point DNS for ${DOMAIN} at this server, then push to the 'production' branch."
