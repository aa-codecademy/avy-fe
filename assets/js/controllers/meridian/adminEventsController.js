import authService from '../../services/authService.js';
import eventService from '../../services/adminContentService/eventService.js';
import { renderAppHeader } from '../../views/appHeader.js';
import modalService from '../../services/adminContentService/modalService.js';
import mockDataService from '../../services/mockDataService.js';

export default async function adminEventsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    const analytics = await mockDataService.getAnalytics();

    if (!user || user.role !== 'admin') {
        window.location.navigate('/dashboard');
        return;
    }

    document.innerHTML = `<div class="spinner"></div>`;
    setTimeout(300);
    document.innerHTML = ``;

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="container mx-auto px-4 py-8">
            <div class="fade-in">
                <div class="relative bg-white shadow-md rounded-2xl mb-6">
                    <div class="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2"><i class="fas fa-calendar text-purple-600 mr-3"></i>Platform Event Management</h1>
                        <p class="text-gray-600">Meridian-Event Management</p>
                    </div>
                </div>

                <div class="flex gap-6">
                    <div class="flex flex-col gap-4 w-1/4 h-fit relative bg-white shadow-md rounded-2xl p-5">
                        <div class="cursor-pointer transition-all duration-300 hover:bg-green-500 group relative shadow-md rounded-2xl p-5" id="schedule-event-button">
                            <div class="flex items-center justify-between">
                                <p class="text-xl font-bold transition-colors duration-300 group-hover:text-white">Schedule Event</p>
                                <i class="fas fa-calendar-plus text-4xl text-gray-400 transition-colors duration-300 group-hover:text-white"></i>
                            </div>
                        </div>

                        <div style="background:var(--color-bg)" class="flex flex-col gap-2 relative shadow-md rounded-2xl p-5">
                            <p class="text-sm font-semibold text-gray-500 mb-2">Filters</p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 w-3/4">
                        <div class="relative bg-white shadow-md rounded-2xl p-5">
                            <h2 class="text-2xl font-bold text-gray-800">Current Events</h2>
                        </div>
                        <div id="event-card-container" class="flex flex-col gap-4 relative bg-white shadow-md rounded-2xl p-5"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const controller = new AdminEventsController();
    await controller.initializePage();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

class AdminEventsController {
    constructor() {
        this.eventService = eventService;
    }

    async initializePage() {
        document
            .getElementById('schedule-event-button')
            .addEventListener('click', () => this.displayForm());
        this.displayEventCards();
    }

    async displayEventCards() {
        const container = document.getElementById('event-card-container');
        try {
            const events = await this.eventService.getEvents();
            if (events.length === 0) {
                container.innerHTML = `<h2 class="text-lg font-bold text-gray-800 leading-tight">No events found.</h2>`;
                return;
            }
            container.innerHTML = ``;
            events.forEach((event) => container.appendChild(this.buildEventCard(event)));
        } catch (error) {
            console.error('Failed to load events:', error);
            container.innerHTML = `<p class="text-red-500 text-sm">Failed to load events.</p>`;
        }
    }

    buildEventCard(event) {
        const card = document.createElement('div');
        card.classList.add('event-card', 'card', 'flex', 'flex-col', 'gap-4');
        card.dataset.id = event.id;
        card.style.background = 'var(--color-bg)';

        const getEventMetaData = (event) => {
            const getBarPercentage = (registered, max) => {
                return Math.min((registered / max) * 100, 100);
            };
            const getBarColor = (registered, max) => {
                const percent = (registered / max) * 100;
                if (percent >= 90) return 'bg-red-500';
                if (percent >= 60) return 'bg-yellow-500';
                return 'bg-green-500';
            };
            const getStatusStyle = (status) => {
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
            };

            return {
                barPercentage: getBarPercentage(
                    event.registeredUsers.length,
                    event.maxParticipants
                ),
                barColor: getBarColor(event.registeredUsers.length, event.maxParticipants),
                statusStyle: getStatusStyle(event.status),
            };
        };
        const eventMetaData = getEventMetaData(event);

        card.innerHTML = `
            <div class="flex items-start justify-between gap-2">
                <h2 class="text-lg font-bold text-gray-800 leading-tight">${event.title}</h2>
                <span class="text-xs font-semibold px-2 py-1 ${eventMetaData.statusStyle} rounded-full whitespace-nowrap">${event.status}</span>
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
                <div class="w-full bg-gray-200 rounded-full h-2"><div class="${eventMetaData.barColor} h-2 rounded-full transition-all duration-300" style="width: ${eventMetaData.barPercentage}%"></div></div>
            </div>

            <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                <div class="flex gap-2">
                    <button class="edit-button px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"><i class="fas fa-pen mr-1"></i>Edit</button>
                    <button class="cancel-button px-3 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors cursor-pointer"><i class="fas fa-ban mr-1"></i>Cancel</button>
                    <button class="delete-button px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"><i class="fas fa-trash mr-1"></i>Delete</button>
                    <button class="more-button px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"><i class="fas fa-ellipsis mr-1"></i>More</button>
                </div>
            </div>
        `;

        card.querySelector('.edit-button').addEventListener('click', () => {
            this.displayForm(event);
        });
        card.querySelector('.cancel-button').addEventListener('click', async () => {
            await this.eventService.updateEventStatus(event.id, 'cancelled');
            await this.displayEventCards();
        });
        card.querySelector('.delete-button').addEventListener('click', async () => {
            await this.eventService.deleteEvent(event.id);
            await this.displayEventCards();
        });
        card.querySelector('.more-button').addEventListener('click', () =>
            this.displayEventOverview(event)
        );

        return card;
    }

