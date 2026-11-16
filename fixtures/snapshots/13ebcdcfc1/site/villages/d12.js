



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const LOGC = '#6a4a32', LOGD = '#3e2a1c', MOSS = '#5f7a3a', MOSSL = '#7a9a4a', MOSSD = '#3f5a26', BIRCH = '#ece6d8', ST = '#8a8a88', STD = '#5e5e60', RESIN = '#c8862a', STEEL = '#b8c0cc';
  const KINDS = { bladeshard: { foot: [90, 26], tall: 300 }, resin: { foot: [24, 10], tall: 50 }, axestump: { foot: [30, 10], tall: 70 }, logs2: { foot: [56, 12], tall: 50 } };

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
        { k: 'lane', w: 34, pts: [[1460, 908], [1500, 1080], [1620, 1236], [2000, 1250], [2200, 1244], [2600, 1236], [3000, 1250], [3640, 1252], [3990, 1220], [3990, 908]] },
        { k: 'cross', w: 30, pts: [[2200, 1244], [2200, 1290]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1362, rx: 220, ry: 80, mark: 'bladeshard', ms: 1.25, paved: false }],
      water: [{ k: 'lake', e: [900, 1330, 220, 50] }],
      kinds: KINDS,
      props: [['pine', 1880, 1340, 1.2], ['pine', 1940, 1430], ['pine', 2520, 1350, 1.15], ['pine', 2470, 1440], ['resin', 1450, 1300], ['axestump', 3300, 1320], ['logs2', 3100, 1420], ['resin', 2050, 1140]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 1240, x1: 1450, base: 1450 }, { x0: 2900, x1: 3100, base: 1452 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['pine', 'pine', 'stump', 'rock', 'drift', 'resin'], n: 24, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'woodpile'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1480, 1700], [1740, 1960], [2320, 2560], [2600, 2820], [3480, 3720], [3770, 4000]] },
    };
  }

   
  function mossRoof(k, x0, x1, top, h, lv) {
    const { f1 } = k, cx = (x0 + x1) / 2;
    let g = k.roof(x0, x1, top, h, 'shingle', '#5a4a3a', false, '#3a2a20');
    g += `<path d="M${f1(x0 - 20)} ${f1(top + 4)} L${f1(cx)} ${f1(top - h)} L${f1(x1 + 20)} ${f1(top + 4)} L${f1(x1)} ${f1(top - 6)} L${f1(cx)} ${f1(top - h + 20)} L${f1(x0)} ${f1(top - 6)} Z" fill="${lv >= 3 ? MOSSL : MOSS}" stroke="${MOSSD}" stroke-width="2.5"/>`;
    let d = ''; for (let x = x0 - 12; x < x1 + 14; x += 20) d += `M${f1(x)} ${f1(top + 4)} q-2 ${8 + ((x * 3) % 10)} 2 ${14 + ((x * 3) % 10)}`; g += `<path d="${d}" stroke="${MOSSD}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    g += k.snowCap(x0 - 20, x1 + 20, top + 4, h);
    if (lv >= 2) g += `<path d="M${f1(cx - 26)} ${f1(top - h + 20)} L${f1(cx)} ${f1(top - h - 6)} L${f1(cx + 26)} ${f1(top - h + 20)}" stroke="${BIRCH}" stroke-width="6" fill="none"/>`;
    if (lv >= 4) g += `<path d="M${f1(cx)} ${f1(top - h - 6)} v-22" stroke="${k.INK}" stroke-width="4"/><path d="M${f1(cx - 4)} ${f1(top - h - 28)} l4 -16 l4 16 Z" fill="${lv >= 5 ? k.GOLD : STEEL}" ${k.O(1.5)}/>`;
    return g;
  }
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return k.winLit(x, y, w, h, true) + `<rect x="${f1(x - 7)}" y="${f1(y - 7)}" width="${f1(w + 14)}" height="${f1(h + 14)}" fill="none" stroke="${BIRCH}" stroke-width="5"/>` + (lv >= 3 ? `<path d="M${f1(x - 8)} ${f1(y - 12)} L${f1(x + w / 2)} ${f1(y - 22)} L${f1(x + w + 8)} ${f1(y - 12)}" stroke="${BIRCH}" stroke-width="5" fill="none"/>` : '');
  }
  const barrel = (k, x, B, s = 1) => { const { f1, O } = k; return `<path d="M${f1(x - 14 * s)} ${B} q-4 ${f1(-20 * s)} 0 ${f1(-40 * s)} h${f1(28 * s)} q4 ${f1(20 * s)} 0 ${f1(40 * s)} Z" fill="${LOGC}" ${O(2.5)}/><path d="M${f1(x - 16 * s)} ${f1(B - 12 * s)} h${f1(32 * s)} M${f1(x - 16 * s)} ${f1(B - 28 * s)} h${f1(32 * s)}" stroke="${STD}" stroke-width="3"/><ellipse cx="${f1(x)}" cy="${f1(B - 40 * s)}" rx="${f1(14 * s)}" ry="${f1(4 * s)}" fill="${RESIN}"/>`; };

  function lodge(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2, base = 26 + lv * 3;
    const rh = Math.round(o.roofH || Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 14, w * 0.5));
    let g = k.wall(x0, B - base, w, B, 'rubble') + k.wall(x0, top, w, B - base, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + mossRoof(k, x0, x1, top, rh, lv);
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [28, 34, 38, 42, 46][lv - 1], wy = top + Math.max(22, (f.wall - base - wh) * 0.36);
    if (!o.noWin) for (const x of [x0 + 24, x1 - 24 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, LOGD, 0.92);
    if (o.barrel !== false && lv >= 2) g += barrel(k, o.bx != null ? o.bx : x1 + 20, B, 0.9);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 28, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || LOGD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }
  const axe = (k, x, y, s = 1) => `<path d="M${k.f1(x)} ${k.f1(y)} l${k.f1(18 * s)} ${k.f1(-50 * s)}" stroke="${k.INK}" stroke-width="${k.f1(6 * s)}" stroke-linecap="round"/><path d="M${k.f1(x)} ${k.f1(y)} l${k.f1(18 * s)} ${k.f1(-50 * s)}" stroke="#c8a06a" stroke-width="${k.f1(3 * s)}" stroke-linecap="round"/><path d="M${k.f1(x + 12 * s)} ${k.f1(y - 46 * s)} l${k.f1(18 * s)} ${k.f1(-4 * s)} l${k.f1(-2 * s)} ${k.f1(16 * s)} Z" fill="${STEEL}" ${k.O(2)}/>`;

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) for (let x = a + 4; x < b; x += 22) g += `<path d="M${f1(x)} ${B} V${B - 64} l11 -16 l11 16 V${B} Z" fill="${LOGC}" ${O(3)}/>`;
      if (lv >= 3) { const sx = x0 + 28, t = B - f.wall; g += `<path d="M${f1(sx - 22)} ${B} V${f1(t + 40)} M${f1(sx + 22)} ${B} V${f1(t + 40)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(sx - 22)} ${B} V${f1(t + 40)} M${f1(sx + 22)} ${B} V${f1(t + 40)}" stroke="${LOGC}" stroke-width="6"/><rect x="${f1(sx - 30)}" y="${f1(t + 6)}" width="60" height="36" fill="${LOGC}" ${O(3)}/>` + mossRoof(k, sx - 30, sx + 30, t + 6, 30, 2); }
      for (const px of [cx - ow / 2 - 14, cx + ow / 2 + 14]) g += `<rect x="${f1(px - 16)}" y="${f1(B - ph)}" width="32" height="${f1(ph)}" rx="6" fill="${LOGC}" ${O(4)}/><path d="M${f1(px - 8)} ${f1(B - ph + 20)} q-2 40 2 80" stroke="${LOGD}" stroke-width="3" fill="none"/>`;
      const by = B - ph + 4;
      g += `<rect x="${f1(cx - ow / 2 - 34)}" y="${f1(by)}" width="${f1(ow + 68)}" height="24" rx="12" fill="${LOGC}" ${O(3.5)}/>`;
      let d = ''; for (let x = cx - ow / 2 - 24; x < cx + ow / 2 + 30; x += 16) d += `M${f1(x)} ${f1(by + 22)} q-2 ${8 + ((x * 3) % 12)} 2 ${16 + ((x * 3) % 12)}`; g += `<path d="${d}" stroke="${MOSS}" stroke-width="5" fill="none" stroke-linecap="round"/>` + axe(k, cx - 22, by - 2, 0.9) + `<g transform="translate(${f1(cx + 22)} 0) scale(-1 1) translate(${f1(-cx - 22)} 0)">${axe(k, cx + 22, by - 2, 0.9)}</g>`;
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(by - 30)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 44;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${LOGD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, BIRCH);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = lodge(k, f, { sign: 'РАТУША', signBg: '#5a1a14', barrel: false });
      let g = h.g;
      const sy = h.top - h.rh * 0.45; g += `<path d="M${f1(h.cx - 22)} ${f1(sy)} h44" stroke="${k.INK}" stroke-width="10" stroke-linecap="round"/><path d="M${f1(h.cx - 22)} ${f1(sy)} h44" stroke="${lv >= 5 ? k.GOLD : '#c8a050'}" stroke-width="6" stroke-linecap="round"/><path d="M${f1(h.cx - 5)} ${f1(sy + 4)} v26 h10 v-26" fill="#6a4a32" ${O(2)}/><path d="M${f1(h.cx - 7)} ${f1(sy - 4)} l7 -26 l7 18 l-6 -2 Z" fill="${STEEL}" ${O(2)}/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = lodge(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14', barrel: false });
      let g = h.g;
      if (lv >= 2) { const bx = f.x0 - 40; g += `<path d="M${f1(bx - 20)} ${h.B} l6 -60 h28 l6 60 Z" fill="${LOGC}" ${O(3)}/><ellipse cx="${f1(bx)}" cy="${h.B - 60}" rx="16" ry="5" fill="#c8a06a" ${O(2)}/><circle cx="${f1(bx)}" cy="${h.B - 100}" r="26" fill="#c8a06a" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 100}" r="14" fill="none" stroke="#a83a2a" stroke-width="4"/>` + axe(k, bx - 6, h.B - 96, 0.7); }
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(f.x1 + 14 + i * 30)} ${h.B} l4 -30 h22 l4 30 Z" fill="${LOGC}" ${O(2.5)}/><ellipse cx="${f1(f.x1 + 29 + i * 30)}" cy="${h.B - 30}" rx="12" ry="4" fill="#c8a06a" ${O(1.5)}/>`;
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${LOGD}" ${O(3.5)}/>`;
      const by0 = top + 26, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${LOGC}" ${O(4)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(54, (w - 50) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${BIRCH}" ${O(2.5)}/><path d="M${f1(nx + 4)} ${f1(ny + 6)} h8 M${f1(nx + nw - 14)} ${f1(ny + nw * 0.6)} h8" stroke="#2a2420" stroke-width="2.5"/><path d="M${f1(nx + 6)} ${f1(ny + 16)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 28)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      g += mossRoof(k, x0 - 6, x1 + 6, by0 - 4, Math.min(f.up - 40, 28 + lv * 6), Math.min(lv, 3));
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, LOGD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      k.signId('storage'); const h = lodge(k, f, { sign: 'СКЛАД', signBg: '#4a3a1e', noWin: true, barrel: false });
      let g = h.g;
      for (let i = 0; i < Math.min(lv + 1, 4); i++) g += barrel(k, x0 - 10 + i * 32, B, 0.85);
      if (lv >= 3) { let d = ''; for (let y = B - 8; y > B - 60; y -= 14) for (let x = x1 + 10; x < x1 + 60; x += 14) d += `M${f1(x + 6)} ${f1(y)} a6 6 0 1 0 0.1 0`; g += `<path d="${d}" fill="#c89a5a" stroke="#5a3a22" stroke-width="2"/>`; }
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(h.top - h.rh - 10)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), STD);
      const h = lodge(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, barrel: false, roofH: Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 10) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += axe(k, f.x1 - 70 + i * 22, h.B - 40, 0.8);
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const chum = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m - 10)} ${f1(t - 24)} L${f1(m + 26)} ${f1(t + 30)} M${f1(m + 10)} ${f1(t - 24)} L${f1(m - 26)} ${f1(t + 30)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="${BIRCH}" ${O()}/>`;
        let d = ''; for (let i = 1; i < 5; i++) { const y = t + (B - t) * i / 5, hw = (b - a) / 2 * i / 5; d += `M${f1(m - hw)} ${f1(y)} H${f1(m + hw)}`; } s += `<path d="${d}" stroke="#a89a80" stroke-width="2.5"/>`;
        for (let i = 0; i < 6; i++) { const y = t + 20 + (B - t - 30) * (i / 6), x = m + (((i * 37) % 7) - 3) * (b - a) * 0.05; s += `<path d="M${f1(x - 6)} ${f1(y)} h8" stroke="#2a2420" stroke-width="3"/>`; }
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 26)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s + k.snowCap(m - 26, m + 26, t + 26, 26);
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += chum(x0, x0 + sw, f.wall * 0.66, lv >= 5) + chum(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += chum(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 26)} ${B} L${f1(cx)} ${f1(B - 86 - lv * 5)} L${f1(cx + 26)} ${B} Z" fill="#2a2018" ${O(3)}/>`;
      if (lv >= 2) g += `<path d="M${f1(x1 + 10)} ${B} l10 -110 M${f1(x1 + 24)} ${B} l10 -110" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${f1(x1 + 10)} ${B} l10 -110 M${f1(x1 + 24)} ${B} l10 -110" stroke="#a87a4a" stroke-width="4" stroke-linecap="round"/>`;
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, LOGD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = lodge(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true, barrel: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${MOSS}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${LOGD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${LOGC}" ${O(3)}/>`;
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 30))); i < n; i++) { const px = ax0 + 18 + i * 30; g += `<path d="M${f1(px)} ${f1(ay + 22)} v8" stroke="${INK}" stroke-width="2"/><path d="M${f1(px - 9)} ${f1(ay + 30)} h18 l-2 22 h-14 Z" fill="${BIRCH}" ${O(2)}/><path d="M${f1(px - 8)} ${f1(ay + 40)} h16" stroke="#2a2420" stroke-width="2"/>`; }
      for (let i = 0; i < Math.min(3, lv); i++) g += barrel(k, ax0 + 24 + i * 34, h.B - 30, 0.6);
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const hb = B - Math.min(f.wall * 0.45, 60 + lv * 12);
      let g = `<path d="M${f1(cx - 44)} ${B} Q${f1(cx - 30)} ${f1(B - 40)} ${f1(cx - 32)} ${f1(hb)} H${f1(cx + 32)} Q${f1(cx + 30)} ${f1(B - 40)} ${f1(cx + 44)} ${B} Z" fill="#7a5238" ${O(4)}/><path d="M${f1(cx - 44)} ${B} l-16 6 M${f1(cx + 44)} ${B} l16 6" stroke="#7a5238" stroke-width="9" stroke-linecap="round"/>`;
      g += `<rect x="${f1(x0 - 4)}" y="${f1(hb - 12)}" width="${f1(w + 8)}" height="14" fill="${LOGC}" ${O(3)}/>` + k.wall(x0 + 10, top, w - 20, hb - 12, 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + mossRoof(k, x0 + 10, x1 - 10, top, Math.min(f.up - 20, 70 + lv * 10), lv);
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - 50 + i * 50)} ${f1(top - 90 - (i % 2) * 20)} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="${lv >= 5 ? k.GOLD : '#ffd76a'}" ${O(1.2)}/>`;
      g += win(k, cx - 14, top + 26, 28, 30, lv) + k.door(cx, B, 34 + lv * 2, Math.min(56 + lv * 3, B - hb - 6), '#2a1e3a');
      let r = ''; for (let y = hb; y < B - 8; y += 16) r += `M${f1(x1 - 26)} ${y} h22`; g += `<path d="M${f1(x1 - 26)} ${hb} V${B} M${f1(x1 - 4)} ${hb} V${B}" stroke="#8a6a44" stroke-width="3"/><path d="${r}" stroke="#8a6a44" stroke-width="4"/>`;
      k.signId('magic'); g += k.signLv(cx, hb + 40, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 100 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, lodge(k, f, { door: false, noWin: true, barrel: i % 2 === 0 }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 26, 28, 30, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, LOGD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 100 + (c.v % 20), up: 100, lv: 2 };
      const g0 = lodge(k, f, { door: false, noWin: true, bx: c.v % 2 ? x0 - 20 : x1 + 20 }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 26, 30, 30, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, LOGD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(290 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'bladeshard') {

        let g = k.ell(x, y + 4, 100, 20) + `<path d="M${x - 90} ${y} Q${x - 84} ${y - 60} ${x - 40} ${y - 74} Q${x} ${y - 86} ${x + 50} ${y - 70} Q${x + 90} ${y - 50} ${x + 92} ${y} Z" fill="${ST}" ${O(4.5)}/><path d="M${x - 80} ${y - 30} Q${x - 60} ${y - 70} ${x - 20} ${y - 78} Q${x - 30} ${y - 56} ${x - 80} ${y - 30} Z M${x + 40} ${y - 72} Q${x + 80} ${y - 56} ${x + 86} ${y - 20} Q${x + 60} ${y - 50} ${x + 40} ${y - 72} Z" fill="${MOSS}" stroke="${MOSSD}" stroke-width="2.5"/>`;
        g += `<path d="M${x - 24} ${y - 78} L${x - 20} ${y - 210} L${x - 8} ${y - 196} L${x + 2} ${y - 226} L${x + 12} ${y - 204} L${x + 22} ${y - 214} L${x + 26} ${y - 78} Z" fill="${STEEL}" ${O(4)}/><path d="M${x} ${y - 82} V${y - 200}" stroke="#8a94a4" stroke-width="4"/><path d="M${x - 10} ${y - 110} h8 m4 0 h8 M${x - 8} ${y - 140} l6 -8 l6 8 M${x - 8} ${y - 170} h16" stroke="#7ac8ff" stroke-width="3" fill="none"/>`;
        g += `<circle cx="${x}" cy="${y - 150}" r="60" fill="#7ac8ff" opacity=".12"/>`;
        for (const [dx, c] of [[-60, '#c8402a'], [56, '#ffffff'], [-36, '#3a6aa8']]) g += `<path d="M${x + dx} ${y - 60} q4 20 -2 36" stroke="${c}" stroke-width="5" fill="none"/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 220 * s, h: 260 * s };
      }
      if (p.k === 'resin') return { g: k.ell(x, y, 22, 6) + barrel(k, x, y, 1), w: 50, h: 50, flat: true };
      if (p.k === 'axestump') return { g: k.ell(x, y, 30, 8) + `<path d="M${x - 26} ${y} l4 -40 h44 l4 40 Z" fill="${LOGC}" ${O(3)}/><ellipse cx="${x}" cy="${y - 40}" rx="22" ry="7" fill="#c8a06a" ${O(2.5)}/>` + axe(k, x - 4, y - 40, 0.8), w: 80, h: 90 };
      if (p.k === 'logs2') { let g = k.ell(x, y, 56, 10); for (const [dx, dy] of [[-36, -10], [-12, -10], [12, -10], [36, -10], [-24, -30], [0, -30], [24, -30]]) g += `<circle cx="${x + dx}" cy="${y + dy}" r="11" fill="#c89a5a" stroke="#5a3a22" stroke-width="2.5"/>`; return { g: g + `<path d="M${x - 40} ${y - 42} h80" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>`, w: 130, h: 60, flat: true }; }
      return null;
    },
  };

  return {
    id: 'd12', ver: 1, name: 'Моховье', layout, art,
    story: 'Деревня смолокуров и лесорубов в таёжной глуши: тёмные срубы на каменных подклетах, кровли под мхом и берестой, у стен смоляные бочки. На поляне в кольце елей из замшелой скалы торчит обломок клинка Сломанного меча - вторая его половина, говорят, ушла в землю, и тайга хранит её.',
  };
});
