import { ESC_KEY_LABEL, MESSAGES, SCORE_UNIT } from '../messages';
import { el, svgEl } from './dom';
import type { GapKind, Verdict, ViewModel } from './view-model';

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

/** A muted message in the result body, e.g. the idle prompt M-1; no score. */
function resultMessage(text: string): HTMLParagraphElement {
  return el('p', { class: 'result-msg' }, [text]);
}

/** Tick (Pass) and cross (Fail) glyphs from the mockup, drawn on a 24 × 24 grid. */
const VERDICT_GLYPHS: Readonly<Record<Verdict, string>> = {
  pass: 'M6.5 12.5l3.8 3.8 7.4-8.3',
  fail: 'M8 8l8 8M16 8l-8 8',
};

/** Score "76.0" with the half-size muted "%" unit. */
function scoreNode(score: string): HTMLParagraphElement {
  return el('p', { class: 'score' }, [score, el('span', { class: 'score-unit' }, [SCORE_UNIT])]);
}

/** Verdict block: decorative tick/cross disc + the word, so the verdict never relies on colour alone. */
function verdictNode(verdict: Verdict, text: string): HTMLParagraphElement {
  const glyph = svgEl('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' }, [
    svgEl('path', { class: 'i-stroke', d: VERDICT_GLYPHS[verdict] }),
  ]);
  return el('p', { class: `verdict verdict--${verdict}` }, [
    el('span', { class: 'verdict-disc' }, [glyph]),
    el('span', {}, [text]),
  ]);
}

/** Gap-line arrows from the mockup on a 16 × 16 grid: ▲ above, ▼ short, "=" exactly on. */
const GAP_ICONS: Readonly<Record<GapKind, { readonly tone: Verdict; readonly path: string }>> = {
  above: { tone: 'pass', path: 'M8 3.5l5 7H3z' },
  aboveTiny: { tone: 'pass', path: 'M8 3.5l5 7H3z' },
  exact: { tone: 'pass', path: 'M3 5.5h10v2H3zM3 9.5h10v2H3z' },
  short: { tone: 'fail', path: 'M8 12.5l5-7H3z' },
};

/** Gap line: decorative arrow + the words, which carry the meaning (never colour alone). */
function gapNode(kind: GapKind, text: string): HTMLParagraphElement {
  const icon = GAP_ICONS[kind];
  const glyph = svgEl(
    'svg',
    { class: `gap-icon gap-icon--${icon.tone}`, viewBox: '0 0 16 16', 'aria-hidden': 'true', focusable: 'false' },
    [svgEl('path', { d: icon.path })],
  );
  return el('p', { class: 'gap' }, [glyph, el('span', {}, [text])]);
}

/** Renders the result body for a view model. Displays only; never calculates. */
export function renderResult(resultBody: HTMLElement, vm: ViewModel): void {
  switch (vm.state) {
    case 'idle':
      resultBody.replaceChildren(resultMessage(vm.message));
      return;
    case 'pass-mark-empty':
      resultBody.replaceChildren(
        el('div', { class: 'outcome' }, [scoreNode(vm.score), el('p', { class: 'verdict-msg' }, [vm.verdictMessage])]),
      );
      return;
    case 'result':
      resultBody.replaceChildren(
        el('div', { class: 'outcome' }, [
          scoreNode(vm.score),
          verdictNode(vm.verdict, vm.verdictText),
          gapNode(vm.gapKind, vm.gapText),
        ]),
      );
      return;
  }
}

/** Builds the static card once from messages.ts and mounts it into `root`. Never calculates. */
export function renderShell(root: HTMLElement): ShellElements {
  const inputs = { earned: createInput('earned'), total: createInput('total'), pass: createInput('pass') };
  const errors = { earned: createErrorSlot('earned'), total: createErrorSlot('total'), pass: createErrorSlot('pass') };

  const resultBody = el('div', { class: 'result-body' }, [resultMessage(MESSAGES['M-1'])]);
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
