(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Router = {
        getBasePath: function() {
            const path = window.location.pathname;
            if (path.includes('/dashboards/')) {
                return '../../';
            } else if (path.includes('/pages/')) {
                return '../';
            }
            return '';
        },
        
        navigate: function(path) {
            window.location.href = this.getBasePath() + path;
        },
        
        getCurrentPage: function() {
            const path = window.location.pathname;
            const segments = path.split('/');
            let page = segments.pop() || 'index.html';
            return page;
        },
        
        setActiveNavLink: function() {
            const path = window.location.pathname;
            const links = document.querySelectorAll('.navbar__link, .sidebar__link');
            
            links.forEach(link => {
                link.classList.remove('is-active');
                const href = link.getAttribute('href');
                if (href && href !== '#' && path.includes(href.replace('../', '').replace('../../', ''))) {
                    link.classList.add('is-active');
                }
            });
            
            // Special case for dashboard home
            if (path.endsWith('/dashboards/admin/') || path.endsWith('/dashboards/admin/index.html')) {
                const homeLink = document.querySelector('.sidebar__link[href*="index.html"]');
                if (homeLink) homeLink.classList.add('is-active');
            }
        },
        
        getQueryParam: function(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        },
        
        setQueryParam: function(name, value) {
            const urlParams = new URLSearchParams(window.location.search);
            if (value) {
                urlParams.set(name, value);
            } else {
                urlParams.delete(name);
            }
            const newUrl = window.location.pathname + '?' + urlParams.toString() + window.location.hash;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    };
})();
