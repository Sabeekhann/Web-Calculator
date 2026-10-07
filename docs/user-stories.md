# User Stories (D9)

_Stage 3c. Owner: product-analyst. Status: approved by PO at GATE 3c (2026-10-07)._

**Assumptions (PO-approved at GATE 3c; see Decisions at the end)**
- **Interaction model (Q1):** the user fills in Bill, Tip % and People, then presses the visible **Calculate** button or Enter in any field. "I calculate" in an AC means exactly that. A new calculation replaces the previous result. After a result is shown, editing ANY field immediately hides the old result (tip, total, shares, note) until the next calculation. The app never clears what the user typed.
- **Error messages (Q2):** messages appear only when the user calculates, never while typing. A message clears on the next calculation, and also clears while typing as soon as that field's value becomes valid.
- **Tip default (Q3):** Tip % starts pre-filled with `0`, with the hint "Use 0 for no tip." shown next to it. If the user empties it, E-TIP-EMPTY applies.
- **Result layout:** `Tip: {tip}`, `Total: {total}`, one line per person `Person {n}: {share}` for n = 1…N, then a one-line note (S-6). A share that carries a leftover cent ends with ` (+0.01)` (S-3).
- **Amount format:** exactly 2 decimals, a dot for decimals, a comma between thousands, no currency symbol: `0.00`, `38.34`, `1,000,000.00`.
- **Global rules (every story):** the binding rules of product-brief §8 apply (integer cents, tip rounded half-up to the cent, leftover cents to the first shares). "No result" means no tip, total, shares or note is shown. No result is ever shown while any input is invalid or after an input was changed since the last calculation. Output is never NaN, Infinity, undefined or blank. Same inputs always give the same split. Each error appears next to its own field. Accepted and rejected input forms follow the catalogue (incl. Q4).

## Traceability

| Story | Job | Role | Priority (MoSCoW) | Size (S/M/L) | Status |
|---|---|---|---|---|---|
| S-1 | J-2 | R-1 Bill Settler | Must | M | Not implemented |
| S-2 | J-1 | R-1 Bill Settler | Must | M | Not implemented |
| S-3 | J-3 | R-1 Bill Settler | Must | S | Not implemented |
| S-4 | J-4 | R-1 Bill Settler | Must | S | Not implemented |
| S-5 | J-5 | R-2 Group Member | Should | S | Not implemented |
| S-6 | J-6 | R-2 Group Member | Should | S | Not implemented |
| S-7 | J-2 | R-1 Bill Settler | Could (future) | M | Not implemented |
| S-8 | J-1 | R-1 Bill Settler | Could (future) | S | Not implemented |
| S-9 | J-3 | R-1 Bill Settler | Won't this release (future) | M | Not implemented |

Jobs → stories: J-1 → S-2, S-8 · J-2 → S-1, S-7 · J-3 → S-3, S-9 · J-4 → S-4 · J-5 → S-5 · J-6 → S-6. No orphans.

## Message catalogue

Whitespace at the start and end of every field is trimmed first. If a field breaks several rules, the first matching row for that field wins.

