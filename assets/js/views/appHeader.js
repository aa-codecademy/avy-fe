/**
 * Shared app navigation header (role-based) with mobile responsiveness and language selection
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

// Bind layout event listeners immediately
bindAppHeaderEvents();

export function renderAppHeader(user, currentPath = '') {
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
    const role = user?.role || 'student';

    // Unread counts split by type so each nav link shows the right number
    const unreadCount = (() => {
        try {
            const raw = localStorage.getItem('mockData');
            if (!raw) return 0;
            const data = JSON.parse(raw);
            return (data.notifications || []).filter(
                (n) => n.userId === user?.id && !n.read && n.type !== 'message_received'
            ).length;
        } catch {
            return 0;
        }
    })();

    const unreadMessages = (() => {
        try {
            const raw = localStorage.getItem('mockData');
            if (!raw) return 0;
            const data = JSON.parse(raw);
            return (data.notifications || []).filter(
                (n) => n.userId === user?.id && !n.read && n.type === 'message_received'
            ).length;
        } catch {
            return 0;
        }
    })();

    const logo = `
        <a href="/dashboard" data-link class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90">
            Avy
        </a>
    `;

    const logoutButton = `
        <button id="logoutBtn" type="button" class="hidden lg:inline-flex text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all" aria-label="Logout">
            <i class="fas fa-sign-out-alt"></i>
        </button>
    `;

    const mobileMenuLogoutButton = `
        <button type="button" data-app-mobile-logout class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700" aria-label="Logout">
            <i class="fas fa-sign-out-alt"></i>
            Logout
        </button>
    `;

    // Language Dropdown + User Avatar block (Cleaned up duplicate logout button)
    const userBlock = `
        <div class="flex items-center space-x-4">
            <div class="relative group">
                <button id="languageToggle" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 hover:border-purple-400 transition-all duration-200 group-hover:shadow-md">
                    <i class="fas fa-globe text-purple-600 text-sm"></i>
                    <span id="currentLang" class="text-sm font-semibold text-purple-700 min-w-[2rem]">EN</span>
                    <i class="fas fa-chevron-down text-purple-600 text-xs transition-transform duration-200 group-hover:rotate-180"></i>
                </button>
                <div id="languageMenu" class="hidden absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-2xl border border-purple-200 z-50 overflow-hidden backdrop-blur-sm bg-opacity-95">
                    <div class="px-3 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                        <p class="text-xs font-semibold text-purple-700 uppercase tracking-wide">Select Language</p>
                    </div>
                    <button id="lang-en" class="w-full text-left px-4 py-3 hover:bg-purple-100 transition text-gray-700 font-medium flex items-center gap-2 group/lang border-b border-gray-100 last:border-0">
                        <span class="text-lg">🇺🇸</span>
                        <span>English</span>
                        <i class="fas fa-check text-purple-600 ml-auto text-sm hidden group/lang-hover:inline"></i>
                    </button>
                    <button id="lang-mk" class="w-full text-left px-4 py-3 hover:bg-purple-100 transition text-gray-700 font-medium flex items-center gap-2 group/lang border-b border-gray-100 last:border-0">
                        <span class="text-lg">🇲🇰</span>
                        <span>Македонски</span>
                        <i class="fas fa-check text-purple-600 ml-auto text-sm hidden group/lang-hover:inline"></i>
                    </button>
                    <button id="lang-sq" class="w-full text-left px-4 py-3 hover:bg-purple-100 transition text-gray-700 font-medium flex items-center gap-2 group/lang">
                        <span class="text-lg">🇦🇱</span>
                        <span>Shqip</span>
                        <i class="fas fa-check text-purple-600 ml-auto text-sm hidden group/lang-hover:inline"></i>
                    </button>
                </div>
            </div>
            <div class="w-px h-8 bg-gray-300"></div>
            <img src="${user.avatar || ''}" alt="${user.name || 'User'}" class="w-10 h-10 rounded-full border-2 border-purple-600 hover:border-purple-800 transition-colors shadow-sm" />
        </div>
    `;

    const renderNavItem = (item, mobile = false) => {
        const { href, icon, label, matchPrefixes, badgeCount = null, badgeId = null } = item;
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

        if (badgeId && !mobile) {
            const badgeClass =
                'absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none pointer-events-none';
            const badge =
                badgeCount > 0
                    ? `<span id="${badgeId}" class="${badgeClass}">${badgeCount > 99 ? '99+' : badgeCount}</span>`
                    : `<span id="${badgeId}" class="hidden"></span>`;

            return `<a href="${href}" data-link class="${cls}"><span class="relative inline-block mr-1"><i class="fas ${icon}"></i>${badge}</span>${label}</a>`;
        }

        return `<a href="${href}" data-link class="${cls}"><i class="fas ${icon} w-4 text-center"></i><span>${label}</span></a>`;
    };

    let navItems = [];

    if (role === 'admin') {
        navItems = [
            {
                href: '/dashboard',
                icon: 'fa-home',
                label: 'Dashboard',
                matchPrefixes: ['/dashboard'],
            },
            {
                href: '/admin/users',
                icon: 'fa-users-cog',
                label: 'Users',
                matchPrefixes: ['/admin/users'],
            },
            {
                href: '/admin/students',
                icon: 'fa-user-graduate',
                label: 'Students',
                matchPrefixes: ['/admin/students'],
            },
            {
                href: '/admin/settings',
                icon: 'fa-sliders-h',
                label: 'Settings',
                matchPrefixes: ['/admin/settings'],
            },
            {
                href: '/admin/jobs',
                icon: 'fa-briefcase',
                label: 'Jobs',
                matchPrefixes: ['/admin/jobs'],
            },
            {
                href: '/admin/companies',
                icon: 'fa-building',
                label: 'Companies',
                matchPrefixes: ['/admin/companies'],
            },
            {
                href: '/admin/analytics',
                icon: 'fa-chart-bar',
                label: 'Analytics',
                matchPrefixes: ['/admin/analytics'],
            },
            {
                href: '/admin/events',
                icon: 'fa-calendar-alt',
                label: 'Events',
                matchPrefixes: ['/admin/events'],
            },
            {
                href: '/admin/resources',
                icon: 'fa-newspaper',
                label: 'Resources',
                matchPrefixes: ['/admin/resources'],
            },
            {
                href: '/admin/notifications',
                icon: 'fa-bell',
                label: 'Alerts',
                matchPrefixes: ['/admin/notifications'],
                badgeCount: unreadCount,
                badgeId: 'headerNotifBadge',
            },
        ];
    } else if (role === 'employer') {
        navItems = [
            {
                href: '/dashboard',
                icon: 'fa-home',
                label: 'Dashboard',
                matchPrefixes: ['/dashboard'],
            },
            {
                href: '/employer/jobs',
                icon: 'fa-briefcase',
                label: 'My Jobs',
                matchPrefixes: ['/employer/jobs'],
            },
            {
                href: '/employer/post-job',
                icon: 'fa-plus-circle',
                label: 'Post Job',
                matchPrefixes: ['/employer/post-job'],
            },
            {
                href: '/employer/candidates',
                icon: 'fa-users',
                label: 'Candidates',
                matchPrefixes: ['/employer/candidates'],
            },
            {
                href: '/employer/messages',
                icon: 'fa-envelope',
                label: 'Messages',
                matchPrefixes: ['/employer/messages'],
                badgeCount: unreadMessages,
                badgeId: 'headerMessagesBadge',
            },
            {
                href: '/employer/notifications',
                icon: 'fa-bell',
                label: 'Notifications',
                matchPrefixes: ['/employer/notifications'],
                badgeCount: unreadCount,
                badgeId: 'headerNotifBadge',
            },
            {
                href: '/employer/company-profile',
                icon: 'fa-building',
                label: 'Company Profile',
                matchPrefixes: ['/employer/company-profile'],
            },
        ];
    } else {
        navItems = [
            {
                href: '/dashboard',
                icon: 'fa-home',
                label: 'Dashboard',
                matchPrefixes: ['/dashboard'],
            },
            { href: '/jobs', icon: 'fa-briefcase', label: 'Jobs', matchPrefixes: ['/jobs'] },
            {
                href: '/companies',
                icon: 'fa-building',
                label: 'Companies',
                matchPrefixes: ['/companies'],
            },
            {
                href: '/applications',
                icon: 'fa-clipboard-list',
                label: 'Applications',
                matchPrefixes: ['/applications'],
            },
            {
                href: '/events',
                icon: 'fa-calendar-alt',
                label: 'Events',
                matchPrefixes: ['/events'],
            },
            {
                href: '/messages',
                icon: 'fa-envelope',
                label: 'Messages',
                matchPrefixes: ['/messages'],
                badgeCount: unreadMessages,
                badgeId: 'headerMessagesBadge',
            },
            {
                href: '/notifications',
                icon: 'fa-bell',
                label: 'Notifications',
                matchPrefixes: ['/notifications'],
                badgeCount: unreadCount,
                badgeId: 'headerNotifBadge',
            },
            { href: '/profile', icon: 'fa-user', label: 'Profile', matchPrefixes: ['/profile'] },
        ];
    }

    const desktopLinks = navItems.map((item) => renderNavItem(item)).join('');
    const mobileLinks = navItems.map((item) => renderNavItem(item, true)).join('');

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

                    <div class="flex items-center gap-4">
                        <div class="hidden lg:block">
                            ${userBlock}
                        </div>

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
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-center lg:hidden">
                         ${userBlock.replace('absolute right-0', 'absolute left-1/2 -translate-x-1/2')}
                    </div>
                    <div class="mt-4">
                        ${mobileMenuLogoutButton}
                    </div>
                </div>
            </div>
        </nav>
    `;
}

/**
 * Initialize language selector in header
 */
