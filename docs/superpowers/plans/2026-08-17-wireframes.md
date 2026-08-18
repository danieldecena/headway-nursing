# Headway Wireframes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Tasks 1-4 run in this session (they drive browser + artifact tools the executor owns); do not fan out to subagents.

**Goal:** Produce reviewable wireframes for the Headway Nursing site redesign — Claude Design canvas first for fast review with Janice, then translate the approved direction into a Figma file (tokens + components + one assembled Home frame).

**Architecture:** Two surfaces in sequence. Phase A (Tasks 1-4) audits the live Weebly site, measures the real brand palette from existing assets, and seeds a Claude Design canvas with grayscale wireframe artboards carrying real site copy; Daniel and Janice review there. Phase B (Tasks 5-7) runs only after that review lands the palette and nav decisions: it creates a Figma file, proves the View seat can actually write, then builds tokens, the component set, and one Home assembly frame.

**Tech Stack:** Claude Design (`design` skill), claude.ai Figma MCP (`use_figma` + `/figma-use` skill), claude-in-chrome for Weebly capture, `/opt/homebrew/bin/python3` + Pillow for pixel sampling.

**Spec:** `~/.cursor/plans/headway_website_review_c9228cd3.plan.md` (the reviewed Cursor plan) as amended by the 2026-08-17 review: lean scope (4 desktop templates), audit included, Option B palette must be measured not guessed, `t3.png` is a byte-copy of `logo-banner.png` and is not a testimonial.

## Global Constraints

