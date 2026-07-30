/* 避ス地商店 — filter / cart(demo) / motion
   モーションはトップページと同じ「下から立ち上がる」コンセプトで統一する。
   GSAP / Lenis が読めない場合と省モーション設定では静的表示にフォールバックする。 */
(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- カート（デモ: localStorage） ---------- */
  const countEl = document.getElementById('cartCount');
  const toast = document.getElementById('toast');
  const getCount = () => Math.max(0, +(localStorage.getItem('hisuchi-cart') || 0) || 0);
  const render = () => { if (countEl) countEl.textContent = getCount(); };
  render();

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('is-show'), 2600);
  };

  window.hisuchiAdd = (qty) => {
    const safeQty = Math.min(9, Math.max(1, Number.isFinite(qty) ? Math.round(qty) : 1));
    localStorage.setItem('hisuchi-cart', getCount() + safeQty);
    render();
    showToast(`${safeQty}点をデモカートに追加しました。注文・決済は行われません。`);
  };

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', () => {
    showToast('カート画面はまだありません。商品と販売方法を検討中です。');
  });

  /* ---------- 質問チップ → 商品フィルタ ---------- */
  const chips = document.getElementById('askChips');
  if (chips) {
    const cards = [...document.querySelectorAll('.card')];
    const filterStatus = document.getElementById('filterStatus');
    const countEl2 = document.getElementById('productsCount');
    const emptyEl = document.getElementById('productsEmpty');
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
      const shown = [];
      cards.forEach((c) => {
        const hidden = f !== 'all' && !c.dataset.cat.split(' ').includes(f);
        c.classList.toggle('is-hidden', hidden);
        if (!hidden) shown.push(c);
      });
      if (filterStatus) filterStatus.textContent = `${shown.length}件の商品を表示しています`;
      if (countEl2) {
        countEl2.innerHTML = f === 'all'
          ? `全 <b>${shown.length}</b> 点（検討中）`
          : `<b>${btn.textContent}</b> に合う品 <b>${shown.length}</b> 点`;
      }
      if (emptyEl) emptyEl.hidden = shown.length > 0;
      /* 絞り込み後に残ったカードを順に出し直し、切り替わりを体感できるようにする */
      if (typeof gsap !== 'undefined' && !reduced) {
        gsap.fromTo(shown, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out', overwrite: true });
      }
    });
  }

  /* ---------- 商品詳細: 選んだ内容で合計金額を出す ---------- */
  const priceEl = document.getElementById('pdpPrice');
  if (priceEl) {
    const base = +priceEl.dataset.base || 0;
    const totalEl = document.getElementById('pdpTotal');
    const calcEl = document.getElementById('pdpCalc');
    const colorSel = document.getElementById('color');
    const qtyInput = document.getElementById('qty');
    const yen = (n) => `¥${n.toLocaleString('ja-JP')}`;

    const updatePrice = () => {
      const opt = colorSel && colorSel.selectedOptions[0];
      const add = opt ? +opt.dataset.add || 0 : 0;
      const qty = Math.min(9, Math.max(1, Math.round(+qtyInput.value) || 1));
      const unit = base + add;
      if (totalEl) totalEl.textContent = yen(unit * qty);
      if (calcEl) {
        /* 単価と個数が分かる内訳。加算なし・1点のときは出さない */
        const parts = [];
        if (add) parts.push(`刺繍 +${yen(add)}`);
        if (qty > 1) parts.push(`${yen(unit)} × ${qty}点`);
        calcEl.textContent = parts.join('／');
        calcEl.hidden = parts.length === 0;
      }
    };

    if (colorSel) colorSel.addEventListener('change', updatePrice);
    if (qtyInput) {
      qtyInput.addEventListener('input', updatePrice);
      qtyInput.addEventListener('change', updatePrice);
    }
    updatePrice();
  }

  /* ---------- モーション ---------- */
  const revealTargets = document.querySelectorAll('.card, .edit-text, .edit-media, .ask-q, .ask-chips, .buy > *, .pdp-gallery, .pdp-info, .pdp-story');

  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    root.classList.remove('js-motion');
    revealTargets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const ease = 'power3.out';

  /* 冒頭のあいさつ。文字と罫線が順に立ち上がる */
  const intro = gsap.timeline({ defaults: { ease } });
  intro
    .from('.welcome-en', { y: 16, opacity: 0, duration: 0.9 }, 0)
    .from('.welcome-title', { y: 26, opacity: 0, duration: 1.05 }, 0.15)
    .from('.welcome-sub', { y: 18, opacity: 0, duration: 0.9 }, 0.4)
    .from('.welcome-scroll', { opacity: 0, duration: 0.8 }, 0.7);

  /* 商品カードは列ごとに順に現す */
  const grid = document.getElementById('grid');
  if (grid) {
    gsap.from(grid.querySelectorAll('.card'), {
      y: 26,
      opacity: 0,
      duration: 0.85,
      stagger: 0.06,
      ease,
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
    });
  }

  /* 質問バー・読み物・商品詳細 */
  gsap.utils.toArray('.ask-q, .ask-chips, .edit-text, .edit-media, .pdp-gallery, .pdp-info, .pdp-story').forEach((el) => {
    gsap.from(el, {
      y: 22,
      opacity: 0,
      duration: 0.9,
      ease,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* 支援セクションは見出しからボタンへ順に立ち上げ、視線を導く */
  const buy = document.querySelector('.buy');
  if (buy) {
    gsap.from(buy.children, {
      y: 20,
      opacity: 0,
      duration: 0.85,
      stagger: 0.08,
      ease,
      scrollTrigger: { trigger: buy, start: 'top 82%', once: true }
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
