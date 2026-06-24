/**
 * Dashboard Controller
 * Role-specific dashboards for Student, Alumni, Employer, and Admin
 */
import authService from '../services/authService.js';
import mockDataService from '../services/mockDataService.js';
import eventService from '../services/adminContentService/eventService.js';
import { renderAppHeader } from '../views/appHeader.js';

export default async function dashboardController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    const path = window.location.pathname;

    switch (user.role) {
        case 'student':
        case 'alumni':
            await renderStudentDashboard(app, user, path);
            break;
        case 'employer':
            await renderEmployerDashboard(app, user, path);
            break;
        case 'admin':
            await renderAdminDashboard(app, user, path);
            break;
        default:
            await renderStudentDashboard(app, user, path);
    }
}

async function renderStudentDashboard(app, user, path) {
    const moduleName = user.role === 'alumni' ? 'Bloom (Alumni)' : 'Bloom (Student)';
    const companies = await mockDataService.getAllCompanies();
    const featuredCompanies = companies.filter((c) => c.featured && !c.suspended);
    const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]));
    let allJobs = await mockDataService.getAllJobs({ status: 'active' });
    const latestJobs = [...allJobs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    app.innerHTML = `
        ${renderAppHeader(user, path)}

        <div class="container mx-auto px-4 py-8">
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-4xl font-bold text-gray-800 mb-2">
                        Welcome back, ${user.name}! 👋
                    </h1>
                    <p class="text-gray-600">${moduleName} - Your Career Development Hub</p>
                </div>

                <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-search text-purple-600 mr-2"></i>
                        Find your next role
                    </h2>
                    <p class="text-gray-600 text-sm mb-4">Search jobs by title, company, location, or skills — same search as the job board.</p>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <input type="text" id="dashJobSearch" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] flex-1" placeholder="Keywords, job title, company, location..." />
                        <button type="button" id="dashJobSearchBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] whitespace-nowrap">
                            <i class="fas fa-search mr-2"></i> Search jobs
                        </button>
                    </div>
                </div>

                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-star text-yellow-500 mr-2"></i>
                        Featured Employers
                    </h2>
                    ${renderFeaturedCompanies(featuredCompanies)}
                </div>

                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-clock text-indigo-600 mr-2"></i>
                        Latest listings
                    </h2>
                    <div class="space-y-3">
                        ${renderLatestListingRows(latestJobs, companyMap)}
                    </div>
                    <a href="/jobs" data-link class="text-indigo-600 hover:text-indigo-800 font-semibold mt-4 inline-block">
                        View all jobs <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>

                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Profile Views</p>
                                <p class="text-3xl font-bold text-purple-600">142</p>
                            </div>
                            <i class="fas fa-eye text-4xl text-purple-200"></i>
                        </div>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Applications</p>
                                <p class="text-3xl font-bold text-indigo-600">8</p>
                            </div>
                            <i class="fas fa-file-alt text-4xl text-indigo-200"></i>
                        </div>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Interviews</p>
                                <p class="text-3xl font-bold text-green-600">3</p>
                            </div>
                            <i class="fas fa-calendar-check text-4xl text-green-200"></i>
                        </div>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Profile Score</p>
                                <p class="text-3xl font-bold text-yellow-600">85%</p>
                            </div>
                            <i class="fas fa-star text-4xl text-yellow-200"></i>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8">
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-clipboard-list text-purple-600 mr-2"></i>
                            Recent Applications
                        </h2>
                        <div class="space-y-4">
                            ${renderMockApplications()}
                        </div>
                        <a href="/applications" data-link class="text-purple-600 hover:text-purple-800 font-semibold mt-4 inline-block">
                            View All Applications <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-briefcase text-indigo-600 mr-2"></i>
                            Recommended Jobs
                        </h2>
                        <div class="space-y-4">
                            ${renderMockJobs()}
                        </div>
                        <a href="/jobs" data-link class="text-indigo-600 hover:text-indigo-800 font-semibold mt-4 inline-block">
                            Browse All Jobs <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        authService.logout();
    });

    document.getElementById('dashJobSearchBtn').addEventListener('click', () => {
        const q = document.getElementById('dashJobSearch').value.trim();
        if (q) {
            sessionStorage.setItem('avy_job_search', q);
        } else {
            sessionStorage.removeItem('avy_job_search');
        }
        window.router.navigate('/jobs');
    });

    bindLatestJobClicks();
}

function renderLatestListingRows(jobs, companyMap) {
    if (jobs.length === 0) {
        return '<p class="text-gray-500">No active listings yet.</p>';
    }
    const now = Date.now();
    return jobs
        .map((job) => {
            const company = companyMap[job.companyId] || {};
            const isNew = now - new Date(job.createdAt) < 3 * 24 * 60 * 60 * 1000;
            return `
            <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-lg transition cursor-pointer py-4" role="link" tabindex="0" data-job-id="${job.id}">
                <div class="flex justify-between items-start gap-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">
                            ${job.title}
                            ${isNew ? '<span class="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">NEW</span>' : ''}
                        </h3>
                        <p class="text-gray-600">${company.name || 'Company'} · ${job.location} · ${job.employmentType}</p>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </div>
            </div>
        `;
        })
        .join('');
}

function bindLatestJobClicks() {
    document.querySelectorAll('[data-job-id]').forEach((el) => {
        const id = el.getAttribute('data-job-id');
        el.addEventListener('click', () => window.router.navigate(`/jobs/${id}`));
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.router.navigate(`/jobs/${id}`);
        });
    });
}

function renderFeaturedCompanies(companies) {
    if (!companies || companies.length === 0) {
        return '<p class="text-gray-500">No featured employers at this time. Check back soon!</p>';
    }

    const companiesGrid = companies
        .map(
            (company) => `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-xl transition cursor-pointer bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
            <div class="flex flex-col h-full">
                <div class="flex items-center justify-between mb-3">
                    <img src="${company.logo}" alt="${company.name}" class="h-12 w-12 rounded-full object-cover" />
                    <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <i class="fas fa-star"></i> Featured
                    </span>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-1">${company.name}</h3>
                <p class="text-sm text-purple-600 font-semibold mb-2">${company.industry}</p>
                <p class="text-sm text-gray-600 mb-4 flex-grow">${company.description}</p>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <i class="fas fa-map-marker-alt text-purple-600"></i>
                    <span>${company.locations.join(', ') || 'Various'}</span>
                </div>
            </div>
        </div>
    `
        )
        .join('');

    return `
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            ${companiesGrid}
        </div>
        <a href="/companies" data-link class="text-purple-600 hover:text-purple-800 font-semibold inline-block">
            Browse all employers <i class="fas fa-arrow-right ml-1"></i>
        </a>
    `;
}

function renderEmployerDashboard(app, user, path) {
    app.innerHTML = `
        ${renderAppHeader(user, path)}

        <div class="container mx-auto px-4 py-8">
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-4xl font-bold text-gray-800 mb-2">
                        Welcome, ${user.name}! 🏢
                    </h1>
                    <p class="text-gray-600">Evergreen - Company Management Hub</p>
                </div>

                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Active Jobs</p>
                                <p class="text-3xl font-bold text-purple-600">12</p>
                            </div>
                            <i class="fas fa-briefcase text-4xl text-purple-200"></i>
                        </div>
                    </div>

                    <a href="/employer/jobs" data-link class="card hover:shadow-lg transition cursor-pointer block no-underline text-inherit">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Applications</p>
                                <p class="text-3xl font-bold text-indigo-600">47</p>
                            </div>
                            <i class="fas fa-file-alt text-4xl text-indigo-200"></i>
                        </div>
                    </a>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Interviews</p>
                                <p class="text-3xl font-bold text-green-600">8</p>
                            </div>
                            <i class="fas fa-calendar-check text-4xl text-green-200"></i>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Hired</p>
                                <p class="text-3xl font-bold text-yellow-600">5</p>
                            </div>
                            <i class="fas fa-user-check text-4xl text-yellow-200"></i>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8">
                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-clipboard-list text-purple-600  mr-2"></i>
                            Your Job Postings
                        </h2>
                        <div class="space-y-4">
                            ${renderMockEmployerJobs()}
                        </div>
                        <a href="/employer/post-job" data-link class="btn btn-primary mt-4 inline-flex items-center">
                            <i class="fas fa-plus mr-2"></i>
                            Post New Job
                        </a>
                    </div>

                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-users text-indigo-600 mr-2"></i>
                            Recent Candidates
                        </h2>
                        <div class="space-y-4">
                            ${renderMockCandidates()}
                        </div>
                        <a href="/employer/candidates" data-link class="text-indigo-600 hover:text-indigo-800 font-semibold mt-4 inline-block">
                            View All Candidates <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        authService.logout();
    });
}

