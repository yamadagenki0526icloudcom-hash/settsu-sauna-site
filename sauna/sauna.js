/* 摂津サウナ 商品ページ — モーション
   方針: 「遅く・少なく」。共通の script.js が担うのはLPのセクションだけなので、
   このページ固有の要素（3タイプ・仕様・価格・流れ・平面図）をここで受け持つ。
   イージングは expo.out（cubic-bezier(.16,1,.3,1) に相当）で統一する。

   共通script.jsがLenisとScrollTriggerを初期化した後に読み込む前提。
   GSAPが無い・省モーション設定のときは何もしない（CSS側で静的表示になる）。 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = document.getElementById('saunaBar');

  /* ---------- 追従バーは、モーションの可否に関係なく動かす ---------- */
  if (bar) {
    const priceSection = document.getElementById('price');
    const contactSection = document.getElementById('contact');
    if (priceSection && contactSection) {
      const update = () => {
        const y = window.scrollY || window.pageYOffset;
        const from = priceSection.offsetTop - window.innerHeight * 0.5;
        const to = contactSection.offsetTop - window.innerHeight * 0.8;
        const show = y > from && y < to;
        bar.classList.toggle('is-shown', show);
        bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      };
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }

  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const ease = 'expo.out';
  const D = 1.2;

  /* ---------- 3タイプ ---------- */
  const types = document.querySelector('.type-list');
  if (types) {
    gsap.from(types.children, {
      y: 30, opacity: 0, duration: D, stagger: 0.12, ease,
      scrollTrigger: { trigger: types, start: 'top 84%', once: true }
    });
  }

  /* ---------- 平面図: 設計図が引かれる順で組み立てる ---------- */
  const plan = document.querySelector('.spec-plan svg');
  if (plan) {
    const draws = plan.querySelectorAll('.pl-draw');
    /* 線の長さを測って、描かれていない状態から始める */
    draws.forEach((el) => {
      const len = typeof el.getTotalLength === 'function' ? el.getTotalLength() : 0;
      if (!len) return;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: plan, start: 'top 82%', once: true }
    });

    /* 1. 外形と寸法線が引かれる */
    tl.to(draws, { strokeDashoffset: 0, duration: 1.4, stagger: 0.06, ease: 'power2.inOut' }, 0)
      /* 2. 面が乗る */
      .to(plan.querySelectorAll('.pl-fill'), { opacity: 1, duration: 0.9, ease }, 0.5)
      .to(plan.querySelectorAll('.pl-part'), { opacity: 1, duration: 0.9, stagger: 0.1, ease }, 0.7)
      /* 3. 名前と寸法が入る */
      .to(plan.querySelectorAll('.pl-label'), { opacity: 1, duration: 0.8, stagger: 0.08, ease }, 1.15)
      .to(plan.querySelectorAll('.pl-dim'), { opacity: 1, duration: 0.8, stagger: 0.05, ease }, 1.35);
  }

  /* ---------- 仕様表: 上から順に読ませる ---------- */
  const specRows = document.querySelectorAll('.spec-table tbody tr');
  if (specRows.length) {
    gsap.from(specRows, {
      opacity: 0, y: 12, duration: 0.9, stagger: 0.05, ease,
      scrollTrigger: { trigger: '.spec-table', start: 'top 88%', once: true }
    });
  }

  /* ---------- 価格 ---------- */
  const cards = document.querySelector('.price-cards');
  if (cards) {
    gsap.from(cards.children, {
      y: 28, opacity: 0, duration: D, stagger: 0.14, ease,
      scrollTrigger: { trigger: cards, start: 'top 84%', once: true }
    });
  }

  /* 主役の金額だけ数を動かす。安っぽくならないよう1箇所に絞る */
  const mainPrice = document.querySelector('.price-card-main .price-value');
  if (mainPrice) {
    const unit = mainPrice.querySelector('span');
    const target = parseInt(mainPrice.textContent.replace(/[^0-9]/g, ''), 10);
    if (target) {
      const counter = { v: 0 };
      gsap.to(counter, {
        v: target,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: mainPrice, start: 'top 86%', once: true },
        onUpdate: () => {
          mainPrice.textContent = Math.round(counter.v).toLocaleString('ja-JP');
          if (unit) mainPrice.appendChild(unit);
        },
        onComplete: () => {
          mainPrice.textContent = target.toLocaleString('ja-JP');
          if (unit) mainPrice.appendChild(unit);
        }
      });
    }
  }

  /* オプション表 */
  const optRows = document.querySelectorAll('.option-table tbody tr');
  if (optRows.length) {
    gsap.from(optRows, {
      opacity: 0, y: 12, duration: 0.9, stagger: 0.05, ease,
      scrollTrigger: { trigger: '.option-table', start: 'top 88%', once: true }
    });
  }

  /* ---------- 導入の流れ: 上から順につながっていく ---------- */
  const flow = document.querySelector('.flow-list');
  if (flow) {
    gsap.from(flow.children, {
      x: -16, opacity: 0, duration: 1.0, stagger: 0.1, ease,
      scrollTrigger: { trigger: flow, start: 'top 84%', once: true }
    });
  }

  /* ---------- レンタル・OHAKO・注意書き ---------- */
  gsap.utils
    .toArray('.rental-inner > *, .ohako-inner > *, .price-caution, .option-note, .custom-note')
    .forEach((el) => {
      gsap.from(el, {
        y: 20, opacity: 0, duration: D, ease,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });

  /* ---------- 図版は下から拭き上げる（LPと同じ所作をそろえる） ---------- */
  gsap.utils.toArray('.rental-figure img, .spec-photo img').forEach((el) => {
    gsap.from(el, {
      clipPath: 'inset(0% 0% 100% 0%)',
      y: 24,
      duration: 1.35,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
