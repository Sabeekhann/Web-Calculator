# QA — Sprint 0 Scaffold and architecture skeleton   Date: 2026-10-07 · Commit: 433f847 (first pass) → f91282d4b2ace647da512a005614f1c4d2cb93dd (re-test, DEF-S0-1 fix) · Verifier: qa-engineer

Sprint 0 has no stories and no ACs. This report checks that the foundation installs, tests, builds and serves, and that it matches technical-design §1, §2, §5, §7, §8 and the backlog's Sprint 0 scope.
Environment: Node 22.22.0 / npm 10.9.4 (main runs); repeated in a scratch clone with Node 20.20.0 / npm 10.8.2; Chromium 1194 at `/opt/pw-browsers/chromium` via Playwright 1.56.1 (pre-installed, not a project dependency). The local HEAD during the re-test was `23c6d00`, which adds only the first pass of this report on top of `f91282d`.

**Verdict at f91282d:** foundation PASS. DEF-S0-1 is fixed and re-tested (R1). The Pages deploy for f91282d succeeded (L1). The live page itself could not be opened from this container, because the session proxy blocks `sabeekhann.github.io`, so L2–L4 are MANUAL for the PO. DEF-S0-2 (README Node wording) stays open for docs-writer. No open FAIL on code or config.
**Totals:** 35 rows = 31 PASS · 1 FAIL (4d, first pass; fixed, superseded by R1) · 3 MANUAL (L2–L4).