async function renderAdminDashboard(app, user, path) {
    const pendingActions = await mockDataService.getPendingActions();
    const alerts = await mockDataService.getAlerts();
    const analytics = await mockDataService.getAnalytics();
    const events = await eventService.getEvents();

    const totalStudents = analytics.totalStudents || 245;
    const activeJobs = analytics.activeJobs || 156;
    const pendingApprovalsCount = pendingActions.filter((a) => a.priority === 'high').length;
    const eventsThisMonth = events.length || 2;

    app.innerHTML = `
        ${renderAppHeader(user, path)}

        <div class="container mx-auto px-4 py-8">
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-4xl font-bold text-gray-800 mb-2">
                        Admin Dashboard ⚙️
                    </h1>
                    <p class="text-gray-600">System management and analytics</p>
                </div>

                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Total Students</p>
                                <p class="text-3xl font-bold text-purple-600">${totalStudents}</p>
                            </div>
                            <i class="fas fa-graduation-cap text-4xl text-purple-200"></i>
                        </div>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Active Job Listings</p>
                                <p class="text-3xl font-bold text-indigo-600">${activeJobs}</p>
                            </div>
                            <i class="fas fa-briefcase text-4xl text-indigo-200"></i>
                        </div>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Pending Approvals</p>
                                <p class="text-3xl font-bold text-red-600">${pendingApprovalsCount}</p>
                            </div>
                            <i class="fas fa-hourglass-half text-4xl text-red-200"></i>
                        </div>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Events This Month</p>
                                <p class="text-3xl font-bold text-green-600">${eventsThisMonth}</p>
                            </div>
                            <i class="fas fa-calendar text-4xl text-green-200"></i>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <a href="/admin/students" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl hover:scale-105 transition block no-underline text-inherit cursor-pointer">
                        <i class="fas fa-user-plus text-4xl text-blue-600 mb-3"></i>
                        <h3 class="font-bold text-gray-800">Add Student</h3>
                        <p class="text-gray-600 text-sm mt-1">Register new student</p>
                    </a>

                    <a href="/admin/jobs" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl hover:scale-105 transition block no-underline text-inherit cursor-pointer">
                        <i class="fas fa-plus-circle text-4xl text-indigo-600 mb-3"></i>
                        <h3 class="font-bold text-gray-800">Add Job</h3>
                        <p class="text-gray-600 text-sm mt-1">Post new job listing</p>
                    </a>

                    <a href="/admin/events" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl hover:scale-105 transition block no-underline text-inherit cursor-pointer">
                        <i class="fas fa-calendar-plus text-4xl text-red-600 mb-3"></i>
                        <h3 class="font-bold text-gray-800">Create Event</h3>
                        <p class="text-gray-600 text-sm mt-1">Schedule new event</p>
                    </a>

                    <a href="/admin/resources" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl hover:scale-105 transition block no-underline text-inherit cursor-pointer">
                        <i class="fas fa-file-import text-4xl text-blue-600 mb-3"></i>
                        <h3 class="font-bold text-gray-800">Add Resource</h3>
                        <p class="text-gray-600 text-sm mt-1">Create learning material</p>
                    </a>
                </div>

                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-tasks text-red-600 mr-2"></i>
                            Pending Actions
                        </h2>
                        <div class="space-y-2">
                            ${renderPendingActionsQueue(pendingActions)}
                        </div>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-bell text-orange-600 mr-2"></i>
                            Alerts & Notices
                        </h2>
                        <div class="space-y-2">
                            ${renderAlertsSection(alerts)}
                        </div>
                    </div>
                </div>


                <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
                    <a href="/admin/users" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-user-cog text-5xl text-purple-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">Manage Users</h3>
                        <p class="text-gray-600 mt-2">View and manage user accounts</p>
                    </a>

                    <a href="/admin/settings" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-sliders-h text-5xl text-red-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">Settings & Permissions</h3>
                        <p class="text-gray-600 mt-2">Configure roles, templates, privacy, and exports</p>
                    </a>

                    <a href="/admin/companies" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-building text-5xl text-indigo-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">Manage Companies</h3>
                        <p class="text-gray-600 mt-2">Oversee company profiles</p>
                    </a>

                    <a href="/admin/analytics" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-chart-line text-5xl text-green-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">Analytics</h3>
                        <p class="text-gray-600 mt-2">View system analytics</p>
                    </a>

                    <a href="/admin/events" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-calendar text-5xl text-red-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">Events</h3>
                        <p class="text-gray-600 mt-2">Manage system events</p>
                    </a>

                    <a href="/admin/resources" data-link class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-newspaper text-5xl text-blue-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">Resources</h3>
                        <p class="text-gray-600 mt-2">Manage platform resources</p>
                    </a>
                </div>

                <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-history text-purple-600 mr-2"></i>
                        Recent Activity
                    </h2>
                    <div class="space-y-3">
                        ${renderMockActivity()}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        authService.logout();
    });
}

function renderMockApplications() {
    const applications = [
        {
            company: 'TechCorp',
            position: 'Frontend Developer',
            status: 'Under Review',
            statusColor: 'yellow',
        },
        {
            company: 'InnoSoft',
            position: 'Full Stack Developer',
            status: 'Interview',
            statusColor: 'green',
        },
        {
            company: 'DataWorks',
            position: 'Junior Developer',
            status: 'Pending',
            statusColor: 'gray',
        },
    ];

    return applications
        .map(
            (app) => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
                <p class="font-semibold text-gray-800">${app.position}</p>
                <p class="text-sm text-gray-600">${app.company}</p>
            </div>
            <span class="px-3 py-1 bg-${app.statusColor}-100 text-${app.statusColor}-800 text-xs font-semibold rounded-full">
                ${app.status}
            </span>
        </div>
    `
        )
        .join('');
}

