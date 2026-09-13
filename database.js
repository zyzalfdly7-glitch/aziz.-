(function() {
    'use strict';
    const App = window.App = window.App || {};
    
    App.DB = {
        init: function() {
            if (!this.isSeeded()) {
                if (App.Seed && typeof App.Seed.run === 'function') {
                    App.Seed.run();
                } else {
                    console.error('App.Seed.run is not defined. Data cannot be seeded.');
                }
            }
        },
        
        isSeeded: function() {
            return App.Storage.has('users');
        },
        
        reset: function() {
            App.Storage.clear();
            this.init();
        },
        
        _getCollection: function(name) {
            return App.Storage.get(name) || [];
        },
        
        _setCollection: function(name, data) {
            App.Storage.set(name, data);
        },
        
        getAll: function(collection) {
            return this._getCollection(collection);
        },
        
        getById: function(collection, id) {
            const data = this._getCollection(collection);
            return data.find(item => item.id === id) || null;
        },
        
        query: function(collection, filterFn) {
            const data = this._getCollection(collection);
            return data.filter(filterFn);
        },
        
        create: function(collection, item) {
            const data = this._getCollection(collection);
            const newItem = {
                ...item,
                id: App.Utils.generateId(),
                createdAt: new Date().toISOString()
            };
            data.push(newItem);
            this._setCollection(collection, data);
            return newItem;
        },
        
        update: function(collection, id, updates) {
            const data = this._getCollection(collection);
            const index = data.findIndex(item => item.id === id);
            if (index !== -1) {
                const updatedItem = { ...data[index], ...updates };
                data[index] = updatedItem;
                this._setCollection(collection, data);
                return updatedItem;
            }
            return null;
        },
        
        delete: function(collection, id) {
            let data = this._getCollection(collection);
            const initialLength = data.length;
            data = data.filter(item => item.id !== id);
            if (data.length !== initialLength) {
                this._setCollection(collection, data);
                return true;
            }
            return false;
        },
        
        count: function(collection, filterFn) {
            const data = this._getCollection(collection);
            if (filterFn) {
                return data.filter(filterFn).length;
            }
            return data.length;
        },
        
        getStudentsByClass: function(classId, sectionId) {
            return this.query('students', s => s.classId === classId && (!sectionId || s.sectionId === sectionId));
        },
        
        getGradesByStudent: function(studentId, year) {
            return this.query('grades', g => g.studentId === studentId && (!year || g.academicYear === year));
        },
        
        getAttendanceByStudent: function(studentId, dateFrom, dateTo) {
            return this.query('attendance', a => {
                if (a.studentId !== studentId) return false;
                if (dateFrom && new Date(a.date) < new Date(dateFrom)) return false;
                if (dateTo && new Date(a.date) > new Date(dateTo)) return false;
                return true;
            });
        },
        
        getPaymentsByStudent: function(studentId) {
            return this.query('payments', p => p.studentId === studentId);
        },
        
        getScheduleByClass: function(classId, sectionId) {
            return this.query('schedule', s => s.classId === classId && s.sectionId === sectionId);
        },
        
        getTeacherSubjects: function(teacherId) {
            const teacher = this.getById('teachers', teacherId);
            if (!teacher || !teacher.subjectIds) return [];
            return teacher.subjectIds.map(id => this.getById('subjects', id)).filter(Boolean);
        },
        
        getTeacherClasses: function(teacherId) {
            const teacher = this.getById('teachers', teacherId);
            if (!teacher || !teacher.classIds) return [];
            return teacher.classIds.map(id => this.getById('classes', id)).filter(Boolean);
        },
        
        getParentChildren: function(parentId) {
            const parent = this.getById('parents', parentId);
            if (!parent || !parent.childrenIds) return [];
            return parent.childrenIds.map(id => this.getById('students', id)).filter(Boolean);
        },
        
        getUserByEmail: function(email) {
            if (!email) return null;
            const users = this._getCollection('users');
            return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
        },
        
        getStudentByUserId: function(userId) {
            const students = this._getCollection('students');
            return students.find(s => s.userId === userId) || null;
        },
        
        getTeacherByUserId: function(userId) {
            const teachers = this._getCollection('teachers');
            return teachers.find(t => t.userId === userId) || null;
        },
        
        getParentByUserId: function(userId) {
            const parents = this._getCollection('parents');
            return parents.find(p => p.userId === userId) || null;
        },
        
        getSubjectById: function(id) {
            return this.getById('subjects', id);
        },
        
        getClassById: function(id) {
            return this.getById('classes', id);
        },
        
        getSectionById: function(id) {
            return this.getById('sections', id);
        }
    };
})();
