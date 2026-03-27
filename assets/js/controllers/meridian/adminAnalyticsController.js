/**
 * Admin Analytics Controller
 * Platform analytics dashboard for administrators
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminAnalyticsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }
    
    const analytics = await mockDataService.getAnalytics();
    
    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-chart-line text-purple-600 mr-3"></i>
                            Platform Analytics
                        </h1>
                        <p class="text-gray-600">Overview of platform performance and metrics</p>
                    </div>
                    <div class="grid md:grid-cols-4 gap-6 mb-8">
                        <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white"><p class="text-blue-100 mb-1">Total Users</p><h3 class="text-4xl font-bold">${analytics.totalUsers}</h3></div>
                        <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"><p class="text-purple-100 mb-1">Active Jobs</p><h3 class="text-4xl font-bold">${analytics.activeJobs}</h3></div>
                        <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white"><p class="text-green-100 mb-1">Applications</p><h3 class="text-4xl font-bold">${analytics.totalApplications}</h3></div>
                        <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white"><p class="text-orange-100 mb-1">Hired</p><h3 class="text-4xl font-bold">${analytics.hiredCount}</h3></div>
                    </div>
                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6">
                            <i class="fas fa-chart-area text-purple-600 mr-2"></i>
                            Monthly Growth Trends
                        </h2>
                        <div class="bg-gray-100 rounded-lg p-8 text-center">
                            <i class="fas fa-chart-line text-gray-300 text-6xl mb-4"></i>
                            <p class="text-gray-500 text-lg">Chart visualization will be implemented in Phase 2 with charting library</p>
                            <p class="text-gray-400 text-sm mt-2">
                                Users: +${analytics.monthlyGrowth.users}% |
                                Jobs: +${analytics.monthlyGrowth.jobs}% |
                                Applications: +${analytics.monthlyGrowth.applications}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
