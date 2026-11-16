







(function () {
  'use strict';
  if (window.LGDailies) return;
  let H = null;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const base = () => window.LG_BASE || '';
  async function j(r) { try { const x = await r.json(); return x && typeof x === 'object' ? x : { ok: false, error: 'нет ответа' }; } catch { return { ok: false, error: r.status === 429 ? 'слишком часто - подожди немного' : 'нет ответа' }; } }
  const apiGet = () => fetch(base() + '/api/dailies', { credentials: 'same-origin' }).then(j, () => ({ ok: false, error: 'нет связи' }));
  const apiAct = (b) => fetch(base() + '/api/dailies/act', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then(j, () => ({ ok: false, error: 'нет связи' }));
  const me = () => (H && H.me && H.me()) || null;
  const dl = () => { const m = me(); return (m && m.user && m.hero && m.hero.dl) || null; };
  const money = (n) => (H && typeof H.money === 'function' ? H.money(n) : esc(n) + ' бронзы');
  const toast = (t, bad) => { if (H && typeof H.toast === 'function') H.toast(t, bad); };
  const days = (n) => { const a = n % 10, b = n % 100; return n + ' ' + (a === 1 && b !== 11 ? 'день' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'дня' : 'дней'); };

  let bar = null, lastKey = '', obs = null, seenSent = false, dlg = null, data = null, busy = false;

   
  function barHtml(d) {
    const all = d.of > 0 && d.n >= d.of;
    return `<button type="button" class="dl-open" data-dl-open aria-haspopup="dialog"><b>Задания дня</b><span class="dl-n${all ? ' is-all' : ''}">${d.n} из ${d.of}</span>`
      + (d.s > 0 ? `<span class="dl-st" title="Дней подряд с заходом">серия ${days(d.s)}</span>` : '')
      + (d.g ? `<span class="dl-gl" title="Уровень гильдии">гильдия: ур. ${d.g}</span>` : '')
      + '<span class="dl-go" aria-hidden="true">›</span></button>';
  }
  function place() {
    const tab = $('#tab-hero'); if (!tab || !bar) return;
    const grid = $(':scope > .hero-grid', tab);

    const before = $(':scope > .hero-views', tab) || grid || tab.firstChild;
    if (bar.parentNode !== tab || bar.nextSibling !== before) tab.insertBefore(bar, before);
  }
  function render() {
    const d = dl();
    if (!d) { if (bar) { bar.remove(); bar = null; } lastKey = ''; return; }
    if (!bar) { bar = document.createElement('section'); bar.className = 'dl-bar'; bar.setAttribute('aria-label', 'Задания дня'); bar.addEventListener('click', (e) => { if (e.target.closest('[data-dl-open]')) openWin(); }); lastKey = ''; }
    const key = JSON.stringify(d);
    if (key !== lastKey) { bar.innerHTML = barHtml(d); lastKey = key; }
    place();
    if (obs) obs.takeRecords();
    if (!seenSent) { seenSent = true; apiAct({ op: 'seen' }).then((r) => { if (r && r.ok && r.first) toast('Ежедневный вход засчитан' + (r.streak > 1 ? ` - серия ${days(r.streak)}` : '')); if (r && r.ok) { data = r; if (dlg && dlg.open) fill(); } }); }
  }

   
  function taskRow(t) {
    const pct = t.of > 0 ? Math.round((Math.min(t.n, t.of) / t.of) * 100) : 0;
    const rr = !t.done && data && data.rerolls > 0 ? `<button type="button" class="btn ghost sm" data-dl-rr="${esc(t.id)}" title="Заменить на другое задание">Заменить</button>` : '';
    return `<li class="dl-t${t.done ? ' is-done' : ''}${t.air ? ' is-air' : ''}"><span class="dl-ck" aria-hidden="true">${t.done ? '✓' : ''}</span>`
      + `<span class="dl-tt"><b>${esc(t.t)}</b>${t.air ? '<small class="dl-air">только на эфире - засчитывает поход на стриме</small>' : ''}`
      + `<span class="dl-pr" role="progressbar" aria-valuemin="0" aria-valuemax="${t.of}" aria-valuenow="${Math.min(t.n, t.of)}" aria-label="Прогресс"><i style="width:${pct}%"></i></span></span>`
      + `<span class="dl-tn">${Math.min(t.n, t.of)}/${t.of}</span>${rr}<span class="sr-only">${t.done ? 'выполнено' : 'не выполнено'}</span></li>`;
  }
  function guildHtml(g) {
    if (!g) return '';
    const span = g.next != null ? Math.max(1, g.next - g.from) : 1, got = g.next != null ? Math.max(0, g.xp - g.from) : span, pct = Math.min(100, Math.round((got / span) * 100));
    const lv = (g.levels || []).map((x) => `<tr${x.lv === g.level ? ' class="is-cur"' : ''}><th scope="row">${x.lv}</th><td>${x.lv > 1 ? esc(x.xp) : '-'}</td><td>${x.pct ? '+' + esc(x.pct) + '%' : '-'}</td><td>${x.rr ? '+1' : '-'}</td><td>${x.coins ? money(x.coins) : '-'}</td></tr>`).join('');
    const xf = g.xpFor || {};
    return `<section class="dl-g" aria-label="Гильдия"><h3>Гильдия «${esc(g.name)}»${g.tag ? ` <small>[${esc(g.tag)}]</small>` : ''}</h3>`
      + `<div class="dl-gl-row"><b class="dl-gl-lv">Уровень ${g.level}</b><span>${g.next != null ? `опыт ${esc(g.xp)} из ${esc(g.next)}` : `опыт ${esc(g.xp)} - высший уровень`}</span></div>`
      + `<span class="dl-pr dl-pr-g" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Опыт гильдии до следующего уровня"><i style="width:${pct}%"></i></span>`
      + `<p class="dl-now">Сейчас: ${g.pct ? `+${esc(g.pct)}% монет за задания` : 'прибавки к монетам пока нет'}${g.rr ? ', ещё одна замена в день' : ''}.</p>`
      + (g.tenured ? '' : `<p class="dl-warn">Ты в гильдии меньше ${esc(g.joinHours)} ч - опыт гильдии и награды за уровень начнутся позже.</p>`)
      + `<p class="dl-how">Опыт гильдии: задание +${esc(xf.task)}, задание эфира +${esc(xf.air)}, все задания дня +${esc(xf.all)}, вход за день +${esc(xf.login)}. Мини-сражения гильдии - тоже.</p>`
      + `<div class="dl-tw"><table class="dl-lv"><caption>Что даёт уровень</caption><thead><tr><th scope="col">Ур.</th><th scope="col">Опыт</th><th scope="col">Монеты</th><th scope="col">Замена</th><th scope="col">Награда</th></tr></thead><tbody>${lv}</tbody></table></div>`
      + '<p class="dl-how">Награда за уровень - каждому участнику один раз. С уровнем растёт и гильдейский район.</p></section>';
  }
  function fill() {
    if (!dlg) return;
    const body = $('.dl-body', dlg);
    if (!data || !data.ok) { body.innerHTML = `<p class="dl-err">${esc((data && data.error) || 'Загрузка…')}</p>`; return; }
    const reg = (data.tasks || []).filter((t) => !t.air), air = (data.tasks || []).filter((t) => t.air);
    const c = data.coins || {};
    body.innerHTML = `<p class="dl-sub">Новые задания - каждый день в 05:00 по Москве. ${data.rerolls > 0 ? `Замен сегодня: ${data.rerolls}.` : 'Замены на сегодня закончились.'}</p>`
      + `<ol class="dl-ts">${reg.map(taskRow).join('')}</ol>`
      + (air.length ? `<h3 class="dl-h">Задание эфира</h3><ol class="dl-ts">${air.map(taskRow).join('')}</ol>` : '')
      + `<p class="dl-how">За задание ${money(c.task)}, за задание эфира ${money(c.air)}${data.guild && data.guild.pct ? ` (+${esc(data.guild.pct)}% от гильдии)` : ''}; за все задания дня - Сфера сохранения.${data.all ? ' <b>Сегодня всё выполнено.</b>' : ''}</p>`
      + `<p class="dl-how">Вход за день - ${money(c.login)}; серия: ${days(+data.streak || 0)}${data.today ? '' : ' (сегодня ещё не засчитан)'}. Каждые 7 дней серии - Счастливая звезда; пропуск откатывает серию, а не обнуляет.</p>`
      + gqHtml(data.gq)
      + guildHtml(data.guild);
  }
   
  const KIND_RU = { wood: 'Деревянный сундук', silver: 'Серебряный сундук', gold: 'Золотой сундук' };
  const KIND_C = { wood: ['#b9773f', '#7a4a22', '#e2b07a'], silver: ['#c9d2da', '#7d8a96', '#f4f8fb'], gold: ['#f2c443', '#a8741a', '#fff0a8'] };
   
  function chestSvg(k, size = 40) {
    const [a, b, l] = KIND_C[k] || KIND_C.wood;
    return `<svg class="gq-chest" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><path d="M5 17h30v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="${a}" stroke="#2b1d18" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M5 17c0-7 5-11 15-11s15 4 15 11z" fill="${l}" stroke="#2b1d18" stroke-width="2.5" stroke-linejoin="round"/><path d="M5 17h30" stroke="#2b1d18" stroke-width="2.5"/>`
      + `<path d="M11 8v27M29 8v27" stroke="${b}" stroke-width="3"/><rect x="16.5" y="15" width="7" height="8" rx="1.5" fill="${b}" stroke="#2b1d18" stroke-width="2"/><circle cx="20" cy="19" r="1.4" fill="#2b1d18"/></svg>`;
  }
  const leftTxt = (ms) => { const h = Math.floor(ms / 3600e3); return h >= 24 ? `ещё ${Math.floor(h / 24)} д ${h % 24} ч` : h >= 1 ? `ещё ${h} ч` : `ещё ${Math.max(1, Math.round(ms / 60e3))} мин`; };
  function gqRow(t) {
    const pct = t.of > 0 ? Math.round((Math.min(t.n, t.of) / t.of) * 100) : 0;

    if (t.old && !t.done) return `<li class="dl-t is-old"><span class="dl-ck" aria-hidden="true"></span><span class="dl-tt"><b>${esc(t.t)}</b><small>больше не засчитывается - завтра будет другое</small></span><span class="dl-tn">-</span></li>`;
    return `<li class="dl-t${t.done ? ' is-done' : ''}${t.k ? ' is-gq' : ''}"><span class="dl-ck" aria-hidden="true">${t.done ? '✓' : t.k ? chestSvg(t.k, 22) : ''}</span>`
      + `<span class="dl-tt"><b>${esc(t.t)}</b>${t.k ? `<small>${esc(KIND_RU[t.k])} каждому участнику</small>` : ''}`
      + `<span class="dl-pr" role="progressbar" aria-valuemin="0" aria-valuemax="${t.of}" aria-valuenow="${Math.min(t.n, t.of)}" aria-label="Прогресс"><i style="width:${pct}%"></i></span></span>`
      + `<span class="dl-tn">${Math.min(t.n, t.of)}/${t.of}</span><span class="sr-only">${t.done ? 'выполнено' : 'не выполнено'}</span></li>`;
  }
  function gqHtml(q) {
    if (!q) return '';
    const n = (q.gift || []).length;
    return `<section class="dl-g gq" aria-label="Задания гильдии"><h3>Задания гильдии</h3><p class="dl-how">Свои - за каждое ${money(q.coins)} и опыт гильдии.</p><ol class="dl-ts">${(q.mine || []).map(gqRow).join('')}</ol>`
      + `<h3 class="dl-h">Вместе с гильдией</h3><p class="dl-how">Общий счёт всех участников за день. Выполнили - сундук в «Подарке» каждому (каждый вид - раз в день).</p><ol class="dl-ts">${(q.guild || []).map(gqRow).join('')}</ol>`
      + `<button type="button" class="btn gq-open" data-gq-gift>${chestSvg('gold', 22)} Подарок${n ? ` <span class="gq-n">${n}</span>` : ''}</button></section>`;
  }
  let gdlg = null, gres = null;
  function giftFill() {
    if (!gdlg) return;
    const body = $('.dl-body', gdlg), q = data && data.ok ? data.gq : null;
    if (!data) { body.innerHTML = '<p class="dl-err">Загрузка…</p>'; return; }
    if (!q) { body.innerHTML = `<p class="dl-err">${esc((data && data.error) || 'Подарок - только в гильдии')}</p>`; return; }
    const list = q.gift || [];
    body.innerHTML = `<p class="dl-sub">Сундуки за общие задания гильдии. Лежат ${esc(q.days)} дн. - потом пропадают.</p>`
      + (gres ? `<div class="gq-got" role="status">${gres}</div>` : '')
      + (list.length ? `<ul class="gq-list">${list.map((c) => `<li class="gq-c gq-${esc(c.k)}">${chestSvg(c.k, 52)}<span class="gq-ct"><b>${esc(KIND_RU[c.k] || 'Сундук')}</b><small>${esc(c.why)}</small><small class="gq-left">${leftTxt(+c.left || 0)}</small></span><button type="button" class="btn sm" data-gq-open="${esc(c.i)}">Открыть</button></li>`).join('')}</ul>`
        + (list.length > 1 ? '<button type="button" class="btn gq-all" data-gq-open="all">Открыть всё</button>' : '')
        : '<p class="gq-empty">Сундуков пока нет. Выполняйте общие задания гильдии - сундук получит каждый.</p>');
  }
  function openGift() {
    if (!gdlg) {
      gdlg = document.createElement('dialog'); gdlg.className = 'dl-dlg gq-dlg'; gdlg.setAttribute('aria-labelledby', 'gqTitle');
      gdlg.innerHTML = '<div class="dl-hd"><h2 id="gqTitle">Подарок гильдии</h2><button type="button" class="dl-x" data-dl-close aria-label="Закрыть">×</button></div><div class="dl-body"></div>';
      gdlg.addEventListener('click', onGift);
      document.body.appendChild(gdlg);
    }
    gres = null; giftFill();
    if (typeof gdlg.showModal === 'function') { if (!gdlg.open) gdlg.showModal(); } else gdlg.setAttribute('open', '');
    apiGet().then((r) => { data = r; giftFill(); });
  }
  function onGift(e) {
    if (e.target === gdlg || e.target.closest('[data-dl-close]')) { if (gdlg.close) gdlg.close(); else gdlg.removeAttribute('open'); return; }
    const b = e.target.closest('[data-gq-open]'); if (!b || busy) return;
    busy = true; b.disabled = true;
    const i = b.getAttribute('data-gq-open');
    apiAct({ op: 'gift', i: i === 'all' ? 'all' : +i }).then((r) => {
      busy = false;
      if (r && r.ok) {
        data = r;
        const got = r.got || [], coins = got.reduce((s, x) => s + (+x.coins || 0), 0), its = got.flatMap((x) => x.items || []);
        gres = `<b>Из ${got.length > 1 ? got.length + ' сундуков' : 'сундука'}:</b> ${money(coins)}${its.length ? ', ' + its.map((x) => esc(ITEM_RU[x.id] || x.id) + (x.ok ? '' : ' (не влезло в сумку)')).join(', ') : ''}`;
        giftFill(); toast('Сундук открыт');
      } else { toast((r && r.error) || 'не вышло', true); b.disabled = false; }
    });
  }
  const ITEM_RU = { enchant_sphere: 'Сфера сохранения', enchant_star: 'Счастливая звезда' };
  function openWin() {
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'dl-dlg'; dlg.setAttribute('aria-labelledby', 'dlTitle');
      dlg.innerHTML = '<div class="dl-hd"><h2 id="dlTitle">Задания дня</h2><button type="button" class="dl-x" data-dl-close aria-label="Закрыть">×</button></div><div class="dl-body"></div>';
      dlg.addEventListener('click', onWin);
      dlg.addEventListener('cancel', () => {   });
      document.body.appendChild(dlg);
    }
    fill();
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
    apiGet().then((r) => { data = r; fill(); });
  }
  function onWin(e) {
    if (e.target === dlg || e.target.closest('[data-dl-close]')) { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); return; }
    if (e.target.closest('[data-gq-gift]')) { if (dlg.close) dlg.close(); openGift(); return; }
    const b = e.target.closest('[data-dl-rr]'); if (!b || busy) return;
    busy = true; b.disabled = true;
    apiAct({ op: 'reroll', id: b.getAttribute('data-dl-rr') }).then((r) => {
      busy = false;
      if (r && r.ok) { data = r; fill(); toast('Задание заменено'); } else { toast((r && r.error) || 'не вышло', true); b.disabled = false; }
    });
  }

  window.LGDailies = {
    init(h) {
      H = h || null;
      const tab = $('#tab-hero');
      if (tab && !obs && typeof MutationObserver === 'function') { obs = new MutationObserver(() => { if (bar) { place(); obs.takeRecords(); } }); obs.observe(tab, { childList: true }); }
      render();
    },
    sync() { if (H) setTimeout(render, 0); },
    open: openWin,
     
    gift: openGift,
    giftCount: () => { const d = dl(); return d ? +d.gf || 0 : 0; },
    giftOn: () => !!dl(),
     
    state: () => ({ bar: !!bar, data: dl(), win: !!(dlg && dlg.open) }),
  };
})();
