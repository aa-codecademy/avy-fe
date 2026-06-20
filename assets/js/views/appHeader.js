/**
 * Shared app navigation header (role-based) with clickable logo → /dashboard
 * @param {object} user - Current user from authService
 * @param {string} [currentPath=''] - window.location.pathname for active link styling
 */
const MOBILE_NAV_BREAKPOINT = 1024;
let appHeaderEventsBound = false;

function closeAppHeaderMenus(exceptHeader = null) {
    document.querySelectorAll('[data-app-header]').forEach((header) => {
        if (exceptHeader && header === exceptHeader) {
            return;
        }

        const menu = header.querySelector('[data-app-mobile-menu]');
        const toggle = header.querySelector('[data-app-menu-toggle]');
        const openIcon = header.querySelector('[data-menu-open-icon]');
        const closeIcon = header.querySelector('[data-menu-close-icon]');

        if (menu) {
            menu.classList.add('hidden');
        }

        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }

        if (openIcon && closeIcon) {
            openIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });
}

function toggleAppHeaderMenu(toggleButton) {
    const header = toggleButton.closest('[data-app-header]');
    const menu = header?.querySelector('[data-app-mobile-menu]');
    const openIcon = header?.querySelector('[data-menu-open-icon]');
    const closeIcon = header?.querySelector('[data-menu-close-icon]');

    if (!header || !menu) {
        return;
    }

    const isOpening = menu.classList.contains('hidden');

    closeAppHeaderMenus(header);
    menu.classList.toggle('hidden', !isOpening);
    toggleButton.setAttribute('aria-expanded', String(isOpening));

    if (openIcon && closeIcon) {
        openIcon.classList.toggle('hidden', isOpening);
        closeIcon.classList.toggle('hidden', !isOpening);
    }
}

function bindAppHeaderEvents() {
    if (appHeaderEventsBound || typeof document === 'undefined') {
        return;
    }

    appHeaderEventsBound = true;

    document.addEventListener('click', (event) => {
        const toggleButton = event.target.closest('[data-app-menu-toggle]');
        if (toggleButton) {
            event.preventDefault();
            toggleAppHeaderMenu(toggleButton);
            return;
        }

        const mobileLogoutButton = event.target.closest('[data-app-mobile-logout]');
        if (mobileLogoutButton) {
            event.preventDefault();
            window.authService?.logout();
            return;
        }

        if (event.target.closest('[data-app-mobile-menu] [data-link]')) {
            closeAppHeaderMenus();
            return;
        }

        if (!event.target.closest('[data-app-header]')) {
            closeAppHeaderMenus();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAppHeaderMenus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= MOBILE_NAV_BREAKPOINT) {
            closeAppHeaderMenus();
        }
    });
}

bindAppHeaderEvents();

