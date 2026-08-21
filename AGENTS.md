# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. (`CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`, keep the symlink.)

## What this is

Static Astro 7 + Tailwind CSS 4 rebuild of the live Weebly site at headwaynursing.org (Headway Nursing Services — DSHS-approved HCA/caregiver training in Seattle). No linter, no framework components in the site itself — plain `.astro` files rendered to static HTML. A Vitest suite covers the `src/data/` modules and runs as a PR gate alongside `astro check` and the build (`.github/workflows/ci.yml`).

**The deploy has never published.** `.github/workflows/deploy.yml` fires on push to `main`, but the publish step fails with Cloudflare `[code: 9106]` and `headwaynursing.org` still serves Weebly. Do not describe this site as deployed, and do not treat a green build as a green deploy — see `STATUS.md` → `## Known broken`.

Naming gotcha: the local folder is `headwaynurse-website`, but the npm package, Wrangler project, and GitHub repo are all `headway-nursing` (`danieldecena/headway-nursing`).

## Commands

```bash
npm install
astro dev --background   # dev server at http://localhost:4321 — always use background mode
astro dev stop | status | logs
npm run build            # astro build → dist/
npm run check            # astro check — CI runs this; a clean build does NOT imply it passes
npm test                 # vitest run — the src/data/ suite
npm run test:watch       # vitest, watching
npm run preview
```

Run one test file, or one test by name:

```bash
npx vitest run tests/site.test.ts
npx vitest run tests/site.test.ts -t "points every nav link at an existing page"
```

Node >= 22.12.0. Copy `.env.example` to `.env` for local env vars (all optional; the site builds without them).

## Architecture

**There is no backend.** No `output: 'server'`, no adapter, no API routes, and no server or database dependency — `package.json` carries seven deps, all build and test tooling. Everything under `src/data/` is compiled into static HTML at build time, so "the data layer" is a set of TypeScript constants, not a service. Four third-party services do the jobs a backend would, all reached from the browser and all env-gated: **Formspree** (form submissions), **Stripe Payment Links** and **ClassManager.pro** (payment and registration — `src/data/payments.ts` picks between them via `PUBLIC_PAYMENT_PROVIDER`), and **Relias Learning** (the student LMS behind Student Login). None are configured yet.

The core split: **content lives in typed TypeScript modules under `src/data/`** (`site.ts`, `courses.ts`, `faqs.ts`, `schedules.ts`, `testimonials.ts`, `payments.ts`); **pages under `src/pages/` are presentation** that imports from those modules. To change prices, hours, contact info, nav links, or course copy, edit `src/data/` — not the pages. `src/pages/courses/[slug].astro` statically generates one page per entry in `courses.ts`.

- `src/layouts/BaseLayout.astro` — the single layout: meta/OG tags, `noindex` prop, Header/Footer/CookieBanner, Google Fonts (Public Sans + Source Serif 4).
- `src/components/` — a slot-based section library used across every page: `PageShell`, `PageHeader`, `SectionHeading`, `Card`, `Button`. Prefer these over repeating utility strings. Two spots are deliberately hand-written and should stay that way: the course-detail `<dl>` and the home hero's teal CTA.
- `src/styles/global.css` — Tailwind 4 CSS-first config (`@theme` block, no tailwind.config file). Brand green / accent blue ramps are measured from the real logo (provenance: `docs/superpowers/plans/assets/palette-b.json`); don't eyeball-adjust them.
- **Before writing UI or landing a design, read `docs/DESIGN-SYSTEM.md`** — tokens, the component library, styling idiom, assets, and the three traps that silently produce wrong output (static token emission, the duplicated theme in `design-system/`, and the bare-word class scanner).
- **Env-gated integrations**: `src/data/payments.ts` reads `PUBLIC_*` vars (`import.meta.env`) for Stripe Payment Links / ClassManager embed; Formspree and GA are likewise env-gated. Missing vars must degrade gracefully (fallback messaging, no broken UI) — the accounts don't exist yet. In CI these come from GitHub Actions secrets (`.github/workflows/deploy.yml`).
- `public/_redirects` maps legacy Weebly URLs; `public/_headers` sets security headers; the sitemap filters out `/thank-you` (also `noindex`).
- **`design-system/` is a second copy of the same ten components**, ported to React 19 to feed the Claude Design agent. It never ships to the site. It duplicates rather than shares: `design-system/src/styles.css` is the `@theme` block copied verbatim, and `design-system/src/data.ts` copies values from `src/data/`. **A palette or content edit on the site side does not propagate** — mirror it, then run `node design-system/fidelity.mjs` (class-string equality against the `.astro` originals). Sync procedure and its traps: `.design-sync/NOTES.md`.

## Conventions and gotchas

- **Tailwind 4's scanner reads bare words anywhere in a source file** — comments, object keys, anything. Never name a variant key or identifier after a real utility (e.g. a button variant named `outline` emitted a phantom `.outline` rule; it's `ghost` now).
- **The root `tsconfig.json` excludes `design-system` and `.design-sync` on purpose.** Their React types come from `design-system/node_modules`, a separate install CI's single root `npm ci` never performs. Remove that exclude and `npm run check` fails in CI with 209 errors while still passing on a machine where the DS deps are installed.
- GA is consent-gated behind `CookieBanner`; keep any analytics behind consent.
- Parity-check trick for refactors that must not change output: build, keep `dist/` as a baseline, rebuild, then `diff -r` the two.
- SEO details (JSON-LD, canonical, robots) documented in `docs/SEO.md`.

## Project state (see STATUS.md and TASKS.md for the living version)

- **STATUS.md** — confirmed-working / known-broken / decision log. **TASKS.md** — phase checklist. Update these when you change project state.
- Launch is blocked on external inputs: Formspree ID, Stripe/ClassManager setup, DNS cutover, and a canonical public email — the live Weebly site uses a Gmail address while `src/data/site.ts` still has `headwaynursing@comcast.net`. Don't "fix" the email without the decision from Daniel/Janice.
- `public/images/testimonials/t3.png` is a byte-copy of `logo-banner.png`, not a real testimonial photo.
- `docs/HANDOFF.md` is the operator guide for Janice (the site owner); later phases aim at her editing content herself. Other docs: `docs/DEPLOY.md` (Cloudflare Pages + DNS), `docs/PAYMENTS.md` (Stripe/ClassManager), `docs/QA.md` (pre-launch checklist).

## Astro documentation

Full docs: https://docs.astro.build — consult the guides on [routing](https://docs.astro.build/en/guides/routing/), [components](https://docs.astro.build/en/basics/astro-components/), [content collections](https://docs.astro.build/en/guides/content-collections/), and [Tailwind styling](https://docs.astro.build/en/guides/styling/) before working on related tasks.

## Learned User Preferences

- Skip `/project-skeleton` until the wireframe and redesign review land; visual design comes before architecture in this repo.
- When a Claude Code CLI session dies mid-task, continue that same session from Cursor rather than starting a new exploratory run.
- Figma is not on the critical path (View-only seats); wireframe review happens on Claude Design or a Cursor canvas.
