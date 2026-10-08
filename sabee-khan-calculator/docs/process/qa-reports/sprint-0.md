# QA report — Sprint 0 Scaffold and shell

Build: uncommitted working tree on `main` (on top of `72c6927`), 2026-10-08 · Verifier: qa-engineer · Built bundle: `index-BlFyw9Yr.js`, `index-CbEpDaEl.css` (the same from the clean install and from the real package)
Scope: package scaffold, design tokens, static app shell (backlog.md "Sprint 0"). There is no calculation yet, so the story ACs (S-1..S-4) are out of scope.
Environment: Node v22.22.0 (meets `engines >=20`, as technical-design.md notes), npm 10.9.4, Playwright 1.56.1, Chromium 1194 from `/opt/pw-browsers`.

## Checks
| # | Check | Command / method | Result | Evidence |
|---|-------|------------------|--------|----------|
| 1 | Clean install | Copied the package (without node_modules, dist, test-results) to scratchpad `qa-s0/pkg`; `npm ci` | PASS | "added 52 packages, and audited 53 packages in 1s … found 0 vulnerabilities" |
| 2 | Unit tests | `npm test` (clean copy) | PASS | Vitest 4.1.11: "Test Files 1 passed (1) · Tests 5 passed (5)" (T-M.1a..T-M.1e) |
| 3 | Catalogue matches the docs | Own script: every `\| M-n \| … \| "text" \|` row in user-stories.md compared with `src/messages.ts` | PASS | "doc entries 40 mismatches 0" |
| 4 | Build | `npm run build` (clean copy) | PASS | `tsc --noEmit` clean; vite 6.4.4 "✓ 10 modules transformed"; dist/index.html 0.58 kB, CSS 9.77 kB, JS 3.01 kB; built HTML `<title>Quiz score and pass-mark calculator</title>`, relative `./assets/…` paths (ADR-008) |
| 5 | Audit | `npm audit` (clean copy) | PASS | "found 0 vulnerabilities"; `npm ls --omit=dev` → "(empty)" (no runtime dependencies) |
| 6 | E2E, Chromium | `npx playwright test --project=chromium` (clean copy) | PASS | "4 passed (5.0s)": E-0.1, E-0.2, E-0.3, E-0.4 |
| 7 | E2E, Firefox | `npx playwright test --project=firefox` | NOT RUN — blocked (environment) | All 4 failed at launch: "browserType.launch: Executable doesn't exist at /opt/pw-browsers/firefox-1495/firefox/firefox". The proxy log shows `cdn.playwright.dev:443` and `playwright.download.prss.microsoft.com:443` refused with "gateway answered 403 to CONNECT (policy denial…)". Not worked around (CLAUDE.md §16). |
| 8 | E2E, WebKit | `npx playwright test --project=webkit` | NOT RUN — blocked (environment) | "Executable doesn't exist at /opt/pw-browsers/webkit-2215/pw_run.sh"; same download block |
| 9 | Dev server | Real package: `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` in the background, curl, then stopped | PASS | "VITE v6.4.4 ready in 219 ms"; `GET /` → HTTP 200, `<title>Quiz score and pass-mark calculator</title>`; `/src/main.ts` → 200. Stopped (port 5173 no longer answers). |
| 10 | Preview server | Real package: `npm run build -- --outDir <scratch>/real-dist`, then `npm run preview -- --outDir <scratch>/real-dist` on 127.0.0.1:4173, curl, then stopped | PASS | Build output identical to the clean build (`diff -r`: no difference); `GET /` → HTTP 200, title = M-30; JS asset → 200. Built to a scratch folder so the ux-ui-designer's preview of `dist/` on 4174 was not disturbed. Stopped. |
| 11 | Shell checks | Own Playwright script (scratchpad `qa-s0/scripts/shell-check.mjs`, Chromium, against the 4173 preview). Expected text retyped from user-stories.md, not imported. | PASS (52/53; the 1 FAIL was a mistake in my script, see note) | See the next table |
| 12 | Hygiene | `git status --short`, `git check-ignore -v`, `git ls-files` audit | PASS | See "Hygiene" |

