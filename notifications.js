(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Notifications = {
        getAll: function(userId) {
            if (!userId) {
                const user = App.Auth.getCurrentUser();
                if (!user) return [];
                userId = user.id;
            }
            return App.DB.query('notifications', n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        },
        
        getUnread: function(userId) {
            if (!userId) {
                const user = App.Auth.getCurrentUser();
                if (!user) return [];
                userId = user.id;
            }
            return App.DB.query('notifications', n => n.userId === userId && !n.read).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        },
        
        markAsRead: function(id) {
            return App.DB.update('notifications', id, { read: true });
        },
        
        markAllAsRead: function(userId) {
            if (!userId) {
                const user = App.Auth.getCurrentUser();
                if (!user) return;
                userId = user.id;
            }
            const unread = this.getUnread(userId);
            unread.forEach(n => this.markAsRead(n.id));
        },
        
        create: function(notification) {
            return App.DB.create('notifications', {
                ...notification,
                read: false,
                createdAt: new Date().toISOString()
            });
        },
        
        getCount: function(userId) {
            return this.getUnread(userId).length;
        },
        
        updateBadge: function() {
            const badge = document.getElementById('notification-badge');
            if (!badge) return;
            
            const count = this.getCount();
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        },
        
        renderList: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const notifications = this.getAll();
            if (notifications.length === 0) {
                container.innerHTML = `<div class="empty-state">
                    <span class="empty-state__icon">🔕</span>
                    <p class="empty-state__text">${App.I18n.t('notifications.empty') || 'No notifications'}</p>
                </div>`;
                return;
            }
            
            // Simple render, would ideally use templates
            const listHtml = notifications.map(n => `
                <div class="notification-item ${!n.read ? 'is-unread' : ''}" data-id="${n.id}">
                    <div class="notification-item__icon notification-item__icon--${n.type}">
                        ${this._getIconForType(n.type)}
                    </div>
                    <div class="notification-item__content">
                        <h4 class="notification-item__title">${n.title}</h4>
                        <p class="notification-item__message">${n.message}</p>
                        <span class="notification-item__time">${App.Utils.formatDate(n.createdAt)}</span>
                    </div>
                </div>
            `).join('');
            
            container.innerHTML = `<div class="notification-list">${listHtml}</div>`;
        },
        
        _getIconForType: function(type) {
            switch(type) {
                case 'success': return '✅';
                case 'warning': return '⚠️';
                case 'grade': return '📊';
                case 'attendance': return '📋';
                case 'payment': return '💳';
                default: return 'ℹ️';
            }
        }
    };
})();
