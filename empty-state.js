(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    
    App.Components.EmptyState = {
        init: function(containerId, config) {
            this.container = document.getElementById(containerId);
            this.config = config || {};
            this.render();
        },
        render: function() {
            if (!this.container) return;
            const { title = 'No items found', description = 'Try adjusting your filters or search terms.', icon = '📭' } = this.config;
            
            this.container.innerHTML = `
                <div class="empty-state-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; font-family: sans-serif; background: #fff; border-radius: 8px; border: 1px dashed #d9d9d9;">
                    <div class="empty-state-icon" style="font-size: 48px; margin-bottom: 16px;">${icon}</div>
                    <h3 class="empty-state-title" style="margin: 0 0 8px; font-size: 18px; color: #262626; font-weight: 600;">${title}</h3>
                    <p class="empty-state-desc" style="margin: 0; font-size: 14px; color: #8c8c8c; max-width: 300px;">${description}</p>
                </div>
            `;
        }
    };
})();
