



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const FOX = '#d8642a', FOXL = '#f0a050', CREAM = '#f6e8d0', LOGC = '#7a5a3a', LOGD = '#4a3420', ROOFC = '#5a4a3a', ROOFD = '#3a2e22';
  const KINDS = { foxidol: { foot: [70, 22], tall: 260 }, snare: { foot: [30, 10], tall: 90 }, pelts: { foot: [50, 10], tall: 130 }, birch: { foot: [22, 10], tall: 260, tree: true } };
  const GAT = [[1080, 906], [1200, 1000], [760, 1110], [720, 1150], [1100, 1260], [1320, 1370]];

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        trainer: { x0: 1270, x1: 1550 },
        hall: { x0: 1620, x1: 1920 },
        storage: { x0: 2960, x1: 3240 },
        magic: { x0: 3310, x1: 3540 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 2040, x1: 2320, B: 1200 },
        tent: { x0: 2420, x1: 2770, B: 1200 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 910], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'gat', w: 34, pts: GAT },
        { k: 'lane', w: 34, pts: [[1320, 1370], [1700, 1332], [2000, 1292], [2800, 1290], [3200, 1300], [3384, 1320]] },
        { k: 'cross', w: 30, pts: [[3600, 910], [3600, 1244]] },
        { k: 'lane', w: 32, pts: [[3816, 1324], [4100, 1300], [4300, 1310]] },
      ],
      plazas: [{ k: 'central', x: 3600, y: 1326, rx: 220, ry: 88, mark: 'foxidol', ms: 1.35 }],
      water: [{ k: 'bog', e: [700, 1010, 160, 36] }, { k: 'bog', e: [1180, 1135, 110, 40] }, { k: 'bog', e: [560, 1300, 200, 46] }, { k: 'bog', e: [1000, 1420, 140, 30] }, { k: 'bog', e: [1700, 1440, 150, 24] }],
      kinds: KINDS,
      props: [['pelts', 2880, 1180], ['snare', 1500, 1180], ['snare', 300, 1120], ['pelts', 3300, 1420], ['birch', 4200, 1180]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 2900, x1: 3110, base: 1452 }, { x0: 3960, x1: 4170, base: 1450 }],
      fill: [{ k: ['reeds', 'reeds', 'deadtree', 'mushroom'], n: 16, box: [80, 980, 1900, 1460] }, { k: ['birch', 'birch', 'flowers', 'snare'], n: 14, box: [1900, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'reeds'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1990, 2200], [2250, 2460], [2510, 2720], [2770, 2900], [3610, 3810], [3850, 4000]], paws: GAT },
    };
  }

   
  const foxHead = (k, x, y, s, gold) => k.use(k.sym(gold ? 'd68foxG' : 'd68fox', () => { const { O } = k; const c = gold ? k.GOLD : FOX; return `<path d="M-20 -8 L-16 -32 L-6 -16 H6 L16 -32 L20 -8 Q18 8 0 22 Q-18 8 -20 -8 Z" fill="${c}" ${O(2.5)}/><path d="M-10 4 Q0 10 10 4 Q6 16 0 22 Q-6 16 -10 4 Z" fill="${CREAM}"/><circle cx="-7" cy="-4" r="2.5" fill="#1e1410"/><circle cx="7" cy="-4" r="2.5" fill="#1e1410"/><circle cx="0" cy="20" r="3" fill="#1e1410"/><path d="M-14 -26 l4 8 M14 -26 l-4 8" stroke="#1e1410" stroke-width="2"/>`; }), x, y, s);
  const pelt = (k, x, y, s = 1) => k.use(k.sym('d68pelt', () => { const { O } = k; return `<path d="M0 -4 v6" stroke="#1e1410" stroke-width="2"/><path d="M-12 2 Q-14 20 -8 34 Q-4 44 -6 58 Q0 64 6 58 Q4 44 8 34 Q14 20 12 2 Z" fill="${FOX}" ${O(2)}/><path d="M-6 58 Q0 70 6 58 Q2 66 0 74 Q-2 66 -6 58 Z" fill="${CREAM}" ${O(1.5)}/><path d="M-12 8 l-6 6 M12 8 l6 6 M-8 34 l-6 4 M8 34 l6 4" stroke="${FOX}" stroke-width="5" stroke-linecap="round"/>`; }), x, y, s);

  function trims(k, x0, x1, top, h, lv) {
    const { f1 } = k, cx = (x0 + x1) / 2, e = 22;
    let g = `<path d="M${x0 - e} ${top + 6} L${f1(cx)} ${f1(top - h)} L${x1 + e} ${top + 6}" fill="none" stroke="${k.INK}" stroke-width="14" stroke-linejoin="round"/><path d="M${x0 - e} ${top + 6} L${f1(cx)} ${f1(top - h)} L${x1 + e} ${top + 6}" fill="none" stroke="${FOX}" stroke-width="8" stroke-linejoin="round"/>`;
    if (lv >= 3) { let d = ''; for (let t = 0.12; t < 0.95; t += 0.12) for (const s of [-1, 1]) { const x = cx + s * (1 - t) * ((x1 - x0) / 2 + e), y = top + 6 - t * (h + 6); d += `M${f1(x)} ${f1(y + 6)} l${s * -3} 9 l${s * 6} 0 Z`; } g += `<path d="${d}" fill="${FOXL}" stroke="${k.INK}" stroke-width="1.5"/>`; }
    return g + foxHead(k, cx, top - h - 10, 0.8 + lv * 0.06, lv >= 5);
  }
  function win(k, x, y, w, h, lv, lit = true) {
    const { f1, O } = k;
    let g = k.winLit(x, y, w, h, lit) + `<path d="M${f1(x - 7)} ${f1(y - 3)} h${f1(w + 14)} l-4 -10 h${f1(-w - 6)} Z" fill="${FOX}" ${O(2)}/><path d="M${f1(x - 6)} ${f1(y + h + 3)} h${f1(w + 12)}" stroke="${FOX}" stroke-width="5"/>`;
    return g;
  }

  function cabin(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([66, 80, 94, 104, 112][lv - 1], f.up - 14, w * 0.5));
    let g = '';
    if (lv >= 3) g += k.wall(x0, B - 26, w, B, 'rubble');
    g += k.wall(x0, top, w, lv >= 3 ? B - 26 : B, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), LOGC);
    g += k.roof(x0, x1, top, rh, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#a8925a' : ROOFC, false, lv <= 1 ? undefined : ROOFD) + (lv >= 2 ? trims(k, x0, x1, top, rh, lv) : '');
    const ww = [28, 32, 34, 36, 38][lv - 1], wh = [30, 38, 42, 46, 50][lv - 1], wy = top + Math.max(20, (f.wall - wh) * 0.36);
    if (!o.noWin) for (const x of [x0 + 20, x1 - 20 - ww]) if (Math.abs(x + ww / 2 - cx) > 56 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, LOGD, 0.95);
    if (o.pelts !== false && lv >= 2) for (let i = 0; i < Math.min(lv, 3); i++) g += pelt(k, (o.peltX != null ? o.peltX : x0 - 18) - i * 22, top + 20 + (i % 2) * 8, 0.8);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 28, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || LOGD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 60, 6);
    return { g, top, rh, cx, B };
  }

  const birch = (k, x, base, s) => k.use(k.sym('d68birch', () => { const { O } = k; let g = `<path d="M-7 0 Q-9 -100 -3 -200 H3 Q9 -100 7 0 Z" fill="#f2efe6" ${O(3)}/><path d="M-6 -30 h6 M0 -70 h6 M-6 -110 h5 M0 -150 h6 M-5 -180 h4" stroke="#2a2420" stroke-width="3"/>`; for (const [dx, dy, r, c] of [[-22, -200, 34, '#d8a03a'], [20, -214, 30, '#e8b84a'], [0, -240, 28, '#c8902a'], [-26, -160, 24, '#e8b84a'], [24, -170, 22, '#d8a03a']]) g += `<circle cx="${dx}" cy="${dy}" r="${r}" fill="${c}" ${O(2.5)}/>`; return g; }), x, base, s);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 28], [cx + ow / 2 + 28, x1]]) if (b - a > 12) { let d = ''; for (let x = a + 8; x < b; x += 20) d += `M${f1(x)} ${B} V${B - 70 - ((x * 7) % 14)}`; g += `<path d="${d}" stroke="${INK}" stroke-width="10"/><path d="${d}" stroke="#ece6da" stroke-width="6"/><path d="M${f1(a)} ${B - 44} H${f1(b)}" stroke="${LOGD}" stroke-width="7"/>`; }
      if (lv >= 3) { const sx = x0 + 30, t = B - f.wall; g += `<path d="M${f1(sx - 22)} ${B} V${f1(t + 40)} M${f1(sx + 22)} ${B} V${f1(t + 40)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(sx - 22)} ${B} V${f1(t + 40)} M${f1(sx + 22)} ${B} V${f1(t + 40)}" stroke="${LOGC}" stroke-width="6"/><rect x="${f1(sx - 30)}" y="${f1(t + 6)}" width="60" height="36" fill="${LOGC}" ${O(3)}/>` + k.roof(sx - 30, sx + 30, t + 6, 30, 'shingle', ROOFC, false, ROOFD); }
      for (const px of [cx - ow / 2 - 14, cx + ow / 2 + 14]) g += `<rect x="${f1(px - 14)}" y="${f1(B - ph)}" width="28" height="${f1(ph)}" fill="${LOGC}" ${O(4)}/>` + pelt(k, px, B - ph + 40, 0.9);
      const by = B - ph - 8;
      g += `<rect x="${f1(cx - ow / 2 - 34)}" y="${f1(by)}" width="${f1(ow + 68)}" height="22" rx="6" fill="${LOGC}" ${O(3.5)}/><path d="M${f1(cx - ow / 2 - 34)} ${f1(by + 22)} h${f1(ow + 68)}" stroke="${FOX}" stroke-width="5"/>` + foxHead(k, cx, by - 14, 1.3 + lv * 0.05, lv >= 5);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 34;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${FOX}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, CREAM);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = cabin(k, f, { sign: 'РАТУША', signBg: '#6a2a14' });
      let g = h.g;
      const sy = h.top - h.rh - 24;
      g += `<path d="M${f1(h.cx)} ${f1(sy + 10)} V${f1(sy - 50 - lv * 6)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(h.cx - 4)} ${f1(sy - 40 - lv * 6)} q20 -14 34 0 q8 -2 14 -12 q2 14 -10 20 q-18 6 -38 -8 Z" fill="${lv >= 5 ? k.GOLD : FOX}" ${O(2)}/>`;
      if (lv >= 3) for (const s of [-1, 1]) g += `<path d="M${f1(h.cx + s * 66)} ${h.B} V${h.B - 96}" stroke="${INK}" stroke-width="11"/><path d="M${f1(h.cx + s * 66)} ${h.B} V${h.B - 96}" stroke="${FOX}" stroke-width="6"/>`;
      if (lv >= 3) g += k.roof(h.cx - 76, h.cx + 76, h.B - 96, 28, 'shingle', ROOFC, false, ROOFD);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = cabin(k, f, { sign: 'ТРЕНЕР', signBg: '#7a2a14', peltX: f.x1 + 40 });
      let g = h.g;
      if (lv >= 2) { const bx = f.x0 - 40; g += `<path d="M${f1(bx - 34)} ${h.B} V${h.B - 110} H${f1(bx + 34)} V${h.B}" stroke="${INK}" stroke-width="7" fill="none"/><path d="M${f1(bx)} ${h.B - 110} v20" stroke="${INK}" stroke-width="2"/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="16" fill="none" stroke="#c8bc94" stroke-width="3"/><path d="M${f1(bx - 24)} ${h.B} q24 -40 48 0" fill="#e0b456" ${O(2.5)}/>` + foxHead(k, bx, h.B - 30, 0.7); }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${LOGD}" ${O(3.5)}/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${LOGC}" ${O(4)}/><rect x="${f1(x0 + 16)}" y="${f1(by0 + 10)}" width="${f1(w * 0.44)}" height="${f1((by1 - by0) * 0.72)}" fill="#efe0b8" ${O(2.5)}/><path d="M${f1(x0 + 26)} ${f1(by0 + 20)} l20 14 l-18 14 l22 14" stroke="#8a5a32" stroke-width="5" fill="none"/>`;
      for (const [dx, dy] of [[34, 22], [52, 40], [36, 56]]) g += `<circle cx="${f1(x0 + dx + 20)}" cy="${f1(by0 + dy)}" r="3" fill="${FOX}"/>`;
      for (let i = 0; i < 1 + Math.min(3, lv); i++) { const nx = x0 + w * 0.6 + (i % 2) * 32, ny = by0 + 12 + Math.floor(i / 2) * 44; g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="28" height="34" fill="${i % 2 ? '#e8d8b0' : '#f3efd8'}" ${O(2)}/><path d="M${f1(nx + 5)} ${f1(ny + 12)} h18 M${f1(nx + 5)} ${f1(ny + 22)} h12" stroke="${INK}" stroke-width="2" opacity=".45"/>`; }
      g += k.roof(x0 - 6, x1 + 6, by0 - 4, Math.min(f.up - 40, 26 + lv * 6), 'shingle', ROOFC, false, ROOFD) + (lv >= 3 ? foxHead(k, cx, by0 - 36 - lv * 6, 0.8, lv >= 5) : '');
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, LOGD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0, top, w, B, 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + `<rect x="${f1(x0 + 14)}" y="${f1(top + 16)}" width="${f1(w - 28)}" height="${f1(f.wall - 16)}" fill="#2e2216" ${O(3)}/>`;
      for (const y of [top + 30, top + 30 + f.wall * 0.34]) { g += `<path d="M${f1(x0 + 14)} ${f1(y)} H${f1(x1 - 14)}" stroke="#a8784a" stroke-width="5"/>`; for (let x = x0 + 34; x < x1 - 24; x += 34) g += pelt(k, x, y + 2, 0.75); }
      if (lv >= 5) g += pelt(k, cx, top + 32, 0.9).replace('#tgSd68pelt', '#tgSd68pelt') + `<circle cx="${f1(cx)}" cy="${f1(top + 70)}" r="10" fill="${k.GOLD}" ${O(2)}/>`;
      g += k.roof(x0, x1, top, Math.min(f.up - 20, 56 + lv * 10), 'shingle', ROOFC, false, ROOFD) + (lv >= 2 ? trims(k, x0, x1, top, Math.min(f.up - 20, 56 + lv * 10), lv) : '');
      if (lv >= 4) for (const bx of [x0 - 22, x1 + 22]) g += `<rect x="${f1(bx - 20)}" y="${B - 52}" width="40" height="52" rx="8" fill="#8a6a44" ${O(3)}/><path d="M${f1(bx - 20)} ${B - 38} h40 M${f1(bx - 20)} ${B - 14} h40" stroke="#4a3a2a" stroke-width="4"/>`;
      g += k.door(cx, B, 50 + lv * 3, Math.min(f.wall * 0.5, 60 + lv * 4), LOGD);
      k.signId('storage'); g += k.signLv(cx, top - 10, Math.min(w - 10, 130), 'СКЛАД', lv, 19, '#5a3a1e');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#7a7484');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = cabin(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, pelts: false });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) { const tx = mx + mw + 30 + i * 34, ty = h.B - 80; g += `<circle cx="${f1(tx)}" cy="${f1(ty)}" r="13" fill="none" stroke="#5a5662" stroke-width="4"/><path d="M${f1(tx - 13)} ${f1(ty)} h26" stroke="#5a5662" stroke-width="3" stroke-dasharray="3 3"/>`; }
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m)} ${f1(t - 26)} V${f1(t)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="${FOX}" ${O()}/><path d="M${f1(a + (b - a) * 0.12)} ${f1(B - h * 0.24)} L${f1(m)} ${f1(t + h * 0.16)} L${f1(b - (b - a) * 0.12)} ${f1(B - h * 0.24)}" stroke="${FOXL}" stroke-width="5" fill="none"/>`;
        let d = ''; for (let x = a + 6; x < b - 4; x += 12) d += `M${f1(x)} ${B} l3 -10 l3 10`; s += `<path d="${d}" fill="${CREAM}" stroke="${INK}" stroke-width="1.5"/>`;
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 30)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} L${f1(cx)} ${f1(B - 92 - lv * 5)} L${f1(cx + 30)} ${B} Z" fill="#3a1e10" ${O(3)}/>` + pelt(k, cx - 44, B - 96, 0.8) + pelt(k, cx + 44, B - 96, 0.8);
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#5a2a10');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = cabin(k, f, { sign: 'ЛАВКА', signBg: '#2f4a2a', dx: x1 - 44, noWin: true, pelts: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 24)} H${f1(ax0 - 10)} Z" fill="${FOX}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 20)} V${h.B}" stroke="${LOGD}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 40))); i < n; i++) g += pelt(k, ax0 + 22 + i * 40, ay + 26, 0.7);
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${LOGC}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(3, lv + 1); i++) { const hx = ax0 + 26 + i * 38; g += `<path d="M${f1(hx - 14)} ${h.B - 30} q0 -26 14 -26 q14 0 14 26 Z" fill="${i % 2 ? '#a8784a' : FOX}" ${O(2)}/><path d="M${f1(hx + 12)} ${h.B - 40} q14 4 14 18" stroke="${FOX}" stroke-width="5" fill="none" stroke-linecap="round"/>`; }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, hh = Math.min(150 + lv * 16, f.wall + Math.min(f.up - 60, 20 + lv * 10));
      let g = `<path d="M${f1(x0 - 24)} ${B} Q${f1(x0)} ${f1(B - hh)} ${f1(cx)} ${f1(B - hh)} Q${f1(x1)} ${f1(B - hh)} ${f1(x1 + 24)} ${B} Z" fill="#6a8a3a" ${O()}/>`;
      for (const s of [-1, 1]) { const ex = cx + s * w * 0.26, ey = B - hh * 0.86; g += `<path d="M${f1(ex - 26)} ${f1(ey + 14)} L${f1(ex + s * 6)} ${f1(ey - 56)} L${f1(ex + 26)} ${f1(ey + 14)} Z" fill="${FOX}" ${O(3)}/><path d="M${f1(ex - 12)} ${f1(ey + 6)} L${f1(ex + s * 3)} ${f1(ey - 34)} L${f1(ex + 12)} ${f1(ey + 6)} Z" fill="${lv >= 3 ? '#ffd76a' : CREAM}" ${O(2)}/>`; }
      let gr = ''; for (let i = 0; i < 14; i++) { const t = i / 13, x = x0 - 10 + (w + 20) * t, y = B - hh * (1 - (t - 0.5) ** 2 * 3.4) + 6; gr += `M${f1(x)} ${f1(y)} l-3 -9 M${f1(x + 4)} ${f1(y)} l3 -9`; }
      g += `<path d="${gr}" stroke="#8ab04a" stroke-width="2.5"/>`;
      const dr = 34 + lv * 3;
      g += `<path d="M${f1(cx - dr)} ${B} V${f1(B - dr)} A${dr} ${dr} 0 0 1 ${f1(cx + dr)} ${f1(B - dr)} V${B} Z" fill="#3a2a5a" ${O(3.5)}/><path d="M${f1(cx - dr - 8)} ${B} V${f1(B - dr)} A${dr + 8} ${dr + 8} 0 0 1 ${f1(cx + dr + 8)} ${f1(B - dr)} V${B}" fill="none" stroke="${LOGC}" stroke-width="8"/><circle cx="${f1(cx + dr * 0.5)}" cy="${f1(B - dr * 0.7)}" r="4" fill="${k.GOLD}"/>`;
      g += `<path d="M${f1(cx + w * 0.3)} ${f1(B - hh + 30)} v-40" stroke="${INK}" stroke-width="10"/><path d="M${f1(cx + w * 0.3)} ${f1(B - hh + 30)} v-40" stroke="#8a8494" stroke-width="5"/><circle cx="${f1(cx + w * 0.3 + 6)}" cy="${f1(B - hh - 24)}" r="10" fill="#a8a4b0" opacity=".45"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - w * 0.36 + i * 24)} ${f1(B - hh * 0.5 - (i % 2) * 20)} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="#ffd76a" ${O(1.2)}/>`;
      if (lv >= 5) g += k.orb(cx, B - hh - 4, 9);
      k.signId('magic'); g += k.signLv(cx, B - dr * 2 - 30, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  const art = {
    K: { leaf: ['#d8a03a', '#e8b84a', '#c8902a'], grass: '#8a9a5e', grass2: '#728250' },

    back(k) {
      const { P, L } = k;
      let g = `<path d="M0 690 Q900 650 1800 680 Q2600 600 3400 620 Q3900 630 4400 650 V720 H0 Z" fill="#6a7448" opacity=".8"/>`;
      P(0, L.W, g);
      for (let i = 0; i < 12; i++) { const x = 1900 + i * 210 + ((i * 41) % 60); P(x - 40, x + 40, `<g opacity=".75">${birch(k, x, 690 - ((i * 17) % 20), 0.5 + (i % 3) * 0.06)}</g>`); }
    },

    water(k) {
      const { P, L, f1 } = k, G = L.hx.paws || [];
      let d = '';
      for (let i = 1; i < G.length; i++) { const [ax, ay] = G[i - 1], [bx, by] = G[i], len = Math.hypot(bx - ax, by - ay), n = Math.floor(len / 70); for (let j = 1; j < n; j++) { const t = j / n, x = ax + (bx - ax) * t + (j % 2 ? 8 : -8), y = ay + (by - ay) * t; d += `M${f1(x - 4)} ${f1(y)} a4 5 0 1 0 8 0 a4 5 0 1 0 -8 0 M${f1(x - 6)} ${f1(y - 8)} h2 M${f1(x)} ${f1(y - 10)} h1 M${f1(x + 5)} ${f1(y - 8)} h2`; } }
      P(600, 1400, `<path d="${d}" stroke="#3a2a14" stroke-width="3" fill="#3a2a14" opacity=".45"/>`, 880, 1400);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) { k.P(a, b, birch(k, (a + b) / 2, 792, 0.9)); return; }
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 24, up: 110, lv: 2 };
        k.P(a, b, cabin(k, f, { door: false, noWin: true, pelts: i % 2 === 0 }).g + win(k, i % 2 ? a + 32 : x1 - 58, 792 - f.wall + 24, 28, 34, 2) + k.door(i % 2 ? x1 - 42 : a + 54, 792, 38, 60, LOGD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + foxHead(k, lot.x0 + 10, 664, 0.7);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = cabin(k, f, { door: false, noWin: true, peltX: c.v % 2 ? x1 + 40 : x0 - 18 }).g + win(k, c.v % 2 ? x0 + 24 : x1 - 58, 795 - f.wall + 24, 30, 36, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, LOGD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(280 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'foxidol') {

        let g = k.ell(x, y + 4, 90, 18) + `<path d="M${x - 60} ${y} Q${x - 56} ${y - 50} ${x - 50} ${y - 70} H${x + 50} Q${x + 56} ${y - 50} ${x + 60} ${y} Z" fill="${LOGC}" ${O(4)}/><ellipse cx="${x}" cy="${y - 70}" rx="50" ry="12" fill="#c8a06a" ${O(3)}/><ellipse cx="${x}" cy="${y - 70}" rx="30" ry="7" fill="none" stroke="#8a5a32" stroke-width="2"/>`;
        g += `<path d="M${x + 30} ${y - 76} Q${x + 80} ${y - 90} ${x + 70} ${y - 150} Q${x + 60} ${y - 120} ${x + 34} ${y - 110} Z" fill="${FOX}" ${O(3)}/><path d="M${x + 66} ${y - 140} q4 -12 4 -12 q-10 4 -12 14 Z" fill="${CREAM}"/>`;
        g += `<path d="M${x - 30} ${y - 76} Q${x - 36} ${y - 130} ${x - 10} ${y - 150} Q${x + 30} ${y - 160} ${x + 34} ${y - 110} L${x + 30} ${y - 76} Z" fill="${FOX}" ${O(3.5)}/><path d="M${x - 14} ${y - 76} V${y - 100} M${x + 14} ${y - 76} V${y - 96}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 28} ${y - 120} l-14 -14 l-6 8" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
        g += foxHead(k, x - 8, y - 168, 1.9);
        for (const [dx, c] of [[-50, '#c8402a'], [44, '#f6e8d0'], [-6, '#3a6aa8']]) g += `<path d="M${x + dx} ${y - 62} q4 20 -2 36" stroke="${c}" stroke-width="5" fill="none"/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 220 * s, h: 260 * s };
      }
      if (p.k === 'snare') return { g: k.ell(x, y, 30, 7) + `<path d="M${x - 26} ${y} L${x - 10} ${y - 80} L${x + 10} ${y - 80} L${x + 26} ${y}" stroke="${INK}" stroke-width="6" fill="none"/><path d="M${x - 26} ${y} L${x - 10} ${y - 80} H${x + 10} L${x + 26} ${y}" stroke="#a8784a" stroke-width="3" fill="none"/><path d="M${x} ${y - 80} v30" stroke="#c8bc94" stroke-width="2"/><circle cx="${x}" cy="${y - 38}" r="11" fill="none" stroke="#c8bc94" stroke-width="2.5"/>`, w: 80, h: 90 };
      if (p.k === 'pelts') { let g = k.ell(x, y, 50, 9) + `<path d="M${x - 46} ${y} V${y - 110} M${x + 46} ${y} V${y - 110} M${x - 52} ${y - 106} H${x + 52}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${x - 46} ${y} V${y - 110} M${x + 46} ${y} V${y - 110}" stroke="#a8784a" stroke-width="4"/>`; for (let i = 0; i < 3; i++) g += pelt(k, x - 28 + i * 28, y - 104, 0.8); return { g, w: 130, h: 130 }; }
      if (p.k === 'birch') return { g: k.ell(x, y, 30 * s, 8) + birch(k, x, y, s), w: 120 * s, h: 270 * s };
      return null;
    },
  };

  return {
    id: 'd68', ver: 1, name: 'Ряскогорье', layout, art,
    story: 'Деревня скорняков и ловцов на сухой гриве над топью: срубы с рыжими причелинами и лисьими головами на коньках, у стен сушатся шкурки. Гать петляет зигзагом меж бочагов по следам лиса, что когда-то провёл людей через трясину, а на гриве стоит деревянный Лис-проводник.',
  };
});
