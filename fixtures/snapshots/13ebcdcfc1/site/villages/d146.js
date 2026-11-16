


(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const LOG = '#6a4a34', LOGD = '#3e2a1e', SOD = '#5f8a3a', SODD = '#3f6a2a', BONE = '#efe4cc', HIDE = '#a8784a', RUST = '#a8442e';
  const KINDS = { boarstone: { foot: [74, 24], tall: 230 }, hides: { foot: [50, 10], tall: 120 }, pen: { foot: [190, 34], tall: 90 }, boar: { foot: [40, 12], tall: 70 }, heath: { foot: [36, 12], tall: 60 }, pine2: { foot: [24, 10], tall: 270, tree: true }, stake: { foot: [26, 10], tall: 140 }, fire2: { foot: [40, 12], tall: 90 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 2400, x1: 2620 },
        trainer: { x0: 2700, x1: 2980 },
        magic: { x0: 3080, x1: 3310 },
        storage: { x0: 3380, x1: 3660 },
        mine: { x0: 4040, x1: 4340 },
        hall: { x0: 1000, x1: 1300, B: 1230 },
        shop: { x0: 1360, x1: 1640, B: 1230 },
        tent: { x0: 1700, x1: 2050, B: 1230 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 910], [1500, 906], [2300, 912], [3000, 906], [3700, 910], [4360, 906]] },
        { k: 'lane', w: 36, pts: [[40, 1300], [600, 1296], [1200, 1302], [1800, 1298], [2240, 1290], [2340, 1200], [2380, 1060], [2360, 930]] },
        { k: 'cross', w: 30, pts: [[940, 910], [936, 1100], [940, 1300]] },
        { k: 'trail', w: 30, pts: [[3720, 910], [3740, 1060], [3860, 1200], [4060, 1300], [4360, 1320]] },
      ],
      plazas: [{ k: 'central', x: 600, y: 1150, rx: 270, ry: 100, mark: 'boarstone', ms: 1 }],
      kinds: KINDS,
      props: [['pen', 3200, 1250], ['boar', 3120, 1236], ['boar', 3280, 1248], ['hides', 2680, 1120], ['hides', 2860, 1140], ['fire2', 3560, 1400], ['stake', 3420, 1408], ['hides', 3700, 1420], ['stake', 820, 1060]],
      houses: [{ x0: 2480, x1: 2700, base: 1450 }, { x0: 2800, x1: 3020, base: 1446 }, { x0: 3850, x1: 4070, base: 1450 }, { x0: 120, x1: 320, base: 1452 }],
      fill: [{ k: ['pine2', 'heath', 'heath', 'bush', 'stake'], n: 30, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'heath'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[980, 1200], [1260, 1480], [1540, 1760], [1820, 2040], [2080, 2340], [3700, 3990]] },
    };
  }

   

  function sodRoof(k, x0, x1, top, h, lv) {
    const { f1, O, INK } = k, cx = (x0 + x1) / 2, e = 26;
    if (lv >= 4) return k.roof(x0, x1, top, h, 'shingle', '#8a5a32', false, '#5a3a22') + antlers(k, cx, top - h, lv);
    const d = `M${x0 - e} ${top + 6} Q${f1(x0 - 8)} ${f1(top - 4)} ${f1(cx - 10)} ${f1(top - h)} Q${f1(cx)} ${f1(top - h - 10)} ${f1(cx + 10)} ${f1(top - h)} Q${f1(x1 + 8)} ${f1(top - 4)} ${x1 + e} ${top + 6} Z`;
    let g = `<path d="M${x0} ${top} H${x1} V${top + 18} H${x0} Z" fill="url(#tgShade)"/><path d="M${x0 - e + 4} ${top + 12} L${f1(cx)} ${f1(top - h + 8)} L${x1 + e - 4} ${top + 12}" fill="none" stroke="${LOGD}" stroke-width="10"/>`;
    g += `<path d="${d}" fill="${lv <= 1 ? '#7a8a4a' : SOD}" ${O()}/><path d="M${x0 - e + 10} ${top + 2} Q${f1(cx)} ${f1(top - h + 16)} ${x1 + e - 10} ${top + 2}" stroke="${SODD}" stroke-width="6" fill="none" opacity=".6"/>`;
    let gr = ''; for (let x = x0 - e + 6; x < x1 + e - 6; x += 12) { const t = (x - (x0 - e)) / (x1 - x0 + 2 * e), y = top + 4 - (1 - Math.abs(t - 0.5) * 2) * (h + 4); gr += `M${f1(x)} ${f1(y)} l-3 -9 M${f1(x + 4)} ${f1(y)} l3 -10`; }
    g += `<path d="${gr}" stroke="#7ab04a" stroke-width="2.5" stroke-linecap="round"/>`;
    if (lv >= 2) for (let i = 0; i < 4; i++) { const t = 0.2 + i * 0.2, x = x0 + (x1 - x0) * t, y = top - (1 - Math.abs(t - 0.5) * 2) * h - 2; g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="4" fill="${['#ffd76a', '#e8455c', '#b9a2ff', '#ffffff'][i]}" ${O(1.5)}/>`; }
    return g + antlers(k, cx, top - h - 6, lv);
  }

  function antlers(k, x, y, lv) {
    const { f1, INK } = k, c = lv >= 5 ? k.GOLD : BONE;
    const one = (s) => `M${f1(x + s * 6)} ${f1(y)} q${f1(s * 20)} -10 ${f1(s * 30)} -36 M${f1(x + s * 18)} ${f1(y - 8)} l${f1(s * 6)} -20 M${f1(x + s * 28)} ${f1(y - 22)} l${f1(s * 14)} -8`;
    let g = `<path d="${one(-1)} ${one(1)}" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${one(-1)} ${one(1)}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (lv >= 3) g += skull(k, x, y + 8, 0.7, c);
    return g;
  }

  function skull(k, x, y, s, c = BONE) {
    const { f1, O, INK } = k;
    return `<path d="M${f1(x - 18 * s)} ${f1(y - 10 * s)} Q${f1(x)} ${f1(y - 26 * s)} ${f1(x + 18 * s)} ${f1(y - 10 * s)} L${f1(x + 10 * s)} ${f1(y + 18 * s)} Q${f1(x)} ${f1(y + 26 * s)} ${f1(x - 10 * s)} ${f1(y + 18 * s)} Z" fill="${c}" ${O(2.5)}/><circle cx="${f1(x - 7 * s)}" cy="${f1(y - 4 * s)}" r="${f1(4 * s)}" fill="${INK}"/><circle cx="${f1(x + 7 * s)}" cy="${f1(y - 4 * s)}" r="${f1(4 * s)}" fill="${INK}"/><path d="M${f1(x - 9 * s)} ${f1(y + 14 * s)} q-8 -2 -12 -14 M${f1(x + 9 * s)} ${f1(y + 14 * s)} q8 -2 12 -14" stroke="${c}" stroke-width="${f1(4 * s)}" fill="none" stroke-linecap="round"/>`;
  }

  function hideFrame(k, x, y, s = 1) {
    const { f1, O, INK } = k;
    return `<path d="M${f1(x - 40 * s)} ${y} V${f1(y - 110 * s)} M${f1(x + 40 * s)} ${y} V${f1(y - 110 * s)} M${f1(x - 46 * s)} ${f1(y - 104 * s)} H${f1(x + 46 * s)} M${f1(x - 46 * s)} ${f1(y - 30 * s)} H${f1(x + 46 * s)}" stroke="${INK}" stroke-width="${f1(8 * s)}" stroke-linecap="round"/><path d="M${f1(x - 40 * s)} ${y} V${f1(y - 110 * s)} M${f1(x + 40 * s)} ${y} V${f1(y - 110 * s)}" stroke="#8a6a44" stroke-width="${f1(4 * s)}"/>`
      + `<path d="M${f1(x - 30 * s)} ${f1(y - 96 * s)} Q${f1(x)} ${f1(y - 104 * s)} ${f1(x + 30 * s)} ${f1(y - 96 * s)} L${f1(x + 24 * s)} ${f1(y - 40 * s)} Q${f1(x)} ${f1(y - 32 * s)} ${f1(x - 24 * s)} ${f1(y - 40 * s)} Z" fill="${HIDE}" ${O(3)}/><path d="M${f1(x - 10 * s)} ${f1(y - 80 * s)} q10 8 20 0 M${f1(x - 12 * s)} ${f1(y - 62 * s)} q12 8 24 0" stroke="#7a4e2a" stroke-width="2.5" fill="none"/>`;
  }
  function win(k, x, y, w, h, lv, lit = true) {
    const { f1, O } = k;
    let g = k.winLit(x, y, w, h, lit) + `<rect x="${f1(x - 10)}" y="${f1(y - 4)}" width="9" height="${f1(h + 8)}" fill="${LOGD}" ${O(2.5)}/><rect x="${f1(x + w + 1)}" y="${f1(y - 4)}" width="9" height="${f1(h + 8)}" fill="${LOGD}" ${O(2.5)}/>`;
    if (lv >= 3) g += `<path d="M${f1(x - 8)} ${f1(y - 6)} h${f1(w + 16)}" stroke="${RUST}" stroke-width="5"/>`;
    return g;
  }

  function lodge(k, f, o = {}) {
    const { f1 } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([60, 74, 86, 98, 108][lv - 1], f.up - 14, w * 0.42));
    let g = '';
    if (lv >= 3) g += k.wall(x0, B - 30, w, B, 'rubble');
    g += k.wall(x0, top, w, lv >= 3 ? B - 30 : B, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), LOG);
    g += sodRoof(k, x0, x1, top, rh, lv);
    const ww = [28, 32, 34, 36, 38][lv - 1], wh = [30, 38, 42, 46, 50][lv - 1], wy = top + Math.max(18, (f.wall - wh) * 0.32);
    if (!o.noWin) for (const x of [x0 + 20, x1 - 20 - ww]) if (Math.abs(x + ww / 2 - cx) > 56 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, LOGD, 0.95);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 30, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || LOGD);
    if (lv >= 2) g += skull(k, cx, top + 10, 0.55);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 62, 6);
    return { g, top, rh, cx, B };
  }

  const pine = (k, x, base, s) => k.use(k.sym('d146pine', () => {
    const { O } = k; let g = `<path d="M-8 2 Q-14 -60 -2 -110 Q4 -150 0 -190 H6 Q10 -150 6 -110 Q-4 -60 8 2 Z" fill="#b5653c" ${O(3)}/>`;
    for (const [dx, dy, rx, c] of [[-26, -150, 40, '#2f5a3a'], [24, -176, 36, '#3a6a44'], [-4, -208, 30, '#447a4e'], [18, -128, 28, '#2f5a3a']]) g += `<ellipse cx="${dx}" cy="${dy}" rx="${rx}" ry="${rx * 0.45}" fill="${c}" ${O(3)}/>`;
    return g;
  }), x, base, s);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [96, 104, 112, 112, 120][lv - 1], ph = f.wall - (lv <= 1 ? 30 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 28], [cx + ow / 2 + 28, x1]]) if (b - a > 12) for (let x = a; x < b; x += 22) { const t = B - ph + 30 + ((x * 13) % 20); g += `<path d="M${x} ${B} V${t} l11 -18 l11 18 V${B} Z" fill="${LOG}" ${O(3)}/>`; }
      if (lv >= 3) { const sx = x0 + 30, t = B - f.wall * 1.0; g += `<path d="M${f1(sx - 24)} ${B} V${f1(t)} M${f1(sx + 24)} ${B} V${f1(t)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(sx - 24)} ${B} V${f1(t)} M${f1(sx + 24)} ${B} V${f1(t)}" stroke="${LOG}" stroke-width="6"/><rect x="${f1(sx - 30)}" y="${f1(t - 26)}" width="60" height="28" fill="${LOG}" ${O(3)}/>` + sodRoof(k, sx - 30, sx + 30, t - 26, 34, Math.min(lv, 3)); }
      for (const px of [cx - ow / 2 - 14, cx + ow / 2 + 14]) g += `<rect x="${f1(px - 14)}" y="${f1(B - ph)}" width="28" height="${f1(ph)}" fill="${LOGD}" ${O(4)}/>` + skull(k, px, B - ph - 4, 0.8, lv >= 5 ? k.GOLD : BONE);
      if (lv >= 2) for (const s of [-1, 1]) { const a = cx + (s < 0 ? -ow / 2 : 2), w2 = ow / 2 - 2; g += `<rect x="${f1(a)}" y="${f1(B - ph + 44)}" width="${f1(w2)}" height="${f1(ph - 44)}" fill="${LOG}" ${O(3)}/><path d="M${f1(a + 4)} ${f1(B - ph + 70)} h${f1(w2 - 8)} M${f1(a + 4)} ${B - 26} h${f1(w2 - 8)}" stroke="#3a3640" stroke-width="5"/>`; }
      const nm = L.name.toUpperCase(), by = B - ph + 4, bw = Math.max(ow + 40, nm.length * 15 + 30);
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(by)}" width="${f1(bw)}" height="30" rx="4" fill="${HIDE}" ${O(3.5)}/>` + k.txt(cx, by + 22, nm, 17, '#f3efd8');
      k.signAt([cx - bw / 2 - 4, by - 4, cx + bw / 2 + 4, by + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = lodge(k, f, { sign: 'РАТУША', signBg: '#7a1a2a' });
      let g = h.g + `<g transform="translate(${f1(h.cx)} ${f1(h.top - h.rh * 0.4)})"><path d="M-30 -10 Q0 -40 30 -10 L22 22 Q0 34 -22 22 Z" fill="${LOG}" ${O(3)}/><ellipse cx="0" cy="18" rx="12" ry="8" fill="#8a5a3a" ${O(2)}/><circle cx="-12" cy="-6" r="4" fill="#ff8a2a"/><circle cx="12" cy="-6" r="4" fill="#ff8a2a"/><path d="M-10 22 q-10 -2 -14 -16 M10 22 q10 -2 14 -16" stroke="${lv >= 5 ? k.GOLD : BONE}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
      if (lv >= 3) for (const s of [-1, 1]) g += `<path d="M${f1(h.cx + s * 70)} ${h.B} V${f1(h.B - 90)}" stroke="${INK}" stroke-width="11"/><path d="M${f1(h.cx + s * 70)} ${h.B} V${f1(h.B - 90)}" stroke="${LOG}" stroke-width="6"/>`;
      if (lv >= 3) g += sodRoof(k, h.cx - 76, h.cx + 76, h.B - 90, 30, 2);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = lodge(k, f, { sign: 'ТРЕНЕР', signBg: '#8a2a1a' });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 12 + i * 12; g += `<path d="M${f1(sx)} ${h.B} V${f1(h.B - 120)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${h.B} V${f1(h.B - 120)}" stroke="#a87a4a" stroke-width="3"/><path d="M${f1(sx - 5)} ${f1(h.B - 120)} l5 -16 l5 16 Z" fill="${lv >= 5 ? k.GOLD : '#9a9eac'}" ${O(1.5)}/>`; }
      if (lv >= 2) { const bx = f.x0 - 36, by = h.B; g += `<path d="M${f1(bx - 30)} ${by} V${by - 26} M${f1(bx + 30)} ${by} V${by - 26}" stroke="${INK}" stroke-width="5"/><path d="M${f1(bx - 36)} ${by - 30} q36 -40 72 0 l-6 12 h-60 Z" fill="#e0b456" ${O(3)}/><circle cx="${f1(bx + 26)}" cy="${by - 34}" r="4" fill="${INK}"/><path d="M${f1(bx + 34)} ${by - 30} l10 6" stroke="${BONE}" stroke-width="4"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 9)}" y="${f1(top)}" width="18" height="${f1(B - top)}" fill="${LOGD}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="5" fill="${LOG}" ${O(4)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(56, (w - 50) / 3); g += `<g transform="rotate(${(i * 11) % 9 - 4} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${i % 2 ? '#e8d8b0' : '#f3efd8'}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/></g>`; }
      g += sodRoof(k, x0 - 4, x1 + 4, top, Math.min(f.up - 40, 34 + lv * 8), lv);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, LOGD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, hh = f.wall + f.up * 0.4;
      let g = `<path d="M${f1(x0 - 20)} ${B} Q${f1(x0 + w * 0.1)} ${f1(B - hh)} ${f1(cx)} ${f1(B - hh)} Q${f1(x1 - w * 0.1)} ${f1(B - hh)} ${f1(x1 + 20)} ${B} Z" fill="${SOD}" ${O()}/>`;
      let gr = ''; for (let i = 0; i < 18; i++) { const t = i / 17, x = x0 - 10 + (w + 20) * t, y = B - hh * (1 - (t - 0.5) ** 2 * 3.2) + 4; gr += `M${f1(x)} ${f1(y)} l-3 -9 M${f1(x + 4)} ${f1(y)} l3 -9`; }
      g += `<path d="${gr}" stroke="#7ab04a" stroke-width="2.5"/>`;
      const dw = Math.min(w * 0.5, 80 + lv * 10), dh = Math.min(hh - 40, 90 + lv * 8);
      g += k.wall(cx - dw / 2 - 16, B - dh, dw + 32, B, 'rubble') + `<path d="M${f1(cx - dw / 2 - 20)} ${f1(B - dh)} h${f1(dw + 40)}" stroke="${INK}" stroke-width="0"/>` + k.door(cx, B, dw * 0.7, dh - 16, LOGD);
      if (lv >= 3) g += `<rect x="${f1(x1 - w * 0.3)}" y="${f1(B - hh - 30)}" width="18" height="40" fill="${LOG}" ${O(3)}/><path d="M${f1(x1 - w * 0.3 - 6)} ${f1(B - hh - 30)} h30 l-6 -10 h-18 Z" fill="${LOGD}" ${O(2.5)}/>`;
      g += skull(k, cx, B - dh - 18, 0.7, lv >= 5 ? k.GOLD : BONE);
      k.signId('storage'); g += k.signLv(cx, B - dh - 52, Math.min(w - 20, 130), 'СКЛАД', lv, 19, '#6a4a1e');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#7a7484');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = lodge(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 - 24 - i * 16; g += `<path d="M${f1(sx)} ${h.B} V${f1(h.B - 110)}" stroke="#7a4e2a" stroke-width="4"/><path d="M${f1(sx - 5)} ${f1(h.B - 110)} l5 -18 l5 18 Z" fill="${lv >= 5 && i === 0 ? k.GOLD : '#9a9eac'}" ${O(1.5)}/><path d="M${f1(sx - 8)} ${f1(h.B - 104)} h16" stroke="#3a3640" stroke-width="3"/>`; }
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const chum = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m - 10)} ${f1(t - 24)} L${f1(m + 30)} ${f1(t + 30)} M${f1(m + 10)} ${f1(t - 24)} L${f1(m - 30)} ${f1(t + 30)} M${f1(m)} ${f1(t - 30)} V${f1(t + 20)}" stroke="${INK}" stroke-width="6"/>`;
        s += `<path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="${HIDE}" ${O()}/>`;
        let st = ''; for (let i = 1; i < 4; i++) { const y = t + (B - t) * i / 4, hw = (b - a) / 2 * i / 4; st += `M${f1(m - hw)} ${f1(y)} H${f1(m + hw)}`; }
        s += `<path d="${st}" stroke="#7a4e2a" stroke-width="3" stroke-dasharray="6 4"/><path d="M${f1(m - (b - a) * 0.12)} ${f1(t + (B - t) * 0.25)} L${f1(m)} ${f1(t)} L${f1(m + (b - a) * 0.12)} ${f1(t + (B - t) * 0.25)}" fill="#8a5a32"/>`;
        if (gold) s += `<path d="M${f1(m - 10)} ${f1(t - 24)} l-6 10 M${f1(m + 10)} ${f1(t - 24)} l6 10" stroke="${k.GOLD}" stroke-width="5"/>`;
        return s + `<circle cx="${f1(m + 8)}" cy="${f1(t - 40)}" r="10" fill="#a8a4b0" opacity=".45"/>`;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += chum(x0, x0 + sw, f.wall * 0.7, lv >= 5) + chum(x1 - sw, x1, f.wall * 0.7, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.18 : x0, b = lv >= 4 ? x1 - w * 0.18 : x1;
      g += chum(a, b, Math.min(f.wall + f.up - 40, f.wall + 60 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 26)} ${B} L${f1(cx)} ${f1(B - 86 - lv * 6)} L${f1(cx + 26)} ${B} Z" fill="#2a1a10" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 66, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#6a3a1e');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0;
      const h = lodge(k, f, { sign: 'ЛАВКА', signBg: '#2f5a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 82, ay = h.B - Math.min(100, f.wall * 0.66);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 26)} H${f1(ax0 - 10)} Z" fill="${SOD}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 22)} V${h.B}" stroke="${LOGD}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(2 + lv, Math.floor((ax1 - ax0) / 34))); i < n; i++) { const px = ax0 + 18 + i * 34; g += `<path d="M${f1(px)} ${f1(ay + 26)} v14" stroke="${INK}" stroke-width="2"/><path d="M${f1(px - 9)} ${f1(ay + 40)} q9 -6 18 0 l-3 30 q-6 6 -12 0 Z" fill="#a84a2a" ${O(2)}/>`; }
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${LOG}" ${O(3)}/>` + hideFrame(k, x0 - 40, h.B, 0.7);
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const up = Math.min(90, 40 + lv * 10), hb = B - up, top = B - f.wall;
      let g = `<path d="M${f1(cx - 34)} ${B} Q${f1(cx - 24)} ${f1(hb + 20)} ${f1(cx - 20)} ${f1(hb)} H${f1(cx + 20)} Q${f1(cx + 24)} ${f1(hb + 20)} ${f1(cx + 34)} ${B} Z" fill="${LOG}" ${O(4)}/><path d="M${f1(cx - 34)} ${B} l-18 6 M${f1(cx + 34)} ${B} l18 6" stroke="${LOG}" stroke-width="8" stroke-linecap="round"/>`;
      g += k.wall(x0 + 6, top, w - 12, hb, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), LOG);
      const rh = Math.min(f.up - 30, 70 + lv * 10);
      g += `<path d="M${f1(x0 - 12)} ${f1(top + 6)} L${f1(cx - 30)} ${f1(top - rh)} L${f1(cx - 14)} ${f1(top - rh + 20)} L${f1(cx)} ${f1(top - rh + 6)} L${f1(cx + 14)} ${f1(top - rh + 20)} L${f1(cx + 30)} ${f1(top - rh)} L${f1(x1 + 12)} ${f1(top + 6)} Z" fill="#3a2a6a" ${O()}/>`;
      const ey = top + 34, er = 13 + lv;
      for (const s of [-1, 1]) g += `<circle cx="${f1(cx + s * 26)}" cy="${f1(ey)}" r="${er}" fill="${lv >= 3 ? '#ffd76a' : '#3a3a55'}" ${O(3)}/><circle cx="${f1(cx + s * 26)}" cy="${f1(ey)}" r="${f1(er * 0.4)}" fill="${INK}"/>`;
      g += `<path d="M${f1(cx - 8)} ${f1(ey + 14)} l8 12 l8 -12 Z" fill="${lv >= 5 ? k.GOLD : '#e0a040'}" ${O(2)}/>` + k.door(cx, hb, 34 + lv * 2, Math.min(hb - top - 70, 56 + lv * 3), '#3a2a5a');
      g += `<path d="M${f1(cx + 40)} ${B} L${f1(cx + 16)} ${f1(hb)} M${f1(cx + 60)} ${B} L${f1(cx + 36)} ${f1(hb)}" stroke="#a87a4a" stroke-width="5"/>`;
      k.signId('magic'); g += k.signLv(cx, hb - 30, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  const art = {
    K: { leaf: ['#5f8a3a', '#6a9a42', '#4a7a32'], grass: '#9aac64', grass2: '#82965a', dirt: '#b8986a', dirtD: '#94784e', far: ['#6a8a5a', '#7e9a64'] },

    back(k) {
      const { P, L } = k;
      let g = `<path d="M0 670 Q600 560 1400 610 Q2200 520 3000 600 Q3700 540 4400 640 V680 H0 Z" fill="#8a8a5a"/>`;
      for (let x = 30; x < L.W; x += 46) g += `<path d="M${x} 640 l14 -30 l14 30 Z" fill="#3a5a3a" opacity=".55"/>`;
      P(0, L.W, g);
      for (const [x, y, s] of [[1100, 640, 0.7], [1700, 620, 0.8], [2250, 640, 0.65], [3500, 630, 0.75], [3900, 650, 0.6]]) P(x - 60, x + 60, pine(k, x, y, s));
    },
    decor(k) { (k.L.hx.backHouses || []).forEach(([a, b], i) => k.P(a, b, backLodge(k, a, b, i))); },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + skull(k, lot.x0 + 10, 650, 0.6);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = lodge(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 22 : x1 - 56, 795 - f.wall + 24, 30, 36, 2) + k.door(c.v % 2 ? x1 - 40 : x0 + 40, 795, 38, 60, LOGD) + (c.v % 2 ? hideFrame(k, x1 + 40, 798, 0.6) : '');
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(280 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'boarstone') return { g: k.ell(x, y + 4, 90, 18) + `<path d="M${x - 90} ${y} l10 -26 h160 l10 26 Z" fill="#8a8696" ${O(4)}/><path d="M${x - 76} ${y - 26} Q${x - 80} ${y - 120} ${x - 20} ${y - 150} Q${x + 40} ${y - 170} ${x + 76} ${y - 120} L${x + 90} ${y - 100} L${x + 70} ${y - 90} Q${x + 74} ${y - 50} ${x + 60} ${y - 26} Z" fill="#9a96a2" ${O(4.5)}/><path d="M${x + 70} ${y - 112} q24 -6 22 -30" stroke="${BONE}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${x + 40}" cy="${y - 124}" r="7" fill="#c8402a"/><path d="M${x - 40} ${y - 140} l-10 -30 l20 18 M${x - 10} ${y - 152} l0 -30 l14 24" stroke="${INK}" stroke-width="5" fill="none"/><path d="M${x - 60} ${y - 70} q30 10 60 0 M${x - 50} ${y - 50} q30 10 60 0" stroke="#7a7684" stroke-width="3" fill="none"/>`, w: 220, h: 240 };
      if (p.k === 'hides') return { g: k.ell(x, y, 50, 9) + hideFrame(k, x, y, 1), w: 130, h: 130 };
      if (p.k === 'pen') { let g = ''; for (let i = 0; i <= 8; i++) { const px = x - 190 + i * 47.5; g += `<rect x="${f1(px - 6)}" y="${y - 70}" width="12" height="72" rx="3" fill="${LOG}" ${O(3)}/>`; } g += `<path d="M${x - 194} ${y - 52} H${x + 194} M${x - 194} ${y - 24} H${x + 194}" stroke="${INK}" stroke-width="10"/><path d="M${x - 194} ${y - 52} H${x + 194} M${x - 194} ${y - 24} H${x + 194}" stroke="#a87a4a" stroke-width="6"/>`; return { g, w: 420, h: 100 }; }
      if (p.k === 'boar') return { g: k.ell(x, y, 40, 8) + `<path d="M${x - 36} ${y - 14} Q${x - 30} ${y - 54} ${x + 10} ${y - 50} Q${x + 34} ${y - 46} ${x + 40} ${y - 26} L${x + 48} ${y - 22} L${x + 38} ${y - 14} Z" fill="#5a3e2e" ${O(3)}/><path d="M${x - 28} ${y - 16} V${y} M${x - 12} ${y - 14} V${y} M${x + 14} ${y - 14} V${y} M${x + 28} ${y - 16} V${y}" stroke="${INK}" stroke-width="6"/><path d="M${x + 40} ${y - 24} q8 -6 4 -14" stroke="${BONE}" stroke-width="3" fill="none"/><circle cx="${x + 26}" cy="${y - 36}" r="2.5" fill="${INK}"/><path d="M${x - 20} ${y - 48} l4 -8 l4 8 M${x - 8} ${y - 50} l4 -8 l4 8" stroke="${INK}" stroke-width="3" fill="none"/>`, w: 110, h: 80 };
      if (p.k === 'heath') { let g = ''; for (let i = 0; i < 5; i++) g += `<path d="M${x - 30 + i * 15} ${y} q-4 -20 ${2 + (i % 2) * 4} -${30 + (i % 3) * 8}" stroke="#6a5a3a" stroke-width="3" fill="none"/><circle cx="${x - 28 + i * 15 + (i % 2) * 4}" cy="${y - 32 - (i % 3) * 8}" r="6" fill="${['#b06aa8', '#c87ab8', '#9a5a9a'][i % 3]}"/>`; return { g, w: 100, h: 70, flat: true }; }
      if (p.k === 'pine2') return { g: k.ell(x, y, 30 * s, 9) + pine(k, x, y, s), w: 180 * s, h: 270 * s };
      if (p.k === 'stake') return { g: k.ell(x, y, 22, 6) + `<path d="M${x} ${y} V${y - 110}" stroke="${INK}" stroke-width="10"/><path d="M${x} ${y} V${y - 110}" stroke="${LOG}" stroke-width="6"/>` + skull(k, x, y - 118, 0.7), w: 70, h: 150 };
      if (p.k === 'fire2') return { g: `<ellipse cx="${x}" cy="${y}" rx="40" ry="12" fill="#5a4a40"/><circle cx="${x}" cy="${y - 30}" r="40" fill="url(#tgGlow)" opacity=".6"/><path d="M${x - 26} ${y - 4} l52 -10 M${x - 24} ${y - 12} l48 10" stroke="#7a4e2a" stroke-width="7" stroke-linecap="round"/><path d="M${x - 16} ${y - 10} q16 -50 32 0 q-6 -24 -16 -8 q-10 -18 -16 8" fill="#ff8a2a" stroke="#c8402a" stroke-width="2"/><path d="M${x - 50} ${y - 60} H${x + 50} M${x - 44} ${y} V${y - 64} M${x + 44} ${y} V${y - 64}" stroke="${INK}" stroke-width="5"/><path d="M${x - 20} ${y - 60} v20 l8 0 v-20 M${x + 10} ${y - 60} v24" stroke="#a84a2a" stroke-width="6"/>`, w: 130, h: 100 };
      return null;
    },
  };

  function backLodge(k, a, b, i) {
    if (b - a < 170) return pine(k, (a + b) / 2, 792, 0.85);
    const x1 = Math.min(b - 10, a + 170 + (i * 23) % 50), f = { x0: a + 10, x1, B: 792, wall: 88 + (i * 11) % 24, up: 100, lv: 2 };
    let g = lodge(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 30 : x1 - 56, 792 - f.wall + 22, 28, 34, 2) + k.door(i % 2 ? x1 - 40 : a + 50, 792, 38, 58, LOGD);
    if (b - x1 > 80) g += i % 2 ? hideFrame(k, (x1 + b) / 2, 794, 0.7) : pine(k, (x1 + b) / 2, 794, 0.75);
    return g;
  }

  return {
    id: 'd146', ver: 1, name: 'Луговка', layout, art,
    story: 'Охотничья деревня на Пустоши Вепря: тёмные срубы под дерновыми крышами, на коньках - рога и черепа вепрей, у домов сушатся шкуры. У ворот на площади стоит каменный Вепрь-идол, а за деревней, на пустоши, - загон и стан охотников у костра.',
  };
});
