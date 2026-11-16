















(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LGGuildIcons = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const hx = (c) => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
   
  const tone = (c, k) => '#' + hx(c).map((v) => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))).toString(16).padStart(2, '0')).join('');
  const NAMES = ['war', 'gather', 'gift', 'hall', 'log', 'tasks'];
  const W = 4.5;

   
  const ST = {
    legion: { ink: '#1d1520', plate: '#f3e2b3', edge: '#b8893a', shape: 'medal', metal: '#d8dde6', gold: '#e0b245', wood: '#8a5a33', paper: '#f6e7c1', a: '#c9952e', b: '#8c1f2b', c: '#2f4a8a', l: '#fff3d6' },
    cats: { ink: '#4a2f22', plate: '#fff1e0', edge: '#e88aa0', shape: 'cat', metal: '#8fd3e8', gold: '#f4c542', wood: '#d9a066', paper: '#fffaf2', a: '#ff8fa3', b: '#f2a64a', c: '#7d9cd6', l: '#fffaf2' },
    monkeys: { ink: '#2a1a0e', plate: '#c08a4e', edge: '#6b4423', shape: 'log', metal: '#8a8a92', gold: '#ffd23f', wood: '#8a5a33', paper: '#f2e2b0', a: '#ffd23f', b: '#e0302a', c: '#4f8a3a', l: '#fff0c8' },
    veggies: { ink: '#2f3a1e', plate: '#fff6dc', edge: '#6fae4a', shape: 'label', metal: '#c9ced8', gold: '#f4c542', wood: '#c8925a', paper: '#fffbea', a: '#ff7a2f', b: '#e5383b', c: '#5aa83a', l: '#fffbea' },
    '42brothers': { ink: '#2a1030', plate: '#3a1f4a', edge: '#f4c542', shape: 'octa', metal: '#d8dde6', gold: '#f4c542', wood: '#7a3fd0', paper: '#fff4fb', a: '#f4c542', b: '#ff4fa3', c: '#7a3fd0', l: '#fff4fb' },
    cherts: { ink: '#160a0a', plate: '#5c3c34', edge: '#ff6a2a', shape: 'stone', metal: '#6e6e7c', gold: '#ffc23d', wood: '#6b2a2a', paper: '#e8d2b0', a: '#ff6a2a', b: '#d81e1e', c: '#ffc23d', l: '#ffd9b8' },
    ugabugi: { ink: '#24201a', plate: '#b9b1a3', edge: '#6d5f4c', shape: 'pixel', metal: '#8a8a92', gold: '#f2a63b', wood: '#8a5a33', paper: '#d9c29a', a: '#f2a63b', b: '#c8423a', c: '#6b4423', l: '#efe6d4' },
  };
  const STYLES = Object.keys(ST);

   
  function brush(K) {
    const O = (w) => `stroke="${K.ink}" stroke-width="${w == null ? W : w}" stroke-linejoin="round" stroke-linecap="round"`;
    return {
      O,
       
      p: (d, f, w) => `<path d="${d}" fill="${f}" ${O(w)}/>`,
       
      ln: (d, c, w, op) => `<path d="${d}" fill="none" stroke="${c || K.ink}" stroke-width="${w == null ? 2.6 : w}" stroke-linecap="round" stroke-linejoin="round"${op ? ` opacity="${op}"` : ''}/>`,
       
      hi: (d, op) => `<path d="${d}" fill="#fff" opacity="${op == null ? 0.5 : op}"/>`,
      sh: (d, op) => `<path d="${d}" fill="${K.ink}" opacity="${op == null ? 0.18 : op}"/>`,
      c: (x, y, r, f, w) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${O(w)}/>`,
      e: (x, y, rx, ry, f, w, rot) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${O(w)}${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}/>`,
      dot: (x, y, r, f, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${op ? ` opacity="${op}"` : ''}/>`,
       
      spark: (x, y, r, f) => `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z" fill="${f || '#fff'}" stroke="${K.ink}" stroke-width="2" stroke-linejoin="round"/>`,
       
      ground: (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${K.ink}" opacity=".2"/>`,
    };
  }

   
  const PLATE = {
    medal: (K, B) => B.c(64, 64, 52, K.plate, 3.5) + `<circle cx="64" cy="64" r="45" fill="none" stroke="${K.edge}" stroke-width="2.4" stroke-dasharray="1 5.2" stroke-linecap="round"/>`
      + B.hi('M24 46 Q34 22 60 16 Q36 26 28 48 Z', 0.55),
    cat: (K, B) => B.p('M22 34 L18 8 L42 20 Q64 12 86 20 L110 8 L106 34 Q118 50 116 70 Q112 112 64 116 Q16 112 12 70 Q10 50 22 34 Z', K.plate, 3.5)
      + `<path d="M24 16 L36 22 L27 30 Z M104 16 L92 22 L101 30 Z" fill="#ffb3c4"/>` + B.ln('M24 46 Q18 62 22 76', K.edge, 3, 0.8),
    log: (K, B) => B.c(64, 64, 52, K.plate, 4) + `<circle cx="64" cy="64" r="40" fill="none" stroke="${tone(K.plate, -0.25)}" stroke-width="2.2"/><circle cx="64" cy="64" r="27" fill="none" stroke="${tone(K.plate, -0.2)}" stroke-width="2"/>`
      + B.ln('M24 40 L34 46 M98 92 L106 96', '#4a2e14', 2.4) + B.dot(26, 72, 3, '#2a1a0e') + B.dot(102, 52, 3, '#2a1a0e'),
    label: (K, B) => { const n = 22, pts = []; for (let i = 0; i < n * 2; i++) { const a = (Math.PI * i) / n, r = i % 2 ? 49 : 54; pts.push(`${(64 + r * Math.cos(a)).toFixed(1)} ${(64 + r * Math.sin(a)).toFixed(1)}`); }
      return B.p(`M${pts.join(' L')} Z`, K.plate, 3.2) + `<circle cx="64" cy="64" r="42" fill="none" stroke="${K.edge}" stroke-width="2.4" stroke-dasharray="5 4"/>`; },
    octa: (K, B) => B.p('M42 8 L86 8 L120 42 L120 86 L86 120 L42 120 L8 86 L8 42 Z', K.edge, 3.5) + B.p('M45 16 L83 16 L112 45 L112 83 L83 112 L45 112 L16 83 L16 45 Z', K.plate, 2.4)
      + [[42, 12], [86, 12], [116, 42], [116, 86], [86, 116], [42, 116], [12, 86], [12, 42]].map(([x, y]) => B.dot(x, y, 2.4, '#fff')).join('')
      + B.hi('M24 48 L46 22 L60 22 L30 52 Z', 0.12),
    stone: (K, B) => `<path d="M16 20 L44 10 L64 16 L88 8 L114 20 L118 62 Q114 98 64 118 Q16 100 10 62 Z" fill="none" stroke="${K.edge}" stroke-width="9" stroke-linejoin="round" opacity=".55"/>` + B.p('M16 20 L44 10 L64 16 L88 8 L114 20 L118 62 Q114 98 64 118 Q16 100 10 62 Z', K.plate, 3.5)
      + B.ln('M20 34 L28 40 L24 48 M108 40 L100 46 L104 54 M30 96 L38 100', K.edge, 3) + B.sh('M64 118 Q100 102 112 70 Q104 98 64 112 Z', 0.3),
    pixel: (K, B) => B.p('M22 10 L106 10 L106 16 L116 16 L116 106 L110 106 L110 116 L18 116 L18 110 L10 110 L10 18 L22 18 Z', K.plate, 3.5)
      + B.ln('M22 30 L30 26 M94 40 L100 36 M26 92 L36 96 M88 100 L98 96', tone(K.plate, -0.35), 2.6) + B.ln('M16 22 L112 22', '#a07a4a', 4, 0.5),
  };

   
  function motif(st, K, B, x, y, s) {
    const g = (body) => `<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
    if (st === 'cats') return g(B.e(0, 4, 7, 6, K.l, 2.2) + [[-8, -4], [-3, -9], [3, -9], [8, -4]].map(([a, b]) => B.e(a, b, 2.8, 3.4, K.l, 2)).join(''));
    if (st === 'monkeys') return g(B.p('M-9 -6 Q-2 12 10 -2 Q11 2 9 5 Q-1 15 -10 -1 Z', '#ffd23f', 2.2) + B.p('M-9 -6 L-10 -9 L-7 -8 Z', '#6b4423', 1.6));
    if (st === 'veggies') return g(B.p('M-5 -4 Q0 -7 6 -3 Q4 5 -2 13 Q-3 14 -4 13 Q-7 4 -5 -4 Z', '#ff7a2f', 2) + B.p('M0 -5 Q-1 -12 3 -13 Q3 -9 4 -7 Q7 -11 10 -10 Q7 -8 5 -4', '#5aa83a', 1.8));
    if (st === '42brothers') return g(B.p('M-10 -3 L-6 -9 L6 -9 L10 -3 L0 11 Z', '#bfefff', 2.2) + B.ln('M-10 -3 L10 -3 M-6 -9 L-3 -3 L0 11 L3 -3 L6 -9', K.ink, 1.3));
    if (st === 'cherts') return g(B.p('M0 12 Q-11 9 -9 0 Q-8 -5 -4 -7 Q-4 -2 -1 -1 Q-3 -8 3 -13 Q3 -5 8 -2 Q11 3 8 8 Q5 12 0 12 Z', '#ff6a2a', 2) + B.p('M0 10 Q-5 7 -3 2 Q-1 4 1 3 Q1 -1 4 -3 Q5 2 6 5 Q5 9 0 10 Z', '#ffc23d', 0));
    if (st === 'ugabugi') return g(B.ln('M0 0 Q1.6 -1.2 1.6 0 Q1.6 3 -1.4 3 Q-4.6 3 -4.6 -0.6 Q-4.6 -5 0 -5 Q5.6 -5 5.6 0.6 Q5.6 7 -0.6 7 Q-8.4 7 -8.4 -0.6 Q-8.4 -9 0 -9 Q9 -9 9.4 0', '#c8423a', 2.6));
    return g(B.p('M0 -11 L3.2 -3.4 L11 -3.4 L4.8 1.6 L7 9.6 L0 5 L-7 9.6 L-4.8 1.6 L-11 -3.4 L-3.2 -3.4 Z', K.gold, 2));
  }

   

  const WEAPON = {
    legion: (K, B) => B.p('M-7 12 L-7 -44 L0 -58 L7 -44 L7 12 Z', K.metal) + B.ln('M0 -46 L0 8', tone(K.metal, -0.35), 2.4) + B.hi('M-4.6 -42 L-2.6 -46 L-2.6 8 L-4.6 8 Z', 0.8)
      + B.p('M-23 11 Q-25 18 -19 20 L19 20 Q25 18 23 11 Z', K.gold) + B.p('M-5 20 L5 20 L5 42 L-5 42 Z', '#7a4a2a') + B.ln('M-5 26 L5 29 M-5 32 L5 35 M-5 38 L5 41', '#3a2412', 2)
      + B.c(0, 47, 6.5, K.gold) + B.hi('M-3 44 Q-1 42 2 43 Q-1 44 -2 46 Z', 0.8),
    cats: (K, B) => B.p('M0 -60 Q12 -50 10 -30 Q9 -10 7 6 L-7 6 Q-9 -10 -10 -30 Q-12 -50 0 -60 Z', K.metal) + B.dot(-2, -48, 2.6, K.ink) + B.dot(-2.8, -48.8, 0.9, '#fff')
      + B.ln('M-5 -40 Q0 -37 5 -40 M-6 -30 Q0 -27 6 -30 M-6 -20 Q0 -17 6 -20 M-5 -10 Q0 -7 5 -10', tone(K.metal, -0.35), 2) + B.hi('M-7 -44 Q-8 -30 -6 -14 L-4 -14 Q-6 -30 -5 -44 Z', 0.7)
      + B.p('M-4 4 L-22 14 Q-22 23 -13 22 L0 14 L13 22 Q22 23 22 14 L4 4 Z', tone(K.metal, -0.15)) + B.ln('M-16 15 L-8 13 M16 15 L8 13', tone(K.metal, -0.45), 1.8)
      + B.p('M-5 18 L5 18 L5 40 L-5 40 Z', K.a) + B.ln('M-5 24 L5 24 M-5 30 L5 30 M-5 36 L5 36', '#fff', 2, 0.7) + B.c(0, 46, 7, K.c) + B.ln('M-6 43 Q0 47 6 43 M-5 49 Q0 45 5 49 M-2 40 Q2 46 -1 52', tone(K.c, -0.35), 1.6),
    monkeys: (K, B) => B.p('M-4 -32 L4 -32 L4.5 52 L-4.5 52 Z', '#c9b06a') + B.ln('M-4 -12 L4 -12 M-4 6 L4 6 M-4 24 L4 24 M-4 42 L4 42', '#7a5a2a', 2.2) + B.hi('M-2.4 -30 L-1 -30 L-1 50 L-2.4 50 Z', 0.6)
      + B.p('M0 -64 Q11 -48 6 -30 L-6 -30 Q-11 -48 0 -64 Z', K.metal) + B.ln('M0 -60 L0 -32 M0 -50 L-5 -42 M0 -44 L5 -36', tone(K.metal, -0.4), 1.8) + B.hi('M-2 -58 Q-7 -48 -4 -34 L-2 -34 Q-4 -46 -2 -58 Z', 0.55)
      + B.p('M-6 -32 L6 -32 L6 -21 L-6 -21 Z', '#e8c48a', 3) + B.ln('M-6 -29 L6 -26 M-6 -25 L6 -22', '#8a5a2a', 1.8)
      + B.p('M5 -23 Q18 -15 14 -1 Q9 -11 4 -16 Z', K.b, 3) + B.ln('M6 -19 Q12 -13 12 -5', tone(K.b, 0.4), 1.6),
    veggies: (K, B) => B.p('M0 -60 Q10 -28 10 8 L-10 8 Q-10 -28 0 -60 Z', K.a) + B.ln('M-7 -16 L-1 -15 M3 -30 L7 -29 M-6 -40 L-2 -39 M2 -4 L8 -3 M-3 -50 L0 -50', tone(K.a, -0.4), 2)
      + B.hi('M-3 -48 Q-7 -24 -6 2 L-3 2 Q-4 -24 -3 -48 Z', 0.55)
      + B.p('M0 8 Q-12 0 -24 8 Q-20 18 -8 16 Q-3 20 0 14 Q3 20 8 16 Q20 18 24 8 Q12 0 0 8 Z', K.c) + B.ln('M-18 10 L-6 12 M18 10 L6 12', tone(K.c, -0.35), 1.8)
      + B.p('M-5 16 L5 16 L5 40 L-5 40 Z', '#b5e07a') + B.ln('M-2 18 L-2 38 M2 18 L2 38', '#6fae4a', 1.6) + B.c(0, 46, 6.5, '#7cc25a') + B.hi('M-3 43 Q0 41 2 42 Q-1 44 -2 46 Z', 0.7),
    '42brothers': (K, B) => B.p('M-10 -52 Q0 -64 10 -52 L6.5 2 L3.6 36 L-3.6 36 L-6.5 2 Z', K.gold) + B.hi('M-6 -52 Q-2 -57 2 -57 Q-3 -50 -3.5 0 L-5 0 Z', 0.6)
      + B.ln('M-7 -20 L7 -20 M-6 -6 L6 -6', tone(K.gold, -0.35), 2) + [-44, -32].map((y) => B.dot(0, y, 2.2, '#fff') + `<circle cx="0" cy="${y}" r="2.2" fill="none" stroke="${K.b}" stroke-width="1.2"/>`).join('')
      + B.p('M-4.4 12 L4.4 12 L3.6 36 L-3.6 36 Z', K.b, 3) + B.ln('M-4 17 L4 20 M-4 23 L4 26 M-4 29 L4 32', tone(K.b, 0.45), 1.6) + B.c(0, 42, 6.5, K.gold) + B.dot(-2, 40, 1.6, '#fff'),
    cherts: (K, B) => B.p('M-3.6 -28 L3.6 -28 L3.6 52 L-3.6 52 Z', K.wood) + B.ln('M-3.6 -6 L3.6 -3 M-3.6 16 L3.6 19 M-3.6 38 L3.6 41', tone(K.wood, -0.5), 1.8)
      + B.p('M-19 -36 Q-19 -22 -8 -22 L8 -22 Q19 -22 19 -36 L13 -36 Q13 -28 7 -28 L-7 -28 Q-13 -28 -13 -36 Z', K.metal)
      + B.p('M-19 -36 L-19 -52 L-22 -52 L-16 -64 L-10 -52 L-13 -52 L-13 -36 Z', K.metal, 3.6) + B.p('M13 -36 L13 -52 L10 -52 L16 -64 L22 -52 L19 -52 L19 -36 Z', K.metal, 3.6)
      + B.p('M-3 -28 L-3 -56 L-7 -56 L0 -70 L7 -56 L3 -56 L3 -28 Z', K.metal, 3.6)
      + `<path d="M-19 -54 L-16 -62 L-13 -54 Z M13 -54 L16 -62 L19 -54 Z M-4 -58 L0 -67 L4 -58 Z" fill="${K.a}"/>` + B.hi('M-17.6 -50 L-16.6 -50 L-16.6 -38 L-17.6 -38 Z M-1.6 -54 L-0.6 -54 L-0.6 -30 L-1.6 -30 Z', 0.35),
    ugabugi: (K, B) => B.p('M-4 -46 L4 -46 L5.5 52 L-5.5 52 Z', K.wood) + B.ln('M-1 -40 Q1 -10 -1 20 M2 0 Q3 20 1 46', tone(K.wood, -0.4), 1.6)
      + B.p('M2 -50 Q24 -62 32 -44 Q34 -28 26 -24 Q14 -30 2 -28 Z', K.metal) + B.ln('M10 -48 L16 -40 L12 -32 M22 -54 L26 -44', tone(K.metal, -0.4), 1.8) + B.hi('M8 -50 Q20 -58 28 -48 Q20 -54 10 -46 Z', 0.5)
      + B.p('M-6 -44 L8 -32 L8 -26 L-6 -38 Z', '#a07a4a', 3) + B.p('M-6 -30 L8 -42 L8 -36 L-6 -24 Z', '#a07a4a', 3),
  };
  const SHIELD = {
    legion: (K, B) => B.p('M36 42 L92 42 L92 68 Q92 92 64 106 Q36 92 36 68 Z', K.gold) + B.p('M42 48 L86 48 L86 68 Q86 87 64 99 Q42 87 42 68 Z', K.c)
      + `<path d="M42.6 76 L64 62 L85.4 76 L85 84 L64 70 L43 84 Z" fill="${K.gold}" stroke="${K.ink}" stroke-width="2.6" stroke-linejoin="round"/>`
      + B.p('M58 52 L70 52 L70 58 L58 58 Z', K.b, 2.4) + [48, 64, 80].map((x) => B.dot(x, 44.8, 1.8, '#fff3d6')).join('')
      + B.hi('M45 51 L54 51 L50 80 Q46 76 45 68 Z', 0.3) + B.sh('M64 99 Q86 87 86 68 L86 76 Q84 92 64 101 Z', 0.2),
    cats: (K, B) => B.c(64, 72, 31, K.wood) + B.c(64, 72, 24, tone(K.wood, 0.45), 3) + [[64, 43.5], [92.5, 72], [64, 100.5], [35.5, 72]].map(([x, y]) => B.c(x, y, 2.8, '#c9ced8', 2)).join('')
      + B.e(64, 79, 10, 8.5, K.a, 3.2) + [[50, 68], [57, 61], [71, 61], [78, 68]].map(([x, y]) => B.e(x, y, 4.4, 5.4, K.a, 3)).join('')
      + B.e(64, 80, 5.5, 3.6, '#ffb3c4', 0) + B.hi('M42 62 Q46 50 58 46 Q48 54 46 64 Z', 0.55),
    monkeys: (K, B) => B.e(64, 72, 26, 33, '#b5753a') + B.ln('M44 52 Q64 60 84 52 M42 92 Q64 84 86 92', tone('#b5753a', -0.35), 2)
      + `<path d="M44 60 L84 60 L82 66 L46 66 Z" fill="${K.b}"/><path d="M46 84 L82 84 L80 89 L48 89 Z" fill="${K.a}"/>`
      + B.p('M48 67 L60 72 L50 76 Z', '#fff0c8', 2.6) + B.p('M80 67 L68 72 L78 76 Z', '#fff0c8', 2.6) + B.dot(54, 72, 2, K.ink) + B.dot(74, 72, 2, K.ink)
      + B.p('M54 80 L74 80 L71 88 L57 88 Z', '#fff', 2.4) + B.ln('M59 80 L59 88 M64 80 L64 88 M69 80 L69 88', K.ink, 1.4)
      + B.ln('M44 58 L58 64 M84 58 L70 64', K.ink, 3.4) + B.hi('M44 60 Q46 46 58 41 Q49 50 48 62 Z', 0.4),
    veggies: (K, B) => B.p('M32 76 Q28 54 46 46 Q38 58 40 70 Z', '#9ad070') + B.p('M96 76 Q100 54 82 46 Q90 58 88 70 Z', '#9ad070') + B.c(64, 74, 28, '#7cc25a')
      + B.ln('M64 47 Q52 64 64 101 M64 47 Q76 64 64 101 M38 66 Q50 72 64 72 Q78 72 90 66', tone('#7cc25a', -0.35), 2.2)
      + B.ln('M44 86 Q38 76 42 66 M84 86 Q90 76 86 66', tone('#7cc25a', 0.35), 3) + B.hi('M44 60 Q50 50 60 48 Q52 54 48 64 Z', 0.5),
    '42brothers': (K, B) => B.p('M52 42 L76 42 L94 60 L94 84 L76 102 L52 102 L34 84 L34 60 Z', K.gold) + B.p('M54 48 L74 48 L88 62 L88 82 L74 96 L54 96 L40 82 L40 62 Z', K.b, 2.6)
      + B.p('M50 66 L56 57 L72 57 L78 66 L64 88 Z', '#bfefff', 3) + B.ln('M50 66 L78 66 M56 57 L60 66 L64 88 L68 66 L72 57 M60 66 L64 57 L68 66', K.ink, 1.6)
      + B.hi('M56 60 L59 58 L57 64 Z', 0.9) + [[52, 45], [76, 45], [91, 62], [91, 82], [76, 99], [52, 99], [37, 82], [37, 62]].map(([x, y]) => B.dot(x, y, 1.6, '#fff')).join(''),
    cherts: (K, B) => [0, 60, 120, 180, 240, 300].map((a) => `<g transform="rotate(${a} 64 72)">${B.p('M58 44 L64 30 L70 44 Z', '#8a8a96', 3)}</g>`).join('')
      + B.c(64, 72, 29, '#4e3a3a') + B.c(64, 72, 22, '#352424', 2.6)
      + B.p('M52 64 Q46 52 50 44 Q52 54 58 58 M76 64 Q82 52 78 44 Q76 54 70 58', K.b, 2.6) + B.c(64, 74, 10, '#efe3c8', 3) + B.dot(60, 73, 2.6, K.ink) + B.dot(68, 73, 2.6, K.ink)
      + B.dot(60, 73, 1, K.a) + B.dot(68, 73, 1, K.a) + B.ln('M44 86 L50 82 L48 78 M84 62 L79 66 L82 70', K.a, 2.2) + B.hi('M42 64 Q46 52 56 47 Q48 55 46 66 Z', 0.2),
    ugabugi: (K, B) => B.ln('M36 46 L92 98 M92 46 L36 98', '#efe6d4', 7) + B.ln('M36 46 L92 98 M92 46 L36 98', K.ink, 1.6, 0.6)
      + B.c(64, 72, 28, '#c9a37a') + `<circle cx="64" cy="72" r="23" fill="none" stroke="${K.ink}" stroke-width="2" stroke-dasharray="3 3"/>`
      + B.ln('M64 72 Q66 70 66 72 Q66 76 62 76 Q58 76 58 71 Q58 65 64 65 Q72 65 72 72 Q72 81 63 81 Q52 81 52 71 Q52 59 64 59 Q77 59 77 72', K.b, 3.2)
      + B.hi('M42 66 Q46 54 56 49 Q48 57 46 68 Z', 0.4),
  };
  function war(st, K, B) {
    const w = WEAPON[st] || WEAPON.legion, sh = SHIELD[st] || SHIELD.legion;
    return B.ground(64, 108, 34, 6) + `<g transform="translate(64 60) rotate(-42)">${w(K, B)}</g><g transform="translate(64 60) rotate(42) scale(-1 1)">${w(K, B)}</g>` + sh(K, B)
      + B.spark(102, 20, 6, '#fff') + B.spark(24, 26, 4, '#fff');
  }

   
  const FLAG = {
    swallow: 'M78 18 Q58 11 40 19 Q30 23 20 19 L30 37 L20 56 Q32 60 42 56 Q60 49 78 56 Z',
    round: 'M78 18 Q52 9 26 21 Q19 38 26 57 Q52 46 78 56 Z',
    ragged: 'M78 18 Q56 11 30 19 L23 25 L30 30 L21 36 L30 42 L23 50 Q54 47 78 56 Z',
    pennant: 'M78 16 Q50 24 16 37 Q50 46 78 58 Z',
    rect: 'M78 18 L26 18 L26 54 L78 54 Z',
    hide: 'M78 18 Q60 13 46 17 Q30 15 23 24 Q28 36 21 48 Q36 57 50 52 Q66 57 78 56 Z',
  };
  const GATHER = {
    legion: { flag: 'swallow', cloth: '#8c1f2b', pole: '#8a5a33', top: 'spear', horn: 'brass' },
    cats: { flag: 'round', cloth: '#ff8fa3', pole: '#d9a066', top: 'ball', horn: 'bell' },
    monkeys: { flag: 'ragged', cloth: '#4f8a3a', pole: '#c9b06a', top: 'spear', horn: 'conch' },
    veggies: { flag: 'pennant', cloth: '#5aa83a', pole: '#c8925a', top: 'leaf', horn: 'gourd' },
    '42brothers': { flag: 'rect', cloth: '#ff4fa3', pole: '#f4c542', top: 'star', horn: 'mega' },
    cherts: { flag: 'ragged', cloth: '#8a1c1c', pole: '#4e3a3a', top: 'trident', horn: 'demon' },
    ugabugi: { flag: 'hide', cloth: '#c9a37a', pole: '#8a5a33', top: 'stone', horn: 'tusk' },
  };
  function hornCone(B, f, band, inner) {
    return B.p('M42 83 Q86 84 101 56 L109 62 Q95 108 42 115 Z', f) + B.hi('M48 88 Q84 88 99 63 L101 64 Q88 92 50 93 Z', 0.45)
      + B.ln('M62 84 Q66 98 64 112 M84 78 Q90 88 90 98', band, 4.4) + B.ln('M62 84 Q66 98 64 112 M84 78 Q90 88 90 98', '#000', 1, 0.25)
      + B.e(42, 99, 9, 16.5, tone(f, 0.15)) + B.e(43, 99, 4.6, 10, inner, 0) + B.p('M101 56 L109 62 L113 57 L106 51 Z', band, 3);
  }
  const HORN = {
    brass: (K, B) => hornCone(B, '#e0a83a', '#8c1f2b', '#5a3a12') + B.ln('M70 94 Q66 112 76 116 Q86 112 84 96', '#8c1f2b', 2.6) + B.c(76, 117, 3, '#e0b245', 2),
    gourd: (K, B) => hornCone(B, '#f28a2a', '#5aa83a', '#7a3a0a') + B.p('M106 52 Q108 42 116 40 Q114 48 110 54', '#5aa83a', 3) + B.ln('M54 92 Q74 92 92 76', tone('#f28a2a', -0.3), 1.8),
    demon: (K, B) => hornCone(B, '#4a3434', '#ffc23d', '#d81e1e') + B.ln('M52 92 Q74 92 94 72 M50 104 Q74 102 94 84', '#5a3a3a', 2) + B.ln('M44 90 L48 94 M46 106 L42 102', '#ff6a2a', 2),
    tusk: (K, B) => hornCone(B, '#efe6d4', '#a07a4a', '#6d5f4c') + B.ln('M56 90 Q76 92 94 74 M54 106 Q76 104 96 86', tone('#efe6d4', -0.3), 1.8) + B.ln('M74 96 Q72 112 84 114', '#a07a4a', 2.6),
    bell: (K, B) => B.ln('M84 50 Q70 46 60 60', K.a, 5) + B.ln('M84 50 Q70 46 60 60', K.ink, 1.2, 0.5)
      + B.p('M34 100 Q32 68 56 64 Q80 68 78 100 L84 106 L28 106 Z', K.gold) + B.hi('M42 96 Q40 76 52 70 Q46 80 47 96 Z', 0.55)
      + B.ln('M34 92 L78 92', tone(K.gold, -0.35), 2.4) + B.p('M30 104 L82 104 L82 110 L30 110 Z', tone(K.gold, -0.15), 3)
      + B.c(56, 113, 5, tone(K.gold, -0.3), 3) + B.ln('M56 80 L56 92', K.ink, 3) + B.c(56, 76, 3.4, K.ink, 0)
      + B.p('M56 64 Q46 54 42 62 Q44 70 56 66 Q68 70 70 62 Q66 54 56 64 Z', K.a, 3) + B.c(56, 64, 3.4, tone(K.a, -0.2), 2.4),
    conch: (K, B) => B.p('M26 96 Q26 72 54 70 Q84 70 100 58 L108 68 Q98 96 68 106 Q38 116 26 96 Z', '#f6e2c8') + B.e(36, 94, 9, 14, '#ff9ab0', 3, -10)
      + B.ln('M50 72 Q58 90 52 108 M66 72 Q74 88 70 104 M82 68 Q88 80 86 94', tone('#f6e2c8', -0.3), 2.2) + B.p('M100 58 L108 68 L114 62 L106 52 Z', '#e8c48a', 3)
      + [[60, 70], [76, 69], [92, 64]].map(([x, y]) => B.p(`M${x - 4} ${y + 1} L${x} ${y - 7} L${x + 4} ${y + 1} Z`, '#f6e2c8', 2.4)).join('') + B.hi('M40 80 Q48 74 60 74 Q50 78 44 86 Z', 0.6),
    mega: (K, B) => B.p('M98 74 L98 94 L52 114 L52 54 Z', K.gold) + B.e(52, 84, 9, 30, K.b) + B.e(53, 84, 5, 22, '#7a1a4a', 0) + B.hi('M60 60 L94 76 L94 79 L60 64 Z', 0.6)
      + B.p('M98 76 L108 76 L108 92 L98 92 Z', '#2a1030', 3) + B.p('M78 98 L84 112 L92 112 L86 96 Z', '#2a1030', 3)
      + B.ln('M74 66 L74 104', tone(K.gold, -0.35), 2) + [[64, 62], [64, 106], [86, 72], [86, 96]].map(([x, y]) => B.dot(x, y, 1.8, '#fff')).join(''),
  };
  function gather(st, K, B) {
    const g = GATHER[st] || GATHER.legion, cl = g.cloth;
    const top = g.top === 'ball' ? B.c(80, 12, 6, K.a, 3.4)
      : g.top === 'leaf' ? B.p('M80 14 Q72 2 80 -4 Q88 2 80 14 Z', '#5aa83a', 3)
        : g.top === 'star' ? B.p('M80 0 L83 8 L91 8 L85 13 L87 21 L80 16 L73 21 L75 13 L69 8 L77 8 Z', K.gold, 2.6)
          : g.top === 'trident' ? B.p('M74 16 L74 6 L72 6 L75 -2 L78 6 L77 6 L77 14 L83 14 L83 6 L82 6 L85 -2 L88 6 L86 6 L86 16 Z', '#4a4a56', 2.6)
            : g.top === 'stone' ? B.p('M80 -2 Q88 8 84 16 L76 16 Q72 8 80 -2 Z', '#8a8a92', 3)
              : B.p('M80 -2 Q86 8 84 16 L76 16 Q74 8 80 -2 Z', '#d8dde6', 3);
    const flag = B.p(FLAG[g.flag], cl) + B.sh(g.flag === 'pennant' ? 'M78 40 Q56 40 30 38 Q50 46 78 58 Z' : 'M78 40 Q60 44 30 42 L28 50 Q52 46 78 56 Z', 0.2)
      + B.ln(g.flag === 'pennant' ? 'M66 24 Q60 36 64 50' : 'M62 22 Q56 36 62 52 M44 22 Q40 36 44 52', tone(cl, 0.35), 2.4, 0.8)
      + (g.flag === 'rect' ? B.ln('M26 54 L78 54', K.gold, 5) + [32, 42, 52, 62, 72].map((x) => B.p(`M${x} 56 L${x - 2.4} 64 L${x + 2.4} 64 Z`, K.gold, 2)).join('') : '')
      + (g.flag === 'hide' ? B.ln('M76 22 L82 20 M76 34 L82 32 M76 46 L82 44', '#5a3a1a', 2.4) + B.dot(36, 30, 2.4, '#8a6a4a') + B.dot(50, 46, 1.8, '#8a6a4a') : '')
      + motif(st, K, B, g.flag === 'pennant' ? 54 : 52, 37, 1.25);
    return B.ground(64, 114, 36, 5) + B.p('M77 14 L83 14 L83 114 L77 114 Z', g.pole) + B.hi('M78.5 18 L79.6 18 L79.6 110 L78.5 110 Z', 0.5) + top + flag
      + (HORN[g.horn] || HORN.brass)(K, B) + B.spark(108, 30, 5.5, '#fff') + B.spark(18, 70, 4, '#fff');
  }

   
  const CHEST = {
    legion: { body: '#9a6232', lid: '#a86c38', band: '#e0b245', lock: '#e0b245', gem: '#c8264a' },
    cats: { body: '#ff8fa3', lid: '#ffa9b9', band: '#fffaf2', lock: '#f4c542', gem: '#7d9cd6', bow: '#9a7ad6' },
    '42brothers': { body: '#f4c542', lid: '#ff4fa3', band: '#f4c542', lock: '#bfefff', gem: '#bfefff', studs: 1 },
    cherts: { body: '#4a3636', lid: '#5a4242', band: '#7a7a88', lock: '#ffc23d', gem: '#ff6a2a', lava: 1 },
    ugabugi: { body: '#9a9488', lid: '#aaa498', band: '#6d5f4c', lock: '#efe6d4', gem: '#c8423a', stone: 1 },
  };
  function coins(B, K) {
    return B.e(28, 106, 9, 4, K.gold, 3) + B.e(28, 102, 9, 4, K.gold, 3) + B.e(100, 107, 9, 4, K.gold, 3) + B.ln('M24 101 L32 101', tone(K.gold, -0.4), 1.6) + B.ln('M96 106 L104 106', tone(K.gold, -0.4), 1.6);
  }
  function chest(st, K, B) {
    const c = CHEST[st] || CHEST.legion;
    let s = B.ground(64, 110, 46, 6);

    s += `<path d="M30 58 L14 30 M64 50 L64 18 M98 58 L114 30" stroke="${K.gold}" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
    s += B.p('M22 62 L106 62 L103 106 L25 106 Z', c.body) + B.sh('M25 96 L103 96 L103 106 L25 106 Z', 0.2);
    s += B.p('M18 64 Q18 34 64 32 Q110 34 110 64 Z', c.lid) + B.hi('M26 56 Q28 40 54 37 Q36 44 32 58 Z', 0.4);
    if (c.stone) s += B.ln('M30 74 L40 72 M84 88 L96 90 M34 50 L44 46 M86 44 L96 50', tone(c.body, -0.35), 2.2) + B.ln('M58 84 Q60 82 60 84 Q60 88 56 88 Q52 88 52 83 Q52 78 58 78 Q66 78 66 84 Q66 92 57 92', '#c8423a', 2.6);
    else if (c.lava) s += B.ln('M30 78 L38 84 L34 92 M92 74 L86 82 L92 88 M36 48 L44 54 M90 46 L84 54', K.a, 2.6) + B.ln('M18 64 L110 64', K.a, 2.4, 0.9);
    else if (!c.studs) s += B.ln('M25 78 L103 78 M25 92 L103 92 M24 50 L104 50', tone(c.body, -0.35), 2);

    const band = (x) => B.p(`M${x - 5} 33.5 L${x + 5} 33.5 L${x + 5} 106 L${x - 5} 106 Z`, c.band, 3);
    s += c.stone ? B.p('M10 72 Q4 76 10 82 L20 82 L20 72 Z', c.lock, 3) + B.p('M118 72 Q124 76 118 82 L108 82 L108 72 Z', c.lock, 3) : band(38) + band(90);
    if (c.studs) s += [[38, 44], [38, 74], [38, 96], [90, 44], [90, 74], [90, 96]].map(([x, y]) => B.dot(x, y, 2, '#fff')).join('') + B.ln('M22 62 L106 62', K.gold, 4.4) + B.ln('M22 62 L106 62', K.ink, 1.4);
    else s += B.ln('M18 63.5 L110 63.5', c.band, 3.4) + B.ln('M18 63.5 L110 63.5', K.ink, 1.2, 0.6);

    if (st === 'cats') s += B.p('M54 56 L74 56 L74 78 L54 78 Z', c.lock, 3) + B.e(64, 71, 4, 3.4, K.ink, 0) + [[58.5, 64], [62, 61.5], [66, 61.5], [69.5, 64]].map(([x, y]) => B.dot(x, y, 1.6, K.ink)).join('');
    else if (st === 'cherts') s += B.p('M54 56 L74 56 L74 78 L54 78 Z', c.lock, 3) + B.p('M54 58 Q48 50 50 44 Q53 52 58 56 M74 58 Q80 50 78 44 Q75 52 70 56', c.lock, 2.4) + B.c(64, 66, 3, K.ink, 0) + B.p('M62.4 67 L65.6 67 L66 73 L62 73 Z', K.ink, 0);
    else if (st === 'ugabugi') s += B.p('M50 58 L78 58 L80 64 L76 70 L52 70 L48 64 Z', c.lock, 3) + B.c(50, 64, 4.4, c.lock, 2.6) + B.c(78, 64, 4.4, c.lock, 2.6);
    else s += B.p('M54 56 L74 56 L74 78 Q64 84 54 78 Z', c.lock, 3) + B.c(64, 65, 3.2, K.ink, 0) + B.p('M62.6 66 L65.4 66 L66.2 73 L61.8 73 Z', K.ink, 0) + B.hi('M56.5 58.5 L60 58.5 L58 70 Z', 0.55);
    if (c.gem && st !== 'ugabugi') s += B.p('M58 40 L64 34 L70 40 L64 47 Z', c.gem, 2.6) + B.hi('M60 40 L64 36 L64 40 Z', 0.7);
    if (c.bow) s += B.p('M64 34 Q48 18 42 28 Q42 38 64 36 Q86 38 86 28 Q80 18 64 34 Z', c.bow, 3) + B.p('M60 36 L52 48 L58 47 L60 52 L64 38 Z M68 36 L76 48 L70 47 L68 52 L64 38 Z', c.bow, 2.6) + B.c(64, 33, 4.4, tone(c.bow, -0.2), 2.6);
    if (c.studs) s += [[30, 46], [98, 46], [64, 100]].map(([x, y]) => B.p(`M${x - 4} ${y} L${x} ${y - 5} L${x + 4} ${y} L${x} ${y + 5} Z`, '#bfefff', 2)).join('');
    return s + coins(B, K) + B.spark(108, 22, 6, '#fff') + B.spark(20, 24, 4.5, '#fff') + B.spark(64, 12, 4, '#fff');
  }
  function crate(st, K, B) {
    let s = B.ground(64, 110, 46, 6);
    if (st === 'monkeys') {

      s += B.c(92, 48, 11, '#8a5a33') + B.dot(88, 45, 1.8, K.ink) + B.dot(95, 45, 1.8, K.ink) + B.dot(91.5, 50, 1.8, K.ink) + B.hi('M84 44 Q86 39 91 38 Q87 42 86 46 Z', 0.4);
      s += [-34, -12, 10, 32].map((r) => `<g transform="rotate(${r} 50 64)">${B.p('M44 64 Q28 40 44 16 Q48 14 51 17 Q40 40 58 64 Z', K.a, 3.4)}${B.ln('M47 58 Q38 40 46 22', tone(K.a, -0.3), 1.8)}${B.hi('M40 44 Q37 32 43 22 Q40 34 43 46 Z', 0.5)}${B.p('M44 17 L46 10 L51 15 Z', '#6b4423', 2)}</g>`).join('');
    } else {

      s += B.c(84, 50, 14, '#7cc25a') + B.ln('M84 37 Q76 48 84 64 M72 46 Q78 50 84 50 Q90 50 96 46', tone('#7cc25a', -0.35), 1.8);
      s += `<g transform="rotate(-18 46 40)">${B.p('M38 26 Q46 22 54 28 Q52 44 44 62 L40 62 Q34 44 38 26 Z', '#ff7a2f', 3.4)}${B.ln('M40 38 L45 38 M42 48 L47 48', tone('#ff7a2f', -0.4), 1.8)}${B.p('M46 25 Q44 12 52 10 Q51 17 53 21 Q58 13 64 16 Q58 19 54 26', '#5aa83a', 3)}</g>`;
      s += B.c(62, 52, 12, '#e5383b') + B.p('M55 43 L62 46 L69 43 L66 48 L62 45 L58 48 Z', '#5aa83a', 2) + B.hi('M54 50 Q56 44 60 43 Q57 47 57 52 Z', 0.55);
    }
    const wood = st === 'monkeys' ? '#b5753a' : K.wood;
    s += B.p('M20 60 L108 60 L105 106 L23 106 Z', wood) + B.ln('M21 75 L107 75 M22 90 L106 90', tone(wood, -0.35), 2.4);
    s += B.p('M24 64 L32 64 L104 102 L96 102 Z', tone(wood, 0.18), 2.6) + B.ln('M30 66 L100 102', tone(wood, -0.3), 1.2, 0.6);
    s += B.p('M18 58 L110 58 L110 66 L18 66 Z', tone(wood, -0.12), 3) + [[26, 62], [102, 62], [26, 100], [102, 100]].map(([x, y]) => B.dot(x, y, 2, K.ink)).join('');
    if (st === 'veggies') s += B.p('M48 78 L80 78 L80 94 L48 94 Z', K.paper, 2.6) + B.ln('M53 84 L75 84 M53 89 L68 89', '#5aa83a', 2);
    else s += B.ln('M14 56 Q24 50 28 62 M114 56 Q104 50 100 62', '#e8c48a', 3.4);
    return s + coins(B, K) + B.spark(110, 30, 6, '#fff') + B.spark(16, 34, 4.5, '#fff');
  }
  const gift = (st, K, B) => (st === 'monkeys' || st === 'veggies' ? crate(st, K, B) : chest(st, K, B));

   
  const HALL = {
    legion: (K, B) => {
      const stone = '#cfc8b8', roof = '#8c1f2b';
      const blocks = (x0, x1, y0, y1) => { let d = ''; for (let y = y0 + 8; y < y1; y += 8) d += `M${x0} ${y} L${x1} ${y} `; for (let y = y0, k = 0; y < y1; y += 8, k++) for (let x = x0 + (k % 2 ? 6 : 12); x < x1; x += 12) d += `M${x} ${y} L${x} ${y + 8} `; return B.ln(d, tone(stone, -0.3), 1.4); };
      const tower = (x) => B.p(`M${x - 13} 44 L${x + 13} 44 L${x + 13} 106 L${x - 13} 106 Z`, stone) + blocks(x - 13, x + 13, 44, 106) + B.p(`M${x - 17} 46 L${x} 14 L${x + 17} 46 Z`, roof) + B.hi(`M${x - 12} 44 L${x} 20 L${x - 4} 44 Z`, 0.25)
        + B.ln(`M${x} 14 L${x} 4`, K.ink, 2.6) + B.p(`M${x} 4 L${x + 12} 7 L${x} 11 Z`, K.c, 2.4) + B.p(`M${x - 4} 62 Q${x} 56 ${x + 4} 62 L${x + 4} 72 L${x - 4} 72 Z`, '#ffcf4a', 2.6);
      return B.ground(64, 108, 52, 6) + tower(26) + tower(102)
        + B.p('M38 56 L90 56 L90 106 L38 106 Z', stone) + blocks(38, 90, 56, 106) + B.p('M34 58 L64 30 L94 58 Z', roof) + B.hi('M40 56 L64 34 L56 56 Z', 0.25)
        + B.p('M58 40 L70 40 L70 52 Q64 56 58 52 Z', K.c, 2.6) + motif('legion', K, B, 64, 46, 0.4)
        + B.p('M52 106 L52 84 Q64 70 76 84 L76 106 Z', K.gold) + B.p('M56 106 L56 85 Q64 75 72 85 L72 106 Z', '#7a4a2a', 2.6) + B.ln('M64 78 L64 106 M56 92 L72 92', '#3a2412', 1.8) + B.dot(68, 96, 1.8, K.gold)
        + B.p('M42 62 L50 62 L50 74 L42 74 Z', '#ffcf4a', 2.6) + B.p('M78 62 L86 62 L86 74 L78 74 Z', '#ffcf4a', 2.6);
    },
    cats: (K, B) => B.ground(64, 108, 50, 6)
      + B.p('M88 30 L98 30 L98 52 L88 52 Z', '#e8a07a') + B.p('M86 26 L100 26 L100 32 L86 32 Z', tone('#e8a07a', -0.2), 3) + B.ln('M93 26 L93 14', K.ink, 2.4) + B.p('M84 12 Q93 6 102 12 Q93 18 84 12 Z M102 12 L108 8 L108 16 Z', K.metal, 2.4)
      + B.p('M26 58 L102 58 L102 106 L26 106 Z', '#fff1e0') + B.sh('M26 98 L102 98 L102 106 L26 106 Z', 0.12)
      + B.p('M16 62 L24 28 L38 42 Q64 24 90 42 L104 28 L112 62 Z', K.a) + `<path d="M26 36 L28 46 L34 42 Z M102 36 L100 46 L94 42 Z" fill="#ffd0da"/>` + B.ln('M24 54 Q64 40 104 54', tone(K.a, -0.25), 2.2)
      + B.c(64, 78, 11, '#ffe9a8') + B.e(59.5, 78, 2.2, 4, K.ink, 0) + B.e(68.5, 78, 2.2, 4, K.ink, 0) + B.p('M62.6 83 L65.4 83 L64 84.6 Z', '#e8455c', 1.2) + B.ln('M64 67 L64 89 M53 78 L75 78', K.ink, 2, 0.5)
      + B.p('M32 106 L32 86 Q41 76 50 86 L50 106 Z', '#c97a4a') + B.dot(46, 96, 1.8, K.ink) + B.p('M80 82 L96 82 L96 96 L80 96 Z', '#ffe9a8', 3) + B.ln('M88 82 L88 96 M80 89 L96 89', K.ink, 1.8)
      + B.p('M78 96 L98 96 L96 102 L80 102 Z', '#c97a4a', 2.6) + B.dot(83, 94, 2.4, K.a) + B.dot(89, 93, 2.4, '#ffd23f') + B.dot(94, 94, 2.4, K.a)
      + B.p('M52 106 Q50 100 54 98 Q58 100 56 106 Z', '#f6d7a8', 2.2),
    monkeys: (K, B) => B.ground(64, 110, 46, 5)
      + B.p('M54 110 Q60 88 56 70 L74 70 Q70 88 78 110 Z', '#7a4f2a') + B.ln('M62 76 Q64 90 60 104 M70 80 Q68 94 72 106', tone('#7a4f2a', -0.35), 2) + B.p('M54 110 Q46 106 42 110 M78 110 Q86 106 90 110', 'none', 3.4)
      + B.ln('M30 72 L34 108 M42 72 L46 108', '#c9a15e', 2.6) + B.ln('M31 80 L43 80 M32 88 L44 88 M33 96 L45 96 M34 104 L46 104', '#c9a15e', 3)
      + B.p('M20 66 L108 66 L106 74 L22 74 Z', '#c99a5e') + B.ln('M36 66 L36 74 M56 66 L56 74 M76 66 L76 74 M94 66 L94 74', tone('#c99a5e', -0.35), 1.6)
      + B.p('M30 40 L98 40 L98 66 L30 66 Z', '#d6a868') + B.ln('M42 40 L42 66 M54 40 L54 66 M74 40 L74 66 M86 40 L86 66', tone('#d6a868', -0.3), 1.8)
      + B.p('M58 66 L58 48 Q64 42 70 48 L70 66 Z', '#3a2412', 3) + B.p('M36 46 L48 46 L48 56 L36 56 Z', '#ffcf4a', 2.6) + B.p('M80 46 L92 46 L92 56 L80 56 Z', '#ffcf4a', 2.6)
      + [[-24, 28], [-8, 22], [8, 22], [24, 28]].map(([r, y]) => `<g transform="rotate(${r} 64 ${y + 20})">${B.p(`M64 ${y} Q94 ${y + 6} 104 ${y + 24} Q84 ${y + 16} 64 ${y + 18} Q44 ${y + 16} 24 ${y + 24} Q34 ${y + 6} 64 ${y} Z`, r % 16 ? '#5a9a3a' : '#4f8a3a', 3.4)}${B.ln(`M30 ${y + 21} Q64 ${y + 8} 98 ${y + 21}`, tone('#4f8a3a', 0.35), 1.6)}</g>`).join('')
      + B.ln('M100 40 L100 16', K.ink, 2.4) + motif('monkeys', K, B, 108, 20, 0.6),
    veggies: (K, B) => B.ground(64, 110, 50, 6)
      + B.p('M60 30 Q58 18 64 10 L72 12 Q68 20 70 30 Z', '#6b8a3a') + `<circle cx="80" cy="8" r="4" fill="#fff" opacity=".7"/><circle cx="88" cy="2" r="3" fill="#fff" opacity=".55"/>`
      + B.p('M70 18 Q84 8 96 18 Q84 26 70 18 Z', K.c, 3) + B.ln('M74 18 L92 18', tone(K.c, -0.3), 1.6)
      + B.p('M18 76 Q18 34 64 30 Q110 34 110 76 Q110 108 64 108 Q18 108 18 76 Z', '#f28a2a')
      + B.ln('M64 31 Q48 70 64 108 M64 31 Q80 70 64 108 M40 36 Q26 70 42 104 M88 36 Q102 70 86 104', tone('#f28a2a', -0.28), 2.2) + B.hi('M26 64 Q30 44 46 37 Q34 50 32 68 Z', 0.4)
      + B.p('M52 108 L52 86 Q64 74 76 86 L76 108 Z', '#5aa83a') + B.ln('M64 80 L64 108', tone('#5aa83a', -0.35), 1.8) + B.dot(70, 96, 2, '#ffd23f')
      + B.c(36, 70, 7.5, '#ffe9a8', 3) + B.ln('M36 62.5 L36 77.5 M28.5 70 L43.5 70', K.ink, 1.6) + B.c(92, 70, 7.5, '#ffe9a8', 3) + B.ln('M92 62.5 L92 77.5 M84.5 70 L99.5 70', K.ink, 1.6)
      + B.ln('M10 104 L10 92 M18 104 L18 92 M110 104 L110 92 M118 104 L118 92 M6 96 L22 96 M106 96 L122 96', '#c8925a', 3)

      + B.ln('M70 32 Q84 40 96 44 Q104 48 104 58', '#3f8a2a', 2.6) + B.p('M90 42 Q96 34 102 40 Q96 46 90 42 Z', K.c, 2.4) + B.p('M100 52 Q108 50 108 58 Q102 60 100 52 Z', K.c, 2.4)
      + B.p('M100 108 L100 90 L104 90 L104 108 Z', '#8a5a33', 2.4) + B.p('M94 82 L110 82 Q112 88 110 92 L94 92 Z', '#ff7a2f', 2.6) + B.ln('M108 82 L108 76 L112 78', '#e5383b', 2)
      + [[44, 104, '#e5383b'], [36, 106, '#ffd23f'], [84, 104, '#c98ad0']].map(([x, y, f]) => B.ln(`M${x} ${y} L${x} ${y - 6}`, '#3f8a2a', 2) + B.c(x, y - 8, 3.2, f, 2)).join(''),
    '42brothers': (K, B) => B.ground(64, 110, 52, 6)
      + B.p('M22 52 L106 52 L106 106 L22 106 Z', K.c) + B.ln('M22 64 L106 64', tone(K.c, -0.3), 2)
      + B.p('M16 54 L64 24 L112 54 Z', K.gold) + B.p('M30 50 L64 30 L98 50 Z', tone(K.c, -0.15), 2.4) + motif('42brothers', K, B, 64, 42, 0.55)
      + [32, 50, 78, 96].map((x) => B.p(`M${x - 4} 56 L${x + 4} 56 L${x + 4} 102 L${x - 4} 102 Z`, '#fff4fb', 2.6) + B.ln(`M${x - 1} 60 L${x - 1} 98`, tone(K.c, 0.6), 1.4)).join('')
      + B.p('M56 106 L56 76 Q64 68 72 76 L72 106 Z', '#2a1030', 3) + `<path d="M58 82 L70 82 L70 106 L58 106 Z" fill="${K.b}" opacity=".45"/>`
      + B.p('M50 106 L78 106 L84 116 L44 116 Z', '#d81e4a', 3) + B.ln('M48 110 L80 110', tone('#d81e4a', 0.35), 1.6)
      + B.p('M38 66 L44 66 L44 80 L38 80 Z M84 66 L90 66 L90 80 L84 80 Z', K.b, 2.4)
      + B.spark(18, 30, 5, K.b) + B.spark(110, 30, 5, K.gold) + B.spark(104, 12, 3.5, '#fff'),
    cherts: (K, B) => B.ground(64, 110, 46, 6)
      + B.e(64, 110, 36, 5, K.a, 2.6) + B.ln('M40 110 Q52 106 64 110 Q76 114 88 110', K.c, 2)
      + B.p('M42 108 L47 44 L81 44 L86 108 Z', '#4e3a3a') + B.ln('M45 60 L83 60 M44 76 L84 76 M43 92 L85 92 M56 44 L56 60 M72 60 L72 76 M58 76 L58 92 M70 92 L70 108', '#1e1212', 1.8)
      + B.p('M40 46 L88 46 L88 38 L82 38 L82 42 L76 42 L76 36 L70 36 L70 42 L58 42 L58 36 L52 36 L52 42 L46 42 L46 38 L40 38 Z', '#4a3434', 3)
      + B.p('M44 38 L64 6 L84 38 Z', '#5a1414') + B.hi('M50 36 L64 12 L58 36 Z', 0.15)
      + B.p('M48 30 Q32 22 34 6 Q40 18 52 22 Z', '#efe3c8', 3) + B.p('M80 30 Q96 22 94 6 Q88 18 76 22 Z', '#efe3c8', 3)
      + B.p('M56 108 L56 90 Q64 82 72 90 L72 108 Z', K.a, 3) + `<path d="M60 108 L60 92 Q64 88 68 92 L68 108 Z" fill="${K.c}"/>`
      + B.p('M58 52 Q64 46 70 52 L70 62 L58 62 Z', K.a, 2.6) + B.p('M50 68 L56 68 L56 78 L50 78 Z M72 68 L78 68 L78 78 L72 78 Z', K.a, 2.4)
      + B.p('M26 108 Q20 98 26 90 Q26 98 30 98 Q30 92 34 88 Q36 98 34 108 Z', K.a, 2.4) + B.p('M96 108 Q92 98 98 92 Q98 98 102 98 Q102 94 106 90 Q108 100 104 108 Z', K.a, 2.4),
    ugabugi: (K, B) => B.ground(64, 110, 54, 6)
      + B.p('M12 108 Q14 54 64 40 Q114 54 116 108 Z', '#9a9488') + B.p('M24 70 Q34 58 46 60 Q40 70 30 74 Z M86 58 Q98 62 104 74 Q94 72 88 66 Z', tone('#9a9488', -0.15), 2.4)
      + B.hi('M22 84 Q26 62 44 52 Q32 66 30 86 Z', 0.3) + B.ln('M70 48 L78 52 M96 84 L104 88 M20 96 L28 98', tone('#9a9488', -0.4), 2.2)
      + B.p('M38 108 Q40 72 64 68 Q88 72 90 108 Z', '#24201a', 3.4)
      + B.p('M50 108 Q48 96 56 88 Q56 96 60 96 Q60 88 66 82 Q70 94 74 96 Q78 92 78 86 Q84 98 78 108 Z', K.a, 2.6) + `<path d="M58 108 Q58 100 62 96 Q64 102 66 100 Q68 96 70 94 Q74 102 70 108 Z" fill="#ffe08a"/>`
      + B.ln('M44 108 L52 104 M84 108 L76 104', '#8a5a33', 4)
      + B.p('M34 104 Q24 72 50 58 Q34 76 40 104 Z', '#efe6d4', 3) + B.p('M94 104 Q104 72 78 58 Q94 76 88 104 Z', '#efe6d4', 3)
      + B.p('M58 54 Q64 50 70 54 Q72 60 64 60 Q56 60 58 54 Z', '#efe6d4', 2.4) + B.dot(61, 56, 1.4, K.ink) + B.dot(67, 56, 1.4, K.ink)
      + B.p('M96 46 L98 40 Q99 38 100 40 L100 36 Q101 34 102 36 L102 35 Q103 33 104 35 L104 38 Q105 36 106 38 L105 46 Z', '#c8423a', 0)

      + B.p('M14 108 Q14 98 22 98 Q30 98 30 108 Z', '#8a8478', 2.6) + B.p('M100 108 Q102 100 110 100 Q118 102 116 108 Z', '#8a8478', 2.6) + B.p('M26 108 Q28 102 34 103 Q38 104 38 108 Z', '#a8a296', 2.4)
      + B.p('M92 112 L106 108 Q110 106 110 110 Q112 113 108 113 L94 116 Q90 118 89 115 Q88 112 92 112 Z', '#efe6d4', 2.2)
      + B.ln('M80 50 Q80 44 86 44 Q92 44 92 49 L92 54 M80 50 L80 54 M84 50 L84 54 M92 48 Q96 50 95 55', '#c8423a', 2),
  };
  const hall = (st, K, B) => (HALL[st] || HALL.legion)(K, B);

   
  const BOOK = {
    legion: { cover: '#8c1f2b', page: '#f6e7c1', corner: '#e0b245', ribbon: '#2f4a8a', ink: '#5a3a2a', pen: 'feather', vane: '#fff3d6' },
    cats: { cover: '#ff8fa3', page: '#fffaf2', corner: '#f4c542', ribbon: '#7d9cd6', ink: '#c06080', pen: 'feather', vane: '#ffd0da', doodle: 'paw' },
    monkeys: { cover: '#4f8a3a', page: '#f2e2b0', corner: '#8a5a33', ribbon: '#e0302a', ink: '#5a3a1a', pen: 'twig', doodle: 'banana' },
    veggies: { cover: '#5aa83a', page: '#fffbea', corner: '#ff7a2f', ribbon: '#e5383b', ink: '#4a6a2a', pen: 'carrot', doodle: 'carrot' },
    '42brothers': { cover: '#7a3fd0', page: '#fff4fb', corner: '#f4c542', ribbon: '#ff4fa3', ink: '#7a3fd0', pen: 'gold', doodle: 'star' },
    cherts: { cover: '#3e2626', page: '#e8d2b0', corner: '#ff6a2a', ribbon: '#d81e1e', ink: '#7a1a1a', pen: 'feather', vane: '#3a2a2a', doodle: 'flame', burn: 1 },
  };
  function book(st, K, B) {
    if (st === 'ugabugi') return tablets(K, B);
    const b = BOOK[st] || BOOK.legion;
    let s = B.ground(64, 108, 50, 6);
    s += B.p('M64 52 Q40 40 12 46 L12 102 Q40 96 64 108 Q88 96 116 102 L116 46 Q88 40 64 52 Z', b.cover);
    s += [[12, 46], [116, 46], [12, 102], [116, 102]].map(([x, y]) => B.p(`M${x} ${y + (y < 70 ? 10 : -10)} L${x} ${y} L${x + (x < 64 ? 10 : -10)} ${y + (y < 70 ? -1 : 1)} Z`, b.corner, 2.4)).join('');
    s += B.p('M64 48 Q44 36 18 41 L18 96 Q42 90 64 102 Z', b.page) + B.p('M64 48 Q84 36 110 41 L110 96 Q86 90 64 102 Z', b.page);
    s += B.sh('M64 48 L64 102 Q60 98 56 96 L56 46 Q60 46 64 48 Z', 0.12) + B.sh('M64 48 L64 102 Q68 98 72 96 L72 46 Q68 46 64 48 Z', 0.08);
    s += B.ln('M26 54 Q40 51 56 56 M26 63 Q40 60 56 65 M26 72 Q40 69 56 74 M26 81 Q38 78 48 82', b.ink, 2.2, 0.75);
    s += B.ln('M72 56 Q86 51 102 54 M72 65 Q86 60 102 63', b.ink, 2.2, 0.75);
    const d = b.doodle;
    if (d === 'paw') s += motif('cats', { ...K, l: b.ink }, B, 88, 80, 0.55);
    else if (d === 'banana' || d === 'carrot' || d === 'flame') s += motif(d === 'banana' ? 'monkeys' : d === 'carrot' ? 'veggies' : 'cherts', K, B, 88, 80, 0.7);
    else if (d === 'star') s += motif('42brothers', K, B, 88, 80, 0.7);
    else s += B.ln('M74 74 Q86 70 100 72 M74 83 Q84 80 94 82', b.ink, 2.2, 0.75);
    if (b.burn) s += B.ln('M18 92 L22 88 L20 84 M110 90 L106 86 L108 82 M102 41 L98 46', K.a, 2.4) + B.sh('M18 96 L18 86 Q24 92 30 92 Q24 94 18 96 Z M110 96 L110 86 Q104 92 96 92 Q104 94 110 96 Z', 0.35);
    s += B.p('M60 100 L60 118 L64 113 L68 118 L68 100 Z', b.ribbon, 2.6);

    if (b.pen === 'carrot') s += `<g transform="rotate(32 92 52)">${B.p('M86 16 L98 16 L98 74 L92 88 L86 74 Z', '#ff7a2f')}${B.ln('M86 30 L91 30 M93 44 L98 44 M86 58 L90 58', tone('#ff7a2f', -0.4), 1.8)}${B.p('M89 82 L92 88 L95 82 Z', '#2f3a1e', 0)}${B.p('M92 16 Q86 4 90 -2 Q92 6 94 8 Q98 0 104 2 Q98 8 96 16', '#5aa83a', 3)}</g>`;
    else if (b.pen === 'gold') s += `<g transform="rotate(32 92 52)">${B.p('M87 10 L97 10 L97 66 L87 66 Z', '#2a1030')}${B.p('M87 54 L97 54 L97 66 L87 66 Z', K.gold, 3)}${B.p('M87 66 L97 66 L92 86 Z', K.gold, 3)}${B.ln('M92 70 L92 80', K.ink, 1.4)}${B.ln('M97 16 L101 18 L101 40', K.gold, 2.6)}${B.dot(92, 30, 2.2, K.b)}</g>`;
    else if (b.pen === 'twig') s += `<g transform="rotate(32 92 52)">${B.p('M90 10 L95 10 L94 82 L92 88 L90 82 Z', '#8a5a33', 3.4)}${B.p('M95 20 Q112 14 116 28 Q104 32 95 30 Z', '#5a9a3a', 3)}${B.ln('M96 25 L112 22', tone('#5a9a3a', 0.35), 1.4)}</g>`;
    else s += `<g transform="rotate(32 92 52)">${B.p('M92 4 Q108 18 102 50 Q98 64 93 72 L91 72 Q84 56 84 38 Q84 16 92 4 Z', b.vane)}${B.ln('M92 8 Q94 40 92 84', K.ink, 2.4)}${B.ln('M93 22 L100 18 M93 32 L101 28 M93 42 L101 39 M91 28 L86 24 M91 40 L86 37', tone(b.vane, -0.35), 1.6)}${B.p('M90 72 L94 72 L93 86 L92 88 L91 86 Z', '#2a1a12', 2.4)}${st === 'cherts' ? B.dot(92, 6, 3, K.a) : ''}</g>`;
    return s + B.spark(20, 26, 4.5, '#fff') + B.spark(36, 16, 3.2, '#fff');
  }
  function tablets(K, B) {
    const st = '#a8a296';
    return B.ground(64, 110, 50, 6)
      + B.p('M14 40 L60 36 L62 104 L18 108 Z', st) + B.p('M68 36 L114 40 L110 108 L66 104 Z', tone(st, 0.08))
      + B.ln('M22 48 L26 46 M50 98 L56 98 M76 98 L84 100', tone(st, -0.4), 2) + B.hi('M18 44 L56 40 L56 43 L20 47 Z', 0.4) + B.hi('M72 40 L108 43 L108 46 L72 43 Z', 0.4)

      + B.p('M24 70 Q24 58 36 58 Q48 58 48 68 L48 78 L44 78 L44 72 L30 72 L30 78 L26 78 Z', 'none', 2.6) + B.ln('M48 66 Q54 70 52 80 M44 72 Q42 80 36 80', K.ink, 2.4)
      + B.c(38, 90, 5, 'none', 2.4) + B.ln('M38 81 L38 83 M38 97 L38 99 M29 90 L31 90 M45 90 L47 90 M32 84 L33.5 85.5 M44 84 L42.5 85.5', K.ink, 2.2)
      + B.c(84, 54, 3.6, 'none', 2.4) + B.ln('M84 58 L84 70 M84 62 L78 66 M84 62 L92 58 M84 70 L79 78 M84 70 L89 78 M92 50 L92 70', K.ink, 2.4)
      + B.ln('M76 86 L100 86 M76 94 L94 94', K.b, 3) + B.p('M96 48 L100 44 L104 48 L100 52 Z', K.b, 2)
      + `<g transform="rotate(36 96 60)">${B.p('M92 22 Q98 16 102 22 Q98 26 98 30 L98 86 L92 86 L92 30 Q88 26 92 22 Z', '#efe6d4', 3.4)}${B.p('M92 86 L98 86 L95 94 Z', '#8a8a92', 3)}</g>`
      + B.spark(20, 26, 4.5, '#fff');
  }
  const log = (st, K, B) => book(st, K, B);

   
  const SCROLL = {
    legion: { paper: '#f6e7c1', roll: '#8a5a33', knob: '#e0b245', seal: '#8c1f2b', mark: '#2f8a3a', box: '#fff3d6', ink: '#5a3a2a' },
    cats: { paper: '#fffaf2', roll: '#ff8fa3', knob: '#7d9cd6', seal: '#ff8fa3', mark: '#e0607a', box: '#fff', ink: '#8a5a3c' },
    monkeys: { paper: '#e6d48a', roll: '#c9b06a', knob: '#8a5a33', seal: '#e0302a', mark: '#2f6a1e', box: '#fff0c8', ink: '#4a3a12', leaf: 1 },
    veggies: { paper: '#fffbea', roll: '#5aa83a', knob: '#ff7a2f', seal: '#e5383b', mark: '#2f6a1e', box: '#fff', ink: '#4a6a2a' },
    '42brothers': { paper: '#fff4fb', roll: '#2a1030', knob: '#f4c542', seal: '#f4c542', mark: '#ff4fa3', box: '#fff', ink: '#7a3fd0' },
    cherts: { paper: '#e8d2b0', roll: '#4a3030', knob: '#ff6a2a', seal: '#d81e1e', mark: '#d8501e', box: '#fff1d8', ink: '#5a1a1a', burn: 1 },
    ugabugi: { paper: '#d9c29a', roll: '#efe6d4', knob: '#efe6d4', seal: '#c8423a', mark: '#c8423a', box: '#efe6d4', ink: '#5a4a32', hide: 1 },
  };
  function tasks(st, K, B) {
    const c = SCROLL[st] || SCROLL.legion;
    let s = B.ground(64, 112, 44, 6);
    const paperD = c.burn ? 'M30 26 L98 26 L98 96 L92 100 L86 96 L80 101 L72 96 L64 100 L56 96 L48 101 L40 96 L34 100 L30 96 Z'
      : c.hide ? 'M30 26 L98 26 Q102 46 98 62 Q102 82 98 100 L30 100 Q26 82 30 62 Q26 46 30 26 Z' : 'M30 26 L98 26 L98 100 L30 100 Z';
    if (c.leaf) s += B.p('M64 10 Q104 30 100 66 Q96 100 64 116 Q32 100 28 66 Q24 30 64 10 Z', '#7cc25a') + B.ln('M64 14 L64 112', tone('#7cc25a', -0.35), 2.4) + B.ln('M64 40 L44 30 M64 40 L84 30 M64 70 L40 60 M64 70 L88 60 M64 96 L46 88 M64 96 L82 88', tone('#7cc25a', -0.3), 1.6);
    s += B.p(paperD, c.paper) + B.sh('M86 26 L98 26 L98 100 L86 100 Z', 0.08);
    if (c.burn) s += B.ln('M30 40 L34 44 L31 48 M98 50 L94 54 L97 58', K.a, 2.2) + B.sh('M30 26 L36 26 L34 40 L30 44 Z', 0.3);
    if (c.hide) s += `<path d="M34 30 L34 96 M94 30 L94 96" stroke="${K.ink}" stroke-width="1.8" stroke-dasharray="3 3" fill="none"/>`;

    const roll = (y) => B.p(`M24 ${y - 6} L104 ${y - 6} Q108 ${y} 104 ${y + 6} L24 ${y + 6} Q20 ${y} 24 ${y - 6} Z`, c.roll)
      + (c.hide ? B.c(20, y, 5, c.knob, 3) + B.c(108, y, 5, c.knob, 3) + B.c(14, y - 4, 4, c.knob, 2.6) + B.c(14, y + 4, 4, c.knob, 2.6) + B.c(114, y - 4, 4, c.knob, 2.6) + B.c(114, y + 4, 4, c.knob, 2.6)
        : B.p(`M14 ${y - 7} L22 ${y - 7} L22 ${y + 7} L14 ${y + 7} Z`, c.knob, 3) + B.p(`M106 ${y - 7} L114 ${y - 7} L114 ${y + 7} L106 ${y + 7} Z`, c.knob, 3))
      + B.hi(`M26 ${y - 3} L102 ${y - 3} L102 ${y - 1} L26 ${y - 1} Z`, 0.45);
    s += roll(24);
    if (!c.burn) s += roll(102);

    [[44, 1], [62, 1], [80, 0]].forEach(([y, done]) => {
      s += B.p(`M38 ${y - 6} L50 ${y - 6} L50 ${y + 6} L38 ${y + 6} Z`, c.box, 2.6);
      if (done) s += B.ln(`M38 ${y} L43 ${y + 5} L54 ${y - 8}`, c.mark, 4.4) + B.ln(`M38 ${y} L43 ${y + 5} L54 ${y - 8}`, K.ink, 1.2, 0.5);
      s += B.ln(`M58 ${y - 2} L${done ? 88 : 82} ${y - 2} M58 ${y + 3} L${done ? 78 : 72} ${y + 3}`, c.ink, 2.4, done ? 0.45 : 0.8);
    });

    s += B.p('M84 96 L80 116 L86 112 L90 118 L92 98 Z', tone(c.seal, -0.15), 2.6) + B.p('M96 96 L104 114 L98 112 L96 118 L90 98 Z', tone(c.seal, -0.15), 2.6);
    if (st === 'ugabugi') s += B.c(92, 94, 12, c.seal) + B.p('M86 100 L85 92 Q85 90 87 90 L87 86 Q88 84 89 86 L89 85 Q90 83 91 85 L91 85 Q92 83 93 85 L93 88 L95 86 Q97 85 97 88 L94 96 Q93 100 90 100 Z', '#efe6d4', 0);
    else s += B.c(92, 94, 12, c.seal) + `<circle cx="92" cy="94" r="8" fill="none" stroke="${tone(c.seal, -0.3)}" stroke-width="2"/>` + motif(st, { ...K, gold: tone(c.seal, 0.45), l: tone(c.seal, 0.55) }, B, 92, 94, 0.5) + B.hi('M84 90 Q86 84 92 83 Q87 87 86 92 Z', 0.5);
    return s + B.spark(110, 44, 5, '#fff') + B.spark(18, 58, 3.6, '#fff');
  }

   
  const DRAW = { war, gather, gift, hall, log, tasks };
  const TITLE = { war: 'Бой', gather: 'Сбор', gift: 'Подарок', hall: 'Здание гильдии', log: 'Журнал', tasks: 'Задания' };
  function svg(name, style, size) {
    if (!DRAW[name]) return '';
    const st = ST[style] ? style : 'legion', K = ST[st], B = brush(K), n = Math.max(16, Math.round(Number(size) || 96));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="${n}" height="${n}" aria-hidden="true" focusable="false" class="lg-ggi" data-gi="${name}" data-st="${st}">`
      + PLATE[K.shape](K, B) + DRAW[name](st, K, B) + '</svg>';
  }
  return { names: NAMES.slice(), styles: STYLES.slice(), titles: { ...TITLE }, svg };
});
