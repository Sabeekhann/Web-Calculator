/**
 * Exact integer division for non-negative safe integers (ADR-002).
 * `a - a % b` is an exact multiple of `b`, so the division has no fractional part to round.
 */
export function floorDiv(a: number, b: number): number {
  return (a - (a % b)) / b;
}
