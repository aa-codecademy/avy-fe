/**
 * Login Page Controller
 */
import authService from '../services/authService.js';

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
                    <h1 class="text-4xl font-bold mb-2 text-brand-primary">
                        Avy
                    </h1>
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
                
                <!-- Register Link -->
                <div class="mt-6 text-center">
                    <p class="text-gray-600">
                        Don't have an account? 
                        <button id="showRegisterBtn" class="text-brand-primary hover:underline font-semibold">
                            Register here
                        </button>
                    </p>
                </div>
                
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
            await authService.login(email, password);
            
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
}

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
        
        const userData = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            role: document.getElementById('regRole').value,
            password: document.getElementById('regPassword').value
        };
        
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
