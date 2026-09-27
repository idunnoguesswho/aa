#!/usr/bin/env bash
# One-time install of https://ekat.ca/aa/ on the shared VPS.
#
# The server hosts several other sites, so this script is strictly additive
# and refuses to run if anything "aa" already exists:
#   - creates only NEW paths: /var/www/aa and /etc/nginx/snippets/aa.location.conf
#   - does NOT edit ekat.ca's config itself: it finds the file and prints the
#     one `include` line to add by hand, so a human sees exactly what changes
#   - backs up /etc/nginx first; nothing is reloaded by this script
#
# Run as root (or with sudo):  bash install.sh
set -euo pipefail

WEB_ROOT="/var/www/aa"
SNIPPET="/etc/nginx/snippets/aa.location.conf"
REPO="https://github.com/idunnoguesswho/aa.git"

# ---- 1. Pre-flight: stop if anything would be overwritten -------------------
fail=0
for p in "$WEB_ROOT" "$SNIPPET"; do
  if [ -e "$p" ] || [ -L "$p" ]; then echo "STOP: $p already exists"; fail=1; fi
done
# Any existing location for /aa (in any site) would clash or shadow ours.
if nginx -T 2>/dev/null | grep -Eq 'location[[:space:]]+(=|\^~|~\*?)?[[:space:]]*/aa([/[:space:]{]|$)'; then
  echo "STOP: nginx already has a location for /aa:"
  nginx -T 2>/dev/null | grep -En 'location[[:space:]]+(=|\^~|~\*?)?[[:space:]]*/aa([/[:space:]{]|$)'
  fail=1
fi
# nginx must already be healthy, so we never stack a change on someone else's error.
if ! nginx -t 2>/dev/null; then echo "STOP: nginx -t fails BEFORE any change"; fail=1; fi
[ "$fail" -eq 0 ] || { echo "Nothing changed."; exit 1; }

# ---- 2. Backup nginx config (rollback: restore this tarball) ---------------
BACKUP="/root/nginx-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP" -C /etc nginx
echo "Backed up /etc/nginx to $BACKUP"

# ---- 3. Add the site files and snippet (new paths only) --------------------
git clone "$REPO" "$WEB_ROOT"
install -m 644 "$WEB_ROOT/deploy/aa.location.conf" "$SNIPPET"

# ---- 4. Show where the include goes (exact "ekat.ca", not *.ekat.ca) --------
echo
echo "Config file(s) with a server block for ekat.ca itself:"
grep -lE 'server_name([^;]*[[:space:]])?(www\.)?ekat\.ca([[:space:];]|$)' /etc/nginx/sites-enabled/* || true
cat <<'EOF'

NEXT (manual, one line): inside the HTTPS (listen 443) server block for
ekat.ca in the file above, add:

    include snippets/aa.location.conf;

then validate and reload (reload keeps every other site serving):

    nginx -t && systemctl reload nginx

If nginx -t fails, remove that line again - nothing else was changed.
EOF
