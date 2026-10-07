# Test Plan

_Stage 4 (Planning). Owner: solution-architect. Approved by PO at GATE 4 (2026-10-07). ACs from [user-stories.md](../user-stories.md); design from [technical-design.md](technical-design.md)._

## 1. Levels and conventions
| Level | Tool | Covers |
|---|---|---|
| unit-logic | Vitest (Node) | Pure functions: `src/logic/split.ts` and `src/ui/format.ts` (amounts, markers, note text) |
| unit-validation | Vitest (Node) | `parseMoney`, `parsePercent`, `parsePeople`, `validateInputs` → value or exact message ID |
| ui-dom | Vitest + jsdom | `mountApp` in jsdom: set values, fire `input` events, click Calculate, read `#result`, `#*-msg`, `aria-*` |
| scripted-browser | QA Playwright, Chromium | Real keyboard (Enter), real typing/paste, 375px, screenshots `S-x_AC-n.png` |
| MANUAL | PO in a real browser | Only what needs a human: Edge/Firefox/Safari rendering, how the focus ring looks |

- Every test name starts with its ID (`T-S2.8 …`). One ID may appear in several files (e.g. logic and ui-dom).
- QA independently re-checks **every** in-scope AC in scripted-browser (CLAUDE.md §10); the Level column lists the automated levels, plus scripted-browser where only a real browser can prove the AC.
- ui-dom tests assert a share line by its start (`Person 1: 33.34`) unless the AC is about the marker, so later stories don't break earlier tests.
- "No result" = `#result` has no child nodes. "Message next to X" = `#x-msg` has exactly the catalogue text and `#x` has `aria-invalid="true"`.

