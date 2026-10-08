import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { MESSAGES } from '../../src/messages';

// S-3 Clear message for an invalid or impossible entry (test-plan.md E-S3.1..E-S3.8).
// Every message is quoted exactly as written in the ACs (docs/user-stories.md).

const M1 = 'Enter marks earned and total marks possible to see the score.';
const M2 = 'Enter a pass mark to see whether this is a pass or a fail.';
const M3 = 'The score will appear once every entry is valid.';

type Field = 'earned' | 'total' | 'pass';

interface Card {
  inputs: Record<Field, Locator>;
  result: Locator;
  score: Locator;
  verdict: Locator;
  gap: Locator;
  status: Locator;
}

function card(page: Page): Card {
  const result = page.getByRole('region', { name: MESSAGES['M-39'] });
  return {
    inputs: {
      earned: page.getByLabel(MESSAGES['M-34'], { exact: true }),
      total: page.getByLabel(MESSAGES['M-35'], { exact: true }),
      pass: page.getByLabel(MESSAGES['M-36'] + MESSAGES['M-37'], { exact: true }),
    },
    result,
    score: result.locator('.score'),
    verdict: result.locator('.verdict'),
    gap: result.locator('.gap'),
    status: page.getByRole('status'),
  };
}

async function enter(c: Card, earned: string, total: string, pass?: string): Promise<void> {
  if (pass !== undefined) await c.inputs.pass.fill(pass);
  await c.inputs.total.fill(total);
  await c.inputs.earned.fill(earned);
}

/** The error slot an input points at through aria-describedby. */
async function errorSlot(page: Page, input: Locator): Promise<Locator> {
  const id = await input.getAttribute('aria-describedby');
  expect(id).toBeTruthy();
  return page.locator(`#${id}`);
}

/** Each field shows exactly its expected message (or none), with icon and aria-invalid only while in error. */
async function expectFieldErrors(page: Page, c: Card, errors: Partial<Record<Field, string>>): Promise<void> {
  for (const field of ['earned', 'total', 'pass'] as const) {
    const input = c.inputs[field];
    const slot = await errorSlot(page, input);
    const text = errors[field];
    if (text === undefined) {
      await expect(slot).toHaveText('');
      await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    } else {
      await expect(slot).toHaveText(text);
      await expect(slot.locator('svg')).toHaveAttribute('aria-hidden', 'true');
      await expect(input).toHaveAttribute('aria-invalid', 'true');
    }
  }
}

/** The result area shows M-3 with its icon, and no score, verdict or gap line. */
async function expectNoScore(c: Card): Promise<void> {
  await expect(c.result).toContainText(M3);
  await expect(c.result.locator('.result-msg svg')).toHaveAttribute('aria-hidden', 'true');
  await expect(c.score).toHaveCount(0);
  await expect(c.verdict).toHaveCount(0);
  await expect(c.gap).toHaveCount(0);
  await expect(c.result).not.toContainText(M1);
}

async function expectOutcome(c: Card, score: string, verdict: string, gapLine: string): Promise<void> {
  await expect(c.score).toHaveText(score);
  await expect(c.verdict).toHaveText(verdict);
  await expect(c.gap).toHaveText(gapLine);
  await expect(c.result).not.toContainText(M3);
}

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('E-S3.1 only "17.5" in earned, or only spaces in total → M-1, no score, no field error', async ({ page }) => {
  const c = card(page);
  await c.inputs.earned.fill('17.5');
  await expect(c.result).toContainText(M1);
  await expect(c.score).toHaveCount(0);
  await expectFieldErrors(page, c, {});

  await c.inputs.earned.fill('');
  await c.inputs.total.fill('   ');
  await expect(c.result).toContainText(M1);
  await expect(c.score).toHaveCount(0);
  await expectFieldErrors(page, c, {});
});

test('E-S3.2 "17.5" of "23", pass mark cleared → "76.0%" + M-2, no Pass/Fail, gap or error', async ({ page }) => {
  const c = card(page);
  await enter(c, '17.5', '23');
  await expect(c.verdict).toHaveText('Pass');
  await c.inputs.pass.fill('');
  await expect(c.score).toHaveText('76.0%');
  await expect(c.result).toContainText(M2);
  await expect(c.verdict).toHaveCount(0);
  await expect(c.gap).toHaveCount(0);
  await expect(c.result).not.toContainText('Fail');
  await expectFieldErrors(page, c, {});
});

test('E-S3.3 "abc", "17,5", "$17", "1.2.3", "1e400", "+5" → M-12 + M-3; total "abc" → M-16; pass "seventy" → M-21; " 017.5 " → "76.0%"', async ({ page }) => {
  const c = card(page);
  await c.inputs.total.fill('23');
  for (const raw of ['abc', '17,5', '$17', '1.2.3', '1e400', '+5']) {
    await c.inputs.earned.fill(raw);
    await expectFieldErrors(page, c, { earned: 'Marks earned must be a number, like 17.5.' });
    await expectNoScore(c);
  }

  await c.inputs.earned.fill('17.5');
  await c.inputs.total.fill('abc');
  await expectFieldErrors(page, c, { total: 'Total marks possible must be a number, like 23.' });
  await expectNoScore(c);

  await c.inputs.total.fill('23');
  await c.inputs.pass.fill('seventy');
  await expectFieldErrors(page, c, { pass: 'Pass mark must be a number, like 70.' });
  await expectNoScore(c);

  await c.inputs.pass.fill('70');
  await c.inputs.earned.fill(' 017.5 ');
  await expect(c.score).toHaveText('76.0%');
  await expectFieldErrors(page, c, {});
});

