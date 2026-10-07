# Backlog

_Stage 4 (Planning). Owner: solution-architect. Approved by PO at GATE 4 (2026-10-07). Source of truth for behaviour: [user-stories.md](../user-stories.md) (approved at GATE 3c)._

| Story | Job | Priority | Size | Sprint | Notes |
|---|---|---|---|---|---|
| S-1 Split the bill | J-2 | Must | M | 1 | Builds the whole pipeline and the global rules (see build order) |
| S-2 Tip and total | J-1 | Must | M | 1 | Tip half-up in basis points, Tip line, default `0` + hint |
| S-3 Leftover-cent markers | J-3 | Must | S | 1 | `extraCent` flag → ` (+0.01)` suffix |
| S-4 Correct and recalculate | J-4 | Must | S | 1 | Mostly tests of the global rules + values kept + two messages at once |
| S-5 Check my share | J-5 | Should | S | 2 | Trim/paste, `1e400`, determinism; expected to need tests more than code |
| S-6 Leftover note | J-6 | Should | S | 2 | `buildNote` with N-EVEN / N-ONE / N-MANY |
| Hardening | — | Should | S | 2 | Full edge sweep (test-plan §3), a11y check, 375px, browser checklist for the PO |
| S-7 Round up shares | J-2 | Could | M | Future | Out of MVP (brief Q5) |
| S-8 Tip presets | J-1 | Could | S | Future | Nice to have; typing the tip already serves J-1 |
| S-9 Named people, choose who pays | J-3 | Won't (this release) | M | Future | Changes the remainder rule; too big for the budget |

Buckets: Sprint 1 = 4 stories · Sprint 2 = 2 stories + hardening · Future = 3 stories. Total 9. Cut from the release: S-7, S-8, S-9 (time budget; MVP jobs are served without them).

## Sprint goals
- **Sprint 0:** a clean Vite + TypeScript + Vitest scaffold that installs, tests, builds and deploys an empty shell to Pages.
- **Sprint 1:** a Bill Settler can split a bill with a tip, sees who covers the leftover cent, and can fix any figure and recalculate.
- **Sprint 2:** a Group Member can check their share and understand a 1-cent difference; every input survives the edge sweep.

## Sprint 0 scope (no features)
- `package.json` (`engines` "^20.19.0 || ^22.13.0 || >=24.0.0" as amended at GATE 5, scripts `dev`, `build`, `preview`, `test`), `package-lock.json`, `.nvmrc` = `20`, `tsconfig.json` (strict), `vite.config.ts`.
- Dev dependencies only: `vite`, `typescript`, `vitest`, `jsdom` (ADR-005). No runtime dependencies. No Playwright.
- Skeleton files from technical-design §2 with the agreed signatures; `src/messages.ts` filled with the full catalogue (it is data, not a feature).
- `index.html` + `src/main.ts` mounting an empty shell; one smoke test so `npm test` is green.
- `.github/workflows/pages.yml` (technical-design §8). PO/Orchestrator action: enable Pages with source "GitHub Actions".

## Build order inside Sprint 1: S-1 → S-2 → S-3 → S-4
- **Dependency chain:** S-2, S-3 and S-4 ACs all use a tip of `15`, and S-3/S-4 reuse the S-2 reference split, so each story builds on the one before.
- **S-1 builds the pipeline once:** all three fields (Tip % pre-filled `0`), the shared decimal parser, `calculateSplit`, `formatAmount`, the result region, submit (button + Enter), and the global rules T-G1…T-G6 (test-plan §2). Every later story relies on them.
- **S-2** then adds tip-specific tests (half-up, `100`%, decimals), the Tip line and the hint. **S-3** adds the marker only. **S-4** is mostly verification of the global rules from S-1, so it is cheap last.
- **Keep earlier tests stable:** UI assertions in S-1/S-2 match a line's start (`Person 1: 33.34`), so the S-3 marker and S-6 note don't break them.

## Budget (≈ 2–4 h total)
| Sprint | Estimate | Content |
|---|---|---|
| 0 | 25 min | Scaffold, skeleton, workflow, first deploy |
| 1 | 95 min | S-1 40 · S-2 20 · S-3 15 · S-4 20 (incl. QA per story) |
| 2 | 50 min | S-5 10 · S-6 15 · hardening 25 |
| Release | 30 min | Docs, audit, tag. If time runs short, cut Sprint 2 items last-in-first-out, never Sprint 1 |

## Definition of Ready (story may enter a sprint)
- [ ] D9 format, names its job, and the job names a role
- [ ] 4–8 Given/When/Then ACs with exact numbers and exact error text
- [ ] Edge coverage complete (normal, invalid, boundaries, large/small, after result, after error)
- [ ] Every AC mapped in test-plan.md to a test ID or MANUAL with a reason
- [ ] Priority and size set; no open questions for the PO

## Definition of Done (story may be accepted)
- [ ] Tests written first, now all passing (`npm test`); `npm run build` passes
- [ ] Logic → validation → UI layering respected; no console logs, no dead code
- [ ] qa-reports/S-x.md shows PASS for every AC (MANUAL items confirmed by the PO)
- [ ] Error messages match the catalogue exactly; output is never NaN, Infinity, undefined or blank
- [ ] Keyboard-operable, labelled, aria-live, usable at 375px
- [ ] Committed as `feat(S-x): …`, branch pushed, PO accepted, merged `--no-ff` to main
