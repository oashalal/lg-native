






(function () {
  'use strict';
  const SU = window.LGSiteUi, esc = SU.esc;
  const ERR = { rate_limited: 'слишком часто - подожди минуту', friends_closed: 'друзья пока закрыты', login_required: 'войди через Twitch' };
  const F = { ctx: null, btn: null, n: 0, data: null, box: null, shut: null, tab: 'f', pollT: 0, busy: false, known: new Map() };
  const er = (r) => (r && (ERR[r.error] || r.error)) || 'не вышло - нет связи';
  const nm = (u) => esc(u.name || u.login || '?');

  function init(ctx) {
    F.ctx = ctx;
    if (!F.btn) {
      const u = document.getElementById('user'); if (!u) return;
      F.btn = document.createElement('button'); F.btn.type = 'button'; F.btn.className = 'btn ghost sm fr-btn'; F.btn.id = 'frBtn';
      F.btn.setAttribute('aria-haspopup', 'dialog'); F.btn.title = 'Друзья';
      F.btn.innerHTML = '<span class="fr-ic" aria-hidden="true">👥</span><span class="fr-bt">Друзья</span><b class="fr-n" hidden></b>';
      F.btn.onclick = () => open();
      u.insertBefore(F.btn, u.firstChild);
      count();
    } else if (!F.btn.isConnected) { const u = document.getElementById('user'); if (u) u.insertBefore(F.btn, u.firstChild); }

    tell();
  }

  function tell() { try { window.dispatchEvent(new Event('lgfriends')); } catch (e) { console.warn('lgfriends', e); } }
  async function count() { const r = await F.ctx.api('/api/friends/n'); if (r && r.ok) setN(+r.in || 0); }
  function setN(n) {
    F.n = Math.max(0, n | 0); tell(); if (!F.btn) return;
    const b = F.btn.querySelector('.fr-n'); b.hidden = !F.n; b.textContent = F.n > 99 ? '99+' : String(F.n);
    F.btn.setAttribute('aria-label', F.n ? `Друзья, новых заявок: ${F.n}` : 'Друзья');
  }

   
  function open(tab) {
    if (tab) F.tab = tab;
    if (F.box) { render(); return; }
    const back = document.createElement('div'); back.className = 'fr-back';
    back.innerHTML = `<section class="fr-win" role="dialog" aria-modal="true" aria-label="Друзья">
      <header class="fr-h"><div class="fr-tabs" role="tablist"></div><button type="button" class="fr-x" aria-label="Закрыть">×</button></header>
      <form class="fr-add" autocomplete="off"><input type="text" maxlength="26" placeholder="Ник зрителя" aria-label="Ник, кого позвать в друзья" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="frSug"><button type="submit" class="btn primary sm">Позвать</button><ul class="fr-sug" id="frSug" role="listbox" aria-label="Подсказки ника" hidden></ul></form>
      <p class="fr-e" role="status"></p><div class="fr-body"></div></section>`;
    F.box = back;
    F.shut = SU.layer(back, { onClose: () => { F.box = null; F.shut = null; clearInterval(F.pollT); F.pollT = 0; try { F.btn.focus({ preventScroll: true }); } catch {} } });
    back.querySelector('.fr-x').onclick = () => F.shut && F.shut();
    back.querySelector('.fr-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-ft]'); if (b) { F.tab = b.dataset.ft; render(); } });
    back.querySelector('.fr-add').onsubmit = (e) => { e.preventDefault(); sugHide(); const i = e.target.querySelector('input'), v = i.value.trim().replace(/^@/, ''); if (v) act('add', { login: v }).then((ok) => { if (ok) i.value = ''; }); };
    sugInit(back.querySelector('.fr-add'));
    back.querySelector('.fr-body').addEventListener('click', onBody);
    render(); load();
    F.pollT = setInterval(() => { if (!document.hidden) load(); }, 60000);
  }
   


  const SUG_ST = { friends: 'в друзьях', out: 'заявка отправлена', in: 'зовёт тебя', blocked: 'в блоке' };
  const SG = { t: 0, n: 0, q: '', list: [], i: -1, form: null };
  function sugInit(form) {
    SG.form = form; SG.q = ''; SG.list = []; SG.i = -1;
    const inp = form.querySelector('input');
    inp.addEventListener('input', () => {
      clearTimeout(SG.t);
      const q = inp.value.trim().replace(/^@/, '').toLowerCase();
      if (!/^[a-z0-9_]{2,25}$/.test(q)) { SG.q = ''; sugHide(); return; }
      if (q === SG.q) return;
      SG.t = setTimeout(() => sugAsk(q), 250);
    });
    inp.addEventListener('keydown', (e) => {
      const ul = form.querySelector('.fr-sug');
      if (ul.hidden || !SG.list.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); SG.i = (SG.i + (e.key === 'ArrowDown' ? 1 : SG.list.length + (SG.i < 0 ? 0 : -1))) % SG.list.length; sugDraw(); return; }
      if (e.key === 'Enter' && SG.i >= 0 && !e.isComposing) { e.preventDefault(); sugPick(SG.i); return; }

      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); sugHide(); }
    });
    inp.addEventListener('blur', () => { setTimeout(sugHide, 150); });

    form.querySelector('.fr-sug').addEventListener('pointerdown', (e) => { const li = e.target.closest('[data-si]'); if (!li) return; e.preventDefault(); sugPick(+li.dataset.si); });
  }
  async function sugAsk(q) {
    SG.q = q; const n = ++SG.n;
    const r = await F.ctx.api('/api/friends/find?q=' + encodeURIComponent(q));
    if (n !== SG.n || !F.box || !SG.form || !SG.form.isConnected) return;
    if (!r || !r.ok) { sugHide(); if (r && r.error === 'rate_limited') msg(er(r)); return; }
    SG.list = r.users || []; SG.i = -1;
    for (const u of SG.list) if (u.st) F.known.set(u.login, u.st);
    sugDraw();
  }
  function sugDraw() {
    const ul = SG.form && SG.form.querySelector('.fr-sug'); if (!ul) return;
    const inp = SG.form.querySelector('input');
    if (!SG.list.length) { ul.innerHTML = `<li class="fr-sug0">${SG.q ? 'Никого с таким ником на сайте' : ''}</li>`; ul.hidden = !SG.q; inp.setAttribute('aria-expanded', String(!ul.hidden)); inp.removeAttribute('aria-activedescendant'); return; }
    ul.innerHTML = SG.list.map((u, i) => `<li role="option" id="frSug${i}" data-si="${i}" aria-selected="${i === SG.i}"><b>${nm(u)}</b>${u.name && u.name.toLowerCase() !== u.login ? `<small>${esc(u.login)}</small>` : ''}${u.st ? `<em>${SUG_ST[u.st] || ''}</em>` : ''}</li>`).join('');
    ul.hidden = false; inp.setAttribute('aria-expanded', 'true');
    if (SG.i >= 0) inp.setAttribute('aria-activedescendant', 'frSug' + SG.i); else inp.removeAttribute('aria-activedescendant');
  }
  function sugPick(i) {
    const u = SG.list[i]; if (!u || !SG.form) return;
    const inp = SG.form.querySelector('input'); inp.value = u.login; SG.q = u.login.toLowerCase(); sugHide();
    try { inp.focus({ preventScroll: true }); } catch (e) {   }
  }
  function sugHide() {
    clearTimeout(SG.t); SG.n++;
    const ul = SG.form && SG.form.querySelector('.fr-sug'); if (!ul) return;
    ul.hidden = true; ul.innerHTML = ''; SG.list = []; SG.i = -1;
    const inp = SG.form.querySelector('input'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant');
  }

  async function load() {
    const r = await F.ctx.api('/api/friends');
    if (!F.box) return;
    if (!r || !r.ok) { msg(er(r)); return; }
    F.data = r; setN((r.in || []).length);
    knownFrom(r); FL.at = Date.now();
    render();
  }
  function knownFrom(r) { F.known = new Map(); for (const f of r.friends || []) F.known.set(f.login, 'friends'); for (const f of r.out || []) F.known.set(f.login, 'out'); for (const f of r.in || []) F.known.set(f.login, 'in'); for (const f of r.blocks || []) F.known.set(f.login, 'blocked'); }


  const FL = { at: 0, p: null };
  const friendLogins = () => [...F.known].filter(([, st]) => st === 'friends').map(([l]) => String(l).toLowerCase());
  function friends() {
    if (!F.ctx) return Promise.resolve([]);
    if (FL.p) return FL.p;
    if (FL.at && Date.now() - FL.at < 60000) return Promise.resolve(friendLogins());
    FL.p = F.ctx.api('/api/friends').then((r) => { if (r && r.ok) { knownFrom(r); FL.at = Date.now(); } else FL.at = Date.now() - 45000; return friendLogins(); })
      .catch((e) => { console.warn('[друзья] список для Города', e); FL.at = Date.now() - 45000; return friendLogins(); })
      .finally(() => { FL.p = null; });
    return FL.p;
  }
  function msg(t, ok) { const e = F.box && F.box.querySelector('.fr-e'); if (!e) { if (F.ctx) F.ctx.toast(t, !ok); return; } e.textContent = t; e.classList.toggle('ok', !!ok); clearTimeout(F.msgT); F.msgT = setTimeout(() => { e.textContent = ''; }, 4000); }
  const ago = (t) => { const d = Math.max(0, Date.now() - t), h = Math.floor(d / 3600000); return h < 1 ? 'только что' : h < 24 ? `${h} ч назад` : `${Math.floor(h / 24)} дн назад`; };
  function render() {
    if (!F.box) return;
    const D = F.data || { friends: [], in: [], out: [], blocks: [], max: 100 };
    const tabs = [['f', `Друзья ${D.friends.length}/${D.max || 100}`], ['r', `Заявки${D.in.length ? ` <b class="fr-tn">${D.in.length}</b>` : ''}`], ['b', 'Блок']];
    F.box.querySelector('.fr-tabs').innerHTML = tabs.map(([k, t]) => `<button type="button" role="tab" data-ft="${k}" aria-selected="${F.tab === k}">${t}</button>`).join('');
    const body = F.box.querySelector('.fr-body');
    if (!F.data) { body.innerHTML = SU.note('Загружаю…'); return; }
    if (F.tab === 'f') {
      const L = D.friends.slice().sort((a, b) => Number(!!b.on) - Number(!!a.on));
      const n = D.coin ? D.friends.filter((f) => f.coin === 'ok').length : 0;
      body.innerHTML = L.length ? `<ul class="fr-l">${L.map(friendLi).join('')}</ul>${D.coin ? `<div class="fr-foot"><button type="button" class="btn primary sm fr-all" data-fa="coinAll"${n ? '' : ' disabled'} title="${n ? 'Каждому другу - 1 бронзовая монета' : 'Сегодня дарить больше некому - завтра снова'}">Подарить всем (${n})</button></div>` : ''}` : SU.note('Друзей пока нет. Позови по нику сверху или через меню ника в чате (правая кнопка или долгое нажатие).');
    } else if (F.tab === 'r') {
      body.innerHTML = (D.in.length ? `<h4>Зовут в друзья</h4><ul class="fr-l">${D.in.map((u) => `<li><span class="fr-who"><b>${nm(u)}</b><small>${esc(ago(u.at))}</small></span><span class="fr-a"><button type="button" class="btn primary sm" data-fa="accept" data-id="${esc(u.id)}">Принять</button><button type="button" class="btn ghost sm" data-fa="decline" data-id="${esc(u.id)}">Отказать</button></span></li>`).join('')}</ul>` : '')
        + (D.out.length ? `<h4>Ты позвал</h4><ul class="fr-l">${D.out.map((u) => `<li><span class="fr-who"><b>${nm(u)}</b><small>ждёт ответа · ${esc(ago(u.at))}</small></span><span class="fr-a"><button type="button" class="btn ghost sm" data-fa="cancel" data-id="${esc(u.id)}">Отменить</button></span></li>`).join('')}</ul>` : '')
        || SU.note('Заявок нет. Заявка ждёт ответа 14 дней.');
    } else {
      body.innerHTML = D.blocks.length ? `<ul class="fr-l">${D.blocks.map((u) => `<li><span class="fr-who"><b>${nm(u)}</b><small>не может звать тебя в друзья</small></span><span class="fr-a"><button type="button" class="btn ghost sm" data-fa="unblock" data-id="${esc(u.id)}">Разблокировать</button></span></li>`).join('')}</ul>` : SU.note('В блоке никого. Заблокировать - в меню ника в чате.');
    }
  }
  function friendLi(u) {
    const on = u.on, dot = `<i class="fr-dot${on ? ' on' : ''}" aria-hidden="true"></i>`;
    const where = on ? `${esc(on.t)}${on.ch ? ` · ${esc(on.ch)}` : ''}` : 'не в сети';
    return `<li data-id="${esc(u.id)}"><span class="fr-who">${dot}<b>${nm(u)}</b><small>${where}</small></span><span class="fr-a">${window.LGDm ? `<button type="button" class="btn ghost sm fr-dm" data-fa="dm" data-l="${esc(u.login)}" data-n="${nm(u)}" aria-label="Написать: ${nm(u)}">✉<span class="fr-bt"> Написать</span></button>` : ''}${coinBtn(u)}<button type="button" class="btn ghost sm fr-del" data-fa="remove" data-id="${esc(u.id)}" aria-label="Удалить из друзей: ${nm(u)}">Удалить</button></span></li>`;
  }
  const COIN_T = { given: 'Сегодня уже подарил - завтра снова', young: 'Дружбе меньше суток - завтра можно', dead: 'Герой друга пал - монета только живым', nohero: 'У друга нет героя на этом канале' };
  function coinBtn(u) {
    if (!u.coin) return '';
    const ok = u.coin === 'ok', t = ok ? `Монета дня: подарить ${u.name || u.login} 1 бронзовую` : COIN_T[u.coin] || 'Сейчас нельзя';
    return `<button type="button" class="fr-coin${ok ? '' : ' off'}" data-fa="coin" data-id="${esc(u.id)}"${ok ? '' : ' aria-disabled="true"'} title="${esc(t)}" aria-label="${esc(t)}"><i aria-hidden="true"></i></button>`;
  }
  function onBody(e) {
    const b = e.target.closest('[data-fa]'); if (!b || b.disabled) return;
    const op = b.dataset.fa;
    if (op === 'dm') { if (window.LGDm && window.LGDm.open(b.dataset.l, { name: b.dataset.n })) { if (F.shut) F.shut(); } else msg('личные пока закрыты'); return; }
    if (op === 'coin' || op === 'coinAll') { if (b.getAttribute('aria-disabled') === 'true') { msg(b.title); return; } coin(op === 'coinAll' ? null : b.dataset.id); return; }
    if (op === 'remove' && !SU.confirmTwice(b, { text: 'Точно удалить?', cls: 'warn', mark: 'sure' })) return;
    act(op, { id: b.dataset.id });
  }
  const DONE = { add: 'Заявка отправлена', accept: 'Теперь вы друзья', decline: 'Заявка отклонена', cancel: 'Заявка отменена', remove: 'Удалён из друзей', block: 'Заблокирован', unblock: 'Разблокирован' };
  async function act(op, who) {
    if (F.busy) return false; F.busy = true;
    const r = await F.ctx.api('/api/friends', { op, ...who });
    F.busy = false;
    if (!r || !r.ok) { msg(er(r)); return false; }
    const nick = r.user && r.user.name;
    msg(op === 'add' && r.state === 'friends' ? `${nick}: теперь вы друзья` : `${nick ? nick + ': ' : ''}${DONE[op] || 'Готово'}`, true);
    if (r.user) { if (r.state) F.known.set(r.user.login, r.state); else F.known.delete(r.user.login); }
    if (F.box) load(); else if (op === 'accept' || op === 'decline') count();
    return true;
  }

   
  async function coin(id) {
    if (F.busy) return; F.busy = true;
    const rid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const r = await F.ctx.api('/api/friends/coin', id ? { to: id, rid } : { all: 1, rid });
    F.busy = false;
    if (!r || !r.ok) { msg(er(r)); return; }

    if (F.data) for (const f of F.data.friends) if ((r.to || []).includes(f.id)) f.coin = 'given';
    render(); msg(r.n > 1 ? `Дарим монету дня: ${r.n} друзьям…` : 'Дарим монету дня…', true);
  }
   
  function coinDone(x) {
    if (x.ok) { const n = (x.x && x.x.n) || 0; F.ctx.toast(n > 1 ? `Монета дня подарена: ${n} друзьям` : 'Монета дня подарена'); }
    else F.ctx.toast('Монета дня: ' + (x.error || 'не вышло'), true);
    if (F.box) setTimeout(load, 300);
  }

   
  function onEvent(d) {
    if (!d || !d.from) return;
    if (d.k === 'in') { setN(F.n + 1); F.known.set(d.from.login, 'in'); if (F.ctx) F.ctx.toast(`${d.from.name || d.from.login} зовёт тебя в друзья`); }
    if (d.k === 'coin' && F.ctx) F.ctx.toast(`${d.from.name || d.from.login} подарил тебе монету дня: +1 бронза`);
    if (d.k === 'ok') { F.known.set(d.from.login, 'friends'); if (F.ctx) F.ctx.toast(`${d.from.name || d.from.login} принял заявку - теперь вы друзья`); }
    if (F.box) load();
  }

   
  function menuItems(nk) {
    const st = F.known.get(String(nk || '').toLowerCase());
    const out = [];
    if (st === 'friends') out.push(['fr-on', 'В друзьях', true]);
    else if (st === 'out') out.push(['fr-on', 'Заявка отправлена', true]);
    else if (st === 'in') out.push(['fr-acc', 'Принять в друзья']);
    else if (st !== 'blocked') out.push(['fr-add', 'Добавить в друзья']);
    out.push(st === 'blocked' ? ['fr-unb', 'Разблокировать'] : ['fr-blk', 'Заблокировать']);
    return out;
  }
  function menuAct(k, nk) {
    const login = String(nk || '').toLowerCase();
    if (k === 'fr-add') return act('add', { login });
    if (k === 'fr-acc') return act('accept', { login });
    if (k === 'fr-unb') return act('unblock', { login });
    if (k === 'fr-blk') return window.LGSiteUi.ask({ title: `Заблокировать ${nk}?`, text: 'Он не сможет писать тебе в личку и звать в друзья, а дружба и заявки между вами пропадут.', yes: 'Заблокировать', danger: true }).then((ok) => (ok ? act('block', { login }) : undefined));
    if (k === 'fr-on') open('f');
  }
  window.LGFriends = { init, open, n: () => F.n, onEvent, menuItems, menuAct, coinDone, friends, state: (nk) => F.known.get(String(nk || '').toLowerCase()) || null };
})();
