# App Roles (D7)

_Stage 3a. Owner: product-analyst. Status: approved by PO at GATE 3a (2026-10-07)._

## Roles

**R-1 Bill Settler.** A Bill Settler is the person at a restaurant, team lunch or shared takeaway who pays the whole bill or collects the money, and must tell everyone what they owe, often on a phone in a noisy place while the group waits. They can enter the bill amount, a tip percentage (including 0%) and the number of people, see the tip, the total and each person's share, see which shares carry an extra cent, and correct any invalid input and recalculate without reloading the page. They must never be shown shares that do not add up exactly to the total, or a result calculated from invalid input.

**R-2 Group Member.** A Group Member is someone who shared the meal and has been told how much they owe, and wants to check that the amount is fair before paying. They can enter the bill amount, tip percentage and number of people they were given, see the tip, the total and each person's share, see which shares carry an extra cent so they know whether a 1-cent difference from the Bill Settler's figure is expected, and change any value to recalculate. They must never be shown a different split for the same bill, tip and number of people, or a result while any input is invalid.

## How their needs differ

| Need | R-1 Bill Settler | R-2 Group Member |
|---|---|---|
| Primary goal | Produce a split everyone accepts, fast | Confirm the share they were asked for is fair |
| Enter vs. check | Enters figures from the receipt for the first time | Re-enters figures they were told and compares one share |
| What an error costs them | Pays the shortfall, or over-collects and looks unfair | Overpays, or disputes a correct amount with friends |
| Key output | Every share, and that they sum to the total | Their own share, and why it may differ by 1 cent |
| Context | Under time pressure, the group waiting on them | Less hurried, but checking on the spot before paying |
