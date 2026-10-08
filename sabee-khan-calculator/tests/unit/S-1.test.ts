import { describe, expect, it } from 'vitest';
import { floorDiv } from '../../src/logic/arith';
import { formatScore } from '../../src/logic/format';
import { isPass, scoreTenths } from '../../src/logic/score';
import { parseDecimal } from '../../src/validation/parse';
import { toViewModel, type RawInputs, type ViewModel } from '../../src/ui/view-model';
import { MESSAGES } from '../../src/messages';

// S-1 Score and pass/fail verdict (test-plan.md T-S1.1..T-S1.8).
// Every comparison is on integers or strings: E = earned × 100, T = total × 100, P = pass × 10 (ADR-002).
// Score strings ("76.0%") are the AC values; verdict words come from messages.ts (M-4, M-5).

const PASS = MESSAGES['M-4'];
const FAIL = MESSAGES['M-5'];

function vm(earned: string, total: string, pass: string): ViewModel {
  const raw: RawInputs = { earned, total, pass };
  return toViewModel(raw);
}

/** What the result area shows: "<score>%" and the verdict word, or null when no score is shown. */
function shown(model: ViewModel): { score: string; verdict: string } | null {
  if (model.state !== 'result') return null;
  return { score: `${model.score}%`, verdict: model.verdictText };
}

describe('T-S1.1 17.5 of 23 at the pre-filled 70 → "76.0%", Pass', () => {
  it('scales to E = 1750, T = 2300, P = 700', () => {
    expect(parseDecimal('17.5', 2)).toEqual({ ok: true, value: 1750 });
    expect(parseDecimal('23', 2)).toEqual({ ok: true, value: 2300 });
    expect(parseDecimal('70', 1)).toEqual({ ok: true, value: 700 });
  });

  it('floors 1,750,000 / 2300 = 760.8… to 760 tenths and passes (1,750,000 ≥ 1,610,000)', () => {
    expect(scoreTenths(1750, 2300)).toBe(760);
    expect(formatScore(760)).toBe('76.0');
    expect(isPass(1750, 2300, 700)).toBe(true);
  });

  it('view model shows "76.0%" and "Pass" and announces both', () => {
    const model = vm('17.5', '23', '70');
    expect(shown(model)).toEqual({ score: '76.0%', verdict: PASS });
    expect(model.state === 'result' && model.verdict).toBe('pass');
    expect(model.announcement.startsWith(`76.0%, ${PASS}`)).toBe(true);
  });
});

describe('T-S1.2 17.5 of 25 (exactly 70%) → "70.0%", Pass', () => {
  it('E × 1000 equals P × T exactly (1,750,000 = 1,750,000), so it is a pass', () => {
    expect(1750 * 1000).toBe(700 * 2500);
    expect(isPass(1750, 2500, 700)).toBe(true);
    expect(scoreTenths(1750, 2500)).toBe(700);
    expect(shown(vm('17.5', '25', '70'))).toEqual({ score: '70.0%', verdict: PASS });
  });
});

describe('T-S1.3 17.49 of 25 (69.96%) → "69.9%", Fail, never "70.0%"', () => {
  it('1,749,000 < 1,750,000 is a fail, and 699.6 tenths floors to 699', () => {
    expect(isPass(1749, 2500, 700)).toBe(false);
    expect(scoreTenths(1749, 2500)).toBe(699);
    expect(shown(vm('17.49', '25', '70'))).toEqual({ score: '69.9%', verdict: FAIL });
  });

  it('no prefix typed on the way to "17.49" shows "70.0%"', () => {
    const steps = ['1', '17', '17.', '17.4', '17.49'];
    const scores = steps.map((earned) => shown(vm(earned, '25', '70'))?.score);
    expect(scores).toEqual(['4.0%', '68.0%', '68.0%', '69.6%', '69.9%']);
    expect(scores).not.toContain('70.0%');
  });
});

describe('T-S1.4 2 of 3 → "66.6%" (rounded down, not "66.7%"), Fail', () => {
  it('floorDiv(200,000, 300) = 666', () => {
    expect(floorDiv(200_000, 300)).toBe(666);
    expect(scoreTenths(200, 300)).toBe(666);
    expect(formatScore(666)).toBe('66.6');
    expect(shown(vm('2', '3', '70'))).toEqual({ score: '66.6%', verdict: FAIL });
  });
});

describe('T-S1.5 boundaries of the pass mark', () => {
  it('pass mark "0": 0 of 23 → "0.0%", Pass (0 ≥ 0)', () => {
    expect(isPass(0, 2300, 0)).toBe(true);
    expect(shown(vm('0', '23', '0'))).toEqual({ score: '0.0%', verdict: PASS });
  });

  it('pass mark "100": 23 of 23 → "100.0%", Pass (2,300,000 ≥ 2,300,000)', () => {
    expect(isPass(2300, 2300, 1000)).toBe(true);
    expect(scoreTenths(2300, 2300)).toBe(1000);
    expect(formatScore(1000)).toBe('100.0');
    expect(shown(vm('23', '23', '100'))).toEqual({ score: '100.0%', verdict: PASS });
  });
});

describe('T-S1.6 pass mark "100": 999999.99 of 1000000 → "99.9%", Fail', () => {
  it('99,999,999,000 < 100,000,000,000 and floors to 999 tenths', () => {
    expect(parseDecimal('999999.99', 2)).toEqual({ ok: true, value: 99_999_999 });
    expect(parseDecimal('1000000', 2)).toEqual({ ok: true, value: 100_000_000 });
    expect(isPass(99_999_999, 100_000_000, 1000)).toBe(false);
    expect(scoreTenths(99_999_999, 100_000_000)).toBe(999);
    expect(shown(vm('999999.99', '1000000', '100'))).toEqual({ score: '99.9%', verdict: FAIL });
  });

  it('the largest products stay exact safe integers', () => {
    expect(Number.isSafeInteger(100_000_000 * 1000)).toBe(true);
    expect(Number.isSafeInteger(1000 * 100_000_000)).toBe(true);
  });
});

