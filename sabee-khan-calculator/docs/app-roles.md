# App Roles

The app has no accounts or sign-in. Both roles use the same single screen, and each "They must never" is something the app prevents through how it calculates and checks what is entered, not through access control.

## R-1 Learner

A Learner is an employee on a mandatory compliance course who has just had a quiz marked by hand and returned as raw marks (for example 17.5 out of 23), and who must decide before the resit deadline whether to book a resit. They can enter the marks they earned, the total marks possible and their course's pass mark (70% unless they change it), and see their score as a percentage, a clear pass or fail verdict, how many marks they are short of or above the pass mark, and a plain message telling them what to fix when something they entered cannot be right. They must never be shown a pass for a score below the pass mark, a failing score that looks like the pass mark itself (69.96% is shown as "69.9%", never "70.0%"), or any score for marks that cannot exist, such as more marks earned than were possible or a total of 0.

## R-2 Instructor

An Instructor is a course instructor or L&D trainer who marks short-answer assessments by hand for a cohort of learners, often awarding half marks, and who must record a percentage and a pass or fail for each learner that holds up if a learner challenges it. They can enter one learner's marks earned at a time against the same total possible and the pass mark set for the course, see the score as a percentage to one decimal place, the verdict and the margin to the pass mark, and see a clear message naming the problem whenever an entry is mistyped or impossible. They must never get a different verdict for the same marks, a verdict judged on the rounded score instead of the exact one, or a score from a slip such as an empty or 0 total, more marks earned than possible, more than 2 decimal places, a negative mark or a pass mark outside 0–100.

## How their needs differ

| Need | Learner | Instructor |
|------|---------|------------|
| Main question | "Did I pass, and by how much?" | "What percentage and verdict do I record for this learner?" |
| What they enter most often | Their own marks, once; the pass mark only if their course is not 70% | Marks earned for each learner in turn; total and pass mark stay the same for the whole cohort |
| What matters most in the result | The verdict and the marks short of or above the pass mark | The exact percentage and a verdict that is the same every time for the same marks |
| Frequency and speed | Once or twice per quiz, often on a phone | Many times in a row in one marking session; changing one number must give the next answer at once |
| Tolerance for ambiguity at the boundary | Low: wants a straight answer, not "70.0%" next to Fail | None: a borderline call must survive a learner's challenge |

One design serves both: the verdict and margin answer the Learner's question at a glance, while one fixed rule (pass if the exact score is at or above the pass mark; score shown to 1 decimal place, rounded down) gives the Instructor the same defensible answer for every learner.
Because the total and pass mark stay in place while only marks earned changes, the Instructor can work through a cohort quickly without the app saving anything.
