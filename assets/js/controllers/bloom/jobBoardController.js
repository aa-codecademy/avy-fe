/**
 * Job Board Controller
 * Displays job listings with filters and search
 */
import authService from '../../services/authService.js';
import languageService from '../../services/languageService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function jobBoardController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    const t = (key) => languageService.translate(key);

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    const [jobs, companies] = await Promise.all([
        mockDataService.getAllJobs({ status: 'active' }),
        mockDataService.getAllCompanies(),
    ]);

    const companyMap = {};
    companies.forEach((c) => (companyMap[c.id] = c));

    const industries = [...new Set(companies.map((c) => c.industry).filter(Boolean))].sort();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}

        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">

                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-briefcase text-purple-600 mr-3"></i>
                            ${t('jobs.title')}
                        </h1>

                        <p class="text-gray-600">
                            ${t('jobs.search')}
                        </p>
                    </div>

                    <div class="grid lg:grid-cols-4 gap-6">

                        <!-- FILTERS -->
                        <div class="lg:col-span-1">
                            <div class="card sticky top-4">

                                <h2 class="text-xl font-bold text-gray-800 mb-4">
                                    <i class="fas fa-filter mr-2"></i>
                                    ${t('jobs.filter')}
                                </h2>

                                <div class="mb-4">
                                    <label class="form-label">${t('jobs.search')}</label>

                                    <input
                                        type="text"
                                        id="searchInput"
                                        class="form-input"
                                        placeholder="${t('jobs.search')}"
                                    />
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">${t('companies.industry')}</label>

                                    <select id="industryFilter" class="form-input">
                                        <option value="">${t('jobs.filter')}</option>

                                        ${industries
                                            .map(
                                                (ind) => `
                                            <option value="${ind}">
                                                ${ind}
                                            </option>
                                        `
                                            )
                                            .join('')}
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">${t('forms.skills')}</label>

                                    <input
                                        type="text"
                                        id="skillsFilter"
                                        class="form-input"
                                        placeholder="${t('forms.example')}"
                                    />

                                    <p class="text-xs text-gray-500 mt-1">
                                        ${t('forms.commaSeparated')}
                                    </p>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">${t('jobs.employmentType')}</label>

                                    <select id="employmentTypeFilter" class="form-input">
                                        <option value="">${t('jobs.all')}</option>
                                        <option value="full-time">${t('jobs.fullTime')}</option>
                                        <option value="part-time">${t('jobs.partTime')}</option>
                                        <option value="freelance">${t('jobs.freelance')}</option>
                                        <option value="contract">${t('applications.contract')}</option>
                                        <option value="internship">${t('applications.internship')}</option>
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">${t('jobs.workMode')}</label>

                                    <select id="workModeFilter" class="form-input">
                                        <option value="">${t('jobs.all')}</option>
                                        <option value="onsite">${t('jobs.onSite')}</option>
                                        <option value="remote">${t('jobs.remote')}</option>
                                        <option value="hybrid">${t('jobs.hybrid')}</option>
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">${t('jobs.experienceLevel')}</label>

                                    <select id="experienceLevelFilter" class="form-input">
                                        <option value="">${t('jobs.all')}</option>
                                        <option value="intern">${t('jobs.intern')}</option>
                                        <option value="junior">${t('jobs.junior')}</option>
                                        <option value="mid">${t('jobs.mid')}</option>
                                        <option value="senior">${t('jobs.senior')}</option>
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label">${t('applications.company')}</label>

                                    <select id="companyFilter" class="form-input">
                                        <option value="">${t('jobs.allCompanies')}</option>

                                        ${companies
                                            .map(
                                                (c) => `
                                            <option value="${c.id}">
                                                ${c.name}
                                            </option>
                                        `
                                            )
                                            .join('')}
                                    </select>
                                </div>

                                <button
                                    id="applyFiltersBtn"
                                    class="btn btn-primary w-full"
                                >
                                    ${t('applications.applyFilters')}
                                </button>

                                <button
                                    id="clearFiltersBtn"
                                    class="btn btn-secondary w-full mt-2"
                                >
                                    ${t('applications.clearAll')}
                                </button>

                            </div>
                        </div>

                        <!-- JOB LIST -->
                        <div class="lg:col-span-3">

                            <div class="flex justify-between items-center mb-4">
                                <p class="text-gray-600">
                                    <span id="jobCount">${jobs.length}</span> ${t('applications.jobsFound')}
                                </p>

                                <select id="sortBy" class="form-input w-auto">
                                    <option value="newest">${t('applications.newestFirst')}</option>
                                    <option value="oldest">${t('applications.oldestFirst')}</option>
                                    <option value="mostApplicants">${t('applications.mostApplicants')}</option>
                                    <option value="salary">${t('applications.highestSalary')}</option>
                                </select>
                            </div>

                            <div id="jobGrid" class="space-y-4">
                                ${renderJobGrid(jobs, companyMap, t)}
                            </div>

                            <div
                                id="emptyState"
                                class="hidden text-center py-20"
                            >
                                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>

                                <h3 class="text-2xl font-bold text-gray-600 mb-2">
                                    ${t('applications.noJobsFound')}
                                </h3>

                                <p class="text-gray-500">
                                    ${t('applications.tryAdjusting')}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupEventListeners(jobs, companyMap);

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

