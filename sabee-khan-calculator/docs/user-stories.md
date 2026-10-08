# User Stories with Acceptance Criteria

Each story serves a job in `jobs-to-be-done.md`; rules follow A-1..A-9 (approved) and A-10..A-17 (approved, DEC-9) in `process/decision-log.md`.

## Traceability

| Story | Title | Job(s) | Role(s) | Priority (MoSCoW) | Size (S/M/L) | Status |
|-------|-------|--------|---------|-------------------|--------------|--------|
| S-1 | Score and pass/fail verdict | J-1, J-3 | R-1 Learner, R-2 Instructor | Must | M | Implemented |
| S-2 | Marks short of or above the pass mark | J-2 | R-1 Learner | Must | M | Implemented |
| S-3 | Clear message for an invalid or impossible entry | J-4 | R-2 Instructor | Must | M | Implemented |
| S-4 | Next learner in one step | J-5 | R-2 Instructor | Should | S | Not implemented |
| S-5 | Copy the outcome as one line | J-5 | R-2 Instructor | Could | S | Not implemented |
| S-6 | Marks needed to pass | J-2 | R-1 Learner | Could | S | Not implemented |

Every job has at least one story (J-1: S-1 · J-2: S-2, S-6 · J-3: S-1 · J-4: S-3 · J-5: S-4, S-5); every job traces to a role in `app-roles.md`.

## Message catalogue

`{n}` is a number shown to at most 2 decimal places, trailing zeros trimmed, with comma thousands separators (A-10, A-11).

| ID | Where shown | Exact text |
|----|-------------|------------|
| M-1 | Result area, marks earned or total empty, no error | "Enter marks earned and total marks possible to see the score." |
| M-2 | Verdict area, pass mark empty | "Enter a pass mark to see whether this is a pass or a fail." |
| M-3 | Result area, any field in error | "The score will appear once every entry is valid." |
| M-4 | Verdict | "Pass" |
| M-5 | Verdict | "Fail" |
| M-6 | Gap line, shortfall ≠ 1 | "{n} marks short of the pass mark" |
| M-7 | Gap line, shortfall = 1 | "1 mark short of the pass mark" |
| M-8 | Gap line, surplus ≠ 1 | "{n} marks above the pass mark" |
| M-9 | Gap line, surplus = 1 | "1 mark above the pass mark" |
| M-10 | Gap line, equal | "Exactly on the pass mark" |
| M-11 | Gap line, surplus under 0.01 | "Less than 0.01 marks above the pass mark" |
| M-12 | Under marks earned | "Marks earned must be a number, like 17.5." |
| M-13 | Under marks earned | "Marks earned can't be negative." |
| M-14 | Under marks earned | "Marks earned can have at most 2 decimal places." |
| M-15 | Under marks earned | "Marks earned can't be more than the total marks possible." |
| M-16 | Under total marks possible | "Total marks possible must be a number, like 23." |
| M-17 | Under total marks possible | "Total marks possible can't be negative." |
| M-18 | Under total marks possible | "Total marks possible can have at most 2 decimal places." |
| M-19 | Under total marks possible | "Total marks possible must be more than 0." |
| M-20 | Under total marks possible | "Total marks possible can't be more than 1,000,000." |
| M-21 | Under pass mark | "Pass mark must be a number, like 70." |
| M-22 | Under pass mark | "Pass mark can't be negative." |
| M-23 | Under pass mark | "Pass mark can have at most 1 decimal place." |
| M-24 | Under pass mark | "Pass mark can't be more than 100." |
| M-25 | Button label (S-4) | "Next learner" |
| M-26 | Button label (S-5, future) | "Copy outcome" |
| M-27 | Confirmation after copying (S-5, future) | "Outcome copied." |
| M-28 | Copied text (S-5, future) | "{earned} of {total} marks: {score}, {verdict}, {gap line}" |
| M-29 | Under the result (S-6, future) | "Marks needed to pass: {n} of {total}" |
| M-30 | Page title, browser tab (UI text, DEC-11) | "Quiz score and pass-mark calculator" |
| M-31 | Eyebrow above the card heading (UI text, DEC-11) | "Quiz score" |
| M-32 | Card heading (UI text, DEC-11) | "Check a quiz result" |
| M-33 | Subheading under the card heading (UI text, DEC-11) | "A score at or above the pass mark is a pass." |
| M-34 | Field label, marks earned (UI text, DEC-11) | "Marks earned" |
| M-35 | Field label, total marks possible (UI text, DEC-11) | "Total marks possible" |
| M-36 | Field label, pass mark (UI text, DEC-11) | "Pass mark" |
| M-37 | Pass mark label suffix, screen readers only (UI text, DEC-11) | " (percent)" |
| M-38 | Pass mark suffix, visible (UI text, DEC-11) | "%" |
| M-39 | Result eyebrow (UI text, DEC-11) | "Score" |
| M-40 | Hint beside the Next learner button (UI text, DEC-11) | "or press Esc" |

## Edge coverage

