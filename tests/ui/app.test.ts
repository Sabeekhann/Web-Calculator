// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { mountApp } from '../../src/ui/app';
import {
  FIELDS,
  calculate,
  expectMessage,
  expectNoMessage,
  expectNoResult,
  expectShares,
  expectTipAndTotal,
  fill,
  form,
  input,
  message,
  mount,
  result,
  shareLines,
  tipText,
  totalText,
  type,
} from './harness';

describe('app shell', () => {
  it('T-S0.1 mountApp renders the heading inside a main landmark', () => {
    const root = document.createElement('div');
    mountApp(root);
    const heading = root.querySelector('main h1');
    expect(heading?.textContent).toBe('Tip & Bill Splitter');
  });
});

const COMMA = 'Use a dot for decimals and no commas, for example 12.50.';
const PEOPLE_INVALID = 'Enter the number of people as a whole number from 1 to 100.';
const BILL_RANGE = 'Enter a bill amount from 0.01 to 1000000.00.';
const AMOUNT = String.raw`\d{1,3}(?:,\d{3})*\.\d{2}`;

describe('S-1 split the bill (ui-dom)', () => {
  it('T-S1.1 bill 100.00, tip 0, 3 people → Total 100.00 and 33.34 / 33.33 / 33.33', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '0', people: '3' });
    calculate(root);
    expect(totalText(root)).toBe('Total: 100.00');
    expectShares(root, ['33.34', '33.33', '33.33']);
    FIELDS.forEach((field) => expectNoMessage(root, field));
  });

  it('T-S1.1 Tip % starts at 0, so bill and people alone give the same split', () => {
    const root = mount();
    expect(input(root, 'tip').value).toBe('0');
    type(root, 'bill', '100.00');
    type(root, 'people', '3');
    calculate(root);
    expect(totalText(root)).toBe('Total: 100.00');
    expectShares(root, ['33.34', '33.33', '33.33']);
  });

  it('T-S1.2 bill 12,50 → comma message next to Bill and no result', () => {
    const root = mount();
    fill(root, { bill: '12,50', tip: '0', people: '2' });
    calculate(root);
    expectMessage(root, 'bill', COMMA);
    expectNoMessage(root, 'tip');
    expectNoMessage(root, 'people');
    expectNoResult(root);
  });

  it('T-S1.3 people 101 → people message next to People and no result', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '0', people: '101' });
    calculate(root);
    expectMessage(root, 'people', PEOPLE_INVALID);
    expectNoMessage(root, 'bill');
    expectNoResult(root);
  });

  it('T-S1.4 bill 0.00 → range message next to Bill and no result', () => {
    const root = mount();
    fill(root, { bill: '0.00', tip: '0', people: '3' });
    calculate(root);
    expectMessage(root, 'bill', BILL_RANGE);
    expectNoResult(root);
  });

  it('T-S1.5 bill 1000000.00, 1 person → Total 1,000,000.00 and one share of 1,000,000.00', () => {
    const root = mount();
    fill(root, { bill: '1000000.00', tip: '0', people: '1' });
    calculate(root);
    expect(totalText(root)).toBe('Total: 1,000,000.00');
    expectShares(root, ['1,000,000.00']);
  });

  it('T-S1.6 bill 0.01, 3 people → Total 0.01 and 0.01 / 0.00 / 0.00', () => {
    const root = mount();
    fill(root, { bill: '0.01', tip: '0', people: '3' });
    calculate(root);
    expect(totalText(root)).toBe('Total: 0.01');
    expectShares(root, ['0.01', '0.00', '0.00']);
  });

  it('T-S1.7 after the S-1.1 result, people 4 → Total 100.00 and four shares of 25.00', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '0', people: '3' });
    calculate(root);
    type(root, 'people', '4');
    calculate(root);
    expect(totalText(root)).toBe('Total: 100.00');
    expectShares(root, ['25.00', '25.00', '25.00', '25.00']);
  });

  it('T-S1.8 after the comma message, bill 12.50 clears it before Calculate; then 6.25 / 6.25', () => {
    const root = mount();
    fill(root, { bill: '12,50', tip: '0', people: '2' });
    calculate(root);
    expectMessage(root, 'bill', COMMA);
    type(root, 'bill', '12.50');
    expectNoMessage(root, 'bill');
    expectNoResult(root);
    calculate(root);
    expect(totalText(root)).toBe('Total: 12.50');
    expectShares(root, ['6.25', '6.25']);
  });
});

const TIP_RANGE = 'Enter a tip percentage from 0 to 100.';
const TIP_NEGATIVE = "The tip can't be negative. Enter a percentage from 0 to 100.";
const TIP_DECIMALS = 'Enter the tip percentage with no more than 2 decimals, for example 12.5.';
const TIP_HINT = 'Use 0 for no tip.';

