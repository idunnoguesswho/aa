# aa

Static site served at **https://aa.ekat.ca** by Cloudflare Workers (static assets).

## Layout

- `public/` - everything in here is the website. `index.html` is the home page; `404.html` is shown for unknown paths.
- `wrangler.jsonc` - Cloudflare config, including the `aa.ekat.ca` custom domain (Cloudflare manages its DNS record and certificate).

## Preview locally

```bash
npx wrangler dev
```

Then open http://localhost:8787.

## Deploy

Manual:

```bash
npx wrangler deploy
```

Automatic on every push to `main`: in the Cloudflare dashboard go to **Workers & Pages → aa → Settings → Build → Connect** and pick this GitHub repo (build command: none; deploy command: `npx wrangler deploy`). No secrets need to be stored in GitHub.
