# Delivery Tracker

Updated at every gate. Status: OPEN · IN PROGRESS · DONE · N/A (PO-approved only).

## D1–D23 checklist

| ID | Deliverable | Status | Evidence / note |
|----|-------------|--------|-----------------|
| D1 | Browser app (Chrome, Edge, Firefox, Safari) | OPEN | |
| D2 | Local run from README, no paid accounts/keys/cloud | OPEN | |
| D3 | Live URL (optional, in addition to local run) | OPEN | Decided at Stage 10 |
| D4 | Correctness: every Implemented story matches its ACs | OPEN | |
| D5 | Error handling: clear messages, no crash or wrong result | OPEN | |
| D6 | UI quality: design spec, 375px+, light/dark, WCAG 2.2 AA | OPEN | |
| D7 | AI writes the code | IN PROGRESS | All files so far written by Claude Code |
| D8 | Hand changes listed in README (or "None") | OPEN | |
| D9 | Transcripts of every session + raw logs | OPEN | PO exports (see Q-3) |
| D10 | Source without node_modules/dist/coverage/reports | IN PROGRESS | `.gitignore` in place |
| D11 | Package README covers every brief item | IN PROGRESS | Headings only; choice + reasons ready in product-brief.md |
| D12 | docs/app-roles.md | IN PROGRESS | R-1 Learner, R-2 Instructor + needs table; awaiting Gate 3a |
| D13 | docs/jobs-to-be-done.md | OPEN | Placeholder |
| D14 | docs/user-stories.md | OPEN | Placeholder |
| D15 | Acceptance criteria (Given/When/Then, edges) | OPEN | |
| D16 | Status per story | OPEN | |
| D17 | Package layout `sabee-khan-calculator/` | IN PROGRESS | Folders created |
| D18 | HR acknowledgement | IN PROGRESS | Draft in `.private/hr-ack-email.md` (needs Q-1) |
| D19 | Repo public, verified signed out | IN PROGRESS | Repo already public (REST API, 2026-10-08) |
| D20 | Submission email | OPEN | |
| D21 | Accuracy of README and docs | OPEN | |
| D22 | Open questions asked or assumed in README | IN PROGRESS | decision-log.md: Q-5..Q-12 answered, A-1..A-8 approved (DEC-7) |
| D23 | Walkthrough notes (private) | OPEN | |

## Time log (UTC)

| Stage | Start | End | Minutes |
|-------|-------|-----|---------|
| Preflight | 08:08 | 08:12 | 4 |
| 1 Fresh start & initiation | 08:12 | 08:17 | 5 |
| 2 Discovery | 08:17 | 08:55 | 38 |
| 3a App roles | 08:55 | | |

## Session log

| Session | Tool / model | Date | Stages | Transcript file |
|---------|--------------|------|--------|-----------------|
| session-01 | Claude Code (cloud session, launched from the desktop app), Claude Opus 5.5 | 2026-10-08 | Preflight → | `transcripts/session-01.md` (PO exports) |

## Agent activity log

| Stage | Agent | Task | Result | Orchestrator review |
|-------|-------|------|--------|---------------------|
| 1 | Orchestrator | Preflight, fresh start, structure, CLAUDE.md (282 lines), 7 agent files | Done | Brought CLAUDE.md up from 256 to 282 lines and release-auditor.md up from 47 to 52, adding content each needed |
| 1 | docs-writer | Draft HR acknowledgement `.private/hr-ack-email.md` | Done: 85-word body, 4 placeholders (Q-1) | Accepted, no invented facts; file confirmed gitignored |
| 2 | product-analyst | Propose 3 calculator options + recommendation | Done: A Quiz score recommended | Accepted; PO chose A (DEC-6) |
| 2 | product-analyst | Product brief, DEC-6, Q-5..Q-12, A-1..A-8 | Done: 102-line brief | Accepted; Orchestrator updated stale CLAUDE.md §1 line; flagged Q-6/Q-7 display-vs-verdict conflict to PO |
| 3a | product-analyst | App roles (D12) | Done: 2 roles, needs table, 24 lines | Accepted; checked D12 form, scope, no widget wording; margin-unit question raised to PO |
