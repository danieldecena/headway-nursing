# SEO and analytics setup

## Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: `https://www.headwaynursing.org`
3. Verify via DNS TXT record (Cloudflare DNS) or HTML file upload
4. Submit sitemap: `https://www.headwaynursing.org/sitemap-index.xml`

## Google Business Profile

1. Sign in at [business.google.com](https://business.google.com)
2. Claim or verify **Headway Nursing Services**
3. Update:
   - Address: 8412 South 124th St, Seattle, WA 98178
   - Hours: Mon–Fri 9 AM – 3 PM
   - Website: https://www.headwaynursing.org
   - Phone: 425-306-5010
4. Add photos from `public/images/`

## Analytics options

### Cloudflare Web Analytics (recommended — no cookie banner)

1. Cloudflare Dashboard → headwaynursing.org → Analytics → Web Analytics
2. Copy beacon script → add to `BaseLayout.astro` if not using GA4

### Google Analytics 4 (optional)

1. Create GA4 property at analytics.google.com
2. Copy Measurement ID (`G-XXXXXXXX`)
3. Set `PUBLIC_GA_ID` in Cloudflare Pages env
4. Cookie banner in `CookieBanner.astro` activates automatically

## Local SEO keywords (for page titles/descriptions)

- HCA training Seattle
- Home Care Aide certification Washington
- DSHS approved caregiver training
- South King County HCA classes

## Schema markup

Already implemented in `src/layouts/BaseLayout.astro` (Organization) and course pages (Course).

## Firecrawl re-crawl

Requires `FIRECRAWL_API_KEY` in the shell environment (kept outside this repo).

```bash
cd ~/developer/headwaynurse-website
npx firecrawl-cli map "https://www.headwaynursing.org" -o .firecrawl/site-map-live.json
npx firecrawl-cli crawl "https://www.headwaynursing.org" --max-depth 2 --limit 50 --wait -o .firecrawl/crawl.json
```
