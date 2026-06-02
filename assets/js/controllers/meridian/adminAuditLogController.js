/**
 * Admin Audit Log Controller
 * View and filter the platform audit log.
 */
import mockDataService from '../../services/mockDataService.js';
import {
    bindAdminLogout,
    capitalize,
    escapeAttribute,
    formatTimestamp,
    renderAdminSettingsLayout,
    renderSettingsActionLink,
    requireAdminUser,
} from './adminSettingsShared.js';

export default async function adminAuditLogController() {
    const app = document.getElementById('app');
    const user = requireAdminUser();

    if (!user) {
        return;
    }

    const state = {
        auditLog: [],
        auditFilters: {
            query: '',
            actorRole: '',
            area: '',
            severity: '',
        },
    };

    await loadData();
    render();

    async function loadData() {
        state.auditLog = await mockDataService.getAuditLog(state.auditFilters);
    }

    function render() {
        const warningCount = state.auditLog.filter((entry) => entry.severity === 'warning').length;

        app.innerHTML = renderAdminSettingsLayout({
            user,
            currentPath: window.location.pathname,
            title: 'Platform Audit Log',
            description:
                'Review significant admin, student, and employer actions across the platform.',
            headerActions: renderSettingsActionLink(
                '/admin/settings',
                'Settings Overview',
                'fa-arrow-left'
            ),
            summaryCards: [
                {
                    label: 'Visible Audit Records',
                    value: state.auditLog.length,
                },
                {
                    label: 'Warnings',
                    value: warningCount,
                    valueClass: 'text-yellow-600',
                },
            ],
            content: `
                <div class="card">
                    <form id="auditFilterForm" class="grid md:grid-cols-4 gap-4 mb-6">
                        <input type="text" name="query" class="form-input" placeholder="Search activity..." value="${escapeAttribute(state.auditFilters.query)}" />
                        <select name="actorRole" class="form-input">
                            <option value="">All actor roles</option>
                            ${['admin', 'student', 'employer'].map((value) => `<option value="${value}" ${state.auditFilters.actorRole === value ? 'selected' : ''}>${capitalize(value)}</option>`).join('')}
                        </select>
                        <select name="area" class="form-input">
                            <option value="">All areas</option>
                            ${['Access', 'Templates', 'Compliance', 'Privacy'].map((value) => `<option value="${value}" ${state.auditFilters.area === value ? 'selected' : ''}>${value}</option>`).join('')}
                        </select>
                        <select name="severity" class="form-input">
                            <option value="">All severities</option>
                            ${['info', 'warning'].map((value) => `<option value="${value}" ${state.auditFilters.severity === value ? 'selected' : ''}>${capitalize(value)}</option>`).join('')}
                        </select>
                        <div class="md:col-span-4 flex gap-3 justify-end">
                            <button type="button" id="resetAuditFiltersBtn" class="btn btn-secondary">Reset</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-filter mr-2"></i> Apply Filters
                            </button>
                        </div>
                    </form>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-100 border-b-2 border-gray-300">
                                <tr>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Timestamp</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Actor</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Action</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Area</th>
                                    <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Target</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${renderAuditRows(state.auditLog)}
                            </tbody>
                        </table>
                    </div>
                </div>
            `,
        });

        bindEvents();
    }

    function bindEvents() {
        bindAdminLogout();

        const auditFilterForm = document.getElementById('auditFilterForm');
        if (auditFilterForm) {
            auditFilterForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);
                state.auditFilters = {
                    query: String(formData.get('query') || '').trim(),
                    actorRole: String(formData.get('actorRole') || '').trim(),
                    area: String(formData.get('area') || '').trim(),
                    severity: String(formData.get('severity') || '').trim(),
                };

                await loadData();
                render();
            });
        }

        const resetAuditFiltersBtn = document.getElementById('resetAuditFiltersBtn');
        if (resetAuditFiltersBtn) {
            resetAuditFiltersBtn.addEventListener('click', async () => {
                state.auditFilters = {
                    query: '',
                    actorRole: '',
                    area: '',
                    severity: '',
                };

                await loadData();
                render();
            });
        }
    }
}

function renderAuditRows(entries) {
    if (entries.length === 0) {
        return `
            <tr>
                <td colspan="5" class="px-4 py-10 text-center text-gray-500">No audit records match the current filters.</td>
            </tr>
        `;
    }

    return entries
        .map(
            (entry) => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="px-4 py-4 text-sm text-gray-600">${formatTimestamp(entry.timestamp)}</td>
                    <td class="px-4 py-4">
                        <div class="font-semibold text-gray-800">${entry.actorName}</div>
                        <div class="text-sm text-gray-500 capitalize">${entry.actorRole}</div>
                    </td>
                    <td class="px-4 py-4">
                        <div class="font-semibold text-gray-800">${entry.action}</div>
                        <div class="text-sm text-gray-500">${entry.summary || ''}</div>
                    </td>
                    <td class="px-4 py-4">
                        <span class="px-3 py-1 rounded-full text-sm font-semibold ${entry.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}">
                            ${entry.area}
                        </span>
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600">${entry.targetName}</td>
                </tr>
            `
        )
        .join('');
}
