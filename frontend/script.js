// ====== GLOBAL VARIABLES & INITIALIZATION ======
let students = JSON.parse(localStorage.getItem('students')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
let studentAttendance = JSON.parse(localStorage.getItem('studentAttendance')) || {};
let teacherAttendance = JSON.parse(localStorage.getItem('teacherAttendance')) || {};
let selectedStudents = new Set();
let selectedTeachers = new Set();

// DOM Elements
const pageTitle = document.getElementById('page-title');
const totalStudentsElement = document.getElementById('total-students');
const totalTeachersElement = document.getElementById('total-teachers');
const attendanceTodayElement = document.getElementById('attendance-today');
const totalSemestersElement = document.getElementById('total-semesters');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen
    showLoadingScreen();
    
    // Simulate loading time (2 seconds)
    setTimeout(() => {
        // Set today's date for attendance
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('attendance-date').value = today;
        document.getElementById('teacher-attendance-date').value = today;
        
        // Set default date range for view attendance (last 7 days)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        document.getElementById('view-from-date').value = lastWeek.toISOString().split('T')[0];
        document.getElementById('view-to-date').value = today;
        document.getElementById('view-teacher-from-date').value = lastWeek.toISOString().split('T')[0];
        document.getElementById('view-teacher-to-date').value = today;
        
        // Initialize dashboard stats
        updateDashboardStats();
        
        // Load initial data
        loadStudentsTable();
        loadTeachersTable();
        loadStudentAttendanceTable();
        loadTeacherAttendanceTable();
        loadViewStudentAttendance();
        loadViewTeacherAttendance();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup menu navigation
        setupMenuNavigation();
        
        // Setup quick actions
        setupQuickActions();
        
        // Setup logout functionality
        setupLogout();
        
        // Hide loading screen
        hideLoadingScreen();
        
        // Show initial toast notification
        showToast('Welcome to EduTrack Pro Dashboard!', 'success');
    }, 2000);
});

// ====== LOADING SCREEN FUNCTIONS ======
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
}

// ====== DASHBOARD STATS ======
function updateDashboardStats() {
    // Update student count
    totalStudentsElement.textContent = students.length;
    
    // Update teacher count
    totalTeachersElement.textContent = teachers.length;
    
    // Update active semesters count
    const semesters = new Set(students.map(student => student.semester));
    totalSemestersElement.textContent = semesters.size;
    
    // Calculate today's attendance percentage
    const today = new Date().toISOString().split('T')[0];
    let todayAttendance = 0;
    let totalAttendance = 0;
    
    if (studentAttendance[today]) {
        const todayRecords = Object.values(studentAttendance[today]);
        totalAttendance += todayRecords.length;
        todayAttendance += todayRecords.filter(record => record.status === 'present').length;
    }
    
    if (teacherAttendance[today]) {
        const todayTeacherRecords = Object.values(teacherAttendance[today]);
        totalAttendance += todayTeacherRecords.length;
        todayAttendance += todayTeacherRecords.filter(record => record.status === 'present').length;
    }
    
    const attendancePercentage = totalAttendance > 0 ? Math.round((todayAttendance / totalAttendance) * 100) : 0;
    attendanceTodayElement.textContent = `${attendancePercentage}%`;
}

// ====== MENU NAVIGATION ======
function setupMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items and content sections
            menuItems.forEach(mi => mi.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Show corresponding content section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Update page title
            const title = this.querySelector('span').textContent;
            pageTitle.textContent = title;
            
            // Update data tables when switching to relevant sections
            if (sectionId === 'view-students') {
                loadStudentsTable();
            } else if (sectionId === 'view-teachers') {
                loadTeachersTable();
            } else if (sectionId === 'mark-student-attendance') {
                loadStudentAttendanceTable();
            } else if (sectionId === 'view-student-attendance') {
                loadViewStudentAttendance();
            } else if (sectionId === 'mark-teacher-attendance') {
                loadTeacherAttendanceTable();
            } else if (sectionId === 'view-teacher-attendance') {
                loadViewTeacherAttendance();
            }
        });
    });
}

// ====== LOGOUT FUNCTIONALITY ======
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const cancelLogoutBtn = document.getElementById('cancel-logout');
    const confirmLogoutBtn = document.getElementById('confirm-logout');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Open logout modal
    logoutBtn.addEventListener('click', function() {
        logoutModal.classList.add('active');
    });
    
    // Cancel logout
    cancelLogoutBtn.addEventListener('click', function() {
        logoutModal.classList.remove('active');
    });
    
    // Confirm logout
    confirmLogoutBtn.addEventListener('click', function() {
        logoutModal.classList.remove('active');
        showLoadingScreen();
        
        // Simulate logout process
        setTimeout(() => {
            // Clear any temporary data
            selectedStudents.clear();
            selectedTeachers.clear();
            
            // Show logout message
            showToast('Logged out successfully!', 'success');
            
            // Reload the page after logout (in a real app, this would redirect to login)
            setTimeout(() => {
                hideLoadingScreen();
                // In a real application, you would redirect to login page
                // window.location.href = 'login.html';
                
                // For demo purposes, just reset to dashboard
                document.querySelector('.menu-item[data-section="dashboard"]').click();
                showToast('Dashboard refreshed after logout', 'info');
            }, 1000);
        }, 1500);
    });
    
    // Close modal with X button
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            logoutModal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    logoutModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}

