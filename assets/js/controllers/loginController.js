/**
 * Login Page Controller
 */
import authService from '../services/authService.js';
import { requestDesktopPermission, dispatchNewNotification } from '../services/notificationService.js';

export default async function loginController() {
    const app = document.getElementById('app');
    
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
        window.router.navigate('/dashboard');
        return;
    }
    
    app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center px-4 bg-brand-gradient">
            <div class="card max-w-md w-full fade-in">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <a href="/" data-link class="inline-block">
                        <h1 class="text-4xl font-bold mb-2 text-brand-primary hover:opacity-90">
                            Avy
                        </h1>
                    </a>
                    <p class="text-gray-600">Sign in to your account</p>
                </div>
                
                <!-- Login Form -->
                <form id="loginForm" class="space-y-6">
                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            class="form-input"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="password" class="form-label">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            class="form-input"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    
                    <div id="errorMessage" class="hidden text-red-600 text-sm p-3 bg-red-50 rounded"></div>
                    
                    <button type="submit" class="btn btn-primary w-full">
                        <span id="loginButtonText">Sign In</span>
                        <i id="loginSpinner" class="fas fa-spinner fa-spin ml-2 hidden"></i>
                    </button>
                </form>
                
                <!-- Quick Login Hints -->
                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm font-semibold text-blue-900 mb-2">
                        <i class="fas fa-info-circle mr-1"></i>
                        Phase 1 Demo Mode
                    </p>
                    <p class="text-xs text-blue-800 mb-2">Use any password. Email determines role:</p>
                    <ul class="text-xs text-blue-700 space-y-1">
                        <li><strong>student@avy.com</strong> - Student access</li>
                        <li><strong>alumni@avy.com</strong> - Alumni access</li>
                        <li><strong>company@avy.com</strong> - Employer access</li>
                        <li><strong>admin@avy.com</strong> - Admin access</li>
                    </ul>
                </div>
                
                <!-- Register & Forgot Password Links -->
                <!-- feature/forgot-password-at-login [Ognen] -->
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-500">
                        Don't have an account? 
                        <button id="showRegisterBtn" class="text-brand-primary hover:underline font-semibold">
                            Register here
                        </button>
                    </p>
                    <p class="mt-2 text-sm text-gray-500">
                        Forgot your password?
                        <button id="showForgotPasswordBtn" class="text-brand-primary hover:underline font-semibold">
                            Reset here
                        </button>
                    </p>
                </div>

                <hr class="my-6 border-top-gray-300" />

                <!-- END Ognen Manevski -->
                
                <!-- Back to Home -->
                <div class="mt-4 text-center">
                    <a href="/" data-link class="text-gray-500 hover:text-gray-700 text-sm">
                        <i class="fas fa-arrow-left mr-1"></i>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginButtonText = document.getElementById('loginButtonText');
    const loginSpinner = document.getElementById('loginSpinner');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    // feature/forgot-password-at-login [Ognen]
    const showForgotPasswordBtn = document.getElementById('showForgotPasswordBtn');
    // END Ognen Manevski
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Hide previous errors
        errorMessage.classList.add('hidden');
        
        // Show loading state
        loginButtonText.textContent = 'Signing In...';
        loginSpinner.classList.remove('hidden');
        loginForm.querySelector('button[type="submit"]').disabled = true;
        
        try {
            const user = await authService.login(email, password);

            // Seed demo notifications immediately so the header badge shows on first render
            window.mockDataService?._seedCurrentUserNotifications();

            // Request desktop notification permission now, inside the user gesture,
            // and await it so the 5s demo timer only starts after the user responds.
            await requestDesktopPermission();

            // ── DEMO: fire a new notification 5 seconds after login ──────────
            setTimeout(async () => {
                const loggedInUser = authService.getCurrentUser();
                if (!loggedInUser || !window.mockDataService) return;

                const demoNotif = {
                    id: `demo_${Date.now()}`,
                    userId: loggedInUser.id,
                    type: 'system_alert',
                    title: '3 new job matches found!',
                    message: 'Based on your profile, 3 companies are actively looking for your skillset. Check them out!',
                    link: '/jobs',
                    read: false,
                    createdAt: new Date().toISOString(),
                };

                // Persist the notification
                window.mockDataService.notifications.push(demoNotif);
                window.mockDataService.saveToStorage();

                // Update header badge
                if (typeof window.refreshHeaderBadge === 'function') {
                    window.refreshHeaderBadge(loggedInUser.id);
                }

                // Fire all three channels: toast + desktop + email
                await dispatchNewNotification(demoNotif, loggedInUser);
            }, 5000);
            // ── END DEMO ─────────────────────────────────────────────────────

            // Success - navigate to dashboard
            window.router.navigate('/dashboard');
        } catch (error) {
            // Show error
            errorMessage.textContent = error.message || 'Login failed. Please try again.';
            errorMessage.classList.remove('hidden');
            
            // Reset button state
            loginButtonText.textContent = 'Sign In';
            loginSpinner.classList.add('hidden');
            loginForm.querySelector('button[type="submit"]').disabled = false;
        }
    });
    
    showRegisterBtn.addEventListener('click', () => {
        showRegisterModal();
    });

    // feature/forgot-password-at-login [Ognen]
    showForgotPasswordBtn.addEventListener('click', () => {
        showForgotPasswordModal();
    });
    // END Ognen Manevski
}

