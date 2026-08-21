# Nav Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the site header from nine nav items to the decided six, without orphaning the four pages that lose their nav link.

**Architecture:** The decided six include a `Resources` entry that has no page. Build `/resources` as a hub page first, so the displaced pages have a destination, then swap `navLinks`. A reachability test added between those two steps is what makes the swap provably safe rather than hopefully safe.

**Tech Stack:** Astro 7 (static, zero client JS), Tailwind CSS 4, Vitest 4, TypeScript.

**Spec:** No standalone spec doc. The requirements are:
- `STATUS.md` → `## Decision log` → `### 2026-08-19 (wireframe checkpoint)` — the six-item decision.
- `STATUS.md` → `## Known broken` → the cramped-header entry (2026-08-21) — the measured symptom this fixes.
- The Resources IA decision was made 2026-08-21 and is recorded in Global Constraints below, because it exists nowhere else yet.

## Global Constraints

- **The decided six, in this exact order:** Courses, Schedule, About, Resources, Consulting, Contact. Copied verbatim from `design-system/src/data.ts`, which already ships them. Plus a Student Login button, which is not a `navLinks` entry — it is hardcoded in `Header.astro` and must stay that way.
- **`/services` is the Consulting page.** The href is `/services`, the label is `Consulting`. Do not rename either.
- **Content lives in `src/data/`, presentation in `src/pages/`.** Never hardcode a price, phone number, or address into a page.
- **Never name a variant key, prop value, or identifier after a real Tailwind utility.** The scanner reads bare words anywhere in a source file, including comments and object keys.
- **Fills and links use `brand-700` or darker.** `brand-600` fails AA at 3.30:1.
- **Body copy is `text-slate-600`; headings get the serif automatically** from the global `h1..h4` rule. There is no `font-serif` utility — do not reach for one.
- **Every command runs from the repo root.** Node >= 22.12.0.

---

### Task 1: Build the /resources hub page

The four pages losing their nav link are Virtual Learning, What's New, Testimonials and FAQ. Two of them — `/testimonials` and `/faq` — are linked from nowhere else in the site, so without this page they become unreachable the moment Task 3 lands. HCA Exam joins them here: it is currently footer-only and belongs with this group.

**Files:**
- Create: `src/pages/resources.astro`
- Test: `tests/site.test.ts` (extend the existing file; do not create a new one)

**Interfaces:**
- Consumes: `BaseLayout`, `PageShell`, `PageHeader`, `Card` from `src/components/`, following the import pattern in `src/pages/faq.astro`.
- Produces: the route `/resources`, which Task 3's `navLinks` entry points at, and which Task 2's reachability test treats as a linking page.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.ts`:

```typescript
describe('resources hub', () => {
  const resources = readFileSync(join(pagesDir, 'resources.astro'), 'utf8');

  it('links every page that loses its nav entry', () => {
    for (const href of ['/virtual-learning', '/whats-new', '/testimonials', '/faq', '/hca-exam']) {
      expect(resources, `resources.astro does not link ${href}`).toContain(`href="${href}"`);
    }
  });
});
```

Add `readFileSync` to the existing `node:fs` import at the top of the file, so the line reads:

```typescript
import { existsSync, readFileSync } from 'node:fs';
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/site.test.ts -t "resources hub"`

Expected: FAIL. The error is `ENOENT: no such file or directory` on `resources.astro`, because the page does not exist yet — not an assertion failure.

- [ ] **Step 3: Create the page**

Create `src/pages/resources.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageShell from '../components/PageShell.astro';
import PageHeader from '../components/PageHeader.astro';
import Card from '../components/Card.astro';

const resources = [
  {
    href: '/virtual-learning',
    title: 'Virtual Learning',
    blurb: 'How online classes run, what you need to join, and how certificates are issued.',
  },
  {
    href: '/hca-exam',
    title: 'HCA Exam Info',
    blurb: 'What happens after training: scheduling the state exam and getting on the registry.',
  },
  {
    href: '/faq',
    title: 'Frequently Asked Questions',
    blurb: 'Common questions about Home Care Aide certification and training in Washington State.',
  },
  {
    href: '/testimonials',
    title: 'Testimonials',
    blurb: 'What graduates say about training with Headway.',
  },
  {
    href: '/whats-new',
    title: "What's New",
    blurb: 'Regulatory updates that affect caregivers and training timelines.',
  },
];
---

<BaseLayout
  title="Resources"
  description="Guides, FAQs and updates for Home Care Aide students at Headway Nursing Services."
>
  <PageShell>
    <PageHeader>Resources</PageHeader>
    <p class="mt-2 text-slate-600">
      Guides and answers for students, from choosing a class through getting on the state registry.
    </p>

    <ul class="mt-10 grid gap-6 sm:grid-cols-2">
      {resources.map((item) => (
        <li>
          <Card>
            <a href={item.href} class="text-lg font-semibold text-brand-700 hover:text-brand-900">
              {item.title}
            </a>
            <p class="mt-2 text-slate-600">{item.blurb}</p>
          </Card>
        </li>
      ))}
    </ul>
  </PageShell>
