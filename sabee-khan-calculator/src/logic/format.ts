import { floorDiv } from './arith';

/** Formats a score in tenths of a percent with exactly 1 decimal place: 760 → "76.0", 0 → "0.0" (ADR-007). */
export function formatScore(tenths: number): string {
  return `${floorDiv(tenths, 10)}.${tenths % 10}`;
}