// ====== QUICK ACTIONS ======
function setupQuickActions() {
    // Quick add student
    document.getElementById('quick-add-student').addEventListener('click', function() {
        document.querySelector('.menu-item[data-section="add-student"]').click();
    });
    
    // Quick add teacher
    document.getElementById('quick-add-teacher').addEventListener('click', function() {
        document.querySelector('.menu-item[data-section="add-teacher"]').click();
    });
    
    // Quick mark attendance
    document.getElementById('quick-mark-attendance').addEventListener('click', function() {
        document.querySelector('.menu-item[data-section="mark-student-attendance"]').click();
    });
    
    // Quick view reports
    document.getElementById('quick-view-reports').addEventListener('click', function() {
        showToast('Reports feature coming soon!', 'info');
    });
}

// ====== STUDENT MANAGEMENT ======
// Add Student
document.getElementById('student-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('student-name').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const password = document.getElementById('student-password').value;
    const semester = document.getElementById('student-semester').value;
    const phone = document.getElementById('student-phone').value.trim();
    const address = document.getElementById('student-address').value.trim();
    
    // Validate form
    if (!validateStudentForm(name, email, password, semester)) {
        return;
    }
    
    // Check if email already exists
    if (students.some(student => student.email === email)) {
        showError('student-email', 'A student with this email already exists');
        return;
    }
    
    // Create new student object
    const newStudent = {
        id: generateId(),
        name: name,
        email: email,
        password: password,
        semester: semester,
        phone: phone,
        address: address,
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    // Add to students array
    students.push(newStudent);
    
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));
    
    // Show success message
    showToast(`Student "${name}" added successfully!`, 'success');
    
    // Reset form
    document.getElementById('student-form').reset();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Update student filter in view attendance
    updateStudentFilterOptions();
    
    // If on view students page, reload the table
    if (document.getElementById('view-students').classList.contains('active')) {
        loadStudentsTable();
    }
});

// Reset student form
document.getElementById('reset-student-form').addEventListener('click', function() {
    document.getElementById('student-form').reset();
    clearAllErrors();
});

// Load students table
function loadStudentsTable() {
    const tableBody = document.getElementById('students-table-body');
    const searchTerm = document.getElementById('search-student').value.toLowerCase();
    const filterSemester = document.getElementById('filter-semester').value;
    
    // Filter students
    let filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                              student.email.toLowerCase().includes(searchTerm) ||
                              student.semester.toString().includes(searchTerm);
        const matchesSemester = !filterSemester || student.semester === filterSemester;
        return matchesSearch && matchesSemester;
    });
    
    // Clear table
    tableBody.innerHTML = '';
    
    // If no students found
    if (filteredStudents.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6" class="text-center">No students found matching your criteria</td>
            </tr>
        `;
        return;
    }
    
    // Add rows for each student
    filteredStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>
                <div class="student-name">${student.name}</div>
                <div class="student-email">${student.email}</div>
            </td>
            <td>Semester ${student.semester}</td>
            <td>${student.phone || 'N/A'}</td>
            <td>${student.address ? student.address.substring(0, 20) + '...' : 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" data-id="${student.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${student.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.getAttribute('data-id');
            editStudent(studentId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.getAttribute('data-id');
            deleteStudent(studentId);
        });
    });
}

// Edit student
function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Fill the edit form
    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-student-name').value = student.name;
    document.getElementById('edit-student-email').value = student.email;
    document.getElementById('edit-student-semester').value = student.semester;
    document.getElementById('edit-student-phone').value = student.phone || '';
    
    // Show the modal
    document.getElementById('edit-student-modal').classList.add('active');
}

// Update student
document.getElementById('update-student').addEventListener('click', function() {
    const studentId = document.getElementById('edit-student-id').value;
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) return;
    
    // Update student details
    students[studentIndex].name = document.getElementById('edit-student-name').value.trim();
    students[studentIndex].email = document.getElementById('edit-student-email').value.trim();
    students[studentIndex].semester = document.getElementById('edit-student-semester').value;
    students[studentIndex].phone = document.getElementById('edit-student-phone').value.trim();
    
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));
    
    // Close modal
    document.getElementById('edit-student-modal').classList.remove('active');
    
    // Show success message
    showToast('Student details updated successfully!', 'success');
    
    // Reload the table
    loadStudentsTable();
    updateDashboardStats();
    updateStudentFilterOptions();
});

// Delete student
function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Show confirmation modal
    const modal = document.getElementById('confirmation-modal');
    const message = document.getElementById('modal-message');
    message.textContent = `Are you sure you want to delete student "${student.name}"? This action cannot be undone.`;
    
    modal.classList.add('active');
    
    // Set up confirm action
    document.getElementById('confirm-action').onclick = function() {
        // Remove student from array
        students = students.filter(s => s.id !== studentId);
        
        // Save to localStorage
        localStorage.setItem('students', JSON.stringify(students));
        
        // Close modal
        modal.classList.remove('active');
        
        // Show success message
        showToast(`Student "${student.name}" deleted successfully!`, 'success');
        
        // Reload table and update stats
        loadStudentsTable();
        updateDashboardStats();
        updateStudentFilterOptions();
    };
    
    // Set up cancel action
    document.getElementById('cancel-action').onclick = function() {
        modal.classList.remove('active');
    };
    
    // Close modal when clicking close button
    document.querySelector('.close-modal').onclick = function() {
        modal.classList.remove('active');
    };
}

// Student form validation
function validateStudentForm(name, email, password, semester) {
    let isValid = true;
    
    // Clear all errors
    clearAllErrors();
    
    // Validate name
    if (!name) {
        showError('student-name', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('student-email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('student-email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('student-password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('student-password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate semester
    if (!semester) {
        showError('student-semester', 'Please select a semester');
        isValid = false;
    }
    
    return isValid;
}

// ====== TEACHER MANAGEMENT ======
// Add Teacher
document.getElementById('teacher-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('teacher-name').value.trim();
    const email = document.getElementById('teacher-email').value.trim();
    const password = document.getElementById('teacher-password').value;
    const subject = document.getElementById('teacher-subject').value;
    const experience = document.getElementById('teacher-experience').value;
    const qualification = document.getElementById('teacher-qualification').value.trim();
    
    // Validate form
    if (!validateTeacherForm(name, email, password, subject)) {
        return;
    }
    
    // Check if email already exists
    if (teachers.some(teacher => teacher.email === email)) {
        showError('teacher-email', 'A teacher with this email already exists');
        return;
    }
    
    // Create new teacher object
    const newTeacher = {
        id: generateId(),
        name: name,
        email: email,
        password: password,
        subject: subject,
        experience: experience || '0',
        qualification: qualification || 'Not specified',
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    // Add to teachers array
    teachers.push(newTeacher);
    
    // Save to localStorage
    localStorage.setItem('teachers', JSON.stringify(teachers));
    
    // Show success message
    showToast(`Teacher "${name}" added successfully!`, 'success');
    
    // Reset form
    document.getElementById('teacher-form').reset();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Update teacher filter in view attendance
    updateTeacherFilterOptions();
    
    // If on view teachers page, reload the table
    if (document.getElementById('view-teachers').classList.contains('active')) {
        loadTeachersTable();
    }
});

// Reset teacher form
document.getElementById('reset-teacher-form').addEventListener('click', function() {
    document.getElementById('teacher-form').reset();
    clearAllErrors();
});

// Load teachers table
function loadTeachersTable() {
    const tableBody = document.getElementById('teachers-table-body');
    const searchTerm = document.getElementById('search-teacher').value.toLowerCase();
    const filterSubject = document.getElementById('filter-subject').value;
    
    // Filter teachers
    let filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm) || 
                              teacher.email.toLowerCase().includes(searchTerm) ||
                              teacher.subject.toLowerCase().includes(searchTerm);
        const matchesSubject = !filterSubject || teacher.subject === filterSubject;
        return matchesSearch && matchesSubject;
    });
    
    // Clear table
    tableBody.innerHTML = '';
    
    // If no teachers found
    if (filteredTeachers.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6" class="text-center">No teachers found matching your criteria</td>
            </tr>
        `;
        return;
    }
    
    // Add rows for each teacher
    filteredTeachers.forEach((teacher, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.id}</td>
            <td>
                <div class="teacher-name">${teacher.name}</div>
                <div class="teacher-email">${teacher.email}</div>
            </td>
            <td>${teacher.subject}</td>
            <td>${teacher.experience} years</td>
            <td>${teacher.qualification}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" data-id="${teacher.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${teacher.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const teacherId = this.getAttribute('data-id');
            editTeacher(teacherId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const teacherId = this.getAttribute('data-id');
            deleteTeacher(teacherId);
        });
    });
}

