# STATUS — headwaynurse-website

## Confirmed working

- Astro build passes: 27 pages, sitemap generated (last verified 2026-08-17).
- Deploys to Cloudflare Pages via GitHub Actions on push to main.
- Compliance fix pass live (consent-gated GA, real _headers, noindex thank-you,
  JSON-LD, env-gated payment/Formspree messaging).

## Known broken

- Weebly-era content discrepancies: live site email is
  headwaynursingservicesofficial@gmail.com (after-hours text says
  headwaynursing@gmail.com) but src/data/site.ts says headwaynursing@comcast.net;
  live home lists CPR/First Aid $85, Nurse Delegation $80, CE $120 — none are in
  courses.ts. Needs Daniel/Janice to confirm canonical contact + course list.
- public/images/testimonials/t3.png is a byte-copy of logo-banner.png, not a
  testimonial.

## Next Up

- Wireframing plan Phase A: measure Option B palette, then seed the Claude Design
  canvas (plan: docs/superpowers/plans/2026-08-17-wireframes.md).
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
