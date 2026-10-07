import { describe, expect, it } from 'vitest';
import { calculateSplit, calculateTip, splitEvenly } from '../../src/logic/split';

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0);

describe('calculateTip', () => {
  it('T-S1.1 a tip of 0 basis points adds nothing', () => {
    expect(calculateTip(10000, 0)).toBe(0);
  });

  it('T-S2.2 rounds half-up to the cent: 15% of 0.30 is 0.045 → 5 cents', () => {
    expect(calculateTip(30, 1500)).toBe(5);
  });

  it('T-G4 the largest tip on the largest bill is an exact integer', () => {
    expect(calculateTip(100_000_000, 10_000)).toBe(100_000_000);
  });
});

describe('splitEvenly', () => {
  it('T-S1.1 gives the leftover cent to the first share and sums to the total', () => {
    const { shares, leftover } = splitEvenly(10000, 3);
    expect(shares).toEqual([
      { cents: 3334, extraCent: true },
      { cents: 3333, extraCent: false },
      { cents: 3333, extraCent: false },
    ]);
    expect(leftover).toBe(1);
    expect(sum(shares.map((share) => share.cents))).toBe(10000);
  });

  it('T-S1.5 one person gets the whole maximum bill', () => {
    const { shares, leftover } = splitEvenly(100_000_000, 1);
    expect(shares).toEqual([{ cents: 100_000_000, extraCent: false }]);
    expect(leftover).toBe(0);
  });

  it('T-S1.6 the smallest bill gives 1 / 0 / 0 cents', () => {
    const { shares, leftover } = splitEvenly(1, 3);
    expect(shares.map((share) => share.cents)).toEqual([1, 0, 0]);
    expect(leftover).toBe(1);
  });

  it('T-S1.7 an even split has no leftover and no extra cent', () => {
    const { shares, leftover } = splitEvenly(10000, 4);
    expect(shares).toEqual(Array.from({ length: 4 }, () => ({ cents: 2500, extraCent: false })));
    expect(leftover).toBe(0);
  });

  it('T-S1.8 12.50 between 2 people is 6.25 each', () => {
    expect(splitEvenly(1250, 2).shares.map((share) => share.cents)).toEqual([625, 625]);
  });
});

describe('calculateSplit', () => {
  it('T-S1.1 bill 100.00, tip 0, 3 people → total 10000, shares 3334/3333/3333', () => {
    const result = calculateSplit({ billCents: 10000, tipBasisPoints: 0, people: 3 });
    expect(result.tipCents).toBe(0);
    expect(result.totalCents).toBe(10000);
    expect(result.shares.map((share) => share.cents)).toEqual([3334, 3333, 3333]);
    expect(result.leftover).toBe(1);
  });

  it('T-S1.5 bill 1000000.00, tip 0, 1 person → one share of the whole total', () => {
    const result = calculateSplit({ billCents: 100_000_000, tipBasisPoints: 0, people: 1 });
    expect(result.totalCents).toBe(100_000_000);
    expect(result.shares.map((share) => share.cents)).toEqual([100_000_000]);
  });

  it('T-S1.6 bill 0.01, tip 0, 3 people → total 1, shares 1/0/0', () => {
    const result = calculateSplit({ billCents: 1, tipBasisPoints: 0, people: 3 });
    expect(result.totalCents).toBe(1);
    expect(result.shares.map((share) => share.cents)).toEqual([1, 0, 0]);
  });

  it('T-S2.1 bill 100.00, tip 15%, 3 people → tip 1500, total 11500, shares 3834/3833/3833', () => {
    const result = calculateSplit({ billCents: 10000, tipBasisPoints: 1500, people: 3 });
    expect(result.tipCents).toBe(1500);
    expect(result.totalCents).toBe(11500);
    expect(result.shares.map((share) => share.cents)).toEqual([3834, 3833, 3833]);
  });

  it('T-S2.2 bill 0.30, tip 15%, 1 person → tip 5, total 35, one share of 35', () => {
    const result = calculateSplit({ billCents: 30, tipBasisPoints: 1500, people: 1 });
    expect(result.tipCents).toBe(5);
    expect(result.totalCents).toBe(35);
    expect(result.shares.map((share) => share.cents)).toEqual([35]);
  });

  it('T-S2.5 bill 1000000.00, tip 100%, 3 people → tip 100000000, total 200000000, shares 66666667/66666667/66666666', () => {
    const result = calculateSplit({ billCents: 100_000_000, tipBasisPoints: 10_000, people: 3 });
    expect(result.tipCents).toBe(100_000_000);
    expect(result.totalCents).toBe(200_000_000);
    expect(result.shares.map((share) => share.cents)).toEqual([66_666_667, 66_666_667, 66_666_666]);
  });

  it('T-S2.7 bill 100.00, tip 12.5%, 3 people → tip 1250, total 11250, three shares of 3750', () => {
    const result = calculateSplit({ billCents: 10000, tipBasisPoints: 1250, people: 3 });
    expect(result.tipCents).toBe(1250);
    expect(result.totalCents).toBe(11250);
    expect(result.shares.map((share) => share.cents)).toEqual([3750, 3750, 3750]);
  });

  it('T-S2.8 bill 100.00, tip 12.55%, 3 people → tip 1255, total 11255, shares 3752/3752/3751', () => {
    const result = calculateSplit({ billCents: 10000, tipBasisPoints: 1255, people: 3 });
    expect(result.tipCents).toBe(1255);
    expect(result.totalCents).toBe(11255);
    expect(result.shares.map((share) => share.cents)).toEqual([3752, 3752, 3751]);
  });

  it('T-G4 every split over the bounds is made of safe integers that sum to the total', () => {
    const bills = [1, 2, 99, 10000, 99_999_999, 100_000_000];
    const tips = [0, 1, 1255, 10_000];
    const peopleCounts = [1, 2, 3, 7, 99, 100];
    for (const billCents of bills) {
      for (const tipBasisPoints of tips) {
        for (const people of peopleCounts) {
          const result = calculateSplit({ billCents, tipBasisPoints, people });
          const amounts = [result.tipCents, result.totalCents, ...result.shares.map((share) => share.cents)];
          expect(amounts.every((amount) => Number.isSafeInteger(amount) && amount >= 0)).toBe(true);
          expect(result.shares).toHaveLength(people);
          expect(sum(result.shares.map((share) => share.cents))).toBe(result.totalCents);
        }
      }
    }
  });

  it('T-G5 the same inputs always give the same split', () => {
    const input = { billCents: 8450, tipBasisPoints: 1000, people: 4 };
    const first = calculateSplit(input);
    for (let run = 0; run < 5; run += 1) {
      expect(calculateSplit({ ...input })).toEqual(first);
    }
  });
});

