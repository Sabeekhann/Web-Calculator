import { describe, expect, it } from 'vitest';
import { MESSAGES } from '../src/messages';

const CATALOGUE: Record<string, string> = {
  'E-BILL-EMPTY': 'Enter the bill amount, for example 84.50.',
  'E-BILL-COMMA': 'Use a dot for decimals and no commas, for example 12.50.',
  'E-BILL-NEGATIVE': "The bill amount can't be negative. Enter an amount from 0.01 to 1000000.00.",
  'E-BILL-FORMAT': 'Enter the bill amount using only digits and one dot, for example 84.50.',
  'E-BILL-DECIMALS': 'Enter the bill amount with no more than 2 decimals, for example 84.50.',
  'E-BILL-RANGE': 'Enter a bill amount from 0.01 to 1000000.00.',
  'E-TIP-EMPTY': 'Enter a tip percentage from 0 to 100. Use 0 for no tip.',
  'E-TIP-COMMA': 'Use a dot for decimals and no commas, for example 12.5.',
  'E-TIP-NEGATIVE': "The tip can't be negative. Enter a percentage from 0 to 100.",
  'E-TIP-FORMAT': 'Enter the tip percentage using only digits and one dot, for example 12.5.',
  'E-TIP-DECIMALS': 'Enter the tip percentage with no more than 2 decimals, for example 12.5.',
  'E-TIP-RANGE': 'Enter a tip percentage from 0 to 100.',
  'E-PEOPLE-EMPTY': 'Enter the number of people, for example 4.',
  'E-PEOPLE-INVALID': 'Enter the number of people as a whole number from 1 to 100.',
  'H-TIP-HINT': 'Use 0 for no tip.',
  'N-EVEN': 'All shares are equal.',
  'N-ONE': '{total} does not divide evenly by {N}, so Person 1 pays 0.01 more than the others.',
  'N-MANY':
    '{total} does not divide evenly by {N}, so the first {r} people each pay 0.01 more than the others.',
};

describe('message catalogue', () => {
  it('T-G6 has exactly the 18 catalogue IDs', () => {
    expect(Object.keys(MESSAGES).sort()).toEqual(Object.keys(CATALOGUE).sort());
    expect(Object.keys(MESSAGES)).toHaveLength(18);
  });

  it.each(Object.entries(CATALOGUE))('T-G6 %s matches the catalogue text exactly', (id, text) => {
    expect((MESSAGES as Record<string, string>)[id]).toBe(text);
  });
});
