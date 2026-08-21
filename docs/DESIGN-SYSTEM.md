# DESIGN-SYSTEM — structure reference for design-to-code work

How this codebase organizes tokens, components, styling, and assets. Written for
an agent translating a design (Figma, Claude Design, or a static comp) into code
here without having to re-derive the conventions.

**Read this before writing UI.** Three things in this repo will silently produce
wrong output if you assume the usual defaults: the Tailwind theme is a *static*
build, a second copy of the theme exists in `design-system/`, and the class
scanner reads bare words anywhere in a file. All three are covered below.

## Status caveats (true as of 2026-08-20)

- **Figma is deliberately off this project's critical path.** Both seats are
  View-only; design review happens on Claude Design instead (decision logged in
  `STATUS.md`, 2026-08-19). Figma MCP tools can still *read* a file you're handed,
  but do not build a workflow that assumes write access or a Figma-hosted
  library.
- **The brand direction is not settled.** The code ships the green/blue mark
  traced from the live site (`public/images/logo.svg`). A separate brand canvas
  proposes a different direction ("Daybreak", a sunrise seal) with a different
  palette entirely (pine/clay). Do not "reconcile" the code to that canvas
  unattended — it is a live decision.
- **There is no icon system.** See §5; do not invent one to satisfy a design.

## 1. Token definitions

**One source of truth: `src/styles/global.css`.** Tailwind 4 CSS-first config —
there is no `tailwind.config.*` and no `postcss.config.*`. Tokens live in an
`@theme` block and become utilities automatically (`--color-brand-700` →
`bg-brand-700`, `text-brand-700`, `border-brand-700`).

```css
/* src/styles/global.css */
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@theme {
  --color-brand-50:  #eff6f1;   --color-brand-500: #86b54b;
  --color-brand-100: #d6e9dc;   --color-brand-600: #519d68;
  --color-brand-200: #adcd9d;   --color-brand-700: #3f7c52;
  --color-brand-800: #2e5c3d;   --color-brand-900: #1c3a27;

  --color-accent-500: #3e6ca0;  --color-accent-600: #33587f;
  --color-accent-700: #294764;  --color-accent-900: #16293c;

  --color-ground: #faf8f5;      /* warm page background */
  --color-ink:    #1a1a1a;      /* declared but UNUSED — do not reference */

  --font-sans:  'Public Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-serif: 'Source Serif 4', Georgia, 'Times New Roman', serif;
}
```

Three rules that are not guessable:

