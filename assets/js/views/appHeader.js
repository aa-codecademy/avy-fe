/**
 * Shared app navigation header (role-based) with clickable logo → /dashboard
 * @param {object} user - Current user from authService
 * @param {string} [currentPath=''] - window.location.pathname for active link styling
 */
export function renderAppHeader(user, currentPath = '') {
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
    const role = user?.role || 'student';

    // Unread counts split by type so each nav link shows the right number
    const unreadCount = (() => {
        try {
            const raw = localStorage.getItem('mockData');
            if (!raw) return 0;
            const data = JSON.parse(raw);
            return (data.notifications || []).filter(n => n.userId === user?.id && !n.read && n.type !== 'message_received').length;
        } catch { return 0; }
    })();

    const unreadMessages = (() => {
        try {
            const raw = localStorage.getItem('mockData');
            if (!raw) return 0;
            const data = JSON.parse(raw);
            return (data.notifications || []).filter(n => n.userId === user?.id && !n.read && n.type === 'message_received').length;
        } catch { return 0; }
    })();

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

    // Notification link with optional red badge — pass a custom count to override the default
    const LN = (href, icon, label, matchPrefixes, count = unreadCount) => {
        const active = matchPrefixes.some(
            (p) => path === p || (p !== '/' && path.startsWith(p + '/'))
        );
        const cls = active
            ? 'text-purple-600 font-semibold'
            : 'text-gray-600 hover:text-purple-600 transition';
        const badgeClass = 'absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none pointer-events-none';
        const badgeId = href.includes('message') ? 'headerMessagesBadge' : 'headerNotifBadge';
        const badge = count > 0
            ? `<span id="${badgeId}" class="${badgeClass}">${count > 99 ? '99+' : count}</span>`
            : `<span id="${badgeId}" class="hidden"></span>`;
        return `<a href="${href}" data-link class="${cls}"><span class="relative inline-block mr-1"><i class="fas ${icon}"></i>${badge}</span>${label}</a>`;
    };

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
            ${L('/admin/jobs', 'fa-briefcase', 'Jobs', ['/admin/jobs'])}
            ${L('/admin/companies', 'fa-building', 'Companies', ['/admin/companies'])}
            ${L('/admin/events', 'fa-calendar-alt', 'Events', ['/admin/events'])}
            ${L('/admin/analytics', 'fa-chart-bar', 'Analytics', ['/admin/analytics'])}
            ${LN('/admin/notifications', 'fa-bell', 'Alerts', ['/admin/notifications'])}
        `;
    } else if (role === 'employer') {
        links = `
            ${L('/dashboard', 'fa-home', 'Dashboard', ['/dashboard'])}
            ${L('/employer/jobs', 'fa-briefcase', 'My Jobs', ['/employer/jobs'])}
            ${L('/employer/post-job', 'fa-plus-circle', 'Post Job', ['/employer/post-job'])}
            ${L('/employer/candidates', 'fa-users', 'Candidates', ['/employer/candidates'])}
            ${LN('/employer/messages', 'fa-envelope', 'Messages', ['/employer/messages'], unreadMessages)}
            ${LN('/employer/notifications', 'fa-bell', 'Notifications', ['/employer/notifications'])}
            ${L('/employer/company-profile', 'fa-building', 'Company Profile', ['/employer/company-profile'])}
        `;
    } else {
        links = `
            ${L('/dashboard', 'fa-home', 'Dashboard', ['/dashboard'])}
            ${L('/jobs', 'fa-briefcase', 'Jobs', ['/jobs'])}
            ${L('/companies', 'fa-building', 'Companies', ['/companies'])}
            ${L('/applications', 'fa-clipboard-list', 'Applications', ['/applications'])}
            ${L('/events', 'fa-calendar-alt', 'Events', ['/events'])}
            ${LN('/messages', 'fa-envelope', 'Messages', ['/messages'], unreadMessages)}
            ${LN('/notifications', 'fa-bell', 'Notifications', ['/notifications'])}
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

/**
 * Refresh the header notification badge count without re-rendering the whole header.
 * Call this after mark-as-read operations on pages that don't do a full re-render.
 * @param {string} userId
 */
export function refreshHeaderBadge(userId) {
    try {
        const raw = localStorage.getItem('mockData');
        const data = raw ? JSON.parse(raw) : { notifications: [] };
        const count = (data.notifications || []).filter((n) => n.userId === userId && !n.read && n.type !== 'message_received').length;
        const el = document.getElementById('headerNotifBadge');
        if (!el) return;
        const badgeClass = 'absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none pointer-events-none';
        if (count > 0) {
            el.textContent = count > 99 ? '99+' : count;
            el.className = badgeClass;
        } else {
            el.textContent = '';
            el.className = 'hidden';
        }
    } catch { /* ignore */ }
}

/**
 * Refresh the messages badge count in the header nav.
 * @param {string} userId
 */
export function refreshMessagesHeaderBadge(userId) {
    try {
        const raw = localStorage.getItem('mockData');
        const data = raw ? JSON.parse(raw) : { notifications: [] };
        const count = (data.notifications || []).filter((n) => n.userId === userId && !n.read && n.type === 'message_received').length;
        const el = document.getElementById('headerMessagesBadge');
        if (!el) return;
        const badgeClass = 'absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none pointer-events-none';
        if (count > 0) {
            el.textContent = count > 99 ? '99+' : count;
            el.className = badgeClass;
        } else {
            el.textContent = '';
            el.className = 'hidden';
        }
    } catch { /* ignore */ }
}
