# PROJECT SPECIFICATIONS — Al-Wataniya Model School Platform
# This file contains all shared conventions for consistent implementation.

## FILE PATHS
Project root: c:\Users\GoogleTech\Desktop\Watan

## JS PATTERN — NO ES MODULES
Since the project must work by opening index.html directly (file:// protocol), 
DO NOT use ES module import/export. Use the IIFE + global namespace pattern:

```javascript
(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.ModuleName = {
        // public API
    };
})();
```

HTML pages load scripts via regular <script> tags in dependency order.

## SCRIPT LOADING ORDER

### For index.html (root level):
```html
<script src="js/config.js"></script>
<script src="js/utils.js"></script>
<script src="js/storage.js"></script>
<script src="js/database.js"></script>
<script src="js/seed.js"></script>
<script src="js/i18n.js"></script>
<script src="js/translations/ar.js"></script>
<script src="js/translations/en.js"></script>
<script src="js/auth.js"></script>
<script src="js/theme.js"></script>
<script src="js/validation.js"></script>
<script src="js/notifications.js"></script>
<script src="js/router.js"></script>
<script src="js/charts.js"></script>
<script src="js/export.js"></script>
<script src="js/components/toast.js"></script>
<script src="js/components/modal.js"></script>
<script src="js/components/navbar.js"></script>
<script src="js/components/sidebar.js"></script>
<script src="js/components/table.js"></script>
<script src="js/components/tabs.js"></script>
<script src="js/components/dropdown.js"></script>
<script src="js/components/pagination.js"></script>
<script src="js/components/form-builder.js"></script>
<script src="js/components/chart.js"></script>
<script src="js/components/breadcrumb.js"></script>
<script src="js/components/empty-state.js"></script>
<script src="js/app.js"></script>
```

### For pages/ (one level deep):
Same but prefix with `../` e.g. `../js/config.js`

### For dashboards/admin/ (two levels deep):  
Same but prefix with `../../` e.g. `../../js/config.js`
Add page-specific module scripts before app.js:
`<script src="../../js/modules/students.js"></script>`

## CSS LOADING ORDER

### For index.html (root level):
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/typography.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/forms.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/dashboard.css">
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="css/dark-theme.css">
<link rel="stylesheet" href="css/rtl.css">
<link rel="stylesheet" href="css/print.css" media="print">
```
Adjust paths for pages/ (../) and dashboards/role/ (../../)

## CSS CLASS CONVENTIONS

### Layout
.container, .section, .grid, .flex, .flex-between, .flex-center

### Navbar (public pages)
.navbar, .navbar__logo, .navbar__logo img, .navbar__logo span,
.navbar__menu, .navbar__item, .navbar__link, .navbar__link.is-active,
.navbar__actions, .navbar__mobile-toggle, .navbar.is-scrolled

### Hero
.hero, .hero__content, .hero__title, .hero__subtitle, .hero__actions, .hero__bg

### Cards
.card, .card__header, .card__body, .card__footer
.stat-card, .stat-card__icon, .stat-card__info, .stat-card__value, .stat-card__label, .stat-card__trend

### Buttons
.btn, .btn--primary, .btn--secondary, .btn--outline, .btn--danger, .btn--success, .btn--ghost
.btn--sm, .btn--lg, .btn--icon, .btn--block

### Forms
.form-group, .form-label, .form-control, .form-control--error, .form-help, .form-error
.form-row, .checkbox-group, .radio-group, .form-actions
.search-box, .search-box__input, .search-box__btn
.filter-bar, .filter-group

### Tables
.table-responsive, .data-table, .data-table th, .data-table td
.data-table__actions (action buttons in table cell)

### Dashboard
.dashboard-body (body class), .dashboard-layout
.sidebar, .sidebar__header, .sidebar__menu, .sidebar__item, .sidebar__link, .sidebar__link.is-active
.sidebar__icon, .sidebar__text, .sidebar__badge, .sidebar__footer, .sidebar-overlay
.sidebar.is-collapsed (collapsed state), .sidebar.is-open (mobile open)
.topbar, .topbar__toggle, .topbar__title, .topbar__search, .topbar__actions
.topbar__notification, .topbar__notification-badge, .topbar__user, .topbar__avatar
.dashboard-main, .dashboard-content
.page-header, .page-header__title, .page-header__subtitle, .page-header__actions
.stats-grid (for stat cards row)
.quick-actions, .quick-actions__item

### Badges
.badge, .badge--success, .badge--warning, .badge--danger, .badge--info, .badge--primary, .badge--secondary

### Modal
.modal-overlay, .modal-overlay.is-active
.modal, .modal--sm, .modal--lg, .modal--xl
.modal__header, .modal__title, .modal__close, .modal__body, .modal__footer

### Toast
.toast-container, .toast, .toast--success, .toast--error, .toast--warning, .toast--info
.toast__icon, .toast__message, .toast__close

### Tabs
.tabs, .tabs__list, .tabs__item, .tabs__item.is-active, .tabs__content, .tabs__panel, .tabs__panel.is-active

### Pagination
.pagination, .pagination__btn, .pagination__btn.is-active, .pagination__info

### Breadcrumb
.breadcrumb, .breadcrumb__item, .breadcrumb__separator

### Multi-step Form (Registration)
.step-wizard, .step-wizard__steps, .step-wizard__step, .step-wizard__step.is-active, .step-wizard__step.is-completed
.step-wizard__step-number, .step-wizard__step-label, .step-wizard__connector
.step-wizard__content, .step-wizard__panel, .step-wizard__panel.is-active
.step-wizard__actions

### Footer
.footer, .footer__content, .footer__col, .footer__title, .footer__links, .footer__link
.footer__bottom, .footer__social, .footer__social-link

### Utilities
.text-center, .text-right, .text-left
.mt-1 through .mt-4, .mb-1 through .mb-4, .p-1 through .p-4, .gap-1 through .gap-3
.is-hidden, .is-visible, .text-success, .text-danger, .text-warning, .text-muted
.empty-state, .empty-state__icon, .empty-state__title, .empty-state__text, .empty-state__action
.loading-spinner, .skeleton, .skeleton-text, .skeleton-circle

### Chart
.chart-container, .chart-bar, .chart-pie, .chart-line
.chart-legend, .chart-legend__item, .chart-legend__color, .chart-legend__label

### Profile
.profile-card, .profile-card__avatar, .profile-card__name, .profile-card__role
.profile-info, .profile-info__item, .profile-info__label, .profile-info__value

### Section-specific (landing page)
.features-section, .feature-card, .feature-card__icon, .feature-card__title, .feature-card__text
.services-section, .service-card
.stats-section, .stat-item, .stat-item__number, .stat-item__label
.news-section, .news-card, .news-card__image, .news-card__content, .news-card__title, .news-card__date
.testimonials-section, .testimonial-card, .testimonial-card__text, .testimonial-card__author
.cta-section, .cta__title, .cta__text, .cta__actions
.stages-section, .stage-card, .stage-card__icon, .stage-card__title

### Login
.login-page, .login-card, .login-card__header, .login-card__body, .login-card__footer
.password-toggle, .remember-me

### Results
.results-search, .results-search__form, .result-card, .result-card__header
.result-table, .result-summary, .result-actions

### Schedule
.schedule-table, .schedule-cell, .schedule-cell--active, .schedule-header

## JS API SIGNATURES

### App.Config
```
APP_NAME: 'المدرسة الوطنية النموذجية'
APP_NAME_EN: 'Al-Wataniya Model School'
CURRENT_YEAR: '2025-2026'
ITEMS_PER_PAGE: 10
DEMO_ACCOUNTS: {
  admin: { email: 'admin@school.com', password: 'Admin@2026', role: 'admin', name: 'أحمد محمد العمري' },
  teacher: { email: 'teacher@school.com', password: 'Teacher@2026', role: 'teacher', name: 'خالد عبدالله السعيد' },
  student: { email: 'student@school.com', password: 'Student@2026', role: 'student', name: 'عمر أحمد الحربي' },
  parent: { email: 'parent@school.com', password: 'Parent@2026', role: 'parent', name: 'محمد أحمد الحربي' },
  accountant: { email: 'accountant@school.com', password: 'Accountant@2026', role: 'accountant', name: 'سعد إبراهيم الدوسري' }
}
MAX_GRADES: { assignment: 30, midterm: 20, final: 50, total: 100 }
ATTENDANCE_STATUS: ['present', 'absent', 'late', 'excused']
PAYMENT_STATUS: ['paid', 'partial', 'pending', 'overdue']
DAYS: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
DAYS_AR: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']
PERIODS: 7 (periods per day)
```

### App.Utils
```
generateId() → string (unique ID)
generateStudentId() → 'STU-2026-XXXXX'
generateSeatNumber() → 5-digit string
generateRegNumber() → 'REG-2026-XXXXX'
formatDate(date, lang?) → formatted string
formatCurrency(amount) → 'X,XXX ر.س'
sanitize(str) → escaped string
$(selector, parent?) → Element
$$(selector, parent?) → NodeList
createElement(tag, attrs?, children?) → Element
debounce(fn, ms) → Function
calculatePercentage(score, total) → number
getLetterGrade(pct) → {letter, label, labelAr}
  // A+ ≥95, A ≥90, B+ ≥85, B ≥80, C+ ≥75, C ≥70, D+ ≥65, D ≥60, F <60
getGradeColor(pct) → CSS class string
groupBy(arr, key) → object
sortBy(arr, key, asc?) → sorted array
paginate(arr, page, perPage) → {data, total, pages, page}
```

### App.Storage
```
get(key) → parsed value
set(key, value) → void
remove(key) → void
clear() → void
has(key) → boolean
```

### App.DB
```
init() → void (seeds if empty)
getAll(collection) → array
getById(collection, id) → object|null
query(collection, filterFn) → array
create(collection, item) → item (with generated id)
update(collection, id, updates) → updated item
delete(collection, id) → boolean
count(collection, filterFn?) → number
// Convenience:
getStudentsByClass(classId, sectionId?) → array
getGradesByStudent(studentId, year?) → array
getAttendanceByStudent(studentId, month?, year?) → array
getPaymentsByStudent(studentId) → array
getScheduleByClass(classId, sectionId) → array
getTeacherSubjects(teacherId) → array
getTeacherClasses(teacherId) → array
getParentChildren(parentId) → array
getUserByEmail(email) → user|null
getStudentByUserId(userId) → student|null
getTeacherByUserId(userId) → teacher|null
getParentByUserId(userId) → parent|null
reset() → void (clear and re-seed)
```

### App.Auth
```
login(email, password) → {success, user, error}
logout() → void (clears session, redirects to login)
getCurrentUser() → user object|null
isAuthenticated() → boolean
hasRole(role) → boolean
requireAuth(allowedRoles?) → void (redirects if unauthorized)
getLoginPageUrl() → string (relative)
getDashboardUrl(role) → string (relative)
```

### App.I18n
```
currentLang → 'ar'|'en'
setLanguage(lang) → void (updates dir, lang attr, re-renders)
t(key, params?) → translated string
translatePage() → void (translates all [data-i18n] elements)
```

### App.Theme
```
current → 'light'|'dark'
toggle() → void
set(theme) → void
init() → void
```

### App.Validation
```
validate(formEl, rules) → {valid, errors}
  rules format: { fieldName: [{type:'required'}, {type:'email'}, {type:'min', value:0}, {type:'max', value:100}] }
showError(inputEl, message) → void
clearErrors(formEl) → void
clearError(inputEl) → void
```

### App.Notifications
```
getAll(userId?) → array
getUnread(userId?) → array
markAsRead(id) → void
markAllAsRead(userId?) → void
create(notification) → void  // {userId, title, message, type, link}
getCount(userId?) → number
```

### App.Charts
```
bar(containerId, {labels, datasets, title?}) → void
pie(containerId, {labels, values, colors, title?}) → void
line(containerId, {labels, datasets, title?}) → void
// datasets: [{label, data, color}]
```

### App.Export
```
toCSV(data, headers, filename) → void (triggers download)
print(elementId?) → void (window.print with print area)
copyToClipboard(text) → Promise
```

### App.Components.Toast
```
success(message, duration?) → void
error(message, duration?) → void
warning(message, duration?) → void
info(message, duration?) → void
```

### App.Components.Modal
```
open({title, content, size?, footer?, onClose?}) → void
close() → void
confirm({title, message, confirmText?, cancelText?, onConfirm, onCancel?, type?}) → void
```

### App.Components.Sidebar
```
init(role, menuItems) → void
toggle() → void
setActive(itemId) → void
render(container) → void
// menuItems: [{id, icon, label, link, badge?}]
```

### App.Components.Table
```
render(containerId, {columns, data, searchable?, sortable?, paginated?, perPage?, actions?, onAction?, emptyMessage?}) → void
refresh(containerId, data) → void
// columns: [{key, label, sortable?, render?}]
// actions: [{id, label, icon?, className?}]
```

### App.Components.Tabs
```
init(containerId) → void
// Works with HTML structure: .tabs > .tabs__list > .tabs__item[data-tab] + .tabs__content > .tabs__panel[data-tab-panel]
```

### App.Components.Pagination
```
render(containerId, {total, perPage, currentPage, onChange}) → void
```

## DATA MODEL (SEED DATA STRUCTURE)

### users collection:
{ id, email, password, role, name, nameEn, avatar, status:'active', lang:'ar', theme:'light', createdAt }
Roles: 'admin', 'teacher', 'student', 'parent', 'accountant', 'registrar'

### students collection:
{ id, userId, studentId:'STU-2026-00001', seatNumber:'10001', firstName, fatherName, grandfatherName, familyName, fullName, gender:'male'|'female', dob, birthplace, phone, email, address, classId, sectionId, parentId, previousSchool, academicYear:'2025-2026', enrollmentDate, status:'active', photo:null }

### teachers collection:
{ id, userId, teacherId:'TCH-001', fullName, specialization, phone, email, qualification, hireDate, status:'active', subjectIds:[], classIds:[] }

### parents collection:
{ id, userId, fullName, relation, phone, email, occupation, childrenIds:[] }

### classes collection:
{ id, name:'الصف الأول', gradeLevel:1, academicYear:'2025-2026' }

### sections collection:
{ id, classId, name:'أ', homeroomTeacherId, maxStudents:35, academicYear:'2025-2026' }

### subjects collection:
{ id, name:'الرياضيات', nameEn:'Mathematics', code:'MATH', classIds:[], teacherIds:[], maxGrade:100, passingGrade:50 }

### grades collection:
{ id, studentId, subjectId, classId, sectionId, academicYear:'2025-2026', semester:1|2, assignmentGrade, midtermGrade, finalGrade, total, percentage, letterGrade, status:'published'|'draft'|'locked' }

### attendance collection:
{ id, studentId, classId, sectionId, date:'2026-09-01', status:'present'|'absent'|'late'|'excused', recordedBy, notes }

### payments collection:
{ id, studentId, academicYear, feeType:'tuition'|'registration'|'books'|'transport'|'other', description, amount, paidAmount, remaining, dueDate, paymentDate, status:'paid'|'partial'|'pending'|'overdue', receiptNumber, notes }

### lessons collection:
{ id, title, description, subjectId, classId, teacherId, content, videoUrl, pdfUrl, publishDate, status:'published'|'draft', order }

### assignments collection:
{ id, title, description, subjectId, classId, sectionId, teacherId, dueDate, maxGrade:10, status:'active'|'closed', createdAt }

### exams collection:
{ id, title, subjectId, classId, teacherId, durationMinutes:30, maxGrade:20, questions:[], status:'active'|'draft'|'closed', startDate, endDate }
questions: [{ id, text, type:'mcq'|'true_false', options:['...'], correctAnswer:0, points:2 }]

### examResults collection:
{ id, examId, studentId, answers:[], score, percentage, submittedAt }

### announcements collection:
{ id, title, content, image:null, authorId, target:'all'|'students'|'teachers'|'parents', targetValue:null, publishDate, status:'published'|'draft', createdAt }

### notifications collection:
{ id, userId, title, message, type:'info'|'success'|'warning'|'grade'|'attendance'|'payment', link:null, read:false, createdAt }

### registrations collection:
{ id, regNumber:'REG-2026-00001', studentData:{...}, academicData:{...}, parentData:{...}, documents:[], status:'pending'|'approved'|'rejected', submittedAt, reviewedBy:null, reviewedAt:null }

### schedule collection:
{ id, classId, sectionId, day:'sunday', period:1, startTime:'07:30', endTime:'08:15', subjectId, teacherId, room:'101' }

## HTML PAGE TEMPLATES

### PUBLIC PAGE TEMPLATE (for pages/*.html):
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PAGE_TITLE - المدرسة الوطنية النموذجية</title>
    <meta name="description" content="PAGE_DESCRIPTION">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/typography.css">
    <link rel="stylesheet" href="../css/components.css">
    <link rel="stylesheet" href="../css/forms.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/animations.css">
    <link rel="stylesheet" href="../css/responsive.css">
    <link rel="stylesheet" href="../css/dark-theme.css">
    <link rel="stylesheet" href="../css/rtl.css">
    <link rel="stylesheet" href="../css/print.css" media="print">
</head>
<body>
    <nav class="navbar" id="navbar">...</nav>
    <main>...</main>
    <footer class="footer">...</footer>
    
    <div class="toast-container" id="toast-container"></div>
    
    <script src="../js/config.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/storage.js"></script>
    <script src="../js/database.js"></script>
    <script src="../js/seed.js"></script>
    <script src="../js/i18n.js"></script>
    <script src="../js/translations/ar.js"></script>
    <script src="../js/translations/en.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/theme.js"></script>
    <script src="../js/validation.js"></script>
    <script src="../js/notifications.js"></script>
    <script src="../js/components/toast.js"></script>
    <script src="../js/components/navbar.js"></script>
    <script src="../js/app.js"></script>
    <!-- page-specific scripts -->
</body>
</html>
```

### DASHBOARD PAGE TEMPLATE (for dashboards/role/*.html):
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PAGE_TITLE - المدرسة الوطنية النموذجية</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/reset.css">
    <link rel="stylesheet" href="../../css/variables.css">
    <link rel="stylesheet" href="../../css/global.css">
    <link rel="stylesheet" href="../../css/typography.css">
    <link rel="stylesheet" href="../../css/components.css">
    <link rel="stylesheet" href="../../css/forms.css">
    <link rel="stylesheet" href="../../css/layout.css">
    <link rel="stylesheet" href="../../css/dashboard.css">
    <link rel="stylesheet" href="../../css/animations.css">
    <link rel="stylesheet" href="../../css/responsive.css">
    <link rel="stylesheet" href="../../css/dark-theme.css">
    <link rel="stylesheet" href="../../css/rtl.css">
    <link rel="stylesheet" href="../../css/print.css" media="print">
</head>
<body class="dashboard-body">
    <aside class="sidebar" id="sidebar">
        <div class="sidebar__header">
            <img src="../../assets/images/logo.svg" alt="Logo" class="sidebar__logo">
            <span class="sidebar__school-name">المدرسة الوطنية النموذجية</span>
        </div>
        <nav class="sidebar__menu" id="sidebar-menu">
            <!-- Menu items rendered by sidebar.js -->
        </nav>
        <div class="sidebar__footer">
            <button class="btn btn--ghost btn--sm" id="logout-btn">
                <span class="sidebar__icon">🚪</span>
                <span class="sidebar__text">تسجيل الخروج</span>
            </button>
        </div>
    </aside>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    
    <div class="dashboard-main">
        <header class="topbar" id="topbar">
            <button class="topbar__toggle" id="sidebar-toggle">☰</button>
            <h1 class="topbar__title">PAGE_TITLE</h1>
            <div class="topbar__actions">
                <button class="topbar__notification" id="notification-btn">
                    🔔<span class="topbar__notification-badge" id="notification-badge" style="display:none">0</span>
                </button>
                <button class="btn btn--ghost btn--sm" id="theme-toggle">🌙</button>
                <button class="btn btn--ghost btn--sm" id="lang-toggle">EN</button>
                <div class="topbar__user" id="user-menu">
                    <img src="../../assets/images/default-avatar.svg" class="topbar__avatar" alt="">
                    <span class="topbar__user-name" id="user-name"></span>
                </div>
            </div>
        </header>
        
        <div class="dashboard-content" id="main-content">
            <!-- Page content here -->
        </div>
    </div>
    
    <div class="toast-container" id="toast-container"></div>
    <div class="modal-overlay" id="modal-overlay">
        <div class="modal" id="modal"></div>
    </div>
    
    <script src="../../js/config.js"></script>
    <script src="../../js/utils.js"></script>
    <script src="../../js/storage.js"></script>
    <script src="../../js/database.js"></script>
    <script src="../../js/seed.js"></script>
    <script src="../../js/i18n.js"></script>
    <script src="../../js/translations/ar.js"></script>
    <script src="../../js/translations/en.js"></script>
    <script src="../../js/auth.js"></script>
    <script src="../../js/theme.js"></script>
    <script src="../../js/validation.js"></script>
    <script src="../../js/notifications.js"></script>
    <script src="../../js/router.js"></script>
    <script src="../../js/charts.js"></script>
    <script src="../../js/export.js"></script>
    <script src="../../js/components/toast.js"></script>
    <script src="../../js/components/modal.js"></script>
    <script src="../../js/components/sidebar.js"></script>
    <script src="../../js/components/table.js"></script>
    <script src="../../js/components/tabs.js"></script>
    <script src="../../js/components/dropdown.js"></script>
    <script src="../../js/components/pagination.js"></script>
    <script src="../../js/components/form-builder.js"></script>
    <script src="../../js/components/chart.js"></script>
    <script src="../../js/components/breadcrumb.js"></script>
    <script src="../../js/components/empty-state.js"></script>
    <!-- page-specific module scripts here -->
    <script src="../../js/app.js"></script>
</body>
</html>
```

## SIDEBAR MENU ITEMS PER ROLE

### Admin sidebar:
dashboard(🏠), students(👨‍🎓), teachers(👨‍🏫), classes(🏫), subjects(📚), grades(📊), attendance(📋), payments(💳), lessons(📖), assignments(📝), exams(🧪), announcements(📢), registrations(📄), reports(📈), schedule(📅), settings(⚙️)

### Teacher sidebar:
dashboard(🏠), classes(🏫), students(👨‍🎓), grades(📊), attendance(📋), lessons(📖), assignments(📝), exams(🧪), notifications(🔔), profile(👤)

### Student sidebar:
dashboard(🏠), grades(📊), attendance(📋), schedule(📅), lessons(📖), assignments(📝), exams(🧪), payments(💳), notifications(🔔), profile(👤)

### Parent sidebar:
dashboard(🏠), children(👨‍👩‍👧‍👦), grades(📊), attendance(📋), payments(💳), notifications(🔔), profile(👤)

## DEMO DATA SPECIFICS

### 10 Teachers (Arabic names):
1. خالد عبدالله السعيد (الرياضيات)
2. فاطمة أحمد النعيمي (اللغة العربية)
3. محمد سعيد الغامدي (العلوم)
4. نورة إبراهيم الشمري (اللغة الإنجليزية)
5. عبدالرحمن علي الزهراني (التربية الإسلامية)
6. سارة محمد القحطاني (الدراسات الاجتماعية)
7. يوسف خالد المالكي (الحاسب الآلي)
8. هند عبدالعزيز الدوسري (القرآن الكريم)
9. أحمد عمر البلوي (التربية البدنية)
10. مريم سالم الحربي (التربية الفنية)

### 6 Classes with 2 sections each:
Grade 1-6 (الصف الأول through الصف السادس), sections أ and ب

### Subjects (10):
القرآن الكريم, اللغة العربية, اللغة الإنجليزية, الرياضيات, العلوم, الدراسات الاجتماعية, التربية الإسلامية, الحاسب الآلي, التربية الفنية, التربية البدنية

### 30 Students (Arabic names, ~5 per class, mixed gender):
Distributed across the 6 classes. Each with a parent linked.
The demo student (login: student@school.com) is: عمر أحمد الحربي, Class الصف الرابع, Section أ, Seat 10015
The demo parent (login: parent@school.com) is: محمد أحمد الحربي (father of عمر)

### Schedule: 
Sunday-Thursday, 7 periods, 07:30-13:45. Each period 45 min with breaks.

### Grade data:
Each student has grades for all subjects in their class: assignment (0-30), midterm (0-20), final (0-50).

## IMPORTANT NOTES
- Default language: Arabic (RTL)
- All text in the UI should be Arabic by default
- Use textContent instead of innerHTML when setting user data (XSS prevention)
- All IDs must be unique across the page
- Use event delegation where appropriate
- Provide loading/empty/error states
- All interactive elements need hover/focus states
- Confirmations before delete operations
- Toast messages for CRUD operations
