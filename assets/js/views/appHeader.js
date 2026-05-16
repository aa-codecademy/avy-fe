/**
 * Shared app navigation header (role-based) with clickable logo → /dashboard
 * @param {object} user - Current user from authService
 * @param {string} [currentPath=''] - window.location.pathname for active link styling
 */
export function renderAppHeader(user, currentPath = '') {
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
    const role = user?.role || 'student';

    const logo = `
        <a href="/dashboard" data-link class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90">
            Avy
        </a>
    `;

    const userBlock = `
        <div class="flex items-center space-x-3">
            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full border-2 border-purple-600" />
            <button id="logoutBtn" type="button" class="text-red-600 hover:text-red-800" aria-label="Logout">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    `;

    const L = (href, icon, label, matchPrefixes) => {
        const active = matchPrefixes.some(
            (p) => path === p || (p !== '/' && path.startsWith(p + '/'))
        );
        const cls = active
            ? 'text-purple-600 font-semibold'
            : 'text-gray-600 hover:text-purple-600 transition';
        return `<a href="${href}" data-link class="${cls}"><i class="fas ${icon} mr-1"></i> ${label}</a>`;
    };

    let links = '';

    if (role === 'admin') {
        links = `
            ${L('/dashboard', 'fa-home', 'Dashboard', ['/dashboard'])}
            ${L('/admin/users', 'fa-users-cog', 'Users', ['/admin/users'])}
            ${L('/admin/settings', 'fa-sliders-h', 'Settings', ['/admin/settings'])}
            ${L('/admin/jobs', 'fa-briefcase', 'Jobs', ['/admin/jobs'])}
            ${L('/admin/companies', 'fa-building', 'Companies', ['/admin/companies'])}
            ${L('/admin/events', 'fa-calendar-alt', 'Events', ['/admin/events'])}
            ${L('/admin/analytics', 'fa-chart-bar', 'Analytics', ['/admin/analytics'])}
            ${L('/admin/resources', 'fa-newspaper', 'Resources', ['/admin/resources'])}
            ${L('/admin/notifications', 'fa-bell', 'Alerts', ['/admin/notifications'])}
        `;
    } else if (role === 'employer') {
        links = `
            ${L('/dashboard', 'fa-home', 'Dashboard', ['/dashboard'])}
            ${L('/employer/jobs', 'fa-briefcase', 'My Jobs', ['/employer/jobs'])}
            ${L('/employer/post-job', 'fa-plus-circle', 'Post Job', ['/employer/post-job'])}
            ${L('/employer/candidates', 'fa-users', 'Candidates', ['/employer/candidates'])}
            ${L('/employer/messages', 'fa-envelope', 'Messages', ['/employer/messages'])}
            ${L('/employer/notifications', 'fa-bell', 'Notifications', ['/employer/notifications'])}
        `;
    } else {
        links = `
            ${L('/dashboard', 'fa-home', 'Dashboard', ['/dashboard'])}
            ${L('/jobs', 'fa-briefcase', 'Jobs', ['/jobs'])}
            ${L('/companies', 'fa-building', 'Companies', ['/companies'])}
            ${L('/applications', 'fa-clipboard-list', 'Applications', ['/applications'])}
            ${L('/events', 'fa-calendar-alt', 'Events', ['/events'])}
            ${L('/messages', 'fa-envelope', 'Messages', ['/messages'])}
            ${L('/notifications', 'fa-bell', 'Notifications', ['/notifications'])}
            ${L('/profile', 'fa-user', 'Profile', ['/profile'])}
        `;
    }

    return `
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        ${logo}
                        <span class="text-sm text-gray-500 hidden sm:inline">by Avenga Academy</span>
                    </div>
                    <div class="flex items-center flex-wrap gap-x-4 gap-y-2 justify-end">
                        ${links}
                        ${userBlock}
                    </div>
                </div>
            </div>
        </nav>
    `;
}
