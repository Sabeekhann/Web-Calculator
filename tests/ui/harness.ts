import { expect } from 'vitest';
import { mountApp } from '../../src/ui/app';

export type Field = 'bill' | 'tip' | 'people';

export const FIELDS: Field[] = ['bill', 'tip', 'people'];

export function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  mountApp(root);
  return root;
}

function query<T extends Element>(root: HTMLElement, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing element ${selector}`);
  }
  return element;
}

export function input(root: HTMLElement, field: Field): HTMLInputElement {
  return query<HTMLInputElement>(root, `#${field}`);
}

export function message(root: HTMLElement, field: Field): HTMLElement {
  return query<HTMLElement>(root, `#${field}-msg`);
}

export function form(root: HTMLElement): HTMLFormElement {
  return query<HTMLFormElement>(root, 'form');
}

export function result(root: HTMLElement): HTMLElement {
  return query<HTMLElement>(root, '#result');
}

export function type(root: HTMLElement, field: Field, value: string): void {
  const element = input(root, field);
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
}

export function fill(root: HTMLElement, values: Record<Field, string>): void {
  for (const field of FIELDS) {
    type(root, field, values[field]);
  }
}

export function calculate(root: HTMLElement): void {
  query<HTMLButtonElement>(root, 'button[type="submit"]').click();
}

export function tipText(root: HTMLElement): string | null | undefined {
  return root.querySelector('#result #result-tip')?.textContent;
}

export function expectTipAndTotal(root: HTMLElement, tip: string, total: string): void {
  expect(tipText(root)).toBe(`Tip: ${tip}`);
  expect(totalText(root)).toBe(`Total: ${total}`);
  const lines = Array.from(result(root).children, (child) => child.id);
  expect(lines.indexOf('result-tip')).toBe(0);
  expect(lines.indexOf('result-total')).toBe(1);
}

export function totalText(root: HTMLElement): string | null | undefined {
  return root.querySelector('#result #result-total')?.textContent;
}

export function shareLines(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('#result #result-shares > li'), (item) => item.textContent ?? '');
}

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function expectShares(root: HTMLElement, amounts: string[]): void {
  const lines = shareLines(root);
  expect(lines).toHaveLength(amounts.length);
  amounts.forEach((amount, index) => {
    expect(lines[index]).toMatch(new RegExp(`^Person ${index + 1}: ${escapeRegExp(amount)}(?: |$)`));
  });
}

export function expectNoResult(root: HTMLElement): void {
  expect(result(root).childNodes).toHaveLength(0);
}

export function expectMessage(root: HTMLElement, field: Field, text: string): void {
  expect(message(root, field).textContent).toBe(text);
  expect(input(root, field).getAttribute('aria-invalid')).toBe('true');
}

export function expectNoMessage(root: HTMLElement, field: Field): void {
  expect(message(root, field).textContent).toBe('');
  expect(input(root, field).hasAttribute('aria-invalid')).toBe(false);
}