export function initializeLanguageSelector() {
    const toggle = document.getElementById('languageToggle');
    const menu = document.getElementById('languageMenu');
    const langBtns = {
        en: document.getElementById('lang-en'),
        mk: document.getElementById('lang-mk'),
        sq: document.getElementById('lang-sq'),
    };

    if (!toggle || !menu) return;

    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const langMap = { en: 'EN', mk: 'МК', sq: 'SQ' };
    document.getElementById('currentLang').textContent = langMap[currentLang];
    updateActiveLanguage(currentLang, langBtns);

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menu.classList.toggle('hidden');

        if (!isHidden) {
            menu.style.animation = 'slideDown 0.2s ease-out';
            toggle.parentElement.classList.add('hover');
        } else {
            toggle.parentElement.classList.remove('hover');
        }
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
            toggle.parentElement.classList.remove('hover');
        }
    });

    Object.entries(langBtns).forEach(([lang, btn]) => {
        if (btn) {
            btn.addEventListener('click', () => {
                localStorage.setItem('preferredLanguage', lang);
                document.getElementById('currentLang').textContent = langMap[lang];
                updateActiveLanguage(lang, langBtns);
                menu.classList.add('hidden');
                toggle.parentElement.classList.remove('hover');

                toggle.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    toggle.style.transform = 'scale(1)';
                }, 100);
            });
        }
    });
}

