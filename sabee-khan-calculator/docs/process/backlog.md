# Backlog

Stage 5, solution-architect. Priorities from `docs/user-stories.md` (DEC-9). Design in `technical-design.md`, tests in `test-plan.md`.
Time left for building: about 2 h. If time runs short, cut S-4 or polish first, never tests or quality (CLAUDE.md A.7).

## Priority order

| # | Item | Story / job / role | MoSCoW | Size | Est. | Sprint | Branch |
|---|------|--------------------|--------|------|------|--------|--------|
| 1 | Scaffold, design system, app shell (no calculation) | enables all (D2, D6, D10) | — | M | 30 min | 0 | `main` (chore) |
| 2 | Score and pass/fail verdict | S-1 · J-1, J-3 · R-1, R-2 | Must | M | 25 min | 1 | `feat/S-1` |
| 3 | Marks short of or above the pass mark | S-2 · J-2 · R-1 | Must | M | 15 min | 1 | `feat/S-2` |
| 4 | Clear message for an invalid or impossible entry | S-3 · J-4 · R-2 | Must | M | 25 min | 1 | `feat/S-3` |
| 5 | Next learner in one step | S-4 · J-5 · R-2 | Should | S | 10 min | 2 | `feat/S-4` |
| 6 | Hardening: edge sweep, axe audit, console check, 320 px check | D1, D5, D6 | — | S | 10 min | 2 | `main` (test/fix) |
| 7 | Polish: visual review fixes, final screenshots 375/768/1280 light + dark | D6 | — | S | 5 min | 2 | `main` (style) |
| 8 | Copy the outcome as one line | S-5 · J-5 · R-2 | Could | S | — | Future | — |
| 9 | Marks needed to pass | S-6 · J-2 · R-1 | Could | S | — | Future | — |

Total planned: about 2 h (Sprint 0 ≈ 30 min, Sprint 1 ≈ 65 min, Sprint 2 ≈ 25 min). Estimates include writing tests first and the QA + visual review loop.

## Sprint 0 — Scaffold and shell
**Goal:** a reviewer can clone, install, test and see the approved empty card (idle state, light and dark) with every npm command passing.
- Package files in `sabee-khan-calculator/`: `package.json` (engines `>=20`, zero runtime dependencies), `package-lock.json`, `.nvmrc` (`20`), `tsconfig.json` (strict), `vite.config.ts` (`base: './'`, Vitest config), `playwright.config.ts` (Chromium, Firefox, WebKit).
- `src/styles/tokens.css`, `base.css`, `components.css` from the approved ui-design.md tokens.
- `index.html` + `src/main.ts` + `src/ui/render.ts` render the static card from `src/messages.ts` (M-1, M-25, M-30..M-40): heading, three fields (pass mark pre-filled "70"), divider, idle result, button + Esc hint. No calculation, no event handling beyond what the shell needs.
- Tests: `tests/unit/messages.test.ts` (catalogue text), `tests/e2e/shell.spec.ts` (loads, title, labels, idle text, no console errors, no horizontal scroll at 320 px).
- Exit: `npm ci && npm test && npm run test:e2e && npm run build` pass; ux-ui-designer confirms the shell matches the mockup.

## Sprint 1 — MVP (Must)
**Goal:** a learner or instructor gets an exact score, verdict and gap for any valid entry, and a clear inline message for every invalid one.

Recommended build order: **S-1 → S-2 → S-3** (one branch and one QA loop each).
- **S-1 first** because it builds the core that every other story stands on: the exact decimal parser (`parse.ts`, happy path plus typed error codes), the scaled-integer score and verdict (`score.ts`), the view model and live rendering. Its ACs are all valid inputs, so they test the decimal strategy directly. Until S-3 lands, any invalid input shows M-3 with no score (never NaN or blank), so S-1 is safe on its own.
- **S-2 second** because it reuses S-1's integers (one extra formula and the formatter) and S-3.8 needs the gap line ("1.4 marks above the pass mark", "6 marks above the pass mark") to pass.
- **S-3 last in the sprint** because its ACs mix error states with results ("76.0%" for " 017.5 ", "0.0%" for total "1000000", gap lines after recovery), so it can only pass in full once S-1 and S-2 exist. It adds the range and cross-field checks, the per-field messages, `aria-invalid`/`aria-describedby`, and the pass-mark-empty state (S-3.2).
- A validation-first order (S-3 first) was rejected: S-3 could not be accepted on its own because four of its eight ACs show a score or gap.

## Sprint 2 — Should, hardening, polish
**Goal:** an instructor can move through a cohort in one keystroke, and the app passes the full edge sweep, an axe audit and the visual review on all three engines.
- S-4 (Next learner button + Escape in marks earned).
- Hardening: `tests/e2e/edge.spec.ts` and `tests/e2e/a11y.spec.ts` (axe, ADR-006), every state in light and dark; fix any defect on its story branch or as `fix:` on `main` before release.
- Polish: ux-ui-designer visual review at 375/768/1280, light and dark; final screenshots to `design/screenshots/`.

## Future (Not implemented)
- S-5 Copy the outcome as one line (Could). Needs the Clipboard API, which differs by engine and needs a secure context; not worth the budget.
- S-6 Marks needed to pass (Could). Formula ready: needed hundredths = ceil(P × T / 1000) (see technical-design.md).

## Definition of Ready (CLAUDE.md §9)
**DoR**: traces to a job and role · ACs testable with exact values and text · sized · UI states defined in ui-design.md · no open questions.

## Definition of Done (CLAUDE.md §9)
**DoD**:
- [ ] Unit + e2e tests written first (shown failing), now passing on Chromium, Firefox, WebKit
- [ ] Every AC verified by qa-engineer in the running app
- [ ] Errors show clear messages from `messages.ts`
- [ ] UI matches the design spec and passes the visual review checklist
- [ ] Keyboard-operable; no console errors or warnings
- [ ] Docs updated (QA report, sprint log, tracker)
- [ ] Committed and pushed

## Readiness check (Stage 5)
| Story | Job + role | ACs exact | Sized | UI states in ui-design.md | Open questions | Ready |
|-------|-----------|-----------|-------|---------------------------|----------------|-------|
| S-1 | J-1, J-3 · R-1, R-2 | 8 | M | result, idle | none | Yes |
| S-2 | J-2 · R-1 | 8 | M | gap line | none | Yes |
| S-3 | J-4 · R-2 | 8 | M | error, pass mark empty | Q-13 (bare "." / "-", not in any AC) | Yes, Q-13 default applies until answered |
| S-4 | J-5 · R-2 | 5 | S | button, Esc hint | none | Yes |