| Message ID | Field | Trigger | Exact text |
|---|---|---|---|
| E-BILL-EMPTY | Bill | Empty or only spaces | "Enter the bill amount, for example 84.50." |
| E-BILL-COMMA | Bill | Contains a comma (`12,50`, `1,000.00`) | "Use a dot for decimals and no commas, for example 12.50." |
| E-BILL-NEGATIVE | Bill | Starts with `-` | "The bill amount can't be negative. Enter an amount from 0.01 to 1000000.00." |
| E-BILL-FORMAT | Bill | Any character other than digits and one dot (letters, `1e400`, `1.2.3`) | "Enter the bill amount using only digits and one dot, for example 84.50." |
| E-BILL-DECIMALS | Bill | More than 2 decimals | "Enter the bill amount with no more than 2 decimals, for example 84.50." |
| E-BILL-RANGE | Bill | Below 0.01 (`0.00`) or above 1000000.00 (incl. 50-digit numbers) | "Enter a bill amount from 0.01 to 1000000.00." |
| E-TIP-EMPTY | Tip % | Empty or only spaces | "Enter a tip percentage from 0 to 100. Use 0 for no tip." |
| E-TIP-COMMA | Tip % | Contains a comma (`12,5`) | "Use a dot for decimals and no commas, for example 12.5." |
| E-TIP-NEGATIVE | Tip % | Starts with `-` | "The tip can't be negative. Enter a percentage from 0 to 100." |
| E-TIP-FORMAT | Tip % | Any character other than digits and one dot (letters, `1e400`, `15%`) | "Enter the tip percentage using only digits and one dot, for example 12.5." |
| E-TIP-DECIMALS | Tip % | More than 2 decimals | "Enter the tip percentage with no more than 2 decimals, for example 12.5." |
| E-TIP-RANGE | Tip % | Above 100 | "Enter a tip percentage from 0 to 100." |
| E-PEOPLE-EMPTY | People | Empty or only spaces | "Enter the number of people, for example 4." |
| E-PEOPLE-INVALID | People | Anything not a whole number from 1 to 100 (`0`, `101`, `2.5`, `-3`, `abc`, `1e400`) | "Enter the number of people as a whole number from 1 to 100." |
| H-TIP-HINT | Tip % (hint) | Always shown next to Tip % (not an error) | "Use 0 for no tip." |
| N-EVEN | Result note | All shares equal (incl. 1 person) | "All shares are equal." |
| N-ONE | Result note | 1 leftover cent | "{total} does not divide evenly by {N}, so Person 1 pays 0.01 more than the others." |
| N-MANY | Result note | r ≥ 2 leftover cents | "{total} does not divide evenly by {N}, so the first {r} people each pay 0.01 more than the others." |

Input forms (Q4, Bill and Tip %): `.5` is accepted as `0.50` and `5.` as `5.00`; `+5` and `15%` get the FORMAT message; `1,000.00` gets the COMMA message.

## MVP stories

**S-1 (serves J-2, Not implemented).** As a Bill Settler, I want to enter the bill and the number of people and see each person's share, so that I know exactly what each person owes me and the shares add up to the bill.
- AC S-1.1 — Given bill `100.00`, tip `0` and people `3`, when I calculate, then I see Total `100.00` and Person 1 `33.34`, Person 2 `33.33`, Person 3 `33.33` (sum `100.00`).
- AC S-1.2 — Given bill `12,50`, tip `0` and people `2`, when I calculate, then I see "Use a dot for decimals and no commas, for example 12.50." next to Bill and no result.
- AC S-1.3 — Given bill `100.00`, tip `0` and people `101`, when I calculate, then I see "Enter the number of people as a whole number from 1 to 100." next to People and no result.
- AC S-1.4 — Given bill `0.00`, tip `0` and people `3`, when I calculate, then I see "Enter a bill amount from 0.01 to 1000000.00." next to Bill and no result.
- AC S-1.5 — Given bill `1000000.00`, tip `0` and people `1`, when I calculate, then I see Total `1,000,000.00` and one share, Person 1 `1,000,000.00`.
- AC S-1.6 — Given bill `0.01`, tip `0` and people `3`, when I calculate, then I see Total `0.01` and Person 1 `0.01`, Person 2 `0.00`, Person 3 `0.00`.
- AC S-1.7 — Given the result of AC S-1.1 is shown, when I change people to `4` and calculate, then it is replaced by Total `100.00` and Persons 1–4 each `25.00`.
- AC S-1.8 — Given the message from AC S-1.2 is shown, when I change the bill to `12.50`, then the Bill message disappears before I calculate; and when I then calculate, I see Total `12.50` and Person 1 `6.25`, Person 2 `6.25`.