## 2. AC → test map (55 ACs)
| AC | Test ID | Level | What is asserted | Reason if MANUAL |
|---|---|---|---|---|
| S-1.1 | T-S1.1 | unit-logic + ui-dom | `calculateSplit(10000,0,3)` shares 3334/3333/3333, sum 10000; UI Total `100.00`, Persons `33.34`, `33.33`, `33.33` | — |
| S-1.2 | T-S1.2 | unit-validation + ui-dom | `parseMoney('12,50')` → E-BILL-COMMA; UI `#bill-msg` text, no result | — |
| S-1.3 | T-S1.3 | unit-validation + ui-dom | `parsePeople('101')` → E-PEOPLE-INVALID; UI `#people-msg` text, no result | — |
| S-1.4 | T-S1.4 | unit-validation + ui-dom | `parseMoney('0.00')` → E-BILL-RANGE; UI `#bill-msg` text, no result | — |
| S-1.5 | T-S1.5 | unit-logic + ui-dom | `formatAmount(100000000)` = `1,000,000.00`; UI Total and only `Person 1: 1,000,000.00` (1 line) | — |
| S-1.6 | T-S1.6 | unit-logic + ui-dom | shares 1/0/0; UI Total `0.01`, Persons `0.01`, `0.00`, `0.00` | — |
| S-1.7 | T-S1.7 | ui-dom | after S-1.1 result, people `4` + Calculate → exactly 4 lines, each `25.00`, Total `100.00` | — |
| S-1.8 | T-S1.8 | ui-dom + scripted-browser | after COMMA message, bill `12.50` + `input` event → `#bill-msg` empty, `aria-invalid` gone, before Calculate; then Total `12.50`, `6.25`, `6.25` | — |
| S-2.1 | T-S2.1 | unit-logic + ui-dom | tip 1500 cents, total 11500, shares 3834/3833/3833; UI Tip `15.00`, Total `115.00` | — |
| S-2.2 | T-S2.2 | unit-logic + ui-dom | `calculateTip(30,1500)` = 5 (0.045 half-up); UI Tip `0.05`, Total `0.35`, Person 1 `0.35` | — |
| S-2.3 | T-S2.3 | ui-dom | on mount `#tip` value `0`, `#tip-hint` = "Use 0 for no tip.", `#tip` `aria-describedby` includes `tip-hint`; bill `50.00`, people `2` → Tip `0.00`, Total `50.00`, `25.00` ×2 | — |
| S-2.4 | T-S2.4 | unit-validation + ui-dom | `parsePercent('100.01')` → E-TIP-RANGE; UI `#tip-msg`, no result | — |
| S-2.5 | T-S2.5 | unit-logic + ui-dom | tip 100000000, total 200000000, shares 66666667/66666667/66666666; UI `1,000,000.00`, `2,000,000.00`, `666,666.67` ×2, `666,666.66` | — |
| S-2.6 | T-S2.6 | unit-validation + ui-dom | `parsePercent('-5')` → E-TIP-NEGATIVE; UI `#tip-msg`, no result | — |
| S-2.7 | T-S2.7 | ui-dom | after S-2.1 result, tip `12.5` + Calculate → Tip `12.50`, Total `112.50`, 3 × `37.50` | — |
| S-2.8 | T-S2.8 | unit-validation + ui-dom | `parsePercent('12.555')` → E-TIP-DECIMALS, `'12.55'` → 1255; UI message then tip `12.55` + Calculate → message gone, Tip `12.55`, Total `112.55`, `37.52`, `37.52`, `37.51` | — |
| S-3.1 | T-S3.1 | unit-logic + ui-dom | `extraCent` true/false/false; lines exactly `Person 1: 38.34 (+0.01)`, `Person 2: 38.33`, `Person 3: 38.33` | — |
| S-3.2 | T-S3.2 | unit-logic + ui-dom | leftover 0, no `extraCent`; 4 lines `30.00`, no line contains `(+0.01)` | — |
| S-3.3 | T-S3.3 | unit-logic + ui-dom | leftover 99; lines 1–99 exactly `Person n: 10,000.00 (+0.01)`, line 100 exactly `Person 100: 9,999.99`; sum 99999999 | — |
| S-3.4 | T-S3.4 | unit-logic + ui-dom | lines exactly `Person 1: 0.01 (+0.01)`, `Person 2: 0.00`, `Person 3: 0.00` | — |
| S-3.5 | T-S3.5 | unit-logic + ui-dom | 1 line exactly `Person 1: 33.33`, no marker | — |
| S-3.6 | T-S3.6 | unit-validation + ui-dom | `parsePeople('abc')` → E-PEOPLE-INVALID; `#result-shares` absent, no `(+0.01)` in page | — |
| S-3.7 | T-S3.7 | ui-dom | after S-3.1 result, people `4` + Calculate → 4 lines exactly `Person n: 28.75`, no marker | — |
| S-3.8 | T-S3.8 | ui-dom | people `0` → message; people `3` + Calculate → `#people-msg` empty, S-3.1 lines exactly | — |
| S-4.1 | T-S4.1 | ui-dom + scripted-browser | after result, bill `110.00` + `input` event → `#result` empty at once; submit → `#tip` `15`, `#people` `3`, Tip `16.50`, Total `126.50`, `42.17`, `42.17`, `42.16`. QA: real Enter key in Bill | — |
| S-4.2 | T-S4.2 | ui-dom | after result, bill emptied + Calculate → E-BILL-EMPTY in `#bill-msg`, no result, `#tip` `15`, `#people` `3` | — |
| S-4.3 | T-S4.3 | unit-validation + ui-dom | `validateInputs` errors `{bill: E-BILL-FORMAT, people: E-PEOPLE-EMPTY}` (no short-circuit); both messages shown, no result | — |
| S-4.4 | T-S4.4 | ui-dom | bill `100.00` + Calculate → `#bill-msg` empty, `#people-msg` still E-PEOPLE-EMPTY, no result | — |
| S-4.5 | T-S4.5 | ui-dom | people `3` + Calculate → no message anywhere, Tip `15.00`, Total `115.00`, `38.34`, `38.33`, `38.33` | — |
| S-4.6 | T-S4.6 | unit-logic + ui-dom | 100 shares of 115, leftover 0; UI Total `115.00`, 100 lines each `1.15` | — |
| S-4.7 | T-S4.7 | unit-validation + ui-dom | 50-digit bill → E-BILL-RANGE (no `Number()` overflow); UI message, no result, `#tip` `15`, `#people` `3` | — |
| S-4.8 | T-S4.8 | unit-logic + ui-dom | `calculateTip(1,1500)` = 0; UI Tip `0.00`, Total `0.01`, `0.01`, `0.00`, `0.00` | — |
| S-5.1 | T-S5.1 | unit-logic + ui-dom | tip 845, total 9295, shares 2324 ×3, 2323; UI Tip `8.45`, Total `92.95` | — |
| S-5.2 | T-S5.2 | ui-dom + scripted-browser | Calculate 3 times → identical `#result` text each time; QA: repeated Enter | — |
| S-5.3 | T-S5.3 | unit-validation + ui-dom + scripted-browser | `'  84.50 '`, `' 10'`, `'4 '` parse to 8450/1000/4; UI no message, S-5.1 result; QA: real paste (`insertText`) | — |
| S-5.4 | T-S5.4 | unit-validation + ui-dom | `parsePercent('1e400')` → E-TIP-FORMAT; UI message, no result | — |
| S-5.5 | T-S5.5 | unit-validation + ui-dom | `parseMoney('-84.50')` → E-BILL-NEGATIVE; UI message, no result | — |
| S-5.6 | T-S5.6 | unit-validation + ui-dom | `parseMoney('1000000.01')` → E-BILL-RANGE; UI message, no result | — |
| S-5.7 | T-S5.7 | unit-logic + ui-dom | shares 1/1/1/0; UI Total `0.03`, `0.01` ×3, `0.00` | — |
| S-5.8 | T-S5.8 | ui-dom | after S-5.4 message, tip `10` + Calculate → `#tip-msg` empty, S-5.1 result | — |
| S-6.1 | T-S6.1 | unit-logic + ui-dom | `buildNote(11500,3,1)` and `#result-note` = N-ONE text with `115.00`, `3` | — |
| S-6.2 | T-S6.2 | unit-logic + ui-dom | shares 101 ×99, 100; note = N-MANY with `100.99`, `100`, `99` | — |
| S-6.3 | T-S6.3 | unit-logic + ui-dom | `buildNote(3333,1,0)` = "All shares are equal." | — |
| S-6.4 | T-S6.4 | unit-logic + ui-dom | note = N-MANY with `2,000,000.00`, `3`, `2` | — |
| S-6.5 | T-S6.5 | unit-logic + ui-dom | note = N-ONE with `0.01`, `3` | — |
| S-6.6 | T-S6.6 | ui-dom | people empty → E-PEOPLE-EMPTY in `#people-msg`, `#result-note` absent | — |
| S-6.7 | T-S6.7 | ui-dom | after S-6.1 result, people `5` + Calculate → 5 lines `23.00`, note "All shares are equal." | — |
| S-6.8 | T-S6.8 | ui-dom | after S-6.6 message, people `3` + Calculate → message gone, note = S-6.1 text | — |
| S-7.1 | — | Future — not in scope | — | Could (future); not built this release |
| S-7.2 | — | Future — not in scope | — | Could (future); not built this release |
| S-7.3 | — | Future — not in scope | — | Could (future); not built this release |
| S-8.1 | — | Future — not in scope | — | Could (future); not built this release |
| S-8.2 | — | Future — not in scope | — | Could (future); not built this release |
| S-9.1 | — | Future — not in scope | — | Won't this release |
| S-9.2 | — | Future — not in scope | — | Won't this release |

