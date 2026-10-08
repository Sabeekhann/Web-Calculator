import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { MESSAGES } from '../../src/messages';

// Stage 8 hardening: the CLAUDE.md §12 edge sweep, automated (E-EDGE.1..E-EDGE.9).
// Rules: A-12 (empty/spaces), A-13 (number format), A-14 (negative), A-15 (check order), A-16 (M-3), A-18 (lone "." / "-").
// Messages are quoted exactly as in docs/user-stories.md; a check against messages.ts guards the two from drifting apart.

const M1 = 'Enter marks earned and total marks possible to see the score.';
const M2 = 'Enter a pass mark to see whether this is a pass or a fail.';
const M3 = 'The score will appear once every entry is valid.';
const PASS = 'Pass';
const FAIL = 'Fail';

type Field = 'earned' | 'total' | 'pass';
const FIELDS: ReadonlyArray<Field> = ['earned', 'total', 'pass'];

const NOT_NUMBER: Record<Field, string> = {
  earned: 'Marks earned must be a number, like 17.5.',
  total: 'Total marks possible must be a number, like 23.',
  pass: 'Pass mark must be a number, like 70.',
};
const NEGATIVE: Record<Field, string> = {
  earned: "Marks earned can't be negative.",
  total: "Total marks possible can't be negative.",
  pass: "Pass mark can't be negative.",
};

/** Valid values for the other two fields, so each field's own outcome is visible. */
const BASE: Record<Field, string> = { earned: '17.5', total: '23', pass: '70' };

/** Words that must never reach the screen (CLAUDE.md §11). */
const FORBIDDEN = /NaN|Infinity|undefined/;

interface Card {
  inputs: Record<Field, Locator>;
  result: Locator;
  resultBody: Locator;
  score: Locator;
  verdict: Locator;
  gap: Locator;
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
    resultBody: result.locator('.result-body'),
    score: result.locator('.score'),
    verdict: result.locator('.verdict'),
    gap: result.locator('.gap'),
  };
}

async function setAll(c: Card, values: Record<Field, string>): Promise<void> {
  for (const field of FIELDS) await c.inputs[field].fill(values[field]);
}

async function errorSlot(page: Page, input: Locator): Promise<Locator> {
  const id = await input.getAttribute('aria-describedby');
  expect(id).toBeTruthy();
  return page.locator(`#${id}`);
}

/** Each field shows exactly its expected message (or none), with aria-invalid only while in error. */
async function expectFieldErrors(page: Page, c: Card, errors: Partial<Record<Field, string>>): Promise<void> {
  for (const field of FIELDS) {
    const input = c.inputs[field];
    const slot = await errorSlot(page, input);
    const text = errors[field];
    if (text === undefined) {
      await expect(slot).toHaveText('');
      await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    } else {
      await expect(slot).toHaveText(text);
      await expect(input).toHaveAttribute('aria-invalid', 'true');
    }
  }
}

/** Every state: the result area is never blank and no visible text holds NaN, Infinity or undefined. */
async function expectSane(page: Page, c: Card): Promise<void> {
  await expect(c.resultBody).not.toHaveText('');
  await expect(c.resultBody).not.toHaveText(FORBIDDEN);
  await expect(page.locator('body')).not.toHaveText(FORBIDDEN);
  for (const field of FIELDS) {
    await expect(await errorSlot(page, c.inputs[field])).not.toHaveText(FORBIDDEN);
  }
}

async function expectIdle(page: Page, c: Card): Promise<void> {
  await expect(c.resultBody).toHaveText(M1);
  await expect(c.score).toHaveCount(0);
  await expectFieldErrors(page, c, {});
  await expectSane(page, c);
}

async function expectErrorState(page: Page, c: Card, errors: Partial<Record<Field, string>>): Promise<void> {
  await expectFieldErrors(page, c, errors);
  await expect(c.resultBody).toHaveText(M3);
  await expect(c.score).toHaveCount(0);
  await expect(c.verdict).toHaveCount(0);
  await expect(c.gap).toHaveCount(0);
  await expectSane(page, c);
}

async function expectOutcome(page: Page, c: Card, score: string, verdict: string): Promise<void> {
  await expect(c.score).toHaveText(score);
  await expect(c.verdict).toHaveText(verdict);
  await expect(c.gap).toHaveCount(1);
  await expectFieldErrors(page, c, {});
  await expectSane(page, c);
}

/** The page never scrolls sideways. */
async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('E-EDGE.0 the quoted messages match the messages.ts catalogue', () => {
  expect([M1, M2, M3, PASS, FAIL]).toEqual([MESSAGES['M-1'], MESSAGES['M-2'], MESSAGES['M-3'], MESSAGES['M-4'], MESSAGES['M-5']]);
  expect(NOT_NUMBER).toEqual({ earned: MESSAGES['M-12'], total: MESSAGES['M-16'], pass: MESSAGES['M-21'] });
  expect(NEGATIVE).toEqual({ earned: MESSAGES['M-13'], total: MESSAGES['M-17'], pass: MESSAGES['M-22'] });
});

