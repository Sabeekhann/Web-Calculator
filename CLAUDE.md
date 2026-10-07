# CLAUDE.md — Web-Calculator (KnowledgeCity take-home)

Persistent operating manual. Read it fully at the start of every session and after every context reset.
These are rules, not suggestions. If this file and a request conflict, ask the Product Owner (PO).

## 1. Project overview
- Assignment: KnowledgeCity "Build a Calculator Web App with an AI Coding Tool" (Technology Division).
- Deliver a browser calculator built by an AI coding tool, plus three product docs, a README and session transcripts.
- Reviewers follow the README on a clean computer, use the app by hand, read the transcripts and docs.
- Graded on: it works · product thinking · working with AI · accuracy of docs · delivery and communication.
- Calculator choice: **Tip & bill splitter**. It is for people settling a shared restaurant or group bill.
- Problem solved: fair, correctly rounded shares without mental maths, including who covers the leftover cent.
- Role applied for: Product Manager. AI tool: Claude Code (cloud session, claude.ai/code), model Claude Opus 5.5.
- Time budget: about 2–4 hours in total. A small app that fully works beats a big one that doesn't.

## 2. Team and roles
- **Product Owner / Scrum Master: Sabee Khan (human).** Owns vision, requirements, priority and acceptance. Only the PO approves gates.
- **Orchestrator: main Claude Code session.** Plans, delegates, reviews every return and reports at gates. Never approves on the PO's behalf.

| Agent | Purpose | Stages owned | Tools | Must never |
|---|---|---|---|---|
| product-analyst | Brief, roles, jobs, stories | 2, 3 | Read, Write, Edit, Glob, Grep | Write code; mark a story Implemented |
| solution-architect | Backlog, technical design, test plan | 4 | Read, Write, Edit, Glob, Grep | Write app code; leave an untestable AC unflagged |
| developer | Implements one story per brief, tests first | 5, 6, 7 | Read, Write, Edit, Bash, Glob, Grep | Change ACs; set statuses; edit docs other than technical notes |
| qa-engineer | Independent verification and edge sweep | 5, 6, 7 | Read, Bash, Glob, Grep, Write | Edit src/ or tests; fix defects |
| docs-writer | Statuses, README, sprint log, email | 8, 9 | Read, Write, Edit, Glob, Grep, Bash | Claim an unverified feature; skip the hand-change log |
| release-auditor | Clean run, hygiene, D1–D12 audit | 8, 9, 10 | Read, Bash, Glob, Grep, Write | Edit code or product docs |

## 3. Orchestration protocol
- Only the Orchestrator delegates. **Subagents never spawn or delegate to other agents.**
- Every delegation carries a Handoff Brief. Every return uses the Handoff Return format. Both templates are below.
- **The builder and the checker are always different agents.** developer builds, qa-engineer verifies, release-auditor audits.
- **Review before gate:** the Orchestrator checks each return against this file and the kickoff prompt before the PO sees it. The Gate Report names every issue found and how it was fixed or sent back.
- **Incomplete or wrong work:** send it back to the same agent with numbered, specific corrections. At most 2 retries, then escalate to the PO.
- If the custom agent types in `.claude/agents/` aren't selectable in this session, delegate to `general-purpose`. Paste the agent file's full system prompt followed by the Handoff Brief, and log it in the agent activity log.
- Every delegation and its result is logged in `docs/process/delivery-tracker.md` → Agent activity log.

Session-start checklist (Orchestrator):
1. Read this file, then `docs/process/delivery-tracker.md` to find the current stage and the last approved gate.
2. `git fetch origin && git status`. Make sure the working tree is clean and on the expected branch.
3. Add a session-log row (session-0N) and a time-log start entry.
4. Resume at the first incomplete step of the current stage. Never redo or reopen an approved gate unless the PO asks.

