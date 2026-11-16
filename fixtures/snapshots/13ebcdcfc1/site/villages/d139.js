



(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const LOGC = '#9a6a3c', LOGD = '#5e3e22', GRN = '#2f6a3a', GRNL = '#4f8a4a', ROOF = '#6a4a34', ROOFD = '#43301f', CLOTH = '#e8dcc0', GOLDL = '#d8a84a';
  const KINDS = { greattower: { foot: [70, 24], tall: 460 }, targets: { foot: [30, 10], tall: 110 }, banner2: { foot: [12, 6], tall: 170 }, stack: { foot: [26, 10], tall: 120 } };

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
        shop: { x0: 1520, x1: 1780, B: 1120 },
        tent: { x0: 2420, x1: 2770, B: 1120 },
        storage: { x0: 3520, x1: 3800, B: 1240 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'square', w: 34, pts: [[1400, 1180], [3000, 1180], [3000, 1420], [1400, 1420], [1400, 1180]] },
        { k: 'lane', w: 32, pts: [[1460, 908], [1440, 1050], [1400, 1180]] },
        { k: 'lane', w: 34, pts: [[3000, 1300], [3660, 1300], [3990, 1250], [3990, 908]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1300, rx: 420, ry: 70, mark: 'greattower', ms: 1, shape: 'rect' }],
      kinds: KINDS,
      props: [['targets', 1560, 1300], ['targets', 2860, 1300], ['banner2', 1460, 1240], ['banner2', 2940, 1240], ['stack', 1260, 1320], ['banner2', 3300, 1180], ['stack', 3200, 1420]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 480, x1: 690, base: 1446 }, { x0: 860, x1: 1070, base: 1450 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['pine', 'pine', 'tree', 'stump', 'bush'], n: 22, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'woodpile'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1480, 1700], [1740, 1960], [2320, 2560], [2600, 2820], [3480, 3720], [3770, 4000]] },
    };
  }

   
  const oak = (k, x, y, s = 1, c = GOLDL) => k.use(k.sym('d139oak' + c.slice(1), () => `<path d="M0 -14 q5 1 4 5 q6 0 3 6 q6 2 1 6 q3 4 -3 5 L0 14 L-5 8 q-6 -1 -3 -5 q-5 -4 1 -6 q-3 -6 3 -6 q-1 -4 4 -5 Z" fill="${c}" stroke="#1e1a14" stroke-width="1.8"/>`), x, y, s);
  const flag = (k, x, B, h, s = 1) => { const { f1, O, INK } = k; return `<path d="M${f1(x)} ${f1(B)} V${f1(B - h)}" stroke="${INK}" stroke-width="${f1(6 * s)}"/><path d="M${f1(x)} ${f1(B)} V${f1(B - h)}" stroke="#8a6a44" stroke-width="${f1(3 * s)}"/><path d="M${f1(x)} ${f1(B - h + 4)} h${f1(38 * s)} v${f1(52 * s)} l${f1(-19 * s)} ${f1(-12 * s)} l${f1(-19 * s)} ${f1(12 * s)} Z" fill="${GRN}" ${O(2.5)}/>` + oak(k, x + 19 * s, B - h + 26 * s, 0.9 * s); };
  function slit(k, x, y, h) { return `<rect x="${k.f1(x - 4)}" y="${k.f1(y)}" width="8" height="${k.f1(h)}" fill="#1e1610" ${k.O(2)}/>`; }
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return k.winLit(x, y, w, h, true) + `<rect x="${f1(x - 10)}" y="${f1(y - 3)}" width="9" height="${f1(h + 6)}" fill="${GRN}" ${O(2)}/><rect x="${f1(x + w + 1)}" y="${f1(y - 3)}" width="9" height="${f1(h + 6)}" fill="${GRN}" ${O(2)}/>`;
  }

  function block(k, f, o = {}) {
    const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([60, 72, 84, 94, 102][lv - 1], f.up - 10, w * 0.44));
    const mid = lv >= 2 ? B - f.wall * 0.52 : top, ov = lv >= 2 ? 16 : 0;
    let g = k.wall(x0, mid, w, B, lv <= 1 ? 'shack' : 'log');
    if (lv >= 2) { g += k.wall(x0 - ov, top, w + ov * 2, mid - 6, 'log') + `<rect x="${f1(x0 - ov - 4)}" y="${f1(mid - 8)}" width="${f1(w + ov * 2 + 8)}" height="10" fill="${LOGD}" ${O(3)}/>`; for (let x = x0 + 10; x < x1 - 6; x += 30) g += `<path d="M${f1(x)} ${f1(mid + 2)} l-8 -10" stroke="${LOGD}" stroke-width="7" stroke-linecap="round"/>`; }
    g += k.roof(x0 - ov, x1 + ov, top, rh, lv <= 1 ? 'thatch' : 'shingle', lv <= 1 ? '#8a7a5a' : ROOF, false, ROOFD);
    if (lv >= 3) for (const x of [x0 + 16, x1 - 16]) g += slit(k, x, mid + 16, 26);
    const ww = [26, 30, 32, 34, 36][lv - 1], wh = [28, 32, 36, 40, 44][lv - 1], wy = lv >= 2 ? top + Math.max(14, (mid - top - wh) * 0.4) : top + 24;
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) g += k.bigDoor(cx, B, lv, LOGD, 0.92);
    if (o.flag !== false && lv >= 2) g += flag(k, o.fx != null ? o.fx : x1 + 18, B, 150 + lv * 8, 0.9);
    if (lv >= 4) g += oak(k, cx, top - rh * 0.44, 1.2 + lv * 0.08, lv >= 5 ? k.GOLD : GOLDL);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : o.signTop ? top + 26 : mid + 24, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || GRN);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, mid - 2, 6);
    return { g, top, rh, cx, B, mid };
  }
  const horn = (k, x, y, s = 1) => `<path d="M${k.f1(x)} ${k.f1(y)} q${k.f1(20 * s)} ${k.f1(-4 * s)} ${k.f1(34 * s)} ${k.f1(-22 * s)} l${k.f1(8 * s)} ${k.f1(6 * s)} q${k.f1(-14 * s)} ${k.f1(22 * s)} ${k.f1(-42 * s)} ${k.f1(24 * s)} Z" fill="#e8dcc0" ${k.O(2)}/><path d="M${k.f1(x + 10 * s)} ${k.f1(y - 2 * s)} v${k.f1(6 * s)} M${k.f1(x + 22 * s)} ${k.f1(y - 8 * s)} v${k.f1(8 * s)}" stroke="${GOLDL}" stroke-width="3"/>`;

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, INK, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall + 10;
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 30], [cx + ow / 2 + 30, x1]]) if (b - a > 12) for (let x = a + 2; x < b; x += 20) g += `<path d="M${f1(x)} ${B} V${B - 70} l10 -16 l10 16 V${B} Z" fill="${LOGC}" ${O(3)}/>`;
      for (const s of [-1, 1]) { const px = cx + s * (ow / 2 + 16); g += `<rect x="${f1(px - 20)}" y="${f1(B - ph + 40)}" width="40" height="${f1(ph - 40)}" fill="${LOGC}" ${O(4)}/><rect x="${f1(px - 26)}" y="${f1(B - ph + 10)}" width="52" height="34" fill="${LOGC}" ${O(3)}/>` + slit(k, px, B - ph + 16, 20) + `<path d="M${f1(px - 32)} ${f1(B - ph + 12)} L${f1(px)} ${f1(B - ph - 26)} L${f1(px + 32)} ${f1(B - ph + 12)} Z" fill="${ROOF}" ${O(3)}/>` + (lv >= 2 ? flag(k, px, B - ph - 24, 50, 0.6) : ''); }
      const by = B - ph + 54;
      g += `<path d="M${f1(cx - ow / 2 - 4)} ${f1(by)} H${f1(cx + ow / 2 + 4)}" stroke="${INK}" stroke-width="14"/><path d="M${f1(cx - ow / 2 - 4)} ${f1(by)} H${f1(cx + ow / 2 + 4)}" stroke="${LOGD}" stroke-width="8"/>` + oak(k, cx, by - 20, 1.4, lv >= 5 ? k.GOLD : GOLDL);
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = by + 18;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${GRN}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, CLOTH);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = block(k, f, { sign: 'РАТУША', signBg: '#5a1a14' });
      let g = h.g + horn(k, h.cx - 20, h.B - 112 - lv * 4, 1);
      const ty = h.top - h.rh + 6; g += `<path d="M${f1(h.cx - 18)} ${f1(ty)} V${f1(ty - 40)} M${f1(h.cx + 18)} ${f1(ty)} V${f1(ty - 40)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(h.cx - 9)} ${f1(ty - 36)} q9 -5 18 0 l3 16 h-24 Z" fill="${lv >= 5 ? k.GOLD : '#c8a050'}" ${O(2)}/><path d="M${f1(h.cx - 26)} ${f1(ty - 38)} L${f1(h.cx)} ${f1(ty - 64)} L${f1(h.cx + 26)} ${f1(ty - 38)} Z" fill="${ROOF}" ${O(3)}/>`;
      return g;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = block(k, f, { sign: 'ТРЕНЕР', signBg: '#6a1a14', flag: false });
      let g = h.g;
      for (let i = 0; i < 1 + Math.min(lv, 3); i++) { const sx = f.x1 + 16 + i * 14; g += `<path d="M${f1(sx)} ${h.B - 10} q-14 -60 0 -120" stroke="${INK}" stroke-width="6" fill="none"/><path d="M${f1(sx)} ${h.B - 10} q-14 -60 0 -120" stroke="#a8784a" stroke-width="3" fill="none"/><path d="M${f1(sx)} ${h.B - 10} V${h.B - 130}" stroke="${CLOTH}" stroke-width="1.5"/>`; }
      if (lv >= 2) { const bx = f.x0 - 36; g += `<path d="M${f1(bx - 18)} ${h.B} L${f1(bx)} ${h.B - 90} L${f1(bx + 18)} ${h.B}" stroke="${INK}" stroke-width="5" fill="none"/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="28" fill="#e0c060" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="17" fill="none" stroke="#c8402a" stroke-width="5"/><circle cx="${f1(bx)}" cy="${h.B - 76}" r="6" fill="#c8402a"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = '';
      for (const px of [x0 + 14, x1 - 14]) g += `<rect x="${f1(px - 8)}" y="${f1(top)}" width="16" height="${f1(B - top)}" fill="${LOGD}" ${O(3.5)}/>`;
      const by0 = top + 26, by1 = B - 52;
      g += `<rect x="${f1(x0 + 6)}" y="${f1(by0)}" width="${f1(w - 12)}" height="${f1(by1 - by0)}" rx="4" fill="${LOGC}" ${O(4)}/><rect x="${f1(x0 + 16)}" y="${f1(by0 + 10)}" width="${f1(w * 0.46)}" height="${f1((by1 - by0) * 0.72)}" fill="#e8dcb8" ${O(2.5)}/>`;
      for (const [dx, dy] of [[20, 20], [50, 34], [32, 56], [70, 50]]) g += `<path d="M${f1(x0 + 16 + dx)} ${f1(by0 + 10 + dy)} l-5 8 h10 Z" fill="${GRN}"/>`;
      g += `<path d="M${f1(x0 + 40)} ${f1(by0 + 40)} l6 6 m0 -6 l-6 6" stroke="#c8402a" stroke-width="3"/>`;
      for (let i = 0; i < 1 + Math.min(3, lv); i++) { const nx = x0 + w * 0.6 + (i % 2) * 32, ny = by0 + 12 + Math.floor(i / 2) * 44; g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="28" height="34" fill="#f3efd8" ${O(2)}/><path d="M${f1(nx + 5)} ${f1(ny + 12)} h18 M${f1(nx + 5)} ${f1(ny + 22)} h12" stroke="${INK}" stroke-width="2" opacity=".45"/>`; }
      g += k.roof(x0 - 6, x1 + 6, by0 - 4, Math.min(f.up - 40, 28 + lv * 6), 'shingle', ROOF, false, ROOFD) + (lv >= 3 ? oak(k, cx, by0 - 20 - lv * 3, 1, lv >= 5 ? k.GOLD : GOLDL) : '');
      k.signId('board'); g += k.signLv(cx, by1 + 22, Math.min(w - 10, 140), 'ДОСКА', lv, 20, GRN);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, cx = (x0 + x1) / 2, B = 795;
      k.signId('storage'); const h = block(k, f, { sign: 'СКЛАД', signBg: '#4a3a1e', noWin: true });
      let g = h.g;
      for (let i = 0; i < Math.min(lv, 3); i++) { const sx = x0 - 30 - i * 26; g += `<path d="M${f1(sx - 12)} ${B} L${f1(sx)} ${B - 110} L${f1(sx + 12)} ${B}" stroke="${INK}" stroke-width="5" fill="none"/><path d="M${f1(sx - 4)} ${B - 110} l4 -14 l4 14 Z" fill="#9aa4b2" ${O(1.5)}/>`; }
      if (lv >= 3) g += `<path d="M${f1(cx - 18)} ${h.mid + 40} h36 v30 q-18 16 -36 0 Z" fill="${GRN}" ${O(2.5)}/>` + oak(k, cx, h.mid + 56, 0.7);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(h.top - h.rh - 10)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#8f8a7c');
      const h = block(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, flag: false, roofH: Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 10) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        return `<path d="M${f1(m)} ${f1(t - 26)} V${f1(t)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(m)} ${f1(t - 26)} l22 8 l-22 8" fill="${gold ? k.GOLD : GOLDL}" ${O(2)}/><path d="M${f1(a)} ${B} L${f1(m)} ${f1(t)} L${f1(b)} ${B} Z" fill="${GRN}" ${O()}/><path d="M${f1(m)} ${f1(t)} L${f1(a + (b - a) * 0.3)} ${B} M${f1(m)} ${f1(t)} L${f1(b - (b - a) * 0.3)} ${B}" stroke="${GRNL}" stroke-width="3"/>`;
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 28)} ${B} L${f1(cx)} ${f1(B - 92 - lv * 5)} L${f1(cx + 28)} ${B} Z" fill="#1e2a1e" ${O(3)}/>` + oak(k, cx, top + 30, 1.5);
      k.signId('tent'); g += k.signLv(cx, top + 76, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, GRN);
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = block(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true, flag: false, signTop: true });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(100, f.wall * 0.46);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${GRN}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${LOGD}" stroke-width="6"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${LOGC}" ${O(3)}/>`;
      for (let i = 0, n = Math.max(2, Math.min(1 + lv, Math.floor((ax1 - ax0) / 34))); i < n; i++) { const px = ax0 + 20 + i * 34; g += `<path d="M${f1(px)} ${f1(ay + 22)} v6" stroke="${INK}" stroke-width="2"/>` + (i % 2 ? `<path d="M${f1(px - 10)} ${f1(ay + 28)} h20 l4 34 h-28 Z" fill="${GRNL}" ${O(2)}/>` : `<rect x="${f1(px - 7)}" y="${f1(ay + 30)}" width="14" height="30" rx="4" fill="#8a5a32" ${O(2)}/><path d="M${f1(px - 4)} ${f1(ay + 30)} l-2 -10 M${f1(px + 2)} ${f1(ay + 30)} l0 -12 M${f1(px + 6)} ${f1(ay + 30)} l2 -10" stroke="${CLOTH}" stroke-width="2"/>`); }
      return g;
    },

    magic(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall - Math.min(f.up - 60, 20 + lv * 10);
      let g = `<path d="M${f1(cx - w * 0.3)} ${B} L${f1(cx - w * 0.22)} ${f1(top + 60)} M${f1(cx + w * 0.3)} ${B} L${f1(cx + w * 0.22)} ${f1(top + 60)} M${f1(cx - w * 0.28)} ${B - 60} L${f1(cx + w * 0.26)} ${f1(top + 80)} M${f1(cx + w * 0.28)} ${B - 60} L${f1(cx - w * 0.26)} ${f1(top + 80)}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${f1(cx - w * 0.3)} ${B} L${f1(cx - w * 0.22)} ${f1(top + 60)} M${f1(cx + w * 0.3)} ${B} L${f1(cx + w * 0.22)} ${f1(top + 60)}" stroke="${LOGC}" stroke-width="7"/>`;
      g += k.wall(cx - w * 0.36, top, w * 0.72, top + 64, 'log') + `<path d="M${f1(cx - w * 0.44)} ${f1(top + 4)} L${f1(cx)} ${f1(top - 60)} L${f1(cx + w * 0.44)} ${f1(top + 4)} Z" fill="#3a2a6a" ${O(3)}/><path d="M${f1(cx + w * 0.3)} ${f1(top + 30)} l40 -26" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${f1(cx + w * 0.3)} ${f1(top + 30)} l40 -26" stroke="${GOLDL}" stroke-width="7" stroke-linecap="round"/>`;
      for (let i = 0; i < Math.min(lv, 3); i++) g += `<path d="M${f1(cx - 60 + i * 60)} ${f1(top - 80 - (i % 2) * 20)} l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="${lv >= 5 ? k.GOLD : '#ffd76a'}" ${O(1.2)}/>`;
      g += win(k, cx - 13, top + 16, 26, 30, lv) + k.door(cx, B, 40 + lv * 2, 62 + lv * 3, '#2a1e3a') + `<rect x="${f1(cx - 34)}" y="${B - 80 - lv * 3}" width="68" height="${80 + lv * 3}" fill="none"/>`;
      k.signId('magic'); g += k.signLv(cx, B - 104, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#2a2a5a');
      return g;
    },
  };

  const art = {
    K: {},

    water(k) { k.P(1430, 2970, `<rect x="1440" y="1220" width="1520" height="160" rx="12" fill="#a88a5a" opacity=".35"/>`, 1214, 1386); },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 104 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, block(k, f, { door: false, noWin: true, flag: i % 2 === 0 }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 16, 26, 28, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, LOGD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 104 + (c.v % 20), up: 100, lv: 2 };
      const g0 = block(k, f, { door: false, noWin: true, fx: c.v % 2 ? x0 - 20 : x1 + 18 }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 16, 30, 28, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, LOGD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(290 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, { f1, O, INK } = k;
      if (p.k === 'greattower') {

        let g = k.ell(x, y + 4, 80, 16);
        const legs = `M${x - 60} ${y} L${x - 36} ${y - 340} M${x + 60} ${y} L${x + 36} ${y - 340} M${x - 56} ${y - 40} L${x + 44} ${y - 200} M${x + 56} ${y - 40} L${x - 44} ${y - 200} M${x - 44} ${y - 200} L${x + 38} ${y - 320} M${x + 44} ${y - 200} L${x - 38} ${y - 320} M${x - 52} ${y - 120} H${x + 52} M${x - 42} ${y - 260} H${x + 42}`;
        g += `<path d="${legs}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="${legs}" stroke="${LOGC}" stroke-width="8" stroke-linecap="round"/>`;
        g += `<rect x="${x - 56}" y="${y - 352}" width="112" height="16" fill="${LOGD}" ${O(3)}/><path d="M${x - 50} ${y - 352} v-34 M${x + 50} ${y - 352} v-34 M${x - 56} ${y - 370} h112" stroke="${LOGC}" stroke-width="6"/><path d="M${x - 66} ${y - 386} L${x} ${y - 430} L${x + 66} ${y - 386} Z" fill="${ROOF}" ${O(3.5)}/>`;
        g += `<path d="M${x - 30} ${y - 352} l6 -22 h24 l6 22 Z" fill="#5a5662" ${O(2.5)}/><circle cx="${x - 12}" cy="${y - 390}" r="30" fill="url(#tgGlow)" opacity=".6"/><path d="M${x - 24} ${y - 374} q12 -40 24 0 q-4 -14 -12 -4 q-8 -10 -12 4" fill="#ff8a2a" stroke="#c8402a" stroke-width="2"/>` + horn(k, x + 18, y - 362, 1);
        g += flag(k, x + 66, y - 386, 90, 0.9);
        return { g, w: 300, h: 480 };
      }
      if (p.k === 'targets') return { g: k.ell(x, y, 30, 7) + `<path d="M${x - 18} ${y} L${x} ${y - 80} L${x + 18} ${y}" stroke="${INK}" stroke-width="5" fill="none"/><circle cx="${x}" cy="${y - 70}" r="26" fill="#e0c060" ${O(3)}/><circle cx="${x}" cy="${y - 70}" r="15" fill="none" stroke="#c8402a" stroke-width="4"/><circle cx="${x}" cy="${y - 70}" r="5" fill="#c8402a"/><path d="M${x + 4} ${y - 74} l22 -10" stroke="#5a3a22" stroke-width="2.5"/>`, w: 70, h: 110 };
      if (p.k === 'banner2') return { g: k.ell(x, y, 12, 4) + flag(k, x, y, 150, 1), w: 70, h: 170 };
      if (p.k === 'stack') { let g = k.ell(x, y, 26, 7); for (let i = 0; i < 4; i++) g += `<path d="M${x - 16 + i * 10} ${y} L${x} ${y - 110}" stroke="${INK}" stroke-width="5"/><path d="M${x - 16 + i * 10} ${y} L${x} ${y - 110}" stroke="#a87a4a" stroke-width="2.5"/>`; return { g: g + `<path d="M${x - 5} ${y - 110} l5 -16 l5 16 Z" fill="#9aa4b2" ${O(1.5)}/>`, w: 60, h: 130 }; }
      return null;
    },
  };

  return {
    id: 'd139', ver: 1, name: 'Дубень', layout, art,
    story: 'Дозорная деревня в сосновом бору: срубы-блокгаузы с бойницами и нависающим вторым ярусом, всюду зелёные стяги с дубовым листом. Внизу улицы обходят квадратом учебный плац, посреди которого стоит Великая вышка с сигнальным огнём и рогом - увидев врага, дозорные трубят на весь бор.',
  };
});
