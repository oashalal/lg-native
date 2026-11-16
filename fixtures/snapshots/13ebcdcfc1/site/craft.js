













(function () {
  'use strict';
  const CR = {
    fish: {
      name: 'Рыбалка', place: 'Причал', icon: '🎣', seller: 'Рыбак Сом',
      go: 'Забросить', act: 'Подсечь!', stop: 'Смотать', idle: 'Удочка смотана. Забрось - заход идёт сам, даже если закрыть сайт.',
      on: 'Удочка заброшена - ждём улов', bite: 'Клюёт! Подсекай', how: [
        '«Забросить» - заход на {len} мин: каждую минуту в сумку рыбака идёт рыба, иногда - соль, раковины и другая добыча. Сайт можно закрыть.',
        'Иногда клюёт крупная рыба: поплавок ныряет - успей «Подсечь» за полторы минуты, будет редкий улов (янтарь, жемчуг). Не успел - ничего не теряешь.',
        'Рыбачат только в городах с водой: у моря, озера, реки и на льду. В городе без воды рыбалки нет.',
        'Улов продаётся Рыбаку Сому: монеты - тебе за весь улов. Городу - часть улова на склад ресурсов (виден в Ратуше), за остальное - монеты в казну, на стены, башни и здания.',
        'В сутки - {cap} мин рыбалки (новые сутки в 05:00 МСК). В походе удочка сматывается сама - улов остаётся.',
      ],
      dry: 'В этом городе нет воды - рыбалки нет', wet: 'Рыбачат в городах у моря, озера, реки и на льду',
    },
  };
  const SH = 100;
  let X = null, W = null, K = '', shut = null, T = 0, sig = '', wait = '', PL = '';
  const esc = (s) => (X && X.esc ? X.esc(s) : String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]));
  const me = () => { const h = X && X.hero ? X.hero() : null; return (h && h.cr && h.cr[K]) || null; };
  const shTxt = (v) => String(+(Math.max(0, Math.floor(+v || 0)) / SH).toFixed(2)).replace('.', ',');
   
  const hereOf = () => { try { return (X && X.town && X.town()) || ''; } catch (e) { return ''; } };
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return s >= 60 ? `${Math.ceil(s / 60)} мин` : `${s} с`; };

   

  function art(k, st) {
    if (k !== 'fish') return '';
    return `<svg class="cr-art" data-art="fish-pier" viewBox="0 0 320 120" role="img" aria-label="Причал (рисунок - заглушка)">
      <rect x="0" y="0" width="320" height="120" fill="var(--surface2, #dfe7ef)"/>
      <rect x="0" y="56" width="320" height="64" fill="#5d8db3" opacity=".55"/>
      <path d="M0 62 Q20 58 40 62 T80 62 T120 62 T160 62 T200 62 T240 62 T280 62 T320 62" fill="none" stroke="#fff" stroke-opacity=".5"/>
      <rect x="0" y="44" width="110" height="10" fill="#7a5a3a"/><rect x="18" y="54" width="6" height="40" fill="#5c4026"/><rect x="84" y="54" width="6" height="40" fill="#5c4026"/>
      <g data-art="fish-npc"><circle cx="66" cy="22" r="8" fill="#c99a6b"/><rect x="58" y="30" width="16" height="14" rx="3" fill="#3f5f4a"/></g>
      ${st !== 'idle' ? `<path d="M74 30 L210 4" stroke="#3b2a1a" stroke-width="2"/><path d="M210 4 L220 ${st === 'bite' ? 74 : 60}" stroke="#ddd" stroke-width="1"/>
      <g class="cr-float${st === 'bite' ? ' bite' : ''}" data-art="fish-float"><circle cx="220" cy="${st === 'bite' ? 76 : 62}" r="5" fill="#c81e17"/><circle cx="220" cy="${st === 'bite' ? 72 : 58}" r="3" fill="#fff"/></g>` : ''}
      <text x="316" y="114" text-anchor="end" font-size="9" fill="#fff" opacity=".7">рисунок - заглушка</text>
    </svg>`;
  }

  function stateOf(m, t = Date.now()) { if (!m) return 'idle'; if (m.bite && m.bite > t) return 'bite'; return m.on && m.until > t ? 'on' : 'idle'; }

  function render() {
    if (!W) return;
    const m = me(), C = CR[K];
    if (!m || !C) { W.querySelector('.cr-body').innerHTML = '<p class="muted">Ремесло сейчас закрыто.</p>'; return; }
    const st = stateOf(m), bag = Object.entries(m.bag || {}).filter(([, v]) => +v > 0);


    const pls = Array.isArray(m.pl) ? m.pl : [], dry = Array.isArray(m.dry) ? m.dry : [], here = hereOf();
    const dryHere = st === 'idle' && !!here && dry.some((x) => x.id === here), atHere = !!here && pls.some((x) => x.id === here);
    if (atHere) PL = here; else if (!pls.some((x) => x.id === PL)) PL = (pls[0] && pls[0].id) || '';
    const cur = pls.find((x) => x.id === (st !== 'idle' && m.c ? m.c : PL));
    const wetList = pls.length ? `${esc(C.wet || '')}: ${pls.map((x) => esc(x.nm || x.id)).join(', ')}.` : esc(C.wet || '');
    const where = dryHere || (st === 'idle' && !pls.length && C.dry)
      ? `<p class="cr-dry" role="status"><b>${esc(C.dry)}</b><br><span class="muted">${wetList}</span></p>`
      : st === 'idle' && pls.length > 1 && !atHere
        ? `<label class="cr-pl">Место: <select data-pl>${pls.map((x) => `<option value="${esc(x.id)}"${x.id === PL ? ' selected' : ''}>${esc(x.nm || x.id)}</option>`).join('')}</select></label>`
        : cur && cur.nm ? `<p class="muted cr-pl">${esc(C.place)} - ${esc(cur.nm)}</p>` : '';
    const noGo = dryHere || !pls.length;
    const val = bag.reduce((a, [r, v]) => a + (+v || 0) * (+(m.pr || {})[r] || 0) / SH, 0);
    const btn = st === 'bite' ? `<button type="button" class="btn primary cr-big" data-a="craftAct">${esc(C.act)}</button><button type="button" class="btn ghost" data-a="craftStop">${esc(C.stop)}</button>`
      : st === 'on' ? `<button type="button" class="btn ghost" data-a="craftStop">${esc(C.stop)}</button>`
        : `<button type="button" class="btn primary" data-a="craftGo"${(m.cap && m.used >= m.cap) || noGo ? ' disabled' : ''}>${esc(C.go)} (${m.len || 20} мин)</button>`;
    W.querySelector('.cr-body').innerHTML = `
      ${art(K, st)}
      ${where}
      <p class="cr-st" aria-live="polite"><b>${esc(st === 'bite' ? C.bite : st === 'on' ? C.on : C.idle)}</b> <span class="cr-left"></span></p>
      <div class="cr-act">${btn}</div>
      <h4>Улов в сумке</h4>
      ${bag.length ? `<ul class="cr-bag">${bag.map(([r, v]) => `<li><span>${esc((m.nm || {})[r] || r)}</span><b>${shTxt(v)} шт.</b></li>`).join('')}</ul>` : '<p class="muted">Пока пусто.</p>'}
      <div class="cr-act"><button type="button" class="btn ghost" data-a="craftSell"${bag.length ? '' : ' disabled'}>Продать улов: ${esc(C.seller)}${val >= 1 ? ` (≈ ${Math.floor(val)} монет)` : ''}</button></div>
      <p class="muted cr-meta">Сегодня: ${m.used || 0}${m.cap ? ` / ${m.cap}` : ''} мин · мастерство ${m.lv || 1}${m.need ? ` (${m.xp || 0} / ${m.need})` : ''}</p>
      <details class="cr-how"><summary>Как устроено</summary><ul>${C.how.map((s) => `<li>${esc(s.replace('{len}', m.len || 20).replace('{cap}', m.cap || '-'))}</li>`).join('')}</ul></details>`;
    W.querySelectorAll('[data-a]').forEach((b) => { b.onclick = () => send(b.dataset.a, b); });
    const sel = W.querySelector('[data-pl]'); if (sel) sel.onchange = () => { PL = sel.value; };
    tick();
  }
   
  function tick() {
    if (!W) return;
    const m = me(), t = Date.now(), st = stateOf(m, t), s = JSON.stringify([st, m && m.bag, m && m.used, m && m.lv, m && m.pl, m && m.dry, m && m.c, hereOf(), wait]);
    if (s !== sig) { sig = s; render(); return; }
    const el = W.querySelector('.cr-left'); if (!el) return;
    el.textContent = st === 'bite' ? `- ещё ${mmss(m.bite - t)}` : st === 'on' ? `- ещё ${mmss(m.until - t)}` : '';
  }
  async function send(op, b) {
    if (wait) return;
    wait = op; if (b) b.disabled = true;

    const m = me(), many = m && Array.isArray(m.pl) && m.pl.length > 1, here = hereOf();
    let r = null; try { r = await X.api('/api/' + op, { k: K, ...(op === 'craftGo' && !here && many && PL ? { c: PL } : {}) }); } catch (e) { r = { ok: false, error: 'нет связи' }; }
    if (!r || !r.ok) { wait = ''; X.toast((r && r.error) || 'Не вышло', true); sig = ''; tick(); return; }
    setTimeout(() => { if (wait === op) { wait = ''; sig = ''; tick(); } }, 8000);
  }

  function open(x, k) {
    if (!CR[k]) return;
    close();
    X = x; K = k; sig = ''; wait = '';
    const C = CR[k];
    const d = document.createElement('div'); d.className = 'cr-w'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', C.name);
    d.innerHTML = `<div class="cr panel"><header class="cr-h"><h3 class="h3">${esc(C.icon)} ${esc(C.name)} <small>${esc(C.place)}</small></h3><button type="button" class="btn ghost cr-x" data-x aria-label="Закрыть">×</button></header><div class="cr-body"></div></div>`;
    W = d;
    shut = X.layer ? X.layer(d, { onClose: () => { clearInterval(T); W = null; shut = null; } }) : (() => { document.body.appendChild(d); return () => { d.remove(); clearInterval(T); W = null; shut = null; }; })();
    d.querySelector('[data-x]').onclick = () => close();
    render();
    T = setInterval(tick, 1000);
  }
  function close() { if (shut) shut(); }

  function hub(x, o = {}) {
    X = x;
    const h = x.hero ? x.hero() : null, cr = (h && h.cr) || {}, t = Date.now();
    const items = Object.keys(cr).filter((k) => CR[k]);
    const d = document.createElement('div'); d.className = 'cr-w'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Ремёсла города');
    d.innerHTML = `<div class="cr panel cr-hub"><h3 class="h3">Ремёсла города</h3><p class="muted">Добытое идёт в казну города - на стены, башни и здания Ратуши.</p><ul>
      ${o.mine ? '<li><button type="button" class="btn ghost" data-go="mine"><span aria-hidden="true">⛏</span><b>Шахта</b><small>руда, самоцветы</small></button></li>' : ''}
      ${items.map((k) => { const m = cr[k], st = stateOf(m, t), n = Object.values(m.bag || {}).reduce((a, v) => a + (+v || 0), 0), here = (x.town && x.town()) || '', dry = st === 'idle' && ((here && Array.isArray(m.dry) && m.dry.some((y) => y.id === here)) || !(Array.isArray(m.pl) && m.pl.length)); return `<li><button type="button" class="btn ghost" data-go="${esc(k)}"><span aria-hidden="true">${esc(CR[k].icon)}</span><b>${esc(CR[k].name)}</b><small>${st === 'bite' ? 'клюёт!' : st === 'on' ? 'удочка заброшена' : dry ? 'здесь нет воды' : CR[k].place}${n ? ` · улов ${shTxt(n)} шт.` : ''}</small></button></li>`; }).join('')}
    </ul><button type="button" class="btn primary" data-x>Закрыть</button></div>`;
    const sh = x.layer ? x.layer(d) : (() => { document.body.appendChild(d); return () => d.remove(); })();
    d.querySelector('[data-x]').onclick = sh;
    d.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => { sh(); if (b.dataset.go === 'mine') { if (o.mine) o.mine(); } else open(x, b.dataset.go); }; });
    try { d.querySelector('[data-go]').focus({ preventScroll: true }); } catch (e) {   }
  }

  function result(x) {
    const op = x && x.x && x.x.op;
    if (op && op === wait) wait = '';
    if (!x.ok) { if (X) X.toast(x.error || 'Не вышло', true); } else if (x.x && x.x.t && X) X.toast(x.x.t);
    sig = ''; tick();
  }

  window.LGCraft = { hub, open, close, result, hero: () => { if (W) tick(); }, get on() { return !!W; } };
})();
