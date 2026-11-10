/* Custom Build PCs (SH Builds) - site scripts. No dependencies. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const R = document.body.dataset.root || './', SITE = document.body.dataset.site || '';
  const img = k => `${R}assets/img/${k}.webp`;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const P = window.PROJECTS || [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile navigation ---------- */
  const mb = $('#mb'), nv = $('#nv');
  if (mb && nv) {
    mb.addEventListener('click', () => { const o = nv.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
    nv.addEventListener('click', e => { if (e.target.closest('a')) { nv.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------- Project cards (shared by gallery + carousel) ---------- */
  const card = (p, cls = '') =>
    `<button type="button" class="c${cls}" data-id="${p.id}" data-cat="${esc(p.c)}">` +
    `<img src="${img(p.id)}" alt="${esc(p.t)}: ${esc(p.d)}" width="800" height="1000" loading="lazy" decoding="async">` +
    (p.c !== 'Build Process' ? '<i class="bd">Sold</i>' : '') +
    `<span class="cap"><b>${esc(p.t)}</b><small>${esc(p.c)}</small></span></button>`;

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: .12 })
    : null;
  const reveal = () => $$('.c:not(.on)').forEach(c => io ? io.observe(c) : c.classList.add('on'));

  /* ---------- Portfolio gallery with filters (Our Work page) ---------- */
  const grid = $('#grid');
  if (grid) {
    const chips = $('.chips'), cats = ['All', ...new Set(P.map(p => p.c))];
    chips.innerHTML = cats.map((c, i) => `<button type="button" aria-pressed="${!i}" data-f="${esc(c)}">${esc(c)}</button>`).join('');
    const show = f => { grid.innerHTML = P.filter(p => f === 'All' || p.c === f).map(p => card(p)).join(''); reveal(); };
    chips.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('.chips button').forEach(x => x.setAttribute('aria-pressed', x === b));
      show(b.dataset.f);
    });
    show('All');
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'Custom PC build portfolio',
      itemListElement: P.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'ImageObject', name: p.t, description: p.d, contentUrl: `${SITE}assets/img/${p.id}.webp`, creator: { '@id': `${SITE}#business` } } }))
    });
    document.head.appendChild(ld);
  }

  /* ---------- Project details popup ---------- */
  const dlg = $('#dlg');
  if (dlg) {
    const di = $('#di'), th = $('#th');
    const openProject = p => {
      const ks = [p.id, ...(p.x || [])];
      di.src = img(p.id); di.alt = p.t;
      th.innerHTML = ks.length > 1 ? ks.map((k, i) => `<button type="button" data-k="${k}" aria-label="Photo ${i + 1} of ${ks.length}"${i ? '' : ' aria-current="true"'} style="background-image:url(${img(k)})"></button>`).join('') : '';
      $('#dc').textContent = p.c + (p.c === 'Build Process' ? '' : ' (Sold)');
      $('#dt').textContent = p.t; $('#dd').textContent = p.d;
      $('#ds').innerHTML = p.s.length ? p.s.map(r => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('') : '<div><dd class="mu">Specifications have not been listed for this build.</dd></div>';
      dlg.showModal();
    };
    th.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      di.src = img(b.dataset.k);
      $$('#th button').forEach(x => x.toggleAttribute('aria-current', x === b));
    });
    document.addEventListener('click', e => {
      const c = e.target.closest('.c');
      if (c) { const p = P.find(x => x.id === c.dataset.id); if (p) openProject(p); }
      else if (e.target === dlg || e.target.closest('.x')) dlg.close();
    });
  }

  /* ---------- Homepage infinite carousel ---------- */
  const car = $('#car');
  if (car && P.length) {
    const tr = car.firstElementChild, toggle = $('#carToggle'), SPEED = 42; /* px per second */
    tr.innerHTML = P.map(p => card(p, ' on')).join('');
    [...tr.children].forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1; k.setAttribute('data-clone', ''); tr.appendChild(k); });

    let pos = 0, last = performance.now(), hovering = false, focused = false, until = 0, manual = false, visible = true;
    const period = () => tr.children[P.length].offsetLeft - tr.children[0].offsetLeft;
    const running = () => !reduce.matches && !manual && !hovering && !focused && visible && !document.hidden && performance.now() > until;
    const tick = t => {
      const dt = Math.min((t - last) / 1000, .1); last = t;
      if (running()) {
        const per = period();
        if (per > 0) { pos += SPEED * dt; if (pos >= per) pos -= per; car.scrollLeft = pos; }
      } else pos = car.scrollLeft;
      requestAnimationFrame(tick);
    };
    /* swiping or dragging past the first set jumps back invisibly: the two sets are identical */
    car.addEventListener('scroll', () => { const per = period(); if (per > 0 && car.scrollLeft >= per) car.scrollLeft -= per; }, { passive: true });
    car.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovering = true; });
    car.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hovering = false; });
    car.addEventListener('touchstart', () => { until = Infinity; }, { passive: true });
    ['touchend', 'touchcancel'].forEach(n => car.addEventListener(n, () => { until = performance.now() + 2500; }, { passive: true }));
    car.addEventListener('focusin', () => { focused = true; });
    car.addEventListener('focusout', () => { focused = false; until = performance.now() + 1200; });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(car);

    const label = () => { toggle.textContent = manual ? 'Play scrolling' : 'Pause scrolling'; toggle.setAttribute('aria-pressed', manual); };
    const motion = () => { toggle.hidden = reduce.matches; };
    toggle.addEventListener('click', () => { manual = !manual; label(); });
    reduce.addEventListener('change', motion); motion(); label();
    requestAnimationFrame(tick);
  }
  reveal();

  /* ---------- Contact form: opens the visitor's email app, pre-filled ---------- */
  const cf = $('#cf');
  if (cf) cf.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(cf), g = k => f.get(k) || '';
    const body = `Name: ${g('n')}\nEmail: ${g('e')}\nService: ${g('s')}\nBudget: ${g('b') || 'Not specified'}\n\n${g('m')}`;
    location.href = 'mailto:hsteve2009@gmail.com?subject=' + encodeURIComponent('Website inquiry: ' + g('s')) + '&body=' + encodeURIComponent(body);
    $('.st').textContent = 'Your email app should open with this message ready to send. If it does not, email hsteve2009@gmail.com directly.';
  });
})();
