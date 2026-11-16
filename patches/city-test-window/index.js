/* global MutationObserver, settings */
const install = () => {
  const nav = document.querySelector('#gu-hud .gu-main');
  if (!nav || nav.querySelector('[data-lgx-city-test]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'gu-b';
  button.dataset.lgxCityTest = '';
  button.innerHTML = '<span class="gu-bi" aria-hidden="true" style="font-size:28px;color:var(--gu-acc-l)">✦</span><span class="gu-bl">Тест</span>';
  button.querySelector('.gu-bl').textContent = settings.label;
  button.addEventListener('click', () => {
    if (document.getElementById('lgx-city-test-dialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'lgx-city-test-dialog';
    dialog.setAttribute('aria-labelledby', 'lgx-city-test-title');
    dialog.style.cssText = 'max-width:min(380px,85vw);padding:24px;border:1px solid var(--gu-acc,#bd9a55);border-radius:16px;background:var(--gu-bg,#242019);color:var(--ink,#ece2cc);box-shadow:0 12px 50px #000b;font:600 15px/1.5 system-ui';
    dialog.innerHTML = '<h2 id="lgx-city-test-title" style="margin:0 0 12px;color:var(--gu-acc-l,#e4c981);font-family:var(--gu-hd,serif)">Тестовое окно</h2><p>Патч успешно добавил кнопку в интерфейс города.</p><form method="dialog"><button style="padding:8px 18px;border:1px solid var(--gu-acc,#bd9a55);border-radius:10px;background:transparent;color:inherit;cursor:pointer">Закрыть</button></form>';
    if (!settings.showMessage) dialog.querySelector('p').remove();
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    document.body.append(dialog);
    dialog.showModal();
  });
  nav.append(button);
};
const observer = new MutationObserver(install);
observer.observe(document.documentElement, { childList: true, subtree: true });
install();
