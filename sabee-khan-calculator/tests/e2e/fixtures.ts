import { test as base, expect } from '@playwright/test';

// DoD: any console error, console warning or uncaught page error fails the test.
export const test = base.extend<{ consoleGuard: void }>({
  consoleGuard: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          problems.push(`console.${msg.type()}: ${msg.text()}`);
        }
      });
      page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
      await use();
      expect(problems, 'console errors, warnings or page errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
