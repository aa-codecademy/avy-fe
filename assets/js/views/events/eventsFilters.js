/**
 * Events Filters View
 */

export function renderEventsFilters(currentFilters, onFilterChange) {
    return `
        <div class="card mb-8">
            <h3 class="font-semibold text-gray-800 mb-4">Filters</h3>
            <div class="space-y-4">
                <div>
                    <label class="form-label text-sm">Event Type</label>
                    <div class="flex flex-wrap gap-2">
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.type === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="type" data-filter-value="all">All Types</button>
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.type === 'career-day' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="type" data-filter-value="career-day">Career Days</button>
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.type === 'workshop' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="type" data-filter-value="workshop">Workshops</button>
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.type === 'webinar' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="type" data-filter-value="webinar">Webinars</button>
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.type === 'networking' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="type" data-filter-value="networking">Networking</button>
                    </div>
                </div>
                <div>
                    <label class="form-label text-sm">Date Range</label>
                    <div class="flex flex-wrap gap-2">
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.dateRange === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="dateRange" data-filter-value="all">All Dates</button>
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.dateRange === 'upcoming' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="dateRange" data-filter-value="upcoming">Upcoming</button>
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.dateRange === 'this-week' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="dateRange" data-filter-value="this-week">This Week</button>
                        <button class="filter-btn px-4 py-2 rounded-lg border transition ${currentFilters.dateRange === 'this-month' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border-gray-300'}" data-filter-type="dateRange" data-filter-value="this-month">This Month</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function attachFilterListeners(onFilterChange) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filterType;
            const filterValue = btn.dataset.filterValue;
            onFilterChange(filterType, filterValue);
        });
    });
}

export function updateFilterButtonStyles(filterType, filterValue) {
    document.querySelectorAll(`.filter-btn[data-filter-type="${filterType}"]`).forEach(btn => {
        if (btn.dataset.filterValue === filterValue) {
            btn.classList.add('bg-purple-600', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
        } else {
            btn.classList.remove('bg-purple-600', 'text-white');
            btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
        }
    });
}