// Edit teacher
function editTeacher(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    // Fill the edit form
    document.getElementById('edit-teacher-id').value = teacher.id;
    document.getElementById('edit-teacher-name').value = teacher.name;
    document.getElementById('edit-teacher-email').value = teacher.email;
    document.getElementById('edit-teacher-subject').value = teacher.subject;
    document.getElementById('edit-teacher-experience').value = teacher.experience;
    
    // Show the modal
    document.getElementById('edit-teacher-modal').classList.add('active');
}

// Update teacher
document.getElementById('update-teacher').addEventListener('click', function() {
    const teacherId = document.getElementById('edit-teacher-id').value;
    const teacherIndex = teachers.findIndex(t => t.id === teacherId);
    
    if (teacherIndex === -1) return;
    
    // Update teacher details
    teachers[teacherIndex].name = document.getElementById('edit-teacher-name').value.trim();
    teachers[teacherIndex].email = document.getElementById('edit-teacher-email').value.trim();
    teachers[teacherIndex].subject = document.getElementById('edit-teacher-subject').value;
    teachers[teacherIndex].experience = document.getElementById('edit-teacher-experience').value;
    
    // Save to localStorage
    localStorage.setItem('teachers', JSON.stringify(teachers));
    
    // Close modal
    document.getElementById('edit-teacher-modal').classList.remove('active');
    
    // Show success message
    showToast('Teacher details updated successfully!', 'success');
    
    // Reload the table
    loadTeachersTable();
    updateDashboardStats();
    updateTeacherFilterOptions();
});

// Delete teacher
function deleteTeacher(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    // Show confirmation modal
    const modal = document.getElementById('confirmation-modal');
    const message = document.getElementById('modal-message');
    message.textContent = `Are you sure you want to delete teacher "${teacher.name}"? This action cannot be undone.`;
    
    modal.classList.add('active');
    
    // Set up confirm action
    document.getElementById('confirm-action').onclick = function() {
        // Remove teacher from array
        teachers = teachers.filter(t => t.id !== teacherId);
        
        // Save to localStorage
        localStorage.setItem('teachers', JSON.stringify(teachers));
        
        // Close modal
        modal.classList.remove('active');
        
        // Show success message
        showToast(`Teacher "${teacher.name}" deleted successfully!`, 'success');
        
        // Reload table and update stats
        loadTeachersTable();
        updateDashboardStats();
        updateTeacherFilterOptions();
    };
    
    // Set up cancel action
    document.getElementById('cancel-action').onclick = function() {
        modal.classList.remove('active');
    };
}

