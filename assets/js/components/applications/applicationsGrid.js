import { escapeHtml, formatDate, getProgressByStatus, renderStatusBadge } from './applicationsHelpers.js';

export function renderApplicationsGrid(applications, companyMap) {
    if (applications.length === 0) {
        return '';
    }

    return applications.map(app => {
        const company = companyMap[app.companyId] || {
            name: app.companyName || 'Company',
            logo: 'https://via.placeholder.com/64x64?text=Company'
        };
        const canWithdraw = ['pending', 'under_review', 'interview'].includes(app.status);
        const progress = getProgressByStatus(app.status);

        return `
            <div class="card hover:shadow-xl transition" data-app-id="${app.id}">
                <div class="flex items-start gap-4">
                    <img src="${company.logo || 'https://via.placeholder.com/64x64?text=Logo'}"
                         alt="${company.name}"
                         class="w-16 h-16 rounded-lg object-cover" />

                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-2 flex-wrap gap-2">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-1">
                                    ${escapeHtml(app.jobTitle)}
                                </h3>
                                <p class="text-gray-600">${escapeHtml(company.name)}</p>
                            </div>
                            <div>
                                ${renderStatusBadge(app.status)}
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 mb-3">
                            <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                <i class="fas fa-calendar-alt mr-1"></i> Applied: ${formatDate(app.appliedDate)}
                            </span>
                            ${app.location && app.location !== 'Not specified' ? `
                                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    <i class="fas fa-map-marker-alt mr-1"></i> ${escapeHtml(app.location)}
                                </span>
                            ` : ''}
                            ${app.employmentType ? `
                                <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                    <i class="fas fa-briefcase mr-1"></i> ${app.employmentType}
                                </span>
                            ` : ''}
                        </div>

                        <div class="mb-3">
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Application Progress</span>
                                <span>${progress}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div class="progress-bar h-2 rounded-full transition-all duration-500" style="width: ${progress}%; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);"></div>
                            </div>
                        </div>

                        ${app.notes ? `
                            <div class="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                                <i class="fas fa-sticky-note mr-1 text-gray-400"></i>
                                ${escapeHtml(app.notes)}
                            </div>
                        ` : ''}

                        <div class="flex justify-between items-center flex-wrap gap-2">
                            <div class="text-sm text-gray-500">
                                <i class="fas fa-clock mr-1"></i>
                                Last updated: ${formatDate(app.updatedAt || app.appliedDate)}
                            </div>
                            ${canWithdraw ? `
                                <button class="withdraw-btn px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition text-sm font-medium"
                                        data-id="${app.id}"
                                        data-title="${escapeHtml(app.jobTitle)}"
                                        data-company="${escapeHtml(company.name)}"
                                        data-email="${app.companyEmail}">
                                    <i class="fas fa-times-circle mr-1"></i> Cancel Application
                                </button>
                            ` : app.status === 'declined' || app.status === 'withdrawn' ? `
                                <span class="text-sm text-gray-400">
                                    <i class="fas fa-check-circle mr-1"></i> Application Cancelled
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
