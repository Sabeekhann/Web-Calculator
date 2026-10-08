# QA report — Sprint 2 final hardening (DEC-17: S-4 cut; polish + hardening)
Build: `7098224e1ceda85ce64c38d90f447a4a9b36c10a` (branch `chore/sprint-2-polish`) · CI run: https://github.com/Sabeekhann/Web-Calculator/actions/runs/37801681193 · Date: 2026-10-08 · Verifier: qa-engineer

Scope: regression of S-1..S-3 (24 ACs) after removing the S-4 button/hint, tightening `--result-min-h` (196→192 px narrow, 112→100 px wide), adding the favicon, `a11y.spec.ts` and `edge.spec.ts`. S-4 is Not implemented (DEC-17) and is not tested here beyond confirming its UI is absent.

## Test runs (re-run by me)
| Check | Where | Result | Evidence |
|-------|-------|--------|----------|
| `npm ci` | container, Node 22.22.0 | PASS | clean install |
| `npm audit` | container | PASS | "found 0 vulnerabilities" |
| `npm test` | container | PASS | 4 files, **131 passed** (131) |
| `npm run build` | container | PASS | index.html 0.64 kB, CSS 8.67 kB, JS 9.56 kB |
| `npx playwright test --project=chromium` | container | PASS | **51 passed** (36.8 s): shell 4, S-1 8, S-2 9, S-3 10, a11y 10, edge 10 |
| CI, Node | Actions run 37801681193 | PASS | annotation "Node :: v20.20.2" |
| CI, audit + unit + build | same run | PASS | step "Audit dependencies" success; "Unit :: 131 passed, 0 failed, 0 skipped (4 test file(s))" |
| CI, e2e Chromium | same run | PASS | "E2E chromium :: 51 passed, 0 failed, 0 flaky, 0 skipped" |
| CI, e2e Firefox | same run | PASS | "E2E firefox :: 51 passed, 0 failed, 0 flaky, 0 skipped" |
| CI, e2e WebKit | same run | PASS | "E2E webkit :: 51 passed, 0 failed, 0 flaky, 0 skipped" |
| No retries masking failures | `playwright.config.ts` | PASS | `retries: 0`; 0 flaky reported |

CI run head_sha = `7098224e…` (exact commit under test), conclusion success. Other annotations are platform notices only (Node 20 actions deprecation; ubuntu-latest → Ubuntu 26 from 2026-10-19), not test issues. Raw job log download is blocked by this container's proxy (blob host); evidence is from the check-run annotations.

**No-layout-shift tests (1–1.5 px headroom):** "S-2 supporting: no gap line … and no layout shift when it appears" and "S-3 supporting: no layout shift between result and error states" PASS on Chromium, Firefox and WebKit (part of the 51/51 per engine above). My own Chromium measurement of the tallest state's natural height vs `--result-min-h`: 320/375 px → 191.0 vs 192 (1.0 px headroom); 600/768/1280 px → 98.5 vs 100 (1.5 px). No state overflows the reserved height.

## Regression — test changes vs `main` (`git diff origin/main -- tests`)
| File | Change | Weakened? |
|------|--------|-----------|
| `S-2.spec.ts` | no-shift anchor: Next-learner button `y` → `.card` bottom edge (`y + height`), same states, same exact `toBe` | No — the card bottom also catches card-height growth, so it is at least as strict |
| `S-3.spec.ts` | same anchor change in the S-3 supporting test | No |
| `shell.spec.ts` | E-0.2: Tab to Next learner → "exactly 3 focusables in card, last = `#pass-mark`"; E-0.3: button/hint asserted ABSENT; 44 px target check now on all 3 inputs (was button + earned) | No — intended DEC-17 change; target-size coverage widened |
| `unit/S-1.test.ts` | comment wording only | No |
| `a11y.spec.ts`, `edge.spec.ts` | new | n/a (added coverage) |
| `S-1.spec.ts`, `fixtures.ts`, `unit/S-2`, `unit/S-3`, `unit/messages` | unchanged | No |

