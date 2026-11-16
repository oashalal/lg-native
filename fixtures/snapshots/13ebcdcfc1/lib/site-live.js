




















(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LGLiveLink = api;
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';
  const T = { first: [1000, 6000], base: 1000, max: 30000, busy: [20000, 60000], wsTries: 4, noWsMs: 600000, sseErrs: 3 };
  const EV = '{"op":"ev","e":"', EVD = '","d":';

  function open(o) {
    const WS = o.WebSocket || root.WebSocket, ES = o.EventSource || root.EventSource;
    const setT = o.setTimeout || ((f, ms) => root.setTimeout(f, ms)), clrT = o.clearTimeout || ((t) => root.clearTimeout(t));
    const rnd = o.random || Math.random, now = o.now || Date.now, log = o.log || (() => {});
    const L = {
      ok: false, kind: '', onopen: null, onerror: null,
      addEventListener(n, fn) { const a = H.get(n); if (a) a.push(fn); else { H.set(n, [fn]); if (es && n !== 'open' && n !== 'busy') sseOn(es, n); } },
      close() { closed = true; clrT(timer); drop(); L.ok = false; },
      downMs() { return L.ok ? 0 : now() - downAt; },
      fails() { return fails; },

      me() { return meBase; },
      gap() { meV = -1e9; },
    };
    const H = new Map();
    let closed = false, timer = 0, ws = null, es = null, fails = 0, wsFails = 0, wsEver = false, noWsUntil = 0, downAt = now(), gen = 0;



    let meBase = null, meV = null, meWant = false;

    const emit = (n, data) => { for (const fn of H.get(n) || []) { try { fn({ type: n, data }); } catch (e) { log('обработчик «' + n + '»', e); } } };
    function up() {
      fails = 0;
      if (o.backoff) o.backoff.reset();
      if (L.ok) return;
      L.ok = true;
      try { if (L.onopen) L.onopen({ type: 'open' }); } catch (e) { log('onopen', e); }
      emit('open', '');
    }
    function drop() {
      gen++;
      meBase = null; meV = null; meWant = false;
      if (ws) { const s = ws; ws = null; try { s.onopen = s.onmessage = s.onclose = s.onerror = null; s.close(1000); } catch (e) {   } }
      if (es) { const s = es; es = null; try { s.close(); } catch (e) {   } }
    }
    function pause(why) {
      if (why === 'busy' || why === 'rate_limited') return T.busy[0] + rnd() * (T.busy[1] - T.busy[0]);
      const n = fails++;
      if (o.backoff) return o.backoff.next();
      if (n === 0) return T.first[0] + rnd() * (T.first[1] - T.first[0]);
      const b = Math.min(T.max, T.base * Math.pow(2, n));
      return b / 2 + rnd() * (b / 2);
    }

    function wait(why) { let h = 0; try { h = o.hold && o.hold.left ? +o.hold.left() || 0 : 0; } catch (e) { h = 0; } return Math.max(pause(why), h); }
     
    function down(why) {
      if (closed) return;
      drop();
      if (L.ok) { L.ok = false; downAt = now(); try { if (L.onerror) L.onerror({ type: 'error', why }); } catch (e) { log('onerror', e); } }
      clrT(timer);
      timer = setT(connect, why === 'now' ? (o.hold && o.hold.left ? o.hold.left() : 0) : wait(why));
    }
    function auth() { if (closed) return; L.close(); try { if (o.onAuth) o.onAuth(); } catch (e) { log('onAuth', e); } }

    function connect() {
      if (closed) return;
      timer = 0;
      const w = WS && now() >= noWsUntil && o.ws ? o.ws() : null;
      if (w && w.url && w.ch) wsOpen(w); else sseOpen();
    }


    function wsOpen(w) {
      L.kind = 'ws';
      const g = gen;
      let s, opened = false;
      try { s = new WS(w.url); } catch (e) { return wsBad(); }
      ws = s;
      s.onopen = () => { if (g === gen) opened = true; };
      s.onmessage = (e) => {
        if (g !== gen) return;
        const t = typeof e.data === 'string' ? e.data : '';
        if (t.startsWith(EV)) {
          const q = t.indexOf(EVD, EV.length);
          if (q < 0) return;
          up();
          const n = t.slice(EV.length, q), data = t.slice(q + EVD.length, -1);
          if (n === 'me') {
            let d = null;
            try { d = JSON.parse(data); } catch (er) { d = null; }
            meBase = d && typeof d === 'object' ? d : null; meV = meBase && typeof meBase.mv === 'number' ? meBase.mv : null; meWant = false;
            emit('me', data);
            return;
          }
          if (n === 'mep') {
            if (meWant) return;
            let p = null;
            try { p = JSON.parse(data); } catch (er) { p = null; }
            if (!p || !meBase || meV === null || p.mv !== meV + 1) {
              meWant = true;
              log('вид героя: версия ' + (p && p.mv) + ' после ' + meV + ' - прошу полный');
              try { s.send(JSON.stringify({ op: 'live', ch: w.ch, ...(w.sm ? { sm: 1 } : {}) })); } catch (er) {   }
              return;
            }
            meBase = meApply(meBase, p); meV = p.mv;
            emit('me', JSON.stringify(meBase));
            return;
          }
          emit(n, data);
          return;
        }
        let m;
        try { m = JSON.parse(t); } catch (er) { return; }
        if (!m || typeof m !== 'object') return;
        if (m.op === 'hello') {
          if (!m.user) return auth();
          try { s.send(JSON.stringify({ op: 'live', ch: w.ch, ...(w.sm ? { sm: 1 } : {}) })); } catch (er) {   }
          return;
        }
        if (m.op === 'liveok') { wsFails = 0; wsEver = true; up(); return; }
        if (m.op === 'liveerr') {
          const c = String(m.code || '');
          if (c === 'login_required') return auth();
          if (c === 'off' || c === 'no_channel' || c === 'forbidden') { noWsUntil = now() + T.noWsMs; return down('now'); }
          return down(c === 'busy' || c === 'rate_limited' ? c : 'liveerr');
        }
      };
      s.onclose = (e) => {
        if (g !== gen) return;
        const code = e && e.code;
        if (code === 4001) return auth();


        if (!opened && !wsEver && ++wsFails >= T.wsTries) { noWsUntil = now() + T.noWsMs; log('сокет не открывается - живой канал по SSE на ' + (T.noWsMs / 60000) + ' мин'); }
        down('close');
      };
      s.onerror = () => {   };
    }
    function wsBad() { if (!wsEver && ++wsFails >= T.wsTries) noWsUntil = now() + T.noWsMs; down('close'); }


    function sseOn(s, n) {
      const g = gen;
      s.addEventListener(n, (e) => { if (g !== gen) return; up(); emit(n, e.data); });
    }
    function sseOpen() {
      if (!ES) { L.kind = ''; return; }
      L.kind = 'sse';
      const g = gen;
      let s, errs = 0;
      try { s = new ES(o.sse()); } catch (e) { return down('sse'); }
      es = s;
      for (const n of H.keys()) if (n !== 'open' && n !== 'busy') sseOn(s, n);
      s.addEventListener('busy', () => { if (g === gen) down('busy'); });
      s.onopen = () => { if (g !== gen) return; errs = 0; up(); };

      s.onerror = () => {
        if (g !== gen) return;
        if (L.ok) { L.ok = false; downAt = now(); try { if (L.onerror) L.onerror({ type: 'error', why: 'sse' }); } catch (e) { log('onerror', e); } }
        if (s.readyState === 2 || ++errs >= T.sseErrs) down('sse');
      };
    }

    connect();
    API.last = L;
    return L;
  }

   
  function meApply(base, p) {
    const key = (x) => String(x && x.uid != null ? x.uid : '');
    const out = Object.assign({}, base), hero = Object.assign({}, base.hero);
    out.hero = hero;
    if (p.h) Object.assign(hero, p.h);
    for (const k of p.hx || []) delete hero[k];
    if (p.it) {
      const by = new Map();
      for (const x of base.hero.items || []) by.set(key(x), x);
      for (const k of p.it.d || []) by.delete(k);
      let order = (base.hero.items || []).map(key).filter((k) => by.has(k));
      for (const x of p.it.u || []) { const k = key(x); if (!by.has(k)) order.push(k); by.set(k, x); }
      if (p.it.o) order = p.it.o;
      hero.items = order.map((k) => by.get(k)).filter(Boolean);
    }
    if ('cr' in p) out.creating = p.cr;
    if ('r' in p) out.results = p.r;
    if ('fq' in p) out.fq = p.fq;
    if ('synced' in p) out.synced = p.synced;
    if ('now' in p) out.now = p.now;
    out.mv = p.mv;
    return out;
  }

  const API = { open, T, meApply, last: null };
  return API;
});