**S-2 (serves J-1, Not implemented).** As a Bill Settler, I want to add a tip percentage and see the tip and the new total, so that I can reward the staff fairly without doing the sums at the table.
- AC S-2.1 — Given bill `100.00`, tip `15` and people `3`, when I calculate, then I see Tip `15.00`, Total `115.00` and shares `38.34`, `38.33`, `38.33`.
- AC S-2.2 — Given bill `0.30`, tip `15` and people `1`, when I calculate, then I see Tip `0.05` (0.045 rounded half-up), Total `0.35` and Person 1 `0.35`.
- AC S-2.3 — Given the page has just loaded, then Tip % shows `0` with the hint "Use 0 for no tip."; when I enter bill `50.00` and people `2` without changing Tip % and calculate, then I see Tip `0.00`, Total `50.00` and shares `25.00`, `25.00`.
- AC S-2.4 — Given bill `100.00`, tip `100.01` and people `3`, when I calculate, then I see "Enter a tip percentage from 0 to 100." next to Tip % and no result.
- AC S-2.5 — Given bill `1000000.00`, tip `100` and people `3`, when I calculate, then I see Tip `1,000,000.00`, Total `2,000,000.00` and shares `666,666.67`, `666,666.67`, `666,666.66`.
- AC S-2.6 — Given bill `100.00`, tip `-5` and people `3`, when I calculate, then I see "The tip can't be negative. Enter a percentage from 0 to 100." next to Tip % and no result.
- AC S-2.7 — Given the result of AC S-2.1 is shown, when I change the tip to `12.5` and calculate, then I see Tip `12.50`, Total `112.50` and three shares of `37.50`.
- AC S-2.8 — Given bill `100.00`, tip `12.555`, people `3` and "Enter the tip percentage with no more than 2 decimals, for example 12.5." shown next to Tip %, when I change the tip to `12.55` and calculate, then the message is gone and I see Tip `12.55`, Total `112.55` and shares `37.52`, `37.52`, `37.51`.

**S-3 (serves J-3, Not implemented).** As a Bill Settler, I want every share that carries a leftover cent to be marked, so that I can tell the group openly who covers the extra cents and still collect exactly the total.
- AC S-3.1 — Given bill `100.00`, tip `15` and people `3`, when I calculate, then I see `Person 1: 38.34 (+0.01)`, `Person 2: 38.33`, `Person 3: 38.33` (sum `115.00`).
- AC S-3.2 — Given bill `120.00`, tip `0` and people `4`, when I calculate, then Persons 1–4 each show `30.00` and no share shows `(+0.01)`.
- AC S-3.3 — Given bill `999999.99`, tip `0` and people `100`, when I calculate, then Persons 1–99 each show `10,000.00 (+0.01)` and `Person 100: 9,999.99` has no marker (sum `999,999.99`).
- AC S-3.4 — Given bill `0.01`, tip `0` and people `3`, when I calculate, then I see `Person 1: 0.01 (+0.01)`, `Person 2: 0.00`, `Person 3: 0.00`.
- AC S-3.5 — Given bill `33.33`, tip `0` and people `1`, when I calculate, then I see `Person 1: 33.33` with no marker.
- AC S-3.6 — Given bill `100.00`, tip `15` and people `abc`, when I calculate, then I see "Enter the number of people as a whole number from 1 to 100." next to People and no shares or markers.
- AC S-3.7 — Given the result of AC S-3.1 is shown, when I change people to `4` and calculate, then Persons 1–4 each show `28.75` and no share shows `(+0.01)`.
- AC S-3.8 — Given bill `100.00`, tip `15`, people `0` and the People message shown, when I change people to `3` and calculate, then the message is gone and I see `Person 1: 38.34 (+0.01)`, `Person 2: 38.33`, `Person 3: 38.33`.

