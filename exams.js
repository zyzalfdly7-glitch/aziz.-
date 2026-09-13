(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'exams';
    let currentContainerId = null;
    
    App.Modules.Exams = {
        getAll: function() {
            if (App.DB && App.DB.getAll) return App.DB.getAll(collection);
            return JSON.parse(localStorage.getItem(collection) || '[]');
        },
        getById: function(id) {
            if (App.DB && App.DB.getById) return App.DB.getById(collection, id);
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
            const idx = all.findIndex(item => item.id === id);
            if (idx > -1) {
                all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
                localStorage.setItem(collection, JSON.stringify(all));
                return all[idx];
            }
            return null;
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
                if (App.DB && App.DB.delete) {
                    App.DB.delete(collection, id);
                } else {
                    const all = this.getAll().filter(item => item.id !== id);
                    localStorage.setItem(collection, JSON.stringify(all));
                }
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم حذف الاختبار بنجاح', 'success');
                }
                if (currentContainerId) {
                    this.renderList(currentContainerId);
                }
            }
        },
        
        getStatusBadge: function(status) {
            switch(status) {
                case 'active': return '<span class="badge badge--success">نشط</span>';
                case 'draft': return '<span class="badge badge--warning">مسودة</span>';
                case 'closed': return '<span class="badge" style="background-color: #6c757d; color: white;">مغلق</span>';
                default: return '<span class="badge">غير معروف</span>';
            }
        },
        
        getSubjectName: function(subjectId) {
            if (!subjectId) return '-';
            if (App.DB && App.DB.getById) {
                const s = App.DB.getById('subjects', subjectId);
                return s ? s.name : subjectId;
            }
            return subjectId;
        },
        
        getClassName: function(classId) {
            if (!classId) return '-';
            if (App.DB && App.DB.getById) {
                const c = App.DB.getById('classes', classId);
                return c ? c.name : classId;
            }
            return classId;
        },
        
        renderList: function(containerId) {
            currentContainerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const exams = this.getAll();
            
            if (exams.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>لا توجد اختبارات حالياً</p></div>';
                return;
            }
            
            let html = `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>عنوان الاختبار</th>
                                <th>المادة</th>
                                <th>الصف</th>
                                <th>المدة</th>
                                <th>الدرجة</th>
                                <th>عدد الأسئلة</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            exams.forEach(exam => {
                const qCount = exam.questions ? exam.questions.length : 0;
                
                html += `
                    <tr>
                        <td>${exam.title || '-'}</td>
                        <td>${this.getSubjectName(exam.subjectId)}</td>
                        <td>${this.getClassName(exam.classId)}</td>
                        <td>${exam.durationMinutes ? exam.durationMinutes + ' دقيقة' : '-'}</td>
                        <td>${exam.maxGrade || '-'}</td>
                        <td>${qCount}</td>
                        <td>${this.getStatusBadge(exam.status)}</td>
                        <td>
                            <button class="btn btn--sm btn--primary" onclick="App.Modules.Exams.showFormModal('${exam.id}')">تعديل</button>
                            <button class="btn btn--sm" onclick="App.Modules.Exams.showQuestionsModal('${exam.id}')" style="background-color: #17a2b8; color: white;">الأسئلة</button>
                            <button class="btn btn--sm" onclick="App.Modules.Exams.viewResults('${exam.id}')" style="background-color: #6f42c1; color: white;">النتائج</button>
                            <button class="btn btn--sm btn--danger" onclick="App.Modules.Exams.delete('${exam.id}')">حذف</button>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = html;
        },
        
        showFormModal: function(id = null) {
            const isEdit = !!id;
            const exam = isEdit ? this.getById(id) : {
                title: '', subjectId: '', classId: '', durationMinutes: 30, maxGrade: 20, status: 'draft', startDate: '', endDate: ''
            };
            
            let subjects = [];
            let classes = [];
            if (App.DB && App.DB.getAll) {
                subjects = App.DB.getAll('subjects') || [];
                classes = App.DB.getAll('classes') || [];
            }
            
            let subjectOptions = '<option value="">اختر المادة</option>';
            subjects.forEach(s => {
                subjectOptions += `<option value="${s.id}" ${exam.subjectId === s.id ? 'selected' : ''}>${s.name}</option>`;
            });
            
            let classOptions = '<option value="">اختر الصف</option>';
            classes.forEach(c => {
                classOptions += `<option value="${c.id}" ${exam.classId === c.id ? 'selected' : ''}>${c.name}</option>`;
            });
            
            const html = `
                <form id="exam-form" onsubmit="event.preventDefault(); App.Modules.Exams.save('${id || ''}')">
                    <div class="form-group">
                        <label>عنوان الاختبار</label>
                        <input type="text" class="form-control" id="exam-title" value="${exam.title}" required>
                    </div>
                    <div class="form-row" style="display:flex; gap:1rem;">
                        <div class="form-group" style="flex:1;">
                            <label>المادة</label>
                            <select class="form-control" id="exam-subject" required>
                                ${subjectOptions}
                            </select>
                        </div>
                        <div class="form-group" style="flex:1;">
                            <label>الصف</label>
                            <select class="form-control" id="exam-class" required>
                                ${classOptions}
                            </select>
                        </div>
                    </div>
                    <div class="form-row" style="display:flex; gap:1rem;">
                        <div class="form-group" style="flex:1;">
                            <label>المدة (بالدقائق)</label>
                            <input type="number" class="form-control" id="exam-duration" value="${exam.durationMinutes}" required min="1">
                        </div>
                        <div class="form-group" style="flex:1;">
                            <label>الدرجة القصوى</label>
                            <input type="number" class="form-control" id="exam-grade" value="${exam.maxGrade}" required min="1">
                        </div>
                    </div>
                    <div class="form-row" style="display:flex; gap:1rem;">
                        <div class="form-group" style="flex:1;">
                            <label>تاريخ البداية</label>
                            <input type="datetime-local" class="form-control" id="exam-start" value="${exam.startDate || ''}">
                        </div>
                        <div class="form-group" style="flex:1;">
                            <label>تاريخ النهاية</label>
                            <input type="datetime-local" class="form-control" id="exam-end" value="${exam.endDate || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>الحالة</label>
                        <select class="form-control" id="exam-status">
                            <option value="draft" ${exam.status === 'draft' ? 'selected' : ''}>مسودة</option>
                            <option value="active" ${exam.status === 'active' ? 'selected' : ''}>نشط</option>
                            <option value="closed" ${exam.status === 'closed' ? 'selected' : ''}>مغلق</option>
                        </select>
                    </div>
                    <div style="display:flex; gap:1rem; justify-content:flex-end; margin-top:1rem;">
                        <button type="button" class="btn" onclick="App.Components.Modal.hide()">إلغاء</button>
                        <button type="submit" class="btn btn--primary">حفظ</button>
                    </div>
                </form>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(isEdit ? 'تعديل اختبار' : 'إضافة اختبار جديد', html);
            }
        },
        
        save: function(id) {
            const data = {
                title: document.getElementById('exam-title').value,
                subjectId: document.getElementById('exam-subject').value,
                classId: document.getElementById('exam-class').value,
                durationMinutes: parseInt(document.getElementById('exam-duration').value, 10),
                maxGrade: parseInt(document.getElementById('exam-grade').value, 10),
                startDate: document.getElementById('exam-start').value,
                endDate: document.getElementById('exam-end').value,
                status: document.getElementById('exam-status').value
            };
            
            if (id) {
                this.update(id, data);
                if (App.Components && App.Components.Toast) App.Components.Toast.show('تم تحديث الاختبار بنجاح', 'success');
            } else {
                data.questions = [];
                this.create(data);
                if (App.Components && App.Components.Toast) App.Components.Toast.show('تم إنشاء الاختبار بنجاح', 'success');
            }
            
            if (App.Components && App.Components.Modal) App.Components.Modal.hide();
            if (currentContainerId) this.renderList(currentContainerId);
        },
        
        showQuestionsModal: function(examId) {
            const exam = this.getById(examId);
            if (!exam) return;
            
            const questions = exam.questions || [];
            
            let qHtml = '';
            if (questions.length === 0) {
                qHtml = '<div class="empty-state"><p>لا توجد أسئلة في هذا الاختبار</p></div>';
            } else {
                qHtml = '<div class="questions-list" style="max-height:300px; overflow-y:auto; margin-bottom:1rem;">';
                questions.forEach((q, idx) => {
                    qHtml += `
                        <div style="border:1px solid #ddd; padding:10px; margin-bottom:10px; border-radius:4px;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <strong>سؤال ${idx + 1}:</strong> ${q.text} <br>
                                    <small style="color:#666;">النوع: ${q.type === 'mcq' ? 'اختيار من متعدد' : 'صح أم خطأ'} | الدرجة: ${q.points}</small>
                                </div>
                                <button class="btn btn--sm btn--danger" onclick="App.Modules.Exams.deleteQuestion('${examId}', '${q.id}')">حذف</button>
                            </div>
                        </div>
                    `;
                });
                qHtml += '</div>';
            }
            
            const html = `
                ${qHtml}
                <hr>
                <h4 style="margin: 1rem 0;">إضافة سؤال جديد</h4>
                <form id="q-form" onsubmit="event.preventDefault(); App.Modules.Exams.addQuestion('${examId}')">
                    <div class="form-group">
                        <label>نص السؤال</label>
                        <input type="text" class="form-control" id="q-text" required>
                    </div>
                    <div class="form-row" style="display:flex; gap:1rem;">
                        <div class="form-group" style="flex:1;">
                            <label>النوع</label>
                            <select class="form-control" id="q-type" onchange="document.getElementById('mcq-options').style.display = this.value === 'mcq' ? 'block' : 'none'">
                                <option value="mcq">اختيار من متعدد</option>
                                <option value="true_false">صح أم خطأ</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex:1;">
                            <label>الدرجة</label>
                            <input type="number" class="form-control" id="q-points" value="1" required min="1">
                        </div>
                    </div>
                    
                    <div id="mcq-options">
                        <div class="form-group">
                            <label>الخيارات (مفصولة بفاصلة ,)</label>
                            <input type="text" class="form-control" id="q-options" placeholder="خيار 1, خيار 2, خيار 3, خيار 4">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>الإجابة الصحيحة (رقم الخيار 0-3 أو 0/1 لصح/خطأ)</label>
                        <input type="number" class="form-control" id="q-correct" required min="0">
                    </div>
                    
                    <button type="submit" class="btn btn--primary" style="width:100%; margin-top:1rem;">إضافة السؤال</button>
                </form>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show('أسئلة الاختبار: ' + exam.title, html);
            }
        },
        
        addQuestion: function(examId) {
            const exam = this.getById(examId);
            if (!exam) return;
            
            const qType = document.getElementById('q-type').value;
            let options = [];
            if (qType === 'mcq') {
                const optStr = document.getElementById('q-options').value;
                options = optStr.split(',').map(s => s.trim()).filter(s => s);
            } else {
                options = ['صح', 'خطأ'];
            }
            
            const newQ = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                text: document.getElementById('q-text').value,
                type: qType,
                options: options,
                correctAnswer: parseInt(document.getElementById('q-correct').value, 10),
                points: parseInt(document.getElementById('q-points').value, 10)
            };
            
            exam.questions = exam.questions || [];
            exam.questions.push(newQ);
            
            this.update(examId, { questions: exam.questions });
            if (App.Components && App.Components.Toast) App.Components.Toast.show('تمت إضافة السؤال بنجاح', 'success');
            
            // Re-render questions modal
            this.showQuestionsModal(examId);
            if (currentContainerId) this.renderList(currentContainerId);
        },
        
        deleteQuestion: function(examId, qId) {
            if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
            
            const exam = this.getById(examId);
            if (!exam || !exam.questions) return;
            
            exam.questions = exam.questions.filter(q => q.id !== qId);
            this.update(examId, { questions: exam.questions });
            
            if (App.Components && App.Components.Toast) App.Components.Toast.show('تم حذف السؤال بنجاح', 'success');
            this.showQuestionsModal(examId);
            if (currentContainerId) this.renderList(currentContainerId);
        },
        
        viewResults: function(examId) {
            const exam = this.getById(examId);
            if (!exam) return;
            
            let results = [];
            if (App.DB && App.DB.query) {
                results = App.DB.query('examResults', item => item.examId === examId);
            } else {
                results = JSON.parse(localStorage.getItem('examResults') || '[]').filter(item => item.examId === examId);
            }
            
            if (results.length === 0) {
                if (App.Components && App.Components.Modal) {
                    App.Components.Modal.show('نتائج الاختبار', '<div class="empty-state"><p>لا توجد نتائج مسجلة لهذا الاختبار حتى الآن</p></div>');
                }
                return;
            }
            
            let html = `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>اسم الطالب</th>
                                <th>الدرجة</th>
                                <th>النسبة</th>
                                <th>تاريخ التقديم</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            results.forEach(res => {
                let sName = res.studentId;
                if (App.DB && App.DB.getById) {
                    const student = App.DB.getById('students', res.studentId);
                    if (student && student.userId) {
                        const u = App.DB.getById('users', student.userId);
                        if (u) sName = u.name;
                    }
                }
                const percentage = Math.round((res.grade / (exam.maxGrade || 1)) * 100);
                
                html += `
                    <tr>
                        <td>${sName}</td>
                        <td>${res.grade} / ${exam.maxGrade}</td>
                        <td>${percentage}%</td>
                        <td>${new Date(res.submittedAt).toLocaleDateString('ar-SA')}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show('نتائج الاختبار: ' + exam.title, html);
            }
        }
    };
})();
