/* 避ス地商店 — filter / cart(demo) / reveal */
(function () {
  /* ---------- カート（デモ: localStorage） ---------- */
  const countEl = document.getElementById('cartCount');
  const toast = document.getElementById('toast');
  const getCount = () => +(localStorage.getItem('hisuchi-cart') || 0);
  const render = () => { if (countEl) countEl.textContent = getCount(); };
  render();

  window.hisuchiAdd = (qty) => {
    localStorage.setItem('hisuchi-cart', getCount() + (qty || 1));
    render();
    if (toast) {
      toast.textContent = 'カートに追加しました（デモ）';
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
    chips.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      chips.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      cards.forEach((c) => {
        c.classList.toggle('is-hidden', f !== 'all' && !c.dataset.cat.split(' ').includes(f));
      });
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
