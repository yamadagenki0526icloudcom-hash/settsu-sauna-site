/* NEXT SETTSU ALLIANCE — scroll motion
   コンセプト: 「湯気のように、下から立ち上がる」
   すべての要素を下から現す動きで統一し、ロゴの湯気とトーンを合わせる。
   GSAP / Lenis が読めない場合と省モーション設定では、静的表示にフォールバックする。 */
(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const showAll = () => {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.section-heading').forEach((el) => el.classList.add('is-drawn'));
  };

  /* GSAP欠落・省モーション時はアニメーションを一切かけず、そのまま見せる */
  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    root.classList.remove('js-motion');
    showAll();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* 慣性スクロール。読み込めなければ通常スクロールのまま進む */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -20 });
      });
    });
  }

  /* コンテナは即座に表示し、中の要素を個別に動かす */
  revealTargets.forEach((el) => el.classList.add('is-visible'));

  const ease = 'power3.out';

  /* ---------- ヒーロー: 読み込み時のシークエンス ---------- */
  /* 額縁（ロゴ→ナビ）が立ち上がってから、ヒーローが開く。
     ロゴは湯気のマークなので、ページ全体と同じく下から現す。
     伏せた初期状態はCSSの html.js-motion 側に置いてあり、
     GSAPが無い／省モーション時は js-motion が外れてそのまま見える。 */
  const intro = gsap.timeline({ defaults: { ease } });
  intro
    .from('.hero-image', { scale: 1.09, duration: 1.6, ease: 'power2.out' }, 0)
    .fromTo('.masthead .brand', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.95 }, 0.05)
    .fromTo('.site-nav-inner > a', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 }, 0.35)
    .from('.hero-wordmark .wm i', { yPercent: 115, duration: 1.0, stagger: 0.08 }, 0.4)
    .from('.hero h1', { y: 26, opacity: 0, duration: 0.85 }, 0.8)
    .from('.hero-lead', { y: 18, opacity: 0, duration: 0.85 }, 0.95)
    .fromTo('.hero-button', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 1.08);

  /* ---------- ヒーロー: スクロールで奥へ引く ---------- */
  gsap.to('.hero-image', {
    yPercent: 9,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-copy', {
    y: -34,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '45% top', end: 'bottom top', scrub: true }
  });

  /* ---------- 見出しの橙のアクセント線が中央から伸びる（共通の合図） ---------- */
  document.querySelectorAll('.section-heading').forEach((heading) => {
    ScrollTrigger.create({
      trigger: heading,
      start: 'top 88%',
      once: true,
      onEnter: () => heading.classList.add('is-drawn')
    });
    gsap.from(heading.children, {
      y: 20,
      opacity: 0,
      duration: 0.85,
      stagger: 0.1,
      ease,
      scrollTrigger: { trigger: heading, start: 'top 88%', once: true }
    });
  });

  /* ---------- 一覧・グリッドは順番に立ち上がる ---------- */
  const staggerGroups = [
    '.news-list li',
    '.facility-grid p',
    '.team-list li',
    '.timeline li',
    '.story-grid article'
  ];
  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      const parent = el.parentElement;
      if (parent.dataset.motionBound) return;
      parent.dataset.motionBound = '1';
      gsap.from(parent.children, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease,
        scrollTrigger: { trigger: parent, start: 'top 86%', once: true }
      });
    });
  });

  /* ---------- 写真・図面は下から拭き上げるように現す ---------- */
  gsap.utils
    .toArray('.feature-figure .pfx, .plan-grid figure, .story-grid img, .about-mark')
    .forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(0% 0% 100% 0%)',
        y: 26,
        duration: 1.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

  /* ---------- 大きな写真は枠の中でゆっくり流れる（奥行きを出す） ----------
     imgを枠(.pfx)で包み、枠より14%高くした写真を上下に動かす。
     枠は動かないので、レイアウトは一切変わらない。 */
  gsap.utils.toArray('.feature-figure img').forEach((img) => {
    const wrap = document.createElement('span');
    wrap.className = 'pfx';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    gsap.fromTo(img,
      { yPercent: -4.5 },
      {
        yPercent: 4.5,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
  });

  /* ---------- 計画の年表: 軸が左から引かれ、点が順に灯る ---------- */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const axis = document.createElement('span');
    axis.className = 'timeline-axis';
    axis.setAttribute('aria-hidden', 'true');
    timeline.appendChild(axis);
    gsap.fromTo(axis,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: timeline, start: 'top 82%', end: 'bottom 72%', scrub: 0.6 }
      });
    timeline.querySelectorAll('li').forEach((li) => {
      ScrollTrigger.create({
        trigger: li,
        start: 'top 78%',
        once: true,
        onEnter: () => li.classList.add('is-lit')
      });
    });
  }

  /* ---------- 本文・ボタンはやわらかく ---------- */
  gsap.utils
    .toArray('.about-lead, .about-signature, .statement, .center-copy, .domains-note, .outline-button, .human-quote, .quote-by, .feature-name')
    .forEach((el) => {
      gsap.from(el, {
        y: 18,
        opacity: 0,
        duration: 0.85,
        ease,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });

  /* ---------- クラウドファンディング ---------- */
  const support = document.querySelector('.support-inner');
  if (support) {
    gsap.from(support.children, {
      y: 26,
      opacity: 0,
      duration: 0.9,
      stagger: 0.09,
      ease,
      scrollTrigger: { trigger: support, start: 'top 85%', once: true }
    });
  }

  /* 画像の遅延読み込みで高さが変わるため、読み込み完了後に位置を取り直す */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();

/* 主要な導線のクリックを計測する。どのボタンから動いたかを区別できるようにしておく */

/* 問い合わせに到達した導線は、GA4の「キーイベント」に指定できるよう独立した名前でも送る。
   GA4の管理画面「イベントを作成」はカスタムイベント（cta_click）をトリガーに選べないため、
   条件で絞るのではなく、最初から専用のイベント名で送る必要がある。 */
var GOAL_EVENTS = {
  contact_form: 'contact_submit',  // LPのフォームボタン
  nsa_mail:     'contact_submit',  // LPのメールリンク
  sauna_form:   'sauna_contact',   // サウナページのフォームボタン
  sauna_mail:   'sauna_contact'    // サウナページのメールリンク
};

document.querySelectorAll('[data-track]').forEach(function (el) {
  el.addEventListener('click', function () {
    if (typeof gtag !== 'function') return;
    var name = el.dataset.track;
    gtag('event', 'cta_click', { cta: name });
    if (GOAL_EVENTS[name]) {
      gtag('event', GOAL_EVENTS[name], { cta: name });
    }
  });
});
