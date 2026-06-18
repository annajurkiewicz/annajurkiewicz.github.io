/* Shared behaviour: theme toggle, mobile menu, Works filter, footer year. */
(function () {
  // theme toggle (data-theme is pre-set by an inline head script to avoid flash)
  var btn = document.getElementById('theme');
  if (btn) {
    var setLabel = function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.textContent = dark ? '☀' : '☽';        // sun / moon
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    setLabel();
    btn.addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = dark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      setLabel();
    });
  }

  // mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('open'); });
  }

  // Works filter: click a tag to show matching previews; click active tag (or "all") to reset
  var filterBar = document.getElementById('filter');
  if (filterBar) {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-tags]'));
    filterBar.addEventListener('click', function (e) {
      var t = e.target.closest('.tag'); if (!t) return;
      var val = t.dataset.filter;
      var active = t.classList.contains('on') || val === 'all';
      filterBar.querySelectorAll('.tag').forEach(function (b) { b.classList.remove('on'); });
      if (!active) t.classList.add('on');
      items.forEach(function (it) {
        var show = active || val === 'all' || (' ' + it.dataset.tags + ' ').indexOf(' ' + val + ' ') !== -1;
        it.style.display = show ? '' : 'none';
      });
    });
  }

  // footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* minimal landing: reveal faded content on first scroll / mouse move / key / touch */
(function () {
  function wake() {
    document.documentElement.classList.add('awake');
    ['scroll', 'mousemove', 'touchstart', 'keydown', 'wheel'].forEach(function (e) { window.removeEventListener(e, wake); });
  }
  ['scroll', 'mousemove', 'touchstart', 'keydown', 'wheel'].forEach(function (e) { window.addEventListener(e, wake, { passive: true }); });
  setTimeout(wake, 1000); // and auto-reveal after ~1s
})();

/* background video: play it (incl. iOS), unless reduced-motion. If autoplay is blocked
   (e.g. iOS Low Power Mode), start it on the first user gesture. Poster shows meanwhile. */
(function () {
  var v = document.querySelector('.bgvideo'); if (!v) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.pause(); v.removeAttribute('autoplay'); return; }
  v.muted = true; v.setAttribute('muted', '');
  function tryplay() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  tryplay();
  var evts = ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown'];
  function once() { tryplay(); evts.forEach(function (e) { window.removeEventListener(e, once); }); }
  evts.forEach(function (e) { window.addEventListener(e, once, { passive: true }); });
})();


