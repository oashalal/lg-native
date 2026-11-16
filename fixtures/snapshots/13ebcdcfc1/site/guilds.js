






















(function () {
  'use strict';
  if (window.LGGuilds) return;
  const IDX_TTL = 5 * 60e3;
  const base = () => window.LG_BASE || '';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ROLE = { leader: 'глава', lead: 'руководство', trusted: 'доверенное лицо', novice: 'новичок', officer: 'руководство', member: 'новичок' };
  const ORD = { leader: 0, lead: 1, officer: 1, trusted: 2, novice: 3, member: 3 };
  const POW = { accept: 'принимать заявки', invite: 'приглашать по нику', kick: 'исключать участников', open: 'открывать и закрывать гильдию' };
  const KIND = { hunt: '🐺', caravan: '🐫', fort: '🏕', rival: '⚔' };
  const OUT = { win: 'Победа', lose: 'Поражение', draw: 'Ничья', failed: 'Сорвано' };
  const money = (n) => `${Math.round(+n || 0).toLocaleString('ru-RU')} бронзы`;
  const dt = (ms) => { try { return new Date(+ms).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
  const tm = (ms) => { try { return new Date(+ms).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };


  const style = () => { try { return (window.MDDoodle && window.MDDoodle.active) || (window.LG_STYLES && window.LG_STYLES[0]) || 'legion'; } catch (e) { return 'legion'; } };


  const GST = ['legion', 'cats', 'monkeys', 'veggies', '42brothers', 'cherts', 'ugabugi'];
  const gst = () => { const s = String(style()); return GST.includes(s) ? s : 'legion'; };
  const emb = (id, size) => { const E = window.LGEmblems; try { return E && E.svg ? E.svg(id || 'e1', size || 32, '', style()) : ''; } catch (e) { console.warn('[гильдии] герб', e); return ''; } };

  const ICO_FB = { main: '🏠', run: '🥾', gather: '📯', daily: '📜', gift: '🎁', hall: '🏰', members: '👥', requests: '📨', war: '⚔️', log: '📖', manage: '⚙️', crown: '👑', lead: '🛡', trusted: '🤝', novice: '🌱', create: '✚', search: '🔍', invite: '✉', leave: '🚪' };
  const ico = (name, size) => {
    const E = window.LGEmblems, n = size || 22;
    try { const v = E && E.icon ? E.icon(name, style(), n) : ''; if (v) return `<span class="gl-ico" aria-hidden="true">${v}</span>`; } catch (e) { console.warn('[гильдии] иконка', e); }
    return `<span class="gl-ico gl-ico-fb" aria-hidden="true" data-fb="${ICO_FB[name] || ''}" style="font-size:${Math.round(n * 0.8)}px"></span>`;
  };
  const ROLE_ICO = { leader: 'crown', lead: 'lead', trusted: 'trusted', novice: 'novice' };
  const left = (at) => { const m = Math.max(1, Math.ceil((+at - Date.now()) / 60e3)); return m < 60 ? `через ${m} мин` : m < 2880 ? `через ${Math.ceil(m / 60)} ч` : `через ${Math.ceil(m / 1440)} дн.`; };
  const silver = (n) => { const b = Math.round(+n || 0); return b % 100 === 0 ? `${(b / 100).toLocaleString('ru-RU')} серебра` : money(b); };
  const TIERS = [['leader', 'Глава'], ['lead', 'Руководство'], ['trusted', 'Доверенные лица'], ['novice', 'Новички']];
  const tierOf = (r) => ({ officer: 'lead', member: 'novice' }[r] || r);
  async function j(r) {
    try { const x = await r.json(); return x && typeof x === 'object' ? x : { ok: false, error: 'нет ответа' }; }
    catch { return { ok: false, error: r.status === 429 ? 'слишком часто - подожди немного' : 'нет ответа' }; }
  }
  const NET = { ok: false, error: 'нет связи' };



  const BACKOFF = [5e3, 10e3, 30e3, 60e3];
  function backoff(o) {
    const x = o || {}, steps = x.steps || BACKOFF, rnd = x.rnd || Math.random, now = x.now || Date.now;
    let n = 0, until = 0;
    return {
       
      fail() { const d = Math.round(steps[Math.min(n, steps.length - 1)] * (0.8 + 0.4 * rnd())); n++; until = now() + d; return d; },
      ok() { n = 0; until = 0; },
       
      wait() { return Math.max(0, until - now()); },
      fails: () => n,
    };
  }
  const BK = backoff();
  const bad = (st) => st === 429 || st === 502 || st === 503 || st === 504 || st >= 500;
  const waitRes = () => ({ ok: false, error: `канал сейчас не отвечает - попробую снова через ${Math.max(1, Math.ceil(BK.wait() / 1e3))} с`, wait: BK.wait() });
  const get = (p) => {
    if (BK.wait() > 0) return Promise.resolve(waitRes());
    return fetch(base() + '/api/guilds' + p, { credentials: 'same-origin' }).then((r) => { if (bad(r.status)) BK.fail(); else BK.ok(); return j(r); }, () => { BK.fail(); return NET; });
  };
  const post = (p, b) => fetch(base() + '/api/guilds' + p, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) })
    .then((r) => { if (bad(r.status)) BK.fail(); else BK.ok(); return j(r); }, () => { BK.fail(); return NET; });
  const api = {

    index: (lite) => get(lite ? '?lite=1' : ''),
    badge: () => get('/badge'),
    guild: (id) => get('/guild?id=' + encodeURIComponent(id)),
    act: (b) => post('/act', b),
    war: (name, q) => get('/war/' + name + (q ? '?' + new URLSearchParams(q).toString() : '')),
    warAct: (b) => post('/war/act', b),
    log: (before) => get('/log' + (before ? '?before=' + encodeURIComponent(before) : '')),

    mod: (b) => post('/mod', b),
    modinfo: (q) => get('/modinfo' + (q ? '?' + new URLSearchParams(q).toString() : '')),
    chatOf: (gid) => get('/chat?guild=' + encodeURIComponent(gid)),
  };
  const shut = (r) => !!(r && !r.ok && (r.closed || r.unavailable || r.error === 'войди через Twitch'));

   
  let IDX = null, idxAt = 0, idxP = null, idxPL = null;


  function index(force, lite) {


    if (IDX && !IDX.ok && !shut(IDX) && !force && BK.wait() > 0) return Promise.resolve(IDX);
    const ttl = IDX && !IDX.ok ? (shut(IDX) ? 2 * IDX_TTL : 0) : IDX_TTL;
    if (!force && IDX && Date.now() - idxAt < ttl) return Promise.resolve(IDX);
    if (idxP) return idxP;
    if (lite) {
      if (idxPL) return idxPL;
      idxPL = api.index(true).then((r) => {
        idxPL = null;
        if (r && r.ok && r.lite) { const was = IDX && IDX.ok ? IDX : null; IDX = { ...r, guilds: (was && was.guilds) || [], limit: was ? was.limit : r.limit }; idxAt = Date.now(); paintEntry(); return IDX; }
        if (!(r && r.wait && IDX && IDX.ok)) { IDX = r; idxAt = Date.now(); }
        paintEntry(); return r;
      });
      return idxPL;
    }
    idxP = api.index().then((r) => { if (!(r && r.wait && IDX && IDX.ok)) { IDX = r; idxAt = Date.now(); } idxP = null; paintEntry(); return r; });
    return idxP;
  }



  const inGuild = () => !!(IDX && IDX.ok && IDX.mine && IDX.mine.member);
  function paintEntry() {
    if (document.hidden || W) return;
    const hud = document.querySelector('.cy-hud'); if (!hud) return;
    const was = hud.querySelector('.gl-entry');
    if (!IDX || !IDX.ok) { if (was && shut(IDX)) was.remove(); return; }
    const label = inGuild() ? 'Гильдия' : 'Гильдии';
    if (was) { const b = was.querySelector('b'); if (b && b.textContent !== label) b.textContent = label; return; }
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'gl-entry'; b.title = 'Гильдии альянса: вступить, создать, своя гильдия, задания наёмников';
    b.innerHTML = `<span aria-hidden="true">🛡</span><b>${label}</b>`;
    b.onclick = (e) => { e.stopPropagation(); open(); };
    const gd = hud.querySelector('.gh-entry');
    hud.insertBefore(b, gd || null);
  }
  let entryT = 0;
  const entrySoon = () => { if (!entryT) entryT = setTimeout(() => { entryT = 0; paintEntry(); }, 400); };
  try { new MutationObserver(entrySoon).observe(document.body || document.documentElement, { childList: true, subtree: true }); } catch (e) { console.warn('[гильдии] наблюдатель шапки', e); }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) entrySoon(); });


  setTimeout(() => { if (!IDX && !idxP && !idxPL) index(false, true).catch(() => null); }, Math.round(Math.random() * 5e3));

  window.addEventListener('lg-gchat', (e) => {
    const d = e && e.detail; if (!d || (d.k !== 'in' && d.k !== 'out')) return;
    IDX = null; LAST = null; index(true, true).then(() => { paintEntry(); badgeSoon(); }).catch(() => null);
  });

   
  let W = null;
  function toast(t, bad) {
    const e = document.createElement('div');
    e.className = 'gl-toast' + (bad ? ' bad' : ''); e.setAttribute('role', 'status'); e.textContent = t; e.dataset.gst = gst();
    document.body.appendChild(e);
    setTimeout(() => e.classList.add('on'), 10); setTimeout(() => { e.classList.remove('on'); setTimeout(() => e.remove(), 300); }, 2800);
  }
  function frame() {
    if (W) return W;
    const el = document.createElement('div');
    el.className = 'gl-modal'; el.dataset.gst = gst();
    el.innerHTML = '<div class="gl-win" role="dialog" aria-modal="true" aria-labelledby="glTitle"><button type="button" class="gl-x" aria-label="Закрыть">×</button><div class="gl-body"></div></div>';
    (document.fullscreenElement || document.body).appendChild(el);
    document.documentElement.classList.add('gl-open');
    const close = () => { if (W && W.layer) W.layer(); el.remove(); document.removeEventListener('keydown', onKey, true); document.documentElement.classList.remove('gl-open'); W = null; };
    const onKey = (e) => { if (e.key !== 'Escape') return; e.stopPropagation(); if (W && W.layer) { e.preventDefault(); W.layer(); return; } close(); };
    document.addEventListener('keydown', onKey, true);
    el.querySelector('.gl-x').onclick = close;
    el.addEventListener('pointerdown', (e) => { if (e.target === el) close(); });
    W = { el, body: el.querySelector('.gl-body'), tab: 'main', data: null, guild: null, q: '', close };
    W.body.addEventListener('click', onClick);
    W.body.addEventListener('input', (e) => { if (e.target && e.target.id === 'glQ') { W.q = e.target.value; listOnly(); } else if (e.target && e.target.closest && e.target.closest('[data-form=ann]')) W.annDraft = e.target.value; });
    W.body.addEventListener('submit', onSubmit);

    W.body.addEventListener('contextmenu', (e) => { const li = e.target.closest && e.target.closest('.gl-mem li.gl-hasm'); if (!li) return; e.preventDefault(); memMenu(li.dataset.mtid, e.clientX, e.clientY, li); });
    let lp = 0, lpX = 0, lpY = 0;
    W.body.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return;
      const li = e.target.closest && e.target.closest('.gl-mem li.gl-hasm'); if (!li || e.target.closest('button')) return;
      lpX = e.clientX; lpY = e.clientY; clearTimeout(lp);
      lp = setTimeout(() => { lp = -1; const rr = li.getBoundingClientRect(); memMenu(li.dataset.mtid, lpX || rr.left, lpY || rr.bottom, li); }, 500);
    });
    const lpEnd = () => { if (lp > 0) clearTimeout(lp); };
    W.body.addEventListener('pointerup', lpEnd); W.body.addEventListener('pointercancel', lpEnd);
    W.body.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch' && lp > 0 && Math.abs(e.clientX - lpX) + Math.abs(e.clientY - lpY) > 10) lpEnd(); });
    W.body.addEventListener('keydown', (e) => {
      const li = e.target.closest && e.target.closest('.gl-mem li.gl-hasm'); if (!li || e.target !== li) return;
      if (e.key === 'Enter' || e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) { e.preventDefault(); const rr = li.getBoundingClientRect(); memMenu(li.dataset.mtid, rr.left + 16, rr.bottom, li); }
    });
    return W;
  }
  const busy = (t) => { if (W) W.body.innerHTML = `<h2 id="glTitle">Гильдии</h2><p class="gl-note">${esc(t)}</p>`; };

   



  const LAST_MS = 120e3;
  let LAST = null;
  const knownGid = () => (inGuild() ? String(IDX.mine.member.guild) : null);
  async function open(o) {
    const x = o || {};
    frame();

    W.el.classList.toggle('gl-big', !!x.big);
    W.el.dataset.gst = gst();
    const known = x.view === 'pick' || x.view === 'mod' ? null : knownGid();
    const pre = known ? api.guild(known) : null;
    const S = W;
    const swr = !!(known && LAST && LAST.gid === known && Date.now() - LAST.at < LAST_MS && LAST.r && LAST.r.me && LAST.data);
    if (swr) { W.data = LAST.data; W.guild = LAST.r; paintGuild(); } else busy('Смотрю гильдии альянса…');
    const r = await index(true, !!known);
    if (!W || W !== S) return;
    liveSoon();
    if (!r || !r.ok) { W.body.innerHTML = `<h2 id="glTitle">Гильдии</h2><p class="gl-note">${esc(closedText(r))}</p>`; return; }
    W.data = r;
    const m = r.mine && r.mine.member;
    if (x.view === 'mod' && r.mod) { await modPanel('new'); return; }
    if (m && x.view !== 'pick') {
      const fight = x.view === 'war' || x.view === 'run';
      if (fight) W.tab = 'main';
      await showGuild(m.guild, false, String(m.guild) === known ? pre : null, swr);
      if (fight && W && W.guild && W.guild.me) { if (W.sumP) await W.sumP; if (W) openWin('war', { seg: x.view }); }
      return;
    }
    if (r.lite) { await pickFull(); return; }
    showPick();
  }
   
  async function pickFull() {
    if (!W) return;
    if (W.data && W.data.lite) {
      busy('Смотрю гильдии альянса…');
      const r = await index(true);
      if (!W) return;
      if (!r || !r.ok) { W.body.innerHTML = `<h2 id="glTitle">Гильдии</h2><p class="gl-note">${esc(closedText(r))}</p>`; return; }
      W.data = r;
    }
    W.guild = null; showPick();
  }
  function closedText(r) {
    if (!r) return 'не вышло';
    if (r.closed) return 'Гильдии пока открыты только тестерам.';
    if (r.unavailable) return 'Гильдий нет в этом сезоне - они есть только в онлайн-сезоне, оффлайн-копии канала и пробной неделе.';
    return r.error || 'не вышло';
  }

   
  const BTN = { join: ['Вступить', 'join'], apply: ['Подать заявку', 'apply'], cancel: ['Отозвать заявку', 'cancel'] };
  function rowHtml(g, lim) {
    const b = BTN[g.action];
    const how = g.invited ? 'тебя пригласили' : g.open ? 'открыта - вступай сразу' : g.applied ? 'заявка подана' : 'по заявке';
    return `<li class="gl-g${g.free > 0 ? '' : ' full'}" data-gid="${esc(g.id)}">`
      + `<span class="gl-emb" aria-hidden="true">${emb(g.emblem, 40)}</span>`
      + `<button type="button" class="gl-gn" data-see="${esc(g.id)}"><b>${g.tag ? `<small class="gl-tg">[${esc(g.tag)}]</small> ` : ''}${esc(g.name)}</b>`
      + `<small>ур. ${g.level} · ${g.count} из ${lim} · ${how}</small></button>`
      + (b ? `<button type="button" class="gl-btn${g.action === 'cancel' ? ' ghost' : ''}" data-op="${b[1]}" data-g="${esc(g.id)}">${b[0]}</button>`
        : g.action === 'full' ? '<span class="gl-tagc">мест нет</span>' : '')
      + '</li>';
  }
  function listOnly() {
    const ul = W && W.body.querySelector('.gl-list'); if (!ul) return;
    const r = W.data, q = W.q.trim().toLowerCase();
    const list = (r.guilds || []).filter((g) => !q || g.name.toLowerCase().includes(q) || (g.tag || '').toLowerCase().includes(q));
    ul.innerHTML = list.length ? list.map((g) => rowHtml(g, r.limit)).join('') : `<li class="gl-note">${(r.guilds || []).length ? 'Ничего не нашлось.' : 'В альянсе пока нет гильдий - создай первую!'}</li>`;
  }
  function showPick() {
    const r = W.data, m = r.mine || {}, inG = m.member, cr = m.create || { cost: 1000, level: 2 };
    const inv = (m.invites || []).map((v) => `<li class="gl-inv"><span>Приглашение в <b>${v.tag ? `[${esc(v.tag)}] ` : ''}${esc(v.name)}</b></span><span class="gl-ma"><button type="button" class="gl-btn" data-op="join" data-g="${esc(v.guild)}">Принять</button><button type="button" class="gl-btn ghost" data-op="refuse" data-g="${esc(v.guild)}">Отклонить</button></span></li>`).join('');
    const wait = !inG && m.rejoinAt && +m.rejoinAt > Date.now() ? `<p class="gl-warn">Ты недавно вышел из гильдии - вступить в другую можно ${esc(left(m.rejoinAt))}.</p>` : '';
    const top = inG ? `<p class="gl-note">Ты в гильдии «${esc(inG.name)}». Чтобы вступить в другую, сначала выйди из своей.</p><button type="button" class="gl-btn" data-mine="1">Моя гильдия</button>`
      : m.banned ? '<p class="gl-warn">Стример этого альянса закрыл тебе вступление в гильдии.</p>'
        : '<p class="gl-note">Гильдия - твоё сообщество в альянсе канала: общие задания, сражения без эфира, свой район в городе и награды для всех.</p>';
    const createWait = m.createAt && +m.createAt > Date.now() ? `<p class="gl-warn">Ты распустил свою гильдию - новую можно создать ${esc(left(m.createAt))}.</p>` : '';
    const embs = (window.LGEmblems && window.LGEmblems.list) || [];
    W.el.classList.remove('gl-wide');
    W.body.innerHTML = `<h2 id="glTitle">Гильдии альянса</h2>${top}${wait}${modBtn()}`
      + (inv && !inG ? `<h3>Тебя приглашают</h3><ul class="gl-invs">${inv}</ul>` : '')
      + `<div class="gl-search"><input id="glQ" type="search" placeholder="Поиск по названию или тегу" aria-label="Поиск гильдии" value="${esc(W.q)}" autocomplete="off"></div>`
      + '<p class="gl-note gl-sm">Сначала - со свободными местами и самые активные.</p><ul class="gl-list"></ul>'
      + (!inG && !m.banned ? `<details class="gl-new"${W.newOpen ? ' open' : ''}><summary>Создать гильдию - ${esc(silver(cr.cost))}</summary>${createWait}<form data-form="create">
          <label>Название <input name="name" required minlength="3" maxlength="24" autocomplete="off" placeholder="3-24 знака"></label>
          <label>Тег <input name="tag" maxlength="3" minlength="3" pattern="[A-Za-z]{3}" required autocomplete="off" placeholder="3 латинские буквы, например SOF" class="gl-tagin"></label>
          <p class="gl-note gl-sm">Тег пишется перед ником: <b>[SOF] ник</b>. Название и тег уникальны во всей игре (с учётом больших и маленьких букв).</p>
          ${embs.length ? `<fieldset class="gl-embs"><legend>Герб</legend>${embs.map((e, i) => `<label class="gl-embp" title="${esc(e.name)}"><input type="radio" name="emblem" value="${esc(e.id)}"${i === 0 ? ' checked' : ''}><span>${emb(e.id, 44)}</span><small>${esc(e.name)}</small></label>`).join('')}</fieldset>` : ''}
          <label>Описание <textarea name="descr" maxlength="300" rows="3" placeholder="Кто вы, во что играете, кого ждёте (до 300 знаков)"></textarea></label>
          <label class="gl-chk"><input type="checkbox" name="open" checked> Открыта - вступают в один клик (иначе - по заявке)</label>
          <button type="submit" class="gl-btn">Создать за ${esc(silver(cr.cost))}</button>
          <p class="gl-note gl-sm">Нужен герой ${esc(cr.level)}+ уровня. До ${esc(r.limit || 90)} участников, ты станешь главой. Если распустить гильдию, деньги не вернутся.</p></form></details>` : '');
    listOnly();
  }

   

  async function showGuild(gid, quiet, pre, swr) {
    if (!quiet && !swr) busy('Открываю гильдию…');
    const r = await (pre || api.guild(gid));
    if (!W) return;
    if (r && r.ok && r.me) LAST = { gid: String(gid), r, data: W.data, at: Date.now() };

    const sumFresh = () => !!(swr && (W.sumP || (W.sumAt && Date.now() - W.sumAt < 5e3)));
    if (swr && r && r.ok && W.guild && JSON.stringify(r) === JSON.stringify(W.guild)) { if (!sumFresh()) void summary(true); return; }
    if (!r || !r.ok) { W.body.innerHTML = `<h2 id="glTitle">Гильдия</h2><p class="gl-note">${esc((r && r.error) || 'не вышло')}</p><button type="button" class="gl-btn ghost" data-back="1">← К списку гильдий</button>`; return; }
    W.guild = r;
    if (!r.me) W.tab = 'mem';
    paintGuild();
    if (!sumFresh()) void summary(true);
  }
  const roleOf = (r) => (r.me ? r.me.role : null);

  function can(r, p) {
    if (r.me && r.me.can) return !!r.me.can[p];
    return roleOf(r) === 'leader';
  }

  function lvlOf(r) {
    const g = r.guild, st = (r.levels && r.levels.steps) || [], max = (r.levels && r.levels.max) || st.length + 1;
    const lv = Math.max(1, +g.level || 1), xp = Math.max(0, +g.xp || 0), from = lv >= 2 ? st[lv - 2] || 0 : 0, to = lv - 1 < st.length ? st[lv - 1] : null;
    const pct = to == null ? 1 : Math.max(0, Math.min(1, (xp - from) / Math.max(1, to - from)));
    return { lv, xp, to, pct, top: to == null && lv >= max };
  }
  const num = (n) => Math.round(+n || 0).toLocaleString('ru-RU');
  const plural = (n, a, b, c) => { const m = n % 100, k = n % 10; return m > 10 && m < 20 ? c : k === 1 ? a : k > 1 && k < 5 ? b : c; };
  function lvlHtml(r) {
    const L = lvlOf(r), fill = Math.max(L.pct, 0.03);
    return `<div class="gl-lvl"><div class="gl-lvl-t"><b>Уровень ${L.lv}${L.top ? ' - наибольший' : ''}</b><span>${L.to == null ? num(L.xp) : `${num(L.xp)} / ${num(L.to)}`}</span></div>`
      + `<div class="gl-xp" role="progressbar" aria-label="Опыт гильдии" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(L.pct * 100)}"><i style="transform:scaleX(${fill.toFixed(3)})"></i></div></div>`;
  }


  const TICO = { main: 'main', mem: 'members', set: 'manage' };
  const hallOn = () => { try { const H = window.LGGuildHall; return !!(H && typeof H.open === 'function' && !(H.on && H.on() === false)); } catch (e) { return false; } };
  const reqN = (r) => (r.requests ? r.requests.filter((x) => x.kind === 'apply').length : 0);
  function guildTabs(r) {
    return [['main', 'Главная'], ['mem', 'Состав', reqN(r)], ['set', 'Управление']];
  }
  function paintGuild() {
    const r = W.guild, g = r.guild, me = r.me, role = roleOf(r), mine = !!me;
    W.el.classList.toggle('gl-wide', mine);
    const head = `<div class="gl-head"><span class="gl-emb big" aria-hidden="true">${emb(g.emblem, 64)}</span><div class="gl-hn"><h2 id="glTitle">${g.tag ? `<small class="gl-tg">[${esc(g.tag)}]</small> ` : ''}${esc(g.name)}</h2>`
      + (g.descr ? `<p class="gl-motto" title="${esc(g.descr)}">${esc(g.descr)}</p>` : '')
      + `<p class="gl-meta"><span>ур. ${g.level}</span><span>${g.count} из ${g.limit}</span><span>${g.open ? 'открыта' : 'по заявке'}</span>${mine ? `<span class="gl-role r-${esc(tierOf(role))}">роль: ${ROLE[role] || esc(role)}</span>` : ''}</p></div>`
      + (mine ? lvlHtml(r) : '') + '</div>';
    if (!mine) {
      const pk = ((W.data && W.data.guilds) || []).find((x) => String(x.id) === String(g.id));
      const b = pk && BTN[pk.action];
      W.body.innerHTML = head
        + `<div class="gl-btns">${b ? `<button type="button" class="gl-btn" data-op="${b[1]}" data-g="${esc(g.id)}">${b[0]}</button>` : ''}<button type="button" class="gl-btn ghost" data-back="1">← К списку гильдий</button></div>`
        + seeModHtml(g)
        + `<h3>Состав</h3>${memHtml(r, false)}`;
      return;
    }
    const pend = me.pending ? `<section class="gl-move"><h3>Гильдия сменила альянс</h3><p>Гильдия теперь в другом альянсе. Реши: переехать вместе с гильдией или выйти из неё. Город остаётся прежнему альянсу.</p>`
      + '<div class="gl-btns"><button type="button" class="gl-btn" data-op="moveStay">Переехать с гильдией</button><button type="button" class="gl-btn bad" data-op="moveLeave" data-confirm="Выйти из гильдии?">Выйти из гильдии</button></div></section>' : '';
    const tabs = guildTabs(r);
    W.tabKey = tabs.map((t) => t[0]).join(',');
    if (!tabs.some((t) => t[0] === W.tab)) W.tab = 'main';
    W.body.innerHTML = pend
      + `<div class="gl-tabs gl-tabs1" role="tablist">${tabs.map(([k, t, n]) => `<button type="button" role="tab" aria-selected="${W.tab === k}" data-tab="${k}">${ico(TICO[k], 18)}${t}${n ? ` <b class="gl-badge" aria-label="заявок: ${n}">${n}</b>` : ''}</button>`).join('')}</div><div class="gl-pane"></div>`;
    paintTab();
    void giLoad().then(giFill).catch((e) => console.warn('[гильдии] иконки кнопок', e));
  }
  function paintTab() {
    const pane = W && W.body.querySelector('.gl-pane'); if (!pane) return;
    const r = W.guild;
    pane.dataset.tab = W.tab;
    if (W.tab === 'main') { pane.innerHTML = mainHtml(); giFill(); if (Date.now() - (W.sumMainAt || 0) > SUM_GAP) void summary(); }
    else if (W.tab === 'set') pane.innerHTML = bannerHtml(true) + setHtml(r);
    else pane.innerHTML = bannerHtml(true) + memPane(r);
    reMark();
  }
   
  function memPane(r) {
    const n = reqN(r), sub = r.requests && W.memSub === 'req' ? 'req' : 'list';
    const seg = r.requests ? `<div class="gl-seg" role="tablist" aria-label="Состав"><button type="button" role="tab" data-memsub="list" aria-selected="${sub === 'list'}">Участники ${r.guild.count}</button>`
      + `<button type="button" role="tab" data-memsub="req" aria-selected="${sub === 'req'}">Заявки${n ? ` <b class="gl-badge">${n}</b>` : ''}</button></div>` : '';
    return seg + (sub === 'req' ? reqHtml(r) : (can(r, 'invite') ? inviteHtml() : '') + memHtml(r, true));
  }
   
  function bannerHtml(strip) {
    const r = W.guild, g = r.guild, role = roleOf(r), lead = (r.members || []).find((m) => tierOf(m.role) === 'leader');
    return `<aside class="gl-banner${strip ? ' gl-strip' : ''}" aria-label="Гильдия"><span class="gl-emb gl-emb-xl" aria-hidden="true">${emb(g.emblem, strip ? 44 : 112)}</span>`
      + `<div class="gl-bn"><h2 id="glTitle">${g.tag ? `<small class="gl-tg">[${esc(g.tag)}]</small> ` : ''}${esc(g.name)}</h2>${lvlHtml(r)}</div>`
      + `<ul class="gl-meta gl-bl">${lead ? `<li class="b-lead"><span>глава:</span> <b>${esc(lead.name || lead.login || 'игрок')}</b></li>` : ''}<li><span>участники:</span> <b data-cnt="count">${g.count} / ${g.limit}</b></li>`
      + `<li class="b-open"><span>набор:</span> <b>${g.open ? 'открыт' : 'по заявке'}</b></li><li class="gl-role r-${esc(tierOf(role))}"><span>роль:</span> <b>${ROLE[role] || esc(role)}</b></li></ul></aside>`;
  }
   
  const isMod = () => !!(W && W.data && W.data.mod);
  const modBtn = () => (isMod() ? '<div class="gl-btns"><button type="button" class="gl-btn ghost" data-gm="panel">🛡 Модерация гильдий</button></div>' : '');
   
  function seeModHtml(g) {
    const me = W.data && W.data.mine && W.data.mine.member, own = me && String(me.guild) === String(g.id);
    const out = [];
    if (!own) out.push(`<button type="button" class="gl-mini" data-gm="report" data-g="${esc(g.id)}" data-n="${esc(g.name)}">Пожаловаться на название</button>`);
    if (isMod()) out.push(`<button type="button" class="gl-mini" data-gm="chat" data-g="${esc(g.id)}">Чат гильдии</button>`,
      `<button type="button" class="gl-mini bad" data-gm="reset" data-g="${esc(g.id)}" data-n="${esc(g.name)}">Сбросить название</button>`,
      `<button type="button" class="gl-mini" data-gm="lock" data-g="${esc(g.id)}" data-n="${esc(g.name)}">Запретить переименование</button>`);
    return out.length ? `<div class="gl-modrow">${out.join('')}</div>` : '';
  }
   
  function askText(o) {
    return new Promise((done) => {
      if (!W) { done(null); return; }
      layerOff();
      const el = document.createElement('div'); el.className = 'gl-cf';
      el.innerHTML = `<div class="gl-cfw" role="alertdialog" aria-modal="true" aria-labelledby="glAskT"><h3 id="glAskT">${esc(o.title)}</h3>${o.text ? `<p>${esc(o.text)}</p>` : ''}`
        + `<label class="gl-cfn">${esc(o.label || 'Причина (можно пусто)')}<textarea rows="3" maxlength="300" aria-label="${esc(o.label || 'Причина')}"></textarea></label>`
        + (o.choices ? `<div class="gl-btns gl-mins">${o.choices.map(([v, t]) => `<button type="button" class="gl-btn${o.bad ? ' bad' : ''}" data-ok="${esc(v)}">${esc(t)}</button>`).join('')}</div>` : '')
        + `<div class="gl-btns">${o.choices ? '' : `<button type="button" class="gl-btn${o.bad ? ' bad' : ''}" data-ok="1">${esc(o.btn || 'Готово')}</button>`}<button type="button" class="gl-btn ghost" data-ok="">Отмена</button></div></div>`;
      W.el.appendChild(el);
      const ta = el.querySelector('textarea');
      const fin = (v) => { el.remove(); document.removeEventListener('keydown', k1, true); if (W && W.layer === off) W.layer = null; done(v); };
      const off = () => fin(null);
      const k1 = (e) => { if (e.key === 'Escape') { e.stopPropagation(); fin(null); } };
      W.layer = off;
      document.addEventListener('keydown', k1, true);
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-ok]'); if (b) fin(b.dataset.ok ? { v: b.dataset.ok, reason: String(ta.value || '').trim() } : null); else if (e.target === el) fin(null); });
      try { ta.focus({ preventScroll: true }); } catch (x) { console.warn('[гильдии] фокус окна', x); }
    });
  }
  const MOD_OK = { report: 'Жалоба отправлена - модераторы посмотрят', nameReset: 'Название сброшено', nameLock: 'Готово', nameUnlock: 'Запрет снят', nameNotice: 'Уведомление отправлено', chatDel: 'Сообщение удалено',
    chatMute: 'Игрок не пишет в чаты гильдий', chatBan: 'Игрок забанен в чатах гильдий', chatUnmute: 'Запрет снят', reportDone: 'Готово' };
  async function modAct(b, btn) {
    if (btn) btn.disabled = true;
    busyOn(true);
    try {
      const r = await api.mod(b);
      if (btn && btn.isConnected) btn.disabled = false;
      if (!r || !r.ok) { toast((r && r.error) || 'не вышло', true); return r; }
      toast(r.msg || MOD_OK[b.op] || 'Готово');
      return r;
    } finally { busyOn(false); }
  }
  async function gmClick(d, t) {
    if (W && W.busyN > 0) return;
    const g = d.g, n = d.n || '';
    if (d.gm === 'panel') { await modPanel(W.modF || 'new'); return; }
    if (d.gm === 'mtab') { await modPanel(d.f); return; }
    if (d.gm === 'more') { await modPanel(W.modF, true); return; }
    if (d.gm === 'chat') { await modChat(g); return; }
    if (d.gm === 'report') {
      const a = await askText({ title: `Пожаловаться на название «${n}»?`, text: 'Модераторы канала увидят название и тег гильдии на момент жалобы.', label: 'Что не так (можно пусто)', btn: 'Пожаловаться' });
      if (a) await modAct({ op: 'report', kind: 'name', guild: g, reason: a.reason }, t);
      return;
    }
    if (d.gm === 'reset') {
      const a = await askText({ title: `Сбросить название «${n}»?`, text: 'Гильдия станет «Гильдия #номер» без тега, глава получит запись в журнал. Открытые жалобы на название закроются.', bad: true,
        choices: [['0', 'Сбросить'], ['7', 'Сбросить и запретить на 7 дней'], ['30', 'Сбросить и запретить на 30 дней']] });
      if (a && (await modAct({ op: 'nameReset', guild: g, days: +a.v, reason: a.reason }, t)).ok) await modRefresh(g);
      return;
    }

    if (d.gm === 'notice') {
      const a = await askText({ title: `Отправить уведомление главе «${n}»?`, text: 'Глава получит уведомление: 24 часа на смену названия (бесплатно и без ожидания). Не сменит - название сбросится само, как кнопкой «Сбросить название».', btn: 'Отправить' });
      if (a && (await modAct({ op: 'nameNotice', guild: g, reason: a.reason }, t)).ok) await modRefresh(g);
      return;
    }
    if (d.gm === 'lock') {
      const a = await askText({ title: `Запретить переименовывать «${n}»?`, choices: [['1', '1 день'], ['7', '7 дней'], ['30', '30 дней'], ['0', 'Снять запрет']] });
      if (a && (await modAct({ op: 'nameLock', guild: g, days: +a.v, reason: a.reason }, t)).ok) await modRefresh(g);
      return;
    }
    if (d.gm === 'del') { if ((await modAct({ op: 'chatDel', msg: d.msg }, t)).ok) await modRefresh(); return; }
    if (d.gm === 'mute') {
      const a = await askText({ title: `Запретить ${n} писать во всех чатах гильдий альянса?`, choices: [['60', '1 час'], ['1440', '1 день'], ['10080', '7 дней']] });
      if (a && (await modAct({ op: 'chatMute', who: d.who, min: +a.v, reason: a.reason }, t)).ok) await modRefresh();
      return;
    }
    if (d.gm === 'ban') {
      const a = await askText({ title: `Забанить ${n} во всех чатах гильдий альянса?`, text: 'Бессрочно; его сообщения удалятся из чатов гильдий. Снять - во вкладке «Запреты».', bad: true, btn: 'Забанить' });
      if (a && (await modAct({ op: 'chatBan', who: d.who, reason: a.reason }, t)).ok) await modRefresh();
      return;
    }
    if (d.gm === 'unmute') { if ((await modAct({ op: 'chatUnmute', who: d.who }, t)).ok) await modRefresh(); return; }
    if (d.gm === 'done' || d.gm === 'reopen') { if ((await modAct({ op: 'reportDone', id: d.id, status: d.gm === 'done' ? 'done' : 'new' }, t)).ok) await modRefresh(); }
  }
   
  async function modRefresh(g) {
    if (!W) return;
    if (W.modF) await modPanel(W.modF);
    else if (W.modChat && W.body.querySelector('.gl-mchat, .gl-mchat-empty')) await modChat(W.modChat);
    else if (g && W.guild) await showGuild(g, true);
  }
  const MOD_TABS = [['new', 'Жалобы'], ['done', 'Рассмотренные'], ['bans', 'Запреты'], ['log', 'Журнал']];
  const LOG_RU = { gnamereset: 'сбросил название', gnamelock: 'запретил переименование', gnameopen: 'снял запрет переименования', gchatdel: 'удалил сообщение', gmute: 'мут в чатах гильдий',
    gnamenotice: 'отправил уведомление главе', gnameauto: 'автосброс названия (срок вышел)', gnamefixed: 'глава сменил название по уведомлению',
    gchatban: 'бан в чатах гильдий', gunmute: 'снял запрет чатов гильдий', greport: 'закрыл жалобу' };
   
  async function modPanel(f, more) {
    if (!W) return;
    W.modF = f || 'new'; W.guild = null; W.el.classList.remove('gl-wide');
    const head = `<h2 id="glTitle">Модерация гильдий</h2><div class="gl-tabs" role="tablist">${MOD_TABS.map(([k, t]) => `<button type="button" role="tab" aria-selected="${W.modF === k}" data-gm="mtab" data-f="${k}">${t}</button>`).join('')}</div>`
      + '<div class="gl-btns"><button type="button" class="gl-btn ghost" data-gmback="1">← К списку гильдий</button></div><div class="gl-pane gl-modp"><p class="gl-note">Загружаю…</p></div>';
    W.body.innerHTML = head;
    const q = { f: W.modF === 'done' ? 'done' : 'new' };
    if (more && W.modLast) q.before = W.modLast;
    const r = await api.modinfo(q);
    const pane = W && W.modF && W.body.querySelector('.gl-modp'); if (!pane) return;
    if (!r || !r.ok) { pane.innerHTML = `<p class="gl-note">${esc((r && r.error) || 'не вышло')}</p>`; return; }
    if (W.modF === 'bans') { pane.innerHTML = bansHtml(r.bans || []); return; }
    if (W.modF === 'log') { pane.innerHTML = modLogHtml(r.log || []); return; }
    const reps = r.reports || [];
    W.modLast = reps.length ? reps[reps.length - 1].id : null;
    pane.innerHTML = reps.length ? `<ul class="gl-reps">${reps.map(repHtml).join('')}</ul>` + (reps.length >= 100 ? '<button type="button" class="gl-btn ghost" data-gm="more">Показать ещё</button>' : '')
      : `<p class="gl-note">${W.modF === 'done' ? 'Рассмотренных жалоб нет.' : 'Новых жалоб нет.'}</p>`;
  }
  function repHtml(x) {
    const s = x.snap || {}, who = esc(x.bl || 'игрок'), when = esc(dt(x.at)), done = x.status === 'done';
    const foot = `<div class="gl-modrow">${done ? `<button type="button" class="gl-mini" data-gm="reopen" data-id="${esc(x.id)}">Вернуть в новые</button>` : `<button type="button" class="gl-mini" data-gm="done" data-id="${esc(x.id)}">Закрыть жалобу</button>`}</div>`;
    if (x.kind === 'name') {


      const now = Date.now(), pend = x.notice && +x.notice > now, locked = x.lock && +x.lock > now;
      const nb = locked ? `<button type="button" class="gl-mini" data-gm="notice" disabled aria-disabled="true" title="Переименование запрещено - сначала снимите запрет">Отправить уведомление лидеру</button>`
        : `<button type="button" class="gl-mini" data-gm="notice" data-g="${esc(x.guild)}" data-n="${esc(s.name || '')}">Отправить уведомление лидеру</button>`;
      return `<li class="gl-rep"><p><b>Название:</b> «${esc(s.name || '')}»${s.tag ? ` [${esc(s.tag)}]` : ''} <small>· жалоба от ${who} · ${when}</small></p>${x.reason ? `<p class="gl-why">${esc(x.reason)}</p>` : ''}`
        + (x.guild && !done && pend ? `<p class="gl-warn gl-sm gl-ntc">Уведомление отправлено, срок до ${esc(dt(x.notice))}</p>` : '')
        + (x.guild && !done && locked ? '<p class="gl-note gl-sm gl-ntc">Переименование запрещено - уведомление главе не отправить.</p>' : '')
        + (x.guild && !done ? `<div class="gl-modrow">${nb}<button type="button" class="gl-mini bad" data-gm="reset" data-g="${esc(x.guild)}" data-n="${esc(s.name || '')}">Сбросить название</button><button type="button" class="gl-mini" data-gm="lock" data-g="${esc(x.guild)}" data-n="${esc(s.name || '')}">Запретить переименование</button></div>` : '')
        + (done && x.note ? `<p class="gl-note gl-sm gl-ntc">${esc(x.note)}</p>` : '')
        + (x.guild ? '' : '<p class="gl-note gl-sm">Гильдии уже нет.</p>') + foot + '</li>';
    }
    const L = Array.isArray(s.list) ? s.list : [];
    const lines = L.map((m) => `<li class="${String(m.id) === String(s.msg) ? 'hit' : ''}">${String(m.tid) === '0' ? `<i>${esc(m.t)}</i>` : `<b>${esc(m.n || m.l)}</b> ${esc(m.t)}`}</li>`).join('');
    const tl = x.tl || '';
    return `<li class="gl-rep"><p><b>Чат гильдии «${esc(s.name || '')}»:</b> сообщение ${esc(tl)} <small>· жалоба от ${who} · ${when}</small></p>${x.reason ? `<p class="gl-why">${esc(x.reason)}</p>` : ''}`
      + `<ol class="gl-snap">${lines}</ol>`
      + (!done && x.tg ? `<div class="gl-modrow"><button type="button" class="gl-mini" data-gm="del" data-msg="${esc(s.msg)}">Удалить сообщение</button><button type="button" class="gl-mini" data-gm="mute" data-who="${esc(x.tg)}" data-n="${esc(tl)}">Мут…</button><button type="button" class="gl-mini bad" data-gm="ban" data-who="${esc(x.tg)}" data-n="${esc(tl)}">Бан в чатах гильдий</button></div>` : '')
      + foot + '</li>';
  }
  function bansHtml(L) {
    if (!L.length) return '<p class="gl-note">Запретов в чатах гильдий нет.</p>';
    return `<ul class="gl-mem">${L.map((b) => `<li><span class="gl-mn"><b>${esc(b.l || b.tid)}</b><small>${b.until ? `мут до ${esc(dt(b.until))}` : 'бан'}${b.by ? ` · ${esc(b.by)}` : ''}${b.reason ? ` · ${esc(b.reason)}` : ''}</small></span><span class="gl-ma"><button type="button" class="gl-mini" data-gm="unmute" data-who="${esc(b.tid)}">Снять</button></span></li>`).join('')}</ul>`;
  }
  function modLogHtml(L) {
    if (!L.length) return '<p class="gl-note">Действий модераторов пока нет.</p>';
    return `<ul class="gl-log">${L.map((e) => `<li class="gl-lg"><span class="gl-lgt"><b>${esc(e.by || '')}</b> ${esc(LOG_RU[e.kind] || e.kind || '')}${e.login ? `: <b>${esc(e.login)}</b>` : ''}${e.reason ? ` - ${esc(e.reason)}` : ''}</span><time>${esc(dt(e.at))}</time></li>`).join('')}</ul>`;
  }
   
  async function modChat(gid) {
    if (!W) return;
    const r = await api.chatOf(gid);
    if (!W) return;
    const name = (W.guild && W.guild.guild && W.guild.guild.name) || '';
    const L = r && r.ok ? r.msgs || [] : [];
    W.body.innerHTML = `<h2 id="glTitle">Чат гильдии${name ? ` «${esc(name)}»` : ''}</h2><div class="gl-btns"><button type="button" class="gl-btn ghost" data-see="${esc(gid)}">← К гильдии</button></div>`
      + (!r || !r.ok ? `<p class="gl-note">${esc((r && r.error) || 'не вышло')}</p>` : !L.length ? '<p class="gl-note gl-mchat-empty">Сообщений нет.</p>'
        : `<ul class="gl-mem gl-mchat">${L.map((m) => `<li><span class="gl-mn">${String(m.tid) === '0' ? `<small>${esc(m.t)}</small>` : `<b>${esc(m.n || m.l)}</b><span>${esc(m.t)}</span><small>${esc(dt(m.at))}</small>`}</span>`
          + (String(m.tid) === '0' ? '' : `<span class="gl-ma"><button type="button" class="gl-mini" data-gm="del" data-msg="${esc(m.id)}">Удалить</button><button type="button" class="gl-mini" data-gm="mute" data-who="${esc(m.tid)}" data-n="${esc(m.n || m.l)}">Мут…</button></span>`) + '</li>').join('')}</ul>`);
    W.modChat = gid;
  }

   
  const LOG_OUT = { win: 'победа', lose: 'поражение', draw: 'ничья', failed: 'сорвано' };
  const LOG_ICO = { gmute: '🔇', gunmute: '🔈', create: '✚', join: '➕', leave: '🚪', kick: '⛔', invite: '✉', refuse: '✖', role: '🛡', leader: '👑', open: '🔓', profile: '🖋', rename: '🏷',
    move: '🧭', level: '⭐', xp: '✨', war: '⚔️', run: '🥾', runplan: '🥾', raid: '🐉', namereset: '⚖' };
  const who = (e) => `<b>${esc(e.n || e.l || 'игрок')}</b>`;
  const byW = (e) => (e.by ? `<b>${esc(e.by)}</b>` : 'кто-то');
   
  function logText(e) {
    const d = e.d || {};
    switch (e.k) {
      case 'create': return `${byW(e)} создал гильдию «${esc(d.name || '')}»${d.tag ? ` [${esc(d.tag)}]` : ''}`;
      case 'join': return d.via === 'apply' ? `${byW(e)} принял заявку - ${who(e)} в гильдии` : d.via === 'invite' ? `${who(e)} вступил по приглашению` : `${who(e)} вступил в гильдию`;
      case 'leave': return d.why === 'ban' ? `${who(e)} покинул гильдию: стример закрыл ему вход в гильдии альянса` : d.why === 'hero' ? `${who(e)} покинул гильдию: герой переехал на другой канал`
        : d.why === 'move' ? `${who(e)} не стал переезжать с гильдией и вышел` : `${who(e)} вышел из гильдии`;
      case 'kick': return `${byW(e)} исключил ${who(e)}`;
      case 'invite': return `${byW(e)} пригласил ${who(e)}`;
      case 'refuse': return `${who(e)} отказался от приглашения`;
      case 'role': return `${byW(e)}: ${who(e)} - ${esc(ROLE[d.role] || d.role || '')}`;
      case 'leader': return d.auto ? `${who(e)} - новый глава (прежний глава покинул гильдию)` : `${byW(e)} передал главу - теперь глава ${who(e)}`;
      case 'open': return d.open ? `${byW(e)} открыл набор - вступают в один клик` : `${byW(e)} закрыл набор - только по заявке`;
      case 'profile': return `${byW(e)} обновил ${d.descr && d.emblem ? 'описание и герб' : d.emblem ? 'герб' : 'описание'}`;
      case 'rename': return `${byW(e)} переименовал гильдию: «${esc(d.was || '')}» → «${esc(d.name || '')}»${d.tag ? ` [${esc(d.tag)}]` : ''}`;
      case 'move': return `${byW(e)} перевёл гильдию в альянс <b>${esc(d.to || '')}</b>`;
      case 'level': return `<b>Гильдия получила ${Math.round(+d.level || 0)} уровень!</b>`;
      case 'xp': return `${who(e)} принёс гильдии <b>${Math.round(+e.xp || 0)}</b> опыта за день`;
      case 'war': return `Мини-сражение «${esc(d.title || '')}»${d.opp ? ` против: ${esc(d.opp)}` : ''} - <b>${esc(LOG_OUT[d.outcome] || d.outcome || '')}</b>`
        + (d.outcome === 'failed' ? (d.reason ? ` (${esc(d.reason)})` : '') : `${d.n ? `, бойцов ${Math.round(+d.n)}` : ''}${d.gxp ? `, +${Math.round(+d.gxp)} опыта гильдии` : ''}`);
      case 'run': return `Вылазка${d.place ? ` «${esc(d.place)}»` : ''} пройдена: ${(d.members || []).map((x) => `<b>${esc(x)}</b>`).join(', ')}${d.full ? ' - полным составом' : ''}${d.noDead ? ', без павших' : ''}`;
      case 'runplan': { const pl = d.place ? ` «${esc(d.place)}»` : '', t = esc(dt(d.at)); return d.op === 'plan' ? `${byW(e)} назначил вылазку${pl} на <b>${t}</b>` : d.op === 'move' ? `${byW(e)} перенёс вылазку${pl} на <b>${t}</b>`
        : d.op === 'cancel' ? `${byW(e)} отменил вылазку${pl} (${t})` : d.op === 'fail' ? `Вылазка${pl} не состоялась: собралось ${Math.round(+d.n || 0)} из ${Math.round(+d.min || 0)}` : ''; }
      case 'raid': return `<b>Рейд: босс повержен!</b>${d.n ? ` Участников - ${Math.round(+d.n)}` : ''}`;
      case 'cmlobby': return `${who(e)} собирает группу на элитного <b>«${esc(d.name || '')}»</b> у стен`;
      case 'gmute': return `${byW(e)} запретил ${who(e)} писать в чат гильдии на ${esc(minRu(d.min))}${d.reason ? `. Причина: ${esc(d.reason)}` : ''}`;
      case 'gunmute': return `${byW(e)} снова разрешил ${who(e)} писать в чат гильдии`;
      case 'namereset': return d.auto ? `Срок на смену названия «${esc(d.was || '')}» вышел - теперь «${esc(d.name || '')}»` : `Модератор сбросил название «${esc(d.was || '')}» - теперь «${esc(d.name || '')}»`;
      default: return '';
    }
  }
  const minRu = (m) => { m = Math.round(+m || 0); return m < 60 ? `${m} мин` : m < 1440 ? `${Math.round(m / 60)} ч` : `${Math.round(m / 1440)} дн.`; };
  const dayKey = (ms) => { const x = new Date(+ms); return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`; };
  function dayName(ms) {
    const k = dayKey(ms), now = Date.now();
    if (k === dayKey(now)) return 'Сегодня';
    if (k === dayKey(now - 864e5)) return 'Вчера';
    try { return new Date(+ms).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }); } catch { return ''; }
  }
  const hm = (ms) => { try { return new Date(+ms).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
  function logHtml(L) {
    let out = '', day = '';
    for (const e of L.rows) {
      const t = logText(e); if (!t) continue;
      const k = dayKey(e.at); if (k !== day) { if (day) out += '</ul>'; day = k; out += `<h3 class="gl-logd">${esc(dayName(e.at))}</h3><ul class="gl-log">`; }
      out += `<li class="gl-lg k-${esc(e.k)}"><span class="gl-lgi" aria-hidden="true">${LOG_ICO[e.k] || '•'}</span><span class="gl-lgt">${t}</span>${e.k === 'xp' ? '' : `<time>${esc(hm(e.at))}</time>`}</li>`;
    }
    if (day) out += '</ul>';
    if (!out) out = '<p class="gl-note">В журнале пока пусто: здесь появятся вступления и выходы, вклад опыта, итоги сражений и новые уровни.</p>';
    return out + (L.more ? `<button type="button" class="gl-btn ghost" data-logmore="1"${L.busy ? ' disabled' : ''}>Показать ещё</button>` : '');
  }
  async function logTab(pane, more) {
    const gid = W.guild && String(W.guild.guild.id);
    if (!more || !W.log || W.log.gid !== gid) { W.log = { gid, rows: [], more: false, busy: true }; pane.innerHTML = '<p class="gl-note">Открываю журнал…</p>'; }
    const L = W.log; L.busy = true;
    const r = await api.log(more && L.rows.length ? L.rows[L.rows.length - 1].id : '');
    if (!W || W.log !== L) return;
    L.busy = false;
    const p = subPane('log'); if (!p) return;
    if (!r || !r.ok) { p.innerHTML = `<p class="gl-note">${esc((r && r.error) || 'Журнал не открылся - попробуй ещё раз')}</p>`; return; }
    L.rows = more ? L.rows.concat(r.log || []) : (r.log || []); L.more = !!r.more;
    p.innerHTML = logHtml(L);
  }




  const runOn = () => !!(W && W.runOk);
  let runP = null;
  function runLoad() {
    if (window.LGGuildRun) return Promise.resolve();
    if (runP) return runP;
    const v = (n) => (window.LG_SITEF || {})[n] || '';
    runP = new Promise((ok, no) => {
      if (!document.querySelector('link[data-gr]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `/site/guildrun.css?v=${v('guildrun.css')}`; l.dataset.gr = '1'; document.head.appendChild(l); }
      const sc = document.createElement('script'); sc.src = `/site/guildrun.js?v=${v('guildrun.js')}`; sc.onload = () => ok(); sc.onerror = (e) => { runP = null; no(e); }; document.head.appendChild(sc);
    });
    return runP;
  }
  function runTab(pane) {
    pane.innerHTML = '<p class="gl-note">Смотрю вылазки…</p>';
    runLoad().then(() => { if (W && pane.isConnected) window.LGGuildRun.tab(pane); }).catch(() => { pane.innerHTML = '<p class="gl-note">Вылазки не загрузились - попробуй ещё раз.</p>'; });
  }


  let raidP = null;
  function raidLoad() {
    if (window.LGGuildRaid) return Promise.resolve();
    if (raidP) return raidP;
    const v = (n) => (window.LG_SITEF || {})[n] || '';
    raidP = new Promise((ok, no) => {
      if (!document.querySelector('link[data-grd]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `/site/guildraid.css?v=${v('guildraid.css')}`; l.dataset.grd = '1'; document.head.appendChild(l); }
      const sc = document.createElement('script'); sc.src = `/site/guildraid.js?v=${v('guildraid.js')}`; sc.onload = () => ok(); sc.onerror = (e) => { raidP = null; no(e); }; document.head.appendChild(sc);
    });
    return raidP;
  }

  



  const SUM_GAP = 90e3;
  const xget = (p) => fetch(base() + p, { credentials: 'same-origin' }).then((x) => x.json());
  const xpost = (p, b) => fetch(base() + p, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then((x) => x.json(), () => NET).catch(() => NET);
  async function runView() {
    try { const r = await xget('/api/guildrun'); if (!W) return; W.runOk = !!(r && r.ok); W.runView = W.runOk ? r : null; W.runN = W.runOk && r.plan ? 1 : 0; }
    catch (e) { if (W && W.runOk === undefined) W.runOk = false; }
  }
  async function raidView() {
    try { const r = await xget('/api/guildraid'); if (!W) return; W.raidOk = !!(r && r.ok && r.guild); W.raidView = W.raidOk ? r : null; }
    catch (e) {   }
  }


  async function cmView() {
    try {
      const r = await xpost('/api/citymon/act', { op: 'elist' }); if (!W) return;
      W.cmOk = !!(r && r.ok && r.guild);
      W.cmList = W.cmOk ? (r.list || []).filter((L) => L.st === 'open') : [];
      W.cmMine = W.cmOk ? r.mine || null : null;
    } catch (e) {   }
  }
  async function warView() { const r = await api.war('entry'); if (W) W.warE = r && r.ok ? r : null; }
  async function gqView() {
    if (!(window.LGDailies && window.LGDailies.open)) { W.gq = null; return; }
    try { const r = await xget('/api/dailies'); if (W) { W.dl = r && r.ok ? r : null; W.gq = r && r.ok && r.gq ? { guild: r.gq.guild || [], mine: r.gq.mine || [] } : null; } } catch (e) {   }
  }
  const runGather = () => { const P = W && W.runView && W.runView.plan; return P && P.st === 'gather' ? P : null; };
  const cmOn = () => !!(W && (W.cmOk || runGather()));
  const gatherN = () => (W ? (W.cmList || []).length + (runGather() ? 1 : 0) : 0);
  const sumKey = () => { const R = W.raidView, E = W.warE; return JSON.stringify([W.runOk, W.runView && W.runView.plan, W.raidOk, R && [R.st, R.plan && R.plan.at, R.joined, R.me], W.cmOk, W.cmList, W.cmMine, E && [E.entry, E.signed, E.count, E.canSign], W.gq, giftCnt()]); };
  const typing = () => !!(W && (W.layer || (document.activeElement && W.el.contains(document.activeElement) && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName))));
   
  function summary(force) {
    if (!W || !W.guild || !W.guild.me) return Promise.resolve();
    if (W.sumP) return W.sumP;
    const main = W.tab === 'main';
    if (!force && Date.now() - (main ? W.sumMainAt || 0 : W.sumAt || 0) < SUM_GAP) return Promise.resolve();
    const was = W.sumAt ? sumKey() : '';
    const jobs = [runView(), raidView(), cmView(), ...(main ? [warView(), gqView()] : [])];
    const S = W;
    S.sumP = Promise.all(jobs.map((p) => p.catch((e) => console.warn('[гильдии] сводка', e)))).then(() => {
      S.sumP = null; S.sumAt = Date.now(); if (main) S.sumMainAt = S.sumAt;
      if (W !== S || !W.guild) return;
      if (sumKey() !== was) repaintSum();
    });
    return S.sumP;
  }
  function repaintSum() {
    if (!W || !W.guild || !W.guild.me) return;
    if (W.tab === 'main' && !typing()) paintTab();
  }

  let sumT = 0;
  window.addEventListener('lg-gchat', (e) => {
    const d = e && e.detail;
    if (!W || !W.guild || !W.guild.me || !d || d.k !== 'msgs' || !(Array.isArray(d.msgs) && d.msgs.some((m) => m && String(m.tid) === '0'))) return;
    if (sumT) return;
    sumT = setTimeout(() => { sumT = 0; if (W && !document.hidden && W.tab === 'main' && Date.now() - (W.sumAt || 0) > 15e3) void summary(true); }, 2e3 + Math.round(Math.random() * 3e3));
  });

   



  let cmP = null;
  function cmLoad() {
    if (window.LGCityMon) return Promise.resolve();
    if (cmP) return cmP;
    const v = (n) => (window.LG_SITEF || {})[n] || '';
    cmP = new Promise((ok, no) => {
      if (!document.querySelector('link[data-cm]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `/site/citymon.css?v=${v('citymon.css')}`; l.dataset.cm = '1'; document.head.appendChild(l); }
      const sc = document.createElement('script'); sc.src = `/site/citymon.js?v=${v('citymon.js')}`; sc.onload = () => ok(); sc.onerror = (e) => { cmP = null; no(e); }; document.head.appendChild(sc);
    });
    return cmP;
  }
  function cmTab(pane, inWin) {
    const P = runGather();
    pane.innerHTML = (P ? '<div class="gl-cm-run"></div>' : '') + (W.cmOk ? '<div class="gl-cm-el"><p class="gl-note">Смотрю сборы…</p></div>' : '')
      + (!P && !W.cmOk ? '<p class="gl-note">Активных сборов нет.</p>' : '');
    const rs = pane.querySelector('.gl-cm-run');
    if (rs) runLoad().then(() => { if (rs.isConnected && window.LGGuildRun.banner) window.LGGuildRun.banner(rs, W.runView); }).catch(() => rs.remove());
    const el = pane.querySelector('.gl-cm-el'); if (!el) return;
    cmLoad().then(() => (W && (inWin || W.tab === 'cm') && el.isConnected ? window.LGCityMon.lobbies(el, { open: true }) : null)).then((n) => {
      if (!W || n == null) return;
      void cmView().then(() => repaintSum());
    }).catch(() => { el.innerHTML = '<p class="gl-note">Сборы не загрузились - попробуй ещё раз.</p>'; });
  }

   
  function hallTab(pane) {
    const H = window.LGGuildHall;
    const paint = (n) => { if (!W || !pane.isConnected) return; pane.innerHTML = `<div class="gl-card gl-hallc">${ico('hall', 40)}<div class="gl-hallt"><b>Зал гильдии</b><small>${n == null ? 'общий дом гильдии: казна, доска заданий, зал трофеев' : n ? `${n} в зале` : 'сейчас в зале никого'}</small></div><button type="button" class="gl-btn" data-hall="${esc(W.guild.guild.id)}">Войти</button></div>`; };
    paint(null);

    try { if (H && H.index) H.index().then((r) => paint(r && r.ok && Array.isArray(r.online) ? r.online.length : null)).catch(() => null); } catch (e) { console.warn('[гильдии] здание', e); }
  }

   
  const cdHtml = (at, pre) => `<time data-cd="${+at}" data-pre="${esc(pre || '')}">${esc((pre || '') + left(at))}</time>`;
   
  function clocks() { if (!W) return; W.body.querySelectorAll('time[data-cd]').forEach((t) => { const at = +t.dataset.cd; t.textContent = at > Date.now() ? t.dataset.pre + left(at) : 'сейчас'; }); }
   
  function cmPick() {
    const L = W.cmList || []; if (!L.length) return null;
    const mine = L.find((x) => x.mine); if (mine) return mine;
    const free = L.filter((x) => x.members.length < x.max); if (!free.length) return null;
    return free.slice().sort((a, b) => (b.min - b.members.length > 0) - (a.min - a.members.length > 0) || (a.max - a.members.length) - (b.max - b.members.length) || (a.until || 0) - (b.until || 0))[0];
  }
   
  function heroPick() {
    const t = Date.now(), R = W.raidOk ? W.raidView : null;
    if (R && R.plan && (R.st === 'open' || R.st === 'fight')) {
      const n = (R.joined || []).length, min = (R.rules && R.rules.min) || 0, j = !!(R.me && R.me.joined);
      return { k: 'raid', kick: R.st === 'fight' ? 'Сейчас · рейд идёт' : 'Скоро · вход в рейд открыт', title: `Рейд: ${R.plan.name || 'босс гильдии'}`,
        when: R.st === 'fight' ? '<time>идёт бой</time>' : cdHtml(R.plan.at, 'начало '), cnt: min ? `вошли ${n} из ${min}` : `вошли ${n}`, btn: j ? 'Вернуться' : 'Войти' };
    }
    const E = W.warE;
    if (E && E.entry && !E.signed && E.canSign && t < (+E.entry.closeAt || 0)) {
      const x = E.entry;
      return { k: 'war', kick: 'Скоро · мини-сражение', title: `${KIND[x.kind] || '⚔'} ${x.title}${x.name ? `: ${x.name}` : ''}`, when: `${cdHtml(x.battleAt, 'бой ')} · запись до ${esc(tm(x.closeAt))}`,
        cnt: `записались ${E.count || 0} из ${E.min || 0}`, btn: 'Записаться' };
    }
    const L = cmPick();
    if (L) {
      const n = L.members.length, need = Math.max(0, L.min - n);
      return { k: 'cm', id: L.id, mine: !!L.mine, kick: 'Сейчас · сбор у стен', title: `Элитный «${L.name}»${need ? ` - нужно ещё ${need}` : ''}`, when: cdHtml(L.until, 'распустится '),
        cnt: `в группе ${n} из ${L.max}, начать можно от ${L.min}`, btn: L.mine ? 'Открыть сбор' : 'Присоединиться' };
    }
    const P = runGather();
    if (P) return { k: 'run', joined: !!P.joined, kick: 'Сейчас · сбор на вылазку', title: `Вылазка «${P.place || ''}»`, when: cdHtml(P.until, 'выход '), cnt: `в отряде ${P.n || 0} из ${P.min || 0}`, btn: P.joined ? 'Вернуться в сбор' : 'Присоединиться' };
    return null;
  }
  const HICO = { raid: 'war', war: 'war', cm: 'gather', run: 'run' };
  function heroHtml() {
    const h = heroPick(); if (!h) return '';
    return `<div class="gl-hero k-${h.k}" role="region" aria-label="Главное сейчас">${ico(HICO[h.k], 36)}<div class="gl-hero-t"><small class="gl-hero-k">${esc(h.kick)}</small><b>${esc(h.title)}</b>`
      + `<span class="gl-hero-m">${h.when} · ${esc(h.cnt)}</span></div><button type="button" class="gl-btn gl-hero-b" data-hero="${h.k}"${h.id ? ` data-id="${esc(h.id)}"` : ''}${h.mine ? ' data-hmine="1"' : ''}${h.joined ? ' data-joined="1"' : ''}>${esc(h.btn)}</button></div>`;
  }
  


  const giftList = () => (W && W.dl && W.dl.gq && Array.isArray(W.dl.gq.gift) ? W.dl.gq.gift : null);
  const giftCnt = () => { const L = giftList(); return L ? L.length : giftN(); };
  


  const GB = [['war', 'Бой'], ['gather', 'Сбор'], ['gift', 'Подарок'], ['hall', 'Здание гильдии'], ['log', 'Журнал'], ['tasks', 'Задания']];
  let giP = null;
  function giLoad() {
    if (window.LGGuildIcons) return Promise.resolve();
    if (giP) return giP;
    const v = (window.LG_SITEF || {})['guildicons.js'] || '';
    giP = new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = `/site/guildicons.js?v=${v}`; sc.onload = () => ok(); sc.onerror = (e) => { giP = null; no(e); }; document.head.appendChild(sc); });
    return giP;
  }
   
  const gi = (name, size) => { let v = ''; try { const I = window.LGGuildIcons; v = I && I.svg ? I.svg(name, gst(), size) : ''; } catch (e) { console.warn('[гильдии] иконка кнопки', e); } return `<span class="gl-gi" data-gi="${name}" data-gs="${size}" aria-hidden="true">${v}</span>`; };
  function giFill() {
    const I = window.LGGuildIcons; if (!W || !I) return;
    W.el.querySelectorAll('.gl-gi[data-gi]').forEach((x) => { if (!x.firstChild) x.innerHTML = I.svg(x.dataset.gi, gst(), +x.dataset.gs || 96); });
  }
   
  function gbBadge(k) {
    if (k === 'war') { const h = heroPick(); if (h && (h.k === 'raid' || h.k === 'war')) return ['!', true]; return W.runN ? ['1', false] : null; }
    if (k === 'gather') { const n = gatherN(); return n ? [String(n), true] : null; }
    if (k === 'gift') { const n = giftCnt(); return n ? [String(n), true] : null; }
    if (k === 'tasks') { const Q = W.gq, mine = Q ? Q.mine : []; return Q && mine.length ? [`${mine.filter((x) => x.done).length}/${mine.length}`, false] : null; }
    return null;
  }
  const GB_SAY = { war: 'зовёт бой', gather: 'активных сборов', gift: 'сундуков ждут', tasks: 'выполнено' };
  function annHtml() {
    const r = W.guild, g = r.guild, ed = can(r, 'profile');
    if (ed && W.annEdit) return `<form class="gl-annb" data-form="ann"><div class="gl-annh"><b>Объявление гильдии</b></div><textarea name="descr" maxlength="300" rows="3" aria-label="Объявление гильдии" placeholder="Что важно знать участникам (до 300 знаков)">${esc(W.annDraft != null ? W.annDraft : g.descr || '')}</textarea>`
      + '<div class="gl-btns"><button type="submit" class="gl-btn">Сохранить</button><button type="button" class="gl-btn ghost" data-ann="cancel">Отмена</button></div></form>';
    return `<div class="gl-annb"><div class="gl-annh"><b>Объявление гильдии</b>${ed ? '<button type="button" class="gl-pen" data-ann="edit" aria-label="Изменить объявление" title="Изменить объявление">✎</button>' : ''}</div>`
      + `<p class="gl-annt${g.descr ? '' : ' none'}">${g.descr ? esc(g.descr) : ed ? 'Объявления пока нет - нажми карандаш и напиши участникам главное.' : 'Объявления пока нет.'}</p></div>`;
  }
  function mainHtml() {
    const btns = GB.map(([k, t]) => { const b = gbBadge(k);
      return `<button type="button" class="gl-gb${b && b[1] ? ' hot' : ''}" data-win="${k}"${b ? ` aria-label="${t}: ${b[0]}${GB_SAY[k] ? ' - ' + GB_SAY[k] : ''}"` : ''}>${gi(k, 112)}<span class="gl-gb-l">${t}</span>${b ? `<b class="gl-gb-n${b[1] ? ' hot' : ''}">${esc(b[0])}</b>` : ''}</button>`; }).join('');
    return `<div class="gl-gm">${bannerHtml(false)}<div class="gl-mr">${annHtml()}${heroHtml()}<div class="gl-grid">${btns}</div></div></div>`;
  }

   
  function subWin(k, title) {
    layerOff();
    const el = document.createElement('div'); el.className = 'gl-sub'; el.dataset.win = k;
    el.innerHTML = `<div class="gl-subw" role="dialog" aria-modal="true" aria-labelledby="glSubT"><div class="gl-subh"><h3 id="glSubT">${esc(title)}</h3><button type="button" class="gl-x gl-subx" aria-label="Закрыть">×</button></div><div class="gl-subb"></div></div>`;
    W.el.appendChild(el);
    const off = () => { el.remove(); if (W && W.layer === off) W.layer = null; if (W) { W.sub = null; if (W.tab === 'main' && !typing()) paintTab(); } };
    W.layer = off;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('.gl-subx')) off(); });
    try { el.querySelector('.gl-subx').focus({ preventScroll: true }); } catch (x) { console.warn('[гильдии] фокус окна', x); }
    const S = { k, el, body: el.querySelector('.gl-subb'), close: off };
    W.sub = S;
    return S;
  }
   
  function openWin(k, o) {
    if (!W || !W.guild) return;
    if (k === 'tasks') { const S = subWin('tasks', 'Задания гильдии'); tasksFill(S, true); return; }
    if (k === 'gift') { const S = subWin('gift', 'Подарок'); giftFill(S); return; }
    if (k === 'gather' || k === 'cm') {
      const S = subWin('gather', 'Сбор');
      S.body.innerHTML = '<div class="gl-pane gl-subpane" data-tab="cm"></div>';
      cmTab(S.body.firstChild, true);
      return;
    }
    if (k === 'hall') { const S = subWin('hall', 'Здание гильдии'); S.body.innerHTML = '<div class="gl-pane gl-subpane" data-tab="hall"></div>'; hallTab(S.body.firstChild); S.body.addEventListener('click', subClick); return; }
    if (k === 'log') { const S = subWin('log', 'Журнал гильдии'); S.body.innerHTML = '<div class="gl-pane gl-subpane" data-tab="log"></div>'; logTab(S.body.firstChild); S.body.addEventListener('click', subClick); return; }
    if (k === 'war') {
      const S = subWin('war', 'Бой'); S.body.addEventListener('click', subClick);
      S.seg = o && o.seg ? o.seg : 'war';
      warWin(S);
    }
  }
   
  function warWin(S) {
    const segs = [['war', 'Мини-сражения'], ...(runOn() ? [['run', 'Вылазка']] : []), ...(W.raidOk ? [['raid', 'Рейд']] : [])];
    if (!segs.some((x) => x[0] === S.seg)) S.seg = 'war';
    S.body.innerHTML = (segs.length > 1 ? `<div class="gl-seg" role="tablist" aria-label="Бой">${segs.map(([k, t]) => `<button type="button" role="tab" data-seg="${k}" aria-selected="${S.seg === k}">${ico(k === 'war' ? 'war' : k === 'run' ? 'run' : 'war', 16)}${t}</button>`).join('')}</div>` : '')
      + `<div class="gl-pane gl-subpane" data-tab="${S.seg}"></div>`;
    const pane = S.body.querySelector('.gl-pane');
    if (S.seg === 'run') runTab(pane);
    else if (S.seg === 'raid') pane.innerHTML = raidHtml();
    else { pane.innerHTML = '<p class="gl-note">Смотрю доску заданий…</p>'; void war(); }
  }
   
  function raidHtml() {
    const R = W.raidView; if (!R || !R.plan) return '<p class="gl-note">Рейд гильдии не назначен.</p>';
    const ST = { plan: 'назначен', open: 'вход открыт', fight: 'идёт бой', done: 'закончился' };
    return `<div class="gl-card${R.st === 'open' || R.st === 'fight' ? ' hot' : ''}"><p class="gl-lbl">${ico('war', 18)}Рейд: ${esc(R.plan.name || 'босс гильдии')}</p>`
      + `<p class="gl-cs">${esc(ST[R.st] || R.st || '')}${R.plan.at ? ` · начало ${esc(dt(R.plan.at))}` : ''} · вошли ${(R.joined || []).length}${R.rules && R.rules.min ? ` из ${R.rules.min}` : ''}</p>`
      + '<button type="button" class="gl-btn" data-raid="open">Открыть рейд</button></div>';
  }
   
  const subPane = (k, seg) => { const S = W && W.sub; if (!S || S.k !== k || (seg && S.seg !== seg) || !S.el.isConnected) return null; return S.body.querySelector('.gl-pane'); };
   
  function subClick(e) {
    const t = e.target && e.target.closest ? e.target.closest('button') : null; if (!t || !W || t.disabled) return;
    const d = t.dataset;
    if (d.confirm && !d.sure && window.LGSiteUi && window.LGSiteUi.ask) { window.LGSiteUi.ask({ title: d.confirm, yes: t.textContent.trim(), danger: t.classList.contains('bad') }).then((ok) => { if (ok && t.isConnected) { d.sure = '1'; t.click(); delete d.sure; } }); return; }
    if (d.seg && W.sub && W.sub.k === 'war') { W.sub.seg = d.seg; warWin(W.sub); return; }
    if (d.res) { void result(d.res); return; }
    if (d.raid) { raidLoad().then(() => { if (W) W.close(); window.LGGuildRaid.open(); }).catch(() => toast('Рейд не загрузился - попробуй ещё раз')); return; }
    if (d.hall) { const g = d.hall; W.close(); try { window.LGGuildHall.open(g); } catch (x) {   } return; }
    if (d.logmore) { t.disabled = true; const p = subPane('log'); if (p) void logTab(p, true); return; }
    if (d.war) warClick(t, d);
  }

  const nextDay = () => { const MSK = 3 * 3600e3, t = Date.now() + MSK, d = new Date(t); let at = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 5) - MSK; if (at <= Date.now()) at += 864e5; return at; };
   
  


  const seenKey = () => { let ch = ''; try { ch = (window.LG_CH && window.LG_CH.login) || ''; } catch (e) { ch = ''; } return `lg-gxp:${ch}:${W.guild.guild.id}`; };
  function seenGet() {
    try { const v = JSON.parse(localStorage.getItem(seenKey()) || 'null'); return v && Number.isFinite(+v.lv) && Number.isFinite(+v.xp) ? { lv: +v.lv, xp: +v.xp } : null; }
    catch (e) { return null; }
  }
  function seenSet(x) { try { localStorage.setItem(seenKey(), JSON.stringify({ lv: x.lv, xp: x.xp })); } catch (e) {   } }
   
  function lvlAt(lv, xp) {
    const r = W.guild, st = (r.levels && r.levels.steps) || [], from = lv >= 2 ? st[lv - 2] || 0 : 0, to = lv - 1 < st.length ? st[lv - 1] : null;
    return { lv, xp, to, pct: to == null ? 1 : Math.max(0, Math.min(1, (xp - from) / Math.max(1, to - from))) };
  }
  function tasksFill(S, opening) {
    const r = W.guild, g = r.guild, D = W.dl, q = D && D.gq;
    const bar = (n, of) => { const p = Math.max(0, Math.min(1, (+n || 0) / Math.max(1, +of || 1))); return `<span class="gl-bar"><i style="transform:scaleX(${Math.max(p, 0.03).toFixed(3)})"></i></span>`; };
    const gifts = (q && q.gift) || [];
    const row = (x, take) => { const c = take && x.done ? gifts.find((y) => y.why === x.t) : null;
      return `<li class="${x.done ? 'done' : ''}"><span class="gl-q-t"><span>${esc(x.t)}</span><span>${num(Math.min(x.n, x.of))} / ${num(x.of)}</span></span>${bar(x.n, x.of)}`
        + (c ? `<button type="button" class="gl-mini gl-take" data-take="${esc(c.i)}">Забрать</button>` : '') + '</li>'; };
    const list = (h, L, take) => (L && L.length ? `<h4 class="gl-qh">${h} <small>${L.filter((x) => x.done).length} / ${L.length}</small></h4><ul class="gl-q">${L.map((x) => row(x, take)).join('')}</ul>` : '');
    const right = !D ? `<p class="gl-cs">${window.LGDailies ? 'Загружаю задания…' : 'Задания пока недоступны.'}</p>`
      : `<p class="gl-cs">Обновятся ${esc(left(nextDay()))} (в 05:00 по Москве).</p>`
        + list('Вместе с гильдией', q && q.guild, true) + list('Мои задания гильдии', q && q.mine, false) + list('Мои на сегодня', (D.tasks || []).filter((t) => !t.air), false)
        + list('На эфире', (D.tasks || []).filter((t) => t.air), false)
        + (q ? '' : '<p class="gl-cs">Задания гильдии откроются позже.</p>');
    S.body.innerHTML = `<div class="gl-tw"><div class="gl-tl"><span class="gl-emb big" aria-hidden="true">${emb(g.emblem, 72)}</span><b class="gl-tn">${g.tag ? `<small class="gl-tg">[${esc(g.tag)}]</small> ` : ''}${esc(g.name)}</b>`
      + `${lvlHtml(r)}<p class="gl-cs">Опыт гильдии - за задания участников и мини-сражения.</p></div><div class="gl-tr">${right}</div></div>`;
    S.body.onclick = (e) => { const b = e.target.closest('[data-take]'); if (b && !b.disabled) void giftAct(b, +b.dataset.take, S); };
    if (opening) {
      const now = xpNow(), was = seenGet();
      if (was && (now.lv > was.lv || (now.lv === was.lv && now.xp > was.xp))) xpAnim(S.el, lvlAt(was.lv, was.xp), now);
      seenSet(now);
    }
  }
   
  function giftFill(S, got) {
    const L = giftList(), n = L ? L.length : giftN();
    const till = L && L.length ? Math.min(...L.map((c) => Date.now() + (+c.left || 0))) : 0;
    S.body.innerHTML = `<div class="gl-giftw">${ico('gift', 64)}<p class="gl-big-n"><b>${n}</b> <span>${n ? plural(n, 'сундук ждёт', 'сундука ждут', 'сундуков ждут') : 'сундуков нет'}</span></p>`
      + (till ? `<p class="gl-cs">Хранятся до ${esc(new Date(till).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }))} - потом пропадают.</p>` : `<p class="gl-cs">Сундуки - за общие задания гильдии, каждому участнику.</p>`)
      + (got ? `<p class="gl-got" role="status">${got}</p>` : '')
      + (n ? `<button type="button" class="gl-btn" data-take="all">Открыть</button>` : '') + '</div>';
    S.body.onclick = (e) => { const b = e.target.closest('[data-take]'); if (b && !b.disabled) void giftAct(b, 'all', S); };
  }
   
  async function giftAct(btn, i, S) {
    if (!W || W.busyN > 0) return;
    btn.disabled = true; busyOn(true);
    try {
      const was = xpNow();
      const r = await xpost('/api/dailies/act', { op: 'gift', i });
      if (!W) return;
      if (!r || !r.ok) { toast((r && r.error) || 'не вышло', true); if (btn.isConnected) btn.disabled = false; return; }
      W.dl = r; W.gq = r.gq ? { guild: r.gq.guild || [], mine: r.gq.mine || [] } : W.gq;
      const got = r.got || [], coins = got.reduce((s, x) => s + (+x.coins || 0), 0);
      const msg = `Из ${got.length > 1 ? got.length + ' сундуков' : 'сундука'}: ${money(coins)}`;
      toast(msg);

      const gv = r.guild;
      if (gv && W.guild && (+gv.xp !== +W.guild.guild.xp || +gv.level !== +W.guild.guild.level)) { W.guild.guild.xp = +gv.xp; W.guild.guild.level = +gv.level; }
      const now = xpNow();
      if (S.k === 'tasks') { tasksFill(S); if (now.xp > was.xp || now.lv > was.lv) xpAnim(S.el, was, now); seenSet(now); }
      else giftFill(S, msg);
      const head = W.body.querySelector('.gl-banner .gl-lvl'); if (head) head.outerHTML = lvlHtml(W.guild);
    } finally { busyOn(false); }
  }
  const xpNow = () => { const L = lvlOf(W.guild); return { lv: L.lv, xp: L.xp, to: L.to, pct: L.pct }; };
  

  function xpAnim(root, a, b) {
    const box = root.querySelector('.gl-tl .gl-lvl'); if (!box) return;
    const i = box.querySelector('.gl-xp i'), lab = box.querySelector('.gl-lvl-t span'), ttl = box.querySelector('.gl-lvl-t b');
    const sx = (p) => `scaleX(${Math.max(p, 0.03).toFixed(3)})`, fmt = (x, L) => (L.to == null ? num(x) : `${num(x)} / ${num(L.to)}`);
    let reduce = false; try { reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { reduce = false; }
    if (reduce) return;
    const MS = 750;
    box.dataset.anim = '1';
    const count = (from, to, L) => { const t0 = Date.now(); const step = () => { const k = Math.min(1, (Date.now() - t0) / MS), e = 1 - (1 - k) ** 3; lab.textContent = fmt(Math.round(from + (to - from) * e), L); if (k < 1) setTimeout(step, 40); }; step(); };
    const run = (p0, p1, done) => {
      i.style.transition = 'none'; i.style.transform = sx(p0); void i.getBoundingClientRect();
      i.style.transition = `transform ${MS}ms ease-out`; i.style.transform = sx(p1);
      setTimeout(done, MS + 30);
    };
    const fin = () => { delete box.dataset.anim; i.style.transition = ''; };
    if (b.lv > a.lv) {
      ttl.textContent = `Уровень ${a.lv}`; count(a.xp, a.to == null ? a.xp : a.to, a);
      run(a.pct, 1, () => {
        const f = document.createElement('span'); f.className = 'gl-lvup'; f.textContent = `Уровень ${b.lv}`; box.appendChild(f);
        setTimeout(() => f.classList.add('on'), 20); setTimeout(() => { f.classList.remove('on'); setTimeout(() => f.remove(), 400); }, 1100);
        ttl.textContent = `Уровень ${b.lv}`; count(a.to == null ? b.xp : a.to, b.xp, b);
        run(0, b.pct, fin);
      });
      return;
    }
    count(a.xp, b.xp, b);
    run(a.pct, b.pct, fin);
  }


  const rk = (x) => (ORD[x] == null ? 9 : ORD[x]);
   
  function memActs(r, m) {
    const me = r.me; if (!me || m.tid === me.tid) return [];
    const role = tierOf(roleOf(r)), lead = role === 'leader', mr = rk(m.role), out = [];
    if (lead && mr >= 2) out.push(['up-lead', 'Повысить: в руководство']);
    if (can(r, 'role') && mr === 3) out.push(['up-trusted', 'Повысить: доверенным']);
    if (lead && mr === 1) out.push(['down-trusted', 'Понизить: в доверенные']);
    if (can(r, 'role') && mr === 2 && (lead || rk(role) < 2)) out.push(['down-novice', 'Понизить: в новички']);
    if (lead && m.role !== 'leader') out.push(['transfer', 'Передать главу', 1]);
    if (can(r, 'kick') && rk(role) < mr) out.push(['kick', 'Исключить из гильдии', 1]);

    if (can(r, 'mute') && rk(role) < mr) out.push(m.mutedUntil && +m.mutedUntil > Date.now() ? ['gunmute', 'Разрешить писать в чат гильдии'] : ['gmute', 'Запретить писать в чат гильдии…']);
    return out;
  }
  function memHtml(r, acts) {
    const me = r.me;
    const row = (m) => {
      const self = me && m.tid === me.tid, nick = m.name || m.login || 'игрок', has = acts && memActs(r, m).length > 0;
      return `<li class="${self ? 'me' : ''}${has ? ' gl-hasm' : ''}" data-mtid="${esc(m.tid)}"${has ? ` tabindex="0" title="Правая кнопка мыши (на телефоне - подержать) - действия"` : ''}>`
        + `${ico(ROLE_ICO[tierOf(m.role)] || 'novice', 18)}<span class="gl-mn"><b>${esc(nick)}${self ? ' <small>(ты)</small>' : ''}</b><small>${m.joinedAt ? `в гильдии с ${esc(dt(m.joinedAt))}` : ''}${m.pending ? ' · ждёт решения о переезде' : ''}${m.mutedUntil && +m.mutedUntil > Date.now() ? ` · <span class="gl-muted"${m.mutedWhy ? ` title="Причина: ${esc(m.mutedWhy)}"` : ''}>не пишет в чат ${esc(left(m.mutedUntil).replace('через', 'ещё'))}${m.mutedWhy ? ` (${esc(m.mutedWhy)})` : ''}</span>` : ''}</small><small class="gl-st" aria-live="polite"></small></span>`
        + (has ? `<button type="button" class="gl-more" data-more="${esc(m.tid)}" aria-label="Действия: ${esc(nick)}">⋯</button>` : '')
        + '</li>';
    };
    return TIERS.map(([t, name]) => {
      const L = r.members.filter((m) => tierOf(m.role) === t).sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0));
      return L.length ? `<h3 class="gl-tier">${ico(ROLE_ICO[t], 18)}${name} <small>${L.length}</small></h3><ul class="gl-mem">${L.map(row).join('')}</ul>` : '';
    }).join('');
  }

  function memMenu(tid, cx, cy, from) {
    if (!W || !W.guild) return;
    layerOff();
    const r = W.guild, m = r.members.find((x) => String(x.tid) === String(tid)); if (!m) return;
    if (AQ.keys.has('mem:' + tid)) return;
    const items = memActs(r, m); if (!items.length) return;
    const nick = m.name || m.login || 'игрок';
    const el = document.createElement('div'); el.className = 'gl-menu'; el.setAttribute('role', 'menu'); el.setAttribute('aria-label', `Действия: ${nick}`);
    el.innerHTML = `<div class="gl-menu-h">${esc(nick)} <small>${esc(ROLE[m.role] || '')}</small></div>` + items.map(([k, t, bad]) => `<button type="button" role="menuitem" data-mk="${k}"${bad ? ' class="bad"' : ''}>${esc(t)}</button>`).join('');
    W.el.appendChild(el);

    const clamp = (x, y) => { const rr = el.getBoundingClientRect(), w = rr.width, h = rr.height; let yy = y; if (yy + h > innerHeight - 8) yy = Math.max(8, y - 8 - h); return [Math.max(8, Math.min(innerWidth - w - 8, x)), Math.max(8, Math.min(innerHeight - h - 8, yy))]; };
    const pos = window.LGSiteUi && window.LGSiteUi.clampXY ? window.LGSiteUi.clampXY(el, cx, cy + 4) : clamp(cx, cy + 4);
    el.style.left = Math.round(pos[0]) + 'px'; el.style.top = Math.round(pos[1]) + 'px';
    const out = (e) => { if (!el.contains(e.target)) layerOff(); };
    const key = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const bs = [...el.querySelectorAll('button')], i = bs.indexOf(document.activeElement); bs[(i + (e.key === 'ArrowDown' ? 1 : bs.length - 1)) % bs.length].focus(); }
      else if (e.key === 'Tab') layerOff();
    };
    const off = () => { el.remove(); document.removeEventListener('pointerdown', out, true); el.removeEventListener('keydown', key); if (W && W.layer === off) W.layer = null; if (from && from.isConnected) try { from.focus({ preventScroll: true }); } catch (x) {   } };
    W.layer = off;
    setTimeout(() => { if (W && W.layer === off) document.addEventListener('pointerdown', out, true); }, 0);
    el.addEventListener('keydown', key);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-mk]'); if (!b) return;
      const k = b.dataset.mk; layerOff();
      if (k.startsWith('up-') || k.startsWith('down-')) memJob({ op: 'role', who: String(m.tid), role: k.split('-')[1] });
      else if (k === 'kick') sure({ title: `Исключить ${nick} из гильдии?`, text: `${nick} сможет вступить в другую гильдию через 30 минут.`, btn: 'Исключить' }).then((ok) => { if (ok) memJob({ op: 'kick', who: String(m.tid) }); });

      else if (k === 'gmute') pickMin(nick).then(async (min) => {
        if (!min) return;
        const why = window.LGSiteUi && window.LGSiteUi.askReason ? await window.LGSiteUi.askReason({ who: nick, what: `чат гильдии: ${minRu(min)}` }) : '';
        if (why === null) return;
        memJob({ op: 'gmute', who: String(m.tid), min, ...(why ? { reason: why } : {}) });
      });
      else if (k === 'gunmute') memJob({ op: 'gunmute', who: String(m.tid) });
      else if (k === 'transfer') sure({ title: `Передать главу игроку ${nick}?`, text: 'Вы станете руководством. Вернуть главу может только новый глава.', btn: 'Передать главу', need: nick }).then((ok) => { if (ok) act({ op: 'transfer', who: String(m.tid) }); });
    });
    try { el.querySelector('button').focus({ preventScroll: true }); } catch (x) { console.warn('[гильдии] фокус меню', x); }
  }
   
  const MUTE_MINS = [[15, '15 мин'], [60, '1 час'], [360, '6 часов'], [1440, '1 день'], [10080, '7 дней']];
  function pickMin(nick) {
    return new Promise((done) => {
      if (!W) { done(null); return; }
      layerOff();
      const el = document.createElement('div'); el.className = 'gl-cf';
      el.innerHTML = `<div class="gl-cfw" role="alertdialog" aria-modal="true" aria-labelledby="glMuT"><h3 id="glMuT">Запретить ${esc(nick)} писать в чат гильдии</h3>`
        + '<p>Только в чат вашей гильдии: общий чат, торговля и личные сообщения - как раньше. Снять запрет можно в любой момент.</p>'
        + `<div class="gl-btns gl-mins">${MUTE_MINS.map(([v, t]) => `<button type="button" class="gl-btn" data-min="${v}">${t}</button>`).join('')}</div>`
        + '<div class="gl-btns"><button type="button" class="gl-btn ghost" data-min="0">Отмена</button></div></div>';
      W.el.appendChild(el);
      const fin = (v) => { el.remove(); document.removeEventListener('keydown', esc1, true); if (W && W.layer === off) W.layer = null; done(v); };
      const off = () => fin(null);
      const esc1 = (e) => { if (e.key === 'Escape') { e.stopPropagation(); fin(null); } };
      W.layer = off;
      document.addEventListener('keydown', esc1, true);
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-min]'); if (b) fin(+b.dataset.min || null); else if (e.target === el) fin(null); });
      try { el.querySelector('[data-min]').focus({ preventScroll: true }); } catch (x) { console.warn('[гильдии] фокус окна', x); }
    });
  }
  function layerOff() { if (W && W.layer) W.layer(); }
   
  function sure(o) {
    return new Promise((done) => {
      if (!W) { done(false); return; }
      layerOff();
      const el = document.createElement('div'); el.className = 'gl-cf';
      el.innerHTML = `<div class="gl-cfw" role="alertdialog" aria-modal="true" aria-labelledby="glCfT"><h3 id="glCfT">${esc(o.title)}</h3><p>${esc(o.text)}</p>`
        + (o.need ? `<label class="gl-cfn">Чтобы подтвердить, впишите ник: <b>${esc(o.need)}</b><input type="text" autocomplete="off" aria-label="Ник для подтверждения"></label>` : '')
        + `<div class="gl-btns"><button type="button" class="gl-btn${o.good ? '' : ' bad'}" data-cf="1" disabled>${esc(o.btn)}${o.wait === 0 ? '' : ' (2)'}</button><button type="button" class="gl-btn ghost" data-cf="0">Отмена</button></div></div>`;
      W.el.appendChild(el);
      const go = el.querySelector('[data-cf="1"]'), inp = el.querySelector('input');
      let left = o.wait == null ? 2 : o.wait, ready = false;
      const fit = () => { go.disabled = !ready || (!!o.need && String(inp.value).trim().toLowerCase() !== String(o.need).toLowerCase()); };
      let t = 0;
      const tick = () => { left--; if (left > 0) { go.textContent = `${o.btn} (${left})`; t = setTimeout(tick, 1000); return; } go.textContent = o.btn; ready = true; fit(); };
      if (left > 0) t = setTimeout(tick, 1000); else { left = 1; tick(); }
      const end = (v) => { clearTimeout(t); el.remove(); if (W && W.layer === off) W.layer = null; done(v); };
      const off = () => end(false);
      W.layer = off;
      if (inp) inp.addEventListener('input', fit);
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-cf]'); if (e.target === el) { end(false); return; } if (!b || b.disabled) return; end(b.dataset.cf === '1'); });
      try { (inp || el.querySelector('[data-cf="0"]')).focus({ preventScroll: true }); } catch (x) { console.warn('[гильдии] фокус подтверждения', x); }
    });
  }
  const inviteHtml = () => '<form class="gl-row" data-form="invite"><input name="login" placeholder="Ник игрока на Twitch" aria-label="Ник для приглашения" autocomplete="off" required maxlength="26"><button type="submit" class="gl-btn">Пригласить</button></form><p class="gl-note gl-sm">Приглашённый вступает и в гильдию «по заявке».</p>';




  const CLS_RU = { legionary: 'Легионер', paladin: 'Паладин', rogue: 'Разбойник', recruit: 'Новобранец', archer: 'Лучник', mage: 'Маг', necromancer: 'Некромант', priest: 'Жрец' };
  function reqHero(x) {
    if (x.hero === undefined) return '';
    if (!x.hero) return '<small class="gl-hc none">нет героя</small>';
    const role = /^[a-z]{1,20}$/.test(String(x.hero.role || '')) ? x.hero.role : 'recruit', nm = x.hero.roleName || CLS_RU[role] || role, lv = Math.max(1, Math.floor(+x.hero.level || 1));
    return `<small class="gl-hc" title="${esc(nm)}, ${lv} уровень"><i class="gl-cls r-${esc(role)}" aria-hidden="true"></i><span class="gl-hcn">${esc(nm)}</span> <span class="gl-hcl">· ${lv} ур.</span></small>`;
  }
  function reqHtml(r) {
    const ap = (r.requests || []).filter((x) => x.kind === 'apply'), iv = (r.requests || []).filter((x) => x.kind === 'invite');
    const ok = can(r, 'accept');
    const all = ok && ap.length > 1 ? '<span class="gl-ma"><button type="button" class="gl-mini" data-all="accept">Принять всех</button><button type="button" class="gl-mini bad" data-all="decline">Отклонить всех</button></span>' : '';
    return `<div class="gl-reqh"><h3>Заявки на вступление</h3>${all}</div>${ap.length ? `<ul class="gl-mem gl-reqs">${ap.map((x) => `<li data-req="${esc(x.tid)}"><span class="gl-mn"><b>${esc(x.name || x.login || 'игрок')}</b>${reqHero(x)}<small class="gl-rqat">${esc(dt(x.at))}</small><small class="gl-st" aria-live="polite"></small></span>${ok ? `<span class="gl-ma"><button type="button" class="gl-mini" data-op="accept" data-who="${esc(x.tid)}">Принять</button><button type="button" class="gl-mini bad" data-op="decline" data-who="${esc(x.tid)}">Отклонить</button></span>` : ''}</li>`).join('')}</ul>` : '<p class="gl-note">Заявок нет.</p>'}`
      + (iv.length ? `<h3>Отправленные приглашения</h3><ul class="gl-mem">${iv.map((x) => `<li><span class="gl-mn"><b>${esc(x.name || x.login || 'игрок')}</b><small>${esc(dt(x.at))}</small></span></li>`).join('')}</ul>` : '');
  }

  function setHtml(r) {
    const g = r.guild, lead = tierOf(roleOf(r)) === 'leader', out = [];
    if (can(r, 'open')) out.push(`<section><h3>Набор</h3><p>${g.open ? 'Гильдия открыта - вступают в один клик.' : 'По заявке - вступают после одобрения или по приглашению.'}</p><button type="button" class="gl-btn" data-op="setOpen" data-open="${g.open ? '0' : '1'}">${g.open ? 'Только по заявке' : 'Открыть для всех'}</button></section>`);
    if (can(r, 'profile')) {
      const embs = (window.LGEmblems && window.LGEmblems.list) || [];
      out.push(`<section><h3>Описание и герб</h3><form data-form="profile" class="gl-col">
        <label>Описание <textarea name="descr" maxlength="300" rows="3">${esc(g.descr || '')}</textarea></label>
        ${embs.length ? `<fieldset class="gl-embs"><legend>Герб</legend>${embs.map((e) => `<label class="gl-embp" title="${esc(e.name)}"><input type="radio" name="emblem" value="${esc(e.id)}"${(g.emblem || 'e1') === e.id ? ' checked' : ''}><span>${emb(e.id, 44)}</span><small>${esc(e.name)}</small></label>`).join('')}</fieldset>` : ''}
        <button type="submit" class="gl-btn">Сохранить</button><p class="gl-note gl-sm">Бесплатно, в любой момент.</p></form></section>`);
    }
    if (lead && can(r, 'rename')) {
      const wait = g.renameAt && +g.renameAt > Date.now();

      out.push(`<section><h3>Название и тег</h3>${g.notice ? `<p class="gl-warn gl-ntc">Модератор: название гильдии нарушает правила. Смени название до ${esc(dt(g.notice))} - бесплатно и без ожидания, иначе оно будет заменено случайным.</p>` : ''}${g.needTag ? '<p class="gl-warn">Нужен тег из 3 латинских букв - первый раз бесплатно.</p>' : ''}`
        + (wait ? `<p class="gl-note">Сменить можно ${esc(left(g.renameAt))} (раз в 7 дней).</p>` : '')
        + `<form data-form="rename" class="gl-col"><label>Название <input name="name" minlength="3" maxlength="24" value="${esc(g.name)}" autocomplete="off"></label>
        <label>Тег <input name="tag" minlength="3" maxlength="3" pattern="[A-Za-z]{3}" value="${esc(g.tag || '')}" autocomplete="off" class="gl-tagin"></label>
        <button type="submit" class="gl-btn"${wait ? ' disabled' : ''}>Сменить${g.renameCost ? ` за ${esc(silver(g.renameCost))}` : ' бесплатно'}</button>
        <p class="gl-note gl-sm">Раз в 7 дней. Деньги - с кошелька твоего героя на этом канале.</p></form></section>`);
    }
    if (lead && can(r, 'move')) {
      const mv = g.movedAt ? g.movedAt + 7 * 864e5 - Date.now() : 0;
      out.push(`<section><h3>Сменить альянс</h3><p class="gl-note">Гильдия переходит к другому стримеру этого сезона - раз в неделю и не во время боя. Каждый участник сам решит: переехать или выйти.</p>`
        + (mv > 0 ? `<p class="gl-warn">Следующая смена - не раньше ${esc(dt(g.movedAt + 7 * 864e5))}.</p>` : '')
        + '<form class="gl-row" data-form="move"><input name="to" placeholder="Ник канала нового альянса" aria-label="Канал нового альянса" autocomplete="off" required maxlength="26"><button type="submit" class="gl-btn">Сменить</button></form></section>');
    }
    const alone = g.count <= 1;
    if (lead && can(r, 'disband')) out.push(`<section><h3>Распустить гильдию</h3><p class="gl-note">Все участники выйдут, города альянса гильдия потеряет. Деньги за создание не вернутся; новую гильдию можно будет создать через 24 ч.</p>
      <form class="gl-row" data-form="disband"><input name="name" placeholder="Впиши название: ${esc(g.name)}" aria-label="Название гильдии для подтверждения" autocomplete="off" required><button type="submit" class="gl-btn bad">Распустить</button></form></section>`);
    if (!lead || alone) out.push(`<section><h3>Выйти из гильдии</h3><p class="gl-note">Вступить в другую гильдию этого канала можно будет через 30 минут.</p><button type="button" class="gl-btn bad" data-op="leave" data-confirm="${lead ? 'Ты последний в гильдии - она будет распущена. Выйти?' : 'Выйти из гильдии?'}">Выйти</button></section>`);
    else out.push('<section><h3>Выйти из гильдии</h3><p class="gl-note">Глава уходит последним: сначала передай главу во вкладке «Состав» или распусти гильдию.</p></section>');
    return out.join('');
  }

   
  async function war() {
    const [b, e, h] = await Promise.all([api.war('board'), api.war('entry'), api.war('results', { limit: 10 })]);
    const pane = subPane('war', 'war'); if (!pane) return;
    if (!b || !b.ok) { pane.innerHTML = `<p class="gl-note">${esc(b && b.closed ? 'Мини-сражения гильдий пока открыты только тестерам.' : b && b.unavailable ? 'Мини-сражений нет в этом сезоне.' : (b && b.error) || 'не вышло')}</p>`; return; }
    const out = [];
    const cl = b.closed;
    out.push(`<p class="gl-meta"><span>Сражение: ${esc(dt(b.battleAt))}</span><span>${cl ? 'запись закрыта - новая доска завтра' : `запись до ${esc(tm(b.closeAt))}`}</span></p>`);

    if (e && e.ok && e.entry) {
      const x = e.entry;
      out.push(`<section class="gl-task"><h3>${KIND[x.kind] || '📜'} Задание гильдии: ${esc(x.title)}${x.name ? `: ${esc(x.name)}` : ''}</h3><p>${x.place ? esc(x.place) + ' · ' : ''}бой ${esc(dt(x.battleAt))} · записалось ${e.count} из минимума ${e.min}${e.signed ? ' · <b>ты записан</b>' : ''}</p>`
        + (e.signups.length ? `<ul class="gl-sg">${e.signups.map((s) => `<li>${esc(s.name || s.login)}${s.level ? ` <small>ур. ${s.level}</small>` : ''}</li>`).join('')}</ul>` : '')
        + `<div class="gl-btns">${e.canSign ? '<button type="button" class="gl-btn" data-war="sign">Записаться</button>' : ''}${e.signed && Date.now() < (+x.closeAt || 0) ? '<button type="button" class="gl-btn ghost" data-war="unsign">Выписаться</button>' : ''}${e.canDrop ? '<button type="button" class="gl-btn bad" data-war="drop" data-confirm="Отказаться от задания? Записавшиеся будут сняты.">Отказаться от задания</button>' : ''}</div></section>`);
    }
    const lead = b.guild && b.guild.canTake;
    out.push(`<h3>Доска заданий наёмников</h3><p class="gl-note gl-sm">Задания обновляются раз в день; берёт глава или помощник. В гильдии нужно не меньше ${b.rules.min} участников, бойцы - от ${b.rules.minLevel} уровня и в гильдии не меньше ${b.rules.joinHours} ч. Опыта меньше, чем на эфире.</p>`);
    out.push(`<ul class="gl-board">${b.contracts.map((k) => `<li class="${k.mine ? 'mine' : ''}"><b>${KIND[k.kind] || '📜'} ${esc(k.title)}: ${esc(k.name)}</b><small>${esc(k.place || '')}</small>${k.desc ? `<p>${esc(k.desc)}</p>` : ''}`
      + `<p class="gl-sm">Соперник: ${k.enemy === 'guild' ? 'гильдия - кто возьмёт' : 'отряд НИП'} · победа: ${k.win.xp} опыта, ${esc(money(k.win.coins))}, +${k.win.gxp} гильдии · поражение: ${k.lose.xp} опыта, ${esc(money(k.lose.coins))}</p>`
      + `<p class="gl-sm">Взяли гильдий: ${k.taken}${k.mine ? ' · <b>задание гильдии</b>' : ''}</p>${lead && !cl ? `<button type="button" class="gl-btn" data-war="take" data-cid="${esc(k.cid)}">Взять задание</button>` : ''}</li>`).join('')}</ul>`);
    if (h && h.ok && h.results.length) {
      out.push(`<h3>Сражения гильдии</h3><ul class="gl-mem">${h.results.map((x) => `<li><span class="gl-mn"><b>${OUT[x.outcome] || esc(x.status)}</b><span>${esc(x.title)}${x.name ? `: ${esc(x.name)}` : ''}</span><small>${esc(dt(x.battleAt))}${x.opp ? ` · против: ${esc(x.opp.name)}` : ''}${x.reason ? ` · ${esc(x.reason)}` : ''}${x.gxp ? ` · опыт гильдии +${x.gxp}` : ''}${x.my ? ` · тебе: ${x.my.xp} опыта, ${esc(money(x.my.coins))}` : ''}</small></span>${x.outcome && x.outcome !== 'failed' ? `<span class="gl-ma"><button type="button" class="gl-mini" data-res="${esc(x.id)}">Итог</button></span>` : ''}</li>`).join('')}</ul>`);
    }
    pane.innerHTML = out.join('');
  }
  async function result(id) {
    const pane = subPane('war', 'war'); if (!pane) return;
    pane.innerHTML = '<p class="gl-note">Открываю итог…</p>';
    const r = await api.war('result', { id });
    if (!W || !pane.isConnected) return;
    if (!r || !r.ok) { pane.innerHTML = `<p class="gl-note">${esc((r && r.error) || 'не вышло')}</p><button type="button" class="gl-btn ghost" data-seg="war">← К заданиям</button>`; return; }
    const x = r.result, tr = x.track || [], frac = (v) => (Math.max(0, Math.min(100, +v || 0)) / 100).toFixed(3);

    const bars = tr.length ? `<div class="gl-track">${tr.map((t) => `<div class="gl-rd"><small>${t[0]}</small><i style="--w:${frac(t[1])}"></i><i class="foe" style="--w:${frac(t[2])}"></i></div>`).join('')}</div>` : '';
    pane.innerHTML = `<button type="button" class="gl-btn ghost gl-sm" data-seg="war">← К заданиям</button><h3>${OUT[x.outcome] || esc(x.status)}: ${esc(x.title)}${x.name ? `: ${esc(x.name)}` : ''}</h3>`
      + `<p class="gl-meta"><span>${esc(dt(x.battleAt))}</span><span>раундов: ${x.rounds}</span><span>гильдия: ${x.count} бойцов, сила ${x.hp ?? '-'}%</span><span>соперник${x.opp ? ` «${esc(x.opp.name)}»` : ''}: ${x.enemies ?? '-'}, сила ${x.enemyHp ?? '-'}%</span></p>`
      + (bars ? `<p class="gl-note gl-sm">Сила по раундам: гильдия - сверху, соперник - снизу.</p>${bars}` : '')
      + `<table class="gl-tbl"><thead><tr><th>Боец</th><th>Урон</th><th></th><th>Опыт</th><th>Бронза</th></tr></thead><tbody>${(x.heroes || []).map((h) => `<tr><td>${esc(h.name || h.login)}</td><td>${h.dealt}</td><td>${h.fell ? 'пал' : 'устоял'}</td><td>${h.xp}</td><td>${h.coins}</td></tr>`).join('')}</tbody></table>`;
  }

   
  const OK = { create: 'Гильдия создана - ты её глава', join: 'Ты вступил в гильдию', apply: 'Заявка подана', cancel: 'Заявка отозвана', accept: 'Игрок принят', decline: 'Заявка отклонена', refuse: 'Приглашение отклонено', gmute: 'Участник не сможет писать в чат гильдии', gunmute: 'Участник снова может писать в чат гильдии',
    invite: 'Приглашение отправлено', leave: 'Ты вышел из гильдии', kick: 'Игрок исключён', role: 'Роль изменена', powers: 'Полномочия сохранены', transfer: 'Глава передана',
    setOpen: 'Готово', rename: 'Название и тег изменены', profile: 'Сохранено', disband: 'Гильдия распущена', move: 'Гильдия сменила альянс - участники решат, переехать ли с ней', moveStay: 'Ты переезжаешь вместе с гильдией', moveLeave: 'Ты вышел из гильдии' };
  const WOK = { take: 'Задание взято', drop: 'Задание снято', sign: 'Ты записан на бой', unsign: 'Ты выписан' };
  







  const SETTLE_MS = 1000;
  const AQ = { jobs: [], keys: new Set(), on: false, cur: null, t: 0, settling: false, dirty: false, last: 0, n: 0 };
  const qBusy = () => !!(AQ.on || AQ.jobs.length || AQ.t || AQ.settling);
  function busyMark() { if (!W) return; if (qBusy() || W.busyN > 0) W.el.dataset.busy = '1'; else delete W.el.dataset.busy; }

  const busyOn = (on) => { if (W) { W.busyN = Math.max(0, (W.busyN || 0) + (on ? 1 : -1)); busyMark(); } };
  

  function enqueue(job) {
    const keys = job.keys || [];
    if (keys.some((k) => AQ.keys.has(k))) return Promise.resolve(null);
    for (const k of keys) AQ.keys.add(k);
    clearTimeout(AQ.t); AQ.t = 0;
    return new Promise((done) => {
      job.done = done; AQ.jobs.push(job);
      try { if (job.mark) job.mark(); } catch (e) { console.warn('[гильдии] очередь: строка', e); }
      busyMark(); void pump();
    });
  }
  async function pump() {
    if (AQ.on) return;
    AQ.on = true;
    try {
      while (AQ.jobs.length) {
        const j = AQ.jobs.shift(); AQ.cur = j;
        try { if (j.start) j.start(); } catch (e) { console.warn('[гильдии] очередь: строка', e); }
        const t0 = Date.now();
        let r;
        try { r = await (j.send ? j.send() : api.act(j.b)); } catch (e) { r = NET; }
        AQ.last = Date.now() - t0; AQ.n++;
        try { if (r && r.ok) { if (j.ok) await j.ok(r); } else if (j.bad) await j.bad(r); else toast(errText(r), true); } catch (e) { console.warn('[гильдии] очередь: ответ', e); }
        for (const k of j.keys || []) AQ.keys.delete(k);
        AQ.cur = null;
        j.done(r);
      }
    } finally { AQ.on = false; AQ.cur = null; }
    if (AQ.dirty && W) AQ.t = setTimeout(settle, SETTLE_MS);
    busyMark();
  }
   
  async function settle() {
    AQ.t = 0;
    if (!W || !W.guild || AQ.on || AQ.jobs.length) { busyMark(); return; }
    if (typing()) { AQ.t = setTimeout(settle, SETTLE_MS); return; }
    AQ.dirty = false; AQ.settling = true;
    const gid = String(W.guild.guild.id);
    try {
      const g = await api.guild(gid);
      if (W && W.guild && String(W.guild.guild.id) === gid && g && g.ok) {
        if (AQ.on || AQ.jobs.length || typing()) { W.guild = g; AQ.dirty = true; }
        else { W.guild = g; paintGuild(); }
        badgeFrom(g);
      }
    } catch (e) { console.warn('[гильдии] окно: перечитать', e); }
    finally { AQ.settling = false; if (AQ.dirty && !AQ.on && !AQ.jobs.length && W) AQ.t = setTimeout(settle, SETTLE_MS); busyMark(); }
  }
   
  function reMark() {
    for (const j of AQ.jobs) { try { if (j.mark) j.mark(); } catch (e) { console.warn('[гильдии] очередь: строка', e); } }
    if (AQ.cur) { try { if (AQ.cur.mark) AQ.cur.mark(); if (AQ.cur.start) AQ.cur.start(); } catch (e) { console.warn('[гильдии] очередь: строка', e); } }
  }
   
  function errText(r) {
    const e = (r && r.error) || 'не вышло';
    if (/нет мест/.test(e) && W && W.guild) return `гильдия полна ${W.guild.guild.count}/${W.guild.guild.limit || 90}`;
    return e + (r && r.rejoinAt ? ` - можно ${left(r.rejoinAt)}` : r && r.renameAt ? ` - можно ${left(r.renameAt)}` : r && r.createAt ? ` - можно ${left(r.createAt)}` : '');
  }
  const sameG = (gid) => !!(W && W.guild && String(W.guild.guild.id) === String(gid));
  const reqRow = (tid) => (W ? W.body.querySelector(`li[data-req="${esc(tid)}"]`) : null);
  const memRow = (tid) => (W ? W.body.querySelector(`li[data-mtid="${esc(tid)}"]`) : null);
   
  function rowSt(li, st, text) {
    if (!li) return;
    li.classList.toggle('gl-pend', st === 'wait');
    li.classList.toggle('gl-done', st === 'done');
    li.classList.toggle('gl-rerr', st === 'err');
    if (st) li.dataset.st = st; else delete li.dataset.st;
    li.setAttribute('aria-busy', String(st === 'wait'));
    li.querySelectorAll('button').forEach((b) => { b.disabled = st === 'wait' || st === 'done'; });
    const s0 = li.querySelector('.gl-st'); if (s0) s0.textContent = text || '';
  }
   
  function paintCounts() {
    if (!W || !W.guild) return;
    const r = W.guild, n = reqN(r), g = r.guild;
    const badge = (el) => { if (!el) return; let b = el.querySelector('.gl-badge'); if (!n) { if (b) b.remove(); return; } if (!b) { b = document.createElement('b'); b.className = 'gl-badge'; el.appendChild(document.createTextNode(' ')); el.appendChild(b); } b.textContent = String(n); b.setAttribute('aria-label', `заявок: ${n}`); };
    badge(W.body.querySelector('.gl-tabs [data-tab=mem]'));
    badge(W.body.querySelector('[data-memsub=req]'));
    const ls = W.body.querySelector('[data-memsub=list]'); if (ls) ls.textContent = `Участники ${g.count}`;
    W.body.querySelectorAll('[data-cnt=count]').forEach((b) => { b.textContent = `${g.count} / ${g.limit}`; });
    badgeFrom(r);
  }
   
  function badgeFrom(g) {
    if (!g || !g.me || !g.me.can || !g.me.can.accept || !g.requests) return;
    const n = g.requests.filter((x) => x.kind === 'apply').length + giftN();
    if (n !== BADGE) { BADGE = n; try { window.dispatchEvent(new CustomEvent('lgguilds', { detail: { n } })); } catch (e) { console.warn('[гильдии] счётчик', e); } }
  }
   
  function patchReq(tid, op) {
    const r = W.guild, list = r.requests || [];
    const i = list.findIndex((x) => x.kind === 'apply' && String(x.tid) === String(tid)), x = i >= 0 ? list.splice(i, 1)[0] : null;
    if (op === 'accept' && !r.members.some((m) => String(m.tid) === String(tid))) {
      r.members.push({ guild: r.guild.id, tid: String(tid), role: 'novice', joinedAt: Date.now(), login: x ? x.login : null, name: x ? x.name || x.login : null });
      r.guild.count = (+r.guild.count || 0) + 1;
    }
  }
   
  function reqJob(op, tid) {
    if (!W || !W.guild) return Promise.resolve(null);
    const gid = String(W.guild.guild.id), acc = op === 'accept';
    return enqueue({ keys: ['req:' + tid], b: { op, guild: gid, who: String(tid) },
      mark: () => rowSt(reqRow(tid), 'wait', 'в очереди…'),
      start: () => rowSt(reqRow(tid), 'wait', acc ? 'принимаю…' : 'отклоняю…'),
      ok: (r) => { AQ.dirty = true; if (!sameG(gid)) return; patchReq(tid, op); rowSt(reqRow(tid), 'done', acc ? (r.already ? 'уже принят' : 'принят') : 'заявка отклонена'); paintCounts(); },
      bad: (r) => { AQ.dirty = true; if (sameG(gid)) rowSt(reqRow(tid), 'err', errText(r)); },
    });
  }
   
  async function allJob(kind) {
    if (!W || !W.guild) return;
    const r = W.guild, gid = String(r.guild.id), acc = kind === 'accept';
    const tids = (r.requests || []).filter((x) => x.kind === 'apply' && !AQ.keys.has('req:' + x.tid)).map((x) => String(x.tid)).filter((t) => { const li = reqRow(t); return !li || li.dataset.st !== 'done'; });
    if (!tids.length || AQ.keys.has('all')) return;
    const free = Math.max(0, (+r.guild.limit || 90) - (+r.guild.count || 0)), n = tids.length;
    const ok = await sure(acc ? { title: 'Точно принять всех?', text: `Заявок: ${n}. Свободных мест: ${free}${n > free ? ` - примем первых ${free}, остальные останутся в заявках` : ''}.`, btn: 'Принять всех', wait: 0, good: true }
      : { title: 'Точно отклонить все заявки?', text: `Заявок: ${n}. Все будут отклонены.`, btn: 'Отклонить всех', wait: 0 });
    if (!ok || !sameG(gid)) return;
    const allBtns = (on) => W && W.body.querySelectorAll('[data-all]').forEach((b) => { b.disabled = on; });
    return enqueue({ keys: ['all', ...tids.map((t) => 'req:' + t)], b: { op: acc ? 'acceptAll' : 'declineAll', guild: gid, whos: tids },
      mark: () => { allBtns(true); for (const t of tids) rowSt(reqRow(t), 'wait', 'в очереди…'); },
      start: () => { for (const t of tids) rowSt(reqRow(t), 'wait', acc ? 'принимаю…' : 'отклоняю…'); },
      ok: (x) => {
        AQ.dirty = true; allBtns(false); if (!sameG(gid)) return;
        const done = acc ? x.accepted || [] : x.declined || [], sk = acc ? x.skipped || [] : [];
        for (const t of done) { patchReq(t, kind); rowSt(reqRow(t), 'done', acc ? 'принят' : 'заявка отклонена'); }
        if (acc && x.count != null) W.guild.guild.count = +x.count;
        for (const s0 of sk) rowSt(reqRow(s0.who), 'err', /нет мест/.test(s0.error || '') ? `нет мест: ${W.guild.guild.count}/${W.guild.guild.limit || 90}` : s0.error);
        for (const t of tids) if (!done.includes(t) && !sk.some((s0) => String(s0.who) === t)) rowSt(reqRow(t), '', '');
        paintCounts();
        toast(acc ? `Принято: ${done.length}${sk.length ? ` - осталось ${sk.length}${x.full ? ', мест нет' : ''}` : ''}` : `Отклонено: ${done.length}`, acc && sk.length > 0);
      },
      bad: (x) => { AQ.dirty = true; allBtns(false); if (!sameG(gid)) return; for (const t of tids) rowSt(reqRow(t), 'err', errText(x)); toast(errText(x), true); },
    });
  }
  const MEM_DO = { role: 'меняю роль…', kick: 'исключаю…', gmute: 'запрещаю чат…', gunmute: 'разрешаю чат…' };
   
  function memJob(b) {
    if (!W || !W.guild) return Promise.resolve(null);
    const gid = String(W.guild.guild.id), tid = String(b.who);
    return enqueue({ keys: ['mem:' + tid], b,
      mark: () => rowSt(memRow(tid), 'wait', 'в очереди…'),
      start: () => rowSt(memRow(tid), 'wait', MEM_DO[b.op] || '…'),
      ok: (r) => {
        AQ.dirty = true; if (!sameG(gid)) return;
        const G0 = W.guild, m = G0.members.find((x) => String(x.tid) === tid);
        let t = OK[b.op] || 'готово';
        if (b.op === 'role' && m) { m.role = b.role; t = `теперь: ${ROLE[b.role] || b.role}`; }
        else if (b.op === 'kick') { G0.members = G0.members.filter((x) => String(x.tid) !== tid); G0.guild.count = Math.max(0, (+G0.guild.count || 1) - 1); t = 'исключён'; }
        else if (b.op === 'gmute' && m) { m.mutedUntil = r.until || Date.now() + (b.min || 0) * 60e3; if (b.reason) m.mutedWhy = b.reason; t = 'не пишет в чат гильдии'; }
        else if (b.op === 'gunmute' && m) { delete m.mutedUntil; delete m.mutedWhy; t = 'снова пишет в чат'; }
        rowSt(memRow(tid), 'done', t); paintCounts();
      },
      bad: (r) => { AQ.dirty = true; if (sameG(gid)) rowSt(memRow(tid), 'err', errText(r)); toast(errText(r), true); },
    });
  }
   
  function act(b, btn) {
    return enqueue({ keys: ['act:' + b.op + ':' + (b.who || b.guild || '')], b,
      mark: () => { if (btn) btn.disabled = true; },
      ok: async (r) => { if (btn) btn.disabled = false; toast(r.dissolved ? 'Гильдия распущена' : OK[b.op] || 'Готово'); IDX = null; await after(b.op); },
      bad: (r) => { if (btn) btn.disabled = false; toast(errText(r), true); },
    });
  }
  async function after(op) {
    LAST = null;

    const r = await index(true, !!(W && W.guild && W.guild.me));
    if (!W) return;
    if (!r || !r.ok) { W.body.innerHTML = `<h2 id="glTitle">Гильдии</h2><p class="gl-note">${esc(closedText(r))}</p>`; return; }
    W.data = r;
    const m = r.mine && r.mine.member;
    if (m && ['create', 'join'].includes(op)) { W.tab = 'main'; await showGuild(m.guild); return; }
    if (m && W.guild && String(W.guild.guild.id) === String(m.guild)) { await showGuild(m.guild, true); return; }
    await pickFull();
    badgeSoon();
  }

  function heroAct(d, btn) {
    if (!W) return;
    const k = d.hero;
    if (k === 'raid') { raidLoad().then(() => { if (W) W.close(); window.LGGuildRaid.open(); }).catch(() => toast('Рейд не загрузился - попробуй ещё раз')); return; }
    if (k === 'cm' && d.hmine) { openWin('gather'); return; }
    if (k === 'run' && d.joined) { runLoad().then(() => window.LGGuildRun.open()).catch(() => toast('Вылазка не загрузилась - попробуй ещё раз')); return; }
    void enqueue({ keys: ['hero:' + k],
      send: () => (k === 'war' ? api.warAct({ op: 'sign' }) : k === 'cm' ? xpost('/api/citymon/act', { op: 'ejoin', id: d.id }) : xpost('/api/guildrun/act', { op: 'join' })),
      mark: () => { btn.disabled = true; },
      bad: (r) => { toast((r && r.error) || 'не вышло', true); if (btn.isConnected) btn.disabled = false; },
      ok: async () => {
        toast(k === 'war' ? WOK.sign : k === 'cm' ? 'Ты в сборе группы' : 'Ты в отряде вылазки');
        if (k === 'run') runLoad().then(() => window.LGGuildRun.open()).catch(() => toast('Вылазка не загрузилась - попробуй ещё раз'));
        if (W && W.sumP) await W.sumP;
        await summary(true);
      },
    });
  }
   
  function warClick(t, d) {
    if (!W) return;
    void enqueue({ keys: ['war:' + d.war + ':' + (d.cid || '')], send: () => api.warAct({ op: d.war, ...(d.cid ? { cid: d.cid } : {}) }),
      mark: () => { t.disabled = true; },
      bad: (r) => { t.disabled = false; toast((r && r.error) || 'не вышло', true); },
      ok: async (r) => {
        t.disabled = false;
        toast(d.war === 'take' && r.signError ? `Задание взято, но записаться не вышло: ${r.signError}` : WOK[d.war] || 'Готово', d.war === 'take' && !!r.signError);
        if (subPane('war', 'war')) await war();
        void summary(true);
      },
    });
  }
  function onClick(e) {
    const t = e.target && e.target.closest ? e.target.closest('button') : null; if (!t || !W || t.disabled) return;
    const d = t.dataset;
    if (d.confirm && !d.sure) { window.LGSiteUi.ask({ title: d.confirm, yes: t.textContent.trim(), danger: t.classList.contains('bad') }).then((ok) => { if (ok && t.isConnected) { d.sure = '1'; t.click(); delete d.sure; } }); return; }
    if (d.tab) {
      W.tab = d.tab; W.body.querySelectorAll('.gl-tabs [data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.tab === W.tab)));
      const tb = W.body.querySelector('.gl-tabs [aria-selected="true"]'); if (tb && tb.scrollIntoView && !t.closest('.gl-tabs')) try { tb.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (x) {   }
      paintTab(); return;
    }
    if (d.memsub) { W.memSub = d.memsub; paintTab(); return; }
    if (d.ann) { W.annEdit = d.ann === 'edit'; W.annDraft = null; paintTab(); if (W.annEdit) { const ta = W.body.querySelector('[data-form=ann] textarea'); if (ta) try { ta.focus(); } catch (x) {   } } return; }
    if (d.see) { W.tab = 'mem'; W.modChat = null; showGuild(d.see); return; }
    if (d.back) { void pickFull(); return; }
    if (d.gmback) { W.modF = null; void pickFull(); return; }
    if (d.mine) { const m = W.data && W.data.mine && W.data.mine.member; if (m) { W.tab = 'main'; showGuild(m.guild); } return; }
    if (d.hall) { const g = d.hall; W.close(); try { window.LGGuildHall.open(g); } catch (x) {   } return; }
    if (d.res) { result(d.res); return; }
    if (d.gm) { gmClick(d, t); return; }
    if (d.more) { const rr = t.getBoundingClientRect(); memMenu(d.more, rr.left, rr.bottom, t); return; }
    if (d.go === 'daily') { if (window.LGDailies && window.LGDailies.open) { W.close(); window.LGDailies.open(); } else toast('Задания гильдии пока недоступны'); return; }
    if (d.hero) { void heroAct(d, t); return; }
    if (d.win) { openWin(d.win); return; }
    if (d.go === 'raid') { raidLoad().then(() => { W.close(); window.LGGuildRaid.open(); }).catch(() => toast('Рейд не загрузился - попробуй ещё раз')); return; }
    if (d.go === 'gift') { if (giftOn()) { W.close(); window.LGDailies.gift(); } else toast('Подарок - скоро: награды всей гильдии за активность участников'); return; }

    if (d.war) { warClick(t, d); return; }
    if (d.all) { void allJob(d.all); return; }
    if ((d.op === 'accept' || d.op === 'decline') && d.who) { void reqJob(d.op, d.who); return; }
    if (d.op) {
      const b = { op: d.op };
      const gid = d.g || (W.guild && W.guild.guild.id);
      if (gid && !['leave', 'moveStay', 'moveLeave', 'role', 'powers', 'transfer', 'setOpen', 'kick', 'rename', 'profile', 'disband'].includes(d.op)) b.guild = String(gid);
      if (d.op === 'accept' || d.op === 'decline' || d.op === 'invite') b.guild = String(W.guild.guild.id);
      if (d.who) b.who = d.who;
      if (d.role) b.role = d.role;
      if (d.open != null) b.open = d.open === '1';
      act(b, t);
    }
  }
  function onSubmit(e) {
    const f = e.target; if (!f || !f.dataset || !f.dataset.form || !W) return;
    e.preventDefault();
    const k = f.dataset.form, fd = new FormData(f), btn = f.querySelector('[type=submit]');
    if (k === 'create') {
      W.newOpen = true;
      const descr = String(fd.get('descr') || '').trim(), emblem = String(fd.get('emblem') || '');

      act({ op: 'create', name: String(fd.get('name') || '').trim(), tag: String(fd.get('tag') || '').trim(), open: !!fd.get('open'), ...(descr ? { descr } : {}), ...(emblem ? { emblem } : {}) }, btn);
    }
    else if (k === 'ann') {
      const descr = String(fd.get('descr') || '').trim();
      act({ op: 'profile', descr }, btn).then((r) => { if (r && r.ok && W) { W.annEdit = false; W.annDraft = null; if (W.tab === 'main') paintTab(); } });
    }
    else if (k === 'profile') act({ op: 'profile', descr: String(fd.get('descr') || '').trim(), ...(fd.get('emblem') ? { emblem: String(fd.get('emblem')) } : {}) }, btn);
    else if (k === 'rename') {
      const g = W.guild.guild, name = String(fd.get('name') || '').trim(), tag = String(fd.get('tag') || '').trim(), b = { op: 'rename' };
      if (name && name !== g.name) b.name = name;
      if (tag && tag !== g.tag) b.tag = tag;
      if (!b.name && !b.tag) { toast('Название и тег не изменились', true); return; }
      window.LGSiteUi.ask({ title: `Сменить ${b.name && b.tag ? 'название и тег' : b.name ? 'название' : 'тег'}${g.renameCost ? ` за ${silver(g.renameCost)}` : ''}?`, text: 'Следующая смена - через 7 дней.', yes: 'Сменить' }).then((ok) => { if (ok) act(b, btn); });
    }
    else if (k === 'disband') {
      const name = String(fd.get('name') || '').trim();
      if (name !== W.guild.guild.name) { toast('Впиши название гильдии точно', true); return; }
      window.LGSiteUi.ask({ title: `Распустить гильдию «${name}»?`, text: 'Это нельзя отменить.', yes: 'Распустить', danger: true }).then((ok) => { if (ok) act({ op: 'disband', name }, btn); });
    }
    else if (k === 'invite') act({ op: 'invite', guild: String(W.guild.guild.id), login: String(fd.get('login') || '').trim().replace(/^@/, '') }, btn).then((r) => { if (r && r.ok) f.reset(); });
    else if (k === 'powers') act({ op: 'powers', can: fd.getAll('can').map(String) }, btn);
    else if (k === 'move') {
      const to = String(fd.get('to') || '').trim().replace(/^@/, '');
      if (!to) return;
      window.LGSiteUi.ask({ title: `Перевести гильдию в альянс канала ${to}?`, text: 'Сменить альянс снова можно будет только через неделю.', yes: 'Перевести' }).then((ok) => { if (ok) act({ op: 'move', to }, btn); });
    }
  }




  const giftOn = () => !!(window.LGDailies && typeof window.LGDailies.gift === 'function' && window.LGDailies.giftOn && window.LGDailies.giftOn());
  const giftN = () => (window.LGDailies && window.LGDailies.giftCount ? +window.LGDailies.giftCount() || 0 : 0);
   
  let BADGE = 0, badgeT = 0, badgeAt = 0;
  async function badgeNow() {
    badgeAt = Date.now();
    let n = 0;


    const b = await api.badge();
    const old = !(b && b.ok) && b && /маршрут с сайта не вызывается|нет такого метода|нет такого/.test(String(b.error || ''));
    if (b && b.ok) { n = Math.max(0, +b.n || 0) + (b.member ? giftN() : 0); void index(false, true).catch(() => null); }
    const r = old ? await index() : null;
    if (r && r.ok) {
      const m = r.mine || {};
      if (!m.member) n = (m.invites || []).length;
      else { const g = await api.guild(m.member.guild); if (g && g.ok && g.requests && g.me && g.me.can && g.me.can.accept) n = g.requests.filter((x) => x.kind === 'apply').length; n += giftN(); }
    }
    if (n !== BADGE) { BADGE = n; try { window.dispatchEvent(new CustomEvent('lgguilds', { detail: { n } })); } catch (e) { console.warn('[гильдии] счётчик', e); } }
    return n;
  }
  function badgeSoon() { clearTimeout(badgeT); badgeT = setTimeout(() => { badgeNow().catch((e) => console.warn('[гильдии] счётчик', e)); }, 300); }

  function badgeTick() { if (!document.hidden && document.querySelector('[data-gu="guild"]') && Date.now() - badgeAt > 55e3) badgeSoon(); }
  setInterval(badgeTick, 5e3);



  const OPEN_MS = [20e3, 30e3];
  let liveT = 0;
  const openGap = () => OPEN_MS[0] + Math.round(Math.random() * (OPEN_MS[1] - OPEN_MS[0]));
  function liveSoon() { clearTimeout(liveT); liveT = setTimeout(liveTick, Math.max(openGap(), BK.wait())); }
  async function liveTick() {
    liveT = 0;
    if (!W) return;
    if (document.hidden || W.layer || qBusy() || (document.activeElement && W.el.contains(document.activeElement) && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName))) { liveSoon(); return; }
    try {
      const was = JSON.stringify(IDX && IDX.mine);
      const r = await index(true, !!(W.guild && W.guild.me));
      if (W && r && r.ok && JSON.stringify(r.mine) !== was) { await after(''); }
      else if (W && r && r.ok && W.guild && r.mine && r.mine.member && String(r.mine.member.guild) === String(W.guild.guild.id)) {
        const g = await api.guild(r.mine.member.guild);
        if (W && g && g.ok && W.guild && JSON.stringify(g) !== JSON.stringify(W.guild) && !W.layer && !qBusy() && !(document.activeElement && W.el.contains(document.activeElement) && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName))) { W.guild = g; paintGuild(); }

        if (W && W.guild && W.guild.me && W.tab === 'main') await summary();
        clocks();
      }
    } catch (e) { console.warn('[гильдии] окно: освежить', e); }
    if (W) liveSoon();
  }

  window.LGGuilds = {
     
    pick: () => open({ view: 'pick' }),
     
    mod: () => open({ view: 'mod' }),
    open: (o) => open(o),
    close: () => { if (W) W.close(); },
    gst,
    index,
     
    n: () => BADGE,
    refresh: () => badgeNow(),
     
    backoff,
     
    wait: () => BK.wait(),
     
    queue: () => ({ n: AQ.jobs.length + (AQ.cur ? 1 : 0), busy: qBusy(), last: AQ.last, done: AQ.n }),
    state: () => (W ? { tab: W.tab, guild: W.guild ? W.guild.guild.id : null, pick: !!W.body.querySelector('.gl-list') } : null),
  };
})();
