/**
 * Employer Notifications Controller
 * Alerts about new applications and candidate responses.
 *
 * User story: "6.2 Notifications"
 *
 * Available mock service methods:
 *  - mockDataService.getNotifications(userId, { unreadOnly })
 *  - mockDataService.getUnreadCount(userId)
 *  - mockDataService.markNotificationAsRead(id)
 *  - mockDataService.markAllAsRead(userId)
 */
import authService from '../../services/authService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function employerNotificationsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    // TODO (student task): list employer notifications, mark as read, link to relevant page
    // const notifications = await mockDataService.getNotifications(user.id);

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-bell text-purple-600 mr-3"></i>
                            Notifications
                        </h1>
                        <p class="text-gray-600">Alerts about new applications and candidate replies</p>
                    </div>
                    <div class="card text-center py-16">
                        <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">TODO: Employer notifications</h3>
                        <p class="text-gray-500">Implement notification feed and mark-as-read controls.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
