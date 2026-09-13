(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'grades';

    App.Modules.Grades = {
        init: function() {
            console.log('Grades module initialized');
        },
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
        addGrade: function(studentId, subjectId, grade, term) {
            return this.create({ studentId, subjectId, grade, term, date: new Date().toISOString() });
        },
        getGradesByStudent: function(studentId) {
            return this.getAll().filter(item => item.studentId === studentId);
        },
        getGradesBySubject: function(subjectId) {
            return this.getAll().filter(item => item.subjectId === subjectId);
        },
        updateGrade: function(id, updates) {
            return this.update(id, updates);
        },
        deleteGrade: function(id) {
            return this.delete(id);
        },
        searchByBarcode: function(barcode) {
            const students = App.DB && App.DB.getAll ? App.DB.getAll('students') : JSON.parse(localStorage.getItem('students') || '[]');
            const student = students.find(s => s.studentId === barcode || s.seatNumber === barcode || s.id === barcode);
            if (!student) {
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('طالب غير موجود', 'error');
                } else {
                    alert('طالب غير موجود');
                }
                return null;
            }
            return student;
        },
        renderBarcodeSearchUI: function(containerId, resultContainerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = `
                <div class="card mb-4">
                    <div class="card__body flex items-center justify-between">
                        <div>
                            <h3 class="mb-1">بحث سريع بالباركود</h3>
                            <p class="text-sm text-secondary">ابحث عن نتائج طالب برقم الجلوس أو الباركود</p>
                        </div>
                        <div class="flex" style="gap: 10px; width: 300px;">
                            <input type="text" id="grades-barcode-input" class="form-control" placeholder="مرر الباركود أو رقم الجلوس...">
                            <button class="btn btn--primary" id="btn-grades-search">بحث</button>
                        </div>
                    </div>
                </div>
            `;
            const input = document.getElementById('grades-barcode-input');
            const btn = document.getElementById('btn-grades-search');
            
            const handleSearch = () => {
                const val = input.value.trim();
                if (!val) return;
                const student = this.searchByBarcode(val);
                if (student) {
                    const resultContainer = document.getElementById(resultContainerId);
                    if (resultContainer) {
                        resultContainer.innerHTML = '';
                        const pageContent = document.getElementById('page-content');
                        if (pageContent) pageContent.style.display = 'none';
                        resultContainer.style.display = 'block';
                        this.renderStudentGrades(resultContainerId, student);
                    }
                }
            };
            
            btn.addEventListener('click', handleSearch);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSearch();
            });
        },
        renderStudentGrades: function(containerId, student) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const studentId = typeof student === 'object' ? student.id : student;
            const studentObj = typeof student === 'object' ? student : (App.DB && App.DB.getAll ? App.DB.getAll('students').find(s => s.id === studentId) : null);
            const studentName = studentObj ? (studentObj.name || studentObj.nameAr || studentObj.studentName || '') : '';
            
            const allGrades = this.getAll();
            const grades = allGrades.filter(g => g.studentId === studentId || g.studentName === studentName);
            
            let html = `
                <div class="card mb-4">
                    <div class="card__header flex items-center justify-between" style="padding-bottom: 15px; border-bottom: 1px solid #eee; margin-bottom: 15px;">
                        <h3>نتائج الطالب: ${studentName}</h3>
                        <button class="btn btn--sm" onclick="document.getElementById('${containerId}').style.display='none'; const pc = document.getElementById('page-content'); if(pc) pc.style.display='block';">إغلاق</button>
                    </div>
                    <div class="card__body">
                        <table class="data-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">المادة</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الدرجة</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الفصل الدراسي</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            grades.forEach(item => {
                let subName = item.subjectName || item.subjectId || '';
                let dateFormatted = item.date ? item.date.split('T')[0] : '';
                html += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${subName}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.grade || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.term || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${dateFormatted}</td>
                    </tr>
                `;
            });
            
            if(grades.length === 0) {
                html += `<tr><td colspan="4" style="text-align: center; padding: 20px;">لا توجد نتائج لهذا الطالب</td></tr>`;
            }
            
            html += `</tbody></table></div></div>`;
            container.innerHTML = html;
        },
        renderList: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const data = this.getAll();
            
            let html = `
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">اسم الطالب</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">المادة</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الدرجة</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الفصل الدراسي</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">التاريخ</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            data.forEach(item => {
                let sName = item.studentName || item.studentId || '';
                let subName = item.subjectName || item.subjectId || '';
                let dateFormatted = item.date ? item.date.split('T')[0] : '';
                html += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${sName}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${subName}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.grade || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.term || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${dateFormatted}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            <button class="btn btn--sm btn--primary" onclick="App.Modules.Grades.showFormModal('${item.id}')">تعديل</button>
                            <button class="btn btn--sm" style="background:#f44336; color:#fff;" onclick="App.Modules.Grades.deleteItem('${item.id}')">حذف</button>
                        </td>
                    </tr>
                `;
            });
            
            if(data.length === 0) {
                html += `<tr><td colspan="6" style="text-align: center; padding: 20px;">لا توجد بيانات</td></tr>`;
            }
            
            html += `</tbody></table>`;
            container.innerHTML = html;
        },
        showFormModal: function(id = null) {
            const item = id ? this.getById(id) : {};
            const title = id ? 'تعديل الدرجة' : 'إضافة درجة جديدة';
            
            const formHtml = `
                <form id="grades-form" class="dynamic-form">
                    <input type="hidden" id="grade-id" value="${item.id || ''}">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>اسم الطالب</label>
                        <input type="text" id="grade-student" class="form-control" style="width:100%; padding:8px;" value="${item.studentName || item.studentId || ''}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>المادة</label>
                        <input type="text" id="grade-subject" class="form-control" style="width:100%; padding:8px;" value="${item.subjectName || item.subjectId || ''}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>الدرجة</label>
                        <input type="number" id="grade-value" class="form-control" style="width:100%; padding:8px;" value="${item.grade || ''}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>الفصل الدراسي</label>
                        <select id="grade-term" class="form-control" style="width:100%; padding:8px;" required>
                            <option value="الفصل الأول" ${item.term === 'الفصل الأول' ? 'selected' : ''}>الفصل الأول</option>
                            <option value="الفصل الثاني" ${item.term === 'الفصل الثاني' ? 'selected' : ''}>الفصل الثاني</option>
                            <option value="الفصل الثالث" ${item.term === 'الفصل الثالث' ? 'selected' : ''}>الفصل الثالث</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>التاريخ</label>
                        <input type="date" id="grade-date" class="form-control" style="width:100%; padding:8px;" value="${item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <button type="submit" class="btn btn--primary" style="padding:8px 15px; background: #007bff; color:white; border:none; border-radius:4px; cursor:pointer;">حفظ</button>
                </form>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(title, formHtml);
                
                document.getElementById('grades-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const data = {
                        studentName: document.getElementById('grade-student').value,
                        subjectName: document.getElementById('grade-subject').value,
                        grade: document.getElementById('grade-value').value,
                        term: document.getElementById('grade-term').value,
                        date: document.getElementById('grade-date').value
                    };
                    const recordId = document.getElementById('grade-id').value;
                    if (recordId) {
                        data.id = recordId;
                    }
                    App.Modules.Grades.save(data);
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
