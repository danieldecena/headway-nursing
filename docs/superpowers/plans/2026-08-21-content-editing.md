# Content Editing (Step 0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the editorial data (courses, schedules, FAQs) out of TypeScript into validated JSON that a non-developer can edit, without changing a single consumer or test.

**Architecture:** Each migrated module keeps its filename and its entire export surface. The `.ts` file stops holding a literal array and instead imports a sibling `.json`, validates it with `astro/zod` at module load, and exports the same typed constants. Because the exports are identical, all six `.astro` consumers and all three test files are untouched. Astro fails the build on invalid JSON with a field-level message.

**Tech Stack:** Astro 7 (static), TypeScript, `astro/zod` (already resolvable via the `astro` dependency, no new package), Vitest.

**Spec:** `docs/superpowers/specs/2026-08-21-content-editing-design.md`

## Global Constraints

- Node >= 22.12.0.
- **No new runtime dependencies.** Use `astro/zod`, verified to resolve and to export `z`. Do not add `zod` to `package.json`.
- **Export surface is frozen.** `courses.ts` must keep exporting exactly: `Course` (type), `courses`, `registrationFee`, `registrationFeeNote`, `getCourse`, `formatPrice`. `schedules.ts` must keep exporting: `WeeklySchedule` (type), `weeklySchedule`, `virtualLearningNote`, `scheduleNotes`. Renaming any of them is a plan failure.
- **Rendered output must not change.** Every task that touches data is verified by a `diff -r` of `dist/` against a pre-change baseline. A non-empty diff means the migration lost or reordered something.
- `site.ts`, `payments.ts` and `compliance.ts` stay TypeScript. Do not migrate them.
- Tailwind 4's scanner reads bare words anywhere in a scanned file. Do not name a JSON key after a utility class.
- No emoji in any file. Commit messages end with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- Never pass `--no-verify`.

---

### Task 1: Move courses to JSON behind an unchanged export surface

**Files:**
- Create: `src/data/courses.json`
- Create: `scripts/dump-data.mjs` (one-off, deleted in Step 5)
- Modify: `src/data/courses.ts` (replaces the 140-line literal with a loader)
- Test: `tests/courses.test.ts` (unchanged — it passing is the proof)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `src/data/courses.json` as an array of course objects; `courses.ts` exporting `Course`, `courses: Course[]`, `registrationFee: number`, `registrationFeeNote: string`, `getCourse(slug: string): Course | undefined`, `formatPrice(price: number | null, note?: string): string`. Task 2 copies this exact pattern.

- [ ] **Step 1: Capture the baseline that proves nothing changed**

```bash
rm -rf dist && npm run build && cp -R dist /tmp/baseline-dist
npm test   # expect 46 passed
```

- [ ] **Step 2: Generate the JSON from the current module, do not hand-transcribe**

Hand-copying 13 course objects is where a field gets silently dropped. Generate it:

`tsx` is NOT installed here and `npx tsx` fails. Node's own type stripping works
and is verified against this exact file:

```bash
mkdir -p scripts
cat > scripts/dump-data.mjs <<'EOF'
// One-off: dump a data module's array export to JSON so the migration cannot
// lose a field to hand-transcription. Deleted in Task 4.
import { writeFileSync } from 'node:fs';

const [, , modulePath, exportName, outPath] = process.argv;
const mod = await import(modulePath);
writeFileSync(outPath, JSON.stringify(mod[exportName], null, 2) + '\n');
console.log(`wrote ${outPath}: ${mod[exportName].length} entries`);
EOF
node --experimental-strip-types scripts/dump-data.mjs ../src/data/courses.ts courses src/data/courses.json
```

Verify before continuing. **There are 11 courses, not 13** — `grep -c 'slug:'`
returns 13 because it also counts the interface field and the `getCourse`
parameter, so do not use grep to check this:

```bash
node -p "JSON.parse(require('fs').readFileSync('src/data/courses.json')).length"   # expect 11
node -p "Object.keys(JSON.parse(require('fs').readFileSync('src/data/courses.json'))[0]).join(',')"
```

