# Technical Design

Stage 5, solution-architect. Binding inputs: CLAUDE.md §11, `docs/user-stories.md` (S-1..S-3 built; S-4 cut, DEC-17; M-1..M-40), A-1..A-17, approved `ui-design.md`.

## Stack
- Node 20 LTS (`.nvmrc` `20`, `engines` `">=20"`); the build container runs Node 22, which satisfies it.
- Vite 6 (supports every Node 20 minor; Vite 7 needs ≥ 20.19), `base: './'` so the same build works locally and on GitHub Pages.
- TypeScript 5, `strict: true`, `noUncheckedIndexedAccess`, no `any`.
- Vitest 4.1.11 (node environment; supports Node ^20 || ^22 || >=24 and Vite ^6; see ADR-005 amendment), `@playwright/test` pinned to exactly `1.56.1` (browsers installed for that version), `@axe-core/playwright` (ADR-006), `@types/node` (types for config files only).
- **Zero runtime dependencies.** No network calls, fonts, CDNs, analytics or storage. System font stack only.

## Module map
| File | Layer | Responsibility |
|------|-------|----------------|
| `src/logic/arith.ts` | logic | `floorDiv`, `ceilDiv` for non-negative safe integers: `floorDiv(a,b) = (a - a % b) / b`, `ceilDiv = floorDiv + (a % b ? 1 : 0)` |
| `src/logic/score.ts` | logic | `scoreTenths(E,T)`, `isPass(E,T,P)` on scaled integers |
| `src/logic/gap.ts` | logic | `gap(E,T,P)` → `{kind:'exact'} \| {kind:'short',h} \| {kind:'above',h} \| {kind:'aboveTiny'}` (h = hundredths of a mark) |
| `src/logic/format.ts` | logic | `formatScore(tenths)` → "76.0"; `formatMarks(h)` → "699,999.99" / "0.6" / "6" (ADR-007) |
| `src/validation/parse.ts` | validation | `parseDecimal(raw, maxDp)` → `{ok:true,value:number\|null} \| {ok:false,code}`; `null` = empty; value is a scaled integer |
| `src/validation/validate.ts` | validation | `validateInputs({earned,total,pass})` → per-field results with range and cross-field (M-15) checks, A-15 order |
| `src/messages.ts` | — | M-1..M-40 verbatim, `errorText(field, code)`, `gapText(gap)` (fills `{n}`, singular when h = 100) |
| `src/ui/view-model.ts` | ui (pure) | `toViewModel(raw)` → `{state, fieldErrors, score, verdict, gapText, announcement}`; no DOM, unit-tested |
| `src/ui/dom.ts` | ui | `el`/`svgEl` element helpers used by render |
| `src/ui/render.ts` | ui | builds the card once from `messages.ts`; `apply(vm)` sets text, `aria-invalid`, classes; never calculates |
| `src/ui/app.ts` | ui | events (`input`, form `submit` prevented), focus, 500 ms announcement debounce |
| `src/main.ts` | entry | imports the 3 CSS files, `mountApp(document.getElementById('app'))` |
| `src/styles/tokens.css` · `base.css` · `components.css` | styles | tokens from ui-design.md (light `:root`, dark media query) · reset, page, type · card, field, error, result, verdict, gap |
| `index.html` | entry | `lang="en"`, viewport, `color-scheme` meta, `<title>` = M-30 (e2e asserts it equals `messages.ts`), `<div id="app">` |

Dependency direction: `ui → validation → logic`, `ui → messages`. Logic and validation never import from `ui` or touch `document`.

## Decimal strategy (ADR-002)
Every input becomes a **scaled integer** by string parsing (never `parseFloat`/`Number()` on the raw text):
- `E` = marks earned × 100, `T` = total × 100 (≤ 2 dp, A-4) · `P` = pass mark × 10 (≤ 1 dp, A-6).
- Parse: digits before the dot form the integer part, the fraction is right-padded to `maxDp` digits, `value = int × 10^maxDp + frac`.
- **Saturation:** if the integer part (leading zeros stripped) has more than 9 digits, value = `OVER_LIMIT` (10^12). It is above every limit, so it can only produce a range or M-15 error and never reaches arithmetic.

