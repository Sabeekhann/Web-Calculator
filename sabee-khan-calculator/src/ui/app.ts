import { renderShell, type ShellElements } from './render';

/** Mounts the app into `root`. Sprint 0: static shell only; behaviour arrives with S-1..S-4. */
export function mountApp(root: HTMLElement | null): ShellElements | null {
  if (root === null) return null;
  return renderShell(root);
}
