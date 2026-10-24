(function () {
  var layoutWidth = 1200;
  var canvas = document.getElementById('gg-desktop-canvas');
  var root = document.documentElement;
  if (!canvas || !root.classList.contains('gg-public-root')) {
    if (root) {
      root.classList.add('gg-layout-ready');
    }
    return;
  }

  var resizeTimer = null;

  function applyScale() {
    var viewWidth = window.innerWidth || document.documentElement.clientWidth || layoutWidth;
    var scale = viewWidth / layoutWidth;
    if (scale > 1) {
      scale = 1;
    }
    if (scale < 0.05) {
      scale = 0.05;
    }

    canvas.style.width = layoutWidth + 'px';

    if (typeof canvas.style.zoom !== 'undefined') {
      canvas.style.zoom = scale;
      canvas.style.transform = '';
    } else {
      canvas.style.zoom = '';
      canvas.style.transform = 'scale(' + scale + ')';
      canvas.style.transformOrigin = 'top center';
    }

    var visualHeight = canvas.offsetHeight * scale;
    document.body.style.minHeight = Math.ceil(visualHeight) + 'px';
  }

  function markReady() {
    applyScale();
    root.classList.add('gg-layout-ready');
    root.dispatchEvent(new CustomEvent('gg-layout-ready'));
  }

  function scheduleResize() {
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(applyScale, 100);
  }

  markReady();

  window.addEventListener('resize', scheduleResize, { passive: true });
  window.addEventListener('orientationchange', scheduleResize, { passive: true });
  window.addEventListener('load', markReady, { once: true });

  if (typeof ResizeObserver !== 'undefined') {
    var observer = new ResizeObserver(scheduleResize);
    observer.observe(canvas);
  }
})();
