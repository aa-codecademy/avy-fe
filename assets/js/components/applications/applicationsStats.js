export function renderStatsCards(stats) {
    return `
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-yellow-600">${stats.pending || 0}</div>
                <div class="text-sm text-gray-600">Pending</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-blue-600">${stats.under_review || 0}</div>
                <div class="text-sm text-gray-600">Under Review</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-purple-600">${stats.interview || 0}</div>
                <div class="text-sm text-gray-600">Interview</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-green-600">${stats.accepted || 0}</div>
                <div class="text-sm text-gray-600">Accepted</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-red-600">${stats.rejected || 0}</div>
                <div class="text-sm text-gray-600">Rejected</div>
            </div>
            <div class="card text-center p-4">
                <div class="text-2xl font-bold text-gray-600">${stats.declined || 0}</div>
                <div class="text-sm text-gray-600">Cancelled</div>
            </div>
        </div>
    `;
}
