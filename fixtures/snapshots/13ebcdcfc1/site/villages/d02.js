



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const OAK = '#9a6a3e', OAKD = '#5a3a22', BARK = '#6a4a30', MOSS = '#6a8a3a', MOSSD = '#4a6a2a', SHUT = '#4f7a3a', CANV = '#d8c8a0', WATER = '#5aa8d8';
  const LEAF = ['#3f6a2a', '#4f7a32', '#5f8a3a'];
  const KINDS = { oldoak: { foot: [90, 26], tall: 450 }, signpost: { foot: [24, 10], tall: 200 }, oak2: { foot: [30, 12], tall: 300, tree: true }, stump: { foot: [36, 12], tall: 60 }, lamp2: { foot: [16, 8], tall: 150 }, wcamp: { foot: [60, 18], tall: 100 }, acorns: { foot: [30, 10], tall: 40 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        storage: { x0: 1270, x1: 1560 },
        trainer: { x0: 2920, x1: 3200 },
        magic: { x0: 3270, x1: 3500 },
        mine: { x0: 4040, x1: 4340 },
        hall: { x0: 1640, x1: 1940, B: 1232 },
        shop: { x0: 2480, x1: 2760, B: 1240 },
        tent: { x0: 3560, x1: 3910, B: 1170 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 908], [1500, 912], [2200, 918], [2900, 910], [3600, 906], [4360, 908]] },
        { k: 'trail', w: 36, pts: [[960, 908], [990, 1040], [1110, 1170], [1380, 1286], [1700, 1300], [1996, 1314]] },
        { k: 'trail', w: 36, pts: [[2424, 1316], [2640, 1314], [2900, 1278], [3200, 1236], [3460, 1252], [3740, 1262], [3960, 1226], [4000, 1080], [3990, 910]] },
        { k: 'cross', w: 32, pts: [[2210, 918], [2180, 1040], [2216, 1220]] },
      ],
      plazas: [{ k: 'central', x: 2210, y: 1314, rx: 220, ry: 96, mark: 'oldoak', ms: 1 }],
      water: [{ k: 'pond', e: [2560, 1420, 86, 26] }],
      kinds: KINDS,
      props: [['signpost', 1040, 1180], ['wcamp', 3360, 1380], ['stump', 3230, 1388], ['lamp2', 2470, 1180], ['lamp2', 1960, 1180], ['acorns', 1500, 1380], ['signpost', 3880, 1110]],
      houses: [{ x0: 300, x1: 520, base: 1450 }, { x0: 640, x1: 860, base: 1446 }, { x0: 2900, x1: 3110, base: 1452 }, { x0: 4100, x1: 4310, base: 1450 }],
      fill: [{ k: ['oak2', 'oak2', 'bush', 'flowers', 'oak2', 'stump'], n: 24, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'acorns'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1600, 1820], [1870, 2060], [2370, 2590], [2640, 2860], [3540, 3760], [3800, 4000]], bigOak: 2215 },
    };
  }

   
  const acorn = (k, x, y, s, gold) => k.use(k.sym(gold ? 'd02acornG' : 'd02acorn', () => { const { O } = k; return `<path d="M-9 -2 Q-10 14 0 18 Q10 14 9 -2 Z" fill="${gold ? k.GOLD : '#c08a44'}" ${O(2)}/><path d="M-11 -1 Q-11 -11 0 -11 Q11 -11 11 -1 Z" fill="${gold ? '#a87a1a' : '#6a4a2a'}" ${O(2)}/><path d="M0 -11 v-6" stroke="#3a2a1a" stroke-width="3"/>`; }), x, y, s);
  const leaf = (k, x, y, s) => k.use(k.sym('d02leaf', () => { const { O } = k; return `<path d="M0 -22 Q8 -20 6 -13 Q14 -12 10 -4 Q18 -1 10 5 Q14 12 5 12 L2 22 H-2 L-5 12 Q-14 12 -10 5 Q-18 -1 -10 -4 Q-14 -12 -6 -13 Q-8 -20 0 -22 Z" fill="${LEAF[1]}" ${O(2)}/><path d="M0 -16 V20" stroke="${LEAF[0]}" stroke-width="2"/>`; }), x, y, s);

  const crownSym = (k) => k.sym('d02crown', () => { const { O } = k; let g = ''; for (const [dx, dy, r, c] of [[-70, 10, 58, 0], [64, 14, 60, 0], [-30, -30, 66, 1], [36, -34, 64, 1], [0, 22, 62, 1], [-6, -70, 52, 2], [-92, -24, 40, 2], [92, -20, 42, 2]]) g += `<circle cx="${dx}" cy="${dy}" r="${r}" fill="${LEAF[c]}" ${O(3)}/>`; return g + `<path d="M-60 40 q30 16 60 0 q30 16 60 0" stroke="${LEAF[0]}" stroke-width="5" fill="none" opacity=".6"/>`; });

  function oak(k, x, base, s) {
    const { f1, O } = k;
    let g = `<path d="M${f1(x - 30 * s)} ${base} Q${f1(x - 16 * s)} ${f1(base - 60 * s)} ${f1(x - 14 * s)} ${f1(base - 150 * s)} L${f1(x - 44 * s)} ${f1(base - 200 * s)} L${f1(x - 30 * s)} ${f1(base - 206 * s)} L${f1(x - 4 * s)} ${f1(base - 170 * s)} L${f1(x + 26 * s)} ${f1(base - 214 * s)} L${f1(x + 38 * s)} ${f1(base - 204 * s)} L${f1(x + 14 * s)} ${f1(base - 150 * s)} Q${f1(x + 16 * s)} ${f1(base - 60 * s)} ${f1(x + 30 * s)} ${base} Z" fill="${BARK}" ${O(3)}/>`;
    return g + k.use(crownSym(k), x, base - 230 * s, s * 0.82, s * 0.7);
  }
  function win(k, x, y, w, h, lv, lit = true) {
    const { f1, O } = k;
    let g = k.winLit(x, y, w, h, lit, true);
    if (lv >= 2) g += `<rect x="${f1(x - 11)}" y="${f1(y)}" width="10" height="${f1(h)}" fill="${SHUT}" ${O(2.5)}/><rect x="${f1(x + w + 1)}" y="${f1(y)}" width="10" height="${f1(h)}" fill="${SHUT}" ${O(2.5)}/>`;
    if (lv >= 3) g += leaf(k, x + w / 2, y - 12, 0.5);
    return g;
  }

  function mossRoof(k, x0, x1, top, h, lv) {
    const { f1 } = k, cx = (x0 + x1) / 2;
    let g = k.roof(x0, x1, top, h, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#a8884a' : '#7a4a2a', false, lv <= 1 ? undefined : '#4a2e1a');
    for (const t of [0.18, 0.42, 0.66, 0.84]) { const sx = t < 0.5 ? -1 : 1, u = t < 0.5 ? t * 2 : (1 - t) * 2, x = cx + sx * (1 - u) * ((x1 - x0) / 2 + 10), y = top - u * h + 4; g += `<ellipse cx="${f1(x)}" cy="${f1(y + 6)}" rx="${f1(16 + (t * 40) % 12)}" ry="7" fill="${MOSS}" stroke="${MOSSD}" stroke-width="2"/>`; }
    if (lv >= 2) g += leaf(k, cx, top - h * 0.42, 0.9 + lv * 0.08);
    if (lv >= 4) g += acorn(k, cx, top - h - 14, 1.1, lv >= 5);
    return g;
  }

  const staff = (k, x, B) => `<path d="M${x} ${B} l10 -110" stroke="#3a2a1a" stroke-width="7" stroke-linecap="round"/><path d="M${x} ${B} l10 -110" stroke="#b08a5a" stroke-width="3.5" stroke-linecap="round"/><path d="M${x + 4} ${B - 70} q-14 4 -12 22 q10 8 22 0 q2 -16 -10 -22 Z" fill="#8a6a4a" ${k.O(2)}/>`;

  function oakHouse(k, f, o = {}) {
    const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([66, 80, 94, 106, 114][lv - 1], f.up - 10, w * 0.48));
    let g = '';
    if (o.crown) g += oak(k, o.crown, B, (f.wall + rh + 110) / 300);
    if (lv >= 3) g += k.wall(x0, B - 28, w, B, 'rubble');
    g += k.wall(x0, top, w, lv >= 3 ? B - 28 : B, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), OAK);
    g += mossRoof(k, x0, x1, top, rh, lv);
    const ww = [28, 32, 34, 36, 38][lv - 1], wh = [32, 40, 44, 48, 52][lv - 1], wy = top + Math.max(18, (f.wall - wh) * 0.34);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) { g += k.bigDoor(cx, B, lv, OAKD, 0.95); if (lv >= 2) g += staff(k, cx + 44, B) + `<path d="M${f1(cx - 46)} ${f1(B - 104)} h-10" stroke="${k.INK}" stroke-width="3"/>` + k.wallLamp(cx - 52, B - 104); }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 28, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || OAKD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 60, 6);
    return { g, top, rh, cx, B };
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) {
        let st = ''; for (let x = a + 6; x < b; x += 24) st += `M${f1(x)} ${B} V${B - 78}`;
        g += `<path d="${st}" stroke="${INK}" stroke-width="7"/><path d="${st}" stroke="#8a6a44" stroke-width="3.5"/>`;
        for (const y of [B - 66, B - 48, B - 30]) g += `<path d="M${f1(a)} ${y} Q${f1((a + b) / 2)} ${y + 6} ${f1(b)} ${y}" stroke="#a87a4a" stroke-width="9" fill="none"/><path d="M${f1(a)} ${y} Q${f1((a + b) / 2)} ${y + 6} ${f1(b)} ${y}" stroke="${INK}" stroke-width="1.5" fill="none" opacity=".5"/>`;
      }
      const ty = B - ph - 30;
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += `<path d="M${f1(px - 22)} ${B} Q${f1(px - 12)} ${f1(B - 80)} ${f1(px - 14)} ${f1(ty)} L${f1(px + 14)} ${f1(ty)} Q${f1(px + 12)} ${f1(B - 80)} ${f1(px + 22)} ${B} Z" fill="${BARK}" ${O(4)}/><path d="M${f1(px - 22)} ${B} l-14 6 M${f1(px + 22)} ${B} l14 6" stroke="${BARK}" stroke-width="8" stroke-linecap="round"/><path d="M${f1(px - 4)} ${B - 30} q-4 -40 2 -80 M${f1(px + 6)} ${f1(B - 120)} q4 -30 -2 -60" stroke="${OAKD}" stroke-width="3" fill="none"/>`; }
      g += `<path d="M${f1(cx - ow / 2 - 16)} ${f1(ty + 10)} Q${f1(cx)} ${f1(ty - 50)} ${f1(cx + ow / 2 + 16)} ${f1(ty + 10)}" stroke="${BARK}" stroke-width="20" fill="none"/>`;
      g += k.use(crownSym(k), cx - ow / 2 - 20, ty - 40, 0.62, 0.5) + k.use(crownSym(k), cx + ow / 2 + 20, ty - 46, 0.6, 0.52);
      if (lv >= 3) g += `<rect x="${f1(cx - 46)}" y="${f1(ty - 56)}" width="92" height="12" fill="${OAK}" ${O(3)}/><path d="M${f1(cx - 40)} ${f1(ty - 56)} v-24 M${f1(cx + 40)} ${f1(ty - 56)} v-24 M${f1(cx - 44)} ${f1(ty - 76)} h88" stroke="${OAKD}" stroke-width="5"/>`;
      if (lv >= 2) for (const s of [-1, 1]) g += `<path d="M${f1(cx + s * (ow / 2 - 6))} ${f1(ty + 4)} v18" stroke="${INK}" stroke-width="2.5"/>` + k.wallLamp(cx + s * (ow / 2 - 6) + 5, ty + 22);
      if (lv >= 5) g += acorn(k, cx, ty - 96, 1.4, true);
      const nm = L.name.toUpperCase(), by = ty + 34, bw = Math.max(ow + 20, nm.length * 15 + 30);
      g += `<path d="M${f1(cx - bw / 2 + 14)} ${f1(ty + 4)} V${f1(by)} M${f1(cx + bw / 2 - 14)} ${f1(ty + 4)} V${f1(by)}" stroke="${INK}" stroke-width="3"/><rect x="${f1(cx - bw / 2)}" y="${f1(by)}" width="${f1(bw)}" height="30" rx="6" fill="${OAK}" ${O(3.5)}/>` + k.txt(cx, by + 22, nm, 17, '#f6ecd4') + leaf(k, cx - bw / 2 + 2, by + 15, 0.55) + leaf(k, cx + bw / 2 - 2, by + 15, 0.55);
      k.signAt([cx - bw / 2 - 8, by - 4, cx + bw / 2 + 8, by + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = oakHouse(k, f, { sign: 'РАТУША', signBg: '#6a2a1a' });
      let g = h.g;
      if (lv >= 3) { g += `<path d="M${f1(h.cx - 70)} ${h.B} V${h.B - 96} M${f1(h.cx + 70)} ${h.B} V${h.B - 96}" stroke="${INK}" stroke-width="13"/><path d="M${f1(h.cx - 70)} ${h.B} V${h.B - 96} M${f1(h.cx + 70)} ${h.B} V${h.B - 96}" stroke="${BARK}" stroke-width="8"/>` + mossRoof(k, h.cx - 80, h.cx + 80, h.B - 96, 30, 2); }
      const ty = h.top - h.rh + 8, tw = 22 + lv * 3;
      g += `<rect x="${f1(h.cx - tw)}" y="${f1(ty - 50)}" width="${f1(tw * 2)}" height="50" fill="${OAK}" ${O(3)}/><path d="M${f1(h.cx - 9)} ${f1(ty - 40)} q9 -5 18 0 l3 18 h-24 Z" fill="#d8a84a" ${O(2)}/><path d="M${f1(h.cx - tw - 8)} ${f1(ty - 48)} L${f1(h.cx)} ${f1(ty - 90 - lv * 4)} L${f1(h.cx + tw + 8)} ${f1(ty - 48)} Z" fill="#7a4a2a" ${O(3)}/>` + acorn(k, h.cx, ty - 104 - lv * 4, 1, lv >= 5);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = oakHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#7a2a1a' });
      let g = h.g + `<g transform="translate(${f1(h.cx)} ${f1(h.top - h.rh * 0.46)}) rotate(-30)"><path d="M-32 0 H32" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-32 0 H32" stroke="#c8a06a" stroke-width="5" stroke-linecap="round"/></g><g transform="translate(${f1(h.cx)} ${f1(h.top - h.rh * 0.46)}) rotate(30)"><path d="M-32 0 H32" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-32 0 H32" stroke="#c8a06a" stroke-width="5" stroke-linecap="round"/></g>`;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 12 + i * 11; g += `<path d="M${f1(sx)} ${h.B} l-4 -130" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${f1(sx)} ${h.B} l-4 -130" stroke="#c8a06a" stroke-width="3" stroke-linecap="round"/>`; }
      if (lv >= 2) { const bx = f.x0 - 34; g += `<path d="M${f1(bx)} ${h.B} V${h.B - 120} M${f1(bx - 30)} ${h.B - 88} h60" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><ellipse cx="${f1(bx)}" cy="${h.B - 72}" rx="20" ry="30" fill="#e0b456" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 116}" r="14" fill="#e0b456" ${O(3)}/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<rect x="${f1(cx - 11)}" y="${f1(top - 70)}" width="22" height="${f1(B - top + 70)}" fill="${BARK}" ${O(3.5)}/>`;
      const arr = [['КРАЙ', -1, 0], ['ДУБРАВА', 1, 1], ['ТОПИ', -1, 2], ['ПЕСКИ', 1, 3]].slice(0, 2 + Math.min(2, lv - 1));
      arr.forEach(([t, s, i]) => { const y = top - 60 + i * 26, aw = 96; g += `<path d="M${f1(cx)} ${f1(y)} h${f1(s * aw)} l${f1(s * 14)} 10 l${f1(-s * 14)} 10 h${f1(-s * aw)} Z" fill="${i % 2 ? '#c8a06a' : OAK}" ${O(2.5)}/>` + k.txt(cx + s * aw / 2, y + 15, t, 11, '#2a1e14'); });
      const by0 = top + 16, by1 = B - 50;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="6" fill="${OAK}" ${O(4)}/><rect x="${f1(x0 + 18)}" y="${f1(by0 + 10)}" width="${f1(w * 0.46)}" height="${f1((by1 - by0) * 0.7)}" fill="#efe0b8" ${O(2.5)}/><path d="M${f1(x0 + 26)} ${f1(by0 + 30)} q20 16 40 0 t40 10 M${f1(x0 + 30)} ${f1(by0 + 58)} q16 -10 30 6" stroke="#8a5a32" stroke-width="2.5" fill="none" stroke-dasharray="5 3"/><path d="M${f1(x0 + 70)} ${f1(by0 + 40)} l6 6 m0 -6 l-6 6" stroke="#c8402a" stroke-width="3"/>`;
      for (let i = 0; i < 1 + Math.min(3, lv); i++) { const nx = x0 + w * 0.6 + (i % 2) * 34, ny = by0 + 12 + Math.floor(i / 2) * 44; g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="30" height="34" fill="${i % 2 ? '#e8d8b0' : '#f3efd8'}" ${O(2)}/><path d="M${f1(nx + 5)} ${f1(ny + 12)} h20 M${f1(nx + 5)} ${f1(ny + 22)} h14" stroke="${INK}" stroke-width="2" opacity=".45"/>`; }
      g += mossRoof(k, x0 - 6, x1 + 6, by0 - 4, 26, Math.min(lv, 3));
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, OAKD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const stump = (a, b, t, main) => {
        const m = (a + b) / 2, ww = b - a;
        let s = `<path d="M${f1(a - 20)} ${B} Q${f1(a + 4)} ${f1(B - 30)} ${f1(a + 6)} ${f1(B - 80)} L${f1(a + 2)} ${f1(t + 8)} L${f1(a + ww * 0.2)} ${f1(t - 10)} L${f1(a + ww * 0.36)} ${f1(t + 4)} L${f1(m)} ${f1(t - 14)} L${f1(b - ww * 0.3)} ${f1(t + 2)} L${f1(b - ww * 0.12)} ${f1(t - 8)} L${f1(b - 2)} ${f1(t + 8)} L${f1(b - 6)} ${f1(B - 80)} Q${f1(b - 4)} ${f1(B - 30)} ${f1(b + 20)} ${B} Z" fill="${BARK}" ${O()}/>`;
        let bk = ''; for (let i = 1; i < 6; i++) { const x = a + ww * i / 6; bk += `M${f1(x)} ${f1(t + 30 + (i % 2) * 20)} q${(i % 2 ? 6 : -6)} ${f1((B - t) * 0.3)} 0 ${f1((B - t) * 0.6)}`; }
        s += `<path d="${bk}" stroke="${OAKD}" stroke-width="3" fill="none"/>`;
        if (main && lv >= 2) s += `<path d="M${f1(a - 18)} ${f1(t + 12)} Q${f1(m)} ${f1(t - Math.min(f.up - 20, 40 + lv * 14))} ${f1(b + 18)} ${f1(t + 12)} Z" fill="#7a4a2a" ${O()}/><path d="M${f1(a - 8)} ${f1(t + 4)} Q${f1(m)} ${f1(t - Math.min(f.up - 20, 40 + lv * 14) + 22)} ${f1(b + 8)} ${f1(t + 4)}" stroke="${MOSS}" stroke-width="8" fill="none"/>`;
        else s += `<ellipse cx="${f1(m)}" cy="${f1(t)}" rx="${f1(ww * 0.44)}" ry="10" fill="#c8a06a" ${O(2.5)}/><ellipse cx="${f1(m)}" cy="${f1(t)}" rx="${f1(ww * 0.26)}" ry="6" fill="none" stroke="#8a5a32" stroke-width="2"/>`;
        return s;
      };
      const t = B - f.wall * 0.92;
      let g = '';
      if (lv >= 4) g += stump(x0 - 4, x0 + w * 0.28, B - f.wall * 0.45, false) + stump(x1 - w * 0.26, x1 + 4, B - f.wall * 0.38, false);
      const a = lv >= 4 ? x0 + w * 0.2 : x0 + 10, b = lv >= 4 ? x1 - w * 0.2 : x1 - 10;
      g += stump(a, b, t, true);
      const dw = Math.min((b - a) * 0.5, 60 + lv * 5), dh = Math.min(B - t - 50, 80 + lv * 6);
      g += `<path d="M${f1(cx - dw / 2 - 8)} ${B} V${f1(B - dh + dw / 2)} A${f1(dw / 2 + 8)} ${f1(dw / 2 + 8)} 0 0 1 ${f1(cx + dw / 2 + 8)} ${f1(B - dh + dw / 2)} V${B} Z" fill="${OAKD}" ${O(3)}/>` + k.door(cx, B, dw, dh - 6, '#7a5232');
      if (lv >= 3) g += win(k, cx + (b - a) * 0.26, t + 36, 26, 30, lv);
      if (lv >= 5) g += acorn(k, cx, t - Math.min(f.up - 20, 40 + lv * 14) - 14, 1.3, true);
      k.signId('storage'); g += k.signLv(cx, B - dh - 30, Math.min(b - a - 10, 130), 'СКЛАД', lv, 19, '#5a3a1e');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#8a8494');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = oakHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(mx + mw + 20 + i * 26)} ${f1(h.B - 70)} a10 10 0 1 1 14 0" stroke="#5a5662" stroke-width="5" fill="none"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tent = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m)} ${f1(t - 26)} V${B}" stroke="${INK}" stroke-width="7"/><path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="${CANV}" ${O()}/>`;
        for (const [u, v, c] of [[0.3, 0.6, '#a8784a'], [0.62, 0.72, '#6a8a5a'], [0.45, 0.34, '#c8643a']]) { const px = a + (b - a) * u, py = t + (B - t) * v; s += `<rect x="${f1(px - 14)}" y="${f1(py - 12)}" width="28" height="24" fill="${c}" ${O(2)} transform="rotate(${f1((u - 0.5) * 30)} ${f1(px)} ${f1(py)})"/>`; }
        s += `<path d="M${f1(m)} ${f1(t)} L${f1(m - (b - a) * 0.18)} ${B} M${f1(m)} ${f1(t)} L${f1(m + (b - a) * 0.18)} ${B}" stroke="#a8946a" stroke-width="2.5"/>`;
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 30)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tent(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tent(x1 - sw, x1, f.wall * 0.66, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tent(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} L${f1(cx)} ${f1(B - 92 - lv * 5)} L${f1(cx + 30)} ${B} Z" fill="#3a2a1a" ${O(3)}/>`;
      if (lv >= 2) { const tx = x1 + 6; g += `<path d="M${f1(tx - 22)} ${B} L${f1(tx)} ${B - 60} L${f1(tx + 22)} ${B}" stroke="${INK}" stroke-width="4" fill="none"/><path d="M${f1(tx)} ${B - 60} v14" stroke="${INK}" stroke-width="2"/><path d="M${f1(tx - 14)} ${B - 46} h28 q0 20 -14 20 q-14 0 -14 -20 Z" fill="#3a3640" ${O(2)}/><path d="M${f1(tx - 12)} ${B} q12 -26 24 0" fill="#ff8a2a"/>`; }
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#5a3a1e');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = oakHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f5a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(104, f.wall * 0.68);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 26)} H${f1(ax0 - 10)} Z" fill="${MOSS}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 22)} V${h.B}" stroke="${OAKD}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(2 + lv, Math.floor((ax1 - ax0) / 34))); i < n; i++) { const px = ax0 + 18 + i * 34; g += `<path d="M${f1(px)} ${f1(ay + 26)} v10" stroke="${INK}" stroke-width="2"/>` + (i % 2 ? `<path d="M${f1(px - 11)} ${f1(ay + 36)} q11 -6 22 0 l-3 28 q-8 6 -16 0 Z" fill="#8a6a4a" ${O(2)}/>` : `<ellipse cx="${f1(px)}" cy="${f1(ay + 52)}" rx="10" ry="16" fill="#5a7a9a" ${O(2)}/>`); }
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${OAK}" ${O(3)}/><rect x="${f1(ax0 + 16)}" y="${h.B - 46}" width="44" height="16" rx="8" fill="#efe0b8" ${O(2)}/>`;
      if (lv >= 2) g += staff(k, x0 - 40, h.B) + staff(k, x0 - 26, h.B);
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const hb = B - Math.min(f.wall * 0.5, 70 + lv * 12);
      let g = `<path d="M${f1(cx - 46)} ${B} Q${f1(cx - 26)} ${f1(B - 40)} ${f1(cx - 26)} ${f1(hb + 10)} L${f1(cx - 60)} ${f1(hb - 4)} H${f1(cx + 60)} L${f1(cx + 26)} ${f1(hb + 10)} Q${f1(cx + 26)} ${f1(B - 40)} ${f1(cx + 46)} ${B} Z" fill="${BARK}" ${O(4)}/><path d="M${f1(cx - 46)} ${B} l-18 6 M${f1(cx + 46)} ${B} l18 6" stroke="${BARK}" stroke-width="9" stroke-linecap="round"/>`;
      g += `<rect x="${f1(x0 - 4)}" y="${f1(hb - 12)}" width="${f1(w + 8)}" height="14" fill="${OAK}" ${O(3)}/>`;
      g += k.wall(x0 + 10, top, w - 20, hb - 12, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), OAK);
      const rh = Math.min(f.up - 30, 76 + lv * 12);
      g += `<path d="M${f1(x0 - 6)} ${f1(top + 8)} L${f1(cx)} ${f1(top - rh)} L${f1(x1 + 6)} ${f1(top + 8)} Z" fill="#3a2a6a" ${O()}/>`;
      for (let i = 0; i < 3; i++) g += `<path d="M${f1(cx - 26 + i * 26)} ${f1(top - rh * (0.3 + (i % 2) * 0.2))} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="#ffd76a" ${O(1.2)}/>`;
      g += win(k, cx - 15, top + 24, 30, 34, lv) + k.door(cx, B, 34 + lv * 2, 56 + lv * 3, '#3a2a5a');
      let rope = ''; for (let y = hb; y < B - 8; y += 18) rope += `M${f1(x1 - 26)} ${y} h22`;
      g += `<path d="M${f1(x1 - 26)} ${hb} V${B} M${f1(x1 - 4)} ${hb} V${B}" stroke="#8a6a44" stroke-width="3"/><path d="${rope}" stroke="#8a6a44" stroke-width="4"/>`;
      for (let i = 0; i < Math.min(lv, 4); i++) g += acorn(k, x0 + 6 + i * (w - 12) / 3, hb + 18 + (i % 2) * 14, 0.55, lv >= 5) + `<circle cx="${f1(x0 + 6 + i * (w - 12) / 3)}" cy="${f1(hb + 20 + (i % 2) * 14)}" r="14" fill="#ffe08a" opacity=".3"/>`;
      if (lv >= 5) g += k.orb(cx, top - rh - 8, 9);
      k.signId('magic'); g += k.signLv(cx, hb + 46, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  const art = {
    K: { leaf: LEAF, grass: '#9ab866', grass2: '#84a258', dirt: '#b89a6a', dirtD: '#947a4e', far: ['#5f7a52', '#6e8a5c'] },

    back(k) {
      const { P, L, f1 } = k;
      let g = '';
      for (let i = 0; i < 9; i++) { const x = 160 + i * 520 + ((i * 137) % 120), w = 54 + (i % 3) * 14; g += `<path d="M${x - w} 800 Q${x - w * 0.5} 640 ${x - w * 0.4} 470 L${x + w * 0.4} 470 Q${x + w * 0.5} 640 ${x + w} 800 Z" fill="#6a6a58" opacity=".55"/>`; }
      const far = k.sym('d02far', () => { let c = ''; for (const [dx, dy, r] of [[-70, 10, 58], [64, 14, 60], [-30, -30, 66], [36, -34, 64], [0, 22, 62], [-6, -70, 52], [-92, -24, 40], [92, -20, 42]]) c += `<circle cx="${dx}" cy="${dy}" r="${r}"/>`; return c; });
      for (let i = 0; i < 12; i++) g += `<g fill="${['#5a7a56', '#66865e', '#527050'][i % 3]}">${k.use(far, 120 + i * 380 + ((i * 97) % 90), 400 + (i % 3) * 30, 1.5 + (i % 2) * 0.3, 1.1)}</g>`;
      P(0, L.W, g);
      void f1;
    },
    decor(k) {
      const L = k.L;
      (L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) { k.P(a, b, oak(k, (a + b) / 2, 792, 0.9)); return; }
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 24, up: 110, lv: 2 };
        const cr = i % 2 ? x1 + 10 : a;
        k.P(a, b, oakHouse(k, f, { door: false, noWin: true, crown: cr }).g + win(k, i % 2 ? a + 34 : x1 - 62, 792 - f.wall + 24, 28, 34, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, OAKD));
      });
      if (L.hx.bigOak) k.P(L.hx.bigOak - 160, L.hx.bigOak + 160, oak(k, L.hx.bigOak, 794, 1.25));
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + acorn(k, lot.x0 + 10, 664, 0.8);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = oakHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 24 : x1 - 58, 795 - f.wall + 24, 30, 36, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, OAKD) + staff(k, c.v % 2 ? x1 - 80 : x0 + 80, 795);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(280 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'oldoak') {

        let g = k.ell(x, y + 6, 120, 22) + `<path d="M${x - 70} ${y + 4} Q${x - 40} ${y - 30} ${x - 44} ${y - 120} Q${x - 50} ${y - 200} ${x - 96} ${y - 250} L${x - 70} ${y - 262} Q${x - 30} ${y - 226} ${x - 10} ${y - 240} L${x + 20} ${y - 290} L${x + 44} ${y - 280} Q${x + 30} ${y - 230} ${x + 44} ${y - 180} Q${x + 40} ${y - 60} ${x + 76} ${y + 4} Z" fill="${BARK}" ${O(4.5)}/>`;
        g += `<path d="M${x - 70} ${y + 4} q-30 4 -46 -6 M${x + 76} ${y + 4} q30 2 44 -10 M${x - 20} ${y + 6} q-6 10 -22 12" stroke="${BARK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${x - 24} ${y - 40} q-6 -50 4 -100 M${x + 18} ${y - 60} q8 -40 -2 -80 M${x - 6} ${y - 160} q10 -30 0 -60" stroke="${OAKD}" stroke-width="4" fill="none"/>`;
        g += `<ellipse cx="${x - 2}" cy="${y - 140}" rx="18" ry="26" fill="#2a1a10" ${O(3)}/><circle cx="${x - 2}" cy="${y - 140}" r="9" fill="#ffd76a" opacity=".8"/>`;
        g += k.use(crownSym(k), x, y - 330, 1.7, 1.15);
        for (const [dx, dy, c] of [[-120, -270, '#c8402a'], [-50, -250, '#ffffff'], [70, -262, '#3a6aa8'], [140, -282, '#e0a43a'], [10, -238, '#c8402a']]) g += `<path d="M${x + dx} ${y + dy} q4 26 -4 48 M${x + dx + 6} ${y + dy} q6 20 0 40" stroke="${c}" stroke-width="5" fill="none"/>`;
        g += `<path d="M${x + 100} ${y - 250} v40" stroke="${INK}" stroke-width="2"/><path d="M${x + 90} ${y - 210} q10 -6 20 0 l-2 24 q-8 6 -16 0 Z" fill="#8a6a4a" ${O(2)}/>`;

        const sx = x + 110, sy = y + 30;
        g += `<path d="M${sx + 30} ${sy} Q${sx + 120} ${sy + 20} ${sx + 200} ${sy + 64}" stroke="${WATER}" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="${sx}" cy="${sy}" rx="40" ry="16" fill="#8a8696" ${O(3.5)}/><ellipse cx="${sx}" cy="${sy - 2}" rx="28" ry="9" fill="${WATER}"/><path d="M${sx - 10} ${sy - 4} q10 -4 20 0" stroke="#ffffff" stroke-width="2.5" fill="none"/>`;
        g += k.txt(sx, sy + 34, 'КЛЮЧ', 14, '#2a3a4a');
        return { g, w: 560, h: 480 };
      }
      if (p.k === 'signpost') { let g = k.ell(x, y, 22, 6) + `<path d="M${x} ${y} V${y - 180}" stroke="${INK}" stroke-width="12"/><path d="M${x} ${y} V${y - 180}" stroke="${BARK}" stroke-width="7"/>`; for (let i = 0; i < 3; i++) { const sd = i % 2 ? 1 : -1, yy = y - 170 + i * 28; g += `<path d="M${x} ${yy} h${sd * 56} l${sd * 10} 9 l${-sd * 10} 9 h${-sd * 56} Z" fill="${i % 2 ? '#c8a06a' : OAK}" ${O(2.5)}/>`; } g += acorn(k, x, y - 192, 0.8); return { g, w: 150, h: 210 }; }
      if (p.k === 'oak2') return { g: k.ell(x, y, 40 * s, 10) + oak(k, x, y, s), w: 220 * s, h: 300 * s };
      if (p.k === 'stump') return { g: k.ell(x, y, 36, 9) + `<path d="M${x - 30} ${y} l4 -40 h52 l4 40 Z" fill="${BARK}" ${O(3)}/><ellipse cx="${x}" cy="${y - 40}" rx="26" ry="8" fill="#c8a06a" ${O(2.5)}/><path d="M${x + 6} ${y - 44} l20 -30" stroke="#5a5662" stroke-width="5"/><path d="M${x + 20} ${y - 80} l14 8 l-8 10 Z" fill="#9a9eac" ${O(2)}/>`, w: 90, h: 90, flat: true };
      if (p.k === 'lamp2') return { g: k.ell(x, y, 16, 5) + `<path d="M${x} ${y} V${y - 130} h18" stroke="${INK}" stroke-width="7" fill="none"/><path d="M${x} ${y} V${y - 130}" stroke="${BARK}" stroke-width="3.5"/>` + k.wallLamp(x + 22, y - 126), w: 70, h: 160 };
      if (p.k === 'wcamp') return { g: `<ellipse cx="${x}" cy="${y}" rx="44" ry="13" fill="#5a4a40"/><circle cx="${x}" cy="${y - 30}" r="40" fill="url(#tgGlow)" opacity=".6"/><path d="M${x - 26} ${y - 4} l52 -10 M${x - 24} ${y - 12} l48 10" stroke="#7a4e2a" stroke-width="7" stroke-linecap="round"/><path d="M${x - 16} ${y - 10} q16 -50 32 0 q-6 -24 -16 -8 q-10 -18 -16 8" fill="#ff8a2a" stroke="#c8402a" stroke-width="2"/><path d="M${x - 70} ${y - 4} h36 M${x + 34} ${y - 4} h36" stroke="${BARK}" stroke-width="14" stroke-linecap="round"/>` + staff(k, x + 50, y - 4), w: 170, h: 110 };
      if (p.k === 'acorns') return { g: k.ell(x, y, 30, 7) + acorn(k, x - 12, y - 10, 0.8) + acorn(k, x + 10, y - 8, 0.8) + acorn(k, x, y - 24, 0.8), w: 70, h: 44, flat: true };
      return null;
    },
  };

  return {
    id: 'd02', ver: 1, name: 'Ключино', layout, art,
    story: 'Привал скитальцев в вековой дубраве: дубовые дома под замшелой дранкой, у дверей - посохи и котомки, склад - в дупле огромного пня, чародей живёт в избушке на дубе. Петляющая тропа сводит путников на поляну к Дубу-Скитальцу, под корнями которого бьёт ключ.',
  };
});
