/**
 * Admin Compliance Controller
 * Generate and review compliance export jobs.
 */
import mockDataService from '../../services/mockDataService.js';
import {
    bindAdminLogout,
    capitalize,
    downloadGeneratedFile,
    formatTimestamp,
    renderAdminSettingsLayout,
    renderSettingsActionLink,
    requireAdminUser,
} from './adminSettingsShared.js';

export default async function adminComplianceController() {
    const app = document.getElementById('app');
    const user = requireAdminUser();

    if (!user) {
        return;
    }

    const state = {
        complianceExports: [],
        studentAccounts: [],
        employerAccounts: [],
        complianceForm: {
            accountType: 'student',
            accountId: '',
            format: 'json',
            domains: ['account', 'activity', 'communications'],
        },
    };

    await loadData();
    render();

    async function loadData() {
        const [complianceExports, students, alumni, employers] = await Promise.all([
            mockDataService.getComplianceExports(),
            mockDataService.getUsersByRole('student'),
            mockDataService.getUsersByRole('alumni'),
            mockDataService.getUsersByRole('employer'),
        ]);

        state.complianceExports = complianceExports;
        state.studentAccounts = [...students, ...alumni].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        state.employerAccounts = employers.sort((a, b) => a.name.localeCompare(b.name));

        const accountOptions = getComplianceAccountOptions(state);
        if (!accountOptions.some((account) => account.id === state.complianceForm.accountId)) {
            state.complianceForm.accountId = accountOptions[0]?.id || '';
        }
    }

    function render() {
        app.innerHTML = renderAdminSettingsLayout({
            user,
            currentPath: window.location.pathname,
            title: 'Data Export and Compliance Tools',
            description: 'Generate data exports and review the history of compliance jobs.',
            headerActions: renderSettingsActionLink(
                '/admin/settings',
                'Settings Overview',
                'fa-arrow-left'
            ),
            summaryCards: [
                {
                    label: 'Export Jobs',
                    value: state.complianceExports.length,
                },
                {
                    label: 'Student Accounts',
                    value: state.studentAccounts.length,
                    valueClass: 'text-indigo-600',
                },
                {
                    label: 'Employer Accounts',
                    value: state.employerAccounts.length,
                    valueClass: 'text-green-600',
                },
            ],
            content: `
                <div class="grid xl:grid-cols-5 gap-8">
                    <div class="xl:col-span-2 card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-file-export text-indigo-600 mr-2"></i>
                            Generate Export
                        </h2>
                        <form id="complianceExportForm">
                            <div class="space-y-4 mb-6">
                                <div>
                                    <label class="form-label">Account type</label>
                                    <select id="complianceAccountType" name="accountType" class="form-input">
                                        <option value="student" ${state.complianceForm.accountType === 'student' ? 'selected' : ''}>Student</option>
                                        <option value="employer" ${state.complianceForm.accountType === 'employer' ? 'selected' : ''}>Employer</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Account</label>
                                    <select name="accountId" class="form-input">
                                        ${getComplianceAccountOptions(state)
                                            .map(
                                                (account) =>
                                                    `<option value="${account.id}" ${account.id === state.complianceForm.accountId ? 'selected' : ''}>${account.name} (${account.email})</option>`
                                            )
                                            .join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Export format</label>
                                    <select name="format" class="form-input">
                                        <option value="json" ${state.complianceForm.format === 'json' ? 'selected' : ''}>JSON</option>
                                        <option value="csv" ${state.complianceForm.format === 'csv' ? 'selected' : ''}>CSV</option>
                                    </select>
                                </div>
                                <div>
                                    <p class="form-label">Included domains</p>
                                    <div class="space-y-3">
                                        ${['account', 'activity', 'communications']
                                            .map(
                                                (domain) => `
                                            <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300">
                                                <input type="checkbox" name="domains" value="${domain}" ${state.complianceForm.domains.includes(domain) ? 'checked' : ''} />
                                                <span class="font-medium text-gray-700">${capitalize(domain)}</span>
                                            </label>
                                        `
                                            )
                                            .join('')}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-full">
                                <i class="fas fa-download mr-2"></i> Generate Export
                            </button>
                        </form>
                    </div>

                    <div class="xl:col-span-3 card">
                        <div class="mb-4">
                            <h2 class="text-2xl font-bold text-gray-800">Export History</h2>
                            <p class="text-gray-500 text-sm">Recent compliance exports generated by the platform.</p>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-100 border-b-2 border-gray-300">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Requested</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Account</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Format</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Domains</th>
                                        <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Size</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderComplianceRows(state.complianceExports)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `,
        });

        bindEvents();
    }

    function bindEvents() {
        bindAdminLogout();

        const complianceAccountType = document.getElementById('complianceAccountType');
        if (complianceAccountType) {
            complianceAccountType.addEventListener('change', (event) => {
                state.complianceForm.accountType = event.target.value;

                const accountOptions = getComplianceAccountOptions(state);
                state.complianceForm.accountId = accountOptions[0]?.id || '';
                render();
            });
        }

        const complianceExportForm = document.getElementById('complianceExportForm');
        if (complianceExportForm) {
            complianceExportForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);
                const domains = formData.getAll('domains').map((value) => String(value));
                const exportJob = await mockDataService.generateComplianceExport({
                    accountType: String(formData.get('accountType') || 'student'),
                    accountId: String(formData.get('accountId') || ''),
                    format: String(formData.get('format') || 'json'),
                    domains: domains.length > 0 ? domains : ['account'],
                    requestedBy: user.name,
                });

                state.complianceForm = {
                    accountType: String(formData.get('accountType') || 'student'),
                    accountId: String(formData.get('accountId') || ''),
                    format: String(formData.get('format') || 'json'),
                    domains: domains.length > 0 ? domains : ['account'],
                };

                downloadGeneratedFile(exportJob.fileName, exportJob.content, exportJob.mimeType);
                await loadData();
                render();
            });
        }
    }
}

function getComplianceAccountOptions(state) {
    return state.complianceForm.accountType === 'employer'
        ? state.employerAccounts
        : state.studentAccounts;
}

function renderComplianceRows(entries) {
    if (entries.length === 0) {
        return `
            <tr>
                <td colspan="5" class="px-4 py-10 text-center text-gray-500">No exports generated yet.</td>
            </tr>
        `;
    }

    return entries
        .map(
            (entry) => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="px-4 py-4 text-sm text-gray-600">${formatTimestamp(entry.requestedAt)}</td>
                    <td class="px-4 py-4 text-gray-800">${entry.accountType} · ${entry.accountId}</td>
                    <td class="px-4 py-4">
                        <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold uppercase">${entry.format}</span>
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600">${entry.domains.join(', ')}</td>
                    <td class="px-4 py-4 text-sm text-gray-600">${entry.sizeLabel}</td>
                </tr>
            `
        )
        .join('');
}
