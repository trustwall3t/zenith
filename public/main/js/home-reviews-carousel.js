(function () {
  var tracks = document.querySelectorAll('[data-gg-reviews-carousel]');
  if (!tracks.length) return;

  tracks.forEach(function (track) {
    track.addEventListener('keydown', function (event) {
      if (window.matchMedia('(min-width: 641px)').matches) {
        return;
      }

      function scrollStep(direction) {
        var card = track.querySelector('.gg-tp-card');
        var gap = parseFloat(getComputedStyle(track).gap) || 16;
        var amount = card ? card.offsetWidth + gap : 320;
        track.scrollBy({ left: direction * amount, behavior: 'smooth' });
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollStep(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollStep(1);
      }
    });
  });
})();
