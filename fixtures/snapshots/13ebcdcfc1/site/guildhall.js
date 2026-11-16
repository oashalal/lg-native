


















(function (root, factory) {
  const D = factory();
  if (typeof module === 'object' && module.exports) module.exports = D;
  else root.LGGuildHallMap = D;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const W = 3840, H = 3240;
  const TIER_MAX = 5;

  const WALL_Y = 420, SIDE = 170, BOTTOM = 3060, DOOR_W = 240, CX = W / 2;

  const DAIS_Y = 1180, STEP_Y = 1360, STEP_X0 = 760, STEP_X1 = 3080;
  const CARPET = [CX - 120, CX + 120];

  const COLUMNS = [[1300, 1700], [2540, 1700], [1300, 2300], [2540, 2300]];

  const OBJ = Object.freeze([
    { id: 'desk', title: 'Стойка', sub: 'состав и журнал гильдии', act: 'desk', vis: [1180, 2540, 1700, 2820], foot: [1190, 2700, 1690, 2820], door: { x: 1440, y: 2870 } },
    { id: 'chest', title: 'Казна', sub: '«Подарок» и сундуки гильдии', act: 'chest', vis: [330, 2480, 930, 2860], foot: [350, 2740, 910, 2860], door: { x: 630, y: 2910 } },
    { id: 'board', title: 'Доска заданий', sub: 'задания дня и задания наёмников', act: 'board', vis: [340, 1460, 900, 1900], foot: [360, 1840, 880, 1900], door: { x: 620, y: 1950 } },
    { id: 'trophy', title: 'Зал трофеев', sub: 'уровень, опыт, победы гильдии', act: 'trophy', vis: [2940, 1420, 3500, 1900], foot: [2960, 1820, 3480, 1900], door: { x: 3220, y: 1950 } },
    { id: 'banner', title: 'Знамя гильдии', sub: 'герб и окно гильдии', act: 'guild', vis: [1740, 40, 2100, 470], foot: null, door: { x: 1920, y: 860 } },
    { id: 'throne', title: 'Трон главы', sub: 'глава гильдии', act: 'throne', vis: [1770, 480, 2070, 780], foot: [1790, 680, 2050, 780], door: { x: 1920, y: 830 } },
    { id: 'table', title: 'Стол руководства', sub: 'управление гильдией', act: 'table', vis: [2260, 760, 3000, 1060], foot: [2270, 900, 2990, 1060], door: { x: 2630, y: 1110 } },
    { id: 'fire', title: 'Камин', sub: 'здесь греются после вылазок', act: 'fire', vis: [330, 150, 830, 560], foot: [350, 440, 810, 560], door: { x: 580, y: 610 } },
    { id: 'map', title: 'Карта мира', sub: 'округа и города', act: 'map', vis: [3000, 110, 3520, 560], foot: [3040, 470, 3480, 560], door: { x: 3260, y: 610 } },
    { id: 'door', title: 'Выход', sub: 'на улицу города', act: 'exit', vis: [CX - DOOR_W / 2 - 30, BOTTOM - 260, CX + DOOR_W / 2 + 30, H], foot: null, door: { x: CX, y: BOTTOM - 40 } },
  ].map((o) => Object.freeze(o)));

  


  const DECOR = Object.freeze({
    carpet: Object.freeze([1, 2, 3, 3, 4]),
    banners: Object.freeze([0, 2, 4, 6, 8]),
    trophies: Object.freeze([0, 1, 2, 4, 6]),
    gold: Object.freeze([0, 0, 1, 2, 3]),
    candles: Object.freeze([0, 2, 4, 6, 8]),
    braziers: Object.freeze([0, 0, 0, 2, 4]),
  });
  const TITLE = Object.freeze({
    carpet: ['простая дорожка', 'дорожка с золотой каймой', 'ковёр с узором', 'ковёр с узором', 'парадный ковёр с бахромой'],
    gold: ['', '', 'позолоченные капители колонн', 'позолоченный трон', 'позолота трона, колонн и стола'],
  });
  const tierOf = (level) => Math.max(1, Math.min(TIER_MAX, Math.floor(+level || 1)));
   
  function decor(level) { const t = tierOf(level), out = { tier: t }; for (const k of Object.keys(DECOR)) out[k] = DECOR[k][t - 1]; return out; }
   
  function nextDecor(level) {
    const t = tierOf(level); if (t >= TIER_MAX) return null;
    const a = decor(t), b = decor(t + 1), out = [];
    if (b.carpet !== a.carpet) out.push(TITLE.carpet[t]);
    if (b.banners > a.banners) out.push(`знамёна на стенах: ${b.banners}`);
    if (b.trophies > a.trophies) out.push(`трофеи на стенах: ${b.trophies}`);
    if (b.gold !== a.gold && TITLE.gold[t]) out.push(TITLE.gold[t]);
    if (b.candles > a.candles) out.push(`канделябры: ${b.candles}`);
    if (b.braziers > a.braziers) out.push(a.braziers ? 'жаровни по краям холла' : 'жаровни у трона');
    return out;
  }

  


  const BANNER_AT = Object.freeze([[1420, 90, 'b'], [2420, 90, 'b'], [1120, 90, 'b'], [2720, 90, 'b'], [SIDE / 2, 640, 'l'], [W - SIDE / 2, 640, 'r'], [SIDE / 2, 2368, 'l'], [W - SIDE / 2, 2368, 'r']]);
  const TROPHY_AT = Object.freeze([[1270, 170, 'b'], [2570, 170, 'b'], [960, 150, 'b'], [2880, 150, 'b'], [SIDE / 2, 1950, 'l'], [W - SIDE / 2, 1950, 'r']]);

  const CANDLE_AT = Object.freeze([[1050, 1500], [2790, 1500], [1050, 2500], [2790, 2500], [300, 1300], [3540, 1300], [300, 2300], [3540, 2300]]);
  const BRAZIER_AT = Object.freeze([[1620, 770], [2200, 740], [300, 2060], [3540, 2060]].map((p) => Object.freeze(p)));

  const RACK = Object.freeze({ vis: [2960, 2520, 3520, 2860], foot: [2970, 2770, 3510, 2860] });

   
  function obstacles(level) {
    const OB = [];
    for (const o of OBJ) if (o.foot) OB.push({ r: o.foot.slice(), tag: o.id });
    for (const [x, y] of COLUMNS) OB.push({ e: [x, y - 10, 62, 30], tag: 'column' });

    OB.push({ r: [SIDE, DAIS_Y - 20, STEP_X0, STEP_Y - 40], tag: 'rail' }, { r: [STEP_X1, DAIS_Y - 20, W - SIDE, STEP_Y - 40], tag: 'rail' });
    const d = decor(level);
    for (let i = 0; i < d.candles; i++) { const [x, y] = CANDLE_AT[i]; OB.push({ e: [x, y - 6, 20, 12], tag: 'candle' }); }
    for (let i = 0; i < d.braziers; i++) { const [x, y] = BRAZIER_AT[i]; OB.push({ e: [x, y - 6, 30, 14], tag: 'brazier' }); }
    OB.push({ r: RACK.foot.slice(), tag: 'rack' });
    return OB;
  }
   
  const FLOOR = Object.freeze([[SIDE, WALL_Y + 40], [W - SIDE, WALL_Y + 40], [W - SIDE, BOTTOM], [CX + DOOR_W / 2, BOTTOM], [CX + DOOR_W / 2, BOTTOM + 60], [CX - DOOR_W / 2, BOTTOM + 60], [CX - DOOR_W / 2, BOTTOM], [SIDE, BOTTOM]].map((p) => Object.freeze(p)));
  const SPAWN = Object.freeze([CX, BOTTOM - 260]);
   
  function spec(level) {
    return { W, H, OB: obstacles(level), bounds: FLOOR.map((p) => p.slice()), buildings: OBJ.map((o) => ({ id: o.id, vis: o.vis, door: o.door })), home: { x: SPAWN[0], y: SPAWN[1] }, spawn: SPAWN.slice() };
  }
   
  function hallSpot(i) { const k = Math.max(0, i | 0), col = k % 6, row = Math.floor(k / 6) % 4; return [CX - 420 + col * 168 + (row % 2) * 84, 1700 + row * 170]; }

  const G = Object.freeze({ WALL_Y, SIDE, BOTTOM, DOOR_W, CX, DAIS_Y, STEP_Y, STEP_X0, STEP_X1, CARPET, COLUMNS, BANNER_AT, TROPHY_AT, CANDLE_AT, BRAZIER_AT, RACK });
  return { W, H, TIER_MAX, DECOR, TITLE, OBJ, FLOOR, SPAWN, G, tierOf, decor, nextDecor, obstacles, spec, hallSpot };
});














