



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const SND = '#e0b880', SNDL = '#f0d0a0', SNDD = '#b88a56', TL = '#2a7a8a', TLD = '#1a5060', CRP = '#a83a2a', CRPL = '#d8a040', WOOD = '#7a4a2a', BRASS = '#d8a84a', CLOTH = '#f4e8cc';
  const KINDS = { cwell: { foot: [80, 24], tall: 240 }, camel: { foot: [50, 12], tall: 110 }, well2: { foot: [34, 12], tall: 120 }, bales: { foot: [36, 10], tall: 50 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1180 },
        hall: { x0: 1262, x1: 1442 },
        trainer: { x0: 1840, x1: 2120 },
        magic: { x0: 2190, x1: 2420 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1510, x1: 1770, B: 1300 },
        tent: { x0: 2620, x1: 2900, B: 1300 },
        storage: { x0: 3500, x1: 3780, B: 1300 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'cross', w: 32, pts: [[2200, 912], [2200, 1196]] },
        { k: 'lane', w: 34, pts: [[1250, 908], [1300, 1100], [1360, 1400], [3990, 1400], [3990, 908]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1296, rx: 340, ry: 104, mark: 'cwell', ms: 1, shape: 'rect' }],
      kinds: KINDS,
      props: [['camel', 1980, 1340], ['camel', 2420, 1350], ['bales', 2480, 1240], ['well2', 3200, 1250], ['camel', 3320, 1280], ['well2', 700, 1200], ['bales', 1100, 1300]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 500, x1: 710, base: 1446 }, { x0: 880, x1: 1090, base: 1450 }],
      fill: [{ k: ['palm', 'rock', 'bales', 'cactus', 'well2'], n: 14, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'pot'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[2450, 2610], [2960, 3200], [3240, 3460], [3500, 3720], [3770, 4000]], arcade: [1860, 2540, 1186] },
    };
  }

   
  const arch = (x, y, w, h) => `M${x - w / 2} ${y + h} V${y + w * 0.45} Q${x - w / 2} ${y} ${x} ${y - w * 0.1} Q${x + w / 2} ${y} ${x + w / 2} ${y + w * 0.45} V${y + h} Z`;
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k, cx = x + w / 2;
    let g = `<path d="${arch(cx, y - 4, w + 10, h + 8)}" fill="${SNDD}" ${O(2.5)}/><path d="${arch(cx, y, w, h)}" fill="${lv >= 2 ? '#ffd27a' : '#6a5040'}" ${O(2)}/>`;
    if (lv >= 2) { let d = ''; for (let i = 1; i < 4; i++) d += `M${f1(x + w * i / 4)} ${f1(y + w * 0.2)} V${f1(y + h)} M${f1(x)} ${f1(y + h * i / 4 + w * 0.1)} H${f1(x + w)}`; g += `<path d="${d}" stroke="${WOOD}" stroke-width="2.5"/>`; }
    return g;
  }
  const carpet = (k, x, y, w, h) => { const { f1, O } = k; return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${CRP}" ${O(2)}/><rect x="${f1(x + 5)}" y="${f1(y + 5)}" width="${f1(w - 10)}" height="${f1(h - 10)}" fill="none" stroke="${CRPL}" stroke-width="3"/><path d="M${f1(x + w / 2)} ${f1(y + h * 0.25)} l${f1(w * 0.2)} ${f1(h * 0.25)} l${f1(-w * 0.2)} ${f1(h * 0.25)} l${f1(-w * 0.2)} ${f1(-h * 0.25)} Z" fill="${TL}"/><path d="M${f1(x + 3)} ${f1(y + h)} v6 M${f1(x + w / 2)} ${f1(y + h)} v6 M${f1(x + w - 3)} ${f1(y + h)} v6" stroke="${CRPL}" stroke-width="2"/>`; };

  function khanHouse(k, f, o = {}) {
    const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    let g = k.wall(x0, top, w, B, 'stone') + `<rect x="${x0}" y="${top}" width="${w}" height="${f.wall}" fill="${SND}" opacity=".4"/>`;
    g += `<rect x="${f1(x0 - 8)}" y="${f1(top - 16)}" width="${f1(w + 16)}" height="18" fill="${SNDL}" ${O(3)}/><rect x="${f1(x0)}" y="${f1(top + 2)}" width="${f1(w)}" height="12" fill="${TL}"/>`;
    let tz = ''; for (let x = x0 + 6; x < x1 - 4; x += 16) tz += `M${f1(x)} ${f1(top + 8)} l4 -4 l4 4 l-4 4 Z`; g += `<path d="${tz}" fill="${CLOTH}"/><path d="M${f1(x0)} ${f1(top + 14)} h${f1(w)}" stroke="${TLD}" stroke-width="2"/>`;
    if (o.turret !== false && lv >= 3) { const tx = x1 - 30; g += `<rect x="${f1(tx - 16)}" y="${f1(top - 60 - lv * 4)}" width="32" height="${f1(46 + lv * 4)}" fill="${SNDL}" ${O(3)}/><path d="M${f1(tx - 20)} ${f1(top - 60 - lv * 4)} Q${f1(tx)} ${f1(top - 96 - lv * 4)} ${f1(tx + 20)} ${f1(top - 60 - lv * 4)} Z" fill="${lv >= 5 ? k.GOLD : TL}" ${O(3)}/>` + win(k, tx - 7, top - 50 - lv * 4, 14, 22, lv); }
    const ww = [24, 28, 30, 32, 34][lv - 1], wh = [34, 40, 44, 48, 52][lv - 1], wy = top + Math.max(26, (f.wall - wh) * 0.4);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) { const dw = [52, 58, 62, 66, 70][lv - 1], dh = [76, 86, 94, 100, 106][lv - 1]; g += `<path d="${arch(cx, B - dh - 8, dw + 16, dh + 8)}" fill="${SNDD}" ${O(3)}/><path d="${arch(cx, B - dh, dw, dh)}" fill="${TLD}" ${O(3)}/><path d="M${f1(cx)} ${f1(B - dh + 4)} V${B}" stroke="#0e3040" stroke-width="2.5"/><circle cx="${f1(cx + dw * 0.3)}" cy="${f1(B - dh * 0.45)}" r="3.5" fill="${BRASS}"/>`; }
    if (o.carpet !== false && lv >= 2) g += carpet(k, o.cx2 != null ? o.cx2 : x0 + 14, top + 28, 34, 50);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), top - 6 - (lv >= 3 ? 0 : 0), Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || TLD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 22, 6);
    return { g, top, cx, B };
  }
  const lamp = (k, x, y, s = 1) => k.use(k.sym('d124lamp', () => { const { O } = k; return `<path d="M0 -4 v6" stroke="#2a1e14" stroke-width="2"/><path d="M-8 2 h16 l-3 18 h-10 Z" fill="${BRASS}" ${O(2)}/><path d="M-5 6 h10 M-4 12 h8" stroke="#8a6a2a" stroke-width="1.5"/><circle cx="0" cy="12" r="14" fill="#ffd27a" opacity=".25"/>`; }), x, y, s);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = `<path d="M${f1(x0 + 10)} ${B} V${f1(B - ph)} H${f1(x1 - 10)} V${B} Z" fill="${SND}" ${O(4)}/><rect x="${f1(cx - ow / 2 - 16)}" y="${f1(B - ph + 30)}" width="${f1(ow + 32)}" height="${f1(ph - 30)}" fill="${TL}" ${O(3)}/><path d="${arch(cx, B - ph + 50, ow, ph - 50)}" fill="#3a2a1e" ${O(3)}/>`;
      g += `<rect x="${f1(x0 + 4)}" y="${f1(B - ph - 14)}" width="${f1(x1 - x0 - 8)}" height="16" fill="${SNDL}" ${O(3)}/>`;
      if (lv >= 3) for (const sx of [x0 + 22, x1 - 22]) g += `<rect x="${f1(sx - 18)}" y="${f1(B - ph - 70)}" width="36" height="70" fill="${SNDL}" ${O(3)}/><path d="M${f1(sx - 22)} ${f1(B - ph - 70)} Q${f1(sx)} ${f1(B - ph - 110)} ${f1(sx + 22)} ${f1(B - ph - 70)} Z" fill="${lv >= 5 ? k.GOLD : TL}" ${O(3)}/>`;
      if (lv >= 2) for (const s of [-1, 1]) g += lamp(k, cx + s * (ow / 2 + 30), B - ph + 50, 1.2);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 20, nm.length * 15 + 30), ny = B - ph - 2;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${TLD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, CLOTH);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = khanHouse(k, f, { sign: 'РАТУША', signBg: '#6a2a1a', turret: false });
      let g = h.g;
      if (lv >= 2) { const dr = 30 + lv * 5; g += `<path d="M${f1(h.cx - dr)} ${f1(h.top - 16)} Q${f1(h.cx - dr)} ${f1(h.top - 16 - dr * 1.3)} ${f1(h.cx)} ${f1(h.top - 16 - dr * 1.6)} Q${f1(h.cx + dr)} ${f1(h.top - 16 - dr * 1.3)} ${f1(h.cx + dr)} ${f1(h.top - 16)} Z" fill="${lv >= 5 ? k.GOLD : TL}" ${O(3)}/><path d="M${f1(h.cx - dr * 0.7)} ${f1(h.top - 30)} Q${f1(h.cx)} ${f1(h.top - 16 - dr * 1.4)} ${f1(h.cx + dr * 0.7)} ${f1(h.top - 30)}" stroke="${CLOTH}" stroke-width="3" fill="none" opacity=".6"/><path d="M${f1(h.cx)} ${f1(h.top - 16 - dr * 1.6)} v-16" stroke="${BRASS}" stroke-width="4"/>`; }
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = khanHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#7a2a1a' });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} l-3 -130" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${f1(sx)} ${h.B} l-3 -130" stroke="#c8a06a" stroke-width="3" stroke-linecap="round"/>`; }
      if (lv >= 2) g += `<rect x="${f1(f.x0 - 70)}" y="${h.B - 60}" width="54" height="60" rx="6" fill="#c8b07a" ${O(3)}/><circle cx="${f1(f.x0 - 43)}" cy="${h.B - 30}" r="14" fill="none" stroke="${CRP}" stroke-width="4"/>`;
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<rect x="${f1(x0 + 6)}" y="${f1(top + 10)}" width="${f1(w - 12)}" height="${f1(f.wall - 50)}" rx="4" fill="${TL}" ${O(4)}/><rect x="${f1(x0)}" y="${B - 40}" width="${f1(w)}" height="40" fill="${SNDD}" ${O(3)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = top + 26 + Math.floor(i / 3) * 52, nw = Math.min(48, (w - 60) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.84)}" fill="${CLOTH}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 12)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 24)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      g += `<path d="M${f1(x0 - 8)} ${f1(top + 10)} Q${f1(cx)} ${f1(top - 30 - lv * 4)} ${f1(x1 + 8)} ${f1(top + 10)} Z" fill="${CRP}" ${O(3)}/>` + (lv >= 2 ? lamp(k, cx, top + 14, 1) : '');
      k.signId('board'); g += k.signLv(cx, B - 20, Math.min(w - 10, 140), 'ДОСКА', lv, 20, TLD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const h = khanHouse(k, f, { door: false, noWin: true, carpet: false });
      let g = h.g + `<path d="${arch(cx, B - f.wall * 0.7, w * 0.56, f.wall * 0.7)}" fill="#3a2a1e" ${O(3)}/>`;
      for (let i = 0; i < Math.min(lv + 1, 4); i++) g += `<rect x="${f1(cx - w * 0.2 + (i % 2) * w * 0.18)}" y="${f1(B - 30 - Math.floor(i / 2) * 28)}" width="${f1(w * 0.18)}" height="26" rx="5" fill="#c8b07a" ${O(2)}/>`;
      g += carpet(k, x0 + 10, h.top + 26, 30, 46) + carpet(k, x1 - 40, h.top + 26, 30, 46);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(h.top - 30)}" r="10" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx, h.top - 6, Math.min(w - 10, 130), 'СКЛАД', lv, 19, TLD);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), SNDD);
      const h = khanHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, turret: false, carpet: false });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m)} ${f1(t - 26)} V${f1(t)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(a)} ${B} V${f1(B - h * 0.45)} Q${f1(m)} ${f1(t - 10)} ${f1(b)} ${f1(B - h * 0.45)} V${B} Z" fill="${CRP}" ${O()}/><path d="M${f1(a)} ${f1(B - h * 0.45)} Q${f1(m)} ${f1(t - 10)} ${f1(b)} ${f1(B - h * 0.45)}" stroke="${CRPL}" stroke-width="5" fill="none"/>`;
        let fr = ''; for (let x = a + 8; x < b - 4; x += 14) fr += `M${f1(x)} ${f1(B - h * 0.45 + 2)} v10`; s += `<path d="${fr}" stroke="${gold ? k.GOLD : CRPL}" stroke-width="3"/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="${arch(cx, B - 90 - lv * 4, 56, 90 + lv * 4)}" fill="#2a1a14" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, TLD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = khanHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f4a2a', dx: x1 - 44, noWin: true, carpet: false, turret: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      for (let i = 0, n = Math.max(3, Math.round((ax1 - ax0) / 30)); i < n; i++) { const xa = ax0 + (ax1 - ax0) * i / n, xb = ax0 + (ax1 - ax0) * (i + 1) / n; g += `<path d="M${f1(xa)} ${f1(ay)} H${f1(xb)} L${f1(xb + 3)} ${f1(ay + 24)} Q${f1((xa + xb) / 2 + 1)} ${f1(ay + 32)} ${f1(xa + 3)} ${f1(ay + 24)} Z" fill="${i % 2 ? CLOTH : TL}" ${O(2.5)}/>`; }
      g += [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 24)} V${h.B}" stroke="${WOOD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${WOOD}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(3, lv); i++) g += lamp(k, ax0 + 24 + i * 34, ay + 30, 0.9);
      g += carpet(k, ax0 + 10, h.B - 30 - 46, 30, 40);
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall - Math.min(f.up - 40, 20 + lv * 12);
      let g = `<rect x="${f1(cx - w * 0.22)}" y="${f1(top + 40)}" width="${f1(w * 0.44)}" height="${f1(B - top - 40)}" fill="${SNDL}" ${O()}/><rect x="${f1(cx - w * 0.22)}" y="${f1(top + 70)}" width="${f1(w * 0.44)}" height="12" fill="${TL}"/>`;
      g += `<rect x="${f1(cx - w * 0.36)}" y="${f1(top + 30)}" width="${f1(w * 0.72)}" height="12" fill="${SNDD}" ${O(3)}/><path d="M${f1(cx - w * 0.3)} ${f1(top + 30)} v-20 M${f1(cx + w * 0.3)} ${f1(top + 30)} v-20 M${f1(cx - w * 0.36)} ${f1(top + 10)} h${f1(w * 0.72)}" stroke="${WOOD}" stroke-width="4"/>`;
      g += `<rect x="${f1(cx - w * 0.16)}" y="${f1(top - 20)}" width="${f1(w * 0.32)}" height="50" fill="${SNDL}" ${O(3)}/><path d="M${f1(cx - w * 0.2)} ${f1(top - 20)} Q${f1(cx - w * 0.2)} ${f1(top - 70)} ${f1(cx)} ${f1(top - 90)} Q${f1(cx + w * 0.2)} ${f1(top - 70)} ${f1(cx + w * 0.2)} ${f1(top - 20)} Z" fill="${lv >= 5 ? k.GOLD : TL}" ${O(3)}/><path d="M${f1(cx)} ${f1(top - 90)} v-16 m-6 6 a8 8 0 1 0 12 -4" stroke="${BRASS}" stroke-width="3" fill="none"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - 70 + i * 60)} ${f1(top - 50 - (i % 2) * 30)} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="#ffd76a" ${O(1.2)}/>`;
      g += win(k, cx - 11, top + 110, 22, 34, lv) + k.door(cx, B, 40 + lv * 2, 62 + lv * 4, '#2a1e4a');
      k.signId('magic'); g += k.signLv(cx, B - 110, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},

    water(k) {
      const { P, f1, O } = k, [a, b, y] = k.L.hx.arcade;
      let g = '';
      for (let x = a; x < b; x += 68) { const m = x + 34; if (Math.abs(m - 2200) < 50) continue; g += `<path d="M${x} ${y} V${y - 70} H${x + 68} V${y} H${x + 60} V${y - 34} Q${m} ${y - 66} ${x + 8} ${y - 34} V${y} Z" fill="${SND}" ${O(3)}/><path d="M${x} ${y - 70} h68" stroke="${TL}" stroke-width="6"/>`; }
      P(a, b, g, y - 80, y + 4);
      void f1;
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 150) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 96 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, khanHouse(k, f, { door: false, noWin: true, turret: false }).g + win(k, i % 2 ? a + 40 : x1 - 56, 792 - f.wall + 34, 24, 34, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, TLD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + lamp(k, lot.x0 + 10, 650, 1);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 20), up: 100, lv: 2 };
      const g0 = khanHouse(k, f, { door: false, noWin: true, turret: false }).g + win(k, c.v % 2 ? x0 + 60 : x1 - 50, 795 - f.wall + 34, 24, 34, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, TLD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(250 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'cwell') {

        let g = k.ell(x, y + 4, 110, 20);
        for (const dx of [-100, 70]) g += `<rect x="${x + dx}" y="${y - 26}" width="30" height="26" rx="4" fill="${SNDD}" ${O(3)}/><rect x="${x + dx + 4}" y="${y - 22}" width="22" height="8" fill="#5aa8d8"/>`;
        g += `<path d="M${x - 60} ${y} V${y - 60} H${x + 60} V${y} Z" fill="${SND}" ${O(4)}/><rect x="${x - 60}" y="${y - 50}" width="120" height="14" fill="${TL}"/><ellipse cx="${x}" cy="${y - 60}" rx="62" ry="12" fill="#2a4a5a" ${O(3)}/>`;
        g += `<path d="M${x - 54} ${y - 60} V${y - 190} M${x + 54} ${y - 60} V${y - 190}" stroke="${INK}" stroke-width="12"/><path d="M${x - 54} ${y - 60} V${y - 190} M${x + 54} ${y - 60} V${y - 190}" stroke="${SNDL}" stroke-width="7"/><path d="M${x - 70} ${y - 186} Q${x - 70} ${y - 250} ${x} ${y - 270} Q${x + 70} ${y - 250} ${x + 70} ${y - 186} Z" fill="${TL}" ${O(3.5)}/><path d="M${x - 50} ${y - 196} Q${x} ${y - 250} ${x + 50} ${y - 196}" stroke="${CLOTH}" stroke-width="3" fill="none" opacity=".6"/><path d="M${x} ${y - 270} v-18" stroke="${BRASS}" stroke-width="4"/>`;
        g += `<path d="M${x - 54} ${y - 140} H${x + 54}" stroke="${WOOD}" stroke-width="8"/><circle cx="${x + 54}" cy="${y - 140}" r="10" fill="${WOOD}" ${O(2.5)}/><path d="M${x} ${y - 140} V${y - 96}" stroke="${INK}" stroke-width="2"/><path d="M${x - 12} ${y - 96} h24 l-3 22 h-18 Z" fill="${WOOD}" ${O(2)}/>` + lamp(k, x - 54, y - 180, 1) + lamp(k, x + 54, y - 180, 1);
        return { g, w: 260, h: 300 };
      }
      if (p.k === 'camel') { const fl = p.v % 2 ? -1 : 1, X = (dx) => x + dx * fl; return { g: k.ell(x, y, 50, 10) + `<path d="M${X(-40)} ${y - 10} Q${X(-44)} ${y - 40} ${X(-20)} ${y - 44} Q${X(-10)} ${y - 70} ${X(6)} ${y - 46} Q${X(20)} ${y - 60} ${X(30)} ${y - 40} L${X(44)} ${y - 70} L${X(58)} ${y - 66} L${X(50)} ${y - 40} L${X(36)} ${y - 10} Z" fill="#c89a5a" ${O(3)}/><path d="M${X(-30)} ${y - 10} V${y} M${X(-14)} ${y - 10} V${y} M${X(14)} ${y - 10} V${y} M${X(28)} ${y - 10} V${y}" stroke="${INK}" stroke-width="5"/><path d="M${X(-16)} ${y - 46} h28 v10 h-28 Z" fill="${CRP}" ${O(2)}/><circle cx="${X(52)}" cy="${y - 64}" r="2" fill="${INK}"/>`, w: 130, h: 90 }; }
      if (p.k === 'well2') return { g: k.ell(x, y, 34, 8) + `<path d="M${x - 30} ${y} V${y - 30} H${x + 30} V${y} Z" fill="${SND}" ${O(3)}/><ellipse cx="${x}" cy="${y - 30}" rx="30" ry="7" fill="#2a4a5a" ${O(2.5)}/><path d="M${x - 26} ${y - 30} V${y - 100} M${x + 26} ${y - 30} V${y - 100} M${x - 32} ${y - 100} H${x + 32}" stroke="${INK}" stroke-width="6"/><path d="M${x} ${y - 100} v30" stroke="${INK}" stroke-width="2"/><path d="M${x - 8} ${y - 70} h16 l-2 14 h-12 Z" fill="${WOOD}" ${O(2)}/>`, w: 80, h: 120 };
      if (p.k === 'bales') return { g: k.ell(x, y, 36, 8) + `<rect x="${x - 34}" y="${y - 26}" width="34" height="26" rx="5" fill="#c8b07a" ${O(2.5)}/><rect x="${x}" y="${y - 24}" width="32" height="24" rx="5" fill="${CRP}" ${O(2.5)}/><rect x="${x - 18}" y="${y - 48}" width="32" height="22" rx="5" fill="#a8885a" ${O(2.5)}/>`, w: 90, h: 50, flat: true };
      return null;
    },
  };

  return {
    id: 'd124', ver: 1, name: 'Песчень', layout, art,
    story: 'Деревня-караван-сарай на перекрёстке путей скитальцев: дома из песчаника со стрельчатыми арками и резными решётками, на стенах - ковры. Посреди - двор за аркадой, а в нём Великий колодец с воротом и поилками; у колодцев отдыхают верблюды.',
  };
});
