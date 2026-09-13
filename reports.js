(function() {
    'use strict';
    const App = window.App = window.App || {};
    App.Modules = App.Modules || {};
    
    let currentReportData = null;
    let currentReportType = null;
    
    App.Modules.Reports = {
        renderList: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = `
                <div class="reports-header mb-4">
                    <h2>التقارير والإحصائيات</h2>
                </div>
                <div class="report-types grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div class="card p-4 cursor-pointer hover-bg-light" onclick="App.Modules.Reports.selectReport('students')">
                        <h3>تقرير الطلاب</h3>
                        <p class="text-sm text-gray">توزيع الطلاب، نشط/غير نشط</p>
                    </div>
                    <div class="card p-4 cursor-pointer hover-bg-light" onclick="App.Modules.Reports.selectReport('grades')">
                        <h3>تقرير الدرجات</h3>
                        <p class="text-sm text-gray">متوسط الدرجات، نسب النجاح</p>
                    </div>
                    <div class="card p-4 cursor-pointer hover-bg-light" onclick="App.Modules.Reports.selectReport('attendance')">
                        <h3>تقرير الحضور</h3>
                        <p class="text-sm text-gray">نسب الحضور والغياب</p>
                    </div>
                    <div class="card p-4 cursor-pointer hover-bg-light" onclick="App.Modules.Reports.selectReport('financial')">
                        <h3>تقرير المالية</h3>
                        <p class="text-sm text-gray">الرسوم، التحصيل، المتأخرات</p>
                    </div>
                </div>
                <div id="report-filters" class="card p-4 mb-4" style="display: none;">
                    <!-- Filters will be injected here -->
                </div>
                <div id="report-actions" class="mb-4 flex gap-2" style="display: none;">
                    <button class="btn btn--primary" onclick="App.Modules.Reports.exportReport()">تصدير CSV</button>
                    <button class="btn btn--secondary" onclick="App.Modules.Reports.printReport()">طباعة</button>
                </div>
                <div id="report-results" class="card p-4" style="display: none;">
                    <!-- Results will be injected here -->
                </div>
            `;
        },
        
        selectReport: function(type) {
            currentReportType = type;
            const filtersContainer = document.getElementById('report-filters');
            filtersContainer.style.display = 'block';
            document.getElementById('report-results').style.display = 'none';
            document.getElementById('report-actions').style.display = 'none';
            
            let filtersHtml = '<div class="flex gap-4 align-end">';
            
            if (type === 'students') {
                filtersHtml += `
                    <div class="form-group flex-1">
                        <label>الصف</label>
                        <select id="filter-class" class="form-control">
                            <option value="">الكل</option>
                            ${(App.DB && App.DB.getAll ? App.DB.getAll('classes') : JSON.parse(localStorage.getItem('classes')||'[]')).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (type === 'grades') {
                filtersHtml += `
                    <div class="form-group flex-1">
                        <label>المادة</label>
                        <select id="filter-subject" class="form-control">
                            <option value="">الكل</option>
                            ${(App.DB && App.DB.getAll ? App.DB.getAll('subjects') : JSON.parse(localStorage.getItem('subjects')||'[]')).map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (type === 'attendance') {
                filtersHtml += `
                    <div class="form-group flex-1">
                        <label>من تاريخ</label>
                        <input type="date" id="filter-date-from" class="form-control">
                    </div>
                    <div class="form-group flex-1">
                        <label>إلى تاريخ</label>
                        <input type="date" id="filter-date-to" class="form-control">
                    </div>
                `;
            } else if (type === 'financial') {
                filtersHtml += `
                    <div class="form-group flex-1">
                        <label>السنة الدراسية</label>
                        <select id="filter-year" class="form-control">
                            <option value="2023-2024">2023-2024</option>
                            <option value="2024-2025" selected>2024-2025</option>
                        </select>
                    </div>
                `;
            }
            
            filtersHtml += `
                <div class="form-group">
                    <button class="btn btn--primary" onclick="App.Modules.Reports.generateReport()">توليد التقرير</button>
                </div>
            </div>`;
            
            filtersContainer.innerHTML = filtersHtml;
        },
        
        generateReport: function() {
            let data = {};
            
            if (currentReportType === 'students') {
                const classId = document.getElementById('filter-class').value;
                data = this.generateStudentReport({ classId });
            } else if (currentReportType === 'grades') {
                const subjectId = document.getElementById('filter-subject').value;
                data = this.generateGradeReport({ subjectId });
            } else if (currentReportType === 'attendance') {
                const dateFrom = document.getElementById('filter-date-from').value;
                const dateTo = document.getElementById('filter-date-to').value;
                data = this.generateAttendanceReport({ dateFrom, dateTo });
            } else if (currentReportType === 'financial') {
                const year = document.getElementById('filter-year').value;
                data = this.generateFinancialReport({ year });
            }
            
            currentReportData = data;
            this.renderReportResults(data);
        },
        
        generateStudentReport: function(filters) {
            let students = App.DB && App.DB.getAll ? App.DB.getAll('students') : JSON.parse(localStorage.getItem('students')||'[]');
            if (filters.classId) {
                students = students.filter(s => s.classId === filters.classId);
            }
            
            const total = students.length;
            const males = students.filter(s => s.gender === 'male' || s.gender === 'ذكر').length;
            const females = total - males;
            const active = students.filter(s => s.status === 'active' || s.status === 'نشط' || !s.status).length;
            const inactive = total - active;
            
            const classes = App.DB && App.DB.getAll ? App.DB.getAll('classes') : JSON.parse(localStorage.getItem('classes')||'[]');
            const perClass = classes.map(c => {
                return {
                    name: c.name,
                    count: students.filter(s => s.classId === c.id).length
                };
            }).filter(c => c.count > 0);
            
            return {
                title: 'تقرير الطلاب',
                summary: [
                    { label: 'إجمالي الطلاب', value: total },
                    { label: 'ذكور', value: males },
                    { label: 'إناث', value: females },
                    { label: 'نشط', value: active },
                    { label: 'غير نشط', value: inactive }
                ],
                table: {
                    headers: ['الصف', 'العدد'],
                    rows: perClass.map(c => [c.name, c.count])
                }
            };
        },
        
        generateGradeReport: function(filters) {
            let grades = App.DB && App.DB.getAll ? App.DB.getAll('grades') : JSON.parse(localStorage.getItem('grades')||'[]');
            if (filters.subjectId) {
                grades = grades.filter(g => g.subjectId === filters.subjectId);
            }
            
            const totalGrades = grades.length;
            const passed = grades.filter(g => (g.score / g.maxScore) >= 0.5).length;
            const passRate = totalGrades > 0 ? ((passed / totalGrades) * 100).toFixed(1) + '%' : '0%';
            
            const sum = grades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0);
            const avg = totalGrades > 0 ? (sum / totalGrades).toFixed(1) + '%' : '0%';
            
            const topGrades = [...grades].sort((a, b) => (b.score/b.maxScore) - (a.score/a.maxScore)).slice(0, 5);
            
            return {
                title: 'تقرير الدرجات',
                summary: [
                    { label: 'إجمالي التقييمات', value: totalGrades },
                    { label: 'متوسط الدرجات', value: avg },
                    { label: 'نسبة النجاح', value: passRate }
                ],
                table: {
                    headers: ['الطالب', 'المادة', 'الدرجة'],
                    rows: topGrades.map(g => {
                        const student = App.DB && App.DB.getById ? App.DB.getById('students', g.studentId) : null;
                        const subject = App.DB && App.DB.getById ? App.DB.getById('subjects', g.subjectId) : null;
                        return [
                            student ? student.name : 'غير معروف',
                            subject ? subject.name : 'غير معروف',
                            `${g.score} / ${g.maxScore}`
                        ];
                    })
                }
            };
        },
        
        generateAttendanceReport: function(filters) {
            let attendance = App.DB && App.DB.getAll ? App.DB.getAll('attendance') : JSON.parse(localStorage.getItem('attendance')||'[]');
            if (filters.dateFrom) attendance = attendance.filter(a => a.date >= filters.dateFrom);
            if (filters.dateTo) attendance = attendance.filter(a => a.date <= filters.dateTo);
            
            const total = attendance.length;
            const present = attendance.filter(a => a.status === 'present' || a.status === 'حاضر').length;
            const absent = attendance.filter(a => a.status === 'absent' || a.status === 'غائب').length;
            const late = attendance.filter(a => a.status === 'late' || a.status === 'متأخر').length;
            
            const presentRate = total > 0 ? ((present / total) * 100).toFixed(1) + '%' : '0%';
            
            const absentByStudent = {};
            attendance.filter(a => a.status === 'absent' || a.status === 'غائب').forEach(a => {
                absentByStudent[a.studentId] = (absentByStudent[a.studentId] || 0) + 1;
            });
            
            const mostAbsent = Object.entries(absentByStudent)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([id, count]) => {
                    const student = App.DB && App.DB.getById ? App.DB.getById('students', id) : null;
                    return [student ? student.name : 'غير معروف', count];
                });
            
            return {
                title: 'تقرير الحضور',
                summary: [
                    { label: 'إجمالي السجلات', value: total },
                    { label: 'نسبة الحضور', value: presentRate },
                    { label: 'حالات الغياب', value: absent },
                    { label: 'حالات التأخير', value: late }
                ],
                table: {
                    headers: ['الطالب', 'عدد أيام الغياب'],
                    rows: mostAbsent
                }
            };
        },
        
        generateFinancialReport: function(filters) {
            const payments = App.DB && App.DB.getAll ? App.DB.getAll('payments') : JSON.parse(localStorage.getItem('payments')||'[]');
            const totalFees = 500000; // Mock total
            const collected = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
            const overdue = totalFees - collected;
            const collectionRate = ((collected / totalFees) * 100).toFixed(1) + '%';
            
            const formatCurr = App.Utils && App.Utils.formatCurrency ? App.Utils.formatCurrency : (val) => val + ' ريال';
            
            const recentPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
            
            return {
                title: 'تقرير المالية',
                summary: [
                    { label: 'إجمالي الرسوم المتوقعة', value: formatCurr(totalFees) },
                    { label: 'المحصل', value: formatCurr(collected) },
                    { label: 'المتأخرات', value: formatCurr(overdue > 0 ? overdue : 0) },
                    { label: 'نسبة التحصيل', value: collectionRate }
                ],
                table: {
                    headers: ['التاريخ', 'الطالب', 'المبلغ', 'البيان'],
                    rows: recentPayments.map(p => {
                        const student = App.DB && App.DB.getById ? App.DB.getById('students', p.studentId) : null;
                        return [
                            p.date,
                            student ? student.name : 'غير معروف',
                            formatCurr(p.amount),
                            p.description || 'رسوم'
                        ];
                    })
                }
            };
        },
        
        renderReportResults: function(data) {
            const resultsContainer = document.getElementById('report-results');
            document.getElementById('report-actions').style.display = 'flex';
            resultsContainer.style.display = 'block';
            
            let html = `
                <h3 class="mb-4">${data.title}</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    ${data.summary.map(s => `
                        <div class="bg-light p-3 rounded text-center" style="border: 1px solid #ddd; background: #f9f9f9;">
                            <div class="text-sm text-gray mb-1" style="color: #666;">${s.label}</div>
                            <div class="font-bold text-lg" style="font-size: 1.25rem;">${s.value}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            if (data.table && data.table.rows && data.table.rows.length > 0) {
                html += `
                    <div class="table-responsive" style="overflow-x: auto;">
                        <table class="data-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    ${data.table.headers.map(h => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: right;">${h}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${data.table.rows.map(row => `
                                    <tr>
                                        ${row.map(cell => `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else {
                html += '<p class="text-center text-gray" style="text-align: center; color: #888;">لا توجد بيانات</p>';
            }
            
            resultsContainer.innerHTML = html;
        },
        
        exportReport: function() {
            if (!currentReportData) return;
            
            let csv = currentReportData.title + '\n\n';
            
            // Summary
            currentReportData.summary.forEach(s => {
                csv += `${s.label},${s.value}\n`;
            });
            csv += '\n';
            
            // Table
            if (currentReportData.table && currentReportData.table.rows) {
                csv += currentReportData.table.headers.join(',') + '\n';
                currentReportData.table.rows.forEach(row => {
                    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
                });
            }
            
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `report_${Date.now()}.csv`;
            link.click();
            
            if (App.Components && App.Components.Toast) {
                App.Components.Toast.show('تم تصدير التقرير بنجاح', 'success');
            }
        },
        
        printReport: function() {
            if (!currentReportData) return;
            const printContent = document.getElementById('report-results').innerHTML;
            const originalContent = document.body.innerHTML;
            
            document.body.innerHTML = `
                <div style="padding: 20px; direction: rtl; font-family: Tahoma, Arial;">
                    <h1 style="text-align: center; margin-bottom: 20px;">مدارس الوطن النموذجية</h1>
                    ${printContent}
                </div>
            `;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload(); 
        }
    };
})();
