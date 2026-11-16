



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const PL = '#7a6e58', PLD = '#4a4234', MOSS = '#5f7a32', MOSSL = '#7a9a3e', MOSSD = '#3f5a22', WISP = '#b8ff8a', BERRY = '#c8283a', STONE = '#7e7e70', STONED = '#5a5a4e';
  const KINDS = { oathstone: { foot: [110, 26], tall: 250 }, wisp: { foot: [14, 7], tall: 170 }, hummock: { foot: [44, 14], tall: 50 }, mossstump: { foot: [30, 12], tall: 70 }, frogstone: { foot: [30, 12], tall: 60 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        trainer: { x0: 1270, x1: 1550 },
        magic: { x0: 2900, x1: 3130 },
        storage: { x0: 3200, x1: 3480 },
        mine: { x0: 4040, x1: 4340 },
        hall: { x0: 1620, x1: 1920, B: 1212 },
        shop: { x0: 2560, x1: 2840, B: 1212 },
        tent: { x0: 3560, x1: 3910, B: 1176 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2240, 910], [3000, 906], [3700, 910], [4360, 906]] },
        { k: 'gat', w: 34, pts: [[1400, 906], [1420, 1080], [1510, 1270], [1800, 1294], [2016, 1300]] },
        { k: 'gat', w: 34, pts: [[2464, 1300], [2700, 1294], [3000, 1286], [3320, 1262], [3735, 1254], [3990, 1196], [4000, 1060], [3990, 908]] },
        { k: 'cross', w: 30, pts: [[2240, 910], [2240, 1212]] },
      ],
      plazas: [{ k: 'central', x: 2240, y: 1302, rx: 226, ry: 94, mark: 'oathstone', ms: 1 }],
      water: [{ k: 'bog', e: [2088, 1078, 112, 46] }, { k: 'bog', e: [2392, 1078, 112, 46] }, { k: 'bog', e: [2240, 1438, 250, 24] }, { k: 'bog', e: [1130, 1296, 150, 46] }, { k: 'bog', e: [3360, 1418, 160, 32] }, { k: 'bog', e: [640, 1110, 190, 44] }],
      kinds: KINDS,
      props: [['wisp', 1960, 1170], ['wisp', 2520, 1170], ['wisp', 1450, 1330], ['wisp', 3080, 1350], ['frogstone', 2440, 1004], ['hummock', 1000, 1420], ['mossstump', 3600, 1390]],
      houses: [{ x0: 300, x1: 520, base: 1450 }, { x0: 640, x1: 860, base: 1446 }, { x0: 2920, x1: 3130, base: 1452 }, { x0: 4100, x1: 4310, base: 1450 }],
      fill: [{ k: ['deadtree', 'reeds', 'reeds', 'mushroom', 'hummock', 'wisp'], n: 28, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'reeds'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1610, 1830], [1880, 2080], [2400, 2620], [2660, 2860], [3540, 3760], [3810, 4000]] },
    };
  }

   
  const wispFl = (k, x, y, s = 1) => k.use(k.sym('d62wisp', () => `<circle r="16" fill="${WISP}" opacity=".25"/><path d="M0 -12 q8 8 5 14 q-5 6 -10 0 q-3 -6 5 -14 Z" fill="${WISP}" stroke="#4a8a2a" stroke-width="2"/>`), x, y, s);
  const runes = (k, x, y, w) => { const { f1 } = k; let d = ''; for (let i = 0; i < Math.floor(w / 16); i++) { const rx = x - w / 2 + 8 + i * 16; d += ['M0 -7 v14 m0 -14 l6 5', 'M-4 -7 l8 14 m0 -14 l-8 14', 'M-4 7 v-14 l8 7 l-8 7', 'M0 -7 v14 m-5 -9 h10'][i % 4].replace(/M(-?\d+) (-?\d+)/g, (m, a, b) => `M${f1(rx + +a)} ${f1(y + +b)}`); } return `<path d="${d}" stroke="${WISP}" stroke-width="2.5" fill="none"/>`; };

  function mossRoof(k, x0, x1, top, h, lv) {
    const { f1, O } = k, cx = (x0 + x1) / 2, e = 24;
    let g = k.roof(x0, x1, top, h, lv <= 1 ? 'reed' : 'shingle', lv <= 1 ? '#8a7e44' : '#6a5a3a', false, '#3a3020');
    g += `<path d="M${x0 - e + 6} ${top + 4} Q${f1(x0 + 6)} ${f1(top - h * 0.5)} ${f1(cx - 8)} ${f1(top - h + 4)} Q${f1(cx)} ${f1(top - h - 6)} ${f1(cx + 8)} ${f1(top - h + 4)} Q${f1(x1 - 6)} ${f1(top - h * 0.5)} ${x1 + e - 6} ${top + 4} Q${f1(cx)} ${f1(top - h * 0.35)} ${x0 - e + 6} ${top + 4} Z" fill="${lv >= 3 ? MOSSL : MOSS}" ${O(3)}/>`;
    let d = ''; for (let x = x0 - e + 12; x < x1 + e - 8; x += 22) { const l = 14 + ((x * 7) % 18); d += `M${f1(x)} ${top + 4} q-3 ${f1(l * 0.5)} 1 ${l}`; }
    g += `<path d="${d}" stroke="${MOSSD}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (lv >= 2) for (let i = 0; i < 3; i++) { const t = 0.28 + i * 0.22, x = x0 + (x1 - x0) * t, y = top - (1 - Math.abs(t - 0.5) * 2) * h * 0.7; g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="4" fill="${BERRY}" ${O(1.5)}/><circle cx="${f1(x + 7)}" cy="${f1(y + 2)}" r="3.5" fill="${BERRY}" ${O(1.5)}/>`; }
    if (lv >= 4) g += `<path d="M${f1(cx)} ${f1(top - h + 2)} v-34" stroke="${k.INK}" stroke-width="4"/>` + wispFl(k, cx, top - h - 42, lv >= 5 ? 1.3 : 1);
    if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - h - 44)}" r="6" fill="${k.GOLD}" ${O(2)}/>`;
    return g;
  }

  const piles = (k, x0, x1, B, h) => { const { f1, O } = k; let g = ''; for (let x = x0 + 14; x < x1 - 4; x += 44) g += `<rect x="${f1(x - 7)}" y="${f1(B - h)}" width="14" height="${f1(h + 6)}" fill="${PLD}" ${O(2.5)}/>`; return g + `<path d="M${f1(x0 - 6)} ${f1(B - h)} H${f1(x1 + 6)}" stroke="${PLD}" stroke-width="10"/><path d="M${f1(x0)} ${B + 2} H${f1(x1)}" stroke="#3a4a2a" stroke-width="5" opacity=".5"/>`; };
  function win(k, x, y, w, h, lv, lit = true) {
    const { f1, O } = k;
    let g = k.winLit(x, y, w, h, lit) + `<path d="M${f1(x - 6)} ${f1(y + h + 4)} h${f1(w + 12)}" stroke="${PLD}" stroke-width="6"/>`;
    if (lv >= 2) g += `<path d="M${f1(x - 4)} ${f1(y - 4)} q${f1(w / 2 + 4)} 10 ${f1(w + 8)} 0" stroke="${MOSSD}" stroke-width="5" fill="none"/>`;
    return g;
  }

  function stiltHouse(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, ph = 26 + lv * 2, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2, fl = B - ph;
    const rh = Math.round(o.roofH || Math.min([60, 74, 86, 98, 106][lv - 1], f.up - 10, w * 0.44));
    let g = piles(k, x0, x1, B, ph);
    g += k.wall(x0, top, w, fl, lv <= 1 ? 'shack' : 'plank').replace(new RegExp(k.K.wood, 'g'), PL);
    if (lv >= 3) g += `<rect x="${x0}" y="${fl - 16}" width="${w}" height="16" fill="${MOSSD}" opacity=".45"/>`;
    g += mossRoof(k, x0, x1, top, rh, lv);
    const ww = [28, 30, 32, 34, 36][lv - 1], wh = [30, 36, 40, 44, 48][lv - 1], wy = top + Math.max(16, (fl - top - wh) * 0.32);
    if (!o.noWin) for (const x of [x0 + 20, x1 - 20 - ww]) if (Math.abs(x + ww / 2 - cx) > 54 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) {
      g += k.bigDoor(cx, fl, lv, PLD, 0.9) + `<path d="M${cx - 34} ${fl} L${cx - 40} ${B} M${cx + 34} ${fl} L${cx + 40} ${B}" stroke="${PLD}" stroke-width="6"/>`;
      let st = ''; for (let y = fl + 8; y < B; y += 9) st += `M${cx - 36} ${y} h72`; g += `<path d="${st}" stroke="#8a7a5a" stroke-width="5"/>`;
      if (lv >= 3) g += runes(k, cx, fl - [0, 0, 104, 112, 118][lv - 1], 70);
      if (lv >= 2) g += `<path d="M${cx + 48} ${fl} v-70 h14" stroke="${k.INK}" stroke-width="4" fill="none"/>` + wispFl(k, cx + 62, fl - 60, 0.8);
    }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || PLD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 54, 6);
    return { g, top, rh, cx, B, fl };
  }

  const sheaf = (k, x, B, h) => { const { f1, O } = k; return `<path d="M${f1(x - 12)} ${B} Q${f1(x - 16)} ${f1(B - h * 0.6)} ${f1(x - 4)} ${f1(B - h)} H${f1(x + 4)} Q${f1(x + 16)} ${f1(B - h * 0.6)} ${f1(x + 12)} ${B} Z" fill="#b8a45e" ${O(2.5)}/><path d="M${f1(x - 13)} ${f1(B - h * 0.45)} h26" stroke="${PLD}" stroke-width="4"/><path d="M${f1(x - 6)} ${f1(B - h)} q-4 -16 -10 -22 M${f1(x + 4)} ${f1(B - h)} q4 -16 10 -20" stroke="#8a7a3e" stroke-width="3" fill="none"/>`; };

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [96, 104, 112, 112, 120][lv - 1], ph = f.wall - (lv <= 1 ? 30 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 28], [cx + ow / 2 + 28, x1]]) if (b - a > 12) for (let x = a + 12; x < b; x += 26) g += sheaf(k, x, B, 76 + ((x * 7) % 16));
      if (lv >= 3) { const sx = x0 + 30, t = B - f.wall; g += piles(k, sx - 30, sx + 30, t + 50, 4) + `<path d="M${f1(sx - 24)} ${B} L${f1(sx - 20)} ${f1(t + 46)} M${f1(sx + 24)} ${B} L${f1(sx + 20)} ${f1(t + 46)}" stroke="${PLD}" stroke-width="9"/><rect x="${f1(sx - 30)}" y="${f1(t)}" width="60" height="46" fill="${PL}" ${O(3)}/>` + mossRoof(k, sx - 30, sx + 30, t, 30, 2); }
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 14); g += `<path d="M${f1(px - 13)} ${B} L${f1(px - 9 + s * 6)} ${f1(B - ph)} H${f1(px + 9 + s * 6)} L${f1(px + 13)} ${B} Z" fill="${PLD}" ${O(4)}/><path d="M${f1(px - 10 + s * 6)} ${f1(B - ph + 6)} q-2 30 4 50 M${f1(px + 6 + s * 6)} ${f1(B - ph + 6)} q2 22 -2 36" stroke="${MOSS}" stroke-width="6" fill="none" stroke-linecap="round"/>` + wispFl(k, px + s * 6, B - ph - 18, 1); }
      g += `<path d="M${f1(cx - ow / 2 - 24)} ${f1(B - ph + 20)} Q${f1(cx)} ${f1(B - ph + 4)} ${f1(cx + ow / 2 + 24)} ${f1(B - ph + 20)}" stroke="${INK}" stroke-width="14" fill="none"/><path d="M${f1(cx - ow / 2 - 24)} ${f1(B - ph + 20)} Q${f1(cx)} ${f1(B - ph + 4)} ${f1(cx + ow / 2 + 24)} ${f1(B - ph + 20)}" stroke="${PL}" stroke-width="8" fill="none"/>`;
      let d = ''; for (let x = cx - ow / 2 - 10; x < cx + ow / 2 + 14; x += 16) d += `M${f1(x)} ${f1(B - ph + 16)} q-2 ${10 + ((x * 3) % 14)} 2 ${20 + ((x * 3) % 14)}`; g += `<path d="${d}" stroke="${MOSSD}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(B - ph - 4)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), by = B - ph + 44, bw = Math.max(ow + 20, nm.length * 15 + 30);
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(by)}" width="${f1(bw)}" height="30" rx="4" fill="${PL}" ${O(3.5)}/>` + k.txt(cx, by + 22, nm, 17, '#eef0d8');
      k.signAt([cx - bw / 2 - 4, by - 4, cx + bw / 2 + 4, by + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = stiltHouse(k, f, { sign: 'РАТУША', signBg: '#5a2a1a' });
      let g = h.g;
      const sy = h.top - h.rh * 0.55, sw = 54 + lv * 4;
      if (lv >= 2) g += `<path d="M${f1(h.cx - sw / 2)} ${f1(sy + 30)} L${f1(h.cx - sw / 2 + 6)} ${f1(sy - 26)} Q${f1(h.cx)} ${f1(sy - 40)} ${f1(h.cx + sw / 2 - 6)} ${f1(sy - 26)} L${f1(h.cx + sw / 2)} ${f1(sy + 30)} Z" fill="${STONE}" ${O(3)}/>`;
      if (lv >= 2) for (const s of [-1, 1]) g += `<path d="M${f1(h.cx + s * 12)} ${f1(sy + 14)} v-14 m-6 4 v-12 m4 -2 v-10 m4 2 v-10 m4 4 v-8" stroke="${lv >= 5 ? k.GOLD : WISP}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      if (lv >= 3) { g += `<path d="M${f1(h.cx - 76)} ${h.B} V${f1(h.fl - 96)} M${f1(h.cx + 76)} ${h.B} V${f1(h.fl - 96)}" stroke="${INK}" stroke-width="12"/><path d="M${f1(h.cx - 76)} ${h.B} V${f1(h.fl - 96)} M${f1(h.cx + 76)} ${h.B} V${f1(h.fl - 96)}" stroke="${PL}" stroke-width="7"/>` + mossRoof(k, h.cx - 86, h.cx + 86, h.fl - 96, 30, 2); }
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = stiltHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a2a1a' });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} V${f1(h.B - 130)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${h.B} V${f1(h.B - 130)}" stroke="#a88a5a" stroke-width="3"/><path d="M${f1(sx - 7)} ${f1(h.B - 128)} v-14 M${f1(sx)} ${f1(h.B - 130)} v-18 M${f1(sx + 7)} ${f1(h.B - 128)} v-14 M${f1(sx - 8)} ${f1(h.B - 128)} h16" stroke="${lv >= 5 && i === 0 ? k.GOLD : '#9a9eac'}" stroke-width="3"/>`; }
      if (lv >= 2) g += sheaf(k, f.x0 - 34, h.B, 110) + `<circle cx="${f1(f.x0 - 34)}" cy="${h.B - 70}" r="14" fill="none" stroke="${BERRY}" stroke-width="5"/><circle cx="${f1(f.x0 - 34)}" cy="${h.B - 70}" r="5" fill="${BERRY}"/>`;
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${PLD}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${PL}" ${O(4)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(54, (w - 50) / 3); g += `<g transform="rotate(${(i * 11) % 9 - 4} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${i % 2 ? '#dcd8b0' : '#eeecd0'}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/></g>`; }
      g += frog(k, x1 - 26, by1 - 4, 0.7) + mossRoof(k, x0 - 4, x1 + 4, top, Math.min(f.up - 40, 32 + lv * 8), lv);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, PLD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const labaz = (a, b, hb, top, rh, main) => {
        let s = ''; for (const px of [a + 14, b - 14, a + (b - a) * 0.38, b - (b - a) * 0.38]) s += `<path d="M${f1(px)} ${B} V${f1(hb)}" stroke="${INK}" stroke-width="13"/><path d="M${f1(px)} ${B} V${f1(hb)}" stroke="${PLD}" stroke-width="8"/>`;
        s += `<rect x="${f1(a - 8)}" y="${f1(hb - 8)}" width="${f1(b - a + 16)}" height="12" fill="${PLD}" ${O(3)}/>` + k.wall(a, top, b - a, hb - 8, 'log').replace(new RegExp(k.K.wood, 'g'), PL) + mossRoof(k, a, b, top, rh, main ? lv : 2);
        return s;
      };
      const hb = B - Math.min(110, 50 + lv * 12), top = B - f.wall;
      let g = '';
      if (lv >= 4) g += labaz(x1 - w * 0.3, x1 + 4, B - 60, B - f.wall * 0.62, 30, false);
      const a = x0 + 6, b = lv >= 4 ? x1 - w * 0.34 : x1 - 6;
      g += labaz(a, b, hb, top, Math.min(f.up - 20, 50 + lv * 10), true);
      const m = (a + b) / 2;
      g += k.door(m, hb - 8, 44 + lv * 2, Math.min(hb - 8 - top - 40, 54 + lv * 3), PLD);
      let st = ''; for (let y = hb + 10; y < B; y += 16) st += `M${f1(m - 18)} ${y} h36`; g += `<path d="M${f1(m - 18)} ${hb} L${f1(m - 22)} ${B} M${f1(m + 18)} ${hb} L${f1(m + 22)} ${B}" stroke="#8a7a5a" stroke-width="5"/><path d="${st}" stroke="#8a7a5a" stroke-width="4"/>`;
      if (lv >= 5) g += `<rect x="${f1(m - 10)}" y="${f1(hb - 50)}" width="20" height="10" fill="${k.GOLD}" ${O(2)}/>`;
      k.signId('storage'); g += k.signLv(m, top + 26, Math.min(b - a - 10, 130), 'СКЛАД', lv, 19, '#4a3a1e');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, x1 = f.x1, w = x1 - x0, top = f.B - f.wall, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, top - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), STONE);
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(top - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      g += k.wall(x0, f.B - 40, w, f.B, 'rubble') + k.wall(x0, top, w, f.B - 40, lv <= 1 ? 'shack' : 'plank').replace(new RegExp(k.K.wood, 'g'), PL) + mossRoof(k, x0, x1, top, Math.min([60, 74, 86, 98, 106][lv - 1], f.up - 10, w * 0.44), lv);
      g += k.bigDoor(cx, f.B, lv, PLD, 0.95) + k.signLv(cx, lv <= 1 ? top - 20 : top + 26, Math.min(w + 10, 130), 'КУЗНЯ', lv, 20, '#3a3a4a');
      const mt = f.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${f.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${f.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(f.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) { const bx = x1 - 30 - i * 40; g += `<path d="M${f1(bx - 16)} ${f.B} l-4 -30 h40 l-4 30 Z" fill="#a88a5a" ${O(2.5)}/><ellipse cx="${f1(bx)}" cy="${f.B - 32}" rx="16" ry="7" fill="#8a4a2a" ${O(2)}/>`; }
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const hut = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(a)} ${B} Q${f1(a + (b - a) * 0.12)} ${f1(t + h * 0.3)} ${f1(m)} ${f1(t)} Q${f1(b - (b - a) * 0.12)} ${f1(t + h * 0.3)} ${f1(b)} ${B} Z" fill="#b8a45e" ${O()}/>`;
        let d = ''; for (let i = 1; i < 8; i++) { const x = a + (b - a) * i / 8; d += `M${f1(m)} ${f1(t + 10)} Q${f1((x + m) / 2)} ${f1(t + h * 0.4)} ${f1(x)} ${B - 2}`; }
        s += `<path d="${d}" stroke="#8a7a3e" stroke-width="2.5" fill="none"/>`;
        for (const v of [0.35, 0.65]) { const hw = (b - a) * 0.5 * (0.2 + v * 0.8); s += `<path d="M${f1(m - hw)} ${f1(t + h * v)} Q${f1(m)} ${f1(t + h * v + 10)} ${f1(m + hw)} ${f1(t + h * v)}" stroke="${gold ? k.GOLD : PLD}" stroke-width="6" fill="none"/>`; }
        return s + `<path d="M${f1(m - 8)} ${f1(t + 6)} l-10 -26 M${f1(m + 8)} ${f1(t + 6)} l10 -24" stroke="#8a7a3e" stroke-width="4"/>`;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += hut(x0, x0 + sw, f.wall * 0.66, lv >= 5) + hut(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += hut(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 32)} ${B} Q${f1(cx - 30)} ${f1(B - 80 - lv * 5)} ${f1(cx)} ${f1(B - 92 - lv * 5)} Q${f1(cx + 30)} ${f1(B - 80 - lv * 5)} ${f1(cx + 32)} ${B} Z" fill="#2a2416" ${O(3)}/>` + wispFl(k, cx + 46, B - 90, 0.8);
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#4a3a1e');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = stiltHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f4a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.72);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 24)} H${f1(ax0 - 10)} Z" fill="${MOSS}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 20)} V${h.B}" stroke="${PLD}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(2 + lv, Math.floor((ax1 - ax0) / 32))); i < n; i++) { const px = ax0 + 18 + i * 32; g += `<path d="M${f1(px)} ${f1(ay + 24)} v${i % 2 ? 40 : 30}" stroke="${INK}" stroke-width="2"/>` + (i % 2 ? `<path d="M${f1(px - 6)} ${f1(ay + 44)} q6 20 0 26 q-6 -6 0 -26 M${f1(px + 6)} ${f1(ay + 44)} l-4 22" stroke="#9aa0a8" stroke-width="5" fill="none"/>` : `<circle cx="${f1(px)}" cy="${f1(ay + 40)}" r="6" fill="#c8a06a" ${O(1.5)}/><circle cx="${f1(px)}" cy="${f1(ay + 52)}" r="6" fill="#a87a4a" ${O(1.5)}/>`); }
      for (let i = 0; i < Math.min(3, lv + 1); i++) { const bx = ax0 + 26 + i * 40; g += `<path d="M${f1(bx - 16)} ${h.B} l-4 -28 h40 l-4 28 Z" fill="#a88a5a" ${O(2.5)}/><path d="M${f1(bx - 18)} ${h.B - 28} q18 -14 36 0" fill="${BERRY}" ${O(2)}/>`; }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const sw = w * 0.62, ct = top - Math.min(f.up - 30, 60 + lv * 12);
      let g = `<path d="M${f1(cx - sw / 2)} ${B} Q${f1(cx - sw / 2 + 10)} ${f1(top + 40)} ${f1(cx - sw / 2 + 16)} ${f1(top + 20)} H${f1(cx + sw / 2 - 16)} Q${f1(cx + sw / 2 - 10)} ${f1(top + 40)} ${f1(cx + sw / 2)} ${B} Z" fill="#e8dcc0" ${O()}/><path d="M${f1(cx - sw / 2 + 20)} ${f1(top + 60)} q${f1(sw / 2 - 20)} 14 ${f1(sw - 40)} 0 M${f1(cx - sw / 4)} ${f1(top + 80)} V${B - 10} M${f1(cx + sw / 4)} ${f1(top + 80)} V${B - 10}" stroke="#c8b898" stroke-width="4" fill="none"/>`;
      g += `<path d="M${f1(x0 - 26)} ${f1(top + 30)} Q${f1(x0 - 20)} ${f1(ct)} ${f1(cx)} ${f1(ct)} Q${f1(x1 + 20)} ${f1(ct)} ${f1(x1 + 26)} ${f1(top + 30)} Q${f1(cx)} ${f1(top + 14)} ${f1(x0 - 26)} ${f1(top + 30)} Z" fill="${lv >= 5 ? '#c8902a' : '#a83a2a'}" ${O()}/>`;
      for (const [u, v, r] of [[0.2, 0.55, 12], [0.42, 0.3, 15], [0.66, 0.42, 11], [0.84, 0.66, 8], [0.08, 0.8, 7]]) g += `<ellipse cx="${f1(x0 - 20 + (w + 40) * u)}" cy="${f1(top + 24 - (top + 24 - ct) * (1 - v) * 0.9)}" rx="${r}" ry="${f1(r * 0.7)}" fill="#f6efe0" ${O(2)}/>`;
      g += `<circle cx="${f1(cx)}" cy="${f1(B - 52 - lv * 3)}" r="${f1(32 + lv * 2)}" fill="#3a2a5a" ${O(3)}/><rect x="${f1(cx - 32 - lv * 2)}" y="${f1(B - 52 - lv * 3)}" width="${f1(64 + lv * 4)}" height="${f1(52 + lv * 3)}" fill="#3a2a5a"/><path d="M${f1(cx - 32 - lv * 2)} ${B} V${f1(B - 52 - lv * 3)} A${f1(32 + lv * 2)} ${f1(32 + lv * 2)} 0 0 1 ${f1(cx + 32 + lv * 2)} ${f1(B - 52 - lv * 3)} V${B}" fill="none" ${O(3)}/><circle cx="${f1(cx + 18)}" cy="${f1(B - 36)}" r="4" fill="${k.GOLD}"/>`;
      g += win(k, cx - sw / 2 + 26, top + 40, 26, 30, lv) + win(k, cx + sw / 2 - 52, top + 40, 26, 30, lv);
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) g += wispFl(k, x0 - 10 + i * (w + 20) / (1 + Math.min(lv, 3)), ct + 30 - (i % 2) * 40, 0.7);
      k.signId('magic'); g += k.signLv(cx, top + 92, Math.min(sw + 10, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  function frog(k, x, y, s) {
    return k.use(k.sym('d62frog', () => { const { O } = k; return `<ellipse cx="0" cy="-12" rx="20" ry="13" fill="#6a9a3a" ${O(2.5)}/><circle cx="-9" cy="-24" r="6" fill="#6a9a3a" ${O(2)}/><circle cx="9" cy="-24" r="6" fill="#6a9a3a" ${O(2)}/><circle cx="-9" cy="-25" r="2.5" fill="#1e1a14"/><circle cx="9" cy="-25" r="2.5" fill="#1e1a14"/><path d="M-10 -8 q10 6 20 0" stroke="#1e1a14" stroke-width="2" fill="none"/><path d="M-20 -2 l-8 4 M20 -2 l8 4" stroke="#4a7a2a" stroke-width="5" stroke-linecap="round"/>`; }), x, y, s);
  }

  const art = {
    K: { leaf: ['#5a6a3a', '#6a7a44', '#4a5a30'] },

    back(k) {
      const { P, L } = k;
      let g = `<path d="M0 690 Q700 650 1500 676 Q2300 640 3100 670 Q3800 650 4400 680 V720 H0 Z" fill="#56664a" opacity=".7"/>`;
      for (let i = 0; i < 14; i++) { const x = 140 + i * 310 + ((i * 71) % 90), y = 640 + (i % 3) * 14; g += `<circle cx="${x}" cy="${y}" r="5" fill="${WISP}" opacity=".7"/><circle cx="${x}" cy="${y}" r="16" fill="${WISP}" opacity=".15"/>`; }
      for (const [x, w] of [[600, 900], [2000, 1100], [3400, 900]]) g += `<ellipse cx="${x}" cy="700" rx="${w / 2}" ry="26" fill="#c8d0b8" opacity=".22"/>`;
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 104 + (i * 13) % 20, up: 100, lv: 2 };
        k.P(a, b, stiltHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 30 : x1 - 56, 792 - f.wall + 22, 28, 32, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792 - 30, 36, 54, PLD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + frog(k, lot.x0 + 4, 790, 0.7);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 112 + (c.v % 20), up: 100, lv: 2 };
      const g0 = stiltHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 24 : x1 - 56, 795 - f.wall + 22, 30, 34, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795 - 30, 36, 54, PLD) + (c.v % 2 ? sheaf(k, x0 - 20, 798, 70) : wispFl(k, x1 + 24, 720, 0.8));
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(290 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, { f1, O, INK } = k;
      if (p.k === 'oathstone') {

        let g = k.ell(x, y + 4, 120, 20);
        for (const s of [-1, 1]) g += `<path d="M${x + s * 96} ${y} L${x + s * 104} ${y - 90} Q${x + s * 90} ${y - 112} ${x + s * 76} ${y - 92} L${x + s * 72} ${y} Z" fill="${STONED}" ${O(3.5)}/><path d="M${x + s * 102} ${y - 86} q${-s * 14} -16 ${-s * 26} -4" stroke="${MOSS}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
        g += `<path d="M${x - 52} ${y} L${x - 44} ${y - 180} Q${x - 30} ${y - 236} ${x + 4} ${y - 244} Q${x + 40} ${y - 236} ${x + 46} ${y - 180} L${x + 54} ${y} Z" fill="${STONE}" ${O(4.5)}/>`;
        g += `<path d="M${x - 44} ${y - 186} Q${x - 30} ${y - 236} ${x + 4} ${y - 244} Q${x + 20} ${y - 236} ${x + 30} ${y - 222} Q${x} ${y - 214} ${x - 44} ${y - 186} Z" fill="${MOSS}" stroke="${MOSSD}" stroke-width="2.5"/><path d="M${x - 40} ${y - 190} q-2 20 2 34 M${x - 20} ${y - 210} q-2 16 2 26" stroke="${MOSSD}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
        for (const [dx, dy, r] of [[-18, -150, 0], [16, -132, 10], [-8, -104, -8]]) g += `<g transform="translate(${x + dx} ${y + dy}) rotate(${r})"><path d="M-9 10 q-2 -10 0 -16 l0 -10 m4 10 v-16 m4 16 v-14 m4 16 v-10 m2 18 q2 6 -4 10 h-12 Z" stroke="${WISP}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
        g += runes(k, x, y - 64, 72) + runes(k, x, y - 40, 56) + wispFl(k, x - 70, y - 120, 0.9) + wispFl(k, x + 74, y - 140, 0.9) + wispFl(k, x + 10, y - 270, 1);
        return { g, w: 280, h: 290 };
      }
      if (p.k === 'wisp') return { g: k.ell(x, y, 14, 5) + `<path d="M${x} ${y} Q${x - 6} ${y - 80} ${x + 4} ${y - 140} q10 -10 22 -4" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${x} ${y} Q${x - 6} ${y - 80} ${x + 4} ${y - 140} q10 -10 22 -4" stroke="${PLD}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${x + 26} ${y - 144} v12" stroke="${INK}" stroke-width="2"/>` + wispFl(k, x + 26, y - 118, 1), w: 80, h: 170 };
      if (p.k === 'hummock') return { g: `<path d="M${x - 44} ${y + 2} Q${x - 40} ${y - 30} ${x} ${y - 34} Q${x + 40} ${y - 30} ${x + 44} ${y + 2} Z" fill="${MOSS}" ${O(3)}/><path d="M${x - 30} ${y - 18} q10 -6 20 0 M${x + 6} ${y - 24} q10 -6 20 0" stroke="${MOSSL}" stroke-width="4" fill="none"/>` + [[-16, -30], [-4, -34], [10, -32], [22, -24], [-26, -20]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="4.5" fill="${BERRY}" ${O(1.5)}/>`).join(''), w: 100, h: 50, flat: true };
      if (p.k === 'mossstump') return { g: k.ell(x, y, 30, 8) + `<path d="M${x - 26} ${y} l6 -54 l10 8 l8 -14 l10 10 l8 -6 l10 56 Z" fill="${PLD}" ${O(3)}/><path d="M${x - 22} ${y - 30} q20 -10 44 -2" stroke="${MOSS}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${x + 14} ${y - 12} h14 v10" fill="#d8c8a0" ${O(2)}/>`, w: 80, h: 70 };
      if (p.k === 'frogstone') return { g: k.ell(x, y, 30, 8) + `<path d="M${x - 30} ${y} Q${x - 30} ${y - 30} ${x} ${y - 32} Q${x + 30} ${y - 30} ${x + 30} ${y} Z" fill="${STONE}" ${O(3)}/>` + frog(k, x, y - 26, 0.8), w: 80, h: 70 };
      return null;
    },
  };

  return {
    id: 'd62', ver: 1, name: 'Моховка', layout, art,
    story: 'Деревня на сваях посреди Трясины Старой клятвы: серые дома под шубой мха, бороды мха свисают с застрех, на шестах горят зелёные болотные огни. По гатям меж бочагов - остров с Камнем клятвы, где на замшелом менгире до сих пор видны ладони предков.',
  };
});
