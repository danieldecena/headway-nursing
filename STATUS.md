# STATUS — headwaynurse-website

## Confirmed working

- Astro build passes: 27 pages, sitemap generated (last verified 2026-08-17).
- Deploys to Cloudflare Pages via GitHub Actions on push to main.
- Compliance fix pass live (consent-gated GA, real _headers, noindex thank-you,
  JSON-LD, env-gated payment/Formspree messaging).
- Section component library in use across every page: PageShell, PageHeader,
  SectionHeading, Card, Button in src/components/.

## Known broken

- Live Weebly email is `headwaynursingservicesofficial@gmail.com` (after-hours
  text says `headwaynursing@gmail.com`) but `src/data/site.ts` still has
  `headwaynursing@comcast.net`. Needs Daniel/Janice to pick the canonical address.
- public/images/testimonials/t3.png is a byte-copy of logo-banner.png, not a
  testimonial.

## Next Up

- Wireframe review checkpoint with Daniel. The canvas is live at
  https://claude.ai/code/artifact/bbbfdb7f-8189-4455-88ca-8fd89d57899d and needs
  three decisions: palette A vs B, nav consolidation to six items, logo treatment.
- Then the Fable redesign brief and the canonical email decision from Janice.
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
- Found: the teleported session left the tree unbuildable — four pages imported
  components that were not on disk. Rebuilt them (18ee153) and finished the port
  (df41912). Parity method worth reusing: stash the edits, build, keep dist/ as
  a baseline, then `diff -r` the rebuilt dist against it. It caught a missing
  import that a passing grep would not have.
- Found: Tailwind 4's scanner reads bare words anywhere in a source file,
  including comments and object keys. A variant named `outline` emitted a
  phantom `.outline` rule into the bundle; renamed to `ghost`. Never name a
  variant key after a real utility.
- Done: Task 3 of the archived wireframes plan. Six artboards seeded to a Claude
  Design canvas (audit, tokens, Home/Courses/Course detail/Contact at 1440),
  grayscale so the palette stays open, all copy real from src/data/. Phase B of
  that plan (Figma, Tasks 5-7) stays dropped per the Figma decision above.
- Decided: two spots stay hand-written rather than forced into the components —
  the course detail `<dl>` (interleaves `sm:grid-cols-2` after `p-6`) and the
  home hero's teal CTA (not one of the three button variants).

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
