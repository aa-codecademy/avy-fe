/**
 * Events Controller (Student/Alumni)
 * Browse upcoming career-related events and industry news.
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';
import { renderEventsHeader } from '../../views/events/eventsHeader.js';
import { renderEventsFilters, attachFilterListeners, updateFilterButtonStyles } from '../../views/events/eventsFilters.js';
import { formatDate, getEventTypeStyles, getEventTypeIcon, getEventTypeLabel, filterEventsByDate, showToast } from '../../utils/eventHelpers.js';

export default async function eventsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    let allEvents = [];
    let filteredEvents = [];
    let currentFilters = {
        type: 'all',
        dateRange: 'all'
    };

    function renderEventsGrid() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;

        if (filteredEvents.length === 0) {
            eventsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-2xl font-bold text-gray-600 mb-2">No events found</h3>
                    <p class="text-gray-500">Try adjusting your filters or check back later for new events.</p>
                </div>
            `;
            return;
        }

        eventsGrid.innerHTML = filteredEvents.map(event => `
            <div class="card fade-in">
                <div class="mb-4">
                    <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold ${getEventTypeStyles(event.type)}">
                        <i class="fas ${getEventTypeIcon(event.type)} mr-1"></i>
                        ${getEventTypeLabel(event.type)}
                    </span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${event.title}</h3>
                <p class="text-gray-600 mb-4 line-clamp-2">${event.description}</p>
                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <i class="fas fa-calendar-alt w-4"></i>
                        <span>${formatDate(event.date)} at ${event.time}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <i class="fas ${event.isOnline ? 'fa-video' : 'fa-map-marker-alt'} w-4"></i>
                        <span>${event.isOnline ? 'Online Event' : event.location}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <i class="fas fa-users w-4"></i>
                        <span>${event.registeredCount || 0} / ${event.maxParticipants || '∞'} registered</span>
                    </div>
                </div>
                <button class="view-event-btn w-full btn ${(event.registeredCount >= event.maxParticipants) ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}"
                        data-event-id="${event.id}"
                        ${(event.registeredCount >= event.maxParticipants) ? 'disabled' : ''}>
                    ${(event.registeredCount >= event.maxParticipants) ? 'Event Full' : 'View Details & Register'}
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.view-event-btn').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', () => {
                    const event = allEvents.find(e => e.id === btn.dataset.eventId);
                    if (event) showEventDetails(event);
                });
            }
        });
    }

    function showEventDetails(event) {
        const modalHtml = `
            <div id="eventModal" class="modal-overlay fade-in">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold text-purple-600">${event.title}</h2>
                        <button id="closeModalBtn" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center gap-2 text-gray-600">
                            <i class="fas fa-calendar-alt text-purple-600"></i>
                            <span>${formatDate(event.date)} at ${event.time}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <i class="fas ${event.isOnline ? 'fa-video' : 'fa-map-marker-alt'} text-purple-600"></i>
                            <span>${event.isOnline ? 'Online Event' : event.location}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <i class="fas fa-users text-purple-600"></i>
                            <span>${event.registeredCount || 0} / ${event.maxParticipants || 'Unlimited'} participants</span>
                        </div>
                        <div class="pt-4">
                            <h3 class="font-semibold text-gray-800 mb-2">About this event</h3>
                            <p class="text-gray-600">${event.description}</p>
                        </div>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button id="registerFromModalBtn" class="btn btn-primary flex-1" ${(event.registeredCount >= event.maxParticipants) ? 'disabled' : ''}>
                            ${(event.registeredCount >= event.maxParticipants) ? 'Event Full' : 'Register Now'}
                        </button>
                        <button id="closeModalBtn2" class="btn btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('eventModal');
        const closeModal = () => modal.remove();

        document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
        document.getElementById('closeModalBtn2')?.addEventListener('click', closeModal);
        document.getElementById('registerFromModalBtn')?.addEventListener('click', async () => {
            await handleRegistration(event.id);
            closeModal();
        });
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    async function handleRegistration(eventId) {
        try {
            const result = await mockDataService.registerForEvent(eventId, user.id);

            if (result.success) {
                const event = allEvents.find(e => e.id === eventId);
                if (event) event.registeredCount = (event.registeredCount || 0) + 1;
                showToast('Successfully registered for the event!', 'success');
                applyFiltersAndRender();
            } else if (result.reason === 'event_full') {
                showToast('Sorry, this event is full!', 'error');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            showToast('Failed to register for event. Please try again.', 'error');
        }
    }

    function applyFiltersAndRender() {
        let filtered = [...allEvents];
        if (currentFilters.type !== 'all') {
            filtered = filtered.filter(event => event.type === currentFilters.type);
        }
        filtered = filterEventsByDate(filtered, currentFilters.dateRange);
        filteredEvents = filtered;
        renderEventsGrid();
    }

    function handleFilterChange(filterType, filterValue) {
        currentFilters[filterType] = filterValue;
        updateFilterButtonStyles(filterType, filterValue);
        applyFiltersAndRender();
    }

    try {
        app.innerHTML = `
            ${renderAppHeader(user, window.location.pathname)}
            <div class="bg-gray-50 min-h-screen py-8">
                <div class="container mx-auto px-4">
                    <div class="fade-in">
                        <div id="eventsHeader"></div>
                        <div id="filtersContainer"></div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="eventsGrid"></div>
                    </div>
                </div>
            </div>
        `;

        allEvents = await mockDataService.getEvents();
        filteredEvents = [...allEvents];

        const headerContainer = document.getElementById('eventsHeader');
        const filtersContainer = document.getElementById('filtersContainer');

        if (headerContainer) headerContainer.innerHTML = renderEventsHeader(allEvents);
        if (filtersContainer) filtersContainer.innerHTML = renderEventsFilters(currentFilters, handleFilterChange);

        renderEventsGrid();
        attachFilterListeners(handleFilterChange);

    } catch (error) {
        console.error('Failed to load events:', error);
        app.innerHTML = `
            ${renderAppHeader(user, window.location.pathname)}
            <div class="bg-gray-50 min-h-screen py-8">
                <div class="container mx-auto px-4">
                    <div class="card text-center py-16">
                        <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">Failed to load events</h3>
                        <p class="text-gray-500">Please try again later.</p>
                    </div>
                </div>
            </div>
        `;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
