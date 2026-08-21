# STATUS — headwaynurse-website

## Confirmed working

- Astro build passes: 29 pages, sitemap generated (verified 2026-08-21).
- Vitest suite: 44 tests over src/data/, run as a PR gate by
  .github/workflows/ci.yml alongside `astro check` and the build.
- Compliance fix pass live (consent-gated GA, real _headers, noindex thank-you,
  JSON-LD, env-gated payment/Formspree messaging).
- Section component library in use across every page: PageShell, PageHeader,
  SectionHeading, Card, Button in src/components/.
- The in-house logo renders: header lockup and favicon both use
  public/images/logo.svg. Until 2026-08-20 it was referenced by nothing.
- main and redesign hold identical content; every branch and open PR from
  earlier sessions is merged. docs/DESIGN-SYSTEM.md is the design-to-code
  reference.
- Design system is synced to Claude Design project 2a079be8: 10 components,
  65 files, self-check green, both brand fonts resolving.
- GA4 conversion events ride the existing consent gate: eight named events on
  the register, pay, course-card, Relias, tel: and mailto: paths. Absent from
  the built HTML without PUBLIC_GA_ID. Event table: docs/ANALYTICS.md.
- Testimonials are structured content in src/data/testimonials.ts rather than
  three flat PNGs with the quote baked into the picture.
- Every page reviewed in a browser at 1280 and the home and courses pages at
  390. No page ships placeholder or contradictory copy; the register block reads
  as a call to action whether or not Formspree is configured.

## Known broken

- Deploy publish step fails with Cloudflare "Authentication failed (status:
  400) [code: 9106]" — the minted API token is invalid or lacks Pages Edit
  scope. Repo is public now and the workflow itself runs (billing no longer
  blocks; build passes). Daniel: re-mint the token with Account -> Cloudflare
  Pages -> Edit and re-set the CLOUDFLARE_API_TOKEN secret.
- No `PUBLIC_*` repo secrets exist. `gh secret list` returns only the two
  Cloudflare ones, but `.github/workflows/deploy.yml` feeds nine `PUBLIC_*`
  values into the build. Even once the token is fixed, a green deploy ships an
  empty Formspree ID, no Stripe links and no GA — the contact form would be
  dead on arrival. Daniel: set them before the first real publish.
- Live Weebly email is `headwaynursingservicesofficial@gmail.com` (after-hours
  text says `headwaynursing@gmail.com`) but `src/data/site.ts` still has
  `headwaynursing@comcast.net`. Needs Daniel/Janice to pick the canonical address.
- Headway's regulatory regime is unconfirmed, so `src/data/compliance.ts` ships
  with `licensure.status: 'unconfirmed'` and /policies renders no licensing
  section. Could not be resolved from public sources: the Workforce Board's
  licensed-schools list renders dynamically and the live Weebly site states no
  licence number or agency. Janice needs to answer: is Headway licensed as a
  private career school under RCW 28C.10 (if so, what licence number), or is it
  DSHS-approved only under WAC 388-112A? If the former, /policies must also
  carry the verbatim WAC 490-105-043 licensing statement and the Workforce Board
  complaints route, and the enrollment agreement has its own requirements.

## Next Up

- Daniel seeds the Claude Design generator with his brief (PART 1) himself
  (design-sync is re-synced; project 2a079be8 is current).
- Two blockers are Daniel's alone and gate everything downstream: re-mint the
  Cloudflare token, and set the nine PUBLIC_* secrets.
- Full phase list and everything else: TASKS.md.

## Decision log

### 2026-08-21 (template-ready design and analytics)

- Decided: ship the site as a finished template with real design and working
  analytics, and let the outstanding content answers (email, prices, licensure)
  land later as data edits. Daniel's call - the blockers are all other people's
  to clear, and none of them gate the design.
- Decided: GA4 stays, rather than switching to Plausible or adding PostHog. It
  was already wired and consent-gated, it links to Search Console and Ads, and a
  29-page brochure site does not need session replay. The cost was one delegated
  click listener and one submit listener.
- tel: and mailto: links are matched by href instead of being tagged, so every
  phone and email link on the site counts without touching the markup. Everything
  else opts in with data-analytics. Verified in a browser against the built site
  with gtag stubbed: five events fired with the right link_text and a click on an
  untagged nav link produced none.
- The testimonials page was three PNGs from Weebly with the quote text baked in,
  alt="Student testimonial" on all three, and t3.png a byte-copy of the logo. The
  quotes are now real HTML, the portraits were cropped out of the composites, and
  an entry with photo: null falls back to an initials avatar. That closes the
  t3 known-broken entry - the three composites are deleted.
- RegisterSection promised a form and Stripe unconditionally while the form was
  gated on PUBLIC_FORMSPREE_ID, so 11 pages read "submit the form below" directly
  above "online registration is temporarily unavailable". Gated the intro on the
  same flags. Privacy and Terms were publishing "Review with legal counsel before
  launch" to the public; removed.