test('E-EDGE.1 whitespace-only or a lone "." in any field is empty: M-1 (earned/total) or "76.0%" + M-2 (pass), never an error (A-12, A-18)', async ({ page }) => {
  const c = card(page);
  for (const blank of ['   ', '\t', '.', ' . ']) {
    for (const field of ['earned', 'total'] as const) {
      await setAll(c, { ...BASE, [field]: blank });
      await expectIdle(page, c);
    }
    await setAll(c, { ...BASE, pass: blank });
    await expect(c.score).toHaveText('76.0%');
    await expect(c.result).toContainText(M2);
    await expect(c.verdict).toHaveCount(0);
    await expect(c.gap).toHaveCount(0);
    await expectFieldErrors(page, c, {});
    await expectSane(page, c);
  }
});

test('E-EDGE.2 a lone "-" or "-." in any field shows that field\'s can\'t-be-negative message and M-3 (A-14, A-18)', async ({ page }) => {
  const c = card(page);
  for (const raw of ['-', '-.', ' - ']) {
    for (const field of FIELDS) {
      await setAll(c, { ...BASE, [field]: raw });
      await expectErrorState(page, c, { [field]: NEGATIVE[field] });
    }
  }
  // Recovery: the error clears as soon as the field is valid again.
  await setAll(c, BASE);
  await expectOutcome(page, c, '76.0%', PASS);
});

test('E-EDGE.3 a 400-digit number in each field gives that field\'s range message, no NaN/Infinity, no sideways scroll', async ({ page }) => {
  const c = card(page);
  const long = '9'.repeat(400);
  const cases: Array<[Field, Partial<Record<Field, string>>]> = [
    ['earned', { earned: "Marks earned can't be more than the total marks possible." }],
    ['total', { total: "Total marks possible can't be more than 1,000,000." }],
    ['pass', { pass: "Pass mark can't be more than 100." }],
  ];
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const [field, errors] of cases) {
      await setAll(c, { ...BASE, [field]: long });
      await expect(c.inputs[field]).toHaveValue(long);
      await expectErrorState(page, c, errors);
      await expectNoHorizontalScroll(page);
    }
    // 400 digits with a decimal tail: too many decimal places is checked before range (A-15).
    await setAll(c, { ...BASE, earned: `${long}.123` });
    await expectErrorState(page, c, { earned: 'Marks earned can have at most 2 decimal places.' });
    await expectNoHorizontalScroll(page);
    // A long non-number: not-a-number message, the error text wraps inside the card.
    await setAll(c, { ...BASE, total: `${long}x` });
    await expectErrorState(page, c, { total: NOT_NUMBER.total });
    await expectNoHorizontalScroll(page);
  }
});

/** Pasted values: rejected ones get that field's not-a-number message; " 17.5 " and "007" are accepted (A-13). */
const REJECTED = ['$17', '17,5', '1e400', '+5'];

async function pasteCases(page: Page, c: Card, put: (field: Field, raw: string) => Promise<void>): Promise<void> {
  for (const field of FIELDS) {
    for (const raw of REJECTED) {
      await setAll(c, BASE);
      await put(field, raw);
      await expect(c.inputs[field]).toHaveValue(raw);
      await expectErrorState(page, c, { [field]: NOT_NUMBER[field] });
    }
  }

  // " 17.5 " is 17.5 in every field (spaces ignored).
  await setAll(c, BASE);
  await put('earned', ' 17.5 ');
  await expectOutcome(page, c, '76.0%', PASS);
  await setAll(c, BASE);
  await put('total', ' 17.5 ');
  await expectOutcome(page, c, '100.0%', PASS);
  await setAll(c, BASE);
  await put('pass', ' 17.5 ');
  await expectOutcome(page, c, '76.0%', PASS);

  // "007" is 7.
  await setAll(c, BASE);
  await put('earned', '007');
  await expectOutcome(page, c, '30.4%', FAIL);
  await setAll(c, { ...BASE, earned: '7' });
  await put('total', '007');
  await expectOutcome(page, c, '100.0%', PASS);
  await setAll(c, BASE);
  await put('pass', '007');
  await expectOutcome(page, c, '76.0%', PASS);
}

test('E-EDGE.4 pasted values via fill: "$17", "17,5", "1e400", "+5" → not-a-number per field; " 17.5 " and "007" (= 7) accepted', async ({ page }) => {
  const c = card(page);
  await pasteCases(page, c, (field, raw) => c.inputs[field].fill(raw));
});

