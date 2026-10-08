/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import { MESSAGES, type MessageId } from './src/messages';

/** Replaces %M-n% placeholders in index.html with catalogue text, so messages.ts stays the single source. */
function catalogueHtml(): Plugin {
  return {
    name: 'catalogue-html',
    transformIndexHtml(html) {
      return html.replace(/%(M-\d+)%/g, (placeholder, id: string) => {
        if (!(id in MESSAGES)) throw new Error(`index.html: unknown message ${placeholder}`);
        return escapeHtml(MESSAGES[id as MessageId]);
      });
    },
  };
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ADR-008: relative base so the same build works from `vite preview` and any GitHub Pages sub-path.
export default defineConfig({
  base: './',
  plugins: [catalogueHtml()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  // ADR-005: Vitest runs pure modules only, in the node environment.
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
