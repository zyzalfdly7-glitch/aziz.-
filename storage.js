(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Storage = {
        PREFIX: 'watan_',
        
        get: function(key) {
            try {
                const item = localStorage.getItem(this.PREFIX + key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage get error', e);
                return null;
            }
        },
        
        set: function(key, value) {
            try {
                localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
            } catch (e) {
                console.error('Storage set error', e);
            }
        },
        
        remove: function(key) {
            localStorage.removeItem(this.PREFIX + key);
        },
        
        clear: function() {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
        },
        
        has: function(key) {
            return localStorage.getItem(this.PREFIX + key) !== null;
        },
        
        keys: function() {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.PREFIX)) {
                    keys.push(key.substring(this.PREFIX.length));
                }
            }
            return keys;
        }
    };
})();
