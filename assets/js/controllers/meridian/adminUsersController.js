/**
 * Admin Users Controller
 * User management dashboard for administrators
 */
import authService from '../../services/authService.js';
import languageService from '../../services/languageService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminUsersController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    const t = (key) => languageService.translate(key);

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const allUsers = await mockDataService.getAllUsers();
    const analytics = await mockDataService.getAnalytics();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-users-cog text-purple-600 mr-3"></i>
                            User Management
                        </h1>
                        <p class="text-gray-600">Manage all platform users</p>
                    </div>
                    <div class="card">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xl font-bold text-gray-800">
                                <span id="userCount">${allUsers.length}</span> Users
                            </h3>
                            <span class="text-sm text-gray-500">Total platform users: ${analytics.totalUsers}</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-100 border-b-2 border-gray-300">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">User</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Email</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Role</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderUsersTable(allUsers)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function renderUsersTable(users) {
    return users
        .map((user) => {
            const roleColors = {
                student: 'bg-blue-100 text-blue-800',
                alumni: 'bg-green-100 text-green-800',
                employer: 'bg-orange-100 text-orange-800',
                admin: 'bg-purple-100 text-purple-800',
            };
            return `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                <td class="px-4 py-4">
                    <div class="flex items-center">
                        <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full mr-3 border-2 border-gray-200" />
                        <div>
                            <p class="font-semibold text-gray-800">${user.name}</p>
                            ${user.currentPosition ? `<p class="text-sm text-gray-500">${user.currentPosition}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 text-gray-700">${user.email}</td>
                <td class="px-4 py-4">
                    <span class="px-3 py-1 ${roleColors[user.role] || 'bg-gray-100 text-gray-800'} rounded-full text-sm font-semibold capitalize">
                        ${user.role}
                    </span>
                </td>
                <td class="px-4 py-4">
                    ${
                        user.profileVisibility === 'public'
                            ? '<span class="text-green-600"><i class="fas fa-eye mr-1"></i> Public</span>'
                            : '<span class="text-gray-600"><i class="fas fa-lock mr-1"></i> Private</span>'
                    }
                </td>
            </tr>
        `;
        })
        .join('');
}
