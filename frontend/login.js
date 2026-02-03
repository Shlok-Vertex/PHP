// ====== GLOBAL VARIABLES ======
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'password123'
};

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen
    showLoadingScreen();
    
    // Simulate loading time
    setTimeout(() => {
        // Check for saved credentials
        checkRememberedCredentials();
        
        // Setup event listeners
        setupEventListeners();
        
        // Hide loading screen
        hideLoadingScreen();
        
        // Show welcome message
        showToast('Welcome to EduTrack Pro Login', 'info');
    }, 1500);
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

// ====== EVENT LISTENERS SETUP ======
function setupEventListeners() {
    // Login form submission
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Toggle password visibility
    document.getElementById('toggle-password').addEventListener('click', togglePasswordVisibility);
    
    // Enter key press on password field
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
}

// ====== LOGIN HANDLER ======
function handleLogin(e) {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate form
    if (!validateLoginForm(username, password)) {
        return;
    }
    
    // Show loading state
    const loginButton = document.querySelector('.btn-login');
    const originalText = loginButton.innerHTML;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    loginButton.disabled = true;
    
    // Simulate authentication delay
    setTimeout(() => {
        // Check credentials
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Save to localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            
            // Show success message
            showToast('Login successful! Redirecting to dashboard...', 'success');
            
            // Save login session
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Simulate redirect to dashboard
            setTimeout(() => {
                // In a real application, you would redirect to the dashboard
                // window.location.href = 'dashboard.html';
                
                // For demo purposes, show a message
                showToast('Dashboard would open here. Demo login successful!', 'success');
                
                // Reset button
                loginButton.innerHTML = originalText;
                loginButton.disabled = false;
                
                // Clear form
                document.getElementById('login-form').reset();
            }, 2000);
        } else {
            // Show error message
            showToast('Invalid username or password. Please try again.', 'error');
            
            // Reset button
            loginButton.innerHTML = originalText;
            loginButton.disabled = false;
            
            // Add shake animation to form
            const form = document.getElementById('login-form');
            form.classList.add('shake-animation');
            setTimeout(() => {
                form.classList.remove('shake-animation');
            }, 500);
        }
    }, 1500);
}

// ====== FORM VALIDATION ======
function validateLoginForm(username, password) {
    let isValid = true;
    
    // Clear all errors
    clearAllErrors();
    
    // Validate username
    if (!username) {
        showError('username', 'Username is required');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}

// ====== UTILITY FUNCTIONS ======
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
    
    document.querySelectorAll('input').forEach(el => {
        el.style.borderColor = 'var(--border-color)';
    });
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        toggleButton.setAttribute('title', 'Hide password');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        toggleButton.setAttribute('title', 'Show password');
    }
}

// Check for remembered credentials
function checkRememberedCredentials() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        document.getElementById('username').value = rememberedUsername;
        document.getElementById('remember-me').checked = true;
    }
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

// ====== SHAKE ANIMATION CSS ======
function addShakeAnimation() {
    if (!document.getElementById('shake-animation-style')) {
        const style = document.createElement('style');
        style.id = 'shake-animation-style';
        style.textContent = `
            .shake-animation {
                animation: shake 0.5s ease-in-out;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add shake animation CSS when page loads
addShakeAnimation();

// ====== AUTO-FILL DEMO CREDENTIALS (Optional) ======
// Uncomment this function if you want to auto-fill demo credentials on page load
/*
function autoFillDemoCredentials() {
    document.getElementById('username').value = ADMIN_CREDENTIALS.username;
    document.getElementById('password').value = ADMIN_CREDENTIALS.password;
}

// Call this on page load if you want auto-fill
// autoFillDemoCredentials();
*/