// Teacher form validation
function validateTeacherForm(name, email, password, subject) {
    let isValid = true;
    
    // Clear all errors
    clearAllErrors();
    
    // Validate name
    if (!name) {
        showError('teacher-name', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('teacher-email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('teacher-email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('teacher-password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('teacher-password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate subject
    if (!subject) {
        showError('teacher-subject', 'Please select a subject');
        isValid = false;
    }
    
    return isValid;
}

// ====== ATTENDANCE SYSTEM ======
// Load student attendance table (for marking)
function loadStudentAttendanceTable() {
    const tableBody = document.getElementById('student-attendance-body');
    const date = document.getElementById('attendance-date').value;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Clear selected students
    selectedStudents.clear();
    updateSelectedCount();
    
    // If no students
    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6" class="text-center">No students found. Add students first!</td>
            </tr>
        `;
        updateAttendanceSummaryBar(0, 0, 0);
        return;
    }
    
    let presentCount = 0;
    let absentCount = 0;
    
    // Add rows for each student
    students.forEach(student => {
        // Get attendance status for this date
        let status = 'absent';
        if (studentAttendance[date] && studentAttendance[date][student.id]) {
            status = studentAttendance[date][student.id].status;
        }
        
        if (status === 'present') presentCount++;
        else absentCount++;
        
        const isSelected = selectedStudents.has(student.id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="attendance-checkbox" data-id="${student.id}" ${isSelected ? 'checked' : ''}>
            </td>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>Semester ${student.semester}</td>
            <td>
                <span class="attendance-status ${status === 'present' ? 'status-present' : 'status-absent'}">
                    ${status === 'present' ? 'Present' : 'Absent'}
                </span>
            </td>
            <td>
                <button class="toggle-attendance ${status === 'present' ? 'toggle-absent' : 'toggle-present'}" 
                        data-id="${student.id}" data-status="${status}">
                    ${status === 'present' ? 'Mark Absent' : 'Mark Present'}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update attendance summary bar
    updateAttendanceSummaryBar(students.length, presentCount, absentCount);
    
    // Add event listeners to toggle buttons
    document.querySelectorAll('.toggle-attendance').forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-status');
            const newStatus = currentStatus === 'present' ? 'absent' : 'present';
            
            // Update attendance
            toggleStudentAttendance(studentId, newStatus);
        });
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.attendance-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const studentId = this.getAttribute('data-id');
            
            if (this.checked) {
                selectedStudents.add(studentId);
            } else {
                selectedStudents.delete(studentId);
            }
            
            updateSelectedCount();
        });
    });
}

// Update selected count display
function updateSelectedCount() {
    const selectedCountElement = document.getElementById('selected-count');
    selectedCountElement.textContent = selectedStudents.size;
}

// Update teacher selected count display
function updateTeacherSelectedCount() {
    const selectedCountElement = document.getElementById('teacher-selected-count');
    selectedCountElement.textContent = selectedTeachers.size;
}

// Update attendance summary bar
function updateAttendanceSummaryBar(total, present, absent) {
    document.getElementById('attendance-total-students').textContent = total;
    document.getElementById('attendance-present-count').textContent = present;
    document.getElementById('attendance-absent-count').textContent = absent;
    
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    document.getElementById('attendance-percentage-count').textContent = `${percentage}%`;
}

// Update teacher attendance summary bar
function updateTeacherAttendanceSummaryBar(total, present, absent) {
    document.getElementById('teacher-attendance-total').textContent = total;
    document.getElementById('teacher-present-count').textContent = present;
    document.getElementById('teacher-absent-count').textContent = absent;
    
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    document.getElementById('teacher-percentage-count').textContent = `${percentage}%`;
}

// Toggle student attendance
function toggleStudentAttendance(studentId, status) {
    const date = document.getElementById('attendance-date').value;
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    // Initialize date object if it doesn't exist
    if (!studentAttendance[date]) {
        studentAttendance[date] = {};
    }
    
    // Update attendance record
    studentAttendance[date][studentId] = {
        studentId: studentId,
        studentName: student.name,
        status: status,
        date: date
    };
    
    // Save to localStorage
    localStorage.setItem('studentAttendance', JSON.stringify(studentAttendance));
    
    // Reload table
    loadStudentAttendanceTable();
    updateDashboardStats();
}

// Load teacher attendance table (for marking)
function loadTeacherAttendanceTable() {
    const tableBody = document.getElementById('teacher-attendance-body');
    const date = document.getElementById('teacher-attendance-date').value;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Clear selected teachers
    selectedTeachers.clear();
    updateTeacherSelectedCount();
    
    // If no teachers
    if (teachers.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6" class="text-center">No teachers found. Add teachers first!</td>
            </tr>
        `;
        updateTeacherAttendanceSummaryBar(0, 0, 0);
        return;
    }
    
    let presentCount = 0;
    let absentCount = 0;
    
    // Add rows for each teacher
    teachers.forEach(teacher => {
        // Get attendance status for this date
        let status = 'absent';
        if (teacherAttendance[date] && teacherAttendance[date][teacher.id]) {
            status = teacherAttendance[date][teacher.id].status;
        }
        
        if (status === 'present') presentCount++;
        else absentCount++;
        
        const isSelected = selectedTeachers.has(teacher.id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="attendance-checkbox" data-id="${teacher.id}" ${isSelected ? 'checked' : ''}>
            </td>
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.subject}</td>
            <td>
                <span class="attendance-status ${status === 'present' ? 'status-present' : 'status-absent'}">
                    ${status === 'present' ? 'Present' : 'Absent'}
                </span>
            </td>
            <td>
                <button class="toggle-attendance ${status === 'present' ? 'toggle-absent' : 'toggle-present'}" 
                        data-id="${teacher.id}" data-status="${status}">
                    ${status === 'present' ? 'Mark Absent' : 'Mark Present'}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update attendance summary bar
    updateTeacherAttendanceSummaryBar(teachers.length, presentCount, absentCount);
    
    // Add event listeners to toggle buttons
    document.querySelectorAll('.toggle-attendance').forEach(button => {
        button.addEventListener('click', function() {
            const teacherId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-status');
            const newStatus = currentStatus === 'present' ? 'absent' : 'present';
            
            // Update attendance
            toggleTeacherAttendance(teacherId, newStatus);
        });
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.attendance-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const teacherId = this.getAttribute('data-id');
            
            if (this.checked) {
                selectedTeachers.add(teacherId);
            } else {
                selectedTeachers.delete(teacherId);
            }
            
            updateTeacherSelectedCount();
        });
    });
}

// Toggle teacher attendance
function toggleTeacherAttendance(teacherId, status) {
    const date = document.getElementById('teacher-attendance-date').value;
    const teacher = teachers.find(t => t.id === teacherId);
    
    if (!teacher) return;
    
    // Initialize date object if it doesn't exist
    if (!teacherAttendance[date]) {
        teacherAttendance[date] = {};
    }
    
    // Update attendance record
    teacherAttendance[date][teacherId] = {
        teacherId: teacherId,
        teacherName: teacher.name,
        status: status,
        date: date
    };
    
    // Save to localStorage
    localStorage.setItem('teacherAttendance', JSON.stringify(teacherAttendance));
    
    // Reload table
    loadTeacherAttendanceTable();
    updateDashboardStats();
}

// Mark selected students present/absent
document.getElementById('mark-selected-present').addEventListener('click', function() {
    if (selectedStudents.size === 0) {
        showToast('Please select at least one student', 'info');
        return;
    }
    
    const date = document.getElementById('attendance-date').value;
    
    selectedStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        
        if (!studentAttendance[date]) {
            studentAttendance[date] = {};
        }
        
        studentAttendance[date][studentId] = {
            studentId: studentId,
            studentName: student.name,
            status: 'present',
            date: date
        };
    });
    
    localStorage.setItem('studentAttendance', JSON.stringify(studentAttendance));
    loadStudentAttendanceTable();
    updateDashboardStats();
    showToast(`Marked ${selectedStudents.size} selected students as present!`, 'success');
});

document.getElementById('mark-selected-absent').addEventListener('click', function() {
    if (selectedStudents.size === 0) {
        showToast('Please select at least one student', 'info');
        return;
    }
    
    const date = document.getElementById('attendance-date').value;
    
    selectedStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        
        if (!studentAttendance[date]) {
            studentAttendance[date] = {};
        }
        
        studentAttendance[date][studentId] = {
            studentId: studentId,
            studentName: student.name,
            status: 'absent',
            date: date
        };
    });
    
    localStorage.setItem('studentAttendance', JSON.stringify(studentAttendance));
    loadStudentAttendanceTable();
    updateDashboardStats();
    showToast(`Marked ${selectedStudents.size} selected students as absent!`, 'info');
});

