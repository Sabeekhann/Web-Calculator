# Product Brief: Tip & Bill Splitter

_Stage 2 (Discovery). Owner: product-analyst. Status: approved by PO at GATE 2 (2026-10-07)._

## 1. Calculator choice and why
- **Choice:** a tip and bill splitter for people settling a shared restaurant or group bill.
- **Everyday, real problem with real money:** most adults split a bill regularly, and a wrong share causes real friction.
- **Small errors matter:** a share that is 1 cent off, or shares that don't add up to the bill, leave someone short or overpaying.
- **Rich, testable edge cases:** 0 people, negative tip, huge bills and leftover cents give precise acceptance criteria.
- **Fits the 2–4 hour budget:** a small logic core with clear inputs and outputs, so it can be finished, tested and documented properly.

## 2. Problem statement
When a group shares one bill, someone has to work out the tip and each person's share in their head, often in a hurry.
Mental maths and quick division produce shares that are rounded inconsistently and don't add up to the amount owed.
Nobody knows who should cover the leftover cent, so the group over-collects, under-pays or argues about small amounts.

## 3. Target users
- **The person settling up:** the one who collects money or pays the whole bill and must tell everyone what they owe.
- **A member of the group:** someone who wants to check that the share they've been asked for is fair.
- **Typical situations:** friends at a restaurant, colleagues at a team lunch, housemates sharing a takeaway, a family meal.
- **Context:** often on a phone, in a noisy place, under time pressure, with no wish to sign up for anything.

## 4. Scope
**In scope (MVP candidates; priority is set at Stage 4)**
- Enter a bill amount (up to 2 decimals).
- Enter a tip percentage, including 0%.
- Enter the number of people sharing the bill.
- See the tip amount, the total (bill + tip) and each person's share.
- Shares always add up exactly to the total, and it's clear which shares carry an extra cent.
- A specific message for every invalid input; the user can correct it and carry on.
- Recalculate after a result or an error without reloading the page.

**Out of scope (MVP)**
- Multiple currencies, currency conversion or currency symbols (amounts are plain 2-decimal numbers).
- Itemised or per-dish splitting; uneven or weighted shares (e.g. one person pays 50%).
- Tax calculation or tax-inclusive/exclusive handling.
- Saving history, favourites or settings between visits.
- User accounts, sign-in, payments or payment links.
- Network calls, analytics, trackers or any backend.
- Rounding each share up to a whole amount (see Q5).

## 5. Success criteria
| # | Criterion | How it's observed |
|---|---|---|
| SC-1 | Shares always sum exactly to the total | Automated tests: sum of shares in cents = total in cents for every tested case |
| SC-2 | Output is never NaN, Infinity, undefined or blank | Edge sweep (empty, letters, `1e400`, negatives, `0`, 50+ digits, pasted values) shows none of these |
| SC-3 | Every invalid input shows a specific message | Each rejection maps to one catalogue message; QA checks the exact text |
| SC-4 | An error message clears once the input is valid | QA: correct the input → message disappears and a result appears |
| SC-5 | Runs from the README alone | Clean-run check (`npm install`, `npm test`, `npm run build`) passes; no accounts, keys or paid services |
| SC-6 | Works in current Chrome, Edge, Firefox and Safari | PO manual browser checklist passes in all four |
| SC-7 | Usable at 375px width and by keyboard only | No horizontal scroll at 375px; every action reachable with Tab and Enter |
| SC-8 | The reference example is exact (rule per Q1) | `100.00` + `15`% tip, `3` people → tip `15.00`, total `115.00` → `38.34`, `38.33`, `38.33` (sum `115.00`) |

## 6. Constraints
- **D1:** runs in current Chrome, Edge, Firefox and Safari; no browser-specific features.
- **D2:** a reviewer starts it from the README alone; no paid accounts, API keys or cloud services.
- **D4:** invalid input and errors (e.g. 0 people, a division by zero) show a clear message, never a crash or a wrong result.
- **Time budget:** about 2–4 hours in total; a small app that fully works beats a big one that doesn't.
- **Tech:** Vite + vanilla TypeScript + Vitest, Node 20+. No framework, no backend, no network calls (CLAUDE.md §9).

## 7. Risks and mitigations
| Risk | Example | Mitigation |
|---|---|---|
| Floating-point accuracy | `0.1 + 0.2` gives `0.30000000000000004` | Parse inputs as strings into integer cents; tip % as integer basis points; all maths in integers |
| Rounding and leftover cents | `115.00 / 3` = `38.333…`; rounding every share gives `38.33` × 3 = `114.99` | Half-up to the cent; leftover cents go one at a time to the first shares (Q1); tests assert shares sum to the total |
| Input validation | Letters, `1e400`, negatives, 50+ digits, pasted `" 12.50 "` | Trim whitespace; reject letters, exponents, multiple dots and negatives; explicit maximums (Q3); one catalogue message each |
| Browser differences | Number inputs behave differently per browser; locale decimal comma `12,50` | Text input with our own validation instead of relying on `type="number"`; agree how `12,50` is handled (Q6); PO checks all four browsers |
| Scope creep vs time budget | Adding currencies, itemised splits or history | Out-of-scope list above; any new feature needs a story and PO approval; MoSCoW at Stage 4 |

## 8. Decisions (asked as open questions; all proposals approved by the PO at GATE 2)
1. **Q1 Leftover cents:** proposal is half-up rounding to the cent, with leftover cents given one at a time to the first shares (`100.00` + `15`%, `3` people → `38.34` / `38.33` / `38.33`). **Decided: yes, as proposed.**
2. **Q2 Tip base:** the tip is calculated on the bill amount as entered, with no tax handling. **Decided: yes, as proposed.**
3. **Q3 Limits:** proposed maximums are `100` people (whole numbers, minimum `1`), a bill of `1,000,000.00`, and a tip of `100`%. **Decided: yes, as proposed.**
4. **Q4 Tip precision:** whole-number tip % only, or decimals such as `12.5`%? **Decided: up to 2 decimals.**
5. **Q5 Round up:** should each share optionally round up to a whole amount? **Decided: out of MVP, future story.**
6. **Q6 Decimal comma:** reject `12,50` with a message asking for a dot, or accept it as `12.50`? **Decided: reject with a clear message.**
7. **Q7 Zero bill:** reject a bill of `0.00`, or allow it (all shares `0.00`)? **Decided: reject.**