    displayEventOverview(event) {
        const content = document.createElement('div');
        content.classList.add('flex', 'flex-col', 'gap-6');

        const buildRegistrantsList = () => {
            return event.registeredUsers
                .map(
                    (user) => `
                <div class="grid grid-cols-3 py-2 border-b border-gray-100 hover:bg-gray-50">
                    <span>${user.name}</span>
                    <span>${user.email}</span>
                    <span>${user.role}</span>
                </div>
            `
                )
                .join('');
        };

        content.innerHTML = `
            <div class="flex flex-col gap-3">
                <div class="flex items-center">
                    <h2 class="text-xl font-semibold text-gray-800 mr-3">${event.title}</h2>

                    <button id="copy-id-button" class="flex items-center w-fit gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
                        <i class="fas fa-fingerprint"></i>
                        <span id="copy-id-label">${event.id}</span>
                    </button>
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

            <hr class="border-gray-100">

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
                        ${buildRegistrantsList()}
                    </div>
                </div>
            </div>

            <hr class="border-gray-100">

            <div class="flex flex-col gap-3">
                <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Send Notification To All Registered Participants</h3>
                <textarea id="notification-message" rows="3" placeholder="Write your message..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"></textarea>
                <button id="send-notification-button" class="px-4 py-2 text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors cursor-pointer">
                    <i class="fas fa-bell mr-2"></i>Send to All Participants
                </button>
            </div>
        `;

        content.querySelector('#copy-id-button').addEventListener('click', async () => {
            await navigator.clipboard.writeText(event.id);
            const label = content.querySelector('#copy-id-label');
            label.textContent = 'Copied!';
            setTimeout(() => (label.textContent = event.id), 1000);
        });

        content.querySelector('#export-csv-button').addEventListener('click', () => {});

        content.querySelector('#export-excel-button').addEventListener('click', () => {});

        content.querySelector('#send-notification-button').addEventListener('click', () => {
            const message = content.querySelector('#notification-message').value;
            if (!message.trim()) return;

            eventService.createNotification({ eventId: event.id, message: message });
            content.querySelector('#notification-message').value = '';
        });

        const modal = modalService.renderModal('Event Details');
        document.body.appendChild(modal);
        document.getElementById('modal-content').appendChild(content);
    }

