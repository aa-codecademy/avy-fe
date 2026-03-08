/**
 * Job Board Controller
 * Displays job listings with filters and search
 */
import authService from '../services/authService.js';
import mockDataService from '../services/mockDataService.js';

export default async function jobBoardController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user) {
        window.router.navigate('/login');
        return;
    }
    
    // Load initial data
    const [jobs, companies] = await Promise.all([
        mockDataService.getAllJobs({ status: 'active' }),
        mockDataService.getAllCompanies()
    ]);
    
    // Create company lookup map
    const companyMap = {};
    companies.forEach(c => companyMap[c.id] = c);
    
    app.innerHTML = `
        ${renderHeader(user)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <!-- Page Header -->
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-briefcase text-purple-600 mr-3"></i>
                            Job Board
                        </h1>
                        <p class="text-gray-600">Find your perfect opportunity</p>
                    </div>
                    
                    <div class="grid lg:grid-cols-4 gap-6">
                        <!-- Filters Sidebar -->
                        <div class="lg:col-span-1">
                            <div class="card sticky top-4">
                                <h2 class="text-xl font-bold text-gray-800 mb-4">
                                    <i class="fas fa-filter mr-2"></i>
                                    Filters
                                </h2>
                                
                                <!-- Search -->
                                <div class="mb-4">
                                    <label class="form-label">Search</label>
                                    <input 
                                        type="text" 
                                        id="searchInput" 
                                        class="form-input" 
                                        placeholder="Keywords..."
                                    />
                                </div>
                                
                                <!-- Employment Type -->
                                <div class="mb-4">
                                    <label class="form-label">Employment Type</label>
                                    <select id="employmentTypeFilter" class="form-input">
                                        <option value="">All</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                                
                                <!-- Work Mode -->
                                <div class="mb-4">
                                    <label class="form-label">Work Mode</label>
                                    <select id="workModeFilter" class="form-input">
                                        <option value="">All</option>
                                        <option value="onsite">On-site</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                
                                <!-- Experience Level -->
                                <div class="mb-4">
                                    <label class="form-label">Experience Level</label>
                                    <select id="experienceLevelFilter" class="form-input">
                                        <option value="">All</option>
                                        <option value="intern">Intern</option>
                                        <option value="junior">Junior</option>
                                        <option value="mid">Mid</option>
                                        <option value="senior">Senior</option>
                                    </select>
                                </div>
                                
                                <!-- Company -->
                                <div class="mb-4">
                                    <label class="form-label">Company</label>
                                    <select id="companyFilter" class="form-input">
                                        <option value="">All Companies</option>
                                        ${companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <button id="applyFiltersBtn" class="btn btn-primary w-full">
                                    Apply Filters
                                </button>
                                
                                <button id="clearFiltersBtn" class="btn btn-secondary w-full mt-2">
                                    Clear All
                                </button>
                            </div>
                        </div>
                        
                        <!-- Job Listings -->
                        <div class="lg:col-span-3">
                            <!-- Results Header -->
                            <div class="flex justify-between items-center mb-4">
                                <p class="text-gray-600">
                                    <span id="jobCount">${jobs.length}</span> jobs found
                                </p>
                                <select id="sortBy" class="form-input w-auto">
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="mostApplicants">Most Applicants</option>
                                    <option value="salary">Highest Salary</option>
                                </select>
                            </div>
                            
                            <!-- Job Grid -->
                            <div id="jobGrid" class="space-y-4">
                                ${renderJobGrid(jobs, companyMap)}
                            </div>
                            
                            <!-- Empty State -->
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
    
    // Add event listeners
    setupEventListeners(jobs, companyMap);
    
    // Logout handler
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
                        <a href="/jobs" data-link class="text-purple-600 font-semibold">
                            <i class="fas fa-briefcase mr-1"></i> Jobs
                        </a>
                        <a href="/companies" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-building mr-1"></i> Companies
                        </a>
                        <a href="/profile" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-user mr-1"></i> Profile
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

function renderJobGrid(jobs, companyMap) {
    if (jobs.length === 0) {
        return '';
    }
    
    return jobs.map(job => {
        const company = companyMap[job.companyId] || {};
        const isNew = (new Date() - new Date(job.createdAt)) < (3 * 24 * 60 * 60 * 1000);
        const daysUntilDeadline = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (24 * 60 * 60 * 1000));
        
        return `
            <div class="card hover:shadow-xl transition cursor-pointer" onclick="window.router.navigate('/jobs/${job.id}')">
                <div class="flex items-start gap-4">
                    <!-- Company Logo -->
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
    const employmentTypeFilter = document.getElementById('employmentTypeFilter');
    const workModeFilter = document.getElementById('workModeFilter');
    const experienceLevelFilter = document.getElementById('experienceLevelFilter');
    const companyFilter = document.getElementById('companyFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const sortBy = document.getElementById('sortBy');
    
    const applyFilters = async () => {
        const filters = {
            status: 'active',
            search: searchInput.value,
            employmentType: employmentTypeFilter.value,
            workMode: workModeFilter.value,
            experienceLevel: experienceLevelFilter.value,
            companyId: companyFilter.value
        };
        
        const filteredJobs = await mockDataService.getAllJobs(filters);
        
        // Apply sorting
        sortJobs(filteredJobs, sortBy.value);
        
        // Update grid
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
        employmentTypeFilter.value = '';
        workModeFilter.value = '';
        experienceLevelFilter.value = '';
        companyFilter.value = '';
        sortBy.value = 'newest';
        applyFilters();
    });
    
    sortBy.addEventListener('change', applyFilters);
    
    // Enter key on search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
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
