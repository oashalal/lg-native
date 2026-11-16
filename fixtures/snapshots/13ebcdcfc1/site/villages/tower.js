




(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ST = '#6a6472', STD = '#48444e', STL = '#8a8492', SL = '#3a3242', SLD = '#262030', VIO = '#b06aff', VIOL = '#e0c8ff', VIOD = '#6a3aa8', IRON = '#2e2a34', BLK = '#141018';
  const KINDS = { wardstone: { foot: [70, 22], tall: 280 }, smallward: { foot: [18, 8], tall: 70 }, wardlamp: { foot: [12, 6], tall: 150 }, chain: { foot: [40, 8], tall: 60 } };

  function layout() {
    const ring = []; for (let i = 0; i < 8; i++) { const a = (22.5 + i * 45) * Math.PI / 180; if (Math.abs(Math.sin(a) + 1) < 0.2) continue; ring.push(['smallward', Math.round(2200 + Math.cos(a) * 300), Math.round(1362 + Math.sin(a) * 104)]); }
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1180 },
        hall: { x0: 1250, x1: 1440 },
        trainer: { x0: 2960, x1: 3240 },
        magic: { x0: 3310, x1: 3540 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1520, x1: 1780, B: 1170 },
        tent: { x0: 2580, x1: 2880, B: 1170 },
        storage: { x0: 3600, x1: 3880, B: 1180 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 34, pts: [[1460, 908], [1500, 1080], [1620, 1236], [2000, 1250], [2200, 1244], [2600, 1236], [3000, 1250], [3740, 1252], [3990, 1220], [3990, 908]] },
        { k: 'cross', w: 30, pts: [[2200, 1244], [2200, 1290]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1362, rx: 220, ry: 80, mark: 'wardstone', ms: 1.25 }],
      kinds: KINDS,
      props: [...ring, ['wardlamp', 1960, 1180], ['wardlamp', 2440, 1180], ['chain', 1300, 1380], ['chain', 3300, 1400], ['wardlamp', 900, 1250]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 480, x1: 690, base: 1446 }, { x0: 3100, x1: 3300, base: 1452 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['deadtree', 'rock', 'rubble', 'brokencol', 'wardlamp'], n: 20, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'rubble'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1480, 1700], [1740, 1960], [2440, 2660], [2700, 2920], [3580, 3780], [3820, 4000]], tower: 2200, cracks: [[700, 1200], [1150, 1420], [1700, 1440], [2800, 1440], [3400, 1300], [3900, 1430]] },
    };
  }

   
  const crystal = (k, x, y, s = 1) => k.use(k.sym('towcr', () => { const { O } = k; return `<circle cx="0" cy="-14" r="22" fill="${VIO}" opacity=".18"/><path d="M-7 0 L-9 -18 L0 -32 L9 -18 L7 0 Z" fill="${VIO}" ${O(2)}/><path d="M0 -32 V0 M-9 -18 L0 -14 L9 -18" stroke="${VIOD}" stroke-width="1.8" fill="none"/>`; }), x, y, s);
  const lamp = (k, x, y, s = 1) => k.use(k.sym('towlamp', () => { const { O } = k; return `<circle cx="0" cy="12" r="24" fill="${VIO}" opacity=".22"/><path d="M-9 0 h18 l3 6 v16 l-3 6 h-18 l-3 -6 v-16 Z" fill="${VIOL}" ${O(2.5)}/><path d="M-12 6 h24 M-12 22 h24" stroke="${IRON}" stroke-width="3"/><path d="M0 8 q5 6 0 12 q-5 -6 0 -12 Z" fill="${VIO}"/>`; }), x, y, s);
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return `<path d="M${f1(x - 5)} ${f1(y + h + 5)} V${f1(y + w / 2)} A${f1(w / 2 + 5)} ${f1(w / 2 + 5)} 0 0 1 ${f1(x + w + 5)} ${f1(y + w / 2)} V${f1(y + h + 5)} Z" fill="${STD}" ${O(2.5)}/><path d="M${f1(x)} ${f1(y + h)} V${f1(y + w / 2)} A${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(x + w)} ${f1(y + w / 2)} V${f1(y + h)} Z" fill="${lv >= 3 ? VIOL : '#ffd27a'}" ${O(2)}/><path d="M${f1(x + w / 2)} ${f1(y + 2)} V${f1(y + h)} M${f1(x)} ${f1(y + h * 0.6)} h${f1(w)}" stroke="${IRON}" stroke-width="3"/>`;
  }

  function wardHouse(k, f, o = {}) {
    const { f1 } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([80, 94, 106, 116, 124][lv - 1], f.up - 14, w * 0.56));
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'rubble' : 'stone') + k.roof(x0, x1, top, rh, 'slate', SL, false, SLD);
    g += `<path d="M${f1(x0 + w * 0.3)} ${f1(B - 6)} l8 -30 l-6 -16 l10 -24" stroke="${VIO}" stroke-width="3" fill="none" opacity=".7"/>`;
    if (lv >= 2) g += crystal(k, cx, top - rh + 2, 0.9 + lv * 0.08);
    if (lv >= 4) for (const s of [-1, 1]) g += crystal(k, cx + s * (w / 2 + 6), top + 4, 0.6);
    const ww = [24, 28, 30, 32, 34][lv - 1], wh = [34, 40, 44, 48, 52][lv - 1], wy = top + Math.max(20, (f.wall - wh) * 0.34);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, IRON, 0.92);
    if (o.lamp !== false && lv >= 2) g += `<path d="M${f1(x1 + 2)} ${top + 24} h20 v10" stroke="${k.INK}" stroke-width="4" fill="none"/>` + lamp(k, x1 + 22, top + 34, 0.85);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 28, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || SLD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 60, 6);
    return { g, top, rh, cx, B };
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) { let d = ''; for (let x = a + 8; x < b; x += 14) d += `M${f1(x)} ${B} V${B - 60} l-4 -8 M${f1(x)} ${B - 60} l4 -8`; g += `<path d="${d}" stroke="${IRON}" stroke-width="4" fill="none"/><path d="M${f1(a)} ${B - 44} H${f1(b)} M${f1(a)} ${B - 16} H${f1(b)}" stroke="${IRON}" stroke-width="6"/>`; }
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 18); g += k.wall(px - 22, B - ph, 44, B, 'stone') + `<path d="M${f1(px - 26)} ${f1(B - ph)} h52 v-14 h-8 v8 h-8 v-8 h-8 v8 h-8 v-8 h-8 v8 h-12 Z" fill="${ST}" ${O(3)}/>` + crystal(k, px, B - ph - 14, 1 + lv * 0.06); }
      g += `<rect x="${f1(cx - ow / 2)}" y="${f1(B - ph + 36)}" width="${f1(ow)}" height="${f1(ph - 36)}" fill="${BLK}" opacity=".6"/>`;
      let gr = ''; for (let x = cx - ow / 2 + 10; x < cx + ow / 2; x += 16) gr += `M${f1(x)} ${f1(B - ph + 36)} V${f1(B - 30)}`; for (let y = B - ph + 50; y < B - 30; y += 22) gr += `M${f1(cx - ow / 2)} ${f1(y)} H${f1(cx + ow / 2)}`;
      g += `<path d="${gr}" stroke="${IRON}" stroke-width="5"/><path d="M${f1(cx - ow / 2 - 4)} ${f1(B - ph + 34)} H${f1(cx + ow / 2 + 4)}" stroke="${INK}" stroke-width="14"/><path d="M${f1(cx - ow / 2 - 4)} ${f1(B - ph + 34)} H${f1(cx + ow / 2 + 4)}" stroke="${ST}" stroke-width="9"/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(B - ph + 14)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 20, nm.length * 15 + 30), ny = B - ph + 2;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${SLD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, VIOL);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = wardHouse(k, f, { sign: 'РАТУША', signBg: '#4a1a2a' });
      const sy = h.top - h.rh * 0.4;
      return h.g + `<path d="M${f1(h.cx - 22)} ${f1(sy - 20)} h44 v22 Q${f1(h.cx)} ${f1(sy + 26)} ${f1(h.cx - 22)} ${f1(sy + 2)} Z" fill="${SLD}" ${O(2.5)}/><path d="M${f1(h.cx - 14)} ${f1(sy - 2)} Q${f1(h.cx)} ${f1(sy - 14)} ${f1(h.cx + 14)} ${f1(sy - 2)} Q${f1(h.cx)} ${f1(sy + 10)} ${f1(h.cx - 14)} ${f1(sy - 2)} Z" fill="${lv >= 5 ? k.GOLD : VIOL}" ${O(1.5)}/><circle cx="${f1(h.cx)}" cy="${f1(sy - 2)}" r="4" fill="${VIOD}"/>`;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = wardHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#5a1a1a', lamp: false });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} V${h.B - 140}" stroke="${INK}" stroke-width="5"/><path d="M${f1(sx)} ${h.B} V${h.B - 140}" stroke="#6a5a4a" stroke-width="2.5"/><path d="M${f1(sx)} ${h.B - 140} l10 6 l-10 18 Z" fill="#9aa4b2" ${O(1.5)}/>`; }
      if (lv >= 2) { const bx = f.x0 - 38; g += `<path d="M${f1(bx)} ${h.B} V${h.B - 120} M${f1(bx - 26)} ${h.B - 90} h52" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${f1(bx - 18)} ${h.B - 100} h36 l-4 50 h-28 Z" fill="#8a8494" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 114}" r="13" fill="#e0c060" ${O(2.5)}/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0 + 6, top + 10, w - 12, B - 40, 'stone') + `<rect x="${f1(x0)}" y="${B - 40}" width="${f1(w)}" height="40" fill="${STD}" ${O(3)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = top + 30 + Math.floor(i / 3) * 52, nw = Math.min(48, (w - 60) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.86)}" fill="#e8e0d0" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 12)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 24)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/><circle cx="${f1(nx + nw / 2)}" cy="${f1(ny + nw * 0.86 - 4)}" r="4" fill="${VIOD}"/>`; }
      g += crystal(k, cx, top + 10, 1 + lv * 0.08);
      k.signId('board'); g += k.signLv(cx, B - 20, Math.min(w - 10, 140), 'ДОСКА', lv, 20, SLD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, cx = (x0 + f.x1) / 2, B = 795;
      k.signId('storage'); const h = wardHouse(k, f, { sign: 'СКЛАД', signBg: '#2a2a3a', noWin: true });
      let g = h.g;
      for (let i = 0; i < Math.min(lv + 1, 4); i++) g += `<rect x="${f1(x0 - 40 + (i % 2) * 6)}" y="${f1(B - 30 - Math.floor(i / 2) * 28)}" width="38" height="28" fill="#5a4a3a" ${O(2.5)}/><path d="M${f1(x0 - 40 + (i % 2) * 6)} ${f1(B - 16 - Math.floor(i / 2) * 28)} h38" stroke="${IRON}" stroke-width="4"/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(h.top - h.rh - 30)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), STD);
      const h = wardHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, lamp: false, roofH: Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 10) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#2a1430" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="${VIO}"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m)} ${f1(t - 26)} V${f1(t)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(m)} ${f1(t - 26)} l22 8 l-22 8" fill="${gold ? k.GOLD : VIO}" ${O(2)}/><path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="#3a3446" ${O()}/>`;
        for (const v of [0.45, 0.75]) { const hw = (b - a) * 0.5 * v; s += `<path d="M${f1(m - hw)} ${f1(t + h * v)} H${f1(m + hw)}" stroke="${VIOD}" stroke-width="6"/>`; }
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 26)} ${B} L${f1(cx)} ${f1(B - 86 - lv * 5)} L${f1(cx + 26)} ${B} Z" fill="${BLK}" ${O(3)}/><path d="M${f1(cx - 16)} ${f1(top + 30)} Q${f1(cx)} ${f1(top + 18)} ${f1(cx + 16)} ${f1(top + 30)} Q${f1(cx)} ${f1(top + 42)} ${f1(cx - 16)} ${f1(top + 30)} Z" fill="${VIOL}" ${O(1.5)}/><circle cx="${f1(cx)}" cy="${f1(top + 30)}" r="4" fill="${VIOD}"/>`;
      k.signId('tent'); g += k.signLv(cx, top + 76, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, SLD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = wardHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true, lamp: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${VIOD}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${IRON}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${STD}" ${O(3)}/>`;
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 34))); i < n; i++) g += `<path d="M${f1(ax0 + 20 + i * 34)} ${f1(ay + 22)} v6" stroke="${INK}" stroke-width="2"/>` + (i % 2 ? lamp(k, ax0 + 20 + i * 34, ay + 28, 0.6) : crystal(k, ax0 + 20 + i * 34, ay + 60, 0.7));
      for (let i = 0; i < Math.min(3, lv); i++) g += crystal(k, ax0 + 24 + i * 34, h.B - 30, 0.8);
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0 + w * 0.18, top + 30, w * 0.64, B, 'stone') + `<path d="M${f1(x0 + w * 0.1)} ${f1(top + 34)} L${f1(cx)} ${f1(top - 50 - lv * 8)} L${f1(x1 - w * 0.1)} ${f1(top + 34)} Z" fill="${SL}" ${O()}/>`;
      g += `<circle cx="${f1(cx)}" cy="${f1(top + 70)}" r="26" fill="${VIOL}" ${O(3)}/><circle cx="${f1(cx)}" cy="${f1(top + 70)}" r="14" fill="${VIO}"/><circle cx="${f1(cx)}" cy="${f1(top + 70)}" r="40" fill="${VIO}" opacity=".15"/>` + crystal(k, cx, top - 50 - lv * 8, 1 + lv * 0.08);
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - 60 + i * 60)} ${f1(top - 80 - lv * 8 - (i % 2) * 20)} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="${lv >= 5 ? k.GOLD : VIOL}" ${O(1.2)}/>`;
      g += k.door(cx, B, 40 + lv * 3, 62 + lv * 4, '#1e1430');
      void INK;
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a1a4a');
      return g;
    },
  };

  const art = {
    K: {}, landmark: false,

    back(k) {
      const { P, L, f1, O } = k, tx = L.hx.tower;
      let g = `<ellipse cx="${tx}" cy="120" rx="260" ry="120" fill="${VIO}" opacity=".12"/>`;
      g += `<path d="M${tx - 260} 796 L${tx - 180} 600 L${tx - 130} 300 L${tx - 160} 300 L${tx - 90} 160 L${tx - 110} 160 L${tx - 40} 40 L${tx} -20 L${tx + 40} 40 L${tx + 110} 160 L${tx + 90} 160 L${tx + 160} 300 L${tx + 130} 300 L${tx + 180} 600 L${tx + 260} 796 Z" fill="${BLK}" ${O(5)}/>`;
      g += `<path d="M${tx - 160} 300 H${tx + 160} M${tx - 110} 160 H${tx + 110} M${tx - 200} 520 H${tx + 200}" stroke="#2a2232" stroke-width="10"/><path d="M${tx - 60} 40 L${tx} -20 L${tx + 60} 40" stroke="#2a2232" stroke-width="6" fill="none"/>`;
      for (const [x, y, w, h] of [[tx - 14, 80, 28, 40], [tx - 60, 200, 22, 34], [tx + 40, 220, 22, 34], [tx - 18, 360, 36, 50], [tx - 110, 420, 24, 36], [tx + 86, 440, 24, 36], [tx - 40, 600, 30, 40], [tx + 40, 640, 30, 40]]) g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${VIO}" opacity=".85"/><rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" fill="${VIO}" opacity=".12"/>`;
      for (const s of [-1, 1]) for (let i = 0; i < 3; i++) g += `<path d="M${f1(tx + s * (120 + i * 20))} ${f1(300 - i * 60)} l${s * 40} -30 l${-s * 10} 30 Z" fill="${BLK}" ${O(3)}/>`;
      let cr = ''; for (const [x, y] of [[tx - 380, 140], [tx + 340, 100], [tx + 460, 220], [tx - 500, 260]]) cr += `M${x - 14} ${y} q7 -8 14 0 q7 -8 14 0`; g += `<path d="${cr}" stroke="${BLK}" stroke-width="4" fill="none"/>`;
      P(0, L.W, g);
    },

    water(k) { for (const [x, y] of k.L.hx.cracks) { let d = `M${x} ${y}`; for (let i = 0; i < 5; i++) d += ` l${20 + (i * 13) % 20} ${((i * 17) % 18) - 9}`; k.P(x - 10, x + 160, `<path d="${d}" stroke="${VIOD}" stroke-width="6" fill="none"/><path d="${d}" stroke="${VIO}" stroke-width="2.5" fill="none"/>`, y - 30, y + 30); } },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 100 + (i * 13) % 22, up: 120, lv: 2 };
        k.P(a, b, wardHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 58, 792 - f.wall + 26, 26, 36, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, IRON));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 100 + (c.v % 20), up: 110, lv: 2 };
      const g0 = wardHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 52, 795 - f.wall + 26, 26, 36, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, IRON);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(300 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'wardstone') {

        let g = k.ell(x, y + 4, 90, 18) + `<ellipse cx="${x}" cy="${y}" rx="110" ry="26" fill="none" stroke="${VIO}" stroke-width="4" opacity=".6"/><path d="M${x - 60} ${y} l8 -24 h104 l8 24 Z" fill="${STD}" ${O(3.5)}/>`;
        g += `<path d="M${x - 36} ${y - 24} L${x - 28} ${y - 180} L${x} ${y - 200} L${x + 28} ${y - 180} L${x + 36} ${y - 24} Z" fill="${ST}" ${O(4)}/><path d="M${x} ${y - 196} V${y - 30}" stroke="${STD}" stroke-width="3"/>`;
        let r = ''; for (let i = 0; i < 5; i++) { const yy = y - 50 - i * 26; r += `M${x - 14} ${yy} l6 -8 l6 8 M${x + 4} ${yy - 4} h10`; } g += `<path d="${r}" stroke="${VIO}" stroke-width="3" fill="none"/>`;
        g += `<circle cx="${x}" cy="${y - 230}" r="70" fill="${VIO}" opacity=".18"/><path d="M${x - 18} ${y - 196} L${x - 22} ${y - 240} L${x} ${y - 280} L${x + 22} ${y - 240} L${x + 18} ${y - 196} Z" fill="${VIO}" ${O(3)}/><path d="M${x} ${y - 280} V${y - 198} M${x - 22} ${y - 240} L${x} ${y - 232} L${x + 22} ${y - 240}" stroke="${VIOD}" stroke-width="2.5" fill="none"/><path d="M${x - 8} ${y - 262} l4 20" stroke="${VIOL}" stroke-width="3"/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 240 * s, h: 300 * s };
      }
      if (p.k === 'smallward') return { g: k.ell(x, y, 18, 5) + `<path d="M${x - 14} ${y} L${x - 10} ${y - 44} L${x} ${y - 52} L${x + 10} ${y - 44} L${x + 14} ${y} Z" fill="${ST}" ${O(3)}/>` + crystal(k, x, y - 48, 0.6), w: 50, h: 90 };
      if (p.k === 'wardlamp') return { g: k.ell(x, y, 12, 4) + `<path d="M${x} ${y} V${y - 120} q0 -10 16 -10 v10" stroke="${INK}" stroke-width="7" fill="none"/><path d="M${x} ${y} V${y - 120}" stroke="${IRON}" stroke-width="3.5"/>` + lamp(k, x + 16, y - 122, 0.8), w: 60, h: 160 };
      if (p.k === 'chain') return { g: k.ell(x, y, 40, 7) + `<path d="M${x - 36} ${y} V${y - 50} M${x + 36} ${y} V${y - 50}" stroke="${INK}" stroke-width="9"/><path d="M${x - 36} ${y} V${y - 50} M${x + 36} ${y} V${y - 50}" stroke="${STL}" stroke-width="5"/><path d="M${x - 36} ${y - 44} Q${x} ${y - 20} ${x + 36} ${y - 44}" stroke="${IRON}" stroke-width="5" fill="none" stroke-dasharray="8 4"/>`, w: 90, h: 60, flat: true };
      return null;
    },
  };

  return {
    id: 'tower', ver: 1, name: 'Чёрная башня', layout, art,
    story: 'Деревня стражей у подножия Чёрной башни: над домами поднимается чёрный шпиль с лиловыми окнами и венцом из шипов. Дома стражей - серый камень под сланцем, на кровлях лиловые кристаллы-обереги, земля в трещинах порчи, а посреди стоит Камень-оберег в кольце малых камней, что держит порчу у подножия.',
  };
});
