












(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LGTownKitMap = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const STAIR = 3;
  const PAD = 12;
  const SPEED = 325;
  const SCALE = 0.62;
  const RAIL = 18;
  const SCREEN = [1920, 1080];
  const f1 = (v) => Math.round(v * 10) / 10;


  function rng(seed) { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

   
  const rimY = (pts, x) => { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (x <= b[0]) { const t = b[0] === a[0] ? 0 : (x - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * Math.max(0, Math.min(1, t)); } } return pts[pts.length - 1][1]; };

  function faces(rim, h) { const out = []; for (let i = 1; i < rim.length; i++) { const a = rim[i - 1], b = rim[i]; out.push([[a[0], a[1] - 4], [b[0], b[1] - 4], [b[0], b[1] + h], [a[0], a[1] + h]]); } return out; }
  function inPoly(P, x, y) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
  function segDist(px, py, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; let t = L ? ((px - a[0]) * dx + (py - a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - a[0] - dx * t, py - a[1] - dy * t); }
  function nearPoly(P, x, y, pad) { if (inPoly(P, x, y)) return true; if (!pad) return false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if (segDist(x, y, P[j], P[i]) < pad) return true; return false; }
  const boxOf = (o) => (o.r ? o.r : o.e ? [o.e[0] - o.e[2], o.e[1] - o.e[3], o.e[0] + o.e[2], o.e[1] + o.e[3]] : o.p.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [Infinity, Infinity, -Infinity, -Infinity]));

  function curvePts(pts, step = 12) {
    if (pts.length < 3) return pts;
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
      for (let k = 1; k <= n; k++) { const t = k / n, u = 1 - t; out.push([u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0], u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1]]); }
    }
    return out;
  }

  

  function itemOb(it, r, e) {
    const s = it.s || 1;
    switch (it.k) {
      case 'tree': case 'blossom': e(it.x, it.y - 4, 18 * s, 10 * s, 'tree'); break;
      case 'pine': e(it.x, it.y - 4, 16 * s, 9 * s, 'tree'); break;
      case 'bush': e(it.x, it.y - 10, 30, 14, 'bush'); break;
      case 'lamp': e(it.x, it.y - 3, 9, 6, 'lamp'); break;
      case 'well': e(it.x, it.y - 34, 84, 44, 'well'); break;
      case 'bench': r(it.x - 56, it.y - 22, it.x + 56, it.y, 'bench'); break;
      case 'cart': r(it.x - 70, it.y - 50, it.x + 70, it.y, 'cart'); break;
      case 'flowers': e(it.x, it.y - 10, it.w / 2, 18, 'flowers'); break;
      case 'signpost': e(it.x, it.y - 3, 8, 6, 'sign'); break;
      case 'box': r(it.x - 34, it.y - 34, it.x + 34, it.y, 'box'); break;
      case 'pot': e(it.x, it.y - 8, 22, 12, 'pot'); break;
      case 'crate': r(it.x - 30, it.y - 36, it.x + 30 + (it.n > 2 ? 30 : 0), it.y, 'crate'); break;
      case 'barrel': e(it.x, it.y - 10, 22, 13, 'barrel'); break;
      case 'laundry': e(it.x, it.y - 3, 7, 5, 'post'); e(it.x2, it.y2 - 3, 7, 5, 'post'); break;
      case 'fence': case 'wattle': if (it.y === it.y2) r(Math.min(it.x, it.x2) - 6, it.y - 14, Math.max(it.x, it.x2) + 6, it.y + 4, 'fence'); else r(it.x - 8, Math.min(it.y, it.y2) - 12, it.x + 8, Math.max(it.y, it.y2) + 4, 'fence'); break;
      case 'dummy': e(it.x, it.y - 6, 22, 12, 'dummy'); break;
      case 'target': e(it.x, it.y - 6, 26, 10, 'target'); break;
      case 'post': e(it.x, it.y - 6, 18, 10, 'post'); break;
      case 'coal': e(it.x, it.y - 18, 60, 30, 'coal'); break;
      case 'woodpile': r(it.x - 70, it.y - 40, it.x + 70, it.y, 'woodpile'); break;
      case 'grind': e(it.x, it.y - 10, 30, 14, 'grind'); break;
      case 'bucket': e(it.x, it.y - 6, 14, 8, 'bucket'); break;
      case 'haystack': e(it.x, it.y - 24, 70, 34, 'hay'); break;
      case 'haycart': r(it.x - 90, it.y - 60, it.x + 90, it.y, 'cart'); break;
      case 'sack': r(it.x - 30, it.y - 30, it.x + 30 + (it.n > 2 ? 20 : 0), it.y, 'sack'); break;
      case 'lotboard': r(it.x - 60, it.y - 14, it.x + 60, it.y, 'board'); break;
      case 'jailyard': r(it.x - 250, it.y - 6, it.x - 140, it.y + 26, 'bench'); break;
      case 'garden': r(it.x - it.w / 2, it.y - it.h, it.x + it.w / 2, it.y, 'garden'); break;
      case 'mailbox': e(it.x, it.y - 3, 9, 6, 'mailbox'); break;
      case 'tables': r(it.x - 150, it.y - 40, it.x - 40, it.y, 'table'); r(it.x + 40, it.y - 40, it.x + 150, it.y, 'table'); break;
      case 'reeds': e(it.x, it.y - 8, 30, 14, 'reeds'); break;
      case 'fisher': break;
      case 'telescope': e(it.x, it.y - 10, 34, 16, 'telescope'); break;
      case 'rock': e(it.x, it.y - 12, 44 * s, 22 * s, 'rock'); break;
      case 'wagon': r(it.x - 56, it.y - 52, it.x + 56, it.y, 'wagon'); break;
      case 'orepile': e(it.x, it.y - 20, 70, 30, 'ore'); break;
      case 'picks': e(it.x, it.y - 8, 30, 12, 'picks'); break;
      case 'minesign': e(it.x, it.y - 4, 10, 6, 'sign'); break;
      case 'picnic': r(it.x - 80, it.y - 46, it.x + 80, it.y, 'picnic'); break;
      case 'sandpit': break;

      case 'rowan': if (it.ring) e(it.x, it.y - 6, 84 * s, 28 * s, 'tree'); else e(it.x, it.y - 4, 18 * s, 10 * s, 'tree'); break;
      case 'hives': r(it.x - (it.n || 3) * 27 - 8, it.y - 16, it.x + (it.n || 3) * 27 + 8, it.y, 'hives'); break;
      case 'racks': r(it.x - 66, it.y - 12, it.x + 66, it.y + 2, 'racks'); break;
      default: break;
    }
  }

  






  function make(spec) {
    const W = spec.W, H = spec.H, pad = spec.pad != null ? spec.pad : PAD, OB = spec.OB || [];
    const C = spec.C || 16, cols = Math.ceil(W / C), rows = Math.ceil(H / C);
    const TOWN = spec.bounds, TIERS = spec.tiers || [], BASE = spec.base || 1, STAIRS = spec.stairs || [], RL = spec.rail != null ? spec.rail : RAIL;
    const OVER = spec.over || [], LIFT = OVER.filter((o) => o.lift);

    const BIN = 256, bw = Math.ceil(W / BIN), bins = new Map();
    for (const ob of OB) { const b = boxOf(ob); ob.box = b; for (let i = Math.max(0, Math.floor((b[0] - pad - 2) / BIN)); i <= Math.floor((b[2] + pad + 2) / BIN); i++) for (let j = Math.max(0, Math.floor((b[1] - pad - 2) / BIN)); j <= Math.floor((b[3] + pad + 2) / BIN); j++) { const k = j * bw + i; if (!bins.has(k)) bins.set(k, []); bins.get(k).push(ob); } }
    function hitOb(x, y, pd) {
      const L = bins.get(Math.floor(y / BIN) * bw + Math.floor(x / BIN)); if (!L) return null;
      for (const ob of L) {
        const b = ob.box; if (x < b[0] - pd || x > b[2] + pd || y < b[1] - pd || y > b[3] + pd) continue;
        if (ob.r) return ob;
        if (ob.e) { const [cx, cy, rx, ry] = ob.e; if (((x - cx) / (rx + pd)) ** 2 + ((y - cy) / (ry + pd * 0.7)) ** 2 < 1) return ob; continue; }
        if (nearPoly(ob.p, x, y, pd)) return ob;
      }
      return null;
    }
    const inStair = (x, y) => { for (const s of STAIRS) if (x >= s.x0 + RL && x <= s.x1 - RL && y >= s.y0 && y <= s.y1) return s; return null; };
    const inRects = (R, x, y) => { for (const q of R) if (x >= q[0] && x <= q[2] && y >= q[1] && y <= q[3]) return true; return false; };
     
    function levelRaw(x, y) {
      if (x < 0 || y < 0 || x >= W || y >= H) return 0;
      if (inStair(x, y)) return STAIR;
      for (const t of TIERS) if (inPoly(t.poly, x, y)) return t.lv;
      for (const o of LIFT) if (inRects(o.rects, x, y)) return o.lv;
      return inPoly(TOWN, x, y) ? BASE : 0;
    }

    const inTownPad = (x, y) => { for (let i = 0, j = TOWN.length - 1; i < TOWN.length; j = i++) if (segDist(x, y, TOWN[j], TOWN[i]) < pad) return false; return true; };
     
    function lvFree(x, y) {
      const lv = levelRaw(x, y); if (!lv) return 0;

      if (lv === STAIR) { const s = inStair(x, y); return x >= s.x0 + RL + pad * 0.5 && x <= s.x1 - RL - pad * 0.5 ? STAIR : 0; }
      for (const o of OVER) if (lv === o.lv && inRects(o.rects, x, y)) return lv;
      if (!inTownPad(x, y)) return 0;

      return hitOb(x, y, pad) ? 0 : lv;
    }
    const free = (x, y) => lvFree(x, y) > 0;

    const G = new Uint8Array(cols * rows);
    const cx = (c) => c * C + C / 2, cy = (r) => r * C + C / 2;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) G[r * cols + c] = lvFree(cx(c), cy(r));
    const okc = (c, r) => c >= 0 && r >= 0 && c < cols && r < rows && G[r * cols + c] > 0;
    const compat = (a, b) => a === b || a === STAIR || b === STAIR;

    function clear(a, b) {
      let lp = lvFree(a[0], a[1]); if (!lp) return false;
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / 4));
      for (let i = 1; i <= n; i++) { const t = i / n, l = lvFree(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t); if (!l || !compat(lp, l)) return false; lp = l; }
      return true;
    }
    const home = spec.home;
    function nearest(x, y, lvWant) {
      x = Math.max(0, Math.min(W - 1, +x || 0)); y = Math.max(0, Math.min(H - 1, +y || 0));
      { const rx = Math.round(x), ry = Math.round(y), l = lvFree(rx, ry); if (l && (!lvWant || compat(l, lvWant))) return [rx, ry]; }
      const c0 = Math.floor(x / C), r0 = Math.floor(y / C);
      for (let d = 1; d < 80; d++) {
        let best = null, bd = Infinity;
        for (let r = r0 - d; r <= r0 + d; r++) for (let c = c0 - d; c <= c0 + d; c++) {
          if (Math.max(Math.abs(c - c0), Math.abs(r - r0)) !== d || !okc(c, r)) continue;
          if (lvWant && !compat(G[r * cols + c], lvWant)) continue;
          const dd = (cx(c) - x) ** 2 + (cy(r) - y) ** 2; if (dd < bd) { bd = dd; best = [cx(c), cy(r)]; }
        }
        if (best) return best;
      }
      return [home.x, home.y];
    }
    function okCell(x, y) {
      const c0 = Math.max(0, Math.min(cols - 1, Math.floor(x / C))), r0 = Math.max(0, Math.min(rows - 1, Math.floor(y / C)));
      const l0 = lvFree(x, y);
      if (okc(c0, r0) && clear([x, y], [cx(c0), cy(r0)])) return [c0, r0];
      for (let d = 1; d < 6; d++) for (let r = r0 - d; r <= r0 + d; r++) for (let c = c0 - d; c <= c0 + d; c++) if (okc(c, r) && (!l0 || compat(l0, G[r * cols + c])) && clear([x, y], [cx(c), cy(r)])) return [c, r];
      return [c0, r0];
    }
    const N = cols * rows, gS = new Float32Array(N), from = new Int32Array(N), seen = new Uint32Array(N), shut = new Uint32Array(N), EDGE = new Uint8Array(N * 8);
    const heap = [], hv = []; let st = 0;
    const edgeOk = (i, c, r, dc, dr) => {
      const k = i * 8 + ((dr + 1) * 3 + (dc + 1)) - (((dr + 1) * 3 + (dc + 1)) > 4 ? 1 : 0);
      let v = EDGE[k]; if (!v) { v = clear([cx(c), cy(r)], [cx(c + dc), cy(r + dr)]) ? 1 : 2; EDGE[k] = v; }
      return v === 1;
    };
     
    function path(a, b, po) {
      const maxN = (po && po.max) || Infinity;
      a = nearest(a[0], a[1]); b = nearest(b[0], b[1]);
      if (clear(a, b)) return [a, b];
      const [sc, sr] = okCell(a[0], a[1]), [tc, tr] = okCell(b[0], b[1]);
      if (++st >= 0xffffffff) { st = 1; seen.fill(0); shut.fill(0); }
      const g = (i) => (seen[i] === st ? gS[i] : Infinity);
      const s = sr * cols + sc, t = tr * cols + tc;
      heap.length = 0; hv.length = 0;
      const push = (i, f) => { heap.push(i); hv.push(f); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (hv[p] <= hv[k]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; [hv[p], hv[k]] = [hv[k], hv[p]]; k = p; } };
      const pop = () => { const top = heap[0], li = heap.pop(), lv = hv.pop(); if (heap.length) { heap[0] = li; hv[0] = lv; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && hv[l] < hv[m]) m = l; if (r < heap.length && hv[r] < hv[m]) m = r; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; [hv[m], hv[k]] = [hv[k], hv[m]]; k = m; } } return top; };
      const hh = (c, r) => Math.hypot(c - tc, r - tr);
      gS[s] = 0; from[s] = -1; seen[s] = st; push(s, hh(sc, sr));
      let found = false;
      let nExp = 0;
      while (heap.length) {
        if (++nExp > maxN) break;
        const i = pop(); if (shut[i] === st) continue; shut[i] = st;
        if (i === t) { found = true; break; }
        const c = i % cols, r = (i / cols) | 0, li = G[i];
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nc = c + dc, nr = r + dr; if (!okc(nc, nr)) continue;
          const j = nr * cols + nc; if (!compat(li, G[j])) continue;
          if (dr && dc && (!okc(c + dc, r) || !okc(c, r + dr))) continue;
          if (!edgeOk(i, c, r, dc, dr)) continue;
          const gg = gS[i] + (dr && dc ? 1.4142 : 1);
          if (gg < g(j)) { gS[j] = gg; from[j] = i; seen[j] = st; push(j, gg + hh(nc, nr)); }
        }
      }
      if (!found) return [a];
      const cells = []; for (let i = t; i !== -1 && i !== s; i = from[i]) cells.push([cx(i % cols), cy((i / cols) | 0)]);
      cells.reverse();
      const pts = [a, ...cells]; if (!cells.length || clear(cells[cells.length - 1], b)) pts.push(b);
      const out = [pts[0]];
      for (let i = 0; i < pts.length - 1;) {
        let lo = i + 1, step = 1, hi = -1;
        while (lo + step < pts.length) { if (clear(pts[i], pts[lo + step])) { lo += step; step *= 2; } else { hi = lo + step; break; } }
        if (hi < 0) hi = pts.length;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (clear(pts[i], pts[mid])) lo = mid; else hi = mid; }
        out.push(pts[lo]); i = lo;
      }
      return out.map((p) => [Math.round(p[0]), Math.round(p[1])]);
    }
     
    const BS = (spec.buildings || []).slice().sort((p, q) => q.vis[3] - p.vis[3]);
    function buildingAt(x, y) { for (const b of BS) { const v = b.vis; if (x >= v[0] && x <= v[2] && y >= v[1] && y <= v[3]) return b; } return null; }
     
    const stepOk = (a, b) => clear(a, b);
    return { W, H, C, cols, rows, G, OB, pad, free, levelAt: lvFree, compat, clear, nearest, path, buildingAt, stepOk, hitOb, BUILDINGS: spec.buildings || [], home, spawn: spec.spawn || [home.x, home.y - 80] };
  }

  



  const SHARE = [0.46, 0.6, 0.74, 0.87, 1], HSHARE = [0.62, 0.72, 0.82, 0.91, 1], FIXED = { gate: 1, mine: 1, guild: 1 };
  const lvClamp = (lv) => Math.max(1, Math.min(5, Math.round(+lv || 1)));
  function plotOf(b, lv) {
    lv = lvClamp(lv);
    if (FIXED[b.id] || b.fixed) return { vis: b.vis, foot: b.foot };
    if (b.plots && b.plots[lv - 1]) return { vis: b.plots[lv - 1].vis, foot: b.plots[lv - 1].foot };
    if (lv === 5) return { vis: b.vis, foot: b.foot };
    const [x0, y0, x1, B] = b.vis, f = b.foot, w = Math.round((x1 - x0) * SHARE[lv - 1]), h = Math.round((B - y0) * HSHARE[lv - 1]);
    const nx0 = Math.round(Math.max(x0, Math.min(x1 - w, b.door.x - w / 2))), nx1 = nx0 + w;
    const li = Math.max(0, f[0] - x0), ri = Math.max(0, x1 - f[2]);
    return { vis: [nx0, B - h, nx1, B], foot: [nx0 + li, Math.round(f[3] - (f[3] - f[1]) * HSHARE[lv - 1]), nx1 - ri, f[3]] };
  }
   
  function mapLevels(levels, building, now) {
    const out = { ...(levels || {}) }, t = now == null ? Date.now() : now;
    for (const [id, v] of Object.entries(building || {})) if (v && +v.until > t && +v.to > 0) out[id] = Math.max(+out[id] || 1, +v.to);
    return out;
  }
   
  function levelled(T, levels) {
    const L = layoutOf(T), lvOf = (id) => lvClamp((levels || {})[id] || L.lv || 1);
    return L.buildings.map((b) => { const lv = lvOf(b.id), P = plotOf(b, lv); return { ...b, vis: P.vis, foot: P.foot, lvl: lv, vis5: b.vis, foot5: b.foot }; });
  }
  const levelKey = (T, levels) => { const L = layoutOf(T); return L.buildings.map((b) => (FIXED[b.id] || b.fixed ? 0 : lvClamp((levels || {})[b.id] || L.lv || 1))).join(''); };

  



  function layoutOf(T) {
    if (T.__tk) return T.__tk;
    const [sw, sh] = T.size || [2, 2], W = T.W || SCREEN[0] * sw, H = T.H || SCREEN[1] * sh;
    const tiers = (T.tiers || []).map((t) => ({ ...t, faces: t.rim ? faces(t.rim, t.face || 150) : [] }));
    const rocks = (T.rocks || []).map((t) => ({ ...t, faces: t.rim ? faces(t.rim, t.face || 140) : [] }));
    const gate = (T.buildings || []).find((b) => b.id === 'gate') || null;
    const L = { ...T, W, H, tiers, rocks, gate, buildings: T.buildings || [], houses: T.houses || [], items: T.items || [], stairs: T.stairs || [], water: T.water || [], bridges: T.bridges || [], streets: T.streets || [], paths: T.paths || [] };
    Object.defineProperty(T, '__tk', { value: L, enumerable: false });
    return L;
  }
  function townObstacles(T, o) {
    const L = layoutOf(T), O = [], BL = levelled(T, o && o.levels);
    const r = (x0, y0, x1, y1, tag) => O.push({ r: [x0, y0, x1, y1], tag });
    const e = (cx, cy, rx, ry, tag) => O.push({ e: [cx, cy, rx, ry], tag });
    for (const b of BL) {
      if (b.id === 'mine') continue;
      if (b.ob && b.lvl === 5) { for (const q of b.ob) O.push({ ...q, tag: 'building:' + b.id }); continue; }
      if (b.pass) { r(b.foot[0], b.foot[1], b.pass[0], b.foot[3], 'building:' + b.id); r(b.pass[2], b.foot[1], b.foot[2], b.foot[3], 'building:' + b.id); continue; }
      r(b.foot[0], b.foot[1], b.foot[2], b.foot[3], 'building:' + b.id);
    }
    for (const h of L.houses) r(h.foot[0], h.foot[1], h.foot[2], h.foot[3], 'house:' + h.id);
    for (const y of L.yards || []) r(y.r[0], y.r[1], y.r[2], y.r[3], 'yard:' + (y.id || ''));
    for (const it of L.items) itemOb(it, r, e);
    for (const w of L.water) O.push({ p: w.poly, tag: 'water' });
    if (L.wall) { const Wl = L.wall, g = Wl.gate; if (g) { r(Wl.x0, Wl.y0, g[0], Wl.y1 + 40, 'wall'); r(g[1], Wl.y0, Wl.x1, Wl.y1 + 40, 'wall'); } else r(Wl.x0, Wl.y0, Wl.x1, Wl.y1 + 40, 'wall'); }
    for (const t of L.tiers) { for (const f of t.faces) O.push({ p: f, tag: 'cliff' }); for (const s of t.sides || []) O.push({ p: s, tag: 'cliff' }); }
    for (const t of L.rocks) { O.push({ p: t.poly, tag: 'rock' }); for (const f of t.faces) O.push({ p: f, tag: 'rock' }); }
    for (const q of (o && o.extra) || []) O.push(q);
    return O;
  }
   
  function town(T, o) {
    const L = layoutOf(T), pad = (o && o.pad) != null ? o.pad : PAD;
    const over = L.bridges.map((b) => ({ lv: b.lv || 1, rects: b.rects }));
    if (L.gate && L.gate.pass) { const g = L.gate.pass, y0 = L.wall ? L.wall.y0 - 44 : g[1]; over.push({ lv: L.gate.lv || 1, lift: true, rects: [[g[0] + pad, y0, g[2] - pad, g[3]]] }); }
    const home = L.gate ? L.gate.door : (L.buildings[0] || { door: { x: L.W / 2, y: L.H / 2 } }).door;
    return make({ W: L.W, H: L.H, pad, OB: townObstacles(T, o), bounds: L.town, tiers: [...L.rocks.map((t) => ({ lv: 0, poly: t.poly })), ...L.tiers.map((t) => ({ lv: t.lv, poly: t.poly }))],
      stairs: L.stairs, over, buildings: levelled(T, o && o.levels), home, spawn: L.spawn || [home.x, home.y - 80] });
  }

  const MAPS_MAX = 24;
   
  function townAt(T, levels) {
    const L = layoutOf(T), k = levelKey(T, levels);
    if (!L.__maps) Object.defineProperty(L, '__maps', { value: new Map(), enumerable: false });
    let M = L.__maps.get(k);
    if (!M) { if (L.__maps.size >= MAPS_MAX) L.__maps.delete(L.__maps.keys().next().value); M = town(T, { levels }); L.__maps.set(k, M); }
    return M;
  }

   
  const pathLen = (p) => { let d = 0; for (let i = 1; i < p.length; i++) d += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return d; };
   
  function stepAlong(st, dt, speed) {
    let x = st.x, y = st.y, p = st.path && st.path.length ? st.path.slice() : null, left = (speed || SPEED) * dt, dx = 0;
    while (p && p.length && left > 0) {
      const [tx, ty] = p[0], d = Math.hypot(tx - x, ty - y);
      if (d <= left) { dx = tx - x || dx; x = tx; y = ty; left -= d; p.shift(); }
      else { const k = left / d; dx = tx - x; x += (tx - x) * k; y += (ty - y) * k; left = 0; }
    }
    return { x, y, path: p && p.length ? p : null, dx };
  }
  

  function stepOk(M, a, b, max, search = 6000) {
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1) return true;
    if (!M.free(a[0], a[1])) return true;
    if (M.clear(a, b)) return true;
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) > max) return false;
    const p = M.path(a, b, { max: search }), e = p[p.length - 1];
    if (!e || Math.hypot(e[0] - b[0], e[1] - b[1]) > 3) return false;
    return pathLen(p) <= max;
  }


  




  const FOREST_B = new WeakMap();
  function forestAt(T, x, y) {
    const L = layoutOf(T);
    let bottom = FOREST_B.get(L);
    if (bottom == null) { const TB = boxOf({ p: L.town }), WL = L.wall && L.wall.k === 'palisade' ? L.wall : null; bottom = WL ? Math.max(TB[3], WL.y1) : TB[3]; FOREST_B.set(L, bottom); }
    if (inPoly(L.town, x, y) || L.tiers.some((t) => inPoly(t.poly, x, y)) || L.rocks.some((t) => inPoly(t.poly, x, y) || t.faces.some((f) => inPoly(f, x, y)))) return false;
    if (y > bottom - 10) return false;
    const g = L.glade;
    if (g && g.poly && inPoly(g.poly, x, y)) return false;
    if (g) for (const p of g.spots || []) { if (p.gate) continue; const rx = p.rx || 170, ry = p.ry || 120; if (Math.hypot((x - p.x) / rx, (y - p.y - 10) / (y < p.y ? ry + 10 : 150)) < 1) return false; }
    return true;
  }
  function tsarArea(T) {
    const L = layoutOf(T), P = 50, blocks = [], g = L.glade;
    if (g) {
      for (const p of g.spots || []) { if (p.gate) continue; const rx = p.rx || 170, ry = p.ry || 120; blocks.push([p.x - rx - P, p.y - ry - 140, p.x + rx + P, p.y + 160 + P, 'место монстров ' + p.x + ',' + p.y]); }
      if (g.poly) { const b = boxOf({ p: g.poly }); blocks.push([b[0] - P, b[1] - 140, b[2] + P, b[3] + P, 'поляна у Ворот']); }
      if (g.sign) blocks.push([g.sign[0] - 40, g.sign[1] - 160, g.sign[0] + 170, g.sign[1] + 30, 'указатель «В поход»']);
    }
    for (const b of L.buildings.concat(L.houses)) if (b.vis) blocks.push([b.vis[0] - P, b.vis[1] - 80, b.vis[2] + P, b.vis[3] + P, 'здание ' + b.id]);
    if (L.wall) blocks.push([L.wall.x0 - P, L.wall.y0 - 240, L.wall.x1 + P, L.wall.y1 + P, 'стена']);
    const TB = boxOf({ p: L.town });
    return { bounds: [0, 0, L.W, L.H], ok: (x, y) => forestAt(T, x, y), blocks, size: [400, 200], k: [0.8, 1.4], margin: 48, prefer: T.tsarNear || [(TB[0] + TB[2]) / 2, Math.max(120, TB[1] / 2)] };
  }

  return { STAIR, PAD, SPEED, SCALE, RAIL, SCREEN, SHARE, HSHARE, FIXED, f1, rng, rimY, faces, inPoly, segDist, nearPoly, boxOf, curvePts, itemOb, make, layoutOf, plotOf, mapLevels, levelled, levelKey,
    townObstacles, town, townAt, pathLen, stepAlong, stepOk, forestAt, tsarArea };
});
