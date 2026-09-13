(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    let studentIdCounter = 1;
    let seatNumberCounter = 10001;
    let regNumberCounter = 1;
    let receiptNumberCounter = 1;

    App.Utils = {
        generateId: function() {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function(c) {
                const r = Math.random() * 16 | 0;
                return r.toString(16);
            });
        },
        
        generateStudentId: function() {
            const year = '2026';
            const paddedCounter = String(studentIdCounter++).padStart(5, '0');
            return `STU-${year}-${paddedCounter}`;
        },
        
        generateSeatNumber: function() {
            return String(seatNumberCounter++);
        },
        
        generateRegNumber: function() {
            const year = '2026';
            const paddedCounter = String(regNumberCounter++).padStart(5, '0');
            return `REG-${year}-${paddedCounter}`;
        },
        
        generateReceiptNumber: function() {
            const year = '2026';
            const paddedCounter = String(receiptNumberCounter++).padStart(5, '0');
            return `REC-${year}-${paddedCounter}`;
        },
        
        formatDate: function(dateStr, lang = 'ar') {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            }).format(date);
        },
        
        formatCurrency: function(amount) {
            return Number(amount).toLocaleString('ar-SA') + ' ر.س';
        },
        
        sanitize: function(str) {
            if (typeof str !== 'string') return str;
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;'
            };
            return str.replace(/[&<>"']/ig, (match) => map[match]);
        },
        
        $: function(selector, parent = document) {
            return parent.querySelector(selector);
        },
        
        $$: function(selector, parent = document) {
            return parent.querySelectorAll(selector);
        },
        
        createElement: function(tag, attrs = {}, children = []) {
            const el = document.createElement(tag);
            for (const [key, value] of Object.entries(attrs)) {
                if (key === 'className') {
                    el.className = value;
                } else if (key.startsWith('on') && typeof value === 'function') {
                    el.addEventListener(key.substring(2).toLowerCase(), value);
                } else if (key === 'dataset') {
                    for (const [dataKey, dataValue] of Object.entries(value)) {
                        el.dataset[dataKey] = dataValue;
                    }
                } else {
                    el.setAttribute(key, value);
                }
            }
            children.forEach(child => {
                if (typeof child === 'string' || typeof child === 'number') {
                    el.appendChild(document.createTextNode(child));
                } else if (child instanceof Element) {
                    el.appendChild(child);
                }
            });
            return el;
        },
        
        debounce: function(fn, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    fn.apply(this, args);
                }, delay);
            };
        },
        
        calculatePercentage: function(score, total) {
            if (!total) return 0;
            return Math.round((score / total) * 100);
        },
        
        getLetterGrade: function(percentage) {
            const grades = App.Config.GRADE_LETTERS;
            if (percentage >= grades['A+'].min) return { letter: 'A+', label: 'Excellent', labelAr: 'ممتاز مرتفع' };
            if (percentage >= grades['A'].min) return { letter: 'A', label: 'Excellent', labelAr: 'ممتاز' };
            if (percentage >= grades['B+'].min) return { letter: 'B+', label: 'Very Good', labelAr: 'جيد جداً مرتفع' };
            if (percentage >= grades['B'].min) return { letter: 'B', label: 'Very Good', labelAr: 'جيد جداً' };
            if (percentage >= grades['C+'].min) return { letter: 'C+', label: 'Good', labelAr: 'جيد مرتفع' };
            if (percentage >= grades['C'].min) return { letter: 'C', label: 'Good', labelAr: 'جيد' };
            if (percentage >= grades['D+'].min) return { letter: 'D+', label: 'Acceptable', labelAr: 'مقبول مرتفع' };
            if (percentage >= grades['D'].min) return { letter: 'D', label: 'Acceptable', labelAr: 'مقبول' };
            return { letter: 'F', label: 'Fail', labelAr: 'راسب' };
        },
        
        getGradeColor: function(percentage) {
            if (percentage >= 90) return 'text-success';
            if (percentage >= 75) return 'text-primary';
            if (percentage >= 60) return 'text-warning';
            return 'text-danger';
        },
        
        groupBy: function(arr, key) {
            return arr.reduce((acc, item) => {
                const group = item[key];
                acc[group] = acc[group] || [];
                acc[group].push(item);
                return acc;
            }, {});
        },
        
        sortBy: function(arr, key, ascending = true) {
            return [...arr].sort((a, b) => {
                if (a[key] < b[key]) return ascending ? -1 : 1;
                if (a[key] > b[key]) return ascending ? 1 : -1;
                return 0;
            });
        },
        
        paginate: function(arr, page, perPage) {
            const total = arr.length;
            const totalPages = Math.ceil(total / perPage);
            const currentPage = Math.max(1, Math.min(page, totalPages));
            const start = (currentPage - 1) * perPage;
            const data = arr.slice(start, start + perPage);
            return { data, total, totalPages, currentPage };
        },
        
        truncate: function(str, length) {
            if (!str) return '';
            if (str.length <= length) return str;
            return str.substring(0, length) + '...';
        },
        
        calculateAge: function(dob) {
            if (!dob) return 0;
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },
        
        generateColor: function(index) {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
            return colors[index % colors.length];
        }
    };
})();
