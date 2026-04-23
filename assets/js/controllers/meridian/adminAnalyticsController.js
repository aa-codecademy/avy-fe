/**
 * Admin Analytics Controller
 * Platform analytics dashboard for administrators
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

function renderProfileAccessRequestsTable(requests, studentMap, companyMap, jobMap) {
    if (!requests.length) {
        return `
            <tr>
                <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                    No profile access requests found.
                </td>
            </tr>
        `;
    }

    return requests
        .map((request) => {
            const student = studentMap[request.studentId];
            const employerCompany = Object.values(companyMap).find(c =>
                c.contactEmail && c.contactEmail.includes('company')
            ); // Mock employer lookup
            const job = jobMap[request.jobId];

            const statusColors = {
                pending: 'bg-yellow-100 text-yellow-800',
                approved: 'bg-green-100 text-green-800',
                rejected: 'bg-red-100 text-red-800',
                expired: 'bg-gray-100 text-gray-800',
            };

            const statusLabels = {
                pending: 'Pending Review',
                approved: 'Approved',
                rejected: 'Rejected',
                expired: 'Expired',
            };

            return `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="px-4 py-4 align-top">
                        <div class="flex items-center gap-3">
                            <img src="${employerCompany?.logo || 'https://ui-avatars.com/api/?name=Employer&background=667eea&color=fff&size=32'}"
                                 alt="Employer" class="h-8 w-8 rounded-full object-cover" />
                            <div>
                                <p class="font-semibold text-gray-800">${employerCompany?.name || 'Unknown Employer'}</p>
                                <p class="text-sm text-gray-500">${employerCompany?.contactEmail || ''}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-4 align-top">
                        <div class="flex items-center gap-3">
                            <img src="${student?.avatar || 'https://ui-avatars.com/api/?name=Student&background=48bb78&color=fff&size=32'}"
                                 alt="Student" class="h-8 w-8 rounded-full object-cover" />
                            <div>
                                <p class="font-semibold text-gray-800">${student?.name || 'Unknown Student'}</p>
                                <p class="text-sm text-gray-500">${student?.email || ''}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-4 align-top text-gray-700">
                        ${job ? `${job.title}` : '<span class="text-gray-400">General Access</span>'}
                    </td>
                    <td class="px-4 py-4 align-top text-gray-700 max-w-xs">
                        <p class="text-sm">${request.requestReason}</p>
                    </td>
                    <td class="px-4 py-4 align-top text-gray-700 text-sm">
                        ${new Date(request.requestedAt).toLocaleDateString()}
                    </td>
                    <td class="px-4 py-4 align-top">
                        <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColors[request.status] || 'bg-gray-100 text-gray-800'}">
                            ${statusLabels[request.status] || request.status}
                        </span>
                        ${request.expiresAt && request.status === 'approved' ? `
                            <p class="text-xs text-gray-500 mt-1">
                                Expires: ${new Date(request.expiresAt).toLocaleDateString()}
                            </p>
                        ` : ''}
                    </td>
                    <td class="px-4 py-4 align-top">
                        ${request.status === 'pending' ? `
                            <div class="flex flex-col gap-2">
                                <button
                                    data-approve-request
                                    data-request-id="${request.id}"
                                    class="btn btn-success text-sm"
                                >
                                    <i class="fas fa-check mr-1"></i>
                                    Approve
                                </button>
                                <button
                                    data-reject-request
                                    data-request-id="${request.id}"
                                    class="btn btn-danger text-sm"
                                >
                                    <i class="fas fa-times mr-1"></i>
                                    Reject
                                </button>
                            </div>
                        ` : `
                            <div class="text-sm text-gray-600">
                                ${request.status === 'approved' ? 'Access granted' :
                                  request.status === 'rejected' ? 'Access denied' :
                                  request.status === 'expired' ? 'Access expired' : 'No actions'}
                            </div>
                        `}
                    </td>
                </tr>
            `;
        })
        .join('');
}

function bindRequestActionButtons() {
    const tableBody = document.getElementById('profileAccessRequestsTableBody');
    if (!tableBody) return;

    tableBody.querySelectorAll('button[data-approve-request]').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const requestId = event.currentTarget.dataset.requestId;
            const reviewNotes = prompt('Enter approval notes (optional):', 'Approved for 30-day access');

            if (reviewNotes !== null) { // User didn't cancel
                try {
                    await mockDataService.updateProfileAccessRequestStatus(requestId, 'approved', reviewNotes, 'admin1');
                    alert('Request approved successfully!');
                    // Refresh the table
                    const statusFilter = document.getElementById('requestStatusFilter');
                    loadProfileAccessRequests(statusFilter.value);
                } catch (error) {
                    console.error('Failed to approve request:', error);
                    alert('Failed to approve request. Please try again.');
                }
            }
        });
    });

    tableBody.querySelectorAll('button[data-reject-request]').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const requestId = event.currentTarget.dataset.requestId;
            const reviewNotes = prompt('Enter rejection reason:', 'Request does not meet approval criteria');

            if (reviewNotes !== null && reviewNotes.trim()) {
                try {
                    await mockDataService.updateProfileAccessRequestStatus(requestId, 'rejected', reviewNotes, 'admin1');
                    alert('Request rejected successfully!');
                    // Refresh the table
                    const statusFilter = document.getElementById('requestStatusFilter');
                    loadProfileAccessRequests(statusFilter.value);
                } catch (error) {
                    console.error('Failed to reject request:', error);
                    alert('Failed to reject request. Please try again.');
                }
            }
        });
    });
}

async function loadProfileAccessRequests(status = 'pending') {
    try {
        const filters = status ? { status } : {};
        const requests = await mockDataService.getProfileAccessRequests(filters);
        const users = await mockDataService.getUsersByRole('student');
        const alumni = await mockDataService.getUsersByRole('alumni');
        const allStudents = [...users, ...alumni];
        const companies = await mockDataService.getAllCompanies();
        const jobs = await mockDataService.getAllJobs();

        const studentMap = Object.fromEntries(allStudents.map(s => [s.id, s]));
        const companyMap = Object.fromEntries(companies.map(c => [c.id, c]));
        const jobMap = Object.fromEntries(jobs.map(j => [j.id, j]));

        const requestsTableBody = document.getElementById('profileAccessRequestsTableBody');
        requestsTableBody.innerHTML = renderProfileAccessRequestsTable(requests, studentMap, companyMap, jobMap);
        bindRequestActionButtons();
    } catch (error) {
        console.error('Failed to load profile access requests:', error);
        const requestsTableBody = document.getElementById('profileAccessRequestsTableBody');
        requestsTableBody.innerHTML = '<tr><td colspan="7" class="px-4 py-6 text-center text-red-600">Failed to load requests</td></tr>';
    }
}

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

                    <div class="mt-12">
                        <h2 class="text-3xl font-bold text-gray-800 mb-6">
                            <i class="fas fa-user-shield text-red-600 mr-3"></i>
                            Profile Access Requests
                        </h2>
                        <p class="text-gray-600 mb-6">Review and manage employer requests to access private student profiles</p>

                        <div class="card mb-6">
                            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
                                <div>
                                    <label for="requestStatusFilter" class="form-label">Status</label>
                                    <select id="requestStatusFilter" class="form-input w-full">
                                        <option value="">All statuses</option>
                                        <option value="pending" selected>Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                                <div class="flex items-end">
                                    <button id="refreshRequests" class="btn btn-secondary">
                                        <i class="fas fa-sync mr-2"></i>
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="card overflow-x-auto">
                            <table class="w-full min-w-max">
                                <thead class="bg-gray-100 border-b-2 border-gray-300">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Employer</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Student</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Job Position</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Request Reason</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Requested</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="profileAccessRequestsTableBody">
                                    <!-- Profile access requests will be loaded here -->
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

    // Profile Access Requests functionality
    const requestStatusFilter = document.getElementById('requestStatusFilter');
    const refreshRequestsBtn = document.getElementById('refreshRequests');
    const requestsTableBody = document.getElementById('profileAccessRequestsTableBody');

    requestStatusFilter.addEventListener('change', () => {
        loadProfileAccessRequests(requestStatusFilter.value);
    });

    refreshRequestsBtn.addEventListener('click', () => {
        loadProfileAccessRequests(requestStatusFilter.value);
    });

    // Load initial requests
    loadProfileAccessRequests();
}
