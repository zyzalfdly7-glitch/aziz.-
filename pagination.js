(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    App.Components.Pagination = {
        create: function(containerId, options) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const totalPages = options.totalPages || 1;
            const currentPage = options.currentPage || 1;
            const onPageChange = options.onPageChange || function(page) { console.log('Page:', page); };
            
            let html = '<ul class="pagination">';
            
            // Prev
            html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                     </li>`;
                     
            for (let i = 1; i <= totalPages; i++) {
                html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                         </li>`;
            }
            
            // Next
            html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                     </li>`;
                     
            html += '</ul>';
            container.innerHTML = html;
            
            container.querySelectorAll('.page-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = parseInt(this.getAttribute('data-page'));
                    if (page >= 1 && page <= totalPages && page !== currentPage) {
                        onPageChange(page);
                    }
                });
            });
        }
    };
})();
