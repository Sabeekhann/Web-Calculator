# Delivery Tracker

Updated at every gate. Status: OPEN · IN PROGRESS · DONE · N/A (PO-approved only).

## D1–D23 checklist

| ID | Deliverable | Status | Evidence / note |
|----|-------------|--------|-----------------|
| D1 | Browser app (Chrome, Edge, Firefox, Safari) | IN PROGRESS | Chromium local + Chromium/Firefox/WebKit in GitHub Actions CI on Node 20 (ADR-009); main 10af8a8: 51 e2e per engine green (153 total) incl. axe + edge sweep; PO real-browser checks PASS in Chrome, Edge, Firefox, Safari, phone (DEC-18) |
| D2 | Local run from README, no paid accounts/keys/cloud | IN PROGRESS | Clean `npm ci` copy: test, build, dev, preview all work (qa-reports/sprint-0.md) |
| D3 | Live URL (optional, in addition to local run) | IN PROGRESS | https://sabeekhann.github.io/Web-Calculator/ deployed from main (Pages run on 10af8a8 success); PO opened and checked it (DEC-18) |
| D4 | Correctness: every Implemented story matches its ACs | IN PROGRESS | S-1, S-2, S-3 accepted (qa-reports/S-1..S-3.md) |
| D5 | Error handling: clear messages, no crash or wrong result | IN PROGRESS | S-3 accepted; edge sweep automated (E-EDGE.0–9) on 3 engines; Sprint 2 QA PASS; PO real-browser checks PASS (DEC-18) |
| D6 | UI quality: design spec, 375px+, light/dark, WCAG 2.2 AA | IN PROGRESS | ui-design.md + mockup.html approved Gate 4; Shell, S-1, S-2, S-3 pass visual review; 0 axe violations; Sprint 2 polish done; axe e2e 0 violations on 3 engines |
| D7 | AI writes the code | IN PROGRESS | All files so far written by Claude Code |
| D8 | Hand changes listed in README (or "None") | OPEN | |
| D9 | Transcripts of every session + raw logs | OPEN | PO exports (see Q-3) |
| D10 | Source without node_modules/dist/coverage/reports | IN PROGRESS | `.gitignore` verified by QA (check-ignore); zero runtime deps |
| D11 | Package README covers every brief item | IN PROGRESS | Headings only; choice + reasons ready in product-brief.md |
| D12 | docs/app-roles.md | DONE | R-1 Learner, R-2 Instructor + needs table; approved Gate 3a |
| D13 | docs/jobs-to-be-done.md | DONE | J-1..J-5, purity check PASS; approved Gate 3b |
| D14 | docs/user-stories.md | IN PROGRESS | S-1..S-6 approved Gate 3c; statuses updated at release |
| D15 | Acceptance criteria (Given/When/Then, edges) | DONE | 34 ACs, edge coverage table, arithmetic checked twice (analyst + Orchestrator) |
| D16 | Status per story | IN PROGRESS | All Not implemented |
| D17 | Package layout `sabee-khan-calculator/` | IN PROGRESS | README, src/, docs/, transcripts/ present |
| D18 | HR acknowledgement | IN PROGRESS | Draft in `.private/hr-ack-email.md` (needs Q-1) |
| D19 | Repo public, verified signed out | IN PROGRESS | Repo already public (REST API, 2026-10-08) |
| D20 | Submission email | OPEN | |
| D21 | Accuracy of README and docs | OPEN | |
| D22 | Open questions asked or assumed in README | IN PROGRESS | decision-log.md: Q-5..Q-12 answered, A-1..A-8 approved (DEC-7) |
| D23 | Walkthrough notes (private) | OPEN | |

## Time log (UTC)

