# Jobs To Be Done (D8)

_Stage 3b. Owner: product-analyst. Status: approved by PO at GATE 3b (2026-10-07)._

Each job is true whether or not this product exists: a person with pen and paper has the same job.

## R-1 Bill Settler

**J-1 (R-1 Bill Settler).** When the bill for a group meal arrives and the staff have served us well, I want to work out a fair tip on the bill, so I can reward the staff properly without holding up the table.

**J-2 (R-1 Bill Settler).** When I have paid the whole bill on behalf of the group, I want to know exactly how much each person owes me, so I can get the full amount back without covering a shortfall myself or overcharging anyone.

**J-3 (R-1 Bill Settler).** When the total does not divide evenly between the people at the table, I want to settle openly who covers the leftover cents, so I can collect exactly the total without anyone arguing over a single cent.

**J-4 (R-1 Bill Settler).** When I realise I misread the receipt or miscounted the people, I want to redo the sums quickly with the right figures, so I can still give everyone the correct amount before the group leaves.

## R-2 Group Member

**J-5 (R-2 Group Member).** When someone tells me how much I owe for a shared meal, I want to work out my own share from the bill and the tip, so I can pay with confidence that I am not overpaying.

**J-6 (R-2 Group Member).** When my share is a cent different from what a friend was asked to pay, I want to understand why the amounts differ, so I can accept a fair split without disputing it with my friends.

## Purity check

- Command (case-insensitive, J-lines only): `grep -niE 'app|calculator|tool|feature|button|field|screen|input|enter|type|tap|click|display|result|page|reload|splitter' docs/jobs-to-be-done.md | grep -E '^[0-9]+:\*\*J-'`
- Result: no hits. No job names the product, a feature, a button, a field or a screen.
