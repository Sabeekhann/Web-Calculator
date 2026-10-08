// String → scaled integer, without parseFloat or Number() (technical-design.md §Decimal strategy, ADR-002).

export type ParseCode = 'NOT_NUMBER' | 'NEGATIVE' | 'TOO_MANY_DP';

/** `value` is the number × 10^maxDp as an exact integer; `null` means the field is empty. */
export type ParseResult = { ok: true; value: number | null } | { ok: false; code: ParseCode };

/** Above every limit (1,000,000 × 100 and 100 × 10), so a saturated value only ever fails a range check. */
export const OVER_LIMIT = 1_000_000_000_000;

/** More integer digits than this saturate to OVER_LIMIT, keeping every value a safe integer. */
const MAX_INT_DIGITS = 9;

/** Digits with at most one dot (A-13); the integer or fraction part may be empty. */
const DECIMAL = /^(\d*)(?:\.(\d*))?$/;

/** Folds a string of ASCII digits into an integer, one digit at a time. */
function digitsValue(digits: string): number {
  let value = 0;
  for (let i = 0; i < digits.length; i += 1) value = value * 10 + (digits.charCodeAt(i) - 48);
  return value;
}

/**
 * Checks, in A-15 order: not a number → negative → too many decimal places.
 * Spaces around the text are ignored; "" and a lone "." are empty (A-18); a lone "-" is negative (A-18).
 */
export function parseDecimal(raw: string, maxDp: number): ParseResult {
  const text = raw.trim();
  if (text === '' || text === '.') return { ok: true, value: null };

  const negative = text.startsWith('-');
  const match = DECIMAL.exec(negative ? text.slice(1) : text);
  if (match === null) return { ok: false, code: 'NOT_NUMBER' };
  if (negative) return { ok: false, code: 'NEGATIVE' };

  const intDigits = (match[1] ?? '').replace(/^0+/, '');
  const fracDigits = match[2] ?? '';
  if (fracDigits.length > maxDp) return { ok: false, code: 'TOO_MANY_DP' };
  if (intDigits.length > MAX_INT_DIGITS) return { ok: true, value: OVER_LIMIT };

  return { ok: true, value: digitsValue(intDigits + fracDigits.padEnd(maxDp, '0')) };
}
