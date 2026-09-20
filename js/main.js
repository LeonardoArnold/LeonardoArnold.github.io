(function () {
    'use strict';

    var prefersReduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll-reveal for elements marked with [data-reveal].
    // Skipped entirely when the visitor prefers reduced motion or the
    // browser lacks IntersectionObserver — content stays fully visible.
    if (!prefersReduced && 'IntersectionObserver' in window) {
        document.documentElement.classList.add('has-reveal');

        var revealEls = document.querySelectorAll('[data-reveal]');
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });

        revealEls.forEach(function (el) { revealObserver.observe(el); });

        // Safety net: if anything is ever missed by the observer (edge
        // cases in some browsers, very fast scrolling, etc.) make sure it
        // still becomes visible instead of staying hidden forever.
        window.setTimeout(function () {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        }, 4000);
    }

    // Highlight the sidebar nav link for the section in view.
    var navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    var sections = document.querySelectorAll('.section-anchor[id]');

    if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
        var linkById = {};
        navLinks.forEach(function (link) {
            linkById[link.getAttribute('href').slice(1)] = link;
        });

        var setActive = function (id) {
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            });
            var active = linkById[id];
            if (active) {
                active.classList.add('active');
                active.setAttribute('aria-current', 'true');
            }
        };

        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(function (section) { navObserver.observe(section); });
    }
})();