**S-4 (serves J-4, Not implemented).** As a Bill Settler, I want to correct one figure and calculate again without retyping the others, so that I can fix a misread receipt or a miscount before the group leaves.
- AC S-4.1 — Given the result for bill `100.00`, tip `15`, people `3` is shown, when I change the bill to `110.00`, then the old result is hidden at once, before I press Enter; and when I then press Enter in the Bill field, Tip % still shows `15`, People still shows `3`, and I see Tip `16.50`, Total `126.50` and shares `42.17`, `42.17`, `42.16`.
- AC S-4.2 — Given the result for bill `100.00`, tip `15`, people `3` is shown, when I empty the Bill field and calculate, then I see "Enter the bill amount, for example 84.50." next to Bill, the old result is gone, and Tip % `15` and People `3` are unchanged.
- AC S-4.3 — Given bill `abc`, tip `15` and people empty, when I calculate, then I see "Enter the bill amount using only digits and one dot, for example 84.50." next to Bill, "Enter the number of people, for example 4." next to People, and no result.
- AC S-4.4 — Given both messages from AC S-4.3 are shown, when I change only the bill to `100.00` and calculate, then the Bill message is gone, the People message is still shown, and there is no result.
- AC S-4.5 — Given the state after AC S-4.4, when I enter people `3` and calculate, then no message is shown and I see Tip `15.00`, Total `115.00` and shares `38.34`, `38.33`, `38.33`.
- AC S-4.6 — Given the result for bill `100.00`, tip `15`, people `3` is shown, when I change people to `100` and calculate, then I see Total `115.00` and Persons 1–100 each `1.15`.
- AC S-4.7 — Given the result for bill `100.00`, tip `15`, people `3` is shown, when I change the bill to `12345678901234567890123456789012345678901234567890` and calculate, then I see "Enter a bill amount from 0.01 to 1000000.00." next to Bill, no result, and Tip % `15` and People `3` unchanged.
- AC S-4.8 — Given the result for bill `100.00`, tip `15`, people `3` is shown, when I change the bill to `0.01` and calculate, then I see Tip `0.00`, Total `0.01` and shares `0.01`, `0.00`, `0.00`.

**S-5 (serves J-5, Not implemented).** As a Group Member, I want to enter the bill, tip and number of people I was told and see every share by person number, so that I can check the amount I was asked for before I pay.
- AC S-5.1 — Given bill `84.50`, tip `10` and people `4`, when I calculate, then I see Tip `8.45`, Total `92.95` and shares `23.24`, `23.24`, `23.24`, `23.23`.
- AC S-5.2 — Given the result of AC S-5.1 is shown, when I calculate twice more without changing anything, then each time I see exactly Tip `8.45`, Total `92.95` and shares `23.24`, `23.24`, `23.24`, `23.23`.
- AC S-5.3 — Given pasted values bill `  84.50 `, tip ` 10` and people `4 `, when I calculate, then no message is shown and I see the same result as AC S-5.1.
- AC S-5.4 — Given bill `84.50`, tip `1e400` and people `4`, when I calculate, then I see "Enter the tip percentage using only digits and one dot, for example 12.5." next to Tip % and no result.
- AC S-5.5 — Given bill `-84.50`, tip `10` and people `4`, when I calculate, then I see "The bill amount can't be negative. Enter an amount from 0.01 to 1000000.00." next to Bill and no result.
- AC S-5.6 — Given bill `1000000.01`, tip `10` and people `4`, when I calculate, then I see "Enter a bill amount from 0.01 to 1000000.00." next to Bill and no result.
- AC S-5.7 — Given bill `0.03`, tip `0` and people `4`, when I calculate, then I see Total `0.03` and shares `0.01`, `0.01`, `0.01`, `0.00`.
- AC S-5.8 — Given the message from AC S-5.4 is shown, when I change the tip to `10` and calculate, then the message is gone and I see the result of AC S-5.1.

