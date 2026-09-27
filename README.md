# aa

Static site served at **https://aa.ekat.ca** by nginx on the ekat VPS (the same server as sidebar.ekat.ca).

## Layout

- `public/` - the website. `index.html` is the home page; `404.html` is shown for unknown paths. Only this folder is served.
- `deploy/aa.ekat.conf` - the nginx site config.
- `.github/workflows/deploy.yml` - on every push to `main`, SSHes into the VPS and pulls the latest code.

## Preview locally

Open `public/index.html` in a browser, or:

```bash
npx serve public
```

## One-time server setup

1. **DNS** (Cloudflare, `ekat.ca` zone): add an `A` record `aa` → `162.35.171.10` (the VPS), matching `sidebar`'s record (same proxy on/off setting).
2. **On the VPS** (after DNS resolves, so certbot can verify): the server hosts other sites, so use the guarded script rather than running commands by hand. It stops without changing anything if `/var/www/aa`, the nginx config, a cert for `aa.ekat.ca`, or any other `server_name aa.ekat.ca` already exists; backs up `/etc/nginx` first; and only reloads nginx after `nginx -t` passes.
   ```bash
   curl -fsSL https://raw.githubusercontent.com/idunnoguesswho/aa/main/deploy/install.sh -o /tmp/aa-install.sh
   less /tmp/aa-install.sh
   sudo bash /tmp/aa-install.sh
   ```
3. **GitHub** (this repo → Settings → Secrets and variables → Actions): add `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PORT` - the deploy user needs write access to `/var/www/aa`.
