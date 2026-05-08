import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';
import { renderApplicationsGrid } from '../../components/applications/applicationsGrid.js';
import { renderStatsCards } from '../../components/applications/applicationsStats.js';
import { renderFilterSidebar } from '../../components/applications/applicationsFilters.js';
import { showToast } from '../../components/applications/applicationsHelpers.js';
import { handleWithdraw } from '../../handlers/withdrawHandler.js';
import { generateDemoApplications } from '../../components/applications/applicationsDemoData.js';

export default async function applicationsController() {
    try {
        const app = document.getElementById('app');
        const user = authService.getCurrentUser();

        if (!user || !['student', 'alumni'].includes(user.role)) {
            window.router.navigate('/dashboard');
            return;
        }

        app.innerHTML = `
            ${renderAppHeader(user, window.location.pathname)}
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        `;

        const [realApplications, companies, allJobs] = await Promise.all([
            mockDataService.getApplications({ userId: user.id }),
            mockDataService.getAllCompanies(),
            mockDataService.getAllJobs({ status: 'active' })
        ]);

        const enrichedRealApps = await Promise.all(realApplications.map(async (app) => {
            const job = await mockDataService.getJobById(app.jobId);
            const company = job ? await mockDataService.getCompanyById(job.companyId) : null;
            return {
                id: app.id,
                jobId: app.jobId,
                userId: app.userId,
                status: app.status,
                appliedDate: app.appliedAt,
                updatedAt: app.updatedAt || app.appliedAt,
                notes: app.notes || app.coverLetter?.substring(0, 100) || 'No additional notes',
                jobTitle: job?.title || 'Unknown Position',
                companyId: job?.companyId,
                companyName: company?.name || 'Unknown Company',
                companyEmail: company?.contactEmail || 'hr@company.com',
                location: job?.location || 'Not specified',
                employmentType: job?.employmentType || 'full-time'
            };
        }));

        const demoApps = generateDemoApplications(allJobs, companies, user);
        let allApplications = [...enrichedRealApps, ...demoApps];

        allApplications.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

        const stats = {
            pending: allApplications.filter(a => a.status === 'pending').length,
            under_review: allApplications.filter(a => a.status === 'under_review').length,
            interview: allApplications.filter(a => a.status === 'interview').length,
            accepted: allApplications.filter(a => a.status === 'accepted').length,
            rejected: allApplications.filter(a => a.status === 'rejected').length,
            declined: allApplications.filter(a => a.status === 'declined').length
        };

        const companyMap = {};
        companies.forEach(c => companyMap[c.id] = c);

        app.innerHTML = `
            ${renderAppHeader(user, window.location.pathname)}
            <div class="bg-gray-50 min-h-screen py-8">
                <div class="container mx-auto px-4">
                    <div class="fade-in">
                        <div class="mb-8">
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                <i class="fas fa-clipboard-list text-purple-600 mr-3"></i>
                                My Applications
                            </h1>
                            <p class="text-gray-600">Track and manage your job applications</p>
                        </div>

                        ${renderStatsCards(stats)}

                        <div class="grid lg:grid-cols-4 gap-6">
                            ${renderFilterSidebar(companies, allApplications.length, stats)}

                            <div class="lg:col-span-3">
                                <div class="flex justify-between items-center mb-4">
                                    <p class="text-gray-600">
                                        <span id="applicationCount">${allApplications.length}</span> applications found
                                    </p>
                                    <div class="flex gap-2">
                                        <button id="viewAllBtn" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
                                            <i class="fas fa-eye mr-1"></i> View All
                                        </button>
                                        <select id="sortBy" class="form-input w-auto">
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="company">Company A-Z</option>
                                            <option value="status">Status</option>
                                        </select>
                                    </div>
                                </div>

                                <div id="applicationsGrid" class="space-y-4">
                                    ${renderApplicationsGrid(allApplications, companyMap)}
                                </div>

                                <div id="emptyState" class="hidden text-center py-20">
                                    <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                                    <h3 class="text-2xl font-bold text-gray-600 mb-2">No applications found</h3>
                                    <p class="text-gray-500">Try adjusting your filters or browse jobs to apply</p>
                                    <button onclick="window.router.navigate('/job-board')" class="btn btn-primary mt-4">
                                        Browse Jobs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const cleanup = setupEventListeners(allApplications, companyMap, user);

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

        return cleanup;

    } catch (error) {
        console.error('Failed to load applications:', error);
        showToast('Failed to load applications. Please try again.', 'error');
        window.router.navigate('/dashboard');
    }
}

function setupEventListeners(allApplications, companyMap, user) {
    const statusFilter = document.getElementById('statusFilter');
    const companyFilter = document.getElementById('companyFilter');
    const dateFilter = document.getElementById('dateFilter');
    const sortBy = document.getElementById('sortBy');
    const viewAllBtn = document.getElementById('viewAllBtn');

    let cachedFiltered = null;
    let lastFilterState = null;

    const renderApplications = (filtered) => {
        const grid = document.getElementById('applicationsGrid');
        const emptyState = document.getElementById('emptyState');
        const count = document.getElementById('applicationCount');

        if (filtered.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
        } else {
            grid.innerHTML = renderApplicationsGrid(filtered, companyMap);
            emptyState.classList.add('hidden');
            attachWithdrawEventListeners(filtered);
        }
        count.textContent = filtered.length;
    };

    const applyFilters = () => {
        const currentFilterState = {
            status: statusFilter?.value || 'all',
            company: companyFilter?.value || '',
            date: dateFilter?.value || 'all',
            sort: sortBy?.value || 'newest'
        };

        if (JSON.stringify(currentFilterState) === JSON.stringify(lastFilterState) && cachedFiltered) {
            renderApplications(cachedFiltered);
            return;
        }

        lastFilterState = currentFilterState;

        let filtered = [...allApplications];

        const selectedStatus = statusFilter?.value;
        if (selectedStatus && selectedStatus !== 'all') {
            filtered = filtered.filter(app => app.status === selectedStatus);
        }

        const selectedCompany = companyFilter?.value;
        if (selectedCompany) {
            filtered = filtered.filter(app => app.companyId === selectedCompany);
        }

        const selectedDate = dateFilter?.value;
        if (selectedDate && selectedDate !== 'all') {
            const now = new Date();
            let cutoffDate;
            switch(selectedDate) {
                case 'week': cutoffDate = new Date(now.setDate(now.getDate() - 7)); break;
                case 'month': cutoffDate = new Date(now.setMonth(now.getMonth() - 1)); break;
                case 'quarter': cutoffDate = new Date(now.setMonth(now.getMonth() - 3)); break;
            }
            if (cutoffDate) {
                filtered = filtered.filter(app => new Date(app.appliedDate) >= cutoffDate);
            }
        }

        switch(sortBy?.value) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
                break;
            case 'company':
                filtered.sort((a, b) => {
                    const ca = companyMap[a.companyId]?.name || a.companyName || '';
                    const cb = companyMap[b.companyId]?.name || b.companyName || '';
                    return ca.localeCompare(cb);
                });
                break;
            case 'status':
                const order = { pending: 1, under_review: 2, interview: 3, accepted: 4, rejected: 5, declined: 6 };
                filtered.sort((a, b) => (order[a.status] || 99) - (order[b.status] || 99));
                break;
        }

        cachedFiltered = filtered;
        renderApplications(filtered);
    };

    const attachWithdrawEventListeners = (apps) => {
        document.querySelectorAll('.withdraw-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const appId = btn.dataset.id;
                const application = apps.find(a => a.id === appId);
                if (application) {
                    await handleWithdraw(application, user, btn.dataset.email, () => applyFilters());
                }
            };
        });
    };

    const clearFilters = () => {
        if (statusFilter) statusFilter.value = 'all';
        if (companyFilter) companyFilter.value = '';
        if (dateFilter) dateFilter.value = 'all';
        if (sortBy) sortBy.value = 'newest';
        cachedFiltered = null;
        lastFilterState = null;
        applyFilters();
    };

    const viewAllHandler = () => {
        if (statusFilter) statusFilter.value = 'all';
        if (companyFilter) companyFilter.value = '';
        if (dateFilter) dateFilter.value = 'all';
        cachedFiltered = null;
        lastFilterState = null;
        applyFilters();
    };

    document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
    document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
    sortBy?.addEventListener('change', applyFilters);
    viewAllBtn?.addEventListener('click', viewAllHandler);

    applyFilters();

    return () => {
        document.getElementById('applyFiltersBtn')?.removeEventListener('click', applyFilters);
        document.getElementById('clearFiltersBtn')?.removeEventListener('click', clearFilters);
        sortBy?.removeEventListener('change', applyFilters);
        viewAllBtn?.removeEventListener('click', viewAllHandler);
    };
}
