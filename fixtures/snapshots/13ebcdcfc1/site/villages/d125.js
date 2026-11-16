



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const MUD = '#c8743e', MUDL = '#de9058', MUDD = '#9a5228', BEAM = '#5a3a22', IND = '#2a3a7a', INDL = '#4a5aa8', SUN = '#f0b83a', CLOTH = '#f4e8cc', STONE = '#d8c8a8', STONED = '#a8987a';
  const KINDS = { obelisk2: { foot: [44, 16], tall: 420 }, palm3: { foot: [22, 9], tall: 260, tree: true }, jar: { foot: [20, 8], tall: 50 }, sundisc: { foot: [14, 6], tall: 140 } };

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
        storage: { x0: 2000, x1: 2280, B: 1170 },
        tent: { x0: 3540, x1: 3880, B: 1200 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 34, pts: [[1460, 908], [1480, 1100], [1560, 1244], [2200, 1240], [2700, 1214], [3200, 1234], [3710, 1290], [3990, 1250], [3990, 908]] },
        { k: 'lane', w: 32, pts: [[1500, 1160], [1320, 1290]] },
      ],
      plazas: [{ k: 'central', x: 1150, y: 1346, rx: 200, ry: 80, mark: 'obelisk2', ms: 1 }],
      water: [{ k: 'oasis', e: [2700, 1372, 360, 66] }],
      kinds: KINDS,
      props: [['palm3', 2290, 1300, 1.1], ['palm3', 3120, 1320], ['palm3', 2460, 1450, 0.9], ['palm3', 2960, 1454], ['jar', 2360, 1400], ['sundisc', 1900, 1300], ['jar', 1700, 1330], ['sundisc', 1420, 1340]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 500, x1: 710, base: 1446 }, { x0: 3300, x1: 3500, base: 1450 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['palm3', 'rock', 'jar', 'cactus', 'bush'], n: 16, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'jar'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1480, 1700], [1740, 1960], [2320, 2560], [2600, 2820], [3480, 3720], [3770, 4000]] },
    };
  }

   
  const sun = (k, x, y, r, gold) => { const { f1, O } = k; let d = ''; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; d += `M${f1(x + Math.cos(a) * r * 1.2)} ${f1(y + Math.sin(a) * r * 1.2)} L${f1(x + Math.cos(a) * r * 1.6)} ${f1(y + Math.sin(a) * r * 1.6)}`; } return `<path d="${d}" stroke="${gold ? k.GOLD : SUN}" stroke-width="${f1(Math.max(2, r * 0.18))}" stroke-linecap="round"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${gold ? k.GOLD : SUN}" ${O(2)}/>`; };
  const torons = (k, x0, x1, y) => { const { f1 } = k; let d = ''; for (let x = x0 + 12; x < x1 - 4; x += 24) d += `M${f1(x)} ${f1(y)} h10`; return `<path d="${d}" stroke="${BEAM}" stroke-width="7" stroke-linecap="round"/>`; };
  const pinn = (k, x, y, w, h) => { const { f1, O } = k; return `<path d="M${f1(x - w / 2)} ${f1(y)} L${f1(x - w * 0.3)} ${f1(y - h)} Q${f1(x)} ${f1(y - h - w * 0.5)} ${f1(x + w * 0.3)} ${f1(y - h)} L${f1(x + w / 2)} ${f1(y)} Z" fill="${MUDL}" ${O(3)}/><circle cx="${f1(x)}" cy="${f1(y - h - w * 0.4)}" r="${f1(w * 0.18)}" fill="${CLOTH}" ${O(1.5)}/>`; };
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return `<rect x="${f1(x - 5)}" y="${f1(y - 5)}" width="${f1(w + 10)}" height="${f1(h + 10)}" fill="${MUDD}" ${O(2.5)}/>` + k.winLit(x, y, w, h, true) + (lv >= 2 ? `<path d="M${f1(x)} ${f1(y + h * 0.5)} h${f1(w)} M${f1(x + w / 2)} ${f1(y)} v${f1(h)}" stroke="${IND}" stroke-width="3"/>` : '');
  }

  function mudHouse(k, f, o = {}) {
    const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    let g = `<path d="M${f1(x0 - 6)} ${B} L${f1(x0 + 4)} ${f1(top)} H${f1(x1 - 4)} L${f1(x1 + 6)} ${B} Z" fill="${MUD}" ${O()}/><path d="M${f1(x0 + w * 0.3)} ${f1(top + 30)} q-6 30 0 60 M${f1(x1 - w * 0.25)} ${f1(top + 50)} q6 24 0 50" stroke="${MUDD}" stroke-width="3" fill="none" opacity=".6"/>`;
    const np = Math.max(2, Math.min(2 + (lv >= 3 ? 1 : 0) + (lv >= 5 ? 2 : 0), Math.floor(w / 50)));
    for (let i = 0; i < np; i++) { const x = x0 + 8 + i * (w - 16) / (np - 1); g += `<path d="M${f1(x - 10)} ${B} V${f1(top + 4)} H${f1(x + 10)} V${B} Z" fill="${MUDL}" ${O(2.5)}/>` + pinn(k, x, top + 4, 22, 22 + lv * 4); }
    g += torons(k, x0, x1, top + 24) + (lv >= 3 ? torons(k, x0 + 12, x1, top + f.wall * 0.55) : '');
    const ww = [24, 28, 30, 32, 34][lv - 1], wh = [28, 34, 38, 42, 46][lv - 1], wy = top + Math.max(36, (f.wall - wh) * 0.4);
    if (!o.noWin) for (const x of [x0 + 26, x1 - 26 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) { g += k.bigDoor(cx, B, lv, IND, 0.92); if (lv >= 2) g += sun(k, cx, B - [0, 116, 124, 130, 136][lv - 1] - 14, 9 + lv, lv >= 5); }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), top + 40 + (lv >= 3 ? 10 : 0), Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || IND);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 12, 6);
    return { g, top, cx, B };
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 34], [cx + ow / 2 + 34, x1]]) if (b - a > 12) g += `<rect x="${f1(a)}" y="${B - 56}" width="${f1(b - a)}" height="56" fill="${MUD}" ${O(3)}/>` + torons(k, a, b, B - 40);
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 18); g += `<path d="M${f1(px - 26)} ${B} L${f1(px - 16)} ${f1(B - ph)} H${f1(px + 16)} L${f1(px + 26)} ${B} Z" fill="${MUD}" ${O(4)}/>` + pinn(k, px, B - ph, 32, 30 + lv * 6) + torons(k, px - 22, px + 22, B - ph * 0.6); }
      const by = B - ph + 20;
      g += `<path d="M${f1(cx - ow / 2 - 4)} ${f1(by)} H${f1(cx + ow / 2 + 4)}" stroke="${BEAM}" stroke-width="14"/>` + sun(k, cx, by - 30, 14 + lv * 2, lv >= 5);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 16;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${IND}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, SUN);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = mudHouse(k, f, { sign: 'РАТУША', signBg: '#6a2a1a' });
      let g = h.g;
      const th = 60 + lv * 14; g += `<path d="M${f1(h.cx - 22)} ${f1(h.top + 4)} L${f1(h.cx - 16)} ${f1(h.top - th)} H${f1(h.cx + 16)} L${f1(h.cx + 22)} ${f1(h.top + 4)} Z" fill="${MUD}" ${O(3)}/>` + torons(k, h.cx - 18, h.cx + 18, h.top - th * 0.5) + pinn(k, h.cx, h.top - th, 30, 26) + sun(k, h.cx, h.top - th * 0.25, 10 + lv * 2, lv >= 5);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = mudHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#7a2a1a' });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} V${h.B - 130}" stroke="${INK}" stroke-width="5"/><path d="M${f1(sx)} ${h.B} V${h.B - 130}" stroke="#a87a4a" stroke-width="2.5"/><path d="M${f1(sx - 5)} ${h.B - 130} l5 -16 l5 16 Z" fill="#9a9eac" ${O(1.5)}/>`; }
      if (lv >= 2) { const bx = f.x0 - 40; g += `<path d="M${f1(bx - 22)} ${h.B} L${f1(bx)} ${h.B - 80} L${f1(bx + 22)} ${h.B}" stroke="${INK}" stroke-width="5" fill="none"/><circle cx="${f1(bx)}" cy="${h.B - 84}" r="26" fill="#c8a06a" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 84}" r="14" fill="none" stroke="${IND}" stroke-width="4"/><circle cx="${f1(bx)}" cy="${h.B - 84}" r="4" fill="${IND}"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<path d="M${f1(x0)} ${B} L${f1(x0 + 6)} ${f1(top + 10)} H${f1(x1 - 6)} L${f1(x1)} ${B} Z" fill="${MUD}" ${O(4)}/>` + pinn(k, x0 + 12, top + 10, 20, 20) + pinn(k, x1 - 12, top + 10, 20, 20);
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 24 + (i % 3) * (w - 48) / 3, ny = top + 36 + Math.floor(i / 3) * 52, nw = Math.min(46, (w - 60) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.84)}" fill="${CLOTH}" ${O(2.5)}/><path d="M${f1(nx - 3)} ${f1(ny)} h${f1(nw + 6)} M${f1(nx - 3)} ${f1(ny + nw * 0.84)} h${f1(nw + 6)}" stroke="${BEAM}" stroke-width="5" stroke-linecap="round"/><path d="M${f1(nx + 6)} ${f1(ny + 12)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 24)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      if (lv >= 3) g += sun(k, cx, top - 6, 12, lv >= 5);
      k.signId('board'); g += k.signLv(cx, B - 26, Math.min(w - 10, 140), 'ДОСКА', lv, 20, IND);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const gran = (m, r, h) => `<path d="M${f1(m - r)} ${B} Q${f1(m - r * 1.2)} ${f1(B - h * 0.6)} ${f1(m - r * 0.8)} ${f1(B - h)} H${f1(m + r * 0.8)} Q${f1(m + r * 1.2)} ${f1(B - h * 0.6)} ${f1(m + r)} ${B} Z" fill="${MUD}" ${O()}/><path d="M${f1(m - r * 1.1)} ${f1(B - h + 6)} L${f1(m)} ${f1(B - h - r * 1.1)} L${f1(m + r * 1.1)} ${f1(B - h + 6)} Z" fill="#d8b866" ${O(3)}/><path d="M${f1(m - r * 0.5)} ${f1(B - h - r * 0.4)} l${f1(r * 0.5)} ${f1(-r * 0.3)} l${f1(r * 0.5)} ${f1(r * 0.3)}" stroke="#a88a3a" stroke-width="3" fill="none"/>`;
      let g = '';
      if (lv >= 4) g += gran(x1 - w * 0.12, w * 0.12, f.wall * 0.72);
      g += gran(x0 + w * 0.2, w * 0.17, f.wall * 0.86) + gran(cx + w * 0.06, w * 0.22, f.wall);
      g += k.door(cx + w * 0.06, B, 44 + lv * 2, 60 + lv * 4, IND) + torons(k, cx - w * 0.12, cx + w * 0.24, B - f.wall * 0.6);
      if (lv >= 5) g += sun(k, cx + w * 0.06, B - f.wall - w * 0.3, 10, true);
      k.signId('storage'); g += k.signLv(cx + w * 0.06, B - f.wall * 0.42, Math.min(w * 0.5, 130), 'СКЛАД', lv, 19, IND);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), MUDD);
      const h = mudHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(a + 10)} ${B} V${f1(t + 20)} M${f1(b - 10)} ${B} V${f1(t + 20)} M${f1(m)} ${B} V${f1(t)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(a - 10)} ${f1(t + 30)} Q${f1(a + (b - a) * 0.25)} ${f1(t - 6)} ${f1(m)} ${f1(t)} Q${f1(b - (b - a) * 0.25)} ${f1(t - 6)} ${f1(b + 10)} ${f1(t + 30)} L${f1(b + 4)} ${f1(t + 50)} H${f1(a - 4)} Z" fill="#b8784a" ${O()}/>`;
        s += `<rect x="${f1(a + 4)}" y="${f1(t + 50)}" width="${f1(b - a - 8)}" height="${f1(B - t - 50)}" fill="${IND}" opacity=".85"/><path d="M${f1(a + 4)} ${f1(t + 64)} h${f1(b - a - 8)}" stroke="${INDL}" stroke-width="4"/>`;
        if (gold) s += sun(k, m, t - 18, 8, true);
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.62, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.58, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 20 + lv * 8), lv >= 5) + `<rect x="${f1(cx - 26)}" y="${f1(B - 80 - lv * 4)}" width="52" height="${f1(80 + lv * 4)}" fill="#1a1a2a" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 40, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, IND);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = mudHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f4a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(100, f.wall * 0.62);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${IND}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${BEAM}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${BEAM}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(4, lv + 1); i++) { const px = ax0 + 22 + i * 30; g += i % 2 ? `<rect x="${f1(px - 12)}" y="${h.B - 50}" width="24" height="20" rx="8" fill="${INDL}" ${O(2)}/>` : `<path d="M${f1(px - 13)} ${h.B - 30} l3 -16 h20 l3 16 Z" fill="#c8a06a" ${O(2)}/>` + [[-6, -50], [0, -52], [6, -50]].map(([dx, dy]) => `<circle cx="${f1(px + dx)}" cy="${h.B + dy}" r="4" fill="#6a2a1a"/>`).join(''); }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall - Math.min(f.up - 60, 20 + lv * 10);
      let g = `<path d="M${f1(x0 + 10)} ${B} L${f1(x0 + w * 0.22)} ${f1(top)} H${f1(x1 - w * 0.22)} L${f1(x1 - 10)} ${B} Z" fill="${MUD}" ${O()}/>` + torons(k, x0 + w * 0.2, x1 - w * 0.2, top + 40) + torons(k, x0 + w * 0.16, x1 - w * 0.16, top + 110);
      g += pinn(k, x0 + w * 0.28, top, 20, 20) + pinn(k, x1 - w * 0.28, top, 20, 20) + sun(k, cx, top - 30, 18 + lv * 2, lv >= 5);
      g += `<circle cx="${f1(cx)}" cy="${f1(top + 74)}" r="26" fill="${CLOTH}" ${O(2.5)}/><path d="M${f1(cx)} ${f1(top + 74)} L${f1(cx + 20)} ${f1(top + 62)}" stroke="${INK}" stroke-width="4"/>`;
      let d = ''; for (let i = 0; i < 8; i++) { const a = -Math.PI + i * Math.PI / 7; d += `M${f1(cx + Math.cos(a) * 20)} ${f1(top + 74 + Math.sin(a) * 20)} L${f1(cx + Math.cos(a) * 25)} ${f1(top + 74 + Math.sin(a) * 25)}`; } g += `<path d="${d}" stroke="${INK}" stroke-width="2"/>`;
      g += k.door(cx, B, 40 + lv * 2, 62 + lv * 4, IND);
      k.signId('magic'); g += k.signLv(cx, B - 110, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},
    back(k) {
      const { P, L } = k;
      let g = `<circle cx="3400" cy="420" r="90" fill="${SUN}" opacity=".5"/><circle cx="3400" cy="420" r="150" fill="${SUN}" opacity=".15"/>`;
      for (let i = 0; i < 9; i++) { const x = 200 + i * 520; g += `<path d="M${x - 260} 724 Q${x - 60} ${646 - (i % 3) * 20} ${x + 40} ${652 - (i % 2) * 16} Q${x + 160} 664 ${x + 260} 724 Z" fill="#e4a868" opacity=".8"/>`; }
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 96 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, mudHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 40 : x1 - 56, 792 - f.wall + 44, 24, 30, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, IND));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + sun(k, lot.x0 + 10, 664, 8);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 20), up: 100, lv: 2 };
      const g0 = mudHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 40 : x1 - 56, 795 - f.wall + 44, 24, 30, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, IND);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(270 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'obelisk2') {

        let g = k.ell(x, y + 4, 90, 18) + `<rect x="${x - 70}" y="${y - 20}" width="140" height="20" fill="${STONED}" ${O(3.5)}/><rect x="${x - 54}" y="${y - 38}" width="108" height="18" fill="${STONE}" ${O(3.5)}/>`;
        g += `<path d="M${x - 30} ${y - 38} L${x - 20} ${y - 330} L${x} ${y - 360} L${x + 20} ${y - 330} L${x + 30} ${y - 38} Z" fill="${STONE}" ${O(4.5)}/><path d="M${x} ${y - 360} L${x + 4} ${y - 38}" stroke="${STONED}" stroke-width="3"/>`;
        let d = ''; for (let i = 0; i < 9; i++) { const yy = y - 80 - i * 26, hw = 18 - i * 1.0; d += `M${f1(x - hw + 4)} ${yy} h${f1(hw * 0.6)} M${f1(x + 2)} ${yy - 8} v10 M${f1(x + 6)} ${yy} l${f1(hw * 0.4)} -6`; }
        g += `<path d="${d}" stroke="${SUN}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x - 24} ${y - 300} h48" stroke="${SUN}" stroke-width="2" opacity=".5"/>` + sun(k, x, y - 390, 18);
        for (const dx of [-60, -40, 44, 64]) g += `<path d="M${x + dx - 9} ${y - 2} q-4 -16 4 -24 h10 q8 8 4 24 Z" fill="${MUD}" ${O(2)}/>`;
        return { g, w: 220, h: 440 };
      }
      if (p.k === 'palm3') { let g = k.ell(x, y, 26 * s, 7) + `<path d="M${x - 6} ${y} Q${x - 16} ${f1(y - 130 * s)} ${x + 4} ${f1(y - 230 * s)}" stroke="${INK}" stroke-width="${f1(15 * s)}" fill="none"/><path d="M${x - 6} ${y} Q${x - 16} ${f1(y - 130 * s)} ${x + 4} ${f1(y - 230 * s)}" stroke="#a87a4a" stroke-width="${f1(10 * s)}" fill="none"/>`; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + i * 0.15); g += `<path d="M${x + 4} ${f1(y - 230 * s)} q${f1(Math.cos(a) * 50 * s)} ${f1(Math.sin(a) * 40 * s - 10)} ${f1(Math.cos(a) * 96 * s)} ${f1(Math.sin(a) * 20 * s + 34 * s)}" stroke="#3f7a34" stroke-width="${f1(11 * s)}" fill="none" stroke-linecap="round"/>`; } g += `<circle cx="${x}" cy="${f1(y - 222 * s)}" r="${f1(7 * s)}" fill="#8a4a2a"/><circle cx="${x + 10}" cy="${f1(y - 218 * s)}" r="${f1(7 * s)}" fill="#8a4a2a"/>`; return { g, w: 220 * s, h: 260 * s }; }
      if (p.k === 'jar') return { g: k.ell(x, y, 20, 5) + `<path d="M${x - 12} ${y} q-8 -24 4 -38 h16 q12 14 4 38 Z" fill="${MUD}" ${O(2.5)}/><path d="M${x - 8} ${y - 38} h16" stroke="${MUDD}" stroke-width="4"/>`, w: 50, h: 50, flat: true };
      if (p.k === 'sundisc') return { g: k.ell(x, y, 14, 5) + `<path d="M${x} ${y} V${y - 100}" stroke="${INK}" stroke-width="7"/><path d="M${x} ${y} V${y - 100}" stroke="${BEAM}" stroke-width="3.5"/>` + sun(k, x, y - 112, 12), w: 70, h: 140 };
      return null;
    },
  };

  return {
    id: 'd125', ver: 1, name: 'Жарец', layout, art,
    story: 'Деревня у оазиса под палящим солнцем: глиняные дома с контрфорсами, из стен торчат балки-тороны, крыши венчают глиняные шпили. Улица полумесяцем огибает оазис, а у воды стоит Обелиск клятвы - на нём высечена старая клятва беречь воду, и в полдень письмена горят, как солнце.',
  };
});