function renderJobGrid(jobs, companyMap, t) {
    if (jobs.length === 0) {
        return '';
    }

    return jobs
        .map((job) => {
            const company = companyMap[job.companyId] || {};

            const isNew = new Date() - new Date(job.createdAt) < 3 * 24 * 60 * 60 * 1000;

            const daysUntilDeadline = Math.ceil(
                (new Date(job.applicationDeadline) - new Date()) / (24 * 60 * 60 * 1000)
            );

            return `
            <div
                class="card hover:shadow-xl transition cursor-pointer job-card"
                data-job-id="${job.id}"
            >

                <div class="flex items-start gap-4">

                    <img
                        src="${company.logo}"
                        alt="${company.name}"
                        class="w-16 h-16 rounded-lg"
                    />

                    <div class="flex-1">

                        <div class="flex justify-between items-start mb-2">

                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-1">
                                    ${job.title}

                                    ${
                                        isNew
                                            ? `
                                        <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                            NEW
                                        </span>
                                    `
                                            : ''
                                    }

                                    ${
                                        job.isPriority
                                            ? `
                                        <span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                            ⭐ FEATURED
                                        </span>
                                    `
                                            : ''
                                    }
                                </h3>

                                <p class="text-gray-600">
                                    ${company.name}
                                </p>
                            </div>

                            <div class="text-right">
                                <p class="text-sm text-gray-500">
                                    ${daysUntilDeadline} ${t('applications.daysLeft')}
                                </p>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 mb-3">

                            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                <i class="fas fa-briefcase mr-1"></i>
                                ${job.employmentType}
                            </span>

                            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                ${job.location}
                            </span>

                            <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                <i class="fas fa-laptop-house mr-1"></i>
                                ${job.workMode}
                            </span>

                            <span class="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                                <i class="fas fa-chart-line mr-1"></i>
                                ${job.experienceLevel}
                            </span>
                        </div>

                        <div class="flex flex-wrap gap-2 mb-3">

                            ${job.requiredSkills
                                .slice(0, 5)
                                .map(
                                    (skill) => `
                                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    ${skill}
                                </span>
                            `
                                )
                                .join('')}

                            ${
                                job.requiredSkills.length > 5
                                    ? `
                                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    +${job.requiredSkills.length - 5} ${t('applications.moreSkills')}
                                </span>
                            `
                                    : ''
                            }
                        </div>

                        <div class="flex justify-between items-center">

                            <div class="text-sm text-gray-600">
                                ${
                                    job.salaryRange.min && job.salaryRange.max
                                        ? `
                                    <i class="fas fa-money-bill-wave mr-1"></i>
                                    ${job.salaryRange.min}
                                    -
                                    ${job.salaryRange.max}
                                    ${job.salaryRange.currency}
                                `
                                        : `
                                    <i class="fas fa-money-bill-wave mr-1"></i>
                                    ${t('applications.negotiable')}
                                `
                                }
                            </div>

                            <div class="flex items-center gap-3">

                                <div class="text-sm text-gray-500">
                                    <i class="fas fa-eye mr-1"></i>
                                    ${job.views} ${t('applications.views')}

                                    <i class="fas fa-users ml-3 mr-1"></i>
                                    ${job.applications} ${t('applications.applicants')}
                                </div>

                                <button
                                    class="btn btn-primary easy-apply-btn"
                                    data-job-id="${job.id}"
                                >
                                    <i class="fas fa-paper-plane mr-1"></i>
                                    ${t('applications.easyApply')}
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `;
        })
        .join('');
}