export function renderAppHeader(user, currentPath = '') {
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
    const role = user?.role || 'student';

    const logo = `
        <a href="/dashboard" data-link class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90">
            Avy
        </a>
    `;

    const logoutButton = `
        <button id="logoutBtn" type="button" class="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700" aria-label="Logout">
            <i class="fas fa-sign-out-alt"></i>
            <span class="hidden sm:inline">Logout</span>
        </button>
    `;

    const mobileMenuLogoutButton = `
        <button type="button" data-app-mobile-logout class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700" aria-label="Logout">
            <i class="fas fa-sign-out-alt"></i>
            Logout
        </button>
    `;

    const L = (href, icon, label, matchPrefixes, mobile = false) => {
        const active = matchPrefixes.some(
            (p) => path === p || (p !== '/' && path.startsWith(p + '/'))
        );

        const cls = mobile
            ? active
                ? 'flex items-center gap-3 rounded-xl bg-purple-50 px-3 py-3 text-base font-semibold text-purple-700'
                : 'flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-100 hover:text-purple-700'
            : active
              ? 'inline-flex items-center gap-2 text-base font-semibold text-purple-700'
              : 'inline-flex items-center gap-2 text-base font-medium text-gray-600 transition hover:text-purple-600';

        return `<a href="${href}" data-link class="${cls}"><i class="fas ${icon} w-4 text-center"></i><span>${label}</span></a>`;
    };

    let navItems = [];

    if (role === 'admin') {
        navItems = [
            ['/dashboard', 'fa-home', 'Dashboard', ['/dashboard']],
            ['/admin/users', 'fa-users-cog', 'Users', ['/admin/users']],
            ['/admin/students', 'fa-user-graduate', 'Students', ['/admin/students']],
            ['/admin/settings', 'fa-sliders-h', 'Settings', ['/admin/settings']],
            ['/admin/jobs', 'fa-briefcase', 'Jobs', ['/admin/jobs']],
            ['/admin/companies', 'fa-building', 'Companies', ['/admin/companies']],
            ['/admin/analytics', 'fa-chart-bar', 'Analytics', ['/admin/analytics']],
            ['/admin/events', 'fa-calendar', 'Events', ['/admin/events']],
            ['/admin/resources', 'fa-newspaper', 'Resources', ['/admin/resources']],
            ['/admin/notifications', 'fa-bell', 'Alerts', ['/admin/notifications']],
        ];
    } else if (role === 'employer') {
        navItems = [
            ['/dashboard', 'fa-home', 'Dashboard', ['/dashboard']],
            ['/employer/jobs', 'fa-briefcase', 'My Jobs', ['/employer/jobs']],
            ['/employer/post-job', 'fa-plus-circle', 'Post Job', ['/employer/post-job']],
            ['/employer/candidates', 'fa-users', 'Candidates', ['/employer/candidates']],
            ['/employer/messages', 'fa-envelope', 'Messages', ['/employer/messages']],
            ['/employer/notifications', 'fa-bell', 'Notifications', ['/employer/notifications']],
            [
                '/employer/company-profile',
                'fa-building',
                'Company Profile',
                ['/employer/company-profile'],
            ],
        ];
    } else {
        navItems = [
            ['/dashboard', 'fa-home', 'Dashboard', ['/dashboard']],
            ['/jobs', 'fa-briefcase', 'Jobs', ['/jobs']],
            ['/companies', 'fa-building', 'Companies', ['/companies']],
            ['/applications', 'fa-clipboard-list', 'Applications', ['/applications']],
            ['/events', 'fa-calendar-alt', 'Events', ['/events']],
            ['/messages', 'fa-envelope', 'Messages', ['/messages']],
            ['/notifications', 'fa-bell', 'Notifications', ['/notifications']],
            ['/profile', 'fa-user', 'Profile', ['/profile']],
        ];
    }

    const desktopLinks = navItems.map((item) => L(...item)).join('');
    const mobileLinks = navItems.map((item) => L(...item, true)).join('');

    return `
        <nav class="border-b border-gray-100 bg-white shadow-md" data-app-header>
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex min-w-0 items-center space-x-2">
                        ${logo}
                        <span class="text-sm text-gray-500 hidden sm:inline">by Avenga Academy</span>
                    </div>

                    <div class="hidden flex-1 items-center justify-end gap-6 lg:flex">
                        <div class="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
                            ${desktopLinks}
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        ${logoutButton}
                        <button type="button" data-app-menu-toggle aria-expanded="false" aria-controls="app-mobile-menu" class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 lg:hidden">
                            <i class="fas fa-bars" data-menu-open-icon></i>
                            <i class="fas fa-times hidden" data-menu-close-icon></i>
                        </button>
                    </div>
                </div>

                <div id="app-mobile-menu" data-app-mobile-menu class="mt-4 hidden border-t border-gray-100 pt-4 lg:hidden">
                    <div class="flex flex-col gap-2">
                        ${mobileLinks}
                    </div>
                    <div class="mt-4">
                        ${mobileMenuLogoutButton}
                    </div>
                </div>
            </div>
        </nav>
    `;
}
