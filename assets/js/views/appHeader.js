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
            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full border-2 border-purple-600 hover:border-purple-800 transition-colors shadow-sm" />
            <button id="logoutBtn" type="button" class="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all" aria-label="Logout">
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
 * Initialize language selector in header
 */
export function initializeLanguageSelector() {
    const toggle = document.getElementById('languageToggle');
    const menu = document.getElementById('languageMenu');
    const langBtns = {
        en: document.getElementById('lang-en'),
        mk: document.getElementById('lang-mk'),
        sq: document.getElementById('lang-sq')
    };

    if (!toggle || !menu) return;

    // Set current language display and active state
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const langMap = { en: 'EN', mk: 'МК', sq: 'SQ' };
    document.getElementById('currentLang').textContent = langMap[currentLang];
    updateActiveLanguage(currentLang, langBtns);

    // Toggle menu on button click
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menu.classList.toggle('hidden');
        
        // Add smooth transition animation
        if (!isHidden) {
            menu.style.animation = 'slideDown 0.2s ease-out';
            toggle.parentElement.classList.add('hover');
        } else {
            toggle.parentElement.classList.remove('hover');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
            toggle.parentElement.classList.remove('hover');
        }
    });

    // Language button clicks with improved styling
    Object.entries(langBtns).forEach(([lang, btn]) => {
        if (btn) {
            btn.addEventListener('click', () => {
                localStorage.setItem('preferredLanguage', lang);
                document.getElementById('currentLang').textContent = langMap[lang];
                updateActiveLanguage(lang, langBtns);
                menu.classList.add('hidden');
                toggle.parentElement.classList.remove('hover');
                
                // Add a subtle animation to button
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
