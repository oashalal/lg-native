








(function () {
  'use strict';
  if (window.LGGuildRun) return;
  const base = () => window.LG_BASE || '';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NET = { ok: false, error: 'Нет связи - попробуй ещё раз' };
  const j = (r) => r.json().catch(() => ({ ok: false, error: 'не вышло' }));
  const get = () => fetch(base() + '/api/guildrun', { credentials: 'same-origin' }).then(j, () => NET);
  const post = (b) => fetch(base() + '/api/guildrun/act', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then(j, () => NET);
  const style = () => { try { return (window.MDDoodle && window.MDDoodle.active) || (window.LG_STYLES && window.LG_STYLES[0]) || 'legion'; } catch (e) { return 'legion'; } };
  const ROLE_RU = { legionary: 'Легионер', paladin: 'Паладин', rogue: 'Разбойник', archer: 'Лучник', mage: 'Маг', priest: 'Жрец', necromancer: 'Некромант', recruit: 'Новобранец' };

  const annIco = () => { try { const v = window.LGEmblems && window.LGEmblems.icon ? window.LGEmblems.icon('run', style(), 30) : ''; if (v) return v; } catch (e) {   } return '🥾'; };
  const STEP_ICO = { event: '❔', fight: '⚔️', boss: '💀' };
  const EV_ICO = { traveler: '🧙', prisoner: '⛓️', fork: '🔀', chest: '🧰', trap: '🪤', camp: '🔥' };
  const SKY = { forest: ['#9fd3ff', '#5b9a4a'], taiga: ['#a9cbe8', '#3f6e46'], meadow: ['#a8dcff', '#7fb85a'], mount: ['#b8c8e0', '#7b7468'], ash: ['#d8a98a', '#5a4a44'],
    ice: ['#d6ecff', '#cfe3ef'], swamp: ['#a7c0a0', '#4f6a3e'], blight: ['#b39ac2', '#4d3d58'], coast: ['#9fdcff', '#e6cf8f'], desert: ['#ffe2a8', '#d9b46a'], ruin: ['#c9c2b4', '#8a8270'] };

   
  let foesP = null;
  const loadJs = (src) => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  function foes() {
    if (window.QBattle && window.QBattle.foe) return Promise.resolve();
    if (foesP) return foesP;
    const V = window.LG_QV || {};
    foesP = (window.QArt ? Promise.resolve() : loadJs(`/site/q/artkit.js?v=${V.ak || ''}`)).then(() => loadJs(`${base()}/questfoes.js?v=${V.foes || ''}`)).then(() => loadJs(`/site/q/battle.js?v=${V.bt || ''}`))
      .catch((e) => { foesP = null; console.warn('[вылазки] рисунки монстров', e); });
    return foesP;
  }
  const jhash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const noAnim = (s) => String(s || '').replace(/<(animate|animateTransform|animateMotion|set)\b[^>]*?(\/>|>[\s\S]*?<\/\1>)/g, '');
  function heroSvg(u) {
    const D = window.MDDoodle; if (!D || !D.jDoodle) return '';
    try { const lk = u.look || {}; return noAnim(D.jDoodle(jhash(String(u.login || u.name).toLowerCase()), 'stern', false, { alive: u.hp == null || u.hp > 0, armed: true, gear: lk.g || {}, who: String(u.login || '') }, lk.lk || null)); } catch (e) { return ''; }
  }
  function foeSvg(u) {
    const Q = window.QBattle;
    if (Q && Q.foe && u.art) { try { return `<svg viewBox="-110 -200 220 210" class="gr-foe-svg">${Q.foe(u.art, 0, 0, 0.9, { boss: !!u.boss })}</svg>`; } catch (e) {   } }
    return `<div class="gr-foe-fb">${u.boss ? '👹' : '👾'}</div>`;
  }

   
  const S = { el: null, data: null, off: 0, pollT: 0, tickT: 0, busy: false, lastRound: 0, lastStep: -1, pane: null, sel: null, err: '', form: false };
  const now = () => Date.now() + S.off;
  const left = (t) => Math.max(0, Math.ceil((t - now()) / 1000));
  function toast(t) {
    const x = document.createElement('div'); x.className = 'gr-toast' + (S.el ? '' : ' free'); x.textContent = t; (S.el || document.body).appendChild(x);
    setTimeout(() => x.remove(), 2600);
  }

  async function load() {
    const r = await get();
    if (r && r.ok) { S.data = r; S.off = (r.now || Date.now()) - Date.now(); S.err = ''; } else S.err = (r && r.error) || 'не вышло';
    return r;
  }
  async function act(b) {
    if (S.busy) return null; S.busy = true;
    try {
      const r = await post(b);
      if (r && r.ok) { S.data = r; S.off = (r.now || Date.now()) - Date.now(); } else toast((r && r.error) || 'не вышло');
      return r;
    } finally { S.busy = false; }
  }

   
  const TZ = 3 * 3600e3;
  const p2 = (n) => String(n).padStart(2, '0');
  const mskParts = (t) => { const d = new Date(+t + TZ); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes() }; };
  const MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  function fmtAt(t) {
    const x = mskParts(t), n = mskParts(now()), tm = mskParts(now() + 864e5);
    const day = x.d === n.d && x.m === n.m ? 'сегодня' : x.d === tm.d && x.m === tm.m ? 'завтра' : `${x.d} ${MON[x.m - 1]}`;
    return `${day} в ${p2(x.h)}:${p2(x.mi)}`;
  }
  function inTime(t) {
    const m = Math.round((t - now()) / 60e3);
    if (m <= 0) return 'сейчас';
    if (m < 60) return `через ${m} мин`;
    const h = Math.floor(m / 60), r = m % 60;
    if (h < 24) return `через ${h} ч${r ? ` ${r} мин` : ''}`;
    const d = Math.floor(h / 24); return `через ${d} дн.${h % 24 ? ` ${h % 24} ч` : ''}`;
  }
   
  function atOf(date, time) {
    const a = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || ''), b = /^(\d{2}):(\d{2})/.exec(time || '');
    return a && b ? Date.UTC(+a[1], +a[2] - 1, +a[3], +b[1], +b[2]) - TZ : NaN;
  }
  const dateVal = (t) => { const x = mskParts(t); return `${x.y}-${p2(x.m)}-${p2(x.d)}`; };
  const timeVal = (t) => { const x = mskParts(t); return `${p2(x.h)}:${p2(x.mi)}`; };
  const plural = (n, a, b, c) => { const m = n % 100, k = n % 10; return m > 10 && m < 20 ? c : k === 1 ? a : k > 1 && k < 5 ? b : c; };

   
  function annHtml(d, big) {
    const P = d.plan; if (!P) return '';
    const run = d.run;
    let head, sub, btns = '';
    if (P.st === 'plan') {
      head = `Вылазка: ${esc(fmtAt(P.at))}, ${esc(inTime(P.at))}`;
      sub = `«${esc(P.place)}» · назначил <b>${esc(P.by)}</b> · отметились «Буду»: <b>${P.will}</b>`;
      btns = `<button type="button" class="gl-btn${P.iWill ? ' ghost' : ''}" data-gr="will" data-on="${P.iWill ? '0' : '1'}" aria-pressed="${P.iWill}">${P.iWill ? '✓ Буду - отменить' : 'Буду'}</button>`;
    } else if (P.st === 'gather') {
      head = `Сбор на вылазку - ${esc(String(Math.max(0, Math.ceil((P.until - now()) / 60e3))))} мин до выхода`;
      sub = `«${esc(P.place)}» · в отряде <b>${P.n}</b> (нужно хотя бы ${P.min}) · назначил <b>${esc(P.by)}</b>`;
      btns = P.joined ? '<button type="button" class="gl-btn" data-gr="open">Вернуться в сбор</button>' : '<button type="button" class="gl-btn go" data-gr="join">Присоединиться</button>';
      if (P.lead) btns += `<button type="button" class="gl-btn ghost" data-gr="start"${P.n < P.min ? ' disabled' : ''}>Отправиться сейчас</button>`;
    } else {
      head = `Вылазка в пути: «${esc(P.place)}»`;
      sub = `в отряде <b>${P.n}</b> · назначил <b>${esc(P.by)}</b>${P.canJoin && !P.joined ? ' · войти можно до первого боя' : ''}`;
      btns = P.joined || (run && run.mine) ? '<button type="button" class="gl-btn" data-gr="open">Вернуться в вылазку</button>' : P.canJoin ? '<button type="button" class="gl-btn go" data-gr="join">Догнать отряд</button>' : '';
    }
    if (P.lead && P.st !== 'run' && big) btns += (P.st === 'plan' ? '<button type="button" class="gl-btn ghost" data-gr="move">Перенести</button>' : '') + '<button type="button" class="gl-btn ghost bad" data-gr="cancel">Отменить</button>';
    if (!big) btns += '<button type="button" class="gl-btn ghost" data-gr="tab">Подробнее</button>';
    return `<section class="gr-ann st-${esc(P.st)}${big ? ' big' : ''}" aria-label="Вылазка гильдии"><i class="gr-ann-ico" aria-hidden="true">${annIco()}</i><div class="gr-ann-t"><b>${head}</b><small>${sub}</small></div><div class="gr-ann-b">${btns}</div></section>`;
  }
   
  function banner(slot, d) {
    if (d && d.ok) { S.data = d; S.off = (d.now || Date.now()) - Date.now(); }
    const paintB = () => { if (!slot.isConnected) return; slot.innerHTML = S.data && S.data.plan ? annHtml(S.data, false) : ''; };
    paintB();
    slot.onclick = async (e) => {
      const b = e.target.closest('[data-gr]'); if (!b || b.disabled) return;
      const k = b.dataset.gr;
      if (k === 'tab') { const t = document.querySelector('.gl-tabs [data-tab="run"]'); if (t) t.click(); return; }
      if (await annAct(k, b)) paintB();
    };
  }
   
  async function annAct(k, b) {
    if (k === 'open') { open(); return false; }
    if (k === 'cancel') { if (b.dataset.arm !== '1') { b.dataset.arm = '1'; b.textContent = 'Точно отменить?'; setTimeout(() => { if (b.isConnected) { b.dataset.arm = ''; b.textContent = 'Отменить'; } }, 3000); return false; } }
    const body = k === 'will' ? { op: 'will', on: b.dataset.on === '1' } : { op: k };
    const r = await act(body);
    if (r && r.ok && (k === 'join' || k === 'start')) { open(); return false; }
    return true;
  }

   
  async function tab(pane) {
    S.pane = pane; S.form = false;
    pane.innerHTML = '<p class="gl-note">Смотрю вылазки…</p>';
    const r = await load();
    if (S.pane !== pane) return;
    if (!r || !r.ok) { pane.innerHTML = `<p class="gl-note">${esc((r && r.error) || 'Вылазки недоступны')}</p>`; return; }
    paintTab(pane);
  }
  function planForm(d) {
    const R = d.rules || {}, P = d.plan;
    const t0 = P && P.st === 'plan' ? P.at : Math.ceil((now() + Math.max(60, (R.leadMin || 30) + 5) * 60e3) / 300e3) * 300e3;
    const Wk = d.week || {};
    const min = dateVal(Wk.next && !P ? Wk.next : now()), max = dateVal(now() + (R.ahead || 7) * 864e5);
    return `<form class="gr-plan" aria-label="${P ? 'Перенести вылазку' : 'Назначить вылазку'}"><h3>${P ? 'Перенести вылазку' : 'Назначить вылазку'}</h3>`
      + `<div class="gr-plan-row"><label>День <input type="date" name="d" required min="${min}" max="${max}" value="${dateVal(t0)}"></label>`
      + `<label>Время (МСК) <input type="time" name="t" required step="300" value="${timeVal(t0)}"></label></div>`
      + `<p class="gl-note gl-sm">Место - «${esc(d.place)}» (природа вашего города). Не раньше чем через ${R.leadMin} мин и не дальше чем на ${R.ahead} дн., не чаще ${R.perWeek === 1 ? '1 раза' : R.perWeek + ' раз'} в неделю (неделя - с понедельника 05:00 МСК; не состоявшаяся не в счёт), не ближе ${R.clash} мин к рейду гильдии и мини-сражению. В назначенное время - ${R.gather} мин на сбор, нужно хотя бы ${R.min} ${plural(R.min, 'участник', 'участника', 'участников')}; отметившимся «Буду» - напоминание за ${R.remind} мин.</p>`
      + `<div class="gl-btns"><button type="submit" class="gl-btn go">${P ? 'Перенести' : 'Назначить'}</button>${P ? '<button type="button" class="gl-btn ghost" data-gr="noform">Не переносить</button>' : ''}</div></form>`;
  }
  function paintTab(pane) {
    const d = S.data, P = d.plan, lead = !!(d.guild && d.guild.lead), R = d.rules || {};
    let h = `<p class="gl-note">Вылазка - живой мини-поход всей гильдии по расписанию: глава или руководство назначает время, в назначенный час ${R.gather} мин на сбор, потом тропа «${esc(d.place)}» с событиями (голосует весь отряд) и бой с монстрами. За победу - сундук с монетами и опытом, гильдии - опыт.</p>`;
    if (P) h += annHtml(d, true);
    else h += `<section class="gr-ann none"><i class="gr-ann-ico" aria-hidden="true">${annIco()}</i><div class="gr-ann-t"><b>Вылазка не назначена</b><small>${d.week && d.week.next ? `На этой неделе вылазка уже была - не чаще ${R.perWeek === 1 ? '1 раза' : R.perWeek + ' раз'} в неделю. Следующую можно назначить с ${esc(fmtAt(d.week.next))} (МСК). ` : ''}${lead ? 'Назначь день и время - товарищи увидят анонс в окне гильдии и в чате гильдии.' : 'Вылазку назначает глава или руководство гильдии - анонс появится здесь и на Главной.'}</small></div></section>`;
    if (lead && (!P || (P.st === 'plan' && S.form))) h += planForm(d);
    if (d.run && d.run.st === 'done') h += '<div class="gl-btns"><button type="button" class="gl-btn" data-gr="open">Итог вылазки</button></div>';
    const L = d.last;
    if (L) h += `<p class="gl-note gr-last">Прошлая вылазка (${esc(fmtAt(L.at))}, «${esc(L.place || '')}»): ${L.failed ? `не состоялась - собралось ${L.n} из ${L.min}` : L.win ? `<b>пройдена</b>, в отряде ${L.n}` : `отряд отступил, в отряде ${L.n}`}.</p>`;
    const Wl = d.weekly || { done: 0, max: 1 };
    h += `<p class="gl-note gl-sm gr-daily">Вылазка гильдии - не чаще ${R.perWeek === 1 ? '1 раза' : R.perWeek + ' раз'} в неделю. Личная награда - за ${Wl.max === 1 ? 'одну вылазку' : Wl.max + ' вылазки'} в неделю (на этой неделе: ${Math.min(Wl.done, Wl.max)} из ${Wl.max}${Wl.reset ? `, новая неделя - ${esc(fmtAt(Wl.reset))}` : ''}).</p>`;
    pane.innerHTML = h;
    pane.onclick = async (e) => {
      const b = e.target.closest('[data-gr]'); if (!b || b.disabled) return;
      const k = b.dataset.gr;
      if (k === 'move') { S.form = true; paintTab(pane); const f = pane.querySelector('.gr-plan input'); if (f) f.focus(); return; }
      if (k === 'noform') { S.form = false; paintTab(pane); return; }
      if (await annAct(k, b)) { if (k === 'cancel') S.form = false; if (S.pane === pane) paintTab(pane); }
    };
    pane.onsubmit = async (e) => {
      const f = e.target.closest('.gr-plan'); if (!f) return;
      e.preventDefault();
      const at = atOf(f.elements.d.value, f.elements.t.value);
      if (!Number.isFinite(at)) { toast('Выбери день и время'); return; }
      const r = await act({ op: 'plan', at });
      if (r && r.ok) { S.form = false; toast(r.did === 'plan' && P ? 'Вылазка перенесена' : 'Вылазка назначена - анонс в чате гильдии'); }
      if (S.pane === pane) paintTab(pane);
    };
  }

   
  function open() {
    if (S.el) { paint(); return; }
    try { if (window.LGGuilds && window.LGGuilds.close) window.LGGuilds.close(); } catch (e) {   }
    const el = document.createElement('div'); el.className = 'gr'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Вылазка гильдии'); el.dataset.st = style();
    el.innerHTML = '<div class="gr-sky"></div><header class="gr-top"><button type="button" class="gr-exit" data-x="exit" aria-label="Выйти из экрана вылазки">← Выйти</button><div class="gr-title"></div><div class="gr-day"></div></header>'
      + '<ol class="gr-trail" aria-label="Тропа"></ol><main class="gr-stage"><div class="gr-side gr-p"></div><div class="gr-mid"></div><div class="gr-side gr-f"></div></main>'
      + '<div class="gr-text" role="status" aria-live="polite"></div><section class="gr-panel"></section><div class="gr-chat cy-chat"></div>';
    document.body.appendChild(el); S.el = el;
    document.documentElement.classList.add('gr-on');
    el.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    try { if (window.LGChatOne && window.LGChatOne.dock) window.LGChatOne.dock('guildrun', el); } catch (e) {   }
    foes().then(() => { S.lastRound = -1; paint(true); });
    poll(true);
    S.tickT = setInterval(timers, 250);
  }
  function close() {
    if (!S.el) return;
    clearTimeout(S.pollT); clearInterval(S.tickT); S.pollT = 0;
    document.removeEventListener('keydown', onKey);
    try { if (window.LGChatOne && window.LGChatOne.dock) window.LGChatOne.dock('guildrun', null); } catch (e) {   }
    S.el.remove(); S.el = null; document.documentElement.classList.remove('gr-on');
    try { if (window.LGGuilds && window.LGGuilds.open) window.LGGuilds.open({ view: 'run' }); } catch (e) {   }
  }
  function onKey(e) {
    if (e.key === 'Escape' && S.el && !e.defaultPrevented) { e.preventDefault(); close(); }

    if (S.el && /^[1-6]$/.test(e.key) && !/input|textarea/i.test((e.target && e.target.tagName) || '')) {
      const b = S.el.querySelectorAll('.gr-panel [data-a]:not([disabled]), .gr-panel [data-v]')[+e.key - 1]; if (b) b.click();
    }
  }
  async function poll(first) {
    clearTimeout(S.pollT);
    if (!S.el) return;
    if (!document.hidden || first) { await load(); if (S.el) paint(); }
    const run = S.data && S.data.run;
    const ms = run && run.st === 'run' ? 1000 : run && run.st === 'gather' ? 2000 : 4000;
    S.pollT = setTimeout(() => poll(false), ms);
  }
  async function onClick(e) {
    const b = e.target.closest('button'); if (!b || !S.el) return;
    const run = S.data && S.data.run;
    if (b.dataset.x === 'exit') { close(); return; }
    if (b.dataset.x === 'start') { await act({ op: 'start' }); paint(); return; }
    if (b.dataset.x === 'join') { await act({ op: 'join' }); paint(); return; }
    if (b.dataset.x === 'leave') { if (!confirmLeave(b)) return; await act({ op: 'leave' }); close(); return; }
    if (b.dataset.x === 'done') { close(); return; }
    if (b.dataset.v && run) { await act({ op: 'vote', i: run.i, choice: b.dataset.v }); paint(); return; }
    if (b.dataset.a && run && run.fight) { S.sel = b.dataset.a; paint(); await act({ op: 'act', round: run.fight.round, action: b.dataset.a }); paint(); }
  }

  function confirmLeave(b) {
    const run = S.data && S.data.run; if (!run || run.st !== 'run') return true;
    if (b.dataset.arm === '1') return true;
    b.dataset.arm = '1'; b.textContent = 'Точно выйти? Нажми ещё раз'; setTimeout(() => { if (b.isConnected) { b.dataset.arm = ''; b.textContent = 'Покинуть вылазку'; } }, 3000);
    return false;
  }

   
  function paint(force) {
    if (!S.el) return;
    const d = S.data, run = d && d.run;
    const top = S.el.querySelector('.gr-title'), day = S.el.querySelector('.gr-day'), trail = S.el.querySelector('.gr-trail');
    const panel = S.el.querySelector('.gr-panel'), text = S.el.querySelector('.gr-text');
    if (!d) { panel.innerHTML = `<div class="gr-card"><p>${esc(S.err || 'Загружаю…')}</p></div>`; return; }
    if (!run) { top.textContent = 'Вылазка гильдии'; trail.innerHTML = ''; S.el.querySelector('.gr-p').innerHTML = ''; S.el.querySelector('.gr-f').innerHTML = ''; text.textContent = '';
      const P = d.plan, can = P && P.canJoin && !P.joined;
      const msg = d.error || (P && P.st === 'plan' ? `Вылазка назначена: ${fmtAt(P.at)} (МСК). Сбор откроется в это время.` : can ? `Отряд «${P.place}» ${P.st === 'gather' ? 'собирается' : 'в пути - догнать можно до первого боя'}.` : 'Ты сейчас не в вылазке.');
      panel.innerHTML = `<div class="gr-card"><p>${esc(msg)}</p><div class="gr-btns">${can ? '<button type="button" class="gr-btn go" data-x="join">Присоединиться</button>' : ''}<button type="button" class="gr-btn" data-x="exit">К гильдии</button></div></div>`; return; }
    S.el.dataset.phase = run.st === 'done' ? 'done' : run.st === 'gather' ? 'lobby' : run.phase;
    const sky = SKY[run.biome] || SKY.forest;
    S.el.style.setProperty('--sky', sky[0]); S.el.style.setProperty('--ground', sky[1]);
    top.innerHTML = `<b>${esc(run.place)}</b><small>${esc(run.gname)} · ${esc(run.biomeRu || '')}</small>`;
    day.textContent = `В отряде ${run.n}`;
    trail.innerHTML = run.st === 'gather' ? '' : run.steps.map((s, i) => `<li class="${s.done ? 'done' : ''}${i === run.i && run.st === 'run' ? ' cur' : ''}${s.boss ? ' boss' : ''}"><i>${s.kind === 'event' ? EV_ICO[s.ev] || STEP_ICO.event : s.boss ? STEP_ICO.boss : STEP_ICO.fight}</i><span>${esc(s.title)}</span></li>`).join('');
    text.textContent = run.text || '';
    const cur = trail.querySelector('li.cur'); if (cur && trail.scrollWidth > trail.clientWidth) trail.scrollLeft = Math.max(0, cur.offsetLeft - trail.clientWidth / 2 + cur.offsetWidth / 2);
    if (run.st === 'gather') return paintGather(run, panel, d.plan);
    paintStage(run, force);
    if (run.st === 'done' && run.result) return paintResult(run, panel);
    if (run.phase === 'vote' && run.event) return paintVote(run, panel);
    if (run.fight && (run.phase === 'fight')) return paintFight(run, panel);
    panel.innerHTML = `<div class="gr-card gr-wait"><p>${esc(run.text || 'Отряд идёт дальше…')}</p><div class="gr-bar"><i data-until="${run.until}" data-span="3000"></i></div></div>`;
  }
  function memberLi(m, run) {
    return `<li class="${m.left ? 'left' : ''}"><span class="gr-fig">${heroSvg(m)}</span><span><b>${esc(m.name)}</b>${m.login === run.by ? ' <small class="gr-lead">назначил</small>' : ''}<small>${esc(ROLE_RU[m.role] || '')}${m.level ? ` · ${m.level} ур.` : ''}${m.left ? ' · вышел' : ''}</small></span></li>`;
  }


  const cap = () => {
    const el = S.el && S.el.querySelector('.gr-p'), w = el ? el.clientWidth : 400;
    let low = false; try { low = window.matchMedia('(max-width: 760px), (max-height: 520px)').matches; } catch (e) { low = false; }
    const per = Math.max(2, Math.floor(w / (low ? 46 : 58)));
    return Math.max(3, Math.min(low ? 5 : 12, per * 2 - 1));
  };
  const crowd = (side, n) => side.classList.toggle('crowd', n > 3);
  const MEM_SHOW = 24;
  function paintGather(run, panel, P) {
    S.el.querySelector('.gr-f').innerHTML = '';
    paintStage(run, false);
    const n = run.n, lead = !!(P && P.lead), L = run.members.filter((m) => !m.left);
    const mine = L.slice().sort((a, b) => (b.login === run.me) - (a.login === run.me));
    panel.innerHTML = `<div class="gr-card gr-lobby"><h2>Сбор отряда</h2><p class="gr-sub">«${esc(run.place)}» · в отряде <b>${n}</b> · нужно хотя бы ${run.min} · выход ${esc(inTime(run.until))} (сам)</p>`
      + `<ul class="gr-mem">${mine.slice(0, MEM_SHOW).map((m) => memberLi(m, run)).join('')}${L.length > MEM_SHOW ? `<li class="more"><span class="gr-fig">+${L.length - MEM_SHOW}</span><span><small>ещё в отряде</small></span></li>` : ''}</ul>`
      + `<div class="gr-bar"><i data-until="${run.until}" data-span="${Math.max(60e3, run.until - run.at)}"></i></div>`
      + `<p class="gr-sub">Товарищи присоединяются из окна гильдии. ${n < run.min ? `Не наберётся ${run.min} к выходу - вылазка не состоится.` : 'Отряд готов - выйдет сам по окончании сбора.'}</p>`
      + `<div class="gr-btns">${lead ? `<button type="button" class="gr-btn go" data-x="start"${n < run.min ? ' disabled' : ''}>Отправиться</button>` : ''}<button type="button" class="gr-btn ghost" data-x="leave">Выйти из сбора</button></div></div>`;
  }

  function paintStage(run, force) {
    const P = S.el.querySelector('.gr-p'), F = S.el.querySelector('.gr-f'), f = run.fight, K = cap();
    const key = `${run.id}:${run.st}:${run.i}:${run.n}:${K}:${f ? f.units.length : 0}:${f ? f.round : 0}:${f ? f.phase : run.phase}`;
    if (!force && S.stageKey === key) { if (f) bars(f); return; }
    S.stageKey = key;
    const hp = (u) => `<div class="gr-hp"><i style="transform:scaleX(${u.hpMax ? Math.max(0, u.hp / u.hpMax).toFixed(3) : 0})"></i><small>${u.hp}/${u.hpMax}</small></div>`;
    const more = (n, sub, bar) => (n > 0 ? `<div class="gr-u gr-more" data-more="1"><span class="gr-fig"><b>+${n}</b></span><b>${esc(sub)}</b>${bar || ''}</div>` : '');
    if (f && (run.phase === 'fight' || run.st === 'done' || (run.phase === 'show' && f.over))) {

      const pu = f.units.filter((u) => u.side === 'p').sort((a, b) => (b.login === run.me) - (a.login === run.me) || (b.hp > 0) - (a.hp > 0));
      const fu = f.units.filter((u) => u.side === 'f').sort((a, b) => (b.boss - a.boss) || (b.hp > 0) - (a.hp > 0));
      const ps = pu.slice(0, K), rest = pu.slice(K), fk = Math.max(2, Math.min(fu.length, K <= 5 ? 4 : 10)), fs = fu.slice(0, fk), frest = fu.slice(fk);
      const sum = (a) => a.reduce((x, u) => [x[0] + u.hp, x[1] + u.hpMax], [0, 0]);
      const [rh, rm] = sum(rest), alive = rest.filter((u) => u.hp > 0).length;
      P.innerHTML = ps.map((u) => `<div class="gr-u${u.hp > 0 ? '' : ' dead'}${f.acted.includes(u.login) ? ' acted' : ''}${u.login === run.me ? ' me' : ''}" data-u="${esc(u.id)}"><span class="gr-fig">${heroSvg(u)}</span><b>${esc(u.name)}</b>${hp(u)}</div>`).join('')
        + more(rest.length, `живы ${alive}`, rest.length ? `<div class="gr-hp" data-hpsum="p"><i style="transform:scaleX(${rm ? (rh / rm).toFixed(3) : 0})"></i></div>` : '');
      const [fh, fm] = sum(frest);
      F.innerHTML = fs.map((u) => `<div class="gr-u${u.hp > 0 ? '' : ' dead'}${u.boss ? ' boss' : ''}${u.name && /великан/.test(u.name) ? ' big' : ''}" data-u="${esc(u.id)}"><span class="gr-fig">${foeSvg(u)}</span><b>${esc(u.name)}</b>${hp(u)}</div>`).join('')
        + more(frest.length, `живы ${frest.filter((u) => u.hp > 0).length}`, frest.length ? `<div class="gr-hp" data-hpsum="f"><i style="transform:scaleX(${fm ? (fh / fm).toFixed(3) : 0})"></i></div>` : '');
      crowd(P, ps.length + (rest.length ? 1 : 0)); crowd(F, fs.length + (frest.length ? 1 : 0));
      S.shown = new Set([...ps, ...fs].map((u) => u.id));
      if (f.last && f.last.r !== S.lastRound) { S.lastRound = f.last.r; floaters(f.last); }
    } else {
      const L = run.members.filter((m) => !m.left).sort((a, b) => (b.login === run.me) - (a.login === run.me));
      P.innerHTML = L.slice(0, K).map((m) => `<div class="gr-u walk${m.login === run.me ? ' me' : ''}"><span class="gr-fig">${heroSvg(m)}</span><b>${esc(m.name)}</b></div>`).join('') + more(L.length - K, 'в отряде');
      crowd(P, Math.min(L.length, K + 1));
      F.innerHTML = '';
    }
  }
  function bars(f) {
    for (const side of ['p', 'f']) {
      const x = S.el.querySelector(`[data-hpsum="${side}"] i`); if (!x) continue;
      const r = f.units.filter((u) => u.side === side && !(S.shown && S.shown.has(u.id)));
      const h = r.reduce((s, u) => s + u.hp, 0), m = r.reduce((s, u) => s + u.hpMax, 0);
      x.style.transform = `scaleX(${m ? (h / m).toFixed(3) : 0})`;
      const lb = x.closest('.gr-more') && x.closest('.gr-more').querySelector(':scope > b'); if (lb) lb.textContent = `живы ${r.filter((u) => u.hp > 0).length}`;
    }
    for (const u of f.units) {
      const x = S.el.querySelector(`[data-u="${CSS.escape(u.id)}"]`); if (!x) continue;
      const i = x.querySelector('.gr-hp i'), s = x.querySelector('.gr-hp small');
      if (i) i.style.transform = `scaleX(${u.hpMax ? Math.max(0, u.hp / u.hpMax).toFixed(3) : 0})`;
      if (s) s.textContent = `${u.hp}/${u.hpMax}`;
      x.classList.toggle('dead', !(u.hp > 0));
    }
  }

  function floaters(last) {
    for (const h of last.hits || []) {
      const x = S.el.querySelector(`[data-u="${CSS.escape(h.id)}"]`); if (!x) continue;
      const n = document.createElement('span'); n.className = 'gr-num' + (h.d > 0 ? ' heal' : '') + (h.fell ? ' fell' : '');
      n.textContent = h.fell ? 'пал!' : (h.d > 0 ? '+' : '') + h.d; x.appendChild(n);
      setTimeout(() => n.remove(), 1400);
      if (h.d < 0) { x.classList.remove('hit'); void x.offsetWidth; x.classList.add('hit'); }
    }
  }

  function paintVote(run, panel) {
    const E = run.event, total = run.n || run.members.filter((m) => !m.left).length;
    const voted = E.voted != null ? E.voted : E.opts.reduce((s, o) => s + (o.c || 0), 0);
    const name = (l) => { const m = run.members.find((x) => x.login === l); return m ? m.name : l; };
    const sub = (o) => (o.who ? (o.who.length ? esc(o.who.map(name).join(', ')) : 'пока никто') : `${o.c} ${plural(o.c, 'голос', 'голоса', 'голосов')}${voted ? ` · ${Math.round((o.c / voted) * 100)}%` : ''}`);
    panel.innerHTML = `<div class="gr-card gr-vote"><h2><i>${EV_ICO[E.ev] || '❔'}</i>${esc(E.title)}</h2><p>${esc(E.text)}</p>`
      + `<div class="gr-opts">${E.opts.map((o, i) => `<button type="button" class="gr-opt${E.my === o.k ? ' on' : ''}" data-v="${esc(o.k)}" aria-pressed="${E.my === o.k}"><b>${i + 1}. ${esc(o.n)}</b><small>${sub(o)}</small><i class="gr-cnt">${o.c || 0}</i><em style="--w:${total ? ((o.c || 0) / total).toFixed(3) : 0}"></em></button>`).join('')}</div>`
      + `<div class="gr-foot"><span>Проголосовали ${voted} из ${total}${E.my ? ' · твой голос учтён - можно передумать' : ''} · поровну - решает ${esc(name(run.by))}</span><span class="gr-left" data-until="${run.until}"></span></div><div class="gr-bar"><i data-until="${run.until}" data-span="15000"></i></div></div>`;
  }
  function paintFight(run, panel) {
    const f = run.fight, my = f.my || {};
    const acts = my.acts || [];
    const head = `<div class="gr-foot"><span>Раунд ${f.round} из ${f.max} · ходы: ${f.acted.length} из ${f.units.filter((u) => u.side === 'p' && u.hp > 0).length}</span><span class="gr-left" data-until="${f.until}"></span></div>`;
    if (f.phase !== 'act') { panel.innerHTML = `<div class="gr-card gr-act">${head}<p class="gr-sub">Раунд считается…</p></div>`; return; }
    if (!my.alive) { panel.innerHTML = `<div class="gr-card gr-act">${head}<p class="gr-sub">Твой герой пал в этом бою - отряд бьётся без тебя. Награду получишь вместе со всеми.</p><div class="gr-bar"><i data-until="${f.until}" data-span="7000"></i></div></div>`; return; }
    const cur = my.act || S.sel;
    panel.innerHTML = `<div class="gr-card gr-act">${head}<div class="gr-acts">${acts.map((a, i) => `<button type="button" class="gr-a k-${esc(a.kind)}${my.act === a.id ? ' on' : ''}" data-a="${esc(a.id)}"${a.avail ? '' : ' disabled'} title="${a.avail ? '' : `перезарядка${a.cd ? `: ${a.cd} р.` : ''}`}"><b>${i + 1}</b>${esc(a.name)}${!a.avail && a.cd ? `<small>${a.cd}</small>` : ''}</button>`).join('')}</div>`
      + `<p class="gr-sub">${my.act ? `Ход принят: «${esc((acts.find((a) => a.id === my.act) || {}).name || my.act)}» - можно сменить до конца раунда.` : cur ? 'Отправляю…' : 'Выбери действие. Не успеешь - герой ударит сам.'}</p><div class="gr-bar"><i data-until="${f.until}" data-span="7000"></i></div></div>`;
  }
  function paintResult(run, panel) {
    const R = run.result, me = (R.pay || []).find((x) => x.login === run.me);
    panel.innerHTML = `<div class="gr-card gr-res ${R.win ? 'win' : 'lose'}"><h2>${R.win ? 'Победа!' : 'Отряд отступил'}</h2>`
      + `<p class="gr-sub">${R.win ? `Вылазка «${esc(run.place)}» пройдена${R.noDead ? ' без павших' : ''}, в отряде ${(R.pay || []).length}. Множитель тропы ×${(+R.k || 1).toFixed(2).replace('.', ',')}.` : 'Монстры оказались сильнее. Утешительная награда - тем, у кого вылазка в пределах дня.'}</p>`
      + (me ? `<div class="gr-chest">${me.over ? '<p>Вылазка с наградой на этой неделе уже была - личной награды нет, но отряд тебе благодарен.</p>' : `<p class="gr-loot"><span>🪙 ${me.coins} монет</span><span>✨ ${me.xp} опыта</span></p>`}</div>` : '')
      + `<ul class="gr-pay">${(R.pay || []).slice(0, 12).map((p) => `<li><b>${esc(p.name)}</b><small>${p.over ? 'сверх лимита недели' : `${p.coins} монет · ${p.xp} опыта`}</small></li>`).join('')}${(R.pay || []).length > 12 ? `<li><b>и ещё ${R.pay.length - 12}</b><small>в отряде</small></li>` : ''}</ul>`
      + '<div class="gr-btns"><button type="button" class="gr-btn go" data-x="done">К гильдии</button></div></div>';
  }

  function timers() {
    if (!S.el) return;
    for (const x of S.el.querySelectorAll('[data-until]')) {
      const t = +x.dataset.until, span = +x.dataset.span || 10000, l = Math.max(0, t - now());
      if (x.tagName === 'I') x.style.transform = `scaleX(${Math.min(1, l / span).toFixed(3)})`;
      else x.textContent = `${Math.ceil(l / 1000)} с`;
    }
  }

  window.LGGuildRun = { open, close, tab, banner, state: () => (S.data ? { run: S.data.run ? { st: S.data.run.st, phase: S.data.run.phase, i: S.data.run.i } : null } : null) };
})();
