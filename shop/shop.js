/* オンラインストア — 予約受付 / 特商法の表記 / モーション
   モーションはトップページと同じ「下から立ち上がる」コンセプトで統一する。
   GSAP / Lenis が読めない場合と省モーション設定では静的表示にフォールバックする。 */
(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tシャツ 予約受付 ----------
     設定は商品ページ側の window.NSA_PREORDER に置く。
     送料・引渡時期・Payment Link が揃うまでは受付を開かない
     （特定商取引法11条で、送料と引渡時期は広告時の表示義務がある）。 */
  const preorder = document.getElementById('preorder');
  if (preorder) {
    const cfg = window.NSA_PREORDER || {};
    const links = cfg.links || {};
    const sel = document.getElementById('size');
    const btn = document.getElementById('preorderBtn');
    const note = document.getElementById('preorderNote');
    const inStock = ['S', 'M', 'L', 'XL'].filter((s) => typeof links[s] === 'string' && links[s].startsWith('https://'));

    const fee = document.getElementById('shipFee');
    if (cfg.shipping && fee) fee.textContent = '・送料' + cfg.shipping;

    if (cfg.shipping && cfg.shipFrom && inStock.length) {
      [...sel.options].forEach((o) => { o.disabled = !inStock.includes(o.value); });
      sel.value = inStock[0];
      sel.disabled = false;

      const when = document.getElementById('shipWhen');
      if (when) when.textContent = cfg.shipFrom + 'の発送を予定しています。';
      const bar = document.getElementById('topbar');
      if (bar) bar.innerHTML = '<strong>予約を受け付けています。</strong>' +
        '<span>ご注文をいただいてから印刷します。' + cfg.shipFrom + 'の発送予定です。</span>';

      btn.disabled = false;
      btn.textContent = '予約する（¥3,850）';
      note.textContent = 'お支払いはStripeの決済ページで行います。送料' + cfg.shipping + 'が別途かかります。';
      btn.addEventListener('click', () => {
        const url = links[sel.value];
        if (url) window.location.href = url;
      });
    }
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
