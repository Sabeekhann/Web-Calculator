# Product Brief — Quiz Score & Pass-Mark Calculator

> Stage 2. Choice recorded as DEC-6. Open questions Q-5 to Q-12 and proposed assumptions A-1 to A-8 are in `decision-log.md`.

## Choice and reasons
**Option A: Quiz score and pass-mark calculator** (chosen by the PO, DEC-6).
- **Fits the company:** learners and instructors are KnowledgeCity's everyday users.
- **Roles that differ:** the Learner wants a verdict and the gap to the pass mark; the Instructor wants a consistent, defensible percentage.
- **Edge cases come from the domain:** 0 possible marks (÷0), earned > possible, rounding at the pass boundary.
- **Small and safe for 2–4 h:** 3 inputs, about 3 Must stories, no currency or locale formatting.
- **Fresh:** does not repeat the earlier bill-splitter attempt (`fe7cc3f`).

## Problem statement
Quiz results arrive as raw marks ("17.5 of 23"), which do not say whether the person passed or by how much. Working out the percentage and comparing it with the pass mark by hand is slow and error-prone, and a slip on a borderline score (69.96% against a 70% pass mark) can turn a fail into a pass, or the reverse.

## Target users
Draft; final wording in Stage 3a (`docs/app-roles.md`).
- **R-1 Learner:** an employee on a compliance course checking a quiz result before a resit deadline; needs a clear pass/fail and how far from the pass mark they are.
- **R-2 Instructor:** a course instructor marking short-answer assessments by hand; needs the same percentage and verdict, worked out the same way, for every learner.

## In scope
- Three inputs: marks earned, total marks possible, pass mark (%).
- Score as a percentage, at the precision agreed in Q-7.
- Pass/fail verdict by the rule agreed in Q-5 and Q-6.
- Marks short of, or above, the pass mark.
- A clear inline message for every invalid input: empty, letters, symbols, multiple decimal points, negative, too many decimals, 0 possible marks, earned > possible, pass mark outside 0–100, above the maximum.
- Keyboard use, light and dark themes, responsive from 375 px.

## Out of scope
- Saving, storing, exporting or printing scores.
- Accounts, sign-in or any learner identity.
- Multiple learners at once, batch or CSV import.
- Weighted sections, negative marking, curving, bonus marks (earned > possible, see Q-12).
- Grade letters (A–F): may be proposed as a future story, Not implemented.
- Locale number formats (decimal comma "17,5", thousands separators on input).
- Any backend, network call, analytics or paid service.

## Success criteria
- Every Must story Implemented, with every AC PASS in the QA report on Chromium, Firefox and WebKit.
- No NaN, Infinity, undefined or blank output reachable from any input in the QA edge sweep.
- Every invalid input shows its own message from `messages.ts`; 0 crashes, 0 console errors or warnings.
- Boundary cases quoted in the ACs give the agreed verdict exactly (e.g. 69.96% vs a 70% pass mark).
- A reviewer goes from clean clone to running app in ≤ 5 commands from the README.
- WCAG 2.2 AA: text contrast ≥ 4.5:1, fully keyboard-operable, results and errors announced (aria-live); no horizontal scroll at 320 px.

## Constraints
- **D1:** runs in current Chrome, Edge, Firefox and Safari (tested on Chromium, Firefox, WebKit).
- **D2:** runs locally from the README; no paid accounts, API keys, cloud services or backend.
- **D5:** invalid input and errors (e.g. 0 possible marks) give a clear message, never a crash or a wrong result.
- **D6:** polished UI per the approved design spec; 375 px and up; light and dark; WCAG 2.2 AA.

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Floating-point accuracy | Artefacts such as "76.08695652173913%" or a ratio that lands a hair below the pass mark | Decimal strategy fixed by ADR in Stage 5 (e.g. compare scaled integers); round only for display; unit tests assert exact strings |
| Rounding at the pass boundary | 69.96% shown as "70.0%" next to "Fail" looks contradictory, or a fail flips to a pass | PO settles Q-5, Q-6, Q-7 before Stage 3c; ACs quote boundary cases (69.96%, 70%, 70.04%) exactly |
| Validation gaps | Crash or wrong result on empty, letters, "1e400", "-0", negatives, earned > possible, 0 possible | Typed validation results with one error code per rule; one AC and one message per rule; QA edge sweep (CLAUDE.md §12) |
| Browser number-input differences | `type="number"` differs by engine (Firefox accepts letters, "e" and "-" allowed, invalid text reads as ""), so the same input behaves differently | Input approach decided by ADR in Stage 5 (e.g. text field with `inputmode="decimal"` and own parsing); e2e on all 3 engines |
| Time budget (2–4 h) | Stories unfinished or untested | About 3 Must stories; cut Should stories first, never quality; close open questions at Gate 2 to avoid rework |

## Options considered (Stage 2)

