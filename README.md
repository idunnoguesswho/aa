# aa

Static site served at **https://ekat.ca/aa/** by nginx on the ekat VPS (`162.35.171.10`), as a sub-path of the main ekat.ca site.

## Layout

- `public/` - the website. Only this folder is served. Use **relative links** (`style.css`, `about.html`) so pages work under `/aa/`; `404.html` uses absolute `/aa/...` links because it's shown at any depth.
- `deploy/aa.location.conf` - nginx snippet that adds the `/aa` locations to ekat.ca's server block.
- `deploy/install.sh` - one-time, guarded server install.
- `.github/workflows/deploy.yml` - on every push to `main`, SSHes into the VPS and pulls the latest code.

**CSP note:** ekat.ca sends a strict Content-Security-Policy (`script-src 'self'; style-src 'self' https://fonts.googleapis.com`, ...), and `/aa` inherits it. No inline `<script>`/`<style>`/`style=""` and no third-party scripts - put CSS/JS in files under `public/`.

## Pages

- `index.html` - home: links to the readings, the sign-off tool and the printable booklet.
- `readings.html` + `content.js` + `readings.js` - *Meeting in a Pocket* as a small reading app: a table of contents grouped by topic (At the meeting, Prayers, Daily practice, Reflections, Big Book index, Names & numbers) and a reading pane with previous/next through the whole booklet. On a phone the contents list and the reading pane are two screens (`body[data-view]` switches them); at 820px+ they sit side by side. `content.js` holds the booklet text as plain data (hand-maintained to mirror the Word file - see below); `readings.js` renders it and has no content of its own. "Names & Numbers" is a notes box saved only in that phone's browser (localStorage), never sent anywhere.
- `signoff.html` + `signoff.js` - meeting sign-off: meeting name, contact ID, GPS or typed location, finger signature -> PDF built on the phone, then the share sheet (Mail, Messages...) or a download. Nothing is uploaded.
- `style.css` - the one shared stylesheet (system fonts, light/dark, mobile first).
- `vendor/jspdf.umd.min.js` - jsPDF 2.5.1, served locally because the CSP blocks CDN scripts.

`tools/build_readings.py` converts `files/Meeting-in-a-Pocket-3x5.docx` into a flat HTML page and is kept for reference / as a fallback, but `readings.html` no longer runs from its output - editing the booklet now means updating the section data in `content.js` directly (same wording as the Word file, organized into the topic groups above).

## Preview locally

```bash
npx serve public
```

## One-time server setup

No DNS or certificate changes are needed - it rides on ekat.ca's existing ones.

1. **On the VPS:** the server hosts other sites, so use the guarded script. It stops without changing anything if `/var/www/aa`, the snippet, or any existing nginx `location /aa` already exists, backs up `/etc/nginx`, and does **not** edit ekat.ca's config or reload nginx itself.
   ```bash
   curl -fsSL https://raw.githubusercontent.com/idunnoguesswho/aa/main/deploy/install.sh -o /tmp/aa-install.sh
   less /tmp/aa-install.sh
   sudo bash /tmp/aa-install.sh
   ```
2. Add the one `include snippets/aa.location.conf;` line the script prints to ekat.ca's HTTPS server block, then `nginx -t && systemctl reload nginx`.
3. **GitHub** (this repo → Settings → Secrets and variables → Actions): add `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PORT` - the deploy user needs write access to `/var/www/aa`.