| Quantity | Exact formula (integers only) | Rounding |
|----------|-------------------------------|----------|
| Score in tenths of a percent | `s = floorDiv(E × 1000, T)`; shown as `⌊s/10⌋ + "." + s%10 + "%"` | down, 1 dp (A-3) |
| Verdict | Pass ⇔ `E × 1000 ≥ P × T` (exact score, A-1, A-2) | none |
| Gap numerator (marks × 10⁵) | `D = E × 1000 − P × T` | — |
| Shortfall (D < 0), hundredths | `h = ceilDiv(−D, 1000)` → never 0, so under 0.01 shows "0.01" | up, 2 dp (A-10) |
| Surplus (D > 0), hundredths | `h = floorDiv(D, 1000)`; h = 0 → M-11 | down, 2 dp (A-10) |
| Equal (D = 0) | M-10 | — |
| Future S-6: marks needed | `ceilDiv(P × T, 1000)` hundredths | up |

**Magnitude:** max E = max T = 1,000,000.00 → 100,000,000; max P = 1000. Largest product: `E × 1000` ≤ 1.0 × 10¹¹ and `P × T` ≤ 1000 × 10⁸ = 1.0 × 10¹¹; |D| ≤ 1.0 × 10¹¹. `Number.MAX_SAFE_INTEGER` = 9,007,199,254,740,991 ≈ 9.0 × 10¹⁵, so the headroom is about 90,000×. All values are exact in `number`; BigInt is not needed. `%` and the exact-multiple division in `floorDiv` are exact for safe integers.

**Spot-check** (python3 with these formulas; Node gives the same integers):
| AC | Input | E·1000 vs P·T | D | Shown |
|----|-------|---------------|---|-------|
| S-1.6 | 999999.99 of 1000000 @ 100 | 99,999,999,000 < 100,000,000,000 | −1,000 | "99.9%", Fail, "0.01 marks short" |
| S-2.5 | 16 / 17 of 23.33 @ 70 | 1,600,000 / 1,700,000 vs 1,633,100 | −33,100 / +66,900 | "0.34 marks short" / "0.66 marks above" |
| S-2.6 | 16.07 / 16.08 of 23 @ 69.9 | 1,607,000 / 1,608,000 vs 1,607,700 | −700 / +300 | "69.8%" Fail "0.01 marks short" / "69.9%" Pass M-11 |
| S-2.7 | 0.01 of 1000000 @ 70 | 1,000 vs 70,000,000,000 | −69,999,999,000 | "699,999.99 marks short" |
| S-1.4 | 2 of 3 @ 70 | floorDiv(200,000, 300) = 666 | — | "66.6%" (not "66.7%") |

All 30 numeric examples in S-1..S-4 were run through the script and match their ACs.

## Limits and number display
| Input | Scale | Min | Max | Max dp | Empty |
|-------|-------|-----|-----|--------|-------|
| Marks earned | ×100 | 0 | ≤ total (M-15) | 2 | M-1 in result, no error |
| Total marks possible | ×100 | > 0 (M-19) | 1,000,000 (M-20) | 2 | M-1 in result, no error |
| Pass mark | ×10 | 0 | 100 (M-24) | 1 | score shown + M-2, no verdict or gap |

- Score: always 1 dp, "%" suffix, range "0.0%".."100.0%" (no separators needed). Gap: `formatMarks(h)` = integer part with a comma every 3 digits (string regex, not `toLocaleString`/`Intl`, ADR-007), then "." + 2-digit fraction with trailing zeros trimmed ("0.60" → "0.6", "2.00" → "2"). Singular M-7/M-9 only when h = 100.
- Output is built only from these integers and catalogue strings, so NaN, Infinity, undefined or blank cannot appear.

## Validation (A-13..A-15)
Accepted text after `trim()`: `^-?(\d+\.?\d*|\.\d+)$`; empty after trim → `value: null`. Per field, first failing check wins:

