









(function () {
  'use strict';
  const K = window.LGTownKitMap, A = window.LGTownKitArt;
  if (!K) return;

  function meta(id) { const M = window.LGCityMap, b = M && (M.BUILDINGS || []).find((x) => x.id === id); return b || {}; }
   
  function buildings(list, building, now) {
    return list.map((b) => {
      const bt = building && building[b.id], build = bt && +bt.until > now ? { to: +bt.to, until: +bt.until } : null;
      const m = meta(b.id), [x0, y0, x1, y1] = b.vis;
      return { id: b.id, title: m.title || b.title, sub: m.sub || '', icon: m.icon || '🏠', hit: [x0, x1, y0, y1], top: b.foot[1], door: { x: b.door.x, y: b.door.y },
        ...(m.soon ? { soon: true } : {}), ...(m.magic ? { magic: true } : {}), ...(m.mine ? { mine: true } : {}), ...(b.id === 'jail' ? { jail: true } : {}), ...(build ? { build } : {}), lv: b.lv };
    });
  }
   
  function wrap(M, BLD, W, H) {
    const BS = BLD.slice().sort((p, q) => q.hit[3] - p.hit[3]);
    const buildingAt = (x, y) => BS.find((b) => x >= b.hit[0] && x <= b.hit[1] && y >= b.hit[2] && y <= b.hit[3]) || null;



    const hoverAt = (x, y) => { const b = buildingAt(x, y); return b && (y < b.top || !M.free(x, y)) ? { id: b.id, what: '', ol: b.id, r: b.hit } : null; };
    return { W, H, QW: 0, AREA: { x0: 0, x1: W, y0: 0, y1: H }, OBST: M.OB, BUILDINGS: BLD, free: M.free, nearest: (x, y) => M.nearest(x, y), clear: M.clear,
      path: (a, b) => M.path(a, b), buildingAt, hoverAt, hitOb: M.hitOb, grid: { C: M.C, cols: M.cols, rows: M.rows, G: M.G }, levelAt: M.levelAt, cats: M };
  }
   
  function build(T, o) {
    o = o || {};
    const now = o.now || Date.now(), lvMap = K.mapLevels(o.levels, o.building, now);
    const L = K.layoutOf(T), M = K.townAt(T, lvMap), R = A.drawTown(T, { ...o, now });
    const BLD = buildings(K.levelled(T, lvMap), o.building, now).filter((b) => !b.magic || o.magic);
    const map = wrap(M, BLD, L.W, L.H);

    const an = L.buildings.find((b) => b.id === 'anvil') || L.buildings.find((b) => b.id === 'forge');
    const anv = an ? { ox: Math.round((an.vis[0] + an.vis[2]) / 2 - 480), oy: Math.round(an.vis[3] - 66 - 330), k: 2 } : null;
    const hit = (b) => anv && b.x < anv.ox + 960 && b.x + b.w > anv.ox && b.y < anv.oy + 540 + 200 && b.y + b.h > anv.oy;


    return { map, layers: R.layers, props: R.props, sky: R.sky, anv, near: { layers: R.layers.filter(hit), props: R.props.filter(hit) }, scale: K.SCALE, spawn: spawn(T), id: L.id, biome: L.biome, fx: R.fx,
      ext: R.ext || null, edge: R.ext && L.edge ? { ...L.edge } : null, glade: R.glade || null };
  }
   
  function spawn(T) { const L = K.layoutOf(T), g = L.gate; return L.spawn ? L.spawn.slice() : g ? [g.door.x, g.door.y - 170] : [L.W / 2, L.H / 2]; }
  window.LGTownKitCity = { meta, buildings, wrap, build, spawn, SCALE: K.SCALE, SPEED: K.SPEED };
})();
