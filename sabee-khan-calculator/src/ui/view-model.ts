import { formatScore } from '../logic/format';
import { gap, type Gap } from '../logic/gap';
import { isPass, scoreTenths } from '../logic/score';
import { announcementText, errorAnnouncementText, errorText, gapText, MESSAGES, scoreText, type FieldName } from '../messages';
import { validateInputs, type RawFields, type ValidatedFields } from '../validation/validate';

// Pure: raw field text → what the result area shows (technical-design.md §State model). No DOM.

export type RawInputs = RawFields;

export type Verdict = 'pass' | 'fail';

export type GapKind = Gap['kind'];

/** The message under each field; `null` = no message (the slot stays empty). */
export type FieldErrors = { readonly [F in FieldName]: string | null };

/** `announcement` is the status text for screen readers; '' means nothing to announce. */
export type ViewModel = { readonly fieldErrors: FieldErrors } & (
  | { readonly state: 'idle'; readonly message: string; readonly announcement: string }
  | { readonly state: 'error'; readonly message: string; readonly announcement: string }
  | {
      readonly state: 'pass-mark-empty';
      readonly score: string;
      readonly verdictMessage: string;
      readonly announcement: string;
    }
  | {
      readonly state: 'result';
      readonly score: string;
      readonly verdict: Verdict;
      readonly verdictText: string;
      readonly gapKind: GapKind;
      readonly gapText: string;
      readonly announcement: string;
    }
);

const NO_ERRORS: FieldErrors = { earned: null, total: null, pass: null };

// Idle is not announced (it is announced only after Next learner, S-4).
const IDLE: ViewModel = { state: 'idle', message: MESSAGES['M-1'], announcement: '', fieldErrors: NO_ERRORS };

/** Each field's own message (A-15: at most one per field), or null when that field is valid or empty. */
function fieldErrorsOf(fields: ValidatedFields): FieldErrors {
  return {
    earned: fields.earned.ok ? null : errorText('earned', fields.earned.code),
    total: fields.total.ok ? null : errorText('total', fields.total.code),
    pass: fields.pass.ok ? null : errorText('pass', fields.pass.code),
  };
}

/** Error state (A-16): M-3 instead of any score, verdict or gap; announced as each message, then M-3. */
function errorState(fieldErrors: FieldErrors): ViewModel {
  const messages = [fieldErrors.earned, fieldErrors.total, fieldErrors.pass].filter((text): text is string => text !== null);
  return { state: 'error', message: MESSAGES['M-3'], announcement: errorAnnouncementText(messages), fieldErrors };
}

/** Recomputed from the three raw strings on every input event; no stored calculation state. */
export function toViewModel(raw: RawInputs): ViewModel {
  const fields = validateInputs(raw);
  if (!fields.earned.ok || !fields.total.ok || !fields.pass.ok) return errorState(fieldErrorsOf(fields));

  const earned = fields.earned.value;
  const total = fields.total.value;
  if (earned === null || total === null) return IDLE;

  const score = formatScore(scoreTenths(earned, total));
  const passMark = fields.pass.value;
  if (passMark === null) {
    const verdictMessage = MESSAGES['M-2'];
    return {
      state: 'pass-mark-empty',
      score,
      verdictMessage,
      announcement: announcementText([scoreText(score), verdictMessage]),
      fieldErrors: NO_ERRORS,
    };
  }

  const verdict: Verdict = isPass(earned, total, passMark) ? 'pass' : 'fail';
  const verdictText = verdict === 'pass' ? MESSAGES['M-4'] : MESSAGES['M-5'];
  const marksGap = gap(earned, total, passMark);
  const gapLine = gapText(marksGap);
  return {
    state: 'result',
    score,
    verdict,
    verdictText,
    gapKind: marksGap.kind,
    gapText: gapLine,
    announcement: announcementText([scoreText(score), verdictText, gapLine]),
    fieldErrors: NO_ERRORS,
  };
}
