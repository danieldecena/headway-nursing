# Compliance Disclosures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the student-facing disclosures a Washington career-training provider is expected to make, without asserting a licensure status nobody has confirmed.

**Architecture:** A new `src/data/compliance.ts` holds every disclosure fact as typed data, including a `licensure` block that is **unconfirmed by default**. A new `/policies` page renders the confirmed facts and structurally cannot render the licence-specific statements while `licensure.status` is `'unconfirmed'`. The existing `/refund-policy` page is rewritten against the statutory refund schedule. Tests assert the gate holds, so an unconfirmed claim cannot reach the build.

**Tech Stack:** Astro 7 (static, zero client JS), Tailwind CSS 4, Vitest 4, TypeScript.

**Spec:** No standalone spec doc. This plan argues from primary sources, cited inline per task:

- [WAC 490-105-042](https://app.leg.wa.gov/wac/default.aspx?cite=490-105-042) — the 24-item catalog list
- [WAC 490-105-043](https://app.leg.wa.gov/wac/default.aspx?cite=490-105-043) — enrollment agreement, incl. the exact licensing statement
- [WAC 490-105-130](https://app.leg.wa.gov/wac/default.aspx?cite=490-105-130) — minimum refund schedule
- [RCW 28C.10](https://app.leg.wa.gov/rcw/default.aspx?cite=28c.10&full=true) — the Private Vocational Schools Act, incl. the 28C.10.030 exemptions

## Why this is gated rather than asserted

**Headway's licensure status could not be established.** The Workforce Board's
licensed-schools list renders dynamically and returned no entries to fetch; the
live Weebly site states no license number, licensing agency, or accreditation on
any page checked. Two regimes are possible and they differ in what must be said:

- **RCW 28C.10 / WAC 490-105** (private career school) — the 24-item catalog, an
  enrollment agreement carrying a verbatim licensing statement, and a uniform
  statewide refund schedule.
- **WAC 388-112A** (DSHS long-term-care-worker training entity) — chiefly
  curriculum and instructor approval, with far fewer public-disclosure duties.

Note the site already describes itself as "DSHS-approved", and 28C.10.030 exempts
*continuing education for licenses under chapter 18.79 RCW* and *workshops of
three calendar days or less* — so parts of Headway's catalog may be exempt while
the 75-hour HCA course is not. **This plan therefore never emits a licence claim
from an unconfirmed flag.** Everything it does publish is either required under
both regimes or is plainly useful to a prospective student regardless.

## Global Constraints

- **Never state or imply a licensure status that `compliance.licensure.status` does not confirm.** This is the point of the plan; Task 2's test enforces it.
- **The licensing statement, if it is ever switched on, is verbatim:** `This school is licensed under chapter 28C.10 RCW. Inquiries, concerns, or complaints regarding this school can be made to the Workforce Board, 128 10th Avenue S.W., Olympia, Washington, 98501, 360-709-4600, web: www.wtb.wa.gov, email: workforce@wtb.wa.gov.`
- **Content lives in `src/data/`, presentation in `src/pages/`.** Never hardcode a price, phone number, or address into a page.
- **Do not touch `src/data/site.ts`'s `email` field.** It conflicts with the live site and is owned by a pending Daniel/Janice decision.
- **Never name a variant key, prop value, or identifier after a real Tailwind utility.** The scanner reads bare words anywhere in a source file, including comments and object keys.
- **Fills and links use `brand-700` or darker.** `brand-600` fails AA at 3.30:1.
- **Body copy is `text-slate-600`; headings get the serif automatically** from the global `h1..h4` rule. There is no `font-serif` utility.
- **Link assertions must match both `href="/x"` and `href: '/x'`.** `tests/site.test.ts` already exports the `hrefsIn` matcher for this; data-driven pages never emit the literal attribute form in source.
- **Every command runs from the repo root.** Node >= 22.12.0.

## File Structure

| File | Responsibility |
|---|---|
| `src/data/compliance.ts` (create) | Every disclosure fact as typed data: the licensure gate, refund schedule, grievance procedure, non-discrimination and accommodation statements. The single place Janice's answers land. |
| `src/pages/policies.astro` (create) | Renders the confirmed disclosures. Reads only from `compliance.ts`. |
| `src/pages/refund-policy.astro` (rewrite) | Replaces the placeholder policy with the statutory schedule, driven by `compliance.ts`. |
| `src/components/Footer.astro` (modify) | Adds `/policies` to the legal links, so the page is reachable. |
| `src/pages/resources.astro` (modify) | Adds `/policies` to the hub, where a student would actually look. |
| `tests/compliance.test.ts` (create) | The licence gate and the refund schedule's internal consistency. |
| `tests/site.test.ts` (extend) | Reachability of the new page, via the existing guard. |

---

### Task 1: The compliance data module

**Files:**
- Create: `src/data/compliance.ts`
- Test: `tests/compliance.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `export const compliance` with this exact shape, relied on by every later task:
  - `licensure: { status: 'unconfirmed' | 'private-career-school' | 'dshs-only'; statement: string | null; licenseNumber: string | null }`
  - `refund: { cancellationDays: number; tiers: ReadonlyArray<{ throughPercent: number; schoolKeepsPercent: number; label: string }>; registrationFee: { amount: number; refundableAfterCancellationWindow: boolean } }`
  - `grievance: { steps: readonly string[]; agency: { name: string; address: string; phone: string; web: string; email: string } | null }`
  - `nonDiscrimination: string`
  - `accommodations: string`

- [ ] **Step 1: Write the failing test**

Create `tests/compliance.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { compliance } from '../src/data/compliance';

describe('licensure gate', () => {
  it('defaults to unconfirmed until Janice confirms the regime', () => {
    expect(compliance.licensure.status).toBe('unconfirmed');
  });

  it('carries no licence statement or number while unconfirmed', () => {
    if (compliance.licensure.status === 'unconfirmed') {
      expect(compliance.licensure.statement).toBeNull();
      expect(compliance.licensure.licenseNumber).toBeNull();
    }
  });
});

describe('statutory refund schedule', () => {
  it('gives five business days to cancel', () => {
    expect(compliance.refund.cancellationDays).toBe(5);
  });

  it('matches the WAC 490-105-130 tiers, in ascending order', () => {
    expect(compliance.refund.tiers.map((t) => [t.throughPercent, t.schoolKeepsPercent])).toEqual([
      [10, 10],
      [25, 25],
      [50, 50],
      [100, 100],
    ]);
  });

  it('caps the retained registration fee at the statutory maximum', () => {
    // WAC 490-105-130: not exceeding 10% of tuition or $100, whichever is less.
    expect(compliance.refund.registrationFee.amount).toBeLessThanOrEqual(100);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/compliance.test.ts`

Expected: FAIL — the whole file fails to resolve `../src/data/compliance`, because the module does not exist yet. This is a resolution error, not an assertion failure.

- [ ] **Step 3: Create the module**

Create `src/data/compliance.ts`:

```typescript
// Disclosure facts for the student-facing policy pages.
//
// licensure.status is deliberately 'unconfirmed'. Headway's regulatory regime
// could not be established from public sources: the Workforce Board's licensed-
// schools list renders dynamically, and the live site states no licence number
// or agency. Two regimes are possible and they differ in what must be said —
// RCW 28C.10 / WAC 490-105 (private career school) or WAC 388-112A (DSHS
// long-term-care-worker training entity). Until Janice confirms which, no page
// may assert either. Flipping this flag is the whole switch.
export const compliance = {
  licensure: {
    status: 'unconfirmed' as 'unconfirmed' | 'private-career-school' | 'dshs-only',
    statement: null as string | null,
    licenseNumber: null as string | null,
  },

  // WAC 490-105-130. Percentages are of the program completed; schoolKeeps is
  // the share of tuition the school may retain at that point.
  refund: {
    cancellationDays: 5,
    tiers: [
      { throughPercent: 10, schoolKeepsPercent: 10, label: 'One week, or up to 10% of the program' },
      { throughPercent: 25, schoolKeepsPercent: 25, label: 'More than 10% but less than 25%' },
      { throughPercent: 50, schoolKeepsPercent: 50, label: '25% through 50%' },
      { throughPercent: 100, schoolKeepsPercent: 100, label: 'More than 50%' },
    ],
    registrationFee: {
      amount: 50,
      refundableAfterCancellationWindow: false,
    },
  },

  grievance: {
    steps: [
      'Raise the concern with your instructor first. Most issues are resolved at this step.',
      'If it is unresolved, put it in writing to the Program Director, Janice Angle, RN, by email or post to the office address.',
      'The Program Director responds in writing within ten business days.',
    ],
    // Populated only when licensure.status names a regulator with a complaints route.
    agency: null as {
      name: string;
      address: string;
      phone: string;
      web: string;
      email: string;
    } | null,
  },

  nonDiscrimination:
    'Headway Nursing Services admits students of any race, color, national or ethnic origin, religion, sex, sexual orientation, gender identity, age, veteran status, or disability, and does not discriminate in the administration of its admissions or training policies.',

  accommodations:
    'If you need an accommodation to participate in a class, contact the office before your start date so arrangements can be made. Requests are handled confidentially.',
} as const;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/compliance.test.ts`

Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/data/compliance.ts tests/compliance.test.ts
git commit -m "Add the compliance data module with the licensure gate closed

Headway's regulatory regime could not be established from public sources,
so licensure.status defaults to unconfirmed and carries no statement or
number. The refund tiers are WAC 490-105-130's.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: The /policies page, with the gate enforced

The page renders only what is confirmed. The test in this task is the one that
makes the gate real rather than decorative: it asserts the built HTML carries no
licence claim while the flag is unconfirmed.

**Files:**
- Create: `src/pages/policies.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/pages/resources.astro`
- Test: `tests/compliance.test.ts` (extend)

**Interfaces:**
- Consumes: `compliance` from `src/data/compliance` (Task 1), plus `BaseLayout`, `PageShell`, `PageHeader` from the existing component library.
- Produces: the route `/policies`.

- [ ] **Step 1: Write the failing test**

First add these two lines to the **top** of `tests/compliance.test.ts`, alongside
the existing imports (ESM imports are hoisted, but putting them mid-file is
unreadable and the next person will move them anyway):

```typescript
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
```

Then append to the same file:

```typescript
describe('the policies page respects the gate', () => {
  const source = readFileSync(join(__dirname, '../src/pages/policies.astro'), 'utf8');

  it('renders the licence statement only behind a status check', () => {
    // The verbatim statement must never appear as an unconditional literal.
    expect(source).not.toContain('This school is licensed under chapter 28C.10 RCW');
  });

  it('publishes the disclosures that hold under either regime', () => {
    for (const key of ['nonDiscrimination', 'accommodations', 'grievance']) {
      expect(source, `policies.astro does not render compliance.${key}`).toContain(
        `compliance.${key}`,
      );
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/compliance.test.ts -t "respects the gate"`

Expected: FAIL — `ENOENT` on `policies.astro`. The page does not exist yet.

- [ ] **Step 3: Create the page**

Create `src/pages/policies.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageShell from '../components/PageShell.astro';
import PageHeader from '../components/PageHeader.astro';
import { compliance } from '../data/compliance';
import { site } from '../data/site';
---

<BaseLayout
  title="Student Policies"
  description="Admissions, grievance, non-discrimination and accommodation policies for students at Headway Nursing Services."
>
  <PageShell>
    <PageHeader>Student Policies</PageHeader>
    <p class="mt-2 text-slate-600">
      What students can expect from us, and how to raise a concern.
    </p>

    <h2 class="mt-10 text-xl font-semibold text-brand-900">Cost of training</h2>
    <p class="mt-2 text-slate-600">
      Each course page lists its full price. A ${compliance.refund.registrationFee.amount} registration
      fee covers books and administrative costs. See the
      <a href="/refund-policy" class="font-semibold text-brand-700 hover:text-brand-900">refund policy</a>
      for cancellation terms.
    </p>

    <h2 class="mt-10 text-xl font-semibold text-brand-900">Raising a concern</h2>
    <ol class="mt-2 list-decimal space-y-2 pl-5 text-slate-600">
      {compliance.grievance.steps.map((step) => <li>{step}</li>)}
    </ol>
    {compliance.grievance.agency && (
      <p class="mt-3 text-slate-600">
        If the matter is still unresolved, you may contact {compliance.grievance.agency.name},
        {' '}{compliance.grievance.agency.address}, {compliance.grievance.agency.phone},
        {' '}{compliance.grievance.agency.web}.
      </p>
    )}

    <h2 class="mt-10 text-xl font-semibold text-brand-900">Non-discrimination</h2>
    <p class="mt-2 text-slate-600">{compliance.nonDiscrimination}</p>

    <h2 class="mt-10 text-xl font-semibold text-brand-900">Accommodations</h2>
    <p class="mt-2 text-slate-600">{compliance.accommodations}</p>

    {compliance.licensure.status !== 'unconfirmed' && compliance.licensure.statement && (
      <>
        <h2 class="mt-10 text-xl font-semibold text-brand-900">Licensing</h2>
        <p class="mt-2 text-slate-600">{compliance.licensure.statement}</p>
      </>
    )}

    <h2 class="mt-10 text-xl font-semibold text-brand-900">Questions</h2>
    <p class="mt-2 text-slate-600">
      Call {site.phone.office} or
      <a href="/contact" class="font-semibold text-brand-700 hover:text-brand-900">send us a message</a>.
    </p>
  </PageShell>
</BaseLayout>
```

Note the licensing block reads `compliance.licensure.statement` from data — the
verbatim string is never a literal in this file, which is what the Step 1 test
asserts.

- [ ] **Step 4: Link the page from the footer and the resources hub**

In `src/components/Footer.astro`, add a list item directly after the Privacy Policy line:

```astro
        <li><a href="/policies" class="hover:text-white">Student Policies</a></li>
```

In `src/pages/resources.astro`, append this entry to the `resources` array, after the `What's New` entry:

```javascript
  {
    href: '/policies',
    title: 'Student Policies',
    blurb: 'Costs, cancellations, raising a concern, non-discrimination and accommodations.',
  },
```

- [ ] **Step 5: Run the tests and the build**

Run: `npm test && npm run build`

Expected: all tests pass, including the existing `page reachability` guard now
that `/policies` is linked from two places. Build reports **29 pages** (up from 28).

- [ ] **Step 6: Prove the gate actually fires**

A gate that has only ever been closed has not been shown to work. Confirm it
opens and closes, then confirm it is closed in the shipped output:

```bash
grep -c "28C.10" dist/policies/index.html
```

Expected: `0`. The built page carries no licence claim.

Then temporarily open the gate and confirm the section appears:

```bash
sed -i.bak "s/status: 'unconfirmed' as/status: 'private-career-school' as/; s/statement: null as/statement: 'This school is licensed under chapter 28C.10 RCW.' as/" src/data/compliance.ts
npm run build && grep -c "28C.10" dist/policies/index.html
```

Expected: `1`. The section renders when the flag is set.

Then restore and re-confirm:

```bash
mv src/data/compliance.ts.bak src/data/compliance.ts
npm run build && grep -c "28C.10" dist/policies/index.html
npx vitest run tests/compliance.test.ts
```

Expected: `0`, and all tests pass. Both directions are now observed, which is what
separates a working gate from one that merely never renders anything.

- [ ] **Step 7: Commit**

```bash
git add src/pages/policies.astro src/components/Footer.astro src/pages/resources.astro tests/compliance.test.ts
git commit -m "Publish student policies behind the licensure gate

Renders cost, grievance, non-discrimination and accommodation
disclosures, which hold under either regulatory regime. The licensing
section is data-gated and stays dark while the regime is unconfirmed.
Verified in both directions: 0 occurrences of 28C.10 in the built page
with the flag closed, 1 with it open.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Rewrite the refund policy against the statutory schedule

The current page is a placeholder carrying "Confirm with Janice before launch",
a two-week notice rule, and no mention of the five-business-day cancellation
right. If 28C.10 applies, that page is not merely thin — it understates a right
the student has. The statutory schedule is the safer floor under either regime.

**Files:**
- Modify: `src/pages/refund-policy.astro` (rewrite the body; it is 26 lines)
- Test: `tests/compliance.test.ts` (extend)

**Interfaces:**
- Consumes: `compliance.refund` from Task 1.
- Produces: nothing importable.

- [ ] **Step 1: Write the failing test**

Append to `tests/compliance.test.ts`:

```typescript
describe('the refund page is driven by the schedule', () => {
  const source = readFileSync(join(__dirname, '../src/pages/refund-policy.astro'), 'utf8');

  it('renders the tiers from data rather than hardcoding them', () => {
    expect(source).toContain('compliance.refund.tiers');
  });

  it('no longer carries the pre-launch placeholder', () => {
    expect(source).not.toContain('Confirm with Janice before launch');
  });

  it('states the cancellation window', () => {
    expect(source).toContain('compliance.refund.cancellationDays');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/compliance.test.ts -t "driven by the schedule"`

Expected: FAIL on all three — the current page hardcodes its copy and still
contains the placeholder sentence.

- [ ] **Step 3: Rewrite the page**

Replace the entire contents of `src/pages/refund-policy.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageShell from '../components/PageShell.astro';
import PageHeader from '../components/PageHeader.astro';
import { compliance } from '../data/compliance';
---

<BaseLayout
  title="Refund Policy"
  description="Cancellation and refund terms for training at Headway Nursing Services."
>
  <PageShell>
    <PageHeader>Refund &amp; Cancellation Policy</PageHeader>

    <h2 class="mt-10 text-xl font-semibold text-brand-900">Cancelling before class starts</h2>
    <p class="mt-2 text-slate-600">
      You may cancel within {compliance.refund.cancellationDays} business days of signing up or
      making your first payment, as long as training has not begun, and receive a full refund of
      everything you have paid.
    </p>

    <h2 class="mt-10 text-xl font-semibold text-brand-900">Cancelling after class starts</h2>
    <p class="mt-2 text-slate-600">
      Once training begins, the refund depends on how much of the program you have completed.
    </p>
    <table class="mt-4 w-full text-left text-slate-600">
      <thead>
        <tr class="border-b border-slate-300">
          <th class="py-2 font-semibold text-brand-900">Completed</th>
          <th class="py-2 font-semibold text-brand-900">School retains</th>
        </tr>
      </thead>
      <tbody>
        {compliance.refund.tiers.map((tier) => (
          <tr class="border-b border-slate-200">
            <td class="py-2">{tier.label}</td>
            <td class="py-2">{tier.schoolKeepsPercent}% of tuition</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2 class="mt-10 text-xl font-semibold text-brand-900">Registration fee</h2>
    <p class="mt-2 text-slate-600">
      The ${compliance.refund.registrationFee.amount} registration fee covers books and
      administrative work. It is refundable if you cancel within the
      {' '}{compliance.refund.cancellationDays}-business-day window above, and is otherwise retained.
    </p>

    <h2 class="mt-10 text-xl font-semibold text-brand-900">How to cancel</h2>
    <p class="mt-2 text-slate-600">
      Put your cancellation in writing and
      <a href="/contact" class="font-semibold text-brand-700 hover:text-brand-900">send it to the office</a>
      as early as you can. Refunds on card payments are returned to the original payment method.
    </p>
  </PageShell>
</BaseLayout>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/compliance.test.ts`

Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/pages/refund-policy.astro tests/compliance.test.ts
git commit -m "Rewrite the refund policy against the statutory schedule

The page was a placeholder with a two-week notice rule and no mention of
the five-business-day cancellation right, which understates a right the
student has if RCW 28C.10 applies. The WAC 490-105-130 schedule is the
safer floor under either regime, and it now renders from data.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Record what Janice still has to answer

The gate is only useful if someone knows to open it. This task leaves the open
questions where the next session will find them.

**Files:**
- Modify: `STATUS.md`
- Modify: `TASKS.md`

**Interfaces:** none.

- [ ] **Step 1: Add the blocker to `## Known broken`**

Append to that section in `STATUS.md`:

```markdown
- Headway's regulatory regime is unconfirmed, so `src/data/compliance.ts` ships
  with `licensure.status: 'unconfirmed'` and /policies renders no licensing
  section. Could not be resolved from public sources: the Workforce Board's
  licensed-schools list renders dynamically and the live Weebly site states no
  licence number or agency. Janice needs to answer: is Headway licensed as a
  private career school under RCW 28C.10 (if so, what licence number), or is it
  DSHS-approved only under WAC 388-112A? If the former, /policies must also
  carry the verbatim WAC 490-105-043 licensing statement and the Workforce Board
  complaints route, and the enrollment agreement has its own requirements.
```

- [ ] **Step 2: Add the follow-up tasks**

Append to `TASKS.md`, keeping each title under 60 characters and free of `.` and `#`:

```markdown
- [ ] Confirm Headway licensure regime with Janice
- [ ] Open the licensure gate once the regime is known
```

- [ ] **Step 3: Append the decision-log entry**

Add to the newest `### 2026-08-21` block in `STATUS.md`'s `## Decision log`:

```markdown
- Decided: the compliance pages publish only what holds under either regulatory
  regime, and the licence-specific statements sit behind
  `compliance.licensure.status`. Asserting a licensure status nobody has
  confirmed is the one failure mode worth engineering against here — a false
  licence claim on a training provider's site is worse than a missing one.
- Verified the gate in both directions: 0 occurrences of "28C.10" in the built
  page with the flag closed, 1 with it open, back to 0 after restoring.
```

- [ ] **Step 4: Run everything and commit**

```bash
npm run build && npm test && npm run check && node design-system/fidelity.mjs
```

Expected: 29 pages, 42 tests across 5 files, `astro check` 0 errors, fidelity
`all clean`.

```bash
git add STATUS.md TASKS.md
git commit -m "Record the unconfirmed licensure regime as a blocker

The compliance gate is closed and needs Janice's answer to open. Names
the exact question and what changes in each branch.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification

End to end, from a clean tree:

1. `npm run build` — **29 pages**, sitemap generated.
2. `npm test` — **42 tests** across 5 files (32 existing + 5 from Task 1 + 2 from Task 2 + 3 from Task 3).
3. `npm run check` — 0 errors.
4. `node design-system/fidelity.mjs` — `all clean`. (No DS component changes here, so this should be untouched; if it moves, something leaked into `src/components/` beyond the Footer link.)
5. `grep -c "28C.10" dist/policies/index.html` — **0**. Nothing claims a licence.
6. `/policies` is reachable: the `page reachability` guard in `tests/site.test.ts` covers it, and it is linked from both the footer and `/resources`.
7. `git log --oneline -4` shows four commits, one per task.

The failure mode this plan is built around is not a broken build — it is a
confidently-worded false statement about a regulated training provider's legal
status. Every structural choice here (data-gated flag, no verbatim literal in
the page, a test asserting absence in the built output) exists to make that
statement impossible to ship by accident.

## Self-review notes

- **Coverage:** every disclosure this plan publishes traces to either WAC 490-105-042's catalog list (cost, grievance, non-discrimination, accommodations) or WAC 490-105-130 (the refund schedule). Items from the 24-item list that are *not* covered here — faculty qualifications, school calendar, standards of progress, facilities and student/teacher ratios, job placement assistance, financial aid — are deliberately out of scope: each needs facts only Janice holds, and inventing them is precisely the failure this plan guards against. They belong to the follow-up task once the regime is confirmed.
- **Not covered by design:** the enrollment agreement (WAC 490-105-043). It is a signed document, not a web page, and it only exists as a requirement if the private-career-school branch turns out to apply.
