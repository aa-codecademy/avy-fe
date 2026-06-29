/**
 * Event Helper Functions
 */

export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

export function getEventTypeStyles(type) {
    const styles = {
        'career-day': 'bg-purple-100 text-purple-700',
        'workshop': 'bg-blue-100 text-blue-700',
        'webinar': 'bg-green-100 text-green-700',
        'networking': 'bg-yellow-100 text-yellow-700'
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
}

export function getEventTypeIcon(type) {
    const icons = {
        'career-day': 'fa-briefcase',
        'workshop': 'fa-laptop-code',
        'webinar': 'fa-chalkboard-teacher',
        'networking': 'fa-handshake'
    };
    return icons[type] || 'fa-calendar';
}

export function getEventTypeLabel(type) {
    const labels = {
        'career-day': 'Career Day',
        'workshop': 'Workshop',
        'webinar': 'Webinar',
        'networking': 'Networking'
    };
    return labels[type] || 'Event';
}

export function filterEventsByDate(events, dateRange) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateRange) {
        case 'upcoming':
            return events.filter(event => new Date(event.date) >= today);
        case 'this-week':
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            return events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today && eventDate <= nextWeek;
            });
        case 'this-month':
            const nextMonth = new Date(today);
            nextMonth.setMonth(today.getMonth() + 1);
            return events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today && eventDate <= nextMonth;
            });
        default:
            return events;
    }
}

export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 fade-in ${colors[type] || colors.info}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
