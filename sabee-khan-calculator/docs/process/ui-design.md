# UI Design Spec

## Design direction (Stage 4, PO to choose)

Preview: `design/directions.html` (both directions, light and dark) · screenshots `design/screenshots/directions-1280.png`, `directions-375.png`.
Both use the system font stack `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`, tabular numerals for every number, 44×44 px minimum targets, and show Pass/Fail as icon + word (never colour alone). Contrast is WCAG 2.x relative luminance, computed with python3; field borders and focus rings are UI parts (3:1 min).

### Direction A — Ledger
- **Mood:** calm and editorial; paper, ink and a light, large score, like a well-made report card.
- **Colour** (light / dark, ratio against the background named):

| Token | Light | Dark | Ratios light / dark |
|-------|-------|------|---------------------|
| background | #F5F3EE | #111316 | text on bg 14.93 / 15.47 |
| surface (card, fields) | #FFFFFF | #1B1E23 | — |
| text | #1B1F24 | #ECEAE4 | on surface 16.56 / 13.89 |
| muted text | #5A6069 | #A4A9B1 | on surface 6.34 / 7.07 |
| accent (button, focus) | #1F4E79 | #8EB9E8 | on surface 8.66 / 8.16 |
| pass (+ tint #E6F2E9 / #16301F) | #1D6B3A | #6FCF97 | on surface 6.53 / 8.79 · on tint 5.67 / 7.48 |
| fail (+ tint #FBE9E7 / #3A1E1C) | #A8322D | #F2958D | on surface 6.65 / 7.53 · on tint 5.67 / 6.84 |
| border (hairline) / field border | #DDD8CD / #8A9099 | #353A42 / #6E747E | field border 3.22 / 3.55 |

- **Type:** scale 12 / 13 / 15 / 17 / 20 / 64 px; small uppercase tracked labels ("SCORE"); score 64 px weight 300 with a half-size muted "%", so the number reads like a printed mark.
- **Layout:** one narrow card (max 420 px); "Marks earned *of* Total marks possible" on one row, pass mark below; a hairline divider, then the score with a Pass/Fail pill (tick or cross) and the gap line; "Next learner" as an outline button with an Esc hint.
- **Why it fits:** quiet and formal, so a borderline Fail reads as a fair record rather than a judgement; the "17.5 of 23" row mirrors how marks arrive on paper, which suits instructors recording results.

### Direction B — Spotlight
- **Mood:** confident and modern; inputs on the left, the result lit up in a deep indigo panel.
- **Colour** (light / dark, ratio against the background named):

| Token | Light | Dark | Ratios light / dark |
|-------|-------|------|---------------------|
| background | #ECEEF6 | #0C0E1A | text on bg 14.74 / 16.60 |
| surface (card, fields) | #FFFFFF | #171A2E | — |
| text | #161A33 | #ECEEF8 | on surface 17.08 / 14.83 |
| muted text | #535A76 | #A3A8C3 | on surface 6.79 / 7.31 |
| accent (button, focus) / on-accent | #4B3FD8 / #FFFFFF | #A99FFF / #14112E | accent on surface 7.00 / 7.43 · button label 7.00 / 7.91 |
| result panel / panel text / panel muted | #1F1B4E / #FFFFFF / #C9C6EE | #2B2566 / #FFFFFF / #D0CCF6 | text 15.85 / 13.47 · muted 9.66 / 8.75 |
| pass (on panel) | #7FE0B0 | #86E5B6 | on panel 9.96 / 8.91 |
| fail (on panel) | #FFA59C | #FFAEA6 | on panel 8.39 / 7.60 |
| error text (under fields) | #B42318 | #FF9F96 | on surface 6.57 / 8.70 |
| border / field border | #D6DAE7 / #8A90A8 | #2D3252 / #6C7294 | field border 3.16 / 3.65 |

- **Type:** scale 13 / 14 / 15 / 18 / 22 / 26 / 56–80 px; bold, tight headings; score weight 800 sized to the card (`clamp(48px, 11cqi, 80px)`); verdict 26 px bold with a circled tick or cross.
- **Layout:** a split card (max 640 px), inputs with unit suffixes ("marks", "%") on the left, inset result panel on the right; below 500 px card width the panel stacks under the inputs; "Next learner" is a full-width filled button.
- **Why it fits:** the result is unmistakable at a glance on a phone and the panel keeps its place while an instructor types, but it is louder and the result sits below the inputs on mobile.

### Recommendation
- **Choose A — Ledger.** It answers both roles' main question in one short column (score, verdict, gap) with the calmest, most "official" tone for pass/fail outcomes people may challenge.
- A is narrower and simpler, so it stays the same layout from 320 px to 1280 px (no split/stack switch), which lowers build and test risk inside the 2–4 h budget.
- B is the stronger choice if the PO wants more brand energy; its result panel and type scale can be reused in A later without changing the tokens' structure.