describe('S-2 tip and total (ui-dom)', () => {
  it('T-S2.1 bill 100.00, tip 15, 3 people → Tip 15.00, Total 115.00 and 38.34 / 38.33 / 38.33', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '15', people: '3' });
    calculate(root);
    expectTipAndTotal(root, '15.00', '115.00');
    expectShares(root, ['38.34', '38.33', '38.33']);
    FIELDS.forEach((field) => expectNoMessage(root, field));
  });

  it('T-S2.2 bill 0.30, tip 15, 1 person → Tip 0.05 (0.045 half-up), Total 0.35 and Person 1 0.35', () => {
    const root = mount();
    fill(root, { bill: '0.30', tip: '15', people: '1' });
    calculate(root);
    expectTipAndTotal(root, '0.05', '0.35');
    expectShares(root, ['0.35']);
  });

  it('T-S2.3 on load Tip % shows 0 with the hint, described by tip-hint and tip-msg', () => {
    const root = mount();
    expect(input(root, 'tip').value).toBe('0');
    const hint = root.querySelector('#tip-hint');
    expect(hint?.textContent).toBe(TIP_HINT);
    expect(hint?.closest('.field')?.contains(input(root, 'tip'))).toBe(true);
    expect(input(root, 'tip').getAttribute('aria-describedby')).toBe('tip-hint tip-msg');
  });

  it('T-S2.3 bill 50.00 and people 2 with Tip % untouched → Tip 0.00, Total 50.00 and 25.00 / 25.00', () => {
    const root = mount();
    type(root, 'bill', '50.00');
    type(root, 'people', '2');
    calculate(root);
    expectTipAndTotal(root, '0.00', '50.00');
    expectShares(root, ['25.00', '25.00']);
  });

  it('T-S2.3 the hint stays visible after an error and after a result', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '-5', people: '3' });
    calculate(root);
    expect(root.querySelector('#tip-hint')?.textContent).toBe(TIP_HINT);
    type(root, 'tip', '15');
    calculate(root);
    expect(root.querySelector('#tip-hint')?.textContent).toBe(TIP_HINT);
  });

  it('T-S2.4 tip 100.01 → range message next to Tip % and no result', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '100.01', people: '3' });
    calculate(root);
    expectMessage(root, 'tip', TIP_RANGE);
    expectNoMessage(root, 'bill');
    expectNoMessage(root, 'people');
    expectNoResult(root);
  });

  it('T-S2.5 bill 1000000.00, tip 100, 3 people → Tip 1,000,000.00, Total 2,000,000.00 and 666,666.67 / 666,666.67 / 666,666.66', () => {
    const root = mount();
    fill(root, { bill: '1000000.00', tip: '100', people: '3' });
    calculate(root);
    expectTipAndTotal(root, '1,000,000.00', '2,000,000.00');
    expectShares(root, ['666,666.67', '666,666.67', '666,666.66']);
  });

  it('T-S2.6 tip -5 → negative message next to Tip % and no result', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '-5', people: '3' });
    calculate(root);
    expectMessage(root, 'tip', TIP_NEGATIVE);
    expectNoMessage(root, 'bill');
    expectNoMessage(root, 'people');
    expectNoResult(root);
  });

  it('T-S2.7 after the S-2.1 result, tip 12.5 → Tip 12.50, Total 112.50 and three shares of 37.50', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '15', people: '3' });
    calculate(root);
    expectTipAndTotal(root, '15.00', '115.00');
    type(root, 'tip', '12.5');
    calculate(root);
    expectTipAndTotal(root, '12.50', '112.50');
    expectShares(root, ['37.50', '37.50', '37.50']);
  });

  it('T-S2.8 after the decimals message, tip 12.55 clears it; then Tip 12.55, Total 112.55 and 37.52 / 37.52 / 37.51', () => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '12.555', people: '3' });
    calculate(root);
    expectMessage(root, 'tip', TIP_DECIMALS);
    expectNoResult(root);
    type(root, 'tip', '12.55');
    expectNoMessage(root, 'tip');
    calculate(root);
    expectNoMessage(root, 'tip');
    expectTipAndTotal(root, '12.55', '112.55');
    expectShares(root, ['37.52', '37.52', '37.51']);
  });
});

