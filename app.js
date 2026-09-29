(function () {
  var root = document.documentElement;

  function preferred() {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function apply(t) {
    root.setAttribute('data-theme', t);
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.textContent = t === 'dark' ? '☾' : '☀';
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }
  window.toggleTheme = function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    apply(next);
  };

  apply(preferred());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) apply(e.matches ? 'dark' : 'light');
  });

  document.addEventListener('DOMContentLoaded', function () {
    var menu = document.querySelector('.menu-btn');
    var links = document.querySelector('nav .navlinks');
    if (menu && links) {
      menu.addEventListener('click', function () { links.classList.toggle('open'); });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { links.classList.remove('open'); });
      });
    }

    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e, i) {
          if (e.isIntersecting) {
            var el = e.target;
            setTimeout(function () { el.classList.add('in'); }, i * 60);
            ro.unobserve(el);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { ro.observe(el); });

      var counters = document.querySelectorAll('[data-count]');
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          var target = parseFloat(el.dataset.count);
          var prefix = el.dataset.prefix || '';
          var suffix = el.dataset.suffix || '';
          var group = el.dataset.group;
          var dur = 1400, start = performance.now();
          function step(now) {
            var p = Math.min((now - start) / dur, 1);
            var ease = 1 - Math.pow(1 - p, 3);
            var val = target * ease;
            var txt = group ? Math.round(val).toLocaleString('en-IN') : (target % 1 ? val.toFixed(0) : String(Math.round(val)));
            el.textContent = prefix + txt + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          co.unobserve(el);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { co.observe(c); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
      document.querySelectorAll('[data-count]').forEach(function (el) {
        el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || '');
      });
    }
  });
})();
