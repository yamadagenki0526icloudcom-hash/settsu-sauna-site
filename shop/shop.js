/* 避ス地商店 — filter / cart(demo) / reveal */
(function () {
  /* ---------- カート（デモ: localStorage） ---------- */
  const countEl = document.getElementById('cartCount');
  const toast = document.getElementById('toast');
  const getCount = () => Math.max(0, +(localStorage.getItem('hisuchi-cart') || 0) || 0);
  const render = () => { if (countEl) countEl.textContent = getCount(); };
  render();

  window.hisuchiAdd = (qty) => {
    const safeQty = Math.min(9, Math.max(1, Number.isFinite(qty) ? Math.round(qty) : 1));
    localStorage.setItem('hisuchi-cart', getCount() + safeQty);
    render();
    if (toast) {
      toast.textContent = `${safeQty}点をデモカートに追加しました。注文・決済は行われません。`;
      toast.classList.add('is-show');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove('is-show'), 2200);
    }
  };

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', () => {
    if (toast) {
      toast.textContent = 'カート画面は準備中です（たたき台）';
      toast.classList.add('is-show');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove('is-show'), 2200);
    }
  });

  /* ---------- 質問チップ → 商品フィルタ ---------- */
  const chips = document.getElementById('askChips');
  if (chips) {
    const cards = [...document.querySelectorAll('.card')];
    const filterStatus = document.getElementById('filterStatus');
    chips.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      chips.querySelectorAll('button').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      const f = btn.dataset.filter;
      let visibleCount = 0;
      cards.forEach((c) => {
        const hidden = f !== 'all' && !c.dataset.cat.split(' ').includes(f);
        c.classList.toggle('is-hidden', hidden);
        if (!hidden) visibleCount += 1;
      });
      if (filterStatus) filterStatus.textContent = `${visibleCount}件の商品を表示しています`;
    });
  }

  /* ---------- スクロールリビール ---------- */
  const targets = document.querySelectorAll('.card, .edit-text, .edit-media, .ask-q, .ask-chips');
  targets.forEach((el) => el.classList.add('rv'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach((el) => io.observe(el));
})();
