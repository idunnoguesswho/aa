#!/usr/bin/env bash
# One-time install of aa.ekat.ca on the shared VPS.
#
# This server hosts several other sites, so every step is additive and the
# script refuses to run if anything named "aa" already exists:
#   - only creates NEW paths (/var/www/aa, sites-available/aa.ekat.conf, the symlink)
#   - never edits another site's config, cert, or web root
#   - backs up /etc/nginx first, and validates with `nginx -t` before any reload
#   - certbot is limited to the single domain aa.ekat.ca
#
# Run as root (or with sudo):  bash install.sh
set -euo pipefail

DOMAIN="aa.ekat.ca"
WEB_ROOT="/var/www/aa"
CONF_NAME="aa.ekat.conf"
AVAIL="/etc/nginx/sites-available/$CONF_NAME"
ENABLED="/etc/nginx/sites-enabled/$CONF_NAME"
REPO="https://github.com/idunnoguesswho/aa.git"

# ---- 1. Pre-flight: stop if anything would be overwritten -------------------
fail=0
for p in "$WEB_ROOT" "$AVAIL" "$ENABLED"; do
  if [ -e "$p" ] || [ -L "$p" ]; then echo "STOP: $p already exists"; fail=1; fi
done
# Another site already claiming this hostname would make nginx pick one silently.
if nginx -T 2>/dev/null | grep -Eq "server_name[^;]*\b${DOMAIN//./\\.}\b"; then
  echo "STOP: some nginx config already uses server_name $DOMAIN"; fail=1
fi
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "STOP: a certificate for $DOMAIN already exists"; fail=1
fi
# nginx must already be healthy, so we don't get blamed for someone else's error.
if ! nginx -t 2>/dev/null; then echo "STOP: nginx -t fails BEFORE any change"; fail=1; fi
[ "$fail" -eq 0 ] || { echo "Nothing changed."; exit 1; }

# ---- 2. Backup nginx config (rollback: restore this tarball) ---------------
BACKUP="/root/nginx-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP" -C /etc nginx
echo "Backed up /etc/nginx to $BACKUP"

# ---- 3. Add the site (new paths only) --------------------------------------
git clone "$REPO" "$WEB_ROOT"
cp "$WEB_ROOT/deploy/$CONF_NAME" "$AVAIL"
ln -s "$AVAIL" "$ENABLED"

# ---- 4. Validate before reload; undo our own files if invalid --------------
if ! nginx -t; then
  echo "nginx -t failed - removing only the files this script added"
  rm -f "$ENABLED" "$AVAIL"
  exit 1
fi
systemctl reload nginx   # reload, not restart: other sites keep serving

# ---- 5. TLS for this one domain only ---------------------------------------
certbot --nginx -d "$DOMAIN" --redirect
echo "Done: https://$DOMAIN"