**S-6 (serves J-6, Not implemented).** As a Group Member, I want a short note explaining why some shares are 0.01 higher, so that I can accept a 1-cent difference from a friend's share without disputing it.
- AC S-6.1 — Given bill `100.00`, tip `15` and people `3`, when I calculate, then I see the note "115.00 does not divide evenly by 3, so Person 1 pays 0.01 more than the others."
- AC S-6.2 — Given bill `100.99`, tip `0` and people `100`, when I calculate, then Persons 1–99 show `1.01`, Person 100 shows `1.00`, and the note reads "100.99 does not divide evenly by 100, so the first 99 people each pay 0.01 more than the others."
- AC S-6.3 — Given bill `33.33`, tip `0` and people `1`, when I calculate, then the note reads "All shares are equal."
- AC S-6.4 — Given bill `1000000.00`, tip `100` and people `3`, when I calculate, then the note reads "2,000,000.00 does not divide evenly by 3, so the first 2 people each pay 0.01 more than the others."
- AC S-6.5 — Given bill `0.01`, tip `0` and people `3`, when I calculate, then the note reads "0.01 does not divide evenly by 3, so Person 1 pays 0.01 more than the others."
- AC S-6.6 — Given bill `100.00`, tip `15` and people empty, when I calculate, then I see "Enter the number of people, for example 4." next to People and no note.
- AC S-6.7 — Given the result of AC S-6.1 is shown, when I change people to `5` and calculate, then Persons 1–5 each show `23.00` and the note reads "All shares are equal."
- AC S-6.8 — Given the message from AC S-6.6 is shown, when I enter people `3` and calculate, then the message is gone and the note reads "115.00 does not divide evenly by 3, so Person 1 pays 0.01 more than the others."

## Future stories (not in this release)

**S-7 (serves J-2, Not implemented).** As a Bill Settler, I want the option to round every share up to a whole amount, so that people can pay with notes and coins without needing small change.
- AC S-7.1 — Given round-up is on and bill `100.00`, tip `15`, people `3`, when I calculate, then each share is `39.00` and I see that `117.00` is collected, `2.00` more than the Total `115.00`.
- AC S-7.2 — Given round-up is on and bill `120.00`, tip `0`, people `4`, when I calculate, then each share is `30.00` and `120.00` is collected, `0.00` more than the total.
- AC S-7.3 — Given round-up is off and bill `100.00`, tip `15`, people `3`, when I calculate, then the shares are `38.34`, `38.33`, `38.33` as in AC S-2.1.

**S-8 (serves J-1, Not implemented).** As a Bill Settler, I want to pick a common tip (10, 15 or 20 %) with one choice, so that I can set the tip without typing.
- AC S-8.1 — Given bill `100.00` and people `3`, when I choose the 15 % preset and calculate, then Tip % shows `15` and I see Tip `15.00`, Total `115.00` and shares `38.34`, `38.33`, `38.33`.
- AC S-8.2 — Given the 15 % preset was chosen, when I type `12.5` in Tip % and calculate, then I see Tip `12.50` and Total `112.50`.

**S-9 (serves J-3, Not implemented).** As a Bill Settler, I want to name each person and choose who takes the leftover cents, so that the group can agree who pays the extra cent instead of it always falling on Person 1.
- AC S-9.1 — Given bill `100.00`, tip `15`, people `3` named Ana, Ben and Cy, when I give the leftover cent to Cy and calculate, then I see Ana `38.33`, Ben `38.33`, Cy `38.34 (+0.01)`.
- AC S-9.2 — Given no names are entered, when I calculate bill `100.00`, tip `15`, people `3`, then the shares are labelled and marked exactly as in AC S-3.1.

## Decisions (PO, GATE 3c)
- **Q1 Interaction model:** visible Calculate button, and Enter in any field also calculates; editing any field after a result hides the old result until the next calculation.
- **Q2 Message clearing:** messages appear only on calculate; a message clears on the next calculation and also while typing as soon as its field becomes valid.
- **Q3 Tip default:** Tip % starts at `0` with the hint "Use 0 for no tip."; an emptied Tip % still gets E-TIP-EMPTY.
- **Q4 Input forms:** `.5` → `0.50` and `5.` → `5.00` accepted; `+5` and `15%` → FORMAT message; `1,000.00` → COMMA message.
