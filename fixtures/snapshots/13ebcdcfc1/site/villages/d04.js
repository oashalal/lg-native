


(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const RED = '#c8322a', REDD = '#8a1e1e', BERRY = '#e8402e';

  const KINDS = { rowan: { foot: [56, 20], tall: 320 }, rowanT: { foot: [26, 12], tall: 230, tree: true }, racks: { foot: [66, 10], tall: 120 }, hives: { foot: [54, 10], tall: 80 }, mill: { foot: [70, 18], tall: 260 } };

   

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        mine: { x0: 4040, x1: 4340 },
        hall: { x0: 2050, x1: 2350 },
        board: { x0: 1720, x1: 1940 },
        magic: { x0: 2460, x1: 2690 },
        shop: { x0: 990, x1: 1280, B: 1170 },
        tent: { x0: 2950, x1: 3300, B: 1170 },
        storage: { x0: 3370, x1: 3630, B: 1170 },
        trainer: { x0: 3700, x1: 3975, B: 1170 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [700, 910], [1500, 912], [2200, 908], [2900, 912], [3600, 908], [4360, 910]] },
        { k: 'ring', w: 38, pts: [[1450, 930], [1360, 1060], [1330, 1220], [1420, 1360], [1700, 1420], [2200, 1430], [2700, 1420], [2980, 1360], [3070, 1220], [3040, 1060], [2950, 930]] },
        { k: 'lane', w: 34, pts: [[300, 1240], [600, 1238], [1000, 1236], [1336, 1234]] },
        { k: 'lane2', w: 34, pts: [[3062, 1238], [3400, 1236], [3800, 1240], [4300, 1238]] },
        { k: 'cross', w: 30, pts: [[300, 912], [290, 1080], [300, 1240]] },
        { k: 'cross', w: 30, pts: [[4300, 912], [4310, 1080], [4300, 1238]] },
        { k: 'cross2', w: 30, pts: [[785, 1240], [785, 1380], [800, 1440]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1170, rx: 520, ry: 170, mark: 'rowan', ms: 1.15, paved: false }],
      kinds: KINDS,
      props: [['racks', 1820, 1130], ['racks', 2580, 1130], ['well', 2200, 1310, 0.9], ['hives', 1700, 1040], ['hives', 2700, 1040]],
      houses: [{ x0: 360, x1: 560, base: 1430 }, { x0: 4060, x1: 4280, base: 1420 }, { x0: 590, x1: 740, base: 1440 }],
      fill: [{ k: ['rowanT', 'rowanT', 'haystack', 'flowerbed', 'bush'], n: 30, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'flowers', 'bush'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { sword: { x: 1380, y: 430 }, backHouses: [[980, 1220], [1280, 1520], [1560, 1660], [2760, 3000], [3060, 3300], [3360, 3600], [3660, 3960]] },
    };
  }

   
  const art = {
    K: { leaf: ['#5f8f3a', '#77a843', '#4a7a32'] },

    back(k) {
      const { L, P, f1, O, INK } = k, sw = L.hx.sword || { x: 2400, y: 380 };
      const x = sw.x, y = sw.y;
      let g = `<path d="M${x - 760} 660 Q${x - 360} ${y + 120} ${x} ${y + 90} Q${x + 380} ${y + 110} ${x + 780} 660 Z" fill="#7f9a62"/>`
        + `<path d="M${x - 520} 660 Q${x - 250} ${y + 190} ${x} ${y + 160} Q${x + 240} ${y + 180} ${x + 520} 660 Z" fill="#8fab6c"/>`;

      g += `<g transform="rotate(-9 ${x} ${y + 120})">`
        + `<path d="M${x - 30} ${y + 130} L${x - 30} ${y - 60} L${x - 12} ${y - 70} L${x - 4} ${y - 40} L${x + 10} ${y - 66} L${x + 30} ${y - 60} L${x + 30} ${y + 130} Z" fill="#b8bcc8" ${O(5)}/>`
        + `<path d="M${x} ${y + 128} V${y - 56}" stroke="#8a8e9e" stroke-width="5"/><path d="M${x - 18} ${y + 110} V${y - 50}" stroke="#e8ecf4" stroke-width="5" opacity=".8"/>`
        + `<path d="M${x + 8} ${y + 10} l-12 22 l10 16 l-8 20" stroke="${INK}" stroke-width="3.5" fill="none"/>`
        + `<rect x="${x - 86}" y="${y - 96}" width="172" height="28" rx="8" fill="#8a6a3a" ${O(5)}/><circle cx="${x - 86}" cy="${y - 82}" r="16" fill="#a8823e" ${O(4)}/><circle cx="${x + 86}" cy="${y - 82}" r="16" fill="#a8823e" ${O(4)}/>`
        + `<rect x="${x - 16}" y="${y - 210}" width="32" height="116" rx="6" fill="#5a3a2a" ${O(5)}/><path d="M${x - 16} ${y - 190} l32 12 M${x - 16} ${y - 166} l32 12 M${x - 16} ${y - 142} l32 12 M${x - 16} ${y - 118} l32 12" stroke="#3a2418" stroke-width="4"/>`
        + `<circle cx="${x}" cy="${y - 224}" r="22" fill="#a8823e" ${O(5)}/>`
        + `</g>`;
      for (const [dx, dy, s] of [[-180, 170, 0.8], [190, 160, 0.75], [-330, 210, 0.7], [320, 205, 0.65]]) g += rowanTree(k, x + dx, y + dy, s);
      P(x - 800, x + 800, g);
    },

    decor(k) { (k.L.hx.backHouses || []).forEach(([a, b], i) => k.P(a, b, backHouse(k, a, b, i))); },
    

    building(id, lot, f, k) {
      if (id === 'anvil') {
        const x0 = lot.x0, fx0 = lot.fx0;
        return k.ART.anvil(lot) + `<path d="M${x0 + 8} 640 v18" stroke="${RED}" stroke-width="3"/>` + berries(k, x0 + 8, 664, 1) + berries(k, fx0 - 4, 610, 0.9);
      }
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },

    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2, B = 795, v = c.v;
      const g0 = izba(k, x0, x1, B, 96 + (v % 30), v, 2);
      const g = k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`;
      return { g, h: Math.round((96 + 30 + 150) * s + 40) };
    },
    prop(p, k) {
      const { f1, O, INK } = k, x = p.x, y = p.y, s = p.s || 1;
      if (p.k === 'rowan') return { g: k.ell(x, y + 6, 90 * s, 18) + rowanTree(k, x, y, 1.45 * s) + `<path d="M${f1(x - 80 * s)} ${f1(y - 16)} a${f1(80 * s)} 22 0 0 0 ${f1(160 * s)} 0" fill="none" stroke="${INK}" stroke-width="16"/><path d="M${f1(x - 80 * s)} ${f1(y - 16)} a${f1(80 * s)} 22 0 0 0 ${f1(160 * s)} 0" fill="none" stroke="#b47a48" stroke-width="10"/>`, w: 340 * s, h: 330 * s };
      if (p.k === 'rowanT') return { g: k.ell(x, y, 34 * s, 9) + rowanTree(k, x, y, s), w: 180 * s, h: 220 * s };
      if (p.k === 'racks') {
        let g = k.ell(x, y, 70, 10) + `<path d="M${x - 60} ${y} V${y - 96} M${x + 60} ${y} V${y - 96} M${x - 66} ${y - 92} H${x + 66} M${x - 66} ${y - 56} H${x + 66}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x - 60} ${y} V${y - 96} M${x + 60} ${y} V${y - 96} M${x - 66} ${y - 92} H${x + 66} M${x - 66} ${y - 56} H${x + 66}" stroke="#a87a4a" stroke-width="5" stroke-linecap="round"/>`;
        for (let i = 0; i < 6; i++) { const bx = x - 50 + i * 20, by = y - (i % 2 ? 56 : 92); g += `<path d="M${bx} ${by} v10" stroke="${INK}" stroke-width="2"/>` + berries(k, bx, by + 18, 0.8); }
        return { g, w: 170, h: 120 };
      }
      if (p.k === 'hives') {
        let g = '';
        for (const [dx, h] of [[-26, 60], [26, 52]]) g += k.ell(x + dx, y, 22, 6) + `<rect x="${x + dx - 18}" y="${y - h}" width="36" height="${h}" rx="8" fill="#b4834a" ${O(3.5)}/><path d="M${x + dx - 24} ${y - h} h48 l-6 -12 h-36 Z" fill="#e0b456" ${O(3)}/><circle cx="${x + dx}" cy="${y - h * 0.45}" r="5" fill="${INK}"/>`;
        return { g, w: 120, h: 90, flat: true };
      }
      if (p.k === 'mill') {
        let g = k.ell(x, y, 90, 14) + `<rect x="${x - 80}" y="${y - 150}" width="120" height="150" fill="#b47a48" ${O()}/><path d="M${x - 96} ${y - 146} L${x - 20} ${y - 236} L${x + 56} ${y - 146} Z" fill="#e0b456" ${O()}/>`;
        g += `<circle cx="${x + 70}" cy="${y - 60}" r="66" fill="none" stroke="${INK}" stroke-width="14"/><circle cx="${x + 70}" cy="${y - 60}" r="66" fill="none" stroke="#8a5a32" stroke-width="8"/>`;
        for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g += `<path d="M${f1(x + 70)} ${f1(y - 60)} L${f1(x + 70 + Math.cos(a) * 66)} ${f1(y - 60 + Math.sin(a) * 66)}" stroke="#8a5a32" stroke-width="6"/>`; }
        return { g, w: 320, h: 260 };
      }
      return null;
    },
  };
   

  function trim(k, x0, x1, top, h, lv, c = RED) {
    const { f1, O, INK } = k, cx = (x0 + x1) / 2, e = 22, ax = cx, ay = top - h;
    const L0 = [x0 - e, top + 4], R0 = [x1 + e, top + 4];
    let g = `<path d="M${L0[0]} ${L0[1]} L${ax} ${ay} L${R0[0]} ${R0[1]}" fill="none" stroke="${INK}" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><path d="M${L0[0]} ${L0[1]} L${ax} ${ay} L${R0[0]} ${R0[1]}" fill="none" stroke="${c}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>`;

    let d = '';
    for (const [P, Q] of [[[ax, ay], L0], [[ax, ay], R0]]) {
      const n = Math.max(3, Math.round(Math.hypot(Q[0] - P[0], Q[1] - P[1]) / 26));
      for (let i = 1; i < n; i++) { const t = i / n, x = P[0] + (Q[0] - P[0]) * t, y = P[1] + (Q[1] - P[1]) * t + 6; d += `M${f1(x - 6)} ${f1(y)} a6 6 0 0 0 12 0`; }
    }
    g += `<path d="${d}" fill="${lv >= 5 ? k.GOLD : '#f3efd8'}" stroke="${INK}" stroke-width="2"/>`;

    const pl = lv >= 3 ? 46 : 32;
    g += `<path d="M${f1(ax - 9)} ${f1(ay + 6)} h18 v${pl} l-9 10 l-9 -10 Z" fill="${c}" ${O(3)}/><path d="M${f1(ax - 5)} ${f1(ay + 14)} h10 M${f1(ax - 5)} ${f1(ay + 24)} h10" stroke="#f3efd8" stroke-width="2.5"/>` + berries(k, ax, ay + pl + 16, 1.1);

    if (lv >= 3) g += `<path d="M${f1(ax - 4)} ${f1(ay - 2)} q10 -30 30 -26 q8 2 6 10 q-10 0 -14 8 q-6 10 -22 8 Z" fill="${lv >= 5 ? k.GOLD : '#b47a48'}" ${O(3)}/><circle cx="${f1(ax + 24)}" cy="${f1(ay - 22)}" r="2.5" fill="${INK}"/>`;
    else g += `<path d="M${f1(ax)} ${f1(ay)} v-16" stroke="${INK}" stroke-width="5"/>` + berries(k, ax, ay - 26, 0.9);
    return g;
  }

  function nal(k, x, y, w, h, lv) {
    const { f1, O, INK } = k, c = lv >= 5 ? k.GOLD : RED;
    let g = `<path d="M${f1(x - 9)} ${f1(y - 4)} Q${f1(x + w / 2)} ${f1(y - 26 - lv * 2)} ${f1(x + w + 9)} ${f1(y - 4)} Z" fill="${c}" ${O(3)}/><circle cx="${f1(x + w / 2)}" cy="${f1(y - 12 - lv)}" r="4" fill="#f3efd8" stroke="${INK}" stroke-width="1.6"/>`;
    g += `<rect x="${f1(x - 9)}" y="${f1(y - 4)}" width="7" height="${f1(h + 10)}" fill="${c}" ${O(2.5)}/><rect x="${f1(x + w + 2)}" y="${f1(y - 4)}" width="7" height="${f1(h + 10)}" fill="${c}" ${O(2.5)}/>`;
    if (lv >= 3) { let d = ''; for (let i = 0; i < 4; i++) d += `M${f1(x - 6 + i * (w + 12) / 4)} ${f1(y + h + 8)} a${f1((w + 12) / 8)} 6 0 0 0 ${f1((w + 12) / 4)} 0`; g += `<path d="${d}" fill="${c}" stroke="${INK}" stroke-width="2"/>`; }
    return g;
  }

  const win = (k, x, y, w, h, lv, lit = true) => k.winLit(x, y, w, h, lit) + nal(k, x, y, w, h, lv);

  function beads(k, x0, x1, y, sag) {
    const { f1, INK } = k, mx = (x0 + x1) / 2;
    let g = `<path d="M${f1(x0)} ${f1(y)} Q${f1(mx)} ${f1(y + sag * 2)} ${f1(x1)} ${f1(y)}" stroke="${INK}" stroke-width="2.5" fill="none"/>`, d = '';
    const n = Math.max(5, Math.round((x1 - x0) / 16));
    for (let i = 1; i < n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, yy = y + 4 * sag * t * (1 - t); d += `M${f1(x - 4.5)} ${f1(yy + 3)}a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0`; }
    return g + `<path d="${d}" fill="${BERRY}" stroke="#5a1414" stroke-width="1.5"/>`;
  }

  function porch(k, cx, B, lv, w) {
    const { f1, O, INK } = k, h = 56 + lv * 4, x0 = cx - w / 2, x1 = cx + w / 2;
    let g = `<path d="M${f1(x0 - 10)} ${B + 6} h${f1(w + 20)} v-8 h-8 v-6 h${f1(-w - 4)} v6 h-8 Z" fill="#a29c8e" ${O(3)}/>`;
    for (const px of [x0 + 4, x1 - 4]) g += `<path d="M${f1(px)} ${B} V${f1(B - h)}" stroke="${INK}" stroke-width="12"/><path d="M${f1(px)} ${B} V${f1(B - h)}" stroke="#b47a48" stroke-width="7"/><ellipse cx="${f1(px)}" cy="${f1(B - h * 0.55)}" rx="7" ry="11" fill="#b47a48" ${O(2.5)}/>`;
    g += k.roof(x0 - 4, x1 + 4, B - h, 26 + lv * 3, lv >= 4 ? 'shingle' : 'thatch', lv >= 4 ? '#b5533c' : undefined) + trim(k, x0 - 4, x1 + 4, B - h, 26 + lv * 3, Math.min(lv, 2));
    return g;
  }

  function tower(k, cx, B, tw, th, roofH, lv, c = '#b5533c') {
    const { f1, O, INK } = k, x0 = cx - tw / 2, top = B - th;
    let g = k.wall(x0, top, tw, B, 'log') + `<path d="M${f1(x0 - 14)} ${f1(top + 4)} L${f1(cx)} ${f1(top - roofH)} L${f1(x0 + tw + 14)} ${f1(top + 4)} Z" fill="${c}" ${O()}/>`;
    let sc = ''; for (let y = top - roofH + 26; y < top; y += 16) { const hw = (y - (top - roofH)) / roofH * (tw / 2 + 14); sc += `M${f1(cx - hw + 6)} ${f1(y)} H${f1(cx + hw - 6)}`; }
    g += `<path d="${sc}" stroke="${INK}" stroke-width="2" opacity=".35"/><path d="M${f1(x0 - 14)} ${f1(top + 4)} L${f1(cx)} ${f1(top - roofH)} L${f1(x0 + tw + 14)} ${f1(top + 4)}" fill="none" stroke="${lv >= 5 ? k.GOLD : RED}" stroke-width="4"/>`;
    g += lv >= 5 ? k.orb(cx, top - roofH - 10, 9) : `<path d="M${f1(cx)} ${f1(top - roofH)} v-22" stroke="${INK}" stroke-width="4"/>` + berries(k, cx, top - roofH - 30, 0.9);
    return { g, top };
  }

  const BLD = {


    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, top = B - f.wall, ow = [92, 104, 112, 112, 120][lv - 1];
      const nm = L.name.toUpperCase();
      let g = '';

      let pal = ''; for (let x = x0; x < x1; x += 24) if (x + 20 < cx - ow / 2 - 26 || x > cx + ow / 2 + 26) { const t = B - 120 - ((x * 7) % 18); pal += `<path d="M${x} ${B} V${t} l10 -14 l10 14 V${B} Z" fill="#a87a4a" ${O(3)}/>`; }
      g += pal;

      if (lv >= 3) for (const sx of [x0 + 34, x1 - 34]) { const tw = 60, th = f.wall * 0.62; const t = tower(k, sx, B, tw, th, lv >= 4 ? 70 + lv * 8 : 30, lv, lv >= 4 ? '#b5533c' : '#e0b456'); g += t.g + win(k, sx - 12, t.top + 24, 24, 30, lv) + (lv >= 4 ? k.pennant(sx, t.top - (70 + lv * 8) - 22, RED) : ''); }

      const ph = f.wall - (lv <= 1 ? 30 : 0);
      for (const px of [cx - ow / 2 - 13, cx + ow / 2 + 13]) g += `<rect x="${f1(px - 13)}" y="${f1(B - ph)}" width="26" height="${f1(ph)}" fill="#7a4e2a" ${O(4)}/><path d="M${f1(px - 8)} ${f1(B - ph + 30)} h16 M${f1(px - 8)} ${f1(B - ph + 56)} h16" stroke="${RED}" stroke-width="5"/><path d="M${f1(px - 16)} ${f1(B - ph)} L${f1(px)} ${f1(B - ph - 22)} L${f1(px + 16)} ${f1(B - ph)} Z" fill="${RED}" ${O(3)}/>` + berries(k, px, B - ph - 34, 1);

      if (lv >= 2) for (const s of [-1, 1]) { const a = cx + (s < 0 ? -ow / 2 : 2), w2 = ow / 2 - 2; g += `<rect x="${f1(a)}" y="${f1(B - ph + 40)}" width="${f1(w2)}" height="${f1(ph - 40)}" fill="#8a5a32" ${O(3)}/><path d="M${f1(a + 4)} ${f1(B - ph + 70)} h${f1(w2 - 8)} M${f1(a + 4)} ${f1(B - 30)} h${f1(w2 - 8)}" stroke="#3a3640" stroke-width="5"/><path d="M${f1(a + w2 / 2)} ${f1(B - ph + 44)} V${B - 4}" stroke="#5e3e22" stroke-width="2"/>`; }
      else g += `<path d="M${f1(cx - ow / 2)} ${B} V${f1(B - ph + 40)} H${f1(cx + ow / 2)} V${B}" fill="#2a2030" opacity=".35"/>`;

      const by = B - ph - (lv >= 2 ? 8 : -6), bw = Math.max(ow + 70, nm.length * 15 + 40);
      if (lv >= 2) g += k.roof(cx - ow / 2 - 30, cx + ow / 2 + 30, by - 14, 40 + lv * 6, lv >= 4 ? 'shingle' : 'thatch', lv >= 4 ? '#b5533c' : undefined) + trim(k, cx - ow / 2 - 30, cx + ow / 2 + 30, by - 14, 40 + lv * 6, lv);
      if (lv >= 5) { const t = tower(k, cx, by - 14, 90, 60, 110, lv); g = g.replace(pal, pal + '') + t.g + win(k, cx - 14, t.top + 14, 28, 30, lv); }
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(by - 2)}" width="${f1(bw)}" height="30" rx="6" fill="${lv >= 4 ? '#8a5a32' : '#b47a48'}" ${O(3.5)}/>` + k.txt(cx, by + 21, nm, 17, '#f3efd8');
      k.signAt([cx - bw / 2 - 4, by - 6, cx + bw / 2 + 4, by + 32]);
      if (lv >= 5) for (const sx of [cx - bw / 2 + 4, cx + bw / 2 - 4]) g += `<circle cx="${f1(sx)}" cy="${f1(by + 13)}" r="17" fill="none" stroke="#4f7f32" stroke-width="7"/>` + berries(k, sx, by + 2, 0.9);
      return g;
    },


    hall(lot, f, k) {
      const lv = f.lv, cx = (f.x0 + f.x1) / 2;
      const e = k.edifice(f, { id: 'hall', sign: 'РАТУША', mat: lv <= 1 ? 'shack' : 'log', matUp: 'log', roof: lv >= 4 ? 'shingle' : 'thatch', roofC: lv >= 4 ? '#b5533c' : undefined, tower: lv >= 3, noTurrets: true, noGarland: true, lowWin: (x, y, w, h) => win(k, x, y, w, h, lv), door: lv < 2, stoop: true });
      let g = e.g + trim(k, f.x0, f.x1, e.top, e.rh, lv);
      if (lv >= 2) g += porch(k, cx, e.B, lv, 84 + lv * 6);
      if (lv >= 2) g += k.bigDoor(cx, e.B, Math.min(lv, 3), '#7a4e2a', 0.9);
      if (lv <= 2) { const px = f.x1 - 22, py = e.top - e.rh * 0.5; g += `<path d="M${px} ${e.top + 6} V${py - 40} M${px - 18} ${py - 40} h36" stroke="${k.INK}" stroke-width="6"/><path d="M${px - 10} ${py - 36} q10 -4 20 0 l4 22 h-28 Z" fill="#d8a84a" ${k.O(3)}/>`; }
      if (lv >= 3) { const t = tower(k, cx, e.top - e.rh * 0.35, 70 + lv * 6, 60 + lv * 14, lv >= 4 ? 90 + lv * 10 : 50, lv); g += t.g + `<path d="M${cx - 18} ${t.top + 18} q18 -10 36 0 l4 30 h-44 Z" fill="#d8a84a" ${k.O(3)}/><circle cx="${cx}" cy="${t.top + 52}" r="4" fill="${k.INK}"/>`; if (lv >= 4) for (const s of [-1, 1]) g += k.flag(cx + s * 40, t.top - 10, RED); }
      if (lv >= 5) g += beads(k, f.x0 + 10, f.x1 - 10, e.mid - 18, 10);
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, cx = (f.x0 + f.x1) / 2;
      const e = k.edifice(f, { id: 'trainer', sign: 'ТРЕНЕР', mat: lv <= 1 ? 'shack' : 'log', matUp: 'log', roof: lv >= 4 ? 'shingle' : 'thatch', roofC: lv >= 4 ? '#b5533c' : undefined, noTurrets: true, noGarland: true, lowWin: (x, y, w, h) => win(k, x, y, w, h, lv) });
      let g = e.g + trim(k, f.x0, f.x1, e.top, e.rh, lv);

      g += `<g transform="translate(${f1(cx)} ${f1(e.top - e.rh * 0.42)}) scale(${0.5 + lv * 0.06})"><path d="M-40 -40 L34 34 M40 -40 L-34 34" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-40 -40 L34 34 M40 -40 L-34 34" stroke="${lv >= 5 ? k.GOLD : '#d8b48a'}" stroke-width="8" stroke-linecap="round"/></g>`;
      if (lv >= 2) for (const sx of [f.x0 + 16, f.x1 - 16]) g += `<g transform="translate(${f1(sx)} ${f1(e.top + 30)})"><path d="M-16 -16 H16 V2 Q16 18 0 24 Q-16 18 -16 2 Z" fill="${RED}" ${O(3)}/></g>` + berries(k, sx, e.top + 30, 0.8);
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 12, x1 - 12]) g += `<rect x="${f1(px - 9)}" y="${f1(top - 6)}" width="18" height="${f1(B - top + 6)}" fill="#7a4e2a" ${O(3.5)}/>`;
      const by0 = top + 18, by1 = B - 50;
      g += `<rect x="${f1(x0 + 4)}" y="${f1(by0)}" width="${f1(w - 8)}" height="${f1(by1 - by0)}" rx="5" fill="#b47a48" ${O(4)}/>`;
      let pl = ''; for (let y = by0 + 22; y < by1; y += 22) pl += `M${f1(x0 + 8)} ${f1(y)} H${f1(x1 - 8)}`;
      g += `<path d="${pl}" stroke="#7a4e2a" stroke-width="2" opacity=".6"/>`;
      const notes = [[0.14, 0.12, -4, '#fff3c8'], [0.5, 0.1, 3, '#f3efd8'], [0.22, 0.52, 2, '#f3efd8'], [0.62, 0.5, -3, '#ffe0a0']].slice(0, 2 + Math.min(2, lv));
      for (const [tx, ty, r, c] of notes) { const nx = x0 + w * tx, ny = by0 + (by1 - by0) * ty, nw = Math.min(64, w * 0.3), nh = nw * 0.85; g += `<g transform="rotate(${r} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nh)}" fill="${c}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 20)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/><circle cx="${f1(nx + nw / 2)}" cy="${f1(ny + 4)}" r="4" fill="${RED}"/></g>`; }
      g += k.roof(x0 - 4, x1 + 4, top - 2, Math.min(f.up - 30, 40 + lv * 10), lv >= 4 ? 'shingle' : 'thatch', lv >= 4 ? '#b5533c' : undefined) + trim(k, x0 - 4, x1 + 4, top - 2, Math.min(f.up - 30, 40 + lv * 10), lv);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 150), 'ДОСКА', lv, 20);
      if (lv >= 3) g += `<rect x="${f1(cx - 50)}" y="${B - 16}" width="100" height="10" rx="3" fill="#a87a4a" ${O(2.5)}/><path d="M${f1(cx - 40)} ${B - 6} V${B + 4} M${f1(cx + 40)} ${B - 6} V${B + 4}" stroke="${INK}" stroke-width="5"/>`;
      g += berries(k, x1 - 20, by0 + 6, 1);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, cx = (f.x0 + f.x1) / 2, up = 26 + lv * 2;
      const f2 = { ...f, B: f.B - up, wall: f.wall - up };
      const e = k.edifice(f2, { id: 'storage', sign: 'СКЛАД', mat: lv <= 1 ? 'shack' : 'log', matUp: 'log', roof: lv >= 4 ? 'shingle' : 'thatch', roofC: lv >= 4 ? '#b5533c' : undefined, noTurrets: true, noGarland: true, stoop: false, roofH: Math.min(f2.up + up - 8, [70, 86, 100, 110, 118][lv - 1]), lowWin: (x, y, w, h) => win(k, x, y, w, h, lv) });
      let legs = ''; for (let x = f.x0 + 18; x < f.x1 - 10; x += Math.max(50, (f.x1 - f.x0 - 36) / 4)) legs += `<path d="M${f1(x - 12)} ${f.B} L${f1(x - 9)} ${f1(f.B - up)} H${f1(x + 9)} L${f1(x + 12)} ${f.B} Z" fill="#7a4e2a" ${O(3)}/><ellipse cx="${f1(x)}" cy="${f1(f.B - up)}" rx="16" ry="5" fill="#d8b48a" ${O(2.5)}/>`;
      let g = legs + e.g + trim(k, f.x0, f.x1, e.top, e.rh, lv);

      g += `<path d="M${f1(cx - 26)} ${f.B + 4} L${f1(cx - 18)} ${f1(f.B - up)} M${f1(cx + 26)} ${f.B + 4} L${f1(cx + 18)} ${f1(f.B - up)}" stroke="${INK}" stroke-width="8"/><path d="M${f1(cx - 26)} ${f.B + 4} L${f1(cx - 18)} ${f1(f.B - up)} M${f1(cx + 26)} ${f.B + 4} L${f1(cx + 18)} ${f1(f.B - up)}" stroke="#b47a48" stroke-width="4"/><path d="M${f1(cx - 23)} ${f1(f.B - up * 0.35)} h46 M${f1(cx - 21)} ${f1(f.B - up * 0.7)} h42" stroke="#b47a48" stroke-width="5"/>`;
      if (lv >= 3) g += `<path d="M${f1(cx)} ${f1(e.top - e.rh + 16)} v-14 h40 v30" stroke="${INK}" stroke-width="5" fill="none"/><path d="M${f1(cx + 34)} ${f1(e.top - e.rh + 32)} q6 10 0 16" stroke="#8a8e9e" stroke-width="4" fill="none"/>`;
      g += `<path d="M${f1(f.x0 + 6)} ${f1(f.B - up + 2)} H${f1(f.x1 - 6)}" stroke="#5e3e22" stroke-width="6"/>`;
      return g;
    },

    forge(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, x1 = f.x1, w = x1 - x0;
      const mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const e = k.edifice(f, { id: 'forge', sign: 'КУЗНЯ', signSize: 24, dx: cx, chimney: false, mat: lv <= 1 ? 'shack' : lv >= 3 ? undefined : 'log', matUp: 'log', roof: lv >= 4 ? 'shingle' : 'thatch', roofC: lv >= 4 ? '#6a4a34' : '#8a9a52', noTurrets: true, noGarland: true, avoid: [[mx - 8, mx + mw + 8]], lowWin: (x, y, ww, h) => win(k, x, y, ww, h, lv) });

      const chx = x1 - 50, chh = [90, 110, 130, 150, 170][lv - 1], cw = [26, 34, 40, 44, 48][lv - 1];
      let g = k.chimney(chx, e.top - chh, cw, chh + 20, Math.max(2, lv), '#8a8696');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(e.top - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      g += e.g + trim(k, x0, x1, e.top, e.rh, lv, '#a8322a');

      const mt = e.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${e.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${e.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(e.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.32)}" fill="#ff8a2a"/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(e.B - 26)}" rx="${f1(mw * 0.22)}" ry="${f1(mw * 0.16)}" fill="#ffd76a"/>`;

      g += `<g transform="translate(${f1(cx)} ${f1(e.top - e.rh * 0.42)}) rotate(-20) scale(${0.55 + lv * 0.06})"><path d="M-8 30 L-8 -30 L0 -40 L8 -26 L8 30 Z" fill="${lv >= 5 ? k.GOLD : '#c8ccd6'}" ${O(3)}/><rect x="-22" y="28" width="44" height="10" rx="3" fill="#8a6a3a" ${O(3)}/><rect x="-5" y="38" width="10" height="24" rx="3" fill="#5a3a2a" ${O(2.5)}/></g>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const C1 = RED, C2 = '#f3e6c8';
      const cone = (a, b, t, h, n, gold) => {
        const m = (a + b) / 2, sw = (b - a) / n; let s = '';
        for (let i = 0; i < n; i++) s += `<path d="M${f1(a + i * sw)} ${B} L${f1(a + i * sw + (i < n / 2 ? 6 : -6))} ${f1(t)} L${f1(a + (i + 1) * sw + (i < n / 2 ? 6 : -6))} ${f1(t)} L${f1(a + (i + 1) * sw)} ${B} Z" fill="${i % 2 ? C2 : C1}" ${O(3.5)}/>`;
        s += `<path d="M${f1(a - 18)} ${f1(t + 6)} Q${f1(m - (b - a) * 0.2)} ${f1(t - h * 0.5)} ${f1(m)} ${f1(t - h)} Q${f1(m + (b - a) * 0.2)} ${f1(t - h * 0.5)} ${f1(b + 18)} ${f1(t + 6)} Z" fill="${C1}" ${O()}/>`;
        for (let i = 1; i < 5; i++) s += `<path d="M${f1(m)} ${f1(t - h)} Q${f1(a - 18 + (b - a + 36) * i / 5)} ${f1(t - h * 0.3)} ${f1(a - 18 + (b - a + 36) * i / 5)} ${f1(t + 4)}" stroke="${C2}" stroke-width="7" fill="none"/>`;
        s += beads(k, a - 16, b + 16, t + 8, 4);
        s += `<path d="M${f1(m)} ${f1(t - h)} V${f1(t - h - 24)}" stroke="${INK}" stroke-width="5"/>` + (gold ? k.orb(m, t - h - 30, 8) : berries(k, m, t - h - 32, 1));
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.28); g += cone(x0, x0 + sw, top + 50, 70, 2, lv >= 5) + cone(x1 - sw, x1, top + 50, 70, 2, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.2 : x0, b = lv >= 4 ? x1 - w * 0.2 : x1;
      g += cone(a, b, top, Math.min(f.up - 30, 60 + lv * 22), lv >= 3 ? 6 : 4, lv >= 5);

      g += `<path d="M${f1(cx - 30)} ${B} L${f1(cx - 4)} ${f1(B - 90 - lv * 6)} L${f1(cx + 4)} ${f1(B - 90 - lv * 6)} L${f1(cx + 30)} ${B} Z" fill="#2a1a24" ${O(3)}/><path d="M${f1(cx - 4)} ${f1(B - 90 - lv * 6)} L${f1(cx - 40)} ${B - 20} L${f1(cx - 30)} ${B} Z" fill="${C2}" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 36, Math.min(b - a - 20, 150), 'ШАТЁР', lv, 20, '#7a1a1a');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      let g = '';
      if (lv <= 1) {
        const t = B - f.wall;
        g += `<path d="M${f1(x0 + 10)} ${B} V${f1(t)} M${f1(x1 - 10)} ${B} V${f1(t)}" stroke="${INK}" stroke-width="10"/><path d="M${f1(x0 + 10)} ${B} V${f1(t)} M${f1(x1 - 10)} ${B} V${f1(t)}" stroke="#a87a4a" stroke-width="6"/>`;
        g += k.roof(x0 + 6, x1 - 6, t, Math.min(f.up - 10, 56), 'thatch') + trim(k, x0 + 6, x1 - 6, t, Math.min(f.up - 10, 56), 1);
        g += `<rect x="${f1(x0 + 14)}" y="${B - 54}" width="${f1(w - 28)}" height="54" fill="#b47a48" ${O(3.5)}/><path d="M${f1(x0 + 14)} ${B - 34} H${f1(x1 - 14)}" stroke="#7a4e2a" stroke-width="3"/>`;
      } else {
        const e = k.edifice(f, { id: 'shop', mat: 'log', matUp: 'log', roof: lv >= 4 ? 'shingle' : 'thatch', roofC: lv >= 4 ? '#b5533c' : undefined, noTurrets: true, noGarland: true, noWin: true, door: true, dx: x1 - 40, stoop: false });
        g += e.g + trim(k, x0, x1, e.top, e.rh, lv);
        const wx0 = x0 + 18, wx1 = x1 - 80, wy = e.B - (e.two ? (e.B - e.mid) * 0.9 : (e.B - e.top) * 0.75);
        g += `<rect x="${f1(wx0)}" y="${f1(wy)}" width="${f1(wx1 - wx0)}" height="${f1(e.B - 40 - wy)}" fill="#3a2a1e" ${O(3)}/><rect x="${f1(wx0 - 6)}" y="${e.B - 44}" width="${f1(wx1 - wx0 + 12)}" height="14" fill="#a87a4a" ${O(3)}/>`;
        g += `<path d="M${f1(wx0 - 12)} ${f1(wy)} H${f1(wx1 + 12)} l-8 22 H${f1(wx0 - 4)} Z" fill="${lv >= 5 ? k.GOLD : RED}" ${O(3)}/>`;
        if (e.two) g += win(k, x0 + 30, e.top + 18, 34, 40, lv) + win(k, x1 - 64, e.top + 18, 34, 40, lv);
        if (lv >= 4) g += beads(k, x0 + 8, x1 - 8, e.top + 6, 8);
      }

      for (let i = 0; i < 3 + Math.min(lv, 2); i++) { const bx = x0 + 30 + i * Math.min(40, (w - 60) / 4), by = B - (lv <= 1 ? 56 : 46); g += i % 2 ? `<path d="M${f1(bx - 14)} ${by} h28 l-4 -18 h-20 Z" fill="#c8a06a" ${O(2.5)}/>` + berries(k, bx, by - 26, 0.9) : `<rect x="${f1(bx - 12)}" y="${by - 26}" width="24" height="26" rx="6" fill="#d8962a" ${O(2.5)}/><path d="M${f1(bx - 12)} ${by - 20} h24" stroke="#8a5a1a" stroke-width="2.5"/>`; }
      k.signId('shop'); g += k.signLv(cx, B - f.wall - (lv <= 1 ? -18 : -24), Math.min(w - 20, 150), 'ЛАВКА', lv, 20, '#2f5a2a');
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = k.wall(x0, top, w, B, lv <= 1 ? 'shack' : 'log');
      const rh = Math.min(f.up - 30, 70 + lv * 14);
      g += `<path d="M${f1(x0 - 20)} ${f1(top + 4)} L${f1(cx)} ${f1(top - rh)} L${f1(x1 + 20)} ${f1(top + 4)} Z" fill="${lv >= 5 ? '#3a2a6a' : '#4a3a7a'}" ${O()}/>`;
      let st = ''; for (let i = 0; i < 6; i++) { const sx = cx + (i % 3 - 1) * w * 0.22, sy = top - rh * (0.25 + (i % 2) * 0.3); st += `M${f1(sx)} ${f1(sy - 5)} l1.6 3.4 l3.6 .4 l-2.7 2.4 l.8 3.6 l-3.3 -1.9 l-3.3 1.9 l.8 -3.6 l-2.7 -2.4 l3.6 -.4 Z`; }
      g += `<path d="${st}" fill="#ffd76a"/>` + trim(k, x0 + 2, x1 - 2, top, rh, lv, '#6a3a8a');
      g += `<path d="M${f1(cx)} ${f1(top - rh)} v-30" stroke="${INK}" stroke-width="4"/><path d="M${f1(cx)} ${f1(top - rh - 40)} l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z" fill="${lv >= 5 ? k.GOLD : '#ffd76a'}" ${O(2)}/>`;
      g += win(k, cx - 16, top + 22, 32, 40, lv);
      if (f.wall > 200) g += win(k, cx - 16, top + 100, 32, 40, lv);
      g += k.door(cx, B, 40 + lv * 3, 68 + lv * 4, '#3a2a5a');

      for (const sx of [x0 + 14, x1 - 14]) g += `<path d="M${f1(sx)} ${B - 120} v26" stroke="${RED}" stroke-width="3"/>` + berries(k, sx, B - 90, 1);
      if (lv >= 4) g += `<rect x="${f1(x0 - 14)}" y="${f1(top + 80)}" width="${f1(w + 28)}" height="10" fill="#a87a4a" ${O(3)}/><path d="M${f1(x0 - 10)} ${f1(top + 90)} V${f1(top + 110)} M${f1(x1 + 10)} ${f1(top + 90)} V${f1(top + 110)}" stroke="${INK}" stroke-width="5"/>`;
      k.signId('magic'); g += k.signLv(cx, top - 14, Math.min(w + 20, 140), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };



  const rowanTree = (k, x, base, s) => k.use(k.sym('d04rowan', () => rowanTree0(k, 0, 0, 1)), x, base, s);
  const berries = (k, x, y, s) => k.use(k.sym('d04berry', () => berries0(k, 0, 0, 1)), x, y, s);
  function rowanTree0(k, x, base, s) {
    const { f1, O } = k;
    let g = `<path d="M${f1(x - 9 * s)} ${f1(base)} Q${f1(x - 6 * s)} ${f1(base - 60 * s)} ${f1(x - 3 * s)} ${f1(base - 110 * s)} H${f1(x + 4 * s)} Q${f1(x + 7 * s)} ${f1(base - 60 * s)} ${f1(x + 10 * s)} ${f1(base)} Z" fill="#6a4a34" ${O(3)}/>`;
    for (const [dx, dy, r, c] of [[-30, -100, 36, '#4f7f32'], [30, -104, 34, '#5f8f3a'], [0, -140, 40, '#6a9a42'], [-12, -118, 26, '#77a843']]) g += `<circle cx="${f1(x + dx * s)}" cy="${f1(base + dy * s)}" r="${f1(r * s)}" fill="${c}" ${O(3)}/>`;
    for (const [dx, dy] of [[-34, -86], [22, -92], [-4, -126], [36, -120], [-26, -136]]) g += berries(k, x + dx * s, base + dy * s, s);
    return g;
  }

  function berries0(k, x, y, s) {
    const { f1 } = k; let d = '';
    for (const [dx, dy] of [[0, 0], [-7, 4], [7, 4], [-4, 10], [4, 10], [0, 16], [-10, 10], [10, 10]]) { const cx = x + dx * s, cy = y + dy * s, r = 3.6 * s; d += `M${f1(cx - r)} ${f1(cy)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0`; }
    return `<path d="${d}" fill="${BERRY}" stroke="#5a1414" stroke-width="${f1(1.6 * s)}"/><path d="M${f1(x - 2 * s)} ${f1(y - 6 * s)} q${f1(4 * s)} ${f1(-6 * s)} ${f1(10 * s)} ${f1(-8 * s)}" stroke="#4a6a2a" stroke-width="${f1(2 * s)}" fill="none"/>`;
  }

  function izba(k, x0, x1, B, h, v, lv) {
    const { f1, O, INK } = k, w = x1 - x0, cx = (x0 + x1) / 2, top = B - h, red = v % 3 === 0, rh = Math.min(118, w * 0.5);
    let g = k.chimney(x0 + w * 0.72, top - rh * 0.55, 20, 46, 2, '#8a7a6e') + k.wall(x0, top, w, B, 'log');
    g += k.roof(x0, x1, top, rh, red ? 'shingle' : 'thatch', red ? '#b5533c' : undefined) + trim(k, x0, x1, top, rh, lv);
    const dx = v % 2 ? x1 - 44 : x0 + 44;
    g += win(k, v % 2 ? x0 + 22 : x1 - 56, top + 26, 32, 38, lv) + (w > 230 ? win(k, cx - 16, top + 26, 32, 38, lv) : '') + k.door(dx, B, 40, 62, '#7a4e2a');
    if (v % 4 === 1) g += `<path d="M${f1(dx - 30)} ${B + 2} h60 v-10 h-60 Z" fill="#a29c8e" ${O(2.5)}/>`;
    if (v % 5 === 2) { g += `<path d="M${f1(x1 + 4)} ${B - 78} H${f1(x1 + 70)} M${f1(x1 + 66)} ${B} V${B - 82}" stroke="${INK}" stroke-width="4"/>`; for (let i = 0; i < 3; i++) g += `<rect x="${f1(x1 + 10 + i * 18)}" y="${B - 76}" width="14" height="${20 + (i % 2) * 8}" fill="${['#f3efd8', RED, '#9ac0e0'][i]}" ${O(2)}/>`; }
    if (v % 5 === 4) g += `<rect x="${f1(x0 - 34)}" y="${B - 46}" width="30" height="46" rx="7" fill="#b4834a" ${O(3)}/><path d="M${f1(x0 - 40)} ${B - 46} h42 l-5 -10 h-32 Z" fill="#e0b456" ${O(2.5)}/>`;
    return g;
  }

  function backHouse(k, a, b, i) {
    const w = b - a, v = [0, 3, 2, 1, 4, 0, 3, 2][i % 8];
    if (w < 150) return rowanTree(k, (a + b) / 2, 792, 0.9);
    if (v === 1) {
      const x0 = a + 16, x1 = b - 16, t = 700;
      return `<path d="M${x0 + 8} 795 V${t} M${x1 - 8} 795 V${t}" stroke="${k.INK}" stroke-width="10"/><path d="M${x0 + 8} 795 V${t} M${x1 - 8} 795 V${t}" stroke="#8a5a32" stroke-width="6"/><path d="M${x0 + 14} 795 Q${(x0 + x1) / 2} ${t + 10} ${x1 - 14} 795 Z" fill="#e0b456" ${k.O(3.5)}/>` + k.roof(x0, x1, t, 50, 'thatch') + rowanTree(k, b - 6, 796, 0.7);
    }
    if (v === 3) {
      let g = rowanTree(k, a + 50, 790, 0.85) + rowanTree(k, b - 50, 792, 0.8);
      for (let x = a + 30; x < b - 30; x += 46) g += `<rect x="${x - 15}" y="742" width="30" height="50" rx="7" fill="#b4834a" ${k.O(3)}/><path d="M${x - 20} 742 h40 l-5 -10 h-30 Z" fill="#e0b456" ${k.O(2.5)}/>`;
      let wt = ''; for (let x = a + 6; x < b - 6; x += 18) wt += `M${x} 800 V770`; return g + `<path d="${wt}" stroke="#7a4e2a" stroke-width="5"/><path d="M${a + 4} 778 Q${(a + b) / 2} 772 ${b - 4} 778 M${a + 4} 790 Q${(a + b) / 2} 784 ${b - 4} 790" stroke="#a87a4a" stroke-width="4" fill="none"/>`;
    }
    const x0 = a + 10, x1 = Math.min(b - 10, a + 170 + (v * 23) % 70);
    let g = izba(k, x0, x1, 792, 96 + (v * 17) % 34, Math.round(a), 1);
    if (b - x1 > 90) g += rowanTree(k, (x1 + b) / 2, 794, 0.85);
    return g;
  }

  return {
    id: 'd04', ver: 1, name: 'Рябиново',
    story: 'Деревня бортников и рябинников на склоне холма, где из земли торчит обломок великого меча. Сушат рябину, ставят ульи-колоды, гонят рябиновую настойку.',
    layout,
    art,
  };
});
