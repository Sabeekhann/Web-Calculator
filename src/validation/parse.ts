import type { BillErrorId, PeopleErrorId, TipErrorId } from '../messages';
import type { Result } from '../result';

type DecimalErrorKind = 'EMPTY' | 'COMMA' | 'NEGATIVE' | 'FORMAT' | 'DECIMALS' | 'RANGE';

const DECIMAL_PATTERN = /^(?:\d+\.?\d*|\.\d+)$/;
const WHOLE_NUMBER_PATTERN = /^\d+$/;
const LEADING_ZEROS = /^0+/;
const MAX_FRACTION_DIGITS = 2;
const MAX_INTEGER_DIGITS = 9;
const MIN_BILL_CENTS = 1;
const MAX_BILL_CENTS = 100_000_000;
const MIN_TIP_BASIS_POINTS = 0;
const MAX_TIP_BASIS_POINTS = 10_000;
const MAX_PEOPLE_DIGITS = 3;
const MAX_PEOPLE = 100;

const ok = <T>(value: T): { ok: true; value: T } => ({ ok: true, value });
const fail = <E>(error: E): { ok: false; error: E } => ({ ok: false, error });

function parseDecimal2(raw: string, min: number, max: number): Result<number, DecimalErrorKind> {
  const text = raw.trim();
  if (text === '') return fail('EMPTY');
  if (text.includes(',')) return fail('COMMA');
  if (text.startsWith('-')) return fail('NEGATIVE');
  if (!DECIMAL_PATTERN.test(text)) return fail('FORMAT');
  const [integerPart = '', fractionPart = ''] = text.split('.');
  if (fractionPart.length > MAX_FRACTION_DIGITS) return fail('DECIMALS');
  const integerDigits = integerPart.replace(LEADING_ZEROS, '');
  if (integerDigits.length > MAX_INTEGER_DIGITS) return fail('RANGE');
  const hundredths = Number(integerDigits || '0') * 100 + Number(fractionPart.padEnd(MAX_FRACTION_DIGITS, '0'));
  if (hundredths < min || hundredths > max) return fail('RANGE');
  return ok(hundredths);
}

export function parseMoney(raw: string): Result<number, BillErrorId> {
  const parsed = parseDecimal2(raw, MIN_BILL_CENTS, MAX_BILL_CENTS);
  return parsed.ok ? parsed : fail(`E-BILL-${parsed.error}` as const);
}

export function parsePercent(raw: string): Result<number, TipErrorId> {
  const parsed = parseDecimal2(raw, MIN_TIP_BASIS_POINTS, MAX_TIP_BASIS_POINTS);
  return parsed.ok ? parsed : fail(`E-TIP-${parsed.error}` as const);
}

export function parsePeople(raw: string): Result<number, PeopleErrorId> {
  const text = raw.trim();
  if (text === '') return fail('E-PEOPLE-EMPTY');
  if (!WHOLE_NUMBER_PATTERN.test(text)) return fail('E-PEOPLE-INVALID');
  const digits = text.replace(LEADING_ZEROS, '');
  if (digits === '' || digits.length > MAX_PEOPLE_DIGITS || Number(digits) > MAX_PEOPLE) {
    return fail('E-PEOPLE-INVALID');
  }
  return ok(Number(digits));
}
