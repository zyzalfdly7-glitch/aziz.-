(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    App.Components.Tabs = {
        init: function(selector) {
            const tabContainers = document.querySelectorAll(selector || '.tabs-container');
            tabContainers.forEach(container => {
                const tabs = container.querySelectorAll('.tab-link');
                const panes = container.querySelectorAll('.tab-pane');
                
                tabs.forEach(tab => {
                    tab.addEventListener('click', function(e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('data-target');
                        
                        tabs.forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                        
                        panes.forEach(p => p.classList.remove('active'));
                        const targetPane = container.querySelector(targetId);
                        if (targetPane) {
                            targetPane.classList.add('active');
                        }
                    });
                });
            });
        }
    };
})();
