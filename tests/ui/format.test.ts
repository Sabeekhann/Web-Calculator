import { describe, expect, it } from 'vitest';
import { formatAmount, formatShareLine } from '../../src/ui/format';

const AMOUNT_PATTERN = /^\d{1,3}(,\d{3})*\.\d{2}$/;

describe('formatAmount', () => {
  it('T-S1.1 formats 10000 and 3334 cents', () => {
    expect(formatAmount(10000)).toBe('100.00');
    expect(formatAmount(3334)).toBe('33.34');
  });

  it('T-S1.5 formats 100000000 cents as 1,000,000.00', () => {
    expect(formatAmount(100_000_000)).toBe('1,000,000.00');
  });

  it('T-S1.6 formats 1 and 0 cents as 0.01 and 0.00', () => {
    expect(formatAmount(1)).toBe('0.01');
    expect(formatAmount(0)).toBe('0.00');
  });

  it('T-G4 always has 2 decimals and comma thousands over the range', () => {
    const cases: Array<[number, string]> = [
      [5, '0.05'],
      [99, '0.99'],
      [100, '1.00'],
      [99_999, '999.99'],
      [100_000, '1,000.00'],
      [99_999_999, '999,999.99'],
      [200_000_000, '2,000,000.00'],
    ];
    for (const [cents, text] of cases) {
      expect(formatAmount(cents)).toBe(text);
      expect(text).toMatch(AMOUNT_PATTERN);
    }
  });
});

describe('formatShareLine', () => {
  it('T-S1.1 labels the share with its 1-based person number', () => {
    expect(formatShareLine(0, { cents: 3334, extraCent: true }).startsWith('Person 1: 33.34')).toBe(true);
    expect(formatShareLine(2, { cents: 3333, extraCent: false })).toBe('Person 3: 33.33');
  });
});
