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

1. **DNS** (Cloudflare, `ekat.ca` zone): add an `A` record `aa` → the VPS IP, matching `sidebar`'s record (same proxy on/off setting).
2. **On the VPS:**
   ```bash
   git clone https://github.com/idunnoguesswho/aa.git /var/www/aa
   cp /var/www/aa/deploy/aa.ekat.conf /etc/nginx/sites-available/aa.ekat.conf
   ln -s /etc/nginx/sites-available/aa.ekat.conf /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   certbot --nginx -d aa.ekat.ca
   ```
3. **GitHub** (this repo → Settings → Secrets and variables → Actions): add `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PORT` - the deploy user needs write access to `/var/www/aa`.