| # | Check | Earned | Total | Pass mark |
|---|-------|--------|-------|-----------|
| 1 | Not a number (letters, ",", "$", "+", "e", 2+ dots, inner spaces, "-" without a valid number) | `NOT_NUMBER` → M-12 | M-16 | M-21 |
| 2 | Leading "-" before a valid number, incl. "-0" (A-14) | `NEGATIVE` → M-13 | M-17 | M-22 |
| 3 | Fraction digits as typed > max dp ("17.500" has 3) | `TOO_MANY_DP` → M-14 | M-18 | M-23 |
| 4 | Range | — | `ZERO` → M-19 · `TOO_LARGE` → M-20 | `TOO_LARGE` → M-24 |
| 5 | Earned > total, only when both pass 1–4 | `OVER_TOTAL` → M-15 (under earned) | — | — |

- Codes are a TypeScript union per field; `messages.ts` maps `(field, code)` → M-ID text. Nothing throws to the UI.
- Bare "." or "-" (Q-13, open): default = not a number (strict A-13 wording); one-line change if the PO prefers "treat as empty".

## State model
`toViewModel` is recomputed from the three raw strings on every event (no stored calculation state). Precedence top-down:

| State | Condition | Result area | Fields |
|-------|-----------|-------------|--------|
| error | any field has an error | "!" + M-3; no score, verdict, gap (A-16) | each invalid field shows its own message, `aria-invalid="true"` |
| idle | earned or total empty, no errors | M-1 | no messages |
| pass-mark-empty | earned + total valid, pass empty | score + M-2 in the verdict slot; no gap (A-12) | no messages |
| result | all three valid | score + verdict block (M-4/M-5) + gap line (M-6..M-11) | no messages |

Transitions: idle → result/pass-mark-empty as the last value becomes valid · result → error on any invalid edit · error → recovery: the message clears on the edit that makes the field valid (M-15 re-checks when total changes) and the result returns at once (S-3.8) · (future S-4, not built: any state → idle on Next learner / Escape, DEC-17). Reload → initial state (earned "", total "", pass "70"); inputs carry `autocomplete="off"` so Firefox does not restore values.

## Interaction and accessibility
- Inputs: `type="text" inputmode="decimal" autocomplete="off" spellcheck="false"` (ADR-003), `<label for>`, `aria-describedby` → error slot (always present), `aria-invalid` only while in error.
- Live update on every `input` event (typing, paste, cut, autofill); no Calculate button (A-7). Visual update is immediate.
- **Announcements:** accept the designer's 500 ms debounce, for the visually hidden `role="status"` node only; it announces only when the text differs from the last one. Content per ui-design.md §Accessibility. e2e waits with auto-retrying assertions, so tests stay deterministic.
- Enter: the `<form>` `submit` is prevented, so Enter never reloads or changes values.
- Next learner (A-17): **future S-4, not built (DEC-17).** No button or Esc hint in the UI. If built: click or Escape in marks earned → earned = "", recompute, focus earned, announce M-1; idempotent; `aria-keyshortcuts="Escape"`.
- WCAG 2.2 AA: tokens from ui-design.md (contrast computed there), 44 × 44 targets, visible focus ring, icon + text for errors and verdict, `prefers-reduced-motion`, no horizontal scroll at 320 px; axe in e2e (ADR-006).

