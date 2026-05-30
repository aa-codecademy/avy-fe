/**
 * Employer Messages Controller
 * Conversations with candidates.
 *
 * User story: "6.1 Contact Candidates"
 *
 * Available mock service methods:
 *  - mockDataService.getMessageThreads(userId)
 *  - mockDataService.getMessages({ userId, threadId })
 *  - mockDataService.sendMessage(messageData)
 *  - mockDataService.markMessageAsRead(id)
 */
import authService from '../../services/authService.js';
import languageService from '../../services/languageService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function employerMessagesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    // TODO (student task): list candidate threads, allow sending messages/interview invitations
    // const threads = await mockDataService.getMessageThreads(user.id);

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-envelope text-purple-600 mr-3"></i>
                            Messages
                        </h1>
                        <p class="text-gray-600">Conversations with candidates</p>
                    </div>
                    <div class="card text-center py-16">
                        <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">TODO: Candidate messages</h3>
                        <p class="text-gray-500">Implement thread list, thread view, and compose form.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
