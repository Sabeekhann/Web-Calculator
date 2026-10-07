# Tip & Bill Splitter — KnowledgeCity take-home (Web-Calculator)

> Status: **Stage 1 (Initiation)**. No application code exists yet. Sections below are filled in as stages are approved.

Repository: <https://github.com/Sabeekhann/Web-Calculator>. The repository is named **Web-Calculator**.
It is cloned locally as **`sabee-khan-calculator/`**, which is the package folder the assignment requires
(`README.md`, `src/`, `docs/`, `transcripts/`).

## What the app is and who it's for

## Why this calculator

## Prerequisites

## Install and start

## Running the tests

## AI tool and model used

## Code changed by hand

## Assumptions
Approved by the Product Owner at the start of the project:
- **Cloud session.** The project is built in a Claude Code cloud session (claude.ai/code), not the desktop app. A local dev server isn't reachable from the PO's browser, so stories are reviewed through browser screenshots (Chromium via Playwright) plus a free GitHub Pages deploy of `main`.
- **Node version.** The project targets Node 20 LTS or later (`.nvmrc` = 20). The build environment runs Node 22.22.0.
- **Product decisions (GATE 2).**
  - Leftover cents: amounts are rounded half-up to the cent, and any leftover cents go one at a time to the first shares, so the shares always add up to the total.
  - The tip is calculated on the bill as entered. There is no tax handling and no currency symbols.
  - Limits: 1–100 people (whole numbers), a bill from 0.01 to 1,000,000.00, and a tip from 0% to 100% with up to 2 decimals.
  - A decimal comma (`12,50`) and a bill of `0.00` are rejected with a message.
- **Role decisions (GATE 3a).** The app shows which shares carry an extra cent but doesn't assign shares to named people; the group decides who takes them. The same bill, tip and number of people always give the same split.
- **Interaction decisions (GATE 3c).**
  - Press the Calculate button, or Enter in any field, to calculate.
  - Editing any field hides the old result until the next calculation.
  - Error messages appear on Calculate. Each one clears as soon as its field is valid.
  - The tip field starts at 0, with the hint "Use 0 for no tip."
  - Accepted input forms: `.5` → 0.50 and `5.` → 5.00. `+5`, `15%` and `1,000.00` are rejected with a message.
- **Package folder.** The repo `Web-Calculator` is cloned as `sabee-khan-calculator/` to match the required layout.

## Known limitations

## Browser support

## Documentation index
- [App roles](docs/app-roles.md)
- [Jobs to be done](docs/jobs-to-be-done.md)
- [User stories](docs/user-stories.md)
- Process: [delivery tracker](docs/process/delivery-tracker.md), [product brief](docs/process/product-brief.md), [backlog](docs/process/backlog.md), [technical design](docs/process/technical-design.md), [test plan](docs/process/test-plan.md), [sprint log](docs/process/sprint-log.md), [QA reports](docs/process/qa-reports/)
- AI team operating manual: [CLAUDE.md](CLAUDE.md) and the agent definitions in [.claude/agents/](.claude/agents/)

## Transcripts
Session transcripts are in [transcripts/](transcripts/), exported by the Product Owner and unedited apart from removed secrets.

## Live URL
