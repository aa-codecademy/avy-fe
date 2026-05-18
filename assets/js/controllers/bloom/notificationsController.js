/**
 * Notifications Controller (Student/Alumni/Employer/Admin)
 * In-app notifications list with filtering and mark-as-read.
 *
 * User stories:
 *  - "Personalized notifications" (task 14 — preferences live in profile/settings)
 *  - "Events and industry news" (task 15)
 */

import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

const NOTIFICATION_CATEGORIES = [
  { key: 'messages', label: 'Messages' },
  { key: 'interviewInvites', label: 'Interview invites' },
  { key: 'applicationStatus', label: 'Application status' },
  { key: 'successfulApplication', label: 'Successful application' },
  { key: 'passwordChange', label: 'Password change' },
];

const TYPE_CONFIG = {
    application_status: {
        icon: 'fa-clipboard-check',
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-100'
    },
    interview_invitation: {
        icon: 'fa-calendar-check',
        colorClass: 'text-green-600',
        bgClass: 'bg-green-100'
    },
    message_received: {
        icon: 'fa-envelope',
        colorClass: 'text-purple-600',
        bgClass: 'bg-purple-100'
    },
    application_submitted: {
        icon: 'fa-paper-plane',
        colorClass: 'text-indigo-600',
        bgClass: 'bg-indigo-100'
    },
    password_changed: {
        icon: 'fa-key',
        colorClass: 'text-yellow-600',
        bgClass: 'bg-yellow-100'
    },
    registration_success: {
        icon: 'fa-user-check',
        colorClass: 'text-green-600',
        bgClass: 'bg-green-100'
    },
    event_reminder: {
        icon: 'fa-calendar-alt',
        colorClass: 'text-red-600',
        bgClass: 'bg-red-100'
    },
    system_alert: {
        icon: 'fa-exclamation-triangle',
        colorClass: 'text-orange-600',
        bgClass: 'bg-orange-100'
    },
    info: {
        icon: 'fa-info-circle',
        colorClass: 'text-gray-600',
        bgClass: 'bg-gray-100'
    },
};

const APPLICATION_TYPES = ['application_status', 'application_submitted', 'interview_invitation'];

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();

    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    if (years >= 1) return `${years}y ago`;

    return `${days}d ago`;
}

function filterNotifications(notifications, filter) {
    switch (filter) {
        case 'unread': return notifications.filter(n => !n.read);
        case 'events': return notifications.filter(n => n.type === 'event_reminder');
        case 'applications': return notifications.filter(n => APPLICATION_TYPES.includes(n.type));
        case 'messages': return notifications.filter(n => n.type === 'message_received');
        default: return notifications;
    }
}

function renderNotificationRow(n) {
    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;

    const unreadDot = !n.read
        ? `<span class="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2"></span>`
        : `<span class="w-2 h-2 flex-shrink-0"></span>`;

    const titleClass = !n.read
        ? 'font-semibold text-gray-900'
        : 'font-medium text-gray-500';

    const rowBg = !n.read
        ? 'bg-white border-l-4 border-indigo-500'
        : 'bg-gray-50';

    return `
        <div class="notification-row flex items-start gap-3 p-4 rounded-lg mb-2 cursor-pointer hover:shadow-md transition-all ${rowBg}"
             data-id="${n.id}" data-link="${n.link || ''}">
            ${unreadDot}
            <div class="flex-shrink-0 w-10 h-10 rounded-full ${cfg.bgClass} flex items-center justify-center">
                <i class="fas ${cfg.icon} ${cfg.colorClass}"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="${titleClass} truncate">${n.title}</p>
                <p class="text-gray-500 text-sm mt-0.5">${n.message}</p>
            </div>
            <span class="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap mt-1">${timeAgo(n.createdAt)}</span>
        </div>
    `;
}

