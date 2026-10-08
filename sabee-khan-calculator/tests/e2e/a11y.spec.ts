import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { MESSAGES } from '../../src/messages';

// Sprint 2 hardening (D6, WCAG 2.2 AA): axe-core scan of every result state, in light and dark themes.
// Runs on Chromium, Firefox and WebKit like every other spec.

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * @axe-core/playwright ships its own newer playwright-core typings, so our @playwright/test Page differs from
 * its Page in type only. The runtime object is the same; cast at this one boundary instead of adding dependencies.
 */
type AxePage = ConstructorParameters<typeof AxeBuilder>[0]['page'];

interface StateCase {
  readonly name: string;
  readonly values: readonly [earned: string, total: string, pass: string] | null;
  readonly expectText: string;
}

const STATES: readonly StateCase[] = [
  { name: 'idle', values: null, expectText: MESSAGES['M-1'] },
  { name: 'Pass', values: ['17.5', '23', '70'], expectText: MESSAGES['M-4'] },
  { name: 'Fail', values: ['12', '23', '70'], expectText: MESSAGES['M-5'] },
  { name: 'error (two fields)', values: ['abc', '-5', '70'], expectText: MESSAGES['M-3'] },
  { name: 'pass mark empty', values: ['17.5', '23', ''], expectText: MESSAGES['M-2'] },
];

async function fillState(page: Page, values: StateCase['values']): Promise<void> {
  if (values === null) return;
  const [earned, total, pass] = values;
  await page.getByLabel(MESSAGES['M-34'], { exact: true }).fill(earned);
  await page.getByLabel(MESSAGES['M-35'], { exact: true }).fill(total);
  await page.getByLabel(MESSAGES['M-36'] + MESSAGES['M-37'], { exact: true }).fill(pass);
}

for (const colorScheme of ['light', 'dark'] as const) {
  for (const state of STATES) {
    test(`E-A11Y.1 axe: ${state.name} state, ${colorScheme} theme has no WCAG 2.2 AA violations`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('./');
      await fillState(page, state.values);
      const result = page.getByRole('region', { name: MESSAGES['M-39'] });
      await expect(result).toContainText(state.expectText);
      if (state.name.startsWith('error')) {
        await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(2);
      }

      const scan = await new AxeBuilder({ page: page as unknown as AxePage }).withTags(WCAG_TAGS).analyze();
      const summary = scan.violations.map((v) => `${v.id} (${v.impact ?? 'n/a'}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(scan.passes.length, 'axe ran its checks').toBeGreaterThan(0);
      expect(summary).toEqual([]);
    });
  }
}