test('E-S3.4 "-1"/"-0" → M-13; total "-23" → M-17; pass "-5" → M-22; no score', async ({ page }) => {
  const c = card(page);
  await c.inputs.total.fill('23');
  for (const raw of ['-1', '-0']) {
    await c.inputs.earned.fill(raw);
    await expectFieldErrors(page, c, { earned: "Marks earned can't be negative." });
    await expectNoScore(c);
  }

  await enter(c, '17.5', '-23');
  await expectFieldErrors(page, c, { total: "Total marks possible can't be negative." });
  await expectNoScore(c);

  await enter(c, '17.5', '23', '-5');
  await expectFieldErrors(page, c, { pass: "Pass mark can't be negative." });
  await expectNoScore(c);
});

test('E-S3.5 "17.555" → M-14; total "23.001" → M-18; pass "70.05" → M-23; no score', async ({ page }) => {
  const c = card(page);
  await enter(c, '17.555', '23');
  await expectFieldErrors(page, c, { earned: 'Marks earned can have at most 2 decimal places.' });
  await expectNoScore(c);

  await enter(c, '17.5', '23.001');
  await expectFieldErrors(page, c, { total: 'Total marks possible can have at most 2 decimal places.' });
  await expectNoScore(c);

  await enter(c, '17.5', '23', '70.05');
  await expectFieldErrors(page, c, { pass: 'Pass mark can have at most 1 decimal place.' });
  await expectNoScore(c);
});

test('E-S3.6 earned "10": total "0" → M-19; "1000000.01" → M-20; "8" → M-15 under earned; pass "100.1" → M-24; "1000000" → "0.0%"', async ({ page }) => {
  const c = card(page);
  await enter(c, '10', '0');
  await expectFieldErrors(page, c, { total: 'Total marks possible must be more than 0.' });
  await expectNoScore(c);

  await c.inputs.total.fill('1000000.01');
  await expectFieldErrors(page, c, { total: "Total marks possible can't be more than 1,000,000." });
  await expectNoScore(c);

  await c.inputs.total.fill('8');
  await expectFieldErrors(page, c, { earned: "Marks earned can't be more than the total marks possible." });
  await expectNoScore(c);

  await c.inputs.total.fill('23');
  await c.inputs.pass.fill('100.1');
  await expectFieldErrors(page, c, { pass: "Pass mark can't be more than 100." });
  await expectNoScore(c);

  await c.inputs.pass.fill('70');
  await c.inputs.total.fill('1000000');
  await expect(c.score).toHaveText('0.0%');
  await expectFieldErrors(page, c, {});
});

test('E-S3.7 earned "abc" + total "0" → M-12 and M-19 at the same time, M-3 in the result area', async ({ page }) => {
  const c = card(page);
  await enter(c, 'abc', '0');
  await expectFieldErrors(page, c, {
    earned: 'Marks earned must be a number, like 17.5.',
    total: 'Total marks possible must be more than 0.',
  });
  await expectNoScore(c);
  // Screen readers hear each field's message, then M-3, once, after the debounce.
  await expect(c.status).toHaveText(
    `Marks earned must be a number, like 17.5. Total marks possible must be more than 0. ${M3}`,
  );
});

test('E-S3.8 M-15 for "23.5" of "23" clears when earned → "17.5" ("76.0%", Pass, "1.4 marks above …")', async ({ page }) => {
  const c = card(page);
  await enter(c, '23.5', '23');
  await expectFieldErrors(page, c, { earned: "Marks earned can't be more than the total marks possible." });
  await expectNoScore(c);

  await c.inputs.earned.fill('17.5');
  await expectFieldErrors(page, c, {});
  await expectOutcome(c, '76.0%', 'Pass', '1.4 marks above the pass mark');
});

test('E-S3.8 M-15 for "23.5" of "23" clears when total → "25" ("94.0%", Pass, "6 marks above …")', async ({ page }) => {
  const c = card(page);
  await enter(c, '23.5', '23');
  await expectFieldErrors(page, c, { earned: "Marks earned can't be more than the total marks possible." });

  await c.inputs.total.fill('25');
  await expectFieldErrors(page, c, {});
  await expectOutcome(c, '94.0%', 'Pass', '6 marks above the pass mark');
});

test('S-3 supporting: no layout shift between result and error states; focus stays in the field', async ({ page }) => {
  const c = card(page);
  // The card's bottom edge is the anchor: nothing in or below the card moves between states.
  const cardBottom = async (): Promise<number | undefined> => {
    const box = await page.locator('.card').boundingBox();
    return box ? box.y + box.height : undefined;
  };
  await enter(c, '17.5', '23');
  await expect(c.score).toHaveText('76.0%');
  const resultTop = await cardBottom();

  await c.inputs.earned.fill('23.5');
  await expect(c.result).toContainText(M3);
  await expect(c.inputs.earned).toBeFocused();
  expect(await cardBottom()).toBe(resultTop);

  await c.inputs.total.fill('0');
  await expect(c.result).toContainText(M3);
  expect(await cardBottom()).toBe(resultTop);
});
