import { escapeHtml } from './applicationsHelpers.js';

export function renderFilterSidebar(companies, totalCount, stats) {
    return `
        <div class="lg:col-span-1">
            <div class="card sticky top-4">
                <h2 class="text-xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-filter mr-2"></i>
                    Filters
                </h2>

                <div class="mb-4">
                    <label class="form-label">Status</label>
                    <select id="statusFilter" class="form-input">
                        <option value="all">All Applications (${totalCount})</option>
                        <option value="pending">Pending (${stats.pending || 0})</option>
                        <option value="under_review">Under Review (${stats.under_review || 0})</option>
                        <option value="interview">Interview (${stats.interview || 0})</option>
                        <option value="accepted">Accepted (${stats.accepted || 0})</option>
                        <option value="rejected">Rejected (${stats.rejected || 0})</option>
                        <option value="declined">Cancelled (${stats.declined || 0})</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="form-label">Company</label>
                    <select id="companyFilter" class="form-input">
                        <option value="">All Companies</option>
                        ${companies.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
                    </select>
                </div>

                <div class="mb-4">
                    <label class="form-label">Date Range</label>
                    <select id="dateFilter" class="form-input">
                        <option value="all">All Time</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last 90 Days</option>
                    </select>
                </div>

                <button id="applyFiltersBtn" class="btn btn-primary w-full">
                    Apply Filters
                </button>

                <button id="clearFiltersBtn" class="btn btn-secondary w-full mt-2">
                    Clear All
                </button>
            </div>
        </div>
    `;
}