// Mark selected teachers present/absent
document.getElementById('mark-teachers-selected-present').addEventListener('click', function() {
    if (selectedTeachers.size === 0) {
        showToast('Please select at least one teacher', 'info');
        return;
    }
    
    const date = document.getElementById('teacher-attendance-date').value;
    
    selectedTeachers.forEach(teacherId => {
        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;
        
        if (!teacherAttendance[date]) {
            teacherAttendance[date] = {};
        }
        
        teacherAttendance[date][teacherId] = {
            teacherId: teacherId,
            teacherName: teacher.name,
            status: 'present',
            date: date
        };
    });
    
    localStorage.setItem('teacherAttendance', JSON.stringify(teacherAttendance));
    loadTeacherAttendanceTable();
    updateDashboardStats();
    showToast(`Marked ${selectedTeachers.size} selected teachers as present!`, 'success');
});

document.getElementById('mark-teachers-selected-absent').addEventListener('click', function() {
    if (selectedTeachers.size === 0) {
        showToast('Please select at least one teacher', 'info');
        return;
    }
    
    const date = document.getElementById('teacher-attendance-date').value;
    
    selectedTeachers.forEach(teacherId => {
        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;
        
        if (!teacherAttendance[date]) {
            teacherAttendance[date] = {};
        }
        
        teacherAttendance[date][teacherId] = {
            teacherId: teacherId,
            teacherName: teacher.name,
            status: 'absent',
            date: date
        };
    });
    
    localStorage.setItem('teacherAttendance', JSON.stringify(teacherAttendance));
    loadTeacherAttendanceTable();
    updateDashboardStats();
    showToast(`Marked ${selectedTeachers.size} selected teachers as absent!`, 'info');
});

