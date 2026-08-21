# Headway Nursing Services — Website Rebuild

Modern Astro site replacing the Weebly site at [headwaynursing.org](https://www.headwaynursing.org).

## Quick start

```bash
cd ~/developer/headway-nursing
npm install
cp .env.example .env   # fill in Formspree ID, Stripe links when ready
npm run dev            # http://localhost:4321
npm run build
```

## Project docs

| Doc | Purpose |
|-----|---------|
| [docs/DEPLOY.md](docs/DEPLOY.md) | Cloudflare Pages setup + DNS cutover |
| [docs/PAYMENTS.md](docs/PAYMENTS.md) | Stripe + ClassManager.pro configuration |
| [docs/QA.md](docs/QA.md) | Pre-launch checklist |
| [docs/HANDOFF.md](docs/HANDOFF.md) | Operator guide for aunt |
| [docs/NOTES.md](docs/NOTES.md) | Repo memory: durable facts, gotchas, conventions |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Tokens, components, styling and assets — read before writing UI |
| [docs/PROCESS.md](docs/PROCESS.md) | Phase order from today to launch and handoff |

## Stack

- **Astro 7** + Tailwind CSS 4
- **Cloudflare Pages** hosting
- **Formspree** registration forms
- **Stripe** or **ClassManager.pro** payments (env-configured)
- **Relias** LMS (external link, unchanged)

## Content migration

Manual migration from Weebly completed. To refresh with Firecrawl:

```bash
export FIRECRAWL_API_KEY=fc-...
npx firecrawl-cli crawl "https://www.headwaynursing.org" --max-depth 2 --limit 50 --wait -o .firecrawl/crawl.json
```

URL inventory: `.firecrawl/site-map.json`  
Weebly redirects: `public/_redirects`

## Blocked on aunt (before launch)

- [ ] Stripe business account verification
- [ ] Formspree form ID
- [ ] Domain registrar / Weebly access for DNS cutover
- [ ] Google Business Profile update
- [ ] Legal review of privacy/terms pages

## Cost

~$15/yr domain + optional ~$49/mo ClassManager.pro + Stripe transaction fees.
