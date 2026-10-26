/**
 * Public pages: fixed 1200px layout scaled via viewport meta.
 * Real devices: lock meta scale after first stable apply; never reflow on URL-bar resize.
 */
(function () {
    var meta = document.querySelector('meta[name="viewport"][data-gg-fit]');
    if (!meta) {
        return;
    }

    var root = document.documentElement;
    if (!root.classList.contains('gg-public-root')) {
        return;
    }

    var disposers = [];
    var scaleLocked = meta.getAttribute('data-gg-scale-locked') === '1';

    function track(target, type, handler, options) {
        target.addEventListener(type, handler, options);
        disposers.push(function () {
            target.removeEventListener(type, handler, options);
        });
    }

    if (document.body) {
        document.body.classList.add('gg-desktop-lock');
    }

    var layoutWidth = parseInt(meta.getAttribute('data-layout-width'), 10) || 1200;

    function isMobileUa() {
        var ua = navigator.userAgent || '';
        return /iphone|ipod|ipad|android|mobile|webos|blackberry|iemobile|opera mini/i.test(ua);
    }

    function readDeviceWidthFromCookie() {
        try {
            var m = document.cookie.match(/(?:^|;\s*)gg-vw=(\d+)/);
            if (!m) return 0;
            var w = parseInt(m[1], 10);
            if (w <= 0 || w >= 2400) return 0;
            if (isMobileUa() && w > 820) return 0;
            return w;
        } catch (e) {}
        return 0;
    }

    function readStableDeviceWidth() {
        var fromCookie = readDeviceWidthFromCookie();
        if (fromCookie > 0) return fromCookie;
        if (window.screen && window.screen.width > 0) {
            var sw = window.screen.width;
            var sh = window.screen.height || sw;
            return Math.min(sw, sh);
        }
        if (window.innerWidth > 0) return window.innerWidth;
        return layoutWidth;
    }

    function computeScale(deviceWidth) {
        var scale = layoutWidth > 0 ? deviceWidth / layoutWidth : 1;
        if (scale > 1) scale = 1;
        return Math.round(scale * 10000) / 10000;
    }

    function viewportContent(scale) {
        return (
            'width=' + layoutWidth +
            ', initial-scale=' + scale +
            ', minimum-scale=' + scale +
            ', maximum-scale=5' +
            ', user-scalable=yes' +
            ', viewport-fit=cover'
        );
    }

    function syncViewportHeight() {
        var h = 0;
        if (window.visualViewport && window.visualViewport.height > 0) {
            h = window.visualViewport.height;
        } else if (window.innerHeight > 0) {
            h = window.innerHeight;
        }
        if (h > 0) {
            root.style.setProperty('--gg-viewport-h', h + 'px');
        }
    }

    function persistDeviceWidth(w) {
        try {
            document.cookie =
                'gg-vw=' + Math.round(w) + '; path=/; max-age=604800; samesite=lax';
        } catch (e) {}
    }

    function markReady() {
        syncViewportHeight();
        root.classList.remove('gg-desktop-boot');
        root.classList.add('gg-desktop-ready', 'gg-layout-ready');
        root.dispatchEvent(new CustomEvent('gg-layout-ready'));
        root.dispatchEvent(new CustomEvent('gg-desktop-ready'));
        root.dispatchEvent(new CustomEvent('gg-viewport-stable'));
    }

    function applyScale(force) {
        if (!meta.isConnected || !root.classList.contains('gg-public-root')) {
            return;
        }
        if (scaleLocked && !force) {
            syncViewportHeight();
            return;
        }

        document.querySelectorAll('meta[name="viewport"]').forEach(function (m) {
            if (!m.getAttribute('data-gg-fit')) {
                m.remove();
            }
        });

        var deviceWidth = readStableDeviceWidth();
        persistDeviceWidth(deviceWidth);
        var next = viewportContent(computeScale(deviceWidth));
        if (meta.content !== next) {
            meta.content = next;
        }
        meta.setAttribute('data-gg-scale-locked', '1');
        scaleLocked = true;
        syncViewportHeight();
    }

    function settleThenReveal() {
        var w1 = readStableDeviceWidth();
        applyScale(false);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                var w2 = readStableDeviceWidth();
                if (Math.abs(w2 - w1) > 2) {
                    scaleLocked = false;
                    meta.setAttribute('data-gg-scale-locked', '0');
                    applyScale(false);
                }
                markReady();
            });
        });
    }

    settleThenReveal();

    track(window, 'orientationchange', function () {
        scaleLocked = false;
        meta.setAttribute('data-gg-scale-locked', '0');
        window.setTimeout(function () {
            applyScale(true);
            syncViewportHeight();
            markReady();
        }, 250);
    });

    track(window, 'resize', syncViewportHeight);
    if (window.visualViewport) {
        track(window.visualViewport, 'resize', syncViewportHeight);
    }

    window.__ggTeardownDesktopViewport = function () {
        disposers.forEach(function (dispose) {
            dispose();
        });
        disposers.length = 0;
        if (meta.parentNode) {
            meta.parentNode.removeChild(meta);
        }
        delete window.__ggTeardownDesktopViewport;
    };
})();
