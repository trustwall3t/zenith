(function () {
  var slot = document.querySelector('.gg-header-translate-slot');
  var bar = document.querySelector('.gg-public-translate-bar');
  if (!slot || !bar) {
    return;
  }

  var frame = null;

  function positionBar() {
    var rect = slot.getBoundingClientRect();
    if (rect.width < 1 && rect.height < 1) {
      return;
    }
    bar.style.top = Math.round(rect.top) + 'px';
    bar.style.left = Math.round(rect.left) + 'px';
    bar.style.right = 'auto';
  }

  function schedule() {
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
    frame = window.requestAnimationFrame(positionBar);
  }

  schedule();
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });

  if (typeof ResizeObserver !== 'undefined') {
    var observer = new ResizeObserver(schedule);
    observer.observe(slot);
    var shell = document.getElementById('gg-public-shell');
    if (shell) {
      observer.observe(shell);
    }
  }

  document.documentElement.addEventListener('gg-layout-ready', schedule);
  document.documentElement.addEventListener('gg-desktop-ready', schedule);
})();
