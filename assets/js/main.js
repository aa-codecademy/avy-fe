/**
 * Avy Main Application Entry Point
 * Vanilla JS SPA with custom routing
 */

// Import router
import router from './router.js';

// Import controllers
import applicationsController from './controllers/bloom/applicationsController.js';
import companiesController from './controllers/bloom/companiesController.js';
import eventsController from './controllers/bloom/eventsController.js';
import jobBoardController from './controllers/bloom/jobBoardController.js';
import jobDetailController from './controllers/bloom/jobDetailController.js';
import messagesController from './controllers/bloom/messagesController.js';
import notificationsController from './controllers/bloom/notificationsController.js';
import profileController from './controllers/bloom/profileController.js';
import dashboardController from './controllers/dashboardController.js';
import candidatesController from './controllers/evergreen/candidatesController.js';
import jobApplicantsController from './controllers/evergreen/jobApplicantsController.js';
import employerMessagesController from './controllers/evergreen/messagesController.js';
import myJobsController from './controllers/evergreen/myJobsController.js';
import employerNotificationsController from './controllers/evergreen/notificationsController.js';
import postJobController from './controllers/evergreen/postJobController.js';
import landingController from './controllers/landingController.js';
import loginController from './controllers/loginController.js';
import adminAnalyticsController from './controllers/meridian/adminAnalyticsController.js';
import adminAuditLogController from './controllers/meridian/adminAuditLogController.js';
import adminComplianceController from './controllers/meridian/adminComplianceController.js';
import adminEventsController from './controllers/meridian/adminEventsController.js';
import adminNotificationsController from './controllers/meridian/adminNotificationsController.js';
import adminPlatformSettingsController from './controllers/meridian/adminPlatformSettingsController.js';
import adminRolePermissionsController from './controllers/meridian/adminRolePermissionsController.js';
import adminSettingsController from './controllers/meridian/adminSettingsController.js';
import adminTemplatesController from './controllers/meridian/adminTemplatesController.js';
import adminUsersController from './controllers/meridian/adminUsersController.js';
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
    console.log(
        '%c🚀 Avy Application Started',
        'color: #667eea; font-size: 16px; font-weight: bold;'
    );
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
    router.addRoute('/applications', applicationsController, true, ['student', 'alumni']);
    router.addRoute('/events', eventsController, true);
    router.addRoute('/messages', messagesController, true, ['student', 'alumni']);
    router.addRoute('/notifications', notificationsController, true);

    // Employer routes (Evergreen module)
    router.addRoute('/employer/post-job', postJobController, true, ['employer']);
    router.addRoute('/employer/candidates', candidatesController, true, ['employer']);
    router.addRoute('/employer/jobs', myJobsController, true, ['employer']);
    router.addRoute('/employer/jobs/:id/applicants', jobApplicantsController, true, ['employer']);
    router.addRoute('/employer/messages', employerMessagesController, true, ['employer']);
    router.addRoute('/employer/notifications', employerNotificationsController, true, ['employer']);

    // Admin routes (Meridian module)
    router.addRoute('/admin/users', adminUsersController, true, ['admin']);
    router.addRoute(
        '/admin/jobs',
        createPlaceholderController('Job Management', 'Manage all job postings'),
        true,
        ['admin']
    );
    router.addRoute(
        '/admin/companies',
        createPlaceholderController(
            'Company Management',
            'Oversee employer accounts and verifications'
        ),
        true,
        ['admin']
    );
    router.addRoute('/admin/analytics', adminAnalyticsController, true, ['admin']);
    router.addRoute('/admin/events', adminEventsController, true, ['admin']);
    router.addRoute('/admin/notifications', adminNotificationsController, true, ['admin']);
    router.addRoute('/admin/settings', adminSettingsController, true, ['admin']);
    router.addRoute('/admin/settings/roles', adminRolePermissionsController, true, ['admin']);
    router.addRoute('/admin/settings/templates', adminTemplatesController, true, ['admin']);
    router.addRoute('/admin/settings/platform', adminPlatformSettingsController, true, ['admin']);
    router.addRoute('/admin/settings/audit', adminAuditLogController, true, ['admin']);
    router.addRoute('/admin/settings/compliance', adminComplianceController, true, ['admin']);

    // 404 route (must be last)
    router.addRoute('/404', notFoundController, false);

    console.log('✅ Routes registered');
}

/**
 * Create placeholder controller for routes not yet implemented
 */
function createPlaceholderController(title, description) {
    return async function () {
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
