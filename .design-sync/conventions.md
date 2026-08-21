# Headway Nursing DS — how to build with it

Tailwind 4 utility system. No provider, no theme wrapper — components style
themselves from `styles.css` (which @imports `_ds_bundle.css` and
`fonts/fonts.css`). The stylesheet's own `body` rule already sets the page
background, body text color and font smoothing, so a root wrapper needs no
classes; `class="bg-ground text-slate-700"` restates it harmlessly if you want
it explicit. (`antialiased` is NOT a utility here — it lives in that body rule.)
Headings come in the serif free from the stylesheet: `h1-h4 { font-family:
'Source Serif 4', Georgia, serif }`; body text is Public Sans.

## Tokens (defined in styles.css @theme)

- `brand-*` greens: 50, 100, 200, 500, 600, 700, 800, 900. Fills and links use
  `brand-700`+ (WCAG-checked); `brand-50/100/200` are surfaces and borders;
  `brand-900` is the dark panel color (hero, footer). Note: brand-500
  (#86b54b) is lighter than brand-600 (#519d68) — do not assume a luminance
  ramp between them.
- `accent-*` slate blue: **600 and 700 only**. Reserved for the Student Login
  button and form submits (`bg-accent-600 hover:bg-accent-700`). The source
  theme also defines 50/100/500/900, but this is a static Tailwind build and
  it emits only the values components actually use — those four resolve to
  nothing. Do not reach for them.
- `ground` #faf8f5 warm page background. Body text color is `slate-700` (an `ink` token exists in the source theme but ships unused — do not reference it).

## Styling idiom — compiled utility vocabulary only

The shipped stylesheet is a static Tailwind build: only classes already in
`_ds_bundle.css` resolve. Stay inside these families (all verified present):
layout `flex flex-col flex-wrap grid gap-2/3/4/6/8 items-center items-start
items-end justify-between mx-auto relative absolute fixed hidden block`;
width `max-w-3xl max-w-4xl max-w-6xl w-full min-w-48 min-h-96 h-64`;
spacing `p-4 p-6 p-8 px-2/3/4/6 py-2/3/4/10/12 mt-1/2/4/6/8/12 ml-1 space-y-1/4`;
type `text-xs/sm/lg/xl/2xl/4xl md:text-5xl font-medium font-semibold font-bold`;
color: any `bg-/text-/border-` with the tokens above plus `white`,
`slate-50/200/300/400/500/600/700`, `amber-100/800`;
chrome `rounded-lg rounded-xl rounded-full border border-t border-b shadow-sm
shadow-lg hover:shadow-md transition underline sr-only list-none`.
A class outside the build renders unstyled — compose from components first,
glue with the families above.

## Components (window.HeadwayDS)

PageShell (width md|lg|xl, prose for long-form), PageHeader, SectionHeading,
Button (href + variant primary|secondary|ghost — ghost only on brand-900
panels), Card (tone white|muted, polymorphic `as`), CourseCard (course object;
CTA logic is built in: priced+available renders Register, otherwise Contact
us), Header (6-item nav + Student Login default), Footer (pass `year`),
RegisterSection (formConfigured/paymentUrl props pick the branch),
CookieBanner (fixed-position; `open` prop).
Read each `components/general/<Name>/<Name>.d.ts` before use — props are
typed and defaults are the decided brand values.

## Idiomatic page skeleton

```jsx
const { Header, PageShell, PageHeader, CourseCard, Footer } = window.HeadwayDS;
<div className="bg-ground text-slate-700">
  <Header />
  <PageShell width="xl">
    <PageHeader>Our Courses</PageHeader>
    <div className="mt-8 grid gap-6 md:grid-cols-4">
      <CourseCard course={{ slug: '75-hour-ltc-blended',
        title: '75-Hour LTC Blended Training',
        shortDescription: 'Home Care Aide training with online work and 4-day classroom skills.',
        price: 700, available: true }} />
    </div>
  </PageShell>
  <Footer year={2026} />
</div>
```

Copy rules (legal, not stylistic): approval is worded "DSHS-approved training
entity" / "licensed under chapter 28C.10 RCW" — never "state-approved" or any
job guarantee. Prices, dates, and requirements stay literal.
