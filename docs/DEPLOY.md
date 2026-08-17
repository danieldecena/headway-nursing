# Cloudflare Pages deployment

Repo: `danieldecena/headway-nursing` (private). Build verified locally (`npm run build` → `dist/`).

## Option A — GitHub Actions (recommended)

CI workflow: `.github/workflows/deploy.yml` — builds on push to `main` and runs `wrangler pages deploy`.

### One-time setup

1. Create a Cloudflare API token: Dashboard → My Profile → API Tokens → **Edit Cloudflare Workers** template (or custom with **Account / Cloudflare Pages / Edit**).
2. Copy **Account ID** from Workers & Pages → Account details.
3. GitHub → `headway-nursing` → Settings → Secrets and variables → Actions:

| Secret                  | Required  | Notes                              |
| ----------------------- | --------- | ---------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Yes       | From step 1                        |
| `CLOUDFLARE_ACCOUNT_ID` | Yes       | From step 2                        |
| `PUBLIC_FORMSPREE_ID`   | For forms | Until aunt creates Formspree form  |
| `PUBLIC_GA_ID`          | No        | GA4                                |
| `PUBLIC_STRIPE_*`       | No        | Payment links when Stripe is ready |

4. First deploy (creates project if missing):

```bash
cd ~/developer/headway-nursing
npx wrangler login          # or export CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
./scripts/setup-cloudflare-pages.sh
```

5. Push to `main` — subsequent deploys are automatic.

## Option B — Connect repository in dashboard

1. Cloudflare Dashboard → Workers & Pages → Create → Connect to Git → `danieldecena/headway-nursing`
2. Settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 22 (set `NODE_VERSION=22` in env)

Use **either** Option A or B, not both (duplicate deploys).

## Environment variables (Production)

Set in Pages → Settings → Environment variables:

| Variable                        | Required | Notes                    |
| ------------------------------- | -------- | ------------------------ |
| `PUBLIC_FORMSPREE_ID`           | Yes      | Formspree form ID        |
| `PUBLIC_GA_ID`                  | No       | GA4 measurement ID       |
| `PUBLIC_STRIPE_PAYMENT_URL`     | No       | General payment link     |
| `PUBLIC_STRIPE_LINK_*`          | No       | Per-course payment links |
| `PUBLIC_CLASSMANAGER_EMBED_URL` | No       | Booking calendar embed   |

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
