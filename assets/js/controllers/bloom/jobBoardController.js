/**
 * Job Board Controller
 * Displays job listings with filters and search
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function jobBoardController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user) {
        window.router.navigate('/login');
        return;
    }
    
    const [jobs, companies] = await Promise.all([
        mockDataService.getAllJobs({ status: 'active' }),
        mockDataService.getAllCompanies()
    ]);
    
    const companyMap = {};
    companies.forEach(c => companyMap[c.id] = c);
    const industries = [...new Set(companies.map((c) => c.industry).filter(Boolean))].sort();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-briefcase text-purple-600 mr-3"></i>
                            Job Board
                        </h1>
                        <p class="text-gray-600">Find your perfect opportunity</p>
                    </div>
                    
                    <div class="grid lg:grid-cols-4 gap-6">
                        <div class="lg:col-span-1">
                            <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] sticky top-4">
                                <h2 class="text-xl font-bold text-gray-800 mb-4">
                                    <i class="fas fa-filter mr-2"></i>
                                    Filters
                                </h2>
                                
                                <div class="mb-4">
                                    <label class="mb-2 block font-medium text-slate-700">Search</label>
                                    <input 
                                        type="text" 
                                        id="searchInput" 
                                        class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" 
                                        placeholder="Title, company, location, skills..."
                                    />
                                </div>

                                <div class="mb-4">
                                    <label class="mb-2 block font-medium text-slate-700">Industry</label>
                                    <select id="industryFilter" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                        <option value="">All industries</option>
                                        ${industries.map((ind) => `<option value="${ind}">${ind}</option>`).join('')}
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <label class="mb-2 block font-medium text-slate-700">Skills</label>
                                    <input type="text" id="skillsFilter" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" placeholder="e.g. React, SQL" />
                                    <p class="text-xs text-gray-500 mt-1">Comma-separated</p>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="mb-2 block font-medium text-slate-700">Employment Type</label>
                                    <select id="employmentTypeFilter" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                        <option value="">All</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="freelance">Freelance</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="mb-2 block font-medium text-slate-700">Work Mode</label>
                                    <select id="workModeFilter" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                        <option value="">All</option>
                                        <option value="onsite">On-site</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="mb-2 block font-medium text-slate-700">Experience Level</label>
                                    <select id="experienceLevelFilter" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                        <option value="">All</option>
                                        <option value="intern">Intern</option>
                                        <option value="junior">Junior</option>
                                        <option value="mid">Mid</option>
                                        <option value="senior">Senior</option>
                                    </select>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="mb-2 block font-medium text-slate-700">Company</label>
                                    <select id="companyFilter" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                        <option value="">All Companies</option>
                                        ${companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <button id="applyFiltersBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] w-full">
                                    Apply Filters
                                </button>
                                
                                <button id="clearFiltersBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white w-full mt-2">
                                    Clear All
                                </button>
                            </div>
                        </div>
                        
                        <div class="lg:col-span-3">
                            <div class="flex justify-between items-center mb-4">
                                <p class="text-gray-600">
                                    <span id="jobCount">${jobs.length}</span> jobs found
                                </p>
                                <select id="sortBy" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] w-auto">
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="mostApplicants">Most Applicants</option>
                                    <option value="salary">Highest Salary</option>
                                </select>
                            </div>
                            
                            <div id="jobGrid" class="space-y-4">
                                ${renderJobGrid(jobs, companyMap)}
                            </div>
                            
                            <div id="emptyState" class="hidden text-center py-20">
                                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                                <h3 class="text-2xl font-bold text-gray-600 mb-2">No jobs found</h3>
                                <p class="text-gray-500">Try adjusting your filters</p>
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

function renderJobGrid(jobs, companyMap) {
    if (jobs.length === 0) {
        return '';
    }
    
    return jobs.map(job => {
        const company = companyMap[job.companyId] || {};
        const isNew = (new Date() - new Date(job.createdAt)) < (3 * 24 * 60 * 60 * 1000);
        const daysUntilDeadline = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (24 * 60 * 60 * 1000));
        
        return `
            <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-xl transition cursor-pointer" onclick="window.router.navigate('/jobs/${job.id}')">
                <div class="flex items-start gap-4">
                    <img src="${company.logo}" alt="${company.name}" class="w-16 h-16 rounded-lg" />
                    
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-1">
                                    ${job.title}
                                    ${isNew ? '<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">NEW</span>' : ''}
                                    ${job.isPriority ? '<span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">⭐ FEATURED</span>' : ''}
                                </h3>
                                <p class="text-gray-600">${company.name}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-500">${daysUntilDeadline} days left</p>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                <i class="fas fa-briefcase mr-1"></i> ${job.employmentType}
                            </span>
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                <i class="fas fa-map-marker-alt mr-1"></i> ${job.location}
                            </span>
                            <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                <i class="fas fa-laptop-house mr-1"></i> ${job.workMode}
                            </span>
                            <span class="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                                <i class="fas fa-chart-line mr-1"></i> ${job.experienceLevel}
                            </span>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mb-3">
                            ${job.requiredSkills.slice(0, 5).map(skill => `
                                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">${skill}</span>
                            `).join('')}
                            ${job.requiredSkills.length > 5 ? `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">+${job.requiredSkills.length - 5} more</span>` : ''}
                        </div>
                        
                        <div class="flex justify-between items-center">
                            <div class="text-sm text-gray-600">
                                ${job.salaryRange.min && job.salaryRange.max ? `
                                    <i class="fas fa-money-bill-wave mr-1"></i>
                                    ${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency}
                                ` : '<i class="fas fa-money-bill-wave mr-1"></i> Negotiable'}
                            </div>
                            <div class="text-sm text-gray-500">
                                <i class="fas fa-eye mr-1"></i> ${job.views} views
                                <i class="fas fa-users ml-3 mr-1"></i> ${job.applications} applicants
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
            companyId: companyFilter.value
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

    if (pendingSearch) {
        applyFilters();
    }
}

function sortJobs(jobs, sortBy) {
    switch(sortBy) {
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
            jobs.sort((a, b) => b.salaryRange.max - a.salaryRange.max);
            break;
    }
}
