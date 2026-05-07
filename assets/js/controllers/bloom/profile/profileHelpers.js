export const editingState = {
    globalEditingId: null,
    globalSkillEditingIndex: -1,
    globalLanguageEditingIndex: -1
};

export function resetGlobalEditingIds() {
    editingState.globalEditingId = null;
    editingState.globalSkillEditingIndex = -1;
    editingState.globalLanguageEditingIndex = -1;
}

export function getYearOptions(selectedYear = '') {
    const currentYear = new Date().getFullYear();
    let options = '';
    for (let year = currentYear - 60; year <= currentYear + 10; year++) {
        options += `<option value="${year}" ${selectedYear == year ? 'selected' : ''}>${year}</option>`;
    }
    return options;
}

export const monthNames = {
    '01': 'January', '1': 'January', '02': 'February', '2': 'February',
    '03': 'March', '3': 'March', '04': 'April', '4': 'April',
    '05': 'May', '5': 'May', '06': 'June', '6': 'June',
    '07': 'July', '7': 'July', '08': 'August', '8': 'August',
    '09': 'September', '9': 'September', '10': 'October',
    '11': 'November', '12': 'December'
};

export function getMonthOptions(selectedMonth = '') {
    const months = [
        { value: '01', name: 'January' }, { value: '02', name: 'February' },
        { value: '03', name: 'March' }, { value: '04', name: 'April' },
        { value: '05', name: 'May' }, { value: '06', name: 'June' },
        { value: '07', name: 'July' }, { value: '08', name: 'August' },
        { value: '09', name: 'September' }, { value: '10', name: 'October' },
        { value: '11', name: 'November' }, { value: '12', name: 'December' }
    ];
    return months.map(month =>
        `<option value="${month.value}" ${selectedMonth == month.value ? 'selected' : ''}>${month.name}</option>`
    ).join('');
}

export function renderDateRangeSelectors(prefix, startDate = '', endDate = '', showPresent = false, isPresent = false, showEndDate = true) {
    let startYear = '', startMonth = '', endYear = '', endMonth = '';

    if (startDate && startDate !== 'Present') {
        const parts = startDate.split('-');
        if (parts.length === 2) {
            startYear = parts[0];
            startMonth = parts[1];
        }
    }

    if (endDate && endDate !== 'Present') {
        const parts = endDate.split('-');
        if (parts.length === 2) {
            endYear = parts[0];
            endMonth = parts[1];
        }
    }

    const endDateSection = showEndDate ? `
        <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">End:</span>
            <select id="${prefix}EndMonth" class="form-input w-32" ${isPresent ? 'disabled' : ''}>
                <option value="">Month</option>
                ${getMonthOptions(endMonth)}
            </select>
            <select id="${prefix}EndYear" class="form-input w-24" ${isPresent ? 'disabled' : ''}>
                <option value="">Year</option>
                ${getYearOptions(endYear)}
            </select>
        </div>
    ` : '';

    const presentCheckbox = showPresent ? `
        <label class="inline-flex items-center ml-4">
            <input type="checkbox" id="${prefix}Current" class="mr-2" ${isPresent ? 'checked' : ''}>
            <span class="text-sm text-gray-600">Current</span>
        </label>
    ` : '';

    return `
        <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">Start:</span>
                <select id="${prefix}StartMonth" class="form-input w-32">
                    <option value="">Month</option>
                    ${getMonthOptions(startMonth)}
                </select>
                <select id="${prefix}StartYear" class="form-input w-24">
                    <option value="">Year</option>
                    ${getYearOptions(startYear)}
                </select>
            </div>
            ${endDateSection}
            ${presentCheckbox}
        </div>
    `;
}

export function renderSingleDateSelectors(prefix, selectedDate = '') {
    let year = '', month = '', day = '';

    if (selectedDate) {
        const parts = selectedDate.split('-');
        if (parts.length === 3) {
            year = parts[0];
            month = parts[1];
            day = parts[2];
        }
    }

    return `
        <div class="flex gap-3">
            <select id="${prefix}Day" class="form-input w-24">
                <option value="">Day</option>
                ${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}" ${day == i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
            </select>
            <select id="${prefix}Month" class="form-input w-36">
                <option value="">Month</option>
                ${getMonthOptions(month)}
            </select>
            <select id="${prefix}Year" class="form-input w-24">
                <option value="">Year</option>
                ${getYearOptions(year)}
            </select>
        </div>
    `;
}

export function formatDate(dateStr) {
    if (!dateStr) return '';
    if (dateStr === 'Present') return 'Present';
    let year = '', month = '';
    const parts = dateStr.split('-');
    if (parts.length === 2) { year = parts[0]; month = parts[1]; }
    else if (parts.length === 3) { year = parts[0]; month = parts[1]; }
    const monthName = monthNames[month] || month;
    return monthName ? `${monthName} ${year}` : year;
}

export function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function getDateFromSelectors(prefix, isStart = true, isCurrent = false) {
    if (isCurrent) return 'Present';
    const month = document.getElementById(`${prefix}${isStart ? 'Start' : 'End'}Month`)?.value;
    const year = document.getElementById(`${prefix}${isStart ? 'Start' : 'End'}Year`)?.value;
    if (month && year) return `${year}-${month.padStart(2, '0')}`;
    return '';
}

export function getFullDateFromSelectors(prefix) {
    const day = document.getElementById(`${prefix}Day`)?.value;
    const month = document.getElementById(`${prefix}Month`)?.value;
    const year = document.getElementById(`${prefix}Year`)?.value;
    if (day && month && year) return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return '';
}

export function setDateRangeSelectors(prefix, startDate, endDate, isPresent = false) {
    if (startDate && startDate !== 'Present') {
        const parts = startDate.split('-');
        if (parts.length === 2) {
            const startMonth = document.getElementById(`${prefix}StartMonth`);
            const startYear = document.getElementById(`${prefix}StartYear`);
            if (startMonth) startMonth.value = parts[1];
            if (startYear) startYear.value = parts[0];
        }
    }
    if (endDate && endDate !== 'Present') {
        const parts = endDate.split('-');
        if (parts.length === 2) {
            const endMonth = document.getElementById(`${prefix}EndMonth`);
            const endYear = document.getElementById(`${prefix}EndYear`);
            if (endMonth) endMonth.value = parts[1];
            if (endYear) endYear.value = parts[0];
        }
    }
    const currentCheckbox = document.getElementById(`${prefix}Current`);
    if (currentCheckbox) {
        currentCheckbox.checked = isPresent;
        const endMonth = document.getElementById(`${prefix}EndMonth`);
        const endYear = document.getElementById(`${prefix}EndYear`);
        if (endMonth) endMonth.disabled = isPresent;
        if (endYear) endYear.disabled = isPresent;
        if (isPresent) {
            if (endMonth) endMonth.value = '';
            if (endYear) endYear.value = '';
        }
    }
}
