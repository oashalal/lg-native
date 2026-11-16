



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const REED = '#c8b06a', REEDD = '#8a7438', PLK = '#8a8478', PLKD = '#55524a', RAV = '#1e1c24', RAVL = '#3a3848', LAKE = '#4a6a6a', FISH = '#b8c0c8';
  const PIERS = [1580, 2010, 3200, 3780], LK = [1214, 1386];
  const KINDS = { ravenpole: { foot: [40, 16], tall: 360 }, reedbundle: { foot: [24, 9], tall: 90 }, netrack: { foot: [50, 10], tall: 120 }, ravenpost: { foot: [12, 6], tall: 110 } };

  function layout() {
    const water = [], xs = [1120, ...PIERS.flatMap((x) => [x - 42, x + 42]), 4000];
    for (let i = 0; i < xs.length; i += 2) water.push({ k: 'lake', b: [xs[i], LK[0], xs[i + 1], LK[1]], art: 1 });
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1270, x1: 1570 },
        trainer: { x0: 2480, x1: 2760 },
        magic: { x0: 2830, x1: 3060 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1660, x1: 1940, B: 1366 },
        storage: { x0: 2080, x1: 2360, B: 1366 },
        tent: { x0: 3300, x1: 3650, B: 1366 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 910], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'shore', w: 34, pts: [[960, 908], [980, 1060], [1080, 1150], [2400, 1152], [3900, 1150], [3990, 1060], [3990, 908]] },
        { k: 'shore', w: 32, pts: [[1080, 1150], [860, 1240], [800, 1290]] },
        ...PIERS.map((x) => ({ k: 'pier', w: 30, pts: [[x, 1150], [x, 1420]] })),
        { k: 'walk', w: 32, pts: [[1580, 1420], [3780, 1420]] },
      ],
      plazas: [{ k: 'central', x: 600, y: 1312, rx: 220, ry: 90, mark: 'ravenpole', ms: 1 }],
      water,
      kinds: KINDS,
      props: [['netrack', 1300, 1060], ['reedbundle', 2600, 1060], ['ravenpost', 1160, 1086], ['netrack', 3600, 1060], ['reedbundle', 960, 1300]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 2470, x1: 2670, base: 1352 }, { x0: 2800, x1: 3000, base: 1356 }],
      fill: [{ k: ['reeds', 'reeds', 'reedbundle', 'deadtree', 'ravenpost'], n: 22, box: [80, 970, 4320, 1460] }, { k: ['barrel', 'crate', 'reeds'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1610, 1830], [1880, 2100], [2150, 2420], [3100, 3320], [3370, 3600], [3650, 4000]], piers: PIERS, lake: LK, boats: [[2700, 1250], [1300, 1300], [3500, 1260]] },
    };
  }

   
  const raven = (k, x, y, s = 1, flip) => k.use(k.sym('d71raven', () => { const { O } = k; return `<path d="M-16 0 Q-18 -16 -4 -20 Q4 -30 14 -24 L24 -22 L14 -18 Q16 -6 6 0 L12 8 M0 0 L-4 8" fill="${RAV}" stroke="${RAV}" stroke-width="2.5" stroke-linejoin="round"/><path d="M-16 0 Q-26 4 -32 0 Q-22 -6 -14 -6" fill="${RAVL}"/><circle cx="10" cy="-22" r="2" fill="#ffd76a"/><path d="M-10 -14 q8 -2 14 4" stroke="${RAVL}" stroke-width="2.5" fill="none"/>`; }), x, y, flip ? -s : s, s);
  function reedRoof(k, x0, x1, top, h, lv) {
    const { f1, INK } = k, cx = (x0 + x1) / 2;
    let g = k.roof(x0, x1, top, h, 'reed', lv <= 1 ? '#a8925a' : REED, false, REEDD);
    g += `<path d="M${f1(cx - 26)} ${f1(top - h + 20)} L${f1(cx + 18)} ${f1(top - h - 20)} M${f1(cx + 26)} ${f1(top - h + 20)} L${f1(cx - 18)} ${f1(top - h - 20)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${f1(cx - 26)} ${f1(top - h + 20)} L${f1(cx + 18)} ${f1(top - h - 20)} M${f1(cx + 26)} ${f1(top - h + 20)} L${f1(cx - 18)} ${f1(top - h - 20)}" stroke="#8a6a44" stroke-width="4" stroke-linecap="round"/>`;
    if (lv >= 2) g += `<path d="M${f1(x0 - 10)} ${f1(top + 2)} Q${f1(cx)} ${f1(top - h * 0.3)} ${f1(x1 + 10)} ${f1(top + 2)}" stroke="${REEDD}" stroke-width="5" fill="none"/>`;
    if (lv >= 3) g += raven(k, cx + 22, top - h - 14, 0.9 + lv * 0.06, lv % 2);
    if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - h - 26)}" r="8" fill="${k.GOLD}" ${k.O(2)}/>`;
    return g;
  }
  function win(k, x, y, w, h, lv, lit = true) {
    const { f1, O } = k;
    return k.winLit(x, y, w, h, lit) + `<rect x="${f1(x - 10)}" y="${f1(y - 2)}" width="9" height="${f1(h + 4)}" fill="${RAVL}" ${O(2)}/><rect x="${f1(x + w + 1)}" y="${f1(y - 2)}" width="9" height="${f1(h + 4)}" fill="${RAVL}" ${O(2)}/>` + (lv >= 3 ? `<path d="M${f1(x - 6)} ${f1(y + h + 4)} h${f1(w + 12)}" stroke="${PLKD}" stroke-width="5"/>` : '');
  }

  const stilts = (k, x0, x1, B, d) => { const { f1, O } = k; let g = ''; for (let x = x0 + 12; x < x1 - 4; x += 40) g += `<rect x="${f1(x - 6)}" y="${B - 4}" width="12" height="${d}" fill="${PLKD}" ${O(2.5)}/>`; return g + `<path d="M${f1(x0 - 6)} ${B + 2} H${f1(x1 + 6)}" stroke="${PLKD}" stroke-width="9"/>`; };

  function fishHouse(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([84, 100, 114, 126, 136][lv - 1], f.up - 8, w * 0.62));
    let g = o.wet ? stilts(k, x0, x1, B, 40) : '';
    g += k.wall(x0, top, w, B, lv <= 1 ? 'shack' : 'plank') + `<rect x="${x0}" y="${top}" width="${w}" height="${f.wall}" fill="${PLK}" opacity=".35"/>`;
    g += reedRoof(k, x0, x1, top, rh, lv);
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [30, 36, 40, 44, 48][lv - 1], wy = top + Math.max(18, (f.wall - wh) * 0.34);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 56 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, PLKD, 0.92);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.32 : top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || PLKD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }

  const fishes = (k, x, y, n = 3) => { const { f1, O } = k; let g = `<path d="M${f1(x - n * 9)} ${f1(y)} H${f1(x + n * 9)}" stroke="#5a4a3a" stroke-width="3"/>`; for (let i = 0; i < n; i++) { const fx = x - (n - 1) * 9 + i * 18; g += `<path d="M${f1(fx)} ${f1(y)} q-6 10 0 24 q6 -14 0 -24 Z M${f1(fx - 5)} ${f1(y + 30)} l5 -6 l5 6" fill="${FISH}" ${O(1.5)}/>`; } return g; };

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 34], [cx + ow / 2 + 34, x1]]) if (b - a > 12) { let d = ''; for (let x = a + 4; x < b; x += 9) d += `M${f1(x)} ${B} q-2 -40 ${f1(((x * 7) % 9) - 4)} -${66 + ((x * 13) % 18)}`; g += `<path d="${d}" stroke="${REEDD}" stroke-width="4" fill="none"/><path d="M${f1(a)} ${B - 40} H${f1(b)}" stroke="${PLKD}" stroke-width="6"/>`; }
      if (lv >= 3) { const sx = x0 + 28, t = B - f.wall; g += `<path d="M${f1(sx - 22)} ${B} V${f1(t + 36)} M${f1(sx + 22)} ${B} V${f1(t + 36)}" stroke="${INK}" stroke-width="9"/><path d="M${f1(sx - 22)} ${B} V${f1(t + 36)} M${f1(sx + 22)} ${B} V${f1(t + 36)}" stroke="${PLK}" stroke-width="5"/><rect x="${f1(sx - 28)}" y="${f1(t + 10)}" width="56" height="28" fill="${PLK}" ${O(3)}/>` + k.roof(sx - 28, sx + 28, t + 10, 34, 'reed', REED, false, REEDD) + raven(k, sx + 6, t - 26, 0.9); }
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 18); g += `<path d="M${f1(px - 20)} ${B} Q${f1(px - 24)} ${f1(B - ph * 0.6)} ${f1(px - 12)} ${f1(B - ph)} H${f1(px + 12)} Q${f1(px + 24)} ${f1(B - ph * 0.6)} ${f1(px + 20)} ${B} Z" fill="${REED}" ${O(3.5)}/><path d="M${f1(px - 20)} ${f1(B - ph * 0.3)} h40 M${f1(px - 16)} ${f1(B - ph * 0.7)} h32" stroke="${PLKD}" stroke-width="5"/>` + raven(k, px, B - ph - 4, 1.1, s > 0); }
      const by = B - ph + 26;
      g += `<path d="M${f1(cx - ow / 2 - 20)} ${f1(by)} H${f1(cx + ow / 2 + 20)}" stroke="${INK}" stroke-width="14"/><path d="M${f1(cx - ow / 2 - 20)} ${f1(by)} H${f1(cx + ow / 2 + 20)}" stroke="${PLK}" stroke-width="8"/>`;
      for (let i = 0; i < 4 + Math.min(lv, 3); i++) { const x = cx - ow / 2 + 4 + i * (ow - 8) / (3 + Math.min(lv, 3)); g += `<path d="M${f1(x)} ${f1(by + 6)} v8" stroke="${INK}" stroke-width="1.5"/><path d="M${f1(x)} ${f1(by + 14)} q-5 12 0 24 q5 -12 0 -24 Z" fill="${RAV}"/>`; }
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(by - 18)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 46;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${RAV}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, REED);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = fishHouse(k, f, { sign: 'РАТУША', signBg: '#4a1a1a' });
      let g = h.g;
      const sy = h.top - h.rh - 22;
      g += `<path d="M${f1(h.cx - 10)} ${f1(sy + 12)} V${f1(sy - 40 - lv * 5)}" stroke="${INK}" stroke-width="4"/>` + raven(k, h.cx - 10, sy - 40 - lv * 5, 1.1);
      if (lv >= 3) { g += `<path d="M${f1(h.cx - 70)} ${h.B} V${h.B - 92} M${f1(h.cx + 70)} ${h.B} V${h.B - 92}" stroke="${INK}" stroke-width="10"/><path d="M${f1(h.cx - 70)} ${h.B} V${h.B - 92} M${f1(h.cx + 70)} ${h.B} V${h.B - 92}" stroke="${PLK}" stroke-width="5"/>` + k.roof(h.cx - 80, h.cx + 80, h.B - 92, 30, 'reed', REED, false, REEDD); }
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = fishHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#5a1a1a' });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} V${f1(h.B - 130)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${h.B} V${f1(h.B - 130)}" stroke="#a88a5a" stroke-width="3"/><path d="M${f1(sx - 7)} ${f1(h.B - 128)} v-14 M${f1(sx)} ${f1(h.B - 130)} v-18 M${f1(sx + 7)} ${f1(h.B - 128)} v-14 M${f1(sx - 8)} ${f1(h.B - 128)} h16" stroke="${lv >= 5 && i === 0 ? k.GOLD : '#9a9eac'}" stroke-width="3"/>`; }
      if (lv >= 2) { const bx = f.x0 - 40; let d = ''; for (let i = 1; i < 5; i++) d += `M${f1(bx - 32 + i * 13)} ${h.B - 120} V${h.B - 20} M${f1(bx - 32)} ${h.B - 120 + i * 20} H${f1(bx + 32)}`; g += `<path d="M${f1(bx - 32)} ${h.B} V${h.B - 124} M${f1(bx + 32)} ${h.B} V${h.B - 124}" stroke="${INK}" stroke-width="6"/><path d="${d}" stroke="#c8bc94" stroke-width="2"/><circle cx="${f1(bx)}" cy="${h.B - 70}" r="10" fill="none" stroke="#c8402a" stroke-width="4"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${PLKD}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${REED}" ${O(4)}/>`;
      let d = ''; for (let x = x0 + 14; x < x1 - 8; x += 8) d += `M${f1(x)} ${f1(by0 + 4)} V${f1(by1 - 4)}`; g += `<path d="${d}" stroke="${REEDD}" stroke-width="2" opacity=".6"/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(54, (w - 50) / 3); g += `<g transform="rotate(${(i * 11) % 9 - 4} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${i % 2 ? '#e8e4d8' : '#f6f4ec'}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/></g>`; }
      g += `<path d="M${f1(x0)} ${f1(top - 4)} H${f1(x1)}" stroke="${INK}" stroke-width="12"/><path d="M${f1(x0)} ${f1(top - 4)} H${f1(x1)}" stroke="${PLK}" stroke-width="7"/>` + raven(k, x1 - 30, top - 10, 1, true) + (lv >= 3 ? raven(k, x0 + 30, top - 10, 0.9) : '');
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, PLKD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = stilts(k, x0, x1, B, 40);
      if (lv >= 4) g += k.wall(x1 - w * 0.3, B - f.wall * 0.55, w * 0.3 + 6, B, 'plank') + k.roof(x1 - w * 0.3, x1 + 6, B - f.wall * 0.55, 34, 'reed', REED, false, REEDD);
      const b = lv >= 4 ? x1 - w * 0.3 : x1;
      g += k.wall(x0, top, b - x0, B, 'plank') + `<rect x="${x0}" y="${top}" width="${f1(b - x0)}" height="${f.wall}" fill="${PLK}" opacity=".35"/>` + reedRoof(k, x0, b, top, Math.min(f.up - 10, 70 + lv * 12), lv);
      const m = (x0 + b) / 2, dw = (b - x0) * 0.56, dh = Math.min(f.wall - 40, 80 + lv * 8);
      g += `<rect x="${f1(m - dw / 2)}" y="${f1(B - dh)}" width="${f1(dw)}" height="${f1(dh)}" fill="#22201e" ${O(3)}/><path d="M${f1(m - dw / 2)} ${f1(B - dh)} l${f1(dw * 0.18)} ${f1(dh)} M${f1(m + dw / 2)} ${f1(B - dh)} l${f1(-dw * 0.18)} ${f1(dh)}" stroke="#6a5a4a" stroke-width="5"/>` + fishes(k, m, B - dh - 30, 3);
      g += `<path d="M${f1(x0 - 60)} ${B + 20} Q${f1(x0 - 20)} ${B + 40} ${f1(x0 + 20)} ${B + 20} Z" fill="#5a4630" ${O(2.5)}/>`;
      if (lv >= 5) g += `<path d="M${f1(b + 20)} ${B - 60} v40 m-14 -10 q14 18 28 0 m-24 -24 h20" stroke="${k.GOLD}" stroke-width="5" fill="none"/>`;
      k.signId('storage'); g += k.signLv(m, top + 26, Math.min(b - x0 - 10, 130), 'СКЛАД', lv, 19, PLKD);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#7a7a70');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = fishHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, roofH: Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 10) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(mx + mw + 26 + i * 30)} ${f1(h.B - 100)} v26 q0 10 10 10" stroke="#5a5662" stroke-width="4" fill="none"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = stilts(k, x0, x1, B, 40) + `<rect x="${f1(x0 - 6)}" y="${B - 12}" width="${f1(w + 12)}" height="14" fill="${PLK}" ${O(3)}/>`;
      if (lv >= 4) for (const [a, b] of [[x0 - 4, x0 + w * 0.22], [x1 - w * 0.22, x1 + 4]]) g += `<path d="M${f1(a)} ${B - 12} V${f1(B - f.wall * 0.5)} M${f1(b)} ${B - 12} V${f1(B - f.wall * 0.5)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(a - 10)} ${f1(B - f.wall * 0.5)} L${f1((a + b) / 2)} ${f1(B - f.wall * 0.5 - 40)} L${f1(b + 10)} ${f1(B - f.wall * 0.5)} Z" fill="${REED}" ${O(3)}/>`;
      const a = lv >= 4 ? x0 + w * 0.2 : x0 + 10, b = lv >= 4 ? x1 - w * 0.2 : x1 - 10;
      for (const px of [a + 6, b - 6]) g += `<path d="M${f1(px)} ${B - 12} V${f1(top + 20)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(px)} ${B - 12} V${f1(top + 20)}" stroke="#8a6a44" stroke-width="5"/>`;
      g += `<rect x="${f1(a + 12)}" y="${f1(top + 30)}" width="${f1(b - a - 24)}" height="${f1(B - top - 42)}" fill="${REED}" opacity=".85"/><path d="M${f1(cx - 30)} ${B - 12} V${f1(B - 100 - lv * 4)} H${f1(cx + 30)} V${B - 12} Z" fill="#2a2418" ${O(3)}/>`;
      const rh = Math.min(f.up - 20, 70 + lv * 14);
      g += k.roof(a, b, top + 24, rh, 'reed', REED, false, REEDD) + raven(k, cx + 16, top + 24 - rh - 12, 1);
      for (let i = 0; i < 3 + Math.min(lv, 2); i++) { const x = a + 10 + i * (b - a - 20) / (2 + Math.min(lv, 2)); g += `<path d="M${f1(x)} ${f1(top + 30)} v8" stroke="${INK}" stroke-width="1.5"/><path d="M${f1(x)} ${f1(top + 38)} q-5 12 0 24 q5 -12 0 -24 Z" fill="${lv >= 5 && i === 1 ? k.GOLD : RAV}"/>`; }
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, PLKD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = fishHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a3a', dx: x1 - 44, noWin: true, wet: true });
      let g = h.g;
      const ax0 = x0 - 6, ax1 = x1 - 84, ay = h.B - Math.min(112, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 24)} H${f1(ax0 - 10)} Z" fill="${REED}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 20)} V${h.B}" stroke="${PLKD}" stroke-width="6"/>`).join('');
      g += fishes(k, (ax0 + ax1) / 2, ay + 30, Math.max(2, Math.min(2 + lv, Math.floor((ax1 - ax0) / 20))));
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${PLK}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(2, lv); i++) { const vx = ax0 + 30 + i * 44; g += `<path d="M${f1(vx - 18)} ${h.B - 30} Q${f1(vx - 20)} ${h.B - 60} ${f1(vx)} ${h.B - 64} Q${f1(vx + 20)} ${h.B - 60} ${f1(vx + 18)} ${h.B - 30} Z" fill="#a8885a" ${O(2)}/><path d="M${f1(vx - 12)} ${h.B - 54} h24 M${f1(vx - 16)} ${h.B - 42} h32" stroke="#6a5a3a" stroke-width="2.5"/>`; }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const ny = top + 10, nr = w * 0.42;
      let g = `<path d="M${f1(cx - 26)} ${B} L${f1(cx - 14)} ${f1(ny + nr * 0.6)} H${f1(cx + 14)} L${f1(cx + 26)} ${B} Z" fill="${PLKD}" ${O(4)}/><path d="M${f1(cx - 60)} ${B} L${f1(cx - 14)} ${f1(B - 100)} M${f1(cx + 60)} ${B} L${f1(cx + 14)} ${f1(B - 100)}" stroke="${PLKD}" stroke-width="9"/>`;
      g += `<ellipse cx="${f1(cx)}" cy="${f1(ny)}" rx="${f1(nr)}" ry="${f1(nr * 0.82)}" fill="#8a6a44" ${O()}/>`;
      let d = ''; for (let i = 0; i < 7; i++) { const yy = ny - nr * 0.7 + i * nr * 0.24, hw = Math.sqrt(Math.max(0, 1 - ((yy - ny) / (nr * 0.82)) ** 2)) * nr; d += `M${f1(cx - hw + 4)} ${f1(yy)} q${f1(hw)} ${i % 2 ? 8 : -8} ${f1(hw * 2 - 8)} 0`; }
      g += `<path d="${d}" stroke="#5a4428" stroke-width="3" fill="none"/><path d="M${f1(cx - nr - 10)} ${f1(ny - nr * 0.5)} l20 10 M${f1(cx + nr + 8)} ${f1(ny - nr * 0.3)} l-18 8 M${f1(cx - nr * 0.4)} ${f1(ny - nr * 0.9)} l6 14" stroke="#5a4428" stroke-width="4"/>`;
      g += `<circle cx="${f1(cx)}" cy="${f1(ny + 4)}" r="${f1(nr * 0.32)}" fill="${lv >= 2 ? '#ffd76a' : '#3a3440'}" ${O(3)}/><path d="M${f1(cx - nr * 0.32)} ${f1(ny + 4)} h${f1(nr * 0.64)} M${f1(cx)} ${f1(ny + 4 - nr * 0.32)} v${f1(nr * 0.64)}" stroke="${PLKD}" stroke-width="2.5"/>`;
      g += raven(k, cx + nr * 0.4, ny - nr * 0.78, 1.1) + (lv >= 3 ? raven(k, cx - nr * 0.5, ny - nr * 0.7, 0.9, true) : '');
      for (let i = 0; i < Math.min(lv, 4); i++) { const bx = cx - nr + i * nr * 0.66, by = ny - nr - 40 - (i % 2) * 26; g += `<path d="M${f1(bx - 14)} ${f1(by)} q7 -8 14 0 q7 -8 14 0" stroke="${RAV}" stroke-width="3.5" fill="none"/>`; }
      if (lv >= 5) g += k.orb(cx, ny - nr * 0.82 - 4, 9);
      g += k.door(cx, B, 36 + lv * 2, 60 + lv * 3, '#2a1e3a');
      k.signId('magic'); g += k.signLv(cx, ny + nr * 0.82 + 30, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a4a');
      return g;
    },
  };

  const art = {
    K: { leaf: ['#5a6a3a', '#6a7a44', '#4a5a30'], grass: '#7e8a5a', grass2: '#68744c' },
    back(k) {
      const { P, L } = k;
      let g = `<path d="M0 690 Q800 650 1600 676 Q2400 640 3200 666 Q3900 650 4400 680 V720 H0 Z" fill="#5a6a54" opacity=".8"/>`;
      let d = ''; for (let x = 20; x < L.W; x += 16) d += `M${x} 712 q-2 -26 ${(x * 7) % 9 - 4} -${36 + ((x * 13) % 20)}`;
      g += `<path d="${d}" stroke="#6a7040" stroke-width="4" fill="none"/>`;
      for (let i = 0; i < 6; i++) { const x = 400 + i * 700, y = 560 + (i % 2) * 30; g += `<path d="M${x - 14} ${y} q7 -8 14 0 q7 -8 14 0" stroke="${RAV}" stroke-width="3.5" fill="none"/>`; }
      P(0, L.W, g);
    },

    water(k) {
      const { P, L, f1, O, INK } = k, [y0, y1] = L.hx.lake, xs = [1120, ...L.hx.piers.flatMap((x) => [x - 42, x + 42]), 4000];
      for (let i = 0; i < xs.length; i += 2) {
        const a = xs[i], b = xs[i + 1];
        let g = `<rect x="${a}" y="${y0 - 6}" width="${b - a}" height="${y1 - y0 + 12}" fill="#4a5530"/><rect x="${a + 4}" y="${y0}" width="${b - a - 8}" height="${y1 - y0}" fill="${LAKE}" ${O(3)}/>`;
        let r = ''; for (let x = a + 40; x < b - 30; x += 120) r += `M${f1(x)} ${f1(y0 + 30 + ((x * 7) % 80))} q14 -6 28 0`;
        g += `<path d="${r}" stroke="#d8eef0" stroke-width="3" fill="none" opacity=".5"/>`;
        let d = ''; for (let x = a + 10; x < b - 6; x += 22) d += `M${f1(x)} ${y0 + 6} q-2 -20 ${(x * 7) % 9 - 4} -${26 + ((x * 13) % 16)}`;
        g += `<path d="${d}" stroke="#8a8a44" stroke-width="3.5" fill="none"/>`;
        P(a, b, g, y0 - 40, y1 + 10);
      }
      for (const [x, y] of L.hx.boats || []) P(x - 80, x + 80, `<path d="M${x - 66} ${y - 6} Q${x} ${y + 22} ${x + 66} ${y - 6} Z" fill="#5a4630" ${O(3)}/><path d="M${x - 20} ${y - 4} l50 -40" stroke="#8a6a44" stroke-width="4"/>` + raven(k, x + 40, y - 8, 0.8), y - 50, y + 30);
      for (const x of L.hx.piers) {
        let g = `<rect x="${x - 36}" y="${y0 - 10}" width="72" height="${y1 - y0 + 20}" fill="#7a6a4a" ${O(3)}/>`;
        let d = ''; for (let y = y0 - 4; y < y1 + 10; y += 13) d += `M${x - 32} ${y} H${x + 32}`;
        g += `<path d="${d}" stroke="#4a3e28" stroke-width="2.5" opacity=".7"/>`;
        for (const px of [x - 40, x + 40]) for (let y = y0 + 20; y < y1; y += 70) g += `<rect x="${px - 6}" y="${y - 30}" width="12" height="40" rx="3" fill="${PLKD}" ${O(2.5)}/>`;
        P(x - 50, x + 50, g, y0 - 40, y1 + 20);
      }
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 100 + (i * 13) % 22, up: 120, lv: 2 };
        k.P(a, b, fishHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 24, 28, 34, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, PLKD) + (i % 3 === 0 ? raven(k, (a + x1) / 2 + 20, 792 - f.wall - 120, 0.9) : ''));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + raven(k, lot.x0 + 14, 662, 0.8);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2, wet = c.base < 1400;
      const f = { x0, x1, B: 795, wall: 100 + (c.v % 20), up: 110, lv: 2 };
      const g0 = fishHouse(k, f, { door: false, noWin: true, wet }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 24, 30, 34, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, PLKD) + fishes(k, c.v % 2 ? x0 + 80 : x1 - 80, 795 - f.wall + 4, 2);
      return { g: (wet ? '' : k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11)) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(300 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'ravenpole') {

        let g = k.ell(x, y + 4, 60, 14) + `<path d="M${x - 20} ${y} L${x - 14} ${y - 300} H${x + 14} L${x + 20} ${y} Z" fill="${RAV}" ${O(4)}/>`;
        for (const yy of [y - 70, y - 150, y - 230]) g += `<path d="M${x - 22} ${yy} Q${x - 26} ${yy - 30} ${x} ${yy - 36} Q${x + 26} ${yy - 30} ${x + 22} ${yy} Z" fill="${RAVL}" ${O(3)}/><path d="M${x + 18} ${yy - 22} l20 6 l-20 6 Z" fill="${REED}" ${O(2)}/><circle cx="${x + 8}" cy="${yy - 22}" r="3.5" fill="#ffd76a"/>`;
        g += `<path d="M${x} ${y - 310} Q${x - 50} ${y - 360} ${x - 110} ${y - 340} Q${x - 70} ${y - 330} ${x - 60} ${y - 316} Q${x - 40} ${y - 322} ${x} ${y - 300} Q${x + 40} ${y - 322} ${x + 60} ${y - 316} Q${x + 70} ${y - 330} ${x + 110} ${y - 340} Q${x + 50} ${y - 360} ${x} ${y - 310} Z" fill="${RAV}" ${O(3)}/><path d="M${x - 12} ${y - 306} Q${x} ${y - 344} ${x + 12} ${y - 306} Z" fill="${RAV}" ${O(2.5)}/><path d="M${x + 8} ${y - 334} l16 4 l-16 4 Z" fill="${REED}" ${O(1.5)}/><circle cx="${x + 4}" cy="${y - 334}" r="3" fill="#ffd76a"/>`;
        g += fishes(k, x - 50, y - 26, 2) + fishes(k, x + 52, y - 26, 2) + `<path d="M${x - 70} ${y - 26} V${y} M${x - 30} ${y - 26} V${y} M${x + 32} ${y - 26} V${y} M${x + 72} ${y - 26} V${y}" stroke="${PLKD}" stroke-width="4"/>`;
        return { g, w: 260, h: 380 };
      }
      if (p.k === 'reedbundle') return { g: k.ell(x, y, 26, 7) + `<path d="M${x - 14} ${y} Q${x - 18} ${y - 50} ${x - 6} ${y - 84} H${x + 6} Q${x + 18} ${y - 50} ${x + 14} ${y} Z" fill="${REED}" ${O(2.5)}/><path d="M${x - 15} ${y - 40} h30" stroke="${PLKD}" stroke-width="4"/>` + (p.v % 2 ? raven(k, x + 2, y - 86, 0.8) : ''), w: 70, h: 110 };
      if (p.k === 'netrack') return { g: k.ell(x, y, 50, 9) + `<path d="M${x - 46} ${y} V${y - 110} M${x + 46} ${y} V${y - 110} M${x - 52} ${y - 104} H${x + 52}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${x - 46} ${y} V${y - 110} M${x + 46} ${y} V${y - 110}" stroke="#a8784a" stroke-width="4"/><path d="M${x - 44} ${y - 102} Q${x} ${y - 20} ${x + 44} ${y - 102}" fill="none" stroke="#c8bc94" stroke-width="3"/><path d="M${x - 30} ${y - 90} L${x - 10} ${y - 50} M${x} ${y - 100} V${y - 46} M${x + 30} ${y - 90} L${x + 10} ${y - 50} M${x - 40} ${y - 80} H${x + 40} M${x - 28} ${y - 60} H${x + 28}" stroke="#c8bc94" stroke-width="1.5"/>`, w: 130, h: 120 };
      if (p.k === 'ravenpost') return { g: k.ell(x, y, 12, 4) + `<path d="M${x} ${y} V${y - 90}" stroke="${INK}" stroke-width="9"/><path d="M${x} ${y} V${y - 90}" stroke="${PLK}" stroke-width="5"/>` + raven(k, x, y - 92, 0.9, p.v % 2), w: 60, h: 120 };
      return null;
    },
  };

  return {
    id: 'd71', ver: 1, name: 'Камышец', layout, art,
    story: 'Деревня рыбаков на камышовом озере: серые дома под высокими камышовыми крышами, на коньках сидят вороны. От береговой улицы в озеро уходят причалы, по воде тянется мостовая на сваях, а на берегу стоит Вороний столп - воронам оставляют рыбу, и они сторожат заводи.',
  };
});
