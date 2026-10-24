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
        if (window.screen && window.screen.width > 0) {
            return window.screen.width;
        }
        if (window.visualViewport && window.visualViewport.width > 0) {
            return window.visualViewport.width;
        }

        return window.innerWidth || layoutWidth;
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

    function markReady() {
        syncViewportHeight();
        root.classList.remove('gg-desktop-boot');
        root.classList.add('gg-desktop-ready');
        root.classList.add('gg-layout-ready');
        root.dispatchEvent(new CustomEvent('gg-layout-ready'));
        root.dispatchEvent(new CustomEvent('gg-desktop-ready'));
    }

    function apply() {
        if (!meta.isConnected || !root.classList.contains('gg-public-root')) {
            return;
        }
        var scale = computeScale(readDeviceWidth());
        var next = viewportContent(scale);
        if (meta.content !== next) {
            meta.content = next;
        }
    }

    function reveal() {
        markReady();
    }

    if (document.readyState === 'loading') {
        track(document, 'DOMContentLoaded', function () {
            requestAnimationFrame(function () {
                requestAnimationFrame(reveal);
            });
        }, { once: true });
    } else {
        requestAnimationFrame(function () {
            requestAnimationFrame(reveal);
        });
    }

    var revealTimeout = window.setTimeout(reveal, 2500);

    track(window, 'orientationchange', function () {
        window.setTimeout(function () {
            apply();
            syncViewportHeight();
            reveal();
        }, 200);
    });
    track(window, 'resize', function () {
        apply();
        syncViewportHeight();
    });
    if (window.visualViewport) {
        track(window.visualViewport, 'resize', function () {
            apply();
            syncViewportHeight();
        });
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