### Shell checks (Chromium, preview build, 1280 px unless stated)
| Check | Observed | Result |
|-------|----------|--------|
| Title = M-30 | "Quiz score and pass-mark calculator" | PASS |
| `html lang` | "en" | PASS |
| One h1 = M-32, one heading in total | ["Check a quiz result"], 1 heading | PASS |
| Eyebrow M-31 above the h1 | "Quiz score" visible (CSS upper-case), y=81 < h1 y=101.8 | PASS |
| Subheading M-33 | "A score at or above the pass mark is a pass." visible | PASS |
| `getByLabel("Marks earned", exact)` | 1 input, type=text, inputmode=decimal, autocomplete=off, value "", no aria-invalid | PASS |
| `getByLabel("Total marks possible", exact)` | 1 input, same attributes, value "" | PASS |
| `getByLabel("Pass mark (percent)", exact)` (M-36 + M-37) | 1 input, same attributes, value "70" | PASS |
| M-37 " (percent)" visually hidden | span 1×1 px, `position:absolute`, `overflow:hidden`, `clip: rect(0,0,0,0)`; not visible in the screenshots; ARIA snapshot: `textbox "Pass mark (percent)": "70"` | PASS |
| Visible "%" suffix (M-38) | "%" with `aria-hidden="true"` | PASS |
| Result region | `region` named "Score" (M-39) contains M-1 "Enter marks earned and total marks possible to see the score." | PASS |
| Live region | 1 × `role=status`, `aria-live=polite` | PASS |
| Button M-25 | "Next learner", type=button, `aria-keyshortcuts="Escape"` | PASS |
| Hint M-40 | "or press Esc" (Esc shown in `<kbd>`) | PASS |
| Tab order from page start | earned → total → pass-mark → Next learner (5th Tab leaves the page) | PASS |
| Focus ring (`:focus-visible` = true on all 4) | light: `outline: solid 2px rgb(31,78,121)`, offset 2px; dark: `solid 2px rgb(142,185,232)` | PASS |
| Focus ring contrast (computed from tokens.css) | light 8.66:1 on surface, 7.81:1 on background; dark 8.16:1 / 9.09:1 (spec ≥ 7.8:1) | PASS |
| Targets ≥ 44×44 | earned 240×44, total 240×44, pass 240×44, Next learner 131.5×44 | PASS |
| No horizontal scroll, light | 320 / 375 / 768 / 1280: scrollWidth = clientWidth (320, 375, 768, 1280); no element past the right edge | PASS |
| No horizontal scroll, dark | 320 / 375 / 768 / 1280: scrollWidth = clientWidth | PASS |
| No "NaN", "undefined", "Infinity" | not in `innerText` or `textContent` | PASS |
| Shell robustness (no calculation yet) | typed "abc" / "1e400", Enter, Esc, 2 clicks + double-click on Next learner: result still M-1, no NaN, no errors | PASS |
| Reload | values back to "", "", "70" | PASS |
| External requests | none outside 127.0.0.1:4173 (no CDN, no web fonts) | PASS |
| Dark theme active under `colorScheme: 'dark'` | `prefers-color-scheme: dark` matches; body background rgb(17,19,22) | PASS |

Note on the 1 FAIL in the script run: my check "visible pass-mark label text = 'Pass mark'" read `innerText` and got "Pass mark\n(percent)". Chromium's `innerText` still includes text that is clipped to 1 px (sr-only), so it does not show what is painted. I re-checked with computed styles, text rects, the ARIA snapshot and screenshots: "(percent)" is not painted, and the accessible name is "Pass mark (percent)" as the spec says. This was a mistake in my script, not a code defect.

## Accessibility (axe, @axe-core/playwright 4.13.0, Chromium, idle state)
| Theme | Tags | Violations | Passes | Incomplete |
|-------|------|------------|--------|------------|
| Light | wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa | 0 | 22 | 0 |
| Light | all rules (including best-practice) | 0 | — | — |
| Dark (`colorScheme: 'dark'`) | wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa | 0 | 23 | 0 |
| Dark | all rules (including best-practice) | 0 | — | — |

## Console errors/warnings: none
- Chromium, light and dark contexts: 0 console messages of any type, 0 page errors, 0 failed requests (my script).
- The committed e2e fixture (`consoleGuard`) also failed none of the 4 Chromium tests.
- Firefox / WebKit: not observed (engines not installed, see checks 7 and 8).

## Browser matrix
| Engine | Unit | E2E (E-0.1..E-0.4) | Shell script + axe | Console |
|--------|------|--------------------|--------------------|---------|
| Chromium 1194 | PASS (5/5, Node) | PASS 4/4 | PASS | none |
| Firefox 1495 | n/a | NOT RUN — blocked (environment): browser download refused by proxy (403) | NOT RUN | NOT RUN |
| WebKit 2215 | n/a | NOT RUN — blocked (environment): same | NOT RUN | NOT RUN |

