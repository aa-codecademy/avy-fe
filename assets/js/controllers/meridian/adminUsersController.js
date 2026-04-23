/**
 * Admin Users Controller
 * Employer directory and platform user management for administrators
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminUsersController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const [allUsers, companies, analytics] = await Promise.all([
        mockDataService.getAllUsers(),
        mockDataService.getAllCompanies(),
        mockDataService.getAnalytics(),
    ]);

    const employers = allUsers.filter((u) => u.role === 'employer');
    const companyMap = Object.fromEntries(companies.map((company) => [company.id, company]));
    const employerCompanies = companies.filter((company) =>
        employers.some((user) => user.companyId === company.id)
    );
    const industries = [
        ...new Set(employerCompanies.map((company) => company.industry).filter(Boolean)),
    ].sort();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-building text-purple-600 mr-3"></i>
                            Employer Directory
                        </h1>
                        <p class="text-gray-600">Search, review, and manage registered employer accounts.</p>
                    </div>

                    <div class="card mb-6">
                        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 class="text-xl font-bold text-gray-800">Filter employers</h2>
                                <p class="text-sm text-gray-500">Search by employer name, email, company, industry, or location.</p>
                            </div>
                            <div class="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-end">
                                <div>
                                    <label for="employerSearch" class="form-label">Search</label>
                                    <input id="employerSearch" type="text" class="form-input w-full" placeholder="Search employers, company, email..." />
                                </div>
                                <div>
                                    <label for="companyFilter" class="form-label">Company</label>
                                    <select id="companyFilter" class="form-input w-full">
                                        <option value="">All companies</option>
                                        ${employerCompanies.map((company) => `<option value="${company.id}">${company.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label for="industryFilter" class="form-label">Industry</label>
                                    <select id="industryFilter" class="form-input w-full">
                                        <option value="">All industries</option>
                                        ${industries.map((industry) => `<option value="${industry}">${industry}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button id="resetFilters" class="btn btn-secondary w-full">Reset filters</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">
                                    <span id="employerCount">${employers.length}</span> Employers
                                </h3>
                                <span class="text-sm text-gray-500">Total registered companies: ${analytics.totalCompanies}</span>
                            </div>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-100 border-b-2 border-gray-300">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Representative</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Company</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Industry</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Email</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Subscription</th>
                                    </tr>
                                </thead>
                                <tbody id="employerTableBody">
                                    ${renderEmployersTable(employers, companyMap)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupEmployerFilters(employers, companyMap);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function renderEmployersTable(employers, companyMap) {
    if (!employers.length) {
        return `
            <tr>
                <td class="px-4 py-6 text-center text-gray-500" colspan="5">
                    No employer accounts found.
                </td>
            </tr>
        `;
    }

    return employers
        .map((user) => {
            const company = companyMap[user.companyId] || {};
            return `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                <td class="px-4 py-4">
                    <div class="flex items-center">
                        <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full mr-3 border-2 border-gray-200" />
                        <div>
                            <p class="font-semibold text-gray-800">${user.name}</p>
                            <p class="text-sm text-gray-500">${user.currentPosition || 'Employer representative'}</p>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 text-gray-700">${company.name || 'N/A'}</td>
                <td class="px-4 py-4 text-gray-700">${company.industry || 'N/A'}</td>
                <td class="px-4 py-4 text-gray-700">${user.email}</td>
                <td class="px-4 py-4 text-gray-700 capitalize">${company.subscriptionPlan || 'basic'}</td>
            </tr>
        `;
        })
        .join('');
}

function setupEmployerFilters(employers, companyMap) {
    const searchInput = document.getElementById('employerSearch');
    const companyFilter = document.getElementById('companyFilter');
    const industryFilter = document.getElementById('industryFilter');
    const resetButton = document.getElementById('resetFilters');
    const tableBody = document.getElementById('employerTableBody');
    const employerCount = document.getElementById('employerCount');

    const applyFilters = () => {
        const search = searchInput.value.trim().toLowerCase();
        const companyId = companyFilter.value;
        const industry = industryFilter.value;

        const filtered = employers.filter((user) => {
            const company = companyMap[user.companyId] || {};
            const searchTarget =
                `${user.name} ${user.email} ${company.name || ''} ${company.industry || ''} ${company.locations?.join(' ') || ''}`.toLowerCase();
            const matchesSearch = !search || searchTarget.includes(search);
            const matchesCompany = !companyId || user.companyId === companyId;
            const matchesIndustry = !industry || company.industry === industry;
            return matchesSearch && matchesCompany && matchesIndustry;
        });

        tableBody.innerHTML = renderEmployersTable(filtered, companyMap);
        employerCount.textContent = filtered.length;
    };

    searchInput.addEventListener('input', applyFilters);
    companyFilter.addEventListener('change', applyFilters);
    industryFilter.addEventListener('change', applyFilters);

    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        searchInput.value = '';
        companyFilter.value = '';
        industryFilter.value = '';
        applyFilters();
    });
}
