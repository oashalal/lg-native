



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ST = '#5a5258', STD = '#3a343a', STL = '#7a727a', TILE = '#7a2a22', TILED = '#4a1a14', EMB = '#ff7a2a', EMBL = '#ffd76a', CLOTH = '#e8dcc0';
  const CLANS = ['#c8402a', '#e0a43a', '#3a6aa8', '#4f8a3a', '#8a3a8a', '#e8e0d0', '#2f8a8a', '#c86a9a', '#1e1a22'];
  const C = [2200, 1290], RX = 400, RY = 140;
  const KINDS = { ashaltar: { foot: [70, 22], tall: 200 }, bonfire: { foot: [30, 10], tall: 150 }, clanpole: { foot: [14, 6], tall: 170 }, embers: { foot: [30, 10], tall: 40 } };

  function layout() {
    const fires = []; for (let i = 0; i < 9; i++) { const a = (10 + i * 40) * Math.PI / 180; fires.push(['bonfire', Math.round(C[0] + Math.cos(a) * RX), Math.round(C[1] + Math.sin(a) * RY), 1.5, { clan: i }]); }
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1260, x1: 1460 },
        trainer: { x0: 2900, x1: 3180 },
        magic: { x0: 3250, x1: 3480 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1520, x1: 1760, B: 1180 },
        tent: { x0: 2620, x1: 2840, B: 1180 },
        storage: { x0: 3550, x1: 3830, B: 1200 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'cross', w: 32, pts: [[2200, 912], [2200, 1200]] },
        { k: 'lane', w: 34, pts: [[1250, 908], [1300, 1100], [1400, 1270], [1740, 1270]] },
        { k: 'lane', w: 34, pts: [[2660, 1270], [3000, 1272], [3670, 1290], [3990, 1250], [3990, 908]] },
      ],
      plazas: [{ k: 'central', x: C[0], y: C[1], rx: 300, ry: 108, mark: 'ashaltar', ms: 1.3 }],
      water: [{ k: 'lava', e: [700, 1250, 150, 30] }, { k: 'lava', e: [3300, 1430, 130, 22] }],
      kinds: KINDS,
      props: [...fires, ['clanpole', 1500, 1180], ['clanpole', 2920, 1190], ['embers', 1100, 1380], ['clanpole', 900, 1090]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 460, x1: 670, base: 1446 }, { x0: 1240, x1: 1440, base: 1452 }, { x0: 2950, x1: 3150, base: 1452 }, { x0: 4100, x1: 4310, base: 1450 }],
      fill: [{ k: ['rock', 'deadtree', 'rubble', 'embers', 'clanpole'], n: 20, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'rubble'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1540, 1760], [1810, 2030], [2370, 2590], [2640, 2860], [3530, 3750], [3790, 4000]] },
    };
  }

   
  const sign9 = ['M0 -8 L7 6 H-7 Z', 'M-7 -7 L7 7 M7 -7 L-7 7', 'M0 -8 V8 M-8 0 H8', 'M-6 -6 h12 v12 h-12 Z', 'M0 -8 a8 8 0 1 0 0.1 0', 'M-8 4 L0 -6 L8 4', 'M-7 -4 h14 M-7 4 h14', 'M0 -8 L8 0 L0 8 L-8 0 Z', 'M-6 8 V-8 L6 0 Z'];
  const banner = (k, x, B, h, i, s = 1) => { const { f1, O, INK } = k, c = CLANS[i % 9]; return `<path d="M${f1(x)} ${f1(B)} V${f1(B - h)}" stroke="${INK}" stroke-width="${f1(7 * s)}"/><path d="M${f1(x)} ${f1(B)} V${f1(B - h)}" stroke="#8a6a44" stroke-width="${f1(3.5 * s)}"/><path d="M${f1(x)} ${f1(B - h + 6)} h${f1(40 * s)} v${f1(56 * s)} l${f1(-20 * s)} ${f1(-12 * s)} l${f1(-20 * s)} ${f1(12 * s)} Z" fill="${c}" ${O(2.5)}/><path d="${sign9[i % 9]}" transform="translate(${f1(x + 20 * s)} ${f1(B - h + 30 * s)}) scale(${f2(s)})" stroke="${i % 9 === 5 ? INK : CLOTH}" stroke-width="2.5" fill="none"/>`; function f2(v) { return (+v).toFixed(2); } };
  function hearth(k, x, top, h, lv) {
    const { f1, O } = k;
    return `<path d="M${f1(x - 22)} ${f1(top + h)} L${f1(x - 10)} ${f1(top)} H${f1(x + 10)} L${f1(x + 22)} ${f1(top + h)} Z" fill="${STL}" ${O(3)}/><path d="M${f1(x - 18)} ${f1(top + h * 0.5)} h36 M${f1(x - 14)} ${f1(top + h * 0.25)} h28" stroke="${STD}" stroke-width="3"/><path d="M${f1(x - 8)} ${f1(top)} q8 -${18 + lv * 4} 16 0 q-3 -8 -8 -3 q-5 -6 -8 3" fill="${EMB}" stroke="#c8402a" stroke-width="2"/><circle cx="${f1(x)}" cy="${f1(top - 8)}" r="18" fill="${EMB}" opacity=".2"/>`;
  }
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return `<path d="M${f1(x - 5)} ${f1(y + h + 5)} V${f1(y + w / 2)} A${f1(w / 2 + 5)} ${f1(w / 2 + 5)} 0 0 1 ${f1(x + w + 5)} ${f1(y + w / 2)} V${f1(y + h + 5)} Z" fill="${STD}" ${O(2.5)}/>` + k.winLit(x, y, w, h, true, true) + (lv >= 3 ? `<path d="M${f1(x - 8)} ${f1(y + h + 8)} h${f1(w + 16)}" stroke="${STL}" stroke-width="6"/>` : '');
  }

  function clanHouse(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([56, 68, 80, 90, 98][lv - 1], f.up - 10, w * 0.42));
    let g = hearth(k, o.hx != null ? o.hx : x1 - 34, top - rh * 0.5 - 40 - lv * 8, 40 + lv * 8 + rh * 0.5, lv);
    g += k.wall(x0, top, w, B, 'stone') + `<rect x="${x0}" y="${top}" width="${w}" height="${f.wall}" fill="${STD}" opacity=".35"/>` + k.roof(x0, x1, top, rh, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#6a5a4a' : TILE, false, TILED);
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [32, 38, 42, 46, 50][lv - 1], wy = top + Math.max(20, (f.wall - wh) * 0.34);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, '#3a2420', 0.92);
    if (o.clan != null && lv >= 2) g += banner(k, o.bx != null ? o.bx : x0 - 16, B, 150 + lv * 6, o.clan, 0.9);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || '#3a2420');
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }
  function fire(k, x, y, s, clan) {
    const { f1, O } = k, c = CLANS[clan % 9];
    let g = `<ellipse cx="${x}" cy="${y}" rx="${f1(34 * s)}" ry="${f1(10 * s)}" fill="#2a2228"/><circle cx="${x}" cy="${f1(y - 40 * s)}" r="${f1(50 * s)}" fill="url(#tgGlow)" opacity=".6"/>`;
    for (let i = 0; i < 7; i++) { const a = i * Math.PI / 3.5; g += `<ellipse cx="${f1(x + Math.cos(a) * 26 * s)}" cy="${f1(y + Math.sin(a) * 7 * s)}" rx="${f1(9 * s)}" ry="${f1(6 * s)}" fill="${ST}" ${O(2)}/>`; }
    g += `<path d="M${f1(x - 22 * s)} ${f1(y - 2)} l${f1(44 * s)} ${f1(-12 * s)} M${f1(x - 20 * s)} ${f1(y - 12 * s)} l${f1(40 * s)} ${f1(10 * s)}" stroke="#6a4a30" stroke-width="${f1(7 * s)}" stroke-linecap="round"/>`;
    g += `<path d="M${f1(x - 20 * s)} ${f1(y - 8 * s)} q${f1(20 * s)} ${f1(-90 * s)} ${f1(40 * s)} 0 q${f1(-8 * s)} ${f1(-34 * s)} ${f1(-20 * s)} ${f1(-12 * s)} q${f1(-12 * s)} ${f1(-26 * s)} ${f1(-20 * s)} ${f1(12 * s)}" fill="${EMB}" stroke="#c8402a" stroke-width="2"/><path d="M${f1(x - 10 * s)} ${f1(y - 10 * s)} q${f1(10 * s)} ${f1(-46 * s)} ${f1(20 * s)} 0" fill="${EMBL}"/>`;
    return g + banner(k, x + 30 * s, y, 130 * s, clan, 0.75 * s);
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) g += k.wall(a, B - 56, b - a, B, 'rubble');
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += k.wall(px - 16, B - ph, 32, B, 'stone') + (lv >= 2 ? hearth(k, px, B - ph - 40, 40, lv) : ''); }
      const by = B - ph + 30;
      g += `<path d="M${f1(cx - ow / 2 - 4)} ${f1(by)} H${f1(cx + ow / 2 + 4)}" stroke="${INK}" stroke-width="14"/><path d="M${f1(cx - ow / 2 - 4)} ${f1(by)} H${f1(cx + ow / 2 + 4)}" stroke="#6a4a30" stroke-width="8"/>`;
      const n = Math.min(9, 3 + lv * 2); for (let i = 0; i < n; i++) { const x = cx - ow / 2 + 6 + i * (ow - 12) / Math.max(1, n - 1); g += `<path d="M${f1(x - 5)} ${f1(by + 6)} h10 v22 l-5 -5 l-5 5 Z" fill="${CLANS[i]}" ${O(1.5)}/>`; }
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(by - 18)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 40;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${TILED}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, EMBL);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = clanHouse(k, f, { sign: 'РАТУША', signBg: '#5a1a14', hx: f.x0 + 30 });
      let g = h.g;
      const n = Math.min(9, 1 + lv * 2);
      for (let i = 0; i < n; i++) { const t = (i + 1) / (n + 1), x = f.x0 + (f.x1 - f.x0) * t, y = h.top - h.rh * (1 - Math.abs(t - 0.5) * 2) - 4; g += `<path d="M${f1(x)} ${f1(y)} v-26" stroke="${k.INK}" stroke-width="2.5"/><path d="M${f1(x)} ${f1(y - 26)} h14 v12 h-14 Z" fill="${CLANS[i]}" ${O(1.5)}/>`; }
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = clanHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14', clan: 0, bx: f.x1 + 70 });
      let g = h.g;
      for (let i = 0; i < 1 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} V${h.B - 120}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${h.B} V${h.B - 120}" stroke="#8a6a44" stroke-width="3"/><path d="M${f1(sx - 5)} ${h.B - 120} l5 -18 l5 18 Z" fill="#9a9eac" ${O(1.5)}/>`; }
      if (lv >= 2) { const bx = f.x0 - 34; g += `<circle cx="${f1(bx)}" cy="${h.B - 60}" r="32" fill="#8a6a44" ${O(3)}/>` + CLANS.slice(0, 8).map((c, i) => { const a = i * Math.PI / 4; return `<path d="M${f1(bx)} ${h.B - 60} L${f1(bx + Math.cos(a) * 28)} ${f1(h.B - 60 + Math.sin(a) * 28)} A28 28 0 0 1 ${f1(bx + Math.cos(a + Math.PI / 4) * 28)} ${f1(h.B - 60 + Math.sin(a + Math.PI / 4) * 28)} Z" fill="${c}"/>`; }).join('') + `<circle cx="${f1(bx)}" cy="${h.B - 60}" r="8" fill="${CLOTH}" ${O(2)}/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0 + 6, top + 10, w - 12, B - 40, 'stone') + `<rect x="${f1(x0)}" y="${B - 40}" width="${f1(w)}" height="40" fill="${STD}" ${O(3)}/>`;
      for (let i = 0; i < 9; i++) g += `<path d="${sign9[i]}" transform="translate(${f1(x0 + 20 + i * (w - 40) / 8)} ${f1(top + 26)}) scale(.8)" stroke="${CLANS[i] === '#1e1a22' ? '#e8e0d0' : CLANS[i]}" stroke-width="3" fill="none"/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = top + 48 + Math.floor(i / 3) * 50, nw = Math.min(50, (w - 56) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.86)}" fill="#e8dcc0" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      if (lv >= 3) g += hearth(k, cx, top - 40, 50, lv);
      k.signId('board'); g += k.signLv(cx, B - 20, Math.min(w - 10, 140), 'ДОСКА', lv, 20, '#3a2420');
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0, top, w, B, 'stone') + `<rect x="${x0}" y="${top}" width="${w}" height="${f.wall}" fill="${STD}" opacity=".35"/>` + k.roof(x0, x1, top, Math.min(f.up - 10, 56 + lv * 10), 'shingle', TILE, false, TILED);
      g += k.door(cx, B, 70 + lv * 4, Math.min(f.wall - 30, 80 + lv * 6), '#3a2420');
      for (const [a, n] of [[x0 - 60, Math.min(lv + 1, 4)], [x1 + 8, lv >= 4 ? 3 : 0]]) for (let i = 0; i < n; i++) for (let r = 0; r < 2; r++) g += `<circle cx="${f1(a + 10 + i * 14 + r * 7)}" cy="${f1(B - 10 - r * 14)}" r="7" fill="#a87a4a" stroke="#3a2a1e" stroke-width="2"/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - 20)}" r="10" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx, top + 24, Math.min(w - 10, 130), 'СКЛАД', lv, 19, '#3a2420');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const h = clanHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      let g = h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="${EMB}"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(mx + mw + 28 + i * 26)} ${h.B - 40} v-50" stroke="#5a5662" stroke-width="4"/><path d="${sign9[i]}" transform="translate(${f1(mx + mw + 28 + i * 26)} ${h.B - 96}) scale(.7)" stroke="#5a5662" stroke-width="4" fill="none"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h, wall = h * 0.45;
        let s = `<rect x="${f1(a)}" y="${f1(B - wall)}" width="${f1(b - a)}" height="${f1(wall)}" fill="${CLOTH}" ${O()}/><path d="M${f1(a - 8)} ${f1(B - wall + 4)} Q${f1(m)} ${f1(t - 10)} ${f1(b + 8)} ${f1(B - wall + 4)} Z" fill="#c8b890" ${O()}/>`;
        for (let i = 0; i < 9; i++) s += `<rect x="${f1(a + (b - a) * i / 9)}" y="${f1(B - wall * 0.6)}" width="${f1((b - a) / 9 + 0.5)}" height="10" fill="${CLANS[i]}"/>`;
        s += `<rect x="${f1(a)}" y="${f1(B - wall * 0.6)}" width="${f1(b - a)}" height="10" fill="none" stroke="#1e1a22" stroke-width="2"/><circle cx="${f1(m)}" cy="${f1(t + h * 0.12)}" r="8" fill="${gold ? k.GOLD : '#6a4a30'}" ${O(2)}/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.6, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.56, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 40 + lv * 10), lv >= 5) + k.door(cx, B, 44 + lv * 2, 60 + lv * 3, '#6a2a1a');
      k.signId('tent'); g += k.signLv(cx, top + 50, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#3a2420');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = clanHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true, hx: x0 + 30 });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${TILE}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="#6a4a30" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 30))); i < n; i++) g += `<rect x="${f1(ax0 + 10 + i * 30)}" y="${f1(ay + 24)}" width="24" height="44" fill="${CLANS[i]}" ${O(2)}/><path d="M${f1(ax0 + 14 + i * 30)} ${f1(ay + 34)} h16 M${f1(ax0 + 14 + i * 30)} ${f1(ay + 56)} h16" stroke="${CLOTH}" stroke-width="2"/>`;
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${STD}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(3, lv + 1); i++) g += `<path d="M${f1(ax0 + 20 + i * 36)} ${h.B - 30} q0 -14 14 -14 q14 0 14 14 Z" fill="#c89a4a" ${O(2)}/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0 + w * 0.14, top + 30, w * 0.72, B, 'stone') + `<path d="M${f1(x0 + w * 0.06)} ${f1(top + 30)} h${f1(w * 0.88)} l-10 -16 h${f1(-w * 0.88 + 20)} Z" fill="${STD}" ${O(3)}/>`;
      g += `<path d="M${f1(cx - 30)} ${f1(top + 14)} q30 30 60 0 Z" fill="${STL}" ${O(3)}/><circle cx="${f1(cx)}" cy="${f1(top - 10)}" r="50" fill="url(#tgGlow)" opacity=".7"/><path d="M${f1(cx - 20)} ${f1(top + 12)} q20 -60 40 0 q-8 -24 -20 -6 q-12 -18 -20 6" fill="${EMB}" stroke="#c8402a" stroke-width="2"/>`;
      for (let i = 0; i < Math.min(9, 3 + lv * 2); i++) { const a = Math.PI + i * Math.PI / 8; g += `<path d="M${f1(cx + Math.cos(a) * 40)} ${f1(top + Math.sin(a) * 40)} L${f1(cx + Math.cos(a) * 62)} ${f1(top + Math.sin(a) * 62)}" stroke="${CLANS[i]}" stroke-width="5" stroke-linecap="round"/>`; }
      g += win(k, cx - 13, top + 64, 26, 36, lv) + k.door(cx, B, 40 + lv * 3, 64 + lv * 4, '#2a1e3a');
      if (lv >= 5) g += k.orb(cx, top - 70, 9);
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a5a');
      return g;
    },
  };

  const art = {
    K: {},
    back(k) {
      const { P, L } = k;
      let g = ''; for (let i = 0; i < 9; i++) { const x = 250 + i * 480; g += `<path d="M${x - 160} 724 Q${x - 60} ${670 - (i % 3) * 14} ${x + 160} 724 Z" fill="#3a2a2a"/><circle cx="${x}" cy="${690 - (i % 3) * 14}" r="6" fill="${EMB}" opacity=".7"/><circle cx="${x}" cy="${690 - (i % 3) * 14}" r="18" fill="${EMB}" opacity=".15"/>`; }
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, clanHouse(k, f, { door: false, noWin: true, clan: i + 1, bx: x1 + 14 }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 24, 28, 34, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, '#3a2420'));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = clanHouse(k, f, { door: false, noWin: true, clan: c.v % 9, bx: c.v % 2 ? x0 - 16 : x1 + 10 }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 24, 30, 34, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, '#3a2420');
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(280 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'ashaltar') {

        let g = k.ell(x, y + 4, 90, 20) + `<path d="M${x - 80} ${y} l10 -30 h140 l10 30 Z" fill="${STD}" ${O(4)}/><path d="M${x - 60} ${y - 30} L${x - 50} ${y - 110} H${x + 50} L${x + 60} ${y - 30} Z" fill="${ST}" ${O(4)}/><rect x="${x - 70}" y="${y - 124}" width="140" height="18" rx="4" fill="${STL}" ${O(3.5)}/>`;
        for (let i = 0; i < 9; i++) g += `<path d="${sign9[i]}" transform="translate(${f1(x - 44 + (i % 5) * 22)} ${f1(y - 86 + Math.floor(i / 5) * 30)}) scale(.7)" stroke="${CLANS[i] === '#1e1a22' ? '#e8e0d0' : CLANS[i]}" stroke-width="3.5" fill="none"/>`;
        g += `<path d="M${x - 40} ${y - 124} q40 30 80 0 Z" fill="#2a2228" ${O(3)}/><circle cx="${x}" cy="${y - 150}" r="56" fill="url(#tgGlow)" opacity=".7"/><path d="M${x - 26} ${y - 124} q26 -80 52 0 q-10 -30 -26 -10 q-16 -24 -26 10" fill="${EMB}" stroke="#c8402a" stroke-width="2"/><path d="M${x - 12} ${y - 126} q12 -40 24 0" fill="${EMBL}"/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 220 * s, h: 220 * s };
      }
      if (p.k === 'bonfire') return { g: fire(k, x, y, s, p.clan != null ? p.clan : p.v % 9), w: 140 * s, h: 170 * s };
      if (p.k === 'clanpole') return { g: k.ell(x, y, 14, 4) + banner(k, x, y, 150, p.v % 9), w: 80, h: 170 };
      if (p.k === 'embers') return { g: `<ellipse cx="${x}" cy="${y}" rx="30" ry="9" fill="#2a2228"/>` + [[-14, -4], [4, -6], [16, -2], [-4, 0]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="5" fill="${EMB}"/>`).join('') + `<circle cx="${x}" cy="${y - 6}" r="22" fill="${EMB}" opacity=".15"/>`, w: 70, h: 40, flat: true };
      return null;
    },
  };

  return {
    id: 'd88', ver: 1, name: 'Углополье', layout, art,
    story: 'Здесь сошлись девять родов кочевников и осели вокруг огня: каменные дома под тёмной черепицей, у каждого - очаг-огневица и стяг своего рода. На круглой площади по кругу горят девять родовых костров, а в середине - Пепельный алтарь, у которого роды держат совет.',
  };
});
