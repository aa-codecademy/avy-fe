/**
 * Messages Controller (Student/Alumni)
 * Inbox of conversations with companies.
 *
 * User story: "Message to company"
 *
 * Available mock service methods:
 *  - mockDataService.getMessageThreads(userId)
 *  - mockDataService.getMessages({ userId, threadId, companyId })
 *  - mockDataService.sendMessage(messageData)
 *  - mockDataService.markMessageAsRead(id)
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

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
    return `${Math.floor(days / 365)}y ago`;
}

function renderMessageRow(n) {
    const unreadDot = !n.read
        ? `<span class="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-2"></span>`
        : `<span class="w-2 h-2 flex-shrink-0"></span>`;
    const titleClass = !n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-500';
    const rowBg = !n.read ? 'bg-white border-l-4 border-purple-500' : 'bg-gray-50';
    return `
        <div class="notification-row flex items-start gap-3 p-4 rounded-lg mb-2 cursor-pointer hover:shadow-md transition-all ${rowBg}"
             data-id="${n.id}" data-link="${n.link || ''}">
            ${unreadDot}
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <i class="fas fa-envelope text-purple-600"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="${titleClass} truncate">${n.title}</p>
                <p class="text-gray-500 text-sm mt-0.5">${n.message}</p>
            </div>
            <span class="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap mt-1">${timeAgo(n.createdAt)}</span>
        </div>
    `;
}

export default async function messagesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || !['student', 'alumni'].includes(user.role)) {
        window.router.navigate('/dashboard');
        return;
    }

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-envelope text-purple-600 mr-3"></i>
                            Messages
                        </h1>
                        <p class="text-gray-600">Your conversations with companies</p>
                    </div>
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center py-16">
                        <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">TODO: Messages inbox</h3>
                        <p class="text-gray-500">Implement thread list, thread view, compose/reply.</p>
        <div class="flex justify-center items-center h-64"><div class="spinner"></div></div>
    `;
    document.getElementById('logoutBtn')?.addEventListener('click', () => authService.logout());

    const allNotifications = await mockDataService.getNotifications(user.id);
    const notifications = allNotifications.filter((n) => n.type === 'message_received');

    function renderPage() {
        const unreadCount = notifications.filter((n) => !n.read).length;
        const feedHtml =
            notifications.length === 0
                ? `<div class="card no-hover text-center py-16">
                    <i class="fas fa-envelope-open text-5xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 text-lg">No messages yet.</p>
               </div>`
                : notifications.map(renderMessageRow).join('');

        return `
            ${renderAppHeader(user, window.location.pathname)}
            <div class="bg-gray-50 min-h-screen py-8">
                <div class="container mx-auto px-4 max-w-3xl">
                    <div class="fade-in">
                        <div class="flex items-start justify-between gap-4 mb-6 flex-wrap">
                            <div>
                                <h1 class="text-4xl font-bold text-gray-800 mb-1">
                                    <i class="fas fa-envelope text-purple-600 mr-3"></i>Messages
                                </h1>
                                <p class="text-gray-500">Your conversations with companies</p>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap">
                                ${
                                    unreadCount > 0
                                        ? `
                                    <button id="markAllReadBtn" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
                                        <i class="fas fa-check-double mr-2"></i>Mark all as read
                                    </button>
                                `
                                        : ''
                                }
                            </div>
                        </div>
                        <div id="messagesFeed">${feedHtml}</div>
                    </div>
                </div>
            </div>
        `;
    }

    function attachEvents() {
        document.querySelectorAll('.notification-row').forEach((row) => {
            row.addEventListener('click', async () => {
                const id = row.dataset.id;
                const link = row.dataset.link;
                const n = notifications.find((item) => item.id === id);
                if (n && !n.read) {
                    await mockDataService.markNotificationAsRead(id);
                    n.read = true;
                    if (typeof window.refreshMessagesHeaderBadge === 'function')
                        window.refreshMessagesHeaderBadge(user.id);
                    app.innerHTML = renderPage();
                    attachEvents();
                }
                if (link) window.router.navigate(link);
            });
        });

        document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
            // Only mark message_received notifications as read — don't touch other types
            await Promise.all(
                notifications
                    .filter((n) => !n.read)
                    .map((n) => mockDataService.markNotificationAsRead(n.id))
            );
            notifications.forEach((n) => {
                n.read = true;
            });
            if (typeof window.refreshMessagesHeaderBadge === 'function')
                window.refreshMessagesHeaderBadge(user.id);
            app.innerHTML = renderPage();
            attachEvents();
        });

        document.getElementById('logoutBtn')?.addEventListener('click', () => authService.logout());
    }

    app.innerHTML = renderPage();
    attachEvents();
}
