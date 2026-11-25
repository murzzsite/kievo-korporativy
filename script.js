const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/JW26AYNUAA';
// Ссылка на бота (чек-лист). После переноса бота на аккаунт клиента поменять только здесь.
const BOT_LINK = 'https://t.me/trip_wire_super_bot?start=8bd06838c03e';

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  $$('[data-bot]').forEach(a => { a.href = BOT_LINK; });
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== HERO: секундомер до КП =====
  const fg = $('#watchFg'), num = $('#watchNum'), chip = $('#watchChip'), w1 = $('#w1'), w2 = $('#w2');
  const pad = n => String(n).padStart(2, '0');
  const showTime = k => {
    const s = Math.round(k * 3600);
    num.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
    fg.style.strokeDashoffset = (1 - k).toFixed(4);
  };
  let wRaf = 0;
  const runWatch = () => {
    cancelAnimationFrame(wRaf);
    chip.classList.remove('is-on'); w1.classList.add('is-now'); w2.classList.remove('is-now');
    if (reduce) { showTime(1); chip.classList.add('is-on'); w1.classList.remove('is-now'); w2.classList.add('is-now'); return; }
    const t0 = performance.now(), dur = 3600;
    const tick = t => {
      const k = clamp((t - t0) / dur);
      showTime(1 - Math.pow(1 - k, 3));
      if (k < 1) wRaf = requestAnimationFrame(tick);
      else { chip.classList.add('is-on'); w1.classList.remove('is-now'); w2.classList.add('is-now'); }
    };
    wRaf = requestAnimationFrame(tick);
  };
  showTime(0);
  setTimeout(runWatch, 500);
  $('#watchAgain').addEventListener('click', runWatch);

  // ===== MANIFEST: слова проявляются по скроллу =====
  const mf = $('#manifestText');
  const words = [];
  if (mf) {
    const text = mf.textContent.trim().split(/\s+/);
    mf.textContent = '';
    text.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'w' + (reduce ? ' on' : '');
      s.textContent = w;
      mf.append(s, i < text.length - 1 ? ' ' : '');
      words.push(s);
    });
  }
  const mfUpdate = () => {
    if (reduce || !mf) return;
    const r = mf.getBoundingClientRect();
    const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };

  // ===== SCENE: таймлайн по скроллу =====
  const scene = $('#timing');
  const items = $$('.now__i', scene);
  const rows = $$('.row', scene);
  const spot = $('#spot');
  const N = rows.length;
  let active = -1;
  const total = () => scene.offsetHeight - $('.scene__stick').offsetHeight;
  const sceneUpdate = () => {
    const p = clamp(-scene.getBoundingClientRect().top / total());
    const idx = Math.min(N - 1, Math.floor(p * N));
    rows.forEach((r, i) => {
      r.classList.toggle('is-done', i < idx);
      r.classList.toggle('is-on', i === idx);
      const seg = r.querySelector('.row__seg');
      if (seg) seg.style.setProperty('--f', clamp(p * N - i).toFixed(3));
    });
    if (idx !== active) { active = idx; items.forEach((it, i) => it.classList.toggle('is-on', i === idx)); }
    const g = clamp((p - 0.62) / 0.38);
    spot.style.opacity = g.toFixed(3);
    spot.style.transform = 'scale(' + (0.4 + g * 0.6).toFixed(3) + ')';
  };
  if (!reduce) {
    scene.classList.add('is-pin');
    rows.forEach(r => {
      const b = $('button', r);
      b.addEventListener('click', () => {
        const i = +b.dataset.i;
        scrollTo({ top: scene.getBoundingClientRect().top + scrollY + total() * ((i + 0.5) / N), behavior: 'smooth' });
      });
    });
    sceneUpdate();
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; mfUpdate(); if (scene.classList.contains('is-pin')) sceneUpdate(); });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  mfUpdate();

  // ===== SMETA tabs =====
  const SM = [
    ['Площадка', 'В презентации вы увидите список площадок. У каждой своя стоимость, поэтому выбор площадки заметно влияет на итоговую смету.'],
    ['Ведущий', 'В презентации будут ведущие на выбор. Сравниваете их по формату и по стоимости и выбираете того, кто подходит вашей компании.'],
    ['Артисты', 'Список артистов тоже в презентации. Выбираете тех, кто нужен вашему празднику, и видите, как это отражается на смете.'],
    ['Под ключ', 'Всё остальное, что нужно для праздника, мы собираем сами. Вам не нужно искать подрядчиков и сводить их между собой.'],
  ];
  const tabs = $$('.smeta__tabs [data-pill-item]');
  const sT = $('#smetaT'), sD = $('#smetaD');
  tabs.forEach(b => b.addEventListener('click', () => {
    const k = +b.dataset.k;
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === b)));
    sT.textContent = SM[k][0];
    sD.textContent = SM[k][1];
  }));

  // ===== smooth anchors =====
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const top = href === '#top' ? 0 : target.getBoundingClientRect().top + scrollY - 64;
      scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // ===== FORM -> CLOUDFLARE WORKER -> TELEGRAM =====
  const form = $('#leadForm');
  const msg = $('#formMsg');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    const fd = new FormData(form);
    const payload = {};
    fd.forEach((v, k) => { payload[k] = typeof v === 'string' ? v.trim() : v; });
    if (payload._gotcha) return;
    msg.classList.remove('err');
    if (!payload.name || !payload.contact) { msg.textContent = 'Заполните имя и контакт'; msg.classList.add('err'); return; }
    if (!payload.consent) { msg.textContent = 'Нужно согласие на обработку персональных данных'; msg.classList.add('err'); return; }
    delete payload.consent;
    if (!payload.date) delete payload.date;
    if (!payload.comment) delete payload.comment;
    payload.source = 'Кьево - лендинг';
    btn.disabled = true;
    btn.textContent = 'Отправляем...';
    try {
      const resp = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      btn.textContent = 'Отправлено';
      msg.textContent = 'Спасибо! Коммерческое предложение придёт в течение часа.';
      form.reset();
    } catch (err) {
      console.error(err);
      btn.textContent = 'Ошибка, попробуйте ещё раз';
      msg.textContent = 'Не удалось отправить. Попробуйте ещё раз или откройте бота в Telegram.';
      msg.classList.add('err');
    } finally {
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
    }
  });
})();
