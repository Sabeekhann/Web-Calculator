import { parseDecimal, type ParseCode } from './parse';

// Per-field checks in A-15 order (technical-design.md §Validation). Nothing throws; every result is typed.

export type EarnedCode = ParseCode | 'OVER_TOTAL';
export type TotalCode = ParseCode | 'ZERO' | 'TOO_LARGE';
export type PassCode = ParseCode | 'TOO_LARGE';

/** `value` is a scaled integer (earned and total × 100, pass mark × 10); `null` = empty field. */
export type FieldResult<Code> = { ok: true; value: number | null } | { ok: false; code: Code };

export interface RawFields {
  readonly earned: string;
  readonly total: string;
  readonly pass: string;
}

export interface ValidatedFields {
  readonly earned: FieldResult<EarnedCode>;
  readonly total: FieldResult<TotalCode>;
  readonly pass: FieldResult<PassCode>;
}

const MARKS_DP = 2; // A-4
const PASS_DP = 1; // A-6
const TOTAL_MAX = 100_000_000; // 1,000,000 marks × 100 (A-5)
const PASS_MAX = 1000; // 100 % × 10 (A-6)

function validateTotal(raw: string): FieldResult<TotalCode> {
  const parsed = parseDecimal(raw, MARKS_DP);
  if (!parsed.ok || parsed.value === null) return parsed;
  if (parsed.value === 0) return { ok: false, code: 'ZERO' };
  if (parsed.value > TOTAL_MAX) return { ok: false, code: 'TOO_LARGE' };
  return parsed;
}

function validatePass(raw: string): FieldResult<PassCode> {
  const parsed = parseDecimal(raw, PASS_DP);
  if (!parsed.ok || parsed.value === null) return parsed;
  if (parsed.value > PASS_MAX) return { ok: false, code: 'TOO_LARGE' };
  return parsed;
}

/** Marks earned ≤ total is checked only when both are otherwise valid and filled in (A-15). */
function validateEarned(raw: string, total: FieldResult<TotalCode>): FieldResult<EarnedCode> {
  const parsed = parseDecimal(raw, MARKS_DP);
  if (!parsed.ok || parsed.value === null) return parsed;
  if (total.ok && total.value !== null && parsed.value > total.value) return { ok: false, code: 'OVER_TOTAL' };
  return parsed;
}

export function validateInputs(raw: RawFields): ValidatedFields {
  const total = validateTotal(raw.total);
  return { earned: validateEarned(raw.earned, total), total, pass: validatePass(raw.pass) };
}
