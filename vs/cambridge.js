(function () {
  var m = document.getElementById('camModal');
  if (!m) return;
  var last = null, t = 0, kbd = false;
  function open(from, kb) {
    clearTimeout(t); last = from || null; kbd = !!kb;
    m.hidden = false; m.scrollTop = 0;
    document.documentElement.classList.add('cam-lock');
    if (window.VS_LENIS) window.VS_LENIS.stop();
    requestAnimationFrame(function () { m.classList.add('on'); if (kbd) m.querySelector('.cam-x').focus({ preventScroll: true }); });
  }
  function close(now, then) {
    if (m.hidden) return;
    m.classList.remove('on');
    function done() {
      m.hidden = true;
      document.documentElement.classList.remove('cam-lock');
      if (window.VS_LENIS) window.VS_LENIS.start();
      if (last && kbd) last.focus({ preventScroll: true }); else if (document.activeElement) document.activeElement.blur();
      if (then) then();
    }
    if (now) done(); else t = setTimeout(done, 300);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.cambridge-lockup');
    if (a) { e.preventDefault(); e.stopPropagation(); open(a, e.detail === 0); return; }
    if (m.hidden) return;
    if (e.target === m || (e.target.closest && e.target.closest('.cam-x'))) { close(); return; }
    var l = e.target.closest && e.target.closest('#camModal a[href^="#"]');
    if (l) {
      e.preventDefault(); e.stopPropagation();
      var el = document.querySelector(l.getAttribute('href'));
      last = null;
      close(true, function () {
        if (!el) return;
        if (window.VS_LENIS) window.VS_LENIS.scrollTo(el, { offset: -20 }); else el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  if (location.hash === '#cambridge') setTimeout(function () { open(); }, 400);
})();
