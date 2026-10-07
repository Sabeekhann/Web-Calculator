# QA — Sprint 0 Scaffold and architecture skeleton   Date: 2026-10-07 · Commit: 433f847 (433f84709927f0de91ba633ea726046801957e61, main) · Verifier: qa-engineer

Sprint 0 has no stories and no ACs. This report checks that the foundation installs, tests, builds and serves, and that it matches technical-design §1, §2, §5, §7, §8 and the backlog's Sprint 0 scope.
Environment: Node 22.22.0 / npm 10.9.4 (main run); repeated in a scratch clone with Node 20.20.0 / npm 10.8.2; Chromium 1194 at `/opt/pw-browsers/chromium` via Playwright 1.56.1 (pre-installed, not a project dependency).

**Verdict:** foundation PASS (install, test, build, dev, preview, Chromium shell, catalogue, hygiene). One low-severity config deviation (DEF-S0-1) needs a PO decision, and one README accuracy item (DEF-S0-2) goes to docs-writer. Neither blocks Sprint 1.

## Checks
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
| 4c | `engines` present | PASS | `{"node":">=20.19"}` |
| 4d | `engines` value as in CLAUDE.md §9 / backlog (`">=20"`) | FAIL (low) | Actual `">=20.19"`, see DEF-S0-1. The deviation is justified and recorded in technical-design Developer notes, but no approved ADR covers it |
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

Context only (not re-verified by QA): the Orchestrator reports that GitHub Actions run 37659600286 for this commit passed `npm ci`, `npm test` and the Pages build on Node 20, and failed only at `actions/configure-pages` because Pages is not yet enabled in the repo settings (PO action: Settings → Pages → Source: "GitHub Actions").

## Screenshots (session scratchpad, not committed)
- `S-0_shell_1280.png`: heading and intro, centred column, 1280×800
- `S-0_shell_375.png`: heading and intro, 375px, no horizontal scroll

## Edge sweep
Not applicable to Sprint 0: there are no inputs yet. The sweep (empty · whitespace · letters · `1e400` · negative · `0` · 50+ digits · paste · repeated Enter · recovery) starts with S-1.

## Defects
| ID | Severity | Area | Steps | Expected | Actual |
|---|---|---|---|---|---|
| DEF-S0-1 | Low (needs PO decision) | package.json `engines` | Read `package.json` → `engines.node`; compare with CLAUDE.md §9 and backlog Sprint 0 scope | `">=20"` | `">=20.19"`. Justified: installed vite 8.3.3 needs `^20.19.0 \|\| >=22.12.0` and jsdom 29.1.1 needs `^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0`, so `">=20"` would be wrong. The range is still too loose, though: it admits Node 22.0–22.12, which vite or jsdom reject. Suggested fix (developer, after PO approval): `"^20.19.0 \|\| >=22.13.0"`, recorded as an ADR or amendment and as a README assumption |
| DEF-S0-2 | Low (docs, D6) | README.md line 26 | Read README "Node version" | Exact minimum Node version (D6), matching what actually works | "The project targets Node 20 LTS or later". Node 20.0–20.18 and 22.0–22.12 do not meet the vite/jsdom engine ranges. Owner: docs-writer (no feature claimed, so it doesn't block Sprint 1) |

No NaN, Infinity, undefined, blank output, console error or crash was observed.

## Manual checks for the PO
Once Pages is enabled and the workflow has redeployed, open https://sabeekhann.github.io/Web-Calculator/ in each browser:
- **Chrome:** the page loads; the heading reads "Tip & Bill Splitter" with "Split a bill and tip fairly between friends." under it; the tab title is "Tip & Bill Splitter"; there's no sideways scrolling when the window is narrowed to phone width.
- **Edge:** same checks as Chrome.
- **Firefox:** same checks as Chrome.
- **Safari (Mac or iPhone):** same checks as Chrome; on iPhone, the text fits the screen with no sideways scrolling.
