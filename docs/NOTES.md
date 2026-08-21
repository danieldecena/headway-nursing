# NOTES — repo memory

Durable facts, gotchas, and conventions for anyone (human or agent) working in
this repo. `STATUS.md` holds current state and the decision log; `TASKS.md`
holds the work queue. This file holds what stays true between sessions —
append to the relevant section when you learn something durable, and prune
entries that stop being true.

## Identity and naming

- The site: static Astro 7 + Tailwind 4 rebuild of the live Weebly site at
  [headwaynursing.org](https://www.headwaynursing.org) — Headway Nursing
  Services, DSHS-approved HCA/caregiver training in Seattle.
- Naming mismatch to expect: Daniel's local folder is `headwaynurse-website`,
  but the npm package, Wrangler project, and GitHub repo are all
  `headway-nursing` (`danieldecena/headway-nursing`).
- People: Daniel owns the rebuild; Janice (Daniel's aunt) runs the business and
  is the eventual content editor. `docs/HANDOFF.md` is her operator guide, and
  the definition of done for the project is Janice editing one price herself
  end to end.

## Where things live

- Page content is data-driven: TypeScript modules under `src/data/` (courses,
  site, FAQs, payments, schedules). Edit content there, not in page markup.
- Section component library in `src/components/`: PageShell, PageHeader,
  SectionHeading, Card, Button — used across every page. Two spots are
  deliberately hand-written and should stay that way: the course detail `<dl>`
  (interleaves `sm:grid-cols-2` after `p-6`) and the home hero's teal CTA.
- Payment and form wiring is env-gated (`PUBLIC_FORMSPREE_ID`,
  `PUBLIC_STRIPE_*`, `PUBLIC_CLASSMANAGER_EMBED_URL`) via
  `src/components/RegisterSection.astro` and `src/data/payments.ts`; unset vars
  degrade to contact messaging rather than broken forms.
- Deploys: Cloudflare Pages via GitHub Actions on push to `main`
  (`.github/workflows/deploy.yml`).
- Weebly audit evidence (screenshots, real logo files) lives in
  `docs/superpowers/plans/assets/weebly/`.

## Gotchas

- Tailwind 4's scanner reads bare words anywhere in a source file — comments
  and object keys included. A variant key named after a real utility (e.g.
  `outline`) emits a phantom rule into the bundle; that variant was renamed
  `ghost`. Never name a variant key after a real utility.
- `public/images/testimonials/t3.png` is a byte-copy of `logo-banner.png`, not
  a testimonial photo. Never present it as a testimonial; replacement waits on
  Janice.
- The public email is unresolved: `src/data/site.ts` says
  `headwaynursing@comcast.net`, live Weebly says
  `headwaynursingservicesofficial@gmail.com`, and its after-hours text says
  `headwaynursing@gmail.com`. Do not "fix" any of them until Daniel/Janice pick
  the canonical address.
- Verified prices from live announcements: $700 blended (75-hour), $650
  classroom (unavailable), $500 core basic — `src/data/courses.ts` matches.

## Conventions and methods

- Start the dev server in background mode: `astro dev --background`; manage it
  with `astro dev stop` / `status` / `logs`.
- Visual design comes before architecture here: skip `/project-skeleton` until
  the wireframe and redesign reviews land.
- Figma is off the critical path (both seats are View-only); design review
  happens on the Claude Design canvas linked in `STATUS.md`.
- Build-parity method (worth reusing for refactors that must not change
  output): stash the edits, build, keep `dist/` as a baseline, restore, then
  `diff -r` the rebuilt `dist/` against it. It caught a missing import a
  passing grep would not have.
- If a Claude Code CLI session dies mid-task, resume that same session from
  Cursor rather than starting a new exploratory run.
- After every Cloud→local `--teleport` (or any handoff that may stash): run
  `git stash list && git status -sb` before starting work. Anything still only
  in a stash is invisible to STATUS/TASKS and to a normal dirty-tree check.
  Same turn: commit it, restore it into the tree, or add a TASKS line naming
  `stash@{n}`. Session-start (`~/bin/session-start.sh`) warns when the stash
  list is non-empty — treat that chip like Known broken until the stash is
  empty or explicitly accounted for.