function setupEventListeners(allJobs, companyMap) {
    const searchInput = document.getElementById('searchInput');
    const industryFilter = document.getElementById('industryFilter');
    const skillsFilter = document.getElementById('skillsFilter');
    const employmentTypeFilter = document.getElementById('employmentTypeFilter');
    const workModeFilter = document.getElementById('workModeFilter');
    const experienceLevelFilter = document.getElementById('experienceLevelFilter');
    const companyFilter = document.getElementById('companyFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const sortBy = document.getElementById('sortBy');

    const pendingSearch = sessionStorage.getItem('avy_job_search');

    if (pendingSearch) {
        searchInput.value = pendingSearch;
        sessionStorage.removeItem('avy_job_search');
    }

    const setupJobCardNavigation = () => {
        const jobCards = document.querySelectorAll('.job-card');

        jobCards.forEach((card) => {
            card.addEventListener('click', () => {
                const jobId = card.dataset.jobId;

                window.router.navigate(`/jobs/${jobId}`);
            });
        });
    };

    const setupEasyApplyButtons = () => {
        const easyApplyButtons = document.querySelectorAll('.easy-apply-btn');

        easyApplyButtons.forEach((button) => {
            button.addEventListener('click', async (e) => {
                e.stopPropagation();

                const jobId = button.dataset.jobId;

                try {
                    const user = authService.getCurrentUser();

                    if (!user?.cvUrl) {
                        alert('Please upload your CV before using Easy Apply.');

                        window.router.navigate('/profile');

                        return;
                    }

                    // Prevent duplicate applications
                    const existingApplications = await mockDataService.getApplicationsByUser(
                        user.id
                    );

                    const alreadyApplied = existingApplications.some((app) => app.jobId === jobId);

                    if (alreadyApplied) {
                        alert('You already applied for this job.');

                        return;
                    }

                    // Create application
                    await mockDataService.createApplication({
                        jobId,
                        applicantId: user.id,
                        cvUrl: user.cvUrl,
                        appliedAt: new Date().toISOString(),
                        status: 'submitted',
                    });

                    // Update button UI
                    button.disabled = true;

                    button.innerHTML = `
                        <i class="fas fa-check mr-1"></i>
                        Applied
                    `;

                    button.classList.remove('btn-primary');

                    button.classList.add('btn-secondary');

                    alert('Application submitted successfully!');
                } catch (error) {
                    console.error('Easy Apply failed:', error);

                    alert('Failed to apply. Please try again.');
                }
            });
        });
    };

    const applyFilters = async () => {
        const skillsRaw = skillsFilter.value.trim();

        const skillsList = skillsRaw
            ? skillsRaw
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
            : [];

        const filters = {
            status: 'active',
            search: searchInput.value,
            industry: industryFilter.value,
            skills: skillsList.length ? skillsList : undefined,
            employmentType: employmentTypeFilter.value,
            workMode: workModeFilter.value,
            experienceLevel: experienceLevelFilter.value,
            companyId: companyFilter.value,
        };

        const filteredJobs = await mockDataService.getAllJobs(filters);

        sortJobs(filteredJobs, sortBy.value);

        const jobGrid = document.getElementById('jobGrid');

        const emptyState = document.getElementById('emptyState');

        const jobCount = document.getElementById('jobCount');

        if (filteredJobs.length === 0) {
            jobGrid.innerHTML = '';

            emptyState.classList.remove('hidden');
        } else {
            jobGrid.innerHTML = renderJobGrid(filteredJobs, companyMap);

            emptyState.classList.add('hidden');

            setupJobCardNavigation();

            setupEasyApplyButtons();
        }

        jobCount.textContent = filteredJobs.length;
    };

    applyFiltersBtn.addEventListener('click', applyFilters);

    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        industryFilter.value = '';
        skillsFilter.value = '';
        employmentTypeFilter.value = '';
        workModeFilter.value = '';
        experienceLevelFilter.value = '';
        companyFilter.value = '';
        sortBy.value = 'newest';

        applyFilters();
    });

    sortBy.addEventListener('change', applyFilters);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });

    // Initial setup
    setupJobCardNavigation();

    setupEasyApplyButtons();

    if (pendingSearch) {
        applyFilters();
    }
}

function sortJobs(jobs, sortBy) {
    switch (sortBy) {
        case 'newest':
            jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            break;

        case 'oldest':
            jobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            break;

        case 'mostApplicants':
            jobs.sort((a, b) => b.applications - a.applications);

            break;

        case 'salary':
            jobs.sort((a, b) => (b.salaryRange?.max || 0) - (a.salaryRange?.max || 0));

            break;
    }
}
