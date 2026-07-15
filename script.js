/* 避ス地 未知の駅 摂津サウナ — minimal motion and countdown */
(function () {
  const target = new Date('2026-08-01T00:00:00+09:00');
  const remaining = target.getTime() - Date.now();
  const days = Math.max(0, Math.ceil(remaining / 86400000));
  const daysElement = document.getElementById('cfDays');

  if (daysElement) daysElement.textContent = String(days);

  if (remaining <= 0) {
    const prefix = document.getElementById('cfPrefix');
    const unit = document.getElementById('cfUnit');
    if (prefix) prefix.textContent = 'クラウドファンディング';
    if (daysElement) daysElement.textContent = '公開中';
    if (unit) unit.textContent = '';
  }

  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealElements.forEach((element) => observer.observe(element));
})();