const flags = (people: number, marked: number): boolean[] =>
  Array.from({ length: people }, (_, index) => index < marked);

describe('extraCent flags for the leftover-cent marker (S-3)', () => {
  it('T-S3.1 bill 100.00, tip 15%, 3 people → only the first share carries the extra cent', () => {
    const result = calculateSplit({ billCents: 10000, tipBasisPoints: 1500, people: 3 });
    expect(result.shares.map((share) => share.extraCent)).toEqual([true, false, false]);
    expect(sum(result.shares.map((share) => share.cents))).toBe(11500);
  });

  it('T-S3.2 bill 120.00, tip 0, 4 people → leftover 0 and no extra cent', () => {
    const result = calculateSplit({ billCents: 12000, tipBasisPoints: 0, people: 4 });
    expect(result.leftover).toBe(0);
    expect(result.shares).toEqual(Array.from({ length: 4 }, () => ({ cents: 3000, extraCent: false })));
  });

  it('T-S3.3 bill 999999.99, tip 0, 100 people → 99 extra cents, shares sum to 99999999', () => {
    const result = calculateSplit({ billCents: 99_999_999, tipBasisPoints: 0, people: 100 });
    expect(result.leftover).toBe(99);
    expect(result.shares.map((share) => share.extraCent)).toEqual(flags(100, 99));
    expect(result.shares.slice(0, 99).every((share) => share.cents === 1_000_000)).toBe(true);
    expect(result.shares[99]).toEqual({ cents: 999_999, extraCent: false });
    expect(sum(result.shares.map((share) => share.cents))).toBe(99_999_999);
  });

  it('T-S3.4 bill 0.01, tip 0, 3 people → only the first share carries the extra cent', () => {
    const result = calculateSplit({ billCents: 1, tipBasisPoints: 0, people: 3 });
    expect(result.shares.map((share) => share.extraCent)).toEqual([true, false, false]);
  });

  it('T-S3.5 bill 33.33, tip 0, 1 person → leftover 0 and no extra cent', () => {
    const result = calculateSplit({ billCents: 3333, tipBasisPoints: 0, people: 1 });
    expect(result.leftover).toBe(0);
    expect(result.shares).toEqual([{ cents: 3333, extraCent: false }]);
  });
});