</BaseLayout>
```

The `resources` array is deliberately local to this page rather than added to `src/data/`. It is navigation copy for one page, not content reused anywhere else; promoting it to a data module would be an abstraction for a single use.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/site.test.ts -t "resources hub"`

Expected: PASS, 1 test.

- [ ] **Step 5: Build and confirm the route exists**

Run: `npm run build && ls dist/resources/index.html`

Expected: the build reports **28 pages** (up from 27), and `ls` prints the path without error.

- [ ] **Step 6: Commit**

```bash
git add src/pages/resources.astro tests/site.test.ts
git commit -m "Add /resources as a hub for the pages leaving the nav

The decided six-item nav includes a Resources entry with no page behind
it. /testimonials and /faq are linked from nowhere else in the site, so
dropping them from the nav without this page would orphan them.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Add the reachability guard

This is the task that makes Task 3 safe. It asserts that every built page is reachable from the nav, the footer, or a link on another page. It passes today and will fail the moment a page is orphaned — including if someone later removes a link from `/resources`.

**Files:**
- Test: `tests/site.test.ts` (extend again)

**Interfaces:**
- Consumes: `navLinks` from `src/data/site`, plus the raw text of `src/components/Footer.astro` and every file in `src/pages/`.
- Produces: nothing importable. It is a guard.

- [ ] **Step 1: Write the test**

Append to `tests/site.test.ts`:

```typescript
describe('page reachability', () => {
  // Pages that are deliberately not linked from anywhere in the site.
  const unlinked = new Set([
    '/thank-you', // post-form confirmation; noindex, excluded from the sitemap
  ]);

  function allHrefs(): Set<string> {
    const sources = [
      readFileSync(join(__dirname, '../src/components/Footer.astro'), 'utf8'),
      ...readdirSync(pagesDir, { recursive: true, encoding: 'utf8' })
        .filter((f) => f.endsWith('.astro'))
        .map((f) => readFileSync(join(pagesDir, f), 'utf8')),
    ];
    const found = new Set(navLinks.map((l) => l.href));
    for (const src of sources) {
      for (const m of src.matchAll(/href="(\/[a-z0-9-]*)"/g)) found.add(m[1]);
    }
    return found;
  }

  it('links every top-level page from the nav, the footer, or another page', () => {
    const linked = allHrefs();
    const pages = readdirSync(pagesDir, { encoding: 'utf8' })
      .filter((f) => f.endsWith('.astro') && f !== 'index.astro')
      .map((f) => `/${f.replace(/\.astro$/, '')}`);

    const orphans = pages.filter((p) => !linked.has(p) && !unlinked.has(p));
    expect(orphans, `unreachable page(s): ${orphans.join(', ')}`).toEqual([]);
  });
});
```

Add `readdirSync` to the `node:fs` import, so the line reads:

```typescript
import { existsSync, readdirSync, readFileSync } from 'node:fs';
```

Two deliberate limits, both fine for this guard: it only checks top-level `.astro` pages, so the `courses/` directory is out of scope (`/courses` itself is linked from the nav and the footer), and it matches literal `href="/path"` only, so a computed href would read as unlinked. Both would fail loudly rather than silently pass.

- [ ] **Step 2: Run the test to verify it passes on the current tree**

Run: `npx vitest run tests/site.test.ts -t "page reachability"`

Expected: PASS. Nothing is orphaned yet — Task 1 gave the four pages a home, and the nav is still nine items.

- [ ] **Step 3: Prove the guard actually fires**

A guard that has only ever passed has not been shown to work. Temporarily break it:

```bash
sed -i.bak 's|href="/faq"|href="/faq-BROKEN"|' src/pages/resources.astro
npx vitest run tests/site.test.ts -t "page reachability"
```

Expected: FAIL with `unreachable page(s): /faq`.

Then restore, and confirm it passes again:

```bash
mv src/pages/resources.astro.bak src/pages/resources.astro
npx vitest run tests/site.test.ts -t "page reachability"
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/site.test.ts
git commit -m "Guard against orphaning a page when the nav shrinks

Asserts every top-level page is reachable from the nav, the footer, or
another page. Verified it fires by pointing the /resources link at a
nonexistent route and watching it fail with the orphan named.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Consolidate navLinks to the decided six

**Files:**
- Modify: `src/data/site.ts:43-53`
- Test: `tests/site.test.ts` (extend again)