// Clear selection
document.getElementById('clear-selection').addEventListener('click', function() {
    selectedStudents.clear();
    updateSelectedCount();
    document.querySelectorAll('.attendance-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    showToast('Selection cleared', 'info');
});

document.getElementById('teacher-clear-selection').addEventListener('click', function() {
    selectedTeachers.clear();
    updateTeacherSelectedCount();
    document.querySelectorAll('.attendance-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    showToast('Selection cleared', 'info');
});

// Mark all students present/absent
document.getElementById('mark-all-present').addEventListener('click', function() {
    const date = document.getElementById('attendance-date').value;
    
    students.forEach(student => {
        if (!studentAttendance[date]) {
            studentAttendance[date] = {};
        }
        studentAttendance[date][student.id] = {
            studentId: student.id,
            studentName: student.name,
            status: 'present',
            date: date
        };
    });
    
    localStorage.setItem('studentAttendance', JSON.stringify(studentAttendance));
    loadStudentAttendanceTable();
    updateDashboardStats();
    showToast('All students marked as present!', 'success');
});

document.getElementById('mark-all-absent').addEventListener('click', function() {
    const date = document.getElementById('attendance-date').value;
    
    students.forEach(student => {
        if (!studentAttendance[date]) {
            studentAttendance[date] = {};
        }
        studentAttendance[date][student.id] = {
            studentId: student.id,
            studentName: student.name,
            status: 'absent',
            date: date
        };
    });
    
    localStorage.setItem('studentAttendance', JSON.stringify(studentAttendance));
    loadStudentAttendanceTable();
    updateDashboardStats();
    showToast('All students marked as absent!', 'info');
});

// Mark all teachers present/absent
document.getElementById('mark-all-teachers-present').addEventListener('click', function() {
    const date = document.getElementById('teacher-attendance-date').value;
    
    teachers.forEach(teacher => {
        if (!teacherAttendance[date]) {
            teacherAttendance[date] = {};
        }
        teacherAttendance[date][teacher.id] = {
            teacherId: teacher.id,
            teacherName: teacher.name,
            status: 'present',
            date: date
        };
    });
    
    localStorage.setItem('teacherAttendance', JSON.stringify(teacherAttendance));
    loadTeacherAttendanceTable();
    updateDashboardStats();
    showToast('All teachers marked as present!', 'success');
});

document.getElementById('mark-all-teachers-absent').addEventListener('click', function() {
    const date = document.getElementById('teacher-attendance-date').value;
    
    teachers.forEach(teacher => {
        if (!teacherAttendance[date]) {
            teacherAttendance[date] = {};
        }
        teacherAttendance[date][teacher.id] = {
            teacherId: teacher.id,
            teacherName: teacher.name,
            status: 'absent',
            date: date
        };
    });
    
    localStorage.setItem('teacherAttendance', JSON.stringify(teacherAttendance));
    loadTeacherAttendanceTable();
    updateDashboardStats();
    showToast('All teachers marked as absent!', 'info');
});

// Save attendance
document.getElementById('save-attendance').addEventListener('click', function() {
    const date = document.getElementById('attendance-date').value;
    const hasAttendance = studentAttendance[date] && Object.keys(studentAttendance[date]).length > 0;
    
    if (hasAttendance) {
        showToast('Student attendance saved successfully!', 'success');
    } else {
        showToast('No attendance data to save for today', 'info');
    }
});

document.getElementById('save-teacher-attendance').addEventListener('click', function() {
    const date = document.getElementById('teacher-attendance-date').value;
    const hasAttendance = teacherAttendance[date] && Object.keys(teacherAttendance[date]).length > 0;
    
    if (hasAttendance) {
        showToast('Teacher attendance saved successfully!', 'success');
    } else {
        showToast('No attendance data to save for today', 'info');
    }
});

// ====== VIEW ATTENDANCE FUNCTIONS ======
// Load view student attendance table
function loadViewStudentAttendance() {
    const fromDate = document.getElementById('view-from-date').value;
    const toDate = document.getElementById('view-to-date').value;
    const studentFilter = document.getElementById('view-student-filter').value;
    
    // Update student filter options
    updateStudentFilterOptions();
    
    // Get all dates in range
    const dates = getDatesInRange(fromDate, toDate);
    
    // Clear table
    const tableBody = document.getElementById('view-student-attendance-body');
    tableBody.innerHTML = '';
    
    // If no dates in range or no students
    if (dates.length === 0 || students.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5" class="text-center">No attendance records found for the selected date range.</td>
            </tr>
        `;
        updateAttendanceSummary(0, 0, 0);
        return;
    }
    
    let totalRecords = 0;
    let presentRecords = 0;
    let absentRecords = 0;
    
    // Collect all records
    let allRecords = [];
    
    dates.forEach(date => {
        if (studentAttendance[date]) {
            Object.values(studentAttendance[date]).forEach(record => {
                // Apply student filter
                if (studentFilter && record.studentId !== studentFilter) {
                    return;
                }
                
                allRecords.push({
                    date: date,
                    studentName: record.studentName,
                    studentId: record.studentId,
                    status: record.status,
                    remarks: ''
                });
                
                totalRecords++;
                if (record.status === 'present') presentRecords++;
                else absentRecords++;
            });
        }
    });
    
    // Sort records by date (newest first)
    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add rows to table
    if (allRecords.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5" class="text-center">No attendance records found for the selected criteria.</td>
            </tr>
        `;
    } else {
        allRecords.forEach(record => {
            const student = students.find(s => s.id === record.studentId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(record.date)}</td>
                <td>${record.studentName}</td>
                <td>${student ? `Semester ${student.semester}` : 'N/A'}</td>
                <td>
                    <span class="attendance-status ${record.status === 'present' ? 'status-present' : 'status-absent'}">
                        ${record.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                </td>
                <td>${record.remarks || '-'}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Update summary
    updateAttendanceSummary(totalRecords, presentRecords, absentRecords);
}

// Update student filter options
function updateStudentFilterOptions() {
    const filterSelect = document.getElementById('view-student-filter');
    const currentValue = filterSelect.value;
    
    // Clear existing options except the first one
    filterSelect.innerHTML = '<option value="">All Students</option>';
    
    // Add student options
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        filterSelect.appendChild(option);
    });
    
    // Restore previous selection if it exists
    if (currentValue) {
        filterSelect.value = currentValue;
    }
}

// Update attendance summary
function updateAttendanceSummary(total, present, absent) {
    document.getElementById('total-days').textContent = total;
    document.getElementById('present-days').textContent = present;
    document.getElementById('absent-days').textContent = absent;
    
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    document.getElementById('attendance-percentage').textContent = `${percentage}%`;
}

// Load view teacher attendance table
function loadViewTeacherAttendance() {
    const fromDate = document.getElementById('view-teacher-from-date').value;
    const toDate = document.getElementById('view-teacher-to-date').value;
    const teacherFilter = document.getElementById('view-teacher-filter').value;
    
    // Update teacher filter options
    updateTeacherFilterOptions();
    
    // Get all dates in range
    const dates = getDatesInRange(fromDate, toDate);
    
    // Clear table
    const tableBody = document.getElementById('view-teacher-attendance-body');
    tableBody.innerHTML = '';
    
    // If no dates in range or no teachers
    if (dates.length === 0 || teachers.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5" class="text-center">No attendance records found for the selected date range.</td>
            </tr>
        `;
        updateTeacherAttendanceSummary(0, 0, 0);
        return;
    }
    
    let totalRecords = 0;
    let presentRecords = 0;
    let absentRecords = 0;
    
    // Collect all records
    let allRecords = [];
    
    dates.forEach(date => {
        if (teacherAttendance[date]) {
            Object.values(teacherAttendance[date]).forEach(record => {
                // Apply teacher filter
                if (teacherFilter && record.teacherId !== teacherFilter) {
                    return;
                }
                
                allRecords.push({
                    date: date,
                    teacherName: record.teacherName,
                    teacherId: record.teacherId,
                    status: record.status,
                    remarks: ''
                });
                
                totalRecords++;
                if (record.status === 'present') presentRecords++;
                else absentRecords++;
            });
        }
    });
    
    // Sort records by date (newest first)
    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add rows to table
    if (allRecords.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5" class="text-center">No attendance records found for the selected criteria.</td>
            </tr>
        `;
    } else {
        allRecords.forEach(record => {
            const teacher = teachers.find(t => t.id === record.teacherId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(record.date)}</td>
                <td>${record.teacherName}</td>
                <td>${teacher ? teacher.subject : 'N/A'}</td>
                <td>
                    <span class="attendance-status ${record.status === 'present' ? 'status-present' : 'status-absent'}">
                        ${record.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                </td>
                <td>${record.remarks || '-'}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Update summary
    updateTeacherAttendanceSummary(totalRecords, presentRecords, absentRecords);
}

// Update teacher filter options
function updateTeacherFilterOptions() {
    const filterSelect = document.getElementById('view-teacher-filter');
    const currentValue = filterSelect.value;
    
    // Clear existing options except the first one
    filterSelect.innerHTML = '<option value="">All Teachers</option>';
    
    // Add teacher options
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        filterSelect.appendChild(option);
    });
    
    // Restore previous selection if it exists
    if (currentValue) {
        filterSelect.value = currentValue;
    }
}

// Update teacher attendance summary
function updateTeacherAttendanceSummary(total, present, absent) {
    document.getElementById('teacher-total-days').textContent = total;
    document.getElementById('teacher-present-days').textContent = present;
    document.getElementById('teacher-absent-days').textContent = absent;
    
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    document.getElementById('teacher-attendance-percentage').textContent = `${percentage}%`;
}

// Filter attendance records
document.getElementById('filter-student-attendance').addEventListener('click', loadViewStudentAttendance);
document.getElementById('filter-teacher-attendance').addEventListener('click', loadViewTeacherAttendance);

// Export buttons (demo functionality)
document.getElementById('export-csv').addEventListener('click', function() {
    showToast('CSV export feature coming soon!', 'info');
});

document.getElementById('export-pdf').addEventListener('click', function() {
    showToast('PDF export feature coming soon!', 'info');
});

document.getElementById('print-attendance').addEventListener('click', function() {
    window.print();
});

document.getElementById('export-teacher-csv').addEventListener('click', function() {
    showToast('CSV export feature coming soon!', 'info');
});

document.getElementById('export-teacher-pdf').addEventListener('click', function() {
    showToast('PDF export feature coming soon!', 'info');
});

document.getElementById('print-teacher-attendance').addEventListener('click', function() {
    window.print();
});

// ====== UTILITY FUNCTIONS ======
// Generate unique ID
function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Validate email format
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Add error class to input
        const inputElement = document.getElementById(fieldId);
        if (inputElement) {
            inputElement.style.borderColor = 'var(--danger-color)';
        }
    }
}

// Clear all error messages
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.style.borderColor = 'var(--border-color)';
    });
}

// Show toast notification
function showToast(message, type) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3500);
}

