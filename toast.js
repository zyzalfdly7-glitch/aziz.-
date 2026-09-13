(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    
    let toastContainer = null;

    App.Components.Toast = {
        init: function() {
            toastContainer = document.getElementById('toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'toast-container';
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
            }
        },
        show: function(message, type = 'info', duration = 4000) {
            this.init();
            
            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;
            
            let icon = 'ℹ️';
            let title = 'معلومة';
            if (type === 'success') { icon = '✅'; title = 'نجاح'; }
            if (type === 'error') { icon = '❌'; title = 'خطأ'; }
            if (type === 'warning') { icon = '⚠️'; title = 'تنبيه'; }
            
            toast.innerHTML = `
                <div class="toast__icon">${icon}</div>
                <div class="toast__content">
                    <div class="toast__title">${title}</div>
                    <div class="toast__message">${message}</div>
                </div>
                <button class="toast__close" onclick="this.parentElement.style.animation='slideOutToast 0.4s forwards'; setTimeout(() => this.parentElement.remove(), 400)">&times;</button>
            `;
            
            toastContainer.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'slideOutToast 0.4s forwards';
                    setTimeout(() => {
                        if (toast.parentNode) toast.parentNode.removeChild(toast);
                    }, 400);
                }
            }, duration);
        },
        success: function(message) { this.show(message, 'success'); },
        error: function(message) { this.show(message, 'error'); },
        warning: function(message) { this.show(message, 'warning'); },
        info: function(message) { this.show(message, 'info'); }
    };
})();