## Checks (first pass, commit 433f847)
| # | Check | Result | Evidence |
|---|---|---|---|
| 1a | Clean install (`rm -rf node_modules dist && npm install`) | PASS | "added 85 packages, and audited 86 packages in 2s … found 0 vulnerabilities"; `git status --porcelain` empty afterwards (package-lock.json unchanged) |
| 1b | `npm ci` on npm 10.9.4 | PASS | "found 0 vulnerabilities"; tree still clean |
| 1c | `npm test` | PASS | "Test Files 2 passed (2) · Tests 20 passed (20)": T-G6 ×19 (18 IDs + key-set test), T-S0.1 ×1 |
| 1d | `npm run build` (`tsc --noEmit && vite build`) | PASS | vite v8.3.3, 6 modules; `dist/index.html 0.44 kB`, `index-Cvf5jHV0.css 0.43 kB`, `index-ac-E30Rn.js 0.96 kB`; "built in 157ms" |
| 1e | Same clean run on Node 20 (`.nvmrc` target) | PASS | Node v20.20.0 / npm 10.8.2 in a scratch clone: install OK, lockfile unchanged, 20/20 tests, build OK |
| 2a | `npm run dev` in the background → `curl http://localhost:5173/` | PASS | HTTP 200, `<title>Tip &amp; Bill Splitter</title>`, `/@vite/client` injected; `/src/main.ts` HTTP 200; server stopped (port returns 000) |
| 2b | `npm run preview` in the background → `curl http://localhost:4173/` | PASS | HTTP 200, title present, assets at `/assets/…` (base `/`); server stopped (port returns 000) |
| 3a | Chromium 1280px: h1 | PASS | h1 = "Tip & Bill Splitter" (inside `<main>`); intro "Split a bill and tip fairly between friends."; `lang="en"` |
| 3b | Chromium 1280px: no horizontal scroll | PASS | scrollWidth 1280 ≤ clientWidth 1280 |
| 3c | Chromium 375px: h1 and no horizontal scroll | PASS | h1 = "Tip & Bill Splitter"; scrollWidth 375 ≤ clientWidth 375 |
| 3d | Zero console errors / page errors / failed requests | PASS | Both widths: console errors+warnings 0, pageerror 0, requestfailed 0. Only requests: `/`, the CSS and the JS (all 200), so no favicon 404 and no external calls |
| 4a | package.json: no `dependencies`; devDependencies = vite, typescript, vitest, jsdom only | PASS | `dependencies: (none)`; devDeps `jsdom,typescript,vite,vitest` |
| 4b | package.json scripts as designed | PASS | `dev: vite`, `build: tsc --noEmit && vite build`, `preview: vite preview`, `test: vitest run` |
| 4c | `engines` present | PASS | `{"node":">=20.19"}` at 433f847 |
| 4d | `engines` value as in CLAUDE.md §9 / backlog (`">=20"`) | FAIL (low), fixed in f91282d, see R1 | At 433f847: `">=20.19"`, see DEF-S0-1 |
| 4e | `.nvmrc` = 20 | PASS | bytes `2 0 \n` |
| 4f | tsconfig strict flags | PASS | `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters` all `true` (also `noFallthroughCasesInSwitch`, `noEmit`) |
| 4g | `src/messages.ts` has exactly 18 IDs, each text identical to docs/user-stories.md | PASS | Own script (`s0-catalogue-check.mjs`) parses the user-stories table and imports the real module: 18 rows, 18 keys, 0 missing, 0 extra, 18/18 identical code point by code point, all ASCII (apostrophes U+0027). Negative control: a curly `’` in a scratch copy is caught ("first diff at 19 … U+2019") |
| 4h | Shell only: no form, inputs or calculation code | PASS | Rendered DOM: 0 `form`, 0 `input/select/textarea/button`. `src/logic/`, `src/validation/`, `src/ui/format.ts` don't exist. `src/ui/app.ts` only builds `<main><h1><p>` |
| 4i | No `console.*` in src | PASS | `grep -rn 'console\.' src` → none |
| 4j | No stub / "not implemented" functions | PASS | `grep -rniE 'not implemented\|todo\|fixme\|throw\|stub' src tests` → none |
| 4k | No network calls in src | PASS | `grep -rnE 'fetch\(\|XMLHttpRequest\|WebSocket\|https?://' src` → none |
| 4l | Skeleton matches §2 for Sprint 0 | PASS | `src/result.ts` (`Result<T,E>`), `src/messages.ts` (`MESSAGES as const`, `MessageId`, `BillErrorId`, `TipErrorId`, `PeopleErrorId`), `src/types.ts` (SplitInput, Share, SplitResult, RawInputs, FieldErrors exactly as §2), `src/ui/app.ts` (`mountApp(root)`), `src/main.ts` imports `./style.css` and mounts on `#app` |
| 4m | `vite.config.ts` keeps `base: '/'` | PASS | `base: '/'`; tests `tests/**/*.test.ts`, default env node (jsdom per file, ADR-005) |
| 4n | `.github/workflows/pages.yml` | PASS | push to main + manual dispatch; `node-version-file: .nvmrc`; `npm ci` → `npm test` → `npm run build -- --base=/Web-Calculator/` → configure-pages → upload-pages-artifact (`dist`) → `actions/deploy-pages@v4`; permissions `pages: write`, `id-token: write` |
| 4o | Pages build yields `/Web-Calculator/assets` paths | PASS | `npm run build -- --base=/Web-Calculator/` → `src="/Web-Calculator/assets/index-ac-E30Rn.js"`, `href="/Web-Calculator/assets/index-Cvf5jHV0.css"`; `dist` deleted afterwards |
| 5 | Hygiene: `git ls-files \| grep -E 'node_modules\|dist/\|coverage\|\.env\|submission-email'` | PASS | prints nothing |
| 6 | Servers stopped; tree clean apart from this report | PASS | ports 5173 and 4173 return 000; no vite processes; `git status --porcelain` empty before this report was written |