- **Scope is the lean first pass:** Home, Course listing, Course detail, Contact — desktop 1440px only. About/Schedule/mobile are explicitly out.
- **Real copy only, no lorem ipsum.** All text comes from `src/data/site.ts` (name, tagline, address `8412 South 124th St, Seattle, WA 98178`, phones, hours `Mon-Fri 9 AM-3 PM`, mission, director bio) and `src/data/courses.ts` (titles, prices, formats, `available` flags, highlights, `registrationFee = 50`).
- **Wireframes stay grayscale** (white / #F3F4F6 boxes / #1A1A1A text). Color appears only on the Tokens artboard, where Option A and Option B sit side by side. This keeps the palette decision open through review.
- **Type:** headings Source Serif 4, body Inter. In Figma the Inter style names are `Semi Bold` / `Extra Bold` (with spaces) — `SemiBold` fails.
- **Layout:** 1440px frames, 1152px max content column, 64px section rhythm, 16/24px padding.
- **Proposed nav (what the wireframes draw):** Courses, Schedule, About, Resources, Consulting, Contact + `Student Login` filled button. The current 9-item nav is the audit's "before", not the wireframes'.
- **Skill gates:** load the `design` skill before creating the canvas; load `skill://figma/figma-create-new-file/SKILL.md` (if it exists in `skill://index.json`) before `create_new_file`; load `skill://figma/figma-use/SKILL.md` before the first `use_figma` call.
- **Every task ends with an observation** (artifact/Figma screenshot or command output), never with "no error" (`rules/silent-failure.md`).
- **Exclude `public/images/testimonials/t3.png`** everywhere — it is a byte-copy of `logo-banner.png`, not a testimonial.
- **No repo code changes.** The only repo writes are `TASKS.md` checkboxes and archiving this plan to `docs/superpowers/plans/2026-08-17-wireframes.md` (Task 1, Step 1).
- Figma team for Phase B: `team::1631414310402726587` (danieldecena's team). Both seats are **View** — Task 5 exists to prove writes work before anything is built on top.

---

### Task 1: Capture the Weebly audit evidence

**Files:**
- Create: `<scratchpad>/weebly/{home,training,about,contact}.png`
- Create: `docs/superpowers/plans/2026-08-17-wireframes.md` (archive copy of this plan)
- Modify: `TASKS.md` (add this plan's four task titles as `- [ ]` lines)

**Interfaces:**
- Produces: four PNG screenshots Task 3 places on the Audit artboard, plus the six pain-point captions listed in Step 3.

- [ ] **Step 1: Archive the plan and sync TASKS.md.** Copy this plan into the repo at `docs/superpowers/plans/2026-08-17-wireframes.md`; add the four open task titles to `TASKS.md` under `## Tasks`; commit both with pathspec `-- docs TASKS.md`.
- [ ] **Step 2: Capture four pages.** Load claude-in-chrome tools (one ToolSearch call), `tabs_context_mcp`, create one tab, then for each of `https://www.headwaynursing.org/` (home), `/training.html` (or the Training nav expanded if that 404s — take whatever URL the live nav uses), `/about-us.html`, `/contact-us.html`: navigate, screenshot full page, save to the scratchpad paths above. Close the tab.
- [ ] **Step 3: Verify the captures.** Read each PNG back (Read tool renders images); confirm each shows the intended page, not an error page. These six captions accompany them on the audit artboard: (1) 40+ nav items, Training alone has 15+; (2) duplicate pages — 4x "75 Hrs LTC Training", 3x "Core Basic", 2x Blog; (3) ALL-CAPS wall-of-text homepage separated by `***`; (4) no visual brand — default Weebly theme, text-only header; (5) register/payment CTAs scattered across separate `-registration-form.html` pages; (6) dead pages — "Coming Soon", "New Page".

### Task 2: Measure the Option B palette from the real assets

**Files:**
- Create: `<scratchpad>/palette.py`, `<scratchpad>/palette-b.json`

**Interfaces:**
- Produces: `palette-b.json` — measured hex values keyed `sage`, `plum`, `warm-white`, `charcoal` (or whatever four dominant non-gray clusters actually emerge), each with the source file and pixel count. Task 3 renders these verbatim on the Tokens artboard; the Cursor plan's guessed values (#98B4A6 etc.) are used nowhere.

- [ ] **Step 1: Install Pillow** (verified absent 2026-08-17): `/opt/homebrew/bin/python3 -m pip install --user Pillow`, then confirm `import PIL` succeeds.
- [ ] **Step 2: Write and run `palette.py`.** Inputs: `public/images/testimonials/t1.png`, `t2.png`, `public/images/logo-banner.png`. For each: load with Pillow, quantize to 8 colors (`img.convert('RGB').quantize(8)`), dump each palette color as hex with its pixel share. Write the merged result to `palette-b.json`, tagging each hex with its source file.
- [ ] **Step 3: Verify against a known input.** The script must also report a color you can predict: white/near-white background should dominate the testimonial cards. If no cluster lands within ~#F0F0F0-#FFFFFF, the sampling is broken — fix before trusting the brand colors it found.

### Task 3: Seed the Claude Design canvas

**Files:**
- Create: canvas source per the `design` skill's conventions (it dictates the file layout); published as an Artifact.

**Interfaces:**
- Consumes: Task 1's four PNGs + captions; Task 2's `palette-b.json`.
- Produces: the artifact URL Daniel reviews in Task 4.

- [ ] **Step 1: Load the `design` skill** and follow its drafting conventions for everything below. Favicon/title stay stable across redeploys.
- [ ] **Step 2: Create six artboards:**
  1. **Audit** — the four Weebly screenshots with the six captions from Task 1 Step 3.
  2. **Tokens** — Option A swatches from `src/styles/global.css` verbatim (brand-50 #eff6ff, 100 #dbeafe, 200 #bfdbfe, 500 #2563eb, 600 #1d4ed8, 700 #1e40af, 800 #1e3a8a, 900 #172554; teal-500 #0d9488, teal-600 #0f766e) beside Option B from `palette-b.json`; type ramp (Source Serif 4 at 48/36/28/20, Inter at 16/14) and the spacing scale (4/8/16/24/32/64).
  3. **Home 1440** — header (proposed 6-item nav + Student Login button, logo placeholder box); hero with tagline `DSHS-Approved Home Care Aide & Caregiver Training` + three CTAs (View Courses / Schedule / Contact); amber alert bar, one line: office + hours from `site.ts`; featured-courses 4-card grid (75-Hour Blended $700, Core Basic $500, Dementia "Contact for pricing", Mental Health) with Available/Unavailable badges; "Why Headway" 2-col; two testimonial text-quote cards (transcribe the quotes from `t1.png`/`t2.png` while they are open in Task 1 — never `t3.png`); footer.
  4. **Courses 1440** — category-grouped card grid (hca / specialty / certification / continuing-ed from `courses.ts`), 3-col, card = title, price or priceNote, format, badge, CTA (`Register` when `available`, `Contact us` when not); registration-fee note line ($50).
  5. **Course detail 1440** — 75-Hour LTC Blended as the worked example: breadcrumb, title + Available badge, dl grid (price $700 / duration `75 hours (online + 4-day classroom)` / format `Blended (online + in-person)`), description, 3 highlights, register section (quick CTAs, payment area, form — no dev-message anywhere).
  6. **Contact 1440** — heading `Contact Us` (not `Register`); info column (toll-free 1-800-380-4929, office 425-306-5010, after-hours 206-380-0042, email, hours, address + map link); form (name, email, phone, course-interest select listing the available course titles, message); testimonial strip.
- [ ] **Step 3: Verify by screenshot.** Render/inspect each artboard; confirm real copy (spot-check the phone number and the $700 price), grayscale-only wireframes, and both palettes on Tokens. Fix before publishing the link.

### Task 4: Review checkpoint (blocks Phase B)

- [ ] **Step 1: Hand Daniel the artifact URL** with the three decisions review must land: palette A vs B, nav consolidation yes/no, logo (use `logo-banner.png` as-is, recreate, or commission). Note the two open items wireframing cannot decide: hero photo replacement and testimonial quote approval.
- [ ] **Step 2: Stop.** Phase B does not start until Daniel replies with the decisions. Record them in `STATUS.md`'s decision log when they arrive.

### Task 5: Figma preflight — prove the seat can write

**Interfaces:**
- Produces: `fileKey` for Tasks 6-7. If this task fails, Phase B is blocked on a seat upgrade — report and stop; do not retry around it.

- [ ] **Step 1:** Read `skill://index.json`; load `figma-create-new-file` skill if listed. Create file `Headway Nursing — Wireframes` (design, `team::1631414310402726587`).
- [ ] **Step 2:** Load `skill://figma/figma-use/SKILL.md`. Prove writes: `use_figma` creates a rectangle, `get_screenshot` shows it, `use_figma` deletes it. A create that errors or renders nothing = View seat cannot write; stop and report.
- [ ] **Step 3:** Create pages `01 Tokens`, `02 Components`, `03 Home`; verify with `get_metadata` (no nodeId) listing all three.

### Task 6: Figma tokens

- [ ] **Step 1:** On `01 Tokens`, build the **chosen** palette (Task 4's decision) as Figma color variables plus swatch frames; add text styles: `Heading/1..4` = Source Serif 4 at 48/36/28/20, `Body` / `Body Small` = Inter Regular 16/14, `UI` = Inter `Semi Bold` 14.
- [ ] **Step 2:** Screenshot the page; confirm swatch hexes and style names match Task 4's decision exactly.

### Task 7: Figma components + Home assembly

- [ ] **Step 1:** On `02 Components`, build as components with variants: Button (Primary/Secondary), Badge (Available/Unavailable), Alert Banner, Course Card (available/unavailable — real content: 75-Hour Blended $700 / 75-Hour Classroom $650), Form Field, Testimonial Card, Site Header (6-item nav + Student Login), Site Footer, Register Section. Same content sources as Task 3.
- [ ] **Step 2:** Screenshot; verify each variant renders and uses the Task 6 variables (spot-check one fill is bound to a variable, not a raw hex).
- [ ] **Step 3:** On `03 Home`, assemble the Home frame (1440) from those components, mirroring the approved Task 3 artboard.
- [ ] **Step 4:** Screenshot the frame; compare against the Task 3 Home artboard for section order and copy. Report the Figma URL, mark the TASKS.md items, and close out per session rules.

## Verification (end-to-end)

1. Artifact URL opens and shows all six artboards with real copy (Task 3 Step 3 screenshots are the evidence).
2. `palette-b.json` exists and its background cluster sanity check passed (Task 2 Step 3).
3. Figma file: `get_metadata` lists the three pages; screenshots on record for tokens, each component variant, and the Home frame.
4. `TASKS.md` reflects reality: Tasks 1-3 checked after Phase A, 5-7 after Phase B, with the review checkpoint's decisions in `STATUS.md`.

## Out of scope

About, Schedule, Resources hub, and all mobile frames (next pass); any Astro code change (Phase 6 of the Cursor plan, separate plan after wireframe approval); FigJam sitemap board; hero photography.
