(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'students';
    let currentContainerId = null;
    
    App.Modules.Students = {
        getAll: function() {
            if (App.DB && App.DB.getAll) return App.DB.getAll(collection);
            return JSON.parse(localStorage.getItem(collection) || '[]');
        },
        getById: function(id) {
            if (App.DB && App.DB.getById) return App.DB.getById(collection, id);
            return this.getAll().find(s => s.id === id);
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
            const index = all.findIndex(s => s.id === id);
            if (index !== -1) {
                all[index] = Object.assign({}, all[index], data);
                localStorage.setItem(collection, JSON.stringify(all));
                return all[index];
            }
            return null;
        },
        delete: function(id) {
            if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
                try {
                    if (App.DB && App.DB.delete) {
                        App.DB.delete(collection, id);
                    } else {
                        const all = this.getAll().filter(s => s.id !== id);
                        localStorage.setItem(collection, JSON.stringify(all));
                    }
                    if (App.Components && App.Components.Toast) {
                        App.Components.Toast.show('تم حذف الطالب بنجاح', 'success');
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
            const students = this.getAll();
            
            if (students.length === 0) {
                container.innerHTML = '<p style="text-align:center; padding: 20px;">لا يوجد طلاب حالياً.</p>';
                return;
            }
            
            let html = `
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الاسم</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">رقم الطالب</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الصف</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الحالة</th>
                            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            students.forEach(student => {
                let className = student.classId;
                if (App.DB && App.DB.getById && student.classId) {
                    const cls = App.DB.getById('classes', student.classId);
                    if (cls) className = cls.name || cls.nameAr || student.classId;
                }
                
                html += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${student.fullName || student.name || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${student.studentId || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${className || ''}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${student.status || 'نشط'}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            <button onclick="App.Modules.Students.showFormModal('${student.id}')" class="btn btn--primary btn--sm">تعديل</button>
                            <button onclick="App.Modules.Students.delete('${student.id}')" class="btn btn--danger btn--sm" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">حذف</button>
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
            let student = id ? this.getById(id) : {};
            const title = id ? 'تعديل طالب' : 'إضافة طالب جديد';
            
            let classesOptions = '';
            if (App.DB && App.DB.getAll) {
                const classes = App.DB.getAll('classes');
                classes.forEach(c => {
                    const selected = (student.classId === c.id) ? 'selected' : '';
                    const cName = c.name || c.nameAr || c.id;
                    classesOptions += `<option value="${c.id}" ${selected}>${cName}</option>`;
                });
            }
            
            const contentHTML = `
                <form id="student-form" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="hidden" name="id" id="student-id" value="${student.id || ''}">
                    
                    <div class="form-group">
                        <label for="student-fullName">اسم الطالب</label>
                        <input type="text" id="student-fullName" name="fullName" class="form-control" value="${student.fullName || student.name || ''}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="student-studentId">رقم الطالب (الرقم الجامعي/المدرسي)</label>
                        <input type="text" id="student-studentId" name="studentId" class="form-control" value="${student.studentId || ''}" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="student-classId">الصف</label>
                        <select id="student-classId" name="classId" class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="">اختر الصف</option>
                            ${classesOptions}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="student-sectionId">الشعبة</label>
                        <input type="text" id="student-sectionId" name="sectionId" class="form-control" value="${student.sectionId || ''}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="student-phone">رقم الهاتف</label>
                        <input type="text" id="student-phone" name="phone" class="form-control" value="${student.phone || ''}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="student-email">البريد الإلكتروني</label>
                        <input type="email" id="student-email" name="email" class="form-control" value="${student.email || ''}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="student-gender">الجنس</label>
                        <select id="student-gender" name="gender" class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="male" ${student.gender === 'male' ? 'selected' : ''}>ذكر</option>
                            <option value="female" ${student.gender === 'female' ? 'selected' : ''}>أنثى</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="student-dob">تاريخ الميلاد</label>
                        <input type="date" id="student-dob" name="dob" class="form-control" value="${student.dob || ''}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label for="student-status">الحالة</label>
                        <select id="student-status" name="status" class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="نشط" ${student.status === 'نشط' ? 'selected' : ''}>نشط</option>
                            <option value="غير نشط" ${student.status === 'غير نشط' ? 'selected' : ''}>غير نشط</option>
                            <option value="موقوف" ${student.status === 'موقوف' ? 'selected' : ''}>موقوف</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn--primary" style="padding: 10px; border: none; border-radius: 4px; cursor: pointer; background: #2196f3; color: white;">حفظ</button>
                </form>
            `;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(title, contentHTML);
                
                const form = document.getElementById('student-form');
                form.onsubmit = (e) => {
                    e.preventDefault();
                    const data = {
                        fullName: document.getElementById('student-fullName').value,
                        studentId: document.getElementById('student-studentId').value,
                        classId: document.getElementById('student-classId').value,
                        sectionId: document.getElementById('student-sectionId').value,
                        phone: document.getElementById('student-phone').value,
                        email: document.getElementById('student-email').value,
                        gender: document.getElementById('student-gender').value,
                        dob: document.getElementById('student-dob').value,
                        status: document.getElementById('student-status').value
                    };
                    const recordId = document.getElementById('student-id').value;
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
                    App.Components.Toast.show('تم حفظ بيانات الطالب بنجاح', 'success');
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
