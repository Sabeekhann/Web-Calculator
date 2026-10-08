import { ceilDiv, floorDiv } from './arith';

// Inputs are scaled integers (technical-design.md §Decimal strategy):
// E = marks earned × 100, T = total marks possible × 100, P = pass mark × 10.

/** The gap between marks earned and marks needed (P/100 × T); `h` is in hundredths of a mark. */
export type Gap =
  | { readonly kind: 'exact' }
  | { readonly kind: 'short'; readonly h: number }
  | { readonly kind: 'above'; readonly h: number }
  | { readonly kind: 'aboveTiny' };

/** D = E × 1000 − P × T is the exact gap in marks × 10⁵ (A-10, A-9). */
const MARKS_E5_PER_HUNDREDTH = 1000;

/**
 * Exact gap to the pass mark (A-10): a shortfall rounds UP to 2 dp (so it is never 0),
 * a surplus rounds DOWN to 2 dp, and a surplus under 0.01 is `aboveTiny`.
 */
export function gap(earned: number, total: number, passMark: number): Gap {
  const diff = earned * 1000 - passMark * total;
  if (diff === 0) return { kind: 'exact' };
  if (diff < 0) return { kind: 'short', h: ceilDiv(-diff, MARKS_E5_PER_HUNDREDTH) };
  const h = floorDiv(diff, MARKS_E5_PER_HUNDREDTH);
  return h === 0 ? { kind: 'aboveTiny' } : { kind: 'above', h };
}
