/* Create+Everyday — "Agentura" editorial motion layer.
   Vanilla, dependency-free. Respects prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1) Scroll reveals -------------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll('.ce-reveal');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* 2) Marquee — duplicate content so the loop is seamless ------------- */
  function initMarquees() {
    document.querySelectorAll('.ce-marquee__track').forEach(function (track) {
      if (track.dataset.cloned) return;
      track.dataset.cloned = '1';
      track.innerHTML += track.innerHTML; /* 2x for -50% keyframe */
    });
  }

  /* 3) Cursor follower (pointer devices only) ------------------------- */
  function initCursor() {
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    var dot = document.createElement('div');
    dot.className = 'ce-cursor';
    document.body.appendChild(dot);
    var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
    document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .ce-btn, .ce-statement')) dot.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, .ce-btn, .ce-statement')) dot.classList.remove('is-hover');
    });
  }

  /* 4) Hero background video — autoplay, pause off-screen, honor reduce - */
  function initHeroVideo() {
    document.querySelectorAll('.ce-hero-ag__video').forEach(function (v) {
      if (reduce) {
        try { v.removeAttribute('autoplay'); v.pause(); } catch (e) {}
        return;
      }
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              var p = v.play();
              if (p && p.catch) p.catch(function () {});
            } else { v.pause(); }
          });
        }, { threshold: 0.1 });
        io.observe(v);
      }
    });
  }

  /* 5) Statement image carousel (Instagram-style) --------------------- */
  function initStatementCarousels() {
    document.querySelectorAll('[data-st-carousel]').forEach(function (c) {
      if (c.dataset.stReady) return;
      c.dataset.stReady = '1';
      var track = c.querySelector('[data-st-track]');
      var slides = Array.prototype.slice.call(c.querySelectorAll('[data-st-slide]'));
      var dots = Array.prototype.slice.call(c.querySelectorAll('[data-st-dot]'));
      var count = c.querySelector('[data-st-count]');
      var n = slides.length;
      if (!track || n < 2) return;
      var i = 0, timer = null;
      var delay = parseInt(c.getAttribute('data-autoplay'), 10) || 0;

      function go(idx) {
        i = (idx + n) % n;
        track.style.transform = 'translateX(-' + (i * 100) + '%)';
        dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
        if (count) count.textContent = (i + 1) + '/' + n;
      }
      function start() { if (reduce || delay <= 0) return; stop(); timer = setInterval(function () { go(i + 1); }, delay * 1000); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }

      dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); start(); }); });
      var prev = c.querySelector('[data-st-prev]'), next = c.querySelector('[data-st-next]');
      if (prev) prev.addEventListener('click', function () { go(i - 1); start(); });
      if (next) next.addEventListener('click', function () { go(i + 1); start(); });

      var sx = 0, dragging = false;
      c.addEventListener('pointerdown', function (e) { dragging = true; sx = e.clientX; stop(); });
      c.addEventListener('pointerup', function (e) {
        if (!dragging) return; dragging = false;
        var dx = e.clientX - sx;
        if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
        start();
      });
      c.addEventListener('pointerleave', function () { dragging = false; });
      c.addEventListener('mouseenter', stop);
      c.addEventListener('mouseleave', start);

      go(0); start();
    });
  }

  function init() { initReveals(); initMarquees(); initCursor(); initHeroVideo(); initStatementCarousels(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  /* Re-run reveals/marquees when sections are added in the theme editor */
  document.addEventListener('shopify:section:load', function () { initReveals(); initMarquees(); initHeroVideo(); initStatementCarousels(); });
})();
