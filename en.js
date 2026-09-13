(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    const en = {
        nav: {
            home: 'Home',
            about: 'About Us',
            services: 'Services',
            news: 'News',
            results: 'Results',
            register: 'Register',
            contact: 'Contact Us',
            login: 'Login',
            logout: 'Logout'
        },
        hero: {
            title: 'Building Knowledge... Shaping the Future',
            subtitle: 'A pioneering educational environment combining tradition and modernity to prepare an outstanding generation',
            registerBtn: 'Register Now',
            resultsBtn: 'Check Results'
        },
        sections: {
            whyUs: 'Why Us?',
            stages: 'Educational Stages',
            services: 'Our Services',
            announcements: 'Announcements',
            news: 'School News',
            stats: 'Statistics',
            testimonials: 'Parents Testimonials',
            cta: 'Join Us'
        },
        auth: {
            login: 'Login',
            email: 'Email',
            password: 'Password',
            rememberMe: 'Remember Me',
            forgotPassword: 'Forgot Password?',
            loginBtn: 'Login',
            logging: 'Logging in...',
            invalidCredentials: 'Invalid email or password',
            welcome: 'Welcome'
        },
        dashboard: {
            home: 'Dashboard',
            students: 'Students',
            teachers: 'Teachers',
            classes: 'Classes',
            subjects: 'Subjects',
            grades: 'Grades',
            attendance: 'Attendance',
            payments: 'Payments',
            lessons: 'Lessons',
            assignments: 'Assignments',
            exams: 'Exams',
            announcements: 'Announcements',
            registrations: 'Registrations',
            reports: 'Reports',
            schedule: 'Schedule',
            settings: 'Settings',
            notifications: 'Notifications',
            profile: 'Profile',
            children: 'Children'
        },
        common: {
            add: 'Add',
            edit: 'Edit',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            search: 'Search',
            filter: 'Filter',
            print: 'Print',
            export: 'Export',
            confirm: 'Confirm',
            close: 'Close',
            yes: 'Yes',
            no: 'No',
            loading: 'Loading...',
            noData: 'No Data',
            actions: 'Actions',
            status: 'Status',
            active: 'Active',
            inactive: 'Inactive',
            view: 'View',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            submit: 'Submit',
            total: 'Total',
            all: 'All'
        },
        student: {
            studentId: 'Student ID',
            seatNumber: 'Seat Number',
            fullName: 'Full Name',
            firstName: 'First Name',
            fatherName: 'Father Name',
            grandfatherName: 'Grandfather Name',
            familyName: 'Family Name'
        },
        grade: {
            assignment: 'Assignment',
            midterm: 'Midterm',
            final: 'Final',
            total: 'Total',
            percentage: 'Percentage',
            letterGrade: 'Grade'
        },
        attendanceStatus: {
            present: 'Present',
            absent: 'Absent',
            late: 'Late',
            excused: 'Excused'
        },
        payment: {
            paid: 'Paid',
            partial: 'Partial',
            pending: 'Pending',
            overdue: 'Overdue',
            tuition: 'Tuition Fee',
            registration: 'Registration Fee',
            books: 'Books Fee',
            transport: 'Transport Fee'
        },
        messages: {
            saveSuccess: 'Saved successfully',
            deleteSuccess: 'Deleted successfully',
            deleteConfirm: 'Are you sure you want to delete?',
            error: 'An error occurred',
            required: 'This field is required',
            invalidEmail: 'Invalid email',
            invalidPhone: 'Invalid phone number',
            minLength: 'Minimum length is {{val}}',
            maxLength: 'Maximum length is {{val}}',
            min: 'Minimum value is {{val}}',
            max: 'Maximum value is {{val}}',
            match: 'Fields do not match'
        },
        notifications: {
            empty: 'No notifications'
        }
    };
    
    if (App.I18n) {
        App.I18n.addTranslations('en', en);
    } else {
        window.addEventListener('appReady', () => {
            if (App.I18n) App.I18n.addTranslations('en', en);
        });
    }
})();