describe('T-S1.7 0.01 of 1000000 at 70 → "0.0%", Fail', () => {
  it('1000 / 100,000,000 floors to 0 tenths; 1000 < 70,000,000,000', () => {
    expect(parseDecimal('0.01', 2)).toEqual({ ok: true, value: 1 });
    expect(scoreTenths(1, 100_000_000)).toBe(0);
    expect(formatScore(0)).toBe('0.0');
    expect(isPass(1, 100_000_000, 700)).toBe(false);
    expect(shown(vm('0.01', '1000000', '70'))).toEqual({ score: '0.0%', verdict: FAIL });
  });
});

describe('T-S1.8 carrying on after a result recalculates', () => {
  it('17.5 → 15.5 of 23 gives "67.3%" Fail; then pass mark 65 gives Pass with "67.3%"', () => {
    expect(shown(vm('17.5', '23', '70'))).toEqual({ score: '76.0%', verdict: PASS });
    expect(scoreTenths(1550, 2300)).toBe(673);
    expect(isPass(1550, 2300, 700)).toBe(false);
    expect(shown(vm('15.5', '23', '70'))).toEqual({ score: '67.3%', verdict: FAIL });
    expect(isPass(1550, 2300, 650)).toBe(true);
    expect(shown(vm('15.5', '23', '65'))).toEqual({ score: '67.3%', verdict: PASS });
  });
});

// Supporting tests for S-1 (not tied to one AC).

describe('S-1 supporting: score formatting (ADR-007)', () => {
  it.each([
    [760, '76.0'],
    [0, '0.0'],
    [1000, '100.0'],
    [999, '99.9'],
    [666, '66.6'],
    [5, '0.5'],
  ])('formatScore(%i) = "%s"', (tenths, text) => {
    expect(formatScore(tenths)).toBe(text);
  });

  it('floorDiv is exact at 10^11', () => {
    expect(floorDiv(100_000_000_000, 100_000_000)).toBe(1000);
    expect(floorDiv(99_999_999_999, 100_000_000)).toBe(999);
    expect(floorDiv(7, 7)).toBe(1);
    expect(floorDiv(6, 7)).toBe(0);
  });
});

describe('S-1 supporting: accepted number format (A-13, A-18)', () => {
  it.each([
    ['.5', 2, 50],
    ['5.', 2, 500],
    ['007', 2, 700],
    [' 017.5 ', 2, 1750],
    ['17.25', 2, 1725],
    ['0', 2, 0],
    ['69.9', 1, 699],
    ['100', 1, 1000],
  ])('parseDecimal(%j, %i) = %i', (raw, maxDp, value) => {
    expect(parseDecimal(raw, maxDp)).toEqual({ ok: true, value });
  });

  it.each(['', '   ', '.', ' . '])('%j is empty (value null)', (raw) => {
    expect(parseDecimal(raw, 2)).toEqual({ ok: true, value: null });
  });

  it.each(['abc', '17,5', '$17', '1.2.3', '1e400', '+5', '-1', '-', '17.555'])('%j is not accepted', (raw) => {
    expect(parseDecimal(raw, 2).ok).toBe(false);
  });
});

describe('S-1 supporting: states around the result', () => {
  it('earned or total empty → idle prompt M-1, no score', () => {
    for (const model of [vm('', '', '70'), vm('17.5', '', '70'), vm('', '23', '70'), vm('17.5', '   ', '70')]) {
      expect(model.state).toBe('idle');
      expect(model.state === 'idle' && model.message).toBe(MESSAGES['M-1']);
      expect(model.announcement).toBe('');
    }
  });

  it('pass mark empty → score still shown with M-2, no verdict', () => {
    const model = vm('17.5', '23', '');
    expect(model.state).toBe('pass-mark-empty');
    expect(model.state === 'pass-mark-empty' && model.score).toBe('76.0');
    expect(model.state === 'pass-mark-empty' && model.verdictMessage).toBe(MESSAGES['M-2']);
    expect(shown(model)).toBeNull();
  });

  // Invalid or impossible input never shows a score or verdict (S-3 covers the error state and its messages).
  it.each([
    ['abc', '23', '70'],
    ['17.5', '0', '70'],
    ['23.5', '23', '70'],
    ['10', '1000000.01', '70'],
    ['17.5', '23', '100.1'],
    ['17.5', '23', 'seventy'],
    ['1'.repeat(400), '23', '70'],
    ['17.5', '9'.repeat(400), '70'],
  ])('%j of %j at %j shows no score or verdict', (earned, total, pass) => {
    const model = vm(earned, total, pass);
    expect(shown(model)).toBeNull();
    expect(model.state).not.toBe('pass-mark-empty');
  });

  it('total "1000000" is accepted (maximum allowed)', () => {
    expect(shown(vm('10', '1000000', '70'))?.score).toBe('0.0%');
  });

  it('no view-model text is ever NaN, Infinity, undefined or blank for valid input', () => {
    const cases: Array<[string, string, string]> = [
      ['17.5', '23', '70'], ['0', '0.01', '0'], ['1000000', '1000000', '100'], ['0.01', '1000000', '0'],
    ];
    for (const [earned, total, pass] of cases) {
      const model = vm(earned, total, pass);
      const text = JSON.stringify(model);
      for (const bad of ['NaN', 'Infinity', 'undefined']) expect(text).not.toContain(bad);
      expect(shown(model)?.score.length ?? 0).toBeGreaterThan(1);
    }
  });
});