function renderEventCard(event) {
    const dateStr = new Date(event.date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
    const modeIcon = event.isOnline ? 'fa-video' : 'fa-map-marker-alt';
    const spotsLeft = event.maxParticipants - event.registeredCount;

    return `
        <div class="card no-hover p-4 border-l-4 border-indigo-500">
            <div class="flex items-start justify-between gap-4 flex-wrap">
                <div class="flex-1 min-w-0">
                    <span class="inline-block text-xs font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-2">
                        ${event.type.replace(/-/g, ' ')}
                    </span>
                    <h3 class="font-semibold text-gray-800">${event.title}</h3>
                    <p class="text-sm text-gray-500 mt-1">${event.description}</p>
                    <div class="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                        <span><i class="fas fa-calendar mr-1"></i>${dateStr} at ${event.time}</span>
                        <span><i class="fas ${modeIcon} mr-1"></i>${event.location}</span>
                        <span>
                            <i class="fas fa-users mr-1"></i>${event.registeredCount}/${event.maxParticipants} registered
                            ${spotsLeft <= 10 ? `<span class="text-orange-500 font-medium ml-1">(${spotsLeft} spots left)</span>` : ''}
                        </span>
                    </div>
                </div>
                <a href="/events" data-link class="btn btn-secondary" style="padding: 0.5rem 1rem; white-space: nowrap; font-size: 0.875rem;">
                    <i class="fas fa-arrow-right mr-1"></i>View Details
                </a>
            </div>
        </div>
    `;
}

export default async function notificationsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="flex justify-center items-center h-64">
            <div class="spinner"></div>
        </div>
    `;
    document.getElementById('logoutBtn')?.addEventListener('click', () => authService.logout());

    const [notifications, events, preferences] = await Promise.all([
        mockDataService.getNotifications(user.id),
        mockDataService.getEvents(),
        mockDataService.getNotificationPreferences(user.id),
    ]);

    // Draft for the modal — not auto-saved, only persisted on explicit Save
    let draft = structuredClone(preferences);

    let activeFilter = 'all';

    function renderPreferencesModal() {
        return `
            <div id="notificationSettingsModal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center px-4">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">Notification settings</h2>
                            <p class="text-gray-600 text-sm">Choose what notifications you receive and where you receive them.</p>
                        </div>
                        <button id="closeNotificationSettings" class="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-6">
                        <div class="hidden md:grid md:grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-semibold text-gray-500">
                            <div class="col-span-4">What</div>
                            <div class="col-span-2">Receive</div>
                            <div class="col-span-6">Where</div>
                        </div>
                        <div class="divide-y divide-gray-100">
                            ${NOTIFICATION_CATEGORIES.map(({ key, label }) => {
                                const v = preferences[key] || { enabled: true, channel: 'browser' };
                                return `
                                    <div class="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start md:items-center">
                                        <div class="md:col-span-4"><p class="font-medium text-gray-800">${label}</p></div>
                                        <div class="md:col-span-2">
                                            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                                                <input type="checkbox" class="pref-enabled accent-purple-600" data-key="${key}" ${v.enabled ? 'checked' : ''}/> On
                                            </label>
                                        </div>
                                        <div class="md:col-span-6">
                                            <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6">
                                                <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                                                    <input type="radio" name="channel-${key}" value="browser" class="pref-channel accent-purple-600" data-key="${key}" ${v.channel === 'browser' ? 'checked' : ''} ${!v.enabled ? 'disabled' : ''}/> Browser
                                                </label>
                                                <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                                                    <input type="radio" name="channel-${key}" value="email" class="pref-channel accent-purple-600" data-key="${key}" ${v.channel === 'email' ? 'checked' : ''} ${!v.enabled ? 'disabled' : ''}/> Email
                                                </label>
                                                <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                                                    <input type="radio" name="channel-${key}" value="both" class="pref-channel accent-purple-600" data-key="${key}" ${v.channel === 'both' ? 'checked' : ''} ${!v.enabled ? 'disabled' : ''}/> Both
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                        <button id="cancelNotificationSettings" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                        <button id="saveNotificationSettings" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Save changes</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderPage() {
        const filtered = filterNotifications(notifications, activeFilter);
        const unreadCount = notifications.filter(n => !n.read).length;

        const tabs = [
            { key: 'all',          label: 'All',            count: notifications.length },
            { key: 'unread',       label: 'Unread',         count: unreadCount },
            { key: 'events',       label: 'Events & News',  count: notifications.filter(n => n.type === 'event_reminder').length },
            { key: 'applications', label: 'Applications',   count: notifications.filter(n => APPLICATION_TYPES.includes(n.type)).length },
            { key: 'messages',     label: 'Messages',       count: notifications.filter(n => n.type === 'message_received').length },
        ];

        const tabsHtml = tabs.map(t => {
            const isActive = activeFilter === t.key;
            const btnClass = isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200';
            const badgeClass = isActive ? 'bg-indigo-400 text-white' : 'bg-gray-100 text-gray-500';
            return `
                <button class="filter-tab px-4 py-2 rounded-lg text-sm font-medium transition-all ${btnClass}" data-filter="${t.key}">
                    ${t.label}
                    ${t.count > 0 ? `<span class="ml-1 text-xs font-semibold ${badgeClass} rounded-full px-1.5 py-0.5">${t.count}</span>` : ''}
                </button>
            `;
        }).join('');

        let feedHtml = '';

        if (activeFilter === 'events') {
            const upcoming = events.filter(e => new Date(e.date) >= new Date());
            if (upcoming.length > 0) {
                feedHtml += `
                    <div class="mb-6">
                        <h2 class="text-base font-semibold text-gray-700 mb-3">
                            <i class="fas fa-calendar-alt text-indigo-500 mr-2"></i>Upcoming Events
                        </h2>
                        <div class="grid gap-3">
                            ${upcoming.map(renderEventCard).join('')}
                        </div>
                    </div>
                    <h2 class="text-base font-semibold text-gray-700 mb-3">
                        <i class="fas fa-bell text-indigo-500 mr-2"></i>Event Notifications
                    </h2>
                `;
            }
        }

        if (filtered.length === 0) {
            feedHtml += `
                <div class="card no-hover text-center py-16">
                    <i class="fas fa-bell-slash text-5xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 text-lg">No notifications here.</p>
                </div>
            `;
        } else {
            feedHtml += filtered.map(renderNotificationRow).join('');
        }

        return `
            ${renderAppHeader(user, window.location.pathname)}
            <div class="bg-gray-50 min-h-screen py-8">
                <div class="container mx-auto px-4 max-w-3xl">
                    <div class="fade-in">
                        <div class="flex items-start justify-between gap-4 mb-6 flex-wrap">
                            <div>
                                <h1 class="text-4xl font-bold text-gray-800 mb-1">
                                    <i class="fas fa-bell text-purple-600 mr-3"></i>Notifications
                                </h1>
                                <p class="text-gray-500">Stay up to date on your activity</p>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap">
                                ${unreadCount > 0 ? `
                                    <button id="markAllReadBtn" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
                                        <i class="fas fa-check-double mr-2"></i>Mark all as read
                                    </button>
                                ` : ''}
                                <button id="openNotificationSettings" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-purple-400 hover:text-purple-600 transition">
                                    <i class="fas fa-sliders-h mr-2"></i>Notification settings
                                </button>
                            </div>
                        </div>

                        <div class="flex gap-2 mb-6 flex-wrap">
                            ${tabsHtml}
                        </div>

                        <div id="notificationsFeed">
                            ${feedHtml}
                        </div>
                    </div>
                </div>
            </div>
            ${renderPreferencesModal()}
        `;
    }

    function attachEvents() {
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                activeFilter = btn.dataset.filter;
                app.innerHTML = renderPage();
                attachEvents();
            });
        });

        document.querySelectorAll('.notification-row').forEach(row => {
            row.addEventListener('click', async () => {
                const id = row.dataset.id;
                const link = row.dataset.link;
                const n = notifications.find(item => item.id === id);

                if (n && !n.read) {
                    await mockDataService.markNotificationAsRead(id);
                    n.read = true;
                    app.innerHTML = renderPage();
                    attachEvents();
                }

                if (link) window.router.navigate(link);
            });
        });

        document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
            await mockDataService.markAllAsRead(user.id);
            notifications.forEach(n => { n.read = true; });
            app.innerHTML = renderPage();
            attachEvents();
        });

        document.getElementById('logoutBtn')?.addEventListener('click', () => authService.logout());

        // ── Notification preferences modal (Task 14) ────────────────────────
        const modal   = document.getElementById('notificationSettingsModal');
        const openBtn = document.getElementById('openNotificationSettings');
        const closeBtn = document.getElementById('closeNotificationSettings');
        const cancelBtn = document.getElementById('cancelNotificationSettings');
        const saveBtn  = document.getElementById('saveNotificationSettings');

        const openModal  = () => { draft = structuredClone(preferences); modal.classList.remove('hidden'); modal.classList.add('flex'); };
        const closeModal = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); };

        openBtn?.addEventListener('click', openModal);
        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);

        document.querySelectorAll('.pref-enabled').forEach(input => {
            input.addEventListener('change', e => {
                const k = e.target.dataset.key;
                draft[k].enabled = !!e.target.checked;
                document.querySelectorAll(`input[name="channel-${k}"]`).forEach(r => r.disabled = !draft[k].enabled);
            });
        });

        document.querySelectorAll('.pref-channel').forEach(input => {
            input.addEventListener('change', e => {
                const k = e.target.dataset.key;
                draft[k].channel = e.target.value;
            });
        });

        saveBtn?.addEventListener('click', async () => {
            await mockDataService.updateNotificationPreferences(user.id, draft);
            Object.assign(preferences, draft);
            closeModal();
        });
    }

    app.innerHTML = renderPage();
    attachEvents();
}