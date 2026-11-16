

















(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LGEmblems = api;
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';
  const hx = (c) => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const tone = (c, k) => '#' + hx(c).map((v) => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))).toString(16).padStart(2, '0')).join('');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const IDS = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'];
  const ICONS = ['daily', 'gift', 'hall', 'members', 'requests', 'war', 'log', 'manage', 'crown', 'lead', 'trusted', 'novice', 'create', 'search', 'invite', 'leave', 'main', 'run', 'gather'];

  

  const S = {};


  S.legion = {
    ink: '#1d1520',
    frame: (f, O, INK) => `<path d="M10 8 L54 8 Q57 8 57 11 L57 30 Q57 47 32 58 Q7 47 7 30 L7 11 Q7 8 10 8 Z" fill="${f}" ${O(3)}/>`
      + `<path d="M13 12.5 L51 12.5 L52.5 14 L52.5 30 Q52.5 43.5 32 53 Q11.5 43.5 11.5 30 L11.5 14 Z" fill="none" stroke="${tone(f, 0.28)}" stroke-width="1.8" stroke-linejoin="round"/>`
      + `<path d="M10 9.5 L54 9.5 L55.5 11 L55.5 14 L8.5 14 L8.5 11 Z" fill="${tone(f, 0.18)}" opacity=".7"/>`,
    tile: { bg: '#f3e2b3', edge: '#b8893a', shape: 'shield' },
    pal: { a: '#c9952e', b: '#8c1f2b', c: '#2f4a8a', l: '#fff3d6' },
    list: [
      ['Волк', '#2f4a8a', '#c9ced8', (c, O, I) => `<path d="M19 44 L20 30 L17 19 L25 24 L30 21 L33 14 L37 22 L44 25 L50 31 L47 34 L40 34 L38 39 L33 45 Z" fill="${c}" ${O()}/><path d="M33 14 L37 22 L33 22 Z" fill="${tone(c, -0.3)}" ${O(1.8)}/><circle cx="37.5" cy="27.5" r="1.8" fill="${I}"/><path d="M47 31.5 L50 31" ${O(2.2)}/><path d="M24 30 L28 33 L26 38" fill="none" stroke="${tone(c, 0.45)}" stroke-width="2.2" stroke-linecap="round"/>`],
      ['Лев', '#8c1f2b', '#f2b632', (c, O, I) => `<path d="M32 13 L37 17 L43 15 L44 21 L50 24 L47 30 L51 35 L45 38 L45 44 L38 43 L32 48 L26 43 L19 44 L19 38 L13 35 L17 30 L14 24 L20 21 L21 15 L27 17 Z" fill="${tone(c, -0.25)}" ${O()}/><circle cx="32" cy="31" r="10" fill="${c}" ${O()}/><circle cx="28.3" cy="29" r="1.6" fill="${I}"/><circle cx="35.7" cy="29" r="1.6" fill="${I}"/><path d="M29.5 34 L34.5 34 L32 36.5 Z" fill="${I}"/><path d="M32 36.5 L32 38.5 M29 39 Q32 41 35 39" fill="none" ${O(1.8)}/>`],
      ['Дракон', '#1f5e3a', '#e24c3b', (c, O, I) => `<path d="M16 40 L22 28 L20 18 L27 24 L33 20 L40 23 L47 27 L46 32 L38 33 L35 38 L28 41 L22 46 Z" fill="${c}" ${O()}/><path d="M33 20 L36 12 L38 22" fill="${tone(c, 0.35)}" ${O(2)}/><circle cx="36" cy="27" r="1.7" fill="${I}"/><path d="M46 32 Q52 32 54 28 Q51 34 54 37 Q49 36 46 34" fill="#ffb03b" ${O(1.8)}/><path d="M24 32 L28 34 M26 37 L30 38" fill="none" stroke="${tone(c, -0.35)}" stroke-width="2" stroke-linecap="round"/>`],
      ['Ворон', '#d9c9a3', '#3a3550', (c, O) => `<path d="M14 36 Q20 26 30 27 L36 21 L44 20 L50 23 L44 25 Q42 31 37 34 L33 42 L28 46 L29 38 L22 40 Z" fill="${c}" ${O()}/><path d="M30 27 Q24 18 18 16 Q22 24 22 31" fill="${tone(c, 0.3)}" ${O(2)}/><circle cx="42" cy="22.8" r="1.5" fill="#fff"/><path d="M44 25 L50 23" ${O(2)}/>`],
      ['Меч', '#5a2a6e', '#d8dde6', (c, O) => `<path d="M29 13 L35 13 L35 16 L29 16 Z" fill="#c9952e" ${O(2)}/><path d="M30 16 L34 16 L34 22 L30 22 Z" fill="#7a4a2a" ${O(2)}/><path d="M21 22 L43 22 L43 26 L21 26 Z" fill="#e0b245" ${O(2.2)}/><path d="M29 26 L35 26 L35 44 L32 50 L29 44 Z" fill="${c}" ${O(2.2)}/><path d="M32 28 L32 45" stroke="${tone(c, 0.55)}" stroke-width="2" stroke-linecap="round"/>`],
      ['Корона', '#1d3557', '#f4c542', (c, O) => `<path d="M16 40 L14 22 L23 30 L32 17 L41 30 L50 22 L48 40 Z" fill="${c}" ${O()}/><path d="M16 40 L48 40 L48 46 L16 46 Z" fill="${tone(c, -0.2)}" ${O()}/><circle cx="32" cy="43" r="2" fill="#e8434b" ${O(1.5)}/><circle cx="23" cy="43" r="1.6" fill="#3fa7e8" ${O(1.4)}/><circle cx="41" cy="43" r="1.6" fill="#3fa7e8" ${O(1.4)}/><circle cx="14" cy="22" r="2.2" fill="${tone(c, 0.4)}" ${O(1.6)}/><circle cx="32" cy="17" r="2.2" fill="${tone(c, 0.4)}" ${O(1.6)}/><circle cx="50" cy="22" r="2.2" fill="${tone(c, 0.4)}" ${O(1.6)}/>`],
      ['Дуб', '#e9dcb5', '#3f8a3a', (c, O) => `<path d="M29 36 L35 36 L36 48 L28 48 Z" fill="#8a5a33" ${O(2.2)}/><path d="M32 13 Q39 13 41 19 Q48 19 48 26 Q51 32 45 36 Q42 41 35 39 Q32 42 29 39 Q22 41 19 36 Q13 32 16 26 Q16 19 23 19 Q25 13 32 13 Z" fill="${c}" ${O()}/><path d="M25 26 Q28 29 27 33 M36 22 Q38 26 41 27" fill="none" stroke="${tone(c, 0.4)}" stroke-width="2" stroke-linecap="round"/>`],
      ['Башня', '#b5532b', '#efe3c8', (c, O, I) => `<path d="M20 17 L25 17 L25 20 L29.5 20 L29.5 17 L34.5 17 L34.5 20 L39 20 L39 17 L44 17 L44 26 L41 28 L41 46 L23 46 L23 28 L20 26 Z" fill="${c}" ${O()}/><path d="M28 46 L28 39 Q32 34 36 39 L36 46" fill="${I}"/><path d="M30 28 L34 28 L34 32 L30 32 Z" fill="${I}"/><path d="M23 28 L41 28" ${O(2)}/><path d="M26 35 L26 42" stroke="${tone(c, 0.4)}" stroke-width="2" stroke-linecap="round"/>`],
      ['Молот', '#3c3f46', '#e08a3c', (c, O) => `<path d="M30 30 L35 30 L39 48 L34 49 Z" fill="#8a5a33" ${O(2.2)}/><path d="M18 18 L44 14 L46 26 L20 30 Z" fill="${c}" ${O()}/><path d="M21 21 L43 17.5" stroke="${tone(c, 0.45)}" stroke-width="2" stroke-linecap="round"/><path d="M28 17 L30 28.5" ${O(1.8)}/>`],
      ['Роза', '#f1e6ee', '#c8264a', (c, O) => `<path d="M32 36 Q31 42 33 49" fill="none" stroke="#3f8a3a" stroke-width="3.2" stroke-linecap="round"/><path d="M32 42 Q24 38 21 43 Q27 46 32 43" fill="#5cb04f" ${O(1.8)}/><path d="M33 45 Q40 41 43 45 Q38 49 33 46" fill="#5cb04f" ${O(1.8)}/><path d="M32 14 Q41 14 43 22 Q45 31 37 35 Q32 38 27 35 Q19 31 21 22 Q23 14 32 14 Z" fill="${c}" ${O()}/><path d="M32 20 Q38 21 37 27 Q35 31 31 30 Q27 28 29 24" fill="none" stroke="${tone(c, -0.35)}" stroke-width="2.2" stroke-linecap="round"/>`],
    ],
  };


  S.cats = {
    ink: '#4a2f22',
    frame: (f, O) => `<path d="M12 18 L10 4 L22 11 Q32 8 42 11 L54 4 L52 18 Q58 26 57 36 Q54 56 32 59 Q10 56 7 36 Q6 26 12 18 Z" fill="${f}" ${O(3)}/>`
      + `<path d="M13.5 9.5 L20 13.5 L15 17 Z M50.5 9.5 L44 13.5 L49 17 Z" fill="#ffb3c4"/>`
      + `<path d="M14 22 Q10 30 12 38 Q16 52 32 54 Q48 52 52 38 Q54 30 50 22" fill="none" stroke="${tone(f, 0.35)}" stroke-width="1.8" stroke-linecap="round"/>`,
    tile: { bg: '#fff1e0', edge: '#e88aa0', shape: 'blob' },
    pal: { a: '#ff8fa3', b: '#f2a64a', c: '#8a5a3c', l: '#fffaf2' },
    list: [
      ['Лапка', '#ff8fa3', '#fff6ee', (c, O) => `<ellipse cx="32" cy="38" rx="10" ry="8.5" fill="${c}" ${O()}/>${[[20, 27], [27, 21], [37, 21], [44, 27]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.4" ry="5.2" fill="${c}" ${O(2.2)}/>`).join('')}<ellipse cx="32" cy="39" rx="5" ry="3.6" fill="#ffb3c4"/>`],
      ['Клубок', '#7d9cd6', '#e8455c', (c, O) => `<circle cx="31" cy="33" r="13" fill="${c}" ${O()}/><path d="M20 27 Q31 33 42 27 M19 35 Q31 42 43 34 M25 21 Q33 33 27 45 M36 21 Q30 33 38 45" fill="none" stroke="${tone(c, -0.35)}" stroke-width="2" stroke-linecap="round"/><path d="M43 39 Q50 44 47 50 Q44 54 50 56" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`],
      ['Рыбка', '#8fd3e8', '#f2a64a', (c, O, I) => `<path d="M14 32 Q24 20 38 26 L48 19 L46 32 L48 45 L38 38 Q24 44 14 32 Z" fill="${c}" ${O()}/><circle cx="21" cy="30" r="1.8" fill="${I}"/><path d="M27 27 Q30 32 27 37 M32 27 Q35 32 32 37" fill="none" stroke="${tone(c, -0.3)}" stroke-width="1.8" stroke-linecap="round"/>`],
      ['Мордочка', '#f6d7a8', '#f2a64a', (c, O, I) => `<path d="M16 26 L15 13 L24 20 Q32 17 40 20 L49 13 L48 26 Q52 34 47 41 Q40 48 32 48 Q24 48 17 41 Q12 34 16 26 Z" fill="${c}" ${O()}/><path d="M26 24 L28 27 M38 24 L36 27 M32 21 L32 25" stroke="${tone(c, -0.35)}" stroke-width="2" stroke-linecap="round"/><ellipse cx="26" cy="32" rx="2" ry="2.8" fill="${I}"/><ellipse cx="38" cy="32" rx="2" ry="2.8" fill="${I}"/><path d="M30 37 L34 37 L32 39 Z" fill="#e8455c"/><path d="M32 39 Q29 42 27 40 M32 39 Q35 42 37 40 M14 36 L23 37 M14 40 L23 39 M50 36 L41 37 M50 40 L41 39" fill="none" ${O(1.5)}/>`],
      ['Мышка', '#e9dcc8', '#9a9aa8', (c, O, I) => `<path d="M14 40 Q16 28 30 27 Q42 27 46 36 L50 38 L46 41 Q40 44 26 44 Q16 44 14 40 Z" fill="${c}" ${O()}/><circle cx="29" cy="25" r="5" fill="${c}" ${O(2.2)}/><circle cx="29" cy="25" r="2.4" fill="#ffb3c4"/><circle cx="43" cy="35" r="1.6" fill="${I}"/><path d="M14 40 Q8 40 9 33 Q10 28 6 26" fill="none" ${O(2.2)}/>`],
      ['Миска', '#ffd6e0', '#7d9cd6', (c, O) => `<path d="M14 32 L50 32 Q48 47 32 47 Q16 47 14 32 Z" fill="${c}" ${O()}/><ellipse cx="32" cy="32" rx="18" ry="4" fill="#fffaf2" ${O(2.2)}/><path d="M24 40 q2 -2 4 0 q2 2 4 0 q2 -2 4 0" fill="none" stroke="${tone(c, 0.5)}" stroke-width="2" stroke-linecap="round"/><path d="M28 24 q0 -4 3 -6 M35 25 q0 -4 3 -6" fill="none" stroke="#fffaf2" stroke-width="2" stroke-linecap="round"/>`],
      ['Колокольчик', '#b5e3b0', '#f4c542', (c, O, I) => `<path d="M24 18 Q32 14 40 18" fill="none" stroke="#e8455c" stroke-width="4" stroke-linecap="round"/><path d="M19 38 Q20 22 32 21 Q44 22 45 38 L48 42 L16 42 Z" fill="${c}" ${O()}/><circle cx="32" cy="45" r="3.2" fill="${tone(c, -0.3)}" ${O(2)}/><path d="M25 27 Q24 32 25 36" fill="none" stroke="${tone(c, 0.5)}" stroke-width="2.2" stroke-linecap="round"/><path d="M27 42 L37 42" ${O(1.6)}/>`],
      ['Луна', '#3f4a7a', '#f4e2a1', (c, O, I) => `<path d="M38 13 Q22 16 22 32 Q22 47 38 51 Q26 52 19 44 Q11 33 18 21 Q26 12 38 13 Z" fill="${c}" ${O()}/><path d="M33 40 Q34 32 40 31 L42 26 L44 31 Q49 33 48 40 Q47 46 40 46 Q34 46 33 40 Z" fill="#2a2236" ${O(1.8)}/><circle cx="44" cy="20" r="1.4" fill="${c}"/><circle cx="49" cy="27" r="1" fill="${c}"/>`],
      ['Сердце', '#ffe9f0', '#e8455c', (c, O) => `<path d="M32 47 Q14 36 15 25 Q16 17 24 17 Q29 17 32 22 Q35 17 40 17 Q48 17 49 25 Q50 36 32 47 Z" fill="${c}" ${O()}/><path d="M22 23 Q20 27 22 30" fill="none" stroke="${tone(c, 0.55)}" stroke-width="2.4" stroke-linecap="round"/><path d="M26 30 L28 26 M38 30 L36 26" ${O(1.6)}/>`],
      ['Косточка', '#c9a0dc', '#f4f1ea', (c, O, I) => `<path d="M14 32 Q20 26 26 30 L44 30 L50 24 L50 40 L44 34 L26 34 Q20 38 14 32 Z" fill="none"/><path d="M18 32 L44 32" ${O(3)}/><path d="M18 32 L44 32" stroke="${c}" stroke-width="1.6"/>${[24, 30, 36].map((x) => `<path d="M${x} 32 Q${x - 2} 24 ${x + 2} 21 M${x} 32 Q${x - 2} 40 ${x + 2} 43" fill="none" stroke="${I}" stroke-width="4.2" stroke-linecap="round"/><path d="M${x} 32 Q${x - 2} 24 ${x + 2} 21 M${x} 32 Q${x - 2} 40 ${x + 2} 43" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`).join('')}<path d="M44 32 L52 24 L52 40 Z" fill="${c}" ${O(2.2)}/><circle cx="14" cy="32" r="5.4" fill="${c}" ${O(2.2)}/><circle cx="12.6" cy="31" r="1.3" fill="${I}"/>`],
    ],
  };


  S.monkeys = {
    ink: '#2a1a0e',
    frame: (f, O) => `<path d="M20 4 L32 10 L44 4" fill="none" stroke="#c9a15e" stroke-width="2.6" stroke-linecap="round"/>`
      + `<path d="M7 12 L57 10 L56 30 L57 52 L8 54 L9 31 Z" fill="${f}" ${O(3)}/>`
      + `<path d="M8 31 L56 30" stroke="${tone(f, -0.35)}" stroke-width="2" stroke-linecap="round"/>`
      + `<path d="M12 18 Q20 16 26 19 M38 44 Q46 42 52 45" fill="none" stroke="${tone(f, 0.25)}" stroke-width="1.6" stroke-linecap="round"/>`
      + `<circle cx="12" cy="15" r="1.6" fill="#2a1a0e"/><circle cx="52" cy="14" r="1.6" fill="#2a1a0e"/><circle cx="13" cy="50" r="1.6" fill="#2a1a0e"/><circle cx="52" cy="49" r="1.6" fill="#2a1a0e"/>`,
    tile: { bg: '#c08a4e', edge: '#6b4423', shape: 'plank' },
    pal: { a: '#ffd23f', b: '#e0302a', c: '#4f8a3a', l: '#fff0c8' },
    list: [
      ['Банан', '#7a4f2a', '#ffd23f', (c, O) => `<path d="M17 25 Q30 47 48 30 Q50 34 47 38 Q32 52 17 33 Z" fill="${c}" ${O()}/><path d="M17 25 L15 21 L19 22 Z" fill="#6b4423" ${O(1.8)}/><path d="M22 32 Q31 42 44 34" fill="none" stroke="${tone(c, -0.25)}" stroke-width="2" stroke-linecap="round"/>`],
      ['Кокос', '#4f8a3a', '#8a5a33', (c, O, I) => `<circle cx="32" cy="33" r="13" fill="${c}" ${O()}/><circle cx="28" cy="28" r="1.8" fill="${I}"/><circle cx="35" cy="28" r="1.8" fill="${I}"/><circle cx="31.5" cy="34" r="1.8" fill="${I}"/><path d="M22 40 Q27 37 30 42 M36 22 Q40 25 43 23" fill="none" stroke="${tone(c, 0.35)}" stroke-width="1.8" stroke-linecap="round"/>`],
      ['Оскал', '#e0302a', '#8a5a33', (c, O, I) => `<circle cx="16" cy="30" r="5" fill="${c}" ${O(2.2)}/><circle cx="48" cy="30" r="5" fill="${c}" ${O(2.2)}/><ellipse cx="32" cy="32" rx="14" ry="15" fill="${c}" ${O()}/><path d="M22 32 Q32 22 42 32 Q42 46 32 47 Q22 46 22 32 Z" fill="#e8c49a" ${O(2)}/><path d="M23 24 L29 27 M41 24 L35 27" ${O(2.4)}/><circle cx="27" cy="29" r="1.6" fill="${I}"/><circle cx="37" cy="29" r="1.6" fill="${I}"/><path d="M25 38 L39 38 L37 43 L27 43 Z" fill="#fff" ${O(1.6)}/><path d="M29 38 L29 43 M32 38 L32 43 M35 38 L35 43" ${O(1)}/>`],
      ['Лиана', '#3a6a2a', '#9ad04a', (c, O) => `<path d="M14 14 Q30 22 22 34 Q16 44 32 50" fill="none" stroke="${tone(c, -0.3)}" stroke-width="4" stroke-linecap="round"/>${[[20, 19, -30], [26, 30, 20], [20, 40, -20], [28, 47, 30]].map(([x, y, r]) => `<path d="M${x} ${y} q8 -6 14 0 q-6 7 -14 0 z" fill="${c}" ${O(1.8)} transform="rotate(${r} ${x} ${y})"/>`).join('')}<path d="M38 16 Q46 26 40 36 Q36 44 46 50" fill="none" stroke="${tone(c, -0.3)}" stroke-width="3" stroke-linecap="round"/>`],
      ['Кулак', '#2f6a8a', '#e8b07a', (c, O) => `<path d="M18 26 Q18 20 23 20 L41 20 Q46 20 46 26 L46 38 Q46 47 37 47 L27 47 Q18 47 18 38 Z" fill="${c}" ${O()}/><path d="M24 20 L24 30 M30 20 L30 30 M36 20 L36 30 M18 30 L46 30" ${O(2)}/><path d="M18 34 Q24 32 26 38" fill="none" ${O(2)}/><path d="M13 16 L17 19 M10 26 L15 26 M51 16 L47 19 M54 26 L49 26" stroke="#ffd23f" stroke-width="2.4" stroke-linecap="round"/>`],
      ['Пальма', '#8fd3e8', '#4f8a3a', (c, O) => `<path d="M31 48 Q30 36 34 26" fill="none" stroke="#8a5a33" stroke-width="4.2" stroke-linecap="round"/><path d="M31 48 Q30 36 34 26" fill="none" stroke="#2a1a0e" stroke-width="1" opacity=".4"/>${[[-60, 0], [-20, 0], [20, 0], [60, 0]].map(([r]) => `<path d="M34 24 Q42 14 52 22 Q44 22 34 26 Z" fill="${c}" ${O(1.8)} transform="rotate(${r} 34 25)"/>`).join('')}<circle cx="32" cy="27" r="2.4" fill="#8a5a33" ${O(1.4)}/><path d="M14 50 Q32 44 50 50" fill="#f2d28a" ${O(2)}/>`],
      ['Бочка', '#e0302a', '#b5753a', (c, O) => `<path d="M20 16 Q16 32 20 48 L44 48 Q48 32 44 16 Z" fill="${c}" ${O()}/><path d="M18 24 L46 24 M18 40 L46 40" stroke="#555" stroke-width="3"/><path d="M18 24 L46 24 M18 40 L46 40" ${O(1)}/><path d="M28 16 Q26 32 28 48 M36 16 Q38 32 36 48" fill="none" stroke="${tone(c, -0.3)}" stroke-width="1.6"/>`],
      ['Череп', '#3c3f46', '#efe3c8', (c, O, I) => `<path d="M18 30 Q18 15 32 15 Q46 15 46 30 Q46 37 41 40 L41 46 L23 46 L23 40 Q18 37 18 30 Z" fill="${c}" ${O()}/><circle cx="26" cy="29" r="4" fill="${I}"/><circle cx="38" cy="29" r="4" fill="${I}"/><path d="M30 36 L32 33 L34 36 Z" fill="${I}"/><path d="M28 46 L28 42 M32 46 L32 42 M36 46 L36 42" ${O(1.6)}/><path d="M16 22 Q12 18 14 14 M48 22 Q52 18 50 14" fill="none" stroke="#8a5a33" stroke-width="3" stroke-linecap="round"/>`],
      ['Барабан', '#4f8a3a', '#e8b07a', (c, O) => `<ellipse cx="32" cy="22" rx="14" ry="5" fill="#f4e2c0" ${O()}/><path d="M18 22 L18 42 Q32 50 46 42 L46 22" fill="${c}" ${O()}/><path d="M18 26 L26 44 L32 28 L38 46 L46 26" fill="none" stroke="#e0302a" stroke-width="2.2" stroke-linejoin="round"/><path d="M42 10 L36 20 M50 12 L42 21" stroke="#8a5a33" stroke-width="3" stroke-linecap="round"/>`],
      ['Вулкан', '#8fd3e8', '#7a4f2a', (c, O) => `<path d="M10 50 L26 22 L38 22 L54 50 Z" fill="${c}" ${O()}/><path d="M26 22 Q29 30 32 24 Q35 30 38 22" fill="#e0302a" ${O(1.8)}/><path d="M28 18 Q24 12 28 8 Q30 13 32 10 Q34 14 36 9 Q40 13 36 18" fill="#ffb03b" ${O(1.8)}/><path d="M30 26 Q28 36 32 44" fill="none" stroke="#e0302a" stroke-width="2.4" stroke-linecap="round"/>`],
    ],
  };


  S.veggies = {
    ink: '#2f3a1e',
    frame: (f, O) => { const n = 18, pts = []; for (let i = 0; i < n * 2; i++) { const a = (Math.PI * i) / n, r = i % 2 ? 24.5 : 27; pts.push(`${(32 + r * Math.cos(a)).toFixed(1)} ${(33 + r * Math.sin(a)).toFixed(1)}`); } return `<path d="M${pts.join(' L')} Z" fill="${f}" ${O(2.6)}/><circle cx="32" cy="33" r="20.5" fill="none" stroke="${tone(f, 0.45)}" stroke-width="1.6" stroke-dasharray="3 2.4"/>`; },
    tile: { bg: '#fff6dc', edge: '#6fae4a', shape: 'card' },
    pal: { a: '#ff7a2f', b: '#e5383b', c: '#5aa83a', l: '#fffbea' },
    list: [
      ['Морковь', '#cfe8b0', '#ff7a2f', (c, O) => `<path d="M24 22 Q30 18 38 24 Q36 34 26 47 Q24 49 23 47 Q20 34 24 22 Z" fill="${c}" ${O()}/><path d="M26 30 L30 31 M25 36 L28 37" ${O(1.6)}/><path d="M31 21 Q30 12 36 10 Q35 16 37 19 Q41 13 46 15 Q41 18 38 23" fill="#5aa83a" ${O(1.8)}/>`],
      ['Томат', '#fff1d0', '#e5383b', (c, O) => `<circle cx="32" cy="35" r="13" fill="${c}" ${O()}/><path d="M24 25 L32 28 L40 25 L36 30 L32 27 L28 30 Z" fill="#5aa83a" ${O(1.6)}/><path d="M32 27 L32 20" ${O(2)}/><path d="M25 33 Q24 38 27 41" fill="none" stroke="${tone(c, 0.5)}" stroke-width="2.2" stroke-linecap="round"/>`],
      ['Баклажан', '#e9f4d8', '#7a3f9a', (c, O) => `<path d="M26 26 Q20 34 24 44 Q30 52 40 46 Q46 40 42 30 Q40 24 34 22 Z" fill="${c}" ${O()}/><path d="M26 26 Q28 18 34 22 Q38 16 40 24 Q36 22 34 26 Q30 24 26 26 Z" fill="#5aa83a" ${O(1.6)}/><path d="M28 34 Q27 40 31 44" fill="none" stroke="${tone(c, 0.45)}" stroke-width="2" stroke-linecap="round"/>`],
      ['Капуста', '#f4e8c0', '#7cc25a', (c, O) => `<circle cx="32" cy="34" r="14" fill="${c}" ${O()}/><path d="M32 20 Q24 30 32 48 M32 20 Q40 30 32 48 M19 30 Q26 34 32 34 Q38 34 45 30" fill="none" stroke="${tone(c, -0.3)}" stroke-width="1.8" stroke-linecap="round"/><path d="M18 38 Q14 30 20 24 M46 38 Q50 30 44 24" fill="none" stroke="${tone(c, 0.3)}" stroke-width="2.2" stroke-linecap="round"/>`],
      ['Гриб', '#d6ecf0', '#c8423a', (c, O) => `<path d="M27 36 L37 36 Q38 44 36 48 L28 48 Q26 44 27 36 Z" fill="#f4e8d0" ${O()}/><path d="M14 36 Q16 18 32 17 Q48 18 50 36 Z" fill="${c}" ${O()}/><circle cx="24" cy="28" r="2.6" fill="#fffbea"/><circle cx="34" cy="23" r="2.2" fill="#fffbea"/><circle cx="41" cy="30" r="2.4" fill="#fffbea"/>`],
      ['Перец', '#fff1d0', '#e83a2a', (c, O) => `<path d="M22 24 Q34 20 42 30 Q46 40 40 46 Q34 50 30 46 Q30 38 22 30 Z" fill="${c}" ${O()}/><path d="M22 24 Q20 18 26 16 Q24 20 28 22" fill="#5aa83a" ${O(1.8)}/><path d="M30 28 Q38 32 39 40" fill="none" stroke="${tone(c, 0.45)}" stroke-width="2" stroke-linecap="round"/>`],
      ['Кукуруза', '#e8f4ff', '#f4c542', (c, O) => `<path d="M32 15 Q41 20 40 34 Q39 44 32 48 Q25 44 24 34 Q23 20 32 15 Z" fill="${c}" ${O()}/><path d="M28 20 L28 44 M32 17 L32 47 M36 20 L36 44 M25 26 L39 26 M24 33 L40 33 M25 40 L39 40" stroke="${tone(c, -0.3)}" stroke-width="1.3"/><path d="M24 34 Q16 40 22 50 Q26 44 30 46 M40 34 Q48 40 42 50 Q38 44 34 46" fill="#5aa83a" ${O(1.8)}/>`],
      ['Горох', '#fff1d0', '#7cc25a', (c, O) => `<path d="M14 36 Q30 20 50 28 Q46 40 32 42 Q20 44 14 36 Z" fill="${c}" ${O()}/>${[22, 30, 38].map((x, i) => `<circle cx="${x + i}" cy="${35 - i * 2}" r="3.6" fill="${tone(c, 0.3)}" ${O(1.5)}/>`).join('')}<path d="M50 28 Q54 22 52 18" fill="none" ${O(2)}/>`],
      ['Лук', '#e9f4d8', '#c98ad0', (c, O) => `<path d="M32 18 Q46 26 44 38 Q42 48 32 48 Q22 48 20 38 Q18 26 32 18 Z" fill="${c}" ${O()}/><path d="M32 18 L30 10 M32 18 L35 9 M32 18 L32 9" stroke="#5aa83a" stroke-width="3" stroke-linecap="round"/><path d="M27 26 Q24 36 28 44 M37 26 Q40 36 36 44" fill="none" stroke="${tone(c, -0.25)}" stroke-width="1.6"/><path d="M28 48 L27 52 M32 48 L32 52 M36 48 L37 52" ${O(1.4)}/>`],
      ['Тыква', '#e0f0ff', '#f28a2a', (c, O) => `<path d="M32 22 Q44 18 48 30 Q50 44 38 47 Q32 48 26 47 Q14 44 16 30 Q20 18 32 22 Z" fill="${c}" ${O()}/><path d="M32 22 Q26 34 32 47 M32 22 Q38 34 32 47 M22 24 Q18 36 24 46 M42 24 Q46 36 40 46" fill="none" stroke="${tone(c, -0.3)}" stroke-width="1.6"/><path d="M32 22 L33 14 L37 13" fill="none" stroke="#6b4423" stroke-width="3" stroke-linecap="round"/>`],
    ],
  };


  S['42brothers'] = {
    ink: '#2a1030',
    frame: (f, O) => `<path d="M22 6 L42 6 L57 21 L57 43 L42 58 L22 58 L7 43 L7 21 Z" fill="#f4c542" ${O(3)}/>`
      + `<path d="M24 10.5 L40 10.5 L52.5 23 L52.5 41 L40 53.5 L24 53.5 L11.5 41 L11.5 23 Z" fill="${f}" ${O(1.8)}/>`
      + [[22, 8], [42, 8], [55, 22], [55, 42], [42, 56], [22, 56], [9, 42], [9, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff"/>`).join(''),
    tile: { bg: '#ffd1ea', edge: '#d4a017', shape: 'octa' },
    pal: { a: '#f4c542', b: '#ff4fa3', c: '#7a3fd0', l: '#fff4fb' },
    list: [
      ['Бриллиант', '#ff8fc8', '#bfefff', (c, O) => `<path d="M18 26 L24 18 L40 18 L46 26 L32 47 Z" fill="${c}" ${O()}/><path d="M18 26 L46 26 M24 18 L28 26 L32 47 L36 26 L40 18 M28 26 L32 18 L36 26" fill="none" ${O(1.6)}/><path d="M24 22 L27 20" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`],
      ['Цепь', '#2a1030', '#f4c542', (c, O) => [[16, 24], [26, 30], [36, 36], [46, 42]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.6" fill="none" stroke="${c}" stroke-width="4.2" transform="rotate(${i % 2 ? 60 : 30} ${x} ${y})"/>`).join('') + [[16, 24], [26, 30], [36, 36], [46, 42]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.6" fill="none" ${O(1.2)} transform="rotate(${i % 2 ? 60 : 30} ${x} ${y})"/>`).join('')],
      ['Очки', '#ff8fc8', '#2a1030', (c, O) => `<path d="M12 26 L52 26" ${O(2.6)}/><path d="M14 26 L30 26 L29 36 Q22 40 16 36 Z" fill="${c}" ${O(2.2)}/><path d="M34 26 L50 26 L48 36 Q42 40 35 36 Z" fill="${c}" ${O(2.2)}/><path d="M18 29 L22 29 M38 29 L42 29" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`],
      ['Микрофон', '#7a3fd0', '#d8dde6', (c, O) => `<circle cx="32" cy="22" r="8" fill="${c}" ${O()}/><path d="M26 18 L38 18 M25 22 L39 22 M26 26 L38 26" stroke="${tone(c, -0.3)}" stroke-width="1.4"/><path d="M29 30 L35 30 L34 44 L30 44 Z" fill="#2a1030" ${O(2)}/><path d="M24 48 L40 48" ${O(2.4)}/><path d="M32 44 L32 48" ${O(2)}/>`],
      ['Звезда', '#2a1030', '#f4c542', (c, O) => `<path d="M32 13 L37 26 L51 26 L40 34 L44 48 L32 40 L20 48 L24 34 L13 26 L27 26 Z" fill="${c}" ${O()}/><path d="M30 22 L32 17" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`],
      ['Кубок', '#ff4fa3', '#f4c542', (c, O) => `<path d="M21 16 L43 16 Q43 32 32 34 Q21 32 21 16 Z" fill="${c}" ${O()}/><path d="M21 19 Q14 19 15 25 Q16 29 22 28 M43 19 Q50 19 49 25 Q48 29 42 28" fill="none" ${O(2.2)}/><path d="M30 34 L34 34 L35 42 L29 42 Z" fill="${c}" ${O(2)}/><path d="M24 42 L40 42 L40 48 L24 48 Z" fill="#2a1030" ${O(2)}/><path d="M26 20 Q26 26 29 29" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`],
      ['Леопард', '#f6d7a8', '#2a1030', (c, O) => `<path d="M16 26 L15 14 L24 20 Q32 17 40 20 L49 14 L48 26 Q52 34 47 41 Q40 48 32 48 Q24 48 17 41 Q12 34 16 26 Z" fill="#f2b632" ${O()}/>${[[22, 27], [42, 27], [26, 41], [38, 41], [32, 23]].map(([x, y]) => `<path d="M${x - 2.4} ${y} q2.4 -3 4.8 0 q-2.4 3 -4.8 0" fill="${c}"/>`).join('')}<circle cx="27" cy="33" r="1.8" fill="${c}"/><circle cx="37" cy="33" r="1.8" fill="${c}"/><path d="M30 38 L34 38 L32 40 Z" fill="#ff4fa3"/>`],
      ['Гантель', '#7a3fd0', '#d8dde6', (c, O) => `<path d="M20 30 L44 30 L44 34 L20 34 Z" fill="${c}" ${O(2)}/><path d="M12 24 L18 24 L18 40 L12 40 Z M46 24 L52 24 L52 40 L46 40 Z" fill="#2a1030" ${O(2)}/><path d="M17 21 L22 21 L22 43 L17 43 Z M42 21 L47 21 L47 43 L42 43 Z" fill="${c}" ${O(2)}/>`],
      ['Деньги', '#4fae6a', '#f4c542', (c, O) => `<path d="M24 20 Q20 14 26 13 L38 13 Q44 14 40 20 Q50 26 48 38 Q46 48 32 48 Q18 48 16 38 Q14 26 24 20 Z" fill="${c}" ${O()}/><path d="M24 20 L40 20" ${O(2)}/><circle cx="32" cy="35" r="7" fill="#fff4b0" ${O(1.8)}/><path d="M32 31 L32 39 M30 33 Q32 31 34 33 Q30 35 34 37 Q32 39 30 37" fill="none" ${O(1.4)}/>`],
      ['Сердце', '#2a1030', '#ff4fa3', (c, O) => `<path d="M32 47 Q14 36 15 25 Q16 17 24 17 Q29 17 32 22 Q35 17 40 17 Q48 17 49 25 Q50 36 32 47 Z" fill="${c}" ${O()}/><path d="M22 22 Q19 27 22 31" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="40" cy="25" r="1.6" fill="#fff"/>`],
    ],
  };


  S.cherts = {
    ink: '#160a0a',
    frame: (f, O) => `<path d="M9 9 L22 6 L32 9 L43 5 L56 10 L57 32 Q55 48 32 58 Q9 48 7 32 Z" fill="${f}" ${O(3)}/>`
      + `<path d="M10 16 L13 19 L11 23 M54 18 L51 21 L53 25 M13 38 L16 41" fill="none" stroke="#ff6a2a" stroke-width="1.8" stroke-linecap="round"/>`,
    tile: { bg: '#3a2626', edge: '#ff6a2a', shape: 'stone' },
    pal: { a: '#ff6a2a', b: '#d81e1e', c: '#ffc23d', l: '#ffd9b8' },
    list: [
      ['Рога', '#2e1e1e', '#d81e1e', (c, O) => `<path d="M14 16 Q14 34 28 36 L28 30 Q20 28 20 18 Z" fill="${c}" ${O()}/><path d="M50 16 Q50 34 36 36 L36 30 Q44 28 44 18 Z" fill="${c}" ${O()}/><path d="M22 40 Q32 50 42 40" fill="none" stroke="#ff6a2a" stroke-width="3" stroke-linecap="round"/>`],
      ['Вилы', '#4a2a2a', '#ffc23d', (c, O) => `<path d="M30 26 L34 26 L34 50 L30 50 Z" fill="#6b4423" ${O(2)}/><path d="M18 14 L18 24 Q18 30 24 30 L40 30 Q46 30 46 24 L46 14" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M32 12 L32 30" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M18 14 L18 24 Q18 30 24 30 L40 30 Q46 30 46 24 L46 14 M32 12 L32 30" fill="none" ${O(1)}/><path d="M16 12 L18 8 L20 12 M30 10 L32 6 L34 10 M44 12 L46 8 L48 12" fill="${c}" ${O(1.4)}/>`],
      ['Пламя', '#2e1e1e', '#ff6a2a', (c, O) => `<path d="M32 50 Q16 46 18 32 Q20 24 26 20 Q25 28 30 30 Q28 20 36 12 Q36 24 44 28 Q48 34 46 40 Q42 50 32 50 Z" fill="${c}" ${O()}/><path d="M32 48 Q24 44 27 36 Q30 40 33 38 Q32 32 37 28 Q38 36 40 40 Q40 46 32 48 Z" fill="#ffc23d"/>`],
      ['Котёл', '#4a2a2a', '#2a2a30', (c, O) => `<path d="M14 30 L50 30 Q50 48 32 48 Q14 48 14 30 Z" fill="${c}" ${O()}/><ellipse cx="32" cy="30" rx="18" ry="4" fill="#7ad04a" ${O(2)}/><circle cx="26" cy="24" r="2.4" fill="#7ad04a" ${O(1.4)}/><circle cx="36" cy="20" r="2" fill="#7ad04a" ${O(1.4)}/><path d="M18 50 L20 46 M46 50 L44 46" ${O(2.4)}/><path d="M22 52 Q32 46 42 52" fill="none" stroke="#ff6a2a" stroke-width="2.6" stroke-linecap="round"/>`],
      ['Череп', '#d81e1e', '#efe3c8', (c, O, I) => `<path d="M18 30 Q18 15 32 15 Q46 15 46 30 Q46 37 41 40 L41 46 L23 46 L23 40 Q18 37 18 30 Z" fill="${c}" ${O()}/><circle cx="26" cy="29" r="4" fill="${I}"/><circle cx="38" cy="29" r="4" fill="${I}"/><circle cx="26" cy="29" r="1.4" fill="#ff6a2a"/><circle cx="38" cy="29" r="1.4" fill="#ff6a2a"/><path d="M30 36 L32 33 L34 36 Z" fill="${I}"/><path d="M28 46 L28 42 M32 46 L32 42 M36 46 L36 42" ${O(1.6)}/>`],
      ['Хвост', '#2e1e1e', '#d81e1e', (c, O) => `<path d="M14 46 Q24 50 30 40 Q36 28 26 22 Q20 18 26 14" fill="none" stroke="${c}" stroke-width="4.4" stroke-linecap="round"/><path d="M14 46 Q24 50 30 40 Q36 28 26 22 Q20 18 26 14" fill="none" ${O(1)}/><path d="M22 14 L34 8 L32 20 Z" fill="${c}" ${O(2)}/>`],
      ['Мышь', '#4a2a2a', '#2a1a2e', (c, O) => `<path d="M32 26 Q26 20 18 22 Q12 22 8 30 Q14 28 16 32 Q20 30 22 34 Q26 32 32 36 Q38 32 42 34 Q44 30 48 32 Q50 28 56 30 Q52 22 46 22 Q38 20 32 26 Z" fill="${c}" ${O()}/><circle cx="32" cy="30" r="5" fill="${c}" ${O(2)}/><path d="M28 26 L29 22 L31 25 M36 26 L35 22 L33 25" fill="${c}" ${O(1.4)}/><circle cx="30.4" cy="29.5" r="1" fill="#ff6a2a"/><circle cx="33.6" cy="29.5" r="1" fill="#ff6a2a"/>`],
      ['Глаз', '#2e1e1e', '#ffc23d', (c, O, I) => `<path d="M10 32 Q32 12 54 32 Q32 52 10 32 Z" fill="#fff1d8" ${O()}/><circle cx="32" cy="32" r="9" fill="${c}" ${O(2)}/><path d="M32 24 L33.5 32 L32 40 L30.5 32 Z" fill="${I}"/><path d="M20 22 L16 16 M32 18 L32 11 M44 22 L48 16" stroke="#ff6a2a" stroke-width="2.4" stroke-linecap="round"/>`],
      ['Капля лавы', '#3a2a2a', '#ff6a2a', (c, O) => `<path d="M32 12 Q46 30 44 40 Q42 50 32 50 Q22 50 20 40 Q18 30 32 12 Z" fill="${c}" ${O()}/><path d="M26 36 Q26 44 32 46" fill="none" stroke="#ffc23d" stroke-width="2.6" stroke-linecap="round"/><path d="M14 52 Q32 46 50 52" fill="none" stroke="#d81e1e" stroke-width="3" stroke-linecap="round"/>`],
      ['Бесёнок', '#4a2a2a', '#e8453a', (c, O, I) => `<path d="M20 22 Q16 12 20 9 Q22 15 26 18 M44 22 Q48 12 44 9 Q42 15 38 18" fill="#ffc23d" ${O(2)}/><circle cx="32" cy="32" r="14" fill="${c}" ${O()}/><path d="M24 28 L29 30 M40 28 L35 30" ${O(2.2)}/><circle cx="27" cy="32" r="1.8" fill="${I}"/><circle cx="37" cy="32" r="1.8" fill="${I}"/><path d="M25 38 Q32 44 39 38" fill="none" ${O(2.2)}/><path d="M28 40 L29 43 L30 40.6 M34 40.6 L35 43 L36 40" fill="#fff" ${O(1)}/>`],
    ],
  };


  S.ugabugi = {
    ink: '#24201a',
    frame: (f, O) => `<path d="M12 8 L52 8 L52 10 L56 10 L56 46 L54 46 L54 50 L46 50 L46 54 L18 54 L18 50 L10 50 L10 46 L8 46 L8 10 L12 10 Z" fill="${f}" ${O(3)}/>`
      + `<path d="M14 16 L18 14 M48 20 L44 22 M16 44 L22 46 M42 46 L46 42" stroke="${tone(f, -0.3)}" stroke-width="1.8" stroke-linecap="round"/>`
      + `<path d="M10 12 L54 12" stroke="#a07a4a" stroke-width="3" stroke-dasharray="2 2"/>`,
    tile: { bg: '#b9b1a3', edge: '#6d5f4c', shape: 'pixel' },
    pal: { a: '#f2a63b', b: '#c8423a', c: '#6b4423', l: '#efe6d4' },
    list: [
      ['Кость', '#8a7f6e', '#efe6d4', (c, O) => `<path d="M20 20 Q14 14 18 12 Q22 10 24 16 L40 32 Q46 30 48 34 Q52 38 46 40 Q48 46 44 46 Q40 46 40 40 L24 24 Q18 26 16 22 Q14 18 20 20 Z" fill="${c}" ${O()}/>`],
      ['Дубина', '#9aa88a', '#8a5a33', (c, O) => `<path d="M22 46 L28 44 L38 22 Q42 12 34 12 Q26 14 30 24 L20 42 Z" fill="${c}" ${O()}/>${[[33, 16], [37, 20], [31, 22]].map(([x, y]) => `<path d="M${x} ${y} l2 -3 l1 3 z" fill="#efe6d4" ${O(1)}/>`).join('')}`],
      ['Мамонт', '#a8c8d8', '#7a5a3c', (c, O, I) => `<path d="M14 40 L14 26 Q16 16 30 16 Q44 16 46 26 L46 40 L40 40 L40 34 L22 34 L22 40 Z" fill="${c}" ${O()}/><path d="M44 26 Q52 30 50 40 Q48 46 44 44" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M44 26 Q52 30 50 40 Q48 46 44 44" fill="none" ${O(1)}/><path d="M40 32 Q38 42 30 42" fill="none" stroke="#efe6d4" stroke-width="3" stroke-linecap="round"/><circle cx="38" cy="24" r="1.6" fill="${I}"/>`],
      ['Костёр', '#6d5f4c', '#f2a63b', (c, O) => `<path d="M18 46 L46 40 M18 40 L46 46" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/><path d="M32 42 Q20 38 24 28 Q26 32 29 30 Q28 22 34 16 Q34 26 40 28 Q44 36 32 42 Z" fill="${c}" ${O()}/><path d="M32 40 Q27 36 30 31 Q32 34 34 32 Q36 36 32 40 Z" fill="#ffe08a"/>`],
      ['Ладонь', '#c9b38f', '#c8423a', (c, O) => `<path d="M22 46 L20 30 Q19 26 22 26 Q24 26 24 30 L24 18 Q24 15 27 15 Q29 15 29 18 L29 16 Q29 13 32 13 Q35 13 35 16 L35 18 Q35 15 38 15 Q40 15 40 19 L40 28 L43 25 Q46 23 47 26 L42 38 Q40 46 34 46 Z" fill="${c}" ${O()}/>`],
      ['Топор', '#9aa88a', '#8a8a92', (c, O) => `<path d="M30 16 L34 16 L36 50 L32 50 Z" fill="#8a5a33" ${O(2)}/><path d="M34 18 Q48 14 50 26 Q50 34 34 30 Z" fill="${c}" ${O()}/><path d="M33 20 L34 28" stroke="#a07a4a" stroke-width="3"/><path d="M38 20 L42 22" stroke="${tone(c, 0.45)}" stroke-width="2" stroke-linecap="round"/>`],
      ['Зуб', '#6d5f4c', '#efe6d4', (c, O) => `<path d="M20 16 Q32 12 44 16 Q46 26 40 32 L36 50 L32 38 L28 50 L24 32 Q18 26 20 16 Z" fill="${c}" ${O()}/><path d="M24 20 Q26 26 28 28" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`],
      ['Колесо', '#a8c8d8', '#8a8a92', (c, O) => `<circle cx="32" cy="32" r="15" fill="${c}" ${O()}/><circle cx="32" cy="32" r="4" fill="#8a5a33" ${O(2)}/><path d="M22 24 L24 26 M42 40 L40 38 M24 42 L26 40 M40 22 L38 24" stroke="${tone(c, -0.35)}" stroke-width="2.4" stroke-linecap="round"/>`],
      ['Яйцо', '#9aa88a', '#efe6d4', (c, O) => `<path d="M32 13 Q46 24 45 36 Q44 48 32 48 Q20 48 19 36 Q18 24 32 13 Z" fill="${c}" ${O()}/><circle cx="27" cy="30" r="3" fill="#7ab04a"/><circle cx="37" cy="24" r="2.2" fill="#7ab04a"/><circle cx="37" cy="38" r="3.4" fill="#7ab04a"/><path d="M22 36 L26 34 L28 38 L32 34 L35 38 L38 34 L42 36" fill="none" ${O(1.8)}/>`],
      ['Спираль', '#c8423a', '#efe6d4', (c, O) => `<path d="M32 32 Q34 30 34 32 Q34 36 30 36 Q26 36 26 31 Q26 25 32 25 Q40 25 40 32 Q40 41 31 41 Q20 41 20 31 Q20 19 32 19 Q45 19 45 32" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`],
    ],
  };

  const STYLES = Object.keys(S);

   
  const TILE = {
    shield: (t, O) => `<path d="M5 4 L27 4 Q28.5 4 28.5 5.5 L28.5 15 Q28.5 24 16 29 Q3.5 24 3.5 15 L3.5 5.5 Q3.5 4 5 4 Z" fill="${t.bg}" ${O(1.8)}/>`,
    blob: (t, O) => `<path d="M16 3 Q26 2 28.5 10 Q31 18 27 24 Q22 30 14 29 Q5 28 3.5 20 Q2 11 8 6 Q11 3 16 3 Z" fill="${t.bg}" ${O(1.8)}/><path d="M7 7 Q5 9 5.5 12" fill="none" stroke="${t.edge}" stroke-width="1.6" stroke-linecap="round"/>`,
    plank: (t, O) => `<path d="M3 5 L29 4 L28.5 16 L29 28 L3.5 28.5 L4 16 Z" fill="${t.bg}" ${O(1.8)}/><path d="M4 16 L28.5 16" stroke="${t.edge}" stroke-width="1.2"/>`,
    card: (t, O) => `<rect x="3.5" y="3.5" width="25" height="25" rx="3" fill="${t.bg}" ${O(1.6)}/><rect x="6" y="6" width="20" height="20" rx="1.5" fill="none" stroke="${t.edge}" stroke-width="1.2" stroke-dasharray="2 1.6"/>`,
    octa: (t, O) => `<path d="M11 3.5 L21 3.5 L28.5 11 L28.5 21 L21 28.5 L11 28.5 L3.5 21 L3.5 11 Z" fill="${t.bg}" stroke="${t.edge}" stroke-width="2.2" stroke-linejoin="round"/>`,
    stone: (t, O) => `<path d="M4 6 L12 3.5 L20 5 L28 4 L28.5 20 Q27 28 16 29 Q4 28 3.5 20 Z" fill="${t.bg}" ${O(1.8)}/><path d="M6 12 L9 14 L8 17 M26 22 L23 24" fill="none" stroke="${t.edge}" stroke-width="1.3" stroke-linecap="round"/>`,
    pixel: (t, O) => `<path d="M6 3.5 L26 3.5 L26 5 L28.5 5 L28.5 27 L26 27 L26 28.5 L6 28.5 L6 27 L3.5 27 L3.5 5 L6 5 Z" fill="${t.bg}" ${O(1.8)}/>`,
  };

  const G = {
    daily: (P, O) => `<path d="M9 8 L21 8 Q24 8 24 11 L24 23 L12 23 Q9 23 9 20 Z" fill="${P.l}" ${O(1.6)}/><path d="M12 12 L20 12 M12 15.5 L20 15.5 M12 19 L17 19" ${O(1.3)}/><path d="M20 19 L22 21 L26 16" fill="none" stroke="${P.c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
    gift: (P, O) => `<path d="M8 14 L24 14 L24 24 L8 24 Z" fill="${P.b}" ${O(1.6)}/><path d="M7 11 L25 11 L25 14 L7 14 Z" fill="${tone(P.b, 0.25)}" ${O(1.6)}/><path d="M16 11 L16 24" stroke="${P.a}" stroke-width="2.6"/><path d="M16 11 Q11 5 9.5 8.5 Q9 11 16 11 Q21 5 22.5 8.5 Q23 11 16 11" fill="${P.a}" ${O(1.3)}/>`,
    hall: (P, O) => `<path d="M7 14 L16 7 L25 14 Z" fill="${P.b}" ${O(1.6)}/><path d="M9 14 L23 14 L23 24 L9 24 Z" fill="${P.l}" ${O(1.6)}/><path d="M14 24 L14 19 Q16 17 18 19 L18 24" fill="${P.c}" ${O(1.3)}/><path d="M11 16.5 L13 16.5 M19 16.5 L21 16.5" ${O(1.3)}/>`,
    members: (P, O) => `<circle cx="11" cy="12" r="3.2" fill="${P.a}" ${O(1.4)}/><path d="M6 23 Q6 16.5 11 16.5 Q16 16.5 16 23 Z" fill="${P.a}" ${O(1.4)}/><circle cx="21" cy="12" r="3.2" fill="${P.c}" ${O(1.4)}/><path d="M16 23 Q16 16.5 21 16.5 Q26 16.5 26 23 Z" fill="${P.c}" ${O(1.4)}/>`,
    requests: (P, O) => `<path d="M7 11 L25 11 L25 23 L7 23 Z" fill="${P.l}" ${O(1.6)}/><path d="M7 11 L16 18 L25 11" fill="none" ${O(1.5)}/><circle cx="24" cy="10" r="3.4" fill="${P.b}" ${O(1.3)}/>`,
    war: (P, O) => `<path d="M8 8 L22 22 M24 8 L10 22" stroke="${P.l}" stroke-width="3" stroke-linecap="round"/><path d="M8 8 L22 22 M24 8 L10 22" fill="none" ${O(1)}/><path d="M7 21 L11 25 M25 21 L21 25" stroke="${P.a}" stroke-width="3" stroke-linecap="round"/><path d="M7 21 L11 25 M25 21 L21 25" ${O(1)}/>`,
    log: (P, O) => `<path d="M16 9 Q11 7 7 8 L7 23 Q11 22 16 24 Q21 22 25 23 L25 8 Q21 7 16 9 Z" fill="${P.l}" ${O(1.6)}/><path d="M16 9 L16 24" ${O(1.3)}/><path d="M9.5 12 L13.5 12.5 M9.5 15.5 L13.5 16 M18.5 12.5 L22.5 12 M18.5 16 L22.5 15.5" ${O(1.1)}/>`,
    manage: (P, O) => { let d = ''; for (let i = 0; i < 8; i++) { const a = (Math.PI / 4) * i; d += `<rect x="14.4" y="5.8" width="3.2" height="4.4" rx=".8" transform="rotate(${i * 45} 16 16)" fill="${P.c}" ${O(1.1)}/>`; } return d + `<circle cx="16" cy="16" r="7.2" fill="${P.c}" ${O(1.6)}/><circle cx="16" cy="16" r="2.8" fill="${P.l}" ${O(1.3)}/>`; },
    crown: (P, O) => `<path d="M7 21 L6 11 L11 15.5 L16 9 L21 15.5 L26 11 L25 21 Z" fill="${P.a}" ${O(1.6)}/><path d="M7 21 L25 21 L25 24 L7 24 Z" fill="${tone(P.a, -0.2)}" ${O(1.5)}/><circle cx="16" cy="22.5" r="1.2" fill="${P.b}"/>`,
    lead: (P, O) => `<path d="M16 6.5 L18.6 12.6 L25 13 L20 17.2 L21.6 23.6 L16 20 L10.4 23.6 L12 17.2 L7 13 L13.4 12.6 Z" fill="${P.a}" ${O(1.6)}/>`,
    trusted: (P, O) => `<circle cx="11.5" cy="13" r="4.6" fill="none" stroke="${P.a}" stroke-width="3"/><circle cx="11.5" cy="13" r="4.6" fill="none" ${O(1)}/><path d="M15 16 L24 25 M20 21 L22.5 18.5 M22 23 L24.5 20.5" fill="none" stroke="${P.a}" stroke-width="2.6" stroke-linecap="round"/><path d="M15 16 L24 25" fill="none" ${O(.9)}/>`,
    novice: (P, O) => `<path d="M16 25 L16 15" stroke="${P.c}" stroke-width="2.4" stroke-linecap="round"/><path d="M16 17 Q9 17 8 10 Q15 9.5 16 16.5 Z" fill="${P.c}" ${O(1.4)}/><path d="M16 14 Q22 14 24 8 Q17 7.5 16 13.5 Z" fill="${tone(P.c, 0.25)}" ${O(1.4)}/><path d="M10 25 L22 25" ${O(1.6)}/>`,
    create: (P, O) => `<circle cx="16" cy="16" r="9" fill="${P.c}" ${O(1.6)}/><path d="M16 11 L16 21 M11 16 L21 16" stroke="${P.l}" stroke-width="2.8" stroke-linecap="round"/>`,
    search: (P, O) => `<circle cx="14" cy="14" r="6.2" fill="${P.l}" ${O(1.8)}/><path d="M18.6 18.6 L24.5 24.5" stroke="${P.c}" stroke-width="3.4" stroke-linecap="round"/><path d="M18.6 18.6 L24.5 24.5" ${O(1)}/><path d="M11 12 Q12 10 14 10" fill="none" stroke="${P.c}" stroke-width="1.4" stroke-linecap="round"/>`,
    invite: (P, O) => `<path d="M6 11 L22 11 L22 23 L6 23 Z" fill="${P.l}" ${O(1.6)}/><path d="M6 11 L14 17.5 L22 11" fill="none" ${O(1.4)}/><circle cx="23.5" cy="21.5" r="4.4" fill="${P.c}" ${O(1.3)}/><path d="M23.5 19.2 L23.5 23.8 M21.2 21.5 L25.8 21.5" stroke="${P.l}" stroke-width="1.8" stroke-linecap="round"/>`,
    leave: (P, O) => `<path d="M8 7 L18 7 L18 25 L8 25 Z" fill="${P.c}" ${O(1.6)}/><circle cx="15.5" cy="16" r="1" fill="${P.l}"/><path d="M19 16 L26 16 M23 12.5 L26.5 16 L23 19.5" fill="none" stroke="${P.b}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  };

  G.main = (P, O) => `<path d="M10 25 L10 7" stroke="${P.c}" stroke-width="2.4" stroke-linecap="round"/><path d="M10 25 L10 7" fill="none" ${O(.9)}/><path d="M11 8 L24 8 L21 12.5 L24 17 L11 17 Z" fill="${P.b}" ${O(1.5)}/><circle cx="16.5" cy="12.5" r="2" fill="${P.a}" ${O(1)}/><circle cx="10" cy="6.5" r="1.6" fill="${P.a}" ${O(1)}/>`;
  G.run = (P, O) => `<path d="M11 7 L18 7 L18 17 Q24 17 25 21 L25 24 L9 24 L9 20 Q11 18 11 15 Z" fill="${P.b}" ${O(1.6)}/><path d="M9 22 L25 22" ${O(1.3)}/><path d="M11 11 L16 11 M11 14 L16 14" stroke="${P.l}" stroke-width="1.6" stroke-linecap="round"/>`;
  G.gather = (P, O) => `<path d="M7 19 Q8 11 17 10 Q22 9.5 25 7 L25 22 Q21 19 16 19.5 L12 20 Z" fill="${P.a}" ${O(1.6)}/><path d="M12 20 L13 24.5 L16 24 L15.5 19.6" fill="${P.c}" ${O(1.3)}/><path d="M21 9.5 L21 20" ${O(1.1)}/>`;

  const GX = {
    cats: { gift: (P, O) => `<path d="M8 14 L24 14 L24 24 L8 24 Z" fill="${P.a}" ${O(1.6)}/><path d="M16 14 L16 24" stroke="${P.l}" stroke-width="2.4"/><circle cx="16" cy="10" r="4" fill="#7d9cd6" ${O(1.3)}/><path d="M13 8.5 Q16 11 19 8.5 M12.5 11 Q16 13 19.5 11" fill="none" stroke="#4a6aa8" stroke-width="1"/>`,
      novice: (P, O) => `<path d="M10 15 L9 8 L14 12 Q16 11 18 12 L23 8 L22 15 Q24 20 21 23 Q18 25 16 25 Q14 25 11 23 Q8 20 10 15 Z" fill="#f6d7a8" ${O(1.5)}/><circle cx="13.5" cy="17" r="1.1" fill="#4a2f22"/><circle cx="18.5" cy="17" r="1.1" fill="#4a2f22"/><path d="M15 20 L17 20 L16 21 Z" fill="#e8455c"/>` },
    monkeys: { gift: (P, O) => `<path d="M7 14 Q16 30 26 16 Q27 19 25 21 Q16 31 7 18 Z" fill="${P.a}" ${O(1.6)}/><path d="M7 14 L6 11.5 L8.5 12 Z" fill="#6b4423" ${O(1.2)}/><path d="M16 6 L16 12 M12 8 L20 8" stroke="${P.b}" stroke-width="2.2" stroke-linecap="round"/>`,
      war: (P, O) => `<path d="M9 23 L20 9" stroke="#8a5a33" stroke-width="3.6" stroke-linecap="round"/><path d="M9 23 L20 9" ${O(1)}/><path d="M23 23 L12 9" stroke="#8a5a33" stroke-width="3.6" stroke-linecap="round"/><path d="M23 23 L12 9" ${O(1)}/><circle cx="20" cy="9" r="3" fill="#6b4423" ${O(1.3)}/><circle cx="12" cy="9" r="3" fill="#6b4423" ${O(1.3)}/>` },
    veggies: { novice: (P, O) => `<path d="M14 13 Q18 11 21 14 Q20 19 15 26 Q14 27 13.5 26 Q12 19 14 13 Z" fill="#ff7a2f" ${O(1.5)}/><path d="M17 12.5 Q16 7 19.5 6 Q19 9 20.5 11 Q23 7.5 26 9 Q23 10.5 21 13.5" fill="#5aa83a" ${O(1.3)}/>`,
      hall: (P, O) => `<path d="M6 15 L16 7 L26 15 Z" fill="#5aa83a" ${O(1.6)}/><path d="M8 15 L24 15 L24 24 L8 24 Z" fill="#fff1d0" ${O(1.6)}/><path d="M10 18 L22 18 M10 21 L22 21" stroke="#e5383b" stroke-width="1.2" stroke-dasharray="1.6 1.2"/><path d="M14 24 L14 19.5 L18 19.5 L18 24" fill="#8a5a33" ${O(1.2)}/>` },
    '42brothers': { crown: (P, O) => `<path d="M7 19 Q7 11 16 11 Q25 11 25 19 Z" fill="${P.b}" ${O(1.6)}/><path d="M5 19 L27 19 L27 22 L5 22 Z" fill="${P.a}" ${O(1.5)}/><path d="M12 15 L20 15" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M20 22 L24 25" ${O(1.3)}/><circle cx="16" cy="8" r="1.6" fill="#fff" ${O(1)}/>`,
      lead: (P, O) => `<path d="M9 13 L12 8 L20 8 L23 13 L16 24 Z" fill="#bfefff" ${O(1.6)}/><path d="M9 13 L23 13 M12 8 L14 13 L16 24 L18 13 L20 8" fill="none" ${O(1)}/>` },
    cherts: { crown: (P, O) => `<path d="M8 20 Q6 10 9 6 Q10 13 14 16 M24 20 Q26 10 23 6 Q22 13 18 16" fill="${P.b}" ${O(1.5)}/><path d="M8 20 L24 20 L24 24 L8 24 Z" fill="${P.a}" ${O(1.5)}/>`,
      war: (P, O) => `<path d="M10 25 L16 9 M22 25 L16 9" stroke="${P.a}" stroke-width="2.6" stroke-linecap="round"/><path d="M11 13 L16 7 L21 13 M13 11 L13 15 M19 11 L19 15" fill="none" stroke="${P.c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` },
    ugabugi: { crown: (P, O) => `<path d="M7 22 L8 12 L12 17 L16 10 L20 17 L24 12 L25 22 Z" fill="#efe6d4" ${O(1.6)}/><path d="M7 22 L25 22 L25 25 L7 25 Z" fill="#8a5a33" ${O(1.4)}/>`,
      war: (P, O) => `<path d="M9 25 L20 9" stroke="#8a5a33" stroke-width="3.4" stroke-linecap="round"/><path d="M9 25 L20 9" ${O(1)}/><path d="M18 8 Q26 6 26 13 Q26 17 20 14 Z" fill="#8a8a92" ${O(1.4)}/>`,
      log: (P, O) => `<path d="M6 8 L26 8 L26 24 L6 24 Z" fill="#cfc6b6" ${O(1.6)}/><path d="M9 12 L12 16 L9 20 M15 12 L15 20 M18 20 Q20 12 23 20" fill="none" stroke="${P.b}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>` },
  };

   
  const styleOf = (st) => (st && S[st] ? st : 'legion');
  function curStyle() {
    try {
      const D = root && root.MDDoodle;
      const a = (D && D.active) || (root && Array.isArray(root.LG_STYLES) && root.LG_STYLES[0]);
      return styleOf(a);
    } catch (e) { return 'legion'; }
  }
  const stroke = (ink) => (w = 2.6) => `stroke="${ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const listOf = (st) => S[styleOf(st)].list.map((x, i) => ({ id: IDS[i], name: x[0] }));
  function svg(id, size, title, style) {
    const st = S[style === undefined ? curStyle() : styleOf(style)], i = Math.max(0, IDS.indexOf(String(id))), e = st.list[i];
    const s = Math.max(8, Math.round(Number(size) || 64)), O = stroke(st.ink);
    const t = title == null ? `Герб: ${e[0]}` : String(title);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}" role="img" aria-label="${esc(t)}" class="lg-emb">`
      + (t ? `<title>${esc(t)}</title>` : '') + st.frame(e[1], O, st.ink) + e[3](e[2], O, st.ink) + '</svg>';
  }
  function icon(name, style, size) {
    if (!ICONS.includes(name)) return '';
    const sid = style === undefined || style === null ? curStyle() : styleOf(style), st = S[sid], O = stroke(st.ink);
    const s = Math.max(8, Math.round(Number(size) || 24)), g = (GX[sid] && GX[sid][name]) || G[name];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${s}" height="${s}" aria-hidden="true" focusable="false" class="lg-gi">`
      + TILE[st.tile.shape](st.tile, O) + g(st.pal, O) + '</svg>';
  }
  const api = {
    styles: STYLES.slice(), style: curStyle, listOf, ids: IDS.slice(), has: (id) => IDS.includes(String(id)), svg, icons: ICONS.slice(), icon,
  };

  Object.defineProperty(api, 'list', { enumerable: true, get: () => listOf(curStyle()) });
  return api;
});
