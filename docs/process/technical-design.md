# Technical Design

_Stage 4 (Planning). Owner: solution-architect. Behaviour and exact text come from [user-stories.md](../user-stories.md); this file says how to build it._

## 1. Stack
- Node >=20 (`engines` ">=20", `.nvmrc` `20`), Vite, vanilla TypeScript (`strict`, plus `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`), Vitest. `build` = `tsc --noEmit && vite build`.
- Dev dependencies only: `vite`, `typescript`, `vitest`, `jsdom`. **No runtime dependencies**, no framework, no backend, no network call, no paid service, no API key.
- **Playwright is not a project dependency.** QA drives the pre-installed Chromium (`/opt/pw-browsers/chromium`) with throwaway scripts kept outside the repo.

## 2. Module layout (dependencies point down only: ui → validation → logic; messages is data)
| File | Responsibility | Public API (TypeScript) |
|---|---|---|
| `src/result.ts` | Typed result | `type Result<T, E> = { ok: true; value: T } \| { ok: false; error: E }` |
| `src/messages.ts` | The only user-facing text (§5) | `MESSAGES` (`as const`), `type MessageId = keyof typeof MESSAGES`, `BillErrorId`, `TipErrorId`, `PeopleErrorId` |
| `src/logic/split.ts` | Pure integer maths, no DOM, no text | `calculateTip(billCents: number, tipBasisPoints: number): number` · `splitEvenly(totalCents: number, people: number): { shares: Share[]; leftover: number }` · `calculateSplit(input: SplitInput): SplitResult` |
| `src/validation/parse.ts` | Raw string → typed value or message ID | `parseMoney(raw: string): Result<number /*cents*/, BillErrorId>` · `parsePercent(raw: string): Result<number /*basis points*/, TipErrorId>` · `parsePeople(raw: string): Result<number, PeopleErrorId>` |
| `src/validation/form.ts` | Validate all three fields together | `validateInputs(raw: RawInputs): Result<SplitInput, FieldErrors>` — evaluates **every** field (no short-circuit; S-4.3 needs two messages) |
| `src/ui/format.ts` | Pure presentation, no DOM | `formatAmount(cents: number): string` · `formatShareLine(index: number, share: Share): string` · `buildNote(totalCents: number, people: number, leftover: number): string` |
| `src/ui/app.ts` | DOM build, events, render only | `mountApp(root: HTMLElement): void` |
| `src/main.ts` | Entry | imports `./style.css`, calls `mountApp(document.querySelector('#app'))` |

Types: `SplitInput = { billCents: number; tipBasisPoints: number; people: number }` · `Share = { cents: number; extraCent: boolean }` · `SplitResult = { tipCents: number; totalCents: number; shares: Share[]; leftover: number }` · `RawInputs = { bill: string; tip: string; people: string }` · `FieldErrors = Partial<Record<'bill' | 'tip' | 'people', MessageId>>`.
Tests live in `tests/` mirroring `src/` (`tests/logic/split.test.ts`, `tests/validation/parse.test.ts`, `tests/validation/form.test.ts`, `tests/ui/format.test.ts`, `tests/ui/app.test.ts`, `tests/messages.test.ts`).

## 3. Data flow (all in `src/ui/app.ts`; handlers contain no maths)
- **Submit** (Calculate button, or Enter in any field via native form submission): `preventDefault()` → read the three raw strings → `validateInputs` → for each field show its message or clear it → if ok: `calculateSplit` → render; else clear the result.
- **Input event on field F (Q1, Q2):** (1) clear the result region at once (Q1: an edit hides the old result). (2) If F currently shows a message and F's own parser now returns `ok`, clear F's message (Q2). A message never appears or changes on input; only Calculate shows messages. Typed values are never changed by the app.
- **Render:** `Tip: {tip}`, `Total: {total}`, one `<li>` per share via `formatShareLine` (`Person 1: 38.34 (+0.01)`), then `buildNote`. Text is set with `textContent` only.
- **Stable hooks** for tests and QA: inputs `#bill`, `#tip`, `#people`; messages `#bill-msg`, `#tip-msg`, `#people-msg`; hint `#tip-hint`; result `#result` containing `#result-tip`, `#result-total`, `#result-shares` (`<ol>`), `#result-note`. "No result" = `#result` has no child nodes.

