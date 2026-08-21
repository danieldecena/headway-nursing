# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. (`CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`, keep the symlink.)

## What this is

Static Astro 7 + Tailwind CSS 4 rebuild of the live Weebly site at headwaynursing.org (Headway Nursing Services — DSHS-approved HCA/caregiver training in Seattle). No linter, no framework components — plain `.astro` files rendered to static HTML. A Vitest suite covers the `src/data/` modules (`npm test`, 28 tests) and runs as a PR gate via `.github/workflows/ci.yml`. Deploys to Cloudflare Pages via GitHub Actions on push to `main`.

Naming gotcha: the local folder is `headwaynurse-website`, but the npm package, Wrangler project, and GitHub repo are all `headway-nursing` (`danieldecena/headway-nursing`).

## Commands

```bash
npm install
astro dev --background   # dev server at http://localhost:4321 — always use background mode
astro dev stop | status | logs
npm run build            # astro build → dist/
npm test                 # vitest run — 28 tests over src/data/
npm run preview
```

Node >= 22.12.0. Copy `.env.example` to `.env` for local env vars (all optional; the site builds without them).

## Architecture

The core split: **content lives in typed TypeScript modules under `src/data/`** (`site.ts`, `courses.ts`, `faqs.ts`, `schedules.ts`, `testimonials.ts`, `payments.ts`); **pages under `src/pages/` are presentation** that imports from those modules. To change prices, hours, contact info, nav links, or course copy, edit `src/data/` — not the pages. `src/pages/courses/[slug].astro` statically generates one page per entry in `courses.ts`.

- `src/layouts/BaseLayout.astro` — the single layout: meta/OG tags, `noindex` prop, Header/Footer/CookieBanner, Google Fonts (Public Sans + Source Serif 4).
- `src/components/` — a slot-based section library used across every page: `PageShell`, `PageHeader`, `SectionHeading`, `Card`, `Button`. Prefer these over repeating utility strings. Two spots are deliberately hand-written and should stay that way: the course-detail `<dl>` and the home hero's teal CTA.
- `src/styles/global.css` — Tailwind 4 CSS-first config (`@theme` block, no tailwind.config file). Brand green / accent blue ramps are measured from the real logo (provenance: `docs/superpowers/plans/assets/palette-b.json`); don't eyeball-adjust them.
- **Env-gated integrations**: `src/data/payments.ts` reads `PUBLIC_*` vars (`import.meta.env`) for Stripe Payment Links / ClassManager embed; Formspree and GA are likewise env-gated. Missing vars must degrade gracefully (fallback messaging, no broken UI) — the accounts don't exist yet. In CI these come from GitHub Actions secrets (`.github/workflows/deploy.yml`).
- `public/_redirects` maps legacy Weebly URLs; `public/_headers` sets security headers; the sitemap filters out `/thank-you` (also `noindex`).

## Conventions and gotchas

- **Tailwind 4's scanner reads bare words anywhere in a source file** — comments, object keys, anything. Never name a variant key or identifier after a real utility (e.g. a button variant named `outline` emitted a phantom `.outline` rule; it's `ghost` now).
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