function renderMockJobs() {
    const jobs = [
        { company: 'CloudTech', position: 'Backend Developer', type: 'Full-time' },
        { company: 'StartupX', position: 'DevOps Engineer', type: 'Contract' },
        { company: 'MegaCorp', position: 'Software Engineer', type: 'Full-time' },
    ];

    return jobs
        .map(
            (job) => `
        <div class="p-3 bg-gray-50 rounded hover:bg-gray-100 transition cursor-pointer">
            <p class="font-semibold text-gray-800">${job.position}</p>
            <p class="text-sm text-gray-600">${job.company} • ${job.type}</p>
        </div>
    `
        )
        .join('');
}

function renderMockEmployerJobs() {
    const jobs = [
        { position: 'Senior Developer', applications: 12, status: 'Active' },
        { position: 'Product Manager', applications: 8, status: 'Active' },
        { position: 'UX Designer', applications: 15, status: 'Active' },
    ];

    return jobs
        .map(
            (job) => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
                <p class="font-semibold text-gray-800">${job.position}</p>
                <p class="text-sm text-gray-600">${job.applications} applications</p>
            </div>
            <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                ${job.status}
            </span>
        </div>
    `
        )
        .join('');
}

function renderMockCandidates() {
    const candidates = [
        { name: 'Jane Smith', position: 'Frontend Developer', match: '95%' },
        { name: 'John Doe', position: 'Backend Developer', match: '88%' },
        { name: 'Alice Johnson', position: 'Full Stack Developer', match: '92%' },
    ];

    return candidates
        .map(
            (candidate) => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition cursor-pointer">
            <div>
                <p class="font-semibold text-gray-800">${candidate.name}</p>
                <p class="text-sm text-gray-600">${candidate.position}</p>
            </div>
            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                ${candidate.match} Match
            </span>
        </div>
    `
        )
        .join('');
}

