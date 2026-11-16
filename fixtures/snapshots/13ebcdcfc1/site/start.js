








(function () {
  'use strict';
  let H = null;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ls = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch {} } };
  const chUrl = (l) => `/c/${encodeURIComponent(l)}/`;
  const me = () => (H && H.me()) || null;
  const curLogin = () => (H && H.ch ? String(H.ch.login).toLowerCase() : '');
  const ownLogin = () => { const m = me(); return m && m.own ? String(m.own.login).toLowerCase() : ''; };

   
  let swEl = null, lastViewerTab = 'hero';

  const one = () => { const m = me(); return !!(m && m.user && m.roleSw && m.onePult); };


  const adm = () => { const m = me(); return !!(m && m.user && m.admin); };


  const chanHere = () => { const own = ownLogin(), cur = curLogin(); return !!(cur && own !== cur && H.smOk() && H.smMode); };
  const admBtn = () => `<button type="button" class="rs-adm" data-role="settings" title="${chanHere() ? `Настройки этого канала (${esc(curLogin())}): пульт канала` : 'Режим «Админ» (все каналы): глобальные настройки, доступ к модулям, правила, обновления'}" aria-label="Настройки"><span class="rs-adm-i" aria-hidden="true">⚙</span><span class="rs-adm-t">Настройки</span></button>`;
  function swRender() {
    const m = me();
    if (!swEl) swEl = $('#roleSw');
    if (!swEl) return;


    const on = !!(m && m.user && m.roleSw) && !!(ownLogin() || m.ownNew || otherCh());
    const a = adm();
    swEl.hidden = !on && !a;
    swEl.classList.toggle('role-one', on || a);

    const tb = $('.tabs button[data-tab="streamer"]'); if (tb && m && m.user && m.roleSw) tb.hidden = true;
    document.documentElement.classList.toggle('has-roles', on || a);
    if (!on && !a) { swEl.innerHTML = ''; return; }
    if (!on) { swEl.setAttribute('aria-label', 'Настройки'); swEl.innerHTML = admBtn(); return; }
    const sm = H.curTab() === 'streamer';


    if (otherCh()) {
      const sbx = !!(H.ch && H.ch.sbx), nm = sbx ? 'Песочницы' : String((H.ch && (H.ch.name || H.ch.login)) || curLogin());
      swEl.setAttribute('aria-label', 'Пульт игры ' + nm);
      swEl.innerHTML = `<button type="button" data-role="streamer" data-ch="${esc(curLogin())}" class="rs-fs${sbx ? ' rs-sbx' : ''}" aria-pressed="false" title="Пульт игры канала ${esc(nm)} - отдельным окном">${sbx ? '🧪 Пульт Песочницы' : 'Пульт: ' + esc(nm)}</button>` + (a ? admBtn() : '');
      return;
    }


    if (gp()) {
      const own = !fsWay();
      swEl.setAttribute('aria-label', own ? 'Пульт игры' : 'Для стримеров');
      swEl.innerHTML = `<button type="button" data-role="streamer" class="rs-fs" aria-pressed="false" title="${own ? 'Пульт игры своего канала - отдельным окном' : 'Вести игру у себя на стриме'}">${own ? 'Пульт игры' : 'Для стримеров'}</button>` + (a ? admBtn() : '');
      return;
    }

    swEl.setAttribute('aria-label', 'Начать игру');
    swEl.innerHTML = `<button type="button" data-role="streamer" aria-pressed="${sm}" title="${ownLogin() ? 'Пульт игры своего канала - отдельным окном: поход, «Стрим сейчас», OBS' : 'Создать свой канал и начать игру'}">Начать игру</button>` + (a ? admBtn() : '');
  }


  function toSettings() {
    const own = ownLogin(), cur = curLogin();
    if (chanHere()) { H.smMode(''); return; }
    if (!own || own !== cur || !H.smOk() || !H.smMode) { location.href = chUrl(own || cur) + '#adm'; return; }
    H.smMode('admin', 'md:adm');
  }
  function swNote(text) {
    let n = $('#roleNote');
    if (!n) { n = document.createElement('div'); n.id = 'roleNote'; n.className = 'role-note'; n.setAttribute('role', 'status'); document.body.appendChild(n); }
    const r = swEl.getBoundingClientRect();
    n.textContent = text; n.hidden = false;
    n.style.top = Math.round(r.bottom + 8) + 'px';
    n.style.left = Math.max(12, Math.min(window.innerWidth - 12 - Math.min(320, window.innerWidth - 24), r.right - Math.min(320, window.innerWidth - 24))) + 'px';
    clearTimeout(swNote.t); swNote.t = setTimeout(() => { n.hidden = true; }, 6000);
  }
  function toStreamer() {

    if (otherCh()) {
      const c = curLogin();
      if (gpOpen(c)) return;
      ss.set('lgPopNote', '1'); popNote();
      if (H.smOk()) H.tab('streamer'); else swNote('Пульт сейчас недоступен - обнови страницу через минуту.');
      return;
    }
    const own = ownLogin();
    if (!own) {
      const m = me();


      if (!(m && m.ownNew)) { swNote(`Твой канал ещё не подключён к игре. Как только он появится, здесь откроется ${one() ? 'пульт игры' : 'режим стримера'}.`); return; }


      if (!toStreamer.busy) { if (gp()) forStreamers(); else ownConfirm(m.user && (m.user.name || m.user.login) || ''); }
      return;
    }

    if (invPend() && gp()) { if (!toStreamer.busy) forStreamers(); return; }
    ls.set('lgRole', 'streamer');



    const tutHere = !!(TU && TU.s && TU.s.k === 'start') && cpOn() && own !== curLogin();
    if (gpOpen(own)) { if (tutHere) { tutQuietDone(); location.href = chUrl(own); } return; }
    ss.set('lgPopNote', '1');
    if (own !== curLogin()) { location.href = chUrl(own) + '#streamer'; return; }
    popNote();
    if (!H.smOk()) { swNote(`${one() ? 'Пульт игры' : 'Режим стримера'} сейчас недоступен - обнови страницу через минуту.`); return; }
    H.tab('streamer');
  }

  const gp = () => { const m = me(); return !!(m && m.gamePult); };


  const otherCh = () => { const m = me(), cur = curLogin(); return !!(m && m.user && m.streamer && cur && cur !== ownLogin()); };


  const invPend = () => { const m = me(); return !!(m && m.invited && ownLogin() && !m.chBot); };

  const fsWay = () => !ownLogin() || invPend();
  function gpOpen(own, w, first) {
    const u = `/c/${encodeURIComponent(own)}/pult${first ? '#first' : ''}`;
    try { if (w) w.location.href = u; else w = window.open(u, 'legion-pult-' + own, 'popup=yes,width=440,height=860'); } catch (e) { w = null; void e; }
    if (w) { try { w.focus(); } catch (e) { void e; } return true; }
    return false;
  }

  function popNote() {
    if (ss.get('lgPopNote') !== '1' || !swEl || swEl.hidden) return;
    ss.set('lgPopNote', '');
    swNote('Разреши всплывающие окна для сайта, чтобы пульт открывался отдельным окном.');
  }

  function ownConfirm(nick) {
    if (document.getElementById('ownNewDlg')) return;
    const M = modal('wz-own', 'Создать свой канал');
    M.back.id = 'ownNewDlg';
    M.box.innerHTML = `<div class="wz-h"><h2>Создать свой канал ${esc(nick)}?</h2><button type="button" class="wz-x" data-x aria-label="Отмена">×</button></div>
      <p class="wz-t">Ты станешь стримером в игре «Легион»: у твоего канала появятся свой сайт, пульт игры и оверлей для OBS. Зрители будут играть у тебя на стриме.</p>
      <p class="wz-t wz-note" data-err hidden></p>
      <div class="wz-f"><button type="button" class="btn ghost" data-x>Отмена</button><button type="button" class="btn primary" data-ok>Создать</button></div>`;
    const ok = M.box.querySelector('[data-ok]'), err = M.box.querySelector('[data-err]');
    const done = () => { if (!toStreamer.busy) M.close(); };
    M.box.addEventListener('wz-esc', done);
    M.back.addEventListener('click', (e) => { if (e.target === M.back) done(); });
    M.box.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [...M.box.querySelectorAll('button:not([disabled])')]; if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    M.box.addEventListener('click', (e) => {
      const q = (k) => { const x = e.target.closest(k); return x && M.box.contains(x) ? x : null; };
      if (q('[data-x]')) { done(); return; }
      if (!q('[data-ok]') || toStreamer.busy) return;
      toStreamer.busy = true; ok.disabled = true; ok.textContent = 'Создаём…'; err.hidden = true;

      let pw = null;
      if (gp()) { try { pw = window.open('', 'legion-pult-new', 'popup=yes,width=440,height=860'); } catch (e) { pw = null; void e; } }
      H.api('/api/ownchannel', {}).then((r) => {
        toStreamer.busy = false;
        if (r && r.ok && r.login && pw) { const l = String(r.login).toLowerCase(); ls.set('lgRole', 'streamer'); gpOpen(l, pw); M.close(); if (l !== curLogin()) { tutQuietDone(); location.href = chUrl(l); } return; }
        if (pw) { try { pw.close(); } catch (e) { void e; } }
        if (r && r.ok && r.login) { ls.set('lgRole', 'streamer'); tutQuietDone(); location.href = chUrl(String(r.login).toLowerCase()) + '#streamer'; return; }
        ok.disabled = false; ok.textContent = 'Создать';
        err.textContent = r && r.error === 'rate_limited' ? 'Слишком часто - попробуй через несколько минут.' : 'Не получилось создать канал - попробуй ещё раз позже.';
        err.hidden = false;
      });
    });
    setTimeout(() => { try { ok.focus(); } catch {} }, 0);
  }



  function forStreamers() {
    if (document.getElementById('fsDlg')) return;
    const M = modal('wz-own wz-fs', 'Для стримеров');
    M.back.id = 'fsDlg';
    M.box.innerHTML = `<div class="wz-h"><h2>Игра на твоём стриме</h2><button type="button" class="wz-x" data-x aria-label="Отмена">×</button></div>
      <p class="wz-t">Зрители твоего канала играют прямо из чата Twitch: ты сможешь собирать отряд, отправляться с чатом в походы, бить боссов.</p>
      <ul class="wz-fsl"><li>У твоего канала появится свой Город и доступ к карте мира</li><li>Тебе откроется пульт игры и оверлей для OBS</li><li>Это бесплатно, отключить можно в любой момент</li></ul>
      <p class="wz-t wz-note" data-err hidden></p>
      <div class="wz-f wz-fsf"><button type="button" class="btn primary" data-ok>Стать стримером</button><button type="button" class="btn ghost" data-x>Отмена</button></div>`;
    const ok = M.box.querySelector('[data-ok]'), err = M.box.querySelector('[data-err]');
    const done = () => { if (!toStreamer.busy) M.close(); };
    M.box.addEventListener('wz-esc', done);
    M.back.addEventListener('click', (e) => { if (e.target === M.back) done(); });
    M.box.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [...M.box.querySelectorAll('button:not([disabled])')]; if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    M.box.addEventListener('click', (e) => {
      const q = (k) => { const x = e.target.closest(k); return x && M.box.contains(x) ? x : null; };
      if (q('[data-x]')) { done(); return; }
      if (!q('[data-ok]') || toStreamer.busy) return;
      toStreamer.busy = true; ok.disabled = true; ok.textContent = 'Подключаем…'; err.hidden = true;

      let pw = null;
      try { pw = window.open('', 'legion-pult-new', 'popup=yes,width=440,height=860'); } catch (er) { pw = null; void er; }
      H.api('/api/ownchannel', {}).then((r) => {
        toStreamer.busy = false;
        if (r && r.ok && r.login) {
          const l = String(r.login).toLowerCase();
          ls.set('lgRole', 'streamer');
          const pult = `/c/${encodeURIComponent(l)}/pult`;


          const to = r.twitch ? `/auth/twitch/connect?next=${encodeURIComponent(pult + '?tw=1')}` : pult;
          if (pw) { try { pw.location.href = to; pw.focus(); } catch (er) { void er; } }
          M.close();

          if (l !== curLogin() || !pw) tutQuietDone();
          if (!pw) { location.href = to; return; }
          if (l !== curLogin()) location.href = chUrl(l); else { const m = me(); if (m) { m.own = { login: l, name: l }; if (!r.twitch) m.chBot = true; } swRender(); }
          return;
        }
        if (pw) { try { pw.close(); } catch (er) { void er; } }
        ok.disabled = false; ok.textContent = 'Стать стримером';
        err.textContent = r && r.error === 'rate_limited' ? 'Слишком часто - попробуй через несколько минут.' : 'Не получилось - попробуй ещё раз позже.';
        err.hidden = false;
      });
    });
    setTimeout(() => { try { ok.focus(); } catch (er) { void er; } }, 0);
  }
  function toViewer() {
    ls.set('lgRole', 'viewer');
    if (H.curTab() === 'streamer') H.tab(lastViewerTab && lastViewerTab !== 'streamer' ? lastViewerTab : 'hero');
    swRender();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('#roleSw [data-role]'); if (!b) return;
    if (b.dataset.role === 'settings') toSettings(); else if (b.dataset.role === 'streamer') toStreamer(); else toViewer();
  });

   
  const F = { el: null, from: null, q: '', res: null, busy: false, err: '', list: null, listErr: '', t: 0, ctl: null, cache: new Map() };
  function findOpen(btn) {
    findClose(false);
    const el = document.createElement('div');
    el.className = 'pop sf-pop'; el.id = 'sfPop'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Стримеры');
    el.innerHTML = `<label class="sf-q"><span class="sr-only">Найти стримера по нику</span>
        <input type="search" id="sfQ" placeholder="Найти стримера по нику" autocomplete="off" spellcheck="false" maxlength="25" enterkeyhint="search"></label>
      <div class="sf-res" id="sfRes" aria-live="polite"></div><div class="sf-my" id="sfMy"></div>`;
    document.body.appendChild(el);
    Object.assign(F, { el, from: btn });
    btn.setAttribute('aria-expanded', 'true');
    const inp = $('#sfQ', el);
    inp.value = F.q;
    inp.addEventListener('input', () => findInput(inp.value));
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const a = $('#sfRes a', el); if (a) { e.preventDefault(); a.click(); } }
      if (e.key === 'ArrowDown') { const a = $('#sfRes a, #sfMy a', el); if (a) { e.preventDefault(); a.focus(); } }
    });
    el.addEventListener('click', findClick);
    findRender(); findPlace();
    listLoad();
    setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch {} }, 0);
  }
  function findClose(back) {
    if (!F.el) return;
    F.el.remove(); F.el = null;
    clearTimeout(F.t); if (F.ctl) { try { F.ctl.abort(); } catch {} F.ctl = null; }
    if (F.from) { F.from.setAttribute('aria-expanded', 'false'); if (back) try { F.from.focus(); } catch {} }
  }
  function findPlace() {
    const el = F.el, b = F.from; if (!el || !b) return;
    const r = b.getBoundingClientRect(), w = Math.min(340, window.innerWidth - 24);
    el.style.width = w + 'px';
    el.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left)) + 'px';
    el.style.top = Math.round(r.bottom + 8) + 'px';
    el.style.maxHeight = Math.max(220, window.innerHeight - r.bottom - 24) + 'px';
  }

  function findInput(v) {
    const q = String(v || '').trim().toLowerCase().replace(/^@/, '');
    F.q = v; clearTimeout(F.t);
    if (q.length < 2) { F.res = null; F.err = ''; F.busy = false; findRender(); return; }
    if (F.cache.has(q)) { F.res = F.cache.get(q); F.err = ''; F.busy = false; findRender(); return; }
    F.busy = true; findRender();
    F.t = setTimeout(() => {
      if (F.ctl) { try { F.ctl.abort(); } catch {} }
      const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null; F.ctl = ctl;
      fetch((window.LG_BASE || '') + '/api/find?q=' + encodeURIComponent(q), ctl ? { signal: ctl.signal } : {})
        .then((r) => r.json().then((d) => ({ st: r.status, d })))
        .then(({ st, d }) => {
          if (F.ctl !== ctl) return;
          F.busy = false; F.ctl = null;
          if (d && d.ok) { F.res = d.list || []; F.err = ''; F.cache.set(q, F.res); if (F.cache.size > 50) F.cache.delete(F.cache.keys().next().value); }
          else F.err = st === 429 ? 'Слишком часто - подожди пару секунд' : 'Поиск не ответил';
          findRender();
        })
        .catch((e) => { if (e && e.name === 'AbortError') return; F.busy = false; F.err = 'Нет связи с сайтом'; findRender(); });
    }, 300);
  }
  function listLoad() {
    const m = me();
    if (!m || !m.user) { F.list = null; findRender(); return; }
    H.api('/api/mylist').then((r) => { if (r && r.ok) { F.list = r.list || []; F.listErr = ''; } else F.listErr = 'Список не загрузился'; findRender(); });
  }
  function listAct(act, ch, extra) {
    return H.api('/api/mylist', Object.assign({ act, ch }, extra || {})).then((r) => {
      if (r && r.ok) { F.list = r.list || []; findRender(); return true; }
      H.toast((r && r.error === 'rate_limited') ? 'Слишком часто - подожди немного' : 'Не вышло - попробуй ещё раз', true); return false;
    });
  }
  const liveTag = (c) => (c.live ? '<span class="pop-live"><i aria-hidden="true"></i>в эфире</span>' : '');
  const SVG = {
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v7"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
    dn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  };

  function admItem() {
    const own = ownLogin(); if (!adm() || !own) return '';
    const on = curLogin() === own && /^#adm(in)?$/.test(location.hash);
    return `<p class="pop-h">Админ</p><ul class="pop-l"><li><a class="pop-ch sf-adm" data-adm href="${chUrl(own)}#admin"${on ? ' aria-current="page"' : ''} title="Общие настройки для всех каналов: глобальные настройки, обновления, ивенты, новости"><span class="pop-n"><span aria-hidden="true">⚙ </span>Админ - все каналы</span></a></li></ul><hr class="pop-sep">`;
  }
  function findRender() {
    const el = F.el; if (!el) return;
    const cur = curLogin(), q = String(F.q || '').trim();
    const res = $('#sfRes', el);
    if (q.replace(/^@/, '').length < 2) res.innerHTML = q ? '<p class="pop-e">Ещё хотя бы одна буква</p>' : '';
    else if (F.err) res.innerHTML = `<p class="pop-e">${esc(F.err)}</p>`;
    else if (F.busy && !F.res) res.innerHTML = '<p class="pop-e">Ищем…</p>';
    else if (F.res && !F.res.length) res.innerHTML = '<p class="pop-e">Таких стримеров в игре нет</p>';
    else if (F.res) res.innerHTML = `<p class="pop-h">Найдено</p><ul class="pop-l">${F.res.map((c) => `<li><a class="pop-ch" href="${chUrl(c.login)}" data-open="${esc(c.login)}"${c.login.toLowerCase() === cur ? ' aria-current="page"' : ''}><span class="pop-n" title="${esc(c.name)}">${esc(c.name)}</span>${liveTag(c)}</a></li>`).join('')}</ul>`;
    const my = $('#sfMy', el), m = me();
    let h = '';
    if (!m || !m.user) h = '<p class="pop-e">Войди через Twitch - здесь будут каналы, которые ты открывал, и те, где у тебя есть герой.</p>';
    else if (F.listErr) h = `<p class="pop-e">${esc(F.listErr)}</p>`;
    else if (!F.list) h = '<p class="pop-e">Загружаем твой список…</p>';
    else if (!F.list.length) h = '<p class="pop-e">Твой список пуст: найди стримера по нику - он появится здесь.</p>';
    else {
      const pins = F.list.filter((c) => c.pinned);
      h = `<p class="pop-h">Мой список</p><ul class="pop-l sf-l">${F.list.map((c) => {
        const pi = c.pinned ? pins.indexOf(c) : -1;
        return `<li class="sf-it${c.pinned ? ' is-pin' : ''}"><a class="pop-ch" href="${chUrl(c.login)}"${c.login.toLowerCase() === cur ? ' aria-current="page"' : ''}><span class="pop-n" title="${esc(c.name)}">${esc(c.name)}</span>${c.hero ? '<span class="sf-hero" title="Здесь у тебя есть герой">герой</span>' : ''}${liveTag(c)}</a>
          <span class="sf-a">${c.pinned && pins.length > 1 ? `<button type="button" class="sf-b" data-mv="-1" data-ch="${esc(c.login)}" aria-label="Выше: ${esc(c.name)}"${pi === 0 ? ' disabled' : ''}>${SVG.up}</button><button type="button" class="sf-b" data-mv="1" data-ch="${esc(c.login)}" aria-label="Ниже: ${esc(c.name)}"${pi === pins.length - 1 ? ' disabled' : ''}>${SVG.dn}</button>` : ''}
          <button type="button" class="sf-b sf-pin" data-act="${c.pinned ? 'unpin' : 'pin'}" data-ch="${esc(c.login)}" aria-pressed="${!!c.pinned}" title="${c.pinned ? 'Открепить' : 'Закрепить сверху'}" aria-label="${c.pinned ? 'Открепить' : 'Закрепить'}: ${esc(c.name)}">${SVG.pin}</button>
          <button type="button" class="sf-b sf-x" data-act="remove" data-ch="${esc(c.login)}" title="Убрать из списка (герой и вещи на канале останутся)" aria-label="Убрать из списка: ${esc(c.name)}">${SVG.x}</button></span></li>`;
      }).join('')}</ul>`;
    }

    const mine = (m && m.mine) || [];
    if (mine.length) h += `<hr class="pop-sep"><p class="pop-h">Мои каналы</p><ul class="pop-l">${mine.map((c) => `<li><a class="pop-ch" href="${chUrl(c.login)}"${c.login.toLowerCase() === cur ? ' aria-current="page"' : ''}><span class="pop-n">${esc(c.name)}</span></a></li>`).join('')}</ul>`;

    my.innerHTML = admItem() + h;
  }
  function findClick(e) {
    const el = F.el, q = (k) => { const x = e.target.closest(k); return x && el && el.contains(x) ? x : null; };
    if (q('[data-adm]')) { findClose(false); return; }
    const mv = q('[data-mv]');
    if (mv && F.list) {
      const pins = F.list.filter((c) => c.pinned).map((c) => c.login), i = pins.indexOf(mv.dataset.ch), j = i + Number(mv.dataset.mv);
      if (i < 0 || j < 0 || j >= pins.length) return;
      [pins[i], pins[j]] = [pins[j], pins[i]];
      listAct('order', mv.dataset.ch, { order: pins }).then(() => { const b = F.el && F.el.querySelector(`[data-mv="${mv.dataset.mv}"][data-ch="${mv.dataset.ch}"]`); if (b && !b.disabled) b.focus(); });
      return;
    }
    const b = q('[data-act]');
    if (b) { listAct(b.dataset.act, b.dataset.ch); return; }
    const a = q('a[data-open]');
    if (a && me() && me().user) {

      e.preventDefault();
      const go = () => { location.href = a.href; };
      H.api('/api/mylist', { act: 'open', ch: a.dataset.open }).then(go, go);
    }
  }
  document.addEventListener('click', (e) => { if (F.el && !F.el.contains(e.target) && !(F.from && F.from.contains(e.target))) findClose(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && F.el) findClose(true); });
  window.addEventListener('resize', () => findPlace());

  function markOpen() {
    const m = me(), c = curLogin();
    if (!m || !m.user || !m.find || !c || ss.get('lgOpen:' + c) || pickMode()) return;
    ss.set('lgOpen:' + c, '1');
    H.api('/api/mylist', { act: 'open', ch: c });
  }

   
  function cssHex(v) {
    const p = document.createElement('span'); p.style.color = v; p.style.display = 'none'; document.body.appendChild(p);
    const c = getComputedStyle(p).color; p.remove();
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || ''); if (!m) return '';
    return '#' + [m[1], m[2], m[3]].map((x) => (+x).toString(16).padStart(2, '0')).join('');
  }
  function copyText(text, okMsg) {
    const done = () => H.toast(okMsg || 'Скопировано');
    const old = () => { const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'; document.body.append(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} t.remove(); if (ok) done(); else H.toast('Не удалось скопировать - выдели текст и скопируй вручную', true); };
    try { navigator.clipboard.writeText(text).then(done, old); } catch { old(); }
  }

  function pickFrame(sel, onPick) {
    const f = document.createElement('iframe');
    f.className = 'wz-pick'; f.title = 'Выбор стиля'; f.setAttribute('loading', 'lazy');
    const q = new URLSearchParams({ sel: sel || '' });
    const fg = cssHex('var(--ink)'), ac = cssHex('var(--accent)'); if (fg) q.set('fg', fg); if (ac) q.set('ac', ac);
    f.src = '/site/stylepick?' + q.toString();
    const on = (e) => {
      if (e.origin !== location.origin || !e.data || e.source !== f.contentWindow) return;
      if (e.data.lg === 'stylepick') onPick(String(e.data.id || ''));
      if (e.data.lg === 'stylepick-h') f.style.height = Math.min(640, Math.max(140, +e.data.h || 0) + 6) + 'px';
    };
    window.addEventListener('message', on);
    f._off = () => window.removeEventListener('message', on);
    return f;
  }

  function modal(cls, label) {
    const back = document.createElement('div');
    back.className = 'wz-back'; back.innerHTML = `<div class="wz ${cls}" role="dialog" aria-modal="true" aria-label="${esc(label)}"></div>`;
    document.body.appendChild(back);
    document.documentElement.classList.add('wz-open');
    const box = back.firstChild, was = document.activeElement;
    const close = () => { back.remove(); document.documentElement.classList.remove('wz-open'); document.removeEventListener('keydown', key); box.querySelectorAll('iframe').forEach((f) => f._off && f._off()); try { if (was && was.focus) was.focus(); } catch {} };
    const key = (e) => { if (e.key === 'Escape') { e.preventDefault(); box.dispatchEvent(new CustomEvent('wz-esc')); } };
    document.addEventListener('keydown', key);
    return { back, box, close };
  }

   
  function stylePick(o) {
    const M = modal('wz-seal', o.title || 'Выбор стиля');
    let sel = '', armed = 0;
    M.box.innerHTML = `<div class="wz-h"><h2>${esc(o.title)}</h2><button type="button" class="wz-x" data-x aria-label="Закрыть">×</button></div>
      <p class="wz-t">${esc(o.text || '')}</p><div class="wz-pickbox"></div>
      <div class="wz-f"><button type="button" class="btn ghost" data-x>Отмена</button><button type="button" class="btn primary" data-ok disabled>${esc(o.ok || 'Выбрать')}</button></div>`;
    const ok = M.box.querySelector('[data-ok]');
    M.box.querySelector('.wz-pickbox').appendChild(pickFrame(o.sel, (id) => { sel = id; ok.disabled = !id; armed = 0; ok.textContent = o.ok || 'Выбрать'; }));
    M.box.addEventListener('click', (e) => {
      const q = (k) => { const x = e.target.closest(k); return x && M.box.contains(x) ? x : null; };
      if (q('[data-x]')) { M.close(); return; }
      if (q('[data-ok]') && sel) {
        if (o.confirm && Date.now() - armed > 4000) { armed = Date.now(); ok.textContent = o.confirm; return; }
        M.close(); o.pick(sel);
      }
    });
    M.box.addEventListener('wz-esc', () => M.close());
    setTimeout(() => { try { M.box.querySelector('[data-x]').focus(); } catch {} }, 0);
  }

  

  



  const tut = () => { const m = me(); return !!(m && m.tut); };
  const tutKey = () => 'lgTut:p:' + String((me() && me().user && me().user.login) || '').toLowerCase();
  const tutSeen = () => !!ls.get(tutKey());
  const phone = () => window.innerWidth < 640;
  const vis = (el) => !!el && !el.closest('[hidden]') && el.getClientRects().length > 0;

  const onX = (r) => r.x + r.w / 2 > 0 && r.x + r.w / 2 < window.innerWidth;

  const seenEl = (el) => {
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (!onX({ x: r.left, w: r.width })) return false;
    if (cy < 0 || cy > window.innerHeight) return true;
    const top = document.elementFromPoint(cx, cy); return !!top && (top === el || el.contains(top) || top.contains(el));
  };

  const here = (s) => { if (s.spot || s.free || s.tab || !s.sel) return true; const els = [...document.querySelectorAll(s.sel)].filter(vis); return els.some((e) => !!e.closest('.tabs') || seenEl(e)); };
  const tabB = (id) => document.querySelector(`.tabs button[data-tab="${id}"]`);
  const tabOn = (id) => vis(tabB(id));
  const cityOk = () => tabOn('city') && !H.cityLock() && !H.jail();
  const cityIn = () => { try { const d = window.LGCity && window.LGCity.debug && window.LGCity.debug(); return !!(d && d.inCity); } catch (e) { return false; } };
  const startB = () => { const b = document.querySelector('#roleSw button[data-role="streamer"]'); return vis(b) ? b : null; };
  const PSTEPS = [
    { k: 'hero', tab: 'hero', sel: '.tabs button[data-tab="hero"]', t: 'Персонаж', d: 'Твой герой: снаряжение, сумка, навыки и журнал. Вещь надевается перетаскиванием из сумки на героя.' },
    { k: 'class', tab: 'hero', sel: '#tab-hero .plate .role', t: 'Класс = оружие', d: 'Класс героя - это оружие в руках: меч или топор - легионер, лук - лучник, посох - маг, кадило - жрец. Взял другое оружие - сменил класс. Без оружия - новобранец.' },
    { k: 'coins', tab: 'hero', sel: '#tab-hero .coins', t: 'Монеты, смерть и прочность', d: 'Монеты - за бои и походы, тратятся в лавках, на заточку и починку. Погиб в бою - на сутки станешь призраком, часть монет останется на могиле, надетые вещи потеряют прочность. Вещь на 0% исчезает - чини её в Кузне.' },
    { k: 'join', sel: '.tabs button[data-tab="quest"]', free: true, t: 'Как играть на стриме',

      d: 'Играть можно двумя способами на выбор: на сайте - вкладка «Поход» с кнопками команд, или в чате Twitch на стриме: напиши «поход» - и ты в отряде, в бою «удар» (лучник - «выстрел», маг - «магия», жрец - «лечить»).' },
    { k: 'tabs', sel: '.tabs button[data-tab="legion"], .tabs button[data-tab="news"], .tabs button[data-tab="world"]', t: 'Рейтинг и новости',
      d: () => '«Легион» - все герои канала и соц. рейтинг, «Новости» - что нового в игре.' + (tabOn('world') ? ' «Карта мира» - округа, куда ходил отряд, и их опасность (★).' : '') },
    { k: 'city', when: cityOk, tab: 'city', wait: cityIn, sel: '.tabs button[data-tab="city"]', t: 'Город',
      d: () => { const l = (window.LGCity && window.LGCity.blist ? window.LGCity.blist() : []).slice(0, 9); return 'Город канала: ходи по улице и заходи в здания - нажми на здание или подойди к нему.' + (l.length ? ` Здесь: ${l.join(', ')}.` : ''); } },
    { k: 'forge', when: cityOk, tab: 'city', spot: 'forge', t: 'Кузня', d: 'Кузнец продаёт оружие и доспехи, у наковальни рядом - заточка (+1, +2…) и починка вещей. Звёзды и сферы для заточки не продаются - их находят в походе, в Шахте и на рыбалке.' },
    { k: 'storage', when: cityOk, tab: 'city', spot: 'storage', t: 'Склад', d: 'Сюда кладут вещи, которым тесно в сумке. Склад смерть не трогает.' },
    { k: 'gate', when: cityOk, tab: 'city', spot: 'gate', t: 'Ворота', d: 'Выход в поход: отряд уходит через Ворота на стриме, когда стример начнёт поход. Пока ждёшь похода, можешь заточить оружие, заглянуть в лавки и пофармить ресурсы в шахте.' },


    { k: 'start', when: () => !!startB(), sel: '#roleSw button[data-role="streamer"]', t: () => (gp() ? (fsWay() ? 'Для стримеров' : 'Пульт игры') : 'Начать игру'),
      d: () => (gp() ? (fsWay() ? (invPend() ? 'Тебя пригласили вести игру у себя на стриме: нажми «Для стримеров» - расскажем, как это работает, и подключим твой канал.' : 'Хочешь вести игру у себя на стриме? Нажми - расскажем, как это работает.') : 'Пульт игры твоего канала: всё для стрима - отдельным окном.')
        : ownLogin() ? 'Это пульт игры твоего канала - нажми, когда будешь готов начать стрим.' : 'Хочешь вести игру у себя на стриме? Нажми - создадим твой канал и откроем пульт игры.') },
  ];
  




  const cpOn = () => { const m = me(); return !!(m && m.user && m.cp); };
  const pickQ = () => /[?&]pick=1(&|$)/.test(location.search);
  const pickMode = () => { const m = me(); return !!(m && m.user && m.chPick) && pickQ(); };
  const PK = { data: null, err: '', q: '', res: null, busy: false, t: 0, ctl: null, cache: new Map(), shown: false };
  const pickDef = () => (PK.data && PK.data.def) || { login: curLogin(), name: String((H && H.ch && (H.ch.name || H.ch.login)) || curLogin()) };
  const PICK = { k: 'pick', sel: '#chsw', free: true, pick: true, t: 'Выбери стримера',
    d: 'Играть можно у любого стримера, и у каждого заводится свой герой. Выбери, к кому идти. Сменить канал можно в любой момент - кнопкой канала в шапке (она подсвечена).' };
  const weekTxt = (n) => { const k = n % 10, h = n % 100; return `${n} ${k === 1 && h !== 11 ? 'игрок' : k >= 2 && k <= 4 && (h < 12 || h > 14) ? 'игрока' : 'игроков'} за неделю`; };
  const pickRow = (c) => `<li><button type="button" class="cp-ch" data-cpgo="${esc(String(c.login).toLowerCase())}"><span class="cp-n" title="${esc(c.name)}">${esc(c.name)}</span>${liveTag(c)}${c.week != null ? `<span class="cp-w">${esc(weekTxt(+c.week || 0))}</span>` : ''}</button></li>`;
  function pickHtml() {
    return `<div class="cp" id="cpBox"><label class="sf-q cp-q"><span class="sr-only">Найти канал по нику</span>
        <input type="search" id="cpQ" placeholder="Найти канал по нику" autocomplete="off" spellcheck="false" maxlength="25" enterkeyhint="search" value="${esc(PK.q)}"></label>
      <div class="cp-res" id="cpRes" aria-live="polite"></div><div class="cp-top" id="cpTop"></div></div>`;
  }
  function pickRender() {
    const box = TU && TU.el && TU.el.querySelector('#cpBox'); if (!box) return;
    const q = String(PK.q || '').trim().replace(/^@/, ''), res = box.querySelector('#cpRes'), top = box.querySelector('#cpTop');
    if (!q) res.innerHTML = '';
    else if (q.length < 2) res.innerHTML = '<p class="pop-e">Ещё хотя бы одна буква</p>';
    else if (PK.err) res.innerHTML = `<p class="pop-e">${esc(PK.err)}</p>`;
    else if (PK.busy && !PK.res) res.innerHTML = '<p class="pop-e">Ищем…</p>';
    else if (PK.res && !PK.res.length) res.innerHTML = '<p class="pop-e">Такого канала в игре нет</p>';
    else if (PK.res) res.innerHTML = `<p class="pop-h">Найдено</p><ul class="pop-l cp-l">${PK.res.map(pickRow).join('')}</ul>`;
    const list = PK.data ? PK.data.top || [] : null;
    if (!PK.data && !PK.err) top.innerHTML = '<p class="pop-e">Загружаем каналы…</p>';
    else if (!list || !list.length) top.innerHTML = PK.data ? '' : '<p class="pop-e">Список каналов не загрузился - найди стримера по нику</p>';
    else top.innerHTML = `<p class="pop-h">${list.some((c) => c.live) ? 'В эфире и популярные' : 'Популярные каналы'}</p><ul class="pop-l cp-l">${list.map(pickRow).join('')}</ul>`;
    top.hidden = !!q && !!PK.res && PK.res.length > 0;
    const def = TU.el.querySelector('.cp-def'), d = pickDef();
    if (def) { def.dataset.cpgo = d.login; def.textContent = 'Играть на ' + d.name; }
    tuPlace();
  }
  function pickInput(v) {
    const q = String(v || '').trim().toLowerCase().replace(/^@/, '');
    PK.q = v; clearTimeout(PK.t);
    if (q.length < 2) { PK.res = null; PK.err = ''; PK.busy = false; pickRender(); return; }
    if (PK.cache.has(q)) { PK.res = PK.cache.get(q); PK.err = ''; PK.busy = false; pickRender(); return; }
    PK.busy = true; PK.res = null; pickRender();
    PK.t = setTimeout(() => {
      if (PK.ctl) { try { PK.ctl.abort(); } catch (e) { void e; } }
      const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null; PK.ctl = ctl;
      const done = (r, st) => {
        if (PK.ctl !== ctl) return;
        PK.busy = false; PK.ctl = null;
        if (r && r.ok) { PK.res = r.list || []; PK.err = ''; PK.cache.set(q, PK.res); if (PK.cache.size > 50) PK.cache.delete(PK.cache.keys().next().value); }
        else PK.err = st === 429 || (r && r.error === 'rate_limited') ? 'Слишком часто - подожди пару секунд' : 'Поиск не ответил';
        pickRender();
      };
      if (window.LG_DEMO) { H.api('/api/find?q=' + encodeURIComponent(q)).then((r) => done(r, 200)); return; }
      fetch((window.LG_BASE || '') + '/api/find?q=' + encodeURIComponent(q), ctl ? { signal: ctl.signal } : {})
        .then((r) => r.json().then((d) => done(d, r.status)))
        .catch((e) => { if (e && e.name === 'AbortError') return; PK.busy = false; PK.err = 'Нет связи с сайтом'; pickRender(); });
    }, 300);
  }
  function pickBind() {
    const inp = TU.el.querySelector('#cpQ'); if (!inp) return;
    inp.addEventListener('input', () => pickInput(inp.value));
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const b = TU.el.querySelector('#cpRes [data-cpgo]'); if (b) { e.preventDefault(); b.click(); } }
      if (e.key === 'ArrowDown') { const b = TU.el.querySelector('#cpRes [data-cpgo], #cpTop [data-cpgo]'); if (b) { e.preventDefault(); b.focus(); } }
    });
    pickRender();
  }

  function pickGo(login) {
    const l = String(login || '').toLowerCase(); if (!/^[a-z0-9_]{1,25}$/.test(l)) return;
    ss.set('lgPicked', '1');
    if (TU) tuClose();
    const go = () => { location.href = chUrl(l); };
    const m = me();
    if (m && m.find) H.api('/api/mylist', { act: 'open', ch: l }).then(go, go); else go();
  }
  function pickMaybe() {
    if (!H || PK.shown || TU || window.LG_DOCK || !pickMode()) return;
    const m = me(); if (m.maintenance) return;
    PK.shown = true;
    tuStart('p', [PICK]);
    H.api('/api/pick').then((r) => { if (r && r.ok) { PK.data = r; PK.err = ''; } else PK.err = 'нет списка'; pickRender(); });
  }

  function tutQuietDone() { if (TU && TU.kind === 'p') { tuClose(); ls.set(tutKey(), 'done'); } ss.set('lgPicked', ''); }

  

  function ownHint() {
    const m = me(), cur = curLogin();
    const on = !!(m && m.user && m.ownHint && cur && cur === ownLogin() && !window.LG_DOCK && ss.get('lgOwnHint:' + cur) !== '0');
    let el = document.getElementById('ownHint');
    if (!on) { if (el) el.remove(); return; }
    if (el) return;
    const url = location.origin + chUrl(cur);
    el = document.createElement('div');
    el.id = 'ownHint'; el.className = 'own-hint'; el.setAttribute('role', 'status');
    el.innerHTML = `<p class="oh-t">Это твой канал. Зрители попадут сюда по ссылке со стрима: <a class="oh-u" href="${esc(url)}" target="_blank" rel="noopener">${esc(url.replace(/^https?:\/\//, ''))}</a></p>
      <button type="button" class="btn primary sm" data-ohcopy>Копировать</button><button type="button" class="oh-x" data-ohx aria-label="Скрыть подсказку">×</button>`;
    const main = document.getElementById('main');
    if (main && main.parentNode) main.parentNode.insertBefore(el, main); else document.body.prepend(el);
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-ohcopy]')) copyText(url, 'Ссылка для зрителей скопирована');
      if (e.target.closest('[data-ohx]')) { ss.set('lgOwnHint:' + cur, '0'); el.remove(); }
    });
  }

  let TU = null;
  function tuStart(kind, list, o) {
    if (TU) tuClose();
    TU = { kind, list: list.filter(here), o: o || {}, i: 0, dir: 1, tok: 0, el: null, hit: null };
    tuGo(0, 1);
  }
  const tuLive = () => (TU ? TU.list.filter((s) => !s.when || s.when()) : []);
  function tuGo(i, dir) {
    if (!TU) return;
    if (i < 0) { i = 0; dir = 1; }
    if (i >= TU.list.length) { tuEnd(true); return; }
    const s = TU.list[i];
    if (s.when && !s.when()) { tuGo(i + dir, dir); return; }
    TU.i = i; TU.dir = dir;
    const tok = ++TU.tok;
    if (s.tab && H.curTab() !== s.tab) H.tab(s.tab);


    const tip0 = TU.el && TU.el.querySelector('.tut-tip'); if (tip0) tip0.classList.add('is-wait');
    let n = 0; const max = s.spot || s.wait ? 40 : s.free ? 1 : 6;
    const look = () => {
      if (!TU || tok !== TU.tok) return;
      const hit = tuFind(s);
      if (!hit && ++n < max) { setTimeout(look, 250); return; }
      if (!hit && !s.free) { tuGo(i + dir, dir); return; }
      if (hit && hit.el) { try { hit.el.scrollIntoView({ block: 'center', inline: 'center' }); } catch (e) { void e; } }
      setTimeout(() => {
        if (!TU || tok !== TU.tok) return;
        const h2 = hit ? tuFind(s) || hit : null;
        const ok = h2 && (h2.el ? seenEl(h2.el) : onX(h2.r));
        if (h2 && !ok && !s.free) { tuGo(i + dir, dir); return; }
        tuDraw(s, ok ? h2 : null);
      }, hit && hit.el ? 80 : 0);
    };
    look();
  }

  function tuFind(s) {
    if (s.wait && !s.wait()) return null;
    if (s.spot) { const r = window.LGCity && window.LGCity.spot ? window.LGCity.spot(s.spot) : null; return r ? { r, el: null } : null; }
    const els = [...document.querySelectorAll(s.sel)].filter(vis); if (!els.length) return null;
    const rs = els.map((e) => e.getBoundingClientRect());
    const x = Math.min(...rs.map((r) => r.left)), y = Math.min(...rs.map((r) => r.top));
    return { r: { x, y, w: Math.max(...rs.map((r) => r.right)) - x, h: Math.max(...rs.map((r) => r.bottom)) - y }, el: els[0] };
  }
  function tuDraw(s, hit) {
    if (!TU) return;
    TU.hit = hit; TU.s = s;
    if (!TU.el) {
      TU.el = document.createElement('div'); TU.el.className = 'tour tut'; TU.el.dataset.tut = TU.kind;
      document.body.appendChild(TU.el); TU.el.addEventListener('click', tuClick);
    }
    const live = tuLive(), n = Math.max(1, live.indexOf(s) + 1), all = live.length, last = !TU.list.slice(TU.i + 1).some((x) => !x.when || x.when());
    const d = typeof s.d === 'function' ? s.d() : s.d;

    const off = +TU.o.off || 0;
    const foot = s.pick ? `<div class="tut-f"><button type="button" class="btn primary sm cp-def" data-cpgo="${esc(pickDef().login)}">Играть на ${esc(pickDef().name)}</button></div>`
      : `<div class="tut-f"><button type="button" class="btn ghost sm" data-tskip>Пропустить</button><span class="wz-sp"></span>
          ${n > 1 ? '<button type="button" class="btn ghost sm" data-tprev>Назад</button>' : ''}<button type="button" class="btn primary sm" data-tnext>${last ? 'Готово' : 'Дальше'}</button></div>`;
    TU.el.innerHTML = `${hit ? '<div class="tour-hole"></div>' : '<div class="tut-dim"></div>'}
      <div class="tour-tip tut-tip${phone() ? ' is-phone' : ''}${s.pick ? ' is-pick' : ''}" role="dialog" aria-labelledby="tutT" aria-describedby="tutD" data-step="${esc(s.k)}">
        <span class="wz-n">${TU.kind === 's' ? 'Пульт' : 'Как играть'} · ${s.pick ? 'начало' : `${n + off} из ${all + off}`}</span><b id="tutT">${esc(typeof s.t === 'function' ? s.t() : s.t)}</b><p id="tutD">${esc(d)}</p>
        ${s.pick ? pickHtml() : ''}${foot}</div>`;
    if (s.pick) pickBind();
    tuPlace();
    try { TU.el.querySelector(s.pick ? '#cpQ' : '[data-tnext]').focus({ preventScroll: true }); } catch (e) { void e; }
  }

  function tuPlace() {
    if (!TU || !TU.el) return;
    const tip = TU.el.querySelector('.tut-tip'), hole = TU.el.querySelector('.tour-hole'); if (!tip) return;
    const W0 = window.innerWidth, H0 = window.innerHeight, P = phone();
    tip.classList.toggle('is-phone', P);
    let r = TU.hit && TU.hit.r;
    if (P && r && TU.hit.el) {
      const top = H0 - tip.offsetHeight - 16;
      if (r.y + r.h > top && r.y > 70) { window.scrollBy(0, Math.min(r.y - 70, r.y + r.h - top)); const h2 = tuFind(TU.s); if (h2) { TU.hit = h2; r = h2.r; } }
    }
    if (hole && r) {
      const x = Math.max(4, r.x - 6), y = Math.max(4, r.y - 6), w = Math.min(W0 - 4, r.x + r.w + 6) - x, h = Math.min(H0 - 4, r.y + r.h + 6) - y;
      Object.assign(hole.style, { left: x + 'px', top: y + 'px', width: Math.max(8, w) + 'px', height: Math.max(8, h) + 'px' });
    }
    if (P) { tip.style.left = ''; tip.style.top = ''; tip.style.width = ''; return; }
    const tw = Math.min(400, W0 - 24); tip.style.width = tw + 'px';
    const th = tip.offsetHeight;
    let tx = W0 / 2 - tw / 2, ty = H0 / 2 - th / 2;
    if (r) {
      const cx = Math.max(12, Math.min(W0 - tw - 12, r.x + r.w / 2 - tw / 2));
      if (r.y + r.h + 14 + th <= H0 - 12) { tx = cx; ty = r.y + r.h + 14; }
      else if (r.y - 14 - th >= 12) { tx = cx; ty = r.y - 14 - th; }
      else if (r.x + r.w + 14 + tw <= W0 - 12) { tx = r.x + r.w + 14; ty = Math.max(12, Math.min(H0 - th - 12, r.y)); }
      else if (r.x - 14 - tw >= 12) { tx = r.x - 14 - tw; ty = Math.max(12, Math.min(H0 - th - 12, r.y)); }
      else { tx = W0 - tw - 12; ty = H0 - th - 12; }
    }
    tip.style.left = Math.round(tx) + 'px'; tip.style.top = Math.round(Math.max(12, ty)) + 'px';
  }
  function tuClick(e) {
    if (!TU || !TU.el) return;
    const q = (k) => { const x = e.target.closest(k); return x && TU.el.contains(x) ? x : null; };
    const go = q('[data-cpgo]'); if (go) { e.preventDefault(); pickGo(go.dataset.cpgo); return; }
    if (q('[data-tskip]')) { tuEnd(false); return; }
    if (q('[data-tprev]')) { let j = TU.i - 1; while (j > 0 && TU.list[j].when && !TU.list[j].when()) j--; tuGo(j, -1); return; }
    if (q('[data-tnext]')) tuGo(TU.i + 1, 1);
  }
  function tuClose() { if (TU && TU.el) TU.el.remove(); TU = null; }
  function tuEnd(done) {
    if (!TU) return;
    const kind = TU.kind;
    tuClose();
    ss.set('lgPicked', '');
    ls.set(tutKey(), done ? 'done' : 'skip');
    H.toast(done ? 'Готово! Повторить - в меню ника: «Как играть»' : 'Обучение можно пройти позже: меню ника → «Как играть»');
  }

  let tutT = 0;
  function tutMaybe() {
    const m = me();
    if (!H || !tut() || TU || tutT || window.LG_DOCK || !m || !m.user || !m.hero || m.maintenance || tutSeen() || pickMode()) return;
    if (navigator.webdriver && !window.LG_TUT_AUTO) return;
    if (H.curTab() === 'streamer' || H.qIn() || H.jail() || !H.ready() || document.documentElement.classList.contains('wz-open')) return;
    tutT = setTimeout(() => {
      tutT = 0;
      if (!TU && !tutSeen() && H.curTab() !== 'streamer' && !H.qIn() && !H.jail() && H.ready() && !document.documentElement.classList.contains('wz-open')) tuStart('p', PSTEPS, ss.get('lgPicked') === '1' ? { off: 1 } : {});
    }, 900);
  }

  function tutor(kind) {
    if (kind === 's') {
      const own = ownLogin(); if (!own) return;
      if (TU) tuClose();
      wizOpen();
      return;
    }
    if (H.curTab() === 'streamer') toViewer();
    tuStart('p', PSTEPS);
  }
  let tuRaf = 0;
  const tuRe = () => { if (!TU || !TU.el || !TU.s || tuRaf) return; tuRaf = requestAnimationFrame(() => { tuRaf = 0; if (!TU || !TU.s) return; const h = TU.s.spot ? TU.hit : tuFind(TU.s); if (h) TU.hit = h; tuPlace(); }); };
  window.addEventListener('resize', tuRe);
  window.addEventListener('scroll', tuRe, { passive: true });
  document.addEventListener('keydown', (e) => { if (TU && e.key === 'Escape') { e.preventDefault(); if (!(TU.s && TU.s.pick)) tuEnd(false); } });



  const wizOpen = () => { const own = otherCh() ? curLogin() : ownLogin(); if ((gp() || otherCh()) && own) { if (!gpOpen(own, null, true)) H.toast('Разреши всплывающие окна для сайта, чтобы открыть пульт игры', true); return; } toStreamer(); };

  window.LGStart = {
    init(h) { H = h; },
    sync() { swRender(); markOpen(); if (F.el) findRender(); popNote(); pickMaybe(); tutMaybe(); ownHint(); },
    tabChanged(id) {
      if (id !== 'streamer') lastViewerTab = id;

      if (id === 'streamer' && TU && TU.kind === 'p') tuEnd(!!(TU.s && TU.s.k === 'start'));
      swRender(); tutMaybe();
    },

    tutor(kind) { tutor(kind); },

    toGame() { toViewer(); },
    findToggle(btn) { if (F.el) findClose(true); else findOpen(btn); },
    help() { wizOpen(); },
    stylePick,
    copyText,
    _F: F,
  };
})();