// Get dates in range
function getDatesInRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ====== EVENT LISTENERS SETUP ======
function setupEventListeners() {
    // Search and filter for students
    document.getElementById('search-student').addEventListener('input', loadStudentsTable);
    document.getElementById('filter-semester').addEventListener('change', loadStudentsTable);
    
    // Search and filter for teachers
    document.getElementById('search-teacher').addEventListener('input', loadTeachersTable);
    document.getElementById('filter-subject').addEventListener('change', loadTeachersTable);
    
    // Attendance date changes
    document.getElementById('attendance-date').addEventListener('change', loadStudentAttendanceTable);
    document.getElementById('teacher-attendance-date').addEventListener('change', loadTeacherAttendanceTable);
    
    // View attendance date changes
    document.getElementById('view-from-date').addEventListener('change', loadViewStudentAttendance);
    document.getElementById('view-to-date').addEventListener('change', loadViewStudentAttendance);
    document.getElementById('view-student-filter').addEventListener('change', loadViewStudentAttendance);
    
    document.getElementById('view-teacher-from-date').addEventListener('change', loadViewTeacherAttendance);
    document.getElementById('view-teacher-to-date').addEventListener('change', loadViewTeacherAttendance);
    document.getElementById('view-teacher-filter').addEventListener('change', loadViewTeacherAttendance);
    
    // Global search
    document.getElementById('global-search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Determine which section is active and search accordingly
        if (document.getElementById('view-students').classList.contains('active')) {
            document.getElementById('search-student').value = searchTerm;
            loadStudentsTable();
        } else if (document.getElementById('view-teachers').classList.contains('active')) {
            document.getElementById('search-teacher').value = searchTerm;
            loadTeachersTable();
        }
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Add some sample data if empty (for demo purposes)
    if (students.length === 0 && teachers.length === 0) {
        addSampleData();
    }
}

// ====== SAMPLE DATA FOR DEMO ======
function addSampleData() {
    // Add sample students
    const sampleStudents = [
        {
            id: generateId(),
            name: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            password: 'password123',
            semester: '3',
            phone: '555-123-4567',
            address: '123 Main St, New York, NY',
            dateAdded: '2023-09-15'
        },
        {
            id: generateId(),
            name: 'Maria Garcia',
            email: 'maria.garcia@example.com',
            password: 'password123',
            semester: '5',
            phone: '555-234-5678',
            address: '456 Oak Ave, Los Angeles, CA',
            dateAdded: '2023-09-10'
        },
        {
            id: generateId(),
            name: 'David Smith',
            email: 'david.smith@example.com',
            password: 'password123',
            semester: '2',
            phone: '555-345-6789',
            address: '789 Pine Rd, Chicago, IL',
            dateAdded: '2023-09-05'
        },
        {
            id: generateId(),
            name: 'Sarah Williams',
            email: 'sarah.williams@example.com',
            password: 'password123',
            semester: '4',
            phone: '555-456-7890',
            address: '321 Elm St, Houston, TX',
            dateAdded: '2023-08-28'
        }
    ];
    
    // Add sample teachers
    const sampleTeachers = [
        {
            id: generateId(),
            name: 'Dr. James Wilson',
            email: 'james.wilson@example.com',
            password: 'password123',
            subject: 'Mathematics',
            experience: '12',
            qualification: 'Ph.D. in Mathematics',
            dateAdded: '2023-08-15'
        },
        {
            id: generateId(),
            name: 'Prof. Emily Chen',
            email: 'emily.chen@example.com',
            password: 'password123',
            subject: 'Physics',
            experience: '8',
            qualification: 'M.Sc. in Physics',
            dateAdded: '2023-08-20'
        },
        {
            id: generateId(),
            name: 'Dr. Robert Brown',
            email: 'robert.brown@example.com',
            password: 'password123',
            subject: 'Computer Science',
            experience: '15',
            qualification: 'Ph.D. in Computer Science',
            dateAdded: '2023-08-10'
        }
    ];
    
    // Add sample attendance data
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Add student attendance
    studentAttendance[today] = {
        [sampleStudents[0].id]: {
            studentId: sampleStudents[0].id,
            studentName: sampleStudents[0].name,
            status: 'present',
            date: today
        },
        [sampleStudents[1].id]: {
            studentId: sampleStudents[1].id,
            studentName: sampleStudents[1].name,
            status: 'present',
            date: today
        },
        [sampleStudents[2].id]: {
            studentId: sampleStudents[2].id,
            studentName: sampleStudents[2].name,
            status: 'absent',
            date: today
        }
    };
    
    studentAttendance[yesterdayStr] = {
        [sampleStudents[0].id]: {
            studentId: sampleStudents[0].id,
            studentName: sampleStudents[0].name,
            status: 'absent',
            date: yesterdayStr
        },
        [sampleStudents[2].id]: {
            studentId: sampleStudents[2].id,
            studentName: sampleStudents[2].name,
            status: 'present',
            date: yesterdayStr
        },
        [sampleStudents[3].id]: {
            studentId: sampleStudents[3].id,
            studentName: sampleStudents[3].name,
            status: 'present',
            date: yesterdayStr
        }
    };
    
    // Add teacher attendance
    teacherAttendance[today] = {
        [sampleTeachers[0].id]: {
            teacherId: sampleTeachers[0].id,
            teacherName: sampleTeachers[0].name,
            status: 'present',
            date: today
        },
        [sampleTeachers[1].id]: {
            teacherId: sampleTeachers[1].id,
            teacherName: sampleTeachers[1].name,
            status: 'present',
            date: today
        }
    };
    
    teacherAttendance[yesterdayStr] = {
        [sampleTeachers[1].id]: {
            teacherId: sampleTeachers[1].id,
            teacherName: sampleTeachers[1].name,
            status: 'present',
            date: yesterdayStr
        },
        [sampleTeachers[2].id]: {
            teacherId: sampleTeachers[2].id,
            teacherName: sampleTeachers[2].name,
            status: 'absent',
            date: yesterdayStr
        }
    };
    
    // Add to arrays
    students.push(...sampleStudents);
    teachers.push(...sampleTeachers);
    
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('studentAttendance', JSON.stringify(studentAttendance));
    localStorage.setItem('teacherAttendance', JSON.stringify(teacherAttendance));
    
    // Update UI
    updateDashboardStats();
    
    // Show toast
    showToast('Sample data loaded for demo purposes!', 'info');
}