## 4. Decimal strategy
- **Representation:** bill in integer cents (`1 … 100_000_000`), tip in integer basis points (`0 … 10_000`; `12.55`% = `1255`), people integer `1 … 100`. No float is ever parsed, multiplied or displayed.
- **Tip:** `tipCents = Math.floor((billCents * tipBasisPoints + 5000) / 10000)` = half-up to the cent (all operands ≥ 0).
- **Safety:** max product `100_000_000 × 10_000 + 5000 = 1_000_000_005_000 ≈ 1e12` < `Number.MAX_SAFE_INTEGER ≈ 9.007e15`; total ≤ `200_000_000`. Every intermediate is an exact integer.
- **Total:** `totalCents = billCents + tipCents`.
- **Shares:** `base = Math.floor(totalCents / people)`, `leftover = totalCents % people`; shares `0 … leftover-1` get `base + 1` and `extraCent: true`, the rest `base` and `extraCent: false`. Sum = total by construction.
- **Format:** `whole = Math.floor(cents / 100)`, `frac = cents % 100`; output `String(whole)` with `/\B(?=(\d{3})+(?!\d))/g` → `,`, then `.` + `String(frac).padStart(2, '0')`. Integers only; no `toFixed`, no `Intl` (ADR-007).
- **Note:** `leftover = 0` → N-EVEN; `1` → N-ONE; `≥ 2` → N-MANY, with `{total}` = `formatAmount(totalCents)`, `{N}` = people, `{r}` = leftover.
- **Checked:** all 48 in-scope ACs recomputed with exactly this algorithm by a throwaway script at Stage 4: 0 mismatches.

## 5. Parsing rules and message catalogue
- **Money / percent** (one shared `parseDecimal2(raw, min, max)` returning hundredths; mapped to E-BILL-* or E-TIP-*). Order, first match wins:
  1. `s = raw.trim()` (also handles pasted spaces) → 2. `s === ''` → EMPTY → 3. `s.includes(',')` → COMMA → 4. `s.startsWith('-')` → NEGATIVE →
  5. `!/^(?:\d+\.?\d*|\.\d+)$/.test(s)` → FORMAT (rejects `+5`, `15%`, `1e400`, letters, `1.2.3`, inner spaces, `Infinity`, **a lone `.`**; accepts `.5`, `5.`) →
  6. fraction digits > 2 → DECIMALS → 7. strip leading zeros from the integer part; > 9 digits → RANGE (no huge `Number()`, 50-digit input safe) →
  8. `units = Number(int || '0') * 100 + Number(frac.padEnd(2, '0'))`; outside `min…max` → RANGE (bill `1…100_000_000`, tip `0…10_000`).
- **People:** trim → empty → EMPTY; `!/^\d+$/` → INVALID; strip leading zeros, empty or > 3 digits → INVALID; `n` outside `1…100` → INVALID. So `2.5`, `-3`, `+3`, `1e400`, `0`, `101`, 50 digits → INVALID; `007` → 7.
- `MESSAGES` keys and text (copied verbatim from the user-stories catalogue; `tests/messages.test.ts` asserts each string):

| ID | Text |
|---|---|
| E-BILL-EMPTY | Enter the bill amount, for example 84.50. |
| E-BILL-COMMA | Use a dot for decimals and no commas, for example 12.50. |
| E-BILL-NEGATIVE | The bill amount can't be negative. Enter an amount from 0.01 to 1000000.00. |
| E-BILL-FORMAT | Enter the bill amount using only digits and one dot, for example 84.50. |
| E-BILL-DECIMALS | Enter the bill amount with no more than 2 decimals, for example 84.50. |
| E-BILL-RANGE | Enter a bill amount from 0.01 to 1000000.00. |
| E-TIP-EMPTY | Enter a tip percentage from 0 to 100. Use 0 for no tip. |
| E-TIP-COMMA | Use a dot for decimals and no commas, for example 12.5. |
| E-TIP-NEGATIVE | The tip can't be negative. Enter a percentage from 0 to 100. |
| E-TIP-FORMAT | Enter the tip percentage using only digits and one dot, for example 12.5. |
| E-TIP-DECIMALS | Enter the tip percentage with no more than 2 decimals, for example 12.5. |
| E-TIP-RANGE | Enter a tip percentage from 0 to 100. |
| E-PEOPLE-EMPTY | Enter the number of people, for example 4. |
| E-PEOPLE-INVALID | Enter the number of people as a whole number from 1 to 100. |
| H-TIP-HINT | Use 0 for no tip. |
| N-EVEN | All shares are equal. |
| N-ONE | {total} does not divide evenly by {N}, so Person 1 pays 0.01 more than the others. |
| N-MANY | {total} does not divide evenly by {N}, so the first {r} people each pay 0.01 more than the others. |

## 6. Error strategy
- Parsers and `validateInputs` return `Result`; nothing throws to the UI. Logic functions take only validated integers and cannot fail.
- One catalogue (`src/messages.ts`); the UI looks text up by ID and never builds an error string. The apostrophe is the plain `'` (U+0027), as in the stories.
- **Never NaN / Infinity / undefined / blank, by construction:** parsers only call `Number()` on ≤ 9-digit ASCII digit strings; logic is integer-only within safe range; the UI renders only from an `ok` result, otherwise `#result` stays empty. Proven by T-G4 (sweep asserts every amount matches `^\d{1,3}(,\d{3})*\.\d{2}$` and no rendered text contains `NaN`, `Infinity` or `undefined`). No unreachable runtime guards (no dead code).