(function (root) {
  'use strict';

  let KA = null, ML = null;
  const kit = () => KA || (typeof window !== 'undefined' && window.LGTownKitArt) || null;
  const map = () => ML || (typeof window !== 'undefined' && window.LGGuildHallMap) || null;
  const use = (A, L) => { KA = A || null; ML = L || null; };
  const COLORS = ['#c0504a', '#4a6fb0', '#3f8f8a', '#7a4a78', '#d9a23a', '#2f6b3a', '#b0506e', '#3b3480'];
   
  const colorOf = (id) => { let h = 7; for (const c of String(id || '')) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; };

  




  const THEME = {
    legion: { name: 'Легион', sky: '#3b2f2c', glow: '#ffcf6a', wall: '#8c7468', wallD: '#6d5a52', wallL: '#a48a7c', wallPat: 'brick', wain: '#8a5a3a', wainD: '#5e3a24',
      floor: '#c79a6a', floorD: '#a77b52', floorL: '#d8ae80', floorKind: 'planks', dais: '#b9aca2', daisD: '#9a8d84', daisL: '#cfc4bb', daisKind: 'flag',
      stone: '#9c8f8a', stoneD: '#776a66', stoneL: '#c2b6ae', wood: '#8a5a3a', woodD: '#5e3a24', woodL: '#b07a52', metal: '#ffcf4a', metalD: '#c99a20', iron: '#4a4450',
      fab: '#b8323a', fabD: '#7e1f28', fabL: '#d9545a', carpet: 'diamond', light: 'candelabra', loot: 'legion', note: ['#fff4dc', '#f4e1b8', '#f7e8c8'], sign: '#5e3a24', glass: '#bfe0f0' },
    cats: { name: 'Котики', sky: '#4a3428', glow: '#ffd08a', wall: '#f3d9b8', wallD: '#c9a27c', wallL: '#fbe8cf', wallPat: 'paper', wain: '#c8956a', wainD: '#8f5f3c',
      floor: '#e3b98c', floorD: '#c08e62', floorL: '#f2d3a8', floorKind: 'planks', dais: '#f2d3a8', daisD: '#d2a878', daisL: '#fbe4c4', daisKind: 'flag',
      stone: '#d9b8a0', stoneD: '#b08e78', stoneL: '#f0d8c4', wood: '#a8754f', woodD: '#6e4a2f', woodL: '#c8956a', metal: '#ffcf4a', metalD: '#d0a030', iron: '#6e4a5a',
      fab: '#ff8fa3', fabD: '#e07a98', fabL: '#ffd0dc', carpet: 'paws', light: 'candelabra', loot: 'cats', ears: true, note: ['#fff4e0', '#ffd0dc', '#e0f0ff'], sign: '#7a4a78', glass: '#cfe8f4' },
    monkeys: { name: 'Обезьяны', sky: '#1f3a1e', glow: '#ffd27a', wall: '#a8754f', wallD: '#6b4423', wallL: '#c08a5e', wallPat: 'bamboo', wain: '#c9b24a', wainD: '#8a7420',
      floor: '#b88a52', floorD: '#8a6034', floorL: '#d0a46a', floorKind: 'planks', dais: '#8f9a64', daisD: '#6a7448', daisL: '#a8b47a', daisKind: 'slab',
      stone: '#8a8a6a', stoneD: '#646448', stoneL: '#a8a888', wood: '#8a5a33', woodD: '#5a3a1e', woodL: '#c08a4e', metal: '#ffd23f', metalD: '#c09a20', iron: '#5a4a30',
      fab: '#d9b84a', fabD: '#4f8a3a', fabL: '#f0d878', carpet: 'weave', light: 'torch', loot: 'monkeys', note: ['#f0dca8', '#e8d090', '#f6e8c0'], sign: '#5a3a1e', glass: '#c8e4b8' },
    veggies: { name: 'Овощи', sky: '#3a2e1e', glow: '#ffe08a', wall: '#fff1d0', wallD: '#d8c8a0', wallL: '#fffaea', wallPat: 'tiles', wain: '#6fae4a', wainD: '#3f7a2a',
      floor: '#f4ecd8', floorD: '#c8b890', floorL: '#fffaf0', floorKind: 'checker', dais: '#d98a5a', daisD: '#a85a34', daisL: '#e8a878', daisKind: 'terra',
      stone: '#c8b8a0', stoneD: '#9a8a70', stoneL: '#e4d8c4', wood: '#b07a4a', woodD: '#6b4423', woodL: '#d8a070', metal: '#e08a3a', metalD: '#a85a1e', iron: '#4a4a4a',
      fab: '#e5383b', fabD: '#a81e22', fabL: '#fffbea', carpet: 'gingham', light: 'candelabra', loot: 'veggies', note: ['#fffbea', '#fff6dc', '#eaf6d8'], sign: '#3f7a2a', glass: '#d8f0e0' },
    '42brothers': { name: '42 Братухи', sky: '#120818', glow: '#ff8ad8', wall: '#3a1f4a', wallD: '#24102e', wallL: '#5a3470', wallPat: 'neon', wain: '#5a2a6e', wainD: '#341040',
      floor: '#2a2030', floorD: '#160e1c', floorL: '#4a3a54', floorKind: 'marble', dais: '#f0c8e0', daisD: '#c890b4', daisL: '#ffe4f2', daisKind: 'marble',
      stone: '#6a5a7a', stoneD: '#46385a', stoneL: '#9a88aa', wood: '#2a1a30', woodD: '#14081a', woodL: '#4a3050', metal: '#f4c542', metalD: '#c0901a', iron: '#2a1a30',
      fab: '#ff4fa3', fabD: '#c02a78', fabL: '#ff9ad0', carpet: 'stars', light: 'neon', loot: '42brothers', note: ['#fff4fb', '#ffd1ea', '#d8f4ff'], sign: '#7a3fd0', glass: '#a8e8ff' },
    cherts: { name: 'Чертики', sky: '#140808', glow: '#ff8a3a', wall: '#3a2626', wallD: '#241414', wallL: '#5a3a3a', wallPat: 'cracks', wain: '#4a2a2a', wainD: '#2a1414',
      floor: '#3a2e2e', floorD: '#1e1414', floorL: '#5a4444', floorKind: 'basalt', dais: '#4a3434', daisD: '#2a1a1a', daisL: '#6a4a4a', daisKind: 'basalt',
      stone: '#5a4444', stoneD: '#3a2a2a', stoneL: '#7a6060', wood: '#4a2a1e', woodD: '#2a140c', woodL: '#6a3e2a', metal: '#ffc23d', metalD: '#ff6a2a', iron: '#2a2a30',
      fab: '#7a1414', fabD: '#4a0a0a', fabL: '#d81e1e', carpet: 'flame', light: 'brazier', loot: 'cherts', note: ['#e8d8b8', '#d8c09a', '#f0e0c0'], sign: '#2e1e1e', glass: '#ff9a5a' },
    ugabugi: { name: 'Уга-Буги', sky: '#2a2218', glow: '#ffc060', wall: '#9a8a72', wallD: '#6d5f4c', wallL: '#b4a48a', wallPat: 'cave', wain: '#7a6a54', wainD: '#54473a',
      floor: '#b89a6a', floorD: '#8a7048', floorL: '#d0b488', floorKind: 'earth', dais: '#a8a090', daisD: '#7a7266', daisL: '#c4bcaa', daisKind: 'slab',
      stone: '#9a9080', stoneD: '#6e665a', stoneL: '#b9b1a3', wood: '#8a5a33', woodD: '#5a3a1e', woodL: '#b07a4a', metal: '#efe6d4', metalD: '#c4b89a', iron: '#6d5f4c',
      fab: '#c8a070', fabD: '#8a6a40', fabL: '#e8c898', carpet: 'hide', light: 'torch', loot: 'ugabugi', note: ['#cfc6b6', '#e0d6c0', '#d8ccb0'], sign: '#6d5f4c', glass: '#d8c8a0' },
  };
  const STYLES = Object.keys(THEME);
  const themeOf = (s) => THEME[s] || THEME.legion;

   

  const glow = (x, y, r, op = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#ghGlow)"${op !== 1 ? ` opacity="${op}"` : ''}/>`;
  const flame = (A, x, y, s = 1, c = '#ffb43a', c2 = '#ffe27a') => `<path d="M${x} ${y} q${-8 * s} ${-12 * s} 0 ${-26 * s} q${8 * s} ${14 * s} 0 ${26 * s} Z" fill="${c}" ${A.O(1.8)}/><path d="M${x} ${y - 3 * s} q${-3.5 * s} ${-6 * s} 0 ${-13 * s} q${3.5 * s} ${7 * s} 0 ${13 * s} Z" fill="${c2}"/>`;
  const candleS = (A, x, base, h = 30, c) => `<rect x="${x - 6}" y="${base - h}" width="12" height="${h}" rx="3" fill="${c || A.P.cream}" ${A.O(2.2)}/>` + flame(A, x, base - h - 2, 0.9);
  const shadowE = (A, cx, cy, rx, ry, op = 0.22) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${A.INK}" opacity="${op}"/>`;
  const shadowR = (A, x0, y, x1, h = 26, op = 0.2) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="${h / 2}" fill="${A.INK}" opacity="${op}"/>`;

  function boxV(A, x0, top, x1, B, dd, c, cTop, o = {}) {
    const k = o.k == null ? 14 : o.k;
    let s = `<path d="${A.poly([[x0, top], [x1, top], [x1 - k, top - dd], [x0 + k, top - dd]])}" fill="${cTop || A.lt(c, 0.18)}" ${A.O(o.w || 4)}/>`;
    s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${B - top}" fill="${c}" ${A.O(o.w || 4)}/>`;
    s += `<path d="M${x0 + 4} ${top + 4} H${x1 - 4}" stroke="#fff" stroke-width="3" opacity=".22" stroke-linecap="round"/><path d="M${x1 - 8} ${top + 6} V${B - 4}" stroke="${A.INK}" stroke-width="10" opacity=".14"/>`;
    return s;
  }

   
  function lootSvg(A, T, k) {
    const O = A.O, P = A.P;
    switch (T.loot) {
      case 'cats': return k % 2 ? A.fish(0, -12, 0.8, '#8fb6c8', -10) : A.yarn(0, -16, 15, k % 3 ? P.pink : '#9ad0ff');
      case 'monkeys': return `<path d="M-4 -40 q2 -6 6 -6" stroke="${A.INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` + [-16, -2, 12].map((dx, i) => `<path d="M${dx - 8} -${36 - i * 2} C${dx - 16} -16 ${dx - 2} 0 ${dx + 14} -2 C${dx + 4} -6 ${dx - 2} -20 ${dx + 2} -${36 - i * 2} Z" fill="#ffd23f" ${O(2.4)}/>`).join('');
      case 'veggies': return k % 2 ? `<path d="M-6 -4 Q-14 -26 -2 -40 Q8 -26 4 -4 Z" fill="#ff7a2f" ${O(2.4)}/><path d="M-6 -16 h6 M-4 -26 h6" stroke="${A.INK}" stroke-width="1.6" opacity=".4"/><path d="M-2 -40 q-8 -12 -2 -16 q2 6 4 10 q4 -10 10 -8 q-4 6 -8 14" fill="#5aa83a" ${O(2)}/>`
        : `<circle cx="0" cy="-15" r="15" fill="#e5383b" ${O(2.6)}/><path d="M-8 -28 l8 4 l8 -4 l-4 8 h-8 Z" fill="#5aa83a" ${O(1.8)}/><path d="M-8 -18 q2 -6 8 -6" stroke="#fff" stroke-width="2.4" fill="none" opacity=".6" stroke-linecap="round"/>`;
      case '42brothers': return `<path d="M-16 -26 L-8 -36 H8 L16 -26 L0 -2 Z" fill="${k % 2 ? '#bfefff' : '#ff9ad0'}" ${O(2.4)}/><path d="M-16 -26 H16 M-8 -36 L-4 -26 L0 -2 L4 -26 L8 -36" fill="none" stroke="${A.INK}" stroke-width="1.6"/><path d="M-10 -30 l3 -3" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
      case 'cherts': return `<path d="M-16 -18 Q-16 -38 0 -38 Q16 -38 16 -18 Q16 -10 10 -8 V0 H-10 V-8 Q-16 -10 -16 -18 Z" fill="#efe3c8" ${O(2.4)}/><circle cx="-6" cy="-20" r="4.2" fill="${A.INK}"/><circle cx="6" cy="-20" r="4.2" fill="${A.INK}"/><circle cx="-6" cy="-20" r="1.4" fill="#ff6a2a"/><circle cx="6" cy="-20" r="1.4" fill="#ff6a2a"/><path d="M-4 -4 V-8 M0 -4 V-8 M4 -4 V-8" stroke="${A.INK}" stroke-width="1.6"/>`;
      case 'ugabugi': return `<path d="M-22 -10 q-8 -8 -2 -12 q6 -2 8 4 L14 -16 q4 -8 10 -4 q4 6 -4 8 q6 4 0 8 q-6 2 -8 -4 L-12 -2 q-2 8 -8 6 q-6 -4 -2 -10 Z" fill="#efe6d4" ${O(2.4)}/>`;
      default: return `<path d="M-12 -40 H12 Q12 -22 2 -18 V-6 H10 V0 H-10 V-6 H-2 V-18 Q-12 -22 -12 -40 Z" fill="${P.gold}" ${O(2.4)}/><path d="M-7 -36 q0 10 6 14" stroke="#fff" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/><circle cx="0" cy="-30" r="3.4" fill="#c0304a" ${O(1.4)}/>`;
    }
  }
  const loot = (A, T, x, y, s = 1, k = 0) => `<g transform="translate(${A.f1(x)} ${A.f1(y)}) scale(${s})">${lootSvg(A, T, k)}</g>`;

  function cupSvg(A, T, c) {
    const O = A.O, ped = `<path d="M-26 0 H26 V-12 H-26 Z M-16 -12 H16 V-22 H-16 Z" fill="${A.dk(c, 0.18)}" ${O(2.8)}/>`;
    const shine = `<path d="M-12 -84 q-4 20 4 34" stroke="#fff" stroke-width="3.6" fill="none" opacity=".55" stroke-linecap="round"/>`;
    switch (T.loot) {
      case 'cats': return ped + `<g transform="translate(0 -56) rotate(-30)"><path d="M-30 0 C-16 -16 12 -16 22 0 C12 16 -16 16 -30 0 Z M20 0 L36 -13 L33 0 L36 13 Z" fill="${c}" ${O(3)}/><circle cx="-18" cy="-3" r="3" fill="${A.INK}"/></g>` + shine;
      case 'monkeys': return ped + `<path d="M-6 -24 C-34 -44 -20 -86 4 -96 C-6 -72 4 -44 22 -30 C10 -22 0 -22 -6 -24 Z" fill="${c}" ${O(3)}/><path d="M4 -96 l4 -8" stroke="${A.INK}" stroke-width="5" stroke-linecap="round"/>` + shine;
      case 'veggies': return ped + `<path d="M-14 -24 Q-22 -70 0 -92 Q18 -70 12 -24 Z" fill="${c}" ${O(3)}/><path d="M-12 -46 h10 M-14 -62 h10 M2 -36 h8" stroke="${A.INK}" stroke-width="2.2" opacity=".4"/><path d="M0 -92 q-16 -18 -6 -26 q4 10 6 16 q8 -18 18 -12 q-8 8 -16 22" fill="#5aa83a" ${O(2.2)}/>` + shine;
      case '42brothers': return ped + `<path d="M-30 -64 L-16 -84 H16 L30 -64 L0 -24 Z" fill="${c === T.metal ? '#bfefff' : c}" ${O(3)}/><path d="M-30 -64 H30 M-16 -84 L-8 -64 L0 -24 L8 -64 L16 -84" fill="none" stroke="${A.INK}" stroke-width="2.2"/><path d="M-20 -70 l6 -8" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><circle cx="22" cy="-86" r="4" fill="#fff"/>`;
      case 'cherts': return ped + `<path d="M-26 -60 Q-26 -92 0 -92 Q26 -92 26 -60 Q26 -46 16 -42 V-24 H-16 V-42 Q-26 -46 -26 -60 Z" fill="${c}" ${O(3)}/><path d="M-22 -80 Q-40 -96 -34 -110 Q-26 -96 -14 -90 M22 -80 Q40 -96 34 -110 Q26 -96 14 -90" fill="${c}" ${O(2.6)}/><circle cx="-10" cy="-62" r="6.5" fill="${A.INK}"/><circle cx="10" cy="-62" r="6.5" fill="${A.INK}"/><circle cx="-10" cy="-62" r="2" fill="#ff6a2a"/><circle cx="10" cy="-62" r="2" fill="#ff6a2a"/>`;
      case 'ugabugi': return ped + `<path d="M-10 -22 C-40 -40 -30 -90 10 -104 C-8 -80 -4 -44 14 -26 Z" fill="${c === T.metal ? '#f4ecd8' : c}" ${O(3)}/><path d="M-12 -40 l10 -2 M-16 -56 l10 -2 M-12 -72 l10 -4" stroke="${A.INK}" stroke-width="2" opacity=".35"/>`;
      default: return ped + `<path d="M-30 -96 H30 C30 -58 14 -42 0 -40 C-14 -42 -30 -58 -30 -96 Z" fill="${c}" ${O(3)}/><path d="M-30 -88 q-22 4 -16 26 q8 10 18 4 M30 -88 q22 4 16 26 q-8 10 -18 4" fill="none" stroke="${A.INK}" stroke-width="5"/><path d="M-30 -88 q-22 4 -16 26 q8 10 18 4 M30 -88 q22 4 16 26 q-8 10 -18 4" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M-6 -40 h12 v18 h-12 Z" fill="${c}" ${O(2.6)}/>` + shine;
    }
  }
  const cup = (A, T, x, y, s, c) => `<g transform="translate(${A.f1(x)} ${A.f1(y)}) scale(${s})">${cupSvg(A, T, c)}</g>`;

   
  function crest(A, emblem, x, y, s, color) {
    if (emblem && /^<svg[\s>]/.test(emblem)) {
      const inner = emblem.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/g, '');
      return `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 64 64" overflow="visible">${inner}</svg>`;
    }
    const k = s / 64;
    return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M6 6 H58 V30 C58 46 44 56 32 62 C20 56 6 46 6 30 Z" fill="${color}" ${A.O(4)}/><path d="M32 16 l12 14 l-12 14 l-12 -14 Z" fill="${A.P.gold}" ${A.O(3)}/></g>`;
  }
   
  function banner(A, T, x, top, w, h, color, emb, gold) {
    const trim = gold ? T.metal : T.woodL, hw = w / 2;
    let s = `<path d="M${x - hw + 6} ${top + 10} H${x + hw + 6} V${top + h + 6} L${x + 6} ${top + h - w * 0.28 + 6} L${x - hw + 6} ${top + h + 6} Z" fill="${A.INK}" opacity=".22"/>`;
    s += `<path d="M${x - hw - 14} ${top} H${x + hw + 14}" stroke="${A.INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x - hw - 14} ${top} H${x + hw + 14}" stroke="${trim}" stroke-width="6" stroke-linecap="round"/>`;
    s += `<circle cx="${x - hw - 16}" cy="${top}" r="8" fill="${trim}" ${A.O(2.4)}/><circle cx="${x + hw + 16}" cy="${top}" r="8" fill="${trim}" ${A.O(2.4)}/>`;
    s += `<path d="M${x - hw} ${top + 4} H${x + hw} V${top + h} L${x} ${top + h - w * 0.28} L${x - hw} ${top + h} Z" fill="${color}" ${A.O(4)}/>`;
    s += `<path d="M${x - hw * 0.45} ${top + 8} V${top + h - w * 0.2} M${x + hw * 0.45} ${top + 8} V${top + h - w * 0.2}" stroke="${A.INK}" stroke-width="${Math.max(4, w * 0.08)}" opacity=".12"/>`;
    s += `<path d="M${x - hw + 7} ${top + 6} V${top + h - 10} M${x + hw - 7} ${top + 6} V${top + h - 10}" stroke="${T.metal}" stroke-width="3" opacity=".85"/><path d="M${x - hw + 8} ${top + 14} H${x + hw - 8}" stroke="${T.metal}" stroke-width="4" opacity=".9"/>`;
    s += emb || `<path d="M${x} ${top + h * 0.3} l${w * 0.18} ${w * 0.2} l${-w * 0.18} ${w * 0.2} l${-w * 0.18} ${-w * 0.2} Z" fill="${T.metal}" ${A.O(2.4)}/>`;
    for (const tx of [x - hw, x + hw]) s += `<path d="M${tx} ${top + h} v14" stroke="${A.INK}" stroke-width="7" stroke-linecap="round"/><path d="M${tx} ${top + h} v14" stroke="${T.metal}" stroke-width="3.4" stroke-linecap="round"/>`;
    return s;
  }
   
  function trophy(A, T, k, x, y) {
    const O = A.O, P = A.P, steel = T.id === 'ugabugi' ? '#cfc6b6' : '#d6dbe4';
    if (k % 4 === 0) return `<g><path d="M${x - 52} ${y + 10} L${x + 52} ${y + 96} M${x + 52} ${y + 10} L${x - 52} ${y + 96}" stroke="${A.INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x - 52} ${y + 10} L${x + 52} ${y + 96} M${x + 52} ${y + 10} L${x - 52} ${y + 96}" stroke="${steel}" stroke-width="6" stroke-linecap="round"/>`
      + `<path d="M${x - 34} ${y + 16} H${x + 34} V${y + 56} C${x + 34} ${y + 80} ${x + 14} ${y + 94} ${x} ${y + 100} C${x - 14} ${y + 94} ${x - 34} ${y + 80} ${x - 34} ${y + 56} Z" fill="${T.fab}" ${O(4)}/><path d="M${x - 26} ${y + 22} H${x + 26} V${y + 56} C${x + 26} ${y + 74} ${x + 12} ${y + 86} ${x} ${y + 90} C${x - 12} ${y + 86} ${x - 26} ${y + 74} ${x - 26} ${y + 56} Z" fill="none" stroke="${T.metal}" stroke-width="3"/><path d="M${x} ${y + 30} V${y + 84} M${x - 20} ${y + 50} H${x + 20}" stroke="${T.metal}" stroke-width="7"/></g>`;
    if (k % 4 === 1) {
      if (T.id === 'monkeys' || T.id === 'ugabugi' || T.id === 'cherts') {
        const c = T.id === 'monkeys' ? '#c08a4e' : '#efe6d4';
        return `<g><path d="M${x - 40} ${y + 6} H${x + 40} L${x + 34} ${y + 112} H${x - 34} Z" fill="${T.woodD}" ${O(3.5)}/><path d="M${x - 26} ${y + 24} Q${x - 30} ${y + 60} ${x} ${y + 100} Q${x + 30} ${y + 60} ${x + 26} ${y + 24} Q${x} ${y + 10} ${x - 26} ${y + 24} Z" fill="${c}" ${O(3.5)}/><path d="M${x - 16} ${y + 48} l10 4 M${x + 16} ${y + 48} l-10 4" stroke="${A.INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x - 10} ${y + 76} Q${x} ${y + 84} ${x + 10} ${y + 76}" fill="none" stroke="${A.INK}" stroke-width="4"/>`
          + `<path d="M${x - 24} ${y + 26} Q${x - 56} ${y + 6} ${x - 50} ${y - 22} Q${x - 40} ${y + 2} ${x - 18} ${y + 14} M${x + 24} ${y + 26} Q${x + 56} ${y + 6} ${x + 50} ${y - 22} Q${x + 40} ${y + 2} ${x + 18} ${y + 14}" fill="${T.id === 'cherts' ? '#d81e1e' : '#f1e2c4'}" ${O(3)}/></g>`;
      }
      return `<g><rect x="${x - 26}" y="${y + 44}" width="52" height="40" rx="10" fill="${T.woodL}" ${O(3.5)}/><path d="M${x - 14} ${y + 46} C${x - 40} ${y + 30} ${x - 64} ${y + 10} ${x - 58} ${y - 12} M${x - 44} ${y + 26} l-26 -4 M${x + 14} ${y + 46} C${x + 40} ${y + 30} ${x + 64} ${y + 10} ${x + 58} ${y - 12} M${x + 44} ${y + 26} l26 -4" stroke="${A.INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${x - 14} ${y + 46} C${x - 40} ${y + 30} ${x - 64} ${y + 10} ${x - 58} ${y - 12} M${x - 44} ${y + 26} l-26 -4 M${x + 14} ${y + 46} C${x + 40} ${y + 30} ${x + 64} ${y + 10} ${x + 58} ${y - 12} M${x + 44} ${y + 26} l26 -4" stroke="#f1e2c4" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y + 66}" r="9" fill="${T.metal}" ${O(2.4)}/></g>`;
    }
    if (k % 4 === 2) return `<g><path d="M${x - 40} ${y + 100} L${x + 30} ${y + 4} M${x + 40} ${y + 100} L${x - 30} ${y + 4}" stroke="${A.INK}" stroke-width="11" stroke-linecap="round"/><path d="M${x - 40} ${y + 100} L${x + 30} ${y + 4} M${x + 40} ${y + 100} L${x - 30} ${y + 4}" stroke="${T.woodL}" stroke-width="5" stroke-linecap="round"/>`
      + `<path d="M${x + 18} ${y + 2} q30 -6 36 24 q-24 -6 -30 8 Z M${x - 18} ${y + 2} q-30 -6 -36 24 q24 -6 30 8 Z" fill="${steel}" ${O(3.5)}/><circle cx="${x}" cy="${y + 52}" r="8" fill="${T.metal}" ${O(2.4)}/></g>`;

    return `<g><rect x="${x - 70}" y="${y + 90}" width="140" height="14" rx="4" fill="${T.woodL}" ${O(3)}/><path d="M${x - 50} ${y + 104} l14 22 M${x + 50} ${y + 104} l-14 22" stroke="${T.woodD}" stroke-width="7" stroke-linecap="round"/>`
      + loot(A, T, x - 36, y + 90, 0.9, 0) + loot(A, T, x + 10, y + 90, 1, 1) + `<path d="M${x + 40} ${y + 90} v-30 h20 v30 Z" fill="${P.cream}" ${O(2.4)}/><path d="M${x + 44} ${y + 66} h12 M${x + 44} ${y + 74} h12" stroke="${A.INK}" stroke-width="1.6" opacity=".4"/></g>`;
  }

   
  function floorPat(A, T, kind, x0, y0, x1, y1, base, dk, lt, seed) {
    const r = A.rng(seed), f = A.f1;
    let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${base}"/>`;
    if (kind === 'planks') {
      let t = '', alt = '', grain = '';
      for (let yy = Math.floor(y0 / 48) * 48, i = Math.floor(y0 / 48); yy < y1; yy += 48, i++) {
        const a = Math.max(y0, yy), b = Math.min(y1, yy + 48);
        if (yy >= y0) t += `M${x0} ${yy} H${x1} `;
        for (let xx = x0 - 330 + ((i * 110) % 330); xx < x1; xx += 330) {
          if (xx > x0) t += `M${xx} ${a} V${b} `;
          if ((i * 7 + Math.round(xx / 330)) % 3 === 0) alt += `M${Math.max(x0, xx)} ${a} H${Math.min(x1, xx + 330)} V${b} H${Math.max(x0, xx)} Z `;
          if (r() < 0.35 && b - a > 30) { const gx = Math.max(x0, xx) + 40 + r() * 200; grain += `M${f(gx)} ${a + 16} q40 -6 80 0 q30 4 60 0 `; }
          if (r() < 0.12 && xx + 30 > x0 && xx + 30 < x1 && b - a > 30) grain += `M${xx + 26} ${a + 24} m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 `;
        }
      }
      s += `<path d="${alt}" fill="${lt}" opacity=".35"/><path d="${grain}" fill="none" stroke="${dk}" stroke-width="2" opacity=".45"/><path d="${t}" stroke="${dk}" stroke-width="3" opacity=".85"/>`;
    } else if (kind === 'flag' || kind === 'terra' || kind === 'slab') {
      const tw = kind === 'terra' ? 90 : 120, th = kind === 'terra' ? 90 : 90;
      let t = '', hi = '', alt = '';
      for (let yy = Math.floor(y0 / th) * th, i = Math.floor(y0 / th); yy < y1; yy += th, i++) for (let xx = Math.floor(x0 / tw) * tw - (i % 2 && kind !== 'terra' ? tw / 2 : 0); xx < x1; xx += tw) {
        const a = Math.max(y0, yy), b = Math.min(y1, yy + th), l = Math.max(x0, xx), rr = Math.min(x1, xx + tw);
        if (b - a < 6 || rr - l < 6) continue;
        if (kind === 'slab') t += `M${l + 10} ${a + 6} H${rr - 10} Q${rr - 4} ${a + 6} ${rr - 4} ${a + 14} V${b - 10} Q${rr - 4} ${b - 4} ${rr - 12} ${b - 4} H${l + 12} Q${l + 4} ${b - 4} ${l + 4} ${b - 12} V${a + 14} Q${l + 4} ${a + 6} ${l + 10} ${a + 6} Z `;
        else { t += `M${l} ${a} H${rr} M${l} ${a} V${b} `; hi += `M${l + 6} ${b - 6} V${a + 6} H${rr - 8} `; }
        if (r() < 0.3) alt += `M${l + 4} ${a + 4} H${rr - 4} V${b - 4} H${l + 4} Z `;
      }
      if (kind === 'slab') s += `<path d="${alt}" fill="${lt}" opacity=".35"/><path d="${t}" fill="${lt}" opacity=".35" stroke="${dk}" stroke-width="4"/>`;
      else s += `<path d="${alt}" fill="${kind === 'terra' ? dk : lt}" opacity="${kind === 'terra' ? 0.18 : 0.4}"/><path d="${hi}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".22"/><path d="${t}" stroke="${dk}" stroke-width="${kind === 'terra' ? 5 : 3}"/>`;
    } else if (kind === 'checker') {
      let d = '', t = '';
      const q = 96;
      for (let yy = Math.floor(y0 / q) * q; yy < y1; yy += q) for (let xx = Math.floor(x0 / q) * q; xx < x1; xx += q) {
        const a = Math.max(y0, yy), b = Math.min(y1, yy + q), l = Math.max(x0, xx), rr = Math.min(x1, xx + q);
        if (((xx / q) + (yy / q)) % 2 === 0 && b > a && rr > l) d += `M${l} ${a} H${rr} V${b} H${l} Z `;
        if (yy >= y0) t += `M${x0} ${yy} H${x1} `;
      }
      for (let xx = Math.ceil(x0 / q) * q; xx < x1; xx += q) t += `M${xx} ${y0} V${y1} `;
      s += `<path d="${d}" fill="${dk}" opacity=".55"/><path d="${t}" stroke="${A.INK}" stroke-width="1.6" opacity=".18"/>`;
    } else if (kind === 'marble') {
      const q = 180;
      let t = '', v = '';
      for (let yy = Math.ceil(y0 / q) * q; yy < y1; yy += q) t += `M${x0} ${yy} H${x1} `;
      for (let xx = Math.ceil(x0 / q) * q; xx < x1; xx += q) t += `M${xx} ${y0} V${y1} `;
      for (let i = 0; i < 9; i++) { const vx = x0 + r() * (x1 - x0), vy = y0 + r() * (y1 - y0); v += `M${f(vx)} ${f(vy)} q${f(30 + r() * 40)} ${f(20 + r() * 30)} ${f(60 + r() * 60)} ${f(10 + r() * 50)} t${f(60 + r() * 40)} ${f(20 + r() * 40)} `; }
      s += `<path d="${v}" fill="none" stroke="${lt}" stroke-width="3" opacity=".5"/><path d="${t}" stroke="${T.metal}" stroke-width="3" opacity=".55"/>`;
    } else if (kind === 'basalt') {

      const q = 110;
      let t = '';
      for (let yy = Math.floor(y0 / q) * q, i = Math.floor(y0 / q); yy < y1; yy += q, i++) for (let xx = Math.floor(x0 / q) * q - (i % 2 ? q / 2 : 0); xx < x1; xx += q) {
        const j = () => (r() - 0.5) * 16, a = Math.max(y0, yy), b = Math.min(y1, yy + q);
        if (b - a < 8) continue;
        t += `M${f(xx + 8 + j())} ${f(a + 6)} L${f(xx + q - 8 + j())} ${f(a + 6 + j() * 0.4)} L${f(xx + q - 6)} ${f(b - 8 + j() * 0.4)} L${f(xx + 6 + j())} ${f(b - 6)} Z `;
      }
      s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${dk}"/><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#ff6a2a" opacity=".35"/><path d="${t}" fill="${base}" stroke="${A.INK}" stroke-width="3"/><path d="${t}" fill="none" stroke="${lt}" stroke-width="2" opacity=".5" transform="translate(2 2)"/>`;
    } else if (kind === 'earth') {
      let p = '', c = '';
      for (let i = 0; i < ((x1 - x0) * (y1 - y0)) / 9000; i++) { const px = x0 + r() * (x1 - x0), py = y0 + r() * (y1 - y0), rx = 6 + r() * 12; p += `M${f(px - rx)} ${f(py)} a${f(rx)} ${f(rx * 0.6)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(rx * 0.6)} 0 1 0 ${f(-rx * 2)} 0 `; }
      for (let i = 0; i < 8; i++) { const px = x0 + r() * (x1 - x0), py = y0 + r() * (y1 - y0); c += `M${f(px)} ${f(py)} l${f(20 + r() * 30)} ${f(10 - r() * 20)} l${f(20 + r() * 20)} ${f(r() * 20)} `; }
      s += `<path d="${p}" fill="${lt}" stroke="${dk}" stroke-width="2" opacity=".7"/><path d="${c}" fill="none" stroke="${dk}" stroke-width="2.4" opacity=".6"/>`;
    }
    return s;
  }
  function wallPat(A, T, x0, y0, x1, y1, seed) {
    const r = A.rng(seed), f = A.f1, k = T.wallPat;
    let s = '';
    if (k === 'brick') { let d = ''; for (let y = y0 + 30; y < y1; y += 70) for (let x = x0 + ((y / 70) % 2 ? 0 : 60); x < x1 - 60; x += 120) d += `M${x} ${y} h80 `; s += `<path d="${d}" stroke="${T.wallD}" stroke-width="6" stroke-linecap="round" opacity=".55"/>`; }
    else if (k === 'paper') {
      let st = '', pw = ''; for (let x = x0 + 40; x < x1; x += 80) st += `M${x} ${y0} V${y1} `;
      for (let y = y0 + 40, i = 0; y < y1 - 20; y += 80, i++) for (let x = x0 + 80 + (i % 2) * 40; x < x1 - 20; x += 160) pw += `M${x} ${y + 4} m-7 0 a7 6 0 1 0 14 0 a7 6 0 1 0 -14 0 M${x - 7} ${y - 6} m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M${x} ${y - 9} m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M${x + 7} ${y - 6} m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 `;
      s += `<path d="${st}" stroke="${T.wallD}" stroke-width="10" opacity=".22"/><path d="${pw}" fill="#e07a98" opacity=".45"/>`;
    } else if (k === 'bamboo') {
      let st = '', kn = '', vine = '', leaf = '';
      for (let x = x0 + 30; x < x1; x += 56) { st += `M${x} ${y0} V${y1} `; for (let y = y0 + 40 + r() * 60; y < y1; y += 90 + r() * 40) kn += `M${x - 20} ${f(y)} h40 `; }
      for (let x = x0 + 200; x < x1 - 100; x += 340 + r() * 200) { let px = x, py = y0; vine += `M${f(px)} ${py} `; for (let i = 0; i < 6; i++) { const nx = px + (r() - 0.5) * 60, ny = py + 40 + r() * 30; vine += `Q${f(px + 40)} ${f((py + ny) / 2)} ${f(nx)} ${f(ny)} `; if (i % 2) leaf += `M${f(nx)} ${f(ny)} q-26 -10 -34 6 q20 8 34 -6 Z `; px = nx; py = ny; } }
      s += `<path d="${st}" stroke="${A.INK}" stroke-width="44" opacity=".14"/><path d="${st}" stroke="#c9b24a" stroke-width="36" opacity=".55"/><path d="${kn}" stroke="${T.wallD}" stroke-width="5" opacity=".6"/>`
        + `<path d="${vine}" fill="none" stroke="#3f7a2a" stroke-width="6"/><path d="${leaf}" fill="#5a9a4a" stroke="${A.INK}" stroke-width="2"/>`;
    } else if (k === 'tiles') {
      let t = ''; for (let y = y0 + 20; y < y1; y += 60) t += `M${x0} ${y} H${x1} `; for (let x = x0 + 30; x < x1; x += 60) t += `M${x} ${y0} V${y1} `;
      s += `<path d="${t}" stroke="${T.wallD}" stroke-width="3" opacity=".7"/><rect x="${x0}" y="${y0 + 140}" width="${x1 - x0}" height="30" fill="${T.wain}" opacity=".7"/>`;

      let g = ''; for (let x = x0 + 260; x < x1 - 100; x += 520 + r() * 200) { g += `<path d="M${f(x)} ${y0 + 30} v90" stroke="${T.woodD}" stroke-width="4"/>`; for (let i = 0; i < 4; i++) g += `<circle cx="${f(x + (i % 2 ? 10 : -10))}" cy="${y0 + 52 + i * 20}" r="12" fill="#f6f0e0" stroke="${A.INK}" stroke-width="2.4"/>`; }
      s += g;
    } else if (k === 'neon') {
      let st = ''; for (let x = x0 + 120; x < x1; x += 240) st += `M${x} ${y0 + 20} V${y1 - 20} `;
      let st2 = ''; for (let x = x0 + 240; x < x1; x += 240) st2 += `M${x} ${y0 + 20} V${y1 - 20} `;
      s += `<path d="${st}" stroke="#ff4fa3" stroke-width="18" opacity=".25" stroke-linecap="round"/><path d="${st}" stroke="#ffc0e4" stroke-width="5" stroke-linecap="round"/><path d="${st2}" stroke="#4fd8ff" stroke-width="18" opacity=".22" stroke-linecap="round"/><path d="${st2}" stroke="#d0f6ff" stroke-width="5" stroke-linecap="round"/>`;
      let dots = ''; for (let i = 0; i < 40; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); dots += `M${f(x)} ${f(y)} l3 -6 l3 6 l-3 6 Z `; }
      s += `<path d="${dots}" fill="#fff" opacity=".7"/>`;
    } else if (k === 'cracks') {
      let d = '', c = ''; for (let y = y0 + 30; y < y1; y += 70) for (let x = x0 + ((y / 70) % 2 ? 0 : 60); x < x1 - 60; x += 120) d += `M${x} ${y} h80 `;
      for (let i = 0; i < 14; i++) { let px = x0 + r() * (x1 - x0), py = y0 + r() * (y1 - y0); c += `M${f(px)} ${f(py)} `; for (let j = 0; j < 4; j++) { px += (r() - 0.5) * 70; py += 20 + r() * 30; c += `L${f(px)} ${f(py)} `; } }
      s += `<path d="${d}" stroke="${T.wallD}" stroke-width="7" stroke-linecap="round" opacity=".7"/><path d="${c}" fill="none" stroke="#ff6a2a" stroke-width="9" opacity=".3"/><path d="${c}" fill="none" stroke="#ffc23d" stroke-width="3"/>`;
    } else if (k === 'cave') {
      let p = ''; for (let i = 0; i < 30; i++) { const px = x0 + r() * (x1 - x0), py = y0 + r() * (y1 - y0), rx = 30 + r() * 50; p += `M${f(px - rx)} ${f(py)} q${f(rx)} ${f(-rx * 0.7)} ${f(rx * 2)} 0 q${f(-rx)} ${f(rx * 0.6)} ${f(-rx * 2)} 0 Z `; }
      s += `<path d="${p}" fill="${T.wallL}" stroke="${T.wallD}" stroke-width="3" opacity=".6"/>`;

      let art = '';
      for (let x = x0 + 180, i = 0; x < x1 - 160; x += 300 + r() * 160, i++) {
        const y = y0 + 60 + r() * 120;
        if (i % 3 === 0) art += `M${f(x - 16)} ${f(y + 30)} l-4 -26 m4 26 l0 -34 m6 34 l4 -36 m4 36 l8 -30 m-26 32 q-6 -10 -16 -8 M${f(x - 20)} ${f(y + 30)} q16 16 34 0 `;
        else if (i % 3 === 1) art += `M${f(x - 50)} ${f(y + 40)} q0 -50 50 -50 q46 0 50 40 m-14 0 v24 m-60 -24 v24 m70 -36 q20 10 14 34 m-104 -20 l-10 18 `;
        else art += `M${f(x)} ${f(y)} m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 m6 6 v26 l-10 20 m10 -20 l10 20 m-20 -36 h20 m6 -20 v60 `;
      }
      s += `<path d="${art}" fill="none" stroke="#b5532b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>`;
    }
    return s;
  }

  function carpetSvg(A, T, x0, x1, y0, y1, lvl) {
    const cx = (x0 + x1) / 2, O = A.O;
    let s = `<rect x="${x0 + 8}" y="${y0 + 8}" width="${x1 - x0}" height="${y1 - y0}" fill="${A.INK}" opacity=".18"/><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${T.fab}" ${O(4)}/>`;
    if (T.carpet === 'gingham') { let d = ''; for (let x = x0 + 20; x < x1; x += 40) d += `M${x} ${y0} V${y1} `; s += `<path d="${d}" stroke="${T.fabL}" stroke-width="18" opacity=".55"/>`; let h = ''; for (let y = y0 + 20; y < y1; y += 40) h += `M${x0} ${y} H${x1} `; s += `<path d="${h}" stroke="${T.fabL}" stroke-width="18" opacity=".45"/>`; }
    if (T.carpet === 'weave') { let d = ''; for (let y = y0 + 14; y < y1; y += 28) d += `M${x0} ${y} H${x1} `; s += `<path d="${d}" stroke="${T.fabD}" stroke-width="7" opacity=".55"/>`; let v = ''; for (let x = x0 + 30; x < x1; x += 60) v += `M${x} ${y0} V${y1} `; s += `<path d="${v}" stroke="${A.INK}" stroke-width="2" opacity=".22"/>`; }
    if (T.carpet === 'hide') { let d = ''; const r = A.rng(77); for (let y = y0 + 60; y < y1; y += 80) for (let k = 0; k < 2; k++) { const px = x0 + 40 + r() * (x1 - x0 - 80), rx = 14 + r() * 16; d += `M${A.f1(px - rx)} ${y} q${A.f1(rx)} -${A.f1(rx)} ${A.f1(rx * 2)} 0 q-${A.f1(rx)} ${A.f1(rx * 0.8)} -${A.f1(rx * 2)} 0 Z `; } s += `<path d="${d}" fill="${T.fabD}" opacity=".7"/>`; let fz = ''; for (let y = y0; y < y1; y += 24) fz += `M${x0} ${y} l-10 12 M${x1} ${y} l10 12 `; s += `<path d="${fz}" stroke="${T.fabD}" stroke-width="5" stroke-linecap="round"/>`; }
    if (lvl >= 2) s += `<path d="M${x0 + 16} ${y0} V${y1} M${x1 - 16} ${y0} V${y1}" stroke="${T.carpet === 'hide' ? T.fabL : T.metal}" stroke-width="10"/>`;
    if (lvl >= 3) {
      let p = '';
      for (let y = y0 + 120; y < y1 - 60; y += 160) {
        if (T.carpet === 'paws') p += `M${cx} ${y + 14} m-20 0 a20 16 0 1 0 40 0 a20 16 0 1 0 -40 0 M${cx - 24} ${y - 12} m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M${cx - 8} ${y - 24} m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M${cx + 8} ${y - 24} m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M${cx + 24} ${y - 12} m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 `;
        else if (T.carpet === 'stars') p += `M${cx} ${y - 44} L${cx + 12} ${y - 12} L${cx + 44} ${y} L${cx + 12} ${y + 12} L${cx} ${y + 44} L${cx - 12} ${y + 12} L${cx - 44} ${y} L${cx - 12} ${y - 12} Z `;
        else if (T.carpet === 'flame') p += `M${cx} ${y + 40} q-40 -20 -20 -60 q4 20 14 22 q-6 -30 16 -48 q0 30 20 40 q14 30 -30 46 Z `;
        else if (T.carpet === 'hide' || T.carpet === 'weave' || T.carpet === 'gingham') p += `M${cx} ${y - 40} l40 40 l-40 40 l-40 -40 Z M${cx} ${y - 20} l20 20 l-20 20 l-20 -20 Z `;
        else p += `M${cx} ${y - 46} l46 46 l-46 46 l-46 -46 Z `;
      }
      const pf = T.carpet === 'paws' ? T.fabL : T.carpet === 'stars' ? '#fff4fb' : T.carpet === 'flame' ? '#ff6a2a' : T.fabD;
      s += `<path d="${p}" fill="${pf}" fill-rule="evenodd" stroke="${T.carpet === 'hide' ? A.INK : T.metal}" stroke-width="4"/>`;
    }
    if (lvl >= 4) { let f = ''; for (let x = x0 + 8; x < x1; x += 16) f += `M${x} ${y0} v-16 `; s += `<path d="${f}" stroke="${T.metal}" stroke-width="4"/>`; }
    s += `<path d="M${x0 + 6} ${y0 + 4} V${y1}" stroke="${T.fabL}" stroke-width="5" opacity=".6"/>`;
    return s;
  }

   
   
  function column(A, T, x, B, h, gold) {
    const O = A.O, w = 62, top = B - h, cap = gold >= 1 ? T.metal : T.stoneL, band = gold >= 3;
    const shaft = T.id === 'monkeys' ? '#8a5a33' : T.id === 'ugabugi' ? '#9a9080' : T.id === 'cherts' ? '#3a2a2a' : T.id === '42brothers' ? '#f0c8e0' : T.id === 'cats' ? '#fbe8cf' : T.stoneL;
    let s = shadowE(A, x + 8, B + 2, w * 0.85, 16, 0.22);

    s += `<path d="${A.poly([[x - w / 2 - 14, B - 26], [x + w / 2 + 14, B - 26], [x + w / 2 + 6, B - 40], [x - w / 2 - 6, B - 40]])}" fill="${A.lt(T.stone, 0.15)}" ${O(3)}/><rect x="${x - w / 2 - 14}" y="${B - 26}" width="${w + 28}" height="26" rx="4" fill="${T.stone}" ${O(3.5)}/><rect x="${x - w / 2 - 6}" y="${B - 52}" width="${w + 12}" height="16" rx="8" fill="${A.lt(T.stone, 0.1)}" ${O(3)}/>`;
    s += `<rect x="${x - w / 2}" y="${top + 30}" width="${w}" height="${h - 82}" fill="${shaft}" ${O(4)}/>`;
    if (T.id === 'monkeys' || T.id === 'ugabugi') {
      s += `<path d="M${x - w / 2 + 4} ${top + 120} q${w / 2} 14 ${w - 8} 0 M${x - w / 2 + 4} ${top + 260} q${w / 2} 14 ${w - 8} 0 M${x - w / 2 + 4} ${top + 360} q${w / 2} 14 ${w - 8} 0" fill="none" stroke="${A.INK}" stroke-width="2.4" opacity=".35"/>`;
      s += `<path d="M${x - w / 2} ${top + 60} C${x + w} ${top + 120} ${x - w} ${top + 220} ${x + w / 2} ${top + 300} S${x - w / 2} ${top + 380} ${x} ${B - 60}" fill="none" stroke="#3f7a2a" stroke-width="7"/><path d="M${x + 20} ${top + 130} q22 -16 34 0 q-16 14 -34 0 Z M${x - 24} ${top + 250} q-22 -16 -34 0 q16 14 34 0 Z M${x + 22} ${top + 330} q22 -16 34 0 q-16 14 -34 0 Z" fill="#5a9a4a" ${O(2)}/>`;
      if (T.id === 'ugabugi') s += `<path d="M${x - 40} ${top + 190} q40 -30 80 0" fill="none" stroke="#efe6d4" stroke-width="10" stroke-linecap="round"/><path d="M${x - 40} ${top + 190} q40 -30 80 0" fill="none" ${O(1.6)}/>`;
    } else {
      s += `<path d="M${x - 16} ${top + 36} V${B - 58} M${x - 2} ${top + 36} V${B - 58} M${x + 12} ${top + 36} V${B - 58}" stroke="${A.INK}" stroke-width="2.4" opacity=".2"/><path d="M${x - w / 2 + 8} ${top + 36} V${B - 58}" stroke="#fff" stroke-width="5" opacity=".3"/><path d="M${x + w / 2 - 10} ${top + 34} V${B - 56}" stroke="${A.INK}" stroke-width="10" opacity=".14"/>`;
      if (T.id === 'cherts') s += `<path d="M${x - 10} ${top + 80} l14 40 l-10 30 l16 50 M${x + 8} ${top + 260} l-12 40 l10 40" fill="none" stroke="#ff6a2a" stroke-width="7" opacity=".4"/><path d="M${x - 10} ${top + 80} l14 40 l-10 30 l16 50 M${x + 8} ${top + 260} l-12 40 l10 40" fill="none" stroke="#ffc23d" stroke-width="2.4"/>`;
      if (T.id === '42brothers') s += `<path d="M${x - w / 2 - 4} ${top + 150} H${x + w / 2 + 4} M${x - w / 2 - 4} ${top + 300} H${x + w / 2 + 4}" stroke="#ff4fa3" stroke-width="16" opacity=".3"/><path d="M${x - w / 2 - 4} ${top + 150} H${x + w / 2 + 4} M${x - w / 2 - 4} ${top + 300} H${x + w / 2 + 4}" stroke="#ffd0ec" stroke-width="5"/>`;
      if (T.id === 'cats') s += `<path d="M${x - w / 2} ${top + 90} L${x + w / 2} ${top + 140} M${x - w / 2} ${top + 200} L${x + w / 2} ${top + 250} M${x - w / 2} ${top + 310} L${x + w / 2} ${top + 360}" stroke="${T.fab}" stroke-width="9" opacity=".8"/>`;
      if (T.id === 'veggies') s += `<path d="M${x} ${top + 60} C${x + 40} ${top + 140} ${x - 40} ${top + 220} ${x} ${top + 300} S${x + 30} ${top + 380} ${x} ${B - 60}" fill="none" stroke="#5aa83a" stroke-width="6"/><circle cx="${x + 18}" cy="${top + 160}" r="10" fill="#e5383b" ${O(2)}/><circle cx="${x - 16}" cy="${top + 290}" r="10" fill="#e5383b" ${O(2)}/>`;
    }
    if (band) s += `<rect x="${x - w / 2 - 2}" y="${top + h * 0.45}" width="${w + 4}" height="14" fill="${T.metal}" ${O(2.6)}/><rect x="${x - w / 2 - 2}" y="${B - 72}" width="${w + 4}" height="12" fill="${T.metal}" ${O(2.6)}/>`;
    s += `<path d="M${x - w / 2 - 16} ${top + 30} H${x + w / 2 + 16} L${x + w / 2 + 6} ${top + 10} H${x - w / 2 - 6} Z" fill="${cap}" ${O(3.5)}/><rect x="${x - w / 2 - 20}" y="${top - 4}" width="${w + 40}" height="16" rx="4" fill="${cap}" ${O(3.5)}/>`;
    if (T.id === 'cats') s += `<path d="M${x - w / 2 - 14} ${top - 2} l6 -22 l16 18 Z M${x + w / 2 + 14} ${top - 2} l-6 -22 l-16 18 Z" fill="${cap}" ${O(2.6)}/>`;
    return s;
  }
   
  function light(A, T, x, B, gold) {
    const O = A.O, c = gold ? T.metal : (T.id === 'ugabugi' ? '#8a5a33' : '#6e6a78');
    let s = shadowE(A, x + 6, B, 28, 9);
    if (T.light === 'torch') {
      s += glow(x, B - 170, 100);
      s += `<path d="M${x - 24} ${B} L${x} ${B - 120} L${x + 24} ${B} M${x} ${B} V${B - 120}" fill="none" stroke="${A.INK}" stroke-width="11" stroke-linecap="round"/><path d="M${x - 24} ${B} L${x} ${B - 120} L${x + 24} ${B} M${x} ${B} V${B - 120}" fill="none" stroke="${T.woodL}" stroke-width="5" stroke-linecap="round"/>`;
      s += `<path d="M${x - 18} ${B - 118} h36 l-6 -24 h-24 Z" fill="${T.woodD}" ${O(3)}/><path d="M${x - 16} ${B - 112} h32" stroke="${T.id === 'ugabugi' ? '#efe6d4' : '#c9b24a'}" stroke-width="5"/>`;
      s += `<path d="M${x - 22} ${B - 142} q-6 -40 22 -70 q26 30 22 70 Z" fill="#ff8a2a" ${O(2.6)}/><path d="M${x - 10} ${B - 144} q-2 -24 10 -40 q14 18 10 40 Z" fill="#ffd25a"/>`;
      return s;
    }
    if (T.light === 'neon') {
      s += `<circle cx="${x}" cy="${B - 150}" r="100" fill="url(#ghGlow)"/><path d="M${x - 22} ${B} h44 l-6 -12 h-32 Z" fill="${T.woodL}" ${O(3)}/><path d="M${x} ${B - 12} V${B - 150}" stroke="${A.INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${B - 12} V${B - 150}" stroke="${T.metal}" stroke-width="5" stroke-linecap="round"/>`;
      s += `<path d="M${x - 26} ${B - 150} q0 -40 26 -48 q26 8 26 48 Z" fill="#ff9ad0" ${O(3)}/><path d="M${x - 16} ${B - 156} q0 -24 16 -32" stroke="#fff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/><path d="M${x - 30} ${B - 148} h60" stroke="#4fd8ff" stroke-width="6" stroke-linecap="round"/>`;
      return s;
    }
    if (T.light === 'brazier') return s + brazier(A, T, x, B, 0.85, gold);
    s += glow(x, B - 150, 90);
    s += `<path d="M${x - 22} ${B} L${x} ${B - 16} L${x + 22} ${B} Z" fill="${c}" ${O(3)}/><path d="M${x} ${B - 14} V${B - 112}" stroke="${A.INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${B - 14} V${B - 112}" stroke="${c}" stroke-width="5" stroke-linecap="round"/><circle cx="${x}" cy="${B - 64}" r="8" fill="${c}" ${O(2.4)}/>`;
    s += `<path d="M${x - 34} ${B - 120} Q${x - 34} ${B - 104} ${x} ${B - 104} Q${x + 34} ${B - 104} ${x + 34} ${B - 120}" fill="none" stroke="${A.INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x - 34} ${B - 120} Q${x - 34} ${B - 104} ${x} ${B - 104} Q${x + 34} ${B - 104} ${x + 34} ${B - 120}" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>`;
    for (const dx of [-34, 0, 34]) { const t = B - (dx ? 120 : 126); s += `<rect x="${x + dx - 9}" y="${t - 4}" width="18" height="6" rx="2" fill="${c}" ${O(2)}/>` + candleS(A, x + dx, t - 2, 28); }
    if (T.ears) s += `<path d="M${x - 10} ${B - 104} l-6 -14 l12 8 Z M${x + 10} ${B - 104} l6 -14 l-12 8 Z" fill="${c}" ${O(2)}/>`;
    return s;
  }
   
  function brazier(A, T, x, B, k = 1, gold) {
    const O = A.O, c = gold ? T.metal : T.iron, lava = T.id === 'cherts', neon = T.id === '42brothers';
    const fc = neon ? '#ff6ad0' : '#ff8a2a', fc2 = neon ? '#ffd0f0' : '#ffd25a';
    let s = glow(x, B - 120 * k, 120 * k) + shadowE(A, x + 6, B, 34 * k, 11 * k);
    s += `<path d="M${x - 30 * k} ${B} L${x - 12 * k} ${B - 70 * k} M${x + 30 * k} ${B} L${x + 12 * k} ${B - 70 * k} M${x} ${B + 2} V${B - 70 * k}" stroke="${A.INK}" stroke-width="${10 * k}" stroke-linecap="round"/><path d="M${x - 30 * k} ${B} L${x - 12 * k} ${B - 70 * k} M${x + 30 * k} ${B} L${x + 12 * k} ${B - 70 * k} M${x} ${B + 2} V${B - 70 * k}" stroke="${c}" stroke-width="${5 * k}" stroke-linecap="round"/>`;
    s += `<path d="M${x - 44 * k} ${B - 86 * k} Q${x} ${B - 48 * k} ${x + 44 * k} ${B - 86 * k} Z" fill="${c}" ${O(3.5)}/><ellipse cx="${x}" cy="${B - 86 * k}" rx="${44 * k}" ry="${10 * k}" fill="${lava ? '#ff6a2a' : '#3a2a2a'}" ${O(3)}/>`;
    s += `<path d="M${x - 30 * k} ${B - 90 * k} q-4 ${-40 * k} ${14 * k} ${-64 * k} q2 ${24 * k} ${14 * k} ${30 * k} q8 ${-30 * k} ${22 * k} ${-46 * k} q14 ${44 * k} ${10 * k} ${80 * k} Z" fill="${fc}" ${O(2.6)}/><path d="M${x - 14 * k} ${B - 92 * k} q0 ${-24 * k} ${12 * k} ${-36 * k} q4 ${18 * k} ${14 * k} ${20 * k} q4 ${8 * k} ${-2 * k} ${16 * k} Z" fill="${fc2}"/>`;
    for (const dx of [-28, 0, 28]) s += `<circle cx="${x + dx * k}" cy="${B - 70 * k}" r="${5 * k}" fill="${c}" ${O(2)}/>`;
    return s;
  }

   
  function deskArt(A, T, b) {
    const O = A.O, P = A.P, [x0, , x1, B] = b.vis, top = B - 150, dd = 64;
    let s = `<g data-ol="${b.id}">` + shadowR(A, x0 + 10, B - 12, x1 + 6);

    s += boxV(A, x0, top, x1, B, dd, T.wood, T.woodL, { k: 30 });
    let pn = '';
    const n = 4, pw = (x1 - x0 - 40) / n;
    for (let i = 0; i < n; i++) pn += `<rect x="${A.f1(x0 + 20 + i * pw + 6)}" y="${top + 26}" width="${A.f1(pw - 12)}" height="${B - top - 60}" rx="6" fill="${A.dk(T.wood, 0.1)}" ${O(2.6)}/><path d="M${A.f1(x0 + 20 + i * pw + 12)} ${B - 38} V${top + 32} H${A.f1(x0 + 20 + i * pw + pw - 12)}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".2"/>`;
    s += pn + `<rect x="${x0 - 6}" y="${B - 22}" width="${x1 - x0 + 12}" height="22" rx="4" fill="${T.woodD}" ${O(3.5)}/>`;
    s += `<rect x="${x0 - 10}" y="${top - 8}" width="${x1 - x0 + 20}" height="18" rx="5" fill="${T.woodD}" ${O(3.5)}/><path d="M${x0 - 4} ${top - 4} H${x1 + 4}" stroke="${T.woodL}" stroke-width="3" opacity=".8"/>`;

    const by = top - 30, bx = x0 + 120;
    const books = [['#4a6fb0', 70], [T.fab, 64], ['#3f8f8a', 74]];
    books.forEach(([c, w], i) => { s += `<rect x="${bx - 90 - w / 2 + i * 3}" y="${by - 4 - i * 16}" width="${w}" height="16" rx="3" fill="${c}" ${O(2.4)}/><path d="M${bx - 90 - w / 2 + i * 3 + 8} ${by + 4 - i * 16} h${w - 16}" stroke="${T.metal}" stroke-width="2.4"/>`; });
    const ox = x0 + 230;
    s += `<path d="M${ox - 70} ${by + 10} L${ox} ${by + 20} L${ox + 70} ${by + 10} L${ox + 64} ${by - 22} L${ox} ${by - 12} L${ox - 64} ${by - 22} Z" fill="${T.id === 'ugabugi' ? '#cfc6b6' : P.cream}" ${O(3)}/><path d="M${ox} ${by - 12} V${by + 20}" stroke="${A.INK}" stroke-width="2.4"/><path d="M${ox - 52} ${by - 8} H${ox - 14} M${ox - 52} ${by + 2} H${ox - 14} M${ox + 14} ${by - 8} H${ox + 52} M${ox + 14} ${by + 2} H${ox + 52}" stroke="${A.INK}" stroke-width="2" opacity=".4"/><path d="M${ox + 30} ${by + 14} v18" stroke="${T.fab}" stroke-width="5"/>`;
    s += `<ellipse cx="${ox + 110}" cy="${by + 8}" rx="16" ry="8" fill="#2c2c3a" ${O(2.4)}/><rect x="${ox + 98}" y="${by - 10}" width="24" height="18" rx="4" fill="#2c2c3a" ${O(2.4)}/><path d="M${ox + 110} ${by - 6} L${ox + 140} ${by - 60}" stroke="${A.INK}" stroke-width="6" stroke-linecap="round"/><path d="M${ox + 140} ${by - 60} q18 8 8 34 q-16 -8 -8 -34 Z" fill="${T.id === 'cherts' ? '#d81e1e' : T.id === '42brothers' ? '#ff9ad0' : '#f4f1ec'}" ${O(2)}/>`;
    const sx = x1 - 130; for (let i = 0; i < 3; i++) s += `<rect x="${sx - 46 + i * 6}" y="${by - 4 - i * 16}" width="92" height="18" rx="9" fill="${['#f0dfb8', '#e8d2a2', '#f6e8c6'][i]}" ${O(2.6)}/><path d="M${sx - 2 + i * 6} ${by - 4 - i * 16} v18" stroke="${T.fab}" stroke-width="4"/>`;
    s += `<path d="M${x1 - 54} ${by + 10} h28 q0 -26 -14 -26 q-14 0 -14 26 Z" fill="${T.metal}" ${O(2.4)}/><circle cx="${x1 - 40}" cy="${by - 20}" r="4" fill="${T.metal}" ${O(1.6)}/>`;
    s += loot(A, T, x0 + 210, by + 14, 0.7, 1);
    s += glow(x1 - 70, by - 50, 70) + candleS(A, x1 - 90, by + 6, 34);
    s += A.board((x0 + x1) / 2, top + 64, 'СОСТАВ · ЖУРНАЛ', 20, { bg: T.sign, ears: !!T.ears, rim: T.metal, fg: T.metal });
    return s + '</g>';
  }
  function chestArt(A, T, b, color) {
    const O = A.O, P = A.P, [x0, , x1, B] = b.vis, gold = T.id === '42brothers' ? '#f4c542' : P.gold;
    let s = `<g data-ol="${b.id}">` + shadowR(A, x0 + 10, B - 14, x1, 28);

    const chest = (cx, base, w, h, c, o = {}) => {
      const l = cx - w / 2, r = cx + w / 2, top = base - h, band = T.id === 'ugabugi' ? '#cfc6b6' : T.iron;
      let q = shadowE(A, cx + 10, base, w * 0.56, 14, 0.2);
      if (o.open) {
        q += `<path d="M${l + 6} ${top - 4} Q${cx} ${top - 120} ${r - 6} ${top - 4} L${r - 16} ${top - 30} Q${cx} ${top - 100} ${l + 16} ${top - 30} Z" fill="${A.dk(c, 0.25)}" ${O(3.5)}/><path d="M${l + 30} ${top - 32} Q${cx} ${top - 110} ${r - 30} ${top - 32}" fill="none" stroke="${band}" stroke-width="8"/>`;
        q += `<path d="${A.poly([[l, top], [r, top], [r - 14, top - 26], [l + 14, top - 26]])}" fill="#3a2a22" ${O(3)}/>`;

        let co = ''; for (let i = 0; i < 9; i++) co += `<ellipse cx="${A.f1(l + 26 + (i % 5) * (w - 52) / 4)}" cy="${A.f1(top - 20 - Math.floor(i / 5) * 12 - (i % 2) * 4)}" rx="15" ry="8" fill="${gold}" ${O(2.2)}/>`;
        q += `<path d="M${l + 14} ${top - 8} Q${cx} ${top - 70} ${r - 14} ${top - 8} Z" fill="${gold}" ${O(3)}/>` + co;
        q += `<path d="M${cx - 30} ${top - 46} l6 -10 l6 10 l-6 10 Z M${cx + 22} ${top - 38} l5 -8 l5 8 l-5 8 Z" fill="#e8455c" ${O(1.8)}/><path d="M${cx - 50} ${top - 30} l10 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
        if (o.loot) q += loot(A, T, cx + 10, top - 34, 0.9, 1);
      } else {
        q += `<path d="${A.poly([[l, top], [r, top], [r - 14, top - 26], [l + 14, top - 26]])}" fill="${A.lt(c, 0.12)}" ${O(3.5)}/>`;
        q += `<path d="M${l} ${top} Q${cx} ${top - 56} ${r} ${top} Z" fill="${A.lt(c, 0.06)}" ${O(4)}/><path d="M${l + 14} ${top - 12} Q${cx} ${top - 50} ${r - 14} ${top - 12}" fill="none" stroke="#fff" stroke-width="3" opacity=".25"/>`;
      }
      q += `<rect x="${l}" y="${top}" width="${w}" height="${h}" fill="${c}" ${O(4)}/>`;
      let pl = ''; for (let y = top + 22; y < base - 6; y += 22) pl += `M${l + 4} ${y} H${r - 4} `; q += `<path d="${pl}" stroke="${A.INK}" stroke-width="2" opacity=".25"/>`;
      q += `<path d="M${l + 22} ${top - (o.open ? 0 : 30)} V${base} M${r - 22} ${top - (o.open ? 0 : 30)} V${base}" stroke="${A.INK}" stroke-width="14"/><path d="M${l + 22} ${top - (o.open ? 0 : 30)} V${base} M${r - 22} ${top - (o.open ? 0 : 30)} V${base}" stroke="${band}" stroke-width="8"/>`;

      for (const [ax, ay, sx, sy] of [[l, top, 1, 1], [r, top, -1, 1], [l, base, 1, -1], [r, base, -1, -1]]) q += `<path d="M${ax} ${ay + sy * 28} V${ay} H${ax + sx * 28} L${ax + sx * 28} ${ay + sy * 10} L${ax + sx * 10} ${ay + sy * 10} L${ax + sx * 10} ${ay + sy * 28} Z" fill="${gold}" ${O(2.6)}/><circle cx="${ax + sx * 6}" cy="${ay + sy * 6}" r="3" fill="${A.INK}" opacity=".6"/>`;
      q += `<rect x="${cx - 16}" y="${top - 8}" width="32" height="34" rx="5" fill="${gold}" ${O(2.8)}/><path d="M${cx} ${top + 4} v10" stroke="${A.INK}" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${top + 4}" r="4" fill="${A.INK}"/>`;
      if (o.gift) q += `<path d="M${cx} ${top - 50} V${base}" stroke="${A.INK}" stroke-width="18"/><path d="M${cx} ${top - 50} V${base}" stroke="${color}" stroke-width="12"/><path d="M${cx} ${top - 52} q-34 -26 -40 0 q20 12 40 0 q34 -26 40 0 q-20 12 -40 0 Z" fill="${color}" ${O(2.6)}/><circle cx="${cx}" cy="${top - 52}" r="7" fill="${A.dk(color, 0.2)}" ${O(2)}/>`;
      return q;
    };
    s += chest(x0 + 120, B - 34, 200, 116, T.wood, { open: true, loot: true });
    s += chest(x0 + 340, B - 10, 230, 136, A.dk(T.wood, 0.12), { gift: true });
    s += chest(x1 - 100, B - 40, 170, 100, T.woodL, {});

    for (const [mx, my] of [[x0 + 236, B - 30]]) s += `<path d="M${mx - 34} ${my + 40} Q${mx - 44} ${my} ${mx - 14} ${my - 20} L${mx - 20} ${my - 34} H${mx + 20} L${mx + 14} ${my - 20} Q${mx + 44} ${my} ${mx + 34} ${my + 40} Z" fill="#c8a878" ${O(3)}/><path d="M${mx - 18} ${my - 22} H${mx + 18}" stroke="${T.fab}" stroke-width="6"/><text x="${mx}" y="${my + 24}" text-anchor="middle" font-family="Russo One" font-size="26" fill="${A.dk('#c8a878', 0.4)}">¤</text>`;
    for (const [cx, cy, n] of [[x0 + 240, B - 4, 6], [x1 - 30, B - 10, 5], [x0 + 40, B - 2, 4]]) for (let i = 0; i < n; i++) s += `<ellipse cx="${cx + (i % 3) * 16 - 16}" cy="${cy - Math.floor(i / 3) * 9 - (i % 2) * 4}" rx="13" ry="7" fill="${gold}" ${O(2.2)}/>`;
    s += loot(A, T, x0 + 60, B - 8, 0.8, 0) + loot(A, T, x1 - 160, B - 6, 0.7, 2);
    s += A.board((x0 + x1) / 2, b.vis[1] + 60, 'КАЗНА', 24, { bg: T.sign, ears: !!T.ears, rim: T.metal, fg: T.metal });
    return s + '</g>';
  }
  function boardArt(A, T, b) {
    const O = A.O, P = A.P, [x0, y0, x1, B] = b.vis, top = y0 + 90, bot = B - 120;
    let s = `<g data-ol="${b.id}">` + shadowR(A, x0 + 30, B - 14, x1 - 20, 24);
    for (const lx of [x0 + 60, x1 - 60]) s += `<rect x="${lx - 14}" y="${top - 30}" width="28" height="${B - top + 30}" fill="${T.woodD}" ${O(3.5)}/><path d="M${lx - 8} ${top} V${B - 6}" stroke="#fff" stroke-width="3" opacity=".18"/>`;

    s += `<path d="${A.poly([[x0 - 4, top - 4], [x1 + 4, top - 4], [x1 - 30, top - 52], [x0 + 30, top - 52]])}" fill="${T.id === 'monkeys' || T.id === 'ugabugi' ? '#c9b24a' : T.fab}" ${O(4)}/>`;
    let sh = ''; for (let x = x0 + 40; x < x1 - 20; x += 40) sh += `M${x} ${top - 6} L${x + 10} ${top - 48} `; s += `<path d="${sh}" stroke="${A.INK}" stroke-width="2.4" opacity=".25"/>`;
    s += `<rect x="${x0 + 16}" y="${top}" width="${x1 - x0 - 32}" height="${bot - top}" rx="8" fill="${T.woodL}" ${O(4.5)}/><rect x="${x0 + 32}" y="${top + 16}" width="${x1 - x0 - 64}" height="${bot - top - 32}" rx="4" fill="${T.id === 'veggies' ? '#e8f4d8' : '#d9b483'}" ${O(2.4)}/>`;

    let dots = ''; const r = A.rng(31); for (let i = 0; i < 40; i++) dots += `M${A.f1(x0 + 40 + r() * (x1 - x0 - 80))} ${A.f1(top + 24 + r() * (bot - top - 48))} h3 `; s += `<path d="${dots}" stroke="${A.INK}" stroke-width="3" opacity=".18" stroke-linecap="round"/>`;
    const N = T.note;
    const notes = [[x0 + 60, top + 30, 112, 124, N[0], -3], [x0 + 196, top + 40, 120, 104, N[1], 4], [x0 + 340, top + 26, 112, 130, N[0], -2], [x0 + 96, top + 176, 132, 92, N[2], 2], [x0 + 272, top + 182, 140, 84, N[0], -4]];
    notes.forEach(([nx, ny, w, h, c, rot], i) => {
      s += `<g transform="rotate(${rot} ${nx + w / 2} ${ny})"><rect x="${nx + 5}" y="${ny + 5}" width="${w}" height="${h}" fill="${A.INK}" opacity=".18"/><rect x="${nx}" y="${ny}" width="${w}" height="${h}" fill="${c}" ${O(2.6)}/>`;
      if (i === 0) s += `<path d="M${nx + 20} ${ny + 30} q20 -10 40 6 q20 14 40 -4" fill="none" stroke="#4a6fb0" stroke-width="3"/><path d="M${nx + 30} ${ny + 60} l10 10 m0 -10 l-10 10" stroke="${T.fabL === '#fffbea' ? '#e5383b' : '#c0304a'}" stroke-width="4"/><path d="M${nx + 14} ${ny + 90} H${nx + w - 14} M${nx + 14} ${ny + 104} H${nx + w - 30}" stroke="${A.INK}" stroke-width="2.2" opacity=".35"/>`;
      else if (i === 2 && T.loot === 'veggies') s += loot(A, T, nx + w / 2, ny + 70, 0.9, 1) + `<path d="M${nx + 14} ${ny + 90} H${nx + w - 14} M${nx + 14} ${ny + 104} H${nx + w - 24} M${nx + 14} ${ny + 116} H${nx + w - 30}" stroke="${A.INK}" stroke-width="2.2" opacity=".35"/>`;
      else s += `<path d="M${nx + 14} ${ny + 26} H${nx + w - 14} M${nx + 14} ${ny + 42} H${nx + w - 24} M${nx + 14} ${ny + 58} H${nx + w - 18} M${nx + 14} ${ny + 74} H${nx + w - 34}" stroke="${A.INK}" stroke-width="2.2" opacity=".35"/>`;
      if (i === 1 || i === 4) s += `<circle cx="${nx + w - 26}" cy="${ny + h - 22}" r="14" fill="#b8323a" ${O(2.2)}/><path d="M${nx + w - 34} ${ny + h - 10} l-6 18 l8 -4 M${nx + w - 18} ${ny + h - 10} l6 18 l-8 -4" fill="#b8323a" ${O(1.8)}/><path d="M${nx + w - 32} ${ny + h - 22} h12" stroke="${A.dk('#b8323a', 0.3)}" stroke-width="3"/>`;
      s += `<circle cx="${nx + w / 2}" cy="${ny + 6}" r="7" fill="${['#b8323a', '#4a6fb0', '#d9a23a', '#3f8f8a', '#b8323a'][i]}" ${O(2)}/></g>`;
    });

    s += `<path d="M${x1 - 120} ${top + 160} l60 -60" stroke="${A.INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x1 - 120} ${top + 160} l40 -40" stroke="#d6dbe4" stroke-width="5" stroke-linecap="round"/><path d="M${x1 - 84} ${top + 112} l18 18" stroke="${T.metal}" stroke-width="8" stroke-linecap="round"/><path d="M${x1 - 76} ${top + 116} l14 -14" stroke="${T.woodD}" stroke-width="8" stroke-linecap="round"/>`;

    s += `<rect x="${x0 + 150}" y="${B - 60}" width="110" height="56" rx="4" fill="${T.wood}" ${O(3)}/><path d="M${x0 + 160} ${B - 60} v-14 h40 v14 M${x0 + 200} ${B - 60} v-20 h44 v20" fill="${N[0]}" ${O(2.2)}/>`;
    s += A.board((x0 + x1) / 2, y0 + 30, 'ДОСКА ЗАДАНИЙ', 22, { bg: T.sign, ears: !!T.ears, rim: T.metal, fg: T.metal });
    return s + '</g>';
  }
  function trophyArt(A, T, b, d) {
    const O = A.O, P = A.P, [x0, y0, x1, B] = b.vis, cx = (x0 + x1) / 2;
    let s = `<g data-ol="${b.id}">` + shadowR(A, x0 + 30, B - 14, x1 - 10, 24);

    const sx0 = x0 + 30, sx1 = x1 - 30, st = y0 + 90, sb = B - 10, fr = d.gold >= 2 ? T.metal : T.woodD;
    s += boxV(A, sx0, st, sx1, sb, 30, T.woodD, T.woodL, { k: 16 });
    s += `<rect x="${sx0 + 16}" y="${st + 16}" width="${sx1 - sx0 - 32}" height="${sb - st - 56}" rx="6" fill="${A.dk(T.woodD, 0.35)}"/>`;
    s += `<rect x="${sx0 + 22}" y="${st + 22}" width="${sx1 - sx0 - 44}" height="70" fill="${T.glow}" opacity=".18"/>`;
    for (const y of [st + 150, st + 270]) s += `<rect x="${sx0 + 16}" y="${y}" width="${sx1 - sx0 - 32}" height="12" fill="${T.woodL}" ${O(2.4)}/><path d="M${sx0 + 20} ${y + 12} H${sx1 - 20}" stroke="${A.INK}" stroke-width="6" opacity=".25"/>`;
    const steel = '#d6dbe4', bronze = '#c8864a';
    const items = [cup(A, T, sx0 + 80, st + 148, 0.75, T.metal), cup(A, T, cx, st + 148, 1, T.metal), cup(A, T, sx1 - 80, st + 148, 0.7, steel),
      `<path d="M${sx0 + 76} ${st + 170} l14 30 l14 -30" fill="none" stroke="${T.fab}" stroke-width="8"/><circle cx="${sx0 + 90}" cy="${st + 222}" r="24" fill="${T.metal}" ${O(3)}/><path d="M${sx0 + 90} ${st + 208} l5 10 l10 1 l-8 7 l3 10 l-10 -6 l-10 6 l3 -10 l-8 -7 l10 -1 Z" fill="${A.lt(T.metal, 0.4)}"/>`,
      `<path d="M${cx - 50} ${st + 262} L${cx + 50} ${st + 176} M${cx + 50} ${st + 262} L${cx - 50} ${st + 176}" stroke="${A.INK}" stroke-width="11" stroke-linecap="round"/><path d="M${cx - 50} ${st + 262} L${cx + 50} ${st + 176} M${cx + 50} ${st + 262} L${cx - 50} ${st + 176}" stroke="${steel}" stroke-width="5" stroke-linecap="round"/><path d="M${cx - 24} ${st + 196} H${cx + 24} V${st + 224} C${cx + 24} ${st + 240} ${cx + 10} ${st + 250} ${cx} ${st + 254} C${cx - 10} ${st + 250} ${cx - 24} ${st + 240} ${cx - 24} ${st + 224} Z" fill="${T.fab}" ${O(3)}/>`,
      `<path d="M${sx1 - 104} ${st + 170} l14 30 l14 -30" fill="none" stroke="#4a6fb0" stroke-width="8"/><circle cx="${sx1 - 90}" cy="${st + 222}" r="24" fill="${steel}" ${O(3)}/>`,
      cup(A, T, sx0 + 90, sb - 40, 0.62, bronze), loot(A, T, cx, sb - 40, 1.2, 1), cup(A, T, sx1 - 90, sb - 40, 0.62, T.metal)];
    const n = Math.min(items.length, 3 + d.tier);
    s += items.slice(0, n).join('');

    s += `<rect x="${sx0 + 16}" y="${st + 16}" width="${sx1 - sx0 - 32}" height="${sb - st - 56}" rx="6" fill="#cfeaff" opacity=".16" stroke="${fr}" stroke-width="6"/>`;
    s += `<path d="M${sx0 + 40} ${st + 300} L${sx0 + 140} ${st + 40} M${sx0 + 70} ${st + 300} L${sx0 + 160} ${st + 70} M${cx + 30} ${st + 360} L${cx + 140} ${st + 60}" stroke="#fff" stroke-width="7" opacity=".3" stroke-linecap="round"/>`;
    s += `<path d="M${sx0 + 22} ${st + 200} v40 M${sx1 - 22} ${st + 200} v40" stroke="${T.metal}" stroke-width="6" stroke-linecap="round"/>`;

    s += `<rect x="${sx0 + 6}" y="${sb - 36}" width="${sx1 - sx0 - 12}" height="30" rx="4" fill="${T.wood}" ${O(3)}/><path d="M${cx - 30} ${sb - 22} h60" stroke="${T.metal}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<rect x="${sx0 - 14}" y="${st - 26}" width="${sx1 - sx0 + 28}" height="26" rx="6" fill="${fr}" ${O(3.5)}/><path d="M${cx - 50} ${st - 26} l12 -34 l20 22 l18 -36 l18 36 l20 -22 l12 34 Z" fill="${T.metal}" ${O(3)}/><circle cx="${cx}" cy="${st - 66}" r="7" fill="#e8455c" ${O(2)}/>`;
    s += A.board(cx, y0 + 20, 'ЗАЛ ТРОФЕЕВ', 22, { bg: T.id === 'legion' ? '#5a3458' : T.sign, ears: !!T.ears, rim: T.metal, fg: T.metal });
    return s + '</g>';
  }
  function throneArt(A, T, b, d, color) {
    const O = A.O, [x0, y0, x1, B] = b.vis, cx = (x0 + x1) / 2, g = d.gold >= 2, fr = g ? T.metal : T.wood, frD = g ? T.metalD : T.woodD;
    let s = `<g data-ol="${b.id}">` + shadowE(A, cx + 10, B, (x1 - x0) / 2 + 10, 22, 0.26);

    s += `<path d="${A.poly([[cx - 170, B - 30], [cx + 170, B - 30], [cx + 156, B - 52], [cx - 156, B - 52]])}" fill="${T.stoneL}" ${O(3.5)}/><rect x="${cx - 170}" y="${B - 30}" width="340" height="30" fill="${T.stone}" ${O(3.5)}/>`;

    const top = y0 + 10;
    s += `<path d="M${cx - 110} ${B - 140} V${top + 70} Q${cx - 110} ${top} ${cx} ${top - 10} Q${cx + 110} ${top} ${cx + 110} ${top + 70} V${B - 140} Z" fill="${fr}" ${O(5)}/>`;
    s += `<path d="M${cx - 96} ${B - 150} V${top + 76} Q${cx - 96} ${top + 14} ${cx} ${top + 6}" fill="none" stroke="#fff" stroke-width="4" opacity=".3"/>`;
    s += `<path d="M${cx - 80} ${B - 146} V${top + 80} Q${cx - 80} ${top + 30} ${cx} ${top + 24} Q${cx + 80} ${top + 30} ${cx + 80} ${top + 80} V${B - 146} Z" fill="${color}" ${O(3.5)}/>`;
    let bt = ''; for (const [bx, by] of [[-40, 110], [0, 90], [40, 110], [-40, 170], [0, 150], [40, 170], [-40, 230], [0, 210], [40, 230]]) bt += `M${cx + bx} ${top + by} m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 `;
    s += `<path d="${bt}" fill="${A.dk(color, 0.35)}"/><path d="M${cx - 40} ${top + 110} L${cx} ${top + 150} L${cx + 40} ${top + 110} M${cx - 40} ${top + 170} L${cx} ${top + 210} L${cx + 40} ${top + 170} M${cx} ${top + 90} L${cx + 40} ${top + 130}" stroke="${A.dk(color, 0.25)}" stroke-width="2" fill="none"/>`;
    s += `<path d="M${cx} ${top + 40} l18 22 l-18 22 l-18 -22 Z" fill="${T.metal}" ${O(2.6)}/>`;

    const crown = {
      legion: `<path d="M${cx - 50} ${top - 4} l14 -40 l20 26 l16 -44 l16 44 l20 -26 l14 40 Z" fill="${T.metal}" ${O(3)}/><circle cx="${cx}" cy="${top - 52}" r="8" fill="#e8455c" ${O(2)}/>`,
      cats: `<path d="M${cx - 104} ${top + 60} L${cx - 96} ${top - 50} L${cx - 40} ${top + 6} Z M${cx + 104} ${top + 60} L${cx + 96} ${top - 50} L${cx + 40} ${top + 6} Z" fill="${fr}" ${O(4)}/><path d="M${cx - 90} ${top + 26} L${cx - 88} ${top - 26} L${cx - 58} ${top + 6} Z M${cx + 90} ${top + 26} L${cx + 88} ${top - 26} L${cx + 58} ${top + 6} Z" fill="${T.fab}"/>`,
      monkeys: [-70, -35, 0, 35, 70].map((dx, i) => `<path d="M${cx + dx * 0.4} ${top + 10} Q${cx + dx * 1.3 - 20} ${top - 50 - (i % 2) * 20} ${cx + dx * 1.4} ${top - 70 + Math.abs(dx) * 0.4} Q${cx + dx * 1.2 + 16} ${top - 30} ${cx + dx * 0.4} ${top + 10} Z" fill="${i % 2 ? '#5a9a4a' : '#3f7a2a'}" ${O(2.6)}/>`).join(''),
      veggies: [-60, -20, 20, 60].map((dx) => `<path d="M${cx + dx} ${top + 10} q${-30 + dx * 0.2} -40 ${dx * 0.3} -70 q${30 + dx * 0.2} 30 ${-dx * 0.3 + 4} 70 Z" fill="#6fae4a" ${O(2.6)}/>`).join('') + `<path d="M${cx} ${top - 10} v-50" stroke="#3f7a2a" stroke-width="4"/>`,
      '42brothers': `<path d="M${cx} ${top - 6} C${cx - 70} ${top - 50} ${cx - 40} ${top - 100} ${cx} ${top - 70} C${cx + 40} ${top - 100} ${cx + 70} ${top - 50} ${cx} ${top - 6} Z" fill="none" stroke="#ff4fa3" stroke-width="18" opacity=".35"/><path d="M${cx} ${top - 6} C${cx - 70} ${top - 50} ${cx - 40} ${top - 100} ${cx} ${top - 70} C${cx + 40} ${top - 100} ${cx + 70} ${top - 50} ${cx} ${top - 6} Z" fill="none" stroke="#ffd0ec" stroke-width="6"/>` + [-60, -30, 30, 60].map((dx) => `<path d="M${cx + dx} ${top + 20 + Math.abs(dx) * 0.3} l5 -8 l5 8 l-5 8 Z" fill="#bfefff" ${O(1.4)}/>`).join(''),
      cherts: `<path d="M${cx - 80} ${top + 20} Q${cx - 140} ${top - 30} ${cx - 120} ${top - 90} Q${cx - 100} ${top - 40} ${cx - 50} ${top - 4} Z M${cx + 80} ${top + 20} Q${cx + 140} ${top - 30} ${cx + 120} ${top - 90} Q${cx + 100} ${top - 40} ${cx + 50} ${top - 4} Z" fill="#d81e1e" ${O(3.5)}/><path d="M${cx - 104} ${top - 50} q10 20 30 30 M${cx + 104} ${top - 50} q-10 20 -30 30" stroke="#ff6a2a" stroke-width="4" fill="none"/>`,
      ugabugi: `<path d="M${cx - 60} ${top + 20} C${cx - 150} ${top - 10} ${cx - 140} ${top - 90} ${cx - 90} ${top - 110} C${cx - 110} ${top - 60} ${cx - 90} ${top - 20} ${cx - 40} ${top - 6} Z M${cx + 60} ${top + 20} C${cx + 150} ${top - 10} ${cx + 140} ${top - 90} ${cx + 90} ${top - 110} C${cx + 110} ${top - 60} ${cx + 90} ${top - 20} ${cx + 40} ${top - 6} Z" fill="#f4ecd8" ${O(3.5)}/>`,
    };
    s += crown[T.id] || crown.legion;

    s += `<rect x="${cx - 140}" y="${B - 136}" width="280" height="44" rx="12" fill="${frD}" ${O(4)}/><rect x="${cx - 120}" y="${B - 158}" width="240" height="40" rx="16" fill="${A.lt(color, 0.12)}" ${O(3.5)}/><path d="M${cx - 100} ${B - 148} q100 -10 200 0" stroke="#fff" stroke-width="4" opacity=".35" fill="none" stroke-linecap="round"/>`;
    s += `<rect x="${cx - 120}" y="${B - 96}" width="240" height="66" fill="${fr}" ${O(4)}/><path d="M${cx - 100} ${B - 80} q25 22 50 0 q25 22 50 0 q25 22 50 0 q25 22 50 0" fill="none" stroke="${frD}" stroke-width="4"/>`;
    for (const sd of [-1, 1]) {
      s += `<path d="M${cx + sd * 150} ${B - 170} V${B - 40}" stroke="${A.INK}" stroke-width="24" stroke-linecap="round"/><path d="M${cx + sd * 150} ${B - 170} V${B - 40}" stroke="${fr}" stroke-width="16" stroke-linecap="round"/><path d="M${cx + sd * 150 - 4 * sd} ${B - 166} V${B - 50}" stroke="#fff" stroke-width="3" opacity=".3"/>`;
      s += `<circle cx="${cx + sd * 150}" cy="${B - 178}" r="16" fill="${T.metal}" ${O(3)}/><circle cx="${cx + sd * 150 - 5}" cy="${B - 183}" r="4" fill="#fff" opacity=".6"/>`;
      s += `<path d="M${cx + sd * 150 - 16} ${B - 30} h32 l4 -14 h-40 Z" fill="${frD}" ${O(2.6)}/>`;
    }
    if (g) s += `<path d="M${cx - 140} ${B - 114} H${cx + 140}" stroke="${A.lt(T.metal, 0.3)}" stroke-width="4"/>`;
    return s + '</g>';
  }
  function chair(A, T, x, base, color, back = 110, side = 0) {
    const O = A.O;
    if (side) {
      const sd = side;
      return `<path d="M${x + sd * 30} ${base} V${base - back - 40} Q${x + sd * 30} ${base - back - 56} ${x + sd * 18} ${base - back - 56} V${base - 50}" fill="${T.woodD}" ${O(3.5)}/><rect x="${x - 34}" y="${base - 56}" width="68" height="16" rx="5" fill="${color}" ${O(3)}/><path d="M${x - 26} ${base - 40} V${base} M${x + 26} ${base - 40} V${base}" stroke="${A.INK}" stroke-width="9"/><path d="M${x - 26} ${base - 40} V${base} M${x + 26} ${base - 40} V${base}" stroke="${T.woodD}" stroke-width="4"/>`;
    }
    return `<path d="M${x - 32} ${base} V${base - back} Q${x} ${base - back - 24} ${x + 32} ${base - back} V${base} Z" fill="${T.woodD}" ${O(3.5)}/><rect x="${x - 22}" y="${base - back + 8}" width="44" height="${back - 34}" rx="8" fill="${color}" ${O(2.4)}/><circle cx="${x}" cy="${base - back - 10}" r="7" fill="${T.metal}" ${O(2)}/>`;
  }
  function tableArt(A, T, b, d) {
    const O = A.O, P = A.P, [x0, , x1, B] = b.vis, top = B - 110, dd = 80, gold = d.gold >= 3;
    let s = `<g data-ol="${b.id}">` + shadowR(A, x0 + 10, B - 12, x1 + 10, 26);

    for (let x = x0 + 90; x < x1 - 50; x += 112) s += chair(A, T, x, top - dd + 20, T.fabD, 120);

    s += `<path d="${A.poly([[x0, top], [x1, top], [x1 - 30, top - dd], [x0 + 30, top - dd]])}" fill="${T.woodL}" ${O(4.5)}/>`;
    let gr = ''; for (let y = top - dd + 16; y < top; y += 16) gr += `M${x0 + 40} ${y} H${x1 - 40} `; s += `<path d="${gr}" stroke="${T.woodD}" stroke-width="2" opacity=".25"/>`;
    s += `<path d="${A.poly([[x0 + 70, top], [x1 - 70, top], [x1 - 90, top - dd + 6], [x0 + 90, top - dd + 6]])}" fill="${T.fab}" opacity=".9"/><path d="M${x0 + 72} ${top} H${x1 - 72}" stroke="${T.metal}" stroke-width="4"/>`;
    s += `<path d="M${x0 + 70} ${top} v34 l14 -10 l14 10 v-34 Z M${x1 - 70} ${top} v34 l-14 -10 l-14 10 v-34 Z" fill="${T.fab}" ${O(2.4)}/>`;
    s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="32" fill="${T.wood}" ${O(4)}/><path d="M${x0 + 4} ${top + 4} H${x1 - 4}" stroke="#fff" stroke-width="3" opacity=".2"/>`;
    if (gold) s += `<path d="M${x0 + 6} ${top + 16} H${x1 - 6}" stroke="${T.metal}" stroke-width="6"/>`;
    for (const lx of [x0 + 34, x1 - 34, (x0 + x1) / 2]) s += `<path d="M${lx - 14} ${top + 32} h28 l-4 ${B - top - 46} q-10 8 -20 0 Z" fill="${T.woodD}" ${O(3.5)}/><rect x="${lx - 18}" y="${B - 16}" width="36" height="12" rx="4" fill="${T.woodD}" ${O(2.6)}/>`;

    s += chair(A, T, x0 - 40, B - 10, T.fabD, 120, -1) + chair(A, T, x1 + 40, B - 10, T.fabD, 120, 1);

    const my = top - 50;
    s += `<path d="${A.poly([[x0 + 130, top - 10], [x0 + 330, top - 10], [x0 + 318, top - 70], [x0 + 142, top - 70]])}" fill="#efd9a8" ${O(2.6)}/><path d="M${x0 + 160} ${top - 30} q30 -26 60 -10 q30 14 70 -20" stroke="#4a8fc0" stroke-width="3" fill="none"/><path d="M${x0 + 170} ${top - 56} l20 30 l30 -10 l40 16" stroke="#b8323a" stroke-width="3" stroke-dasharray="6 5" fill="none"/>`;
    for (const [px, py, c] of [[x0 + 190, top - 26, '#b8323a'], [x0 + 260, top - 48, '#4a6fb0'], [x0 + 300, top - 22, T.metal]]) s += `<path d="M${px} ${py} l-6 -16 h12 Z" fill="${c}" ${O(1.8)}/><circle cx="${px}" cy="${py - 18}" r="5" fill="${c}" ${O(1.6)}/>`;
    s += `<rect x="${x0 + 350}" y="${my - 6}" width="70" height="16" rx="8" fill="#f0dfb8" ${O(2.4)}/><rect x="${x0 + 356}" y="${my - 20}" width="70" height="16" rx="8" fill="#e8d2a2" ${O(2.4)}/>`;
    for (const gx of [x0 + 470, x1 - 250]) s += `<path d="M${gx - 12} ${my - 20} h24 q0 18 -12 22 q-12 -4 -12 -22 Z" fill="${T.metal}" ${O(2.2)}/><path d="M${gx} ${my + 2} v10 M${gx - 8} ${my + 12} h16" stroke="${A.INK}" stroke-width="4" stroke-linecap="round"/>`;
    s += loot(A, T, x0 + 540, top - 16, 0.8, 1);
    s += `<path d="M${x1 - 200} ${my + 6} l40 -6 l30 8 l-40 6 Z" fill="${T.fabD}" ${O(2.4)}/>`;
    const cx2 = x1 - 120;
    s += glow(cx2, my - 70, 130) + `<path d="M${cx2 - 18} ${my + 10} h36 l-8 -12 h-20 Z" fill="${T.metal}" ${O(2.4)}/><path d="M${cx2} ${my - 2} V${my - 40} M${cx2 - 30} ${my - 40} Q${cx2} ${my - 24} ${cx2 + 30} ${my - 40}" fill="none" stroke="${A.INK}" stroke-width="8" stroke-linecap="round"/><path d="M${cx2} ${my - 2} V${my - 40} M${cx2 - 30} ${my - 40} Q${cx2} ${my - 24} ${cx2 + 30} ${my - 40}" fill="none" stroke="${T.metal}" stroke-width="4" stroke-linecap="round"/>`;
    for (const dx of [-30, 0, 30]) s += candleS(A, cx2 + dx, my - 40 - (dx ? 0 : 6), 26);
    return s + '</g>';
  }
  function fireArt(A, T, b) {
    const O = A.O, P = A.P, [x0, y0, x1, B] = b.vis, cx = (x0 + x1) / 2, st = T.stone, stD = T.stoneD, stL = T.stoneL;
    let s = `<g data-ol="${b.id}">` + glow(cx, B + 40, 300, 0.9);

    s += `<path d="${A.poly([[cx - 210, B + 30], [cx + 210, B + 30], [cx + 190, B], [cx - 190, B]])}" fill="${stL}" ${O(3.5)}/>`;

    s += `<rect x="${cx - 120}" y="${y0 - 40}" width="240" height="${200}" fill="${stD}" ${O(4)}/>`;
    s += `<rect x="${x0 + 20}" y="${y0 + 150}" width="${x1 - x0 - 40}" height="${B - y0 - 150}" fill="${st}" ${O(5)}/>`;
    let k = ''; for (let y = y0 + 190, i = 0; y < B - 10; y += 40, i++) { k += `M${x0 + 24} ${y} H${x1 - 24} `; for (let x = x0 + 60 + (i % 2) * 40; x < x1 - 30; x += 80) k += `M${x} ${y} v40 `; }
    for (let y = y0 - 20, i = 0; y < y0 + 150; y += 40, i++) { k += `M${cx - 116} ${y} H${cx + 116} `; for (let x = cx - 90 + (i % 2) * 40; x < cx + 110; x += 80) k += `M${x} ${y} v40 `; }
    s += `<path d="${k}" stroke="${A.INK}" stroke-width="2.4" opacity=".22"/>`;
    if (T.id === 'cherts') s += `<path d="M${x0 + 60} ${y0 + 200} l20 40 l-14 30 l24 50 M${x1 - 70} ${y0 + 190} l-16 50 l20 40" fill="none" stroke="#ff6a2a" stroke-width="8" opacity=".45"/><path d="M${x0 + 60} ${y0 + 200} l20 40 l-14 30 l24 50 M${x1 - 70} ${y0 + 190} l-16 50 l20 40" fill="none" stroke="#ffc23d" stroke-width="2.6"/>`;

    s += `<path d="${A.poly([[x0, y0 + 150], [x1, y0 + 150], [x1 - 14, y0 + 126], [x0 + 14, y0 + 126]])}" fill="${A.lt(stD, 0.2)}" ${O(3.5)}/><rect x="${x0}" y="${y0 + 150}" width="${x1 - x0}" height="30" rx="6" fill="${T.id === '42brothers' ? T.metal : stD}" ${O(4)}/>`;

    const fw = 150, fb = B;
    s += `<path d="M${cx - fw} ${fb} V${fb - 170} Q${cx} ${fb - 250} ${cx + fw} ${fb - 170} V${fb} Z" fill="${A.dk(stD, 0.2)}" ${O(4.5)}/>`;
    s += `<path d="M${cx - fw + 16} ${fb} V${fb - 160} Q${cx} ${fb - 230} ${cx + fw - 16} ${fb - 160} V${fb} Z" fill="#2a1a1a"/><path d="M${cx - fw + 20} ${fb - 120} H${cx + fw - 20} M${cx - fw + 20} ${fb - 80} H${cx + fw - 20} M${cx - 40} ${fb - 160} v40 M${cx + 40} ${fb - 120} v40" stroke="#4a3030" stroke-width="3"/>`;
    s += `<path d="M${cx - fw} ${fb - 170} Q${cx} ${fb - 250} ${cx + fw} ${fb - 170}" fill="none" stroke="${stL}" stroke-width="10"/><path d="M${cx - 12} ${fb - 226} h24 l-4 22 h-16 Z" fill="${stL}" ${O(2.6)}/>`;
    const fc = T.id === '42brothers' ? '#ff6ad0' : '#ff8a2a', fc2 = T.id === '42brothers' ? '#ffd0f0' : '#ffd25a';
    s += `<path d="M${cx - 96} ${fb - 8} q16 -24 30 0 M${cx + 66} ${fb - 8} q16 -24 30 0" fill="none" stroke="${A.INK}" stroke-width="8"/>`;
    s += `<path d="M${cx - 90} ${fb - 26} l180 -10 M${cx - 86} ${fb - 12} l176 8" stroke="${A.INK}" stroke-width="22" stroke-linecap="round"/><path d="M${cx - 90} ${fb - 26} l180 -10 M${cx - 86} ${fb - 12} l176 8" stroke="${T.woodD}" stroke-width="15" stroke-linecap="round"/><circle cx="${cx + 90}" cy="${fb - 36}" r="8" fill="${T.woodL}" ${O(2.4)}/><circle cx="${cx - 86}" cy="${fb - 12}" r="8" fill="${T.woodL}" ${O(2.4)}/>`;
    s += `<path d="M${cx - 86} ${fb - 30} q20 -110 60 -120 q-10 50 30 60 q20 -60 50 -90 q24 70 22 150 Z" fill="${fc}" ${O(3)}/><path d="M${cx - 46} ${fb - 34} q14 -60 40 -70 q-4 30 20 40 q14 -26 30 -40 q10 40 6 70 Z" fill="${fc2}"/>`;
    if (T.id === 'veggies') s += `<path d="M${cx} ${fb - 230} V${fb - 170}" stroke="${A.INK}" stroke-width="5"/><path d="M${cx - 50} ${fb - 170} h100 q0 60 -50 60 q-50 0 -50 -60 Z" fill="#3a3a40" ${O(3.5)}/><ellipse cx="${cx}" cy="${fb - 170}" rx="50" ry="10" fill="#e5383b" ${O(2.4)}/><circle cx="${cx - 14}" cy="${fb - 186}" r="7" fill="#fff" opacity=".6"/><circle cx="${cx + 18}" cy="${fb - 196}" r="5" fill="#fff" opacity=".5"/>`;

    s += candleS(A, x0 + 60, y0 + 128, 40) + candleS(A, x0 + 86, y0 + 128, 28) + loot(A, T, x1 - 80, y0 + 128, 0.8, 0) + glow(x0 + 70, y0 + 80, 60);
    const orn = {
      legion: `<path d="M${cx - 40} ${y0 + 10} H${cx + 40} V${y0 + 50} C${cx + 40} ${y0 + 80} ${cx + 18} ${y0 + 96} ${cx} ${y0 + 104} C${cx - 18} ${y0 + 96} ${cx - 40} ${y0 + 80} ${cx - 40} ${y0 + 50} Z" fill="${T.fab}" ${O(3.5)}/><path d="M${cx} ${y0 + 24} V${y0 + 88} M${cx - 22} ${y0 + 50} H${cx + 22}" stroke="${T.metal}" stroke-width="7"/>`,
      cats: `<circle cx="${cx}" cy="${y0 + 60}" r="44" fill="${P.cream}" ${O(3.5)}/><circle cx="${cx}" cy="${y0 + 60}" r="34" fill="none" stroke="${T.woodD}" stroke-width="3"/><path d="M${cx} ${y0 + 60} V${y0 + 36} M${cx} ${y0 + 60} L${cx + 18} ${y0 + 66}" stroke="${A.INK}" stroke-width="4" stroke-linecap="round"/><path d="M${cx - 38} ${y0 + 34} l-4 -30 l24 16 Z M${cx + 38} ${y0 + 34} l4 -30 l-24 16 Z" fill="${P.cream}" ${O(3)}/>`,
      monkeys: `<path d="M${cx - 40} ${y0 + 20} Q${cx - 46} ${y0 + 70} ${cx} ${y0 + 110} Q${cx + 46} ${y0 + 70} ${cx + 40} ${y0 + 20} Q${cx} ${y0} ${cx - 40} ${y0 + 20} Z" fill="#c08a4e" ${O(3.5)}/><path d="M${cx - 22} ${y0 + 50} l14 6 M${cx + 22} ${y0 + 50} l-14 6" stroke="${A.INK}" stroke-width="6" stroke-linecap="round"/><path d="M${cx - 16} ${y0 + 84} q16 10 32 0" fill="none" stroke="${A.INK}" stroke-width="4"/>`,
      veggies: `<rect x="${cx - 90}" y="${y0 + 20}" width="180" height="14" rx="4" fill="${T.woodL}" ${O(2.6)}/>` + [-60, -20, 20, 60].map((dx, i) => `<path d="M${cx + dx - 14} ${y0 + 20} v-34 q14 -10 28 0 v34 Z" fill="${['#e8d0a0', '#d0e8c0', '#f0c8a0', '#e0e0f0'][i]}" ${O(2.4)}/>`).join(''),
      '42brothers': `<path d="M${cx} ${y0 + 100} C${cx - 80} ${y0 + 50} ${cx - 50} ${y0 - 10} ${cx} ${y0 + 30} C${cx + 50} ${y0 - 10} ${cx + 80} ${y0 + 50} ${cx} ${y0 + 100} Z" fill="none" stroke="#ff4fa3" stroke-width="20" opacity=".35"/><path d="M${cx} ${y0 + 100} C${cx - 80} ${y0 + 50} ${cx - 50} ${y0 - 10} ${cx} ${y0 + 30} C${cx + 50} ${y0 - 10} ${cx + 80} ${y0 + 50} ${cx} ${y0 + 100} Z" fill="none" stroke="#ffd0ec" stroke-width="6"/>`,
      cherts: `<path d="M${cx - 50} ${y0 + 40} Q${cx - 50} ${y0 + 110} ${cx} ${y0 + 116} Q${cx + 50} ${y0 + 110} ${cx + 50} ${y0 + 40} Q${cx} ${y0 + 20} ${cx - 50} ${y0 + 40} Z" fill="#d81e1e" ${O(3.5)}/><path d="M${cx - 44} ${y0 + 44} Q${cx - 90} ${y0 + 10} ${cx - 76} ${y0 - 30} Q${cx - 60} ${y0 + 10} ${cx - 30} ${y0 + 30} M${cx + 44} ${y0 + 44} Q${cx + 90} ${y0 + 10} ${cx + 76} ${y0 - 30} Q${cx + 60} ${y0 + 10} ${cx + 30} ${y0 + 30}" fill="#2e1e1e" ${O(3)}/><path d="M${cx - 30} ${y0 + 66} l18 8 M${cx + 30} ${y0 + 66} l-18 8" stroke="#ffc23d" stroke-width="7" stroke-linecap="round"/><path d="M${cx - 20} ${y0 + 96} l8 -6 l6 8 l6 -8 l6 8 l6 -8 l8 6" fill="none" stroke="${A.INK}" stroke-width="3"/>`,
      ugabugi: `<path d="M${cx - 110} ${y0 + 80} C${cx - 110} ${y0 + 10} ${cx - 60} ${y0 - 20} ${cx - 20} ${y0 + 40} M${cx + 110} ${y0 + 80} C${cx + 110} ${y0 + 10} ${cx + 60} ${y0 - 20} ${cx + 20} ${y0 + 40}" fill="none" stroke="${A.INK}" stroke-width="22" stroke-linecap="round"/><path d="M${cx - 110} ${y0 + 80} C${cx - 110} ${y0 + 10} ${cx - 60} ${y0 - 20} ${cx - 20} ${y0 + 40} M${cx + 110} ${y0 + 80} C${cx + 110} ${y0 + 10} ${cx + 60} ${y0 - 20} ${cx + 20} ${y0 + 40}" fill="none" stroke="#f4ecd8" stroke-width="14" stroke-linecap="round"/>`,
    };
    s += orn[T.id] || orn.legion;

    const lx = x1 + 24, lb = B + 10;
    s += `<path d="M${lx - 6} ${lb} V${lb - 120} M${lx + 116} ${lb} V${lb - 120}" stroke="${A.INK}" stroke-width="12" stroke-linecap="round"/><path d="M${lx - 6} ${lb} V${lb - 120} M${lx + 116} ${lb} V${lb - 120}" stroke="${T.woodD}" stroke-width="6" stroke-linecap="round"/>`;
    for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - (row % 2); i++) { const px = lx + 14 + i * 28 + (row % 2) * 14, py = lb - 14 - row * 26; s += `<circle cx="${px}" cy="${py}" r="14" fill="${T.woodL}" ${O(2.6)}/><circle cx="${px}" cy="${py}" r="6" fill="none" stroke="${T.woodD}" stroke-width="2"/>`; }
    const tx = x0 - 20;
    s += `<path d="M${tx} ${B} V${B - 130} M${tx + 18} ${B} V${B - 120}" stroke="${A.INK}" stroke-width="8" stroke-linecap="round"/><path d="M${tx} ${B} V${B - 130} M${tx + 18} ${B} V${B - 120}" stroke="${T.iron === '#2a1a30' ? '#6a5a7a' : '#8a8494'}" stroke-width="3.4" stroke-linecap="round"/><path d="M${tx - 8} ${B - 136} h16 M${tx + 10} ${B - 4} h18 v-12 h-18 Z" fill="#8a8494" ${O(2.2)}/><path d="M${tx - 14} ${B + 4} h50" stroke="${A.INK}" stroke-width="7" stroke-linecap="round"/>`;
    return s + '</g>';
  }
  function mapArt(A, T, b) {
    const O = A.O, P = A.P, [x0, y0, x1, B] = b.vis, cx = (x0 + x1) / 2;
    let s = `<g data-ol="${b.id}">`;

    const fx0 = x0 + 20, fx1 = x1 - 20, fy0 = y0 + 20, fy1 = y0 + 300, fr = T.id === '42brothers' ? T.metal : T.woodD;
    s += `<rect x="${fx0 + 8}" y="${fy0 + 10}" width="${fx1 - fx0}" height="${fy1 - fy0}" rx="8" fill="${A.INK}" opacity=".25"/><rect x="${fx0}" y="${fy0}" width="${fx1 - fx0}" height="${fy1 - fy0}" rx="8" fill="${fr}" ${O(4.5)}/><rect x="${fx0 + 8}" y="${fy0 + 8}" width="${fx1 - fx0 - 16}" height="${fy1 - fy0 - 16}" rx="4" fill="none" stroke="${T.metal}" stroke-width="3"/>`;
    s += `<rect x="${fx0 + 18}" y="${fy0 + 18}" width="${fx1 - fx0 - 36}" height="${fy1 - fy0 - 36}" fill="#bfe0e8"/>`;
    s += `<path d="M${fx0 + 50} ${fy0 + 90} q60 -50 140 -20 q60 -40 120 10 q70 -10 80 60 q20 60 -40 90 q-80 40 -150 10 q-90 20 -130 -30 q-40 -60 -20 -120 Z" fill="#efd9a8" ${O(3)}/><path d="M${fx0 + 70} ${fy0 + 110} q50 -30 110 -6 q60 -30 100 10 q50 -6 60 40 q10 40 -30 60 q-60 26 -120 4 q-70 14 -100 -20 q-30 -40 -20 -88 Z" fill="#a9c27a"/>`;
    let mt = ''; for (const [px, py] of [[fx0 + 250, fy0 + 100], [fx0 + 280, fy0 + 110], [fx0 + 310, fy0 + 100]]) mt += `M${px - 16} ${py + 12} L${px} ${py - 14} L${px + 16} ${py + 12} Z `;
    s += `<path d="${mt}" fill="#b39a8c" ${O(2.4)}/>`;
    let tr = ''; for (const [px, py] of [[fx0 + 120, fy0 + 160], [fx0 + 140, fy0 + 172], [fx0 + 106, fy0 + 178]]) tr += `M${px} ${py} m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 `;
    s += `<path d="${tr}" fill="#5a9a4a" ${O(2)}/>`;
    s += `<path d="M${fx0 + 120} ${fy0 + 70} q40 60 10 120 M${fx0 + 260} ${fy0 + 60} q-20 80 30 150" stroke="#4a8fc0" stroke-width="5" fill="none"/>`;
    s += `<path d="M${fx0 + 110} ${fy0 + 140} L${fx0 + 230} ${fy0 + 110} L${fx0 + 330} ${fy0 + 180} L${fx0 + 190} ${fy0 + 210}" fill="none" stroke="#b8323a" stroke-width="4" stroke-dasharray="8 7"/>`;
    for (const [px, py] of [[fx0 + 110, fy0 + 140], [fx0 + 230, fy0 + 110], [fx0 + 330, fy0 + 180], [fx0 + 190, fy0 + 210]]) s += `<path d="M${px - 10} ${py + 8} v-14 l5 -6 l5 6 l5 -6 l5 6 v14 Z" fill="${T.fab}" ${O(2)}/>`;
    const rx = fx1 - 60, ry = fy1 - 64;
    s += `<path d="M${rx} ${ry - 30} L${rx + 8} ${ry - 8} L${rx + 30} ${ry} L${rx + 8} ${ry + 8} L${rx} ${ry + 30} L${rx - 8} ${ry + 8} L${rx - 30} ${ry} L${rx - 8} ${ry - 8} Z" fill="${T.metal}" ${O(2.4)}/><circle cx="${rx}" cy="${ry}" r="5" fill="${T.fab}"/>`;
    s += `<path d="M${fx0 + 40} ${fy1 - 50} q14 -10 28 0 q14 10 28 0" fill="none" stroke="#4a8fc0" stroke-width="3"/><path d="M${fx0 + 60} ${fy1 - 46} c-20 10 -20 30 0 30 l-8 6 l20 -4" fill="none" stroke="#3f8f8a" stroke-width="4"/>`;

    const ty = B - 70;
    s += shadowR(A, cx - 190, B - 16, cx + 200, 26);
    s += `<path d="${A.poly([[cx - 200, ty], [cx + 200, ty], [cx + 180, ty - 50], [cx - 180, ty - 50]])}" fill="${T.woodL}" ${O(4)}/><rect x="${cx - 200}" y="${ty}" width="400" height="22" fill="${T.wood}" ${O(3.5)}/>`;
    for (const lx of [cx - 180, cx + 180]) s += `<path d="M${lx - 10} ${ty + 22} h20 l-3 ${B - ty - 22} h-14 Z" fill="${T.woodD}" ${O(3)}/>`;
    s += `<path d="${A.poly([[cx - 110, ty - 8], [cx + 110, ty - 8], [cx + 96, ty - 44], [cx - 96, ty - 44]])}" fill="#efd9a8" ${O(2.6)}/><path d="M${cx - 70} ${ty - 20} q40 -20 80 -4 q20 6 40 -8" stroke="#4a8fc0" stroke-width="3" fill="none"/><circle cx="${cx + 20}" cy="${ty - 26}" r="7" fill="#b8323a" ${O(2)}/>`;
    s += `<path d="M${cx - 150} ${ty - 30} l20 -8 l10 14 Z" fill="${T.metal}" ${O(2)}/><rect x="${cx + 130}" y="${ty - 46}" width="40" height="34" rx="4" fill="${T.woodD}" ${O(2.4)}/>`;
    const gx = cx + 250, gy = B - 100;
    s += shadowE(A, gx + 6, B, 40, 10) + `<path d="M${gx - 30} ${B} h60 l-10 -14 h-40 Z M${gx - 4} ${B - 14} h8 v-26 h-8 Z" fill="${T.woodD}" ${O(2.6)}/><circle cx="${gx}" cy="${gy - 4}" r="46" fill="#7ac0e0" ${O(3.5)}/><path d="M${gx - 30} ${gy - 30} q20 -6 26 10 q-6 18 10 24 q14 20 -6 30 M${gx + 14} ${gy - 40} q20 10 24 30" fill="#a9c27a" ${O(2)}/><path d="M${gx - 52} ${gy - 4} A52 52 0 0 1 ${gx + 52} ${gy - 4}" fill="none" stroke="${T.metal}" stroke-width="6"/>`;
    return s + '</g>';
  }
  function doorArt(A, T, b) {
    const O = A.O, L = map(), cx = L.G.CX, B = L.G.BOTTOM, w = L.G.DOOR_W;
    let s = `<g data-ol="${b.id}">`;
    s += `<path d="M${cx - w / 2 - 30} ${L.H} V${B - 40} Q${cx} ${B - 120} ${cx + w / 2 + 30} ${B - 40} V${L.H} Z" fill="${T.stoneD}" ${O(5)}/><path d="M${cx - w / 2 - 22} ${B - 40} Q${cx} ${B - 110} ${cx + w / 2 + 22} ${B - 40}" fill="none" stroke="${T.stoneL}" stroke-width="6"/><path d="M${cx - 12} ${B - 104} h24 l-4 20 h-16 Z" fill="${T.metal}" ${O(2.4)}/>`;
    s += `<path d="M${cx - w / 2} ${L.H} V${B} H${cx + w / 2} V${L.H} Z" fill="#f4dca0" ${O(4)}/><path d="M${cx - w / 2 + 10} ${L.H} V${B + 30} H${cx + w / 2 - 10} V${L.H} Z" fill="#9cc56e" opacity=".8"/>`;
    for (const sd of [-1, 1]) s += `<path d="${A.poly([[cx + sd * w / 2, B], [cx + sd * (w / 2 - 60), B + 40], [cx + sd * (w / 2 - 60), L.H], [cx + sd * w / 2, L.H]])}" fill="${T.wood}" ${O(4)}/><path d="M${cx + sd * (w / 2 - 10)} ${B + 30} L${cx + sd * (w / 2 - 50)} ${B + 50}" stroke="${T.iron}" stroke-width="7"/>`;
    s += A.board(cx, B - 70, 'ВЫХОД', 20, { bg: T.sign, ears: !!T.ears, rim: T.metal, fg: T.metal });
    return s + '</g>';
  }
   
  function rackArt(A, T, x0, x1, B) {
    const O = A.O, steel = T.id === 'ugabugi' ? '#cfc6b6' : '#d6dbe4';
    let s = shadowR(A, x0 + 10, B - 14, x1, 26);

    const rx0 = x0 + 20, rx1 = x0 + 300, rt = B - 230;
    s += `<rect x="${rx0}" y="${rt}" width="20" height="${B - rt}" fill="${T.woodD}" ${O(3)}/><rect x="${rx1 - 20}" y="${rt}" width="20" height="${B - rt}" fill="${T.woodD}" ${O(3)}/>`;
    s += `<rect x="${rx0 - 6}" y="${rt + 20}" width="${rx1 - rx0 + 12}" height="16" rx="4" fill="${T.wood}" ${O(3)}/><rect x="${rx0 - 6}" y="${B - 60}" width="${rx1 - rx0 + 12}" height="16" rx="4" fill="${T.wood}" ${O(3)}/>`;
    const wpn = T.id === 'ugabugi' ? ['club', 'spear', 'club', 'spear'] : T.id === 'monkeys' ? ['spear', 'club', 'spear', 'bow'] : ['spear', 'sword', 'axe', 'sword'];
    wpn.forEach((k, i) => {
      const x = rx0 + 50 + i * 60;
      if (k === 'spear') s += `<path d="M${x} ${B - 50} V${rt - 60}" stroke="${A.INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${B - 50} V${rt - 60}" stroke="${T.woodL}" stroke-width="5" stroke-linecap="round"/><path d="M${x - 10} ${rt - 56} L${x} ${rt - 100} L${x + 10} ${rt - 56} Z" fill="${steel}" ${O(2.6)}/>`;
      else if (k === 'sword') s += `<path d="M${x - 6} ${B - 50} V${rt - 30} L${x} ${rt - 46} L${x + 6} ${rt - 30} V${B - 50} Z" fill="${steel}" ${O(2.6)}/><path d="M${x - 20} ${B - 50} H${x + 20}" stroke="${A.INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x - 20} ${B - 50} H${x + 20}" stroke="${T.metal}" stroke-width="5" stroke-linecap="round"/>`;
      else if (k === 'axe') s += `<path d="M${x} ${B - 50} V${rt - 30}" stroke="${A.INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${B - 50} V${rt - 30}" stroke="${T.woodL}" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${rt - 20} q34 -10 30 30 q-14 -10 -30 0 Z" fill="${steel}" ${O(2.6)}/>`;
      else if (k === 'bow') s += `<path d="M${x} ${rt - 40} Q${x + 40} ${(rt + B) / 2 - 30} ${x} ${B - 60}" fill="none" stroke="${A.INK}" stroke-width="10"/><path d="M${x} ${rt - 40} Q${x + 40} ${(rt + B) / 2 - 30} ${x} ${B - 60}" fill="none" stroke="${T.woodL}" stroke-width="5"/><path d="M${x} ${rt - 40} V${B - 60}" stroke="${A.INK}" stroke-width="1.6"/>`;
      else s += `<path d="M${x} ${B - 50} L${x + 6} ${rt}" stroke="${A.INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x} ${B - 50} L${x + 6} ${rt}" stroke="${T.woodL}" stroke-width="6" stroke-linecap="round"/><ellipse cx="${x + 8}" cy="${rt - 10}" rx="20" ry="30" fill="${T.woodL}" ${O(3)}/>`;
    });

    const dx = x0 + 420, db = B;
    s += shadowE(A, dx + 6, db, 50, 12) + `<path d="M${dx - 30} ${db} h60 l-8 -14 h-44 Z" fill="${T.woodD}" ${O(3)}/><path d="M${dx} ${db - 14} V${db - 90}" stroke="${T.woodD}" stroke-width="12"/>`;
    const arm = T.id === 'monkeys' || T.id === 'ugabugi' ? T.fab : steel;
    s += `<path d="M${dx - 50} ${db - 220} Q${dx} ${db - 250} ${dx + 50} ${db - 220} L${dx + 40} ${db - 100} Q${dx} ${db - 84} ${dx - 40} ${db - 100} Z" fill="${arm}" ${O(4)}/><path d="M${dx} ${db - 236} V${db - 92}" stroke="${A.INK}" stroke-width="2.4" opacity=".4"/><path d="M${dx - 46} ${db - 140} Q${dx} ${db - 126} ${dx + 46} ${db - 140}" fill="none" stroke="${T.metal}" stroke-width="6"/>`;
    s += `<circle cx="${dx - 58}" cy="${db - 216}" r="20" fill="${arm}" ${O(3)}/><circle cx="${dx + 58}" cy="${db - 216}" r="20" fill="${arm}" ${O(3)}/>`;
    if (T.id === 'monkeys' || T.id === 'ugabugi') s += `<path d="M${dx - 30} ${db - 250} Q${dx - 34} ${db - 300} ${dx} ${db - 320} Q${dx + 34} ${db - 300} ${dx + 30} ${db - 250} Z" fill="#c08a4e" ${O(3.5)}/><path d="M${dx - 16} ${db - 286} l10 4 M${dx + 16} ${db - 286} l-10 4" stroke="${A.INK}" stroke-width="5" stroke-linecap="round"/>`;
    else s += `<path d="M${dx - 32} ${db - 244} Q${dx - 34} ${db - 310} ${dx} ${db - 314} Q${dx + 34} ${db - 310} ${dx + 32} ${db - 244} Z" fill="${steel}" ${O(3.5)}/><path d="M${dx - 22} ${db - 280} H${dx + 22} M${dx} ${db - 280} V${db - 250}" stroke="${A.INK}" stroke-width="5"/><path d="M${dx} ${db - 314} q20 -30 40 -20 q-20 4 -30 24" fill="${T.fab}" ${O(2.4)}/>`;

    s += `<path d="M${dx + 70} ${db - 10} V${db - 90} H${dx + 140} V${db - 40} Q${dx + 140} ${db - 10} ${dx + 105} ${db} Q${dx + 70} ${db - 10} ${dx + 70} ${db - 40} Z" fill="${T.fab}" ${O(3.5)}/><path d="M${dx + 105} ${db - 84} V${db - 8} M${dx + 76} ${db - 56} H${dx + 134}" stroke="${T.metal}" stroke-width="6"/>`;
    return s;
  }

   
  function draw(o) {
    const A = kit(), L = map(); o = o || {};
    const T = Object.assign({ id: THEME[o.style] ? o.style : 'legion' }, themeOf(o.style));
    const d = L.decor(o.tier), color = o.color || '#c0504a', G = L.G, W = L.W, H = L.H, O = A.O, INK = A.INK;
    const layers = [], props = [];
    const DEFS = `<defs><radialGradient id="ghGlow"><stop offset="0" stop-color="${T.glow}" stop-opacity=".55"/><stop offset="1" stop-color="${T.glow}" stop-opacity="0"/></radialGradient></defs>`;
    const layer = (box, svg) => layers.push({ x: box[0], y: box[1], w: box[2] - box[0], h: box[3] - box[1], svg: `<g>${DEFS}${svg}</g>` });
    const prop = (svg, box, z, ref) => props.push({ x: box[0], y: box[1], w: box[2] - box[0], h: box[3] - box[1], z, svg: DEFS + svg, ref });
    const S = G.SIDE, WY = G.WALL_Y, BT = G.BOTTOM;


    for (let y = 0; y < H; y += 1080) for (let x = 0; x < W; x += 960) {
      const x1 = x + 960, y1 = Math.min(H, y + 1080);
      let s = '';
      const fy0 = Math.max(y, WY), fy1 = Math.min(y1, BT);
      if (fy1 > fy0) {
        const dy0 = fy0, dy1 = Math.min(fy1, G.DAIS_Y);
        if (dy1 > dy0) s += floorPat(A, T, T.daisKind, x, dy0, x1, dy1, T.dais, T.daisD, T.daisL, x * 7 + y + 1);
        const hy0 = Math.max(fy0, G.DAIS_Y), hy1 = fy1;
        if (hy1 > hy0) s += floorPat(A, T, T.floorKind, x, hy0, x1, hy1, T.floor, T.floorD, T.floorL, x * 13 + y + 2);
      }
      if (s) layer([x, y, x1, y1], s);
    }

    let lite = '';
    for (const wy of [1650, 2250, 2750]) lite += `<path d="M${S} ${wy - 70} L${S + 520} ${wy + 40} L${S + 520} ${wy + 170} L${S} ${wy + 70} Z M${W - S} ${wy - 70} L${W - S - 520} ${wy + 40} L${W - S - 520} ${wy + 170} L${W - S} ${wy + 70} Z" fill="#fff4c8" opacity=".16"/>`;
    layer([S, 1500, W - S, 3000], lite);

    layer([S - 4, WY, S + 40, BT], `<rect x="${S}" y="${WY + 40}" width="22" height="${BT - WY - 40}" fill="${T.wainD}" ${O(3)}/><rect x="${S + 22}" y="${WY + 40}" width="14" height="${BT - WY - 40}" fill="${INK}" opacity=".14"/>`);
    layer([W - S - 40, WY, W - S + 4, BT], `<rect x="${W - S - 22}" y="${WY + 40}" width="22" height="${BT - WY - 40}" fill="${T.wainD}" ${O(3)}/><rect x="${W - S - 36}" y="${WY + 40}" width="14" height="${BT - WY - 40}" fill="${INK}" opacity=".14"/>`);


    {
      const y0 = G.DAIS_Y, y1 = G.STEP_Y, n = 4, h = (y1 - y0) / n;
      let s = `<rect x="${S}" y="${y0}" width="${G.STEP_X0 - S}" height="${y1 - y0}" fill="${T.stoneD}" ${O(4)}/><rect x="${G.STEP_X1}" y="${y0}" width="${W - S - G.STEP_X1}" height="${y1 - y0}" fill="${T.stoneD}" ${O(4)}/>`;
      let k = ''; for (let yy = y0 + 45, i = 0; yy < y1; yy += 45, i++) { k += `M${S} ${yy} H${G.STEP_X0} M${G.STEP_X1} ${yy} H${W - S} `; for (let xx = S + 60 + (i % 2) * 60; xx < W - S; xx += 120) if (xx < G.STEP_X0 || xx > G.STEP_X1) k += `M${xx} ${yy - 45} v45 `; }
      s += `<path d="${k}" stroke="${INK}" stroke-width="2.4" opacity=".25"/>`;
      for (let i = 0; i < n; i++) { const t = y0 + i * h; s += `<rect x="${G.STEP_X0}" y="${t}" width="${G.STEP_X1 - G.STEP_X0}" height="${h}" fill="${i % 2 ? T.stoneL : A.lt(T.stoneL, 0.12)}" ${O(3.5)}/><path d="M${G.STEP_X0 + 4} ${t + 5} H${G.STEP_X1 - 4}" stroke="#fff" stroke-width="3" opacity=".25"/><path d="M${G.STEP_X0 + 4} ${t + h - 6} H${G.STEP_X1 - 4}" stroke="${INK}" stroke-width="5" opacity=".18"/>`; }
      s += `<path d="M${S} ${y1 + 6} H${W - S}" stroke="${INK}" stroke-width="16" opacity=".12"/>`;
      layer([S - 10, y0 - 10, W - S + 10, y1 + 30], s);
    }

    {
      const [c0, c1] = G.CARPET, wide = d.carpet >= 4 ? 30 : 0, x0 = c0 - wide, x1 = c1 + wide, y0 = 760, y1 = BT + 40;
      const s = carpetSvg(A, T, x0, x1, y0, y1, d.carpet);
      for (let y = 0; y < y1; y += 1080) { const a = Math.max(y0, y), b = Math.min(y1, y + 1080); if (b > a) layer([x0 - 40, a - 30, x1 + 40, b + 10], s); }
    }

    {
      let s = `<rect x="0" y="0" width="${W}" height="${WY + 40}" fill="${T.wallD}"/><rect x="${S}" y="40" width="${W - 2 * S}" height="${WY}" fill="${T.wall}" ${O(4)}/>`;
      s += wallPat(A, T, S, 60, W - S, WY - 120, 91);
      s += `<rect x="${S}" y="40" width="${W - 2 * S}" height="22" fill="${T.wainD}" ${O(3)}/><rect x="${S}" y="62" width="${W - 2 * S}" height="14" fill="${INK}" opacity=".15"/>`;
      s += `<rect x="${S}" y="${WY - 110}" width="${W - 2 * S}" height="150" fill="${T.wain}" ${O(4)}/>`;
      let pl = ''; for (let x = S + 20; x < W - S - 100; x += 120) pl += `M${x} ${WY - 92} h96 v104 h-96 Z `; s += `<path d="${pl}" fill="${A.dk(T.wain, 0.08)}" stroke="${T.wainD}" stroke-width="3"/>`;
      s += `<rect x="${S}" y="${WY - 120}" width="${W - 2 * S}" height="16" fill="${A.lt(T.wain, 0.2)}" ${O(3)}/><rect x="${S}" y="${WY + 22}" width="${W - 2 * S}" height="20" fill="${T.wainD}" ${O(3)}/><rect x="${S}" y="${WY + 42}" width="${W - 2 * S}" height="16" fill="${INK}" opacity=".2"/>`;
      layer([0, 0, W, WY + 60], s);
    }
    for (const [sx, dir] of [[0, 1], [W - S, -1]]) {
      for (let y = 0; y < H; y += 1080) {
        const y1 = Math.min(H, y + 1080);
        let s = `<rect x="${sx}" y="${y}" width="${S}" height="${y1 - y}" fill="${A.dk(T.wallD, 0.15)}"/><rect x="${dir > 0 ? S - 26 : W - S}" y="${Math.max(y, 40)}" width="26" height="${y1 - Math.max(y, 40)}" fill="${T.wall}" ${O(3)}/>`;
        for (const wy of [1650, 2250, 2750]) if (wy >= y && wy < y1) {

          const wx0 = sx + 24, ww = S - 48;
          s += `<rect x="${wx0 - 8}" y="${wy - 104}" width="${ww + 16}" height="208" rx="${(ww + 16) / 2}" fill="${A.dk(T.wallD, 0.3)}" ${O(3.5)}/>`;
          s += `<rect x="${wx0}" y="${wy - 92}" width="${ww}" height="184" rx="${ww / 2}" fill="${T.glass}" ${O(4)}/><path d="M${wx0 + ww / 2} ${wy - 90} V${wy + 90} M${wx0 + 4} ${wy - 20} H${wx0 + ww - 4} M${wx0 + 4} ${wy + 40} H${wx0 + ww - 4}" stroke="${T.woodD}" stroke-width="5"/>`;
          s += `<path d="M${wx0 + 16} ${wy - 60} l20 -20 M${wx0 + 16} ${wy - 30} l34 -34" stroke="#fff" stroke-width="5" opacity=".6" stroke-linecap="round"/>`;
          const px = dir > 0 ? sx + S - 14 : sx + 14;
          s += `<rect x="${dir > 0 ? sx + S - 30 : sx + 4}" y="${wy + 60}" width="26" height="40" rx="4" fill="${T.wain}" ${O(2.6)}/><circle cx="${px}" cy="${wy + 54}" r="16" fill="#5a9a4a" ${O(2.4)}/><circle cx="${px - 4}" cy="${wy + 48}" r="5" fill="${T.id === 'cherts' ? '#ff6a2a' : '#ff8fa3'}"/>`;
        }
        layer([sx - 4, y, sx + S + 4, y1], s);
      }
    }
    layer([0, BT - 20, W, H], `<rect x="0" y="${BT}" width="${W}" height="${H - BT}" fill="${A.dk(T.wallD, 0.15)}"/><rect x="${S}" y="${BT - 14}" width="${W - 2 * S}" height="26" fill="${T.wall}" ${O(3)}/><rect x="${S}" y="${BT - 30}" width="${W - 2 * S}" height="16" fill="${T.wainD}" ${O(2.6)}/>`);


    {
      const b = L.OBJ.find((x) => x.id === 'banner'), cx = (b.vis[0] + b.vis[2]) / 2, w = b.vis[2] - b.vis[0] - 60;
      const emb = crest(A, o.emblem, cx - 90, b.vis[1] + 110, 180, color);
      layer([b.vis[0] - 40, b.vis[1] - 20, b.vis[2] + 40, b.vis[3] + 30], `<g data-ol="banner">${banner(A, T, cx, b.vis[1] + 20, w, b.vis[3] - b.vis[1] - 30, color, emb, d.gold >= 1)}</g>`);
    }
    for (let i = 0; i < d.banners; i++) {
      const [x, y, side] = G.BANNER_AT[i];
      if (side === 'b') layer([x - 90, y - 20, x + 90, y + 310], banner(A, T, x, y, 120, 270, color, null, d.gold >= 2));
      else layer([x - 60, y - 20, x + 60, y + 310], banner(A, T, x, y, 70, 260, color, null, d.gold >= 2));
    }
    for (let i = 0; i < d.trophies; i++) { const [x, y] = G.TROPHY_AT[i]; layer([x - 90, y - 40, x + 90, y + 140], trophy(A, T, i, x, y)); }


    const OB = Object.fromEntries(L.OBJ.map((x) => [x.id, x]));
    const box = (b, m) => [b.vis[0] - (m || 60), b.vis[1] - (m || 60), b.vis[2] + (m || 60), b.vis[3] + (m || 60)];
    prop(deskArt(A, T, OB.desk), box(OB.desk), OB.desk.vis[3], 'desk');
    prop(chestArt(A, T, OB.chest, color), box(OB.chest, 80), OB.chest.vis[3], 'chest');
    prop(boardArt(A, T, OB.board), box(OB.board), OB.board.vis[3], 'board');
    prop(trophyArt(A, T, OB.trophy, d), box(OB.trophy), OB.trophy.vis[3], 'trophy');
    prop(throneArt(A, T, OB.throne, d, color), box(OB.throne, 100), OB.throne.vis[3], 'throne');
    prop(tableArt(A, T, OB.table, d), box(OB.table, 110), OB.table.vis[3], 'table');
    prop(fireArt(A, T, OB.fire), box(OB.fire, 220), OB.fire.vis[3], 'fire');
    prop(mapArt(A, T, OB.map), box(OB.map, 120), OB.map.vis[3], 'map');
    prop(doorArt(A, T, OB.door), [OB.door.vis[0] - 40, OB.door.vis[1] - 80, OB.door.vis[2] + 40, H], H, 'door');
    { const [x0, y0, x1, B] = G.RACK.vis; prop(rackArt(A, T, x0, x1, B), [x0 - 40, y0 - 120, x1 + 40, B + 30], B, 'rack'); }
    for (const [x, B] of G.COLUMNS) prop(column(A, T, x, B, 470, d.gold), [x - 80, B - 500, x + 80, B + 24], B, 'column');

    for (const [a, b] of [[S, G.STEP_X0], [G.STEP_X1, W - S]]) {
      const y = G.DAIS_Y + 10, rc = T.id === 'monkeys' || T.id === 'ugabugi' ? T.woodL : T.stoneL;
      let s = `<rect x="${a}" y="${y - 70}" width="${b - a}" height="18" rx="6" fill="${rc}" ${O(3.5)}/><rect x="${a}" y="${y - 6}" width="${b - a}" height="16" fill="${T.stone}" ${O(3)}/>`;
      let bal = ''; for (let x = a + 30; x < b - 10; x += 52) bal += `M${x - 10} ${y - 6} q-6 -12 2 -24 q-8 -10 8 -26 q16 16 8 26 q8 12 2 24 Z `;
      s += `<path d="${bal}" fill="${rc}" ${O(2.6)}/><path d="M${a + 4} ${y - 64} H${b - 4}" stroke="#fff" stroke-width="3" opacity=".3"/>`;
      if (d.gold >= 3) s += `<path d="M${a + 4} ${y - 61} H${b - 4}" stroke="${T.metal}" stroke-width="5"/>`;
      prop(s, [a - 10, y - 90, b + 10, y + 20], y + 10, 'rail');
    }
    for (let i = 0; i < d.candles; i++) { const [x, B] = G.CANDLE_AT[i]; prop(light(A, T, x, B, d.gold >= 2), [x - 110, B - 280, x + 110, B + 20], B, 'candle'); }
    for (let i = 0; i < d.braziers; i++) { const [x, B] = G.BRAZIER_AT[i]; prop(brazier(A, T, x, B, 1, d.gold >= 3), [x - 130, B - 260, x + 130, B + 20], B, 'brazier'); }
    return { sky: `linear-gradient(${T.sky}, ${T.sky})`, layers, props, style: T.id };
  }
   
  const nodes = (R) => { const n = (s) => (s.match(/<[a-zA-Z]/g) || []).length; let k = 0; for (const l of R.layers) k += n(l.svg); for (const p of R.props) k += n(p.svg); return k; };

  const API = { use, draw, nodes, colorOf, crest, COLORS, STYLES, THEME };
  if (typeof window !== 'undefined') window.LGGuildHallArt = API;
  if (typeof module === 'object' && module.exports) module.exports = API;
})(typeof self !== 'undefined' ? self : this);