### Option A: Quiz score and pass-mark calculator
- **Target users:** a learner on a corporate compliance course checking a quiz result before a resit deadline; a course instructor marking short-answer assessments by hand.
- **Problem:** raw marks like "17.5 of 23" do not say whether the person passed, and doing the sum by hand risks a wrong pass/fail call on borderline scores.
- **Roles (2):** R-1 Learner (did I pass, and by how much did I miss?); R-2 Instructor (record a consistent, defensible percentage and verdict for each learner).
- **Edge cases:** total possible = 0 (division by zero); marks earned > marks possible; negative marks; half marks (17.5); pass mark of 0% or 100%, or above 100%; rounding at the boundary (69.96% shown as "70.0%" must not flip a fail into a pass); very large totals (1,000,000 points); non-terminating results (2/3 = 66.7%).
- **Fit for 2–4 h:** 3 inputs (earned, possible, pass mark %); about 3 Must stories (score %, pass/fail verdict, marks short of or above the pass mark) plus 1 Should; main risk: agreeing the rounding and "≥ pass mark" rule up front.
- **Why it shows product thinking:** it is close to KnowledgeCity's own field, and the borderline-rounding rule is a real fairness decision, not just arithmetic.

### Option B: Training cost-per-learner calculator
- **Target users:** an L&D coordinator in a 200-person company planning a cohort; a department head deciding whether last quarter's course was worth renewing.
- **Problem:** training budgets are approved per head, but invoices arrive as one lump sum, so nobody can quickly see the cost per enrolled learner or per learner who finished.
- **Roles (2):** R-1 L&D Coordinator (plans before the course: cost per seat); R-2 Department Head (reviews after the course: cost per completion and completion rate).
- **Edge cases:** 0 enrolled (division by zero); 0 completions (cost per completion undefined, so a message is shown instead of "Infinity"); completions > enrolled; fractional learners (12.5); currency rounding (100.00 ÷ 3 = 33.33); very large budgets (999,999,999.99); very small costs (0.01 ÷ 3).
- **Fit for 2–4 h:** 3 inputs (total cost, enrolled, completed); about 3 Must stories (cost per learner, cost per completion, completion rate); main risk: reviewers may find the roles less familiar, and currency formatting/locale needs a firm rule.
- **Why it shows product thinking:** it speaks to the buyer of corporate training, and the two roles use the same numbers at different moments (planning vs reviewing).

### Option C: Bill and tip splitter
- **Target users:** a team lead paying for a team lunch on one card; a colleague checking what they owe before sending a transfer.
- **Problem:** splitting a bill plus tip by hand produces shares that don't add up to the total, and someone ends up out of pocket.
- **Roles (2):** R-1 Payer (needs the total with tip and a fair split that adds up exactly); R-2 Diner (needs their own share, quickly, on a phone).
- **Edge cases:** 0 people (division by zero); fractional people (2.5); tip of 0% or 100%+; remainder cents (100.00 ÷ 3 = 33.34 + 33.33 + 33.33); very large bills; very small bills (0.01 split 3 ways).
- **Fit for 2–4 h:** 3 inputs (bill, tip %, people); about 3 Must stories (tip and total, split per person, rounding remainder); main risk: it repeats the previous attempt in this repo's history (`fe7cc3f`) and is the most common take-home choice.
- **Why it shows product thinking:** the "shares must add up to the total" rule is a real fairness problem, but the domain is generic.

### Comparison

| Option | Users | Roles | Edge-case richness | Build risk | Fit for 2–4 h |
|--------|-------|-------|--------------------|------------|---------------|
| A Quiz score | Learners, instructors | 2 (Learner, Instructor) | High: ÷0, earned > possible, boundary rounding, half marks | Low: needs rounding rule agreed | Good: 3 inputs, ~3 Must |
| B Training cost | L&D coordinators, department heads | 2 (Coordinator, Head) | High: two ÷0 cases, completions > enrolled, currency rounding | Medium: role realism, currency rule | Good: 3 inputs, ~3 Must |
| C Bill splitter | Team lunch payers, diners | 2 (Payer, Diner) | Medium: ÷0, remainder cents | Low technical; high "seen it before" risk | Good: 3 inputs, ~3 Must |

## Recommendation (accepted by PO)

**Option A: Quiz score and pass-mark calculator.**
- **Fits the company:** learners and instructors are KnowledgeCity's everyday users, so the role and job choices are easy to justify in the README and the interview.
- **Roles that differ:** the Learner wants a verdict and the gap to the pass mark; the Instructor wants a consistent, defensible percentage. These are different people with different needs, as the brief asks.
- **Edge cases arise naturally:** division by zero (0 possible marks), impossible input (earned > possible) and boundary rounding all come straight from the domain, which gives D5 and D15 real substance.
- **Small and safe:** 3 inputs, about 3 Must stories, no currency or locale formatting, and pure integer/decimal arithmetic that is easy to test exactly.
- **Fresh:** it does not repeat the earlier bill-splitter attempt in this repo's history.
