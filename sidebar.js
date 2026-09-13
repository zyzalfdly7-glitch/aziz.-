(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Components = App.Components || {};
    
    App.Components.Sidebar = {
        init: function() {
            const menuContainer = document.getElementById('sidebar-menu');
            if (!menuContainer) return;
            
            if (App.Auth) {
                const user = App.Auth.getCurrentUser();
                if (user) {
                    menuContainer.innerHTML = this.getMenuHtml(user.role);
                    
                    // Mark active link
                    const path = window.location.pathname;
                    const links = menuContainer.querySelectorAll('.sidebar__link');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && path.endsWith(href)) {
                            link.classList.add('is-active');
                        } else if (href === 'index.html' && path.endsWith('/')) {
                            link.classList.add('is-active');
                        }
                    });
                }
            }
        },
        getMenuHtml: function(role) {
            let items = [];
            if (role === 'admin') {
                items = [
                    { icon: 'home', text: 'لوحة القيادة', href: 'index.html' },
                    { icon: 'group', text: 'الطلاب', href: 'students.html' },
                    { icon: 'school', text: 'المعلمين', href: 'teachers.html' },
                    { icon: 'domain', text: 'الصفوف', href: 'classes.html' },
                    { icon: 'menu_book', text: 'المواد', href: 'subjects.html' },
                    { icon: 'analytics', text: 'الدرجات', href: 'grades.html' },
                    { icon: 'fact_check', text: 'الحضور', href: 'attendance.html' },
                    { icon: 'payments', text: 'المدفوعات', href: 'payments.html' },
                    { icon: 'library_books', text: 'الدروس', href: 'lessons.html' },
                    { icon: 'assignment', text: 'الواجبات', href: 'assignments.html' },
                    { icon: 'science', text: 'الاختبارات', href: 'exams.html' },
                    { icon: 'campaign', text: 'الإعلانات', href: 'announcements.html' },
                    { icon: 'description', text: 'التسجيل', href: 'registrations.html' },
                    { icon: 'trending_up', text: 'التقارير', href: 'reports.html' },
                    { icon: 'calendar_month', text: 'الجدول', href: 'schedule.html' },
                    { icon: 'notifications', text: 'الإشعارات', href: '../shared/notifications.html' },
                    { icon: 'settings', text: 'الإعدادات', href: 'settings.html' }
                ];
            } else if (role === 'teacher') {
                items = [
                    { icon: 'home', text: 'لوحة القيادة', href: 'index.html' },
                    { icon: 'domain', text: 'الصفوف', href: 'classes.html' },
                    { icon: 'group', text: 'الطلاب', href: 'students.html' },
                    { icon: 'menu_book', text: 'المواد', href: 'subjects.html' },
                    { icon: 'analytics', text: 'الدرجات', href: 'grades.html' },
                    { icon: 'fact_check', text: 'الحضور', href: 'attendance.html' },
                    { icon: 'library_books', text: 'الدروس', href: 'lessons.html' },
                    { icon: 'assignment', text: 'الواجبات', href: 'assignments.html' },
                    { icon: 'science', text: 'الاختبارات', href: 'exams.html' },
                    { icon: 'calendar_month', text: 'الجدول', href: 'schedule.html' },
                    { icon: 'person', text: 'الملف الشخصي', href: 'profile.html' },
                    { icon: 'settings', text: 'الإعدادات', href: '../shared/settings.html' }
                ];
            } else if (role === 'parent') {
                items = [
                    { icon: 'home', text: 'لوحة القيادة', href: 'index.html' },
                    { icon: 'group', text: 'الأبناء', href: 'children.html' },
                    { icon: 'analytics', text: 'الدرجات', href: 'grades.html' },
                    { icon: 'fact_check', text: 'الحضور', href: 'attendance.html' },
                    { icon: 'payments', text: 'المدفوعات', href: 'payments.html' },
                    { icon: 'calendar_month', text: 'الجدول', href: 'schedule.html' },
                    { icon: 'person', text: 'الملف الشخصي', href: 'profile.html' },
                    { icon: 'settings', text: 'الإعدادات', href: '../shared/settings.html' }
                ];
            } else if (role === 'student') {
                items = [
                    { icon: 'home', text: 'لوحة القيادة', href: 'index.html' },
                    { icon: 'analytics', text: 'درجاتي', href: 'grades.html' },
                    { icon: 'fact_check', text: 'الحضور', href: 'attendance.html' },
                    { icon: 'calendar_month', text: 'الجدول الدراسي', href: 'schedule.html' },
                    { icon: 'library_books', text: 'الدروس', href: 'lessons.html' },
                    { icon: 'assignment', text: 'الواجبات', href: 'assignments.html' },
                    { icon: 'science', text: 'الاختبارات', href: 'exams.html' },
                    { icon: 'payments', text: 'المدفوعات', href: 'payments.html' },
                    { icon: 'notifications', text: 'الإشعارات', href: '../shared/notifications.html' },
                    { icon: 'person', text: 'الملف الشخصي', href: 'profile.html' },
                    { icon: 'settings', text: 'الإعدادات', href: '../shared/settings.html' }
                ];
            }
            
            return items.map(item => `
                <a href="${item.href}" class="sidebar__link">
                    <span class="sidebar__icon material-symbols-outlined" style="margin-left: 10px;">${item.icon}</span>
                    <span class="sidebar__text">${item.text}</span>
                </a>
            `).join('');
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        if (App.Components && App.Components.Sidebar) {
            App.Components.Sidebar.init();
        }
    });
})();