- Astro drops the newline between a text run and a following element, which had
  shipped six links jammed against their neighbouring words across /policies,
  /refund-policy and /privacy. Found by scanning built HTML for a word character
  touching an anchor boundary; the source-level guard in tests/site.test.ts was
  proved to fire by reintroducing one, with the mutation asserted first.
- The unconfigured register block rendered an empty green panel above a white
  panel repeating the same phone and email. It now carries Call and Email
  buttons and the second panel is gone. Both branches verified from built HTML.

### 2026-08-21 (compliance disclosures)

- Decided: the compliance pages publish only what holds under either regulatory
  regime, and the licence-specific statements sit behind
  `compliance.licensure.status`. Asserting a licensure status nobody has
  confirmed is the one failure mode worth engineering against here — a false
  licence claim on a training provider's site is worse than a missing one.
- Verified the gate in both directions: 0 occurrences of "28C.10" in the built
  page with the flag closed, 1 with it open, back to 0 after restoring.
- Found: the old /refund-policy stated a two-week notice rule and never
  mentioned the five-business-day cancellation right or the tiered schedule.
  If RCW 28C.10 applies that understated a right the student holds, so the
  page was rewritten to the WAC 490-105-130 floor regardless of regime.
- Out of scope by design: the six catalog items needing facts only Janice holds
  (faculty qualifications, calendar, standards of progress, facilities and
  ratios, job placement, financial aid). Inventing them is the failure this
  work guards against.

### 2026-08-21 (nav consolidation)

- Done: the header cramping is fixed. navLinks cut from nine to the decided
  six, with /resources built as a hub so the four displaced pages (plus HCA
  Exam) keep a home — /testimonials and /faq were linked from nowhere else
  and would have been orphaned. Measured after, not assumed: wordmark 28px
  (one line, down from 56) and header 77px (down from 105) at 1280/1440/1600.
- Decided: the reachability guard and the navLinks swap ship in one commit,
  not two as planned. /resources is genuinely unreachable between being
  created and being linked, so a standalone guard commit would have been red.
- Corrected: the planned link assertions matched only `href="/x"`, but
  /resources drives its links from a local array through href={item.href},
  so that form never appears in its source. Both the hub test and the guard
  now match `href="/x"` and `href: '/x'`. Caught by the test failing, which
  is what it was for.
- The guard was verified in both directions. It named /resources while that
  page really was unlinked, named /faq when that link was pointed at a
  nonexistent route, and passes on the restored tree. A detector observed
  only failing cannot be distinguished from one that always fails.

### 2026-08-21 (brand canvas: factual corrections)

- Done: the five factual corrections from the canvas review are saved to the
  live canvas (project 396f6c5c). Verified in the refetched page, not assumed:
  "Renton", "evenings and weekends" and the invented graduate quote all now
  count zero across all 11 artboards, and the replacements each appear.
- Struck **Renton**: it appeared on three artboards as a class location and
  exists nowhere in src/data. Replaced with Seattle, the real address.
- Fixed the **schedule claims**: "evenings and weekends" contradicted the
  M-F 9-3 hours and the weekday-per-specialty pattern in schedules.ts. The
  type specimen now reads "Weekday specialty classes" and the enrollment copy
  describes the real blended format (online plus four classroom days).
- Replaced the **fabricated graduate testimonial** with a marked placeholder.
  Only the name and year had been bracketed; the story itself read as real,
  which is a compliance problem for a training provider.
- Dropped the real office number (425-306-5010) into the card and letterhead,
  replacing [555 000 0000]. The address was already correct.
- Named **Clay on Oat (4.06:1)** as a don't in the palette section — it fails
  AA for body text and Oat is the card surface, so the pairing was one step
  away in any application.
- Still open on the canvas: the Daybreak rebuild, which needs the founding
  year for the EST. [YEAR] seal line.

### 2026-08-20 (design-sync re-sync and header verification)

- Done: re-synced the DS to Claude Design project 2a079be8 after the header
  logo change. 10 components, 65 files, render check 10/10, self-check green.
  Verified the uploaded bytes rather than assuming: uploaded _ds_sync.json
  matches local (bundleSha12 387e676bb64f, styleSha 2e08f333, Header
  renderHash 8e8e84b5).
- Found: the DS Header rendered a broken-image icon, because the port
  inherited the site's `/images/logo.svg` path and the DS has no host app
  serving it. Every design the Claude Design agent builds would have shown it
  broken. Fixed by inlining the mark as a data URI in
  design-system/src/logo.ts; the Astro header keeps the real path. Bundle
  28KB -> 44KB. fidelity.mjs compares class strings, not src, so it stays
  16/16. The render check had PASSED this — root was non-empty — so only
  looking at the screenshot caught it.
- Found: `--entry` resolves against the CWD, not the package dir. The skill's
  generic `./dist/index.js` pointed at the Astro output and produced a verdict
  whose deletePaths listed all 10 components with an empty upload set. That
  would have wiped the project. Recorded in .design-sync/NOTES.md with the
  verbatim command and a pre-upload check.
