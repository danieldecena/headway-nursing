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
- **`--entry` is resolved with `resolve()` against the CWD, not the package
  dir** (`lib/bundle.mjs` `resolveDistEntry`). From the repo root it must be
  `design-system/dist/index.js`. Passing the skill's generic example
  `./dist/index.js` points at the *Astro* output, and the run degrades quietly:
  `[NO_DIST]` → synth-entry from 0 files → `[ZERO_MATCH]` → a verdict whose
  `deletePaths` lists all 10 components and whose `upload.components` is empty.
  Uploading that would have wiped the project. Always check
  `upload.components` is non-empty before `finalize_plan`.
- The DS `Header` inlines the logo as a base64 data URI
  (`design-system/src/logo.ts`), while the Astro `Header.astro` uses
  `/images/logo.svg`. Deliberate: the DS has no host app serving `/images/`, so
  a bare path renders a broken-image icon in the preview card and in every
  design the agent builds. Costs ~16KB in the bundle (28KB → 44KB).
  `fidelity.mjs` compares class strings, not `src`, so the divergence is safe
  there — but re-generate `logo.ts` if `public/images/logo.svg` is ever redrawn.
- **Tailwind 4 `@theme` emits only the tokens components actually use.**
  `accent-50/100/500/900` are defined in `design-system/src/styles.css` but
  absent from `_ds_bundle.css`; only `accent-600`/`700` ship. All eight
  `brand-*` values do ship. Validate the conventions header against
  `_ds_bundle.css`, never against the source `@theme`.
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
