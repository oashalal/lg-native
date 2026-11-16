




(function (root, factory) {
  const V = factory();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else (root.LGVillages = root.LGVillages || {})[V.id] = V;
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TR = '#3a2e22', TRL = '#5e4a36', TRD = '#1a140e', MOSS = '#2e4a1e', MOSSL = '#4e7a2e', HEART = '#c8ff7a', HEARTL = '#f8ffd8', RUNE = '#8aff5a', AMB = '#ffb03a', AMBL = '#ffe8a0';
  const LEAF = ['#24401a', '#2e5a1e', '#3e7226', '#56862e'], LOGC = '#6a5038', LOGD = '#3e2c1e';
  const KINDS = { sprout: { foot: [80, 24], tall: 260 }, glowshroom: { foot: [16, 7], tall: 40 }, amberlamp: { foot: [12, 6], tall: 150 }, rootarch: { foot: [60, 12], tall: 120 } };

  function layout() {
    return {
      b: {
        gate: { x0: 60, x1: 300 },
        forge: { x0: 360, x1: 920, anvil: 480, fx0: 580 },
        board: { x0: 980, x1: 1180 },
        hall: { x0: 1250, x1: 1440 },
        trainer: { x0: 2960, x1: 3240 },
        magic: { x0: 3310, x1: 3540 },
        mine: { x0: 4040, x1: 4340 },
        shop: { x0: 1520, x1: 1780, B: 1170 },
        tent: { x0: 2560, x1: 2880, B: 1170 },
        storage: { x0: 3600, x1: 3880, B: 1180 },
      },
      roads: [
        { k: 'main', w: 44, pts: [[40, 905], [800, 909], [1500, 905], [2200, 912], [3000, 906], [3800, 910], [4360, 906]] },
        { k: 'lane', w: 34, pts: [[1460, 908], [1500, 1080], [1620, 1236], [2000, 1250], [2200, 1244], [2600, 1236], [3000, 1250], [3740, 1252], [3990, 1220], [3990, 908]] },
        { k: 'cross', w: 30, pts: [[2200, 1244], [2200, 1290]] },
      ],
      plazas: [{ k: 'central', x: 2200, y: 1362, rx: 220, ry: 80, mark: 'sprout', ms: 1.2, paved: false }],
      water: [{ k: 'spring', e: [900, 1330, 200, 46] }],
      kinds: KINDS,
      props: [['glowshroom', 1900, 1340], ['glowshroom', 2500, 1350], ['amberlamp', 1960, 1200], ['amberlamp', 2440, 1150], ['rootarch', 1300, 1380], ['rootarch', 3500, 1400], ['glowshroom', 3400, 1300]],
      houses: [{ x0: 120, x1: 330, base: 1450 }, { x0: 1240, x1: 1440, base: 1452 }, { x0: 3100, x1: 3300, base: 1452 }, { x0: 4100, x1: 4300, base: 1450 }],
      fill: [{ k: ['pine', 'glowshroom', 'stump', 'drift', 'amberlamp'], n: 20, box: [80, 980, 4320, 1460] }, { k: ['barrel', 'crate', 'glowshroom'], n: 10, box: [80, 822, 4320, 840] }],
      extra: { backHouses: [[1480, 1700], [2700, 2920], [3580, 3780], [3820, 4000]], tree: 2200 },
    };
  }

   
  const shroom = (k, x, y, s = 1) => k.use(k.sym('treeshroom', () => { const { O } = k; return `<circle cx="0" cy="-14" r="22" fill="${RUNE}" opacity=".18"/><rect x="-3.5" y="-16" width="7" height="16" fill="#d8e8c0" ${O(2)}/><path d="M-16 -14 Q-14 -30 0 -32 Q14 -30 16 -14Z" fill="#4aa86a" ${O(2.5)}/><circle cx="-5" cy="-22" r="2.6" fill="#e8ffe0"/><circle cx="6" cy="-20" r="2" fill="#e8ffe0"/>`; }), x, y, s);
  const lamp = (k, x, y, s = 1) => k.use(k.sym('treelamp', () => { const { O } = k; return `<circle cx="0" cy="14" r="26" fill="${AMB}" opacity=".25"/><path d="M-12 0 Q-16 14 -10 28 Q0 32 10 28 Q16 14 12 0 Z" fill="${AMB}" ${O(2.5)}/><path d="M-8 6 Q0 10 8 6" stroke="${AMBL}" stroke-width="3" fill="none"/><path d="M-6 0 h12" stroke="#1a140e" stroke-width="4"/>`; }), x, y, s);
  const rootArch = (k, cx, B, w, h) => { const { f1, O } = k; const d = `M${f1(cx - w / 2 - 20)} ${B + 4} Q${f1(cx - w / 2 - 10)} ${f1(B - h * 0.6)} ${f1(cx - w * 0.2)} ${f1(B - h)} Q${f1(cx)} ${f1(B - h - 14)} ${f1(cx + w * 0.2)} ${f1(B - h)} Q${f1(cx + w / 2 + 10)} ${f1(B - h * 0.6)} ${f1(cx + w / 2 + 20)} ${B + 4}`; return `<path d="${d}" stroke="${k.INK}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${TRL}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${MOSSL}" stroke-width="3" fill="none" opacity=".7" stroke-dasharray="14 22"/>`; };
  function mossRoof(k, x0, x1, top, h, lv) {
    const { f1 } = k, cx = (x0 + x1) / 2;
    let g = k.roof(x0, x1, top, h, 'shingle', '#4a3a2a', false, TRD);
    g += `<path d="M${f1(x0 - 20)} ${f1(top + 4)} L${f1(cx)} ${f1(top - h)} L${f1(x1 + 20)} ${f1(top + 4)} L${f1(x1)} ${f1(top - 6)} L${f1(cx)} ${f1(top - h + 22)} L${f1(x0)} ${f1(top - 6)} Z" fill="${lv >= 3 ? MOSSL : MOSS}" stroke="#1c2e14" stroke-width="2.5"/>`;
    let d = ''; for (let x = x0 - 12; x < x1 + 14; x += 20) d += `M${f1(x)} ${f1(top + 4)} q-2 ${10 + ((x * 3) % 14)} 2 ${18 + ((x * 3) % 14)}`; g += `<path d="${d}" stroke="${MOSS}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    g += k.snowCap(x0 - 20, x1 + 20, top + 4, h);
    if (lv >= 4) g += `<path d="M${f1(cx)} ${f1(top - h)} v-24" stroke="${k.INK}" stroke-width="3"/><circle cx="${f1(cx)}" cy="${f1(top - h - 30)}" r="${lv >= 5 ? 9 : 7}" fill="${lv >= 5 ? k.GOLD : HEART}" ${k.O(2)}/>`;
    return g;
  }
  function win(k, x, y, w, h, lv) {
    const { f1, O } = k;
    return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(w / 2)}" fill="${lv >= 3 ? HEART : AMBL}" ${O(2.5)}/><path d="M${f1(x + w / 2)} ${f1(y + 3)} V${f1(y + h)} M${f1(x)} ${f1(y + h * 0.55)} h${f1(w)}" stroke="${LOGD}" stroke-width="2.5"/><path d="M${f1(x - 6)} ${f1(y + h + 6)} h${f1(w + 12)}" stroke="${TRL}" stroke-width="6" stroke-linecap="round"/>`;
  }

  function house(k, f, o = {}) {
    const lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, B = f.B, top = B - f.wall, cx = o.dx != null ? o.dx : (x0 + x1) / 2;
    const rh = Math.round(o.roofH || Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 14, w * 0.5));
    let g = k.wall(x0, top, w, B, lv <= 1 ? 'shack' : 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + mossRoof(k, x0, x1, top, rh, lv);
    const ww = [24, 28, 30, 32, 34][lv - 1], wh = [30, 36, 40, 44, 48][lv - 1], wy = top + Math.max(22, (f.wall - wh) * 0.36);
    if (!o.noWin) for (const x of [x0 + 22, x1 - 22 - ww]) if (Math.abs(x + ww / 2 - cx) > 58 && (lv > 1 || x < cx)) g += win(k, x, wy, ww, wh, lv);
    if (o.door !== false) { g += k.bigDoor(cx, B, lv, LOGD, 0.92); if (lv >= 2) g += rootArch(k, cx, B, [0, 64, 70, 76, 80][lv - 1], [0, 126, 136, 144, 150][lv - 1]); }
    if (o.deco !== false && lv >= 2) g += shroom(k, x0 + 6, B + 2, 0.9) + shroom(k, x0 + 22, B + 2, 0.6) + `<path d="M${k.f1(x1 + 6)} ${top + 10} h18 v12" stroke="${k.INK}" stroke-width="3" fill="none"/>` + lamp(k, x1 + 24, top + 22, 0.8);
    if (o.sign) g += k.signLv(cx + (o.signDx || 0), lv <= 1 ? top - rh * 0.3 : top + 28, Math.min(w + 10, Math.max(110, o.sign.length * 18 + 40)), o.sign, lv, o.signSize || 20, o.signBg || LOGD);
    if (lv >= 5) g += k.garland(x0 + 10, x1 - 10, top + 58, 6);
    return { g, top, rh, cx, B };
  }

  const BLD = {

    gate(lot, f, k) {
      const { f1, O, L } = k, lv = f.lv, cx = (lot.x0 + lot.x1) / 2, B = 795, x0 = f.x0, x1 = f.x1, ow = [100, 108, 116, 116, 124][lv - 1], ph = f.wall + 20;
      let g = '';
      for (const [a, b] of [[x0, cx - ow / 2 - 40], [cx + ow / 2 + 40, x1]]) if (b - a > 12) g += `<path d="M${f1(a)} ${B} Q${f1((a + b) / 2)} ${B - 70} ${f1(b)} ${B}" stroke="${k.INK}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M${f1(a)} ${B} Q${f1((a + b) / 2)} ${B - 70} ${f1(b)} ${B}" stroke="${TR}" stroke-width="18" fill="none" stroke-linecap="round"/>`;
      const d = `M${f1(cx - ow / 2 - 40)} ${B} Q${f1(cx - ow / 2 - 30)} ${f1(B - ph)} ${f1(cx)} ${f1(B - ph - 20)} Q${f1(cx + ow / 2 + 30)} ${f1(B - ph)} ${f1(cx + ow / 2 + 40)} ${B}`;
      g += `<path d="${d}" stroke="${k.INK}" stroke-width="44" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${TR}" stroke-width="36" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${TRL}" stroke-width="8" fill="none" opacity=".6"/><path d="${d}" stroke="${RUNE}" stroke-width="3" fill="none" stroke-dasharray="8 30" opacity=".9"/>`;
      g += `<path d="M${f1(cx - 60)} ${f1(B - ph + 6)} q-4 30 4 50 M${f1(cx + 50)} ${f1(B - ph + 2)} q4 24 -2 40" stroke="${MOSS}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      for (const s of [-1, 1]) g += `<path d="M${f1(cx + s * 40)} ${f1(B - ph - 4)} v18" stroke="${k.INK}" stroke-width="2.5"/>` + lamp(k, cx + s * 40, B - ph + 14, 0.9 + lv * 0.05);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(B - ph - 46)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      const nm = L.name.toUpperCase(), bw = Math.max(ow + 10, nm.length * 15 + 30), ny = B - ph + 50;
      g += `<rect x="${f1(cx - bw / 2)}" y="${f1(ny)}" width="${f1(bw)}" height="30" rx="4" fill="${LOGD}" ${O(3.5)}/>` + k.txt(cx, ny + 22, nm, 17, HEART);
      k.signAt([cx - bw / 2 - 4, ny - 4, cx + bw / 2 + 4, ny + 34]);
      return g;
    },

    hall(lot, f, k) {
      const { f1, O } = k, lv = f.lv;
      const h = house(k, f, { sign: 'РАТУША', signBg: '#4a1a14' });
      const ly = h.top - h.rh * 0.45;
      return h.g + `<path d="M${f1(h.cx)} ${f1(ly - 26)} Q${f1(h.cx + 26)} ${f1(ly)} ${f1(h.cx)} ${f1(ly + 26)} Q${f1(h.cx - 26)} ${f1(ly)} ${f1(h.cx)} ${f1(ly - 26)} Z" fill="${lv >= 5 ? k.GOLD : LEAF[2]}" ${O(2.5)}/><path d="M${f1(h.cx)} ${f1(ly - 20)} v40 M${f1(h.cx)} ${f1(ly - 6)} l-8 -6 M${f1(h.cx)} ${f1(ly + 6)} l8 -6" stroke="${RUNE}" stroke-width="2.5"/>`;
    },

    trainer(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv;
      const h = house(k, f, { sign: 'ТРЕНЕР', signBg: '#5a1a14', deco: false });
      let g = h.g;
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) { const sx = f.x1 + 14 + i * 12; g += `<path d="M${f1(sx)} ${h.B} l-3 -130" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${f1(sx)} ${h.B} l-3 -130" stroke="${TRL}" stroke-width="3" stroke-linecap="round"/>`; }
      if (lv >= 2) { const bx = f.x0 - 38; g += `<path d="M${f1(bx)} ${h.B} V${h.B - 50}" stroke="${INK}" stroke-width="7"/><circle cx="${f1(bx)}" cy="${h.B - 80}" r="30" fill="${TRL}" ${O(3)}/><circle cx="${f1(bx)}" cy="${h.B - 80}" r="18" fill="none" stroke="${TR}" stroke-width="4"/><circle cx="${f1(bx)}" cy="${h.B - 80}" r="6" fill="${RUNE}"/>`; }
      return g;
    },

    board(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      let g = `<path d="M${f1(x0 + 4)} ${B} V${f1(top + 30)} Q${f1(cx)} ${f1(top - 20)} ${f1(x1 - 4)} ${f1(top + 30)} V${B}" fill="${TR}" ${O(4)}/><path d="M${f1(x0 + 16)} ${B - 30} V${f1(top + 38)} Q${f1(cx)} ${f1(top - 4)} ${f1(x1 - 16)} ${f1(top + 38)} V${B - 30} Z" fill="${TRL}" ${O(2.5)}/>`;
      for (let i = 0; i < 2 + Math.min(3, lv); i++) { const nx = x0 + 24 + (i % 3) * (w - 48) / 3, ny = top + 50 + Math.floor(i / 3) * 52, nw = Math.min(48, (w - 60) / 3); g += `<rect x="${f1(nx)}" y="${f1(ny)}" width="${f1(nw)}" height="${f1(nw * 0.86)}" fill="#ece6d8" ${O(2.5)}/><path d="M${f1(nx + 6)} ${f1(ny + 12)} h${f1(nw - 12)} M${f1(nx + 6)} ${f1(ny + 24)} h${f1(nw - 18)}" stroke="${INK}" stroke-width="2.5" opacity=".45"/>`; }
      g += `<path d="M${f1(x0 + 10)} ${f1(top + 30)} Q${f1(cx)} ${f1(top - 16)} ${f1(x1 - 10)} ${f1(top + 30)}" stroke="${RUNE}" stroke-width="3" fill="none" stroke-dasharray="6 18"/>` + (lv >= 3 ? lamp(k, cx, top - 6, 0.8) : '');
      k.signId('board'); g += k.signLv(cx, B - 18, Math.min(w - 10, 140), 'ДОСКА', lv, 20, LOGD);
      return g;
    },

    storage(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall * 0.9;
      let g = `<path d="M${f1(x0 - 20)} ${B} V${f1(top + 30)} Q${f1(x0 - 20)} ${f1(top)} ${f1(x0 + 20)} ${f1(top)} H${f1(x1 - 30)} V${B} Z" fill="${TR}" ${O()}/>`;
      let bk = ''; for (let i = 1; i < 6; i++) bk += `M${f1(x0 - 10)} ${f1(top + i * (B - top) / 6)} H${f1(x1 - 40)}`; g += `<path d="${bk}" stroke="${TRD}" stroke-width="3"/>`;
      g += `<ellipse cx="${f1(x1 - 30)}" cy="${f1((top + B) / 2)}" rx="${f1(Math.min(60, w * 0.22))}" ry="${f1((B - top) / 2)}" fill="#a87a4a" ${O(3.5)}/>`;
      for (let i = 1; i < 4; i++) g += `<ellipse cx="${f1(x1 - 30)}" cy="${f1((top + B) / 2)}" rx="${f1(Math.min(60, w * 0.22) * i / 4)}" ry="${f1((B - top) / 2 * i / 4)}" fill="none" stroke="#7a5232" stroke-width="2.5"/>`;
      g += `<path d="M${f1(x0 - 10)} ${f1(top + 8)} Q${f1(cx)} ${f1(top - 30)} ${f1(x1 - 40)} ${f1(top + 8)}" stroke="${MOSSL}" stroke-width="14" fill="none" stroke-linecap="round"/>` + k.snowCap(x0 - 10, x1 - 30, top + 4, 20);
      g += rootArch(k, cx - 30, B, 60 + lv * 4, 100 + lv * 6) + k.door(cx - 30, B, 50 + lv * 3, 70 + lv * 5, LOGD) + shroom(k, x0 + 10, B + 2, 1);
      if (lv >= 4) g += lamp(k, x0 + 30, top + 20, 0.9);
      if (lv >= 5) g += `<circle cx="${f1(cx)}" cy="${f1(top - 30)}" r="9" fill="${k.GOLD}" ${O(2.5)}/>`;
      k.signId('storage'); g += k.signLv(cx - 30, top + 30, Math.min(w - 40, 130), 'СКЛАД', lv, 19, LOGD);
      return g;
    },

    forge(lot, f, k) {
      const { f1, O } = k, lv = f.lv, cx = (lot.fx0 + lot.x1) / 2, x0 = f.x0, mw = [64, 76, 88, 96, 104][lv - 1], mx = x0 + 18;
      const chx = f.x1 - 44, chh = [80, 100, 120, 140, 160][lv - 1];
      let g = k.chimney(chx, f.B - f.wall - chh, 26 + lv * 4, chh + 30, Math.max(2, lv), '#7a7a78');
      const h = house(k, f, { sign: 'КУЗНЯ', signBg: '#3a3a4a', dx: cx, noWin: true, deco: false, roofH: Math.min([70, 84, 96, 106, 114][lv - 1], f.up - 10) });
      g += h.g;
      const mt = h.B - [56, 68, 80, 88, 96][lv - 1];
      g += `<path d="M${f1(mx)} ${h.B} V${f1(mt + mw / 2)} A${f1(mw / 2)} ${f1(mw / 2.4)} 0 0 1 ${f1(mx + mw)} ${f1(mt + mw / 2)} V${h.B} Z" fill="#3a1a14" ${O(4)}/><ellipse cx="${f1(mx + mw / 2)}" cy="${f1(h.B - 30)}" rx="${f1(mw * 0.4)}" ry="${f1(mw * 0.3)}" fill="#ff8a2a"/>`;
      return g;
    },

    tent(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const tnt = (a, b, h, gold) => {
        const m = (a + b) / 2, t = B - h;
        let s = `<path d="M${f1(a)} ${B} Q${f1(a + (b - a) * 0.1)} ${f1(t + h * 0.3)} ${f1(m)} ${f1(t)} Q${f1(b - (b - a) * 0.1)} ${f1(t + h * 0.3)} ${f1(b)} ${B} Z" fill="${LEAF[1]}" ${O()}/>`;
        for (let i = 0; i < 9; i++) { const u = 0.15 + (i % 3) * 0.35, v = 0.25 + Math.floor(i / 3) * 0.25, x = a + (b - a) * (u + (v - 0.5) * 0.1 * (i % 2 ? 1 : -1)), y = t + h * v; if (Math.abs(x - m) > (b - a) * 0.5 * v * 0.95) continue; s += `<path d="M${f1(x)} ${f1(y - 12)} q10 12 0 24 q-10 -12 0 -24 Z" fill="${LEAF[2 + (i % 2)]}" stroke="#1c2e14" stroke-width="1.5"/>`; }
        if (gold) s += `<circle cx="${f1(m)}" cy="${f1(t - 10)}" r="7" fill="${k.GOLD}" ${O(2)}/>`;
        return s + k.snowCap(m - 26, m + 26, t + 26, 26);
      };
      let g = '';
      if (lv >= 4) { const sw = Math.min(100, w * 0.3); g += tnt(x0, x0 + sw, f.wall * 0.66, lv >= 5) + tnt(x1 - sw, x1, f.wall * 0.62, lv >= 5); }
      const a = lv >= 4 ? x0 + w * 0.17 : x0, b = lv >= 4 ? x1 - w * 0.17 : x1;
      g += tnt(a, b, Math.min(f.wall + f.up - 40, f.wall + 50 + lv * 10), lv >= 5) + `<path d="M${f1(cx - 28)} ${B} Q${f1(cx - 26)} ${f1(B - 80 - lv * 5)} ${f1(cx)} ${f1(B - 92 - lv * 5)} Q${f1(cx + 26)} ${f1(B - 80 - lv * 5)} ${f1(cx + 28)} ${B} Z" fill="#0c1206" ${O(3)}/>` + rootArch(k, cx, B, 60, 100 + lv * 5);
      for (let i = 0; i < 3; i++) g += `<circle cx="${f1(a + 20 + i * (b - a - 40) / 2)}" cy="${f1(top + 20 + (i % 2) * 30)}" r="4" fill="${RUNE}"/>`;
      k.signId('tent'); g += k.signLv(cx, top + 70, Math.min(b - a - 30, 140), 'ШАТЁР', lv, 19, LOGD);
      void INK;
      return g;
    },

    shop(lot, f, k) {
      const { f1, O, INK } = k, lv = f.lv, x0 = f.x0, x1 = f.x1;
      const h = house(k, f, { sign: 'ЛАВКА', signBg: '#2a3a2a', dx: x1 - 44, noWin: true, deco: false });
      let g = h.g;
      const ax0 = x0 - 10, ax1 = x1 - 84, ay = h.B - Math.min(110, f.wall * 0.7);
      g += `<path d="M${f1(ax0)} ${f1(ay)} H${f1(ax1)} L${f1(ax1 + 10)} ${f1(ay + 22)} H${f1(ax0 - 10)} Z" fill="${MOSS}" ${O(3)}/>` + [ax0, ax1].map((px) => `<path d="M${f1(px)} ${f1(ay + 18)} V${h.B}" stroke="${TR}" stroke-width="7"/>`).join('') + `<rect x="${f1(ax0 + 6)}" y="${h.B - 30}" width="${f1(ax1 - ax0 - 6)}" height="30" fill="${LOGC}" ${O(3)}/>`;
      for (let i = 0, n = Math.max(2, Math.min(lv, Math.floor((ax1 - ax0) / 40))); i < n; i++) g += `<path d="M${f1(ax0 + 22 + i * 40)} ${f1(ay + 22)} v6" stroke="${INK}" stroke-width="2"/>` + lamp(k, ax0 + 22 + i * 40, ay + 28, 0.7);
      for (let i = 0; i < Math.min(3, lv + 1); i++) g += shroom(k, ax0 + 20 + i * 34, h.B - 30, 0.9);
      return g;
    },

    magic(lot, f, k) {
      const { f1, O } = k, lv = f.lv, x0 = f.x0, x1 = f.x1, w = x1 - x0, cx = (x0 + x1) / 2, B = 795, top = B - f.wall;
      const hb = B - Math.min(f.wall * 0.45, 60 + lv * 12);
      let g = `<path d="M${f1(cx - 60)} ${B} Q${f1(cx - 40)} ${f1(hb + 20)} ${f1(cx - 70)} ${f1(hb - 4)} M${f1(cx + 60)} ${B} Q${f1(cx + 40)} ${f1(hb + 20)} ${f1(cx + 70)} ${f1(hb - 4)}" stroke="${k.INK}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M${f1(cx - 60)} ${B} Q${f1(cx - 40)} ${f1(hb + 20)} ${f1(cx - 70)} ${f1(hb - 4)} M${f1(cx + 60)} ${B} Q${f1(cx + 40)} ${f1(hb + 20)} ${f1(cx + 70)} ${f1(hb - 4)}" stroke="${TR}" stroke-width="26" fill="none" stroke-linecap="round"/>`;
      g += `<rect x="${f1(x0 - 4)}" y="${f1(hb - 12)}" width="${f1(w + 8)}" height="14" fill="${TRL}" ${O(3)}/>` + k.wall(x0 + 10, top, w - 20, hb - 12, 'log').replace(new RegExp(k.K.wood, 'g'), LOGC) + `<path d="M${f1(x0 - 4)} ${f1(top + 8)} L${f1(cx)} ${f1(top - Math.min(f.up - 20, 70 + lv * 10))} L${f1(x1 + 4)} ${f1(top + 8)} Z" fill="#2a2a5a" ${O()}/>` + k.snowCap(x0 - 4, x1 + 4, top + 8, Math.min(f.up - 20, 70 + lv * 10));
      for (let i = 0; i < 2 + Math.min(lv, 3); i++) g += `<path d="M${f1(x0 + i * w / (1 + Math.min(lv, 3)))} ${f1(top - 80 - (i % 2) * 24)} m0 -8 v16 m-6 -8 h12" stroke="${RUNE}" stroke-width="3"/>`;
      g += win(k, cx - 13, top + 24, 26, 30, lv) + k.door(cx, B, 34 + lv * 2, Math.min(56 + lv * 3, B - hb - 6), '#0c1206');
      if (lv >= 5) g += k.orb(cx, top - Math.min(f.up - 20, 70 + lv * 10) - 8, 9);
      k.signId('magic'); g += k.signLv(cx, hb + 40, Math.min(w + 20, 150), 'ЧАРОДЕЙ', lv, 15, '#1c2e14');
      return g;
    },
  };

  const art = {
    K: {}, landmark: false,

    back(k) {
      const { P, L, f1, O } = k, tx = L.hx.tree;
      let g = '';

      for (let i = 0; i < 24; i++) { const x = (i + 0.5) * L.W / 24, y = 120 + ((i * 37) % 90); g += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(170 + (i * 53) % 80)}" ry="${f1(90 + (i * 29) % 40)}" fill="${LEAF[i % 2 ? 0 : 1]}"/>`; }
      for (let i = 0; i < 30; i++) { const x = (i * 149) % L.W, y = 180 + ((i * 61) % 110); g += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(60 + (i * 13) % 40)}" ry="${f1(26 + (i * 7) % 14)}" fill="${LEAF[2 + (i % 2)]}" opacity=".9"/>`; }

      const pts = [[tx - 330, 0], [tx + 330, 0], [tx + 360, 300], [tx + 420, 520], [tx + 560, 700], [tx + 700, 796], [tx - 700, 796], [tx - 560, 700], [tx - 420, 520], [tx - 360, 300]];
      g += `<path d="M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L')}Z" fill="${TR}" ${O(5)}/>`;
      let bark = ''; for (let i = 0; i < 16; i++) { const x = tx - 300 + i * 40, w = (i * 17) % 20 - 10; bark += `M${f1(x)} 20 Q${f1(x + w)} 300 ${f1(x + (x - tx) * 0.5)} 760`; }
      g += `<path d="${bark}" stroke="${TRD}" stroke-width="5" fill="none" opacity=".6"/><path d="M${f1(tx - 260)} 40 Q${f1(tx - 280)} 300 ${f1(tx - 380)} 600" stroke="${TRL}" stroke-width="16" fill="none" opacity=".5"/>`;
      g += `<path d="M${f1(tx - 350)} 240 q-30 120 -10 240 M${f1(tx + 340)} 260 q30 110 6 230 M${f1(tx - 200)} 120 q-10 80 4 150" stroke="${MOSS}" stroke-width="14" fill="none" stroke-linecap="round"/>`;

      let rv = ''; for (const [x0, kx] of [[tx - 120, -1], [tx + 120, 1], [tx - 50, -0.4], [tx + 60, 0.4]]) { let x = x0, y = 520, d = `M${f1(x)} ${y}`; for (let i = 0; i < 7; i++) { x += kx * 22 + ((i * 13) % 20 - 10); y -= 60; d += ` L${f1(x)} ${f1(y)}`; } rv += d; }
      g += `<path d="${rv}" stroke="${RUNE}" stroke-width="10" fill="none" opacity=".35"/><path d="${rv}" stroke="${HEARTL}" stroke-width="2.5" fill="none" opacity=".9"/>`;
      g += `<radialGradient id="treeHeart" cx=".5" cy=".62" r=".6"><stop offset="0" stop-color="${HEARTL}"/><stop offset=".35" stop-color="${HEART}"/><stop offset=".75" stop-color="#2a8a2a" stop-opacity=".6"/><stop offset="1" stop-color="#0c1206" stop-opacity="0"/></radialGradient>`;
      g += `<circle cx="${tx}" cy="660" r="300" fill="${HEART}" opacity=".12"/><path d="M${tx - 150} 796 V640 Q${tx - 150} 520 ${tx} 500 Q${tx + 150} 520 ${tx + 150} 640 V796 Z" fill="#0c1206" ${O(6)}/><path d="M${tx - 130} 796 V646 Q${tx - 130} 536 ${tx} 520 Q${tx + 130} 536 ${tx + 130} 646 V796 Z" fill="url(#treeHeart)"/>`;

      for (const s of [-1, 1]) g += `<path d="M${f1(tx + s * 420)} 600 Q${f1(tx + s * 700)} 700 ${f1(tx + s * 1000)} 796" stroke="${k.INK}" stroke-width="70" fill="none" stroke-linecap="round"/><path d="M${f1(tx + s * 420)} 600 Q${f1(tx + s * 700)} 700 ${f1(tx + s * 1000)} 796" stroke="${TR}" stroke-width="60" fill="none" stroke-linecap="round"/><path d="M${f1(tx + s * 440)} 590 Q${f1(tx + s * 700)} 686 ${f1(tx + s * 990)} 780" stroke="${MOSSL}" stroke-width="8" fill="none" opacity=".6"/>`;

      let ms = ''; for (let i = 0; i < 20; i++) { const x = 100 + i * 220 + ((i * 41) % 60), y = 200 + ((i * 17) % 60), l = 80 + ((i * 31) % 120); ms += `M${f1(x)} ${f1(y)} q${(i % 2 ? 10 : -10)} ${f1(l * 0.5)} ${(i % 3) - 1} ${f1(l)}`; }
      g += `<path d="${ms}" stroke="${MOSS}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      P(0, L.W, g);
      for (const [x, y, l] of [[600, 200, 140], [1200, 220, 110], [3200, 210, 130], [3800, 190, 150], [tx - 420, 230, 160], [tx + 440, 240, 150]]) P(x - 30, x + 30, `<path d="M${x} ${y} V${y + l}" stroke="${k.INK}" stroke-width="3"/>` + lamp(k, x, y + l, 1.2));
    },
    decor(k) {
      (k.L.hx.backHouses || []).forEach(([a, b], i) => {
        if (b - a < 170) return;
        const x1 = Math.min(b - 10, a + 180), f = { x0: a + 10, x1, B: 792, wall: 100 + (i * 13) % 22, up: 110, lv: 2 };
        k.P(a, b, house(k, f, { door: false, noWin: true }).g + win(k, i % 2 ? a + 34 : x1 - 60, 792 - f.wall + 26, 26, 32, 2) + k.door(i % 2 ? x1 - 42 : a + 52, 792, 38, 60, LOGD));
      });
    },
    building(id, lot, f, k) {
      if (id === 'anvil') return k.ART.anvil(lot) + shroom(k, lot.x0 + 10, 790, 1.2);
      const B = BLD[id]; return B ? `<g data-ol="${id}" data-lv="${f.lv}">${B(lot, f, k)}</g>` : '';
    },
    cottage(c, k) {
      const s = k.depthK(c.base), w = (c.x1 - c.x0) / s, cx = (c.x0 + c.x1) / 2, x0 = cx - w / 2, x1 = cx + w / 2;
      const f = { x0, x1, B: 795, wall: 100 + (c.v % 20), up: 100, lv: 2 };
      const g0 = house(k, f, { door: false, noWin: true }).g + win(k, c.v % 2 ? x0 + 26 : x1 - 56, 795 - f.wall + 26, 28, 32, 2) + k.door(c.v % 2 ? x1 - 42 : x0 + 42, 795, 38, 60, LOGD);
      return { g: k.ell(cx, c.base + 4, (c.x1 - c.x0) / 2 + 16, 11) + `<g transform="translate(${cx} ${c.base}) scale(${s}) translate(${-cx} -795)">${g0}</g>`, h: Math.round(290 * s + 40) };
    },
    prop(p, k) {
      const { x, y } = p, s = p.s || 1, { f1, O, INK } = k;
      if (p.k === 'sprout') {

        let g = k.ell(x, y + 4, 100, 20) + `<circle cx="${x}" cy="${y - 120}" r="120" fill="${HEART}" opacity=".12"/>`;
        for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8, rx = x + Math.cos(a) * 90, ry = y + Math.sin(a) * 22 + 6; g += `<ellipse cx="${f1(rx)}" cy="${f1(ry)}" rx="18" ry="11" fill="#7a7a78" ${O(2.5)}/>`; }
        g += `<path d="M${x - 70} ${y + 2} Q${x - 30} ${y - 30} ${x - 6} ${y - 10} M${x + 70} ${y + 4} Q${x + 30} ${y - 26} ${x + 6} ${y - 10}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M${x - 70} ${y + 2} Q${x - 30} ${y - 30} ${x - 6} ${y - 10} M${x + 70} ${y + 4} Q${x + 30} ${y - 26} ${x + 6} ${y - 10}" stroke="${TR}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
        g += `<path d="M${x - 10} ${y - 4} Q${x - 14} ${y - 100} ${x - 4} ${y - 170} H${x + 4} Q${x + 14} ${y - 100} ${x + 10} ${y - 4} Z" fill="${TRL}" ${O(3)}/><path d="M${x} ${y - 120} q-30 -10 -50 -40 M${x} ${y - 150} q30 -6 46 -34" stroke="${TR}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
        for (const [dx, dy, r] of [[-50, -170, 30], [44, -190, 32], [0, -220, 34], [-20, -180, 26], [26, -158, 24]]) g += `<circle cx="${x + dx}" cy="${y + dy}" r="${r}" fill="${LEAF[2]}" ${O(2.5)}/>`;
        for (const [dx, dy] of [[-40, -176], [36, -196], [4, -230], [-12, -200], [24, -168]]) g += `<path d="M${x + dx} ${y + dy - 8} q6 8 0 16 q-6 -8 0 -16 Z" fill="${HEART}"/>`;
        g += `<ellipse cx="${x}" cy="${y - 14}" rx="12" ry="9" fill="${HEART}" ${O(2)}/><circle cx="${x}" cy="${y - 14}" r="22" fill="${HEART}" opacity=".3"/>`;
        if (s !== 1) g = `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${g}</g>`;
        return { g, w: 240 * s, h: 280 * s };
      }
      if (p.k === 'glowshroom') return { g: shroom(k, x - 8, y, 1.2) + shroom(k, x + 10, y + 2, 0.8), w: 50, h: 50, flat: true };
      if (p.k === 'amberlamp') return { g: k.ell(x, y, 12, 4) + `<path d="M${x} ${y} V${y - 120} q0 -10 14 -10" stroke="${INK}" stroke-width="7" fill="none"/><path d="M${x} ${y} V${y - 120}" stroke="${TR}" stroke-width="3.5"/>` + lamp(k, x + 14, y - 128, 0.9), w: 60, h: 160 };
      if (p.k === 'rootarch') return { g: k.ell(x, y, 60, 10) + `<path d="M${x - 60} ${y} Q${x - 40} ${y - 110} ${x} ${y - 100} Q${x + 40} ${y - 96} ${x + 60} ${y}" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M${x - 60} ${y} Q${x - 40} ${y - 110} ${x} ${y - 100} Q${x + 40} ${y - 96} ${x + 60} ${y}" stroke="${TR}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M${x - 40} ${y - 70} Q${x} ${y - 100} ${x + 40} ${y - 70}" stroke="${MOSSL}" stroke-width="5" fill="none"/>` + shroom(k, x - 30, y, 0.8), w: 150, h: 130 };
      return null;
    },
  };

  return {
    id: 'tree', ver: 1, name: 'Мохец', layout, art,
    story: 'Деревня хранителей у подножия Мирового Древа: за домами поднимается исполинский ствол с сияющим дуплом-сердцем и рунами на коре, сверху нависает тёмная крона с бородами мха и янтарными фонарями. Дома - срубы под мхом с дверями в арках корней, а на площади хранители растят Росток Древа из упавшего семени.',
  };
});
