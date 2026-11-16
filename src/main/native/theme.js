/* global CSS */
/* eslint-disable @typescript-eslint/no-unused-vars */
function applyGameTheme(theme) {
  if (!theme || typeof theme !== 'object') return;
  const root = document.documentElement;
  const colors = ['--bg', '--surface', '--surface2', '--ink', '--mute', '--accent', '--accent-2', '--focus', '--line', '--gu-bg', '--gu-acc', '--gu-acc-l', '--gu-line', '--gu-fg'];
  for (const key of colors) {
    const value = theme[key];
    if (typeof value === 'string' && value && CSS.supports('color', value)) root.style.setProperty(key, value);
    else root.style.removeProperty(key);
  }
  for (const key of ['--tx', '--hd', '--mono']) {
    const value = theme[key];
    if (typeof value === 'string' && value && CSS.supports('font-family', value)) root.style.setProperty(key, value);
    else root.style.removeProperty(key);
  }
  if (typeof theme.skin === 'string' && /^[\w-]+$/.test(theme.skin)) root.dataset.skin = theme.skin;
  else delete root.dataset.skin;
}
