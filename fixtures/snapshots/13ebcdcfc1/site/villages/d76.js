



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const SLAG = '#2e2a32', SLAGL = '#4a4450', EMB = '#ff7a2a', EMBL = '#ffd76a', RUST = '#8a4a2a', RUSTD = '#5a2e1a', IRON = '#5a5662', STONE = '#6a6270', STONED = '#4a444e';
  const KINDS = { ancientforge: { foot: [120, 30], tall: 320 }, slagheap: { foot: [60, 18], tall: 70 }, ingots: { foot: [36, 10], tall: 50 }, brazier2: { foot: [20, 8], tall: 110 }, mask: { foot: [26, 10], tall: 120 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1270, x1: 1570 },
        trainer: { x0: 2830, x1: 3110 },
        magic: { x0: 3180, x1: 3410 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1700, x1: 1980, B: 1272 },
        tent: { x0: 2400, x1: 2750, B: 1282 },
        storage: { x0: 3500, x1: 3780, B: 1244 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'cross', w: 32, pts: [[2200, 1140], [2200, 1338]] },
        { k: 'lane', w: 34, pts: [[1500, 1338], [2200, 1340], [3000, 1332], [3640, 1312], [3990, 1200], [3990, 908]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1050, rx: 310, ry: 100, mark: 'ancientforge', ms: 1 }],
      water: [{ k: 'lava', e: [900, 1200, 150, 36] }, { k: 'lava', e: [1240, 1430, 120, 24] }, { k: 'lava', e: [3240, 1430, 140, 22] }, { k: 'lava', e: [560, 1060, 110, 26] }],
      kinds: KINDS,
      props: [['slagheap', 1300, 1120], ['slagheap', 1560, 1200], ['slagheap', 2900, 1180], ['ingots', 3300, 1140], ['brazier2', 1880, 1110], ['brazier2', 2520, 1110], ['mask', 1060, 1330], ['slagheap', 700, 1300]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 500, x1: 710, base: 1446 }, { x0: 2950, x1: 3150, base: 1300 }, { x0: 4100, x1: 4310, base: 1450 }],
      fill: [{ k: ['rock', 'slagheap', 'deadtree', 'rubble', 'brazier2'], n: 22, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'rubble'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1610, 1830], [2570, 2800], [3450, 3680], [3720, 4000]], ruins: [1880, 2520] },
    };
  }

   
  const blocks = (k, x0, top, w, B, lv) => k.use(k.sym('d76blk', () => { let g = ''; for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { const x = c * 30 + (r % 2 ? 15 : 0), y = r * 20; g += `<rect x="${x + 1}" y="${y + 1}" width="28" height="18" rx="3" fill="${(r * 3 + c) % 4 ? SLAG : SLAGL}"/>`; } return `<rect width="120" height="120" fill="${EMB}" opacity=".55"/>` + g; }), x0, top, w / 120, (B - top) / 120);
  function slagWall(k, x0, top, w, B, lv) {
    const { f1, O } = k, cid = k.clipId(`d76w${f1(x0)}${f1(top)}`);
    return `<clipPath id="${cid}"><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}"/></clipPath><g clip-path="url(#${cid})">${blocks(k, x0, top, Math.max(w, B - top), top + Math.max(w, B - top), lv)}</g><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}" fill="none" ${O()}/><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(Math.min(30, (B - top) * 0.3))}" fill="url(#tgShade)"/>`;
  }
  function ironRoof(k, x0, x1, top, h, lv) {
    const { f1 } = k, cx = (x0 + x1) / 2;
    let g = k.roof(x0, x1, top, h, 'iron', lv <= 1 ? '#4a3a34' : RUST, false, RUSTD);
    if (lv >= 3) g += `<path d="M${f1(x0 - 14)} ${top + 2} H${f1(x1 + 14)}" stroke="${IRON}" stroke-width="6"/>`;
    if (lv >= 4) g += mask(k, cx, top - h * 0.44, 0.7 + lv * 0.05, lv >= 5);
    return g;
  }

  const mask = (k, x, y, s, gold) => k.use(k.sym(gold ? 'd76maskG' : 'd76mask', () => { const { O } = k; return `<path d="M-20 -24 Q0 -34 20 -24 L22 6 Q14 30 0 32 Q-14 30 -22 6 Z" fill="${gold ? k.GOLD : STONE}" ${O(2.5)}/><path d="M-14 -6 h10 M4 -6 h10" stroke="${EMB}" stroke-width="5" stroke-linecap="round"/><path d="M-3 0 v12 h6" stroke="${STONED}" stroke-width="3" fill="none"/><path d="M-10 20 h20" stroke="${STONED}" stroke-width="3"/><path d="M-20 -24 Q0 -34 20 -24 L18 -16 Q0 -24 -18 -16 Z" fill="${STONED}"/>`; }), x, y, s);
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return `<rect x="${f1(x - 5)}" y="${f1(y - 5)}" width="${f1(w + 10)}" height="${f1(h + 10)}" rx="3" fill="${IRON}" ${O(2.5)}/>` + k.winLit(x, y, w, h, true) + (lv >= 2 ? `<path d="M${f1(x)} ${f1(y + h * 0.5)} h${f1(w)} M${f1(x + w / 2)} ${f1(y)} v${f1(h)}" stroke="${IRON}" stroke-width="3"/>` : '');
  }

  function slagHouse(k, f, o = {}) {
    const { f1 } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([56, 68, 80, 90, 98][lv - 1], f.up - 10, w * 0.42));
    let g = '';
    if (o.chim !== false && lv >= 2) { const chx = o.chimX != null ? o.chimX : x1 - 34, ch = 60 + lv * 14; g += k.chimney(chx, top - rh * 0.5 - ch, 22 + lv * 2, ch + rh * 0.5, Math.max(2, lv), SLAGL) + `<circle cx="${f1(chx + 12)}" cy="${f1(top - rh * 0.5 - ch - 8)}" r="9" fill="${EMB}" opacity=".7"/>`; }
    g += slagWall(k, x0, top, w, B, lv) + ironRoof(k, x0, x1, top, rh, lv);
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [28, 34, 38, 42, 46][lv - 1], wy = top + Math.max(18, (f.wall - wh) * 0.34);
    if (!o.noWin) for (const x of [x0 + 20, x1 - 20 - ww]) if (Math.abs(x + ww / 2 - cx) > 56 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, '#3a2a24', 0.92);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || '#3a2a24');
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }

  const ingots = (k, x, y, n) => { const { f1, O } = k; let g = ''; let i = 0; for (let r = 0; r < 3 && i < n; r++) for (let c = 0; c < 3 - r && i < n; c++, i++) { const ix = x - (2 - r) * 14 + c * 28, iy = y - r * 12; g += `<path d="M${f1(ix - 12)} ${f1(iy)} l4 -11 h16 l4 11 Z" fill="${i % 3 ? '#a8a4b0' : '#d8a050'}" ${O(1.8)}/>`; } return g; };

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 36], [cx + ow / 2 + 36, x1]]) if (b - a > 12) g += slagWall(k, a, B - 60, b - a, B, lv) + `<path d="M${f1(a)} ${B - 60} H${f1(b)}" stroke="${IRON}" stroke-width="7"/>`;
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 20); g += slagWall(k, px - 22, B - ph, 44, B, lv) + `<rect x="${f1(px - 28)}" y="${f1(B - ph - 10)}" width="56" height="12" fill="${IRON}" ${O(3)}/>`; if (lv >= 3) g += `<path d="M${f1(px - 14)} ${f1(B - ph - 10)} l4 -16 h20 l4 16 Z" fill="${IRON}" ${O(2.5)}/><path d="M${f1(px - 10)} ${f1(B - ph - 26)} q10 -30 20 0 q-4 -12 -10 -4 q-6 -10 -10 4" fill="${EMB}" stroke="#c8402a" stroke-width="2"/>`; }
      const by = B - ph + 20;
      g += `<rect x="${f1(cx - ow / 2 - 2)}" y="${f1(by)}" width="${f1(ow + 4)}" height="20" fill="${IRON}" ${O(3.5)}/><path d="M${f1(cx - ow / 2 + 8)} ${f1(by + 10)} h${f1(ow - 16)}" stroke="#7a7684" stroke-width="2" stroke-dasharray="2 14"/>` + mask(k, cx, by - 18, 1 + lv * 0.06, lv >= 5);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 34;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${RUSTD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, EMBL);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = slagHouse(k, f, { sign: 'РАТУША', signBg: '#5a1a14', chimX: f.x0 + 14 });
      let g = h.g;
      const ty = h.top - h.rh + 6, tw = 18 + lv * 3;
      g += `<rect x="${f1(h.cx - tw)}" y="${f1(ty - 50)}" width="${f1(tw * 2)}" height="50" fill="${IRON}" ${O(3)}/><path d="M${f1(h.cx - 9)} ${f1(ty - 40)} q9 -5 18 0 l3 18 h-24 Z" fill="${lv >= 5 ? k.GOLD : '#c89a4a'}" ${O(2)}/><path d="M${f1(h.cx - tw - 8)} ${f1(ty - 48)} L${f1(h.cx)} ${f1(ty - 82 - lv * 4)} L${f1(h.cx + tw + 8)} ${f1(ty - 48)} Z" fill="${RUST}" ${O(3)}/>`;
      if (lv >= 2) for (const s of [-1, 1]) g += mask(k, h.cx + s * 62, h.B - 110, 0.6);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = slagHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14' });
      let g = h.g;
      for (let i = 0; i < 1 + Math.min(lv, 3); i++) { const sx = f.x1 + 16 + i * 16; g += `<path d="M${f1(sx)} ${h.B} V${h.B - 90}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${h.B} V${h.B - 90}" stroke="#8a6a44" stroke-width="3"/><rect x="${f1(sx - 12)}" y="${h.B - 104}" width="24" height="16" rx="3" fill="${IRON}" ${O(2)}/>`; }
      if (lv >= 2) { const bx = f.x0 - 38; g += `<path d="M${f1(bx)} ${h.B} V${h.B - 40}" stroke="${INK}" stroke-width="7"/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="34" fill="${IRON}" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="20" fill="none" stroke="${EMB}" stroke-width="4"/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="6" fill="${EMB}"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${SLAG}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${IRON}" ${O(4)}/>`;
      let rv = ''; for (let x = x0 + 16; x < x1 - 10; x += 22) rv += `M${f1(x)} ${f1(by0 + 8)} h1 M${f1(x)} ${f1(by1 - 8)} h1`; g += `<path d="${rv}" stroke="#8a8694" stroke-width="5" stroke-linecap="round"/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = by0 + 18 + Math.floor(i / 3) * 52; g += `<path d="M${f1(nx)} ${f1(ny)} h${f1(w / 5)} M${f1(nx)} ${f1(ny + 12)} h${f1(w / 7)} M${f1(nx)} ${f1(ny + 24)} h${f1(w / 6)}" stroke="#e8e4f0" stroke-width="3" opacity=".75"/>`; }
      g += `<path d="M${f1(x0 - 4)} ${f1(top)} H${f1(x1 + 4)} L${f1(x1 - 10)} ${f1(top - 20 - lv * 4)} H${f1(x0 + 10)} Z" fill="${RUST}" ${O(3)}/>` + (lv >= 3 ? mask(k, cx, top - 12 - lv * 2, 0.6, lv >= 5) : '');
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, '#3a2a24');
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = slagWall(k, x0, top + 20, w, B, lv) + `<rect x="${f1(x0 + 16)}" y="${f1(top + 40)}" width="${f1(w - 32)}" height="${f1(f.wall - 40)}" fill="#1e1a20" ${O(3)}/>`;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) g += ingots(k, x0 + 46 + (i % 3) * (w - 80) / 2, B - 6 - Math.floor(i / 3) * 40, lv >= 5 && i === 0 ? 6 : 3 + (i % 3));
      g += ironRoof(k, x0 - 4, x1 + 4, top + 20, Math.min(f.up - 10, 50 + lv * 10), lv);
      if (lv >= 2) g += `<path d="M${f1(x1 + 14)} ${B} V${f1(top - 30)} H${f1(x1 - 40)}" stroke="${INK}" stroke-width="9" fill="none"/><path d="M${f1(x1 + 14)} ${B} V${f1(top - 30)} H${f1(x1 - 40)}" stroke="${IRON}" stroke-width="5" fill="none"/><path d="M${f1(x1 - 30)} ${f1(top - 30)} v40 q0 12 10 12" stroke="#8a8694" stroke-width="4" fill="none"/>`;
      k.signId('storage'); g += k.signLv(cx, top + 4, Math.min(w - 10, 130), 'СКЛАД', lv, 19, '#3a2a24');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const h = slagHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      let g = h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="${EMB}"/>`;
      g += ingots(k, f.x1 - 50, h.B - 4, Math.min(lv + 2, 6));
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(a)} ${B} L${f1(a + (b - a) * 0.1)} ${f1(t + h * 0.3)} L${f1(m)} ${f1(t)} L${f1(b - (b - a) * 0.1)} ${f1(t + h * 0.3)} L${f1(b)} ${B} Z" fill="#6a605c" ${O()}/><path d="M${f1(a + (b - a) * 0.1)} ${f1(t + h * 0.3)} L${f1(m)} ${f1(t)} L${f1(b - (b - a) * 0.1)} ${f1(t + h * 0.3)}" stroke="${IRON}" stroke-width="7" fill="none"/>`;
        s += `<path d="M${f1(a + 10)} ${f1(B - h * 0.3)} Q${f1(m)} ${f1(B - h * 0.4)} ${f1(b - 10)} ${f1(B - h * 0.3)}" stroke="#4a4240" stroke-width="10" fill="none" opacity=".6"/>`;
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 10)}" r="8" fill="${k.GOLD}" ${O(2)}/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 40 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} V${f1(B - 86 - lv * 4)} H${f1(cx + 30)} V${B} Z" fill="#1e1a1a" ${O(3)}/><path d="M${f1(x1 + 6)} ${B} l6 -40 h28 l6 40" fill="${IRON}" ${O(2.5)}/><path d="M${f1(x1 + 14)} ${B - 40} q12 -36 24 0" fill="${EMB}" stroke="#c8402a" stroke-width="2"/>`;
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#3a2a24');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = slagHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${RUST}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${IRON}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 36))); i < n; i++) { const px = ax0 + 22 + i * 36; g += i % 2 ? `<path d="M${f1(px)} ${f1(ay + 30)} v44" stroke="#8a6a44" stroke-width="4"/><path d="M${f1(px - 16)} ${f1(ay + 36)} q16 -12 32 0" stroke="${IRON}" stroke-width="6" fill="none"/>` : `<path d="M${f1(px)} ${f1(ay + 30)} v44" stroke="#8a6a44" stroke-width="4"/><rect x="${f1(px - 10)}" y="${f1(ay + 28)}" width="20" height="14" rx="2" fill="${IRON}" ${O(2)}/>`; }
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${SLAGL}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(3, lv + 1); i++) { const bx = ax0 + 26 + i * 40; g += `<path d="M${f1(bx - 16)} ${h.B - 30} l-3 -20 h38 l-3 20 Z" fill="#6a4a30" ${O(2)}/>` + [[-8, -52], [4, -56], [10, -50]].map(([dx, dy]) => `<circle cx="${f1(bx + dx)}" cy="${h.B + dy}" r="6" fill="${i % 2 ? '#a86a3a' : '#8a8494'}" ${O(1.5)}/>`).join(''); }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, hh = Math.min(f.wall + f.up - 40, f.wall + 30 + lv * 10);
      const cid = k.clipId('d76mg');
      const d = `M${f1(x0 - 10)} ${B} Q${f1(x0 - 14)} ${f1(B - hh)} ${f1(cx)} ${f1(B - hh)} Q${f1(x1 + 14)} ${f1(B - hh)} ${f1(x1 + 10)} ${B} Z`;
      let g = `<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">${blocks(k, x0 - 20, B - hh, w + 40, B - hh + w + 40, lv)}</g><path d="${d}" fill="none" ${O()}/>`;
      for (let i = 1; i < 5; i++) { const y = B - hh * i / 5; g += `<path d="M${f1(cx - Math.sqrt(1 - (i / 5) ** 2) * (w / 2 + 12))} ${f1(y)} H${f1(cx + Math.sqrt(1 - (i / 5) ** 2) * (w / 2 + 12))}" stroke="${SLAGL}" stroke-width="3"/>`; }
      g += `<path d="M${f1(cx - 34)} ${B} V${f1(B - 60)} A34 34 0 0 1 ${f1(cx + 34)} ${f1(B - 60)} V${B} Z" fill="${EMB}" ${O(3)}/><path d="M${f1(cx - 22)} ${B} V${f1(B - 54)} A22 22 0 0 1 ${f1(cx + 22)} ${f1(B - 54)} V${B} Z" fill="${EMBL}"/>`;
      const orbs = ['#7ac8ff', '#b8a2ff', '#8affc8', '#ff8ac8', '#ffd76a'];
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const ox = x0 + 8 + i * (w - 16) / (1 + Math.min(lv, 3)), oy = B - hh * 0.55 + (i % 2) * 18; g += `<circle cx="${f1(ox)}" cy="${f1(oy)}" r="16" fill="${orbs[i]}" opacity=".25"/><circle cx="${f1(ox)}" cy="${f1(oy)}" r="9" fill="${orbs[i]}" ${O(2)}/><circle cx="${f1(ox - 3)}" cy="${f1(oy - 3)}" r="2.5" fill="#fff"/>`; }
      g += `<rect x="${f1(cx + w * 0.18)}" y="${f1(B - hh - 30)}" width="18" height="40" fill="${SLAGL}" ${O(2.5)}/><circle cx="${f1(cx + w * 0.18 + 9)}" cy="${f1(B - hh - 40)}" r="10" fill="${EMB}" opacity=".6"/>`;
      if (lv >= 5) g += k.orb(cx, B - hh - 6, 9);
      k.signId('magic'); g += k.signLv(cx, B - hh * 0.3 - 46, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a5a');
      return g;
    },
  };

  const art = {
    K: {},

    back(k) {
      const { P, L } = k;
      let g = '';
      for (const [x, h, w] of [[700, 120, 160], [1900, 160, 200], [2500, 140, 170], [3600, 110, 150]]) g += `<path d="M${x - w / 2} 720 L${x - w * 0.25} ${720 - h} H${x + w * 0.25} L${x + w / 2} 720 Z" fill="#3a3036" opacity=".85"/><path d="M${x - w * 0.25} ${720 - h} l10 -16 l12 10 l14 -20 l10 26" fill="#3a3036" opacity=".85"/><ellipse cx="${x}" cy="${712 - h * 0.4}" rx="${w * 0.08}" ry="${h * 0.12}" fill="${EMB}" opacity=".5"/>`;
      for (let i = 0; i < 10; i++) { const x = 100 + i * 440; g += `<path d="M${x - 120} 724 Q${x} ${660 - (i % 3) * 14} ${x + 120} 724 Z" fill="#2a2228"/>`; }
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, slagHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 24, 28, 32, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, '#3a2a24'));
      });

      for (const x of k.L.hx.ruins || []) k.P(x - 80, x + 80, `<path d="M${x - 70} 792 L${x - 50} 640 L${x - 30} 660 L${x - 10} 610 L${x + 20} 640 L${x + 50} 620 L${x + 70} 792 Z" fill="${STONED}" ${k.O(3.5)}/><path d="M${x - 40} 700 h70 M${x - 50} 750 h96" stroke="${STONE}" stroke-width="5"/><ellipse cx="${x}" cy="770" rx="22" ry="18" fill="#2a1a14" ${k.O(2.5)}/>` + mask(k, x, 690, 0.8));
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + mask(k, lot.x0 + 10, 664, 0.6);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = slagHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 24, 30, 32, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, '#3a2a24');
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(280 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'ancientforge') {

        let g = k.ell(x, y + 4, 150, 26);
        for (const dx of [-120, 120]) g += `<path d="M${x + dx - 40} ${y + 4} Q${x + dx} ${y - 40} ${x + dx + 40} ${y + 4} Z" fill="${SLAG}" ${O(3)}/><path d="M${x + dx - 20} ${y - 14} l8 -6 l6 4" stroke="${EMB}" stroke-width="3" fill="none"/>`;
        g += `<path d="M${x - 100} ${y} L${x - 60} ${y - 290} H${x + 60} L${x + 100} ${y} Z" fill="${STONE}" ${O(4.5)}/>`;
        let d = ''; for (let i = 1; i < 6; i++) { const yy = y - i * 50, hw = 100 - i * 40 / 6 * 1.0 - i * 6; d += `M${f1(x - hw)} ${yy} H${f1(x + hw)}`; } g += `<path d="${d}" stroke="${STONED}" stroke-width="4"/>`;
        g += `<rect x="${x - 70}" y="${y - 306}" width="140" height="20" rx="4" fill="${STONED}" ${O(3)}/><ellipse cx="${x}" cy="${y - 306}" rx="54" ry="10" fill="${EMB}"/><circle cx="${x}" cy="${y - 330}" r="40" fill="url(#tgGlow)" opacity=".6"/>`;
        g += mask(k, x - 46, y - 190, 1.1) + mask(k, x + 46, y - 190, 1.1) + mask(k, x, y - 236, 1.25);
        g += `<path d="M${x - 40} ${y} V${y - 70} A40 40 0 0 1 ${x + 40} ${y - 70} V${y} Z" fill="#2a1410" ${O(3.5)}/><path d="M${x - 28} ${y} V${y - 64} A28 28 0 0 1 ${x + 28} ${y - 64} V${y} Z" fill="${EMB}"/><path d="M${x - 16} ${y} V${y - 56} A16 16 0 0 1 ${x + 16} ${y - 56} V${y} Z" fill="${EMBL}"/>`;
        for (const sx of [-1, 1]) g += `<path d="M${x + sx * 84} ${y - 50} l${sx * 50} 20" stroke="#8a5a3a" stroke-width="14" stroke-linecap="round"/><path d="M${x + sx * 84} ${y - 50} l${sx * 50} 20" stroke="#a87a4a" stroke-width="8" stroke-linecap="round"/><path d="M${x + sx * 134} ${y - 30} l${sx * 30} -20 l${sx * 10} 30 Z" fill="#6a4a30" ${O(2.5)}/>`;
        return { g, w: 360, h: 380 };
      }
      if (p.k === 'slagheap') { const g = `<path d="M${f1(x - 60 * s)} ${y} Q${f1(x - 30 * s)} ${f1(y - 70 * s)} ${x} ${f1(y - 70 * s)} Q${f1(x + 30 * s)} ${f1(y - 70 * s)} ${f1(x + 60 * s)} ${y} Z" fill="${SLAG}" ${O(3)}/><path d="M${f1(x - 20 * s)} ${f1(y - 50 * s)} l10 -6 M${f1(x + 14 * s)} ${f1(y - 40 * s)} l8 4 M${f1(x - 30 * s)} ${f1(y - 20 * s)} l12 -4" stroke="#8a8aa8" stroke-width="3"/><path d="M${f1(x - 8 * s)} ${f1(y - 14 * s)} q8 -10 16 0" stroke="${EMB}" stroke-width="3" fill="none"/>`; return { g, w: 140 * s, h: 80 * s, flat: true }; }
      if (p.k === 'ingots') return { g: k.ell(x, y, 36, 8) + ingots(k, x, y, 6), w: 90, h: 50, flat: true };
      if (p.k === 'brazier2') return { g: k.ell(x, y, 20, 6) + `<path d="M${x} ${y} V${y - 70} M${x - 16} ${y} l16 -30 l16 30" stroke="${INK}" stroke-width="7" fill="none"/><path d="M${x} ${y} V${y - 70}" stroke="${IRON}" stroke-width="3.5"/><path d="M${x - 22} ${y - 70} h44 l-8 16 h-28 Z" fill="${IRON}" ${O(2.5)}/><circle cx="${x}" cy="${y - 90}" r="34" fill="url(#tgGlow)" opacity=".5"/><path d="M${x - 14} ${y - 72} q14 -44 28 0 q-6 -20 -14 -6 q-8 -16 -14 6" fill="${EMB}" stroke="#c8402a" stroke-width="2"/>`, w: 80, h: 120 };
      if (p.k === 'mask') return { g: k.ell(x, y, 26, 7) + `<path d="M${x - 20} ${y} V${y - 50} H${x + 20} V${y} Z" fill="${STONED}" ${O(3)}/>` + mask(k, x, y - 80, 1.2), w: 70, h: 120 };
      return null;
    },
  };

  return {
    id: 'd76', ver: 1, name: 'Пеплень', layout, art,
    story: 'Деревня плавильщиков среди древних шлаковых отвалов: дома из чёрного шлакового кирпича, швы светятся жаром, крыши из ржавого листа. Улица у ворот разливается в площадь с Печью Предков - древней домницей с ликами пращуров, она до сих пор тёплая, а ниже лежит поле отвалов и лавовых луж.',
  };
});
