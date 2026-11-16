



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const RUST = '#a8542a', RUSTL = '#c8703a', RUSTD = '#6a321a', IRON = '#5a5662', IRONL = '#7a7684', PAT = '#5aa89a', COP = '#c87a3a', BRASS = '#d8a84a';
  const KINDS = { irondeer: { foot: [100, 26], tall: 380 }, scrap: { foot: [50, 14], tall: 60 }, gearpost: { foot: [16, 7], tall: 140 }, wreck: { foot: [56, 14], tall: 60 } };
  const LOOP = (() => { const P = []; for (let i = 0; i <= 24; i++) { const a = Math.PI + i * Math.PI * 2 / 24; P.push([Math.round(2300 + Math.cos(a) * 600), Math.round(1310 + Math.sin(a) * 120)]); } return P; })();

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1270, x1: 1570 },
        trainer: { x0: 2880, x1: 3160 },
        magic: { x0: 3230, x1: 3460 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1880, x1: 2160, B: 1120 },
        tent: { x0: 2440, x1: 2790, B: 1120 },
        storage: { x0: 3520, x1: 3800, B: 1240 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2300, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'ring', w: 34, pts: LOOP },
        { k: 'cross', w: 32, pts: [[2300, 912], [2300, 1190]] },
        { k: 'lane', w: 34, pts: [[1500, 906], [1520, 1180], [1700, 1310]] },
        { k: 'lane', w: 34, pts: [[2900, 1310], [3300, 1300], [3660, 1300], [3990, 1220], [3990, 908]] },
      ],
      plazas: [{ k: 'central', x: 2300, y: 1310, rx: 400, ry: 70, mark: 'irondeer', ms: 1 }],
      water: [{ k: 'lava', e: [900, 1240, 140, 30] }, { k: 'lava', e: [3300, 1430, 130, 22] }],
      kinds: KINDS,
      props: [['scrap', 1300, 1100], ['scrap', 3000, 1440], ['gearpost', 1820, 1300], ['gearpost', 2780, 1300], ['wreck', 700, 1360], ['scrap', 3700, 1420], ['wreck', 1250, 1420]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 480, x1: 690, base: 1446 }, { x0: 1560, x1: 1760, base: 1452 }, { x0: 4100, x1: 4310, base: 1450 }],
      fill: [{ k: ['rock', 'scrap', 'deadtree', 'rubble', 'gearpost'], n: 22, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'scrap'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1610, 1830], [2200, 2420], [2620, 2850], [3500, 3720], [3770, 4000]] },
    };
  }

   
  const gear = (k, x, y, r, c = IRONL) => { const { f1, O } = k; let d = ''; const n = Math.max(6, Math.round(r / 3)); for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n, b = a + Math.PI / n; d += `${i ? 'L' : 'M'}${f1(x + Math.cos(a - 0.12) * r * 1.25)} ${f1(y + Math.sin(a - 0.12) * r * 1.25)}L${f1(x + Math.cos(a + 0.12) * r * 1.25)} ${f1(y + Math.sin(a + 0.12) * r * 1.25)}L${f1(x + Math.cos(b) * r)} ${f1(y + Math.sin(b) * r)}`; } return `<path d="${d}Z" fill="${c}" ${O(2.5)}/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.36)}" fill="${IRON}" ${O(2)}/>`; };
  const ribs = (k) => k.sym('d85rib', () => { let g = `<rect width="120" height="120" fill="${RUST}"/>`; for (let x = 0; x < 120; x += 10) g += `<rect x="${x}" width="5" height="120" fill="${RUSTL}" opacity=".6"/>`; return g + `<rect x="18" y="30" width="34" height="26" fill="${RUSTD}" opacity=".5"/><rect x="70" y="72" width="30" height="30" fill="${PAT}" opacity=".45"/>`; });
  function ironWall(k, x0, top, w, B) {
    const { f1, O } = k, cid = k.clipId(`d85w${f1(x0)}${f1(top)}${f1(w)}`), s = Math.max(w, B - top) / 120;
    let g = `<clipPath id="${cid}"><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}"/></clipPath><g clip-path="url(#${cid})">${k.use(ribs(k), x0, top, s)}</g><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}" fill="none" ${O()}/>`;
    let rv = ''; for (let x = x0 + 10; x < x0 + w - 6; x += 20) rv += `M${f1(x)} ${f1(top + 8)} h1 M${f1(x)} ${f1(B - 8)} h1`; g += `<path d="${rv}" stroke="${IRONL}" stroke-width="5" stroke-linecap="round"/><path d="M${f1(x0)} ${f1(top + (B - top) * 0.5)} H${f1(x0 + w)}" stroke="${RUSTD}" stroke-width="4"/>`;
    return g;
  }
  function vault(k, x0, x1, top, h, lv) {
    const { f1, O, INK } = k, cx = (x0 + x1) / 2, e = 16;
    let g = `<path d="M${f1(x0 - e)} ${f1(top + 6)} Q${f1(x0 - e)} ${f1(top - h * 1.3)} ${f1(cx)} ${f1(top - h)} Q${f1(x1 + e)} ${f1(top - h * 1.3)} ${f1(x1 + e)} ${f1(top + 6)} Z" fill="${lv <= 1 ? IRON : lv >= 4 ? PAT : RUSTD}" ${O()}/>`;
    let d = ''; for (let i = 1; i < 6; i++) { const t = i / 6, x = x0 - e + (x1 - x0 + 2 * e) * t; d += `M${f1(x)} ${f1(top + 4)} Q${f1(x)} ${f1(top - h * (0.8 + Math.sin(Math.PI * t) * 0.4))} ${f1(cx + (x - cx) * 0.3)} ${f1(top - h + 2)}`; }
    g += `<path d="${d}" stroke="${INK}" stroke-width="2" opacity=".35" fill="none"/>`;
    if (lv >= 2) g += `<path d="M${f1(cx)} ${f1(top - h)} v-30" stroke="${INK}" stroke-width="4"/>` + gear(k, cx, top - h - 36, 8 + lv, lv >= 5 ? k.GOLD : BRASS);
    return g;
  }
  function port(k, x, y, r, lv) {
    const { f1, O } = k;
    return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + 6)}" fill="${lv >= 3 ? BRASS : IRONL}" ${O(3)}/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#ffd27a" ${O(2)}/><path d="M${f1(x - r * 0.6)} ${f1(y - r * 0.2)} a${f1(r * 0.6)} ${f1(r * 0.6)} 0 0 1 ${f1(r * 0.8)} ${f1(-r * 0.4)}" stroke="#fff6d8" stroke-width="3" fill="none"/>`;
  }

  function tinHouse(k, f, o = {}) {
    const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([46, 56, 66, 74, 80][lv - 1], f.up - 30, w * 0.36));
    let g = '';
    if (o.pipe !== false && lv >= 2) { const px = o.pipeX != null ? o.pipeX : x1 - 30, ph = 50 + lv * 14; g += `<rect x="${f1(px - 9)}" y="${f1(top - rh - ph + 20)}" width="18" height="${f1(ph + rh)}" fill="${IRON}" ${O(3)}/><path d="M${f1(px - 16)} ${f1(top - rh - ph + 20)} h32 l-6 -10 h-20 Z" fill="${IRONL}" ${O(2.5)}/><circle cx="${f1(px + 6)}" cy="${f1(top - rh - ph - 6)}" r="11" fill="#9a8a8a" opacity=".45"/>`; }
    g += ironWall(k, x0, top, w, B) + vault(k, x0, x1, top, rh, lv);
    const r = [12, 14, 15, 16, 17][lv - 1], wy = top + Math.max(26, f.wall * 0.36);
    if (!o.noWin) for (const x of [x0 + 30, x1 - 30]) if (Math.abs(x - cx) > 58 && (lv > 1 || x < cx)) g += port(k, x, wy, r, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, '#3a2a24', 0.92);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.4 : top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || RUSTD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }
  const scrapPile = (k, x, y, s = 1) => k.use(k.sym('d85scrap', () => { const { O } = k; return `<path d="M-50 0 Q-40 -40 -10 -50 Q20 -56 40 -30 Q50 -16 50 0 Z" fill="${IRON}" ${O(3)}/><path d="M-30 -20 l20 -16 M0 -40 l26 6 M10 -14 l24 -4 M-40 -6 l16 -4" stroke="${RUSTL}" stroke-width="5" stroke-linecap="round"/><circle cx="-14" cy="-30" r="9" fill="none" stroke="${RUST}" stroke-width="4"/><rect x="14" y="-26" width="16" height="12" fill="${PAT}" ${O(1.5)}/>`; }), x, y, s);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 34], [cx + ow / 2 + 34, x1]]) if (b - a > 12) g += ironWall(k, a, B - 56, b - a, B);
      g += gear(k, cx, B - ph - 8, ow * 0.5 + 10, lv >= 5 ? k.GOLD : RUST) + `<circle cx="${f1(cx)}" cy="${f1(B - ph - 8)}" r="${f1(ow * 0.5 * 0.9)}" fill="#2a1e1a"/>`;
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 18); g += ironWall(k, px - 18, B - ph, 36, B) + `<path d="M${f1(px - 24)} ${f1(B - ph)} h48 l-8 -14 h-32 Z" fill="${IRON}" ${O(3)}/>`; }
      if (lv >= 3) { const sx = x0 + 26; g += `<path d="M${f1(sx)} ${B} V${f1(B - f.wall)}" stroke="${INK}" stroke-width="9"/><path d="M${f1(sx)} ${B} V${f1(B - f.wall)}" stroke="${IRON}" stroke-width="5"/><path d="M${f1(sx - 4)} ${f1(B - f.wall)} l26 -10 v24 Z" fill="${BRASS}" ${O(2.5)}/><path d="M${f1(sx + 22)} ${f1(B - f.wall - 4)} l60 -20 v40 Z" fill="#ffe8a0" opacity=".25"/>`; }
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = B - ph + 30;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${RUSTD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, BRASS);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = tinHouse(k, f, { sign: 'РАТУША', signBg: '#5a1a14', pipeX: f.x0 + 24 });
      let g = h.g;
      const cy = h.top - h.rh * 0.36, cr = 18 + lv * 3;
      g += `<circle cx="${f1(h.cx)}" cy="${f1(cy)}" r="${f1(cr + 6)}" fill="${BRASS}" ${O(3)}/><circle cx="${f1(h.cx)}" cy="${f1(cy)}" r="${f1(cr)}" fill="#f6efe0" ${O(2)}/><path d="M${f1(h.cx)} ${f1(cy)} v${f1(-cr * 0.7)} M${f1(h.cx)} ${f1(cy)} l${f1(cr * 0.5)} ${f1(cr * 0.2)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      if (lv >= 3) g += `<path d="M${f1(h.cx - 30)} ${f1(h.top - h.rh - 4)} Q${f1(h.cx)} ${f1(h.top - h.rh - 60)} ${f1(h.cx + 30)} ${f1(h.top - h.rh - 4)} Z" fill="${lv >= 5 ? k.GOLD : PAT}" ${O(3)}/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = tinHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14' });
      let g = h.g;
      if (lv >= 2) { const bx = f.x0 - 38; let sp = ''; for (let i = 0; i < 6; i++) sp += `M${f1(bx - 10)} ${h.B - 6 - i * 8} h20`; g += `<path d="${sp}" stroke="${IRONL}" stroke-width="4"/><rect x="${f1(bx - 20)}" y="${h.B - 110}" width="40" height="56" rx="8" fill="${RUST}" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 126}" r="16" fill="${IRON}" ${O(3)}/><path d="M${f1(bx - 6)} ${h.B - 128} h3 M${f1(bx + 4)} ${h.B - 128} h3" stroke="#ffd76a" stroke-width="4"/><path d="M${f1(bx - 20)} ${h.B - 100} l-18 20 M${f1(bx + 20)} ${h.B - 100} l18 20" stroke="${IRON}" stroke-width="8" stroke-linecap="round"/>`; }
      for (let i = 0; i < 1 + Math.min(lv, 3); i++) { const sx = f.x1 + 16 + i * 16; g += `<path d="M${f1(sx)} ${h.B} V${h.B - 100}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${h.B} V${h.B - 100}" stroke="${IRONL}" stroke-width="3"/><path d="M${f1(sx - 8)} ${h.B - 112} a9 9 0 1 1 16 0 l-4 6 h-8 Z" fill="${IRONL}" ${O(2)}/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${IRON}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += ironWall(k, x0 + 6, by0, w - 12, by1);
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = by0 + 16 + Math.floor(i / 3) * 52, nw = Math.min(50, (w - 56) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.86)}" fill="#efe8d8" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/><circle cx="${f1(nx + nw / 2)}" cy="${f1(ny)}" r="4" fill="#c8402a"/>`; }
      g += gear(k, x0 + 10, by0, 12, BRASS) + gear(k, x1 - 10, by0, 10, IRONL) + (lv >= 3 ? gear(k, cx, top + 2, 16, lv >= 5 ? k.GOLD : RUST) : '');
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, RUSTD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall * 0.8;
      let g = ironWall(k, x0, top, w, B) + vault(k, x0, x1, top, Math.min(f.up - 10, 60 + lv * 12), lv);
      const dw = w * 0.5, dh = Math.min(B - top - 20, 80 + lv * 8);
      g += `<path d="M${f1(cx - dw / 2)} ${B} V${f1(B - dh + dw / 4)} Q${f1(cx)} ${f1(B - dh - dw / 6)} ${f1(cx + dw / 2)} ${f1(B - dh + dw / 4)} V${B} Z" fill="#241c1a" ${O(3)}/>`;
      g += scrapPile(k, x0 + 30, B, 0.8 + lv * 0.08) + (lv >= 4 ? scrapPile(k, x1 - 30, B, 0.8) : '');
      if (lv >= 2) g += `<path d="M${f1(x1 + 16)} ${B} V${f1(top - 50)} H${f1(cx)}" stroke="${INK}" stroke-width="9" fill="none"/><path d="M${f1(x1 + 16)} ${B} V${f1(top - 50)} H${f1(cx)}" stroke="${RUST}" stroke-width="5" fill="none"/><path d="M${f1(cx + 10)} ${f1(top - 50)} v40 q0 12 -10 12" stroke="${IRONL}" stroke-width="4" fill="none"/>`;
      if (lv >= 5) g += gear(k, cx, top - 20, 14, k.GOLD);
      k.signId('storage'); g += k.signLv(cx, top + 24, Math.min(w - 10, 130), 'СКЛАД', lv, 19, RUSTD);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const h = tinHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      let g = h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff7a2a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += gear(k, f.x1 - 40 - i * 34, h.B - 20 - (i % 2) * 14, 12, i % 2 ? BRASS : IRONL);
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(a)} ${B} Q${f1(a)} ${f1(t)} ${f1(m)} ${f1(t)} Q${f1(b)} ${f1(t)} ${f1(b)} ${B} Z" fill="#a89a84" ${O()}/>`;
        for (const [u, v, c] of [[0.25, 0.5, RUST], [0.6, 0.3, PAT], [0.75, 0.7, '#6a6058']]) s += `<rect x="${f1(a + (b - a) * u - 14)}" y="${f1(t + h * v - 10)}" width="28" height="20" fill="${c}" ${O(1.8)}/>`;
        for (const u of [0.2, 0.5, 0.8]) s += `<path d="M${f1(a + (b - a) * u)} ${B} Q${f1(a + (b - a) * u)} ${f1(t + h * 0.05 + Math.abs(u - 0.5) * h * 0.4)} ${f1(m)} ${f1(t + 2)}" stroke="${IRON}" stroke-width="4" fill="none"/>`;
        if (gold) s += gear(k, m, t - 12, 9, k.GOLD);
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.62, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.58, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 30 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} V${f1(B - 70 - lv * 4)} Q${f1(cx)} ${f1(B - 100 - lv * 4)} ${f1(cx + 30)} ${f1(B - 70 - lv * 4)} V${B} Z" fill="#241c1a" ${O(3)}/>`;
      if (lv >= 2) { const tx = x1 + 10; g += `<rect x="${f1(tx - 16)}" y="${B - 46}" width="32" height="46" rx="6" fill="${IRON}" ${O(2.5)}/><path d="M${f1(tx - 10)} ${B - 14} h20" stroke="#ff7a2a" stroke-width="5"/><path d="M${f1(tx - 12)} ${B - 46} h24 q0 -18 -12 -18 q-12 0 -12 18 Z" fill="${COP}" ${O(2)}/>`; }
      k.signId('tent'); g += k.signLv(cx, top + 60, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, RUSTD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = tinHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a3a', dx: x1 - 44, noWin: true, pipeX: x0 + 24 });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${PAT}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${IRON}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 36))); i < n; i++) { const px = ax0 + 22 + i * 36; g += `<path d="M${f1(px)} ${f1(ay + 22)} v10" stroke="${INK}" stroke-width="2"/>` + (i % 2 ? `<path d="M${f1(px - 12)} ${f1(ay + 52)} q0 -20 12 -20 q12 0 12 20 Z M${f1(px + 12)} ${f1(ay + 44)} l8 -6" fill="${COP}" stroke="${INK}" stroke-width="2"/>` : gear(k, px, ay + 44, 10, BRASS)); }
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${IRON}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(2, lv); i++) { const tx = ax0 + 30 + i * 46; g += `<rect x="${f1(tx - 10)}" y="${h.B - 54}" width="20" height="18" rx="3" fill="${RUST}" ${O(2)}/><circle cx="${f1(tx)}" cy="${h.B - 62}" r="7" fill="${IRONL}" ${O(2)}/><path d="M${f1(tx - 10)} ${h.B - 36} v6 M${f1(tx + 10)} ${h.B - 36} v6" stroke="${INK}" stroke-width="3"/>`; }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = ironWall(k, x0 + w * 0.18, top + 40, w * 0.64, B) + `<path d="M${f1(x0 + w * 0.1)} ${f1(top + 40)} h${f1(w * 0.8)} l-10 -16 h${f1(-w * 0.8 + 20)} Z" fill="${IRON}" ${O(3)}/>`;
      const sy = top - 10, sr = w * 0.34;
      g += `<ellipse cx="${f1(cx)}" cy="${f1(sy)}" rx="${f1(sr)}" ry="${f1(sr)}" fill="none" stroke="${BRASS}" stroke-width="6"/><ellipse cx="${f1(cx)}" cy="${f1(sy)}" rx="${f1(sr)}" ry="${f1(sr * 0.32)}" fill="none" stroke="${BRASS}" stroke-width="5"/><ellipse cx="${f1(cx)}" cy="${f1(sy)}" rx="${f1(sr * 0.32)}" ry="${f1(sr)}" fill="none" stroke="${COP}" stroke-width="4" transform="rotate(30 ${f1(cx)} ${f1(sy)})"/><circle cx="${f1(cx)}" cy="${f1(sy)}" r="${f1(sr * 0.22)}" fill="${lv >= 5 ? k.GOLD : '#ffd76a'}" ${O(2.5)}/>`;
      g += `<path d="M${f1(cx + w * 0.3)} ${f1(top + 40)} l40 -50" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${f1(cx + w * 0.3)} ${f1(top + 40)} l40 -50" stroke="${COP}" stroke-width="9" stroke-linecap="round"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - sr - 20 + i * sr)} ${f1(sy - sr - 16 - (i % 2) * 14)} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="#ffd76a" ${O(1.2)}/>`;
      g += port(k, cx, top + 90, 14, lv) + k.door(cx, B, 40 + lv * 3, 64 + lv * 4, '#2a1e3a');
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a4a');
      return g;
    },
  };

  const art = {
    K: {},
    back(k) {
      const { P, L } = k;
      let g = ''; for (let i = 0; i < 12; i++) { const x = 160 + i * 370; g += `<path d="M${x - 120} 724 Q${x - 60} ${660 - (i % 3) * 20} ${x} ${670 - (i % 2) * 20} Q${x + 70} ${660} ${x + 130} 724 Z" fill="#4a2e26"/><path d="M${x - 40} ${690} l20 -30 M${x + 20} 690 l10 -24" stroke="#6a3a2a" stroke-width="5"/>`; }
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 96 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, tinHouse(k, f, { door: false, noWin: true }).g + port(k, i % 2 ? a + 44 : x1 - 44, 792 - f.wall + 40, 13, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, '#3a2a24'));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + gear(k, lot.x0 + 10, 664, 10, BRASS);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 20), up: 100, lv: 2 };
      const g0 = tinHouse(k, f, { door: false, noWin: true }).g + port(k, c.v % 2 ? x0 + 40 : x1 - 40, 795 - f.wall + 40, 13, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, '#3a2a24');
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(270 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'irondeer') {

        let g = k.ell(x, y + 4, 120, 20) + `<rect x="${x - 100}" y="${y - 40}" width="200" height="40" fill="${IRON}" ${O(4)}/><path d="M${x - 92} ${y - 20} h184" stroke="${IRONL}" stroke-width="4" stroke-dasharray="2 18" stroke-linecap="round"/>`;
        g += `<path d="M${x - 60} ${y - 40} L${x - 54} ${y - 130} M${x - 30} ${y - 40} L${x - 34} ${y - 130} M${x + 34} ${y - 40} L${x + 30} ${y - 130} M${x + 60} ${y - 40} L${x + 56} ${y - 130}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${x - 60} ${y - 40} L${x - 54} ${y - 130} M${x - 30} ${y - 40} L${x - 34} ${y - 130} M${x + 34} ${y - 40} L${x + 30} ${y - 130} M${x + 60} ${y - 40} L${x + 56} ${y - 130}" stroke="${RUST}" stroke-width="10" stroke-linecap="round"/>`;
        g += `<path d="M${x - 76} ${y - 120} Q${x - 80} ${y - 190} ${x - 20} ${y - 196} H${x + 40} Q${x + 80} ${y - 190} ${x + 76} ${y - 120} Z" fill="${RUST}" ${O(4)}/><path d="M${x - 40} ${y - 190} V${y - 124} M${x} ${y - 196} V${y - 120} M${x + 40} ${y - 190} V${y - 124}" stroke="${RUSTD}" stroke-width="3"/>` + gear(k, x - 10, y - 156, 16, BRASS);
        g += `<path d="M${x + 50} ${y - 186} L${x + 76} ${y - 260} L${x + 110} ${y - 262} L${x + 130} ${y - 240} L${x + 96} ${y - 226} L${x + 76} ${y - 180} Z" fill="${RUST}" ${O(3.5)}/><circle cx="${x + 104}" cy="${y - 248}" r="4" fill="#ffd76a"/><path d="M${x + 84} ${y - 262} l-10 -16 l14 6 Z" fill="${RUSTD}" ${O(2)}/>`;
        const ant = (sx) => `M${x + 96} ${y - 262} q${sx * 10} -40 ${sx * 30} -70 M${x + 96 + sx * 16} ${y - 300} l${sx * 30} -10 M${x + 96 + sx * 24} ${y - 318} l${sx * 6} -30 M${x + 96 + sx * 8} ${y - 280} l${sx * -18} -20`;
        g += `<path d="${ant(-1)} ${ant(1)}" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="${ant(-1)} ${ant(1)}" stroke="${PAT}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
        g += `<path d="M${x - 76} ${y - 150} q-24 -4 -30 -24" stroke="${RUST}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
        return { g, w: 320, h: 380 };
      }
      if (p.k === 'scrap') return { g: k.ell(x, y, 50 * s, 10) + scrapPile(k, x, y, s), w: 120 * s, h: 70 * s, flat: true };
      if (p.k === 'gearpost') return { g: k.ell(x, y, 16, 5) + `<path d="M${x} ${y} V${y - 110}" stroke="${INK}" stroke-width="8"/><path d="M${x} ${y} V${y - 110}" stroke="${IRON}" stroke-width="4"/>` + gear(k, x, y - 120, 14, p.v % 2 ? BRASS : RUST), w: 70, h: 150 };
      if (p.k === 'wreck') return { g: k.ell(x, y, 56, 10) + `<path d="M${x - 56} ${y - 10} l10 -36 h80 l20 36 Z" fill="${RUST}" ${O(3)}/><path d="M${x - 40} ${y - 46} l10 -18 h40 l10 18" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="${x - 30}" cy="${y - 6}" r="14" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="${x + 34}" cy="${y - 4}" r="14" fill="${IRON}" ${O(3)}/><path d="M${x - 46} ${y - 30} h20" stroke="${PAT}" stroke-width="5"/>`, w: 130, h: 70, flat: true };
      return null;
    },
  };

  return {
    id: 'd85', ver: 1, name: 'Ржавовье', layout, art,
    story: 'Деревня жестянщиков на ржавой пустоши: дома из гофрированного железа с заклёпками и круглыми окнами, сводчатые кровли с флюгерами-шестернями, всюду груды лома. Внизу улица делает кольцо, а посреди кольца стоит Железный Олень - его сковали из лома первые жители, и он хранит пустошь.',
  };
});
