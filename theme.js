(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Theme = {
        current: 'light',
        
        init: function() {
            let storedTheme = App.Storage.get('theme');
            const user = App.Auth && App.Auth.getCurrentUser();
            
            if (user && user.theme) {
                storedTheme = user.theme;
            } else if (!storedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                storedTheme = 'dark';
            }
            
            this.set(storedTheme || 'light');
            this.updateToggleButton();
        },
        
        toggle: function() {
            const newTheme = this.current === 'light' ? 'dark' : 'light';
            this.set(newTheme);
            this.updateToggleButton();
        },
        
        set: function(theme) {
            if (theme !== 'light' && theme !== 'dark') return;
            
            this.current = theme;
            document.documentElement.setAttribute('data-theme', theme);
            App.Storage.set('theme', theme);
            
            const user = App.Auth && App.Auth.getCurrentUser();
            if (user && App.DB) {
                App.DB.update('users', user.id, { theme: theme });
                App.Auth.updateSession({ theme: theme });
            }
        },
        
        updateToggleButton: function() {
            const btn = document.getElementById('theme-toggle');
            if (btn) {
                btn.textContent = this.current === 'light' ? '🌙' : '☀️';
            }
        }
    };
})();