Per-story loop (Stages 6–7):
1. Orchestrator checks the story against the Definition of Ready, then sends developer a Handoff Brief.
2. developer: branch `feat/S-x` → failing tests → logic → validation → UI → tests pass → build passes → commit `feat(S-x): …` → push the branch.
3. qa-engineer: independent verification → `docs/process/qa-reports/S-x.md` (PASS / FAIL / MANUAL per AC, with evidence and screenshots).
4. On any FAIL: Orchestrator sends the specific defects to developer, then QA re-verifies. At most 2 loops, then escalate to the PO.
5. Orchestrator presents the story: QA report, screenshots per AC, and the manual checks for the PO.
6. Only after the PO accepts: merge `--no-ff` into main, push main (Pages redeploys), and stop any background servers.

Handoff Brief (Orchestrator → subagent):
```
Stage / Story:
Objective (one sentence):
Inputs to read (file paths):
Outputs to produce (exact file paths):
Acceptance checks you must self-verify:
Constraints / must-nevers:
Return using the Handoff Return format.
```
Handoff Return (subagent → Orchestrator):
```
Done: (files created or changed)
Evidence: (test output, command output, line counts)
Self-check: (each acceptance check → PASS or FAIL)
Open issues / questions for the PO:
```

## 4. Operating rules (non-negotiable)
1. Work stage by stage. At every GATE, STOP, post a Gate Report and wait for the PO's "approved". Never skip ahead, never self-approve.
2. No application code until Gate 4 is approved. Until then, only documents and configuration exist in the repo.
3. If anything is ambiguous, ask the PO. Assumptions the PO approves go in the README's Assumptions section.
4. Docs describe reality. A story is "Implemented" only when EVERY AC has a verified PASS from the automated tests AND the qa-engineer's independent check, plus the PO's manual check where needed. Otherwise it is "Not implemented". Never overclaim.
5. All code is written by the AI team. If the PO says they changed code by hand, docs-writer records it in the README immediately.
6. Never write, summarise, fabricate or edit a transcript. The PO exports transcripts.
7. Time budget is 2–4 hours. Process docs are lean: bullets and tables, not essays.
8. The work and the checking of it are always done by different agents.
9. Subagents cannot spawn subagents. Only the Orchestrator delegates, always with a Handoff Brief.
10. After every subagent return, the Orchestrator reviews it before showing the PO, and names any issues it fixed or sent back.

Environment and GitHub rules (Part A0, adapted for this cloud session):
- Agents run every command themselves (git, npm, node, file operations). **Never ask the PO to open a terminal, type commands or paste into a shell.**
- If something needs the PO (a sign-in, a browser check), say in plain words exactly what to click or open, then wait.
- GitHub is the source of truth: `https://github.com/Sabeekhann/Web-Calculator`. It already exists, so never create another repo. Everything is committed and pushed here.
- The session runs in a cloud container, so localhost is NOT reachable by the PO. Show the app by sending **Playwright screenshots** (Chromium at `/opt/pw-browsers/chromium`) per AC, plus the **GitHub Pages** deploy of `main` (PO-approved).
- Long-running commands (dev or preview servers) run in the background and never block the session. Stop them when done.
- `gh` is not signed in. Use `git` over the session proxy, and GitHub MCP tools for metadata.