## Re-test (commit f91282d)
| # | Check | Result | Evidence |
|---|---|---|---|
| R1 | DEF-S0-1: `engines` admits exactly the Node versions every installed tool supports | PASS | `engines.node` = `"^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0"`. Own script (`s0-engines-check.cjs`, npm's bundled `semver`) checked it against all 45 non-optional lockfile packages that declare `engines.node`, over 234 versions (18.0–26.25): 0 versions admitted that any package rejects, 0 rejected that all accept. Spot checks: 20.18.0 false · 20.19.0 true · 20.20.0 true · 21.7.0 false · 22.12.0 false · 22.13.0 true · 22.22.0 true · 23.11.0 false · 24.0.0 true |
| R2 | Fix scope | PASS | `git show --stat f91282d`: 3 files, 3 insertions, 3 deletions: `package.json` (engines line only), `package-lock.json` (root `engines` line only), `docs/process/technical-design.md` (Developer notes engines bullet only). No src, tests or other config touched |
| R3 | `npm ci && npm test && npm run build` on Node 22.22.0 / npm 10.9.4 | PASS | "found 0 vulnerabilities"; "Test Files 2 passed (2) · Tests 20 passed (20)"; build "✓ built in 347ms", same 3 output files; `dist` removed; no EBADENGINE warning; `git status --porcelain` clean |
| R4 | Same on Node 20.20.0 / npm 10.8.2 (scratch clone at f91282d) | PASS | `npm ci` "found 0 vulnerabilities", no EBADENGINE; "Tests 20 passed (20)"; "✓ built in 100ms"; lockfile unchanged; clone deleted |

## Live site (GitHub Pages)
| # | Check | Result | Evidence |
|---|---|---|---|
| L1 | Actions run 37660214082 (head f91282d) builds and deploys | PASS | Unauthenticated GitHub API (read-only): `status completed`, `conclusion success`. Job `build`: Check out, Set up Node, Install, Test, Build for Pages, Configure Pages, Upload artifact all `success`. Job `deploy`: Deploy `success`. https://github.com/Sabeekhann/Web-Calculator/actions/runs/37660214082 |
| L2 | `https://sabeekhann.github.io/Web-Calculator/` returns 200 | MANUAL (blocked here) | 12 polls 20 s apart (17:36:13–17:39:57 UTC) all returned `000`; curl: "CONNECT tunnel failed, response 403". The proxy status logs `sabeekhann.github.io:443 connect_rejected … 403` (egress policy). This is an environment limit, not a code defect; not routed around |
| L3 | Live page at 1280px and 375px: h1 "Tip & Bill Splitter", no horizontal scroll, zero console errors | MANUAL | Not run: host unreachable from the container (L2). `S-0_live_1280.png` / `S-0_live_375.png` were therefore NOT produced. Same build verified locally in 3a–3d |
| L4 | Live assets load from `/Web-Calculator/assets/` | MANUAL | Not observable live (L2). The equivalent local Pages-base build was verified in 4o |

## Screenshots (session scratchpad, not committed)
- `S-0_shell_1280.png`: local preview, heading and intro, centred column, 1280×800
- `S-0_shell_375.png`: local preview, heading and intro, 375px, no horizontal scroll
- `S-0_live_1280.png`, `S-0_live_375.png`: not produced (live host blocked, see L2)

## Edge sweep
Not applicable to Sprint 0: there are no inputs yet. The sweep (empty · whitespace · letters · `1e400` · negative · `0` · 50+ digits · paste · repeated Enter · recovery) starts with S-1.

## Defects
| ID | Severity | Status | Area | Steps | Expected | Actual |
|---|---|---|---|---|---|---|
| DEF-S0-1 | Low | Fixed in f91282d; re-test R1 PASS | package.json `engines` | Read `package.json` → `engines.node`; compare with what the installed tools support | A range that admits only Node versions that vite 8.3.3 (`^20.19.0 \|\| >=22.12.0`), vitest 4.1.11 (`^20 \|\| ^22 \|\| >=24`) and jsdom 29.1.1 (`^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0`) all support | At 433f847: `">=20.19"`, which admitted 22.0–22.12 and 23.x. Fix: `"^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0"`. QA's first-pass suggestion (`^20.19.0 \|\| >=22.13.0`) was itself wrong: it would have admitted Node 23, which jsdom excludes. The developer's three-part range is correct (R1). Note: this deviates from the literal `">=20"` in CLAUDE.md §9 / backlog; the reason is recorded in technical-design Developer notes, and the PO should approve it as an assumption at the gate |
| DEF-S0-2 | Low (docs, D6) | Open, assigned to docs-writer (Stage 8) | README.md line 26 | Read README "Node version" | Exact supported Node versions (D6): 20.19+, 22.13+ or 24+ | "The project targets Node 20 LTS or later". Node 20.0–20.18, 21.x, 22.0–22.12 and 23.x don't meet the tool requirements |

No NaN, Infinity, undefined, blank output, console error or crash was observed.

## Manual checks for the PO
The site is now deployed (L1). Open https://sabeekhann.github.io/Web-Calculator/ in each browser. This also closes L2–L4, which QA could not reach from the cloud container.
- **Chrome:** the page loads; the heading reads "Tip & Bill Splitter" with "Split a bill and tip fairly between friends." under it; the tab title is "Tip & Bill Splitter"; there's no sideways scrolling when the window is narrowed to phone width.
- **Edge:** same checks as Chrome.
- **Firefox:** same checks as Chrome.
- **Safari (Mac or iPhone):** same checks as Chrome; on iPhone, the text fits the screen with no sideways scrolling.
- Optional, in any one browser: press F12, open the Console tab, reload, and confirm there are no red errors. In the Network tab, the two files should load from addresses containing `/Web-Calculator/assets/`.
