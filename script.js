/* 避ス地 未知の駅 摂津サウナ — scroll motion */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- countdown to 2026-08-01 JST ---------- */
  const target = new Date('2026-08-01T00:00:00+09:00');
  const remaining = target - Date.now();
  const days = Math.max(0, Math.ceil(remaining / 86400000));
  for (const id of ['cfDays', 'cfDays2']) {
    const el = document.getElementById(id);
    if (el) el.textContent = days;
  }
  if (remaining <= 0) {
    const cfLabel = document.getElementById('cfLabel');
    const cfPrefix = document.getElementById('cfPrefix');
    const cfDays = document.getElementById('cfDays');
    const cfDays2 = document.getElementById('cfDays2');
    const cfUnit = document.getElementById('cfUnit');
    const cfUnit2 = document.getElementById('cfUnit2');
    if (cfLabel) cfLabel.textContent = 'CAMPFIREクラウドファンディング公開中';
    if (cfPrefix) cfPrefix.textContent = 'クラウドファンディング';
    if (cfDays) cfDays.textContent = '公開中';
    if (cfDays2) cfDays2.textContent = '公開中';
    if (cfUnit) cfUnit.textContent = '';
    if (cfUnit2) cfUnit2.textContent = '';
  }

  /* ---------- nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- GSAP / Lenis (CDN欠落や省モーション時は静的表示のまま) ---------- */
  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: 0.11 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const t = document.querySelector(href);
        if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); }
      });
    });
  }

  /* ---------- hero ---------- */
  gsap.from('.hero-line > span', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.15 });
  gsap.from('.hero-eyebrow, .hero-sub, .hero-cf', { opacity: 0, y: 24, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.55 });
  gsap.to('.hero-bg img', {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-inner', {
    y: -60, opacity: 0.35, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '40% top', end: 'bottom top', scrub: true }
  });

  /* ---------- 縦書きストーリー: 1行ずつ ---------- */
  gsap.from('.story-line', {
    opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', stagger: 0.22,
    scrollTrigger: { trigger: '.story-tate', start: 'top 72%' }
  });

  /* ---------- 汎用リビール ---------- */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 44, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 84%' }
    });
  });

  /* ---------- カウントアップ ---------- */
  gsap.utils.toArray('.count').forEach((el) => {
    const to = +el.dataset.to;
    gsap.fromTo(el, { textContent: 0 }, {
      textContent: to, duration: 1.6, ease: 'power1.out', snap: { textContent: 1 },
      onUpdate() { el.textContent = Number(el.textContent).toLocaleString(); },
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  /* ---------- 図面パララックス ---------- */
  gsap.utils.toArray('.plan-grid figure, .students-media').forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 ? -26 : 26, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
})();
