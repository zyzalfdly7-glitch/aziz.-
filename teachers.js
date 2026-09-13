(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'teachers';
    let currentContainerId = null;
    
    App.Modules.Teachers = {
        getAll: function() {
            if (App.DB && App.DB.getAll) return App.DB.getAll(collection);
            return JSON.parse(localStorage.getItem(collection) || '[]');
        },
        getById: function(id) {
            if (App.DB && App.DB.getById) return App.DB.getById(collection, id);
            return this.getAll().find(t => t.id === id);
        },
        create: function(data) {
            if (App.DB && App.DB.create) return App.DB.create(collection, data);
            data.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
            data.createdAt = new Date().toISOString();
            const all = this.getAll();
            all.push(data);
            localStorage.setItem(collection, JSON.stringify(all));
            return data;
        },
        update: function(id, data) {
            if (App.DB && App.DB.update) return App.DB.update(collection, id, data);
            const all = this.getAll();
            const index = all.findIndex(t => t.id === id);
            if (index !== -1) {
                all[index] = Object.assign({}, all[index], data);
                localStorage.setItem(collection, JSON.stringify(all));
                return all[index];
            }
            return null;
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذا المعلم؟')) {
                try {
                    if (App.DB && App.DB.delete) {
                        App.DB.delete(collection, id);
                    } else {
                        const all = this.getAll().filter(t => t.id !== id);
                        localStorage.setItem(collection, JSON.stringify(all));
                    }
                    if (App.Components && App.Components.Toast) {
                        App.Components.Toast.show('تم حذف المعلم بنجاح', 'success');
                    }
                    if (currentContainerId) {
                        this.renderList(currentContainerId);
                    }
                    return true;
                } catch (err) {
                    if (App.Components && App.Components.Toast) {
                        App.Components.Toast.show('حدث خطأ أثناء الحذف', 'error');
                    }
                }
            }
            return false;
        },
        renderList: function(containerId) {
            currentContainerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;
            const teachers = this.getAll();
            
            if (teachers.length === 0) {
                container.innerHTML = '<p style="text-align:center; padding: 20px;">لا يوجد معلمين حالياً.</p>';
                return;
            }
            
            let html = `
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الاسم</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">التخصص</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">رقم الهاتف</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الحالة</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            teachers.forEach(teacher => {
                html += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${teacher.fullName || teacher.name || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${teacher.specialization || teacher.subject || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${teacher.phone || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${teacher.status || 'نشط'}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            <button onclick="App.Modules.Teachers.showFormModal('${teacher.id}')" class="btn btn--primary btn--sm">تعديل</button>
                            <button onclick="App.Modules.Teachers.delete('${teacher.id}')" class="btn btn--danger btn--sm" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">حذف</button>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            container.innerHTML = html;
        },
        showFormModal: function(id = null) {
            let teacher = id ? this.getById(id) : {};
            const title = id ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد';
            
            const contentHTML = `
                <form id="teacher-form" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="hidden" name="id" id="teacher-id" value="${teacher.id || ''}">
                    
                    <div class="form-group">
                        <label for="teacher-fullName">اسم المعلم</label>
                        <input type="text" id="teacher-fullName" name="fullName" class="form-control" value="${teacher.fullName || teacher.name || ''}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="teacher-specialization">التخصص / المادة</label>
                        <input type="text" id="teacher-specialization" name="specialization" class="form-control" value="${teacher.specialization || teacher.subject || ''}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="teacher-phone">رقم الهاتف</label>
                        <input type="text" id="teacher-phone" name="phone" class="form-control" value="${teacher.phone || ''}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="teacher-email">البريد الإلكتروني</label>
                        <input type="email" id="teacher-email" name="email" class="form-control" value="${teacher.email || ''}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="teacher-qualification">المؤهل</label>
                        <input type="text" id="teacher-qualification" name="qualification" class="form-control" value="${teacher.qualification || ''}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="teacher-status">الحالة</label>
                        <select id="teacher-status" name="status" class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="نشط" ${teacher.status === 'نشط' ? 'selected' : ''}>نشط</option>
                            <option value="إجازة" ${teacher.status === 'إجازة' ? 'selected' : ''}>إجازة</option>
                            <option value="غير نشط" ${teacher.status === 'غير نشط' ? 'selected' : ''}>غير نشط</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn--primary" style="padding: 10px; border: none; border-radius: 4px; cursor: pointer; background: #2196f3; color: white;">حفظ</button>
                </form>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(title, contentHTML);
                
                const form = document.getElementById('teacher-form');
                form.onsubmit = (e) => {
                    e.preventDefault();
                    const data = {
                        fullName: document.getElementById('teacher-fullName').value,
                        specialization: document.getElementById('teacher-specialization').value,
                        phone: document.getElementById('teacher-phone').value,
                        email: document.getElementById('teacher-email').value,
                        qualification: document.getElementById('teacher-qualification').value,
                        status: document.getElementById('teacher-status').value
                    };
                    const recordId = document.getElementById('teacher-id').value;
                    if (recordId) {
                        data.id = recordId;
                    }
                    this.save(data);
                };
            }
        },
        save: function(data) {
            try {
                if (data.id) {
                    this.update(data.id, data);
                } else {
                    this.create(data);
                }
                
                if (App.Components && App.Components.Modal) {
                    App.Components.Modal.hide();
                }
                
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم حفظ بيانات المعلم بنجاح', 'success');
                }
                
                if (currentContainerId) {
                    this.renderList(currentContainerId);
                }
            } catch (err) {
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('حدث خطأ أثناء الحفظ', 'error');
                }
            }
        }
    };
})();
