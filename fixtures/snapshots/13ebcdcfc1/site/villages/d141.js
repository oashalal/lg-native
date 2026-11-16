


(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const BLUE = '#3a6aa8', BLUED = '#24487a', WHITE = '#f2ede0', CLAY = '#c9a46a', SUN = '#ffc93a';
  const KINDS = { windmill: { foot: [72, 22], tall: 340 }, ashT: { foot: [26, 12], tall: 250, tree: true }, sunfl: { foot: [60, 10], tall: 100 }, crane: { foot: [40, 14], tall: 220 }, cart: { foot: [56, 14], tall: 110 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        magic: { x0: 3420, x1: 3650 },
        mine: { x0: 4040, x1: 4340 },
        hall: { x0: 1290, x1: 1570, B: 1250 },
        shop: { x0: 1630, x1: 1890, B: 1250 },
        tent: { x0: 2690, x1: 3030, B: 1250 },
        trainer: { x0: 3090, x1: 3360, B: 1250 },
        storage: { x0: 3720, x1: 3970, B: 1250 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 908], [1500, 904], [2300, 910], [3100, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 36, pts: [[40, 1322], [700, 1318], [1300, 1324], [2000, 1318], [2700, 1324], [3400, 1316], [4360, 1320]] },
        { k: 'cross', w: 30, pts: [[1240, 910], [1236, 1110], [1240, 1322]] },
        { k: 'cross', w: 30, pts: [[3540, 908], [3546, 1110], [3540, 1318]] },
        { k: 'path', w: 30, pts: [[2300, 1110], [2290, 1220], [2300, 1320]] },
      ],
      plazas: [{ k: 'central', x: 2300, y: 1010, rx: 380, ry: 112, mark: 'windmill', ms: 1 }],
      kinds: KINDS,
      props: [['crane', 1980, 1180], ['sunfl', 2120, 1260], ['sunfl', 2470, 1258], ['cart', 2580, 1170], ['sunfl', 760, 1180]],
      houses: [{ x0: 380, x1: 600, base: 1452 }, { x0: 840, x1: 1060, base: 1448 }, { x0: 2400, x1: 2610, base: 1452 }, { x0: 4080, x1: 4300, base: 1446 }],
      fill: [{ k: ['ashT', 'ashT', 'haystack', 'sunfl', 'bush', 'flowers'], n: 30, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'flowers', 'pot'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { hill: { x: 2300 }, backHouses: [[1260, 1480], [1520, 1700], [2900, 3120], [3160, 3360], [3700, 3990]] },
    };
  }

   

  function hip(k, x0, x1, top, h, lv, col) {
    const { f1, O, INK } = k, e = 24, w = x1 - x0, sh = w * 0.24;
    const d = `M${f1(x0 - e)} ${f1(top + 6)} L${f1(x0 + sh)} ${f1(top - h)} H${f1(x1 - sh)} L${f1(x1 + e)} ${f1(top + 6)} Z`, id = k.clipId(d);
    const kind = lv >= 4 ? 'shingle' : 'thatch', c = col || (lv >= 4 ? '#b5533c' : lv <= 1 ? '#c9a85a' : '#e0b456'), cd = lv >= 4 ? '#7a2e22' : '#a8832e';
    let g = `<path d="M${x0} ${top} H${x1} V${top + 18} H${x0} Z" fill="url(#tgShade)"/><clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${c}"/><g clip-path="url(#${id})">${k.roofRows(kind, x0 - e, x1 + e, top - h, top + 8, c, cd)}</g>`;

    g += `<path d="M${f1(x0 - e)} ${f1(top + 6)} L${f1(x0 + sh)} ${f1(top - h)} L${f1(x0 + sh + 18)} ${f1(top + 6)} Z M${f1(x1 + e)} ${f1(top + 6)} L${f1(x1 - sh)} ${f1(top - h)} L${f1(x1 - sh - 18)} ${f1(top + 6)} Z" fill="${INK}" opacity=".14"/>`;
    g += `<path d="${d}" fill="none" ${O()}/><path d="M${f1(x0 + sh - 4)} ${f1(top - h)} H${f1(x1 - sh + 4)}" stroke="${lv >= 5 ? k.GOLD : cd}" stroke-width="9" stroke-linecap="round"/>`;
    if (kind === 'thatch') g += `<path d="M${f1(x0 - e - 4)} ${f1(top + 8)} Q${f1((x0 + x1) / 2)} ${f1(top + 22)} ${f1(x1 + e + 4)} ${f1(top + 8)}" stroke="${cd}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    if (lv <= 1) g += `<rect x="${f1(x0 + w * 0.3)}" y="${f1(top - h * 0.5)}" width="26" height="16" fill="#8a7a5a" opacity=".5" transform="rotate(-10 ${f1(x0 + w * 0.3)} ${f1(top - h * 0.5)})"/>`;
    return g;
  }

  function win(k, x, y, w, h, lv, lit = true) {
    const { f1, O } = k, c = lv >= 5 ? k.GOLD : BLUE;
    let g = k.winLit(x, y, w, h, lit);
    for (const sx of [x - w * 0.5 - 6, x + w + 6]) g += `<rect x="${f1(sx)}" y="${f1(y - 3)}" width="${f1(w * 0.5)}" height="${f1(h + 6)}" fill="${c}" ${O(2.5)}/><path d="M${f1(sx + w * 0.25)} ${f1(y + h * 0.28)} l${f1(w * 0.14)} ${f1(h * 0.22)} l${f1(-w * 0.14)} ${f1(h * 0.22)} l${f1(-w * 0.14)} ${f1(-h * 0.22)} Z" fill="${SUN}" stroke="${BLUED}" stroke-width="1.4"/>`;
    if (lv >= 3) g += `<path d="M${f1(x - 6)} ${f1(y - 6)} Q${f1(x + w / 2)} ${f1(y - 22)} ${f1(x + w + 6)} ${f1(y - 6)}" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    return g;
  }

  function hataWall(k, x0, x1, top, B, lv) {
    const { f1, O } = k, w = x1 - x0;
    let g = k.wall(x0, top, w, B - 16, lv <= 1 ? 'clay' : 'white') + `<rect x="${f1(x0 - 8)}" y="${B - 18}" width="${f1(w + 16)}" height="20" rx="4" fill="${CLAY}" ${O(3)}/><path d="M${f1(x0 - 4)} ${B - 14} H${f1(x1 + 4)}" stroke="#e8cc94" stroke-width="2.5"/>`;
    if (lv >= 3) g += `<path d="M${f1(x0 + 4)} ${f1(B - 26)} H${f1(x1 - 4)}" stroke="${BLUE}" stroke-width="5"/>`;
    return g;
  }

  function hataB(k, f, id, o = {}) {
    const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([60, 74, 88, 100, 110][lv - 1], f.up - 10));
    let g = '';
    if (lv >= 3 && o.chimney !== false) g += k.chimney(x1 - w * 0.26, top - rh * 0.7, 22 + lv * 2, rh * 0.5 + 20, lv, '#b5533c');
    g += hataWall(k, x0, x1, top, B, lv) + hip(k, x0, x1, top, rh, lv);
    const ww = [30, 34, 36, 38, 40][lv - 1], wh = [34, 40, 44, 48, 52][lv - 1], wy = top + Math.max(18, (f.wall - wh) * 0.32);
    if (!o.noWin) for (const x of [x0 + ww * 0.6 + 14, x1 - ww * 1.6 - 14]) if (Math.abs(x + ww / 2 - cx) > 60) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, BLUED, 0.95);
    if (o.sign) { k.signAt && 0; g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top - 4 - (lv >= 4 ? 10 : 0), Math.min(w + 20, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || BLUED); }
    if (lv >= 4) for (const sx of [x0 - 8, x1 + 8]) g += `<path d="M${f1(sx)} ${B} V${f1(top - 4)}" stroke="${k.INK}" stroke-width="10"/><path d="M${f1(sx)} ${B} V${f1(top - 4)}" stroke="#a87a4a" stroke-width="6"/>`;
    if (lv >= 5) g += garlandSun(k, x0 + 10, x1 - 10, top + 8);
    if (o.flowers !== false && lv >= 2) g += sunRow(k, x0 + 6, x0 + Math.min(70, w * 0.22), B);
    return { g, top, rh, cx, B };
  }
  const garlandSun = (k, x0, x1, y) => { const { f1 } = k; let g = `<path d="M${f1(x0)} ${f1(y)} Q${f1((x0 + x1) / 2)} ${f1(y + 22)} ${f1(x1)} ${f1(y)}" stroke="${k.INK}" stroke-width="2.5" fill="none"/>`; const n = Math.max(4, Math.round((x1 - x0) / 34)); for (let i = 1; i < n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, yy = y + 4 * 11 * t * (1 - t); g += `<circle cx="${f1(x)}" cy="${f1(yy + 6)}" r="6" fill="${i % 2 ? SUN : BLUE}" stroke="${k.INK}" stroke-width="1.6"/>`; } return g; };

  const sunflower = (k, x, B, s) => k.use(k.sym('d141sun', () => { const { O } = k; let g = `<path d="M0 0 V-62" stroke="#4f7f32" stroke-width="5"/><path d="M0 -30 q-16 -4 -20 -16 q14 0 20 12 M0 -40 q16 -4 20 -16 q-14 0 -20 12" fill="#5f8f3a"/>`; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; g += `<ellipse cx="${(Math.cos(a) * 12).toFixed(1)}" cy="${(-74 + Math.sin(a) * 12).toFixed(1)}" rx="7" ry="4" fill="${SUN}" transform="rotate(${(i * 36).toFixed(0)} ${(Math.cos(a) * 12).toFixed(1)} ${(-74 + Math.sin(a) * 12).toFixed(1)})"/>`; } return g + `<circle cx="0" cy="-74" r="9" fill="#6a3a1a" ${O(2.5)}/>`; }), x, B, s);
  const sunRow = (k, x0, x1, B) => { let g = ''; for (let x = x0; x <= x1; x += 22) g += sunflower(k, x, B + 2, 0.75); return g; };

  const ashTree = (k, x, base, s) => k.use(k.sym('d141ash', () => {
    const { O } = k; let g = `<path d="M-10 2 Q-6 -60 -4 -120 H5 Q8 -60 12 2 Z" fill="#8a7a6a" ${O(3)}/><path d="M-2 -90 l-26 -30 M3 -100 l24 -28" stroke="#8a7a6a" stroke-width="6" stroke-linecap="round"/>`;
    for (const [dx, dy, rx, ry, c] of [[-34, -128, 34, 24, '#6a9a3e'], [34, -132, 32, 22, '#7aaa48'], [0, -160, 40, 28, '#82b450'], [-14, -146, 26, 18, '#93c25c'], [22, -112, 24, 16, '#6a9a3e']]) g += `<ellipse cx="${dx}" cy="${dy}" rx="${rx}" ry="${ry}" fill="${c}" ${O(3)}/>`;
    return g + `<path d="M-40 -126 l10 -6 M-28 -140 l8 -8 M10 -150 l10 -8 M30 -126 l8 -6 M0 -168 l6 -8" stroke="#a8d070" stroke-width="3" stroke-linecap="round"/>`;
  }), x, base, s);

  function windmill(k, x, base, s, rot = 18) {
    const { f1, O, INK } = k;
    let g = `<path d="M${f1(x - 44 * s)} ${f1(base)} L${f1(x - 30 * s)} ${f1(base - 150 * s)} H${f1(x + 30 * s)} L${f1(x + 44 * s)} ${f1(base)} Z" fill="${WHITE}" ${O(4)}/><path d="M${f1(x - 30 * s)} ${f1(base - 150 * s)} L${f1(x)} ${f1(base - 196 * s)} L${f1(x + 30 * s)} ${f1(base - 150 * s)} Z" fill="#e0b456" ${O(4)}/>`;
    g += `<path d="M${f1(x - 10 * s)} ${f1(base)} V${f1(base - 40 * s)} H${f1(x + 10 * s)} V${f1(base)}" fill="${BLUED}" ${O(2.5)}/><rect x="${f1(x - 9 * s)}" y="${f1(base - 110 * s)}" width="${f1(18 * s)}" height="${f1(22 * s)}" fill="#ffd76a" ${O(2.5)}/>`;
    const hx = x, hy = base - 160 * s;
    for (let i = 0; i < 4; i++) {
      const a = (rot + i * 90) * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), L = 120 * s, nx = -uy * 16 * s, ny = ux * 16 * s;
      const ex = hx + ux * L, ey = hy + uy * L;
      g += `<path d="M${f1(hx)} ${f1(hy)} L${f1(ex)} ${f1(ey)}" stroke="${INK}" stroke-width="${f1(8 * s)}"/><path d="M${f1(hx + ux * 26 * s)} ${f1(hy + uy * 26 * s)} L${f1(ex)} ${f1(ey)} L${f1(ex + nx)} ${f1(ey + ny)} L${f1(hx + ux * 26 * s + nx)} ${f1(hy + uy * 26 * s + ny)} Z" fill="#f3efd8" ${O(2.5)}/>`;
      let lat = ''; for (let t = 0.35; t < 1; t += 0.16) lat += `M${f1(hx + ux * L * t)} ${f1(hy + uy * L * t)} l${f1(nx)} ${f1(ny)}`;
      g += `<path d="${lat}" stroke="#a87a4a" stroke-width="2"/>`;
    }
    return g + `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="${f1(9 * s)}" fill="#7a4e2a" ${O(3)}/>`;
  }

  function crane(k, x, y) {
    const { O, INK } = k;
    return k.ell(x, y + 2, 44, 10) + `<rect x="${x - 30}" y="${y - 38}" width="60" height="40" fill="#a87a4a" ${O(3.5)}/><path d="M${x - 30} ${y - 26} H${x + 30} M${x - 30} ${y - 12} H${x + 30}" stroke="#7a4e2a" stroke-width="3"/>`
      + `<path d="M${x + 50} ${y} V${y - 120} l-10 -16 M${x + 50} ${y - 120} l10 -16" stroke="${INK}" stroke-width="9"/><path d="M${x + 50} ${y} V${y - 120}" stroke="#7a4e2a" stroke-width="5"/>`
      + `<path d="M${x - 60} ${y - 200} L${x + 110} ${y - 96}" stroke="${INK}" stroke-width="8"/><path d="M${x - 60} ${y - 200} L${x + 110} ${y - 96}" stroke="#b47a48" stroke-width="4"/><path d="M${x - 56} ${y - 196} V${y - 60}" stroke="${INK}" stroke-width="2.5"/><path d="M${x - 66} ${y - 62} h20 l-3 16 h-14 Z" fill="#8a8e9e" ${O(2.5)}/><rect x="${x + 98}" y="${y - 108}" width="22" height="22" rx="4" fill="#8a8696" ${O(2.5)}/>`;
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [92, 104, 112, 112, 120][lv - 1], ph = f.wall - (lv <= 1 ? 30 : 0);
      let g = '';

      for (const [a, b] of [[x0, cx - ow / 2 - 26], [cx + ow / 2 + 26, x1]]) if (b - a > 12) { let st = '', wt = ''; for (let x = a + 6; x < b; x += 18) st += `M${x} ${B} V${B - 96}`; for (let y = B - 86; y < B - 10; y += 14) wt += `M${a} ${y} Q${(a + b) / 2} ${y - 6} ${b} ${y}`; g += `<path d="${st}" stroke="${INK}" stroke-width="7"/><path d="${st}" stroke="#8a5a32" stroke-width="4"/><path d="${wt}" stroke="#c8a06a" stroke-width="5" fill="none"/>`; }
      if (lv >= 3) for (const sx of lv >= 4 ? [x0 + 30, x1 - 30] : [x1 - 30]) {
        const t = B - f.wall * 0.95;
        g += `<path d="M${f1(sx - 26)} ${B} L${f1(sx - 18)} ${f1(t)} M${f1(sx + 26)} ${B} L${f1(sx + 18)} ${f1(t)} M${f1(sx - 24)} ${f1(B - 40)} L${f1(sx + 20)} ${f1(t + 40)} M${f1(sx + 24)} ${f1(B - 40)} L${f1(sx - 20)} ${f1(t + 40)}" stroke="${INK}" stroke-width="8"/><path d="M${f1(sx - 26)} ${B} L${f1(sx - 18)} ${f1(t)} M${f1(sx + 26)} ${B} L${f1(sx + 18)} ${f1(t)}" stroke="#8a5a32" stroke-width="4"/>`
          + `<rect x="${f1(sx - 30)}" y="${f1(t - 30)}" width="60" height="32" fill="#b47a48" ${O(3)}/>` + k.roof(sx - 30, sx + 30, t - 30, 40, lv >= 4 ? 'shingle' : 'thatch', lv >= 4 ? '#b5533c' : undefined) + (lv >= 4 ? k.pennant(sx, t - 74, BLUE) : '');
      }
      for (const px of [cx - ow / 2 - 13, cx + ow / 2 + 13]) g += `<rect x="${f1(px - 13)}" y="${f1(B - ph)}" width="26" height="${f1(ph)}" fill="${WHITE}" ${O(4)}/><path d="M${f1(px - 13)} ${f1(B - ph + 20)} h26 M${f1(px - 13)} ${f1(B - ph + 44)} h26 M${f1(px - 13)} ${f1(B - ph + 68)} h26" stroke="${BLUE}" stroke-width="6"/>` + sunflower(k, px, B - ph, 0.5);
      if (lv >= 2) for (const s of [-1, 1]) { const a = cx + (s < 0 ? -ow / 2 : 2), w2 = ow / 2 - 2; let wt = ''; for (let y = B - ph + 54; y < B - 6; y += 13) wt += `M${f1(a)} ${y} q${f1(w2 / 2)} -5 ${f1(w2)} 0`; g += `<rect x="${f1(a)}" y="${f1(B - ph + 46)}" width="${f1(w2)}" height="${f1(ph - 46)}" fill="#8a5a32" ${O(3)}/><path d="${wt}" stroke="#c8a06a" stroke-width="4" fill="none"/>`; }
      const nm = L.name.toUpperCase(), by = B - ph - (lv >= 2 ? 8 : -6), bw = Math.max(ow + 70, nm.length * 15 + 40);
      if (lv >= 2) g += hip(k, cx - ow / 2 - 30, cx + ow / 2 + 30, by - 12, 34 + lv * 5, lv);
      if (lv >= 5) { g += `<path d="M${f1(cx - ow / 2 - 26)} ${f1(by - 12)} Q${f1(cx)} ${f1(by - 130)} ${f1(cx + ow / 2 + 26)} ${f1(by - 12)}" fill="none" stroke="${INK}" stroke-width="14"/><path d="M${f1(cx - ow / 2 - 26)} ${f1(by - 12)} Q${f1(cx)} ${f1(by - 130)} ${f1(cx + ow / 2 + 26)} ${f1(by - 12)}" fill="none" stroke="${k.GOLD}" stroke-width="8"/>`; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<path d="M${f1(cx + Math.cos(a) * 22)} ${f1(by - 96 + Math.sin(a) * 22)} L${f1(cx + Math.cos(a) * 34)} ${f1(by - 96 + Math.sin(a) * 34)}" stroke="${k.GOLD}" stroke-width="5"/>`; } g += `<circle cx="${f1(cx)}" cy="${f1(by - 96)}" r="18" fill="${SUN}" ${O(3)}/>`; }
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(by - 2)}" width="${f1(bw)}" height="30" rx="6" fill="${BLUED}" ${O(3.5)}/>` + k.txt(cx, by + 21, nm, 17, '#f3efd8');
      k.signAt([cx - bw / 2 - 4, by - 6, cx + bw / 2 + 4, by + 32]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = hataB(k, f, 'hall', { sign: 'РАТУША', signBg: '#7a1a2a', door: lv < 3 });
      let g = h.g;
      if (lv >= 3) {
        const tw = 86 + lv * 8, th = 50 + lv * 10, t = h.top - h.rh * 0.6, tx0 = h.cx - tw / 2;
        g += hataWall(k, tx0, tx0 + tw, t - th, t + 10, lv) + hip(k, tx0, tx0 + tw, t - th, 40 + lv * 6, lv) + win(k, h.cx - 16, t - th + 14, 32, 34, lv);
        g += k.bigDoor(h.cx, h.B, Math.min(lv, 4), BLUED, 1);
      }

      const bx = f.x1 - 6, bt = h.B - f.wall - 40;
      g += `<path d="M${f1(bx - 20)} ${h.B} V${f1(bt)} M${f1(bx + 20)} ${h.B} V${f1(bt)}" stroke="${INK}" stroke-width="8"/><path d="M${f1(bx - 28)} ${f1(bt)} L${f1(bx)} ${f1(bt - 24)} L${f1(bx + 28)} ${f1(bt)} Z" fill="#e0b456" ${O(3)}/><path d="M${f1(bx - 12)} ${f1(bt + 34)} q12 -6 24 0 l4 26 h-32 Z" fill="${lv >= 5 ? k.GOLD : '#d8a84a'}" ${O(3)}/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = hataB(k, f, 'trainer', { sign: 'ТРЕНЕР', signBg: '#8a2a1a' });
      let g = h.g + `<g transform="translate(${f1(h.cx)} ${f1(h.top - h.rh * 0.5)}) scale(${0.45 + lv * 0.05})"><path d="M-44 -34 Q0 10 40 40 M44 -34 Q0 10 -40 40" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-44 -34 Q0 10 40 40 M44 -34 Q0 10 -40 40" stroke="${lv >= 5 ? k.GOLD : '#c9ccd6'}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;

      if (lv >= 2) for (const sx of [f.x0 - 20, f.x1 + 20]) g += `<path d="M${f1(sx)} ${h.B} V${f1(h.B - 70)} M${f1(sx - 10)} ${f1(h.B - 70)} l10 10 l10 -10" stroke="${INK}" stroke-width="6" fill="none"/><path d="M${f1(sx - 18)} ${f1(h.B - 64)} q18 -40 36 -70" stroke="#6a9a3e" stroke-width="4" fill="none"/>`;
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${WHITE}" ${O(3.5)}/><path d="M${f1(px - 8)} ${f1(top + 30)} h16 M${f1(px - 8)} ${f1(top + 60)} h16" stroke="${BLUE}" stroke-width="5"/>`;
      const by0 = top + 22, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="8" fill="#c8a06a" ${O(4)}/><rect x="${f1(x0 + 14)}" y="${f1(by0 + 8)}" width="${f1(w - 28)}" height="${f1(by1 - by0 - 16)}" rx="5" fill="none" stroke="${BLUE}" stroke-width="4"/>`;
      const n = 2 + Math.min(3, lv);
      for (let i = 0; i < n; i++) { const nx = x0 + 22 + (i % 3) * (w - 40) / 3, ny = by0 + 16 + Math.floor(i / 3) * 58, nw = Math.min(56, (w - 50) / 3); g += `<g transform="rotate(${(i * 7) % 9 - 4} ${f1(nx)} ${f1(ny)})"><rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.9)}" fill="${i % 2 ? '#fff3c8' : '#f3efd8'}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/><circle cx="${f1(nx + nw / 2)}" cy="${f1(ny + 4)}" r="4" fill="${BLUE}"/></g>`; }
      g += hip(k, x0 - 6, x1 + 6, top, Math.min(f.up - 30, 36 + lv * 9), lv);
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, BLUED);
      g += `<path d="M${f1(x1 - 20)} ${f1(by0 - 4)} l-8 -26 M${f1(x1 - 16)} ${f1(by0 - 4)} l0 -30 M${f1(x1 - 12)} ${f1(by0 - 4)} l8 -26" stroke="#e0b456" stroke-width="4" stroke-linecap="round"/>`;
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const bin = (bx, bw, bh, door) => {
        const t = B - bh; let wt = ''; for (let y = t + 10; y < B - 14; y += 12) wt += `M${f1(bx - bw / 2 + 4)} ${y} Q${f1(bx)} ${y + 6} ${f1(bx + bw / 2 - 4)} ${y}`;
        let s = `<ellipse cx="${f1(bx)}" cy="${B - 4}" rx="${f1(bw / 2 + 10)}" ry="12" fill="#a29c8e" ${O(3)}/><path d="M${f1(bx - bw / 2)} ${B - 8} V${f1(t)} Q${f1(bx)} ${f1(t + 14)} ${f1(bx + bw / 2)} ${f1(t)} V${B - 8} Q${f1(bx)} ${B + 4} ${f1(bx - bw / 2)} ${B - 8} Z" fill="#c8a06a" ${O()}/><path d="${wt}" stroke="#8a6a3a" stroke-width="3" fill="none"/>`;
        s += `<path d="M${f1(bx - bw / 2 - 18)} ${f1(t + 6)} Q${f1(bx)} ${f1(t + 22)} ${f1(bx + bw / 2 + 18)} ${f1(t + 6)} L${f1(bx)} ${f1(t - bh * 0.7)} Z" fill="${lv >= 4 ? '#b5533c' : '#e0b456'}" ${O()}/><path d="M${f1(bx - bw / 4)} ${f1(t - bh * 0.2)} L${f1(bx)} ${f1(t - bh * 0.7)} L${f1(bx + bw / 4)} ${f1(t - bh * 0.2)}" stroke="${lv >= 4 ? '#7a2e22' : '#a8832e'}" stroke-width="4" fill="none"/>`;
        s += lv >= 5 ? k.orb(bx, t - bh * 0.7 - 10, 7) : `<path d="M${f1(bx)} ${f1(t - bh * 0.7)} v-16" stroke="${INK}" stroke-width="4"/>`;
        if (door) s += k.door(bx, B - 6, 40 + lv * 3, 60 + lv * 5, BLUED);
        return s;
      };
      let g = '';
      if (lv >= 3) g += bin(x0 + w * 0.2, w * 0.36, f.wall * 0.7, false);
      g += bin(lv >= 3 ? cx + w * 0.12 : cx, lv >= 3 ? w * 0.6 : w * 0.8, f.wall, true);
      k.signId('storage'); g += k.signLv(lv >= 3 ? cx + w * 0.12 : cx, B - f.wall * 0.55, Math.min(w - 20, 130), 'СКЛАД', lv, 19, '#6a4a1e');
      if (lv >= 2) g += `<path d="M${f1(x1 - 16)} ${B} l-10 -60 M${f1(x1 - 4)} ${B} l-4 -64" stroke="#e0b456" stroke-width="5"/>`;
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 46, chh = [100, 120, 140, 160, 180][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 28 + lv * 4, chh + 30, Math.max(2, lv), '#b5533c');
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = hataB(k, f, 'forge', { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, chimney: false, noWin: true, flowers: false });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B - 16} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B - 16} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 40)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 36)}" rx="${f1(mw * 0.2)}" ry="${f1(mw * 0.15)}" fill="#ffd76a"/>`;
      g += `<path d="M${f1(cx - 14)} ${f1(h.top + 26)} V${f1(h.top + 16)} A14 14 0 0 1 ${f1(cx + 14)} ${f1(h.top + 16)} V${f1(h.top + 26)}" fill="none" stroke="${lv >= 5 ? k.GOLD : '#8a8e9e'}" stroke-width="7" stroke-linecap="round"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const cone = (a, b, t, h, n, gold) => {
        const m = (a + b) / 2, sw = (b - a) / n; let s = '';
        for (let i = 0; i < n; i++) s += `<path d="M${f1(a + i * sw)} ${B} L${f1(a + i * sw + 4)} ${f1(t)} L${f1(a + (i + 1) * sw - 4)} ${f1(t)} L${f1(a + (i + 1) * sw)} ${B} Z" fill="${i % 2 ? BLUE : SUN}" ${O(3.5)}/>`;
        s += `<path d="M${f1(a - 16)} ${f1(t + 6)} L${f1(m)} ${f1(t - h)} L${f1(b + 16)} ${f1(t + 6)} Z" fill="${BLUE}" ${O()}/>`;
        for (let i = 1; i < 6; i++) s += `<path d="M${f1(m)} ${f1(t - h)} L${f1(a - 16 + (b - a + 32) * i / 6)} ${f1(t + 4)}" stroke="${SUN}" stroke-width="6"/>`;
        let fr = ''; for (let x = a - 14; x < b + 14; x += 10) fr += `M${f1(x)} ${f1(t + 6)} v12`; s += `<path d="${fr}" stroke="${SUN}" stroke-width="3"/>`;
        return s + `<path d="M${f1(m)} ${f1(t - h)} V${f1(t - h - 24)}" stroke="${INK}" stroke-width="5"/>` + (gold ? k.orb(m, t - h - 30, 8) : k.pennant(m, t - h - 24, SUN));
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.28); g += cone(x0, x0 + sw, top + 50, 70, 2, lv >= 5) + cone(x1 - sw, x1, top + 50, 70, 2, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.2 : x0, b = lv >= 4 ? x1 - w * 0.2 : x1;
      g += cone(a, b, top, Math.min(f.up - 30, 60 + lv * 22), lv >= 3 ? 6 : 4, lv >= 5);
      g += `<path d="M${f1(cx - 30)} ${B} L${f1(cx - 4)} ${f1(B - 90 - lv * 6)} L${f1(cx + 4)} ${f1(B - 90 - lv * 6)} L${f1(cx + 30)} ${B} Z" fill="#1a2440" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 36, Math.min(b - a - 20, 150), 'ШАТЁР', lv, 20, BLUED);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795;
      const h = hataB(k, f, 'shop', { sign: 'ЛАВКА', signBg: '#2f5a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ay = h.B - Math.min(110, f.wall * 0.7), ax0 = x0 - 8, ax1 = x1 - 80;
      for (let i = 0, n = Math.max(3, Math.round((ax1 - ax0) / 34)); i < n; i++) { const xa = ax0 + (ax1 - ax0) * i / n, xb = ax0 + (ax1 - ax0) * (i + 1) / n; g += `<path d="M${f1(xa)} ${f1(ay)} H${f1(xb)} L${f1(xb + 4)} ${f1(ay + 30)} Q${f1((xa + xb) / 2 + 2)} ${f1(ay + 40)} ${f1(xa + 4)} ${f1(ay + 30)} Z" fill="${i % 2 ? WHITE : BLUE}" ${O(2.5)}/>`; }
      g += `<rect x="${f1(ax0 + 8)}" y="${h.B - 50}" width="${f1(ax1 - ax0 - 8)}" height="50" fill="#a87a4a" ${O(3.5)}/>`;
      for (let i = 0; i < 3 + Math.min(2, lv); i++) { const bx = ax0 + 26 + i * Math.min(38, (ax1 - ax0 - 40) / 4); g += i % 2 ? `<circle cx="${f1(bx)}" cy="${h.B - 60}" r="12" fill="#d8a050" ${O(2.5)}/><circle cx="${f1(bx)}" cy="${h.B - 60}" r="5" fill="#a87a4a"/>` : `<path d="M${f1(bx - 14)} ${h.B - 50} q-2 -26 14 -30 q16 4 14 30 Z" fill="#f3efd8" ${O(2.5)}/><path d="M${f1(bx - 6)} ${h.B - 72} l12 0" stroke="${INK}" stroke-width="2"/>`; }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<path d="M${f1(x0 - 6)} ${B} L${f1(x0 + w * 0.12)} ${f1(top)} H${f1(x1 - w * 0.12)} L${f1(x1 + 6)} ${B} Z" fill="${lv <= 1 ? '#d8c8a8' : WHITE}" ${O()}/>`;
      g += `<path d="M${f1(x0 + w * 0.12 - 14)} ${f1(top + 4)} L${f1(cx)} ${f1(top - Math.min(f.up - 40, 80 + lv * 10))} L${f1(x1 - w * 0.12 + 14)} ${f1(top + 4)} Z" fill="#3a2a6a" ${O()}/>`;
      const hy = top + 30, L = Math.min(110, 60 + lv * 10);
      for (let i = 0; i < 4; i++) { const a = (35 + i * 90) * Math.PI / 180, ex = cx + Math.cos(a) * L, ey = hy + Math.sin(a) * L; g += `<path d="M${f1(cx)} ${f1(hy)} L${f1(ex)} ${f1(ey)}" stroke="${INK}" stroke-width="7"/><path d="M${f1(cx)} ${f1(hy)} L${f1(ex)} ${f1(ey)}" stroke="#4a3a7a" stroke-width="3"/><path d="M${f1(ex)} ${f1(ey - 8)} l3 6 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="${lv >= 5 ? k.GOLD : SUN}" ${O(1.5)}/>`; }
      g += `<circle cx="${f1(cx)}" cy="${f1(hy)}" r="9" fill="#ffd76a" ${O(3)}/>` + win(k, cx - 15, top + 80, 30, 36, lv) + (f.wall > 220 ? win(k, cx - 15, top + 150, 30, 36, lv) : '');
      g += k.door(cx, B, 40 + lv * 3, 66 + lv * 4, '#3a2a5a');
      k.signId('magic'); g += k.signLv(cx, B - 120, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a2a6a');
      return g;
    },
  };

  const art = {
    K: { leaf: ['#6a9a3e', '#82b450', '#5a8a36'], grass: '#a6bc6a', grass2: '#8ea65a', roofC: '#e0b456', plaster: WHITE },

    back(k) {
      const { P, L } = k, x = (L.hx.hill || {}).x || 2300;
      let g = `<path d="M${x - 900} 670 Q${x - 400} 420 ${x} 430 Q${x + 420} 420 ${x + 900} 670 Z" fill="#8aa866"/><path d="M${x - 640} 670 Q${x - 300} 500 ${x} 500 Q${x + 300} 498 ${x + 640} 670 Z" fill="#9ab872"/>`;
      g += windmill(k, x - 360, 520, 0.9, 10) + windmill(k, x, 452, 1.05, 32) + windmill(k, x + 380, 528, 0.85, 60);
      for (const [dx, y, s] of [[-560, 600, 0.7], [-190, 520, 0.6], [190, 516, 0.6], [560, 604, 0.7]]) g += ashTree(k, x + dx, y, s);
      P(x - 900, x + 900, g);
    },
    decor(k) { (k.L.hx.backHouses || []).forEach(([a, b], i) => k.P(a, b, backHut(k, a, b, i))); },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + sunflower(k, lot.x0 + 10, 800, 0.7);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const g0 = hut(k, x0, x1, 795, 92 + (c.v % 26), c.v);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(270 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1;
      if (p.k === 'windmill') return { g: k.ell(x, y + 4, 90, 18) + windmill(k, x, y, 1.25 * s, 24), w: 340, h: 360 };
      if (p.k === 'ashT') return { g: k.ell(x, y, 34 * s, 9) + ashTree(k, x, y, s), w: 200 * s, h: 240 * s };
      if (p.k === 'sunfl') { let g = ''; for (let i = 0; i < 5; i++) g += sunflower(k, x - 48 + i * 24, y - (i % 2) * 6, 0.9 * s); return { g, w: 160, h: 110 }; }
      if (p.k === 'crane') return { g: crane(k, x, y), w: 260, h: 230 };
      if (p.k === 'cart') return { g: k.ell(x, y, 56, 10) + `<rect x="${x - 54}" y="${y - 62}" width="108" height="40" fill="#b47a48" ${k.O(3.5)}/><circle cx="${x - 30}" cy="${y - 14}" r="16" fill="#7a4e2a" ${k.O(3)}/><circle cx="${x + 30}" cy="${y - 14}" r="16" fill="#7a4e2a" ${k.O(3)}/><path d="M${x + 54} ${y - 42} l40 20" stroke="#7a4e2a" stroke-width="6"/><path d="M${x - 48} ${y - 62} q14 -28 30 -6 q14 -26 30 -2 q14 -24 30 4 Z" fill="#f3efd8" ${k.O(3)}/>`, w: 200, h: 110 };
      return null;
    },
  };

  function hut(k, x0, x1, B, h, v) {
    const { f1, O, INK } = k, w = x1 - x0, cx = (x0 + x1) / 2, top = B - h;
    let g = hataWall(k, x0, x1, top, B, 2) + hip(k, x0, x1, top, 66 + (v % 20), v % 4 === 0 ? 4 : 2);
    const dx = v % 2 ? x1 - 42 : x0 + 42;
    g += win(k, v % 2 ? x0 + 28 : x1 - 62, top + 24, 32, 36, 2) + k.door(dx, B - 14, 38, 58, BLUED);
    if (v % 3 === 1) { let t = ''; for (let x = x1 + 8; x < x1 + 70; x += 14) t += `M${x} ${B} V${B - 48}`; g += `<path d="${t}" stroke="${INK}" stroke-width="6"/><path d="${t}" stroke="#8a5a32" stroke-width="3"/><path d="M${x1 + 6} ${B - 36} H${x1 + 72} M${x1 + 6} ${B - 18} H${x1 + 72}" stroke="#c8a06a" stroke-width="4"/>` + [0, 1, 2].map((i) => `<path d="M${x1 + 14 + i * 22} ${B - 62} q-10 0 -10 10 q0 10 10 10 q10 0 10 -10 q0 -10 -10 -10 Z" fill="#b5533c" ${O(2)}/>`).join(''); }
    if (v % 3 === 2) g += sunRow(k, x0 - 50, x0 - 6, B);
    return g;
  }

  function backHut(k, a, b, i) {
    const w = b - a;
    if (w < 150) return ashTree(k, (a + b) / 2, 792, 0.85);
    if (i % 3 === 1) return `<path d="M${a + 20} 795 Q${a + 30} 700 ${(a + b) / 2} 690 Q${b - 30} 700 ${b - 20} 795 Z" fill="#e0b456" ${k.O(3.5)}/><path d="M${a + 40} 760 q${(w - 80) / 2} -14 ${w - 80} 0 M${a + 54} 726 q${(w - 108) / 2} -12 ${w - 108} 0" stroke="#a8832e" stroke-width="3" fill="none"/>` + ashTree(k, b - 20, 796, 0.7);
    const x1 = Math.min(b - 10, a + 170 + (i * 37) % 60);
    let g = hut(k, a + 10, x1, 792, 90 + (i * 13) % 24, i * 5 + 1);
    if (b - x1 > 90) g += ashTree(k, (x1 + b) / 2, 794, 0.8);
    return g;
  }

  return {
    id: 'd141', ver: 1, name: 'Ясенище', layout, art,
    story: 'Деревня мельников в Доле Ветров: ветер здесь не стихает, на холме машут крыльями три ветряка, а посреди площади стоит самый большой. Белёные мазанки под соломой, синие ставни, подсолнухи и ясени.',
  };
});
