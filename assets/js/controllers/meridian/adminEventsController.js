import authService from '../../services/authService.js';
import eventService from '../../services/adminContentService/eventService.js';
import modalService from '../../services/adminContentService/modalService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminEventsController() {
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.location.navigate('/dashboard');
        return;
    }

    await EventManager.initialize(user);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

const EventManager = {
    events: [],
    user: null,
    formState: {
        isOnline: false,
        update: null,
    },
    filterState: {
        activeType: 'all',
        sortBy: 'date-asc',
    },

    async initialize(user) {
        EventManager.user = user;
        EventManager.events = await eventService.getEvents();
        EventManager.filterState = { activeType: 'all', sortBy: 'date-asc' };
        EventManager.render.page();
        EventManager.render.cards();
        EventManager.listeners.atachAll();
    },

    render: {
        page() {
            const app = document.getElementById('app');
            app.innerHTML = `
            ${renderAppHeader(EventManager.user, window.location.pathname)}
            <div class="container mx-auto px-4 py-8 gap-6 flex flex-col">

                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800">
                            <i class="fas fa-calendar-alt text-purple-600 mr-2"></i>
                            Event Management
                        </h1>
                        <p class="text-gray-500 text-sm mt-1">Meridian — Admin Panel</p>
                    </div>
                    <button id="schedule-event-button" class="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-md w-full lg:w-auto">
                        <i class="fas fa-plus-circle text-lg"></i>
                        Schedule Event
                    </button>
                </div>

                <div class="bg-white shadow-sm rounded-2xl px-5 py-4 flex flex-col gap-4">

                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</span>
                            <div class="flex gap-1.5 flex-wrap" id="type-buttons">
                                <button class="type-btn text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 font-semibold transition-colors" data-type="all">All Types</button>
                                <button class="type-btn text-xs px-3 py-1.5 rounded-full text-gray-500 bg-gray-100 hover:bg-purple-50 hover:text-purple-600 transition-colors" data-type="career-day">Career Day</button>
                                <button class="type-btn text-xs px-3 py-1.5 rounded-full text-gray-500 bg-gray-100 hover:bg-purple-50 hover:text-purple-600 transition-colors" data-type="workshop">Workshop</button>
                                <button class="type-btn text-xs px-3 py-1.5 rounded-full text-gray-500 bg-gray-100 hover:bg-purple-50 hover:text-purple-600 transition-colors" data-type="networking">Networking</button>
                                <button class="type-btn text-xs px-3 py-1.5 rounded-full text-gray-500 bg-gray-100 hover:bg-purple-50 hover:text-purple-600 transition-colors" data-type="internship">Internship</button>
                            </div>
                        </div>

                        <div class="border-t border-gray-100"></div>

                        <div class="flex items-center gap-2">
                            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sort</span>
                            <select id="sort-select" class="text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-100">
                                <option value="date-asc">Date (Soonest)</option>
                                <option value="date-desc">Date (Latest)</option>
                                <option value="participants">Most Registered</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div class="bg-white shadow-sm rounded-2xl p-6">
                    <h2 class="text-lg font-semibold text-gray-700 mb-5">
                        Events <span id="event-count" class="text-sm font-normal text-gray-400"></span>
                    </h2>
                    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4" id="event-card-container"></div>
                </div>

            </div>
            `;
        },
        filteredEvents() {
            let result = [...EventManager.events];

            if (EventManager.filterState.activeType !== 'all') {
                result = result.filter((e) => e.type === EventManager.filterState.activeType);
            }

            switch (EventManager.filterState.sortBy) {
                case 'date-asc':
                    result.sort(
                        (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
                    );
                    break;
                case 'date-desc':
                    result.sort(
                        (a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
                    );
                    break;
                case 'participants':
                    result.sort((a, b) => b.registeredUsers.length - a.registeredUsers.length);
                    break;
            }

            return result;
        },
        cards() {
            const container = document.getElementById('event-card-container');
            const events = EventManager.render.filteredEvents();

            const count = document.getElementById('event-count');
            if (count) count.textContent = `(${events.length} events)`;

            if (!events.length) {
                container.innerHTML = `
                    <div class="col-span-full text-center text-gray-400 py-10">
                        <i class="fas fa-folder-open text-4xl mb-3"></i>
                        <p class="text-sm">Currently no active events.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = ``;
            events.forEach((event) => {
                const eventCard = document.createElement('div');
                eventCard.className = `event-card flex flex-col gap-4 rounded-xl p-6 shadow-md`;
                eventCard.style.background = `var(--color-bg)`;
                eventCard.id = event.id;

                eventCard.innerHTML = `
                <div class="flex items-start justify-between gap-2">
                    <h2 class="text-lg font-bold text-gray-800 leading-tight">${event.title}</h2>
                    <span class="text-xs font-semibold px-2 py-1 ${EventManager.uiElements.getStatusStyle(event.status)} rounded-full whitespace-nowrap">${event.status}</span>
                </div>

                <div><span class="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded-full"><i class="fas fa-tag mr-1"></i>${event.type}</span></div>

                <p class="text-sm text-gray-600 leading-relaxed line-clamp-2">${event.description}</p>

                <div class="flex items-center gap-2 text-sm text-gray-700">
                    <i class="fas fa-calendar text-purple-500 w-4"></i><span>${event.date}</span>
                    <i class="fas fa-clock text-purple-500 w-4 ml-2"></i><span>${event.time}</span>
                </div>

                <div class="flex items-center gap-2 text-sm text-gray-700">${event.isOnline ? `<i class="fas fa-video text-purple-500 w-4"></i><span>Online</span>` : `<i class="fas fa-location-dot text-purple-500 w-4"></i><span>${event.location}</span>`}</div>
                <div>
                    <div class="flex justify-between text-xs text-gray-500 mb-1">
                        <span><i class="fas fa-users mr-1 text-purple-500 w-4"></i>Participants</span>
                        <span>${event.registeredUsers.length}/${event.maxParticipants}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2"><div class="${EventManager.uiElements.getBarColor(event.registeredUsers.length, event.maxParticipants)} h-2 rounded-full transition-all duration-300" style="width: ${EventManager.uiElements.getBarPercentage(event.registeredUsers.length, event.maxParticipants)}%"></div></div>
                </div>

                <div class="flex items-center justify-between mt-auto pt-2">
                    <div class="flex gap-2">
                        <button class="edit-button px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"><i class="fas fa-pen mr-1"></i>Edit</button>
                        <button ${event.status === 'cancelled' ? 'disabled' : ''} class="cancel-button px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${event.status === 'cancelled' ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100 cursor-pointer'}"><i class="fas fa-ban mr-1"></i>${event.status === 'cancelled' ? 'cancelled' : 'cancel'}</button>
                        <button class="delete-button px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"><i class="fas fa-trash mr-1"></i>Delete</button>
                        <button class="more-button px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"><i class="fas fa-ellipsis mr-1"></i>More</button>
                    </div>
                </div>
                `;

                eventCard.querySelector('.edit-button').addEventListener('click', () => {
                    EventManager.render.fromModal(event);
                });
                eventCard.querySelector('.cancel-button').addEventListener('click', async () => {
                    const confirmed = await modalService.confirmationModal(
                        'Cancel Event',
                        'Are you sure you want to cancel this event? Registered participants will be notified.',
                        'Cancel',
                        'text-yellow-600 bg-yellow-50'
                    );

                    if (confirmed) {
                        await eventService.updateEventStatus(event.id, 'cancelled');
                        EventManager.render.cards();
                    }
                });
                eventCard.querySelector('.delete-button').addEventListener('click', async () => {
                    const confirmed = await modalService.confirmationModal(
                        'Delete Event',
                        'Are you sure you want to delete this event? This action cannot be undone.',
                        'Delete',
                        'text-red-600 bg-red-50'
                    );

                    if (confirmed) {
                        await eventService.deleteEvent(event.id);
                        EventManager.render.cards();
                    }
                });
                eventCard.querySelector('.more-button').addEventListener('click', () => {
                    EventManager.render.detailModal(event);
                });

                container.appendChild(eventCard);
            });
        },
        detailModal(event) {
            const modal = modalService.formModal('Event Details');
            document.body.appendChild(modal);

            const content = modal.querySelector('#modal-content');
            content.className = `flex flex-col gap-6`;

            const renderEventInfo = (event) => {
                return `
                <div class="flex flex-col gap-3">
                    <div class="flex items-center">
                        <h2 class="text-xl font-semibold text-gray-800 mr-3">${event.title}</h2>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">${event.description}</p>

                    <div class="flex items-center gap-2 text-sm text-gray-700">
                        <i class="fas fa-calendar text-purple-500 w-4"></i><span>${event.date}</span>
                        <i class="fas fa-clock text-purple-500 w-4 ml-2"></i><span>${event.time}</span>
                    </div>

                    <div class="flex items-center gap-2 text-sm text-gray-700">
                        ${
                            event.isOnline
                                ? `<i class="fas fa-video text-purple-500 w-4"></i><span>Online</span>`
                                : `<i class="fas fa-location-dot text-purple-500 w-4"></i><span>${event.location}</span>`
                        }
                    </div>

                    <div class="flex items-center gap-2 text-sm text-gray-700">
                        <i class="fas fa-users text-purple-500 w-4"></i>
                        <span>${event.registeredUsers.length}/${event.maxParticipants} registered</span>
                    </div>
                </div>
                `;
            };
            const renderParticipationsPanel = (event) => {
                return `
                <div class="flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Registered Participants</h3>
                        <div class="flex gap-2">
                        <button id="export-csv-button" class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer">
                            <i class="fas fa-file-csv"></i> Export CSV
                        </button>
                        <button id="export-excel-button" class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
                            <i class="fas fa-file-excel"></i> Export Excel
                        </button>
                        </div>
                    </div>
                    <div id="participants-list" class="flex flex-col gap-2 text-sm text-gray-500 max-h-[288px] overflow-y-auto overflow-x-auto">
                        <div class="min-w-[500px]">
                            <div class="grid grid-cols-3 font-medium text-gray-700 border-b pb-1">
                                <span>Name</span>
                                <span>Email</span>
                                <span>Role</span>
                            </div>
                            ${EventManager.uiElements.getParticipantsList(event)}
                        </div>
                    </div>
                </div>
                `;
            };
            const renderNotificationPanel = (event) => {
                return `
                <div class="flex flex-col gap-3">
                    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Send Notification To All Registered Participants</h3>
                    <textarea id="notification-message" rows="3" placeholder="Write your message..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"></textarea>
                    <button id="send-notification-button" class="px-4 py-2 text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors cursor-pointer">
                        <i class="fas fa-bell mr-2"></i>Send to All Participants
                    </button>
                </div>
                `;
            };

            content.innerHTML = `
                ${renderEventInfo(event)}
                <hr class="border-gray-100">
                ${renderParticipationsPanel(event)}
                <hr class="border-gray-100">
                ${renderNotificationPanel(event)}
            `;

            content.querySelector('#export-csv-button').addEventListener('click', () => {
                if (!event.registeredUsers.length) return;

                const headers = ['Name', 'Email', 'Role'];
                const rows = event.registeredUsers.map((p) => [p.name, p.email, p.role]);

                const csv = [headers, ...rows]
                    .map((row) => row.map((cell) => `"${cell}"`).join(','))
                    .join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${event.title}-participants.csv`;
                a.click();
                URL.revokeObjectURL(url);
            });
            content.querySelector('#export-excel-button').addEventListener('click', () => {
                if (!event.registeredUsers.length) return;

                const rows = event.registeredUsers
                    .map(
                        (p) => `
                    <tr>
                        <td>${p.name}</td>
                        <td>${p.email}</td>
                        <td>${p.role}</td>
                    </tr>
                `
                    )
                    .join('');

                const table = `
                    <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                `;

                const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${event.title}-participants.xls`;
                a.click();
                URL.revokeObjectURL(url);
            });
            content.querySelector('#send-notification-button').addEventListener('click', () => {
                const message = content.querySelector('#notification-message').value;
                if (!message.trim()) return;
                eventService.createNotification({ eventId: event.id, message: message });
                content.querySelector('#notification-message').value = '';
            });
        },
        fromModal(update) {
            const modal = modalService.formModal(
                update ? 'Update Event Details' : 'Schedule Event'
            );
            document.body.appendChild(modal);

            const content = modal.querySelector('#modal-content');
            content.className = `flex flex-col gap-6`;

            EventManager.formState.isOnline = update?.isOnline ?? false;
            EventManager.formState.update = update || null;

            const renderTitleField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
                    <input type="text" id="event-title" value="${update?.title ?? ''}" placeholder="Enter event title" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderDescriptionField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Description</label>
                    <textarea id="event-description" placeholder="Enter event description" rows="3" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none">${update?.description ?? ''}</textarea>
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderTypeField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Type <span class="text-red-500">*</span></label>
                    <select id="event-type" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <option value="" disabled ${!update ? 'selected' : ''}>Select event type</option>
                    <option value="career-day"  ${update?.type === 'career-day' ? 'selected' : ''}>Career Day</option>
                    <option value="workshop"    ${update?.type === 'workshop' ? 'selected' : ''}>Workshop</option>
                    <option value="networking"  ${update?.type === 'networking' ? 'selected' : ''}>Networking</option>
                    <option value="internship"  ${update?.type === 'internship' ? 'selected' : ''}>Internship</option>
                    </select>
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderDateTimeFields = () => {
                return `
                <div class="flex gap-3">
                    <div class="flex flex-col gap-1 flex-1">
                    <label class="text-sm font-medium text-gray-700">Date <span class="text-red-500">*</span></label>
                    <input type="date" id="event-date" value="${update?.date ?? ''}" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                    </div>
                    <div class="flex flex-col gap-1 flex-1">
                    <label class="text-sm font-medium text-gray-700">Time <span class="text-red-500">*</span></label>
                    <input type="time" id="event-time" value="${update?.time ?? ''}" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                    </div>
                </div>
                `;
            };
            const renderOnlineToggle = () => {
                return `
                <div class="flex items-center gap-3">
                    <label class="text-sm font-medium text-gray-700">Online Event</label>
                    <div id="online-toggle" class="w-10 h-6 ${update?.isOnline ? 'bg-purple-400' : 'bg-gray-200'} rounded-full cursor-pointer transition-colors duration-200 relative">
                    <div id="online-toggle-knob" class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${update?.isOnline ? 'translate-x-4' : ''}"></div>
                    </div>
                    <span id="online-toggle-label" class="text-sm text-gray-400">${update?.isOnline ? 'Yes' : 'No'}</span>
                </div>
                <div id="location-field" class="flex flex-col gap-1 ${update?.isOnline ? 'hidden' : ''}">
                    <label class="text-sm font-medium text-gray-700">Location <span class="text-red-500">*</span></label>
                    <input type="text" id="event-location" value="${update?.location ?? ''}" placeholder="Enter event location" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderMaxParticipantsField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Max Participants <span class="text-red-500">*</span></label>
                    <input type="number" id="event-max-participants" value="${update?.maxParticipants ?? ''}" placeholder="Enter max participants" min="1" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderFormActions = () => {
                return `
                <div class="flex gap-3">
                    <button type="button" id="cancel-modal-button" class="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-lg cursor-pointer">Cancel</button>
                    <button type="submit" class="flex-1 px-4 py-2 text-sm font-medium text-white ${update ? 'bg-purple-500 hover:bg-purple-600' : 'bg-green-500 hover:bg-green-600'} transition-colors duration-200 rounded-lg cursor-pointer">
                        <i class="fas ${update ? 'fa-save' : 'fa-calendar-plus'} mr-2"></i>
                        ${update ? 'Update Event' : 'Create Event'}
                    </button>
                </div>
                `;
            };

            content.innerHTML = `
            <form id="event-form" class="flex flex-col gap-4" novalidate>
                ${renderTitleField()}
                ${renderDescriptionField()}
                ${renderTypeField()}
                ${renderDateTimeFields()}
                ${renderOnlineToggle()}
                ${renderMaxParticipantsField()}
                ${renderFormActions()}
            </form>
            `;

            document.getElementById('online-toggle').addEventListener('click', () => {
                EventManager.formState.isOnline = !EventManager.formState.isOnline;
                const isOnline = EventManager.formState.isOnline;

                document
                    .getElementById('online-toggle')
                    .classList.toggle('bg-purple-400', isOnline);
                document.getElementById('online-toggle').classList.toggle('bg-gray-200', !isOnline);
                document
                    .getElementById('online-toggle-knob')
                    .classList.toggle('translate-x-4', isOnline);
                document.getElementById('online-toggle-label').textContent = isOnline
                    ? 'Yes'
                    : 'No';
                document.getElementById('location-field').classList.toggle('hidden', isOnline);
            });

            document.getElementById('cancel-modal-button').addEventListener('click', () => {
                modalService.closeModal();
            });

            document.getElementById('event-form').addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!EventManager.validation.validateForm()) return;

                const isOnline = EventManager.formState.isOnline;
                const update = EventManager.formState.update;
                const dateValue = document.getElementById('event-date').value;
                const timeValue = document.getElementById('event-time').value;

                const data = {
                    title: document.getElementById('event-title').value.trim(),
                    description: document.getElementById('event-description').value.trim(),
                    type: document.getElementById('event-type').value,
                    date: dateValue,
                    time: timeValue,
                    isOnline,
                    location: isOnline
                        ? ''
                        : document.getElementById('event-location').value.trim(),
                    maxParticipants: Number(
                        document.getElementById('event-max-participants').value
                    ),
                };

                if (update) {
                    await eventService.updateEvent(update.id, data);
                } else {
                    await eventService.createEvent(data);
                }

                modalService.closeModal();
                EventManager.render.cards();
            });
        },
    },

    uiElements: {
        getBarPercentage(current, max) {
            return Math.min((current / max) * 100, 100);
        },
        getBarColor(current, max) {
            const ratio = current / max;
            if (ratio >= 0.9) return 'bg-red-500';
            if (ratio >= 0.6) return 'bg-yellow-500';
            return 'bg-green-500';
        },
        getStatusStyle(status) {
            switch (status) {
                case 'upcoming':
                    return 'bg-blue-100 text-blue-700';
                case 'cancelled':
                    return 'bg-red-100 text-red-700';
                case 'completed':
                    return 'bg-green-100 text-green-700';
                default:
                    return 'bg-gray-100 text-gray-700';
            }
        },
        getParticipantsList(event) {
            let rows = '';
            event.registeredUsers.forEach((participant) => {
                rows += `
                <div class="grid grid-cols-3 py-2 border-b border-gray-100 hover:bg-gray-50">
                    <span>${participant.name}</span>
                    <span>${participant.email}</span>
                    <span>${participant.role}</span>
                </div>
                `;
            });
            return rows;
        },
    },

    validation: {
        validateForm() {
            let valid = true;

            const { showError, clearError } = EventManager.validation;
            const isOnline = EventManager.formState.isOnline;
            const update = EventManager.formState.update;

            const title = document.getElementById('event-title');
            const type = document.getElementById('event-type');
            const date = document.getElementById('event-date');
            const time = document.getElementById('event-time');
            const location = document.getElementById('event-location');
            const maxParticipants = document.getElementById('event-max-participants');

            if (!title.value.trim()) {
                showError(title, 'Title is required.');
                valid = false;
            } else {
                clearError(title);
            }

            if (!type.value) {
                showError(type, 'Please select an event type.');
                valid = false;
            } else {
                clearError(type);
            }

            if (!date.value) {
                showError(date, 'Date is required.');
                valid = false;
            } else {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    showError(date, 'Date cannot be in the past.');
                    valid = false;
                } else {
                    clearError(date);
                }
            }

            if (!time.value) {
                showError(time, 'Time is required.');
                valid = false;
            } else {
                clearError(time);
            }

            if (!isOnline) {
                if (!location.value.trim()) {
                    showError(location, 'Location is required for in-person events.');
                    valid = false;
                } else {
                    clearError(location);
                }
            }

            if (!maxParticipants.value) {
                showError(maxParticipants, 'Max participants is required.');
                valid = false;
            }

            if (update && Number(maxParticipants.value) < update.registeredUsers.length) {
                showError(
                    maxParticipants,
                    `Cannot be less than current registrations (${update.registeredUsers.length}).`
                );
                valid = false;
            }

            return valid;
        },
        showError(input, message) {
            const errorSpan = input.closest('.flex-col, .flex-1').querySelector('.error-msg');
            if (!errorSpan) return;
            errorSpan.textContent = message;
            errorSpan.classList.remove('hidden');
            input.classList.add('border-red-400');
            input.classList.remove('border-gray-200');
        },
        clearError(input) {
            const errorSpan = input.closest('.flex-col, .flex-1').querySelector('.error-msg');
            if (!errorSpan) return;
            errorSpan.textContent = '';
            errorSpan.classList.add('hidden');
            input.classList.remove('border-red-400');
            input.classList.add('border-gray-200');
        },
    },

    listeners: {
        atachAll() {
            document.getElementById('schedule-event-button').addEventListener('click', () => {
                EventManager.render.fromModal(null);
            });
            document.getElementById('type-buttons').addEventListener('click', (e) => {
                const btn = e.target.closest('.type-btn');
                if (!btn) return;
                EventManager.filterState.activeType = btn.dataset.type;
                document.querySelectorAll('.type-btn').forEach((b) => {
                    b.classList.remove('bg-purple-100', 'text-purple-700', 'font-semibold');
                    b.classList.add('text-gray-500', 'bg-gray-100');
                });
                btn.classList.add('bg-purple-100', 'text-purple-700', 'font-semibold');
                btn.classList.remove('text-gray-500', 'bg-gray-100');
                EventManager.render.cards();
            });

            document.getElementById('sort-select').addEventListener('change', (e) => {
                EventManager.filterState.sortBy = e.target.value;
                EventManager.render.cards();
            });
        },
    },
};
