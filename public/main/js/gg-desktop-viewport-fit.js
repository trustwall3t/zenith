/**
 * Public pages: fixed 1200px desktop layout scaled via viewport meta (hanaliberty.org pattern).
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

    function track(target, type, handler, options) {
        target.addEventListener(type, handler, options);
        disposers.push(function () {
            target.removeEventListener(type, handler, options);
        });
    }

    root.classList.add('gg-desktop-lock');
    if (document.body) {
        document.body.classList.add('gg-desktop-lock');
    }

    var layoutWidth = parseInt(meta.getAttribute('data-layout-width'), 10) || 1200;

    function readDeviceWidth() {
        if (window.visualViewport && window.visualViewport.width > 0) {
            return window.visualViewport.width;
        }
        if (window.innerWidth > 0) {
            return window.innerWidth;
        }
        if (window.screen && window.screen.width > 0) {
            var sw = window.screen.width;
            var sh = window.screen.height || sw;
            return Math.min(sw, sh);
        }

        return layoutWidth;
    }

    function computeScale(deviceWidth) {
        var scale = layoutWidth > 0 ? deviceWidth / layoutWidth : 1;
        if (scale > 1) {
            scale = 1;
        }

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
        if (root.classList.contains('gg-desktop-boot')) {
            root.classList.remove('gg-desktop-boot');
            root.classList.add('gg-desktop-ready', 'gg-layout-ready');
            root.dispatchEvent(new CustomEvent('gg-layout-ready'));
            root.dispatchEvent(new CustomEvent('gg-desktop-ready'));
        }
    }

    function readDeviceWidthFromCookie() {
        try {
            var m = document.cookie.match(/(?:^|;\s*)gg-vw=(\d+)/);
            if (!m) return 0;
            var w = parseInt(m[1], 10);
            if (w > 0 && w < 2400) return w;
        } catch (e) {}
        return 0;
    }

    function apply() {
        if (!meta.isConnected || !root.classList.contains('gg-public-root')) {
            return;
        }
        document.querySelectorAll('meta[name="viewport"]').forEach(function (m) {
            if (!m.getAttribute('data-gg-fit')) {
                m.remove();
            }
        });
        var fromCookie = readDeviceWidthFromCookie();
        var deviceWidth = fromCookie > 0 ? fromCookie : readDeviceWidth();
        persistDeviceWidth(deviceWidth);
        var scale = computeScale(deviceWidth);
        var next = viewportContent(scale);
        if (meta.content !== next) {
            meta.content = next;
        }
    }

    var resizeTimer = 0;
    function applyDebounced() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            apply();
            syncViewportHeight();
        }, 120);
    }

    apply();
    markReady();

    if (document.readyState === 'loading') {
        track(document, 'DOMContentLoaded', function () {
            apply();
            markReady();
        }, { once: true });
    }

    var revealTimeout = window.setTimeout(markReady, 400);

    track(window, 'orientationchange', function () {
        window.setTimeout(function () {
            apply();
            syncViewportHeight();
            markReady();
        }, 200);
    });
    track(window, 'resize', applyDebounced);
    if (window.visualViewport) {
        track(window.visualViewport, 'resize', applyDebounced);
    }

    window.__ggTeardownDesktopViewport = function () {
        window.clearTimeout(revealTimeout);
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
