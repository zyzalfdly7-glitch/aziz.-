(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    
    App.Components.Table = {
        render: function(containerId, columns, data) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            columns.forEach(col => {
                const th = document.createElement('th');
                th.innerText = col.label;
                th.style.borderBottom = '2px solid #ddd';
                th.style.padding = '10px';
                th.style.textAlign = 'left';
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            const tbody = document.createElement('tbody');
            data.forEach(row => {
                const tr = document.createElement('tr');
                columns.forEach(col => {
                    const td = document.createElement('td');
                    td.innerText = row[col.key] || '';
                    td.style.borderBottom = '1px solid #eee';
                    td.style.padding = '10px';
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            
            container.appendChild(table);
        }
    };
})();
