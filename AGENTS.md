## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Learned User Preferences

- Skip `/project-skeleton` until the wireframe and redesign review land; visual design comes before architecture in this repo.
- When a Claude Code CLI session dies mid-task, continue that same session from Cursor rather than starting a new exploratory run.

## Learned Workspace Facts

- Local folder is `headwaynurse-website`; npm package, Wrangler project, and GitHub repo are `headway-nursing` (`danieldecena/headway-nursing`). README still says `cd ~/developer/headway-nursing`.
- Static Astro 7 + Tailwind 4 rebuild of the live Weebly site at headwaynursing.org (Headway Nursing Services, DSHS-approved HCA/caregiver training in Seattle). Deploys to Cloudflare Pages via GitHub Actions on `main`.
- Page content lives in TypeScript modules under `src/data/` (courses, site, FAQs, payments, schedules).
- Launch is blocked on Formspree ID, Stripe/ClassManager, DNS cutover, and a canonical public email (Weebly Gmail vs `headwaynursing@comcast.net` in `src/data/site.ts`).
- Figma is not on the critical path (View-only seats); wireframe review happens on Claude Design or a Cursor canvas.
- `public/images/testimonials/t3.png` is a byte-copy of `logo-banner.png`, not a testimonial photo.
- `docs/HANDOFF.md` is the operator guide for Janice; later phases aim at her editing content herself.
