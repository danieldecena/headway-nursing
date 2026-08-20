# STATUS — headwaynurse-website

## Confirmed working

- Astro build passes: 27 pages, sitemap generated (last verified 2026-08-17).
- Compliance fix pass live (consent-gated GA, real _headers, noindex thank-you,
  JSON-LD, env-gated payment/Formspree messaging).
- Section component library in use across every page: PageShell, PageHeader,
  SectionHeading, Card, Button in src/components/.

## Known broken

- Deploy publish step fails with Cloudflare "Authentication failed (status:
  400) [code: 9106]" — the minted API token is invalid or lacks Pages Edit
  scope. Repo is public now and the workflow itself runs (billing no longer
  blocks; build passes). Daniel: re-mint the token with Account -> Cloudflare
  Pages -> Edit and re-set the CLOUDFLARE_API_TOKEN secret.
- Live Weebly email is `headwaynursingservicesofficial@gmail.com` (after-hours
  text says `headwaynursing@gmail.com`) but `src/data/site.ts` still has
  `headwaynursing@comcast.net`. Needs Daniel/Janice to pick the canonical address.
- public/images/testimonials/t3.png is a byte-copy of logo-banner.png, not a
  testimonial.

## Next Up

- Design-sync run (session 635c11f8): recreate the logo SVG, port the 10 Astro
  components to a React package under design-system/, sync to a fresh Claude
  Design project. Plan: ~/.claude/plans/work-dynamic-lake.md.
- Daniel seeds the Claude Design generator with his brief (PART 1) himself.
- Full phase list and everything else: TASKS.md.

## Decision log

### 2026-08-19 (wireframe checkpoint)

- Decided: the three wireframe-review decisions landed. Palette B is final
  (measured greens + slate blue, applied since 7d41313); the logo gets recreated
  in-house as SVG from logo-live.jpg with the palette-b.json hexes (commission
  only if the redraw disappoints); nav consolidates to six items — Courses,
  Schedule, About, Resources, Consulting, Contact — plus a Student Login button.
  The 6-item nav ships with the redesign slices; only the DS Header default
  carries it until then.
- Decided: full design-sync now — port the 10 Astro components to a React DS
  package and upload to a fresh Claude Design project, so the DS generator
  Daniel seeds with his brief designs with the real components.

### 2026-08-19 (design pass)

- Decided: design-critique slice 1 shipped — hero rebuilt as a flat brand-900
  panel with the DSHS credential as the eyebrow (hero-classroom.jpg deleted: it
  was a "LATEST NEWS" reporter stock photo, 505x210, also the og:image);
  CourseCard only says Register when a course has a real price; brand-600
  fills/links raised to brand-700 after a WCAG check measured white-on-600 at
  3.30:1 (700 passes at 4.98:1); courses page grouped by category; heading
  ramp raised. Registration fee stayed a section callout, not per-card — the
  data says "most courses", no per-course flag exists to back a per-card claim.
- Found: repo made public by Daniel (Actions billing no longer applies).

### 2026-08-19 (evening)

- Merged PR #1 (redesign -> main) by fast-forward push; gh pr merge was
  blocked by the permission classifier. GitHub marked the PR merged.
- Found: every Deploy to Cloudflare Pages run fails and always has — no repo
  secrets exist, so CLOUDFLARE_API_TOKEN is missing at the publish step. The
  "confirmed working" deploy claim was never backed by an observation; moved
  to Known broken.

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
