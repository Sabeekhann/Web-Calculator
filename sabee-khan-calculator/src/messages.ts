/**
 * The single catalogue of user-facing text (M-1..M-40, docs/user-stories.md).
 * UI code never hard-codes text: it reads it from here.
 * Templates keep their placeholders ({n}, {total}, …); helpers below fill them.
 */

import { formatMarks } from './logic/format';
import type { Gap } from './logic/gap';
import type { EarnedCode, PassCode, TotalCode } from './validation/validate';

export const MESSAGE_IDS = [
  'M-1', 'M-2', 'M-3', 'M-4', 'M-5', 'M-6', 'M-7', 'M-8', 'M-9', 'M-10',
  'M-11', 'M-12', 'M-13', 'M-14', 'M-15', 'M-16', 'M-17', 'M-18', 'M-19', 'M-20',
  'M-21', 'M-22', 'M-23', 'M-24', 'M-25', 'M-26', 'M-27', 'M-28', 'M-29', 'M-30',
  'M-31', 'M-32', 'M-33', 'M-34', 'M-35', 'M-36', 'M-37', 'M-38', 'M-39', 'M-40',
] as const;

export type MessageId = (typeof MESSAGE_IDS)[number];

export const MESSAGES = {
  // Result area and verdict
  'M-1': 'Enter marks earned and total marks possible to see the score.',
  'M-2': 'Enter a pass mark to see whether this is a pass or a fail.',
  'M-3': 'The score will appear once every entry is valid.',
  'M-4': 'Pass',
  'M-5': 'Fail',
  // Gap line ({n}: at most 2 dp, trailing zeros trimmed, comma thousands)
  'M-6': '{n} marks short of the pass mark',
  'M-7': '1 mark short of the pass mark',
  'M-8': '{n} marks above the pass mark',
  'M-9': '1 mark above the pass mark',
  'M-10': 'Exactly on the pass mark',
  'M-11': 'Less than 0.01 marks above the pass mark',
  // Under marks earned
  'M-12': 'Marks earned must be a number, like 17.5.',
  'M-13': "Marks earned can't be negative.",
  'M-14': 'Marks earned can have at most 2 decimal places.',
  'M-15': "Marks earned can't be more than the total marks possible.",
  // Under total marks possible
  'M-16': 'Total marks possible must be a number, like 23.',
  'M-17': "Total marks possible can't be negative.",
  'M-18': 'Total marks possible can have at most 2 decimal places.',
  'M-19': 'Total marks possible must be more than 0.',
  'M-20': "Total marks possible can't be more than 1,000,000.",
  // Under pass mark
  'M-21': 'Pass mark must be a number, like 70.',
  'M-22': "Pass mark can't be negative.",
  'M-23': 'Pass mark can have at most 1 decimal place.',
  'M-24': "Pass mark can't be more than 100.",
  // Actions (M-26..M-29 are for future stories S-5, S-6)
  'M-25': 'Next learner',
  'M-26': 'Copy outcome',
  'M-27': 'Outcome copied.',
  'M-28': '{earned} of {total} marks: {score}, {verdict}, {gap line}',
  'M-29': 'Marks needed to pass: {n} of {total}',
  // Page and card text (DEC-11)
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
} as const satisfies Record<MessageId, string>;

/** The key name at the end of M-40, shown in a <kbd> element. */
export const ESC_KEY_LABEL = 'Esc';

/** The unit after a score ("76.0%"): the same percent sign as M-38. */
export const SCORE_UNIT = MESSAGES['M-38'];

/** A score as read out: "76.0" → "76.0%". */
export function scoreText(score: string): string {
  return `${score}${SCORE_UNIT}`;
}

/** Joins the parts of a screen-reader announcement (ui-design.md §Accessibility): "76.0%, Pass". */
export function announcementText(parts: ReadonlyArray<string>): string {
  return parts.join(', ');
}

/** Error codes per field (technical-design.md §Validation). */
export interface FieldCodes {
  readonly earned: EarnedCode;
  readonly total: TotalCode;
  readonly pass: PassCode;
}

export type FieldName = keyof FieldCodes;

type ErrorMessageTable = { readonly [F in FieldName]: Readonly<Record<FieldCodes[F], MessageId>> };

/** (field, code) → the one message shown under that field (M-12..M-24, technical-design.md §Validation). */
export const ERROR_MESSAGE_IDS: ErrorMessageTable = {
  earned: { NOT_NUMBER: 'M-12', NEGATIVE: 'M-13', TOO_MANY_DP: 'M-14', OVER_TOTAL: 'M-15' },
  total: { NOT_NUMBER: 'M-16', NEGATIVE: 'M-17', TOO_MANY_DP: 'M-18', ZERO: 'M-19', TOO_LARGE: 'M-20' },
  pass: { NOT_NUMBER: 'M-21', NEGATIVE: 'M-22', TOO_MANY_DP: 'M-23', TOO_LARGE: 'M-24' },
};

/** The text shown under `field` for an error `code`. */
export function errorText<F extends FieldName>(field: F, code: FieldCodes[F]): string {
  return MESSAGES[ERROR_MESSAGE_IDS[field][code]];
}

/** The error-state announcement: each field's message, then M-3 (ui-design.md §Accessibility). They are sentences. */
export function errorAnnouncementText(fieldMessages: ReadonlyArray<string>): string {
  return [...fieldMessages, MESSAGES['M-3']].join(' ');
}

/** One mark, in hundredths: the only value that takes the singular "mark" (A-11). */
const ONE_MARK = 100;

/** The gap line (M-6..M-11) for a gap, with {n} filled by `formatMarks` (A-10, A-11). */
export function gapText(gap: Gap): string {
  switch (gap.kind) {
    case 'exact':
      return MESSAGES['M-10'];
    case 'aboveTiny':
      return MESSAGES['M-11'];
    case 'short':
      return gap.h === ONE_MARK ? MESSAGES['M-7'] : MESSAGES['M-6'].replace('{n}', formatMarks(gap.h));
    case 'above':
      return gap.h === ONE_MARK ? MESSAGES['M-9'] : MESSAGES['M-8'].replace('{n}', formatMarks(gap.h));
  }
}
