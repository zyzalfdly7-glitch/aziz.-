(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Export = {
        toCSV: function(data, headers, filename) {
            if (!data || !data.length) return;
            
            const BOM = '\uFEFF'; 
            let csvContent = BOM;
            
            if (headers && headers.length) {
                csvContent += headers.map(h => `"${(h.label || h.key || h).toString().replace(/"/g, '""')}"`).join(',') + '\n';
            }
            
            const keys = headers ? headers.map(h => h.key || h) : Object.keys(data[0]);
            
            data.forEach(row => {
                const rowStr = keys.map(key => {
                    let val = row[key];
                    if (val === null || val === undefined) val = '';
                    return `"${val.toString().replace(/"/g, '""')}"`;
                }).join(',');
                csvContent += rowStr + '\n';
            });
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', (filename || 'export') + '.csv');
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
        },
        
        print: function(elementId) {
            if (elementId) {
                const element = document.getElementById(elementId);
                if (element) {
                    const originalClasses = element.className;
                    element.classList.add('print-only');
                    
                    document.body.classList.add('printing-specific-element');
                    
                    window.print();
                    
                    document.body.classList.remove('printing-specific-element');
                    element.className = originalClasses;
                    return;
                }
            }
            
            window.print();
        },
        
        copyToClipboard: function(text) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(text);
            } else {
                return new Promise((resolve, reject) => {
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        resolve();
                    } catch (err) {
                        reject(err);
                    } finally {
                        textArea.remove();
                    }
                });
            }
        }
    };
})();
