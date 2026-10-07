import { describe, expect, it } from 'vitest';
import { validateInputs } from '../../src/validation/form';

describe('validateInputs', () => {
  it('T-S1.1 returns the typed split input when every field is valid', () => {
    expect(validateInputs({ bill: '100.00', tip: '0', people: '3' })).toEqual({
      ok: true,
      value: { billCents: 10000, tipBasisPoints: 0, people: 3 },
    });
  });

  it('T-S1.2 reports E-BILL-COMMA for the bill only', () => {
    expect(validateInputs({ bill: '12,50', tip: '0', people: '2' })).toEqual({
      ok: false,
      error: { bill: 'E-BILL-COMMA' },
    });
  });

  it('T-S1.3 reports E-PEOPLE-INVALID for the people only', () => {
    expect(validateInputs({ bill: '100.00', tip: '0', people: '101' })).toEqual({
      ok: false,
      error: { people: 'E-PEOPLE-INVALID' },
    });
  });

  it('T-S1.4 reports E-BILL-RANGE for a 0.00 bill', () => {
    expect(validateInputs({ bill: '0.00', tip: '0', people: '3' })).toEqual({
      ok: false,
      error: { bill: 'E-BILL-RANGE' },
    });
  });

  it('T-G2 evaluates every field without stopping at the first error', () => {
    expect(validateInputs({ bill: '', tip: '', people: '' })).toEqual({
      ok: false,
      error: { bill: 'E-BILL-EMPTY', tip: 'E-TIP-EMPTY', people: 'E-PEOPLE-EMPTY' },
    });
  });
});
