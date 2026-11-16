



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const LOGC = '#7a5a40', LOGD = '#4a3424', HERB = '#7a9a3a', BERRY = '#c8283a', STEAM = '#ffffff', WARM = '#7ac8d8', ST = '#9aa4b2', STD = '#6a7484', CLOTH = '#f2ece0';
  const KINDS = { healbowl: { foot: [80, 24], tall: 220 }, mortar: { foot: [18, 8], tall: 60 }, herbrack2: { foot: [44, 10], tall: 110 }, rowan2: { foot: [22, 9], tall: 200, tree: true } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1180 },
        hall: { x0: 1250, x1: 1440 },
        trainer: { x0: 2860, x1: 3140 },
        magic: { x0: 3210, x1: 3440 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1520, x1: 1780, B: 1170 },
        tent: { x0: 2420, x1: 2770, B: 1170 },
        storage: { x0: 3520, x1: 3800, B: 1180 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 34, pts: [[1460, 908], [1480, 1100], [1560, 1240], [2200, 1240], [2900, 1240], [3640, 1250], [3990, 1220], [3990, 908]] },
        { k: 'cross', w: 30, pts: [[2200, 1240], [2200, 1290]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1360, rx: 220, ry: 80, mark: 'healbowl', ms: 1.3 }],
      water: [{ k: 'spring', e: [1720, 1390, 180, 40], art: 1 }, { k: 'spring', e: [2690, 1394, 190, 40], art: 1 }, { k: 'spring', e: [900, 1300, 120, 30], art: 1 }],
      kinds: KINDS,
      props: [['rowan2', 1200, 1200], ['herbrack2', 3300, 1300], ['mortar', 2050, 1140], ['rowan2', 3200, 1420], ['mortar', 1150, 1400], ['herbrack2', 640, 1150]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 450, x1: 660, base: 1446 }, { x0: 3000, x1: 3200, base: 1450 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['pine', 'drift', 'rowan2', 'rock', 'mortar'], n: 16, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'drift'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1480, 1700], [1740, 1960], [2320, 2560], [2600, 2820], [3480, 3720], [3770, 4000]] },
    };
  }

   
  const steam = (k, x, y, s = 1) => k.use(k.sym('d26steam', () => `<path d="M0 0 q-10 -16 0 -30 q10 -14 0 -30 M14 -4 q-8 -14 0 -26 q8 -12 0 -24" stroke="${STEAM}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>`), x, y, s);
  const bunch = (k, x, y, s = 1) => k.use(k.sym('d26bunch', () => { const { O } = k; return `<path d="M0 0 v6" stroke="#2a1e14" stroke-width="2"/><path d="M-7 6 L0 32 L7 6 Z" fill="${HERB}" ${O(1.8)}/><path d="M-8 8 h16" stroke="${BERRY}" stroke-width="3"/>`; }), x, y, s);
  const berries = (k, x, y) => { const { f1, O } = k; return [[-5, 0], [4, 1], [0, 7], [-7, 8], [7, 8]].map(([dx, dy]) => `<circle cx="${f1(x + dx)}" cy="${f1(y + dy)}" r="4" fill="${BERRY}" ${O(1.2)}/>`).join(''); };
  const mortar = (k, x, B, s = 1) => { const { f1, O } = k; return `<path d="M${f1(x - 14 * s)} ${f1(B - 30 * s)} h${f1(28 * s)} l${f1(-4 * s)} ${f1(30 * s)} h${f1(-20 * s)} Z" fill="${LOGC}" ${O(2.5)}/><path d="M${f1(x + 2)} ${f1(B - 30 * s)} l${f1(10 * s)} ${f1(-40 * s)}" stroke="${k.INK}" stroke-width="${f1(6 * s)}" stroke-linecap="round"/><path d="M${f1(x + 2)} ${f1(B - 30 * s)} l${f1(10 * s)} ${f1(-40 * s)}" stroke="#c8a06a" stroke-width="${f1(3 * s)}" stroke-linecap="round"/>`; };
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return k.winLit(x, y, w, h, true) + `<rect x="${f1(x - 9)}" y="${f1(y - 4)}" width="8" height="${f1(h + 8)}" fill="${HERB}" ${O(2)}/><rect x="${f1(x + w + 1)}" y="${f1(y - 4)}" width="8" height="${f1(h + 8)}" fill="${HERB}" ${O(2)}/>` + (lv >= 2 ? `<path d="M${f1(x - 10)} ${f1(y + h + 7)} h${f1(w + 20)}" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>` : '');
  }

  function hut(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([60, 72, 84, 94, 102][lv - 1], f.up - 10, w * 0.44));
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + k.roof(x0, x1, top, rh, 'thatch', '#7a7058', false) + k.snowCap(x0 - 24, x1 + 24, top + 6, rh);
    g += `<path d="M${x0 - 10} ${B + 2} Q${k.f1(x0 + w * 0.25)} ${B - 26} ${k.f1(cx)} ${B - 10} Q${k.f1(x1 - w * 0.2)} ${B - 30} ${x1 + 10} ${B + 2} Z" fill="#f6fafd" ${k.O(2.5, '#b8cce0')}/>`;
    if (o.herbs !== false && lv >= 2) for (let i = 0; i < Math.min(lv + 1, Math.floor(w / 36)); i++) { const x = x0 + 18 + i * (w - 36) / Math.max(1, Math.min(lv, Math.floor(w / 36) - 1)); g += i % 2 ? `<path d="M${k.f1(x)} ${top + 8} v8" stroke="#2a1e14" stroke-width="2"/>` + berries(k, x, top + 20) : bunch(k, x, top + 8, 0.9); }
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [26, 32, 36, 40, 44][lv - 1], wy = top + Math.max(36, (f.wall - wh) * 0.42);
    if (!o.noWin) for (const x of [x0 + 24, x1 - 24 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) { g += k.bigDoor(cx, B, lv, LOGD, 0.92); if (lv >= 2) g += mortar(k, cx + 52, B, 0.9); }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 30, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || LOGD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) { let d = ''; for (let x = a + 8; x < b; x += 16) d += `M${f1(x)} ${B} V${B - 56}`; g += `<path d="${d}" stroke="${INK}" stroke-width="10"/><path d="${d}" stroke="${LOGC}" stroke-width="6"/><path d="M${f1(a)} ${B - 58} H${f1(b)}" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>`; }
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 14); g += `<rect x="${f1(px - 14)}" y="${f1(B - ph)}" width="28" height="${f1(ph)}" fill="${LOGC}" ${O(4)}/><g transform="translate(${f1(px)} ${f1(B - ph - 14)})"><ellipse rx="18" ry="22" fill="${LOGD}" ${O(2.5)}/><circle cx="-7" cy="-6" r="6" fill="#ffd76a" ${O(1.5)}/><circle cx="7" cy="-6" r="6" fill="#ffd76a" ${O(1.5)}/><path d="M-3 2 l3 6 l3 -6 Z" fill="#e0a040"/><path d="M-14 -18 l6 6 M14 -18 l-6 6" stroke="${INK}" stroke-width="3"/></g>`; }
      const by = B - ph + 26;
      g += `<path d="M${f1(cx - ow / 2)} ${f1(by)} H${f1(cx + ow / 2)}" stroke="${INK}" stroke-width="12"/><path d="M${f1(cx - ow / 2)} ${f1(by)} H${f1(cx + ow / 2)}" stroke="${LOGC}" stroke-width="7"/>`;
      for (let i = 0; i < 3 + Math.min(lv, 3); i++) g += bunch(k, cx - ow / 2 + 12 + i * (ow - 24) / (2 + Math.min(lv, 3)), by + 4, 0.9);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(by - 16)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 42;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${LOGD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, CLOTH);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = hut(k, f, { sign: 'РАТУША', signBg: '#5a1a14' });
      let g = h.g;
      const ly = h.top - h.rh * 0.45; g += `<path d="M${f1(h.cx)} ${f1(ly - 22)} Q${f1(h.cx + 22)} ${f1(ly)} ${f1(h.cx)} ${f1(ly + 22)} Q${f1(h.cx - 22)} ${f1(ly)} ${f1(h.cx)} ${f1(ly - 22)} Z" fill="${lv >= 5 ? k.GOLD : HERB}" ${O(2.5)}/><path d="M${f1(h.cx)} ${f1(ly - 16)} v34" stroke="#3a5a1a" stroke-width="2.5"/>`;
      if (lv >= 3) g += steam(k, f.x1 - 30, h.top - h.rh * 0.3, 0.8);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = hut(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14' });
      let g = h.g;
      if (lv >= 2) { const bx = f.x0 - 38; g += `<path d="M${f1(bx - 24)} ${h.B} l-4 -50 h56 l-4 50 Z" fill="${LOGC}" ${O(3)}/><path d="M${f1(bx - 26)} ${h.B - 36} h52 M${f1(bx - 26)} ${h.B - 14} h52" stroke="${LOGD}" stroke-width="4"/><ellipse cx="${f1(bx)}" cy="${h.B - 50}" rx="28" ry="6" fill="${WARM}" ${O(2)}/>` + steam(k, bx, h.B - 56, 0.6); }
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(f.x1 + 20 + i * 18)} ${h.B - 100} v40" stroke="#a87a4a" stroke-width="4"/><path d="M${f1(f.x1 + 12 + i * 18)} ${h.B - 60} L${f1(f.x1 + 20 + i * 18)} ${h.B - 20} L${f1(f.x1 + 28 + i * 18)} ${h.B - 60} Z" fill="${HERB}" ${O(1.8)}/>`;
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${LOGD}" ${O(3.5)}/>`;
      const by0 = top + 26, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${LOGC}" ${O(4)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(54, (w - 50) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="#f2efe0" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/><path d="M${f1(nx + nw - 12)} ${f1(ny + nw * 0.9 - 14)} q6 -10 10 0 q-6 6 -10 0" fill="${HERB}"/>`; }
      g += k.roof(x0 - 6, x1 + 6, by0 - 4, Math.min(f.up - 40, 26 + lv * 6), 'thatch', '#7a7058', false) + k.snowCap(x0 - 20, x1 + 20, by0, Math.min(f.up - 40, 26 + lv * 6));
      for (let i = 0; i < 3; i++) g += bunch(k, x0 + 20 + i * (w - 40) / 2, by0 + 2, 0.8);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, LOGD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      k.signId('storage'); const h = hut(k, f, { sign: 'СКЛАД', signBg: '#4a3a1e', noWin: true });
      let g = h.g;
      for (let i = 0; i < Math.min(lv + 1, 4); i++) g += `<rect x="${f1(x0 - 6 - (i % 2) * 4)}" y="${f1(B - 28 - Math.floor(i / 2) * 26)}" width="40" height="26" rx="4" fill="#a8885a" ${O(2.5)}/><path d="M${f1(x0 + 2 - (i % 2) * 4)} ${f1(B - 22 - Math.floor(i / 2) * 26)} q6 -6 12 0 q6 -6 12 0" stroke="${HERB}" stroke-width="3" fill="none"/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(h.top - h.rh - 10)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), STD);
      const h = hut(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, herbs: false });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(a)} ${B} V${f1(B - h * 0.4)} Q${f1(m)} ${f1(t - 10)} ${f1(b)} ${f1(B - h * 0.4)} V${B} Z" fill="#c8b8a0" ${O()}/><path d="M${f1(a)} ${f1(B - h * 0.4)} Q${f1(m)} ${f1(t - 10)} ${f1(b)} ${f1(B - h * 0.4)} L${f1(b - 10)} ${f1(B - h * 0.4 + 6)} Q${f1(m)} ${f1(t + 6)} ${f1(a + 10)} ${f1(B - h * 0.4 + 6)} Z" fill="#f6fafd"/><path d="M${f1(a)} ${f1(B - h * 0.25)} H${f1(b)}" stroke="${HERB}" stroke-width="6"/>`;
        s += steam(k, m, t + 6, 0.8);
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t + 14)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.62, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.58, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 40 + lv * 10), lv >= 5) + k.door(cx, B, 50 + lv * 2, 64 + lv * 3, LOGD);
      if (lv >= 2) g += `<path d="M${f1(x1 + 4)} ${B} l-3 -36 h40 l-3 36 Z" fill="${LOGC}" ${O(2.5)}/><ellipse cx="${f1(x1 + 21)}" cy="${B - 36}" rx="20" ry="5" fill="${WARM}" ${O(2)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 50, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, LOGD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = hut(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true, herbs: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(100, f.wall * 0.66);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${HERB}" ${O(3)}/><path d="M${f1(ax0 - 8)} ${f1(ay)} H${f1(ax1 + 8)}" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${LOGD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${LOGC}" ${O(3)}/>`;
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 30))); i < n; i++) g += bunch(k, ax0 + 18 + i * 30, ay + 22, 0.9);
      for (let i = 0; i < Math.min(4, lv + 1); i++) g += `<path d="M${f1(ax0 + 18 + i * 24)} ${h.B - 30} v-14 q0 -8 6 -8 h2 q6 0 6 8 v14 Z" fill="${['#7ac8d8', BERRY, HERB, '#b8a2ff'][i]}" ${O(2)}/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0 + w * 0.18, top + 40, w * 0.64, B, 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + k.roof(x0 + w * 0.12, x1 - w * 0.12, top + 40, Math.min(f.up + 30, 70 + lv * 10), 'thatch', '#5a4a6a', false) + k.snowCap(x0, x1, top + 46, Math.min(f.up + 30, 70 + lv * 10));
      const oy = top + 40 - Math.min(f.up + 30, 70 + lv * 10) - 10;
      g += `<g transform="translate(${f1(cx)} ${f1(oy)})"><ellipse rx="16" ry="20" fill="${LOGD}" ${O(2.5)}/><circle cx="-6" cy="-5" r="5" fill="#ffd76a"/><circle cx="6" cy="-5" r="5" fill="#ffd76a"/></g>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - 60 + i * 60)} ${f1(oy - 30 - (i % 2) * 20)} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="${lv >= 5 ? k.GOLD : '#ffd76a'}" ${O(1.2)}/>`;
      g += win(k, cx - 13, top + 90, 26, 32, lv) + k.door(cx, B, 40 + lv * 3, 62 + lv * 4, '#2a1e4a') + steam(k, x1 - 20, top + 60, 0.7);
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},

    water(k) { for (const w of k.L.water) { const [x, y, rx, ry] = w.e; k.P(x - rx - 20, x + rx + 20, `<ellipse cx="${x}" cy="${y}" rx="${rx + 14}" ry="${ry + 9}" fill="${ST}" ${k.O(3)}/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${WARM}" ${k.O(2.5)}/><ellipse cx="${x - rx * 0.2}" cy="${y - ry * 0.3}" rx="${rx * 0.5}" ry="${ry * 0.3}" fill="#b8eef0"/>`, y - ry - 14, y + ry + 14); for (let i = 0; i < 3; i++) k.P(x - rx, x + rx, steam(k, x - rx * 0.5 + i * rx * 0.5, y - 8, 0.9), y - 80, y + 10); } },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, hut(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 40, 28, 28, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, LOGD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = hut(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 40, 30, 28, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, LOGD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(280 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'healbowl') {

        let g = k.ell(x, y + 4, 100, 20) + `<rect x="${x - 86}" y="${y - 20}" width="172" height="20" fill="${STD}" ${O(3.5)}/><path d="M${x - 76} ${y - 20} Q${x - 80} ${y - 80} ${x} ${y - 84} Q${x + 80} ${y - 80} ${x + 76} ${y - 20} Z" fill="${ST}" ${O(4)}/><ellipse cx="${x}" cy="${y - 80}" rx="74" ry="14" fill="${WARM}" ${O(3)}/>`;
        g += `<path d="M${x + 60} ${y - 80} V${y - 180} H${x + 84} V${y - 80}" fill="${LOGC}" ${O(3)}/><path d="M${x + 72} ${y - 176} L${x + 20} ${y - 150}" stroke="${LOGC}" stroke-width="12" stroke-linecap="round"/><path d="M${x + 20} ${y - 150} q-6 30 -4 66" stroke="${WARM}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
        g += steam(k, x - 40, y - 90, 1.3) + steam(k, x + 10, y - 96, 1.1) + steam(k, x - 6, y - 150, 1);
        for (const dx of [-110, 110]) g += `<path d="M${x + dx} ${y} V${y - 90}" stroke="${INK}" stroke-width="6"/>` + bunch(k, x + dx, y - 90, 1.2);
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 260 * s, h: 240 * s };
      }
      if (p.k === 'mortar') return { g: k.ell(x, y, 18, 5) + mortar(k, x, y, 1), w: 50, h: 80 };
      if (p.k === 'herbrack2') { let g = k.ell(x, y, 44, 8) + `<path d="M${x - 40} ${y} V${y - 100} M${x + 40} ${y} V${y - 100} M${x - 46} ${y - 96} H${x + 46}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 40} ${y} V${y - 100} M${x + 40} ${y} V${y - 100}" stroke="#a87a4a" stroke-width="3.5"/>`; for (let i = 0; i < 4; i++) g += bunch(k, x - 30 + i * 20, y - 94, 0.9); return { g: g + `<path d="M${x - 48} ${y - 98} H${x + 48}" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>`, w: 110, h: 110 }; }
      if (p.k === 'rowan2') { let g = k.ell(x, y, 24 * s, 6) + `<path d="M${x} ${y} V${f1(y - 120 * s)}" stroke="${INK}" stroke-width="${f1(12 * s)}"/><path d="M${x} ${y} V${f1(y - 120 * s)}" stroke="#6a4a3a" stroke-width="${f1(7 * s)}"/>`; for (const [dx, dy, r] of [[-26, -130, 30], [24, -140, 28], [0, -170, 30]]) g += `<circle cx="${f1(x + dx * s)}" cy="${f1(y + dy * s)}" r="${f1(r * s)}" fill="#f2f6fa" ${O(2.5)}/>`; for (const [dx, dy] of [[-30, -126], [18, -134], [-4, -160], [28, -150]]) g += berries(k, x + dx * s, y + dy * s); return { g, w: 140 * s, h: 210 * s }; }
      return null;
    },
  };

  return {
    id: 'd26', ver: 1, name: 'Стужово', layout, art,
    story: 'Деревня знахарей у горячих ключей: срубы по самые окна в снегу, под стрехами сушатся травы и рябина, у дверей - ступы с пестами. Внизу из-под снега бьют горячие ключи и курятся паром, а посреди стоит Целебная чаша, к которой идут лечиться со всего Белого Венца.',
  };
});
