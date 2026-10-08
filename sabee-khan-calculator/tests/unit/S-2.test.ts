import { describe, expect, it } from 'vitest';
import { ceilDiv } from '../../src/logic/arith';
import { formatMarks } from '../../src/logic/format';
import { gap, type Gap } from '../../src/logic/gap';
import { gapText, MESSAGES } from '../../src/messages';
import { toViewModel, type ViewModel } from '../../src/ui/view-model';

// S-2 Marks short of or above the pass mark (test-plan.md T-S2.1..T-S2.8).
// Integers only: E = earned × 100, T = total × 100, P = pass × 10; D = E × 1000 − P × T (marks × 10⁵).
// Shortfall h = ceilDiv(−D, 1000), surplus h = floorDiv(D, 1000), in hundredths of a mark (A-10).
// Gap strings are the exact AC values; verdict words and M-10/M-11 come from messages.ts.

const PASS = MESSAGES['M-4'];
const FAIL = MESSAGES['M-5'];
const EXACT = MESSAGES['M-10'];
const TINY = MESSAGES['M-11'];

function vm(earned: string, total: string, pass: string): ViewModel {
  return toViewModel({ earned, total, pass });
}

/** What the result area shows: "<score>%", the verdict word and the gap line, or null when there is no result. */
function shown(model: ViewModel): { score: string; verdict: string; gap: string } | null {
  if (model.state !== 'result') return null;
  return { score: `${model.score}%`, verdict: model.verdictText, gap: model.gapText };
}

describe('T-S2.1 15.5 of 23 at 70 (16.1 needed) → Fail, "0.6 marks short of the pass mark"', () => {
  it('D = 1,550,000 − 1,610,000 = −60,000 → 60 hundredths short', () => {
    expect(gap(1550, 2300, 700)).toEqual({ kind: 'short', h: 60 });
    expect(formatMarks(60)).toBe('0.6');
    const model = vm('15.5', '23', '70');
    expect(shown(model)).toEqual({ score: '67.3%', verdict: FAIL, gap: '0.6 marks short of the pass mark' });
    expect(model.state === 'result' && model.gapKind).toBe('short');
  });
});

describe('T-S2.2 17.5 of 23 at 70 → Pass, "1.4 marks above the pass mark"', () => {
  it('D = 1,750,000 − 1,610,000 = 140,000 → 140 hundredths above', () => {
    expect(gap(1750, 2300, 700)).toEqual({ kind: 'above', h: 140 });
    const model = vm('17.5', '23', '70');
    expect(shown(model)).toEqual({ score: '76.0%', verdict: PASS, gap: '1.4 marks above the pass mark' });
    expect(model.state === 'result' && model.gapKind).toBe('above');
  });

  it('the screen-reader announcement carries the gap line after score and verdict', () => {
    expect(vm('17.5', '23', '70').announcement).toBe(`76.0%, ${PASS}, 1.4 marks above the pass mark`);
  });
});

describe('T-S2.3 17.5 of 25 at 70 (17.5 needed) → Pass, "Exactly on the pass mark"', () => {
  it('D = 0 → exact (M-10)', () => {
    expect(gap(1750, 2500, 700)).toEqual({ kind: 'exact' });
    expect(gapText({ kind: 'exact' })).toBe('Exactly on the pass mark');
    const model = vm('17.5', '25', '70');
    expect(shown(model)).toEqual({ score: '70.0%', verdict: PASS, gap: EXACT });
    expect(model.state === 'result' && model.gapKind).toBe('exact');
  });
});

describe('T-S2.4 total 20 at 70 (14 needed): 13 → "1 mark short", 15 → "1 mark above" (singular)', () => {
  it('h = 100 uses M-7 and M-9', () => {
    expect(gap(1300, 2000, 700)).toEqual({ kind: 'short', h: 100 });
    expect(gap(1500, 2000, 700)).toEqual({ kind: 'above', h: 100 });
    expect(shown(vm('13', '20', '70'))?.gap).toBe('1 mark short of the pass mark');
    expect(shown(vm('15', '20', '70'))?.gap).toBe('1 mark above the pass mark');
  });

  it('values other than exactly 1 stay plural', () => {
    expect(gapText({ kind: 'short', h: 200 })).toBe('2 marks short of the pass mark');
    expect(gapText({ kind: 'above', h: 101 })).toBe('1.01 marks above the pass mark');
    expect(gapText({ kind: 'short', h: 99 })).toBe('0.99 marks short of the pass mark');
  });
});

describe('T-S2.5 total 23.33 at 70 (16.331 needed): shortfall rounds UP, surplus rounds DOWN', () => {
  it('16 → D = −33,100 → ceil(33.1) = 34 → "0.34 marks short of the pass mark"', () => {
    expect(1600 * 1000 - 700 * 2333).toBe(-33_100);
    expect(ceilDiv(33_100, 1000)).toBe(34);
    expect(gap(1600, 2333, 700)).toEqual({ kind: 'short', h: 34 });
    expect(shown(vm('16', '23.33', '70'))?.gap).toBe('0.34 marks short of the pass mark');
  });

  it('17 → D = +66,900 → floor(66.9) = 66 → "0.66 marks above the pass mark"', () => {
    expect(1700 * 1000 - 700 * 2333).toBe(66_900);
    expect(gap(1700, 2333, 700)).toEqual({ kind: 'above', h: 66 });
    expect(shown(vm('17', '23.33', '70'))?.gap).toBe('0.66 marks above the pass mark');
  });
});

