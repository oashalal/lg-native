

























(function (root, factory) {
  const UI = typeof module === 'object' && module.exports ? require('../ui-kit') : root.LGUi;
  const api = factory(root, UI);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LGSiteUi = api;
})(typeof self !== 'undefined' ? self : this, function (root, UI) {
  'use strict';
  if (!UI) throw new Error('site-ui: нужен ui-kit (/lib/ui-kit.js) до /lib/site-ui.js');
  const { esc, plural, pluralN, timeAgo } = UI;

   


  const MUNIT = (n) => (n >= 10000 ? 'g' : n >= 100 ? 's' : 'b');
  const FB = { g: 'зол.', s: 'сер.', b: 'мед.' };
  function moneyParts(n, ref, coins) {
    n = Math.max(0, Math.floor(+n || 0));
    const g = Math.floor(n / 10000), s = Math.floor(n / 100) % 100, b = n % 100;
    const C = (typeof coins === 'function' ? coins() : coins) || {};
    const w = (k, v) => { const f = C[k] && C[k].forms; return f ? plural(v, f[0], f[1], f[2]) : FB[k]; };
    const out = [['g', g], ['s', s], ['b', b]].filter(([, v]) => v > 0);
    if (!out.length) out.push([MUNIT(Math.max(0, Math.floor(+ref || 0))), 0]);
    return out.map(([k, v]) => [k, v, w(k, v)]);
  }
  const money = (n, ref, coins) => `<span class="m">${moneyParts(n, ref, coins).map(([k, v, t]) => `<b class="m${k}">${v}</b> ${t}`).join(' ')}</span>`;
  const moneyText = (n, ref, coins) => moneyParts(n, ref, coins).map(([, v, t]) => `${v} ${t}`).join(' ');

  function lack(price, have, cls = '', coins) {
    price = Math.max(0, Math.floor(+price || 0)); have = Math.max(0, Math.floor(+have || 0));
    return `<p class="note lack${cls ? ' ' + cls : ''}">У тебя: ${money(have, price, coins)}<br>Не хватает: ${money(price - have, price, coins)}</p>`;
  }

  const bal = (price, have, cls = '', coins) => ((+have || 0) < (+price || 0) ? lack(price, have, cls, coins)
    : `<p class="note bal${cls ? ' ' + cls : ''}">У тебя: ${money(Math.max(0, +have || 0), price, coins)}</p>`);

   



  function toast(text, bad, o = {}) {
    if (typeof document === 'undefined') return;
    const el = o.el || document.getElementById('toast'); if (!el) return;
    UI.toast(text, { el, cls: 'toast', err: !!bad, ms: o.ms || 2800, key: o.key });
  }

   



  const ARM = typeof WeakMap === 'function' ? new WeakMap() : null;
  function confirmTwice(btn, o = {}) {
    const st = ARM.get(btn), now = Date.now();
    if (st && st.until > now) { if (o.once) { clearTimeout(st.t); ARM.delete(btn); } return true; }
    if (st) { clearTimeout(st.t); restore(btn, st); }
    const ms = o.ms || 4000, s = { until: now + ms, was: btn.innerHTML, cls: o.cls || '', mark: o.mark || '', t: 0 };
    if (o.html != null) btn.innerHTML = o.html; else if (o.text != null) btn.textContent = o.text;
    if (s.cls) btn.classList.add(s.cls);
    if (s.mark) btn.dataset[s.mark] = '1';
    s.t = setTimeout(() => { if (ARM.get(btn) !== s) return; ARM.delete(btn); if (btn.isConnected) restore(btn, s); }, ms);
    ARM.set(btn, s);
    return false;
  }
  function restore(btn, s) { btn.innerHTML = s.was; if (s.cls) btn.classList.remove(s.cls); if (s.mark) delete btn.dataset[s.mark]; }
  const armed = (btn) => { const st = ARM.get(btn); return !!(st && st.until > Date.now()); };

   
  const MQ = {
    phone: '(max-width: 720px)',
    tablet: '(min-width: 720px)',
    wide: '(min-width: 1100px)',
    narrow: '(max-width: 1099px)',
    touch: '(pointer: coarse)',
    hover: '(hover: hover)',
    nohover: '(hover: none)',
    reduced: '(prefers-reduced-motion: reduce)',
  };
  const mqCache = {};
  function media(q) {
    q = MQ[q] || q;
    if (!(q in mqCache)) { try { mqCache[q] = root.matchMedia ? root.matchMedia(q) : null; } catch { mqCache[q] = null; } }
    return mqCache[q] || { matches: false, media: q, addEventListener() {}, removeEventListener() {} };
  }
  const is = (q) => !!media(q).matches;

  



  const AW_PATH = {
    '✦': 'M8 0.8 9.7 6.3 15.2 8 9.7 9.7 8 15.2 6.3 9.7 0.8 8 6.3 6.3Z',
    '♥': 'M8 14.6 6.9 13.6C3 10.1.5 7.8.5 5 .5 2.7 2.3 1 4.5 1 5.8 1 7.1 1.6 8 2.6 8.9 1.6 10.2 1 11.5 1 13.7 1 15.5 2.7 15.5 5c0 2.8-2.5 5.1-6.4 8.6Z',
    '❖': 'M8 .4 11.6 4 8 7.6 4.4 4ZM12 4.4 15.6 8 12 11.6 8.4 8ZM8 8.4 11.6 12 8 15.6 4.4 12ZM4 4.4 7.6 8 4 11.6.4 8Z',
    '⚑': 'M3 1h1.6v14H3ZM5.4 1.6h8.6l-2.4 3.6 2.4 3.6H5.4Z',
  };
  function awIco(i) {
    const k = String(i || '✦'), p = AW_PATH[k];
    if (p) return `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${p}" fill="currentColor"/></svg>`;
    return `<svg viewBox="0 0 16 16" aria-hidden="true"><text x="8" y="12.4" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">${esc(k.slice(0, 2))}</text></svg>`;
  }

  



  function keepField(form, inp) {
    const btn = form && form.querySelector('button[type="submit"], button:not([type])');

    if (btn) btn.addEventListener('mousedown', (e) => { if (root.document && root.document.activeElement === inp) e.preventDefault(); });
    return function back(had) {
      const D = root.document; if (!D || !inp || !inp.isConnected || inp.disabled) return;
      const a = D.activeElement;
      if (a === inp || (a && a !== D.body && a !== D.documentElement && !(form && form.contains(a)))) return;
      if (!had && is('touch')) return;
      try { inp.focus({ preventScroll: true }); } catch (e) {   }
    };
  }

   





  const LAYERS = [];
  const fieldOf = (t) => !!(t && t.closest && (t.closest('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, select') || t.isContentEditable));
  function layer(el, o = {}) {
    let open = true;
    const shut = () => { if (!open) return; open = false; const i = LAYERS.indexOf(el); if (i >= 0) LAYERS.splice(i, 1); el.remove(); document.removeEventListener('keydown', key); if (o.onClose) o.onClose(); };
    const key = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (fieldOf(e.target)) { if (el.contains(e.target)) { e.preventDefault(); try { e.target.blur(); } catch {   } } return; }

      const top = [...LAYERS].reverse().find((x) => x.isConnected);
      if (top !== el) return;
      e.preventDefault();
      shut();
    };
    LAYERS.push(el);
    document.addEventListener('keydown', key);
    el.addEventListener('pointerdown', (e) => { if (e.target === el) shut(); });
    if (!el.isConnected) (o.host || document.fullscreenElement || document.body).appendChild(el);
    return shut;
  }
  


  function askText(o = {}) {
    const max = o.max || 500, el = document.createElement('div');
    el.className = 'lg-ask'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', o.title || 'Окно');
    el.innerHTML = `<form class="lg-ask-w"><h2>${esc(o.title || '')}</h2>${o.info ? `<div class="lg-ask-i">${o.info}</div>` : ''}${o.hint ? `<p class="lg-ask-h">${esc(o.hint)}</p>` : ''}`
      + (o.field === false ? '' : `<textarea maxlength="${max}" rows="5" aria-label="${esc(o.title || 'Текст')}"></textarea><p class="lg-ask-n"><span>0</span> / ${max}</p>`)
      + `<p class="lg-ask-e" role="alert"></p><div class="lg-ask-b"><button type="button" data-x>${o.field === false ? 'Закрыть' : 'Отмена'}</button>${o.field === false ? '' : `<button type="submit" class="lg-ask-go">${esc(o.ok || 'Отправить')}</button>`}</div></form>`;
    const shut = layer(el);
    const ta = el.querySelector('textarea'), err = el.querySelector('.lg-ask-e');
    el.querySelector('[data-x]').onclick = shut;
    if (ta) { ta.addEventListener('input', () => { el.querySelector('.lg-ask-n span').textContent = String([...ta.value].length); }); setTimeout(() => ta.focus(), 0); }
    el.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault(); if (!ta || !o.send) return;
      const t = ta.value.trim(); if (!t) { err.textContent = o.empty || 'Напиши текст.'; return; }
      const b = el.querySelector('.lg-ask-go'); b.disabled = true;
      try { const r = await o.send(t); if (r && r.ok) shut(); else err.textContent = (r && r.error) || 'Не отправилось - попробуй ещё раз.'; }
      catch (x) { console.warn('[окно] отправка', x); err.textContent = 'Нет связи - попробуй ещё раз.'; }
      finally { b.disabled = false; }
    });
    return shut;
  }
  



  const REASONS = ['спам', 'оскорбления', 'флуд', 'реклама'];
  








  const DLG_CSS = `.lg-dlg{position:fixed;inset:0;z-index:2147483500;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(6,6,12,.62);animation:lg-dlg-f .14s ease-out}
.lg-dlg-w{box-sizing:border-box;width:min(440px,100%);max-height:calc(100dvh - 32px);overflow-y:auto;margin:0;padding:20px 20px 16px;border-radius:var(--pop-r,14px);background:var(--surface,#1d1828);color:var(--ink,#f3eefc);border:1px solid var(--line,rgba(255,255,255,.16));box-shadow:0 24px 60px rgba(0,0,0,.5);font:500 15px/1.45 var(--tx,system-ui,sans-serif);animation:lg-dlg-in .16s cubic-bezier(.2,.8,.2,1)}
.lg-dlg-w h2{margin:0 0 8px;font:400 clamp(19px,2.6vw,22px)/1.2 var(--hd,var(--tx,system-ui,sans-serif));overflow-wrap:anywhere}
.lg-dlg-t{margin:0;white-space:pre-line;overflow-wrap:anywhere}
.lg-dlg-n{margin:8px 0 0;color:var(--mute,#b9b0cc);font-size:13px;white-space:pre-line}
.lg-dlg-i{display:block;box-sizing:border-box;width:100%;min-height:44px;margin:12px 0 0;padding:10px 12px;border:1px solid var(--line,rgba(255,255,255,.22));border-radius:calc(var(--pop-r,12px) - 4px);background:rgba(127,127,127,.12);color:inherit;font:500 16px/1.4 var(--tx,system-ui,sans-serif);resize:vertical}
.lg-dlg-i:focus-visible{outline:2px solid var(--accent,#ffcf4a);outline-offset:1px}
.lg-dlg-b{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:16px}
.lg-dlg-b button{min-height:44px;padding:0 18px;border:1px solid var(--line,rgba(255,255,255,.2));border-radius:calc(var(--pop-r,12px) - 2px);background:transparent;color:inherit;font:700 15px/1 var(--tx,system-ui,sans-serif);cursor:pointer}
.lg-dlg-b button:focus-visible{outline:2px solid var(--focus,var(--accent,#ffcf4a));outline-offset:2px}
.lg-dlg-b .lg-dlg-go{background:var(--accent,#ffcf4a);border-color:transparent;color:var(--bg,#1d1828)}
.lg-dlg .lg-dlg-b .btn.lg-dlg-bad{background:var(--dn,#e5484d);border-color:transparent;color:var(--bg,#fff);box-shadow:none}
.lg-dlg-b button:disabled{opacity:.55;cursor:not-allowed}
@keyframes lg-dlg-f{from{opacity:0}}@keyframes lg-dlg-in{from{opacity:0;transform:translateY(10px) scale(.98)}}
@media (max-width:520px){.lg-dlg{align-items:flex-end;padding:12px 12px calc(12px + env(safe-area-inset-bottom))}.lg-dlg-w{width:100%;padding:18px 16px 14px}
.lg-dlg-b{flex-direction:column-reverse;align-items:stretch}.lg-dlg-b button{width:100%;min-height:50px;font-size:16px}@keyframes lg-dlg-in{from{opacity:0;transform:translateY(24px)}}}
@media (prefers-reduced-motion:reduce){.lg-dlg,.lg-dlg-w{animation:none}}`;
  let dlgN = 0;
  function dialog(kind, o) {
    if (typeof o === 'string') o = { text: o };
    o = o || {};
    const none = kind === 'input' ? null : kind === 'tell' ? undefined : false;
    return new Promise((resolve) => {
      if (typeof document === 'undefined' || !document.body) { resolve(none); return; }
      if (!document.getElementById('lg-dlg-css')) { const s = document.createElement('style'); s.id = 'lg-dlg-css'; s.textContent = DLG_CSS; (document.head || document.body).appendChild(s); }
      const id = 'lg-dlg' + (++dlgN), back = document.activeElement;
      const title = o.title || (kind === 'tell' ? 'Сообщение' : 'Подтвердите');
      const field = kind !== 'input' ? '' : o.multiline
        ? `<textarea class="lg-dlg-i" rows="4" maxlength="${o.max || 200}" aria-labelledby="${id}t" placeholder="${esc(o.placeholder || '')}">${esc(o.value || '')}</textarea>`
        : `<input class="lg-dlg-i" type="text" maxlength="${o.max || 200}" enterkeyhint="done" autocomplete="off" aria-labelledby="${id}t" placeholder="${esc(o.placeholder || '')}" value="${esc(o.value || '')}">`;
      const yes = kind === 'tell' ? (o.ok || 'Понятно') : (o.yes || 'Да');
      const el = document.createElement('div');
      el.className = 'lg-dlg';
      el.innerHTML = `<form class="lg-dlg-w" role="${o.danger ? 'alertdialog' : 'dialog'}" aria-modal="true" aria-labelledby="${id}t"${o.text ? ` aria-describedby="${id}d"` : ''}>`
        + `<h2 id="${id}t">${esc(title)}</h2>${o.text ? `<p class="lg-dlg-t" id="${id}d">${esc(o.text)}</p>` : ''}${o.note ? `<p class="lg-dlg-n">${esc(o.note)}</p>` : ''}${field}`
        + `<div class="lg-dlg-b">${kind === 'tell' ? '' : `<button type="button" class="btn ghost lg-dlg-no" data-dlg="no">${esc(o.no || 'Отмена')}</button>`}`
        + `<button type="submit" class="btn ${o.danger ? 'lg-dlg-bad' : 'primary lg-dlg-go'}" data-dlg="yes">${esc(yes)}</button></div></form>`;
      const form = el.querySelector('form'), inp = el.querySelector('.lg-dlg-i');
      let done = false, downOut = false;
      const fin = (ok) => {
        if (done) return; done = true;
        window.removeEventListener('keydown', key, true);
        el.remove();
        try { if (back && back.isConnected && back.focus) back.focus({ preventScroll: true }); } catch (e) {   }
        resolve(!ok ? none : kind === 'input' ? [...String(inp.value).trim()].slice(0, o.max || 200).join('') : kind === 'tell' ? undefined : true);
      };

      const key = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); fin(false); return; }
        if (e.key === 'Tab') {
          const all = [...el.querySelectorAll('button, input, textarea')].filter((x) => !x.disabled);
          const i = all.indexOf(document.activeElement);
          if (i < 0 || (e.shiftKey ? i === 0 : i === all.length - 1)) { e.preventDefault(); all[e.shiftKey ? all.length - 1 : 0].focus(); }
        }
      };
      window.addEventListener('keydown', key, true);
      el.addEventListener('pointerdown', (e) => { downOut = e.target === el; });
      el.addEventListener('click', (e) => { if (e.target === el && downOut) fin(false); else if (e.target.closest('[data-dlg="no"]')) fin(false); });
      form.addEventListener('submit', (e) => { e.preventDefault(); fin(true); });
      (document.fullscreenElement || document.body).appendChild(el);
      const first = inp || el.querySelector(kind === 'tell' ? '[data-dlg="yes"]' : '[data-dlg="no"]');
      try { first.focus({ preventScroll: true }); if (inp && inp.select) inp.select(); } catch (e) {   }
    });
  }
  const ask = (o) => dialog('ask', o), askInput = (o) => dialog('input', o), tell = (o) => dialog('tell', o);
  function askReason(o = {}) {
    return new Promise((resolve) => {
      const el = document.createElement('div');
      el.className = 'lg-why'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', o.title || 'Причина мута');
      el.style.cssText = 'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:rgba(8,6,14,.55);padding:12px;box-sizing:border-box';
      const B = 'font:600 14px/1.2 system-ui,sans-serif;border-radius:9px;border:1px solid rgba(255,255,255,.18);cursor:pointer;min-height:36px;padding:0 12px';
      el.innerHTML = `<form class="lg-why-w" style="width:min(360px,100%);box-sizing:border-box;background:#1d1828;color:#f3eefc;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:14px 14px 12px;box-shadow:0 12px 40px rgba(0,0,0,.5);font:14px/1.35 system-ui,sans-serif">
        <h2 style="margin:0 0 2px;font:800 17px/1.2 system-ui,sans-serif">${esc(o.title || 'Причина мута')}</h2>
        ${o.who || o.what ? `<p style="margin:0 0 10px;color:#b9b0cc;font-size:13px">${esc([o.who, o.what].filter(Boolean).join(' · '))}</p>` : ''}
        <input type="text" maxlength="200" enterkeyhint="done" autocomplete="off" placeholder="Причина (можно пусто)" aria-label="Причина" style="width:100%;box-sizing:border-box;min-height:40px;border-radius:9px;border:1px solid rgba(255,255,255,.22);background:#120f1a;color:inherit;padding:0 10px;font:15px system-ui,sans-serif">
        <div class="lg-why-q" style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 2px">${REASONS.map((r) => `<button type="button" data-q="${esc(r)}" style="${B};min-height:32px;background:#2b2440;color:#e9e2f7;font-weight:500">${esc(r)}</button>`).join('')}</div>
        <p class="lg-why-n" style="margin:2px 0 10px;color:#8f86a3;font-size:12px;text-align:right"><span>0</span> / 200</p>
        <div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" data-x style="${B};background:transparent;color:#d8d0e8">Отмена</button><button type="submit" class="lg-why-go" style="${B};background:#ffcf4a;color:#1d1828;border-color:#ffcf4a">${esc(o.ok || 'Замутить')}</button></div></form>`;
      let done = false;
      const fin = (v) => { if (done) return; done = true; shut(); resolve(v); };
      const shut = layer(el, { host: o.host, onClose: () => { if (!done) { done = true; resolve(null); } } });
      const inp = el.querySelector('input'), n = el.querySelector('.lg-why-n span');
      const count = () => { n.textContent = String([...inp.value].length); };
      inp.addEventListener('input', count);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fin(null); } });
      el.querySelector('.lg-why-q').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (!b) return; inp.value = b.dataset.q; count(); try { inp.focus(); } catch {   } });
      el.querySelector('[data-x]').onclick = () => fin(null);
      el.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); fin([...inp.value.replace(/\s+/g, ' ').trim()].slice(0, 200).join('')); });
      setTimeout(() => { try { inp.focus(); } catch {   } }, 0);
    });
  }

  function clampXY(el, x, y, pad = 8) {
    const r = el.getBoundingClientRect(), W = root.innerWidth, H = root.innerHeight;
    return [Math.max(pad, Math.min(W - r.width - pad, x)), Math.max(pad, Math.min(H - r.height - pad, y))];
  }

  




  const PICK_MS = 15000;
  let pickAt = 0;
  if (typeof document !== 'undefined' && document.addEventListener) {
    const on = (e) => { const t = e.target; pickAt = t && t.tagName === 'SELECT' ? Date.now() : 0; };
    document.addEventListener('pointerdown', on, true);
    document.addEventListener('keydown', (e) => { if (e.target && e.target.tagName === 'SELECT') pickAt = Date.now(); }, true);
    document.addEventListener('change', (e) => { if (e.target && e.target.tagName === 'SELECT') pickAt = 0; }, true);
    document.addEventListener('focusout', (e) => { if (e.target && e.target.tagName === 'SELECT') pickAt = 0; }, true);
  }
  const picking = () => { if (!pickAt || Date.now() - pickAt > PICK_MS) return false; const a = typeof document !== 'undefined' && document.activeElement; return !!a && a.tagName === 'SELECT'; };

  





  const BG_FPS = 12;
  const hasDoc = typeof document !== 'undefined' && !!document.addEventListener;
  const bgOff = () => { try { return root.localStorage && root.localStorage.getItem('lgBg') === '0'; } catch { return false; } };
  let framed = false; try { framed = hasDoc && root.top !== root; } catch { framed = true; }
  function bgState() {
    if (!hasDoc) return 'on';
    if (document.hidden) return 'hidden';
    if (framed || bgOff()) return 'on';
    try { return document.hasFocus() ? 'on' : 'blur'; } catch { return 'on'; }
  }

  const bgGap = (ms) => (bgState() === 'blur' ? Math.max(ms || 0, 1000 / BG_FPS) : ms || 0);
  const bgFns = new Set();
  let bgWas = 'on';

  const bgHeld = new Map();
  let bgSweepT = 0;
  function bgHold() {
    if (typeof document.getAnimations !== 'function') return;
    for (const a of document.getAnimations()) {
      if (bgHeld.has(a) || a.playState !== 'running' || !a.playbackRate) continue;
      let inf = false; try { inf = a.effect && a.effect.getTiming().iterations === Infinity; } catch { inf = false; }
      if (!inf) continue;
      bgHeld.set(a, a.playbackRate); a.playbackRate = 0;
    }
  }
  function bgFree() {
    clearTimeout(bgSweepT); bgSweepT = 0;
    for (const [a, r] of bgHeld) { try { a.playbackRate = r; } catch {   } }
    bgHeld.clear();
  }

  function bgSweep() { clearTimeout(bgSweepT); bgSweepT = setTimeout(() => { bgSweepT = 0; if (bgState() === 'blur') { bgHold(); bgSweep(); } }, 2000); }
  function bgCheck() {
    const s = bgState(); if (s === bgWas) return;
    const was = bgWas; bgWas = s;
    if (document.documentElement) document.documentElement.classList.toggle('lg-blur', s === 'blur');
    if (s === 'on') bgFree();
    else if (s === 'hidden') { clearTimeout(bgSweepT); bgSweepT = 0; }
    else if (s === 'blur') { bgHold(); bgSweep(); }
    for (const f of [...bgFns]) { try { f(s, was); } catch (e) { console.error('[сайт] фон/фокус', e); } }
  }
  if (hasDoc) {
    document.addEventListener('visibilitychange', bgCheck);

    root.addEventListener('blur', () => setTimeout(bgCheck, 0));
    root.addEventListener('focus', bgCheck);
    root.addEventListener('pageshow', bgCheck);
    setTimeout(bgCheck, 0);
  }
  const bg = { state: bgState, gap: bgGap, fps: BG_FPS, on: (f) => { bgFns.add(f); return () => bgFns.delete(f); }, check: bgCheck, held: () => bgHeld.size };

   
  const note = (text, cls = 'empty') => `<p class="${cls}">${esc(text)}</p>`;

  async function loadInto(el, load, wait, fail) {
    el.innerHTML = note(wait);
    try { await load(); return true; } catch { el.innerHTML = note(fail); return false; }
  }

  



  const STYLES = [['legion', 'Легион'], ['cats', 'Котики'], ['monkeys', 'Обезьяны'], ['veggies', 'Овощи'], ['42brothers', '42 Братухи'], ['cherts', 'Чертики'], ['ugabugi', 'Уга-Буги']];
  const SKINS = { forge: 'Арсенал', den: 'Лежанка', rage: 'Ярость', garden: 'Грядка', club: 'VIP-зона', inferno: 'Пекло', cave: 'Пещера' };
  const STYLE_SKIN = { legion: 'forge', cats: 'den', monkeys: 'rage', veggies: 'garden', '42brothers': 'club', cherts: 'inferno', ugabugi: 'cave' };
  const SKIN_DEFAULT = 'forge';
  const skinOf = (style) => STYLE_SKIN[style] || SKIN_DEFAULT;



  const SKIN_COLOR = { forge: '#caa55c', den: '#ff8fa3', rage: '#e0302a', garden: '#8fd16a', club: '#ffc83d', inferno: '#ff6a2a', cave: '#f2a63b' };
  const styleColor = (style) => SKIN_COLOR[skinOf(style)] || SKIN_COLOR[SKIN_DEFAULT];
  const STYLE_TEXT = {
    legion: {
      groups: { mage: 'Маги и некроманты', heal: 'Жрецы', phys: 'Легионеры и стрелки', recruit: 'Новобранцы' },
      copy: { bag: 'Сумка', empty: 'Сумка пуста. Вещи добываются в Походе и покупаются в городе.', on: 'Надето', off: 'Снято', none: 'Выбери вещь в сумке или на легионере', wear: 'Надеть', take: 'Снять' },
    },
    cats: {
      groups: { mage: 'Коты-колдуны', heal: 'Мурлыки-жрецы', phys: 'Котоармия и рогаточники', recruit: 'Котята' },
      copy: { bag: 'Корзинка', empty: 'Корзинка пуста. Вещи добываются в Походе и покупаются в городе.', on: 'Мур! Надето', off: 'Снято', none: 'Выбери вещь в корзинке или на котике', wear: 'Примерить', take: 'Снять' },
    },
    monkeys: {
      groups: { mage: 'Шаманы', heal: 'Жрецы банана', phys: 'Громилы и плевуны', recruit: 'Мартышки' },
      copy: { bag: 'Мешок с бананами', empty: 'Мешок пуст. Вещи отбирают в Походе и выменивают в городе.', on: 'У-у-а! Надето', off: 'Сорвано', none: 'Выбери вещь в мешке или на обезьяне', wear: 'Нацепить', take: 'Сорвать' },
    },
    veggies: {
      groups: { mage: 'Колдуны-корнеплоды', heal: 'Святые кабачки', phys: 'Боевые овощи и горохострелы', recruit: 'Ростки' },
      copy: { bag: 'Овощной ящик', empty: 'Ящик пуст. Вещи добываются в Походе и покупаются в городе.', on: 'Хрум! Надето', off: 'Снято', none: 'Выбери вещь в ящике или на овоще', wear: 'Надеть', take: 'Снять' },
    },
    '42brothers': {
      groups: { mage: 'Диджеи и продюсеры', heal: 'Тамады', phys: 'Вышибалы, снайперы и охрана', recruit: 'Новички' },
      copy: { bag: 'Барсетка', empty: 'Барсетка пуста. Шмот добывается в Походе и берётся в городе.', on: 'Йоу! Надето', off: 'Снято', none: 'Выбери шмот в барсетке или на братухе', wear: 'Нацепить', take: 'Скинуть' },
    },
    cherts: {
      groups: { mage: 'Чёрт-колдуны и чернокнижники', heal: 'Исповедники', phys: 'Вояки, стрелки и шулеры', recruit: 'Бесята' },
      copy: { bag: 'Котомка', empty: 'Котомка пуста. Вещи добываются в Походе и выторговываются в городе.', on: 'Хо-хо! Надето', off: 'Снято', none: 'Выбери вещь в котомке или на чертёнке', wear: 'Надеть', take: 'Снять' },
    },
    ugabugi: {
      groups: { mage: 'Шаманы и колдуны костей', heal: 'Знахари', phys: 'Громилы и охотники', recruit: 'Юнцы' },
      copy: { bag: 'Мешок из шкуры', empty: 'Мешок пуст. Вещи добывают в Походе и выменивают в городе.', on: 'Уга! Надето', off: 'Снято', none: 'Выбери вещь в мешке или на пещерном человеке', wear: 'Нацепить', take: 'Снять' },
    },
  };
  const styleText = (style, part, k) => ((STYLE_TEXT[style] || {})[part] || {})[k];

   





  const LIVE_STEPS = [1000, 2000, 5000, 10000, 30000];
  const POLL_STEPS = [10000, 15000, 30000, 60000];
  function backoff(o) {
    o = o || {};
    const steps = Array.isArray(o.steps) && o.steps.length ? o.steps : LIVE_STEPS, jit = o.jitter == null ? 0.5 : +o.jitter || 0, rnd = o.rnd || Math.random;
    let n = 0;
    const at = (i) => { const b = steps[Math.min(i, steps.length - 1)]; const k = o.up ? 1 + jit * rnd() : 1 + jit * (2 * rnd() - 1); return Math.max(0, Math.round(b * k)); };
    return { next() { return at(n++); }, peek() { return at(n); }, reset() { n = 0; }, fails() { return n; } };
  }
   
  function retryAfterMs(v, now) {
    if (v == null || v === '') return 0;
    const s = String(v).trim();
    let ms = /^\d+(\.\d+)?$/.test(s) ? +s * 1000 : (() => { const t = Date.parse(s); return Number.isFinite(t) ? t - (now == null ? Date.now() : now) : 0; })();
    if (!Number.isFinite(ms) || ms <= 0) return 0;
    return Math.min(300000, Math.round(ms));
  }

  const hold = (() => { let until = 0; const clk = () => Date.now(); return { set(ms) { const t = clk() + Math.max(0, +ms || 0); if (t > until) until = t; return until; }, left() { return Math.max(0, until - clk()); }, clear() { until = 0; } }; })();
   
  function holdFrom(res) {
    try {
      if (!res || (res.status !== 503 && res.status !== 429)) return 0;
      const ms = retryAfterMs(res.headers && res.headers.get ? res.headers.get('retry-after') : '') || (res.status === 503 ? 5000 : 0);
      if (ms) hold.set(ms);
      return ms;
    } catch (e) { return 0; }
  }

  return { esc, plural, pluralN, timeAgo, MUNIT, moneyParts, money, moneyText, lack, bal, toast, confirmTwice, armed, MQ, media, is, keepField, awIco, layer, askText, askReason, REASONS, ask, askInput, tell, clampXY, picking, note, loadInto, bg,
    STYLES, SKINS, STYLE_SKIN, SKIN_DEFAULT, skinOf, SKIN_COLOR, styleColor, STYLE_TEXT, styleText, backoff, retryAfterMs, hold, holdFrom, LIVE_STEPS, POLL_STEPS };
});