**Global-rule tests (built with S-1; not ACs, so not counted):** T-G1 editing any field after a result empties `#result` at once (ui-dom) · T-G2 messages never appear or change on `input`, only on Calculate (ui-dom) · T-G3 Enter in each field calculates (scripted-browser; ui-dom asserts the fields sit in a `<form>` with a submit button) · T-G4 no NaN/Infinity/undefined/blank over the §3 sweep and the bounds (unit + ui-dom) · T-G5 same inputs → same split (unit-logic) · T-G6 every `MESSAGES` string equals the catalogue (unit) · T-G7 labels, `aria-describedby`, `aria-invalid`, `aria-live` present (ui-dom).

## 3. Edge-case sweep (CLAUDE.md §10; T-E rows in `tests/validation/parse.test.ts`, QA repeats in Chromium)
| Input (after typing) | Bill | Tip % | People |
|---|---|---|---|
| `` (empty) | E-BILL-EMPTY | E-TIP-EMPTY | E-PEOPLE-EMPTY |
| `   ` (spaces) | E-BILL-EMPTY | E-TIP-EMPTY | E-PEOPLE-EMPTY |
| `abc` | E-BILL-FORMAT | E-TIP-FORMAT | E-PEOPLE-INVALID |
| `1e400` | E-BILL-FORMAT | E-TIP-FORMAT | E-PEOPLE-INVALID |
| `-5` | E-BILL-NEGATIVE | E-TIP-NEGATIVE | E-PEOPLE-INVALID |
| `0` | E-BILL-RANGE | valid (tip `0.00`) | E-PEOPLE-INVALID |
| 50 × `1` (50 digits) | E-BILL-RANGE | E-TIP-RANGE | E-PEOPLE-INVALID |
| pasted `  84.50 ` / ` 10` / `4 ` | valid `84.50` | valid `10` | valid `4` |
| `12,50` | E-BILL-COMMA | E-TIP-COMMA | E-PEOPLE-INVALID |
| `1.2.3` | E-BILL-FORMAT | E-TIP-FORMAT | E-PEOPLE-INVALID |
| `+5` / `15%` / `.` / `1 000` / `Infinity` | E-BILL-FORMAT | E-TIP-FORMAT | E-PEOPLE-INVALID |
| `.5` / `5.` | valid `0.50` / `5.00` | valid `0.5` / `5` | E-PEOPLE-INVALID |
| `12.555` / `0.001` | E-BILL-DECIMALS | E-TIP-DECIMALS | E-PEOPLE-INVALID |
| `-1,5` (precedence) / `-abc` | E-BILL-COMMA / E-BILL-NEGATIVE | E-TIP-COMMA / E-TIP-NEGATIVE | E-PEOPLE-INVALID |
| `100.01` / `1000000.01` | valid / E-BILL-RANGE | E-TIP-RANGE / E-TIP-RANGE | E-PEOPLE-INVALID |
| `2.5` / `101` / `100` / `007` | valid / valid / valid / valid | valid / E-TIP-RANGE / valid / valid | E-PEOPLE-INVALID / E-PEOPLE-INVALID / valid / valid `7` |

