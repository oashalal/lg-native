



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const LOGC = '#8a6446', LOGD = '#5a3e2a', BLUE = '#3a5a9a', WHITE = '#f4f8fc', SNOWD = '#c8d8e8', RED = '#b8402a', HORSE = '#6a4a3a', WOOD = '#7a5a3a';
  const KINDS = { whitehorse: { foot: [90, 24], tall: 300 }, sled: { foot: [44, 10], tall: 50 }, hitch: { foot: [40, 8], tall: 70 }, hay2: { foot: [34, 12], tall: 50 } };

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
        { k: 'lane', w: 34, pts: [[1460, 908], [1480, 1100], [1560, 1240], [2200, 1240], [2900, 1240], [3710, 1290], [3990, 1250], [3990, 908]] },
        { k: 'lane', w: 32, pts: [[1500, 1160], [1320, 1290]] },
      ],
      plazas: [{ k: 'central', x: 1150, y: 1346, rx: 200, ry: 80, mark: 'whitehorse', ms: 1.3 }],
      water: [{ k: 'paddock', e: [2650, 1384, 330, 60], art: 1 }],
      kinds: KINDS,
      props: [['sled', 1900, 1300], ['hitch', 2400, 1180], ['hay2', 3100, 1360], ['sled', 3300, 1420], ['hitch', 900, 1160], ['hay2', 1500, 1420]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 450, x1: 660, base: 1446 }, { x0: 3150, x1: 3360, base: 1452 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['pine', 'drift', 'hay2', 'rock', 'snowman'], n: 14, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'drift'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1480, 1700], [1740, 1960], [2320, 2560], [2600, 2820], [3480, 3720], [3770, 4000]] },
    };
  }

   
  const horseHead = (k, x, y, s, flip, c = WHITE) => k.use(k.sym('d38hh' + c.slice(1), () => { const { O } = k; return `<path d="M0 0 Q-2 -24 10 -36 Q20 -44 30 -40 L34 -30 Q26 -30 22 -24 L26 -12 Q16 -10 12 -2 Z" fill="${c}" ${O(2.5)}/><path d="M12 -38 l-4 -10 l8 6" fill="${c}" ${O(2)}/><circle cx="22" cy="-32" r="2.2" fill="#1e1a22"/><path d="M4 -26 q6 -10 14 -14" stroke="${BLUE}" stroke-width="3" fill="none"/>`; }), x, y, flip ? -s : s, s);
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    let g = k.winLit(x, y, w, h, true) + `<path d="M${f1(x - 8)} ${f1(y - 2)} L${f1(x + w / 2)} ${f1(y - 18)} L${f1(x + w + 8)} ${f1(y - 2)} Z" fill="${WHITE}" ${O(2)}/><rect x="${f1(x - 10)}" y="${f1(y)}" width="9" height="${f1(h)}" fill="${BLUE}" ${O(2)}/><rect x="${f1(x + w + 1)}" y="${f1(y)}" width="9" height="${f1(h)}" fill="${BLUE}" ${O(2)}/>`;
    if (lv >= 3) g += `<path d="M${f1(x - 8)} ${f1(y + h + 6)} h${f1(w + 16)}" stroke="${WHITE}" stroke-width="6"/>`;
    return g;
  }
  const shoe = (k, x, y, s = 1, gold) => `<path d="M${k.f1(x - 10 * s)} ${k.f1(y + 8 * s)} V${k.f1(y)} A${k.f1(10 * s)} ${k.f1(10 * s)} 0 0 1 ${k.f1(x + 10 * s)} ${k.f1(y)} V${k.f1(y + 8 * s)}" stroke="${gold ? k.GOLD : '#9aa4b2'}" stroke-width="${k.f1(5 * s)}" fill="none"/>`;

  function izba(k, f, o = {}) {
    const { f1 } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([80, 94, 106, 116, 124][lv - 1], f.up - 14, w * 0.56));
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + k.roof(x0, x1, top, rh, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#7a7058' : '#4a5a7a', false, '#33405a') + k.snowCap(x0 - 22, x1 + 22, top + 6, rh);
    if (lv >= 2) g += `<path d="M${x0 - 22} ${top + 6} L${f1(cx)} ${f1(top - rh)} L${x1 + 22} ${top + 6}" fill="none" stroke="${WHITE}" stroke-width="6" stroke-linejoin="round"/>` + horseHead(k, cx - 4, top - rh + 4, 0.9 + lv * 0.06, false, lv >= 5 ? k.GOLD : WHITE);
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [30, 36, 40, 44, 48][lv - 1], wy = top + Math.max(24, (f.wall - wh) * 0.38);
    if (!o.noWin) for (const x of [x0 + 24, x1 - 24 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) { g += k.bigDoor(cx, B, lv, LOGD, 0.92); if (lv >= 2) g += shoe(k, cx, B - [0, 112, 120, 126, 132][lv - 1] - 14, 1.1, lv >= 5); }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 30, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || BLUE);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }

  const horse = (k, x, y, s, c, flip) => k.use(k.sym('d38h' + c.slice(1), () => { const { O, INK } = k; return `<path d="M-34 -30 Q-36 -50 -10 -52 H18 Q28 -52 32 -60 L40 -84 Q52 -88 56 -80 L50 -70 L44 -46 Q40 -30 30 -30 Z" fill="${c}" ${O(2.5)}/><path d="M-30 -32 l-4 32 M-18 -32 l2 32 M16 -32 l-2 32 M28 -32 l4 32" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-34 -46 q-16 4 -14 28" stroke="${c === WHITE ? '#c8d0dc' : '#2a1e1a'}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M36 -78 q-8 10 -10 24" stroke="${c === WHITE ? '#c8d0dc' : '#2a1e1a'}" stroke-width="6" fill="none"/><circle cx="48" cy="-78" r="2" fill="${INK}"/>`; }), x, y, flip ? -s : s, s);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) g += `<path d="M${f1(a)} ${B - 50} H${f1(b)} M${f1(a)} ${B - 26} H${f1(b)}" stroke="${INK}" stroke-width="9"/><path d="M${f1(a)} ${B - 50} H${f1(b)} M${f1(a)} ${B - 26} H${f1(b)}" stroke="${WOOD}" stroke-width="5"/><path d="M${f1(a)} ${B - 54} H${f1(b)}" stroke="${WHITE}" stroke-width="5" stroke-linecap="round"/>`;
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 14); g += `<rect x="${f1(px - 13)}" y="${f1(B - ph)}" width="26" height="${f1(ph)}" fill="${LOGC}" ${O(4)}/>` + horseHead(k, px - s * 6, B - ph + 6, 1.3, s > 0, lv >= 5 ? k.GOLD : WHITE); }
      const by = B - ph + 40;
      g += `<path d="M${f1(cx - ow / 2)} ${f1(by)} H${f1(cx + ow / 2)}" stroke="${INK}" stroke-width="12"/><path d="M${f1(cx - ow / 2)} ${f1(by)} H${f1(cx + ow / 2)}" stroke="${BLUE}" stroke-width="7"/>` + shoe(k, cx, by - 20, 1.6, lv >= 5);
      if (lv >= 2) for (let i = 0; i < 3; i++) { const x = cx - 30 + i * 30; g += `<path d="M${f1(x)} ${f1(by + 6)} v10" stroke="${INK}" stroke-width="1.5"/><circle cx="${f1(x)}" cy="${f1(by + 20)}" r="5" fill="#d8a84a" ${O(1.5)}/>`; }
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 32;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${BLUE}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, WHITE);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = izba(k, f, { sign: 'РАТУША', signBg: '#5a1a1a' });
      let g = h.g;
      if (lv >= 3) { for (const s of [-1, 1]) g += `<path d="M${f1(h.cx + s * 64)} ${h.B} V${h.B - 92}" stroke="${INK}" stroke-width="11"/><path d="M${f1(h.cx + s * 64)} ${h.B} V${h.B - 92}" stroke="${WHITE}" stroke-width="6"/>`; g += k.roof(h.cx - 74, h.cx + 74, h.B - 92, 30, 'shingle', BLUE, false, '#24406a') + k.snowCap(h.cx - 90, h.cx + 90, h.B - 88, 30); }
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = izba(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a1a' });
      let g = h.g;
      if (lv >= 2) { const bx = f.x0 - 44; g += `<path d="M${f1(bx - 26)} ${h.B} l10 -46 M${f1(bx + 26)} ${h.B} l-10 -46 M${f1(bx - 30)} ${h.B - 46} h60" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${f1(bx - 34)} ${h.B - 52} h68 v-16 h-68 Z" fill="${LOGC}" ${O(2.5)}/><path d="M${f1(bx + 30)} ${h.B - 68} l14 -26 l8 4 l-8 22" fill="${LOGC}" ${O(2.5)}/><path d="M${f1(bx - 10)} ${h.B - 68} q10 -12 20 0" fill="${RED}" ${O(2)}/>`; }
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(f.x1 + 20 + i * 30)} ${h.B} V${h.B - 50} M${f1(f.x1 + 14 + i * 30)} ${h.B - 40} h40" stroke="${INK}" stroke-width="5"/><path d="M${f1(f.x1 + 14 + i * 30)} ${h.B - 40} h40" stroke="${i % 2 ? RED : WHITE}" stroke-width="3"/>`;
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${LOGD}" ${O(3.5)}/>`;
      const by0 = top + 26, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${BLUE}" ${O(4)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(54, (w - 50) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${WHITE}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      g += shoe(k, x0 + 18, by1 - 18, 0.8) + shoe(k, x1 - 18, by1 - 18, 0.8) + k.roof(x0 - 6, x1 + 6, by0 - 4, Math.min(f.up - 40, 28 + lv * 6), 'shingle', '#4a5a7a', false, '#33405a') + k.snowCap(x0 - 20, x1 + 20, by0, Math.min(f.up - 40, 28 + lv * 6));
      if (lv >= 3) g += horseHead(k, cx - 4, by0 - Math.min(f.up - 40, 28 + lv * 6), 0.8, false, lv >= 5 ? k.GOLD : WHITE);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, BLUE);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0, top, w, B, 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + k.roof(x0, x1, top, Math.min(f.up - 10, 60 + lv * 10), 'shingle', '#4a5a7a', false, '#33405a') + k.snowCap(x0 - 22, x1 + 22, top + 6, Math.min(f.up - 10, 60 + lv * 10));
      const dw = w * 0.5, dh = Math.min(f.wall - 50, 80 + lv * 6);
      g += `<rect x="${f1(cx - dw / 2)}" y="${f1(B - dh)}" width="${f1(dw)}" height="${f1(dh)}" fill="${LOGD}" ${O(3)}/><path d="M${f1(cx - dw / 2)} ${f1(B - dh)} L${f1(cx)} ${B} L${f1(cx + dw / 2)} ${f1(B - dh)} M${f1(cx - dw / 2)} ${B} L${f1(cx)} ${f1(B - dh)} L${f1(cx + dw / 2)} ${B}" stroke="${WHITE}" stroke-width="5"/>`;
      g += `<rect x="${f1(cx - 22)}" y="${f1(top + 10)}" width="44" height="30" fill="#2a1e14" ${O(2.5)}/><path d="M${f1(cx - 26)} ${f1(top + 40)} q10 -26 20 -4 q6 -20 16 -2 q10 -18 16 6" fill="#e0c060" ${O(2)}/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<ellipse cx="${f1(x0 + 22 + i * 4)}" cy="${f1(top + 70 + i * 34)}" rx="14" ry="18" fill="none" stroke="${RED}" stroke-width="6"/>`;
      if (lv >= 4) g += horse(k, x1 + 50, B, 0.8, HORSE);
      if (lv >= 5) g += shoe(k, cx, top - 20, 1.2, true);
      k.signId('storage'); g += k.signLv(cx, top + 56, Math.min(w - 10, 130), 'СКЛАД', lv, 19, BLUE);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#7a8494');
      const h = izba(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, roofH: Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 10) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += shoe(k, mx + mw + 28 + i * 28, h.B - 90, 1);
      void INK;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h, n = 6;
        let s = `<path d="M${f1(m)} ${f1(t - 26)} V${f1(t)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(m)} ${f1(t - 26)} l22 8 l-22 8" fill="${gold ? k.GOLD : RED}" ${O(2)}/>`;
        for (let i = 0; i < n; i++) { const xa = a + (b - a) * i / n, xb = a + (b - a) * (i + 1) / n; s += `<path d="M${f1(xa)} ${B} L${f1(m + (xa - m) * 0.06)} ${f1(t)} L${f1(m + (xb - m) * 0.06)} ${f1(t)} L${f1(xb)} ${B} Z" fill="${i % 2 ? WHITE : BLUE}"/>`; }
        return s + `<path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="none" ${O()}/>` + k.snowCap(m - 30, m + 30, t + 34, 34);
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 28)} ${B} L${f1(cx)} ${f1(B - 92 - lv * 5)} L${f1(cx + 28)} ${B} Z" fill="#1e2a44" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, BLUE);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = izba(k, f, { sign: 'ЛАВКА', signBg: '#2a3a5a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${BLUE}" ${O(3)}/><path d="M${f1(ax0 - 8)} ${f1(ay)} H${f1(ax1 + 8)}" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${LOGD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${LOGC}" ${O(3)}/>`;
      g += `<path d="M${f1(ax0 + 10)} ${h.B - 30} Q${f1((ax0 + ax1) / 2)} ${f1(ay + 10)} ${f1(ax1 - 4)} ${h.B - 30}" stroke="${INK}" stroke-width="14" fill="none"/><path d="M${f1(ax0 + 10)} ${h.B - 30} Q${f1((ax0 + ax1) / 2)} ${f1(ay + 10)} ${f1(ax1 - 4)} ${h.B - 30}" stroke="${RED}" stroke-width="9" fill="none"/>`;
      for (let i = 0; i < Math.min(lv + 1, 4); i++) g += `<circle cx="${f1(ax0 + 24 + i * 24)}" cy="${f1(ay + 40)}" r="6" fill="#d8a84a" ${O(1.5)}/>`;
      if (lv >= 3) g += `<path d="M${f1(x0 - 60)} ${h.B - 40} q30 -24 50 0 l-6 10 h-38 Z" fill="${HORSE}" ${O(2.5)}/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const rh = Math.min(f.up + 20, 80 + lv * 12);
      let g = k.wall(x0 + w * 0.14, top + 30, w * 0.72, B, 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + `<path d="M${f1(x0 + w * 0.06)} ${f1(top + 34)} L${f1(cx)} ${f1(top + 30 - rh)} L${f1(x1 - w * 0.06)} ${f1(top + 34)} Z" fill="${BLUE}" ${O()}/>` + k.snowCap(x0, x1, top + 34, rh);
      g += `<path d="M${f1(cx)} ${f1(top + 30 - rh)} v-30" stroke="${INK}" stroke-width="4"/>` + horseHead(k, cx - 2, top + 30 - rh - 28, 0.8, false, lv >= 5 ? k.GOLD : WHITE);
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - 60 + i * 60)} ${f1(top - rh - 10 - (i % 2) * 20)} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="#ffd76a" ${O(1.2)}/>`;
      g += win(k, cx - 13, top + 70, 26, 34, lv) + k.door(cx, B, 40 + lv * 3, 62 + lv * 4, '#2a1e4a');
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},

    water(k) {
      const { P, f1, O, INK } = k, [x, y, rx, ry] = k.L.water[0].e;
      let g = `<ellipse cx="${x}" cy="${y}" rx="${rx + 16}" ry="${ry + 10}" fill="${SNOWD}"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#e0e8f0"/>`;
      let posts = '', rails = '';
      for (let i = 0; i < 26; i++) { const a = i * Math.PI * 2 / 26, px = x + Math.cos(a) * (rx + 10), py = y + Math.sin(a) * (ry + 6); posts += `M${f1(px)} ${f1(py)} v-26`; }
      rails = `<ellipse cx="${x}" cy="${y - 20}" rx="${rx + 10}" ry="${ry + 6}" fill="none" stroke="${INK}" stroke-width="8"/><ellipse cx="${x}" cy="${y - 20}" rx="${rx + 10}" ry="${ry + 6}" fill="none" stroke="${WOOD}" stroke-width="4"/>`;
      g += horse(k, x - 140, y + 10, 0.9, WHITE) + horse(k, x + 40, y - 6, 0.8, HORSE, true) + horse(k, x + 200, y + 20, 0.85, '#2a2228');
      g += rails + `<path d="${posts}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${posts}" stroke="${WOOD}" stroke-width="5" stroke-linecap="round"/>`;
      P(x - rx - 30, x + rx + 30, g, y - ry - 40, y + ry + 20);
      void O;
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 96 + (i * 13) % 22, up: 120, lv: 2 };
        k.P(a, b, izba(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 30, 28, 32, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, LOGD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + shoe(k, lot.x0 + 10, 664, 1);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 20), up: 110, lv: 2 };
      const g0 = izba(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 30, 30, 32, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, LOGD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(300 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'whitehorse') {

        let g = k.ell(x, y + 4, 90, 18) + `<path d="M${x - 70} ${y} l8 -30 h124 l8 30 Z" fill="#cfe6f6" ${O(3.5)}/><path d="M${x - 50} ${y - 30} h100" stroke="#ffffff" stroke-width="4"/>`;
        g += `<path d="M${x - 40} ${y - 30} L${x - 34} ${y - 90} M${x - 16} ${y - 30} L${x - 14} ${y - 88}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${x - 40} ${y - 30} L${x - 34} ${y - 90} M${x - 16} ${y - 30} L${x - 14} ${y - 88}" stroke="${WHITE}" stroke-width="9" stroke-linecap="round"/>`;
        g += `<path d="M${x - 50} ${y - 80} Q${x - 60} ${y - 130} ${x - 20} ${y - 150} Q${x + 10} ${y - 170} ${x + 24} ${y - 196} L${x + 30} ${y - 240} Q${x + 46} ${y - 256} ${x + 62} ${y - 244} L${x + 70} ${y - 226} Q${x + 56} ${y - 226} ${x + 50} ${y - 214} L${x + 40} ${y - 170} Q${x + 30} ${y - 120} ${x} ${y - 90} Z" fill="${WHITE}" ${O(4)}/>`;
        g += `<path d="M${x + 8} ${y - 160} L${x + 40} ${y - 130} L${x + 52} ${y - 140} M${x + 20} ${y - 180} L${x + 56} ${y - 166} L${x + 64} ${y - 180}" stroke="${INK}" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M${x + 8} ${y - 160} L${x + 40} ${y - 130} L${x + 52} ${y - 140} M${x + 20} ${y - 180} L${x + 56} ${y - 166} L${x + 64} ${y - 180}" stroke="${WHITE}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
        g += `<path d="M${x + 28} ${y - 238} q-20 10 -24 40 q-4 20 -16 30" stroke="#c8d0dc" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${x + 16} ${y - 214} l-12 10 M${x + 10} ${y - 196} l-14 8" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/><path d="M${x - 50} ${y - 96} q-30 10 -28 50" stroke="#c8d0dc" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="${x + 54}" cy="${y - 240}" r="3" fill="${BLUE}"/><path d="M${x + 38} ${y - 248} l-4 -14 l10 8" fill="${WHITE}" ${O(2)}/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 220 * s, h: 280 * s };
      }
      if (p.k === 'sled') return { g: k.ell(x, y, 44, 8) + `<path d="M${x - 44} ${y - 4} h80 q14 0 14 -16 M${x - 36} ${y - 4} v-20 h64 v20 M${x - 40} ${y - 24} h72 v-16 h-72 Z" stroke="${INK}" stroke-width="3" fill="${RED}"/>`, w: 110, h: 50, flat: true };
      if (p.k === 'hitch') return { g: k.ell(x, y, 40, 7) + `<path d="M${x - 36} ${y} V${y - 56} M${x + 36} ${y} V${y - 56} M${x - 40} ${y - 50} H${x + 40}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${x - 36} ${y} V${y - 56} M${x + 36} ${y} V${y - 56} M${x - 40} ${y - 50} H${x + 40}" stroke="${WOOD}" stroke-width="4"/><path d="M${x - 40} ${y - 54} H${x + 40}" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>` + shoe(k, x, y - 40, 0.8), w: 100, h: 70 };
      if (p.k === 'hay2') return { g: k.ell(x, y, 34, 8) + `<path d="M${x - 32} ${y} Q${x - 30} ${y - 44} ${x} ${y - 46} Q${x + 30} ${y - 44} ${x + 32} ${y} Z" fill="#e0c060" ${O(3)}/><path d="M${x - 30} ${y - 26} Q${x} ${y - 52} ${x + 30} ${y - 26} Q${x} ${y - 40} ${x - 30} ${y - 26} Z" fill="#ffffff"/>`, w: 80, h: 50, flat: true };
      return null;
    },
  };

  return {
    id: 'd38', ver: 1, name: 'Инейень', layout, art,
    story: 'Деревня коневодов на снежном насте: высокие срубы с резными коньками на кровлях, бело-синие наличники, у дворов сани и упряжь. Внизу - круглый выгон с конями, а на площади стоит Белый конь - снежная статуя того, кто по преданию вывел первых людей через бураны.',
  };
});
