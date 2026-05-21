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
import { renderAppHeader, refreshHeaderBadge } from '../../views/appHeader.js';
import mockDataService from '../../services/mockDataService.js';

const POLL_INTERVAL_MS = 30000; // 30 seconds
let pollIntervalId = null;
let seenNotificationIds = new Set();

function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function getNotificationIcon(type) {
    switch (type) {
        case 'application_submitted':
        case 'application_status':
            return 'fas fa-file-alt text-blue-500';
        case 'message_received':
            return 'fas fa-comments text-green-500';
        case 'system_alert':
            return 'fas fa-bell text-purple-500';
        default:
            return 'fas fa-info-circle text-gray-500';
    }
}

function showBrowserNotification(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    new Notification(title, {
        body,
        icon: '/assets/img/notification-icon.png',
    });
}

async function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
        await Notification.requestPermission();
    }
}

function renderNotificationItem(notification) {
    const iconClass = getNotificationIcon(notification.type);
    return `
        <div class="notification-item border rounded-lg p-4 mb-3 bg-white shadow-sm">
            <div class="flex justify-between items-start">
                <div>
                    <div class="text-sm text-gray-500">${formatTimestamp(notification.createdAt)}</div>
                    <div class="text-lg font-semibold text-gray-800 mt-2">${notification.title}</div>
                    <p class="text-gray-600 mt-1">${notification.message}</p>
                </div>
                <div class="text-2xl">
                    <i class="${iconClass}"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <span class="text-sm ${notification.read ? 'text-gray-400' : 'text-purple-600'}">
                    ${notification.read ? 'Read' : 'New'}
                </span>
                <button
                    class="mark-read-btn px-3 py-1 rounded bg-purple-600 text-white text-sm"
                    data-id="${notification.id}"
                    ${notification.read ? 'disabled' : ''}
                >
                    Mark as read
                </button>
            </div>
        </div>
    `;
}

async function loadNotifications(user) {
    const notifications = await mockDataService.getNotifications(user.id);
    const container = document.getElementById('notificationsList');

    if (!container) return;

    if (!notifications.length) {
        container.innerHTML = `
            <div class="card p-8 text-center bg-white rounded-lg shadow-sm">
                <h3 class="text-xl font-semibold text-gray-800">No notifications yet</h3>
                <p class="text-gray-500 mt-2">New application and candidate response alerts will appear here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notifications
        .map((notification) => renderNotificationItem(notification))
        .join('');

    container.querySelectorAll('.mark-read-btn').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const id = event.currentTarget.dataset.id;
            await mockDataService.markNotificationAsRead(id);
            await refreshNotifications(user);
        });
    });
}

async function refreshNotifications(user) {
    const notifications = await mockDataService.getNotifications(user.id, { unreadOnly: false });

    const newNotifications = notifications.filter((notification) => {
        const isNew = !seenNotificationIds.has(notification.id);
        if (isNew) {
            seenNotificationIds.add(notification.id);
        }
        return isNew && !notification.read;
    });

    newNotifications.forEach((notification) => {
        if (
            notification.type === 'application_submitted' ||
            notification.type === 'application_status'
        ) {
            showBrowserNotification('New application alert', notification.message);
        } else if (notification.type === 'message_received') {
            showBrowserNotification('Candidate response', notification.message);
        }
    });

    await loadNotifications(user);
    const count = await mockDataService.getUnreadCount(user.id);
    const badge = document.getElementById('notificationBadge');
    if (badge) badge.textContent = count > 0 ? count : '';
    refreshHeaderBadge(user.id);
}

async function markAllAsRead(user) {
    await mockDataService.markAllAsRead(user.id);
    await refreshNotifications(user);
}

export default async function employerNotificationsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    await requestNotificationPermission();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                <i class="fas fa-bell text-purple-600 mr-3"></i>
                                Notifications
                            </h1>
                            <p class="text-gray-600">Alerts about new applications and candidate replies</p>
                        </div>
                        <div class="mt-4 md:mt-0">
                            <button id="markAllBtn" class="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-sm">
                                Mark all as read
                            </button>
                            <span id="notificationBadge"
                                  class="ml-3 inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                            </span>
                        </div>
                    </div>
                    <div id="notificationsList"></div>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    const markAllBtn = document.getElementById('markAllBtn');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', async () => {
            await markAllAsRead(user);
        });
    }

    await refreshNotifications(user);

    if (pollIntervalId) {
        clearInterval(pollIntervalId);
    }
    pollIntervalId = setInterval(() => refreshNotifications(user), POLL_INTERVAL_MS);
}
