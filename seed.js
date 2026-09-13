(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Seed = {
        run: function() {
            const users = [
                { id: 'user-admin', email: 'admin@school.com', password: 'Admin@2026', role: 'admin', name: 'أحمد محمد العمري', nameEn: 'Ahmed Mohammed Al-Omari', status: 'active', lang: 'ar', theme: 'light', createdAt: new Date().toISOString() },
                { id: 'user-teacher', email: 'teacher@school.com', password: 'Teacher@2026', role: 'teacher', name: 'خالد عبدالله السعيد', nameEn: 'Khalid Abdullah Al-Saeed', status: 'active', lang: 'ar', theme: 'light', createdAt: new Date().toISOString() },
                { id: 'user-student', email: 'student@school.com', password: 'Student@2026', role: 'student', name: 'عمر أحمد الحربي', nameEn: 'Omar Ahmed Al-Harbi', status: 'active', lang: 'ar', theme: 'light', createdAt: new Date().toISOString() },
                { id: 'user-parent', email: 'parent@school.com', password: 'Parent@2026', role: 'parent', name: 'محمد أحمد الحربي', nameEn: 'Mohammed Ahmed Al-Harbi', status: 'active', lang: 'ar', theme: 'light', createdAt: new Date().toISOString() },
                { id: 'user-accountant', email: 'accountant@school.com', password: 'Accountant@2026', role: 'accountant', name: 'سعد إبراهيم الدوسري', nameEn: 'Saad Ibrahim Al-Dossari', status: 'active', lang: 'ar', theme: 'light', createdAt: new Date().toISOString() },
                { id: 'user-registrar', email: 'registrar@school.com', password: 'Registrar@2026', role: 'registrar', name: 'عائشة سالم العتيبي', nameEn: 'Aisha Salem Al-Otaibi', status: 'active', lang: 'ar', theme: 'light', createdAt: new Date().toISOString() }
            ];

            const teacherNames = [
                'خالد عبدالله السعيد', 'فاطمة أحمد النعيمي', 'محمد سعيد الغامدي', 'نورة إبراهيم الشمري',
                'عبدالرحمن علي الزهراني', 'سارة محمد القحطاني', 'يوسف خالد المالكي', 'هند عبدالعزيز الدوسري',
                'أحمد عمر البلوي', 'مريم سالم الحربي'
            ];
            const subjectsList = ['الرياضيات', 'اللغة العربية', 'العلوم', 'اللغة الإنجليزية', 'التربية الإسلامية', 'الدراسات الاجتماعية', 'الحاسب الآلي', 'القرآن الكريم', 'التربية البدنية', 'التربية الفنية'];
            
            for(let i=1; i<10; i++) {
                users.push({
                    id: `user-t${i}`, email: `t${i}@school.com`, password: '123', role: 'teacher', name: teacherNames[i], status: 'active', lang: 'ar', theme: 'light'
                });
            }

            const classes = [];
            const sections = [];
            for (let i = 1; i <= 6; i++) {
                const classId = `c${i}`;
                const classNames = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'];
                classes.push({ id: classId, name: classNames[i-1], gradeLevel: i, academicYear: '2025-2026' });
                sections.push({ id: `sec-${i}a`, classId, name: 'أ', homeroomTeacherId: `t0`, maxStudents: 35, academicYear: '2025-2026' });
                sections.push({ id: `sec-${i}b`, classId, name: 'ب', homeroomTeacherId: `t1`, maxStudents: 35, academicYear: '2025-2026' });
            }

            const subjects = subjectsList.map((name, idx) => ({
                id: `sub${idx}`, name, nameEn: `Subject ${idx}`, code: `SUB${idx}`, classIds: classes.map(c => c.id), teacherIds: idx === 0 ? ['t0'] : [`t${idx}`], maxGrade: 100, passingGrade: 50
            }));

            const teachers = teacherNames.map((name, idx) => ({
                id: `t${idx}`, userId: idx === 0 ? 'user-teacher' : `user-t${idx}`, teacherId: `TCH-00${idx+1}`, fullName: name, specialization: subjectsList[idx], phone: '0500000000', email: idx === 0 ? 'teacher@school.com' : `t${idx}@school.com`, status: 'active', subjectIds: [`sub${idx}`], classIds: classes.map(c => c.id)
            }));

            const students = [];
            const parents = [];
            const grades = [];
            const attendance = [];
            const payments = [];
            let studentCounter = 1;
            let parentCounter = 1;
            
            parents.push({ id: 'p0', userId: 'user-parent', fullName: 'محمد أحمد الحربي', relation: 'Father', phone: '0501112222', email: 'parent@school.com', childrenIds: ['s0'] });

            const studentNames = ['عمر', 'علي', 'فهد', 'سعود', 'عبدالله', 'زياد', 'طارق', 'ماجد', 'نايف', 'سلمان', 'ياسر', 'تركي', 'بدر', 'سلطان', 'نواف'];
            const fatherNames = ['أحمد', 'محمد', 'سعيد', 'صالح', 'عبدالعزيز', 'سعد', 'خالد'];
            const famNames = ['الحربي', 'الغامدي', 'الزهراني', 'المالكي', 'الدوسري', 'القحطاني', 'العتيبي', 'الشمري'];

            for (let c of classes) {
                const secs = sections.filter(s => s.classId === c.id);
                for (let s of secs) {
                    for (let i = 0; i < 2; i++) { 
                        const isDemo = (c.gradeLevel === 4 && s.name === 'أ' && i === 0);
                        const sId = isDemo ? 's0' : `s${studentCounter}`;
                        const pId = isDemo ? 'p0' : `p${parentCounter}`;
                        
                        const fname = isDemo ? 'عمر' : studentNames[Math.floor(Math.random()*studentNames.length)];
                        const fatname = isDemo ? 'أحمد' : fatherNames[Math.floor(Math.random()*fatherNames.length)];
                        const lname = isDemo ? 'الحربي' : famNames[Math.floor(Math.random()*famNames.length)];
                        const fullName = `${fname} ${fatname} ${lname}`;
                        
                        students.push({
                            id: sId, userId: isDemo ? 'user-student' : `user-s${studentCounter}`, studentId: `STU-2026-${String(studentCounter).padStart(5, '0')}`,
                            seatNumber: `${10000 + studentCounter}`, firstName: fname, fatherName: fatname, familyName: lname, fullName,
                            classId: c.id, sectionId: s.id, parentId: pId, academicYear: '2025-2026', status: 'active', gender: 'male'
                        });

                        if(!isDemo) {
                            parents.push({ id: pId, userId: `user-p${parentCounter}`, fullName: `${fatname} ${lname}`, relation: 'Father', childrenIds: [sId] });
                        }

                        // Grades
                        for(let sub of subjects) {
                            const assign = Math.floor(Math.random() * 15) + 15;
                            const mid = Math.floor(Math.random() * 10) + 10;
                            const fin = Math.floor(Math.random() * 25) + 25;
                            const total = assign + mid + fin;
                            grades.push({
                                id: `g${sId}-${sub.id}`, studentId: sId, subjectId: sub.id, classId: c.id, sectionId: s.id, academicYear: '2025-2026',
                                semester: 1, assignmentGrade: assign, midtermGrade: mid, finalGrade: fin, total, percentage: total,
                                letterGrade: App.Utils ? App.Utils.getLetterGrade(total).letter : 'B', status: 'published'
                            });
                        }
                        
                        // Attendance
                        for(let d=1; d<=30; d++) {
                            const statuses = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late', 'excused'];
                            attendance.push({
                                id: `a${sId}-${d}`, studentId: sId, classId: c.id, sectionId: s.id, date: `2026-09-${String(d).padStart(2,'0')}`,
                                status: statuses[Math.floor(Math.random()*statuses.length)]
                            });
                        }
                        
                        // Payments
                        payments.push({ id: `pay1-${sId}`, studentId: sId, feeType: 'tuition', amount: 5000, paidAmount: isDemo ? 2500 : 5000, status: isDemo ? 'partial' : 'paid' });
                        payments.push({ id: `pay2-${sId}`, studentId: sId, feeType: 'books', amount: 300, paidAmount: 300, status: 'paid' });
                        payments.push({ id: `pay3-${sId}`, studentId: sId, feeType: 'transport', amount: 1500, paidAmount: 0, status: 'pending' });
                        
                        studentCounter++;
                        parentCounter++;
                    }
                }
            }

            const lessons = [
                { id: 'l1', title: 'مقدمة في الجبر', description: 'أساسيات الجبر والمعادلات', subjectId: 'sub0', classId: 'c4', teacherId: 't0', content: 'نص تعليمي عن الجبر', status: 'published' }
            ];
            
            const assignments = [
                { id: 'as1', title: 'واجب الرياضيات الأسبوعي', description: 'حل التمارين ص 15', subjectId: 'sub0', classId: 'c4', sectionId: 'sec-4a', teacherId: 't0', dueDate: '2026-09-10', maxGrade: 10, status: 'active' }
            ];
            
            const exams = [
                { id: 'e1', title: 'اختبار الرياضيات النصفي', subjectId: 'sub0', classId: 'c4', teacherId: 't0', durationMinutes: 30, maxGrade: 20, status: 'active', questions: [
                    { id: 'q1', text: '5 + 5 = ?', type: 'mcq', options: ['8', '9', '10', '11'], correctAnswer: 2, points: 2 }
                ] }
            ];
            
            const announcements = [
                { id: 'an1', title: 'بدء العام الدراسي', content: 'نرحب بكم في العام الدراسي الجديد', target: 'all', status: 'published', publishDate: '2026-08-25' }
            ];
            
            const notifications = [
                { id: 'n1', userId: 'user-student', title: 'تم رصد درجة', message: 'تم رصد درجة الرياضيات', type: 'grade', read: false, createdAt: new Date().toISOString() },
                { id: 'n2', userId: 'user-teacher', title: 'اجتماع معلمين', message: 'اجتماع غداً الساعة 10', type: 'info', read: false, createdAt: new Date().toISOString() }
            ];

            const registrations = [
                { id: 'reg1', regNumber: 'REG-2026-00001', studentData: { firstName: 'سالم' }, status: 'pending', submittedAt: new Date().toISOString() }
            ];

            const schedule = [];
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
            days.forEach(day => {
                for(let period=1; period<=7; period++) {
                    schedule.push({ id: `sch-${day}-${period}-4a`, classId: 'c4', sectionId: 'sec-4a', day, period, startTime: '07:30', endTime: '08:15', subjectId: 'sub0', teacherId: 't0', room: '101' });
                }
            });

            if (App.Storage) {
                App.Storage.set('users', users);
                App.Storage.set('teachers', teachers);
                App.Storage.set('students', students);
                App.Storage.set('parents', parents);
                App.Storage.set('classes', classes);
                App.Storage.set('sections', sections);
                App.Storage.set('subjects', subjects);
                App.Storage.set('grades', grades);
                App.Storage.set('attendance', attendance);
                App.Storage.set('payments', payments);
                App.Storage.set('lessons', lessons);
                App.Storage.set('assignments', assignments);
                App.Storage.set('exams', exams);
                App.Storage.set('announcements', announcements);
                App.Storage.set('notifications', notifications);
                App.Storage.set('registrations', registrations);
                App.Storage.set('schedule', schedule);
            }
        }
    };
})();
