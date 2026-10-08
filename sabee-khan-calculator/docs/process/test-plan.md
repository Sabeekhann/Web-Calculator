# Test Plan

Stage 5, solution-architect. Every AC of S-1..S-3 maps to at least one test (CLAUDE.md §12). Tests are written first and shown failing.
Test titles start with their ID (`test('E-S1.3 …')`) so QA reports can quote them. Expected text is imported from `src/messages.ts`, never retyped, except where the AC quotes a number.

## AC → test mapping (24 of 24 implemented ACs mapped; S-4 cut, DEC-17)

Unit tests (T) call `toViewModel`, `validateInputs` or the logic functions with the AC's exact strings. E2E tests (E) type into the running build on Chromium, Firefox and WebKit.

| AC | Description | T-ID (unit) | E-ID (e2e) | MANUAL reason |
|----|-------------|-------------|------------|---------------|
| S-1.1 | 17.5 of 23 @ 70 → "76.0%", Pass, live (no key/button) | T-S1.1 | E-S1.1 | — |
| S-1.2 | 17.5 of 25 (exactly 70%) → "70.0%", Pass | T-S1.2 | E-S1.2 | — |
| S-1.3 | 17.49 of 25 → "69.9%", Fail, never "70.0%" (E types key by key, checks after each) | T-S1.3 | E-S1.3 | — |
| S-1.4 | 2 of 3 → "66.6%" (down), Fail | T-S1.4 | E-S1.4 | — |
| S-1.5 | pass 0: 0 of 23 → "0.0%" Pass; pass 100: 23 of 23 → "100.0%" Pass | T-S1.5 | E-S1.5 | — |
| S-1.6 | pass 100: 999999.99 of 1000000 → "99.9%", Fail | T-S1.6 | E-S1.6 | — |
| S-1.7 | 0.01 of 1000000 → "0.0%", Fail | T-S1.7 | E-S1.7 | — |
| S-1.8 | after result: earned 15.5 → "67.3%" Fail; pass 65 → Pass, "67.3%" | T-S1.8 | E-S1.8 | — |
| S-2.1 | 15.5 of 23 → Fail, "0.6 marks short …" | T-S2.1 | E-S2.1 | — |
| S-2.2 | 17.5 of 23 → Pass, "1.4 marks above …" | T-S2.2 | E-S2.2 | — |
| S-2.3 | 17.5 of 25 → Pass, M-10 | T-S2.3 | E-S2.3 | — |
| S-2.4 | total 20: 13 → M-7 "1 mark short"; 15 → M-9 "1 mark above" | T-S2.4 | E-S2.4 | — |
| S-2.5 | total 23.33: 16 → "0.34 … short" (up); 17 → "0.66 … above" (down) | T-S2.5 | E-S2.5 | — |
| S-2.6 | pass 69.9, total 23: 16.07 → "69.8%" Fail "0.01 … short"; 16.08 → "69.9%" Pass M-11 | T-S2.6 | E-S2.6 | — |
| S-2.7 | total 1000000: "699,999.99 … short"; "0.01 … short"; "1,000,000 … above" | T-S2.7 | E-S2.7 | — |
| S-2.8 | after result: earned 16.1 → "70.0%" Pass M-10; pass 65 → "1.15 … above" | T-S2.8 | E-S2.8 | — |
| S-3.1 | only earned, or spaces in total → M-1, no score, no field error | T-S3.1 | E-S3.1 | — |
| S-3.2 | pass mark cleared → "76.0%" + M-2, no verdict/gap/error | T-S3.2 | E-S3.2 | — |
| S-3.3 | "abc", "17,5", "$17", "1.2.3", "1e400", "+5" → M-12 + M-3; total "abc" → M-16; pass "seventy" → M-21; " 017.5 " → "76.0%" | T-S3.3 | E-S3.3 | — |
| S-3.4 | "-1", "-0" → M-13; total "-23" → M-17; pass "-5" → M-22; no score | T-S3.4 | E-S3.4 | — |
| S-3.5 | "17.555" → M-14; total "23.001" → M-18; pass "70.05" → M-23; no score | T-S3.5 | E-S3.5 | — |
| S-3.6 | total "0" → M-19; "1000000.01" → M-20; "8" → M-15 under earned; pass "100.1" → M-24; "1000000" → "0.0%" | T-S3.6 | E-S3.6 | — |
| S-3.7 | earned "abc" + total "0" → M-12 and M-19 together, M-3 | T-S3.7 | E-S3.7 | — |
| S-3.8 | M-15 for 23.5 of 23; earned → 17.5 clears it ("76.0%", Pass, "1.4 … above"); or total → 25 ("94.0%", Pass, "6 marks above …") | T-S3.8 | E-S3.8 | — |
| S-4.1..S-4.5 | Next learner button / Escape | Not implemented (cut, DEC-17) — no tests | — | — |

