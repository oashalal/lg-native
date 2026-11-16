




(function () {
  'use strict';
  if (window.LGGuildRaid) return;
  const base = () => window.LG_BASE || '';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NET = { ok: false, error: 'Нет связи - попробуй ещё раз' };
  const j = (r) => r.json().catch(() => ({ ok: false, error: 'не вышло' }));
  const get = () => fetch(base() + '/api/guildraid', { credentials: 'same-origin' }).then(j, () => NET);
  const post = (b) => fetch(base() + '/api/guildraid/act', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then(j, () => NET);
  const style = () => { try { return (window.MDDoodle && window.MDDoodle.active) || (window.LG_STYLES && window.LG_STYLES[0]) || 'legion'; } catch (e) { return 'legion'; } };
  const ROLE_RU = { legionary: 'Легионер', paladin: 'Паладин', rogue: 'Разбойник', archer: 'Лучник', mage: 'Маг', priest: 'Жрец', necromancer: 'Некромант', recruit: 'Новобранец' };
  const ROLE_COL = { legionary: '#c8553d', paladin: '#e8b84a', rogue: '#5a4a6a', archer: '#4f8a3a', mage: '#3a6ad8', priest: '#f2e6c8', necromancer: '#6a3a8a', recruit: '#9a8a7a' };
  const MECH_ICO = { volley: '🌧️', aoe: '💥', poison: '☠️', weak: '🎯' };
  const CMD_ICO = { shields: '🛡️', volley: '🏹', heal: '✚', retreat: '↩️' };
  const SKY = { rootking: ['#a8dcff', '#5b9a4a'], granite: ['#b8c8e0', '#7b7468'], bogwitch: ['#a7c0a0', '#4f6a3e'], sandking: ['#ffe2a8', '#d9b46a'], frostgran: ['#d6ecff', '#cfe3ef'], rockcrab: ['#9fdcff', '#e6cf8f'] };
  const TZ = 3 * 3600e3;
  const p2 = (n) => String(n).padStart(2, '0');
  const fmt = (t) => { const d = new Date(t + TZ); return `${p2(d.getUTCDate())}.${p2(d.getUTCMonth() + 1)} в ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; };
  const dur = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60); return d ? `${d} д ${h} ч` : h ? `${h} ч ${p2(m)} мин` : `${m}:${p2(s % 60)}`; };

   
  const INK = '#2b1d18';
  function bossArt(id, k) {
    const o = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
    const eye = (x, y, c) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" ${o}/><circle cx="${x + 1}" cy="${y + 1}" r="2.5" fill="${INK}"/>`;
    const A = {
      rootking: () => `<path d="M40 230 Q20 190 50 180 Q30 150 60 140 L70 70 Q100 40 140 50 Q180 40 200 75 L210 140 Q240 150 220 180 Q250 190 230 230 Z" fill="#6b4a2b" ${o}/>`
        + `<path d="M75 75 Q140 55 195 80" fill="none" stroke="#8a6a44" stroke-width="5"/><ellipse cx="140" cy="62" rx="58" ry="14" fill="#4f8a3a" ${o}/>`
        + `<path d="M105 70 Q100 40 85 35 M170 70 Q180 42 196 40" fill="none" ${o}/><ellipse cx="140" cy="125" rx="34" ry="40" fill="#2a1a10" ${o}/>${eye(125, 115, '#ffd23f')}${eye(155, 115, '#ffd23f')}`
        + `<path d="M118 145 Q140 158 162 145" fill="none" stroke="#ffd23f" stroke-width="4"/>`
        + `<path d="M40 230 Q0 220 -10 200 M230 230 Q270 222 282 196 M70 232 Q50 260 20 262 M210 232 Q230 262 262 262" fill="none" stroke="#6b4a2b" stroke-width="12" stroke-linecap="round"/>`
        + `<path d="M40 230 Q0 220 -10 200 M230 230 Q270 222 282 196" fill="none" ${o}/>`,
      granite: () => `<path d="M60 240 L70 150 Q60 95 95 70 L185 70 Q220 95 210 150 L220 240 Z" fill="#7d8a93" ${o}/>`
        + `<path d="M95 70 L110 40 L130 62 L150 34 L170 62 L185 70" fill="#7ec8ff" ${o}/><rect x="105" y="100" width="70" height="26" rx="6" fill="#3a4a5a" ${o}/>`
        + `<path d="M115 113 L135 113 M148 113 L168 113" stroke="#7ec8ff" stroke-width="6" stroke-linecap="round"/>`
        + `<path d="M60 150 Q20 160 14 210 L50 222 Q60 190 72 182" fill="#6a7780" ${o}/><path d="M220 150 Q270 150 278 196 Q290 236 250 244 Q216 240 222 200" fill="#5a6770" ${o}/>`
        + `<path d="M100 160 L118 180 L106 204 M178 170 L162 196" fill="none" stroke="#4a5660" stroke-width="4"/>`,
      bogwitch: () => `<ellipse cx="140" cy="200" rx="100" ry="52" fill="#5a7a3a" ${o}/><ellipse cx="140" cy="140" rx="74" ry="56" fill="#6a8a44" ${o}/>`
        + `<path d="M84 96 Q66 66 102 58 Q140 34 178 58 Q214 66 196 96 Q140 84 84 96 Z" fill="#8a5a9a" ${o}/><path d="M118 52 L140 4 L162 52 Z" fill="#8a5a9a" ${o}/>`
        + `${eye(110, 112, '#ffd23f')}${eye(170, 112, '#ffd23f')}<path d="M92 152 Q140 178 188 152" fill="none" ${o}/>`
        + `<path d="M232 230 L262 40" ${o} fill="none"/><circle cx="262" cy="36" r="12" fill="#efe6d4" ${o}/>`
        + `<path d="M20 170 Q4 140 30 120 L60 140 Q50 160 56 176" fill="#4f6a32" ${o}/><ellipse cx="62" cy="200" rx="24" ry="20" fill="#3a5a2a" ${o}/><path d="M50 182 Q62 168 74 182" fill="#b6ff6a" ${o}/>`,
      sandking: () => `<path d="M70 250 L84 140 Q90 110 140 104 Q190 110 196 140 L210 250 Z" fill="#d9c9a0" ${o}/>`
        + `<path d="M90 160 L190 166 M88 188 L194 194 M86 216 L198 222" stroke="#b8a678" stroke-width="5"/>`
        + `<path d="M100 104 Q96 50 140 40 Q184 50 180 104 Z" fill="#c9952e" ${o}/><path d="M100 104 L90 140 L114 120 Z M180 104 L190 140 L166 120 Z" fill="#3a8ac8" ${o}/>`
        + `<rect x="112" y="64" width="56" height="36" rx="8" fill="#e8c66a" ${o}/>${eye(127, 80, '#3a8ac8')}${eye(153, 80, '#3a8ac8')}`
        + `<path d="M210 120 Q262 90 252 40 Q240 70 214 74" fill="#b8bec6" ${o}/><path d="M196 150 L214 76" ${o} fill="none"/>`
        + `<path d="M20 240 Q40 200 30 160 M260 250 Q240 210 262 170" fill="none" stroke="#e8d6a0" stroke-width="10" stroke-linecap="round" opacity=".8"/>`,
      frostgran: () => `<path d="M50 252 Q60 140 100 110 L180 110 Q220 140 230 252 Z" fill="#eef6ff" ${o}/>`
        + `<path d="M70 200 Q140 220 210 200 M60 236 Q140 256 220 236" fill="none" stroke="#bcd8f0" stroke-width="5"/>`
        + `<circle cx="140" cy="86" r="46" fill="#f4d8c8" ${o}/><path d="M92 82 Q96 30 140 26 Q184 30 188 82 Q170 60 140 62 Q110 60 92 82 Z" fill="#cfe8ff" ${o}/>`
        + `${eye(124, 88, '#6aa8d8')}${eye(156, 88, '#6aa8d8')}<path d="M120 112 Q140 124 160 112" fill="none" ${o}/>`
        + `<path d="M234 252 L250 66 Q260 46 276 60" fill="none" stroke="#6aa8d8" stroke-width="10" stroke-linecap="round"/><path d="M234 252 L250 66 Q260 46 276 60" fill="none" ${o}/>`
        + `<circle cx="96" cy="118" r="10" fill="#ff5a5a" ${o}/><circle cx="186" cy="120" r="10" fill="#ff5a5a" ${o}/>`,
      rockcrab: () => `<ellipse cx="140" cy="186" rx="104" ry="58" fill="#d8583a" ${o}/><path d="M60 170 Q140 120 220 170" fill="none" stroke="#b8442a" stroke-width="5"/>`
        + `<circle cx="96" cy="160" r="9" fill="#f2e6c8" ${o}/><circle cx="182" cy="150" r="7" fill="#f2e6c8" ${o}/><path d="M120 210 Q150 200 170 214" fill="none" stroke="#3a6a8a" stroke-width="6"/>`
        + `<path d="M112 132 L104 96 M168 132 L176 96" ${o} fill="none"/>${eye(104, 90, '#f2e6c8')}${eye(176, 90, '#f2e6c8')}`
        + `<path d="M40 170 Q-6 150 4 100 Q20 70 52 82 L40 110 L70 104 Q76 140 50 160" fill="#d8583a" ${o}/>`
        + `<path d="M238 176 Q272 160 266 126 L252 120 L262 100" fill="none" ${o}/><path d="M252 96 L262 70 M244 92 L270 92" ${o} fill="none"/>`
        + `<path d="M60 230 L40 260 M90 240 L80 266 M190 240 L200 266 M220 230 L244 258" ${o} fill="none"/>`,
    };
    return `<svg viewBox="-20 -10 320 280" class="grd-boss-svg${k ? ' ' + k : ''}" aria-hidden="true">${(A[id] || A.rootking)()}</svg>`;
  }
  const jhash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const noAnim = (s) => String(s || '').replace(/<(animate|animateTransform|animateMotion|set)\b[^>]*?(\/>|>[\s\S]*?<\/\1>)/g, '');
  function heroFig(u) {
    const D = window.MDDoodle;
    if (D && D.jDoodle) { try { const lk = u.look || {}; return noAnim(D.jDoodle(jhash(String(u.login || u.name).toLowerCase()), 'stern', false, { alive: u.hp > 0, armed: true, gear: lk.g || {}, who: String(u.login || '') }, lk.lk || null)); } catch (e) {   } }
    return `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="${ROLE_COL[u.role] || '#9a8a7a'}" stroke="${INK}" stroke-width="3"/><text x="20" y="25" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${esc(String(u.name || '?')[0].toUpperCase())}</text></svg>`;
  }

   
  const S = { el: null, d: null, off: 0, pollT: 0, tickT: 0, busy: false, err: '', lastR: 0, sel: null };
  const now = () => Date.now() + S.off;
  function toast(t) { const x = document.createElement('div'); x.className = 'grd-toast'; x.textContent = t; (S.el || document.body).appendChild(x); setTimeout(() => x.remove(), 2600); }
  async function load() {
    const r = await get();
    if (r && r.ok) { S.d = r; S.off = (r.now || Date.now()) - Date.now(); S.err = ''; } else S.err = (r && r.error) || 'не вышло';
    return r;
  }
  async function act(b) {
    if (S.busy) return null; S.busy = true;
    try { const r = await post(b); if (r && r.ok) { S.d = r; S.off = (r.now || Date.now()) - Date.now(); } else toast((r && r.error) || 'не вышло'); paint(); return r; } finally { S.busy = false; }
  }
  function poll() {
    clearTimeout(S.pollT);
    if (!S.el) return;
    load().then(() => { if (S.el) paint(); }).finally(() => {
      if (!S.el) return;
      const st = S.d && S.d.st, fast = st === 'fight' || st === 'open';
      S.pollT = setTimeout(poll, fast ? 1000 : 5000);
    });
  }

   
  function open() {
    if (S.el) { paint(); return; }
    const el = document.createElement('div'); el.className = 'grd'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Рейд гильдии'); el.dataset.st = style();
    el.innerHTML = '<div class="grd-sky"></div><header class="grd-top"><button type="button" class="grd-exit" data-x="exit" aria-label="Выйти из экрана рейда">← Выйти</button><div class="grd-title"></div><div class="grd-ph"></div></header>'
      + '<main class="grd-stage"><div class="grd-party" aria-label="Гильдия"></div><div class="grd-bosswrap"><div class="grd-hp"></div><div class="grd-warn" role="status" aria-live="polite"></div><div class="grd-boss"></div><div class="grd-ev" aria-live="polite"></div></div></main>'
      + '<section class="grd-panel"></section><div class="grd-chat cy-chat"></div>';
    document.body.appendChild(el); S.el = el;
    document.documentElement.classList.add('grd-on');
    el.addEventListener('click', onClick);
    el.addEventListener('change', onChange);
    document.addEventListener('keydown', onKey);
    try { if (window.LGChatOne && window.LGChatOne.dock) window.LGChatOne.dock('guildraid', el); } catch (e) {   }
    paint(); poll();
    S.tickT = setInterval(timers, 250);
  }
  function close() {
    if (!S.el) return;
    clearTimeout(S.pollT); clearInterval(S.tickT);
    document.removeEventListener('keydown', onKey);
    try { if (window.LGChatOne && window.LGChatOne.dock) window.LGChatOne.dock('guildraid', null); } catch (e) {   }
    S.el.remove(); S.el = null; document.documentElement.classList.remove('grd-on');
    try { if (window.LGGuilds && window.LGGuilds.open) window.LGGuilds.open(); } catch (e) {   }
  }
  function onKey(e) {
    if (!S.el) return;
    if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); close(); return; }
    if (/input|textarea|select/i.test((e.target && e.target.tagName) || '')) return;
    if (/^[1-6]$/.test(e.key)) { const b = S.el.querySelectorAll('.grd-panel [data-a]:not([disabled])')[+e.key - 1]; if (b) b.click(); }
    const C = { q: 'shields', w: 'volley', e: 'heal', r: 'retreat' }[e.key.toLowerCase()];
    if (C) { const b = S.el.querySelector(`.grd-panel [data-c="${C}"]:not([disabled])`); if (b) b.click(); }
  }
  function onClick(e) {
    const t = e.target.closest('button'); if (!t || t.disabled) return;
    const d = t.dataset;
    if (d.x === 'exit') { close(); return; }
    if (d.x === 'join') { void act({ op: 'join' }); return; }
    if (d.x === 'cancel') { if (t.dataset.sure) void act({ op: 'cancel' }); else { t.dataset.sure = '1'; t.textContent = 'Точно отменить?'; setTimeout(() => { if (t.isConnected) { delete t.dataset.sure; t.textContent = 'Отменить рейд'; } }, 3000); } return; }
    if (d.x === 'plan') { const at = pickedAt(); if (!at) { toast('Выбери день и время'); return; } void act({ op: 'plan', at }); return; }
    if (d.x === 'replan') { S.replan = true; paint(); return; }
    if (d.a) { const f = S.d && S.d.fight; S.sel = d.a; void act({ op: 'act', round: f ? f.round : undefined, action: d.a }); return; }
    if (d.c) { void act({ op: 'cmd', cmd: d.c }); return; }
  }
  function onChange() {   }
  function pickedAt() {
    const p = S.el.querySelector('.grd-panel'); if (!p) return 0;
    const dv = (p.querySelector('[name=d]') || {}).value, tv = (p.querySelector('[name=t]') || {}).value;
    if (!dv || !tv) return 0;
    const [y, m, dd] = dv.split('-').map(Number), [hh, mm] = tv.split(':').map(Number);
    if (![y, m, dd, hh, mm].every(Number.isFinite)) return 0;
    return Date.UTC(y, m - 1, dd, hh, mm) - TZ;
  }

  function paint() {
    const el = S.el; if (!el) return;
    const d = S.d;
    const title = el.querySelector('.grd-title'), ph = el.querySelector('.grd-ph'), party = el.querySelector('.grd-party'), boss = el.querySelector('.grd-boss');
    const hp = el.querySelector('.grd-hp'), warn = el.querySelector('.grd-warn'), evb = el.querySelector('.grd-ev'), panel = el.querySelector('.grd-panel');
    if (!d) { title.innerHTML = '<b>Рейд гильдии</b><small>загружаю…</small>'; panel.innerHTML = S.err ? `<div class="grd-card"><p>${esc(S.err)}</p></div>` : ''; return; }
    if (!d.guild) { title.innerHTML = '<b>Рейд гильдии</b>'; panel.innerHTML = '<div class="grd-card"><p>Рейд - только для участников гильдии. Вступи в гильдию - окно «Гильдии».</p></div>'; boss.innerHTML = ''; return; }
    const f = d.fight, rd = f && f.rd, bid = (rd && rd.boss) || (d.plan && d.plan.boss) || (d.res && d.res.boss) || 'rootking';
    const sky = SKY[bid] || SKY.rootking; el.style.setProperty('--sky', sky[0]); el.style.setProperty('--ground', sky[1]);
    const bname = (rd && rd.name) || (d.plan && d.plan.name) || (d.res && d.res.name) || 'Мини-босс гильдии';
    title.innerHTML = `<b>Рейд: ${esc(bname)}</b><small>${esc(d.guild.name || 'гильдия')}${d.guild.lead ? ' · ты - руководство' : ''}</small>`;
    ph.innerHTML = f ? `Фаза ${rd.ph} из 3 · раунд ${f.round}/${f.max}` : d.plan ? `${fmt(d.plan.at)} МСК` : '';
    ph.hidden = !ph.innerHTML;

    const bu = f ? f.units.find((u) => u.side === 'f') : null;
    boss.innerHTML = bossArt(bid, (bu && !(bu.hp > 0)) || (!f && !d.plan && d.res && d.res.win) ? 'down' : f && f.last && f.last.hits.some((h) => h.id === bu.id && h.d < 0) && S.lastR !== f.round ? 'hit' : '');
    if (bu) {
      const k = Math.max(0, Math.min(1, bu.hp / Math.max(1, bu.hpMax)));
      hp.innerHTML = `<div class="grd-bar" role="progressbar" aria-label="Здоровье босса" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(k * 100)}"><i style="width:${(k * 100).toFixed(1)}%"></i><s style="left:33.3%"></s><s style="left:66.6%"></s><em>${Math.round(k * 100)}%</em></div>`
        + `<div class="grd-tags">${rd.armor ? '<span>🪨 панцирь</span>' : ''}${rd.poison ? `<span class="bad">☠️ яд ещё ${rd.poison} р.</span>` : ''}</div>`;
    } else hp.innerHTML = '';
    warn.innerHTML = rd && rd.warn ? `<b>${MECH_ICO[rd.warn.k] || '⚠️'} Босс готовит: ${esc(rd.warn.ru)}</b><small>${esc(rd.warn.mech)} - нужна команда «${esc((d.cmds[rd.warn.cmd] || {}).ru || rd.warn.cmd)}»</small>` : '';
    warn.hidden = !warn.innerHTML;
    evb.innerHTML = rd && rd.ev && rd.ev.length ? rd.ev.filter((x) => x.k !== 'w').slice(-3).map((x) => `<span class="${x.k === 'g' ? 'good' : x.k === 'b' ? 'bad' : ''}">${esc(x.t)}</span>`).join('') : '';

    const heroes = f ? f.units.filter((u) => u.side === 'p') : (d.joined || []).map((l) => ({ login: l, name: l, hp: 1, hpMax: 1 }));
    const me = d.me && d.me.joined;
    const lastHit = new Map(f && f.last ? f.last.hits.map((h) => [h.id, h.d]) : []);
    const MAX = innerWidth <= 760 ? 12 : 30;
    party.innerHTML = heroes.length ? `<div class="grd-grid">${heroes.slice(0, MAX).map((u) => {
      const k = u.hpMax ? Math.max(0, Math.min(1, u.hp / u.hpMax)) : 1, dl = lastHit.get(u.id);
      return `<div class="grd-h${u.hp > 0 ? '' : ' dead'}${u.login === (S.d.me && S.d.me.login) ? ' me' : ''}" title="${esc(u.name)}${u.role ? ' - ' + esc(ROLE_RU[u.role] || u.role) : ''}">`
        + `<span class="grd-fig">${heroFig(u)}</span><b>${esc(u.name)}</b>${f ? `<i class="grd-mini"><u style="width:${(k * 100).toFixed(0)}%"></u></i>` : ''}`
        + `${dl && S.lastR !== f.round ? `<em class="${dl > 0 ? 'heal' : ''}">${dl > 0 ? '+' : ''}${dl}</em>` : ''}</div>`;
    }).join('')}</div>${heroes.length > MAX ? `<p class="grd-more">и ещё ${heroes.length - MAX}</p>` : ''}` : '';
    if (f) S.lastR = f.round;
    panel.innerHTML = panelHtml(d);
    timers();
  }

  function rulesHtml(d) {
    const R = d.rules || {};
    return `<details class="grd-rules"><summary>Как устроен рейд</summary><ul>`
      + `<li>Назначает глава или руководство: не раньше чем через ${R.leadH || 12} ч и не чаще раза в ${R.every || 7} дн.</li>`
      + `<li>Вход открывается за ${R.openMin || 15} мин, войти можно до +${R.joinMin || 5} мин после начала. Нужно хотя бы ${R.min || 3} участника.</li>`
      + '<li>Каждый раунд выбирай действие. Босс заранее показывает, что готовит, - руководство отвечает командой: град - «Щиты!», удар по площади - «Отступить!», яд - «Лечение!», окно уязвимости - «Залп!» (бейте все!).</li>'
      + '<li>Потерь нет. Награда - по урону; босс повержен - золотой сундук «Подарка» всем участникам.</li></ul></details>';
  }
  function planForm(d) {
    const min = now() + ((d.rules && d.rules.leadH) || 12) * 3600e3 + 10 * 60e3, x = new Date(min + TZ);
    const dv = `${x.getUTCFullYear()}-${p2(x.getUTCMonth() + 1)}-${p2(x.getUTCDate())}`, tv = `${p2((x.getUTCHours() + 1) % 24)}:00`;
    return `<div class="grd-plan"><label>День<input type="date" name="d" value="${dv}" min="${dv}"></label><label>Время (МСК)<input type="time" name="t" value="${tv}" step="300"></label>`
      + `<button type="button" class="grd-btn acc" data-x="plan">${d.plan ? 'Перенести' : 'Назначить рейд'}</button></div>`;
  }
  function resHtml(res) {
    if (!res) return '';
    if (res.failed) return `<p class="grd-note">Прошлый рейд (${fmt(res.at)}) сорван: собралось ${res.n}.</p>`;
    return `<div class="grd-res"><h3>${res.win ? '🏆 Босс повержен!' : 'Босс устоял'}</h3>${res.win ? '<p class="grd-chest">🎁 Золотой сундук - во вкладке «Подарок» гильдии</p>' : ''}`
      + `<table><thead><tr><th>#</th><th>Игрок</th><th>Урон</th><th>Монеты</th></tr></thead><tbody>${(res.rows || []).slice(0, 10).map((x, i) => `<tr${x.login === (S.d.me && S.d.me.login) ? ' class="me"' : ''}><td>${i + 1}</td><td>${esc(x.login)}</td><td>${x.dealt}</td><td>${x.coins}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function panelHtml(d) {
    const g = d.guild, f = d.fight;
    if (f) {
      const my = f.my || {}, rd = f.rd;
      const acts = my.alive ? (my.acts || []).map((a) => `<button type="button" class="grd-a${my.act === a.id ? ' on' : ''}" data-a="${esc(a.id)}"${a.avail === false ? ' disabled' : ''}>${esc(a.name)}${a.cd ? ` <small>${a.cd}</small>` : ''}</button>`).join('') : '';
      const cmds = g.lead && d.me.joined ? Object.entries(d.cmds).map(([k, c]) => {
        const cd = rd.cd[k] || 0, hot = rd.warn && rd.warn.cmd === k;
        return `<button type="button" class="grd-c${rd.ord === k ? ' on' : ''}${hot ? ' hot' : ''}" data-c="${k}"${cd ? ' disabled' : ''} title="${esc(c.hint)}">${CMD_ICO[k] || ''} ${esc(c.ru)}${cd ? ` <small>${cd}</small>` : ''}</button>`;
      }).join('') : '';
      return `<div class="grd-card"><div class="grd-round"><b>Раунд ${f.round}</b><span class="grd-left" data-until="${f.until}"></span><small>действие прислали: ${f.acted.length}</small></div>`
        + (d.me.joined ? (my.alive ? `<div class="grd-acts">${acts}</div>` : '<p class="grd-note">Твой герой пал - смотри за боем, награда по урону всё равно будет.</p>')
          : (d.plan && now() < d.plan.closeAt ? '<button type="button" class="grd-btn acc" data-x="join">Войти в рейд</button>' : '<p class="grd-note">Рейд идёт без тебя: вход уже закрыт.</p>'))
        + (cmds ? `<div class="grd-cmdh">Команды руководства <small>(Q W E R)</small></div><div class="grd-cmds">${cmds}</div>` : '')
        + '</div>';
    }
    if (d.plan) {
      const p = d.plan, open = d.st === 'open' || now() >= p.openAt;
      return `<div class="grd-card"><h3>${esc(p.name)}</h3><p class="grd-look">${esc(p.look)}</p><p class="grd-trait">⭐ ${esc(p.trait)}</p>`
        + `<p class="grd-when">Начало - <b>${fmt(p.at)}</b> МСК · <span class="grd-left" data-until="${p.at}"></span></p>`
        + `<p class="grd-note">В рейде: ${(d.joined || []).length}${(d.joined || []).length < d.rules.min ? ` (нужно хотя бы ${d.rules.min})` : ''}</p>`
        + (d.me.joined ? '<p class="grd-ok">Ты в рейде - жди начала.</p>' : open ? '<button type="button" class="grd-btn acc" data-x="join">Войти в рейд</button>' : `<p class="grd-note">Вход откроется за ${d.rules.openMin} мин до начала.</p>`)
        + (g.lead ? (S.replan ? planForm(d) : '<div class="grd-btns"><button type="button" class="grd-btn" data-x="replan">Перенести</button><button type="button" class="grd-btn bad" data-x="cancel">Отменить рейд</button></div>') : '')
        + rulesHtml(d) + '</div>';
    }
    const nxt = d.next && d.next > now() ? `<p class="grd-note">Следующий рейд можно назначить с ${fmt(d.next)} МСК.</p>` : '';
    return `<div class="grd-card"><h3>Рейд не назначен</h3>${resHtml(d.res)}`
      + (g.lead ? `<p>Выбери день и время - всем участникам придёт объявление, за ${d.rules.openMin} мин - напоминание.</p>${nxt}${planForm(d)}` : `<p class="grd-note">Рейд назначает глава или руководство гильдии.</p>${nxt}`)
      + rulesHtml(d) + '</div>';
  }
  function timers() {
    if (!S.el) return;
    for (const x of S.el.querySelectorAll('[data-until]')) {
      const ms = +x.dataset.until - now();
      x.textContent = S.d && S.d.fight ? `${Math.max(0, Math.ceil(ms / 1000))} с` : ms > 0 ? `через ${dur(ms)}` : 'вот-вот';
    }
  }

  window.LGGuildRaid = { open, close, _bossArt: bossArt };
})();
