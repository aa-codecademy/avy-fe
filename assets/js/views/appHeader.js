/**
 * Shared app navigation header (role-based) with clickable logo → /dashboard
 * Includes language selector with flag logos
 * @param {object} user - Current user from authService
 * @param {string} [currentPath=''] - window.location.pathname for active link styling
 */

import {
    renderLanguageSelector,
    attachLanguageSelectorEvents,
} from '../controllers/bloom/languageController.js';
import languageService from '../services/languageService.js';

export function renderAppHeader(user, currentPath = '') {
    const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
    const role = user?.role || 'student';
    const t = (key) => languageService.translate(key);

    const logo = `
        <a href="/dashboard" data-link class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90">
            ${t('common.avy')}
        </a>
    `;

    const languageSelector = renderLanguageSelector();

    const userBlock = `
        <div class="flex items-center space-x-3">
            ${languageSelector}
            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full border-2 border-purple-600" />
            <button id="logoutBtn" type="button" class="text-red-600 hover:text-red-800" aria-label="Logout" title="${t('buttons.logout')}">
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
            ${L('/dashboard', 'fa-home', t('nav.dashboard'), ['/dashboard'])}
            ${L('/admin/users', 'fa-users-cog', t('nav.users'), ['/admin/users'])}
            ${L('/admin/jobs', 'fa-briefcase', t('nav.jobs'), ['/admin/jobs'])}
            ${L('/admin/companies', 'fa-building', t('nav.companies'), ['/admin/companies'])}
            ${L('/admin/events', 'fa-calendar-alt', t('nav.events'), ['/admin/events'])}
            ${L('/admin/analytics', 'fa-chart-bar', t('nav.analytics'), ['/admin/analytics'])}
            ${L('/admin/notifications', 'fa-bell', t('nav.alerts'), ['/admin/notifications'])}
        `;
    } else if (role === 'employer') {
        links = `
            ${L('/dashboard', 'fa-home', t('nav.dashboard'), ['/dashboard'])}
            ${L('/employer/jobs', 'fa-briefcase', t('nav.myJobs'), ['/employer/jobs'])}
            ${L('/employer/post-job', 'fa-plus-circle', t('nav.postJob'), ['/employer/post-job'])}
            ${L('/employer/candidates', 'fa-users', t('nav.candidates'), ['/employer/candidates'])}
            ${L('/employer/messages', 'fa-envelope', t('messages.title'), ['/employer/messages'])}
            ${L('/employer/notifications', 'fa-bell', t('notifications.title'), ['/employer/notifications'])}
            ${L('/employer/company-profile', 'fa-building', t('nav.companyProfile'), ['/employer/company-profile'])}
        `;
    } else {
        links = `
            ${L('/dashboard', 'fa-home', t('nav.dashboard'), ['/dashboard'])}
            ${L('/jobs', 'fa-briefcase', t('nav.jobs'), ['/jobs'])}
            ${L('/companies', 'fa-building', t('nav.companies'), ['/companies'])}
            ${L('/applications', 'fa-clipboard-list', t('nav.applications'), ['/applications'])}
            ${L('/events', 'fa-calendar-alt', t('nav.events'), ['/events'])}
            ${L('/messages', 'fa-envelope', t('messages.title'), ['/messages'])}
            ${L('/notifications', 'fa-bell', t('notifications.title'), ['/notifications'])}
            ${L('/profile', 'fa-user', t('nav.profile'), ['/profile'])}
        `;
    }

    const headerHTML = `
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        ${logo}
                        <span class="text-sm text-gray-500 hidden sm:inline">${t('common.byAvengaAcademy')}</span>
                    </div>
                    <div class="flex items-center flex-wrap gap-x-4 gap-y-2 justify-end">
                        ${links}
                        ${userBlock}
                    </div>
                </div>
            </div>
        </nav>
    `;

    // Attach language selector events after rendering
    setTimeout(() => {
        attachLanguageSelectorEvents();
    }, 0);

    return headerHTML;
}