(function () {
  'use strict';
  const L = window.LGGuildHallMap, ART = window.LGGuildHallArt;
  if (!L || !ART || window.LGGuildHall) return;
  const PRES_MS = 3000;
  const IDX_TTL = 60e3;
  const NEAR = 120;
  const base = () => window.LG_BASE || '';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ROLE = { leader: 'глава', lead: 'руководство', trusted: 'доверенное лицо', novice: 'новичок', officer: 'руководство', member: 'новичок' };
  async function j(r) { try { const x = await r.json(); return x && typeof x === 'object' ? x : { ok: false, error: 'нет ответа' }; } catch { return { ok: false, error: r.status === 429 ? 'слишком часто - подожди немного' : 'нет ответа' }; } }
  const apiGet = () => fetch(base() + '/api/guildhall', { credentials: 'same-origin' }).then(j, () => ({ ok: false, error: 'нет связи' }));
  const apiAct = (b) => fetch(base() + '/api/guildhall/act', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then(j, () => ({ ok: false, error: 'нет связи' }));
  const js = (src) => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('не загрузился ' + src)); document.head.appendChild(s); });
  function deps() {
    const V = window.LG_CITYV || {};
    return (window.LGTownKitMap ? Promise.resolve() : js(`/site/tk-map.js?v=${V.km || ''}`))
      .then(() => (window.LGTownKitArt ? null : js(`/site/tk-art.js?v=${V.ka || ''}`)))
      .then(() => (window.LGCityGL ? null : js(`/site/citygl.js?v=${V.gl || ''}`)))
      .then(() => window.LGCityGL.load(V));
  }

   
  let IDX = null, idxAt = 0, idxP = null;
  function index(force) {

    const ttl = IDX && !IDX.ok && (IDX.closed || IDX.unavailable || IDX.error === 'войди через Twitch') ? 10 * IDX_TTL : IDX_TTL;
    if (!force && IDX && Date.now() - idxAt < ttl) return Promise.resolve(IDX);
    if (idxP) return idxP;
    idxP = apiGet().then((r) => { IDX = r; idxAt = Date.now(); idxP = null; return r; });
    return idxP;
  }
   
  function on() { if (!IDX) { void index(); return null; } return !!IDX.ok; }
   
  async function enter() {
    if (OPEN) return;
    const r = await index(true);

    if (!r || !r.ok) { toast(r && (r.closed || r.unavailable) ? 'Здание гильдий скоро откроется' : (r && r.error) || 'Здание гильдии сейчас недоступно', !(r && (r.closed || r.unavailable))); return; }
    if (!r.guild) { noGuild(); return; }
    open(r);
  }
  function noGuild() {
    const box = modal('gh-noguild', `<h2>Здание гильдии</h2><p>Внутрь пускают только своих: у каждой гильдии здесь свой зал. <b>Вступи в гильдию</b> - и заходи.</p>
      <div class="gh-btns"><button type="button" class="gh-btn" data-g="pick">Гильдии альянса</button></div>`);
    box.body.querySelector('[data-g="pick"]').onclick = () => { box.close(); try { if (window.LGGuilds) window.LGGuilds.pick(); else toast('Окно гильдий не загрузилось', true); } catch (e) { console.warn('[здание гильдии] окно гильдий', e); } };
  }

  function entryTick() {
    if (document.hidden || OPEN) return;
    const hud = document.querySelector('.cy-hud');
    if (!hud) return;
    const C = window.LGCity, has = !!(C && C.hasB && C.hasB('guild')), btn = hud.querySelector('.gh-entry');
    if (has) { if (btn) btn.remove(); return; }
    if (btn) return;
    index().then((r) => {
      if (!r || !r.ok || OPEN || hud.querySelector('.gh-entry') || !hud.isConnected || (C && C.hasB && C.hasB('guild'))) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'gh-entry'; b.title = 'Здание гильдии: зал своей гильдии';
      b.innerHTML = '<span aria-hidden="true">🏰</span><b>Здание гильдии</b>';
      b.onclick = (e) => { e.stopPropagation(); enter(); };
      hud.appendChild(b);
    });
  }
  setInterval(entryTick, 1500);

   
  function modal(cls, html) {
    const w = document.createElement('div');
    w.className = 'gh-modal ' + cls;
    w.innerHTML = `<div class="gh-win" role="dialog" aria-modal="true"><button type="button" class="gh-x" aria-label="Закрыть">×</button><div class="gh-body">${html}</div></div>`;
    ((S && S.root) || document.fullscreenElement || document.body).appendChild(w);
    const close = () => { w.remove(); document.removeEventListener('keydown', onKey, true); };
    const onKey = (e) => { if (e.key === 'Escape' && w.isConnected && w === lastModal()) { e.stopPropagation(); close(); } };
    document.addEventListener('keydown', onKey, true);
    w.querySelector('.gh-x').onclick = close;
    w.addEventListener('pointerdown', (e) => { if (e.target === w) close(); });
    return { el: w, body: w.querySelector('.gh-body'), close };
  }
  const lastModal = () => { const l = document.querySelectorAll('.gh-modal'); return l[l.length - 1] || null; };
  function toast(t, bad) {
    const host = (S && S.root) || document.body, e = document.createElement('div');
    e.className = 'gh-toast' + (bad ? ' bad' : ''); e.textContent = t; host.appendChild(e);
    setTimeout(() => e.classList.add('on'), 10); setTimeout(() => { e.classList.remove('on'); setTimeout(() => e.remove(), 300); }, 2600);
  }

   
  let OPEN = false, S = null;
  async function open(r) {
    if (OPEN) return; OPEN = true;
    const root = document.createElement('div');
    root.className = 'gh-root';
    root.innerHTML = `<div class="gh-view"></div><div class="gh-labs" aria-hidden="true"></div>
      <div class="gh-hud"><button type="button" class="gh-back" title="Выйти на улицу">← <span>На улицу</span></button><div class="gh-title"><b></b><small></small></div><span class="gh-on" aria-live="polite"></span></div>
      <div class="gh-zoom"><button type="button" class="gh-zin" aria-label="Ближе">+</button><button type="button" class="gh-zout" aria-label="Дальше">−</button><button type="button" class="gh-zme" aria-label="К герою">◎</button></div>
      <div class="gh-tip"></div><div class="gh-hint"></div><p class="gh-load">Вхожу в здание гильдии…</p>`;
    (document.fullscreenElement || document.body).appendChild(root);
    document.documentElement.classList.add('gh-full');
    try { if (window.LGCity && window.LGCity.sleep) window.LGCity.sleep(); } catch (e) { console.warn('[здание гильдии] город не уснул', e); }
    S = { root, data: r, view: root.querySelector('.gh-view'), labs: root.querySelector('.gh-labs'), z: innerWidth < 700 ? 0.45 : 0.7, x: 0, y: 0, free: 0, raf: 0, last: 0, keys: new Set(), others: new Map(), kw: false, timers: [], t0: performance.now() };
    root.querySelector('.gh-back').onclick = () => close();
    try {
      await deps();
      if (!S || S.root !== root) return;
      build();
    } catch (e) { console.warn('[здание гильдии]', e); if (S && S.root === root) root.querySelector('.gh-load').textContent = 'Здание не открылось - попробуй ещё раз'; }
  }
   
  const styleNow = () => { try { const E = window.LGEmblems; if (E && E.style) return E.style(); const D = window.MDDoodle; return (D && D.active) || (Array.isArray(window.LG_STYLES) && window.LG_STYLES[0]) || 'legion'; } catch { return 'legion'; } };
  const emblemSvg = (id) => { const E = window.LGEmblems; try { return E && E.svg && id ? E.svg(id, 64, '', E.style ? E.style() : undefined) : ''; } catch (e) { console.warn('[здание гильдии] герб', e); return ''; } };
   
  function build() {
    const r = S.data, K = window.LGTownKitMap, g = r.guild;
    const M = K.make(L.spec(r.tier)), R = ART.draw({ tier: r.tier, color: ART.colorOf(g.id), emblem: emblemSvg(g.emblem), style: styleNow() });
    S.M = M; S.W = L.W; S.H = L.H; S.R = R;
    const p = M.nearest(L.SPAWN[0], L.SPAWN[1]); S.hero = { x: p[0], y: p[1], face: 1, mine: true, path: null, lift: 150 };
    S.root.querySelector('.gh-title b').textContent = `Здание гильдии «${g.name}»`;
    S.root.querySelector('.gh-title small').textContent = `${g.tag ? `[${g.tag}] · ` : ''}ур. ${g.level} · участников: ${g.count}`;
    centerOn(S.hero.x, S.hero.y - 300);
    const G = window.LGCityGL.create({ host: S.view, labelHost: S.view, W: L.W, H: L.H, top: 0, sky: R.sky, layers: R.layers, props: R.props, mode: 'auto', V: window.LG_CITYV,
      onDirty: kick, onFail: (why) => { console.warn('[здание гильдии] Pixi', why); const l = S && S.root.querySelector('.gh-load'); if (l) { l.hidden = false; l.textContent = 'Не получилось нарисовать здание на этом устройстве'; } } });
    S.G = G; S.ol = window.LGCityGL.outliner ? window.LGCityGL.outliner([...R.layers, ...R.props].map((l) => ({ svg: l.svg, dx: 0 }))) : null;
    G.ready.then(() => {
      if (!S || S.G !== G) return;
      S.root.querySelector('.gh-load').hidden = true;
      const D2 = window.MDDoodle, login = String(r.you || 'я');
      const svg = D2 ? D2.jDoodle(D2.jhash(login), 'happy', false, {}, null) : '<svg viewBox="0 0 120 170"></svg>';
      G.add(S.hero, svg, { name: login, lv: 0, mine: true }); G.place(S.hero, K.SCALE);
      S.root.dataset.ready = '1'; S.readyMs = Math.round(performance.now() - S.t0);
      syncOthers(r.online || []);
      kick();
    });
    labels(); bindInput(); presence(true);
  }
  function close() {
    if (!S) { OPEN = false; return; }
    const s = S; S = null; OPEN = false;
    for (const t of s.timers) clearInterval(t);
    if (s.raf) cancelAnimationFrame(s.raf); clearTimeout(s.wait);
    if (s.unbind) s.unbind();
    void apiAct({ op: 'leave' });
    try { if (s.G) s.G.destroy(); } catch {}
    s.root.remove();
    document.documentElement.classList.remove('gh-full');
    try { if (window.LGCity && window.LGCity.wake) window.LGCity.wake(); } catch (e) { console.warn('[здание гильдии] город не проснулся', e); }
  }

   
  const zMin = () => (S ? Math.max(innerWidth / S.W, innerHeight / S.H) : 0.3), zMax = 1.6;
  function clampCam() { const vw = innerWidth / S.z, vh = innerHeight / S.z; S.x = Math.max(0, Math.min(S.W - vw, S.x)); S.y = Math.max(0, Math.min(S.H - vh, S.y)); }
  function centerOn(x, y) { S.z = Math.max(zMin(), Math.min(zMax, S.z)); S.x = x - innerWidth / S.z / 2; S.y = y - innerHeight / S.z / 2 - 30 / S.z; clampCam(); }
  function kick() { if (S && !S.raf && !S.wait) S.raf = requestAnimationFrame(frame); }
  function frame(t) {
    if (!S) return;
    S.raf = 0; const G = S.G; if (!G) return;
    if (document.hidden) { S.last = 0; return; }
    const cap = G.mode === 'webgl' ? 60 : 30, BG = window.LGSiteUi && window.LGSiteUi.bg, gap = BG ? BG.gap(1000 / cap) : 1000 / cap;
    const slow = gap >= 60, tol = slow ? 17 : 2;
    if (S.last && t - S.last < gap - tol) {
      const w = gap - tol - (t - S.last), S0 = S;
      if (slow && w > 20) { later(S0, w); return; }
      S.raf = requestAnimationFrame(frame); return;
    }
    const dt = Math.min(0.25, S.last ? (t - S.last) / 1000 : 0.016); S.last = t;
    let more = false;
    if (walk(S.hero, dt)) more = true;
    if (!S) return;
    if (keyMove(dt)) more = true;
    for (const w of S.others.values()) if (walk(w, dt)) more = true;
    if (performance.now() > S.free) {
      const vw = innerWidth / S.z, vh = innerHeight / S.z, tx = S.hero.x - vw / 2, ty = S.hero.y - vh / 2 - 30 / S.z, ox = S.x, oy = S.y;
      S.x += (tx - S.x) * Math.min(1, dt * 5); S.y += (ty - S.y) * Math.min(1, dt * 5); clampCam();
      if (Math.abs(S.x - ox) > 0.3 || Math.abs(S.y - oy) > 0.3) more = true;
    }
    G.view(Math.round(S.x * S.z) / S.z, Math.round(S.y * S.z) / S.z, S.z, innerWidth, innerHeight);
    if (G.render(t)) more = true;
    placeLabels(); nearTick();
    if (more) { if (slow) later(S, gap - tol); else S.raf = requestAnimationFrame(frame); } else S.last = 0;
  }
  if (window.LGSiteUi && window.LGSiteUi.bg) window.LGSiteUi.bg.on((st) => { if (st === 'on' && S && S.wait) { clearTimeout(S.wait); S.wait = 0; kick(); } });
  function later(S0, w) { clearTimeout(S0.wait); S0.wait = setTimeout(() => { if (S !== S0 || !S.wait) return; S.wait = 0; if (!S.raf) S.raf = requestAnimationFrame(frame); }, Math.max(0, w)); }
  function walk(w, dt) {
    if (!w.path) { if (w.mv) { w.mv = false; S.G.moving(w, false); } return false; }
    w.mv = true;
    const K = window.LGTownKitMap, r = K.stepAlong({ x: w.x, y: w.y, path: w.path }, dt);
    if (r.dx) w.face = r.dx < 0 ? -1 : 1;
    w.x = r.x; w.y = r.y; w.path = r.path;
    S.G.place(w, K.SCALE); S.G.moving(w, !!w.path);
    if (!w.path) { S.G.moving(w, false); if (w.arrive) { const f = w.arrive; w.arrive = null; f(); } }
    return true;
  }
  const scenePt = (cx, cy) => [S.x + cx / S.z, S.y + cy / S.z];
  function goTo(x, y, then) {
    const p = S.M.path([S.hero.x, S.hero.y], [x, y]);
    S.hero.path = p.length > 1 ? p.slice(1) : null; S.hero.arrive = then || null;
    const e = p[p.length - 1]; if (S.G && S.hero.path && S.G.ripple) S.G.ripple(e[0], e[1]);
    if (!S.hero.path && then) then();
    S.free = 0; S.kw = false; kick();
  }
  function zoomAt(cx, cy, k) { const [wx, wy] = scenePt(cx, cy); S.z = Math.max(zMin(), Math.min(zMax, S.z * k)); S.x = wx - cx / S.z; S.y = wy - cy / S.z; clampCam(); S.free = performance.now() + 4000; labels(); kick(); }

   
  function objAt(x, y) {
    let best = null;
    for (const o of L.OBJ) { const v = o.vis; if (x >= v[0] && x <= v[2] && y >= v[1] && y <= v[3] && (!best || v[3] > best.vis[3])) best = o; }
    return best;
  }
  function nearObj() {
    let best = null, bd = NEAR;
    for (const o of L.OBJ) { const d = Math.hypot(S.hero.x - o.door.x, S.hero.y - o.door.y); if (d < bd) { bd = d; best = o; } }
    return best;
  }
  function outline(id) {
    if (id === S.olId) return;
    S.olId = id;
    if (!id || !S.ol) { if (S.G) S.G.outline(null); return; }
    S.ol.bake(id, Math.min(2.5, S.z * (S.G.res ? S.G.res() : 1)), S.z).then((o) => { if (S && S.olId === id && o) S.G.outline(o); }).catch(() => {});
  }

  function nearTick() {
    const h = S.root.querySelector('.gh-hint'), b = nearObj();
    S.near = b ? b.id : null;
    if (!S.hov) outline(b ? b.id : null);
    if (!b || !S.kbd) { h.classList.remove('on'); return; }
    h.innerHTML = `<kbd>E</kbd> - ${esc(b.title)}`;
    h.style.left = (b.door.x - S.x) * S.z + 'px'; h.style.top = (b.door.y + 24 - S.y) * S.z + 'px'; h.classList.add('on');
  }
  function goObj(o) {
    goTo(o.door.x, o.door.y, () => { if (S && Math.hypot(S.hero.x - o.door.x, S.hero.y - o.door.y) < NEAR) act(o); });
  }

   
  const busyOver = () => !!document.querySelector('.gh-modal, .gl-modal, .gr, dialog[open]');
  function bindInput() {
    const view = S.view, tip = S.root.querySelector('.gh-tip');
    let down = null, pinch = null, hovT = 0;
    const pts = new Map();
    const hover = (cx, cy, ms) => {
      if (!S || !S.G) return;
      const [x, y] = scenePt(cx, cy), o = objAt(x, y);
      if (o) { tip.innerHTML = `<b>${esc(o.title)}</b><small>${esc(o.sub)}</small>`; tip.style.left = cx + 'px'; tip.style.top = cy + 'px'; tip.classList.add('on'); view.style.cursor = 'pointer'; } else { tip.classList.remove('on'); view.style.cursor = 'default'; }
      S.hov = o ? o.id : null; outline(o ? o.id : S.near);
      clearTimeout(hovT); if (ms) hovT = setTimeout(() => { tip.classList.remove('on'); if (S) { S.hov = null; outline(S.near); } }, ms);
    };
    const pd = (e) => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: S.z }; down = null; return; }
      down = { x: e.clientX, y: e.clientY, cx: S.x, cy: S.y, id: e.pointerId, moved: false }; try { view.setPointerCapture(e.pointerId); } catch {}
    };
    const pm = (e) => {
      if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch.d > 10) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, (pinch.z * d / pinch.d) / S.z); return; }
      if (down && down.id === e.pointerId) {
        const dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (Math.hypot(dx, dy) > 8) down.moved = true;
        if (down.moved) { S.x = down.cx - dx / S.z; S.y = down.cy - dy / S.z; clampCam(); S.free = performance.now() + 4000; kick(); }
        return;
      }
      if (e.pointerType === 'mouse') hover(e.clientX, e.clientY);
    };
    const pu = (e) => {
      pts.delete(e.pointerId);
      if (pinch) { if (pts.size < 2) pinch = null; down = null; return; }
      if (!down || down.id !== e.pointerId) return;
      const moved = down.moved; down = null; if (moved || !S.G) return;
      const [x, y] = scenePt(e.clientX, e.clientY), o = objAt(x, y);
      if (o) { goObj(o); if (e.pointerType !== 'mouse') hover(e.clientX, e.clientY, 1300); } else goTo(x, y);
    };
    const wh = (e) => { e.preventDefault(); zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015)); };
    const typing = () => { const a = document.activeElement; return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable); };
    const MOVE = ['w', 'a', 's', 'd', 'ц', 'ф', 'ы', 'в', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
    const kd = (e) => {
      if (!S || typing() || busyOver()) return;
      const k = e.key.toLowerCase();
      if (MOVE.includes(k)) { S.keys.add(k); S.hero.path = null; e.preventDefault(); S.free = 0; S.kw = true; S.kbd = true; kick(); }
      if (k === 'e' || k === 'у') { const b = nearObj(); if (b) act(b); }
      if (k === 'escape') close();
    };
    const ku = (e) => { if (S) { S.keys.delete(e.key.toLowerCase()); kick(); } };
    const rs = () => { if (S) { clampCam(); labels(); kick(); } };
    const vis = () => { if (!S) return; if (document.hidden) void apiAct({ op: 'leave' }); else { presence(); kick(); } };
    view.addEventListener('pointerdown', pd); view.addEventListener('pointermove', pm); view.addEventListener('pointerup', pu); view.addEventListener('pointercancel', pu);
    view.addEventListener('pointerleave', () => { if (S) { tip.classList.remove('on'); S.hov = null; outline(S.near); } });
    view.addEventListener('wheel', wh, { passive: false });
    addEventListener('keydown', kd); addEventListener('keyup', ku); addEventListener('resize', rs); document.addEventListener('visibilitychange', vis);
    S.root.querySelector('.gh-zin').onclick = () => zoomAt(innerWidth / 2, innerHeight / 2, 1.25);
    S.root.querySelector('.gh-zout').onclick = () => zoomAt(innerWidth / 2, innerHeight / 2, 0.8);
    S.root.querySelector('.gh-zme').onclick = () => { if (S.z < 0.5) S.z = 0.8; S.free = 0; labels(); kick(); };
    S.unbind = () => { removeEventListener('keydown', kd); removeEventListener('keyup', ku); removeEventListener('resize', rs); document.removeEventListener('visibilitychange', vis); };
  }
  function keyMove(dt) {
    if (!S.keys.size || !S.G) return false;
    if (busyOver()) { S.keys.clear(); return false; }
    let dx = 0, dy = 0;
    for (const k of S.keys) { if (k === 'w' || k === 'ц' || k === 'arrowup') dy -= 1; if (k === 's' || k === 'ы' || k === 'arrowdown') dy += 1; if (k === 'a' || k === 'ф' || k === 'arrowleft') dx -= 1; if (k === 'd' || k === 'в' || k === 'arrowright') dx += 1; }
    const len = Math.hypot(dx, dy); if (!len) return false;
    const K = window.LGTownKitMap, s = K.SPEED * dt; dx = dx / len * s; dy = dy / len * s;
    const a = [S.hero.x, S.hero.y];
    for (const [mx, my] of [[dx, dy], [dx, 0], [0, dy]]) { if (!mx && !my) continue; const b = [S.hero.x + mx, S.hero.y + my]; if (S.M.clear(a, b)) { S.hero.x = b[0]; S.hero.y = b[1]; if (mx) S.hero.face = mx < 0 ? -1 : 1; break; } }
    S.G.place(S.hero, K.SCALE); S.G.moving(S.hero, true);
    return true;
  }

   
  function labels() {
    if (!S) return;
    S.labs.innerHTML = L.OBJ.filter((o) => o.id !== 'door').map((o) => `<span class="gh-lab" data-o="${o.id}" style="left:${Math.round((o.vis[0] + o.vis[2]) / 2 * S.z)}px;top:${Math.round((o.foot ? o.vis[3] + 8 : o.vis[3] + 4) * S.z)}px">${esc(o.title)}</span>`).join('');
    S.labs.classList.toggle('tiny', S.z < 0.5);
    S.labZ = S.z; placeLabels(true);
  }
  function placeLabels(force) {
    if (!S || !S.labs) return;
    if (S.labZ !== S.z) { labels(); return; }
    const t = `translate(${Math.round(-S.x * S.z)}px,${Math.round(-S.y * S.z)}px)`;
    if (force || S.labT !== t) { S.labs.style.transform = t; S.labT = t; }
  }

   
  function presence(first) {
    if (!S) return;
    if (first) S.timers.push(setInterval(() => presence(), PRES_MS));
    if (document.hidden || !S.G) return;
    const s0 = S;
    apiAct({ op: 'here', x: Math.round(S.hero.x), y: Math.round(S.hero.y) }).then((r) => {
      if (!S || S !== s0) return;
      if (!r || !r.ok) { if (r && r.noGuild) { toast('Ты больше не в этой гильдии', true); close(); return; } if (r && r.error && !S.presErr) { S.presErr = 1; toast(r.error, true); } return; }
      S.presErr = 0;
      syncOthers(r.online || []);
    });
  }
  function syncOthers(list) {
    if (!S || !S.G || !S.root.dataset.ready) return;
    const K = window.LGTownKitMap, D2 = window.MDDoodle, seen = new Set();
    let i = 0;
    for (const p of list.slice(0, 100)) {
      const l = String(p.l || ''); if (!l) continue;
      seen.add(l);
      const at = p.x == null || p.y == null ? L.hallSpot(i++) : [+p.x, +p.y], to = S.M.nearest(at[0], at[1]);
      let w = S.others.get(l);
      if (!w) {
        w = { l, x: to[0], y: to[1], face: 1, path: null, lift: 150 };
        S.G.add(w, D2 ? D2.jDoodle(D2.jhash(l), 'happy', false, {}, null) : '<svg viewBox="0 0 120 170"></svg>', { name: l, lv: 0 });
        S.G.place(w, K.SCALE); S.others.set(l, w);
      } else if (Math.hypot(w.x - to[0], w.y - to[1]) > 6) {
        const pa = S.M.path([w.x, w.y], to); w.path = pa.length > 1 ? pa.slice(1) : null;
      }
    }
    for (const [l, w] of S.others) if (!seen.has(l)) { S.G.remove(w); S.others.delete(l); }
    S.root.querySelector('.gh-on').textContent = `в здании: ${S.others.size + 1}`;
    kick();
  }

   
  const money = (n) => `${Math.round(+n || 0).toLocaleString('ru-RU')} бронзы`;
  const cityName = (id) => { try { const T = window.LGCity && window.LGCity.towns ? window.LGCity.towns() : null, list = (T && (T.list || T)) || [], t = Array.isArray(list) ? list.find((x) => x && x.id === id) : null; return (t && t.town) || id; } catch { return id; } };
   
  async function guildWin(tab) {
    const G = window.LGGuilds;
    if (!G || !G.open) { toast('Окно гильдии не загрузилось', true); return; }
    try {
      await G.open(tab === 'war' || tab === 'run' ? { view: tab } : {});
      if (tab && tab !== 'main' && tab !== 'war' && tab !== 'run') { const b = document.querySelector(`.gl-modal .gl-tabs [data-tab="${tab}"]`); if (b) b.click(); }
    } catch (e) { console.warn('[здание гильдии] окно гильдии', e); }
  }
  function win(o, html, btns) {
    const box = modal('gh-obj gh-o-' + o.id, `<h2>${esc(o.title)}</h2>${html}${btns && btns.length ? `<div class="gh-btns">${btns.map((b, i) => `<button type="button" class="gh-btn${b.ghost ? ' ghost' : ''}" data-i="${i}">${esc(b.t)}</button>`).join('')}</div>` : ''}`);
    box.body.querySelectorAll('[data-i]').forEach((x) => { x.onclick = () => { const b = btns[+x.dataset.i]; if (b.keep !== true) box.close(); b.go(); }; });
    return box;
  }
  const ACT = {
    desk: (o) => win(o, '<p>Книга состава гильдии и журнал: кто вступил, кто ушёл, что было за день.</p>', [{ t: 'Состав гильдии', go: () => guildWin('mem') }, { t: 'Журнал гильдии', go: () => guildWin('log') }]),
    chest: async (o) => {
      const D = window.LGDailies, gift = !!(D && D.giftOn && D.giftOn()), n = gift && D.giftCount ? D.giftCount() : 0;
      const box = win(o, '<p class="gh-note">Считаю казну…</p>', gift ? [{ t: n ? `Подарок (${n})` : 'Подарок', go: () => D.gift() }] : []);
      const r = await apiAct({ op: 'info' });
      const p = box.body.querySelector('.gh-note'); if (!p || !p.isConnected) return;
      if (!r || !r.ok) { p.textContent = (r && r.error) || 'не вышло'; return; }
      const cities = r.cities.length ? `<ul class="gh-list">${r.cities.map((c) => `<li>${esc(cityName(c.id))}: <b>${esc(money(c.tre))}</b></li>`).join('')}</ul>` : '';
      p.outerHTML = `<p>Казна городов гильдии: <b>${esc(money(r.treasury))}</b>.</p>${cities || '<p class="gh-note">У гильдии нет городов в управлении - казна появится вместе с городом.</p>'}`
        + (gift ? `<p class="gh-note">«Подарок» - сундуки за задания дня всей гильдии${n ? `: ждёт ${n}` : ''}.</p>` : '<p class="gh-note">«Подарок» гильдии откроется вместе с заданиями дня.</p>');
    },
    board: (o) => {
      const D = window.LGDailies, b = [];
      if (D && D.open) b.push({ t: 'Задания гильдии дня', go: () => D.open() });
      b.push({ t: 'Задания наёмников', go: () => guildWin('war') });
      win(o, '<p>Задания дня для всей гильдии и задания наёмников - мини-сражения гильдий.</p>', b);
    },
    trophy: async (o) => {
      const box = win(o, '<p class="gh-note">Смотрю трофеи…</p>', [{ t: 'Окно гильдии', ghost: true, go: () => guildWin('main') }]);
      const r = await apiAct({ op: 'info' });
      const p = box.body.querySelector('.gh-note'); if (!p || !p.isConnected) return;
      if (!r || !r.ok) { p.textContent = (r && r.error) || 'не вышло'; return; }
      const g = r.guild, w = r.war;
      const res = (x) => (x.status === 'failed' ? 'сорвано' : x.outcome === 'win' ? 'победа' : x.outcome ? 'поражение' : 'ждёт боя');
      p.outerHTML = `<div class="gh-stats"><div><b>${g.level}</b><small>уровень</small></div><div><b>${g.xp.toLocaleString('ru-RU')}</b><small>опыт</small></div><div><b>${w ? w.wins : '-'}</b><small>победы</small></div><div><b>${g.count}</b><small>участников</small></div></div>`
        + (w ? `${w.losses || w.failed ? `<p class="gh-note">Поражений: ${w.losses}${w.failed ? `, сорвано: ${w.failed}` : ''}.</p>` : ''}${w.last.length ? `<h3>Последние мини-сражения</h3><ul class="gh-list">${w.last.map((x) => `<li>${esc(x.title)}${x.name ? `: ${esc(x.name)}` : ''} - ${res(x)}${x.gxp ? ` · опыт +${x.gxp}` : ''}</li>`).join('')}</ul>` : '<p class="gh-note">Мини-сражений ещё не было.</p>'}` : '<p class="gh-note">Мини-сражения гильдий пока закрыты.</p>')
        + (r.next ? `<p class="gh-note">С уровнем ${r.tier + 1} в зале прибавится: ${esc(r.next.join(', '))}.</p>` : '<p class="gh-note">Зал убран по высшему разряду.</p>');
    },
    guild: (o) => {
      const g = S.data.guild, e = emblemSvg(g.emblem);
      win(o, `<div class="gh-crest">${e ? `<span class="gh-emb">${e}</span>` : ''}<p><b>${esc(g.name)}</b>${g.tag ? ` [${esc(g.tag)}]` : ''}<br><small>ур. ${g.level} · участников: ${g.count} из ${g.limit}</small></p></div>`, [{ t: 'Окно гильдии', go: () => guildWin('main') }]);
    },
    throne: (o) => { const d = S.data; win(o, `<p>${d.leader ? `Здесь сидит глава гильдии - <b>${esc(d.leader)}</b>.` : 'Трон пустует.'}${d.role === 'leader' ? ' Это твой трон.' : ''}</p>`, [{ t: 'Окно гильдии', go: () => guildWin('main') }]); },
    table: (o) => {
      const d = S.data, lead = (d.lead || []).length ? `<ul class="gh-list">${d.lead.map((n) => `<li>${esc(n)} <small>руководство</small></li>`).join('')}</ul>` : '<p class="gh-note">Руководства, кроме главы, пока нет.</p>';
      win(o, `<p>За этим столом собирается руководство гильдии${d.leader ? `: глава - <b>${esc(d.leader)}</b>` : ''}.</p>${lead}`, [{ t: 'Управление гильдией', go: () => guildWin('set') }]);
    },
    fire: (o) => {
      const names = [String(S.data.you || 'я'), ...S.others.keys()];
      win(o, `<p>У камина греются после вылазок. Сейчас в здании: <b>${names.length}</b>.</p><ul class="gh-list">${names.slice(0, 30).map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`, []);
    },
    map: (o) => {
      const b = document.querySelector('.tabs button[data-tab="world"]');
      const ok = !!(b && !b.hidden && b.offsetParent !== null);
      win(o, '<p>Карта мира: округа, города и где сейчас отряд канала.</p>', ok ? [{ t: 'Открыть карту мира', go: () => { close(); b.click(); } }] : []);
      if (!ok) { const box = lastModal(); if (box) box.querySelector('.gh-body').insertAdjacentHTML('beforeend', '<p class="gh-note">Вкладка «Карта» сейчас недоступна.</p>'); }
    },
    exit: () => close(),
  };
  function act(o) { const f = ACT[o.act]; if (f) f(o); }

  window.LGGuildHall = {
    on, enter, close, index,
     
    open: () => enter(),
    debug: () => S && { ready: !!S.root.dataset.ready, ms: S.readyMs || null, guild: S.data.guild.id, tier: S.data.tier, style: S.R ? S.R.style : null, hero: S.hero ? [Math.round(S.hero.x), Math.round(S.hero.y)] : null, others: [...S.others.keys()], z: S.z, near: S.near || null, ol: S.olId || null, modal: (lastModal() || {}).className || null, cam: [Math.round(S.x), Math.round(S.y)], mode: S.G ? S.G.mode : null },
     
    obj: (id) => { if (!S) return false; const o = L.OBJ.find((x) => x.id === id); if (!o) return false; goObj(o); return true; },
    act: (id) => { if (!S) return false; const o = L.OBJ.find((x) => x.id === id); if (!o) return false; act(o); return true; },
    screen: (x, y) => (S ? [(x - S.x) * S.z, (y - S.y) * S.z] : null),
    cam: (x, y, z) => { if (!S) return; if (z) S.z = z; S.x = x; S.y = y; clampCam(); S.free = performance.now() + 60e3; labels(); kick(); },
    place: (x, y) => { if (!S) return; const p = S.M.nearest(x, y); S.hero.x = p[0]; S.hero.y = p[1]; S.hero.path = null; if (S.G) S.G.place(S.hero, window.LGTownKitMap.SCALE); S.free = 0; kick(); },
    stats: () => (S && S.G ? S.G.stats() : null), busy: () => !!(S && S.G && S.G.busy && S.G.busy()),
  };
})();
