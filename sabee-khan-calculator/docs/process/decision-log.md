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
| DEC-8 | 2026-10-08 | Gap to the pass mark is shown in marks (e.g. "0.6 marks short of the pass mark"). Illustrative details in app-roles.md (half marks, phone use) accepted. | PO | Gate 3a approval |
| DEC-9 | 2026-10-08 | User stories S-1..S-6 approved (Must S-1..S-3, Should S-4, Could S-5..S-6); assumptions A-10..A-17 approved. | PO | Gate 3c approval |
| DEC-10 | 2026-10-08 | Design direction: A "Ledger" with a bigger verdict (large tick/cross + word, as prominent as the score) instead of a small pill. | PO | Learner's main question is the verdict; keeps A's calm, official look |

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
| A-9 | The gap to the pass mark is shown in marks, not percentage points. | Stage 3a | Yes, Gate 3a |
| A-10 | Marks needed = pass mark ÷ 100 × total; gap = marks earned − marks needed. A shortfall is rounded UP and a surplus rounded DOWN to 2 decimal places (16.331 needed: 16 → "0.34 marks short", 17 → "0.66 marks above"); a shortfall under 0.01 shows as "0.01"; a surplus under 0.01 shows "Less than 0.01 marks above the pass mark"; equal shows "Exactly on the pass mark". | Stage 3c (S-2) | Yes, Gate 3c |
| A-11 | Gap numbers drop trailing zeros ("0.60" → "0.6", "2.00" → "2") and use comma thousands separators ("699,999.99"); "mark" is singular only when the shown value is exactly 1. | Stage 3c (S-2) | Yes, Gate 3c |
| A-12 | An empty field (or spaces only) never shows an error: if marks earned or total is empty the result area shows "Enter marks earned and total marks possible to see the score."; if the pass mark is empty the score still shows, the verdict area shows "Enter a pass mark to see whether this is a pass or a fail." and no gap is shown. | Stage 3c (S-3) | Yes, Gate 3c |
| A-13 | Accepted number format: digits with at most one dot (".5" and "5." accepted, so typing never flashes an error mid-number), leading zeros ("007" = 7), leading/trailing spaces ignored. Decimal places count as typed ("17.500" has 3). Anything else ("abc", "17,5", "$17", "1.2.3", "1e400", "+5") gets that field's not-a-number message. | Stage 3c (S-3) | Yes, Gate 3c |
| A-14 | A minus sign before an otherwise valid number, including "-0", gets that field's can't-be-negative message (all three fields). | Stage 3c (S-3) | Yes, Gate 3c |
| A-15 | Checks per field run in order: not a number → negative → too many decimals → range (total > 0 and ≤ 1,000,000; pass mark ≤ 100); then marks earned ≤ total, checked only when both are otherwise valid. Each field shows at most one message, under that field; several invalid fields each show their own. | Stage 3c (S-3) | Yes, Gate 3c |
| A-16 | While any field shows an error, the result area shows "The score will appear once every entry is valid." instead of a score, verdict or gap (never blank). | Stage 3c (S-3) | Yes, Gate 3c |
| A-17 | "Next learner" (and Escape in marks earned) clears only marks earned and its message, keeps total and pass mark as they are, and puts the cursor back in marks earned. | Stage 3c (S-4) | Yes, Gate 3c |
