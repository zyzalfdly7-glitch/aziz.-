# المدرسة الوطنية النموذجية — Al-Wataniya Model School
## منصة إدارة المدرسة الإلكترونية | School Management Platform

### Description
هذه المنصة هي نموذج واجهة أمامية متكامل لإدارة المدرسة الإلكترونية، مصممة لتلبية احتياجات الإدارة، المعلمين، الطلاب، وأولياء الأمور. تدعم المنصة اللغة العربية بالكامل وتوفر تصميمًا عصريًا وسهل الاستخدام.
This platform is a comprehensive school management front-end prototype designed to meet the needs of administrators, teachers, students, and parents. It fully supports the Arabic language and features a modern, user-friendly design.

### ⚠️ Important Notice
هذا الإصدار Front-End Prototype. لتحويله إلى Production يجب إضافة:
- Backend حقيقي (Node.js, Python, etc.)
- قاعدة بيانات (PostgreSQL, MySQL)
- Authentication Server (JWT, OAuth)
- Payment Gateway
- File Storage Service
- HTTPS

### Demo Accounts
| Role | Arabic Name | Email | Password |
|---|---|---|---|
| Admin | أحمد محمد العمري | admin@school.com | Admin@2026 |
| Teacher | خالد عبدالله السعيد | teacher@school.com | Teacher@2026 |
| Student | عمر أحمد الحربي | student@school.com | Student@2026 |
| Parent | محمد أحمد الحربي | parent@school.com | Parent@2026 |
| Accountant | سعد إبراهيم الدوسري | accountant@school.com | Accountant@2026 |

### Features
- [x] Multi-role Authentication
- [x] Admin Dashboard
- [x] Teacher Dashboard
- [x] Student Dashboard
- [x] Parent Dashboard
- [x] Accountant Dashboard
- [x] User Management
- [x] Student Registration
- [x] Class & Section Management
- [x] Subject Management
- [x] Gradebook & Results
- [x] Attendance Tracking
- [x] Payment & Fee Management
- [x] Lesson & Content Management
- [x] Assignment Management
- [x] Online Exams
- [x] Announcements & News
- [x] Notifications System
- [x] Schedule Management
- [x] Real-time Search & Filtering
- [x] Bilingual Support (AR/EN)
- [x] Dark/Light Mode Theme
- [x] Data Export (CSV, Print)
- [x] Responsive Design

### Technology
- HTML5, CSS3, JavaScript ES6+
- No frameworks, no build tools
- LocalStorage for data persistence
- SVG charts (no external libraries)

### How to Run
1. Open index.html in a modern browser
2. Or use a local server: `python -m http.server 8000` then visit localhost:8000

### Project Structure
```text
/
├── assets/          # Images, icons, logos
├── css/             # CSS stylesheets (modular)
├── js/              # JavaScript modules and app logic
├── pages/           # Public pages (login, about, etc.)
├── dashboards/      # Role-based dashboards
│   ├── admin/       # Admin pages
│   ├── teacher/     # Teacher pages
│   ├── student/     # Student pages
│   ├── parent/      # Parent pages
│   ├── accountant/  # Accountant pages
│   └── shared/      # Shared pages (notifications, settings)
├── index.html       # Landing page
└── README.md        # Project documentation
```

### Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### License
All rights reserved - المدرسة الوطنية النموذجية
