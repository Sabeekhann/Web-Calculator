import { renderResult, renderShell, type ShellElements } from './render';
import { toViewModel, type RawInputs } from './view-model';

/** Screen-reader status text is set this long after the last input, so "17.5" is read once (ui-design.md). */
const ANNOUNCE_DELAY_MS = 500;

function readInputs(shell: ShellElements): RawInputs {
  return { earned: shell.inputs.earned.value, total: shell.inputs.total.value, pass: shell.inputs.pass.value };
}

/** Debounced writer for the role="status" node; it writes only text that differs from the last one. */
function createAnnouncer(status: HTMLElement): (text: string) => void {
  let timer: number | undefined;
  let lastText = '';
  return (text) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (text === lastText) return;
      status.textContent = text;
      lastText = text;
    }, ANNOUNCE_DELAY_MS);
  };
}

/** Mounts the app into `root` and recalculates on every input event (A-7: no Calculate button). */
export function mountApp(root: HTMLElement | null): ShellElements | null {
  if (root === null) return null;
  const shell = renderShell(root);
  const announce = createAnnouncer(shell.status);

  const update = (): void => {
    const vm = toViewModel(readInputs(shell));
    renderResult(shell.resultBody, vm); // visual update is immediate
    announce(vm.announcement);
  };

  for (const input of Object.values(shell.inputs)) input.addEventListener('input', update);
  update();
  return shell;
}
