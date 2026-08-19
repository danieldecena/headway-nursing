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

- Phase 0 of the approved roadmap: run the Fable redesign brief, port the Cursor
  wireframe canvas to Claude Design, get the canonical email decision from Janice.
- Foundation section component library (approved 2026-08-19, zero-visual-change pass).
- Full phase list and everything else: TASKS.md.

## Decision log

### 2026-08-19

- Decided: roadmap approved through launch + handoff in five phases (unblock ->
  early DNS cutover -> design approval -> redesign build -> Janice self-serve).
  Definition of done: Janice edits one price herself end to end.
- Decided: Figma (wireframe plan Phase B) dropped from the critical path — both
  seats are View-only and the Claude Design canvas covers review; parked unless a
  real need appears.
- Decided: early DNS cutover (Astro site replaces live Weebly before the redesign
  ships), gated on the canonical email decision.
- Decided: foundation-first templating — a five-component slot-based section
  library (PageShell, PageHeader, SectionHeading, Card, Button) extracted from the
  utility strings already repeated 3+ times across pages; rendered HTML must not
  change. Data-driven templates deferred pending the Fable brief's content-model
  section.
- Found: tooling gap check against the MCP registry returned zero relevant
  connectors; only action is enabling typescript-lsp in repo-local settings.

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
