import type { Result } from '../result';
import type { FieldErrors, RawInputs, SplitInput } from '../types';
import { parseMoney, parsePeople, parsePercent } from './parse';

export function validateInputs(raw: RawInputs): Result<SplitInput, FieldErrors> {
  const bill = parseMoney(raw.bill);
  const tip = parsePercent(raw.tip);
  const people = parsePeople(raw.people);
  if (bill.ok && tip.ok && people.ok) {
    return { ok: true, value: { billCents: bill.value, tipBasisPoints: tip.value, people: people.value } };
  }
  const errors: FieldErrors = {};
  if (!bill.ok) errors.bill = bill.error;
  if (!tip.ok) errors.tip = tip.error;
  if (!people.ok) errors.people = people.error;
  return { ok: false, error: errors };
}