/**
 * Update active language button styling
 */
function updateActiveLanguage(activeLang, langBtns) {
    Object.entries(langBtns).forEach(([lang, btn]) => {
        if (btn) {
            if (lang === activeLang) {
                btn.style.backgroundColor = '#f3e8ff';
                btn.style.borderLeftWidth = '4px';
                btn.style.borderLeftColor = '#9333ea';
                btn.style.borderLeftStyle = 'solid';
                btn.style.paddingLeft = '12px';
                btn.style.fontWeight = '600';
            } else {
                btn.style.backgroundColor = 'transparent';
                btn.style.borderLeft = 'none';
                btn.style.paddingLeft = '16px';
                btn.style.fontWeight = 'normal';
            }
        }
    });
}

/**
 * Refresh the header notification badge count dynamically
 * @param {string} userId
 */
export function refreshHeaderBadge(userId) {
    try {
        const raw = localStorage.getItem('mockData');
        const data = raw ? JSON.parse(raw) : { notifications: [] };
        const count = (data.notifications || []).filter(
            (n) => n.userId === userId && !n.read && n.type !== 'message_received'
        ).length;
        const el = document.getElementById('headerNotifBadge');
        if (!el) return;
        const badgeClass =
            'absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none pointer-events-none';
        if (count > 0) {
            el.textContent = count > 99 ? '99+' : count;
            el.className = badgeClass;
        } else {
            el.textContent = '';
            el.className = 'hidden';
        }
    } catch {
        /* ignore */
    }
}

/**
 * Refresh the messages badge count dynamically
 * @param {string} userId
 */
export function refreshMessagesHeaderBadge(userId) {
    try {
        const raw = localStorage.getItem('mockData');
        const data = raw ? JSON.parse(raw) : { notifications: [] };
        const count = (data.notifications || []).filter(
            (n) => n.userId === userId && !n.read && n.type === 'message_received'
        ).length;
        const el = document.getElementById('headerMessagesBadge');
        if (!el) return;
        const badgeClass =
            'absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none pointer-events-none';
        if (count > 0) {
            el.textContent = count > 99 ? '99+' : count;
            el.className = badgeClass;
        } else {
            el.textContent = '';
            el.className = 'hidden';
        }
    } catch {
        /* ignore */
    }
}
