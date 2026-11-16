



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const SALT = '#f4f2ec', SALTD = '#d8d4cc', TURQ = '#3aa8a8', TURQD = '#227a7a', ROSE = '#e8b4b8', ROSED = '#c88890', STN = '#a89a8a', STND = '#7a6e62', WOOD = '#8a5a32';
  const PANS = [[1340, 1250, 1960, 1352], [2040, 1250, 2660, 1352], [3440, 1250, 3950, 1352]];
  const KINDS = { saltstone: { foot: [90, 26], tall: 300 }, saltheap: { foot: [40, 12], tall: 60 }, pillar: { foot: [30, 12], tall: 200 }, rakes: { foot: [24, 8], tall: 120 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1200 },
        hall: { x0: 1270, x1: 1570 },
        trainer: { x0: 2880, x1: 3160 },
        magic: { x0: 3230, x1: 3460 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1640, x1: 1920, B: 1140 },
        tent: { x0: 2100, x1: 2450, B: 1140 },
        storage: { x0: 3520, x1: 3800, B: 1140 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 34, pts: [[960, 908], [1000, 1100], [1100, 1200], [3990, 1200], [3990, 908]] },
        { k: 'lane', w: 34, pts: [[1300, 1400], [3990, 1400], [3990, 1200]] },
        ...[1300, 2000, 2700, 3400].map((x) => ({ k: 'path', w: 28, pts: [[x, 908], [x, 1400]] })),
      ],
      plazas: [{ k: 'central', x: 3050, y: 1300, rx: 300, ry: 66, mark: 'saltstone', ms: 1, shape: 'rect' }],
      water: PANS.map((b) => ({ k: 'saltpan', b, art: 1 })),
      kinds: KINDS,
      props: [['saltheap', 1150, 1060], ['saltheap', 3250, 1060], ['rakes', 2560, 1060], ['pillar', 400, 1220], ['pillar', 900, 1360], ['saltheap', 2900, 1060]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 480, x1: 690, base: 1446 }],
      fill: [{ k: ['rock', 'saltheap', 'pillar', 'cactus'], n: 14, box: [80, 980, 1250, 1460] }, { k: ['barrel', 'crate', 'saltheap'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1610, 1830], [1880, 2100], [2150, 2400], [2450, 2850], [3500, 3720], [3770, 4000]], pans: PANS },
    };
  }

   
  const crystal = (k, x, y, s, c = ROSE) => { const { f1, O } = k; return `<path d="M${f1(x - 8 * s)} ${f1(y)} L${f1(x - 10 * s)} ${f1(y - 24 * s)} L${f1(x - 4 * s)} ${f1(y - 34 * s)} L${f1(x + 2 * s)} ${f1(y - 24 * s)} L${f1(x)} ${f1(y)} Z M${f1(x)} ${f1(y)} L${f1(x + 4 * s)} ${f1(y - 18 * s)} L${f1(x + 10 * s)} ${f1(y - 24 * s)} L${f1(x + 12 * s)} ${f1(y - 8 * s)} L${f1(x + 8 * s)} ${f1(y)} Z" fill="${c}" ${O(2)}/>`; };
  const blocks = (k) => k.sym('d113blk', () => { let g = `<rect width="120" height="120" fill="${SALTD}"/>`; for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) g += `<rect x="${c * 30 + (r % 2 ? 15 : 0) + 1.5}" y="${r * 24 + 1.5}" width="27" height="21" rx="3" fill="${(r + c) % 5 ? SALT : '#ece8de'}"/>`; return g; });
  function saltWall(k, x0, top, w, B) {
    const { f1, O } = k, cid = k.clipId(`d113w${f1(x0)}${f1(top)}${f1(w)}`), s = Math.max(w, B - top) / 120;
    return `<clipPath id="${cid}"><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}"/></clipPath><g clip-path="url(#${cid})">${k.use(blocks(k), x0, top, s)}</g><rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(B - top)}" fill="none" ${O()}/>`;
  }
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return `<rect x="${f1(x - 6)}" y="${f1(y - 6)}" width="${f1(w + 12)}" height="${f1(h + 12)}" rx="4" fill="${TURQ}" ${O(2.5)}/>` + k.winLit(x, y, w, h, true) + (lv >= 3 ? `<path d="M${f1(x - 4)} ${f1(y + h * 0.5)} h${f1(w + 8)}" stroke="${TURQD}" stroke-width="3"/>` : '');
  }

  function saltHouse(k, f, o = {}) {
    const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    let g = saltWall(k, x0, top, w, B) + `<rect x="${f1(x0 - 8)}" y="${f1(top - 14)}" width="${f1(w + 16)}" height="16" fill="${SALT}" ${O(3)}/><path d="M${f1(x0 - 8)} ${f1(top + 2)} h${f1(w + 16)}" stroke="${TURQ}" stroke-width="4"/>`;
    for (let i = 0; i < Math.min(lv + 1, 4); i++) g += crystal(k, x0 + 14 + i * (w - 28) / Math.max(1, Math.min(lv, 3)), top - 14, 0.8 + (i % 2) * 0.3, i % 2 ? SALT : ROSE);
    if (o.dome !== false && lv >= 2) { const dr = 22 + lv * 5; g += `<path d="M${f1(cx - dr)} ${f1(top - 14)} Q${f1(cx - dr)} ${f1(top - 14 - dr * 1.4)} ${f1(cx)} ${f1(top - 14 - dr * 1.5)} Q${f1(cx + dr)} ${f1(top - 14 - dr * 1.4)} ${f1(cx + dr)} ${f1(top - 14)} Z" fill="${lv >= 5 ? k.GOLD : lv >= 4 ? ROSE : TURQ}" ${O(3)}/>`; }
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [30, 36, 40, 44, 48][lv - 1], wy = top + Math.max(20, (f.wall - wh) * 0.34);
    if (!o.noWin) for (const x of [x0 + 24, x1 - 24 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, TURQD, 0.92);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), top + 26, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || TURQD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 56, 6);
    return { g, top, cx, B };
    void INK;
  }
  const heap = (k, x, y, s = 1) => { const { f1, O } = k; return `<path d="M${f1(x - 40 * s)} ${y} Q${f1(x - 10 * s)} ${f1(y - 60 * s)} ${x} ${f1(y - 62 * s)} Q${f1(x + 10 * s)} ${f1(y - 60 * s)} ${f1(x + 40 * s)} ${y} Z" fill="${SALT}" ${O(3)}/><path d="M${f1(x - 20 * s)} ${f1(y - 20 * s)} q10 -6 20 0 M${f1(x)} ${f1(y - 40 * s)} q8 -4 14 2" stroke="${SALTD}" stroke-width="3" fill="none"/>`; };

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall - (lv <= 1 ? 26 : 0);
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) g += saltWall(k, a, B - 54, b - a, B);
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += `<path d="M${f1(px - 20)} ${B} L${f1(px - 14)} ${f1(B - ph)} H${f1(px + 14)} L${f1(px + 20)} ${B} Z" fill="${STN}" ${O(4)}/><path d="M${f1(px - 16)} ${f1(B - ph * 0.4)} h32 M${f1(px - 15)} ${f1(B - ph * 0.7)} h30" stroke="${STND}" stroke-width="3"/>` + crystal(k, px - 4, B - ph, 1.4 + lv * 0.1, lv >= 5 ? k.GOLD : ROSE) + crystal(k, px + 8, B - ph, 1, SALT); }
      const by = B - ph + 20;
      g += `<rect x="${f1(cx - ow / 2 - 4)}" y="${f1(by)}" width="${f1(ow + 8)}" height="20" fill="${SALT}" ${O(3)}/>`;
      for (let i = 0; i < 6; i++) g += `<rect x="${f1(cx - ow / 2 + 4 + i * (ow - 8) / 6)}" y="${f1(by + 4)}" width="${f1((ow - 8) / 6 - 4)}" height="12" fill="${i % 2 ? TURQ : TURQD}"/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 32;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${TURQD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, SALT);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = saltHouse(k, f, { sign: 'РАТУША', signBg: '#6a2a2a' });
      let g = h.g;
      if (lv >= 3) for (const s of [-1, 1]) g += `<rect x="${f1(h.cx + s * 66 - 8)}" y="${h.B - 100}" width="16" height="100" fill="${SALT}" ${O(3)}/>`;
      if (lv >= 3) g += `<rect x="${f1(h.cx - 80)}" y="${h.B - 112}" width="160" height="14" fill="${TURQ}" ${O(3)}/>`;
      return g;
      void INK;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = saltHouse(k, f, { sign: 'ТРЕНЕР', signBg: '#7a2a2a' });
      let g = h.g;
      for (let i = 0; i < 1 + Math.min(lv, 3); i++) g += `<ellipse cx="${f1(f.x0 - 30 - i * 26)}" cy="${h.B - 14}" rx="13" ry="14" fill="${STN}" ${O(2.5)}/><path d="M${f1(f.x0 - 38 - i * 26)} ${h.B - 26} q8 -12 16 0" stroke="${INK}" stroke-width="3" fill="none"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 14; g += `<path d="M${f1(sx)} ${h.B} V${h.B - 120}" stroke="${INK}" stroke-width="6"/><path d="M${f1(sx)} ${h.B} V${h.B - 120}" stroke="#c8a06a" stroke-width="3"/><path d="M${f1(sx - 12)} ${h.B - 120} h24" stroke="${INK}" stroke-width="6"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<rect x="${f1(x0 + 6)}" y="${f1(top + 10)}" width="${f1(w - 12)}" height="${f1(f.wall - 50)}" rx="6" fill="${STN}" ${O(4)}/><rect x="${f1(x0 + 14)}" y="${f1(top + 18)}" width="${f1(w - 28)}" height="${f1(f.wall - 66)}" rx="4" fill="none" stroke="${TURQ}" stroke-width="4"/><rect x="${f1(x0)}" y="${B - 40}" width="${f1(w)}" height="40" fill="${STND}" ${O(3)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 24 + (i % 3) * (w - 48) / 3, ny = top + 30 + Math.floor(i / 3) * 52, nw = Math.min(48, (w - 60) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.84)}" fill="${SALT}" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 12)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 24)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      if (lv >= 3) g += crystal(k, cx - 6, top + 10, 1.4, lv >= 5 ? k.GOLD : ROSE);
      k.signId('board'); g += k.signLv(cx, B - 20, Math.min(w - 10, 140), 'ДОСКА', lv, 20, TURQD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 10, cx, x1 - 10]) g += `<rect x="${f1(px - 8)}" y="${f1(top + 10)}" width="16" height="${f1(f.wall - 10)}" fill="${SALT}" ${O(3)}/>`;
      g += heap(k, x0 + w * 0.3, B, 1 + lv * 0.08) + heap(k, x1 - w * 0.3, B, 0.8 + lv * 0.08);
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - 20 + i * 20)} ${B} q-4 -26 10 -28 q14 2 10 28 Z" fill="#c8b890" ${O(2)}/>`;
      g += `<path d="M${f1(x0 - 14)} ${f1(top + 14)} L${f1(cx)} ${f1(top - Math.min(f.up - 20, 40 + lv * 10))} L${f1(x1 + 14)} ${f1(top + 14)} Z" fill="${TURQ}" ${O()}/><path d="M${f1(x0 - 6)} ${f1(top + 10)} H${f1(x1 + 6)}" stroke="${TURQD}" stroke-width="5"/>`;
      if (lv >= 4) g += `<path d="M${f1(x1 + 6)} ${B - 26} h56 l-10 -24 h-40 Z" fill="${WOOD}" ${O(2.5)}/><circle cx="${f1(x1 + 30)}" cy="${B - 10}" r="12" fill="#5a3a22" ${O(2.5)}/>` + heap(k, x1 + 34, B - 46, 0.4);
      if (lv >= 5) g += crystal(k, cx - 6, top - 30, 1.4, k.GOLD);
      k.signId('storage'); g += k.signLv(cx, top + 30, Math.min(w - 10, 130), 'СКЛАД', lv, 19, TURQD);
      return g;
      void INK;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), STND);
      const h = saltHouse(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, dome: false });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(m)} ${f1(t - 26)} V${f1(t)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(a)} ${B} Q${f1(a + (b - a) * 0.15)} ${f1(t + h * 0.35)} ${f1(m)} ${f1(t)} Q${f1(b - (b - a) * 0.15)} ${f1(t + h * 0.35)} ${f1(b)} ${B} Z" fill="${SALT}" ${O()}/>`;
        for (const v of [0.4, 0.7]) { const hw = (b - a) * 0.5 * (0.15 + v * 0.85); s += `<path d="M${f1(m - hw)} ${f1(t + h * v)} Q${f1(m)} ${f1(t + h * v + 8)} ${f1(m + hw)} ${f1(t + h * v)}" stroke="${TURQ}" stroke-width="8" fill="none"/>`; }
        if (gold) s += crystal(k, m - 4, t - 26, 1, k.GOLD);
        return s;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(110, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 30)} ${B} Q${f1(cx - 28)} ${f1(B - 80 - lv * 5)} ${f1(cx)} ${f1(B - 92 - lv * 5)} Q${f1(cx + 28)} ${f1(B - 80 - lv * 5)} ${f1(cx + 30)} ${B} Z" fill="${TURQD}" ${O(3)}/>`;
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, TURQD);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = saltHouse(k, f, { sign: 'ЛАВКА', signBg: '#2f4a2a', dx: x1 - 44, noWin: true, dome: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${TURQ}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${WOOD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${WOOD}" ${O(3)}/>`;
      for (let i = 0; i < Math.min(4, lv + 1); i++) { const px = ax0 + 22 + i * 30; g += i % 2 ? `<rect x="${f1(px - 12)}" y="${h.B - 52}" width="24" height="22" rx="3" fill="${ROSE}" ${O(2)}/>` : `<path d="M${f1(px - 12)} ${h.B - 30} L${f1(px)} ${h.B - 66} L${f1(px + 12)} ${h.B - 30} Z" fill="${SALT}" ${O(2)}/>`; }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = saltWall(k, x0 + w * 0.16, top + 30, w * 0.68, B) + `<path d="M${f1(x0 + w * 0.08)} ${f1(top + 30)} h${f1(w * 0.84)} l-10 -16 h${f1(-w * 0.84 + 20)} Z" fill="${TURQ}" ${O(3)}/>`;
      const ch = 70 + lv * 12;
      g += `<circle cx="${f1(cx)}" cy="${f1(top - ch * 0.4)}" r="${f1(ch * 0.7)}" fill="${ROSE}" opacity=".22"/><path d="M${f1(cx - 22)} ${f1(top + 14)} L${f1(cx - 26)} ${f1(top - ch * 0.6)} L${f1(cx)} ${f1(top - ch)} L${f1(cx + 26)} ${f1(top - ch * 0.6)} L${f1(cx + 22)} ${f1(top + 14)} Z" fill="${lv >= 5 ? k.GOLD : ROSE}" ${O(3)}/><path d="M${f1(cx)} ${f1(top - ch)} V${f1(top + 14)} M${f1(cx - 26)} ${f1(top - ch * 0.6)} L${f1(cx)} ${f1(top - ch * 0.4)} L${f1(cx + 26)} ${f1(top - ch * 0.6)}" stroke="${ROSED}" stroke-width="3" fill="none"/>`;
      g += crystal(k, cx - 40, top + 16, 1.2, SALT) + crystal(k, cx + 34, top + 16, 1, ROSE) + win(k, cx - 13, top + 66, 26, 36, lv) + k.door(cx, B, 40 + lv * 3, 64 + lv * 4, '#2a1e4a');
      k.signId('magic'); g += k.signLv(cx, B - 112, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: { grass: '#d8c8a8', grass2: '#c8b896', dirt: '#e4d8c0', dirtD: '#bcae94' },

    back(k) {
      const { P, L } = k;
      let g = `<path d="M0 720 V650 H4400 V720 Z" fill="${STN}" opacity=".6"/>`;
      for (let i = 0; i < 10; i++) { const x = 200 + i * 430, h = 90 + (i % 3) * 40; g += `<path d="M${x - 30} 690 L${x - 22} ${690 - h} Q${x} ${676 - h} ${x + 22} ${690 - h} L${x + 30} 690 Z" fill="${STND}"/><path d="M${x - 34} ${700 - h} h68" stroke="${STN}" stroke-width="8"/>`; }
      P(0, L.W, g);
    },

    water(k) {
      const { P, f1, O } = k;
      for (const [a, y0, b, y1] of k.L.hx.pans) {
        let g = `<rect x="${a - 6}" y="${y0 - 6}" width="${b - a + 12}" height="${y1 - y0 + 12}" rx="6" fill="${STND}"/><rect x="${a}" y="${y0}" width="${b - a}" height="${y1 - y0}" rx="4" fill="#9ad8d4" ${O(3)}/>`;
        let d = ''; for (let x = a + 30; x < b - 20; x += 80) d += `M${f1(x)} ${f1(y0 + 20 + ((x * 7) % 50))} h${30 + (x % 20)}`;
        g += `<path d="${d}" stroke="${SALT}" stroke-width="10" stroke-linecap="round"/><rect x="${a + 4}" y="${y0 + 4}" width="${b - a - 8}" height="${y1 - y0 - 8}" rx="3" fill="none" stroke="${SALT}" stroke-width="6"/>`;
        for (let x = a + 60; x < b - 40; x += 160) g += heap(k, x, y1 - 10, 0.5);
        P(a - 10, b + 10, g, y0 - 10, y1 + 10);
      }
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 96 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, saltHouse(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 26, 26, 32, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, TURQD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + crystal(k, lot.x0 + 8, 670, 1, ROSE);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 96 + (c.v % 20), up: 100, lv: 2 };
      const g0 = saltHouse(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 52, 795 - f.wall + 26, 26, 32, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, TURQD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(260 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'saltstone') {

        let g = k.ell(x, y + 4, 110, 20) + `<path d="M${x - 100} ${y} Q${x - 96} ${y - 50} ${x - 60} ${y - 64} H${x + 60} Q${x + 96} ${y - 50} ${x + 100} ${y} Z" fill="${STN}" ${O(4)}/>`;
        for (const [dx, h, wdt, c, r] of [[-60, 120, 26, SALT, -16], [-30, 200, 34, ROSE, -6], [6, 260, 40, ROSE, 2], [42, 180, 32, SALT, 12], [70, 110, 24, ROSE, 22], [-80, 80, 20, ROSE, -24]]) g += `<g transform="rotate(${r} ${x + dx} ${y - 56})"><path d="M${x + dx - wdt / 2} ${y - 56} V${y - 56 - h + wdt * 0.6} L${x + dx} ${y - 56 - h} L${x + dx + wdt / 2} ${y - 56 - h + wdt * 0.6} V${y - 56} Z" fill="${c}" ${O(3)}/><path d="M${x + dx} ${y - 56 - h} V${y - 60} M${x + dx - wdt / 2} ${y - 56 - h + wdt * 0.6} L${x + dx} ${y - 56 - h + wdt}" stroke="${c === SALT ? SALTD : ROSED}" stroke-width="2.5" fill="none"/></g>`;
        g += `<circle cx="${x}" cy="${y - 180}" r="110" fill="${ROSE}" opacity=".14"/>`;
        return { g, w: 300, h: 340 };
      }
      if (p.k === 'saltheap') return { g: k.ell(x, y, 40 * s, 8) + heap(k, x, y, s), w: 100 * s, h: 70 * s, flat: true };
      if (p.k === 'pillar') { const h = 160 + (p.v % 3) * 20; return { g: k.ell(x, y, 30, 8) + `<path d="M${x - 24} ${y} L${x - 18} ${y - h} Q${x} ${y - h - 14} ${x + 18} ${y - h} L${x + 24} ${y} Z" fill="${STND}" ${O(3.5)}/><path d="M${x - 28} ${y - h + 6} h56 M${x - 22} ${y - h * 0.5} h44" stroke="${STN}" stroke-width="6"/>`, w: 80, h: h + 20 }; }
      if (p.k === 'rakes') return { g: k.ell(x, y, 24, 6) + [0, 1, 2].map((i) => `<path d="M${x - 14 + i * 14} ${y} l4 -110" stroke="${INK}" stroke-width="5"/><path d="M${x - 14 + i * 14} ${y} l4 -110" stroke="#c8a06a" stroke-width="2.5"/><path d="M${x - 24 + i * 14} ${y - 110} h28" stroke="${INK}" stroke-width="5"/>`).join(''), w: 70, h: 120 };
      return null;
    },
  };

  return {
    id: 'd113', ver: 1, name: 'Соляновье', layout, art,
    story: 'Деревня солеваров на Плато Камней: дома из белых соляных блоков с бирюзовыми дверями, на парапетах блестят кристаллы. Внизу - ровная сетка дорожек меж выпарных чаш с рассолом, а в средней клетке стоит Соляной Камень - огромная друза розовой соли, что выросла сама.',
  };
});
