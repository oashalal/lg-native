



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const RK = '#c8683e', RKL = '#de8a56', RKD = '#9a4a2a', SAND = '#e8c890', SANDD = '#c8a06a', BLUE = '#3a7ab0', BLUED = '#24527a', CLOTH = '#f4e8cc', WOOD = '#8a5a32';
  const KINDS = { windmill: { foot: [70, 22], tall: 420 }, pots: { foot: [30, 10], tall: 50 }, chime: { foot: [14, 6], tall: 150 }, cactus2: { foot: [18, 8], tall: 120 } };

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
        shop: { x0: 2000, x1: 2280, B: 1180 },
        tent: { x0: 2440, x1: 2790, B: 1180 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'trail', w: 34, pts: [[960, 908], [1000, 1100], [1100, 1250], [1700, 1262], [2400, 1256], [3200, 1266], [3900, 1250], [3990, 1100], [3990, 908]] },
        { k: 'trail', w: 32, pts: [[1100, 1250], [916, 1306]] },
      ],
      plazas: [{ k: 'central', x: 700, y: 1320, rx: 220, ry: 90, mark: 'windmill', ms: 1.2 }],
      water: [{ k: 'spring', e: [2640, 1414, 90, 22] }],
      kinds: KINDS,
      props: [['pots', 1960, 1250 - 50], ['cactus2', 1300, 1400], ['pots', 3400, 1190], ['chime', 3700, 1190], ['cactus2', 3600, 1420]],
      houses: [{ x0: 1300, x1: 1500, base: 1452 }, { x0: 2950, x1: 3150, base: 1450 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['cactus2', 'rock', 'pots', 'cactus2', 'chime'], n: 16, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'pots'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { caves: [[1960, 2200], [2240, 2460], [2520, 2840], [3500, 3720], [3770, 4000]], wash: [[1180, 1410], [2000, 1420], [2900, 1404], [3700, 1416], [4320, 1400]], mills: [500, 1500, 2300, 3100, 3900] },
    };
  }

   
  const mill = (k, x, y, s, n = 6, cloth = CLOTH) => { const { f1, O, INK } = k; let g = ''; for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n; g += `<path d="M${f1(x)} ${f1(y)} L${f1(x + Math.cos(a) * 70 * s)} ${f1(y + Math.sin(a) * 70 * s)}" stroke="${INK}" stroke-width="${f1(4 * s)}"/><path d="M${f1(x + Math.cos(a) * 14 * s)} ${f1(y + Math.sin(a) * 14 * s)} L${f1(x + Math.cos(a) * 66 * s)} ${f1(y + Math.sin(a) * 66 * s)} L${f1(x + Math.cos(a + 0.42) * 56 * s)} ${f1(y + Math.sin(a + 0.42) * 56 * s)} Z" fill="${cloth}" ${O(2)}/>`; } return g + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(8 * s)}" fill="${WOOD}" ${O(2)}/>`; };
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    let g = k.winLit(x, y, w, h, true, true);
    if (lv >= 2) g += `<path d="M${f1(x - 10)} ${f1(y + w / 2)} V${f1(y + h)} H${f1(x - 1)} V${f1(y + w / 2)} Z M${f1(x + w + 1)} ${f1(y + w / 2)} V${f1(y + h)} H${f1(x + w + 10)} V${f1(y + w / 2)} Z" fill="${BLUE}" ${O(2)}/>`;
    return g;
  }

  function sandHouse(k, f, o = {}) {
    const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'clay' : 'stone') + `<rect x="${x0}" y="${top}" width="${w}" height="${f.wall}" fill="${RK}" opacity=".35"/>`;
    g += `<rect x="${f1(x0 - 8)}" y="${f1(top - 14)}" width="${f1(w + 16)}" height="16" fill="${RKL}" ${O(3)}/>`;
    let pd = ''; for (let x = x0 - 4; x < x1; x += 22) pd += `M${f1(x)} ${f1(top - 14)} v-10 h12 v10`; g += `<path d="${pd}" fill="${RKL}" stroke="${INK}" stroke-width="2.5"/>`;
    if (lv >= 3 && o.balcony !== false) { const by = top + f.wall * 0.42; g += `<rect x="${f1(x0 - 12)}" y="${f1(by)}" width="${f1(w + 24)}" height="10" fill="${BLUED}" ${O(3)}/>`; let r = ''; for (let x = x0 - 6; x < x1 + 10; x += 14) r += `M${f1(x)} ${f1(by)} v-26`; g += `<path d="${r}" stroke="${BLUE}" stroke-width="4"/><path d="M${f1(x0 - 12)} ${f1(by - 26)} h${f1(w + 24)}" stroke="${BLUED}" stroke-width="5"/>`; }
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [34, 40, 44, 48, 52][lv - 1];
    if (!o.noWin) { const wy = lv >= 3 ? top + 20 : top + Math.max(20, (f.wall - wh) * 0.34); for (const x of [x0 + 24, x1 - 24 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv); }
    if (o.door !== false) g += k.bigDoor(cx, B, lv, BLUED, 0.92);
    if (lv >= 4) g += `<rect x="${f1(x1 - 40)}" y="${f1(top - 70)}" width="30" height="58" fill="${RKL}" ${O(3)}/><path d="M${f1(x1 - 36)} ${f1(top - 60)} v20 M${f1(x1 - 26)} ${f1(top - 60)} v20 M${f1(x1 - 16)} ${f1(top - 60)} v20" stroke="${RKD}" stroke-width="4"/>`;
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), top + 26 + (lv >= 3 ? f.wall * 0.24 : 0), Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || BLUED);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 6, 6);
    return { g, top, cx, B };
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = `<path d="M${f1(x0)} ${B} V${f1(B - ph - 30)} H${f1(x1)} V${B} H${f1(cx + ow / 2)} V${f1(B - ph + ow / 2)} A${f1(ow / 2)} ${f1(ow / 2)} 0 0 0 ${f1(cx - ow / 2)} ${f1(B - ph + ow / 2)} V${B} Z" fill="${RK}" ${O(4)}/>`;
      g += `<path d="M${f1(x0)} ${f1(B - ph + 10)} H${f1(cx - ow / 2 - 10)} M${f1(cx + ow / 2 + 10)} ${f1(B - ph + 10)} H${f1(x1)} M${f1(x0)} ${f1(B - 40)} H${f1(cx - ow / 2 - 10)} M${f1(cx + ow / 2 + 10)} ${f1(B - 40)} H${f1(x1)}" stroke="${RKD}" stroke-width="4"/>`;
      if (lv >= 2) for (let i = 0; i < 2 + lv; i++) { const x = cx - ow / 2 + 10 + i * (ow - 20) / (1 + lv); g += `<path d="M${f1(x)} ${f1(B - ph + 4)} v${14 + (i % 2) * 10}" stroke="${INK}" stroke-width="1.5"/><rect x="${f1(x - 3)}" y="${f1(B - ph + 18 + (i % 2) * 10)}" width="6" height="16" rx="2" fill="${lv >= 5 ? k.GOLD : '#c8a050'}" ${O(1.5)}/>`; }
      if (lv >= 3) g += `<path d="M${f1(cx)} ${f1(B - ph - 30)} v-40" stroke="${INK}" stroke-width="6"/>` + mill(k, cx, B - ph - 76, 0.55 + lv * 0.04, 6, lv >= 5 ? k.GOLD : CLOTH);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 20, nm.length * 15 + 30), ny = B - ph - 26;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${BLUED}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, CLOTH);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = sandHouse(k, f, { sign: 'РАТУША', signBg: '#6a2a1a' });
      let g = h.g;
      const tx = f.x0 + 40, tt = h.top - 80 - lv * 10;
      g += `<rect x="${f1(tx - 22)}" y="${f1(tt)}" width="44" height="${f1(h.top - tt)}" fill="${RKL}" ${O(3)}/><path d="M${f1(tx - 16)} ${f1(tt + 10)} v30 M${f1(tx - 5)} ${f1(tt + 10)} v30 M${f1(tx + 6)} ${f1(tt + 10)} v30 M${f1(tx + 16)} ${f1(tt + 10)} v30" stroke="${RKD}" stroke-width="4"/>`;
      g += `<path d="M${f1(h.cx - 40)} ${f1(h.top - 14)} Q${f1(h.cx - 40)} ${f1(h.top - 80 - lv * 6)} ${f1(h.cx)} ${f1(h.top - 90 - lv * 6)} Q${f1(h.cx + 40)} ${f1(h.top - 80 - lv * 6)} ${f1(h.cx + 40)} ${f1(h.top - 14)} Z" fill="${lv >= 5 ? k.GOLD : BLUE}" ${O(3)}/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, INK } = k, lv = f.lv;
      const h = sandHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#7a2a1a' });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} l-3 -130" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${f1(sx)} ${h.B} l-3 -130" stroke="#c8a06a" stroke-width="3" stroke-linecap="round"/>`; }
      if (lv >= 2) g += `<ellipse cx="${f1(f.x0 - 40)}" cy="${h.B - 4}" rx="40" ry="10" fill="none" stroke="${RKD}" stroke-width="4"/><path d="M${f1(f.x0 - 40)} ${h.B - 4} V${h.B - 100} M${f1(f.x0 - 60)} ${h.B - 80} h40" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="${f1(f.x0 - 40)}" cy="${h.B - 108}" r="12" fill="${SANDD}" stroke="${INK}" stroke-width="3"/>`;
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<rect x="${f1(x0 + 6)}" y="${f1(top + 10)}" width="${f1(w - 12)}" height="${f1(f.wall - 50)}" rx="6" fill="${RKL}" ${O(4)}/><rect x="${f1(x0)}" y="${B - 40}" width="${f1(w)}" height="40" fill="${RK}" ${O(3)}/>`;
      const ry = top + 40; g += `<path d="M${f1(cx)} ${f1(ry - 22)} l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 l16 -6 Z" fill="${BLUE}" ${O(2)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = top + 74 + Math.floor(i / 3) * 46, nw = Math.min(48, (w - 56) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.8)}" fill="${CLOTH}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 12)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 22)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      if (lv >= 3) g += mill(k, cx, top - 20, 0.4, 4);
      k.signId('board'); g += k.signLv(cx, B - 20, Math.min(w - 10, 140), 'ДОСКА', lv, 20, BLUED);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<path d="M${f1(x0 - 10)} ${B} V${f1(top - 20)} Q${f1(cx)} ${f1(top - 60)} ${f1(x1 + 10)} ${f1(top - 20)} V${B} Z" fill="${RK}" ${O(4)}/>`;
      const aw = w * 0.66, ah = f.wall - 20;
      g += `<path d="M${f1(cx - aw / 2)} ${B} V${f1(B - ah + aw / 2)} A${f1(aw / 2)} ${f1(aw / 2)} 0 0 1 ${f1(cx + aw / 2)} ${f1(B - ah + aw / 2)} V${B} Z" fill="#5a2a18" ${O(3.5)}/>`;
      for (let i = 0; i < Math.min(lv + 2, 6); i++) g += `<path d="M${f1(cx - aw / 2 + 16 + (i % 3) * aw * 0.3)} ${f1(B - Math.floor(i / 3) * 34)} q-4 -30 14 -32 q18 2 14 32 Z" fill="${CLOTH}" ${O(2)}/>`;
      if (lv >= 3) g += `<path d="M${f1(x0 + 4)} ${f1(top + 30)} h24 M${f1(x1 - 28)} ${f1(top + 30)} h24" stroke="${RKD}" stroke-width="5"/>` + win(k, x0 + 10, top + 40, 22, 30, lv) + win(k, x1 - 32, top + 40, 22, 30, lv);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - 30)}" r="10" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx, B - ah - 20, Math.min(w - 10, 130), 'СКЛАД', lv, 19, BLUED);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), RKD);
      const h = sandHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, balcony: false });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h, n = 6;
        let s = `<path d="M${f1(m)} ${f1(t - 26)} V${f1(t)}" stroke="${INK}" stroke-width="5"/>`;
        for (let i = 0; i < n; i++) { const xa = a + (b - a) * i / n, xb = a + (b - a) * (i + 1) / n; s += `<path d="M${f1(xa)} ${B} L${f1(m + (xa - m) * 0.06)} ${f1(t)} L${f1(m + (xb - m) * 0.06)} ${f1(t)} L${f1(xb)} ${B} Z" fill="${i % 2 ? CLOTH : '#c8402a'}"/>`; }
        s += `<path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="none" ${O()}/>`;
        let fr = ''; for (let x = a + 8; x < b - 4; x += 12) fr += `M${f1(x)} ${f1(B - h * 0.3)} v10`; s += `<path d="M${f1(a + (b - a) * 0.15)} ${f1(B - h * 0.3)} H${f1(b - (b - a) * 0.15)}" stroke="${BLUED}" stroke-width="5"/>`;
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 30)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 30)} ${B} L${f1(cx)} ${f1(B - 92 - lv * 5)} L${f1(cx + 30)} ${B} Z" fill="#3a2a1a" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, BLUED);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = sandHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f4a2a', dx: x1 - 44, noWin: true, balcony: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      for (let i = 0, n = Math.max(3, Math.round((ax1 - ax0) / 30)); i < n; i++) { const xa = ax0 + (ax1 - ax0) * i / n, xb = ax0 + (ax1 - ax0) * (i + 1) / n; g += `<path d="M${f1(xa)} ${f1(ay)} H${f1(xb)} L${f1(xb + 3)} ${f1(ay + 24)} Q${f1((xa + xb) / 2 + 1)} ${f1(ay + 32)} ${f1(xa + 3)} ${f1(ay + 24)} Z" fill="${i % 2 ? CLOTH : BLUE}" ${O(2.5)}/>`; }
      g += [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 24)} V${h.B}" stroke="${WOOD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${WOOD}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(4, lv + 1); i++) g += `<path d="M${f1(ax0 + 22 + i * 30)} ${h.B - 30} q-12 -4 -10 -18 q2 -12 10 -12 q8 0 10 12 q2 14 -10 18 Z" fill="${['#c8683e', '#e0a43a', '#c8402a', '#8a5a32'][i]}" ${O(2)}/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<path d="M${f1(x0 + 12)} ${B} L${f1(x0 + w * 0.24)} ${f1(top + 20)} H${f1(x1 - w * 0.24)} L${f1(x1 - 12)} ${B} Z" fill="${RKL}" ${O()}/><path d="M${f1(x0 + w * 0.2)} ${f1(top + 20)} h${f1(w * 0.6)} l-10 -20 h${f1(-w * 0.6 + 20)} Z" fill="${BLUE}" ${O(3)}/>`;
      g += mill(k, cx, top - 10, 0.75 + lv * 0.06, 6, lv >= 5 ? k.GOLD : '#b8a2ff');
      g += win(k, cx - 13, top + 60, 26, 38, lv) + k.door(cx, B, 40 + lv * 3, 64 + lv * 4, '#2a1e4a');
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {}, far: false,

    back(k) {
      const { P, L, f1 } = k;
      let g = `<path d="M0 800 V340 Q300 320 600 346 Q1000 310 1400 336 Q1800 320 2200 344 Q2700 312 3200 338 Q3700 320 4400 344 V800 Z" fill="${RK}"/>`;
      for (const [y, c] of [[410, RKD], [480, RKL], [550, RKD], [620, RKL], [700, RKD]]) g += `<path d="M0 ${y} Q1100 ${y - 14} 2200 ${y + 6} Q3300 ${y + 18} 4400 ${y - 4}" stroke="${c}" stroke-width="6" fill="none" opacity=".6"/>`;
      g += `<path d="M0 340 Q300 320 600 346 Q1000 310 1400 336 Q1800 320 2200 344 Q2700 312 3200 338 Q3700 320 4400 344" stroke="${RKD}" stroke-width="5" fill="none"/>`;

      for (let i = 0; i < 17; i++) { const x = 130 + i * 260 + ((i * 53) % 60), y = i % 2 ? 470 : 560; g += `<path d="M${x - 26} ${y + 40} V${y} A26 26 0 0 1 ${x + 26} ${y} V${y + 40} Z" fill="#5a2a18" stroke="${RKD}" stroke-width="3"/><rect x="${x - 36}" y="${y + 40}" width="72" height="8" fill="${BLUED}" opacity=".9"/><path d="M${x - 30} ${y + 40} v-16 M${x + 30} ${y + 40} v-16 M${x - 32} ${y + 24} h64" stroke="${BLUE}" stroke-width="3"/><rect x="${x + 40}" y="${y - 6}" width="16" height="22" rx="8" fill="#ffd27a" stroke="${RKD}" stroke-width="2.5"/><path d="M${x - 50} ${y + 46} L${x - 56} ${y + 150} M${x - 38} ${y + 46} L${x - 44} ${y + 150}" stroke="${WOOD}" stroke-width="3.5"/>`; }
      P(0, L.W, g);
      for (const x of L.hx.mills || []) P(x - 80, x + 80, `<path d="M${x - 16} ${f1(340)} L${x - 10} 260 H${x + 10} L${x + 16} 340 Z" fill="${SANDD}" ${k.O(3)}/>` + mill(k, x, 256, 0.6, 4));
    },

    water(k) { const pts = k.L.hx.wash; let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]} ${pts[i][1]}`; k.P(1100, 4360, `<path d="${d}" stroke="${SANDD}" stroke-width="40" fill="none" stroke-linejoin="round" stroke-linecap="round" opacity=".7"/><path d="${d}" stroke="${CLOTH}" stroke-width="3" fill="none" stroke-dasharray="4 26" opacity=".8"/>`, 1370, 1450); },
    decor(k) {
      const { f1, O } = k;
      (k.L.hx.caves || []).forEach(([a, b], i) => {
        const m = (a + b) / 2, y = 792 - 20 - (i % 2) * 30;
        let g = `<path d="M${f1(m - 36)} 795 V${f1(y - 50)} A36 36 0 0 1 ${f1(m + 36)} ${f1(y - 50)} V795 Z" fill="#5a2a18" ${O(3)}/>` + k.door(m, 795, 40, 64, BLUED) + win(k, m - 70, 700 - (i % 3) * 30, 24, 32, 2) + win(k, m + 50, 690 - (i % 2) * 40, 24, 32, 2);
        g += `<rect x="${f1(m + 30)}" y="${f1(640 - (i % 2) * 40)}" width="70" height="10" fill="${BLUED}" ${O(2.5)}/><path d="M${f1(m + 90)} 795 L${f1(m + 80)} ${f1(650 - (i % 2) * 40)} M${f1(m + 110)} 795 L${f1(m + 100)} ${f1(650 - (i % 2) * 40)}" stroke="${WOOD}" stroke-width="4"/>`;
        k.P(a, b, g);
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 20), up: 100, lv: 2 };
      const g0 = sandHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 52, 795 - f.wall + 26, 26, 36, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, BLUED);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(250 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'windmill') {

        let g = k.ell(x, y + 4, 90, 18) + `<path d="M${x - 60} ${y} L${x - 36} ${y - 280} H${x + 36} L${x + 60} ${y} Z" fill="${SAND}" ${O(4.5)}/>`;
        let d = ''; for (let i = 1; i < 6; i++) { const yy = y - i * 46, hw = 60 - i * 24 / 6 * 1.0 - i * 0; d += `M${f1(x - hw + i * 4)} ${yy} H${f1(x + hw - i * 4)}`; } g += `<path d="${d}" stroke="${SANDD}" stroke-width="3"/>`;
        g += `<path d="M${x - 46} ${y - 280} Q${x} ${y - 340} ${x + 46} ${y - 280} Z" fill="${RKD}" ${O(3.5)}/><rect x="${x - 56}" y="${y - 150}" width="112" height="10" fill="${WOOD}" ${O(3)}/><path d="M${x - 50} ${y - 150} v-20 M${x - 30} ${y - 150} v-20 M${x + 30} ${y - 150} v-20 M${x + 50} ${y - 150} v-20 M${x - 56} ${y - 170} h112" stroke="${WOOD}" stroke-width="4"/>`;
        g += mill(k, x, y - 300, 1.7, 6);
        g += k.door(x, y, 40, 66, BLUED) + win(k, x - 12, y - 240, 24, 32, 3);
        for (const dx of [-80, -56, 70]) g += `<path d="M${x + dx - 12} ${y} q-4 -28 12 -30 q16 2 12 30 Z" fill="${CLOTH}" ${O(2)}/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 280 * s, h: 440 * s };
      }
      if (p.k === 'pots') return { g: k.ell(x, y, 30, 7) + `<path d="M${x - 24} ${y} q-8 -20 2 -34 h12 q10 14 2 34 Z" fill="${RK}" ${O(2.5)}/><path d="M${x + 2} ${y} q-6 -16 2 -26 h10 q8 10 2 26 Z" fill="${SANDD}" ${O(2.5)}/><path d="M${x + 18} ${y} q-4 -12 2 -18 h8 q6 6 0 18 Z" fill="${BLUE}" ${O(2)}/>`, w: 70, h: 50, flat: true };
      if (p.k === 'chime') return { g: k.ell(x, y, 14, 4) + `<path d="M${x} ${y} V${y - 130} h30" stroke="${INK}" stroke-width="6" fill="none"/><path d="M${x} ${y} V${y - 130}" stroke="${WOOD}" stroke-width="3"/>` + [0, 1, 2].map((i) => `<path d="M${x + 10 + i * 9} ${y - 130} v${14 + i * 8}" stroke="${INK}" stroke-width="1.5"/><rect x="${x + 7 + i * 9}" y="${y - 116 + i * 8}" width="6" height="18" rx="2" fill="#c8a050" ${O(1.5)}/>`).join(''), w: 70, h: 150 };
      if (p.k === 'cactus2') return { g: k.ell(x, y, 18, 5) + `<path d="M${f1(x - 10 * s)} ${y} V${f1(y - 100 * s)} a10 10 0 0 1 20 0 V${y} Z M${f1(x - 10 * s)} ${f1(y - 50 * s)} h-14 v-30 a7 7 0 0 1 14 0 Z M${f1(x + 10 * s)} ${f1(y - 64 * s)} h14 v-24 a7 7 0 0 0 -14 0 Z" fill="#5a9a4a" ${O(3)}/><circle cx="${x}" cy="${f1(y - 112 * s)}" r="5" fill="#e8455c"/>`, w: 70 * s, h: 120 * s };
      return null;
    },
  };

  return {
    id: 'd112', ver: 1, name: 'Сухополье', layout, art,
    story: 'Деревня на дне Каньона Ветров: дома вырублены прямо в красной стене каньона - арочные двери, синие балконы, лесенки к пещерам, а по кромке обрыва крутятся ветряки. По сухому руслу тропа петляет к площади с Большой мельницей, что мелет зерно всей округе.',
  };
});
