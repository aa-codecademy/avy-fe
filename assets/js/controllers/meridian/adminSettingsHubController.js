/**
 * Admin Settings Hub Controller
 * Overview page for split admin settings sections.
 */
import mockDataService from '../../services/mockDataService.js';
import {
    bindAdminLogout,
    renderAdminSettingsLayout,
    renderSettingsActionLink,
    requireAdminUser,
} from './adminSettingsShared.js';

export default async function adminSettingsHubController() {
    const app = document.getElementById('app');
    const user = requireAdminUser();

    if (!user) {
        return;
    }

    const state = {
        adminRoles: [],
        notificationTemplates: [],
        emailTemplates: [],
        platformSettings: null,
        auditLog: [],
        complianceExports: [],
    };

    await loadData();
    render();

    async function loadData() {
        const [
            adminRoles,
            notificationTemplates,
            emailTemplates,
            platformSettings,
            auditLog,
            complianceExports,
        ] = await Promise.all([
            mockDataService.getAdminRoles(),
            mockDataService.getNotificationTemplates(),
            mockDataService.getEmailTemplates(),
            mockDataService.getPlatformSettings(),
            mockDataService.getAuditLog(),
            mockDataService.getComplianceExports(),
        ]);

        state.adminRoles = adminRoles;
        state.notificationTemplates = notificationTemplates;
        state.emailTemplates = emailTemplates;
        state.platformSettings = platformSettings;
        state.auditLog = auditLog;
        state.complianceExports = complianceExports;
    }

    function render() {
        const enabledLanguages = state.platformSettings.localisation.supportedLanguages.filter(
            (language) => language.enabled
        ).length;
        const warningCount = state.auditLog.filter((entry) => entry.severity === 'warning').length;

        app.innerHTML = renderAdminSettingsLayout({
            user,
            currentPath: window.location.pathname,
            title: 'Admin Settings',
            description:
                'Use the settings hub to manage access, templates, platform policy, audit activity, and compliance exports.',
            headerActions: renderSettingsActionLink(
                '/admin/users',
                'Manage Admins',
                'fa-users-cog'
            ),
            summaryCards: [
                {
                    label: 'Admin Roles',
                    value: state.adminRoles.length,
                },
                {
                    label: 'Templates',
                    value: state.notificationTemplates.length + state.emailTemplates.length,
                    valueClass: 'text-indigo-600',
                },
                {
                    label: 'Enabled Languages',
                    value: enabledLanguages,
                    valueClass: 'text-green-600',
                },
                {
                    label: 'Warning Logs',
                    value: warningCount,
                    valueClass: 'text-yellow-600',
                    helperText: `${state.complianceExports.length} export jobs generated`,
                },
            ],
            content: `
                <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    ${renderSettingsHubCard({
                        href: '/admin/settings/roles',
                        icon: 'fa-key',
                        iconClass: 'text-purple-600',
                        title: 'Roles and Permissions',
                        description:
                            'Manage role capabilities and permission scopes for admin users.',
                        meta: `${state.adminRoles.length} configured roles`,
                    })}
                    ${renderSettingsHubCard({
                        href: '/admin/settings/templates',
                        icon: 'fa-copy',
                        iconClass: 'text-orange-500',
                        title: 'Templates',
                        description:
                            'Edit in-app notification templates and email copy used across flows.',
                        meta: `${state.notificationTemplates.length} notification templates · ${state.emailTemplates.length} email templates`,
                    })}
                    ${renderSettingsHubCard({
                        href: '/admin/settings/platform',
                        icon: 'fa-globe',
                        iconClass: 'text-green-600',
                        title: 'Platform Configuration',
                        description:
                            'Control privacy defaults, languages, date formats, and localisation.',
                        meta: `${enabledLanguages} languages enabled`,
                    })}
                    ${renderSettingsHubCard({
                        href: '/admin/settings/audit',
                        icon: 'fa-history',
                        iconClass: 'text-blue-600',
                        title: 'Audit Log',
                        description: 'Review tracked actions and filter recent system activity.',
                        meta: `${state.auditLog.length} visible records`,
                    })}
                    ${renderSettingsHubCard({
                        href: '/admin/settings/compliance',
                        icon: 'fa-file-export',
                        iconClass: 'text-indigo-600',
                        title: 'Compliance Exports',
                        description:
                            'Generate JSON or CSV exports for student and employer accounts.',
                        meta: `${state.complianceExports.length} generated exports`,
                    })}
                </div>
            `,
        });

        bindAdminLogout();
    }
}

function renderSettingsHubCard({ href, icon, iconClass, title, description, meta }) {
    return `
        <a href="${href}" data-link class="card bg-white hover:shadow-xl transition no-underline text-inherit block">
            <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <i class="fas ${icon} ${iconClass} text-xl"></i>
                </div>
                <i class="fas fa-arrow-right text-gray-400"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">${title}</h2>
            <p class="text-gray-600 text-sm mb-4">${description}</p>
            <p class="text-sm font-semibold text-gray-500">${meta}</p>
        </a>
    `;
}
