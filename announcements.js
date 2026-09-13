(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'announcements';
    let currentContainerId = null;
    
    App.Modules.Announcements = {
        getAll: function() {
            if (App.DB && App.DB.getAll) return App.DB.getAll(collection);
            return JSON.parse(localStorage.getItem(collection) || '[]');
        },
        getById: function(id) {
            return this.getAll().find(item => item.id === id);
        },
        create: function(data) {
            data.id = data.id || Date.now().toString() + Math.random().toString(36).substr(2, 5);
            data.createdAt = new Date().toISOString();
            if (App.DB && App.DB.create) return App.DB.create(collection, data);
            const all = this.getAll();
            all.push(data);
            localStorage.setItem(collection, JSON.stringify(all));
            return data;
        },
        update: function(id, updates) {
            const all = this.getAll();
            const index = all.findIndex(item => item.id === id);
            if (index !== -1) {
                all[index] = Object.assign({}, all[index], updates, { updatedAt: new Date().toISOString() });
                if (App.DB && App.DB.update) return App.DB.update(collection, id, all[index]);
                localStorage.setItem(collection, JSON.stringify(all));
                return all[index];
            }
            return null;
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
                const all = this.getAll();
                const filtered = all.filter(item => item.id !== id);
                if (App.DB && App.DB.delete) {
                    App.DB.delete(collection, id);
                } else {
                    localStorage.setItem(collection, JSON.stringify(filtered));
                }
                
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم الحذف بنجاح', 'success');
                }
                
                if (currentContainerId) {
                    this.renderList(currentContainerId);
                }
                return true;
            }
            return false;
        },
        publish: function(id) {
            return this.update(id, { status: 'published', publishedAt: new Date().toISOString() });
        },
        
        renderList: function(containerId) {
            currentContainerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const data = this.getAll();
            
            let html = `
                <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: right;">
                    <thead>
                        <tr style="border-bottom: 2px solid #ddd;">
                            <th style="padding: 10px;">العنوان</th>
                            <th style="padding: 10px;">المحتوى</th>
                            <th style="padding: 10px;">الحالة</th>
                            <th style="padding: 10px;">التاريخ</th>
                            <th style="padding: 10px;">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            if (data.length === 0) {
                html += `<tr><td colspan="5" style="text-align: center; padding: 20px;">لا توجد إعلانات</td></tr>`;
            } else {
                data.forEach(item => {
                    const statusText = item.status === 'published' ? 'منشور' : 'مسودة';
                    const dateText = item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : '';
                    html += `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px;">${item.title || ''}</td>
                            <td style="padding: 10px;">${item.content || ''}</td>
                            <td style="padding: 10px;">${statusText}</td>
                            <td style="padding: 10px;">${dateText}</td>
                            <td style="padding: 10px;">
                                <button class="btn btn--sm btn--primary" onclick="App.Modules.Announcements.showFormModal('${item.id}')">تعديل</button>
                                <button class="btn btn--sm btn--danger" onclick="App.Modules.Announcements.delete('${item.id}')" style="background: #f44336; color: white;">حذف</button>
                            </td>
                        </tr>
                    `;
                });
            }
            
            html += `</tbody></table>`;
            container.innerHTML = html;
        },
        
        showFormModal: function(id = null) {
            let item = { title: '', content: '', status: 'draft' };
            if (id) {
                const existing = this.getById(id);
                if (existing) item = existing;
            }
            
            const formHtml = `
                <form id="announcement-form">
                    <input type="hidden" id="announcement-id" value="${id || ''}">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">العنوان</label>
                        <input type="text" id="announcement-title" value="${item.title}" style="width: 100%; padding: 8px; box-sizing: border-box;" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">المحتوى</label>
                        <textarea id="announcement-content" rows="4" style="width: 100%; padding: 8px; box-sizing: border-box;" required>${item.content}</textarea>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">الحالة</label>
                        <select id="announcement-status" style="width: 100%; padding: 8px; box-sizing: border-box;">
                            <option value="draft" ${item.status === 'draft' ? 'selected' : ''}>مسودة</option>
                            <option value="published" ${item.status === 'published' ? 'selected' : ''}>منشور</option>
                        </select>
                    </div>
                    <div style="text-align: left; margin-top: 20px;">
                        <button type="submit" class="btn btn--primary" style="padding: 10px 20px; background: #4caf50; color: white; border: none; cursor: pointer; border-radius: 4px;">حفظ</button>
                    </div>
                </form>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(id ? 'تعديل إعلان' : 'إضافة إعلان', formHtml);
                
                const form = document.getElementById('announcement-form');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const data = {
                            title: document.getElementById('announcement-title').value,
                            content: document.getElementById('announcement-content').value,
                            status: document.getElementById('announcement-status').value
                        };
                        const formId = document.getElementById('announcement-id').value;
                        if (formId) {
                            data.id = formId;
                        }
                        this.save(data);
                    });
                }
            } else {
                console.error('Modal component is missing');
            }
        },
        
        save: function(data) {
            if (data.id) {
                this.update(data.id, data);
            } else {
                this.create(data);
            }
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.hide();
            }
            
            if (App.Components && App.Components.Toast) {
                App.Components.Toast.show('تم الحفظ بنجاح', 'success');
            }
            
            if (currentContainerId) {
                this.renderList(currentContainerId);
            }
        }
    };
})();
