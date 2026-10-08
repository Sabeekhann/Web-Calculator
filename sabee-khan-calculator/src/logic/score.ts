import { floorDiv } from './arith';

// Inputs are scaled integers (technical-design.md §Decimal strategy):
// E = marks earned × 100, T = total marks possible × 100 (T > 0), P = pass mark × 10.

/** Score in tenths of a percent, rounded down (A-3): ⌊E × 1000 / T⌋. 17.5 of 23 → 760. */
export function scoreTenths(earned: number, total: number): number {
  return floorDiv(earned * 1000, total);
}

/** Pass ⇔ exact score ≥ pass mark (A-1, A-2), i.e. E × 1000 ≥ P × T, never the shown score. */
export function isPass(earned: number, total: number, passMark: number): boolean {
  return earned * 1000 >= passMark * total;
}
