import type { Share, SplitInput, SplitResult } from '../types';

const BASIS_POINTS_PER_WHOLE = 10_000;
const HALF_UP_OFFSET = BASIS_POINTS_PER_WHOLE / 2;

export function calculateTip(billCents: number, tipBasisPoints: number): number {
  return Math.floor((billCents * tipBasisPoints + HALF_UP_OFFSET) / BASIS_POINTS_PER_WHOLE);
}

export function splitEvenly(totalCents: number, people: number): { shares: Share[]; leftover: number } {
  const base = Math.floor(totalCents / people);
  const leftover = totalCents % people;
  const shares = Array.from({ length: people }, (_, index) => {
    const extraCent = index < leftover;
    return { cents: extraCent ? base + 1 : base, extraCent };
  });
  return { shares, leftover };
}

export function calculateSplit(input: SplitInput): SplitResult {
  const tipCents = calculateTip(input.billCents, input.tipBasisPoints);
  const totalCents = input.billCents + tipCents;
  const { shares, leftover } = splitEvenly(totalCents, input.people);
  return { tipCents, totalCents, shares, leftover };
}
