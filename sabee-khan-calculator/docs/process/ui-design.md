# UI Design Spec

## Design direction (Stage 4)

**Chosen: A + bigger verdict (DEC-10, PO).** Direction A "Ledger" with Pass/Fail as a large icon + word block, close to the score's visual weight (beside the score on wide screens, under it on narrow ones). B is kept below for the record only.

Preview: `design/directions.html` (both directions, light and dark) · screenshots `design/screenshots/directions-1280.png`, `directions-375.png`.
Both use the system font stack `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`, tabular numerals for every number, 44×44 px minimum targets, and show Pass/Fail as icon + word (never colour alone). Contrast is WCAG 2.x relative luminance, computed with python3; field borders and focus rings are UI parts (3:1 min).

### Direction A — Ledger (chosen)
- **Mood:** calm and editorial; paper, ink and a light, large score, like a well-made report card.
- **Colour** (light / dark, ratio against the background named):

| Token | Light | Dark | Ratios light / dark |
|-------|-------|------|---------------------|
| background | #F5F3EE | #111316 | text on bg 14.93 / 15.47 |
| surface (card, fields) | #FFFFFF | #1B1E23 | — |
| text | #1B1F24 | #ECEAE4 | on surface 16.56 / 13.89 |
| muted text | #5A6069 | #A4A9B1 | on surface 6.34 / 7.07 |
| accent (button, focus) | #1F4E79 | #8EB9E8 | on surface 8.66 / 8.16 |
| pass (+ tint #E6F2E9 / #16301F) | #1D6B3A | #6FCF97 | on surface 6.53 / 8.79 · on tint 5.67 / 7.48 |
| fail (+ tint #FBE9E7 / #3A1E1C) | #A8322D | #F2958D | on surface 6.65 / 7.53 · on tint 5.67 / 6.84 |
| border (hairline) / field border | #DDD8CD / #8A9099 | #353A42 / #6E747E | field border 3.22 / 3.55 |

- **Type:** scale 12 / 13 / 15 / 17 / 20 / 64 px; small uppercase tracked labels ("SCORE"); score 64 px weight 300 with a half-size muted "%", so the number reads like a printed mark.
- **Layout:** one narrow card (max 420 px); "Marks earned *of* Total marks possible" on one row, pass mark below; a hairline divider, then the score with a Pass/Fail pill (tick or cross) and the gap line; "Next learner" as an outline button with an Esc hint (preview only; S-4 cut, DEC-17).
- **Why it fits:** quiet and formal, so a borderline Fail reads as a fair record rather than a judgement; the "17.5 of 23" row mirrors how marks arrive on paper, which suits instructors recording results.

### Direction B — Spotlight (not chosen)
- **Mood:** confident and modern; inputs on the left, the result lit up in a deep indigo panel.
- **Colour** (light / dark, ratio against the background named):

| Token | Light | Dark | Ratios light / dark |
|-------|-------|------|---------------------|
| background | #ECEEF6 | #0C0E1A | text on bg 14.74 / 16.60 |
| surface (card, fields) | #FFFFFF | #171A2E | — |
| text | #161A33 | #ECEEF8 | on surface 17.08 / 14.83 |
| muted text | #535A76 | #A3A8C3 | on surface 6.79 / 7.31 |
| accent (button, focus) / on-accent | #4B3FD8 / #FFFFFF | #A99FFF / #14112E | accent on surface 7.00 / 7.43 · button label 7.00 / 7.91 |
| result panel / panel text / panel muted | #1F1B4E / #FFFFFF / #C9C6EE | #2B2566 / #FFFFFF / #D0CCF6 | text 15.85 / 13.47 · muted 9.66 / 8.75 |
| pass (on panel) | #7FE0B0 | #86E5B6 | on panel 9.96 / 8.91 |
| fail (on panel) | #FFA59C | #FFAEA6 | on panel 8.39 / 7.60 |
| error text (under fields) | #B42318 | #FF9F96 | on surface 6.57 / 8.70 |
| border / field border | #D6DAE7 / #8A90A8 | #2D3252 / #6C7294 | field border 3.16 / 3.65 |

- **Type:** scale 13 / 14 / 15 / 18 / 22 / 26 / 56–80 px; bold, tight headings; score weight 800 sized to the card (`clamp(48px, 11cqi, 80px)`); verdict 26 px bold with a circled tick or cross.
- **Layout:** a split card (max 640 px), inputs with unit suffixes ("marks", "%") on the left, inset result panel on the right; below 500 px card width the panel stacks under the inputs; "Next learner" is a full-width filled button (preview only).
- **Why it fits:** the result is unmistakable at a glance on a phone and the panel keeps its place while an instructor types, but it is louder and the result sits below the inputs on mobile.

### Recommendation (accepted)
- **Choose A — Ledger.** It answers both roles' main question in one short column (score, verdict, gap) with the calmest, most "official" tone for pass/fail outcomes people may challenge.
- A is narrower and simpler, so it stays the same layout from 320 px to 1280 px (no split/stack switch), which lowers build and test risk inside the 2–4 h budget.
- B is the stronger choice if the PO wants more brand energy; its result panel and type scale can be reused in A later without changing the tokens' structure.

## Design spec (A "Ledger" + bigger verdict)

Mockup: `design/mockup.html` (states a–e, light + dark, wide + 375 px, component states) · screenshots `design/screenshots/mockup-1280.png`, `mockup-375.png`.
Changes from the A preview: verdict is a large block, not a pill; no "Next learner" button or Esc hint (future S-4, not built, DEC-17); fields are stacked at every width (no "of" row, so labels never wrap unevenly and errors get their own reserved line); card max-width 520 px so the verdict fits beside the score.

### Design tokens (`src/styles/tokens.css`)
Light values on `:root`; dark values under `@media (prefers-color-scheme: dark)`. Components use tokens only.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--color-bg` | #F5F3EE | #111316 | page background |
| `--color-surface` | #FFFFFF | #1B1E23 | card, inputs; tick/cross and "!" glyphs |
| `--color-text` | #1B1F24 | #ECEAE4 | title, values, score, gap line |
| `--color-muted` | #5A6069 | #A4A9B1 | labels, eyebrows, M-1/M-2/M-3, "%" |
| `--color-accent` / `--color-accent-tint` | #1F4E79 / #E9EFF6 | #8EB9E8 / #22303F | unused since DEC-17, kept for the future S-4 button (favicon tile repeats the light hex) |
| `--color-border` | #DDD8CD | #353A42 | card edge, divider |
| `--color-field-border` / `-hover` | #8A9099 / #5A6069 | #6E747E / #A4A9B1 | input border default / hover |
| `--color-focus` | #1F4E79 | #8EB9E8 | focus ring |
| `--color-pass` / `--color-pass-tint` | #1D6B3A / #E6F2E9 | #6FCF97 / #16301F | Pass word, disc, border, ▲ / Pass block fill |
| `--color-fail` / `--color-fail-tint` | #A8322D / #FBE9E7 | #F2958D / #3A1E1C | Fail word, disc, border, ▼ / Fail block fill |
| `--color-error` | #A8322D | #F2958D | field error text, icon, border (own token; same hue as fail for now) |
| `--shadow-card` | 0 1px 2px rgba(27,31,36,.06), 0 8px 24px rgba(27,31,36,.06) | 0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.3) | card |

**Contrast** (WCAG 2.x relative luminance, python3; text ≥ 4.5:1, UI parts ≥ 3:1) — all PASS:

| Pair (fg on bg) | Used for | Light | Dark | Min |
|-----------------|----------|-------|------|-----|
| text on surface / on bg | values, score, gap line | 16.56 / 14.93 | 13.89 / 15.47 | 4.5 |
| muted on surface / on bg | labels, messages | 6.34 / 5.72 | 7.07 / 7.88 | 4.5 |
| pass on surface / on pass-tint | Pass border, ▲ / Pass word | 6.53 / 5.67 | 8.79 / 7.48 | 4.5 |
| surface on pass | tick on Pass disc | 6.53 | 8.79 | 4.5 |
| fail on surface / on fail-tint | Fail border, ▼ / Fail word | 6.65 / 5.67 | 7.53 / 6.84 | 4.5 |
| surface on fail | cross on Fail disc | 6.65 | 7.53 | 4.5 |
| error on surface | error text, icon, input border | 6.65 | 7.53 | 4.5 |
| field-border / field-border-hover on surface | input border (UI) | 3.22 / 6.34 | 3.55 / 7.07 | 3.0 |
| focus on surface / on bg | focus ring (UI) | 8.66 / 7.81 | 8.16 / 9.09 | 3.0 |

**Type** — `--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (no web fonts).

| Token | Size / weight / line-height | Use |
|-------|-----------------------------|-----|
| `--text-xs` | 12 / 600 / 1.4, uppercase, `--tracking-eyebrow: .12em` | eyebrows "Quiz score", "Score" |
| `--text-sm` | 13 / 500 / 1.4 | labels, field errors, subheading (400) |
| `--text-base` | 15 / 400 / 1.5 | M-1, M-2, M-3, gap line |
| `--text-md` | 17 / 400 | input values (proportional figures) |
| `--text-lg` | 20 / 600 / 1.25 | card heading (h1) |
| `--text-verdict` | 40 / 600 / 1, tracking -.01em | "Pass" / "Fail" |
| `--text-score` | 64 / 300 / 1, tracking -.03em; "%" at .5em in muted | score |

`font-variant-numeric: tabular-nums` on the score (`tabular-nums lining-nums`) and gap line. Inputs use proportional figures (`normal`) so a typed "-5" does not read as "- 5" (V-3.1).
`text-wrap: pretty` on the gap line text: avoids a lone last word ("mark") when it wraps at narrow widths; browsers without support wrap normally.

**Spacing** (4 px base): `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 · `-10` 40 · `-12` 48.
**Sizes**: `--control-h` 44 · `--icon-sm` 16 · `--icon-verdict` 40 · `--card-max` 520 · `--input-max-wide` 240 · `--border-w` 1 · `--focus-w` 2 · `--focus-offset` 2.
**Radii**: `--radius-sm` 4 (inputs) · `--radius-md` 6 (card, verdict block); discs 50%.
**Motion**: `--duration-fast` 150ms (input border and shadow on hover/error) · `--duration-base` 200ms (spare) · `--ease-out` cubic-bezier(0.2, 0, 0, 1). Score, verdict, gap and messages appear instantly (no animation). `@media (prefers-reduced-motion: reduce)` → `transition: none` everywhere.

### Theme
- Favicon `public/favicon.svg`: 32 px rounded tile in accent #1F4E79 with a white tick (the Pass glyph); one file for both themes (the tile carries its own contrast).
- Follows `prefers-color-scheme`; no manual toggle (a toggle adds state, storage and a control with no story). `<meta name="color-scheme" content="light dark">` and `color-scheme` per theme so native caret and autofill match.

### Layout
| Window | Page | Card | Fields | Result |
|--------|------|------|--------|--------|
| < 600 px (375, checked at 320) | padding 24 / 16 / 32 (top / sides / bottom) | full width, padding 24 / 20 | full width, stacked; error slot 2 lines | verdict directly under the score |
| ≥ 600 px (768, 1280) | padding 48 / 40 | max 520, centred, padding 32 / 40 / 40 | stacked, inputs max 240 px; error slot 1 line | verdict beside the score, gap line under both |

- One breakpoint, `@media (min-width: 600px)`; 768 and 1280 show the same card with more background. No horizontal scroll at 320 (mockup: scrollWidth 320).
- Order inside the card: eyebrow + h1 + subheading → Marks earned → Total marks possible → Pass mark → divider → "Score" + result body (the card ends here).
- **Reserved space** (nothing moves when results or errors appear): every field has an error slot below it with `min-height` = lines × 13 px × 1.4 (36.4 px narrow, 18.2 px wide; every M-12..M-24 fits); result body `min-height: var(--result-min-h)` holds the tallest real result: score + verdict + a 2-line gap line (narrow, measured 191 px) or score|verdict + 1-line gap line (wide, 98.5 px); heights come from fixed line-heights, so they do not depend on the font. Token today 196 / 112 px; 192 / 100 px once V-S2.1 lands. Card height and bottom edge identical in idle, result, pass-mark-empty and error states at each width.

### Components and states
| Component | States |
|-----------|--------|
| Text input | default: surface fill, 1 px field-border, 44 px high, value 17 px proportional · hover: field-border-hover · focus-visible: 2 px focus ring, 2 px offset (shows on mouse focus too; inputs always match `:focus-visible`) · filled: same as default · error: error border + 1 px inset error shadow (2 px look, no size change), `aria-invalid="true"` · disabled: n/a (fields are never disabled) |
| "%" suffix | muted 15 px, inside the pass mark input at right 12 px, `aria-hidden`; input right padding 32 px |
| Inline error | error colour 13 / 500, 16 px "!" disc icon + message text; empty slot keeps its height; at most one message per field (A-15) |
| Result body · idle | M-1 in muted 15 px; no score |
| Result body · result | score (64 / 300) + verdict block + gap line |
| Result body · pass mark empty | score + M-2 (muted 15 px) in the verdict slot; no verdict, no gap line, no error |
| Result body · error | "!" icon + M-3 in muted 15 px; no score, verdict or gap |
| Verdict block | inline-flex, padding 8 / 20 / 8 / 8, 1 px border in pass/fail, tint fill, radius 6; 40 px disc in pass/fail with a surface-coloured tick (Pass) or cross (Fail); word M-4 / M-5 40 / 600 in pass/fail. About 58 px tall next to the 64 px score. Never a pill, never colour alone |
| Gap line | 16 px icon + text 15 px: ▲ pass for M-8, M-9, M-11 · ▼ fail for M-6, M-7 · "=" pass for M-10. Icon is decorative; the words carry the meaning |

### Interaction
- Tab order follows the DOM: Marks earned → Total marks possible → Pass mark (ends there). No positive `tabindex`.
- Inputs: `type="text" inputmode="decimal" autocomplete="off" spellcheck="false"` (architect: not `type="number"`, which hides "abc", "17,5", "1e400" from validation and changes on scroll wheel).
- Live update on every `input` event (typing, paste, cut, autofill). No Calculate button (A-7). No autofocus on load.
- Errors appear on the `input` event that makes a value invalid and clear on the event that makes it valid (A-12..A-16); M-15 sits under marks earned but re-checks when total changes (S-3.8). Focus never moves because of an error.
- Enter: does nothing (no form submit, no reload, values unchanged). If a `<form>` is used, its submit is prevented.
- Escape does nothing. "Next learner" and Escape-to-reset are future S-4 (not built, DEC-17).

### Microcopy
Catalogue texts (verbatim, from `docs/user-stories.md`):

| Where | ID | Text |
|-------|----|------|
| Result body, idle | M-1 | "Enter marks earned and total marks possible to see the score." |
| Verdict slot, pass mark empty | M-2 | "Enter a pass mark to see whether this is a pass or a fail." |
| Result body, any error | M-3 | "The score will appear once every entry is valid." |
| Verdict | M-4 / M-5 | "Pass" / "Fail" |
| Gap line | M-6..M-11 | "{n} marks short of the pass mark" · "1 mark short of the pass mark" · "{n} marks above the pass mark" · "1 mark above the pass mark" · "Exactly on the pass mark" · "Less than 0.01 marks above the pass mark" |
| Under Marks earned | M-12..M-15 | as catalogued |
| Under Total marks possible | M-16..M-20 | as catalogued |
| Under Pass mark | M-21..M-24 | as catalogued |
| Button (future S-4, not built) | M-25 | "Next learner" |

**New strings for PO approval** (not in M-1..M-29; once approved, product-analyst adds them to the catalogue so `messages.ts` stays the single source):

| ID | Where | Proposed text |
|----|-------|---------------|
| N-1 | `<title>` | "Quiz score and pass-mark calculator" |
| N-2 | Eyebrow above heading | "Quiz score" |
| N-3 | Card heading (h1) | "Check a quiz result" |
| N-4 | Subheading | "A score at or above the pass mark is a pass." |
| N-5 / N-6 / N-7 | Field labels | "Marks earned" / "Total marks possible" / "Pass mark" |
| N-8 | Pass mark label, screen readers only | " (percent)" |
| N-9 | Pass mark suffix (visual) | "%" |
| N-10 | Result eyebrow | "Score" |
| N-11 | Hint beside the button (future S-4, not built) | "or press Esc" |

No placeholders and no field hints: the error messages already give examples ("like 17.5").

### Accessibility
- Every input has `<label for>`; `aria-describedby` → its error slot id (always present, empty when valid); `aria-invalid="true"` only while in error.
- Live announcements: a visually hidden `role="status"` node (`aria-live="polite"`, `aria-atomic="true"`) inside the result section. The visible result updates instantly; the status text is set 500 ms after the last `input` event and only when it differs from the last announcement, so typing "17.5" is announced once, not four times. Content: result → score, verdict word, gap line (e.g. "76.0%, Pass, 1.4 marks above the pass mark"); pass mark empty → score + M-2; error → each field's message, then M-3; idle → not announced (M-1 is visible only).
- Verdict is announced as its word; disc icons, gap arrows and "!" icons are `aria-hidden`.
- Focus ring: 2 px `--color-focus`, offset 2 px, ≥ 7.8:1 on surface and background; never `outline: none` without a replacement.
- Targets ≥ 44 × 44 px (inputs 44 high and full or 240 px wide).
- Never colour alone: errors = text + icon + thicker border; verdict = word + tick/cross; gap = words (+ arrow).
- `lang="en"`, one h1, result section labelled by its "Score" eyebrow; `<title>` "Quiz score and pass-mark calculator" (M-30).
- Zoom: the layout must hold at 200% text zoom (single column, no fixed heights except the min-heights above).

### Visual review checklist (CLAUDE.md §10; walk at 375 / 768 / 1280, light and dark)
- [ ] Alignment: labels, inputs, divider, score, verdict, gap line share one left edge
- [ ] Spacing consistency: only `--space-*` values; equal gaps between fields
- [ ] Type hierarchy: score > verdict > heading > body > labels, as in the type table
- [ ] Contrast: every pair in the contrast table holds in the build (spot-check with devtools)
- [ ] Focus states: visible ring on every input
- [ ] Error states: message under the right field, icon + text + border, M-3 in the result, no score
- [ ] Dark mode: tokens switch with `prefers-color-scheme`; no hard-coded colours
- [ ] Mobile layout: stacked, verdict under score, no horizontal scroll at 320
- [ ] Number formatting: "76.0%" one decimal, tabular numerals, gap numbers trimmed with comma thousands
- [ ] No layout shift: card height and bottom edge equal across idle, result, pass-mark-empty and error states