// feature/forgot-password-at-login [Ognen]
/**
 * Shows a 2-step forgot password modal.
 * Step 1: user enters email and submits.
 * Step 2: success confirmation with link to /reset-password.
 * @author Ognen Manevski
 */
function showForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Reset Password</h2>
                <button id="closeForgotModalBtn" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>

            <!-- Step 1: Email form -->
            <div id="forgotStep1">
                <p class="text-sm text-gray-600 mb-4">
                    Enter the email address linked to your account and we'll send you a reset link.
                </p>
                <form id="forgotPasswordForm" class="space-y-4">
                    <div class="form-group">
                        <label for="forgotEmail" class="form-label">Email</label>
                        <input
                            type="email"
                            id="forgotEmail"
                            class="form-input"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>
                    <div id="forgotErrorMessage" class="hidden text-red-600 text-sm p-3 bg-red-50 rounded"></div>
                    <button type="submit" class="btn btn-primary w-full">
                        <span id="forgotBtnText">Send Reset Link</span>
                        <i id="forgotSpinner" class="fas fa-spinner fa-spin ml-2 hidden"></i>
                    </button>
                </form>
            </div>

            <!-- Step 2: Success state (hidden initially) -->
            <div id="forgotStep2" class="hidden text-center py-4">
                <div class="mb-4">
                    <i class="fas fa-envelope-circle-check text-5xl text-green-500"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Check your inbox</h3>
                <p class="text-sm text-gray-600 mb-6">
                    If <strong id="forgotEmailConfirm"></strong> is registered, a reset link has been sent.
                </p>
                <button id="goToResetPageBtn" class="btn btn-primary w-full mb-4">
                    <i class="fas fa-key mr-2"></i>
                    Open Reset Page
                </button>
                <button id="closeForgotStep2Btn" class="text-gray-500 hover:text-gray-700 text-sm">
                    <i class="fas fa-arrow-left mr-1"></i>
                    Back to Sign In
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close handlers
    modal.querySelector('#closeForgotModalBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    });

    // Form submit — Step 1 → Step 2
    const forgotForm = modal.querySelector('#forgotPasswordForm');
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = modal.querySelector('#forgotEmail').value.trim();
        const errorMsg = modal.querySelector('#forgotErrorMessage');
        const btnText = modal.querySelector('#forgotBtnText');
        const spinner = modal.querySelector('#forgotSpinner');
        const submitBtn = forgotForm.querySelector('button[type="submit"]');

        errorMsg.classList.add('hidden');
        btnText.textContent = 'Sending...';
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            await authService.requestPasswordReset(email);
            // Transition to Step 2
            modal.querySelector('#forgotStep1').classList.add('hidden');
            modal.querySelector('#forgotEmailConfirm').textContent = email;
            modal.querySelector('#forgotStep2').classList.remove('hidden');
        } catch (error) {
            errorMsg.textContent = error.message || 'Something went wrong. Please try again.';
            errorMsg.classList.remove('hidden');
            btnText.textContent = 'Send Reset Link';
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    // Step 2 buttons
    modal.querySelector('#goToResetPageBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
        window.router.navigate('/reset-password');
    });
    modal.querySelector('#closeForgotStep2Btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}
// END Ognen Manevski

function showRegisterModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Create Account</h2>
                <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <form id="registerForm" class="space-y-4">
                <div class="form-group">
                    <label for="regName" class="form-label">Full Name</label>
                    <input 
                        type="text" 
                        id="regName" 
                        class="form-input"
                        placeholder="John Doe"
                        required
                    />
                </div>
                
                <div class="form-group">
                    <label for="regEmail" class="form-label">Email</label>
                    <input 
                        type="email" 
                        id="regEmail" 
                        class="form-input"
                        placeholder="john.doe@example.com"
                        required
                    />
                </div>
                
                <div class="form-group">
                    <label for="regRole" class="form-label">I am a...</label>
                    <select id="regRole" class="form-input" required>
                        <option value="student">Student</option>
                        <option value="alumni">Alumni</option>
                        <option value="employer">Employer</option>
                    </select>
                </div>

                <div id="employerFields" class="hidden space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="text-sm font-semibold text-gray-700">Company account</p>
                    <div class="form-group">
                        <label for="regCompanyName" class="form-label">Company name *</label>
                        <input type="text" id="regCompanyName" class="form-input" placeholder="Your company name" />
                    </div>
                    <div class="form-group">
                        <label for="regCompanyIndustry" class="form-label">Industry *</label>
                        <input type="text" id="regCompanyIndustry" class="form-input" placeholder="e.g. Software Development" />
                    </div>
                    <div class="form-group">
                        <label for="regCompanySize" class="form-label">Company size *</label>
                        <select id="regCompanySize" class="form-input">
                            <option value="">Select size...</option>
                            <option value="1-10">1–10 employees</option>
                            <option value="11-50">11–50 employees</option>
                            <option value="51-200">51–200 employees</option>
                            <option value="201-500">201–500 employees</option>
                            <option value="501+">501+ employees</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="regPassword" class="form-label">Password</label>
                    <input 
                        type="password" 
                        id="regPassword" 
                        class="form-input"
                        placeholder="Choose a strong password"
                        required
                    />
                </div>
                
                <div id="regErrorMessage" class="hidden text-red-600 text-sm p-3 bg-red-50 rounded"></div>
                
                <button type="submit" class="btn btn-primary w-full">
                    Create Account
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);

    const regRoleEl = modal.querySelector('#regRole');
    const employerFieldsEl = modal.querySelector('#employerFields');
    const toggleEmployerFields = () => {
        const on = regRoleEl.value === 'employer';
        employerFieldsEl.classList.toggle('hidden', !on);
        modal.querySelector('#regCompanyName').required = on;
        modal.querySelector('#regCompanyIndustry').required = on;
        modal.querySelector('#regCompanySize').required = on;
    };
    regRoleEl.addEventListener('change', toggleEmployerFields);
    toggleEmployerFields();
    
    // Close modal handler
    const closeModalBtn = modal.querySelector('#closeModalBtn');
    closeModalBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Register form handler
    const registerForm = modal.querySelector('#registerForm');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const role = document.getElementById('regRole').value;
        const userData = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            role,
            password: document.getElementById('regPassword').value
        };
        if (role === 'employer') {
            userData.companyName = document.getElementById('regCompanyName').value.trim();
            userData.companyIndustry = document.getElementById('regCompanyIndustry').value.trim();
            userData.companySize = document.getElementById('regCompanySize').value;
            if (!userData.companyName || !userData.companyIndustry || !userData.companySize) {
                const errorMsg = modal.querySelector('#regErrorMessage');
                errorMsg.textContent = 'Please complete company name, industry, and size.';
                errorMsg.classList.remove('hidden');
                return;
            }
        }

        try {
            await window.authService.register(userData);
            document.body.removeChild(modal);
            window.router.navigate('/dashboard');
        } catch (error) {
            const errorMsg = modal.querySelector('#regErrorMessage');
            errorMsg.textContent = error.message || 'Registration failed. Please try again.';
            errorMsg.classList.remove('hidden');
        }
    });
}
