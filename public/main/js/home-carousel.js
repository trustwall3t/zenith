(function () {
  var root = document.querySelector('.gg-carousel');
  if (!root) return;

  var viewport = root.querySelector('.gg-carousel-viewport');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.gg-carousel-slide'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.gg-carousel-dot'));
  if (!slides.length) return;

  var index = slides.findIndex(function (slide) {
    return slide.classList.contains('is-active');
  });
  if (index < 0) index = 0;

  var intervalMs = parseInt(root.getAttribute('data-interval'), 10) || 5500;
  var timer = null;
  var paused = false;
  var touchStartX = 0;
  var touchStartY = 0;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setSlide(next) {
    if (next === index || next < 0 || next >= slides.length) return;
    slides[index].classList.remove('is-active');
    if (dots[index]) {
      dots[index].classList.remove('is-active');
      dots[index].setAttribute('aria-selected', 'false');
    }
    index = next;
    slides[index].classList.add('is-active');
    if (dots[index]) {
      dots[index].classList.add('is-active');
      dots[index].setAttribute('aria-selected', 'true');
    }
  }

  function nextSlide() {
    setSlide((index + 1) % slides.length);
  }

  function prevSlide() {
    setSlide((index - 1 + slides.length) % slides.length);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (paused || reduceMotion || slides.length < 2) return;
    timer = setInterval(nextSlide, intervalMs);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = parseInt(dot.getAttribute('data-index'), 10);
      if (!Number.isNaN(target)) {
        setSlide(target);
        startAutoplay();
      }
    });
  });

  root.addEventListener('mouseenter', function () {
    paused = true;
    stopAutoplay();
  });

  root.addEventListener('mouseleave', function () {
    paused = false;
    startAutoplay();
  });

  root.addEventListener('focusin', function () {
    paused = true;
    stopAutoplay();
  });

  root.addEventListener('focusout', function (event) {
    if (!root.contains(event.relatedTarget)) {
      paused = false;
      startAutoplay();
    }
  });

  if (viewport) {
    viewport.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextSlide();
        startAutoplay();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevSlide();
        startAutoplay();
      }
    });

    viewport.addEventListener(
      'touchstart',
      function (event) {
        if (!event.changedTouches.length) return;
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
      },
      { passive: true }
    );

    viewport.addEventListener(
      'touchend',
      function (event) {
        if (!event.changedTouches.length) return;
        var dx = event.changedTouches[0].clientX - touchStartX;
        var dy = event.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) nextSlide();
        else prevSlide();
        startAutoplay();
      },
      { passive: true }
    );
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  startAutoplay();
})();
