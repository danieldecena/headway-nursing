# STATUS — headwaynurse-website

## Confirmed working

- Astro build passes: 27 pages, sitemap generated (last verified 2026-08-17).
- Deploys to Cloudflare Pages via GitHub Actions on push to main.
- Compliance fix pass live (consent-gated GA, real _headers, noindex thank-you,
  JSON-LD, env-gated payment/Formspree messaging).

## Known broken

- Live Weebly email is `headwaynursingservicesofficial@gmail.com` (after-hours
  text says `headwaynursing@gmail.com`) but `src/data/site.ts` still has
  `headwaynursing@comcast.net`. Needs Daniel/Janice to pick the canonical address.
- public/images/testimonials/t3.png is a byte-copy of logo-banner.png, not a
  testimonial.

## Next Up

- Wireframe review checkpoint: palette A vs B, 6-item nav, logo treatment.
  Canvas: ~/.cursor/projects/Users-home-developer-headwaynurse-website/canvases/headway-wireframes-phase-a.canvas.tsx
  Plan: docs/superpowers/plans/2026-08-17-wireframes.md.
- Open items tracked in TASKS.md.

## Decision log

### 2026-08-17

- Decided: reviewed three plans; cowork and tick-board plans were already executed
  by other sessions and were discarded, the Cursor wireframing plan approved with
  amendments (measured palette, t3.png exclusion, commit fix pass first).
- Decided: wireframe on Claude Design first, Figma second (both View seats may not
  write; Figma preflight gates Phase B). Lean scope: 4 desktop templates + audit.
- Decided: captured the Weebly audit with Firecrawl screenshots instead of
  claude-in-chrome — the Chrome extension was not connected. Same deliverable.
- Found: the live site has real logo files (green/blue hands mark, purple header
  banner), saved to docs/superpowers/plans/assets/weebly/. Live announcements also
  confirm courses.ts prices ($700 blended, $650 classroom unavailable, $500 core).
