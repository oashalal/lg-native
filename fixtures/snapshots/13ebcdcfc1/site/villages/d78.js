



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const CH = '#3a302c', CHD = '#241e1c', BARK = '#5a4a40', BARKD = '#3a2e28', CLAY = '#d8d0c4', BIRCH = '#e8e2d4', SMOKE = '#a8a2a8', MIST = '#c8c4cc', EMB = '#ff7a2a', EARTH = '#4a3a2e';
  const KINDS = { kiln: { foot: [110, 30], tall: 300 }, mound: { foot: [56, 18], tall: 110 }, sacks: { foot: [36, 10], tall: 50 }, rake: { foot: [16, 6], tall: 130 }, logpile: { foot: [50, 12], tall: 50 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1270, x1: 1570 },
        storage: { x0: 1640, x1: 1920 },
        trainer: { x0: 2880, x1: 3160 },
        magic: { x0: 3230, x1: 3460 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 2000, x1: 2280, B: 1110 },
        tent: { x0: 2420, x1: 2770, B: 1110 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 34, pts: [[960, 908], [1000, 1060], [1100, 1190], [2200, 1192], [3900, 1190], [3990, 1060], [3990, 908]] },
        { k: 'cross', w: 30, pts: [[2200, 1192], [2200, 1290]] },
        { k: 'cross', w: 28, pts: [[1300, 1190], [1300, 1330]] },
        { k: 'cross', w: 28, pts: [[3400, 1190], [3400, 1330]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1360, rx: 220, ry: 86, mark: 'kiln', ms: 1.3 }, { k: 'yard', x: 1300, y: 1386, rx: 180, ry: 66 }, { k: 'yard', x: 3400, y: 1386, rx: 180, ry: 66 }],
      kinds: KINDS,
      props: [['mound', 1190, 1400], ['mound', 1420, 1408], ['mound', 3290, 1404], ['mound', 3520, 1400], ['sacks', 1300, 1430], ['rake', 3400, 1440], ['logpile', 2560, 1300], ['logpile', 700, 1180], ['rake', 1820, 1290]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 480, x1: 690, base: 1446 }, { x0: 2860, x1: 3070, base: 1450 }, { x0: 4100, x1: 4310, base: 1450 }],
      fill: [{ k: ['deadtree', 'rock', 'stump', 'logpile', 'rubble'], n: 22, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'sacks'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1980, 2200], [2250, 2470], [2520, 2840], [3500, 3720], [3770, 4000]], mist: [[700, 1250, 500], [1800, 1430, 600], [2900, 1260, 500], [3900, 1420, 400]] },
    };
  }

   
  const puff = (k, x, y, s = 1) => k.use(k.sym('d78puff', () => `<circle cx="0" cy="0" r="12" fill="${SMOKE}" opacity=".55"/><circle cx="8" cy="-20" r="16" fill="${SMOKE}" opacity=".45"/><circle cx="-4" cy="-44" r="22" fill="${SMOKE}" opacity=".35"/><circle cx="12" cy="-72" r="26" fill="${SMOKE}" opacity=".25"/>`), x, y, s);
  function win(k, x, y, w, h, lv, lit = true) {
    const { f1, O } = k;
    return k.winLit(x, y, w, h, lit) + `<rect x="${f1(x - 6)}" y="${f1(y - 6)}" width="${f1(w + 12)}" height="${f1(h + 12)}" fill="none" stroke="${BIRCH}" stroke-width="5"/><path d="M${f1(x - 8)} ${f1(y - 6)} L${f1(x + w / 2)} ${f1(y - 18)} L${f1(x + w + 8)} ${f1(y - 6)}" fill="${BIRCH}" ${O(2)}/>` + (lv >= 3 ? `<path d="M${f1(x - 8)} ${f1(y + h + 8)} h${f1(w + 16)}" stroke="${BIRCH}" stroke-width="5"/>` : '');
  }
  function barkRoof(k, x0, x1, top, h, lv) {
    const { f1 } = k;
    let g = k.roof(x0, x1, top, h, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#6a5a4a' : BARK, false, BARKD);
    g += `<path d="M${f1(x0 + (x1 - x0) * 0.25)} ${f1(top - h * 0.45)} q30 -10 60 4 M${f1(x0 + (x1 - x0) * 0.55)} ${f1(top - h * 0.3)} q24 -8 50 6" stroke="#1e1a18" stroke-width="7" opacity=".35" fill="none" stroke-linecap="round"/>`;
    return g;
  }
  const clayChimney = (k, x, y, h, lv) => { const { f1, O } = k; return `<path d="M${f1(x - 14)} ${f1(y + h)} L${f1(x - 11)} ${f1(y)} H${f1(x + 11)} L${f1(x + 14)} ${f1(y + h)} Z" fill="${CLAY}" ${O(3)}/><path d="M${f1(x - 11)} ${f1(y)} h22 l-2 ${f1(h * 0.35)} h-18 Z" fill="#6a625e" opacity=".55"/>` + puff(k, x, y - 12, 0.8 + lv * 0.08); };

  function charHouse(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([62, 76, 88, 98, 106][lv - 1], f.up - 10, w * 0.46));
    let g = '';
    if (o.chim !== false) g += clayChimney(k, o.chimX != null ? o.chimX : x1 - 36, top - rh * 0.55 - 40 - lv * 6, 40 + lv * 6 + rh * 0.4, lv);
    if (lv >= 3) g += k.wall(x0, B - 26, w, B, 'rubble');
    g += k.wall(x0, top, w, lv >= 3 ? B - 26 : B, lv <= 1 ? 'shack' : 'log') + `<rect x="${x0}" y="${top}" width="${w}" height="${f.wall - (lv >= 3 ? 26 : 0)}" fill="${CHD}" opacity=".55"/>`;
    g += barkRoof(k, x0, x1, top, rh, lv);
    const ww = [28, 30, 32, 34, 36][lv - 1], wh = [30, 36, 40, 44, 48][lv - 1], wy = top + Math.max(20, (f.wall - wh) * 0.36);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, CHD, 0.92);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 28, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || CHD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 60, 6);
    return { g, top, rh, cx, B };
  }

  function mound(k, x, y, s, lit) {
    const { f1, O } = k;
    let g = `<path d="M${f1(x - 56 * s)} ${y} Q${f1(x - 50 * s)} ${f1(y - 90 * s)} ${x} ${f1(y - 92 * s)} Q${f1(x + 50 * s)} ${f1(y - 90 * s)} ${f1(x + 56 * s)} ${y} Z" fill="${EARTH}" ${O(3)}/><path d="M${f1(x - 40 * s)} ${f1(y - 40 * s)} q20 -10 40 0 M${f1(x)} ${f1(y - 70 * s)} q16 -6 30 4" stroke="#5e4a3a" stroke-width="5" fill="none"/>`;
    for (const [dx, dy] of [[-24, -24], [18, -34], [-4, -60]]) g += `<ellipse cx="${f1(x + dx * s)}" cy="${f1(y + dy * s)}" rx="${f1(6 * s)}" ry="${f1(4 * s)}" fill="${lit ? EMB : '#1e1a18'}"/>`;
    return g + puff(k, x + 4 * s, y - 96 * s, 0.8 * s);
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) { g += `<rect x="${f1(a)}" y="${B - 54}" width="${f1(b - a)}" height="54" fill="#6a4a30" ${O(3)}/>`; let d = ''; for (let x = a + 12; x < b - 6; x += 22) for (let y = B - 44; y < B; y += 18) d += `M${f1(x + ((y / 18) % 2) * 10)} ${y} a7 7 0 1 0 0.1 0`; g += `<path d="${d}" stroke="#3a2a1e" stroke-width="2.5" fill="#a87a4a"/>`; }
      if (lv >= 3) { const sx = x0 + 30, t = B - f.wall; g += `<path d="M${f1(sx - 22)} ${B} V${f1(t + 40)} M${f1(sx + 22)} ${B} V${f1(t + 40)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(sx - 22)} ${B} V${f1(t + 40)} M${f1(sx + 22)} ${B} V${f1(t + 40)}" stroke="${CH}" stroke-width="6"/><rect x="${f1(sx - 30)}" y="${f1(t + 6)}" width="60" height="36" fill="${CH}" ${O(3)}/>` + barkRoof(k, sx - 30, sx + 30, t + 6, 30, 2); }
      for (const px of [cx - ow / 2 - 14, cx + ow / 2 + 14]) g += `<rect x="${f1(px - 14)}" y="${f1(B - ph)}" width="28" height="${f1(ph)}" fill="${CH}" ${O(4)}/>`;
      const by = B - ph - 6;
      g += `<path d="M${f1(cx - ow / 2 - 40)} ${f1(by + 6)} L${f1(cx)} ${f1(by - 44 - lv * 4)} L${f1(cx + ow / 2 + 40)} ${f1(by + 6)} Z" fill="${BARK}" ${O(3.5)}/>` + puff(k, cx + 10, by - 50 - lv * 4, 0.9);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(by - 20)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 24;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${CHD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, CLAY);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = charHouse(k, f, { sign: 'РАТУША', signBg: '#5a1a14', chimX: f.x0 + 30 });
      let g = h.g;
      const bx = f.x1 + 22, bt = h.B - 150 - lv * 10;
      g += `<path d="M${f1(bx - 16)} ${h.B} V${f1(bt)} M${f1(bx + 16)} ${h.B} V${f1(bt)}" stroke="${INK}" stroke-width="9"/><path d="M${f1(bx - 16)} ${h.B} V${f1(bt)} M${f1(bx + 16)} ${h.B} V${f1(bt)}" stroke="${CH}" stroke-width="5"/><path d="M${f1(bx - 26)} ${f1(bt + 2)} L${f1(bx)} ${f1(bt - 30)} L${f1(bx + 26)} ${f1(bt + 2)} Z" fill="${BARK}" ${O(3)}/><path d="M${f1(bx - 11)} ${f1(bt + 8)} q11 -6 22 0 l4 22 h-30 Z" fill="${lv >= 5 ? k.GOLD : '#b89a5a'}" ${O(2)}/><path d="M${f1(bx)} ${f1(bt + 34)} v40" stroke="#8a7a5a" stroke-width="2"/>`;
      if (lv >= 3) for (const s of [-1, 1]) g += `<path d="M${f1(h.cx + s * 64)} ${h.B} V${h.B - 94}" stroke="${INK}" stroke-width="11"/><path d="M${f1(h.cx + s * 64)} ${h.B} V${h.B - 94}" stroke="${BIRCH}" stroke-width="6"/>`;
      if (lv >= 3) g += barkRoof(k, h.cx - 74, h.cx + 74, h.B - 94, 28, 2);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = charHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14' });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} V${f1(h.B - 130)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${h.B} V${f1(h.B - 130)}" stroke="#a88a5a" stroke-width="3"/><path d="M${f1(sx - 9)} ${f1(h.B - 130)} h18 M${f1(sx - 8)} ${f1(h.B - 130)} v10 M${f1(sx)} ${f1(h.B - 130)} v10 M${f1(sx + 8)} ${f1(h.B - 130)} v10" stroke="#5a5662" stroke-width="3"/>`; }
      if (lv >= 2) { const bx = f.x0 - 44; g += `<path d="M${f1(bx - 34)} ${h.B} l14 -50 l14 50 M${f1(bx + 6)} ${h.B} l14 -50 l14 50" stroke="${INK}" stroke-width="5" fill="none"/><rect x="${f1(bx - 46)}" y="${h.B - 66}" width="100" height="20" rx="10" fill="#6a4a30" ${O(3)}/><circle cx="${f1(bx - 36)}" cy="${h.B - 56}" r="7" fill="#a87a4a" ${O(1.5)}/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${CHD}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="#1e1c1e" ${O(4)}/><rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="none" stroke="${BIRCH}" stroke-width="4"/>`;
      for (let i = 0; i < 3 + Math.min(3, lv); i++) { const ny = by0 + 18 + i * 16; if (ny > by1 - 10) break; g += `<path d="M${f1(x0 + 22)} ${f1(ny)} h${f1(w * (0.4 + ((i * 37) % 30) / 100))}" stroke="${CLAY}" stroke-width="3" opacity=".8"/>`; }
      g += barkRoof(k, x0 - 6, x1 + 6, by0 - 4, Math.min(f.up - 40, 26 + lv * 6), lv);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, CHD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 10, cx, x1 - 10]) g += `<path d="M${f1(px)} ${B} V${f1(top + 6)}" stroke="${INK}" stroke-width="11"/><path d="M${f1(px)} ${B} V${f1(top + 6)}" stroke="${CH}" stroke-width="6"/>`;
      g += `<rect x="${f1(x0 + 16)}" y="${f1(top + 20)}" width="${f1(w - 32)}" height="${f1(f.wall - 20)}" fill="#2a2422" opacity=".7"/>`;
      g += `<path d="M${f1(x0 + 14)} ${B} Q${f1(x0 + w * 0.3)} ${f1(B - f.wall * 0.6)} ${f1(cx)} ${f1(B - f.wall * 0.3)} Q${f1(x1 - w * 0.25)} ${f1(B - f.wall * 0.7)} ${f1(x1 - 14)} ${B} Z" fill="#1a1618" ${O(3)}/><path d="M${f1(x0 + 40)} ${f1(B - 30)} l6 -4 M${f1(cx + 30)} ${f1(B - 50)} l8 -3 M${f1(x1 - 60)} ${f1(B - 26)} l6 -4" stroke="#6a6a7a" stroke-width="3"/>`;
      for (let i = 0; i < Math.min(lv + 1, 4); i++) g += `<path d="M${f1(x0 + 20 + i * 36)} ${B} q-4 -32 16 -36 q20 4 16 36 Z" fill="#b8a07a" ${O(2.5)}/>`;
      g += barkRoof(k, x0 - 6, x1 + 6, top + 6, Math.min(f.up - 10, 50 + lv * 10), lv);
      if (lv >= 4) g += `<path d="M${f1(x1 + 6)} ${B - 26} h60 l-10 -26 h-44 Z" fill="#6a4a30" ${O(2.5)}/><circle cx="${f1(x1 + 30)}" cy="${B - 10}" r="12" fill="#3a2a1e" ${O(2.5)}/><path d="M${f1(x1 + 14)} ${B - 52} q22 -14 40 0" fill="#1a1618"/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - 20)}" r="10" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx, top + 26, Math.min(w - 10, 130), 'СКЛАД', lv, 19, CHD);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const h = charHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      let g = h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="${EMB}"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) { const bx = f.x1 - 30 - i * 40; g += `<path d="M${f1(bx - 16)} ${h.B} l-4 -30 h40 l-4 30 Z" fill="#a88a5a" ${O(2.5)}/><path d="M${f1(bx - 18)} ${h.B - 30} q18 -14 36 0" fill="#1a1618"/>`; }
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(a)} ${B} Q${f1(a + (b - a) * 0.12)} ${f1(t + h * 0.3)} ${f1(m)} ${f1(t)} Q${f1(b - (b - a) * 0.12)} ${f1(t + h * 0.3)} ${f1(b)} ${B} Z" fill="#8a827a" ${O()}/><path d="M${f1(m - (b - a) * 0.2)} ${f1(t + h * 0.2)} Q${f1(m)} ${f1(t + h * 0.4)} ${f1(m + (b - a) * 0.2)} ${f1(t + h * 0.2)}" stroke="#5a524c" stroke-width="12" fill="none" opacity=".5"/>`;
        s += `<path d="M${f1(m - 8)} ${f1(t + 4)} l-8 -24 M${f1(m + 8)} ${f1(t + 4)} l8 -24" stroke="${INK}" stroke-width="4"/>` + puff(k, m, t - 20, 0.7);
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 6)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 40 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} Q${f1(cx - 28)} ${f1(B - 80 - lv * 5)} ${f1(cx)} ${f1(B - 92 - lv * 5)} Q${f1(cx + 28)} ${f1(B - 80 - lv * 5)} ${f1(cx + 30)} ${B} Z" fill="#1e1a18" ${O(3)}/>`;
      if (lv >= 2) { const tx = x1 + 6; g += `<path d="M${f1(tx - 22)} ${B} L${f1(tx)} ${B - 60} L${f1(tx + 22)} ${B}" stroke="${INK}" stroke-width="4" fill="none"/><path d="M${f1(tx - 14)} ${B - 46} h28 q0 20 -14 20 q-14 0 -14 -20 Z" fill="#3a3640" ${O(2)}/><path d="M${f1(tx - 12)} ${B} q12 -26 24 0" fill="${EMB}"/>`; }
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, CHD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = charHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true, chimX: x0 + 30 });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${BARK}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${CHD}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 40))); i < n; i++) g += `<path d="M${f1(ax0 + 22 + i * 40)} ${f1(ay + 22)} v10" stroke="${INK}" stroke-width="2"/>` + k.wallLamp(ax0 + 28 + i * 40, ay + 30);
      for (let i = 0; i < Math.min(3, lv + 1); i++) g += `<path d="M${f1(ax0 + 14 + i * 38)} ${h.B} q-4 -34 16 -38 q20 4 16 38 Z" fill="#b8a07a" ${O(2.5)}/><path d="M${f1(ax0 + 20 + i * 38)} ${h.B - 34} q10 -10 20 0" fill="#1a1618"/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall - 10;
      let g = `<path d="M${f1(x0 + 16)} ${B} L${f1(x0 + w * 0.26)} ${f1(top + 30)} H${f1(x1 - w * 0.26)} L${f1(x1 - 16)} ${B} Z" fill="#5a5258" ${O()}/>`;
      let d = ''; for (let y = B - 30; y > top + 40; y -= 30) d += `M${f1(cx - w * 0.3)} ${y} H${f1(cx + w * 0.3)}`; g += `<path d="${d}" stroke="#3e383e" stroke-width="3"/>`;
      g += `<path d="M${f1(cx - w * 0.36)} ${f1(top + 30)} h${f1(w * 0.72)} l-10 -22 h${f1(-w * 0.72 + 20)} Z" fill="#3e383e" ${O(3)}/><circle cx="${f1(cx)}" cy="${f1(top - 4)}" r="60" fill="url(#tgGlow)" opacity=".7"/><path d="M${f1(cx - 22)} ${f1(top + 6)} q22 -60 44 0 q-8 -26 -22 -8 q-14 -22 -22 8" fill="${EMB}" stroke="#c8402a" stroke-width="2"/><path d="M${f1(cx - 10)} ${f1(top + 4)} q10 -30 20 0" fill="#ffd76a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<ellipse cx="${f1(cx)}" cy="${f1(top + 70 + i * 50)}" rx="${f1(w * 0.55 + i * 10)}" ry="10" fill="none" stroke="${MIST}" stroke-width="6" opacity=".45"/>`;
      g += win(k, cx - 13, top + 70, 26, 34, lv) + k.door(cx, B, 40 + lv * 3, 64 + lv * 4, '#2a1e3a');
      if (lv >= 5) g += k.orb(cx, top - 60, 9);
      k.signId('magic'); g += k.signLv(cx, B - 118, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a5a');
      return g;
    },
  };

  const art = {
    K: {},

    back(k) {
      const { P, L } = k;
      let d = ''; for (let x = 20; x < L.W; x += 38) { const h = 60 + ((x * 13) % 70); d += `M${x} 712 V${712 - h} M${x} ${712 - h * 0.6} l-14 -16 M${x} ${712 - h * 0.4} l12 -18`; }
      let g = `<path d="${d}" stroke="#2a2226" stroke-width="5" fill="none"/>`;
      for (const [x, y, w] of [[600, 690, 1400], [2200, 670, 1600], [3700, 690, 1200]]) g += `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="22" fill="${MIST}" opacity=".18"/>`;
      P(0, L.W, g);
    },

    water(k) { for (const [x, y, w] of k.L.hx.mist || []) k.P(x - w / 2, x + w / 2, `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="26" fill="${MIST}" opacity=".16"/><ellipse cx="${x + w * 0.1}" cy="${y - 10}" rx="${w * 0.3}" ry="14" fill="${MIST}" opacity=".14"/>`, y - 40, y + 40); },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, charHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 26, 28, 32, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, CHD) + (b - x1 > 90 ? mound(k, (x1 + b) / 2, 794, 0.8, i % 2) : ''));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + puff(k, lot.x0 + 10, 640, 0.6);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = charHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 26, 30, 32, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, CHD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(290 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'kiln') {

        let g = k.ell(x, y + 4, 150, 26) + `<path d="M${x - 130} ${y} Q${x - 120} ${y - 200} ${x} ${y - 210} Q${x + 120} ${y - 200} ${x + 130} ${y} Z" fill="${EARTH}" ${O(4.5)}/>`;
        for (const [u, v, r] of [[-70, -60, 30], [40, -120, 34], [-20, -170, 26], [80, -40, 22]]) g += `<ellipse cx="${x + u}" cy="${y + v}" rx="${r}" ry="${r * 0.5}" fill="#5a6a3a" opacity=".8"/>`;
        for (const [dx, dy] of [[-60, -40], [-20, -90], [30, -60], [70, -100], [0, -150], [-80, -110], [90, -30]]) g += `<ellipse cx="${x + dx}" cy="${y + dy}" rx="8" ry="5" fill="${EMB}"/><circle cx="${x + dx}" cy="${y + dy}" r="14" fill="${EMB}" opacity=".2"/>`;
        g += `<path d="M${x + 50} ${y} L${x + 14} ${y - 200} M${x + 76} ${y} L${x + 40} ${y - 200}" stroke="${INK}" stroke-width="7"/><path d="M${x + 50} ${y} L${x + 14} ${y - 200} M${x + 76} ${y} L${x + 40} ${y - 200}" stroke="#a87a4a" stroke-width="3.5"/>`;
        let r = ''; for (let i = 1; i < 8; i++) { const t = i / 8; r += `M${f1(x + 50 - 36 * t)} ${f1(y - 200 * t)} h26`; } g += `<path d="${r}" stroke="#a87a4a" stroke-width="4"/>`;
        g += puff(k, x - 6, y - 214, 1.5) + puff(k, x + 30, y - 260, 1.1);
        const cx2 = x - 160; g += `<ellipse cx="${cx2}" cy="${y + 4}" rx="20" ry="6" fill="#1e1a20" opacity=".35"/><path d="M${cx2 - 14} ${y} Q${cx2 - 16} ${y - 50} ${cx2} ${y - 56} Q${cx2 + 16} ${y - 50} ${cx2 + 14} ${y} Z" fill="#4a4040" ${O(3)}/><circle cx="${cx2}" cy="${y - 66}" r="12" fill="#c8a888" ${O(2.5)}/><path d="M${cx2 - 14} ${y - 70} q14 -16 28 0 Z" fill="#2a2426" ${O(2)}/><path d="M${cx2 + 16} ${y} L${cx2 + 30} ${y - 120} M${cx2 + 20} ${y - 120} h20" stroke="${INK}" stroke-width="5"/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 380 * s, h: 340 * s };
      }
      if (p.k === 'mound') return { g: k.ell(x, y + 2, 60 * s, 12) + mound(k, x, y, s, p.v % 2), w: 140 * s, h: 200 * s };
      if (p.k === 'sacks') return { g: k.ell(x, y, 36, 8) + [-16, 4, 22].map((dx, i) => `<path d="M${x + dx - 12} ${y} q-4 -30 12 -34 q16 4 12 34 Z" fill="#b8a07a" ${O(2.5)}/><path d="M${x + dx - 6} ${y - 30} q6 -8 12 0" fill="#1a1618"/>`).join(''), w: 90, h: 50, flat: true };
      if (p.k === 'rake') return { g: k.ell(x, y, 14, 4) + `<path d="M${x} ${y} l6 -120" stroke="${INK}" stroke-width="6"/><path d="M${x} ${y} l6 -120" stroke="#a88a5a" stroke-width="3"/><path d="M${x - 10} ${y - 116} h32 M${x - 8} ${y - 116} v10 M${x + 2} ${y - 116} v10 M${x + 12} ${y - 116} v10 M${x + 20} ${y - 116} v10" stroke="#5a5662" stroke-width="3"/>`, w: 60, h: 130 };
      if (p.k === 'logpile') { let g = k.ell(x, y, 50, 10); for (const [dx, dy] of [[-30, -10], [-6, -10], [18, -10], [-18, -30], [6, -30], [-6, -50]]) g += `<circle cx="${x + dx}" cy="${y + dy}" r="11" fill="#a87a4a" stroke="#3a2a1e" stroke-width="2.5"/><circle cx="${x + dx}" cy="${y + dy}" r="4" fill="none" stroke="#6a4a2a" stroke-width="1.5"/>`; return { g, w: 120, h: 70, flat: true }; }
      return null;
    },
  };

  return {
    id: 'd78', ver: 1, name: 'Дымино', layout, art,
    story: 'Деревня углежогов: закопчённые срубы под корьём, белёные трубы, светлые берёзовые наличники. Вдоль нижней улицы - угольные дворы с курящимися кучами, в среднем - Большая печь, и её дым стелется туманом по всей гари; чародей держит Туманную башню с огнём, что пробивает мглу.',
  };
});
