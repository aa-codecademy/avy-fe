/**
 * Avy Main Application Entry Point
 * Vanilla JS SPA with custom routing
 */

// Import router
import router from './router.js';

// Import controllers
import landingController from './controllers/landingController.js';
import loginController from './controllers/loginController.js';
import dashboardController from './controllers/dashboardController.js';
import jobBoardController from './controllers/bloom/jobBoardController.js';
import jobDetailController from './controllers/bloom/jobDetailController.js';
import companiesController from './controllers/bloom/companiesController.js';
import profileController from './controllers/bloom/profileController.js';
import postJobController from './controllers/evergreen/postJobController.js';
import candidatesController from './controllers/evergreen/candidatesController.js';
import adminUsersController from './controllers/meridian/adminUsersController.js';
import adminAnalyticsController from './controllers/meridian/adminAnalyticsController.js';
import adminStudentsController from './controllers/meridian/adminStudentsController.js';
import adminStudentDetailController from './controllers/meridian/adminStudentDetailController.js';
import adminStudentEditController from './controllers/meridian/adminStudentEditController.js';
import adminStudentImportController from './controllers/meridian/adminStudentImportController.js';
import adminStudentProgrammeController from './controllers/meridian/adminStudentProgrammeController.js';
import notFoundController from './controllers/notFoundController.js';

// Import services (make available globally)
import authService from './services/authService.js';
import { renderAppHeader } from './views/appHeader.js';

// Make router globally available
window.router = router;
window.authService = authService;

/**
 * Initialize application
 */
function initApp() {
    console.log('%c🚀 Avy Application Started', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%c📦 Phase 1: Frontend Only Mode', 'color: #764ba2; font-size: 12px;');
    
    // Register routes
    registerRoutes();
    
    // Initialize router (will handle initial navigation)
    console.log('✅ Router initialized');
}

/**
 * Register all application routes
 */
function registerRoutes() {
    // Public routes
    router.addRoute('/', landingController, false);
    router.addRoute('/login', loginController, false);
    
    // Protected routes (require authentication)
    router.addRoute('/dashboard', dashboardController, true);
    
    // Job-related routes (Bloom module - Student/Alumni)
    router.addRoute('/jobs', jobBoardController, true);
    router.addRoute('/jobs/:id', jobDetailController, true);
    router.addRoute('/companies', companiesController, true);
    router.addRoute('/profile', profileController, true, ['student', 'alumni']);
    
    // Employer routes (Evergreen module)
    router.addRoute('/employer/post-job', postJobController, true, ['employer']);
    router.addRoute('/employer/candidates', candidatesController, true, ['employer']);
    router.addRoute('/employer/jobs', createPlaceholderController('My Jobs', 'Manage your job postings'), true, ['employer']);
    
    // Admin routes (Meridian module)
    router.addRoute('/admin/users', adminUsersController, true, ['admin']);
    router.addRoute('/admin/students', adminStudentsController, true, ['admin']);
    router.addRoute('/admin/students/import', adminStudentImportController, true, ['admin']);
    router.addRoute('/admin/students/:id/edit', adminStudentEditController, true, ['admin']);
    router.addRoute('/admin/students/:id/programme', adminStudentProgrammeController, true, ['admin']);
    router.addRoute('/admin/students/:id', adminStudentDetailController, true, ['admin']);
    router.addRoute('/admin/jobs', createPlaceholderController('Job Management', 'Manage all job postings'), true, ['admin']);
    router.addRoute(
        '/admin/companies',
        createPlaceholderController('Company Management', 'Oversee employer accounts and verifications'),
        true,
        ['admin']
    );
    router.addRoute('/admin/analytics', adminAnalyticsController, true, ['admin']);
    
    // 404 route (must be last)
    router.addRoute('/404', notFoundController, false);
    
    console.log('✅ Routes registered');
}

/**
 * Create placeholder controller for routes not yet implemented
 */
function createPlaceholderController(title, description) {
    return async function() {
        const app = document.getElementById('app');
        const user = authService.getCurrentUser();

        app.innerHTML = `
            ${renderAppHeader(user, window.location.pathname)}
            
            <div class="container mx-auto px-4 py-20 text-center">
                <div class="max-w-2xl mx-auto fade-in">
                    <div class="text-6xl mb-6">🚧</div>
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">${title}</h1>
                    <p class="text-xl text-gray-600 mb-8">${description}</p>
                    <div class="p-6 bg-blue-50 rounded-lg">
                        <p class="text-blue-900 font-semibold mb-2">
                            <i class="fas fa-info-circle mr-2"></i>
                            Coming Soon
                        </p>
                        <p class="text-blue-700 text-sm">
                            This feature is currently under development and will be available in a future version.
                        </p>
                    </div>
                    <a href="/dashboard" data-link class="btn btn-primary mt-8">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to Dashboard
                    </a>
                </div>
            </div>
        `;
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                authService.logout();
            });
        }
    };
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
