# Release audit — Stage 9, `main` @ 16907b6

Auditor: release-auditor. Date: 2026-10-08. Source: a fresh `git clone https://github.com/Sabeekhann/Web-Calculator.git` (HEAD 16907b6108504af5d8f94279eca58881b08b6373), README followed word for word. Not the working copy.

Environment notes (not README defects): the audit container has Node v22.22.0 / npm 10.9.4 (README asks for Node 20; CI is the Node 20 evidence, v20.20.2). `npx playwright install` cannot download Firefox/WebKit here (network policy, ADR-009), so local e2e ran with `--project=chromium`; Firefox and WebKit results come from CI. github.io is unreachable from this container; the live URL is verified by the PO (DEC-18).

## Findings

| ID | Check | Expected | Actual (evidence) | Severity | Owner agent |
|----|-------|----------|-------------------|----------|-------------|
| RA-1 | README "Running the tests" on a clean Linux machine | The steps given are enough to run e2e on all three engines | README says `npx playwright install`; CI needs `npx playwright install --with-deps chromium firefox webkit` (ci.yml line 62). On a Linux machine without the browsers' system libraries, Firefox/WebKit fail to launch until `npx playwright install-deps` is run. Windows and macOS are not affected; unit tests, dev and build are not affected | minor | docs-writer |
| RA-2 | README links stay inside the package (D17) | Links resolve when `sabee-khan-calculator/` is read on its own | 3 links leave the package: `../.github/workflows/ci.yml`, `../.github/workflows/pages.yml`, `../CLAUDE.md`. They work on GitHub (all resolve in the repo), but break if the package folder is shared alone | minor | docs-writer |
| RA-3 | user-stories.md intro line | Names every assumption the stories rely on | Intro says "rules follow A-1..A-9 (approved) and A-10..A-17 (approved, DEC-9)"; A-18 (DEC-12, lone "." = empty) is not mentioned, though S-3 behaviour follows it | minor | product-analyst |
| RA-4 | Traceability table titles vs story headings | Titles identical | S-5 and S-6 headings end with "(future)" ("## S-5 — Copy the outcome as one line (future)"), the table titles do not. IDs, jobs, roles and statuses all match | minor | product-analyst |
| RA-5 | CI annotations for 16907b6 | No warnings | 1 warning per check run: GitHub says actions/checkout@v4, setup-node@v4, upload-artifact@v4, configure-pages@v5, deploy-pages@v4 target the deprecated Node 20 action runtime and are forced onto Node 24. Platform notice only; the app's own Node is still 20 (annotation "Node v20.20.2"); all checks success | minor (info) | developer |

No blocker or major findings.

## Evidence

### 1. Clean-clone audit (README followed literally)

```
$ git clone https://github.com/Sabeekhann/Web-Calculator.git
$ cd Web-Calculator/sabee-khan-calculator
$ npm ci
added 52 packages, and audited 53 packages in 1s
found 0 vulnerabilities
$ npm run dev
  VITE v6.4.4  ready in 256 ms
  ➜  Local:   http://localhost:5173/          (HTTP 200)
$ npm test
 Test Files  4 passed (4)
      Tests  131 passed (131)
$ npx playwright install
Error: Failed to download Firefox 142.0.1 (playwright build v1495)   (environment, ADR-009)
$ npm run test:e2e -- --project=chromium
  51 passed (36.5s)
$ npm run build
dist/index.html 0.64 kB · dist/assets/index-*.css 8.67 kB · dist/assets/index-*.js 9.56 kB · ✓ built in 270ms
$ npm run preview
  ➜  Local:   http://127.0.0.1:4173/          (HTTP 200)
```

E2E per spec (`playwright test --list --project=chromium`): shell 4, S-1 8, S-2 9, S-3 10, a11y 10, edge 10 = 51, matching the README table.

CI for 16907b6: run 37804095421 "CI" success (all steps: npm ci, npm audit, unit, build, Playwright install, e2e on 3 engines); run 37804096075 "Deploy to GitHub Pages" success. Annotations: Node v20.20.2 · Unit 131 passed, 0 failed · E2E chromium 51 / firefox 51 / webkit 51 passed, 0 failed, 0 flaky · total 153.

### 2. Hygiene

`git ls-files` (96 files) filtered for node_modules, dist/, coverage, playwright-report, test-results, .env, .private, secret, .pem, .key: no output. Secret patterns (sk-, ghp_, gho_, github_pat_, AKIA, BEGIN PRIVATE KEY) in tracked files: one match only, the pattern list itself in `.claude/agents/release-auditor.md:28` (documentation, not a secret). `.private/` is gitignored (`.gitignore:19`).

### 3. Layout (D17)

`sabee-khan-calculator/` holds README.md, src/ (logic, validation, ui, styles, messages.ts, main.ts), docs/app-roles.md, docs/jobs-to-be-done.md, docs/user-stories.md, docs/process/, tests/, transcripts/ (only `.gitkeep`; session files come at Stage 10).

### 4. Traceability

| Story | Job(s) (exists?) | Role of job (exists?) | Table status | Story line status |
|-------|------------------|-----------------------|--------------|-------------------|
| S-1 | J-1, J-3 (yes) | R-1, R-2 (yes) | Implemented | Implemented |
| S-2 | J-2 (yes) | R-1 (yes) | Implemented | Implemented |
| S-3 | J-4 (yes) | R-2 (yes) | Implemented | Implemented |
| S-4 | J-5 (yes) | R-2 (yes) | Not implemented | Not implemented |
| S-5 | J-5 (yes) | R-2 (yes) | Not implemented | Not implemented |
| S-6 | J-2 (yes) | R-1 (yes) | Not implemented | Not implemented |

Every job J-1..J-5 names a role in app-roles.md and has at least one story; no orphan story, job or role.

### 5. Docs vs app

Own Playwright script (Chromium) on the built app (`npm run build && npx vite preview --port 4173 --strictPort`): 24 ACs S-1.1..S-3.8 as 54 checks, plus README quick check steps 1–7 (9 checks), 63/63 PASS, 0 console errors or warnings. The quick check was also run against `npm run dev`: 63/63 PASS. Extra: no buttons on the page (S-4 not built), page title "Quiz score and pass-mark calculator", no horizontal scroll at 375 px.

README claims checked: 131 unit tests (true), 51 e2e per engine and spec table counts (true), "no runtime dependencies" (package.json has devDependencies only), Node 20 (`.nvmrc` 20, engines ">=20", CI v20.20.2), `npm run preview` serves at 127.0.0.1:4173 (true, vite.config.ts), `retries: 0` (true), `npm audit` in CI (true), "Code changed by hand: None." (all 56 commits since cccb670 carry the Claude co-author trailer), all relative links resolve in the repo, live URL: verified by PO (DEC-18), Pages deploy of 16907b6 succeeded.

### 6. D1–D23

Updated in `delivery-tracker.md`. DONE: D1–D8, D10–D16, D21, D22. IN PROGRESS: D17 (transcripts at Stage 10), D18 (PO sends, Q-1), D19 (signed-out content check at Stage 11). OPEN: D9 (transcripts), D20 (submission email), D23 (walkthrough notes not yet written).

## Summary

A stranger can clone, install, run, test and build the app by following the README; every Implemented story's acceptance criteria hold in the built app, and the README's numbers and claims match reality and CI. The 5 findings are all minor and none blocks release. The remaining open rows (D9, D17, D18, D19, D20, D23) depend on Stage 10–11 PO actions.
