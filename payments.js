(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    const collection = 'payments';
    let currentContainerId = null;
    let currentPayments = [];

    const feeTypes = {
        tuition: 'رسوم دراسية',
        registration: 'رسوم تسجيل',
        books: 'كتب',
        transport: 'نقل',
        other: 'أخرى'
    };

    const statusTypes = {
        paid: 'مدفوع',
        partial: 'جزئي',
        pending: 'معلق',
        overdue: 'متأخر'
    };

    App.Modules.Payments = {
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
            if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
                if (App.DB && App.DB.delete) {
                    App.DB.delete(collection, id);
                } else {
                    let all = this.getAll();
                    all = all.filter(item => item.id !== id);
                    localStorage.setItem(collection, JSON.stringify(all));
                }
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم حذف الدفعة بنجاح', 'success');
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

            let allPayments = this.getAll();
            currentPayments = allPayments;

            // Compute stats
            let totalAmount = 0;
            let totalPaid = 0;
            let totalRemaining = 0;

            allPayments.forEach(p => {
                totalAmount += parseFloat(p.amount) || 0;
                totalPaid += parseFloat(p.paidAmount) || 0;
                totalRemaining += parseFloat(p.remaining) || 0;
            });
            
            let collectionRate = totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : 0;

            const statsContainer = document.getElementById('payments-stats');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="stat-card">
                        <div class="stat-card__icon bg-primary text-white">💰</div>
                        <div class="stat-card__info">
                            <h3 class="stat-card__title">إجمالي الرسوم</h3>
                            <div class="stat-card__value">${App.Utils && App.Utils.formatCurrency ? App.Utils.formatCurrency(totalAmount) : totalAmount + ' د.أ'}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card__icon bg-success text-white">💵</div>
                        <div class="stat-card__info">
                            <h3 class="stat-card__title">المبالغ المحصلة</h3>
                            <div class="stat-card__value">${App.Utils && App.Utils.formatCurrency ? App.Utils.formatCurrency(totalPaid) : totalPaid + ' د.أ'}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card__icon bg-danger text-white">📉</div>
                        <div class="stat-card__info">
                            <h3 class="stat-card__title">المبالغ المتبقية</h3>
                            <div class="stat-card__value">${App.Utils && App.Utils.formatCurrency ? App.Utils.formatCurrency(totalRemaining) : totalRemaining + ' د.أ'}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card__icon bg-info text-white">📊</div>
                        <div class="stat-card__info">
                            <h3 class="stat-card__title">نسبة التحصيل</h3>
                            <div class="stat-card__value">%${collectionRate}</div>
                        </div>
                    </div>
                `;
            }

            // Controls HTML
            const controlsHTML = `
                <div class="flex flex-wrap gap-2 mb-4">
                    <input type="text" id="payments-search" class="form-control" placeholder="البحث باسم الطالب..." style="max-width: 250px;">
                    <select id="payments-status-filter" class="form-control" style="max-width: 150px;">
                        <option value="">جميع الحالات</option>
                        <option value="paid">مدفوع</option>
                        <option value="partial">جزئي</option>
                        <option value="pending">معلق</option>
                        <option value="overdue">متأخر</option>
                    </select>
                    <select id="payments-fee-filter" class="form-control" style="max-width: 150px;">
                        <option value="">جميع الرسوم</option>
                        <option value="tuition">رسوم دراسية</option>
                        <option value="registration">رسوم تسجيل</option>
                        <option value="books">كتب</option>
                        <option value="transport">نقل</option>
                        <option value="other">أخرى</option>
                    </select>
                </div>
                <div class="table-responsive">
                    <table class="data-table" id="payments-table">
                        <thead>
                            <tr>
                                <th>الطالب</th>
                                <th>نوع الرسوم</th>
                                <th>المبلغ</th>
                                <th>المدفوع</th>
                                <th>المتبقي</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = controlsHTML;
            
            this.renderTableData(allPayments);

            // Add event listeners for filters
            document.getElementById('payments-search').addEventListener('input', () => this.filterData());
            document.getElementById('payments-status-filter').addEventListener('change', () => this.filterData());
            document.getElementById('payments-fee-filter').addEventListener('change', () => this.filterData());
        },

        filterData: function() {
            const search = document.getElementById('payments-search').value.toLowerCase();
            const status = document.getElementById('payments-status-filter').value;
            const feeType = document.getElementById('payments-fee-filter').value;

            const allPayments = this.getAll();
            const students = (App.DB && App.DB.getAll) ? App.DB.getAll('students') : [];
            
            const filtered = allPayments.filter(p => {
                const student = students.find(s => s.id === p.studentId);
                const studentName = student ? (student.name + ' ' + student.nameEn).toLowerCase() : '';
                
                const matchSearch = studentName.includes(search);
                const matchStatus = status ? p.status === status : true;
                const matchFee = feeType ? p.feeType === feeType : true;
                
                return matchSearch && matchStatus && matchFee;
            });
            
            currentPayments = filtered;
            this.renderTableData(filtered);
        },

        renderTableData: function(payments) {
            const tbody = document.querySelector('#payments-table tbody');
            if (!tbody) return;

            if (payments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">لا توجد بيانات</td></tr>';
                return;
            }

            const students = (App.DB && App.DB.getAll) ? App.DB.getAll('students') : [];

            tbody.innerHTML = '';
            payments.forEach(p => {
                const student = students.find(s => s.id === p.studentId);
                const studentName = student ? student.name : 'طالب غير معروف';

                const tr = document.createElement('tr');
                
                let badgeClass = 'badge--secondary';
                if(p.status === 'paid') badgeClass = 'badge--success';
                else if(p.status === 'partial') badgeClass = 'badge--warning';
                else if(p.status === 'overdue') badgeClass = 'badge--danger';
                else if(p.status === 'pending') badgeClass = 'badge--info';

                tr.innerHTML = `
                    <td>${App.Utils && App.Utils.escapeHTML ? App.Utils.escapeHTML(studentName) : studentName}</td>
                    <td>${feeTypes[p.feeType] || p.feeType}</td>
                    <td>${p.amount}</td>
                    <td>${p.paidAmount}</td>
                    <td>${p.remaining}</td>
                    <td><span class="badge ${badgeClass}">${statusTypes[p.status] || p.status}</span></td>
                    <td>
                        <div class="flex gap-1">
                            <button class="btn btn--sm btn--info" onclick="App.Modules.Payments.printReceipt('${p.id}')">🖨️</button>
                            <button class="btn btn--sm btn--primary" onclick="App.Modules.Payments.showFormModal('${p.id}')">تعديل</button>
                            <button class="btn btn--sm btn--danger" onclick="App.Modules.Payments.delete('${p.id}')">حذف</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        },

        showFormModal: function(id) {
            let payment = {
                studentId: '',
                academicYear: new Date().getFullYear().toString(),
                feeType: 'tuition',
                description: '',
                amount: 0,
                paidAmount: 0,
                remaining: 0,
                dueDate: '',
                paymentDate: '',
                status: 'pending',
                receiptNumber: '',
                notes: ''
            };
            
            let isEdit = false;
            
            if (id) {
                const existing = this.getById(id);
                if (existing) {
                    payment = { ...existing };
                    isEdit = true;
                }
            }

            const students = (App.DB && App.DB.getAll) ? App.DB.getAll('students') : [];
            let studentOptions = '<option value="">اختر الطالب</option>';
            students.forEach(s => {
                studentOptions += `<option value="${s.id}" ${payment.studentId === s.id ? 'selected' : ''}>${s.name}</option>`;
            });

            const html = `
                <form id="payment-form" onsubmit="App.Modules.Payments.save(event, '${id || ''}')">
                    <div class="grid grid--2 gap-3 mb-3">
                        <div class="form-group">
                            <label class="form-label">الطالب <span class="text-danger">*</span></label>
                            <select name="studentId" class="form-control" required>
                                ${studentOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">نوع الرسوم <span class="text-danger">*</span></label>
                            <select name="feeType" class="form-control" required>
                                <option value="tuition" ${payment.feeType === 'tuition' ? 'selected' : ''}>رسوم دراسية</option>
                                <option value="registration" ${payment.feeType === 'registration' ? 'selected' : ''}>رسوم تسجيل</option>
                                <option value="books" ${payment.feeType === 'books' ? 'selected' : ''}>كتب</option>
                                <option value="transport" ${payment.feeType === 'transport' ? 'selected' : ''}>نقل</option>
                                <option value="other" ${payment.feeType === 'other' ? 'selected' : ''}>أخرى</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">المبلغ الكلي <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" name="amount" class="form-control" value="${payment.amount}" required id="payment-amount" oninput="App.Modules.Payments.calcRemaining()">
                        </div>
                        <div class="form-group">
                            <label class="form-label">المدفوع <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" name="paidAmount" class="form-control" value="${payment.paidAmount}" required id="payment-paid" oninput="App.Modules.Payments.calcRemaining()">
                        </div>
                        <div class="form-group">
                            <label class="form-label">المتبقي</label>
                            <input type="number" step="0.01" name="remaining" class="form-control bg-light" value="${payment.remaining}" readonly id="payment-remaining">
                        </div>
                        <div class="form-group">
                            <label class="form-label">تاريخ الاستحقاق</label>
                            <input type="date" name="dueDate" class="form-control" value="${payment.dueDate}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">تاريخ الدفع</label>
                            <input type="date" name="paymentDate" class="form-control" value="${payment.paymentDate}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">الحالة <span class="text-danger">*</span></label>
                            <select name="status" class="form-control" required>
                                <option value="paid" ${payment.status === 'paid' ? 'selected' : ''}>مدفوع</option>
                                <option value="partial" ${payment.status === 'partial' ? 'selected' : ''}>جزئي</option>
                                <option value="pending" ${payment.status === 'pending' ? 'selected' : ''}>معلق</option>
                                <option value="overdue" ${payment.status === 'overdue' ? 'selected' : ''}>متأخر</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">رقم الإيصال</label>
                            <input type="text" name="receiptNumber" class="form-control" value="${payment.receiptNumber || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">السنة الدراسية</label>
                            <input type="text" name="academicYear" class="form-control" value="${payment.academicYear}" required>
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">الوصف</label>
                        <input type="text" name="description" class="form-control" value="${payment.description || ''}">
                    </div>
                    <div class="form-group mb-4">
                        <label class="form-label">ملاحظات</label>
                        <textarea name="notes" class="form-control" rows="2">${payment.notes || ''}</textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button type="button" class="btn btn--ghost" onclick="App.Components.Modal.hide()">إلغاء</button>
                        <button type="submit" class="btn btn--primary">حفظ</button>
                    </div>
                </form>
            `;

            if (App.Components && App.Components.Modal) {
                App.Components.Modal.show(isEdit ? 'تعديل دفعة' : 'إضافة دفعة', html);
            }
        },

        calcRemaining: function() {
            const amountInput = document.getElementById('payment-amount');
            const paidInput = document.getElementById('payment-paid');
            const remainingInput = document.getElementById('payment-remaining');
            
            if (amountInput && paidInput && remainingInput) {
                const amount = parseFloat(amountInput.value) || 0;
                const paid = parseFloat(paidInput.value) || 0;
                remainingInput.value = (amount - paid).toFixed(2);
            }
        },

        save: function(event, id) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            data.amount = parseFloat(data.amount) || 0;
            data.paidAmount = parseFloat(data.paidAmount) || 0;
            data.remaining = parseFloat(data.remaining) || 0;

            if (id) {
                this.update(id, data);
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم تحديث الدفعة بنجاح', 'success');
                }
            } else {
                this.create(data);
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('تم إضافة الدفعة بنجاح', 'success');
                }
            }

            if (App.Components && App.Components.Modal) {
                App.Components.Modal.hide();
            }

            if (currentContainerId) {
                this.renderList(currentContainerId);
            }
        },

        exportCSV: function() {
            if (!currentPayments || currentPayments.length === 0) {
                if (App.Components && App.Components.Toast) {
                    App.Components.Toast.show('لا توجد بيانات للتصدير', 'warning');
                }
                return;
            }

            const students = (App.DB && App.DB.getAll) ? App.DB.getAll('students') : [];
            
            let csv = "الطالب,نوع الرسوم,المبلغ,المدفوع,المتبقي,تاريخ الاستحقاق,تاريخ الدفع,الحالة,رقم الإيصال,ملاحظات\n";
            
            currentPayments.forEach(p => {
                const student = students.find(s => s.id === p.studentId);
                const studentName = student ? student.name : 'غير معروف';
                const fType = feeTypes[p.feeType] || p.feeType;
                const pStatus = statusTypes[p.status] || p.status;
                const notes = (p.notes || '').replace(/,/g, ' ');

                csv += `${studentName},${fType},${p.amount},${p.paidAmount},${p.remaining},${p.dueDate || ''},${p.paymentDate || ''},${pStatus},${p.receiptNumber || ''},${notes}\n`;
            });

            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "المدفوعات.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        printReceipt: function(id) {
            const payment = this.getById(id);
            if (!payment) return;
            
            const students = (App.DB && App.DB.getAll) ? App.DB.getAll('students') : [];
            const student = students.find(s => s.id === payment.studentId);
            const studentName = student ? student.name : 'غير معروف';

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html dir="rtl" lang="ar">
                <head>
                    <title>إيصال دفع - ${payment.receiptNumber || id}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; }
                        .receipt { border: 1px solid #ccc; padding: 20px; max-width: 600px; margin: 0 auto; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                        .label { font-weight: bold; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                        @media print {
                            button { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <h2>المدرسة الوطنية النموذجية</h2>
                            <h3>إيصال دفع</h3>
                            <p>رقم الإيصال: ${payment.receiptNumber || id}</p>
                        </div>
                        <div class="row">
                            <span class="label">تاريخ الدفع:</span>
                            <span>${payment.paymentDate || new Date().toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div class="row">
                            <span class="label">اسم الطالب:</span>
                            <span>${studentName}</span>
                        </div>
                        <div class="row">
                            <span class="label">نوع الرسوم:</span>
                            <span>${feeTypes[payment.feeType] || payment.feeType}</span>
                        </div>
                        <div class="row">
                            <span class="label">المبلغ المدفوع:</span>
                            <span>${payment.paidAmount} د.أ</span>
                        </div>
                        <div class="row">
                            <span class="label">المبلغ المتبقي:</span>
                            <span>${payment.remaining} د.أ</span>
                        </div>
                        <div class="row">
                            <span class="label">ملاحظات:</span>
                            <span>${payment.notes || '-'}</span>
                        </div>
                        <div class="footer">
                            <p>نشكر لكم ثقتكم بنا</p>
                            <button onclick="window.print()">طباعة الإيصال</button>
                        </div>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };
})();
