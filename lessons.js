(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};

    App.Modules.Lessons = {
        init: function() {
            console.log('Lessons module initialized');
        },
        createLesson: function(title, subjectId, teacherId, date, content) {
            return App.DB.create('lessons', { title, subjectId, teacherId, date, content });
        },
        getLessonsBySubject: function(subjectId) {
            return App.DB.query('lessons', l => l.subjectId === subjectId);
        },
        getLessonsByTeacher: function(teacherId) {
            return App.DB.query('lessons', l => l.teacherId === teacherId);
        },
        updateLesson: function(id, updates) {
            return App.DB.update('lessons', id, updates);
        },
        deleteLesson: function(id) {
            return App.DB.delete('lessons', id);
        },
        getAll: function() {
            return App.DB.getAll('lessons') || [];
        },
        getById: function(id) {
            return App.DB.getById('lessons', id);
        },
        add: function(lesson) {
            return App.DB.create('lessons', lesson);
        },
        update: function(id, data) {
            return App.DB.update('lessons', id, data);
        },
        remove: function(id) {
            return App.DB.delete('lessons', id);
        },
        renderList: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const lessons = this.getAll();
            let html = `
            <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: right;">
                <thead>
                    <tr>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">عنوان الدرس</th>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">التاريخ</th>
                        <th style="border-bottom: 2px solid #ddd; padding: 10px;">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
            `;
            if (lessons.length === 0) {
                html += `<tr><td colspan="3" style="text-align: center; padding: 20px;">لا توجد دروس</td></tr>`;
            } else {
                lessons.forEach(l => {
                    html += `
                    <tr>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">${l.title || ''}</td>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">${l.date || ''}</td>
                        <td style="border-bottom: 1px solid #eee; padding: 10px;">
                            <button onclick="App.Modules.Lessons.showFormModal('${l.id}')" class="btn btn--sm btn--primary">تعديل</button>
                            <button onclick="App.Modules.Lessons.delete('${l.id}')" class="btn btn--sm btn--danger">حذف</button>
                        </td>
                    </tr>
                    `;
                });
            }
            html += `</tbody></table>`;
            container.innerHTML = html;
        },
        showFormModal: function(id = null) {
            let lessonObj = id ? this.getById(id) : null;
            let title = lessonObj ? (lessonObj.title || '') : '';
            let date = lessonObj ? (lessonObj.date || '') : '';
            let content = lessonObj ? (lessonObj.content || '') : '';
            
            let formHtml = `
            <form id="lesson-form" onsubmit="event.preventDefault(); App.Modules.Lessons.save('${id || ''}')">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">عنوان الدرس</label>
                    <input type="text" id="lesson-title" value="${title}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">التاريخ</label>
                    <input type="date" id="lesson-date" value="${date}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">المحتوى</label>
                    <textarea id="lesson-content" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" rows="4">${content}</textarea>
                </div>
                <div style="text-align: left;">
                    <button type="submit" class="btn btn--primary">حفظ</button>
                    <button type="button" class="btn btn--ghost" onclick="App.Components.Modal.hide()">إلغاء</button>
                </div>
            </form>
            `;
            App.Components.Modal.show(id ? 'تعديل الدرس' : 'إضافة درس جديد', formHtml);
        },
        save: function(id) {
            const title = document.getElementById('lesson-title').value;
            const date = document.getElementById('lesson-date').value;
            const content = document.getElementById('lesson-content').value;
            const data = { title, date, content };
            
            if (id) {
                this.update(id, data);
                App.Components.Toast.show('تم تحديث الدرس بنجاح', 'success');
            } else {
                this.add(data);
                App.Components.Toast.show('تمت إضافة الدرس بنجاح', 'success');
            }
            App.Components.Modal.hide();
            this.renderList('page-content');
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
                this.remove(id);
                App.Components.Toast.show('تم حذف الدرس بنجاح', 'success');
                this.renderList('page-content');
            }
        }
    };
})();
