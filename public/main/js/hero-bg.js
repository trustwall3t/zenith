(function () {
  var hero = document.querySelector('.gg-hero');
  if (!hero) return;

  var slides = Array.prototype.slice.call(hero.querySelectorAll('.gg-hero-bg-slide'));
  if (slides.length < 2) return;

  var index = slides.findIndex(function (slide) {
    return slide.classList.contains('is-active');
  });
  if (index < 0) index = 0;

  var intervalMs = parseInt(hero.getAttribute('data-hero-interval'), 10) || 5500;
  var timer = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setSlide(next) {
    if (next === index || next < 0 || next >= slides.length) return;
    slides[index].classList.remove('is-active');
    index = next;
    slides[index].classList.add('is-active');
  }

  function nextSlide() {
    setSlide((index + 1) % slides.length);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (reduceMotion) return;
    timer = setInterval(nextSlide, intervalMs);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  startAutoplay();
})();
