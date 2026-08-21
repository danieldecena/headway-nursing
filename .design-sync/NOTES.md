# design-sync notes — headway-nursing-ds

- The DS package lives in `design-system/` inside the site repo (not a monorepo
  package). Build: `npm run build --prefix design-system` (esbuild + tsc +
  `@tailwindcss/cli`). Converter entry: `design-system/dist/index.js`,
  node-modules: `design-system/node_modules`.
- Tailwind is a static build: `design-system/src/styles.css` must `@source`
  BOTH `../src/**/*.tsx` and `../../.design-sync/previews/**/*.tsx`. Dropping
  the previews line silently unstyles preview wrapper classes (p-8, mt-12) —
  that bug shipped once and showed as a collapsed ghost-button panel.
- Fonts: Google Fonts families vendored to `design-system/fonts/` (latin
  subsets, OFL). The four PublicSans woff2s are byte-identical (Google serves
  one variable file per weight) — expected, not an error.
- Playwright: install `playwright@1.60.0` into `.ds-sync/` — it pins chromium
  build 1223, which is in `~/Library/Caches/ms-playwright`. Newer playwright
  needs a browser download.
- `package-capture.mjs` must run from the repo root (paths in config are
  config-home-relative); running it from `.design-sync/.cache/review/` dies on
  module resolution.
- Class-string fidelity vs the Astro originals is checked by
  `design-system/fidelity.mjs` (16 checks incl. env-gated branches vs .astro
  source). Run after `astro build` + DS build.
- Header's DEFAULT nav is the decided 6-item set + Student Login; the live
  site still ships 9 items in `src/data/site.ts` — intentional divergence
  until the redesign slices land.
- Known render warns: none.

## Re-sync risks

- `design-system/src/data.ts` duplicates shapes/values from `src/data/*.ts`
  (site contact info, sample course, nav). Site data edits do NOT propagate —
  re-check when courses/site.ts change (the canonical-email decision will
  change `site.email` here too).
- The Tailwind theme block in `design-system/src/styles.css` is a copy of
  `src/styles/global.css` @theme. A palette edit on the site side must be
  re-copied.
- The brand ramp is intentionally non-monotonic (brand-500 lighter than 600);
  the DS ships it verbatim. Ramp normalization belongs to the generator brief,
  not this package.
- `fidelity.mjs` reference pages (thank-you, 75-hour-ltc-classroom, privacy)
  will drift as pages are redesigned; a FAIL there may mean the reference
  moved, not the port broke.
