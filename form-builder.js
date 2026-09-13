(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    App.Components.FormBuilder = {
        build: function(containerId, schema) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            let formHtml = '<form class="dynamic-form">';
            
            schema.fields.forEach(field => {
                formHtml += '<div class="form-group">';
                if (field.label) {
                    formHtml += `<label for="${field.id}">${field.label}</label>`;
                }
                
                switch (field.type) {
                    case 'text':
                    case 'email':
                    case 'password':
                        formHtml += `<input type="${field.type}" id="${field.id}" name="${field.name}" class="form-control" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}">`;
                        break;
                    case 'textarea':
                        formHtml += `<textarea id="${field.id}" name="${field.name}" class="form-control" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}"></textarea>`;
                        break;
                    case 'select':
                        formHtml += `<select id="${field.id}" name="${field.name}" class="form-control" ${field.required ? 'required' : ''}>`;
                        if (field.options) {
                            field.options.forEach(opt => {
                                formHtml += `<option value="${opt.value}">${opt.label}</option>`;
                            });
                        }
                        formHtml += `</select>`;
                        break;
                    // Add more types as needed
                }
                formHtml += '</div>';
            });
            
            formHtml += `<button type="submit" class="btn btn-primary">${schema.submitLabel || 'Submit'}</button>`;
            formHtml += '</form>';
            
            container.innerHTML = formHtml;
            
            const form = container.querySelector('form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                if (schema.onSubmit) {
                    schema.onSubmit(data);
                }
            });
        }
    };
})();
