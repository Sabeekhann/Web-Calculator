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
| D6 | UI quality: design spec, 375px+, light/dark, WCAG 2.2 AA | IN PROGRESS | ui-design.md + mockup.html approved Gate 4; build + visual review pending |
| D7 | AI writes the code | IN PROGRESS | All files so far written by Claude Code |
| D8 | Hand changes listed in README (or "None") | OPEN | |
| D9 | Transcripts of every session + raw logs | OPEN | PO exports (see Q-3) |
| D10 | Source without node_modules/dist/coverage/reports | IN PROGRESS | `.gitignore` in place |
| D11 | Package README covers every brief item | IN PROGRESS | Headings only; choice + reasons ready in product-brief.md |
| D12 | docs/app-roles.md | DONE | R-1 Learner, R-2 Instructor + needs table; approved Gate 3a |
| D13 | docs/jobs-to-be-done.md | DONE | J-1..J-5, purity check PASS; approved Gate 3b |
| D14 | docs/user-stories.md | IN PROGRESS | S-1..S-6 approved Gate 3c; statuses updated at release |
| D15 | Acceptance criteria (Given/When/Then, edges) | DONE | 34 ACs, edge coverage table, arithmetic checked twice (analyst + Orchestrator) |
| D16 | Status per story | IN PROGRESS | All Not implemented |
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
| 3a App roles | 08:55 | 09:10 | 15 |
| 3b Jobs to be done | 09:10 | 09:25 | 15 |
| 3c User stories | 09:25 | 09:45 | 20 |
| 4 UX/UI design | 09:45 | 10:25 | 40 |
| 5 Planning | 10:25 | | |

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
| 3b | product-analyst | Jobs to be done (D13) | Done: 5 jobs (2 Learner, 3 Instructor), purity check 5/5 PASS | Accepted; Orchestrator aligned CLAUDE.md §8 job-tag format to "J-n (R-n Role)" |
| 3c | product-analyst | User stories + ACs (D14–D16), A-10..A-17 | Done: 6 stories, 34 ACs, 29 messages, 147 lines | Accepted; Orchestrator re-ran 10 boundary calculations independently — all match |
| 4 | ux-ui-designer | 2 design directions + side-by-side preview (directions.html, 375/1280 screenshots) | Done: A Ledger (recommended), B Spotlight; all contrast pairs pass | Accepted; Orchestrator noted A's small verdict pill and B's mobile result-below-button issue for the PO |
| 4 | ux-ui-designer | Full spec (201 lines) + mockup.html (states a–e, light/dark, 375/1280) | Done: 19 contrast pairs pass, 78 message texts match, no layout shift measured | Accepted; Orchestrator reviewed Pass, Fail, error and pass-mark-empty states in fresh screenshots; recorded DEC-10 |
| 5 | product-analyst | Catalogue UI strings N-1..N-11 as M-30..M-40 | Done: 11 rows, all match ui-design.md | Accepted; note: Orchestrator's brief asked for a Bash check outside the role's tool list — agent flagged it; brief wording to be fixed in future delegations |
| 5 | solution-architect | backlog.md, technical-design.md (ADR-001..008), test-plan.md, Q-13 | Done: 29/29 ACs mapped, 30/30 AC numbers verified with integer formulas | Accepted; Orchestrator recommends a different answer to Q-13 (lone "." treated as empty) for PO |
