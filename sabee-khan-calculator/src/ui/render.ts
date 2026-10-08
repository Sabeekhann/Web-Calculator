import { ESC_KEY_LABEL, MESSAGES } from '../messages';
import { el } from './dom';

export type FieldName = 'earned' | 'total' | 'pass';

export interface ShellElements {
  readonly inputs: Readonly<Record<FieldName, HTMLInputElement>>;
  readonly errors: Readonly<Record<FieldName, HTMLParagraphElement>>;
  readonly resultBody: HTMLDivElement;
  readonly status: HTMLDivElement;
  readonly nextLearner: HTMLButtonElement;
}

/** Initial values on load and after reload (technical-design.md §State model). */
export const INITIAL_VALUES: Readonly<Record<FieldName, string>> = { earned: '', total: '', pass: '70' };

const FIELD_IDS: Readonly<Record<FieldName, string>> = { earned: 'earned', total: 'total', pass: 'pass-mark' };

function createInput(field: FieldName): HTMLInputElement {
  const input = el('input', {
    class: 'input',
    id: FIELD_IDS[field],
    name: field,
    type: 'text',
    inputmode: 'decimal',
    autocomplete: 'off',
    spellcheck: 'false',
    'aria-describedby': `${FIELD_IDS[field]}-error`,
  });
  input.value = INITIAL_VALUES[field];
  return input;
}

function createErrorSlot(field: FieldName): HTMLParagraphElement {
  return el('p', { class: 'field-error', id: `${FIELD_IDS[field]}-error` });
}

function createField(
  field: FieldName,
  labelChildren: ReadonlyArray<Node | string>,
  input: HTMLInputElement,
  error: HTMLParagraphElement,
): HTMLDivElement {
  const control =
    field === 'pass'
      ? el('div', { class: 'input-wrap' }, [input, el('span', { class: 'suffix', 'aria-hidden': 'true' }, [MESSAGES['M-38']])])
      : input;
  return el('div', { class: `field field--${field}` }, [
    el('label', { class: 'label', for: FIELD_IDS[field] }, labelChildren),
    control,
    error,
  ]);
}

/** The idle result body: M-1 in muted text, no score. */
export function idleResult(): HTMLParagraphElement {
  return el('p', { class: 'result-msg' }, [MESSAGES['M-1']]);
}

/** Builds the static card once from messages.ts and mounts it into `root`. Never calculates. */
export function renderShell(root: HTMLElement): ShellElements {
  const inputs = { earned: createInput('earned'), total: createInput('total'), pass: createInput('pass') };
  const errors = { earned: createErrorSlot('earned'), total: createErrorSlot('total'), pass: createErrorSlot('pass') };

  const resultBody = el('div', { class: 'result-body' }, [idleResult()]);
  const status = el('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
  const nextLearner = el('button', { class: 'btn', type: 'button', 'aria-keyshortcuts': 'Escape' }, [MESSAGES['M-25']]);

  const hintLead = MESSAGES['M-40'].slice(0, -ESC_KEY_LABEL.length);

  const card = el('article', { class: 'card', 'aria-labelledby': 'card-title' }, [
    el('header', { class: 'card-head' }, [
      el('p', { class: 'eyebrow' }, [MESSAGES['M-31']]),
      el('h1', { class: 'title', id: 'card-title' }, [MESSAGES['M-32']]),
      el('p', { class: 'sub' }, [MESSAGES['M-33']]),
    ]),
    el('div', { class: 'fields' }, [
      createField('earned', [MESSAGES['M-34']], inputs.earned, errors.earned),
      createField('total', [MESSAGES['M-35']], inputs.total, errors.total),
      createField('pass', [MESSAGES['M-36'], el('span', { class: 'sr-only' }, [MESSAGES['M-37']])], inputs.pass, errors.pass),
    ]),
    el('hr', { class: 'rule' }),
    el('section', { class: 'result', 'aria-labelledby': 'score-label' }, [
      el('p', { class: 'eyebrow', id: 'score-label' }, [MESSAGES['M-39']]),
      resultBody,
      status,
    ]),
    el('div', { class: 'actions' }, [
      nextLearner,
      el('span', { class: 'hint' }, [hintLead, el('kbd', {}, [ESC_KEY_LABEL])]),
    ]),
  ]);

  root.replaceChildren(el('main', { class: 'app' }, [card]));
  return { inputs, errors, resultBody, status, nextLearner };
}
