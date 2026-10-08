import { test, expect } from './fixtures';
import { MESSAGES } from '../../src/messages';

// Sprint 0 smoke tests (test-plan.md E-0.1..E-0.4). Expected text comes from messages.ts.

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('E-0.1 page loads with the title M-30 and one h1 (M-32)', async ({ page }) => {
  await expect(page).toHaveTitle(MESSAGES['M-30']);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(MESSAGES['M-32']);
  await expect(page.getByRole('heading')).toHaveCount(1);
});

test('E-0.2 three labelled inputs (M-34..M-36), empty earned and total, pass mark "70"', async ({ page }) => {
  const earned = page.getByLabel(MESSAGES['M-34'], { exact: true });
  const total = page.getByLabel(MESSAGES['M-35'], { exact: true });
  const pass = page.getByLabel(MESSAGES['M-36'] + MESSAGES['M-37'], { exact: true });

  for (const input of [earned, total, pass]) {
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('type', 'text');
    await expect(input).toHaveAttribute('inputmode', 'decimal');
    await expect(input).toHaveAttribute('autocomplete', 'off');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toBeAttached();
    await expect(page.locator(`#${describedBy}`)).toHaveText('');
  }
  await expect(earned).toHaveValue('');
  await expect(total).toHaveValue('');
  await expect(pass).toHaveValue('70');

  // Tab order follows the DOM: earned → total → pass mark, which is the last focusable control in the card.
  await earned.focus();
  await page.keyboard.press('Tab');
  await expect(total).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(pass).toBeFocused();
  const focusables = page.locator('.card').locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  await expect(focusables).toHaveCount(3);
  await expect(focusables.last()).toHaveAttribute('id', 'pass-mark');
});

test('E-0.3 idle state: M-1 in the result area; no "Next learner" button or Esc hint (S-4 not implemented, DEC-17)', async ({ page }) => {
  const result = page.getByRole('region', { name: MESSAGES['M-39'] });
  await expect(result).toBeVisible();
  await expect(result).toContainText(MESSAGES['M-1']);
  await expect(page.getByRole('status')).toBeAttached();

  await expect(page.getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('button', { name: MESSAGES['M-25'] })).toHaveCount(0);
  await expect(page.getByText(MESSAGES['M-40'])).toHaveCount(0);
  await expect(page.locator('kbd')).toHaveCount(0);

  const body = (await page.locator('body').innerText()).toLowerCase();
  for (const bad of ['nan', 'undefined', 'infinity', 'null']) {
    expect(body).not.toContain(bad);
  }

  for (const target of [
    page.getByLabel(MESSAGES['M-34'], { exact: true }),
    page.getByLabel(MESSAGES['M-35'], { exact: true }),
    page.getByLabel(MESSAGES['M-36'] + MESSAGES['M-37'], { exact: true }),
  ]) {
    const box = await target.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test('E-0.4 no horizontal scroll at 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await expect(page.getByText(MESSAGES['M-1'])).toBeVisible();
  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
});
