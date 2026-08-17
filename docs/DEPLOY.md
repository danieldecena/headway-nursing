# Cloudflare Pages deployment

## Connect repository

1. Push `headway-nursing` to a private GitHub repo
2. Cloudflare Dashboard → Workers & Pages → Create → Connect to Git
3. Settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 22 (set `NODE_VERSION=22` in env)

## Environment variables (Production)

Set in Pages → Settings → Environment variables:

| Variable | Required | Notes |
|----------|----------|-------|
| `PUBLIC_FORMSPREE_ID` | Yes | Formspree form ID |
| `PUBLIC_GA_ID` | No | GA4 measurement ID |
| `PUBLIC_STRIPE_PAYMENT_URL` | No | General payment link |
| `PUBLIC_STRIPE_LINK_*` | No | Per-course payment links |
| `PUBLIC_CLASSMANAGER_EMBED_URL` | No | Booking calendar embed |

## Domain cutover

1. Transfer domain to Cloudflare Registrar OR update nameservers at current registrar
2. Pages → Custom domains → Add `headwaynursing.org` and `www.headwaynursing.org`
3. Enable **Always Use HTTPS**
4. `_redirects` in `public/` handles Weebly URL 301s automatically

## Preview deployments

Every push to a branch gets a `*.pages.dev` preview URL — share with aunt for approval.

## Firecrawl migration (local)

```bash
export FIRECRAWL_API_KEY=fc-...
mkdir -p .firecrawl
npx firecrawl-cli map "https://www.headwaynursing.org" -o .firecrawl/site-map.json
npx firecrawl-cli crawl "https://www.headwaynursing.org" --max-depth 2 --limit 50 --wait -o .firecrawl/crawl.json
```

Site map inventory already at `.firecrawl/site-map.json` (manual).
