import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

const EVENT_CONFIG = {
    view: {
        label: 'Profile View',
        icon: 'fa-eye',
        badgeCls: 'bg-blue-100 text-blue-800 border border-blue-200',
    },
    export: {
        label: 'Data Export',
        icon: 'fa-file-download',
        badgeCls: 'bg-purple-100 text-purple-800 border border-purple-200',
    },
    request: {
        label: 'Access Request',
        icon: 'fa-hand-paper',
        badgeCls: 'bg-amber-100 text-amber-800 border border-amber-200',
    },
    grant: {
        label: 'Access Granted',
        icon: 'fa-check-circle',
        badgeCls: 'bg-green-100 text-green-800 border border-green-200',
    },
    deny: {
        label: 'Access Denied',
        icon: 'fa-times-circle',
        badgeCls: 'bg-red-100 text-red-800 border border-red-200',
    },
    revoke: {
        label: 'Access Revoked',
        icon: 'fa-ban',
        badgeCls: 'bg-orange-100 text-orange-800 border border-orange-200',
    },
};

// Module-level reference so filter callbacks can access the full dataset after initial load
let _allLogs = [];

export default async function adminStudentPrivacyLogController(params = {}) {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const studentId = params.id;

    const [student, logs] = await Promise.all([
        mockDataService.getUserById(studentId),
        mockDataService.getProfileAccessLog(studentId),
    ]);

    if (!student || student.role !== 'student') {
        window.router.navigate('/404');
        return;
    }

    _allLogs = logs;
    const stats = computeStats(logs);
    const isPrivate = student.profileVisibility === 'private';

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">

                    <div class="mb-6">
                        <a href="/admin/students/${student.id}" data-link
                            class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Student Profile
                        </a>
                    </div>

                    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-eye text-purple-500 mr-2"></i>Privacy Access Log
                            </h1>
                            <p class="text-sm text-gray-500 mt-1">
                                Employer access history for
                                <span class="font-semibold text-gray-700">${student.name}</span>
                            </p>
                        </div>
                        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${isPrivate ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'bg-green-100 text-green-700 border border-green-200'}">
                            <i class="fas ${isPrivate ? 'fa-lock' : 'fa-globe'} mr-1.5"></i>
                            ${isPrivate ? 'Private Profile' : 'Public Profile'}
                        </span>
                    </div>

                    ${renderStudentMiniCard(student)}
                    ${renderSummaryStats(stats)}

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mt-6">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-5">
                            <h2 class="text-base font-bold text-gray-800">
                                <i class="fas fa-list-alt text-purple-500 mr-2"></i>Access Events
                            </h2>
                            <span class="text-xs text-gray-400 font-medium">
                                <i class="fas fa-sort-amount-down mr-1"></i>Newest first
                            </span>
                        </div>
                        ${renderFilterBar()}
                        <div id="logTableContainer" class="mt-5">
                            ${renderLogTable(logs, false)}
                        </div>
                    </div>

                    ${isPrivate ? renderPrivacyNote() : ''}

                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    setupFilters();
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function computeStats(logs) {
    return {
        total: logs.length,
        views: logs.filter((l) => l.type === 'view').length,
        requests: logs.filter((l) => l.type === 'request').length,
        uniqueEmployers: new Set(logs.map((l) => l.employerId).filter(Boolean)).size,
    };
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function renderStudentMiniCard(student) {
    const accountStatus = student.accountStatus || 'active';
    const statusCfg = {
        active: { cls: 'bg-green-100 text-green-700', icon: 'fa-check-circle', label: 'Active' },
        suspended: {
            cls: 'bg-orange-100 text-orange-700',
            icon: 'fa-pause-circle',
            label: 'Suspended',
        },
        deactivated: { cls: 'bg-red-100 text-red-700', icon: 'fa-ban', label: 'Deactivated' },
    };
    const sc = statusCfg[accountStatus] || statusCfg.active;

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex flex-wrap items-center gap-4 mb-6">
            <img src="${student.avatar}" alt="${student.name}"
                 class="w-14 h-14 rounded-full border-2 border-purple-200 flex-shrink-0" />
            <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-800">${student.name}</p>
                <p class="text-sm text-gray-500 truncate">${student.email}</p>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${sc.cls}">
                <i class="fas ${sc.icon} mr-1.5"></i>${sc.label}
            </span>
        </div>
    `;
}

function renderSummaryStats(stats) {
    const items = [
        {
            icon: 'fa-history',
            label: 'Total Events',
            value: stats.total,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
        },
        {
            icon: 'fa-eye',
            label: 'Profile Views',
            value: stats.views,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
        },
        {
            icon: 'fa-building',
            label: 'Unique Employers',
            value: stats.uniqueEmployers,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
        },
        {
            icon: 'fa-hand-paper',
            label: 'Access Requests',
            value: stats.requests,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
        },
    ];

    return `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            ${items
                .map(
                    (item) => `
                <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] ${item.bg} border ${item.border} text-center py-5">
                    <i class="fas ${item.icon} ${item.color} text-xl mb-2 block"></i>
                    <p class="text-3xl font-bold ${item.color}">${item.value}</p>
                    <p class="text-xs text-gray-500 mt-1">${item.label}</p>
                </div>
            `
                )
                .join('')}
        </div>
    `;
}

function renderFilterBar() {
    return `
        <div class="flex flex-wrap gap-3 items-end">
            <div class="flex-1 min-w-48">
                <label class="mb-2 block font-medium text-slate-700 text-xs mb-1">Search</label>
                <div class="relative">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    <input id="logSearch" type="text"
                        placeholder="Employer name or company..."
                        class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] pl-9"
                        style="padding-top: 0.5rem; padding-bottom: 0.5rem; font-size: 0.875rem;" />
                </div>
            </div>
            <div>
                <label class="mb-2 block font-medium text-slate-700 text-xs mb-1">Event type</label>
                <select id="logTypeFilter" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                    style="padding-top: 0.5rem; padding-bottom: 0.5rem; font-size: 0.875rem;">
                    <option value="">All types</option>
                    <option value="view">Profile View</option>
                    <option value="export">Data Export</option>
                    <option value="request">Access Request</option>
                    <option value="grant">Access Granted</option>
                    <option value="deny">Access Denied</option>
                    <option value="revoke">Access Revoked</option>
                </select>
            </div>
            <div>
                <label class="mb-2 block font-medium text-slate-700 text-xs mb-1">Period</label>
                <select id="logPeriodFilter" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                    style="padding-top: 0.5rem; padding-bottom: 0.5rem; font-size: 0.875rem;">
                    <option value="">All time</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="quarter">Last 90 days</option>
                </select>
            </div>
            <button id="clearFiltersBtn"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition">
                <i class="fas fa-times text-xs"></i> Clear
            </button>
        </div>
    `;
}

function renderLogTable(logs, isFiltered) {
    if (logs.length === 0) {
        return renderEmptyState(isFiltered);
    }

    const countLine = isFiltered
        ? `Showing <strong>${logs.length}</strong> of <strong>${_allLogs.length}</strong> events`
        : `${logs.length} event${logs.length !== 1 ? 's' : ''} total`;

    return `
        <div class="overflow-x-auto rounded-xl border border-gray-100">
            <table class="w-full text-sm data-table-min">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-200">
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Timestamp</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Event</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Employer</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Company</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${logs.map((log, i) => renderLogRow(log, i)).join('')}
                </tbody>
            </table>
        </div>
        <p class="text-xs text-gray-400 mt-3 text-right">${countLine}</p>
    `;
}

function renderLogRow(log, index) {
    const cfg = EVENT_CONFIG[log.type] || EVENT_CONFIG.view;
    const ts = new Date(log.timestamp);
    const dateStr = ts.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const timeStr = ts.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const employerCell = log.employerName
        ? `<p class="text-gray-700 font-medium text-sm">${log.employerName}</p>`
        : `<span class="inline-flex items-center gap-1 text-gray-400 italic text-xs">
               <i class="fas fa-user-shield"></i>System / Admin
           </span>`;

    const companyCell = log.companyName
        ? `<p class="text-gray-600 text-sm">${log.companyName}</p>`
        : `<span class="text-gray-300 text-sm">—</span>`;

    return `
        <tr class="${index % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-purple-50/20 transition-colors">
            <td class="px-4 py-3 whitespace-nowrap align-top">
                <p class="text-gray-800 font-medium text-xs">${dateStr}</p>
                <p class="text-gray-400 text-xs">${timeStr}</p>
            </td>
            <td class="px-4 py-3 align-top">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.badgeCls}">
                    <i class="fas ${cfg.icon}"></i>${cfg.label}
                </span>
            </td>
            <td class="px-4 py-3 align-top">${employerCell}</td>
            <td class="px-4 py-3 align-top">${companyCell}</td>
            <td class="px-4 py-3 align-top">
                <p class="text-gray-500 text-sm leading-relaxed">${log.details || '—'}</p>
                ${
                    log.ipAddress
                        ? `<p class="text-gray-300 text-xs mt-1 font-mono">${log.ipAddress}</p>`
                        : ''
                }
            </td>
        </tr>
    `;
}

function renderEmptyState(isFiltered) {
    if (isFiltered) {
        return `
            <div class="text-center py-14">
                <i class="fas fa-search text-gray-200 text-4xl mb-4"></i>
                <p class="text-gray-500 font-semibold">No events match your filters</p>
                <p class="text-sm text-gray-400 mt-1">
                    Try adjusting your search term or selecting a different event type or period.
                </p>
            </div>
        `;
    }

    return `
        <div class="text-center py-14">
            <i class="fas fa-shield-alt text-gray-200 text-4xl mb-4"></i>
            <p class="text-gray-500 font-semibold">No access events recorded yet</p>
            <p class="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                No employer has accessed this student's profile yet.
                Events will appear here as employers view, request, or export this profile.
            </p>
        </div>
    `;
}

function renderPrivacyNote() {
    return `
        <div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p class="text-xs text-gray-500">
                <i class="fas fa-info-circle text-gray-400 mr-1.5"></i>
                <strong class="text-gray-600">Private profile:</strong>
                Employers must submit an access request before viewing this student's profile.
                Admins review each request and approve or deny access. All resulting activity
                is captured here for audit and support purposes.
            </p>
        </div>
    `;
}

// ─── Client-side filtering ────────────────────────────────────────────────────

function applyFilters() {
    const search = (document.getElementById('logSearch')?.value || '').toLowerCase().trim();
    const type = document.getElementById('logTypeFilter')?.value || '';
    const period = document.getElementById('logPeriodFilter')?.value || '';

    let filtered = [..._allLogs];

    if (type) {
        filtered = filtered.filter((l) => l.type === type);
    }

    if (search) {
        filtered = filtered.filter(
            (l) =>
                l.employerName.toLowerCase().includes(search) ||
                l.companyName.toLowerCase().includes(search) ||
                l.details.toLowerCase().includes(search)
        );
    }

    if (period) {
        const cutoffs = {
            week: Date.now() - 7 * 86400000,
            month: Date.now() - 30 * 86400000,
            quarter: Date.now() - 90 * 86400000,
        };
        if (cutoffs[period]) {
            filtered = filtered.filter((l) => new Date(l.timestamp).getTime() >= cutoffs[period]);
        }
    }

    const isFiltered = !!(type || search || period);
    document.getElementById('logTableContainer').innerHTML = renderLogTable(filtered, isFiltered);
}

function setupFilters() {
    document.getElementById('logSearch')?.addEventListener('input', applyFilters);
    document.getElementById('logTypeFilter')?.addEventListener('change', applyFilters);
    document.getElementById('logPeriodFilter')?.addEventListener('change', applyFilters);
    document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
        document.getElementById('logSearch').value = '';
        document.getElementById('logTypeFilter').value = '';
        document.getElementById('logPeriodFilter').value = '';
        applyFilters();
    });
}
