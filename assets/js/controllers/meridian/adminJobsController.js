/**
 * Admin Jobs Controller
 * Manage all platform job listings for administrators.
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminJobsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const [jobs, companies] = await Promise.all([
        mockDataService.getAllJobs(),
        mockDataService.getAllCompanies(),
    ]);

    const companyMap = Object.fromEntries(companies.map((company) => [company.id, company]));
    const industries = [
        ...new Set(companies.map((company) => company.industry).filter(Boolean)),
    ].sort();
    const statuses = ['pending', 'active', 'paused', 'closed'];
    const employmentTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
    const workModes = ['onsite', 'remote', 'hybrid'];
    const experienceLevels = ['intern', 'junior', 'mid', 'senior'];

    const counts = {
        total: jobs.length,
        pending: jobs.filter((job) => job.status === 'pending').length,
        active: jobs.filter((job) => job.status === 'active').length,
        paused: jobs.filter((job) => job.status === 'paused').length,
        closed: jobs.filter((job) => job.status === 'closed').length,
    };

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-briefcase text-purple-600 mr-3"></i>
                            Job Listings
                        </h1>
                        <p class="text-gray-600">Review and manage all employer job postings across the platform.</p>
                    </div>

                    <div class="grid gap-4 md:grid-cols-5 mb-6">
                        <div class="card p-5 bg-white shadow-sm">
                            <p class="text-sm text-gray-500">Total jobs</p>
                            <h3 class="text-3xl font-bold text-gray-800">${counts.total}</h3>
                        </div>
                        <div class="card p-5 bg-white shadow-sm">
                            <p class="text-sm text-gray-500">Pending approval</p>
                            <h3 class="text-3xl font-bold text-orange-600">${counts.pending}</h3>
                        </div>
                        <div class="card p-5 bg-white shadow-sm">
                            <p class="text-sm text-gray-500">Active listings</p>
                            <h3 class="text-3xl font-bold text-green-600">${counts.active}</h3>
                        </div>
                        <div class="card p-5 bg-white shadow-sm">
                            <p class="text-sm text-gray-500">Paused listings</p>
                            <h3 class="text-3xl font-bold text-yellow-600">${counts.paused}</h3>
                        </div>
                        <div class="card p-5 bg-white shadow-sm">
                            <p class="text-sm text-gray-500">Closed listings</p>
                            <h3 class="text-3xl font-bold text-red-600">${counts.closed}</h3>
                        </div>
                    </div>

                    <div class="card mb-6">
                        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 items-end">
                            <div>
                                <label for="jobSearch" class="form-label">Search</label>
                                <input id="jobSearch" type="text" class="form-input w-full" placeholder="Title, company, location, skills..." />
                            </div>
                            <div>
                                <label for="statusFilter" class="form-label">Status</label>
                                <select id="statusFilter" class="form-input w-full">
                                    <option value="">All statuses</option>
                                    ${statuses.map((status) => `<option value="${status}">${status}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label for="companyFilter" class="form-label">Company</label>
                                <select id="companyFilter" class="form-input w-full">
                                    <option value="">All companies</option>
                                    ${companies.map((company) => `<option value="${company.id}">${company.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label for="industryFilter" class="form-label">Industry</label>
                                <select id="industryFilter" class="form-input w-full">
                                    <option value="">All industries</option>
                                    ${industries.map((industry) => `<option value="${industry}">${industry}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label for="employmentTypeFilter" class="form-label">Employment type</label>
                                <select id="employmentTypeFilter" class="form-input w-full">
                                    <option value="">All types</option>
                                    ${employmentTypes.map((type) => `<option value="${type}">${type}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label for="workModeFilter" class="form-label">Work mode</label>
                                <select id="workModeFilter" class="form-input w-full">
                                    <option value="">All modes</option>
                                    ${workModes.map((mode) => `<option value="${mode}">${mode}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label for="experienceFilter" class="form-label">Experience level</label>
                                <select id="experienceFilter" class="form-input w-full">
                                    <option value="">All levels</option>
                                    ${experienceLevels.map((level) => `<option value="${level}">${level}</option>`).join('')}
                                </select>
                            </div>
                            <div class="flex items-center gap-2">
                                <button id="applyJobFilters" class="btn btn-primary w-full">Apply filters</button>
                                <button id="clearJobFilters" class="btn btn-secondary w-full">Reset</button>
                            </div>
                        </div>
                    </div>

                    <div class="card overflow-x-auto">
                        <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                            <p class="text-gray-600"><span id="jobCount">${jobs.length}</span> listings</p>
                            <select id="jobSort" class="form-input w-full md:w-auto">
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="mostApplicants">Most applicants</option>
                                <option value="highestSalary">Highest salary</option>
                            </select>
                        </div>
                        <table class="w-full min-w-max">
                            <thead class="bg-gray-100 border-b-2 border-gray-300">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Job title</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Company</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Location</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Type</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Work mode</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Experience</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="jobTableBody">
                                ${renderJobRows(jobs, companyMap)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupJobManagement(jobs, companyMap);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function renderJobRows(jobs, companyMap) {
    if (!jobs.length) {
        return `
            <tr>
                <td class="px-4 py-6 text-center text-gray-500" colspan="8">
                    No job listings match your filters.
                </td>
            </tr>
        `;
    }

    return jobs
        .map((job) => {
            const company = companyMap[job.companyId] || {};
            const statusStyle =
                {
                    pending: 'bg-orange-100 text-orange-800',
                    active: 'bg-green-100 text-green-800',
                    paused: 'bg-yellow-100 text-yellow-800',
                    closed: 'bg-red-100 text-red-800',
                }[job.status] || 'bg-gray-100 text-gray-800';

            return `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="px-4 py-4">
                        <div class="font-semibold text-gray-800 cursor-pointer" data-job-id="${job.id}">${job.title}</div>
                        <p class="text-sm text-gray-500 mt-1 line-clamp-2">${job.description}</p>
                    </td>
                    <td class="px-4 py-4 text-gray-700">${company.name || 'Unknown'}</td>
                    <td class="px-4 py-4 text-gray-700">${job.location || 'Any'}</td>
                    <td class="px-4 py-4 text-gray-700 capitalize">${job.employmentType}</td>
                    <td class="px-4 py-4 text-gray-700 capitalize">${job.workMode}</td>
                    <td class="px-4 py-4 text-gray-700 capitalize">${job.experienceLevel}</td>
                    <td class="px-4 py-4">
                        <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusStyle}">${job.status}</span>
                    </td>
                    <td class="px-4 py-4 space-y-2">
                        ${renderJobActionButtons(job)}
                    </td>
                </tr>
            `;
        })
        .join('');
}

function renderJobActionButtons(job) {
    const buttons = [];
    if (job.status === 'pending') {
        buttons.push(
            `<button data-action="approve" data-id="${job.id}" class="btn btn-success w-full">Approve</button>`
        );
        buttons.push(
            `<button data-action="reject" data-id="${job.id}" class="btn btn-danger w-full">Reject</button>`
        );
    } else if (job.status === 'active') {
        buttons.push(
            `<button data-action="pause" data-id="${job.id}" class="btn btn-secondary w-full">Pause</button>`
        );
        buttons.push(
            `<button data-action="close" data-id="${job.id}" class="btn btn-danger w-full">Close</button>`
        );
    } else if (job.status === 'paused') {
        buttons.push(
            `<button data-action="activate" data-id="${job.id}" class="btn btn-primary w-full">Activate</button>`
        );
        buttons.push(
            `<button data-action="close" data-id="${job.id}" class="btn btn-danger w-full">Close</button>`
        );
    } else if (job.status === 'closed') {
        buttons.push(
            `<button data-action="activate" data-id="${job.id}" class="btn btn-primary w-full">Reopen</button>`
        );
    }

    buttons.push(
        `<button data-action="delete" data-id="${job.id}" class="btn btn-muted w-full">Delete</button>`
    );
    return buttons.join('');
}

function setupJobManagement(initialJobs, companyMap) {
    const searchInput = document.getElementById('jobSearch');
    const statusFilter = document.getElementById('statusFilter');
    const companyFilter = document.getElementById('companyFilter');
    const industryFilter = document.getElementById('industryFilter');
    const employmentTypeFilter = document.getElementById('employmentTypeFilter');
    const workModeFilter = document.getElementById('workModeFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const applyBtn = document.getElementById('applyJobFilters');
    const clearBtn = document.getElementById('clearJobFilters');
    const sortSelect = document.getElementById('jobSort');
    const tableBody = document.getElementById('jobTableBody');
    const jobCount = document.getElementById('jobCount');

    const refreshTable = (jobs) => {
        tableBody.innerHTML = renderJobRows(jobs, companyMap);
        attachJobActionListeners(jobs, companyMap);
        jobCount.textContent = jobs.length;
    };

    const applyFilters = async () => {
        const filters = {
            search: searchInput.value,
            status: statusFilter.value,
            companyId: companyFilter.value,
            industry: industryFilter.value,
            employmentType: employmentTypeFilter.value,
            workMode: workModeFilter.value,
            experienceLevel: experienceFilter.value,
        };

        const filteredJobs = await mockDataService.getAllJobs(filters);
        sortJobs(filteredJobs, sortSelect.value);
        refreshTable(filteredJobs);
    };

    const resetFilters = () => {
        searchInput.value = '';
        statusFilter.value = '';
        companyFilter.value = '';
        industryFilter.value = '';
        employmentTypeFilter.value = '';
        workModeFilter.value = '';
        experienceFilter.value = '';
        sortSelect.value = 'newest';
        refreshTable(initialJobs);
    };

    applyBtn.addEventListener('click', applyFilters);
    clearBtn.addEventListener('click', resetFilters);
    sortSelect.addEventListener('change', () => applyFilters());
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            applyFilters();
        }
    });

    attachJobActionListeners(initialJobs);
}

function attachJobActionListeners(currentJobs, companyMap) {
    document.querySelectorAll('#jobTableBody [data-action]').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const action = event.currentTarget.dataset.action;
            const id = event.currentTarget.dataset.id;
            const job = currentJobs.find((jobItem) => jobItem.id === id);
            if (!job) return;

            try {
                if (action === 'delete') {
                    const confirmed = window.confirm('Delete this job listing permanently?');
                    if (!confirmed) return;
                    await mockDataService.deleteJob(id);
                } else {
                    let newStatus;
                    if (action === 'approve') {
                        newStatus = 'active';
                    } else if (action === 'reject') {
                        newStatus = 'closed';
                    } else {
                        newStatus =
                            action === 'pause'
                                ? 'paused'
                                : action === 'activate'
                                  ? 'active'
                                  : 'closed';
                    }
                    await mockDataService.updateJob(id, { status: newStatus });
                }

                const refreshedJobs = await mockDataService.getAllJobs();
                sortJobs(refreshedJobs, document.getElementById('jobSort').value);
                document.getElementById('jobTableBody').innerHTML = renderJobRows(
                    refreshedJobs,
                    companyMap
                );
                document.getElementById('jobCount').textContent = refreshedJobs.length;
                attachJobActionListeners(refreshedJobs, companyMap);
            } catch (error) {
                console.error('Job update failed', error);
                alert('Unable to update the job listing. Please try again.');
            }
        });
    });
}

function sortJobs(jobs, sortKey) {
    if (!jobs || !jobs.length) return;
    switch (sortKey) {
        case 'oldest':
            jobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'mostApplicants':
            jobs.sort((a, b) => b.applications - a.applications);
            break;
        case 'highestSalary':
            jobs.sort((a, b) => (b.salaryRange.max || 0) - (a.salaryRange.max || 0));
            break;
        default:
            jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}