Derived from commit timestamps (start = previous gate approval, end = this gate's approval commit); includes PO review time. Corrected at Stage 7 start: earlier rows from Stage 3a onwards had been estimated by the Orchestrator instead of read from the clock.

| Stage | Start | End | Minutes |
|-------|-------|-----|---------|
| Preflight | 08:08 | 08:12 | 4 |
| 1 Fresh start & initiation | 08:12 | 08:17 | 5 |
| 2 Discovery | 08:17 | 09:21 | 64 |
| 3a App roles | 09:21 | 09:26 | 5 |
| 3b Jobs to be done | 09:26 | 09:30 | 4 |
| 3c User stories | 09:30 | 09:36 | 6 |
| 4 UX/UI design | 09:36 | 09:52 | 16 |
| 5 Planning | 09:52 | 10:00 | 8 |
| 6 Sprint 0 | 10:00 | 10:23 | 23 |
| 7 Sprint 1 | 10:23 | 15:17 | 294 (incl. a pause until the account rate limit reset) |
| 8 Sprint 2 | 15:17 | 15:47 | incl. PO real-browser checks |
| 9 Release | 15:47 | | |

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
| 6 | developer | Sprint 0 scaffold, design system, shell, tests first | Done: 5 unit + 4 e2e (Chromium) | Accepted after fix loop 1 |
| 6 | Orchestrator | npm audit review | 2 critical + 1 moderate in Vitest 3 dev deps; registry check → Vitest 4.1.11 | Sent back as D-0.1 |
| 6 | developer | D-0.1 Vitest 4.1.11 upgrade | Done: 0 vulnerabilities | Accepted; Orchestrator verified plain `npm install` on npm 10 in a fresh copy |
| 6 | solution-architect | ADR-005 amendment | Done (72c6927) | Accepted; facts match registry |
| 6 | ux-ui-designer | Sprint 0 visual review | 0 issues; 0-pixel diff vs mockup (a) | Accepted |
| 6 | qa-engineer | Sprint 0 verification → qa-reports/sprint-0.md | PASS (Chromium); Firefox/WebKit NOT RUN (environment) | Accepted |
| 6 | docs-writer | Sprint 0 entry in sprint-log.md | Done | Accepted |
| 6 | developer | CI workflow (ADR-009) + per-engine annotations | Done: first CI run 12/12 e2e on 3 engines, Node 20 | Accepted; Orchestrator found logs/artifacts blocked (blob host) → annotations |
| 7 | developer | S-1 on feat/S-1, tests first | Done: 58 unit, 12 e2e | Accepted; Orchestrator merged main into branch for CI annotations |
| 7 | ux-ui-designer | S-1 visual review | PASS, 0 issues | Accepted |
| 7 | qa-engineer | S-1 verification (first attempt cut off by account rate limit; retried) | PASS all 8 ACs, 3 engines, edge sweep 23/23 | Accepted |
| 7 | PO | S-1 acceptance | Accepted; manual checks deferred (DEC-14) | Merged --no-ff |
| 7 | developer | S-2 on feat/S-2, tests first | Done: 91 unit, 21 e2e | Accepted |
| 7 | ux-ui-designer | S-2 visual review | PASS, 0 issues (cosmetic orphan noted for Sprint 2) | Accepted |
| 7 | qa-engineer | S-2 verification | PASS 8/8, 300 random inputs 0 mismatches | Accepted; QA caught that the Orchestrator's screenshot push cancelled CI on the code commit (concurrency) — process changed: screenshots commit with the QA report |
| 7 | PO | S-2 acceptance | Accepted (DEC-15) | Merged --no-ff |
| 7 | developer | S-3 on feat/S-3, tests first | Done: 131 unit, 31 e2e | Accepted |
| 7 | ux-ui-designer | S-3 visual review (screenshots kept out of repo until QA done) | PASS; V-3.1 cosmetic "-5" spacing → Sprint 2 polish | Accepted |
| 7 | qa-engineer | S-3 verification | PASS 8/8, 179 checks, 0 defects | Accepted |
| 7 | PO | S-3 acceptance | Accepted (DEC-16) | Merged --no-ff |
| 7 | docs-writer | Sprint 1 review + retro in sprint-log.md | Done | Accepted |
| 8 | developer | Pages workflow; S-4 UI removed; polish; a11y spec; edge spec; V-S2.1–3 | Done | Accepted |
| 8 | ux-ui-designer | Polish review; spec + mockup aligned; final screenshots | PASS, 3 Low findings applied | Accepted |
| 8 | solution-architect | Test plan / technical design (ADR-010) / backlog aligned with DEC-17 | Done | Accepted; 2 of its claims (CSS missing, Q-13 open) checked and rejected by Orchestrator; its missing-edge-tests finding acted on |
| 8 | qa-engineer | Sprint 2 final hardening | PASS, 51/engine, H-1..H-15, 0 defects | Accepted |
| 8 | docs-writer | Sprint 2 review + retro | Done | Accepted |
