(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'attendance';
    let currentContainerId = null;
    let currentClassId = '';
    let currentSectionId = '';
    let currentDate = new Date().toISOString().split('T')[0];
    
    App.Modules.Attendance = {
        getAll: function() {
            if (App.DB && App.DB.getAll) return App.DB.getAll(collection);
            return JSON.parse(localStorage.getItem(collection) || '[]');
        },
        getById: function(id) {
            if (App.DB && App.DB.getById) return App.DB.getById(collection, id);
            return this.getAll().find(item => item.id === id);
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
            const index = all.findIndex(item => item.id === id);
            if (index !== -1) {
                all[index] = Object.assign({}, all[index], data);
                localStorage.setItem(collection, JSON.stringify(all));
                return all[index];
            }
            return null;
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
                if (App.DB && App.DB.delete) {
                    App.DB.delete(collection, id);
                } else {
                    const all = this.getAll().filter(item => item.id !== id);
                    localStorage.setItem(collection, JSON.stringify(all));
                }
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم حذف السجل بنجاح', 'success');
                }
                if (currentContainerId) {
                    this.renderList(currentContainerId);
                }
            }
        },
        initFilters: function() {
            const classSelect = document.getElementById('filter-class');
            const sectionSelect = document.getElementById('filter-section');
            const dateInput = document.getElementById('filter-date');
            
            if (classSelect && App.DB && App.DB.getAll) {
                const classes = App.DB.getAll('classes');
                classSelect.innerHTML = '<option value="">اختر الصف</option>' + classes.map(c => `<option value="${c.id}">${c.name || c.nameAr || c.id}</option>`).join('');
            }
            if (sectionSelect && App.DB && App.DB.getAll) {
                const sections = App.DB.getAll('sections');
                sectionSelect.innerHTML = '<option value="">اختر الشعبة (اختياري)</option>' + sections.map(s => `<option value="${s.id}">${s.name || s.nameAr || s.id}</option>`).join('');
            }
            if (dateInput) {
                dateInput.value = currentDate;
            }
            
            const btnSearch = document.getElementById('btn-search');
            if (btnSearch) {
                btnSearch.onclick = () => {
                    currentClassId = classSelect ? classSelect.value : '';
                    currentSectionId = sectionSelect ? sectionSelect.value : '';
                    currentDate = dateInput ? dateInput.value : currentDate;
                    this.renderList(currentContainerId);
                };
            }
        },
        getStats: function(classId, date) {
            const records = this.getAll().filter(r => r.classId === classId && r.date === date);
            return {
                total: records.length,
                present: records.filter(r => r.status === 'present').length,
                absent: records.filter(r => r.status === 'absent').length,
                late: records.filter(r => r.status === 'late').length,
                excused: records.filter(r => r.status === 'excused').length
            };
        },
        renderList: function(containerId) {
            currentContainerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;
            
            if (!currentClassId) {
                container.innerHTML = '<div style="text-align:center; padding: 40px; color: #666;"><p style="font-size: 1.1em; margin-bottom: 10px;">الرجاء اختيار الصف وتاريخ العرض</p><p style="font-size: 0.9em;">استخدم أدوات التصفية في الأعلى لعرض سجل الحضور</p></div>';
                return;
            }
            
            let students = [];
            if (App.DB && App.DB.getAll) {
                students = App.DB.getAll('students').filter(s => s.classId === currentClassId);
                if (currentSectionId) {
                    students = students.filter(s => s.sectionId === currentSectionId);
                }
            }
            
            if (students.length === 0) {
                container.innerHTML = '<p style="text-align:center; padding: 20px;">لا يوجد طلاب في هذا الصف/الشعبة.</p>';
                return;
            }
            
            const attendanceRecords = this.getAll().filter(r => r.classId === currentClassId && r.date === currentDate);
            
            let stats = this.getStats(currentClassId, currentDate);
            let hasRecords = attendanceRecords.length > 0;
            
            let html = `
                <div style="margin-bottom: 20px; display: flex; gap: 15px; background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 16px;">
                    <div style="flex: 1; text-align: center; border-left: 1px solid #ddd;"><strong>الإجمالي:</strong> ${students.length}</div>
                    <div style="flex: 1; text-align: center; border-left: 1px solid #ddd; color: #2e7d32;"><strong>حاضر:</strong> <span id="stat-present">${stats.present}</span></div>
                    <div style="flex: 1; text-align: center; border-left: 1px solid #ddd; color: #c62828;"><strong>غائب:</strong> <span id="stat-absent">${stats.absent}</span></div>
                    <div style="flex: 1; text-align: center; border-left: 1px solid #ddd; color: #f57f17;"><strong>متأخر:</strong> <span id="stat-late">${stats.late}</span></div>
                    <div style="flex: 1; text-align: center; color: #1565c0;"><strong>مستأذن:</strong> <span id="stat-excused">${stats.excused}</span></div>
                </div>
                
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الطالب</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الرقم</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center; width: 350px;">الحالة</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">ملاحظات</th>
                        </tr>
                    </thead>
                    <tbody id="attendance-tbody">
            `;
            
            students.forEach(student => {
                const record = attendanceRecords.find(r => r.studentId === student.id) || {};
                const status = record.status || (hasRecords ? '' : 'present');
                
                html += `
                    <tr data-student-id="${student.id}">
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${student.fullName || student.name || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${student.studentId || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                            <div style="display: flex; justify-content: center; gap: 15px; font-weight: bold;">
                                <label style="cursor: pointer; color: #2e7d32;"><input type="radio" name="status_${student.id}" value="present" ${status === 'present' ? 'checked' : ''}> حاضر</label>
                                <label style="cursor: pointer; color: #c62828;"><input type="radio" name="status_${student.id}" value="absent" ${status === 'absent' ? 'checked' : ''}> غائب</label>
                                <label style="cursor: pointer; color: #f57f17;"><input type="radio" name="status_${student.id}" value="late" ${status === 'late' ? 'checked' : ''}> متأخر</label>
                                <label style="cursor: pointer; color: #1565c0;"><input type="radio" name="status_${student.id}" value="excused" ${status === 'excused' ? 'checked' : ''}> مستأذن</label>
                            </div>
                        </td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            <input type="text" class="form-control" name="notes_${student.id}" value="${record.notes || ''}" placeholder="ملاحظات..." style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                        </td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
                <div style="margin-top: 20px; text-align: left; padding: 10px; background: #f0f0f0; border-radius: 4px;">
                    <button class="btn btn--primary" onclick="App.Modules.Attendance.saveAll()" style="padding: 10px 25px; font-size: 16px;">حفظ كل السجلات</button>
                </div>
            `;
            
            container.innerHTML = html;
        },
        saveAll: function() {
            const tbody = document.getElementById('attendance-tbody');
            if (!tbody) return;
            
            const rows = tbody.querySelectorAll('tr[data-student-id]');
            let successCount = 0;
            
            const currentUser = (App.Auth && App.Auth.getCurrentUser) ? App.Auth.getCurrentUser() : {id: 'system'};
            const existingRecords = this.getAll().filter(r => r.classId === currentClassId && r.date === currentDate);
            
            rows.forEach(row => {
                const studentId = row.getAttribute('data-student-id');
                const statusRadio = row.querySelector(`input[name="status_${studentId}"]:checked`);
                const notesInput = row.querySelector(`input[name="notes_${studentId}"]`);
                
                if (statusRadio) {
                    const status = statusRadio.value;
                    const notes = notesInput ? notesInput.value : '';
                    
                    const existingRecord = existingRecords.find(r => r.studentId === studentId);
                    
                    const data = {
                        studentId: studentId,
                        classId: currentClassId,
                        sectionId: currentSectionId,
                        date: currentDate,
                        status: status,
                        notes: notes,
                        recordedBy: currentUser.id
                    };
                    
                    if (existingRecord) {
                        this.update(existingRecord.id, data);
                    } else {
                        this.create(data);
                    }
                    successCount++;
                }
            });
            
            if (App.Components && App.Components.Toast) {
                App.Components.Toast.show(`تم حفظ حضور ${successCount} طالب بنجاح`, 'success');
            }
            
            this.renderList(currentContainerId);
        },
        showFormModal: function(id = null) {
            let record = id ? this.getById(id) : { date: new Date().toISOString().split('T')[0] };
            const title = id ? 'تعديل سجل حضور' : 'إضافة سجل حضور';
            
            let studentsOptions = '';
            let classesOptions = '';
            
            if (App.DB && App.DB.getAll) {
                const students = App.DB.getAll('students');
                students.forEach(s => {
                    const selected = (record.studentId === s.id) ? 'selected' : '';
                    studentsOptions += `<option value="${s.id}" ${selected}>${s.fullName || s.name || s.id}</option>`;
                });
                
                const classes = App.DB.getAll('classes');
                classes.forEach(c => {
                    const selected = (record.classId === c.id) ? 'selected' : '';
                    classesOptions += `<option value="${c.id}" ${selected}>${c.name || c.nameAr || c.id}</option>`;
                });
            }
            
            const contentHTML = `
                <form id="attendance-form" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="hidden" name="id" id="att-id" value="${record.id || ''}">
                    
                    <div class="form-group">
                        <label for="att-student">الطالب</label>
                        <select id="att-student" class="form-control" required style="width: 100%; padding: 8px;">
                            <option value="">اختر الطالب</option>
                            ${studentsOptions}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="att-class">الصف</label>
                        <select id="att-class" class="form-control" required style="width: 100%; padding: 8px;">
                            <option value="">اختر الصف</option>
                            ${classesOptions}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="att-date">التاريخ</label>
                        <input type="date" id="att-date" class="form-control" value="${record.date || ''}" required style="width: 100%; padding: 8px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="att-status">الحالة</label>
                        <select id="att-status" class="form-control" required style="width: 100%; padding: 8px;">
                            <option value="present" ${record.status === 'present' ? 'selected' : ''}>حاضر</option>
                            <option value="absent" ${record.status === 'absent' ? 'selected' : ''}>غائب</option>
                            <option value="late" ${record.status === 'late' ? 'selected' : ''}>متأخر</option>
                            <option value="excused" ${record.status === 'excused' ? 'selected' : ''}>مستأذن</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="att-notes">ملاحظات</label>
                        <input type="text" id="att-notes" class="form-control" value="${record.notes || ''}" style="width: 100%; padding: 8px;">
                    </div>
                    
                    <button type="submit" class="btn btn--primary" style="padding: 10px;">حفظ</button>
                </form>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(title, contentHTML);
                
                const form = document.getElementById('attendance-form');
                form.onsubmit = (e) => {
                    e.preventDefault();
                    
                    const currentUser = (App.Auth && App.Auth.getCurrentUser) ? App.Auth.getCurrentUser() : {id: 'system'};
                    
                    const data = {
                        studentId: document.getElementById('att-student').value,
                        classId: document.getElementById('att-class').value,
                        date: document.getElementById('att-date').value,
                        status: document.getElementById('att-status').value,
                        notes: document.getElementById('att-notes').value,
                        recordedBy: currentUser.id
                    };
                    const recordId = document.getElementById('att-id').value;
                    if (recordId) {
                        data.id = recordId;
                        this.update(data.id, data);
                    } else {
                        this.create(data);
                    }
                    
                    App.Components.Modal.hide();
                    if (App.Components.Toast) App.Components.Toast.show('تم الحفظ بنجاح', 'success');
                    if (currentContainerId) this.renderList(currentContainerId);
                };
            }
        },
        fastAttendance: function(barcode) {
            if (!barcode || !barcode.trim()) return false;
            barcode = barcode.trim();
            const students = (App.DB && App.DB.getAll) ? App.DB.getAll('students') : JSON.parse(localStorage.getItem('students') || '[]');
            const student = students.find(s => s.studentId === barcode || s.seatNumber === barcode || s.id === barcode);
            if (!student) {
                if (App.Components && App.Components.Toast) App.Components.Toast.show('طالب غير موجود', 'error');
                return false;
            }
            const date = new Date().toISOString().split('T')[0];
            const currentUser = (App.Auth && App.Auth.getCurrentUser) ? App.Auth.getCurrentUser() : {id: 'system'};
            const existingRecords = this.getAll().filter(r => r.date === date);
            const existingRecord = existingRecords.find(r => r.studentId === student.id);
            const data = {
                studentId: student.id,
                classId: student.classId,
                sectionId: student.sectionId,
                date: date,
                status: 'present',
                notes: '',
                recordedBy: currentUser.id
            };
            if (existingRecord) {
                this.update(existingRecord.id, data);
            } else {
                this.create(data);
            }
            if (App.Components && App.Components.Toast) {
                App.Components.Toast.show(`تم تحضير الطالب: ${student.fullName || student.name}`, 'success');
            }
            if (currentContainerId && currentClassId === student.classId && currentDate === date) {
                this.renderList(currentContainerId);
            }
            return true;
        },
        renderFastAttendanceUI: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = `
                <div class="card bg-light mb-4">
                    <div class="card__body text-center">
                        <h3 class="mb-3">التحضير السريع بالباركود / رقم الجلوس</h3>
                        <div style="max-width: 400px; margin: 0 auto; position: relative;">
                            <input type="text" id="barcode-input" class="form-control form-control--lg text-center" placeholder="مرر الباركود هنا أو اكتب رقم الجلوس..." style="font-size: 1.2rem; padding: 15px; border: 2px solid var(--primary-color);" autofocus>
                            <button class="btn btn--primary" id="btn-fast-attend" style="position: absolute; left: 5px; top: 5px; bottom: 5px;">تحضير</button>
                        </div>
                        <p class="text-secondary mt-2 text-sm">استخدم جهاز قارئ الباركود، أو اكتب الرقم واضغط Enter</p>
                    </div>
                </div>
            `;
            
            const input = document.getElementById('barcode-input');
            const btn = document.getElementById('btn-fast-attend');
            
            const handleAttend = () => {
                const val = input.value;
                if (val) {
                    this.fastAttendance(val);
                    input.value = '';
                    input.focus();
                }
            };
            
            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAttend();
                    }
                });
            }
            
            if (btn) {
                btn.addEventListener('click', handleAttend);
            }
        }
    };
})();
