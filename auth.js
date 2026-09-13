(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Auth = {
        SESSION_KEY: 'session',
        
        login: function(email, password) {
            const user = App.DB.getUserByEmail(email);
            if (!user) {
                return { success: false, error: 'invalidCredentials' };
            }
            if (user.password !== password) {
                return { success: false, error: 'invalidCredentials' };
            }
            if (user.status !== 'active') {
                return { success: false, error: 'accountInactive' };
            }
            
            const sessionData = {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                nameEn: user.nameEn,
                avatar: user.avatar,
                lang: user.lang,
                theme: user.theme
            };
            
            App.Storage.set(this.SESSION_KEY, sessionData);
            return { success: true, user: sessionData };
        },
        
        logout: function() {
            App.Storage.remove(this.SESSION_KEY);
            window.location.href = this.getLoginPageUrl();
        },
        
        getCurrentUser: function() {
            return App.Storage.get(this.SESSION_KEY) || null;
        },
        
        isAuthenticated: function() {
            return this.getCurrentUser() !== null;
        },
        
        hasRole: function(role) {
            const user = this.getCurrentUser();
            return user !== null && user.role === role;
        },
        
        requireAuth: function(allowedRoles) {
            const user = this.getCurrentUser();
            if (!user) {
                window.location.href = this.getLoginPageUrl();
                return;
            }
            
            if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
                window.location.href = this.getDashboardUrl(user.role);
            }
        },
        
        getLoginPageUrl: function() {
            const path = window.location.pathname;
            if (path.includes('/dashboards/')) {
                return '../../pages/login.html';
            } else if (path.includes('/pages/')) {
                return 'login.html';
            }
            return 'pages/login.html';
        },
        
        getDashboardUrl: function(role) {
            const path = window.location.pathname;
            let base = '';
            if (path.includes('/dashboards/')) {
                base = '../../';
            } else if (path.includes('/pages/')) {
                base = '../';
            } else if (!path.endsWith('/') && !path.endsWith('.html')) {
                base = ''; 
            }
            
            const dashboardMap = {
                'admin': 'dashboards/admin/index.html',
                'teacher': 'dashboards/teacher/index.html',
                'student': 'dashboards/student/index.html',
                'parent': 'dashboards/parent/index.html',
                'accountant': 'dashboards/accountant/index.html',
                'registrar': 'dashboards/registrar/index.html'
            };
            
            return base + (dashboardMap[role] || dashboardMap['student']);
        },
        
        updateSession: function(userData) {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                const updated = { ...currentUser, ...userData };
                App.Storage.set(this.SESSION_KEY, updated);
            }
        }
    };
})();
