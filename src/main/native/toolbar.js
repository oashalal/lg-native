/* global window, setInterval, applyGameTheme */
const buttons = ['back', 'forward', 'reload'];
document.getElementById('settings').addEventListener('click', () => void refresh('settings'))
async function refresh(action = 'status') {
  try {
    const state = await window.lgNativeToolbar.action(action);
    document.getElementById('back').disabled = !state.back;
    document.getElementById('forward').disabled = !state.forward;
    const status = document.getElementById('status');
    status.textContent = state.safeMode ? 'Патчи: безопасный режим' : `Патчи: ${state.applied}/${state.total}${state.pending ? ` · ожидание: ${state.pending}` : ''}${state.failed ? ` · ошибок: ${state.failed}` : ''}`;
    if (state.versionUnverified) status.textContent += ' · версия не проверена';
    status.title = 'Применено / включено; для runtime в основном мире показано внедрение кода';
    applyGameTheme(state.theme);
  } catch { document.getElementById('status').textContent = 'Патчи: нет данных'; }
}
for (const id of buttons) document.getElementById(id).addEventListener('click', () => void refresh(id));
void refresh();
setInterval(() => void refresh(), 3000);