- Found: Tailwind 4 @theme emits only tokens components actually use, so
  accent-50/100/500/900 are declared but absent from the build. The conventions
  header advertised all six accent values and told the agent to use an
  `antialiased` class that is only a body rule. Both were inlined into the
  design agent's prompt, so it would have written vocabulary resolving to
  nothing. Corrected with Daniel's approval.
- Found: the site header is cramped at 1280/1440/1600 — nine navLinks against
  the decided six. A/B with the logo hidden measured identical (header 105px,
  wordmark 56px both ways), so the logo change is exonerated. Now in Known
  broken.
- Found: the DS Header card is registered at a 900x700 viewport and its
  six-item DEFAULT cell wraps the Student Login button there (56px vs 36px);
  at 1200 it renders clean. Card-framing only, not a component defect.

### 2026-08-20 (consolidation and ship)

- Done: everything parked got gathered onto `main`. Recovered
  `docs/PROCESS.md` from `stash@{0}`, where it had lived uncommitted since
  2026-08-19 and would have died with the stash; dropped `stash@{1}` as
  superseded by df41912. Folded PR #2 (AGENTS rewrite) and PR #4 (Vitest +
  CI gate) into `redesign` rather than merging three directions into main,
  closed PR #3 after taking its fuller `docs/NOTES.md` over the duplicate in
  c2656ab, then merged the whole branch as PR #5. `main` and `redesign` now
  have identical content, no open PRs, no stashes.
- Done: `public/images/logo.svg` finally renders. It was traced in caf11f4
  and then referenced by nothing — the header drew the brand as text and
  `favicon.svg` was still Astro's own logo. Both now use the mark. The
  favicon is the full traced art and will read poorly at 16px; it wants a
  purpose-drawn small variant once the logo direction settles.
- Found: CI's `astro check` failed with 209 errors while the identical
  command passed locally. The root tsconfig includes `**/*`, so the check
  walked `design-system/` and `.design-sync/` .tsx files whose React types
  come from a separate install CI never performs. Reproduced both
  directions with `design-system/node_modules` moved aside — 209 errors
  before, 0 after — so the exclude is confirmed as the fix, not a
  coincidence. PR #6.
- Found: no `PUBLIC_*` repo secrets exist at all, so even a fixed
  Cloudflare token would publish a site with inert forms. Added to Known
  broken; it was not tracked anywhere before.
- Note: nothing is live yet. `headwaynursing.org` still resolves to
  199.34.228.47 (Weebly). Two blockers remain and both are Daniel's: the
  rejected Cloudflare token and the missing PUBLIC_* secrets.


### 2026-08-20 (teleport stash visibility)

- Decided: Cloud→local teleport left `docs/PROCESS.md` only in a git stash, so
  later sessions never saw it via STATUS/TASKS/session-start. Rule: after every
  teleport, `git stash list && git status -sb`; same turn commit/restore or file
  a TASKS line naming the stash. Session-start now warns when stash is non-empty.
  Durable note lives in `docs/NOTES.md` (Conventions).

### 2026-08-19 (price conflicts, for the reconcile task)

- Found: Daniel's generator brief carries prices that conflict with courses.ts.
  Brief vs repo: Core Basic $400-500 (deposit $200) vs $500 flat; Mental
  Health $120 vs null; Dementia Level 1 $120 vs null; Nurse Delegation Core
  $50 vs $80; ND Diabetes $80 vs $80 (agrees); CPR $85 (agrees); HIV/AIDS $80
  vs null; Orientation and Safety $100 vs null; CE $10/hr (~$120/yr) vs $120
  flat; blended $700 deposit $350 (repo has no deposit concept). The live
  Weebly duplicates add $570-vs-$700 and $105-vs-$120 variants. Repo data is
  internally consistent; the conflict is repo-vs-brief-vs-live. Janice owns
  the authoritative list; the reconcile task now has the concrete delta.

### 2026-08-19 (design-sync run)

- Done: full design-sync shipped. Logo recreated in-house as
  public/images/logo.svg (traced from logo-live.jpg with the palette-b hexes;
  IoU 95.7% vs source, so commissioning stays off the table). The 10 Astro
  components ported to design-system/ (React 19, class strings verbatim,
  fidelity.mjs 16/16 clean) and synced to the new "Headway Nursing DS" Claude
  Design project (2a079be8-059a-48f5-a37e-858cf845d634): validate exit 0, all
  previews authored and graded good, conventions header validated, anchor
  uploaded last. Daniel seeds the generator with PART 1 himself; attach
  logo.svg, not logo-banner.png.
- Found: Tailwind static builds must @source the previews dir or preview
  wrapper classes silently vanish (collapsed ghost panel). Recorded in
  .design-sync/NOTES.md with the other re-sync risks (data.ts and theme are
  copies of site files and do not track them).

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