Count: S-1 8 + S-2 8 + S-3 8 = **24 ACs, 24 mapped** (all with a T-ID and an E-ID, 0 manual-only). No AC is untestable as written.
Future, not mapped: S-4 (S-4.1..S-4.5, cut by DEC-17), S-5 (S-5.1, S-5.2) and S-6 (S-6.1..S-6.3).

## Supporting tests (not tied to one AC)
| ID | File | What it proves |
|----|------|----------------|
| (supporting) | `tests/unit/S-1.test.ts`, `S-2.test.ts` ("supporting" blocks) | `floorDiv`/`ceilDiv` exact at 10¹¹; largest products ≤ `Number.MAX_SAFE_INTEGER`; `formatMarks` (0.6, 6, 0.01, 1,000,000, 699,999.99); `formatScore` (0.0, 66.6, 100.0) |
| T-M.1..M.2 | `tests/unit/messages.test.ts` | every M-1..M-40 text verbatim; every error code maps to exactly one message |
| E-0.1..0.4 | `tests/e2e/shell.spec.ts` | smoke: title = M-30, labels M-34..M-36, pass mark "70"; E-0.2 Tab order earned → total → pass mark, which ends it (3 focusables in the card); E-0.3 idle M-1 and the Next learner button and Esc hint are ABSENT (DEC-17); E-0.4 no horizontal scroll at 320 px |
| (supporting) | `S-2.spec.ts`, `S-3.spec.ts` | no layout shift: the card's bottom edge (`.card` bounding box) stays put between states |
| E-EDGE.0..9 | `tests/e2e/edge.spec.ts` | CLAUDE.md §12 edge sweep (see table below) |
| E-A11Y.1 | `tests/e2e/a11y.spec.ts` | axe: 0 violations in 5 states (idle, Pass, Fail, error, pass-mark-empty) × light/dark, tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`; all 3 engines in CI |
| (all E) | `tests/e2e/fixtures.ts` | shared fixture fails any test on a console error, console warning or page error (DoD) |

## Edge sweep (CLAUDE.md §12)
Automated in `tests/e2e/edge.spec.ts` (Stage 8, E-EDGE.0..E-EDGE.9, all 3 engines in CI). E-EDGE.0 checks that the messages the spec quotes match `messages.ts`; E-EDGE.9 sweeps states for NaN/Infinity/undefined and a blank result area.
| Case | Example inputs | Where tested |
|------|----------------|--------------|
| Empty | "" in earned / total / pass | T-S3.1, T-S3.2, E-S3.1, E-S3.2, E-EDGE.9 |
| Whitespace | "   ", "\t" in each field (→ empty, A-12); " 17.5 " | T-S3.1, T-S3.3, E-S3.1, E-S3.3, E-EDGE.1, E-EDGE.4/.5 |
| Letters | "abc", "seventy" | T-S3.3, E-S3.3, E-EDGE.6 |
| Symbols | "$17", "17,5", "+5" in each field (→ not-a-number) | T-S3.3, E-S3.3, E-EDGE.4/.5 |
| "1e400" | "1e400" in each field; earned "1e400" + total "Infinity" + pass "NaN" | T-S3.3, E-S3.3, E-EDGE.4/.5, E-EDGE.9 |
| "-0" | "-0" in each field | T-S3.4, E-S3.4, E-EDGE.9 |
| Multiple dots | "1.2.3", "..", "--5" | T-S3.3, E-S3.3, E-EDGE.9 |
| Leading zeros | " 017.5 "; "007" (= 7) in each field | T-S3.3, E-S3.3, E-EDGE.4/.5 |
| Negatives | "-1", "-23", "-5", "-17.555" (→ M-13, A-15 order) | T-S3.4, E-S3.4 |
| 0 | earned "0", total "0", pass "0" | T-S1.5, T-S3.6, E-S1.5, E-S3.6, E-EDGE.9 |
| Maximum allowed | total "1000000", pass "100"; just over: "1000000.01", "100.1" | T-S1.6, T-S2.7, T-S3.6, E-S1.6, E-S2.7, E-S3.6, E-EDGE.9 |
| Very long input | 400 × "9" in each field (→ M-15 / M-20 / M-24), 400 digits + ".123" (→ dp message, A-15), 400 digits + "x" (→ M-16); no sideways scroll at 320 and 1280 px | E-EDGE.3 |
| Pasted values | "$17", "17,5", "1e400", "+5", " 17.5 ", "007" via `fill` and via `keyboard.insertText` | E-EDGE.4 (fill), E-EDGE.5 (insertText); real paste by PO (manual) |
| Repeated Enter | Enter ×5 in each field in result, error and idle states: no reload, values and output unchanged | E-EDGE.6 |
| Rapid clicking | n/a: no button since DEC-17; rapid typing: "17.5" and ".5" key by key in each field, no error flash | E-S1.3, E-EDGE.8 |
| Recovery after error | fix the field after M-15; valid values after "-" | T-S3.8, E-S3.8, E-EDGE.2 |
| Page reload | after a result, total "0", earned "-": reload → "", "", "70", M-1 (no restored values) | E-EDGE.7 |
| Bare "." / "-" (A-18) | ".", " . " → empty (M-1, or "76.0%" + M-2 for pass); "-", "-.", " - " → that field's negative message + M-3 | E-EDGE.1, E-EDGE.2 |

Not automated (qa-engineer's sweep, recorded in the QA report): "€5", "17 .5", pass "070", "17.5\t".

## Browser matrix
| Engine (Playwright 1.56.1) | Stands for | Runs | Where (ADR-009) |
|----------------------------|-----------|------|-----------------|
| Chromium | Chrome, Edge | every E test (shell, S-1..S-3, edge, a11y with axe) | build container (local QA) + GitHub Actions CI |
| Firefox | Firefox | same | GitHub Actions CI only |
| WebKit | Safari | same | GitHub Actions CI only |

- `playwright.config.ts`: 3 projects; `webServer` = `npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`, so e2e checks the real bundle with `base: './'`.
- The build container cannot download Playwright's Firefox/WebKit builds (proxy 403, DEC-13), so `.github/workflows/ci.yml` runs all 3 projects on ubuntu-latest with Node 20 from `.nvmrc` on every push/PR.
- **QA evidence rule:** a Firefox or WebKit cell in a QA report is PASS only when the CI run on the **exact commit under test** (story branch head) is green for that project; record the run URL and commit hash in Evidence. Chromium needs the local run and the same CI run. The CI run is also the evidence for Node 20 (container runs Node 22). A missing, failed or older-commit run = not verified.
- qa-engineer reads CI results through the GitHub REST API: the run for the head SHA (`GET /repos/Sabeekhann/Web-Calculator/actions/runs?head_sha=<sha>`), its job logs, and the Playwright HTML report artifact; QA never edits the workflow.
- **PO manual checks** (DoD, D1): this cloud session cannot expose `localhost` to the PO (Q-4). The PO checks in real Chrome, Edge, Firefox and Safari through the GitHub Pages live URL (DEC-17, ADR-010) or a local run on their machine using the README; these are in addition to CI, never replaced by it. Script per story: the AC examples, a real paste, Tab order, phone keypad (`inputmode`), dark mode.

## Visual review and accessibility audit
- ux-ui-designer runs headless Chromium screenshots at 375, 768 and 1280 px, light and dark (`colorScheme`), for idle, result (Pass and Fail), pass-mark-empty and error, plus a 320 px overflow check (`scrollWidth` = 320); walks the visual review checklist in ui-design.md; card height and the card's bottom edge must not change between states.
- axe (`@axe-core/playwright`, ADR-006) runs in `a11y.spec.ts` on all 3 engines with tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`; pass = 0 violations. Screen-reader output (VoiceOver/NVDA) is a PO manual check.

## Test file layout
```
tests/unit/  messages.test.ts  S-1.test.ts  S-2.test.ts  S-3.test.ts
tests/e2e/   fixtures.ts  shell.spec.ts  S-1.spec.ts  S-2.spec.ts  S-3.spec.ts  edge.spec.ts  a11y.spec.ts
```
