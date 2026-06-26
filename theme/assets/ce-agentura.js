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

  function init() { initReveals(); initMarquees(); initCursor(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  /* Re-run reveals/marquees when sections are added in the theme editor */
  document.addEventListener('shopify:section:load', function () { initReveals(); initMarquees(); });
})();