- [ ] **Step 3: Replace the module body with a validated loader**

```ts
import { z } from 'astro/zod';
import raw from './courses.json';

// The literal moved to courses.json so a non-developer can edit it through
// GitHub's web editor. This schema is the guard rail: an invalid edit fails
// the build with the offending field named, instead of rendering a broken page.
const courseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive().nullable(),
  priceNote: z.string().optional(),
  duration: z.string().optional(),
  format: z.string().min(1),
  available: z.boolean(),
  category: z.enum(['hca', 'specialty', 'certification', 'continuing-ed']),
  highlights: z.array(z.string()).optional(),
});

export type Course = z.infer<typeof courseSchema>;

export const courses: Course[] = z
  .array(courseSchema)
  .parse(raw);

export const registrationFee = 50;
export const registrationFeeNote =
  'Registration fee covers books and administrative work. Required for most courses.';

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function formatPrice(price: number | null, note?: string): string {
  if (price === null) return note ?? 'Contact for pricing';
  return `$${price}`;
}
```

Note `Course` changes from `interface` to an inferred type alias. That is deliberate: one definition instead of two that can drift. Consumers using `Course` as a type are unaffected.

The JSON import needs `resolveJsonModule`, and it is already on: the root `tsconfig.json` extends `astro/tsconfigs/strict`, which extends `astro/tsconfigs/base.json`, where `"resolveJsonModule": true` is set (verified 2026-08-21). No tsconfig change is needed.

- [ ] **Step 4: Prove the whole suite still passes untouched**

```bash
npm test
```
Expected: 46 passed. `tests/courses.test.ts` imports `courses, formatPrice, getCourse, registrationFee` and must not be edited. If it fails, the export surface drifted — fix the loader, not the test.

- [ ] **Step 5: Prove the rendered output is byte-identical**

```bash
rm -rf dist && npm run build && diff -r /tmp/baseline-dist dist && echo "IDENTICAL"
npm run check   # expect 0 errors
```
Expected: `IDENTICAL`. Any diff means a field was lost or reordered.

- [ ] **Step 6: Commit**

```bash
git add src/data/courses.json src/data/courses.ts
git commit -m "Move course data to JSON behind the same exports

Janice cannot edit a TypeScript module, and no CMS can either. The literal
moves to courses.json; courses.ts becomes a loader that validates it with
astro/zod and exports exactly what it exported before, so all six .astro
consumers and all three test files are untouched.

Verified by diff -r against a pre-change dist: byte-identical output.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Move schedules to JSON the same way

**Files:**
- Create: `src/data/schedules.json`
- Modify: `src/data/schedules.ts`
- Test: `tests/content.test.ts` (unchanged)

**Interfaces:**
- Consumes: the loader pattern established in Task 1.
- Produces: `schedules.ts` exporting `WeeklySchedule`, `weeklySchedule: WeeklySchedule[]`, `virtualLearningNote: string`, `scheduleNotes: string[]`.

- [ ] **Step 1: Capture the baseline**

```bash
rm -rf dist && npm run build && rm -rf /tmp/baseline-dist && cp -R dist /tmp/baseline-dist
```

- [ ] **Step 2: Write the JSON**

Only six entries, so write it directly, then verify against the module it replaces.

```json
[
  { "day": "Monday", "classes": ["CPR / First Aid Training (in-person skills required)"] },
  { "day": "Tuesday", "classes": ["Mental Health Specialty Training"] },
  { "day": "Wednesday", "classes": ["Nurse Delegation — Core", "Adult Education Class"] },
  { "day": "Thursday", "classes": ["Nurse Delegation — Focus on Diabetes"] },
  { "day": "Friday", "classes": ["Dementia Specialty Training"] },
  { "day": "By appointment", "classes": ["Continuing Education"] }
]
```

The em dashes in "Nurse Delegation — Core" and "Nurse Delegation — Focus on Diabetes" are the existing copy and must be preserved exactly; the no-em-dash rule applies to chat replies, not to site content.

- [ ] **Step 3: Replace the module body**

```ts
import { z } from 'astro/zod';
import raw from './schedules.json';