    displayForm(updateForm = null) {
        const content = document.createElement('div');
        content.classList.add('flex', 'flex-col', 'gap-6');

        content.innerHTML = `
            <form id="event-form" class="flex flex-col gap-4" novalidate>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
                <input type="text" id="event-title" value="${updateForm?.title ?? ''}" placeholder="Enter event title" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Description</label>
                <textarea id="event-description" placeholder="Enter event description" rows="3" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none">${updateForm?.description ?? ''}</textarea>
                <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Type <span class="text-red-500">*</span></label>
                <select id="event-type" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="" disabled ${!updateForm ? 'selected' : ''}>Select event type</option>
                <option value="career-day"  ${updateForm?.type === 'career-day' ? 'selected' : ''}>Career Day</option>
                <option value="workshop"    ${updateForm?.type === 'workshop' ? 'selected' : ''}>Workshop</option>
                <option value="networking"  ${updateForm?.type === 'networking' ? 'selected' : ''}>Networking</option>
                <option value="internship"  ${updateForm?.type === 'internship' ? 'selected' : ''}>Internship</option>
                </select>
                <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
            </div>

            <div class="flex gap-3">
                <div class="flex flex-col gap-1 flex-1">
                <label class="text-sm font-medium text-gray-700">Date <span class="text-red-500">*</span></label>
                <input type="date" id="event-date" value="${updateForm?.date ?? ''}" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                <div class="flex flex-col gap-1 flex-1">
                <label class="text-sm font-medium text-gray-700">Time <span class="text-red-500">*</span></label>
                <input type="time" id="event-time" value="${updateForm?.time ?? ''}" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <label class="text-sm font-medium text-gray-700">Online Event</label>
                <div id="online-toggle" class="w-10 h-6 ${updateForm?.isOnline ? 'bg-purple-400' : 'bg-gray-200'} rounded-full cursor-pointer transition-colors duration-200 relative">
                <div id="online-toggle-knob" class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${updateForm?.isOnline ? 'translate-x-4' : ''}"></div>
                </div>
                <span id="online-toggle-label" class="text-sm text-gray-400">${updateForm?.isOnline ? 'Yes' : 'No'}</span>
            </div>

            <div id="location-field" class="flex flex-col gap-1 ${updateForm?.isOnline ? 'hidden' : ''}">
                <label class="text-sm font-medium text-gray-700">Location <span class="text-red-500">*</span></label>
                <input type="text" id="event-location" value="${updateForm?.location ?? ''}" placeholder="Enter event location" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">Max Participants <span class="text-red-500">*</span></label>
                <input type="number" id="event-max-participants" value="${updateForm?.maxParticipants ?? ''}" placeholder="Enter max participants" min="1" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
            </div>

            <hr class="border-gray-100">

            <div class="flex gap-3">
                <button type="button" id="cancel-modal-button" class="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-lg cursor-pointer">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2 text-sm font-medium text-white ${updateForm ? 'bg-purple-500 hover:bg-purple-600' : 'bg-green-500 hover:bg-green-600'} transition-colors duration-200 rounded-lg cursor-pointer">
                <i class="fas ${updateForm ? 'fa-save' : 'fa-calendar-plus'} mr-2"></i>
                ${updateForm ? 'Update Event' : 'Create Event'}
                </button>
            </div>

            </form>
        `;

        const modal = modalService.renderModal(
            updateForm ? 'Update Event Details' : 'Schedule Event'
        );
        document.body.appendChild(modal);
        document.getElementById('modal-content').appendChild(content);

        let isOnline = updateForm?.isOnline ?? false;

        const showError = (input, message) => {
            const errorSpan = input.closest('.flex-col, .flex-1').querySelector('.error-msg');
            if (!errorSpan) return;
            errorSpan.textContent = message;
            errorSpan.classList.remove('hidden');
            input.classList.add('border-red-400');
            input.classList.remove('border-gray-200');
        };

        const clearError = (input) => {
            const errorSpan = input.closest('.flex-col, .flex-1').querySelector('.error-msg');
            if (!errorSpan) return;
            errorSpan.textContent = '';
            errorSpan.classList.add('hidden');
            input.classList.remove('border-red-400');
            input.classList.add('border-gray-200');
        };

        const validateForm = () => {
            let valid = true;

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
            } else if (updateForm && Number(maxParticipants.value) < updateForm.registeredCount) {
                showError(
                    maxParticipants,
                    `Cannot be less than current registrations (${updateForm.registeredCount}).`
                );
                valid = false;
            } else {
                clearError(maxParticipants);
            }

            return valid;
        };

        const resolveEventStatus = (date, time) => {
            const now = new Date();
            const eventStart = new Date(`${date}T${time}`);
            const eventEnd = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000); // 2 Hours

            if (now < eventStart) return 'upcoming';
            if (now >= eventStart && now < eventEnd) return 'ongoing';
            return 'completed';
        };

        document.getElementById('online-toggle').addEventListener('click', () => {
            isOnline = !isOnline;
            const toggle = document.getElementById('online-toggle');
            const knob = document.getElementById('online-toggle-knob');
            const label = document.getElementById('online-toggle-label');
            const locationField = document.getElementById('location-field');

            toggle.classList.toggle('bg-purple-400', isOnline);
            toggle.classList.toggle('bg-gray-200', !isOnline);
            knob.classList.toggle('translate-x-4', isOnline);
            label.textContent = isOnline ? 'Yes' : 'No';
            locationField.classList.toggle('hidden', isOnline);
        });

        document.getElementById('cancel-modal-button').addEventListener('click', () => {
            modalService.closeModal();
        });

        document.getElementById('event-form').onsubmit = async (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            const dateValue = document.getElementById('event-date').value;
            const timeValue = document.getElementById('event-time').value;

            const data = {
                title: document.getElementById('event-title').value,
                description: document.getElementById('event-description').value,
                type: document.getElementById('event-type').value,
                date: dateValue,
                time: timeValue,
                location: isOnline ? '' : document.getElementById('event-location').value,
                maxParticipants: Number(document.getElementById('event-max-participants').value),
                isOnline: isOnline,
                status: resolveEventStatus(dateValue, timeValue),
            };

            if (updateForm) {
                await eventService.updateEvent(updateForm.id, data);
            } else {
                await eventService.createEvent(data);
            }

            modalService.closeModal();
            this.displayEventCards();
        };
    }
}
