import { escapeHtml } from './applicationsHelpers.js';
import languageService from '../../services/languageService.js';

export function renderFilterSidebar(companies, totalCount, stats) {
    const t = (key) => languageService.translate(key);
    return `
        <div class="lg:col-span-1">
            <div class="card sticky top-4">
                <h2 class="text-xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-filter mr-2"></i>
                    ${t('applications.filters')}
                </h2>

                <div class="mb-4">
                    <label class="form-label">${t('applications.status')}</label>
                    <select id="statusFilter" class="form-input">
                        <option value="all">${t('applications.allApplications')} (${totalCount})</option>
                        <option value="pending">${t('applications.pending')} (${stats.pending || 0})</option>
                        <option value="under_review">${t('applications.underReview')} (${stats.under_review || 0})</option>
                        <option value="interview">${t('applications.interview')} (${stats.interview || 0})</option>
                        <option value="accepted">${t('applications.accepted')} (${stats.accepted || 0})</option>
                        <option value="rejected">${t('applications.rejected')} (${stats.rejected || 0})</option>
                        <option value="declined">${t('applications.declined')} (${stats.declined || 0})</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="form-label">${t('applications.company')}</label>
                    <select id="companyFilter" class="form-input">
                        <option value="">${t('applications.allCompanies')}</option>
                        ${companies.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
                    </select>
                </div>

                <div class="mb-4">
                    <label class="form-label">${t('applications.dateRange')}</label>
                    <select id="dateFilter" class="form-input">
                        <option value="all">${t('applications.allTime')}</option>
                        <option value="week">${t('applications.last7Days')}</option>
                        <option value="month">${t('applications.last30Days')}</option>
                        <option value="quarter">${t('applications.last90Days')}</option>
                    </select>
                </div>

                <button id="applyFiltersBtn" class="btn btn-primary w-full">
                    ${t('applications.applyFilters')}
                </button>

                <button id="clearFiltersBtn" class="btn btn-secondary w-full mt-2">
                    ${t('applications.clearAll')}
                </button>
            </div>
        </div>
    `;
}
