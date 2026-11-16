














(function () {
  'use strict';
  const M = (typeof window !== 'undefined' && window.LGTownKitMap) || (typeof require === 'function' ? require('./tkmap.js') : null);
  const { f1, rng, RAIL } = M;
  const INK = '#2b1d18';
  const P = {
    forest: '#3d6b3f', forestD: '#2f5634', grass: '#83ad5c', grassD: '#6c9a4c', grassL: '#9cc56e', plat: '#99c26a', platD: '#7fab57', platL: '#b2d580',
    pave: '#e3b98c', paveD: '#c08e62', paveL: '#f2d3a8', mortar: '#a87650', plaza: '#efd2a4', terra: '#d27b5a', terraD: '#a4553c', terraL: '#e89a78',
    path: '#d9b383', pathD: '#b88f60', pathL: '#ead0a4', water: '#5ab4d2', waterD: '#3f8fb8', waterL: '#9fdcee', sand: '#e8cf98',
    rock: '#b39a8c', rockD: '#8f766b', rockDD: '#6e5852', rockL: '#cdb7a8', mrock: '#a08c88', mrockD: '#7d6a68', mrockL: '#bfaaa4',
    wood: '#a8754f', woodD: '#6e4a2f', woodL: '#c8956a', card: '#d9a066', cardD: '#a8743f', cardL: '#ecc08a', cream: '#fff1d6', milk: '#f7f3ea',
    pink: '#ff8fa3', gold: '#ffcf4a', glass: '#ffd76a', metal: '#3a2e4a', plum: '#7a4a78', plumD: '#5a3458', plumL: '#9a6496',
    brick: '#b4584a', brickD: '#80392e', leaf: '#5a9a4a', leafD: '#3e7436', leafL: '#8cc46a', blossom: '#ffa9bf', blossomD: '#e07a98', blossomL: '#ffd0dc',
  };
  const FUR = ['#f2a65a', '#e8914a', '#f3d9b1', '#9aa3ad', '#7d8a99', '#f4f1ec', '#4a4350', '#a8754f', '#ffc6a0', '#c9ccd3'];
  const O = (w = 4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let UID = 0; const uid = (p) => p + (++UID).toString(36);

   
  const smooth = (pts) => { const n = pts.length; let d = ''; for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n], m = pts[(i + 2) % n]; if (!i) d += `M${f1((p[0] + q[0]) / 2)} ${f1((p[1] + q[1]) / 2)} `; d += `Q${f1(q[0])} ${f1(q[1])} ${f1((q[0] + m[0]) / 2)} ${f1((q[1] + m[1]) / 2)} `; } return d + 'Z'; };
  const blob = (cx, cy, rx, ry, r, n = 9, j = 0.16) => { const pts = [], a0 = r() * 6.283; for (let i = 0; i < n; i++) { const a = a0 + (i / n) * 6.283, k = 1 - j + r() * j * 2; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); } return smooth(pts); };
  const poly = (pts) => 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';

  function curve(pts) {
    if (pts.length < 3) return 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L');
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d;
  }
  const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0} H${x1 - r} Q${x1} ${y0} ${x1} ${y0 + r} V${y1 - r} Q${x1} ${y1} ${x1 - r} ${y1} H${x0 + r} Q${x0} ${y1} ${x0} ${y1 - r} V${y0 + r} Q${x0} ${y0} ${x0 + r} ${y0} Z`;
  const txt = (x, y, t, size, fill = P.gold, extra = '') => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="Russo One" font-size="${size}" fill="${fill}" stroke="${INK}" stroke-width="${f1(Math.max(2.5, size / 7))}" paint-order="stroke" ${extra}>${esc(t)}</text>`;
  const glowDef = (id, c = P.glass, a = 0.85) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a}"/><stop offset=".45" stop-color="${c}" stop-opacity="${f1(a * 0.35 * 10) / 10}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;

   
  const paw = (x, y, s = 1, c = INK, op = 0.35) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})" fill="${c}" opacity="${op}"><ellipse cx="0" cy="4" rx="7" ry="6"/><circle cx="-7" cy="-5" r="3"/><circle cx="-2.4" cy="-8.5" r="3"/><circle cx="2.6" cy="-8.5" r="3"/><circle cx="7" cy="-5" r="3"/></g>`;
  const fish = (x, y, s = 1, c = '#8fb6c8', rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><path d="M-26 0 C-14 -14 10 -14 20 0 C10 14 -14 14 -26 0 Z" fill="${c}" ${O(2.6)}/><path d="M18 0 L32 -11 L30 0 L32 11 Z" fill="${c}" ${O(2.6)}/><circle cx="-15" cy="-3" r="2.6" fill="${INK}"/><path d="M-6 -7 q4 7 0 14 M2 -8 q4 8 0 16" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".5"/></g>`;
  const fishbone = (x, y, s = 1, rot = 0, c = P.cream) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><path d="M-22 0 H18" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-22 0 H18" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
    + [-12, -4, 4, 12].map((x) => `<path d="M${x} -8 Q${x + 4} 0 ${x} 8" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x} -8 Q${x + 4} 0 ${x} 8" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`).join('')
    + `<circle cx="-27" cy="0" r="7" fill="${c}" ${O(2.4)}/><circle cx="-29" cy="-2" r="1.6" fill="${INK}"/><path d="M18 0 l10 -8 v16 Z" fill="${c}" ${O(2.4)}/></g>`;
  const yarn = (x, y, r = 16, c = P.pink, tail = true) => `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="${r}" fill="${c}" ${O(3)}/><path d="M${f1(-r * 0.8)} ${f1(-r * 0.3)} Q0 ${f1(-r * 0.9)} ${f1(r * 0.8)} ${f1(-r * 0.2)} M${f1(-r * 0.7)} ${f1(r * 0.3)} Q0 ${f1(-r * 0.3)} ${f1(r * 0.75)} ${f1(r * 0.35)} M${f1(-r * 0.3)} ${f1(-r * 0.9)} Q${f1(r * 0.2)} 0 ${f1(-r * 0.1)} ${f1(r * 0.95)}" fill="none" stroke="${INK}" stroke-width="1.8" opacity=".45"/>${tail ? `<path d="M${f1(r * 0.7)} ${f1(r * 0.7)} q${r} ${f1(r * 0.4)} ${f1(r * 1.4)} ${f1(-r * 0.1)}" fill="none" stroke="${c}" stroke-width="3"/>` : ''}</g>`;
  const milk = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-12 0 V-30 Q-12 -38 -6 -42 V-50 H6 V-42 Q12 -38 12 -30 V0 Z" fill="${P.milk}" ${O(3)}/><rect x="-7" y="-55" width="14" height="6" rx="2" fill="#4ab0ff" ${O(2)}/><rect x="-12" y="-26" width="24" height="12" fill="#4ab0ff" opacity=".85"/></g>`;
  const valer = (x, y, c, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-4" y="-44" width="8" height="8" fill="${P.wood}" ${O(2.4)}/><path d="M-5 -36 V-28 C-17 -22 -17 0 0 0 C17 0 17 -22 5 -28 V-36 Z" fill="${c}" ${O(3)}/><path d="M-6 -14 q3 -5 6 -1 q3 4 6 -1" fill="none" stroke="#fff" stroke-width="2" opacity=".75"/></g>`;
  const sausage = (x, y, rot = 0, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-26" y="-9" width="52" height="18" rx="9" fill="#c4574a" ${O(2.6)}/><path d="M-16 -4 l3 3 M-4 2 l3 3 M8 -4 l3 3" stroke="#f1d0b0" stroke-width="2.4" stroke-linecap="round"/></g>`;

  function kitty(x, y, s = 1, fur = '#f2a65a', pose = 'sit', flip = false) {
    const dir = flip ? -1 : 1, st = 'rgba(70,35,15,.3)';
    let g = '';
    if (pose === 'sleep') {
      g = `<ellipse cx="0" cy="-14" rx="30" ry="16" fill="${fur}" ${O(3)}/><path d="M24 -8 C34 -4 30 6 14 4 C2 3 -14 2 -24 -4" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
        + `<circle cx="-18" cy="-20" r="12" fill="${fur}" ${O(3)}/><path d="M-28 -26 L-30 -38 L-20 -30 Z M-12 -28 L-8 -40 L-4 -27 Z" fill="${fur}" ${O(2.6)}/><path d="M-24 -20 q3 2 6 0 M-15 -21 q3 2 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
        + `<path d="M-8 -26 q10 -6 20 0" stroke="${st}" stroke-width="4" fill="none"/><text x="10" y="-38" font-family="Russo One" font-size="13" fill="#fff" stroke="${INK}" stroke-width="2.6" paint-order="stroke">z</text>`;
    } else if (pose === 'loaf') {
      g = `<path d="M-26 0 C-28 -26 26 -30 28 0 Z" fill="${fur}" ${O(3)}/><path d="M26 -4 C40 -6 40 -18 30 -20" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M26 -4 C40 -6 40 -18 30 -20" fill="none" stroke="${fur}" stroke-width="3.6" stroke-linecap="round"/>`
        + `<circle cx="-14" cy="-26" r="13" fill="${fur}" ${O(3)}/><path d="M-25 -31 L-27 -45 L-16 -36 Z M-8 -36 L-3 -48 L0 -33 Z" fill="${fur}" ${O(2.6)}/><path d="M-20 -27 q3 2 5 0 M-11 -27 q3 2 5 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M-6 -16 q8 -6 16 0" stroke="${st}" stroke-width="4" fill="none"/>`;
    } else {
      g = `<path d="M12 -4 C34 -2 36 -28 24 -36" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M12 -4 C34 -2 36 -28 24 -36" fill="none" stroke="${fur}" stroke-width="3.6" stroke-linecap="round"/>`
        + `<path d="M-16 0 C-20 -26 -12 -40 0 -40 C12 -40 20 -26 16 0 Z" fill="${fur}" ${O(3)}/><circle cx="0" cy="-48" r="14" fill="${fur}" ${O(3)}/>`
        + `<path d="M-12 -54 L-12 -68 L-3 -60 Z M12 -54 L12 -68 L3 -60 Z" fill="${fur}" ${O(2.6)}/><path d="M-10 -57 L-10 -63 L-6 -59 Z M10 -57 L10 -63 L6 -59 Z" fill="${P.pink}"/>`
        + `<circle cx="-5" cy="-49" r="2.2" fill="${INK}"/><circle cx="5" cy="-49" r="2.2" fill="${INK}"/><path d="M-2 -44 h4 l-2 2 Z" fill="${P.pink}"/><path d="M-6 -26 q6 -5 12 0 M-7 -16 q7 -5 14 0" stroke="${st}" stroke-width="4" fill="none"/>`;
    }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * dir * 100) / 100} ${s})">${g}</g>`;
  }

   
  const CH = 640;


  function Ground(o = {}) {

    const passes = Array.from({ length: o.passes || 8 }, () => new Map());
    const own = [];



    const ROWS = new Set(o.rows || [7]);
    function put(pass, x, y, svg) {
      const row = ROWS.has(pass);
      const i = row ? 0 : o.neg ? Math.floor(x / CH) : Math.max(0, Math.floor(x / CH)), j = o.neg ? Math.floor(y / CH) : Math.max(0, Math.floor(y / CH)), k = o.neg ? (j + 100) * 1000 + i + 100 : j * 100 + i, M = passes[pass];
      let c = M.get(k); if (!c) M.set(k, (c = { i, j, s: [], z: [], row, x0: x, x1: x })); c.s.push(svg); c.z.push(y);
      if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x;
    }
    const big = (pass, box, svg) => own.push({ pass, box, svg });

    const brushes = new Map();
    function brush(pass, x, y, key, d) { const i = Math.floor(x / CH), j = Math.floor(y / CH), k = pass + '|' + (j * 100 + i) + '|' + key; let b = brushes.get(k); if (!b) brushes.set(k, (b = { pass, i, j, key, d: '' })); b.d += d; }
    function layers(defs) {
      for (const b of brushes.values()) put(b.pass, b.i * CH + 1, b.j * CH + 1, b.key.replace('%D', b.d));
      const out = [];
      for (let pass = 0; pass < passes.length; pass++) {
        for (const o of own) if (o.pass === pass) out.push({ x: o.box[0], y: o.box[1], w: o.box[2] - o.box[0], h: o.box[3] - o.box[1], svg: `<g>${defs}${o.svg}</g>` });
        const list = [...passes[pass].values()].sort((a, b) => a.j - b.j || a.i - b.i);
        for (const c of list) {

          const idx = c.s.map((_, i) => i).sort((a, b) => c.z[a] - c.z[b]);
          const M = pass >= 3 ? 280 : 150;
          const x = c.row ? Math.floor(c.x0) - M : c.i * CH - M, w = c.row ? Math.ceil(c.x1 - c.x0) + M * 2 : CH + M * 2;
          out.push({ x, y: c.j * CH - M, w, h: CH + M * 2, svg: `<g>${defs}${idx.map((i) => c.s[i]).join('')}</g>` });
        }
      }
      return out;
    }
    return { put, big, brush, layers };
  }


  function wobble(pts, step, amp, r, closed = true) {
    const out = [], n = pts.length;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = pts[i], b = pts[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / step)), nx = -(b[1] - a[1]) / (L || 1), ny = (b[0] - a[0]) / (L || 1);
      for (let j = 0; j < k; j++) { const t = j / k, w = j ? (r() - 0.5) * 2 * amp : 0; out.push([a[0] + (b[0] - a[0]) * t + nx * w, a[1] + (b[1] - a[1]) * t + ny * w]); }
    }
    if (!closed) out.push(pts[n - 1]);
    return out;
  }
  const segD = (px, py, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; let t = L ? ((px - a[0]) * dx + (py - a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - a[0] - dx * t, py - a[1] - dy * t); };

  function stones(G, x0, y0, x1, y1, r) {
    const RH = 34;
    for (let y = y0 + 4, row = 0; y < y1 - 10; y += RH, row++) {
      let x = x0 + 2 - (row % 2 ? 22 : 0);
      while (x < x1 - 4) {
        const w = 40 + r() * 26, sx = Math.max(x0 + 3, x), ex = Math.min(x1 - 3, x + w - 5); if (ex - sx < 12) { x += w; continue; }
        const h = RH - 6 - r() * 3, c = r(), key = c < 0.55 ? 'a' : c < 0.85 ? 'b' : 'c';
        const d = `M${f1(sx + 6)} ${f1(y + 1)} H${f1(ex - 6)} Q${f1(ex)} ${f1(y + 1)} ${f1(ex)} ${f1(y + 7)} V${f1(y + h - 6)} Q${f1(ex)} ${f1(y + h)} ${f1(ex - 6)} ${f1(y + h)} H${f1(sx + 6)} Q${f1(sx)} ${f1(y + h)} ${f1(sx)} ${f1(y + h - 6)} V${f1(y + 7)} Q${f1(sx)} ${f1(y + 1)} ${f1(sx + 6)} ${f1(y + 1)} Z `;
        const col = key === 'a' ? P.pave : key === 'b' ? '#ebc59b' : '#d6a878';
        G.brush(1, sx, y, `<path d="%D" fill="${col}" stroke="${P.mortar}" stroke-width="2.4" stroke-linejoin="round"/>`, d);
        if (r() < 0.4) G.brush(1, sx, y, `<path d="%D" fill="none" stroke="${P.paveL}" stroke-width="3" stroke-linecap="round" opacity=".8"/>`, `M${f1(sx + 7)} ${f1(y + 8)} Q${f1(sx + 8)} ${f1(y + 4)} ${f1(sx + Math.min(20, (ex - sx) * 0.5))} ${f1(y + 4)} `);
        x += w;
      }
    }
  }

   
  function stair(S, R = RAIL) {
    const { x0, x1, y0, y1 } = S, n = 10, sh = (y1 - y0) / n;
    let s = `<rect x="${x0 + 6}" y="${y1 - 6}" width="${x1 - x0 - 12}" height="22" rx="8" fill="${INK}" opacity=".22"/>`;
    s += `<rect x="${x0 + R - 4}" y="${y0}" width="${x1 - x0 - 2 * R + 8}" height="${y1 - y0}" fill="#a88f82" ${O(4)}/>`;
    for (let i = 0; i < n; i++) {
      const y = y0 + i * sh;
      s += `<rect x="${x0 + R}" y="${f1(y + 2)}" width="${x1 - x0 - 2 * R}" height="${f1(sh * 0.62)}" fill="${i % 2 ? '#e8d4c0' : '#f0dfcc'}" stroke="${INK}" stroke-width="2.2" stroke-opacity=".7"/><rect x="${x0 + R}" y="${f1(y + 2 + sh * 0.62)}" width="${x1 - x0 - 2 * R}" height="${f1(sh * 0.38 - 2)}" fill="${P.rockD}"/>`;
    }

    for (const x of [x0, x1 - R]) {
      s += `<rect x="${x}" y="${y0 - 6}" width="${R}" height="${y1 - y0 + 6}" rx="6" fill="${P.rockL}" ${O(3.5)}/><path d="M${x + 4} ${y0 + 4} V${y1 - 10}" stroke="#fff" stroke-width="2.4" opacity=".5"/>`;
      for (const y of [y0 - 6, y1 - 16]) s += `<rect x="${x - 5}" y="${y - 14}" width="${R + 10}" height="22" rx="5" fill="${P.rock}" ${O(3)}/>`;
    }
    s += paw((x0 + x1) / 2, y1 - 14, 0.9, P.rockD, 0.5);
    return s;
  }
  function ramp(S) {
    const { x0, x1, y0, y1 } = S;
    let s = `<rect x="${x0 + 6}" y="${y1 - 6}" width="${x1 - x0 - 12}" height="22" rx="8" fill="${INK}" opacity=".22"/>`;
    s += `<rect x="${x0 + 12}" y="${y0}" width="${x1 - x0 - 24}" height="${y1 - y0}" rx="6" fill="${P.wood}" ${O(4)}/>`;
    let pl = ''; for (let y = y0 + 16; y < y1 - 4; y += 18) pl += `M${x0 + 16} ${y} H${x1 - 16} `;
    s += `<path d="${pl}" stroke="${P.woodD}" stroke-width="2.6"/>`;

    for (const x of [x0 + 4, x1 - 22]) { s += `<rect x="${x}" y="${y0 - 10}" width="18" height="${y1 - y0 + 14}" rx="5" fill="${P.woodL}" ${O(3.5)}/>`; for (let y = y0; y < y1; y += 46) s += `<rect x="${x - 4}" y="${y}" width="26" height="12" rx="3" fill="${P.woodD}" ${O(2.4)}/>`; }
    return s;
  }

   

  function tree(x, y, s = 1, seed = 1, kind = 'tree') {
    const r = rng(seed * 7919 + 13), R = 64 * s, cy = y - 92 * s;
    const C = kind === 'blossom' ? [P.blossomD, P.blossom, P.blossomL] : kind === 'dark' ? ['#2c5532', '#3b6b40', '#4f8752'] : [P.leafD, P.leaf, P.leafL];
    let g = `<path d="M${f1(x - 9 * s)} ${f1(y)} C${f1(x - 6 * s)} ${f1(y - 30 * s)} ${f1(x - 7 * s)} ${f1(y - 60 * s)} ${f1(x - 3 * s)} ${f1(cy + 20 * s)} H${f1(x + 4 * s)} C${f1(x + 7 * s)} ${f1(y - 60 * s)} ${f1(x + 6 * s)} ${f1(y - 30 * s)} ${f1(x + 9 * s)} ${f1(y)} Q${f1(x + 16 * s)} ${f1(y + 2)} ${f1(x + 18 * s)} ${f1(y + 3)} H${f1(x - 18 * s)} Q${f1(x - 16 * s)} ${f1(y + 2)} ${f1(x - 9 * s)} ${f1(y)} Z" fill="${P.woodD}" ${O(3)}/>`;
    g += `<path d="${blob(x, cy + 6 * s, R * 1.02, R * 0.86, r, 10, 0.12)}" fill="${C[0]}" ${O(3.5)}/>`;
    g += `<path d="${blob(x - R * 0.28, cy - R * 0.12, R * 0.62, R * 0.55, r, 8, 0.12)}" fill="${C[1]}"/><path d="${blob(x + R * 0.3, cy - R * 0.02, R * 0.56, R * 0.5, r, 8, 0.12)}" fill="${C[1]}"/>`;
    g += `<path d="M${f1(x - R * 0.62)} ${f1(cy - R * 0.2)} Q${f1(x - R * 0.42)} ${f1(cy - R * 0.68)} ${f1(x + R * 0.02)} ${f1(cy - R * 0.62)}" fill="none" stroke="${C[2]}" stroke-width="${f1(9 * s)}" stroke-linecap="round" opacity=".85"/>`;
    if (kind === 'blossom') for (let i = 0; i < 7; i++) g += `<circle cx="${f1(x + (r() - 0.5) * R * 1.4)}" cy="${f1(cy + (r() - 0.5) * R)}" r="${f1(4 * s)}" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`;
    else if (kind !== 'dark' && r() < 0.35) for (let i = 0; i < 3; i++) g += `<circle cx="${f1(x + (r() - 0.5) * R)}" cy="${f1(cy + (r() - 0.2) * R * 0.6)}" r="${f1(6 * s)}" fill="#e8455c" stroke="${INK}" stroke-width="2"/>`;
    return g;
  }

  function pine(x, y, s = 1, seed = 1, dark) {
    const r = rng(seed * 6007 + 3), C = dark ? ['#244a2c', '#2f5e38', '#3f7448'] : ['#2f6438', '#3f7a46', '#5a9a5a'];
    let g = `<rect x="${f1(x - 7 * s)}" y="${f1(y - 34 * s)}" width="${f1(14 * s)}" height="${f1(36 * s)}" rx="3" fill="${P.woodD}" ${O(3)}/>`;
    for (let k = 0; k < 3; k++) {
      const w = (66 - k * 14) * s, b = y - (24 + k * 46) * s, t = b - (70 - k * 8) * s, j = (r() - 0.5) * 6 * s;
      g += `<path d="M${f1(x - w)} ${f1(b)} Q${f1(x - w * 0.5)} ${f1(b + 10 * s)} ${f1(x)} ${f1(b + 4 * s)} Q${f1(x + w * 0.5)} ${f1(b + 10 * s)} ${f1(x + w)} ${f1(b)} L${f1(x + 6 * s + j)} ${f1(t + 6 * s)} Q${f1(x)} ${f1(t - 4 * s)} ${f1(x - 6 * s + j)} ${f1(t + 6 * s)} Z" fill="${C[k === 2 ? 1 : 0]}" ${O(3.2)}/>`;
      g += `<path d="M${f1(x - w * 0.62)} ${f1(b - 6 * s)} L${f1(x - 4 * s)} ${f1(t + 14 * s)}" stroke="${C[2]}" stroke-width="${f1(6 * s)}" stroke-linecap="round" opacity=".8"/>`;
    }
    return g;
  }
  

  const BERRY = '#e8402e', BERRYD = '#5a1414';
  function berryD(x, y, s = 1) { let d = ''; for (const [dx, dy] of [[0, 0], [-7, 4], [7, 4], [-4, 10], [4, 10], [0, 16]]) { const cx = x + dx * s, cy = y + dy * s, rr2 = 3.8 * s; d += `M${f1(cx - rr2)} ${f1(cy)}a${f1(rr2)} ${f1(rr2)} 0 1 0 ${f1(2 * rr2)} 0a${f1(rr2)} ${f1(rr2)} 0 1 0 ${f1(-2 * rr2)} 0`; } return d; }
   
  const berries = (pts) => `<path d="${pts.map(([x, y, s]) => berryD(x, y, s || 1)).join('')}" fill="${BERRY}" stroke="${BERRYD}" stroke-width="1.6"/>`;
  function rowanTree(x, y, s = 1, seed = 1, ring = false) {
    const r = rng(seed * 4513 + 29), R = 58 * s, cy = y - 100 * s, C = ['#3f7434', '#5a9440', '#7eb552'];
    let g = '';
    const bx = 76 * s, by = 22 * s;
    if (ring) g += `<path d="M${f1(x - bx)} ${f1(y - 12)} A${f1(bx)} ${f1(by)} 0 0 1 ${f1(x + bx)} ${f1(y - 12)}" fill="none" stroke="${INK}" stroke-width="17"/><path d="M${f1(x - bx)} ${f1(y - 12)} A${f1(bx)} ${f1(by)} 0 0 1 ${f1(x + bx)} ${f1(y - 12)}" fill="none" stroke="${P.woodD}" stroke-width="10"/>`;
    g += `<path d="M${f1(x - 10 * s)} ${f1(y)} C${f1(x - 8 * s)} ${f1(y - 34 * s)} ${f1(x - 12 * s)} ${f1(y - 66 * s)} ${f1(x - 4 * s)} ${f1(cy + 26 * s)} H${f1(x + 5 * s)} C${f1(x + 6 * s)} ${f1(y - 62 * s)} ${f1(x + 7 * s)} ${f1(y - 34 * s)} ${f1(x + 10 * s)} ${f1(y)} Q${f1(x + 17 * s)} ${f1(y + 2)} ${f1(x + 19 * s)} ${f1(y + 3)} H${f1(x - 19 * s)} Q${f1(x - 17 * s)} ${f1(y + 2)} ${f1(x - 10 * s)} ${f1(y)} Z" fill="#6a4a34" ${O(3)}/>`;
    if (ring) {
      g += `<path d="M${f1(x - 9 * s)} ${f1(y - 40 * s)} q9 5 18 0 M${f1(x - 8 * s)} ${f1(y - 52 * s)} q8 5 16 0" stroke="${BERRY}" stroke-width="${f1(5 * s)}" fill="none"/><path d="M${f1(x + 6 * s)} ${f1(y - 44 * s)} l${f1(10 * s)} ${f1(22 * s)} M${f1(x + 6 * s)} ${f1(y - 44 * s)} l${f1(2 * s)} ${f1(26 * s)}" stroke="${BERRY}" stroke-width="${f1(4 * s)}" stroke-linecap="round"/>`;
      g += `<path d="M${f1(x - bx)} ${f1(y - 12)} A${f1(bx)} ${f1(by)} 0 0 0 ${f1(x + bx)} ${f1(y - 12)}" fill="none" stroke="${INK}" stroke-width="19"/><path d="M${f1(x - bx)} ${f1(y - 12)} A${f1(bx)} ${f1(by)} 0 0 0 ${f1(x + bx)} ${f1(y - 12)}" fill="none" stroke="${P.woodL}" stroke-width="12"/>`
        + `<path d="M${f1(x - bx * 0.7)} ${f1(y - 2)} v12 M${f1(x)} ${f1(y + by - 8)} v12 M${f1(x + bx * 0.7)} ${f1(y - 2)} v12" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
    }
    g += `<path d="${blob(x, cy + 8 * s, R * 1.06, R * 0.84, r, 11, 0.16)}" fill="${C[0]}" ${O(3.5)}/>`;
    g += `<path d="${blob(x - R * 0.34, cy - R * 0.1, R * 0.56, R * 0.48, r, 9, 0.18)} ${blob(x + R * 0.32, cy - R * 0.04, R * 0.52, R * 0.46, r, 9, 0.18)} ${blob(x, cy - R * 0.42, R * 0.46, R * 0.36, r, 8, 0.18)}" fill="${C[1]}"/>`;
    g += `<path d="M${f1(x - R * 0.66)} ${f1(cy - R * 0.16)} Q${f1(x - R * 0.42)} ${f1(cy - R * 0.7)} ${f1(x + R * 0.06)} ${f1(cy - R * 0.68)}" fill="none" stroke="${C[2]}" stroke-width="${f1(8 * s)}" stroke-linecap="round" opacity=".85"/>`;
    const pts = []; for (let i = 0; i < 7; i++) pts.push([x + (r() - 0.5) * R * 1.5, cy - R * 0.5 + r() * R * 0.95, s * (0.85 + r() * 0.3)]);
    return g + berries(pts);
  }

  function hivesSvg(x, y, n = 3) {
    let s = `<rect x="${x - n * 27 - 8}" y="${y - 12}" width="${n * 54 + 16}" height="12" rx="4" fill="${P.woodD}" ${O(3)}/>`, b = '';
    for (let i = 0; i < n; i++) {
      const hx = x - (n - 1) * 27 + i * 54, h = 58 + ((i * 7) % 3) * 6;
      s += `<rect x="${hx - 19}" y="${y - 12 - h}" width="38" height="${h}" rx="9" fill="#b4834a" ${O(3.4)}/><path d="M${hx - 19} ${y - 12 - h * 0.62} h38 M${hx - 19} ${y - 12 - h * 0.3} h38" stroke="#7a5230" stroke-width="3"/>`
        + `<path d="M${hx - 27} ${y - 10 - h} Q${hx} ${y - 34 - h} ${hx + 27} ${y - 10 - h} Z" fill="#f0c464" ${O(3)}/><circle cx="${hx}" cy="${y - 12 - h * 0.46}" r="5" fill="${INK}"/>`;
      b += `M${hx + 14} ${y - 40 - h} a2.6 2.6 0 1 0 0.1 0 M${hx - 12} ${y - 48 - h} a2.6 2.6 0 1 0 0.1 0 `;
    }
    return s + `<path d="${b}" fill="${P.gold}" stroke="${INK}" stroke-width="1.6"/>`;
  }

  function racksSvg(x, y) {
    const fr = `M${x - 60} ${y} V${y - 100} M${x + 60} ${y} V${y - 100} M${x - 68} ${y - 96} H${x + 68} M${x - 68} ${y - 58} H${x + 68}`;
    let th = ''; const pts = [];
    for (let i = 0; i < 6; i++) { const bx = x - 50 + i * 20, by = y - (i % 2 ? 58 : 96); th += `M${bx} ${by} v10 `; pts.push([bx, by + 16, 0.85]); }
    return `<path d="${fr}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${fr}" stroke="${P.woodL}" stroke-width="5" stroke-linecap="round"/><path d="${th}" stroke="${INK}" stroke-width="2"/>` + berries(pts);
  }
  

  function palisade(x0, x1, top, B, seed = 1) {
    const r = rng(seed * 97 + 11); let d = '', sh = '';
    for (let x = x0; x < x1 - 4; x += 24) { const w = Math.min(22, x1 - x), t = top + Math.round(r() * 14); d += `M${x} ${B} V${t} L${f1(x + w / 2)} ${t - 14} L${x + w} ${t} V${B} Z `; sh += `M${f1(x + w * 0.6)} ${B - 2} V${t + 2} L${f1(x + w - 2)} ${t + 2} V${B - 2} Z `; }
    const band = `M${x0} ${B - 34} H${x1} M${x0} ${top + 30} H${x1}`;
    return `<rect x="${x0}" y="${B - 6}" width="${x1 - x0}" height="16" rx="6" fill="${INK}" opacity=".22"/><path d="${d}" fill="${P.wood}" ${O(3)}/><path d="${sh}" fill="${P.woodD}" opacity=".55"/>`
      + `<path d="${band}" stroke="${INK}" stroke-width="9"/><path d="${band}" stroke="#8a6a44" stroke-width="5"/>`;
  }

  function watchtower(x, B, roofPal) {
    const x0 = x - 46, x1 = x + 46, top = B - 170, pl = top + 36;
    let s = `<path d="M${x0 + 8} ${B} L${x0 + 14} ${pl} M${x1 - 8} ${B} L${x1 - 14} ${pl} M${x0 + 10} ${B - 20} L${x1 - 12} ${pl + 10} M${x1 - 10} ${B - 20} L${x0 + 12} ${pl + 10}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`
      + `<path d="M${x0 + 8} ${B} L${x0 + 14} ${pl} M${x1 - 8} ${B} L${x1 - 14} ${pl} M${x0 + 10} ${B - 20} L${x1 - 12} ${pl + 10} M${x1 - 10} ${B - 20} L${x0 + 12} ${pl + 10}" stroke="${P.wood}" stroke-width="6" stroke-linecap="round"/>`;
    s += `<rect x="${x0 - 6}" y="${pl}" width="${x1 - x0 + 12}" height="16" rx="4" fill="${P.woodD}" ${O(3)}/><rect x="${x0 - 4}" y="${top}" width="${x1 - x0 + 8}" height="${pl - top}" fill="${P.woodL}" ${O(3)}/>`;
    let pk = ''; for (let px = x0 + 6; px < x1; px += 14) pk += `M${px} ${top + 4} V${pl - 2} `;
    s += `<path d="${pk}" stroke="${P.woodD}" stroke-width="3"/>` + roofV(x0 - 16, x1 + 16, top - 2, top - 52, 14, 10, roofPal || ROOF.red, x | 0, 24, 14, { ridge: 8 });
    return s;
  }
  const bush = (x, y, s = 1, seed = 1, c = [P.leafD, P.leaf, P.leafL]) => { const r = rng(seed * 313 + 7); return `<path d="${blob(x, y - 20 * s, 40 * s, 24 * s, r, 8, 0.18)}" fill="${c[0]}" ${O(3)}/><path d="${blob(x - 10 * s, y - 26 * s, 22 * s, 13 * s, r, 7, 0.15)}" fill="${c[1]}"/><path d="M${f1(x - 26 * s)} ${f1(y - 30 * s)} q14 -12 30 -8" stroke="${c[2]}" stroke-width="${f1(6 * s)}" fill="none" stroke-linecap="round"/>${r() < 0.5 ? `<circle cx="${f1(x + 12 * s)}" cy="${f1(y - 26 * s)}" r="${f1(5 * s)}" fill="${['#fff4e0', '#ffd0dc', '#ffe27a'][Math.floor(r() * 3)]}" stroke="${INK}" stroke-width="1.6"/>` : ''}`; };


  function minePortal(cx, B) {
    const T = B - 148, x0 = cx - 104, x1 = cx + 104;
    let s = `<defs><linearGradient id="fcMineIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0709"/><stop offset=".7" stop-color="#1c1214"/><stop offset="1" stop-color="#3a2826"/></linearGradient>${glowDef('fcMineG', '#ffcf6a', 0.9)}</defs>`;
    s += `<g data-ol="mine">`;
    s += `<path d="M${x0} ${B} V${T + 40} Q${x0} ${T} ${cx} ${T - 6} Q${x1} ${T} ${x1} ${T + 40} V${B} Z" fill="url(#fcMineIn)" ${O(5)}/>`;

    s += `<path d="M${x0 + 4} ${B - 2} V${T + 40} Q${x0 + 4} ${T + 4} ${cx} ${T - 2} L${cx} ${T + 52} Q${x0 + 60} ${T + 56} ${x0 + 60} ${T + 84} V${B - 30} Z" fill="#4a3428"/><path d="M${x1 - 4} ${B - 2} V${T + 40} Q${x1 - 4} ${T + 4} ${cx} ${T - 2} L${cx} ${T + 52} Q${x1 - 60} ${T + 56} ${x1 - 60} ${T + 84} V${B - 30} Z" fill="#2e2020"/>`;
    s += `<path d="M${x0 + 18} ${B - 6} L${x0 + 18} ${T + 46} M${x0 + 34} ${B - 14} V${T + 58} M${x0 + 48} ${B - 22} V${T + 70} M${x1 - 18} ${B - 6} V${T + 46} M${x1 - 34} ${B - 14} V${T + 58} M${x1 - 48} ${B - 22} V${T + 70}" stroke="${INK}" stroke-width="2.4" opacity=".5"/>`;
    s += `<path d="${poly([[x0 + 4, B - 2], [x1 - 4, B - 2], [x1 - 60, B - 30], [x0 + 60, B - 30]])}" fill="#3e2c24"/><path d="M${x0 + 60} ${B - 30} V${T + 84} Q${cx} ${T + 50} ${x1 - 60} ${T + 84} V${B - 30} Z" fill="#0d0709"/>`;

    s += `<path d="M${x0 + 30} ${B - 6} V${T + 56} Q${cx} ${T + 22} ${x1 - 30} ${T + 56} V${B - 6}" fill="none" stroke="#3a2826" stroke-width="10" opacity=".8"/><path d="M${x0 + 56} ${B - 16} V${T + 76} Q${cx} ${T + 50} ${x1 - 56} ${T + 76} V${B - 16}" fill="none" stroke="#2a1c1c" stroke-width="7" opacity=".8"/>`;
    s += `<path d="M${cx - 16} ${B + 4} L${cx - 6} ${T + 90} M${cx + 16} ${B + 4} L${cx + 6} ${T + 90}" stroke="#8a8e9e" stroke-width="4" opacity=".75"/><path d="M${cx - 22} ${B - 4} h44 M${cx - 18} ${B - 30} h36 M${cx - 14} ${B - 54} h28 M${cx - 11} ${B - 74} h22" stroke="#4a3426" stroke-width="5" opacity=".9"/>`;
    s += `<circle cx="${cx + 4}" cy="${T + 92}" r="4" fill="#ffd76a" opacity=".85"/>`;

    for (const x of [x0 - 14, x1 - 4]) s += `<path d="${poly([[x + 22, B + 2], [x + 32, B - 5], [x + 32, T - 17], [x + 22, T - 10]])}" fill="${P.woodD}" ${O(3.5)}/><rect x="${x}" y="${T - 10}" width="22" height="${B - T + 12}" rx="5" fill="${P.wood}" ${O(4)}/><path d="M${x + 6} ${T + 4} V${B - 6}" stroke="${P.woodL}" stroke-width="3" opacity=".8"/><path d="M${x + 4} ${T + 40} h14 M${x + 4} ${T + 90} h14" stroke="${P.woodD}" stroke-width="2.4"/>`;
    s += `<path d="M${x0 + 8} ${T + 32} L${x0 + 46} ${T - 6} M${x1 - 8} ${T + 32} L${x1 - 46} ${T - 6}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${x0 + 8} ${T + 32} L${x0 + 46} ${T - 6} M${x1 - 8} ${T + 32} L${x1 - 46} ${T - 6}" stroke="${P.woodL}" stroke-width="9" stroke-linecap="round"/>`;
    s += `<rect x="${x0 - 40}" y="${T - 34}" width="${x1 - x0 + 80}" height="28" rx="12" fill="${P.wood}" ${O(4)}/><circle cx="${x0 - 28}" cy="${T - 20}" r="10" fill="${P.woodL}" ${O(3)}/><circle cx="${x1 + 28}" cy="${T - 20}" r="10" fill="${P.woodL}" ${O(3)}/><path d="M${x0 - 31} ${T - 20} a3 3 0 1 0 6 0 M${x1 + 25} ${T - 20} a3 3 0 1 0 6 0" fill="none" stroke="${P.woodD}" stroke-width="2"/>`;

    s += `<path d="${poly([[x1 + 56, T - 34], [x1 + 72, T - 46], [x1 + 44, T - 82], [x1 + 30, T - 72]])}" fill="${dk(P.woodD, 0.3)}" ${O(4)}/><path d="M${x0 - 56} ${T - 34} L${x0 - 30} ${T - 72} H${x1 + 30} L${x1 + 56} ${T - 34} Z" fill="${P.woodD}" ${O(4)}/><path d="M${x0 - 56} ${T - 34} H${x1 + 56} V${T - 26} H${x0 - 56} Z" fill="${dk(P.woodD, 0.25)}" ${O(3)}/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${f1(x0 - 40 + i * 32)} ${T - 36} L${f1(x0 - 22 + i * 30)} ${T - 70}" stroke="${INK}" stroke-width="2" opacity=".5"/>`).join('');
    s += `<path d="M${x0 - 36} ${T - 72} q30 -16 60 -4 q40 -14 80 -2 q40 -14 70 2 q30 -10 62 4" fill="${P.platD}" ${O(3)}/>`;

    s += `<rect x="${cx - 90}" y="${T - 22}" width="180" height="42" rx="10" fill="${P.plumD}" ${O(4)}/><rect x="${cx - 82}" y="${T - 15}" width="164" height="28" rx="6" fill="none" stroke="${P.gold}" stroke-width="2.4"/>` + txt(cx + 10, T + 10, 'ШАХТА', 25);
    s += `<g transform="translate(${cx - 66} ${T - 2}) scale(.55)"><path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="${P.woodL}" stroke-width="5" stroke-linecap="round"/><path d="M-28 -12 Q-20 -28 -4 -26 M28 -12 Q20 -28 4 -26" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-28 -12 Q-20 -28 -4 -26 M28 -12 Q20 -28 4 -26" fill="none" stroke="#c9ccd6" stroke-width="5" stroke-linecap="round"/></g>`;
    s += `</g>`;

    for (const [x, d] of [[x0 - 40, -1], [x1 + 40, 1]]) s += `<circle cx="${x}" cy="${T + 46}" r="62" fill="url(#fcMineG)" opacity=".8"/><path d="M${x - d * 30} ${T + 6} h${d * 30} v14" fill="none" stroke="${P.metal}" stroke-width="5" stroke-linecap="round"/><path d="M${x - 12} ${T + 22} h24 l-4 34 h-16 Z" fill="${P.glass}" ${O(3.5)}/><path d="M${x - 16} ${T + 22} h32 l-6 -10 h-20 Z" fill="${P.metal}" ${O(3)}/><path d="M${x - 8} ${T + 56} h16" stroke="${P.metal}" stroke-width="5" stroke-linecap="round"/>`;

    s += `<g transform="translate(${x0 - 30} ${B})"><path d="M0 0 L22 -64" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M0 0 L22 -64" stroke="${P.woodL}" stroke-width="4" stroke-linecap="round"/><path d="M4 -64 Q22 -80 44 -70" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M4 -64 Q22 -80 44 -70" fill="none" stroke="#c9ccd6" stroke-width="4.5" stroke-linecap="round"/></g>`;
    s += `<g transform="translate(${x1 + 26} ${B + 2})"><rect x="-26" y="-40" width="52" height="40" rx="4" fill="${P.wood}" ${O(3.5)}/><path d="M-26 -20 H26 M-10 -40 V0 M10 -40 V0" stroke="${P.woodD}" stroke-width="2.4"/>${kitty(0, -40, 0.62, '#9aa3ad', 'sit')}<path d="M-10 -96 Q0 -112 10 -96 Z" fill="${P.gold}" ${O(2.4)}/><circle cx="0" cy="-102" r="3.4" fill="#fff8c0" ${O(1.6)}/></g>`;
    return s;
  }


  function signpost(x, y, to) {
    let s = `<ellipse cx="${x + 6}" cy="${y}" rx="20" ry="6" fill="${INK}" opacity=".25"/><rect x="${x - 6}" y="${y - 110}" width="12" height="112" rx="4" fill="${P.wood}" ${O(3)}/>`;
    to.forEach(([t, dir], i) => {
      const y0 = y - 104 + i * 30, L = Math.max(64, t.length * 11 + 26), right = /E|S/.test(dir), x0 = right ? x - 10 : x + 10 - L;
      const d = right ? `M${x0} ${y0} H${x0 + L} L${x0 + L + 14} ${y0 + 12} L${x0 + L} ${y0 + 24} H${x0} Z` : `M${x0} ${y0} H${x0 + L} V${y0 + 24} H${x0} L${x0 - 14} ${y0 + 12} Z`;
      s += `<path d="${d}" fill="${['#e8c088', '#f0d0a0', '#dcb07a'][i % 3]}" ${O(3)}/><text x="${x0 + L / 2}" y="${y0 + 18}" text-anchor="middle" font-family="Russo One" font-size="13" fill="${INK}">${esc(t)}</text>`;
    });
    return s + paw(x, y - 118, 0.9, P.pink, 0.95);
  }

   

  function scales(d, x0, y0, x1, y1, c, cD, cL, sw = 34, sh = 20, seed = 1) {
    const id = uid('fcR'), r = rng(seed * 97 + 5);
    let rows = '', hi = '';
    for (let y = y0 - sh, k = 0; y < y1 + sh; y += sh, k++) for (let x = x0 - sw - (k % 2 ? sw / 2 : 0); x < x1 + sw; x += sw) { rows += `M${f1(x)} ${f1(y)} a${sw / 2} ${sh} 0 0 0 ${sw} 0 `; if (r() < 0.13) hi += `M${f1(x + 3)} ${f1(y + 1)} a${sw / 2 - 3} ${sh - 5} 0 0 0 ${sw - 6} 0 Z `; }
    return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${c}"/><g clip-path="url(#${id})"><path d="${hi}" fill="${cL}" opacity=".7"/><path d="${rows}" fill="none" stroke="${cD}" stroke-width="2.6"/><rect x="${x0 - 40}" y="${y1 - 22}" width="${x1 - x0 + 80}" height="30" fill="${INK}" opacity=".14"/><rect x="${x0 - 40}" y="${y0 - 10}" width="${x1 - x0 + 80}" height="18" fill="#fff" opacity=".12"/></g><path d="${d}" fill="none" ${O(5)}/>`;
  }
  const ROOF = { plum: [P.plum, P.plumD, P.plumL], teal: ['#3f8f8a', '#2a6662', '#62b0a8'], red: ['#c8664a', '#8f3f2c', '#e08a68'], blue: ['#4a6fb0', '#2f4c84', '#7a9ad6'], mustard: ['#d9a23a', '#a0741e', '#f0c464'], pink: ['#e07a9a', '#b0506e', '#f4a8c0'], night: ['#3b3480', '#262060', '#5a50a8'] };
  function win(x, y, w, h, o = {}) {
    const arch = o.arch, rad = Math.min(w / 2, 10), fr = o.frame || P.wood;
    const d = arch ? `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z` : rr(x, y, x + w, y + h, Math.min(5, rad));
    const di = arch ? `M${x + 5} ${y + h - 5} V${y + w / 2} A${w / 2 - 5} ${w / 2 - 5} 0 0 1 ${x + w - 5} ${y + w / 2} V${y + h - 5} Z` : rr(x + 5, y + 5, x + w - 5, y + h - 5, 3);
    let s = '';
    if (o.shut) s += `<rect x="${x - 15}" y="${y}" width="14" height="${h}" rx="3" fill="${o.shut}" ${O(3)}/><rect x="${x + w + 1}" y="${y}" width="14" height="${h}" rx="3" fill="${o.shut}" ${O(3)}/><path d="M${x - 11} ${y + 8} h6 M${x - 11} ${y + h - 10} h6 M${x + w + 5} ${y + 8} h6 M${x + w + 5} ${y + h - 10} h6" stroke="${INK}" stroke-width="2" opacity=".4"/>`;
    s += `<path d="${d}" fill="${fr}" ${O(3)}/><path d="${di}" fill="${o.dark ? '#3a2a3a' : P.glass}"/>`;
    if (!o.dark) s += `<path d="${di}" fill="#ff9a3a" opacity=".22"/><path d="M${x + 10} ${y + 12} l8 -4 M${x + 10} ${y + 20} l12 -6" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>`;
    s += `<path d="M${x + w / 2} ${y + 5} V${y + h - 5} M${x + 5} ${y + h * 0.5} H${x + w - 5}" stroke="${fr}" stroke-width="3.5"/>`;

    s += arch ? `<path d="M${x + 6} ${y + h - 5} V${y + w / 2} A${w / 2 - 6} ${w / 2 - 6} 0 0 1 ${x + w - 8} ${y + w / 2 - 2}" fill="none" stroke="${INK}" stroke-width="6" opacity=".26"/>` : `<path d="M${x + 7} ${y + h - 5} V${y + 7} H${x + w - 5}" fill="none" stroke="${INK}" stroke-width="6" opacity=".26"/>`;
    if (!o.box && !o.noSill) s += `<rect x="${x - 6}" y="${y + h - 3}" width="${w + 12}" height="9" rx="3" fill="${lt(fr, 0.2)}" ${O(2.6)}/><path d="M${x - 2} ${y + h + 9} H${x + w + 4}" stroke="${INK}" stroke-width="4" opacity=".18" stroke-linecap="round"/>`;
    if (o.cat) s += `<g transform="translate(${x + w / 2} ${y + h - 5}) scale(.42)"><path d="M-16 0 C-20 -26 -12 -40 0 -40 C12 -40 20 -26 16 0 Z M-12 -48 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M-12 -54 L-12 -68 L-3 -60 Z M12 -54 L12 -68 L3 -60 Z" fill="#3a2a3a"/></g>`;
    if (o.box) { const bx = x - 8, by = y + h + 2; s += `<rect x="${bx}" y="${by}" width="${w + 16}" height="14" rx="4" fill="${o.box}" ${O(3)}/>` + Array.from({ length: Math.max(2, Math.round(w / 14)) }, (_, i) => `<circle cx="${f1(bx + 8 + i * (w / Math.max(1, Math.round(w / 14) - 1)))}" cy="${by - 2}" r="5.5" fill="${['#ff8fa3', '#ffe27a', '#fff4e0', '#c9b6ff'][i % 4]}" stroke="${INK}" stroke-width="1.8"/>`).join('') + `<path d="M${bx + 4} ${by + 2} q${w / 2} -10 ${w + 8} 0" stroke="${P.leafD}" stroke-width="3" fill="none" opacity=".8"/>`; }
    return s;
  }
  function door(cx, base, w, h, c = P.woodD, o = {}) {
    const x0 = cx - w / 2, x1 = cx + w / 2, top = base - h;
    let s = `<path d="M${x0 - 7} ${base} V${top + w / 2} A${w / 2 + 7} ${w / 2 + 7} 0 0 1 ${x1 + 7} ${top + w / 2} V${base} Z" fill="${o.frame || P.rockL}" ${O(3.5)}/>`;
    s += `<path d="M${x0} ${base} V${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x1} ${top + w / 2} V${base} Z" fill="${c}" ${O(3.5)}/>`;
    let pl = ''; for (let x = x0 + w / 4; x < x1 - 2; x += w / 4) pl += `M${f1(x)} ${f1(top + 6)} V${base - 3} `;
    s += `<path d="${pl}" stroke="${INK}" stroke-width="2" opacity=".35"/>`;

    s += `<path d="M${x0 + 5} ${base - 2} V${top + w / 2} A${w / 2 - 5} ${w / 2 - 5} 0 0 1 ${x1 - 8} ${top + w / 2 - 4}" fill="none" stroke="${INK}" stroke-width="8" opacity=".3"/>`;
    if (o.double) s += `<path d="M${cx} ${top + 2} V${base}" stroke="${INK}" stroke-width="3"/><circle cx="${cx - 7}" cy="${base - h * 0.42}" r="4" fill="${P.gold}" ${O(1.8)}/><circle cx="${cx + 7}" cy="${base - h * 0.42}" r="4" fill="${P.gold}" ${O(1.8)}/>`;
    else s += `<circle cx="${x1 - 10}" cy="${base - h * 0.42}" r="4.5" fill="${P.gold}" ${O(1.8)}/>`;
    if (o.mat !== false) s += `<rect x="${cx - w / 2 - 6}" y="${base + 2}" width="${w + 12}" height="13" rx="6" fill="${o.mat || '#c0504a'}" ${O(2.6)}/>` + paw(cx, base + 9, 0.55, P.gold, 0.9);
    return s;
  }

  function board(cx, cy, text, size = 24, o = {}) {
    const w = o.w || Math.max(90, text.length * size * 0.66 + 34), h = o.h || size + 22, x0 = cx - w / 2, y0 = cy - h / 2, bg = o.bg || P.plumD;
    let s = '';
    if (o.ears !== false) s += `<path d="M${x0 + 8} ${y0 + 4} L${x0 + 14} ${y0 - 18} L${x0 + 34} ${y0 + 2} Z M${x0 + w - 8} ${y0 + 4} L${x0 + w - 14} ${y0 - 18} L${x0 + w - 34} ${y0 + 2} Z" fill="${bg}" ${O(3.2)}/><path d="M${x0 + 14} ${y0 + 1} L${x0 + 17} ${y0 - 10} L${x0 + 27} ${y0 + 1} Z M${x0 + w - 14} ${y0 + 1} L${x0 + w - 17} ${y0 - 10} L${x0 + w - 27} ${y0 + 1} Z" fill="${P.pink}"/>`;
    s += `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(h)}" rx="10" fill="${bg}" ${O(4)}/><rect x="${f1(x0 + 6)}" y="${f1(y0 + 6)}" width="${f1(w - 12)}" height="${f1(h - 12)}" rx="6" fill="none" stroke="${o.rim || P.gold}" stroke-width="2.2"/>`;
    s += txt(cx, cy + size * 0.36, text, size, o.fg || P.gold, o.ls ? `letter-spacing="${o.ls}"` : '');
    return s;
  }
  function chimney(x, top, w = 34, h = 70, col = P.brick) {

    const sx = x + w / 2, cd = 9, ce = 6;
    let s = `<path d="${poly([[sx, top + h], [sx + cd, top + h - ce], [sx + cd, top - ce], [sx, top]])}" fill="${dk(col, 0.3)}" ${O(3)}/><rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" fill="${col}" ${O(3.5)}/>`;
    s += `<path d="${poly([[x - w / 2 - 5, top - 10], [x + w / 2 + 5, top - 10], [x + w / 2 + 5 + cd, top - 10 - ce], [x - w / 2 - 5 + cd, top - 10 - ce]])}" fill="${lt(P.brickD, 0.2)}" ${O(2.6)}/><path d="${poly([[x - w / 2 + 2, top - 12], [x + w / 2 - 2, top - 12], [x + w / 2 - 2 + cd * 0.7, top - 15], [x - w / 2 + 2 + cd * 0.7, top - 15]])}" fill="${INK}"/>`;
    s += `<path d="${poly([[x + w / 2 + 5, top + 3], [x + w / 2 + 5 + cd, top - 3], [x + w / 2 + 5 + cd, top - 10 - ce], [x + w / 2 + 5, top - 10]])}" fill="${dk(P.brickD, 0.2)}" ${O(2.6)}/><rect x="${x - w / 2 - 5}" y="${top - 10}" width="${w + 10}" height="13" rx="3" fill="${P.brickD}" ${O(3)}/>`;
    for (let y = top + 14; y < top + h - 4; y += 14) s += `<path d="M${x - w / 2} ${y} H${x + w / 2}" stroke="${INK}" stroke-width="1.5" opacity=".35"/>`;
    return s + [0, 1, 2].map((i) => `<circle cx="${x + 6 + i * 12}" cy="${top - 26 - i * 22}" r="${9 + i * 4}" fill="#e8e0f0" opacity="${f1(0.42 - i * 0.12)}"/>`).join('');
  }
  const found = (x0, x1, y, h = 16, c = P.rock) => `<rect x="${x0}" y="${y - h}" width="${x1 - x0}" height="${h}" rx="4" fill="${c}" ${O(3.5)}/>` + Array.from({ length: Math.floor((x1 - x0) / 38) }, (_, i) => `<path d="M${x0 + 24 + i * 38} ${y - h + 2} V${y - 2}" stroke="${INK}" stroke-width="2" opacity=".35"/>`).join('');
  const lantern = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="20" r="40" fill="url(#fcGlow)" opacity=".8"/><path d="M0 0 v8" stroke="${P.metal}" stroke-width="3"/><path d="M-9 8 h18 l-3 24 h-12 Z" fill="${P.glass}" ${O(3)}/><path d="M-12 8 h24 l-5 -8 h-14 Z" fill="${P.metal}" ${O(2.6)}/></g>`;
  const GLOW = `<defs>${glowDef('fcGlow', '#ffcf6a', 0.9)}</defs>`;

  



  const hx = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  const dk = (c, t = 0.25) => mix(c, '#2b1d18', t);
  const lt = (c, t = 0.25) => mix(c, '#fff6e6', t);
  let GSH = [];
  const gsh = (x, y, svg) => GSH.push([x, y, svg]);

  function sideWall(x, B, top, dx, dy, c, o = {}) {
    const sc = o.side || dk(c, o.k == null ? 0.24 : o.k);
    let s = `<path d="${poly([[x, B], [x + dx, B - dy], [x + dx, top - dy], [x, top]])}" fill="${sc}" ${O(o.w || 4)}/>`;
    let l = '';
    if (o.planks) for (let i = 1; i < o.planks; i++) { const t = i / o.planks; l += `M${f1(x + dx * t)} ${f1(top - dy * t + 3)} V${f1(B - dy * t - 3)} `; }
    if (o.courses) for (let y = top + o.courses; y < B - 4; y += o.courses) l += `M${x + 2} ${y} L${x + dx - 2} ${f1(y - dy + 2 * dy / dx)} `;
    if (l) s += `<path d="${l}" stroke="${INK}" stroke-width="2" opacity=".22"/>`;

    s += `<path d="M${x + 3} ${top + 6} V${B - 4}" stroke="#fff" stroke-width="2.4" opacity=".22"/>`;
    return s;
  }

  function foundV(x0, x1, y, h, dx, dy, c = P.rock) {
    return `<path d="${poly([[x1, y], [x1 + dx, y - dy], [x1 + dx, y - h - dy], [x1, y - h]])}" fill="${dk(c, 0.28)}" ${O(3.5)}/>` + found(x0, x1, y, h, c)
      + `<path d="M${x0 + 5} ${y - h + 3} H${x1 - 5}" stroke="#fff" stroke-width="2.4" opacity=".35" stroke-linecap="round"/>`;
  }

  function fascia(xa, xb, y, dx, dy, th, c, o = {}) {
    let s = '';
    if (o.shadow !== false) s += `<path d="${poly([[xa + 18, y + th], [xb, y + th], [xb + dx, y + th - dy], [xb + dx, y + th - dy + 16], [xb, y + th + 18], [xa + 18, y + th + 18]])}" fill="${INK}" opacity=".26"/>`;
    s += `<path d="${poly([[xb, y], [xb + dx, y - dy], [xb + dx, y - dy + th], [xb, y + th]])}" fill="${dk(c, 0.3)}" ${O(3.5)}/>`;
    s += `<path d="${poly([[xa, y], [xb, y], [xb, y + th], [xa, y + th]])}" fill="${c}" ${O(3.5)}/>`;
    return s;
  }
  







  const RDROP = 6;
  const rLerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const rAdd = (a, v, k = 1) => [a[0] + v[0] * k, a[1] + v[1] * k];
  const rSub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const rLen = (v) => Math.hypot(v[0], v[1]);
  const rNrm = (v) => { const l = rLen(v) || 1; return [v[0] / l, v[1] / l]; };
  const rMid = (a, b) => rLerp(a, b, 0.5);
  const rPt = (p) => f1(p[0]) + ' ' + f1(p[1]);

  const rDbl = (d, w, c, ink = 3) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f1(w + ink * 2)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${f1(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const rDots = (ps, r) => ps.map((p) => `M${f1(p[0] - r)} ${f1(p[1])} a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0 a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0 `).join('');

  function roofTiles(Q, c, cD, cL, o) {
    const [P0, P1, P2, P3] = Q, r = rng(o.seed * 131 + 7);
    const H = rLen(rSub(rMid(P0, P1), rMid(P3, P2))), q = o.q || 0.88, rh0 = o.rh;
    const hs = []; for (let s = 0, k = 0; s < H - rh0 * 0.35 * Math.pow(q, k) && k < 30; k++) { const v = rh0 * Math.pow(q, k); hs.push(v); s += v; }
    const sum = hs.reduce((a, b) => a + b, 0) || 1, ts = [0]; for (const v of hs) ts.push(ts[ts.length - 1] + v / sum);
    const at = (t, u) => rLerp(rLerp(P0, P3, t), rLerp(P1, P2, t), u);
    let edge = '', hi = '';
    for (let k = 0; k < hs.length; k++) {
      const t0 = ts[k], t1 = ts[k + 1], a = at(t0, 0), b = at(t0, 1), a2 = at(t1, 0), b2 = at(t1, 1);
      const span = rLen(rSub(b, a)), rowH = rLen(rSub(rMid(a, b), rMid(a2, b2))), down = rNrm(rSub(rMid(a, b), rMid(a2, b2))), sc = hs[k] / hs[0];
      if (span < 6) continue;
      const w = o.w * (0.6 + 0.4 * sc), m = Math.max(1, Math.round(span / w)), off = k % 2 ? 0.5 : 0;
      const us = [0]; for (let j = off ? 0.5 : 1; j < m; j++) us.push(j / m); us.push(1);
      const d = rowH * 0.5, cu = (u) => rAdd(at(t0, u), down, -d);
      for (let j = 0; j < us.length - 1; j++) {
        const p = cu(us[j]), pq = cu(us[j + 1]), cc = rAdd(rMid(p, pq), down, d * 2);
        edge += `${j ? 'L' : 'M'}${rPt(p)} Q${rPt(cc)} ${rPt(pq)} `;
        if (r() < (o.hiP || 0.3)) hi += `M${rPt(rAdd(rLerp(p, pq, 0.22), down, -rowH * 0.05))} L${rPt(rAdd(rLerp(p, pq, 0.55), down, -rowH * 0.12))} `;
      }
    }
    const sh = rAdd([0, 0], rNrm(rSub(rMid(P0, P1), rMid(P3, P2))), 3.5);
    const band = (ta, tb) => poly([at(ta, 0), at(ta, 1), at(tb, 1), at(tb, 0)]);
    const base = poly(P2[0] === P3[0] && P2[1] === P3[1] ? [P0, P1, P2] : Q);
    return `<path d="${base}" fill="${c}"/>`
      + `<path d="${band(0, 0.28)}" fill="${INK}" opacity="${o.lowA != null ? o.lowA : 0.1}"/><path d="${band(0.7, 1)}" fill="#fff" opacity="${o.topA != null ? o.topA : 0.12}"/>`
      + `<path d="${edge}" fill="none" stroke="${cD}" stroke-width="6" stroke-linejoin="round" opacity=".45" transform="translate(${f1(sh[0])} ${f1(sh[1])})"/>`
      + `<path d="${edge}" fill="none" stroke="${cD}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`
      + (hi ? `<path d="${hi}" fill="none" stroke="${cL}" stroke-width="3" stroke-linecap="round" opacity=".8"/>` : '');
  }

  function roofRidge(L, R, eY, rY, dx, o = {}) {
    const h = eY + RDROP - rY, hx = dx / 2, a = o.ins != null ? o.ins : Math.max(24, Math.min((R - L) * 0.3, h * 0.62 + hx * 0.5));
    return [L + a + hx, R - a + hx];
  }
  function roofV(L, R, eY, rY, dx, dy, pal, seed, sw = 32, sh = 19, o = {}) {
    eY += RDROP;
    const [rxL, rxR] = roofRidge(L, R, eY - RDROP, rY, dx, o);
    const FL = [L, eY], FR = [R, eY], RL = [rxL, rY], RR = [rxR, rY], SR = [R + dx, eY - dy], SL = [L + dx, eY - dy], t = (o.ridge || 12) + 2;

    const leftVis = (RL[0] - FL[0]) * (SL[1] - FL[1]) - (RL[1] - FL[1]) * (SL[0] - FL[0]) < 0;
    const sideC = [dk(pal[0], 0.3), dk(pal[1], 0.3), dk(pal[2], 0.22)], leftC = [lt(pal[0], 0.2), pal[1], lt(pal[2], 0.3)];

    let s = `<path d="${poly([[L + 10, eY + 7], [R - 4, eY + 7], [R + dx - 4, eY - dy + 7], [R + dx - 4, eY - dy + 22], [R - 4, eY + 25], [L + 10, eY + 25]])}" fill="${INK}" opacity=".24"/>`;
    if (leftVis) s += roofTiles([SL, FL, RL, RL], ...leftC, { w: sw * 0.8, rh: sh, q: 0.86, seed: seed + 3, lowA: 0.04, topA: 0.16 });
    s += roofTiles([FR, SR, RR, RR], ...sideC, { w: sw * 0.8, rh: sh, q: 0.86, seed: seed + 1, lowA: 0.14, topA: 0.04, hiP: 0.15 });
    s += roofTiles([FL, FR, RR, RL], pal[0], pal[1], pal[2], { w: sw, rh: sh, q: 0.86, seed });

    const lip = (a, b, c) => rDbl(`M${rPt(rAdd(a, [2, 1]))} L${rPt(rAdd(b, [-1, 1]))}`, 5, dk(c, 0.08), 2.6);
    s += lip(FL, FR, pal[1]) + lip(FR, SR, dk(pal[1], 0.3));

    s += rDbl(`M${rPt(RL)} L${rPt(rAdd(FL, [3, -2]))}${leftVis ? ` M${rPt(RL)} L${rPt(SL)}` : ''}`, 6, pal[2]) + rDbl(`M${rPt(RR)} L${rPt(rAdd(FR, [-2, -2]))} M${rPt(RR)} L${rPt(rAdd(SR, [-2, 2]))}`, 6, pal[1]);

    s += `<path d="M${rPt(RL)} L${rPt(RR)}" stroke="${INK}" stroke-width="${f1(t + 7)}" stroke-linecap="round"/><path d="M${rPt(RL)} L${rPt(RR)}" stroke="${pal[1]}" stroke-width="${f1(t)}" stroke-linecap="round"/>`
      + `<path d="M${rPt(rAdd(RL, [4, -t * 0.22]))} L${rPt(rAdd(RR, [-4, -t * 0.22]))}" stroke="${pal[2]}" stroke-width="${f1(Math.max(2.4, t * 0.3))}" stroke-linecap="round"/>`
      + `<path d="${rDots([RL, RR], t * 0.62)}" fill="${pal[1]}" ${O(3)}/><path d="${rDots([rAdd(RR, [1, 0])], t * 0.28)}" fill="${dk(pal[1], 0.35)}"/>`;
    s += `<path d="${poly([FL].concat(leftVis ? [SL] : []).concat([RL, RR, SR, FR]))}" fill="none" ${O(5)}/>`;
    return s;
  }

  function stepsV(cx, base, y, w, n = 2, c = '#e8d4c0') {
    let s = ''; const h = (y - base) / n;
    for (let i = 0; i < n; i++) {
      const top = base + i * h, ww = w + i * 16, x0 = cx - ww / 2, x1 = cx + ww / 2;
      s += `<path d="${poly([[x1, top + h], [x1 + 8, top + h - 6], [x1 + 8, top - 4], [x1, top + 2]])}" fill="${dk(c, 0.3)}" ${O(2.6)}/>`;
      s += `<rect x="${f1(x0)}" y="${f1(top)}" width="${f1(ww)}" height="${f1(h)}" fill="${c}" ${O(2.8)}/><path d="M${f1(x0 + 3)} ${f1(top + h - 3)} H${f1(x1 - 3)}" stroke="${INK}" stroke-width="2" opacity=".25"/>`;
    }
    return s;
  }

  const inShade = (d, a = 0.22) => `<path d="${d}" fill="${INK}" opacity="${a}"/>`;

  const fireLight = (x, y, rx, ry, c = '#ffb04a') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity=".16"/><ellipse cx="${x}" cy="${y}" rx="${f1(rx * 0.62)}" ry="${f1(ry * 0.62)}" fill="${c}" opacity=".18"/><ellipse cx="${x}" cy="${y}" rx="${f1(rx * 0.32)}" ry="${f1(ry * 0.32)}" fill="#ffd77a" opacity=".22"/>`;

  function floorV(x0, x1, yTop, yBot, c, o = {}) {
    let s = `<path d="${poly([[x0, yBot], [x1, yBot], [x1 + (o.dx || 0), yTop], [x0 + (o.dx || 0), yTop]])}" fill="${c}" ${O(o.w || 3)}/>`, l = '';
    const step = o.step || 16;
    for (let y = yBot - step; y > yTop + 3; y -= step) { const t = (yBot - y) / (yBot - yTop); l += `M${f1(x0 + (o.dx || 0) * t + 3)} ${y} H${f1(x1 + (o.dx || 0) * t - 3)} `; }
    if (o.tiles) for (let x = x0 + o.tiles; x < x1 - 4; x += o.tiles) l += `M${x} ${yBot - 2} L${f1(x + (o.dx || 0))} ${yTop + 2} `;
    s += `<path d="${l}" stroke="${dk(c, 0.3)}" stroke-width="2" opacity=".6"/>`;
    return s;
  }

  function tool(x, y, k, s = 1, rot = 0) {
    const g = k === 'hammer' ? `<path d="M0 0 V34" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M0 2 V32" stroke="${P.woodL}" stroke-width="3.4" stroke-linecap="round"/><rect x="-11" y="-6" width="22" height="11" rx="2" fill="#8a8e9e" ${O(2.6)}/>`
      : k === 'tongs' ? `<path d="M-4 0 L2 36 M4 0 L-2 36" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-4 0 L2 36 M4 0 L-2 36" stroke="#8a8e9e" stroke-width="2.6" stroke-linecap="round"/>`
        : k === 'saw' ? `<path d="M-14 4 H14 L14 12 L-14 26 Z" fill="#c9ccd6" ${O(2.4)}/><rect x="-20" y="0" width="10" height="14" rx="3" fill="${P.wood}" ${O(2.2)}/>`
          : `<path d="M0 0 V38 M0 38 l8 4" stroke="${INK}" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M0 0 V38 M0 38 l8 4" stroke="#8a8e9e" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})">${rot ? '' : `<circle cx="0" cy="-4" r="2.6" fill="${INK}"/>`}${g}</g>`;
  }


  function cylStones(cx, hw, y0, y1, sag = 10, rh = 30, step = 18) {
    const yAt = (x, y) => y + sag * Math.sqrt(Math.max(0, 1 - ((x - cx) / hw) ** 2));
    let st = '';
    for (let y = y0, k = 0; y < y1; y += rh, k++) for (let a = -90 - (k % 2) * step / 2; a < 90; a += step) {
      const a0 = Math.max(-89, a + 1), a1 = Math.min(89, a + step - 1), xa = cx + hw * Math.sin(a0 * Math.PI / 180), xb = cx + hw * Math.sin(a1 * Math.PI / 180); if (xb - xa < 4) continue;
      const xm = (xa + xb) / 2, ya = yAt(xa, y), yb = yAt(xb, y), c = 2 * yAt(xm, y) - (ya + yb) / 2;
      st += `M${f1(xa)} ${f1(ya)} Q${f1(xm)} ${f1(c)} ${f1(xb)} ${f1(yb)} L${f1(xb)} ${f1(yb + rh - 5)} Q${f1(xm)} ${f1(c + rh - 5)} ${f1(xa)} ${f1(ya + rh - 5)} Z `;
    }
    return st;
  }

  function merlons(xs, top, w = 24, h = 26, c = P.rock) {
    let f = '', t = '', sd = '';
    for (const x of xs) { f += rr(x, top, x + w, top + h, 3) + ' '; t += `M${x + 2} ${top} L${x + 8} ${top - 6} H${x + w + 6} L${x + w} ${top} Z `; sd += `M${x + w} ${top + 2} L${x + w + 6} ${top - 4} V${top + h - 6} L${x + w} ${top + h} Z `; }
    return `<path d="${sd}" fill="${dk(c, 0.3)}" ${O(2.8)}/><path d="${t}" fill="${lt(c, 0.3)}" ${O(2.8)}/><path d="${f}" fill="${c}" ${O(3.2)}/>`;
  }


  function houseB(h, o) {
    const [x0, y0, x1, B] = h.vis, cx = h.door.x, R = ROOF[h.roof] || ROOF.red, wt = B - 104, r = rng(x0 + B);
    const walls = { teal: '#fff1d6', red: '#ffe0ec', blue: '#fff4e0', mustard: '#e6f0ff', pink: '#f0ffe6', plum: '#f3d3a5' };
    const dx = 42, dy = 30, wx0 = x0 + 4, wx1 = x1 - 4, wall = walls[h.roof] || P.cream;
    let s = GLOW + `<g data-ol="${h.id}">`;
    gsh(x1, B, `<path d="${poly([[wx1 - 4, B + 16], [wx1 + dx + 44, B - dy + 10], [wx1 + dx + 30, B - dy - 6], [wx1 + dx, B - dy - 2], [wx1, B - 6]])}" fill="${INK}" opacity=".18"/>`);

    const [rgL, rgR] = roofRidge(x0 - 14, x1 + 14, wt + 4, y0 + 40, dx), chX = r() < 0.5 ? Math.max(x0 + 56, rgL + 20) : Math.min(x1 - 56, rgR - 22);

    s += sideWall(wx1, B - 12, wt, dx, dy, wall, { courses: 22 });
    s += `<rect x="${wx0}" y="${wt}" width="${wx1 - wx0}" height="${B - wt - 12}" fill="${wall}" ${O(5)}/>`;
    s += `<path d="M${wx0 + 4} ${wt + 30} V${B - 16} M${wx1 - 4} ${wt + 30} V${B - 16}" stroke="${dk(wall, 0.12)}" stroke-width="8"/>`;
    s += foundV(x0, x1, B, 14, dx, dy);
    const wl = (x1 - x0) * 0.22;
    s += win(x0 + wl - 22, wt + 30, 44, 40, { shut: R[0], box: P.woodD, cat: r() < 0.4 }) + win(x1 - wl - 22, wt + 30, 44, 40, { shut: R[0], box: P.woodD });

    s += door(cx, B - 10, 46, 62, R[1], { mat: false });
    s += stepsV(cx, B - 10, B + 10, 64, 2, '#e8d4c0') + `<rect x="${cx - 26}" y="${B - 12}" width="52" height="8" rx="4" fill="${R[1]}" ${O(2.2)}/>`;

    s += fascia(x0 - 14, x1 + 14, wt + 2, dx, dy, 10, R[1]);
    s += roofV(x0 - 14, x1 + 14, wt + 4, y0 + 40, dx, dy, R, x0, 30, 18);
    s += chimney(chX, y0 + 8, 28, 44);
    if (h.k === 'tavern') {

      s += `<path d="M${wx1 + 8} ${wt + 4} h48 v12" fill="none" stroke="${P.metal}" stroke-width="5" stroke-linecap="round"/><path d="${poly([[x1 + 8, wt + 18], [x1 + 64, wt + 18], [x1 + 70, wt + 13], [x1 + 70, wt + 59], [x1 + 64, wt + 66], [x1 + 8, wt + 66]])}" fill="${P.woodD}" ${O(3)}/><rect x="${x1 + 8}" y="${wt + 18}" width="56" height="48" rx="8" fill="${P.wood}" ${O(3.5)}/><rect x="${x1 + 20}" y="${wt + 28}" width="22" height="28" rx="3" fill="${P.gold}" ${O(2.6)}/><path d="M${x1 + 42} ${wt + 34} q10 0 10 9 q0 9 -10 9" fill="none" stroke="${INK}" stroke-width="3"/><path d="M${x1 + 18} ${wt + 30} q12 -8 26 0" fill="#fff" ${O(2)}/>`;

      s += `<path d="${poly([[cx - 52, wt + 22], [cx + 52, wt + 22], [cx + 62, wt + 40], [cx - 62, wt + 40]])}" fill="${P.cream}" ${O(3)}/>` + [0, 1, 2, 3].map((i) => `<path d="${poly([[cx - 52 + i * 26 + 6, wt + 22], [cx - 52 + i * 26 + 19, wt + 22], [cx - 62 + i * 31 + 22, wt + 40], [cx - 62 + i * 31 + 7, wt + 40]])}" fill="#c0504a"/>`).join('') + `<path d="M${cx - 62} ${wt + 40} H${cx + 62} V${wt + 47} H${cx - 62} Z" fill="#8f3f2c" ${O(2.6)}/><path d="M${cx - 60} ${wt + 48} H${cx + 60}" stroke="${INK}" stroke-width="8" opacity=".18"/>`;
      s += board(cx, wt - 4, 'ТАВЕРНА', 20, { w: 150, h: 34 });
      s += lantern(x0 + 30, wt + 14, 0.8);
    }
    if (o.roofCat) s += kitty(x0 + (x1 - x0) * (0.3 + r() * 0.4), y0 + 30, 0.6, FUR[Math.floor(r() * FUR.length)], r() < 0.5 ? 'loaf' : 'sit', r() < 0.5);
    return s + '</g>';
  }

   

  const crate1 = (x, y, w = 56, h = 46) => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="3" fill="${P.wood}" ${O(3.2)}/><rect x="${x - w / 2 + 5}" y="${y - h + 5}" width="${w - 10}" height="${h - 10}" fill="none" stroke="${P.woodD}" stroke-width="3"/><path d="M${x - w / 2 + 6} ${y - h + 6} L${x + w / 2 - 6} ${y - 6}" stroke="${P.woodD}" stroke-width="4"/>`;
  const barrel1 = (x, y, c = P.wood, water) => `<path d="M${x - 20} ${y - 2} Q${x - 26} ${y - 30} ${x - 20} ${y - 58} H${x + 20} Q${x + 26} ${y - 30} ${x + 20} ${y - 2} Z" fill="${c}" ${O(3.2)}/><path d="M${x - 23} ${y - 16} H${x + 23} M${x - 23} ${y - 44} H${x + 23}" stroke="${P.metal}" stroke-width="4"/><ellipse cx="${x}" cy="${y - 58}" rx="20" ry="7" fill="${water ? '#4ab0ff' : P.woodL}" ${O(2.8)}/>`;
  



  const FLORA = [
    ['#ff7f96', '#fff4e0', '#9b86e8'],
    ['#ff6a4d', '#ffe27a', '#fff4e0'],
    ['#ffb04a', '#fff4e0', '#6f9ee8'],
    ['#ffd84a', '#ffa9bf', '#a678d8'],
    ['#c58ae8', '#fff4e0', '#ff8fa3'],
    ['#ff8fa3', '#ffe27a', '#7fb8ff'],
  ];
  const floraOf = (it) => (it.pal != null ? it.pal : Math.floor(rng(Math.round(it.x) * 31 + Math.round(it.y) * 17 + 40)() * FLORA.length)) % FLORA.length;
  function flowerbed(it) {
    const { x, y } = it, w = it.w || 90, long = it.shape === 'long', r = rng(Math.round(x) * 31 + Math.round(y) * 17 + 5);
    const C = FLORA[floraOf(it)], rx = w / 2, ry = long ? 18 : f1(16 + w * 0.02), cy = y - 14, FD = 6;
    const soil = '#6e4632', soilM = '#8a5a3c', soilL = '#a8754c';
    let s = '', top = cy - ry;

    if (long) {
      s += `<path d="${rr(x - rx + 6, cy - ry + 10, x + rx + 8, cy + ry + FD + 6, 12)}" fill="${INK}" opacity=".2"/>`;
      s += `<path d="${rr(x - rx, cy - ry + FD, x + rx, cy + ry + FD, 9)}" fill="${P.woodD}" ${O(3)}/>`;
      s += `<path d="${rr(x - rx, cy - ry, x + rx, cy + ry, 9)}" fill="${P.wood}" ${O(3)}/>`;
      let j = '';
      for (let px = x - rx + 26 + r() * 10; px < x + rx - 16; px += 30 + r() * 14) j += `M${f1(px)} ${f1(cy + ry - 7)} V${f1(cy + ry + FD - 1)} M${f1(px + 9)} ${f1(cy - ry + 1)} V${f1(cy - ry + 7)} `;
      s += `<path d="${j}M${f1(x - rx + 8)} ${f1(cy - ry + 7)} V${f1(cy + ry - 7)} M${f1(x + rx - 8)} ${f1(cy - ry + 7)} V${f1(cy + ry - 7)}" stroke="${INK}" stroke-width="2" opacity=".5"/>`;
      s += `<path d="M${f1(x - rx + 10)} ${f1(cy - ry + 3)} H${f1(x + rx - 12)}" stroke="${P.woodL}" stroke-width="2.6" stroke-linecap="round"/>`;
      s += `<path d="${rr(x - rx + 7, cy - ry + 7, x + rx - 7, cy + ry - 7, 5)}" fill="${soil}" ${O(2.4)}/>`;
      s += `<path d="${rr(x - rx + 11, cy - ry + 2, x + rx - 11, cy + ry - 9, 9)}" fill="${soilM}" ${O(2.4)}/>`;
      s += `<path d="M${f1(x - rx + 18)} ${f1(cy - ry + 6)} H${f1(x - rx * 0.2)}" stroke="${soilL}" stroke-width="3" stroke-linecap="round"/>`;
    } else {
      const E = (k, dy = 0) => `M${f1(x - rx * k)} ${f1(cy + dy)} A${f1(rx * k)} ${f1(ry * k)} 0 1 0 ${f1(x + rx * k)} ${f1(cy + dy)} A${f1(rx * k)} ${f1(ry * k)} 0 1 0 ${f1(x - rx * k)} ${f1(cy + dy)} Z`;
      s += `<ellipse cx="${f1(x + 7)}" cy="${f1(cy + FD + 1)}" rx="${f1(rx + 4)}" ry="${f1(ry + 2)}" fill="${INK}" opacity=".2"/>`;
      s += `<path d="M${f1(x - rx)} ${f1(cy)} A${f1(rx)} ${f1(ry)} 0 0 0 ${f1(x + rx)} ${f1(cy)} V${f1(cy + FD)} A${f1(rx)} ${f1(ry)} 0 0 1 ${f1(x - rx)} ${f1(cy + FD)} Z" fill="${mix(P.rock, P.rockD, 0.6)}" ${O(3)}/>`;
      s += `<path d="${E(0.9)}" fill="${soil}" ${O(2.4)}/>`;

      const n = Math.max(9, Math.round((Math.PI * (rx + ry)) / 17)), k0 = 1 - 9 / rx, pt = (a, k) => [x + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * (k === 1 ? 1 : 1 - (1 - k) * rx / ry * 0.7)];
      const st = ['', '', ''], a0 = r() * 0.5; let jn = '';
      for (let i = 0; i < n; i++) {
        const a = a0 + (i / n) * 6.283, b = a0 + ((i + 1) / n) * 6.283 - 0.07, m = (a + b) / 2;
        const q = [pt(a, 1), pt(m, 1.02), pt(b, 1), pt(b, k0), pt(m, k0 - 0.02), pt(a, k0)];
        const lit = Math.cos(m) + Math.sin(m) * 1.3;
        st[lit < -0.7 ? 0 : lit > 0.9 || r() < 0.2 ? 2 : 1] += smooth(q) + ' ';
        if (Math.sin(b + 0.035) > 0.15) { const [jx, jy] = pt(b + 0.035, 1); jn += `M${f1(jx)} ${f1(jy + 1)} v${FD - 1} `; }
      }
      s += [lt(P.rockL, 0.35), P.rockL, P.rock].map((c, i) => (st[i] ? `<path d="${st[i]}" fill="${c}" ${O(2.2)}/>` : '')).join('');
      s += `<path d="${jn}" stroke="${INK}" stroke-width="2" opacity=".55"/>`;

      s += `<ellipse cx="${x}" cy="${f1(cy - 3)}" rx="${f1(rx * k0 - 4)}" ry="${f1(ry - 5)}" fill="${soilM}" ${O(2.4)}/>`;
      s += `<path d="M${f1(x - rx * 0.62)} ${f1(cy - 4)} Q${f1(x - rx * 0.5)} ${f1(cy - ry + 3)} ${f1(x - rx * 0.05)} ${f1(cy - ry + 2.5)}" fill="none" stroke="${soilL}" stroke-width="3" stroke-linecap="round"/>`;
      top = Math.min(top, cy - ry + 2);
    }

    const k1 = 1 - 9 / rx, hwAt = (dy) => (long ? rx - 16 : (rx * k1 - 8) * Math.sqrt(Math.max(0, 1 - (dy / (ry - 3)) ** 2)));
    const ROWS = [{ dy: -ry * 0.4, h: [21, 28], sp: 14, kind: ['tulip', 'lupine', 'tulip'] }, { dy: ry * 0.06, h: [13, 17], sp: 15, kind: ['daisy', 'tulip', 'daisy'] }, { dy: ry * 0.5, h: [5, 8], sp: 13, kind: ['bell', 'daisy', 'bell'] }];
    const COLOR = { tulip: 0, lupine: 2, daisy: 1, bell: 2 };
    let bx0 = x - rx, bx1 = x + rx;
    for (const R of ROWS) {
      const hw = hwAt(R.dy), cnt = Math.max(3, Math.round((hw * 2) / R.sp)), step = (hw * 2) / cnt;
      let stem = '', leaf = '', mid = ''; const head = ['', '', ''];
      for (let i = 0; i < cnt; i++) {
        const fx = x - hw + step * (i + 0.5) + (r() - 0.5) * step * 0.4, fy = cy + R.dy + (r() - 0.5) * 3, h = R.h[0] + r() * (R.h[1] - R.h[0]);
        const kind = R.kind[Math.floor(r() * 3)], c = COLOR[kind], hx = fx + (r() - 0.5) * 3, hy = fy - h;
        const sway = (r() - 0.5) * 4, lr = r() < 0.5 ? -1 : 1;
        if (kind === 'bell') {

          const ex = hx + lr * 5, by = hy - 1;
          stem += `M${f1(fx)} ${f1(fy)} Q${f1(fx)} ${f1(by - 8)} ${f1(ex)} ${f1(by - 5)} `;
          head[c] += `M${f1(ex - 4.8)} ${f1(by + 4.4)} Q${f1(ex - 5.2)} ${f1(by - 5)} ${f1(ex)} ${f1(by - 5)} Q${f1(ex + 5.2)} ${f1(by - 5)} ${f1(ex + 4.8)} ${f1(by + 4.4)} L${f1(ex + 2.4)} ${f1(by + 2.8)} L${f1(ex)} ${f1(by + 5)} L${f1(ex - 2.4)} ${f1(by + 2.8)} Z `;
          bx0 = Math.min(bx0, ex - 7); bx1 = Math.max(bx1, ex + 7); top = Math.min(top, by - 8);
        } else {
          stem += `M${f1(fx)} ${f1(fy)} Q${f1(fx + sway)} ${f1((fy + hy) / 2)} ${f1(hx)} ${f1(hy + 2)} `;
          if (kind === 'tulip') {

            const t = h > 18 ? 1.55 : 1.3;
            head[c] += `M${f1(hx - 4.4 * t)} ${f1(hy - 5 * t)} L${f1(hx - 2 * t)} ${f1(hy - 2.6 * t)} L${f1(hx)} ${f1(hy - 6.4 * t)} L${f1(hx + 2 * t)} ${f1(hy - 2.6 * t)} L${f1(hx + 4.4 * t)} ${f1(hy - 5 * t)} Q${f1(hx + 5.4 * t)} ${f1(hy + 2 * t)} ${f1(hx)} ${f1(hy + 2.8 * t)} Q${f1(hx - 5.4 * t)} ${f1(hy + 2 * t)} ${f1(hx - 4.4 * t)} ${f1(hy - 5 * t)} Z `;
            top = Math.min(top, hy - 6.4 * t - 2);
          } else if (kind === 'lupine') {

            const L = [], Rt = [];
            for (let q = 0; q <= 4; q++) { const wq = 5.2 - q * 1.05, yq = hy + 4 - q * 4.6; L.push([hx - wq, yq]); Rt.push([hx + wq, yq]); }
            let d = `M${f1(L[0][0])} ${f1(L[0][1])} `;
            for (let q = 0; q < 4; q++) d += `Q${f1(L[q][0] - 2.4)} ${f1((L[q][1] + L[q + 1][1]) / 2)} ${f1(L[q + 1][0])} ${f1(L[q + 1][1])} `;
            d += `Q${f1(hx)} ${f1(L[4][1] - 4)} ${f1(Rt[4][0])} ${f1(Rt[4][1])} `;
            for (let q = 4; q > 0; q--) d += `Q${f1(Rt[q][0] + 2.4)} ${f1((Rt[q][1] + Rt[q - 1][1]) / 2)} ${f1(Rt[q - 1][0])} ${f1(Rt[q - 1][1])} `;
            head[c] += d + `Q${f1(hx)} ${f1(hy + 7)} ${f1(L[0][0])} ${f1(L[0][1])} Z `;
            top = Math.min(top, hy + 4 - 18.4 - 4);
          } else {

            const ro = h > 11 ? 6.6 : 5.6, ri = ro * 0.55, a0 = r() * 0.9, N = 7, pt = (a, k) => [hx + Math.cos(a) * k, hy + Math.sin(a) * k * 0.8];
            let d = '';
            for (let q = 0; q < N; q++) {
              const a = a0 + (q / N) * 6.283, b = a0 + ((q + 1) / N) * 6.283, m = (a + b) / 2, p0 = pt(a, ri), c1 = pt(m - 0.3, ro * 1.25), c2 = pt(m + 0.3, ro * 1.25), p1 = pt(b, ri);
              d += (q ? '' : `M${f1(p0[0])} ${f1(p0[1])} `) + `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p1[0])} ${f1(p1[1])} `;
            }
            head[c] += d + 'Z ';
            mid += `M${f1(hx - 2.5)} ${f1(hy)} a2.5 2.2 0 1 0 5 0 a2.5 2.2 0 1 0 -5 0 Z `;
            top = Math.min(top, hy - ro - 2);
          }
          bx0 = Math.min(bx0, hx - 9); bx1 = Math.max(bx1, hx + 9);
        }

        const ll = 6 + r() * 3;
        leaf += `M${f1(fx)} ${f1(fy)} q${f1(-ll * 0.6)} ${f1(-ll * 0.8)} ${f1(-ll)} ${f1(-ll * 0.35)} q${f1(ll * 0.5)} ${f1(ll * 0.45)} ${f1(ll)} ${f1(ll * 0.35)} Z M${f1(fx)} ${f1(fy)} q${f1(ll * 0.6)} ${f1(-ll * 0.8)} ${f1(ll)} ${f1(-ll * 0.35)} q${f1(-ll * 0.5)} ${f1(ll * 0.45)} ${f1(-ll)} ${f1(ll * 0.35)} Z `;
        if (i < cnt - 1 && r() < 0.7) { const gx = fx + step * 0.5, gy = fy + 1.5, g = 5 + r() * 2; leaf += `M${f1(gx)} ${f1(gy)} q${f1(-g * 0.4)} ${f1(-g)} ${f1(-g * 0.9)} ${f1(-g * 0.9)} q${f1(g * 0.6)} ${f1(g * 0.2)} ${f1(g * 0.9)} ${f1(g * 0.9)} q${f1(g * 0.3)} ${f1(-g * 1.1)} ${f1(g * 0.8)} ${f1(-g * 1.2)} q${f1(-g * 0.1)} ${f1(g * 0.8)} ${f1(-g * 0.8)} ${f1(g * 1.2)} Z `; }
        if (kind === 'tulip' && h > 15) leaf += `M${f1(fx)} ${f1(fy - 1)} q${f1(lr * 6)} ${f1(-h * 0.35)} ${f1(lr * 2.5)} ${f1(-h * 0.62)} q${f1(-lr * 4.5)} ${f1(h * 0.3)} ${f1(-lr * 2.5)} ${f1(h * 0.62)} Z `;
      }
      s += `<path d="${stem}" fill="none" stroke="${P.leafD}" stroke-width="2.4" stroke-linecap="round"/><path d="${leaf}" fill="${P.leaf}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
      for (let c = 0; c < 3; c++) if (head[c]) s += `<path d="${head[c]}" fill="${C[c]}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`;
      if (mid) s += `<path d="${mid}" fill="${C[1] === '#ffe27a' ? '#e8803a' : P.gold}" stroke="${INK}" stroke-width="1.2"/>`;
    }
    return { svg: s, box: [f1(Math.min(bx0, x - rx) - 2), f1(top - 2), f1(Math.max(bx1, x + rx + 12)), f1(y + 14)] };
  }
  const ITEM = {
    well(it) {
      const { x, y } = it, cy = y - 34;
      let s = `<path d="M${x - 78} ${cy} V${y - 6} Q${x} ${y + 22} ${x + 78} ${y - 6} V${cy} Z" fill="${P.rock}" ${O(4.5)}/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${x - 66 + i * 22} ${cy + 8 + Math.sin(i / 6 * Math.PI) * 18} v24" stroke="${INK}" stroke-width="2" opacity=".35"/>`).join('') + `<path d="M${x - 78} ${cy + 18} Q${x} ${cy + 48} ${x + 78} ${cy + 18}" fill="none" stroke="${INK}" stroke-width="2" opacity=".35"/>`;
      s += `<ellipse cx="${x}" cy="${cy}" rx="78" ry="34" fill="${P.rockL}" ${O(4.5)}/><ellipse cx="${x}" cy="${cy + 2}" rx="58" ry="22" fill="#2a5a7a" ${O(3)}/><ellipse cx="${x - 14}" cy="${cy - 2}" rx="18" ry="5" fill="${P.waterL}" opacity=".6"/>`;
      for (const px of [x - 70, x + 58]) s += `<rect x="${px}" y="${cy - 120}" width="12" height="122" rx="3" fill="${P.wood}" ${O(3)}/>`;
      s += `<path d="M${x - 74} ${cy - 104} H${x + 74}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x - 74} ${cy - 104} H${x + 74}" stroke="${P.woodL}" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${cy - 104} V${cy - 52}" stroke="#d8cbb0" stroke-width="2.4"/>`;
      s += `<path d="M${x - 14} ${cy - 52} H${x + 14} L${x + 10} ${cy - 26} H${x - 10} Z" fill="${P.wood}" ${O(3)}/>` + fish(x + 2, cy - 58, 0.42, '#8fb6c8', -70);
      { const Rr = ROOF.red;
        s += scales(poly([[x - 60, cy - 170], [x + 60, cy - 170], [x + 72, cy - 186], [x - 46, cy - 186]]), x - 64, cy - 190, x + 76, cy - 168, lt(Rr[0], 0.1), Rr[1], lt(Rr[2], 0.15), 22, 9, 22);
        s += scales(poly([[x + 100, cy - 112], [x + 114, cy - 124], [x + 72, cy - 186], [x + 60, cy - 170]]), x + 56, cy - 190, x + 118, cy - 110, dk(Rr[0], 0.26), dk(Rr[1], 0.24), dk(Rr[2], 0.2), 18, 14, 23);
        s += scales(`M${x - 100} ${cy - 112} L${x - 60} ${cy - 170} H${x + 60} L${x + 100} ${cy - 112} Z`, x - 100, cy - 170, x + 100, cy - 112, ...Rr, 24, 14, 21);
        s += `<path d="M${x - 60} ${cy - 171} H${x + 60}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${x - 60} ${cy - 171} H${x + 60}" stroke="${Rr[1]}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 52} ${cy - 173} H${x + 46}" stroke="${Rr[2]}" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`; }
      s += `<path d="M${x - 64} ${cy - 166} L${x - 70} ${cy - 196} L${x - 40} ${cy - 170} Z M${x + 64} ${cy - 166} L${x + 70} ${cy - 196} L${x + 40} ${cy - 170} Z" fill="${ROOF.red[0]}" ${O(3)}/><path d="M${x - 62} ${cy - 170} L${x - 65} ${cy - 186} L${x - 50} ${cy - 172} Z M${x + 62} ${cy - 170} L${x + 65} ${cy - 186} L${x + 50} ${cy - 172} Z" fill="${P.pink}"/>`;
      return { svg: `<g data-ol="well">${s}</g>`, box: [x - 110, y - 240, x + 110, y + 20] };
    },
    lamp(it) {
      const { x, y } = it, top = y - 150;
      const s = GLOW + `<circle cx="${x}" cy="${top + 40}" r="66" fill="url(#fcGlow)" opacity=".75"/><rect x="${x - 5}" y="${top + 56}" width="10" height="${y - top - 56}" fill="${P.metal}" ${O(2.8)}/><path d="M${x - 18} ${y} h36" stroke="${P.metal}" stroke-width="9" stroke-linecap="round"/><path d="M${x - 16} ${top + 58} h32 l-5 -38 h-22 Z" fill="${P.glass}" ${O(3.4)}/><path d="M${x - 21} ${top + 20} h42 l-8 -14 h-26 Z" fill="${P.metal}" ${O(2.8)}/>`
        + `<g transform="translate(${x} ${top + 6}) scale(.26)" fill="${P.metal}"><path d="M-20 0 C-24 -30 -14 -46 0 -46 C14 -46 24 -30 20 0 Z"/><circle cx="0" cy="-58" r="16"/><path d="M-14 -66 L-12 -84 L-2 -72 Z M14 -66 L12 -84 L2 -72 Z"/><path d="M18 -6 C40 -4 44 -30 30 -40" fill="none" stroke="${P.metal}" stroke-width="8" stroke-linecap="round"/></g>`;
      return { svg: s, box: [x - 70, top - 30, x + 70, y + 6] };
    },
    bench(it) {
      const { x, y } = it;
      let s = `<rect x="${x - 54}" y="${y - 60}" width="108" height="14" rx="5" fill="${P.wood}" ${O(3)}/><rect x="${x - 58}" y="${y - 30}" width="116" height="12" rx="5" fill="${P.woodL}" ${O(3)}/><path d="M${x - 44} ${y - 46} V${y - 30} M${x + 44} ${y - 46} V${y - 30}" stroke="${P.woodD}" stroke-width="5"/><path d="M${x - 46} ${y - 18} V${y} M${x + 46} ${y - 18} V${y}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x - 46} ${y - 18} V${y} M${x + 46} ${y - 18} V${y}" stroke="${P.metal}" stroke-width="5" stroke-linecap="round"/>`;
      if (it.cat) s += kitty(x - 14, y - 30, 0.6, FUR[8], 'sleep');
      return { svg: s, box: [x - 62, y - 80, x + 62, y + 4] };
    },
    cart(it) {
      const { x, y } = it, C = { milk: ['#4ab0ff', P.cream], fish: ['#3a8fd0', '#ffe0ec'], yarn: ['#c06aa8', '#fff4e0'] }[it.goods] || ['#d04a4a', P.cream];
      let s = `<path d="M${x - 64} ${y - 104} V${y - 44} M${x + 64} ${y - 104} V${y - 44}" stroke="${P.woodD}" stroke-width="6"/>`;
      for (let k = 0; k < 6; k++) s += `<path d="M${x - 76 + k * 25.3} ${y - 124} h25.3 l2 16 h-29.3 Z" fill="${k % 2 ? C[1] : C[0]}" ${O(2.8)}/>`;
      s += `<path d="M${x - 78} ${y - 108} ${Array.from({ length: 6 }, (_, k) => `q12.6 14 25.3 0`).join(' ')}" fill="${C[0]}" ${O(2.6)}/>`;
      s += `<rect x="${x - 70}" y="${y - 50}" width="140" height="34" rx="5" fill="${P.wood}" ${O(3.4)}/><path d="M${x - 66} ${y - 34} H${x + 66}" stroke="${P.woodD}" stroke-width="2.4"/>`;
      if (it.goods === 'milk') s += milk(x - 40, y - 50, 0.7) + milk(x - 14, y - 50, 0.7) + milk(x + 12, y - 50, 0.7) + `<path d="M${x + 30} ${y - 50} h30 l-4 -16 h-22 Z" fill="#ffd34d" ${O(2.4)}/>`;
      else if (it.goods === 'fish') s += fish(x - 30, y - 60, 0.7, '#8fb6c8', -6) + fish(x + 26, y - 58, 0.65, '#ffb36b', 8) + fishbone(x, y - 74, 0.45, 0);
      else s += yarn(x - 40, y - 64, 12, P.pink, false) + yarn(x - 14, y - 64, 12, '#7fd6e6', false) + yarn(x + 12, y - 64, 12, P.gold, false) + yarn(x + 38, y - 64, 12, '#b9a2ff', false);
      for (const wx of [x - 46, x + 46]) s += `<circle cx="${wx}" cy="${y - 14}" r="16" fill="${P.woodD}" ${O(3.4)}/><circle cx="${wx}" cy="${y - 14}" r="5" fill="${P.gold}" ${O(2)}/>`;
      return { svg: s, box: [x - 84, y - 136, x + 84, y + 4] };
    },
    flowers(it) { return flowerbed(it); },
    signpost(it) { return { svg: signpost(it.x, it.y, it.to), box: [it.x - 150, it.y - 130, it.x + 150, it.y + 8] }; },
    box(it) {
      const { x, y } = it;
      let s = `<path d="M${x - 34} ${y - 50} L${x - 52} ${y - 66} L${x - 30} ${y - 70} Z M${x + 34} ${y - 50} L${x + 52} ${y - 66} L${x + 30} ${y - 70} Z" fill="${P.cardL}" ${O(3)}/><rect x="${x - 34}" y="${y - 50}" width="68" height="14" fill="#4a2e26" ${O(3)}/>`;
      s += it.cat === 'sleep' ? kitty(x, y - 36, 0.55, FUR[1], 'sleep') : `<g transform="translate(${x} ${y - 30})"><circle cx="0" cy="-24" r="14" fill="${FUR[4]}" ${O(3)}/><path d="M-12 -30 L-12 -46 L-3 -36 Z M12 -30 L12 -46 L3 -36 Z" fill="${FUR[4]}" ${O(2.6)}/><circle cx="-5" cy="-25" r="2.4" fill="${INK}"/><circle cx="5" cy="-25" r="2.4" fill="${INK}"/><path d="M-14 -12 h-6 M14 -12 h6" stroke="${INK}" stroke-width="2"/><path d="M-12 -16 a5 5 0 0 1 8 0 M4 -16 a5 5 0 0 1 8 0" fill="${FUR[4]}" ${O(2.4)}/></g>`;
      s += `<rect x="${x - 34}" y="${y - 38}" width="68" height="38" fill="${P.card}" ${O(3.4)}/><path d="M${x} ${y - 38} V${y - 26}" stroke="#c9b28a" stroke-width="8"/>` + paw(x + 14, y - 16, 0.6, '#3a2a1a', 0.5);
      return { svg: s, box: [x - 56, y - 96, x + 56, y + 4] };
    },
    pot(it) { const { x, y } = it; return { svg: `<path d="M${x - 20} ${y - 30} H${x + 20} L${x + 14} ${y} H${x - 14} Z" fill="${P.terra}" ${O(3)}/><rect x="${x - 23}" y="${y - 36}" width="46" height="9" rx="3" fill="${P.terraD}" ${O(2.6)}/>` + bush(x, y - 30, 0.6, x), box: [x - 34, y - 70, x + 34, y + 4] }; },
    crate(it) {
      const { x, y } = it, n = it.n || 1;
      let s = crate1(x, y);
      if (n > 1) s += crate1(x + (n > 2 ? 30 : 6), y - 46, 50, 40);
      if (n > 2) s += crate1(x + 58, y, 52, 42);
      if (n > 3) s += crate1(x + 34, y - 86, 44, 36) + fish(x + 34, y - 128, 0.45, '#8fb6c8', 15);
      return { svg: s, box: [x - 36, y - 140, x + 96, y + 4] };
    },
    barrel(it) { return { svg: barrel1(it.x, it.y, P.wood, it.water), box: [it.x - 30, it.y - 70, it.x + 30, it.y + 4] }; },
    laundry(it) {
      const { x, y, x2, y2 } = it, top = y - 110, t2 = y2 - 110, mx = (x + x2) / 2, my = Math.max(top, t2) + 34, r = rng(x);
      let s = `<rect x="${x - 5}" y="${top}" width="10" height="${y - top}" fill="${P.wood}" ${O(2.6)}/><rect x="${x2 - 5}" y="${t2}" width="10" height="${y2 - t2}" fill="${P.wood}" ${O(2.6)}/><path d="M${x} ${top + 6} Q${mx} ${my} ${x2} ${t2 + 6}" fill="none" stroke="#d8cbb0" stroke-width="2.6"/>`;
      const COL = [P.pink, '#7fd6e6', P.gold, '#b9a2ff', '#9fe39a', '#ff8a5c'], n = Math.max(3, Math.round(Math.abs(x2 - x) / 46));
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 1), lx = (1 - t) ** 2 * x + 2 * (1 - t) * t * mx + t * t * x2, ly = (1 - t) ** 2 * (top + 6) + 2 * (1 - t) * t * my + t * t * (t2 + 6), c = COL[Math.floor(r() * COL.length)], k = i % 3;
        const g = k === 0 ? `<path d="M-6 0 V22 Q-6 32 4 32 H14 Q18 32 18 26 Q18 20 10 20 H6 V0 Z" fill="${c}" ${O(2.2)}/>` : k === 1 ? fish(0, 18, 0.5, c, 90) : `<path d="M-15 0 H15 L21 9 L13 13 V31 H-13 V13 L-21 9 Z" fill="${c}" ${O(2.2)}/>${paw(0, 20, 0.6, '#fff', 0.75)}`;
        s += `<g transform="translate(${f1(lx)} ${f1(ly)})"><path d="M-3 -2 v6 M3 -2 v6" stroke="${P.woodD}" stroke-width="3"/>${g}</g>`;
      }
      return { svg: s, box: [Math.min(x, x2) - 30, Math.min(top, t2) - 10, Math.max(x, x2) + 30, Math.max(y, y2) + 4] };
    },
    fence(it) {
      const { x, y, x2, y2 } = it;
      if (y === y2) {
        const a = Math.min(x, x2), b = Math.max(x, x2);
        let s = `<path d="M${a} ${y - 40} H${b} M${a} ${y - 18} H${b}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${a} ${y - 40} H${b} M${a} ${y - 18} H${b}" stroke="${P.woodL}" stroke-width="5" stroke-linecap="round"/>`;
        for (let px = a; px <= b + 1; px += 20) s += `<path d="M${px - 6} ${y} V${y - 46} L${px} ${y - 54} L${px + 6} ${y - 46} V${y} Z" fill="${(Math.round(px / 20) % 5) ? '#f0d0a0' : '#ffd0dc'}" ${O(2.6)}/>`;
        return { svg: s, box: [a - 10, y - 60, b + 10, y + 4] };
      }

      const a = Math.min(y, y2), b = Math.max(y, y2);
      let s = `<path d="M${x} ${a - 40} V${b - 40} M${x} ${a - 18} V${b - 18}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${a - 40} V${b - 40} M${x} ${a - 18} V${b - 18}" stroke="${P.woodL}" stroke-width="5" stroke-linecap="round"/>`;
      for (let py = a; py <= b + 1; py += 18) s += `<path d="M${x - 6} ${py} V${py - 46} L${x} ${py - 54} L${x + 6} ${py - 46} V${py} Z" fill="#f0d0a0" ${O(2.6)}/>`;
      return { svg: s, box: [x - 12, a - 60, x + 12, b + 4] };
    },

    wattle(it) {
      const { x, y, x2, y2 } = it, rod = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.woodL}" stroke-width="4" stroke-linecap="round"/>`;
      if (y === y2) {
        const a = Math.min(x, x2), b = Math.max(x, x2); let s = '';
        for (let px = a; px <= b + 1; px += 26) s += `<path d="M${px} ${y + 2} V${y - 52}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${px} ${y + 2} V${y - 52}" stroke="${P.woodD}" stroke-width="4.5" stroke-linecap="round"/>`;
        for (const k of [0, 1, 2]) { const yy = y - 14 - k * 13; let d = `M${a} ${yy}`; for (let px = a; px < b; px += 26) d += ` Q${px + 13} ${yy + (k % 2 ? 6 : -6)} ${Math.min(b, px + 26)} ${yy}`; s += rod(d); }
        return { svg: s, box: [a - 10, y - 62, b + 10, y + 6] };
      }
      const a = Math.min(y, y2), b = Math.max(y, y2);
      let s = rod(`M${x} ${a - 40} V${b - 40} M${x} ${a - 22} V${b - 22}`);
      for (let py = a; py <= b + 1; py += 20) s += `<path d="M${x} ${py + 2} V${py - 52}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x} ${py + 2} V${py - 52}" stroke="${P.woodD}" stroke-width="4.5" stroke-linecap="round"/>`;
      return { svg: s, box: [x - 12, a - 62, x + 12, b + 6] };
    },
    dummy(it) {
      const { x, y } = it;
      const s = `<path d="M${x} ${y} V${y - 50}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${y} V${y - 50}" stroke="${P.woodL}" stroke-width="5"/><path d="M${x - 22} ${y} h44" stroke="${P.woodD}" stroke-width="8" stroke-linecap="round"/>`
        + `<ellipse cx="${x}" cy="${y - 76}" rx="30" ry="36" fill="#b9b2c6" ${O(3.4)}/><circle cx="${x - 18}" cy="${y - 112}" r="14" fill="#b9b2c6" ${O(3)}/><circle cx="${x + 18}" cy="${y - 112}" r="14" fill="#b9b2c6" ${O(3)}/><circle cx="${x - 18}" cy="${y - 112}" r="7" fill="${P.pink}"/><circle cx="${x + 18}" cy="${y - 112}" r="7" fill="${P.pink}"/>`
        + `<path d="M${x - 10} ${y - 86} l6 6 M${x - 4} ${y - 86} l-6 6 M${x + 4} ${y - 86} l6 6 M${x + 10} ${y - 86} l-6 6" stroke="${INK}" stroke-width="2.4"/><circle cx="${x}" cy="${y - 74}" r="4" fill="${P.pink}" ${O(1.8)}/><path d="M${x - 8} ${y - 56} q8 6 16 0" stroke="${INK}" stroke-width="2" fill="none"/><path d="M${x + 26} ${y - 66} q24 8 20 40" fill="none" stroke="${INK}" stroke-width="3"/>`;
      return { svg: s, box: [x - 40, y - 132, x + 52, y + 4] };
    },
    target(it) {
      const { x, y } = it;
      const s = `<path d="M${x - 24} ${y} L${x - 6} ${y - 80} M${x + 24} ${y} L${x + 6} ${y - 80}" stroke="${P.woodD}" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y - 78}" r="34" fill="#fff4e0" ${O(3.4)}/><circle cx="${x}" cy="${y - 78}" r="24" fill="#e8455c" ${O(2.4)}/><circle cx="${x}" cy="${y - 78}" r="13" fill="#fff4e0" ${O(2.2)}/>` + fish(x, y - 78, 0.32, P.gold, 0) + `<path d="M${x + 18} ${y - 92} l18 -10" stroke="${INK}" stroke-width="3"/><path d="M${x + 32} ${y - 86} l8 -10 l4 6 Z" fill="${P.pink}" ${O(1.8)}/>`;
      return { svg: s, box: [x - 40, y - 118, x + 50, y + 4] };
    },
    post(it) {
      const { x, y } = it;
      let s = `<ellipse cx="${x}" cy="${y - 6}" rx="26" ry="9" fill="#a07a4a" ${O(3)}/><rect x="${x - 11}" y="${y - 100}" width="22" height="94" fill="#d8b98a" ${O(3)}/>`;
      for (let py = y - 94; py < y - 8; py += 8) s += `<path d="M${x - 10} ${py} l20 5" stroke="#a07a4a" stroke-width="2.4"/>`;
      s += `<ellipse cx="${x}" cy="${y - 102}" rx="30" ry="10" fill="#c06aa8" ${O(3)}/>`;
      if (it.c) s += kitty(x, y - 106, 0.55, FUR[3], 'loaf'); else s += yarn(x + 22, y - 118, 10, P.gold, false);
      return { svg: s, box: [x - 40, y - 150, x + 40, y + 4] };
    },
    coal(it) { const { x, y } = it, r = rng(x); let s = `<path d="${blob(x, y - 18, 62, 30, r, 9, 0.2)}" fill="#2a2a34" ${O(3.4)}/>`; for (let i = 0; i < 9; i++) s += `<circle cx="${f1(x + (r() - 0.5) * 90)}" cy="${f1(y - 18 + (r() - 0.5) * 36)}" r="${f1(5 + r() * 6)}" fill="#3e3e4c" ${O(2)}/>`; s += `<path d="M${x - 36} ${y - 34} l4 -4 M${x + 20} ${y - 40} l5 -3" stroke="#9fdcff" stroke-width="2.4"/>`; return { svg: s, box: [x - 72, y - 56, x + 72, y + 6] }; },
    woodpile(it) { const { x, y } = it; let s = `<rect x="${x - 70}" y="${y - 6}" width="140" height="8" rx="3" fill="${P.woodD}" ${O(2.4)}/>`; for (let row = 0; row < 3; row++) for (let i = 0; i < 6 - row; i++) { const cx = x - 55 + row * 11 + i * 22, cy = y - 16 - row * 20; s += `<circle cx="${cx}" cy="${cy}" r="11" fill="${P.woodL}" ${O(2.6)}/><circle cx="${cx}" cy="${cy}" r="5" fill="none" stroke="${P.woodD}" stroke-width="1.8"/>`; } return { svg: s, box: [x - 76, y - 74, x + 76, y + 4] }; },
    grind(it) { const { x, y } = it; return { svg: `<path d="M${x - 30} ${y} L${x - 20} ${y - 40} M${x + 30} ${y} L${x + 20} ${y - 40}" stroke="${P.woodD}" stroke-width="7" stroke-linecap="round"/><circle cx="${x}" cy="${y - 52}" r="28" fill="#a0a4b2" ${O(3.4)}/><circle cx="${x}" cy="${y - 52}" r="6" fill="${P.woodD}" ${O(2)}/><path d="M${x + 4} ${y - 52} L${x + 36} ${y - 66}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`, box: [x - 40, y - 90, x + 44, y + 4] }; },
    bucket(it) { const { x, y } = it; return { svg: `<path d="M${x - 14} ${y - 30} H${x + 14} L${x + 10} ${y} H${x - 10} Z" fill="#8a8e9e" ${O(3)}/><ellipse cx="${x}" cy="${y - 30}" rx="14" ry="5" fill="#4ab0ff" ${O(2.4)}/><path d="M${x - 14} ${y - 30} Q${x} ${y - 52} ${x + 14} ${y - 30}" fill="none" stroke="${INK}" stroke-width="2.4"/>`, box: [x - 20, y - 56, x + 20, y + 4] }; },
    haystack(it) { const { x, y } = it; let s = `<path d="M${x - 74} ${y} Q${x - 80} ${y - 70} ${x} ${y - 90} Q${x + 80} ${y - 70} ${x + 74} ${y} Z" fill="#f0c464" ${O(3.6)}/>`; for (let i = 0; i < 9; i++) s += `<path d="M${x - 60 + i * 15} ${y - 10} q4 -24 ${i < 4 ? -6 : 6} -46" stroke="#c99a30" stroke-width="2.4" fill="none"/>`; s += kitty(x + 10, y - 82, 0.55, FUR[2], 'sleep'); return { svg: s, box: [x - 82, y - 130, x + 82, y + 4] }; },
    haycart(it) { const { x, y } = it; let s = `<path d="M${x + 80} ${y - 36} L${x + 140} ${y - 20}" stroke="${P.woodD}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 82} ${y - 56} Q${x - 70} ${y - 120} ${x} ${y - 124} Q${x + 70} ${y - 120} ${x + 82} ${y - 56} Z" fill="#f0c464" ${O(3.4)}/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${x - 60 + i * 17} ${y - 60} q3 -20 ${i < 4 ? -4 : 4} -42" stroke="#c99a30" stroke-width="2.4" fill="none"/>`).join(''); s += `<rect x="${x - 88}" y="${y - 60}" width="176" height="32" rx="5" fill="${P.wood}" ${O(3.4)}/>`; for (const wx of [x - 56, x + 56]) s += `<circle cx="${wx}" cy="${y - 20}" r="20" fill="${P.woodD}" ${O(3.4)}/><circle cx="${wx}" cy="${y - 20}" r="6" fill="${P.gold}" ${O(2)}/>`; return { svg: s, box: [x - 96, y - 130, x + 146, y + 4] }; },
    sack(it) { const { x, y } = it, n = it.n || 1; let s = ''; for (let i = 0; i < n; i++) { const sx = x + (i % 2) * 34 + (i > 1 ? 16 : 0), sy = y - (i > 1 ? 34 : 0); s += `<path d="M${sx - 20} ${sy} Q${sx - 26} ${sy - 34} ${sx - 10} ${sy - 44} L${sx - 14} ${sy - 54} H${sx + 14} L${sx + 10} ${sy - 44} Q${sx + 26} ${sy - 34} ${sx + 20} ${sy} Z" fill="#d8c09a" ${O(3)}/><path d="M${sx - 12} ${sy - 46} h24" stroke="${P.woodD}" stroke-width="3"/>`; if (it.ore) s += `<circle cx="${sx - 4}" cy="${sy - 54}" r="6" fill="#8fd8ff" ${O(1.8)}/><circle cx="${sx + 6}" cy="${sy - 56}" r="5" fill="#c9a2ff" ${O(1.8)}/>`; } return { svg: s, box: [x - 30, y - 100, x + 80, y + 4] }; },
    lotboard(it) { const { x, y } = it; let s = `<path d="M${x - 40} ${y} L${x - 30} ${y - 90} M${x + 40} ${y} L${x + 30} ${y - 90}" stroke="${P.woodD}" stroke-width="6" stroke-linecap="round"/><rect x="${x - 60}" y="${y - 110}" width="120" height="76" rx="6" fill="#3a2a3a" ${O(3.4)}/>` + txt(x, y - 90, 'ЛОТЫ', 14); for (let i = 0; i < 4; i++) s += `<rect x="${x - 52 + i * 26}" y="${y - 78}" width="22" height="32" rx="3" fill="${['#fff4e0', '#ffd0dc', '#e0f0ff', '#fff4a8'][i]}" ${O(1.8)}/><text x="${x - 41 + i * 26}" y="${y - 58}" text-anchor="middle" font-family="Russo One" font-size="10" fill="${INK}">${i + 1}</text>`; return { svg: s, box: [x - 64, y - 116, x + 64, y + 4] }; },
    jailyard(it) { const { x, y } = it; const s = `<rect x="${x - 250}" y="${y - 30}" width="110" height="12" rx="5" fill="${P.woodL}" ${O(3)}/><path d="M${x - 240} ${y - 18} V${y} M${x - 150} ${y - 18} V${y}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><ellipse cx="${x + 120}" cy="${y - 6}" rx="22" ry="8" fill="#c94a3a" ${O(2.6)}/>` + fishbone(x + 120, y - 12, 0.45, 0) + kitty(x - 196, y - 30, 0.62, FUR[9], 'sit') + `<path d="M${x - 211} ${y - 68} h30 l-4 -11 h-22 Z" fill="#2f4c84" ${O(2.2)}/>`; return { svg: s, box: [x - 260, y - 110, x + 150, y + 4] }; },


    garden(it) {
      const { x, y, w, h } = it, r = rng(x * 3), mint = it.crop === 'mint';
      let s = `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="6" fill="#7a5038" ${O(3.4)}/><rect x="${x - w / 2}" y="${y - 12}" width="${w}" height="12" rx="4" fill="${P.wood}" ${O(3)}/>`;
      for (let row = 0; row < 3; row++) for (let i = 0; i < Math.floor(w / 34); i++) {
        const px = x - w / 2 + 20 + i * 34, py = y - h + 20 + row * (h - 30) / 2.4;
        if (mint) {
          const k = 0.85 + r() * 0.3, L = (dx, dy, a, c) => `<ellipse cx="${f1(px + dx * k)}" cy="${f1(py + dy * k)}" rx="${f1(6.5 * k)}" ry="${f1(3.6 * k)}" transform="rotate(${a} ${f1(px + dx * k)} ${f1(py + dy * k)})" fill="${c}" ${O(1.8)}/>`;
          s += `<path d="M${px} ${py + 8} V${f1(py - 12 * k)}" stroke="${P.leafD}" stroke-width="2.6" stroke-linecap="round"/>`
            + L(-6, 4, 25, P.leafD) + L(6, 4, -25, P.leafD) + L(-5, -3, 30, P.leaf) + L(5, -3, -30, P.leaf) + L(-3, -10, 40, '#9fe39a') + L(3, -10, -40, '#9fe39a');
        } else s += row === 1 ? `<path d="M${px} ${py + 4} l-8 -14 M${px} ${py + 4} l0 -16 M${px} ${py + 4} l8 -14" stroke="${P.leaf}" stroke-width="3.4" stroke-linecap="round"/><path d="M${px - 4} ${py + 4} h8 l-4 10 Z" fill="#ff9a3a" ${O(1.8)}/>` : `<circle cx="${px}" cy="${py}" r="11" fill="${r() < 0.5 ? P.leafL : '#9fe39a'}" ${O(2.6)}/><path d="M${px - 6} ${py} q6 -6 12 0" stroke="${P.leafD}" stroke-width="2" fill="none"/>`;
      }
      const lab = mint ? 'МЯТА' : 'ОГОРОД', sw = 12 + lab.length * 8, sx = x + w / 2 - 14;
      s += `<rect x="${sx - sw / 2}" y="${y - h - 30}" width="${sw}" height="22" rx="4" fill="#fff4e0" ${O(2)}/><text x="${sx}" y="${y - h - 15}" text-anchor="middle" font-family="Russo One" font-size="10" fill="${INK}">${lab}</text><path d="M${sx} ${y - h - 8} V${y - h + 6}" stroke="${P.woodD}" stroke-width="3"/>`;
      return { svg: s, box: [Math.min(x - w / 2, sx - sw / 2) - 6, y - h - 40, Math.max(x + w / 2, sx + sw / 2) + 6, y + 4] };
    },
    mailbox(it) { const { x, y } = it; return { svg: `<rect x="${x - 4}" y="${y - 70}" width="8" height="70" fill="${P.wood}" ${O(2.6)}/>` + fish(x, y - 80, 0.75, '#4ab0ff', 0) + `<path d="M${x + 6} ${y - 98} v-14 h12 v8 h-12" fill="#e8455c" ${O(2)}/>`, box: [x - 30, y - 116, x + 34, y + 4] }; },
    tables(it) { const { x, y } = it; let s = ''; for (const tx of [x - 95, x + 95]) { s += `<rect x="${tx - 55}" y="${y - 52}" width="110" height="14" rx="5" fill="${P.woodL}" ${O(3)}/><path d="M${tx - 44} ${y - 38} V${y} M${tx + 44} ${y - 38} V${y}" stroke="${P.woodD}" stroke-width="7" stroke-linecap="round"/><path d="M${tx - 70} ${y - 20} H${tx - 56} M${tx + 56} ${y - 20} H${tx + 70}" stroke="${P.woodD}" stroke-width="7" stroke-linecap="round"/>`; s += `<rect x="${tx - 30}" y="${y - 72}" width="18" height="20" rx="3" fill="${P.gold}" ${O(2.4)}/><path d="M${tx - 32} ${y - 72} q11 -8 22 0" fill="#fff" ${O(1.8)}/>` + fish(tx + 22, y - 60, 0.4, '#8fb6c8', 0); } s += `<path d="M${x} ${y} V${y - 130}" stroke="${P.woodD}" stroke-width="6"/><path d="M${x - 80} ${y - 112} Q${x} ${y - 170} ${x + 80} ${y - 112} Z" fill="#d04a4a" ${O(3.4)}/><path d="M${x - 40} ${y - 112} Q${x} ${y - 164} ${x} ${y - 140} Q${x} ${y - 164} ${x + 40} ${y - 112} Z" fill="${P.cream}" ${O(2.4)}/>`; return { svg: s, box: [x - 160, y - 180, x + 160, y + 4] }; },
    reeds(it) { const { x, y } = it; let s = ''; for (let i = 0; i < 6; i++) { const rx = x - 24 + i * 10, h = 40 + (i * 13) % 26; s += `<path d="M${rx} ${y} q${i % 2 ? 4 : -4} ${-h / 2} ${i % 2 ? 2 : -2} ${-h}" stroke="${P.leafD}" stroke-width="4" fill="none" stroke-linecap="round"/>`; if (i % 2) s += `<rect x="${rx - 3}" y="${y - h - 14}" width="8" height="18" rx="4" fill="${P.woodD}" ${O(1.8)}/>`; } return { svg: s, box: [x - 34, y - 80, x + 40, y + 4] }; },
    fisher(it, o) {
      const { x, y } = it;
      let s = `<path d="M${x + 20} ${y - 50} Q${x - 60} ${y - 150} ${x - 120} ${y - 110}" fill="none" stroke="${P.woodD}" stroke-width="4" stroke-linecap="round"/><path d="M${x - 120} ${y - 110} V${y - 34}" stroke="#d8cbb0" stroke-width="2"/><circle cx="${x - 120}" cy="${y - 34}" r="5" fill="#e8455c" ${O(1.8)}/>`;
      s += o.guy ? o.guy('рыбак котофей', { hat: 'straw', shape: 'ball', color: '#f2a65a' }, 0.5, x + 10, y) : kitty(x + 10, y, 0.85, '#f2a65a', 'sit');
      s += `<path d="M${x + 40} ${y - 26} H${x + 66} L${x + 62} ${y} H${x + 44} Z" fill="#8a8e9e" ${O(2.6)}/>` + fish(x + 54, y - 30, 0.32, '#8fb6c8', -60);
      return { svg: s, box: [x - 130, y - 160, x + 80, y + 4] };
    },
    telescope(it) { const { x, y } = it; return { svg: `<path d="M${x - 26} ${y} L${x} ${y - 56} L${x + 26} ${y} M${x} ${y - 56} V${y - 4}" stroke="${P.woodD}" stroke-width="5" stroke-linecap="round"/><g transform="translate(${x} ${y - 60}) rotate(-34)"><rect x="-40" y="-11" width="90" height="22" rx="7" fill="${P.gold}" ${O(3)}/><rect x="40" y="-14" width="18" height="28" rx="4" fill="#a07a1a" ${O(3)}/><path d="M-30 -11 v22 M-10 -11 v22" stroke="#a07a1a" stroke-width="3"/></g>`, box: [x - 50, y - 120, x + 60, y + 4] }; },
    rock(it) { const { x, y } = it, s = it.s || 1, r = rng(x + y); return { svg: `<path d="${blob(x, y - 18 * s, 46 * s, 26 * s, r, 8, 0.18)}" fill="${P.rock}" ${O(3.4)}/><path d="M${x - 24 * s} ${y - 28 * s} q14 -12 34 -8" stroke="#e6d8d0" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${x + 6 * s} ${y - 40 * s} q8 6 4 14" stroke="${P.leaf}" stroke-width="6" fill="none" stroke-linecap="round"/>`, box: [x - 54 * s, y - 50 * s, x + 54 * s, y + 4] }; },
    wagon(it) { const { x, y } = it; let s = `<path d="M${x - 56} ${y - 74} H${x + 56} L${x + 44} ${y - 22} H${x - 44} Z" fill="#7a7e90" ${O(3.6)}/><path d="M${x - 50} ${y - 60} H${x + 50} M${x - 46} ${y - 40} H${x + 46}" stroke="#5a5e70" stroke-width="3"/><rect x="${x - 60}" y="${y - 80}" width="120" height="10" rx="3" fill="#8a8e9e" ${O(3)}/>`; if (it.ore) for (const [dx, dy, c] of [[-30, -88, '#8fd8ff'], [-10, -94, '#4a4a58'], [10, -90, '#c9a2ff'], [30, -86, '#4a4a58'], [0, -84, '#ffe27a']]) s += `<path d="M${x + dx - 12} ${y + dy + 8} L${x + dx - 6} ${y + dy - 6} L${x + dx + 8} ${y + dy - 4} L${x + dx + 12} ${y + dy + 8} Z" fill="${c}" ${O(2.4)}/>`; for (const wx of [x - 30, x + 30]) s += `<circle cx="${wx}" cy="${y - 14}" r="13" fill="#3a3a48" ${O(3)}/><circle cx="${wx}" cy="${y - 14}" r="4" fill="#c9ccd6"/>`;

      if (!it.a) return { svg: s, box: [x - 66, y - 110, x + 66, y + 4] };
      const c = Math.cos(it.a * Math.PI / 180), sn = Math.sin(it.a * Math.PI / 180), cs = [[-66, -110], [66, -110], [66, 4], [-66, 4]].map(([dx, dy]) => [x + dx * c - dy * sn, y + dx * sn + dy * c]);
      return { svg: `<g transform="rotate(${it.a} ${x} ${y})">${s}</g>`, box: [Math.floor(Math.min(...cs.map((q) => q[0]))), Math.floor(Math.min(...cs.map((q) => q[1]))), Math.ceil(Math.max(...cs.map((q) => q[0]))), Math.ceil(Math.max(...cs.map((q) => q[1])))] }; },
    orepile(it) { const { x, y } = it, r = rng(x); let s = `<path d="${blob(x, y - 20, 70, 32, r, 9, 0.2)}" fill="#6a6070" ${O(3.4)}/>`; for (let i = 0; i < 12; i++) { const cx = x + (r() - 0.5) * 110, cy = y - 20 + (r() - 0.5) * 40, c = ['#8fd8ff', '#c9a2ff', '#ffe27a', '#ffb3d1', '#5a5262', '#7a7082'][Math.floor(r() * 6)]; s += `<path d="M${f1(cx - 9)} ${f1(cy + 6)} L${f1(cx - 4)} ${f1(cy - 7)} L${f1(cx + 7)} ${f1(cy - 5)} L${f1(cx + 9)} ${f1(cy + 6)} Z" fill="${c}" ${O(2.2)}/>`; } return { svg: s, box: [x - 80, y - 62, x + 80, y + 6] }; },
    picks(it) { const { x, y } = it; let s = barrel1(x, y, P.woodD); for (const [a, c] of [[-14, '#c9ccd6'], [10, '#c9ccd6']]) s += `<g transform="translate(${x} ${y - 50}) rotate(${a})"><path d="M0 10 V-56" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M0 10 V-56" stroke="${P.woodL}" stroke-width="4" stroke-linecap="round"/><path d="M-26 -50 Q0 -70 26 -50" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-26 -50 Q0 -70 26 -50" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/></g>`; return { svg: s, box: [x - 46, y - 130, x + 46, y + 4] }; },
    minesign(it) { const { x, y } = it; return { svg: `<rect x="${x - 5}" y="${y - 90}" width="10" height="90" fill="${P.wood}" ${O(2.6)}/><path d="M${x - 50} ${y - 104} L${x} ${y - 140} L${x + 50} ${y - 104} Z" fill="#ffd34d" ${O(3.4)}/><text x="${x}" y="${y - 110}" text-anchor="middle" font-family="Russo One" font-size="22" fill="${INK}">!</text><rect x="${x - 62}" y="${y - 100}" width="124" height="26" rx="5" fill="#fff4e0" ${O(2.6)}/><text x="${x}" y="${y - 82}" text-anchor="middle" font-family="Russo One" font-size="11" fill="${INK}">ВАГОНЕТКИ!</text>`, box: [x - 66, y - 146, x + 66, y + 4] }; },
    picnic(it) {
      const { x, y } = it;
      let s = `<path d="M${x - 86} ${y} L${x - 70} ${y - 50} H${x + 70} L${x + 86} ${y} Z" fill="#e8455c" ${O(3.4)}/>`;
      for (let i = 1; i < 6; i++) s += `<path d="M${f1(x - 86 + i * 28.7)} ${y} L${f1(x - 70 + i * 23.3)} ${y - 50}" stroke="#fff4e0" stroke-width="6" opacity=".85"/>`;
      for (let j = 1; j < 3; j++) s += `<path d="M${f1(x - 86 + j * 5.3)} ${f1(y - j * 16.7)} H${f1(x + 86 - j * 5.3)}" stroke="#fff4e0" stroke-width="6" opacity=".85"/>`;
      s += `<path d="M${x - 50} ${y - 20} h44 l-4 -24 h-36 Z" fill="${P.woodL}" ${O(3)}/><path d="M${x - 46} ${y - 44} q18 -24 36 0" fill="none" stroke="${P.woodD}" stroke-width="4"/>` + fish(x - 28, y - 44, 0.45, '#8fb6c8', -15) + milk(x + 10, y - 16, 0.6) + kitty(x + 50, y - 16, 0.55, FUR[3], 'sleep');
      return { svg: s, box: [x - 92, y - 80, x + 92, y + 4] };
    },

    rowan(it) { const s = it.s || 1; return { svg: rowanTree(it.x, it.y, s, it.x * 3 + it.y, !!it.ring), box: [it.x - (it.ring ? 96 : 70) * s, it.y - 170 * s, it.x + (it.ring ? 96 : 70) * s, it.y + (it.ring ? 26 * s : 6)] }; },
    hives(it) { const n = it.n || 3; return { svg: hivesSvg(it.x, it.y, n), box: [it.x - n * 27 - 14, it.y - 120, it.x + n * 27 + 14, it.y + 4] }; },
    racks(it) { return { svg: racksSvg(it.x, it.y), box: [it.x - 76, it.y - 112, it.x + 76, it.y + 6] }; },
    tree(it) { return { svg: tree(it.x, it.y, it.s, it.x + it.y, 'tree'), box: [it.x - 80 * it.s, it.y - 170 * it.s, it.x + 80 * it.s, it.y + 6] }; },
    blossom(it) { return { svg: tree(it.x, it.y, it.s, it.x + it.y, 'blossom'), box: [it.x - 80 * it.s, it.y - 170 * it.s, it.x + 80 * it.s, it.y + 6] }; },
    pine(it) { return { svg: pine(it.x, it.y, it.s, it.x + it.y), box: [it.x - 72 * it.s, it.y - 200 * it.s, it.x + 72 * it.s, it.y + 6] }; },
    bush(it) { return { svg: bush(it.x, it.y, 1, it.x + it.y), box: [it.x - 46, it.y - 50, it.x + 46, it.y + 4] }; },
  };

   
  function shade(G, list) {
    for (const t of list) {
      if (t.k === 'lamp') { G.put(2, t.x, t.y, `<ellipse cx="${t.x}" cy="${t.y + 6}" rx="170" ry="96" fill="url(#fcPool)"/><ellipse cx="${t.x + 8}" cy="${t.y + 2}" rx="18" ry="6" fill="${INK}" opacity=".25"/>`); continue; }
      const sz = { tree: [62, 18], blossom: [62, 18], pine: [56, 16], bush: [44, 12], well: [96, 30], cart: [80, 14], bench: [60, 10], haystack: [80, 16], haycart: [96, 16], wagon: [64, 12], dummy: [26, 8], target: [30, 8], post: [30, 9], telescope: [34, 8], rock: [50, 14], crate: [50, 10], barrel: [26, 8], box: [40, 10], rowan: [58, 17], hives: [70, 10], racks: [64, 8] }[t.k];
      if (sz) G.put(2, t.x, t.y, `<ellipse cx="${t.x + sz[0] * 0.18}" cy="${t.y + 4}" rx="${t.ring ? f1(sz[0] * (t.s || 1) * 1.5) : sz[0] * (t.s || 1)}" ry="${t.ring ? f1(sz[1] * 1.6) : sz[1]}" fill="${INK}" opacity=".2"/>`);
    }
  }


  



  const BASE = Object.freeze({ ...P });
  const BIOME = {
    meadow: {},
    forest: { forest: '#2f5a35', forestD: '#24472a', grass: '#74a256', grassD: '#5e8c46', grassL: '#8fbb66', plat: '#86b562', platD: '#6f9d50', platL: '#a2c97a', leaf: '#4f8f45', leafD: '#356a31', leafL: '#7db862' },
    taiga: { forest: '#2a4a3a', forestD: '#1f3a2d', grass: '#7f9c6a', grassD: '#67855a', grassL: '#9ab585', plat: '#8aa676', platD: '#738f61', platL: '#a6bf93', leaf: '#3f7448', leafD: '#2c5734', leafL: '#5f9466' },
    ice: { forest: '#6f8fa8', forestD: '#5a7891', grass: '#e6f0f6', grassD: '#c3d6e3', grassL: '#ffffff', plat: '#edf4f9', platD: '#cddde8', platL: '#ffffff', leaf: '#5f8a8f', leafD: '#46696e', leafL: '#9cc4c8',
      water: '#8fc9e0', waterD: '#6aa8c6', waterL: '#d4f0fa', path: '#c9d6e0', pathD: '#a6b6c4', pathL: '#e8f0f6', rock: '#a9b4c0', rockD: '#86929f', rockDD: '#66717e', rockL: '#c9d2dc', sand: '#dfe8ef' },
    mount: { grass: '#8fa86a', grassD: '#77915a', grassL: '#a9c084', plat: '#9cb176', platD: '#849a63', platL: '#b5c892', rock: '#a39890', rockD: '#82766f', rockDD: '#625853', rockL: '#c2b8b0' },
    swamp: { forest: '#3c5a3a', forestD: '#2e4a2d', grass: '#7c9455', grassD: '#657d46', grassL: '#96ad6c', plat: '#87a060', platD: '#708a4f', platL: '#a1b878', water: '#5f8f7a', waterD: '#4a7563', waterL: '#8fb8a4',
      path: '#b59f78', pathD: '#93805d', pathL: '#cdbb96', sand: '#bfae84' },
    coast: { grass: '#8fbf6a', grassD: '#77a656', grassL: '#a8d384', water: '#3fa6cf', waterD: '#2a86b0', waterL: '#8fd8ef', sand: '#f0dba6', path: '#e6cf9c', pathD: '#c4ab79', pathL: '#f4e3bd' },
    desert: { forest: '#c9a56a', forestD: '#b08c55', grass: '#e8c98c', grassD: '#d4b072', grassL: '#f4dca8', plat: '#eed4a0', platD: '#d8b97f', platL: '#f8e6bf', leaf: '#7fa04a', leafD: '#5d7d34', leafL: '#a4c56c',
      path: '#d9b679', pathD: '#b8955a', pathL: '#ecd2a0', sand: '#f2dcaa', rock: '#c9a586', rockD: '#a6836a', rockDD: '#82644f', rockL: '#e0c3a6' },
    ash: { forest: '#3a3436', forestD: '#2b2628', grass: '#8a8078', grassD: '#726963', grassL: '#a39a91', plat: '#968c83', platD: '#7d746c', platL: '#aea59c', leaf: '#5f6a4e', leafD: '#454e38', leafL: '#7f8a6a',
      water: '#d46a3a', waterD: '#b04a28', waterL: '#f4a06a', rock: '#6e6564', rockD: '#544c4c', rockDD: '#3e3838', rockL: '#8c8382', sand: '#9a8f86' },
    ruin: { grass: '#8ea562', grassD: '#768d50', grassL: '#a7bd7c', pave: '#cbb8a2', paveD: '#a8937c', paveL: '#e0d1bf', rock: '#a89c92', rockD: '#867a71', rockL: '#c4b9b0' },
    blight: { forest: '#3a2f45', forestD: '#2c2336', grass: '#7a7a6a', grassD: '#646455', grassL: '#929282', plat: '#86866f', platD: '#6f6f5b', platL: '#9e9e88', leaf: '#5a5a6e', leafD: '#424255', leafL: '#7a7a90',
      water: '#6a8a5a', waterD: '#4f6e43', waterL: '#9ab88a' },
  };
  const NATURE = { meadow: { tree: 5, blossom: 2, pine: 2 }, forest: { tree: 6, pine: 3 }, taiga: { pine: 8, tree: 1 }, ice: { pine: 6 }, mount: { pine: 6, tree: 2 }, swamp: { tree: 3, dark: 2 },
    coast: { tree: 4, blossom: 1, pine: 1 }, desert: { dark: 1 }, ash: { dark: 4 }, ruin: { tree: 4, dark: 2 }, blight: { dark: 6 } };
  const FX = { ice: 'snow', ash: 'ember', swamp: 'firefly', desert: 'sand', blight: 'mote' };
  const BIOMES = Object.keys(BIOME);
   
  const pal = (biome) => ({ ...BASE, ...(BIOME[biome] || {}) });


  function natureTree(biome, r) { const N = (biome && typeof biome === 'object' ? biome : NATURE[biome]) || NATURE.meadow, sum = Object.values(N).reduce((a, b) => a + b, 0); let q = r() * sum; for (const [k, v] of Object.entries(N)) { q -= v; if (q < 0) return k; } return 'tree'; }


  function fogTree(k, x, y, s, seed) {
    const r = rng(seed * 7919 + 13), trunk = `<rect x="${f1(x - 7 * s)}" y="${f1(y - 34 * s)}" width="${f1(14 * s)}" height="${f1(36 * s)}" rx="3" fill="${P.woodD}" ${O(3)}/>`;
    if (k === 'pine') { let d = ''; for (let i = 0; i < 3; i++) { const w = (66 - i * 14) * s, b = y - (24 + i * 46) * s, t = b - (70 - i * 8) * s; d += `M${f1(x - w)} ${f1(b)} Q${f1(x)} ${f1(b + 12 * s)} ${f1(x + w)} ${f1(b)} L${f1(x + 6 * s)} ${f1(t + 6 * s)} Q${f1(x)} ${f1(t - 4 * s)} ${f1(x - 6 * s)} ${f1(t + 6 * s)} Z `; } return trunk + `<path d="${d}" fill="#2a5432" ${O(3.2)}/>`; }
    return trunk + `<path d="${blob(x, y - 86 * s, 66 * s, 56 * s, r, 10, 0.12)}" fill="#33603a" ${O(3.5)}/>`;
  }
  function natureSvg(k, x, y, s, seed) { if (k === 'rowan') return rowanTree(x, y, s * 0.95, seed); return k === 'pine' ? pine(x, y, s, seed, false) : k === 'dark' ? (seed % 3 ? tree(x, y, s, seed, 'dark') : pine(x, y, s, seed, true)) : tree(x, y, s, seed, k === 'blossom' ? 'blossom' : 'tree'); }

   

  function cliff(G, t, seed = 777) {
    const r = rng(seed), RIM = t.rim, FH = t.face || 150, rim = (x) => M.rimY(RIM, x), X0 = RIM[0][0], X1 = RIM[RIM.length - 1][0];
    const ys = RIM.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const top = RIM.map(([x, y]) => [x, y - 2]), bot = RIM.map(([x, y]) => [x, y + FH]).reverse();
    let s = `<path d="${poly(bot.map(([x, y]) => [x, y + 26]).reverse().concat(bot.map(([x, y]) => [x, y - 4])))}" fill="${INK}" opacity=".24"/>`;
    s += `<path d="${poly(top.concat(bot))}" fill="${P.rockDD}" ${O(4)}/>`;
    for (const sd of t.sides || []) s += `<path d="${poly(sd)}" fill="${P.rockD}" ${O(4)}/>`;
    G.big(3, [X0 - 60, y0 - 40, X1 + 20, y1 + FH + 60], s);

    const ROWS = 4, RH = FH / ROWS;
    for (let k = 0; k < ROWS; k++) {
      let x = X0 + 2 - (k % 2 ? 26 : 0);
      while (x < X1) {
        const w = 44 + r() * 46, xa = Math.max(X0 + 2, x + 2.5), xb = Math.min(X1 - 2, x + w - 2.5);
        if (xb - xa > 10) {
          const ya = (xx) => rim(xx) + k * RH + 3, yb = (xx) => rim(xx) + (k + 1) * RH - 3, m = (xa + xb) / 2;
          const d = `M${f1(xa + 6)} ${f1(ya(xa))} Q${f1(m)} ${f1(ya(m) - 2)} ${f1(xb - 6)} ${f1(ya(xb))} Q${f1(xb)} ${f1(ya(xb))} ${f1(xb)} ${f1(ya(xb) + 6)} L${f1(xb)} ${f1(yb(xb) - 6)} Q${f1(xb)} ${f1(yb(xb))} ${f1(xb - 6)} ${f1(yb(xb))} Q${f1(m)} ${f1(yb(m) + 2)} ${f1(xa + 6)} ${f1(yb(xa))} Q${f1(xa)} ${f1(yb(xa))} ${f1(xa)} ${f1(yb(xa) - 6)} L${f1(xa)} ${f1(ya(xa) + 6)} Q${f1(xa)} ${f1(ya(xa))} ${f1(xa + 6)} ${f1(ya(xa))} Z `;
          const shadeC = k === 0 ? [P.rockL, P.rock][r() < 0.7 ? 0 : 1] : k === 1 ? [P.rock, P.rockL, mix(P.rock, P.rockD, 0.4)][Math.floor(r() * 3)] : k === 2 ? [P.rock, P.rockD, mix(P.rock, P.rockD, 0.6)][Math.floor(r() * 3)] : [P.rockD, mix(P.rockD, P.rockDD, 0.5)][r() < 0.6 ? 0 : 1];
          G.brush(4, m, rim(m) + k * RH, `<path d="%D" fill="${shadeC}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" stroke-opacity=".75"/>`, d);
          if (k < 2 && r() < 0.5) G.brush(4, m, rim(m) + k * RH, `<path d="%D" fill="none" stroke="${lt(P.rockL, 0.4)}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`, `M${f1(xa + 8)} ${f1(ya(xa) + 7)} Q${f1(xa + 14)} ${f1(ya(xa) + 4)} ${f1(Math.min(xb - 6, xa + 26))} ${f1(ya(xa) + 4)} `);
        }
        x += w;
      }
    }

    let d = '', hang = '', fl = '';
    const pts = []; for (let x = X0 - 6; x <= X1 + 4; x += 22) pts.push([x, rim(x)]);
    d = `M${pts[0][0]} ${f1(pts[0][1] - 10)} ` + pts.map(([x, y]) => `L${f1(x)} ${f1(y - 10)}`).join(' ') + ` L${X1 + 4} ${f1(rim(X1) + 8)} `;
    for (let i = pts.length - 1; i > 0; i--) { const [xa, ya] = pts[i], [xb, yb] = pts[i - 1], bump = 8 + r() * 8; d += `Q${f1((xa + xb) / 2)} ${f1((ya + yb) / 2 + bump + 6)} ${f1(xb)} ${f1(yb + 6)} `; if (r() < 0.18) hang += `M${f1((xa + xb) / 2)} ${f1((ya + yb) / 2 + 12)} q${f1(-3 + r() * 6)} ${f1(14 + r() * 20)} ${f1(-2 + r() * 4)} ${f1(26 + r() * 26)} `; if (r() < 0.12) fl += `M${f1(xa)} ${f1(ya + 4)} a4 4 0 1 0 0.1 0 `; }
    d += 'Z';
    G.big(5, [X0 - 40, y0 - 40, X1 + 40, y1 + 80], `<path d="${hang}" fill="none" stroke="${P.leafD}" stroke-width="5" stroke-linecap="round"/><path d="${hang}" fill="none" stroke="${P.leaf}" stroke-width="2.4" stroke-linecap="round"/><path d="${d}" fill="${P.plat}" ${O(3.5)}/><path d="${fl}" fill="#fff4e0" stroke="${INK}" stroke-width="1.6"/>`);
  }

  function rockFace(G, t, seed = 9090) {
    const r = rng(seed), MR = t.rim, FH = t.face || 140, mrim = (x) => M.rimY(MR, x), bx = M.boxOf({ p: t.poly });
    let s = `<path d="${poly(t.poly)}" fill="${mix(P.rock, P.rockL, 0.4)}" ${O(4)}/>`;
    for (let i = 0; i < 6; i++) { const x = bx[0] + r() * (bx[2] - bx[0]), y = bx[1] + 40 + r() * Math.max(10, bx[3] - bx[1] - 120); if (M.inPoly(t.poly, x, y)) s += `<path d="${blob(x, y, 70, 26, r, 9, 0.2)}" fill="${P.platD}" opacity=".85"/>`; }
    for (let i = 0; i < 8; i++) { const x = bx[0] + r() * (bx[2] - bx[0]), y = bx[1] + 30 + r() * Math.max(10, bx[3] - bx[1] - 100), k = 0.7 + r() * 0.5; if (M.inPoly(t.poly, x, y) && y < mrim(x) - 40) s += `<path d="${blob(x, y, 30 * k, 20 * k, r, 7, 0.22)}" fill="${P.rock}" ${O(3)}/><path d="M${f1(x - 16 * k)} ${f1(y - 8 * k)} q10 -8 22 -6" stroke="${P.rockL}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }
    G.big(7, [bx[0] - 20, bx[1] - 60, bx[2] + 20, bx[3] + 40], s);

    const clr = (x, y) => (t.clear || []).some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1);
    const trees = []; for (let i = 0; i < Math.round((bx[2] - bx[0]) * (bx[3] - bx[1]) / 9000); i++) { const x = bx[0] + r() * (bx[2] - bx[0]), y = bx[1] + r() * (bx[3] - bx[1]); if (!M.inPoly(t.poly, x, y) || y > mrim(x) - 40 || clr(x, y)) continue; trees.push([x, y]); }
    trees.sort((a, b) => a[1] - b[1]);
    if (trees.length) G.big(7, [bx[0] - 80, bx[1] - 200, bx[2] + 80, bx[3] + 10], trees.map(([x, y], i) => pine(x, y, 0.65 + (i % 5) * 0.06, i + 5 + seed, i % 3 === 0)).join(''));

    const top = MR.map(([x, y]) => [x, y - 2]), bot = MR.map(([x, y]) => [x, y + FH]).reverse(), X0 = MR[0][0], X1 = MR[MR.length - 1][0], ys = MR.map((p) => p[1]);
    let f = `<path d="${poly(bot.map(([x, y]) => [x, y + 24]).reverse().concat(bot.map(([x, y]) => [x, y - 4])))}" fill="${INK}" opacity=".26"/><path d="${poly(top.concat(bot))}" fill="${P.rockDD}" ${O(4)}/>`;
    const ROWS = 3, RH = FH / ROWS; let A = '', B = '', C = '';
    for (let k = 0; k < ROWS; k++) { let x = X0 + 4 - (k % 2 ? 30 : 0); while (x < X1) { const w = 58 + r() * 50, xa = Math.max(X0 + 4, x + 3), xb = Math.min(X1 - 2, x + w - 3); if (xb - xa > 12) { const ya = mrim(xa) + k * RH + 3, yb = mrim(xb) + k * RH + 3, d = `M${f1(xa + 8)} ${f1(ya)} L${f1(xb - 8)} ${f1(yb)} Q${f1(xb)} ${f1(yb)} ${f1(xb)} ${f1(yb + 8)} L${f1(xb)} ${f1(yb + RH - 14)} Q${f1(xb)} ${f1(yb + RH - 6)} ${f1(xb - 8)} ${f1(yb + RH - 6)} L${f1(xa + 8)} ${f1(ya + RH - 6)} Q${f1(xa)} ${f1(ya + RH - 6)} ${f1(xa)} ${f1(ya + RH - 14)} L${f1(xa)} ${f1(ya + 8)} Q${f1(xa)} ${f1(ya)} ${f1(xa + 8)} ${f1(ya)} Z `; const q = r(); if (k === 0 ? q < 0.6 : q < 0.25) A += d; else if (k < 2 ? q < 0.85 : q < 0.7) B += d; else C += d; } x += w; } }
    f += `<path d="${A}" fill="${P.rockL}" stroke="${INK}" stroke-width="2.4" stroke-opacity=".75"/><path d="${B}" fill="${P.rock}" stroke="${INK}" stroke-width="2.4" stroke-opacity=".75"/><path d="${C}" fill="${P.rockD}" stroke="${INK}" stroke-width="2.4" stroke-opacity=".75"/>`;
    { const pts = []; for (let x = X0; x <= X1; x += 26) pts.push([x, mrim(x)]); let d = `M${pts[0][0]} ${f1(pts[0][1] - 8)} ` + pts.map(([x, y]) => `L${f1(x)} ${f1(y - 8)}`).join(' '); for (let i = pts.length - 1; i > 0; i--) { const [xa, ya] = pts[i], [xb, yb] = pts[i - 1]; d += ` Q${f1((xa + xb) / 2)} ${f1((ya + yb) / 2 + 10 + r() * 6)} ${f1(xb)} ${f1(yb + 4)}`; } f += `<path d="${d} Z" fill="${P.rockL}" ${O(3.5)}/>`; }
    for (let i = 0; i < Math.max(2, Math.round((X1 - X0) / 220)); i++) { const x = X0 + 60 + r() * (X1 - X0 - 120), y = mrim(x) + 40 + r() * (FH - 70), c = ['#8fd8ff', '#c9a2ff', '#ffb3d1', '#ffe27a'][Math.floor(r() * 4)]; f += `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-10 6 L-6 -16 L0 -26 L6 -16 L10 6 Z" fill="${c}" ${O(2.6)}/><path d="M6 6 L12 -6 L18 6 Z M-10 6 L-16 -4 L-20 6 Z" fill="${c}" ${O(2.4)}/><path d="M-2 -14 L0 -22" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`; }
    G.big(7, [X0 - 20, Math.min(...ys) - 30, X1 + 20, Math.max(...ys) + FH + 40], f);
  }

  function pondBase(w) {
    const d = smooth(w.poly), bx = M.boxOf({ p: w.poly }), cx = (bx[0] + bx[2]) / 2, cy = (bx[1] + bx[3]) / 2;
    return `<path d="${d}" fill="${P.sand}" stroke="${P.sand}" stroke-width="34" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${P.pathD}" stroke-width="40" stroke-linejoin="round" opacity=".25"/><path d="${d}" fill="${P.sand}" stroke="${P.sand}" stroke-width="30" stroke-linejoin="round"/>`
      + `<path d="${d}" fill="${P.water}" ${O(4)}/><path d="${smooth(w.poly.map(([x, y]) => [cx + (x - cx) * 0.62, cy + (y - cy) * 0.62]))}" fill="${P.waterD}" opacity=".55"/>`;
  }
  function pondDeco(G, w, seed) {
    const r = rng(seed), bx = M.boxOf({ p: w.poly }); let s = '';
    for (let i = 0; i < Math.max(3, Math.round((bx[2] - bx[0]) / 120)); i++) { const x = bx[0] + 40 + r() * (bx[2] - bx[0] - 80), y = bx[1] + 30 + r() * (bx[3] - bx[1] - 60); if (!M.inPoly(w.poly, x, y)) continue; if (r() < 0.5) s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(0.7 + r() * 0.4)})"><path d="M0 0 L22 -6 A24 14 0 1 1 22 6 Z" fill="${P.leaf}" ${O(2.6)}/>${r() < 0.5 ? `<circle cx="-4" cy="-2" r="6" fill="${P.pink}" ${O(2)}/>` : ''}</g>`; else s += `<path d="M${f1(x - 26)} ${f1(y)} q26 -10 52 0 M${f1(x - 14)} ${f1(y + 10)} q14 -6 28 0" fill="none" stroke="${P.waterL}" stroke-width="3" stroke-linecap="round" opacity=".8"/>`; }
    for (const b of w.bridges || []) for (const q of b.rects) { s += `<rect x="${q[0]}" y="${q[1] + 10}" width="${q[2] - q[0]}" height="${q[3] - q[1]}" fill="${INK}" opacity=".25"/><rect x="${q[0]}" y="${q[1]}" width="${q[2] - q[0]}" height="${q[3] - q[1]}" rx="6" fill="${P.wood}" ${O(4)}/>`; let pl = ''; for (let x = q[0] + 20; x < q[2]; x += 22) pl += `M${x} ${q[1] + 3} V${q[3] - 3} `; s += `<path d="${pl}" stroke="${P.woodD}" stroke-width="2.4" opacity=".8"/>`; }
    G.big(1, [bx[0] - 30, bx[1] - 30, bx[2] + 30, bx[3] + 30], s);
  }

  



  const KIND = { forge: { roof: 'red', wall: '#f3d3a5', fire: 1 }, anvil: { roof: 'red', fire: 1 }, shop: { roof: 'teal', awn: 1 }, tent: { roof: 'pink', awn: 1 }, trainer: { roof: 'blue' },
    magic: { roof: 'night', tower: 1 }, hall: { roof: 'plum', tower: 1 }, auction: { roof: 'plum' }, storage: { roof: 'mustard' }, jail: { roof: 'blue' }, board: { roof: 'red' } };
  const WALLH = [62, 76, 94, 110, 126], ROOFH = [52, 60, 70, 80, 90];
  

  function bGeom(b, lv) {
    lv = Math.max(1, Math.min(5, Math.round(+lv || 1)));
    const [vx0, vy0, vx1, B] = M.plotOf(b, lv).vis, dx = 40, cx = b.door.x, w = Math.max(110, vx1 - vx0 - dx - 20);
    const x0 = Math.round(Math.max(vx0 + 10, Math.min(vx1 - dx - 10 - w, cx - w / 2))), x1 = x0 + w;
    const wt = Math.max(vy0 + ROOFH[lv - 1] + 30, B - WALLH[lv - 1]), rY = wt - ROOFH[lv - 1];
    return { w, x0, x1, wt, rY, B, dx, cx, lv };
  }
  function building(b, o = {}) {
    const lv = Math.max(1, Math.min(5, Math.round(+o.lv || 1))), k = KIND[b.id] || {}, R = ROOF[b.roof || k.roof] || ROOF.red, rr0 = rng((b.vis[0] * 7 + b.vis[3]) | 0);
    const dx = 40, dy = 28, cx = b.door.x;
    if (b.id === 'board') return noticeBoard(b, lv, R);
    if (b.id === 'guild') return guildHall(b, { lv: 3, banner: o.banner });
    const { w, x0, x1, wt, rY, B } = bGeom(b, lv);
    const wall = lv <= 2 ? P.woodL : b.wall || k.wall || P.cream, stone = lv >= 4;
    let s = GLOW + `<g data-ol="${b.id}">`;

    s += sideWall(x1, B - 12, wt, dx, dy, wall, lv <= 2 ? { planks: 4 } : { courses: 22 });
    s += `<rect x="${x0}" y="${wt}" width="${w}" height="${B - wt - 12}" fill="${wall}" ${O(5)}/>`;
    if (lv <= 2) { let pl = ''; for (let x = x0 + 18; x < x1 - 6; x += 18) pl += `M${x} ${wt + 4} V${B - 14} `; s += `<path d="${pl}" stroke="${P.woodD}" stroke-width="2" opacity=".45"/>`; }
    else s += `<path d="M${x0 + 4} ${wt + 30} V${B - 16} M${x1 - 4} ${wt + 30} V${B - 16}" stroke="${dk(wall, 0.12)}" stroke-width="8"/>`;
    s += foundV(x0 - 6, x1 + 6, B, stone ? 18 : 12, dx, dy, stone ? P.rock : P.rockL);

    const rowsN = lv >= 4 ? 2 : 1, perSide = Math.max(1, Math.min(lv >= 5 ? 3 : 2, Math.floor((w / 2 - 50) / 70)));
    for (let row = 0; row < rowsN; row++) {
      const wy = row ? wt + 14 : (rowsN === 2 ? wt + 58 : wt + Math.max(14, (B - wt - 62) / 2 - 10)), wh = row ? 34 : 40;
      for (let i = 0; i < perSide; i++) for (const sd of [-1, 1]) { const wx = cx + sd * (54 + i * 70) - 20; if (wx < x0 + 8 || wx + 40 > x1 - 8) continue; s += win(wx, wy, 40, wh, { shut: lv >= 3 ? R[0] : null, box: lv >= 2 && !row ? P.woodD : null, cat: !row && i === 0 && sd > 0 && rr0() < 0.35 }); }
    }
    s += door(cx, B - 10, 40 + lv * 3, 54 + lv * 4, R[1], { mat: false, double: lv >= 4 });
    s += stepsV(cx, B - 10, B + 10, 60 + lv * 4, 2, lv >= 3 ? '#e8d4c0' : P.woodL);
    if (k.awn) { const ay = wt + 18, aw = Math.min(w - 20, 120 + lv * 20); for (let i = 0; i < 6; i++) s += `<path d="M${f1(cx - aw / 2 + i * aw / 6)} ${ay} h${f1(aw / 6)} l4 22 h${f1(-aw / 6 - 8)} Z" fill="${i % 2 ? P.cream : R[0]}" ${O(2.6)}/>`; }
    if (k.fire) s += fireLight(x0 - 20, B - 20, 60, 30) + `<path d="M${x0 - 34} ${B} q8 -30 16 -8 q6 -26 14 0 q8 -18 12 8 Z" fill="#ff9a3a" ${O(2.6)}/>`;
    s += fascia(x0 - 14, x1 + 14, wt + 2, dx, dy, 10, R[1]);
    s += roofV(x0 - 14, x1 + 14, wt + 4, rY, dx, dy, R, (b.vis[0] | 0) + lv, 30, 18);

    if (lv >= 3) { const [rgL, rgR] = roofRidge(x0 - 14, x1 + 14, wt + 4, rY, dx), chx = x0 + Math.round(w * (rr0() < 0.5 ? 0.22 : 0.78)); s += chimney(Math.round(Math.max(rgL + 18, Math.min(rgR - 20, chx))), rY - 20, 26, 40); }
    if (lv >= 5 && k.tower !== 0) {
      const tx = cx + Math.round(w * 0.18), tw = 46, tt = rY - 70;
      s += sideWall(tx + tw / 2, rY + 6, tt, 14, 10, wall, { k: 0.22 }) + `<rect x="${tx - tw / 2}" y="${tt}" width="${tw}" height="${rY + 6 - tt}" fill="${wall}" ${O(4)}/>` + win(tx - 12, tt + 14, 24, 28, { arch: true, noSill: true });
      s += `<path d="M${tx - tw / 2 - 12} ${tt + 2} L${tx} ${tt - 46} L${tx + tw / 2 + 12} ${tt + 2} Z" fill="${R[0]}" ${O(4)}/><path d="M${tx} ${tt - 46} V${tt - 78}" stroke="${P.metal}" stroke-width="4"/><path d="M${tx} ${tt - 78} l30 8 l-30 8 Z" fill="${P.gold}" ${O(2.6)}/>`;
    }
    const sz = 15 + lv;
    s += board(cx, wt - 6, b.sign || b.title || b.id, sz, { w: Math.max(110, String(b.sign || b.title || b.id).length * sz * 0.66 + 34), h: sz + 18 });

    for (let i = 0; i < lv; i++) s += paw(cx - (lv - 1) * 9 + i * 18, wt + 16, 0.42, P.gold, 0.95);
    return s + '</g>';
  }

  





  function guildFlag(x, top, color, s = 1) {
    return `<g transform="translate(${x} ${top}) scale(${s})"><path d="M0 0 V78" stroke="${P.metal}" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-3" r="5" fill="${P.gold}" ${O(2)}/>`
      + `<path d="M2 4 H52 L42 20 L52 36 H2 Z" fill="${color}" ${O(3)}/><path d="M14 13 l6 7 l-6 7 l-6 -7 Z" fill="${P.gold}" ${O(1.6)}/></g>`;
  }

  function guildWin(x, y, w, h, o = {}) {
    const fr = o.frame || P.rockL, r = w / 2, cx = x + r, ay = y + r;
    let s = '';
    if (o.shut) for (const sd of [-1, 1]) { const sx = sd < 0 ? x - 19 : x + w + 3; s += `<path d="M${sx} ${y + h} V${ay - 2} Q${sx + 8} ${ay - 12} ${sx + 16} ${ay - 2} V${y + h} Z" fill="${o.shut}" ${O(3)}/><path d="M${sx + 4} ${ay + 10} h8 M${sx + 4} ${ay + 24} h8 M${sx + 4} ${ay + 38} h8 M${sx + 4} ${ay + 52} h8" stroke="${INK}" stroke-width="2" opacity=".35"/>`; }
    s += `<path d="M${x - 7} ${y + h + 2} V${ay} A${r + 7} ${r + 7} 0 0 1 ${x + w + 7} ${ay} V${y + h + 2} Z" fill="${fr}" ${O(3.5)}/>`;
    s += `<path d="M${x} ${y + h} V${ay} A${r} ${r} 0 0 1 ${x + w} ${ay} V${y + h} Z" fill="${P.glass}" ${O(3)}/><path d="M${x} ${y + h} V${ay} A${r} ${r} 0 0 1 ${x + w} ${ay} V${y + h} Z" fill="#ff9a3a" opacity=".2"/>`;

    const cols = [o.glassA || '#4a6fb0', o.glassB || '#c0504a', '#3f8f8a', o.glassB || '#c0504a', o.glassA || '#4a6fb0'];
    for (let i = 0; i < 5; i++) { const a0 = Math.PI + (i / 5) * Math.PI, a1 = Math.PI + ((i + 1) / 5) * Math.PI; s += `<path d="M${cx} ${ay} L${f1(cx + Math.cos(a0) * (r - 3))} ${f1(ay + Math.sin(a0) * (r - 3))} A${r - 3} ${r - 3} 0 0 1 ${f1(cx + Math.cos(a1) * (r - 3))} ${f1(ay + Math.sin(a1) * (r - 3))} Z" fill="${cols[i]}" opacity=".85"/>`; }
    s += `<path d="M${x} ${ay} H${x + w} M${cx} ${y + 4} V${y + h} M${x} ${ay + (y + h - ay) / 2} H${x + w}" stroke="${o.mull || P.woodD}" stroke-width="3.4"/><circle cx="${cx}" cy="${ay}" r="4" fill="${P.gold}" ${O(1.6)}/>`;
    s += `<path d="M${x + 6} ${ay + 8} l8 -5 M${x + 6} ${ay + 18} l12 -7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`;
    s += `<path d="M${x + 5} ${y + h - 2} V${ay} A${r - 5} ${r - 5} 0 0 1 ${x + w - 7} ${ay - 2}" fill="none" stroke="${INK}" stroke-width="5" opacity=".22"/>`;
    s += `<path d="M${cx - 7} ${y - 9} h14 l-3 14 h-8 Z" fill="${lt(fr, 0.2)}" ${O(2.6)}/>`;

    const bx = x - 10, by = y + h + 2;
    s += `<rect x="${bx}" y="${by}" width="${w + 20}" height="15" rx="4" fill="${P.wood}" ${O(3)}/><path d="M${bx + 4} ${by + 8} H${bx + w + 16}" stroke="${P.woodD}" stroke-width="2" opacity=".6"/>`;
    s += `<path d="M${bx + 2} ${by + 2} q${(w + 20) / 4} -12 ${(w + 20) / 2} -4 q${(w + 20) / 4} -10 ${(w + 16) / 2} 2" fill="${P.leaf}" ${O(2.4)}/>`;
    for (let i = 0; i < 5; i++) s += `<circle cx="${f1(bx + 6 + i * (w + 8) / 4)}" cy="${by - 4 - (i % 2) * 4}" r="5" fill="${['#ff8fa3', '#ffe27a', '#fff4e0', '#c9b6ff', '#ff8fa3'][i]}" stroke="${INK}" stroke-width="1.8"/>`;
    return s;
  }
  function guildHall(b, o = {}) {
    const lv = Math.max(1, Math.min(5, Math.round(+o.lv || 4))), banner = o.banner || '#c0504a', R = ROOF[b.roof] || ROOF.plum;
    const [vx0, , vx1, B] = b.vis, cx = b.door.x, dx = 46, dy = 32, w = vx1 - vx0 - dx - 30, x0 = Math.round(cx - w / 2), x1 = x0 + w;
    const wallH = [130, 150, 170, 190, 210][lv - 1], wt = B - wallH, rY = wt - [96, 106, 120, 130, 140][lv - 1];
    const wall = lv <= 2 ? P.woodL : P.cream, stone = lv >= 3, rock = stone ? P.rock : dk(P.woodL, 0.2);
    let s = GLOW + `<g data-ol="${b.id}">`;

    s += sideWall(x1, B - 14, wt, dx, dy, wall, lv <= 2 ? { planks: 5 } : { courses: 22 });
    s += `<rect x="${x0}" y="${wt}" width="${w}" height="${wallH - 14}" fill="${wall}" ${O(5)}/>`;
    if (stone) { let q = ''; for (let y = wt + 6, i = 0; y < B - 30; y += 22, i++) for (const xx of [x0 + 4, x1 - 4 - (i % 2 ? 26 : 18)]) q += `M${xx} ${y} h${i % 2 ? 26 : 18} v18 h${-(i % 2 ? 26 : 18)} Z `; s += `<path d="${q}" fill="${lt(P.rock, 0.45)}" stroke="${INK}" stroke-width="2" opacity=".85"/>`; }
    s += foundV(x0, x1, B, stone ? 20 : 14, dx, dy, rock);

    const pw = 124, wx = Math.round((pw + 24 + w / 2) / 2);
    for (const sd of [-1, 1]) {
      const ww = 44, wh = Math.min(76, wallH - 70), xx = cx + sd * wx - ww / 2, yy = wt + 30;
      s += guildWin(xx, yy, ww, wh, { shut: lv <= 2 ? R[0] : dk(banner, 0.1), glassB: banner, frame: stone ? lt(P.rock, 0.25) : P.wood });
    }

    s += door(cx, B - 14, 64, 88, R[1], { double: true, mat: banner });
    s += `<path d="M${cx - 26} ${B - 14 - 88 + 34} A26 26 0 0 1 ${cx + 26} ${B - 14 - 88 + 34} Z" fill="${P.glass}" ${O(2.6)}/><path d="M${cx} ${B - 14 - 88 + 34} V${B - 14 - 88 + 10} M${cx} ${B - 14 - 88 + 34} L${cx - 18} ${B - 14 - 88 + 18} M${cx} ${B - 14 - 88 + 34} L${cx + 18} ${B - 14 - 88 + 18}" stroke="${P.woodD}" stroke-width="2.6"/>`;

    const L = x0 - 18, Rr = x1 + 18, eY = wt + 4;
    s += fascia(L, Rr, wt + 2, dx, dy, 12, R[1]);
    s += roofV(L, Rr, eY, rY, dx, dy, R, x0 + 11, 30, 18);
    const [rxL, rxR] = roofRidge(L, Rr, eY, rY, dx), ey = eY + 6, at = (t) => [L + (rxL - L) * t, Rr + (rxR - Rr) * t, ey + (rY - ey) * t];
    { const [a0, b0, y0] = at(0.36), [a1, b1, y1] = at(0.5); s += `<path d="${poly([[a0 + 6, y0], [b0 - 6, y0], [b1 - 6, y1], [a1 + 6, y1]])}" fill="${R[2]}" ${O(2.6)}/>`;
      const ym = (y0 + y1) / 2, xa = (a0 + a1) / 2 + 16, xb = (b0 + b1) / 2 - 16, n = Math.max(3, Math.round((xb - xa) / 30)); let dd = '';
      for (let i = 0; i <= n; i++) { const x = xa + (xb - xa) * i / n; dd += `M${f1(x)} ${f1(ym - 7)} l7 7 l-7 7 l-7 -7 Z `; }
      s += `<path d="${dd}" fill="${banner}" stroke="${INK}" stroke-width="2"/>`; }
    { let cr = ''; for (let x = rxL + 14; x < rxR - 8; x += 22) cr += `M${f1(x - 5)} ${rY - 8} L${f1(x)} ${rY - 22} L${f1(x + 5)} ${rY - 8} Z `; s += `<path d="${cr}" fill="${P.gold}" ${O(2)}/>`; }
    for (const ex of [rxL, rxR]) s += `<path d="M${f1(ex)} ${rY - 6} V${rY - 34}" stroke="${P.metal}" stroke-width="5" stroke-linecap="round"/><circle cx="${f1(ex)}" cy="${rY - 36}" r="6" fill="${P.gold}" ${O(2)}/>` + guildFlag(f1(ex), rY - 92, banner, 0.62);

    const tw = 64, tB = rY + 18, tT = rY - 70, tx = cx;
    s += sideWall(tx + tw / 2, tB, tT, 16, 11, wall, { k: 0.24 }) + `<rect x="${tx - tw / 2}" y="${tT}" width="${tw}" height="${tB - tT}" fill="${wall}" ${O(4)}/>`;
    s += `<rect x="${tx - tw / 2 - 4}" y="${tT - 2}" width="${tw + 8}" height="10" rx="3" fill="${rock}" ${O(3)}/>` + win(tx - 13, tT + 18, 26, 34, { arch: true, noSill: true, frame: P.woodD });
    s += `<path d="${poly([[tx - tw / 2 - 12, tT + 2], [tx, tT - 96], [tx + tw / 2 + 12, tT + 2]])}" fill="${R[0]}" ${O(4)}/><path d="${poly([[tx, tT - 96], [tx + tw / 2 + 12, tT + 2], [tx + tw / 2 + 22, tT - 6]])}" fill="${R[1]}" ${O(3.5)}/>`;
    s += `<path d="M${tx - tw / 2 - 2} ${tT - 14} L${tx} ${tT - 64} M${tx - tw / 2 + 12} ${tT - 2} L${tx + 2} ${tT - 46}" stroke="${R[2]}" stroke-width="4" opacity=".8" stroke-linecap="round"/><path d="M${tx - tw / 2 - 10} ${tT - 2} H${tx + tw / 2 + 10}" stroke="${P.gold}" stroke-width="4"/>`;
    s += `<path d="M${tx} ${tT - 94} V${tT - 150}" stroke="${P.metal}" stroke-width="5" stroke-linecap="round"/><circle cx="${tx}" cy="${tT - 112}" r="7" fill="${P.gold}" ${O(2.2)}/>` + guildFlag(tx, tT - 196, banner, 0.85);

    const sb = B - 4, sh = 16, px0 = cx - pw - 16, px1 = cx + pw + 16;
    s += `<path d="${poly([[px1, sb + sh], [px1 + 12, sb + sh - 8], [px1 + 12, sb - 10], [px1, sb - 2]])}" fill="${dk(lt(P.rock, 0.15), 0.3)}" ${O(3)}/>`;
    s += `<path d="${poly([[px0, sb], [px1, sb], [px1 - 10, sb - 14], [px0 + 10, sb - 14]])}" fill="${lt(P.rock, 0.3)}" ${O(3)}/><rect x="${px0}" y="${sb}" width="${px1 - px0}" height="${sh}" fill="${lt(P.rock, 0.12)}" ${O(3.5)}/>`;
    s += stepsV(cx, sb + sh, sb + sh + 16, 112, 2, lt(P.rock, 0.2));
    const colTop = wt + 26, colB = sb - 8;
    for (const sd of [-1, 1]) {
      const x = cx + sd * (pw - 18);
      s += `<ellipse cx="${x + 6}" cy="${colB + 4}" rx="22" ry="5" fill="${INK}" opacity=".2"/><rect x="${x - 19}" y="${colB - 12}" width="38" height="12" rx="2" fill="${P.rock}" ${O(3)}/><rect x="${x - 15}" y="${colB - 20}" width="30" height="9" rx="4" fill="${lt(P.rock, 0.2)}" ${O(2.6)}/>`;
      s += `<rect x="${x - 12}" y="${colTop + 10}" width="24" height="${colB - 20 - colTop - 10}" fill="${lt(P.rock, 0.4)}" ${O(3.5)}/><path d="M${x - 4} ${colTop + 14} V${colB - 22} M${x + 4} ${colTop + 14} V${colB - 22}" stroke="${INK}" stroke-width="1.8" opacity=".3"/><path d="M${x + 7} ${colTop + 14} V${colB - 22}" stroke="${INK}" stroke-width="4" opacity=".14"/>`;
      s += `<path d="M${x - 16} ${colTop + 12} H${x + 16} L${x + 12} ${colTop + 2} H${x - 12} Z" fill="${P.rock}" ${O(2.8)}/><path d="M${x - 18} ${colTop + 6} q-6 -2 -4 -8 M${x + 18} ${colTop + 6} q6 -2 4 -8" stroke="${INK}" stroke-width="2.4" fill="none"/>`;
    }
    const eT = wt - 4, eB = colTop + 2;
    s += `<rect x="${px0 - 2}" y="${eT}" width="${px1 - px0 + 4}" height="${eB - eT}" fill="${lt(P.rock, 0.3)}" ${O(3.5)}/><path d="M${px0 + 2} ${eB - 6} H${px1 - 2}" stroke="${INK}" stroke-width="2" opacity=".3"/>`;
    let dent = ''; for (let x = px0 + 6; x < px1 - 6; x += 12) dent += `M${x} ${eT + 2} h6 v6 h-6 Z `; s += `<path d="${dent}" fill="${P.rock}" opacity=".9"/>`;
    const gT = eT - 72;
    s += `<path d="${poly([[px0 - 10, eT + 2], [cx, gT], [px1 + 10, eT + 2]])}" fill="${lt(P.rock, 0.35)}" ${O(4)}/><path d="${poly([[px0 + 14, eT - 6], [cx, gT + 14], [px1 - 14, eT - 6]])}" fill="${lt(P.rock, 0.1)}" ${O(2.4)}/>`;
    s += `<path d="M${px0 - 10} ${eT + 2} L${cx} ${gT} L${px1 + 10} ${eT + 2}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".35"/><circle cx="${cx}" cy="${gT - 6}" r="7" fill="${P.gold}" ${O(2.2)}/>`;

    const hy = gT + 24;
    s += `<path d="M${cx - 48} ${hy + 30} q10 -16 22 -18 M${cx + 48} ${hy + 30} q-10 -16 -22 -18" stroke="${P.leafD}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M${cx - 24} ${hy + 6} L${cx + 24} ${hy + 40} M${cx + 24} ${hy + 6} L${cx - 24} ${hy + 40}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${cx - 24} ${hy + 6} L${cx + 24} ${hy + 40} M${cx + 24} ${hy + 6} L${cx - 24} ${hy + 40}" stroke="#d6dbe4" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M${cx - 16} ${hy} H${cx + 16} V${hy + 18} C${cx + 16} ${hy + 30} ${cx + 6} ${hy + 38} ${cx} ${hy + 42} C${cx - 6} ${hy + 38} ${cx - 16} ${hy + 30} ${cx - 16} ${hy + 18} Z" fill="${banner}" ${O(3)}/><path d="M${cx} ${hy + 8} l7 9 l-7 9 l-7 -9 Z" fill="${P.gold}" ${O(1.6)}/>`;
    s += board(cx, (eT + eB) / 2 + 2, b.sign || 'ГИЛЬДИИ', 19, { w: 2 * pw - 6, h: Math.min(34, eB - eT - 4), bg: dk(banner, 0.15), ears: false });

    for (const sd of [-1, 1]) s += lantern(cx + sd * 56, B - 104, 0.85);
    return s + '</g>';
  }
  function noticeBoard(b, lv, R) {
    const [vx0, , vx1, B] = M.plotOf(b, lv).vis, cx = b.door.x, w = Math.min(vx1 - vx0 - 24, 110 + lv * 14), x0 = cx - w / 2, x1 = cx + w / 2, top = B - 110 - lv * 6;
    let s = `<g data-ol="${b.id}">`;
    for (const x of [x0 + 12, x1 - 24]) s += `<rect x="${f1(x)}" y="${top - 18}" width="12" height="${B - top + 18}" rx="3" fill="${P.woodD}" ${O(3)}/>`;
    s += `<rect x="${f1(x0)}" y="${top}" width="${f1(w)}" height="76" rx="6" fill="${P.wood}" ${O(4)}/><rect x="${f1(x0 + 8)}" y="${top + 8}" width="${f1(w - 16)}" height="60" rx="4" fill="${P.woodL}"/>`;
    const C = ['#fff4e0', '#ffd0dc', '#e0f0ff', '#fff4a8', '#e8ffd8'];
    for (let i = 0; i < 2 + lv; i++) { const x = x0 + 14 + (i % 4) * ((w - 44) / 3), y = top + 12 + Math.floor(i / 4) * 30; s += `<rect x="${f1(x)}" y="${y}" width="26" height="24" fill="${C[i % C.length]}" ${O(2)}/><circle cx="${f1(x + 13)}" cy="${y + 3}" r="3" fill="#e8455c"/>`; }
    s += fascia(x0 - 16, x1 + 16, top - 4, 16, 11, 7, R[1], { shadow: false }) + roofV(x0 - 16, x1 + 16, top - 2, top - 36, 16, 11, R, (vx0 | 0) + lv, 26, 15, { ridge: 9 });
    s += board(cx, B - 18, b.sign || 'ДОСКА', 14, { w: 90, h: 24, ears: false, bg: P.woodD });
    return s + '</g>';
  }

  function scaffold(b, to) {
    const [x0, y0, x1, B] = M.plotOf(b, to).vis, top = y0 + 30, xs = [];
    for (let x = x0 + 6; x <= x1 + 30; x += Math.max(50, Math.round((x1 + 24 - x0) / 6))) xs.push(x);
    let s = `<g data-ol="${b.id}">`, pole = '', plank = '';
    for (const x of xs) pole += `M${x} ${B + 4} V${top} `;
    for (let y = B - 50; y > top + 10; y -= 70) plank += `M${x0 - 8} ${y} H${x1 + 38} `;
    const X = `M${xs[0]} ${B - 10} L${xs[1] || xs[0]} ${top + 30} M${xs[xs.length - 1]} ${B - 10} L${xs[xs.length - 2] || xs[0]} ${top + 30}`;
    s += `<path d="${pole} ${X}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${pole} ${X}" stroke="${P.woodL}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<path d="${plank}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${plank}" stroke="${P.wood}" stroke-width="8" stroke-linecap="round"/>`;
    s += `<path d="M${(x0 + x1) / 2} ${top} V${top + 60}" stroke="#d8cbb0" stroke-width="2"/><path d="M${(x0 + x1) / 2 - 10} ${top + 60} h20 l-3 18 h-14 Z" fill="#8a8e9e" ${O(2.4)}/>`;
    s += board((x0 + x1) / 2, B - 24, 'СТРОЙКА', 14, { w: 110, h: 26, ears: false, bg: P.woodD });
    return s + '</g>';
  }

  function pennant(b, color, lv = 1) {
    const [vx0, , , B] = M.plotOf(b, lv).vis, x = vx0 + 16;
    const top = B - WALLH[Math.max(1, Math.min(5, lv)) - 1] - 40, c = /^#[0-9a-f]{6}$/i.test(color || '') ? color : P.gold;
    return { x: x - 10, y: top - 70, w: 70, h: 80, z: B + 1, svg: `<path d="M${x} ${top} V${top - 62}" stroke="${P.metal}" stroke-width="4" stroke-linecap="round"/><path d="M${x} ${top - 60} l44 10 l-10 8 l10 8 l-44 6 Z" fill="${c}" ${O(2.6)}/>` + paw(x + 16, top - 44, 0.4, '#fff', 0.9) };
  }

  function woodGate(b) {
    const [px0, , px1] = b.pass, cx = (px0 + px1) / 2, B = b.vis[3], top = B - 150, hw = (px1 - px0) / 2 + 30;
    let s = `<g data-ol="${b.id}">`;
    for (const x of [cx - hw, cx + hw - 26]) s += `<path d="${poly([[x + 26, B], [x + 34, B - 6], [x + 34, top - 6], [x + 26, top]])}" fill="${P.woodD}" ${O(3)}/><rect x="${x}" y="${top}" width="26" height="${B - top}" rx="5" fill="${P.wood}" ${O(4)}/><path d="M${x + 7} ${top + 8} V${B - 6}" stroke="${P.woodL}" stroke-width="3"/>`;
    s += `<rect x="${cx - hw - 20}" y="${top - 14}" width="${hw * 2 + 40}" height="22" rx="8" fill="${P.wood}" ${O(4)}/>`;
    s += roofV(cx - hw - 34, cx + hw + 34, top - 12, top - 52, 14, 10, ROOF.red, cx | 0, 24, 14, { ridge: 9 });
    s += board(cx, top + 26, b.sign || 'ВОРОТА', 18, { w: 130, h: 32 });
    s += lantern(cx - hw - 26, top + 20, 0.8) + lantern(cx + hw + 26, top + 20, 0.8);
    return s + '</g>';
  }

  







  







  const spotPoly = (p) => { const rx = p.rx || 170, ry = p.ry || 120, out = []; for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, sn = Math.sin(a); out.push([Math.round(p.x + Math.cos(a) * rx), Math.round(p.y + 10 + sn * (sn < 0 ? ry + 10 : 150))]); } return out; };

  const spotBox = (p) => (p.t === 'e' ? [p.x - 140, p.y - 160, p.x + 140, p.y + 18] : [p.x - 130, p.y - 112, p.x + 126, p.y + 20]);
   
  function gladeOf(L) { const g = L.glade; if (!g) return null; return { ...g, spots: (g.spots || []).map((p) => ({ ...p, ...(p.gate ? {} : { poly: spotPoly(p) }) })) }; }

  function drawTown(T, o = {}) {
    const L = M.layoutOf(T), W = L.W, H = L.H, seed = (L.seed >>> 0) || 4242, r = rng(seed), lvOf = (id) => +((o.levels || {})[id] || L.lv || 1);
    reset(L.biome);
    const E = L.edge || null, EA = E ? E.art : 0, EF = E ? E.fog : 0, EXT = [-EA, -EA, W + EA, H + EA], GL = gladeOf(L), WL = L.wall && L.wall.k === 'palisade' ? L.wall : null;
    const SP = GL ? GL.spots : [];
    const inGlade = (x, y) => !!GL && ((GL.poly && M.inPoly(GL.poly, x, y)) || SP.some((p) => p.poly && M.inPoly(p.poly, x, y)));
    const G = E ? Ground({ neg: true, passes: 9 }) : Ground(), props = [], flat = [];
    const prop = (svg, box, z, ref, extra) => props.push({ x: box[0], y: box[1], w: box[2] - box[0], h: box[3] - box[1], z, svg, ref, ...(extra || {}) });
    const TB = M.boxOf({ p: L.town });

    let s = `<rect x="${EXT[0] - 40}" y="${EXT[1] - 40}" width="${EXT[2] - EXT[0] + 80}" height="${EXT[3] - EXT[1] + 80}" fill="${P.forest}"/>`;
    if (GL) s += gladeGround(GL, SP);
    s += `<path d="${smooth(wobble(L.town, 70, 14, r))}" fill="${P.grass}"/>`;
    for (const t of L.tiers) s += `<path d="${poly(t.poly)}" fill="${P.plat}"/>`;
    for (const w of L.water) s += pondBase(w);
    const paves = L.streets.map((st) => st.rr ? rr(...st.rr.slice(0, 4), st.rr[4]) : poly(st.poly)).join(' ');
    if (paves) s += `<path d="${paves}" fill="none" stroke="${INK}" stroke-width="26" stroke-linejoin="round" opacity=".18"/><path d="${paves}" fill="${P.paveD}" stroke="${P.paveD}" stroke-width="20" stroke-linejoin="round"/><path d="${paves}" fill="${P.pave}"/>`;
    for (const p of L.paths) s += `<path d="${curve(p.pts)}" fill="none" stroke="${P.pathD}" stroke-width="${p.w + 10}" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`;
    for (const p of L.paths) s += `<path d="${curve(p.pts)}" fill="none" stroke="${P.path}" stroke-width="${p.w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    for (const p of L.paths) s += `<path d="${curve(p.pts)}" fill="none" stroke="${P.pathL}" stroke-width="${f1(p.w * 0.32)}" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>`;

    if (L.gate) { const gx = (L.gate.pass[0] + L.gate.pass[2]) / 2, y0 = L.gate.vis[3] - 10, d = E ? `M${gx} ${y0} C${gx + 6} ${y0 + 80} ${gx - 20} ${y0 + 160} ${gx - 6} ${H + 20} S${gx + 18} ${H + 300} ${gx - 10} ${H + EA + 60}` : `M${gx} ${y0} C${gx + 6} ${y0 + 80} ${gx - 20} ${y0 + 160} ${gx - 6} ${H + 40}`; s += `<path d="${d}" fill="none" stroke="${P.pathD}" stroke-width="150" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.path}" stroke-width="134" stroke-linecap="round"/>`; }
    G.big(0, [EXT[0] - 40, EXT[1] - 40, EXT[2] + 40, EXT[3] + 40], s);

    for (const st of L.streets) { if (st.rr) continue; const xs = st.poly.map((q) => q[0]), ys = st.poly.map((q) => q[1]); stones(G, Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), r); }
    for (const [i, w] of L.water.entries()) pondDeco(G, { ...w, bridges: L.bridges.filter((b) => !b.water || b.water === w.id) }, seed + 31 + i);
    const nearPave = (x, y) => L.streets.some((st) => { const b = st.rr ? st.rr : M.boxOf({ p: st.poly }); return x > b[0] - 20 && x < b[2] + 20 && y > b[1] - 20 && y < b[3] + 20; }) || L.paths.some((p) => p.pts.some((q, i) => i && segD(x, y, p.pts[i - 1], q) < p.w / 2 + 10));
    const faceNear = (x, y) => L.tiers.some((t) => t.rim && x >= t.rim[0][0] && x <= t.rim[t.rim.length - 1][0] && y > M.rimY(t.rim, x) - 14 && y < M.rimY(t.rim, x) + (t.face || 150) + 26);
    const inRock = (x, y) => L.rocks.some((t) => M.inPoly(t.poly, x, y) || t.faces.some((f) => M.inPoly(f, x, y)));
    const nGrass = Math.round((TB[2] - TB[0]) * (TB[3] - TB[1]) / 1400);
    for (let n = 0; n < nGrass; n++) {
      const x = TB[0] + r() * (TB[2] - TB[0]), y = TB[1] + r() * (TB[3] - TB[1]);
      if (!M.inPoly(L.town, x, y) || nearPave(x, y) || faceNear(x, y) || inRock(x, y) || L.water.some((w) => M.inPoly(w.poly, x, y))) continue;
      const up = L.tiers.some((t) => M.inPoly(t.poly, x, y)), kind = r();
      if (kind < 0.62) G.brush(1, x, y, `<path d="%D" fill="none" stroke="${up ? P.platD : P.grassD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, `M${f1(x - 7)} ${f1(y)} l3 -9 M${f1(x)} ${f1(y)} l0 -12 M${f1(x + 7)} ${f1(y)} l-3 -9 `);
      else if (kind < 0.8) G.brush(1, x, y, `<path d="%D" fill="${up ? P.platL : P.grassL}" opacity=".9"/>`, `M${f1(x - 12)} ${f1(y)} q12 -14 24 0 q-12 6 -24 0 Z `);
      else if (kind < 0.93) { const c = ['#fff4e0', '#ffd0dc', '#ffe27a', '#c9b6ff'][Math.floor(r() * 4)]; G.brush(1, x, y, `<path d="%D" fill="${c}" stroke="${INK}" stroke-width="1.6"/>`, `M${f1(x + 4)} ${f1(y)} a4 4 0 1 0 -8 0 a4 4 0 1 0 8 0 M${f1(x + 14)} ${f1(y + 6)} a3.4 3.4 0 1 0 -6.8 0 a3.4 3.4 0 1 0 6.8 0 `); }
      else G.brush(1, x, y, `<path d="%D" fill="${P.rockL}" stroke="${INK}" stroke-width="2"/>`, `M${f1(x - 6)} ${f1(y)} q6 -8 12 0 q-6 4 -12 0 Z `);
    }
    if (GL) gladeDetail(G, GL, SP, W, H, seed);

    L.tiers.forEach((t, i) => { if (t.rim) cliff(G, t, seed + 101 + i); });
    for (const S of L.stairs) G.big(5, [S.x0 - 30, S.y0 - 30, S.x1 + 30, S.y1 + 30], S.k === 'ramp' ? ramp(S) : stair(S, RAIL));
    L.rocks.forEach((t, i) => { if (t.rim) rockFace(G, t, seed + 201 + i); });
    const mine = L.buildings.find((b) => b.id === 'mine');
    if (mine) { const B = mine.vis[3]; G.big(7, [mine.door.x - 230, B - 260, mine.door.x + 230, B + 60], minePortal(mine.door.x, B)); G.put(2, mine.door.x, mine.door.y, `<ellipse cx="${mine.door.x}" cy="${mine.door.y}" rx="160" ry="60" fill="url(#fcPool)"/>`); }


    const gx = L.gate ? (L.gate.pass[0] + L.gate.pass[2]) / 2 : -1e9, bottom = WL ? Math.max(TB[3], WL.y1) : TB[3], south = [], ALLT = [];
    const distTown = (x, y) => { let d = Infinity; for (let i = 0, j = L.town.length - 1; i < L.town.length; j = i++) d = Math.min(d, M.segDist(x, y, L.town[j], L.town[i])); return d; };
    const nearSpot = (x, y) => SP.some((p) => !p.gate && Math.hypot((x - p.x) / ((p.rx || 170) + 300), (y - p.y) / ((p.ry || 120) + 260)) < 1);
    const yA = E ? EXT[1] - 60 : -60, yB = E ? EXT[3] + 140 : H + 140, xA = E ? EXT[0] - 50 : -50, xB = E ? EXT[2] + 80 : W + 80;
    for (let y = yA; y < yB; y += 78) for (let x = xA + (Math.round(y / 78) % 2) * 50; x < xB; x += 104) {
      const tx = x + (r() - 0.5) * 50, ty = y + (r() - 0.5) * 36;
      if (M.inPoly(L.town, tx, ty) || inRock(tx, ty) || L.tiers.some((t) => M.inPoly(t.poly, tx, ty))) continue;
      if (Math.abs(tx - gx) < 140 && ty > bottom - 40) continue;
      if (E ? (tx < EXT[0] - 60 || tx > EXT[2] + 60 || ty < EXT[1] - 10 || ty > EXT[3] + 240) : (tx < -70 || tx > W + 70)) continue;
      if (inGlade(tx, ty)) continue;
      const out = E && (tx < -EF || tx > W + EF || ty < -EF || ty > H + EF);
      if (out && (tx < -EA + 80 || tx > W + EA - 80 || ty > H + EA - 60)) continue;
      const dd = distTown(tx, ty);
      if (out ? r() < 0.3 : (dd > 330 && ty < bottom && !nearSpot(tx, ty) && !(E && (tx < 260 || tx > W - 260 || ty < 260)))) continue;
      const k = 0.95 + r() * 0.35, kind = natureTree(L.nature || L.biome, r), sd = Math.round(tx * 3 + ty), svg = out ? fogTree(kind, tx, ty, k, sd) : natureSvg(kind, tx, ty, k, sd);
      const box = kind === 'pine' ? [tx - 68 * k, ty - 182 * k, tx + 68 * k, ty + 4] : [tx - 76 * k, ty - 166 * k, tx + 76 * k, ty + 6];
      const kk = kind === 'pine' ? 'pine' : 'tree', t1 = { k: kk, x: tx, y: ty, box, svg };
      if (ty > bottom - 10) { if (ty > bottom + 150 && (E || ty < H + 30)) { south.push(t1); ALLT.push(t1); } continue; }
      ALLT.push(t1);
      if (dd < 120 && ty > TB[1] + 60 && !out) prop(svg, [tx - 80 * k, ty - 200 * k, tx + 80 * k, ty + 10], ty, 'edge');
      else { G.put(7, tx, ty, svg); flat.push({ k: kk, x: tx, y: ty, box }); }
    }

    for (let i = 0; i < Math.round(W / 140); i++) { const x = TB[0] + r() * (TB[2] - TB[0]), y = bottom + 40 + r() * 90, k = 0.7 + r() * 0.4; if (Math.abs(x - gx) < 150 || inGlade(x, y)) continue; south.push({ k: 'bush', x, y, box: [x - 46 * k, y - 52 * k, x + 46 * k, y + 4], svg: bush(x, y, k, i + 3) }); }

    let GLF = [];
    if (GL) {
      if (GL.sign) { const [sx, sy] = GL.sign; south.push({ k: 'signpost', x: sx, y: sy, box: [sx - 20, sy - 120, sx + 130, sy + 8], svg: signpost(sx, sy, [['В ПОХОД', 'S']]) }); }
      const front = (GL.front || []).map(([kd, x, y, k], i) => {
        const svg = kd === 'pine' ? pine(x, y, k, 700 + i, true) : kd === 'tree' ? tree(x, y, k, 700 + i, 'dark') : kd === 'rowan' ? rowanTree(x, y, k, 700 + i) : bush(x, y, k, 700 + i);
        const box = kd === 'pine' ? [x - 68 * k, y - 182 * k, x + 68 * k, y + 4] : kd === 'tree' || kd === 'rowan' ? [x - 76 * k, y - 170 * k, x + 76 * k, y + 6] : [x - 46 * k, y - 52 * k, x + 46 * k, y + 4];
        const t1 = { k: kd === 'rowan' ? 'tree' : kd, x, y, box, svg }; south.push(t1); return t1;
      });
      const all = ALLT.concat(south.filter((t) => !ALLT.includes(t) && t.k !== 'pine' && t.k !== 'tree'), front.filter((t) => !ALLT.includes(t) && (t.k === 'pine' || t.k === 'tree')));
      GLF = SP.map((p) => { const b = spotBox(p); return all.filter((t) => t.y > p.y - 70 && t.box[2] > b[0] && t.box[0] < b[2] && t.box[3] > b[1] && t.box[1] < b[3]).map((t) => ({ k: t.k, x: Math.round(t.x), y: Math.round(t.y), box: t.box.map((v) => Math.round(v)), svg: t.svg })); });
    }


    south.sort((a, b) => a.y - b.y || a.x - b.x);
    const SR = E ? [-EF, W + EF, H] : [0, W, H];
    const inSR = (b) => b[1] < SR[2] && b[2] > SR[0] && b[0] < SR[1], outSR = (b) => b[3] > SR[2] || b[0] < SR[0] || b[2] > SR[1];
    if (E) for (const t of south) if (outSR(t.box)) G.put(7, t.x, t.y, t.svg);
    const zS = Math.max(bottom + 30, L.gate ? L.gate.vis[3] + 8 : 0);
    for (let bx = Math.floor(SR[0] / 400) * 400; bx < SR[1]; bx += 400) {
      const x0 = Math.max(SR[0], bx), bw = Math.min(bx + 400, SR[1]) - x0, Ls = south.filter((t) => (!E || inSR(t.box)) && t.box[2] > x0 && t.box[0] < x0 + bw); if (!Ls.length) continue;
      const y0 = Math.floor(Math.min(...Ls.map((t) => t.box[1]))) - 4, y1 = Math.min(H, Math.ceil(Math.max(...Ls.map((t) => t.box[3]))) + 4), cid = uid('tkS');
      prop(`<clipPath id="${cid}"><rect x="${x0}" y="${y0}" width="${bw}" height="${y1 - y0}"/></clipPath><g clip-path="url(#${cid})">${Ls.map((t) => t.svg).join('')}</g>`, [x0, y0, x0 + bw, y1], zS, 'south');
    }

    if (WL) {
      const g = WL.gate || [WL.x1, WL.x1], top = WL.y1 - 130;
      for (const [a, b] of [[WL.x0, g[0]], [g[1], WL.x1]]) for (let x = a; x < b; x += 400) { const x1 = Math.min(b, x + 400); prop(palisade(x, x1, top, WL.y1, x), [x - 4, top - 20, x1 + 4, WL.y1 + 12], WL.y1, 'wall'); }
      for (const tx of WL.towers || []) prop(watchtower(tx, WL.y1 + 4, ROOF[WL.roof] || ROOF.red), [tx - 70, WL.y1 - 236, tx + 70, WL.y1 + 10], WL.y1 + 4, 'tower');
    }

    const own = L.buildings.concat(L.houses);

    const shadowOf = (v) => `<rect x="${v[0] + 14}" y="${v[3] - 16}" width="${v[2] - v[0] - 30}" height="34" rx="16" fill="${INK}" opacity=".16"/>`;
    for (const b of own) { if (b.id === 'mine') continue; G.put(2, b.door.x, b.door.y, `<ellipse cx="${b.door.x}" cy="${b.door.y + 4}" rx="90" ry="34" fill="url(#fcPool)"/>`); }
    const art = T.art || {}, ctx = { A: API, K: M, G, prop, L, P, r, o };
    for (const b of L.buildings) {
      if (b.id === 'mine') continue;
      const lv = lvOf(b.id), v = M.plotOf(b, lv).vis, own2 = art.building && art.building[b.id];
      const svg = own2 ? own2(ctx, b, lv) : b.id === 'gate' && b.pass ? woodGate(b) : building(b, { lv });
      prop(shadowOf(v) + svg, [v[0] - 80, v[1] - 60, v[2] + 80, v[3] + 30], v[3], 'b:' + b.id, b.id === 'gate' || M.FIXED[b.id] ? null : { var: 'b:' + b.id });
      const bt = (o.building || {})[b.id];
      if (bt && +bt.until > (o.now || 0) && +bt.to > lv && !M.FIXED[b.id]) { const v2 = M.plotOf(b, bt.to).vis; prop(scaffold(b, bt.to), [v2[0] - 40, v2[1] - 20, v2[2] + 60, v2[3] + 20], v2[3] + 2, 'build', { var: 'build' }); }
      if (o.owner && b.id !== 'gate') { const pn = pennant(b, o.owner, lv); props.push({ ...pn, ref: 'own', var: 'own' }); }
    }
    L.houses.forEach((h, i) => { const v = h.vis; prop(houseB(h, { roofCat: i % 2 === 0 }), [v[0] - 30, v[1] - 80, v[2] + 80, v[3] + 20], v[3], 'h:' + h.id); });
    for (const [x, y, sv] of GSH) G.put(2, x, y, sv);

    shade(G, L.items);
    L.items.forEach((it, idx) => {
      const A2 = ITEM[it.k]; if (!A2) return; const ref = 'i:' + idx;
      if ((it.k === 'fence' || it.k === 'wattle') && it.x === it.x2) {
        const a = Math.min(it.y, it.y2), b = Math.max(it.y, it.y2);
        for (let y = a; y < b; y += 60) { const q = A2({ ...it, y, y2: Math.min(b, y + 60) }, o); prop(q.svg, q.box, Math.min(b, y + 60), ref); }
        return;
      }
      if ((it.k === 'fence' || it.k === 'wattle') && Math.abs(it.x2 - it.x) > 240) {
        const a = Math.min(it.x, it.x2), b = Math.max(it.x, it.x2);
        for (let x = a; x < b; x += 240) { const q = A2({ ...it, x, x2: Math.min(b, x + 240) }, o); prop(q.svg, q.box, it.y, ref); }
        return;
      }
      const q = A2(it, o); prop(q.svg, q.box, it.y, ref);
    });
    if (art.ground) art.ground(ctx);
    if (art.props) art.props(ctx);
    if (E) fog(G, EXT, EF, W, H);
    const defs = `<defs>${glowDef('fcPool', '#ffc65a', 0.5)}${glowDef('fcGlow', '#ffcf6a', 0.9)}</defs>`;
    return { sky: (art.sky && art.sky(ctx)) || `linear-gradient(${P.forest}, ${P.forest})`, layers: G.layers(defs), props, P: { ...P }, flat, front: south.map(({ k, x, y, box }) => ({ k, x, y, box })), fx: FX[L.biome] || null,
      ...(E ? { ext: EXT.slice() } : {}), ...(GL ? { glade: { ...GL, spots: SP.map((p, i) => { const { poly: pl, ...q } = p; void pl; return { ...q, over: GLF[i] || [] }; }) } } : {}) };
  }

  function gladeGround(GL, SP) {
    const r = rng(9091);
    const spot = (cx, cy, rx, ry, k) => { const pts = []; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, q = 0.78 + r() * 0.3; pts.push([cx + Math.cos(a) * rx * q, cy + Math.sin(a) * ry * q]); } return `<path d="${smooth(pts)}" fill="${P.path}" opacity="${k}"/>`; };
    let s = '';
    if (GL.poly) {
      const edge = wobble(GL.poly, 60, 14, r), cx = GL.cx, y0 = GL.y0;
      s += `<path d="${smooth(edge)}" fill="none" stroke="${P.forestD || P.forest}" stroke-width="70" stroke-linejoin="round" opacity=".55"/><path d="${smooth(edge)}" fill="${P.grassD}"/><path d="${smooth(wobble(GL.poly.map(([x, y]) => [cx + (x - cx) * 0.94, y0 + (y - y0) * 0.9]), 60, 12, r))}" fill="${P.grass}"/>`;
      s += spot(cx, y0 + 40, 250, 46, 0.7);
    }
    for (const p of SP) {
      if (p.poly) {
        const e = wobble(p.poly, 50, 12, r), mid = p.poly.map(([x, y]) => [p.x + (x - p.x) * 0.86, p.y + 10 + (y - p.y - 10) * 0.84]);
        s += `<path d="${smooth(e)}" fill="none" stroke="${P.forestD || P.forest}" stroke-width="56" stroke-linejoin="round" opacity=".55"/><path d="${smooth(e)}" fill="${P.grassD}"/><path d="${smooth(wobble(mid, 50, 10, r))}" fill="${P.grass}"/>`;
      }
      s += spot(p.x, p.y - 18, (p.t === 'e' ? 120 : 150), 46, 0.5) + spot(p.x + 6, p.y - 14, 80, 22, 0.32);
    }
    return s;
  }

  function gladeDetail(G, GL, SP, W, H, seed) {
    const r = rng(9092 + seed);
    const one = (x, y) => {
      const kind = r();
      if (kind < 0.58) G.brush(1, x, y, `<path d="%D" fill="none" stroke="${P.grassD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, `M${f1(x - 7)} ${f1(y)} l3 -9 M${f1(x)} ${f1(y)} l0 -12 M${f1(x + 7)} ${f1(y)} l-3 -9 `);
      else if (kind < 0.76) G.brush(1, x, y, `<path d="%D" fill="${P.grassL}" opacity=".9"/>`, `M${f1(x - 12)} ${f1(y)} q12 -14 24 0 q-12 6 -24 0 Z `);
      else if (kind < 0.88) { const c = ['#fff4e0', '#ffd0dc', '#ffe27a', '#c9b6ff'][Math.floor(r() * 4)]; G.brush(1, x, y, `<path d="%D" fill="${c}" stroke="${INK}" stroke-width="1.6"/>`, `M${f1(x + 4)} ${f1(y)} a4 4 0 1 0 -8 0 a4 4 0 1 0 8 0 `); }
      else G.brush(1, x, y, `<path d="%D" fill="#c9b8a4" stroke="${INK}" stroke-width="2"/>`, `M${f1(x - 7)} ${f1(y)} q7 -9 14 0 q-7 5 -14 0 Z `);
    };
    if (GL.poly) { const b = M.boxOf({ p: GL.poly }); for (let n = 0; n < 240; n++) { const x = b[0] + r() * (b[2] - b[0]), y = b[1] + r() * (b[3] - b[1]); if (M.inPoly(GL.poly, x, y) && Math.abs(x - GL.cx) >= 80 && y <= H - 4) one(x, y); } }
    for (const p of SP) if (p.poly) for (let n = 0; n < 50; n++) { const x = p.x + (r() - 0.5) * 2 * (p.rx || 170), y = p.y + 10 + (r() - 0.5) * 2 * (p.ry || 120); if (M.inPoly(p.poly, x, y) && x > 4 && x < W - 4 && y > 4 && y < H - 4) one(x, y); }
  }

  function fog(G, EXT, EF, W, H) {
    const c = P.forest, st = '<stop offset="0" stop-opacity="0"/><stop offset=".45" stop-opacity=".22"/><stop offset=".72" stop-opacity=".55"/><stop offset=".9" stop-opacity=".86"/><stop offset="1" stop-opacity="1"/>'.replace(/<stop /g, `<stop stop-color="${c}" `);
    const [X0, Y0, X1, Y1] = EXT, D = -X0 - EF;
    const side = (id, x1, y1, x2, y2, rect) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st}</linearGradient><rect ${rect} fill="url(#${id})"/>`;
    G.big(8, [X0 - 40, Y0 - 40, X1 + 40, Y1 + 40],
      side('tkFogW', -EF, 0, X0, 0, `x="${X0 - 40}" y="${Y0 - 40}" width="${D + 40}" height="${Y1 - Y0 + 80}"`)
      + side('tkFogE', W + EF, 0, X1, 0, `x="${W + EF}" y="${Y0 - 40}" width="${D + 40}" height="${Y1 - Y0 + 80}"`)
      + side('tkFogN', 0, -EF, 0, Y0, `x="${X0 - 40}" y="${Y0 - 40}" width="${X1 - X0 + 80}" height="${D + 40}"`)
      + side('tkFogS', 0, H + EF, 0, Y1, `x="${X0 - 40}" y="${H + EF}" width="${X1 - X0 + 80}" height="${D + 40}"`));
  }
   
  const nodes = (R) => { const n = (s) => (s.match(/<[a-zA-Z]/g) || []).length; let k = 0; for (const l of R.layers) k += n(l.svg); for (const p of R.props) k += n(p.svg); return k; };



  const NODE_BASE = 1500, NODE_PER_SCREEN = 1350;


  const nodeLimit = (T) => { const L = M.layoutOf(T), e = L.edge ? +L.edge.art || 0 : 0, extra = e ? ((L.W + 2 * e) * (L.H + 2 * e) - L.W * L.H) / (1920 * 1080) : 0; return Math.round(NODE_BASE + NODE_PER_SCREEN * (L.W * L.H) / (1920 * 1080) + NODE_PER_SCREEN * 0.8 * extra); };

  

  function reset(biome) { UID = 0; GSH = []; Object.assign(P, BASE, BIOME[biome] || {}); }
  const gshList = () => GSH;

  const API = { f1, rng, INK, P, FUR, O, esc, uid, reset, gshList, smooth, blob, poly, curve, rr, txt, glowDef, paw, fish, fishbone, yarn, milk, valer, sausage, kitty,
    Ground, wobble, segD, stones, stair, ramp, tree, pine, bush, minePortal, signpost, scales, ROOF, win, door, board, chimney, found, lantern, GLOW,
    hx, mix, dk, lt, gsh, sideWall, foundV, fascia, roofV, roofRidge, stepsV, inShade, fireLight, floorV, tool, cylStones, merlons, houseB, crate1, barrel1, ITEM, shade,
    scaffold, BIOME, BIOMES, NATURE, FX, pal, natureTree, natureSvg, cliff, rockFace, pondBase, pondDeco, KIND, building, bGeom, guildHall, guildFlag, noticeBoard, pennant, woodGate, drawTown, nodes, nodeLimit,
    rowanTree, berries, BERRY, hivesSvg, racksSvg, palisade, watchtower, gladeOf, spotPoly, spotBox };
  if (typeof window !== 'undefined') window.LGTownKitArt = API;
  if (typeof module === 'object' && module.exports) module.exports = API;
})();
