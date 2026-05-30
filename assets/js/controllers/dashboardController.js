/**
 * Dashboard Controller
 * Role-specific dashboards for Student, Alumni, Employer, and Admin
 */
import authService from '../services/authService.js';
import languageService from '../services/languageService.js';
import mockDataService from '../services/mockDataService.js';
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
            renderEmployerDashboard(app, user, path);
            break;
        case 'admin':
            renderAdminDashboard(app, user, path);
            break;
        default:
            await renderStudentDashboard(app, user, path);
    }
}

async function renderStudentDashboard(app, user, path) {
    const t = (key) => languageService.translate(key);
    const moduleName = user.role === 'alumni' ? 'Bloom (Alumni)' : 'Bloom (Student)';
    const companies = await mockDataService.getAllCompanies();
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
                        ${user.name}! 👋
                    </h1>
                    <p class="text-gray-600">${moduleName} - ${t('dashboard.overview')}</p>
                </div>

                <div class="card mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-search text-purple-600 mr-2"></i>
                        ${t('jobs.search')}
                    </h2>
                    <p class="text-gray-600 text-sm mb-4">${t('dashboard.overview')}</p>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <input type="text" id="dashJobSearch" class="form-input flex-1" placeholder="${t('jobs.search')}" />
                        <button type="button" id="dashJobSearchBtn" class="btn btn-primary whitespace-nowrap">
                            <i class="fas fa-search mr-2"></i> ${t('jobs.search')}
                        </button>
                    </div>
                </div>

                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-clock text-indigo-600 mr-2"></i>
                        ${t('dashboard.recentActivities')}
                    </h2>
                    <div class="space-y-3">
                        ${renderLatestListingRows(latestJobs, companyMap)}
                    </div>
                    <a href="/jobs" data-link class="text-indigo-600 hover:text-indigo-800 font-semibold mt-4 inline-block">
                        ${t('nav.jobs')} <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>

                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('dashboard.profileViews')}</p>
                                <p class="text-3xl font-bold text-purple-600">142</p>
                            </div>
                            <i class="fas fa-eye text-4xl text-purple-200"></i>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('applications.title')}</p>
                                <p class="text-3xl font-bold text-indigo-600">8</p>
                            </div>
                            <i class="fas fa-file-alt text-4xl text-indigo-200"></i>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('events.title')}</p>
                                <p class="text-3xl font-bold text-green-600">3</p>
                            </div>
                            <i class="fas fa-calendar-check text-4xl text-green-200"></i>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('profile.title')}</p>
                                <p class="text-3xl font-bold text-yellow-600">85%</p>
                            </div>
                            <i class="fas fa-star text-4xl text-yellow-200"></i>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8">
                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-clipboard-list text-purple-600 mr-2"></i>
                            ${t('dashboard.recentApplications')}
                        </h2>
                        <div class="space-y-4">
                            ${renderMockApplications(t)}
                        </div>
                        <a href="/applications" data-link class="text-purple-600 hover:text-purple-800 font-semibold mt-4 inline-block">
                            ${t('dashboard.viewAll')} ${t('applications.title')} <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>

                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-briefcase text-indigo-600 mr-2"></i>
                            ${t('jobs.title')}
                        </h2>
                        <div class="space-y-4">
                            ${renderMockJobs()}
                        </div>
                        <a href="/jobs" data-link class="text-indigo-600 hover:text-indigo-800 font-semibold mt-4 inline-block">
                            ${t('dashboard.browseAllJobs')} <i class="fas fa-arrow-right ml-1"></i>
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
    const t = (key) => languageService.translate(key);
    if (jobs.length === 0) {
        return `<p class="text-gray-500">${t('dashboard.noActiveListings')}</p>`;
    }
    const now = Date.now();
    return jobs
        .map((job) => {
            const company = companyMap[job.companyId] || {};
            const isNew = now - new Date(job.createdAt) < 3 * 24 * 60 * 60 * 1000;
            return `
            <div class="card hover:shadow-lg transition cursor-pointer py-4" role="link" tabindex="0" data-job-id="${job.id}">
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

function renderEmployerDashboard(app, user, path) {
    const t = (key) => languageService.translate(key);
    app.innerHTML = `
        ${renderAppHeader(user, path)}

        <div class="container mx-auto px-4 py-8">
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-4xl font-bold text-gray-800 mb-2">
                        ${t('messages.welcome')}, ${user.name}! 🏢
                    </h1>
                    <p class="text-gray-600">Evergreen - ${t('nav.companyProfile')}</p>
                </div>

                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('nav.postJob')}</p>
                                <p class="text-3xl font-bold text-purple-600">12</p>
                            </div>
                            <i class="fas fa-briefcase text-4xl text-purple-200"></i>
                        </div>
                    </div>

                    <a href="/employer/jobs" data-link class="card hover:shadow-lg transition cursor-pointer block no-underline text-inherit">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('applications.title')}</p>
                                <p class="text-3xl font-bold text-indigo-600">47</p>
                            </div>
                            <i class="fas fa-file-alt text-4xl text-indigo-200"></i>
                        </div>
                    </a>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('events.title')}</p>
                                <p class="text-3xl font-bold text-green-600">8</p>
                            </div>
                            <i class="fas fa-calendar-check text-4xl text-green-200"></i>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('status.hired')}</p>
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
                            ${t('nav.myJobs')}
                        </h2>
                        <div class="space-y-4">
                            ${renderMockEmployerJobs()}
                        </div>
                        <a href="/employer/post-job" data-link class="btn btn-primary mt-4 inline-flex items-center">
                            <i class="fas fa-plus mr-2"></i>
                            ${t('nav.postJob')}
                        </a>
                    </div>

                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-users text-indigo-600 mr-2"></i>
                            ${t('nav.candidates')}
                        </h2>
                        <div class="space-y-4">
                            ${renderMockCandidates()}
                        </div>
                        <a href="/employer/candidates" data-link class="text-indigo-600 hover:text-indigo-800 font-semibold mt-4 inline-block">
                            ${t('dashboard.viewAll')} ${t('nav.candidates')} <i class="fas fa-arrow-right ml-1"></i>
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

