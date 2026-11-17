/* global window, setInterval, applyGameTheme, confirm */
const buttons = ['back', 'forward', 'reload'];
let state;
let refreshPromise;
let menuAction;
let revision = 0;
let busy = false;
const $ = (id) => document.getElementById(id);
$('settings').addEventListener('click', () => void refresh('settings'));
$('new-tab').addEventListener('click', () => void tabAction('new-temp'));
$('account').addEventListener('click', () => toggleMenu());
$('menu-new').addEventListener('click', () => void tabAction('new-temp'));
$('menu-save').addEventListener('click', () => showForm('save-current-profile'));
$('menu-rename').addEventListener('click', () => showForm('rename-profile'));
$('menu-delete').addEventListener('click', () => {
  const profile = activeProfile();
  if (profile && confirm(`Удалить профиль «${profile.name}» и закрыть ${profile.tabCount} вкладок?`)) void tabAction('delete-profile', profile.id);
});
$('profile-form').addEventListener('submit', (event) => { event.preventDefault(); const name = $('profile-name').value.trim(); if (!name || name.length > 63) { $('profile-error').textContent = 'Введите имя длиной от 1 до 63 символов'; return; } void tabAction(menuAction, menuAction === 'rename-profile' ? activeProfile()?.id : undefined, name); });
$('profile-cancel').addEventListener('click', hideForm);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { hideForm(); closeMenu(); } });
document.addEventListener('click', (event) => { if (!event.target.closest('#account-menu, #account')) closeMenu(); });
function toggleMenu() { if ($('account-menu').hidden) { $('account-menu').hidden = false; $('account').setAttribute('aria-expanded', 'true'); void window.lgNativeToolbar.tabs('menu-open', undefined, undefined, 450); } else closeMenu(); }
function closeMenu() { if ($('account-menu').hidden) return; $('account-menu').hidden = true; $('account').setAttribute('aria-expanded', 'false'); hideForm(); void window.lgNativeToolbar.tabs('menu-close'); }
function showForm(action) { menuAction = action; $('profile-form').hidden = false; $('profile-name').value = ''; $('profile-error').textContent = ''; $('profile-name').focus(); }
function hideForm() { $('profile-form').hidden = true; }
function activeProfile() { return state?.profiles?.find((profile) => profile.active) || state?.profiles?.find((profile) => profile.id === state?.activeProfileId); }
async function tabAction(action, value, name) {
  if (busy) return;
  busy = true; revision++;
  try { const result = await window.lgNativeToolbar.tabs(action, value, name); if (result?.state) state = result.state; hideForm(); renderState(state); } catch (error) { $('profile-error').textContent = error.message || 'Ошибка операции'; $('status').textContent = `Вкладки: ${error.message || 'ошибка'}`; } finally { busy = false; revision++; }
}
function renderTabs(tabs) {
  const root = $('tabs'); root.textContent = '';
  for (const tab of tabs || []) {
    const wrapper = document.createElement('div'); wrapper.className = 'tab'; wrapper.dataset.active = String(Boolean(tab.active)); wrapper.dataset.status = tab.status || 'ready';
    const button = document.createElement('button'); button.className = 'tab-label'; button.type = 'button'; button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', String(Boolean(tab.active))); button.title = tab.error || tab.name; button.textContent = tab.name;
    const close = document.createElement('button'); close.className = 'tab-close'; close.type = 'button'; close.textContent = '×'; close.title = 'Закрыть вкладку'; close.setAttribute('aria-label', `Закрыть ${tab.name}`); close.addEventListener('click', (event) => { event.stopPropagation(); void tabAction('close', tab.id); });
    button.addEventListener('click', () => void tabAction('activate', tab.id)); wrapper.append(button, close); root.append(wrapper);
  }
}
function renderProfiles(profiles) {
  const root = $('profile-list'); root.textContent = '';
  for (const profile of profiles || []) { const button = document.createElement('button'); button.type = 'button'; button.className = 'profile-item'; button.textContent = `${profile.active ? '● ' : ''}${profile.name}${profile.saved ? '' : ' (временный)'}`; button.title = profile.name; button.disabled = !profile.saved; button.addEventListener('click', () => void tabAction('new', profile.id)); root.append(button); }
  const profile = activeProfile(); $('menu-save').hidden = !profile || profile.saved; $('menu-rename').hidden = !profile || !profile.saved; $('menu-delete').hidden = !profile;
}
function renderState(next) { if (!next) return; renderTabs(next.tabs); renderProfiles(next.profiles); }
async function refresh(action = 'status') {
  if (refreshPromise) return refreshPromise;
  const currentRevision = revision;
  refreshPromise = window.lgNativeToolbar.action(action).then((next) => { if (busy || currentRevision !== revision) return; state = next; $('back').disabled = !next.back; $('forward').disabled = !next.forward; const status = $('status'); status.textContent = next.safeMode ? 'Патчи: безопасный режим' : `Патчи: ${next.applied}/${next.total}${next.pending ? ` · ожидание: ${next.pending}` : ''}${next.failed ? ` · ошибок: ${next.failed}` : ''}`; if (next.versionUnverified) status.textContent += ' · версия не проверена'; status.title = 'Применено / включено'; applyGameTheme(next.theme); renderState(next); }).catch(() => { $('status').textContent = 'Патчи: нет данных'; }).finally(() => { refreshPromise = undefined; });
  return refreshPromise;
}
for (const id of buttons) $(id).addEventListener('click', () => void refresh(id));
void refresh();
setInterval(() => void refresh(), 3000);
