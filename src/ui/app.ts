const TITLE = 'Tip & Bill Splitter';
const INTRO = 'Split a bill and tip fairly between friends.';

function createTextElement<K extends keyof HTMLElementTagNameMap>(tag: K, text: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

export function mountApp(root: HTMLElement): void {
  const main = document.createElement('main');
  main.append(createTextElement('h1', TITLE), createTextElement('p', INTRO));
  root.replaceChildren(main);
}