- **The brand ramp is intentionally non-monotonic.** `brand-500` (#86b54b) is
  *lighter* than `brand-600` (#519d68) — both are sampled from the real logo, not
  generated. Never assume `500 < 600 < 700` in luminance, and never "fix" it.
- **Fills and links use `brand-700` or darker.** `brand-600` was measured at
  3.30:1 against white and fails AA; `brand-700` passes at 4.98:1.
- **`accent-*` is reserved** for the Student Login button and form submits. It is
  not a general secondary color.

Provenance for every measured value: `docs/superpowers/plans/assets/palette-b.json`
(records which hexes were sampled from the logo versus derived, plus three
rejected candidates). If a design asks for a green that isn't in the ramp, that
file is the argument for pushing back.

**No token transformation system** — no Style Dictionary, no `tokens.json`, no
build step between the CSS and the utilities. A token change is a one-line edit
in `global.css`, *plus* the mirror described in §2.

### The static-build trap

Tailwind 4 emits only the tokens and utilities it finds in scanned source. Four
declared tokens (`accent-50`, `accent-100`, `accent-500`, `accent-900`) are in
`@theme` but absent from the compiled CSS because nothing uses them. Writing
`bg-accent-500` today produces an unstyled element, not a blue one.

Always validate a class against the compiled output, never against `@theme`:

```sh
npm run build && grep -o 'accent-500' dist/_astro/*.css
```

## 2. Component library

`src/components/` — 10 Astro components, slot-based, no framework runtime:

| Component | Role |
|---|---|
| `PageShell.astro` | Content-width wrapper (`md`/`lg`/`xl`, optional `prose`) |
| `PageHeader.astro` | Page `<h1>` |
| `SectionHeading.astro` | Section `<h2>` |
| `Card.astro` | Surface box (`tone` white/muted, polymorphic `as`) |
| `Button.astro` | Link CTA, 3 variants |
| `Header.astro` / `Footer.astro` | Site chrome |
| `CourseCard.astro` | Course tile with built-in CTA logic |
| `RegisterSection.astro` | Payment + Formspree registration block |
| `CookieBanner.astro` | Consent gate for GA |

**Architecture: composition via slots, no props-driven styling.** Variants are
full literal class strings in a lookup object, deliberately not composed from
fragments:

```astro
---
// src/components/Button.astro
const variants = {
  primary: 'rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800',
  secondary: 'rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50',
  ghost: 'rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10',
};
---
<a href={href} class={variants[variant]}><slot /></a>
```

**The scanner trap.** Tailwind 4 reads bare words *anywhere* in a source file —
comments, object keys, string literals. A variant key named `outline` once emitted
a phantom `.outline` rule into the bundle; it is `ghost` now. Never name a
variant key, prop value, or identifier after a real utility.

**Two spots stay hand-written** and should not be folded into components: the
course-detail `<dl>` (it interleaves `sm:grid-cols-2` after `p-6`) and the home
hero's teal CTA (not one of the three Button variants).

### The duplicate theme in `design-system/`

`design-system/` is a React 19 port of the same 10 components, used to feed the
Claude Design agent. **It duplicates rather than shares:**

- `design-system/src/styles.css` is byte-identical to `src/styles/global.css`
  except for two added `@source` lines.
- `design-system/src/data.ts` duplicates values from `src/data/*.ts`.

**A palette or content edit on the site side does not propagate.** Mirror it, then
verify with `node design-system/fidelity.mjs` (16 class-string equality checks
between the `.tsx` port and the `.astro` originals). Full re-sync procedure and
its traps: `.design-sync/NOTES.md`.

One deliberate divergence: the DS `Header` inlines the logo as a base64 data URI
(`design-system/src/logo.ts`) because the design system has no host app serving
`/images/`. The Astro `Header` uses the real path. Keep it that way.

**Documentation/storybook:** no Storybook. The equivalent is
`.design-sync/previews/<Name>.tsx` (10 authored preview compositions) rendered
into cards for the Claude Design project.

## 3. Frameworks and libraries

- **Astro 7.2** — static output, zero client JS by default. No React/Vue/Svelte
  in the site itself; the only React is the `design-system/` port, which never
  ships to the site.
- **Tailwind CSS 4.3** via `@tailwindcss/vite`, plus `@tailwindcss/typography`.
- **Build**: `astro build` → `dist/`, Vite under the hood.
- **Tests**: Vitest, 28 tests over `src/data/`, gated in CI
  (`.github/workflows/ci.yml`). `npm test`.
- **Typecheck**: `astro check` (`npm run check`). The root `tsconfig.json`
  excludes `design-system/` and `.design-sync/` — their React types come from a
  separate install CI never performs.

```js
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap({ filter: (p) => !p.includes('/thank-you') })],
});
```

## 4. Asset management

**Everything is a raw file in `public/`, served at its literal path.** Six images
total:

```
public/images/logo.svg              in-house trace of the live mark
public/images/logo-banner.png       1100x619, used ONLY as the OG image
public/images/testimonials/t1..t3.png
public/favicon.svg                  the logo mark
public/_headers                     security headers (Cloudflare Pages)
public/_redirects                   legacy Weebly URL map
```

- **No `astro:assets`.** There is no `src/assets/`, no `<Image>`/`<Picture>`, and
  therefore no responsive `srcset`, no format conversion, and no hashing. Plain
  `<img src="/images/…">` with explicit `width`/`height`.
- **No CDN config beyond Cloudflare Pages**, which fronts the whole origin. No
  image CDN, no transformation service.
- If a design needs an optimized hero image, adopting `astro:assets` is the
  correct move — but it is a real change, not an assumed default.

**Known defect:** `public/images/testimonials/t3.png` is a byte-copy of
`logo-banner.png`, not a testimonial photo. It is still referenced from
`src/data/testimonials.ts:4`. Don't render it as a person.

## 5. Icon system

**There isn't one, and that is the accurate answer.** No icon library in
`package.json`, no `<svg>` in any component, layout, or page, no icon sprite, no
naming convention. The only vector assets are the logo and the favicon.

Checkmarks and arrows in the UI are literal text characters (`✓`, `→`) inside
spans, not icons.

If a design requires icons, treat it as a decision to surface, not a gap to fill
silently. The options, in order of fit for a zero-JS Astro site: inline `<svg>`
in the component (no dependency, no runtime), then `astro-icon` (build-time
inlining, adds a dependency). Do not add a React icon package — it would pull a
runtime into a site that currently ships none.

## 6. Styling approach

**Tailwind utilities in markup. No CSS Modules, no CSS-in-JS, no BEM.** There is
exactly one stylesheet in `src/` and it is imported once:

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
---
```

**Global styles** are the tail of `global.css` — the entire non-utility surface:

```css
html { scroll-behavior: smooth; }
body { @apply bg-ground text-slate-700 antialiased; }
h1, h2, h3, h4 { font-family: var(--font-serif); }
```

That heading rule is the *only* thing applying the serif — there is no
`font-serif` utility anywhere in the codebase. A heading gets Source Serif 4 by
being an `h1`–`h4`, not by a class. `antialiased` likewise is not available as a
class; it lives in that `body` rule.

**Fonts** load from the Google Fonts CDN in `BaseLayout.astro:29-34` (preconnect
+ one stylesheet link, `display=swap`). Public Sans 400/500/600/700 and Source
Serif 4 600/700. Note the `design-system/` port *self-hosts* the same families
from `design-system/fonts/` — a font change has two landing sites.

**Color reality check:** most visible color is stock Tailwind, not brand tokens.
Approximate usage across `src/`: `text-slate-600` ×34, `border-slate-200` ×13,
`bg-white` ×12 versus `text-brand-700` ×28, `text-brand-900` ×17. There is also
an ungoverned `amber-*` family carrying "unavailable" and dev-warning states with
no semantic token behind it. **Changing `@theme` alone moves less of the page than
you would expect.**

### Responsive

Mobile-first, **stock Tailwind breakpoints** — no custom screens in `@theme`.
Usage is deliberately sparse (18 responsive utilities in the whole site), almost
all of it grid columns:

```astro
<div class="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
```

`sm:grid-cols-2` is the dominant pattern (×5). The mobile nav is a CSS-only
`<details>` disclosure toggled with `md:hidden` — no JavaScript. Match that
approach rather than introducing a JS menu.

## 7. Project structure

```
src/
  pages/       17 files → 27 built routes (16 static + courses/[slug] × 11)
  components/  10 slot-based .astro components
  layouts/     BaseLayout.astro — the single layout
  data/        ALL content, as typed TS modules
  styles/      global.css — the only stylesheet
public/        raw assets, _headers, _redirects
design-system/ React port for Claude Design (never ships to the site)
.design-sync/  sync config, conventions, authored previews
docs/          DEPLOY, PAYMENTS, QA, SEO, HANDOFF, NOTES, PROCESS
```

**The organizing principle is content/presentation separation, and it is strict:**
every price, hour, phone number, course description, FAQ, and nav link lives in
`src/data/*.ts` as a typed const. Pages import and render.

```ts
// src/data/courses.ts
export interface Course {
  slug: string; title: string; price: number | null; priceNote?: string;
  available: boolean; category: 'hca' | 'specialty' | 'certification' | 'continuing-ed';
  highlights?: string[];
}
export const registrationFee = 50;
export const courses: Course[] = [ /* 11 records */ ];
```

**To change content, edit `src/data/` — never the pages.** `courses/[slug].astro`
generates one page per record via `getStaticPaths`.

There is no feature-folder pattern and no content collection (`src/content/` does
not exist). Marketing copy is the one thing that is *split*: structured copy sits
in `src/data/`, but hero/section/CTA prose is inline in the `.astro` pages (e.g.
`src/pages/index.astro:21`). When a design changes a headline, check the page
first, then the data module.

**Env-gated integrations degrade gracefully by design** — `src/data/payments.ts`
reads `PUBLIC_*` vars, and Stripe/Formspree/GA/PostHog all render fallback
messaging when unset, because those accounts do not exist yet. Never build UI
that assumes they are configured.

## Checklist for landing a design here

1. Content into `src/data/`, presentation into the page. Never hardcode a price.
2. Compose from `src/components/` before writing new markup.
3. Any brand color must exist in the ramp *and* in the compiled CSS. Fills use
   `brand-700`+.
4. No new class name that collides with a Tailwind utility.
5. Headings are `h1`–`h4` for the serif; do not reach for a `font-serif` class.
6. Mirror any `@theme` or `data.ts` change into `design-system/`, then run
   `node design-system/fidelity.mjs`.
7. Verify with `npm run build` (27 pages), `npm test` (28), `npm run check`.