const weeklyScheduleSchema = z.object({
  day: z.string().min(1),
  classes: z.array(z.string().min(1)).min(1),
});

export type WeeklySchedule = z.infer<typeof weeklyScheduleSchema>;

export const virtualLearningNote =
  'Register at least two (2) weeks before your scheduled class. Zoom test meetings are held during the week between registration and your class start date.';

export const weeklySchedule: WeeklySchedule[] = z
  .array(weeklyScheduleSchema)
  .parse(raw);

export const scheduleNotes = [
  'HCA Core Basic Training is offered online and can start anytime once registration is completed.',
  'Refer to each course page for detailed schedule information.',
];
```

- [ ] **Step 4: Prove output and tests are unchanged**

```bash
npm test                                                    # expect 46 passed
rm -rf dist && npm run build && diff -r /tmp/baseline-dist dist && echo "IDENTICAL"
npm run check                                               # expect 0 errors
```

- [ ] **Step 5: Commit**

```bash
git add src/data/schedules.json src/data/schedules.ts
git commit -m "Move the weekly schedule to JSON behind the same exports

Same loader pattern as courses: the literal moves to schedules.json,
schedules.ts validates it with astro/zod and exports the same names.
Verified byte-identical against a pre-change dist.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Prove the schema actually rejects a bad edit

A schema that has only ever seen valid input has not been shown to validate anything. This task exists because Janice editing raw JSON is the failure mode the schema is supposed to catch, and an unproven guard is worse than none.

**Files:**
- Create: `tests/data-schema.test.ts`
- Modify: none

**Interfaces:**
- Consumes: `courses.json` and `schedules.json` from Tasks 1 and 2.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';

// Mirrors the schema in src/data/courses.ts. Kept here deliberately rather
// than exported and shared: this test exists to prove the shape is enforced,
// and importing the very thing under test would make it circular.
const courseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive().nullable(),
  priceNote: z.string().optional(),
  duration: z.string().optional(),
  format: z.string().min(1),
  available: z.boolean(),
  category: z.enum(['hca', 'specialty', 'certification', 'continuing-ed']),
  highlights: z.array(z.string()).optional(),
});

const coursesJson = JSON.parse(
  readFileSync(join(__dirname, '../src/data/courses.json'), 'utf8'),
);

describe('course data schema', () => {
  // Known-GOOD: the real file must pass.
  it('accepts the committed courses.json', () => {
    expect(() => z.array(courseSchema).parse(coursesJson)).not.toThrow();
  });

  // Known-BAD: the three mistakes an editor actually makes.
  it('rejects a price typed as a string', () => {
    const bad = [{ ...coursesJson[0], price: '700' }];
    expect(() => z.array(courseSchema).parse(bad)).toThrow();
  });

  it('rejects a category that is not one of the four', () => {
    const bad = [{ ...coursesJson[0], category: 'nursing' }];
    expect(() => z.array(courseSchema).parse(bad)).toThrow();
  });

  it('rejects an entry missing its slug', () => {
    const { slug: _slug, ...noSlug } = coursesJson[0];
    expect(() => z.array(courseSchema).parse([noSlug])).toThrow();
  });
});
```

- [ ] **Step 2: Run it and confirm all four pass**

```bash
npx vitest run tests/data-schema.test.ts
```
Expected: 4 passed. If the three known-BAD cases pass without throwing, the schema is not enforcing anything and Task 1 Step 3 was wrong.

- [ ] **Step 3: Prove the guard fires end to end, not just in the test**

Break the real file and watch the build refuse it:

```bash
cp src/data/courses.json /tmp/courses.bak
node -e "
const fs=require('fs');const p='src/data/courses.json';
const d=JSON.parse(fs.readFileSync(p));d[0].price='700';
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');"
grep -q '\"price\": \"700\"' src/data/courses.json || { echo "MUTATION DID NOT APPLY"; exit 1; }
npm run build; echo "build exit: $?"     # expect NON-ZERO
cp /tmp/courses.bak src/data/courses.json
npm run build && echo "restored and building"
```

Asserting the mutation applied before trusting the failure matters: a patch that silently no-ops produces a passing build that reads exactly like a broken guard.

- [ ] **Step 4: Commit**

```bash
git add tests/data-schema.test.ts
git commit -m "Prove the data schemas reject the edits an editor actually makes

