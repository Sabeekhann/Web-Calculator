import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { MESSAGES } from '../../src/messages';

// S-2 Marks short of or above the pass mark (test-plan.md E-S2.1..E-S2.8).
// Gap strings are quoted exactly from the ACs; verdict words come from messages.ts (M-4, M-5).

const PASS = MESSAGES['M-4'];
const FAIL = MESSAGES['M-5'];

type Tone = 'pass' | 'fail';

interface Card {
  earned: Locator;
  total: Locator;
  pass: Locator;
  result: Locator;
  score: Locator;
  verdict: Locator;
  gap: Locator;
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
    gap: result.locator('.gap'),
    status: page.getByRole('status'),
  };
}

async function enter(c: Card, earned: string, total: string, pass?: string): Promise<void> {
  if (pass !== undefined) await c.pass.fill(pass);
  await c.total.fill(total);
  await c.earned.fill(earned);
}

/** The gap line text, plus its decorative icon (never colour alone: the words carry the meaning). */
async function expectGap(c: Card, text: string, tone: Tone): Promise<void> {
  await expect(c.gap).toHaveText(text);
  const icon = c.gap.locator('svg');
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
  await expect(icon).toHaveClass(new RegExp(`gap-icon--${tone}`));
}

async function expectVerdict(c: Card, score: string, verdict: string): Promise<void> {
  await expect(c.score).toHaveText(score);
  await expect(c.verdict).toHaveText(verdict);
}

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('E-S2.1 "15.5" of "23" at "70" shows "Fail" and "0.6 marks short of the pass mark"', async ({ page }) => {
  const c = card(page);
  await enter(c, '15.5', '23');
  await expect(c.verdict).toHaveText(FAIL);
  await expectGap(c, '0.6 marks short of the pass mark', 'fail');
  await expect(c.status).toHaveText(`67.3%, ${FAIL}, 0.6 marks short of the pass mark`);
});

test('E-S2.2 "17.5" of "23" at "70" shows "Pass" and "1.4 marks above the pass mark"', async ({ page }) => {
  const c = card(page);
  await enter(c, '17.5', '23');
  await expect(c.verdict).toHaveText(PASS);
  await expectGap(c, '1.4 marks above the pass mark', 'pass');
  await expect(c.status).toHaveText(`76.0%, ${PASS}, 1.4 marks above the pass mark`);
});

test('E-S2.3 "17.5" of "25" at "70" shows "Pass" and "Exactly on the pass mark"', async ({ page }) => {
  const c = card(page);
  await enter(c, '17.5', '25');
  await expect(c.verdict).toHaveText(PASS);
  await expectGap(c, 'Exactly on the pass mark', 'pass');
});

test('E-S2.4 total "20" at "70": "13" → "1 mark short of the pass mark"; "15" → "1 mark above the pass mark"', async ({ page }) => {
  const c = card(page);
  await enter(c, '13', '20', '70');
  await expectGap(c, '1 mark short of the pass mark', 'fail');

  await c.earned.fill('15');
  await expectGap(c, '1 mark above the pass mark', 'pass');
});

test('E-S2.5 total "23.33" at "70": "16" → "0.34 marks short …" (up); "17" → "0.66 marks above …" (down)', async ({ page }) => {
  const c = card(page);
  await enter(c, '16', '23.33', '70');
  await expectGap(c, '0.34 marks short of the pass mark', 'fail');

  await c.earned.fill('17');
  await expectGap(c, '0.66 marks above the pass mark', 'pass');
});

test('E-S2.6 pass "69.9", total "23": "16.07" → "69.8%" Fail "0.01 marks short …"; "16.08" → "69.9%" Pass M-11', async ({ page }) => {
  const c = card(page);
  await enter(c, '16.07', '23', '69.9');
  await expectVerdict(c, '69.8%', FAIL);
  await expectGap(c, '0.01 marks short of the pass mark', 'fail');

  await c.earned.fill('16.08');
  await expectVerdict(c, '69.9%', PASS);
  await expectGap(c, 'Less than 0.01 marks above the pass mark', 'pass');
});

test('E-S2.7 total "1000000": "699,999.99 marks short …", "0.01 marks short …", "1,000,000 marks above …"', async ({ page }) => {
  const c = card(page);
  await enter(c, '0.01', '1000000', '70');
  await expectGap(c, '699,999.99 marks short of the pass mark', 'fail');

  await enter(c, '999999.99', '1000000', '100');
  await expectGap(c, '0.01 marks short of the pass mark', 'fail');

  await enter(c, '1000000', '1000000', '0');
  await expectGap(c, '1,000,000 marks above the pass mark', 'pass');
});

test('E-S2.8 after "0.6 marks short …", earned "16.1" → "70.0%" Pass M-10; then pass "65" → "1.15 marks above …"', async ({ page }) => {
  const c = card(page);
  await enter(c, '15.5', '23', '70');
  await expectGap(c, '0.6 marks short of the pass mark', 'fail');

  await c.earned.fill('16.1');
  await expectVerdict(c, '70.0%', PASS);
  await expectGap(c, 'Exactly on the pass mark', 'pass');

  await c.pass.fill('65');
  await expectGap(c, '1.15 marks above the pass mark', 'pass');
  await expect(c.score).toHaveText('70.0%');
});

test('S-2 supporting: no gap line in idle or pass-mark-empty states, and no layout shift when it appears', async ({ page }) => {
  const c = card(page);
  const button = page.getByRole('button', { name: MESSAGES['M-25'] });
  await expect(c.gap).toHaveCount(0);
  const idleTop = (await button.boundingBox())?.y;

  await enter(c, '17.5', '23', '');
  await expect(c.result).toContainText(MESSAGES['M-2']);
  await expect(c.gap).toHaveCount(0);

  await c.pass.fill('70');
  await expectGap(c, '1.4 marks above the pass mark', 'pass');
  expect((await button.boundingBox())?.y).toBe(idleTop);

  await c.total.fill('');
  await expect(c.gap).toHaveCount(0);
});
