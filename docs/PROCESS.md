# PROCESS — headwaynurse-website

End-to-end process from today's state to launch and operator handoff.
Written 2026-08-19 from a full folder review.

> Recovered 2026-08-20 from a teleport stash, where it had been sitting
> uncommitted. The phase structure below still holds, but parts of "Where the
> repo actually stands" have moved on: both Cloudflare secrets now exist (the
> token is set but still rejected with code 9106), and the wireframe review is
> done. `STATUS.md` is authoritative for current state; read this for ordering.

**Definition of done:** Janice edits one course price herself, end to end,
and the change appears on the live site.

**How this doc relates to the others**

| Doc | Answers |
|-----|---------|
| `PROCESS.md` (this) | What order do things happen in, and what gates each step |
| `STATUS.md` | What is true right now + decision log |
| `TASKS.md` | The flat checklist |
| `QA.md` | The pre-cutover verification checklist |
| `DEPLOY.md` / `PAYMENTS.md` / `SEO.md` | Mechanics for one subsystem |
| `HANDOFF.md` | Operator guide for Janice (to be rewritten in Phase 4) |

---

## Where the repo actually stands

**Built and working**

- Astro 7 + Tailwind 4 static site, 27 built pages, sitemap generated (last verified 2026-08-17).
- 17 page files under `src/pages/` — 16 static plus `courses/[slug].astro`, which fans out to the 11 courses in `courses.ts` (16 + 11 = the 27 built pages).
- Section component library in use everywhere: `PageShell`, `PageHeader`, `SectionHeading`, `Card`, `Button`, plus `Header`, `Footer`, `CourseCard`, `RegisterSection`, `CookieBanner`.
- Content lives in `src/data/` — `site.ts`, `courses.ts`, `schedules.ts`, `faqs.ts`, `payments.ts`, `testimonials.ts`.
- Brand palette is **already the measured Option B green/blue** in `src/styles/global.css`, sourced from `docs/superpowers/plans/assets/palette-b.json`. The wireframes plan still describes Option A as the blue ramp in `global.css` — that text is stale.
- Compliance pass live: consent-gated GA, `_headers`, noindex thank-you, JSON-LD, env-gated payment/Formspree messaging.
- Wireframe canvas seeded — Desktop 1440 (9 boards), Mobile 390 (4), Palette A vs B.

**Blocked / broken**

1. **Deploy has never published.** Zero GitHub Actions secrets, so `CLOUDFLARE_API_TOKEN` is missing and the wrangler step fails on every push to `main`. Local wrangler is also unauthenticated.
2. **No canonical email.** `site.ts` says `headwaynursing@comcast.net`; live Weebly says `headwaynursingservicesofficial@gmail.com`; after-hours text says `headwaynursing@gmail.com`.
3. **No Formspree ID** — forms are inert. Note the env vars are consumed at *build* time inside GitHub Actions (`.github/workflows/deploy.yml` lines 32–41), so they must be **GitHub repo secrets**, not Cloudflare Pages environment variables. `QA.md` says "Cloudflare Pages env" and is wrong about this.
4. **`public/images/testimonials/t3.png` is a byte-copy of `logo-banner.png`**, not a testimonial. It is still listed in `src/data/testimonials.ts` line 4.
5. **Wireframe review not done** — three decisions outstanding.

---

## Phase 0 — Unblock (do first, nothing else moves without it)

Gate: a green Actions run that actually publishes.

- [ ] **0.1 Mint a Cloudflare API token** with Pages:Edit scope on the Headway account.
- [ ] **0.2 Set repo secrets** on `danieldecena/headway-nursing`: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Verify with `gh secret list` returning non-empty.
- [ ] **0.3 Authenticate local wrangler** so you can reproduce failures without pushing.
- [ ] **0.4 Decide how to get a safe first deploy.** The workflow only fires on push to `main` and publishes with `--branch=main`, i.e. straight to production — there is no preview path today. Either add a `workflow_dispatch` branch input / preview branch, or accept that the first green run goes live. Pick one before pushing.
- [ ] **0.5 Trigger a run** (the workflow already supports `workflow_dispatch`) and watch it go green through the *Publish* step. Record the deployed URL in `STATUS.md`. *This is the first real observation that the pipeline works — do not mark it done on a passing local build.*
- [ ] **0.6 Ask Janice for the canonical email.** One address, used in `site.ts`, `HANDOFF.md`, Formspree notifications, and Google Business Profile.
- [ ] **0.7 Update `src/data/site.ts`** with the chosen address; grep the repo for the two stale ones.
- [ ] **0.8 Create the Formspree form**, set `PUBLIC_FORMSPREE_ID` as a **GitHub repo secret** (the workflow already wires it into the build at line 33).
- [ ] **0.9 Fix or delete `t3.png`.** Either source a real third testimonial or remove line 4 of `src/data/testimonials.ts` — do not ship the logo as a person.

## Phase 1 — Early DNS cutover (approved: ship the current site before the redesign)

Gate: `QA.md` fully checked, then DNS moved.

