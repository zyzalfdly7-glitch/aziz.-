(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    
    let modalOverlay = null;

    App.Components.Modal = {
        init: function() {
            // Check if there's an existing overlay in the DOM (from HTML template)
            modalOverlay = document.getElementById('modal-overlay');
            
            if (!modalOverlay) {
                modalOverlay = document.createElement('div');
                modalOverlay.id = 'modal-overlay';
                modalOverlay.className = 'modal-overlay';
                
                const modal = document.createElement('div');
                modal.id = 'modal';
                modal.className = 'modal';
                
                modalOverlay.appendChild(modal);
                document.body.appendChild(modalOverlay);
            }
            
            // Close when clicking outside
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) this.hide();
            });
        },
        show: function(title, contentHTML) {
            this.init();
            
            const modal = modalOverlay.querySelector('.modal');
            if (!modal) return;
            
            modal.innerHTML = `
                <div class="modal__header">
                    <h2 class="modal__title">${title}</h2>
                    <button class="modal__close" onclick="App.Components.Modal.hide()">&times;</button>
                </div>
                <div class="modal__body">
                    ${contentHTML}
                </div>
            `;
            
            // Show modal with animation
            modalOverlay.classList.add('is-active');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },
        hide: function() {
            if (modalOverlay) {
                modalOverlay.classList.remove('is-active');
                // Restore body scroll after animation completes
                setTimeout(() => {
                    document.body.style.overflow = '';
                }, 300);
            }
        }
    };
})();
