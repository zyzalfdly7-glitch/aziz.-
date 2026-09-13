(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Validation = {
        validate: function(form, rules) {
            this.clearErrors(form);
            let isValid = true;
            const errors = [];
            
            for (const [fieldName, fieldRules] of Object.entries(rules)) {
                const inputEl = form.elements[fieldName];
                if (!inputEl) continue;
                
                const value = inputEl.value.trim();
                
                for (const rule of fieldRules) {
                    let hasError = false;
                    let message = '';
                    
                    switch (rule.type) {
                        case 'required':
                            if (!value) {
                                hasError = true;
                                message = App.I18n.t('messages.required') || 'This field is required';
                            }
                            break;
                        case 'email':
                            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                                hasError = true;
                                message = App.I18n.t('messages.invalidEmail') || 'Invalid email format';
                            }
                            break;
                        case 'phone':
                            if (value && !/^\+?\d{9,15}$/.test(value)) {
                                hasError = true;
                                message = App.I18n.t('messages.invalidPhone') || 'Invalid phone format';
                            }
                            break;
                        case 'minLength':
                            if (value && value.length < rule.value) {
                                hasError = true;
                                message = (App.I18n.t('messages.minLength') || 'Minimum length is {{val}}').replace('{{val}}', rule.value);
                            }
                            break;
                        case 'maxLength':
                            if (value && value.length > rule.value) {
                                hasError = true;
                                message = (App.I18n.t('messages.maxLength') || 'Maximum length is {{val}}').replace('{{val}}', rule.value);
                            }
                            break;
                        case 'min':
                            if (value && Number(value) < rule.value) {
                                hasError = true;
                                message = (App.I18n.t('messages.min') || 'Minimum value is {{val}}').replace('{{val}}', rule.value);
                            }
                            break;
                        case 'max':
                            if (value && Number(value) > rule.value) {
                                hasError = true;
                                message = (App.I18n.t('messages.max') || 'Maximum value is {{val}}').replace('{{val}}', rule.value);
                            }
                            break;
                        case 'match':
                            const matchEl = form.elements[rule.value];
                            if (value && matchEl && value !== matchEl.value) {
                                hasError = true;
                                message = App.I18n.t('messages.match') || 'Fields do not match';
                            }
                            break;
                        case 'pattern':
                            if (value && !rule.value.test(value)) {
                                hasError = true;
                                message = rule.message || 'Invalid format';
                            }
                            break;
                    }
                    
                    if (hasError) {
                        isValid = false;
                        errors.push({ field: fieldName, message });
                        this.showError(inputEl, message);
                        break; 
                    }
                }
            }
            
            return { valid: isValid, errors };
        },
        
        showError: function(inputEl, message) {
            inputEl.classList.add('form-control--error');
            let errorEl = inputEl.nextElementSibling;
            
            if (errorEl && errorEl.classList.contains('form-error')) {
                errorEl.textContent = message;
            } else {
                errorEl = document.createElement('div');
                errorEl.className = 'form-error';
                errorEl.textContent = message;
                inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
            }
        },
        
        clearErrors: function(form) {
            const inputs = form.querySelectorAll('.form-control--error');
            inputs.forEach(input => input.classList.remove('form-control--error'));
            
            const errors = form.querySelectorAll('.form-error');
            errors.forEach(error => error.remove());
        },
        
        clearError: function(inputEl) {
            if (!inputEl) return;
            inputEl.classList.remove('form-control--error');
            const errorEl = inputEl.nextElementSibling;
            if (errorEl && errorEl.classList.contains('form-error')) {
                errorEl.remove();
            }
        },
        
        attachLiveValidation: function(form, rules) {
            for (const fieldName of Object.keys(rules)) {
                const inputEl = form.elements[fieldName];
                if (inputEl) {
                    inputEl.addEventListener('blur', () => {
                        this.clearError(inputEl);
                        const singleRule = { [fieldName]: rules[fieldName] };
                        this.validate(form, singleRule);
                    });
                    inputEl.addEventListener('input', () => {
                        if (inputEl.classList.contains('form-control--error')) {
                            this.clearError(inputEl);
                        }
                    });
                }
            }
        }
    };
})();