test('E-EDGE.5 pasted values via keyboard.insertText behave exactly like fill', async ({ page }) => {
  const c = card(page);
  await pasteCases(page, c, async (field, raw) => {
    await c.inputs[field].fill('');
    await c.inputs[field].focus();
    await page.keyboard.insertText(raw);
  });
});

test('E-EDGE.6 pressing Enter 5 times in each field changes nothing (result, error and idle states)', async ({ page }) => {
  const c = card(page);
  const url = page.url();

  async function pressEnterEverywhere(): Promise<void> {
    for (const field of FIELDS) {
      await c.inputs[field].focus();
      for (let i = 0; i < 5; i += 1) await page.keyboard.press('Enter');
    }
  }

  // Result state.
  await setAll(c, BASE);
  await expectOutcome(page, c, '76.0%', PASS);
  const resultText = (await c.resultBody.textContent()) ?? '';
  await pressEnterEverywhere();
  await expect(c.resultBody).toHaveText(resultText);
  await expectOutcome(page, c, '76.0%', PASS);
  for (const field of FIELDS) await expect(c.inputs[field]).toHaveValue(BASE[field]);
  expect(page.url()).toBe(url);

  // Error state.
  await setAll(c, { ...BASE, earned: 'abc' });
  await pressEnterEverywhere();
  await expectErrorState(page, c, { earned: NOT_NUMBER.earned });
  await expect(c.inputs.earned).toHaveValue('abc');

  // Idle state.
  await setAll(c, { earned: '', total: '', pass: '70' });
  await pressEnterEverywhere();
  await expectIdle(page, c);
  expect(page.url()).toBe(url);
});

test('E-EDGE.7 reload after a result or an error returns to idle: empty fields, pass mark "70", M-1', async ({ page }) => {
  const c = card(page);
  for (const values of [BASE, { ...BASE, total: '0' }, { ...BASE, earned: '-' }]) {
    await setAll(c, values);
    await page.reload();
    await expect(c.inputs.earned).toHaveValue('');
    await expect(c.inputs.total).toHaveValue('');
    await expect(c.inputs.pass).toHaveValue('70');
    await expectIdle(page, c);
  }
});

/** Reads every error slot and the result body right after a key, before any later render could hide a flash. */
async function snapshot(page: Page): Promise<{ errors: string[]; result: string; invalid: number }> {
  return page.evaluate(() => ({
    errors: Array.from(document.querySelectorAll('.field-error'), (n) => n.textContent ?? ''),
    result: document.querySelector('.result-body')?.textContent ?? '',
    invalid: document.querySelectorAll('[aria-invalid="true"]').length,
  }));
}

test('E-EDGE.8 typing "17.5" and ".5" key by key in each field never flashes an error mid-number', async ({ page }) => {
  const c = card(page);
  // While total is typed, marks earned is "0.5" so the partial total "1" is not a genuine "more than the total" error.
  const others: Record<Field, string> = { ...BASE, earned: '0.5' };
  for (const field of FIELDS) {
    for (const value of ['17.5', '.5']) {
      await setAll(c, { ...(field === 'total' ? others : BASE), [field]: '' });
      await c.inputs[field].focus();
      for (const key of value) {
        await page.keyboard.type(key);
        const s = await snapshot(page);
        expect(s.errors, `after "${key}" in ${field}`).toEqual(['', '', '']);
        expect(s.invalid).toBe(0);
        expect(s.result).not.toContain(M3);
        expect(s.result).not.toBe('');
        expect(s.result).not.toMatch(FORBIDDEN);
      }
      await expect(c.inputs[field]).toHaveValue(value);
      await expectFieldErrors(page, c, {});
      await expectSane(page, c);
    }
  }
});

test('E-EDGE.9 states never show NaN, Infinity or undefined and the result area is never blank', async ({ page }) => {
  const c = card(page);
  const sweep: Array<Record<Field, string>> = [
    { earned: '', total: '', pass: '' },
    { earned: '0', total: '0', pass: '0' },
    { earned: '0', total: '0.01', pass: '0' },
    { earned: '0.01', total: '1000000', pass: '100' },
    { earned: '1000000', total: '1000000', pass: '100' },
    { earned: '-0', total: '-0', pass: '-0' },
    { earned: '1e400', total: 'Infinity', pass: 'NaN' },
    { earned: '1.2.3', total: '..', pass: '--5' },
    { earned: '0.', total: '5.', pass: '.0' },
    { earned: '17.5', total: '', pass: '' },
  ];
  for (const values of sweep) {
    await setAll(c, values);
    // Inputs may echo what was typed; the rendered output must not.
    await expect(c.resultBody).not.toHaveText('');
    await expect(c.resultBody).not.toHaveText(FORBIDDEN);
    for (const field of FIELDS) await expect(await errorSlot(page, c.inputs[field])).not.toHaveText(FORBIDDEN);
    await expect(page.getByRole('status')).not.toHaveText(FORBIDDEN);
  }
});