function renderAdminDashboard(app, user, path) {
    const t = (key) => languageService.translate(key);
    app.innerHTML = `
        ${renderAppHeader(user, path)}

        <div class="container mx-auto px-4 py-8">
            <div class="fade-in">
                <div class="mb-8">
                    <h1 class="text-4xl font-bold text-gray-800 mb-2">
                        ${t('nav.analytics')} ⚠️
                    </h1>
                    <p class="text-gray-600">Meridian - ${t('dashboard.overview')}</p>
                </div>

                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('nav.users')}</p>
                                <p class="text-3xl font-bold text-purple-600">487</p>
                            </div>
                            <i class="fas fa-users text-4xl text-purple-200"></i>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('nav.companies')}</p>
                                <p class="text-3xl font-bold text-indigo-600">92</p>
                            </div>
                            <i class="fas fa-building text-4xl text-indigo-200"></i>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('nav.postJob')}</p>
                                <p class="text-3xl font-bold text-green-600">234</p>
                            </div>
                            <i class="fas fa-briefcase text-4xl text-green-200"></i>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">${t('applications.title')}</p>
                                <p class="text-3xl font-bold text-yellow-600">1,247</p>
                            </div>
                            <i class="fas fa-file-alt text-4xl text-yellow-200"></i>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-8 mb-8">
                    <a href="/admin/users" data-link class="card text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-user-cog text-5xl text-purple-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">${t('nav.users')}</h3>
                        <p class="text-gray-600 mt-2">${t('nav.companies')}</p>
                    </a>

                    <a href="/admin/companies" data-link class="card text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-building text-5xl text-indigo-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">${t('nav.companies')}</h3>
                        <p class="text-gray-600 mt-2">Oversee company profiles</p>
                    </a>

                    <a href="/admin/analytics" data-link class="card text-center hover:shadow-xl block no-underline text-inherit">
                        <i class="fas fa-chart-line text-5xl text-green-600 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800">${t('nav.analytics')}</h3>
                        <p class="text-gray-600 mt-2">View system analytics</p>
                    </a>
                </div>

                <div class="card">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-history text-purple-600 mr-2"></i>
                        ${t('dashboard.recentActivities')}
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

function renderMockApplications(t) {
    const applications = [
        {
            company: 'TechCorp',
            position: 'Frontend Developer',
            status: t('applications.underReview'),
            statusColor: 'yellow',
        },
        {
            company: 'InnoSoft',
            position: 'Full Stack Developer',
            status: t('applications.interview'),
            statusColor: 'green',
        },
        {
            company: 'DataWorks',
            position: 'Junior Developer',
            status: t('applications.pending'),
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
