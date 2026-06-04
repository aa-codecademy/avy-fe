/**
 * Events Header View
 */

export function renderEventsHeader(events) {
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
    const totalWorkshops = events.filter(e => e.type === 'workshop').length;

    return `
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                <i class="fas fa-calendar-alt text-purple-600 mr-3"></i>
                Events
            </h1>
            <p class="text-gray-600">Upcoming career days, workshops, and networking events</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="card text-center">
                <i class="fas fa-calendar-week text-3xl text-purple-600 mb-2"></i>
                <p class="text-2xl font-bold text-gray-800">${totalEvents}</p>
                <p class="text-gray-600">Upcoming Events</p>
            </div>
            <div class="card text-center">
                <i class="fas fa-users text-3xl text-purple-600 mb-2"></i>
                <p class="text-2xl font-bold text-gray-800">${totalRegistrations}</p>
                <p class="text-gray-600">Total Registrations</p>
            </div>
            <div class="card text-center">
                <i class="fas fa-chalkboard-teacher text-3xl text-purple-600 mb-2"></i>
                <p class="text-2xl font-bold text-gray-800">${totalWorkshops}</p>
                <p class="text-gray-600">Workshops Available</p>
            </div>
        </div>
    `;
}