All E-S1.x, E-S2.x, E-S3.x AC tests are byte-identical to `main`.

## Regression — S-1..S-3 ACs
| AC | Test IDs | Chromium | Firefox | WebKit | Result | Evidence |
|----|----------|----------|---------|--------|--------|----------|
| S-1.1 … S-1.8 | T-S1.1..8, E-S1.1..8 | PASS | PASS | PASS | PASS | local 8/8 + CI run 37801681193 |
| S-2.1 … S-2.8 | T-S2.1..8, E-S2.1..8 (+ supporting no-shift) | PASS | PASS | PASS | PASS | local 9/9 + CI |
| S-3.1 … S-3.8 | T-S3.1..8, E-S3.1..8 (+ supporting no-shift) | PASS | PASS | PASS | PASS | local 10/10 + CI |

24/24 ACs PASS on all 3 engines; unit 131/131.

## Hardening checks (own Playwright script, Chromium, `vite preview` on 127.0.0.1:4173 serving this build; server stopped afterwards)
| # | Check | Result | Observed |
|---|-------|--------|----------|
| H-1 | Keyboard Tab order | PASS | Tab from page start: earned > total > pass-mark > BODY > earned (wraps, no trap); Shift+Tab from pass mark → total |
| H-2 | Focus ring visible | PASS | `outline: solid 2px rgb(31,78,121)`, offset 2px on focused input |
| H-3 | No Next learner / Esc hint | PASS | 0 buttons, 0 `<kbd>`, no "Next learner"/"or press Esc" text; pressing Esc leaves "17.5" untouched |
| H-4 | Labels / names | PASS | "Marks earned", "Total marks possible", "Pass mark (percent)" (M-36 + M-37); all `inputmode=decimal`, `aria-describedby=<id>-error` |
| H-5 | aria-live status | PASS | `role=status aria-live=polite aria-atomic=true`; "" at 0 ms, "76.0%, Pass, 1.4 marks above the pass mark" at 650 ms |
| H-6 | Error semantics | PASS | "23.5" of "23": `aria-invalid=true`, `#earned-error` = M-15, status = M-15 + M-3; attribute removed after fixing to "17.5" |
| H-7 | Reduced motion | PASS | with `reducedMotion: reduce` every element: transition/animation duration 0s (control without it: input 0.15s) |
| H-8 | Contrast / axe | PASS | 0 violations (wcag2a/2aa/21aa/22aa + color-contrast) in error and Fail states, light and dark, at 320 and 1280 px; 13 contrast nodes passed each |
| H-9 | 320 px, no sideways scroll | PASS | scrollWidth/clientWidth 320/320 in idle, Pass, 3-error, 400-digit input, 1,000,000-above states |
| H-10 | Favicon | PASS | `<link rel=icon href="./favicon.svg">`; GET → 200 `image/svg+xml`, valid `<svg>` |
| H-11 | Page title | PASS | "Quiz score and pass-mark calculator" (M-30) |
| H-12 | Rapid input | PASS | 30 fast type/delete cycles of "17.5" then "17.5": "76.0% Pass 1.4 marks above the pass mark", status matches, no NaN/Infinity/undefined |
| H-13 | Reload | PASS | after values + pass "65": fields "", "", "70", result M-1 |
| H-14 | Card bottom stable | PASS | 8 states (idle, Pass, Fail, 1-mark, pass-empty, 2 error mixes, M-11, 0.0%) → bottom 779.52 px @375, 692.91 px @1280, identical in every state |
| H-15 | Console | PASS | no console errors/warnings, page errors or failed requests across all script pages; e2e fixture also fails on any console message (all 153 CI tests passed) |

Edge sweep: automated in `edge.spec.ts` (E-EDGE.0–9: whitespace, lone "."/"-"/"-.", 400-digit input, pasted "$17", "17,5", "1e400", "+5", " 17.5 ", "007", Enter ×5, reload, key-by-key typing, never NaN/Infinity/undefined/blank) — 10/10 on each engine in CI. Rapid clicking: n/a (no button since DEC-17).