| Edge case | AC IDs |
|-----------|--------|
| Normal case | S-1.1, S-2.1, S-2.2 |
| Empty | S-3.1, S-3.2 |
| Letters | S-3.3 |
| Symbols (currency, comma, plus, exponent) | S-3.3 |
| Multiple decimal points | S-3.3 |
| Too many decimal places | S-3.5 |
| 0 | S-1.5, S-2.7, S-3.6 |
| Negative (incl. "-0") | S-3.4 |
| Maximum allowed (1,000,000; pass mark 100) | S-1.5, S-1.6, S-2.7, S-3.6 |
| Very large | S-1.6, S-2.7 |
| Very small | S-1.7, S-2.6 |
| Pass boundary (exact, just below) | S-1.2, S-1.3, S-2.3, S-2.6 |
| Carry on after a result | S-1.8, S-2.8, S-4.2 |
| Carry on after an error | S-3.8, S-4.4 |

## S-1 — Score and pass/fail verdict

**S-1 (serves J-1, J-3, Implemented).** As a Learner or an Instructor, I want to see the marks as a percentage score and a Pass or Fail verdict, so that I know for certain whether the pass mark was reached, judged by the same rule on the exact marks every time.

Priority: Must · Size: M

**S-1.1** Given the pass mark shows its pre-filled "70", when I type "17.5" in marks earned and "23" in total marks possible, then I see the score "76.0%" and the verdict "Pass" without pressing any button or key.
**S-1.2** Given the pass mark is "70", when I enter "17.5" of "25" (exactly 70%), then I see "70.0%" and "Pass".
**S-1.3** Given the pass mark is "70", when I enter "17.49" of "25" (69.96%), then I see "69.9%" and "Fail", and I never see "70.0%".
**S-1.4** Given the pass mark is "70", when I enter "2" of "3", then I see "66.6%" (rounded down, not "66.7%") and "Fail".
**S-1.5** Given each example, when I enter it, then I see the score and verdict: pass mark "0", "0" of "23" → "0.0%" and "Pass"; pass mark "100", "23" of "23" → "100.0%" and "Pass".
**S-1.6** Given the pass mark is "100", when I enter "999999.99" of "1000000", then I see "99.9%" and "Fail".
**S-1.7** Given the pass mark is "70", when I enter "0.01" of "1000000", then I see "0.0%" and "Fail".
**S-1.8** Given "76.0%" and "Pass" are shown for "17.5" of "23" with pass mark "70", when I change marks earned to "15.5", then the result changes to "67.3%" and "Fail" with no other action, and when I then change the pass mark to "65", the verdict changes to "Pass" and the score stays "67.3%".

## S-2 — Marks short of or above the pass mark

**S-2 (serves J-2, Implemented).** As a Learner, I want to see how many marks I am short of or above the pass mark, so that I can judge how much more study I need before a resit.

Priority: Must · Size: M

**S-2.1** Given the pass mark is "70", when I enter "15.5" of "23" (16.1 marks needed), then I see "Fail" and "0.6 marks short of the pass mark".
**S-2.2** Given the pass mark is "70", when I enter "17.5" of "23", then I see "Pass" and "1.4 marks above the pass mark".
**S-2.3** Given the pass mark is "70", when I enter "17.5" of "25" (17.5 marks needed), then I see "Pass" and "Exactly on the pass mark".
**S-2.4** Given the pass mark is "70" and the total is "20" (14 marks needed), when I enter "13", then I see "1 mark short of the pass mark", and when I enter "15", I see "1 mark above the pass mark".
**S-2.5** Given the pass mark is "70" and the total is "23.33" (16.331 marks needed), when I enter "16", then I see "0.34 marks short of the pass mark" (rounded up from 0.331), and when I enter "17", I see "0.66 marks above the pass mark" (rounded down from 0.669).
**S-2.6** Given the pass mark is "69.9" and the total is "23" (16.077 marks needed), when I enter "16.07", then I see "69.8%", "Fail" and "0.01 marks short of the pass mark", and when I enter "16.08", I see "69.9%", "Pass" and "Less than 0.01 marks above the pass mark".
**S-2.7** Given the total is "1000000", when I enter each example, then I see: pass mark "70", earned "0.01" → "699,999.99 marks short of the pass mark"; pass mark "100", earned "999999.99" → "0.01 marks short of the pass mark"; pass mark "0", earned "1000000" → "1,000,000 marks above the pass mark".
**S-2.8** Given "0.6 marks short of the pass mark" is shown for "15.5" of "23" with pass mark "70", when I change marks earned to "16.1", then I see "70.0%", "Pass" and "Exactly on the pass mark", and when I then change the pass mark to "65", I see "1.15 marks above the pass mark".

## S-3 — Clear message for an invalid or impossible entry

**S-3 (serves J-4, Implemented).** As an Instructor, I want a clear message naming what to fix whenever an entry is mistyped or impossible, with no score shown until it is fixed, so that a slip never becomes a recorded outcome.

Priority: Must · Size: M

