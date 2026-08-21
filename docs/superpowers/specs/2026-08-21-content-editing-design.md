# Content editing for Janice — design

**Status:** approved 2026-08-21. Phase 2 of the four-subsystem plan.
**Phase 1 (payments consolidation) landed as `58150bc`.**

## Problem

Janice Angle owns Headway Nursing but cannot change a word on its website.
Every price, class date and FAQ lives in TypeScript modules under `src/data/`,
so a $20 price change is a developer task. Two board items name this:
"Implement content editing pick for Janice" and, as the acceptance test,
"Janice edits one price herself end to end".

## Constraints, confirmed not assumed

1. **CMSs edit YAML, JSON and Markdown, never TypeScript.** All seven modules
   under `src/data/` are `.ts`. No CMS can touch them as they stand. Some
   conversion is unavoidable and is the whole of this phase's first step.

2. **A GitHub-backed CMS needs a server-side OAuth exchange.** Keystatic's
   GitHub mode requires an API route holding a client secret
   (`makeGenericAPIRouteHandler`, verified against Keystatic's docs). This site
   is `output: 'static'` with no adapter, a deliberate invariant in `AGENTS.md`.
   Keystatic GitHub mode is therefore rejected, and Keystatic local mode is too
   since it needs Janice to run a dev server.

3. **Astro content collections are the wrong tool.** `getCollection()` is async
   and yields `{ id, data }`, so adopting it rewrites all six `.astro`
   consumers of `courses`/`schedules`. `astro:content` also cannot be imported
   from Vitest, which breaks `tests/courses.test.ts`, `tests/content.test.ts`
   and `tests/payments.test.ts`. Nine files churned for schema validation a CMS
   does not need. Rejected in favour of plain JSON behind the existing exports.

## Approach: three separately shippable steps

### Step 0 — data becomes JSON, exports do not change

`src/data/courses.ts` and `src/data/schedules.ts` become thin loaders that
import a sibling `.json`, validate it with `astro/zod` (already resolvable, no
new dependency), and export the same names with the same types. Every consumer
and every test is untouched. An invalid edit fails the build with a field-level
message rather than rendering a broken page.

Janice edits the JSON through GitHub's own web editor. Zero infrastructure.

**The risk, stated plainly:** raw JSON is where a non-technical editor breaks a
build, via a missing comma or a stray quote. The Zod schema and the existing
Vitest suite are the mitigation, and both run in CI before anything deploys, so
the failure mode is a red check rather than a broken site.

`site.ts`, `payments.ts` and `compliance.ts` stay TypeScript. They are
structural and legal, not editorial, and Janice should not be editing them.

### Step 1 — a real editing UI (separate plan, blocked)

Sveltia CMS as a static `/admin` page plus **one** Cloudflare Pages Function as
the OAuth broker. This preserves the static invariant: the only server code in
the project becomes a single auth endpoint, not an adapter and not SSR.

Blocked on Daniel creating a GitHub OAuth app, so it gets its own plan once
Step 0 has landed and the JSON shape has settled.

### Step 2 — preview deploys, only if asked

## Done means

Not "the JSON validates". The board's own acceptance test: **Janice changes one
price herself, start to finish, and it reaches the site.** Step 0 is shippable
before that, but the phase is not done until it happens.
