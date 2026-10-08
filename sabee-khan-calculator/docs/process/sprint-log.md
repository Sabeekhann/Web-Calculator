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

## Sprint 1 — MVP (S-1, S-2, S-3)
**Goal** (backlog.md): a learner or instructor gets an exact score, verdict and gap for any valid entry, and a clear inline message for every invalid one.

**Delivered vs goal**
| Story | Status | QA verdict | CI run (3 engines) | Merge commit |
|-------|--------|------------|--------------------|--------------|
| S-1 Score and pass/fail verdict | Accepted (DEC-14), merged `--no-ff` | PASS 8/8 ACs; edge sweep 23/23; 0 axe violations | 37764220926 on `75ff087`: unit 58; e2e 12/0 per engine (36) | `126b382` |
| S-2 Marks short of or above the pass mark | Accepted (DEC-15), merged `--no-ff` | PASS 8/8; 300-case differential 0 mismatches; 0 axe violations | 37796019119 on `8d496d6` (same code as `143c61e`): unit 91; e2e 21/0 per engine (63) | `9b56aac` |
| S-3 Clear message for an invalid or impossible entry | Accepted (DEC-16), merged `--no-ff` | PASS 8/8; edge sweep 179/179; 0 axe violations; no layout shift at 320/375/1280 | 37797412005 on `ea4b301`: unit 131; e2e 31/0 per engine (93) | `4b63578` |

**Not done / carried over**
- PO real-browser manual checks (Chrome, Edge, Firefox, Safari) for S-1..S-3: deferred to the live URL / local run before release (DEC-14..16). Stories stay Not implemented in user-stories.md until then.
- Sprint 2 polish (cosmetic, from visual reviews): S-2 gap line leaves an orphan word at 375 px (suggestion: `text-wrap: pretty`); V-3.1 "-5" hyphen spacing caused by tabular numerals.
- "Next learner" button and Esc still do nothing; they come with S-4 (Sprint 2).

**Review notes**
- Firefox/WebKit cannot be downloaded in this container, so GitHub Actions CI on the exact commit is the 3-engine evidence (DEC-13, ADR-009). The container also cannot read Actions logs or artifacts (blob host blocked), so CI publishes per-engine counts as check-run annotations (`455c31c`).
- S-1: the first qa-engineer run was cut off by the account rate limit and was re-run in full.
- S-2: the Orchestrator's screenshot push (`8d496d6`) cancelled the CI run on the code commit `143c61e` (workflow concurrency, cancel-in-progress). QA caught it and used the next green run on identical code (diff = 3 PNGs only).
- No defects in any story (no D-1.x, D-2.x, D-3.x). Console clean in all runs.

**Retro**
- Went well: tests shown failing before code on every story; CI annotations gave per-engine counts without log access; QA's independent checks (Decimal recomputation, 300-case differential, 179-check sweep) found no defects; QA caught the cancelled CI run instead of passing on it.
- Didn't go well: a screenshot push cancelled CI on a code commit; one QA run lost to the rate limit; PO manual checks still outstanding.
- Change: screenshots are committed together with the QA report, never between the code commit and QA; QA always confirms a green run on the exact SHA it signs off; schedule the PO manual checks before release.

## Sprint 2 — Polish, hardening and live URL (S-4 cut)
**Goal** (backlog.md, DEC-17): the MVP passes an axe audit, the final QA sweep and the visual review on all three engines, and is live on GitHub Pages. At Gate 7 the PO chose option (b): time budget exceeded and the MVP meets the brief, so S-4 is cut.

**Delivered vs goal** (branch `chore/sprint-2-polish`; QA build `7098224`, CI run 37801681193)
| Item | Status | Evidence |
|------|--------|----------|
| S-4 UI removed ("Next learner" button, Esc hint); favicon | Done | `21c7b2d`, `e4873ec`; QA H-3, H-10 |
| axe WCAG 2.2 AA e2e for every state, light + dark | Done | `e4873ec`, `05010a4`; a11y 10/10 per engine; QA H-8 0 violations |
| Edge sweep automated (`tests/e2e/edge.spec.ts`, E-EDGE.0–9) | Done | `dff4b10`; 10/10 on each engine in CI |
| Visual polish V-S2.1–3: reserved result height 192/100 px, subheading `text-wrap: pretty`, unused token removed | Done | `7098224`; no-shift tests pass on 3 engines; headroom 1.0 px (narrow) / 1.5 px (wide) |
| Docs aligned with DEC-17 (test plan, technical design ADR-010, backlog, UI spec, mockup, final screenshots) | Done | `77243d8`, `25a0cf7` |
| Regression S-1..S-3 | Done | QA PASS: 24/24 ACs on Chromium, Firefox, WebKit; unit 131/131; e2e 51/0 per engine; 0 retries; audit clean; H-1..H-15 PASS; no console errors |
| GitHub Pages (D3) | Done; not checked from here | `90a3a96`; first deploy run 37799872280 succeeded on `90a3a96`; https://sabeekhann.github.io/Web-Calculator/ |

**Not done / carried over**
- S-4 Next learner in one step: cut (DEC-17), stays Not implemented; design kept in technical-design.md as future.
- PO real-browser checklist (`qa-reports/sprint-2.md`, steps 1–14 in Chrome, Edge, Firefox, Safari + phone): still required by the DoD before S-1..S-3 can be marked Implemented. The live URL serves `main`, so this build is checkable there only after merge.

**Review notes**
- Pages: the proxy blocks the Pages API, so the PO set the source to GitHub Actions in the web UI. github.io is blocked from this container, so the live URL was not opened here; the PO checks it.
- The solution-architect's doc review found the planned edge tests had never been written; the developer added `edge.spec.ts` so the sweep runs on all 3 engines. Two other architect claims (polish CSS missing; Q-13 open) were checked by the Orchestrator and rejected: both were wrong (Q-13 was answered at Gate 5).
- QA O-1: test-plan.md still said no `edge.spec.ts` exists (being fixed by the architect). O-2: the 1–1.5 px headroom is verified on Linux engines only; `system-ui` fonts differ on Windows/Apple, so checklist step 4 watches for a jump.
- No defects (no D-S2.x).

**Retro**
- Went well: scope cut early with a clear rule (cut Should stories, never quality); edge sweep and axe now run on 3 engines in CI; a cross-agent doc review caught the missing edge tests.
- Didn't go well: the edge tests planned at Stage 5 were silently skipped until Sprint 2; an agent review made unverified claims; the layout headroom is very thin; the live URL can't be checked from the container.
- Change: QA confirms every planned test file exists before signing a sprint; reviewers cite file + line for each claim; the PO runs the real-browser checklist on the live URL before release.
