



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const TILE = '#a8442e', TILED = '#6e2a1e', BEAM = '#5a3a26', PLAST = '#efe4cc', WHEAT = '#e8c25a', SOIL = '#7a5a3a';
  const KINDS = { spring: { foot: [70, 24], tall: 220 }, beds: { foot: [90, 16], tall: 40 }, scarecrow: { foot: [16, 8], tall: 170 }, plough: { foot: [60, 14], tall: 90 }, sheaf: { foot: [22, 8], tall: 80 }, oak2: { foot: [30, 12], tall: 260, tree: true }, cart2: { foot: [56, 14], tall: 110 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 2000, x1: 2300 },
        magic: { x0: 2380, x1: 2610 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1260, x1: 1520, B: 1220 },
        tent: { x0: 1580, x1: 1930, B: 1220 },
        storage: { x0: 2680, x1: 2960, B: 1220 },
        trainer: { x0: 3020, x1: 3300, B: 1220 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 908], [1600, 904], [2300, 910], [3100, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 36, pts: [[40, 1292], [700, 1288], [1300, 1294], [1800, 1290], [2040, 1310]] },
        { k: 'lane2', w: 36, pts: [[2560, 1310], [2900, 1290], [3500, 1294], [4360, 1290]] },
        { k: 'cross', w: 30, pts: [[300, 908], [296, 1100], [300, 1290]] },
        { k: 'cross', w: 30, pts: [[3420, 908], [3426, 1100], [3420, 1294]] },
        { k: 'path', w: 28, pts: [[2300, 950], [2296, 1100], [2300, 1240]] },
      ],
      plazas: [{ k: 'central', x: 2300, y: 1340, rx: 290, ry: 104, mark: 'spring', ms: 1 }],
      water: [{ k: 'pond', e: [2720, 1420, 96, 30] }],
      kinds: KINDS,
      props: [
        ['beds', 2100, 1000], ['beds', 2500, 1000], ['beds', 2090, 1090], ['beds', 2510, 1090], ['beds', 2100, 1180], ['beds', 2500, 1180],
        ['scarecrow', 2400, 1140], ['plough', 1120, 1120], ['sheaf', 3560, 1160], ['sheaf', 3610, 1180], ['sheaf', 3660, 1150], ['cart2', 3820, 1170],
      ],
      houses: [{ x0: 380, x1: 610, base: 1450 }, { x0: 700, x1: 930, base: 1446 }, { x0: 3480, x1: 3710, base: 1450 }, { x0: 3820, x1: 4050, base: 1446 }],
      fill: [{ k: ['oak2', 'bush', 'flowers', 'haystack', 'sheaf'], n: 26, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'flowers', 'pot'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1240, 1480], [1540, 1760], [1800, 1960], [2660, 2900], [2960, 3200], [3260, 3500], [3560, 3780], [3820, 3990]] },
    };
  }

   
  function win(k, x, y, w, h, lv, lit = true) {
    const { f1, O } = k;
    let g = k.winLit(x, y, w, h, lit, lv >= 4) + `<rect x="${f1(x - 6)}" y="${f1(y + h)}" width="${f1(w + 12)}" height="10" fill="${BEAM}" ${O(2.5)}/>`;
    if (lv >= 2) for (let i = 0; i < 4; i++) g += `<circle cx="${f1(x - 1 + i * (w + 2) / 3)}" cy="${f1(y + h - 1)}" r="5" fill="${['#e8455c', '#ffd76a', '#ffffff', '#ff8a5c'][i]}" ${O(1.5)}/>`;
    return g;
  }

  function frameHouse(k, f, o = {}) {
    const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([66, 84, 100, 112, 120][lv - 1], f.up - 8, w * 0.55));
    let g = '';
    if (lv >= 3) { const mid = B - f.wall * 0.46; g += k.wall(x0, mid, w, B, 'stone') + k.wall(x0 - 8, top, w + 16, mid, 'timber') + `<path d="M${x0 - 10} ${f1(mid)} H${x1 + 10}" stroke="${BEAM}" stroke-width="9" stroke-linecap="round"/>`; }
    else g += k.wall(x0, top, w, B, lv <= 1 ? 'clay' : 'timber');
    const rx0 = lv >= 3 ? x0 - 8 : x0, rx1 = lv >= 3 ? x1 + 8 : x1;
    g += k.roof(rx0, rx1, top, rh, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#c9a85a' : lv >= 4 ? '#b8502e' : TILE, false, lv <= 1 ? undefined : TILED);
    if (lv >= 2) g += `<path d="M${f1(cx - 14)} ${f1(top - rh * 0.52)} h28 v24 h-28 Z" fill="${PLAST}" ${O(2.5)}/><path d="M${f1(cx)} ${f1(top - rh * 0.52)} v24 M${f1(cx - 14)} ${f1(top - rh * 0.4)} h28" stroke="${BEAM}" stroke-width="3"/>`;
    if (lv >= 5) g += `<path d="M${rx0 - 20} ${top + 3} L${f1((rx0 + rx1) / 2)} ${f1(top - rh + 6)} L${rx1 + 20} ${top + 3}" stroke="${k.GOLD}" stroke-width="5" fill="none"/>` + k.orb((rx0 + rx1) / 2, top - rh - 8, 8);
    const ww = [28, 32, 34, 36, 38][lv - 1], wh = [32, 40, 44, 48, 52][lv - 1];
    if (!o.noWin) {
      const yl = lv >= 3 ? B - f.wall * 0.46 + 16 : top + Math.max(18, (f.wall - wh) * 0.34);
      for (const x of [x0 + 18, x1 - 18 - ww]) if (Math.abs(x + ww / 2 - cx) > 54 && (lv > 1 || x < cx)) g += win(k, x, yl, ww, wh, lv);
      if (lv >= 3) for (const x of [x0 + 14, cx - ww / 2, x1 - 14 - ww]) if (!o.sign || Math.abs(x + ww / 2 - cx) > 70) g += win(k, x, top + 14, ww, wh * 0.9, lv);
    }
    if (lv >= 4 && !o.noBay) { const bx = x1 - 30; g += `<path d="M${f1(bx - 24)} ${f1(top + 30)} h48 v60 l-24 14 l-24 -14 Z" fill="${PLAST}" ${O(3)}/><rect x="${f1(bx - 12)}" y="${f1(top + 42)}" width="24" height="30" fill="#ffd76a" ${O(2)}/>`; }
    if (o.door !== false) g += k.bigDoor(cx, B, lv, BEAM, 0.95);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.34 : lv >= 3 ? top + (B - f.wall * 0.46 - top) * 0.5 : top + 30, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || TILED);
    if (lv >= 2 && o.vine !== false) g += `<path d="M${f1(x0 + 6)} ${B} q-8 -40 4 -70 q12 -26 0 -54" stroke="#4f7f32" stroke-width="4" fill="none"/><circle cx="${f1(x0 + 2)}" cy="${B - 50}" r="7" fill="#5f8f3a"/><circle cx="${f1(x0 + 10)}" cy="${B - 96}" r="6" fill="#6a9a42"/>`;
    return { g, top, rh, cx, B };
  }

  const sheaf = (k, x, y, s) => k.use(k.sym('d143sheaf', () => { const { O } = k; let g = `<path d="M-18 0 L-4 -60 M18 0 L4 -60 M0 0 V-64 M-10 0 L-2 -62 M10 0 L2 -62" stroke="#c89a3a" stroke-width="5"/><path d="M-14 -36 h28" stroke="#8a5a2a" stroke-width="6"/>`; for (const dx of [-8, 0, 8]) g += `<ellipse cx="${dx}" cy="-70" rx="6" ry="13" fill="${WHEAT}" ${O(2)}/>`; return g; }), x, y, s);

  function beds(k, x, y, v) {
    const { f1, O } = k;
    let g = `<path d="M${x - 92} ${y + 2} L${x - 80} ${y - 34} H${x + 80} L${x + 92} ${y + 2} Z" fill="${SOIL}" ${O(3)}/>`;
    let d = ''; for (let i = 0; i < 3; i++) d += `M${x - 86 + i * 4} ${f1(y - 6 - i * 11)} H${x + 86 - i * 4}`; g += `<path d="${d}" stroke="#5a3e26" stroke-width="3"/>`;
    for (let i = 0; i < 7; i++) { const px = x - 72 + i * 24, py = y - 10 - (i % 3) * 10; g += v % 2 ? `<circle cx="${px}" cy="${py - 4}" r="8" fill="#7ab04a" ${O(2)}/><circle cx="${px}" cy="${py - 6}" r="4" fill="#a8d070"/>` : `<path d="M${px - 5} ${py} l5 -14 l5 14" fill="#5f9a3a" stroke="#3a6a2a" stroke-width="1.5"/>`; }
    return g;
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [96, 104, 112, 112, 120][lv - 1], ph = f.wall - (lv <= 1 ? 30 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 28], [cx + ow / 2 + 28, x1]]) if (b - a > 12) g += k.wall(a, B - 64, b - a, B, lv <= 1 ? 'rubble' : 'stone') + `<rect x="${a - 4}" y="${B - 72}" width="${b - a + 8}" height="12" rx="3" fill="${TILE}" ${O(3)}/>`;
      if (lv >= 3) { const sx = x0 + 36, f2 = { x0: sx - 34, x1: sx + 34, B, wall: f.wall * 0.62, up: 60, lv }; g += frameHouse(k, f2, { noWin: true, door: false, vine: false, noBay: true, roofH: 46 }).g + win(k, sx - 12, B - f.wall * 0.62 + 16, 24, 28, lv); }
      for (const px of [cx - ow / 2 - 15, cx + ow / 2 + 15]) g += k.wall(px - 15, B - ph, 30, B, 'stone') + `<path d="M${f1(px - 18)} ${f1(B - ph - 2)} h36 l-6 -14 h-24 Z" fill="${TILE}" ${O(3)}/><path d="M${f1(px - 8)} ${f1(B - ph + 22)} q8 -6 16 6 l-8 26 Z" fill="${lv >= 5 ? k.GOLD : '#9a9eac'}" ${O(2.5)}/>`;
      if (lv >= 2) for (const s of [-1, 1]) { const a = cx + (s < 0 ? -ow / 2 : 2), w2 = ow / 2 - 2; g += `<rect x="${f1(a)}" y="${f1(B - ph + 46)}" width="${f1(w2)}" height="${f1(ph - 46)}" fill="#8a5a32" ${O(3)}/><path d="M${f1(a)} ${f1(B - ph + 46)} L${f1(a + w2)} ${B} M${f1(a + w2)} ${f1(B - ph + 46)} L${f1(a)} ${B}" stroke="${BEAM}" stroke-width="5"/>`; }
      const nm = L.name.toUpperCase(), by = B - ph - 10, bw = Math.max(ow + 76, nm.length * 15 + 40);
      g += `<rect x="${f1(cx - bw / 2 - 6)}" y="${f1(by - 14)}" width="${f1(bw + 12)}" height="14" fill="${TILE}" ${O(3)}/><rect x="${f1(cx - bw / 2)}" y="${f1(by)}" width="${f1(bw)}" height="30" rx="4" fill="${BEAM}" ${O(3.5)}/>` + k.txt(cx, by + 22, nm, 17, '#f3efd8');
      k.signAt([cx - bw / 2 - 4, by - 4, cx + bw / 2 + 4, by + 34]);
      if (lv >= 4) g += sheaf(k, cx, by - 14, 0.8);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = frameHouse(k, f, { sign: 'РАТУША', signBg: '#7a1a2a', noBay: true });
      let g = h.g;
      const cy = h.top - h.rh * 0.46, r = 12 + lv * 2;
      if (lv >= 2) g += `<circle cx="${f1(h.cx)}" cy="${f1(cy)}" r="${r}" fill="#f3efd8" ${O(3)}/><path d="M${f1(h.cx)} ${f1(cy)} V${f1(cy - r * 0.7)} M${f1(h.cx)} ${f1(cy)} L${f1(h.cx + r * 0.5)} ${f1(cy + r * 0.3)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      g += `<path d="M${f1(h.cx)} ${f1(h.top - h.rh)} v-24" stroke="${INK}" stroke-width="4"/>` + sheaf(k, h.cx, h.top - h.rh - 20, 0.55);
      if (lv >= 4) { const tx = f.x1 - 26, tt = h.top - 70; g += k.wall(tx - 24, tt, 48, h.top + 10, 'timber') + k.roof(tx - 24, tx + 24, tt, 60, 'shingle', TILE, false, TILED) + `<path d="M${f1(tx - 9)} ${f1(tt + 12)} q9 -4 18 0 l3 18 h-24 Z" fill="${lv >= 5 ? k.GOLD : '#d8a84a'}" ${O(2.5)}/>`; }
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = frameHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#8a2a1a' });
      let g = h.g + `<path d="M${f1(h.cx - 40)} ${f1(h.top - h.rh * 0.36)} q40 -26 80 0" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${f1(h.cx - 40)} ${f1(h.top - h.rh * 0.36)} q40 -26 80 0" stroke="#b47a48" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${f1(h.cx - 26)} ${f1(h.top - h.rh * 0.36 - 8)} v22 M${f1(h.cx + 26)} ${f1(h.top - h.rh * 0.36 - 8)} v22" stroke="${INK}" stroke-width="5"/>`;
      if (lv >= 2) { const rx = f.x1 + 10; g += `<ellipse cx="${f1(rx)}" cy="${h.B - 6}" rx="30" ry="9" fill="#e0c890" ${O(2.5)}/>`; for (let i = 0; i < 4; i++) g += `<path d="M${f1(rx - 30 + i * 20)} ${h.B} v-30" stroke="${BEAM}" stroke-width="5"/>`; g += `<path d="M${f1(rx - 32)} ${h.B - 22} H${f1(rx + 32)}" stroke="#b47a48" stroke-width="4"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${BEAM}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="5" fill="${PLAST}" ${O(4)}/>`;
      let cal = ''; for (let i = 0; i < 6; i++) cal += `<rect x="${f1(x0 + 16 + i * (w - 32) / 6)}" y="${f1(by0 + 10)}" width="${f1((w - 32) / 6 - 3)}" height="12" fill="${['#7ab04a', '#a8d070', WHEAT, '#e8a040', SOIL, '#9ac0e0'][i]}" stroke="${INK}" stroke-width="1.5"/>`;
      g += cal;
      for (let i = 0; i < 1 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 32 + Math.floor(i / 3) * 50, nw = Math.min(54, (w - 50) / 3); g += `<g transform="rotate(${(i * 7) % 9 - 4} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.85)}" fill="#fff3c8" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/></g>`; }
      g += k.roof(x0 - 6, x1 + 6, top, Math.min(f.up - 30, 40 + lv * 9), lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#c9a85a' : TILE, false, lv <= 1 ? undefined : TILED) + sheaf(k, x1 - 4, by0 + 8, 0.6);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, TILED);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2;
      const h = frameHouse(k, f, { sign: 'СКЛАД', signBg: '#6a4a1e', door: false, noWin: true, noBay: true, roofH: Math.min(f.up - 8, 84 + lv * 8), vine: false });
      const dw = Math.min(w - 40, 90 + lv * 12), dh = Math.min(f.wall - 34, 84 + lv * 10);
      let g = h.g + `<path d="M${f1(cx - dw / 2)} ${h.B} V${f1(h.B - dh)} H${f1(cx + dw / 2)} V${h.B} Z" fill="#3a2a18" ${O(4)}/><path d="M${f1(cx - dw / 2 + 8)} ${h.B} Q${f1(cx)} ${f1(h.B - dh * 0.7)} ${f1(cx + dw / 2 - 8)} ${h.B} Z" fill="${WHEAT}" ${O(2.5)}/>`;
      for (const s of [-1, 1]) g += `<path d="M${f1(cx + s * dw / 2)} ${h.B} l${f1(s * 24)} -6 V${f1(h.B - dh + 6)} l${f1(-s * 24)} 6" fill="#8a5a32" ${O(3)}/>`;
      for (let i = 0; i < 3 + Math.min(lv, 3); i++) g += sheaf(k, x0 + 14 + i * 22, h.top + 54, 0.42);
      if (lv >= 4) { const t = h.top - h.rh; g += `<rect x="${f1(cx - 18)}" y="${f1(t - 30)}" width="36" height="32" fill="${PLAST}" ${O(3)}/><path d="M${f1(cx - 24)} ${f1(t - 28)} L${f1(cx)} ${f1(t - 52)} L${f1(cx + 24)} ${f1(t - 28)} Z" fill="${TILE}" ${O(3)}/><circle cx="${f1(cx)}" cy="${f1(t - 14)}" r="6" fill="#2a2018"/>`; }
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#9a5a44');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = frameHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, noBay: true, vine: false });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 - 34 - i * 28, sy = h.top + 22; g += i % 2 ? `<path d="M${f1(sx)} ${f1(sy)} q14 4 10 20 q-8 -12 -18 -10" fill="none" stroke="#9a9eac" stroke-width="5"/>` : `<path d="M${f1(sx - 8)} ${f1(sy)} q8 -6 16 6 l-8 26 Z" fill="${lv >= 5 && i === 0 ? k.GOLD : '#9a9eac'}" ${O(2.5)}/>`; }
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const C = ['#5f8f3a', WHEAT, '#a8442e', '#e8a040'];
      const cone = (a, b, t, h, n, gold) => {
        const m = (a + b) / 2, sw = (b - a) / n; let s = '';
        for (let i = 0; i < n; i++) s += `<path d="M${f1(a + i * sw)} ${B} L${f1(a + i * sw + 4)} ${f1(t)} L${f1(a + (i + 1) * sw - 4)} ${f1(t)} L${f1(a + (i + 1) * sw)} ${B} Z" fill="${C[i % 4]}" ${O(3.5)}/><path d="M${f1(a + i * sw + 10)} ${f1(t + 20)} h14 M${f1(a + i * sw + 16)} ${f1(t + 60)} h12" stroke="${INK}" stroke-width="2" stroke-dasharray="4 3" opacity=".5"/>`;
        s += `<path d="M${f1(a - 16)} ${f1(t + 6)} Q${f1(m)} ${f1(t - h * 1.2)} ${f1(b + 16)} ${f1(t + 6)} Z" fill="${C[0]}" ${O()}/>`;
        for (let i = 1; i < 5; i++) s += `<path d="M${f1(m)} ${f1(t - h * 0.58)} L${f1(a - 16 + (b - a + 32) * i / 5)} ${f1(t + 4)}" stroke="${WHEAT}" stroke-width="5"/>`;
        return s + `<path d="M${f1(m)} ${f1(t - h * 0.6)} V${f1(t - h * 0.6 - 26)}" stroke="${INK}" stroke-width="5"/>` + (gold ? k.orb(m, t - h * 0.6 - 32, 8) : sheaf(k, m, t - h * 0.6 - 22, 0.5));
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.28); g += cone(x0, x0 + sw, top + 50, 70, 2, lv >= 5) + cone(x1 - sw, x1, top + 50, 70, 2, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.2 : x0, b = lv >= 4 ? x1 - w * 0.2 : x1;
      g += cone(a, b, top, Math.min(f.up - 30, 60 + lv * 22), lv >= 3 ? 6 : 4, lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} L${f1(cx - 4)} ${f1(B - 90 - lv * 6)} L${f1(cx + 4)} ${f1(B - 90 - lv * 6)} L${f1(cx + 30)} ${B} Z" fill="#2a2018" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 36, Math.min(b - a - 20, 150), 'ШАТЁР', lv, 20, '#3f6a2a');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0;
      const h = frameHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f5a2a', dx: x1 - 44, noWin: true, noBay: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 82, ay = h.B - Math.min(100, f.wall * 0.66);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 30)} H${f1(ax0 - 10)} Z" fill="${TILE}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 26)} V${h.B}" stroke="${BEAM}" stroke-width="6"/>`).join('');
      const crate = (x, kind) => `<rect x="${f1(x - 20)}" y="${h.B - 32}" width="40" height="32" fill="#b47a48" ${O(2.5)}/><path d="M${f1(x - 20)} ${h.B - 16} h40" stroke="${BEAM}" stroke-width="2.5"/>` + (kind === 0 ? `<circle cx="${f1(x - 8)}" cy="${h.B - 36}" r="10" fill="#8ac05a" ${O(2)}/><circle cx="${f1(x + 9)}" cy="${h.B - 36}" r="10" fill="#7ab04a" ${O(2)}/>` : kind === 1 ? `<path d="M${f1(x - 12)} ${h.B - 32} l5 -18 l5 18 M${f1(x)} ${h.B - 32} l5 -18 l5 18" fill="#ff8a2a" stroke="${INK}" stroke-width="1.5"/>` : `<ellipse cx="${f1(x)}" cy="${h.B - 40}" rx="16" ry="12" fill="#ff8a2a" ${O(2)}/><path d="M${f1(x)} ${h.B - 52} v-6" stroke="#3a6a2a" stroke-width="3"/>`);
      for (let i = 0, n = Math.max(2, Math.min(2 + lv, Math.floor((ax1 - ax0) / 46))); i < n; i++) g += crate(ax0 + 24 + i * 46, i % 3);
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0, B - 50, w, B, 'stone') + k.wall(x0 + 4, top, w - 8, B - 50, lv <= 1 ? 'clay' : 'timber');
      const rh = Math.min(f.up - 34, 90 + lv * 10);
      g += `<path d="M${f1(x0 - 16)} ${f1(top + 4)} L${f1(cx)} ${f1(top - rh)} L${f1(x1 + 16)} ${f1(top + 4)} Z" fill="#3a2a6a" ${O()}/>`;
      let st = ''; for (let i = 0; i < 5; i++) { const sx = cx + (i % 3 - 1) * w * 0.22, sy = top - rh * (0.25 + (i % 2) * 0.3); st += `M${f1(sx)} ${f1(sy - 5)} l1.6 3.4 l3.6 .4 l-2.7 2.4 l.8 3.6 l-3.3 -1.9 l-3.3 1.9 l.8 -3.6 l-2.7 -2.4 l3.6 -.4 Z`; }
      g += `<path d="${st}" fill="#ffd76a"/><path d="M${f1(cx)} ${f1(top - rh)} v-26" stroke="${INK}" stroke-width="4"/><path d="M${f1(cx)} ${f1(top - rh - 36)} l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z" fill="${lv >= 5 ? k.GOLD : '#ffd76a'}" ${O(2)}/>`;
      for (let i = 0; i < 3; i++) g += `<path d="M${f1(x0 + 12 + i * (w - 24) / 3)} ${f1(top + 30)} h${f1((w - 24) / 3 - 8)} v-16 a${f1(((w - 24) / 3 - 8) / 2)} 10 0 0 0 ${f1(-((w - 24) / 3 - 8))} 0 Z" fill="#2a2018" ${O(2)}/>`;
      g += win(k, cx - 15, top + 70, 30, 36, lv) + k.door(cx, B, 40 + lv * 3, 66 + lv * 4, '#3a2a5a');
      if (lv >= 4) g += `<rect x="${f1(x0 - 14)}" y="${f1(top + 116)}" width="${f1(w + 28)}" height="10" fill="${BEAM}" ${O(3)}/>`;
      k.signId('magic'); g += k.signLv(cx, B - 118, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  const art = {
    K: { leaf: ['#5f8f3a', '#77a843', '#4a7a32'], grass: '#a4b866', grass2: '#8ca456', roofC: TILE, plaster: PLAST },

    back(k) {
      const { P, L } = k;
      for (const [x0, x1, top, i] of [[200, 1600, 520, 0], [1300, 3100, 470, 1], [2800, 4300, 540, 2]]) {
        const id = k.clipId(`fields${i}`), d = `M${x0} 670 Q${(x0 + x1) / 2} ${top} ${x1} 670 Z`;
        let s = ''; for (let y = top - 20, j = 0; y < 670; y += 26, j++) s += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="26" fill="${j % 2 ? '#8a6a44' : ['#9ab866', '#c8b060', '#7a9a4a'][i]}"/>`;
        P(x0, x1, `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${s}</g><path d="${d}" fill="none" stroke="#5a7a3a" stroke-width="3" opacity=".5"/>`);
      }
      P(3300, 3500, `<rect x="3340" y="560" width="70" height="40" fill="${PLAST}"/><path d="M3330 562 L3375 530 L3420 562 Z" fill="${TILE}"/>`);
    },
    decor(k) { (k.L.hx.backHouses || []).forEach(([a, b], i) => k.P(a, b, backHome(k, a, b, i))); },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + sheaf(k, lot.x0 + 14, 812, 0.6);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 100 + (c.v % 20), up: 110, lv: c.v % 3 === 0 ? 3 : 2 };
      const g0 = frameHouse(k, f, { door: false, noBay: true }).g + k.door(c.v % 2 ? x1 - 40 : x0 + 40, 795, 38, 60, BEAM);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(300 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'spring') return { g: k.ell(x, y + 4, 84, 16) + `<ellipse cx="${x}" cy="${y - 6}" rx="72" ry="22" fill="#a29c8e" ${O(4)}/><ellipse cx="${x}" cy="${y - 10}" rx="58" ry="15" fill="url(#tgWater)" ${O(3)}/><path d="M${x - 60} ${y - 14} V${y - 150} M${x + 60} ${y - 14} V${y - 150}" stroke="${INK}" stroke-width="16"/><path d="M${x - 60} ${y - 14} V${y - 150} M${x + 60} ${y - 14} V${y - 150}" stroke="#a29c8e" stroke-width="10"/><path d="M${x - 84} ${y - 146} L${x} ${y - 212} L${x + 84} ${y - 146} Z" fill="${TILE}" ${O(4)}/><path d="M${x - 20} ${y - 80} q20 -24 40 0" stroke="#e8f8ff" stroke-width="5" fill="none"/><path d="M${x} ${y - 100} V${y - 40}" stroke="#9ad8f8" stroke-width="7" stroke-linecap="round"/><rect x="${x - 40}" y="${y - 120}" width="80" height="22" rx="4" fill="${BEAM}" ${O(2.5)}/>` + k.txt(x, y - 103, 'КЛЮЧ', 15, '#f3efd8'), w: 220, h: 240 };
      if (p.k === 'beds') return { g: beds(k, x, y, p.v), w: 200, h: 60, flat: true };
      if (p.k === 'scarecrow') return { g: k.ell(x, y, 20, 6) + `<path d="M${x} ${y} V${y - 140} M${x - 50} ${y - 104} H${x + 50}" stroke="#7a4e2a" stroke-width="7"/><path d="M${x - 30} ${y - 110} h60 l-8 60 h-44 Z" fill="#a8442e" ${O(3)}/><circle cx="${x}" cy="${y - 130}" r="18" fill="#e0c890" ${O(3)}/><path d="M${x - 26} ${y - 140} h52 l-10 -20 h-32 Z" fill="${WHEAT}" ${O(3)}/><path d="M${x - 54} ${y - 104} l-10 10 M${x + 54} ${y - 104} l10 10" stroke="${WHEAT}" stroke-width="5"/>`, w: 150, h: 180 };
      if (p.k === 'plough') return { g: k.ell(x, y, 60, 10) + `<path d="M${x - 60} ${y - 6} L${x + 40} ${y - 40} M${x + 30} ${y - 36} l30 -40 M${x + 44} ${y - 30} l26 -36" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x - 60} ${y - 6} L${x + 40} ${y - 40} M${x + 30} ${y - 36} l30 -40 M${x + 44} ${y - 30} l26 -36" stroke="#a87a4a" stroke-width="6" stroke-linecap="round"/><path d="M${x - 70} ${y} q10 -20 30 -14 l-10 18 Z" fill="#9a9eac" ${O(3)}/>`, w: 180, h: 100 };
      if (p.k === 'sheaf') return { g: k.ell(x, y, 22, 6) + sheaf(k, x, y, s), w: 60, h: 90 };
      if (p.k === 'oak2') return { g: k.ell(x, y, 40 * s, 10) + k.tree(x, y, 1.1 * s, 'big'), w: 230 * s, h: 270 * s };
      if (p.k === 'cart2') return { g: k.ell(x, y, 56, 10) + `<rect x="${x - 54}" y="${y - 62}" width="108" height="40" fill="#b47a48" ${O(3.5)}/><circle cx="${x - 30}" cy="${y - 14}" r="16" fill="${BEAM}" ${O(3)}/><circle cx="${x + 30}" cy="${y - 14}" r="16" fill="${BEAM}" ${O(3)}/><path d="M${x + 54} ${y - 42} l40 20" stroke="${BEAM}" stroke-width="6"/>` + [-30, 0, 30].map((dx) => sheaf(k, x + dx, y - 62, 0.5)).join(''), w: 200, h: 120 };
      return null;
    },
  };

  function backHome(k, a, b, i) {
    const w = b - a;
    if (w < 170) return k.tree((a + b) / 2, 792, 0.9, 'big');
    const x1 = Math.min(b - 10, a + 180 + (i * 29) % 50), f = { x0: a + 10, x1, B: 792, wall: 100 + (i * 13) % 26, up: 110, lv: i % 3 === 1 ? 3 : 2 };
    let g = frameHouse(k, f, { door: false, noBay: true }).g + k.door(i % 2 ? x1 - 40 : a + 50, 792, 38, 60, BEAM);
    if (b - x1 > 70) g += sheaf(k, (x1 + b) / 2, 796, 0.7);
    return g;
  }

  return {
    id: 'd143', ver: 1, name: 'Ключень', layout, art,
    story: 'Деревня пахарей в Доле у Ключа: посередине огороды сбегают грядами к каменному колодцу-роднику и пруду, по бокам - два хутора фахверковых домов под красной черепицей. Здесь куют плуги, а осенью ставят шатёр ярмарки урожая.',
  };
});