describe('global rules built with S-1 (ui-dom)', () => {
  it.each(FIELDS)('T-G1 editing %s after a result empties #result at once', (field) => {
    const root = mount();
    fill(root, { bill: '100.00', tip: '0', people: '3' });
    calculate(root);
    expect(result(root).childNodes.length).toBeGreaterThan(0);
    type(root, field, input(root, field).value);
    expectNoResult(root);
    expect(input(root, 'bill').value).toBe('100.00');
    expect(input(root, 'tip').value).toBe('0');
    expect(input(root, 'people').value).toBe('3');
  });

  it('T-G2 typing invalid values never shows a message before Calculate', () => {
    const root = mount();
    fill(root, { bill: 'abc', tip: '-5', people: '0' });
    FIELDS.forEach((field) => expectNoMessage(root, field));
  });

  it('T-G2 a shown message does not change on input while the field stays invalid', () => {
    const root = mount();
    fill(root, { bill: '12,50', tip: '0', people: '2' });
    calculate(root);
    type(root, 'bill', 'abc');
    expectMessage(root, 'bill', COMMA);
  });

  it('T-G2 a valid edit clears only its own field message', () => {
    const root = mount();
    fill(root, { bill: '12,50', tip: '0', people: '101' });
    calculate(root);
    type(root, 'bill', '12.50');
    expectNoMessage(root, 'bill');
    expectMessage(root, 'people', PEOPLE_INVALID);
  });

  it('T-G2 Calculate shows a message for every invalid field at once', () => {
    const root = mount();
    fill(root, { bill: '', tip: '', people: '' });
    calculate(root);
    expectMessage(root, 'bill', 'Enter the bill amount, for example 84.50.');
    expectMessage(root, 'tip', 'Enter a tip percentage from 0 to 100. Use 0 for no tip.');
    expectMessage(root, 'people', 'Enter the number of people, for example 4.');
    expectNoResult(root);
  });

  it('T-G3 the fields sit in one form whose submit button is Calculate, so Enter submits', () => {
    const root = mount();
    const formElement = form(root);
    FIELDS.forEach((field) => expect(formElement.contains(input(root, field))).toBe(true));
    const buttons = formElement.querySelectorAll('button[type="submit"]');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]?.textContent).toBe('Calculate');
    expect(formElement.noValidate).toBe(true);
    expect(formElement.getAttribute('autocomplete')).toBe('off');
    fill(root, { bill: '100.00', tip: '0', people: '3' });
    formElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(totalText(root)).toBe('Total: 100.00');
  });

  it('T-G4 no NaN, Infinity, undefined or blank output over the sweep and the bounds', () => {
    const root = mount();
    const sweep = ['', '   ', 'abc', '1e400', '-5', '0', '1'.repeat(50), '12,50', '1.2.3', '.', 'Infinity', '.5', '5.', '007'];
    const valid = { bill: '100.00', tip: '0', people: '3' };
    const cases = [
      ...FIELDS.flatMap((field) => sweep.map((value) => ({ ...valid, [field]: value }))),
      { bill: '1000000.00', tip: '100', people: '3' },
      { bill: '1000000.00', tip: '100', people: '100' },
      { bill: '0.01', tip: '0', people: '100' },
      { bill: '0.01', tip: '100', people: '1' },
    ];
    for (const values of cases) {
      fill(root, values);
      calculate(root);
      expect(root.textContent).not.toMatch(/NaN|Infinity|undefined/);
      if (result(root).childNodes.length > 0) {
        expect(tipText(root)).toMatch(new RegExp(`^Tip: ${AMOUNT}$`));
        expect(totalText(root)).toMatch(new RegExp(`^Total: ${AMOUNT}$`));
        const lines = shareLines(root);
        expect(lines).toHaveLength(Number(values.people.trim()));
        lines.forEach((line, index) => expect(line).toMatch(new RegExp(`^Person ${index + 1}: ${AMOUNT}`)));
      } else {
        expect(FIELDS.some((field) => (message(root, field).textContent ?? '') !== '')).toBe(true);
      }
    }
  });

  it('T-G7 inputs are labelled, typed as text with an input mode, and described by their message', () => {
    const root = mount();
    const expected: Array<[string, string, string]> = [
      ['bill', 'Bill', 'decimal'],
      ['tip', 'Tip %', 'decimal'],
      ['people', 'People', 'numeric'],
    ];
    for (const [id, label, mode] of expected) {
      expect(root.querySelector(`label[for="${id}"]`)?.textContent).toBe(label);
      const element = root.querySelector<HTMLInputElement>(`#${id}`);
      expect(element?.type).toBe('text');
      expect(element?.getAttribute('inputmode')).toBe(mode);
      expect(element?.getAttribute('aria-describedby')?.split(' ')).toContain(`${id}-msg`);
      expect(root.querySelector(`#${id}-msg`)?.getAttribute('aria-live')).toBe('polite');
    }
    expect(result(root).getAttribute('aria-live')).toBe('polite');
  });

  it('T-G7 aria-invalid is set with a message and removed when it clears on Calculate', () => {
    const root = mount();
    fill(root, { bill: '0.00', tip: '0', people: '3' });
    calculate(root);
    expectMessage(root, 'bill', BILL_RANGE);
    input(root, 'bill').value = '100.00';
    calculate(root);
    expectNoMessage(root, 'bill');
    expect(totalText(root)).toBe('Total: 100.00');
  });
});
