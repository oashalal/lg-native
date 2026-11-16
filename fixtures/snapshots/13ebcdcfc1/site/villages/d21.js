



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ST = '#8a94a4', STD = '#5a6474', ROOF = '#2e3a52', ROOFD = '#1e2840', BONE = '#ece6d6', RED = '#b8402a', SEA = '#2a4a6a', SEAL = '#4a7aa0', WOOD = '#6a4a32', LAMP = '#ffe08a';
  const SEA_Y = 1300, CAPE = [1990, 2510];
  const KINDS = { lighthouse: { foot: [60, 20], tall: 480 }, harpoons: { foot: [24, 8], tall: 140 }, fishrack: { foot: [50, 10], tall: 120 }, bollard: { foot: [14, 6], tall: 40 } };

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
        shop: { x0: 1500, x1: 1780, B: 1200 },
        tent: { x0: 2540, x1: 2790, B: 1200 },
        storage: { x0: 3520, x1: 3800, B: 1200 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2250, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'shore', w: 34, pts: [[960, 908], [1000, 1100], [1100, 1260], [2250, 1262], [3900, 1260], [3990, 1100], [3990, 908]] },
        { k: 'cross', w: 32, pts: [[2250, 912], [2250, 1290]] },
      ],
      plazas: [{ k: 'central', x: 2250, y: 1370, rx: 200, ry: 80, mark: 'lighthouse', ms: 1 }],
      water: [{ k: 'sea', b: [60, SEA_Y, CAPE[0], 1470], art: 1 }, { k: 'sea', b: [CAPE[1], SEA_Y, 4340, 1470], art: 1 }],
      kinds: KINDS,
      props: [['harpoons', 1300, 1110], ['fishrack', 2050, 1120], ['bollard', 2040, 1440], ['bollard', 2460, 1440], ['fishrack', 3300, 1110], ['harpoons', 900, 1180]],
      houses: [{ x0: 1860, x1: 2060, base: 1200 }],
      fill: [{ k: ['drift', 'rock', 'snowman', 'harpoons', 'pine'], n: 12, box: [80, 980, 4320, 1240] }, { k: ['barrel', 'crate', 'drift'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1500, 1720], [1770, 1990], [2330, 2540], [2580, 2820], [3490, 3720], [3770, 4000]], floes: [[400, 1380, 90], [900, 1430, 60], [1500, 1360, 110], [2900, 1400, 80], [3500, 1350, 120], [4000, 1430, 70]] },
    };
  }

   
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return k.winLit(x, y, w, h, true) + `<rect x="${f1(x - 6)}" y="${f1(y - 6)}" width="${f1(w + 12)}" height="${f1(h + 12)}" fill="none" stroke="${WOOD}" stroke-width="5"/>` + (lv >= 2 ? `<path d="M${f1(x - 8)} ${f1(y + h + 7)} h${f1(w + 16)}" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>` : '');
  }
  const net = (k, x, y, w, h) => { const { f1 } = k; let d = `M${f1(x)} ${f1(y)} Q${f1(x + w / 2)} ${f1(y + 14)} ${f1(x + w)} ${f1(y)}`; for (let i = 1; i < 5; i++) d += `M${f1(x + w * i / 5)} ${f1(y + 4)} L${f1(x + w * i / 5 + (i - 2.5) * 4)} ${f1(y + h)}`; for (let j = 1; j < 4; j++) d += `M${f1(x + 4)} ${f1(y + h * j / 4 + 4)} Q${f1(x + w / 2)} ${f1(y + h * j / 4 + 12)} ${f1(x + w - 4)} ${f1(y + h * j / 4 + 4)}`; return `<path d="${d}" stroke="#c8bc94" stroke-width="2" fill="none"/>`; };
  const harpoon = (k, x, B, h) => `<path d="M${x} ${B} l6 -${h}" stroke="${k.INK}" stroke-width="5"/><path d="M${x} ${B} l6 -${h}" stroke="#a87a4a" stroke-width="2.5"/><path d="M${x + 1} ${B - h + 4} l5 -20 l5 18 l-5 -4 Z" fill="#9aa4b2" ${k.O(1.5)}/>`;

  function seaHouse(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([84, 98, 110, 120, 128][lv - 1], f.up - 10, w * 0.6));
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'rubble' : 'stone') + k.roof(x0, x1, top, rh, lv <= 1 ? 'thatch' : 'slate', lv <= 1 ? '#6a6a5a' : ROOF, false, ROOFD) + k.snowCap(x0 - 20, x1 + 20, top + 4, rh);
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [30, 36, 40, 44, 48][lv - 1], wy = top + Math.max(20, (f.wall - wh) * 0.36);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, WOOD, 0.92);
    if (o.net !== false && lv >= 2) g += net(k, x0 + 8, top + 8, Math.min(70, w * 0.3), 50) + harpoon(k, x1 + 8, B, 130);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 28, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || ROOFD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 60, 6);
    return { g, top, rh, cx, B };
  }
  const lantern = (k, x, y, s = 1) => k.use(k.sym('d21lan', () => { const { O } = k; return `<circle cx="0" cy="12" r="22" fill="${LAMP}" opacity=".25"/><path d="M-8 0 h16 l2 22 h-20 Z" fill="${LAMP}" ${O(2.5)}/><path d="M-10 0 h20 M-10 22 h20" stroke="#2a2a3a" stroke-width="3"/>`; }), x, y, s);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall + 10;
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 36], [cx + ow / 2 + 36, x1]]) if (b - a > 12) { let d = ''; for (let x = a + 8; x < b; x += 16) d += `M${f1(x)} ${B} V${B - 54 - ((x * 7) % 14)}`; g += `<path d="${d}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${d}" stroke="#a8a090" stroke-width="6" stroke-linecap="round"/>`; }
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += `<path d="M${f1(px - s * 10)} ${B} Q${f1(px - s * 26)} ${f1(B - ph * 0.6)} ${f1(cx + s * 8)} ${f1(B - ph)}" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${f1(px - s * 10)} ${B} Q${f1(px - s * 26)} ${f1(B - ph * 0.6)} ${f1(cx + s * 8)} ${f1(B - ph)}" stroke="${lv >= 5 ? k.GOLD : BONE}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${f1(px - s * 14)} ${f1(B - 40)} l${s * 10} -6 M${f1(px - s * 20)} ${f1(B - 90)} l${s * 10} -6" stroke="#c8c0a8" stroke-width="3"/>`; }
      g += `<path d="M${f1(cx)} ${f1(B - ph - 10)} v18" stroke="${INK}" stroke-width="3"/>` + lantern(k, cx, B - ph + 8, 1 + lv * 0.08);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = B - ph + 54;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${ROOFD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, '#eef4fa');
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = seaHouse(k, f, { sign: 'РАТУША', signBg: '#5a1a1a', net: false });
      let g = h.g;
      const wy = h.top - h.rh * 0.4, r = 14 + lv * 2; let d = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; d += `M${f1(h.cx + Math.cos(a) * r * 0.4)} ${f1(wy + Math.sin(a) * r * 0.4)} L${f1(h.cx + Math.cos(a) * r * 1.4)} ${f1(wy + Math.sin(a) * r * 1.4)}`; }
      g += `<path d="${d}" stroke="${WOOD}" stroke-width="5" stroke-linecap="round"/><circle cx="${f1(h.cx)}" cy="${f1(wy)}" r="${f1(r)}" fill="none" stroke="${lv >= 5 ? k.GOLD : WOOD}" stroke-width="5"/>`;
      g += `<path d="M${f1(h.cx)} ${f1(h.top - h.rh)} v-24" stroke="${k.INK}" stroke-width="4"/><path d="M${f1(h.cx - 11)} ${f1(h.top - h.rh - 24)} q11 -6 22 0 l4 20 h-30 Z" fill="#c8a050" ${O(2)}/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = seaHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a1a', net: false });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) g += harpoon(k, f.x1 + 14 + i * 12, h.B, 130);
      if (lv >= 2) { const bx = f.x0 - 44; g += `<path d="M${f1(bx - 30)} ${h.B} V${h.B - 90} M${f1(bx + 30)} ${h.B} V${h.B - 90} M${f1(bx - 36)} ${h.B - 86} h72" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${f1(bx - 24)} ${h.B - 30} Q${f1(bx - 20)} ${h.B - 80} ${f1(bx)} ${h.B - 78} Q${f1(bx + 22)} ${h.B - 74} ${f1(bx + 24)} ${h.B - 40} Q${f1(bx)} ${h.B - 22} ${f1(bx - 24)} ${h.B - 30} Z" fill="#7a7a84" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 56}" r="9" fill="none" stroke="${RED}" stroke-width="3"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${WOOD}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="#5a6a7a" ${O(4)}/><rect x="${f1(x0 + 16)}" y="${f1(by0 + 10)}" width="${f1(w * 0.42)}" height="${f1((by1 - by0) * 0.7)}" fill="#e8eef4" ${O(2.5)}/><path d="M${f1(x0 + 22)} ${f1(by0 + 40)} q14 -20 28 0 t28 0" stroke="${SEAL}" stroke-width="3" fill="none"/>`;
      for (let i = 0; i < 1 + Math.min(3, lv); i++) { const nx = x0 + w * 0.6 + (i % 2) * 32, ny = by0 + 12 + Math.floor(i / 2) * 44; g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="28" height="34" fill="#f2f4f8" ${O(2)}/><path d="M${f1(nx + 5)} ${f1(ny + 12)} h18 M${f1(nx + 5)} ${f1(ny + 22)} h12" stroke="${INK}" stroke-width="2" opacity=".45"/>`; }
      g += k.roof(x0 - 6, x1 + 6, by0 - 4, Math.min(f.up - 40, 26 + lv * 6), 'slate', ROOF, false, ROOFD) + k.snowCap(x0 - 20, x1 + 20, by0, Math.min(f.up - 40, 26 + lv * 6));
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, ROOFD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0, top + 30, w, B, 'stone') + `<rect x="${f1(x0 + 16)}" y="${f1(top + 50)}" width="${f1(w - 32)}" height="${f1(f.wall - 50)}" fill="#2a2a34" ${O(3)}/>`;
      for (const y of [top + 64, top + 64 + f.wall * 0.3]) { g += `<path d="M${f1(x0 + 16)} ${f1(y)} H${f1(x1 - 16)}" stroke="${WOOD}" stroke-width="5"/>`; for (let x = x0 + 30; x < x1 - 24; x += 22) g += `<path d="M${f1(x)} ${f1(y)} q-6 12 0 30 q6 -16 0 -30 Z M${f1(x - 5)} ${f1(y + 34)} l5 -6 l5 6" fill="#c8c0b0" stroke="${INK}" stroke-width="1.5"/>`; }
      g += k.roof(x0 - 4, x1 + 4, top + 30, Math.min(f.up - 10, 56 + lv * 10), 'slate', ROOF, false, ROOFD) + k.snowCap(x0 - 18, x1 + 18, top + 34, Math.min(f.up - 10, 56 + lv * 10));
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<rect x="${f1(x1 + 6 + i * 4)}" y="${B - 44 - i * 4}" width="34" height="44" rx="8" fill="#6a4a30" ${O(2.5)}/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top)}" r="10" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx, top + 40, Math.min(w - 10, 130), 'СКЛАД', lv, 19, ROOFD);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), STD);
      const h = seaHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, net: false, roofH: Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 10) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      if (lv >= 2) g += `<path d="M${f1(f.x1 - 40)} ${h.B - 90} v50 m-18 -14 q18 24 36 0 m-30 -30 h24" stroke="#5a5662" stroke-width="5" fill="none"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const chum = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m - 10)} ${f1(t - 24)} L${f1(m + 26)} ${f1(t + 30)} M${f1(m + 10)} ${f1(t - 24)} L${f1(m - 26)} ${f1(t + 30)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="#8a8a94" ${O()}/>`;
        s += `<path d="M${f1(a + (b - a) * 0.1)} ${f1(B - h * 0.2)} L${f1(m)} ${f1(t + h * 0.15)} L${f1(b - (b - a) * 0.1)} ${f1(B - h * 0.2)}" stroke="#6a6a74" stroke-width="4" fill="none"/><path d="M${f1(a)} ${B} Q${f1(m)} ${B - 14} ${f1(b)} ${B}" stroke="#f2ece0" stroke-width="10" fill="none"/>`;
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 26)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s + k.snowCap(m - 30, m + 30, t + 30, 30);
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(90, w * 0.3); g += chum(x0, x0 + sw, f.wall * 0.66, lv >= 5) + chum(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += chum(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 26)} ${B} L${f1(cx)} ${f1(B - 86 - lv * 5)} L${f1(cx + 26)} ${B} Z" fill="#2a2a34" ${O(3)}/>`;
      if (lv >= 2) g += `<path d="M${f1(x1 + 4)} ${B - 4} h70 q10 0 12 -12 M${f1(x1 + 10)} ${B - 4} v-20 h56 v20" stroke="${WOOD}" stroke-width="5" fill="none"/>`;
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, ROOFD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = seaHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a4a', dx: x1 - 44, noWin: true, net: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${ROOF}" ${O(3)}/><path d="M${f1(ax0 - 8)} ${f1(ay)} H${f1(ax1 + 8)}" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${WOOD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${WOOD}" ${O(3)}/>`;
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 34))); i < n; i++) { const px = ax0 + 20 + i * 34; g += `<path d="M${f1(px)} ${f1(ay + 22)} v8" stroke="${INK}" stroke-width="2"/>` + (i % 2 ? lantern(k, px, ay + 30, 0.7) : `<path d="M${f1(px)} ${f1(ay + 30)} q-6 12 0 30 q6 -16 0 -30 Z" fill="#c8c0b0" stroke="${INK}" stroke-width="1.5"/>`); }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0 + w * 0.16, top + 30, w * 0.68, B, 'stone') + `<path d="M${f1(cx - w * 0.38)} ${f1(top + 34)} Q${f1(cx - w * 0.38)} ${f1(top - 40)} ${f1(cx)} ${f1(top - 50)} Q${f1(cx + w * 0.38)} ${f1(top - 40)} ${f1(cx + w * 0.38)} ${f1(top + 34)} Z" fill="${lv >= 5 ? k.GOLD : '#5a6a8a'}" ${O(3)}/><path d="M${f1(cx - 8)} ${f1(top - 46)} l26 -30" stroke="#2a2a3a" stroke-width="12" stroke-linecap="round"/>` + k.snowCap(cx - w * 0.42, cx + w * 0.42, top + 30, 40);
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(x0 - 40 + i * 20)} ${f1(top - 70 - i * 18)} q${f1(w * 0.4)} -40 ${f1(w * 0.7 + 60)} -6" stroke="${['#7affc8', '#8ab8ff', '#c8a8ff'][i]}" stroke-width="10" fill="none" opacity=".55" stroke-linecap="round"/>`;
      g += win(k, cx - 13, top + 64, 26, 36, lv) + k.door(cx, B, 40 + lv * 3, 64 + lv * 4, '#2a1e4a');
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},

    water(k) {
      const { P, L, f1, O } = k;
      for (const w of L.water) { const [a, y0, b, y1] = w.b; let g = `<rect x="${a}" y="${y0}" width="${b - a}" height="${y1 - y0}" fill="${SEA}"/><path d="M${a} ${y0 + 2} H${b}" stroke="#ffffff" stroke-width="10"/>`; let d = ''; for (let x = a + 40; x < b - 30; x += 110) d += `M${f1(x)} ${f1(y0 + 40 + ((x * 7) % 90))} q14 -6 28 0`; g += `<path d="${d}" stroke="${SEAL}" stroke-width="3" fill="none"/>`; P(a, b, g, y0 - 6, y1); }
      for (const [x, y, r] of L.hx.floes) P(x - r, x + r, `<path d="M${x - r} ${y} l${f1(r * 0.3)} -14 h${f1(r * 1.2)} l${f1(r * 0.4)} 14 Z" fill="#eef4fa" ${O(2.5)}/><path d="M${x - r} ${y} h${r * 2}" stroke="#b8cce0" stroke-width="3"/>`, y - 20, y + 10);
      for (const s of [-1, 1]) { const x = 2250 + s * 250; P(x - 30, x + 30, `<path d="M${x} ${L.water[0].b[1] - 6} V1470" stroke="#d8dee8" stroke-width="10"/>`, 1290, 1470); }
    },
    back(k) {
      const { P, L } = k;
      let g = ''; for (let i = 0; i < 3; i++) g += `<path d="M${200 + i * 1400} 520 q${500} -${60 + i * 20} ${1200} 10" stroke="${['#7affc8', '#8ab8ff', '#c8a8ff'][i]}" stroke-width="22" fill="none" opacity=".25" stroke-linecap="round"/>`;
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 96 + (i * 13) % 22, up: 120, lv: 2 };
        k.P(a, b, seaHouse(k, f, { door: false, noWin: true, net: i % 2 === 0 }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 26, 28, 32, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, WOOD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 20), up: 110, lv: 2 };
      const g0 = seaHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 26, 30, 32, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, WOOD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(300 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, { f1, O, INK } = k;
      if (p.k === 'lighthouse') {

        let g = k.ell(x, y + 4, 80, 16) + `<path d="M${x - 70} ${y} l10 -30 h120 l10 30 Z" fill="${STD}" ${O(4)}/><path d="M${x - 48} ${y - 30} L${x - 28} ${y - 380} H${x + 28} L${x + 48} ${y - 30} Z" fill="#f2f4f8" ${O(4.5)}/>`;
        for (const [a, b] of [[90, 140], [210, 260], [320, 370]]) { const hw = (yy) => 48 - (yy - 30) * 20 / 350; g += `<path d="M${f1(x - hw(a))} ${y - a} L${f1(x - hw(b))} ${y - b} H${f1(x + hw(b))} L${f1(x + hw(a))} ${y - a} Z" fill="${RED}"/>`; }
        g += `<rect x="${x - 40}" y="${y - 392}" width="80" height="14" fill="${STD}" ${O(3)}/><path d="M${x - 36} ${y - 392} v-12 M${x - 18} ${y - 392} v-12 M${x} ${y - 392} v-12 M${x + 18} ${y - 392} v-12 M${x + 36} ${y - 392} v-12 M${x - 40} ${y - 404} h80" stroke="${INK}" stroke-width="3"/>`;
        g += `<path d="M${x + 20} ${y - 430} L${x + 260} ${y - 480} L${x + 260} ${y - 400} Z" fill="${LAMP}" opacity=".22"/><rect x="${x - 22}" y="${y - 446}" width="44" height="42" fill="${LAMP}" ${O(3)}/><path d="M${x} ${y - 446} v42" stroke="${INK}" stroke-width="3"/><path d="M${x - 30} ${y - 446} L${x} ${y - 476} L${x + 30} ${y - 446} Z" fill="${RED}" ${O(3)}/><circle cx="${x}" cy="${y - 426}" r="60" fill="${LAMP}" opacity=".18"/>` + k.snowCap(x - 34, x + 34, y - 444, 30);
        g += k.door(x, y - 30, 30, 50, WOOD) + win(k, x - 9, y - 200, 18, 26, 3) + win(k, x - 8, y - 300, 16, 24, 3);
        return { g, w: 560, h: 500 };
      }
      if (p.k === 'harpoons') { let g = k.ell(x, y, 24, 6) + `<path d="M${x - 22} ${y - 40} h44" stroke="${INK}" stroke-width="6"/>`; for (let i = 0; i < 3; i++) g += harpoon(k, x - 12 + i * 12, y, 120 + (i % 2) * 14); return { g, w: 70, h: 160 }; }
      if (p.k === 'fishrack') { let g = k.ell(x, y, 50, 9) + `<path d="M${x - 46} ${y} V${y - 110} M${x + 46} ${y} V${y - 110} M${x - 52} ${y - 104} H${x + 52}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${x - 46} ${y} V${y - 110} M${x + 46} ${y} V${y - 110}" stroke="#a87a4a" stroke-width="4"/>`; for (let i = 0; i < 4; i++) g += `<path d="M${x - 30 + i * 20} ${y - 104} q-6 12 0 32 q6 -18 0 -32 Z" fill="#c8c0b0" stroke="${INK}" stroke-width="1.5"/>`; return { g: g + `<path d="M${x - 54} ${y - 108} H${x + 54}" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>`, w: 130, h: 130 }; }
      if (p.k === 'bollard') return { g: k.ell(x, y, 14, 5) + `<rect x="${x - 10}" y="${y - 36}" width="20" height="36" rx="4" fill="${STD}" ${O(2.5)}/><path d="M${x - 12} ${y - 24} h24" stroke="#c8bc94" stroke-width="4"/><ellipse cx="${x}" cy="${y - 36}" rx="11" ry="4" fill="#ffffff"/>`, w: 40, h: 40, flat: true };
      return null;
    },
  };

  return {
    id: 'd21', ver: 1, name: 'Инейище', layout, art,
    story: 'Деревня смотрителей маяка и зверобоев на краю студёного моря: каменные дома под шапками снега, на стенах сети и гарпуны, въезд - арка из китовых челюстей. С береговой улицы на мыс уходит дорога к Маяку Теней, чей огонь ведёт лодки сквозь полярную ночь.',
  };
});
