/**
 * Admin Notifications Controller (Meridian)
 * System-level alerts feed.
 *
 * User stories:
 *  - "A1-06 Alerts and system notices"
 *
 * Available mock service methods:
 *  - mockDataService.getNotifications(userId, { unreadOnly })
 *  - mockDataService.markNotificationAsRead(id)
 *  - mockDataService.markAllAsRead(userId)
 *  - mockDataService.createNotification(data)
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminNotificationsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const state = {
        query: '',
        severity: 'all',
        status: 'open',
        alerts: (await mockDataService.getAlerts()).map((alert) => ({
            ...alert,
            status: alert.status || 'open',
        })),
    };

    render();

    function render() {
        const visibleAlerts = getVisibleAlerts();
        const openCount = state.alerts.filter((alert) => alert.status === 'open').length;
        const reviewedCount = state.alerts.filter((alert) => alert.status === 'reviewed').length;
        const criticalCount = state.alerts.filter((alert) => alert.severity === 'error').length;
        const warningCount = state.alerts.filter((alert) => alert.severity === 'warning').length;

        app.innerHTML = `
            ${renderAppHeader(user, window.location.pathname)}
            <div class="bg-gray-50 min-h-screen py-8">
                <div class="container mx-auto px-4">
                    <div class="fade-in">
                        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                    <i class="fas fa-bell text-purple-600 mr-3"></i>
                                    System Notifications
                                </h1>
                                <p class="text-gray-600">Track platform-level alerts, expiring access requests, and unusual activity in one feed.</p>
                            </div>
                            <button id="markAllReviewedBtn" type="button" class="btn btn-secondary text-center" ${openCount === 0 ? 'disabled' : ''}>
                                <i class="fas fa-check-double mr-2"></i> Mark all reviewed
                            </button>
                        </div>

                        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
                            ${renderSummaryCard('Open Alerts', openCount, 'text-red-600')}
                            ${renderSummaryCard('Critical Alerts', criticalCount, 'text-red-700')}
                            ${renderSummaryCard('Warnings', warningCount, 'text-yellow-600')}
                            ${renderSummaryCard('Reviewed', reviewedCount, 'text-green-600')}
                        </div>

                        <div class="card mb-8">
                            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-end">
                                <div class="xl:col-span-2">
                                    <label for="alertSearch" class="form-label">Search</label>
                                    <input id="alertSearch" type="text" class="form-input" value="${escapeAttribute(state.query)}" placeholder="Title, message or alert type..." />
                                </div>
                                <div>
                                    <label for="alertSeverityFilter" class="form-label">Severity</label>
                                    <select id="alertSeverityFilter" class="form-input">
                                        <option value="all" ${state.severity === 'all' ? 'selected' : ''}>All severities</option>
                                        <option value="error" ${state.severity === 'error' ? 'selected' : ''}>Critical</option>
                                        <option value="warning" ${state.severity === 'warning' ? 'selected' : ''}>Warning</option>
                                        <option value="info" ${state.severity === 'info' ? 'selected' : ''}>Info</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="alertStatusFilter" class="form-label">Status</label>
                                    <select id="alertStatusFilter" class="form-input">
                                        <option value="all" ${state.status === 'all' ? 'selected' : ''}>All statuses</option>
                                        <option value="open" ${state.status === 'open' ? 'selected' : ''}>Open</option>
                                        <option value="reviewed" ${state.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            ${visibleAlerts.length ? visibleAlerts.map(renderAlertCard).join('') : renderEmptyState()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => authService.logout());
        }

        const search = document.getElementById('alertSearch');
        if (search) {
            search.addEventListener('input', (event) => {
                state.query = event.target.value;
                render();
            });
        }

        const severityFilter = document.getElementById('alertSeverityFilter');
        if (severityFilter) {
            severityFilter.addEventListener('change', (event) => {
                state.severity = event.target.value;
                render();
            });
        }

        const statusFilter = document.getElementById('alertStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (event) => {
                state.status = event.target.value;
                render();
            });
        }

        const markAllReviewedBtn = document.getElementById('markAllReviewedBtn');
        if (markAllReviewedBtn) {
            markAllReviewedBtn.addEventListener('click', () => {
                state.alerts = state.alerts.map((alert) => ({ ...alert, status: 'reviewed' }));
                render();
            });
        }

        document.querySelectorAll('[data-alert-action]').forEach((button) => {
            button.addEventListener('click', (event) => {
                const alertId = event.currentTarget.getAttribute('data-alert-id');
                const action = event.currentTarget.getAttribute('data-alert-action');

                state.alerts = state.alerts.map((alert) => {
                    if (alert.id !== alertId) {
                        return alert;
                    }

                    return {
                        ...alert,
                        status: action === 'review' ? 'reviewed' : 'open',
                    };
                });

                render();
            });
        });
    }

    function getVisibleAlerts() {
        const query = state.query.trim().toLowerCase();
        return state.alerts.filter((alert) => {
            const matchesQuery =
                !query ||
                alert.title.toLowerCase().includes(query) ||
                alert.message.toLowerCase().includes(query) ||
                String(alert.type || '')
                    .toLowerCase()
                    .includes(query);
            const matchesSeverity = state.severity === 'all' || alert.severity === state.severity;
            const matchesStatus = state.status === 'all' || alert.status === state.status;

            return matchesQuery && matchesSeverity && matchesStatus;
        });
    }
}

function renderSummaryCard(label, value, valueClass) {
    return `
        <div class="card bg-white">
            <p class="text-sm text-gray-500 mb-1">${label}</p>
            <p class="text-3xl font-bold ${valueClass}">${value}</p>
        </div>
    `;
}

function renderAlertCard(alert) {
    const severityStyles = {
        error: {
            wrapper: 'border-red-200 bg-red-50',
            badge: 'bg-red-100 text-red-700',
            icon: 'text-red-600',
            label: 'Critical',
        },
        warning: {
            wrapper: 'border-yellow-200 bg-yellow-50',
            badge: 'bg-yellow-100 text-yellow-700',
            icon: 'text-yellow-600',
            label: 'Warning',
        },
        info: {
            wrapper: 'border-blue-200 bg-blue-50',
            badge: 'bg-blue-100 text-blue-700',
            icon: 'text-blue-600',
            label: 'Info',
        },
    };

    const style = severityStyles[alert.severity] || severityStyles.info;
    const statusBadge =
        alert.status === 'reviewed'
            ? '<span class="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Reviewed</span>'
            : '<span class="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700">Open</span>';
    const relatedRoute = getAlertRoute(alert);

    return `
        <div class="card no-hover border ${style.wrapper}">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex items-start gap-4 min-w-0">
                    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <i class="fas ${alert.icon || 'fa-bell'} ${style.icon} text-lg"></i>
                    </div>
                    <div class="min-w-0">
                        <div class="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                            <h2 class="text-xl font-bold text-gray-800">${alert.title}</h2>
                            <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style.badge}">${style.label}</span>
                            ${statusBadge}
                        </div>
                        <p class="text-gray-700">${alert.message}</p>
                        <p class="mt-3 text-sm text-gray-500">${formatAlertTimestamp(alert.timestamp)}</p>
                    </div>
                </div>
                <div class="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                    ${relatedRoute ? `<a href="${relatedRoute}" data-link class="btn btn-secondary text-center">Open Related Page</a>` : ''}
                    <button type="button" data-alert-action="${alert.status === 'reviewed' ? 'reopen' : 'review'}" data-alert-id="${alert.id}" class="btn btn-primary text-center">
                        <i class="fas ${alert.status === 'reviewed' ? 'fa-rotate-left' : 'fa-check'} mr-2"></i>
                        ${alert.status === 'reviewed' ? 'Reopen Alert' : 'Mark Reviewed'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderEmptyState() {
    return `
        <div class="card text-center py-16">
            <i class="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-700 mb-2">No matching alerts</h3>
            <p class="text-gray-500">Adjust the filters or search terms to review other system notices.</p>
        </div>
    `;
}

function formatAlertTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getAlertRoute(alert) {
    if (alert.title.includes('Email')) {
        return '/admin/settings/templates';
    }
    if (alert.title.includes('Access Request')) {
        return '/admin/analytics';
    }
    if (alert.title.includes('Unusual Activity')) {
        return '/admin/settings/audit';
    }
    if (alert.title.includes('Database Backup')) {
        return '/admin/settings/compliance';
    }
    return '';
}

function escapeAttribute(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