- **Repeated Enter:** 5 × Enter with valid inputs → identical result each time, no duplicates (T-S5.2).
- **Recovery after an error:** every message above clears once the field is valid (on input) and the next Calculate shows a result (T-S1.8, T-S2.8, T-S3.8, T-S5.8, T-S6.8).
- **Every row:** never NaN, Infinity, undefined, blank output or a console error (T-G4; QA checks the console).

## 4. Manual browser checklist (PO, per release; MANUAL)
For each of **Chrome, Edge, Firefox, Safari** (current versions), open https://sabeekhann.github.io/Web-Calculator/:
| # | Check | Steps → expected |
|---|---|---|
| 1 | Page loads | Bill, Tip % (shows `0`, hint "Use 0 for no tip."), People and Calculate are visible |
| 2 | Normal calculation | `100.00`, `15`, `3`, Calculate → Tip `15.00`, Total `115.00`, `Person 1: 38.34 (+0.01)`, `38.33`, `38.33`, note |
| 3 | Error shows and clears | People `0`, Calculate → People message; type `3` → message disappears; Calculate → result |
| 4 | Keyboard only | Tab through all fields to Calculate; focus ring clearly visible on each; Enter in any field calculates |
| 5 | 375px layout | Narrow the window (or a phone) → everything readable, no sideways scrolling |
| 6 | No console errors | Developer tools → Console shows no errors after steps 1–5 |

## 5. Count summary
- ACs in user-stories.md: **55** (S-1…S-6: 8 each = 48 in scope; S-7: 3, S-8: 2, S-9: 2 = 7 future).
- ACs mapped above: **55** (48 with test IDs, 7 "Future — not in scope"). MANUAL among ACs: 0 (manual checks are the §4 checklist).
- Untestable ACs as written: **none**. Wording notes for the PO (no change made): S-4.1 "hidden at once" is tested as "empty right after the `input` event"; S-5.3 "pasted" is tested by value in Vitest and by a real paste in Chromium.
