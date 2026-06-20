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
import { renderAppHeader } from '../../views/appHeader.js';

export default async function messagesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || !['student', 'alumni'].includes(user.role)) {
        window.router.navigate('/dashboard');
        return;
    }

    // TODO (student task): render thread list + selected thread, support send/reply
    // const threads = await mockDataService.getMessageThreads(user.id);

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
                    </div>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
