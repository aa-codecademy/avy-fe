export function renderStatsCards(stats, t) {
    // If t (translation function) is not provided, create a fallback
    const translate =
        t ||
        ((key) => {
            const defaults = {
                'applications.pending': 'Pending',
                'applications.underReview': 'Under Review',
                'applications.interview': 'Interview',
                'applications.accepted': 'Accepted',
                'applications.rejected': 'Rejected',
                'applications.declined': 'Cancelled',
            };
            return defaults[key] || key;
        });

    return `
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-yellow-600">${stats.pending || 0}</div>
                <div class="text-sm text-gray-600">${translate('applications.pending')}</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-blue-600">${stats.under_review || 0}</div>
                <div class="text-sm text-gray-600">${translate('applications.underReview')}</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-purple-600">${stats.interview || 0}</div>
                <div class="text-sm text-gray-600">${translate('applications.interview')}</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-green-600">${stats.accepted || 0}</div>
                <div class="text-sm text-gray-600">${translate('applications.accepted')}</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-red-600">${stats.rejected || 0}</div>
                <div class="text-sm text-gray-600">${translate('applications.rejected')}</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-gray-600">${stats.declined || 0}</div>
                <div class="text-sm text-gray-600">${translate('applications.declined')}</div>
            </div>
        </div>
    `;
}
