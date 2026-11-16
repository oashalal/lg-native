












(function () {
  'use strict';
  if (window.LGMailWin) return;
  let X = null, el = null, data = null, sel = '', mode = 'list', busy = false, lastFocus = null, phoneView = 'list';

  let tab = 'mail', FD = null, fsel = '';
  const FL = {};
  const $ = (s, r) => (r || el).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = (t, bad) => { if (X && X.toast) X.toast(t, bad); };
  const KIND = { game: 'Игра', admin: 'Администратор', streamer: 'Стример', guild: 'Гильдия', player: 'Игрок' };
  const pad = (n) => String(n).padStart(2, '0');
  const when = (t) => { const d = new Date(t), now = new Date(); return d.toDateString() === now.toDateString() ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const daysLeft = (t) => Math.max(0, Math.ceil((t - Date.now()) / 864e5));
  const coins = (n) => { const v = Math.max(0, Math.floor(+n || 0)), g = Math.floor(v / 10000), s = Math.floor(v / 100) % 100, b = v % 100, o = []; if (g) o.push(`${g} зол.`); if (s) o.push(`${s} сер.`); if (b || !o.length) o.push(`${b} бр.`); return o.join(' '); };
  const api = (p, body) => X.api(p, body);
  const cur = () => (data && data.list ? data.list.find((m) => m.id === sel) : null) || null;

  function build() {
    el = document.createElement('div');
    el.className = 'ml-win'; el.id = 'ml-win'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'ml-t');
    el.innerHTML = '<div class="ml-bar"><button type="button" class="ml-x" data-ml="close" aria-label="Закрыть почту"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>'
      + '<b class="ml-t" id="ml-t">Почта</b><span class="ml-tabs" role="tablist" aria-label="Разделы почты"></span><span class="ml-n" aria-live="polite"></span><span class="ml-tools"></span><button type="button" class="ml-c" data-ml="close">Закрыть</button></div>'
      + '<div class="ml-main"><nav class="ml-list" aria-label="Письма"></nav><section class="ml-view" aria-live="polite"></section></div>';
    el.addEventListener('click', onClick);
    el.addEventListener('submit', onSubmit);
    el.addEventListener('input', onInput);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el && !el.hidden) { e.preventDefault(); if (mode !== 'list') { mode = 'list'; render(); } else close(); } });
    document.body.appendChild(el);
  }

  

  let askDone = null;
  function ask(o) {
    if (askDone) askDone(null);
    const box = document.createElement('div');
    box.className = 'ml-ask';
    box.innerHTML = `<div class="ml-ask-c" role="alertdialog" aria-modal="true" aria-labelledby="ml-ask-t"><b id="ml-ask-t" class="ml-ask-t">${esc(o.title)}</b>`
      + (o.text ? `<p class="ml-ask-x">${esc(o.text)}</p>` : '')
      + (o.input ? `<textarea class="ml-ask-in" rows="3" maxlength="300" placeholder="${esc(o.ph || '')}"></textarea>` : '')
      + `<div class="ml-ask-b"><button type="button" class="ml-c" data-a="no">Отмена</button><button type="button" class="ml-c ${o.bad ? 'ml-ask-bad' : 'ml-ask-ok'}" data-a="yes">${esc(o.ok || 'Да')}</button></div></div>`;
    el.appendChild(box);
    const prev = document.activeElement;
    return new Promise((res) => {
      const done = (v) => { if (!askDone) return; askDone = null; document.removeEventListener('keydown', key, true); box.remove(); try { if (prev && prev.focus) prev.focus(); } catch {   } res(v); };
      const yes = () => done(o.input ? box.querySelector('.ml-ask-in').value.trim() : true);
      const key = (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(null); } else if (e.key === 'Enter' && !(o.input && e.shiftKey)) { if (!o.input || e.ctrlKey || e.metaKey || e.target.tagName !== 'TEXTAREA') { e.preventDefault(); e.stopPropagation(); yes(); } } };
      askDone = done;
      document.addEventListener('keydown', key, true);
      box.addEventListener('click', (e) => { e.stopPropagation(); const a = e.target.closest('[data-a]'); if (a) { if (a.dataset.a === 'yes') yes(); else done(null); } else if (e.target === box) done(null); });
      (box.querySelector('.ml-ask-in') || box.querySelector('[data-a="yes"]')).focus();
    });
  }

  async function load(keepSel) {
    const r = await api('/api/mail');
    if (!r || !r.ok) { data = data || { list: [] }; $('.ml-list').innerHTML = `<p class="ml-err">${esc((r && r.error) || 'Почта не загрузилась')}</p>`; return; }
    data = r;
    if (!keepSel || !cur()) sel = '';
    if (X.count) X.count(r.unread || 0, r.list.filter((m) => m.att === 'wait').length);
    if (!r.fights && tab === 'fight') tab = 'mail';
    if (tab === 'fight') return loadFights(true);
    render();
  }

  function tabsHtml() {
    if (!data || !data.fights) return '';
    const un = data.unread || 0, fu = FD ? FD.unread || 0 : data.fights.unread || 0;
    const t = (id, name, n) => `<button type="button" class="ml-tab${tab === id ? ' is-on' : ''}" role="tab" aria-selected="${tab === id}" data-ml="tab" data-tab="${id}">${name}${n ? `<i class="ml-tn" aria-label="новых ${n}">${n}</i>` : ''}</button>`;
    return t('mail', 'Письма', un) + t('fight', 'Бой', fu);
  }
  function render() {
    if (!el || !data) return;
    $('.ml-tabs').innerHTML = tabsHtml();
    el.dataset.tab = tab;
    if (tab === 'fight') return renderFights();
    const L = data.list || [];
    const unread = L.filter((m) => !m.read).length;
    $('.ml-n').textContent = L.length ? `${L.length} из ${data.max || 100}${unread ? ` · новых ${unread}` : ''}` : '';
    $('.ml-tools').innerHTML = (data.can && data.can.send ? '<button type="button" class="ml-b ml-pri" data-ml="compose">Написать</button>' : '')
      + (unread ? '<button type="button" class="ml-b" data-ml="readall">Прочитать все</button>' : '')
      + (data.can && data.can.streamer != null ? `<button type="button" class="ml-b" data-ml="streamer"${data.can.streamer > 0 ? '' : ' disabled'} title="Письмо игрокам своего канала: осталось сегодня ${data.can.streamer}">Письмо игрокам канала</button>` : '');
    $('.ml-list').innerHTML = L.length ? '<ul>' + L.map((m) => `<li><button type="button" class="ml-it${m.id === sel ? ' is-sel' : ''}${m.read ? '' : ' is-new'}" data-ml="open" data-id="${esc(m.id)}"${m.id === sel ? ' aria-current="true"' : ''}>`
      + `<span class="ml-k ml-k-${esc(m.k)}">${esc(KIND[m.k] || '')}</span><span class="ml-fn">${esc(m.fn)}</span><span class="ml-at">${esc(when(m.at))}</span>`
      + `<span class="ml-tt">${m.read ? '' : '<i class="ml-dot" aria-label="не прочитано"></i>'}${esc(m.title)}</span>${m.att === 'wait' || m.att === 'busy' ? '<span class="ml-att" title="Вложение ждёт">вложение</span>' : ''}</button></li>`).join('') + '</ul>'
      : `<p class="ml-empty">Писем пока нет. Письма хранятся ${esc(data.keepDays || 30)} дней.</p>`;
    const v = $('.ml-view');
    if (mode === 'compose') v.innerHTML = composeHtml();
    else if (mode === 'streamer') v.innerHTML = streamerHtml();
    else { const m = cur(); v.innerHTML = m ? letterHtml(m) : '<p class="ml-empty">Выбери письмо слева.</p>'; }
    el.classList.toggle('is-view', phoneView === 'view');
  }

  function letterHtml(m) {
    const items = (m.items || []).map(([id, n], i) => `${esc((m.names && m.names[i]) || id)} ×${esc(n)}`);
    const att = m.att ? `<div class="ml-attb${m.att === 'taken' ? ' is-done' : ''}"><b>Вложение</b><span>${[...(m.coins > 0 ? [esc(coins(m.coins))] : []), ...items].join(', ')}</span>`
      + (m.att === 'taken' ? '<span class="ml-ok">забрано</span>' : `<button type="button" class="ml-b ml-pri" data-ml="take" data-id="${esc(m.id)}"${m.att === 'busy' ? ' disabled' : ''}>${m.att === 'busy' ? 'Забирается…' : 'Забрать'}</button>`) + '</div>' : '';
    return `<button type="button" class="ml-b ml-back" data-ml="back">← Письма</button><article class="ml-l"><h2>${esc(m.title)}</h2>`
      + `<p class="ml-from">${esc(KIND[m.k] || '')}: <b>${esc(m.fn)}</b>${m.fl && m.fl !== String(m.fn).toLowerCase() ? ` <small>@${esc(m.fl)}</small>` : ''} · ${esc(when(m.at))} · ${m.att === 'wait' || m.att === 'busy' ? 'не удалится, пока вложение не забрано' : `удалится через ${daysLeft(m.exp)} дн.`}</p>`
      + `<div class="ml-body">${m.body ? esc(m.body).replace(/\n/g, '<br>') : '<span class="ml-mute">без текста</span>'}</div>${att}`
      + '<div class="ml-acts">' + (m.k === 'player' && m.fl ? `<button type="button" class="ml-b" data-ml="reply" data-to="${esc(m.fl)}">Ответить</button>` : '')
      + `<button type="button" class="ml-b" data-ml="del" data-id="${esc(m.id)}"${m.att === 'wait' || m.att === 'busy' ? ' disabled title="Сначала забери вложение"' : ''}>Удалить</button>`
      + (m.k === 'player' ? (m.rep ? '<span class="ml-mute">жалоба отправлена</span>' : `<button type="button" class="ml-b ml-bad" data-ml="report" data-id="${esc(m.id)}">Пожаловаться</button>`) : '') + '</div></article>';
  }
   
  const ROLE = { legionary: 'Легионер', paladin: 'Паладин', rogue: 'Разбойник', archer: 'Лучник', mage: 'Маг', priest: 'Жрец', necromancer: 'Некромант', recruit: 'Новобранец' };
  const TIER = ['слабая стая', 'обычная стая', 'сильная стая'];
  const pl = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; };
  const whenFull = (t) => { const d = new Date(t); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const placeText = (k, p) => {
    if (!p) return '';
    const where = p.bn ? `${p.bn}, у стен города` : 'У стен города';
    if (k === 'elite') return `${where} · элитный${p.en ? ` «${p.en}»` : ''}${p.tier != null ? (p.tier ? ' (посложнее)' : ' (попроще)') : ''}${p.lvl ? `, ${p.lvl} ур.` : ''} · группа из ${p.n || 1}`;
    return `${where} · ${TIER[p.tier == null ? 1 : p.tier] || 'стая'}${p.lvl ? `, ${p.lvl} ур.` : ''}`;
  };
  let cmP = null;
   
  function cmFiles() {
    if (window.LGCityMon) return Promise.resolve(true);
    if (cmP) return cmP;
    cmP = new Promise((ok) => { const s = document.createElement('script'); s.src = `/site/citymon.js?v=${(window.LG_SITEF || {})['citymon.js'] || ''}`; s.onload = () => ok(true); s.onerror = () => { cmP = null; ok(false); }; document.head.appendChild(s); });
    return cmP;
  }
  const figOf = (id) => { try { return window.LGCityMonArt && id ? window.LGCityMonArt.fig(id, {}) : ''; } catch (e) { return ''; } };
  async function loadFights(keep) {
    const r = await api('/api/mail/fights');
    if (!r || !r.ok) { FD = FD || { list: [] }; if (tab === 'fight') $('.ml-list').innerHTML = `<p class="ml-err">${esc((r && r.error) || 'Бои не загрузились')}</p>`; return; }
    FD = r; if (data && data.fights) data.fights.unread = r.unread || 0;
    if (!keep || !FD.list.some((m) => m.id === fsel)) fsel = '';
    render();
    void cmFiles().then((ok) => { if (ok && tab === 'fight') render(); });
  }
  function renderFights() {
    const L = (FD && FD.list) || [], un = L.filter((m) => !m.read).length;
    $('.ml-n').textContent = L.length ? `${L.length} из ${FD.max || 50}${un ? ` · новых ${un}` : ''}` : '';
    $('.ml-tools').innerHTML = un ? '<button type="button" class="ml-b" data-ml="freadall">Прочитать все</button>' : '';
    $('.ml-list').innerHTML = !FD ? '<p class="ml-empty">Загрузка…</p>' : L.length ? '<ul>' + L.map((m) => `<li><button type="button" class="ml-it ml-fit${m.id === fsel ? ' is-sel' : ''}${m.read ? '' : ' is-new'}" data-ml="fopen" data-id="${esc(m.id)}"${m.id === fsel ? ' aria-current="true"' : ''}>`
      + `<span class="ml-k ml-fr ${m.win ? 'is-win' : 'is-lose'}">${m.win ? 'Победа' : 'Поражение'}</span><span class="ml-fn">${m.kind === 'elite' ? `Элитный${m.place.en ? ` «${esc(m.place.en)}»` : ''}` : esc(TIER[m.place.tier == null ? 1 : m.place.tier] || 'Стая').replace(/^./, (c) => c.toUpperCase())}${m.place.lvl ? `, ${esc(m.place.lvl)} ур.` : ''}</span><span class="ml-at">${esc(when(m.at))}</span>`
      + `<span class="ml-tt">${m.read ? '' : '<i class="ml-dot" aria-label="не прочитано"></i>'}${esc(m.foes.join(', '))}</span></button></li>`).join('') + '</ul>'
      : `<p class="ml-empty">Боёв пока нет. После каждого боя у стен города сюда придёт письмо с итогом и записью боя. Хранятся последние ${esc(FD.max || 50)}, не дольше ${esc(FD.keepDays || 30)} дней.</p>`;
    const v = $('.ml-view'), m = fsel && FL[fsel];
    v.innerHTML = m ? fightHtml(m) : fsel ? '<p class="ml-empty">Загрузка…</p>' : '<p class="ml-empty">Выбери бой слева.</p>';
    el.classList.toggle('is-view', phoneView === 'view');
  }
  const pct = (v) => `${Math.round(+v || 0)}%`;
  function heroCard(u, i) {
    const st = [['Атака', u.atk], ...(u.mag > u.atk ? [['Магия', u.mag]] : []), ['Броня', u.def], ['Крит', u.crit != null ? pct(u.crit) : null], ['Сила крита', u.critDmg != null ? `+${pct(u.critDmg)}` : null],
      ['Уклонение', u.dodge != null ? pct(u.dodge) : null], ['Удача', u.luck != null ? Math.round(u.luck) : null]].filter((x) => x[1] != null && x[1] !== '');
    const hp = `${u.hp0}${u.hp1 != null && u.hp1 !== u.hp0 ? ` → ${u.hp1}` : ''} / ${u.hpMax}`;
    if (i > 0) return `<li class="ml-fu is-ally"><b>${esc(u.name)}</b><span>${esc(ROLE[u.cls] || u.cls || '')}, ${esc(u.lvl)} ур.</span><span>ХП ${esc(hp)}${u.fell ? ' · пал' : ''}</span><span>Атака ${esc(u.mag > u.atk ? u.mag : u.atk)} · броня ${esc(u.def)}</span></li>`;
    return `<li class="ml-fu is-me"><div class="ml-fh"><b>${esc(u.name)}</b><span>${esc(ROLE[u.cls] || u.cls || '')}, ${esc(u.lvl)} ур.</span></div>`
      + `<div class="ml-fhp"><span>Здоровье</span><b>${esc(hp)}</b>${u.fell ? '<small>пал - остался 1 ХП</small>' : ''}<i style="--p:${Math.round(100 * (u.hp1 != null ? u.hp1 : u.hp0) / Math.max(1, u.hpMax))}%"></i></div>`
      + `<dl class="ml-fst">${st.map(([k, x]) => `<div><dt>${k}</dt><dd>${esc(x)}</dd></div>`).join('')}</dl></li>`;
  }
  function foeCard(f) {
    return `<li class="ml-fu ml-foe${f.elite ? ' is-el' : ''}"><span class="ml-fpic" aria-hidden="true">${figOf(f.mon)}</span><div><div class="ml-fh"><b>${esc(f.name)}</b><span>${esc(f.lvl)} ур.${f.elite ? ' · <em>элитный</em>' : ''}</span></div>`
      + `<p class="ml-fl2">ХП ${esc(f.hp)} · удар ${esc(f.atk)} · броня ${esc(f.def)}${f.crit ? ` · крит ${esc(pct(f.crit))}` : ''}${f.dodge ? ` · уклонение ${esc(pct(f.dodge))}` : ''}</p>`
      + `${f.tr && f.tr.length ? `<p class="ml-fl2 ml-ftr">${f.tr.map(esc).join(' · ')}</p>` : ''}</div></li>`;
  }

  const side = (won) => (won ? 'is-won' : 'is-lost');
  const wl = (won) => ` <small class="ml-fwl">${won ? 'Победитель' : 'Проигравший'}</small>`;
  function fightHtml(m) {
    const h = m.head || {}, rw = h.rw || null, me = (h.team || [])[0] || null;
    const got = rw ? [rw.coins ? `${rw.coins} ${pl(rw.coins, 'монета', 'монеты', 'монет')}` : '', rw.xp ? `${rw.xp} опыта` : '', rw.item || rw.gearId ? 'трофей' : ''].filter(Boolean).join(', ') : '';
    const reward = rw && rw.over ? 'без награды - бои с наградой на сегодня кончились' : got || 'без награды';
    const wound = me && me.hp1 != null ? (me.fell ? `герой пал - осталось 1 ХП из ${me.hpMax} (не призрак, вещи целы)` : me.hp1 < me.hp0 ? `раны: ${me.hp0} → ${me.hp1} ХП из ${me.hpMax} (заживают сами)` : 'без ран') : '';
    return `<button type="button" class="ml-b ml-back" data-ml="back">← Бои</button><article class="ml-l ml-fl">`
      + `<div class="ml-fres ${m.win ? 'is-win' : 'is-lose'}" role="status"><h2>${m.win ? 'Победа' : 'Поражение'}</h2><span>${m.kind === 'elite' ? 'бой с элитным' : 'бой у стен'}</span></div>`
      + `<p class="ml-from">${esc(whenFull(m.at))} · ${esc(placeText(m.kind, h.place))} · ${esc(h.rounds || 0)} ${pl(h.rounds || 0, 'раунд', 'раунда', 'раундов')}${h.turns ? `, ${esc(h.turns)} ${pl(h.turns, 'ход', 'хода', 'ходов')}` : ''}</p>`
      + `<div class="ml-fcols"><section class="ml-fside ${side(m.win)}" aria-label="Твой отряд"><h3>Твой отряд${wl(m.win)}</h3><ul>${(h.team || []).map(heroCard).join('')}</ul></section>`
      + `<section class="ml-fside ${side(!m.win)}" aria-label="Монстры"><h3>Монстры${wl(!m.win)}</h3><ul>${(h.foes || []).map(foeCard).join('')}</ul></section></div>`
      + `<div class="ml-frw ${m.win ? 'is-win' : 'is-lose'}"><span><b>Награда:</b> ${esc(reward)}</span>${wound ? `<span>${esc(wound)}</span>` : ''}<small>Характеристики - на момент боя.</small></div>`
      + `<div class="ml-acts"><button type="button" class="ml-b ml-pri" data-ml="replay" data-id="${esc(m.id)}">Посмотреть запись боя</button><button type="button" class="ml-b" data-ml="fdel" data-id="${esc(m.id)}">Удалить</button>`
      + `<span class="ml-mute">удалится через ${daysLeft(m.exp)} дн.</span></div></article>`;
  }

  function lim() { return (data && data.lim) || { title: 60, body: 1000 }; }
  function composeHtml(to, title) {
    const l = lim();
    return '<button type="button" class="ml-b ml-back" data-ml="back">← Письма</button><form class="ml-f" data-f="send"><h2>Письмо игроку</h2>'
      + `<label>Кому (ник)<input name="to" required maxlength="25" autocomplete="off" spellcheck="false" value="${esc(to || '')}"></label>`
      + `<label>Тема<input name="title" required maxlength="${l.title}" value="${esc(title || '')}"></label>`
      + `<label>Текст <small class="ml-cnt" data-max="${l.body}">0 / ${l.body}</small><textarea name="text" required rows="8" maxlength="${l.body}"></textarea></label>`
      + '<p class="ml-mute">Только текст: монеты и вещи письмом не передать. Ссылки нельзя. Лимит писем в сутки.</p>'
      + '<div class="ml-acts"><button type="submit" class="ml-b ml-pri">Отправить</button><button type="button" class="ml-b" data-ml="back">Отмена</button></div></form>';
  }
  function streamerHtml() {
    const l = lim();
    return '<button type="button" class="ml-b ml-back" data-ml="back">← Письма</button><form class="ml-f" data-f="streamer"><h2>Письмо игрокам канала</h2>'
      + '<fieldset><legend>Кому</legend><label class="ml-r"><input type="radio" name="who" value="all" checked> всем игрокам канала</label><label class="ml-r"><input type="radio" name="who" value="list"> списком ников</label>'
      + '<input name="to" placeholder="ник, ник, ник" maxlength="4000" autocomplete="off" spellcheck="false" aria-label="Ники через запятую"></fieldset>'
      + `<label>Тема<input name="title" required maxlength="${l.title}"></label>`
      + `<label>Текст <small class="ml-cnt" data-max="${l.body}">0 / ${l.body}</small><textarea name="text" required rows="8" maxlength="${l.body}"></textarea></label>`
      + `<p class="ml-mute">Только текст, без вложений. Сегодня осталось писем: ${esc(data.can.streamer)}.</p>`
      + '<div class="ml-acts"><button type="submit" class="ml-b ml-pri">Отправить</button><button type="button" class="ml-b" data-ml="back">Отмена</button></div></form>';
  }

  function onInput(e) {
    const t = e.target; if (!t || t.name !== 'text') return;
    const c = t.form && t.form.querySelector('.ml-cnt'); if (c) c.textContent = `${[...t.value].length} / ${c.dataset.max}`;
  }
  async function onClick(e) {
    const b = e.target.closest('[data-ml]'); if (!b || !el.contains(b) || b.disabled) return;
    const k = b.dataset.ml;
    if (k === 'close') return close();
    if (k === 'back') { mode = 'list'; phoneView = 'list'; return render(); }
    if (k === 'tab') { const t = b.dataset.tab === 'fight' ? 'fight' : 'mail'; if (t === tab) return; tab = t; mode = 'list'; phoneView = 'list'; render(); if (tab === 'fight') return loadFights(true); return; }
    if (k === 'fopen') {
      fsel = b.dataset.id; phoneView = 'view'; render();
      const it = (FD.list || []).find((x) => x.id === fsel);
      if (!FL[fsel]) { const r = await api('/api/mail/fight?id=' + encodeURIComponent(fsel)); if (!r || !r.ok) { toast((r && r.error) || 'письмо не открылось', true); return; } FL[r.id] = r; if (fsel === r.id) render(); }
      if (it && !it.read) { it.read = true; FD.unread = Math.max(0, (FD.unread || 1) - 1); render(); const r = await api('/api/mail/fights/read', { ids: [it.id] }); if (r && r.ok) { FD.unread = r.unread; if (data.fights) data.fights.unread = r.unread; render(); } }
      const h = $('.ml-view h2'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: false }); }
      return;
    }
    if (k === 'replay') {
      const id = b.dataset.id; b.disabled = true; const t0 = b.textContent; b.textContent = 'Загружаю запись…';
      const [r, ok] = await Promise.all([api('/api/mail/fight?rec=1&id=' + encodeURIComponent(id)), cmFiles()]);
      b.disabled = false; b.textContent = t0;
      if (!r || !r.ok) return toast((r && r.error) || 'запись не открылась', true);
      if (!ok || !window.LGCityMon || !window.LGCityMon.replay) return toast('Поле боя не загрузилось - проверь связь', true);
      const h = r.head || {};
      window.LGCityMon.replay(r.rec, { title: `Запись боя - ${r.win ? 'победа' : 'поражение'}`, sub: `${whenFull(r.at)} · ${placeText(r.kind, h.place)}` });
      return;
    }
    if (k === 'open') {
      sel = b.dataset.id; mode = 'list'; phoneView = 'view'; render();
      const m = cur();
      if (m && !m.read) { m.read = true; render(); const r = await api('/api/mail/read', { ids: [m.id] }); if (r && r.ok && X.count) X.count(r.unread, (data.list || []).filter((x) => x.att === 'wait').length); }
      const h = $('.ml-view h2'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: false }); }
      return;
    }
    if (k === 'compose' || k === 'reply') {
      mode = 'compose'; phoneView = 'view'; render();
      if (k === 'reply') { const m = cur(); $('.ml-view').innerHTML = composeHtml(b.dataset.to, m ? ('Re: ' + m.title).slice(0, lim().title) : ''); }
      const f = $('.ml-view input[name="' + (k === 'reply' ? 'text' : 'to') + '"]') || $('.ml-view textarea'); if (f) f.focus();
      return;
    }
    if (k === 'streamer') { mode = 'streamer'; phoneView = 'view'; render(); const f = $('.ml-view input[name="title"]'); if (f) f.focus(); return; }
    if (busy) return;
    if (k === 'freadall') { busy = true; const r = await api('/api/mail/fights/read', { all: true }); busy = false; if (r && r.ok) return loadFights(true); return toast((r && r.error) || 'не вышло', true); }
    if (k === 'fdel') {
      if (!(await ask({ title: 'Удалить письмо о бое?', text: 'Письмо и запись боя удалятся насовсем.', ok: 'Удалить', bad: true }))) return;
      busy = true; const r = await api('/api/mail/fights/del', { ids: [b.dataset.id] }); busy = false;
      if (r && r.ok) { delete FL[b.dataset.id]; fsel = ''; phoneView = 'list'; return loadFights(); }
      return toast((r && r.error) || 'не вышло', true);
    }
    if (k === 'readall') { busy = true; const r = await api('/api/mail/read', { all: true }); busy = false; if (r && r.ok) await load(true); else toast((r && r.error) || 'не вышло', true); return; }
    if (k === 'take') {
      busy = true; b.disabled = true; b.textContent = 'Забирается…';
      const r = await api('/api/mail/take', { id: b.dataset.id }); busy = false;
      if (r && r.ok) { toast(r.already ? 'Вложение уже было выдано' : `Забрано: ${[...(r.coins ? [coins(r.coins)] : []), ...(r.items || [])].join(', ')}${r.store ? ` (на склад - ${r.store} шт.)` : ''}`); if (X.hero) X.hero(); }
      else toast((r && r.error) || 'не вышло', true);
      return load(true);
    }
    if (k === 'del') {
      const m0 = cur();
      if (!(await ask({ title: 'Удалить письмо?', text: m0 && m0.att === 'wait' ? 'Во вложении есть награда - она пропадёт вместе с письмом.' : 'Письмо удалится насовсем.', ok: 'Удалить', bad: true }))) return;
      busy = true; const r = await api('/api/mail/del', { ids: [b.dataset.id] }); busy = false;
      if (r && r.ok) { if (r.note) toast(r.note, true); sel = ''; phoneView = 'list'; return load(); }
      return toast((r && r.error) || 'не вышло', true);
    }
    if (k === 'report') {
      const why = await ask({ title: 'Пожаловаться на письмо', text: 'Модераторы канала увидят это письмо. Что не так?', input: true, ph: 'Можно оставить пустым', ok: 'Отправить жалобу', bad: true });
      if (why == null) return;
      busy = true; const r = await api('/api/mail/report', { id: b.dataset.id, reason: why }); busy = false;
      if (r && r.ok) { toast('Жалоба отправлена модераторам'); return load(true); }
      return toast((r && r.error) || 'не вышло', true);
    }
  }
  async function onSubmit(e) {
    const f = e.target.closest('form[data-f]'); if (!f) return;
    e.preventDefault(); if (busy) return;
    const v = (n) => { const x = f.elements.namedItem(n); return x ? x.value : ''; };
    const btn = f.querySelector('button[type="submit"]'); busy = true; if (btn) btn.disabled = true;
    let r;
    if (f.dataset.f === 'send') r = await api('/api/mail/send', { to: v('to').trim(), title: v('title'), text: v('text') });
    else { const who = (f.querySelector('input[name="who"]:checked') || {}).value; r = await api('/api/mail/streamer', { to: who === 'list' ? v('to') : 'all', title: v('title'), text: v('text') }); }
    busy = false; if (btn) btn.disabled = false;
    if (!r || !r.ok) return toast((r && r.error) || 'не отправлено', true);
    toast(f.dataset.f === 'send' ? `Письмо отправлено: ${r.to ? r.to.name || r.to.login : ''}` : `Отправлено писем: ${r.sent}${r.skipped ? `, без героя или аккаунта - ${r.skipped}` : ''}`);
    mode = 'list'; phoneView = 'list'; return load(true);
  }



  let dim = null, wopen = false;
  function winMode(on) {
    const R = document.documentElement;
    if (on && !dim) { dim = document.createElement('div'); dim.className = 'ml-dim'; dim.addEventListener('click', () => close()); document.body.appendChild(dim); }
    if (dim) dim.hidden = !on;
    if (on) { wopen = !R.classList.contains('gu-wopen'); if (wopen && R.classList.contains('gu')) R.classList.add('gu-wopen'); else wopen = false; }
    else if (wopen) { wopen = false; if (!document.querySelector('.tab.gu-win')) R.classList.remove('gu-wopen'); }
    setTimeout(() => { try { if (window.LGDm) window.LGDm.place(); if (window.LGChatOne) window.LGChatOne.place(); } catch (e) {   } }, 0);
  }
  function open(hooks, o) {
    X = hooks; if (!el) build();
    lastFocus = document.activeElement;
    el.hidden = false; document.documentElement.classList.add('ml-open');
    winMode(true);
    mode = 'list'; phoneView = 'list'; data = data || { list: [] };
    render();
    load(true).then(() => { if (o && o.compose) { mode = 'compose'; phoneView = 'view'; render(); const i = $('.ml-view input[name="to"]'); if (i) { i.value = String(o.compose); $('.ml-view input[name="title"]').focus(); } } });
    setTimeout(() => { const x = $('.ml-x'); if (x && !el.hidden) x.focus({ preventScroll: true }); }, 0);
  }
  function close() {
    if (!el || el.hidden) return;
    el.hidden = true; document.documentElement.classList.remove('ml-open');
    winMode(false);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {   } }
  }
   
  function onEvent() { if (el && !el.hidden && mode === 'list') load(true); }
  window.LGMailWin = { open, close, onEvent, isOpen: () => !!el && !el.hidden };
})();
