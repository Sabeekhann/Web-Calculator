import { calculateSplit } from '../logic/split';
import { MESSAGES, type MessageId } from '../messages';
import type { Result } from '../result';
import type { FieldErrors, RawInputs, SplitResult } from '../types';
import { validateInputs } from '../validation/form';
import { parseMoney, parsePeople, parsePercent } from '../validation/parse';
import { formatAmount, formatShareLine } from './format';

type FieldName = keyof RawInputs;

type FieldConfig = {
  label: string;
  inputMode: 'decimal' | 'numeric';
  initialValue: string;
  parse: (raw: string) => Result<number, unknown>;
  hint?: MessageId;
};

type Field = { wrapper: HTMLDivElement; input: HTMLInputElement; message: HTMLParagraphElement };

const TITLE = 'Tip & Bill Splitter';
const INTRO = 'Split a bill and tip fairly between friends.';
const CALCULATE_LABEL = 'Calculate';
const TIP_LABEL = 'Tip: ';
const TOTAL_LABEL = 'Total: ';

const FIELD_NAMES: FieldName[] = ['bill', 'tip', 'people'];

const FIELD_CONFIGS: Record<FieldName, FieldConfig> = {
  bill: { label: 'Bill', inputMode: 'decimal', initialValue: '', parse: parseMoney },
  tip: { label: 'Tip %', inputMode: 'decimal', initialValue: '0', parse: parsePercent, hint: 'H-TIP-HINT' },
  people: { label: 'People', inputMode: 'numeric', initialValue: '', parse: parsePeople },
};

function createTextElement<K extends keyof HTMLElementTagNameMap>(tag: K, text: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function createHint(name: FieldName, hint: MessageId): HTMLParagraphElement {
  const element = createTextElement('p', MESSAGES[hint]);
  element.id = `${name}-hint`;
  element.className = 'hint';
  return element;
}

function createField(name: FieldName): Field {
  const config = FIELD_CONFIGS[name];
  const messageId = `${name}-msg`;
  const hints = config.hint ? [createHint(name, config.hint)] : [];

  const label = createTextElement('label', config.label);
  label.htmlFor = name;

  const input = document.createElement('input');
  input.id = name;
  input.name = name;
  input.type = 'text';
  input.inputMode = config.inputMode;
  input.value = config.initialValue;
  input.setAttribute('aria-describedby', [...hints.map((hint) => hint.id), messageId].join(' '));

  const message = document.createElement('p');
  message.id = messageId;
  message.className = 'message';
  message.setAttribute('aria-live', 'polite');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.append(label, input, ...hints, message);
  return { wrapper, input, message };
}

function showMessage(field: Field, text: string): void {
  field.message.textContent = text;
  field.input.setAttribute('aria-invalid', 'true');
}

function clearMessage(field: Field): void {
  field.message.textContent = '';
  field.input.removeAttribute('aria-invalid');
}

function showFieldErrors(fields: Record<FieldName, Field>, errors: FieldErrors): void {
  for (const name of FIELD_NAMES) {
    const messageId = errors[name];
    if (messageId) {
      showMessage(fields[name], MESSAGES[messageId]);
    } else {
      clearMessage(fields[name]);
    }
  }
}

function renderResult(region: HTMLElement, result: SplitResult): void {
  const tip = createTextElement('p', `${TIP_LABEL}${formatAmount(result.tipCents)}`);
  tip.id = 'result-tip';
  const total = createTextElement('p', `${TOTAL_LABEL}${formatAmount(result.totalCents)}`);
  total.id = 'result-total';
  const shares = document.createElement('ol');
  shares.id = 'result-shares';
  shares.append(...result.shares.map((share, index) => createTextElement('li', formatShareLine(index, share))));
  region.replaceChildren(tip, total, shares);
}

function clearResult(region: HTMLElement): void {
  region.replaceChildren();
}

export function mountApp(root: HTMLElement): void {
  const fields: Record<FieldName, Field> = {
    bill: createField('bill'),
    tip: createField('tip'),
    people: createField('people'),
  };

  const button = createTextElement('button', CALCULATE_LABEL);
  button.type = 'submit';

  const form = document.createElement('form');
  form.noValidate = true;
  form.setAttribute('autocomplete', 'off');
  form.append(...FIELD_NAMES.map((name) => fields[name].wrapper), button);

  const resultRegion = document.createElement('div');
  resultRegion.id = 'result';
  resultRegion.className = 'result';
  resultRegion.setAttribute('aria-live', 'polite');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const validation = validateInputs({
      bill: fields.bill.input.value,
      tip: fields.tip.input.value,
      people: fields.people.input.value,
    });
    if (validation.ok) {
      showFieldErrors(fields, {});
      renderResult(resultRegion, calculateSplit(validation.value));
    } else {
      showFieldErrors(fields, validation.error);
      clearResult(resultRegion);
    }
  });

  for (const name of FIELD_NAMES) {
    const field = fields[name];
    field.input.addEventListener('input', () => {
      clearResult(resultRegion);
      if (FIELD_CONFIGS[name].parse(field.input.value).ok) {
        clearMessage(field);
      }
    });
  }

  const main = document.createElement('main');
  main.append(createTextElement('h1', TITLE), createTextElement('p', INTRO), form, resultRegion);
  root.replaceChildren(main);
}
