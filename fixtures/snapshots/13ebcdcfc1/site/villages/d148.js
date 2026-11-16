



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const STONE = '#f2ede0', STONED = '#8a8a7a', WOOD = '#5a3a2a', WOODL = '#8a6a3a', IRON = '#4a4a5a';
  const GOLD = '#d8b860', GOLDD = '#a8883a', GOLDL = '#ffe080', FIRE = '#ff8a2a', FIREL = '#ffaa4a';
  const GRASS = '#a89a5a', GRASSL = '#c8c068', GRASSD = '#6a6a38';
  const LEAF = ['#7a8a4a', '#8a9a56', '#6a7a42'];
  const KINDS = { stone: { foot: [44, 14], tall: 220 }, campfire: { foot: [32, 12], tall: 160 }, birch3: { foot: [20, 8], tall: 280, tree: true }, stump2: { foot: [36, 12], tall: 50 }, grain: { foot: [20, 6], tall: 80 }, well2: { foot: [30, 12], tall: 180 }, lantern: { foot: [14, 6], tall: 140 }, wheat: { foot: [16, 4], tall: 60 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1180 },
        hall: { x0: 1250, x1: 1440 },
        storage: { x0: 1520, x1: 1780, B: 1170 },
        trainer: { x0: 2860, x1: 3140 },
        magic: { x0: 3210, x1: 3440 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 2000, x1: 2280, B: 1170 },
        tent: { x0: 3540, x1: 3880, B: 1200 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 908], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 34, pts: [[1460, 908], [1480, 1100], [1560, 1244], [2200, 1240], [2700, 1214], [3200, 1234], [3710, 1290], [3990, 1250], [3990, 908]] },
        { k: 'lane', w: 32, pts: [[1500, 1160], [1320, 1290]] },
      ],
      plazas: [{ k: 'central', x: 1350, y: 1346, rx: 200, ry: 80, mark: 'stone', ms: 1 }],
      water: [{ k: 'river', b: [0, 1320, 2020, 1480] }, { k: 'river', b: [2360, 1320, 4400, 1480] }],
      bridges: [{ x0: 2020, x1: 2360, y0: 1320, y1: 1480 }],
      kinds: KINDS,
      props: [['birch3', 500, 1440], ['birch3', 960, 1430, 1.1], ['birch3', 1700, 1434, 0.9], ['birch3', 2680, 1420], ['birch3', 3580, 1436], ['stump2', 780, 1340], ['lantern', 1980, 1300], ['well2', 2540, 1310], ['grain', 1120, 1350], ['grain', 3200, 1340]],
      houses: [{ x0: 100, x1: 310, base: 1450 }, { x0: 500, x1: 710, base: 1446 }, { x0: 3300, x1: 3500, base: 1450 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['birch3', 'stump2', 'grain', 'bush', 'flowers', 'wheat'], n: 20, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'grain'], n: 10, box: [80, 822, 4360, 840] }],
      extra: { backHouses: [[1480, 1700], [1740, 1960], [2320, 2560], [2600, 2820], [3480, 3720], [3770, 4000]], river: true },
    };
  }

   
  const wick = (k, x, y, lv) => { const { f1, O } = k; let g = `<path d="M${f1(x)} ${f1(y)} V${f1(y - 18)}" stroke="${IRON}" stroke-width="4" stroke-linecap="round"/><path d="M${f1(x)} ${f1(y - 18)} l4 -8" stroke="${lv >= 5 ? k.GOLD : '#e8d060'}" stroke-width="2.5" stroke-linecap="round"/>`; if (lv >= 2) g += `<circle cx="${f1(x)}" cy="${f1(y - 28)}" r="${f1(5 + lv)}" fill="${lv >= 5 ? k.GOLD : FIRE}" opacity="${lv >= 3 ? '.5' : '.3'}"/>`; return g; };

  const stump = (k, x, y, r) => { const { f1, O } = k; return k.ell(x, y, r * 1.1, r * 0.3) + `<path d="M${f1(x - r)} ${y} l${f1(r * 0.2)} ${f1(-r * 1.6)} H${f1(x + r * 0.8)} l${f1(r * 0.2)} ${f1(r * 1.6)} Z" fill="${WOOD}" ${O(2)}/><ellipse cx="${f1(x + r * 0.1)}" cy="${f1(y - r * 1.6)}" rx="${f1(r * 0.9)}" ry="${f1(r * 0.28)}" fill="#2a2a20" ${O(2.5)}/>`; };

  const ashLine = (k, a, b) => { let d = ''; for (let x = a; x < b; x += 12) d += `M${x} ${795} a${6} ${4} 0 1 1 12 0`; return `<path d="${d}" fill="${STONE}" opacity=".6"/>`; };
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return k.winLit(x, y, w, h, true, true) + (lv >= 2 ? `<path d="M${f1(x)} ${f1(y + h * 0.5)} h${f1(w)} M${f1(x + w * 0.5)} ${f1(y)} v${f1(h)}" stroke="${STONED}" stroke-width="3"/>` : '');
  }

  function ashHouse(k, f, o = {}) {
    const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    let g = '';
    if (lv >= 3) g += k.wall(x0, B - 28, w, B, 'rubble');
    g += k.wall(x0, top, w, lv >= 3 ? B - 28 : B, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), WOOD);

    const rh = Math.min([56, 70, 84, 96, 104][lv - 1], f.up - 14, w * 0.42);
    g += k.roof(x0, x1, top, rh, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? GRASS : STONED, false, STONE);

    for (let i = 0; i < Math.max(2, 1 + Math.floor(lv / 2)); i++) { const sx = x0 + 10 + i * (w - 20) / (Math.max(2, 1 + Math.floor(lv / 2)) - 1); g += `<path d="M${f1(sx)} ${f1(top - rh * 0.3)} q${f1((i % 2 ? 1 : -1) * 8)} ${f1(-rh * 0.5)} ${f1((i % 2 ? 1 : -1) * 16)} ${f1(-rh * 0.7)}" stroke="${WOOD}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }

    if (lv >= 2) { g += wick(k, x0 + 22, top - rh - 4, lv); if (lv >= 4) g += wick(k, x1 - 22, top - rh - 4, lv); }
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [30, 36, 40, 44, 48][lv - 1], wy = top + Math.max(24, (f.wall - wh) * 0.3);
    if (!o.noWin) for (const x of [x0 + 20, x1 - 20 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) { g += k.bigDoor(cx, B, lv, WOOD, 0.94); if (lv >= 2) g += `<path d="M${f1(cx + 44)} ${f1(B - 100)} l-10 -10 l-4 12 l14 4 Z" fill="${WOODL}" ${O(2)}/>` + k.wallLamp(cx + 44, B - 100); }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), top + 28, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || WOOD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 40, 6);
    return { g, top, rh, cx, B };
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';

      for (const [a, b] of [[x0, cx - ow / 2 - 24], [cx + ow / 2 + 24, x1]]) if (b - a > 12) {
        g += k.wall(a, B - 64, b - a, B, 'rubble');
        for (let x = a + 6; x < b - 6; x += 18) g += `<path d="M${f1(x)} ${f1(B - 64)} V${f1(B - 96)}" stroke="${WOODL}" stroke-width="4"/>`;
      }

      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 14); g += stump(k, px, B, 22); g += `<path d="M${f1(px - 14)} ${B} l${f1(-s * 6)} ${f1(-ph)} H${f1(px + 14)} l${f1(s * 6)} ${f1(-ph)}" stroke="${WOOD}" stroke-width="20" fill="none" stroke-linecap="round"/>`; }

      g += `<path d="M${f1(cx - ow / 2 - 20)} ${f1(B - ph - 8)} H${f1(cx + ow / 2 + 20)}" stroke="${WOOD}" stroke-width="16"/>`;

      if (lv >= 2) for (const s of [-1, 1]) g += wick(k, cx + s * (ow / 2 + 14), B - ph - 16, lv);

      if (lv >= 3) { const ty = B - ph - 50; g += `<rect x="${f1(cx - 38)}" y="${f1(ty)}" width="76" height="10" fill="${WOOD}" ${O(3)}/><path d="M${f1(cx - 32)} ${f1(ty)} v-28 M${f1(cx + 32)} ${f1(ty)} v-28 M${f1(cx - 38)} ${f1(ty - 28)} h76" stroke="${WOOD}" stroke-width="4"/><path d="M${f1(cx - 46)} ${f1(ty - 28)} L${f1(cx)} ${f1(ty - 54)} L${f1(cx + 46)} ${f1(ty - 28)} Z" fill="${STONED}" ${O(2)}/>`; }
      if (lv >= 5) g += wick(k, cx, B - ph - 34, 5);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = B - ph + 10;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${WOOD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, GOLDL);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = ashHouse(k, f, { sign: 'РАТУША', signBg: '#6a2a1a' });
      let g = h.g;
      if (lv >= 3) { g += `<rect x="${f1(h.cx - 60)}" y="${f1(h.B - 12)}" width="120" height="12" fill="${STONE}" ${O(3)}/><rect x="${f1(h.cx - 56)}" y="${f1(h.B - 28)}" width="40" height="16" rx="2" fill="${WOOD}" ${O(2)}/><rect x="${f1(h.cx + 16)}" y="${f1(h.B - 28)}" width="40" height="16" rx="2" fill="${WOOD}" ${O(2)}/>`; }

      g += `<rect x="${f1(h.cx - 10)}" y="${f1(h.top - h.rh - 10)}" width="20" height="${f1(h.rh * 0.4)}" fill="${STONED}" ${O(2)}/>` + wick(k, h.cx, h.top - h.rh - 30, Math.min(lv + 1, 5));
      if (lv >= 5) g += `<circle cx="${f1(h.cx)}" cy="${f1(h.top - h.rh - 36)}" r="14" fill="${FIRE}" opacity=".3"/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = ashHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#7a2a1a' });
      let g = h.g;

      const sx = f.x1 + 10; g += `<path d="M${f1(sx)} ${h.B} V${h.B - 130}" stroke="${INK}" stroke-width="5"/><path d="M${f1(sx)} ${h.B} V${h.B - 130}" stroke="${IRON}" stroke-width="2.5"/><path d="M${f1(sx - 5)} ${h.B - 130} l5 -16 l5 16 Z" fill="#9a9eac" ${O(1.5)}/>`;

      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const px = f.x0 - 10 - i * 12; g += `<path d="M${f1(px)} ${h.B} V${h.B - 120}" stroke="${WOOD}" stroke-width="4"/><path d="M${f1(px - 4)} ${h.B - 120} l4 -10 l4 10 Z" fill="${IRON}" />`; }
      if (lv >= 2) { const bx = h.cx - 40; g += `<path d="M${f1(bx)} ${h.B} V${h.B - 120} M${f1(bx - 26)} ${h.B - 88} h52" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><ellipse cx="${f1(bx)}" cy="${h.B - 68}" rx="18" ry="26" fill="#a8784a" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 110}" r="12" fill="#a8784a" ${O(3)}/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0, top + 10, w, B, 'rubble');

      let c = ''; for (let x = x0 + 12; x < x1 - 12; x += 18) c += `M${f1(x)} ${f1(top + 20)} a${9} ${6} 0 0 1 18 0`; g += `<path d="${c}" stroke="${IRON}" stroke-width="3" fill="none"/>`;

      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 16 + (i % 3) * (w - 32) / 3, ny = top + 38 + Math.floor(i / 3) * 46, nw = Math.min(44, (w - 50) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.8)}" fill="${GOLDL}" ${O(2.5)}/><path d="M${f1(nx + 5)} ${f1(ny + 10)} h${f1(nw - 10)} M${f1(nx + 5)} ${f1(ny + 20)} h${f1(nw - 14)}" stroke="${INK}" stroke-width="2" opacity=".45"/>`; }
      if (lv >= 3) g += `<path d="M${f1(cx - 12)} ${f1(top - 4)} l12 -14 l12 14 Z" fill="${FIRE}" opacity=".5"/><path d="M${f1(cx - 12)} ${f1(top - 4)} l12 -14 l12 14 Z" fill="${FIREL}" opacity=".3"/>`;
      k.signId('board'); g += k.signLv(cx, B - 26, Math.min(w - 10, 140), 'ДОСКА', lv, 20, WOOD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const t = B - Math.min(f.wall * 0.55, 70 + lv * 8);
      let g = '';

      g += `<path d="M${f1(x0 + 16)} ${B} L${f1(x0 + 30)} ${f1(t + 10)} H${f1(x1 - 30)} L${f1(x1 - 16)} ${B} Z" fill="${STONED}" ${O()}/>`;

      g += `<path d="M${f1(x0 + 4)} ${f1(t + 4)} L${f1(x0 + 26)} ${f1(t - 24)} H${f1(x1 - 26)} L${f1(x1 - 4)} ${f1(t + 4)} Z" fill="${STONED}" ${O(2)}/>`;

      g += `<path d="M${f1(cx - 24)} ${B} V${f1(B - 60)} A${f1(24)} ${f1(24)} 0 0 1 ${f1(cx + 24)} ${f1(B - 60)} V${B} Z" fill="#2a1e14" ${O(3)}/>` + k.door(cx, B, 40 + lv * 2, 56 + lv * 4, STONED);

      if (lv >= 4) { g += `<rect x="${f1(x0 + 20)}" y="${f1(t + 8)}" width="${f1(w * 0.25)}" height="10" fill="${WOOD}" ${O(2)}/>`; g += `<rect x="${f1(x1 - w * 0.25 - 20)}" y="${f1(t + 8)}" width="${f1(w * 0.25)}" height="10" fill="${WOOD}" ${O(2)}/>`; }

      if (lv >= 2) g += wick(k, x0 + 30, t - 24, lv); if (lv >= 4) g += wick(k, x1 - 30, t - 24, lv);
      if (lv >= 5) g += wick(k, cx, t - 42, 5);
      k.signId('storage'); g += k.signLv(cx, B - 60, Math.min(w * 0.5, 130), 'СКЛАД', lv, 19, '#5a3a1e');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), STONED);
      for (let i = 0; i < 2 + Math.min(lv, 2); i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 24 - i * 30)}" r="${10 + i * 7}" fill="${STONE}" opacity="${(0.35 - i * 0.08).toFixed(2)}"/>`;
      const h = ashHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="${FIRE}"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(mx + mw + 16 + i * 24)} ${f1(h.B - 68)} a10 10 0 1 1 14 0" stroke="${IRON}" stroke-width="5" fill="none"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(a)} ${B} Q${f1(m)} ${f1(t - 16)} ${f1(b)} ${B} Z" fill="#c8b888" ${O()}/>`;
        s += `<path d="M${f1(a)} ${B} Q${f1(m)} ${f1(t - 16)} ${f1(b)} ${B}" stroke="${INK}" stroke-width="4" fill="none"/>`;
        for (let i = 0; i < 2 + Math.min(2, lv); i++) { const px = a + (b - a) * (0.25 + i * 0.25); s += `<path d="M${f1(px)} ${B} V${f1(t + 12)}" stroke="${WOOD}" stroke-width="3.5"/>`; }
        if (gold) s += wick(k, m, t - 16, 5);
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.6, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.6, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 20 + lv * 8), lv >= 5);
      g += `<rect x="${f1(cx - 24)}" y="${f1(B - 64)}" width="48" height="34" rx="4" fill="${WOOD}" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 36, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#5a3a1e');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = ashHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f5a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(100, f.wall * 0.64);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${STONED}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${WOOD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${WOOD}" ${O(3)}/>`;

      for (let i = 0; i < Math.min(4, lv + 1); i++) { const px = ax0 + 20 + i * 30; g += i % 2 ? `<path d="M${f1(px - 12)} ${f1(h.B - 50)} q12 -6 24 0 l-2 28 q-10 6 -22 0 Z" fill="${GRASSD}" ${O(2)}/>` : `<path d="M${f1(px - 10)} ${h.B - 28} l3 -14 h14 l3 14 Z" fill="${STONE}" ${O(2)}/>`; }
      if (lv >= 2) { const bx = ax1 + 20; g += `<path d="M${f1(bx)} ${h.B} V${f1(h.B - 60)} M${f1(bx - 18)} ${f1(h.B - 46)} h36" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${f1(bx - 16)} ${f1(h.B - 32)} q16 -26 32 0 Z" fill="${IRON}" ${O(2)}/><path d="M${f1(bx - 14)} ${f1(h.B - 30)} q14 -20 28 0" fill="${FIRE}"/>`; }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall - Math.min(f.up - 60, 20 + lv * 10);
      let g = k.wall(x0 + 10, top, w - 20, B, 'rubble');

      for (let i = 0; i < 3 + Math.min(lv, 3); i++) { const sx = x0 + 20 + (i % 3) * (w - 40) / 3, sy = top + 24 + Math.floor(i / 3) * 36; g += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(4 + lv)}" fill="${GOLDL}" opacity=".6"/><circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(2 + lv / 2)}" fill="${FIREL}" opacity="${(0.3 + lv * 0.08).toFixed(2)}"/>`; }

      g += `<rect x="${f1(cx - 8)}" y="${f1(top - 16)}" width="16" height="16" fill="${STONED}" ${O(2)}/>` + wick(k, cx, top - 24, Math.min(lv + 2, 5));
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - 32)}" r="16" fill="${FIRE}" opacity=".3"/>`;

      g += k.door(cx, B, 40 + lv * 2, 60 + lv * 4, WOOD);
      k.signId('magic'); g += k.signLv(cx, B - 90, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  const art = {
    K: { leaf: LEAF, grass: GRASS, grass2: GRASSD, dirt: STONE, dirtD: STONED, far: [GRASS, GRASSD] },

    back(k) {
      const { P, L, f1 } = k;
      let g = '';

      g += `<rect x="0" y="580" width="${f1(L.W)}" height="220" fill="${STONE}" opacity=".2"/>`;

      for (let i = 0; i < 14; i++) { const x = 80 + i * 320 + ((i * 89) % 100), h = 120 + (i % 3) * 30; g += `<path d="M${f1(x - 4)} 795 l4 ${f1(-h)}" stroke="#d8d0c0" stroke-width="${f1(8 + (i % 2) * 4)}"/>`; for (let j = 0; j < 2 + (i % 3); j++) { const cx = x + (j % 2 ? 1 : -1) * (12 + j * 10), cy = 795 - h + j * 18; g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(12 + j * 6)}" fill="${LEAF[i % 3]}" opacity=".5"/>`; } }

      for (let i = 0; i < 6; i++) { const x = 200 + i * 780; g += `<path d="M${f1(x - 10)} 795 V${f1(782)}" stroke="${WOOD}" stroke-width="12"/><ellipse cx="${f1(x)}" cy="${f1(782)}" rx="10" ry="4" fill="#2a2a20"/>`; }
      P(0, L.W, g);
      void f1;
    },
    decor(k) {
      const L = k.L;
      (L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) { k.P(a, b, stump(k, (a + b) / 2, 792, 22)); return; }
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 24, up: 110, lv: 2 };
        k.P(a, b, ashHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 58, 792 - f.wall + 24, 28, 34, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, WOOD));
      });

      if (L.hx.river) {
        const { f1, O } = k, river = L.water && L.water[0];
        if (river) {
          let wg = '';

          const [x0, y0, x1] = river.b;
          wg += `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(x1 - x0)}" height="${f1(river.b[3] - y0)}" fill="#788898" ${O()}/>`;

          for (let x = x0 + 40; x < x1; x += 120 + ((x * 7) % 60)) { const wy = y0 + 20 + ((x * 13) % 60); wg += `<path d="M${f1(x)} ${f1(wy)} q20 6 40 0 q20 6 40 0" stroke="#8898a8" stroke-width="2" fill="none" opacity=".4"/>`; }
          k.P(x0, x1, wg);
        }
      }
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + wick(k, lot.x0 + 10, 664, 1);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = ashHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 22 : x1 - 58, 795 - f.wall + 24, 30, 36, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, WOOD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(270 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'stone') {

        let g = k.ell(x, y + 4, 70, 14);

        for (let i = 0; i < 7; i++) { const a = i * Math.PI / 3.5, rx = 54 + i * 4, ry = 12 + i * 2; g += `<ellipse cx="${f1(x + Math.cos(a) * rx)}" cy="${f1(y + 4 + Math.sin(a) * ry)}" rx="${f1(8 + i)}" ry="${f1(5 + i)}" fill="${STONE}" ${O(3)}/>`; }

        g += `<path d="M${f1(x)} ${f1(y - 80)} v40 M${f1(x - 14)} ${f1(y - 60)} h28" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>`;
        return { g, w: 180, h: 220 };
      }
      if (p.k === 'campfire') return { g: k.ell(x, y, 28, 7) + `<path d="M${f1(x - 18)} ${f1(y)} q18 -24 36 0 l-3 28 q-15 6 -33 0 Z" fill="${STONED}" ${O(2)}/><path d="M${f1(x - 10)} ${f1(y - 18)} q10 -14 20 0" fill="${FIRE}" opacity=".5"/>`, w: 60, h: 60, flat: true };
      if (p.k === 'birch3') { let g = k.ell(x, y, 22 * s, 6); const bh = 260 * s; g += `<path d="M${f1(x - 5)} ${y} q${f1(-3 * s)} ${f1(-bh * 0.5)} ${f1(x + 3 * s)} ${f1(-bh)}" stroke="#d8d0c0" stroke-width="${f1(10 * s)}" fill="none"/><path d="M${f1(x - 5)} ${y} q${f1(-3 * s)} ${f1(-bh * 0.5)} ${f1(x + 3 * s)} ${f1(-bh)}" stroke="#c8c0b0" stroke-width="${f1(6 * s)}" fill="none"/>`;
        for (let j = 0; j < 3; j++) { const cy = -bh * (0.2 + j * 0.25); g += `<path d="M${f1(x - 3 * s)} ${f1(cy)} h${f1(6 * s)}" stroke="#3a3a2e" stroke-width="2" fill="none"/>`; }

        for (let i = 0; i < 5; i++) { const cx = x + (i % 2 ? 1 : -1) * (10 + i * 6) * s, cy = -bh + i * 14 * s; g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(14 + i * 4)}" fill="${LEAF[i % 3]}" opacity=".7"/>`; }
        g = g.replace(/\$\{([^}]+)\}/g, (_, expr) => { try { return (new Function('s', 'x', 'y', 'f1', 'return (' + expr + ')'))(s, x, y, f1); } catch { return expr; } });

        g = k.ell(x, y, 22 * s, 6); const bh2 = 260 * s;
        g += `<path d="M${f1(x - 5 * s)} ${f1(y)} Q${f1(x - 8 * s)} ${f1(y - bh2 * 0.5)} ${f1(x + 3 * s)} ${f1(y - bh2)}" stroke="#d8d0c0" stroke-width="${f1(10 * s)}" fill="none"/>`;
        for (let j = 0; j < 3; j++) { const cy = y - bh2 * (0.2 + j * 0.25); g += `<path d="M${f1(x - 4 * s)} ${f1(cy)} h${f1(6 * s)}" stroke="#3a3a2e" stroke-width="2"/>`; }
        for (let i = 0; i < 5; i++) { const cx = x + (i % 2 ? 1 : -1) * (10 + i * 6) * s, cy = y - bh2 + i * 14 * s; g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(14 + i * 4)}" fill="${LEAF[i % 3]}" opacity=".7"/>`; }
        return { g, w: 100 * s, h: 280 * s }; }
      if (p.k === 'stump2') return { g: k.ell(x, y, 36, 9) + `<path d="M${f1(x - 26)} ${y} l4 -36 h44 l4 36 Z" fill="${WOOD}" ${O(3)}/><ellipse cx="${f1(x)}" cy="${f1(y - 36)}" rx="22" ry="7" fill="#2a2a20" ${O(2.5)}/>`, w: 80, h: 70, flat: true };
      if (p.k === 'lantern') return { g: k.ell(x, y, 16, 5) + `<path d="M${f1(x)} ${f1(y)} V${f1(y - 130)} h18" stroke="${WOOD}" stroke-width="7" fill="none"/><path d="M${f1(x)} ${f1(y)} V${f1(y - 130)}" stroke="${WOODL}" stroke-width="3.5"/>` + k.wallLamp(x + 22, y - 126), w: 70, h: 160 };
      if (p.k === 'well2') return { g: `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="30" ry="10" fill="${STONED}"/><path d="M${f1(x - 26)} ${f1(y)} V${f1(y - 80)} M${f1(x + 26)} ${f1(y)} V${f1(y - 80)}" stroke="${WOOD}" stroke-width="6"/><path d="M${f1(x - 30)} ${f1(y - 80)} H${f1(x + 30)}" stroke="${WOOD}" stroke-width="5"/><path d="M${f1(x)} ${f1(y - 80)} v-40" stroke="${IRON}" stroke-width="3"/><path d="M${f1(x - 8)} ${f1(y - 120)} q8 -12 16 0 v20 q-8 12 -16 0 Z" fill="#3a3640" ${O(2)}/><path d="M${f1(x - 8)} ${f1(y - 24)} h16 q0 20 -8 20 q-8 0 -8 -20 Z" fill="#5aa8d8"/>`, w: 90, h: 180 };
      if (p.k === 'grain') return { g: k.ell(x, y, 24, 6) + `<path d="M${f1(x)} ${f1(y)} V${f1(y - 60)} M${f1(x - 6)} ${f1(y - 40)} h12 M${f1(x - 5)} ${f1(y - 50)} h10 M${f1(x - 4)} ${f1(y - 60)} h8" stroke="${GRASSL}" stroke-width="3" fill="none" stroke-linecap="round"/>`, w: 50, h: 70, flat: true };
      return null;
    },
  };

  return {
    id: 'd148', ver: 2, name: 'Ярище', layout, art,
    story: 'Старый казачий город на зарастающем поле-ярище: каменные дома под золотой черепицей, окна и двери в золоте, шпили-колокольчики. Площадь перед Ратушей — Каменный Знак с золотым крестом. Река с мостом, берёзы, пни, зарастание.',
  };
});
