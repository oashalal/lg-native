



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const M1 = '#4f7a32', M2 = '#6a9a3e', M3 = '#86b44a', MD = '#2f5220', STONE = '#8a8a7a', STONED = '#62625a', WOOD = '#7a5a3a', WOODD = '#4a3420', GLOW = '#7affd8', HERB = '#9aa84a';
  const KINDS = { hermit: { foot: [100, 26], tall: 300 }, boulder: { foot: [44, 14], tall: 70 }, herbrack: { foot: [44, 10], tall: 110 }, shroom: { foot: [16, 7], tall: 60 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1270, x1: 1570 },
        storage: { x0: 1640, x1: 1920 },
        trainer: { x0: 2600, x1: 2880 },
        magic: { x0: 2950, x1: 3180 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 2040, x1: 2320, B: 1210 },
        tent: { x0: 3300, x1: 3650, B: 1200 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 910], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'cross', w: 32, pts: [[1960, 908], [1960, 1300]] },
        { k: 'cross', w: 32, pts: [[3950, 908], [3950, 1300]] },
        { k: 'lane', w: 34, pts: [[1100, 1330], [1300, 1316], [1500, 1300], [1960, 1300], [2400, 1292], [2900, 1304], [3480, 1290], [3950, 1300], [4300, 1296]] },
      ],
      plazas: [{ k: 'central', x: 900, y: 1330, rx: 200, ry: 84, mark: 'hermit', ms: 1.25 }],
      water: [{ k: 'bog', e: [900, 1180, 230, 40] }, { k: 'bog', e: [560, 1320, 110, 76] }, { k: 'bog', e: [900, 1446, 230, 16] }, { k: 'bog', e: [1240, 1430, 90, 26] }, { k: 'bog', e: [2700, 1420, 160, 30] }, { k: 'bog', e: [3200, 1430, 120, 24] }, { k: 'bog', e: [2400, 1100, 140, 36] }],
      kinds: KINDS,
      props: [['boulder', 1450, 1100], ['boulder', 3500, 1060], ['herbrack', 2880, 1180], ['shroom', 1160, 1250], ['shroom', 640, 1200], ['boulder', 3900, 1420]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 1500, x1: 1710, base: 1450 }, { x0: 2380, x1: 2590, base: 1452 }, { x0: 4100, x1: 4310, base: 1450 }],
      fill: [{ k: ['reeds', 'reeds', 'shroom', 'boulder', 'deadtree', 'mushroom'], n: 26, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'shroom'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1990, 2200], [2250, 2560], [3220, 3440], [3480, 3700], [3750, 4000]] },
    };
  }

   
  const shroom = (k, x, y, s = 1) => k.use(k.sym('d70shroom', () => { const { O } = k; return `<path d="M-3 0 v-12 h6 v12 Z" fill="#efe4cc" ${O(1.5)}/><path d="M-10 -10 Q0 -24 10 -10 Z" fill="#c8643a" ${O(1.5)}/><circle cx="-3" cy="-15" r="1.6" fill="#fff"/>`; }), x, y, s);

  function dome(k, x0, x1, top, h, lv, base) {
    const { f1, O } = k, cx = (x0 + x1) / 2, e = 26, yb = base != null ? base : top + 10;
    const d = `M${f1(x0 - e)} ${f1(yb)} Q${f1(x0 - e)} ${f1(top - h)} ${f1(cx)} ${f1(top - h)} Q${f1(x1 + e)} ${f1(top - h)} ${f1(x1 + e)} ${f1(yb)} Z`;
    let g = `<path d="${d}" fill="${lv >= 3 ? M2 : M1}" ${O()}/>`;
    for (const [u, v, r] of [[0.2, 0.5, 18], [0.45, 0.18, 22], [0.7, 0.36, 16], [0.86, 0.66, 12], [0.1, 0.78, 12], [0.58, 0.62, 14]]) g += `<ellipse cx="${f1(x0 - e + (x1 - x0 + 2 * e) * u)}" cy="${f1(top - h + (yb - top + h) * v)}" rx="${r}" ry="${f1(r * 0.6)}" fill="${lv >= 3 ? M3 : M2}"/>`;
    let gr = ''; for (let i = 0; i < 12; i++) { const t = i / 11, x = x0 - e + 10 + (x1 - x0 + 2 * e - 20) * t, y = top - h + (1 - Math.sin(Math.PI * t)) * (yb - top + h) * 0.9 + 4; gr += `M${f1(x)} ${f1(y)} l-2 -7 M${f1(x + 4)} ${f1(y)} l2 -8`; }
    g += `<path d="${gr}" stroke="${MD}" stroke-width="2.5"/>`;
    if (lv >= 2) for (let i = 0; i < Math.min(lv, 4); i++) g += shroom(k, x0 + (x1 - x0) * (0.18 + i * 0.22), top - h * (0.55 + (i % 2) * 0.2) + 6, 0.9 + (i % 2) * 0.3);
    return g;
  }
  function rwin(k, x, y, r, lv, lit = true) {
    const { f1, O } = k;
    return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + 6)}" fill="${WOOD}" ${O(3)}/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${lit ? '#ffd27a' : '#4a4a5a'}" ${O(2)}/><path d="M${f1(x - r)} ${f1(y)} h${f1(r * 2)} M${f1(x)} ${f1(y - r)} v${f1(r * 2)}" stroke="${WOODD}" stroke-width="2.5"/>` + (lv >= 3 ? `<path d="M${f1(x - r - 8)} ${f1(y + r + 6)} h${f1(r * 2 + 16)}" stroke="${WOODD}" stroke-width="5"/>` : '');
  }
  function rdoor(k, cx, B, w, h, c = WOODD) {
    const { f1, O } = k, r = w / 2;
    return `<path d="M${f1(cx - r - 7)} ${B} V${f1(B - h + r)} A${f1(r + 7)} ${f1(r + 7)} 0 0 1 ${f1(cx + r + 7)} ${f1(B - h + r)} V${B} Z" fill="${STONE}" ${O(3)}/><path d="M${f1(cx - r)} ${B} V${f1(B - h + r)} A${f1(r)} ${f1(r)} 0 0 1 ${f1(cx + r)} ${f1(B - h + r)} V${B} Z" fill="${c}" ${O(2.5)}/><path d="M${f1(cx)} ${f1(B - h + 4)} V${B}" stroke="#2a1e14" stroke-width="2.5"/><circle cx="${f1(cx + r * 0.55)}" cy="${f1(B - h * 0.45)}" r="3.5" fill="${k.GOLD}"/>`;
  }

  function moundHouse(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const wallH = Math.round(f.wall * 0.42), top = B - wallH, rh = Math.round(o.roofH || Math.min(f.wall * 0.58 + [30, 40, 50, 60, 66][lv - 1], f.up + f.wall * 0.58 - 10));
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'rubble' : 'stone');
    g += dome(k, x0, x1, top, rh, lv);
    const dw = [46, 50, 54, 58, 62][lv - 1], dh = Math.min([70, 78, 86, 92, 98][lv - 1], wallH + rh * 0.5);
    g += `<path d="M${k.f1(cx - dw / 2 - 18)} ${k.f1(B - dh - 10)} Q${k.f1(cx)} ${k.f1(B - dh - 34)} ${k.f1(cx + dw / 2 + 18)} ${k.f1(B - dh - 10)} V${B} H${k.f1(cx - dw / 2 - 18)} Z" fill="${WOOD}" ${k.O(3)}/>`;
    if (!o.noWin) { const r = [12, 14, 15, 16, 17][lv - 1], wy = B - dh * 0.62; for (const x of [x0 + 26, x1 - 26]) if (Math.abs(x - cx) > 60 && (lv > 1 || x < cx)) g += rwin(k, x, wy, r, lv); if (lv >= 3) g += rwin(k, cx, top - rh * 0.5, r * 0.9, lv); }
    if (o.door !== false) g += rdoor(k, cx, B, dw, dh);
    if (lv >= 2) { const px = x1 - 30; g += `<rect x="${k.f1(px - 10)}" y="${k.f1(top - rh * 0.72 - 20)}" width="20" height="34" fill="${STONED}" ${k.O(2.5)}/><circle cx="${k.f1(px + 4)}" cy="${k.f1(top - rh * 0.72 - 36)}" r="9" fill="#a8a4b0" opacity=".4"/>`; }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), B - dh - 44, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || WOODD);
    if (lv >= 5) g += k.garland(x0 + 4, x1 - 4, top + 12, 5);
    return { g, top, rh, cx, B, dh };
  }

  const herbs = (k, x, y, s = 1) => k.use(k.sym('d70herb', () => { const { O } = k; return `<path d="M0 0 v6" stroke="#1e1a14" stroke-width="2"/><path d="M-8 6 L0 40 L8 6 Z" fill="${HERB}" ${O(2)}/><path d="M-4 8 l2 26 M4 8 l-2 26" stroke="#6a7a2a" stroke-width="2"/><path d="M-9 8 h18" stroke="#c8402a" stroke-width="3"/>`; }), x, y, s);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 34], [cx + ow / 2 + 34, x1]]) if (b - a > 12) for (let x = a + 14; x < b; x += 30) g += `<path d="M${f1(x - 15)} ${B} Q${f1(x - 16)} ${B - 40} ${f1(x)} ${B - 44 - ((x * 7) % 12)} Q${f1(x + 16)} ${B - 40} ${f1(x + 15)} ${B} Z" fill="${STONE}" ${O(2.5)}/><path d="M${f1(x - 12)} ${B - 30} Q${f1(x)} ${B - 50} ${f1(x + 12)} ${B - 32}" stroke="${M2}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      if (lv >= 3) { const sx = x0 + 28, t = B - f.wall * 0.9; g += `<path d="M${f1(sx - 30)} ${B} L${f1(sx - 8)} ${f1(t)} H${f1(sx + 8)} L${f1(sx + 30)} ${B} Z" fill="${STONED}" ${O(3)}/><path d="M${f1(sx - 22)} ${f1(B - (B - t) * 0.3)} h44 M${f1(sx - 16)} ${f1(B - (B - t) * 0.6)} h32" stroke="${STONE}" stroke-width="5"/><circle cx="${f1(sx)}" cy="${f1(t - 10)}" r="9" fill="${GLOW}" ${O(2)}/><circle cx="${f1(sx)}" cy="${f1(t - 10)}" r="22" fill="${GLOW}" opacity=".2"/>`; }
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += `<path d="M${f1(px - 30)} ${B} Q${f1(px - 34)} ${f1(B - ph * 0.6)} ${f1(px - 14)} ${f1(B - ph)} H${f1(px + 14)} Q${f1(px + 34)} ${f1(B - ph * 0.6)} ${f1(px + 30)} ${B} Z" fill="${STONE}" ${O(4)}/><path d="M${f1(px - 20)} ${f1(B - ph + 6)} Q${f1(px)} ${f1(B - ph - 12)} ${f1(px + 20)} ${f1(B - ph + 6)} Q${f1(px + 26)} ${f1(B - ph * 0.6)} ${f1(px + 16)} ${f1(B - ph * 0.4)}" fill="${M1}" stroke="${MD}" stroke-width="2.5"/>`; }
      const by = B - ph - 12;
      g += `<rect x="${f1(cx - ow / 2 - 44)}" y="${f1(by)}" width="${f1(ow + 88)}" height="22" rx="5" fill="${WOOD}" ${O(3.5)}/>`;
      let d = ''; for (let x = cx - ow / 2 - 36; x < cx + ow / 2 + 40; x += 15) d += `M${f1(x)} ${f1(by + 20)} q-2 ${8 + ((x * 3) % 12)} 2 ${16 + ((x * 3) % 12)}`;
      g += `<path d="${d}" stroke="${M1}" stroke-width="5" fill="none" stroke-linecap="round"/>` + shroom(k, cx - ow / 2 - 20, by, 1.2) + shroom(k, cx + ow / 2 + 26, by, 1);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(by - 14)}" r="10" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 40;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${WOODD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, '#e8f0d0');
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = moundHouse(k, f, { sign: 'РАТУША', signBg: '#5a2a1a' });
      let g = h.g;
      const bx = f.x1 + 18, bt = h.B - 120 - lv * 8;
      g += `<path d="M${f1(bx - 14)} ${h.B} V${f1(bt)} M${f1(bx + 14)} ${h.B} V${f1(bt)} M${f1(bx - 20)} ${f1(bt)} h40" stroke="${INK}" stroke-width="8"/><path d="M${f1(bx - 14)} ${h.B} V${f1(bt)} M${f1(bx + 14)} ${h.B} V${f1(bt)}" stroke="${WOOD}" stroke-width="4"/><path d="M${f1(bx - 9)} ${f1(bt + 6)} q9 -5 18 0 l3 18 h-24 Z" fill="${lv >= 5 ? k.GOLD : '#c8a05a'}" ${O(2)}/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = moundHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a2a1a' });
      let g = h.g;
      if (lv >= 2) { const bx = f.x0 - 36; g += `<path d="M${f1(bx - 18)} ${h.B} L${f1(bx)} ${h.B - 90} L${f1(bx + 18)} ${h.B}" stroke="${INK}" stroke-width="5" fill="none"/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="28" fill="${M2}" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="17" fill="#efe4cc" ${O(2)}/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="7" fill="#c8402a"/>`; }
      for (let i = 0; i < 1 + Math.min(lv, 3); i++) { const sx = f.x1 + 16 + i * 14; g += `<path d="M${f1(sx)} ${h.B - 10} q-14 -60 0 -120" stroke="${INK}" stroke-width="6" fill="none"/><path d="M${f1(sx)} ${h.B - 10} q-14 -60 0 -120" stroke="#a8784a" stroke-width="3" fill="none"/><path d="M${f1(sx)} ${h.B - 10} V${h.B - 130}" stroke="#e8e0c8" stroke-width="1.5"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<path d="M${f1(x0 + 4)} ${B} L${f1(x0 + 12)} ${f1(top + 10)} Q${f1(cx)} ${f1(top - 16)} ${f1(x1 - 12)} ${f1(top + 10)} L${f1(x1 - 4)} ${B} Z" fill="${STONE}" ${O(4)}/><path d="M${f1(x0 + 12)} ${f1(top + 12)} Q${f1(cx)} ${f1(top - 14)} ${f1(x1 - 12)} ${f1(top + 12)} Q${f1(cx + 30)} ${f1(top + 20)} ${f1(cx)} ${f1(top + 16)} Q${f1(cx - 40)} ${f1(top + 24)} ${f1(x0 + 12)} ${f1(top + 12)} Z" fill="${M2}" stroke="${MD}" stroke-width="2.5"/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = top + 36 + Math.floor(i / 3) * 56, nw = Math.min(54, (w - 56) / 3); g += `<g transform="rotate(${(i * 11) % 9 - 4} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${i % 2 ? '#eee6d0' : '#f6f2e4'}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/></g>`; }
      if (lv >= 3) g += shroom(k, x0 + 18, top + 18, 1.2) + shroom(k, x1 - 24, top + 16, 1);
      k.signId('board'); g += k.signLv(cx, B - 30, Math.min(w - 10, 140), 'ДОСКА', lv, 20, WOODD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, hh = Math.min(f.wall + 30, 150 + lv * 20);
      let g = dome(k, x0 + 10, x1 - 10, B - hh * 0.2, hh * 0.8, lv, B);
      const dw = Math.min(w * 0.4, 70 + lv * 6), dh = Math.min(hh - 30, 86 + lv * 6);
      g += `<path d="M${f1(cx - dw / 2 - 16)} ${B} V${f1(B - dh)} H${f1(cx + dw / 2 + 16)} V${B}" fill="${WOOD}" ${O(3.5)}/><path d="M${f1(cx - dw / 2 - 24)} ${f1(B - dh - 4)} h${f1(dw + 48)}" stroke="${k.INK}" stroke-width="14"/><path d="M${f1(cx - dw / 2 - 24)} ${f1(B - dh - 4)} h${f1(dw + 48)}" stroke="${WOOD}" stroke-width="9"/>` + k.door(cx, B, dw, dh - 10, WOODD);
      if (lv >= 4) g += `<path d="M${f1(x1 - 70)} ${B} V${B - 60} H${f1(x1 - 20)} V${B}" fill="${WOOD}" ${O(3)}/>` + k.door(x1 - 45, B, 34, 52, WOODD);
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<rect x="${f1(x0 + 10 + i * 34)}" y="${B - 44}" width="30" height="44" rx="7" fill="#8a6a44" ${O(2.5)}/><path d="M${f1(x0 + 10 + i * 34)} ${B - 30} h30 M${f1(x0 + 10 + i * 34)} ${B - 12} h30" stroke="#4a3a2a" stroke-width="3"/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(B - dh - 26)}" r="10" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx, B - dh - 40, Math.min(w - 20, 130), 'СКЛАД', lv, 19, '#4a3a1e');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1], top = f.B - f.wall * 0.5;
      let g = k.chimney(chx, top - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), STONE);
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(top - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      g += k.wall(x0, top, f.x1 - x0, f.B, 'stone') + dome(k, x0, f.x1, top, Math.min(f.up + f.wall * 0.5 - 20, 60 + lv * 14), lv);
      g += k.bigDoor(cx, f.B, lv, WOODD, 0.95) + k.signLv(cx, top - 20, Math.min(f.x1 - x0, 130), 'КУЗНЯ', lv, 20, '#3a3a4a');
      const mt = f.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${f.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${f.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(f.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      if (lv >= 2) g += `<path d="M${f1(mx + mw + 8)} ${f.B - 22} l34 -20 l10 14 l-34 20 Z" fill="#8a5a3a" ${O(2.5)}/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 10, cx, x1 - 10]) g += `<path d="M${f1(px)} ${B} V${f1(top + 10)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(px)} ${B} V${f1(top + 10)}" stroke="${WOOD}" stroke-width="5"/>`;
      const rh = Math.min(f.up - 30, 50 + lv * 14);
      g += `<path d="M${f1(x0 - 20)} ${f1(top + 16)} Q${f1(cx)} ${f1(top - rh)} ${f1(x1 + 20)} ${f1(top + 16)} Q${f1(cx)} ${f1(top - rh * 0.2)} ${f1(x0 - 20)} ${f1(top + 16)} Z" fill="${M1}" ${O()}/>`;
      let d = ''; for (let x = x0 - 10; x < x1 + 14; x += 16) d += `M${f1(x)} ${f1(top + 12 - (1 - ((x - cx) / (w / 2 + 20)) ** 2) * rh * 0.4)} q-2 12 2 22`; g += `<path d="${d}" stroke="${MD}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      for (const [y, n] of [[top + 40, 1], [top + 40 + f.wall * 0.3, lv >= 4 ? 1 : 0]]) if (n) { g += `<path d="M${f1(x0)} ${f1(y)} H${f1(x1)}" stroke="#a8784a" stroke-width="5"/>`; for (let x = x0 + 22; x < x1 - 14; x += 30) g += herbs(k, x, y + 2, 1); }
      g += `<path d="M${f1(cx - 30)} ${B} Q${f1(cx - 28)} ${f1(B - 70 - lv * 4)} ${f1(cx)} ${f1(B - 82 - lv * 4)} Q${f1(cx + 28)} ${f1(B - 70 - lv * 4)} ${f1(cx + 30)} ${B} Z" fill="#2a2416" ${O(3)}/>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - rh * 0.6)}" r="9" fill="${k.GOLD}" ${O(2)}/>`;
      k.signId('tent'); g += k.signLv(cx, top - rh * 0.3, Math.min(w - 30, 140), 'ШАТЁР', lv, 19, '#3a3a1e');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = moundHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f4a2a', dx: x1 - 50, noWin: true });
      let g = h.g;
      const ax0 = x0 - 6, ax1 = x1 - 96, ay = h.B - 110;
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 8)} ${f1(ay + 20)} H${f1(ax0 - 8)} Z" fill="${M1}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 16)} V${h.B}" stroke="${WOODD}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 28))); i < n; i++) g += herbs(k, ax0 + 16 + i * 28, ay + 20, 0.9);
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 28}" width="${f1(ax1 - ax0 - 6)}" height="28" fill="${WOOD}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(4, lv + 1); i++) g += `<rect x="${f1(ax0 + 14 + i * 24)}" y="${h.B - 48}" width="16" height="20" rx="4" fill="${['#7ab0d8', HERB, '#c8643a', GLOW][i]}" ${O(2)}/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall - Math.min(40, lv * 8);
      let g = `<path d="M${f1(x0 - 20)} ${B} Q${f1(x0 - 26)} ${f1(top + 40)} ${f1(x0 + 20)} ${f1(top)} Q${f1(cx)} ${f1(top - 40)} ${f1(x1 - 20)} ${f1(top)} Q${f1(x1 + 26)} ${f1(top + 40)} ${f1(x1 + 20)} ${B} Z" fill="${STONE}" ${O()}/>`;
      g += `<path d="M${f1(x0 - 4)} ${f1(top + 20)} Q${f1(cx)} ${f1(top - 30)} ${f1(x1 + 4)} ${f1(top + 20)} Q${f1(x1 - 20)} ${f1(top + 10)} ${f1(cx)} ${f1(top + 4)} Q${f1(x0 + 20)} ${f1(top + 10)} ${f1(x0 - 4)} ${f1(top + 20)} Z" fill="${M1}" stroke="${MD}" stroke-width="2.5"/>`;
      const aw = w * 0.62, ah = (B - top) * 0.7;
      g += `<path d="M${f1(cx - aw / 2)} ${B} V${f1(B - ah + aw / 2)} A${f1(aw / 2)} ${f1(aw / 2)} 0 0 1 ${f1(cx + aw / 2)} ${f1(B - ah + aw / 2)} V${B} Z" fill="#14302a" ${O(3.5)}/><ellipse cx="${f1(cx)}" cy="${f1(B - ah * 0.45)}" rx="${f1(aw * 0.5)}" ry="${f1(ah * 0.45)}" fill="${GLOW}" opacity=".18"/>`;
      for (let i = 0; i < 3 + lv; i++) { const t = i / (2 + lv), x = cx - aw / 2 + 10 + (aw - 20) * t, y = B - 8 - ((i * 37) % Math.max(20, ah * 0.7)); g += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="9" ry="5" fill="${GLOW}"/>`; }
      for (const [dx, hh, c] of [[-aw * 0.3, 40, '#b8a2ff'], [aw * 0.22, 54, GLOW], [aw * 0.02, 30, '#ffffff']].slice(0, 1 + Math.min(lv, 2))) g += `<path d="M${f1(cx + dx - 9)} ${B} L${f1(cx + dx)} ${f1(B - hh)} L${f1(cx + dx + 9)} ${B} Z" fill="${c}" ${O(2)}/>`;
      if (lv >= 5) g += k.orb(cx, top - 26, 9);
      k.signId('magic'); g += k.signLv(cx, B - ah - 24, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#1e4a3a');
      return g;
    },
  };

  const art = {
    K: { leaf: ['#4f7a32', '#6a9a3e', '#3f6a2a'] },
    back(k) {
      const { P, L } = k;
      let g = `<path d="M0 690 Q800 640 1600 670 Q2400 630 3200 664 Q3900 640 4400 676 V720 H0 Z" fill="#4e6a3e" opacity=".8"/>`;
      for (let i = 0; i < 9; i++) { const x = 200 + i * 480 + ((i * 61) % 100); g += `<path d="M${x - 70} 696 Q${x - 60} 630 ${x} 620 Q${x + 60} 630 ${x + 70} 696 Z" fill="${['#5a7a44', '#4e6e3e', '#62824a'][i % 3]}"/>`; }
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 150) return;
        const x1 = Math.min(b - 26, a + 200), f = { x0: a + 26, x1, B: 792, wall: 96 + (i * 13) % 20, up: 50, lv: 2 };
        k.P(a, b, moundHouse(k, f, { door: false, noWin: true }).g + rwin(k, i % 2 ? a + 60 : x1 - 30, 792 - 50, 13, 2) + rdoor(k, i % 2 ? x1 - 40 : a + 80, 792, 40, 66));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + shroom(k, lot.x0 + 10, 790, 1.4);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2 + 6, x1 = cx + w / 2 - 6;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 16), up: 50, lv: 2 };
      const g0 = moundHouse(k, f, { door: false, noWin: true }).g + rwin(k, c.v % 2 ? x0 + 30 : x1 - 30, 745, 13, 2) + rdoor(k, c.v % 2 ? x1 - 46 : x0 + 46, 795, 40, 66) + herbs(k, c.v % 2 ? x0 + 70 : x1 - 70, 700, 0.9);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(240 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'hermit') {

        let g = k.ell(x, y + 4, 120, 20) + `<path d="M${x - 96} ${y} Q${x - 70} ${y - 20} ${x - 74} ${y - 90} L${x - 80} ${y - 190} L${x - 50} ${y - 210} L${x - 30} ${y - 186} L${x} ${y - 214} L${x + 30} ${y - 190} L${x + 56} ${y - 206} L${x + 78} ${y - 184} L${x + 74} ${y - 90} Q${x + 70} ${y - 20} ${x + 96} ${y} Z" fill="${WOOD}" ${O(4.5)}/>`;
        g += `<path d="M${x - 56} ${y - 40} q-6 -60 2 -120 M${x + 50} ${y - 50} q8 -50 0 -110 M${x - 20} ${y - 150} q6 -20 0 -40" stroke="${WOODD}" stroke-width="4" fill="none"/>`;
        g += `<path d="M${x - 86} ${y - 186} Q${x - 50} ${y - 236} ${x} ${y - 226} Q${x + 60} ${y - 240} ${x + 84} ${y - 180} Q${x + 40} ${y - 196} ${x} ${y - 190} Q${x - 40} ${y - 200} ${x - 86} ${y - 186} Z" fill="${M2}" stroke="${MD}" stroke-width="3"/><path d="M${x - 70} ${y - 186} q-2 30 4 50 M${x + 70} ${y - 182} q2 26 -2 40 M${x - 30} ${y - 196} q-2 16 2 26" stroke="${M1}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
        g += rdoor(k, x - 10, y, 50, 86) + rwin(k, x + 44, y - 120, 13, 3) + shroom(k, x - 60, y - 196, 1.4) + shroom(k, x + 30, y - 212, 1.2);
        g += `<path d="M${x - 78} ${y - 120} h-18 v14" stroke="${INK}" stroke-width="3" fill="none"/><circle cx="${x - 96}" cy="${y - 96}" r="20" fill="#ffd27a" opacity=".25"/><path d="M${x - 103} ${y - 106} h14 l-2 18 h-10 Z" fill="#ffd76a" ${O(2)}/>`;

        const hx = x + 66, hy = y + 6;
        g += `<rect x="${hx - 16}" y="${hy - 22}" width="32" height="22" rx="5" fill="${WOODD}" ${O(2.5)}/><path d="M${hx - 18} ${hy - 22} Q${hx - 20} ${hy - 70} ${hx} ${hy - 76} Q${hx + 20} ${hy - 70} ${hx + 18} ${hy - 22} Z" fill="#7a6a5a" ${O(3)}/><circle cx="${hx}" cy="${hy - 84}" r="13" fill="#f0d8b8" ${O(2.5)}/><path d="M${hx - 13} ${hy - 86} Q${hx - 16} ${hy - 104} ${hx} ${hy - 104} Q${hx + 16} ${hy - 104} ${hx + 13} ${hy - 86} Z" fill="#7a6a5a" ${O(2)}/><path d="M${hx - 9} ${hy - 80} Q${hx} ${hy - 40} ${hx + 9} ${hy - 80} Z" fill="#f4f0e6" ${O(1.5)}/><circle cx="${hx - 4}" cy="${hy - 86}" r="1.8" fill="${INK}"/><circle cx="${hx + 4}" cy="${hy - 86}" r="1.8" fill="${INK}"/><path d="M${hx + 24} ${hy} L${hx + 30} ${hy - 120}" stroke="${INK}" stroke-width="6"/><path d="M${hx + 24} ${hy} L${hx + 30} ${hy - 120}" stroke="#a8784a" stroke-width="3"/><circle cx="${hx + 30}" cy="${hy - 124}" r="6" fill="${GLOW}" ${O(1.5)}/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 300 * s, h: 300 * s };
      }
      if (p.k === 'boulder') return { g: k.ell(x, y, 44 * s, 10) + `<path d="M${f1(x - 42 * s)} ${y} Q${f1(x - 46 * s)} ${f1(y - 50 * s)} ${f1(x - 6 * s)} ${f1(y - 60 * s)} Q${f1(x + 40 * s)} ${f1(y - 58 * s)} ${f1(x + 44 * s)} ${y} Z" fill="${STONE}" ${O(3)}/><path d="M${f1(x - 36 * s)} ${f1(y - 34 * s)} Q${f1(x - 10 * s)} ${f1(y - 68 * s)} ${f1(x + 30 * s)} ${f1(y - 44 * s)} Q${f1(x + 6 * s)} ${f1(y - 40 * s)} ${f1(x - 36 * s)} ${f1(y - 34 * s)} Z" fill="${M2}" stroke="${MD}" stroke-width="2"/>`, w: 100 * s, h: 70 * s };
      if (p.k === 'herbrack') { let g = k.ell(x, y, 44, 8) + `<path d="M${x - 40} ${y} V${y - 100} M${x + 40} ${y} V${y - 100} M${x - 46} ${y - 96} H${x + 46}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 40} ${y} V${y - 100} M${x + 40} ${y} V${y - 100}" stroke="#a8784a" stroke-width="3.5"/>`; for (let i = 0; i < 4; i++) g += herbs(k, x - 30 + i * 20, y - 94, 0.9); return { g, w: 110, h: 110 }; }
      if (p.k === 'shroom') return { g: k.ell(x, y, 16, 4) + shroom(k, x - 6, y, 2) + shroom(k, x + 10, y, 1.3), w: 50, h: 50, flat: true };
      return null;
    },
  };

  return {
    id: 'd70', ver: 1, name: 'Мохище', layout, art,
    story: 'Деревня травников и мохособирателей: землянки под толстыми моховыми куполами, с круглыми окнами и дверями, на кровлях растут грибы. В глубине заводей, на островке меж бочагов, в избе внутри огромного замшелого пня живёт Отшельник, а чародей держит грот светящегося мха.',
  };
});
