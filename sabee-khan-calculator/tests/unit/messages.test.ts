import { describe, expect, it } from 'vitest';
import { ESC_KEY_LABEL, MESSAGES, MESSAGE_IDS, type MessageId } from '../../src/messages';

// Verbatim copy of the catalogue in docs/user-stories.md (M-1..M-40).
// This is the one place where the texts are retyped, so a drift in messages.ts fails here.
const CATALOGUE: Record<MessageId, string> = {
  'M-1': 'Enter marks earned and total marks possible to see the score.',
  'M-2': 'Enter a pass mark to see whether this is a pass or a fail.',
  'M-3': 'The score will appear once every entry is valid.',
  'M-4': 'Pass',
  'M-5': 'Fail',
  'M-6': '{n} marks short of the pass mark',
  'M-7': '1 mark short of the pass mark',
  'M-8': '{n} marks above the pass mark',
  'M-9': '1 mark above the pass mark',
  'M-10': 'Exactly on the pass mark',
  'M-11': 'Less than 0.01 marks above the pass mark',
  'M-12': 'Marks earned must be a number, like 17.5.',
  'M-13': "Marks earned can't be negative.",
  'M-14': 'Marks earned can have at most 2 decimal places.',
  'M-15': "Marks earned can't be more than the total marks possible.",
  'M-16': 'Total marks possible must be a number, like 23.',
  'M-17': "Total marks possible can't be negative.",
  'M-18': 'Total marks possible can have at most 2 decimal places.',
  'M-19': 'Total marks possible must be more than 0.',
  'M-20': "Total marks possible can't be more than 1,000,000.",
  'M-21': 'Pass mark must be a number, like 70.',
  'M-22': "Pass mark can't be negative.",
  'M-23': 'Pass mark can have at most 1 decimal place.',
  'M-24': "Pass mark can't be more than 100.",
  'M-25': 'Next learner',
  'M-26': 'Copy outcome',
  'M-27': 'Outcome copied.',
  'M-28': '{earned} of {total} marks: {score}, {verdict}, {gap line}',
  'M-29': 'Marks needed to pass: {n} of {total}',
  'M-30': 'Quiz score and pass-mark calculator',
  'M-31': 'Quiz score',
  'M-32': 'Check a quiz result',
  'M-33': 'A score at or above the pass mark is a pass.',
  'M-34': 'Marks earned',
  'M-35': 'Total marks possible',
  'M-36': 'Pass mark',
  'M-37': ' (percent)',
  'M-38': '%',
  'M-39': 'Score',
  'M-40': 'or press Esc',
};

const EXPECTED_IDS = Array.from({ length: 40 }, (_, i) => `M-${i + 1}`);

describe('T-M.1 message catalogue', () => {
  it('T-M.1a has exactly the IDs M-1..M-40, each once, in order', () => {
    expect([...MESSAGE_IDS]).toEqual(EXPECTED_IDS);
    expect(new Set(MESSAGE_IDS).size).toBe(MESSAGE_IDS.length);
    expect(Object.keys(MESSAGES).sort()).toEqual([...EXPECTED_IDS].sort());
  });

  it('T-M.1b every text is a non-empty string with no stray whitespace (M-37 keeps its leading space)', () => {
    for (const id of MESSAGE_IDS) {
      const text = MESSAGES[id];
      expect(typeof text, id).toBe('string');
      expect(text.trim().length, id).toBeGreaterThan(0);
      if (id !== 'M-37') expect(text, id).toBe(text.trim());
    }
    expect(MESSAGES['M-37'].startsWith(' ')).toBe(true);
  });

  it('T-M.1c every text matches the catalogue in user-stories.md verbatim', () => {
    for (const id of EXPECTED_IDS as MessageId[]) {
      expect(MESSAGES[id], id).toBe(CATALOGUE[id]);
    }
  });

  it('T-M.1d spot-checks the texts the shell renders', () => {
    expect(MESSAGES['M-1']).toBe('Enter marks earned and total marks possible to see the score.');
    expect(MESSAGES['M-25']).toBe('Next learner');
    expect(MESSAGES['M-30']).toBe('Quiz score and pass-mark calculator');
    expect(MESSAGES['M-36'] + MESSAGES['M-37']).toBe('Pass mark (percent)');
  });

  it('T-M.1e the Esc key label is the last word of M-40', () => {
    expect(ESC_KEY_LABEL).toBe('Esc');
    expect(MESSAGES['M-40'].endsWith(` ${ESC_KEY_LABEL}`)).toBe(true);
  });
});
