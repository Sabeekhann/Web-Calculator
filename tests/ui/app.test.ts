// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { mountApp } from '../../src/ui/app';

describe('app shell', () => {
  it('T-S0.1 mountApp renders the heading inside a main landmark', () => {
    const root = document.createElement('div');
    mountApp(root);
    const heading = root.querySelector('main h1');
    expect(heading?.textContent).toBe('Tip & Bill Splitter');
  });
});
