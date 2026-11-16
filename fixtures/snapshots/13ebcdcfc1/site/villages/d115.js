



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ADO = '#d8a870', ADOL = '#ecc690', ADOD = '#a87a4a', LEA = '#7a4a2a', FAL = '#5a4a3e', FALL = '#c8b498', NAVY = '#2a3a5a', CLOTH = '#f4e8cc', RED = '#b8402a';
  const KINDS = { falcontower: { foot: [70, 22], tall: 450 }, perch: { foot: [16, 7], tall: 110 }, dune: { foot: [60, 10], tall: 40 }, palm2: { foot: [22, 9], tall: 250, tree: true } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1180 },
        hall: { x0: 1250, x1: 1440 },
        trainer: { x0: 1800, x1: 2080 },
        magic: { x0: 2140, x1: 2370 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1500, x1: 1740, B: 1000 },
        tent: { x0: 2660, x1: 2900, B: 1000 },
        storage: { x0: 3500, x1: 3780, B: 1240 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'arm', w: 34, pts: [[1250, 908], [2000, 1330]] },
        { k: 'arm', w: 34, pts: [[3150, 908], [2400, 1330]] },
        { k: 'lane', w: 34, pts: [[2400, 1330], [3000, 1310], [3640, 1300], [3990, 1250], [3990, 908]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1340, rx: 230, ry: 90, mark: 'falcontower', ms: 1 }],
      water: [{ k: 'well', e: [900, 1300, 80, 20] }],
      kinds: KINDS,
      props: [['perch', 2200, 1080], ['palm2', 2060, 1180], ['palm2', 2340, 1180], ['perch', 1100, 1150], ['perch', 3300, 1150], ['palm2', 820, 1250], ['dune', 600, 1150], ['dune', 3300, 1440]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 480, x1: 690, base: 1446 }, { x0: 1300, x1: 1500, base: 1450 }, { x0: 2950, x1: 3150, base: 1452 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['dune', 'cactus', 'rock', 'palm2', 'perch'], n: 18, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'pot'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1510, 1760], [2400, 2630], [2660, 2900], [2960, 3200], [3240, 3460], [3500, 3780], [3810, 4000]] },
    };
  }

   
  const falcon = (k, x, y, s = 1, flip, hood) => k.use(k.sym(hood ? 'd115falH' : 'd115fal', () => { const { O } = k; return `<path d="M-6 -30 Q4 -36 10 -28 L16 -26 L10 -22 Q14 -10 8 0 L-8 2 Q-14 -14 -6 -30 Z" fill="${FAL}" ${O(2)}/><path d="M-8 2 l-6 14 l8 -4 l4 6 l4 -16" fill="${FAL}" ${O(1.5)}/><path d="M-2 -18 q6 6 2 16" stroke="${FALL}" stroke-width="3" fill="none"/><path d="M-4 -14 h8 M-3 -8 h7" stroke="${FALL}" stroke-width="2"/>` + (hood ? `<path d="M-6 -32 Q4 -40 12 -28 L8 -22 Q0 -26 -4 -22 Z" fill="${RED}" ${O(1.5)}/><path d="M2 -38 v-5" stroke="#e0a43a" stroke-width="3"/>` : `<circle cx="6" cy="-28" r="2" fill="#ffd76a"/>`) + `<path d="M-2 2 v4 M4 2 v4" stroke="#e0a43a" stroke-width="2.5"/>`; }), x, y, flip ? -s : s, s);
  const perch = (k, x, B, h, hood) => `<path d="M${x} ${B} V${B - h} M${x - 20} ${B - h} h40" stroke="${k.INK}" stroke-width="6" stroke-linecap="round"/><path d="M${x} ${B} V${B - h}" stroke="${LEA}" stroke-width="3"/>` + falcon(k, x + 4, B - h - 2, 0.9, false, hood);
  function dome(k, x0, x1, top, h, lv) {
    const { f1, O } = k, cx = (x0 + x1) / 2;
    let g = `<path d="M${f1(x0 - 6)} ${f1(top + 6)} Q${f1(x0 - 6)} ${f1(top - h * 1.1)} ${f1(cx)} ${f1(top - h)} Q${f1(x1 + 6)} ${f1(top - h * 1.1)} ${f1(x1 + 6)} ${f1(top + 6)} Z" fill="${lv >= 4 ? ADOL : ADO}" ${O()}/><path d="M${f1(x0 + (x1 - x0) * 0.2)} ${f1(top - h * 0.55)} q${f1((x1 - x0) * 0.15)} -${f1(h * 0.25)} ${f1((x1 - x0) * 0.3)} -${f1(h * 0.3)}" stroke="#f6dcb0" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/>`;
    for (let i = 0; i < 4; i++) { const t = 0.2 + i * 0.2, x = x0 + (x1 - x0) * t; g += `<path d="M${f1(x)} ${f1(top - 4)} v-14 M${f1(x - 6)} ${f1(top - 12)} h12" stroke="${ADOD}" stroke-width="3" opacity=".7"/>`; }
    if (lv >= 2) g += `<path d="M${f1(cx)} ${f1(top - h)} v-20" stroke="${k.INK}" stroke-width="4"/>` + falcon(k, cx + 2, top - h - 20, 0.7 + lv * 0.05);
    if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - h - 10)}" r="6" fill="${k.GOLD}" ${O(2)}/>`;
    return g;
  }
  const rwin = (k, x, y, r) => `<circle cx="${k.f1(x)}" cy="${k.f1(y)}" r="${k.f1(r + 5)}" fill="${ADOD}" ${k.O(2.5)}/><circle cx="${k.f1(x)}" cy="${k.f1(y)}" r="${k.f1(r)}" fill="#ffd27a" ${k.O(2)}/><path d="M${k.f1(x - r)} ${k.f1(y)} h${k.f1(r * 2)}" stroke="${NAVY}" stroke-width="2"/>`;

  function adobe(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([60, 74, 88, 98, 106][lv - 1], f.up - 24, w * 0.46));
    let g = k.wall(x0, top, w, B, 'clay') + `<rect x="${x0}" y="${top}" width="${w}" height="${f.wall}" fill="${ADO}" opacity=".4"/>` + dome(k, x0, x1, top, rh, lv);
    if (lv >= 3) { let d = ''; for (let x = x0 + 14; x < x1 - 6; x += 26) d += `M${k.f1(x)} ${top + 10} v14`; g += `<path d="${d}" stroke="${ADOD}" stroke-width="5"/>`; }
    const r = [11, 13, 14, 15, 16][lv - 1], wy = top + Math.max(26, f.wall * 0.36);
    if (!o.noWin) for (const x of [x0 + 28, x1 - 28]) if (Math.abs(x - cx) > 58 && (lv > 1 || x < cx)) g += rwin(k, x, wy, r);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, NAVY, 0.92);
    if (o.perch !== false && lv >= 2) g += perch(k, o.px != null ? o.px : x1 + 22, B, 90 + lv * 4, lv % 2 === 0);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || NAVY);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 56, 6);
    return { g, top, rh, cx, B };
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 32], [cx + ow / 2 + 32, x1]]) if (b - a > 12) g += k.wall(a, B - 54, b - a, B, 'clay');
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 18); g += k.wall(px - 18, B - ph, 36, B, 'clay') + `<path d="M${f1(px - 22)} ${f1(B - ph)} Q${f1(px)} ${f1(B - ph - 30)} ${f1(px + 22)} ${f1(B - ph)} Z" fill="${ADOL}" ${O(3)}/>` + falcon(k, px, B - ph - 22, 1.2 + lv * 0.05, s > 0); }
      const by = B - ph + 20;
      g += `<path d="M${f1(cx - ow / 2)} ${f1(by)} H${f1(cx + ow / 2)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(cx - ow / 2)} ${f1(by)} H${f1(cx + ow / 2)}" stroke="${LEA}" stroke-width="5"/><path d="M${f1(cx - ow / 2 + 6)} ${f1(by + 4)} Q${f1(cx - ow / 4)} ${f1(by + 40)} ${f1(cx - 4)} ${f1(by + 4)} M${f1(cx + 4)} ${f1(by + 4)} Q${f1(cx + ow / 4)} ${f1(by + 40)} ${f1(cx + ow / 2 - 6)} ${f1(by + 4)}" fill="${RED}" stroke="${INK}" stroke-width="2.5"/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(by - 16)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 46;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${NAVY}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, CLOTH);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = adobe(k, f, { sign: 'РАТУША', signBg: '#6a2a1a', perch: false });
      let g = h.g;
      if (lv >= 2) { const sy = h.top - h.rh * 0.42; g += `<path d="M${f1(h.cx - 24)} ${f1(sy - 20)} h48 v26 Q${f1(h.cx)} ${f1(sy + 24)} ${f1(h.cx - 24)} ${f1(sy + 6)} Z" fill="${NAVY}" ${O(2.5)}/><path d="M${f1(h.cx - 18)} ${f1(sy - 6)} q18 -8 36 0 M${f1(h.cx)} ${f1(sy - 12)} v20" stroke="${lv >= 5 ? k.GOLD : ADOL}" stroke-width="4" fill="none"/>`; }
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = adobe(k, f, { sign: 'ТРЕНЕР', signBg: '#7a2a1a' });
      let g = h.g;
      if (lv >= 2) { const bx = f.x0 - 40; g += `<path d="M${f1(bx)} ${h.B} V${h.B - 130} l40 -10" stroke="${INK}" stroke-width="6" fill="none"/><path d="M${f1(bx + 40)} ${h.B - 140} v30" stroke="${INK}" stroke-width="1.5"/><path d="M${f1(bx + 32)} ${h.B - 110} q8 -10 16 0 q-8 10 -16 0 Z" fill="${FALL}" ${O(2)}/>` + falcon(k, bx + 20, h.B - 150, 0.8, true); }
      for (let i = 0; i < Math.min(lv, 3) - 1; i++) g += perch(k, f.x1 + 60 + i * 34, h.B, 70, true);
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0 + 6, top + 10, w - 12, B, 'clay') + `<path d="M${f1(x0)} ${f1(top + 10)} Q${f1(cx)} ${f1(top - 20)} ${f1(x1)} ${f1(top + 10)} Z" fill="${ADOL}" ${O(3)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = top + 30 + Math.floor(i / 3) * 52, nw = Math.min(48, (w - 60) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.84)}" fill="${CLOTH}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 12)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 24)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/><path d="M${f1(nx + nw / 2)} ${f1(ny + 2)} l10 -16 q-4 10 -10 16" fill="${FALL}" stroke="${FAL}" stroke-width="1.5"/>`; }
      if (lv >= 3) g += falcon(k, cx, top - 6, 0.9, false, true);
      k.signId('board'); g += k.signLv(cx, B - 30, Math.min(w - 10, 140), 'ДОСКА', lv, 20, NAVY);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const silo = (m, r, h) => `<path d="M${f1(m - r)} ${B} V${f1(B - h + r)} Q${f1(m - r)} ${f1(B - h - r * 0.3)} ${f1(m)} ${f1(B - h - r * 0.3)} Q${f1(m + r)} ${f1(B - h - r * 0.3)} ${f1(m + r)} ${f1(B - h + r)} V${B} Z" fill="${ADO}" ${O()}/><path d="M${f1(m - r * 0.4)} ${f1(B - h + r * 0.4)} q${f1(r * 0.3)} -${f1(r * 0.3)} ${f1(r * 0.7)} -${f1(r * 0.3)}" stroke="#f6dcb0" stroke-width="5" fill="none" opacity=".6"/><path d="M${f1(m - 10)} ${f1(B - h * 0.6)} h20 v14 h-20 Z" fill="${NAVY}" ${O(2)}/>`;
      let g = '';
      if (lv >= 4) g += silo(x1 - w * 0.12, w * 0.14, f.wall * 0.7);
      g += silo(x0 + w * 0.2, w * 0.18, f.wall * 0.85) + silo(cx + w * 0.08, w * 0.26, f.wall + 10);
      g += k.door(cx + w * 0.08, B, 46 + lv * 2, 60 + lv * 4, NAVY);
      if (lv >= 5) g += `<circle cx="${f1(cx + w * 0.08)}" cy="${f1(B - f.wall - 26)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx + w * 0.08, B - f.wall * 0.5, Math.min(w * 0.5, 130), 'СКЛАД', lv, 19, NAVY);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), ADOD);
      const h = adobe(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, perch: false, roofH: Math.min(60 + lv * 8, f.up - 24) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m)} ${f1(t - 26)} V${f1(t)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(m)} ${f1(t - 26)} l22 8 l-22 8" fill="${gold ? k.GOLD : RED}" ${O(2)}/><path d="M${f1(a)} ${B} Q${f1(a + (b - a) * 0.12)} ${f1(t + h * 0.3)} ${f1(m)} ${f1(t)} Q${f1(b - (b - a) * 0.12)} ${f1(t + h * 0.3)} ${f1(b)} ${B} Z" fill="${NAVY}" ${O()}/>`;
        s += `<path d="M${f1(a + (b - a) * 0.1)} ${f1(B - h * 0.3)} Q${f1(m)} ${f1(B - h * 0.38)} ${f1(b - (b - a) * 0.1)} ${f1(B - h * 0.3)}" stroke="${CLOTH}" stroke-width="5" fill="none"/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 28)} ${B} Q${f1(cx - 26)} ${f1(B - 80 - lv * 5)} ${f1(cx)} ${f1(B - 92 - lv * 5)} Q${f1(cx + 26)} ${f1(B - 80 - lv * 5)} ${f1(cx + 28)} ${B} Z" fill="#1a1a2a" ${O(3)}/>` + falcon(k, cx, top + 40, 1.1);
      k.signId('tent'); g += k.signLv(cx, top + 80, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, NAVY);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = adobe(k, f, { sign: 'ЛАВКА', signBg: '#2f4a2a', dx: x1 - 44, noWin: true, perch: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${RED}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${LEA}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${LEA}" ${O(3)}/>`;
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 30))); i < n; i++) { const px = ax0 + 18 + i * 30; g += `<path d="M${f1(px)} ${f1(ay + 22)} v10" stroke="${INK}" stroke-width="2"/>` + (i % 2 ? `<path d="M${f1(px - 8)} ${f1(ay + 32)} h16 v24 q-8 8 -16 0 Z" fill="${LEA}" ${O(2)}/>` : `<path d="M${f1(px - 9)} ${f1(ay + 50)} Q${f1(px)} ${f1(ay + 28)} ${f1(px + 9)} ${f1(ay + 50)} Z" fill="${RED}" ${O(2)}/><path d="M${f1(px)} ${f1(ay + 32)} v-5" stroke="#e0a43a" stroke-width="3"/>`); }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall - Math.min(f.up - 40, 30 + lv * 12);
      let g = `<path d="M${f1(x0)} ${B} Q${f1(x0 + w * 0.1)} ${f1(top + 60)} ${f1(cx)} ${f1(top)} Q${f1(x1 - w * 0.1)} ${f1(top + 60)} ${f1(x1)} ${B} Z" fill="${ADO}" ${O()}/>`;
      for (let r = 0; r < 4; r++) { const y = top + 70 + r * 40, hw = (w / 2) * Math.min(1, (y - top) / (B - top) * 1.3) - 16; for (let x = cx - hw + 10; x < cx + hw; x += 26) g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="5" fill="#3a2a1a"/><path d="M${f1(x - 8)} ${f1(y + 7)} h16" stroke="${ADOD}" stroke-width="3"/>`; }
      g += `<circle cx="${f1(cx)}" cy="${f1(top - 14)}" r="14" fill="none" stroke="${lv >= 5 ? k.GOLD : '#c8a050'}" stroke-width="4"/><path d="M${f1(cx - 14)} ${f1(top - 14)} h28 M${f1(cx)} ${f1(top - 28)} v28" stroke="${lv >= 5 ? k.GOLD : '#c8a050'}" stroke-width="2.5"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - 60 + i * 50)} ${f1(top - 40 - (i % 2) * 20)} q8 -8 16 0 q8 -8 16 0" stroke="${FAL}" stroke-width="3" fill="none"/>`;
      g += k.door(cx, B, 40 + lv * 3, 62 + lv * 4, '#2a1e4a');
      k.signId('magic'); g += k.signLv(cx, B - 110, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},
    back(k) {
      const { P, L } = k;
      let g = ''; for (let i = 0; i < 8; i++) { const x = 200 + i * 580; g += `<path d="M${x - 300} 724 Q${x - 80} ${640 - (i % 3) * 20} ${x + 40} ${650 - (i % 2) * 20} Q${x + 160} 660 ${x + 300} 724 Z" fill="#e4b87e" opacity=".8"/>`; }
      for (let i = 0; i < 5; i++) { const x = 600 + i * 800, y = 520 + (i % 2) * 40; g += `<path d="M${x - 18} ${y} q9 -10 18 0 q9 -10 18 0" stroke="${FAL}" stroke-width="3.5" fill="none"/>`; }
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, adobe(k, f, { door: false, noWin: true, perch: false }).g + rwin(k, i % 2 ? a + 44 : x1 - 34, 792 - f.wall + 40, 12) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, NAVY) + (i % 2 ? '' : perch(k, x1 + 20, 794, 80, true)));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + falcon(k, lot.x0 + 10, 664, 0.8);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = adobe(k, f, { door: false, noWin: true, perch: false }).g + rwin(k, c.v % 2 ? x0 + 34 : x1 - 34, 795 - f.wall + 40, 12) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, NAVY);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(270 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'falcontower') {

        let g = k.ell(x, y + 4, 80, 18) + `<path d="M${x - 56} ${y} L${x - 30} ${y - 360} H${x + 30} L${x + 56} ${y} Z" fill="${ADO}" ${O(4.5)}/>`;
        for (const yy of [y - 80, y - 170, y - 260]) g += `<path d="M${x - 50 + (y - yy) * 0.06} ${yy} h${100 - (y - yy) * 0.12}" stroke="${ADOD}" stroke-width="5"/><path d="M${x - 60 + (y - yy) * 0.06} ${yy - 4} l-30 0 M${x + 60 - (y - yy) * 0.06} ${yy - 4} l30 0" stroke="${LEA}" stroke-width="6" stroke-linecap="round"/>`;
        g += falcon(k, x - 76, y - 86, 0.9, true, true) + falcon(k, x + 80, y - 176, 0.9, false, true) + falcon(k, x - 68, y - 266, 0.8, true);
        g += `<rect x="${x - 44}" y="${y - 380}" width="88" height="22" fill="${ADOL}" ${O(3)}/><path d="M${x - 40} ${y - 380} v-14 M${x - 20} ${y - 380} v-14 M${x} ${y - 380} v-14 M${x + 20} ${y - 380} v-14 M${x + 40} ${y - 380} v-14 M${x - 44} ${y - 394} h88" stroke="${LEA}" stroke-width="4"/>`;
        g += falcon(k, x + 4, y - 396, 2) + rwin(k, x, y - 300, 12) + k.door(x, y, 40, 66, NAVY);
        for (const [dx, dy] of [[-150, -420], [120, -440], [180, -360]]) g += `<path d="M${x + dx - 18} ${y + dy} q9 -10 18 0 q9 -10 18 0" stroke="${FAL}" stroke-width="4" fill="none"/>`;
        return { g, w: 380, h: 470 };
      }
      if (p.k === 'perch') return { g: k.ell(x, y, 16, 5) + perch(k, x, y, 90, p.v % 2), w: 60, h: 130 };
      if (p.k === 'dune') return { g: `<path d="M${f1(x - 60 * s)} ${y} Q${f1(x - 10 * s)} ${f1(y - 40 * s)} ${f1(x + 20 * s)} ${f1(y - 36 * s)} Q${f1(x + 40 * s)} ${f1(y - 30 * s)} ${f1(x + 60 * s)} ${y} Z" fill="#e8c48a"/><path d="M${f1(x - 40 * s)} ${f1(y - 14 * s)} Q${f1(x)} ${f1(y - 40 * s)} ${f1(x + 30 * s)} ${f1(y - 30 * s)}" stroke="#f6dcb0" stroke-width="4" fill="none"/>`, w: 130 * s, h: 50 * s, flat: true };
      if (p.k === 'palm2') { let g = k.ell(x, y, 26 * s, 7) + `<path d="M${x - 6} ${y} Q${x - 14} ${f1(y - 120 * s)} ${x + 6} ${f1(y - 220 * s)}" stroke="${INK}" stroke-width="${f1(14 * s)}" fill="none"/><path d="M${x - 6} ${y} Q${x - 14} ${f1(y - 120 * s)} ${x + 6} ${f1(y - 220 * s)}" stroke="#a87a4a" stroke-width="${f1(9 * s)}" fill="none"/>`; for (let i = 0; i < 6; i++) { const a = -Math.PI * (0.1 + i * 0.16); g += `<path d="M${x + 6} ${f1(y - 220 * s)} q${f1(Math.cos(a) * 50 * s)} ${f1(Math.sin(a) * 40 * s - 10)} ${f1(Math.cos(a) * 90 * s)} ${f1(Math.sin(a) * 20 * s + 30 * s)}" stroke="#4f8f3a" stroke-width="${f1(10 * s)}" fill="none" stroke-linecap="round"/>`; } return { g, w: 200 * s, h: 250 * s }; }
      return null;
    },
  };

  return {
    id: 'd115', ver: 1, name: 'Песчово', layout, art,
    story: 'Деревня сокольников среди барханов: глинобитные дома под куполами, у дверей - присады с соколами в клобучках. Две тропы сходятся клином вниз, к Соколиной башне с жердями-присадами - вокруг неё всегда кружат соколы, и по ним в барханах находят дорогу.',
  };
});
