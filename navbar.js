(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    
    App.Components.Navbar = {
        init: function(containerId, config) {
            this.container = document.getElementById(containerId);
            this.config = Object.assign({ brand: 'Brand', links: [] }, config);
            this.render();
        },
        render: function() {
            if (!this.container) return;
            
            const linksHtml = this.config.links.map(link => 
                `<a href="${link.url}" style="margin-left: 24px; color: #333; text-decoration: none; font-size: 14px; font-weight: 500;">${link.label}</a>`
            ).join('');
            
            this.container.innerHTML = `
                <nav class="navbar" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #ffffff; border-bottom: 1px solid #ebebeb; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div class="navbar-brand" style="font-size: 18px; font-weight: 700; color: #111;">
                        ${this.config.brand}
                    </div>
                    <div class="navbar-nav" style="display: flex; align-items: center;">
                        ${linksHtml}
                    </div>
                </nav>
            `;
        }
    };
})();