- [ ] **1.1 Run `docs/QA.md` top to bottom** against the deployed URL. Every unchecked box is a launch blocker. Correct its "Cloudflare Pages env" line to "GitHub repo secret" while you are in there.
- [ ] **1.2 Verify Weebly redirects.** `public/_redirects` has 32 rules and already covers `/contact-us.html`, `/about-us.html`, the `*-registration-form.html` and `*-payment.html` wildcards, and every course page. **`/training.html` is missing** — the wireframes plan named it as a live nav URL. Crawl the live Weebly nav and add anything absent, then test each rule against the deploy.
- [ ] **1.3 Submit a real test registration** in incognito; confirm the email lands at the Phase 0.6 address.
- [ ] **1.4 Wire analytics** before cutover, not after. The plumbing exists — `PUBLIC_GA_ID` is read by `src/components/CookieBanner.astro` and already passed through the workflow; it just needs a real GA4 property and the secret set.
- [ ] **1.5 Point DNS** at Cloudflare Pages. Confirm HTTPS cert active, test the live domain on an actual phone.
- [ ] **1.6 Keep Weebly live 1–2 weeks** as fallback. Cancel only after redirects are confirmed in Search Console.
- [ ] **1.7 Post-cutover:** add the Search Console property, submit the sitemap, update Google Business Profile with the new URL.

## Phase 2 — Design approval

Gate: three decisions recorded in the `STATUS.md` decision log.

- [ ] **2.1 Review the canvas** — link in `STATUS.md`, Next Up section.
- [ ] **2.2 Land the three decisions:**
  - Palette A vs B — the Palette page builds the same home page twice so colour is the only variable. Note that B is already what `global.css` ships, so choosing A means a real change.
  - Nav consolidation — 9 items today (`navLinks` in `site.ts`) vs the proposed 6 (Courses, Schedule, About, Resources, Consulting, Contact + Student Login button).
  - Logo — use `logo-banner.png` as-is, recreate, or commission.
- [ ] **2.3 Record the two things wireframes cannot decide:** hero photo replacement (`hero-classroom.jpg`) and testimonial quote approval.
- [ ] **2.4 Write the decisions into `STATUS.md`** before any code is touched.

## Phase 3 — Redesign build

Gate: approved wireframes; shipped in slices, each slice deployable.

- [ ] **3.1 Hand the redesign brief prompt to Fable.**
- [ ] **3.2 Run `project-audit` over the Fable brief.**
- [ ] **3.3 Run `project-skeleton`** for redesign boundaries. *Per the repo's own preference, this stays after design approval — visual design before architecture.*
- [ ] **3.4 Ship redesign slices** in wireframe order: Home → Courses listing → Course detail → Contact. Then About/Schedule/mobile, which the lean pass excluded.
- [ ] **3.5 Apply the nav decision** to `navLinks` in `site.ts` and add `_redirects` entries for any route that disappears.
- [ ] **3.6 After each slice:** `npm run build`, then diff `dist/` against the pre-change baseline. This is the parity method that caught a missing import a grep would have passed.
- [ ] **3.7 Re-run the accessibility section of `QA.md`** — Lighthouse ≥ 90 on Home and Courses, contrast checked on the green buttons specifically.

## Phase 4 — Janice self-serve

Gate: Janice completes a price edit unaided.

- [ ] **4.1 Pick the content-editing approach** — direct `src/data/*.ts` edits with a guide, or a CMS layer.
- [ ] **4.2 Implement it.**
- [ ] **4.3 Rewrite `HANDOFF.md` as an operating guide**, not a reference table. The current version tells her to contact Daniel for every change, which is the opposite of the goal.
- [ ] **4.4 Add uptime and build-failure monitoring** — Phase 0 exists because a silent pipeline failure went unnoticed indefinitely.
- [ ] **4.5 Janice edits one price end to end.** Watch, don't help. Fix what she stumbles on.

---

## Standing rules for this repo

- **Every task ends with an observation** — a screenshot, a URL that loads, command output. Never "no error."
- **Real copy only.** All text comes from `src/data/`. No lorem ipsum, no invented prices.
- **Never name a Tailwind variant key after a real utility.** Tailwind 4's scanner reads bare words anywhere in a source file, including comments and object keys; a variant named `outline` emitted a phantom `.outline` rule. It was renamed to `ghost`.
- **Dev server runs in background mode:** `astro dev --background`, managed with `astro dev stop|status|logs`.
- **Naming mismatch is intentional:** local folder `headwaynurse-website`, npm/Wrangler/GitHub name `headway-nursing`. The README still says `cd ~/developer/headway-nursing`.
- **Figma is off the critical path** — both seats are View-only; Phase B of the wireframes plan is parked.

## Known stale text to fix when convenient

- `docs/superpowers/plans/2026-08-17-wireframes.md` Task 3 Step 2 describes `global.css` Option A as a blue ramp; the file now ships measured greens.
- `HANDOFF.md` lists `headwaynursing@comcast.net` — update alongside `site.ts` in Phase 0.6.
- `QA.md` says "aunt's current pricing"; elsewhere the docs say Janice.
- `QA.md` line 16 says `PUBLIC_FORMSPREE_ID` goes in "Cloudflare Pages env" — it is a build-time GitHub Actions secret.
- `README.md` still says `cd ~/developer/headway-nursing`; the folder is `headwaynurse-website`.

## Env vars, and where they actually live

All are build-time, consumed in GitHub Actions and baked into `dist`. Set them as **repo secrets**, not Pages variables.

| Var | Read by |
|-----|---------|
| `PUBLIC_FORMSPREE_ID` | `components/RegisterSection.astro:12` |
| `PUBLIC_GA_ID` | `components/CookieBanner.astro:2` |
| `PUBLIC_STRIPE_PAYMENT_URL` | `data/payments.ts:9`, `RegisterSection.astro:80` |
| `PUBLIC_CLASSMANAGER_EMBED_URL` | `data/payments.ts:7` |
| `PUBLIC_STRIPE_LINK_HCA_BLENDED` / `_CORE_BASIC` / `_CPR` / `_CE` | `data/payments.ts:15–18` |
