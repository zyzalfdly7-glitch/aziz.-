(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.I18n = {
        currentLang: 'ar',
        translations: {},
        
        init: function() {
            const user = App.Auth && App.Auth.getCurrentUser();
            let storedLang = App.Storage.get('lang');
            
            if (user && user.lang) {
                storedLang = user.lang;
            }
            
            this.setLanguage(storedLang || 'ar', false);
        },
        
        addTranslations: function(lang, translations) {
            if (!this.translations[lang]) {
                this.translations[lang] = {};
            }
            this.translations[lang] = { ...this.translations[lang], ...translations };
        },
        
        setLanguage: function(lang, triggerEvent = true) {
            if (lang !== 'ar' && lang !== 'en') return;
            
            this.currentLang = lang;
            App.Storage.set('lang', lang);
            
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            
            this.translatePage();
            
            if (triggerEvent) {
                document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
            }
        },
        
        t: function(key, params = {}) {
            if (!key) return '';
            
            const keys = key.split('.');
            let value = this.translations[this.currentLang];
            
            for (const k of keys) {
                if (value && value[k] !== undefined) {
                    value = value[k];
                } else {
                    value = key;
                    break;
                }
            }
            
            if (typeof value === 'string') {
                return value.replace(/{{(.*?)}}/g, (match, param) => {
                    return params[param.trim()] !== undefined ? params[param.trim()] : match;
                });
            }
            
            return value;
        },
        
        translatePage: function() {
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key) {
                    el.textContent = this.t(key);
                }
            });
            
            const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
            placeholders.forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (key) {
                    el.setAttribute('placeholder', this.t(key));
                }
            });
            
            const titles = document.querySelectorAll('[data-i18n-title]');
            titles.forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                if (key) {
                    el.setAttribute('title', this.t(key));
                }
            });
            
            const arias = document.querySelectorAll('[data-i18n-aria]');
            arias.forEach(el => {
                const key = el.getAttribute('data-i18n-aria');
                if (key) {
                    el.setAttribute('aria-label', this.t(key));
                }
            });
        }
    };
})();