**S-3.1** Given the page has just opened (marks earned and total empty, pass mark "70"), when I type "17.5" in marks earned only, or type only spaces in total, then the result area shows "Enter marks earned and total marks possible to see the score.", no score or verdict is shown and no field shows an error message.
**S-3.2** Given "17.5" of "23", when I clear the pass mark, then I still see "76.0%", the verdict area shows "Enter a pass mark to see whether this is a pass or a fail.", no "Pass", "Fail" or gap line is shown, and no error message is shown.
**S-3.3** Given total "23" and pass mark "70", when I type any of "abc", "17,5", "$17", "1.2.3", "1e400" or "+5" in marks earned, then I see "Marks earned must be a number, like 17.5." under marks earned, the result area shows "The score will appear once every entry is valid." and no score or verdict is shown; "abc" in total shows "Total marks possible must be a number, like 23." and "seventy" in pass mark shows "Pass mark must be a number, like 70."; " 017.5 " in marks earned is accepted and shows "76.0%".
**S-3.4** Given total "23" and pass mark "70", when I type "-1" or "-0" in marks earned, then I see "Marks earned can't be negative."; "-23" in total shows "Total marks possible can't be negative."; "-5" in pass mark shows "Pass mark can't be negative."; in each case no score is shown.
**S-3.5** Given total "23" and pass mark "70", when I type "17.555" in marks earned, then I see "Marks earned can have at most 2 decimal places."; "23.001" in total shows "Total marks possible can have at most 2 decimal places."; "70.05" in pass mark shows "Pass mark can have at most 1 decimal place."; in each case no score is shown.
**S-3.6** Given marks earned "10" and pass mark "70", when I enter each example, then I see its message and no score: total "0" → "Total marks possible must be more than 0."; total "1000000.01" → "Total marks possible can't be more than 1,000,000."; total "8" → "Marks earned can't be more than the total marks possible." under marks earned; pass mark "100.1" (total "23") → "Pass mark can't be more than 100."; total "1000000" is accepted and shows "0.0%".
**S-3.7** Given pass mark "70", when I type "abc" in marks earned and "0" in total, then I see "Marks earned must be a number, like 17.5." under marks earned and "Total marks possible must be more than 0." under total at the same time, and the result area shows "The score will appear once every entry is valid.".
**S-3.8** Given "Marks earned can't be more than the total marks possible." is shown for "23.5" of "23" with pass mark "70", when I change marks earned to "17.5", then the message disappears and I see "76.0%", "Pass" and "1.4 marks above the pass mark" with no other action; or when instead I change the total to "25", the message disappears and I see "94.0%", "Pass" and "6 marks above the pass mark".

## S-4 — Next learner in one step

**S-4 (serves J-5, Not implemented).** As an Instructor, I want to clear only the marks earned and start the next learner in one step, so that I can work through a cohort without retyping the total and pass mark.

Priority: Should · Size: S

**S-4.1** Given "76.0%" and "Pass" are shown for "17.5" of "23" with pass mark "70", when I activate "Next learner", then marks earned is empty, total is still "23", the pass mark is still "70", the cursor is in marks earned and the result area shows "Enter marks earned and total marks possible to see the score.".
**S-4.2** Given I have just activated "Next learner" after "17.5" of "23", when I type "15.5", then I see "67.3%", "Fail" and "0.6 marks short of the pass mark" without touching total or pass mark.
**S-4.3** Given "17.5" of "23" with pass mark "70" and the cursor in marks earned, when I press Escape, then the same happens as in S-4.1.
**S-4.4** Given "Marks earned can't be more than the total marks possible." is shown for "23.5" of "23", when I activate "Next learner", then the message disappears, marks earned is empty, total is still "23" and the result area shows "Enter marks earned and total marks possible to see the score.".
**S-4.5** Given the pass mark was changed to "65" and the total is "40" with marks earned "30", when I activate "Next learner" and type "26", then the pass mark is still "65" (not reset to "70") and I see "65.0%", "Pass" and "Exactly on the pass mark".

## S-5 — Copy the outcome as one line (future)

**S-5 (serves J-5, Not implemented).** As an Instructor, I want to copy a learner's outcome as one line of text, so that I can paste it into my gradebook without retyping it.

Priority: Could · Size: S

**S-5.1** Given "17.5" of "23" with pass mark "70", when I activate "Copy outcome", then the clipboard holds "17.5 of 23 marks: 76.0%, Pass, 1.4 marks above the pass mark" and I see "Outcome copied.".
**S-5.2** Given marks earned is empty, or any field shows an error message, or the pass mark is empty, when I look at "Copy outcome", then it is disabled and activating it copies nothing.

## S-6 — Marks needed to pass (future)

**S-6 (serves J-2, Not implemented).** As a Learner, I want to see how many marks the pass mark equals for my quiz's total, so that I know the target to aim for when I sit it again.

Priority: Could · Size: S

**S-6.1** Given pass mark "70", when I enter "16" of "23", then I see "Marks needed to pass: 16.1 of 23".
**S-6.2** Given pass mark "70", when I enter "16" of "23.33" (16.331 needed), then I see "Marks needed to pass: 16.34 of 23.33" (rounded up, so reaching it always passes).
**S-6.3** Given the pass mark is empty or any field shows an error message, then the "Marks needed to pass: {n} of {total}" line (M-29) is not shown.
