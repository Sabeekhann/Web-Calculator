# Decision Log

Decisions (DEC-x), open questions (Q-x) and assumptions (A-x). An assumption goes into the README only after PO approval. Architecture decisions are ADRs in `technical-design.md`.

## Decisions

| ID | Date | Decision | Decided by | Reason |
|----|------|----------|-----------|--------|
| DEC-1 | 2026-10-08 | Work runs in a Claude Code **cloud session** (launched from the desktop app), not a local desktop session. All work is pushed to `Sabeekhann/Web-Calculator`. | PO | PO instruction at Preflight |
| DEC-2 | 2026-10-08 | Commits authored as `Sabee Khan <sabeekhan99@gmail.com>`, with a Claude co-author trailer. | PO | PO answer at Preflight |
| DEC-3 | 2026-10-08 | Previous attempt cleared from `main` in commit `cccb670`; it stays in history at `fe7cc3f`. Old `feat/S-1..3` branches (all merged into `fe7cc3f`) to be deleted. | PO | Fresh start (Stage 1.2) |
| DEC-4 | 2026-10-08 | README tool line: "Claude Code (cloud session, launched from the desktop app), Claude Opus 5.5, with 7 subagents defined in `.claude/agents/`". | PO | PO answer at Preflight |
| DEC-5 | 2026-10-08 | Calculator choice: Stage 2 proposes 3 options with a recommendation; PO chooses one that is doable in the time budget. | PO | Part C left blank |
| DEC-6 | 2026-10-08 | Calculator choice: Option A, Quiz score and pass-mark calculator. | PO | Best fit for KnowledgeCity's users, two roles with different needs, edge cases that come from the domain, small enough for 2–4 h (see `product-brief.md`). |
| DEC-7 | 2026-10-08 | Q-5..Q-12 answered with the recommended answers; Q-7 changed to round-down display. Assumptions A-1..A-8 approved. | PO | Gate 2 approval |

## Open questions

| ID | Raised | Question | Owner | Status |
|----|--------|----------|-------|--------|
| Q-1 | Stage 1 | Role applied for, HR contact name/email, deadline and expected submission date (for D18 and D20). | PO | Open |
| Q-2 | Stage 1 | The session's git proxy returns HTTP 403 for tag pushes and branch deletions. Archive tag `archive/pre-fresh-start` (→ `fe7cc3f`), deleting `feat/S-1..3`, and the `v1.0.0` tag in Stage 9 must be done by the PO in the GitHub web UI, or the plan must change. | PO | Open |
| Q-3 | Stage 1 | Transcripts (D9): this container's raw logs in `~/.claude/projects/` disappear when the session ends. The PO must run `/export` before then; the Orchestrator may copy the raw log files unchanged into `transcripts/` only with PO approval. | PO | Open |
| Q-4 | Stage 1 | `localhost` dev-server URLs can't be reached from the PO's browser. PO checks run via a GitHub Pages URL or a local run on the PO's machine; agents use headless Chromium screenshots. | PO | Open |
| Q-5 | Stage 2 | Pass rule: is it a pass when the score is greater than or equal to the pass mark (exactly 70% with a 70% pass mark passes)? **Recommended:** yes, score ≥ pass mark. | PO | Answered at Gate 2: recommended answer accepted |
| Q-6 | Stage 2 | Does the verdict use the exact, unrounded score? **Recommended:** yes; 17.49 of 25 = 69.96% with a 70% pass mark is a Fail even if the score is shown as "70.0%". | PO | Answered at Gate 2: recommended answer accepted |
| Q-7 | Stage 2 | Displayed precision and rounding? **Recommended:** always 1 decimal place, round half-up (2/3 → "66.7%", 70 → "70.0%"). Alternative: round down, so a fail is never shown as the pass mark itself. | PO | Answered at Gate 2: recommended answer accepted (amended: round down, see A-3) |
| Q-8 | Stage 2 | Are half or decimal marks allowed for marks earned and total possible, and how many decimals? **Recommended:** yes, up to 2 decimal places (17.5, 17.25), dot as the only decimal separator; more decimals give an error message. | PO | Answered at Gate 2: recommended answer accepted |
| Q-9 | Stage 2 | Maximum total marks possible? **Recommended:** 1,000,000; total must be greater than 0; above the maximum gives an error message. | PO | Answered at Gate 2: recommended answer accepted |
| Q-10 | Stage 2 | Is the pass mark optional with a default, and what range? **Recommended:** pre-filled with 70 and editable; allowed 0 to 100 inclusive, up to 1 decimal place; if cleared, the score still shows and the verdict asks for a pass mark. | PO | Answered at Gate 2: recommended answer accepted |
| Q-11 | Stage 2 | Live update or a Calculate button? **Recommended:** live update as the user types; the result clears while any input is invalid and returns as soon as all inputs are valid. | PO | Answered at Gate 2: recommended answer accepted |
| Q-12 | Stage 2 | Marks earned greater than total possible (bonus marks)? **Recommended:** not allowed; show an error message and no score. | PO | Answered at Gate 2: recommended answer accepted |

## Assumptions (PO-approved assumptions are copied to the README)

| ID | Assumption | Proposed in | PO approved |
|----|-----------|-------------|-------------|
| A-1 | A learner passes when score ≥ pass mark. | Stage 2 (Q-5) | Yes, Gate 2 |
| A-2 | The verdict uses the exact, unrounded score, never the displayed value. | Stage 2 (Q-6) | Yes, Gate 2 |
| A-3 | The score is shown to 1 decimal place, rounded down (69.96% → "69.9%", 2/3 → "66.6%"), so a failing score is never displayed as the pass mark. | Stage 2 (Q-7) | Yes, Gate 2 (amended from half-up) |
| A-4 | Marks earned and total possible accept up to 2 decimal places, with a dot as the decimal separator. | Stage 2 (Q-8) | Yes, Gate 2 |
| A-5 | Total marks possible is greater than 0 and at most 1,000,000. | Stage 2 (Q-9) | Yes, Gate 2 |
| A-6 | The pass mark defaults to 70, is editable, and accepts 0 to 100 inclusive with up to 1 decimal place. | Stage 2 (Q-10) | Yes, Gate 2 |
| A-7 | Results update live; no Calculate button. | Stage 2 (Q-11) | Yes, Gate 2 |
| A-8 | Marks earned cannot exceed total possible (no bonus marks). | Stage 2 (Q-12) | Yes, Gate 2 |
