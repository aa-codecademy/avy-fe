/**
 * Admin Companies Controller
 * Review and approve or reject employer account applications.
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminCompaniesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const [applications, companies] = await Promise.all([
        mockDataService.getAllCompanyApplications(),
        mockDataService.getAllCompanies(),
    ]);

    const industries = [...new Set(applications.map((app) => app.industry).filter(Boolean))].sort();
    const companyCount = companies.length;
    const pendingCount = applications.filter((app) => app.status === 'pending').length;
    const rejectedCount = applications.filter((app) => app.status === 'rejected').length;
    const approvedCount = applications.filter((app) => app.status === 'approved').length;

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-check-circle text-purple-600 mr-3"></i>
                            Employer Applications
                        </h1>
                        <p class="text-gray-600">Review new employer account requests before they gain access to the platform.</p>
                    </div>

                    <div class="grid gap-4 md:grid-cols-3 mb-6">
                        <div class="card p-5 bg-white shadow-sm">
                            <p class="text-sm text-gray-500">Pending requests</p>
                            <h3 class="text-3xl font-bold text-gray-800">${pendingCount}</h3>
                        </div>
                        <div class="card p-5 bg-white shadow-sm">
                            <p class="text-sm text-gray-500">Approved applications</p>
                            <h3 class="text-3xl font-bold text-gray-800">${approvedCount}</h3>
                        </div>
                        <div class="card p-5 bg-white shadow-sm">
                            <p class="text-sm text-gray-500">Active companies</p>
                            <h3 class="text-3xl font-bold text-gray-800">${companyCount}</h3>
                        </div>
                    </div>

                    <div class="card mb-6">
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
                            <div>
                                <label for="applicationSearch" class="form-label">Search</label>
                                <input id="applicationSearch" type="text" class="form-input w-full" placeholder="Search company, rep, email or industry..." />
                            </div>
                            <div>
                                <label for="statusFilter" class="form-label">Status</label>
                                <select id="statusFilter" class="form-input w-full">
                                    <option value="">All statuses</option>
                                    <option value="pending" selected>Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label for="industryFilter" class="form-label">Industry</label>
                                <select id="industryFilter" class="form-input w-full">
                                    <option value="">All industries</option>
                                    ${industries.map((industry) => `<option value="${industry}">${industry}</option>`).join('')}
                                </select>
                            </div>
                            <div class="flex items-center">
                                <button id="resetFilters" class="btn btn-secondary w-full">Reset filters</button>
                            </div>
                        </div>
                    </div>

                    <div class="card overflow-x-auto">
                        <table class="w-full min-w-max">
                            <thead class="bg-gray-100 border-b-2 border-gray-300">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Company</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Representative</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Industry</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Location</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Submitted</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="companyApplicationTableBody">
                                ${renderApplicationRows(applications)}
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-12 mb-8">
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-star text-yellow-500 mr-3"></i>
                            Manage Active Companies
                        </h2>
                        <p class="text-gray-600">Mark companies as featured to promote them on the student dashboard.</p>
                    </div>

                    <div class="card overflow-x-auto">
                        <table class="w-full min-w-max">
                            <thead class="bg-gray-100 border-b-2 border-gray-300">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Company</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Industry</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Subscription Plan</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Active Jobs</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Featured</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="companyManagementTableBody">
                                ${renderCompanyManagementRows(companies)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupApplicationFilters(applications, industries);
    bindActionButtons();
    bindFeatureToggleButtons();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function renderApplicationRows(applications) {
    if (!applications.length) {
        return `
            <tr>
                <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                    No employer account applications found.
                </td>
            </tr>
        `;
    }

    return applications
        .map((app) => {
            const statusStyles = {
                pending: 'bg-yellow-100 text-yellow-800',
                approved: 'bg-green-100 text-green-800',
                rejected: 'bg-red-100 text-red-800',
            };
            return `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="px-4 py-4 align-top">
                        <p class="font-semibold text-gray-800">${app.companyName}</p>
                        <a href="${app.website}" target="_blank" class="text-sm text-purple-600 hover:underline">${app.website}</a>
                    </td>
                    <td class="px-4 py-4 align-top">
                        <p class="font-semibold text-gray-800">${app.representativeName}</p>
                        <p class="text-sm text-gray-500">${app.representativeEmail}</p>
                        <p class="text-sm text-gray-500 mt-1">${app.message}</p>
                    </td>
                    <td class="px-4 py-4 align-top text-gray-700">${app.industry}</td>
                    <td class="px-4 py-4 align-top text-gray-700">${app.location}</td>
                    <td class="px-4 py-4 align-top text-gray-700">${new Date(app.submittedAt).toLocaleDateString()}</td>
                    <td class="px-4 py-4 align-top">
                        <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[app.status] || 'bg-gray-100 text-gray-800'}">
                            ${app.status}
                        </span>
                    </td>
                    <td class="px-4 py-4 align-top space-y-2">
                        ${
                            app.status === 'pending'
                                ? `<button data-action="approve" data-id="${app.id}" class="btn btn-primary w-full">Approve</button>
                               <button data-action="reject" data-id="${app.id}" class="btn btn-secondary w-full">Reject</button>`
                                : `<div class="text-sm text-gray-600">No actions available</div>`
                        }
                    </td>
                </tr>
            `;
        })
        .join('');
}

function setupApplicationFilters(allApplications, industries) {
    const searchInput = document.getElementById('applicationSearch');
    const statusFilter = document.getElementById('statusFilter');
    const industryFilter = document.getElementById('industryFilter');
    const resetButton = document.getElementById('resetFilters');
    const tableBody = document.getElementById('companyApplicationTableBody');

    const applyFilters = () => {
        const search = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;
        const industry = industryFilter.value;

        const filtered = allApplications.filter((app) => {
            const matchesSearch =
                !search ||
                `${app.companyName} ${app.representativeName} ${app.representativeEmail} ${app.industry} ${app.location}`
                    .toLowerCase()
                    .includes(search);
            const matchesStatus = !status || app.status === status;
            const matchesIndustry = !industry || app.industry === industry;
            return matchesSearch && matchesStatus && matchesIndustry;
        });

        tableBody.innerHTML = renderApplicationRows(filtered);
        bindActionButtons();
    };

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    industryFilter.addEventListener('change', applyFilters);
    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        searchInput.value = '';
        statusFilter.value = 'pending';
        industryFilter.value = '';
        applyFilters();
    });
}

function bindActionButtons() {
    const tableBody = document.getElementById('companyApplicationTableBody');
    if (!tableBody) return;

    tableBody.querySelectorAll('button[data-action]').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const action = event.currentTarget.dataset.action;
            const id = event.currentTarget.dataset.id;
            const status = action === 'approve' ? 'approved' : 'rejected';
            const notes = action === 'approve' ? 'Approved by admin' : 'Rejected by admin';

            try {
                await mockDataService.updateCompanyApplicationStatus(id, status, notes);
                const updatedApplications = await mockDataService.getAllCompanyApplications();
                const updatedCompanies = await mockDataService.getAllCompanies();
                document.location.reload();
            } catch (error) {
                console.error('Failed to update application status', error);
                alert('Unable to update application status. Please try again.');
            }
        });
    });
}

function renderCompanyManagementRows(companies) {
    if (!companies.length) {
        return `
            <tr>
                <td class="px-4 py-6 text-center text-gray-500" colspan="6">
                    No active companies found.
                </td>
            </tr>
        `;
    }

    return companies
        .map((company) => {
            const activeJobs = Math.floor(Math.random() * 20) + 1; // Mock data for active jobs
            const isFeatured = company.featured || false;
            return `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="px-4 py-4 align-top">
                        <div class="flex items-center gap-3">
                            <img src="${company.logo}" alt="${company.name}" class="h-8 w-8 rounded-full object-cover" />
                            <div>
                                <p class="font-semibold text-gray-800">${company.name}</p>
                                <p class="text-sm text-gray-500">${company.website}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-4 align-top text-gray-700">${company.industry}</td>
                    <td class="px-4 py-4 align-top">
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded capitalize">
                            ${company.subscriptionPlan}
                        </span>
                    </td>
                    <td class="px-4 py-4 align-top text-gray-700 font-semibold">${activeJobs}</td>
                    <td class="px-4 py-4 align-top">
                        ${
                            isFeatured
                                ? '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full flex items-center gap-1 w-fit"><i class="fas fa-star"></i> Featured</span>'
                                : '<span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Not featured</span>'
                        }
                    </td>
                    <td class="px-4 py-4 align-top">
                        <button 
                            data-toggle-featured 
                            data-company-id="${company.id}" 
                            data-featured="${isFeatured}"
                            class="btn ${isFeatured ? 'btn-secondary' : 'btn-primary'} text-sm"
                        >
                            <i class="fas fa-star mr-1"></i>
                            ${isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                    </td>
                </tr>
            `;
        })
        .join('');
}

function bindFeatureToggleButtons() {
    const tableBody = document.getElementById('companyManagementTableBody');
    if (!tableBody) return;

    tableBody.querySelectorAll('button[data-toggle-featured]').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const companyId = event.currentTarget.dataset.companyId;
            const currentFeatured = event.currentTarget.dataset.featured === 'true';
            const newFeaturedStatus = !currentFeatured;

            try {
                // Update the company's featured status
                const company = await mockDataService.getCompanyById(companyId);
                if (company) {
                    company.featured = newFeaturedStatus;
                    
                    // Show success message
                    const action = newFeaturedStatus ? 'featured' : 'unfeatured';
                    alert(`Company ${action} successfully!`);
                    
                    // Refresh the table
                    const updatedCompanies = await mockDataService.getAllCompanies();
                    document.getElementById('companyManagementTableBody').innerHTML = renderCompanyManagementRows(updatedCompanies);
                    bindFeatureToggleButtons();
                }
            } catch (error) {
                console.error('Failed to update featured status', error);
                alert('Unable to update featured status. Please try again.');
            }
        });
    });
}