## Architecture decisions (ADRs, proposed for PO approval at Gate 5)
| ADR | Decision | Alternatives considered | Reason |
|-----|----------|-------------------------|--------|
| ADR-001 | No UI framework: vanilla TypeScript + DOM, build the card once and update text | React/Preact, Svelte, Lit | One screen, 3 inputs, 4 states: a framework adds bundle, deps and concepts with no benefit; CLAUDE.md §11 |
| ADR-002 | Decimal strategy: scaled integers in `number`, exact integer formulas above | Floats + `toFixed`/epsilon; BigInt; decimal.js/big.js | Max magnitude 1 × 10¹¹ ≪ 9 × 10¹⁵ so `number` is exact; floats break the 69.96 vs 70 boundary; BigInt or a library is unneeded weight |
| ADR-003 | `<input type="text" inputmode="decimal">` + own string parser | `type="number"`; `pattern` attribute | `type="number"` hides "abc", "17,5", "1e400" from validation (value reads ""), differs by engine and changes on scroll; `inputmode` still shows the numeric keypad on phones |
| ADR-004 | Plain CSS in 3 files with custom-property tokens, no CSS framework or preprocessor | Tailwind, Sass, CSS Modules, CSS-in-JS | Tokens already specified; Vite bundles plain CSS natively; zero deps; easy dark mode via one media query |
| ADR-005 | Vitest 4.1.11 (node env, pure modules only) + Playwright 1.56.1 on Chromium, Firefox, WebKit; e2e runs against `vite build` + `vite preview` | Jest; jsdom/happy-dom DOM tests; Cypress | Vitest shares Vite's TS config; DOM behaviour is tested in real engines instead of a simulated DOM (no jsdom dep); Cypress has no WebKit, which D1 needs for Safari (amended 2026-10-08, see below) |
| ADR-006 | devDependency `@axe-core/playwright` (exact version locked) for an automated WCAG 2.2 AA check in e2e | Manual checks only; Lighthouse CI; pa11y | Runs inside the existing Playwright suite on all 3 engines, offline, no extra runner; dev-only, never shipped |
| ADR-007 | Own deterministic number formatter (comma every 3 digits via string regex) | `toLocaleString`, `Intl.NumberFormat('en-US')` | Output must be identical in every browser and OS locale; integers are already exact, so formatting is a 5-line pure function |
| ADR-008 | Zero runtime dependencies; Vite `base: './'` | Absolute base `/Web-Calculator/`; CDN-hosted libraries | Works from a local preview and any Pages sub-path without change; nothing to fetch at runtime (D2) |
| ADR-009 | Firefox + WebKit e2e (and Node 20) run in GitHub Actions `.github/workflows/ci.yml` on every push/PR: ubuntu-latest, Node from `.nvmrc`, `npm ci` → `npm audit` → `npm test` → `npm run build` → `npx playwright install --with-deps chromium firefox webkit` → `npx playwright test`, HTML report uploaded as an artifact. Local QA in the build container stays Chromium (DEC-13, PO-approved) | apt Firefox/WebKitGTK; another e2e tool (WebDriver); manual-only browser testing; paid cloud browser grid | Container proxy returns 403 for Playwright's browser hosts and the PO will not unblock them; Playwright can only drive its own patched builds, so stock apt browsers fail; WebDriver is new tooling, its drivers also need downloads and Linux has no Safari engine; manual-only is not repeatable (PO checks stay in addition); paid grids break the no-paid-services rule. Actions is free for public repos, needs no secrets, and runs the same pinned Playwright 1.56.1 |

| ADR-010 | GitHub Pages deploy via `.github/workflows/pages.yml`: on push to `main` (and manual dispatch), `npm ci` + `npm run build` in `sabee-khan-calculator/`, upload `dist/` (`base: './'`, ADR-008), `actions/deploy-pages`; D3 live URL in addition to the local run (DEC-17) | Local run only; Netlify/Vercel; `gh-pages` branch pushed by hand | Free for public repos, no secrets or third-party accounts, same Node 20 from `.nvmrc`; gives the PO real-browser checks (Q-4) |

- **ADR-005 amended 2026-10-08 (Sprint 0):** Vitest 3 → **4.1.11**.
  - Reason: `npm audit` on Vitest 3.2.7 reports 2 critical advisories (tinypool ≤ 2.1.0 / < 2.1.2 prototype-pollution gadget → RCE via worker/run options) and 1 moderate (`@vitest/mocker` path traversal, fixed in vitest ≥ 4.1.11). Vitest 4.1.11 supports Node ^20 || ^22 || >=24 and Vite ^6, so the Node 20 target and Vite 6 still hold. Dev-only dependency; nothing ships at runtime (ADR-008 unchanged).
  - Alternatives: stay on 3.2.7 and accept the dev-only advisories (rejected: known critical advisories in the toolchain for no benefit); Vitest 5 (rejected: requires Node ≥ 22.12, breaking the Node 20 LTS target).
