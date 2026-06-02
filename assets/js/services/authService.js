/**
 * Authentication Service
 * Handles user authentication, JWT tokens, and role-based access
 */
class AuthService {
    constructor() {
        this.tokenKey = 'avy_token';
        this.userKey = 'avy_user';
        this.apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
    }
    
    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} User object
     */
    async login(email, password) {
        try {
            // Phase 1: Mock authentication without backend
            // In Phase 2, this will call actual API endpoint
            
            // Mock validation
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            
            // Mock user data based on email pattern
            const mockUser = this.getMockUser(email);
            const mockToken = this.generateMockToken();
            
            // Store token and user
            localStorage.setItem(this.tokenKey, mockToken);
            localStorage.setItem(this.userKey, JSON.stringify(mockUser));
            
            return mockUser;
            
            // Phase 2 implementation (commented out):
            /*
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            
            const data = await response.json();
            
            localStorage.setItem(this.tokenKey, data.token);
            localStorage.setItem(this.userKey, JSON.stringify(data.user));
            
            return data.user;
            */
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} User object
     */
    async register(userData) {
        try {
            // Phase 1: Mock registration
            const mockUser = {
                id: Date.now().toString(),
                email: userData.email,
                name: userData.name,
                role: userData.role || 'student',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=667eea&color=fff`,
                createdAt: new Date().toISOString()
            };
            if (mockUser.role === 'employer') {
                mockUser.companyId = userData.companyId || 'c1';
                if (userData.companyName) mockUser.companyName = userData.companyName;
                if (userData.companyIndustry) mockUser.companyIndustry = userData.companyIndustry;
                if (userData.companySize) mockUser.companySize = userData.companySize;
            }
            
            const mockToken = this.generateMockToken();
            
            localStorage.setItem(this.tokenKey, mockToken);
            localStorage.setItem(this.userKey, JSON.stringify(mockUser));
            
            return mockUser;
            
            // Phase 2 implementation (commented out):
            /*
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }
            
            const data = await response.json();
            
            localStorage.setItem(this.tokenKey, data.token);
            localStorage.setItem(this.userKey, JSON.stringify(data.user));
            
            return data.user;
            */
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    
    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        window.location.href = '/';
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = localStorage.getItem(this.tokenKey);
        const user = localStorage.getItem(this.userKey);
        return !!(token && user);
    }
    
    /**
     * Get current authenticated user
     * @returns {Object|null}
     */
    getCurrentUser() {
        const userJson = localStorage.getItem(this.userKey);
        return userJson ? JSON.parse(userJson) : null;
    }
    
    /**
     * Get authentication token
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
    
    /**
     * Check if user has specific role
     * @param {string} role 
     * @returns {boolean}
     */
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }
    
    /**
     * Generate mock JWT token for Phase 1
     * @private
     */
    generateMockToken() {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            iat: Date.now()
        }));
        const signature = btoa('mock_signature');
        return `${header}.${payload}.${signature}`;
    }
    
    /**
     * Get mock user based on email pattern
     * @private
     */
    getMockUser(email) {
        let role = 'student';
        let name = email.split('@')[0];
        
        // Determine role based on email pattern
        if (email.includes('admin')) {
            role = 'admin';
            name = 'Admin User';
        } else if (email.includes('company') || email.includes('employer')) {
            role = 'employer';
            name = 'Company Representative';
        } else if (email.includes('alumni')) {
            role = 'alumni';
            name = 'Alumni Member';
        } else {
            name = 'Student User';
        }
        
        const base = {
            id: Date.now().toString(),
            email,
            name,
            role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
            createdAt: new Date().toISOString()
        };
        if (role === 'employer') {
            base.companyId = 'c1';
        }
        return base;
    }

    // feature/forgot-password-at-login [Ognen]
    /**
     * Request a password reset link for the given email.
     * Phase 1: Generates a mock reset token and stores it in localStorage.
     * Phase 2: Will POST to /api/auth/forgot-password and send a real email.
     * @author Ognen Manevski
     * @param {string} email
     * @returns {Promise<void>}
     */
    async requestPasswordReset(email) {
        if (!email) {
            throw new Error('Email is required');
        }

        // Phase 1: Mock — generate a fake reset token and store it
        const resetToken = btoa(`reset_${email}_${Date.now()}`);
        localStorage.setItem('avy_reset_token', resetToken);
        localStorage.setItem('avy_reset_email', email);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Phase 2 implementation (commented out):
        /*
        const response = await fetch(`${this.apiBaseUrl}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send reset link');
        }
        */
    }

    /**
     * Confirm a password reset using the stored mock token.
     * Phase 1: Validates token from localStorage and clears reset state.
     * Phase 2: Will POST to /api/auth/reset-password with token + new password.
     * @author Ognen Manevski
     * @param {string} token
     * @param {string} newPassword
     * @returns {Promise<void>}
     */
    async confirmPasswordReset(token, newPassword) {
        if (!token || !newPassword) {
            throw new Error('Token and new password are required');
        }

        const storedToken = localStorage.getItem('avy_reset_token');
        if (!storedToken || storedToken !== token) {
            throw new Error('Invalid or expired reset link');
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Phase 1: Clear reset state — password change is mocked
        localStorage.removeItem('avy_reset_token');
        localStorage.removeItem('avy_reset_email');

        // Phase 2 implementation (commented out):
        /*
        const response = await fetch(`${this.apiBaseUrl}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reset password');
        }
        */
    }
    // END Ognen Manevski
}

// Export singleton instance
const authService = new AuthService();
window.authService = authService; // Make available globally for router
export default authService;
