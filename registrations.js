(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'registrations';
    let currentContainerId = null;
    let currentFilter = 'all'; // all, pending, approved, rejected
    
    App.Modules.Registrations = {
        getAll: function() {
            if (App.DB && App.DB.getAll) return App.DB.getAll(collection);
            return JSON.parse(localStorage.getItem(collection) || '[]');
        },
        getById: function(id) {
            if (App.DB && App.DB.getById) return App.DB.getById(collection, id);
            return this.getAll().find(item => item.id === id);
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
            if (confirm('هل أنت متأكد من حذف طلب التسجيل هذا؟')) {
                if (App.DB && App.DB.delete) {
                    App.DB.delete(collection, id);
                } else {
                    const all = this.getAll().filter(item => item.id !== id);
                    localStorage.setItem(collection, JSON.stringify(all));
                }
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم حذف الطلب بنجاح', 'success');
                }
                if (currentContainerId) {
                    this.renderList(currentContainerId);
                }
            }
        },
        
        getStatusBadge: function(status) {
            switch(status) {
                case 'approved': return '<span class="badge badge--success">مقبول</span>';
                case 'pending': return '<span class="badge badge--warning">معلق</span>';
                case 'rejected': return '<span class="badge badge--danger">مرفوض</span>';
                default: return '<span class="badge">غير معروف</span>';
            }
        },
        
        getClassName: function(classId) {
            if (!classId) return '-';
            if (App.DB && App.DB.getById) {
                const c = App.DB.getById('classes', classId);
                return c ? c.name : classId;
            }
            return classId;
        },
        
        setFilter: function(filter) {
            currentFilter = filter;
            if (currentContainerId) {
                this.renderList(currentContainerId);
            }
        },
        
        renderList: function(containerId) {
            currentContainerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;
            
            let regs = this.getAll();
            if (currentFilter !== 'all') {
                regs = regs.filter(r => r.status === currentFilter);
            }
            
            let html = `
                <div style="margin-bottom: 1.5rem; display: flex; gap: 0.5rem;">
                    <button class="btn ${currentFilter === 'all' ? 'btn--primary' : ''}" onclick="App.Modules.Registrations.setFilter('all')">الكل</button>
                    <button class="btn ${currentFilter === 'pending' ? 'btn--primary' : ''}" onclick="App.Modules.Registrations.setFilter('pending')">بانتظار المراجعة</button>
                    <button class="btn ${currentFilter === 'approved' ? 'btn--primary' : ''}" onclick="App.Modules.Registrations.setFilter('approved')">مقبول</button>
                    <button class="btn ${currentFilter === 'rejected' ? 'btn--primary' : ''}" onclick="App.Modules.Registrations.setFilter('rejected')">مرفوض</button>
                </div>
            `;
            
            if (regs.length === 0) {
                html += '<div class="empty-state"><p>لا توجد طلبات تسجيل لعرضها</p></div>';
                container.innerHTML = html;
                return;
            }
            
            html += `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>رقم الطلب</th>
                                <th>اسم الطالب</th>
                                <th>تاريخ التقديم</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            regs.forEach(reg => {
                let sName = '';
                if (reg.studentData) {
                    sName = [reg.studentData.firstName, reg.studentData.fatherName, reg.studentData.familyName].filter(Boolean).join(' ');
                }
                
                const date = reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString('ar-SA') : '-';
                
                html += `
                    <tr>
                        <td>${reg.regNumber || '-'}</td>
                        <td>${sName}</td>
                        <td>${date}</td>
                        <td>${this.getStatusBadge(reg.status)}</td>
                        <td>
                            <button class="btn btn--sm" onclick="App.Modules.Registrations.showDetailsModal('${reg.id}')" style="background-color: #17a2b8; color: white;">عرض التفاصيل</button>
                            ${reg.status === 'pending' ? `
                                <button class="btn btn--sm btn--primary" onclick="App.Modules.Registrations.approve('${reg.id}')">قبول</button>
                                <button class="btn btn--sm btn--danger" onclick="App.Modules.Registrations.reject('${reg.id}')">رفض</button>
                            ` : ''}
                            <button class="btn btn--sm btn--danger" onclick="App.Modules.Registrations.delete('${reg.id}')">حذف</button>
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
        
        showDetailsModal: function(id) {
            const reg = this.getById(id);
            if (!reg) return;
            
            let sName = '';
            if (reg.studentData) {
                sName = [reg.studentData.firstName, reg.studentData.fatherName, reg.studentData.familyName].filter(Boolean).join(' ');
            }
            
            let html = `
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    
                    <!-- Student Data -->
                    <div style="border:1px solid #ddd; padding:15px; border-radius:5px;">
                        <h4 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">بيانات الطالب</h4>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                            <div><strong>الاسم الكامل:</strong> ${sName}</div>
                            <div><strong>تاريخ الميلاد:</strong> ${reg.studentData?.dob || '-'}</div>
                            <div><strong>الجنس:</strong> ${reg.studentData?.gender === 'female' ? 'أنثى' : (reg.studentData?.gender === 'male' ? 'ذكر' : '-')}</div>
                            <div><strong>رقم الجوال:</strong> ${reg.studentData?.phone || '-'}</div>
                        </div>
                    </div>
                    
                    <!-- Academic Data -->
                    <div style="border:1px solid #ddd; padding:15px; border-radius:5px;">
                        <h4 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">البيانات الأكاديمية</h4>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                            <div><strong>الصف المطلوب:</strong> ${this.getClassName(reg.academicData?.classId)}</div>
                            <div><strong>المدرسة السابقة:</strong> ${reg.academicData?.previousSchool || '-'}</div>
                        </div>
                    </div>
                    
                    <!-- Parent Data -->
                    <div style="border:1px solid #ddd; padding:15px; border-radius:5px;">
                        <h4 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">بيانات ولي الأمر</h4>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                            <div><strong>الاسم:</strong> ${reg.parentData?.name || '-'}</div>
                            <div><strong>صلة القرابة:</strong> ${reg.parentData?.relation || '-'}</div>
                            <div><strong>رقم الجوال:</strong> ${reg.parentData?.phone || '-'}</div>
                            <div><strong>المهنة:</strong> ${reg.parentData?.occupation || '-'}</div>
                        </div>
                    </div>
                    
                    <!-- Documents -->
                    <div style="border:1px solid #ddd; padding:15px; border-radius:5px;">
                        <h4 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">المستندات المرفقة</h4>
                        <ul style="padding-right:20px; margin-top:10px;">
                            ${(reg.documents && reg.documents.length > 0) ? 
                                reg.documents.map(doc => `<li>${doc.name || 'مستند'} <a href="${doc.url}" target="_blank" style="color:#0056b3; font-size:0.9em; text-decoration:underline;">عرض</a></li>`).join('') :
                                '<li>لا توجد مستندات مرفقة</li>'
                            }
                        </ul>
                    </div>
                    
                    <!-- Rejection Reason if any -->
                    ${reg.status === 'rejected' && reg.rejectionReason ? `
                        <div style="background-color:#ffeeba; color:#856404; padding:15px; border-radius:5px;">
                            <strong>سبب الرفض:</strong> ${reg.rejectionReason}
                        </div>
                    ` : ''}
            `;
            
            // Actions
            if (reg.status === 'pending') {
                html += `
                    <div style="display:flex; gap:1rem; justify-content:flex-end; margin-top:10px;">
                        <button class="btn btn--danger" onclick="App.Modules.Registrations.reject('${reg.id}')">رفض الطلب</button>
                        <button class="btn btn--primary" onclick="App.Modules.Registrations.approve('${reg.id}')">قبول الطلب</button>
                    </div>
                `;
            } else {
                html += `
                    <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                        <button class="btn" onclick="App.Components.Modal.hide()">إغلاق</button>
                    </div>
                `;
            }
            
            html += `</div>`;
            
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(`تفاصيل طلب التسجيل (${reg.regNumber || reg.id})`, html);
            }
        },
        
        approve: function(id) {
            if (!confirm('هل أنت متأكد من قبول هذا الطلب؟ سيتم تحويل الطالب إلى النظام.')) return;
            
            const currentUser = App.Auth && App.Auth.getCurrentUser ? App.Auth.getCurrentUser() : { id: 'admin' };
            
            this.update(id, { 
                status: 'approved',
                reviewedBy: currentUser.id,
                reviewedAt: new Date().toISOString()
            });
            
            if (App.Components && App.Components.Toast) App.Components.Toast.show('تم قبول الطلب بنجاح', 'success');
            if (App.Components && App.Components.Modal) App.Components.Modal.hide();
            if (currentContainerId) this.renderList(currentContainerId);
        },
        
        reject: function(id) {
            const html = `
                <form onsubmit="event.preventDefault(); App.Modules.Registrations.confirmReject('${id}')">
                    <div class="form-group">
                        <label>سبب الرفض</label>
                        <textarea class="form-control" id="reject-reason" rows="3" required></textarea>
                    </div>
                    <div style="display:flex; gap:1rem; justify-content:flex-end; margin-top:1rem;">
                        <button type="button" class="btn" onclick="App.Components.Modal.hide()">إلغاء</button>
                        <button type="submit" class="btn btn--danger">تأكيد الرفض</button>
                    </div>
                </form>
            `;
            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show('رفض طلب التسجيل', html);
            }
        },
        
        confirmReject: function(id) {
            const reason = document.getElementById('reject-reason').value;
            const currentUser = App.Auth && App.Auth.getCurrentUser ? App.Auth.getCurrentUser() : { id: 'admin' };
            
            this.update(id, {
                status: 'rejected',
                rejectionReason: reason,
                reviewedBy: currentUser.id,
                reviewedAt: new Date().toISOString()
            });
            
            if (App.Components && App.Components.Toast) App.Components.Toast.show('تم رفض الطلب', 'success');
            if (App.Components && App.Components.Modal) App.Components.Modal.hide();
            if (currentContainerId) this.renderList(currentContainerId);
        }
    };
})();
