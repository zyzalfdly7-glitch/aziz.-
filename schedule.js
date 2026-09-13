(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'schedule';
    
    App.Modules.Schedule = {
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
            const all = this.getAll();
            const filtered = all.filter(item => item.id !== id);
            if (App.DB && App.DB.delete) return App.DB.delete(collection, id);
            localStorage.setItem(collection, JSON.stringify(filtered));
            return true;
        },
        checkConflicts: function(newScheduleItem) {
            const all = this.getAll();
            return all.filter(item => {
                return item.date === newScheduleItem.date && 
                       ((newScheduleItem.startTime >= item.startTime && newScheduleItem.startTime < item.endTime) ||
                        (newScheduleItem.endTime > item.startTime && newScheduleItem.endTime <= item.endTime));
            });
        },
        renderList: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const data = this.getAll();
            
            let html = `
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">اليوم / التاريخ</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الصف</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">المادة</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">المعلم</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">وقت البدء</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">وقت الانتهاء</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            data.forEach(item => {
                html += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.date || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.class || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.subject || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.teacher || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.startTime || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.endTime || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            <button class="btn btn--sm btn--primary" onclick="App.Modules.Schedule.showFormModal('${item.id}')">تعديل</button>
                            <button class="btn btn--sm" style="background:#f44336; color:#fff;" onclick="App.Modules.Schedule.deleteItem('${item.id}')">حذف</button>
                        </td>
                    </tr>
                `;
            });
            
            if(data.length === 0) {
                html += `<tr><td colspan="7" style="text-align: center; padding: 20px;">لا توجد بيانات</td></tr>`;
            }
            
            html += `</tbody></table>`;
            container.innerHTML = html;
        },
        showFormModal: function(id = null) {
            const item = id ? this.getById(id) : {};
            const title = id ? 'تعديل الجدول' : 'إضافة للجدول';
            
            const formHtml = `
                <form id="schedule-form" class="dynamic-form">
                    <input type="hidden" id="schedule-id" value="${item.id || ''}">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>اليوم / التاريخ</label>
                        <input type="text" id="schedule-date" class="form-control" style="width:100%; padding:8px;" value="${item.date || ''}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>الصف</label>
                        <input type="text" id="schedule-class" class="form-control" style="width:100%; padding:8px;" value="${item.class || ''}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>المادة</label>
                        <input type="text" id="schedule-subject" class="form-control" style="width:100%; padding:8px;" value="${item.subject || ''}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>المعلم</label>
                        <input type="text" id="schedule-teacher" class="form-control" style="width:100%; padding:8px;" value="${item.teacher || ''}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>وقت البدء</label>
                        <input type="time" id="schedule-start" class="form-control" style="width:100%; padding:8px;" value="${item.startTime || ''}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>وقت الانتهاء</label>
                        <input type="time" id="schedule-end" class="form-control" style="width:100%; padding:8px;" value="${item.endTime || ''}" required>
                    </div>
                    <button type="submit" class="btn btn--primary" style="padding:8px 15px; background: #007bff; color:white; border:none; border-radius:4px; cursor:pointer;">حفظ</button>
                </form>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(title, formHtml);
                
                document.getElementById('schedule-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const data = {
                        date: document.getElementById('schedule-date').value,
                        class: document.getElementById('schedule-class').value,
                        subject: document.getElementById('schedule-subject').value,
                        teacher: document.getElementById('schedule-teacher').value,
                        startTime: document.getElementById('schedule-start').value,
                        endTime: document.getElementById('schedule-end').value
                    };
                    const recordId = document.getElementById('schedule-id').value;
                    if (recordId) {
                        data.id = recordId;
                    }
                    App.Modules.Schedule.save(data);
                });
            }
        },
        save: function(data) {
            if (data.id) {
                this.update(data.id, data);
            } else {
                this.create(data);
            }
            if (App.Components && App.Components.Toast) {
                App.Components.Toast.show('تم الحفظ بنجاح', 'success');
            } else {
                alert('تم الحفظ بنجاح');
            }
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.hide();
            }
            this.renderList('page-content');
        },
        deleteItem: function(id) {
            if (confirm('هل أنت متأكد من الحذف؟')) {
                this.delete(id);
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم الحذف بنجاح', 'success');
                } else {
                    alert('تم الحذف بنجاح');
                }
                this.renderList('page-content');
            }
        }
    };
})();
