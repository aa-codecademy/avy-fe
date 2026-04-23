/**
 * Admin Analytics Controller
 * Platform analytics dashboard for administrators
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

function renderJobAnalytics(analytics) {
    const { job, totalApplications, statusBreakdown, applicationModeBreakdown, recentApplications } = analytics;

    const statusColors = {
        pending: 'bg-gray-100 text-gray-800',
        under_review: 'bg-blue-100 text-blue-800',
        interview: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
        hired: 'bg-green-100 text-green-800',
    };

    const statusLabels = {
        pending: 'Pending',
        under_review: 'Under Review',
        interview: 'Interview',
        rejected: 'Rejected',
        hired: 'Hired',
    };

    return `
        <div class="mb-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">${job.title}</h3>
            <p class="text-gray-600">${job.companyName} • Posted ${new Date(job.createdAt).toLocaleDateString()}</p>
            <p class="text-sm text-gray-500">Application Mode: ${job.applicationMode === 'easy_apply' ? 'Easy Apply' : 'Full Application Required'}</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <p class="text-purple-100 mb-1">Total Applications</p>
                <h3 class="text-4xl font-bold">${totalApplications}</h3>
            </div>
            <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <p class="text-blue-100 mb-1">Easy Apply</p>
                <h3 class="text-4xl font-bold">${applicationModeBreakdown.easyApply}</h3>
            </div>
            <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <p class="text-green-100 mb-1">Full Applications</p>
                <h3 class="text-4xl font-bold">${applicationModeBreakdown.fullApplication}</h3>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
            <div class="card">
                <h4 class="text-lg font-bold text-gray-800 mb-4">
                    <i class="fas fa-chart-pie text-purple-600 mr-2"></i>
                    Application Status Breakdown
                </h4>
                <div class="space-y-3">
                    ${Object.entries(statusBreakdown).map(([status, count]) => `
                        <div class="flex justify-between items-center">
                            <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}">
                                ${statusLabels[status]}
                            </span>
                            <span class="font-bold text-gray-800">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <h4 class="text-lg font-bold text-gray-800 mb-4">
                    <i class="fas fa-clock text-indigo-600 mr-2"></i>
                    Recent Applications
                </h4>
                <div class="space-y-3">
                    ${recentApplications.length > 0 ? recentApplications.map(app => `
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                                <p class="text-sm font-semibold text-gray-800">Application ${app.id}</p>
                                <p class="text-xs text-gray-500">${new Date(app.appliedAt).toLocaleDateString()}</p>
                            </div>
                            <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}">
                                ${statusLabels[app.status] || app.status}
                            </span>
                        </div>
                    `).join('') : '<p class="text-gray-500 text-sm">No applications yet</p>'}
                </div>
            </div>
        </div>
    `;
}

export default async function adminAnalyticsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }
    
    const analytics = await mockDataService.getAnalytics();
    const jobs = await mockDataService.getAllJobs();
    const companies = await mockDataService.getAllCompanies();
    const companyMap = Object.fromEntries(companies.map(c => [c.id, c]));
    
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

                    <div class="mt-12">
                        <h2 class="text-3xl font-bold text-gray-800 mb-6">
                            <i class="fas fa-chart-bar text-indigo-600 mr-3"></i>
                            Job Application Analytics
                        </h2>
                        <p class="text-gray-600 mb-6">Monitor application statistics for individual job listings</p>

                        <div class="card mb-6">
                            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
                                <div>
                                    <label for="jobSelect" class="form-label">Select Job Listing</label>
                                    <select id="jobSelect" class="form-input w-full">
                                        <option value="">Choose a job...</option>
                                        ${jobs.filter(job => job.status === 'active').map(job => {
                                            const company = companyMap[job.companyId];
                                            return `<option value="${job.id}">${job.title} - ${company?.name || 'Unknown'}</option>`;
                                        }).join('')}
                                    </select>
                                </div>
                                <div class="flex items-end">
                                    <button id="viewJobAnalytics" class="btn btn-primary" disabled>
                                        <i class="fas fa-chart-line mr-2"></i>
                                        View Analytics
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div id="jobAnalyticsContainer" class="hidden">
                            <div class="card">
                                <div id="jobAnalyticsContent">
                                    <!-- Job analytics will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    // Job Analytics functionality
    const jobSelect = document.getElementById('jobSelect');
    const viewAnalyticsBtn = document.getElementById('viewJobAnalytics');
    const analyticsContainer = document.getElementById('jobAnalyticsContainer');
    const analyticsContent = document.getElementById('jobAnalyticsContent');

    jobSelect.addEventListener('change', () => {
        viewAnalyticsBtn.disabled = !jobSelect.value;
    });

    viewAnalyticsBtn.addEventListener('click', async () => {
        const jobId = jobSelect.value;
        if (!jobId) return;

        try {
            const analytics = await mockDataService.getJobApplicationAnalytics(jobId);
            if (analytics) {
                analyticsContent.innerHTML = renderJobAnalytics(analytics);
                analyticsContainer.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Failed to load job analytics:', error);
            analyticsContent.innerHTML = '<p class="text-red-600">Failed to load analytics. Please try again.</p>';
            analyticsContainer.classList.remove('hidden');
        }
    });
}
