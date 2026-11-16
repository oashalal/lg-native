



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const BW = '#3e3846', BWD = '#25212c', SLATE = '#4a5470', SLATED = '#2e3448', LIL = '#c8a8ff', LILD = '#7a5ac8', DUCK = '#8ab040', IRON = '#3a3640', POND = '#2e3a34';
  const CANAL = [1112, 1184];
  const GAPS = [[1514, 1606], [2154, 2246], [3854, 3946]];
  const KINDS = { shadowlamp: { foot: [60, 20], tall: 330 }, lamppost: { foot: [14, 7], tall: 180 }, shade: { foot: [20, 8], tall: 110 }, moor: { foot: [16, 7], tall: 60 } };

  function layout() {
    const water = [], xs = [80, ...GAPS.flat(), 4320];
    for (let i = 0; i < xs.length; i += 2) water.push({ k: 'canal', b: [xs[i], CANAL[0], xs[i + 1], CANAL[1]], art: 1 });
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1270, x1: 1570 },
        trainer: { x0: 2700, x1: 2980 },
        magic: { x0: 3050, x1: 3280 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1640, x1: 1920, B: 1282 },
        storage: { x0: 2420, x1: 2640, B: 1290 },
        tent: { x0: 3360, x1: 3710, B: 1284 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1560, 906], [2200, 910], [3000, 906], [3900, 910], [4360, 906]] },
        { k: 'cross', w: 32, pts: [[1560, 906], [1560, 1386]] },
        { k: 'cross', w: 30, pts: [[2200, 910], [2200, 1250]] },
        { k: 'cross', w: 32, pts: [[3900, 910], [3900, 1380]] },
        { k: 'lane', w: 34, pts: [[1200, 1388], [1560, 1386], [2004, 1374]] },
        { k: 'lane', w: 34, pts: [[2396, 1374], [2700, 1388], [3200, 1380], [3540, 1372], [3900, 1380], [4140, 1384]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1334, rx: 200, ry: 88, mark: 'shadowlamp', ms: 1 }],
      water,
      kinds: KINDS,
      props: [['lamppost', 1460, 1060], ['lamppost', 2300, 1060], ['lamppost', 3800, 1060], ['shade', 1100, 1300], ['shade', 2950, 1300], ['moor', 980, 1060], ['moor', 3300, 1060]],
      houses: [{ x0: 300, x1: 520, base: 1450 }, { x0: 700, x1: 920, base: 1446 }, { x0: 1060, x1: 1280, base: 1452 }, { x0: 2840, x1: 3060, base: 1450 }, { x0: 4100, x1: 4310, base: 1450 }],
      fill: [{ k: ['deadtree', 'reeds', 'reeds', 'mushroom', 'lamppost', 'bush'], n: 26, box: [80, 960, 4320, 1460] }, { k: ['barrel', 'crate', 'reeds'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1640, 1860], [1910, 2100], [2300, 2520], [2560, 2660], [3330, 3550], [3600, 3820], [3860, 4000]], gaps: GAPS, canal: CANAL, boats: [[760, 1150], [2700, 1152], [3500, 1146]] },
    };
  }

   
  const lantern = (k, x, y, s = 1) => k.use(k.sym('d65lan', () => { const { O } = k; return `<circle cx="0" cy="14" r="26" fill="${LIL}" opacity=".22"/><path d="M-9 0 h18 l3 6 v18 l-3 6 h-18 l-3 -6 v-18 Z" fill="${LIL}" ${O(2.5)}/><path d="M-12 6 h24 M-12 24 h24 M0 0 v30" stroke="${IRON}" stroke-width="2.5"/><path d="M-7 0 q7 -10 14 0" stroke="${IRON}" stroke-width="3" fill="none"/>`; }), x, y, s);
  const moon = (k, x, y, s, gold) => `<path d="M${k.f1(x + 6 * s)} ${k.f1(y - 14 * s)} a14 14 0 1 0 0 ${k.f1(28 * s)} a10 10 0 1 1 0 ${k.f1(-28 * s)} Z" fill="${gold ? k.GOLD : '#e8e0ff'}" ${k.O(2)}/>`;
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(w / 2)}" fill="${lv >= 2 ? '#d8c8ff' : '#6a6478'}" ${O(3)}/><path d="M${f1(x + w / 2)} ${f1(y + 4)} V${f1(y + h)} M${f1(x)} ${f1(y + h * 0.55)} h${f1(w)}" stroke="${BWD}" stroke-width="2.5"/>`;
    if (lv >= 3) g += `<path d="M${f1(x - 6)} ${f1(y + h + 4)} h${f1(w + 12)}" stroke="${SLATE}" stroke-width="6"/>`;
    return g;
  }

  function darkHouse(k, f, o = {}) {
    const { f1, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([84, 100, 114, 126, 136][lv - 1], f.up - 8, w * 0.62));
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'shack' : 'plank') + `<rect x="${x0}" y="${top}" width="${w}" height="${f.wall}" fill="#1a1622" opacity=".5"/>`;
    g += `<rect x="${x0}" y="${B - 18}" width="${w}" height="18" fill="${DUCK}" opacity=".35"/>`;
    g += k.roof(x0, x1, top, rh, lv <= 1 ? 'reed' : 'slate', lv <= 1 ? '#5e5a44' : SLATE, false, lv <= 1 ? undefined : SLATED);
    if (lv >= 2) g += moon(k, cx, top - rh * 0.42, 0.8 + lv * 0.08, lv >= 5);
    if (lv >= 4) g += `<path d="M${f1(cx)} ${f1(top - rh)} v-26" stroke="${INK}" stroke-width="4"/>` + lantern(k, cx, top - rh - 56, 0.9);
    const ww = [24, 26, 28, 30, 32][lv - 1], wh = [36, 42, 48, 52, 56][lv - 1], wy = top + Math.max(16, (f.wall - wh) * 0.3);
    if (!o.noWin) for (const x of [x0 + 18, x1 - 18 - ww]) if (Math.abs(x + ww / 2 - cx) > 54 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, BWD, 0.9);
    if (o.lamp !== false && lv >= 2) { const lx = o.lampX != null ? o.lampX : x1 + 4; g += `<path d="M${f1(lx - 10)} ${f1(top + 24)} h26 v10" stroke="${INK}" stroke-width="4" fill="none"/>` + lantern(k, lx + 16, top + 34, 0.9); }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.32 : top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || BWD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }

  const shade = (k, x, y, s = 1) => k.use(k.sym('d65shade', () => `<path d="M-16 0 Q-20 -60 -12 -84 Q0 -104 12 -84 Q20 -60 16 0 Q8 -8 0 0 Q-8 -8 -16 0 Z" fill="#1e1a26" opacity=".78"/><circle cx="-5" cy="-80" r="2.8" fill="${LIL}"/><circle cx="6" cy="-80" r="2.8" fill="${LIL}"/>`), x, y, s);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 28], [cx + ow / 2 + 28, x1]]) if (b - a > 12) { let d = ''; for (let x = a + 6; x < b; x += 16) d += `M${f1(x)} ${B} V${B - 60} l5 -10 l5 10 V${B}`; g += `<path d="${d}" fill="${BW}" stroke="${INK}" stroke-width="2.5"/><path d="M${f1(a)} ${B - 42} H${f1(b)}" stroke="${INK}" stroke-width="6"/>`; }
      if (lv >= 3) { const sx = x0 + 30, t = B - f.wall * 0.95; g += `<rect x="${f1(sx - 18)}" y="${f1(t)}" width="36" height="${f1(B - t)}" fill="${BW}" ${O(3.5)}/><path d="M${f1(sx - 26)} ${f1(t + 4)} L${f1(sx)} ${f1(t - 60)} L${f1(sx + 26)} ${f1(t + 4)} Z" fill="${SLATE}" ${O(3)}/>` + lantern(k, sx, t + 20, 0.9); }
      for (const px of [cx - ow / 2 - 14, cx + ow / 2 + 14]) g += `<rect x="${f1(px - 13)}" y="${f1(B - ph)}" width="26" height="${f1(ph)}" fill="${BW}" ${O(4)}/><path d="M${f1(px - 17)} ${f1(B - ph)} h34 l-6 -12 h-22 Z" fill="${SLATED}" ${O(2.5)}/>`;
      const by = B - ph + 6;
      g += `<path d="M${f1(cx - ow / 2 - 28)} ${f1(by)} Q${f1(cx)} ${f1(by - 46)} ${f1(cx + ow / 2 + 28)} ${f1(by)}" stroke="${INK}" stroke-width="14" fill="none"/><path d="M${f1(cx - ow / 2 - 28)} ${f1(by)} Q${f1(cx)} ${f1(by - 46)} ${f1(cx + ow / 2 + 28)} ${f1(by)}" stroke="${BW}" stroke-width="8" fill="none"/>`;
      for (let i = 0; i < 3 + Math.min(lv, 2); i++) { const t = (i + 1) / (4 + Math.min(lv, 2)), x = cx - ow / 2 - 28 + (ow + 56) * t, y = by - 4 * 23 * t * (1 - t); g += `<path d="M${f1(x)} ${f1(y)} v12" stroke="${INK}" stroke-width="2"/>` + lantern(k, x, y + 12, 0.55); }
      if (lv >= 5) g += moon(k, cx, by - 46, 1.1, true);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 20, nm.length * 15 + 30), ny = by + 30;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${BWD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, LIL);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = darkHouse(k, f, { sign: 'РАТУША', signBg: '#4a1a2a', lamp: lv >= 4 ? false : undefined });
      let g = h.g;
      if (lv < 4) { const ty = h.top - h.rh + 6, tw = 18 + lv * 3; g += `<rect x="${f1(h.cx - tw)}" y="${f1(ty - 40)}" width="${f1(tw * 2)}" height="40" fill="${LIL}" ${O(3)}/><path d="M${f1(h.cx)} ${f1(ty - 40)} V${f1(ty)}" stroke="${IRON}" stroke-width="3"/><path d="M${f1(h.cx - tw - 6)} ${f1(ty - 38)} L${f1(h.cx)} ${f1(ty - 70)} L${f1(h.cx + tw + 6)} ${f1(ty - 38)} Z" fill="${SLATE}" ${O(3)}/><circle cx="${f1(h.cx)}" cy="${f1(ty - 20)}" r="34" fill="${LIL}" opacity=".18"/>`; }
      if (lv >= 3) for (const s of [-1, 1]) g += `<path d="M${f1(h.cx + s * 64)} ${h.B} V${h.B - 100}" stroke="${INK}" stroke-width="10"/><path d="M${f1(h.cx + s * 64)} ${h.B} V${h.B - 100}" stroke="${BW}" stroke-width="5"/>` + lantern(k, h.cx + s * 64, h.B - 130, 0.8);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = darkHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#5a1a1a', lampX: f.x0 - 30 });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 11; g += `<path d="M${f1(sx)} ${h.B} l-3 -130" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${f1(sx)} ${h.B} l-3 -130" stroke="#8a7a6a" stroke-width="3" stroke-linecap="round"/>`; }
      if (lv >= 2) { const bx = f.x0 - 40; g += `<path d="M${f1(bx - 26)} ${h.B} V${h.B - 30} M${f1(bx + 26)} ${h.B} V${h.B - 30}" stroke="${INK}" stroke-width="5"/><rect x="${f1(bx - 32)}" y="${h.B - 150}" width="64" height="122" rx="6" fill="#c8b898" ${O(3)}/>` + shade(k, bx, h.B - 34, 1) + `<circle cx="${f1(bx)}" cy="${h.B - 110}" r="8" fill="none" stroke="#c8402a" stroke-width="3"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${BWD}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${BW}" ${O(4)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(54, (w - 50) / 3); g += `<g transform="rotate(${(i * 11) % 9 - 4} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${i % 2 ? '#d8d0e8' : '#eeeaf6'}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/></g>`; }
      g += `<path d="M${f1(x0 + 14)} ${f1(top)} Q${f1(cx)} ${f1(top - 50 - lv * 6)} ${f1(x1 - 14)} ${f1(top)}" stroke="${IRON}" stroke-width="6" fill="none"/><path d="M${f1(cx)} ${f1(top - 25 - lv * 3)} v10" stroke="${INK}" stroke-width="2"/>` + lantern(k, cx, top - 15 - lv * 3, 0.9);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, BWD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const shed = (a, b, top, rh, main) => {
        const m = (a + b) / 2;
        let s = k.wall(a, top, b - a, B, 'plank') + `<rect x="${f1(a)}" y="${f1(top)}" width="${f1(b - a)}" height="${f1(B - top)}" fill="#1a1622" opacity=".5"/>` + k.roof(a, b, top, rh, 'slate', SLATE, false, SLATED);
        if (main) { const dw = (b - a) * 0.62, dh = Math.min(B - top - 30, 70 + lv * 8); s += `<rect x="${f1(m - dw / 2)}" y="${f1(B - dh)}" width="${f1(dw)}" height="${f1(dh)}" fill="#1a1620" ${O(3)}/><path d="M${f1(m - dw * 0.36)} ${B - 6} Q${f1(m)} ${f1(B - dh * 0.5)} ${f1(m + dw * 0.36)} ${B - 6} Z" fill="#7a5a3a" ${O(2.5)}/><path d="M${f1(m - dw / 2)} ${f1(B - dh)} h${f1(dw)}" stroke="${IRON}" stroke-width="6"/>`; }
        return s;
      };
      const top = B - f.wall;
      let g = '';
      if (lv >= 4) g += shed(x1 - w * 0.3, x1 + 4, B - f.wall * 0.6, 30, false);
      const a = x0, b = lv >= 4 ? x1 - w * 0.26 : x1;
      g += shed(a, b, top, Math.min(f.up - 20, 60 + lv * 10), true) + `<path d="M${f1(a - 6)} ${B + 2} H${f1(b + 6)}" stroke="${DUCK}" stroke-width="6" opacity=".5"/>`;
      g += `<path d="M${f1(b + 8)} ${B} l20 -140" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${f1(b + 8)} ${B} l20 -140" stroke="${lv >= 5 ? k.GOLD : '#a88a5a'}" stroke-width="3.5" stroke-linecap="round"/><path d="M${f1(b + 26)} ${B - 130} l6 -30 l8 2 l-6 30 Z" fill="${lv >= 5 ? k.GOLD : '#a88a5a'}" ${O(2)}/>` + lantern(k, (a + b) / 2, top + 6, 0.8);
      k.signId('storage'); g += k.signLv((a + b) / 2, top + 50, Math.min(b - a - 10, 130), 'СКЛАД', lv, 19, BWD);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#5a5662');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = darkHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, lamp: false, roofH: Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 10) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(mx + mw + 20 + i * 30)} ${f1(h.B - 90)} h20 v8" stroke="${IRON}" stroke-width="4" fill="none"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h, n = 6;
        let s = `<path d="M${f1(m)} ${f1(t - 30)} V${f1(t)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(m)} ${f1(t - 30)} l22 8 l-22 8" fill="${gold ? k.GOLD : LIL}" ${O(2)}/><path d="M${f1(a)} ${B} Q${f1(a + (b - a) * 0.1)} ${f1(t + h * 0.35)} ${f1(m)} ${f1(t)} Q${f1(b - (b - a) * 0.1)} ${f1(t + h * 0.35)} ${f1(b)} ${B} Z" fill="${LILD}" ${O()}/>`;
        let d = ''; for (let i = 1; i < n; i++) { const x = a + (b - a) * i / n; d += `M${f1(m)} ${f1(t)} Q${f1((x + m) / 2)} ${f1(t + h * 0.4)} ${f1(x)} ${B}`; }
        return s + `<path d="${d}" stroke="#5a3a9a" stroke-width="3" fill="none"/>`;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} Q${f1(cx - 28)} ${f1(B - 80 - lv * 5)} ${f1(cx)} ${f1(B - 92 - lv * 5)} Q${f1(cx + 28)} ${f1(B - 80 - lv * 5)} ${f1(cx + 30)} ${B} Z" fill="#1e1a26" ${O(3)}/>` + moon(k, cx, top + 30, 1.2, lv >= 5) + lantern(k, cx + 50, B - 110, 0.8);
      k.signId('tent'); g += k.signLv(cx, top + 76, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#3a2a5a');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = darkHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true, lamp: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(112, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 24)} H${f1(ax0 - 10)} Z" fill="${SLATE}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 20)} V${h.B}" stroke="${BWD}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(2 + lv, Math.floor((ax1 - ax0) / 32))); i < n; i++) { const px = ax0 + 18 + i * 32; g += `<path d="M${f1(px)} ${f1(ay + 24)} v${8 + (i % 2) * 10}" stroke="${INK}" stroke-width="2"/>` + lantern(k, px, ay + 32 + (i % 2) * 10, 0.6); }
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${BW}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(3, lv + 1); i++) g += `<rect x="${f1(ax0 + 18 + i * 30)}" y="${h.B - 52}" width="16" height="22" rx="4" fill="${DUCK}" ${O(2)}/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<path d="M${f1(x0 + 10)} ${B} L${f1(x0 + w * 0.2)} ${f1(top + 40)} H${f1(x1 - w * 0.2)} L${f1(x1 - 10)} ${B} Z" fill="${BW}" ${O()}/>`;
      const cw = w * 0.62, ct = top - 30, ch = 76;
      g += `<rect x="${f1(cx - cw / 2)}" y="${f1(ct)}" width="${f1(cw)}" height="${ch}" rx="10" fill="${LIL}" opacity=".35"/>` + shade(k, cx, ct + ch - 4, 0.7);
      let bars = ''; for (let i = 0; i <= 5; i++) bars += `M${f1(cx - cw / 2 + cw * i / 5)} ${f1(ct)} V${f1(ct + ch)}`;
      g += `<path d="${bars}" stroke="${IRON}" stroke-width="4"/><rect x="${f1(cx - cw / 2)}" y="${f1(ct)}" width="${f1(cw)}" height="${ch}" rx="10" fill="none" ${O(3.5)}/><rect x="${f1(cx - cw / 2 - 10)}" y="${f1(ct + ch)}" width="${f1(cw + 20)}" height="12" fill="${IRON}" ${O(3)}/>`;
      g += `<path d="M${f1(cx - cw / 2 - 8)} ${f1(ct + 4)} Q${f1(cx)} ${f1(ct - Math.min(f.up - 60, 50 + lv * 10))} ${f1(cx + cw / 2 + 8)} ${f1(ct + 4)} Z" fill="${lv >= 5 ? k.GOLD : SLATE}" ${O()}/><circle cx="${f1(cx)}" cy="${f1(ct + ch / 2)}" r="${f1(cw * 0.7)}" fill="${LIL}" opacity=".14"/>`;
      g += win(k, cx - 13, top + 70, 26, 40, lv) + k.door(cx, B, 40 + lv * 3, 66 + lv * 4, '#2a1e3a');
      k.signId('magic'); g += k.signLv(cx, B - 118, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  const art = {
    K: { leaf: ['#4a5a3a', '#5a6a44', '#3a4a30'], grass: '#6e7a56', grass2: '#5a6648' },
    back(k) {
      const { P, L } = k;
      let g = `<path d="M0 690 Q900 640 1800 676 Q2700 640 3500 670 Q4000 660 4400 680 V720 H0 Z" fill="#46524a" opacity=".8"/>`;
      for (let i = 0; i < 16; i++) { const x = 100 + i * 270 + ((i * 53) % 80); g += `<path d="M${x} 690 q-4 -40 2 -70 q6 -30 0 -50" stroke="#2e3830" stroke-width="7" fill="none"/>`; }
      for (const [x, w] of [[800, 1200], [2400, 1300], [3800, 900]]) g += `<ellipse cx="${x}" cy="690" rx="${w / 2}" ry="22" fill="#b8b0d0" opacity=".2"/>`;
      P(0, L.W, g);
    },

    water(k) {
      const { P, L, f1, O, INK } = k, [y0, y1] = L.hx.canal, xs = [80, ...L.hx.gaps.flat(), 4320];
      for (let i = 0; i < xs.length; i += 2) {
        const a = xs[i], b = xs[i + 1];
        let g = `<path d="M${a} ${y0 - 6} H${b} V${y1 + 6} H${a} Z" fill="#4a5530"/><path d="M${a + 6} ${y0} H${b - 6} V${y1} H${a + 6} Z" fill="${POND}" ${O(3)}/>`;
        let d = ''; for (let x = a + 30; x < b - 30; x += 46) { const y = y0 + 12 + ((x * 13) % (y1 - y0 - 24)); d += `M${f1(x)} ${f1(y)} h${8 + (x % 7)}`; }
        g += `<path d="${d}" stroke="${DUCK}" stroke-width="7" stroke-linecap="round"/>`;
        let r = ''; for (let x = a + 60; x < b - 40; x += 180) r += `M${f1(x)} ${f1(y0 + 26)} q14 -6 28 0`;
        g += `<path d="${r}" stroke="${LIL}" stroke-width="2.5" fill="none" opacity=".5"/>`;
        P(a, b, g, y0 - 10, y1 + 10);
      }
      for (const [x, y] of L.hx.boats || []) P(x - 80, x + 80, `<path d="M${x - 70} ${y - 6} Q${x} ${y + 22} ${x + 70} ${y - 6} Z" fill="#5a4630" ${O(3)}/><path d="M${x + 40} ${y - 4} v-50 h12" stroke="${INK}" stroke-width="3" fill="none"/>` + lantern(k, x + 52, y - 50, 0.6) + `<ellipse cx="${x + 52}" cy="${y + 14}" rx="14" ry="4" fill="${LIL}" opacity=".3"/>`, y - 70, y + 30);
      for (const [a, b] of L.hx.gaps) {
        let g = `<rect x="${a - 8}" y="${y0 - 12}" width="${b - a + 16}" height="${y1 - y0 + 24}" fill="#6e5a3a" ${O(3.5)}/>`;
        let d = ''; for (let y = y0 - 4; y < y1 + 10; y += 13) d += `M${a - 4} ${y} H${b + 4}`;
        g += `<path d="${d}" stroke="#45361f" stroke-width="2.5" opacity=".7"/>`;
        for (const px of [a - 10, b + 10]) g += `<path d="M${px} ${y0 - 24} V${y1 + 10}" stroke="${INK}" stroke-width="9"/><path d="M${px} ${y0 - 24} V${y1 + 10}" stroke="#6e5a3a" stroke-width="5"/><rect x="${px - 7}" y="${y0 - 30}" width="14" height="14" rx="3" fill="#45361f" ${O(2.5)}/>`;
        g += `<path d="M${a - 10} ${y0 - 22} v-20 h14" stroke="${INK}" stroke-width="3" fill="none"/>` + lantern(k, a + 4, y0 - 42, 0.6);
        P(a - 30, b + 30, g, y0 - 60, y1 + 20);
      }
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 150) { k.P(a, b, `<path d="M${(a + b) / 2} 795 V700 h20 v10" stroke="${k.INK}" stroke-width="5" fill="none"/>` + lantern(k, (a + b) / 2 + 20, 712, 0.9)); return; }
        const x1 = Math.min(b - 10, a + 170), f = { x0: a + 10, x1, B: 792, wall: 110 + (i * 13) % 26, up: 120, lv: 2 };
        k.P(a, b, darkHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 30 : x1 - 54, 792 - f.wall + 22, 24, 40, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 36, 60, BWD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + moon(k, lot.x0 + 10, 664, 0.7);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 108 + (c.v % 20), up: 110, lv: 2 };
      const g0 = darkHouse(k, f, { door: false, noWin: true, lampX: c.v % 2 ? x0 - 30 : x1 + 4 }).g + win(k, c.v % 2 ? x0 + 24 : x1 - 50, 795 - f.wall + 22, 26, 42, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, BWD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(300 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, { f1, O, INK } = k;
      if (p.k === 'shadowlamp') {

        let g = k.ell(x, y + 4, 70, 16) + `<path d="M${x - 40} ${y} l8 -24 h64 l8 24 Z" fill="${IRON}" ${O(3.5)}/><path d="M${x - 12} ${y - 24} L${x - 8} ${y - 250} H${x + 8} L${x + 12} ${y - 24} Z" fill="${IRON}" ${O(3.5)}/><path d="M${x - 8} ${y - 120} q-30 -10 -40 -40 M${x + 8} ${y - 150} q30 -10 40 -40" stroke="${IRON}" stroke-width="6" fill="none"/>`;
        g += `<circle cx="${x}" cy="${y - 290}" r="90" fill="${LIL}" opacity=".16"/><path d="M${x - 30} ${y - 250} h60 l10 -14 v-60 l-10 -14 h-60 l-10 14 v60 Z" fill="${LIL}" ${O(3.5)}/><path d="M${x - 40} ${y - 264} h80 M${x - 40} ${y - 324} h80 M${x} ${y - 338} v88" stroke="${IRON}" stroke-width="4"/><path d="M${x - 30} ${y - 338} L${x} ${y - 370} L${x + 30} ${y - 338} Z" fill="${SLATE}" ${O(3)}/><path d="M${x - 10} ${y - 270} q10 -40 20 0 q-4 -14 -10 -4 q-6 -10 -10 4" fill="#ffffff"/>`;
        g += shade(k, x - 110, y + 10, 0.8) + shade(k, x + 120, y + 6, 0.9) + lantern(k, x - 48, y - 156, 0.6) + lantern(k, x + 48, y - 186, 0.6);
        return { g, w: 300, h: 390 };
      }
      if (p.k === 'lamppost') return { g: k.ell(x, y, 14, 5) + `<path d="M${x} ${y} V${y - 150} q0 -14 20 -14 v10" stroke="${INK}" stroke-width="7" fill="none"/><path d="M${x} ${y} V${y - 150}" stroke="${IRON}" stroke-width="3.5"/>` + lantern(k, x + 20, y - 154, 0.8), w: 80, h: 190 };
      if (p.k === 'shade') return { g: `<ellipse cx="${x}" cy="${y}" rx="22" ry="6" fill="#1e1a26" opacity=".4"/>` + shade(k, x, y, 1.1), w: 60, h: 120 };
      if (p.k === 'moor') return { g: k.ell(x, y, 16, 5) + `<path d="M${x} ${y} V${y - 50}" stroke="${INK}" stroke-width="12"/><path d="M${x} ${y} V${y - 50}" stroke="#6e5a3a" stroke-width="7"/><path d="M${x - 8} ${y - 34} q8 6 16 0 M${x} ${y - 30} q30 20 54 10" stroke="#c8bc94" stroke-width="3" fill="none"/>`, w: 80, h: 60 };
      return null;
    },
  };

  return {
    id: 'd65', ver: 1, name: 'Ряскень', layout, art,
    story: 'Деревня фонарщиков на двух берегах заводи, затянутой ряской: высокие дома из морёного дерева, у каждого - сиреневый фонарь, что держит тени на расстоянии. Через заводь - три мостка, а на южном берегу стоит Фонарь заводи, к которому по ночам тянутся тени.',
  };
});