## 5. Deliverables contract
| ID | Deliverable | Requirement from the assignment |
|---|---|---|
| D1 | Working app | Calculator runs in current Chrome, Edge, Firefox and Safari |
| D2 | Local run | A reviewer starts it from the README alone: no paid accounts, API keys or cloud services |
| D3 | Correctness | Every story marked Implemented works exactly as its acceptance criteria describe |
| D4 | Error handling | Invalid input and errors (e.g. division by zero) show a clear message, never a crash or a wrong result |
| D5 | Source code | Complete source code, with no node_modules, dist, coverage or build output |
| D6 | README.md (root) | What the app is and who it's for; why this calculator; prerequisites (exact Node version); exact install and start commands; how to run tests; AI tool and model used; code changed by hand; assumptions |
| D7 | docs/app-roles.md | "A [role] is [who/situation]. They can [see/do]. They must never [prevent]" (the last part where it applies). Each role is a real kind of person; if there are several, state how their needs differ |
| D8 | docs/jobs-to-be-done.md | "When [situation], I want to [motivation], so I can [outcome]." Each job names its role. No mention of the app, features, buttons or screens |
| D9 | docs/user-stories.md | "As a [role], I want [capability], so that [benefit]." Each story names its job, has Given/When/Then acceptance criteria (covering the normal case, invalid input, boundaries, very large and very small numbers, and continuing after a result or an error), and has a status of Implemented or Not implemented. Future stories are allowed, marked Not implemented |
| D10 | Transcripts | transcripts/session-01.md (and session-02, etc., one per session), exported from the desktop app with /export, unedited apart from removed secrets. Produced by me. Subagent work is also recorded in the raw session logs under ~/.claude/projects/; I will add those too |
| D11 | Package layout | sabee-khan-calculator/ containing README.md, src/, docs/ (the three files above), transcripts/ |
| D12 | Submission | Public GitHub repo (https://github.com/Sabeekhann/Web-Calculator), opening for anyone with the link; optional free live URL (GitHub Pages); email with subject "Take-home assignment: [ROLE], Sabee Khan" containing the link, the live URL, the AI tools and models used, and the time spent |

## 6. Repository structure
The repo is named `Web-Calculator`. It is cloned locally as `sabee-khan-calculator/`, which is the D11 package folder.
```
sabee-khan-calculator/
  README.md                      # D6: what/who/why, run, test, AI tool, hand changes, assumptions
  CLAUDE.md                      # this operating manual
  .gitignore                     # node_modules, dist, coverage, .env*, .DS_Store, submission-email.md
  .claude/agents/                # six subagent definitions (one .md each)
  docs/
    app-roles.md                 # D7: roles R-1…
    jobs-to-be-done.md           # D8: jobs J-1…
    user-stories.md              # D9: traceability table + stories S-1… with ACs and status
    process/
      delivery-tracker.md        # D1–D12 checklist, time log, session log, agent activity log
      product-brief.md           # Stage 2: problem, users, scope, success criteria, risks
      backlog.md                 # Stage 4: MoSCoW, sprint split, DoR, DoD
      technical-design.md        # Stage 4: architecture, decimal/error strategy, ADRs, dev notes
      test-plan.md               # Stage 4: AC → test ID / MANUAL map, browser checklist
      sprint-log.md              # sprint goals, reviews, retros
      qa-reports/S-x.md          # one QA report per story
  src/                           # app source (from Stage 5 only)
  transcripts/                   # D10: exported by the PO only
```

## 7. Stage workflow
| # | Stage | Owner → Reviewer | Inputs | Outputs | Deliverables | Gate exit criteria |
|---|---|---|---|---|---|---|
| 1 | Initiation | Orchestrator → PO | Kickoff prompt, assignment PDF | Repo tree, CLAUDE.md, 6 agents, tracker | D5, D10, D11 | CLAUDE.md 280–340 lines; 6 agents 50–90 lines; pushed |
| 2 | Discovery | product-analyst → Orchestrator | Part C choice | product-brief.md | D6 (what/who/why) | Scope, success criteria, constraints, risks stated |
| 3a | Roles | product-analyst → Orchestrator | Brief | app-roles.md | D7 | Exact D7 format; real people; needs differ |
| 3b | Jobs | product-analyst → Orchestrator | Roles | jobs-to-be-done.md | D8 | Exact D8 format; each names a role; purity check passes |
| 3c | Stories | product-analyst → Orchestrator | Jobs | user-stories.md | D9 | Traceability first; 4–8 ACs each; full edge coverage; no orphans; all Not implemented |
| 4 | Planning | solution-architect → Orchestrator | Stories | backlog, technical-design, test-plan | D3, D4 | Every AC mapped; DoR/DoD; ADRs. Code may start only after this gate |
| 5 | Sprint 0 | developer → qa-engineer | Design | Vite+TS+Vitest scaffold, skeleton, Pages workflow | D2, D5 | install/dev/test/build all pass, with output shown |
| 6 | Sprint 1 (Must) | developer → qa-engineer, per story | Backlog | feat/S-x, tests, QA reports | D1, D3, D4 | Each story accepted by the PO; review + retro logged |
| 7 | Sprint 2 (Should + hardening) | developer → qa-engineer | Backlog | Stories, full edge sweep, a11y check | D1, D3, D4 | Sweep clean; browser checklist given; review + retro |
| 8 | Release | docs-writer → release-auditor | QA reports, PO checks | Statuses, README, audit, tag v1.0.0 | D3, D5, D6, D9, D11 | Clean run passes; D1–D12 table; tag pushed |
| 9 | Submission prep | docs-writer + release-auditor | Tracker | submission-email.md, final table | D10, D12 | D10 pending PO export; log path given |
| 10 | Publish | release-auditor → Orchestrator | Transcripts | Secret scan report, public check | D10, D12 | Repo public; links verified signed-out |

Stage notes:
- Stage 3 runs in strict order 3a → 3b → 3c, with a PO gate after each. A later doc never starts before the earlier one is approved.
- Stage 5 (Sprint 0): scaffold at the repo root, app code in `src/`, scripts `dev`, `build`, `preview`, `test`, `engines` + `.nvmrc`, module skeleton, a UI shell with no features, and the Pages workflow. Commit `chore(sprint-0): scaffold and architecture skeleton`.
- Stages 6–7: STOP after EACH story for PO acceptance. At sprint end, log a Sprint Review (delivered vs goal, not done) and a Retro (well / not well / change) in sprint-log.md.
- Stage 8: statuses come only from QA PASS plus PO manual checks. Fix anything the auditor flags via the right agent, then commit `release: v1.0.0`, tag `v1.0.0`, push main and the tag.
- Stage 9: `submission-email.md` is gitignored and never committed. D10 stays "pending: PO exports transcript(s) and session logs".
- Stage 10: the repo is already public (checked at Stage 1). Confirm it again with a request that sends no credentials. Also check that README, src/, docs/ and transcripts/ are visible.
- Each stage's start and end times are recorded in the tracker's time log. The email's "time spent" comes from that log.

## 8. Document standards
Templates (exact):
- Role (D7): `A [role] is [who/situation]. They can [see/do]. They must never [prevent].` The last sentence only where it applies.
- Job (D8): `**J-n (R-n Role name).** When [situation], I want to [motivation], so I can [outcome].`
- Story (D9): `S-n (serves J-n, Status): As a [role], I want [capability], so that [benefit].` followed by its ACs.

ID conventions: roles `R-1`, jobs `J-1`, stories `S-1`, acceptance criteria `AC S-1.1`, tests `T-S1.1`, decisions `ADR-001`.

Acceptance criteria rules:
- Always `Given [state], when [action], then [observable result]`. One behaviour per AC.
- Use exact numbers (e.g. bill `100.00`, tip `15`%, `3` people → `38.34`, `38.33`, `38.33`) and exact error text in quotes.
- Each story's ACs together cover: normal case · invalid input · boundaries · very large and very small numbers · continuing after a result · continuing after an error.
- 4–8 ACs per story. No vague words ("fast", "nice", "correctly") without a measurable result.

JTBD purity rule: a job exists whether or not the app exists. It never names the app, a feature, a button, a field or a screen. If it can't be written without them, it's a feature, not a job.
- Bad: "When planning dinners, I want to tap the Generate Menu button, so I can see a weekly plan." (names a button)
- Bad: "When cooking, I want the recipe screen to scale portions, so I can feed guests." (names a screen and feature)
- Good: "When planning a week of dinners, I want to decide meals before I shop, so I can buy only what I need."
- Good: "When unexpected guests arrive, I want to stretch a recipe to more portions, so I can feed everyone without a second trip to the shop."

Traceability table format (top of user-stories.md):
`| Story | Job | Role | Priority (MoSCoW) | Size (S/M/L) | Status |`. Every story maps to a job and every job to a role. No orphans.

Definition of Ready (story may enter a sprint):
- [ ] D9 format, names its job, and the job names a role
- [ ] 4–8 Given/When/Then ACs with exact numbers and exact error text
- [ ] Edge coverage complete (normal, invalid, boundaries, large/small, after result, after error)
- [ ] Every AC mapped in test-plan.md to a test ID or MANUAL with a reason
- [ ] Priority and size set; no open questions for the PO

Definition of Done (story may be accepted):
- [ ] Tests written first, now all passing (`npm test`); `npm run build` passes
- [ ] Logic → validation → UI layering respected; no console logs, no dead code
- [ ] qa-reports/S-x.md shows PASS for every AC (MANUAL items confirmed by the PO)
- [ ] Error messages match the catalogue exactly; output is never NaN, Infinity, undefined or blank
- [ ] Keyboard-operable, labelled, aria-live, usable at 375px
- [ ] Committed as `feat(S-x): …`, branch pushed, PO accepted, merged `--no-ff` to main

## 9. Technical standards
- Stack: Node 20.19+, 22.13+ or 24+ (`engines` "^20.19.0 || ^22.13.0 || >=24.0.0", `.nvmrc` 20; PO-approved at GATE 5), Vite, vanilla TypeScript in `strict` mode, Vitest. No framework, no backend, no network calls, no paid services or API keys.
- Architecture: pure calculation module → validation layer → UI layer. No DOM in logic. No logic in UI handlers: handlers read inputs, call validation and calculation, and render the result.
- Decimal strategy: parse inputs as strings into integer minor units (cents) and do the maths in integers, so the app never shows floating-point artefacts such as `0.30000000000000004`. Percentages use integer basis points. Rounding: half-up to the cent. A remainder of cents is distributed one cent at a time to the first shares, so the shares always sum to exactly the total. The final rule is confirmed in an ADR at Stage 4.
- Error handling: functions return typed results `{ ok: true, value } | { ok: false, error }` and never throw to the UI. All message text lives in one catalogue file. A message is shown next to the field it concerns and clears as soon as the input is valid. The output can never be NaN, Infinity, undefined or blank.
- Money and number input rules (defaults; the final values are fixed by ADR at Stage 4):
  - Accept digits with an optional single `.` and at most 2 decimals for money. Leading and trailing whitespace is trimmed.
  - Reject letters, exponent notation (`1e400`), multiple dots, and negative values, each with a catalogue message.
  - Upper bounds are explicit (e.g. a maximum bill and a maximum number of people), so integer cents stay well inside `Number.MAX_SAFE_INTEGER`.
  - Display money with exactly 2 decimals and a thousands separator. The display format never changes the computed value.
- Accessibility: every input has a `<label>`; the app is fully keyboard-operable; focus is visible; results and errors are in `aria-live="polite"` regions; the layout is usable at 375px width with no horizontal scroll.
- Code style: small single-purpose functions, descriptive names, no dead code, no commented-out code, no `console.*` in committed code.
- Expected source layout (confirmed or amended by ADR at Stage 4):
  - `src/logic/`: pure functions on integer cents (split, tip, rounding). No DOM, no strings for users.
  - `src/validation/`: parses raw input strings into typed values or typed errors.
  - `src/messages.ts`: the single message catalogue (every user-facing error string).
  - `src/ui/`: DOM wiring and rendering only. `src/main.ts` is the entry point.
  - `tests/` (or `*.test.ts` beside each module): Vitest unit tests named with test IDs.
- Hosting: a GitHub Actions workflow deploys `main` to GitHub Pages (free, no keys). Vite's `base` is `/Web-Calculator/` for that build only. The local `npm run dev` must keep working from `/`.

## 10. Testing standards
- Tests are written before the code (red → green). Test IDs `T-S1.1` appear in the test names.
- Every AC maps to a test ID, or is marked MANUAL with the reason (e.g. visual focus ring, real-browser rendering).
- Edge-case sweep, run on every input: empty · whitespace · letters · `1e400` · negative values · `0` · very long input (50+ digits) · pasted values · repeated Enter · recovery after an error. Never NaN, Infinity, undefined, blank output or a crash.
- Scripted UI checks use Playwright against `npm run preview`, with screenshots saved for the PO (not committed).
  - Launch Chromium with `executablePath: '/opt/pw-browsers/chromium'`. Never run `playwright install`.
  - Screenshot each AC's end state at 1280px and the main screen at 375px. Name the files `S-x_AC-n.png`.
  - Screenshots go in the session scratchpad, not the repo. QA lists them in its report by file name.
- Automated tests prove the logic. The PO's manual browser check proves the experience. Neither replaces the other.
- Manual browser checklist (PO, per release), for each of Chrome, Edge, Firefox and Safari: page loads · normal calculation · error message shows and clears · keyboard-only use · 375px layout · no console errors.
- QA report template (`docs/process/qa-reports/S-x.md`):
```
# QA — S-x <title>   Date: · Commit: · Verifier: qa-engineer
| AC | Test ID | Automated | Independent check | Result (PASS/FAIL/MANUAL) | Evidence |
Edge sweep: (input → observed)
Defects: (ID, AC, steps, expected, actual)
Manual checks for the PO: (browser → steps)
```

## 11. Git conventions
- Conventional Commits: `feat(S-x): …`, `fix(S-x): …`, `docs: …`, `chore: …`, `test: …`, `release: …`. At least one commit per story.
- Branching: one branch per story, `feat/S-x`. Merge to `main` with `--no-ff` only after the PO accepts. Docs and process work go directly to `main`.
- Push after EVERY approved gate, and put the commit hash and GitHub link in the Gate Report.
- Never force-push, never rewrite history, never push node_modules, dist, coverage, .env files or secrets.
- Commit author is Sabee Khan <sabeekhan99@gmail.com>, with a `Co-Authored-By: Claude` trailer.
- Tag `v1.0.0` at release and push the tag.

## 12. Gate Report template
```
Gate: N — name
Delivered: (files, with one line each)
Agents used: (agent → task → result)
Issues found in review and how they were fixed:
Deliverables touched: (D-IDs with status)
Open questions / decisions needed from me:
Time spent on this stage:
GitHub: branch, commit hash and link, pushed (yes/no)
Local URL to check (if the app is running): (cloud session: screenshots + Pages URL instead)
Awaiting: "approved" or corrections
```

## 13. Honesty and transcript rules
- Status integrity: a story's status changes only from QA PASS evidence plus PO confirmation. When in doubt, it's Not implemented.
- Hand-change log: any code the PO changes by hand is listed in the README ("Code changed by hand") the same day. "None" is stated explicitly if there were none.
- Transcripts are produced only by the PO (`/export`). Agents never write, summarise, edit or "clean up" them; they only scan for secrets and report.
- The README must match the app as it is now: commands, versions, features, limitations and the live URL.
- Cloud-session transcript steps (Gate 9):
  1. The PO exports the conversation with `/export` (or the app's export option) and saves it as `transcripts/session-01.md`.
  2. Raw session logs live in this container under `~/.claude/projects/`. The container is temporary, so the Orchestrator gives the exact path.
     Only if the PO asks, it copies the `.jsonl` files byte-for-byte (`cp`, no edits) into `transcripts/`.
  3. release-auditor scans the transcripts for passwords, API keys and tokens and REPORTS findings. The PO removes secrets.
- Every approved assumption (including cloud-session deviations) is listed in the README's Assumptions section.

## 14. Forbidden actions
- Auto-approving a gate or treating silence as approval.
- Starting app code before Gate 4 is approved, or adding a feature without a story.
- Skipping, disabling or weakening tests to get to green.
- Marking a story Implemented without QA PASS on every AC and the PO's confirmation.
- Changing acceptance criteria during development, unless the PO approves the change.
- Adding paid services, API keys, analytics, trackers or network calls.
- Creating, editing, summarising or fabricating a transcript.
- Committing node_modules, dist, coverage, .env*, secrets or submission-email.md.
- Force-pushing or rewriting history. Creating a new GitHub repo.
- Asking the PO to use a terminal.

## 15. Command reference
| Purpose | Command |
|---|---|
| Install | `npm install` |
| Dev server (background) | `npm run dev` |
| Unit tests | `npm test` |
| Build | `npm run build` |
| Preview build (background) | `npm run preview` |
| Clean-run check | `rm -rf node_modules dist && npm install && npm test && npm run build` |
| Hygiene audit | `git ls-files \| grep -E 'node_modules\|dist/\|coverage\|\.env\|submission-email'` (must print nothing) |
| Line counts | `wc -l CLAUDE.md .claude/agents/*.md` |
| Secret scan (transcripts) | `grep -rniE 'api[_-]?key\|token\|secret\|password\|sk-[a-z0-9]' transcripts/` (report only) |
| Commit link | `https://github.com/Sabeekhann/Web-Calculator/commit/<sha>` |
| Live URL (after Pages) | `https://sabeekhann.github.io/Web-Calculator/` |
