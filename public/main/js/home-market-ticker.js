(function () {
  var marquee = document.querySelector('.gg-market-ticker-marquee');
  if (!marquee) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var pixelsPerSecond = 55;

  function setDuration() {
    var width = marquee.scrollWidth / 2;
    if (width <= 0) {
      return;
    }
    var seconds = Math.max(35, Math.round(width / pixelsPerSecond));
    marquee.style.animationDuration = seconds + 's';
  }

  if (document.readyState === 'complete') {
    setDuration();
  } else {
    window.addEventListener('load', setDuration, { once: true });
  }
})();