## 7. Accessibility and layout
- `<form novalidate autocomplete="off">` with a `<button type="submit">Calculate</button>`: Enter in any field submits natively; `novalidate` and no `required`/`pattern` keep browser bubbles out; `autocomplete="off"` stops Firefox restoring old values on reload (S-2.3).
- Each input has a `<label for>`: "Bill", "Tip %", "People". `type="text"`; `inputmode="decimal"` (Bill, Tip %) and `inputmode="numeric"` (People) (ADR-004).
- `aria-describedby`: Bill → `bill-msg`; Tip % → `tip-hint tip-msg`; People → `people-msg`. Showing a message sets `aria-invalid="true"`; clearing removes it.
- Each message `<p>` and `#result` are `aria-live="polite"`. Tip % starts with `value="0"`; `#tip-hint` always shows "Use 0 for no tip.".
- Visible focus: `:focus-visible { outline: 3px solid; outline-offset: 2px }`. Single column, `max-width: 32rem`, inputs `width: 100%`, font-size ≥ 16px (no iOS zoom), no horizontal scroll at 375px.

## 8. Hosting
- `.github/workflows/pages.yml` on push to `main`: checkout → setup-node (`node-version-file: .nvmrc`) → `npm ci` → `npm test` → `npm run build -- --base=/Web-Calculator/` → `actions/upload-pages-artifact` (`dist`) → `actions/deploy-pages`. Permissions `pages: write`, `id-token: write`.
- `vite.config.ts` keeps `base: '/'`, so `npm run dev` and `npm run preview` work at `/`. Live URL: https://sabeekhann.github.io/Web-Calculator/.
- **PO/Orchestrator action:** in the repo, Settings → Pages → Source: "GitHub Actions" (the workflow cannot enable this itself).

## 9. ADRs
**ADR-001 Stack and layout.** Context: 2–4 h budget, reviewers run it from the README on a clean machine. Decision: Vite + vanilla TS strict + Vitest, Node >=20, no runtime dependencies; layout per §2, which amends CLAUDE.md §9 by adding `src/result.ts`, `src/validation/form.ts` and `src/ui/format.ts` (pure formatting kept out of logic, which has no user text). Consequences: tiny bundle, nothing to configure, fast tests; the DOM code is hand-written, so it stays small.

**ADR-002 Money as integer cents, percent as basis points.** Context: floats give `0.30000000000000004`. Decision: parse strings straight to integer cents and integer basis points (§4); never `parseFloat`. Consequences: exact maths; max value `≈ 1e12` is far below `2^53`; limits from brief Q3 are enforced in validation.

**ADR-003 Rounding and remainder.** Context: tip and division leave fractions of a cent; brief Q1 decided half-up and first-shares. Decision: tip half-up via `floor((b × bp + 5000) / 10000)`; total split as `base` + 1 cent to the first `leftover` shares, flagged `extraCent`. Consequences: shares always sum to the total; deterministic (same input → same split); marker and note read the flag and `leftover`, never recompute.

**ADR-004 Validation approach.** Context: `type="number"` differs per browser (accepts `1e400`, hides commas, empty value for bad text). Decision: `type="text"` + `inputmode`, own grammar and precedence (§5), all fields validated on every Calculate, messages from the catalogue only; lone `.` → FORMAT; leading zeros allowed (`007` → 7). Consequences: identical behaviour in all four browsers and exact catalogue text; risk: on iOS in comma locales the `decimal` keypad may offer only `,` (open question to the PO).

**ADR-005 UI test environment.** Context: Q1/Q2 behaviours (hide on edit, clear while typing, markers, note) need DOM tests, not only logic tests. Decision: `jsdom` as a Vitest dev dependency, enabled per UI test file with `// @vitest-environment jsdom`; logic/validation tests stay in Node. Consequences: most ACs are automated in `npm test`; jsdom has no implicit submission, so ui-dom tests submit via the button's `click()` and the real Enter key, paste and 375px are confirmed by QA in Chromium.

**ADR-006 Hosting.** Context: the PO can't reach localhost from the cloud session; hosting must be free and keyless. Decision: GitHub Pages via Actions; the Pages base is passed only on the CLI (`--base=/Web-Calculator/`). Consequences: `main` is always live and tested before deploy; local dev/preview stay at `/`; Pages must be switched to "GitHub Actions" once by the PO.

**ADR-007 Number formatting.** Context: `toFixed` works on floats and `Intl.NumberFormat` output depends on locale and browser. Decision: own integer-only `formatAmount` (§4): dot decimals, comma thousands, no currency symbol. Consequences: identical output everywhere (`1,000,000.00`); formatting never changes the computed value.

## Developer notes
