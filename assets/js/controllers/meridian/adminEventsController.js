/**
 * Admin Events Controller (Meridian)
 * Create, edit, cancel events and view registrations.
 *
 * User stories (Admin Epic A4):
 *  - "A4-01 Create a new event"
 *  - "A4-02 Edit or cancel an existing event"
 *  - "A4-03 View event registrations"
 *  - "A4-05 Send notification to event registrants"
 *
 * Available mock service methods:
 *  - mockDataService.getEvents()
 *  - mockDataService.getEventById(id)
 *  - mockDataService.createEvent(eventData)
 *  - mockDataService.updateEvent(id, eventData)
 *  - mockDataService.deleteEvent(id)
 */
import authService from '../../services/authService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminEventsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    // TODO (student task): list events, support create/edit/cancel, view registrations
    // const events = await mockDataService.getEvents();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8 flex justify-between items-center">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                <i class="fas fa-calendar-alt text-purple-600 mr-3"></i>
                                Events Management
                            </h1>
                            <p class="text-gray-600">Create and manage platform events</p>
                        </div>
                        <button class="btn btn-primary">
                            <i class="fas fa-plus-circle mr-2"></i> Create Event
                        </button>
                    </div>
                    <div class="card text-center py-16">
                        <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">TODO: Events admin</h3>
                        <p class="text-gray-500">Implement events table, create/edit form, registrations view.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
