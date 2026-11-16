



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ST = '#aab2c0', STD = '#7a8494', ROOF = '#6a3a34', ROOFD = '#4a2420', FIRE = '#ff8a2a', FIREL = '#ffd76a', ICE = '#cfe6f6', ICED = '#8ab4d8', WOOD = '#6a4a32', CLOTH = '#c8402a';
  const KINDS = { eternalfire: { foot: [90, 24], tall: 300 }, icebowl: { foot: [24, 9], tall: 90 }, firepost: { foot: [12, 6], tall: 140 }, skates: { foot: [20, 6], tall: 40 } };

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
        { k: 'lane', w: 34, pts: [[1460, 908], [1480, 1100], [1560, 1240], [2200, 1236], [2900, 1240], [3640, 1250], [3990, 1220], [3990, 908]] },
        { k: 'lane', w: 32, pts: [[1500, 1160], [1320, 1290]] },
      ],
      plazas: [{ k: 'central', x: 1150, y: 1346, rx: 200, ry: 80, mark: 'eternalfire', ms: 1.4 }],
      water: [{ k: 'ice', e: [2250, 1372, 400, 62] }],
      kinds: KINDS,
      props: [['icebowl', 1800, 1350], ['icebowl', 1860, 1440], ['icebowl', 2700, 1350], ['icebowl', 2640, 1440], ['firepost', 1440, 1330], ['skates', 2250, 1452], ['firepost', 3300, 1300]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 500, x1: 710, base: 1446 }, { x0: 3000, x1: 3200, base: 1450 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['pine', 'drift', 'snowman', 'rock', 'firepost'], n: 16, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'drift'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1480, 1700], [1740, 1960], [2320, 2560], [2600, 2820], [3480, 3720], [3770, 4000]] },
    };
  }

   
  const flame = (k, x, y, s = 1) => k.use(k.sym('d22fl', () => `<circle cx="0" cy="-14" r="22" fill="${FIRE}" opacity=".2"/><path d="M-10 0 q10 -44 20 0 q-4 -16 -10 -6 q-6 -12 -10 6 Z" fill="${FIRE}" stroke="#c8402a" stroke-width="2"/><path d="M-5 0 q5 -22 10 0" fill="${FIREL}"/>`), x, y, s);
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return `<rect x="${f1(x - 5)}" y="${f1(y - 5)}" width="${f1(w + 10)}" height="${f1(h + 10)}" rx="${f1(w / 2)}" fill="${STD}" ${O(2.5)}/><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(w / 2 - 2)}" fill="${FIREL}" ${O(2)}/><circle cx="${f1(x + w / 2)}" cy="${f1(y + h / 2)}" r="${f1(w)}" fill="${FIRE}" opacity=".15"/>` + (lv >= 2 ? `<path d="M${f1(x + w / 2)} ${f1(y)} v${f1(h)}" stroke="${STD}" stroke-width="2.5"/>` : '');
  }

  function tentRoof(k, x0, x1, top, h, lv) {
    const { f1, O } = k, cx = (x0 + x1) / 2, e = 22;
    let g = `<path d="M${f1(x0 - e)} ${f1(top + 8)} Q${f1(cx - (x1 - x0) * 0.1)} ${f1(top - h * 0.6)} ${f1(cx)} ${f1(top - h)} Q${f1(cx + (x1 - x0) * 0.1)} ${f1(top - h * 0.6)} ${f1(x1 + e)} ${f1(top + 8)} Z" fill="${lv <= 1 ? '#6a5a4a' : ROOF}" ${O()}/>`;
    let d = ''; for (let i = 1; i < 5; i++) { const t = i / 5; d += `M${f1(x0 - e + (x1 - x0 + 2 * e) * t)} ${f1(top + 6)} L${f1(cx)} ${f1(top - h + 6)}`; } g += `<path d="${d}" stroke="${ROOFD}" stroke-width="3" opacity=".6"/>`;
    g += `<path d="M${f1(x0 - e)} ${f1(top + 8)} Q${f1(cx - (x1 - x0) * 0.1)} ${f1(top - h * 0.6)} ${f1(cx)} ${f1(top - h)} Q${f1(cx + (x1 - x0) * 0.1)} ${f1(top - h * 0.6)} ${f1(x1 + e)} ${f1(top + 8)} L${f1(x1 + e - 14)} ${f1(top + 2)} Q${f1(cx)} ${f1(top - h * 0.7)} ${f1(x0 - e + 14)} ${f1(top + 2)} Z" fill="#f6fafd" opacity=".9"/>`;
    let ic = ''; for (let x = x0 - e + 12; x < x1 + e - 8; x += 18) ic += `M${f1(x)} ${f1(top + 8)} l3 ${10 + ((x * 7) % 10)} l3 ${-10 - ((x * 7) % 10)}`; g += `<path d="${ic}" fill="${ICE}" stroke="${ICED}" stroke-width="1.5"/>`;
    g += `<rect x="${f1(cx - 9)}" y="${f1(top - h - 18)}" width="18" height="24" fill="${STD}" ${O(2.5)}/>` + flame(k, cx, top - h - 18, 0.7 + lv * 0.08);
    if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - h - 50)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
    return g;
  }

  function fireHouse(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([70, 84, 98, 108, 116][lv - 1], f.up - 30, w * 0.5));
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'rubble' : 'stone') + `<path d="M${x0} ${top} Q${k.f1(cx)} ${top + 14} ${x1} ${top}" stroke="${STD}" stroke-width="4" fill="none"/>` + tentRoof(k, x0, x1, top, rh, lv);
    const ww = [24, 28, 30, 32, 34][lv - 1], wh = [32, 38, 42, 46, 50][lv - 1], wy = top + Math.max(20, (f.wall - wh) * 0.36);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, WOOD, 0.92);
    if (lv >= 3 && o.door !== false) for (const s of [-1, 1]) g += `<path d="M${k.f1(cx + s * 50)} ${B} V${B - 70}" stroke="${k.INK}" stroke-width="5"/>` + flame(k, cx + s * 50, B - 70, 0.6);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || ROOFD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 56, 6);
    return { g, top, rh, cx, B };
  }
  const bowl = (k, x, y, s = 1) => { const { f1, O } = k; return `<path d="M${f1(x - 24 * s)} ${f1(y - 34 * s)} h${f1(48 * s)} l${f1(-8 * s)} ${f1(22 * s)} h${f1(-32 * s)} Z" fill="${ICE}" ${O(2.5)}/><path d="M${f1(x - 8 * s)} ${f1(y - 12 * s)} h${f1(16 * s)} l${f1(4 * s)} ${f1(12 * s)} h${f1(-24 * s)} Z" fill="${ICED}" ${O(2)}/>` + flame(k, x, y - 34 * s, s); };

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) { let d = ''; for (let x = a + 10; x < b; x += 22) d += `M${f1(x - 8)} ${B} l3 -50 l5 -12 l5 12 l3 50 Z`; g += `<path d="${d}" fill="${ICE}" stroke="${ICED}" stroke-width="2.5"/>`; }
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += `<path d="M${f1(px - 16)} ${B} L${f1(px - 12)} ${f1(B - ph)} H${f1(px + 12)} L${f1(px + 16)} ${B} Z" fill="${ICE}" ${O(4)}/><path d="M${f1(px - 6)} ${f1(B - ph + 10)} v${f1(ph - 30)}" stroke="#ffffff" stroke-width="4" opacity=".7"/>` + bowl(k, px, B - ph + 4, 0.9); }
      const by = B - ph + 30;
      g += `<path d="M${f1(cx - ow / 2)} ${f1(by)} H${f1(cx + ow / 2)}" stroke="${INK}" stroke-width="12"/><path d="M${f1(cx - ow / 2)} ${f1(by)} H${f1(cx + ow / 2)}" stroke="${WOOD}" stroke-width="7"/>`;
      for (let i = 0; i < 3 + lv; i++) { const x = cx - ow / 2 + 8 + i * (ow - 16) / (2 + lv); g += `<path d="M${f1(x)} ${f1(by + 4)} q-4 14 2 26" stroke="${CLOTH}" stroke-width="4" fill="none"/>`; }
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(by - 16)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 38;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${ROOFD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, FIREL);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = fireHouse(k, f, { sign: 'РАТУША', signBg: '#5a1a14' });
      let g = h.g;
      if (lv >= 2) { const bx = f.x1 + 20; g += `<path d="M${f1(bx)} ${h.B} V${h.B - 160 - lv * 6}" stroke="${INK}" stroke-width="6"/><path d="M${f1(bx)} ${h.B - 156 - lv * 6} h36 l-8 18 l8 18 h-36 Z" fill="${CLOTH}" ${O(2.5)}/>` + flame(k, bx + 16, h.B - 126 - lv * 6, 0.5); }
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = fireHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14' });
      let g = h.g;
      for (let i = 0; i < 1 + Math.min(lv, 3); i++) g += `<ellipse cx="${f1(f.x1 + 30 + i * 26)}" cy="${h.B - 14}" rx="13" ry="14" fill="${ICE}" ${O(2.5)}/><path d="M${f1(f.x1 + 22 + i * 26)} ${h.B - 26} q8 -12 16 0" stroke="${INK}" stroke-width="3" fill="none"/>`;
      if (lv >= 2) g += bowl(k, f.x0 - 40, h.B, 0.9);
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${WOOD}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${ICE}" ${O(4)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(54, (w - 50) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="#fffaf0" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      g += bowl(k, cx, by0 + 2, 0.8 + lv * 0.05);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, ROOFD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0, top, w, B, 'stone') + `<rect x="${f1(x0 + 14)}" y="${f1(top + 20)}" width="${f1(w - 28)}" height="${f1(f.wall - 20)}" fill="#3a2a22" ${O(3)}/>`;
      let d = ''; for (let y = top + 34; y < B - 6; y += 16) for (let x = x0 + 24 + ((y / 16) % 2) * 8; x < x1 - 18; x += 16) if (Math.abs(x - cx) > 34 || y < B - 90) d += `M${f1(x + 7)} ${f1(y)} a7 7 0 1 0 0.1 0`;
      g += `<path d="${d}" fill="#c89a5a" stroke="#5a3a22" stroke-width="2"/>` + k.door(cx, B, 54, Math.min(84, f.wall - 30), WOOD) + tentRoof(k, x0, x1, top, Math.min(f.up - 30, 56 + lv * 10), lv);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top + 10)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx, top + 6, Math.min(w - 10, 130), 'СКЛАД', lv, 19, ROOFD);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const h = fireHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      let g = h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="${FIRE}"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m - 10)} ${f1(t - 24)} L${f1(m + 24)} ${f1(t + 30)} M${f1(m + 10)} ${f1(t - 24)} L${f1(m - 24)} ${f1(t + 30)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="#b8987a" ${O()}/>`;
        for (const v of [0.45, 0.7]) { const hw = (b - a) * 0.5 * v; s += `<path d="M${f1(m - hw)} ${f1(t + h * v)} H${f1(m + hw)}" stroke="${CLOTH}" stroke-width="7"/>`; }
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 26)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s + k.snowCap(m - 30, m + 30, t + 30, 30);
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 26)} ${B} L${f1(cx)} ${f1(B - 86 - lv * 5)} L${f1(cx + 26)} ${B} Z" fill="#2a1e1a" ${O(3)}/>` + (lv >= 2 ? bowl(k, x1 + 20, B, 0.8) : '');
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, ROOFD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = fireHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${ROOF}" ${O(3)}/><path d="M${f1(ax0 - 8)} ${f1(ay)} H${f1(ax1 + 8)}" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${WOOD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${WOOD}" ${O(3)}/>`;
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 34))); i < n; i++) { const px = ax0 + 20 + i * 34; g += `<path d="M${f1(px)} ${f1(ay + 22)} v8" stroke="${INK}" stroke-width="2"/>` + (i % 2 ? `<path d="M${f1(px - 9)} ${f1(ay + 30)} h18 v20 q-9 8 -18 0 Z" fill="${CLOTH}" ${O(2)}/>` : k.wallLamp(px + 6, ay + 30)); }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0 + w * 0.16, top + 30, w * 0.68, B, 'stone') + `<path d="M${f1(x0 + w * 0.08)} ${f1(top + 30)} h${f1(w * 0.84)} l-10 -16 h${f1(-w * 0.84 + 20)} Z" fill="${STD}" ${O(3)}/>`;
      g += `<path d="M${f1(cx - 34)} ${f1(top + 14)} h68 l-12 -30 h-44 Z" fill="${ICE}" ${O(3)}/><circle cx="${f1(cx)}" cy="${f1(top - 40)}" r="50" fill="#7ac8ff" opacity=".2"/><path d="M${f1(cx - 20)} ${f1(top - 16)} q20 -70 40 0 q-8 -26 -20 -8 q-12 -20 -20 8" fill="#5aa8ff" stroke="#2a6ac8" stroke-width="2"/><path d="M${f1(cx - 9)} ${f1(top - 18)} q9 -34 18 0" fill="#c8f0ff"/>`;
      g += win(k, cx - 13, top + 64, 26, 36, lv) + k.door(cx, B, 40 + lv * 3, 64 + lv * 4, '#2a1e4a');
      if (lv >= 5) g += k.orb(cx, top - 100, 9);
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},
    back(k) {
      const { P, L } = k;
      let g = ''; for (let i = 0; i < 7; i++) { const x = 300 + i * 650, y = 600 + (i % 2) * 30; g += `<circle cx="${x}" cy="${y}" r="5" fill="${FIRE}"/><circle cx="${x}" cy="${y}" r="18" fill="${FIRE}" opacity=".2"/>`; }
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 96 + (i * 13) % 22, up: 120, lv: 2 };
        k.P(a, b, fireHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 58, 792 - f.wall + 26, 26, 34, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, WOOD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 20), up: 110, lv: 2 };
      const g0 = fireHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 52, 795 - f.wall + 26, 26, 34, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, WOOD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(290 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'eternalfire') {

        let g = k.ell(x, y + 4, 110, 20) + `<circle cx="${x}" cy="${y - 80}" r="110" fill="url(#tgGlow)" opacity=".6"/>`;
        const pil = (dx, h) => `<path d="M${x + dx - 14} ${y + 4} L${x + dx - 10} ${y - h} L${x + dx} ${y - h - 16} L${x + dx + 10} ${y - h} L${x + dx + 14} ${y + 4} Z" fill="${ICE}" ${O(3)}/><path d="M${x + dx - 4} ${y - h + 10} v${h - 20}" stroke="#ffffff" stroke-width="3" opacity=".8"/><path d="M${x + dx + 4} ${y - h * 0.6} v20" stroke="${FIRE}" stroke-width="3" opacity=".5"/>`;
        g += pil(-96, 110) + pil(96, 120) + pil(-60, 150);
        g += `<path d="M${x - 60} ${y} l10 -30 h100 l10 30 Z" fill="${STD}" ${O(3.5)}/><path d="M${x - 46} ${y - 30} q46 -160 92 0 q-14 -60 -46 -24 q-30 -40 -46 24" fill="${FIRE}" stroke="#c8402a" stroke-width="3"/><path d="M${x - 24} ${y - 32} q24 -90 48 0 q-10 -30 -24 -10 q-14 -22 -24 10" fill="${FIREL}"/>`;
        g += pil(60, 140);
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 280 * s, h: 300 * s };
      }
      if (p.k === 'icebowl') return { g: k.ell(x, y, 24, 6) + `<path d="M${x - 6} ${y} l2 -30 h8 l2 30 Z" fill="${ICED}" ${O(2)}/>` + bowl(k, x, y - 26, 0.8), w: 70, h: 100 };
      if (p.k === 'firepost') return { g: k.ell(x, y, 12, 4) + `<path d="M${x} ${y} V${y - 110}" stroke="${INK}" stroke-width="7"/><path d="M${x} ${y} V${y - 110}" stroke="${WOOD}" stroke-width="3.5"/><path d="M${x - 12} ${y - 110} h24 l-4 12 h-16 Z" fill="${STD}" ${O(2)}/>` + flame(k, x, y - 112, 0.8), w: 50, h: 150 };
      if (p.k === 'skates') return { g: `<path d="M${x - 18} ${y} h16 M${x + 4} ${y} h16 M${x - 16} ${y - 2} v-14 h10 v14 M${x + 6} ${y - 2} v-14 h10 v14" stroke="${INK}" stroke-width="3" fill="${WOOD}"/>`, w: 40, h: 20, flat: true };
      return null;
    },
  };

  return {
    id: 'd22', ver: 1, name: 'Хладополье', layout, art,
    story: 'Деревня огнехранителей среди снегов: круглые каменные дома под шатровыми крышами, в окнах - тёплый огонь, над трубами - живое пламя. Посреди - замёрзшее озеро в кольце огней в ледяных чашах, а у озера горит Вечный костёр, который не гасила ни одна зима.',
  };
});
