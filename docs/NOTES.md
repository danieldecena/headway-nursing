# NOTES — repo memory for headwaynurse-website

Per-project facts an agent needs that neither the code nor STATUS.md carries.
Cross-project lessons go to ~/.claude/cerebrum.md, session state to STATUS.md.

## Naming

- Local folder `headwaynurse-website`; npm package, Wrangler project, and
  GitHub repo are all `headway-nursing` (danieldecena/headway-nursing).

## Data & content

- All page copy lives in `src/data/*.ts` (courses, site, faqs, payments,
  schedules) — edit data, not pages, for content changes.
- `courses.ts` prices were confirmed against live Weebly announcements
  ($700 blended / $650 classroom-unavailable / $500 core), but other live
  pages still conflict ($570, $105 Mental Health) — see the reconcile task.
- `site.email` (comcast.net) is known-wrong; canonical address is an open
  decision (Weebly shows headwaynursingservicesofficial@gmail.com).
- `public/images/testimonials/t3.png` is a byte-copy of logo-banner.png.
- `public/images/logo.svg` is the in-house vector mark (traced 2026-08-19
  from the live-site JPEG with palette-b hexes); logo-banner.png remains only
  as the og:image.

## Build gotchas

- Tailwind 4's scanner reads bare words anywhere in a source file (comments,
  object keys). Never name a variant key after a real utility (`outline` bug,
  renamed `ghost`).
- brand-500 (#86b54b) is lighter than brand-600 (#519d68) — deliberate
  (measured values); ramp normalization is the design generator's job.
- White-on-brand-600 fails AA (3.30:1); fills/links use brand-700+ (4.98:1).

## Design system

- `design-system/` is the React port for Claude Design sync; class strings
  must stay verbatim vs the .astro sources (checked by
  `design-system/fidelity.mjs` after `astro build` + DS build).
- Sync state and re-sync risks: `.design-sync/NOTES.md`. Project:
  claude.ai/design/p/2a079be8-059a-48f5-a37e-858cf845d634.
- Header's DS default nav = decided 6 items + Student Login; live site still
  ships 9 in `src/data/site.ts` until the redesign slices land.

## Deploy

- Cloudflare Pages via GitHub Actions on main; publish step currently fails
  on an invalid CLOUDFLARE_API_TOKEN (needs Pages Edit scope re-mint).
- Verify a deploy by the workflow's publish step output, not by build exit.
