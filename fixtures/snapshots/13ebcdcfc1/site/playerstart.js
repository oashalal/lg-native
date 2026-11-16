












(function () {
  'use strict';
  let H = null;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ls = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };


  const GOALS = {
    weapon: { t: 'Возьми оружие в руки', how: 'Сумка → перетащи оружие на героя. Оружие - это класс: меч или топор - легионер, лук - лучник, посох - маг, кадило - жрец.', r: 'класс героя' },
    join: { t: 'Вступи в отряд', how: 'Когда на стриме идёт поход, напиши в чат Twitch «поход» и сделай ход в бою.' },
    win: { t: 'Победи в первом бою', how: 'В бою пиши команду своего класса: «удар», «выстрел», «магия» или «лечить».' },
    level: { t: 'Дорасти до 5 уровня', how: 'Опыт дают бои и походы на стриме.' },
    mine: { t: 'Копни камень в шахте', how: 'Шахта работает и без стрима: вкладка «Город» → Шахта.' },
  };

  const me = () => (H && H.me && H.me()) || null;
  const ps = () => { const m = me(); return (m && m.user && m.hero && m.hero.ps) || null; };
  const login = () => { const m = me(); return m && m.user ? String(m.user.login || '').toLowerCase() : ''; };
  const chan = () => (H && H.ch ? String(H.ch.login || '').toLowerCase() : '');
  const foldKey = () => 'lgPs:fold:' + login();
  const gcKey = () => 'lgPs:gc:' + chan() + ':' + login();
  const money = (n) => (H && typeof H.money === 'function' ? H.money(n) : esc(n) + ' мед.');

  let box = null, lastKey = '', lastQ = '', obs = null, gcSent = '', whatOpen = null;

  function questLine() {
    const q = (H && H.quest && H.quest()) || {};
    const twitch = chan() ? `<a href="https://www.twitch.tv/${encodeURIComponent(chan())}" target="_blank" rel="noopener">чат Twitch</a>` : 'чат Twitch';
    if (q.on && q.party === 'in') return '<p class="ps-st ok">Ты в отряде - следи за стримом и пиши команды в чат.</p>';
    if (q.on && q.party === 'ghost') return '<p class="ps-st">Твой герой - призрак: в поход не возьмут, пока не воскреснет.</p>';
    if (q.on && q.party === 'q') return '<p class="ps-st ok">Ты в очереди - вступишь в отряд на ближайшей остановке.</p>';
    if (q.on) return `<p class="ps-st go">Поход идёт - напиши в ${twitch} «поход», и вступишь в отряд.</p>`;
    return `<p class="ps-st">Сейчас похода нет - он идёт на стриме. Загляни в ${twitch}, когда стример в эфире.</p>`;
  }

  function html(d) {
    const goals = (d.g || []).filter((x) => Array.isArray(x) && GOALS[x[0]]);
    const done = goals.filter((x) => x[1]).length, fold = ls.get(foldKey()) === '1';
    const rows = goals.map(([id, ok, c]) => {
      const G = GOALS[id], rw = c > 0 ? `+${money(c)}` : G.r ? esc(G.r) : '';
      return `<li class="ps-g${ok ? ' is-done' : ''}" data-goal="${esc(id)}"><span class="ps-ck" aria-hidden="true">${ok ? '✓' : ''}</span>`
        + `<span class="ps-gt"><b>${esc(G.t)}</b>${ok ? '' : `<small>${esc(G.how)}</small>`}</span>`
        + `${rw ? `<span class="ps-rw" title="Награда">${rw}</span>` : ''}<span class="sr-only">${ok ? 'выполнено' : 'не выполнено'}</span></li>`;
    }).join('');
    const kit = d.k != null && d.k >= 0 ? `<div class="ps-kit" data-ps="kit"><b>Стартовый набор получен</b><p>${d.k > 0 ? money(d.k) + ' и ' : ''}оружие каждого класса - в сумке. Возьми в руки то, каким классом хочешь играть.</p></div>` : '';
    const gc = d.gc && ls.get(gcKey()) !== 'later' ? `<div class="ps-gc" data-ps="gc" role="status"><b>Вступи в гильдию</b><p>Канал прошёл Пролог - теперь у игроков есть гильдии. Сначала показаны активные и со свободными местами; в открытую - в один клик, в закрытую - по заявке.</p>`
      + `<div class="ps-row">${window.LGGuilds && typeof window.LGGuilds.pick === 'function' ? '<button type="button" class="btn sm" data-ps-guild>Выбрать гильдию</button>' : '<span class="ps-soon">Экран выбора гильдии скоро появится здесь.</span>'}<button type="button" class="btn ghost sm" data-ps-later>Позже</button></div></div>` : '';
    const what = `<details class="ps-what"${(whatOpen == null ? !done : whatOpen) ? ' open' : ''}><summary>Что за игра</summary><p>«Поход Легиона» - игра в чате стрима: стример ведёт отряд по карте мира, а зрители - его герои. Пишешь команды в чат - твой герой бьётся на экране стрима, получает опыт, монеты и вещи.</p><p>Здесь, на сайте, - твой герой: снаряжение, сумка, «Город» с лавками и Кузней. Сайт работает и без стрима.</p></details>`;
    const join = `<div class="ps-join" data-ps="join"><b>Как вступить в отряд</b><p>Когда на стриме идёт поход, напиши в чат Twitch <kbd>поход</kbd>. В бою - команда своего класса (<kbd>удар</kbd>, <kbd>выстрел</kbd>, <kbd>магия</kbd>, <kbd>лечить</kbd>). Команды - без «!».</p>${questLine()}</div>`;
    return `<div class="ps-hd"><b>Старт игрока</b>${goals.length ? `<span class="ps-n">${done} из ${goals.length}</span>` : ''}<button type="button" class="ps-fold" data-ps-fold aria-expanded="${!fold}" aria-controls="psBody">${fold ? 'Развернуть' : 'Свернуть'}</button></div>`
      + gc
      + `<div class="ps-body" id="psBody"${fold ? ' hidden' : ''}>${what}${join}${kit}${goals.length ? `<div class="ps-gs"><b>Первые цели</b><ol class="ps-goals">${rows}</ol></div>` : ''}</div>`;
  }


  function guildCall(d) {
    const k = d && d.gc ? gcKey() : '';
    if (!k || gcSent === k || ls.get(k) === 'later') return;
    gcSent = k;
    try { window.dispatchEvent(new CustomEvent('lg:guildCall', { detail: { channel: chan(), login: login(), handled: false } })); } catch (e) {   }
  }

  




  const WIDE = typeof matchMedia === 'function' ? matchMedia('(min-width: 1100px)') : null;
  function place() {
    const tab = $('#tab-hero'); if (!tab || !box) return;
    const grid = $(':scope > .hero-grid', tab), det = grid && $(':scope > .detail, :scope > .ps-col > .detail', grid);

    const hv = $(':scope > .hero-views', tab), top = hv ? hv.nextSibling : tab.firstChild;
    if (!grid || !det) { if (box.parentNode !== tab || top !== box) put(tab, box, top); return; }
    let col = det.parentNode !== grid ? det.parentNode : null;


    const heroWin = tab.classList.contains('gu-win') && document.documentElement.classList.contains('gu-whero');
    const wide = !!(WIDE && WIDE.matches) && getComputedStyle(det).position !== 'fixed' && !heroWin;
    if (wide) {
      grid.classList.remove('ps-flow');
      if (!col) { col = document.createElement('div'); col.className = 'ps-col'; grid.insertBefore(col, det); col.appendChild(det); }
      if (box.parentNode !== col || det.nextSibling !== box) put(col, box, det.nextSibling);
      return;
    }
    if (col) { grid.insertBefore(det, col); col.remove(); }
    grid.classList.add('ps-flow');
    const stage = $(':scope > .stage', grid);
    if (box.parentNode !== grid || (stage ? box.previousSibling !== stage : grid.firstChild !== box)) put(grid, box, stage ? stage.nextSibling : grid.firstChild);
  }

  function put(par, el, before) {
    if (el.isConnected || el.dataset.placed) el.classList.remove('ps-in');
    el.dataset.placed = '1';
    par.insertBefore(el, before);
  }

  function unplace() {
    const grid = $('#tab-hero > .hero-grid'); if (!grid) return;
    grid.classList.remove('ps-flow');
    const col = $(':scope > .ps-col', grid); if (!col) return;
    while (col.firstChild) grid.insertBefore(col.firstChild, col);
    col.remove();
  }


  const allDone = (d) => { const g = ((d && d.g) || []).filter((x) => Array.isArray(x) && GOALS[x[0]]); return g.length > 0 && g.every((x) => x[1]); };
  function render() {
    const d = ps();
    if (!d || allDone(d) || (H && H.jail && H.jail())) { if (box) { box.remove(); box = null; unplace(); } lastKey = ''; return; }
    const q = (H && H.quest && H.quest()) || {};

    const key = JSON.stringify([d, ls.get(foldKey()), ls.get(gcKey()), !!(window.LGGuilds && window.LGGuilds.pick)]), qk = JSON.stringify([!!q.on, q.party || null]);
    if (!box) {
      box = document.createElement('section'); box.className = 'ps-box ps-in'; box.setAttribute('aria-label', 'Старт игрока');
      box.addEventListener('click', onClick);
      box.addEventListener('animationend', (e) => { if (e.target === box) box.classList.remove('ps-in'); });
      lastKey = ''; lastQ = '';
    }
    if (key !== lastKey) { box.innerHTML = html(d); lastKey = key; lastQ = qk; }
    else if (qk !== lastQ) { const st = $('[data-ps="join"] .ps-st', box); if (st) st.outerHTML = questLine(); lastQ = qk; }
    place();
    if (obs) obs.takeRecords();
    guildCall(d);
  }
  function onClick(e) {
    const sm = e.target && e.target.closest ? e.target.closest('.ps-what > summary') : null;
    if (sm) { whatOpen = !sm.parentNode.open; return; }
    const t = e.target && e.target.closest ? e.target.closest('button') : null; if (!t) return;
    if (t.hasAttribute('data-ps-fold')) { ls.set(foldKey(), ls.get(foldKey()) === '1' ? '0' : '1'); render(); return; }
    if (t.hasAttribute('data-ps-later')) { ls.set(gcKey(), 'later'); render(); return; }
    if (t.hasAttribute('data-ps-guild')) { try { window.LGGuilds.pick({ channel: chan(), from: 'playerStart' }); } catch (x) {   } }
  }

  window.LGPlayerStart = {
    init(h) {
      H = h || null;


      const tab = $('#tab-hero');
      if (tab && !obs && typeof MutationObserver === 'function') {
        obs = new MutationObserver(() => { if (box) { place(); obs.takeRecords(); } }); obs.observe(tab, { childList: true });
        if (WIDE) { const f = () => { if (box) place(); }; if (WIDE.addEventListener) WIDE.addEventListener('change', f); else if (WIDE.addListener) WIDE.addListener(f); }
      }
      render();
    },
    sync() { if (H) setTimeout(render, 0); },
     
    state: () => ({ on: !!box, data: ps() }),
  };
})();