## Hygiene
- `git status --short`: 4 deleted `.gitkeep` files (src/styles, src/ui, tests/e2e, tests/unit, which now hold real files) plus untracked Sprint 0 files (package files, configs, `index.html`, `src/**`, `tests/**`) and the ux-ui-designer's `docs/process/design/screenshots/shell-*.png`. Nothing staged or committed by QA.
- `git check-ignore -v`: `node_modules` → `.gitignore:2 node_modules/`; `dist` → `:3 dist/`; `test-results` → `:6 test-results/`; `playwright-report/…` → `:5`; `coverage/…` → `:4`; `blob-report/…` → `:7`; `.env` → `:11`.
- `git status --ignored`: only `.private/`, `sabee-khan-calculator/dist/`, `node_modules/`, `test-results/` are ignored. None of them appear among the untracked files, so `git add -A` would not pick them up.
- `git ls-files | grep -E 'node_modules|dist/|coverage|playwright-report|test-results|\.env|\.private'` → nothing.

## Sprint 0 DoD (backlog.md exit and CLAUDE.md §9)
| Item | Result |
|------|--------|
| `npm ci && npm test && npm run test:e2e && npm run build` pass | PASS on Chromium; Firefox/WebKit NOT RUN (environment) |
| Package files: engines `>=20`, zero runtime dependencies, lock file, `.nvmrc` 20, strict tsconfig, `base: './'`, 3 Playwright projects | PASS (checked by reading the files) |
| Shell shows heading, 3 fields (pass mark "70"), divider, idle result M-1, button + Esc hint, all text from `messages.ts` | PASS |
| Keyboard-operable; no console errors or warnings | PASS (Chromium) |
| Tests written first and shown failing | Not checkable by QA: the work is uncommitted, so there is no history. Rely on the developer's Handoff Return. |
| ux-ui-designer confirms the shell matches the mockup | Not a QA check; the designer is doing it in parallel |
| Committed and pushed | Not yet (by design; done after this gate) |

Observations (not defects):
- O-1: Esc and "Next learner" do nothing yet. That is expected for Sprint 0 ("no event handling beyond what the shell needs"); the behaviour comes with S-4. The hint "or press Esc" is visible before it works. It must be wired in S-4.
- O-2: T-M.2 ("every error code maps to exactly one message") is not in the suite yet. No error codes exist until S-3, so it belongs to that story.

## Manual checks for the PO (real Chrome, Edge, Firefox, Safari)
Your browser can't reach this container's `localhost`. Do these later, either on a local run (README steps) or on the GitHub Pages URL once it exists.
1. Open the page. The browser tab reads "Quiz score and pass-mark calculator".
2. The card shows "QUIZ SCORE", "Check a quiz result", "A score at or above the pass mark is a pass.", then three boxes: "Marks earned" (empty), "Total marks possible" (empty), "Pass mark" (shows 70 with a % sign).
3. Under "SCORE" it reads "Enter marks earned and total marks possible to see the score." There is a "Next learner" button with "or press Esc" beside it.
4. Click in the page, then press Tab four times. Focus moves Marks earned → Total marks possible → Pass mark → Next learner, and each one shows a clear blue outline.
5. Switch your computer to dark mode and reload. The page turns dark, all text is still easy to read, and the focus outline is still clear.
6. On a phone (or with the window made very narrow), the card fits the screen with no sideways scrolling. Tapping a box opens the number keypad with a decimal point.
7. In Firefox: type something in the boxes, then reload. The boxes go back to empty, empty, 70.
8. Firefox and Safari matter most here, because this container could not run them (see the browser matrix).

## Verdict: PASS
PASS for Sprint 0 on Chromium: clean install, unit tests, build, audit, dev and preview servers, every shell check, axe (0 violations, light and dark), console clean, hygiene clean. **Firefox and WebKit were NOT RUN** because the environment's network policy blocks the browser downloads (proxy 403 on cdn.playwright.dev and playwright.download.prss.microsoft.com). This is an environment limit, not a code defect, and was not worked around. Cross-engine evidence for those two engines rests on PO manual checks 1–8 until the engines are available. No defects (D-x) found.
