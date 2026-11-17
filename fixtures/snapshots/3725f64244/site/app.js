'use strict';



(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const SU = window.LGSiteUi;
  const esc = SU.esc;
  const DEMO = window.LG_DEMO || null;

  const GD = window.LGGameData;

  let OFF = 0;
  const now = () => Date.now() + OFF;
  const clock = (t) => { const d = (+t || 0) - Date.now(); if (Number.isFinite(d)) OFF = Math.abs(d) > 1500 ? d : 0; };



  let GDT = 0;
  const gnow = () => now() - GDT;
  const gdtSet = (d) => { if (Number.isFinite(d) && Math.abs(d) < 864e5) GDT = Math.abs(d) > 1000 ? d : 0; };
  const gclock = (n, g) => { if (n && g) gdtSet(+n - +g); };
  window.LGGameNow = gnow;
  const api = (p, body) => (DEMO ? DEMO.api(p, body) : fetch(p, { ...(body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}), ...(typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? { signal: AbortSignal.timeout(20000) } : {}) })
    .then((r) => { try { const d = Date.parse(r.headers.get('date') || ''); if (d) clock(d + 500); const g = r.headers.get('x-lg-gdt'); if (g != null && g !== '') gdtSet(+g); } catch {} SU.holdFrom(r); return r.json().then((j) => SU.withCode(j)); }))
    .catch(() => ({ ok: false, error: 'нет связи с сайтом' }));
  



  const awb = (aw) => (Array.isArray(aw) ? aw.slice(0, 3).map((a) => `<span class="awb aw-${esc(String(a.t || a.id).replace(/[^a-z0-9-]/gi, ''))}" role="img" tabindex="0" aria-label="${esc(a.n)}: ${esc(a.d)}" data-awn="${esc(a.n)}" data-awd="${esc(a.d)}">${SU.awIco(a.i)}</span>`).join('') : '');
  

  let awEl = null, awKey = '', awT = 0, awFor = null;
  function awHide(pre) { if (!awEl || awEl.hidden || (pre && !awKey.startsWith(pre))) return; clearTimeout(awT); awEl.hidden = true; awKey = ''; awFor = null; }
  function awPop(a, r, key) {
    if (!a || !a.n) return;
    if (!awEl) { awEl = document.createElement('div'); awEl.className = 'awpop'; awEl.setAttribute('role', 'tooltip'); awEl.hidden = true; document.body.appendChild(awEl); }
    const html = `<b>${esc(a.n)}</b>${a.d ? `<span>${esc(a.d)}</span>` : ''}`;
    if (awEl.innerHTML !== html) awEl.innerHTML = html;
    awEl.hidden = false; awKey = key || '';
    const vw = document.documentElement.clientWidth, w = awEl.offsetWidth, h = awEl.offsetHeight;
    const x = Math.max(8, Math.min(vw - w - 8, (r.left + r.right) / 2 - w / 2)), up = r.top - h - 8 >= 8;
    awEl.style.left = x + 'px'; awEl.style.top = (up ? r.top - h - 8 : r.bottom + 8) + 'px'; awEl.dataset.up = up ? '1' : '';
    awEl.style.setProperty('--ax', Math.max(12, Math.min(w - 12, (r.left + r.right) / 2 - x)) + 'px');
    clearTimeout(awT); awT = setTimeout(() => awHide(), 4000);
  }
  const awOf = (b) => ({ n: b.dataset.awn || b.getAttribute('aria-label') || b.title || '', d: b.dataset.awd || '' });
  const awOpen = (b) => { awPop(awOf(b), b.getBoundingClientRect(), 'el'); awFor = b; };
  document.addEventListener('click', (e) => { const b = e.target && e.target.closest && e.target.closest('.awb'); if (!b) return; e.preventDefault(); e.stopPropagation(); if (awFor === b && e.pointerType !== 'mouse') return awHide(); awOpen(b); }, true);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') return awHide();
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('awb')) { e.preventDefault(); awOpen(e.target); }
  });
  document.addEventListener('pointerdown', (e) => { if (!awEl || awEl.hidden || (e.target.closest && e.target.closest('.awb, .awpop'))) return; awHide(); }, true);
  document.addEventListener('pointerover', (e) => { if (e.pointerType !== 'mouse') return; const b = e.target.closest && e.target.closest('.awb'); if (b) awOpen(b); });
  document.addEventListener('pointerout', (e) => { if (e.pointerType !== 'mouse' || awKey !== 'el') return; const b = e.target.closest && e.target.closest('.awb'); if (b && !(e.relatedTarget && b.contains(e.relatedTarget))) awHide(); });
  window.addEventListener('scroll', () => awHide(), { capture: true, passive: true });
  const toast = (t, err) => SU.toast(t, err);
  const plural = SU.plural;
  const D = () => window.MDDoodle;
   

  const sty = () => { try { return (D() && D().active) || (window.LG_STYLES && window.LG_STYLES[0]) || 'legion'; } catch { return 'legion'; } };

  const names = () => { try { return (D().names || {})[sty()] || {}; } catch { return {}; } };
  const partCache = {};
  function part(n) { const k = sty() + ':' + n; if (!(k in partCache)) { try { partCache[k] = D().part(n) || null; } catch { partCache[k] = null; } } return partCache[k]; }

  const word = (k, fb) => SU.styleText(sty(), 'copy', k) || fb;
  const nameOf = (it) => { const n = names().items; return (n && n[it.id] && n[it.id].name) || it.baseName || it.name; };

  const ROLE_BASE = GD.roleNames();
  const roleOf = (id, fb) => (names().roles || {})[id] || (sty() === 'legion' && ROLE_BASE[id]) || fb || id;
  const stLabel = (k) => { const h = part('hero'), l = h && h.stats && h.stats[k] && h.stats[k].label; const t = l ? String(l).replace(/^[^\p{L}]+/u, '').trim() : ''; return t || ST[k] || XST[k] || k; };
  function applyStyle() {
    const root = document.documentElement; root.dataset.style = sty();
    if (!DEMO) root.dataset.skin = SU.skinOf(sty());
    let e = document.getElementById('dd-css'); if (!e) { e = document.createElement('style'); e.id = 'dd-css'; document.head.appendChild(e); }
    try { e.textContent = (D() && D().style && D().style.css) || ''; } catch { e.textContent = ''; }
  }
  const jhash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

   
  const SLOTS = ['helmet', 'weapon', 'armor', 'shield', 'trinket'];
  const SLOT = GD.slotNames();
  const ST = { hp: 'Макс. здоровье', atk: 'Физ. урон', mag: 'Магия', def: 'Броня' };
  const STW = { hp: 0.35, atk: 1, mag: 1, def: 1.2 };

  const XST = { ...GD.xstats.label };
  const XSTW = { crit: 0.8, critDmg: 0.25, dodge: 0.8, pierce: 0.2, healPow: 0.4, luck: 0.2, resist: 0.6 };
  const XPCT = { crit: 1, critDmg: 1, dodge: 1, pierce: 1, healPow: 1 };
  const stOk = (k, h) => !!ST[k] || !!(h && h.xs && XST[k]);
  const stNum = (k, v) => `${v > 0 ? '+' : ''}${String(v).replace('.', ',')}${XPCT[k] ? '%' : ''}`;
  const RAR = GD.rarityNames();
  const RORD = Object.fromEntries(GD.RARITIES.map((r) => [r, GD.RARITIES.length - 1 - GD.rarityRank(r)]));
  const GROUP_OF = Object.fromEntries([...GD.classIds(), 'recruit'].map((r) => [r, GD.groupOf(r)]));

   
  const IC = {
    hp: '<path d="M12 20.5s-7.5-4.6-7.5-10.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.5c0 5.8-7.5 10.4-7.5 10.4z"/>',
    atk: '<path d="M19.5 4.5 20 4l-.5 4.5L9.5 18.5l-4-4zM7.5 16.5l-3 3M4 15l5 5"/>',
    mag: '<path d="M12 3.5l1.9 5.4 5.6 1.6-5.6 1.7L12 17.6l-1.9-5.4-5.6-1.7 5.6-1.6zM18.5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    def: '<path d="M12 3.5l7 2.8v5.1c0 4.6-3 7.8-7 9.6-4-1.8-7-5-7-9.6V6.3z"/>',
    crit: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/>',
    critDmg: '<path d="M13.5 2.5 6 13.5h5.5l-1 8 7.5-11h-5.5z"/>',
    dodge: '<path d="M4 17c3-1 4.5-3 5-6M9 11c.5-3 2.5-5.5 6-6.5M14 19c2-1.5 3.5-4 4-7"/><circle cx="17.5" cy="5" r="1.6"/>',
    pierce: '<path d="M3 12h14M13 7l5 5-5 5"/><path d="M20.5 5v14"/>',
    healPow: '<path d="M12 4v16M4 12h16"/><path d="M17.5 4.5l2 2M19.5 4.5l-2 2"/>',
    luck: '<path d="M12 12c-3-5-7-4-7-1s4 3 7 1zM12 12c5-3 4-7 1-7s-3 4-1 7zM12 12c3 5 7 4 7 1s-4-3-7-1zM12 12c-5 3-4 7-1 7s3-4 1-7z"/>',
    resist: '<path d="M12 3.5l7 2.8v5.1c0 4.6-3 7.8-7 9.6-4-1.8-7-5-7-9.6V6.3z"/><path d="M12 8.5l1.2 2.5 2.6.4-1.9 1.8.5 2.6L12 14.5l-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"/>',
    coin: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    hammer: '<path d="M13.5 3.5l7 7-2.6 2.6-7-7zM12.3 8.7 3.6 17.4l3 3 8.7-8.7"/>',
    ghost: '<path d="M6 20V10a6 6 0 0 1 12 0v10l-2-1.6-2 1.6-2-1.6-2 1.6-2-1.6z"/><path d="M10 10h.01M14 10h.01"/>',
    bag: '<path d="M6 8h12l-1 12H7zM9 8V6a3 3 0 0 1 6 0v2"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5"/><circle cx="16.5" cy="9.5" r="2.6"/><path d="M15.6 14.6c2.6-.3 4.4 1.3 4.9 4.4"/>',
    chev: '<path d="M7 10l5 5 5-5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.9 1.9M16.6 16.6l1.9 1.9M5.5 18.5l1.9-1.9M16.6 7.4l1.9-1.9"/>',
    exit: '<path d="M10 4H5.5v16H10M14.5 8l4 4-4 4M18.5 12H9"/>',
    user: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6"/>',
    twitch: '<path d="M4.5 3 3.5 6.5V19h4v2.5h2.4l2.4-2.5h3.4l4.3-4.4V3zM18.5 13.8l-2.5 2.6h-4l-2.4 2.4v-2.4H6.4V4.8h12.1z" fill="currentColor" stroke="none"/><path d="M15 7.5v4M11 7.5v4"/>',
  };
  const ico = (k, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[k] || ''}</svg>`;

  


  const INV = window.LGInventory;
  INV.configure({ engine: () => D(), part: (n) => part(n) });
  const still = INV.still, art = (it, cls) => INV.art(it, cls), lgx = INV.lgx;

  const oreQty = (q) => (INV.oreQty ? INV.oreQty(q) : String(q));
  const auraLine = (it, cls) => (it && it.aura && it.aura.name ? `<p class="${cls}">${esc(it.aura.icon || '✦')} <b>${esc(it.aura.name)}</b> — ${esc(it.aura.text || '')}<span>Аура на весь отряд в бою, пока владелец жив</span></p>` : '');
  const EMPTY = INV.EMPTY;

   


  const PACKS = {};
  function stylePack(id) {
    if (!/^[\w-]{1,30}$/.test(id) || PACKS[id] || DEMO) return;
    try { if (D() && D().styles && D().styles[id]) { PACKS[id] = 1; return; } } catch {}
    PACKS[id] = 1;
    const sc = document.createElement('script');
    sc.src = (window.LG_BASE || '') + '/stylepack.js?s=' + encodeURIComponent(id);
    sc.onload = () => setTimeout(() => window.LG && window.LG.rerender(true), 0);
    document.head.appendChild(sc);
  }

  function doodle(login, hero, mood, kit) {
    const d = D(); if (!d || !d.jDoodle) return '';
    const seed = jhash(String(login).toLowerCase());

    const look = hero ? hero.look || null : undefined, who = String(login).toLowerCase();
    if (look && look.ps) stylePack(look.ps);
    try {
      if (hero && hero.ghost) return d.jDoodle(seed, 'happy', false, { ghost: true, who }, look);
      if (hero && kit === 'peace') return d.jDoodle(seed, 'walk', false, { alive: true, gear: hero.gear || {}, who, kit, ...(hero.minerHat ? { minerHat: true } : {}) }, look);
      return d.jDoodle(seed, mood || 'stern', false, hero ? { alive: true, armed: true, gear: hero.gear || {}, who, ...(kit ? { kit } : {}) } : { who }, look);
    } catch (e) { console.warn(e); return ''; }
  }



  const figSvg = (login, v, o) => String(doodle(login, { look: (v && v.lk) || null, gear: (v && v.g) || {}, ghost: !!(v && v.gh), ...(o && o.minerHat ? { minerHat: true } : {}) }, 'walk', 'peace'))
    .replace(/<(animate|animateTransform|animateMotion|set)\b[^>]*?(\/>|>[\s\S]*?<\/\1>)/g, '');

   
  let TIPS = {}, TIPHERO = null;
  let ME = null, filter = 'all', cls = 'all', sel = null, sheet = false, busy = false, last = '';

  let view = 'gear'; try { const v = localStorage.getItem('lgView'); if (v === 'look' || v === 'skills' || v === 'ach' || v === 'log') view = v; } catch {}
  let kit = 'battle'; try { if (localStorage.getItem('lgKit') === 'peace') kit = 'peace'; } catch {}
  const mqWide = SU.media('wide');

   

  const tabSeen = (b) => { const go = () => { try { const T = b.parentElement; if (T.scrollWidth > T.clientWidth + 1) T.scrollLeft = Math.max(0, b.offsetLeft - T.offsetLeft - (T.clientWidth - b.offsetWidth) / 2); } catch (e) {} }; go(); setTimeout(go, 120); setTimeout(go, 900); };
  window.addEventListener('load', () => { const b = document.querySelector('.tabs button[aria-current]'); if (b) tabSeen(b); });
  



  const SITEV = window.LG_SITEV || '';
  let verAt = 0, verP = null, siteOld = false;
  function verCheck(gap = 60000) {
    if (!SITEV || window.LG_DOCK) return Promise.resolve(false);
    if (siteOld) return Promise.resolve(true);
    if (verP) return verP;
    if (Date.now() - verAt < gap) return Promise.resolve(false);
    verAt = Date.now();
    verP = fetch('/site/ver', { cache: 'no-store', credentials: 'same-origin' }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && j.v && j.v !== SITEV) siteOld = true; return siteOld; }, () => false).finally(() => { verP = null; });
    return verP;
  }
  const typing = () => { const a = document.activeElement; return !!a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable) && !!String(a.value || '').trim(); };
  function verReload() { if (typing()) return false; try { location.reload(); } catch {} return true; }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) verCheck().then((old) => { if (old && !$('#tab-streamer').classList.contains('on')) verReload(); }); });
  window.LG_VER = { check: verCheck, reload: verReload, old: () => siteOld };

  let tabNoteT = 0;
  function tabNote(b, text) {
    let n = document.getElementById('tabNote');
    if (!n) { n = document.createElement('div'); n.id = 'tabNote'; n.className = 'tab-note'; n.setAttribute('role', 'status'); document.body.appendChild(n); }
    const r = b.getBoundingClientRect();
    n.textContent = text; n.hidden = false;
    n.style.left = Math.max(8, Math.min(window.innerWidth - n.offsetWidth - 8, r.left + r.width / 2 - n.offsetWidth / 2)) + 'px';
    n.style.top = (r.bottom + 6) + 'px';
    clearTimeout(tabNoteT); tabNoteT = setTimeout(() => { n.hidden = true; }, 2500);
  }
  






  const LAZY = { news: { css: ['news.css'], js: ['news.js'], g: 'LGNews' }, skills: { css: ['skills.css'], js: ['skills.js'], g: 'LGSkills' }, pick: { js: ['pick-art.js'], g: 'LGPickArt' },
    ach: { css: ['achievements.css'], js: ['achievements.js'], g: 'LGAch' } };
  const lazyP = {};
  const lazySrc = (n) => `/site/${n}?v=${(window.LG_SITEF || {})[n] || ''}`;
   
  function lazy(k) {
    const L = LAZY[k];
    if (!L) return Promise.resolve(false);
    if (window[L.g]) return Promise.resolve(true);
    if (lazyP[k]) return lazyP[k];
    (L.css || []).forEach((f) => {
      if (document.querySelector(`link[data-lazy="${f}"]`)) return;
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = lazySrc(f); l.dataset.lazy = f;
      const at = document.querySelector(`meta[name="lg-lazy-css"][content="${f}"]`);
      if (at) at.before(l); else document.head.appendChild(l);
    });
    lazyP[k] = (L.js || []).reduce((p, f) => p.then(() => new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = lazySrc(f); sc.onload = ok; sc.onerror = no; document.head.appendChild(sc); })), Promise.resolve())
      .then(() => { lazyP[k] = null; lazyDone(k); return true; }, (e) => { lazyP[k] = null; console.warn('не загрузилось: ' + k, e); return false; });
    return lazyP[k];
  }

  window.LGSiteLazy = (k) => lazy(k);

  function lazyDone(k) {
    try {
      if (k === 'news' && window.LGNews && window.LGNews.me && ME) window.LGNews.me(ME);
      if (k === 'skills' && ME && ME.hero && ME.hero.sk) renderHero();
      if (k === 'pick' && view === 'ach' && ME && ME.hero) renderHero();
      if (k === 'ach' && ME && ME.hero && ME.hero.ac) renderHero();
    } catch (e) { console.warn(e); }
  }
  let lazyIdleOn = false;
  function lazyIdle() {
    if (lazyIdleOn || DOCK) return;
    lazyIdleOn = true;
    if (view === 'skills') lazy('skills');
    if (view === 'ach') { lazy('ach'); lazy('pick'); }
    lazyWarm();
  }
  




  let warmOn = false;
  const WARM_MS = 8000;
  function lazyWarmList() {
    const h = ME && ME.hero, out = [];
    const add = (k) => { const L = LAZY[k]; if (L) [...(L.css || []), ...(L.js || [])].forEach((f) => out.push(lazySrc(f))); };
    const addTab = (id) => { if (!TABS[id]) return; (TABS[id].css || []).forEach((f) => out.push(tabSrc(f))); tabNames(id).forEach((n) => out.push(tabSrc(n))); };
    add('news');
    if (h && h.sk) add('skills');
    if (h && h.ac) { add('ach'); add('pick'); }
    if (h && h.mn) add('pick');

    if (ME && ME.user && h && document.querySelector('.cy-hud, [data-gu="guild"]')) { addTab('guilds'); addTab('guildhall'); }
    if (h && h.dl) addTab('dailies');
    if (ME && ME.user && ME.friends) { const v = window.LG_FRV || {}; out.push('/site/friends.css' + (v.css ? '?v=' + v.css : ''), '/site/friends.js' + (v.js ? '?v=' + v.js : '')); }
    return [...new Set(out)];
  }
  function lazyWarm() {
    if (warmOn || DOCK || DEMO) return;
    const nc = navigator.connection;
    if (nc && (nc.saveData || /(^|-)2g$/.test(String(nc.effectiveType || '')))) return;
    warmOn = true;
    const go = () => {
      if (document.hidden) { const vis = () => { if (document.hidden) return; document.removeEventListener('visibilitychange', vis); later(); }; document.addEventListener('visibilitychange', vis); return; }

      const has = (src) => !!document.querySelector(`link[href="${CSS.escape(src)}"], script[src="${CSS.escape(src)}"]`);
      lazyWarmList().forEach((src) => { if (!has(src)) preJs(src, { idle: true }); });
    };

    const later = () => { if (window.requestIdleCallback) window.requestIdleCallback(go, { timeout: 15000 }); else setTimeout(go, 3000); };
    const start = () => setTimeout(later, WARM_MS);
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
  }
  function tab(id) {

    if (id !== 'streamer' && (location.hash === '#md' || location.hash === '#streamer' || location.hash === '#admin')) { try { history.replaceState(history.state, '', location.pathname + location.search); } catch {} }

    if (inJail() && id !== 'city') id = 'city';

    if (guTab(id)) return;
    if (id !== 'city') townEntry = 0;

    if (siteOld && !window.LG_DOCK) { try { localStorage.setItem('lgTab', id); } catch {} if (verReload()) return; }
    if (id === 'soc') { lgv = 'soc'; id = 'legion'; }
    $$('.tabs button').forEach((b) => { if (b.dataset.tab === id) { b.setAttribute('aria-current', 'page'); tabSeen(b); } else b.removeAttribute('aria-current'); });
    $$('.tab').forEach((t) => t.classList.toggle('on', t.id === 'tab-' + id));
    chswLabel();
    if (!DOCK) try { localStorage.setItem('lgTab', id); } catch {}
    document.body.classList.toggle('sm-on', id === 'streamer');


    document.body.classList.toggle('q-tab', id === 'quest');
    if (id === 'streamer' && window.scrollY) window.scrollTo(0, 0);
    if (id === 'streamer') openStreamer(); else if (SM.frames.panel) smVisible();
    if (id === 'legion') legOpen();
    if (id === 'news') { if (window.LGNews) window.LGNews.open(); else lazy('news').then(() => { if (window.LGNews && $('#tab-news').classList.contains('on')) window.LGNews.open(); }); }

    if (id === 'city') verCheck(15000).then((old) => { if (old && verReload()) return; if ($('#tab-city').classList.contains('on')) openCity(); });
    else if (window.LGCity) window.LGCity.close();
    if (id !== 'city') verCheck();
    questTab(id === 'quest');
    if (id === 'hero' || id === 'quest') jrWant();
    if (id === 'world') openWorld(); else if (window.LGWorld) window.LGWorld.close();
    if (id === 'war') openWar(); else if (window.LGWarCmd) window.LGWarCmd.close();
    if (id === 'season') openSeason(); else if (window.LGSeason) window.LGSeason.close();
    if (id === 'arena') openArena(); else if (window.LGArena) window.LGArena.close();
    bfSoon();

    if (window.LGDm) setTimeout(() => window.LGDm.place(), 0);

    if (window.LGChatOne) setTimeout(() => window.LGChatOne.place(), 0);
    if (window.LGStart) window.LGStart.tabChanged(id);
    guCity();
  }
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => tab(b.dataset.tab)));


  {
    const top = $('.top'), nav = $('.top .tabs'), R = document.documentElement;
    if (top && nav && !window.LG_DOCK) {
      const mb = document.createElement('button');
      mb.type = 'button'; mb.className = 'tabs-mb'; mb.setAttribute('aria-label', 'Разделы'); mb.setAttribute('aria-expanded', 'false');
      mb.innerHTML = '<i></i><i></i><i></i>';
      top.insertBefore(mb, top.firstChild);
      const open = (on) => { R.classList.toggle('tabs-open', on); mb.setAttribute('aria-expanded', String(on)); };
      mb.addEventListener('click', () => open(!R.classList.contains('tabs-open')));
      nav.addEventListener('click', (e) => { if (e.target.closest('button')) open(false); });
      document.addEventListener('pointerdown', (e) => { if (R.classList.contains('tabs-open') && !e.target.closest('.top .tabs, .tabs-mb')) open(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && R.classList.contains('tabs-open')) open(false); });
    }
  }

  const brand = $('.top .brand');
  if (brand && !window.LG_DOCK) {
    const toCity = () => { const c = $('.tabs button[data-tab="city"]'); tab(c && !c.hidden ? 'city' : 'hero'); };
    brand.setAttribute('role', 'link'); brand.tabIndex = 0; brand.title = 'В город'; brand.style.cursor = 'pointer';

    const cityUrl = () => location.pathname + location.search + '#city';
    brand.addEventListener('click', (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); window.open(cityUrl(), '_blank', 'noopener'); return; } toCity(); });
    brand.addEventListener('mousedown', (e) => { if (e.button === 1) e.preventDefault(); });
    brand.addEventListener('auxclick', (e) => { if (e.button !== 1) return; e.preventDefault(); window.open(cityUrl(), '_blank', 'noopener'); });
    brand.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); toCity(); } });
  }


  




  const DOCK = !!window.LG_DOCK;
  const SM = { data: null, loading: false, cur: '', frames: {}, pages: null };
  let smWant = false;
  const smOk = () => DOCK || !!(ME && ME.streamer);
  function smVis() {
    const ok = smOk(), b = $('.tabs button[data-tab="streamer"]');
    if (b) b.hidden = !ok || !!(ME && ME.roleSw);
    if (ok && smWant) { smWant = false; tab('streamer'); return; }
    if (!ok) { smDrop(); if ($('#tab-streamer').classList.contains('on')) tab('hero'); }
  }

  function smDrop() { if (!SM.data && !SM.loading) return; SM.data = null; SM.frames = {}; SM.pages = null; SM.cur = ''; $('#tab-streamer').innerHTML = ''; }
  async function openStreamer() {
    const el = $('#tab-streamer');
    if (!SM.data) {
      if (SM.loading) return;
      SM.loading = true;
      el.innerHTML = '<p class="empty">Загружаем пульт…</p>';
      const r = await api(smUrl());
      SM.loading = false;
      if (!r || !r.ok) { el.innerHTML = `<p class="empty">${esc((r && r.error) || 'Режим стримера недоступен')}</p>`; return; }
      SM.data = r;
      smBuild(el);
    }
    let first = SM.cur;


    if (!first && smReadyFirst()) first = 'ready';
    if (!first && !DOCK) { try { first = sessionStorage.getItem('lgSm') || ''; } catch {} }


    if (!SM.cur && String(first).startsWith('md:') && !smMdIn()) first = '';
    if (smSecWant) { if (smSecs().some((x) => x.id === smSecWant)) first = smSecWant; smSecWant = ''; }


    const main = (smSecs().find((x) => !x.off && !x.md) || smSecs()[0] || {}).id || '';
    const want = smSecs().find((x) => x.id === (first || main));
    smShow(want && want.off && !smOffOpen ? '' : first || main);
  }



  const smReadyFirst = () => !!(SM.data && !SM.data.one && SM.data.ready && !SM.data.ready.ok && (SM.data.sections || []).some((x) => x.id === 'ready'));

  const smNoMd = () => !!(SM.data && SM.data.one && !SM.data.md);



  const smMdIn = () => !!(SM.data && SM.data.mode === 'admin');
  let smSecWant = '';


  let smMode = '';

  const smUrl = () => '/api/streamer' + (smMode === 'admin' ? '?mode=admin' : '');

  function smSideMark() {
    if (!SM.cur || DOCK || smMode !== 'admin') return;
    const h = '#admin';
    try { if ($('#tab-streamer').classList.contains('on') && location.hash !== h) history.replaceState(history.state, '', location.pathname + location.search + h); } catch {}
  }

  function smModeSet(m, want) {
    smMode = m === 'admin' ? 'admin' : '';
    smDrop(); SM.cur = '';
    if (want) smSecWant = want;
    if ($('#tab-streamer').classList.contains('on')) openStreamer(); else tab('streamer');
    chswLabel();
  }

  function smPlate() {
    const d = SM.data || {};
    if (DOCK || !d.admin) return '';
    if (d.mode === 'admin') return '<p class="sm-mode is-all" role="note"><span aria-hidden="true">⚙</span> Админ · меняешь: <b>все каналы</b></p><button type="button" class="btn ghost sm sm-dock sm-chan" id="smChan" title="Пульт этого канала: только его настройки">← Пульт канала</button>';
    if (d.sbx) return '<p class="sm-mode is-sbx" role="note"><span aria-hidden="true">🧪</span> Песочница · меняешь: <b>только песочницу</b></p>';
    return `<p class="sm-mode" role="note">Меняешь: <b>канал ${esc(d.channel || '')}</b> - только его. Общее для всех - <a href="#admin" id="smToAdm">режим «Админ»</a></p>`;
  }





  let smAt = 0, smBusy = false, smAgain = null;
  async function smRefresh(force, style) {
    if (!SM.data || SM.loading || (!force && Date.now() - smAt < 20000)) return;
    if (smBusy) { if (force) smAgain = { style: style || (smAgain && smAgain.style) }; return; }
    smAt = Date.now(); smBusy = true;


    const mode = smMode, r = await api(smUrl()).catch(() => null);
    smBusy = false;
    if (mode !== smMode) return;
    if (smAgain) { const a = smAgain; smAgain = null; setTimeout(() => smRefresh(true, a.style), 0); }
    if (!r || !r.ok || !SM.data) {

      if (r && r.ok === false && /недоступен/.test(r.error || '')) { smDrop(); if (DOCK) $('#tab-streamer').innerHTML = `<p class="empty">${esc(r.error)}</p>`; else if (ME) { ME.streamer = false; smVis(); } }
      return;
    }

    const st = style || r.style;
    if (st && SM.data.style && st !== SM.data.style) smRestyle(st);
    if (r.style || st) SM.data.style = st || r.style;
    const same = JSON.stringify([SM.data.sections, SM.data.ready]) === JSON.stringify([r.sections, r.ready]);
    const gone = SM.cur && !r.sections.some((x) => x.id === SM.cur) ? (SM.data.sections.find((x) => x.id === SM.cur) || {}).t : '';
    SM.data.sections = r.sections; SM.data.ready = r.ready;

    if (SM.data.one && (SM.data.md !== r.md || SM.data.mdOwn !== r.mdOwn)) { const cur = SM.cur; smDrop(); openStreamer().then(() => { if (cur) smShow(cur); }); return; }
    if (same) return;

    for (const k of Object.keys(SM.frames)) if (k !== 'panel' && !(k === 'mdx' && r.sections.some((x) => x.md)) && !r.sections.some((x) => x.id === k && !x.panel)) { SM.frames[k].remove(); delete SM.frames[k]; }
    if (SM.frames.panel && !r.sections.some((x) => x.panel)) { SM.frames.panel.remove(); delete SM.frames.panel; SM.pages = null; }
    smNav();
    if (!smSecs().some((x) => x.id === SM.cur)) { smShow(''); if (gone) toast(`Раздел «${gone}» закрыл администратор игры`); }
  }

  function smRestyle(st) { siteRestyle(st); }
  


  let restyleP = null, restyleTo = '';
  function siteRestyle(st) {
    if (!/^[\w-]{1,30}$/.test(String(st || '')) || DEMO) return Promise.resolve(false);
    if (restyleTo === st && restyleP) return restyleP;
    const skin = SU.skinOf(st), root = document.documentElement;
    root.dataset.style = st; if (!DEMO) root.dataset.skin = skin;
    for (const b of Object.values(SM.frames)) { try { b.querySelector('iframe').contentDocument.documentElement.setAttribute('data-skin', skin); } catch {} }
    if (SM.data) SM.data.style = st;
    try { localStorage.removeItem('lgStyle'); } catch {}
    if (DOCK) return Promise.resolve(true);
    const have = () => { try { return !!(D() && D().styles && D().styles[st]); } catch { return false; } };
    const redraw = () => {
      restyleP = null; restyleTo = '';
      if (!have()) return false;
      try { D().use(st); } catch {}
      window.LG.rerender(true);

      if ($('#tab-city').classList.contains('on')) { try { if (window.LGCity) window.LGCity.close(); } catch {} openCity(); }
      if ($('#tab-quest') && $('#tab-quest').classList.contains('on')) { questTab(false); questTab(true); }
      smStyleLine();
      try { document.dispatchEvent(new CustomEvent('lg-style', { detail: { style: st } })); } catch {}
      return true;
    };
    if (have()) return Promise.resolve(redraw());
    restyleTo = st;
    restyleP = new Promise((ok) => {
      const sc = document.createElement('script');
      sc.src = (window.LG_BASE || '') + '/doodle.js?v=' + Date.now();
      sc.onload = sc.onerror = () => ok(redraw());
      document.head.appendChild(sc);
    });
    return restyleP;
  }

  function smStyleLine() {
    const el = $('#smStyle'); if (!el) return;
    api('/api/style').then((r) => {
      if (!r || !r.ok) { el.hidden = true; return; }
      const L = r.lock || {}, nm = ((r.styles || []).find((x) => x.id === r.active) || {}).name || r.active;

      const bi = (r.bn && r.bn.i) || 'Закхуэлем';
      const why = L.vote ? 'выберет чат после «Начать сюжет»' : !L.chosen ? 'можно выбрать: «? Как играть» → «Стиль канала»' : L.changed ? 'смена стиля использована' : L.once ? 'одна смена доступна' : 'закрыт до победы над ' + bi;
      el.innerHTML = `Стиль канала: <b>${esc(nm)}</b> · ${esc(why)}`; el.dataset.style = r.active; el.hidden = false;
    });
  }
  function styleEvent(st) {
    if (!st || st === sty()) return;
    const nm = (() => { try { return (D().styles[st] && D().styles[st].name) || ''; } catch { return ''; } })();
    siteRestyle(st).then(() => { const n = nm || (() => { try { return D().styles[st].name || st; } catch { return st; } })(); toast(`Стиль канала сменился: «${n}»`); });
  }



  let smStale = false;
  function smStaleCheck(go) {
    const b = SM.frames.panel, f = b && b.querySelector('iframe');
    if (!smStale || !f) { if (!f) smStale = false; return; }
    if (!go && !b.hidden && $('#tab-streamer').classList.contains('on') && !document.hidden) return;
    smStale = false; SM.pages = null; b.classList.remove('ready');
    try { const u = new URL(f.contentWindow.location.href); if (go) u.searchParams.set('page', go); f.contentWindow.location.replace(u.href); } catch { f.src = f.src; }
  }

  function smTell(why) {
    for (const b of Object.values(SM.frames)) { try { b.querySelector('iframe').contentWindow.postMessage({ lg: 'sm', why: Array.isArray(why) ? why : [] }, location.origin); } catch {} }
  }

  setInterval(() => { if (SM.data && !smEs && $('#tab-streamer').classList.contains('on') && (DOCK || !document.hidden)) smRefresh(true); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) smRefresh(); });
  window.addEventListener('focus', () => smRefresh());

  const smSecs = () => (SM.data ? SM.data.sections : []).filter((x) => !x.panel || !SM.pages || smStale || SM.pages.includes(x.id));




  const SM_GROUP = { game: 'Стрим', ply: 'Игроки', set: 'Канал' };
  const SM_ADM = { adm: '', aw: 'Мир и сезон', at: 'Новинки и тесты', ab: 'Баланс и экономика' };

  const smMd = (page) => ((SM.data && SM.data.pult) || `/p/${encodeURIComponent((window.LG_CH && window.LG_CH.login) || '')}/`) + (page ? `?page=${page}` : '');
  function smRd() {
    const a = $('#smRd'); if (!a || !SM.data) return;
    const r = SM.data.ready, left = r && !r.ok ? r.left || 0 : 0;
    a.classList.toggle('is-bad', !!left); a.classList.toggle('is-ok', !!(r && r.ok));
    a.innerHTML = `<span class="sm-t">Готовность →</span>${left ? `<span class="sm-cnt" aria-label="не готово: ${left}">${left}</span>` : r && r.ok ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : ''}`;
    a.title = left ? `Готовность к стриму (пульт MultiDonate): осталось ${left}` : 'Готовность к стриму - в пульте MultiDonate';
    if (SM.data.one) a.title = left ? `Готовность к стриму: осталось ${left}` : (smNoMd() ? 'Готовность к стриму: что нужно для игры' : 'Готовность к стриму: игра, донаты и OBS');
  }






  let smOffOpen = false;
  try { smOffOpen = localStorage.getItem('lgSmOff') === '1'; } catch {}
  const smShown = (x) => !x.off || smOffOpen || x.id === SM.cur;
  function smBuild(el) {


    const ONE = !!SM.data.one, NOMD = smNoMd(), ADM = SM.data.mode === 'admin';
    el.innerHTML = `<div class="sm-wrap">
      <aside class="sm-side" aria-label="Разделы пульта">
        <button type="button" class="sm-menu" aria-expanded="false" aria-controls="smList" title="Разделы пульта"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span class="sm-menu-cnt" hidden></span><span class="sr-only">Разделы пульта</span></button>
        <button type="button" class="sm-curv" tabindex="-1" aria-hidden="true"></button>
        <div class="sm-list" id="smList">
          ${ONE && !DOCK ? '<button type="button" class="btn ghost sm sm-back" id="smBack" title="Назад к вкладкам игрока: герой, поход, город">← В игру</button>' : ''}
          ${smPlate()}
          ${ONE ? '' : '<p class="sm-style" id="smStyle" aria-live="polite" hidden></p>'}
          <a class="sm-rd" id="smRd" href="${ONE ? '#' : esc(smMd('ready'))}"></a>
          ${ONE ? '' : '<button type="button" class="btn ghost sm sm-dock sm-donwin" id="smDonWin" title="Отдельное окно браузера: лента донатов, алерты и музыка (как окно «Донаты» на ПК)">Открыть окно последних донатов</button>'}
          <nav class="filters sm-nav" aria-label="Разделы пульта"></nav>
          ${DOCK || ADM ? '' : `<button type="button" class="btn ghost sm sm-dock" id="smDock" title="Адрес для пользовательской док-панели браузера в OBS: сразу режим стримера, компактно">Скопировать адрес для OBS</button>`}
          ${!DOCK && !ADM && ME && ME.roleSw && SM.data.pult2 ? `<a class="btn ghost sm sm-dock" id="smPult2" href="${esc(SM.data.pult2)}" target="legion-pult-${esc(SM.data.channel || '')}" rel="noopener" title="Пульт игры канала - отдельным окном">Пульт игры ↗</a>` : ''}
          ${!DOCK && !ADM && ME && ME.roleSw ? '<button type="button" class="btn ghost sm sm-dock" id="smHelp" title="Мастер стримера: игра, окно игры, пульт, стиль канала, ссылка для зрителей">? Как играть</button>' : ''}
          ${ONE && !ADM ? '<p class="sm-style sm-style-low" id="smStyle" aria-live="polite" hidden></p>' : ''}
          ${SM.data.mdSvc && !ADM ? `<a class="btn ghost sm sm-dock sm-mdsvc" id="smMdSvc" href="${esc(SM.data.mdSvc + (DOCK ? '?full=1' : ''))}"${DOCK ? '' : ' target="_blank" rel="noopener"'} title="Донаты, алерты, виджеты, OBS и сцена - отдельный сайт MultiDonate${DOCK ? '' : ' (новая вкладка)'}">Сервис MultiDonate<span aria-hidden="true"> ↗</span></a>` : ''}
        </div>
      </aside><div class="sm-body"></div><div class="sm-scrim" aria-hidden="true"></div></div>`;
    smNav(); smStyleLine();
    const d = $('#smDock');
    if (d) d.onclick = () => {
      const u = location.origin + SM.data.dock;
      const ok = () => toast('Адрес док-панели скопирован: ' + u);
      try { navigator.clipboard.writeText(u).then(ok, () => toast(u)); } catch { toast(u); }
    };

    const bk = $('#smBack'); if (bk) bk.onclick = () => startLoad().then(() => { if (window.LGStart) window.LGStart.toGame(); }, () => tab('hero'));

    if (ONE) $('#smRd').onclick = (e) => { e.preventDefault(); if (NOMD) smShow('ready'); else smShowMd('ready'); smMenu(false); };

    const chb = $('#smChan'); if (chb) chb.onclick = () => smModeSet('');
    const tad = $('#smToAdm'); if (tad) tad.onclick = (e) => { e.preventDefault(); smModeSet('admin'); };


    $('#tab-streamer').onclick = (e) => { if (e.target.closest('#smDonWin')) smDonWin(); };
    const hb = $('#smHelp'); if (hb) hb.onclick = () => startLoad().then(() => window.LGStart && window.LGStart.help(), () => {});
    const root = $('.sm-wrap', el), menu = $('.sm-menu', el);
    menu.onclick = () => smMenu(!root.classList.contains('open'));
    $('.sm-curv', el).onclick = () => smMenu(true);
    $('.sm-scrim', el).onclick = () => smMenu(false);
    root.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('open')) { smMenu(false); menu.focus(); } });
  }
  function smDonWin() {
    {
      const u = `${location.origin}/p/${encodeURIComponent((SM.data && SM.data.channel) || (window.LG_CH && window.LG_CH.login) || '')}/donations`;
      const copy = (msg) => { try { navigator.clipboard.writeText(u).then(() => toast(msg), () => toast(u)); } catch { toast(u); } };
      const w = window.open(u, 'md-donations', (() => { let g = null; try { g = JSON.parse(localStorage.getItem('mdDonWin') || 'null'); } catch {} const n = (v) => Number.isFinite(v); return g && n(g.w) && n(g.h) ? `popup,width=${g.w},height=${g.h}` + (n(g.x) && n(g.y) ? `,left=${g.x},top=${g.y}` : '') : 'popup,width=470,height=1000'; })());
      if (w) { try { w.focus(); } catch {} } else copy('Браузер не дал открыть окно — ссылка скопирована');
    }
  }

  function smMenu(on) {
    const root = $('#tab-streamer .sm-wrap'); if (!root) return;
    root.classList.toggle('open', !!on);
    const m = $('.sm-menu', root); if (m) m.setAttribute('aria-expanded', String(!!on));
    if (on) { const b = $('.sm-nav [aria-pressed="true"]', root) || $('.sm-nav [data-sec]', root); if (b) setTimeout(() => { try { b.focus({ preventScroll: true }); smSeen(b); } catch {} }, 30); }
  }

  function smSeen(b) {
    const L = b && b.closest('.sm-list'); if (!L) return;
    const top = b.offsetTop - L.offsetTop, bot = top + b.offsetHeight;
    if (top < L.scrollTop) L.scrollTop = Math.max(0, top - 8); else if (bot > L.scrollTop + L.clientHeight) L.scrollTop = bot - L.clientHeight + 8;
  }
  function smFold() { try { const a = JSON.parse(localStorage.getItem('lgSmFold') || '[]'); return new Set(Array.isArray(a) ? a : []); } catch { return new Set(); } }
  function smNav() {
    const nav = $('#tab-streamer .sm-nav'); if (!nav) return;
    let g = '';

    const all = smSecs().filter((x) => !x.md || smMdIn()), rd = SM.data && SM.data.one ? null : all.find((x) => x.id === 'ready'), rest = all.filter((x) => x.id !== 'ready' && smShown(x));
    const offN = all.filter((x) => x.off).length;
    const left = SM.data && SM.data.ready ? SM.data.ready.left : 0;
    const head = rd && smReadyFirst() ? `<button type="button" data-sec="ready" class="sm-ready" aria-pressed="${SM.cur === 'ready'}"><span class="sm-t">${esc(rd.t)}</span>${left ? `<span class="sm-cnt" aria-label="осталось ${left}">${left}</span>` : ''}</button>` : '';
    const tail = rd && !smReadyFirst() ? `<span class="sm-sep" aria-hidden="true"></span><button type="button" data-sec="ready" class="sm-ready-ok" aria-pressed="${SM.cur === 'ready'}" title="Готовность: всё настроено"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span class="sm-t">${esc(rd.t)}</span></button>` : '';


    const fold = smFold();
    const capBtn = (x, inner) => `<button type="button" class="sm-gh" data-grp="${esc(x.g)}" aria-expanded="${!fold.has(x.g)}"><svg class="sm-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 10l4 4 4-4"/></svg>${inner}</button>`;
    const cap = (x) => x.g in SM_ADM ? capBtn(x, `<span class="lv adm sm-adm" title="Администратор игры: здесь и глобальные настройки для всех каналов">${SM_ADM[x.g] ? 'Админ' : 'Админ игры'}</span>${SM_ADM[x.g] ? ' ' + esc(SM_ADM[x.g]) : ''}`) : SM_GROUP[x.g] ? capBtn(x, SM_GROUP[x.g]) : '';
    const L = nav.closest('.sm-list'), st = L ? L.scrollTop : 0;
    const offT = 'Выключено у канала — открой раздел, чтобы включить';
    const more = offN ? `<button type="button" class="sm-offs" aria-expanded="${smOffOpen}">${smOffOpen ? 'Скрыть' : 'Показать'} выключенные (${offN})</button>` : '';
    const btn = (x) => { const c = ''; void g; void fold; void cap;
      return `${c}<button type="button" data-sec="${esc(x.id)}" aria-pressed="${x.id === SM.cur}"${x.off ? ` class="sm-off" title="${offT}"` : ''}><span class="sm-t">${esc(x.t)}</span>${x.n ? `<span class="sm-cnt" aria-label="новых: ${+x.n}">${+x.n > 99 ? '99+' : +x.n}</span>` : ''}${x.off ? '<span class="sr-only"> (выключено)</span>' : ''}</button>`; };






    nav.innerHTML = head + rest.map(btn).join('') + tail + more;
    smSideMark();
    if (L) L.scrollTop = st;
    nav.onclick = (e) => {
      const gb = e.target.closest('[data-grp]');
      if (gb) { const f = smFold(), k = gb.dataset.grp; if (f.has(k)) f.delete(k); else f.add(k); try { localStorage.setItem('lgSmFold', JSON.stringify([...f])); } catch {} smNav(); const t = $(`#tab-streamer .sm-gh[data-grp="${k}"]`); if (t) t.focus(); return; }
      if (e.target.closest('.sm-offs')) {
        smOffOpen = !smOffOpen;
        try { localStorage.setItem('lgSmOff', smOffOpen ? '1' : '0'); } catch {}
        smNav(); const t = $('#tab-streamer .sm-offs'); if (t) t.focus();
        return;
      }
      const b = e.target.closest('[data-sec]'); if (b) { smShow(b.dataset.sec); smMenu(false); }
    };
    smRail(); smRd();
    const ra = $('#smRd'); if (ra && smNoMd()) ra.classList.toggle('is-cur', SM.cur === 'ready');
  }

  function smRail() {
    const root = $('#tab-streamer .sm-wrap'); if (!root || !SM.data) return;
    const left = smReadyFirst() ? (SM.data.ready.left || 0) : 0, c = $('.sm-menu-cnt', root);
    if (c) { c.hidden = !left; c.textContent = left ? String(left) : ''; }
    const m = $('.sm-menu', root); if (m) m.title = 'Разделы пульта' + (left ? ` — не готово: ${left}` : '');
    const cur = (SM.data.sections || []).find((x) => x.id === SM.cur), v = $('.sm-curv', root);
    if (v) v.textContent = cur ? cur.t : '';
  }

  function smShowMd(page) { const t = page === 'ready' ? 'md:setup' : 'md:' + page; if (smSecs().some((x) => x.id === t)) smShow(t, page); }
  function smShow(id, mdPage) {
    const list = smSecs(); if (!list.length) return;
    const sec = list.find((x) => x.id === id) || list.find((x) => !x.off) || list[0];
    const was = SM.cur;
    SM.cur = sec.id;
    smSideMark();

    if (was && was !== sec.id && !smOffOpen && (list.find((x) => x.id === was) || {}).off) smNav();
    try { sessionStorage.setItem('lgSm', sec.id); } catch {}
    const body = $('#tab-streamer .sm-body'); if (!body) return;


    const key = sec.md ? 'mdx' : sec.panel ? 'panel' : sec.id;

    const mdp = sec.md ? (mdPage || (sec.id === 'md:setup' ? 'obs' : sec.id.slice(3))) : '';
    let box = SM.frames[key];
    if (!box) {
      box = document.createElement('div'); box.className = 'sm-frame';
      box.innerHTML = '<p class="sm-wait">Загружаем…</p>';
      const f = document.createElement('iframe');
      f.title = sec.md ? 'Пульт: донаты и виджеты' : sec.panel ? 'Пульт: настройки' : 'Пульт: ' + sec.t;
      f.src = `${sec.md ? sec.src.replace(/([?&]page=)[^&]*/, '$1' + encodeURIComponent(mdp)) : sec.src}&skin=${encodeURIComponent(document.documentElement.dataset.skin || '')}`;


      f.addEventListener('load', () => { box.classList.add('ready'); const m = box.smQ; box.smQ = null; if (m) try { f.contentWindow.postMessage(m, location.origin); } catch {} });
      box.appendChild(f); body.appendChild(box); SM.frames[key] = box;
    } else if (sec.md) {
      smPost(box, { lg: 'show', page: mdp });
    } else if (sec.panel && smStale) {
      smStaleCheck(sec.id);
    } else if (sec.panel) {
      smPost(box, { lg: 'show', page: sec.id });
    }
    Object.values(SM.frames).forEach((b) => { b.hidden = b !== box; });
    smStaleCheck();
    smVisible();
    $$('#tab-streamer .sm-nav [data-sec]').forEach((b) => { const on = b.dataset.sec === sec.id; b.setAttribute('aria-pressed', String(on)); if (on) smSeen(b); });
    const ra = $('#smRd'); if (ra && smNoMd()) ra.classList.toggle('is-cur', sec.id === 'ready');
    smRail();
    smFit();
  }

  function smPost(box, m) {
    if (!box.classList.contains('ready')) box.smQ = m;
    try { box.querySelector('iframe').contentWindow.postMessage(m, location.origin); } catch {}
  }

  function smVisible() {
    for (const k of ['panel', 'mdx']) {
      const b = SM.frames[k], f = b && b.querySelector('iframe'); if (!f) continue;
      const on = !b.hidden && $('#tab-streamer').classList.contains('on') && !document.hidden;
      try { f.contentWindow.postMessage({ lg: 'visible', on }, location.origin); } catch {}
    }
  }
  document.addEventListener('visibilitychange', () => { smVisible(); smStaleCheck(); });

  function smFit() {
    const body = $('#tab-streamer .sm-body'); if (!body || !$('#tab-streamer').classList.contains('on')) return;
    const top = Math.max(0, Math.round(body.getBoundingClientRect().top + window.scrollY));
    (body.closest('.sm-wrap') || body).style.setProperty('--sm-top', top + 'px');
  }
  window.addEventListener('resize', () => { clearTimeout(smFit.t); smFit.t = setTimeout(smFit, 100); });




  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data || e.data.lg !== 'mode' || !SM.data || !SM.data.admin || SM.data.sbx) return;
    if (!Object.values(SM.frames).some((b) => { const f = b.querySelector('iframe'); return f && f.contentWindow === e.source; })) return;
    const page = /^[\w:-]{1,40}$/.test(String(e.data.page || '')) ? String(e.data.page) : '';
    smModeSet(e.data.mode === 'admin' ? 'admin' : '', page);
  });

  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data || e.data.lg !== 'page' || !e.data.tab) return;
    const mf = SM.frames.mdx && SM.frames.mdx.querySelector('iframe');
    if (!mf || e.source !== mf.contentWindow || SM.frames.mdx.hidden) return;
    const id = 'md:' + String(e.data.tab);
    if (!smSecs().some((x) => x.id === id) || SM.cur === id) return;
    SM.cur = id;
    $$('#tab-streamer .sm-nav [data-sec]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sec === SM.cur)));
    smRail();
  });
  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data) return;
    const pf = SM.frames.panel && SM.frames.panel.querySelector('iframe');
    if (!pf || e.source !== pf.contentWindow) return;
    if (e.data.lg === 'ready' && SM.data) {
      const nx = { ok: !!e.data.ok, left: Number(e.data.left) || 0 }, was = SM.data.ready;
      if (!was || was.ok !== nx.ok || was.left !== nx.left) { SM.data.ready = nx; smNav(); }
      return;
    }
    if (e.data.lg === 'page' && SM.frames.panel && !SM.frames.panel.hidden && smSecs().some((x) => x.id === e.data.page) && SM.cur !== e.data.page) {
      SM.cur = String(e.data.page);
      $$('#tab-streamer .sm-nav [data-sec]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sec === SM.cur)));
      smRail();
      return;
    }
    if (e.data.lg === 'stale') { smStale = true; smStaleCheck(); return; }

    if (e.data.lg === 'bugs' && SM.data) { const x = (SM.data.sections || []).find((s) => s.id === 'bugs'), n = Math.max(0, +e.data.n || 0); if (x && (x.n || 0) !== n) { x.n = n; smNav(); } return; }
    if (e.data.lg !== 'pages' || !Array.isArray(e.data.pages)) return;
    SM.pages = e.data.pages.map((x) => String(x.id));
    smNav();
  });

   
  function renderUser() {
    const u = $('#user');


    const mine = (ME && ME.mine) || [], here = CH && mine.some((m) => m.login.toLowerCase() === CH.login.toLowerCase());


    const who = ME && ME.user ? `<button type="button" class="who whob${ME.tut ? ' tutb' : ''}" id="whob" aria-haspopup="menu" aria-expanded="false" aria-label="${esc(ME.user.name)} - меню" title="${mine.length ? 'Мои каналы · ' : ''}${ME.tut ? 'Как играть · ' : ''}Настройки, выход"><span class="whn">${esc(ME.user.name)}</span>${ME.tut ? '<span class="whq" aria-hidden="true">?</span>' : ico('user', 'whu')}${ico('chev', 'chv')}</button>` : '';


    const ownDup = !!(ME && ME.onePult && ME.own && mine[0] && mine[0].login.toLowerCase() === String(ME.own.login).toLowerCase());
    const hadFocus = document.activeElement && document.activeElement.id === 'whob';
    const myc = mine.length && CH && !here && !ownDup ? `<a class="btn ghost sm mych" href="/c/${encodeURIComponent(mine[0].login)}/" title="Перейти в свой канал: ${esc(mine[0].name)}">Мой канал</a>` : '';
    if (ME && ME.user) u.innerHTML = `${myc}${who}${ME.admin ? '<span class="lv adm" title="Администратор игры: глобальные настройки и админские действия для всех каналов">Админ</span>' : ''}`;

    else u.innerHTML = `<a class="btn twitch sm" href="${window.LG_LOGIN || '/auth/login'}" aria-label="Войти через Twitch">${ico('twitch')}<span>Войти</span></a>${ME && ME.el ? `<a class="btn ghost sm em-login" href="/auth/email?next=${encodeURIComponent(location.pathname)}" title="Войти по почте, привязанной к аккаунту">По почте</a>` : ''}`;
    const w = $('#whob'); if (w) { w.onclick = () => popToggle(w, 'mine'); if (POP.el && POP.kind === 'mine') { POP.from = w; w.setAttribute('aria-expanded', 'true'); } if (hadFocus) try { w.focus({ preventScroll: true }); } catch (e) {   } }
    if (POP.el && POP.kind) popRender();
    if (window.LGNews && window.LGNews.me) window.LGNews.me(ME);
    startSync();
    if (ME && ME.user && ME.friends) friendsLoad().catch(() => null);
  }


  

  let ONEL = null;

  const oneIsOn = () => { const h = ME && ME.hero; return !!(h && h.c1 && (h.cc || h.mc) && (window.LGChatOne || ONEL)); };
  const oneCtx = () => ({ api, hero: () => (ME && ME.hero) || null, login: () => (ME && ME.user ? String(ME.user.login).toLowerCase() : ''), awb, live: () => esOk, pollOk: () => pollOk() });
  function oneLoad() {
    if (!ONEL) {
      const V = window.LG_CITYV || {};
      if (!document.getElementById('cityCss')) { const l = document.createElement('link'); l.id = 'cityCss'; l.rel = 'stylesheet'; l.href = `/site/city.css?v=${V.css || ''}`; document.head.appendChild(l); }
      ONEL = (ME && ME.hero && ME.hero.cd ? dmLoad() : Promise.resolve()).then(() => (window.LGChat ? null : loadJs(`/lib/site-chat.js?v=${V.sc || ''}`)))
        .then(() => (window.LGChatOne ? null : loadJs('/lib/site-chatone.js' + (window.LG_ONEV ? '?v=' + window.LG_ONEV : '')))).catch((e) => { ONEL = null; throw e; });
    }
    return ONEL.then(() => { if (window.LGChatOne) window.LGChatOne.init(oneCtx()); });
  }

  

  let DML = null;
  function dmLoad() {
    if (!DML) DML = (window.LGDm ? Promise.resolve() : loadJs('/lib/site-dm.js' + (window.LG_DMV ? '?v=' + window.LG_DMV : ''))).catch((e) => { DML = null; throw e; });
    return DML.then(() => { if (window.LGDm && ME && ME.user) window.LGDm.init({ api, toast, me: () => (ME && ME.user ? String(ME.user.login).toLowerCase() : ''), ch: CH ? CH.login : '', one: oneIsOn, showOne: () => oneLoad().catch(() => null) }); });
  }

  






  let FRL = null;
  const FRLT = { btn: null, n: 0, known: new Map() };
  const frCtx = () => ({ api, toast, me: () => ME, lite: FRLT });
  const frTell = () => { try { window.dispatchEvent(new Event('lgfriends')); } catch (e) { console.warn('lgfriends', e); } };
  function frSetN(n) {
    FRLT.n = Math.max(0, n | 0); frTell(); const b = FRLT.btn; if (!b) return;
    const c = b.querySelector('.fr-n'); c.hidden = !FRLT.n; c.textContent = FRLT.n > 99 ? '99+' : String(FRLT.n);
    b.setAttribute('aria-label', FRLT.n ? `Друзья, новых заявок: ${FRLT.n}` : 'Друзья');
  }
   
  function frFull() {
    if (window.LGFriends && !window.LGFriends.lite) return Promise.resolve(window.LGFriends);
    if (!FRL) {
      const v = window.LG_FRV || {};
      const add = (tag, attrs) => new Promise((ok, bad) => { const x = document.createElement(tag); Object.assign(x, attrs); x.onload = () => ok(); x.onerror = bad; document.head.appendChild(x); });
      FRL = Promise.all([add('link', { rel: 'stylesheet', href: '/site/friends.css' + (v.css ? '?v=' + v.css : '') }), add('script', { src: '/site/friends.js' + (v.js ? '?v=' + v.js : '') })])
        .then(() => { if (!window.LGFriends || window.LGFriends.lite) throw new Error('friends.js без LGFriends'); window.LGFriends.init(frCtx()); return window.LGFriends; })
        .catch((e) => { FRL = null; throw e; });
    }
    return FRL;
  }
  const frFail = () => toast('Друзья не загрузились - проверь связь', true);
  const FR_LITE = {
    lite: true,
    open: (tab) => frFull().then((F) => F.open(tab), frFail),
    n: () => FRLT.n,
    onEvent(d) {
      if (!d || !d.from) return;
      const who = d.from.name || d.from.login;
      if (d.k === 'in') { frSetN(FRLT.n + 1); FRLT.known.set(d.from.login, 'in'); toast(`${who} зовёт тебя в друзья`); }
      if (d.k === 'coin') toast(`${who} подарил тебе монету дня: +1 бронза`);
      if (d.k === 'ok') { FRLT.known.set(d.from.login, 'friends'); toast(`${who} принял заявку - теперь вы друзья`); }
    },
     
    menuItems(nk) {
      const st = FRLT.known.get(String(nk || '').toLowerCase()), out = [];
      if (st === 'friends') out.push(['fr-on', 'В друзьях', true]);
      else if (st === 'out') out.push(['fr-on', 'Заявка отправлена', true]);
      else if (st === 'in') out.push(['fr-acc', 'Принять в друзья']);
      else if (st !== 'blocked') out.push(['fr-add', 'Добавить в друзья']);
      out.push(st === 'blocked' ? ['fr-unb', 'Разблокировать'] : ['fr-blk', 'Заблокировать']);
      return out;
    },
    menuAct: (k, nk) => frFull().then((F) => F.menuAct(k, nk), frFail),
    friends: () => frFull().then((F) => F.friends(), (e) => { console.warn('[друзья] список для Города', e); return []; }),
    state: (nk) => FRLT.known.get(String(nk || '').toLowerCase()) || null,
  };
  function friendsLoad() {
    if (window.LGFriends && !window.LGFriends.lite) { if (ME && ME.friends) window.LGFriends.init(frCtx()); return Promise.resolve(); }
    if (!window.LGFriends) window.LGFriends = FR_LITE;
    if (!FRLT.btn) {
      const u = document.getElementById('user'); if (!u) return Promise.resolve();
      const b = FRLT.btn = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost sm fr-btn'; b.id = 'frBtn';
      b.setAttribute('aria-haspopup', 'dialog'); b.title = 'Друзья';
      b.innerHTML = '<span class="fr-ic" aria-hidden="true">👥</span><span class="fr-bt">Друзья</span><b class="fr-n" hidden></b>';
      b.onclick = () => window.LGFriends.open();
      u.insertBefore(b, u.firstChild);
      api('/api/friends/n').then((r) => { if (r && r.ok && window.LGFriends === FR_LITE) frSetN(+r.in || 0); });
    } else if (!FRLT.btn.isConnected) { const u = document.getElementById('user'); if (u) u.insertBefore(FRLT.btn, u.firstChild); }
    frTell();
    return Promise.resolve();
  }

  


  let START = null;
  function startLoad() {
    if (START) return START;
    const v = window.LG_STARTV || {};
    const add = (tag, attrs) => new Promise((ok, bad) => { const x = document.createElement(tag); Object.assign(x, attrs); x.onload = () => ok(); x.onerror = bad; document.head.appendChild(x); });
    START = Promise.all([add('link', { rel: 'stylesheet', href: '/site/start.css' + (v.css ? '?v=' + v.css : '') }), add('script', { src: '/site/start.js' + (v.js ? '?v=' + v.js : '') })])
      .then(() => { if (window.LGStart) window.LGStart.init({ me: () => ME, tab, smOk, api, toast, styleLine: () => smStyleLine(), ch: CH, curTab: () => { const t = $('.tab.on'); return t ? t.id.replace(/^tab-/, '') : ''; }, sm: () => SM.data, smShow, smMode: (m, want) => smModeSet(m, want),
        

        qIn: () => !!(questOn && questParty === 'in'), jail: () => inJail(), cityLock: () => cityLocked(), ready: () => !!document.querySelector('#tab-hero .plate, #tab-hero .ghostnote'),
        smFrame: (id) => { const b = SM.frames[id] || (SM.data && (SM.data.sections || []).some((x) => x.id === id && x.panel) ? SM.frames.panel : null); return b ? b.querySelector('iframe') : null; } }); })
      .catch((e) => { START = null; throw e; });
    return START;
  }

  function sealPick(uid) {
    if (!ME || !ME.seal) return;
    startLoad().then(() => window.LGStart.stylePick({
      title: 'Печать Метаморфозы', text: 'Выбери стиль своего героя. Печать сгорит, и герой останется в этом стиле, даже если канал сменит свой.',
      sel: (ME.hero && ME.hero.look && ME.hero.look.ps) || sty(), ok: 'Применить печать', confirm: 'Печать сгорит - точно?',
      pick: (style) => act('/api/seal', { uid, style }, 'Печать применяется…'),
    }), () => toast('Окно не загрузилось - проверь связь', true));
  }
  

  let PSL = null;
  function psSync() {
    if (DOCK) return;
    if (!(ME && ME.user && ME.hero && ME.hero.ps)) { if (window.LGPlayerStart) window.LGPlayerStart.sync(); return; }
    if (!PSL) {
      const add = (tag, attrs) => new Promise((ok, bad) => { const x = document.createElement(tag); Object.assign(x, attrs); x.onload = () => ok(); x.onerror = bad; document.head.appendChild(x); });

      PSL = Promise.all([add('link', { rel: 'stylesheet', href: tabSrc('playerstart.css') }), add('script', { src: tabSrc('playerstart.js') })])
        .then(() => { if (window.LGPlayerStart) window.LGPlayerStart.init({ me: () => ME, money: (n) => money(n), ch: CH, quest: () => ({ on: !!questOn, party: questParty || null }), jail: () => inJail() }); })
        .catch((e) => { PSL = null; throw e; });
    }
    PSL.then(() => { if (window.LGPlayerStart) window.LGPlayerStart.sync(); }, () => {});


  }
  


  function dlSync() {
    if (DOCK) return;
    if (window.LGDailies) window.LGDailies.sync();
  }
  function startSync() {
    psSync();
    dlSync();
    if (DOCK || (DEMO && !DEMO.start)) return;

    if (!ME || !(ME.roleSw || ME.find || ME.seal || ME.tut || ME.admin)) { if (window.LGStart) window.LGStart.sync(); return; }
    startLoad().then(() => { if (window.LGStart) window.LGStart.sync(); }, () => {});
  }

  

  const CH = window.LG_CH || null;
  const POP = { el: null, kind: '', from: null, list: null, loading: false, err: '' };
  const chUrl = (l) => `/c/${encodeURIComponent(l)}/`;
  function popToggle(btn, kind) { if (POP.el && POP.kind === kind) popClose(true); else popOpen(btn, kind); }
  function popOpen(btn, kind) {
    popClose(false);
    const el = document.createElement('div');

    el.className = 'pop'; el.id = 'pop'; el.setAttribute('role', kind === 'mine' ? 'menu' : 'dialog'); el.setAttribute('aria-label', kind === 'mine' ? 'Меню аккаунта' : 'Стримеры');
    if (kind === 'mine') { el.classList.add('pop-menu'); btn.setAttribute('aria-controls', 'pop'); }
    document.body.appendChild(el);
    Object.assign(POP, { el, kind, from: btn });
    btn.setAttribute('aria-expanded', 'true');
    popRender(); popPlace();
    if (kind === 'all' && !POP.list && !POP.loading) {
      POP.loading = true; POP.err = '';
      api('/api/channels').then((r) => { POP.loading = false; if (r && r.ok) POP.list = r.channels || []; else POP.err = (r && r.error) || 'не загрузилось'; if (POP.el) { popRender(); popPlace(); } });
    }


    const f = el.querySelector('a, button'); if (f) try { f.focus({ preventScroll: true }); } catch {}
  }
  function popClose(back) {
    if (!POP.el) return;
    POP.el.remove(); POP.el = null; POP.outAt = 0; clearTimeout(POP.outT);
    if (POP.from) { POP.from.setAttribute('aria-expanded', 'false'); if (back) try { POP.from.focus(); } catch {} }
    POP.kind = '';
  }
  function popPlace() {
    const el = POP.el, b = POP.from; if (!el || !b) return;
    const r = b.getBoundingClientRect(), w = Math.min(320, window.innerWidth - 24);
    el.style.width = w + 'px';
    const left = POP.kind === 'mine' ? r.right - w : r.left;
    el.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, left)) + 'px';
    el.style.top = Math.round(r.bottom + 8) + 'px';
    el.style.maxHeight = Math.max(200, window.innerHeight - r.bottom - 24) + 'px';
  }
  function popRender() {
    const el = POP.el; if (!el) return;
    const mine = (ME && ME.mine) || [], cur = CH ? CH.login.toLowerCase() : '';
    const mineHtml = mine.length ? `<p class="pop-h">Мои каналы</p><ul class="pop-l">${mine.map((m) => `<li class="pop-mine"><span class="pop-n" title="${esc(m.name)}">${esc(m.name)}${m.login.toLowerCase() === cur ? '<span class="pop-here">здесь</span>' : ''}</span>
        <span class="pop-a"><a href="${chUrl(m.login)}">Открыть сайт</a>${m.streamer ? `<a href="${chUrl(m.login)}#streamer" data-sm="${esc(m.login)}">${ME && ME.onePult ? 'Открыть пульт здесь' : 'Режим стримера'}</a>` : ''}</span></li>`).join('')}</ul>` : '';
    let all = '';
    if (POP.kind === 'all') {
      const L = POP.list;
      all = `<p class="pop-h">Стримеры</p>` + (L ? (L.length ? `<ul class="pop-l">${L.map((c) => `<li><a class="pop-ch" href="${chUrl(c.login)}"${c.login.toLowerCase() === cur ? ' aria-current="page"' : ''}><span class="pop-n" title="${esc(c.name)}">${esc(c.name)}</span>${c.live ? '<span class="pop-live"><i aria-hidden="true"></i>в эфире</span>' : ''}</a></li>`).join('')}</ul>` : '<p class="pop-e">Пока никого.</p>')
        : `<p class="pop-e">${POP.err ? esc('Список ' + POP.err) : 'Загружаем…'}</p>`);
    }

    const tut = POP.kind === 'mine' && ME && ME.tut ? `${mineHtml ? '<hr class="pop-sep">' : ''}<ul class="pop-l pop-tut"><li><button type="button" class="pop-tb" data-tut="p">Как играть</button></li>${ME.own ? '<li><button type="button" class="pop-tb" data-tut="s">Как вести игру на стриме</button></li>' : ''}</ul>` : '';

    const own = ME && ME.own ? String(ME.own.login).toLowerCase() : '';
    const adm = POP.kind === 'all' && ME && ME.admin && own ? `<p class="pop-h">Админ</p><ul class="pop-l"><li><a class="pop-ch" data-adm href="${chUrl(own)}#admin"><span class="pop-n"><span aria-hidden="true">⚙ </span>Админ - все каналы</span></a></li></ul><hr class="pop-sep">` : '';

    const acc = POP.kind === 'mine' && ME && ME.user ? `${mineHtml || tut ? '<hr class="pop-sep">' : ''}<ul class="pop-l pop-acc" aria-label="Аккаунт"><li><button type="button" class="pop-tb" data-settings>${ico('gear', 'pop-i')}<span>Настройки</span></button></li>`
      + `<li><button type="button" class="pop-tb pop-out${POP.outAt ? ' warn' : ''}" id="out" title="Выйти из аккаунта Twitch на этом сайте">${ico('exit', 'pop-i')}<span>${POP.outAt ? 'Точно выйти?' : 'Выйти из аккаунта'}</span></button></li></ul>` : '';
    const fi = POP.kind === 'mine' ? menuItems().indexOf(document.activeElement) : -1;
    el.innerHTML = adm + (POP.kind === 'all' ? all + (mineHtml ? '<hr class="pop-sep">' + mineHtml : '') : mineHtml + tut + acc);
    if (POP.kind === 'mine') { menuRoles(el); const L = menuItems(); if (fi >= 0 && L.length) { const t = L[Math.min(fi, L.length - 1)]; L.forEach((x) => { x.tabIndex = x === t ? 0 : -1; }); try { t.focus({ preventScroll: true }); } catch {} } }

    el.onclick = (e) => {
      const tb = e.target.closest('[data-tut]');
      if (tb) { popClose(false); startLoad().then(() => window.LGStart && window.LGStart.tutor(tb.dataset.tut), () => toast('Обучение не загрузилось - проверь связь', true)); return; }
      if (e.target.closest('a[data-adm]')) { popClose(false); return; }
      if (e.target.closest('[data-settings]')) { popClose(false); settingsOpen(); return; }
      if (e.target.closest('#out')) { logoutTap(); return; }
      const a = e.target.closest('a[data-sm]');
      if (a && a.dataset.sm.toLowerCase() === cur && smOk()) { e.preventDefault(); popClose(false); if (smMode) smModeSet(''); else tab('streamer'); }
    };
  }
  

  function menuRoles(el) {
    el.querySelectorAll('.pop-h, .pop-here').forEach((h) => h.setAttribute('aria-hidden', 'true'));
    el.querySelectorAll('.pop-sep').forEach((h) => h.setAttribute('role', 'separator'));
    el.querySelectorAll('ul').forEach((u) => {
      u.setAttribute('role', 'group');
      const h = u.previousElementSibling; if (h && h.classList.contains('pop-h') && !u.hasAttribute('aria-label')) u.setAttribute('aria-label', h.textContent);
    });
    el.querySelectorAll('li').forEach((li) => li.setAttribute('role', 'none'));
    el.querySelectorAll('a, button').forEach((a) => {
      a.setAttribute('role', 'menuitem'); a.tabIndex = -1;
      const n = a.closest('.pop-mine') && a.closest('.pop-mine').querySelector('.pop-n');
      if (n) a.setAttribute('aria-label', `${a.textContent} - ${n.firstChild ? n.firstChild.textContent : n.textContent}`);
    });
    const f = el.querySelector('[role="menuitem"]'); if (f) f.tabIndex = 0;
  }
  const menuItems = () => (POP.el ? [...POP.el.querySelectorAll('[role="menuitem"]')] : []);
  function menuKey(e) {
    if (!POP.el || POP.kind !== 'mine') return;
    const L = menuItems(); if (!L.length) return;
    const i = L.indexOf(document.activeElement);
    const go = (k) => { e.preventDefault(); const t = L[(k + L.length) % L.length]; L.forEach((x) => { x.tabIndex = x === t ? 0 : -1; }); try { t.focus(); } catch {} };
    if (e.key === 'ArrowDown') go(i + 1); else if (e.key === 'ArrowUp') go(i < 0 ? L.length - 1 : i - 1);
    else if (e.key === 'Home') go(0); else if (e.key === 'End') go(L.length - 1);
    else if (e.key === 'Tab') { e.preventDefault(); popClose(true); }
  }

  async function logoutTap() {

    const arm = (on) => { const o = POP.el && POP.el.querySelector('#out'); if (!o) return; o.classList.toggle('warn', on); o.lastElementChild.textContent = on ? 'Точно выйти?' : 'Выйти из аккаунта'; };
    if (!POP.outAt || Date.now() - POP.outAt > 4000) {
      POP.outAt = Date.now(); arm(true);
      clearTimeout(POP.outT); POP.outT = setTimeout(() => { if (POP.el && POP.outAt) { POP.outAt = 0; arm(false); } }, 4000);
      return;
    }
    popClose(false);
    await api('/auth/logout', {}); last = ''; load();
  }
  document.addEventListener('keydown', menuKey);

  


  const SETS = [];
  let setShut = null;
  function settingsOpen(id) {
    if (setShut) setShut();
    const was = POP.from && POP.from.isConnected ? POP.from : document.activeElement, offs = [];

    const L = SETS.filter((s) => { try { return !s.when || s.when(ME); } catch { return false; } });
    const back = document.createElement('div');
    back.className = 'set-back';
    back.innerHTML = `<div class="set" role="dialog" aria-modal="true" aria-labelledby="setT"><div class="set-h"><h2 id="setT">Настройки</h2><button type="button" class="set-x" data-x aria-label="Закрыть">${ico('x')}</button></div>`
      + `<div class="set-b">${L.length ? L.map((s) => `<section class="set-s" data-set="${esc(s.id)}"><h3>${esc(s.title || '')}</h3><div class="set-c"></div></section>`).join('') : '<p class="set-e">Скоро здесь появятся настройки.</p>'}</div></div>`;
    const box = back.firstChild;
    document.documentElement.classList.add('set-open');
    setShut = SU.layer(back, { onClose: () => {
      setShut = null; document.documentElement.classList.remove('set-open');
      offs.forEach((f) => { try { f(); } catch (er) { console.warn('[настройки] закрытие раздела', er); } });
      try { if (was && was.focus) was.focus(); } catch {}
    } });
    L.forEach((s) => {
      const c = box.querySelector(`[data-set="${CSS.escape(s.id)}"] .set-c`);
      try { const off = s.render && s.render(c, ME); if (typeof off === 'function') offs.push(off); } catch (er) { console.error('[настройки] раздел', s.id, er); c.textContent = 'Раздел не открылся.'; }
    });
    box.querySelector('[data-x]').onclick = () => setShut && setShut();

    box.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const F = [...box.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.getClientRects().length);
      if (!F.length) return;
      const a = F[0], z = F[F.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });

    try { box.querySelector('[data-x]').focus({ preventScroll: true }); } catch {}
    const t = id && box.querySelector(`[data-set="${CSS.escape(id)}"]`);
    if (t) t.scrollIntoView({ block: 'start' });
    return setShut;
  }
  window.LGSettings = {
    add(s) { if (!s || !s.id) return; const i = SETS.findIndex((x) => x.id === s.id); if (i >= 0) SETS[i] = s; else SETS.push(s); },
    open: settingsOpen,
    list: () => SETS.map((s) => s.id),
  };
  document.addEventListener('click', (e) => { if (POP.el && !POP.el.contains(e.target) && !(POP.from && POP.from.contains(e.target))) popClose(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && POP.el) popClose(true); });
  window.addEventListener('resize', () => popPlace());
  window.addEventListener('scroll', () => popPlace(), { passive: true });

  let chswAdm = null;
  function chswLabel() {
    const b = $('#chsw'); if (!b || !CH) return;
    const st = $('#tab-streamer'), a = smMode === 'admin' && !!st && st.classList.contains('on');
    if (a === chswAdm) return; chswAdm = a;
    b.classList.toggle('is-adm', a);
    b.innerHTML = `${ico('users', 'chu')}<span class="chsw-n">${a ? '<span aria-hidden="true">⚙ </span>Админ' : esc(CH.name)}</span>${ico('chev', 'chv')}`;
    b.title = a ? 'Админ - все каналы. Стримеры: открыть сайт другого канала' : `${CH.name} — стримеры: открыть сайт другого канала`;
    b.setAttribute('aria-label', a ? 'Админ - все каналы. Стримеры — другие каналы' : `Канал ${CH.name}. Стримеры — другие каналы`);
  }
  function chswInit() {
    const b = $('#chsw'); if (!b || !CH) return;
    chswAdm = null; chswLabel();
    b.hidden = false;

    b.onclick = () => { if (ME && ME.find) { popClose(false); startLoad().then(() => window.LGStart && window.LGStart.findToggle(b), () => popToggle(b, 'all')); } else popToggle(b, 'all'); };
  }

  


  if (window.LGSettings) window.LGSettings.add({ id: 'email', title: 'Почта для входа', when: (me) => !!(me && me.em), render(el, me) {
    const sec = el.closest('.set-s');
    if (!me || !me.em) { if (sec) sec.hidden = true; return; }
    const ERR = { bad_email: 'Это не похоже на адрес почты.', rate_limited: 'Слишком много писем - подожди немного (до часа).', bad_code: 'Код не подошёл.',
      too_many: 'Слишком много неверных попыток - код больше не действует. Пришли новый.', expired: 'Код уже не действует (15 минут прошло или им воспользовались). Пришли новый.',
      taken: 'Эта почта уже привязана к другому аккаунту.', same_email: 'Эта почта уже привязана к тебе.', banned: 'Аккаунт заблокирован в игре.', feature_closed: 'Пока недоступно.', no_email: 'Почта не привязана.' };
    const errOf = (j) => (ERR[j && j.error] ? ERR[j.error] + ((window.LGSiteUi && window.LGSiteUi.closedCode && window.LGSiteUi.closedCode(j)) || '') : (j && j.error) || 'Не вышло - попробуй ещё раз.');
    let st = { email: null }, wait = null, closed = false;
    const draw = (msg, bad) => {
      if (closed) return;
      const m = msg ? `<p class="em-msg${bad ? ' bad' : ''}" role="${bad ? 'alert' : 'status'}">${esc(msg)}</p>` : '';
      if (wait) {
        el.innerHTML = `<p class="em-t">${wait.kind === 'unlink' ? 'Чтобы отвязать почту, введи' : 'Введи'} код из письма на <b>${esc(wait.to)}</b>. Можно и нажать кнопку в письме. Код действует 15 минут.</p>`
          + `<form class="em-f" data-f="code" novalidate><input class="em-in em-code" name="c" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" aria-label="Код из письма (6 цифр)">`
          + `<button class="btn primary sm" type="submit">${wait.kind === 'unlink' ? 'Отвязать' : 'Подтвердить'}</button></form>`
          + `<div class="em-row"><button type="button" class="em-l" data-a="again">Прислать ещё раз</button><button type="button" class="em-l" data-a="cancel">Отмена</button></div>${m}`;
      } else if (st.email) {
        el.innerHTML = `<p class="em-t">Входить на сайт можно по почте:<br><b class="em-addr">${esc(st.email)}</b> <span class="em-ok">подтверждена</span></p>`
          + `<div class="em-row"><button type="button" class="btn ghost sm" data-a="change">Сменить</button><button type="button" class="btn ghost sm" data-a="unlink">Отвязать</button></div>`
          + `<form class="em-f" data-f="email" hidden novalidate><input class="em-in" name="e" type="email" inputmode="email" autocomplete="email" maxlength="254" placeholder="Новая почта" aria-label="Новая почта"><button class="btn primary sm" type="submit">Прислать код</button></form>${m}`;
      } else {
        el.innerHTML = `<p class="em-t">Привяжи почту - и на сайт можно будет входить без Twitch, по коду из письма («Войти по почте»). Это тот же аккаунт и тот же герой. Паролей нет.</p>`
          + `<form class="em-f" data-f="email" novalidate><input class="em-in" name="e" type="email" inputmode="email" autocomplete="email" maxlength="254" placeholder="you@example.ru" aria-label="Почта"><button class="btn primary sm" type="submit">Прислать код</button></form>${m}`;
      }
    };
    const busy = (on) => el.querySelectorAll('button, input').forEach((x) => { x.disabled = on; });
    async function ask(kind, email) {
      busy(true);
      const j = await api(kind === 'unlink' ? '/api/email/unlink' : '/api/email/link', kind === 'unlink' ? {} : { email });
      if (!j || !j.ok) { busy(false); draw(errOf(j), true); return; }
      wait = { kind, to: kind === 'unlink' ? st.email : email };
      draw(kind === 'unlink' ? '' : 'Письмо отправлено. Если адрес уже привязан к другому аккаунту, кода в письме не будет.');
      const c = el.querySelector('.em-code'); if (c) try { c.focus(); } catch {}
    }
    el.onsubmit = async (e) => {
      e.preventDefault();
      const f = e.target.closest('form'); if (!f) return;
      if (f.dataset.f === 'email') {
        const v = String(f.elements.e.value || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { draw(ERR.bad_email, true); return; }
        await ask('link', v);
        return;
      }
      const code = String(f.elements.c.value || '').replace(/\D/g, '');
      if (code.length !== 6) { draw('В коде 6 цифр.', true); return; }
      busy(true);
      const j = await api('/api/email/confirm', { code, kind: wait.kind });
      if (!j || !j.ok) {
        busy(false);
        if (j && (j.error === 'too_many' || j.error === 'expired')) { wait = null; draw(errOf(j), true); return; }
        draw(errOf(j) + (j && j.error === 'bad_code' && j.left ? ` Осталось попыток: ${j.left}.` : ''), true); return;
      }
      const k = wait.kind; wait = null; st.email = j.email || null;
      draw(k === 'unlink' ? 'Почта отвязана. Вход через Twitch - как раньше.' : 'Почта подтверждена - теперь можно входить по ней.');
      toast(k === 'unlink' ? 'Почта отвязана' : 'Почта подтверждена');
    };
    el.oninput = (e) => { if (e.target.classList.contains('em-code')) e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6); };
    el.onclick = (e) => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      const a = b.dataset.a;
      if (a === 'change') { const f = el.querySelector('form[data-f="email"]'); if (f) { f.hidden = false; try { f.elements.e.focus(); } catch {} } }
      else if (a === 'unlink') void ask('unlink');
      else if (a === 'again' && wait) void ask(wait.kind, wait.to);
      else if (a === 'cancel') { wait = null; draw(); }
    };
    el.innerHTML = '<p class="em-t">Загружаем…</p>';
    api('/api/email').then((j) => { if (j && j.on === false) { if (sec) sec.hidden = true; return; } st = { email: (j && j.email) || null }; draw(); });
    return () => { closed = true; };
  } });

   
  const equipped = (h, sl) => h.items.find((x) => x.on && x.slot === sl);
  function deltas(it, h) {
    const c = it.wearable && !it.on ? equipped(h, it.slot) : null;
    const keys = Array.from(new Set([...Object.keys(it.stats || {}), ...Object.keys((c && c.stats) || {})])).filter((k) => stOk(k, h));
    const cs = (c && c.stats) || {}, own = it.stats || {};
    const rows = keys.map((k) => { const v = (it.stats || {})[k] || 0, dv = c ? Math.round(((own[k] || 0) - (cs[k] || 0)) * 10) / 10 : 0; return { k, v, dv }; });
    const score = rows.reduce((a, r) => a + r.dv * (STW[r.k] || XSTW[r.k] || 1), 0);
    return { c, rows, score, better: it.wearable && !it.on && (c ? score > 0.01 : rows.some((r) => r.v > 0)) };
  }
  function effText(it) {
    const e = it.effect; if (!e) return '';
    const p = [];
    if (e.heal) p.push(`лечит ${e.heal} здоровья`);
    if (e.revive) p.push('воскрешает павшего героя');
    if (e.buff) p.push(`${stLabel(e.buff.stat).toLowerCase()} +${e.buff.add} на ${e.buff.min || 60} мин`);
    return p.join(', ');
  }

  const mmss = (t) => { const s2 = Math.max(0, Math.ceil(((+t || 0) - gnow()) / 1000)); return `${Math.floor(s2 / 60)}:${String(s2 % 60).padStart(2, '0')}`; };

  const cdUntil = (it, h) => { if (!h) return 0; const t = gnow(); if ((it.slot === 'food' || it.slot === 'potion') && h.eatUntil > t) return h.eatUntil; if (it.effect && it.effect.revive && h.scrollUntil > t) return h.scrollUntil; return 0; };
  const eatCd = (it, h) => !!cdUntil(it, h);

  const edible = (it) => !it.wearable && (it.slot === 'food' || it.slot === 'potion') && !!it.effect && !it.effect.revive;
  const eatVerb = (it) => (it.slot === 'potion' || it.drink ? 'Выпить' : 'Съесть');
  const BUSY_NOTE = 'Идёт бой на стриме — снаряжение менять нельзя. Снять и надеть можно после боя';
  const useCmd = (it) => { const k = it.no ? ' ' + it.no : ''; const e = it.effect || {}; if (e.revive) return 'свиток (или свиток @ник)'; if (it.slot === 'potion' || it.drink) return 'выпить' + k; if (it.slot === 'food') return 'съесть' + k; return ''; };


  function tickCd() {
    if (document.hidden) return;
    let done = false;
    document.querySelectorAll('[data-eat]').forEach((e) => { const t = +e.dataset.eat; if (t <= gnow()) done = true; else { const v = mmss(t); if (e.textContent !== v) e.textContent = v; } });
    if (done && !DR.active) renderHero();
  }
  setInterval(() => { if (!document.hidden && document.querySelector('[data-eat]')) tickCd(); }, 1000);

  function bagList(h) {
    const out = [], stacks = {};
    for (const it of h.items) {
      if (it.on) continue;
      if (!it.wearable) { const k = it.id; if (stacks[k]) { stacks[k].n++; stacks[k].uids.push(it.uid); continue; } stacks[k] = { ...it, n: 1, uids: [it.uid] }; out.push(stacks[k]); }
      else out.push({ ...it, n: 1, uids: [it.uid] });
    }

    return out.sort((a, b) => ((a.no || 1e9) - (b.no || 1e9)) || (b.wearable - a.wearable) || (RORD[a.rarity] - RORD[b.rarity]) || a.name.localeCompare(b.name, 'ru'));
  }
  const catOf = (it) => (it.wearable ? it.slot : it.slot === 'material' ? 'mat' : it.relic || it.slot === 'relic' ? 'relic' : 'other');





  const classIds = (h) => {
    const L = ME && Array.isArray(ME.classes) && ME.classes.length ? ME.classes : Object.keys((ME && ME.roles) || ROLE_BASE).filter((k) => k !== 'recruit').map((id) => ({ id }));
    return L.filter((c) => c && c.id && (!c.beta || (h && (h.cb || h.role === c.id || (h.items || []).some((x) => x.role === c.id))))).map((c) => c.id);
  };
  const betaOpen = (h) => classIds(h).some((k) => ((ME && ME.classes) || []).some((c) => c.id === k && c.beta));
  const GEAR_CLS = { heavy: GD.gearClasses('heavy'), light: GD.gearClasses('light'), cloth: GD.gearClasses('cloth') };
  const SHIELD_CLS = GD.classes().filter((c) => c.shield).map((c) => c.id);
  const clsOf = (it) => (it.slot === 'weapon' && it.role ? [it.role] : it.slot === 'trinket' && it.role ? [it.role] : it.slot === 'shield' ? (it.gear === 'cloth' ? GEAR_CLS.cloth : SHIELD_CLS) : (it.slot === 'armor' || it.slot === 'helmet') && GEAR_CLS[it.gear] ? GEAR_CLS[it.gear] : null);
  const fitsCls = (it, c) => c === 'all' || !it.wearable || !clsOf(it) || clsOf(it).includes(c);
  try { const v = localStorage.getItem('lgCls'); if (v && /^[a-z]{2,20}$/.test(v)) cls = v; } catch {}


  function fitName(n) {
    if (!n) return;
    n.style.fontSize = ''; n.style.whiteSpace = 'nowrap';
    const w = n.clientWidth, sw = n.scrollWidth; if (!w || sw <= w) return;
    const base = parseFloat(getComputedStyle(n).fontSize) || 32, k = Math.max(0.55, (w / sw) * 0.98);
    n.style.fontSize = (base * k).toFixed(1) + 'px';
    if (n.scrollWidth > n.clientWidth) n.style.whiteSpace = '';
  }
  let fitT = 0; window.addEventListener('resize', () => { clearTimeout(fitT); fitT = setTimeout(() => fitName(document.querySelector('#tab-hero .plate .nm')), 150); });
  try { document.fonts && document.fonts.ready.then(() => fitName(document.querySelector('#tab-hero .plate .nm'))); } catch {}
  


  function dollHtml(h, o = {}) {
    if (o.off) return '';
    const fg = !!o.forge;
    const slotBtn = (sl) => {
      const it = equipped(h, sl);
      if (it && fg) { const ok = !o.can || o.can(it); return `<button type="button" class="slot full${ok ? '' : ' off'}" data-slot="${sl}" data-r="${esc(it.rarity)}" data-ig="${esc(it.uid)}"${ok && !h.ghost && !h.busy ? ' data-igdrag="1"' : ''} aria-pressed="${it.uid === o.sel}" aria-label="${SLOT[sl]}: ${esc(it.name)}${durAria(it)} — положить на наковальню">${lgx(it)}${art(it)}${durBadge(it)}${it.en > 0 ? `<span class="en">+${+it.en}</span>` : ''}<span class="sl">${SLOT[sl]}</span><span class="sn">${esc(it.name)}</span></button>`; }
      if (it) return `<button type="button" class="slot full${h.busy ? ' locked' : ''}" data-slot="${sl}" data-r="${esc(it.rarity)}" data-sel="${esc(it.uid)}"${h.ghost || h.busy ? '' : ` data-drag="off" data-dslot="${sl}"`} aria-pressed="${it.uid === o.sel}" aria-label="${SLOT[sl]}: ${esc(it.name)}${durAria(it)}${h.busy ? ' (в бою)' : ''}">${lgx(it)}${art(it)}${durBadge(it)}<span class="sl">${SLOT[sl]}</span><span class="sn">${esc(it.name)}</span></button>`;
      if (fg) return `<span class="slot" data-slot="${sl}" aria-label="${SLOT[sl]}: пусто">${art(EMPTY[sl], 'sil')}<span class="sl">${SLOT[sl]}</span><span class="sn">пусто</span></span>`;
      return `<button type="button" class="slot${h.busy ? ' locked' : ''}" data-slot="${sl}" data-empty="${sl}" aria-label="${SLOT[sl]}: пусто — показать подходящее в сумке">${art(EMPTY[sl], 'sil')}<span class="sl">${SLOT[sl]}</span><span class="sn">пусто</span></button>`;
    };
    return `<div class="doll${fg ? ' ig-doll' : ''}">
          <div class="fig">${(o.still ? still : String)(doodle(h.login, heroLook(h), o.mood || 'stern', h.ghost ? undefined : o.kit || 'battle'))}</div>
          ${SLOTS.map(slotBtn).join('')}
        </div>`;
  }

  


  const CANDY_MAX = 9999;
  const candyN = (h) => (h && h.hw ? Math.max(0, Math.floor(+h.hw.c || 0)) : null);
  const candyLabel = (n) => (n > CANDY_MAX ? CANDY_MAX + '+' : String(n));
  const candyText = (n) => `Конфеты: ${n}. Тратить - в «Ступе сладостей» в Городе; в конце ивента остаток превратится в монеты.`;

  const candyArt = (cls) => `<svg class="art${cls ? ' ' + cls : ''}" viewBox="-22 -22 44 44" aria-hidden="true"><g transform="translate(9 -9) rotate(28) scale(.8)"><path d="M-12 -6 L-6 -2 L-6 2 L-12 6 Z M12 -6 L6 -2 L6 2 L12 6 Z" fill="#9b5cff" stroke="#15122e" stroke-width="1.6" stroke-linejoin="round"/><ellipse rx="7" ry="5.5" fill="#ffd34d" stroke="#15122e" stroke-width="1.8"/></g><g transform="translate(-3 6) rotate(-18) scale(1.45)"><path d="M-12 -6 L-6 -2 L-6 2 L-12 6 Z M12 -6 L6 -2 L6 2 L12 6 Z" fill="#ff7a1a" stroke="#15122e" stroke-width="1.6" stroke-linejoin="round"/><ellipse rx="7" ry="5.5" fill="#ff9fb2" stroke="#15122e" stroke-width="1.8"/><path d="M-3 -5 q2 5 0 10 M2 -5 q2 5 0 10" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/></g></svg>`;
  const candyTipHtml = (n) => `<div class="t-h"><span class="t-n">🍬 Конфеты</span><span class="muted">${n}</span></div><div class="t-s"><span class="muted">Хэллоуин</span><span class="muted">место в сумке не занимают</span></div><p class="t-desc">${esc(candyText(n))}</p>`;

  const candyCell = (h) => { const n = candyN(h); if (n == null) return ''; return `<button type="button" class="cell cnd-tile" data-r="common" data-candy="${n}" aria-label="${esc(candyText(n))}">${candyArt()}<span class="cn">Конфеты</span><span class="cnt">${candyLabel(n)}</span></button>`; };

  const candyPins = (h) => { const n = candyN(h); return n == null ? [] : [{ id: 'candy', name: 'Конфеты', label: candyLabel(n), n, art: candyArt(), aria: candyText(n) }]; };
  function candyTip(el, n) {
    if (!el || !el.isConnected || DR.active) return;
    if (tipFor && tipFor !== el) tipFor.removeAttribute('aria-describedby');
    tip.classList.remove('card', 'scroll'); tipFor = el; tip.innerHTML = candyTipHtml(n); tip.hidden = false; tip.dataset.r = 'common'; tipPlace(el);
  }
  function nameItems(h) { if (h && h.items) for (const it of h.items) { if (!it.srvName) it.srvName = it.name; it.baseName = it.baseName || it.srvName; it.name = nameOf(it) + (it.en > 0 ? ' +' + it.en : ''); } }
  





  const inv2On = (h) => !!(h && h.i2 && window.LGInventory && !DOCK);
  const mqInv = SU.media('tablet');
  let INV2 = null;
  const inv2Data = (h) => ({ hero: h, items: h.items.slice().sort((a, b) => (a.no || 1e9) - (b.no || 1e9)), stack: (h.sg && h.sg.bs) || 20, bagCap: h.sg && cls === 'all' ? h.sg.cap : null, ...(+h.ob > 0 ? { obCap: +h.ob } : {}), pins: candyPins(h),


    ...(h.sg && (h.sg.sx || h.sg.fb) && cls === 'all' ? { lay: { bag: (h.sg.lay && h.sg.lay.b) || [], ob: (h.sg.lay && h.sg.lay.o) || [] } } : {}) });
  const inv2Busy = () => { const h = ME && ME.hero; if (h && (h.ghost || h.busy)) { toast(h.ghost ? 'Призрак не переодевается' : BUSY_NOTE, true); return true; } return false; };
  function inv2Host(h, selUid) {
    const v = mqInv.matches ? 'full' : 'sheet';


    const fb = !!(h.sg && h.sg.fb), ht = trashOk(h);
    if (INV2 && (INV2.v !== v || INV2.fb !== fb || INV2.ht !== ht)) inv2Drop();
    if (!INV2) {

      const host = document.createElement('div'); host.className = 'inv2-host';
      const dollEl = document.createElement('div'); dollEl.className = 'inv2-doll';
      const inv = window.LGInventory.mount(host, { variant: v, mode: 'equip', data: inv2Data(h),
        actions: {
          equip: (uid) => (inv2Busy() ? null : act('/api/equip', { uid }, word('on', 'Надето'))),
          unequip: (slot) => (inv2Busy() ? null : act('/api/unequip', { slot }, word('off', 'Снято'))),
          use: (uid) => { const it = ME.hero.items.find((x) => x.uid === uid); return act('/api/use', { uid }, it && eatVerb(it) === 'Выпить' ? 'Выпито' : 'Съедено'); },
          reorder: (from, to) => (ordOk(ME && ME.hero) ? ordSave(ordMove(ME.hero, from, to), from) : null),

          lay: (box, keys) => act('/api/stLay', { box: box === 'ob' ? 'o' : 'b', lay: keys }, ''),

          ...(ht ? { discard: (uids, it, n) => trashGo(uids, it, n) } : {}),
        },
        options: {
          ...(ht ? { trashWhy: (it) => (GD.discardWhy ? GD.discardWhy(it) : '') } : {}),
          header: false, vitals: false, detail: false, storeKey: fb ? 'lgInv2f' : 'lgInv2', ...(fb ? { sortDefault: 'new' } : {}), label: word('bag', 'Сумка'), dollEl, dragRoot: $('#tab-hero'),
          filters: ['all', 'weapon', 'armor', 'helmet', 'shield', 'trinket', 'use', 'other'],
          art: (it) => art(it), only: (it) => fitsCls(it, cls),
          figure: (hh) => { const st = hh.stats || {}, mx = st.hp || 0, nw = hh.hpNow ?? mx; return doodle(hh.login, heroLook(hh), mx && nw / mx < 0.3 ? 'hurt' : 'stern', hh.ghost ? undefined : kit); },
          cardTip: (c, it) => cardTip(c, it, ME.hero), tipHide: () => tipHide(), pinTip: (b, p) => candyTip(b, p.n),
          canUse: (it) => (eatCd(it, ME.hero) && !(it && it.effect && it.effect.hw) ? 'Еда и зелья ещё не готовы' : true),
          extra: (c) => (c.it.no ? `<span class="no" title="Номер в сумке - для команд в чате">${c.it.no}</span>` : ''),


          menu: (c, it, e) => { const t = TIPS[it.uid] || Object.values(TIPS).find((x) => x.uids && x.uids.includes(it.uid)) || { ...it, n: 1, uids: [it.uid] }; ctxMenu(e.clientX, e.clientY, t, ME.hero, trashMore(ME.hero)); },
          onSelect: (it) => { sel = it ? it.uid : null; sheet = !!it && !mqWide.matches; renderHero(); if (sheet) { const c = $('.detail [data-close]', $('#tab-hero')); if (c) c.focus(); } },
          say: (t) => toast(t, true),
        } });
      INV2 = { host, dollEl, inv, v, fb, ht };
    } else INV2.inv.update(inv2Data(h));
    INV2.inv.select(selUid || '');
    return INV2.host;
  }
  function inv2Drop() { if (!INV2) return; try { INV2.inv.destroy(); } catch {} INV2.host.remove(); INV2.dollEl.remove(); INV2 = null; }
  




  const trashOk = (h) => !!(h && h.ht && INV && INV.trashAsk);
  const trashMore = (h) => (trashOk(h) ? { discard: (uid) => trashFor(uid) } : undefined);
  const trashWhyOf = (it) => (!it ? 'Такой вещи нет' : it.on ? 'Надетую вещь не выбросить - сначала сними' : (GD.discardWhy && GD.discardWhy(it)) || '');
  const trashGo = (uids, it, n) => act('/api/discard', { uids }, `Выброшено: ${it.name}${n > 1 ? ` ×${n}` : ''}`);
  function trashFor(uid, back) {
    const h = ME && ME.hero; if (!trashOk(h)) return;
    if (INV2 && INV2.ht) { INV2.inv.discard(uid); return; }
    const it = TIPS[uid] || Object.values(TIPS).find((x) => x.uids && x.uids.includes(uid)); if (!it) return;
    const why = trashWhyOf(it); if (why) { toast(why[0].toUpperCase() + why.slice(1), true); return; }
    const uids = (it.uids || [uid]).slice(0, 200), n = uids.length;
    INV.trashAsk({ name: it.name, rarity: it.rarity, n, ore: !!it.qty, back: back && back.isConnected ? back : null,
      yes: (k) => trashGo(uids.slice(0, Math.max(1, Math.min(n, k))), it, k) });
  }
  mqInv.addEventListener('change', () => { if (INV2) { last = ''; renderHero(); } });
  function renderHero() {
    const el = $('#tab-hero');
    if (typeof tipHide === 'function' && tip && !tip.hidden) tipHide();
    if (!ME || !ME.user) return renderHello(el);
    const h = ME.hero;
    nameItems(h);
    if (!h) {

      const pk = !!ME.chPick && !ME.creating;
      el.innerHTML = `<div class="nohero panel"><div class="fig">${doodle(ME.user.login, null, 'happy')}</div><div><h1 class="h1">${ME.creating ? 'Герой собирается в путь…' : pk ? 'Выбери стримера' : 'Героя пока нет'}</h1><p class="lead">${ME.creating ? 'Создаём твоего героя — он появится здесь через несколько секунд, страницу обновлять не нужно. Если MultiDonate у стримера сейчас выключен, герой появится, как только начнётся стрим.' : pk ? 'Твой герой появится у того стримера, которого ты выберешь.' : 'Он появится, когда ты напишешь в чат на стриме.'}</p></div></div>`;
      calm(el); return;
    }
    const viewsBar = `<div class="views filters" role="group" aria-label="Что показать"><button type="button" data-view="gear" aria-pressed="${view === 'gear'}">Снаряжение</button><button type="button" data-view="look" aria-pressed="${view === 'look'}">Облик</button>${h.sk ? `<button type="button" data-view="skills" aria-pressed="${view === 'skills'}">Навыки</button>` : ''}${h.ac ? `<button type="button" data-view="ach" aria-pressed="${view === 'ach'}">Достижения</button>` : ''}<button type="button" data-view="log" aria-pressed="${view === 'log'}">Журнал</button></div>`;

    const hv = `<div class="hero-views">${viewsBar}</div>`;

    if (view === 'skills' && !h.sk) view = 'gear';

    const lzWait = (k, t) => {
      el.innerHTML = `${hv}<p class="muted lz-wait" role="status">Загружаю ${t}…</p>`;
      el.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => { view = b.dataset.view; try { localStorage.setItem('lgView', view); } catch (e) {   } renderHero(); });
      if (k === 'ach') lazy('pick');
      lazy(k).then((ok) => { const w = el.querySelector('.lz-wait'); if (!ok && view === k && w) w.textContent = 'Не загрузилось - проверь связь и открой ещё раз'; });
    };
    if (view === 'skills' && !window.LGSkills) { lzWait('skills', 'навыки'); return; }
    if (view === 'skills' && window.LGSkills) {
      el.innerHTML = `${hv}<div class="sk-wrap sk-tab">${window.LGSkills.html(h, SKX, { tree: true })}</div>`;
      el.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => { view = b.dataset.view; try { localStorage.setItem('lgView', view); } catch {} renderHero(); });
      window.LGSkills.bind(el, SKX); return;
    }

    if (view === 'ach' && !h.ac) view = 'gear';
    if (view === 'ach' && !window.LGAch) { lzWait('ach', 'достижения'); return; }
    if (view === 'ach') {
      el.innerHTML = `${hv}<div class="ac-wrap">${window.LGAch.html(h, SKX)}</div>`;
      el.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => { view = b.dataset.view; try { localStorage.setItem('lgView', view); } catch {} renderHero(); });
      window.LGAch.bind(el, SKX, h); return;
    }

    if (view === 'log') {
      el.innerHTML = `${hv}<div class="jr-wrap"><div id="jrFull"></div></div>`;
      el.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => goView(b.dataset.view));
      if (JL) renderLog(); else loadLog();
      return;
    }
    const s = h.stats || {}, hpMax = s.hp || 0, hpNow = h.hpNow ?? hpMax;
    const gp = !h.ghost && h.gearPen && h.gearPen.pct > 0 ? h.gearPen : null;


    const own = h.xpInLevel != null, xin = own ? Math.max(0, +h.xpInLevel || 0) : Math.max(0, (h.xp || 0) - (h.prevXp || 0));
    const xneed = own ? (h.xpToNext == null ? null : Math.max(1, +h.xpToNext || 0)) : (h.next == null ? null : Math.max(1, h.next - (h.prevXp || 0)));
    const xpPct = xneed == null ? 100 : Math.max(0, Math.min(100, (xin / xneed) * 100));
    const hpPct = hpMax ? Math.max(0, Math.min(100, (hpNow / hpMax) * 100)) : 0;
    const bag = bagList(h), i2 = inv2On(h);
    const cats = [['all', 'Всё'], ...SLOTS.map((k) => [k, SLOT[k]]), ['mat', 'Материалы'], ['relic', 'Особое'], ['other', 'Расходники']].filter(([k]) => k === 'all' || bag.some((x) => catOf(x) === k));
    if (!cats.some(([k]) => k === filter)) filter = 'all';
    const ids = classIds(h), myCls = ids.includes(h.role) ? h.role : null;
    const clsBtns = bag.some((x) => x.wearable && clsOf(x)) ? [['all', 'Все классы'], ...ids.map((k) => { const l = roleOf(k, ((ME && ME.roles) || {})[k]); return [k, k === myCls ? `${l} (ты)` : l]; })] : [];
    if (cls !== 'all' && !ids.includes(cls)) cls = 'all';

    const clsBar = clsBtns.length ? `<label class="clsf${cls === 'all' ? '' : ' on'}"><span>Класс</span><select data-cls aria-label="Для какого класса">${clsBtns.map(([k, l]) => `<option value="${esc(k)}"${cls === k ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></label>` : '';
    const shown = bag.filter((x) => (filter === 'all' || catOf(x) === filter) && fitsCls(x, cls));
    const nOn = h.items.filter((x) => x.on).length;

    let cur = sel && (h.items.find((x) => x.uid === sel) || bag.find((x) => x.uids.includes(sel)));
    if (cur && !cur.uids) cur = { ...cur, n: 1, uids: [cur.uid] };

    if (!cur) { sheet = false; sel = null; }
    const selUid = cur ? cur.uids[0] : null;

    TIPS = {}; TIPHERO = h;
    for (const it of h.items) if (it.on) TIPS[it.uid] = { ...it, n: 1, uids: [it.uid] };
    for (const it of bag) TIPS[it.uids[0]] = it;


    const freeCells = (hh, all) => { const g = hh.sg; if (!g || !all) return ''; const n = Math.max(0, Math.min(60, g.cap - g.used)); return n ? '<span class="cell free" aria-hidden="true"></span>'.repeat(n) : ''; };
    const cell = (it) => {
      const dv = deltas(it, h);
      return `<button type="button" class="cell${eatCd(it, h) ? ' oncd' : ''}" data-r="${esc(it.rarity)}" data-sel="${esc(it.uids[0])}"${it.wearable && !h.ghost && !h.busy ? ` data-drag="on" data-dslot="${esc(it.slot)}"` : ordOk(h) ? ' data-drag="mv"' : ''}${ordOk(h) ? ' aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"' : ''} aria-pressed="${it.uids[0] === selUid}" title="${esc(it.name)}">
        ${lgx(it)}${it.no ? `<span class="no" title="Номер в сумке — для команд в чате">${it.no}</span>` : ''}${it.en > 0 ? `<span class="en" title="Заточка +${it.en}">+${it.en}</span>` : ''}${durBadge(it)}${art(it)}<span class="cn">${esc(it.name)}</span>${eatCd(it, h) ? `<span class="eatcd" data-eat="${cdUntil(it, h)}">${mmss(cdUntil(it, h))}</span>` : ''}
        ${it.qty ? `<span class="cnt">${esc(INV.oreN ? INV.oreN(it.q) : it.q)}</span>` : it.n > 1 ? `<span class="cnt"${h.sg && !it.wearable && it.n > (h.sg.bs || 20) ? ` title="Стопка больше ${h.sg.bs || 20} — занимает ${Math.ceil(it.n / (h.sg.bs || 20))} ячейки сумки"` : ''}>×${it.n}${h.sg && !it.wearable && it.n > (h.sg.bs || 20) ? `<em class="cc"> · ${Math.ceil(it.n / (h.sg.bs || 20))} яч.</em>` : ''}</span>` : ''}${dv.better && !h.ghost ? `<span class="upg" title="Лучше надетого">${ico('up')}</span>` : ''}</button>`;
    };


    const lc = view === 'look' && lcOn(h);

    if (h.ac && !window.LGAch && (h.ac.t || (h.ac.sh || []).length)) lazy('ach');
    const plate = `<h1 class="nm">${esc(h.name)}${awb(h.aw)}</h1>${window.LGAch && h.ac ? window.LGAch.plate(h, SKX) : ''}
          <div class="role"><span class="rl">${h.ghost ? ico('ghost') + 'Призрак' : esc(roleOf(h.role, h.roleName))}</span><span class="lv">Ур. ${h.level}</span></div>`;


    const guSt = el.classList.contains('gu-win') ? el.scrollTop : -1;

    const colSt = guSt >= 0 ? ['vitals', 'stage', 'bag'].map((k) => { const c = $(`:scope > .hero-grid > .${k}`, el); return c ? c.scrollTop : 0; }) : null;

    const hpTip = (h, now, max) => {
      const r = +h.hpRegen || 0, per = r > 0 ? (r >= 60 ? `${Math.round(r / 60)} ХП в минуту` : `1 ХП в ${Math.round(60 / r)} мин`) : '';
      if (h.ghost) return 'Герой пал - здоровье вернётся после воскрешения';
      const rate = r > 0 ? `Раны заживают сами: ${r} ХП в час (${per}), и со стримом, и без` : 'Раны сами не заживают - только зелья и еда';
      if (now >= max) return rate + '. Здоровье полное';
      const ms = +h.hpFullIn || 0;
      const full = ms > 0 ? (ms >= 3600000 ? `${Math.floor(ms / 3600000)} ч ${Math.round(ms % 3600000 / 60000)} мин` : `${Math.max(1, Math.round(ms / 60000))} мин`) : '';
      return rate + (full ? `. Полностью - примерно через ${full}` : '') + '. Быстрее - зелья, еда и жареная рыба';
    };
    el.innerHTML = `${hv}<div class="hero-grid${h.ghost ? ' is-ghost' : ''}${i2 ? ' inv2' : ''}${lc ? ' lc-on' : ''}">
      <section class="panel stage" aria-label="Герой и снаряжение">
        ${view === 'look' ? (lc ? lcHtml(h, plate) : lookHtml(h)) : `${dollHtml(h, { sel: selUid, mood: hpMax && hpNow / hpMax < 0.3 ? 'hurt' : 'stern', kit, off: i2 })}${i2 ? '<div data-inv2-doll></div>' : ''}${h.ghost ? '' : `<div class="kit filters" role="group" aria-label="Вид героя"><button type="button" data-kit="battle" aria-pressed="${kit === 'battle'}" title="Как в бою: оружие, шлем вместо шапки, доспех, амулет">Боевой</button><button type="button" data-kit="peace" aria-pressed="${kit === 'peace'}" title="Как на привале и в городе: своя шапка и облик">Походный</button></div>`}`}
        ${lc ? '' : `<div class="plate">${plate}</div>`}
        ${h.ghost ? `<div class="ghostnote"><div class="gt">Пал в Походе</div><div class="cd" data-until="${+h.deadUntil || 0}">${left(h.deadUntil)}</div><div class="gs">до воскрешения${h.deadUntil ? ' · ' + new Date(h.deadUntil).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : ''}</div><p class="gh">Раньше — свиток возрождения, молитва жреца или донат от 100 ₽ с текстом <b>воскресить @${esc(h.login)}</b></p></div>` : ''}
        ${h.busy && !h.ghost ? `<div class="busybar" role="status">⚔ ${BUSY_NOTE}</div>` : ''}
      </section>
      <section class="panel vitals" aria-label="Характеристики">
        <div class="meter"><div class="mk"><span>Опыт</span><b>${xneed == null ? 'максимум' : `${xin} / ${xneed}`}</b></div><div class="bar xp" role="progressbar" aria-label="Опыт до следующего уровня" aria-valuenow="${Math.round(xpPct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${xpPct.toFixed(1)}%"></i></div></div>
        <div class="meter" title="${esc(hpTip(h, hpNow, hpMax))}"><div class="mk"><span>Здоровье</span><b>${hpNow} / ${hpMax}</b></div><div class="bar hp" role="progressbar" aria-label="Здоровье" aria-valuenow="${Math.round(hpPct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${hpPct.toFixed(1)}%"></i></div></div>
        <dl class="stats">${Object.keys(ST).map((k) => `<div class="stat" data-k="${k}" data-stat="${k}" tabindex="0">${ico(k)}<dt>${esc(stLabel(k))}</dt><dd>${gp && gp.stat === k && gp.full !== (s[k] ?? 0) ? `<s class="pen-was" title="Без штрафа за чужое снаряжение">${gp.full}</s><span class="pen-now">${s[k] ?? 0}</span>` : s[k] ?? 0}</dd></div>`).join('')}</dl>
        ${xsHtml(h.xs || null, h)}
        ${gp ? `<p class="penl" role="note"><b>⚠ Надеты вещи другого класса — дебафф −${gp.pct}% ${esc(gp.statName || 'урон')}</b><span>${gp.parts.map((x) => `${esc(x.name)} (${esc(x.gearName)}, −${x.pct}%)`).join(' · ')}</span></p>` : ''}
        <div class="coins">${ico('coin')}<span>Монеты</span>${money(h.money)}</div>
        ${h.debt > 0 ? `<p class="debtl" role="note"><b>Долг: −${money(h.debt)}</b><span>Пойман на краже в лавке. Пока долг не погашен, покупать нельзя — награды сначала идут в счёт долга.</span></p>` : ''}
        ${repAllHtml(h)}
        ${h.soc ? `<button type="button" class="socl${h.soc.bad ? ' bad' : ''}" data-gosoc title="Соц. рейтинг: место ${h.soc.place || '—'} из ${h.soc.total} — открыть рейтинг"><span class="sr-i" aria-hidden="true">${esc(h.soc.icon || '')}</span><span>Соц. рейтинг</span><b class="sr-r">${esc(h.soc.rankName || '')}</b><b class="sr-s">${h.soc.score}</b>${h.soc.place ? `<em>${h.soc.place} место</em>` : ''}</button>` : ''}
        ${jrMini()}
      </section>
      <section class="panel bag" aria-label="${word('bag', 'Сумка')}">
        <div class="bag-h"><h2 class="h2">${word('bag', 'Сумка')}</h2>${ordOk(h) && bag.length > 1 ? '<button type="button" class="btn ghost sm bag-sort" data-bagsort aria-label="Сортировать сумку: оружие, доспехи, шлемы, щиты, амулеты, расходники, материалы; свой порядок сбросится">⇅ Сортировать</button>' : ''}${h.ghost || h.busy || i2 ? '' : `<span class="dnd-hint muted">${dragHint(h)}</span>`}<span class="muted">${h.sg ? `<b class="bag-cnt${h.sg.used >= h.sg.cap ? ' full' : h.sg.used >= h.sg.cap - 2 ? ' near' : ''}" title="Ячеек занято: одинаковые еда, зелья и материалы лежат стопкой (до ${h.sg.bs || 20}), надетое не в счёт">${h.sg.used} / ${h.sg.cap}</b> · ` : ''}${bag.length ? `${h.items.length - nOn} ${plural(h.items.length - nOn, 'вещь', 'вещи', 'вещей')}` : 'пусто'}${nOn ? ` · ${nOn} надето` : ''}</span></div>
        ${h.sg && h.sg.used >= h.sg.cap ? `<p class="note bag-full" role="status">Сумка полна (${h.sg.used} / ${h.sg.cap}): купить в лавке не выйдет, добыча в походе достанется другому из отряда, а если у всех полно — останется лежать на месте 30 минут (подобрать — «подобрать»). Лишнее — на Склад${h.cy ? ' в «Городе»' : ''}.</p>` : ''}
        ${i2 ? `${clsBtns.length ? `${clsBar}` : ''}<div data-inv2></div>`
          : bag.length ? `<div class="filters" role="group" aria-label="Что показать">${cats.map(([k, l]) => `<button type="button" data-f="${k}" aria-pressed="${filter === k}">${l}</button>`).join('')}</div>
          ${clsBtns.length ? `${clsBar}` : ''}
          <div class="grid">${shown.map(cell).join('') || (filter === 'all' && h.hw ? '' : '<p class="empty">В этом разделе пусто</p>')}${filter === 'all' ? candyCell(h) : ''}${freeCells(h, filter === 'all' && cls === 'all')}</div>`
          : h.hw ? `<p class="empty">${word('empty', 'Сумка пуста. Вещи добываются в Походе и покупаются в городе.')}</p><div class="grid">${candyCell(h)}${freeCells(h, true)}</div>`
          : `<p class="empty">${word('empty', 'Сумка пуста. Вещи добываются в Походе и покупаются в городе.')}</p>`}
      </section>
      <aside class="panel detail${sheet ? ' open' : ''}" aria-label="Вещь" ${cur ? '' : 'data-none'}>${cur ? detailHtml(cur, h) : `<p class="empty">${word('none', 'Выбери вещь в сумке или на герое')}</p>`}</aside>
      <div class="scrim${sheet ? ' open' : ''}" data-close></div>
    </div>
    <p class="foot">Детали облика покупаются в Шатре города за монеты, надеть купленное можно в «Облике» · обновлено ${ME.synced ? new Date(ME.synced).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '—'}</p>`;

    if (i2) { const ph = el.querySelector('[data-inv2]'); if (ph) ph.replaceWith(inv2Host(h, selUid)); const pd = el.querySelector('[data-inv2-doll]'); if (pd && INV2) pd.replaceWith(INV2.dollEl); } else inv2Drop();
    el.querySelectorAll('[data-f]').forEach((b) => b.onclick = () => { filter = b.dataset.f; renderHero(); });
    el.querySelectorAll('select[data-cls]').forEach((b) => b.onchange = () => { cls = /^[a-z]{2,20}$/.test(b.value) ? b.value : 'all'; try { localStorage.setItem('lgCls', cls); } catch {} renderHero(); });
    el.querySelectorAll('[data-empty]').forEach((b) => b.onclick = () => { filter = b.dataset.empty; sel = null; sheet = false; renderHero(); const g = $('.bag', el); if (g && !mqWide.matches) g.scrollIntoView({ behavior: 'smooth', block: 'start' }); });

    el.querySelectorAll('[data-sel]').forEach((b) => b.onclick = () => { if (mqWide.matches && cur && cur.uids.includes(b.dataset.sel)) { sel = null; renderHero(); return; } sel = b.dataset.sel; sheet = !mqWide.matches; renderHero(); if (sheet) { const c = $('.detail [data-close]', el); if (c) c.focus(); } });
    el.querySelectorAll('[data-close]').forEach((b) => b.onclick = closeDetail);
    el.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => goView(b.dataset.view));
    fitName($('.plate .nm', el));
    if (lc) lcBind(el);
    el.querySelectorAll('[data-gosoc]').forEach((b) => b.onclick = () => { lgv = 'soc'; tab('legion'); window.scrollTo(0, 0); });
    el.querySelectorAll('[data-kit]').forEach((b) => b.onclick = () => { kit = b.dataset.kit === 'peace' ? 'peace' : 'battle'; try { localStorage.setItem('lgKit', kit); } catch {} renderHero(); });
    el.querySelectorAll('[data-wear]').forEach((b) => b.onclick = () => { const v = b.dataset.v; let val = null; try { val = JSON.parse(v); } catch {} act('/api/wear', { field: b.dataset.wear, value: val }, 'Облик изменён', b); });
    calm(el); auraLive(el.querySelector('.stage .fig'), true);
    if (guSt >= 0 && el.scrollTop !== guSt) el.scrollTop = guSt;
    if (colSt) ['vitals', 'stage', 'bag'].forEach((k, i) => { const c = colSt[i] && $(`:scope > .hero-grid > .${k}`, el); if (c && c.scrollTop !== colSt[i]) c.scrollTop = colSt[i]; });
    heroDetPlace(el, cur);
    if (colSt) requestAnimationFrame(() => { if (el.isConnected) heroDetPlace(el, cur); });
    el.querySelectorAll('[data-on]').forEach((b) => b.onclick = () => act('/api/equip', { uid: b.dataset.on }, word('on', 'Надето'), b));
    el.querySelectorAll('[data-off]').forEach((b) => b.onclick = () => act('/api/unequip', { slot: b.dataset.off }, word('off', 'Снято'), b));
    el.querySelectorAll('[data-use]').forEach((b) => b.onclick = () => { const it = TIPS[b.dataset.use]; act('/api/use', { uid: b.dataset.use }, it && eatVerb(it) === 'Выпить' ? 'Выпито' : 'Съедено', b); });
    el.querySelectorAll('[data-use]').forEach((b) => { if (b.disabled) b.title = 'Еда и зелья ещё не готовы'; });
    el.querySelectorAll('[data-seal]').forEach((b) => b.onclick = () => sealPick(b.dataset.seal));

    el.querySelectorAll('[data-trash]').forEach((b) => b.onclick = () => trashFor(b.dataset.trash, b));

    el.querySelectorAll('[data-bagsort]').forEach((b) => b.onclick = () => act('/api/stSort', { box: 'b' }, 'Сумка отсортирована', b));
    if (ordOk(h)) { const g = $('.bag .grid', el); if (g) g.onkeydown = (e) => {
      if (!e.altKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      const c = e.target.closest('.cell[data-sel]'); if (!c) return; e.preventDefault();
      const cells = $$('.bag .grid .cell[data-sel]', el), i = cells.indexOf(c), j = i + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1);
      if (i < 0 || j < 0 || j >= cells.length) return;
      ordSave(ordMove(h, c.dataset.sel, cells[j].dataset.sel), c.dataset.sel);
    }; }

    el.oncontextmenu = (e) => {
      const t = e.target.closest('[data-sel]'); if (!t || !el.contains(t)) return;
      const it = TIPS[t.dataset.sel]; if (!it) return;
      e.preventDefault(); ctxMenu(e.clientX, e.clientY, it, h, trashMore(h));
    };
  }
  


  const coarse = () => SU.is('touch');

  const ordOk = (h) => !!(h && h.sg && !h.ghost && !h.busy);
  function dragHint(h) {
    if (ordOk(h)) return coarse() ? 'удерживай вещь и тяни: на героя - надеть, на другую ячейку - поменять порядок' : 'тяни вещь: на героя - надеть, на другую ячейку - порядок (Alt+стрелки)';
    return coarse() ? 'удерживай вещь, чтобы перетащить на героя' : 'вещи можно перетаскивать на героя и обратно';
  }

  function ordMove(h, from, to) {
    const cs = bagList(h), i = cs.findIndex((c) => c.uids.includes(from)), j = cs.findIndex((c) => c.uids.includes(to));
    if (i < 0 || j < 0 || i === j) return null;
    const [c] = cs.splice(i, 1); cs.splice(j, 0, c);
    return cs.map((x) => x.uids[0]);
  }
  async function ordSave(uids, focusUid) {
    if (!uids) return;
    await act('/api/stOrder', { uids }, 'Порядок сохранён');
    if (focusUid) { const b = document.querySelector(`#tab-hero .bag [data-sel="${CSS.escape(focusUid)}"]`); if (b) b.focus(); }
  }

  let lastXY = [0, 0], scrollRaf = 0;
  function autoScroll() {
    scrollRaf = 0; if (!DR.active) return;
    const [x, y] = lastXY, H = window.innerHeight, zone = Math.min(90, H * 0.15);
    const v = y < zone ? -Math.ceil((zone - y) / 4) : y > H - zone ? Math.ceil((y - (H - zone)) / 4) : 0;
    if (v) { window.scrollBy(0, v); dragMove(x, y); }
    scrollRaf = requestAnimationFrame(autoScroll);
  }
  const DR = { src: null, mode: null, slot: '', uid: '', x0: 0, y0: 0, id: null, timer: 0, ghost: null, over: null, active: false, justDragged: false };
  function dragReset() {
    clearTimeout(DR.timer); if (scrollRaf) { cancelAnimationFrame(scrollRaf); scrollRaf = 0; }
    if (DR.ghost) DR.ghost.remove();
    $$('.drop-ok, .drop-no, .drop-hover, .dragging, .ord-on').forEach((e) => e.classList.remove('drop-ok', 'drop-no', 'drop-hover', 'dragging', 'ord-on'));
    document.documentElement.classList.remove('is-dragging');
    Object.assign(DR, { src: null, mode: null, slot: '', uid: '', id: null, timer: 0, ghost: null, over: null, active: false });
  }
  function dragStart(x, y) {
    if (busy || !DR.src) return dragReset();
    DR.active = true;
    document.documentElement.classList.add('is-dragging');
    DR.src.classList.add('dragging');
    const g = document.createElement('div'); g.className = 'drag-ghost'; g.dataset.r = DR.src.dataset.r || 'common';
    const a = DR.src.querySelector('.art'); g.innerHTML = a ? a.outerHTML : '';
    document.body.appendChild(g); DR.ghost = g; dragMove(x, y);

    if (DR.mode === 'on') $$('#tab-hero .slot').forEach((sl) => sl.classList.add(sl.dataset.slot === DR.slot ? 'drop-ok' : 'drop-no'));
    else if (DR.mode !== 'mv') { const b = $('#tab-hero .bag'); if (b) b.classList.add('drop-ok'); }
    if (DR.mode !== 'off' && ordOk(ME && ME.hero)) { const g = $('#tab-hero .bag .grid'); if (g) g.classList.add('ord-on'); }
    if (navigator.vibrate && coarse()) try { navigator.vibrate(12); } catch {}
  }
  function targetAt(x, y) {
    const e = document.elementFromPoint(x, y); if (!e) return null;
    if (DR.mode !== 'off' && ordOk(ME && ME.hero)) { const c = e.closest('#tab-hero .bag .grid .cell[data-sel]'); if (c && c !== DR.src) return c; if (DR.mode === 'mv') return null; }
    if (DR.mode === 'on') { const sl = e.closest('#tab-hero .slot'); return sl && sl.dataset.slot === DR.slot ? sl : null; }
    return e.closest('#tab-hero .bag');
  }
  function dragMove(x, y) {
    lastXY = [x, y]; if (DR.active && !scrollRaf) scrollRaf = requestAnimationFrame(autoScroll);
    if (DR.ghost) DR.ghost.style.transform = `translate(${x - 36}px, ${y - 36}px)`;
    const t = targetAt(x, y);
    if (t !== DR.over) { if (DR.over) DR.over.classList.remove('drop-hover'); if (t) t.classList.add('drop-hover'); DR.over = t; }
  }
  function dragDrop() {
    const t = DR.over, mode = DR.mode, uid = DR.uid, slot = DR.slot;
    DR.justDragged = true; setTimeout(() => { DR.justDragged = false; }, 0);
    dragReset();
    if (!t) return;
    if (t.matches('.cell[data-sel]')) { ordSave(ordMove(ME.hero, uid, t.dataset.sel), uid); return; }
    if (mode === 'on') act('/api/equip', { uid }, word('on', 'Надето'));
    else act('/api/unequip', { slot }, word('off', 'Снято'));
  }
  const heroTab = $('#tab-hero');
  heroTab.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || DR.src) return;
    const src = e.target.closest('[data-drag]'); if (!src) return;
    Object.assign(DR, { src, mode: src.dataset.drag, slot: src.dataset.dslot, uid: src.dataset.sel, x0: e.clientX, y0: e.clientY, id: e.pointerId });
    if (e.pointerType === 'touch') DR.timer = setTimeout(() => { if (DR.src) dragStart(DR.x0, DR.y0); }, 280);
  });
  window.addEventListener('pointermove', (e) => {
    if (!DR.src || e.pointerId !== DR.id) return;
    if (!DR.active) {
      const moved = Math.hypot(e.clientX - DR.x0, e.clientY - DR.y0);
      if (e.pointerType === 'touch') { if (moved > 10) dragReset(); return; }
      if (moved > 6) dragStart(e.clientX, e.clientY); else return;
    }
    e.preventDefault(); dragMove(e.clientX, e.clientY);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => { if (DR.active) e.preventDefault(); }, { passive: false });
  window.addEventListener('pointerup', (e) => { if (!DR.src || e.pointerId !== DR.id) return; if (DR.active) dragDrop(); else dragReset(); });
  window.addEventListener('pointercancel', () => { if (DR.src && !DR.active) dragReset(); else if (DR.active) dragReset(); });
  heroTab.addEventListener('contextmenu', (e) => { if (DR.src) e.preventDefault(); });

  heroTab.addEventListener('click', (e) => { if (DR.justDragged) { e.stopPropagation(); e.preventDefault(); } }, true);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && DR.active) dragReset(); });

   
  const tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); tip.id = 'lg-tip'; tip.hidden = true;
  document.body.appendChild(tip);
  let tipFor = null;
  function tipHtml(it, h) {
    const dv = deltas(it, h), eff = effText(it);
    return `<div class="t-h"><span class="t-n" data-r="${esc(it.rarity)}">${esc(it.name)}</span>${it.qty ? `<span class="muted">${esc(oreQty(it.q))}</span>` : it.n > 1 ? `<span class="muted">×${it.n}</span>` : ''}</div>
      <div class="t-s"><span class="rar" data-r="${esc(it.rarity)}">${RAR[it.rarity] || ''}</span><span class="muted">${SLOT[it.slot] || ''}</span>${it.on ? `<span class="on">${ico('check')}надето</span>` : ''}</div>
      ${dv.rows.length ? `<ul class="t-st">${dv.rows.map((r) => `<li${XST[r.k] ? ' class="xr"' : ''}>${ico(r.k)}<span>${esc(stLabel(r.k))}</span><b>${stNum(r.k, r.v)}</b>${dv.c ? (r.dv ? `<em class="${r.dv > 0 ? 'up' : 'dn'}">${r.dv > 0 ? '+' : '−'}${String(Math.abs(r.dv)).replace('.', ',')}</em>` : '<em class="eq">=</em>') : '<em></em>'}</li>`).join('')}</ul>` : ''}
      ${eff ? `<p class="t-eff">${esc(eff[0].toUpperCase() + eff.slice(1))}</p>` : ''}${auraLine(it, 't-au')}
      <div class="d-q">${window.LG_LORE ? LG_LORE.html(it, false) : it.desc ? `<p class="t-desc">${esc(it.desc)}</p>` : ''}${dv.c ? `<p class="t-cmp">Сравнение с надетым: ${esc(dv.c.name)}</p>` : ''}${it.dur != null ? `<p class="t-dur${lowD(it) ? ' br' : ''}">${lowD(it) ? '⚠ ' + LOWT(it.dur) : `Прочность ${it.dur}% — почини у кузнеца`}</p>` : ''}</div>`;
  }

  const ST_HELP = {
    hp: ['Здоровье', 'Сколько урона герой выдержит. На нуле герой падает и становится призраком.'],
    atk: ['Физический урон', 'Сила ударов оружием: «удар», «выстрел». Главное для легионеров и лучников.'],
    mag: ['Магический урон', 'Сила заклинаний («магия») и лечения жреца. Главное для магов и жрецов.'],
    def: ['Броня', 'Уменьшает урон, который герой получает в боях и ловушках.'],
  };

  const XS_HELP = {
    def: ['Броня', 'Режет ФИЗИЧЕСКИЕ удары: когти, клинки, стрелы, камни ловушек. В обычном бою и в ловушке каждая единица снимает 0,5 урона с удара (но не меньше 1), в бою с боссом — 0,3% (не больше 15%). От магии броня не спасает — для неё есть «Сопротивление».'],
    crit: ['Шанс крита', 'Как часто удар (и лечение) получается критическим. Основа у всех — 8%, прибавляют вещи и навыки; больше 50% не бывает. Единица на кубике — по-прежнему промах.'],
    critDmg: ['Сила крита', 'Во сколько раз критический удар сильнее обычного. Основа — ×1,5; вещи и навыки добавляют («+10%» — это +0,1 к множителю). Потолок — ×3.'],
    dodge: ['Уклонение', 'Шанс полностью избежать физического удара врага или босса. От магии не увернуться. От ловушки — вдвое меньше. Основа — 0%, потолок — 35%.'],
    pierce: ['Пробивание', 'Сколько брони врага твои удары не замечают (мечом, луком и магией). По боссу броня не считается, зато каждые 10% пробивания — +1% урона. Потолок — 75%.'],
    healPow: ['Сила лечения', 'Насколько сильнее твоё лечение: «лечить», «сияние», «оберег». Главное для жрецов. Потолок — +100%.'],
    luck: ['Удача', 'Немного больше монет из добычи (боёв, ловушек, сокровищниц, боссов): +0,2% за единицу, до +20%. И шанс, что вещь из добычи окажется на ступень лучше: 0,15% за единицу, до 15%. А ещё промах (единица на кубике) перебрасывается с шансом 0,2% за единицу — при удаче 100 промахов не 5%, а около 4%.'],
    resist: ['Сопротивление', 'Режет МАГИЧЕСКИЙ урон: заклинания, яд, проклятия, огонь, лёд и другие стихии — так же, как броня режет физический (0,5 урона за единицу, у босса — 0,3%, до 15%). От магии нельзя увернуться — её можно только выдержать. Часть сопротивления у героя своя и растёт с уровнем; всё, что сверх неё, ещё и даёт шанс не заметить яд и тину (2% за единицу, до 50%).'],
  };


  const LUCK_PVP = ['Удача', 'На Арене и в PvP решает, кто ходит раньше: первым ходит герой с наибольшей удачей, затем следующий и т. д. (при равной удаче - жребий боя). Растёт с уровнем героя: у танков +0,2 за уровень, у лекарей +0,3, у бойцов урона +0,4 (по оружию в руках). Больше всего удачи даёт амулет, немного - оружие. На добычу и промахи не влияет.'];
  function statTip(k) {
    const th = TIPHERO || (ME && ME.hero), xs = th && th.xs, h = (k === 'luck' && xs && xs.luckPvp) ? LUCK_PVP : ((xs && XS_HELP[k]) || ST_HELP[k]); if (!h) return ''; const nm = stLabel(k);
    const lvl = k === 'luck' && xs && xs.luckPvp && xs.luckLvl != null ? `<p class="t-cap">Из них за уровень: ${String(Math.round(+xs.luckLvl * 10) / 10).replace('.', ',')}</p>` : '';
    const over = xs && xs[k + 'Over'] != null ? `<p class="t-cap">Набрано ${String(xs[k + 'Over']).replace('.', ',')}${XPCT[k] ? '%' : ''} — сверх потолка не считается</p>` : '';
    return `<div class="t-h"><span class="t-n">${esc(nm)}</span></div>${nm !== h[0] ? `<div class="t-s"><span class="muted">${esc(h[0])}</span></div>` : ''}<p class="t-desc">${esc(h[1])}</p>${lvl}${over}`;
  }


  const CRAFTS = [['mine', 'Горное дело', 'Шахта: камень, руда, кристаллы'], ['wood', 'Лесное дело', 'Лесопилка: дерево, смола'], ['farm', 'Земледелие', 'Поля и пастбища: зерно, лён, шерсть'],
    ['herb', 'Травничество', 'Топи: травы, грибы, торф'], ['fish', 'Рыболовство', 'Море и полыньи: рыба, соль, жемчуг'], ['dig', 'Раскопки', 'Дюны и руины: глина, древности']];
  const CRAFT_MAX = 20;
  let xTab = 'fight'; try { if (localStorage.getItem('lgXTab') === 'craft') xTab = 'craft'; } catch {}
  function craftHtml(h) {
    const cr = (h && h.crafts) || {};
    return `<ul class="crafts">${CRAFTS.map(([k, name, what]) => {

      const c = cr[k] || {}, mx = +c.max >= 1 && +c.max <= CRAFT_MAX ? +c.max : CRAFT_MAX, lv = Math.max(1, Math.min(mx, +c.lv || 1)), xp = Math.max(0, +c.xp || 0), need = Math.max(1, +c.need || 100), pct = lv >= mx ? 100 : Math.min(100, xp / need * 100);
      return `<li class="stat craft" title="${esc(what)}"><div class="craft-t"><b>${esc(name)}</b><span class="craft-lv">${lv >= mx ? 'мастер' : `ур. ${lv}`}</span></div><div class="bar xp craft-bar" role="progressbar" aria-label="${esc(name)}: опыт до следующего уровня" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct.toFixed(1)}%"></i></div></li>`;
    }).join('')}</ul><p class="craft-n muted">Опыт ремесла даёт работа в промысле городов. Каждый уровень — +2% к скорости работы.</p>`;
  }
  function xsHtml(x, h) {
    const v = (k) => (k === 'critDmg' ? '×' + String(x.critX || 1.5).replace('.', ',') : String(x[k] ?? 0).replace('.', ',') + (XPCT[k] ? '%' : ''));
    const cell = (k) => `<div class="stat x${x[k + 'Over'] != null ? ' capped' : ''}" data-k="${k}" data-stat="${k}" tabindex="0">${ico(k)}<dt>${esc(stLabel(k))}</dt><dd>${v(k)}</dd></div>`;


    const tab = x ? xTab : 'craft';
    const tb = (id, label) => `<button type="button" class="xst-t" data-xtab="${id}" aria-selected="${tab === id}" role="tab">${label}</button>`;
    return `<div class="xst"><div class="xst-h xst-seg" role="tablist" aria-label="Характеристики и ремёсла">${x ? tb('fight', 'Бой') : ''}${tb('craft', 'Ремёсла')}</div>`
      + (tab === 'craft' ? craftHtml(h) : `<dl class="stats xstats">${Object.keys(XST).map(cell).join('')}</dl>`) + `</div>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-xtab]'); if (!b || xTab === b.dataset.xtab) return;
    xTab = b.dataset.xtab; try { localStorage.setItem('lgXTab', xTab); } catch {}
    const box = b.closest('.xst'), h = (TIPHERO || (ME && ME.hero)); if (!box || !h) return;
    box.outerHTML = xsHtml(h.xs || null, h);
  });
  function tipShow(el) {
    tip.classList.remove('card', 'scroll');
    if (el.dataset.stat) { const html = statTip(el.dataset.stat); if (!html || DR.active) return tipHide(); tipFor = el; tip.innerHTML = html; tip.hidden = false; tip.dataset.r = 'common'; return tipPlace(el); }
    if (el.dataset.candy != null) return candyTip(el, +el.dataset.candy || 0);
    const it = TIPS[el.dataset.sel]; if (!it || !TIPHERO || DR.active) return tipHide();
    tipFor = el; tip.innerHTML = tipHtml(it, TIPHERO); tip.hidden = false; tip.dataset.r = it.rarity || 'common';
    tipPlace(el);
  }
  function tipPlace(el) {
    el.setAttribute('aria-describedby', 'lg-tip');
    tip.classList.toggle('over', !!el.closest('.cy-room, .tr-win'));
    tip.style.maxHeight = '';
    const r = el.getBoundingClientRect(), tw = tip.offsetWidth, m = 10, W = window.innerWidth, H = window.innerHeight;


    const obEl = document.querySelector('.cy-icard.on.pin, .cy-bpop.on'), ob = obEl && obEl.getClientRects().length ? obEl.getBoundingClientRect() : null;
    const top0 = ob && ob.bottom <= r.top ? ob.bottom + m : 8;
    let th = tip.offsetHeight;
    let x = r.right + m; if (x + tw > W - 8) x = r.left - tw - m; if (x < 8) x = Math.max(8, Math.min(W - tw - 8, r.left + r.width / 2 - tw / 2));
    let y = r.top; if (x === r.right + m || x === r.left - tw - m) { if (y + th > H - 8) y = H - th - 8; }
    else {




      const up = r.top - m - top0, dn = H - r.bottom - m - 8, up2 = ob && ob.bottom <= r.top ? ob.top - m - 8 : -1;
      if (th <= up) y = r.top - th - m; else if (th <= dn) y = r.bottom + m; else if (th <= up2) y = ob.top - th - m;
      else {
        const best = Math.max(up, dn, up2);
        th = Math.max(Math.min(120, H - 16), best); tip.style.maxHeight = th + 'px';
        y = best === dn ? r.bottom + m : best === up ? r.top - th - m : ob.top - th - m;
      }
    }
    y = Math.max(8, y);
    if (ob && x < ob.right && x + tw > ob.left && y < ob.bottom && y + th > ob.top && ob.bottom + m + th <= H - 8) y = ob.bottom + m;

    if (th > H - 16) { th = H - 16; tip.style.maxHeight = th + 'px'; }
    if (y + th > H - 8) y = Math.max(8, H - 8 - th);
    tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }
  function tipHide() { if (tipFor) tipFor.removeAttribute('aria-describedby'); tipFor = null; tip.hidden = true; tip.classList.remove('card', 'scroll'); }

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !tipFor || tip.hidden || !tip.classList.contains('card')) return;
    if (!tipFor.isConnected || !tipFor.getClientRects().length || !(tipFor.matches(':hover') || tip.matches(':hover'))) tipHide();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden && tipFor) tipHide(); });

  document.addEventListener('pointerdown', (e) => { if (tipFor && !tip.hidden && tip.classList.contains('card') && !tipFor.contains(e.target) && !tip.contains(e.target)) tipHide(); }, { capture: true, passive: true });

  function cardTip(el, it, h, o) {
    if (!el || !it || !h || DR.active) return tipHide();


    if (!el.isConnected || !el.getClientRects().length || el.closest('[hidden]')) return tipHide();
    if (tipFor && tipFor !== el) tipFor.removeAttribute('aria-describedby');
    tipFor = el; tip.classList.add('card'); tip.dataset.r = it.rarity || 'common';
    tip.innerHTML = `<div class="t-h"><span class="t-n" data-r="${esc(it.rarity)}">${esc(it.name)}</span>${it.qty ? `<span class="muted">${esc(oreQty(it.q))}</span>` : it.n > 1 ? `<span class="muted">×${it.n}</span>` : ''}</div>
      <div class="t-s"><span class="rar" data-r="${esc(it.rarity)}">${RAR[it.rarity] || ''}</span><span class="muted">${SLOT[it.slot] || ''}</span>${it.on ? `<span class="on">${ico('check')}надето</span>` : ''}</div>${itemBody(it, h, { dur: true, ...(o || {}), tip: true })}`;
    tip.hidden = false; tip.scrollTop = 0; tipPlace(el);
    tip.classList.toggle('scroll', tip.scrollHeight > tip.clientHeight + 1);
  }



  let scrollAt = -1e9, overT = 0, scrEl = null, scrT = 0;
  const scrOff = () => { if (scrEl) scrEl.classList.remove('hw-scr'); scrEl = null; };
  const scrMark = (e) => {
    scrollAt = Date.now();
    const p = e.target && e.target.closest ? e.target.closest('#tab-hero.gu-win > .hero-grid > .panel') : null; if (!p) return;
    if (scrEl !== p) { scrOff(); scrEl = p; p.classList.add('hw-scr'); }
    clearTimeout(scrT); scrT = setTimeout(scrOff, 160);
  };
  for (const t of ['scroll', 'wheel']) document.addEventListener(t, scrMark, { capture: true, passive: true });
  const scrollHot = () => Date.now() - scrollAt < 160;

  function tipOn(root) {
    if (!root || root.dataset.tips) return; root.dataset.tips = '1';
    const SEL = '.cell[data-sel], .slot.full[data-sel], [data-stat], .cell[data-candy]';

    const over = (t) => { const el = t.closest(SEL); if (el && el !== tipFor) tipShow(el); };
    root.addEventListener('pointerover', (e) => { if (e.pointerType !== 'mouse') return; if (!scrollHot()) return over(e.target); if (tipFor) tipHide(); const t = e.target; clearTimeout(overT); overT = setTimeout(function chk() { if (scrollHot()) { overT = setTimeout(chk, 160); return; } if (t.isConnected && t.matches(':hover')) over(t); }, 160); });
    root.addEventListener('pointerout', (e) => { if (!tipFor) return; const to = e.relatedTarget; if (!to || !tipFor.contains(to)) tipHide(); });
    root.addEventListener('click', (e) => { const el = e.target.closest('[data-stat]'); if (el) { if (tipFor === el) tipHide(); else tipShow(el); } });


    root.addEventListener('click', (e) => { const el = e.target.closest('.cell[data-candy]'); if (!el) return; setTimeout(() => { const t = el.isConnected ? el : root.querySelector('.cell[data-candy]'); if (t) tipShow(t); }, 0); });
    root.addEventListener('focusin', (e) => { const el = e.target.closest(SEL); if (el && el.matches(':focus-visible')) tipShow(el); });
    root.addEventListener('focusout', tipHide);

    root.addEventListener('pointerdown', (e) => { if (e.target.closest && e.target.closest('.cell[data-candy]')) return; tipHide(); });
  }
  tipOn(heroTab);
  window.addEventListener('scroll', tipHide, { passive: true });

  function closeSheet() { if (!sheet) return; sheet = false; const d = $('.detail'), s = $('.scrim'); if (d) d.classList.remove('open'); if (s) s.classList.remove('open'); heroSheetHist(false); }

  function closeDetail() { if (!mqWide.matches) { const was = sheet; closeSheet(); return was; } if (sel) { sel = null; renderHero(); return true; } return false; }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !document.querySelector('.ctxm') && closeDetail()) e.preventDefault(); });


  function gearLine(it, h) {
    try {
      const PEN = GD.GEAR_PEN; if (!PEN[it.slot]) return '';

      const nb = betaOpen(h), whom = (f) => { const a = GD.classes().filter((c) => f(c) && (nb || !c.beta)).map((c) => c.gen); return a.length > 1 ? a.slice(0, -1).join(', ') + ' и ' + a[a.length - 1] : a[0] || ''; };
      const foc = it.slot === 'shield' && it.gear === 'cloth';
      const g = it.slot === 'shield' && !foc ? 'heavy' : it.gear || 'any', RU = { heavy: whom((c) => c.gear === 'heavy'), light: whom((c) => c.gear === 'light'), cloth: whom((c) => c.gear === 'cloth'), any: 'всех классов' };
      const want = GD.classGear(h.role);
      const bad = want && (it.slot === 'shield' && !foc ? !GD.shieldOk(h.role) : g !== 'any' && g !== want);
      const st = GD.mainStat(h.role) === 'mag' ? 'маг. урона' : 'физ. урона';
      return `<p class="d-gear${bad ? ' bad' : ''}">${foc ? `Вторая рука — для ${RU.cloth}` : it.slot === 'shield' ? `Щит — для ${whom((c) => c.shield)}` : `Снаряжение для ${RU[g] || RU.any}`}${bad ? `<br><b>Не для твоего класса: −${PEN[it.slot]}% ${st}${it.on ? '' : ', если надеть'}</b>` : ''}</p>`;
    } catch (e) { return ''; }
  }
  

  const REP0 = { ...GD.repair }, RARI = GD.RARITIES;
  const REP = () => ({ ...REP0, ...((ME && ME.ench && ME.ench.rep) || {}) });
  function repPrice(it) {
    if (!it || it.dur == null) return 0; const R = REP(), lost = 100 - Math.max(0, Math.min(100, +it.dur));
    return Math.max(Math.round(R.min), Math.round((R.base[Math.max(0, RARI.indexOf(it.rarity))] || 60) * (1 + (+it.en || 0) * R.enPct / 100) * lost / 100));
  }
  const lowD = (it) => !!it && it.dur != null && (it.low || +it.dur <= REP().low);
  const LOWT = (d) => `Прочность ${d}% — если дойдёт до 0, вещь исчезнет навсегда. Почини у кузнеца`;
  const durBadge = (it) => (it && it.dur != null ? `<span class="dur${lowD(it) ? ' br' : ''}" title="${lowD(it) ? LOWT(it.dur) : `Прочность ${it.dur}%`}">${lowD(it) ? '⚠ ' : ''}${it.dur}%</span>` : '');
  const durAria = (it) => (it && it.dur != null ? `, прочность ${it.dur}%${lowD(it) ? ' — может исчезнуть' : ''}` : '');
  const durLine = (it) => (it && it.dur != null ? `<p class="d-dur${lowD(it) ? ' br' : ''}">${lowD(it) ? `<b>⚠ ${LOWT(it.dur)}</b>` : `Повреждена: прочность <b>${it.dur}%</b> — работает полностью. Дойдёт до 0 при гибели — исчезнет навсегда`}</p>` : '');

  const REP_WHERE = 'Починить можно в кузне у наковальни';
  function repBtn(it) {
    if (!it.wearable || it.dur == null || REP().on === false) return '';
    return `<p class="note use rep-where"><span>${REP_WHERE}</span></p>`;
  }

  function repAllHtml(h, forge) {
    const bad = h.items.filter((x) => x.wearable && x.dur != null); if (!bad.length || REP().on === false) return '';
    const br = bad.filter(lowD).length, sum = bad.reduce((a, x) => a + repPrice(x), 0);
    return `<div class="repl${br ? ' br' : ''}" role="note"><span>${br ? `<b>⚠ Почти сломано (≤${REP().low}%): ${br} — дойдёт до 0, исчезнет навсегда</b>` : ''}${br && bad.length > br ? ' · ' : ''}${bad.length > br ? `повреждено: ${bad.length - br}` : ''}</span>${forge ? `<button type="button" class="btn ghost" data-repall${h.busy || +h.debt > 0 || (+h.money || 0) < Math.min(...bad.map(repPrice)) ? ' disabled' : ''}>${ico('hammer')}Починить всё — ${money(sum)}</button>` : `<span class="rep-where">${ico('hammer')}${REP_WHERE}</span>`}</div>`;
  }

  function repBlockHtml(h) {
    const bad = h.items.filter((x) => x.wearable && x.dur != null).sort((a, b) => (b.on - a.on) || (a.dur - b.dur));
    if (!bad.length || REP().on === false) return '<p class="note">Кузнец чинит снаряжение, испорченное при гибели. Сейчас у тебя всё целое.</p>';
    return `<div class="rep-box"><h3 class="h3">${ico('hammer')}Починка</h3>${repAllHtml(h, true)}<ul class="rep-list">${bad.map((it) => `<li><span data-r="${esc(it.rarity)}">${esc(it.name)}</span><em class="${lowD(it) ? 'br' : ''}">${lowD(it) ? '⚠ ' : ''}${it.dur}%</em><button type="button" class="btn ghost" data-repair="${esc(it.uid)}"${h.busy || (+h.money || 0) < repPrice(it) ? ' disabled' : ''}>${money(repPrice(it))}</button></li>`).join('')}</ul></div>`;
  }
  function repBind(el) {
    el.querySelectorAll('[data-repair]').forEach((b) => b.onclick = () => act('/api/repair', { uid: b.dataset.repair }, 'Кузнец починил', b));
    el.querySelectorAll('[data-repall]').forEach((b) => b.onclick = () => act('/api/repair', { all: true }, 'Кузнец починил', b));
  }
  





  function itemBody(it, h, o = {}) {
    const dv = deltas(it, h), eff = effText(it);
    const roles = (ME && ME.roles) || {};
    const roleChange = it.slot === 'weapon' && it.role && !it.on && it.role !== h.role ? roleOf(it.role, roles[it.role]) : null;
    const b = it.en > 0 ? (o.bonus || EN().bonus)[Math.min(15, it.en)] || 0 : 0, bx = Math.round(b / 4 * 10) / 10;
    const P = {
      st: dv.rows.length ? `<ul class="d-st">${dv.rows.map((r) => `<li${XST[r.k] ? ' class="xr"' : ''} data-stat="${r.k}" tabindex="0">${ico(r.k)}<span>${esc(stLabel(r.k))}</span><b>${stNum(r.k, r.v)}</b>${dv.c && r.dv ? `<em class="${r.dv > 0 ? 'up' : 'dn'}">${r.dv > 0 ? '+' : '−'}${String(Math.abs(r.dv)).replace('.', ',')}</em>` : dv.c ? '<em class="eq">=</em>' : ''}</li>`).join('')}</ul>` : '',
      eff: eff ? `<p class="d-eff">${esc(eff[0].toUpperCase() + eff.slice(1))}</p>` : '',
      lore: window.LG_LORE ? LG_LORE.html(it, true, !!o.tip) : it.desc ? `<p class="d-desc">${esc(it.desc)}</p>` : '',
      au: auraLine(it, 'd-au'),
      cmp: dv.c ? `<p class="d-cmp">Сравнение с надетым: <b>${esc(dv.c.name)}</b>${o.verdict ? (dv.score > 0.01 ? ' — в целом <b class="up">лучше</b>' : dv.score < -0.01 ? ' — в целом <b class="dn">слабее</b>' : '') : ''}</p>` : '',
      gear: gearLine(it, h),
      role: (roleChange ? `<p class="d-role">С этим оружием станешь: <b>${esc(roleChange)}</b></p>` : o.cls && it.slot === 'weapon' && it.role ? `<p class="d-role">Оружие класса: <b>${esc(roleOf(it.role, roles[it.role]))}</b></p>` : '')
        + (it.slot !== 'weapon' && it.role ? `<p class="d-role">Вещь класса <b>${esc(roleOf(it.role, roles[it.role]))}</b>: бонус к навыкам — только герою этого класса${it.role === h.role ? ' (твой класс)' : ''}</p>` : ''),

      en: it.en > 0 ? (() => { const xs = dv.rows.filter((r) => XST[r.k] && r.v > 0).map((r) => stLabel(r.k).toLowerCase()); return `<p class="d-en">${ico('hammer')}Заточка +${it.en}: характеристики вещи +${b}%${xs.length ? `, ${esc(xs.join(', '))} +${String(bx).replace('.', ',')}%` : ''}</p>`; })() : '',
      pts: (it.pts ? '<p class="d-pts">Куплено за баллы канала — лавка похода такую вещь не берёт</p>' : '')
        + (it.bound ? '<p class="d-pts d-bound">Привязана: не передаётся - обменять, передать или продать другому игроку нельзя</p>' : ''),
      dur: `${durLine(it)}` + (it.dur == null && o.dur && (it.wearable || SLOTS.includes(it.slot)) ? '<p class="d-dur ok">Прочность 100% — целая</p>' : ''),
    };


    if (o.tip) { const q = P.lore + P.cmp + P.gear + P.role + P.pts + P.dur; return P.st + P.eff + P.au + P.en + (q ? `<div class="d-q">${q}</div>` : ''); }
    return [P.st, P.eff, P.lore, P.au, P.cmp, P.gear, P.role, P.en, P.pts, P.dur].join('');
  }
  function detailHtml(it, h) {
    const dv = deltas(it, h);
    const act = h.ghost ? `<p class="note">${ico('ghost')}Призрак не переодевается — дождись воскрешения.</p>`
      : it.wearable && h.busy ? `<p class="note busyn">⚔ ${BUSY_NOTE}.</p>`
      : it.id === 'metamorph_seal' && ME && ME.seal ? `<button type="button" class="btn primary wide" data-seal="${esc(it.uids[0])}">Применить печать</button><p class="note relicn">✦ Выбери стиль героя: печать сгорит, у героя будет свой стиль - смена стиля канала его не тронет.</p>`
      : it.relic || it.slot === 'relic' ? `<p class="note relicn">✦ Использовать пока нельзя — печать хранится в сумке.</p>`
      : it.mat === 'ore' ? `<p class="note use"><span>${esc(oreQty(it.q))} — добыто в шахте (100 осколков — 1 шт.). Продать — скупщику Грому в шахте: окно у прилавка. Хранить — на складе в «Городе».</span></p>`
      : it.slot === 'material' ? `<p class="note use"><span>Материал заточки. Точить - у наковальни в Кузне «Города» или на стриме в Кузне: <b class="cmd">точить 3 ${it.mat === 'seal' ? 'печать' : it.mat === 'star' ? 'звезда' : 'сфера'}</b>${it.mat === 'seal' ? `<br>Гарантирует успех до +${+it.seal || 5}. ${EN().craftN} печати ${+it.seal || 5} куются в печать ${(+it.seal || 5) + 1} — в окне заточки.` : ''}</span></p>`
      : edible(it) ? `<button type="button" class="btn primary wide" data-use="${esc(it.uids[0])}"${eatCd(it, h) ? ' disabled' : ''}>${eatVerb(it)}</button><p class="note use">` + `<span>${useCmd(it) ? `Или на стриме: <b class="cmd">${useCmd(it)}</b>` : ''}${eatCd(it, h) ? `<br><span class="eatcd-t">⏳ Еда и зелья будут готовы через <b data-eat="${cdUntil(it, h)}">${mmss(cdUntil(it, h))}</b></span>` : ''}</span></p>`
      : !it.wearable ? `<p class="note use"><span>${useCmd(it) ? `На стриме напиши в чат: <b class="cmd">${useCmd(it)}</b>` : 'Используется на стриме командой в чате.'}${eatCd(it, h) ? `<br><span class="eatcd-t">⏳ ${it.effect && it.effect.revive ? 'Свиток можно будет прочитать' : 'Еда и зелья будут готовы'} через <b data-eat="${cdUntil(it, h)}">${mmss(cdUntil(it, h))}</b></span>` : (it.slot === 'food' || it.slot === 'potion') ? '<br><span class="muted">Съел или выпил — вся еда и зелья ждут 3 минуты.</span>' : it.effect && it.effect.revive ? '<br><span class="muted">Свиток возрождения — не чаще раза в час.</span>' : ''}</span></p>`
      : it.on ? `<button type="button" class="btn ghost wide" data-off="${it.slot}">${word('take', 'Снять')}</button>`
      : `<button type="button" class="btn primary wide" data-on="${esc(it.uids[0])}">${dv.c ? 'Заменить' : word('wear', 'Надеть')}</button>`;
    return `<button type="button" class="x" data-close aria-label="Закрыть">${ico('x')}</button>
      <div class="d-art" data-r="${esc(it.rarity)}">${lgx(it)}${art(it)}</div>
      <div class="d-h"><span class="rar" data-r="${esc(it.rarity)}">${RAR[it.rarity] || ''}</span><span class="muted">${SLOT[it.slot] || ''}</span>${it.on ? `<span class="on">${ico('check')}надето</span>` : ''}${it.qty ? `<span class="muted">${esc(oreQty(it.q))}</span>` : it.n > 1 ? `<span class="muted">×${it.n}</span>` : ''}</div>
      <h2 class="d-n">${esc(it.name)}</h2>
      ${itemBody(it, h)}
      <div class="d-a">${act}${repBtn(it)}${canEnch(it) && !h.ghost && h.ef ? `<p class="note use fg-where"><span>${it.en >= EN().max ? 'Заточена до предела' : 'Точить - у наковальни в Кузне «Города»'}</span></p>` : ''}${trashOk(h) && !it.on && !trashWhyOf(it) ? `<button type="button" class="btn ghost wide trash-btn" data-trash="${esc(it.uids[0])}">🗑 Выбросить…</button>` : ''}</div>`;
  }


  const SKX = { api: (p, b) => api(p, b), act: (p, b, ok, btn, o) => act(p, b, ok, btn, o), esc, plural, money: (n, r) => money(n, r), roleOf: (id, fb) => roleOf(id, fb), rerender: () => { last = ''; renderHero(); } };


  const coins = () => part('coins');
  function money(n, ref) { return SU.money(n, ref, coins); }
  const moneyText = (n, ref) => SU.moneyText(n, ref, coins);

  const lackHtml = (price, have, cls = '') => SU.lack(price, have, cls, coins);

  const balHtml = (price, have, cls = '') => SU.bal(price, have, cls, coins);

  function left(t) { const ms = (+t || 0) - gnow(); if (!t) return 'скоро'; if (ms <= 0) return 'вот-вот…'; const d = Math.floor(ms / 864e5), hh = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4), sec = Math.floor((ms % 6e4) / 1e3), p = (x) => String(x).padStart(2, '0'); return (d ? d + ' д ' : '') + `${p(hh)}:${p(m)}:${p(sec)}`; }
  setInterval(() => { if (document.hidden) return; $$('.cd[data-until]').forEach((e) => { const t = left(+e.dataset.until); if (e.textContent !== t) e.textContent = t; if (+e.dataset.until && +e.dataset.until < gnow() - 15000 && !left.reload) { left.reload = true; last = ''; load().then(() => { left.reload = false; }); } }); }, 1000);

  function ctxClose() { const m = document.querySelector('.ctxm'); if (m) m.remove(); document.removeEventListener('pointerdown', ctxOut, true); window.removeEventListener('scroll', ctxClose, true); document.removeEventListener('keydown', ctxKey, true); }
  function ctxOut(e) { if (!e.target.closest('.ctxm')) ctxClose(); }
  function ctxKey(e) { if (e.key === 'Escape') ctxClose(); }
  function ctxMenu(x, y, it, h, more) {
    ctxClose();
    const uid = it.uids ? it.uids[0] : it.uid, rows = [], cur = it.slot ? equipped(h, it.slot) : null;
    if (h.ghost) rows.push({ t: 'Призрак — ничего нельзя', off: true });
    else if (it.wearable) {
      if (it.on) rows.push(h.busy ? { t: 'Снять — в бою нельзя', off: true } : { t: 'Снять', fn: () => act('/api/unequip', { slot: it.slot }, word('off', 'Снято')) });
      else rows.push(h.busy ? { t: (cur ? 'Заменить' : 'Надеть') + ' — в бою нельзя', off: true } : { t: cur ? `Заменить «${cur.name}»` : 'Надеть', main: true, fn: () => act('/api/equip', { uid }, word('on', 'Надето')) });
    } else if (edible(it)) rows.push(eatCd(it, h) ? { t: `${eatVerb(it)} — ещё не готово (${mmss(cdUntil(it, h))})`, off: true } : { t: eatVerb(it), main: true, fn: () => act('/api/use', { uid }, eatVerb(it) === 'Выпить' ? 'Выпито' : 'Съедено') });
    else if (it.effect && it.effect.revive) rows.push({ t: 'Свиток — командой на стриме', off: true });
    else if (it.id === 'metamorph_seal' && ME && ME.seal) rows.push(h.busy ? { t: 'Применить печать - в бою нельзя', off: true } : { t: 'Применить печать', main: true, fn: () => sealPick(uid) });
    else if (it.relic || it.slot === 'relic') rows.push({ t: 'Пока недоступно', off: true });

    if (canEnch(it) && !h.ghost && h.ef) rows.push({ t: 'Заточка - в Кузне «Города»', off: true });
    if (it.wearable && it.dur != null && REP().on !== false) rows.push({ t: 'Починить - в кузне у наковальни', off: true });
    if (more && more.discard && !it.on) { const why = GD.discardWhy ? GD.discardWhy(it) : ''; rows.push(why ? { t: 'Выбросить - ' + why, off: true } : { t: '🗑 Выбросить…', fn: () => more.discard(uid) }); }
    rows.push({ t: 'Подробнее', fn: () => { sel = uid; sheet = !mqWide.matches; renderHero(); } });
    const m = document.createElement('div'); m.className = 'ctxm'; m.setAttribute('role', 'menu');
    m.innerHTML = `<div class="ctxh">${esc(it.name)}</div>` + rows.map((r, i) => `<button type="button" role="menuitem" data-i="${i}"${r.off ? ' disabled' : ''} class="${r.main ? 'main' : ''}">${esc(r.t)}</button>`).join('');
    document.body.appendChild(m);
    const W0 = window.innerWidth, H0 = window.innerHeight, bw = m.offsetWidth, bh = m.offsetHeight;
    m.style.left = Math.max(8, Math.min(x, W0 - bw - 8)) + 'px'; m.style.top = Math.max(8, Math.min(y, H0 - bh - 8)) + 'px';
    m.querySelectorAll('button[data-i]').forEach((b) => b.onclick = () => { const r = rows[+b.dataset.i]; ctxClose(); if (r && r.fn) r.fn(); });
    const first = m.querySelector('button:not([disabled])'); if (first) first.focus();
    setTimeout(() => { document.addEventListener('pointerdown', ctxOut, true); window.addEventListener('scroll', ctxClose, true); document.addEventListener('keydown', ctxKey, true); }, 0);
  }


  async function act(p, body, ok, btn, o) {
    if (busy) return o && o.wait ? { ok: false, wait: 1, error: '' } : undefined; busy = true;
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Секунду…'; }
    const r = await api(p, body); busy = false;
    if (!r.ok && r.wait && o && o.wait) { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; } return { ok: false, wait: 1, error: r.error || '' }; }

    if (!r.ok) { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; } toast(r.error || 'Не получилось', true); return { ok: false, error: r.error || 'Не получилось' }; }

    if (p === '/api/use' && r.hero) { const was = TIPS[body.uid] || (ME.hero && ME.hero.items.find((x) => x.uid === body.uid)); const next = was && r.hero.items.find((x) => x.id === was.id && !x.on); sel = next ? next.uid : null; if (!next) sheet = false; }
    if (r.hero) ME.hero = r.hero;
    last = ''; renderHero(); if (ok) toast(ok);

    clearTimeout(act.pt); if (r.hero && r.hero.pending) act.pt = setTimeout(() => { if (ME && ME.hero && ME.hero.pending) toast('Сохранено — применится, когда игра стримера будет в сети'); }, 6000);    return { ok: true };
  }


  

  const heroWide = (el) => !!el && el.classList.contains('gu-win') && document.documentElement.classList.contains('gu-whero') && mqWide.matches;
  function heroDetPlace(el, cur) {
    heroSheetHist(sheet);
    const g = el && $(':scope > .hero-grid', el), d = g && $(':scope > .detail', g);
    if (!d) return;
    g.__hdCur = cur;
    if (!heroWide(el) || !cur || d.hasAttribute('data-none')) { ['--hd-x', '--hd-y', '--hd-h', '--hd-w'].forEach((k) => d.style.removeProperty(k)); return; }
    const uids = cur.uids || [cur.uid];
    const vis = (b) => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const a = $$('[data-ig], [data-sel]', g).find((b) => !d.contains(b) && uids.includes(b.dataset.ig || b.dataset.sel) && vis(b));
    d.style.removeProperty('--hd-w');
    const G = g.getBoundingClientRect(), gap = 12, H = G.height;
    let w = d.offsetWidth;
    d.style.setProperty('--hd-h', `${Math.max(160, H - 8)}px`);
    let h = Math.min(d.offsetHeight, H - 8);



    const bg = $(':scope > .bag', g), B = bg ? bg.getBoundingClientRect() : G, bl = B.left - G.left, br = B.right - G.left;
    let x, y;
    if (a) {
      const A = a.getBoundingClientRect(), left = A.left - G.left, right = A.right - G.left;
      y = A.top - G.top - 8;
      if (!bg || !bg.contains(a)) x = bl;
      else if (right + gap + w <= br) x = right + gap;
      else if (left - gap - w >= bl) x = left - gap - w;
      else if (Math.max(br - right - gap, left - gap - bl) >= 280) {
        const rw = br - right - gap, lw = left - gap - bl; w = Math.floor(Math.max(rw, lw)); d.style.setProperty('--hd-w', `${w}px`);
        x = rw >= lw ? right + gap : left - gap - w;
      } else {

        x = Math.max(bl, Math.min(br - w, left));
        const top = A.top - G.top, bot = A.bottom - G.top, dn = H - bot - gap, up = top - gap;
        if (dn >= h || (dn >= up && dn >= 160)) { y = bot + gap; if (h > dn) d.style.setProperty('--hd-h', `${Math.floor(dn)}px`); }
        else if (up >= 160) { if (h > up) d.style.setProperty('--hd-h', `${Math.floor(up)}px`); y = top - gap - Math.min(h, up); }
        else x = left - gap - w;
      }
    } else { x = br - w; y = 0; }
    h = d.offsetHeight;
    x = Math.max(0, Math.min(G.width - w, x));
    y = Math.max(0, Math.min(H - h, y));
    d.style.setProperty('--hd-x', `${Math.round(x)}px`); d.style.setProperty('--hd-y', `${Math.round(y)}px`);

    if (!g.__hdOn) {
      g.__hdOn = 1; let raf = 0;
      const again = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; if (g.isConnected) heroDetPlace(el, g.__hdCur); }); };
      for (const c of $$(':scope > .vitals, :scope > .stage, :scope > .bag', g)) c.addEventListener('scroll', again, { passive: true });
      if (!heroDetPlace.rs) { heroDetPlace.rs = 1; window.addEventListener('resize', () => { const t = $('#tab-hero'); if (t && heroWide(t)) { const gg = $(':scope > .hero-grid', t); if (gg && gg.__hdOn) heroDetPlace(t, gg.__hdCur); } }); }
    }
  }
  


  let hsH = 0;
  function heroSheetHist(on) {
    if (on && !hsH && !mqWide.matches) { try { history.pushState({ ...(history.state || {}), lgSheet: 1 }, ''); hsH = 1; } catch {   } }
    else if (!on && hsH) { hsH = 0; try { if (history.state && history.state.lgSheet) history.back(); } catch {   } }
  }
  window.addEventListener('popstate', () => { if (hsH && !(history.state && history.state.lgSheet)) { hsH = 0; closeSheet(); } });
  if (heroTab && window.MutationObserver) {
    let guw = heroTab.classList.contains('gu-win');
    new MutationObserver(() => { const w = heroTab.classList.contains('gu-win'); if (w === guw) return; guw = w; if (sheet && !mqWide.matches) { closeSheet(); sel = null; } }).observe(heroTab, { attributes: true, attributeFilter: ['class'] });
  }

  


  const ENCH0 = { on: true, ...GD.enchant };
  const EN = () => ({ ...ENCH0, ...((ME && ME.ench) || {}) });
  const canEnch = (it) => !!(it && it.wearable && (EN().slots || ENCH0.slots).includes(it.slot));
  const fmtPct = (x) => String(Math.round((+x || 0) * 10) / 10).replace('.', ',') + '%';
  const FG = { uid: null, way: 'plain', wait: null, sure: 0, res: null, el: null, back: null, gone: null, busyAt: 0, waitAt: 0, queued: false, nw: false };



  function fgSync() {
    const q = ME && Array.isArray(ME.fq) ? ME.fq : null; if (!q) return;
    if (FG.wait && !q.some((x) => x.id === FG.wait) && !shownRes.has(FG.wait) && Date.now() - FG.waitAt > 15000) {
      FG.wait = null; FG.queued = false; FG.res = { cls: 'err', t: 'Итог не дошёл до страницы - кузнец уже закончил: посмотри вещь в сумке' };
      try { if (window.LGCity && window.LGCity.forgeCancel) window.LGCity.forgeCancel(); } catch {}
    }
    if (!FG.wait && q.length) { FG.wait = q[0].id; FG.waitAt = Date.now(); }
    FG.queued = !!(FG.wait && q.some((x) => x.id === FG.wait && !x.s));
  }
  async function fgCancel() {
    const r = await api('/api/enchant', { cancel: 1 });
    if (r && Array.isArray(r.fq)) ME.fq = r.fq;
    if (r && r.ok) { FG.wait = null; FG.queued = false; FG.res = { cls: 'save', t: 'Заказ отменён - монеты и материалы не тронуты' }; try { if (window.LGCity && window.LGCity.forgeCancel) window.LGCity.forgeCancel(); } catch {} }
    else { FG.res = { cls: 'err', t: (r && r.error) || 'Не получилось' }; fgSync(); }
    fgRender();
  }
  function matsOf(h) {
    const m = { star: 0, sphere: 0, seals: {} };
    for (const it of (h && h.items) || []) { if (it.mat === 'star') m.star++; else if (it.mat === 'sphere') m.sphere++; else if (it.mat === 'seal' && it.seal) m.seals[it.seal] = (m.seals[it.seal] || 0) + 1; }
    return m;
  }

  function enchQuote(it, h, way) {
    const E = EN(), en = +it.en || 0, tg = en + 1, m = matsOf(h);
    const q = { en, tg, way, price: Math.max(E.priceMin || 0, (E.priceMins && E.priceMins[tg]) || 0, Math.round((+it.v || 0) * (E.price[tg] || 0) / 100)), chance: 0, fail: 'break', err: '' };
    if (en >= E.max) return { ...q, err: 'Вещь заточена до предела' };
    if (way === 'seal') {
      const own = Object.keys(m.seals).map(Number), lv = own.filter((n) => n >= tg && n >= E.sealMin).sort((a, b) => a - b)[0];
      if (!lv) return { ...q, chance: 100, fail: 'none', err: own.length ? `Нужна Печать Ауруса ${Math.max(tg, E.sealMin)} или старше` : 'Нет Печати Ауруса — она только выпадает (босс, данж)' };
      Object.assign(q, { seal: lv, chance: 100, fail: 'none' });
    } else {
      const star = way === 'star' || way === 'both', sph = way === 'sphere' || way === 'both';
      q.chance = Math.min(100, (E.chance[tg] || 0) + (star ? E.star : 0)); q.fail = sph ? 'down' : 'break';
      if (star && !m.star) q.err = 'Нет Счастливой звезды'; else if (sph && !m.sphere) q.err = 'Нет Сферы сохранения';
      else if (q.chance <= 0) q.err = `На +${tg} без звезды не заточить`;
    }
    if (!q.err && (+h.money || 0) < q.price) { q.err = 'Не хватает монет'; q.lack = 1; }
    return q;
  }
  const enchStatsN = (base, en, bonus) => { const b = en > 0 ? (bonus || EN().bonus)[Math.min(15, en)] || 0 : 0, o = {}; for (const [k, v] of Object.entries(base || {})) o[k] = b && v > 0 ? Math.round(v * (1 + (XST[k] ? b / 4 : b) / 100)) : v; return o; };

  const fgName = (it) => { const n = names().items, own = n && n[it.id] && n[it.id].name; return (own || it.baseName || it.srvName || String(it.name || '').replace(/ \+\d+$/, '')) + (it.en > 0 ? ' +' + it.en : ''); };



  function forgeOpen(uid, host, o) {
    if (!ME || !ME.hero || !host) return;
    const fresh = FG.uid !== uid;
    ctxClose(); FG.uid = uid; FG.res = null; FG.sure = 0; FG.gone = null;
    FG.nw = !!(o && o.way); if (FG.nw) FG.way = WAYS.some(([k]) => k === o.way) ? o.way : 'plain';
    FG.back = document.activeElement;
    if (FG.el && (FG.host || null) !== (host || null)) forgeClose();
    if (!FG.el) {
      FG.el = document.createElement('div'); FG.el.className = 'fg-wrap' + (host ? ' fg-in' : '');
      FG.el.addEventListener('click', fgClick);
      FG.el.addEventListener('change', (e) => { if (e.target && e.target.matches && e.target.matches('[data-fskip]')) animSkipSet(e.target.checked); });
      FG.host = host || null;
      (host || document.body).appendChild(FG.el);
      if (!host) document.addEventListener('keydown', fgKey);
    }


    if (host) {
      fgRender();
      if (fresh && document.documentElement.classList.contains('ph2')) { const f = FG.el.querySelector('[data-fgo]:not([disabled]), [data-way]'); if (f) { try { f.focus({ preventScroll: true }); } catch (e) {   } } }
      return;
    }
    fgRender();
    const f = FG.el.querySelector('[data-fgo]:not([disabled]), [data-way]'); if (f) f.focus();
  }
  function forgeClose() {
    if (!FG.el) return;

    FG.el.remove(); FG.el = null; FG.uid = null; FG.res = null; FG.sure = 0; FG.gone = null; FG.nw = false; FG.way = 'plain';
    const was = FG.host; FG.host = null; if (was) return;
    document.removeEventListener('keydown', fgKey);
    try { if (FG.back && document.contains(FG.back)) FG.back.focus(); } catch {}
  }
  function fgKey(e) {
    if (e.key === 'Escape') { e.stopPropagation(); forgeClose(); return; }
    if (e.key === 'Tab' && FG.el) {
      const f = $$('button:not([disabled]), summary', FG.el); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  }

  const WAYS = [['plain', 'Обычная'], ['star', 'Звезда'], ['sphere', 'Сфера'], ['seal', 'Печать']];

  const ANIK = 'lgAnvSkip';
  function animSkip() { try { return localStorage.getItem(ANIK) === '1'; } catch (e) { return false; } }
  function animSkipSet(on) { try { localStorage.setItem(ANIK, on ? '1' : '0'); } catch (e) { console.warn('[кузня] галочка не запомнилась', e); } }

  function forgeWay(way) {
    const w = WAYS.some(([k]) => k === way) ? way : 'plain';
    if (FG.way === w) return;
    FG.way = w; FG.sure = 0; FG.res = null; fgRender();
  }
  const FAIL = { break: ['bad', 'вещь сломается и исчезнет'], down: ['save', 'заточка −1, вещь цела'], none: ['ok', 'неудачи не бывает'] };
  function fgRender() {
    if (!FG.el) return;
    const h = ME && ME.hero; if (!h) return forgeClose();
    const it0 = h.items.find((x) => x.uid === FG.uid);

    const it = it0 || FG.gone; if (!it) return forgeClose();
    if (it0) FG.gone = { ...it0 };
    const E = EN(), m = matsOf(h), q = enchQuote(it, h, FG.way), wait = !!FG.wait, broken = !it0;
    const base = it.stats0 || it.stats || {}, now = enchStatsN(base, q.en), nx = enchStatsN(base, Math.min(E.max, q.tg));
    const keys = Object.keys(base).filter((k) => stOk(k, h) && base[k]);
    const sealOwn = Object.keys(m.seals).map(Number).sort((a, b) => a - b);
    const wayLbl = (k, l) => k === 'star' ? `${l} <small>×${m.star}</small>` : k === 'sphere' ? `${l} <small>×${m.sphere}</small>` : k === 'both' ? `${l} <small>${Math.min(m.star, m.sphere) ? '' : '—'}</small>` : k === 'seal' ? `${l} <small>${sealOwn.length ? sealOwn.map((n) => n).join(', ') : '—'}</small>` : l;
    const off = h.ghost ? 'Призрак не может точить' : h.busy ? 'Идёт бой на стриме — точить можно после боя' : !E.on ? 'Заточка выключена' : '';
    const [fc, ft] = FAIL[q.fail] || FAIL.break, danger = q.fail === 'break' && FG.sure > Date.now();
    const qd = wait && FG.queued ? `<p class="note" role="note">Заказ ждёт игру стримера: кузнец ударит, когда она будет в сети.</p><button type="button" class="btn ghost sm wide" data-fcancel>Отменить заказ</button>` : '';
    const go = broken ? `<button type="button" class="btn ghost wide" data-fclose>Закрыть</button>`
      : `<button type="button" class="btn primary wide${danger ? ' fg-sure' : ''}" data-fgo${off || q.err || wait ? ' disabled' : ''}>${wait ? 'Кузнец работает…' : danger ? 'Точно? Вещь может сломаться' : q.en >= E.max ? 'Предел заточки' : `${ico('hammer')}Точить до +${q.tg}`}</button>`;
    const R = FG.res;
    const crafts = []; for (let n = E.sealMin + 1; n <= E.max; n++) if ((m.seals[n - 1] || 0) >= E.craftN) crafts.push(n);
    FG.el.innerHTML = `<div class="fg-scrim" data-fclose></div>
      <section class="fg panel" role="dialog" aria-modal="true" aria-labelledby="fgT">
        <button type="button" class="x fg-x" data-fclose aria-label="Закрыть">${ico('x')}</button>
        <h2 class="h2" id="fgT">${ico('hammer')}Кузня — заточка</h2>
        <div class="fg-item">
          <div class="fg-art${wait ? ' work' : ''}${R && R.cls ? ' ' + R.cls : ''}" data-r="${esc(it.rarity)}">${lgx(it)}${art(it)}${R && R.anim ? `<i class="fg-fx ${R.cls}" aria-hidden="true"></i>` : ''}</div>
          <div class="fg-nm"><b data-r="${esc(it.rarity)}">${esc(fgName(it))}</b><span class="muted">${esc(SLOT[it.slot] || '')}${q.en < E.max && !broken ? ` · следующий уровень <b class="fg-tg">+${q.tg}</b>` : ''}</span></div>
        </div>
        ${R ? `<div class="fg-res ${R.cls}${R.anim ? ' go' : ''}" role="status"><b>${esc(R.big || '')}</b><span>${esc(R.t || '')}</span></div>` : '<div class="fg-res" role="status"></div>'}
        ${broken ? '' : `${keys.length && q.en < E.max ? `<ul class="fg-st">${keys.map((k) => `<li>${ico(k)}<span>${esc(stLabel(k))}</span><b>${stNum(k, now[k])}</b><em>→ ${stNum(k, nx[k])}</em></li>`).join('')}</ul>` : ''}
        ${FG.nw ? '' : `<div class="filters fg-ways" role="radiogroup" aria-label="Способ заточки">${WAYS.map(([k, l]) => `<button type="button" role="radio" data-way="${k}" aria-checked="${FG.way === k}" aria-pressed="${FG.way === k}">${wayLbl(k, l)}</button>`).join('')}</div>`}
        <dl class="fg-q">
          <div><dt>Шанс</dt><dd class="fg-ch">${q.way === 'seal' && q.seal ? '100%' : fmtPct(q.chance)}</dd></div>
          <div><dt>Цена</dt><dd>${money(q.price)}</dd></div>
          <div><dt>При неудаче</dt><dd class="fg-f ${fc}">${ft}</dd></div>
        </dl>
        ${q.way === 'seal' && q.seal ? `<p class="note">Уйдёт Печать Ауруса ${q.seal} — она гарантирует успех до +${q.seal}.</p>` : q.way === 'star' || q.way === 'both' ? `<p class="note">Счастливая звезда: +${E.star}% к шансу${q.way === 'both' ? ', сфера сбережёт вещь' : ''}.</p>` : q.way === 'sphere' ? '<p class="note">Сфера сохранения: при неудаче вещь не сломается, а потеряет один уровень.</p>' : ''}
        ${q.lack ? lackHtml(q.price, h.money, 'fg-why') : balHtml(q.price, h.money, 'fg-bal')}${off || (q.err && !q.lack) ? `<p class="note fg-why" role="note">${esc(off || q.err)}</p>` : ''}
        <div class="fg-go">${go}${FG.nw && !broken ? `<label class="fg-skip"><input type="checkbox" data-fskip${animSkip() ? ' checked' : ''}> Пропустить анимацию</label>` : ''}${qd}</div>
        <p class="note fg-cmd"><span>На стриме — в Кузне города: <b class="cmd">точить${it.no ? ' ' + it.no : it.on ? ' ' + (GD.WEAR_SLOTS.includes(it.slot) ? GD.SLOT[it.slot].low : '') : ' N'}${{ plain: '', star: ' звезда', sphere: ' сфера', both: ' звезда сфера', seal: ' печать' }[FG.way]}</b></span></p>`}
        <details class="fg-more"${crafts.length ? ' open' : ''}><summary>Материалы: звёзд ${m.star} · сфер ${m.sphere} · печатей ${sealOwn.reduce((a, n) => a + m.seals[n], 0)}</summary>
          <p class="note fg-find" role="note">Звёзды и сферы не продаются - их находят: боссы, данжи и сокровищницы, Шахта, сундуки рыбалки, ежедневные задания, монстры у стен, поход гильдии.</p>
          ${sealOwn.length ? `<p class="note">Печати Ауруса: ${sealOwn.map((n) => `${n} ×${m.seals[n]}`).join(' · ')}</p>` : '<p class="note">Печать Ауруса только выпадает: босс, данж, сокровищницы.</p>'}
          ${crafts.map((n) => `<button type="button" class="btn ghost sm wide" data-craft="${n}"${wait || h.ghost || (+h.money || 0) < E.craftCost * Math.max(1, n - E.sealMin) ? ' disabled' : ''}><span>Сковать Печать Ауруса ${n} · ${E.craftN} × печать ${n - 1} + ${money(E.craftCost * Math.max(1, n - E.sealMin))}</span></button>`).join('')}
        </details>
      </section>`;
    if (R && R.anim) R.anim = false;
  }

  const thK = (h) => (h && +h.thK > 1 ? +h.thK : 1);
  const thPrice = (h, base) => Math.round((+base || 0) * thK(h));
  const thTxt = (k) => '×' + String(k).replace('.', ',');
  const thNote = (h) => (thK(h) > 1 ? `<p class="note thiefl" role="note">Торговцы тебя запомнили: поймали на краже ${h.thN || ''} раз — для тебя цены ${thTxt(thK(h))}.${h.thU ? ` Одна поимка забудется ${new Date(h.thU).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}.` : ''}</p>` : '');

  function thArm(btn, h, base) {
    const k = thK(h); if (k <= 1) return true;

    return SU.confirmTwice(btn, { html: `<span>Для тебя за воровство цена ${thTxt(k)}: ${money(thPrice(h, base))} — нажми ещё раз</span>`, cls: 'arm', once: true });
  }
  window.LGThief = { k: thK, price: thPrice, note: thNote, arm: thArm };
  async function fgPost(path, body) {
    FG.res = null; const r = await api(path, body);
    if (!r.ok) { if (Array.isArray(r.fq) && ME) { ME.fq = r.fq; fgSync(); } FG.res = { cls: 'err', t: r.error || 'Не получилось' }; fgRender(); return null; }
    FG.wait = r.id; FG.waitAt = Date.now(); if (r.hero) { ME.hero = r.hero; last = ''; renderHero(); }

    if (path === '/api/enchant' && window.LGCity) { const it = ME.hero && ME.hero.items.find((x) => x.uid === body.uid); try { window.LGCity.forgeStart(it, ((it && it.en) || 0) + 1); } catch {} }
    fgRender();
    const id = r.id; setTimeout(() => { if (FG.wait === id) toast('Сохранено — кузнец ударит, когда игра стримера будет в сети'); }, 9000);

    for (const ms of [30000, 90000]) setTimeout(() => { if (FG.wait === id) load().catch(() => {}); }, ms);
    return r;
  }
  function fgClick(e) {
    const t = e.target.closest('button, [data-fclose]'); if (!t || t.disabled) return;
    if (t.hasAttribute('data-fclose')) return forgeClose();
    if (t.hasAttribute('data-fcancel')) return void fgCancel();
    if (t.dataset.way) { FG.way = t.dataset.way; FG.sure = 0; FG.res = null; fgRender(); const b = FG.el && FG.el.querySelector(`[data-way="${FG.way}"]`); if (b) b.focus(); return; }
    if (t.dataset.craft) return void fgPost('/api/craft', { lvl: +t.dataset.craft });
    if (t.hasAttribute('data-fgo')) {
      const h = ME.hero, it = h && h.items.find((x) => x.uid === FG.uid); if (!it || FG.wait) return;
      const q = enchQuote(it, h, FG.way); if (q.err) return;

      if (q.fail === 'break' && !(FG.sure > Date.now())) { FG.sure = Date.now() + 4000; fgRender(); const b = FG.el.querySelector('[data-fgo]'); if (b) b.focus(); setTimeout(() => { if (FG.sure && FG.sure <= Date.now()) { FG.sure = 0; fgRender(); } }, 4100); return; }
      FG.sure = 0;
      fgPost('/api/enchant', { uid: it.uid, way: FG.way, ...(q.seal ? { seal: q.seal } : {}) });
    }
  }

  function storeNote(r) {
    const x = r.x || {};
    if (!r.ok) { toast(r.error || 'Не вышло', true); return; }
    if (x.op === 'note') { toast(x.t); return; }
    const it = x.item ? `«${x.item}»` : 'Вещь';
    if (/^auc/.test(x.op)) {
      if (x.ret && !x.store && x.op !== 'aucClaim') toast(`${it} ждёт на складе аукциона: сумка и склад полны — освободи место и забери в зале`, true);
      else if (x.store) toast(x.op === 'aucClaim' ? `Забрано со склада аукциона: ${x.n}; на склад — ${x.store}, поскольку сумка была полна${x.ret ? `; ещё ${x.ret} ждут` : ''}` : `${it} отправлена на склад, поскольку сумка была полна`);
      return;
    }
    if (x.op === 'stTake' && x.left) toast(`Забрано ${x.n}, ещё ${x.left} осталось на складе — сумка полна`);

    if (x.op === 'stPutAll' || x.op === 'stTakeAll') { const t = `Перенесено ${x.n || 0}${x.left ? `, не влезло ${x.left}` : ''}`; toast(t); try { if (window.LGCity && window.LGCity.storeRes) window.LGCity.storeRes(x); } catch {} }
  }

  function forgeDone(r) {
    const mine = r.id === FG.wait; if (mine) FG.wait = null;
    const x = r.x || {};

    if (r.ok && x.op === 'cityBuy') return;
    if (!r.ok) { if (mine && FG.el) FG.res = { cls: 'err', t: r.error || 'Не вышло' }; else toast('Кузня: ' + (r.error || 'не вышло'), true); return; }
    if (x.op === 'craft') { toast(`Скована Печать Ауруса ${x.lvl}`); return; }
    const res = x.out === 'up' ? { cls: 'ok', big: `+${x.to}`, t: 'Заточка удалась!' } : x.out === 'broken' ? { cls: 'bad', big: 'Сломалось', t: `«${x.item}» не выдержала заточки на +${x.target}` }
      : x.out === 'down' ? { cls: 'save', big: x.to ? `+${x.to}` : '+0', t: 'Не вышло — сфера сберегла вещь, заточка −1' } : { cls: 'save', big: `+${x.from}`, t: 'Не вышло — вещь цела' };
    if (window.LGCity && (x.op === 'enchant' || x.out)) { try { window.LGCity.forgeFx(x); } catch {} }
    if (mine && FG.el && FG.uid === x.uid) { FG.res = { ...res, anim: !(reduceMQ && reduceMQ.matches) }; return; }
    toast(`Кузня: ${x.item}${x.from ? ' +' + x.from : ''} — ${res.t}`, x.out === 'broken');
  }


   

  const heroLook = (h) => (h && h.wardrobe ? { ...h, look: h.wardrobe.cur || null } : h);
  const LOOK_FIELDS = [['shape', 'Форма', 'shapes'], ['color', 'Цвет', 'colors'], ['color2', 'Второй цвет', 'colors'], ['eyes', 'Глаза', 'eyes'], ['mouth', 'Рот', 'mouths'], ['blush', 'Румянец', null], ['hat', 'Шапка', 'hats'], ['aura', 'Аура', 'auras'], ['acc', 'Аксессуары', 'acc'], ['accColor', 'Цвет аксессуаров', 'colors'], ['capeColor', 'Цвет плаща', 'colors']];
  const sameV = (a, b) => String(a).replace(/^#/, '').toLowerCase() === String(b).replace(/^#/, '').toLowerCase();
  


  const ACC_MAX = 5, ACC_CAPES = ['cape', 'pioneer'];
  const accMaxOf = (h) => Math.max(1, Math.min(8, +((h && h.wardrobe && h.wardrobe.am) || ACC_MAX)));
  const accFull = (n) => `Можно носить не больше ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'аксессуара' : 'аксессуаров'} - сними один, чтобы надеть другой`;

  const accBlocked = (on, v, max) => !on.some((x) => sameV(x, v)) && on.filter((x) => !(ACC_CAPES.includes(v) && ACC_CAPES.includes(x) && x !== v)).length >= max;
  function lookName(cat, v) {
    try { const C = D().CATALOG || {}, list = C[cat] || [], hex = String(v).replace(/^#?/, '#').toLowerCase(); const f = list.find(([id]) => String(id).toLowerCase() === String(v).toLowerCase() || String(id).toLowerCase() === hex); if (f) return f[1]; } catch {}
    return v === true || v === 'true' ? 'Есть' : v === false || v === 'false' ? 'Нет' : String(v);
  }

  const swatch = (v) => (/^#?[0-9a-f]{3,8}$/i.test(v) ? String(v).replace(/^#?/, '#') : /^hsl\([\d\s.,%]+\)$/i.test(v) ? String(v) : '#888');
  



  const LOOK_PROBE = new Map();
  function lookProbe(login, cur) {
    const d = D(); if (!d || !d.jDoodle) return null;
    const key = String(login).toLowerCase() + '|' + (d.active || '') + '|' + JSON.stringify(cur || {});
    if (LOOK_PROBE.has(key)) return LOOK_PROBE.get(key);
    const seed = jhash(String(login).toLowerCase()), who = String(login).toLowerCase();
    const draw = (lk) => { try { return String(d.jDoodle(seed, 'happy', false, { alive: true, noAura: true, who }, lk)).replace(/(id="|url\(#|href="#)([A-Za-z_-]+)\d+/g, '$1$2'); } catch (e) { return ''; } };
    const base = { ...(cur || {}) };
    const uses = (f, lk) => draw({ ...lk, [f]: '#010203' }) !== draw({ ...lk, [f]: '#fdfcfb' });
    const noAccCol = { ...base }; delete noAccCol.accColor;
    const r = {
      color2: uses('color2', base), accColor: uses('accColor', base), capeColor: uses('capeColor', base),
      c2hat: uses('color2', { ...noAccCol, acc: [] }),
      c2acc: !base.accColor && uses('color2', { ...noAccCol, hat: 'none' }),
    };
    if (LOOK_PROBE.size > 50) LOOK_PROBE.clear();
    LOOK_PROBE.set(key, r);
    return r;
  }
  function lookHtml(h) {
    const W0 = h.wardrobe || { cur: {}, own: {} }, cur = W0.cur || {}, own = W0.own || {};
    const off = h.busy;
    const accOn = Array.isArray(cur.acc) ? cur.acc : [], amax = accMaxOf(h);

    let DEF = null; try { DEF = D() && D().defaultsFor ? D().defaultsFor(String(h.login || '')) : null; } catch {}
    const same = (f, a, b) => { try { if (D() && D().sameLook) return D().sameLook(f, a, b); } catch {} return a != null && b != null && sameV(a, b); };
    const PR = lookProbe(h.login || '', cur);
    const label = (f, l) => (f !== 'color2' || !PR ? l : PR.c2hat ? (PR.c2acc ? 'Цвет шапки и аксессуаров' : 'Цвет шапки') : PR.c2acc ? 'Цвет аксессуаров' : 'Цвет деталей');
    const fixed = [];

    const rows = LOOK_FIELDS.map(([f, label0, cat]) => {
      if (PR && (f === 'color2' || f === 'accColor' || f === 'capeColor') && !PR[f]) return '';
      const lbl = label(f, label0);
      const ownF = Array.isArray(own[f]) ? own[f] : [];
      const def = DEF && DEF[f];
      const isOn = (v) => (f === 'acc' ? accOn.some((x) => sameV(x, v)) : f === 'blush' ? String(!!cur.blush) === String(v) && cur.blush != null : cur[f] != null && sameV(cur[f], v));

      const byNick = f === 'acc' ? !accOn.length : cur[f] == null || (!!def && same(f, cur[f], def.v));

      const list = def ? ownF.filter((v) => !same(f, v, def.v)) : ownF;

      const valOf = (v) => (f === 'acc' && isOn(v) ? accOn.filter((x) => !sameV(x, v)) : f === 'blush' ? String(v) : v);
      const isColor = /color/i.test(f);

      if (!list.length && byNick) { fixed.push(`<span class="lk-fx">${isColor && def ? `<i class="sw" style="background:${esc(swatch(def.v))}"></i>` : ''}<b>${esc(lbl)}</b> ${esc(def ? def.name : 'как по нику')}</span>`); return ''; }
      const chip = (v, txt, on, sw, hint, full) => `<button type="button" data-wear="${esc(f)}" data-v="${esc(JSON.stringify(v))}" aria-pressed="${on}"${hint ? ` class="lk-nick" title="${esc(hint)}"` : ''}${full ? ` title="${esc(accFull(amax))}"` : ''}${off || full ? ' disabled' : ''}>${isColor && sw ? `<i class="sw" style="background:${esc(swatch(sw))}"></i>` : ''}${esc(txt)}${hint ? '<small>по нику</small>' : ''}</button>`;
      const first = def ? chip(null, def.name, byNick, def.v, 'Даёт ник — бесплатно, всегда доступно') : chip(null, 'как по нику', byNick);

      const accN = f === 'acc' ? ` <small class="lk-accn">надето ${accOn.length} из ${amax}</small>` : '';
      const accNote = f === 'acc' ? `<p class="note lk-accmax"${accOn.length >= amax ? '' : ' hidden'}>${esc(accFull(amax))}</p>` : '';
      return `<div class="lk-f"><span class="lk-l">${esc(lbl)}${accN}</span><div class="lk-c filters">${first}${list.map((v) => chip(valOf(v), cat ? lookName(cat, v) : lookName(null, v), isOn(v), v, '', f === 'acc' && accBlocked(accOn, v, amax))).join('')}</div>${accNote}</div>`;
    }).join('');
    const more = fixed.length ? `<details class="lk-more"><summary>Ещё по нику — выбрать пока нечего (${fixed.length})</summary><p class="lk-fxs">${fixed.join('')}</p></details>` : '';
    return `<div class="lookv">
      <div class="fig">${doodle(h.login, heroLook(h), 'happy')}</div>
      <div class="lk">${off && !h.ghost ? `<p class="note busyn">⚔ Идёт бой на стриме — облик менять нельзя. Сменить можно после боя.</p>` : ''}
        ${rows || '<p class="note">Купленных деталей облика пока нет.</p>'}${more}
        <p class="note lk-tip">Новое покупается в Шатре города; надевать можно в любой момент, кроме боя.</p></div>
    </div>`;
  }
  






  





  const LC_WAIT = 400, LC_GAP = 2500, LC_HOT = 1500, LC_HOLD = 8000;

  const LC_AT = { hat: 'top', eyes: 'side', mouth: 'side', blush: 'side', aura: 'side', shape: 'bot', color: 'bot', color2: 'bot', accColor: 'bot', capeColor: 'bot' };

  const LC_CORE = new Set(['hat', 'eyes', 'mouth', 'shape', 'color']);

  const LC = { draft: {}, fly: {}, seq: 0, t: 0, flying: false, focus: null, focusAt: 0, at: 0, next: 0, until: 0, warned: 0, held: {}, card: null };
  const lcHot = () => !!LC.card && LC.card.isConnected && (LC.flying || Date.now() - LC.at < LC_HOT);
  const lcRate = (r) => !!r && !r.ok && /слишком часто|rate_limited|too many/i.test(String(r.error || ''));

  function lcCur(h) {
    const cur = { ...(((h && h.wardrobe) || {}).cur || {}) };
    for (const [f, x] of Object.entries(LC.held)) {

      if (Date.now() > x.until) { delete LC.held[f]; continue; }
      if (x.look == null || (Array.isArray(x.look) && !x.look.length)) delete cur[f]; else cur[f] = x.look;
    }
    return cur;
  }
  const lcOn = (h) => !!(h && h.lc && h.wardrobe);

  const lcAccOn = (h) => { const a = (lcLook(h) || {}).acc; return Array.isArray(a) ? a : []; };
  function lcLook(h) {
    const lk = lcCur(h);
    for (const [f, d] of Object.entries(LC.draft)) { if (d.look == null || (Array.isArray(d.look) && !d.look.length)) delete lk[f]; else lk[f] = d.look; }
    return Object.keys(lk).length ? lk : null;
  }

  function lcModel(h) {
    const W0 = h.wardrobe || { cur: {}, own: {} }, cur0 = W0.cur || {}, own = W0.own || {};
    let DEF = null; try { DEF = D() && D().defaultsFor ? D().defaultsFor(String(h.login || '')) : null; } catch (e) { DEF = null; }
    const same = (f, a, b) => { try { if (D() && D().sameLook) return D().sameLook(f, a, b); } catch (e) {   } return a != null && b != null && sameV(a, b); };
    const PR = lookProbe(h.login || '', cur0);
    const cur = lcLook(h) || {};
    const out = [], rest = [];
    for (const [f, label0, cat] of LOOK_FIELDS) {
      if (f === 'acc') continue;
      if (PR && (f === 'color2' || f === 'accColor' || f === 'capeColor') && !PR[f]) continue;
      const lbl = f !== 'color2' || !PR ? label0 : PR.c2hat ? (PR.c2acc ? 'Цвет шапки и аксессуаров' : 'Цвет шапки') : PR.c2acc ? 'Цвет аксессуаров' : 'Цвет деталей';
      const def = DEF && DEF[f];
      const ownF = Array.isArray(own[f]) ? own[f] : [];
      const list = def ? ownF.filter((v) => !same(f, v, def.v)) : ownF;
      const isColor = /color/i.test(f);
      const opts = [{ v: null, send: null, name: def ? def.name : 'Как по нику', sw: isColor && def ? def.v : null, nick: true }]
        .concat(list.map((v) => ({ v: f === 'blush' ? (v === true || v === 'true') : v, send: f === 'blush' ? String(v) : v, name: cat ? lookName(cat, v) : lookName(null, v), sw: isColor ? v : null })));
      const cv = cur[f];
      const byNick = cv == null || (!!def && same(f, cv, def.v));
      let i = byNick ? 0 : opts.findIndex((o, k) => k > 0 && (f === 'blush' ? String(o.v) === String(cv) : same(f, o.v, cv)));
      const row = { f, lbl, opts, i, at: LC_AT[f] || 'bot', isColor, curName: i >= 0 ? opts[i].name : cat ? lookName(cat, cv) : lookName(null, cv), curSw: i >= 0 ? opts[i].sw : isColor ? cv : null };
      if (opts.length > 1 || LC_CORE.has(f)) out.push(row); else rest.push(row);
    }

    const accOwn = Array.isArray(own.acc) ? own.acc : [], accOn = Array.isArray(cur.acc) ? cur.acc : [];
    const acc = accOwn.map((v) => ({ v, name: lookName('acc', v), on: accOn.some((x) => sameV(x, v)) }));
    return { rows: out, rest, acc, accOn };
  }
  const lcSw = (sw) => (sw ? `<i class="sw" style="background:${esc(swatch(sw))}"></i>` : '');
  function lcRowHtml(r, off) {
    const n = r.opts.length, one = n < 2;
    const pos = r.i >= 0 ? `${r.i + 1} / ${n}` : `- / ${n}`;
    const dis = off || one ? ' disabled' : '';
    return `<div class="lc-row" data-lc="${esc(r.f)}" data-at="${r.at}" role="group" aria-label="${esc(r.lbl)}">
      <button type="button" class="lc-a" data-lcs="-1" aria-label="${esc(r.lbl)}: предыдущий вариант"${dis}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="lc-m"><span class="lc-n" title="${esc(r.lbl)}">${esc(r.lbl)}${n > 1 ? ` <small class="lc-k" title="Доступно вариантов">${pos}</small>` : ''}</span><span class="lc-v" aria-live="polite">${r.isColor ? lcSw(r.curSw) : ''}<span class="lc-vn" title="${esc(r.curName)}">${esc(r.curName)}</span>${r.i === 0 ? ' <small>по нику</small>' : ''}</span></div>
      <button type="button" class="lc-a" data-lcs="1" aria-label="${esc(r.lbl)}: следующий вариант"${dis}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>`;
  }

  function lcHtml(h, plate) {
    const M = lcModel(h), off = !!h.busy;
    const at = (k) => M.rows.filter((r) => r.at === k).map((r) => lcRowHtml(r, off)).join('');

    const amax = accMaxOf(h), on0 = lcAccOn(h);
    const accRow = M.acc.length ? `<div class="lc-acc" role="group" aria-label="Аксессуары (не больше ${amax})"><span class="lc-n">Аксессуары <small class="lc-k">надето ${on0.length} из ${amax}</small></span><div class="lc-chips">${M.acc.map((a) => { const full = accBlocked(on0, a.v, amax); return `<button type="button" data-lcacc="${esc(a.v)}" aria-pressed="${a.on}"${full ? ` title="${esc(accFull(amax))}"` : ''}${off || full ? ' disabled' : ''}${off ? ' data-off="1"' : ''}>${esc(a.name)}</button>`; }).join('')}</div><p class="note lc-accmax"${on0.length >= amax ? '' : ' hidden'}>${esc(accFull(amax))}</p></div>` : '';
    const rest = M.rest.concat(M.acc.length ? [] : [{ lbl: 'Аксессуары', curName: 'Без аксессуаров' }]);
    const more = rest.length ? `<details class="lk-more lc-more"><summary>Ещё по нику - выбрать пока нечего (${rest.length})</summary><p class="lk-fxs">${rest.map((r) => `<span class="lk-fx">${r.isColor ? lcSw(r.curSw) : ''}<b>${esc(r.lbl)}</b> ${esc(r.curName)}</span>`).join('')}</p></details>` : '';
    return `<div class="lc" data-lcard>
      <div class="lc-in">
        ${off && !h.ghost ? `<p class="note busyn lc-busy">⚔ Идёт бой на стриме - облик менять нельзя. Сменить можно после боя.</p>` : ''}
        <div class="lc-top">${at('top')}</div>
        <div class="fig lc-fig">${doodle(h.login, { ...h, look: lcLook(h) }, 'happy')}</div>
        <div class="lc-side">${at('side')}</div>
        <div class="plate lc-plate">${plate}</div>
        <div class="lc-bot">${at('bot')}${accRow}</div>
      </div>
      ${more}
      <p class="note lk-tip">Стрелки листают только то, что у тебя есть, - надевается само. Новое покупается в Шатре города; менять можно в любой момент, кроме боя.</p>
    </div>`;
  }

  function lcPaint(card, h) {
    const old = card.querySelector('.lc-fig'); if (!old) return;
    const key = JSON.stringify(lcLook(h));
    if (old.dataset.lk === key) return;
    const fig = document.createElement('div'); fig.className = 'fig lc-fig'; fig.dataset.lk = key;
    fig.innerHTML = doodle(h.login, { ...h, look: lcLook(h) }, 'happy');
    old.replaceWith(fig);
    calm(card); auraLive(fig, true);
  }
  


  function lcSync(card, h) {
    try {
      for (const r of lcModel(h).rows) {
        const row = card.querySelector(`.lc-row[data-lc="${CSS.escape(r.f)}"]`); if (!row) continue;
        const tmp = document.createElement('div'); tmp.innerHTML = lcRowHtml(r, false);
        const nv = tmp.querySelector('.lc-v'), nk = tmp.querySelector('.lc-k');
        const v = row.querySelector('.lc-v'), k = row.querySelector('.lc-k');
        if (v && nv && v.innerHTML !== nv.innerHTML) v.innerHTML = nv.innerHTML;
        if (k && nk && k.textContent !== nk.textContent) k.textContent = nk.textContent;
        lcFit(row);
      }
      const on = lcAccOn(h), amax = accMaxOf(h);
      card.querySelectorAll('[data-lcacc]').forEach((b) => {
        b.setAttribute('aria-pressed', String(on.some((x) => sameV(x, b.dataset.lcacc))));

        if (b.dataset.off) return;
        const full = accBlocked(on, b.dataset.lcacc, amax); b.disabled = full; if (full) b.title = accFull(amax); else b.removeAttribute('title');
      });
      const k = card.querySelector('.lc-acc .lc-k'); if (k) k.textContent = `надето ${on.length} из ${amax}`;
      const nt = card.querySelector('.lc-accmax'); if (nt) nt.hidden = on.length < amax;
    } catch (e) { console.warn('облик: подписи', e); }
    lcPaint(card, h);
  }
  function lcStep(card, f, dir) {
    const h = ME && ME.hero; if (!h || h.busy) return;
    const r = lcModel(h).rows.find((x) => x.f === f); if (!r || r.opts.length < 2) return;
    LC.at = Date.now();
    const n = r.opts.length, i = r.i < 0 ? (dir > 0 ? 0 : n - 1) : (r.i + dir + n) % n, o = r.opts[i];
    


    const fl = LC.fly[f];
    const was = fl ? (fl.look == null || (Array.isArray(fl.look) && !fl.look.length) ? undefined : fl.look) : lcCur(h)[f];

    const back = o.nick ? was == null : was != null && (f === 'blush' ? String(was) === String(o.v) : sameV(was, o.v));
    if (back) delete LC.draft[f]; else LC.draft[f] = { send: o.send, look: o.v };
    const row = card.querySelector(`.lc-row[data-lc="${CSS.escape(f)}"]`);
    if (row) {
      const nr = { ...r, i, curName: o.name, curSw: o.sw };
      const tmp = document.createElement('div'); tmp.innerHTML = lcRowHtml(nr, false);
      const nv = tmp.querySelector('.lc-v'), nk = tmp.querySelector('.lc-k');
      const v = row.querySelector('.lc-v'), k = row.querySelector('.lc-k');
      if (v && nv) { v.innerHTML = nv.innerHTML; v.classList.remove('lc-in-l', 'lc-in-r'); void v.offsetWidth; v.classList.add(dir > 0 ? 'lc-in-r' : 'lc-in-l'); }
      if (k && nk) k.textContent = nk.textContent;
      lcFit(row);
    }
    lcSync(card, h);
    lcSoon();
  }
  function lcAcc(card, v) {
    const h = ME && ME.hero; if (!h || h.busy) return;
    LC.at = Date.now();
    const lk = lcLook(h) || {}, on = Array.isArray(lk.acc) ? lk.acc : [];
    const has = on.some((x) => sameV(x, v));

    if (!has && accBlocked(on, v, accMaxOf(h))) { toast(accFull(accMaxOf(h)), true); lcSync(card, h); return; }

    const capes = ['cape', 'pioneer'], other = capes.includes(v) ? capes.filter((x) => x !== v) : [];
    const next = has ? on.filter((x) => !sameV(x, v)) : [...on.filter((x) => !sameV(x, v) && !other.includes(x)), v];


    const single = !has && !LC.draft.acc;
    LC.draft.acc = { send: single ? v : next, look: next };
    lcSync(card, h);
    lcSoon();
  }

  const lcSoon = () => { clearTimeout(LC.t); LC.t = setTimeout(lcFlush, Math.max(LC_WAIT, LC.next - Date.now(), LC.until - Date.now())); };

  async function lcFlush() {
    if (LC.flying) { lcSoon(); return; }
    const todo = Object.entries(LC.draft).filter(([, d]) => !d.sent);
    if (!todo.length) return;
    LC.flying = true;
    let okN = 0, slow = false;
    for (const [f, d] of todo) {
      if (slow) break;


      if (LC.draft[f] !== d || d.sent) continue;
      d.sent = true; LC.fly[f] = d;

      LC.seq = Math.max(LC.seq + 1, Date.now());
      const r = await api('/api/wear', { field: f, value: d.send, seq: LC.seq });
      delete LC.fly[f];

      if (lcRate(r)) {
        slow = true;
        if (LC.draft[f] === d) d.sent = false;

        else if (!LC.draft[f]) { d.sent = false; LC.draft[f] = d; }
        continue;
      }

      if (LC.draft[f] === d) delete LC.draft[f];
      if (!r || !r.ok) { toast((r && r.error) || 'Не получилось', true); if (ME && ME.hero && LC.card && LC.card.isConnected) lcSync(LC.card, ME.hero); continue; }
      okN++;

      if (!r.stale) LC.held[f] = { look: d.look, until: Date.now() + LC_HOLD };
      if (r.hero) ME.hero = r.hero;
      if (LC.card && LC.card.isConnected && ME && ME.hero) lcSync(LC.card, ME.hero);
    }
    LC.flying = false;
    LC.next = Date.now() + LC_GAP;
    if (slow) {
      LC.until = Date.now() + 8000;
      if (Date.now() - LC.warned > 30000) { LC.warned = Date.now(); toast('Сайт просит менять облик не так часто - последний выбор сохранится через несколько секунд'); }
    }
    if (okN) toast('Облик изменён');
    if (Object.keys(LC.draft).length) { lcSoon(); return; }

    if (!LC.card || !LC.card.isConnected) { last = ''; renderHero(); }
    clearTimeout(act.pt); if (ME && ME.hero && ME.hero.pending) act.pt = setTimeout(() => { if (ME && ME.hero && ME.hero.pending) toast('Сохранено - применится, когда игра стримера будет в сети'); }, 6000);
  }
  


  const LC_FIT = ['lc-f1', 'lc-f2', 'lc-f3', 'lc-f4'];
  const lcOver = (row) => [...row.querySelectorAll('.lc-m, .lc-n, .lc-v')].some((e) => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1);
  function lcFit(row) {

    if (!row || !row.isConnected || !row.clientWidth) return;
    row.classList.remove(...LC_FIT);
    for (const c of LC_FIT) { if (!lcOver(row)) return; row.classList.remove(...LC_FIT); row.classList.add(c); }
  }
  let lcRO = null;
  function lcBind(el) {
    const card = el.querySelector('[data-lcard]'); if (!card) return;
    LC.card = card;
    card.querySelectorAll('.lc-row').forEach(lcFit);
    if (typeof ResizeObserver === 'function') {
      if (lcRO) lcRO.disconnect();
      let w0 = -1;
      lcRO = new ResizeObserver((es) => { const w = Math.round(es[0].contentRect.width); if (w === w0) return; w0 = w; card.querySelectorAll('.lc-row').forEach(lcFit); });
      lcRO.observe(card);
    }
    const fig = card.querySelector('.lc-fig'); if (fig) fig.dataset.lk = JSON.stringify(lcLook(ME.hero));
    card.addEventListener('click', (e) => {
      const s = e.target.closest('[data-lcs]'); if (s && !s.disabled) { const row = s.closest('[data-lc]'); if (row) lcStep(card, row.dataset.lc, +s.dataset.lcs); return; }
      const a = e.target.closest('[data-lcacc]'); if (a && !a.disabled) lcAcc(card, a.dataset.lcacc);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const row = e.target.closest && e.target.closest('[data-lc]'); if (!row) return;
      e.preventDefault(); lcStep(card, row.dataset.lc, e.key === 'ArrowRight' ? 1 : -1);
    });
    card.addEventListener('focusin', (e) => {
      const b = e.target.closest && e.target.closest('[data-lcs], [data-lcacc]'); if (!b) return;
      const row = b.closest('[data-lc]');
      LC.focus = row ? `.lc-row[data-lc="${CSS.escape(row.dataset.lc)}"] [data-lcs="${CSS.escape(b.dataset.lcs)}"]` : `[data-lcacc="${CSS.escape(b.dataset.lcacc)}"]`; LC.focusAt = Date.now();
    });

    const ae = document.activeElement;
    if (LC.focus && Date.now() - LC.focusAt < 15000 && (!ae || ae === document.body)) { const b = card.querySelector(LC.focus); if (b && !b.disabled) b.focus({ preventScroll: true }); }
  }






  const LIVE = new Set();
  const reduceMQ = SU.media('reduced');
  const seen = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver((es) => es.forEach((e) => { e.target.classList.toggle('zz', !e.isIntersecting); auraRun(e.target); })) : null;

  







  const VBW = 120, VBH = 170;
  



  const AURA_SOFT_TICK = 0.125;
  let auraSoftV = null;
  function auraSoft() {
    if (auraSoftV != null) return auraSoftV;
    try { const f = localStorage.getItem('lg-aura'); if (f === 'smooth' || f === 'soft') return (auraSoftV = f === 'soft'); } catch (e) {}
    auraSoftV = false;
    try {
      const g = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: false });
      if (!g) auraSoftV = true;
      else {
        const ext = g.getExtension('WEBGL_debug_renderer_info');
        const r = String(ext ? g.getParameter(ext.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER) || '');
        auraSoftV = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(r);
        try { const l = g.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); } catch (e) {}
      }
    } catch (e) {}
    return auraSoftV;
  }
  function auraLive(fig, own) {
    try {
      if (!fig || fig.dataset.aura || reduceMQ.matches) return;
      const sv = fig.querySelector('svg.jl-doodle'); if (!sv || !sv.querySelector('.jd-aura-b, .jd-aura-f')) return;
      fig.dataset.aura = 'wait';
      if (own) fig.dataset.auraOwn = '1';
      auraRun(fig);
    } catch (e) { console.warn('аура', e); }
  }

  const smilVals = (a) => String(a.getAttribute('values') || '').split(';').map((v) => v.trim()).filter(Boolean);
  const smilSec = (v) => { const m = /^(-?[\d.]+)(ms|s)?$/.exec(String(v || '').trim()); return m ? (+m[1]) * (m[2] === 'ms' ? 0.001 : 1) : 0; };


  const AURA_PX = new Map();
  function auraBake(svgText, pw, ph) {
    const key = pw + 'x' + ph + svgText;
    let p = AURA_PX.get(key); if (p) return p;
    const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
    p = new Promise((ok) => {
      const im = new Image();
      im.onload = () => {
        try {
          const cv = document.createElement('canvas'); cv.width = pw; cv.height = ph;
          cv.getContext('2d').drawImage(im, 0, 0, pw, ph);
          cv.toBlob((b) => ok(b ? URL.createObjectURL(b) : svgUrl), 'image/png');
        } catch (e) { ok(svgUrl); }
      };
      im.onerror = () => ok(svgUrl);
      im.src = svgUrl;
    });
    AURA_PX.set(key, p); return p;
  }

  let auraSheet = null; const AURA_KF = new Map();
  function auraKf(frames) {
    const body = frames.map((k) => `${+(k.offset * 100).toFixed(3)}%{${k.transform ? `transform:${k.transform};` : ''}${k.opacity != null ? `opacity:${+k.opacity.toFixed(3)}` : ''}}`).join('');
    let n = AURA_KF.get(body); if (n) return n;
    try {
      if (!auraSheet) { const st = document.createElement('style'); st.id = 'jd-aura-kf'; document.head.appendChild(st); auraSheet = st.sheet; }
      n = 'jdak' + AURA_KF.size; auraSheet.insertRule(`@keyframes ${n}{${body}}`, auraSheet.cssRules.length);
    } catch (e) { n = ''; }
    AURA_KF.set(body, n); return n;
  }
  async function auraBuild(fig) {
    const sv = fig.querySelector('svg.jl-doodle'); if (!sv) return;
    const soft = auraSoft(), T = AURA_SOFT_TICK;
    const wrap = document.createElement('div'); wrap.className = 'jd-aura-w' + (fig.dataset.auraOwn ? ' au-own' : '') + (soft ? ' au-soft' : '');
    const mk = (cls) => { const d = document.createElement('div'); d.className = 'jd-aura-l ' + cls; d.setAttribute('aria-hidden', 'true'); return d; };
    const back = mk('jd-al-b'), front = mk('jd-al-f'), NS = 'http://www.w3.org/2000/svg', waits = [];

    const ppu = (sv.getBoundingClientRect().width / VBW || 2) * Math.min(3, Math.max(1, window.devicePixelRatio || 1));
    const defs = [...sv.querySelectorAll('.jd-aura-b defs, .jd-aura-f defs')].map((d) => d.outerHTML).join('');
    const grps = [[sv.querySelector('.jd-aura-b'), back], [sv.querySelector('.jd-aura-f'), front]];
    for (const [grp, layer] of grps) {
      if (!grp) continue;
      for (const el of [...grp.children]) {
        if (el.tagName.toLowerCase() === 'defs') continue;
        const own = [...el.children].filter((a) => /^(animate|animateTransform)$/.test(a.tagName));
        let bb; try { bb = el.getBBox(); } catch (e) { bb = null; }
        if (!bb || !(bb.width + bb.height)) continue;
        const pad = 6, x = bb.x - pad, y = bb.y - pad, w = bb.width + pad * 2, h = bb.height + pad * 2;
        const c = el.cloneNode(true);

        c.querySelectorAll('animate, animateTransform, animateMotion, set').forEach((a) => {
          if (a.parentNode === c) { a.remove(); return; }
          const v = smilVals(a)[0], n = a.getAttribute('attributeName');
          if (v != null && n && a.tagName === 'animate') try { a.parentNode.setAttribute(n, v); } catch (e) {}
          a.remove();
        });
        c.removeAttribute('opacity');
        const pw = Math.max(1, Math.ceil(w * ppu)), ph = Math.max(1, Math.ceil(h * ppu));
        const svgText = `<svg xmlns="${NS}" viewBox="${x} ${y} ${w} ${h}" width="${pw}" height="${ph}">${/url\(#/.test(c.outerHTML) ? defs : ''}${c.outerHTML}</svg>`;
        const img = document.createElement('img'); img.className = 'jd-al'; img.alt = ''; img.decoding = 'async';
        img.style.cssText = `left:${(x / VBW) * 100}%;top:${(y / VBH) * 100}%;width:${(w / VBW) * 100}%;height:${(h / VBH) * 100}%`;
        waits.push(auraBake(svgText, pw, ph).then((u) => { img.src = u; return img.decode ? img.decode().catch(() => null) : null; }));
        layer.appendChild(img);

        const base = el.getAttribute('opacity');
        let dur = 0, delay = 0, tr = null, op = null, kt = null;
        for (const a of own) {
          const vals = smilVals(a); if (vals.length < 2) continue;


          dur = dur || smilSec(a.getAttribute('dur')); delay = delay || smilSec(a.getAttribute('begin'));
          if (a.tagName === 'animateTransform' && (a.getAttribute('type') || 'translate') === 'translate') tr = vals.map((v) => v.split(/[\s,]+/).map(Number));
          else if (a.getAttribute('attributeName') === 'opacity') { op = vals.map(Number); kt = a.getAttribute('keyTimes'); }
        }
        if (!dur || (!tr && !op)) { if (base != null) img.style.opacity = base; continue; }

        const kts = kt ? kt.split(';').map(Number) : null;
        const pts = new Set([0, 1]); (kts || (op || []).map((_, i, A) => i / (A.length - 1))).forEach((t) => pts.add(t)); if (tr) tr.forEach((_, i, A) => pts.add(i / (A.length - 1)));
        const at = (A, t, times) => { const T = times || A.map((_, i) => i / (A.length - 1)); let i = 0; while (i < T.length - 2 && t > T[i + 1]) i++; const f = T[i + 1] === T[i] ? 0 : Math.max(0, Math.min(1, (t - T[i]) / (T[i + 1] - T[i]))); return Array.isArray(A[i]) ? A[i].map((v, j) => v + (A[i + 1][j] - v) * f) : A[i] + (A[i + 1] - A[i]) * f; };

        if (soft) { dur = Math.max(2, Math.round(dur / T)) * T; delay = Math.round(delay / T) * T; pts.clear(); const n = Math.round(dur / T); for (let i = 0; i <= n; i++) pts.add(i / n); }
        const frames = [...pts].sort((a, b) => a - b).map((t) => {
          const k = { offset: t };
          if (tr) { const [dx, dy = 0] = at(tr, t); k.transform = `translate(${((dx / w) * 100).toFixed(3)}%, ${((dy / h) * 100).toFixed(3)}%)`; }
          if (op) k.opacity = at(op, t, kts);
          return k;
        });
        if (!op && base != null) img.style.opacity = base;
        const name = auraKf(frames);
        if (name) Object.assign(img.style, { animationName: name, animationDuration: dur + 's', animationDelay: delay + 's' }, soft ? { animationTimingFunction: 'steps(1, end)' } : {});
        else if (typeof img.animate === 'function') { const an = img.animate(frames, { duration: dur * 1000, delay: delay * 1000, iterations: Infinity, ...(soft ? { easing: `steps(${Math.round(dur / T)})` } : {}) }); (fig._aura = fig._aura || []).push(an); }
      }
    }

    await Promise.all(waits);
    if (!sv.isConnected) return;
    for (const [grp] of grps) if (grp) grp.remove();
    sv.replaceWith(wrap); wrap.append(back, sv, front);
  }

  function auraRun(fig) {
    try {
      if (!fig || !fig.dataset.aura || fig.dataset.aura === 'off') return;
      const vis = !document.hidden && !reduceMQ.matches && !fig.classList.contains('zz') && fig.isConnected && !!fig.offsetParent;
      const on = vis && (!!fig.dataset.auraOwn || !!fig._hov);
      if (fig.dataset.aura === 'wait') {
        if (!on) return;
        fig.dataset.aura = 'build';
        auraBuild(fig).then(() => { fig.dataset.aura = 'on'; auraRun(fig); }, (e) => { console.warn('аура', e); fig.dataset.aura = 'off'; });
        return;
      }
      fig.classList.toggle('au-on', on);
      for (const a of fig._aura || []) if (on) a.play(); else a.pause();
    } catch (e) { console.warn('аура', e); fig.dataset.aura = 'off'; }
  }
  function calm(root) {
    const reduce = reduceMQ.matches;
    root.querySelectorAll('.fig svg, .cf svg').forEach((sv) => {
      try { sv.setCurrentTime(1.4); sv.pauseAnimations(); } catch {}
      const fig = sv.closest('.fig, .cf'); if (!fig || fig.dataset.calm) return;
      fig.dataset.calm = '1'; fig.classList.add('alive');
      LIVE.add(fig); try { if (seen) seen.observe(fig); } catch {}
      if (reduce) return;

      fig.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; try { sv.unpauseAnimations(); } catch {} fig._hov = true; auraLive(fig); auraRun(fig); });
      fig.addEventListener('pointerleave', () => { try { sv.pauseAnimations(); } catch {} fig._hov = false; auraRun(fig); });
    });

    for (const f of LIVE) if (!f.isConnected) { LIVE.delete(f); try { if (seen) seen.unobserve(f); for (const a of f._aura || []) a.cancel(); } catch {} }
    lifeTick();
  }

  let lifeT = 0;
  function lifeTick() {
    clearTimeout(lifeT); lifeT = 0;
    if (document.hidden || reduceMQ.matches || !LIVE.size) return;
    lifeT = setTimeout(() => {
      lifeT = 0;
      try {
        for (const f of LIVE) {
          if (!f.isConnected || f.classList.contains('zz') || !f.offsetParent) continue;
          const sv = f.querySelector('svg.jl-doodle'); if (!sv || sv.classList.contains('jd-ghost')) continue;
          if (Math.random() < 0.8) { sv.classList.add('blink'); setTimeout(() => sv.classList.remove('blink'), 200); }
          if (Math.random() < 0.2 && sv.querySelector('.jd-weapon')) { sv.classList.add('sway'); setTimeout(() => sv.classList.remove('sway'), 1700); }
        }
      } catch {}
      lifeTick();
    }, 3000 + Math.random() * 3000);
  }
  document.addEventListener('visibilitychange', () => { document.documentElement.classList.toggle('zz-all', document.hidden); lifeTick(); for (const f of LIVE) auraRun(f); });
  try { reduceMQ.addEventListener('change', () => { lifeTick(); for (const f of LIVE) auraRun(f); }); } catch {}

  function renderHello(el) {
    const names = ['центурион', 'лучница', 'жрец', 'маг', 'новобранец'];
    el.innerHTML = `<div class="hello panel"><div class="hello-t"><h1 class="h1">Твой герой Легиона</h1><p class="lead">Войди через Twitch — увидишь своего героя, всё, что он добыл в Походе, и переоденешь его перед следующим стримом.</p><a class="btn twitch" href="${window.LG_LOGIN || '/auth/login'}">${ico('twitch')}<span>Войти через Twitch</span></a></div>
      <div class="crowd" aria-hidden="true">${names.map((n, i) => `<div class="cf">${doodle('гость·' + n, null, i % 2 ? 'happy' : 'stern')}</div>`).join('')}</div></div>`;
    calm(el);
  }


   
   
  let lgv = 'roster'; try { if (localStorage.getItem('lgLegView') === 'soc') lgv = 'soc'; } catch {}
  function legOpen() {
    const T = $('#tab-legion');
    if (!$('#lgRoster', T)) {
      T.innerHTML = `<div class="views filters lg-views" role="group" aria-label="Что показать"><button type="button" data-lgv="roster">Состав</button><button type="button" data-lgv="soc">Соц. рейтинг</button></div><div id="lgRoster"></div><div id="lgSoc"></div>`;
      T.querySelectorAll('[data-lgv]').forEach((b) => b.onclick = () => { if (lgv === b.dataset.lgv) return; lgv = b.dataset.lgv; try { localStorage.setItem('lgLegView', lgv); } catch {} legOpen(); });
    }
    T.querySelectorAll('[data-lgv]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lgv === lgv)));
    $('#lgRoster', T).hidden = lgv !== 'roster'; $('#lgSoc', T).hidden = lgv !== 'soc';
    if (lgv === 'soc') loadSoc(); else loadLegion();
  }
  let legAt = '';
  async function loadLegion() {
    const el = $('#lgRoster'); if (!el) return;
    if (!el.innerHTML) el.innerHTML = '<p class="empty">Собираю Легион…</p>';
    const r = await api('/api/legion');
    if (!r.ok) { if (!el.querySelector('.legion')) el.innerHTML = '<div class="panel"><p class="empty">Не удалось загрузить Легион. Обнови страницу чуть позже.</p></div>'; return; }
    const lk = sty() + JSON.stringify(r); if (lk === legAt && el.querySelector('.legion')) return; legAt = lk;
    const T = r.total, tot = Math.max(1, T.heroes);
    const roster = (r.roster || []);


    const RS = [...GD.classIds(), 'recruit'], rN = (k) => (r.roles && r.roles[k] && r.roles[k].n) || 0;
    const rName = (k) => roleOf(k, (r.roles && r.roles[k] && r.roles[k].name) || GD.className(k));
    const byRole = {}; for (const v of roster) { const k = RS.includes(v.role) ? v.role : 'recruit'; (byRole[k] = byRole[k] || []).push(v); }

    const L7 = !!(ME && ME.hero && ME.hero.l7);
    const roleLines = (g) => g.roles.filter((k) => r.roles[k] && r.roles[k].n).map((k) => `${esc(roleOf(k, r.roles[k].name))} ${r.roles[k].n}`).join(' · ');
    const gName = (g) => SU.styleText(sty(), 'groups', g.id) || g.name;
    const byGroup = {}; for (const v of roster) (byGroup[GROUP_OF[v.role] || 'recruit'] = byGroup[GROUP_OF[v.role] || 'recruit'] || []).push(v);
    const fig = (v) => `<li class="rf${v.ghost ? ' gh' : ''}" title="${esc(v.name)} · ур. ${v.level}"><div class="rd">${doodle(v.login, { look: v.look, gear: v.gear, ghost: v.ghost }, 'stern')}</div><span class="rn">${esc(v.name)}${awb(v.aw)}</span><span class="rlv">${v.level}</span></li>`;
    const mixH = L7 ? `<div class="mix" role="img" aria-label="Состав: ${RS.map((k) => `${rName(k)} ${rN(k)}`).join(', ')}">${RS.filter((k) => rN(k)).map((k) => `<i data-g="${GROUP_OF[k] || 'recruit'}" data-r="${k}" style="flex:${rN(k)}"></i>`).join('')}</div>` : `<div class="mix" role="img" aria-label="Состав: ${r.groups.map((g) => `${gName(g)} ${g.n}`).join(', ')}">${r.groups.filter((g) => g.n).map((g) => `<i data-g="${g.id}" style="flex:${g.n}"></i>`).join('')}</div>`;
    const grpH = L7 ? `<div class="groups lg-cls">${RS.map((k) => `<section class="grp panel${rN(k) ? '' : ' none'}" data-g="${GROUP_OF[k] || 'recruit'}" data-r="${k}"><h2 class="gn"><i class="sw" aria-hidden="true"></i>${esc(rName(k))}</h2><div class="gv"><b>${rN(k)}</b><span>${Math.round((rN(k) / tot) * 100)}%</span></div></section>`).join('')}</div>` : `<div class="groups">${r.groups.map((g) => `<section class="grp panel" data-g="${g.id}"><h2 class="gn"><i class="sw" aria-hidden="true"></i>${esc(gName(g))}</h2><div class="gv"><b>${g.n}</b><span>${Math.round((g.n / tot) * 100)}%</span></div><p class="gr">${roleLines(g) || 'пока никого'}</p></section>`).join('')}</div>`;
    const rowH = L7 ? RS.filter((k) => (byRole[k] || []).length).map((k) => `<div class="row" data-g="${GROUP_OF[k] || 'recruit'}" data-r="${k}"><h3 class="rh"><i class="sw" aria-hidden="true"></i>${esc(rName(k))}</h3><ul class="rlist">${byRole[k].map(fig).join('')}</ul></div>`).join('') : r.groups.filter((g) => (byGroup[g.id] || []).length).map((g) => `<div class="row" data-g="${g.id}"><h3 class="rh"><i class="sw" aria-hidden="true"></i>${esc(gName(g))}</h3><ul class="rlist">${byGroup[g.id].map(fig).join('')}</ul></div>`).join('');
    el.innerHTML = `<div class="legion">
      <header class="lg-head panel">
        <div class="lg-big"><b>${T.heroes}</b><span>${plural(T.heroes, 'герой', 'героя', 'героев')} в Легионе</span></div>
        <dl class="lg-t"><div><dt>в строю</dt><dd>${T.heroes - T.ghosts}</dd></div><div><dt>призраков</dt><dd>${T.ghosts}</dd></div><div><dt>средний уровень</dt><dd>${T.avgLevel}</dd></div></dl>
        ${mixH}
      </header>
      ${grpH}
      ${roster.length ? `<section class="panel ranks"><div class="bag-h"><h2 class="h2">Строй</h2><span class="muted">${roster.length < T.heroes ? `${roster.length} самых опытных из ${T.heroes}` : 'все герои'} · по уровню</span></div>
        ${rowH}</section>` : ''}
      <p class="foot">Роль зависит от оружия в руках: меч — легионер, лук — лучник, посох — маг, кадило — жрец. Без оружия — новобранец. · обновлено ${r.at ? new Date(r.at).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
    </div>`;


    try { el.querySelectorAll('.rd svg').forEach((sv) => { try { sv.pauseAnimations(); sv.setCurrentTime(0); } catch (e) {} sv.querySelectorAll('animate,animateTransform,animateMotion,set').forEach((a) => a.remove()); }); } catch (e) {}
  }

   
  let socAt = '';
  async function loadSoc() {
    const el = $('#lgSoc'); if (!el) return;
    if (!el.innerHTML) el.innerHTML = '<div class="panel"><p class="empty">Считаю рейтинг…</p></div>';
    const r = await api('/api/soc');
    if (!r || !r.ok) { el.innerHTML = '<div class="panel"><p class="empty">Не удалось загрузить рейтинг. Обнови страницу чуть позже.</p></div>'; return; }
    const k = JSON.stringify([r.top, r.me, r.near]); if (k === socAt && el.querySelector('.soc')) return; socAt = k;
    const R0 = r.ranks || {}, rk = (id) => R0[id] || { name: '', icon: '' };
    const me = r.me, inTop = me && (r.top || []).some((x) => x.login === me.login);
    const row = (x, i, mine) => { const q = rk(x.rank); return `<li class="sr${mine ? ' me' : ''}${q.bad ? ' bad' : ''}${i < 3 ? ' p' + (i + 1) : ''}"><span class="sp">${i + 1}</span><span class="sn">${esc(x.name)}${awb((r.aw || {})[x.login])}</span><span class="sk"><i aria-hidden="true">${esc(q.icon)}</i>${esc(q.name)}</span><b class="ss">${x.score}</b></li>`; };
    if (!(r.top || []).length) { el.innerHTML = '<div class="panel"><p class="empty">Рейтинг появится после синхронизации со стримом.</p></div>'; return; }


    const T = r.top.length, nb = (Array.isArray(r.near) ? r.near : []).filter((x) => x.place > T);
    const nbRows = (xs) => `${inTop ? '' : '<h3 class="h3 soc-nh">Рядом с тобой</h3>'}<ol class="srl tail${inTop ? '' : ' nh'}" start="${xs[0].place}" aria-label="Рядом с тобой">${xs.map((x) => row(x, x.place - 1, me && x.login === me.login)).join('')}</ol>`;
    const tail = nb.length && me && me.place ? nbRows(nb) : me && !inTop && me.place ? `<ol class="srl tail" start="${me.place}">${row({ ...me, name: me.name }, me.place - 1, true)}</ol>` : '';
    el.innerHTML = `<div class="soc">
      <header class="panel soc-h"><div><h1 class="h1">Соц. рейтинг</h1><p class="lead">Рейтинг меняется за дела на стриме. Чем он выше — тем выше звание.</p></div>
        ${me ? `<div class="soc-me${(rk(me.rank).bad) ? ' bad' : ''}"><span class="mi" aria-hidden="true">${esc(rk(me.rank).icon || '')}</span><div><b>${me.place ? me.place + ' место' : 'ещё нет места'}</b><span>${esc(rk(me.rank).name || '—')} · ${me.score} ${plural(Math.abs(me.score), 'очко', 'очка', 'очков')}</span></div></div>` : ''}</header>
      <section class="panel"><div class="bag-h"><h2 class="h2">Топ-100</h2><span class="muted">всего в рейтинге: ${r.total}</span></div>
        <ol class="srl">${r.top.map((x, i) => row(x, i, me && x.login === me.login)).join('')}</ol>
        ${tail}
      </section></div>`;
  }


   
  const JK = [['all', 'Всё'], ['fight', 'Бой'], ['boss', 'Закхуэль'], ['dice', 'Кости'], ['event', 'Событие'], ['trap', 'Ловушка'], ['shop', 'Покупка'], ['ench', 'Заточка'], ['auc', 'Аукцион'], ['look', 'Облик'], ['loot', 'Вещь'], ['find', 'Находка'], ['coins', 'Монеты'], ['hero', 'Герой'], ['award', 'Награда'], ['store', 'Склад'], ['ach', 'Достижение'], ['trade', 'Обмен'], ['bug', 'Репорт'], ['soc', 'Соц. рейтинг'], ['mail', 'Почта'], ['guild', 'Гильдия']];
  const JKN = Object.fromEntries(JK);

  const JT = [['all', 'Все', null], ['fight', 'Бой', ['fight', 'boss', 'trap', 'hero']], ['shop', 'Покупки', ['shop', 'look', 'ench', 'auc', 'store', 'trade']], ['find', 'Находки', ['loot', 'find']], ['coins', 'Монеты', ['coins', 'dice', 'event', 'auc', 'trade']], ['ach', 'Достижения', ['ach']], ['guild', 'Гильдия', ['guild']]];
  const JTK = Object.fromEntries(JT.map(([k, , ks]) => [k, ks]));
  const JR = { win: 'Победа', lose: 'Неудача', tie: 'Ничья' };
  const JRK = { dice: { win: 'Выиграл', lose: 'Проиграл', tie: 'Ничья' }, fight: { win: 'Победа', lose: 'Поражение' }, boss: { win: 'Победа', lose: 'Поражение' }, trap: { win: 'Справился', lose: 'Пострадал' }, shop: { win: 'Готово', lose: 'Не вышло' }, hero: { win: '', lose: '' }, ach: { win: 'Открыто' }, guild: { win: 'Победа', lose: 'Поражение', tie: 'Ничья' }, store: { win: '', lose: '' } };
  let jf = 'all', JL = null, jAt = '', JITEMS = {}, jSeq = 0, jNext = null, jCap = 300, jMoreP = null;
  try { const v = localStorage.getItem('lgJf'); if (v && JTK[v] !== undefined) jf = v; } catch {}

  function goView(v) { view = v; try { localStorage.setItem('lgView', view); } catch {} renderHero(); if (v === 'log') { const t = $('#tab-hero'); if (t && t.getBoundingClientRect().top < 0) t.scrollIntoView({ block: 'start' }); } }
  const logOn = () => view === 'log' && $('#tab-hero').classList.contains('on') && !!$('#jrFull');
  async function loadLog() {
    const el = $('#jrFull'); if (!el) return;
    if (!ME || !ME.user) { el.innerHTML = '<div class="panel jr-out"><h2 class="h2">Журнал</h2><p class="lead">Войди через Twitch — здесь появятся главные события твоего героя: бои, находки, новые вещи, покупки, выигрыши и награды монетами, новые уровни, смерть и воскрешение.</p></div>'; return; }
    if (!JL) el.innerHTML = '<p class="empty">Открываю журнал…</p>';
    const want = jf, seq = ++jSeq;
    const r = await api('/api/journal?tab=' + encodeURIComponent(want));
    if (seq !== jSeq || !$('#jrFull')) return;
    if (!r || !r.ok) { if (!JL) el.innerHTML = '<div class="panel"><p class="empty">Журнал пока не загрузился. Обнови страницу чуть позже.</p></div>'; return; }
    if (r.items) JITEMS = r.items;
    const k = want + JSON.stringify(r.list || []); if (JL && k === jAt) return; jAt = k;
    JL = r.list || []; jNext = r.next || null; jCap = 300; renderLog();
  }

  async function moreLog() {
    if (!jNext || jMoreP) return;
    const want = jf, seq = jSeq;
    jMoreP = api('/api/journal?tab=' + encodeURIComponent(want) + '&before=' + encodeURIComponent(jNext));
    let r = null; try { r = await jMoreP; } catch {} finally { jMoreP = null; }
    if (seq !== jSeq || want !== jf || !JL) return;
    if (!r || !r.ok) { const b = $('#jrFull [data-jmore]'); if (b) b.textContent = 'Не загрузилось - ещё раз'; return; }
    const ids = new Set(JL.map((e) => e.id));
    for (const e of r.list || []) if (!ids.has(e.id)) JL.push(e);
    jCap = JL.length; jNext = r.next || null; jAt = '';
    renderLog();
  }


  let JA = null, jaP = null, jaFail = 0;
  const JMINI = 5;
  function loadMini(force) {
    if (jaP || !ME || !ME.user || (!force && Date.now() - jaFail < 60000)) return;
    jaP = api('/api/journal?tab=all').then((r) => { if (r && r.ok) { if (r.items) JITEMS = r.items; JA = r.list || []; miniPatch(); if (window.LGQuest && window.LGQuest.hero) window.LGQuest.hero(); if (typeof questIdleRefresh === 'function') questIdleRefresh(); } else jaFail = Date.now(); }, () => { jaFail = Date.now(); }).finally(() => { jaP = null; });
  }



  const jrShown = () => !!(document.querySelector('#tab-hero.on') || document.querySelector('#tab-quest.on'));
  function jrWant() { if (!JA && ME && ME.user && jrShown()) loadMini(); }
  function jrMini(n = JMINI, go) {
    if (!JA && (go || jrShown())) loadMini();
    const head = `<div class="jr-mh"><h2 class="h3">Журнал</h2>${JA && JA.length ? '<button type="button" class="jr-more" data-view="log">Весь журнал</button>' : ''}</div>`;
    if (!JA) return `<div class="jr-mini">${head}<p class="muted">Открываю…</p></div>`;
    if (!JA.length) return `<div class="jr-mini">${head}<p class="muted">Пока пусто. Сюда попадут бои, находки, покупки, выигрыши и награды.</p></div>`;
    const when = (t) => { const d = dayName(t); return d === 'Сегодня' ? hm(t) : d === 'Вчера' ? 'вчера' : new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }); };
    const li = (e) => { const lbl = e.r ? ((JRK[e.k] || JR)[e.r] ?? JR[e.r]) : '', t = itemText(e.t);
      return `<li data-k="${esc(e.k)}"><time datetime="${new Date(e.at).toISOString()}">${esc(when(e.at))}</time><span class="jr-t" title="${esc(t)}">${esc(t)}</span><span class="jr-m">${lbl ? `<span class="jr-r ${e.r}">${esc(lbl)}</span>` : ''}${coinsTxt(+e.c || 0)}</span></li>`; };
    return `<div class="jr-mini">${head}<ol class="jr-ml" aria-label="Последние события">${JA.slice(0, n).map(li).join('')}</ol></div>`;
  }
  function miniPatch() {
    const m = $('#tab-hero .jr-mini'); if (!m) return;
    m.outerHTML = jrMini();
    $$('#tab-hero .jr-mini [data-view]').forEach((b) => b.onclick = () => goView(b.dataset.view));
  }
  function logAdd(list) {
    if (!Array.isArray(list)) return;
    if (JA) { const ids = new Map(JA.map((e, i) => [e.id, i])); for (const e of list) { if (ids.has(e.id)) JA[ids.get(e.id)] = e; else JA.unshift(e); } JA.sort((a, b) => b.at - a.at); if (JA.length > 300) JA.length = 300; miniPatch();  if (window.LGQuest && window.LGQuest.hero) window.LGQuest.hero(); if (typeof questIdleRefresh === 'function') questIdleRefresh(); }
    if (!JL) return;
    const ks = JTK[jf], ids = new Set(JL.map((e) => e.id));
    let n = 0;
    for (const e of list) { if (ks && !ks.includes(e.k)) continue; if (ids.has(e.id)) { const i = JL.findIndex((x) => x.id === e.id); JL[i] = e; } else { JL.unshift(e); n++; } }
    JL.sort((a, b) => b.at - a.at); if (JL.length > Math.max(300, jCap)) JL.length = Math.max(300, jCap);
    jAt = '';
    if ((n || list.length) && logOn()) renderLog();
  }

  let nameMap = null, nameMapFor = '';
  function itemText(t) {
    try {
      const st = sty() + '|' + Object.keys(JITEMS).length;
      if (nameMapFor !== st) {
        nameMap = new Map(); nameMapFor = st;
        const N = (D() && D().names) || {};
        for (const [id, ns] of Object.entries(JITEMS)) {
          const all = [...ns]; for (const k of Object.keys(N)) { const x = N[k] && N[k].items && N[k].items[id]; if (x && x.name) all.push(x.name); }
          const mine = nameOf({ id, baseName: ns[ns.length - 1], name: ns[0] });
          for (const n of all) if (n && n !== mine && !nameMap.has(n)) nameMap.set(n, mine);
        }
      }
      return nameMap.size ? String(t).replace(/«([^»]+)»/g, (m, n) => (nameMap.has(n) ? `«${nameMap.get(n)}»` : m)) : t;
    } catch { return t; }
  }
  const dayName = (t) => { const d = new Date(t), now = new Date(), a = new Date(d.getFullYear(), d.getMonth(), d.getDate()), b = new Date(now.getFullYear(), now.getMonth(), now.getDate()), diff = Math.round((b - a) / 864e5);
    return diff === 0 ? 'Сегодня' : diff === 1 ? 'Вчера' : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }); };
  const hm = (t) => new Date(t).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const coinsTxt = (c) => (c ? `<span class="jr-c ${c > 0 ? 'up' : 'dn'}">${c > 0 ? '+' : '−'}${money(Math.abs(c))}</span>` : '');
  


  const JCL_PEND = new Set();
  const jClaimBtn = (e) => (e.cl && !e.cl.done ? `<button type="button" class="btn jr-cl" data-jclaim="${esc(e.id)}"${JCL_PEND.has(e.id) ? ' disabled' : ''}>${esc(e.cl.go || 'Забрать')}</button>` : '');
  const jEntry = (id) => (JL || []).find((x) => x.id === id) || (JA || []).find((x) => x.id === id) || null;
  async function jClaimSend(id, o, pick) {
    JCL_PEND.add(id); if (logOn()) renderLog();
    const r = await api('/api/jClaim', { id, ...(o ? { o } : {}), ...(pick ? { pick } : {}) }).catch(() => null);
    if (!r || !r.ok) { JCL_PEND.delete(id); if (logOn()) renderLog(); toast((r && r.error) || 'Забрать не вышло - попробуй ещё раз', true); throw new Error('jClaim'); }
    toast('Награда в пути - через пару секунд будет у тебя');
  }
  async function jClaim(b) {
    const e = jEntry(b.dataset.jclaim); if (!e || !e.cl) return;
    if (e.cl.pick) {
      try {
        if (!window.LGHwNpc || !window.LGHwNpc.pickOpen) await loadJs(`/site/hwnpc.js?v=${(window.LG_CITYV || {}).hn || ''}`);
        window.LGHwNpc.pickOpen({ rows: e.cl.rows || [], hero: () => ME && ME.hero, title: 'Эпическое оружие на выбор', go: 'Забрать', hint: 'Награда 20-го огня пасса. Можно взять оружие любого класса - один раз.', pick: (id) => jClaimSend(e.id, e.cl.o, id) });
      } catch (x) { toast('Окно выбора не загрузилось - обнови страницу', true); }
      return;
    }
    jClaimSend(e.id, e.cl.o).catch(() => null);
  }

  function jClaimDone(x) {
    const r = x.x || {}, id = r.jid; JCL_PEND.delete(id);
    for (const L of [JL, JA]) { const e = L && L.find((y) => y.id === id); if (!e) continue; if (r.t) e.t = r.t; if (r.cl) e.cl = r.cl; else if (r.closed) e.cl = { ...(e.cl || {}), done: 1 }; }
    if (logOn()) renderLog(); miniPatch();
    toast(x.ok ? `Получено: ${r.got || 'награда'}${r.full ? ' (остальное не влезло в сумку - освободи место и нажми ещё раз)' : ''}` : (x.error || 'Забрать не вышло'), !x.ok);
  }
  function renderLog() {
    const el = $('#jrFull'), all = JL || []; if (!el) return;
    const list = all;

    const W = list.filter((e) => e.r === 'win').length, Ls = list.filter((e) => e.r === 'lose').length, Ti = list.filter((e) => e.r === 'tie').length;
    const C = list.reduce((a, e) => a + (+e.c || 0), 0), X = list.reduce((a, e) => a + (+e.x || 0), 0);
    const PW = jf === 'fight' ? [['победа', 'победы', 'побед'], ['поражение', 'поражения', 'поражений']] : [['удача', 'удачи', 'удач'], ['неудача', 'неудачи', 'неудач']];
    const sum = jf === 'all' ? '' : [W ? `<span><b class="up">${W}</b> ${plural(W, ...PW[0])}</span>` : '', Ls ? `<span><b class="dn">${Ls}</b> ${plural(Ls, ...PW[1])}</span>` : '', Ti ? `<span><b>${Ti}</b> ${plural(Ti, 'ничья', 'ничьи', 'ничьих')}</span>` : '',
      C ? `<span>монеты ${coinsTxt(C)}</span>` : '', X ? `<span><b>+${X}</b> опыта</span>` : ''].filter(Boolean).join('');
    let rows = '', day = '';
    for (const e of list) {
      const d = dayName(e.at); if (d !== day) { day = d; rows += `<li class="jr-day">${esc(d)}</li>`; }
      const lbl = e.r ? ((JRK[e.k] || JR)[e.r] ?? JR[e.r]) : '';
      rows += `<li class="jr-e" data-k="${esc(e.k)}"><time datetime="${new Date(e.at).toISOString()}">${hm(e.at)}</time><span class="jr-k">${esc(JKN[e.k] || 'Прочее')}</span><p class="jr-t">${esc(itemText(e.t))}</p>`
        + `<span class="jr-m">${lbl ? `<span class="jr-r ${e.r}">${esc(lbl)}</span>` : ''}${coinsTxt(+e.c || 0)}${+e.x ? `<span class="jr-x">+${+e.x} опыта</span>` : ''}${jClaimBtn(e)}</span></li>`;
    }
    const EMPTY = { all: 'Журнал пуст. Сюда попадут бои, находки, новые вещи, покупки, выигрыши и проигрыши, награды монетами, новые уровни, смерть и воскрешение героя.', fight: 'Боёв пока не было.', shop: 'Покупок пока не было.', find: 'Находок пока не было.', coins: 'Монет пока не было.' };
    el.innerHTML = `<div class="jr panel">
      <div class="bag-h"><h2 class="h2">Журнал</h2><span class="muted">${all.length ? `${all.length} ${plural(all.length, 'запись', 'записи', 'записей')}${jNext ? ' · последние' : ''}` : ''}</span></div>
      <div class="filters jr-tabs" role="group" aria-label="Что показать">${JT.map(([k, l]) => `<button type="button" data-jf="${k}" aria-pressed="${jf === k}">${l}</button>`).join('')}</div>
      ${sum ? `<div class="jr-sum">${sum}</div>` : ''}
      ${list.length ? `<ol class="jr-list">${rows}</ol>` : `<p class="empty">${EMPTY[jf] || EMPTY.all}</p>`}
      ${jNext && list.length ? '<button type="button" class="btn jr-page" data-jmore>Показать ещё</button>' : ''}
      <p class="foot">Журнал обновляется сам, через несколько секунд после события.</p>
    </div>`;
    const mb = el.querySelector('[data-jmore]'); if (mb) mb.onclick = () => { mb.disabled = true; mb.textContent = 'Загружаю…'; moreLog(); };
    el.querySelectorAll('[data-jclaim]').forEach((b) => b.onclick = () => jClaim(b));
    el.querySelectorAll('[data-jf]').forEach((b) => b.onclick = () => { if (jf === b.dataset.jf) return; jf = b.dataset.jf; try { localStorage.setItem('lgJf', jf); } catch {} JL = null; jAt = ''; jNext = null; jCap = 300; loadLog(); });
  }

  const loadJs = (src) => new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = src; sc.onload = ok; sc.onerror = no; document.head.appendChild(sc); });
  





  const TABS = {"war":{"css":["warcmd.css"],"js":["warcmd.js"]},"season":{"css":["season.css"],"js":["season.js"]},"city":{"css":["city.css","cityshop.css","citystore.css","b-forge.css","b-tent.css","b-shop.css","b-hall.css","b-board.css","b-trainer.css","guildhall-entry.css","guilds-entry.css"],"js":["@cityfair.js","citymap.js","cityart.js","citygl.js","itemgrid.js","/lib/site-chat.js","citystore.js",{"all":["cityshop.js","b-forge.js","b-tent.js","b-shop.js","b-magic.js","b-hall.js","b-board.js","b-trainer.js"]},"city.js","trade.js",{"src":"citymon.js","soft":true}]},"quest":{"css":["quest.css"],"js":["q/crowdcam.js","q/battlecrowd.js","q/shelf.js","quest.js"]},"mine":{"css":["mine.css"],"js":["craftworld.js","mine-art.js","mine.js",{"src":"itemgrid.js","unless":"LGItems","soft":true},{"src":"/lib/site-chat.js","unless":"LGChat","soft":true}]},"craft":{"css":["craft.css"],"js":["craft.js"]},"fish2":{"css":["fish2.css"],"js":["fish2.js"]},"guilds":{"css":["guilds.css"],"js":[{"src":"emblems.js","unless":"LGEmblems"},"guilds.js"]},"arena":{"css":["arena-field.css","arena.css"],"js":["arena-field.js","arena.js"]},"guildhall":{"css":["guildhall.css"],"js":[{"src":"emblems.js","unless":"LGEmblems"},"guildhall.js"]},"dailies":{"css":["dailies.css"],"js":["dailies.js"]},"mail":{"css":["mail.css"],"js":["mail.js"]},"world":{"css":["worldmap.css"],"js":["worldmap.js"]},"minimap":{"css":["minimap.css"],"js":["minimap.js"]}};
  const tabSrc = (n) => (n[0] === '@' ? `${window.LG_BASE || ''}/${n.slice(1)}` : n[0] === '/' ? n : `/site/${n}`) + `?v=${(window.LG_SITEF || {})[n] || ''}`;
  function tabCss(id) {
    let at = null;
    (TABS[id].css || []).forEach((f, k) => {
      const cid = k ? `${id}Css-${f}` : `${id}Css`, was = document.getElementById(cid);
      if (was) { at = was; return; }
      const l = document.createElement('link'); l.id = cid; l.rel = 'stylesheet'; l.href = tabSrc(f);
      if (at) at.after(l); else document.head.appendChild(l);
      at = l;
    });
  }
  




  const PRE = new Set();
  const PF = (() => { try { return document.createElement('link').relList.supports('prefetch'); } catch { return false; } })();
  function preJs(src, o) {
    o = o || {};
    if (!src || PRE.has(src)) return;
    PRE.add(src);
    if (o.idle && !PF) { fetch(src, { credentials: 'same-origin' }).catch(() => PRE.delete(src)); return; }
    const l = document.createElement('link');
    if (o.idle) l.rel = 'prefetch'; else { l.rel = 'preload'; l.as = o.as || 'script'; }
    if (o.as === 'fetch') l.crossOrigin = 'anonymous';
    l.onerror = () => PRE.delete(src);
    l.href = src;
    document.head.appendChild(l);
  }
  const tabNames = (id) => ((TABS[id] && TABS[id].js) || []).flatMap((j) => (typeof j === 'string' ? [j] : j.all ? j.all : j.unless && window[j.unless] ? [] : [j.src]));
  function tabPre(id, idle) { tabNames(id).forEach((n) => preJs(tabSrc(n), { idle })); }
  function tabFiles(id) {
    tabCss(id);
    tabPre(id);
    const one =(j) => (typeof j === 'string' ? loadJs(tabSrc(j)) : j.all ? Promise.all(j.all.map((f) => loadJs(tabSrc(f))))
      : j.unless && window[j.unless] ? null : loadJs(tabSrc(j.src)).catch((e) => { if (!j.soft) throw e; return null; }));
    return (TABS[id].js || []).reduce((p, j) => p.then(() => one(j)), Promise.resolve());
  }

  


  let questLoading = null, questOn = false, questPend = null, questParty = '', questHeld = null;



  const cityLocked = () => questOn && questParty === 'in' && cityMe === 'in' && !townEntry;
  const questOk = () => !!(ME && ME.hero && ME.hero.qt);

  const questAlways = () => !!(ME && ME.hero && ME.hero.qt && ME.hero.qv);
  let questKind = '';
  function questFiles() {
    if (questLoading) return questLoading;

    questLoading = tabFiles('quest').then(() => { window.LGQuest.init(QX); }).catch((e) => { questLoading = null; throw e; });
    return questLoading;
  }
  const QX = {

    jrHtml: (n) => jrMini(n, true), jrAll: () => { tab('hero'); goView('log'); },


    invData: () => { const h = ME && ME.hero; return h ? { hero: h, items: (h.items || []).slice().sort((a, b) => (a.no || 1e9) - (b.no || 1e9)), stack: (h.sg && h.sg.bs) || 20, bagCap: h.sg ? h.sg.cap : null, ...(+h.ob > 0 ? { obCap: +h.ob } : {}), pins: candyPins(h) } : null; },
    invMount: (host, dollEl, root) => {
      const d = QX.invData(); if (!d || !window.LGInventory) return null;

      const trash = (uid) => { if (inv) inv.discard(uid); };
      const inv = window.LGInventory.mount(host, { variant: 'compact', mode: 'equip', data: d,
        actions: {
          equip: (uid) => (inv2Busy() ? null : act('/api/equip', { uid }, word('on', 'Надето'))),
          unequip: (slot) => (inv2Busy() ? null : act('/api/unequip', { slot }, word('off', 'Снято'))),
          use: (uid) => { const it = ME.hero.items.find((x) => x.uid === uid); return act('/api/use', { uid }, it && eatVerb(it) === 'Выпить' ? 'Выпито' : 'Съедено'); },
          reorder: (from, to) => (ordOk(ME && ME.hero) ? ordSave(ordMove(ME.hero, from, to), from) : null),
          discard: async (uids, it, n) => { await act('/api/discard', { uids }, `Выброшено: ${it.name}${n > 1 ? ` ×${n}` : ''}`); const d2 = QX.invData(); if (inv && d2) inv.update(d2); },
        },
        options: {
          trashWhy: (it) => (GD.discardWhy ? GD.discardWhy(it) : ''),
          header: false, vitals: false, storeKey: 'lgQInv', label: word('bag', 'Сумка'), dollEl, dragRoot: root,
          filters: ['all', 'weapon', 'armor', 'helmet', 'shield', 'trinket', 'use', 'other'], art: (it) => art(it),
          figure: (hh) => { const st = hh.stats || {}, mx = st.hp || 0, nw = hh.hpNow ?? mx; return doodle(hh.login, heroLook(hh), mx && nw / mx < 0.3 ? 'hurt' : 'stern', hh.ghost ? undefined : 'battle'); },
          cardTip: (c, it) => cardTip(c, it, ME.hero), tipHide: () => tipHide(), pinTip: (b, p) => candyTip(b, p.n),
          canUse: (it) => (eatCd(it, ME.hero) && !(it && it.effect && it.effect.hw) ? 'Еда и зелья ещё не готовы' : true),
          extra: (c) => (c.it.no ? `<span class="no" title="Номер в сумке - для команд в чате">${c.it.no}</span>` : ''),
          menu: (c, it, e) => { const t = TIPS[it.uid] || Object.values(TIPS).find((x) => x.uids && x.uids.includes(it.uid)) || { ...it, n: 1, uids: [it.uid] }; ctxMenu(e.clientX, e.clientY, t, ME.hero, { discard: trash }); },
          say: (t) => toast(t, true),
        } });
      return inv;
    },
    login: () => (ME && ME.user ? String(ME.user.login).toLowerCase() : ''), hero: () => (ME && ME.hero) || null, now: () => gnow(),
    doodle: (l, h, mood, k) => doodle(l, h, mood, k), esc: (s) => esc(s), tab: (id) => tab(id), money: (n, r) => money(n, r), moneyText: (n, r) => moneyText(n, r), lack: (p, hv, c) => lackHtml(p, hv, c), bal: (p, hv, c) => balHtml(p, hv, c),
    role: (r) => { const n = names().roles; return (n && n[r]) || ROLE_BASE[r] || r; },
    bar: () => document.getElementById('qbar'), el: () => document.getElementById('tab-quest'),
    showing: () => document.getElementById('tab-quest').classList.contains('on'),

    onOff: (on, party, kind) => {
      const p = on ? String(party || '') : '', k = on ? String(kind || '') : '', same = questOn === !!on && questParty === p;
      if (same && questKind === k) return;
      questOn = !!on; questParty = p; questKind = k; questVis();
      if (same) return;
      cityVis(); try { if (window.LGCity && window.LGCity.questChanged) window.LGCity.questChanged(); } catch (e) { console.warn('questChanged', e); }
    },
    foes: () => questFoes(),

    art: (it) => art(it),
    goodTip: (el, it) => cardTip(el, { ...it, stats: it.stats || {}, wearable: SLOTS.includes(it.slot), on: false, uids: [] }, (ME && ME.hero) || null),
    tipHide: () => tipHide(), tipFor: () => tipFor,
    cardTip: (el, it) => cardTip(el, it, (ME && ME.hero) || null),

    dungeon: () => questDungeon(),
    vote: (vid, n) => api('/api/qvote', { vid, n }), toast: (t, bad) => toast(t, bad),

    act: (p) => api('/api/qact', p), say: (line) => api('/api/qsay', { line }),
    lootFind: (q) => api('/api/qloot?q=' + encodeURIComponent(String(q || '').slice(0, 40))),
    eat: (uid, btn) => { const it = ME && ME.hero && (ME.hero.items || []).find((x) => x.uid === uid); return act('/api/use', { uid }, it && eatVerb(it) === 'Выпить' ? 'Выпито' : 'Съедено', btn); },


    openTown: (id) => { townEntry = Date.now(); cityFiles().then(() => { if (window.LGCity && window.LGCity.town) window.LGCity.town(id); tab('city'); }).catch(() => toast('Город не загрузился — проверь связь', true)); },
  };
  let townEntry = 0;

  let questFoesP = null;
  function questFoes() {
    if (window.QBattle && window.QBattle.foe) return Promise.resolve();
    if (questFoesP) return questFoesP;
    const V = window.LG_QV || {}, base = window.LG_BASE || '';
    questFoesP = (window.QArt ? Promise.resolve() : loadJs(`/site/q/artkit.js?v=${V.ak || ''}`)).then(() => loadJs(`${base}/questfoes.js?v=${V.foes || ''}`)).then(() => loadJs(`/site/q/battle.js?v=${V.bt || ''}`))
      .catch((e) => { questFoesP = null; throw e; });
    return questFoesP;
  }
  let questDgP = null;
  function questDungeon() {
    if (window.MDDoodle && window.MDDoodle.dungeonBuild) return Promise.resolve();
    if (questDgP) return questDgP;
    const V = window.LG_QV || {}, base = window.LG_BASE || '';
    questDgP = loadJs(`${base}/questdungeon.js?v=${V.dg || ''}`).catch((e) => { questDgP = null; throw e; });
    return questDgP;
  }


  let questForm = null;
  function questFormFill(d) {
    const b = d && d.b; if (!b || !b.fk) return;
    if (Array.isArray(b.form)) questForm = { k: b.fk, f: b.form };
    else b.form = questForm && questForm.k === b.fk ? questForm.f : [];
  }
  function questData(d, t) {
    questFormFill(d);
    if (t) clock(t);

    if (!questOk() || DOCK) { questHeld = DOCK ? null : d; return; }
    questHeld = null;
    cityFresh(d);
    if (window.LGQuest) { window.LGQuest.data(d); return; }
    questPend = d; if (!d || !d.on) return;
    questFiles().then(() => {
      if (questPend) { window.LGQuest.data(questPend); questPend = null; }

      if (questAlways() && $('#tab-quest').classList.contains('on')) window.LGQuest.show(true);
    }).catch((e) => { console.warn('quest files', e); });
  }
  function questVis() {
    if (questHeld && questOk()) { const d = questHeld; questHeld = null; questData(d); }
    const b = $('.tabs button[data-tab="quest"]'); if (!b) return;
    const live = questOk() && questOn, al = questAlways();
    b.hidden = !(live || al);
    questBadge(b, al, live);
    if (!questOk() && window.LGQuest) window.LGQuest.data({ on: false });

    if (!live && !al && $('#tab-quest').classList.contains('on')) tab('hero');
    else if (!live && al && $('#tab-quest').classList.contains('on')) questIdle();
  }


  function questBadge(b, al, live) {
    let g = b.querySelector('.tq-b');
    if (!al) { if (g) g.hidden = true; b.removeAttribute('data-qs'); b.removeAttribute('title'); return; }
    if (!g) { g = document.createElement('span'); g.className = 'tq-b'; b.appendChild(g); }
    const st = live ? (questKind === 'gather' ? 'gather' : 'live') : 'idle';
    if (b.dataset.qs !== st) b.dataset.qs = st;
    g.hidden = !live;
    const t = st === 'gather' ? 'сбор' : st === 'live' ? 'идёт' : '';
    if (g.textContent !== t) g.textContent = t;
    b.title = live ? (st === 'gather' ? 'Идёт сбор отряда в поход' : 'Поход идёт') : 'Сейчас поход не идёт';
  }


  const QJ_KINDS = ['fight', 'boss', 'trap'];
  function questIdleHtml() {
    let last = '';
    try {
      const e = (typeof JA !== 'undefined' && JA ? JA : []).find((x) => QJ_KINDS.includes(x.k));
      if (e) {
        const d = new Date(e.at), now = new Date(), diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
        const when = diff === 0 ? 'сегодня' : diff === 1 ? 'вчера' : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        const lbl = e.r && typeof JRK !== 'undefined' ? ((JRK[e.k] || JR)[e.r] ?? JR[e.r]) : '';
        last = `<div class="qi-last"><h3 class="h3">Последнее в журнале героя</h3><p><time datetime="${d.toISOString()}">${esc(when)}</time> ${esc(itemText(e.t))}${lbl ? ` <span class="jr-r ${esc(e.r)}">${esc(lbl)}</span>` : ''}</p></div>`;
      }
    } catch (e) { console.warn('quest idle', e); }
    return '<section class="qi-idle" aria-label="Поход сейчас не идёт">'
      + '<h2 class="h2">Сейчас поход не идёт</h2>'
      + '<p class="lead">Когда стример начнёт сбор отряда - здесь появится поход: пиши в чат <b>поход</b>, чтобы вступить.</p>'
      + last + '</section>';
  }


  let questIdleKey = '';
  function questIdle(force) {
    const el = $('#tab-quest'); if (!el || !questAlways() || (questOk() && questOn)) return;
    if (window.LGQuest) { if (force) window.LGQuest.show(true); return; }
    const h = questIdleHtml(); if (questIdleKey !== h || !el.firstChild) { questIdleKey = h; el.innerHTML = h; }
  }
  function questIdleRefresh() { if ($('#tab-quest').classList.contains('on')) questIdle(true); }
  QX.idle = () => (questAlways() ? questIdleHtml() : ''); QX.always = () => questAlways();
  function questTab(on) { if (window.LGQuest) window.LGQuest.show(on); if (on) questIdle(); }

  

  let worldWant = false, worldLoading = null;
  const worldOk = () => !!(ME && ME.hero && ME.hero.wt);
  function worldVis() {
    const b = $('.tabs button[data-tab="world"]'); if (!b) return;
    const ok = worldOk();
    b.hidden = !ok;
    if (!ok && $('#tab-world').classList.contains('on')) tab('hero');
    if (ok && worldWant) { worldWant = false; tab('world'); }
  }
  function worldFiles() {
    if (worldLoading) return worldLoading;
    worldLoading = tabFiles('world').catch((e) => { worldLoading = null; throw e; });
    return worldLoading;
  }
  const WX = {
    api: (p) => api(p), now: () => now(), toast: (t, bad) => toast(t, bad),


    openTown: (id, why) => { if (cityLocked() && why !== 'party') { toast(CITY_QUEST_T, true); return; } QX.openTown(id); },
  };
  async function openWorld() {
    WX.art = !!(ME && ME.hero && ME.hero.wa);
    const el = $('#tab-world');
    if (!worldOk()) { el.innerHTML = SU.note('Карта мира пока закрыта.'); return; }
    if (!window.LGWorld && !(await SU.loadInto(el, worldFiles, 'Карта мира разворачивается…', 'Карта мира не загрузилась — проверь связь и открой вкладку ещё раз.'))) return;
    if (!$('#tab-world').classList.contains('on') || !window.LGWorld) return;
    window.LGWorld.open(el, WX);
  }


  


  let mmLoading = null;
  function mmFiles() {
    if (window.LGMiniMap) return Promise.resolve();
    if (mmLoading) return mmLoading;
    mmLoading = tabFiles('minimap').catch((e) => { mmLoading = null; throw e; });
    return mmLoading;
  }
  const MMX = {
    api: (p) => api(p), rootApi: (p) => api(DEMO ? p : location.origin + p), now: () => now(),
    me: () => (ME && ME.user ? { login: String(ME.user.login).toLowerCase(), name: ME.user.name } : null),
    channel: () => (CH ? CH.login.toLowerCase() : ''),
    login: () => (window.LG_LOGIN || '/auth/login'),

    where: () => {
      try {
        const C = window.LGCity, w = C && C.where ? C.where() : null; if (!w || !w.id) return null;
        const T = C.towns ? C.towns() : null, t = T && Array.isArray(T.list) ? T.list.find((x) => x.id === w.id) : null;
        return { id: String(w.id), name: t && t.name ? String(t.name) : '' };
      } catch (e) { return null; }
    },

    worldTab: () => (worldOk() ? () => tab('world') : null),
  };
  window.LegionMiniMap = {
     
    async open(o) {
      try { await mmFiles(); } catch (e) { toast('Мини-карта не загрузилась - проверь связь', true); return false; }
      window.LGMiniMap.open(MMX, o || {}); return true;
    },
    close() { if (window.LGMiniMap) window.LGMiniMap.close(); },
     
    widget(el, o) {
      if (!el) return null;
      mmFiles().then(() => window.LGMiniMap.widget(el, MMX, o || {})).catch((e) => console.warn('мини-карта: файлы не загрузились', e));
      return el;
    },
    refresh() { return window.LGMiniMap ? window.LGMiniMap.refresh() : Promise.resolve(); },
  };

  



  const ML = { n: 0, w: 0, off: true, asked: false, loading: null, t: 0 };
  function mlFiles() {
    if (window.LGMailWin) return Promise.resolve();
    if (ML.loading) return ML.loading;
    ML.loading = tabFiles('mail').catch((e) => { ML.loading = null; throw e; });
    return ML.loading;
  }
  function mlSet(n, w, off) {
    const nn = Math.max(0, Math.floor(+n || 0)), ww = Math.max(0, Math.floor(+w || 0)), oo = !!off;
    if (nn === ML.n && ww === ML.w && oo === ML.off) return;
    ML.n = nn; ML.w = ww; ML.off = oo;
    try { window.dispatchEvent(new CustomEvent('lgmail', { detail: { unread: nn, wait: ww, off: oo } })); } catch (e) {   }
  }
  function mlCount() {
    if (DEMO || !ME || !ME.user || document.hidden) return Promise.resolve();
    return api((window.LG_BASE || '') + '/api/mail/count').then((r) => { ML.asked = true; if (r && r.ok) mlSet(r.unread, r.wait, r.off); });
  }
  const MLX = {
    base: () => window.LG_BASE || '',
    api: (p, body) => api((window.LG_BASE || '') + p, body),
    me: () => (ME && ME.user ? { login: String(ME.user.login).toLowerCase(), name: ME.user.name } : null),
    channel: () => (CH ? CH.login.toLowerCase() : ''),
    toast: (t, bad) => toast(t, bad),
    esc: (s) => esc(s),
    count: (n, w) => mlSet(n, w, false),
    hero: () => { try { if (typeof load === 'function') load(); } catch (e) {   } },
  };
  window.LGMail = {
     
    async open(o) {
      if (!ME || !ME.user) { toast('Почта - войди через Twitch', true); return false; }
      if (!ML.asked) await mlCount();
      if (ML.off) { toast('Почта - скоро'); return false; }
      try { await mlFiles(); } catch (e) { toast('Почта не загрузилась - проверь связь', true); return false; }
      window.LGMailWin.open(MLX, o || {}); return true;
    },
    close() { if (window.LGMailWin) window.LGMailWin.close(); },
     
    unread() { return ML.off ? 0 : ML.n; },
     
    wait() { return ML.off ? 0 : ML.w; },
     
    on() { return !ML.off; },
     
    onEvent(d) { if (d && typeof d === 'object') { mlSet(d.n, d.w, false); if (window.LGMailWin) window.LGMailWin.onEvent(d); } },
    refresh: () => mlCount(),
  };

  function mlTick() { clearTimeout(ML.t); ML.t = setTimeout(() => { mlCount().finally(mlTick); }, 300_000); }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && ME && ME.user) mlCount(); });

  (function mlFirst(k) { if (ME && ME.user) { mlCount().finally(mlTick); return; } if (k < 30) setTimeout(() => mlFirst(k + 1), 2000); })(0);

  







  const DLB = { bar: null, key: '', obs: null, seen: false, data: null, win: null };
  const dlOf = () => (ME && ME.user && ME.hero && ME.hero.dl) || null;
  const dlDays = (n) => { const a = n % 10, b = n % 100; return n + ' ' + (a === 1 && b !== 11 ? 'день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'дня' : 'дней'); };
  function dlCss() {
    if (document.getElementById('dailiesCss')) return;
    const l = document.createElement('link'); l.id = 'dailiesCss'; l.rel = 'stylesheet'; l.href = tabSrc('dailies.css'); document.head.appendChild(l);
  }
  function dlBarHtml(d) {
    const all = d.of > 0 && d.n >= d.of;
    return `<button type="button" class="dl-open" data-dl-open aria-haspopup="dialog"><b>Задания дня</b><span class="dl-n${all ? ' is-all' : ''}">${d.n} из ${d.of}</span>`
      + (d.s > 0 ? `<span class="dl-st" title="Дней подряд с заходом">серия ${dlDays(d.s)}</span>` : '')
      + (d.g ? `<span class="dl-gl" title="Уровень гильдии">гильдия: ур. ${d.g}</span>` : '')
      + '<span class="dl-go" aria-hidden="true">›</span></button>';
  }
  function dlPlace() {
    const t = $('#tab-hero'), bar = DLB.bar; if (!t || !bar) return;

    const before = t.querySelector(':scope > .hero-views') || t.querySelector(':scope > .hero-grid') || t.firstChild;
    if (bar.parentNode !== t || bar.nextSibling !== before) t.insertBefore(bar, before);
  }
  function dlRender() {
    const d = dlOf();
    if (!d) { if (DLB.bar) { DLB.bar.remove(); DLB.bar = null; } DLB.key = ''; return; }
    dlCss();
    const t = $('#tab-hero');
    if (t && !DLB.obs && typeof MutationObserver === 'function') { DLB.obs = new MutationObserver(() => { if (DLB.bar) { dlPlace(); DLB.obs.takeRecords(); } }); DLB.obs.observe(t, { childList: true }); }
    if (!DLB.bar) { const b = DLB.bar = document.createElement('section'); b.className = 'dl-bar'; b.setAttribute('aria-label', 'Задания дня'); b.addEventListener('click', (e) => { if (e.target.closest('[data-dl-open]')) window.LGDailies.open(); }); DLB.key = ''; }
    const key = JSON.stringify(d);
    if (key !== DLB.key) { DLB.bar.innerHTML = dlBarHtml(d); DLB.key = key; }
    dlPlace();
    if (DLB.obs) DLB.obs.takeRecords();
    if (!DLB.seen) {
      DLB.seen = true;
      api('/api/dailies/act', { op: 'seen' }).then((r) => {
        if (r && r.ok && r.first) toast('Ежедневный вход засчитан' + (r.streak > 1 ? ` - серия ${dlDays(r.streak)}` : ''));
        if (r && r.ok) { DLB.data = r; if (window.LGDailiesWin) window.LGDailiesWin.refill(r); }
      });
    }
  }
  const DLH = { me: () => ME, money: (n) => money(n), toast: (t, bad) => toast(t, bad), data: () => DLB.data, keep: (r) => { DLB.data = r; } };
  function dlWin() {
    if (window.LGDailiesWin) return Promise.resolve(window.LGDailiesWin);
    if (!DLB.win) DLB.win = tabFiles('dailies').then(() => { if (!window.LGDailiesWin) throw new Error('dailies.js без LGDailiesWin'); return window.LGDailiesWin; }).catch((e) => { DLB.win = null; throw e; });
    return DLB.win;
  }
  const dlFail = (e) => { console.warn('[задания дня] окно', e); toast('Окно заданий не загрузилось - проверь связь', true); };

  if (!window.LGDailies) window.LGDailies = {
    sync() { setTimeout(dlRender, 0); },
    open() { if (!dlOf()) return; dlWin().then((W) => W.open(DLH), dlFail); },
     
    gift() { dlWin().then((W) => W.gift(DLH), dlFail); },
    giftCount: () => { const d = dlOf(); return d ? +d.gf || 0 : 0; },
    giftOn: () => !!dlOf(),
     
    state: () => ({ bar: !!DLB.bar, data: dlOf(), win: !!(window.LGDailiesWin && window.LGDailiesWin.state().win), loaded: !!window.LGDailiesWin }),
  };

  










  const GLE = { IDX: null, idxAt: 0, idxP: null, BADGE: 0, badgeAt: 0, badgeT: 0, go: false, off: !!window.LGGuilds, mo: null, entryT: 0, tick: 0, win: null, fails: 0, until: 0 };
  const GLE_TTL = 5 * 60e3, GLE_STEPS = [5e3, 10e3, 30e3, 60e3];
  const gleFail = () => { GLE.until = Date.now() + Math.round(GLE_STEPS[Math.min(GLE.fails, GLE_STEPS.length - 1)] * (0.8 + 0.4 * Math.random())); GLE.fails++; };
  const gleWait = () => Math.max(0, GLE.until - Date.now());
  function gleGet(p) {
    if (gleWait() > 0) return Promise.resolve({ ok: false, error: 'канал сейчас не отвечает', wait: gleWait() });
    return fetch((window.LG_BASE || '') + '/api/guilds' + p, { credentials: 'same-origin' }).then(async (r) => {
      if (r.status === 429 || r.status >= 500) gleFail(); else { GLE.fails = 0; GLE.until = 0; }
      try { const x = await r.json(); return x && typeof x === 'object' ? x : { ok: false, error: 'нет ответа' }; } catch (e) { return { ok: false, error: 'нет ответа' }; }
    }, () => { gleFail(); return { ok: false, error: 'нет связи' }; });
  }
  const gleShut = (r) => !!(r && !r.ok && (r.closed || r.unavailable || r.error === 'войди через Twitch'));
   
  function gleIndex(force) {
    const I = GLE.IDX;
    if (I && !I.ok && !gleShut(I) && !force && gleWait() > 0) return Promise.resolve(I);
    const ttl = I && !I.ok ? (gleShut(I) ? 2 * GLE_TTL : 0) : GLE_TTL;
    if (!force && I && Date.now() - GLE.idxAt < ttl) return Promise.resolve(I);
    if (GLE.idxP) return GLE.idxP;
    GLE.idxP = gleGet('?lite=1').then((r) => {
      GLE.idxP = null;
      if (!(r && r.wait && GLE.IDX && GLE.IDX.ok)) { GLE.IDX = r; GLE.idxAt = Date.now(); }
      glePaint(); return r;
    });
    return GLE.idxP;
  }

  function glePaint() {
    if (GLE.off || document.hidden) return;
    const hud = document.querySelector('.cy-hud'); if (!hud) return;
    const was = hud.querySelector('.gl-entry'), I = GLE.IDX;
    if (!I || !I.ok) { if (was && gleShut(I)) was.remove(); return; }
    const label = I.mine && I.mine.member ? 'Гильдия' : 'Гильдии';
    if (was) { const b = was.querySelector('b'); if (b && b.textContent !== label) b.textContent = label; return; }
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'gl-entry'; b.title = 'Гильдии альянса: вступить, создать, своя гильдия, задания наёмников';
    b.innerHTML = `<span aria-hidden="true">🛡</span><b>${label}</b>`;
    b.onclick = (e) => { e.stopPropagation(); window.LGGuilds.open(); };
    hud.insertBefore(b, hud.querySelector('.gh-entry') || null);
  }
  const gleSoon = () => { if (!GLE.entryT && !GLE.off) GLE.entryT = setTimeout(() => { GLE.entryT = 0; glePaint(); }, 400); };
   
  async function gleBadge() {
    GLE.badgeAt = Date.now();
    let n = GLE.BADGE;
    const b = await gleGet('/badge');
    if (GLE.off) return window.LGGuilds && window.LGGuilds.n ? window.LGGuilds.n() : n;
    if (b && b.ok) {
      n = Math.max(0, +b.n || 0) + (b.member && window.LGDailies && window.LGDailies.giftCount ? +window.LGDailies.giftCount() || 0 : 0);
      void gleIndex(false);
    }
    if (n !== GLE.BADGE) { GLE.BADGE = n; try { window.dispatchEvent(new CustomEvent('lgguilds', { detail: { n } })); } catch (e) { console.warn('[гильдии] счётчик', e); } }
    return n;
  }
  const gleBadgeSoon = () => { clearTimeout(GLE.badgeT); GLE.badgeT = setTimeout(() => { gleBadge().catch((e) => console.warn('[гильдии] счётчик', e)); }, 300); };

  function gleTick() {
    if (GLE.off || document.hidden) return;
    const hud = document.querySelector('.cy-hud'), gb = document.querySelector('[data-gu="guild"]');
    if (!hud && !gb) return;
    if (!GLE.go) {
      GLE.go = true;

      setTimeout(() => { if (!GLE.off && !GLE.IDX && !GLE.idxP) gleIndex(false).catch((e) => console.warn('[гильдии] моя гильдия', e)); }, Math.round(Math.random() * 5e3));
      try { GLE.mo = new MutationObserver(gleSoon); GLE.mo.observe(document.body || document.documentElement, { childList: true, subtree: true }); } catch (e) { console.warn('[гильдии] наблюдатель шапки', e); }
    }
    if (gb && Date.now() - GLE.badgeAt > 55e3) gleBadgeSoon();
  }
  if (!GLE.off) GLE.tick = setInterval(gleTick, 5e3);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && GLE.go) gleSoon(); });
  window.addEventListener('lg-gchat', (e) => {
    const d = e && e.detail; if (GLE.off || !d || (d.k !== 'in' && d.k !== 'out')) return;
    GLE.IDX = null; gleIndex(true).then(() => { glePaint(); gleBadgeSoon(); }).catch((er) => console.warn('[гильдии] моя гильдия', er));
  });
   
  function gleWin() {
    if (window.LGGuilds && !window.LGGuilds.lite) return Promise.resolve(window.LGGuilds);
    if (!GLE.win) GLE.win = tabFiles('guilds').then(() => { const G = window.LGGuilds; if (!G || G.lite) throw new Error('guilds.js без LGGuilds'); return G; }).catch((e) => { GLE.win = null; throw e; });
    return GLE.win;
  }
  const gleNo = (e) => { console.warn('[гильдии] окно', e); toast('Окно гильдий не загрузилось - проверь связь', true); };
  if (!window.LGGuilds) window.LGGuilds = {
    lite: true,
    pick: () => gleWin().then((G) => G.pick(), gleNo),
    mod: () => gleWin().then((G) => G.mod(), gleNo),
    open: (o) => gleWin().then((G) => G.open(o), gleNo),
    close: () => {   },
    index: (force) => gleIndex(force),
    n: () => GLE.BADGE,
    refresh: () => gleBadge(),
    wait: () => gleWait(),
     
    take() {
      GLE.off = true; clearInterval(GLE.tick); clearTimeout(GLE.entryT); clearTimeout(GLE.badgeT);
      if (GLE.mo) { GLE.mo.disconnect(); GLE.mo = null; }
      return { IDX: GLE.IDX && GLE.IDX.ok ? GLE.IDX : null, idxAt: GLE.idxAt, BADGE: GLE.BADGE, badgeAt: GLE.badgeAt };
    },
  };

  








  const GHE = { IDX: null, idxAt: 0, idxP: null, off: !!window.LGGuildHall, tick: 0, win: null };
  const GHE_TTL = 60e3;
  function gheIndex(force) {
    const I = GHE.IDX, ttl = I && !I.ok && (I.closed || I.unavailable || I.error === 'войди через Twitch') ? 10 * GHE_TTL : GHE_TTL;
    if (!force && I && Date.now() - GHE.idxAt < ttl) return Promise.resolve(I);
    if (GHE.idxP) return GHE.idxP;
    GHE.idxP = fetch((window.LG_BASE || '') + '/api/guildhall', { credentials: 'same-origin' })
      .then(async (r) => { try { const x = await r.json(); return x && typeof x === 'object' ? x : { ok: false, error: 'нет ответа' }; } catch (e) { return { ok: false, error: r.status === 429 ? 'слишком часто - подожди немного' : 'нет ответа' }; } }, () => ({ ok: false, error: 'нет связи' }))
      .then((r) => { GHE.IDX = r; GHE.idxAt = Date.now(); GHE.idxP = null; return r; });
    return GHE.idxP;
  }
  function gheTick() {
    if (GHE.off || document.hidden) return;
    const hud = document.querySelector('.cy-hud'); if (!hud) return;
    const C = window.LGCity, has = !!(C && C.hasB && C.hasB('guild')), btn = hud.querySelector('.gh-entry');
    if (has) { if (btn) btn.remove(); return; }
    if (btn) return;
    gheIndex().then((r) => {
      if (!r || !r.ok || GHE.off || hud.querySelector('.gh-entry') || !hud.isConnected || (C && C.hasB && C.hasB('guild'))) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'gh-entry'; b.title = 'Здание гильдии: зал своей гильдии';
      b.innerHTML = '<span aria-hidden="true">🏰</span><b>Здание гильдии</b>';
      b.onclick = (e) => { e.stopPropagation(); window.LGGuildHall.enter(); };
      hud.appendChild(b);
    });
  }
  if (!GHE.off) GHE.tick = setInterval(gheTick, 1500);
  function gheWin() {
    if (window.LGGuildHall && !window.LGGuildHall.lite) return Promise.resolve(window.LGGuildHall);
    if (!GHE.win) GHE.win = tabFiles('guildhall').then(() => { const G = window.LGGuildHall; if (!G || G.lite) throw new Error('guildhall.js без LGGuildHall'); return G; }).catch((e) => { GHE.win = null; throw e; });
    return GHE.win;
  }
  const gheNo = (e) => { console.warn('[здание гильдии] интерьер', e); toast('Здание гильдии не загрузилось - проверь связь', true); };
  if (!window.LGGuildHall) window.LGGuildHall = {
    lite: true,
     
    on() { if (!GHE.IDX) { void gheIndex(); return null; } return !!GHE.IDX.ok; },
    index: (force) => gheIndex(force),
    enter: () => gheWin().then((G) => G.enter(), gheNo),
    open: () => gheWin().then((G) => G.enter(), gheNo),
    close: () => {   },
     
    take() { GHE.off = true; clearInterval(GHE.tick); return { IDX: GHE.IDX, idxAt: GHE.idxAt }; },
  };

  



  let warWant = false, warLoading = null, waNow = null, waEl = null, waT = 0;
  const warOk = () => !!(ME && ME.cw) && !inJail();
  function warVis() {
    const b = $('.tabs button[data-tab="war"]'); if (!b) return;
    const ok = warOk();
    b.hidden = !ok;
    if (!ok && $('#tab-war').classList.contains('on')) tab('hero');
    if (ok && warWant) { warWant = false; tab('war'); }
    waShow(ok && ME && ME.wa ? ME.wa : ok ? waNow : null);
  }
  function warFiles() {
    if (warLoading) return warLoading;
    warLoading = tabFiles('war').catch((e) => { warLoading = null; throw e; });
    return warLoading;
  }
  const WRX = {
    api: (p, body) => api(p, body), toast: (t, bad) => toast(t, bad), now: () => now(),
    me: () => (ME && ME.user ? { login: ME.user.login, name: ME.user.name } : null),
    channel: () => (CH ? CH.login.toLowerCase() : ''),
    live: () => !!(ES && esOk),
  };
  async function openWar() {
    const el = $('#tab-war');
    if (!warOk()) { el.innerHTML = SU.note('Вкладка «Бой армий» пока закрыта.'); return; }
    if (!window.LGWarCmd && !(await SU.loadInto(el, warFiles, 'Открываем «Бой армий»…', 'Вкладка «Бой армий» не загрузилась - проверь связь и открой её ещё раз.'))) return;
    if (!$('#tab-war').classList.contains('on') || !window.LGWarCmd) return;
    window.LGWarCmd.open(el, WRX);
  }
   
  function warEvent(d) { if (window.LGWarCmd && window.LGWarCmd.on()) window.LGWarCmd.onData(d); }
  function waEvent(d) { waNow = d && d.wa ? d.wa : null; if (ME) ME.wa = waNow; waShow(warOk() ? waNow : null); if (window.LGWarCmd && window.LGWarCmd.on()) window.LGWarCmd.refresh(); }
   
  let waKey = '', waHid = '';
  function waShow(a) {
    const key = a ? `${a.id}:${a.stage}` : '';
    if (!a || waHid === String(a.id)) { clearInterval(waT); waT = 0; waKey = ''; if (waEl) { waEl.remove(); waEl = null; } return; }
    if (key === waKey && waEl) return;
    waKey = key; clearInterval(waT); waT = 0;
    if (!waEl) {
      waEl = document.createElement('div'); waEl.className = 'wa-bar'; waEl.setAttribute('role', 'alert');
      document.body.prepend(waEl);
      waEl.addEventListener('click', (e) => { const b = e.target.closest('[data-wa]'); if (!b) return; if (b.dataset.wa === 'go') tab('war'); else { waHid = String(b.dataset.id || ''); waShow(null); } });
    }
    waEl.innerHTML = `<span class="wa-t"><b>Ваш город «${esc(a.name)}» осаждает армия ${esc(a.attackerName || a.attacker)}!</b> <span class="wa-c"></span></span>`
      + `<span class="wa-b"><button type="button" class="btn primary wa-go" data-wa="go">Оборонять город</button><button type="button" class="btn ghost wa-x" data-wa="x" data-id="${esc(String(a.id))}" aria-label="Скрыть">✕</button></span>`;
    const c = waEl.querySelector('.wa-c');
    const draw = () => {
      const left = Math.max(0, (a.prepUntil || 0) - now());
      c.textContent = a.stage === 'prep' ? (left > 0 ? `Начало через ${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}` : 'Осада начинается') : 'Осада идёт';
    };
    draw();
    if (a.stage === 'prep') waT = setInterval(draw, 1000);
  }

  




  let seasonWant = false, seasonLoading = null;
  const seasonOk = () => !!(ME && ME.ss) && !inJail();
  function seasonVis() {
    const b = $('.tabs button[data-tab="season"]'); if (!b) return;
    const ok = seasonOk();
    b.hidden = !ok;
    if (!ok && $('#tab-season').classList.contains('on')) tab('hero');
    if (ok && seasonWant) { seasonWant = false; tab('season'); }
  }
  function seasonFiles() {
    if (seasonLoading) return seasonLoading;
    seasonLoading = tabFiles('season').catch((e) => { seasonLoading = null; throw e; });
    return seasonLoading;
  }
  const rootApi = (p, body) => api(DEMO ? p : location.origin + p, body);
  const SX = {
    api: (p, body) => rootApi(p, body), toast: (t, bad) => toast(t, bad), now: () => now(),
    me: () => (ME && ME.user ? { login: ME.user.login, name: ME.user.name } : null),
    channel: () => (CH ? CH.login.toLowerCase() : ''),
    login: () => (window.LG_LOGIN || '/auth/login'),

    item: (it) => { const d = GD.item(it.id), n = (names().items || {})[it.id]; return { name: (n && n.name) || it.name || (d && d.name) || it.id, rarity: it.rarity || (d && d.rarity) || 'common' }; },
    rarityName: (r) => RAR[r] || r,
    money: (n) => SU.money(n, n, () => part('coins')),

    mapFiles: () => worldFiles(),
  };
  async function openSeason() {
    const el = $('#tab-season');
    if (!seasonOk()) { el.innerHTML = SU.note('Вкладка «Сезоны» пока закрыта.'); return; }
    if (!window.LGSeason && !(await SU.loadInto(el, seasonFiles, 'Открываем «Сезоны»…', 'Вкладка «Сезоны» не загрузилась - проверь связь и открой её ещё раз.'))) return;
    if (!$('#tab-season').classList.contains('on') || !window.LGSeason) return;
    window.LGSeason.open(el, SX);
  }

  


  let arenaWant = false, arenaLoading = null;
  const arenaOk = () => !!(ME && ME.ar && ME.user) && !inJail();
  function arenaVis() {
    const b = $('.tabs button[data-tab="arena"]'); if (!b) return;
    const ok = arenaOk();
    b.hidden = !ok;
    if (!ok && $('#tab-arena').classList.contains('on')) tab('hero');
    if (ok && arenaWant) { arenaWant = false; tab('arena'); }
  }
  function arenaFiles() {
    if (arenaLoading) return arenaLoading;
    arenaLoading = tabFiles('arena').catch((e) => { arenaLoading = null; throw e; });
    return arenaLoading;
  }
  const AX = {
    api: (p, body) => api(p, body), toast: (t, bad) => toast(t, bad),
    me: () => (ME && ME.user ? { login: ME.user.login, name: ME.user.name } : null),
    money: (n) => SU.money(n, n, () => part('coins')),
    on: () => $('#tab-arena').classList.contains('on'),
  };
  async function openArena() {
    const el = $('#tab-arena');
    if (!arenaOk()) { el.innerHTML = SU.note('Вкладка «Арена» пока закрыта.'); return; }
    if (!window.LGArena && !(await SU.loadInto(el, arenaFiles, 'Открываем «Арену»…', 'Вкладка «Арена» не загрузилась - проверь связь и открой её ещё раз.'))) return;
    if (!$('#tab-arena').classList.contains('on') || !window.LGArena) return;
    window.LGArena.open(el, AX);
  }

  

  let cityWant = false, cityLoading = null;



  const CITY_QUEST_T = 'Ты в походе - Город откроется после похода (сейчас открыт только город, где стоит отряд)';
  let cityQOut = 0;
  const cityStub = () => (cityLocked() || (cityQOut > 0 && !(townEntry > cityQOut))) && !inJail();
  



  let cityMe = '', cityWhere = null, cityLeftTo = '';
  function cityFresh(d) {
    const on = !!(d && d.on), me = on ? String(d.party || '') : '';
    cityWhere = on ? { t: String(d.t || ''), k: String(d.k || ''), town: d.town && d.town.name ? String(d.town.name) : '' } : null;
    if (on && Array.isArray(d.lt) && d.lt[0]) cityLeft(String(d.lt[0]), +d.lt[1] || 0);
    if (me !== cityMe) { cityMe = me; cityVis(); }
    else if (cityWhere) { const w = document.querySelector('#tab-city .cq-where'); if (w) { const t = cityWhereText(); if (w.textContent !== t) w.textContent = t; } }
  }
  


  const cityLtLs = () => 'lgCityLt@' + ((/\/c\/([\w]+)/.exec(location.pathname) || [])[1] || '-').toLowerCase();
  function cityLeft(town, at) {
    const key = town + ':' + at;
    let was = '', wasLs = ''; try { was = sessionStorage.getItem('lgCityLt') || ''; } catch (e) { was = ''; }
    try { wasLs = localStorage.getItem(cityLtLs()) || ''; } catch (e) { wasLs = ''; }
    if (was === key || wasLs === key || inJail()) return;
    try { sessionStorage.setItem('lgCityLt', key); } catch (e) { console.warn('Город: куда встать после похода - не запомнилось', e); }
    try { localStorage.setItem(cityLtLs(), key); } catch (e) { console.warn('Город: куда встать после похода - не запомнилось в браузере', e); }
    if (window.LGCity && window.LGCity.leftTo) window.LGCity.leftTo(town); else cityLeftTo = town;
  }


  const CQ_KIND = { battle: 'бой', trap: 'ловушка', treasure: 'сокровищница', lair: 'логово', rest: 'привал', shop: 'лавка', event: 'событие', map: 'карта похода', travel: 'в пути', town: 'город округа', gather: 'сбор отряда', dungeon: 'данж', bossgen: 'главный враг', puzzle: 'головоломка' };
  function cityWhereText() {
    const w = cityWhere; if (!w) return 'Отряд в пути';
    const place = w.town ? `город «${w.town}»` : w.t || '', kind = CQ_KIND[w.k] || '';
    return 'Отряд сейчас: ' + ([place, kind && !w.town ? kind : ''].filter(Boolean).join(' · ') || 'в пути');
  }
  function cityCard() {
    const h = ME && ME.hero, me = ME && ME.user ? String(ME.user.login).toLowerCase() : 'me';
    const v = h ? { lk: (h.wardrobe && h.wardrobe.cur && Object.keys(h.wardrobe.cur).length ? h.wardrobe.cur : h.look) || null, g: h.gear || {} } : null;
    const figs = [['cq-otr-1', null], ['cq-otr-2', null], [me, v], ['cq-otr-3', null]]
      .map(([l, fv], i) => `<span class="cq-fig${l === me ? ' me' : ''}" style="--i:${i}">${figSvg(l, fv)}</span>`).join('');
    return `<section class="cq-card city-quest" aria-labelledby="cq-h">`
      + `<div class="cq-scene" aria-hidden="true"><div class="cq-far"></div><div class="cq-path"></div><div class="cq-walk">${figs}</div></div>`
      + `<div class="cq-body"><h2 id="cq-h">Ты в походе с отрядом</h2><p class="cq-where">${esc(cityWhereText())}</p>`
      + `<p class="cq-hint">Покинуть отряд - вернёшься в город этого округа</p>`
      + `<p class="cq-note muted">Пока ты в отряде, «Город» закрыт: открыт только город, где стоит отряд (кнопка на вкладке «Поход»).</p>`
      + `<button type="button" class="cq-go" data-cq-quest>К отряду - вкладка «Поход»</button></div></section>`;
  }

  function cityCardMount(el) {
    el.innerHTML = cityCard();
    const b = el.querySelector('[data-cq-quest]'); if (b) b.onclick = () => tab('quest');
  }
  document.addEventListener('visibilitychange', () => { document.documentElement.classList.toggle('cq-paused', document.hidden); });
  function cityVis() {
    const ok = !!(ME && ME.hero && (ME.hero.cy || ME.jail)), b = $('.tabs button[data-tab="city"]');
    if (!b) return;
    b.hidden = !ok;
    const lock = ok && !inJail() && cityLocked();
    b.classList.toggle('tab-lock', lock);
    if (lock) b.title = CITY_QUEST_T; else b.removeAttribute('title');
    if (!(questOn && questParty === 'in')) cityQOut = 0;
    if (!ok && $('#tab-city').classList.contains('on')) tab('hero');

    const el = $('#tab-city'), stubOn = !!el.querySelector('.city-quest');
    if (ok && el.classList.contains('on') && cityStub() !== stubOn) { if (window.LGCity) window.LGCity.close(); openCity(); }
    if (ok && !lock && cityWant) { cityWant = false; tab('city'); }
    cityMonLate();
  }
  



  let cmLate = null, cmLateAt = 0, cmLateN = 0;
  function cityMonLate() {
    const h = ME && ME.hero;
    if (!h || !h.cm || window.LGCityMon || cmLate || !window.LGCity || cmLateN >= 6 || Date.now() - cmLateAt < 20000) return;
    cmLateAt = Date.now(); cmLateN++;
    cmLate = loadJs(tabSrc('citymon.js') + '&r=' + cmLateN).catch(() => null).then(() => { cmLate = null; });
  }
  setInterval(() => { if (!document.hidden) cityMonLate(); }, 20000);
  function cityFiles() {
    if (cityLoading) return cityLoading;




    cityPre(false);
    cityLoading = tabFiles('city').catch((e) => { cityLoading = null; throw e; });
    return cityLoading;
  }
  




  const CW = new Map(), CW_MS = 15000;

  function cityTake(p) {
    const w = CW.get(p); if (!w) return null; CW.delete(p);
    return Date.now() - w.t < CW_MS ? w.p.then((r) => (r && +r.now > 0 && w.at ? { ...r, now: +r.now + (Date.now() - w.at) } : r)) : null;
  }
  function cityPre(idle) {
    const h = ME && ME.hero, V = window.LG_CITYV || {}, o = { idle };
    tabPre('city', idle);
    let rm = ''; try { rm = new URLSearchParams(location.search).get('cityr') || localStorage.getItem('lgCityR') || ''; } catch {}
    const gl = rm !== 'svg', jail = inJail(), far = !!h && !jail && !!(h.tw || (h.hm && h.hm.id && !h.hm.none));
    const vend = (k) => (V[k] ? '/site/vendor/' + V[k] : '');
    if (gl) { preJs(vend('pixi'), o); preJs(vend('pixiEval'), o); preJs(vend('font'), { idle, as: 'fetch' }); }
    if (far) { preJs(`/site/towngen.js?v=${V.tg || ''}`, o); preJs(`/site/townart.js?v=${V.ta || ''}`, o); }
    if (far && gl && ME.tn) { preJs(`/site/tk-map.js?v=${V.km || ''}`, o); preJs(`/site/tk-art.js?v=${V.ka || ''}`, o); preJs(`/site/tk-city.js?v=${V.kc || ''}`, o); }
    if (idle || DEMO || !h || jail || window.LGCity || !/\/c\/[\w]+/.test(location.pathname)) return;
    const ask = (p) => { if (CW.has(p)) return; const w = { p: null, t: Date.now(), at: 0 }; w.p = Promise.resolve(api(p)).then((r) => { w.at = Date.now(); return r; }); CW.set(p, w); };
    ask('/api/city/pos'); if (far) ask('/api/city/towns');
  }

  const CX = {

    jail: () => (ME && ME.jail) || null,

    jailOn: () => !!(ME && (ME.jail || ME.jl)),

    fcOn: () => !!(ME && ME.fc),
    tnOn: () => !!(ME && ME.tn),
    hero: () => (ME && ME.hero) || null, login: () => (ME && ME.user ? String(ME.user.login).toLowerCase() : ''), style: () => sty(),
    doodle: (l, h, mood, k) => doodle(l, h, mood, k), fig: (l, v, o) => figSvg(l, v, o), heroLook: (h) => heroLook(h), still: (svg) => still(svg), awb: (aw) => awb(aw), awPop: (a, r, k) => awPop(a, r, k), awHide: (pre) => awHide(pre), ico: (k) => ico(k),
    api: (p, b) => (!b && cityTake(p)) || api(p, b), act: (p, b, ok, btn, o) => act(p, b, ok, btn, o), money: (n, r) => money(n, r), moneyText: (n, r) => moneyText(n, r), lack: (p, hv, c) => lackHtml(p, hv, c), bal: (p, hv, c) => balHtml(p, hv, c), art: (it) => art(it),
    itemName: (id) => { const n = names().items; return (n && n[id] && n[id].name) || ''; }, eff: (it) => effText(it),
    inQuest: () => questOn && questParty === 'in',

    questOut: () => { cityQOut = Date.now(); townEntry = 0; if (window.LGCity) window.LGCity.close(); if ($('#tab-city').classList.contains('on')) openCity(); },
    ench: () => EN(), mats: (h) => matsOf(h), canEnch: (it) => canEnch(it) && !it.mat, forgeOpen: (uid, host, o) => forgeOpen(uid, host, o), forgeWay: (w) => forgeWay(w), animSkip: () => animSkip(), forgeClose: () => { if (FG.host) forgeClose(); },
    repBlock: (h) => repBlockHtml(h), repBind: (el) => repBind(el), durLow: () => REP().low,
    skx: (re) => ({ ...SKX, act: (p, b, ok, btn) => act(p, b, ok, btn).then(() => { if (btn && btn.isConnected && btn.textContent === 'Секунду…' && !busy) re(); }), rerender: () => { last = ''; renderHero(); re(); } }), live: () => esOk, pollOk: () => pollOk(), tab: (id) => tab(id),

    itemBody: (it, h, o) => itemBody(it, h, o), enchStats: (base, en, bonus) => enchStatsN(base, en, bonus), lgx: (it) => lgx(it), tips: (el) => tipOn(el),
    stOk: (k, h) => stOk(k, h), stLabel: (k) => stLabel(k), stNum: (k, v) => stNum(k, v), xst: () => Object.keys(XST), st: () => Object.keys(ST),
    clsOf: (it) => clsOf(it), roleOf: (id) => roleOf(id, ((ME && ME.roles) || {})[id]), classes: () => classIds(ME && ME.hero),

    doll: (h, o) => dollHtml(h, o), cardTip: (el, it, h, o) => cardTip(el, it, h, o), tipHide: () => tipHide(), tipFor: () => tipFor,
    toast: (t, bad) => toast(t, bad),
    mineFiles: () => mineFiles(),


    openMine: (c, ids) => (c ? openMine(c) : openMines(ids)),
    openMineBoard: async () => { try { await mineFiles(); } catch { toast('Не загрузилось — проверь связь', true); return; } window.LGMine.board({ api: (p, b) => api(p, b), login: () => (ME && ME.user ? String(ME.user.login).toLowerCase() : ''), mines: () => mineList() }); },
  };

   
  let mineLoading = null;
  function mineFiles() {
    if (mineLoading) return mineLoading;


    mineLoading = Promise.all([tabFiles('mine'), lazy('pick')]).then(([r]) => r).catch((e) => { mineLoading = null; throw e; });
    return mineLoading;
  }

  const BIO_RU = { mount: 'горы', ash: 'пепел', forest: 'лес', taiga: 'тайга', ice: 'лёд', meadow: 'луга', swamp: 'болото', blight: 'порча', coast: 'побережье', desert: 'пустыня', ruin: 'руины' };
  const GEM_RU = { adamant: 'адамантит', fire_opal: 'огненный опал', emerald: 'изумруд', sapphire: 'сапфир', topaz: 'топаз', malachite: 'малахит', morion: 'морион', aquamarine: 'аквамарин', ruby: 'рубин', runestone: 'рунный камень' };
  const mineList = () => Object.entries((ME && ME.hero && ME.hero.mn) || {}).map(([id, m]) => ({ id, nm: (m && m.nm) || 'Шахта', dist: (m && m.dist) || '', bi: (m && m.bi) || 'mount', dg: (m && m.dg) || 1, gem: (m && m.gem) || null, busy: !!(m && m.i >= 0) }))
    .sort((a, b) => (a.id === 'home' ? -1 : b.id === 'home' ? 1 : b.dg - a.dg || a.nm.localeCompare(b.nm, 'ru')));
  function openMines(ids) {
    const list = mineList().filter((m) => !Array.isArray(ids) || ids.includes(m.id));
    const v3t = list.some((m) => m.id === 't-v3');
    if (!list.length) { toast('Шахта пока закрыта', true); return; }

    if (list.length === 1) { openMine(list[0].id); return; }
    const crLi = craftOn() ? '<li><button type="button" class="btn ghost" data-cr><span aria-hidden="true">🎣</span><b>Ремёсла города</b><small>добытое - в казну города</small></button></li>' : '';
    const d = document.createElement('div'); d.className = 'mn-board-w'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Шахты наших городов');
    d.innerHTML = `<div class="mn-board panel mn-go"><h3 class="h3">${v3t ? 'Шахты города' : 'Шахты наших городов'}</h3><p class="muted">${v3t ? 'Шахта Города - как всегда. Новая шахта (тест) - Шахта 3.0 для тестеров: сумки, мастерство и лимит суток - общие, итогов и наград недели нет.' : 'Шахта есть в каждом городе ваших округов. Чем опаснее округ (★), тем богаче руда; у каждой природы — свой самоцвет.'}</p><ul>${list.map((m) => `<li><button type="button" class="btn ghost" data-go="${esc(m.id)}"><span aria-hidden="true">⛏</span><b>${esc(m.id === 'home' ? (v3t ? 'Шахта Города' : 'Домашняя шахта') : m.nm)} ${'★'.repeat(Math.max(1, Math.min(5, m.dg)))}</b><small>${esc([m.dist, BIO_RU[m.bi]].filter(Boolean).join(' · '))}${m.gem ? ` · самоцвет: ${esc(GEM_RU[m.gem] || m.gem)}` : ''}</small>${m.busy ? '<em>твой герой копает здесь</em>' : ''}</button></li>`).join('')}${crLi}</ul><button type="button" class="btn primary" data-x>Закрыть</button></div>`;

    const shut = SU.layer(d);
    d.querySelector('[data-x]').onclick = shut;
    d.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => { shut(); openMine(b.dataset.go); }; });
    { const c = d.querySelector('[data-cr]'); if (c) c.onclick = () => { shut(); openCrafts(); }; }
    try { d.querySelector('[data-go]').focus({ preventScroll: true }); } catch {}
  }
  


  let craftLoading = null;
  function craftFiles() { if (craftLoading) return craftLoading; craftLoading = tabFiles('craft').catch((e) => { craftLoading = null; throw e; }); return craftLoading; }
  const craftOn = () => !!(ME && ME.hero && ME.hero.cr && Object.keys(ME.hero.cr).length);
  async function openCrafts() {


    if (fish2On()) { let go = false; try { go = !!(window.LGCity && window.LGCity.fishGo && window.LGCity.fishGo()); } catch (e) { console.warn('[рыбалка] к воде', e); } if (!go) toast('Рыбалка - у воды: подойди к озерцу в Рябинене', true); return; }
    try { await craftFiles(); } catch { toast('Ремёсла не загрузились - проверь связь', true); return; }

    const town = () => { try { return window.LGCity && window.LGCity.here ? window.LGCity.here() : null; } catch { return null; } };
    window.LGCraft.hub({ hero: () => (ME && ME.hero) || null, api: (p, b) => api(p, b), toast: (t, bad) => toast(t, bad), esc, layer: (el, o) => SU.layer(el, o), town }, {});
  }
  


  let fish2Loading = null;
  function fish2Files() { if (fish2Loading) return fish2Loading; fish2Loading = tabFiles('fish2').catch((e) => { fish2Loading = null; throw e; }); return fish2Loading; }
  

  function fish2Css() {
    return new Promise((res) => {
      const l = document.getElementById('fish2Css');
      if (!l || l.sheet) { res(); return; }
      const t = setTimeout(res, 3000), done = () => { clearTimeout(t); res(); };
      l.addEventListener('load', done, { once: true }); l.addEventListener('error', done, { once: true });
    });
  }
  const fish2On = () => !!(ME && ME.hero && ME.hero.cr && ME.hero.cr.fish && ME.hero.cr.fish.f2 && ME.hero.cr.fish.f2.on);
  async function openFish2() {
    if (!fish2On()) { toast('Рыбалка пока закрыта', true); return false; }
    try { await fish2Files(); } catch { toast('Рыбалка не загрузилась - проверь связь', true); return false; }
    await fish2Css();
    if (!window.LGFish2 || window.LGFish2.on) return !!window.LGFish2;
    const C = window.LGCity; try { if (C && C.sleep) C.sleep(); } catch (e) { console.warn('[город] sleep', e); }
    window.LGFish2.open({ api: (p, b) => api(p, b), hero: () => (ME && ME.hero) || null, toast: (t, bad) => toast(t, bad),
      login: () => (ME && ME.user ? String(ME.user.login).toLowerCase() : ''), style: () => { try { return (typeof sty === 'function' && sty()) || (window.MDDoodle && window.MDDoodle.active) || (window.LG_STYLES && window.LG_STYLES[0]) || 'legion'; } catch { return 'legion'; } },
      close: () => { try { if (C && C.wake) C.wake(); } catch (e) { console.warn('[город] wake', e); } } });
    return true;
  }
  window.LGOpenFish2 = openFish2;
  window.LGFish2On = fish2On;
   
  let f2LegAt = 0;
  

  let f2PreDone = false;
  function f2Pre() {
    if (f2PreDone || !fish2On()) return;
    f2PreDone = true;
    const go = () => { fish2Files().catch(() => { f2PreDone = false; }); };
    if (typeof requestIdleCallback === 'function') requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 1500);
  }
  function f2Leg() {
    f2Pre();
    const f = ME && ME.hero && ME.hero.cr && ME.hero.cr.fish && ME.hero.cr.fish.f2, L = f && f.leg;
    if (!L || !L.at || L.at === f2LegAt || Date.now() - L.at > 60e3) return;
    f2LegAt = L.at;
    fish2Files().then(() => { if (window.LGFish2 && window.LGFish2.ann) window.LGFish2.ann({ n: L.who, kg: L.kg }); }).catch(() => null);
  }
  async function openMine(c = 'home') {
    if (!ME || !ME.hero || !ME.hero.mn || !ME.hero.mn[c]) { toast('Эта шахта закрыта', true); return; }
    try { await mineFiles(); } catch { toast('Шахта не загрузилась — проверь связь', true); return; }

    const C = window.LGCity; try { if (C && C.sleep) C.sleep(); } catch (e) { console.warn('[город] sleep', e); }
    window.LGMine.open({ login: () => (ME && ME.user ? String(ME.user.login).toLowerCase() : ''), hero: () => (ME && ME.hero) || null, doodle: (l, h, mood, k) => doodle(l, h, mood, k), fig: (l, v, o) => figSvg(l, v, o), heroLook: (h) => heroLook(h),
      api: (p, b) => api(p, b), money: (n) => money(n), toast: (t, bad) => toast(t, bad), live: () => esOk, pollOk: () => pollOk(), close: () => { try { if (C && C.wake) C.wake(); } catch (e) { console.warn('[город] wake', e); } },

      mines: () => mineList(),

      art: (it) => art(it), doll: (h, o) => dollHtml(h, o), cardTip: (el, it, h, o) => cardTip(el, it, h, o), tipHide: () => tipHide(),

      pins: (h) => candyPins(h), pinTip: (el, p) => candyTip(el, p.n),

      equip: async (uid) => { const r = await api('/api/equip', { uid }); if (r && r.ok && r.hero) { ME.hero = r.hero; last = ''; renderHero(); } return r; },
      unequip: async (slot) => { const r = await api('/api/unequip', { slot }); if (r && r.ok && r.hero) { ME.hero = r.hero; last = ''; renderHero(); } return r; } }, c);
  }

  


  function inJail() { return !!(ME && ME.jail); }
  let jailWas = false;
  function jailUi() {
    const on = inJail();
    document.documentElement.classList.toggle('jailed', on);
    let bar = document.getElementById('jailBar');
    if (on) {
      const j = ME.jail;
      if (!bar) { bar = document.createElement('div'); bar.id = 'jailBar'; bar.className = 'jail-bar'; bar.setAttribute('role', 'status'); document.body.appendChild(bar); }
      bar.innerHTML = `<b>Ты в тюрьме канала</b>${j.reason ? `<span>Причина: ${esc(j.reason)}</span>` : ''}<span>${j.until ? 'Выйдешь: ' + esc(String(j.untilText || '').replace(/^до /, '')) : 'Срок: бессрочно'}</span><button type="button" class="jail-ap" hidden>Обжаловать</button>`;
      jailAppealBtn(bar);
      if (!$('#tab-city').classList.contains('on')) tab('city');
    } else { if (bar) bar.remove(); jailAp = null; }

    if (jailWas && !on && window.LGCity && $('#tab-city').classList.contains('on')) { window.LGCity.close(); openCity(); }
    jailWas = on;
  }

  let jailAp = null;
  function jailAppealBtn(bar) {
    const b = bar.querySelector('.jail-ap'); if (!b) return;
    if (jailAp == null) { jailAp = false; api('/api/appeal/me').then((r) => { jailAp = !!(r && r.ok && r.on && r.channel && r.channel.banned); const x = document.querySelector('#jailBar .jail-ap'); if (x) x.hidden = !jailAp; }); }
    b.hidden = !jailAp;
    b.onclick = async () => {
      const r = await api('/api/appeal/me');
      if (!r || !r.ok || !r.on || !r.channel) { toast('Обжалование пока не открыто', true); return; }
      const k = r.channel, a = k.appeal, ST = { new: 'на рассмотрении', lifted: 'бан снят', rejected: 'отказано' };
      const info = a ? `<p>Твоё обжалование - <b>${esc(ST[a.st] || a.st)}</b></p><p class="q">${esc(a.text)}</p>${a.answer ? `<p><b>Ответ:</b> ${esc(a.answer)}</p>` : ''}` : '';
      if (!k.can) { SU.askText({ title: 'Обжаловать тюрьму', info: info + (k.why ? `<p>${esc(k.why)}</p>` : ''), field: false }); return; }
      SU.askText({ title: 'Обжаловать тюрьму', info, hint: 'Напиши, почему бан стоит снять. Модераторы канала прочитают и ответят - ответ будет здесь же.', max: r.max || 500, empty: 'Напиши, почему бан стоит снять.',
        send: (text) => api('/api/appeal', { kind: 'channel', text }).then((x) => { if (x && x.ok) toast('Обжалование отправлено'); return x; }) });
    };
  }
  async function openCity() {
    const el = $('#tab-city');
    if (!ME || !ME.hero || !(ME.hero.cy || ME.jail)) { el.innerHTML = SU.note('Город пока закрыт.'); return; }

    if (cityStub()) { if (ME.hero.cq) cityCardMount(el); else el.innerHTML = SU.note(CITY_QUEST_T, 'empty city-quest'); return; }
    if (!window.LGCity && !(await SU.loadInto(el, cityFiles, 'Город строится на глазах…', 'Город не загрузился — проверь связь и открой вкладку ещё раз.'))) return;
    if (!$('#tab-city').classList.contains('on') || !window.LGCity) return;
    if (cityLeftTo && window.LGCity.leftTo) { window.LGCity.leftTo(cityLeftTo); cityLeftTo = ''; }
    window.LGCity.open(el, CX);
  }


  




  const BF = { el: null, up: 0, t: 0, min: false, loading: null };
  try { BF.min = localStorage.getItem('lgBugMin') === '1'; } catch {}

  const bfWant = () => !DOCK && !!(ME && ME.user) && !$('#tab-streamer').classList.contains('on') && !($('#tab-world') && $('#tab-world').classList.contains('on'));
  function bfInit() {
    if (BF.el || DOCK) return;
    const d = document.createElement('div');
    d.className = 'bugfab off'; d.id = 'bugfab';
    d.innerHTML = '<button type="button" class="bugfab-b" aria-label="Отправить баг или отзыв" title="Нашли ошибку? Отправить баг"><span class="bugfab-i" aria-hidden="true">🐞</span><span class="bugfab-t">Отправить баг</span></button>'
      + '<button type="button" class="bugfab-x" aria-label="Свернуть кнопку «Отправить баг»" title="Свернуть">×</button>';
    document.body.appendChild(d); BF.el = d;
    d.querySelector('.bugfab-b').onclick = () => { if (BF.min) bfMin(false); else bugOpen(); };
    d.querySelector('.bugfab-x').onclick = (e) => { e.stopPropagation(); bfMin(true); };
    const kick = () => bfSoon();
    window.addEventListener('resize', kick);
    window.addEventListener('scroll', kick, { passive: true, capture: true });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', kick);
    document.addEventListener('focusin', kick);
    document.addEventListener('focusout', () => setTimeout(bfSoon, 60));
    document.addEventListener('click', () => { bfSoon(); setTimeout(bfSoon, 400); }, true);
    document.addEventListener('transitionend', kick, true);
    try { new MutationObserver((ms) => { for (const m of ms) if (!d.contains(m.target)) { bfSoon(); return; } }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden', 'open'] }); } catch {}
  }
  function bfMin(on) {
    BF.min = !!on; try { if (on) localStorage.setItem('lgBugMin', '1'); else localStorage.removeItem('lgBugMin'); } catch {}
    bfPlace();
    if (on) toast('Кнопка «Отправить баг» свёрнута - она у правого края');
  }
  function bfSoon() { if (BF.t || !BF.el) return; BF.t = setTimeout(() => { BF.t = 0; bfPlace(); }, 150); }
  const BF_IA = 'button, a[href], input, textarea, select, label, summary, [role="button"], [role="tab"], [role="slider"], [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';



  function bfBlock(e) {
    if (!e || e === document.documentElement || e === document.body) return null;

    const sy = e.closest('.q-say:not([hidden])'); if (sy) return sy;
    for (let n = e; n && n !== document.body; n = n.parentElement) if (getComputedStyle(n).position === 'fixed') return n;

    const cho = e.closest('.cy .cy-chat.open'); if (cho) return cho;
    const ia = e.closest(BF_IA); if (!ia) return null;
    const ir = ia.getBoundingClientRect();
    if (ir.width * ir.height > window.innerWidth * window.innerHeight * 0.25) return null;
    if (ia.closest('.cy'))return ia.closest('.cy-chat, .cy-bar') || ia;
    for (let n = ia; n && n !== document.body; n = n.parentElement) if (getComputedStyle(n).position === 'absolute') return n;
    return null;
  }
  function bfHit(x, y, w, h) {
    for (const [px, py] of [[x + 3, y + 3], [x + w - 3, y + 3], [x + 3, y + h - 3], [x + w - 3, y + h - 3], [x + w / 2, y + h / 2]]) {
      if (py < 0 || px < 0) return { top: 0 };
      for (const e of document.elementsFromPoint(px, py)) { if (BF.el.contains(e)) continue; const b = bfBlock(e); if (b) return b.getBoundingClientRect(); break; }
    }
    return null;
  }
  function bfPlace() {
    const el = BF.el; if (!el) return;
    const want = bfWant();
    el.hidden = !want;
    document.documentElement.classList.toggle('bugfab-on', want && !BF.min);
    if (!want) return;
    el.classList.toggle('min', BF.min);
    const ae = document.activeElement;
    const typing = ae && ae !== document.body && !el.contains(ae) && ae.matches && ae.matches('input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=color]), textarea, select, [contenteditable]:not([contenteditable="false"])');
    const vv = window.visualViewport, kb = !!vv && window.innerHeight - vv.height > 150;
    if (typing || kb || document.querySelector('.bugm')) { el.classList.add('off'); return; }

    let dy = 0; try { dy = new DOMMatrixReadOnly(getComputedStyle(el).transform).m42; } catch {}
    const r = el.getBoundingClientRect(), top0 = r.top - dy, vh = window.innerHeight, maxUp = vh * 0.55;
    for (let up = 0, n = 0; up <= maxUp && n < 12; n++) {
      const b = bfHit(r.left, top0 - up, r.width, r.height);
      if (!b) { el.classList.remove('off'); if (up !== BF.up) { BF.up = up; el.style.setProperty('--bf-up', up + 'px'); } return; }
      up = Math.max(up + 16, Math.ceil(top0 + r.height + 10 - b.top));
    }
    el.classList.add('off');
  }
  function bugOpen() {
    if (!ME || !ME.user) { toast('Войди через Twitch, чтобы отправить баг', true); return; }
    const v = window.LG_BUGV || {};
    const add = (tag, attrs) => new Promise((ok, bad) => { const x = document.createElement(tag); Object.assign(x, attrs); x.onload = () => ok(); x.onerror = bad; document.head.appendChild(x); });
    if (!BF.loading) BF.loading = Promise.all([add('link', { rel: 'stylesheet', href: '/site/bugreport.css' + (v.css ? '?v=' + v.css : '') }), add('script', { src: '/site/bugreport.js' + (v.js ? '?v=' + v.js : '') })])
      .catch((e) => { BF.loading = null; throw e; });
    BF.el.classList.add('busy');
    BF.loading.then(() => { if (window.LGBug) { window.LGBug.open(bugCtx()); bfPlace(); } }, () => toast('Форма не загрузилась - проверь связь', true)).finally(() => { if (BF.el) BF.el.classList.remove('busy'); });
  }

  function bugCtx() {
    const t = $('.tab.on'), id = t ? t.id.replace(/^tab-/, '') : '', tb = id && $(`.tabs button[data-tab="${id}"]`);
    const VN = { gear: 'Снаряжение', look: 'Облик', skills: 'Навыки', ach: 'Достижения', log: 'Журнал' };
    return { user: ME.user, ch: CH, tab: id, tabName: tb ? tb.textContent.trim() : '', view: id === 'hero' ? view : '', viewName: id === 'hero' ? VN[view] || '' : '',
      style: sty(), ver: window.LG_SITEV || '', login: window.LG_LOGIN || '/auth/login', toast, demo: DEMO,
      onClose: () => { bfSoon(); const b = BF.el && BF.el.querySelector('.bugfab-b'); if (b && BF.el.contains(document.activeElement) === false) try { b.focus({ preventScroll: true }); } catch {} } };
  }

  







  const ANT = { q: [], cur: null, el: null, anim: null, fade: null, offBg: null };
  const ANT_LS = 'lgAnnRun', ANT_PX = 140, ANT_CALM = 5000;
  const antSeen = () => { try { const a = JSON.parse(localStorage.getItem(ANT_LS) || '[]'); return Array.isArray(a) ? a.map(String) : []; } catch { return []; } };
  function antMark(p) {
    const a = antSeen().filter((x) => x !== p); a.push(String(p));
    try { localStorage.setItem(ANT_LS, JSON.stringify(a.slice(-30))); } catch (e) {   }
    ANT.done.add(String(p));
  }
  ANT.done = new Set();
  const antOn = () => !!(ME && ME.hero && ME.hero.ak);
  const antBg = () => { const B = window.LGSiteUi && window.LGSiteUi.bg; try { return B ? B.state() : document.hidden ? 'hidden' : 'on'; } catch { return 'on'; } };
  const antCalm = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
   
  function antHeld(a) { const p = a && a.p; return !!p && ((ANT.cur && ANT.cur.p === p) || ANT.q.some((x) => x.p === p)); }
   
  function annEvent(d) {
    if (!ME) return;
    ME.an = Array.isArray(d && d.an) ? d.an : [];
    const live = new Set(ME.an.map((a) => a && a.p).filter(Boolean));

    ANT.q = ANT.q.filter((x) => live.has(x.p));
    if (ANT.cur && !live.has(ANT.cur.p)) antStop(true);
    const nw = Array.isArray(d && d.nw) ? d.nw.map(String) : [];
    if (nw.length && antOn()) {
      const seen = new Set(antSeen()), bg = antBg();
      for (const a of ME.an) {
        if (!a || !a.p || !a.t || !nw.includes(String(a.p)) || seen.has(String(a.p)) || ANT.done.has(String(a.p)) || antHeld(a)) continue;
        if (bg === 'hidden') { antMark(a.p); continue; }
        ANT.q.push({ p: String(a.p), t: String(a.t), g: !!a.g });
      }
      antNext();
    }
    guAnn();
  }
  function antBox() {
    if (ANT.el && ANT.el.isConnected) return ANT.el;
    const el = document.createElement('div');
    el.className = 'ann-tk'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); el.hidden = true;
    const h = document.createElement('b'); h.className = 'ann-tkh';
    const v = document.createElement('div'); v.className = 'ann-tkv';
    const t = document.createElement('span'); t.className = 'ann-tkt';
    v.append(t); el.append(h, v); document.body.append(el);
    ANT.el = el;
    return el;
  }
  function antNext() {
    if (ANT.cur || !ANT.q.length) return;
    if (antBg() === 'hidden') { for (const x of ANT.q) antMark(x.p); ANT.q = []; guAnn(); return; }
    const it = ANT.q.shift(); ANT.cur = it; antMark(it.p);
    const el = antBox(), h = el.querySelector('.ann-tkh'), v = el.querySelector('.ann-tkv'), t = el.querySelector('.ann-tkt');
    h.textContent = it.g ? 'Объявление игры' : 'Объявление';
    t.textContent = it.t.replace(/\s*\n+\s*/g, ' · ');

    const top = document.querySelector('header.top'); let y = 0;
    try { const r = top && top.getClientRects().length ? top.getBoundingClientRect() : null; if (r && r.bottom > 0 && r.bottom < innerHeight / 3) y = Math.round(r.bottom); } catch { y = 0; }
    el.style.top = y + 'px';
    const calm = antCalm();
    el.classList.toggle('calm', calm);
    el.hidden = false;
    if (ANT.fade) try { ANT.fade.cancel(); } catch {   }
    ANT.fade = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out', fill: 'both' });
    if (calm) {
      t.style.transform = '';
      ANT.anim = t.animate([{ opacity: 1 }, { opacity: 1 }], { duration: ANT_CALM });
    } else {
      const from = v.clientWidth, dist = from + t.scrollWidth;
      ANT.anim = t.animate([{ transform: `translate3d(${from}px,0,0)` }, { transform: `translate3d(${-t.scrollWidth}px,0,0)` }],
        { duration: Math.round(dist / ANT_PX * 1000), easing: 'linear', fill: 'both' });
    }
    const a = ANT.anim;
    a.onfinish = () => { if (ANT.anim === a) antStop(false); };

    if (!ANT.offBg && window.LGSiteUi && window.LGSiteUi.bg) ANT.offBg = window.LGSiteUi.bg.on((s) => { if (s === 'hidden' && ANT.cur) antStop(true); });
  }
   
  function antStop(now) {
    const el = ANT.el, a = ANT.anim;
    ANT.anim = null; ANT.cur = null;
    if (a) { a.onfinish = null; if (now) try { a.cancel(); } catch {   } }
    const done = () => { if (ANT.cur) return; if (el) { el.hidden = true; const t = el.querySelector('.ann-tkt'); if (t) t.getAnimations().forEach((x) => x.cancel()); } antNext(); guAnn(); };
    if (!el || now || el.hidden) { if (ANT.fade) try { ANT.fade.cancel(); } catch {   } done(); return; }
    ANT.fade = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'both' });
    ANT.fade.onfinish = done;
  }
  window.LGAnnTick = { held: antHeld, event: annEvent, now: () => (ANT.cur ? { ...ANT.cur } : null), queue: () => ANT.q.map((x) => x.p) };

  







  {
    const nhBtn = () => document.querySelector('.tabs button[data-tab="news"]');
    const nhSeen = () => { try { return +localStorage.getItem('lgNewsSeen') || 0; } catch (e) { return 0; } };
    let nhEdgeOn = false, nhMo = null;
    const nhEdgeUpd = () => {
      const b = nhBtn(), T = b && b.parentElement; if (!T) return;
      let hid = false;
      if (nhEdgeOn && b.offsetParent) { const r = b.getBoundingClientRect(), t = T.getBoundingClientRect(); hid = r.right - 4 > t.right; }
      T.classList.toggle('nw-edge', hid);
    };
    const nhEdge = (on) => {
      const T = nhBtn() && nhBtn().parentElement; if (!T) return;
      if (on && !nhEdgeOn) {
        nhEdgeOn = true; T.addEventListener('scroll', nhEdgeUpd, { passive: true }); window.addEventListener('resize', nhEdgeUpd, { passive: true });
        if (window.MutationObserver) { nhMo = new MutationObserver(nhEdgeUpd); nhMo.observe(T, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] }); }
      }
      if (!on && nhEdgeOn) { nhEdgeOn = false; T.removeEventListener('scroll', nhEdgeUpd); window.removeEventListener('resize', nhEdgeUpd); if (nhMo) { nhMo.disconnect(); nhMo = null; } }
      nhEdgeUpd();
    };
    const nhDot = (on) => {
      const b = nhBtn(); if (!b) return;
      let d = b.querySelector('.nw-dot');
      if (on && !d) { d = document.createElement('i'); d.className = 'nw-dot'; d.innerHTML = '<span class="nw-sr">: есть новое</span>'; b.appendChild(d); }
      if (!on && d) d.remove();
      nhEdge(on);
    };
    const nhCheck = () => {
      fetch((window.LG_BASE || '') + '/api/news/head', { credentials: 'same-origin' }).then((r) => (r.ok ? r.json() : null)).then((h) => {
        if (!h || !h.ok || !h.last) return;
        const t = document.getElementById('tab-news');
        if (t && t.classList.contains('on')) return;
        nhDot(h.last > nhSeen());
      }).catch(() => null);
    };
    window.LGNewsHead = { dot: nhDot };
    if (!window.LG_DOCK && !window.LG_DEMO) {
      const nhGo = () => setTimeout(nhCheck, 1500);
      if (document.readyState === 'complete') nhGo(); else window.addEventListener('load', nhGo, { once: true });
    }
  }

  







  const GU_WIN = { hero: 'Герой', legion: 'Легион (рейтинг)', season: 'Сезоны', war: 'Бой армий', arena: 'Арена' };

  const guIco = (n) => `<img src="/site/ui-icons/${n}.svg?v=${(window.LG_SITEF || {})[`ui-icons/${n}.svg`] || ''}" alt="" width="24" height="24" draggable="false">`;
  const GU = { on: false, el: null, bar: null, pop: null, popKind: '', win: '', tick: 0 };
  const guOn = () => !DOCK && !!(ME && ME.user && ME.hero && ME.hero.gu && ME.hero.cy) && !inJail();
  const guCityOn = () => GU.on && $('#tab-city').classList.contains('on');
   
  function guTab(id) {
    if (!GU.on) return false;
    if (GU_WIN[id]) { guWin(id); return true; }
    if (GU.win) guWinClose();
    guPop('');
    return false;
  }
   
  function guBar() {
    if (GU.bar) return GU.bar;
    const b = document.createElement('div');
    b.className = 'gu-wbar'; b.id = 'gu-wbar'; b.hidden = true;
    b.innerHTML = '<button type="button" class="gu-wx" aria-label="Закрыть и вернуться в город"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><b class="gu-wt"></b><span class="gu-ws">город остаётся под окном</span><button type="button" class="gu-wc">Закрыть</button>';
    b.querySelector('.gu-wx').onclick = () => guWinClose();
    b.querySelector('.gu-wc').onclick = () => guWinClose();
    document.body.appendChild(b);
    GU.bar = b;
    return b;
  }


  const GU_FRAME = { hero: 1 };
  function guDim(on) {
    let d = GU.dim;
    if (!d && on) { d = document.createElement('div'); d.className = 'gu-dim'; d.hidden = true; d.addEventListener('click', () => guWinClose()); document.body.appendChild(d); GU.dim = d; }
    if (d) d.hidden = !on;
  }

  function guWin(id, o) {
    if (!GU.on || !GU_WIN[id]) return;
    guPop('');
    if (!$('#tab-city').classList.contains('on')) tab('city');
    if (GU.win && GU.win !== id) guWinClose(true);
    const el = $('#tab-' + id); if (!el) return;
    GU.win = id;
    el.classList.add('on', 'gu-win'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    const b = guBar(); b.querySelector('.gu-wt').textContent = GU_WIN[id]; b.hidden = false;
    el.setAttribute('aria-labelledby', 'gu-wbar');
    document.documentElement.classList.add('gu-wopen');
    document.documentElement.classList.toggle('gu-wframe', !!GU_FRAME[id]); document.documentElement.classList.toggle('gu-whero', id === 'hero'); guDim(!!GU_FRAME[id]);
    try {
      if (id === 'hero') { if (o && (o.bag || o.gear) && view !== 'gear') { view = 'gear'; try { localStorage.setItem('lgView', view); } catch {} } last = ''; renderHero(); }
      else if (id === 'legion') legOpen();
      else if (id === 'season') openSeason();
      else if (id === 'war') openWar();
      else if (id === 'arena') openArena();
    } catch (e) { console.error('[игра] окно ' + id, e); }
    el.scrollTop = 0;
    if (o && o.bag) setTimeout(() => { const g = el.querySelector('.bag'); if (g) g.scrollIntoView({ block: 'start' }); }, 0);
    setTimeout(() => { const x = b.querySelector('.gu-wx'); if (x && GU.win === id) x.focus({ preventScroll: true }); }, 0);
    bfSoon(); guChat(); guAnn();
  }
  function guWinClose(quiet) {
    const id = GU.win; if (!id) return;
    GU.win = '';
    const el = $('#tab-' + id);
    if (el) { el.classList.remove('on', 'gu-win'); el.removeAttribute('role'); el.removeAttribute('aria-modal'); el.removeAttribute('aria-labelledby'); }
    if (GU.bar) GU.bar.hidden = true;
    document.documentElement.classList.remove('gu-wopen', 'gu-wframe', 'gu-whero'); guDim(false);
    try {
      if (id === 'season' && window.LGSeason) window.LGSeason.close();
      if (id === 'war' && window.LGWarCmd) window.LGWarCmd.close();
      if (id === 'arena' && window.LGArena) window.LGArena.close();
    } catch (e) { console.warn('[игра] закрыть окно ' + id, e); }
    if (!quiet && GU.el) { const b = GU.el.querySelector(`[data-gu="${id === 'hero' ? 'hero' : (id === 'season' || id === 'legion' ? 'rating' : 'map')}"]`); if (b) b.focus({ preventScroll: true }); }
    bfSoon(); guChat(); guAnn();
  }


  function guChat() {
    if (window.LGDm) setTimeout(() => window.LGDm.place(), 0);
    if (window.LGChatOne) setTimeout(() => window.LGChatOne.place(), 0);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !GU.on || e.defaultPrevented) return;
    if (GU.pop && !GU.pop.hidden) { guPop(''); return; }

    if (GU.win && (document.querySelector('.tab.gu-win .detail.open') || (matchMedia('(min-width: 1100px)').matches && document.querySelector('.tab.gu-win .hero-grid > .detail:not([data-none])')))) return;

    if (GU.win && !(e.target && e.target.closest && e.target.closest('input, textarea, select, .ctxm, .detail.open'))) guWinClose();
  });

   
  function guHudHtml() {
    const main = (k, ico, label, extra = '') => `<button type="button" class="gu-b" data-gu="${k}"${extra}><span class="gu-bi">${guIco(ico)}${k === 'guild' || k === 'mail' ? '<b class="gu-n" hidden></b>' : ''}</span><span class="gu-bl">${label}</span></button>`;
    return `<button type="button" class="gu-me" data-gu="hero-gear" aria-label="Открыть героя"><span class="gu-av">${guIco('hero')}<b class="gu-lv"></b></span>`
      + `<span class="gu-mi"><span class="gu-nm"></span><span class="gu-co"></span><span class="gu-xp" aria-hidden="true"><i></i></span></span></button>`


      + `<div class="gu-tr"><div class="gu-mmr"><button type="button" class="gu-s gu-fsb" data-gu="fs" aria-label="На весь экран" title="На весь экран">${guIco('fullscreen')}</button>`
      + `<button type="button" class="gu-mm" data-gu="map" aria-haspopup="dialog" aria-label="Мини-карта: карта мира, сезон, рейтинг"><span class="gu-mm-a" aria-hidden="true"><i></i><i></i><i></i><i class="me"></i></span><span class="gu-mm-i">${guIco('map')}</span><span class="gu-mm-t"></span></button></div>`
      + `<button type="button" class="gu-rt" data-gu="rating" aria-label="Рейтинг Легиона">${guIco('rating')}<span>Рейтинг</span></button>`
      + `<div class="gu-sm"><button type="button" class="gu-s" data-gu="friends" aria-label="Друзья">${guIco('friends')}<b class="gu-n" hidden></b></button>`
      + `<button type="button" class="gu-s" data-gu="others" aria-pressed="false" aria-haspopup="menu" aria-expanded="false" aria-label="Кого показывать в городе">${guIco('eye')}</button>`
      + `<button type="button" class="gu-s" data-gu="m-bug" aria-label="Отправить баг" title="Отправить баг">${guIco('bug')}</button>`
      + `<button type="button" class="gu-s" data-gu="m-pult" aria-label="Пульт стримера" title="Пульт стримера" hidden>${guIco('pult')}</button>`
      + `<button type="button" class="gu-s" data-gu="m-war" aria-label="Бой армий" title="Бой армий" hidden>${guIco('war')}</button></div>`

      + '<div class="gu-an" role="region" aria-label="Объявления" hidden></div>'
      + `<button type="button" class="gu-ev" data-gu="event" hidden><span class="gu-evi">${guIco('pumpkin')}</span><span class="gu-evl"></span></button></div>`
      + `<button type="button" class="gu-q" data-gu="quests" hidden><span class="gu-qh">${guIco('quests')}<span>Задания дня</span> <b></b></span><span class="gu-ql"></span></button>`
      + `<nav class="gu-main" aria-label="Игра">${main('hero', 'hero', 'Герой')}${main('guild', 'guild', 'Гильдия')}${main('arena', 'arena', 'Арена')}`
      + main('mail', 'mail', 'Почта<span class="gu-soon"> · скоро</span>', ' aria-disabled="true" title="Почта - скоро"')

      + main('fight', 'war', 'Поход', ' title="Поход: идёт - смотреть бой"') + '</nav>'
      + '<div class="gu-pop" hidden></div>';
  }
  function guHud() {
    if (GU.el) return GU.el;
    const d = document.createElement('div');
    d.id = 'gu-hud'; d.className = 'gu-hud'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Игра');
    d.innerHTML = guHudHtml();
    d.addEventListener('click', guClick);
    document.body.appendChild(d);
    GU.el = d; GU.pop = d.querySelector('.gu-pop');
    guMMWidget(d);
    window.addEventListener('lgfriends', guFriends);
    window.addEventListener('lgguilds', guGuild);
    return d;
  }
  

  function guCoinPart() { try { const D = window.MDDoodle; return D && D.part ? D.part('coins') : null; } catch { return null; } }
  function guCoins(el, money) {
    if (!el) return;
    const n = Math.max(0, Math.floor(+money || 0)), p = { g: Math.floor(n / 10000), s: Math.floor(n / 100) % 100, b: n % 100 };
    const ks = ['g', 's', 'b'].filter((k) => p[k] > 0); if (!ks.length) ks.push('b');
    const C = guCoinPart(), key = (C ? 'c' : 'e') + ks.map((k) => k + p[k]).join('');
    if (el.dataset.k === key) return;
    el.dataset.k = key;
    el.innerHTML = ks.map((k) => `<span class="gu-c gu-c-${k}" title="${C && C[k] ? C[k].name : { g: 'золото', s: 'серебро', b: 'медь' }[k]}">${C && C.svg ? C.svg(k, 18) : guIco('coin')}<b>${p[k]}</b></span>`).join('');
  }
  const guNum = (n) => Math.max(0, Math.floor(+n || 0)).toLocaleString('ru-RU').replace(/\s/g, ' ');
  const guText = (sel, t) => { const e = GU.el.querySelector(sel); if (e && e.textContent !== t) e.textContent = t; return e; };
  function guXp(h) {
    if (h.xpInLevel != null && h.xpToNext) return Math.max(0, Math.min(1, (+h.xpInLevel || 0) / Math.max(1, +h.xpToNext)));
    const a = +h.prevXp || 0, b = +h.next || 0;
    return b > a ? Math.max(0, Math.min(1, ((+h.xp || 0) - a) / (b - a))) : 1;
  }

  function guQuests(h) {

    const dl = h && h.dl; if (dl && Array.isArray(dl.t) && dl.t.length) return dl.t.map((r) => ({ t: r[0], p: r[1], g: r[2], done: !!r[3], dl: 1 }));
    const mn = (h && h.mn) || {}, ids = Object.keys(mn).sort((a, b) => (b === 'home') - (a === 'home'));
    for (const k of ids) { const q = mn[k] && mn[k].q; if (q && Array.isArray(q.d) && q.d.length) return q.d; }
    return null;
  }
  const guTown = () => { const b = $('#tab-city .cy-town b'); return (b && b.textContent) || 'Рябинень'; };
  function guRender() {
    const d = guHud(), h = ME.hero;
    guText('.gu-lv', String(h.level || 1));
    guText('.gu-nm', (h.gt ? `[${h.gt}] ` : '') + String(h.name || (ME.user && ME.user.name) || ''));
    guCoins(d.querySelector('.gu-co'), h.money);
    const xi = d.querySelector('.gu-xp i'), xs = `scaleX(${guXp(h).toFixed(3)})`; if (xi.style.transform !== xs) xi.style.transform = xs;
    d.querySelector('.gu-me').setAttribute('aria-label', `Открыть героя: ${h.name || ''}, уровень ${h.level || 1}, монет ${guNum(h.money)}`);
    guText('.gu-mm-t', guTown() + (ME.ss ? ' · Сезон' : ''));

    const ev = d.querySelector('.gu-ev'), evOn = !!(h.hwc && h.hwc.look);
    if (ev.hidden === evOn) ev.hidden = !evOn;
    if (evOn) { guText('.gu-evl', 'Хэллоуин'); ev.setAttribute('aria-label', 'Ивент: Хэллоуин'); }
    const qd = guQuests(h), qb = d.querySelector('.gu-q');
    qb.hidden = !qd;
    if (qd) {
      const done = qd.filter((x) => x.done || x.cl).length, ord = [...qd].sort((a, b) => (!!(a.done || a.cl)) - (!!(b.done || b.cl)));
      guText('.gu-qh b', `${done}/${qd.length}`);

      const html = ord.slice(0, 4).map((x) => {
        const ok = !!(x.done || x.cl), g = Math.max(1, +x.g || 1), p = ok ? g : Math.max(0, Math.min(g, +x.p || 0)), w = Math.round(p / g * 100);
        return `<span class="gu-qr${ok ? ' ok' : ''}" title="${esc(String(x.t || ''))}${ok ? ' - выполнено' : ` - ${guNum(p)} из ${guNum(g)}`}"><span class="gu-qt">${ok ? '<b class="gu-qk" aria-hidden="true">✓</b>' : ''}${esc(String(x.t || '').replace(/^Общее поручение шахты:\s*/, ''))}</span>`
          + `<span class="gu-qp"><span class="gu-qb" aria-hidden="true"><i style="width:${w}%"></i></span><i class="gu-qn">${ok ? 'готово' : `${guNum(p)}/${guNum(g)}`}</i></span></span>`;
      }).join('');
      const ql = d.querySelector('.gu-ql'); if (ql.innerHTML !== html) ql.innerHTML = html;
      qb.setAttribute('aria-label', `Задания дня: выполнено ${done} из ${qd.length} - открыть задания`);
    }
    const ar = d.querySelector('[data-gu="arena"]'); ar.classList.toggle('off', !arenaOk()); ar.title = arenaOk() ? 'Арена 5х5' : 'Арена пока закрыта';
    guFriends(); guTick();
  }
  





  const ANN_LS = 'lgAnnX';
  const annClosed = () => { try { const a = JSON.parse(localStorage.getItem(ANN_LS) || '[]'); return Array.isArray(a) ? a.map(String) : []; } catch { return []; } };
  function annClose(id) {
    const a = annClosed().filter((x) => x !== id); a.push(String(id));
    try { localStorage.setItem(ANN_LS, JSON.stringify(a.slice(-30))); } catch (e) { console.warn('[игра] объявление: закрытие не запомнилось', e); }
    guAnn();
  }
   
  function guAnnCity() {
    if (!GU.on || !GU.el || GU.win || !guCityOn() || inJail()) return false;
    if ((window.LGMine && window.LGMine.on) || (window.LGFish2 && window.LGFish2.on)) return false;
    const C = window.LGCity; let here = null;
    try { here = C && C.here ? C.here() : null; } catch { here = null; }
    return !!here;
  }
  function guAnn() {
    const box = GU.el && GU.el.querySelector('.gu-an'); if (!box) return;
    const shut = new Set(annClosed());

    const T = window.LGAnnTick;
    const list = (Array.isArray(ME && ME.an) ? ME.an : []).filter((a) => a && a.id && a.t && !shut.has(String(a.id)) && !(T && T.held(a))).slice(0, 2);
    const on = !!list.length && guAnnCity();
    const key = on ? JSON.stringify(list.map((a) => [a.id, a.t, !!a.g])) : '';
    if (box.dataset.k !== key) {
      box.dataset.k = key; box.textContent = '';
      for (const a of list) {
        const it = document.createElement('div'); it.className = 'gu-ann' + (a.g ? ' gu-ann-g' : ''); it.dataset.id = String(a.id); it.setAttribute('role', 'note');
        const h = document.createElement('b'); h.className = 'gu-anh'; h.textContent = a.g ? 'Объявление игры' : 'Объявление канала';
        const p = document.createElement('p'); p.className = 'gu-ant'; p.textContent = String(a.t);
        const x = document.createElement('button'); x.type = 'button'; x.className = 'gu-anx'; x.setAttribute('aria-label', 'Закрыть объявление'); x.title = 'Закрыть';
        x.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
        x.addEventListener('click', () => annClose(a.id));
        it.append(h, p, x); box.append(it);
      }
    }
    if (box.hidden === on) box.hidden = !on;
  }

  function guTick() {
    if (!GU.el) return;
    { const pult = $('.tabs button[data-tab="streamer"]'), pb = GU.el.querySelector('[data-gu="m-pult"]'), wb = GU.el.querySelector('[data-gu="m-war"]');
      if (pb) pb.hidden = !(pult && !pult.hidden); if (wb) wb.hidden = !warOk();
      const fsb = GU.el.querySelector('[data-gu="fs"]'); if (fsb) fsb.hidden = !(document.fullscreenEnabled || $('#tab-city .cy-fs')); }
    const fb = GU.el.querySelector('[data-gu="fight"]'), live = !!questOn;
    if (fb.classList.contains('off') === live) { fb.classList.toggle('off', !live); if (live) fb.removeAttribute('aria-disabled'); else fb.setAttribute('aria-disabled', 'true'); }
    fb.title = live ? 'Поход идёт - смотреть бой' : 'Поход - смотреть бой, когда идёт';

    const o = $('#tab-city .cy-others'), ob = GU.el.querySelector('[data-gu="others"]'), sh = guShow(), off = !!(sh && (sh.mode !== 'all' || sh.cap));
    if (ob.getAttribute('aria-pressed') !== String(off)) ob.setAttribute('aria-pressed', String(off));
    ob.classList.toggle('off', !o);
    guText('.gu-mm-t', guTown() + (ME && ME.ss ? ' · Сезон' : ''));
    guAnn();
  }
  function guFriends() {
    if (!GU.el) return;
    const f = window.LGFriends, b = GU.el.querySelector('[data-gu="friends"]'), n = f && f.n ? +f.n() || 0 : 0;
    b.hidden = !(f && f.open);
    const c = b.querySelector('.gu-n'); c.hidden = !n; c.textContent = n > 99 ? '99+' : String(n);
    b.setAttribute('aria-label', n ? `Друзья, новых заявок: ${n}` : 'Друзья');
  }

  function guMail(d) {
    if (!GU.el) return;
    const b = GU.el.querySelector('[data-gu="mail"]'); if (!b) return;
    const M = window.LGMail, on = !!M && !(d && d.off);
    b.classList.toggle('gu-mail-off', !on);
    if (on) { b.removeAttribute('aria-disabled'); b.title = 'Почта'; const s = b.querySelector('.gu-soon'); if (s) s.remove(); }
    const n = on ? +(d && d.unread != null ? d.unread : M.unread()) || 0 : 0, c = b.querySelector('.gu-n');
    if (c) { c.hidden = !n; c.textContent = n > 99 ? '99+' : String(n); }
    b.setAttribute('aria-label', n ? `Почта, новых писем: ${n}` : 'Почта');
  }
  window.addEventListener('lgmail', (e) => guMail(e && e.detail));

  function guGuild() {
    if (!GU.el) return;
    const b = GU.el.querySelector('[data-gu="guild"]'), c = b && b.querySelector('.gu-n'); if (!c) return;
    const n = window.LGGuilds && window.LGGuilds.n ? +window.LGGuilds.n() || 0 : 0;
    c.hidden = !n; c.textContent = n > 99 ? '99+' : String(n);
    b.setAttribute('aria-label', n ? `Гильдия, новых: ${n}` : 'Гильдия');
  }
   
  function guClick(e) {
    const b = e.target.closest('[data-gu]'); if (!b || !GU.el.contains(b)) return;
    const k = b.dataset.gu;
    if (k !== 'map' && k !== 'others' && !k.startsWith('e-')) guPop('');
    if (k === 'hero') return guWin('hero');
    if (k === 'hero-gear') return guWin('hero', { gear: true });
    if (k === 'bag') return guWin('hero', { bag: true });
    if (k === 'arena') return arenaOk() ? guWin('arena') : toast('Арена пока закрыта');
    if (k === 'guild') {

      if (window.LGGuilds && typeof window.LGGuilds.open === 'function') { try { window.LGGuilds.open({ big: true }); } catch (er) { console.warn('[игра] гильдия', er); } return; }
      return toast('Гильдия: окно скоро появится');
    }
    if (k === 'mail') return window.LGMail ? window.LGMail.open() : toast('Почта - скоро');
    if (k === 'fight') return questOn ? tab('quest') : toast('Смотреть бой можно, когда идёт Поход');
    if (k === 'friends') { if (window.LGFriends && window.LGFriends.open) window.LGFriends.open(); return; }

    if (k === 'others') { if (!guShow()) { toast('Сейчас в городе некого скрыть'); return; } return guPop(GU.popKind === 'eye' && !GU.pop.hidden ? '' : 'eye', b); }
    if (k.startsWith('e-')) {
      const C = window.LGCity; if (!C || !C.showSet) return;
      if (k === 'e-all' || k === 'e-fr' || k === 'e-gl' || k === 'e-none') C.showSet({ mode: k.slice(2) });
      else if (k.startsWith('e-cap')) C.showSet({ cap: +k.slice(5) || 0 });
      guPop('eye', null, true); guTick(); return;
    }

    if (k === 'quests') { if (window.LGDailies && ME.hero && ME.hero.dl) { window.LGDailies.open(); return; } if (CX && CX.openMineBoard) CX.openMineBoard(); return; }
    if (k === 'event') return toast('Идёт Хэллоуин: ищи его гостей на улицах города');
    if (k === 'map') return guMap(b);
    if (k === 'rating') { const MM = guMM(); if (MM) { try { MM.open({ tab: 'rating' }); return; } catch (er) { console.warn('[игра] рейтинг', er); } } return GU_WIN.legion ? guWin('legion') : legOpen(); }
    if (k === 'fs') return guFs();

    if (k === 'm-bug') return bugOpen();
    if (k === 'm-pult') return tab('streamer');
    if (k === 'm-world') return tab('world');
    if (GU_WIN[k.slice(2)]) return guWin(k.slice(2));
    if (k === 'm-fs') { const x = $('#tab-city .cy-fs'); if (x) x.click(); }
  }
  

  const guMM = () => { const MM = window.LegionMiniMap; return MM && typeof MM.open === 'function' ? MM : null; };
  function guMap(btn) {
    const MM = guMM();
    if (MM) { try { MM.open({ tab: 'map' }); return; } catch (er) { console.warn('[игра] мини-карта', er); } }
    guPop(GU.popKind === 'map' && !GU.pop.hidden ? '' : 'map', btn);
  }

  function guMMWidget(d) {
    const MM = guMM(); if (!MM || typeof MM.widget !== 'function') return;
    const old = d.querySelector('.gu-mm'), box = document.createElement('div');
    box.className = 'gu-mmw';
    try { old.replaceWith(box); MM.widget(box, {}); } catch (er) { console.warn('[игра] виджет мини-карты', er); if (box.isConnected) box.replaceWith(old); }
  }
  const guItem = (k, t, on = true) => (on ? `<button type="button" role="menuitem" data-gu="${k}">${t}</button>` : '');
  const guShow = () => { const C = window.LGCity; try { return C && C.show ? C.show() : null; } catch { return null; } };
  const guRadio = (k, t, on, show = true) => (show ? `<button type="button" role="menuitemradio" aria-checked="${!!on}" data-gu="${k}"><i class="gu-rd" aria-hidden="true"></i>${t}</button>` : '');
  function guEye() {
    const sh = guShow() || { mode: 'all', cap: 0, fr: false };

    const seg = (k, t, on, show = true, lab = '') => (show ? `<button type="button" role="menuitemradio" aria-checked="${!!on}" data-gu="${k}"${lab ? ` aria-label="${lab}"` : ''}>${t}</button>` : '');
    return '<p class="gu-pt gu-ptc">Кого показывать</p><div class="gu-cap-r" role="group" aria-label="Кого показывать">'
      + seg('e-all', 'Всех', sh.mode === 'all', true, 'Всех игроков') + seg('e-fr', 'Друзей', sh.mode === 'fr', sh.fr, 'Только друзей') + seg('e-gl', 'Гильдию', sh.mode === 'gl', !!sh.gl, 'Только гильдию') + seg('e-none', 'Никого', sh.mode === 'none')
      + '</div><p class="gu-pt gu-ptc" title="Меньше игроков - легче для слабого ПК и телефона">Сколько максимум</p><div class="gu-cap-r" role="group" aria-label="Сколько игроков показывать максимум">'
      + [0, 50, 25, 10, 5].map((n) => seg(`e-cap${n}`, n ? String(n) : 'Все', (sh.cap || 0) === n, true, n ? `${n} ближайших` : '')).join('')
      + '</div>';
  }
  

  function guPlace(pop, b) {
    if (!pop || !b || !GU.el) return;
    pop.style.left = pop.style.right = pop.style.top = pop.style.bottom = ''; pop.classList.remove('gu-pl');
    const H = GU.el.getBoundingClientRect(), row = b.closest('.gu-sm') || b, R = row.getBoundingClientRect(), B = b.getBoundingClientRect();
    const pw = pop.offsetWidth, ph = pop.offsetHeight, pad = 8;
    let top = R.bottom - H.top + 12, right = H.right - R.right;
    if (top + ph > H.height - pad) {
      pop.classList.add('gu-pl');
      top = Math.max(pad, Math.min(B.top - H.top - 10, H.height - ph - pad)); right = H.right - R.left + 12;
      pop.style.setProperty('--gu-ay', `${Math.round(B.top + B.height / 2 - H.top - top - 7)}px`);
    } else {
      const left = H.width - right - pw;
      if (left < pad) right = H.width - pw - pad;
      pop.style.setProperty('--gu-ax', `${Math.round(B.left + B.width / 2 - H.left - (H.width - right - pw) - 7)}px`);
    }
    pop.style.top = `${Math.round(top)}px`; pop.style.right = `${Math.round(Math.max(pad, right))}px`;
  }
  function guPop(kind, btn, keep) {
    if (!GU.pop) return;
    const mb = GU.el.querySelector('[data-gu="menu"]'), eb = GU.el.querySelector('[data-gu="others"]');
    if (!kind) { GU.pop.hidden = true; GU.popKind = ''; if (mb) mb.setAttribute('aria-expanded', 'false'); eb.setAttribute('aria-expanded', 'false'); return; }
    if (kind === 'eye') {
      const foc = keep && document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.gu : '';
      GU.pop.innerHTML = guEye(); GU.pop.dataset.kind = 'eye'; GU.pop.setAttribute('role', 'menu'); GU.pop.setAttribute('aria-label', 'Кого показывать в городе');
      GU.pop.hidden = false; GU.popKind = 'eye'; if (mb) mb.setAttribute('aria-expanded', 'false'); eb.setAttribute('aria-expanded', 'true');
      guPlace(GU.pop, eb);
      const f = (foc && GU.pop.querySelector(`[data-gu="${foc}"]`)) || GU.pop.querySelector('[aria-checked="true"]') || GU.pop.querySelector('button');
      if (f && (btn || keep)) f.focus({ preventScroll: true });
      return;
    }
    eb.setAttribute('aria-expanded', 'false');
    const pult = $('.tabs button[data-tab="streamer"]'), worldB = $('.tabs button[data-tab="world"]');
    const items = kind === 'menu'
      ? guItem('m-bug', 'Отправить баг') + guItem('m-pult', 'Пульт стримера', !!(pult && !pult.hidden))
        + guItem('m-fs', 'На весь экран', !!$('#tab-city .cy-fs'))
        + guItem('m-legion', 'Легион (рейтинг)') + guItem('m-season', 'Сезоны', seasonOk()) + guItem('m-war', 'Бой армий', warOk())
      : `<p class="gu-pt">${esc(guTown())}</p>` + guItem('m-world', 'Карта мира', !!(worldB && !worldB.hidden)) + guItem('m-season', 'Сезон', seasonOk()) + guItem('m-legion', 'Рейтинг') + guItem('m-war', 'Бой армий', warOk());
    GU.pop.innerHTML = items; GU.pop.dataset.kind = kind; GU.pop.setAttribute('role', 'menu'); GU.pop.setAttribute('aria-label', kind === 'menu' ? 'Меню' : 'Мини-карта');
    GU.pop.hidden = false; GU.popKind = kind;
    if (mb) mb.setAttribute('aria-expanded', String(kind === 'menu'));
    const f = GU.pop.querySelector('button'); if (f && btn) f.focus({ preventScroll: true });
  }
  document.addEventListener('pointerdown', (e) => { if (GU.pop && !GU.pop.hidden && !(e.target.closest && e.target.closest('.gu-pop, [data-gu="menu"], [data-gu="map"], [data-gu="others"]'))) guPop(''); }, true);
   
  function guCity() {
    const on = guCityOn(), R = document.documentElement;
    R.classList.toggle('gu-city', on);
    guAnn();
    if (!on) { R.classList.remove('gu-cap'); clearInterval(GU.tick); GU.tick = 0; return; }
    const top = $('.top'), qb = $('#qbar');
    let y = 0;
    if (top && !R.classList.contains('gu-fs') && getComputedStyle(top).position !== 'fixed') y = Math.max(y, top.getBoundingClientRect().bottom);
    if (qb && !qb.hidden) y = Math.max(y, qb.getBoundingClientRect().bottom);
    R.style.setProperty('--gu-top', Math.max(0, Math.round(y)) + 'px');
    if (!GU.tick) GU.tick = setInterval(() => { if (!document.hidden) guTick(); }, 2000);
  }
  


  function guFs() {
    const R = document.documentElement;
    try {
      if (document.fullscreenElement) { document.exitFullscreen(); return; }
      if (R.requestFullscreen) { R.requestFullscreen({ navigationUI: 'hide' }).catch(() => toast('На весь экран - недоступно')); return; }
    } catch (e) {   }
    const x = $('#tab-city .cy-fs'); if (x) x.click(); else toast('На весь экран - недоступно');
  }
  document.addEventListener('fullscreenchange', () => {
    const R = document.documentElement, on = document.fullscreenElement === R;
    R.classList.toggle('gu-fs', on);
    const b = GU.el && GU.el.querySelector('[data-gu="fs"]');
    if (b) { b.innerHTML = guIco(on ? 'fullscreen-exit' : 'fullscreen'); b.setAttribute('aria-pressed', String(on)); b.title = on ? 'Свернуть (Esc)' : 'На весь экран'; b.setAttribute('aria-label', b.title); }
    clearTimeout(guRsT); guRsT = setTimeout(guCity, 60);
  });
  let guRsT = 0;
  window.addEventListener('resize', () => { clearTimeout(guRsT); guRsT = setTimeout(guCity, 120); });
  function guSync() {
    const on = guOn(), R = document.documentElement;
    if (on !== GU.on) {
      GU.on = on; R.classList.toggle('gu', on);
      const cb = $('.tabs button[data-tab="city"]'); if (cb) cb.textContent = on ? 'Игра' : 'Город';
      if (!on) { guWinClose(true); guPop(''); }
      else {

        const cur = (($('.tabs button[aria-current]') || {}).dataset || {}).tab;
        if (cur === 'hero') tab('city'); else if (GU_WIN[cur]) guWin(cur);

        if (!window.LGCity) (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(() => { if (!window.LGCity) cityPre(true); }, { timeout: 5000 });
      }
    }
    if (on) guRender();
    guCity();
  }
  window.LGGameUi = { on: () => GU.on, win: (id) => guWin(id), close: () => guWinClose(), open: () => GU.win || '', ann: () => guAnn() };
   



  let mtEl = null, mtT = 0, mtBg = null;
  function maintShow(m) {
    const pz = !!(m && m.pause);
    pauseShow(pz);
    if ((!m || pz) && mtEl) { mtEl.remove(); mtEl = null; document.documentElement.classList.remove('lg-maint-on'); }
    if (!m) {
      clearTimeout(mtT); mtT = 0;
      if (mtBg) { mtBg(); mtBg = null; }
      return;
    }
    if (!pz) {
      if (!mtEl) {
        mtEl = document.createElement('div'); mtEl.className = 'lg-maint'; mtEl.setAttribute('role', 'alertdialog'); mtEl.setAttribute('aria-modal', 'true');
        mtEl.innerHTML = '<div class="lg-maint-box"><div class="lg-maint-ico" aria-hidden="true">&#9874;</div><p class="lg-maint-t"></p></div>';
        document.body.appendChild(mtEl); document.documentElement.classList.add('lg-maint-on');
      }
      mtEl.querySelector('.lg-maint-t').textContent = String(m.text || 'Технические работы - скоро вернёмся');
    }
    if (!mtT) mtT = setTimeout(() => {
      mtT = 0;

      if (pz && SU.bg && SU.bg.state() === 'hidden') { if (!mtBg) mtBg = SU.bg.on((st) => { if (st === 'hidden') return; if (mtBg) { mtBg(); mtBg = null; } if (pzEl && !mtT) maintAsk(m); }); return; }
      maintAsk(m);
    }, pz ? 5000 : 30000);
  }
  async function maintAsk(m) {
    try { const r = await api('/api/me' + PICKQ); if (r && r.ok !== false) { verSeen(r.ver); maintShow(r.maintenance || null); if (!r.maintenance) { last = ''; apply(r, true); } } else maintShow(m); } catch (e) { maintShow(m); }
  }



  let pzEl = null;
  const pzKey = (e) => { if (!pzEl || e.ctrlKey || e.metaKey || /^F\d{1,2}$/.test(e.key)) return; e.preventDefault(); e.stopImmediatePropagation(); };
  function pauseShow(on) {
    if (!on) {
      if (!pzEl) return;
      pzEl.remove(); pzEl = null; document.documentElement.classList.remove('lg-pz-on');
      for (const t of ['keydown', 'keypress', 'keyup']) window.removeEventListener(t, pzKey, true);
      return;
    }
    if (pzEl) return;
    pzEl = document.createElement('div'); pzEl.className = 'lg-pz'; pzEl.setAttribute('role', 'alertdialog'); pzEl.setAttribute('aria-modal', 'true');
    pzEl.setAttribute('aria-labelledby', 'lg-pz-t'); pzEl.tabIndex = -1;
    pzEl.innerHTML = '<div class="lg-pz-w"><div class="lg-pz-ico" aria-hidden="true"></div><p class="lg-pz-t" id="lg-pz-t">Пауза игры, рестарт серверов</p><p class="lg-pz-n">Ничего не теряется, игра продолжится сама</p></div>';

    for (const t of ['pointerdown', 'mousedown', 'click', 'dblclick', 'contextmenu', 'touchstart']) pzEl.addEventListener(t, (e) => { e.preventDefault(); e.stopPropagation(); }, { passive: false });
    document.body.appendChild(pzEl); document.documentElement.classList.add('lg-pz-on');
    for (const t of ['keydown', 'keypress', 'keyup']) window.addEventListener(t, pzKey, true);
    try { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); pzEl.focus({ preventScroll: true }); } catch (e) { console.warn('[сайт] фокус на паузе', e); }
  }


  const PICKQ = /[?&]pick=1(&|$)/.test(location.search) ? '?pick=1' : '';
  if (PICKQ && !DEMO) window.LG_LOGIN = '/auth/twitch/login?next=%2F';




  let srvVer = '', reloadT = 0, warnEl = null, warnT = 0, warnAt = 0, warnBg = null;
  function verSeen(v) {
    if (!v) return;
    if (!srvVer) { srvVer = String(v); return; }
    if (String(v) !== srvVer && !reloadT) {
      reloadT = setTimeout(() => location.reload(), Math.floor(Math.random() * 20000));
      if (pzEl) { pzEl.querySelector('.lg-pz-t').textContent = 'Пауза снята'; pzEl.querySelector('.lg-pz-n').textContent = 'Новая версия - страница сейчас обновится'; }
    }
  }
  const pzClock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  function pauseWarn(at) {
    warnAt = at > Date.now() ? at : 0;
    clearTimeout(warnT); warnT = 0;
    if (!warnAt) {
      if (warnEl) { warnEl.remove(); warnEl = null; }
      if (warnBg) { warnBg(); warnBg = null; }
      return;
    }
    if (!warnEl) {
      warnEl = document.createElement('div'); warnEl.className = 'lg-pzw'; warnEl.setAttribute('role', 'status');
      warnEl.innerHTML = '<span class="lg-pzw-ico" aria-hidden="true"></span><span class="lg-pzw-t">Пауза игры через <b></b></span>';
      warnEl.title = 'Короткий рестарт серверов. Ничего не потеряется';
      document.body.appendChild(warnEl);
    }
    warnEl.querySelector('b').textContent = pzClock(Math.max(0, Math.ceil((warnAt - Date.now()) / 1000)));

    if (SU.bg && SU.bg.state() === 'hidden') { if (!warnBg) warnBg = SU.bg.on((st) => { if (st === 'hidden') return; if (warnBg) { warnBg(); warnBg = null; } pauseWarn(warnAt); }); return; }
    warnT = setTimeout(() => pauseWarn(warnAt), ((warnAt - Date.now()) % 1000 || 1000) + 20);
  }
  function pauseEvent(d) {
    if (!d) return;
    pauseWarn(d.on ? 0 : d.warnAt);
    if (d.on) maintShow({ text: 'Пауза игры, рестарт серверов', pause: true });
    else { verSeen(d.ver); if (pzEl && !reloadT) maintShow(null); }
  }
  window.LG_PAUSE_EVENT = pauseEvent;
  async function load() {
    const r = await api('/api/me' + PICKQ);
    if (!r || r.ok === false) return false;
    maintShow(r.maintenance || null);
    verSeen(r.ver);
    apply(r, true);
    if (r.ql) questData(r.ql, r.now);
    return true;
  }

  let laterT = 0;
  function apply(r, full) {
    const wasUser = !!(ME && ME.user);
    const next = full ? r : { ...ME, hero: r.hero, creating: r.creating, results: r.results, synced: r.synced || (ME && ME.synced), ...(r.fq ? { fq: r.fq } : {}) };
    const k = JSON.stringify([next.user, next.hero, next.creating, (next.results || []).map((x) => x.id), next.jail || null]);
    ME = next; nameItems(ME && ME.hero);

    for (const a of document.querySelectorAll('.site-foot .gp-doc')) a.hidden = !(ME && ME.gp);
    for (const x of (ME && ME.results) || []) {
      if (shownRes.has(x.id)) continue;
      if (x.x && x.x.op === 'qact') { shownRes.add(x.id); if (window.LGQuest && window.LGQuest.result) window.LGQuest.result(x); else if (!x.ok) toast(x.error || 'Не вышло', true); continue; }
      if (x.x && x.x.op === 'hwSwap') { shownRes.add(x.id); try { window.LGHwNpc && window.LGHwNpc.result && window.LGHwNpc.result(x); } catch (e) {   } toast(x.ok ? (x.x.coins != null ? `Обменяно ${x.x.n} конфет на монеты: +${x.x.coins}` : 'Конфеты обменяны на монеты') : 'Обмен не вышел: ' + (x.error || 'попробуй ещё раз'), !x.ok); continue; }

      if (x.x && x.x.op === 'hwBack') { shownRes.add(x.id); try { window.LGHwNpc && window.LGHwNpc.result && window.LGHwNpc.result(x); } catch (e) {   } toast(x.ok ? (x.x.test ? 'Тест: ничего не списано' : `Обменяно ${x.x.coins} монет на конфеты: +${x.x.n}`) : 'Обмен не вышел: ' + (x.error || 'попробуй ещё раз'), !x.ok); continue; }
      if (x.x && x.x.op === 'hwBuy') { shownRes.add(x.id); try { window.LGHwNpc && window.LGHwNpc.result && window.LGHwNpc.result(x); } catch (e) {   } toast(x.ok ? (x.x.test ? `Тест: «${x.x.got || 'вещь'}» - ничего не списано` : `Обмен готов: «${x.x.got || 'вещь'}» - за ${x.x.price} конфет`) : 'Обмен не вышел: ' + (x.error || 'попробуй ещё раз'), !x.ok); continue; }

      if (x.x && x.x.op === 'hwPick') { shownRes.add(x.id); try { window.LGHwNpc && window.LGHwNpc.result && window.LGHwNpc.result(x); } catch (e) {   } toast(x.ok ? (x.x.test ? `Тест: «${x.x.got || 'награда'}» - ничего не выдано` : x.x.all ? `Награды пасса получены: ${x.x.got || (x.x.lvs || []).length}` : `Награда пасса получена: «${x.x.got || 'награда'}»`) : 'Получить не вышло: ' + (x.error || 'попробуй ещё раз'), !x.ok); continue; }

      if (x.x && x.x.op === 'jClaim') { shownRes.add(x.id); jClaimDone(x); continue; }
      if (x.x && x.x.op === 'fcoin') { shownRes.add(x.id); if (window.LGFriends && window.LGFriends.coinDone) window.LGFriends.coinDone(x); else toast(x.ok ? 'Монета дня подарена' : 'Монета дня: ' + (x.error || 'не вышло'), !x.ok); continue; }
      if (x.x && x.x.op === 'seal') { shownRes.add(x.id); toast('Печать применена: у героя теперь свой стиль'); continue; }
      if (x.x && /^(st|auc|note)/.test(x.x.op || '')) { shownRes.add(x.id); storeNote(x); continue; }
      if (x.x && x.x.op === 'craftF2') { shownRes.add(x.id); if (window.LGFish2 && window.LGFish2.result) window.LGFish2.result(x); else if (!x.ok) toast(x.error || 'Не вышло', true); continue; }
      if (x.x && /^craft[A-Z]/.test(x.x.op || '')) { shownRes.add(x.id); if (window.LGCraft && window.LGCraft.result) window.LGCraft.result(x); else toast(x.ok ? (x.x.t || 'Готово') : (x.error || 'Не вышло'), !x.ok); continue; }
      if (x.x && /^mine/.test(x.x.op || '')) { shownRes.add(x.id); if (window.LGMine && window.LGMine.result) window.LGMine.result(x); else if (!x.ok) toast(x.error || 'Не вышло', true); continue; }
      if (x.x || x.id === FG.wait) { shownRes.add(x.id); forgeDone(x); continue; }
      if (!x.ok) { shownRes.add(x.id); toast('Игра не применила изменение: ' + (x.error || 'вещи больше нет'), true); }
    }
    fgSync();
    if (FG.el) fgRender();
    guAnn();
    if (k === last) return; last = k;




    if (DR.active || DR.src || document.querySelector('.ctxm') || busy || lcHot() || SU.picking() || scrollHot()) { clearTimeout(laterT); laterT = setTimeout(() => { last = ''; apply(ME, true); }, 700); return; }
    renderUser(); renderHero(); smVis(); cityVis(); questVis(); worldVis(); warVis(); seasonVis(); arenaVis(); jailUi();
    guSync();
    document.documentElement.classList.toggle('ph2', !!(ME && ME.hero && ME.hero.p2));
    if (window.LGQuest && window.LGQuest.hero) window.LGQuest.hero();
    if (window.LGMine && window.LGMine.on && window.LGMine.hero) window.LGMine.hero();
    if (window.LGCraft && window.LGCraft.hero) window.LGCraft.hero();
    if (typeof f2Leg === 'function') f2Leg();
    if (ME && ME.user) bfInit(); bfSoon();
    if (window.LGCity && $('#tab-city').classList.contains('on')) window.LGCity.heroChanged();

    if (ME && ME.user && ME.hero && ME.hero.cd && !inJail()) dmLoad().catch(() => null);

    if (ME && ME.user && ME.hero && ME.hero.c1 && !inJail()) oneLoad().catch(() => null); else if (window.LGChatOne && ME && ME.hero) window.LGChatOne.init(oneCtx());

    if (window.LGDm) window.LGDm.place();
    if (!wasUser && ME.user) { if (logOn()) loadLog(); jrWant(); live(); }
  }

  






  let ES = null, esOk = false, hideT = 0, smEs = false, smOpen = 0, wsNoAuth = false;





  const LIVE_POLL_AFTER = 3;
  const LIVE_SLOW_MS = 20000;
  const liveBack = SU.backoff({ steps: SU.LIVE_STEPS, jitter: 0.5 });
  const liveCan = () => !!window.LGLiveLink && (!!window.EventSource || !!window.WebSocket);
  const pollOk = () => !DEMO && !esOk && (!liveCan() || liveBack.fails() >= LIVE_POLL_AFTER || (!!ES && ES.downMs() > LIVE_SLOW_MS));
  window.LGPollOk = pollOk;
  function live() {
    if (DEMO || ES || !liveCan()) return;
    if (!DOCK && (!ME || !ME.user || document.hidden)) return;
    const q = DOCK ? '?sm=1&only=sm' : ME.streamer ? '?sm=1' : '';

    const wsOn = () => !DOCK && !wsNoAuth && !!(ME && ME.hero && ME.hero.lw) && !inJail() && !!(window.LG_CH && window.LG_CH.login);
    ES = window.LGLiveLink.open({
      sse: () => (window.LG_BASE || '') + '/api/live' + q,
      ws: () => (wsOn() ? { url: (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws', ch: window.LG_CH.login, sm: !!q } : null),


      onAuth: () => { stopLive(); load().then(() => { if (ME && ME.user) wsNoAuth = true; live(); }).catch(() => null); },
      log: (t, e) => (e ? console.error('[сайт] живой канал: ' + t, e) : console.info('[сайт] живой канал: ' + t)),
      backoff: liveBack, hold: SU.hold,
    });
    if (!DOCK) {
      ES.addEventListener('me', (e) => { esOk = true; try { const d = JSON.parse(e.data); if (d.now) clock(d.now); if (d.gnow) gclock(d.now, d.gnow); apply(d, false); } catch {} });
      ES.addEventListener('j', (e) => { try { logAdd(JSON.parse(e.data)); } catch {} });

      ES.addEventListener('city', (e) => { try { const d = JSON.parse(e.data); if (window.LGChatOne && window.LGChatOne.on() && (d.chat || d.chatDel || d.chatMe)) window.LGChatOne.onFeed('city', d); if (window.LGCity) window.LGCity.onEvent(d); } catch (er) { console.error('[сайт] событие «city»', er); } });

      ES.addEventListener('mine', (e) => { try { const d = JSON.parse(e.data); if (d.chatRoom === 'mine' && window.LGChatOne && window.LGChatOne.on()) { window.LGChatOne.onFeed('mine', d); return; } if (window.LGMine && window.LGMine.on) window.LGMine.onEvent(d); } catch (er) { console.error('[сайт] событие «mine»', er); } });
      ES.addEventListener('dm', (e) => { let d = null; try { d = JSON.parse(e.data); } catch {} if (!d) return; if (window.LGDm) window.LGDm.onEvent(d); else if (d.m) dmLoad().then(() => window.LGDm && window.LGDm.onEvent(d)).catch(() => null); });


      ES.addEventListener('ann', (e) => { try { const d = JSON.parse(e.data); if (ME) { ME.an = Array.isArray(d.an) ? d.an : []; annEvent(d); } } catch (er) { console.error('[сайт] событие «ann»', er); } });

      ES.addEventListener('gc', (e) => { let d = null; try { d = JSON.parse(e.data); } catch (er) { console.error('[сайт] событие «gc»', er); } if (d) window.dispatchEvent(new CustomEvent('lg-gchat', { detail: d })); });

      window.addEventListener('lg-gchat', (e) => { const d = e.detail; if (!d || d.k !== 'note') return; let when = ''; try { when = d.until ? new Date(+d.until).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) + ' МСК' : ''; } catch (er) { when = ''; } toast(d.w === 'reset' ? 'Срок на смену названия гильдии вышел - название сброшено' : `Модератор: смени название гильдии${when ? ' до ' + when : ' за 24 часа'} - подробности в журнале`, d.w !== 'reset'); try { if (window.LGMail && window.LGMail.refresh) window.LGMail.refresh(); } catch (er) { console.warn('[сайт] почта после уведомления гильдии', er); } });
      ES.addEventListener('mail', (e) => { try { if (window.LGMail) window.LGMail.onEvent(JSON.parse(e.data)); } catch {} });
      ES.addEventListener('fish', (e) => { try { if (window.LGFish2 && window.LGFish2.live) window.LGFish2.live(JSON.parse(e.data)); } catch (er) { console.error('[сайт] событие «fish»', er); } });
      ES.addEventListener('fr', (e) => { try { if (window.LGFriends) window.LGFriends.onEvent(JSON.parse(e.data)); } catch {} });
      ES.addEventListener('q', (e) => { try { const d = JSON.parse(e.data); if (d.gnow) gclock(d.now, d.gnow); questData(d, d.now); } catch {} });

      ES.addEventListener('war', (e) => { try { warEvent(JSON.parse(e.data)); } catch (er) { console.error('[сайт] событие «war»', er); } });
      ES.addEventListener('wa', (e) => { try { waEvent(JSON.parse(e.data)); } catch (er) { console.error('[сайт] событие «wa»', er); } });
      ES.addEventListener('pz', (e) => { try { pauseEvent(JSON.parse(e.data)); } catch (er) { console.error('[сайт] событие «pz»', er); } });

      ES.addEventListener('jail', (e) => { let d = null; try { d = JSON.parse(e.data); } catch (x) { d = null; } if (!d) return; if (window.LGCity && window.LGCity.jail) window.LGCity.jail(d); const me = CX.login(), inn = (d.list || []).some((x) => x.l === me); if (me && inn !== inJail()) load(); });
    }
    ES.addEventListener('style', (e) => { let d = {}; try { d = JSON.parse(e.data) || {}; } catch {} styleEvent(String(d.style || '')); });
    ES.addEventListener('sm', (e) => { let d = {}; try { d = JSON.parse(e.data) || {}; } catch {} if ((d.why || []).includes('mods')) { smStale = true; smStaleCheck(); } smRefresh(true, d.style); smTell(d.why); });
    ES.addEventListener('open', () => { if (DOCK) return; window.dispatchEvent(new CustomEvent('lg-gchat', { detail: { k: 're' } })); if (window.LGChatOne && window.LGChatOne.resync) window.LGChatOne.resync(); });
    ES.onopen = () => { smEs = !!q; if (q && smOpen++ && SM.data) smRefresh(true); };

    ES.onerror = () => { esOk = false; smEs = false; };
  }
  window.LGLive = () => !!ES && esOk;

  window.LGLiveDownMs = () => (ES && ES.downMs ? ES.downMs() : esOk ? 0 : 1e9);
  function stopLive() { if (ES) { try { ES.close(); } catch {} ES = null; } esOk = false; smEs = false; }
  document.addEventListener('visibilitychange', () => {
    if (DOCK) return;
    clearTimeout(hideT);
    if (document.hidden) { hideT = setTimeout(stopLive, 60000); return; }

    if (!ES) { liveBack.reset(); if (!SU.hold.left()) load(); live(); if (logOn()) loadLog(); if (JA) loadMini(true); }
  });
  const shownRes = new Set();
  mqWide.addEventListener && mqWide.addEventListener('change', () => { sheet = false; renderHero(); });
  window.LG = { restyle: (st) => siteRestyle(st), rerender: (keepSm) => { last = ''; INV.artReset(); applyStyle(); if (SM.data && !keepSm) { smDrop(); if ($('#tab-streamer').classList.contains('on')) openStreamer(); } load(); if ($('#tab-legion').classList.contains('on')) legOpen(); if (logOn()) { jAt = ''; loadLog(); } } };
  

  const TEMP_STYLE_SWITCH = true;
  const STYLE_LIST = SU.STYLES;
  const BASE_STYLE = sty();

  const OPEN = Array.isArray(window.LG_STYLES) ? window.LG_STYLES : STYLE_LIST.map(([k]) => k);
  const canSwitch = STYLE_LIST.filter(([k]) => OPEN.includes(k) && D() && D().styles && D().styles[k]).length > 1;
  if (!canSwitch) try { localStorage.removeItem('lgStyle'); } catch {}
  if (TEMP_STYLE_SWITCH && !DEMO && !DOCK && canSwitch) {
    try { const v = localStorage.getItem('lgStyle'); if (v && OPEN.includes(v) && D() && D().styles && D().styles[v]) D().use(v); } catch {}
    const box = document.createElement('div');
    box.className = 'style-switch'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Стиль сайта');
    const paint = () => { box.innerHTML = `<span class="ss-l">Стиль</span>` + STYLE_LIST.filter(([k]) => OPEN.includes(k) && D() && D().styles && D().styles[k]).map(([k, l]) => `<button type="button" data-st="${k}" aria-pressed="${sty() === k}">${l}</button>`).join(''); };
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-st]'); if (!b) return;
      try { D().use(b.dataset.st); } catch {}
      try { if (b.dataset.st === BASE_STYLE) localStorage.removeItem('lgStyle'); else localStorage.setItem('lgStyle', b.dataset.st); } catch {}
      paint(); window.LG.rerender();
    });
    paint(); document.body.appendChild(box);
  }
  applyStyle();

  if (DOCK) { document.documentElement.classList.add('dock'); $('.tabs button[data-tab="streamer"]').hidden = false; tab('streamer'); live(); return; }
  chswInit();
  let t0 = 'hero'; try { t0 = localStorage.getItem('lgTab') || 'hero'; } catch {}

  if (location.hash === '#streamer') { t0 = 'streamer'; try { history.replaceState(history.state, '', location.pathname + location.search); } catch {} }

  if (location.hash === '#md') { t0 = 'streamer'; try { history.replaceState(history.state, '', location.pathname + location.search); } catch {} }

  if (location.hash === '#adm') { t0 = 'streamer'; smMode = 'admin'; smSecWant = 'md:adm'; try { history.replaceState(history.state, '', location.pathname + location.search); } catch {} }

  if (location.hash === '#admin') { t0 = 'streamer'; smMode = 'admin'; try { history.replaceState(history.state, '', location.pathname + location.search); } catch {} }

  if (location.hash === '#city') { t0 = 'city'; try { history.replaceState(history.state, '', location.pathname + location.search); } catch {} }

  window.addEventListener('hashchange', () => { if (location.hash === '#admin' && smOk()) smModeSet('admin'); else if (location.hash === '#adm' && smOk()) smModeSet('admin', 'md:adm'); });
  window.addEventListener('hashchange', () => { if (location.hash === '#streamer') { try { history.replaceState(history.state, '', location.pathname + location.search); } catch {} if (smOk()) { if (smMode) smModeSet(''); else tab('streamer'); } else smWant = true; } });
  if (t0 === 'streamer') smWant = true;
  if (t0 === 'world') worldWant = true;
  if (t0 === 'war') warWant = true;
  if (t0 === 'season') seasonWant = true;
  if (t0 === 'arena') arenaWant = true;
  if (t0 === 'city') { cityWant = true; tabPre('city', true); }
  if (t0 === 'log') { view = 'log'; t0 = 'hero'; }
  if (t0 === 'soc') { lgv = 'soc'; t0 = 'legion'; }
  tab(t0 === 'legion' || t0 === 'news' ? t0 : 'hero');
  load().then((x) => { lazyIdle(); return live(x); });



  const meBack = SU.backoff({ steps: [30000, 60000, 180000], jitter: 0.5, up: true });
  let meAt = Date.now() + 30000;
  setInterval(() => {
    if (document.visibilityState !== 'visible' || busy || DEMO || esOk || SU.hold.left()) return;
    const t = Date.now(), noHero = !!(ME && ME.user && !ME.hero);
    if ((!noHero && !pollOk()) || t < meAt) return;
    meAt = t + (noHero ? 5000 + Math.round(Math.random() * 2500) : meBack.peek());
    load().then((ok) => { if (ok) meBack.reset(); else { meBack.next(); meAt = Date.now() + Math.max(meBack.peek(), SU.hold.left()); } }).catch(() => meBack.next());
  }, 1000);

  setInterval(() => { if (document.hidden || DEMO) return; if ($('#tab-legion').classList.contains('on')) legOpen(); }, 60000);
})();
