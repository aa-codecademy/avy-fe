/**
 * Admin Analytics Controller
 * Platform analytics dashboard for administrators
 */
import authService from '../services/authService.js';
import mockDataService from '../services/mockDataService.js';

export default async function adminAnalyticsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }
    
    const analytics = await mockDataService.getAnalytics();
    
    app.innerHTML = `
        ${renderHeader(user)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <!-- Page Header -->
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-chart-line text-purple-600 mr-3"></i>
                            Platform Analytics
                        </h1>
                        <p class="text-gray-600">Overview of platform performance and metrics</p>
                    </div>
                    
                    <!-- Main KPIs -->
                    <div class="grid md:grid-cols-4 gap-6 mb-8">
                        <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <p class="text-blue-100 mb-1">Total Users</p>
                                    <h3 class="text-4xl font-bold">${analytics.totalUsers}</h3>
                                </div>
                                <i class="fas fa-users text-5xl text-blue-200"></i>
                            </div>
                            <p class="text-blue-100 text-sm">
                                <i class="fas fa-arrow-up mr-1"></i> +${analytics.monthlyGrowth.users}% this month
                            </p>
                        </div>
                        
                        <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <p class="text-purple-100 mb-1">Active Jobs</p>
                                    <h3 class="text-4xl font-bold">${analytics.activeJobs}</h3>
                                </div>
                                <i class="fas fa-briefcase text-5xl text-purple-200"></i>
                            </div>
                            <p class="text-purple-100 text-sm">
                                Total: ${analytics.totalJobs} | <i class="fas fa-arrow-up mr-1"></i> +${analytics.monthlyGrowth.jobs}%
                            </p>
                        </div>
                        
                        <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <p class="text-green-100 mb-1">Applications</p>
                                    <h3 class="text-4xl font-bold">${analytics.totalApplications}</h3>
                                </div>
                                <i class="fas fa-file-alt text-5xl text-green-200"></i>
                            </div>
                            <p class="text-green-100 text-sm">
                                <i class="fas fa-arrow-up mr-1"></i> +${analytics.monthlyGrowth.applications}% this month
                            </p>
                        </div>
                        
                        <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <p class="text-orange-100 mb-1">Hired</p>
                                    <h3 class="text-4xl font-bold">${analytics.hiredCount}</h3>
                                </div>
                                <i class="fas fa-user-check text-5xl text-orange-200"></i>
                            </div>
                            <p class="text-orange-100 text-sm">
                                Success Rate: ${((analytics.hiredCount / analytics.totalApplications) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                    
                    <div class="grid lg:grid-cols-2 gap-6 mb-8">
                        <!-- Top Skills -->
                        <div class="card">
                            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                                <i class="fas fa-code text-purple-600 mr-2"></i>
                                Top In-Demand Skills
                            </h2>
                            <div class="space-y-4">
                                ${analytics.topSkills.map((skill, index) => `
                                    <div>
                                        <div class="flex justify-between mb-2">
                                            <span class="font-semibold text-gray-700">${index + 1}. ${skill.skill}</span>
                                            <span class="text-purple-600 font-bold">${skill.count} jobs</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-3">
                                            <div class="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500" 
                                                 style="width: ${(skill.count / analytics.topSkills[0].count) * 100}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Top Companies -->
                        <div class="card">
                            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                                <i class="fas fa-building text-purple-600 mr-2"></i>
                                Top Hiring Companies
                            </h2>
                            <div class="space-y-4">
                                ${analytics.topCompanies.map((company, index) => `
                                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div class="flex items-center gap-3">
                                            <span class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center">
                                                ${index + 1}
                                            </span>
                                            <div>
                                                <p class="font-semibold text-gray-800">${company.company}</p>
                                                <p class="text-sm text-gray-500">${company.activeJobs} active jobs</p>
                                            </div>
                                        </div>
                                        <span class="text-2xl font-bold text-purple-600">${company.applications}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Additional Stats -->
                    <div class="grid md:grid-cols-3 gap-6 mb-8">
                        <div class="card">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">
                                <i class="fas fa-user-graduate text-blue-600 mr-2"></i>
                                Student Stats
                            </h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Total Students</span>
                                    <span class="font-bold text-blue-600">${Math.floor(analytics.totalUsers * 0.4)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Total Alumni</span>
                                    <span class="font-bold text-green-600">${Math.floor(analytics.totalUsers * 0.3)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Placement Rate</span>
                                    <span class="font-bold text-purple-600">85%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">
                                <i class="fas fa-building text-orange-600 mr-2"></i>
                                Company Stats
                            </h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Total Companies</span>
                                    <span class="font-bold text-orange-600">${analytics.totalCompanies}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Active Employers</span>
                                    <span class="font-bold text-green-600">${Math.floor(analytics.totalCompanies * 0.8)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Avg Jobs/Company</span>
                                    <span class="font-bold text-purple-600">${(analytics.totalJobs / analytics.totalCompanies).toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">
                                <i class="fas fa-chart-pie text-purple-600 mr-2"></i>
                                Platform Health
                            </h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Response Rate</span>
                                    <span class="font-bold text-green-600">92%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Avg Time to Hire</span>
                                    <span class="font-bold text-blue-600">14 days</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">User Satisfaction</span>
                                    <span class="font-bold text-purple-600">4.7/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Monthly Growth Chart Placeholder -->
                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6">
                            <i class="fas fa-chart-area text-purple-600 mr-2"></i>
                            Monthly Growth Trends
                        </h2>
                        <div class="bg-gray-100 rounded-lg p-8 text-center">
                            <i class="fas fa-chart-line text-gray-300 text-6xl mb-4"></i>
                            <p class="text-gray-500 text-lg">
                                Chart visualization will be implemented in Phase 2 with charting library
                            </p>
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
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

function renderHeader(user) {
    return `
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Avy
                    </div>
                    <div class="flex items-center space-x-6">
                        <a href="/dashboard" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-home mr-1"></i> Dashboard
                        </a>
                        <a href="/admin/users" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-users-cog mr-1"></i> Users
                        </a>
                        <a href="/admin/jobs" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-briefcase mr-1"></i> Jobs
                        </a>
                        <a href="/admin/analytics" data-link class="text-purple-600 font-semibold">
                            <i class="fas fa-chart-bar mr-1"></i> Analytics
                        </a>
                        <div class="flex items-center space-x-3">
                            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full border-2 border-purple-600" />
                            <button id="logoutBtn" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;
}
