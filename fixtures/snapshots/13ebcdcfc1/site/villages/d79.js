



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const BAS = '#3a3640', BASL = '#55505c', BASD = '#26232a', HIDE = '#c8683a', HIDED = '#8a3e1e', BONE = '#e8dcc4', EMB = '#ff7a2a', OBS = '#1a1422';
  const STAIRS = [1600, 3200], CLIFF = [1180, 1240];
  const KINDS = { beastskull: { foot: [130, 30], tall: 300 }, spears: { foot: [24, 8], tall: 140 }, hiderack: { foot: [50, 10], tall: 130 }, bonepile: { foot: [36, 10], tall: 40 }, horns: { foot: [18, 8], tall: 120 } };

  function layout() {
    const water = [], xs = [1080, ...STAIRS.flatMap((x) => [x - 44, x + 44]), 3900];
    for (let i = 0; i < xs.length; i += 2) water.push({ k: 'cliff', b: [xs[i], CLIFF[0], xs[i + 1], CLIFF[1]], art: 1 });
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1270, x1: 1570 },
        storage: { x0: 2880, x1: 3160 },
        magic: { x0: 3230, x1: 3460 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 2000, x1: 2280, B: 1072 },
        tent: { x0: 3560, x1: 3910, B: 1072 },
        trainer: { x0: 2500, x1: 2780, B: 1322 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'ledge', w: 34, pts: [[960, 908], [1000, 1040], [1100, 1132], [2400, 1134], [3900, 1132], [3990, 1040], [3990, 908]] },
        ...STAIRS.map((x) => ({ k: 'stair', w: 32, pts: [[x, 1132], [x, 1384]] })),
        { k: 'ledge', w: 34, pts: [[1600, 1384], [1734, 1380]] },
        { k: 'ledge', w: 34, pts: [[2166, 1380], [2700, 1386], [3200, 1384]] },
      ],
      plazas: [{ k: 'central', x: 1950, y: 1370, rx: 220, ry: 80, mark: 'beastskull', ms: 1 }],
      water,
      kinds: KINDS,
      props: [['spears', 1300, 1060], ['hiderack', 2440, 1060], ['horns', 1460, 1300], ['bonepile', 3400, 1300], ['hiderack', 3500, 1420], ['spears', 2380, 1300]],
      houses: [{ x0: 200, x1: 410, base: 1450 }, { x0: 600, x1: 810, base: 1446 }, { x0: 1100, x1: 1310, base: 1452 }, { x0: 3960, x1: 4170, base: 1450 }],
      fill: [{ k: ['rock', 'deadtree', 'bonepile', 'rubble', 'horns'], n: 22, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'bonepile'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1610, 1830], [1880, 2100], [2150, 2400], [2440, 2840], [3500, 3720], [3770, 4000]], stairs: STAIRS, cliff: CLIFF },
    };
  }

   
  const skull = (k, x, y, s, gold) => k.use(k.sym(gold ? 'd79skG' : 'd79sk', () => { const { O } = k; const c = gold ? k.GOLD : BONE; return `<path d="M-14 -6 Q-34 -14 -40 -36 Q-26 -24 -16 -20 M14 -6 Q34 -14 40 -36 Q26 -24 16 -20" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-16 -16 Q0 -26 16 -16 L12 10 Q0 22 -12 10 Z" fill="${c}" ${O(2.5)}/><circle cx="-7" cy="-6" r="4" fill="${EMB}"/><circle cx="7" cy="-6" r="4" fill="${EMB}"/><path d="M-5 10 v5 M0 11 v5 M5 10 v5" stroke="#3a2a2a" stroke-width="2"/>`; }), x, y, s);
  const lizard = (k, x0, y0, w, h) => k.use(k.sym('d79hide', () => { let g = `<rect width="100" height="100" fill="${HIDE}"/>`; for (let i = 0; i < 14; i++) g += `<ellipse cx="${(i * 37) % 100}" cy="${(i * 53) % 100}" rx="${6 + (i % 3) * 2}" ry="${4 + (i % 2) * 2}" fill="${HIDED}"/>`; return g; }), x0, y0, w / 100, h / 100);

  const columns = (k, x0, top, w, B) => { const { f1, O } = k; const cid = k.clipId(`d79c${f1(x0)}${f1(top)}${f1(w)}`); let d = ''; for (let x = x0; x < x0 + w; x += 22) d += `M${f1(x)} ${f1(top)} V${f1(B)}`; let n = ''; for (let x = x0 + 11; x < x0 + w; x += 22) for (let y = top + 20 + ((x * 7) % 30); y < B - 10; y += 46) n += `M${f1(x - 10)} ${f1(y)} l10 -6 l10 6`; return `<clipPath id="${cid}"><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}"/></clipPath><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}" fill="${BAS}"/><g clip-path="url(#${cid})"><path d="${d}" stroke="${BASD}" stroke-width="3"/><path d="${n}" stroke="${BASL}" stroke-width="2.5" fill="none"/></g><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}" fill="none" ${O()}/>`; };

  function hideRoof(k, x0, x1, top, h, lv) {
    const { f1, O, INK } = k, cx = (x0 + x1) / 2, e = 24, cid = k.clipId(`d79r${f1(x0)}${f1(top)}`);
    const d = `M${f1(x0 - e)} ${f1(top + 8)} Q${f1(cx - (x1 - x0) * 0.2)} ${f1(top - h * 0.8)} ${f1(cx)} ${f1(top - h)} Q${f1(cx + (x1 - x0) * 0.2)} ${f1(top - h * 0.8)} ${f1(x1 + e)} ${f1(top + 8)} Z`;
    let g = `<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">${lizard(k, x0 - e, top - h, x1 - x0 + 2 * e, h + 10)}</g><path d="${d}" fill="none" ${O()}/>`;
    g += `<path d="M${f1(cx)} ${f1(top - h)} L${f1(x0 - e + 10)} ${f1(top + 8)} M${f1(cx)} ${f1(top - h)} L${f1(x1 + e - 10)} ${f1(top + 8)}" stroke="${BONE}" stroke-width="6"/><path d="M${f1(cx - 8)} ${f1(top - h - 2)} l-10 -20 M${f1(cx + 8)} ${f1(top - h - 2)} l10 -20" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${f1(cx - 8)} ${f1(top - h - 2)} l-10 -20 M${f1(cx + 8)} ${f1(top - h - 2)} l10 -20" stroke="${BONE}" stroke-width="4" stroke-linecap="round"/>`;
    if (lv >= 4) g += skull(k, cx, top - h * 0.45, 0.8 + lv * 0.05, lv >= 5);
    return g;
  }
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return `<rect x="${f1(x - 5)}" y="${f1(y - 5)}" width="${f1(w + 10)}" height="${f1(h + 10)}" fill="${BASD}" ${O(2.5)}/>` + k.winLit(x, y, w, h, true) + (lv >= 3 ? `<path d="M${f1(x - 8)} ${f1(y - 8)} h${f1(w + 16)}" stroke="${BONE}" stroke-width="5"/>` : '');
  }

  function basaltHouse(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([64, 78, 90, 100, 108][lv - 1], f.up - 14, w * 0.48));
    let g = columns(k, x0, top, w, B) + hideRoof(k, x0, x1, top, rh, lv);
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [28, 34, 38, 42, 46][lv - 1], wy = top + Math.max(18, (f.wall - wh) * 0.34);
    if (!o.noWin) for (const x of [x0 + 20, x1 - 20 - ww]) if (Math.abs(x + ww / 2 - cx) > 56 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) { g += k.bigDoor(cx, B, lv, '#2a1e1a', 0.92); if (lv >= 2) g += skull(k, cx, B - [0, 104, 112, 118, 124][lv - 1] - 14, 0.75); }
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || '#2a1e1a');
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }
  const spear = (k, x, B, h, gold) => `<path d="M${x} ${B} V${B - h}" stroke="${k.INK}" stroke-width="6"/><path d="M${x} ${B} V${B - h}" stroke="#8a6a44" stroke-width="3"/><path d="M${x - 6} ${B - h} l6 -22 l6 22 Z" fill="${gold ? k.GOLD : OBS}" ${k.O(1.5)}/><path d="M${x - 5} ${B - h + 8} h10" stroke="${HIDE}" stroke-width="4"/>`;

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) { let d = ''; for (let x = a + 8; x < b; x += 16) d += `M${f1(x)} ${B} V${B - 60 - ((x * 7) % 12)}`; g += `<path d="${d}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${d}" stroke="${BONE}" stroke-width="5" stroke-linecap="round"/><path d="M${f1(a)} ${B - 36} H${f1(b)}" stroke="#6a4a30" stroke-width="5"/>`; }
      if (lv >= 3) { const sx = x0 + 28, t = B - f.wall; g += columns(k, sx - 18, t + 20, 36, B) + skull(k, sx, t + 6, 0.9, lv >= 5); }
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += columns(k, px - 16, B - ph, 32, B); }
      const by = B - ph;
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += `<path d="M${f1(px)} ${f1(by + 4)} Q${f1(px - s * 10)} ${f1(by - 70 - lv * 6)} ${f1(cx + s * 6)} ${f1(by - 60 - lv * 8)}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${f1(px)} ${f1(by + 4)} Q${f1(px - s * 10)} ${f1(by - 70 - lv * 6)} ${f1(cx + s * 6)} ${f1(by - 60 - lv * 8)}" stroke="${lv >= 5 ? k.GOLD : BONE}" stroke-width="14" fill="none" stroke-linecap="round"/>`; }
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 20;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${HIDED}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, BONE);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = basaltHouse(k, f, { sign: 'РАТУША', signBg: '#5a1a14' });
      let g = h.g + skull(k, h.cx, h.top - h.rh * 0.45, 1 + lv * 0.08, lv >= 5);
      if (lv >= 2) for (const sx of [f.x0 - 22, f.x1 + 22]) g += `<path d="M${f1(sx)} ${h.B} V${f1(h.B - 150 - lv * 8)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${f1(h.B - 146 - lv * 8)} h${sx < h.cx ? -1 : 1}0" stroke="none"/><path d="M${f1(sx)} ${f1(h.B - 146 - lv * 8)} h${sx < h.cx ? -34 : 34} l${sx < h.cx ? 6 : -6} 30 l${sx < h.cx ? -6 : 6} 30 h${sx < h.cx ? 34 : -34} Z" fill="${HIDE}" ${O(2.5)}/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = basaltHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14' });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) g += spear(k, f.x1 + 14 + i * 12, h.B, 120, lv >= 5 && i === 0);
      if (lv >= 2) { const bx = f.x0 - 42; g += `<path d="M${f1(bx - 34)} ${h.B} V${h.B - 120} M${f1(bx + 34)} ${h.B} V${h.B - 120} M${f1(bx - 40)} ${h.B - 116} h80" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` + lizard(k, bx - 28, h.B - 110, 56, 70) + `<path d="M${f1(bx - 18)} ${h.B - 74} q18 -14 36 0 q-18 14 -36 0 Z M${f1(bx + 18)} ${h.B - 74} l12 10" fill="${BASD}" stroke="${BASD}" stroke-width="3"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = columns(k, x0 + 6, top + 10, w - 12, B - 40) + `<rect x="${f1(x0)}" y="${B - 40}" width="${f1(w)}" height="40" fill="${BASD}" ${O(3)}/>`;
      let d = ''; for (let i = 0; i < 6 + lv * 2; i++) d += `M${f1(x0 + 16 + i * 10)} ${f1(top + 18)} v14`; g += `<path d="${d}" stroke="${EMB}" stroke-width="2.5"/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 22 + (i % 3) * (w - 44) / 3, ny = top + 44 + Math.floor(i / 3) * 52, nw = Math.min(50, (w - 56) / 3); g += `<g transform="rotate(${(i * 11) % 9 - 4} ${f1(nx)} ${f1(ny)})"><path d="M${f1(nx)} ${f1(ny)} h${f1(nw)} l-4 ${f1(nw * 0.9)} h${f1(-nw + 8)} Z" fill="#e0c8a0" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 14)} h${f1(nw - 14)} M${f1(nx + 6)} ${f1(ny + 26)} h${f1(nw - 20)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/></g>`; }
      if (lv >= 3) g += skull(k, cx, top - 6, 0.8, lv >= 5);
      k.signId('board'); g += k.signLv(cx, B - 20, Math.min(w - 10, 140), 'ДОСКА', lv, 20, '#2a1e1a');
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = columns(k, x0, top + 20, w, B) + hideRoof(k, x0, x1, top + 20, Math.min(f.up - 10, 56 + lv * 10), lv);
      g += k.door(cx, B, 50 + lv * 3, Math.min(f.wall * 0.5, 64 + lv * 4), '#2a1e1a');
      const rx = x1 + 8, rows = lv >= 4 ? 2 : 1;
      for (let r = 0; r < rows; r++) { const yy = B - 110 - r * 50; g += `<path d="M${f1(rx)} ${B} V${f1(yy - 10)} M${f1(rx - 4)} ${f1(yy)} H${f1(rx + 70)}" stroke="${INK}" stroke-width="5"/>`; for (let i = 0; i < 2; i++) g += `<path d="M${f1(rx + 16 + i * 30)} ${f1(yy)} v6" stroke="${INK}" stroke-width="2"/><path d="M${f1(rx + 8 + i * 30)} ${f1(yy + 6)} q8 -4 16 0 l-2 26 q-6 8 -12 0 Z" fill="${lv >= 5 && i === 0 && r === 0 ? k.GOLD : '#a84a2a'}" ${O(2)}/>`; }
      g += `<path d="M${f1(x0 - 4)} ${f1(top + 4)} v-20" stroke="${BASD}" stroke-width="16"/><circle cx="${f1(x0 + 4)}" cy="${f1(top - 26)}" r="12" fill="#a8a4b0" opacity=".4"/>`;
      k.signId('storage'); g += k.signLv(cx, top + 50, Math.min(w - 10, 130), 'СКЛАД', lv, 19, '#2a1e1a');
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [90, 110, 130, 150, 170][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), BASL);
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(chx + i * 14)}" cy="${f1(f.B - f.wall - chh - 26 - i * 30)}" r="${12 + i * 6}" fill="#8a8698" opacity="${(0.4 - i * 0.1).toFixed(2)}"/>`;
      const h = basaltHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="${EMB}"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(mx + mw + 30 + i * 26)} ${f1(h.B - 70)} l8 -30 l8 30 Z" fill="${OBS}" ${O(1.8)}/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h, cid = k.clipId(`d79t${f1(a)}${f1(h)}`), d = `M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z`;
        let s = `<path d="M${f1(m - 10)} ${f1(t - 26)} L${f1(m + 24)} ${f1(t + 30)} M${f1(m + 10)} ${f1(t - 26)} L${f1(m - 24)} ${f1(t + 30)}" stroke="${BONE}" stroke-width="7" stroke-linecap="round"/><clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">${lizard(k, a, t, b - a, h)}</g><path d="${d}" fill="none" ${O()}/>`;
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 30)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5);
      g += `<path d="M${f1(cx - 28)} ${B} L${f1(cx)} ${f1(B - 92 - lv * 5)} L${f1(cx + 28)} ${B} Z" fill="#1e1416" ${O(3)}/>` + skull(k, cx, top + 30, 0.9);
      k.signId('tent'); g += k.signLv(cx, top + 74, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, '#3a1a14');
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = basaltHouse(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${HIDE}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${BONE}" stroke-width="6"/>`).join('');
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 40))); i < n; i++) g += skull(k, ax0 + 24 + i * 40, ay + 50, 0.6);
      g += `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${BASD}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(3, lv + 1); i++) g += `<path d="M${f1(ax0 + 18 + i * 36)} ${h.B - 30} q8 -26 4 -40 q10 14 8 40" fill="${BONE}" ${O(2)}/>`;
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall - Math.min(f.up - 40, 40 + lv * 14);
      let g = `<path d="M${f1(x0)} ${B} L${f1(x0 + w * 0.22)} ${f1(top + 70)} L${f1(cx - 6)} ${f1(top)} L${f1(x1 - w * 0.2)} ${f1(top + 90)} L${f1(x1)} ${B} Z" fill="${OBS}" ${O()}/><path d="M${f1(cx - 6)} ${f1(top)} L${f1(cx + 10)} ${B}" stroke="#4a3a5a" stroke-width="4"/><path d="M${f1(x0 + w * 0.22)} ${f1(top + 70)} L${f1(x0 + w * 0.3)} ${B}" stroke="#3a2a4a" stroke-width="3"/>`;
      let d = ''; for (let i = 0; i < 2 + lv; i++) { const y = top + 70 + i * ((B - top - 150) / (2 + lv)), x = cx - 30 + (i % 2) * 40; d += `M${f1(x)} ${f1(y)} l6 -8 l6 8 l-6 8 Z`; } g += `<path d="${d}" fill="${EMB}"/>`;
      g += `<circle cx="${f1(cx - 6)}" cy="${f1(top + 10)}" r="30" fill="${EMB}" opacity=".2"/>` + k.door(cx, B, 40 + lv * 3, 64 + lv * 4, '#3a1a2a');
      if (lv >= 5) g += k.orb(cx - 6, top - 10, 9);
      k.signId('magic'); g += k.signLv(cx, B - 110, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#3a1a3a');
      return g;
    },
  };

  const art = {
    K: {},

    water(k) {
      const { P, L, f1, O } = k, [y0, y1] = L.hx.cliff, xs = [1080, ...L.hx.stairs.flatMap((x) => [x - 44, x + 44]), 3900];
      for (let i = 0; i < xs.length; i += 2) { const a = xs[i], b = xs[i + 1]; P(a, b, columns(k, a, y0 + 6, b - a, y1 + 6) + `<path d="M${a} ${y0 + 6} H${b}" stroke="${BASL}" stroke-width="8"/><path d="M${a} ${y1 + 6} H${b}" stroke="${BASD}" stroke-width="5"/>`, y0 - 10, y1 + 20); }
      for (const x of L.hx.stairs) { let d = ''; for (let y = y0 - 4; y < y1 + 16; y += 12) d += `M${x - 30} ${y} H${x + 30}`; P(x - 50, x + 50, `<rect x="${x - 34}" y="${y0 - 8}" width="68" height="${y1 - y0 + 26}" fill="${BASL}" ${O(3)}/><path d="${d}" stroke="${BASD}" stroke-width="3"/>`, y0 - 10, y1 + 20); }
      void f1;
    },
    back(k) {
      const { P, L } = k;
      let g = ''; for (let i = 0; i < 8; i++) { const x = 200 + i * 560; g += `<path d="M${x - 200} 724 L${x - 140} 650 H${x + 30} L${x + 60} 620 H${x + 160} L${x + 220} 724 Z" fill="#2a2430"/>`; }
      P(0, L.W, g);
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 92 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, basaltHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 24, 28, 32, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, '#2a1e1a'));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + skull(k, lot.x0 + 10, 664, 0.6);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 92 + (c.v % 20), up: 100, lv: 2 };
      const g0 = basaltHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 24, 30, 32, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, '#2a1e1a') + skull(k, c.v % 2 ? x1 - 42 : x0 + 42, 712, 0.6);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(280 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'beastskull') {

        let g = k.ell(x, y + 4, 150, 24) + `<path d="M${x - 50} ${y - 120} Q${x - 150} ${y - 150} ${x - 170} ${y - 260} Q${x - 120} ${y - 190} ${x - 70} ${y - 170} Z M${x + 50} ${y - 120} Q${x + 150} ${y - 150} ${x + 170} ${y - 260} Q${x + 120} ${y - 190} ${x + 70} ${y - 170} Z" fill="${BONE}" ${O(4)}/>`;
        g += `<path d="M${x - 90} ${y} Q${x - 110} ${y - 120} ${x - 70} ${y - 180} Q${x} ${y - 220} ${x + 70} ${y - 180} Q${x + 110} ${y - 120} ${x + 90} ${y} Z" fill="${BONE}" ${O(4.5)}/><path d="M${x - 70} ${y - 180} Q${x} ${y - 220} ${x + 70} ${y - 180} Q${x} ${y - 196} ${x - 70} ${y - 180} Z" fill="#d0c0a4"/>`;
        g += `<ellipse cx="${x - 40}" cy="${y - 120}" rx="24" ry="20" fill="#2a1a14" ${O(3)}/><ellipse cx="${x + 40}" cy="${y - 120}" rx="24" ry="20" fill="#2a1a14" ${O(3)}/><circle cx="${x - 40}" cy="${y - 118}" r="10" fill="${EMB}"/><circle cx="${x + 40}" cy="${y - 118}" r="10" fill="${EMB}"/><circle cx="${x - 40}" cy="${y - 118}" r="22" fill="${EMB}" opacity=".2"/><circle cx="${x + 40}" cy="${y - 118}" r="22" fill="${EMB}" opacity=".2"/>`;
        g += `<path d="M${x - 50} ${y} V${y - 46} Q${x} ${y - 70} ${x + 50} ${y - 46} V${y} Z" fill="#2a1a14" ${O(3)}/>`;
        let t = ''; for (let i = 0; i < 6; i++) t += `M${x - 44 + i * 17} ${y - 52 + (i === 0 || i === 5 ? 6 : 0)} l6 18 l6 -18`; g += `<path d="${t}" fill="${BONE}" stroke="${INK}" stroke-width="2"/><path d="M${x - 12} ${y - 70} l12 -16 l12 16" stroke="#c0ae90" stroke-width="4" fill="none"/>`;
        for (const sx of [-130, 130]) g += spear(k, x + sx, y, 150) + `<path d="M${x + sx} ${y - 120} q${sx > 0 ? 20 : -20} 6 ${sx > 0 ? 18 : -18} 30" stroke="${HIDE}" stroke-width="5" fill="none"/>`;
        return { g, w: 380, h: 300 };
      }
      if (p.k === 'spears') { let g = k.ell(x, y, 24, 6) + `<path d="M${x - 22} ${y - 40} h44" stroke="${INK}" stroke-width="6"/>`; for (let i = 0; i < 3; i++) g += spear(k, x - 12 + i * 12, y, 120 + (i % 2) * 14); return { g, w: 70, h: 160 }; }
      if (p.k === 'hiderack') return { g: k.ell(x, y, 50, 9) + `<path d="M${x - 46} ${y} V${y - 120} M${x + 46} ${y} V${y - 120} M${x - 52} ${y - 114} H${x + 52}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${x - 46} ${y} V${y - 120} M${x + 46} ${y} V${y - 120}" stroke="${BONE}" stroke-width="4"/>` + lizard(k, x - 36, y - 108, 72, 70) + `<path d="M${x - 36} ${y - 108} h72 v70 h-72 Z" fill="none" stroke="${INK}" stroke-width="2.5"/>`, w: 130, h: 130 };
      if (p.k === 'bonepile') return { g: k.ell(x, y, 36, 8) + `<path d="M${x - 30} ${y - 6} l50 -14 M${x - 20} ${y - 18} l44 8 M${x - 26} ${y - 8} q-6 -4 -4 -10 M${x + 20} ${y - 20} q6 -6 10 0" stroke="${BONE}" stroke-width="7" stroke-linecap="round"/>` + skull(k, x + 6, y - 14, 0.5), w: 90, h: 50, flat: true };
      if (p.k === 'horns') return { g: k.ell(x, y, 18, 5) + `<path d="M${x} ${y} V${y - 80}" stroke="${INK}" stroke-width="8"/><path d="M${x} ${y} V${y - 80}" stroke="#6a4a30" stroke-width="4"/>` + skull(k, x, y - 92, 0.9), w: 90, h: 130 };
      return null;
    },
  };

  return {
    id: 'd79', ver: 1, name: 'Гарогорье', layout, art,
    story: 'Деревня охотников на огненных зверей ступенями по чёрным базальтовым уступам: дома из столбчатого камня под пологами из шкур лавовых ящеров, над дверями - рогатые черепа. По каменным лестницам - на нижний уступ, где лежит Череп Огнезверя, добыча первых охотников.',
  };
});
