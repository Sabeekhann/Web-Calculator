import { floorDiv } from './arith';

/** Formats a score in tenths of a percent with exactly 1 decimal place: 760 → "76.0", 0 → "0.0" (ADR-007). */
export function formatScore(tenths: number): string {
  return `${floorDiv(tenths, 10)}.${tenths % 10}`;
}

/** Inserts a comma every 3 digits into a string of digits: "1000000" → "1,000,000" (ADR-007, no Intl). */
function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+$)/g, ',');
}

/**
 * Formats marks given in hundredths with at most 2 decimal places, trailing zeros trimmed and
 * comma thousands separators (A-11, ADR-007): 60 → "0.6", 600 → "6", 69_999_999 → "699,999.99".
 */
export function formatMarks(hundredths: number): string {
  const whole = groupThousands(String(floorDiv(hundredths, 100)));
  const fraction = String(hundredths % 100).padStart(2, '0').replace(/0+$/, '');
  return fraction === '' ? whole : `${whole}.${fraction}`;
}
