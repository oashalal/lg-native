






(function (root, factory) {
  const M = factory();
  if (typeof module === 'object' && module.exports) module.exports = M;
  else root.LGFish2Sim = M;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

   
  function rng(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  


  const FISH = {
    roach:   { n: 'Плотва', g: 'f', kg: [0.1, 0.4], p: 1, xb: 4, kind: 'calm', bp: 'small', z: { near: 30, mid: 10, far: 0 }, col: '#c9d3dc', tier: 0 },
    crucian: { n: 'Карась', g: 'm', kg: [0.2, 0.8], p: 1, xb: 6, kind: 'calm', bp: 'small', z: { near: 25, mid: 18, far: 4 }, col: '#d9b45a', tier: 0 },
    perch:   { n: 'Окунь', g: 'm', kg: [0.2, 1.2], p: 2, xb: 9, kind: 'jerky', bp: 'perch', z: { near: 15, mid: 22, far: 8 }, col: '#8fb14a', tier: 1 },
    boot:    { n: 'Старый сапог', g: 'm', kg: [0.5, 0.5], p: 0, xb: 0, kind: 'junk', bp: 'drag', z: { near: 12, mid: 3, far: 0 }, col: '#6b4b34', tier: 0, junk: 1 },
    bream:   { n: 'Лещ', g: 'm', kg: [0.8, 3], p: 3, xb: 18, kind: 'heavy', bp: 'bream', z: { near: 0, mid: 22, far: 16 }, col: '#b9a37a', tier: 1 },
    pike:    { n: 'Щука', g: 'f', kg: [1.5, 7], p: 6, xb: 35, kind: 'jerky', bp: 'pike', z: { near: 0, mid: 10, far: 22 }, col: '#6f8f3a', tier: 2 },
    zander:  { n: 'Судак', g: 'm', kg: [1, 5], p: 5, xb: 30, kind: 'jerky', bp: 'perch', z: { near: 0, mid: 4, far: 16 }, col: '#9aa98a', tier: 2 },
    catfish: { n: 'Сом', g: 'm', kg: [5, 25], p: 12, xb: 70, kind: 'heavy', bp: 'cat', z: { near: 0, mid: 0, far: 12 }, col: '#4d4a44', tier: 2 },
    gcarp:   { n: 'Золотой карп', g: 'm', kg: [2, 6], p: 25, xb: 150, kind: 'heavy', bp: 'bream', z: { near: 0, mid: 0.6, far: 2.5 }, col: '#f2b631', tier: 2, rare: 1 },
    chest:   { n: 'Сундук со дна', g: 'm', kg: [0, 0], p: 0, xb: 0, kind: 'item', bp: 'drag', z: {}, col: '#a0692e', tier: 2, epic: 1 },
    legend:  { n: 'Старый Сом Рябиненя', g: 'm', kg: [48, 72], p: 250, xb: 0, kind: 'legend', bp: 'cat', z: {}, col: '#d9a436', tier: 3, epic: 1 },
  };
   
  const LAKE = ['roach', 'crucian', 'perch', 'bream', 'pike', 'zander', 'catfish', 'gcarp'];
   
  const KIND = {
    calm:   { zone: [0.3, 0.78], spike: 0.45, spikeP: 0.18, drift: 0.04 },
    jerky:  { zone: [0.33, 0.74], spike: 0.95, spikeP: 0.35, drift: 0 },
    heavy:  { zone: [0.32, 0.76], spike: 0.6, spikeP: 0.2, drift: 0.16 },
    junk:   { zone: [0.25, 0.85], spike: 0, spikeP: 0, drift: 0.08 },
    item:   { zone: [0.34, 0.72], spike: 0.8, spikeP: 0.28, drift: 0.1 },
    legend: { zone: [0.32, 0.76], spike: 0.75, spikeP: 0.24, drift: 0.13 },
  };
   
  const DIFF = { roach: 0.7, crucian: 0.75, boot: 0.65, perch: 0.9, bream: 1.0, pike: 1.05, zander: 1.05, catfish: 1.6, gcarp: 1.6, chest: 1.1, legend: 1.2 };
   
  const BP = {
    small: { dur: 0.22, win: [0.55, 0.8], under: 0.45, ru: 'частая мелкая дрожь' },
    perch: { dur: 0.16, win: [0.6, 0.85], under: 0.65, ru: 'пара резких тычков' },
    pike:  { dur: 0.35, win: [0.45, 0.65], under: 0.7, ru: 'одно резкое утапливание' },
    bream: { dur: 0.9, win: [0.8, 1.1], under: 0.3, ru: 'поплавок ложится набок' },
    cat:   { dur: 1.3, win: [1.3, 1.7], under: 0.4, ru: 'медленно и долго тонет' },
    drag:  { dur: 1.0, win: [0.9, 1.2], under: 0.4, ru: 'тяжело ползёт вбок' },
  };
  const ZONE = (d) => (d < 0.38 ? 'near' : d < 0.72 ? 'mid' : 'far');
   
  const FIGHT = { near: [6, 9], mid: [9, 15], far: [15, 26] };
   
  const MAST_XP = [0, 300, 950, 1860, 3000, 4340, 5870, 7590, 9470, 11510];
   
  const PERKS = {
    2: { id: 'float', n: 'Чуткий поплавок', d: 'окно подсечки +0,15 с' },
    4: { id: 'stamina', n: 'Выносливость', d: 'рыба устаёт на 15% быстрее' },
    6: { id: 'far', n: 'Дальний заброс', d: 'шкала дальности медленнее у конца' },
    8: { id: 'sense', n: 'Рыбье чутьё', d: 'места клёва чаще' },
    10: { id: 'master', n: 'Мастер', d: 'шанс сундука ×1,5' },
  };
   
  const ROD_REQ = [
    { coins: 100, mast: 1, fish: { any: 10 } },
    { coins: 300, mast: 3, fish: { perch: 5 } },
    { coins: 800, mast: 5, fish: { pike: 3, bream: 5 } },
    { coins: 2000, mast: 8, fish: { catfish: 1, gcarp: 1 } },
  ];
  const ROD_MAX = 5;

  function mastLv(xp) { let l = 1; for (let i = 1; i < MAST_XP.length; i++) if (xp >= MAST_XP[i]) l = i + 1; return l; }
  function perksOf(lv) { return Object.keys(PERKS).filter((k) => lv >= +k).map((k) => PERKS[k].id); }

   
  function pick(zone, o, r) {
    o = o || {}; r = r || Math.random;
    const B = o.boost || 1, H3 = o.hot ? 3 : 1;
    if (zone === 'far' && !o.noLegend && r() < (o.legendP != null ? o.legendP : 0.003) * B) return 'legend';
    const chestP = ({ far: 0.006, mid: 0.0015 }[zone] || 0) * (o.chestK || 1) * B * H3 * (o.master ? 1.5 : 1);
    if (r() < chestP) return 'chest';
    const list = []; let sum = 0;
    for (const id of Object.keys(FISH)) { const f = FISH[id]; let w = f.z[zone] || 0; if (f.rare) w *= B * H3; if (w > 0) { list.push([id, w]); sum += w; } }
    let x = r() * sum;
    for (const [id, w] of list) { x -= w; if (x <= 0) return id; }
    return list[0][0];
  }

  

  function bite(id, zone, hot, r, o) {
    o = o || {}; r = r || Math.random;
    const rnd = (a, b) => a + r() * (b - a), f = FISH[id], P = BP[f.bp], q = r();
    const eps = hot ? 1 : zone === 'near' ? (q < 0.7 ? 1 : 2) : zone === 'mid' ? (q < 0.5 ? 1 : 2) : (q < 0.35 ? 1 : q < 0.75 ? 2 : 3);
    let wait = hot ? rnd(1.8, 3.5) : zone === 'near' ? rnd(3, 6) : zone === 'mid' ? rnd(4.5, 9) : rnd(6.5, 13);
    wait = Math.max(wait, 1.2 + eps * 1.3);
    const at = [];
    for (let tries = 0; at.length < eps && tries < 60; tries++) { const t = rnd(0.7, wait - 0.9); if (at.every((x) => Math.abs(x - t) > 1)) at.push(t); }
    at.sort((a, b) => a - b);
    const nibs = [];
    for (const t of at) {
      if (f.bp === 'small') { const m = Math.floor(rnd(2, 4)); for (let j = 0; j < m; j++) nibs.push([Math.round((t + j * 0.27) * 1000), 180]); }
      else if (f.bp === 'perch') { nibs.push([Math.round(t * 1000), 140]); nibs.push([Math.round((t + 0.26) * 1000), 140]); }
      else nibs.push([Math.round(t * 1000), Math.round(Math.min(0.7, P.dur * 0.6) * 1000)]);
    }
    nibs.sort((a, b) => a[0] - b[0]);
    const form = r() < P.under ? 'under' : 'side';
    const win = rnd(P.win[0], P.win[1]) * (zone === 'far' && f.bp !== 'cat' ? 0.85 : 1) + (o.float ? 0.15 : 0);
    return { biteAt: Math.round(wait * 1000), nibs, form, kind: f.bp, winMs: Math.round(win * 1000), falseN: at.length };
  }

   
  function fightParams(id, kg, zone, rod, o) {
    o = o || {};
    const f = FISH[id], K = KIND[f.kind], df = DIFF[id] || 1, r = Math.max(0, (rod || 1) - 1);
    const span = FIGHT[zone] || FIGHT.near, heavy = f.kg[1] > f.kg[0] ? clamp((kg - f.kg[0]) / (f.kg[1] - f.kg[0]), 0, 1) : 0.5;
    const need = id === 'legend' ? 40 : span[0] + (span[1] - span[0]) * clamp(heavy * 0.7 + (o.jit != null ? o.jit : 0.5) * 0.3, 0, 1);
    const zc = (K.zone[0] + K.zone[1]) / 2, zh = (K.zone[1] - K.zone[0]) / 2 * clamp(1 + (1 - df) * 0.6, 0.7, 1.25);
    const zone2 = [clamp(zc - zh, 0.12, 0.6) - 0.015 * r, clamp(zc + zh, 0.5, 0.9) + 0.015 * r];
    return {
      id, legend: id === 'legend' ? 1 : 0, df, rod: r + 1, zone: zone2.map((v) => Math.round(v * 1e4) / 1e4),
      spike: K.spike * df, spikeP: K.spikeP * df, drift: K.drift * Math.min(df, 1.15), need: Math.round(need * 100) / 100,
      stamina: o.stamina ? 1 : 0, perfect: o.perfect ? 1 : 0,
    };
  }

  const DT = 1 / 60;
  



  const GRACE = 1.2, LAG_READY = 0.6, LAG_MAX_MS = 15000;
  function graceOf(lagMs) { const l = Math.round(+lagMs || 0); return l > 0 ? Math.max(GRACE, Math.min(l, LAG_MAX_MS) / 1000 + LAG_READY) : GRACE; }
  

  function fightStepper(seed, P, o) {
    const r = rng(seed), rnd = (a, b) => a + r() * (b - a), rd = Math.max(0, (P.rod || 1) - 1), breakAt = 1 + 0.02 * rd;
    const hard = P.df >= 1.05, leg = !!P.legend, base = P.zone.slice();
    const S = { T: 0.5, grace: graceOf(o && o.lagMs), warnT: 0, spikeT: 0, spikeDir: 1, low: 0, prog: P.perfect ? P.need * 0.25 : 0, phase: 1, zone: base.slice(), done: false, won: false, why: '', n: 0, held: 0, inputs: [], need: P.need, hard, err: 0, zs: 0 };
    let acc = 0;
    function one(h) {
      if (S.done) return;
      if (h !== S.held) { S.held = h; S.inputs.push([Math.round(S.n * 1000 / 60), h]); }
      S.n++;
      const dt = DT;
      if (S.grace > 0) { S.grace -= dt; return; }
      let spikeP = P.spikeP;
      if (leg) {
        const k = S.prog / P.need, ph = k < 1 / 3 ? 1 : k < 2 / 3 ? 2 : 3;
        if (ph !== S.phase) { S.phase = ph; S.zone = ph === 3 ? [base[0] + 0.06, base[1] - 0.06] : base.slice(); }
        if (S.phase === 2) spikeP *= 2; if (S.phase === 3) spikeP *= 1.5;
      }
      S.T += (h ? 0.34 * (1 - 0.04 * rd) : -0.3) * dt;
      S.T += P.drift * dt;
      if (S.warnT > 0) { S.warnT -= dt; if (S.warnT <= 0) S.spikeT = hard ? rnd(0.45, 0.85) : rnd(0.3, 0.6); }
      else if (S.spikeT > 0) {
        const pw = P.spike * (hard ? 1.5 : 1.15) * (leg ? 1.25 : 1), right = S.spikeDir > 0 ? !h : !!h, damp = right ? (hard ? 0.3 : 0.25) : 1;
        S.T += S.spikeDir * pw * damp * dt; S.spikeT -= dt;
      } else if (r() < spikeP * dt) {
        S.spikeDir = hard && r() < (leg ? 0.5 : 0.4) ? -1 : 1;
        S.warnT = leg && S.phase === 3 ? 0.4 : hard ? 0.5 : 0.7;
      }
      S.T = clamp(S.T, 0, breakAt + 0.05);
      const lo = S.zone[0], hi = S.zone[1];

      const zs = S.T > hi ? 1 : S.T < lo ? -1 : 0; if (zs && zs !== S.zs) S.err++; S.zs = zs;
      if (S.T >= breakAt) { S.done = true; S.won = false; S.why = 'break'; return; }
      if (S.T < lo) { S.low += dt; S.prog -= dt * 0.35; if (S.low > 2.2) { S.done = true; S.won = false; S.why = 'slack'; return; } }
      else { S.low = Math.max(0, S.low - dt); if (S.T <= hi) S.prog += dt * (P.stamina ? 1.15 : 1); else S.prog -= dt * 0.15; }
      S.prog = Math.max(0, S.prog);
      if (S.prog >= P.need) { S.done = true; S.won = true; S.why = 'ok'; }
    }
    return {
      S,
       
      step(dt, held) { acc += Math.min(0.25, Math.max(0, dt)); const h = held ? 1 : 0; while (acc >= DT && !S.done) { acc -= DT; one(h); } return S; },
      one,
      get inputs() { return S.inputs.slice(); },
    };
  }

  

  function fight(seed, P, inputs, maxSec, o) {
    const st = fightStepper(seed, P, o), lim = Math.round((maxSec || (P.need * 3 + 10)) * 60);
    const sw = new Map();
    for (const x of Array.isArray(inputs) ? inputs : []) { if (!Array.isArray(x)) continue; const n = Math.round((+x[0] || 0) * 60 / 1000); if (n >= 0 && n <= lim) sw.set(n, x[1] ? 1 : 0); }
    let h = 0;
    for (let n = 0; n < lim && !st.S.done; n++) { if (sw.has(n)) h = sw.get(n); st.one(h); }
    const S = st.S;
    return { won: !!(S.done && S.won), why: S.done ? S.why : 'timeout', tEnd: Math.round(S.n / 60 * 100) / 100, prog: Math.round(S.prog * 100) / 100, steps: S.n, err: S.err };
  }

  


  return { rng, clamp, FISH, LAKE, KIND, DIFF, BP, ZONE, FIGHT, MAST_XP, PERKS, ROD_REQ, ROD_MAX, mastLv, perksOf, pick, bite, fightParams, fightStepper, fight, DT, GRACE, LAG_READY, LAG_MAX_MS, graceOf };
});












(function () {
  'use strict';
  let R = null, cv = null, g = null, X = null;
  const W = 900, H = 620;
  let DPR = 1, SC = 1, LW = W, LH = H, OX = 0, OY = 0, L0 = 0, L1 = W, T0 = 0;
  function resize() {
    if (!cv) return;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    const vw = innerWidth, vh = innerHeight;
    cv.width = Math.round(vw * DPR); cv.height = Math.round(vh * DPR);

    const port = vw / vh < 0.9;
    SC = port ? Math.min(vh / H, vw / 440) : Math.min(vh / H, vw / 560); LW = vw / SC; LH = vh / SC;
    OX = port ? LW / 2 - 520 : (LW - W) / 2; OY = LH - H;
  }
  const anyModal = () => !!(R && R.querySelector('.modal.on'));
  const $ = (id) => (R ? R.querySelector(`[data-i="${id}"]`) : null);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const INK = '#2b2121';
  const SIM = () => window.LGFish2Sim || null;

   

  const FISH0 = {
    roach:  { n: 'Плотва', g: 'f', kg: [0.1, 0.4], kind: 'calm', bp: 'small', col: '#c9d3dc' },
    crucian:{ n: 'Карась', g: 'm', kg: [0.2, 0.8], kind: 'calm', bp: 'small', col: '#d9b45a' },
    perch:  { n: 'Окунь', g: 'm', kg: [0.2, 1.2], kind: 'jerky', bp: 'perch', col: '#8fb14a' },
    boot:   { n: 'Старый сапог', g: 'm', kg: [0.5, 0.5], kind: 'junk', bp: 'drag', col: '#6b4b34' },
    bream:  { n: 'Лещ', g: 'm', kg: [0.8, 3], kind: 'heavy', bp: 'bream', col: '#b9a37a' },
    pike:   { n: 'Щука', g: 'f', kg: [1.5, 7], kind: 'jerky', bp: 'pike', col: '#6f8f3a' },
    zander: { n: 'Судак', g: 'm', kg: [1, 5], kind: 'jerky', bp: 'perch', col: '#9aa98a' },
    catfish:{ n: 'Сом', g: 'm', kg: [5, 25], kind: 'heavy', bp: 'cat', col: '#4d4a44' },
    gcarp:  { n: 'Золотой карп', g: 'm', kg: [2, 6], kind: 'heavy', bp: 'bream', col: '#f2b631', rare: 1 },
    chest:  { n: 'Сундук со дна', g: 'm', kg: [0, 0], kind: 'item', bp: 'drag', col: '#a0692e', epic: 1 },
    legend: { n: 'Старый Сом Рябиненя', g: 'm', kg: [48, 72], kind: 'legend', bp: 'cat', col: '#d9a436', epic: 1 },
  };

  const FISH = new Proxy(FISH0, { get(t, id) {
    const s = SIM(), F = s && s.FISH && s.FISH[id];
    const base = t[id] || (F ? { n: F.n || String(id), g: 'm', kg: [0, 1], kind: 'calm', bp: 'small', col: '#c9d3dc' } : undefined);
    return F && base ? { ...base, ...F, col: base.col, bp: F.bp || base.bp } : base;
  } });
  const FISH_IDS = Object.keys(FISH0);
  const ITEMS = { star: { n: 'Счастливая звезда', col: '#ffd84d' }, sphere: { n: 'Сфера заточки', col: '#8a5cd6' } };
  const LAKE = ['roach', 'crucian', 'perch', 'bream', 'pike', 'zander', 'catfish', 'gcarp'];
  const ACC = { roach: 'плотву', crucian: 'карася', perch: 'окуня', bream: 'леща', pike: 'щуку', zander: 'судака', catfish: 'сома', gcarp: 'золотого карпа' };

  const KIND = {
    calm:  { zone: [0.3, 0.78], spike: 0.45, spikeP: 0.18, drift: 0.04 },
    jerky: { zone: [0.33, 0.74], spike: 0.95, spikeP: 0.35, drift: 0.0 },
    heavy: { zone: [0.32, 0.76], spike: 0.6, spikeP: 0.2, drift: 0.16 },
    junk:  { zone: [0.25, 0.85], spike: 0, spikeP: 0, drift: 0.08 },
    item:  { zone: [0.34, 0.72], spike: 0.8, spikeP: 0.28, drift: 0.1 },
    legend:{ zone: [0.32, 0.76], spike: 0.75, spikeP: 0.24, drift: 0.13 },
  };
  const DIFF = { roach: 0.7, crucian: 0.75, boot: 0.65, perch: 0.9, bream: 1.0, pike: 1.05, zander: 1.05, catfish: 1.6, gcarp: 1.6, chest: 1.1, legend: 1.2 };

  const BP = {
    small: { dur: 0.22, win: [0.55, 0.8], ru: 'частая мелкая дрожь' },
    perch: { dur: 0.16, win: [0.6, 0.85], ru: 'пара резких тычков' },
    pike:  { dur: 0.35, win: [0.45, 0.65], ru: 'одно резкое утапливание' },
    bream: { dur: 0.9, win: [0.8, 1.1], ru: 'поплавок ложится набок' },
    cat:   { dur: 1.3, win: [1.3, 1.7], ru: 'медленно и долго тонет' },
    drag:  { dur: 1.0, win: [0.9, 1.2], ru: 'тяжело ползёт вбок' },
  };
  const ZONE = (d) => (d < 0.38 ? 'near' : d < 0.72 ? 'mid' : 'far');
  const ZONE_RU = { near: 'близко', mid: 'середина', far: 'далеко', net: 'сети' };
  const SKILLS = { 2: ['Чуткий поплавок', 'окно подсечки +0,15 с'], 4: ['Выносливость', 'рыба устаёт на 15% быстрее'], 6: ['Дальний заброс', 'шкала дальности медленнее у конца'], 8: ['Рыбье чутьё', 'места клёва появляются чаще'], 10: ['Мастер', 'шанс сундука ×1,5'] };
  const SAY = {
    hi: ['Заходи, рыбак, показывай улов.', 'Клюёт сегодня, а?', 'Удочку беречь надо, как бороду.'],
    small: ['На уху сгодится.', 'Мелочь, а приятно.'],
    big: ['Добрый улов, не поспоришь!'],
    boot: ['Ну и лапоть! Даром заберу.'],
    cat: ['Вот это зверь! Родственник мой, небось.'],
    legend: ['Неужто сам Старый Сом?! Я его тридцать лет ловлю!'],
    fry: ['Жарю с лучком - пальчики оближешь.', 'На сковородку его, родимого.'],
    up: ['Новая леска - звон, а не леска!', 'Теперь и сома удержишь.'],
    poor: ['Монет маловато, рыбак. Налови ещё.'],
    req: ['Рано тебе новую удочку - сперва покажи, что умеешь.', 'Не всё ещё поймал, рыбак. Глянь список.', 'Удочка подождёт - наловись сперва.'],
    max: ['Лучше удочки во всём Рябинене нет.'],
    chest: ['Сундук со дна? Чьё ж это добро…'],
    empty: ['Ведро пустое? Ступай к воде.'],
    gift: ['Хороший подарок. На стене будет красоваться.'],
  };

  const ACH = [
    ['first', 'Первый улов', 'поймать первую рыбу'], ['f10', 'Десяток', 'поймать 10 рыб'], ['f100', 'Сотня', 'поймать 100 рыб'],
    ['kg5', 'Тяжеловес', 'рыба тяжелее 5 кг'], ['kg15', 'Богатырь', 'рыба тяжелее 15 кг'], ['perf', 'Твёрдая рука', '10 идеальных подсечек'],
    ['boot', 'Модник', 'выловить старый сапог'], ['chest', 'Кладоискатель', 'выловить сундук со дна'], ['legend', 'Легенда озера', 'поймать Старого Сома Рябиненя'],
    ['all', 'Рыбак Рябиненя', 'собрать всех рыб озера - титул'],
  ];
  const ACH_N = Object.fromEntries(ACH.map(([id, n]) => [id, n]));

   
  let V = null;
  let S = null;
  function fresh() {
    return { st: 'idle', power: 0, pDir: 1, held: false, t: 0, clock: 0, pops: [], popQ: [], bob: null, fish: null, pend: null, wait: 0, nib: 0, nibs: [], nibA: null,
      bite: 0, biteWin: 0.8, T: 0.5, Td: 0.5, prog: 0, low: 0, spikeT: 0, warnT: 0, spikeDir: 1, net: null, ripples: [], res: null, splash: [], conf: [],
      style: 'legion', sel: -1, hot: null, cat: null, catchA: null, netA: null, netPull: null, seen: 0, newAch: 0, bkHover: false };
  }

  const vBag = () => (V && Array.isArray(V.bag) ? V.bag : []);
  const vRod = () => clamp(Math.floor(+(V && V.rod) || 1), 1, 5);
  const vCasts = () => Math.max(0, Math.floor(+(V && V.casts) || 0));
  const vMax = () => Math.max(1, Math.floor(+(V && V.max) || 30));
   
  function vMast() {
    const m = V && V.mast;
    if (m && typeof m === 'object') { const lv = clamp(Math.floor(+m.lv || 1), 1, 10), T = (SIM() && SIM().MAST_XP) || [0, 300, 950, 1860, 3000, 4340, 5870, 7590, 9470, 11510]; return { lv, xp: +m.xp || 0, lo: m.lo != null ? +m.lo : +T[lv - 1] || 0, hi: m.hi != null ? +m.hi : m.next != null ? +m.next : T[lv] != null ? +T[lv] : null }; }
    return { lv: clamp(Math.floor(+m || 1), 1, 10), xp: 0, lo: 0, hi: null };
  }
  const mlvl = () => vMast().lv;
   
  function vBook() {
    const out = {}, c = (V && V.caught) || {}, r = (V && V.rec) || {};
    for (const [id, n] of Object.entries(c)) if (+n > 0) out[id] = { n: +n, max: +r[id] || 0 };
    return out;
  }
  const vAch = () => { const a = V && V.ach; if (Array.isArray(a)) return Object.fromEntries(a.map((x) => [typeof x === 'string' ? x : x && x.id, 1])); return a && typeof a === 'object' ? a : {}; };
  const kgStr = (kg) => (+kg || 0).toFixed(kg >= 10 ? 1 : 2).replace('.', ',');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const styleOf = (s) => ({ '42brothers': '42bratuhi', '42bro': '42bratuhi' }[s] || s || 'legion');


  const HOR = 236, NEAR = 520;
  const depthY = (d) => NEAR - (NEAR - HOR - 18) * Math.pow(d, 0.8);
  const depthK = (y) => clamp((y - HOR) / (NEAR - HOR), 0.06, 1);
  const ROD = { x: 560, y: 150 };
   
  const BUTT_X = () => Math.min(760, L1 - 170);
  

  const CHAT_PX = 384;

  const BK = () => {
    if (innerWidth <= 700 || innerHeight <= 480) {
      const btn = 72 / SC - OX, cr = Math.max(btn, S && S.chatR && !S.chatOver ? S.chatR[2] / SC - OX + 8 : btn);
      return Math.max(L0 + 56, cr) + 48;
    }
    return Math.max(L0 + 190, Math.min(((L0 + CHAT_PX / SC) + 70 + BUTT_X()) / 2, BUTT_X() - 150));
  };
  

  const GAUGE_X = (phone, y0, y1) => {
    let r = L1 - 2 - 16 / SC; const d = S && S.dockR;
    if (d && d[1] / SC - OY < y1 + 8 && d[3] / SC - OY > y0 - 8) r = Math.min(r, d[0] / SC - OX - 10 / SC);
    return r - (phone ? 20 : 28) / 2 - 42;
  };
  const NETX = () => Math.max(L0 + 110, 290), NETD = 0.3;

  


  const WAIT = new Map();

  const EARLY = new Map();
   
  const WAIT_MS = 15000;

  const RTTS = [];
  const rtt = () => { if (!RTTS.length) return 0; const a = RTTS.slice().sort((x, y) => x - y); return Math.round(a[a.length >> 1]); };
  

  function softOf(r) {
    if (!r) return 'net';
    if (r.busy) return 'busy';
    if (r.wait) return 'wait';
    const e = String(r.error || '');
    if (/слишком часто/i.test(e)) return 'often';
    if (/нет связи/i.test(e)) return 'net';
    return '';
  }
  

  const retryOk = (op, soft) => soft === 'busy' || ((op === 'view' || op === 'cat') && !!soft);
  const RETRY_MS = [600, 1400, 2800];
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  async function post(op, body) {
    let r = null;
    const t0 = performance.now();
    try { r = await X.api('/api/craftF2', { k: 'fish', a: op, ...body }); } catch (e) { r = null; }
    if (r && r.ok && r.id) { RTTS.push(performance.now() - t0); if (RTTS.length > 7) RTTS.shift(); }
    return r;
  }
  async function call(op, body = {}) {
    if (!X || !X.api) return { ok: false, error: 'нет связи' };
    const x0 = X;
    let r = null, soft = '';
    for (let k = 0; ; k++) {
      r = await post(op, body);
      soft = r && r.ok ? '' : softOf(r);
      if (!soft || !retryOk(op, soft) || k >= RETRY_MS.length) break;
      const ra = r && +r.retryAfter > 0 ? Math.min(3000, +r.retryAfter * 1000) : 0;
      await sleep(Math.max(RETRY_MS[k], ra) + Math.random() * 300);
      if (X !== x0 || !X || !X.api) return { ok: false, error: 'экран закрыт', soft: 1 };
    }
    if (!r) return { ok: false, error: 'нет связи', soft: 1 };

    if (!r.ok) return { ...r, ok: false, error: r.error || 'не вышло', ...(soft ? { soft: 1 } : {}) };
    if (r.x && typeof r.x === 'object' && r.x.op && !r.id) return { ...r.x, ok: true };
    if (r.data && typeof r.data === 'object') return { ...r.data, ok: true };
    if (!r.id) return { ...r, ok: true };
    const early = EARLY.get(r.id);
    if (early) { EARLY.delete(r.id); return answer(early.x); }
    return new Promise((res) => {
      WAIT.set(r.id, { res, op, t: Date.now() });
      setTimeout(() => { if (WAIT.has(r.id)) { WAIT.delete(r.id); res({ ok: false, error: 'игра не ответила - попробуй ещё раз', late: 1 }); } }, WAIT_MS);
    });
  }
   
  function answer(x) {
    const data = x.x && typeof x.x === 'object' ? x.x : {};
    return x.ok ? { ...data, ok: true } : { ...data, ok: false, error: x.error || data.error || 'не вышло' };
  }
   
  function result(x) {
    if (!x) return;
    const w = WAIT.get(x.id);
    const data = x.x && typeof x.x === 'object' ? x.x : {};
    if (w) { WAIT.delete(x.id); w.res(answer(x)); }
    else if (x.id && R) { const now = Date.now(); for (const [k, e] of EARLY) if (now - e.at > 30e3) EARLY.delete(k); EARLY.set(x.id, { x, at: now }); }
    if (x.ok && data.v && typeof data.v === 'object' && (data.v.on != null || data.v.casts != null)) setView(data.v);
    else if (data.stole && S) setView({ stole: data.stole });
  }
   
  let viewBusy = null, viewAgain = null, viewMiss = 0, viewRetry = 0;
  


  function refresh() {
    if (viewBusy) return viewAgain || (viewAgain = viewBusy.then(() => { viewAgain = null; return refresh(); }));
    viewBusy = call('view').then((r) => {
      viewBusy = null;

      const v = r && r.ok ? (r.v && typeof r.v === 'object' ? r.v : r) : null;
      const fresh = !!(v && (v.on != null || v.casts != null));
      if (fresh) { setView(v); viewMiss = 0; }

      if (r && r.ok && Array.isArray(r.fried) && r.fried.length && X && X.toast) X.toast(`Жареная рыба из ведра - в сумке героя: ${r.fried.map((x) => x && x.n).filter(Boolean).join(', ')}`);

      else if (r && r.ok && !fresh) { if (X) X.toast('Рыбалка: игра ответила без данных - обнови страницу', true); }
      else if (r && !r.ok && (r.late || r.soft)) viewSlow();
      else if (r && !r.ok && X) X.toast(r.error || 'Рыбалка не ответила', true);
      return r;
    });
    return viewBusy;
  }
  

  function viewSlow() {
    viewMiss++;
    if (!X || !R) return;
    if (S && S.viewed) return;
    if (viewMiss === 3 && X.toast) X.toast('Рыбалка: игра долго не отвечает - пробуем ещё', true);
    clearTimeout(viewRetry); viewRetry = setTimeout(() => { if (R && S && !S.viewed) refresh(); }, Math.min(10e3, 1500 * viewMiss));
  }

  

  const STEP = 1 / 60;
   
  function makeFight(F, lagMs) {
    const s = SIM();
    if (s && typeof s.fightStepper === 'function' && F.seed != null) {
      try { const st = s.fightStepper(F.seed, F.params || {}, { lagMs }); if (st && typeof st.step === 'function') return { sim: st, local: false }; } catch (e) { console.warn('[рыбалка] общая модель боя', e); }
    }
    return { sim: localFight(F, lagMs), local: true };
  }
   
  function localFight(F, lagMs) {
    const P = F.params || {}, id = P.id || F.id || 'roach', f = FISH[id] || FISH.roach, K = KIND[f.kind] || KIND.calm, df = +P.df || DIFF[id] || 1;
    const zone = Array.isArray(P.zone) ? P.zone.slice() : [K.zone[0], K.zone[1]], base = zone.slice();
    const need = +P.need || 10, r = vRod() - 1, breakAt = 1 + 0.02 * r;
    const o = { T: 0.5, spikeT: 0, warnT: 0, spikeDir: 1, phase: 1, prog: P.perfect ? need * 0.25 : 0, done: false, won: false, why: '', zone, need, low: 0, grace: lagMs > 0 ? Math.max(1.2, Math.min(lagMs, 15000) / 1000 + 0.6) : 1.2 };
    let rs = (+F.seed || 1) | 0; const rand = () => { rs = (rs + 0x6D2B79F5) | 0; let t = rs; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    return { step(dt, held) {
      if (o.done) return o;
      if (o.grace > 0) { o.grace -= dt; return o; }
      let spikeP = K.spikeP * df;
      if (id === 'legend') { const ph = o.prog / need < 1 / 3 ? 1 : o.prog / need < 2 / 3 ? 2 : 3; if (ph !== o.phase) { o.phase = ph; o.zone = ph === 3 ? [base[0] + 0.06, base[1] - 0.06] : base.slice(); } if (o.phase === 2) spikeP *= 2; if (o.phase === 3) spikeP *= 1.5; }
      o.T += (held ? 0.34 * (1 - 0.04 * r) : -0.3) * dt; o.T += K.drift * df * dt;
      const hard = df >= 1.05, leg = id === 'legend';
      if (o.warnT > 0) { o.warnT -= dt; if (o.warnT <= 0) o.spikeT = hard ? 0.45 + rand() * 0.4 : 0.3 + rand() * 0.3; }
      else if (o.spikeT > 0) { const pw = K.spike * df * (hard ? 1.7 : 1.15) * (leg ? 1.25 : 1), right = o.spikeDir > 0 ? !held : held; o.T += o.spikeDir * pw * (right ? (hard ? 0.4 : 0.25) : 1) * dt; o.spikeT -= dt; }
      else if (rand() < spikeP * dt) { o.spikeDir = hard && rand() < (leg ? 0.5 : 0.4) ? -1 : 1; o.warnT = leg && o.phase === 3 ? 0.4 : hard ? 0.5 : 0.7; }
      o.T = clamp(o.T, 0, breakAt + 0.05);
      const [lo, hi] = o.zone;
      if (o.T >= breakAt) { o.done = true; o.won = false; o.why = 'Леска порвалась!'; return o; }
      if (o.T < lo) { o.low += dt; o.prog -= dt * 0.35; if (o.low > 2.2) { o.done = true; o.won = false; o.why = `${f.n} ${f.g === 'f' ? 'ушла' : 'ушёл'} - леска ослабла`; return o; } }
      else { o.low = Math.max(0, o.low - dt); if (o.T <= hi) o.prog += dt * (mlvl() >= 4 ? 1.15 : 1); else o.prog -= dt * 0.15; }
      o.prog = Math.max(0, o.prog);
      if (o.prog >= need) { o.done = true; o.won = true; }
      return o;
    } };
  }



  function line(w) { g.lineWidth = w; g.strokeStyle = INK; g.lineJoin = 'round'; g.lineCap = 'round'; }
  function ell(x, y, rx, ry, fill, w = 4) { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } if (w) { line(w); g.stroke(); } }
  function tree(x, y, r, dark) { ell(x + 4, y + 6, r, r * 0.95, 'rgba(0,0,0,.18)', 0); ell(x, y, r, r * 0.95, dark ? '#2f6b3a' : '#3f8a45'); ell(x - r * 0.3, y - r * 0.3, r * 0.35, r * 0.3, dark ? '#3c7d46' : '#55a457', 0); }
  function pine(x, y, s) { g.fillStyle = '#2e6a3c'; line(4); for (let i = 0; i < 3; i++) { const yy = y - i * 22 * s, w = (40 - i * 10) * s; g.beginPath(); g.moveTo(x, yy - 34 * s); g.lineTo(x + w, yy); g.lineTo(x - w, yy); g.closePath(); g.fill(); g.stroke(); } }
  function cattail(x, y, sw = 0) {

    line(3); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x, y - 20, x + sw, y - 34); g.stroke();
    g.save(); g.translate(x + sw, y - 38); g.rotate(sw * 0.035); ell(0, 0, 4, 10, '#6b4b34', 3); g.restore();
    line(3); g.strokeStyle = '#3f7d35'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 10 + sw * 0.3, y - 18, x - 14 + sw * 0.7, y - 26); g.stroke();
  }
  function pad(x, y, r) { g.beginPath(); g.ellipse(x, y, r, r * 0.6, 0, 0.3, Math.PI * 2 - 0.1); g.lineTo(x, y); g.closePath(); g.fillStyle = '#6aae4c'; g.fill(); line(3); g.stroke(); }


  const TREES = Array.from({ length: 110 }, (_, i) => ({ x: i * 31 - 1200 + ((i * 53) % 17), h: 30 + ((i * 29) % 34), w: 20 + ((i * 13) % 14), pine: i % 3 !== 0, far: i % 2 === 0 })).sort((a, b) => (b.far ? 1 : 0) - (a.far ? 1 : 0));
  const SPARK = Array.from({ length: 90 }, (_, i) => ({ x: (i * 127) % 2400 - 750, y: HOR + 10 + ((i * 71) % (NEAR - HOR - 20)), p: i * 0.7 }));

  const PADS = [[120, 300], [820, 330], [70, 420], [880, 470], [250, 385], [705, 415]].map(([x, y], i) => ({ x, y, ph: i * 1.9, jump: 0 }));
  const REEDS = [[30, 520, 1.3], [70, 510, 1.1], [870, 520, 1.3], [910, 505, 1.1], [20, 330, 0.6], [900, 300, 0.55], [330, 525, 0.9], [760, 528, 0.8]].map(([x, y, s], i) => ({ x, y, s, ph: i * 1.3 }));
  const CLOUDS = [{ x: 120, y: 70, s: 1.1, v: 5 }, { x: 470, y: 42, s: 1.4, v: 4 }, { x: 780, y: 96, s: 0.9, v: 6 }, { x: 1150, y: 60, s: 1.2, v: 5 }, { x: -300, y: 50, s: 1, v: 4.5 }, { x: 330, y: 130, s: 0.6, v: 7 }];
  function cloud(x, y, s) {
    const lobes = [[-46, 6, 30], [-18, -10, 36], [16, -16, 40], [48, -2, 30], [70, 10, 22], [-70, 12, 20]];
    g.save(); g.translate(x, y); g.scale(s, s);

    line(4); for (const [dx, dy, r] of lobes) { g.beginPath(); g.arc(dx, dy, r, 0, Math.PI * 2); g.stroke(); }

    g.fillStyle = '#d3e4ef'; for (const [dx, dy, r] of lobes) { g.beginPath(); g.arc(dx, dy, r, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#ffffff'; for (const [dx, dy, r] of lobes) { g.beginPath(); g.arc(dx, dy - r * 0.22, r * 0.86, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.ellipse(2, -30, 16, 9, -0.3, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function tree2(x, y, t) {
    const dark = t.far;
    if (t.pine) {
      const cols = dark ? ['#2f6a3d', '#3a7a47'] : ['#356f3f', '#4a8f50'];
      for (let i = 0; i < 3; i++) {
        const yy = y - i * t.h * 0.28, w = t.w * (1 - i * 0.22) / 2;
        g.fillStyle = cols[0]; line(2.5); g.beginPath(); g.moveTo(x, yy - t.h * 0.5); g.lineTo(x + w, yy); g.lineTo(x - w, yy); g.closePath(); g.fill(); g.stroke();
        g.fillStyle = cols[1]; g.beginPath(); g.moveTo(x, yy - t.h * 0.5 + 3); g.lineTo(x - w + 4, yy - 2); g.lineTo(x - w * 0.2, yy - 2); g.closePath(); g.fill();
      }
    } else {
      g.fillStyle = '#6b4b34'; line(2.5); g.fillRect(x - 2, y - 10, 4, 10); g.strokeRect(x - 2, y - 10, 4, 10);
      const c = dark ? '#3f8a48' : '#4f9a52';
      ell(x, y - t.h * 0.55, t.w * 0.62, t.h * 0.45, c, 2.5);
      ell(x - t.w * 0.2, y - t.h * 0.7, t.w * 0.22, t.h * 0.16, dark ? '#4f9a57' : '#68b064', 0);
      ell(x + t.w * 0.18, y - t.h * 0.45, t.w * 0.16, t.h * 0.12, dark ? '#4f9a57' : '#68b064', 0);
    }
  }
  function house(x, y, w, h, roof, wall) {
    g.fillStyle = wall; line(2.5); g.fillRect(x - w / 2, y - h, w, h); g.strokeRect(x - w / 2, y - h, w, h);

    g.fillStyle = roof; g.beginPath(); g.moveTo(x - w / 2 - 5, y - h); g.lineTo(x, y - h - h * 0.8); g.lineTo(x + w / 2 + 5, y - h); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = 'rgba(43,33,33,.35)'; g.lineWidth = 1.2; for (let i = 1; i < 3; i++) { const yy = y - h - h * 0.8 * (i / 3); g.beginPath(); g.moveTo(x - (w / 2 + 5) * (1 - i / 3), yy); g.lineTo(x + (w / 2 + 5) * (1 - i / 3), yy); g.stroke(); }

    g.fillStyle = '#ffe28a'; line(2); g.fillRect(x - w / 2 + 3, y - h + 4, w * 0.3, h * 0.35); g.strokeRect(x - w / 2 + 3, y - h + 4, w * 0.3, h * 0.35);
    g.fillStyle = '#8a5a30'; g.fillRect(x + w * 0.08, y - h * 0.55, w * 0.26, h * 0.55); g.strokeRect(x + w * 0.08, y - h * 0.55, w * 0.26, h * 0.55);
  }
  function village(x, y) {

    g.fillStyle = '#efe2c6'; line(2.5); g.fillRect(x + 52, y - 46, 14, 46); g.strokeRect(x + 52, y - 46, 14, 46);
    g.fillStyle = '#3d6fa8'; g.beginPath(); g.moveTo(x + 49, y - 46); g.lineTo(x + 59, y - 70); g.lineTo(x + 69, y - 46); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#ffe28a'; g.beginPath(); g.arc(x + 59, y - 36, 3, 0, Math.PI * 2); g.fill();
    house(x - 40, y, 26, 18, '#c8553d', '#f3e3c3');
    house(x - 8, y, 30, 22, '#d9894a', '#fff1d6');
    house(x + 26, y, 24, 17, '#b84a3a', '#efdcbc');

    g.fillStyle = '#7a5a48'; line(2); g.fillRect(x - 4, y - 40, 5, 9); g.strokeRect(x - 4, y - 40, 5, 9);
    for (let i = 0; i < 4; i++) { const tt = (S.clock * 0.4 + i / 4) % 1; g.fillStyle = `rgba(240,240,240,${0.7 * (1 - tt)})`; g.beginPath(); g.arc(x - 2 + Math.sin(tt * 6 + i) * 4 + tt * 10, y - 44 - tt * 30, 3 + tt * 5, 0, Math.PI * 2); g.fill(); }
  }
  function pier() {
    const top = NEAR + 40, VP = { x: W / 2 + 40, y: HOR - 160 };
    const spread = (x, yy) => VP.x + (x - VP.x) * (yy - VP.y) / (top - VP.y);

    const xs = []; for (let x = Math.floor((L0 - 300) / 64) * 64; x < L1 + 300; x += 64) xs.push(x);
    for (let i = 0; i < xs.length - 1; i++) {
      const a = xs[i], b = xs[i + 1];
      g.fillStyle = i % 3 === 0 ? '#a46c3c' : i % 3 === 1 ? '#b07745' : '#9b6537';
      g.beginPath(); g.moveTo(a, top); g.lineTo(b, top); g.lineTo(spread(b, H + 40), H + 40); g.lineTo(spread(a, H + 40), H + 40); g.closePath(); g.fill();

      g.strokeStyle = 'rgba(70,40,20,.35)'; g.lineWidth = 1.2;
      for (let j = 1; j < 3; j++) { const xa = a + (b - a) * (j / 3), w = Math.sin(i * 3 + j) * 6; g.beginPath(); g.moveTo(xa, top + 2); g.quadraticCurveTo(spread(xa, top + 40) + w, top + 40, spread(xa, H + 40), H + 40); g.stroke(); }

      g.fillStyle = '#4a3a30'; for (const yy of [top + 14, H - 26]) { const xm = spread((a + b) / 2, yy); g.beginPath(); g.arc(xm - 10 * (yy - VP.y) / (top - VP.y), yy, 2.2, 0, Math.PI * 2); g.arc(xm + 10 * (yy - VP.y) / (top - VP.y), yy, 2.2, 0, Math.PI * 2); g.fill(); }

      line(2.5); g.beginPath(); g.moveTo(b, top); g.lineTo(spread(b, H + 40), H + 40); g.stroke();
    }

    g.fillStyle = '#7a4d2a'; line(4); g.fillRect(L0, top - 10, L1 - L0, 14); g.strokeRect(L0 - 4, top - 10, L1 - L0 + 8, 14);
    g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(L0, top - 9, L1 - L0, 3);

    for (const x of [Math.max(L0 + 40, 60), Math.min(L1 - 40, 840)]) { g.fillStyle = '#6e4626'; line(4); g.fillRect(x - 12, top - 46, 24, 50); g.strokeRect(x - 12, top - 46, 24, 50); ell(x, top - 46, 12, 5, '#8d5f37', 3); g.strokeStyle = 'rgba(43,33,33,.4)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x - 4, top - 40); g.lineTo(x - 4, top); g.moveTo(x + 5, top - 36); g.lineTo(x + 5, top - 2); g.stroke(); }

    const rx = Math.min(L1 - 120, 780), ry = top + 46;
    ell(rx, ry, 30, 12, '#d8c08a', 3); ell(rx, ry, 20, 8, null, 2); ell(rx, ry, 10, 4, '#b89a62', 2);
  }
  function rr(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2); g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
   
  function plate(t, px, py, hl) {
    g.font = '900 12px system-ui'; const tw = g.measureText(t).width + 14;
    g.fillStyle = hl || 'rgba(30,22,22,.72)'; rr(px - tw, py - 10, tw, 20, 8); g.fill(); gq('plate', px - tw, py - 10, px, py + 10);
    if (hl) { line(2); g.stroke(); }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.6)'; g.strokeText(t, px - tw / 2, py + 1); g.fillStyle = '#fff'; g.fillText(t, px - tw / 2, py + 1); g.textBaseline = 'alphabetic';
  }
   
  function otext(t, x, y, size, col) {
    g.font = `900 ${size}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    g.lineWidth = size * 0.34; g.strokeStyle = INK; g.strokeText(t, x, y + 2);
    g.lineWidth = size * 0.2; g.strokeStyle = '#fff3d9'; g.strokeText(t, x, y);
    g.fillStyle = col; g.fillText(t, x, y); g.textBaseline = 'alphabetic';
  }
   
  function fishShape(id) {
    const f = FISH[id], col = f.col;
    if (id === 'boot') {
      g.fillStyle = col; line(4); g.beginPath(); g.moveTo(-14, -34); g.lineTo(12, -34); g.lineTo(12, 4); g.lineTo(36, 8); g.quadraticCurveTo(44, 18, 34, 22); g.lineTo(-16, 22); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#3b2a1e'; g.fillRect(-16, 16, 52, 6); g.strokeRect(-16, 16, 52, 6);
      g.fillStyle = 'rgba(120,200,255,.8)'; g.beginPath(); g.arc(-4, -40, 4, 0, Math.PI * 2); g.arc(6, -46, 3, 0, Math.PI * 2); g.fill();
      return;
    }
    if (id === 'chest') {
      g.fillStyle = col; line(4); rr(-32, -14, 64, 34, 5); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(-32, -14); g.quadraticCurveTo(0, -42, 32, -14); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#e8b93c'; for (const xx of [-20, 14]) { g.fillRect(xx, -30, 6, 50); g.strokeRect(xx, -30, 6, 50); }
      ell(0, -6, 6, 7, '#e8b93c', 3); g.fillStyle = INK; g.fillRect(-1.5, -7, 3, 6);
      g.fillStyle = 'rgba(80,140,60,.8)'; g.beginPath(); g.ellipse(-26, 18, 10, 4, 0.3, 0, Math.PI * 2); g.fill();
      return;
    }
    const whisk = id === 'catfish' || id === 'legend';
    g.fillStyle = col; line(4); g.beginPath(); g.moveTo(26, 0); g.lineTo(46, -16); g.quadraticCurveTo(40, 0, 46, 16); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(-8, -12); g.quadraticCurveTo(4, -26, 14, -11); g.closePath(); g.fill(); g.stroke();
    ell(0, 0, 32, whisk ? 15 : 13, col, 4);
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-2, 6, 24, 5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.ellipse(-6, -6, 14, 3, -0.15, 0, Math.PI * 2); g.fill();
    ell(-20, -3, 4.5, 4.5, '#fff', 2.5); g.fillStyle = INK; g.beginPath(); g.arc(-21, -3, 2, 0, Math.PI * 2); g.fill();
    line(2.5); g.beginPath(); g.moveTo(-31, 3); g.quadraticCurveTo(-26, 6, -22, 4); g.stroke();
    if (whisk) { line(2.5); g.beginPath(); g.moveTo(-30, 2); g.quadraticCurveTo(-46, 6, -50, 20); g.moveTo(-30, 4); g.quadraticCurveTo(-40, 14, -38, 26); g.stroke(); }
    if (id === 'legend') { for (let i = 0; i < 5; i++) { const a = S.clock * 3 + i * 1.25; g.fillStyle = `rgba(255,240,160,${0.6 + 0.4 * Math.sin(a * 2)})`; g.beginPath(); g.arc(Math.cos(a) * 44, Math.sin(a) * 24, 3, 0, Math.PI * 2); g.fill(); } }
  }
  function drawCatch() {
    const A = S.catchA, t = A.t, cy = Math.min(330, NEAR - 180), big = A.id === 'legend' ? 2.2 : 1.7;
    g.font = '900 30px system-ui'; const cx = freeX(cy - 46 * big - 26, Math.max(110 * big, g.measureText(A.it ? A.it.n : '').width + 30), cy + 40 * big).cx;
    let x, y, sc, rot = 0, alpha = 1;
    if (t < 0.55) { const q = t / 0.55, e = 1 - (1 - q) * (1 - q); x = A.x0 + (cx - A.x0) * e; y = A.y0 + (cy - A.y0) * e - Math.sin(q * Math.PI) * 110; sc = A.k0 * 0.8 + (big - A.k0 * 0.8) * e; rot = -0.9 * (1 - q) + Math.sin(q * 22) * 0.18; }
    else if (t < 1.75) {
      const q = t - 0.55; x = cx; y = cy + Math.sin(q * 5) * 5; sc = big * (1 + 0.04 * Math.sin(q * 9)); rot = Math.sin(q * 16) * 0.14 * Math.max(0, 1 - q);
      if (!A.conf) { A.conf = 1; const lots = A.rec || A.id === 'legend' || A.id === 'chest'; for (let i = 0; i < (lots ? 70 : 0); i++) S.conf.push({ x: cx, y: cy, vx: rnd(-300, 300), vy: rnd(-420, -120), r: rnd(0, 6), vr: rnd(-8, 8), t: rnd(0, 0.3), c: ['#ffd84d', '#e0503a', '#3fae5b', '#5aa9e6', '#8a5cd6', '#fff3d9'][i % 6] }); for (let i = 0; i < 12; i++) S.splash.push({ x: cx, y: cy + 20, vx: rnd(-140, 140), vy: rnd(-200, -60), t: 0 }); }
    } else { const q = clamp((t - 1.75) / 0.4, 0, 1), e = q * q; x = cx + (BK() - cx) * e; y = cy + (NEAR + 30 - cy) * e; sc = big * (1 - 0.8 * e); alpha = 1 - q * 0.5; rot = q * 1.4; }
    g.save(); g.globalAlpha = alpha;
    if (t >= 0.5 && t < 1.8) { const gl = g.createRadialGradient(cx, cy, 10, cx, cy, 150); gl.addColorStop(0, A.id === 'legend' ? 'rgba(255,220,100,.7)' : 'rgba(255,250,220,.55)'); gl.addColorStop(1, 'rgba(255,250,220,0)'); g.fillStyle = gl; g.fillRect(cx - 160, cy - 160, 320, 320); }
    g.translate(x, y); g.rotate(rot); g.scale(sc, sc); fishShape(A.id); gq('catchFish', x - 50 * sc, y - 46 * sc, x + 50 * sc, y + 30 * sc);
    g.restore();
    if (t >= 0.5 && t < 1.85) {
      const it = A.it, a = Math.min(1, (t - 0.5) / 0.15, (1.85 - t) / 0.15);
      g.save(); g.globalAlpha = a;
      { g.font = '900 30px system-ui'; const tw = g.measureText(it.n).width + 12; gq('catchText', cx - tw / 2, cy - 46 * big - 26, cx + tw / 2, cy - 46 * big + 18); }
      otext(it.n, cx, cy - 46 * big - 4, 30, A.id === 'legend' ? '#d99a12' : A.id === 'chest' ? '#8a5cd6' : '#c8553d');
      const sub = it.type === 'fish' || it.type === 'legend' ? `${kgStr(it.kg)} кг` : it.type === 'chest' ? 'Открой у Рыбака Сома' : 'Ну хоть не пусто…';
      otext(sub, cx, cy + 34 * big + 12, 24, '#2b2121');
      if (A.rec) { g.save(); g.translate(cx, cy - 46 * big - 40); g.rotate(-0.06); otext('Новый рекорд!', 0, 0, 26 + Math.sin(S.clock * 10) * 2, '#e0503a'); g.restore(); }
      g.restore();
    }
  }
   
  function netMesh(x, y, rx, ry, a) {
    g.save(); g.globalAlpha = a; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.save(); g.clip();
    g.strokeStyle = 'rgba(250,240,210,.85)'; g.lineWidth = 1.3;
    for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(x + i * rx / 6 - rx, y - ry); g.lineTo(x + i * rx / 6 + rx, y + ry); g.moveTo(x + i * rx / 6 + rx, y - ry); g.lineTo(x + i * rx / 6 - rx, y + ry); g.stroke(); }
    g.restore(); line(2.5); g.stroke();
    for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2; g.fillStyle = '#5a5f66'; g.beginPath(); g.arc(x + Math.cos(an) * rx, y + Math.sin(an) * ry, 2.2, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }
  function drawNet() {
    const nx = NETX(), ny = depthY(NETD), k = depthK(ny); S._rope = null;
    if (S.netA) {
      const q = clamp(S.netA.t / 1.2, 0, 1), sx = BK(), sy = NEAR + 10;
      if (q < 0.8) { const e = q / 0.8, x = sx + (nx - sx) * e, y = sy + (ny - sy) * e - Math.sin(e * Math.PI) * 190, r = 8 + 52 * k * e; g.save(); g.translate(x, y); g.rotate(e * 5); netMesh(0, 0, r, r * (0.4 + 0.6 * (1 - e)), 1); g.restore(); S._rope = { x, y, sag: -30 }; }
      else { const e = (q - 0.8) / 0.2; netMesh(nx, ny, 60 * k + 8, (60 * k + 8) * 0.3, 1 - e * 0.6); S._rope = { x: nx - 40 * k, y: ny, sag: 30 * e }; }
    }
    if (S.net && !S.netA) {

      const pts = []; for (let i = 0; i < 4; i++) { const bx = nx + (i - 1.5) * 34 * k * 1.4, by = ny + Math.sin(S.clock * 2.2 + i * 1.3) * 2.5 * k + (i % 2) * 4 * k; pts.push([bx, by]); }
      g.strokeStyle = 'rgba(250,240,210,.8)'; g.lineWidth = 1.5; g.setLineDash([4, 4]); g.beginPath(); pts.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.stroke(); g.setLineDash([]);
      S._rope = { x: pts[0][0], y: pts[0][1], sag: 34 };
      for (const [bx, by] of pts) { const s = 0.6 + k; g.save(); g.translate(bx, by); g.rotate(Math.sin(S.clock * 2.6 + bx) * 0.2); ell(0, -4 * s, 7 * s, 5 * s, '#e0503a', 2.5); g.fillStyle = '#fff'; g.fillRect(-7 * s, -5 * s, 14 * s, 2.5 * s); ell(0, 1, 9 * s, 2.5 * s, 'rgba(255,255,255,.5)', 0); g.restore(); }
      if (Math.random() < 0.01) ripple(nx + rnd(-40, 40) * k, ny, 0.4);
    }
    if (S.netPull) {
      const t = S.netPull.t, got = S.netPull.got, cx = (L0 + L1) / 2;
      let x, y, s, a = 1;
      if (t < 1.3) { const q = t / 1.3, e = 1 - (1 - q) * (1 - q); x = nx + (cx - 60 - nx) * e; y = ny + (NEAR - 190 - ny) * e - Math.sin(q * Math.PI) * 50; s = 0.5 + 0.9 * e; if (t < 0.3 && Math.random() < 0.3) ripple(nx, ny, 0.8); }
      else { const q = (t - 1.3) / 0.9, e = q * q; x = cx - 60 + (BK() - cx + 60) * e; y = NEAR - 190 + (NEAR + 20 - NEAR + 190) * e; s = 1.4 * (1 - 0.7 * e); a = 1 - q * 0.4; }

      S._rope = { x, y: y - 48 * s, sag: t < 1.3 ? 14 * (1 - t / 1.3) + 4 : 4, a };
      g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);

      got.forEach((it, i) => { g.save(); g.translate((i - (got.length - 1) / 2) * 13, 8 + (i % 2) * 10); g.rotate(1.2 + Math.sin(S.clock * 16 + i * 2) * 0.6); ell(0, 0, 13, 5, FISH[it.id].col, 2.5); g.restore(); });

      const sack = () => { g.beginPath(); g.moveTo(-10, -48); g.quadraticCurveTo(-58, 0, -40, 30); g.quadraticCurveTo(0, 54, 40, 30); g.quadraticCurveTo(58, 0, 10, -48); g.closePath(); };
      sack(); g.save(); g.clip(); g.strokeStyle = 'rgba(250,240,210,.9)'; g.lineWidth = 1.4; for (let i = -10; i <= 10; i++) { g.beginPath(); g.moveTo(i * 9 - 60, -50); g.lineTo(i * 9 + 60, 60); g.moveTo(i * 9 + 60, -50); g.lineTo(i * 9 - 60, 60); g.stroke(); } g.restore();
      sack(); line(3); g.stroke();

      for (let i = 0; i < 3; i++) { const q = (S.clock * 1.5 + i / 3) % 1; g.fillStyle = `rgba(150,210,255,${1 - q})`; g.beginPath(); g.arc(-20 + i * 20, 40 + q * 40, 3, 0, Math.PI * 2); g.fill(); }
      g.restore();
    }
  }
   
  function drawNetRope() {
    if (!S._rope && !S.net && !S.netPull && !S.netA) return;
    const px = BK() + 92, py = NEAR + 26;
    if (S._rope) {
      const R = S._rope, mx = (px + R.x) / 2, my = Math.max(py, R.y) + R.sag;
      g.save(); if (R.a != null) g.globalAlpha = Math.max(0.6, R.a); g.lineCap = 'round';
      g.strokeStyle = INK; g.lineWidth = 4.5; g.beginPath(); g.moveTo(px, py - 14); g.quadraticCurveTo(mx, my, R.x, R.y); g.stroke();
      g.strokeStyle = '#e8d6a6'; g.lineWidth = 2.4; g.stroke();
      g.restore();
    }

    gq('peg', px - 10, py - 26, px + 10, py + 6);
    g.fillStyle = '#7a5232'; line(3); g.beginPath(); g.rect(px - 7, py - 20, 14, 26); g.fill(); g.stroke();
    ell(px, py - 20, 10, 4, '#8f6440', 3);
    g.strokeStyle = '#e8d6a6'; g.lineWidth = 3; for (const yy of [py - 12, py - 6]) { g.beginPath(); g.moveTo(px - 7, yy); g.lineTo(px + 7, yy + 2); g.stroke(); }
  }
   
  function drawCat() {
    const C = S.cat, y = H - 14, right = C.st === 'come' || C.st === 'reach', walk = C.st !== 'reach'; gq('cat', C.x - 62, y - 72, C.x + 62, y + 4);
    const step = walk ? Math.sin(S.clock * 20) : 0, reachK = C.st === 'reach' ? 0.5 + 0.5 * Math.sin(S.clock * 4) : 0;
    g.save(); g.translate(C.x, y); g.scale(right ? 1 : -1, 1);
    ell(0, 2, 36, 7, 'rgba(0,0,0,.25)', 0);

    line(9); g.strokeStyle = INK; g.beginPath(); g.moveTo(-26, -20); g.quadraticCurveTo(-50, -30 + Math.sin(S.clock * 5) * 6, -44, -58); g.stroke();
    g.lineWidth = 5; g.strokeStyle = '#f08a24'; g.stroke();

    for (const [lx, ph] of [[-18, 0], [-8, Math.PI], [12, Math.PI], [22, 0]]) { g.fillStyle = '#e07a1a'; line(2.5); g.fillRect(lx - 4 + Math.sin(S.clock * 20 + ph) * 3 * (walk ? 1 : 0), -12, 8, 12); g.strokeRect(lx - 4 + Math.sin(S.clock * 20 + ph) * 3 * (walk ? 1 : 0), -12, 8, 12); }
    ell(0, -24 + step, 32, 16, '#f08a24', 3.5);
    g.strokeStyle = '#c4621a'; g.lineWidth = 3; for (const sx of [-14, -4, 6]) { g.beginPath(); g.moveTo(sx, -38 + step); g.lineTo(sx + 3, -28 + step); g.stroke(); }

    const hx = 30 + reachK * 8, hy = -40 + step + reachK * 4;
    for (const ex of [-9, 7]) { g.fillStyle = '#f08a24'; line(3); g.beginPath(); g.moveTo(hx + ex - 5, hy - 10); g.lineTo(hx + ex, hy - 24); g.lineTo(hx + ex + 6, hy - 10); g.closePath(); g.fill(); g.stroke(); }
    ell(hx, hy, 16, 14, '#f08a24', 3.5);
    ell(hx + 5, hy + 5, 8, 5, '#ffe2bf', 0);
    const scared = C.st === 'flee';
    for (const ex of [-5, 6]) { if (scared) ell(hx + ex, hy - 3, 3.5, 3.5, '#fff', 2); g.fillStyle = INK; g.beginPath(); g.arc(hx + ex, hy - 3, scared ? 1.5 : 2.2, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#e07070'; g.beginPath(); g.arc(hx + 12, hy + 2, 2.4, 0, Math.PI * 2); g.fill();
    g.strokeStyle = INK; g.lineWidth = 1.2; for (const d of [-3, 0, 3]) { g.beginPath(); g.moveTo(hx + 12, hy + 4); g.lineTo(hx + 26, hy + 2 + d * 1.5); g.stroke(); }

    if (C.st === 'reach') { line(3); g.fillStyle = '#f08a24'; g.beginPath(); g.ellipse(42 + reachK * 14, -46 - reachK * 10, 9, 6, -0.5, 0, Math.PI * 2); g.fill(); g.stroke(); }

    if (C.st === 'run' && C.fish) { g.save(); g.translate(hx + 18, hy + 8); g.rotate(0.3 + Math.sin(S.clock * 14) * 0.3); ell(0, 0, 13, 5, C.fish, 2.5); g.restore(); }
    g.restore();

    if (C.st === 'come' || C.st === 'reach') {
      const left = clamp(1 - C.t / 4, 0, 1), bx = C.x + 20, by = y - 92;
      ell(bx, by, 16, 16, '#fff3d9', 3); g.strokeStyle = '#e0503a'; g.lineWidth = 4; g.beginPath(); g.arc(bx, by, 21, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left); g.stroke();
      otext('!', bx, by + 1, 20, '#e0503a');
    }
  }

  const STY = {
    legion:      { n: 'Легион', pal: { a: '#c9952e', b: '#8c1f2b', c: '#2f4a8a', l: '#fff3d6' }, ui: ['#e8b84a', '#fff3d9'], blank: ['#8a6038', '#7a4a26', '#6a3a24', '#8c1f2b', '#2f4a8a'], glow: '#ffd36a' },
    cats:        { n: 'Котики', pal: { a: '#ff8fa3', b: '#f2a64a', c: '#8a5a3c', l: '#fffaf2' }, ui: ['#ffb3c1', '#fff6ee'], blank: ['#a8774f', '#c98a5e', '#f2a64a', '#ff8fa3', '#ff8fa3'], glow: '#ffc6d3' },
    monkeys:     { n: 'Обезьяны', pal: { a: '#ffd23f', b: '#e0302a', c: '#4f8a3a', l: '#fff0c8' }, ui: ['#ffd23f', '#fff3cf'], blank: ['#a99a4a', '#c8b04e', '#d6bf52', '#e2c23a', '#ffd23f'], glow: '#fff27a' },
    veggies:     { n: 'Овощи', pal: { a: '#ff7a2f', b: '#e5383b', c: '#5aa83a', l: '#fffbea' }, ui: ['#ffa65a', '#fffbea'], blank: ['#7a9a3a', '#5aa83a', '#4f9a32', '#3f8a2a', '#5ec43a'], glow: '#c8ff6a' },
    '42bratuhi': { n: '42 Братухи', pal: { a: '#f4c542', b: '#ff4fa3', c: '#7a3fd0', l: '#fff4fb' }, ui: ['#ff8cc6', '#fff4fb'], blank: ['#c88aa8', '#e08ab8', '#d4a017', '#f4c542', '#f4c542'], glow: '#ff9ad5' },
    cherts:      { n: 'Чертики', pal: { a: '#ff6a2a', b: '#d81e1e', c: '#ffc23d', l: '#ffd9b8' }, ui: ['#ff8a4a', '#ffe9d6'], blank: ['#4a3630', '#3a2824', '#2e1f1c', '#261816', '#1e1010'], glow: '#ff6a2a' },
    ugabugi:     { n: 'Уга-Буги', pal: { a: '#f2a63b', b: '#c8423a', c: '#6b4423', l: '#efe6d4' }, ui: ['#f2a63b', '#f3ead8'], blank: ['#8a6a48', '#d9cdb3', '#e3d8c0', '#ece2cc', '#f2ead6'], glow: '#ffd27a' },
  };

  

  const HANDS = {
    legion:      { skin: '#c3ccd6', skin2: '#8f9aa6', sleeve: '#8c1f2b', cuff: '#c9952e', kind: 'plate' },
    cats:        { skin: '#f6b26b', skin2: '#e08f45', sleeve: '#ff9fb2', cuff: '#fff3ea', kind: 'paw', pad: '#ff8fa3' },
    monkeys:     { skin: '#8a5a33', skin2: '#d9a873', sleeve: '#7a4a28', cuff: '#7a4a28', kind: 'fur' },
    veggies:     { skin: '#5aa83a', skin2: '#3f8a2a', sleeve: '#c98a4e', cuff: '#ff7a2f', kind: 'glove' },
    '42bratuhi': { skin: '#f1c6a0', skin2: '#d9a27a', sleeve: '#ff8cc6', cuff: '#ffd1ea', kind: 'bling' },
    cherts:      { skin: '#d8402a', skin2: '#9e2618', sleeve: '#2e1f1c', cuff: '#ff6a2a', kind: 'claw' },
    ugabugi:     { skin: '#e0b27a', skin2: '#b9875a', sleeve: '#a8783f', cuff: '#6b4423', kind: 'hide' },
  };
  function drawHand(c, st, p, d, sl, t0 = 0, sc = 1) {
    const H_ = HANDS[st] || HANDS.legion, n = { x: -d.y, y: d.x };

    const side = ((sl.x - p.x) * n.x + (sl.y - p.y) * n.y) > 0 ? 1 : -1, nx = n.x * side, ny = n.y * side;
    const L = (u, v) => ({ x: p.x + (d.x * u + nx * v) * sc, y: p.y + (d.y * u + ny * v) * sc });
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = INK;

    const cen = L(2, 10), ad0x = sl.x - cen.x, ad0y = sl.y - cen.y, adl = Math.hypot(ad0x, ad0y) || 1, ax = ad0x / adl, ay = ad0y / adl, qx = -ay, qy = ax;
    const P2 = (along, across) => ({ x: cen.x + (ax * along + qx * across) * sc, y: cen.y + (ay * along + qy * across) * sc });
    const fw = 52, far0 = Math.max(60, adl / sc + 30);
    const sv = [P2(26, -17), P2(far0, -fw), P2(far0, fw), P2(26, 17)];
    c.fillStyle = H_.sleeve; c.lineWidth = 4 * sc; c.beginPath(); sv.forEach((z, i) => i ? c.lineTo(z.x, z.y) : c.moveTo(z.x, z.y)); c.closePath(); c.fill(); c.stroke();

    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 3 * sc; for (const f of [60, 95]) { const u0 = P2(f, -10), u1 = P2(f + 14, 8); c.beginPath(); c.moveTo(u0.x, u0.y); c.quadraticCurveTo(P2(f + 4, 0).x, P2(f + 4, 0).y, u1.x, u1.y); c.stroke(); }
    c.strokeStyle = INK;
    if (H_.kind === 'paw') { c.strokeStyle = '#ff7f99'; c.lineWidth = 5 * sc; for (const f of [55, 85, 115]) { const hw = (17 + (fw - 17) * (f - 26) / (far0 - 26)) * 0.92, u0 = P2(f, -hw), u1 = P2(f, hw); c.beginPath(); c.moveTo(u0.x, u0.y); c.lineTo(u1.x, u1.y); c.stroke(); } c.strokeStyle = INK; }
    if (H_.kind === 'claw') { c.fillStyle = '#ff6a2a'; for (let j = 0; j < 5; j++) { const q = P2(50 + j * 18, Math.sin(j * 2.3) * 22); c.globalAlpha = 0.5 + 0.4 * Math.sin(t0 * 4 + j); c.beginPath(); c.arc(q.x, q.y, 3 * sc, 0, Math.PI * 2); c.fill(); } c.globalAlpha = 1; }
    if (H_.kind === 'hide') { c.fillStyle = '#6b4423'; for (let j = 0; j < 6; j++) { const q = P2(48 + j * 15, (j % 2 ? 1 : -1) * (14 + j * 3)); c.fillRect(q.x - 5 * sc, q.y - 4 * sc, 10 * sc, 8 * sc); } }

    if (H_.kind === 'fur' || H_.kind === 'bling') { c.fillStyle = H_.kind === 'bling' ? '#ffb3da' : '#9a6a40'; c.lineWidth = 2.5 * sc; for (let j = 0; j < 5; j++) { const q = P2(30, (j - 2) * 8.5); c.beginPath(); c.arc(q.x, q.y, 8 * sc, 0, Math.PI * 2); c.fill(); c.stroke(); } }
    else { const cf = [P2(20, -19), P2(34, -21), P2(34, 21), P2(20, 19)]; c.fillStyle = H_.cuff; c.lineWidth = 3.5 * sc; c.beginPath(); cf.forEach((z, i) => i ? c.lineTo(z.x, z.y) : c.moveTo(z.x, z.y)); c.closePath(); c.fill(); c.stroke();
      if (H_.kind === 'plate') { c.strokeStyle = '#ffe08a'; c.lineWidth = 1.8 * sc; const u0 = P2(27, -19), u1 = P2(27, 19); c.beginPath(); c.moveTo(u0.x, u0.y); c.lineTo(u1.x, u1.y); c.stroke(); c.strokeStyle = INK; } }

    const sh = (u, v, rx, ry, fill, w = 3.5) => { const q = L(u, v), a = Math.atan2(d.y, d.x); c.beginPath(); c.ellipse(q.x, q.y, rx * sc, ry * sc, a, 0, Math.PI * 2); if (fill) { c.fillStyle = fill; c.fill(); } if (w) { c.lineWidth = w * sc; c.strokeStyle = INK; c.stroke(); } };
    const pixel = H_.kind === 'hide';

    for (let j = 0; j < 4; j++) {
      const u = 15 - j * 9.5;
      sh(u, -12, 6.2, 5.2, H_.skin2);
      if (H_.kind === 'paw') sh(u, -14, 3, 2.4, H_.pad, 0);
      if (H_.kind === 'claw') { const q = L(u, -17), q2 = L(u + 2, -24); c.fillStyle = '#1e1010'; c.lineWidth = 1.5 * sc; c.beginPath(); c.moveTo(q.x - d.x * 3 * sc, q.y - d.y * 3 * sc); c.lineTo(q2.x, q2.y); c.lineTo(q.x + d.x * 3 * sc, q.y + d.y * 3 * sc); c.closePath(); c.fill(); c.stroke(); }
      if (H_.kind === 'bling' && j === 1) sh(u, -12, 6.6, 2.2, '#f4c542', 1.5);
    }

    if (pixel) { const q = [L(-20, -8), L(22, -8), L(24, 24), L(-18, 24)]; c.fillStyle = H_.skin; c.lineWidth = 3.5 * sc; c.beginPath(); q.forEach((z, i) => i ? c.lineTo(z.x, z.y) : c.moveTo(z.x, z.y)); c.closePath(); c.fill(); c.stroke(); }
    else sh(1, 8, 24, 17, H_.skin);

    c.lineWidth = 2 * sc; c.strokeStyle = INK;
    for (let j = 0; j < 4; j++) { const u = 14.5 - j * 9.5, a = L(u - 3.5, -3), b = L(u, -6), e = L(u + 3.5, -3); c.beginPath(); c.moveTo(a.x, a.y); c.quadraticCurveTo(b.x, b.y, e.x, e.y); c.stroke(); }

    if (H_.kind === 'plate') { c.strokeStyle = H_.skin2; c.lineWidth = 2 * sc; for (const v of [6, 14]) { const a = L(-16, v), b = L(18, v); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); } for (const u of [-10, 4, 16]) { const q = L(u, 20); c.fillStyle = '#e9eef3'; c.beginPath(); c.arc(q.x, q.y, 1.8 * sc, 0, Math.PI * 2); c.fill(); } }
    else if (H_.kind === 'glove') { c.strokeStyle = '#2f6a1e'; c.setLineDash([3 * sc, 3 * sc]); c.lineWidth = 1.6 * sc; const a = L(-18, 12), b = L(20, 12); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.setLineDash([]); }
    else if (H_.kind === 'fur') { c.strokeStyle = '#6a4220'; c.lineWidth = 1.6 * sc; for (let j = 0; j < 6; j++) { const a = L(-14 + j * 6, 14), b = L(-12 + j * 6, 20); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); } }
    else if (H_.kind === 'paw') { c.strokeStyle = '#e08f45'; c.lineWidth = 1.6 * sc; for (let j = 0; j < 5; j++) { const a = L(-14 + j * 7, 13), b = L(-15 + j * 7, 19); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); } }
    if (!pixel) { c.globalAlpha = 0.35; sh(-4, 14, 10, 4, '#ffffff', 0); c.globalAlpha = 1; }

    sh(22, -2, 12, 6.2, H_.skin);
    const nl = L(30, -2); if (H_.kind === 'claw') { c.fillStyle = '#1e1010'; c.beginPath(); c.arc(nl.x, nl.y, 3 * sc, 0, Math.PI * 2); c.fill(); }
    else if (H_.kind !== 'plate' && H_.kind !== 'glove') { c.fillStyle = H_.kind === 'bling' ? '#ff4fa3' : 'rgba(255,255,255,.55)'; c.beginPath(); c.arc(nl.x, nl.y, 2.6 * sc, 0, Math.PI * 2); c.fill(); }
    if (H_.kind === 'bling') { sh(10, 4, 4, 4, '#f4c542', 1.5); const q = L(10, 4); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(q.x - 1, q.y - 1, 1.3 * sc, 0, Math.PI * 2); c.fill(); }
    c.restore();
  }

   
  function fishSVG(id, dark) {
    const f = FISH[id], ink = '#2b2121', sh = (h, a) => shade(h, a);
    const C = dark ? '#5b4f45' : f.col, C2 = dark ? '#4a4038' : sh(f.col, -0.22), L = dark ? '#5b4f45' : sh(f.col, 0.35), sw = 'stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"';
    const eye = dark ? '' : '<circle cx="__EX" cy="__EY" r="3.4" fill="#fff" stroke="' + ink + '" stroke-width="1.8"/><circle cx="__EX" cy="__EY" r="1.5" fill="' + ink + '"/>';
    const E = (x, y) => eye.replace(/__EX/g, x).replace(/__EY/g, y);
    let g = '';
    if (id === 'boot') {
      g = `<path d="M44 8 L68 8 L66 38 Q74 40 86 44 Q96 48 94 56 L40 56 Q36 40 44 8 Z" fill="${C}" ${sw}/><path d="M40 50 L94 50" stroke="${ink}" stroke-width="2.5"/><path d="M44 8 L68 8 L67.5 16 L43.5 16 Z" fill="${C2}" ${sw}/>` + (dark ? '' : `<path d="M58 26 L63 30 M56 32 L61 36" stroke="${L}" stroke-width="2.5" stroke-linecap="round"/><path d="M90 50 q4 -6 10 -4" stroke="#6fae4a" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    } else if (id === 'chest') {
      g = `<path d="M30 26 L90 26 L90 56 L30 56 Z" fill="${C}" ${sw}/><path d="M30 26 Q30 8 60 8 Q90 8 90 26 Z" fill="${C2}" ${sw}/><path d="M30 26 L90 26" stroke="${ink}" stroke-width="3"/>` + (dark ? '' : `<path d="M44 9 L44 56 M76 9 L76 56" stroke="#d9a436" stroke-width="4"/><rect x="54" y="22" width="12" height="13" rx="2" fill="#ffd84d" stroke="${ink}" stroke-width="2.4"/><circle cx="60" cy="28.5" r="2" fill="${ink}"/><path d="M84 12 l3 -6 l3 6 l-3 2 z" fill="#fff6a8"/>`);
    } else {

      const F = { roach: [34, 13], crucian: [30, 17], perch: [33, 15], bream: [32, 20], pike: [46, 10], zander: [42, 12], catfish: [46, 13], gcarp: [33, 18], legend: [48, 15] }[id] || [34, 14];
      const cx = 56, cy = 34, rx = F[0], ry = F[1], tx = cx + rx - 3;
      g += id === 'legend' && !dark ? `<ellipse cx="60" cy="34" rx="56" ry="26" fill="#ffe08a" opacity=".55"/>` : '';

      if (id === 'perch' || id === 'zander') g += `<path d="M${cx - 18} ${cy - ry + 3} L${cx - 14} ${cy - ry - 9} L${cx - 9} ${cy - ry - 2} L${cx - 5} ${cy - ry - 10} L${cx} ${cy - ry - 2} L${cx + 4} ${cy - ry - 9} L${cx + 9} ${cy - ry + 3} Z" fill="${dark ? C : '#c8553d'}" ${sw}/>`;
      else if (id === 'pike') g += `<path d="M${cx + 14} ${cy - ry + 2} Q${cx + 24} ${cy - ry - 9} ${cx + 30} ${cy - ry + 3} Z" fill="${C2}" ${sw}/>`;
      else if (id === 'catfish' || id === 'legend') g += `<path d="M${cx - 4} ${cy - ry + 2} Q${cx + 2} ${cy - ry - 7} ${cx + 10} ${cy - ry + 3} Z" fill="${C2}" ${sw}/>`;
      else g += `<path d="M${cx - 10} ${cy - ry + 2} Q${cx} ${cy - ry - 11} ${cx + 12} ${cy - ry + 2} Z" fill="${C2}" ${sw}/>`;

      g += `<path d="M${tx} ${cy} L${tx + 18} ${cy - 13} Q${tx + 13} ${cy} ${tx + 18} ${cy + 13} Z" fill="${C2}" ${sw}/>`;

      g += `<path d="M${cx + 4} ${cy + ry - 2} Q${cx + 10} ${cy + ry + 8} ${cx + 18} ${cy + ry - 3} Z" fill="${C2}" ${sw}/>`;

      g += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C}" ${sw}/>`;
      if (!dark) {
        g += `<path d="M${cx - rx + 10} ${cy + ry * 0.35} Q${cx} ${cy + ry * 0.75} ${cx + rx - 8} ${cy + ry * 0.3}" stroke="${L}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`;
        if (id === 'perch' || id === 'zander') for (let j = 0; j < 4; j++) { const x = cx - 14 + j * 9; g += `<path d="M${x} ${cy - ry + 3} Q${x - 2} ${cy} ${x} ${cy + ry - 4}" stroke="${sh(f.col, -0.35)}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`; }
        if (id === 'pike') for (let j = 0; j < 7; j++) g += `<ellipse cx="${cx - 26 + j * 8}" cy="${cy - 2 + (j % 2) * 4}" rx="2.6" ry="1.6" fill="${L}"/>`;
        if (id === 'crucian' || id === 'gcarp' || id === 'bream') for (let j = 0; j < 3; j++) g += `<path d="M${cx - 6 + j * 8} ${cy - 6} q3 3 0 6 M${cx - 2 + j * 8} ${cy + 1} q3 3 0 6" stroke="${sh(f.col, -0.18)}" stroke-width="1.6" fill="none"/>`;

        g += `<path d="M${cx - rx + 13} ${cy - ry * 0.6} Q${cx - rx + 19} ${cy} ${cx - rx + 13} ${cy + ry * 0.6}" stroke="${ink}" stroke-width="2" fill="none"/>`;
      }

      g += E(cx - rx + 8, cy - ry * 0.25);
      if (id === 'catfish' || id === 'legend') g += `<path d="M${cx - rx + 2} ${cy + 3} q-10 4 -12 14 M${cx - rx + 4} ${cy + 5} q-4 8 -2 16" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      if (id === 'legend' && !dark) for (const [x, y] of [[cx - 30, cy - ry - 2], [cx + 30, cy - ry + 2], [cx + 46, cy + 12]]) g += `<path d="M${x} ${y - 6} L${x + 1.6} ${y - 1.6} L${x + 6} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 6} L${x - 1.6} ${y + 1.6} L${x - 6} ${y} L${x - 1.6} ${y - 1.6} Z" fill="#fff6a8" stroke="#b8860b" stroke-width="1.2"/>`;
    }
    return `<svg viewBox="0 0 120 68" aria-hidden="true">${g}</svg>`;
  }
  const RAR = (id) => (FISH[id].epic ? 'epic' : FISH[id].rare || id === 'catfish' ? 'rare' : '');
  const RAR_RU = { '': 'обычная', rare: 'редкая', epic: 'легенда' };

   
  function drawFishC(c, id, len, tw = 0) {
    const f = FISH[id], col = f.col, dk = shade(col, -0.22), lt = shade(col, 0.35);
    const H2 = { roach: 0.36, crucian: 0.5, perch: 0.42, bream: 0.58, pike: 0.22, zander: 0.27, catfish: 0.28, gcarp: 0.52, legend: 0.32 }[id] || 0.38;
    const rx = len * 0.38, ry = len * H2 * 0.5, k = len / 46;
    c.save(); c.lineJoin = 'round'; c.strokeStyle = INK; c.lineWidth = 2.6 * k;

    c.save(); c.translate(-rx + 3 * k, 0); c.rotate(tw);
    c.fillStyle = dk; c.beginPath(); c.moveTo(2 * k, 0); c.lineTo(-len * 0.24, -len * 0.17); c.quadraticCurveTo(-len * 0.16, 0, -len * 0.24, len * 0.17); c.closePath(); c.fill(); c.stroke(); c.restore();

    c.fillStyle = id === 'perch' || id === 'zander' ? '#c8553d' : dk;
    c.beginPath(); c.moveTo(-rx * 0.35, -ry + 2 * k); c.quadraticCurveTo(0, -ry - len * 0.16, rx * 0.35, -ry + 2 * k); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = dk; c.beginPath(); c.moveTo(-rx * 0.1, ry - 2 * k); c.quadraticCurveTo(-rx * 0.25, ry + len * 0.1, -rx * 0.5, ry - 2 * k); c.closePath(); c.fill(); c.stroke();

    c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); c.fill(); c.stroke();

    if (id === 'perch' || id === 'zander') { c.strokeStyle = shade(col, -0.38); c.lineWidth = 3 * k; for (let j = 0; j < 4; j++) { const x = -rx * 0.5 + j * rx * 0.3; c.beginPath(); c.moveTo(x, -ry + 2 * k); c.quadraticCurveTo(x - 2 * k, 0, x, ry - 3 * k); c.stroke(); } }
    if (id === 'pike') { c.fillStyle = lt; for (let j = 0; j < 6; j++) { c.beginPath(); c.ellipse(-rx * 0.6 + j * rx * 0.22, (j % 2 ? 1 : -1) * ry * 0.3, 2.4 * k, 1.5 * k, 0, 0, Math.PI * 2); c.fill(); } }
    if (id === 'legend') { c.fillStyle = 'rgba(255,240,170,.75)'; for (let j = 0; j < 4; j++) { c.beginPath(); c.arc(-rx * 0.4 + j * rx * 0.25, -ry * 0.2, 1.8 * k, 0, Math.PI * 2); c.fill(); } }

    c.strokeStyle = lt; c.lineWidth = 2.4 * k; c.lineCap = 'round'; c.beginPath(); c.moveTo(-rx * 0.6, ry * 0.4); c.quadraticCurveTo(0, ry * 0.75, rx * 0.55, ry * 0.3); c.stroke();

    c.strokeStyle = INK; c.lineWidth = 1.8 * k; c.beginPath(); c.moveTo(rx * 0.45, -ry * 0.6); c.quadraticCurveTo(rx * 0.3, 0, rx * 0.45, ry * 0.6); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(rx * 0.68, -ry * 0.22, 3.2 * k, 0, Math.PI * 2); c.fill(); c.lineWidth = 1.6 * k; c.stroke();
    c.fillStyle = INK; c.beginPath(); c.arc(rx * 0.7, -ry * 0.22, 1.4 * k, 0, Math.PI * 2); c.fill();
    if (id === 'catfish' || id === 'legend') { c.lineWidth = 2 * k; c.beginPath(); c.moveTo(rx * 0.95, ry * 0.15); c.quadraticCurveTo(rx * 1.2, ry * 0.7, rx * 1.05, ry * 1.4); c.moveTo(rx * 0.92, ry * 0.3); c.quadraticCurveTo(rx * 1.05, ry * 0.9, rx * 0.8, ry * 1.5); c.stroke(); }
    c.restore();
  }
  const LV_RU = ['палка', 'деревянная', 'с катушкой', 'лакированная', 'легендарная'];
  function shade(hex, a) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
    const f = (v) => Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a);
    return `rgb(${f(r)},${f(gg)},${f(b)})`;
  }
  



  function drawRod(c, st, lv, B, M, T, o = {}) {
    const Y = STY[st] || STY.legion, P = Y.pal, t0 = o.t || 0, k = o.k || 1, ink = INK, pix = st === 'ugabugi';
    const qp = (t) => ({ x: (1 - t) * (1 - t) * B.x + 2 * (1 - t) * t * M.x + t * t * T.x, y: (1 - t) * (1 - t) * B.y + 2 * (1 - t) * t * M.y + t * t * T.y });
    const nrm = (t) => { const dx = 2 * (1 - t) * (M.x - B.x) + 2 * t * (T.x - M.x), dy = 2 * (1 - t) * (M.y - B.y) + 2 * t * (T.y - M.y), L = Math.hypot(dx, dy) || 1; return { x: -dy / L, y: dx / L, tx: dx / L, ty: dy / L }; };
    const at = (t, off) => { const p = qp(t), n = nrm(t); return { x: p.x + n.x * off, y: p.y + n.y * off }; };
    const G = 0.27, N = pix ? 12 : 30;
    const W = (t) => (st === 'veggies' && t < G && lv > 1 ? 15 - 6 * t / G : 13 - 9.5 * t) * k;
    const cap = pix ? 'square' : 'round';
    const seg = (a, b, n, colF, wF, extra = 0) => { for (let i = 0; i < n; i++) { const ta = a + (b - a) * i / n, tb = a + (b - a) * (i + 1) / n, p0 = qp(ta), p1 = qp(tb); c.strokeStyle = colF(ta, i); c.lineWidth = wF(ta) + extra; c.lineCap = cap; c.beginPath(); c.moveTo(p0.x, p0.y); c.lineTo(p1.x, p1.y); c.stroke(); } };
    const dot = (x, y, r, f, w = 0) => { c.beginPath(); if (pix) c.rect(x - r, y - r, r * 2, r * 2); else c.arc(x, y, r, 0, Math.PI * 2); if (f) { c.fillStyle = f; c.fill(); } if (w) { c.lineWidth = w; c.strokeStyle = ink; c.stroke(); } };
    c.save(); c.lineJoin = pix ? 'miter' : 'round';

    if (lv >= 5) { c.shadowColor = Y.glow; c.shadowBlur = 18 * k; }
    seg(0, 1, N, () => ink, W, 4 * k);
    c.shadowBlur = 0;

    const bc = Y.blank[lv - 1];
    seg(G, 1, N, (t, i) => (lv === 1 && i % 5 === 2 ? shade(bc, -0.18) : bc), W);

    if (st === 'monkeys') for (let t = G + 0.06; t < 0.98; t += 0.085) { const p = qp(t), n = nrm(t), w = W(t) / 2 + 1; c.strokeStyle = shade(bc, -0.4); c.lineWidth = 2 * k; c.beginPath(); c.moveTo(p.x + n.x * w, p.y + n.y * w); c.lineTo(p.x - n.x * w, p.y - n.y * w); c.stroke(); }
    if (st === 'cherts' && lv >= 2) { const cnt = lv * 2; for (let j = 0; j < cnt; j++) { const t = G + 0.04 + (0.66 * j) / cnt, w = W(t) * 0.3; c.strokeStyle = lv >= 4 ? '#ffb23d' : '#ff6a2a'; c.lineWidth = 1.6 * k; c.shadowColor = '#ff6a2a'; c.shadowBlur = 6 * k; c.beginPath(); const a = at(t, -w), b2 = at(t + 0.02, w), d2 = at(t + 0.04, -w * 0.5); c.moveTo(a.x, a.y); c.lineTo(b2.x, b2.y); c.lineTo(d2.x, d2.y); c.stroke(); c.shadowBlur = 0; } }
    if (st === 'ugabugi' && lv >= 2) for (const t of [0.5, 0.74]) { const p = qp(t); dot(p.x, p.y, W(t) * 0.75, bc, 2.5 * k); }

    c.strokeStyle = lv >= 4 ? 'rgba(255,255,255,.75)' : 'rgba(255,240,210,.4)'; c.lineWidth = (lv >= 4 ? 2.2 : 1.6) * k; c.lineCap = 'round'; c.beginPath();
    for (let i = 0; i <= 20; i++) { const t = G + (1 - G) * i / 20, q = at(t, -W(t) * 0.25); if (i) c.lineTo(q.x, q.y); else c.moveTo(q.x, q.y); } c.stroke();

    if (lv >= 4) {
      if (st === 'legion' || st === '42bratuhi') for (const t of [0.42, 0.62, 0.82]) { const p = qp(t), n = nrm(t), w = W(t) / 2 + 1.5 * k; c.strokeStyle = ink; c.lineWidth = 5 * k; c.beginPath(); c.moveTo(p.x + n.x * w, p.y + n.y * w); c.lineTo(p.x - n.x * w, p.y - n.y * w); c.stroke(); c.strokeStyle = P.a; c.lineWidth = 3 * k; c.stroke(); }
      if (st === '42bratuhi') for (let j = 0; j < 7; j++) { const t = 0.34 + j * 0.085, p = qp(t), sp = 0.6 + 0.4 * Math.sin(t0 * 4 + j); dot(p.x, p.y, 1.8 * k, j % 2 ? '#bff4ff' : '#ffffff'); c.fillStyle = `rgba(255,255,255,${sp})`; c.fillRect(p.x - 0.5, p.y - 3.5 * k, 1, 7 * k); }
      if (st === 'cats') for (let j = 0; j < 6; j++) { const t = 0.36 + j * 0.1, p = qp(t); dot(p.x, p.y, 1.6 * k, '#fffaf2'); }
      if (st === 'monkeys') { c.strokeStyle = '#3f7d2a'; c.lineWidth = 2.4 * k; c.beginPath(); for (let i = 0; i <= 40; i++) { const t = G + (0.95 - G) * i / 40, q = at(t, Math.sin(i * 0.9) * (W(t) / 2 + 1)); if (i) c.lineTo(q.x, q.y); else c.moveTo(q.x, q.y); } c.stroke(); }
      if (st === 'veggies') for (const t of lv >= 5 ? [0.4, 0.58, 0.76] : [0.45, 0.7]) { const p = at(t, -W(t) / 2), n = nrm(t); c.save(); c.translate(p.x, p.y); c.rotate(Math.atan2(n.ty, n.tx) - 1.0); c.fillStyle = '#7cc25a'; c.lineWidth = 2 * k; c.strokeStyle = ink; c.beginPath(); c.ellipse(7 * k, 0, 7 * k, 3 * k, 0, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore(); }
    } else if (st === 'veggies' && lv >= 2) { const t = 0.55, p = at(t, -W(t) / 2), n = nrm(t); c.save(); c.translate(p.x, p.y); c.rotate(Math.atan2(n.ty, n.tx) - 1.0); c.fillStyle = '#7cc25a'; c.lineWidth = 2 * k; c.strokeStyle = ink; c.beginPath(); c.ellipse(6 * k, 0, 6 * k, 2.6 * k, 0, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore(); }

    const GR = {
      legion: [P.b, shade(P.b, -0.3)], cats: [P.a, '#fffaf2'], monkeys: ['#e2c89a', '#a87a48'], veggies: [P.a, shade(P.a, -0.2)],
      '42bratuhi': [P.b, '#ffa8d4'], cherts: ['#1e1414', P.b], ugabugi: ['#8a5a33', '#5a3a1e'],
    }[st];
    if (lv === 1) {
      seg(0, G, 8, (t, i) => (i % 3 === 1 ? shade(bc, -0.2) : bc), W);
      const p = qp(0.16), n = nrm(0.16), w = W(0.16) / 2 + 1; c.strokeStyle = st === 'cats' ? P.a : '#d8c08a'; c.lineWidth = 3 * k; c.beginPath(); c.moveTo(p.x + n.x * w, p.y + n.y * w); c.lineTo(p.x - n.x * w, p.y - n.y * w); c.stroke();
    } else if (st === '42bratuhi') {
      seg(0, G, 8, () => P.b, W);
      for (let i = 0; i < 14; i++) { const t = G * i / 13, p = at(t, (i % 2 ? 1 : -1) * W(t) * 0.35); dot(p.x, p.y, 3.4 * k, i % 3 ? '#ff7cc0' : '#ffc2e2'); }
    } else {
      seg(0, G, st === 'monkeys' ? 14 : 10, (t, i) => (i % 2 ? GR[1] : GR[0]), W);
      if (lv >= 3 && st !== 'veggies') { for (const t of [0.02, G - 0.02]) { const p = qp(t), n = nrm(t), w = W(t) / 2 + 1.5 * k; c.strokeStyle = ink; c.lineWidth = 5 * k; c.beginPath(); c.moveTo(p.x + n.x * w, p.y + n.y * w); c.lineTo(p.x - n.x * w, p.y - n.y * w); c.stroke(); c.strokeStyle = lv >= 5 ? P.a : st === 'ugabugi' ? '#9a9a90' : '#c9cfd4'; c.lineWidth = 3 * k; c.stroke(); } }
    }
    if (st === 'veggies' && lv > 1) for (let j = -1; j <= 1; j++) { const p = qp(0), n = nrm(0); c.save(); c.translate(p.x, p.y); c.rotate(Math.atan2(-n.ty, -n.tx) + j * 0.5); c.fillStyle = '#5aa83a'; c.strokeStyle = ink; c.lineWidth = 2 * k; c.beginPath(); c.ellipse(9 * k, 0, 9 * k, 3 * k, 0, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore(); }
    if (st === 'cats' && lv >= 3) { const p = at(G * 0.55, -W(0.15) * 0.05); dot(p.x, p.y, 2.4 * k, '#fffaf2'); for (let j = -1; j <= 1; j++) { const q = at(G * 0.55 + 0.035, j * 2.6 * k); dot(q.x, q.y, 1.1 * k, '#fffaf2'); } }

    if (st === 'legion' && lv >= 2) { const p = qp(G), n = nrm(G), L = (lv >= 4 ? 15 : 11) * k; c.strokeStyle = ink; c.lineWidth = 7 * k; c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x + n.x * L, p.y + n.y * L); c.lineTo(p.x - n.x * L, p.y - n.y * L); c.stroke(); c.strokeStyle = lv >= 4 ? P.a : '#b07a3a'; c.lineWidth = 4 * k; c.stroke(); const q = qp(0); dot(q.x, q.y, 6 * k, lv >= 4 ? P.a : '#b07a3a', 2.5 * k); if (lv >= 4) dot(q.x, q.y, 2 * k, P.b); }
    if (st === 'cherts' && lv >= 4) for (const s of [1, -1]) { const p = at(G, s * (W(G) / 2 + 1)), n = nrm(G); c.fillStyle = '#e8dccb'; c.strokeStyle = ink; c.lineWidth = 2 * k; c.beginPath(); c.moveTo(p.x - n.tx * 4 * k, p.y - n.ty * 4 * k); c.quadraticCurveTo(p.x + n.x * s * 12 * k, p.y + n.y * s * 12 * k, p.x + n.x * s * 10 * k + n.tx * 10 * k, p.y + n.y * s * 10 * k + n.ty * 10 * k); c.lineTo(p.x + n.tx * 4 * k, p.y + n.ty * 4 * k); c.closePath(); c.fill(); c.stroke(); }
    if (st === 'ugabugi' && lv >= 2) { const q = qp(0); c.fillStyle = '#9a9a90'; c.strokeStyle = ink; c.lineWidth = 2.5 * k; c.beginPath(); c.moveTo(q.x - 8 * k, q.y - 2 * k); c.lineTo(q.x - 3 * k, q.y - 8 * k); c.lineTo(q.x + 7 * k, q.y - 5 * k); c.lineTo(q.x + 8 * k, q.y + 4 * k); c.lineTo(q.x, q.y + 8 * k); c.lineTo(q.x - 7 * k, q.y + 5 * k); c.closePath(); c.fill(); c.stroke(); }
    if (st === 'cats' && lv >= 2) { const p = at(G + 0.01, W(G) / 2 + 2 * k); c.fillStyle = P.a; c.strokeStyle = ink; c.lineWidth = 2 * k; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + s * 9 * k, p.y - 5 * k); c.lineTo(p.x + s * 9 * k, p.y + 5 * k); c.closePath(); c.fill(); c.stroke(); } dot(p.x, p.y, 2.6 * k, shade(P.a, -0.15), 2 * k); }
    if (st === 'monkeys' && lv >= 5) { const p = at(G + 0.03, W(G) / 2 + 4 * k); c.save(); c.translate(p.x, p.y + 8 * k); c.rotate(0.4 + Math.sin(t0 * 2) * 0.15); c.fillStyle = P.a; c.strokeStyle = ink; c.lineWidth = 2 * k; c.beginPath(); c.moveTo(-6 * k, -8 * k); c.quadraticCurveTo(-8 * k, 6 * k, 6 * k, 9 * k); c.quadraticCurveTo(-2 * k, 3 * k, -2 * k, -8 * k); c.closePath(); c.fill(); c.stroke(); c.restore(); }

    const R = [0, 2, 4, 5, 6][lv - 1], rings = [];
    const rc = lv === 2 ? '#8a5a33' : lv === 5 ? P.a : lv === 4 ? '#eef3f6' : '#c9cfd4';
    for (let j = 0; j < R; j++) { const t = 0.4 + 0.54 * j / Math.max(1, R - 1), p = at(t, W(t) / 2 + 3.5 * k); rings.push(p); c.lineWidth = 2 * k; c.strokeStyle = ink; c.fillStyle = 'rgba(0,0,0,0)'; if (pix) { c.strokeRect(p.x - 3 * k, p.y - 3 * k, 6 * k, 6 * k); c.strokeStyle = rc; c.lineWidth = 1.2 * k; c.strokeRect(p.x - 3 * k, p.y - 3 * k, 6 * k, 6 * k); } else { c.beginPath(); c.arc(p.x, p.y, 3.2 * k, 0, Math.PI * 2); c.stroke(); c.strokeStyle = rc; c.lineWidth = 1.3 * k; c.stroke(); } }

    if (st === 'cherts' && lv >= 3) { const p = qp(1), n = nrm(1); c.strokeStyle = ink; c.lineWidth = 2.5 * k; c.beginPath(); for (const s of [-1, 0, 1]) { c.moveTo(p.x, p.y); c.lineTo(p.x + n.tx * 9 * k + n.x * s * 5 * k, p.y + n.ty * 9 * k + n.y * s * 5 * k); } c.stroke(); c.strokeStyle = lv >= 5 ? '#ffc23d' : '#c9cfd4'; c.lineWidth = 1.2 * k; c.stroke(); }

    let reel = qp(G * 0.8);
    if (lv >= 3) {
      const rt = o.reelT || 0.2, sd = o.side || 1, p = qp(rt), n = nrm(rt), rr2 = (o.reelR || 14) * k * (lv <= 2 ? 0.85 : 1); reel = { x: p.x + sd * n.x * (W(rt) / 2 + rr2), y: p.y + sd * n.y * (W(rt) / 2 + rr2) };
      c.strokeStyle = ink; c.lineWidth = 5 * k; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(reel.x, reel.y); c.stroke();
      const face = lv <= 2 ? (lv === 1 ? '#a8784a' : '#c08a4e') : { legion: '#b07a3a', cats: P.a, monkeys: '#8a5a33', veggies: P.b, '42bratuhi': P.a, cherts: '#2a2020', ugabugi: '#9a9a90' }[st];
      dot(reel.x, reel.y, rr2, face, 3.5 * k);
      if (lv <= 2) { c.strokeStyle = shade(face, -0.35); c.lineWidth = 1.4 * k; for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(reel.x, reel.y, rr2 * (0.35 + j * 0.2), 0, Math.PI * 2); c.stroke(); } }
      else if (st === 'cats') { c.strokeStyle = shade(P.a, -0.35); c.lineWidth = 1.6 * k; for (const a of [0.3, 1.4, 2.5]) { c.beginPath(); c.ellipse(reel.x, reel.y, rr2 * 0.9, rr2 * 0.4, a, 0, Math.PI * 2); c.stroke(); } }
      else if (st === 'cherts') { c.strokeStyle = '#ff6a2a'; c.lineWidth = 2 * k; c.beginPath(); c.arc(reel.x, reel.y, rr2 - 3 * k, 0, Math.PI * 2); c.stroke(); }
      else if (st === 'ugabugi') { c.fillStyle = '#6d6a60'; for (const a of [0.5, 2.3, 4]) dot(reel.x + Math.cos(a) * rr2 * 0.55, reel.y + Math.sin(a) * rr2 * 0.55, 1.6 * k, '#6d6a60'); }
      else { dot(reel.x, reel.y, rr2 * 0.45, shade(face, -0.25), 2 * k); if (st === '42bratuhi') for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2 + t0; dot(reel.x + Math.cos(a) * rr2 * 0.75, reel.y + Math.sin(a) * rr2 * 0.75, 1.3 * k, '#ffffff'); } }
      const ra = o.ra || 0; c.strokeStyle = ink; c.lineWidth = 3.5 * k; c.lineCap = 'round'; c.beginPath(); c.moveTo(reel.x, reel.y); const hx = reel.x + Math.cos(ra) * rr2 * 0.95, hy = reel.y + Math.sin(ra) * rr2 * 0.95; c.lineTo(hx, hy); c.stroke();
      dot(hx, hy, 3 * k, st === 'legion' || lv >= 5 ? P.a : '#f3e2bd', 2 * k);
    }

    if (o.line) { c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(reel.x, reel.y); for (const p of rings) c.lineTo(p.x, p.y); const tp = qp(1); c.lineTo(tp.x, tp.y); c.stroke(); }

    if (lv >= 5) {
      if (st === 'cherts') for (let j = 0; j < 6; j++) { const t = 0.32 + j * 0.11, p = at(t, -W(t) / 2), fl = 0.7 + 0.3 * Math.sin(t0 * 12 + j * 2), hh = 12 * k * fl; c.fillStyle = '#ff6a2a'; c.beginPath(); c.moveTo(p.x - 4 * k, p.y); c.quadraticCurveTo(p.x - 3 * k, p.y - hh * 0.6, p.x + Math.sin(t0 * 9 + j) * 2 * k, p.y - hh); c.quadraticCurveTo(p.x + 3 * k, p.y - hh * 0.6, p.x + 4 * k, p.y); c.closePath(); c.fill(); c.fillStyle = '#ffd23f'; c.beginPath(); c.ellipse(p.x, p.y - hh * 0.3, 1.8 * k, hh * 0.3, 0, 0, Math.PI * 2); c.fill(); }
      for (let j = 0; j < 6; j++) { const t = 0.3 + ((t0 * 0.15 + j / 6) % 1) * 0.7, p = at(t, Math.sin(t0 * 3 + j * 2) * W(t)), a = Math.max(0, Math.sin(t0 * 5 + j * 1.7)); c.fillStyle = `rgba(255,255,230,${a})`; c.save(); c.translate(p.x, p.y); c.rotate(t0 + j); c.fillRect(-4 * k, -0.8 * k, 8 * k, 1.6 * k); c.fillRect(-0.8 * k, -4 * k, 1.6 * k, 8 * k); c.restore(); }
      if (st === '42bratuhi') { const p = at(G * 0.5, W(0.1) / 2 + 9 * k); c.font = `900 ${10 * k}px system-ui`; c.textAlign = 'center'; c.lineWidth = 3 * k; c.strokeStyle = ink; c.strokeText('VIP', p.x, p.y); c.fillStyle = P.a; c.fillText('VIP', p.x, p.y); }
      if (st === 'ugabugi') { const p = at(0.6, W(0.6) / 2 + 3 * k); c.strokeStyle = ink; c.lineWidth = 1.5 * k; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x, p.y + 8 * k); c.stroke(); c.fillStyle = '#fffaf0'; c.beginPath(); c.moveTo(p.x - 3 * k, p.y + 8 * k); c.lineTo(p.x + 3 * k, p.y + 8 * k); c.lineTo(p.x, p.y + 17 * k); c.closePath(); c.fill(); c.stroke(); }
    }
    c.restore();
    return qp(1);
  }
   
  function miniRod(c, st, lv, x, y, w, t, h = 28, k = 0.42 * (w / 150)) {
    const B = { x: x + 12, y: y + h }, T = { x: x + w - 10, y: y - h * 0.6 }, M = { x: (B.x + T.x) / 2 + 8, y: (B.y + T.y) / 2 + h * 0.35 };
    drawRod(c, st, lv, B, M, T, { t, k, ra: t * 3 });
  }
  function drawRodPreview() {
    const cnv = $('rodP'), c = cnv.getContext('2d'); c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 420, 85);
    const Y = STY[S.style];
    c.fillStyle = INK; c.font = '800 11px system-ui'; c.textAlign = 'left';
    c.fillText(`Сейчас: ур. ${vRod()} - ${LV_RU[vRod() - 1]}`, 6, 11);
    miniRod(c, S.style, vRod(), 0, 50, 200, S.clock, 22, 0.62);
    if (vRod() < 5) { c.fillText(`Дальше: ур. ${vRod() + 1} - ${LV_RU[vRod()]}`, 224, 11); c.globalAlpha = 0.9; miniRod(c, S.style, vRod() + 1, 216, 50, 200, S.clock, 22, 0.62); c.globalAlpha = 1; c.fillStyle = INK; c.font = '900 18px system-ui'; c.fillText('→', 199, 54); }
    else { c.fillText(`${Y.n}: максимум`, 224, 11); }
  }
  function drawShowcase() {
    const cnv = $('rodsC'), c = cnv.getContext('2d'), RH = 100; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 900, 730);
    c.font = '900 13px system-ui'; c.textAlign = 'center'; c.fillStyle = INK;
    for (let l = 1; l <= 5; l++) c.fillText(`Ур. ${l} - ${LV_RU[l - 1]}`, 120 + (l - 0.5) * 156, 16);
    Object.keys(STY).forEach((st, r) => {
      const y = 28 + r * RH;
      c.fillStyle = r % 2 ? 'rgba(255,255,255,.35)' : 'rgba(226,207,166,.35)'; c.fillRect(0, y, 900, RH);
      c.fillStyle = STY[st].ui[0]; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.arc(16, y + RH / 2, 8, 0, Math.PI * 2); c.fill(); c.stroke();
      c.fillStyle = INK; c.textAlign = 'left'; c.font = '900 13px system-ui'; c.fillText(STY[st].n, 30, y + RH / 2 + 5);
      for (let l = 1; l <= 5; l++) miniRod(c, st, l, 120 + (l - 1) * 156, y + RH * 0.55, 152, S.clock, 32, 0.68);
    });
  }
  function setStyle(st) {
    S.style = STY[st] ? st : 'legion'; const Y = STY[S.style];
    if (R) { R.style.setProperty('--acc', Y.ui[0]); R.style.setProperty('--paper', Y.ui[1]);
    R.style.setProperty('--sb', Y.ui[0]); R.style.setProperty('--sbt', shade(Y.ui[1], -0.07)); }
    ui();
  }
  function drawSom() {
    const x = $('somP').getContext('2d'); x.setTransform(2, 0, 0, 2, 0, 0);
    const E = (cx, cy, rx, ry, f, w = 2.5) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); if (f) { x.fillStyle = f; x.fill(); } if (w) { x.lineWidth = w; x.strokeStyle = INK; x.stroke(); } };
    E(32, 32, 30, 30, '#bfe6f8');

    x.fillStyle = '#e9e4da'; x.lineWidth = 2.5; x.strokeStyle = INK; x.beginPath(); x.moveTo(17, 42); x.quadraticCurveTo(32, 66, 47, 42); x.closePath(); x.fill(); x.stroke();
    E(32, 37, 20, 15, '#7b8a6a');
    E(32, 44, 13, 5, '#a9b597', 0);
    for (const ex of [24, 40]) { E(ex, 33, 3.2, 3.2, '#fff', 1.8); x.fillStyle = INK; x.beginPath(); x.arc(ex, 33.5, 1.6, 0, Math.PI * 2); x.fill(); }
    x.lineWidth = 2; x.beginPath(); x.moveTo(23, 42); x.quadraticCurveTo(32, 46, 41, 42); x.stroke();

    x.lineWidth = 2; x.beginPath(); x.moveTo(23, 41); x.quadraticCurveTo(10, 42, 6, 54); x.moveTo(41, 41); x.quadraticCurveTo(54, 42, 58, 54); x.stroke();

    E(32, 23, 24, 5, '#e8c46a');
    x.fillStyle = '#e8c46a'; x.beginPath(); x.moveTo(19, 23); x.quadraticCurveTo(20, 6, 32, 6); x.quadraticCurveTo(44, 6, 45, 23); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#c8553d'; x.fillRect(19.5, 17, 25, 4); x.strokeRect(19.5, 17, 25, 4);
  }
   
  const gq = (k, x0, y0, x1, y1) => { if (S && S._geo) (S._geo[k] = S._geo[k] || []).push([x0, y0, x1, y1]); };
  

  function freeX(y, w, y2) {
    if (y2 == null) y2 = y;
    const ys = (y + OY) * SC, ys2 = (y2 + OY) * SC, toS = (px) => px / SC - OX;
    let l = L0 + 10, r = L1 - 10;

    const C = S.chatR; if (C && !S.chatOver && C[1] < ys2 + 8 && C[3] > ys - 8) l = Math.max(l, toS(C[2]) + 12);
    const D = S.dockR; if (D && D[1] < ys2 + 8 && D[3] > ys - 8) r = Math.min(r, toS(D[0]) - 10);

    for (const k of ['gauge', 'plate']) for (const q of ((S._geoPrev || {})[k] || [])) if (q[1] < y2 + 6 && q[3] > y - 6) r = Math.min(r, q[0] - 10);

    const c0 = (L0 + L1) / 2;
    if (r - l >= 240) { const half = Math.min(w, r - l) / 2; return { cx: clamp(c0, l + half, r - half), room: r - l, l, r }; }
    const L = L0 + 10, Rr = L1 - 10, room = Math.max(60, Rr - L), half = Math.min(w, room) / 2;
    return { cx: clamp(c0, L + half, Rr - half), room, l: L, r: Rr };
  }
   
  function drawBucket() {

      const bk = BK() - 110, bcx = bk + 110, top = NEAR + 30, orx = 40, ory = 9;
      const fishIn = vBag().filter((x) => x.type === 'fish' || x.type === 'legend'), nFish = Math.min(6, fishIn.length);
      gq('bucket', bk + 62, top - 48, bk + 158, H - 8);
      const bkOn = S.bkHover && (S.st === 'idle' || S.st === 'wait' || S.st === 'reel');
      const bodyPath = () => { g.beginPath(); g.moveTo(bk + 70, top); g.lineTo(bk + 150, top); g.lineTo(bk + 140, H - 10); g.lineTo(bk + 80, H - 10); g.closePath(); };
      if (bkOn) {
        const pu = 0.5 + 0.5 * Math.sin(S.clock * 5), hc = STY[S.style].ui[0];
        g.save(); g.shadowColor = hc; g.shadowBlur = 14 + 8 * pu; g.strokeStyle = hc; g.lineWidth = 11 + 2 * pu; g.lineJoin = 'round';
        bodyPath(); g.stroke(); g.beginPath(); g.ellipse(bcx, top, orx, ory, 0, 0, Math.PI * 2); g.stroke(); g.restore();
      }

      g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(bk + 72, top + 2); g.quadraticCurveTo(bcx, top - 46, bk + 148, top + 2); g.stroke();
      g.strokeStyle = '#c3ccd4'; g.lineWidth = 1.6; g.stroke();

      g.fillStyle = '#9aa7b0'; line(4); bodyPath(); g.fill(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(bk + 82, top + 12, 8, 56);
      g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.moveTo(bk + 132, top + 4); g.lineTo(bk + 148, top + 4); g.lineTo(bk + 139, H - 12); g.lineTo(bk + 128, H - 12); g.closePath(); g.fill();
      g.strokeStyle = INK; g.lineWidth = 2.5; for (const yy of [top + 26, H - 26]) { const f = (yy - top) / (H - 10 - top), xl = bk + 70 + 10 * f, xr = bk + 150 - 10 * f; g.beginPath(); g.moveTo(xl, yy); g.quadraticCurveTo(bcx, yy + 5, xr, yy); g.stroke(); }
      for (const [xx, yy] of [[bk + 76, top + 12], [bk + 144, top + 12]]) { g.fillStyle = '#d7dee4'; g.beginPath(); g.arc(xx, yy, 3.4, 0, Math.PI * 2); g.fill(); g.lineWidth = 1.8; g.stroke(); }

      g.fillStyle = '#3b4a54'; g.beginPath(); g.ellipse(bcx, top, orx, ory, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#5fb0e0'; g.beginPath(); g.ellipse(bcx, top + 2, orx - 4, ory - 3, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; g.beginPath(); g.ellipse(bcx - 8, top + 1, 14, 2.4, 0, Math.PI * 1.1, Math.PI * 1.9); g.stroke();

      if (nFish) {
        g.save(); g.beginPath(); g.rect(bk - 100, 0, 420, top); g.ellipse(bcx, top, orx - 2, ory - 1, 0, 0, Math.PI * 2); g.clip();
        const SLOTS = [[-16, -0.45, 1], [14, 0.45, -1], [-2, -0.08, -1], [26, 0.85, 1], [-28, -0.9, -1], [6, 0.22, 1]];
        for (let i = nFish - 1; i >= 0; i--) {
          const it = fishIn[i], id = it.id, sl = SLOTS[i], big = id === 'legend' ? 1.9 : id === 'catfish' ? 1.35 : id === 'pike' || id === 'zander' ? 1.15 : 1;
          const len = 40 * Math.min(big, 1.5), ang = -Math.PI / 2 + sl[1] * 1.15, wig = i < 2 ? Math.sin(S.clock * 9 + i * 2) * 0.12 : 0;

          const headUp = id === 'legend' ? -1 : sl[2];
          const ax = bcx + sl[0], ay = top + 3, dx = Math.cos(ang), dy = Math.sin(ang);
          g.save(); g.translate(ax + dx * len * 0.15, ay + dy * len * 0.15); g.rotate(ang + (headUp > 0 ? 0 : Math.PI) + wig * (headUp > 0 ? 0.3 : 0.6));
          drawFishC(g, id, len, headUp < 0 ? wig : 0);
          g.restore();
        }
        g.restore();
      }

      g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.ellipse(bcx, top, orx, ory, 0, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = '#c3ccd4'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(bcx, top + 1, orx - 2, ory - 1.5, 0, 0.15, Math.PI - 0.15); g.stroke();
      if (bkOn) { g.save(); g.font = '900 17px system-ui'; g.textAlign = 'center'; g.lineJoin = 'round'; g.lineWidth = 5; g.strokeStyle = INK; const ty = top - 30 + Math.sin(S.clock * 5) * 1.5;     g.strokeText('Улов', bcx, ty); g.fillStyle = '#fff'; g.fillText('Улов', bcx, ty); g.restore(); }

      if (S.cat) drawCat();
  }
  const BAR_Y = () => -OY + (innerWidth <= 700 ? 132 : 84) / SC;
  function draw() {
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
    g.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * SC * OX, DPR * SC * OY);
    L0 = -OX - 2; L1 = LW - OX + 2; T0 = -OY - 2;
    S._geoPrev = S._geo || {}; S._geo = {};

    let gr = g.createLinearGradient(0, T0, 0, HOR); gr.addColorStop(0, '#6ec3ef'); gr.addColorStop(0.7, '#bfe6f8'); gr.addColorStop(1, '#e8f6fb'); g.fillStyle = gr; g.fillRect(L0, T0, L1 - L0, HOR - T0);

    gr = g.createRadialGradient(170, 70, 10, 170, 70, 120); gr.addColorStop(0, 'rgba(255,248,210,.95)'); gr.addColorStop(1, 'rgba(255,248,210,0)'); g.fillStyle = gr; g.fillRect(50, -50, 240, 240);
    ell(170, 70, 26, 26, '#fff4b8', 3);

    for (const c of CLOUDS) { const span = L1 - L0 + 400, xx = L0 - 200 + ((((c.x - L0) + S.clock * c.v) % span) + span) % span; cloud(xx, c.y, c.s); }

    g.fillStyle = '#a9c9d8'; g.beginPath(); g.moveTo(L0, HOR); for (let x = Math.floor(L0 / 40) * 40; x <= L1 + 40; x += 40) g.lineTo(x, HOR - 70 - Math.sin(x / 140) * 26 - Math.sin(x / 61) * 10); g.lineTo(L1, HOR); g.closePath(); g.fill();
    line(2.5); g.strokeStyle = 'rgba(43,33,33,.35)'; g.stroke();

    g.fillStyle = '#8fc66a'; line(3); g.beginPath(); g.moveTo(L0, HOR); for (let x = Math.floor(L0 / 30) * 30; x <= L1 + 30; x += 30) g.lineTo(x, HOR - 34 - Math.sin(x / 90) * 14 - Math.sin(x / 37) * 5); g.lineTo(L1, HOR); g.closePath(); g.fill(); g.stroke();

    for (const t of TREES) { if (t.x < L0 - 30 || t.x > L1 + 30) continue; if (t.x > 600 && t.x < 760) continue; tree2(t.x, HOR - 4, t); }

    village(680, HOR - 2);

    g.fillStyle = '#d9c28b'; g.fillRect(L0, HOR - 4, L1 - L0, 5);

    gr = g.createLinearGradient(0, HOR, 0, NEAR + 40); gr.addColorStop(0, '#9fd6ee'); gr.addColorStop(0.25, '#6fbee3'); gr.addColorStop(0.65, '#3f9bd0'); gr.addColorStop(1, '#2a74a8'); g.fillStyle = gr; g.fillRect(L0, HOR, L1 - L0, NEAR + 40 - HOR);

    g.save(); g.beginPath(); g.rect(L0, HOR, L1 - L0, 46); g.clip();
    g.globalAlpha = 0.28;
    for (let y = 0; y < 46; y += 3) { const off = Math.sin(S.clock * 1.6 + y * 0.5) * (1 + y * 0.08); g.fillStyle = y < 20 ? '#3d7d45' : '#5d9a63'; g.fillRect(L0 + off, HOR + y, L1 - L0, 2); }
    g.restore(); g.globalAlpha = 1;
    line(3); g.beginPath(); g.moveTo(L0, HOR); g.lineTo(L1, HOR); g.stroke();

    for (let i = 0; i < 26; i++) {
      const d = i / 26, y = HOR + 8 + (NEAR + 30 - HOR) * Math.pow(d, 1.7), k = depthK(y), amp = 1 + 3 * k, len = 26 + 60 * k;
      g.strokeStyle = `rgba(255,255,255,${0.16 + 0.22 * k})`; g.lineWidth = 1 + 1.8 * k;
      g.beginPath();
      for (let x = L0 - 40 + ((i * 37) % 80); x < L1; x += len * 2.2) { const ph = S.clock * (0.8 + k) + x * 0.02 + i; g.moveTo(x, y + Math.sin(ph) * amp); g.quadraticCurveTo(x + len / 2, y - amp * 1.6 + Math.sin(ph) * amp, x + len, y + Math.sin(ph) * amp); }
      g.stroke();
    }

    for (let i = 0; i < 14; i++) { const y = HOR + 10 + i * 18, k = depthK(y), w = (10 + 40 * k) * (0.6 + 0.4 * Math.sin(S.clock * 3 + i * 1.7)); g.fillStyle = `rgba(255,250,220,${0.35 - i * 0.02})`; g.beginPath(); g.ellipse(170 + Math.sin(i * 2.3) * 8 * k, y, w, 1.6 + 2 * k, 0, 0, Math.PI * 2); g.fill(); }

    for (const sp of SPARK) { if (sp.x < L0 || sp.x > L1) continue; const k = depthK(sp.y), a = Math.max(0, Math.sin(S.clock * 2.2 + sp.p)); if (a < 0.6) continue; g.fillStyle = `rgba(255,255,255,${(a - 0.6) * 2})`; g.beginPath(); g.ellipse(sp.x, sp.y, 4 + 8 * k, 1 + 1.5 * k, 0, 0, Math.PI * 2); g.fill(); }


    for (const p of PADS) { const k = depthK(p.y), wv = Math.sin(S.clock * (0.8 + k) + p.x * 0.02 + p.ph); g.save(); g.translate(p.x + Math.sin(S.clock * 0.7 + p.ph) * 2 * k, p.y + wv * (1 + 3 * k) - p.jump * 9 * k); g.rotate(wv * 0.07 + p.jump * Math.sin(S.clock * 18) * 0.12); g.scale(1, 0.45); pad(0, 0, 40 * k); g.restore(); }

    const gust = 0.6 + 0.4 * Math.sin(S.clock * 0.45);
    for (const r of REEDS) { g.save(); g.translate(r.x, r.y); g.scale(r.s, r.s); cattail(0, 0, Math.sin(S.clock * 1.7 + r.ph) * 5 * gust + 2); cattail(14, 4, Math.sin(S.clock * 1.9 + r.ph + 0.8) * 5 * gust + 2); g.restore(); }

    if (S.st === 'aim') for (const [d, t] of [[0.38, 'близко'], [0.72, 'середина'], [1, 'далеко ✨']]) { const y = depthY(d); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(Math.max(L0 + 20, 60), y); g.lineTo(Math.min(L1 - 100, 820), y); g.stroke(); g.setLineDash([]); g.fillStyle = '#fff'; g.font = '800 13px system-ui'; g.textAlign = 'left'; g.fillText(t, Math.min(L1 - 96, 826), y + 4); }

    if (S.hot) {
      const h = S.hot, k = depthK(h.y), a = Math.min(1, h.t / 1.2, (h.dur - h.t) / 1.5);
      g.save(); g.globalAlpha = a;
      const RR = 60 * k + 22; g.fillStyle = 'rgba(15,60,100,.45)'; g.beginPath(); g.ellipse(h.x, h.y, RR, RR * 0.34, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(h.x, h.y, RR * 0.55, RR * 0.17, 0, 0, Math.PI * 2); g.fill();
      for (let i = 0; i < 3; i++) { const q = (S.clock * 0.9 + i / 3) % 1, R = (14 + q * 56) * k + 8; g.strokeStyle = `rgba(255,255,255,${0.7 * (1 - q)})`; g.lineWidth = 1 + 1.5 * k; g.beginPath(); g.ellipse(h.x, h.y, R, R * 0.32, 0, 0, Math.PI * 2); g.stroke(); }
      for (let i = 0; i < 10; i++) { const q = (S.clock * 1.6 + i * 0.37) % 1, bx = h.x + Math.sin(i * 2.4) * (30 * k + 10), by = h.y + Math.cos(i * 1.7) * (7 * k + 3) - q * (12 * k + 6); g.fillStyle = `rgba(255,255,255,${0.9 * (1 - q)})`; g.strokeStyle = `rgba(43,33,33,${0.5 * (1 - q)})`; g.lineWidth = 1.2; g.beginPath(); g.arc(bx, by, (2.5 + q * 3.5) * (0.7 + k), 0, Math.PI * 2); g.fill(); g.stroke(); }
      g.restore();
    }

    drawNet();

    for (const r of S.ripples) { const k = depthK(r.y); g.strokeStyle = `rgba(255,255,255,${(1 - r.t / 1.2) * 0.9})`; g.lineWidth = 1.5 + 1.5 * k; const R = (8 + r.t * 50 * r.s) * k * 1.6; g.beginPath(); g.ellipse(r.x, r.y, R, R * 0.3, 0, 0, Math.PI * 2); g.stroke(); }

    let tip = { x: ROD.x, y: ROD.y };
    if (S.st === 'aim') tip = { x: ROD.x + 120 * S.power, y: ROD.y - 90 * S.power };
    if (S.st === 'fight') { const bend = clamp(S.Td, 0, 1); tip = { x: ROD.x - 40 * bend + (S.warnT > 0 ? Math.sin(S.t * 30) * 3 : 0) + (S.spikeT > 0 ? Math.sin(S.t * 22) * 6 : 0), y: ROD.y + 120 * bend }; }
    if (S.st === 'bite') tip = { x: ROD.x, y: ROD.y + 14 };
    const butt = { x: BUTT_X(), y: H + 20 }, mid = { x: (butt.x + tip.x) / 2 + 30, y: (butt.y + tip.y) / 2 + (S.st === 'fight' ? 50 * S.T : 10) };

    if (S.bob && S.st !== 'catch') {
      let bx, by, k;
      if (S.st === 'fly') { const q = S.bob.t / S.bob.dur, e = 1 - (1 - q) * (1 - q); bx = tip.x + (S.bob.x - tip.x) * e; by = tip.y + (S.bob.y - tip.y) * e - Math.sin(q * Math.PI) * 160 * (0.4 + S.bob.d); k = 1 - (1 - S.bob.k) * q; }
      else { bx = S.bob.x; by = S.bob.y; k = S.bob.k; }
      const pose = bobPose(); let dip = pose.dip; bx += pose.dx * k;
      if (S.st === 'fight') { bx += Math.sin(S.t * 1.8) * 45 * k + (S.spikeT > 0 ? Math.sin(S.t * 16) * 10 * k : 0); by += Math.cos(S.t * 1.3) * 6 * k; }
      g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(tip.x, tip.y);
      const sag = S.st === 'fight' ? (1 - S.T) * 60 : 70; g.quadraticCurveTo((tip.x + bx) / 2, Math.max(tip.y, by) + sag * (S.st === 'fly' ? 0.2 : 1), bx, by); g.stroke();
      if (S.st === 'fight') {

        const big = S.fish && S.fish.id === 'legend' ? 1.9 : S.fish && S.fish.id === 'catfish' ? 1.3 : 1;
        g.save(); g.translate(bx, by); g.scale(Math.max(0.75, k * 1.8) * big, Math.max(0.75, k * 1.8) * big);
        ell(0, 2, 22, 7, 'rgba(255,255,255,.5)', 0);
        g.rotate(Math.sin(S.t * 14) * 0.5); ell(0, -2, 16, 7, (S.fish && S.fish.f.col) || '#c9d3dc', 3);
        g.fillStyle = (S.fish && S.fish.f.col) || '#c9d3dc'; line(3); g.beginPath(); g.moveTo(14, -2); g.lineTo(24, -9); g.lineTo(24, 5); g.closePath(); g.fill(); g.stroke();
        g.restore();
        if (Math.random() < 0.06) ripple(bx, by, 0.8);
      } else {

        g.save(); g.translate(bx, by + dip * k); g.scale(Math.max(0.6, k * 1.6), Math.max(0.6, k * 1.6));
        g.rotate(pose.tilt);
        if (dip > 14) g.globalAlpha = Math.max(0.25, 1 - (dip - 14) / 12);
        const sink = Math.min(1, Math.max(0, dip / 12));
        g.fillStyle = '#e0503a'; line(3); g.beginPath(); g.ellipse(0, -6 * (1 - sink), 7, 9 * (1 - sink * 0.7), 0, 0, Math.PI * 2); g.fill(); g.stroke();
        g.fillStyle = '#fff'; g.beginPath(); g.ellipse(0, -10 * (1 - sink), 5, 3 * (1 - sink), 0, 0, Math.PI * 2); g.fill();
        line(2.5); g.beginPath(); g.moveTo(0, -14 * (1 - sink)); g.lineTo(0, -22 * (1 - sink)); g.stroke();
        ell(0, 2, 10, 3, 'rgba(255,255,255,.6)', 0);
        g.restore();
      }
    }

    for (const q of S.pops) {
      const t = q.t, a = t < 0.75 ? 1 : Math.max(0, 1 - (t - 0.75) / 0.45);
      const sc = t < 0.12 ? 0.5 + t / 0.12 * 0.75 : t < 0.24 ? 1.25 - (t - 0.12) / 0.12 * 0.25 : 1;
      const py = Math.min(depthY(0.18), NEAR - 90) - t * 34 - (q.big ? 40 : 0);
      let fs0 = q.big ? 30 : 38; g.font = `900 ${fs0}px system-ui`; const fx = freeX(py - fs0 * 0.7, Infinity, py + fs0 * 0.7), tw0 = g.measureText(q.text).width + 16;
      if (tw0 * 1.25 > fx.room) { fs0 = Math.max(16, Math.floor(fs0 * fx.room / (tw0 * 1.25))); g.font = `900 ${fs0}px system-ui`; }
      const pw = (g.measureText(q.text).width + 16) * 1.25, pf = freeX(py - fs0 * 0.7, pw, py + fs0 * 0.7), ph = Math.min(pw, pf.room) / 2, px = clamp(pf.cx + q.dx, pf.l + ph, pf.r - ph);
      { const tw = g.measureText(q.text).width + 12, fh = fs0; gq('pop', px - tw * sc / 2, py - fh * 0.62 * sc, px + tw * sc / 2, py + fh * 0.62 * sc); }
      g.save(); g.globalAlpha = a; g.translate(px, py); g.rotate(q.rot); g.scale(sc, sc);
      g.font = `900 ${fs0}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
      g.lineWidth = fs0 * 0.32; g.strokeStyle = INK; g.strokeText(q.text, 0, 3);
      g.lineWidth = fs0 * 0.18; g.strokeStyle = '#fff3d9'; g.strokeText(q.text, 0, 0);
      g.fillStyle = q.col; g.fillText(q.text, 0, 0);
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillText(q.text, 0, -2); g.globalAlpha = a * 0.5;
      g.restore();
    }

    for (const p of S.splash) { g.fillStyle = `rgba(255,255,255,${1 - p.t})`; g.beginPath(); g.arc(p.x, p.y, 3.5, 0, Math.PI * 2); g.fill(); }

    pier();
    drawNetRope();
    const phoneB = innerWidth <= 700;
    if (!phoneB) drawBucket();

    const ra = S.st === 'fight' && S.held ? S.clock * 14 : 0;

    if (S.rodOk) drawRod(g, S.style, vRod(), butt, mid, tip, { t: S.clock, ra, line: true, k: 1.15, reelT: 0.245, side: 1, reelR: 20 });
    S.drawn = S.rodOk ? { style: S.style, rod: vRod() } : null;

    if (S.rodOk) {
      const qB = (t) => ({ x: (1 - t) * (1 - t) * butt.x + 2 * (1 - t) * t * mid.x + t * t * tip.x, y: (1 - t) * (1 - t) * butt.y + 2 * (1 - t) * t * mid.y + t * t * tip.y });

      const nar = innerWidth <= 700 || innerHeight <= 480;
      for (const [t, sl] of [[0.36, nar ? { x: butt.x - 70, y: H + 220 } : { x: butt.x - 300, y: H + 120 }], [0.12, { x: butt.x + 220, y: H + 60 }]]) {
        const a = qB(t), b = qB(t + 0.01), L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        drawHand(g, S.style, a, { x: (b.x - a.x) / L, y: (b.y - a.y) / L }, sl, S.clock, 1.55); gq('hand', a.x - 50, a.y - 50, a.x + 50, a.y + 50);
      }
    }
    if (phoneB) drawBucket();

    if (S.st === 'aim') {
      const phone = innerWidth <= 700, w = phone ? Math.min(300, L1 - L0 - 60) : 340, h = phone ? 11 : 14;
      const x = (L0 + L1) / 2 - w / 2, y = BAR_Y() + 18, cur = S.power < 0.38 ? 0 : S.power < 0.72 ? 1 : 2;

      g.fillStyle = 'rgba(25,30,45,.38)'; rr(x - 14, y - 26, w + 28, h + 40, 14); g.fill(); gq('aim', x - 14, y - 26, x + w + 14, y + h + 14);

      g.fillStyle = '#fff3d9'; rr(x - 3, y - 3, w + 6, h + 6, (h + 6) / 2); g.fill(); g.strokeStyle = 'rgba(43,33,33,.85)'; g.lineWidth = 2; g.stroke();
      g.save(); rr(x, y, w, h, h / 2); g.clip();
      let gz = g.createLinearGradient(x, 0, x + w, 0); gz.addColorStop(0, '#7fd06a'); gz.addColorStop(0.3, '#b9dc5c'); gz.addColorStop(0.45, '#ffd45a'); gz.addColorStop(0.65, '#ffc04d'); gz.addColorStop(0.8, '#ff9a4d'); gz.addColorStop(1, '#ff7a45');
      g.fillStyle = gz; g.fillRect(x, y, w, h);

      const zs = [[0, 0.38], [0.38, 0.72], [0.72, 1]];
      zs.forEach(([a0, a1], i) => { if (i !== cur) { g.fillStyle = 'rgba(40,40,60,.22)'; g.fillRect(x + w * a0, y, w * (a1 - a0), h); } else { g.fillStyle = `rgba(255,255,255,${0.2 + 0.1 * Math.sin(S.clock * 8)})`; g.fillRect(x + w * a0, y, w * (a1 - a0), h); } });
      g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x, y + 2, w, h * 0.25);
      g.strokeStyle = 'rgba(43,33,33,.55)'; g.lineWidth = 1.5; for (const v of [0.38, 0.72]) { g.beginPath(); g.moveTo(x + w * v, y); g.lineTo(x + w * v, y + h); g.stroke(); }
      g.restore();

      g.font = `800 ${phone ? 11 : 12}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
      ['близко', 'середина', 'далеко ✨'].forEach((t, i) => { const cx = x + w * (zs[i][0] + zs[i][1]) / 2; g.lineWidth = 3; g.strokeStyle = 'rgba(30,22,22,.9)'; g.strokeText(t, cx, y - 12); g.fillStyle = i === cur ? '#ffe27a' : '#fff'; g.fillText(t, cx, y - 12); });
      g.textBaseline = 'alphabetic';

      const px = x + w * S.power;
      g.save(); g.translate(px, y + h / 2);
      g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(1.5, h / 2 + 7, 7, 2.5, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#e0503a'; g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(0, h / 2 + 6); g.bezierCurveTo(9, 2, 8, -h / 2 - 6, 0, -h / 2 - 8); g.bezierCurveTo(-8, -h / 2 - 6, -9, 2, 0, h / 2 + 6); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(0, -h / 2 - 2, 4.5, 2.5, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(-3, 2, 1.6, 3, 0, 0, Math.PI * 2); g.fill();
      g.restore();
    }

    if (S.res) {
      const t = S.res.t, a = t < 1.5 ? 1 : Math.max(0, 1 - (t - 1.5) / 0.6);
      const sc = t < 0.14 ? 0.4 + t / 0.14 * 0.8 : t < 0.3 ? 1.2 - (t - 0.14) / 0.16 * 0.2 : 1;
      const py = Math.min(depthY(0.45), NEAR - 150) - Math.max(0, t - 1.3) * 40;
      g.font = '900 44px system-ui'; const fx = freeX(py - 26, Infinity, py + (S.res.small ? 52 : 26)), room = fx.room - 16;
      const big = Math.min(40, 44 * room / (g.measureText(S.res.big).width + 24));
      g.font = `900 ${big}px system-ui`; let rw = g.measureText(S.res.big).width + big * 0.4; if (S.res.small) { g.font = '800 20px system-ui'; rw = Math.max(rw, g.measureText(S.res.small).width + 10); }
      const px = freeX(py - 26, rw * 1.2, py + (S.res.small ? 52 : 26)).cx;
      { const tw = rw, cx0 = px; gq('res', cx0 - tw * sc / 2, py - big * 0.6 * sc, cx0 + tw * sc / 2, py + (S.res.small ? big * 0.85 + 14 : big * 0.6) * sc); }
      g.save(); g.globalAlpha = a; g.translate(px, py); g.scale(sc, sc);
      g.font = `900 ${big}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
      g.fillStyle = 'rgba(20,30,50,.28)'; g.fillText(S.res.big, 3, 7);
      g.lineWidth = big * 0.32; g.strokeStyle = INK; g.strokeText(S.res.big, 0, 2);
      g.lineWidth = big * 0.18; g.strokeStyle = '#fff3d9'; g.strokeText(S.res.big, 0, 0);
      g.fillStyle = S.res.col; g.fillText(S.res.big, 0, 0);
      if (S.res.small) { g.font = '800 20px system-ui'; const fsS = Math.max(12, Math.min(20, Math.floor(20 * room / (g.measureText(S.res.small).width + 20)))); g.font = `800 ${fsS}px system-ui`; g.lineWidth = 6; g.strokeStyle = INK; g.strokeText(S.res.small, 0, big * 0.85 + 2); g.fillStyle = '#fff'; g.fillText(S.res.small, 0, big * 0.85); }
      g.restore(); g.textBaseline = 'alphabetic';
    }

    if (S.st === 'fight' && S.fish) {


      const top = S.fish.top > 1 ? S.fish.top : 1;
      const [lo, hi] = S.fish.zone, T = clamp(S.Td, 0, top), phone = innerWidth <= 700;
      const w = phone ? 20 : 28, h = phone ? 160 : clamp(NEAR - BAR_Y() - 150, 180, 270);
      const y = phone ? HOR - 84 : BAR_Y() + 64, R = w / 2 + 6, x = GAUGE_X(phone, y - R, y + h + R);
      const Y = (v) => y + h * (1 - v / top);
      const state = S.grace > 0 ? 'ready' : (S.warnT > 0 || S.spikeT > 0) ? 'jerk' : T > hi ? 'high' : T < lo ? 'low' : 'ok';

      g.fillStyle = 'rgba(0,0,0,.22)'; rr(x - R + 3, y - R + 6, R * 2, h + R * 2, R); g.fill();
      let gr2 = g.createLinearGradient(x - R, 0, x + R, 0); gr2.addColorStop(0, '#7a4e18'); gr2.addColorStop(0.3, '#f3cf78'); gr2.addColorStop(0.55, '#c48a2e'); gr2.addColorStop(1, '#6e4414');
      g.fillStyle = gr2; rr(x - R, y - R, R * 2, h + R * 2, R); g.fill(); line(3); g.stroke(); gq('gauge', x - R, y - R, x + w / 2 + 44, y + h + R + 6);

      g.save(); rr(x - w / 2, y, w, h, w / 2); g.clip();
      const f = (v) => clamp(1 - v / top, 0, 1);
      gr2 = g.createLinearGradient(0, y, 0, y + h);
      gr2.addColorStop(0, '#d63b27'); gr2.addColorStop(clamp(f(hi) - 0.06, 0.01, 1), '#f48a5a'); gr2.addColorStop(f(hi) + 0.015, '#86d96c'); gr2.addColorStop(clamp(f(lo) - 0.015, 0, 1), '#5cc254'); gr2.addColorStop(clamp(f(lo) + 0.06, 0, 0.99), '#9fd2f4'); gr2.addColorStop(1, '#4a86cf');
      g.fillStyle = gr2; g.fillRect(x - w / 2, y, w, h);

      if (T > hi - 0.04 || state === 'jerk') { g.fillStyle = `rgba(255,70,40,${0.25 + 0.25 * Math.sin(S.clock * 12)})`; g.fillRect(x - w / 2, y, w, Y(hi) - y); }
      if (state === 'low') { g.fillStyle = `rgba(60,120,255,${0.2 + 0.2 * Math.sin(S.clock * 10)})`; g.fillRect(x - w / 2, Y(lo), w, y + h - Y(lo)); }
      if (state === 'ok') { g.fillStyle = `rgba(255,255,255,${0.18 + 0.12 * Math.sin(S.clock * 6)})`; g.fillRect(x - w / 2, Y(hi), w, Y(lo) - Y(hi)); }

      g.fillStyle = 'rgba(255,255,255,.5)'; rr(x - w / 2 + 3, y + 6, 4, h - 12, 2); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2; for (const v of [lo, hi]) { g.beginPath(); g.moveTo(x - w / 2, Y(v)); g.lineTo(x + w / 2, Y(v)); g.stroke(); }
      g.restore();
      line(3); rr(x - w / 2, y, w, h, w / 2); g.stroke();

      if (state === 'ok') { g.save(); g.shadowColor = '#8dff6a'; g.shadowBlur = 16; g.strokeStyle = 'rgba(170,255,140,.9)'; g.lineWidth = 3; rr(x - w / 2 - 2, Y(hi), w + 4, Y(lo) - Y(hi), 6); g.stroke(); g.restore(); }

      const ty = Y(T), fc = state === 'high' || state === 'jerk' ? '#ff6a4d' : state === 'low' ? '#6aa8ff' : '#fff3d9';
      const shake = state === 'jerk' ? Math.sin(S.clock * 40) * 2 : 0;
      g.save(); g.translate(x + shake, ty);
      g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(2, 4, w / 2 + 10, 6, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = fc; line(3); g.beginPath(); g.moveTo(w / 2 + 6, 0); g.lineTo(w / 2 + 16, -7); g.lineTo(w / 2 + 16, 7); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.ellipse(0, 0, w / 2 + 8, 7, 0, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = INK; g.beginPath(); g.arc(-w / 2 - 2, -1.5, 1.8, 0, Math.PI * 2); g.fill();

      const showDir = S.spikeT > 0 || (S.warnT > 0 && S.fish.df < 1.05);
      if (showDir) { const d2 = S.spikeDir, ay2 = -d2 * (16 + 4 * Math.sin(S.clock * 18)); g.fillStyle = d2 > 0 ? '#ff4d2e' : '#3d8bff'; line(3); g.beginPath(); g.moveTo(w / 2 + 30, ay2 - d2 * 12); g.lineTo(w / 2 + 40, ay2); g.lineTo(w / 2 + 34, ay2); g.lineTo(w / 2 + 34, ay2 + d2 * 10); g.lineTo(w / 2 + 26, ay2 + d2 * 10); g.lineTo(w / 2 + 26, ay2); g.lineTo(w / 2 + 20, ay2); g.closePath(); g.fill(); g.stroke(); }
      else if (S.warnT > 0) { g.fillStyle = '#f08a24'; line(3); g.beginPath(); g.arc(w / 2 + 30, -18, 9, 0, Math.PI * 2); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.font = '900 13px system-ui'; g.textAlign = 'center'; g.fillText('?', w / 2 + 30, -13.5); }
      g.restore();

      const px = x - R - 6, pl = (t, yy, hl) => plate(t, px, yy, hl);
      pl(phone ? '✂' : '✂ порвётся', y + 10, T > hi - 0.04 || state === 'jerk' ? '#c83a24' : null);
      pl(phone ? '✓' : '✓ тяни', (Y(hi) + Y(lo)) / 2, state === 'ok' ? '#2c9a48' : null);
      pl(phone ? '〰' : '〰 провисла', y + h - 10, state === 'low' ? '#2f6fc1' : null);

      if (state !== S.lastSt) {
        const prev = S.lastSt; S.lastSt = state;
        if (state === 'low') pop('Тяни!', '#2f6fc1');
        else if (state === 'high') pop('Отпусти!', '#e0503a');
        else if (state === 'jerk' && S.warnT > 0) pop(S.fish.df < 1.05 ? (S.spikeDir > 0 ? 'Сейчас дёрнет - отпусти!' : 'Идёт на тебя - тяни!') : 'Сейчас дёрнет!', '#f08a24');
        else if (state === 'ok' && prev && prev !== 'ready') pop(['Отлично!', 'Так держать!', 'Хорошо!'][Math.floor(Math.random() * 3)], '#2c9a48');
      }
      const kk = S.prog / S.fish.need;
      if (kk >= 0.5 && !S.m50) { S.m50 = 1; pop('Рыба устаёт!', '#2c9a48', 1); }
      if (kk >= 0.85 && !S.m85) { S.m85 = 1; pop('Ещё чуть-чуть!', '#c79a2b', 1); }

      const bw = Math.min(300, L1 - L0 - 140), bx = (L0 + L1) / 2 - bw / 2, by = BAR_Y(), k = clamp(kk, 0, 1);
      g.fillStyle = '#fff3d9'; line(4); rr(bx, by, bw, 22, 11); g.fill(); gq('bar', bx - 2, by - 2, bx + bw + 2, by + 24);
      if (k > 0) { g.save(); rr(bx, by, bw, 22, 11); g.clip(); g.fillStyle = S.fish.id === 'legend' ? '#d9a436' : '#3fae5b'; g.fillRect(bx, by, bw * k, 22); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(bx, by + 3, bw * k, 5); g.restore(); }
      line(4); rr(bx, by, bw, 22, 11); g.stroke();
      g.fillStyle = INK; g.font = '800 13px system-ui'; g.textAlign = 'center'; g.fillText(S.fish.id === 'legend' ? `Легенда - фаза ${S.fish.phase} - ${Math.round(k * 100)}%` : `Рыба устаёт - ${Math.round(k * 100)}%`, bx + bw / 2, by + 16);
    }

    if (S.catchA) drawCatch();
    for (const p of S.conf) { g.save(); g.globalAlpha = Math.min(1, 2 - p.t); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-5, -3, 10, 6); g.restore(); }
  }






  const HTML = "<canvas data-i=\"cv\" aria-label=\"Озеро Рябиненя - рыбалка\"></canvas>\n<button class=\"ui gbtn exit\" data-i=\"exit\" title=\"Выйти из рыбалки\"><svg viewBox=\"0 0 32 32\" aria-hidden=\"true\"><path d=\"M19 7 10 16l9 9\" fill=\"none\" stroke=\"#2b2121\" stroke-width=\"4.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg><span>Выйти</span></button>\n<div class=\"ui top\"><span class=\"chip\" data-i=\"casts\">Забросов: 30 / 30</span><span class=\"chip\" data-i=\"coins\">🪙 0</span></div>\n<div class=\"ui dock\">\n  <button class=\"gbtn rbtn\" data-i=\"bBook\" title=\"Книга рыб\"><svg viewBox=\"0 0 32 32\" aria-hidden=\"true\"><path d=\"M5 7c4-2 8-2 11 1 3-3 7-3 11-1v18c-4-2-8-2-11 1-3-3-7-3-11-1z\" fill=\"#c8553d\" stroke=\"#2b2121\" stroke-width=\"2.5\" stroke-linejoin=\"round\"/><path d=\"M16 8v18\" stroke=\"#2b2121\" stroke-width=\"2.5\"/><path d=\"M8 13q2.5-2 5 0-2.5 2-5 0z\" fill=\"#fff3d9\" stroke=\"#2b2121\" stroke-width=\"1.5\"/></svg>Книга<span class=\"bd\" data-i=\"bdBook\"></span></button>\n  <button class=\"gbtn rbtn\" data-i=\"bNet\" title=\"Сети\"><svg viewBox=\"0 0 32 32\" aria-hidden=\"true\"><path d=\"M4 9h24l-4 16H8z\" fill=\"#e7c98c\" stroke=\"#2b2121\" stroke-width=\"2.5\" stroke-linejoin=\"round\"/><path d=\"M7 14h18M8 19h16M12 9l-2 16M20 9l2 16M16 9v16\" stroke=\"#2b2121\" stroke-width=\"1.6\"/></svg><span data-i=\"netL\">Сети</span></button>\n  <button class=\"gbtn rbtn\" data-i=\"bBag\" title=\"Рыбак Сом: улов и удочка\"><svg viewBox=\"0 0 32 32\" aria-hidden=\"true\"><path d=\"M7 11h18l-2 16H9z\" fill=\"#9aa7b0\" stroke=\"#2b2121\" stroke-width=\"2.5\" stroke-linejoin=\"round\"/><ellipse cx=\"16\" cy=\"11\" rx=\"9\" ry=\"3\" fill=\"#7d8a93\" stroke=\"#2b2121\" stroke-width=\"2.5\"/><path d=\"M11 9q5-6 10 0\" fill=\"none\" stroke=\"#2b2121\" stroke-width=\"2.5\"/></svg>Сом<span class=\"bd\" data-i=\"bdBag\"></span></button>\n</div>\n<button class=\"ui gbtn tool\" data-i=\"bTool\" title=\"Для проверки\" hidden>⚙</button>\n<div class=\"ui hint\" data-i=\"hint\">Зажми (мышь, палец или пробел) - <b>заброс</b>. Отпусти, когда шкала дальности на нужной отметке.</div>\n<div class=\"ui res\" data-i=\"res\"></div>\n<div class=\"ui ann\" data-i=\"ann\"></div>\n<div class=\"ui toast\" data-i=\"toast\"></div>\n<div class=\"ui modal\" data-i=\"mBag\"><div class=\"win\"><button class=\"gbtn x\" data-close>✕</button>\n  <div class=\"som\"><canvas data-i=\"somP\" width=\"128\" height=\"128\" aria-label=\"Рыбак Сом\"></canvas><div><h2>Рыбак Сом</h2><div class=\"say\" data-i=\"say\">Заходи, рыбак, показывай улов.</div></div></div>\n  <div class=\"tabs\"><button class=\"tab on\" data-tab=\"tBag\">Улов</button><button class=\"tab\" data-tab=\"tRod\">Удочка</button></div>\n  <div class=\"pane on\" data-i=\"tBag\"><ul class=\"bag\" data-i=\"bag\"></ul><div class=\"row\"><button class=\"gbtn wbtn acc\" data-i=\"sell\" disabled>Продать улов</button><span class=\"muted\" data-i=\"sellv\"></span></div><p class=\"muted\">Нажми на рыбу - пожарить (жареная - в сумку героя, это еда), подарить трофеем или продать отдельно. Легенду «Продать улов» не трогает.</p></div>\n  <div class=\"pane\" data-i=\"tRod\"><canvas data-i=\"rodP\" width=\"840\" height=\"170\" style=\"width:100%;height:auto;max-width:420px\"></canvas><div data-i=\"rodInfo\"></div><div data-i=\"rodReq\" class=\"rodReq\"></div><div class=\"row\" style=\"margin-top:8px\"><button class=\"gbtn wbtn acc\" data-i=\"up\">Улучшить</button><span class=\"muted\" data-i=\"upv\"></span></div><p class=\"muted\">Без наживок: одна удочка, 5 уровней. Каждый уровень - зелёная зона шире на 3%, леска прочнее.</p></div>\n  <div class=\"gift\" data-i=\"gift\"><h2>Подарить трофеем</h2><p class=\"muted\" style=\"margin:0\">Трофей повесят на стену дома в гильдейском районе (в игре - потом). Кому?</p><div class=\"row\" data-i=\"friends\"></div><div class=\"row\"><button class=\"gbtn wbtn\" data-i=\"giftNo\">Отмена</button></div></div>\n</div></div>\n<div class=\"ui modal\" data-i=\"mBook\"><div class=\"win wide\"><button class=\"gbtn x\" data-close>✕</button><h2>Книга рыбака</h2>\n  <div class=\"tabs\"><button class=\"tab on\" data-tab=\"tFish\">Рыбы</button><button class=\"tab\" data-tab=\"tAch\">Достижения</button><button class=\"tab\" data-tab=\"tWeek\">Рыбак недели</button></div>\n  <div class=\"pane on\" data-i=\"tFish\"><div class=\"titleL\" data-i=\"titleL\"></div><div data-i=\"mast\"></div><div class=\"book\" data-i=\"book\"></div><h3>Журнал</h3><ol class=\"log\" data-i=\"log\"></ol></div>\n  <div class=\"pane\" data-i=\"tAch\"><ul class=\"ach\" data-i=\"ach\"></ul></div>\n  <div class=\"pane\" data-i=\"tWeek\"><p class=\"muted\" style=\"margin-top:0\">Канал за эту неделю, по общему весу улова (сапог и сундук не в счёт).</p><table class=\"week\" data-i=\"week\"></table><p class=\"muted\">Награда недели - черновик (например, сундук и титул «Рыбак недели» на 7 дней).</p></div>\n</div></div>\n<div class=\"ui modal\" data-i=\"mNet\"><div class=\"win\"><button class=\"gbtn x\" data-close>✕</button><h2>Сети</h2><p>Поставить сети и уйти: без мини-игры, через <span data-i=\"netH\">час</span> - мелкая рыба (плотва, карась). Сундуков в сетях не бывает.</p><div class=\"row\"><button class=\"gbtn wbtn acc\" data-i=\"net\">Поставить сети</button><span class=\"muted\" data-i=\"netv\"></span></div></div></div>\n<div class=\"ui modal\" data-i=\"mTool\"><div class=\"win\"><button class=\"gbtn x\" data-close>✕</button><h2>Для проверки (тестеры)</h2><p class=\"muted\">Только вид: улов, забросы и монеты решает игра.</p><div class=\"row\"><button class=\"gbtn wbtn acc\" data-i=\"tRods\">Витрина удочек</button><button class=\"gbtn wbtn\" data-i=\"tAnn\">Показать объявление</button></div></div></div>\n<div class=\"ui modal\" data-i=\"mRods\"><div class=\"win rods\"><button class=\"gbtn x\" data-close>✕</button><h2>Витрина удочек: 7 стилей × 5 уровней</h2><canvas data-i=\"rodsC\" width=\"1800\" height=\"1460\" style=\"width:100%;height:auto;display:block\"></canvas><p class=\"muted\">Палитры - как у гербов гильдий.</p></div></div>";
  const HOT_D = 0.06;

   
  const down = () => { if (!S || S.held) return; S.held = true; onDown(); };
  const up = () => { if (!S || !S.held) return; S.held = false; onUp(); };
  const inBucket = (sx, sy) => { const bk = BK() - 110; return (S.st === 'idle' || S.st === 'wait' || S.st === 'reel') && sx > bk + 62 && sx < bk + 158 && sy > NEAR + 20 && sy < H; };
  function onPointerDown(e) {
    e.preventDefault();
    const sx = e.clientX / SC - OX, sy = e.clientY / SC - OY;

    if (S.cat && (S.cat.st === 'come' || S.cat.st === 'reach') && Math.hypot(sx - S.cat.x, sy - (H - 40)) < 60) { shoo(); return; }

    if (inBucket(sx, sy)) { openCatch(); return; }
    try { cv.setPointerCapture(e.pointerId); } catch (x) {   }
    down();
  }
  function onPointerMove(e) { const sx = e.clientX / SC - OX, sy = e.clientY / SC - OY; S.bkHover = e.pointerType === 'mouse' && inBucket(sx, sy); cv.style.cursor = S.bkHover ? 'pointer' : ''; }
  function onKeyDown(e) {
    if (!R) return;
    if (e.code === 'Escape') { if (anyModal()) closeAll(); else close(); e.stopPropagation(); return; }
    if (e.code === 'Space' && !anyModal() && !(e.target && e.target.closest && e.target.closest('input, textarea, select'))) { e.preventDefault(); e.stopPropagation(); if (!e.repeat) down(); }
  }
  function onKeyUp(e) { if (!R) return; if (e.code === 'Space') { e.preventDefault(); up(); } }
  


  function onLeave() {
    if (!S || !S.held) return;
    S.held = false;
    if (S.st === 'aim') { S.st = 'idle'; S.power = 0; hint('Зажми - <b>заброс</b>.'); }
  }
  const onVis = () => { if (document.hidden) onLeave(); };
  function openCatch() { $('bBag').click(); const t = R.querySelector('[data-i="mBag"] .tab[data-tab="tBag"]'); if (t) t.click(); }

  function hint(t) { const h = $('hint'); if (h) h.innerHTML = t; }
  function onDown() {
    if (S.st === 'idle') {
      if (!V || !V.on) { hint('Рыбалка сейчас закрыта.'); return; }
      if (vCasts() <= 0) { hint('Забросы кончились - +1 каждые 10 минут.'); return; }
      S.st = 'aim'; S.power = 0; S.pDir = 1;
      hint('Отпусти, когда шкала на нужной дальности: <b>близко</b> - быстро и мелко, <b>далеко</b> - долго, крупно, шанс на сундук со дна.');
    } else if (S.st === 'wait' && S.cast) {

      flop(S.nib > 0 ? 'Подсёк на ложной поклёвке - рыба ушла' : 'Рано! Поклёвки ещё не было');
    } else if (S.st === 'bite') hook();
  }
  function onUp() { if (S.st === 'aim') cast(); }

   
  function cast() {
    const d = clamp(S.power, 0.05, 1), zone = ZONE(d);
    const y = depthY(d), k = depthK(y);
    const hot = !!(S.hot && Math.abs(d - S.hot.d) <= HOT_D);
    const x = hot ? S.hot.x + rnd(-12, 12) * k : W / 2 + rnd(-140, 140) * k;
    S.bob = { x0: ROD.x, y0: ROD.y, x, y, k, t: 0, dur: 0.5 + d * 0.6, d, zone, hot };
    S.st = 'fly'; S.fish = null; S.pend = null; S.cast = null; S.castErr = null; S.biteLate = null; LIVEQ.clear();
    if (V) { V.casts = Math.max(0, vCasts() - 1); castsText(); }
    hint(`Заброс: <b>${ZONE_RU[zone]}</b>. Ждём поклёвку…`);
    const mine = S.bob;

    call('cast', { force: +d.toFixed(3) }).then((r) => {
      if (!S || S.bob !== mine) return;
      if (!r || !r.ok) { S.castErr = (r && r.error) || 'не вышло'; return; }
      S.cast = { castId: r.castId, zone: r.zone, hot: r.hot, t0: S.clock };
      if (r.hot && !S.bob.hot) S.bob.hot = true;
      if (r.zone && ZONE_RU[r.zone]) S.bob.zone = r.zone;
      const q = LIVEQ.get(String(r.castId)); LIVEQ.clear(); if (q) for (const e of q) live(e);
      refresh();
    });
  }
   
  function arm() {
    S.pend = { bp: (S.pend && S.pend.bp) || 'small' };
    S.st = 'wait';
    S.nib = 0; S.nibA = null;
    if (S.bob.hot) pop('В пятно!', '#2c9a48', 1);
    hint('Смотри на поплавок: у каждой рыбы <b>своя поклёвка</b>. Настоящая - жми!');
    if (S.biteLate) { const e = S.biteLate; S.biteLate = null; live(e); }
  }
  function landed() {
    ripple(S.bob.x, S.bob.y, 1);
    S.st = 'wait'; S.t = 0;
    if (S.cast) arm(); else { S.pend = null; }
  }
   
  const LIVEQ = new Map();
  function live(e) {
    if (!S || !e || typeof e !== 'object') return;
    const c = String(e.c || '');
    if (!S.cast) { if ((S.st === 'fly' || S.st === 'wait') && c) { const q = LIVEQ.get(c) || []; q.push(e); LIVEQ.set(c, q.slice(-8)); } return; }
    if (S.cast.castId !== c) return;
    const bp = BP[e.bp] ? e.bp : 'small';
    if (e.k === 'nib') {
      if (S.st !== 'wait') return;
      if (S.pend) S.pend.bp = bp;
      const dur = Math.max(0.05, (+e.dur || 200) / 1000);
      S.nibA = { t0: S.t, dur }; S.nib = dur; ripple(S.bob.x, S.bob.y, 0.5);
    } else if (e.k === 'bite') {
      if (S.st === 'fly') { S.biteLate = e; return; }
      if (S.st !== 'wait') return;
      S.pend = { bp };
      S.biteForm = e.form === 'under' ? 'under' : 'own';
      S.biteWin = e.win ? +e.win / 1000 : (BP[bp].win[0] + BP[bp].win[1]) / 2 + (mlvl() >= 2 ? 0.15 : 0);
      S.st = 'bite'; S.bite = 0; S.biteT0 = performance.now(); S.nibA = null; ripple(S.bob.x, S.bob.y, 1.4); hint('<b>Клюёт! Жми!</b> Сразу - идеальная подсечка.');
    }
  }
   
  function bobPose() {
    const P = S.pend ? S.pend.bp : 'small';
    let dip = 0, tilt = 0, dx = 0;
    if (S.st === 'wait' || S.st === 'fly') {
      dip = Math.sin(S.t * 3) * 1.2;
      const n = S.nibA;
      if (n) {
        const q = clamp((S.t - n.t0) / n.dur, 0, 1), s = Math.sin(q * Math.PI);
        if (P === 'small') dip += s * 4 + Math.sin(S.t * 55) * 1.5 * s;
        else if (P === 'perch') dip += 9 * s;
        else if (P === 'pike') { dip += 3 * s; dx = 4 * s; }
        else if (P === 'bream') { tilt = 0.35 * s; dip -= 1.5 * s; }
        else if (P === 'cat') dip += 5 * s;
        else { dx = 6 * s; dip += 2 * s; }
      }
    } else if (S.st === 'bite' || S.st === 'hook') {
      const b = S.bite, q = clamp(b / S.biteWin, 0, 1);
      if (S.biteForm === 'under') { dip = Math.min(24, 6 + b * 60); dx = 0; }
      else if (P === 'small') dip = 9 + Math.sin(S.t * 40) * 3;
      else if (P === 'perch') dip = b < 0.12 ? 13 : b < 0.24 ? 3 : 13;
      else if (P === 'pike') { dip = 16; dx = 10 * q; }
      else if (P === 'bream') { tilt = Math.min(1.45, b * 5); dip = -4 * Math.min(1, b * 4); }
      else if (P === 'cat') dip = 3 + 11 * q;
      else { dip = Math.min(12, 3 + b * 12); dx = 14 * q; }
    }
    return { dip, tilt, dx };
  }

   
  

  function hook() {
    const c = S.cast; if (!c) return;
    const hookT = Math.round(performance.now() - (S.biteT0 || performance.now()));
    ripple(S.bob.x, S.bob.y, 2);
    pop('Подсечка!', '#c8553d', 1);
    startFight();
    const F = S.fish;
    call('hook', { castId: c.castId, t: hookT, rtt: rtt() }).then((r) => {
      if (!S || S.fish !== F) return;
      if (!r || !r.ok || !r.fight) { flop((r && r.error) || 'Сорвалась'); refresh(); return; }
      seedFight(F, r);
    });
  }
   
  function startFight() {
    const f = { ...FISH.roach, n: 'Рыба', col: '#c9d3dc' };
    const K = KIND.calm;
    S.fish = { id: null, f, df: 1, need: 10, zone: K.zone.slice(), phase: 1, perfect: false, m: null, pre: [], inputs: [], acc: 0, ms: 0, heldLast: false, local: false };
    S.st = 'fight'; S.T = 0.5; S.Td = 0.5; S.grace = 1.2; S.lastSt = 'ready'; S.m50 = 0; S.m85 = 0; S.low = 0; S.spikeT = 0; S.warnT = 0; S.spikeDir = 1;
    S.prog = 0;
    hint('Подсёк! <b>Зажми</b> - тянешь, <b>отпусти</b> - леска слабеет. Держи указатель в <b>зелёном</b>, пока рыба не устанет.');
  }
  



  function seedFight(F, r) {
    const P = (r.fight && r.fight.params) || {};
    const sa = Math.round(F.pre.length * STEP * 1000);
    F.sa = sa;
    const m = makeFight(r.fight, sa);
    F.m = m; F.local = m.local; F.perfect = !!r.perfect;
    F.df = +P.df || 1; F.legend = !!P.legend;
    F.top = 1 + 0.02 * Math.max(0, (+P.rod || vRod()) - 1);
    if (P.legend) F.f = { ...F.f, col: FISH.legend.col };
    const steps = F.pre; F.pre = null;
    let o = null;
    if (m.local) { F.heldLast = false; for (let n = 0; n < steps.length; n++) { const h = !!steps[n]; if (h !== F.heldLast) { F.heldLast = h; F.inputs.push([Math.round(n * STEP * 1000), h ? 1 : 0]); } o = m.sim.step(STEP, h); } }
    else if (typeof m.sim.one === 'function') { for (const h of steps) m.sim.one(h ? 1 : 0); o = m.sim.S; }
    o = o || m.sim.step(0, false) || {};
    F.zone = Array.isArray(o.zone) ? o.zone.slice() : Array.isArray(P.zone) ? P.zone.slice() : F.zone;
    F.need = +o.need || +P.need || 10;
    S.T = Number.isFinite(+o.T) ? +o.T : 0.5; S.Td = S.T; S.prog = +o.prog || 0;
    if (r.perfect) { pop('Идеальная подсечка!', '#d99a12', 1); popLater('Рыба уже устала на 25%', '#2c9a48'); }
    if (P.legend) popLater('Это что-то огромное!', '#b8860b', 1);
    if (o.done) judge(!!o.won, o.why || '');
  }
  function fightStep(dt) {
    const F = S.fish;
    F.acc += dt;
    while (F.acc >= STEP && S.st === 'fight') {
      F.acc -= STEP; F.ms += STEP * 1000;
      if (F.pre) {
        F.pre.push(S.held ? 1 : 0); S.grace = Math.max(0.6, 1.2 - F.ms / 1000);
        if (F.ms > 15e3) { flop('Игра не ответила - рыба ушла'); refresh(); break; }
        continue;
      }
      if (F.local && S.held !== F.heldLast) { F.heldLast = S.held; F.inputs.push([Math.round(F.ms - STEP * 1000), S.held ? 1 : 0]); }
      const prevWarn = S.warnT, sim = F.m.sim;
      let o; if (!F.local && typeof sim.one === 'function' && sim.S) { sim.one(S.held ? 1 : 0); o = sim.S; } else o = sim.step(STEP, S.held) || {};
      S.T = +o.T; S.spikeT = +o.spikeT || 0; S.warnT = +o.warnT || 0; S.spikeDir = o.spikeDir < 0 ? -1 : 1; S.prog = +o.prog || 0;
      S.grace = o.grace != null ? +o.grace : Math.max(0, (S.grace || 0) - STEP);
      if (Array.isArray(o.zone)) F.zone = o.zone;
      if (o.phase && o.phase !== F.phase) { F.phase = o.phase; pop(o.phase === 2 ? 'Фаза 2: Сом злится!' : 'Фаза 3: последний рывок!', o.phase === 2 ? '#e0503a' : '#b8860b', 1); }
      if (prevWarn > 0 && S.warnT <= 0 && S.spikeT > 0 && F.df >= 1.05) pop(S.spikeDir > 0 ? 'Рывок! Отпусти!' : 'Пошла на тебя! Тяни!', S.spikeDir > 0 ? '#e0503a' : '#2f6fc1', 1);
      if (o.done) { judge(!!o.won, o.why || ''); break; }
      if (F.ms > 3 * 60e3) { judge(false, 'timeout'); break; }
    }


    S.Td = S.T;
    if (Math.random() < 0.04) ripple(S.bob.x + rnd(-14, 14), S.bob.y + rnd(-10, 10), 0.6);
  }
   
  function judge(wonLocal, whyLocal) {
    const F = S.fish, c = S.cast; S.st = 'judge'; S.t = 0;
    if (wonLocal) hint('Тянем к причалу…'); else hint('…');
    const inputs = (F.local ? F.inputs : F.m.sim.inputs).slice(0, 3000);
    call('fight', { castId: c && c.castId, inputs, rtt: rtt(), sa: F.sa || 0 }).then((r) => {
      if (!S || S.fish !== F) return;
      if (!r || !r.ok) { flop((r && r.error) || 'Связь оборвалась - рыба ушла'); refresh(); return; }
      if (!r.won) { flop(whyText(r.why) || whyText(whyLocal) || 'Сорвалась'); refresh(); return; }
      finish(r);
    });
  }
   
  function whyText(w) {
    if (!w) return '';
    return { break: 'Леска порвалась!', slack: 'Рыба ушла - леска ослабла', timeout: 'Рыба ушла', ok: '' }[w] != null ? { break: 'Леска порвалась!', slack: 'Рыба ушла - леска ослабла', timeout: 'Рыба ушла', ok: '' }[w] : String(w);
  }
  function finish(r) {
    const id = r.id || S.fish.id || 'roach', f = FISH[id] || FISH.roach;
    const type = r.type || (f.kind === 'junk' ? 'junk' : f.kind === 'item' ? 'chest' : id === 'legend' ? 'legend' : 'fish');
    const kg = +r.kg || 0;
    log(`${ZONE_RU[S.bob.zone] || ''}: ${r.n || f.n}${type === 'fish' || type === 'legend' ? ' · ' + kgStr(kg) + ' кг' : ''}${S.fish.perfect ? ' (идеальная подсечка)' : ''}`);
    for (let i = 0; i < 14; i++) S.splash.push({ x: S.bob.x, y: S.bob.y, vx: rnd(-90, 90), vy: rnd(-160, -40), t: 0 });
    S.catchA = { t: 0, id, it: { id, type, n: r.n || f.n, kg }, rec: !!r.record, x0: S.bob.x, y0: S.bob.y, k0: S.bob.k, conf: 0 };
    S.st = 'catch'; S.t = 0; hint(type === 'chest' ? 'Сундук! Открыть - у <b>Рыбака Сома</b>.' : type === 'junk' ? 'Сапог… бывает.' : '<b>Есть!</b> Улов - в ведро.');
    if (r.lvUp) { const ls = Array.isArray(r.lvUp) ? r.lvUp : [r.lvUp]; for (const l of ls) { popLater(`Мастерство: ур. ${l}!`, '#2f6fc1', 1); if (SKILLS[l]) popLater(`Умение: ${SKILLS[l][0]}`, '#2f6fc1', 1); log(`Рыболовство: уровень ${l}${SKILLS[l] ? ' - ' + SKILLS[l][0] : ''}`); } }
    for (const a of Array.isArray(r.ach) ? r.ach : []) { const n = ACH_N[typeof a === 'string' ? a : a && a.id] || (a && a.n) || String(a); S.newAch++; popLater(`Достижение: ${n}`, '#8a5cd6', 1); log(`Достижение: ${n}`); }
    if (r.v && typeof r.v === 'object') setView(r.v); else refresh();
  }
  function catchDone() { S.catchA = null; S.st = 'reel'; S.t = 0; ui(); }
  function flop(why) { show(false, why, 'Забрасывай ещё'); if (S.bob) log(`${ZONE_RU[S.bob.zone] || ''}: ${why}`); S.st = 'reel'; S.t = 0; S.fish = null; ui(); }
  function show(ok, big, small) { S.res = { big, small, col: ok ? '#e8a915' : '#ee5a36', t: 0 }; }
  function toast(t) { const el = $('toast'); if (!el) return; el.textContent = t; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); clearTimeout(S.toastT); S.toastT = setTimeout(() => el.classList.remove('on'), 2400); }
   
  let annT = 0;
  function ann(a) {
    if (!a) return;
    const who = esc(a.n || a.login || 'Рыбак'), kg = a.kg != null ? ` - ${kgStr(+a.kg)} кг` : '', fishN = esc(a.fish || 'Старый Сом Рябиненя');
    const html = `<small>Объявление для всех</small>Игрок <b>${who}</b> вытащил легендарную рыбу «${fishN}»${kg}!`;
    const el = R ? $('ann') : pageAnn();
    el.innerHTML = html; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
    clearTimeout(annT); annT = setTimeout(() => el.classList.remove('on'), 6000);
  }
   
  function pageAnn() {
    let el = document.querySelector('.f2ann');
    if (!el) { el = document.createElement('div'); el.className = 'f2ann'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    return el;
  }
  function log(t) { const L = $('log'); if (!L) return; const li = document.createElement('li'); li.textContent = t; L.prepend(li); while (L.children.length > 30) L.lastChild.remove(); }
  function ripple(x, y, s) {
    S.ripples.push({ x, y, t: 0, s });
    for (const p of PADS) if (Math.hypot(p.x - x, (p.y - y) * 2.5) < 150 * depthK(p.y) + 40 * s) p.jump = Math.min(1, p.jump + 0.6 * s);
  }
   
  function pop(text, col, big) {
    const now = S.clock; if (!big && S.popAt && now - S.popAt < 0.35) return; S.popAt = now;
    S.pops = S.pops.filter((q) => q.big !== !!big || q.t > 0.6);
    S.pops.push({ text, col, big: !!big, t: 0, rot: (Math.random() - 0.5) * 0.12, dx: (Math.random() - 0.5) * 60 });
  }
  function popLater(text, col, big) { S.popQ.push([text, col, big]); }

   
  function setView(v) {
    if (!v || typeof v !== 'object') return;
    V = { ...(V || {}), ...v };
    if (!S) return;
    const first = !S.viewed && (v.on != null || v.casts != null);
    if (first) S.viewed = true;
    if (v.rod != null) S.rodOk = true;


    if (V.style) { const st = styleOf(V.style); if (st !== S.style && STY[st]) setStyle(st); }

    const n = V.net;
    if (n && (n.until || n.ready)) { if (!S.net) { S.net = { t: 0, dur: 1 }; } S.netUntil = +n.until || 0; S.netReady = !!n.ready || (S.netUntil && Date.now() >= S.netUntil); }
    else if (!S.netPull && !S.netA) { S.net = null; S.netUntil = 0; S.netReady = false; }

    const sp = V.spot;
    if (sp && (+sp.until > Date.now() || +sp.left > 0) && sp.d != null) {
      const key = String(sp.id || sp.until || sp.d);
      if (!S.hot || S.hot.key !== key) { const d = clamp(+sp.d, 0.05, 1), y = depthY(d), left = sp.until ? (+sp.until - Date.now()) / 1000 : +sp.left / 1000; S.hot = { key, d, x: W / 2 + (sp.x != null ? clamp(+sp.x, -1, 1) * 100 : rnd(-100, 100)) * depthK(y), y, t: 0, dur: Math.max(1, left) }; }
    } else if (S.hot && !(sp && sp.d != null)) S.hot = null;

    const c = V.cat, cu = c && typeof c === 'object' ? +c.until : +c;
    if (cu && cu > Date.now() && S.catUntil !== cu && !S.cat) { S.catUntil = cu; S.cat = { st: 'come', t: 0, x: L0 - 70, x0: L0 - 70, until: cu }; }
    if (v.stole) { pop(`Кот утащил ${ACC[v.stole.id] || 'рыбу'}!`, '#e0503a', 1); log(`Кот утащил: ${v.stole.n || ''}`); }
    if (first && S.st === 'idle') hint(vCasts() > 0 ? 'Зажми (мышь, палец или пробел) - <b>заброс</b>. Отпусти, когда шкала дальности на нужной отметке.' : 'Забросы кончились - +1 каждые 10 минут.');
    const bt = $('bTool'); if (bt) bt.hidden = V.test !== true;
    ui();
  }

   
  const MODALS = { bBag: 'mBag', bBook: 'mBook', bNet: 'mNet', bTool: 'mTool' };
  function closeAll() { if (!R) return; for (const m of R.querySelectorAll('.modal.on')) m.classList.remove('on'); const gf = $('gift'); if (gf) gf.classList.remove('on'); }
  const busy = () => S.st === 'fight' || S.st === 'bite' || S.st === 'catch' || S.st === 'hook' || S.st === 'judge';
  function say(kind) { const a = SAY[kind] || SAY.hi; $('say').textContent = a[Math.floor(Math.random() * a.length)]; }
  const sellable = (x) => x.type === 'fish' || x.type === 'junk';
  const priceOf = (x) => (x.p != null ? +x.p : Math.round(+((V && V.prices) || {})[x.id] || 0));
   
  async function act(op, body, okText, sayKind) {
    if (S.actBusy) return null;
    S.actBusy = op;
    const r = await call(op, body);
    if (!S) return r;
    S.actBusy = '';
    if (!r || !r.ok) { toast((r && r.error) || 'Не вышло'); if (r && r.say && SAY[r.say]) say(r.say); refresh(); return r; }
    if (sayKind) say(typeof sayKind === 'function' ? sayKind(r) : sayKind);
    const t = typeof okText === 'function' ? okText(r) : okText; if (t) toast(t);
    if (r.v && typeof r.v === 'object') setView(r.v); else refresh();
    return r;
  }
  function wire() {
    for (const [b, m] of Object.entries(MODALS)) $(b).onclick = () => {
      if (busy()) return; if (m === 'mTool' && !(V && V.test === true)) return;
      closeAll(); $(m).classList.add('on');
      if (m === 'mBook') { S.seen = Object.keys(vBook()).length; S.newAch = 0; }
      if (m === 'mBag') { S.sel = -1; say(vBag().length ? 'hi' : 'empty'); }
      ui();
    };
    for (const m of R.querySelectorAll('.modal')) m.addEventListener('pointerdown', (e) => { if (e.target === m || e.target.closest('[data-close]')) closeAll(); });
    for (const t of R.querySelectorAll('.tab')) t.onclick = () => { const w = t.closest('.win'); for (const x of w.querySelectorAll('.tab')) x.classList.toggle('on', x === t); for (const p of w.querySelectorAll('.pane')) p.classList.toggle('on', p.dataset.i === t.dataset.tab); };
    $('exit').onclick = () => close();
    $('net').onclick = () => {
      if (S.netPull || S.netA) return;
      if (S.net && S.netReady) { pullNet(); return; }
      if (S.net) return;
      act('netSet', {}, 'Сети поставлены').then((r) => { if (r && r.ok) { S.netA = { t: 0 }; S.net = S.net || { t: 0, dur: 1 }; log('Сети поставлены'); closeAll(); } });
    };
    $('sell').onclick = () => {
      const sold = vBag().filter(sellable); if (!sold.length) return;
      act('sell', { all: 1 }, (r) => `Продано: +${r.coins != null ? r.coins : sold.reduce((a, x) => a + priceOf(x), 0)} 🪙`,
        () => (sold.some((x) => x.id === 'catfish') ? 'cat' : sold.every((x) => x.type === 'junk') ? 'boot' : 'big')).then((r) => { if (r && r.ok) { S.sel = -1; log(`Рыбак Сом купил улов${r.coins != null ? ': ' + r.coins + ' монет' : ''}`); } });
    };
    $('bag').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]'), li = e.target.closest('li[data-n]');
      if (!li) return;
      const i = +li.dataset.n, x = vBag()[i]; if (!x) return;
      const ref = x.i != null ? x.i : i;
      if (!btn) { if (x.type === 'fish' || x.type === 'legend' || x.type === 'junk') { S.sel = S.sel === i ? -1 : i; ui(); } return; }
      const a = btn.dataset.act;
      if (a === 'fry') act('fry', { i: ref }, (r) => `${r.n || (r.it && r.it.n) || 'Жареная рыба'} - в сумке героя`, 'fry').then((r) => { if (r && r.ok) { S.sel = -1; log(`Пожарено: ${x.n || FISH[x.id].n}`); } });
      else if (a === 'sell') act('sell', { items: [ref] }, (r) => `Продано: +${r.coins != null ? r.coins : priceOf(x)} 🪙`, x.type === 'legend' ? 'legend' : x.type === 'junk' ? 'boot' : x.id === 'catfish' ? 'cat' : priceOf(x) >= 30 ? 'big' : 'small').then((r) => { if (r && r.ok) S.sel = -1; });
      else if (a === 'gift') { S.giftI = ref; S.giftN = x.n || FISH[x.id].n; giftForm(); }
      else if (a === 'open') act('chest', { i: ref }, null, 'chest').then((r) => {
        if (!r || !r.ok) return;
        if (r.coins) { toast(`В сундуке: ${r.coins} 🪙`); pop(`+${r.coins} монет`, '#c79a2b', 1); log(`Сундук: ${r.coins} монет`); }
        else { const k = ITEMS[r.item] ? r.item : /sphere/.test(r.item || '') ? 'sphere' : 'star'; toast(`В сундуке: ${ITEMS[k].n}!`); pop(`✨ ${ITEMS[k].n}!`, '#8a5cd6', 1); log(`Сундук: ${ITEMS[k].n}`); }
      });
    });
    $('friends').addEventListener('click', (e) => {
      const b = e.target.closest('[data-f]'); if (b) { sendGift(b.dataset.f); return; }
      if (e.target.closest('[data-fsend]')) { const inp = $('friends').querySelector('input'); const v = inp ? inp.value.trim() : ''; if (v) sendGift(v); }
    });
    $('giftNo').onclick = () => $('gift').classList.remove('on');
    $('up').onclick = () => {
      if (vRod() >= 5) { say('max'); return; }
      const rq = rodReq(), miss = rq.filter((x) => !x.ok);
      if (miss.length) { say(miss.length === 1 && /монет/i.test(miss[0].t) ? 'poor' : 'req'); toast('Не хватает: ' + miss.map((x) => String(x.t).toLowerCase()).join(', ')); return; }
      act('upgrade', {}, (r) => `Удочка: уровень ${r.rod || vRod() + 1}`, (r) => ((r.rod || 0) >= 5 ? 'max' : 'up')).then((r) => { if (r && r.ok) log(`Удочка улучшена до уровня ${r.rod || vRod()}`); });
    };
    R.querySelector('[data-i="mBag"] .tab[data-tab="tRod"]').addEventListener('click', () => { if (vRod() < 5 && rodReq().some((x) => !x.ok)) say('req'); });
    $('tAnn').onclick = () => { closeAll(); ann({ n: (X && X.login && X.login()) || 'Рыбак', kg: 64.3 }); };
    $('tRods').onclick = () => { closeAll(); $('mRods').classList.add('on'); };
  }
  function giftForm() {
    const fr = Array.isArray(V && V.friends) ? V.friends : [];
    $('friends').innerHTML = (fr.length ? fr.map((f) => { const n = typeof f === 'string' ? f : f.n || f.login; return `<button class="gbtn wbtn" data-f="${esc(n)}">${esc(n)}</button>`; }).join('') : '')
      + '<span class="giftTo"><input type="text" maxlength="25" placeholder="ник друга" aria-label="Кому подарить"><button class="gbtn wbtn acc" data-fsend>Подарить</button></span>';
    $('gift').classList.add('on');
  }
  function sendGift(to) {
    act('gift', { i: S.giftI, to }, `Трофей отправлен: ${to}`, 'gift').then((r) => { if (r && r.ok) { S.sel = -1; $('gift').classList.remove('on'); pop('Трофей отправлен!', '#c79a2b', 1); log(`Трофей «${S.giftN}» подарен: ${to}`); } });
  }
  function pullNet() {
    act('netPull', {}, null, null).then((r) => {
      if (!r || !r.ok) return;
      const got = (Array.isArray(r.got) ? r.got : []).map((x) => ({ id: x.id || 'roach', type: 'fish', n: x.n || (FISH[x.id] || FISH.roach).n, kg: +x.kg || 0 }));
      S.net = null; S.netReady = false; S.netPull = { t: 0, got }; closeAll();
    });
  }
   
  function rodReq() {
    const q0 = V && V.req, q = q0 && Array.isArray(q0.list) ? q0.list : q0;
    if (Array.isArray(q)) return q.map((x) => ({ t: x.t || x.n || '', have: +x.have || 0, need: +x.need || 0, ok: x.ok != null ? !!x.ok : +x.have >= +x.need, lv: !!x.lv || x.k === 'mast', coins: !!x.coins || x.k === 'coins' || /монет/i.test(x.t || '') }));
    if (q && typeof q === 'object') {
      const out = [], book = vBook();
      if (q.coins) out.push({ t: 'Монеты', have: +(V.coins || 0), need: +q.coins, coins: true });
      if (q.mast > 1) out.push({ t: 'Мастерство', have: mlvl(), need: +q.mast, lv: true });
      for (const [id, n] of Object.entries(q.fish || {})) out.push({ t: id === 'any' ? 'Поймано рыб' : (FISH[id] || { n: id }).n, have: id === 'any' ? Object.entries(book).filter(([k]) => LAKE.includes(k)).reduce((a, [, b]) => a + b.n, 0) : (book[id] ? book[id].n : 0), need: +n });
      for (const x of out) x.ok = x.have >= x.need;
      return out;
    }
    return [];
  }
  function shoo() {
    if (!S.cat) return; S.cat.st = 'flee'; S.cat.t = 0; pop('Брысь!', '#e0503a', 1); log('Кота шуганули');
    call('cat', { shoo: 1 }).then((r) => { if (r && r.ok && !r.shoo) toast('Не успел - кот уже убежал'); refresh(); });
  }
  function catStep(dt) {
    const C = S.cat; C.t += dt;
    const target = BK() - 78;
    if (C.st === 'come') { C.x = C.x0 + (target - C.x0) * Math.min(1, C.t / 1); if (C.t >= 1) { C.st = 'reach'; C.t = 1; } }
    else if (C.st === 'reach') {
      C.x = target;
      if (C.until ? Date.now() > C.until + 300 : C.t >= 5) {
        const before = vBag().length;
        refresh().then(() => { if (!S) return; const lost = before - vBag().length; if (lost > 0) { pop('Кот утащил рыбу!', '#e0503a', 1); log('Кот утащил рыбу'); } });
        C.fish = '#c9d3dc'; C.st = 'run'; C.t = 0;
      }
    } else { C.x -= (C.st === 'flee' ? 420 : 300) * dt; if (C.x < L0 - 100) S.cat = null; }
  }

  function castsText() {
    const el = $('casts'); if (!el) return;
    const n = vCasts(), M = vMax(), at = +(V && V.nextAt) || 0;
    let tail = '';
    if (n < M && at) { const left = Math.max(0, Math.ceil((at - Date.now()) / 1000)), mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0'); tail = ` · +1 через ${mm}:${ss}`; }
    el.textContent = `Забросов: ${n} / ${M}` + tail;
  }
   
  function friedIcon(id) {
    try { const I = window.LGInventory; if (I && I.art) return `<span class="fico">${I.art({ id: 'fried_' + id, slot: 'food', rarity: 'common' })}</span>`; } catch (e) {   }
    return '';
  }
  function ui() {
    if (!R || !S) return;
    castsText();
    const coinsV = V && V.coins != null ? +V.coins : (() => { const q = V && V.req && Array.isArray(V.req.list) ? V.req.list.find((x) => x.k === 'coins') : null; return q && q.have != null ? +q.have : null; })();
    $('coins').textContent = coinsV != null ? `🪙 ${coinsV}` : '';
    $('coins').hidden = coinsV == null;
    const bag = vBag(), book = vBook(), ach = vAch();
    $('bdBag').textContent = bag.length ? String(bag.length) : '';
    const nk = Object.keys(book).length - (S.seen || 0) + S.newAch; $('bdBook').textContent = S.seen && nk > 0 ? '+' + nk : S.newAch ? '+' + S.newAch : '';

    $('bag').innerHTML = bag.length ? bag.slice(0, 60).map((x, i) => {
      if (x.tr != null && x.trophy == null) x.trophy = !!x.tr;
      const f = FISH[x.id] || {}, n = x.n || (x.type === 'item' && ITEMS[x.id] ? ITEMS[x.id].n : f.n) || x.id, p = priceOf(x);
      const cls = x.type === 'legend' ? 'legend' : x.type === 'fried' ? 'fried' : (x.epic || f.epic) ? 'epic' : (x.rare || f.rare) ? 'rare' : '';
      const w = (x.type === 'fish' || x.type === 'legend') ? ` · ${kgStr(x.kg)} кг` : '';
      const right = x.type === 'chest' ? '<button class="gbtn sbtn acc" data-act="open">Открыть</button>' : x.type === 'item' ? 'заточка' : x.type === 'fried' ? 'еда' : p + ' м.';
      let extra = '';

      if (x.type === 'fried') extra = '<span class="sub">сумка героя полна - освободи место, и рыба переедет туда</span>';
      if (x.trophy && S.sel !== i) extra = '<span class="sub">🏆 трофей - можно подарить</span>';
      if (S.sel === i) extra = `<span class="acts">${x.type === 'fish' ? '<button class="gbtn sbtn" data-act="fry">🔥 Пожарить</button>' : ''}${x.trophy ? '<button class="gbtn sbtn" data-act="gift">🏆 Подарить трофеем</button>' : ''}<button class="gbtn sbtn" data-act="sell">${x.type === 'junk' ? 'Отдать Сому' : `Продать · ${p} 🪙`}</button></span>`;
      return `<li data-n="${i}" class="${cls}${S.sel === i ? ' sel' : ''}"><span>${x.type === 'fried' ? friedIcon(x.id) : ''}${esc(n)}${w}</span><span>${right}</span>${extra}</li>`;
    }).join('') : '<li class="muted">Пусто - пора забрасывать.</li>';
    const v = bag.filter(sellable).reduce((a, x) => a + priceOf(x), 0), nS = bag.filter(sellable).length;
    $('sell').disabled = !nS || !!S.actBusy; $('sellv').textContent = nS ? `≈ ${v} монет` : '';

    const r = vRod();
    $('rodInfo').innerHTML = `<b>Удочка - уровень ${r} из 5</b><br>Зелёная зона: +${(r - 1) * 3}% · леска прочнее на ${(r - 1) * 2}% · натяжение растёт медленнее на ${(r - 1) * 4}%`;
    { const rq = rodReq(), miss = rq.filter((x) => !x.ok), cost = (rq.find((x) => x.coins) || {}).need;
      $('rodReq').innerHTML = r >= 5 ? '' : `<b>Для уровня ${r + 1}:</b><ul>${rq.map((x) => `<li class="${x.ok ? 'ok' : ''}"><span>${x.ok ? '✓' : '○'} ${esc(x.t)}</span><span>${x.lv ? 'ур. ' : ''}${Math.min(x.have, x.need)} / ${x.need}${x.coins ? ' 🪙' : ''}</span></li>`).join('')}</ul>`;
      $('up').disabled = r >= 5 || miss.length > 0 || !rq.length || !!S.actBusy; $('up').textContent = r >= 5 ? 'Максимум' : cost ? `Улучшить за ${cost} 🪙` : 'Улучшить';
      $('upv').textContent = r >= 5 ? '' : miss.length ? 'не хватает: ' + miss.map((x) => String(x.t).toLowerCase()).join(', ') : rq.length ? 'всё готово!' : ''; }
    drawRodPreview();

    const M = vMast(), l = M.lv, k = l >= 10 ? 1 : M.hi != null && M.hi > M.lo ? clamp((M.xp - M.lo) / (M.hi - M.lo), 0, 1) : 0;
    const all = LAKE.filter((id) => book[id]).length;
    $('titleL').className = 'titleL' + (ach.all ? ' got' : '');
    $('titleL').textContent = ach.all ? '🏅 Титул: «Рыбак Рябиненя»' : `Собери всех рыб озера (${all}/${LAKE.length}) - титул «Рыбак Рябиненя»`;
    $('mast').innerHTML = `<b>Рыболовство - уровень ${l}</b> <span class="muted">${l >= 10 ? 'максимум' : M.hi != null ? `${M.xp - M.lo} / ${M.hi - M.lo} опыта · до ур. ${l + 1} - ${M.hi - M.xp}` : ''}</span><div class="mbar"><i style="width:${Math.round(k * 100)}%"></i></div><div class="skills">${Object.entries(SKILLS).map(([n, [a, b]]) => `<span class="${l >= n ? '' : 'off'}">${l >= n ? '✓' : '🔒'} ур. ${n} - <b>${a}</b>: ${b}</span>`).join('')}</div>`;
    { const ids = FISH_IDS, open = ids.filter((id) => book[id]).length;
      $('book').innerHTML = `<div class="bookTop" style="grid-column:1/-1"><span>Открыто ${open} из ${ids.length}</span><span class="pb"><i style="width:${Math.round(open / ids.length * 100)}%"></i></span></div>` + ids.map((id) => { const f = FISH[id], b = book[id], rr0 = RAR(id), rk = rr0 === 'epic' && id === 'chest' ? 'редкость: клад' : RAR_RU[rr0];
        return b ? `<div class="fc got ${rr0}">${fishSVG(id, false)}<b>${esc(f.n)}</b><span class="rar">${rk}</span><span class="nn">×${b.n}</span>${f.kind !== 'item' && f.kind !== 'junk' ? `<span>рекорд ${kgStr(b.max)} кг</span>` : ''}<i>поклёвка: ${BP[f.bp].ru} или уходит под воду</i></div>`
          : `<div class="fc locked ${rr0}">${fishSVG(id, true)}<b>???</b><span class="rar">${RAR_RU[rr0]}</span><i>пока не поймано</i></div>`; }).join(''); }
    const ap = (V && V.achP) || {};
    $('ach').innerHTML = ACH.map(([id, name, desc]) => `<li class="${ach[id] ? 'got' : ''}"><span class="ic">${ach[id] ? '✓' : ''}</span><span><b>${name}</b><br><span class="muted">${desc}${!ach[id] && ap[id] ? ' · ' + esc(ap[id]) : ''}</span></span></li>`).join('');
    const W0 = V && V.week, wk = Array.isArray(W0) ? W0 : W0 && Array.isArray(W0.top) ? W0.top : [], me = X && X.login ? String(X.login() || '').toLowerCase() : '';
    $('week').innerHTML = (wk.length ? wk.map((x, i) => { const n = Array.isArray(x) ? x[0] : x.n || x.login, kg = Array.isArray(x) ? x[1] : x.kg, my = (Array.isArray(x) ? x[2] : x.me) || String(n || '').toLowerCase() === me;
      return `<tr class="${my ? 'me' : ''}"><td>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td><td>${esc(n)}</td><td>${kgStr(+kg)} кг</td></tr>`; }).join('') : '<tr><td class="muted">На этой неделе ещё никто не рыбачил.</td></tr>') + (W0 && !Array.isArray(W0) && W0.my != null ? `<tr class="me"><td>·</td><td>Вы</td><td>${kgStr(+W0.my)} кг</td></tr>` : '');

    const nb = $('net'), nv = $('netv');
    if (S.netPull || S.netA) { nb.disabled = true; } else if (S.net && S.netReady) { nb.disabled = false; nb.textContent = 'Вытащить сети'; } else if (S.net) { nb.disabled = true; nb.textContent = 'Сети в воде'; } else { const nc = V && V.netCasts != null ? +V.netCasts : 3, lack = vCasts() < nc; nb.disabled = !!S.actBusy || lack; nb.textContent = 'Поставить сети'; nv.textContent = `Сеть: ${nc} ${((a, b) => (a > 10 && a < 20 ? 'забросов' : b === 1 ? 'заброс' : b >= 2 && b <= 4 ? 'заброса' : 'забросов'))(nc % 100, nc % 10)}` + (lack ? ' - не хватает забросов' : ''); }
    const nh = $('netH'); if (nh && V && V.netMin) nh.textContent = V.netMin >= 60 && V.netMin % 60 === 0 ? (V.netMin === 60 ? 'час' : `${V.netMin / 60} ч`) : `${V.netMin} мин`;
    $('bNet').classList.toggle('on', !!S.net);
  }

   
  let last = 0, raf = 0, viewT = 0;
  function frame(now) {
    if (!R) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    S.t += dt; S.clock += dt;
    if (Math.floor(S.clock * 2) !== Math.floor((S.clock - dt) * 2)) {
      castsText();

      if (V && V.nextAt && Date.now() >= +V.nextAt && vCasts() < vMax() && S.clock - viewT > 5) { viewT = S.clock; refresh(); }
      if (S.net && S.netUntil && !S.netReady) { const left = Math.max(0, Math.ceil((S.netUntil - Date.now()) / 1000)); const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0'); $('netv').textContent = `сети в воде: ещё ${mm}:${ss}`; $('netL').textContent = left >= 60 ? `${Math.ceil(left / 60)} мин` : `${left} с`; if (left <= 0) { S.netReady = true; $('netv').textContent = 'готово - можно вытаскивать'; $('netL').textContent = 'Готово'; ui(); } }
      else if (!S.net) $('netL').textContent = 'Сети';
    }
    if (S.st === 'aim') { const slow = mlvl() >= 6 && S.power > 0.72 ? 0.55 : 1; S.power += S.pDir * dt * 0.9 * slow; if (S.power >= 1) { S.power = 1; S.pDir = -1; } if (S.power <= 0) { S.power = 0; S.pDir = 1; } }
    if (S.st === 'fly') { S.bob.t += dt; if (S.bob.t >= S.bob.dur) landed(); }
    if (S.st === 'wait') {
      if (!S.pend && S.cast) arm();
      if (!S.cast && S.castErr) { const e = S.castErr; S.castErr = null; flop(e); refresh(); }
      else if (!S.cast && S.t > 13) { flop('Игра не ответила - забрось ещё'); refresh(); }
      else if (S.pend) {

        if (S.nib > 0) { S.nib -= dt; if (S.nib <= 0) S.nibA = null; }
        if (S.clock - S.cast.t0 > 25) { flop('Рыба не клюнула - забрось ещё'); refresh(); }
      }
    }



    if (S.st === 'bite') { S.bite = S.biteT0 ? Math.max(S.bite, (now - S.biteT0) / 1000) : S.bite + dt; if (S.bite > S.biteWin + 0.25) { flop('Не успел подсечь - рыба сорвалась'); refresh(); } }
    if (S.st === 'hook') { S.bite += dt; if (S.bite > 14) { flop('Игра не ответила - рыба ушла'); refresh(); } }
    if (S.st === 'fight') fightStep(dt);
    if (S.st === 'catch') { S.catchA.t += dt; if (S.catchA.t >= 2.15) catchDone(); }
    if (S.st === 'reel' && S.t > 0.9) { S.st = 'idle'; S.bob = null; S.pend = null; S.cast = null; hint(vCasts() > 0 ? 'Зажми - <b>заброс</b>.' : 'Забросы кончились - +1 каждые 10 минут.'); }
    if (S.netA) { S.netA.t += dt; if (S.netA.t >= 1.2) { S.netA = null; ripple(NETX(), depthY(NETD), 1.6); } }
    if (S.netPull) { S.netPull.t += dt; if (S.netPull.t >= 2.2) { const n = S.netPull.got.length; S.netPull = null; log(`Сети: ${n} рыбёшек`); show(true, 'Сети вытащены', `${n} рыбёшек в ведро`); ui(); } }
    if (S.hot) { S.hot.t += dt; if (Math.random() < dt * 3) ripple(S.hot.x + rnd(-14, 14) * depthK(S.hot.y), S.hot.y + rnd(-4, 4), 0.35); if (S.hot.t >= S.hot.dur) S.hot = null; }
    if (S.cat) catStep(dt);
    placeHint();
    if (S.popQ.length && !S.catchA && S.clock - (S.popQAt || 0) > 0.95) { S.popQAt = S.clock; pop(...S.popQ.shift()); }
    for (const p of PADS) p.jump = Math.max(0, p.jump - dt * 1.5);
    for (const r of S.ripples) r.t += dt; S.ripples = S.ripples.filter((r) => r.t < 1.2);
    if (S.res) { S.res.t += dt; if (S.res.t > 2.1) S.res = null; }
    for (const q of S.pops) q.t += dt; S.pops = S.pops.filter((q) => q.t < 1.2);
    for (const p of S.splash) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 420 * dt; } S.splash = S.splash.filter((p) => p.t < 0.9);
    for (const p of S.conf) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; p.r += p.vr * dt; } S.conf = S.conf.filter((p) => p.t < 2);
    draw();
    if ($('mRods').classList.contains('on')) drawShowcase();
    if ($('mBag').classList.contains('on') && $('tRod').classList.contains('on')) drawRodPreview();
    raf = requestAnimationFrame(frame);
  }

   
  


  let hintK = '', geoN = 0;
  const rectOf = (el) => { if (!el || !el.getClientRects().length) return null; const r = el.getBoundingClientRect(); return r.width && r.height ? [r.left, r.top, r.right, r.bottom] : null; };
  function placeHint() {
    const h = $('hint'), to = $('toast'); if (!h || !S) return;
    if (geoN-- <= 0) {
      geoN = 8;
      const box = CH && CH.querySelector('.cy-chat');
      S.chatR = box ? rectOf(box.classList.contains('open') ? box : (box.querySelector('.cy-chat-t') || box)) : null;
      S.dockR = rectOf(R.querySelector('.dock'));
      S.chatOver = !!(box && box.classList.contains('open') && phoneChat());
    }
    const vw = innerWidth, phone = vw <= 700;
    const chips = rectOf(R.querySelector('.top')), top0 = Math.round(Math.max(chips ? chips[3] + 8 : 60, (BAR_Y() + 50 + OY) * SC));

    let l = 12, r = vw - 12;
    const gq0 = ((S._geoPrev || {}).gauge || [])[0]; if (!phone && gq0) r = Math.min(r, Math.round((gq0[0] - 110 + OX) * SC) - 8);
    const C = S.chatR; if (C && C[1] < top0 + 90 && C[3] > top0 - 4) l = Math.max(l, Math.round(C[2] + 10));
    const Dk = S.dockR; if (Dk && Dk[1] < top0 + 90 && Dk[3] > top0 - 4) r = Math.min(r, Math.round(Dk[0] - 10));


    const free = r - l >= 240, w = Math.max(160, Math.min(560, free ? r - l : vw - 24)), hw0 = h.offsetWidth ? Math.min(w, h.offsetWidth) / 2 : w / 2;
    const cx = Math.round(free ? clamp(vw / 2, l + hw0, r - hw0) : vw / 2);

    const hHide = S.st === 'catch' || (S.chatOver && r - l < 320);
    if (h.style.opacity !== (hHide ? '0' : '')) h.style.opacity = hHide ? '0' : '';
    const annEl = R.querySelector('.ann.on'), annB = annEl ? rectOf(annEl) : null, hTop = Math.round(Math.max(top0, annB ? annB[3] + 8 : 0));
    const hr = hHide ? null : rectOf(h), toTop = Math.round(Math.max(hTop + (hr ? hr[3] - hr[1] + 8 : 0), annB ? annB[3] + 8 : 0));


    const wEl = R.querySelector('.modal.on .win');
    if (wEl) {
      const cur = parseFloat(wEl.style.left) || 0, b0 = wEl.getBoundingClientRect(), nl = b0.left - cur, nr = b0.right - cur;
      let dx = 0; if (C && !S.chatOver && C[1] < b0.bottom && C[3] > b0.top && C[2] + 12 > nl) dx = Math.max(0, Math.min(C[2] + 12 - nl, vw - 12 - nr));
      if (Math.abs(dx - cur) > 0.5) wEl.style.left = dx ? Math.round(dx) + 'px' : '';
    }
    const winB = rectOf(R.querySelector('.modal.on .win')), toX = winB ? Math.round((winB[0] + winB[2]) / 2) : cx, toY = winB ? Math.round(winB[3] - 64) : toTop, toW = winB ? Math.round(winB[2] - winB[0] - 24) : w;
    const k = [hTop, cx, w, vw, toY, toX, toW].join(':');
    if (k !== hintK) {
      hintK = k;
      h.style.top = hTop + 'px'; h.style.bottom = 'auto'; h.style.left = cx + 'px'; h.style.right = 'auto'; h.style.transform = 'translateX(-50%)'; h.style.maxWidth = w + 'px'; h.style.width = 'max-content';
      if (to) { to.style.top = toY + 'px'; to.style.bottom = 'auto'; to.style.left = toX + 'px'; to.style.maxWidth = toW + 'px'; }
    }
  }
   
  const phoneChat = () => { try { return matchMedia('(max-width: 720px), (max-height: 480px)').matches; } catch (e) { return innerWidth <= 720; } };
  let chatWas = null;
  function chatFold() {
    chatWas = null; if (!CH || !phoneChat()) return;
    const box = CH.querySelector('.cy-chat'); if (!box || !box.classList.contains('open')) return;
    const x = box.querySelector('.cy-chat-x'); if (x) { x.click(); chatWas = true; }
  }
  function chatUnfold() {
    if (!chatWas) return; chatWas = null;
    setTimeout(() => { const box = document.querySelector('.cy-chat'); if (box && !box.classList.contains('open')) { const t = box.querySelector('.cy-chat-t'); if (t) t.click(); } }, 0);
  }
  let shutCb = null, poll = 0, CH = null;
  function open(x) {
    if (R) return;
    X = x || {}; shutCb = X.close || null;
    S = fresh(); V = null; EARLY.clear(); viewMiss = 0; clearTimeout(viewRetry);




    try {
      const h = X.hero && X.hero(), b = h && h.cr && h.cr.fish && h.cr.fish.f2;
      if (b && typeof b === 'object' && b.rod != null) { V = { on: b.on, casts: b.casts, max: b.max, nextAt: b.nextAt, rod: b.rod }; S.rodOk = true; }
    } catch (e) { console.warn('[рыбалка] снимок героя', e); }
    R = document.createElement('div'); R.className = 'f2'; R.setAttribute('role', 'dialog'); R.setAttribute('aria-label', 'Рыбалка - озерцо Рябиненя');
    R.innerHTML = HTML;
    document.body.appendChild(R);
    cv = $('cv'); g = cv.getContext('2d');
    cv.addEventListener('pointerdown', onPointerDown);
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('pointermove', onPointerMove);
    cv.addEventListener('pointerleave', () => { if (S) { S.bkHover = false; cv.style.cursor = ''; } });
    addEventListener('resize', resize);
    addEventListener('keydown', onKeyDown, true); addEventListener('keyup', onKeyUp, true);
    addEventListener('blur', onLeave); document.addEventListener('visibilitychange', onVis);

    CH = document.createElement('div'); CH.className = 'f2chat'; document.body.appendChild(CH);
    try { if (window.LGChatOne && window.LGChatOne.dock) window.LGChatOne.dock('fish2', CH); } catch (e) { console.warn('[рыбалка] чат', e); }
    chatFold();
    resize(); wire(); setStyle(styleOf((X.style && X.style()) || 'legion')); drawSom();
    hint('Загружаем озеро…');
    refresh();
    clearInterval(poll); poll = setInterval(() => { if (R && S && (S.st === 'idle' || S.st === 'reel') && !S.actBusy) refresh(); }, 30000);
    last = 0; raf = requestAnimationFrame(frame);
  }
  function close() {
    if (!R) return;
    cancelAnimationFrame(raf); clearInterval(poll); clearTimeout(viewRetry);
    removeEventListener('resize', resize);
    removeEventListener('keydown', onKeyDown, true); removeEventListener('keyup', onKeyUp, true);
    removeEventListener('blur', onLeave); document.removeEventListener('visibilitychange', onVis);
    try { if (window.LGChatOne && window.LGChatOne.dock) window.LGChatOne.dock('fish2', null); } catch (e) { console.warn('[рыбалка] чат', e); }
    if (CH) { CH.remove(); CH = null; }
    hintK = ''; chatUnfold();
    R.remove(); R = null; cv = null; g = null; S = null;
    for (const [, w] of WAIT) w.res({ ok: false, error: 'экран закрыт' }); WAIT.clear();
    const cb = shutCb; shutCb = null; X = null;
    if (cb) try { cb(); } catch (e) { console.warn('[рыбалка] close', e); }
  }

  window.LGFish2 = { open, close, result, ann, live, hero: () => {   }, get on() { return !!R; }, get _S() { return S; }, get _V() { return V; },
     
    _geo: () => { const o = {}; if (!S || !S._geo) return o; for (const k in S._geo) o[k] = S._geo[k].map(([a, b, c, d]) => [(a + OX) * SC, (b + OY) * SC, (c + OX) * SC, (d + OY) * SC]); return o; } };
})();
