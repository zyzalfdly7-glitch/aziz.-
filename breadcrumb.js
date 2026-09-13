(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    
    App.Components.Breadcrumb = {
        init: function(containerId, items) {
            this.container = document.getElementById(containerId);
            this.items = items || [];
            this.render();
        },
        render: function() {
            if (!this.container) return;
            const html = this.items.map((item, index) => {
                const isLast = index === this.items.length - 1;
                return isLast 
                    ? `<span class="breadcrumb-item active" style="color: #666;" aria-current="page">${item.label}</span>` 
                    : `<a href="${item.url}" class="breadcrumb-item" style="color: #007bff; text-decoration: none;">${item.label}</a>`;
            }).join(' <span class="separator" style="margin: 0 8px; color: #ccc;">/</span> ');
            
            this.container.innerHTML = `<nav aria-label="breadcrumb" style="font-family: sans-serif; font-size: 14px; padding: 10px 0;">${html}</nav>`;
        }
    };
})();