**Interfaces:**
- Consumes: nothing new.
- Produces: `navLinks` as a six-entry array. `Header.astro` and `Footer.astro` already read it and need no change — the header maps it for both desktop and mobile nav, and the Student Login button is separate markup.

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.ts`:

```typescript
describe('the decided six-item nav', () => {
  it('matches the decided set, in order', () => {
    expect(navLinks.map((l) => l.label)).toEqual([
      'Courses',
      'Schedule',
      'About',
      'Resources',
      'Consulting',
      'Contact',
    ]);
  });

  it('keeps Consulting pointed at /services', () => {
    expect(navLinks.find((l) => l.label === 'Consulting')?.href).toBe('/services');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/site.test.ts -t "decided six"`

Expected: FAIL on the first test, showing the current nine labels against the expected six.

- [ ] **Step 3: Replace the navLinks array**

In `src/data/site.ts`, replace lines 43-53 entirely with:

```typescript
export const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/about', label: 'About' },
  { href: '/resources', label: 'Resources' },
  { href: '/services', label: 'Consulting' },
  { href: '/contact', label: 'Contact' },
] as const;
```

This is byte-identical to `design-system/src/data.ts` apart from the `as const`, which the site copy needs and the DS copy does not.

- [ ] **Step 4: Run the full suite**

Run: `npm test`

Expected: PASS, **32 tests** across 4 files — the 28 that existed, plus 1 from Task 1, 1 from Task 2, and 2 from this task. The reachability guard from Task 2 passing here is the point of this plan: it proves the four displaced pages are still reachable.

- [ ] **Step 5: Commit**

```bash
git add src/data/site.ts tests/site.test.ts
git commit -m "Consolidate the site nav to the decided six items

Nine nav items made the header wrap the wordmark and two nav labels at
every desktop width. The six were decided 2026-08-19 and the design
system has shipped them since; this makes the site converge on it.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Verify the header actually stopped cramping

The reason this work exists is a measured symptom, so close it with a measurement rather than a glance. `STATUS.md` records the header at 105px tall with a 56px wordmark (two lines) at 1280, 1440 and 1600.

**Files:**
- Modify: `STATUS.md` (move the cramped-header entry out of `## Known broken`)
- Modify: `.design-sync/NOTES.md` (the site/DS nav divergence it documents is now resolved)

**Interfaces:** none.

- [ ] **Step 1: Build, then measure the header at three widths**

Run:

```bash
npm run build
npx playwright screenshot --help >/dev/null 2>&1 || echo "playwright CLI not needed; use the node script below"
```

Then create `/tmp/measure-header.mjs` and run it with `node /tmp/measure-header.mjs`:

```javascript
import { chromium } from '/Users/home/developer/headwaynurse-website/.ds-sync/node_modules/playwright/index.mjs';
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = '/Users/home/developer/headwaynurse-website/dist';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
const srv = http.createServer((req, res) => {
  let p = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const port = srv.address().port;
const b = await chromium.launch();
for (const w of [1280, 1440, 1600]) {
  const pg = await b.newPage({ viewport: { width: w, height: 300 } });
  await pg.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  const m = await pg.evaluate(() => {
    const h = document.querySelector('header');
    const wm = [...h.querySelectorAll('span')].find((s) => s.textContent.trim() === 'Headway Nursing Services');
    return { headerH: Math.round(h.getBoundingClientRect().height), wordmarkH: Math.round(wm.getBoundingClientRect().height) };
  });
  console.log(`w=${w}`, JSON.stringify(m));
  await pg.close();
}
await b.close();
srv.close();
```

Expected: `wordmarkH` is **28** at all three widths (one line, down from 56), and `headerH` drops from 105 to roughly 77. If `wordmarkH` is still 56, the nav is still too wide — stop and report rather than proceeding.

- [ ] **Step 2: Move the STATUS entry**

Delete the cramped-header bullet from `## Known broken`, and append to the newest decision-log entry:

```markdown
- Done: the header cramping is fixed. navLinks cut from nine to the decided
  six, with /resources built as a hub so the four displaced pages (plus
  HCA Exam) keep a home — /testimonials and /faq were linked from nowhere
  else and would have been orphaned. Measured after: wordmark 28px (one
  line) at 1280/1440/1600, header 105px -> 77px. A reachability test now
  guards against orphaning a page, and it was verified to fire.
```

- [ ] **Step 3: Update the design-sync note**

In `.design-sync/NOTES.md`, replace the bullet beginning "Header's DEFAULT nav is the decided 6-item set" with:

```markdown
- Header's nav is the decided 6-item set + Student Login in BOTH the site
  (`src/data/site.ts`) and the DS (`design-system/src/data.ts`) as of
  2026-08-21. The earlier divergence is resolved; keep them in step.
```

- [ ] **Step 4: Run everything and commit**

```bash
npm run build && npm test && npm run check && node design-system/fidelity.mjs
```

Expected: 28 pages, 32 tests passing, `astro check` 0 errors, fidelity `all clean`.

```bash
git add STATUS.md .design-sync/NOTES.md
git commit -m "Record the header fix and the resolved nav divergence

Measured after the change: wordmark 28px at 1280/1440/1600, one line,
down from 56. Moves the entry out of Known broken.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification

End to end, from a clean tree:

1. `npm run build` — 28 pages, sitemap generated.
2. `npm test` — 32 tests, 4 files, all passing.
3. `npm run check` — 0 errors.
4. `node design-system/fidelity.mjs` — `all clean`.
5. Open `/resources` in a browser and click all five links; each loads.
6. The header measurement in Task 4 Step 1 reports `wordmarkH: 28` at all three widths.
7. `git log --oneline -4` shows four commits, one per task.

The failure mode this plan is built around is silent: dropping nav items makes pages unreachable without breaking a build or a render. Task 2's guard is the only thing that catches it, which is why Task 2 proves the guard fires before Task 3 relies on it.
