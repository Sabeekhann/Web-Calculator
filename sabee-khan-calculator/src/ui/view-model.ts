import { formatScore } from '../logic/format';
import { isPass, scoreTenths } from '../logic/score';
import { announcementText, MESSAGES, scoreText } from '../messages';
import { validateInputs, type RawFields } from '../validation/validate';

// Pure: raw field text → what the result area shows (technical-design.md §State model). No DOM.

export type RawInputs = RawFields;

export type Verdict = 'pass' | 'fail';

/** `announcement` is the status text for screen readers; '' means nothing to announce. */
export type ViewModel =
  | { readonly state: 'idle'; readonly message: string; readonly announcement: string }
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
      readonly announcement: string;
    };

// Idle is not announced (it is announced only after Next learner, S-4).
const IDLE: ViewModel = { state: 'idle', message: MESSAGES['M-1'], announcement: '' };

/** Recomputed from the three raw strings on every input event; no stored calculation state. */
export function toViewModel(raw: RawInputs): ViewModel {
  const fields = validateInputs(raw);
  // S-1 shows no score for invalid input; S-3 adds the error state, its messages and M-3.
  if (!fields.earned.ok || !fields.total.ok || !fields.pass.ok) return IDLE;

  const earned = fields.earned.value;
  const total = fields.total.value;
  if (earned === null || total === null) return IDLE;

  const score = formatScore(scoreTenths(earned, total));
  const passMark = fields.pass.value;
  if (passMark === null) {
    const verdictMessage = MESSAGES['M-2'];
    return { state: 'pass-mark-empty', score, verdictMessage, announcement: announcementText([scoreText(score), verdictMessage]) };
  }

  const verdict: Verdict = isPass(earned, total, passMark) ? 'pass' : 'fail';
  const verdictText = verdict === 'pass' ? MESSAGES['M-4'] : MESSAGES['M-5'];
  return { state: 'result', score, verdict, verdictText, announcement: announcementText([scoreText(score), verdictText]) };
}
