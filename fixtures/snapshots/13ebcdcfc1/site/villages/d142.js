


(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const GREEN = '#4f8a5a', GREEND = '#2f5a3a', BARK = '#f2efe6', OCHRE = '#d8963a', PLUM = '#7a3a5a';
  const RIB = ['#e8455c', '#ffd76a', '#4ab0ff', '#6fdc6f', '#b06bff'];
  const KINDS = { bigbirch: { foot: [52, 18], tall: 330 }, birch: { foot: [20, 10], tall: 250, tree: true }, wagon: { foot: [70, 16], tall: 150 }, milestone: { foot: [24, 10], tall: 120 }, campfire: { foot: [40, 12], tall: 90 }, horse: { foot: [50, 12], tall: 120 } };
  const ty = (x) => Math.round(905 + 0.13 * (x - 1000));

  function layout() {
    const row = (x0, x1) => ({ x0, x1, B: ty((x0 + x1) / 2) - 52 - 22 });
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        mine: { x0: 4040, x1: 4340 },
        hall: row(1560, 1860),
        shop: row(1950, 2240),
        tent: row(2330, 2680),
        storage: row(2770, 3040),
        magic: row(3130, 3360),
        trainer: { x0: 3480, x1: 3760, B: 1392 },
      },
      roads: [
        { k: 'main', w: 52, pts: [[40, 905], [1000, 905], [1600, ty(1600)], [2200, ty(2200)], [2800, ty(2800)], [3400, ty(3400)], [4000, ty(4000)], [4360, ty(4360)]] },
        { k: 'lane', w: 36, pts: [[40, 1320], [700, 1318], [1300, 1322], [2000, 1320], [2700, 1322], [3300, 1318], [3560, 1300]] },
        { k: 'cross', w: 30, pts: [[300, 905], [296, 1110], [300, 1320]] },
        { k: 'path', w: 30, pts: [[960, 910], [952, 1110], [960, 1320]] },
        { k: 'lane2', w: 28, pts: [[3200, 1440], [3800, 1440], [4360, 1440]] },
        { k: 'cross', w: 28, pts: [[4200, ty(4200)], [4200, 1440]] },
      ],
      plazas: [{ k: 'central', x: 1150, y: 1040, rx: 240, ry: 90, mark: 'bigbirch', ms: 1 }],
      kinds: KINDS,
      props: [['milestone', 1440, 1110], ['wagon', 2560, 1446], ['campfire', 2800, 1446], ['wagon', 3030, 1446], ['horse', 1590, 1440]],
      houses: [{ x0: 380, x1: 600, base: 1452 }, { x0: 700, x1: 900, base: 1446 }, { x0: 1720, x1: 1940, base: 1452 }, { x0: 2060, x1: 2280, base: 1446 }],
      fill: [{ k: ['birch', 'birch', 'birch', 'haystack', 'bush', 'flowers'], n: 34, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'flowers', 'pot'], n: 8, box: [80, 822, 1300, 840] }],
      extra: { backRange: [1230, 4000], backHouses: [[1250, 1450], [3440, 3650], [3720, 3960]] },
    };
  }

   

  const barkStrip = (k, x, y, w, h) => { const { f1, O } = k; let d = ''; for (let i = 0; i < Math.max(2, w / 14); i++) d += `M${f1(x + 4 + i * 14)} ${f1(y + h * (0.3 + (i % 3) * 0.2))} h6`; return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${BARK}" ${O(2.5)}/><path d="${d}" stroke="#2a2420" stroke-width="2.5"/>`; };
  function win(k, x, y, w, h, lv, lit = true) {
    let g = k.winLit(x, y, w, h, lit) + barkStrip(k, x - 8, y - 10, w + 16, 9) + barkStrip(k, x - 8, y + h + 2, w + 16, 8);
    if (lv >= 4) g += `<path d="M${x - 8} ${y - 10} L${x + w / 2} ${y - 26} L${x + w + 8} ${y - 10} Z" fill="${lv >= 5 ? k.GOLD : BARK}" stroke="${k.INK}" stroke-width="2.5"/>`;
    return g;
  }

  function gable(k, x0, x1, top, h, lv) {
    const { f1, O, INK } = k, cx = (x0 + x1) / 2;
    let g = k.roof(x0, x1, top, h, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#c9a85a' : lv >= 4 ? '#3f7a4a' : GREEN, false, lv <= 1 ? undefined : GREEND);
    if (lv >= 2) g += `<path d="M${x0 - 22} ${top + 4} L${f1(cx)} ${f1(top - h)} L${x1 + 22} ${top + 4}" fill="none" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/><path d="M${x0 - 22} ${top + 4} L${f1(cx)} ${f1(top - h)} L${x1 + 22} ${top + 4}" fill="none" stroke="${lv >= 5 ? k.GOLD : BARK}" stroke-width="7" stroke-linejoin="round"/>`;
    if (lv >= 3) g += `<path d="M${f1(cx)} ${f1(top - h)} v-26" stroke="${INK}" stroke-width="4"/><path d="M${f1(cx - 4)} ${f1(top - h - 26)} q8 -14 22 -10 l-4 8 q8 2 6 10 h-20 Z" fill="${lv >= 5 ? k.GOLD : '#2a2420'}"/>`;
    return g;
  }

  function house(k, f, o = {}) {
    const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([72, 90, 104, 114, 122][lv - 1], f.up - 8, w * 0.55));
    let g = '';
    if (lv >= 3) g += k.wall(x0, B - 34, w, B, 'stone') + k.wall(x0, top, w, B - 34, 'plank');
    else g += k.wall(x0, top, w, B, lv <= 1 ? 'shack' : 'plank');
    g += barkStrip(k, x0 - 4, top - 2, w + 8, 10) + gable(k, x0, x1, top, rh, lv);
    const ww = [28, 34, 36, 38, 40][lv - 1], wh = [34, 42, 46, 50, 54][lv - 1], wy = top + Math.max(20, (f.wall - wh) * 0.34);
    if (!o.noWin) for (const x of [x0 + 18, x1 - 18 - ww]) if (Math.abs(x + ww / 2 - cx) > 56 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (lv >= 3 && !o.noWin && w > 200) g += win(k, cx - ww / 2, top - rh * 0.62, ww, wh * 0.8, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, GREEND, 0.95);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.34 : top + 30, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || GREEND);
    if (lv >= 4) g += ribbons(k, x0 - 10, top + 6, 3) + ribbons(k, x1 + 10, top + 6, 3);
    if (lv >= 5) g += k.garland(x0 + 12, x1 - 12, top + 70, 6);
    return { g, top, rh, cx, B };
  }

  function ribbons(k, x, y, n) { const { f1 } = k; let g = `<circle cx="${f1(x)}" cy="${f1(y)}" r="4" fill="${k.INK}"/>`; for (let i = 0; i < n + 2; i++) g += `<path d="M${f1(x)} ${f1(y)} q${f1((i - 2) * 6)} 20 ${f1((i - 2) * 4 + (i % 2 ? 6 : -6))} ${f1(36 + i * 4)}" stroke="${RIB[i % 5]}" stroke-width="5" fill="none" stroke-linecap="round"/>`; return g; }

  const birch = (k, x, base, s) => k.use(k.sym('d142birch', () => {
    const { O } = k; let g = `<path d="M-7 2 Q-5 -80 -3 -170 H3 Q5 -80 8 2 Z" fill="${BARK}" ${O(3)}/><path d="M-6 -20 h6 M2 -46 h5 M-5 -76 h6 M1 -104 h5 M-4 -130 h5" stroke="#2a2420" stroke-width="3"/>`;
    g += `<path d="M0 -120 q-24 -10 -36 -40 M1 -140 q22 -6 34 -34 M0 -156 q-8 -20 -2 -40" stroke="#5a4a40" stroke-width="3" fill="none"/>`;
    for (const [dx, dy, rx, ry, c] of [[-30, -150, 30, 36, '#7fb04a'], [30, -160, 28, 34, '#94c25a'], [0, -196, 28, 32, '#a8d070'], [-8, -126, 22, 26, '#6aa040'], [22, -128, 20, 24, '#7fb04a']]) g += `<ellipse cx="${dx}" cy="${dy}" rx="${rx}" ry="${ry}" fill="${c}" ${O(3)}/>`;
    return g;
  }), x, base, s);

  function wagon(k, x, y, s = 1, c = PLUM) {
    const { f1, O } = k;
    return k.ell(x, y, 70 * s, 10) + `<rect x="${f1(x - 64 * s)}" y="${f1(y - 70 * s)}" width="${f1(128 * s)}" height="${f1(40 * s)}" fill="#a87a4a" ${O(3.5)}/><path d="M${f1(x - 60 * s)} ${f1(y - 70 * s)} Q${f1(x)} ${f1(y - 170 * s)} ${f1(x + 60 * s)} ${f1(y - 70 * s)} Z" fill="${c}" ${O(3.5)}/><path d="M${f1(x - 30 * s)} ${f1(y - 76 * s)} Q${f1(x)} ${f1(y - 150 * s)} ${f1(x + 30 * s)} ${f1(y - 76 * s)}" stroke="${OCHRE}" stroke-width="${f1(5 * s)}" fill="none"/>`
      + [-36, 36].map((dx) => `<circle cx="${f1(x + dx * s)}" cy="${f1(y - 16 * s)}" r="${f1(18 * s)}" fill="#7a4e2a" ${O(3)}/><circle cx="${f1(x + dx * s)}" cy="${f1(y - 16 * s)}" r="${f1(5 * s)}" fill="#2a2420"/>`).join('') + `<path d="M${f1(x + 64 * s)} ${f1(y - 40 * s)} l${f1(44 * s)} ${f1(22 * s)}" stroke="#7a4e2a" stroke-width="${f1(6 * s)}"/>`;
  }


  const cwin = (k, f, v) => win(k, v % 2 ? f.x0 + 22 : f.x1 - 56, f.B - f.wall + 24, 32, 38, 2);

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [96, 104, 112, 112, 120][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';

      for (const [a, b] of [[x0, cx - ow / 2 - 26], [cx + ow / 2 + 26, x1]]) if (b - a > 12) { g += `<path d="M${a} ${B - 70} H${b} M${a} ${B - 36} H${b}" stroke="${INK}" stroke-width="10"/><path d="M${a} ${B - 70} H${b} M${a} ${B - 36} H${b}" stroke="${BARK}" stroke-width="6"/>`; for (let x = a + 8; x < b; x += 46) g += `<rect x="${x - 6}" y="${B - 86}" width="12" height="88" rx="3" fill="#7a4e2a" ${O(3)}/>`; }
      if (lv >= 3) { const sx = x1 - 34, t = B - f.wall * 0.62; g += `<path d="M${f1(sx - 30)} ${B} V${f1(t)} M${f1(sx + 30)} ${B} V${f1(t)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(sx - 30)} ${B} V${f1(t)} M${f1(sx + 30)} ${B} V${f1(t)}" stroke="${BARK}" stroke-width="6"/>` + gable(k, sx - 34, sx + 34, t, 40, lv) + `<rect x="${f1(sx - 30)}" y="${B - 30}" width="60" height="10" fill="#a87a4a" ${O(2.5)}/>`; }
      for (const px of [cx - ow / 2 - 14, cx + ow / 2 + 14]) g += `<path d="M${f1(px - 14)} ${B} Q${f1(px - 12)} ${f1(B - ph / 2)} ${f1(px - 10)} ${f1(B - ph)} H${f1(px + 10)} Q${f1(px + 12)} ${f1(B - ph / 2)} ${f1(px + 14)} ${B} Z" fill="${BARK}" ${O(4)}/><path d="M${f1(px - 8)} ${f1(B - ph * 0.2)} h8 M${f1(px)} ${f1(B - ph * 0.45)} h8 M${f1(px - 8)} ${f1(B - ph * 0.7)} h8" stroke="#2a2420" stroke-width="3.5"/>`;
      const nm = L.name.toUpperCase(), by = B - ph - 12, bw = Math.max(ow + 70, nm.length * 15 + 40);
      g += `<path d="M${f1(cx - ow / 2 - 30)} ${f1(by - 4)} Q${f1(cx)} ${f1(by - 30 - lv * 6)} ${f1(cx + ow / 2 + 30)} ${f1(by - 4)}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M${f1(cx - ow / 2 - 30)} ${f1(by - 4)} Q${f1(cx)} ${f1(by - 30 - lv * 6)} ${f1(cx + ow / 2 + 30)} ${f1(by - 4)}" stroke="${BARK}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
      if (lv >= 2) g += ribbons(k, cx - ow / 2 - 8, by, 2) + ribbons(k, cx + ow / 2 + 8, by, 2);
      if (lv >= 5) g += k.orb(cx, by - 40 - lv * 6, 9);
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(by)}" width="${f1(bw)}" height="30" rx="6" fill="${GREEND}" ${O(3.5)}/>` + k.txt(cx, by + 22, nm, 17, '#f3efd8');
      k.signAt([cx - bw / 2 - 4, by - 4, cx + bw / 2 + 4, by + 34]);

      const mx = x0 + 6; g += `<rect x="${mx - 7}" y="${B - 150}" width="14" height="150" fill="${BARK}" ${O(3)}/><path d="M${mx - 7} ${B - 130} h14 M${mx - 7} ${B - 100} h14 M${mx - 7} ${B - 70} h14" stroke="#2a2420" stroke-width="3"/><path d="M${mx + 4} ${B - 140} h48 l10 10 l-10 10 h-48 Z M${mx - 4} ${B - 110} h-40 l-10 10 l10 10 h40 Z" fill="${OCHRE}" ${O(2.5)}/>`;
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = house(k, f, { sign: 'РАТУША', signBg: '#7a1a2a' });
      let g = h.g;

      if (lv >= 2) { const by = h.top - h.rh + 20, bw = 34 + lv * 6, bh = 30 + lv * 8; g += `<rect x="${f1(h.cx - bw / 2)}" y="${f1(by - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="#2a2420" ${O(3)}/><path d="M${f1(h.cx - bw / 2 + 5)} ${f1(by)} V${f1(by - bh)} M${f1(h.cx + bw / 2 - 5)} ${f1(by)} V${f1(by - bh)}" stroke="${BARK}" stroke-width="6"/><path d="M${f1(h.cx - 9)} ${f1(by - bh + 8)} q9 -4 18 0 l3 18 h-24 Z" fill="${lv >= 5 ? k.GOLD : '#d8a84a'}" ${O(2.5)}/>` + gable(k, h.cx - bw / 2 - 4, h.cx + bw / 2 + 4, by - bh, 30 + lv * 6, lv); }
      if (lv >= 3) g += `<rect x="${f1(f.x0 - 16)}" y="${f1(h.B - f.wall * 0.5)}" width="${f1(f.x1 - f.x0 + 32)}" height="10" fill="#a87a4a" ${O(3)}/>` + [f.x0 - 10, f.x1 + 10].map((px) => `<path d="M${f1(px)} ${h.B} V${f1(h.B - f.wall * 0.5)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(px)} ${h.B} V${f1(h.B - f.wall * 0.5)}" stroke="${BARK}" stroke-width="6"/>`).join('');
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = house(k, f, { sign: 'ТРЕНЕР', signBg: '#8a2a1a' });
      let g = h.g;
      const tg = (x, y, r) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="#e0b456" ${O(3)}/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.62)}" fill="#f3efd8" stroke="#c8402a" stroke-width="4"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.24)}" fill="#c8402a"/>`;
      g += tg(h.cx, h.top - h.rh * 0.42, 14 + lv * 2);
      if (lv >= 2) for (const sx of [f.x0 - 26, f.x1 + 26]) g += `<path d="M${f1(sx - 14)} ${h.B} L${f1(sx)} ${f1(h.B - 50)} L${f1(sx + 14)} ${h.B}" stroke="#7a4e2a" stroke-width="5" fill="none"/>` + tg(sx, h.B - 68, 22);
      if (lv >= 4) g += `<path d="M${f1(h.cx - 60)} ${h.B} V${h.B - 60} M${f1(h.cx + 60)} ${h.B} V${h.B - 60}" stroke="${INK}" stroke-width="0"/>`;
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${BARK}" ${O(3.5)}/><path d="M${f1(px - 6)} ${f1(top + 40)} h6 M${f1(px)} ${f1(top + 80)} h6" stroke="#2a2420" stroke-width="3"/>`;
      const by0 = top + 20, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="6" fill="#a87a4a" ${O(4)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 20 + (i % 3) * (w - 40) / 3, ny = by0 + 12 + Math.floor(i / 3) * 56, nw = Math.min(56, (w - 50) / 3); g += `<g transform="rotate(${(i * 11) % 9 - 4} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${i % 2 ? '#fff3c8' : '#f3efd8'}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/></g>`; }
      g += gable(k, x0 - 6, x1 + 6, top, Math.min(f.up - 30, 40 + lv * 9), lv) + ribbons(k, x0 + 10, by0 + 4, 2);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, GREEND);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2;
      const h = house(k, f, { sign: 'СКЛАД', signBg: '#6a4a1e', door: false, noWin: true, roofH: Math.min(f.up - 8, 70 + lv * 10) });
      const dw = Math.min(w - 40, 90 + lv * 14), dh = Math.min(f.wall - 30, 80 + lv * 10);
      let g = h.g + `<path d="M${f1(cx - dw / 2)} ${h.B} V${f1(h.B - dh + 20)} Q${f1(cx)} ${f1(h.B - dh - 6)} ${f1(cx + dw / 2)} ${f1(h.B - dh + 20)} V${h.B} Z" fill="#2a2018" ${O(4)}/>`;
      g += `<rect x="${f1(cx - dw / 2 + 10)}" y="${f1(h.B - 46)}" width="${f1(dw * 0.6)}" height="26" fill="#8a5a32" ${O(2.5)}/><circle cx="${f1(cx - dw / 4)}" cy="${h.B - 14}" r="13" fill="#7a4e2a" ${O(2.5)}/>`;
      for (const s of [-1, 1]) g += `<path d="M${f1(cx + s * dw / 2)} ${h.B} l${f1(s * 26)} -6 V${f1(h.B - dh + 10)} l${f1(-s * 26)} 6" fill="#8a5a32" ${O(3)}/>`;
      if (lv >= 3) g += `<path d="M${f1(cx)} ${f1(h.top - h.rh + 14)} v-14 h40 v30" stroke="${INK}" stroke-width="5" fill="none"/><rect x="${f1(cx + 28)}" y="${f1(h.top - h.rh + 30)}" width="24" height="18" fill="#e0b456" ${O(2.5)}/>`;
      return g;
    },

    forge(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#8a8696');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = house(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 - 30 - i * 26, sy = h.top + 30; g += `<path d="M${f1(sx - 8)} ${f1(sy + 8)} V${f1(sy)} A8 8 0 0 1 ${f1(sx + 8)} ${f1(sy)} V${f1(sy + 8)}" fill="none" stroke="${lv >= 5 && i === 0 ? k.GOLD : '#8a8e9e'}" stroke-width="5" stroke-linecap="round"/>`; }

      if (lv >= 2) { const sx = f.x1 + 6; g += `<path d="M${f1(sx)} ${h.B} V${h.B - 70} M${f1(sx + 26)} ${h.B} V${h.B - 70} M${f1(sx - 4)} ${h.B - 66} h34 M${f1(sx - 4)} ${h.B - 40} h34" stroke="${INK}" stroke-width="7"/><path d="M${f1(sx)} ${h.B} V${h.B - 70} M${f1(sx + 26)} ${h.B} V${h.B - 70}" stroke="#7a4e2a" stroke-width="3.5"/>`; }
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const cone = (a, b, t, h, gold) => {
        const m = (a + b) / 2;
        let s = `<path d="M${f1(a)} ${B} L${f1(a + 10)} ${f1(t)} L${f1(m)} ${f1(t - h)} L${f1(b - 10)} ${f1(t)} L${f1(b)} ${B} Z" fill="${PLUM}" ${O()}/>`;
        let zz = ''; for (let x = a + 14; x < b - 14; x += 18) zz += `M${f1(x)} ${f1(t + 16)} l9 -10 l9 10`; s += `<path d="${zz}" stroke="${OCHRE}" stroke-width="4" fill="none"/>`;
        s += `<path d="M${f1(a + 10)} ${f1(t)} L${f1(b - 10)} ${f1(t)}" stroke="${OCHRE}" stroke-width="6"/><path d="M${f1(m)} ${f1(t - h)} L${f1(a + 10)} ${f1(t)} M${f1(m)} ${f1(t - h)} L${f1(b - 10)} ${f1(t)}" stroke="${INK}" stroke-width="3" opacity=".4"/>`;
        return s + `<path d="M${f1(m)} ${f1(t - h)} V${f1(t - h - 24)}" stroke="${INK}" stroke-width="5"/>` + (gold ? k.orb(m, t - h - 30, 8) : ribbons(k, m, t - h - 22, 2));
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.28); g += cone(x0, x0 + sw, top + 50, 70, lv >= 5) + cone(x1 - sw, x1, top + 50, 70, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.2 : x0, b = lv >= 4 ? x1 - w * 0.2 : x1;
      g += cone(a, b, top, Math.min(f.up - 30, 60 + lv * 22), lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} L${f1(cx - 4)} ${f1(B - 90 - lv * 6)} L${f1(cx + 4)} ${f1(B - 90 - lv * 6)} L${f1(cx + 30)} ${B} Z" fill="#2a1424" ${O(3)}/><path d="M${f1(cx - 50)} ${B + 4} h100 l-10 -10 h-80 Z" fill="#c8402a" ${O(2.5)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 34, Math.min(b - a - 20, 150), 'ШАТЁР', lv, 20, PLUM);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0;
      const h = house(k, f, { sign: 'ЛАВКА', signBg: '#2f5a2a', dx: x0 + w * 0.32 });
      let g = h.g;

      const wx = x1 - 22 - Math.min(90, w * 0.34), wy = h.B - Math.min(80, f.wall * 0.6);
      g += `<rect x="${f1(wx)}" y="${f1(wy)}" width="${f1(Math.min(90, w * 0.34))}" height="${f1(h.B - 34 - wy)}" fill="#3a2a1e" ${O(3)}/><rect x="${f1(wx - 6)}" y="${h.B - 38}" width="${f1(Math.min(90, w * 0.34) + 12)}" height="12" fill="#a87a4a" ${O(3)}/><path d="M${f1(wx - 10)} ${f1(wy)} h${f1(Math.min(90, w * 0.34) + 20)} l-6 18 h${f1(-Math.min(90, w * 0.34) - 8)} Z" fill="${OCHRE}" ${O(2.5)}/>`;
      g += `<rect x="${f1(wx + 8)}" y="${h.B - 58}" width="20" height="20" rx="5" fill="#c8a06a" ${O(2)}/><circle cx="${f1(wx + 46)}" cy="${h.B - 50}" r="10" fill="#d8a050" ${O(2)}/>`;
      if (lv >= 3) g += `<rect x="${f1(x0 - 14)}" y="${f1(h.B - f.wall * 0.52)}" width="${f1(w + 28)}" height="10" fill="#a87a4a" ${O(3)}/><path d="M${f1(x0 - 10)} ${f1(h.B - f.wall * 0.52)} v-24 M${f1(x1 + 10)} ${f1(h.B - f.wall * 0.52)} v-24 M${f1(x0 - 10)} ${f1(h.B - f.wall * 0.52 - 24)} H${f1(x1 + 10)}" stroke="${INK}" stroke-width="4"/>`;
      g += `<path d="M${f1(x1 + 4)} ${f1(h.top + 26)} h22 v14" stroke="${INK}" stroke-width="4" fill="none"/><path d="M${f1(x1 + 18)} ${f1(h.top + 40)} h16 l-3 20 h-10 Z" fill="#ffd76a" ${O(2.5)}/>`;
      for (const bx of [x0 - 22, x0 - 48]) g += `<rect x="${f1(bx - 13)}" y="${h.B - 40}" width="26" height="40" rx="7" fill="#a87a4a" ${O(3)}/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const body = Math.min(f.wall - 30, 110 + lv * 14), bt = B - 34 - body;
      let g = `<rect x="${f1(x0 + 4)}" y="${f1(bt)}" width="${f1(w - 8)}" height="${f1(body)}" rx="10" fill="${PLUM}" ${O()}/><path d="M${f1(x0 - 6)} ${f1(bt + 6)} Q${f1(cx)} ${f1(bt - Math.min(f.up - 30, 70 + lv * 14))} ${f1(x1 + 6)} ${f1(bt + 6)} Z" fill="#3a2a6a" ${O()}/>`;
      let st = ''; for (let i = 0; i < 4 + lv; i++) { const sx = x0 + 20 + (i * 37) % (w - 30), sy = bt + 16 + (i * 23) % Math.max(20, body - 40); st += `M${f1(sx)} ${f1(sy - 5)} l1.6 3.4 l3.6 .4 l-2.7 2.4 l.8 3.6 l-3.3 -1.9 l-3.3 1.9 l.8 -3.6 l-2.7 -2.4 l3.6 -.4 Z`; }
      g += `<path d="${st}" fill="#ffd76a"/>` + win(k, x0 + 18, bt + 20, 28, 32, lv) + k.door(cx + 12, B - 34, 34 + lv * 2, Math.min(body - 10, 60 + lv * 3), '#3a2a5a');
      g += `<path d="M${f1(cx - 8)} ${B} L${f1(cx + 2)} ${B - 34} M${f1(cx + 32)} ${B} L${f1(cx + 22)} ${B - 34} M${f1(cx - 4)} ${B - 12} h34 M${f1(cx)} ${B - 24} h26" stroke="#a87a4a" stroke-width="4"/>`;
      for (const dx of [x0 + 34, x1 - 34]) g += `<circle cx="${f1(dx)}" cy="${B - 22}" r="22" fill="#7a4e2a" ${O(3)}/><circle cx="${f1(dx)}" cy="${B - 22}" r="6" fill="${OCHRE}"/>`;
      g += k.chimney(x1 - 30, bt - 40, 14, 40, 2, '#5a5662');
      if (lv >= 3) g += `<path d="M${f1(x1 - 4)} ${f1(bt + 20)} l60 20 v60" stroke="${INK}" stroke-width="4" fill="none"/><path d="M${f1(x1 - 4)} ${f1(bt + 20)} l60 20 l-10 14 l-50 -18 Z" fill="#4a3a7a" ${O(2.5)}/>`;
      if (lv >= 5) g += k.orb(cx, bt - Math.min(f.up - 30, 70 + lv * 14) / 2 - 16, 8);
      k.signId('magic'); g += k.signLv(cx, bt + body * 0.62, Math.min(w, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  const art = {
    K: { leaf: ['#7fb04a', '#94c25a', '#6aa040'], grass: '#a8bc6e', grass2: '#90a65c', dirt: '#c8a874', dirtD: '#a0845a' },

    back(k) {
      const { P, L } = k, [a, b] = L.hx.backRange || [1230, 4000];
      let g = `<path d="M${a} 660 Q${(a + b) / 2} 560 ${b} 660 Z" fill="#8aa868"/><path d="M${(a + b) / 2 - 60} 660 Q${(a + b) / 2 + 60} 600 ${(a + b) / 2 + 200} 560" stroke="#c8a874" stroke-width="26" fill="none" stroke-linecap="round"/>`;
      P(a, b, g);
      for (let x = a + 30, i = 0; x < b; x += 70 + (i * 37) % 50, i++) P(x - 50, x + 50, birch(k, x, 700 + (i % 3) * 30, 0.7 + (i % 4) * 0.08));
    },

    decor(k) { (k.L.hx.backHouses || []).forEach(([a, b], i) => { const f = { x0: a + 10, x1: b - 10, B: 792, wall: 92 + i * 10, up: 110, lv: 2 }; k.P(a, b, house(k, f, { door: false, noWin: true }).g + cwin(k, f, i) + k.door(i % 2 ? f.x1 - 40 : f.x0 + 40, 792, 38, 60, GREEND)); }); },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + ribbons(k, lot.x0 + 8, 640, 2);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 24), up: 110, lv: 2 };
      const g0 = house(k, f, { door: false, noWin: true }).g + cwin(k, f, c.v) + k.door(c.v % 2 ? x1 - 40 : x0 + 40, 795, 38, 60, GREEND) + (c.v % 3 === 0 ? birch(k, x1 + 30, 798, 0.7) : '');
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(300 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O } = k;
      if (p.k === 'bigbirch') { let g = k.ell(x, y + 4, 80, 16) + birch(k, x, y, 1.55 * s); for (let i = 0; i < 4; i++) g += ribbons(k, x - 40 + i * 26, y - 150 - (i % 2) * 30, 2); return { g, w: 300, h: 360 }; }
      if (p.k === 'birch') return { g: k.ell(x, y, 26 * s, 8) + birch(k, x, y, s), w: 160 * s, h: 260 * s };
      if (p.k === 'wagon') return { g: wagon(k, x, y, 1, [PLUM, '#3a6aa8', '#8a3a2a'][p.v % 3]), w: 260, h: 190 };
      if (p.k === 'milestone') return { g: k.ell(x, y, 26, 7) + `<path d="M${x - 20} ${y} V${y - 80} Q${x} ${y - 110} ${x + 20} ${y - 80} V${y} Z" fill="#a29c8e" ${O(3.5)}/><path d="M${x - 8} ${y - 70} l8 -12 l8 12 M${x} ${y - 82} V${y - 40} M${x - 10} ${y - 56} h20" stroke="#2a2420" stroke-width="3" fill="none"/>`, w: 80, h: 130 };
      if (p.k === 'campfire') return { g: `<ellipse cx="${x}" cy="${y}" rx="40" ry="12" fill="#5a4a40"/><circle cx="${x}" cy="${y - 30}" r="40" fill="url(#tgGlow)" opacity=".6"/><path d="M${x - 26} ${y - 4} l52 -10 M${x - 24} ${y - 12} l48 10" stroke="#7a4e2a" stroke-width="7" stroke-linecap="round"/><path d="M${x - 16} ${y - 10} q16 -50 32 0 q-6 -24 -16 -8 q-10 -18 -16 8" fill="#ff8a2a" stroke="#c8402a" stroke-width="2"/>`, w: 120, h: 90 };
      if (p.k === 'horse') return { g: k.ell(x, y, 50, 9) + `<path d="M${x - 40} ${y - 50} Q${x - 30} ${y - 76} ${x + 16} ${y - 72} L${x + 34} ${y - 100} L${x + 48} ${y - 92} L${x + 40} ${y - 58} Q${x + 30} ${y - 40} ${x - 30} ${y - 42} Z" fill="#8a5a32" ${O(3.5)}/><path d="M${x - 32} ${y - 44} V${y} M${x - 16} ${y - 44} V${y} M${x + 14} ${y - 46} V${y} M${x + 28} ${y - 50} V${y}" stroke="#2a2420" stroke-width="7"/><path d="M${x + 34} ${y - 98} q-16 0 -22 22" stroke="#2a2420" stroke-width="6" fill="none"/>`, w: 140, h: 120 };
      return null;
    },
  };

  return {
    id: 'd142', ver: 1, name: 'Берёзовье', layout, art,
    story: 'Стоянка на скитальческом тракте среди берёз: тракт идёт через деревню наискось, дома встают вдоль него лесенкой, у кузни куют проезжим лошадей, а на развилке ветер треплет ленты на Берёзе-путеводнице.',
  };
});
