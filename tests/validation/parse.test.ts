import { describe, expect, it } from 'vitest';
import { parseMoney, parsePeople, parsePercent } from '../../src/validation/parse';

const FIFTY_DIGITS = '1'.repeat(50);

describe('parseMoney (Bill)', () => {
  it('T-S1.1 accepts 100.00 as 10000 cents', () => {
    expect(parseMoney('100.00')).toEqual({ ok: true, value: 10000 });
  });

  it('T-S1.2 rejects 12,50 with E-BILL-COMMA', () => {
    expect(parseMoney('12,50')).toEqual({ ok: false, error: 'E-BILL-COMMA' });
  });

  it('T-S1.4 rejects 0.00 with E-BILL-RANGE', () => {
    expect(parseMoney('0.00')).toEqual({ ok: false, error: 'E-BILL-RANGE' });
  });

  it('T-S1.5 accepts the maximum 1000000.00 as 100000000 cents', () => {
    expect(parseMoney('1000000.00')).toEqual({ ok: true, value: 100_000_000 });
  });

  it('T-S1.6 accepts the minimum 0.01 as 1 cent', () => {
    expect(parseMoney('0.01')).toEqual({ ok: true, value: 1 });
  });

  it('T-S1.8 accepts 12.50 as 1250 cents', () => {
    expect(parseMoney('12.50')).toEqual({ ok: true, value: 1250 });
  });
});

describe('parsePercent (Tip %)', () => {
  it('T-S1.1 accepts the default 0 as 0 basis points', () => {
    expect(parsePercent('0')).toEqual({ ok: true, value: 0 });
  });

  it('T-G4 accepts the maximum 100 as 10000 basis points', () => {
    expect(parsePercent('100')).toEqual({ ok: true, value: 10_000 });
  });
});

describe('parsePeople (People)', () => {
  it('T-S1.1 accepts 3', () => {
    expect(parsePeople('3')).toEqual({ ok: true, value: 3 });
  });

  it('T-S1.3 rejects 101 with E-PEOPLE-INVALID', () => {
    expect(parsePeople('101')).toEqual({ ok: false, error: 'E-PEOPLE-INVALID' });
  });

  it('T-S1.5 accepts the minimum 1', () => {
    expect(parsePeople('1')).toEqual({ ok: true, value: 1 });
  });

  it('T-S1.7 accepts 4', () => {
    expect(parsePeople('4')).toEqual({ ok: true, value: 4 });
  });
});

type Expected = number | string;

const SWEEP: Array<[string, Expected, Expected, Expected]> = [
  ['', 'E-BILL-EMPTY', 'E-TIP-EMPTY', 'E-PEOPLE-EMPTY'],
  ['   ', 'E-BILL-EMPTY', 'E-TIP-EMPTY', 'E-PEOPLE-EMPTY'],
  ['abc', 'E-BILL-FORMAT', 'E-TIP-FORMAT', 'E-PEOPLE-INVALID'],
  ['1e400', 'E-BILL-FORMAT', 'E-TIP-FORMAT', 'E-PEOPLE-INVALID'],
  ['-5', 'E-BILL-NEGATIVE', 'E-TIP-NEGATIVE', 'E-PEOPLE-INVALID'],
  ['0', 'E-BILL-RANGE', 0, 'E-PEOPLE-INVALID'],
  [FIFTY_DIGITS, 'E-BILL-RANGE', 'E-TIP-RANGE', 'E-PEOPLE-INVALID'],
  ['  84.50 ', 8450, 8450, 'E-PEOPLE-INVALID'],
  [' 10', 1000, 1000, 10],
  ['4 ', 400, 400, 4],
  ['12,50', 'E-BILL-COMMA', 'E-TIP-COMMA', 'E-PEOPLE-INVALID'],
  ['1.2.3', 'E-BILL-FORMAT', 'E-TIP-FORMAT', 'E-PEOPLE-INVALID'],
  ['+5', 'E-BILL-FORMAT', 'E-TIP-FORMAT', 'E-PEOPLE-INVALID'],
  ['15%', 'E-BILL-FORMAT', 'E-TIP-FORMAT', 'E-PEOPLE-INVALID'],
  ['.', 'E-BILL-FORMAT', 'E-TIP-FORMAT', 'E-PEOPLE-INVALID'],
  ['1 000', 'E-BILL-FORMAT', 'E-TIP-FORMAT', 'E-PEOPLE-INVALID'],
  ['Infinity', 'E-BILL-FORMAT', 'E-TIP-FORMAT', 'E-PEOPLE-INVALID'],
  ['.5', 50, 50, 'E-PEOPLE-INVALID'],
  ['5.', 500, 500, 'E-PEOPLE-INVALID'],
  ['12.555', 'E-BILL-DECIMALS', 'E-TIP-DECIMALS', 'E-PEOPLE-INVALID'],
  ['0.001', 'E-BILL-DECIMALS', 'E-TIP-DECIMALS', 'E-PEOPLE-INVALID'],
  ['-1,5', 'E-BILL-COMMA', 'E-TIP-COMMA', 'E-PEOPLE-INVALID'],
  ['-abc', 'E-BILL-NEGATIVE', 'E-TIP-NEGATIVE', 'E-PEOPLE-INVALID'],
  ['100.01', 10001, 'E-TIP-RANGE', 'E-PEOPLE-INVALID'],
  ['1000000.01', 'E-BILL-RANGE', 'E-TIP-RANGE', 'E-PEOPLE-INVALID'],
  ['2.5', 250, 250, 'E-PEOPLE-INVALID'],
  ['101', 10100, 'E-TIP-RANGE', 'E-PEOPLE-INVALID'],
  ['100', 10000, 10000, 100],
  ['007', 700, 700, 7],
];

const toResult = (expected: Expected) =>
  typeof expected === 'number' ? { ok: true, value: expected } : { ok: false, error: expected };

describe('edge-case sweep (test-plan §3)', () => {
  it.each(SWEEP)('T-E %j → Bill %j, Tip %j, People %j', (input, bill, tip, people) => {
    expect(parseMoney(input)).toEqual(toResult(bill));
    expect(parsePercent(input)).toEqual(toResult(tip));
    expect(parsePeople(input)).toEqual(toResult(people));
  });

  it('T-G4 no parser ever returns a value that is not a safe, non-negative integer', () => {
    const inputs = [...SWEEP.map(([input]) => input), '9'.repeat(400), '999999999.99', 'NaN', '0x10', '١٢'];
    for (const input of inputs) {
      for (const result of [parseMoney(input), parsePercent(input), parsePeople(input)]) {
        if (result.ok) {
          expect(Number.isSafeInteger(result.value) && result.value >= 0).toBe(true);
        }
      }
    }
  });
});