A schema that has only seen valid input has not been shown to validate.
Covers the known-GOOD committed file plus three known-BAD cases: a price
typed as a string, an unknown category, and a missing slug. Also verified
out of band that a bad price fails npm run build, with the mutation asserted
before trusting the failure.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Give Janice a written route to editing a price

The JSON is useless to her if nobody tells her where it is. `docs/HANDOFF.md` currently says to email Daniel for every change.

**Files:**
- Modify: `docs/HANDOFF.md` (the "Changing what the site says" section)
- Modify: `AGENTS.md` (the architecture paragraph naming `src/data/`)
- Modify: `STATUS.md`, `TASKS.md`
- Delete: `scripts/dump-data.mjs`

**Interfaces:**
- Consumes: the JSON files from Tasks 1 and 2.
- Produces: nothing code-facing.

- [ ] **Step 1: Rewrite the HANDOFF section**

Replace the "What lives where" table's courses and schedule rows so they name the `.json` files, and add a numbered walkthrough directly beneath it:

```markdown
### Changing a course price yourself

1. Go to `src/data/courses.json` in the repository on github.com
2. Click the pencil icon
3. Find the course by its `"title"`, change the number after `"price":`
4. Green "Commit changes" button, then "Commit directly to the main branch"
5. Wait about two minutes, then reload the site

If you make a typo, the site does not break. The change is checked
automatically and simply refuses to publish, and Daniel gets an email. The
old price stays up until it is fixed.

Do not change anything inside `"slug"` — that is the page's address, and
changing it breaks every link to that course.
```

- [ ] **Step 2: Correct the architecture note in AGENTS.md**

It currently says content "lives in typed TypeScript modules under `src/data/`". Amend to say the editorial data now lives in `courses.json` and `schedules.json`, validated by sibling loaders, while `site.ts`, `payments.ts` and `compliance.ts` stay TypeScript.

- [ ] **Step 3: Delete the one-off dump script**

```bash
rm -f scripts/dump-data.mjs
rmdir scripts 2>/dev/null || true
```

- [ ] **Step 4: Update state and run the full gate**

Tick "Migrate courses and schedules to content collections" in `TASKS.md`, retitling it to say JSON rather than content collections, and add a `## Decision log` entry to `STATUS.md` recording that content collections were rejected and why.

```bash
rm -rf dist && npm run build   # 29 pages
npm run check                  # 0 errors
npm test                       # expect 50 passed
node design-system/fidelity.mjs
```

- [ ] **Step 5: Commit and open the PR**

```bash
git add docs/HANDOFF.md AGENTS.md STATUS.md TASKS.md
git commit -m "Document the JSON editing route for Janice

Co-Authored-By: Claude <noreply@anthropic.com>"
gh pr create --base main --head content-editing-json
```

---

## Verification

The phase is shippable when all five hold:

1. `npm run build` — 29 pages, sitemap generated.
2. `npm run check` — 0 errors.
3. `npm test` — 50 passed (46 existing plus 4 new schema tests).
4. `diff -r` of `dist/` against the pre-migration baseline — no output.
5. A deliberately bad `price` in `courses.json` fails `npm run build`, with the mutation asserted before the failure is believed.

**The phase is not done until the board's own acceptance test passes:** Janice changes one price herself, start to finish, and it reaches the site. That needs the Cloudflare deploy working, so it is gated on the token.

## Out of scope

Sveltia CMS and the Cloudflare Pages Function OAuth broker (Step 1 of the spec) get their own plan. They are blocked on Daniel creating a GitHub OAuth app, and the JSON shape should settle first.

`faqs.ts` and `testimonials.ts` are migratable by the same pattern but are not urgent — nobody has asked to edit them. Do them when someone does.
