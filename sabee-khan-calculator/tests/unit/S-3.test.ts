import { describe, expect, it } from 'vitest';
import { ERROR_MESSAGE_IDS, errorText, MESSAGES } from '../../src/messages';
import { toViewModel, type ViewModel } from '../../src/ui/view-model';
import { validateInputs } from '../../src/validation/validate';

// S-3 Clear message for an invalid or impossible entry (test-plan.md T-S3.1..T-S3.8, T-M.2).
// Every message is quoted exactly as written in the ACs (docs/user-stories.md).

const M1 = 'Enter marks earned and total marks possible to see the score.';
const M2 = 'Enter a pass mark to see whether this is a pass or a fail.';
const M3 = 'The score will appear once every entry is valid.';

function vm(earned: string, total: string, pass: string): ViewModel {
  return toViewModel({ earned, total, pass });
}

type Errors = { earned: string | null; total: string | null; pass: string | null };

const NO_ERRORS: Errors = { earned: null, total: null, pass: null };

/** The error state as the user sees it: one message (or none) per field, and M-3 in the result area. */
function expectError(model: ViewModel, errors: Partial<Errors>): void {
  expect(model.state).toBe('error');
  expect(model.fieldErrors).toEqual({ ...NO_ERRORS, ...errors });
  expect(model.state === 'error' && model.message).toBe(M3);
  // No score, verdict or gap anywhere in the model.
  expect(JSON.stringify(model)).not.toMatch(/%|Pass"|Fail"|pass mark"/);
}

describe('T-S3.1 only earned, or spaces in total → M-1, no score, no field error', () => {
  it.each([
    ['17.5', '', '70'],
    ['', '   ', '70'],
    ['17.5', '   ', '70'],
    ['', '', '70'],
  ])('%j of %j at %j → idle with M-1 and no error message', (earned, total, pass) => {
    const model = vm(earned, total, pass);
    expect(model.state).toBe('idle');
    expect(model.state === 'idle' && model.message).toBe(M1);
    expect(model.fieldErrors).toEqual(NO_ERRORS);
  });

  it('a lone "." is empty, not an error (A-18)', () => {
    expect(vm('.', '23', '70').state).toBe('idle');
    expect(vm('.', '23', '70').fieldErrors).toEqual(NO_ERRORS);
    expect(vm('17.5', '23', ' . ').state).toBe('pass-mark-empty');
  });
});

describe('T-S3.2 "17.5" of "23", pass mark cleared → "76.0%" + M-2, no verdict, gap or error', () => {
  it('shows the score and M-2 only', () => {
    const model = vm('17.5', '23', '');
    expect(model.state).toBe('pass-mark-empty');
    expect(model.state === 'pass-mark-empty' && `${model.score}%`).toBe('76.0%');
    expect(model.state === 'pass-mark-empty' && model.verdictMessage).toBe(M2);
    expect(model.fieldErrors).toEqual(NO_ERRORS);
    expect(JSON.stringify(model)).not.toMatch(/"Pass"|"Fail"|pass mark"/);
  });
});

describe('T-S3.3 not a number → that field\'s message + M-3; " 017.5 " accepted', () => {
  it.each(['abc', '17,5', '$17', '1.2.3', '1e400', '+5'])('earned %j → "Marks earned must be a number, like 17.5."', (raw) => {
    expect(validateInputs({ earned: raw, total: '23', pass: '70' }).earned).toEqual({ ok: false, code: 'NOT_NUMBER' });
    expectError(vm(raw, '23', '70'), { earned: 'Marks earned must be a number, like 17.5.' });
  });

  it('total "abc" → "Total marks possible must be a number, like 23."', () => {
    expectError(vm('17.5', 'abc', '70'), { total: 'Total marks possible must be a number, like 23.' });
  });

  it('pass mark "seventy" → "Pass mark must be a number, like 70."', () => {
    expectError(vm('17.5', '23', 'seventy'), { pass: 'Pass mark must be a number, like 70.' });
  });

  it('" 017.5 " in marks earned is accepted and shows "76.0%"', () => {
    const model = vm(' 017.5 ', '23', '70');
    expect(model.state).toBe('result');
    expect(model.state === 'result' && `${model.score}%`).toBe('76.0%');
    expect(model.fieldErrors).toEqual(NO_ERRORS);
  });
});

describe('T-S3.4 a minus sign → can\'t be negative (incl. "-0"), no score', () => {
  it.each(['-1', '-0', '-', '-.', ' -5 '])('earned %j → "Marks earned can\'t be negative."', (raw) => {
    expectError(vm(raw, '23', '70'), { earned: "Marks earned can't be negative." });
  });

  it('total "-23" → "Total marks possible can\'t be negative."', () => {
    expectError(vm('17.5', '-23', '70'), { total: "Total marks possible can't be negative." });
  });

  it('pass mark "-5" → "Pass mark can\'t be negative."', () => {
    expectError(vm('17.5', '23', '-5'), { pass: "Pass mark can't be negative." });
  });

  it('A-15 order: not a number beats negative, negative beats too many decimals', () => {
    expectError(vm('-abc', '23', '70'), { earned: 'Marks earned must be a number, like 17.5.' });
    expectError(vm('-17.555', '23', '70'), { earned: "Marks earned can't be negative." });
  });
});

describe('T-S3.5 too many decimal places, no score', () => {
  it('earned "17.555" → "Marks earned can have at most 2 decimal places."', () => {
    expectError(vm('17.555', '23', '70'), { earned: 'Marks earned can have at most 2 decimal places.' });
  });

  it('total "23.001" → "Total marks possible can have at most 2 decimal places."', () => {
    expectError(vm('17.5', '23.001', '70'), { total: 'Total marks possible can have at most 2 decimal places.' });
  });

  it('pass mark "70.05" → "Pass mark can have at most 1 decimal place."', () => {
    expectError(vm('17.5', '23', '70.05'), { pass: 'Pass mark can have at most 1 decimal place.' });
  });
});

describe('T-S3.6 range and earned > total (earned "10", pass mark "70")', () => {
  it('total "0" → "Total marks possible must be more than 0."', () => {
    expectError(vm('10', '0', '70'), { total: 'Total marks possible must be more than 0.' });
  });

  it('total "1000000.01" → "Total marks possible can\'t be more than 1,000,000."', () => {
    expectError(vm('10', '1000000.01', '70'), { total: "Total marks possible can't be more than 1,000,000." });
  });

  it('total "8" → "Marks earned can\'t be more than the total marks possible." under marks earned', () => {
    expectError(vm('10', '8', '70'), { earned: "Marks earned can't be more than the total marks possible." });
  });

  it('pass mark "100.1" (total "23") → "Pass mark can\'t be more than 100."', () => {
    expectError(vm('10', '23', '100.1'), { pass: "Pass mark can't be more than 100." });
  });

  it('total "1000000" is accepted and shows "0.0%"', () => {
    const model = vm('10', '1000000', '70');
    expect(model.state).toBe('result');
    expect(model.state === 'result' && `${model.score}%`).toBe('0.0%');
  });

  it('earned > total is checked only when total is otherwise valid (A-15)', () => {
    expectError(vm('10', '0', '70'), { total: 'Total marks possible must be more than 0.' });
    expect(vm('10', '', '70').state).toBe('idle');
  });
});

describe('T-S3.7 two invalid fields each show their own message at once', () => {
  it('earned "abc" + total "0" → M-12 under earned, M-19 under total, M-3 in the result area', () => {
    expectError(vm('abc', '0', '70'), {
      earned: 'Marks earned must be a number, like 17.5.',
      total: 'Total marks possible must be more than 0.',
    });
  });

  it('the screen-reader announcement reads each field\'s message, then M-3', () => {
    expect(vm('abc', '0', '70').announcement).toBe(
      `Marks earned must be a number, like 17.5. Total marks possible must be more than 0. ${M3}`,
    );
  });

  it('an error in one field beats an empty field: M-3, never M-1', () => {
    expectError(vm('abc', '', '70'), { earned: 'Marks earned must be a number, like 17.5.' });
  });
});

describe('T-S3.8 recovery after "23.5" of "23" (M-15)', () => {
  it('earned → "17.5" clears it: "76.0%", Pass, "1.4 marks above the pass mark"', () => {
    expectError(vm('23.5', '23', '70'), { earned: "Marks earned can't be more than the total marks possible." });
    const model = vm('17.5', '23', '70');
    expect(model.fieldErrors).toEqual(NO_ERRORS);
    expect(model.state === 'result' && [`${model.score}%`, model.verdictText, model.gapText]).toEqual([
      '76.0%', 'Pass', '1.4 marks above the pass mark',
    ]);
  });

  it('or total → "25" clears it: "94.0%", Pass, "6 marks above the pass mark"', () => {
    const model = vm('23.5', '25', '70');
    expect(model.fieldErrors).toEqual(NO_ERRORS);
    expect(model.state === 'result' && [`${model.score}%`, model.verdictText, model.gapText]).toEqual([
      '94.0%', 'Pass', '6 marks above the pass mark',
    ]);
  });
});

describe('T-M.2 every error code maps to exactly one message', () => {
  const expected = {
    earned: { NOT_NUMBER: 'M-12', NEGATIVE: 'M-13', TOO_MANY_DP: 'M-14', OVER_TOTAL: 'M-15' },
    total: { NOT_NUMBER: 'M-16', NEGATIVE: 'M-17', TOO_MANY_DP: 'M-18', ZERO: 'M-19', TOO_LARGE: 'M-20' },
    pass: { NOT_NUMBER: 'M-21', NEGATIVE: 'M-22', TOO_MANY_DP: 'M-23', TOO_LARGE: 'M-24' },
  };

  it('the (field, code) → M-ID table is exactly the one in technical-design.md §Validation', () => {
    expect(ERROR_MESSAGE_IDS).toEqual(expected);
  });

  it('M-12..M-24 are each used by exactly one (field, code)', () => {
    const used = Object.values(ERROR_MESSAGE_IDS).flatMap((codes) => Object.values(codes));
    expect([...used].sort()).toEqual(Array.from({ length: 13 }, (_, i) => `M-${i + 12}`).sort());
    expect(new Set(used).size).toBe(used.length);
  });

  it('errorText returns the catalogue text for each (field, code)', () => {
    expect(errorText('earned', 'OVER_TOTAL')).toBe(MESSAGES['M-15']);
    expect(errorText('total', 'ZERO')).toBe(MESSAGES['M-19']);
    expect(errorText('pass', 'TOO_LARGE')).toBe(MESSAGES['M-24']);
    expect(errorText('pass', 'TOO_MANY_DP')).toBe('Pass mark can have at most 1 decimal place.');
  });
});
