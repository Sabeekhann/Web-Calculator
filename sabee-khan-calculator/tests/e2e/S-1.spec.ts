import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { MESSAGES } from '../../src/messages';

// S-1 Score and pass/fail verdict (test-plan.md E-S1.1..E-S1.8).
// Numbers are quoted exactly from the ACs; words come from messages.ts (M-4 "Pass", M-5 "Fail").

const PASS = MESSAGES['M-4'];
const FAIL = MESSAGES['M-5'];

interface Card {
  earned: Locator;
  total: Locator;
  pass: Locator;
  result: Locator;
  score: Locator;
  verdict: Locator;
  status: Locator;
}

function card(page: Page): Card {
  const result = page.getByRole('region', { name: MESSAGES['M-39'] });
  return {
    earned: page.getByLabel(MESSAGES['M-34'], { exact: true }),
    total: page.getByLabel(MESSAGES['M-35'], { exact: true }),
    pass: page.getByLabel(MESSAGES['M-36'] + MESSAGES['M-37'], { exact: true }),
    result,
    score: result.locator('.score'),
    verdict: result.locator('.verdict'),
    status: page.getByRole('status'),
  };
}

/** Score and verdict as the user sees them; the verdict also carries its icon and colour class. */
async function expectOutcome(c: Card, score: string, verdict: string): Promise<void> {
  await expect(c.score).toHaveText(score);
  await expect(c.verdict).toHaveText(verdict);
  await expect(c.verdict).toHaveClass(new RegExp(`verdict--${verdict === PASS ? 'pass' : 'fail'}`));
  await expect(c.verdict.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  await expect(c.result).not.toContainText(MESSAGES['M-1']);
}

async function enter(c: Card, earned: string, total: string, pass?: string): Promise<void> {
  if (pass !== undefined) await c.pass.fill(pass);
  await c.total.fill(total);
  await c.earned.fill(earned);
}

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('E-S1.1 typing "17.5" of "23" with the pre-filled "70" shows "76.0%" and "Pass" with no button or key', async ({ page }) => {
  const c = card(page);
  await expect(c.pass).toHaveValue('70');
  await expect(c.score).toHaveCount(0);

  await c.earned.pressSequentially('17.5');
  await expect(c.result).toContainText(MESSAGES['M-1']);
  await c.total.pressSequentially('23');

  await expectOutcome(c, '76.0%', PASS);
  // The "%" is the half-size unit of the score.
  await expect(c.score.locator('.score-unit')).toHaveText('%');
  // Screen readers get the same outcome after the debounce.
  await expect(c.status).toContainText(`76.0%, ${PASS}`);
});

test('E-S1.2 "17.5" of "25" (exactly 70%) shows "70.0%" and "Pass"', async ({ page }) => {
  const c = card(page);
  await enter(c, '17.5', '25');
  await expectOutcome(c, '70.0%', PASS);
});

test('E-S1.3 "17.49" of "25" (69.96%) shows "69.9%" and "Fail", never "70.0%"', async ({ page }) => {
  const c = card(page);
  await c.total.fill('25');
  await c.earned.focus();
  const afterEachKey: Array<[string, string]> = [
    ['1', '4.0%'],
    ['7', '68.0%'],
    ['.', '68.0%'],
    ['4', '69.6%'],
    ['9', '69.9%'],
  ];
  for (const [key, score] of afterEachKey) {
    await page.keyboard.type(key);
    await expect(c.score).toHaveText(score);
    await expect(c.result).not.toContainText('70.0%');
  }
  await expect(c.earned).toHaveValue('17.49');
  await expectOutcome(c, '69.9%', FAIL);
});

test('E-S1.4 "2" of "3" shows "66.6%" (rounded down, not "66.7%") and "Fail"', async ({ page }) => {
  const c = card(page);
  await enter(c, '2', '3');
  await expectOutcome(c, '66.6%', FAIL);
  await expect(c.result).not.toContainText('66.7%');
});

test('E-S1.5 pass mark "0": "0" of "23" → "0.0%" Pass; pass mark "100": "23" of "23" → "100.0%" Pass', async ({ page }) => {
  const c = card(page);
  await enter(c, '0', '23', '0');
  await expectOutcome(c, '0.0%', PASS);

  await enter(c, '23', '23', '100');
  await expectOutcome(c, '100.0%', PASS);
});

test('E-S1.6 pass mark "100": "999999.99" of "1000000" shows "99.9%" and "Fail"', async ({ page }) => {
  const c = card(page);
  await enter(c, '999999.99', '1000000', '100');
  await expectOutcome(c, '99.9%', FAIL);
});

test('E-S1.7 "0.01" of "1000000" with pass mark "70" shows "0.0%" and "Fail"', async ({ page }) => {
  const c = card(page);
  await enter(c, '0.01', '1000000', '70');
  await expectOutcome(c, '0.0%', FAIL);
});

test('E-S1.8 after "76.0%" Pass, earned "15.5" → "67.3%" Fail; then pass mark "65" → Pass, score stays "67.3%"', async ({ page }) => {
  const c = card(page);
  await enter(c, '17.5', '23');
  await expectOutcome(c, '76.0%', PASS);

  await c.earned.fill('15.5');
  await expectOutcome(c, '67.3%', FAIL);

  await c.pass.fill('65');
  await expectOutcome(c, '67.3%', PASS);
  await expect(c.earned).toHaveValue('15.5');
  await expect(c.total).toHaveValue('23');
});
