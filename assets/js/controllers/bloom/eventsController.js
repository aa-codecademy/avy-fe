/**
 * Events Controller (Student/Alumni)
 * Browse upcoming career-related events and industry news.
 *
 * User story: "Events and industry news"
 *
 * Available mock service methods:
 *  - mockDataService.getEvents()
 *  - mockDataService.getEventById(id)
 *  - mockDataService.registerForEvent(eventId, userId)
 */
import authService from '../../services/authService.js';
import languageService from '../../services/languageService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function eventsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    const t = (key) => languageService.translate(key);

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // TODO (student task): list events, support registration, filter by type/date
    // const events = await mockDataService.getEvents();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-calendar-alt text-purple-600 mr-3"></i>
                            ${t('events.title')}
                        </h1>
                        <p class="text-gray-600">${t('events.search')}</p>
                    </div>
                    <div class="card text-center py-16">
                        <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">${t('events.noEvents')}</h3>
                        <p class="text-gray-500">${t('events.noData')}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
