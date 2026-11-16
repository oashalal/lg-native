
















window.LGMiniMap = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const REFRESH_MS = 60000;
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (window.LGSiteUi && window.LGSiteUi.esc) || ((s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]));
  const COL_RE = /^#[0-9a-f]{3,8}$/i, DEF_COL = '#5a5a6a';
  const col = (c) => (COL_RE.test(String(c || '')) ? String(c) : DEF_COL);

  const GROUND = { meadow: '#4d5a32', forest: '#3f5230', taiga: '#3b4c35', ice: '#5d6670', mount: '#575244', swamp: '#424a30', desert: '#665a3a', ash: '#4a3c3e', coast: '#56583a', ruin: '#544c40', blight: '#463e4c' };
  const OCEAN = '#18222b';



  const PAL = ['#ff5a4e', '#3fa9ff', '#ffd23f', '#b46bff', '#ff9a2e', '#35e0a1', '#ff6fc8', '#5b6cff', '#c3ec3c', '#2fd3e8', '#f2f2f2', '#d08a5a'];
  const hashOf = (t) => { let h = 2166136261; for (const c of String(t)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; };
  let palKey = '', palMap = new Map();
  function palOf(d) {
    const chs = (d && d.ch) || [], key = chs.map((c) => c[0]).join('|') + '#' + ((d && d.top) || []).map((r) => r.ch).join('|');
    if (key === palKey) return palMap;
    const inf = new Map(((d && d.top) || []).map((r) => [String(r.ch), +r.inf || 0]));
    const order = chs.map((c) => String(c[0])).sort((a, b) => ((inf.get(b) ?? +((chs.find((c) => c[0] === b) || [])[3] || 0)) - (inf.get(a) ?? +((chs.find((c) => c[0] === a) || [])[3] || 0))) || (a < b ? -1 : 1));
    for (const r of (d && d.top) || []) if (!order.includes(String(r.ch))) order.push(String(r.ch));
    const used = new Set(), m = new Map();
    for (const ch of order) {
      let i = hashOf(ch) % PAL.length;
      for (let k = 0; k < PAL.length && used.has(i); k++) i = (i + 1) % PAL.length;
      if (used.size >= PAL.length) used.clear();
      used.add(i); m.set(ch, PAL[i]);
    }
    palKey = key; palMap = m;
    return m;
  }
  const chCol = (ch, fb) => palMap.get(String(ch)) || col(fb);
  const TABS = [['map', 'Карта'], ['rating', 'Рейтинг']];
  const ERR = { world_closed: 'Карта мира пока закрыта', 'войди через Twitch': 'Войди через Twitch, чтобы увидеть карту', login_required: 'Нужно войти через Twitch', feature_closed: 'Пока закрыто', 'нет связи с сайтом': 'Нет связи с сайтом - попробуй ещё раз' };
  const errText = (e) => ERR[e] || (e ? String(e) : 'Не загрузилось - попробуй ещё раз');

  const TROPHY = '<svg class="lmm-ic" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lmm-tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffefb8"/><stop offset=".55" stop-color="#f2c15a"/><stop offset="1" stop-color="#b9761f"/></linearGradient><linearGradient id="lmm-tw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9c49a"/><stop offset="1" stop-color="#8a5a2b"/></linearGradient></defs>'
    + '<path d="M14 6h20v12a10 10 0 01-20 0z" fill="url(#lmm-tg)" stroke="#2a1708" stroke-width="2" stroke-linejoin="round"/><path d="M14 10H7v3a7 7 0 007 7M34 10h7v3a7 7 0 01-7 7" fill="none" stroke="#2a1708" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
    + '<path d="M14 10H7v3a7 7 0 007 7M34 10h7v3a7 7 0 01-7 7" fill="none" stroke="url(#lmm-tg)" stroke-width="1.4"/><path d="M21 28h6v6h-6z" fill="url(#lmm-tg)" stroke="#2a1708" stroke-width="2" stroke-linejoin="round"/>'
    + '<path d="M15 34h18v7H15z" fill="url(#lmm-tw)" stroke="#2a1708" stroke-width="2" stroke-linejoin="round"/><path d="M19 9v9" stroke="#fff" stroke-width="2" opacity=".55" stroke-linecap="round"/></svg>';

  let X = null;
  let G = null, geoP = null;
  let W = { d: null, err: '', at: 0, p: null };
  let SOC = { d: null, err: '', at: 0, p: null };
  let CAR = { d: null, err: '', at: 0, p: null };
  let svgKey = '', svgBody = '';
  let win = null, tabNow = 'map', back = null, ro = null, tick = 0, wTick = 0;
  const WG = new Set();

  const now = () => (X && X.now ? X.now() : Date.now());
  const plural = (n, a, b, c) => { const m = Math.abs(n) % 100, k = m % 10; return m > 10 && m < 20 ? c : k > 1 && k < 5 ? b : k === 1 ? a : c; };
  const leftRu = (ms) => { const m = Math.max(1, Math.ceil(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60; return d ? `${d} дн. ${h} ч` : h ? `${h} ч ${mm} мин` : `${mm} мин`; };
  const dateRu = (t) => { try { return new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }); } catch (e) { return ''; } };

   
  const pairs = (f) => { const o = []; for (let i = 0; i + 1 < f.length; i += 2) o.push([f[i], f[i + 1]]); return o; };
  const lineD = (p) => 'M' + p.map(([x, y]) => x + ' ' + y).join('L');
  function prep(g) {
    const chains = g.chains.map((c) => ({ l: c.l, r: c.r, p: pairs(c.p) }));
    const T = g.t.map((t) => {
      const poly = t.rings.map((ring) => { const o = []; for (const ref of ring) { const c = chains[ref >= 0 ? ref : ~ref], p = ref >= 0 ? c.p : c.p.slice().reverse(); for (let i = o.length ? 1 : 0; i < p.length; i++) o.push(p[i]); } return o; });
      let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of poly) for (const [x, y] of r) { if (x < a) a = x; if (y < b) b = y; if (x > c) c = x; if (y > d) d = y; }
      return { id: t.id, n: t.n, b: t.b, c: t.c, tw: t.tw || null, grand: !!t.grand, bb: [a, b, c, d], dd: poly.map((r) => lineD(r) + 'Z').join('') };
    });
    const byId = new Map(T.map((t) => [t.id, t]));
    let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const t of T) { a = Math.min(a, t.bb[0]); b = Math.min(b, t.bb[1]); c = Math.max(c, t.bb[2]); d = Math.max(d, t.bb[3]); }
    const coast = chains.filter((x) => x.l == null || x.r == null).map((x) => lineD(x.p)).join('') + (g.isles || []).map((f) => lineD(pairs(f)) + 'Z').join('');
    return { T, byId, land: [a, b, c, d], coast, isles: (g.isles || []).map((f) => lineD(pairs(f)) + 'Z').join(''), wall: Array.isArray(g.barrier) && g.barrier.length > 3 ? lineD(pairs(g.barrier)) : '' };
  }
  function geoLoad(v) {
    if (G) return Promise.resolve(G);
    if (geoP) return geoP;
    geoP = fetch(`/site/worldgeo.json?v=${encodeURIComponent(v || '')}`).then((r) => { if (!r.ok) throw new Error('geo ' + r.status); return r.json(); }).then((g) => (G = prep(g)))
      .catch((e) => { geoP = null; throw e; });
    return geoP;
  }

   
  function load(box, fn, force) {
    if (box.p) return box.p;
    if (!force && box.at && Date.now() - box.at < REFRESH_MS) return Promise.resolve(box);
    box.p = Promise.resolve().then(fn).then((r) => { box.at = Date.now(); if (r && r.ok) { box.d = r; box.err = ''; } else { box.err = (r && r.error) || 'нет данных'; if (r && (r.error === 'world_closed' || r.error === 'войди через Twitch')) box.d = null; } return box; })
      .catch((e) => { box.at = Date.now(); box.err = (e && e.message) || 'нет связи с сайтом'; return box; })
      .finally(() => { box.p = null; });
    return box.p;
  }
  const worldLoad = (force) => load(W, async () => {
    const d = await X.api('/api/world');
    if (d && d.ok) await geoLoad(d.geo || (window.LG_WORLDV || {}).geo);
    return d;
  }, force);
  const socLoad = (force) => load(SOC, () => X.api('/api/soc'), force);
  const carryLoad = (force) => (X.me && X.me() ? load(CAR, () => X.rootApi('/api/season/carry'), force) : Promise.resolve(CAR));

   

  function hereOf(o) {
    const d = W.d, w = (o && o.at ? { id: String(o.at), name: '' } : null) || (X && X.where ? X.where() : null);
    if (w && w.id && G) {
      const t = w.id === 'fair' ? G.T.find((x) => x.tw && x.tw.k === 'fair') : G.byId.get(w.id);
      if (t) return { t, name: w.name || (t.tw && t.tw.n) || t.n, me: true };
    }
    if (w && w.id === 'camp') return { t: null, name: w.name || 'Лагерь', me: true };
    if (w && w.id === 'fair') return { t: null, name: w.name || 'Рябинень', me: true };
    if (w && w.name) return { t: null, name: w.name, me: true };
    const at = d && (d.party || d.home), t = at && G ? G.byId.get(at) : null;
    return t ? { t, name: (t.tw && t.tw.n) || t.n, me: false } : null;
  }
  const seasonNo = () => (W.d && W.d.season ? +W.d.season.no || 1 : null);

   
  function ownerOf(d, id) { const s = d.t && d.t[id]; if (!s || s.o == null) return null; const c = d.ch[s.o] || []; const ch = String(c[0] || '?'); return { ch, color: chCol(ch, c[1]), mine: ch === d.me }; }

  function layers() {
    const d = W.d, key = d ? JSON.stringify([d.rev, d.me, d.t, d.ch, (d.top || []).map((r) => r.ch)]) : '';
    if (key === svgKey && svgBody) return svgBody;
    palOf(d);
    const L = G.land, own = [], mine = [];
    for (const t of G.T) {
      const o = ownerOf(d, t.id); if (!o) continue;
      own.push(`<path d="${t.dd}" fill="${o.color}" fill-opacity="${o.mine ? 0.55 : 0.45}" stroke="${o.color}" class="own"/>`);
      if (o.mine) mine.push(`<path d="${t.dd}" class="mine-u"/><path d="${t.dd}" class="mine"/>`);
    }
    const grand = G.T.find((t) => t.grand);
    svgBody = `<rect x="${L[0] - 20000}" y="${L[1] - 20000}" width="${L[2] - L[0] + 40000}" height="${L[3] - L[1] + 40000}" fill="${OCEAN}"/>`
      + `<path d="${G.isles}" fill="${GROUND.coast}"/>`
      + `<g class="lmm-land">${G.T.map((t) => `<path d="${t.dd}" fill="${GROUND[t.b] || GROUND.meadow}"/>`).join('')}</g>`
      + `<path class="lmm-coast" d="${G.coast}"/>`
      + `<g class="lmm-own">${own.join('')}${mine.join('')}</g>`
      + (G.wall ? `<g class="lmm-wall"><path class="w0" d="${G.wall}"/><path class="w1" d="${G.wall}"/><path class="w2" d="${G.wall}"/></g>` : '')

      + `<g class="lmm-zl">${G.T.filter((t) => !t.grand).map((t) => { const p = t.tw ? [t.tw.x, t.tw.y] : t.c, o = ownerOf(d, t.id);
        return `<text class="${t.tw ? 'z2' : 'z3'}" x="${p[0]}" y="${p[1]}"${t.tw ? ' dy="-.9em"' : ''}>${esc(t.tw ? t.tw.n : t.n)}</text>`
          + (t.tw ? `<circle class="z2 lmm-tw" cx="${p[0]}" cy="${p[1]}" r="1"${o ? ` style="fill:${o.color}"` : ''}/>` : ''); }).join('')}</g>`
      + (grand && grand.tw ? `<g class="lmm-lb"><circle class="lmm-cap" cx="${grand.tw.x}" cy="${grand.tw.y}" r="1" /><text x="${grand.tw.x}" y="${grand.tw.y}" dy="-1.1em">${esc(grand.tw.n)}</text></g>` : '');
    svgKey = key;
    return svgBody;
  }

  const hereMark = (h, label, vb) => {
    if (!h || !h.t) return '';
    const p = h.t.tw ? [h.t.tw.x, h.t.tw.y] : h.t.c, f = vb ? (p[0] - vb[0]) / vb[2] : 0.5;
    const anchor = f < 0.25 ? 'start' : f > 0.75 ? 'end' : 'middle', dx = anchor === 'start' ? -0.6 : anchor === 'end' ? 0.6 : 0;
    return `<g class="lmm-here${h.me ? '' : ' party'}"><circle class="halo" cx="${p[0]}" cy="${p[1]}" r="1"/><circle class="dot" cx="${p[0]}" cy="${p[1]}" r="1"/>`
      + (label ? `<text x="${p[0]}" y="${p[1]}" dx="${dx}em" dy="-1.4em" style="text-anchor:${anchor}">${esc(label)}</text>` : '') + '</g>';
  };
  const svg = (vb, body, label) => `<svg class="lmm-svg" xmlns="${NS}" viewBox="${vb.map((v) => Math.round(v)).join(' ')}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(label)}">${body}</svg>`;
  const landVb = () => { const L = G.land, pw = (L[2] - L[0]) * 0.03, ph = (L[3] - L[1]) * 0.03; return [L[0] - pw, L[1] - ph, L[2] - L[0] + pw * 2, L[3] - L[1] + ph * 2]; };

  function fitU(box) {
    const s = box && box.querySelector('.lmm-svg'); if (!s) return;
    const r = box.getBoundingClientRect(), vb = (s.getAttribute('viewBox') || '').split(' ').map(Number);
    if (!r.width || !r.height || vb.length < 4) return;
    s.style.setProperty('--u', String(1 / Math.min(r.width / vb[2], r.height / vb[3])));
  }

   
  function seasonOf() {
    const d = W.d, se = (d && d.season) || null, t0 = now();
    if (!se) return { no: 1, line: 'сроки сезона неизвестны', k: 0 };
    const no = +se.no || 1;
    if (se.startsAt == null) return { no, line: 'ещё не начат', k: 0 };
    if (se.over || (se.endsAt != null && t0 >= se.endsAt)) return { no, line: d.final && d.final.wait ? 'срок вышел - идёт осада' : 'сезон окончен - ждём итогов', k: 1 };
    const k = se.endsAt != null ? Math.max(0, Math.min(1, (t0 - se.startsAt) / Math.max(1, se.endsAt - se.startsAt))) : 0;
    return { no, line: se.endsAt != null ? `до конца ${leftRu(se.endsAt - t0)}` : 'идёт', k, from: se.startsAt, to: se.endsAt };
  }
  const bar = (k) => `<div class="lmm-bar" role="progressbar" aria-label="Прошло сезона" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(k * 100)}"><i style="width:${(k * 100).toFixed(1)}%"></i></div>`;

  function infRows(n) {
    const d = W.d; if (!d) return `<p class="lmm-mu">${esc(errText(W.err))}</p>`;
    const top = d.top || [];
    if (!top.length) return '<p class="lmm-mu">Земли ещё никто не захватил.</p>';
    palOf(d);
    const row = (r, place) => `<li class="lmm-row${r.ch === d.me ? ' me' : ''}"><span><i class="lmm-sw" style="background:${chCol(r.ch, r.color)}" aria-hidden="true"></i>${esc(place)}. ${esc(r.ch)}${r.capital ? ' <span title="Владеет главным городом" aria-label="владеет главным городом">♛</span>' : ''}</span><b>${esc(r.inf)}</b></li>`;
    const rows = top.slice(0, n).map((r) => row(r, r.place));
    if (!top.slice(0, n).some((r) => r.ch === d.me)) {
      const r = top.find((x) => x.ch === d.me);
      if (r) rows.push(row(r, r.place));
      else { const i = (d.ch || []).findIndex((c) => c[0] === d.me); if (i >= 0 && +d.ch[i][3] > 0) rows.push(row({ ch: d.me, color: d.ch[i][1], inf: d.ch[i][3] }, '…')); }
    }
    return `<ol class="lmm-list">${rows.join('')}</ol>`;
  }
  function myPlace() {
    if (!X.me || !X.me()) return `<a class="lmm-link" href="${esc(X.login ? X.login() : '/auth/login')}">Войди через Twitch</a>, чтобы увидеть своё место.`;
    const r = SOC.d; if (!r) return `<span class="lmm-mu">${esc(SOC.err ? errText(SOC.err) : 'Загружаем…')}</span>`;
    const me = r.me, rk = (me && (r.ranks || {})[me.rank]) || null;
    if (!me || !me.place) return '<span class="lmm-mu">Ещё нет места - рейтинг растёт, пока смотришь стрим и пишешь в чат.</span>';
    return `<b>${esc(me.place)} место</b> · ${rk && rk.icon ? `<span aria-hidden="true">${esc(rk.icon)}</span> ` : ''}${esc((rk && rk.name) || '—')} · ${esc(me.score)} ${plural(+me.score || 0, 'очко', 'очка', 'очков')}`;
  }

  function seasonFull() {
    if (!W.d) return `<div class="lmm-se"><div class="lmm-h1">Сезон</div><div class="lmm-mu">${esc(W.p || (!W.at && !W.err) ? 'Загружаем…' : errText(W.err))}</div></div>`;
    const s = seasonOf(), d = W.d, f = d.final, t0 = now(), out = [];
    out.push(`<div class="lmm-h1">Сезон ${esc(s.no)}</div>`);
    if (s.from != null) out.push(`<div class="lmm-mu lmm-dates">${esc(dateRu(s.from))}${s.to != null ? ' - ' + esc(dateRu(s.to)) : ''}</div>`);
    out.push(`<div class="lmm-left">${esc(s.line)}</div>${bar(s.k)}`);
    if (f) {
      const cap = f.capital || 'Престольград';
      out.push(`<p class="lmm-p lmm-final">${f.wait ? `Срок сезона вышел - идёт осада ${esc(cap)}. Сезон закроется после её итога.`
        : t0 >= f.from ? `<b>Последний штурм!</b> ${esc(cap)} даёт бонус Влияния за удержание${f.holder ? ' · держит ' + esc(f.holder) : ''}.`
          : `Последний штурм - через ${esc(leftRu(f.from - t0))}.`}</p>`);
    }
    const g = Object.values(d.gates || {}).filter((x) => x != null), gAt = g.length ? Math.min(...g) : null;
    if (gAt != null) out.push(`<p class="lmm-p lmm-gates">Врата ${t0 < gAt ? 'откроются через ' + esc(leftRu(gAt - t0)) : 'открыты'}.</p>`);
    const ev = Array.isArray(d.ev) ? d.ev : [];
    if (ev.length) out.push(`<ul class="lmm-list lmm-ev">${ev.map((e) => `<li class="lmm-row"><span>${esc(e.icon || '')} ${esc(e.title)}</span><span class="lmm-mu">${e.live ? 'идёт' : 'скоро'}</span></li>`).join('')}</ul>`);
    const c = CAR.d, w = c && c.window;
    if (c && Array.isArray(c.heroes) && c.heroes.length && w) {
      out.push(`<p class="lmm-p lmm-carry">${w.open && w.endsAt ? `Окно переноса героя открыто - осталось ${esc(leftRu(w.endsAt - t0))}. Выбор - во вкладке «Сезоны».`
        : w.opensAt ? `Окно переноса героя откроется ${esc(dateRu(w.opensAt))}.` : 'Окно переноса героя откроется в последние дни сезона.'}</p>`);
    }
    return `<div class="lmm-se">${out.join('')}</div>`;
  }
  function mapPane() {
    const wt = X.worldTab ? X.worldTab() : null;
    const foot = `<div class="lmm-foot">${wt ? '<button type="button" class="lmm-link" data-act="world">Полная карта - вкладка «Карта мира»</button>' : 'Полная карта - вкладка «Карта мира».'}</div>`;
    let map;
    if (!W.d || !G) map = `<div class="lmm-stub">${W.p || (!W.at && !W.err) ? 'Карта разворачивается…' : esc(errText(W.err))}</div>`;
    else {
      const h = hereOf(win && win.o), lab = h ? (h.me ? `ты здесь · ${h.name}` : `отряд канала · ${h.name}`) : '';
      const vb = landVb();
      map = svg(vb, layers() + hereMark(h, lab, vb), 'Мини-карта мира: земли каналов' + (lab ? ', ' + lab : ''))
        + '<div class="lmm-zb" role="group" aria-label="Масштаб карты"><button type="button" data-z="in" aria-label="Приблизить" title="Приблизить">+</button>'
        + '<button type="button" data-z="out" aria-label="Отдалить" title="Отдалить">−</button><button type="button" data-z="fit" aria-label="Вся карта" title="Вся карта">⟲</button></div>';
    }
    return `<div class="lmm-main"><div class="lmm-map">${map}${foot}</div><aside class="lmm-side">${seasonFull()}`
      + `<section><h3 class="lmm-h3">${TROPHY}Влияние каналов</h3>${infRows(3)}</section>`
      + `<section><h3 class="lmm-h3">Твоё место в Легионе</h3><p class="lmm-p">${myPlace()}</p></section></aside></div>`;
  }
   

  const RT = { rows: null, total: 0, more: true, busy: false, err: '', f: null, q: '', fBusy: false, fErr: '', fT: 0, fSeq: 0, base: null };
  const socRank = (id) => { const R = (SOC.d && SOC.d.ranks) || {}; return (R[id] && R[id].name) || ''; };
  function rtFromSoc() {
    const r = SOC.d; if (!r || RT.base === r) return;
    RT.base = r;
    const top = (r.top || []).map((x, i) => ({ place: i + 1, login: x.login, name: x.name || x.login, score: x.score, rank: x.rank }));

    const tail = RT.rows && RT.rows.length > top.length ? RT.rows.slice(top.length) : [];
    RT.rows = top.concat(tail); RT.total = +r.total || top.length;
    RT.more = !!(X.me && X.me()) && RT.rows.length < RT.total;
  }
  const rtRow = (x, hit) => {
    const me = SOC.d && SOC.d.me, mine = me && x.login === me.login;
    return `<li class="lmm-row${mine ? ' me' : ''}${hit ? ' hit' : ''}" data-place="${esc(x.place)}"><span>${esc(x.place)}. ${esc(x.name || x.login)} <span class="lmm-mu">${esc(socRank(x.rank))}</span></span><b>${esc(x.score)}</b></li>`;
  };
  function rtList() {
    if (!SOC.d) return `<p class="lmm-mu">${esc(SOC.err ? errText(SOC.err) : 'Загружаем…')}</p>`;
    if (RT.f || RT.fBusy || RT.fErr) {
      if (RT.fBusy && !RT.f) return '<p class="lmm-mu">Ищем…</p>';
      if (RT.fErr) return `<p class="lmm-mu">${esc(RT.fErr)}</p>`;
      if (!RT.f.rows.length) return `<p class="lmm-mu">Игрок «${esc(RT.q)}» не найден в рейтинге.</p>`;
      const more = (RT.f.more || []).length ? `<p class="lmm-mu lmm-fm">Ещё с таким началом: ${RT.f.more.slice(0, 6).map((x) => `<button type="button" class="lmm-link" data-find="${esc(x.login)}">${esc(x.name || x.login)}</button>`).join(', ')}</p>` : '';
      return `<ol class="lmm-list lmm-soc">${RT.f.rows.map((x) => rtRow(x, x.place === RT.f.hit)).join('')}</ol>${more}`;
    }
    if (!RT.rows || !RT.rows.length) return '<p class="lmm-mu">Рейтинг появится после синхронизации со стримом.</p>';
    const tail = RT.busy ? '<li class="lmm-mu lmm-more">Загружаем ещё…</li>' : RT.err ? `<li class="lmm-mu lmm-more">${esc(RT.err)} <button type="button" class="lmm-link" data-act="more">ещё раз</button></li>`
      : RT.more ? '<li class="lmm-mu lmm-more">Листай - подгрузим ещё</li>' : !(X.me && X.me()) && RT.total > RT.rows.length ? `<li class="lmm-mu lmm-more">Войди через Twitch, чтобы листать дальше ${esc(RT.rows.length)} мест</li>` : '';
    return `<ol class="lmm-list lmm-soc">${RT.rows.map((x) => rtRow(x, false)).join('')}${tail}</ol>`;
  }
  function ratingPane() {
    rtFromSoc();
    const me = SOC.d && SOC.d.me, logged = !!(X.me && X.me());
    const tools = `<div class="lmm-rt-tools"><input type="search" class="lmm-q" placeholder="${logged ? 'Найти игрока по нику' : 'Поиск - после входа через Twitch'}" aria-label="Найти игрока по нику" maxlength="40" autocomplete="off" spellcheck="false" value="${esc(RT.q)}"${logged ? '' : ' disabled'}>`
      + (logged && me && me.place ? '<button type="button" class="lmm-btn" data-act="me">к себе</button>' : '') + '</div>';
    return `<div class="lmm-rt"><section class="lmm-rt-inf"><h3 class="lmm-h3">${TROPHY}Влияние каналов</h3>${infRows(10)}</section>`
      + `<section class="lmm-rt-soc"><div class="lmm-rt-head"><h3 class="lmm-h3">Соц. рейтинг Легиона</h3><p class="lmm-p">${myPlace()}</p>${tools}</div><div class="lmm-rt-list" tabindex="0" aria-label="Соц. рейтинг Легиона">${rtList()}</div></section></div>`;
  }
  function rtPaint() {
    if (!win || tabNow !== 'rating') return;
    const box = win.el.querySelector('.lmm-rt-list'); if (!box) { render(); return; }
    const top = box.scrollTop; box.innerHTML = rtList(); box.scrollTop = top;
  }
  function rtMore() {
    if (!RT.rows || !RT.more || RT.busy || RT.f || !(X.me && X.me())) return;
    RT.busy = true; RT.err = ''; rtPaint();
    const off = RT.rows.length;
    Promise.resolve(X.api(`/api/soc/page?offset=${off}&limit=100`)).then((r) => {
      if (r && r.ok) {
        const add = (r.rows || []).filter((x) => +x.place > RT.rows.length);
        RT.rows = RT.rows.concat(add); RT.total = +r.total || RT.total;
        RT.more = add.length > 0 && RT.rows.length < RT.total;
      } else RT.err = errText(r && r.error);
    }).catch(() => { RT.err = errText('нет связи с сайтом'); }).finally(() => { RT.busy = false; rtPaint(); });
  }
  function rtFind(q, now0) {
    q = String(q || '').trim().replace(/^@/, '').slice(0, 40); RT.q = q;
    clearTimeout(RT.fT);
    if (!q) { RT.f = null; RT.fBusy = false; RT.fErr = ''; rtPaint(); return; }
    const go = () => {
      const seq = ++RT.fSeq; RT.fBusy = true; RT.fErr = ''; rtPaint();
      Promise.resolve(X.api(`/api/soc/find?q=${encodeURIComponent(q)}`)).then((r) => {
        if (seq !== RT.fSeq) return;
        if (r && r.ok) RT.f = { hit: +r.hit || 0, rows: r.rows || [], more: r.more || [] }; else { RT.f = null; RT.fErr = errText(r && r.error); }
      }).catch(() => { if (seq === RT.fSeq) { RT.f = null; RT.fErr = errText('нет связи с сайтом'); } }).finally(() => { if (seq === RT.fSeq) { RT.fBusy = false; rtPaint(); } });
    };
    if (now0) go(); else RT.fT = setTimeout(go, 350);
  }
  function rtBind() {
    const el = win && win.el.querySelector('.lmm-rt'); if (!el) return;
    const inp = el.querySelector('.lmm-q'), list = el.querySelector('.lmm-rt-list');
    if (inp) inp.addEventListener('input', () => rtFind(inp.value));
    if (inp) inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); rtFind(inp.value, true); } else if (e.key === 'Escape' && inp.value) { e.preventDefault(); e.stopPropagation(); inp.value = ''; rtFind(''); } });
    if (list) list.addEventListener('scroll', () => { if (list.scrollTop + list.clientHeight > list.scrollHeight - 240) rtMore(); }, { passive: true });
    el.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('button'); if (!b) return;
      if (b.dataset.act === 'me') { const me = SOC.d && SOC.d.me; if (me && me.login) { if (inp) inp.value = me.name || me.login; rtFind(me.login, true); } }
      else if (b.dataset.act === 'more') rtMore();
      else if (b.dataset.find) { if (inp) inp.value = b.dataset.find; rtFind(b.dataset.find, true); }
    });
  }

   

  const ZMAX = 6;
  let Z = null;
  function zBase(box) {
    const r = box.getBoundingClientRect(), L = landVb(), a = r.width && r.height ? r.width / r.height : L[2] / L[3];
    let w = L[2], h = L[3]; if (w / h < a) w = h * a; else h = w / a;
    return { x: L[0] + L[2] / 2 - w / 2, y: L[1] + L[3] / 2 - h / 2, w, h };
  }
  function zVb(box) {
    const B = zBase(box), z = Z || { k: 1, cx: B.x + B.w / 2, cy: B.y + B.h / 2 };
    const w = B.w / z.k, h = B.h / z.k;

    const cx = Math.max(B.x + w / 2, Math.min(B.x + B.w - w / 2, z.cx)), cy = Math.max(B.y + h / 2, Math.min(B.y + B.h - h / 2, z.cy));
    if (Z) { Z.cx = cx; Z.cy = cy; }
    return [cx - w / 2, cy - h / 2, w, h];
  }
  function zApply() {
    const box = win && win.el.querySelector('.lmm-map'), sv = box && box.querySelector('.lmm-svg'); if (!sv) return;
    const vb = zVb(box), k = Z ? Z.k : 1;
    sv.setAttribute('viewBox', vb.map((v) => v.toFixed(1)).join(' '));
    sv.classList.toggle('zm', k > 1 + 1e-6); sv.classList.toggle('z2', k >= 2); sv.classList.toggle('z3', k >= 3.5);
    fitU(box);
    const zb = box.querySelector('.lmm-zb');
    if (zb) { zb.querySelector('[data-z="in"]').disabled = k >= ZMAX - 1e-6; zb.querySelector('[data-z="out"]').disabled = k <= 1 + 1e-6; zb.querySelector('[data-z="fit"]').disabled = k <= 1 + 1e-6; }
  }

  function zBy(f, px, py) {
    const box = win && win.el.querySelector('.lmm-map'); if (!box || !box.querySelector('.lmm-svg')) return;
    const r = box.getBoundingClientRect(), vb = zVb(box), B = zBase(box);
    const fx = px == null ? 0.5 : (px - r.left) / r.width, fy = py == null ? 0.5 : (py - r.top) / r.height;
    const wx = vb[0] + vb[2] * fx, wy = vb[1] + vb[3] * fy;
    const k0 = Z ? Z.k : 1, k = Math.max(1, Math.min(ZMAX, k0 * f));
    const w = B.w / k, h = B.h / k;
    Z = { k, cx: wx - w * fx + w / 2, cy: wy - h * fy + h / 2 };
    if (k <= 1 + 1e-6) Z = null;
    zApply();
  }
  function zPan(dx, dy) {
    const box = win && win.el.querySelector('.lmm-map'); if (!box || !Z) return;
    const r = box.getBoundingClientRect(), vb = zVb(box);
    Z.cx -= dx * vb[2] / r.width; Z.cy -= dy * vb[3] / r.height; zApply();
  }
  function zBind() {
    const box = win && win.el.querySelector('.lmm-map'), sv = box && box.querySelector('.lmm-svg'); if (!sv) return;
    zApply();
    box.addEventListener('wheel', (e) => { if (!e.deltaY) return; e.preventDefault(); zBy(Math.pow(1.0018, -e.deltaY * (e.deltaMode === 1 ? 33 : 1)), e.clientX, e.clientY); }, { passive: false });
    sv.addEventListener('dblclick', (e) => { e.preventDefault(); zBy(2, e.clientX, e.clientY); });
    box.querySelector('.lmm-zb').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return; e.stopPropagation();
      if (b.dataset.z === 'in') zBy(1.6); else if (b.dataset.z === 'out') zBy(1 / 1.6); else { Z = null; zApply(); }
    });

    const P = new Map(); let pinch = 0;
    sv.style.touchAction = 'none';
    sv.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      P.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { sv.setPointerCapture(e.pointerId); } catch (x) {   }
      if (P.size === 2) { const [a, b] = [...P.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
      if (Z) box.classList.add('pan');
    });
    sv.addEventListener('pointermove', (e) => {
      const p = P.get(e.pointerId); if (!p) return;
      if (P.size >= 2) {
        P.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...P.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch > 0 && d > 0) zBy(d / pinch, (a.x + b.x) / 2, (a.y + b.y) / 2);
        pinch = d; return;
      }
      const dx = e.clientX - p.x, dy = e.clientY - p.y; P.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (Z && (dx || dy)) zPan(dx, dy);
    });
    const up = (e) => { P.delete(e.pointerId); if (P.size < 2) pinch = 0; if (!P.size) box.classList.remove('pan'); };
    sv.addEventListener('pointerup', up); sv.addEventListener('pointercancel', up); sv.addEventListener('lostpointercapture', up);
  }

  function render() {
    if (!win) return;
    const body = win.el.querySelector('.lmm-body');
    win.el.querySelectorAll('.lmm-tab').forEach((b) => { const on = b.dataset.tab === tabNow; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });

    const inp = body.querySelector('.lmm-q'), focus = inp && document.activeElement === inp, sel = focus ? [inp.selectionStart, inp.selectionEnd] : null;
    const lst = body.querySelector('.lmm-rt-list'), lTop = lst ? lst.scrollTop : 0, sTop = body.scrollTop;
    body.innerHTML = tabNow === 'rating' ? ratingPane() : mapPane();
    body.dataset.tab = tabNow;
    if (tabNow === 'rating') {
      rtBind();
      const l2 = body.querySelector('.lmm-rt-list'); if (l2) l2.scrollTop = lTop;
      const i2 = body.querySelector('.lmm-q'); if (i2 && focus) { i2.focus(); try { i2.setSelectionRange(sel[0], sel[1]); } catch (e) {   } }
    }
    body.scrollTop = sTop;
    const m = body.querySelector('.lmm-map');
    if (ro) ro.disconnect();
    if (m) { zBind(); fitU(m); ro = window.ResizeObserver ? new ResizeObserver(() => zApply()) : null; if (ro) ro.observe(m); }
  }
  function want() {

    const ps = [worldLoad(), socLoad(), carryLoad()];
    return Promise.all(ps).then(() => { if (win) render(); widgetsDraw(); });
  }
  function setTab(id) { if (id === 'season') id = 'map'; if (!TABS.some(([t]) => t === id)) id = 'map'; tabNow = id; render(); want(); }
  function onKey(e) {
    if (!win) return;
    if (e.key === 'Escape') { const q = e.target && e.target.classList && e.target.classList.contains('lmm-q') ? e.target : null; if (q && q.value) return; e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      const f = [...win.el.querySelectorAll('button, a[href], [tabindex="0"]')].filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target && e.target.classList && e.target.classList.contains('lmm-tab')) {
      const i = TABS.findIndex(([t]) => t === tabNow), j = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
      setTab(TABS[j][0]); const b = win.el.querySelector(`.lmm-tab[data-tab="${TABS[j][0]}"]`); if (b) b.focus();
    }
  }
  function open(x, o = {}) {
    X = x || X; if (!X) return;
    if (o.tab) tabNow = o.tab === 'season' ? 'map' : o.tab;
    if (win) { win.o = o; setTab(tabNow); return; }
    back = document.activeElement;
    const el = document.createElement('div');
    el.className = 'lmm';
    el.innerHTML = `<section class="lmm-win" role="dialog" aria-modal="true" aria-label="Мини-карта"><div class="lmm-top" role="tablist" aria-label="Мини-карта">`
      + TABS.map(([id, t]) => `<button type="button" class="lmm-tab" role="tab" data-tab="${id}" aria-selected="false">${t}</button>`).join('')
      + `<button type="button" class="lmm-x" aria-label="Закрыть">×</button></div><div class="lmm-body" role="tabpanel"></div></section>`;
    document.body.appendChild(el);
    document.documentElement.classList.add('lmm-lock');
    win = { el, o };
    el.addEventListener('click', (e) => {
      const t = e.target;
      if (t === el) { close(); return; }
      const b = t.closest && t.closest('button'); if (!b) return;
      if (b.classList.contains('lmm-x')) close();
      else if (b.classList.contains('lmm-tab')) setTab(b.dataset.tab);
      else if (b.dataset.act === 'world') { const go = X.worldTab && X.worldTab(); close(); if (go) go(); }
    });
    document.addEventListener('keydown', onKey, true);
    render();
    const f = el.querySelector('.lmm-tab[aria-selected="true"]'); if (f) f.focus();
    want();
    clearInterval(tick); tick = setInterval(() => { if (!document.hidden && win) want().then(() => { if (win) render(); }); }, REFRESH_MS);
  }
  function close() {
    if (!win) return;
    clearInterval(tick); tick = 0;
    if (ro) { ro.disconnect(); ro = null; }
    document.removeEventListener('keydown', onKey, true);
    win.el.remove(); win = null; Z = null;
    document.documentElement.classList.remove('lmm-lock');
    if (back && back.isConnected && back.focus) try { back.focus(); } catch (e) {   }
    back = null;
    widgetsDraw();
  }

   

  function widgetVb(h, box) {
    const r = box.getBoundingClientRect(), a = r.width && r.height ? r.width / r.height : 1.5;
    const L = G.land, w = (L[2] - L[0]) / 8, hh = w / a;
    const c = h && h.t ? (h.t.tw ? [h.t.tw.x, h.t.tw.y] : h.t.c) : [(L[0] + L[2]) / 2, (L[1] + L[3]) / 2];
    return [c[0] - w / 2, c[1] - hh / 2, w, hh];
  }
  function widgetLabel(h) {
    const no = seasonNo();
    return [h && h.name, no ? `Сезон ${no}` : ''].filter(Boolean).join(' · ') || 'Мини-карта';
  }
  function widgetDraw(w) {
    const { el, o } = w;
    let b = el.querySelector('.lmm-wg');
    if (!b) {
      el.innerHTML = '<button type="button" class="lmm-wg"><span class="lmm-wg-map"></span><span class="lmm-wg-l"></span></button>';
      b = el.querySelector('.lmm-wg');
      b.addEventListener('click', () => open(X, o));
    }
    const h = X ? hereOf(o) : null, lab = widgetLabel(h), m = b.querySelector('.lmm-wg-map');
    b.querySelector('.lmm-wg-l').textContent = lab;
    b.setAttribute('aria-label', `Открыть мини-карту: ${lab}`);
    const key = W.d && G ? svgKey + '|' + (h && h.t ? h.t.id : '') : '-';
    if (m.dataset.k === key && m.firstChild) return;
    m.dataset.k = key;
    if (W.d && G) { layers(); m.innerHTML = svg(widgetVb(h, m), svgBody + hereMark(h, ''), 'Кусочек карты мира вокруг тебя'); fitU(m); }
    else m.innerHTML = '';
  }
  function widgetsDraw() {
    for (const w of [...WG]) { if (!w.el.isConnected) { WG.delete(w); continue; } try { widgetDraw(w); } catch (e) { console.warn('мини-карта: виджет', e); } }
    if (!WG.size) { clearInterval(wTick); wTick = 0; }
  }
  function widget(el, x, o = {}) {
    X = x || X; if (!el || !X) return null;
    let w = [...WG].find((v) => v.el === el);
    if (!w) { w = { el, o }; WG.add(w); } else w.o = o;
    widgetDraw(w);
    worldLoad().then(widgetsDraw);

    if (!wTick) wTick = setInterval(() => { if (document.hidden) return; widgetsDraw(); if (WG.size) worldLoad().then(widgetsDraw); }, REFRESH_MS);
    return el;
  }

  return {
     
    open,
    close,
     
    widget,
    isOpen: () => !!win,
     
    refresh: () => Promise.all([worldLoad(true), socLoad(true)]).then(() => { if (win) render(); widgetsDraw(); }),

    _state: () => ({ tab: tabNow, open: !!win, world: W.d, worldErr: W.err, soc: SOC.d, widgets: WG.size, geo: !!G }),
  };
})();
