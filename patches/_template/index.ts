/* Copy the compiled JavaScript to index.js before running the app. */
declare const LGX: {
  settings(id: string): Record<string, unknown>;
  onCleanup(cleanup: () => void): () => void;
};
const install = (): void => {
  const host = document.querySelector('#gu-hud .gu-main');
  if (!host || host.querySelector('[data-my-patch]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'gu-b';
  button.dataset.myPatch = '';
  button.textContent = String(LGX.settings('my-patch').label ?? 'Мой патч');
  host.append(button);
};

const observer = new MutationObserver(install);
observer.observe(document.documentElement, { childList: true, subtree: true });
install();
LGX.onCleanup(() => observer.disconnect());
