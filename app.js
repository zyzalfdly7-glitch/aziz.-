(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.init = function() {
        if (App.DB && App.DB.init) {
            App.DB.init();
        }
        
        if (App.I18n && App.I18n.init) {
            App.I18n.init();
        }
        
        if (App.Theme && App.Theme.init) {
            App.Theme.init();
        }
        
        if (App.Auth && window.location.pathname.includes('/dashboards/')) {
            const path = window.location.pathname;
            let role = '';
            if (path.includes('/admin/')) role = 'admin';
            else if (path.includes('/teacher/')) role = 'teacher';
            else if (path.includes('/student/')) role = 'student';
            else if (path.includes('/parent/')) role = 'parent';
            else if (path.includes('/accountant/')) role = 'accountant';
            else if (path.includes('/registrar/')) role = 'registrar';
            
            if (role) {
                App.Auth.requireAuth([role]);
            } else {
                App.Auth.requireAuth();
            }
        }
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle && App.Theme) {
            themeToggle.addEventListener('click', () => App.Theme.toggle());
        }
        
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle && App.I18n) {
            langToggle.addEventListener('click', () => {
                const newLang = App.I18n.currentLang === 'ar' ? 'en' : 'ar';
                App.I18n.setLanguage(newLang);
                langToggle.textContent = newLang === 'ar' ? 'EN' : 'عربي';
            });
            if (App.I18n.currentLang) {
                 langToggle.textContent = App.I18n.currentLang === 'ar' ? 'EN' : 'عربي';
            }
        }
        
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('is-collapsed');
                sidebar.classList.toggle('is-open');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('is-active');
                }
            });
        }
        if (sidebarOverlay && sidebar) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('is-open');
                sidebarOverlay.classList.remove('is-active');
            });
        }
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn && App.Auth) {
            logoutBtn.addEventListener('click', () => App.Auth.logout());
        }
        
        const user = App.Auth ? App.Auth.getCurrentUser() : null;
        if (user) {
            const userNameEl = document.getElementById('user-name');
            if (userNameEl) {
                userNameEl.textContent = App.I18n.currentLang === 'en' && user.nameEn ? user.nameEn : user.name;
            }
        }
        
        if (App.Notifications) {
            App.Notifications.updateBadge();
        }
        
        if (App.Router) {
            App.Router.setActiveNavLink();
        }
        
        document.dispatchEvent(new CustomEvent('appReady'));
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
})();
