/* 活動報告ページのモーション。
   時間の軸がスクロールに合わせて伸び、通過した節目の点が順に灯る。
   共通script.jsと同じく、GSAP欠落・省モーション時は静的表示にフォールバックする。 */
(function () {
  const wrap = document.querySelector('.log-wrap');
  if (!wrap) return;

  const axis = wrap.querySelector('.log-axis');
  const items = wrap.querySelectorAll('.log > li');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const showAll = () => items.forEach((li) => li.classList.add('is-lit'));

  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    showAll();
    return;
  }

  const ease = 'power3.out';

  /* 軸はスクロール量にそのまま追従させる（スクラブ）。演出ではなく現在地の表示 */
  gsap.fromTo(axis, { scaleY: 0 }, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: wrap, start: 'top 68%', end: 'bottom 78%', scrub: 0.6 }
  });

  /* 項目は下から立ち上がる。共通script.jsのstaggerと同じ値に揃える */
  gsap.from(items, {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.07,
    ease,
    scrollTrigger: { trigger: wrap, start: 'top 86%', once: true }
  });

  /* 軸が届いた項目から点を灯す */
  items.forEach((li) => {
    ScrollTrigger.create({
      trigger: li,
      start: 'top 72%',
      once: true,
      onEnter: () => li.classList.add('is-lit')
    });
  });
})();
