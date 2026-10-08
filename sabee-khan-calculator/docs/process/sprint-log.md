# Sprint Log

## Sprint 0 — Foundation, design system and app shell
**Goal** (backlog.md): a reviewer can clone, install, test and see the approved empty card (idle state, light and dark) with every npm command passing.

**Delivered vs goal**
| Item | Status | Evidence |
|------|--------|----------|
| Scaffold: Vite 6.4.4, TypeScript 5.9.3 strict, Vitest 4.1.11, @playwright/test 1.56.1, @axe-core/playwright 4.13.0 (dev only), zero runtime deps | Done | `qa-reports/sprint-0.md` checks 1, 4, 5 (`npm ls --omit=dev` → empty) |
| `messages.ts` M-1..M-40 | Done | `qa-reports/sprint-0.md` check 3: 40 entries, 0 mismatches |
| `tokens.css`, `base.css`, `components.css`; static shell | Done | `qa-reports/sprint-0.md` shell checks; ux-ui-designer: 0 issues, all tokens match spec |
| Shell matches mockup | Done | ux-ui-designer: state (a) 0 differing pixels at 375/768/1280, light + dark; `design/screenshots/shell-*.png` |
| Tests first: `tests/unit/messages.test.ts`, `tests/e2e/shell.spec.ts` | Done | Developer return: failing first (unit: module not found; e2e: 4 failed vs a stub), then 5 unit + 4 e2e pass |
| `npm ci && npm test && npm run test:e2e && npm run build` | Done on Chromium | `qa-reports/sprint-0.md` checks 1, 2, 4, 6 |
| Accessibility, console, servers, hygiene | Done | 0 axe violations (light/dark); 0 console messages; dev + preview serve; hygiene clean |
| E2E on Firefox and WebKit | Not run (blocked) | `qa-reports/sprint-0.md` checks 7, 8 |

**Not done / carried over**
- Firefox/WebKit e2e: blocked — network policy refuses the browser downloads (`cdn.playwright.dev`, `playwright.download.prss.microsoft.com`). Not worked around; PO asked to allow the hosts.
- T-M.2 (every error code → one message): deferred to S-3, where error codes first exist (QA O-2).
- Esc / "Next learner" behaviour: hint visible but not wired; comes with S-4 (QA O-1).

**Review notes**
- QA verdict: PASS on Chromium, no defects; Firefox/WebKit NOT RUN (environment).
- Fix loop 1 (D-0.1): `npm audit` found 2 critical + 1 moderate advisories in Vitest 3.2.7 dev deps (tinypool, @vitest/mocker). Registry check: Vitest 4.1.11 supports Node ^20 and Vite ^6; Vitest 5 needs Node ≥22.12. Upgraded to 4.1.11 → 0 vulnerabilities; ADR-005 amended (`72c6927`).
- Side finding: npm 10.9.4 hits an internal `edgesOut` error when adding or changing a dependency; the lockfile was generated once with npm 11. Plain `npm install` and `npm ci` from the lockfile both work on npm 10 (fresh copy).

**Retro**
- Went well: tests shown failing before code; `npm audit` caught the advisories before any story work; pixel-exact match to the mockup at the first review.
- Didn't go well: two of three engines could not run; npm 10 cannot change dependencies here; one QA shell check gave a false FAIL (`innerText` includes sr-only text).
- Change: get the browser hosts allowed before Sprint 1 closes; run `npm audit` as part of every dependency change; check visible text with computed styles or the ARIA snapshot, not `innerText`.
