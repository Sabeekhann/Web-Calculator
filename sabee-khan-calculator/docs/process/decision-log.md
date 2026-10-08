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

## Open questions

| ID | Raised | Question | Owner | Status |
|----|--------|----------|-------|--------|
| Q-1 | Stage 1 | Role applied for, HR contact name/email, deadline and expected submission date (for D18 and D20). | PO | Open |
| Q-2 | Stage 1 | The session's git proxy returns HTTP 403 for tag pushes and branch deletions. Archive tag `archive/pre-fresh-start` (→ `fe7cc3f`), deleting `feat/S-1..3`, and the `v1.0.0` tag in Stage 9 must be done by the PO in the GitHub web UI, or the plan must change. | PO | Open |
| Q-3 | Stage 1 | Transcripts (D9): this container's raw logs in `~/.claude/projects/` disappear when the session ends. The PO must run `/export` before then; the Orchestrator may copy the raw log files unchanged into `transcripts/` only with PO approval. | PO | Open |
| Q-4 | Stage 1 | `localhost` dev-server URLs can't be reached from the PO's browser. PO checks run via a GitHub Pages URL or a local run on the PO's machine; agents use headless Chromium screenshots. | PO | Open |

## Assumptions (PO-approved assumptions are copied to the README)

| ID | Assumption | Proposed in | PO approved |
|----|-----------|-------------|-------------|
| — | None yet | — | — |