## Console errors/warnings: none

## Observations (not defects)
- **O-1 (doc drift):** `test-plan.md` §Edge sweep still says "no `edge.spec.ts`/`edge.test.ts` was written" and the test file layout omits `edge.spec.ts`; the file now exists (E-EDGE.0–9). For docs-writer.
- **O-2 (risk):** the 1–1.5 px headroom holds on all 3 Playwright engines on Linux, but the font stack is `system-ui` (Segoe UI on Windows, SF on Apple), so real-browser text metrics differ. PO checklist step 4 checks for a jump; if one is seen, that is a defect.
- The live URL could not be fetched from this container (proxy 403), so it was not checked here; it serves `main`, i.e. this build only after merge.

## Manual checks for the PO — final real-browser checklist
Open https://sabeekhann.github.io/Web-Calculator/ after this build is merged to `main`. Do steps 1–11 in **Chrome, Edge, Firefox and Safari** (desktop); steps 12–14 once on a phone (or desktop window made narrow).
1. Load the page. **Expect:** tab title "Quiz score and pass-mark calculator", a small icon on the tab, pass mark shows "70", the score area says "Enter marks earned and total marks possible to see the score." There is no "Next learner" button and no "or press Esc" text.
2. Type 17.5 in Marks earned and 23 in Total marks possible (don't press anything). **Expect:** "76.0%", "Pass", "1.4 marks above the pass mark".
3. Change Marks earned to 15.5. **Expect:** "67.3%", "Fail", "0.6 marks short of the pass mark". Then change the pass mark to 65. **Expect:** "Pass", score stays "67.3%".
4. Watch the bottom edge of the white card while you do step 3 and steps 6–7. **Expect:** it never jumps up or down.
5. Set pass mark 70 again, then enter 17.5 of 25. **Expect:** "70.0%", "Pass", "Exactly on the pass mark". Then 17.49 of 25. **Expect:** "69.9%", "Fail" (never "70.0%").
6. (S-1/S-2 error) Enter 23.5 of 23. **Expect:** red message under Marks earned "Marks earned can't be more than the total marks possible.", score area "The score will appear once every entry is valid.", no score. Change Marks earned to 17.5. **Expect:** message gone, "76.0%", "Pass".
7. (S-3 error) Type abc in Marks earned and 0 in Total. **Expect:** "Marks earned must be a number, like 17.5." and "Total marks possible must be more than 0." both show, no score.
8. Put 17.5 of 23 back and clear the pass mark. **Expect:** "76.0%" stays, "Enter a pass mark to see whether this is a pass or a fail.", no Pass/Fail, no red message.
9. Copy the text ` 17.5 ` (with spaces) from anywhere and paste it into Marks earned (total 23, pass 70). **Expect:** "76.0%", "Pass".
10. Click into Marks earned, then press Tab repeatedly. **Expect:** a visible blue outline moves Marks earned → Total marks possible → Pass mark, then leaves the card (to the browser bar); Shift+Tab goes back. Nothing gets stuck.
11. Switch your computer to dark mode (Windows: Settings > Personalization > Colors > Dark; Mac: System Settings > Appearance > Dark) and reload. **Expect:** dark card, all text and the red/green states easy to read. Reload also empties the fields and resets the pass mark to "70".
12. Phone: tap Marks earned. **Expect:** a number keypad with a decimal point opens.
13. Phone: enter 16.08 of 23 with pass mark 69.9. **Expect:** "69.9%", "Pass", "Less than 0.01 marks above the pass mark"; no sideways scrolling, nothing cut off.
14. Phone: enter -5 in the pass mark. **Expect:** "Pass mark can't be negative." and no score.

Report any step that differs (browser + step number + what you saw).

## Verdict: PASS
24/24 S-1..S-3 ACs PASS on Chromium, Firefox and WebKit (CI run 37801681193 on `7098224`, 51/51 per engine, 0 retries); unit 131/131; audit clean; hardening H-1..H-15 PASS; no console errors. No defects (no D-S2.x). PO real-browser checklist above still required (DoD).