describe('T-S2.6 pass mark 69.9, total 23 (16.077 needed): sub-hundredth gaps', () => {
  it('16.07 → "69.8%", Fail, D = −700 → "0.01 marks short of the pass mark" (never 0)', () => {
    expect(gap(1607, 2300, 699)).toEqual({ kind: 'short', h: 1 });
    expect(shown(vm('16.07', '23', '69.9'))).toEqual({
      score: '69.8%',
      verdict: FAIL,
      gap: '0.01 marks short of the pass mark',
    });
  });

  it('16.08 → "69.9%", Pass, D = +300 → "Less than 0.01 marks above the pass mark" (M-11)', () => {
    expect(gap(1608, 2300, 699)).toEqual({ kind: 'aboveTiny' });
    expect(gapText({ kind: 'aboveTiny' })).toBe(TINY);
    const model = vm('16.08', '23', '69.9');
    expect(shown(model)).toEqual({ score: '69.9%', verdict: PASS, gap: 'Less than 0.01 marks above the pass mark' });
    expect(model.state === 'result' && model.gapKind).toBe('aboveTiny');
  });
});

describe('T-S2.7 total 1000000: large gaps with comma thousands separators', () => {
  it('pass 70, earned 0.01 → D = −69,999,999,000 → "699,999.99 marks short of the pass mark"', () => {
    expect(gap(1, 100_000_000, 700)).toEqual({ kind: 'short', h: 69_999_999 });
    expect(shown(vm('0.01', '1000000', '70'))?.gap).toBe('699,999.99 marks short of the pass mark');
  });

  it('pass 100, earned 999999.99 → "0.01 marks short of the pass mark"', () => {
    expect(gap(99_999_999, 100_000_000, 1000)).toEqual({ kind: 'short', h: 1 });
    expect(shown(vm('999999.99', '1000000', '100'))?.gap).toBe('0.01 marks short of the pass mark');
  });

  it('pass 0, earned 1000000 → "1,000,000 marks above the pass mark"', () => {
    expect(gap(100_000_000, 100_000_000, 0)).toEqual({ kind: 'above', h: 100_000_000 });
    expect(shown(vm('1000000', '1000000', '0'))?.gap).toBe('1,000,000 marks above the pass mark');
  });
});

describe('T-S2.8 carrying on after a result recalculates the gap', () => {
  it('15.5 → 16.1 of 23 at 70 gives "70.0%" Pass M-10; then pass 65 gives "1.15 marks above the pass mark"', () => {
    expect(shown(vm('15.5', '23', '70'))?.gap).toBe('0.6 marks short of the pass mark');
    expect(shown(vm('16.1', '23', '70'))).toEqual({ score: '70.0%', verdict: PASS, gap: EXACT });
    expect(gap(1610, 2300, 650)).toEqual({ kind: 'above', h: 115 });
    expect(shown(vm('16.1', '23', '65'))?.gap).toBe('1.15 marks above the pass mark');
  });
});

// Supporting tests for S-2 (not tied to one AC).

describe('S-2 supporting: formatMarks (ADR-007, A-11)', () => {
  it.each([
    [60, '0.6'],
    [600, '6'],
    [1, '0.01'],
    [10, '0.1'],
    [0, '0'],
    [115, '1.15'],
    [100_000, '1,000'],
    [99_999, '999.99'],
    [100_000_000, '1,000,000'],
    [69_999_999, '699,999.99'],
    [12_345_678_900, '123,456,789'],
  ])('formatMarks(%i) = "%s"', (h, text) => {
    expect(formatMarks(h)).toBe(text);
  });
});

describe('S-2 supporting: ceilDiv and exactness', () => {
  it('ceilDiv rounds up only when there is a remainder', () => {
    expect(ceilDiv(700, 1000)).toBe(1);
    expect(ceilDiv(1000, 1000)).toBe(1);
    expect(ceilDiv(1001, 1000)).toBe(2);
    expect(ceilDiv(0, 1000)).toBe(0);
    expect(ceilDiv(100_000_000_000, 1000)).toBe(100_000_000);
  });

  it('the widest gaps stay exact safe integers', () => {
    expect(gap(0, 100_000_000, 1000)).toEqual({ kind: 'short', h: 100_000_000 });
    expect(gapText(gap(0, 100_000_000, 1000))).toBe('1,000,000 marks short of the pass mark');
  });
});

describe('S-2 supporting: no gap line outside the result state', () => {
  it.each<[string, string, string]>([
    ['', '', '70'],
    ['17.5', '', '70'],
    ['17.5', '23', ''],
    ['abc', '23', '70'],
    ['23.5', '23', '70'],
  ])('%j of %j at %j has no gap text', (earned, total, pass) => {
    const model = vm(earned, total, pass);
    expect(model.state).not.toBe('result');
    expect(model).not.toHaveProperty('gapText');
    expect(JSON.stringify(model)).not.toMatch(/(short of|above|on) the pass mark/);
  });

  it('every gap kind gives non-blank text without NaN, Infinity or undefined', () => {
    const gaps: Gap[] = [{ kind: 'exact' }, { kind: 'aboveTiny' }, { kind: 'short', h: 1 }, { kind: 'above', h: 100_000_000 }];
    for (const g of gaps) {
      const text = gapText(g);
      expect(text.trim().length).toBeGreaterThan(0);
      for (const bad of ['NaN', 'Infinity', 'undefined', '{n}']) expect(text).not.toContain(bad);
    }
  });
});
