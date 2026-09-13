(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    App.Modules.Subjects = {
        getAll: function() {
            return App.DB.getAll('subjects') || [];
        },
        getById: function(id) {
            return App.DB.getById('subjects', id);
        },
        add: function(subject) {
            return App.DB.create('subjects', subject);
        },
        update: function(id, data) {
            return App.DB.update('subjects', id, data);
        },
        remove: function(id) {
            return App.DB.delete('subjects', id);
        },
        renderList: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const subjects = this.getAll();
            let html = `
            <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: right;">
                <thead>
                    <tr>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">اسم المادة</th>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">الوصف</th>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
            `;
            if (subjects.length === 0) {
                html += `<tr><td colspan="3" style="text-align: center; padding: 20px;">لا توجد مواد</td></tr>`;
            } else {
                subjects.forEach(s => {
                    html += `
                    <tr>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">${s.name || s.subjectName || ''}</td>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">${s.description || ''}</td>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">
                            <button onclick="App.Modules.Subjects.showFormModal('${s.id}')" class="btn btn--sm btn--primary">تعديل</button>
                            <button onclick="App.Modules.Subjects.delete('${s.id}')" class="btn btn--sm btn--danger">حذف</button>
                        </td>
                    </tr>
                    `;
                });
            }
            html += `</tbody></table>`;
            container.innerHTML = html;
        },
        showFormModal: function(id = null) {
            let subjectObj = id ? this.getById(id) : null;
            let name = subjectObj ? (subjectObj.name || subjectObj.subjectName || '') : '';
            let description = subjectObj ? (subjectObj.description || '') : '';
            
            let formHtml = `
            <form id="subject-form" onsubmit="event.preventDefault(); App.Modules.Subjects.save('${id || ''}')">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">اسم المادة</label>
                    <input type="text" id="subject-name" value="${name}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">الوصف</label>
                    <textarea id="subject-desc" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">${description}</textarea>
                </div>
                <div style="text-align: left;">
                    <button type="submit" class="btn btn--primary">حفظ</button>
                    <button type="button" class="btn btn--ghost" onclick="App.Components.Modal.hide()">إلغاء</button>
                </div>
            </form>
            `;
            App.Components.Modal.show(id ? 'تعديل المادة' : 'إضافة مادة جديدة', formHtml);
        },
        save: function(id) {
            const name = document.getElementById('subject-name').value;
            const description = document.getElementById('subject-desc').value;
            const data = { name: name, description: description };
            
            if (id) {
                this.update(id, data);
                App.Components.Toast.show('تم تحديث المادة بنجاح', 'success');
            } else {
                this.add(data);
                App.Components.Toast.show('تمت إضافة المادة بنجاح', 'success');
            }
            App.Components.Modal.hide();
            this.renderList('page-content');
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
                this.remove(id);
                App.Components.Toast.show('تم حذف المادة بنجاح', 'success');
                this.renderList('page-content');
            }
        }
    };
})();
