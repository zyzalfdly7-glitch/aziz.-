(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.Config = {
        APP_NAME: 'المدرسة الوطنية النموذجية',
        APP_NAME_EN: 'Al-Wataniya Model School',
        CURRENT_YEAR: '2025-2026',
        ITEMS_PER_PAGE: 10,
        DEMO_ACCOUNTS: {
            admin: { email: 'admin@school.com', password: 'Admin@2026', role: 'admin', name: 'أحمد محمد العمري', userId: 'user-admin' },
            teacher: { email: 'teacher@school.com', password: 'Teacher@2026', role: 'teacher', name: 'خالد عبدالله السعيد', userId: 'user-teacher' },
            student: { email: 'student@school.com', password: 'Student@2026', role: 'student', name: 'عمر أحمد الحربي', userId: 'user-student' },
            parent: { email: 'parent@school.com', password: 'Parent@2026', role: 'parent', name: 'محمد أحمد الحربي', userId: 'user-parent' },
            accountant: { email: 'accountant@school.com', password: 'Accountant@2026', role: 'accountant', name: 'سعد إبراهيم الدوسري', userId: 'user-accountant' },
            registrar: { email: 'registrar@school.com', password: 'Registrar@2026', role: 'registrar', name: 'عائشة سالم العتيبي', userId: 'user-registrar' }
        },
        MAX_GRADES: { assignment: 30, midterm: 20, final: 50, total: 100 },
        GRADE_LETTERS: {
            'A+': { min: 95 },
            'A': { min: 90 },
            'B+': { min: 85 },
            'B': { min: 80 },
            'C+': { min: 75 },
            'C': { min: 70 },
            'D+': { min: 65 },
            'D': { min: 60 },
            'F': { min: 0 }
        },
        ATTENDANCE_STATUS: ['present', 'absent', 'late', 'excused'],
        PAYMENT_STATUS: ['paid', 'partial', 'pending', 'overdue'],
        DAYS: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
        DAYS_AR: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        PERIODS: 7,
        PERIOD_TIMES: [
            { start: '07:30', end: '08:15' },
            { start: '08:15', end: '09:00' },
            { start: '09:00', end: '09:45' },
            { start: '10:15', end: '11:00' },
            { start: '11:00', end: '11:45' },
            { start: '12:15', end: '13:00' },
            { start: '13:00', end: '13:45' }
        ],
        FEE_TYPES: ['tuition', 'registration', 'books', 'transport', 'other'],
        COLLECTIONS: [
            'users', 'students', 'teachers', 'parents', 'classes', 'sections',
            'subjects', 'grades', 'attendance', 'payments', 'lessons',
            'assignments', 'exams', 'examResults', 'announcements',
            'notifications', 'registrations', 'schedule'
        ]
    };
})();
