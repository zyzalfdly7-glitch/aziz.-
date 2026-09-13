(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'assignments';
    let currentContainerId = null;
    let currentAssignments = [];

    App.Modules.Assignments = {
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
            if (App.DB && App.DB.update) return App.DB.update(collection, id, updates);
            const all = this.getAll();
            const index = all.findIndex(item => item.id === id);
            if (index !== -1) {
                all[index] = { ...all[index], ...updates };
                localStorage.setItem(collection, JSON.stringify(all));
                return all[index];
            }
            return null;
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذا الواجب؟')) {
                if (App.DB && App.DB.delete) {
                    App.DB.delete(collection, id);
                } else {
                    let all = this.getAll();
                    all = all.filter(item => item.id !== id);
                    localStorage.setItem(collection, JSON.stringify(all));
                }
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم حذف الواجب بنجاح', 'success');
                }
                if (currentContainerId) {
                    this.renderList(currentContainerId);
                }
            }
        },
        
        renderList: function(containerId) {
            currentContainerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;

            let allAssignments = this.getAll();
            currentAssignments = allAssignments;

            const subjects = (App.DB && App.DB.getAll) ? App.DB.getAll('subjects') : [];
            const classes = (App.DB && App.DB.getAll) ? App.DB.getAll('classes') : [];

            let subjectOptions = '<option value="">جميع المواد</option>';
            subjects.forEach(s => subjectOptions += `<option value="${s.id}">${s.name}</option>`);

            let classOptions = '<option value="">جميع الصفوف</option>';
            classes.forEach(c => classOptions += `<option value="${c.id}">${c.name}</option>`);

            const html = `
                <div class="flex flex-wrap gap-2 mb-4">
                    <select id="assignments-subject-filter" class="form-control" style="max-width: 200px;">
                        ${subjectOptions}
                    </select>
                    <select id="assignments-class-filter" class="form-control" style="max-width: 200px;">
                        ${classOptions}
                    </select>
                    <select id="assignments-status-filter" class="form-control" style="max-width: 150px;">
                        <option value="">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="closed">مغلق</option>
                    </select>
                </div>
                <div class="table-responsive">
                    <table class="data-table" id="assignments-table">
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>المادة</th>
                                <th>الصف</th>
                                <th>تاريخ التسليم</th>
                                <th>الدرجة القصوى</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = html;
            
            this.renderTableData(allAssignments);

            document.getElementById('assignments-subject-filter').addEventListener('change', () => this.filterData());
            document.getElementById('assignments-class-filter').addEventListener('change', () => this.filterData());
            document.getElementById('assignments-status-filter').addEventListener('change', () => this.filterData());
        },

        filterData: function() {
            const subjectId = document.getElementById('assignments-subject-filter').value;
            const classId = document.getElementById('assignments-class-filter').value;
            const status = document.getElementById('assignments-status-filter').value;

            const allAssignments = this.getAll();
            
            const filtered = allAssignments.filter(a => {
                const matchSubject = subjectId ? a.subjectId === subjectId : true;
                const matchClass = classId ? a.classId === classId : true;
                const matchStatus = status ? a.status === status : true;
                return matchSubject && matchClass && matchStatus;
            });
            
            currentAssignments = filtered;
            this.renderTableData(filtered);
        },

        renderTableData: function(assignments) {
            const tbody = document.querySelector('#assignments-table tbody');
            if (!tbody) return;

            if (assignments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">لا توجد واجبات</td></tr>';
                return;
            }

            const subjects = (App.DB && App.DB.getAll) ? App.DB.getAll('subjects') : [];
            const classes = (App.DB && App.DB.getAll) ? App.DB.getAll('classes') : [];

            tbody.innerHTML = '';
            assignments.forEach(a => {
                const subject = subjects.find(s => s.id === a.subjectId);
                const cls = classes.find(c => c.id === a.classId);
                
                const subjectName = subject ? subject.name : 'غير محدد';
                const className = cls ? cls.name : 'غير محدد';
                
                const badgeClass = a.status === 'active' ? 'badge--success' : 'badge--secondary';
                const statusName = a.status === 'active' ? 'نشط' : (a.status === 'closed' ? 'مغلق' : a.status);

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${App.Utils && App.Utils.escapeHTML ? App.Utils.escapeHTML(a.title) : a.title}</td>
                    <td>${subjectName}</td>
                    <td>${className}</td>
                    <td>${a.dueDate || '-'}</td>
                    <td>${a.maxGrade || '-'}</td>
                    <td><span class="badge ${badgeClass}">${statusName}</span></td>
                    <td>
                        <div class="flex gap-1">
                            <button class="btn btn--sm btn--primary" onclick="App.Modules.Assignments.showFormModal('${a.id}')">تعديل</button>
                            <button class="btn btn--sm btn--danger" onclick="App.Modules.Assignments.delete('${a.id}')">حذف</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        },

        showFormModal: function(id) {
            let assignment = {
                title: '',
                description: '',
                subjectId: '',
                classId: '',
                sectionId: '',
                teacherId: (App.Auth && App.Auth.getCurrentUser() && App.Auth.getCurrentUser().role === 'teacher') ? App.Auth.getCurrentUser().id : '',
                dueDate: '',
                maxGrade: 10,
                status: 'active'
            };
            
            let isEdit = false;
            if (id) {
                const existing = this.getById(id);
                if (existing) {
                    assignment = { ...existing };
                    isEdit = true;
                }
            }

            const subjects = (App.DB && App.DB.getAll) ? App.DB.getAll('subjects') : [];
            const classes = (App.DB && App.DB.getAll) ? App.DB.getAll('classes') : [];
            const sections = (App.DB && App.DB.getAll) ? App.DB.getAll('sections') : [];

            let subjectOptions = '<option value="">اختر المادة</option>';
            subjects.forEach(s => subjectOptions += `<option value="${s.id}" ${assignment.subjectId === s.id ? 'selected' : ''}>${s.name}</option>`);

            let classOptions = '<option value="">اختر الصف</option>';
            classes.forEach(c => classOptions += `<option value="${c.id}" ${assignment.classId === c.id ? 'selected' : ''}>${c.name}</option>`);

            let sectionOptions = '<option value="">اختر الشعبة (اختياري)</option>';
            sections.forEach(s => sectionOptions += `<option value="${s.id}" ${assignment.sectionId === s.id ? 'selected' : ''}>${s.name}</option>`);

            const html = `
                <form id="assignment-form" onsubmit="App.Modules.Assignments.save(event, '${id || ''}')">
                    <div class="form-group mb-3">
                        <label class="form-label">عنوان الواجب <span class="text-danger">*</span></label>
                        <input type="text" name="title" class="form-control" value="${assignment.title}" required>
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">الوصف</label>
                        <textarea name="description" class="form-control" rows="3">${assignment.description || ''}</textarea>
                    </div>
                    <div class="grid grid--2 gap-3 mb-3">
                        <div class="form-group">
                            <label class="form-label">المادة <span class="text-danger">*</span></label>
                            <select name="subjectId" class="form-control" required>
                                ${subjectOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">الصف <span class="text-danger">*</span></label>
                            <select name="classId" class="form-control" required>
                                ${classOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">الشعبة</label>
                            <select name="sectionId" class="form-control">
                                ${sectionOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">تاريخ التسليم</label>
                            <input type="date" name="dueDate" class="form-control" value="${assignment.dueDate}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">الدرجة القصوى</label>
                            <input type="number" name="maxGrade" class="form-control" value="${assignment.maxGrade}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">الحالة</label>
                            <select name="status" class="form-control">
                                <option value="active" ${assignment.status === 'active' ? 'selected' : ''}>نشط</option>
                                <option value="closed" ${assignment.status === 'closed' ? 'selected' : ''}>مغلق</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                        <button type="button" class="btn btn--ghost" onclick="App.Components.Modal.hide()">إلغاء</button>
                        <button type="submit" class="btn btn--primary">حفظ</button>
                    </div>
                </form>
            `;

            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(isEdit ? 'تعديل الواجب' : 'إضافة واجب', html);
            }
        },

        save: function(event, id) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            data.maxGrade = parseFloat(data.maxGrade) || 10;
            if (!data.teacherId && App.Auth && App.Auth.getCurrentUser()) {
                const user = App.Auth.getCurrentUser();
                if (user.role === 'teacher') {
                    data.teacherId = user.id;
                }
            }

            if (id) {
                this.update(id, data);
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم تحديث الواجب بنجاح', 'success');
                }
            } else {
                this.create(data);
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم إضافة الواجب بنجاح', 'success');
                }
            }

            if (App.Components && App.Components.Modal) {
                App.Components.Modal.hide();
            }

            if (currentContainerId) {
                this.renderList(currentContainerId);
            }
        }
    };
})();
