(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    App.Modules.Classes = {
        getAll: function() {
            return App.DB.getAll('classes') || [];
        },
        getById: function(id) {
            return App.DB.getById('classes', id);
        },
        add: function(classObj) {
            return App.DB.create('classes', classObj);
        },
        update: function(id, data) {
            return App.DB.update('classes', id, data);
        },
        remove: function(id) {
            return App.DB.delete('classes', id);
        },
        renderList: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const classes = this.getAll();
            let html = `
            <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: right;">
                <thead>
                    <tr>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">اسم الصف</th>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">المرحلة</th>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
            `;
            if (classes.length === 0) {
                html += `<tr><td colspan="3" style="text-align: center; padding: 20px;">لا توجد صفوف</td></tr>`;
            } else {
                classes.forEach(c => {
                    html += `
                    <tr>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">${c.name || c.className || ''}</td>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">${c.level || c.stage || ''}</td>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">
                            <button onclick="App.Modules.Classes.showFormModal('${c.id}')" class="btn btn--sm btn--primary">تعديل</button>
                            <button onclick="App.Modules.Classes.delete('${c.id}')" class="btn btn--sm btn--danger">حذف</button>
                        </td>
                    </tr>
                    `;
                });
            }
            html += `</tbody></table>`;
            container.innerHTML = html;
        },
        showFormModal: function(id = null) {
            let classObj = id ? this.getById(id) : null;
            let name = classObj ? (classObj.name || classObj.className || '') : '';
            let level = classObj ? (classObj.level || classObj.stage || '') : '';
            
            let formHtml = `
            <form id="class-form" onsubmit="event.preventDefault(); App.Modules.Classes.save('${id || ''}')">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">اسم الصف</label>
                    <input type="text" id="class-name" value="${name}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">المرحلة</label>
                    <input type="text" id="class-level" value="${level}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="text-align: left;">
                    <button type="submit" class="btn btn--primary">حفظ</button>
                    <button type="button" class="btn btn--ghost" onclick="App.Components.Modal.hide()">إلغاء</button>
                </div>
            </form>
            `;
            App.Components.Modal.show(id ? 'تعديل الصف' : 'إضافة صف جديد', formHtml);
        },
        save: function(id) {
            const name = document.getElementById('class-name').value;
            const level = document.getElementById('class-level').value;
            const data = { name: name, level: level };
            
            if (id) {
                this.update(id, data);
                App.Components.Toast.show('تم تحديث الصف بنجاح', 'success');
            } else {
                this.add(data);
                App.Components.Toast.show('تمت إضافة الصف بنجاح', 'success');
            }
            App.Components.Modal.hide();
            this.renderList('page-content');
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذا الصف؟')) {
                this.remove(id);
                App.Components.Toast.show('تم حذف الصف بنجاح', 'success');
                this.renderList('page-content');
            }
        }
    };
})();