function renderMockActivity() {
    const activities = [
        { type: 'user', text: 'New user registered: john.doe@example.com', time: '5 min ago' },
        { type: 'job', text: 'New job posted: Senior Developer at TechCorp', time: '15 min ago' },
        { type: 'application', text: '3 new applications received', time: '1 hour ago' },
        { type: 'company', text: 'Company profile updated: InnoSoft', time: '2 hours ago' },
    ];

    return activities
        .map(
            (activity) => `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded">
            <i class="fas fa-circle text-xs text-purple-600 mt-1"></i>
            <div class="flex-1">
                <p class="text-gray-800">${activity.text}</p>
                <p class="text-xs text-gray-500">${activity.time}</p>
            </div>
        </div>
    `
        )
        .join('');
}

function renderPendingActionsQueue(actions) {
    if (actions.length === 0) {
        return '<p class="text-gray-500 text-center py-4">No pending actions</p>';
    }

    return actions
        .map((action) => {
            const priorityColor =
                action.priority === 'high'
                    ? 'red'
                    : action.priority === 'medium'
                      ? 'yellow'
                      : 'gray';
            const timeAgo = formatTimeAgo(action.createdAt);
            return `
        <div class="p-3 bg-gray-50 rounded hover:bg-gray-100 transition border-l-4 border-${priorityColor}-500">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <i class="fas ${action.icon} text-${priorityColor}-600"></i>
                        <p class="font-semibold text-gray-800 text-sm">${action.description}</p>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">${timeAgo}</p>
                </div>
                <span class="px-2 py-1 bg-${priorityColor}-100 text-${priorityColor}-800 text-xs font-semibold rounded whitespace-nowrap">
                    ${action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                </span>
            </div>
        </div>
    `;
        })
        .join('');
}

function renderAlertsSection(alerts) {
    if (alerts.length === 0) {
        return '<p class="text-gray-500 text-center py-4">No system alerts</p>';
    }

    return alerts
        .map((alert) => {
            const severityClass =
                alert.severity === 'error'
                    ? 'red'
                    : alert.severity === 'warning'
                      ? 'yellow'
                      : 'green';
            const timeAgo = formatTimeAgo(alert.timestamp);
            return `
        <div class="p-3 bg-${severityClass}-50 rounded border-l-4 border-${severityClass}-500">
            <div class="flex items-start gap-3">
                <i class="fas ${alert.icon} text-${severityClass}-600 mt-1"></i>
                <div class="flex-1">
                    <p class="font-semibold text-gray-800 text-sm">${alert.title}</p>
                    <p class="text-xs text-gray-600 mt-1">${alert.message}</p>
                    <p class="text-xs text-gray-500 mt-1">${timeAgo}</p>
                </div>
            </div>
        </div>
    `;
        })
        .join('');
}

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diff = now - then;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}
