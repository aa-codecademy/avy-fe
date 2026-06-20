import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

const REQUIRED_COLS = ['name', 'email'];
const ALL_COLS = [
    'name',
    'email',
    'phone',
    'dateOfBirth',
    'citizenship',
    'academyTrack',
    'academyName',
    'academyStartDate',
    'academyEndDate',
    'educationDegree',
];

const COL_LABELS = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    dateOfBirth: 'Date of Birth',
    citizenship: 'Citizenship',
    academyTrack: 'Academy Track',
    academyName: 'Academy Name',
    academyStartDate: 'Start Date',
    academyEndDate: 'End Date',
    educationDegree: 'Education Degree',
};

const SAMPLE_CSV = [
    ALL_COLS.join(','),
    'James Wilson,james.wilson@example.com,+44 7700 900001,2000-03-15,British,Frontend Development,Avenga Academy,2025-02-01,2025-05-31,Bachelor in Computer Science',
    'Emma Thompson,emma.thompson@example.com,+44 7700 900002,2001-07-22,British,UX/UI Design,Avenga Academy,2025-02-01,2025-05-31,Bachelor in Graphic Design',
].join('\n');

export default async function adminStudentImportController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    renderImportPage(app, user);
}

function renderImportPage(app, user) {
    app.innerHTML = `
        ${renderAppHeader(user, '/admin/students')}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">

                    <div class="mb-6">
                        <a href="/admin/students" data-link
                            class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Student Directory
                        </a>
                    </div>

                    <div class="mb-7">
                        <h1 class="text-3xl font-bold text-gray-800 mb-1">
                            <i class="fas fa-file-import text-purple-600 mr-3"></i>Bulk Import Students
                        </h1>
                        <p class="text-gray-500 text-sm">Upload a CSV file to create multiple student accounts at once.</p>
                    </div>

                    <!-- Format Guide -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-3">
                            <i class="fas fa-info-circle text-blue-500 mr-2"></i>CSV Format Guide
                        </h2>
                        <p class="text-sm text-gray-600 mb-3">
                            Your file must include a header row with column names.
                            <span class="text-red-600 font-medium">name</span> and
                            <span class="text-red-600 font-medium">email</span> are required.
                            All other columns are optional.
                        </p>
                        <div class="overflow-x-auto mb-4">
                            <table class="text-xs w-full border-collapse">
                                <thead>
                                    <tr class="bg-gray-100">
                                        ${ALL_COLS.map(
                                            (col) => `
                                            <th class="border border-gray-200 px-2 py-2 text-left font-semibold whitespace-nowrap ${REQUIRED_COLS.includes(col) ? 'text-red-600' : 'text-gray-600'}">
                                                ${COL_LABELS[col]}${REQUIRED_COLS.includes(col) ? ' *' : ''}
                                            </th>`
                                        ).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="text-gray-400 italic bg-white">
                                        <td class="border border-gray-200 px-2 py-1.5">Test Name</td>
                                        <td class="border border-gray-200 px-2 py-1.5">test@example.com</td>
                                        <td class="border border-gray-200 px-2 py-1.5">+389 70 111 222</td>
                                        <td class="border border-gray-200 px-2 py-1.5">2001-04-12</td>
                                        <td class="border border-gray-200 px-2 py-1.5">Macedonian</td>
                                        <td class="border border-gray-200 px-2 py-1.5">Frontend Development</td>
                                        <td class="border border-gray-200 px-2 py-1.5">Avenga Academy</td>
                                        <td class="border border-gray-200 px-2 py-1.5">2025-02-01</td>
                                        <td class="border border-gray-200 px-2 py-1.5">2025-05-31</td>
                                        <td class="border border-gray-200 px-2 py-1.5">Bachelor in CS</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button id="downloadSampleBtn"
                            class="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition">
                            <i class="fas fa-download"></i> Download sample CSV
                        </button>
                    </div>

                    <!-- Upload Zone -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">
                            <i class="fas fa-upload text-purple-500 mr-2"></i>Upload File
                        </h2>
                        <div id="dropZone"
                            class="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
                            <i class="fas fa-file-csv text-5xl text-gray-300 mb-4 block"></i>
                            <p class="text-gray-600 font-medium mb-1">Drag & drop your CSV file here</p>
                            <p class="text-gray-400 text-sm mb-4">or</p>
                            <label for="csvFileInput"
                                class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] cursor-pointer inline-flex items-center gap-2">
                                <i class="fas fa-folder-open"></i>Browse file
                            </label>
                            <input type="file" id="csvFileInput" accept=".csv,text/csv" class="hidden" />
                            <p class="text-gray-400 text-xs mt-4">Accepted format: .csv — UTF-8 encoded</p>
                        </div>
                        <div id="fileInfo" class="hidden mt-4 flex items-center gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <i class="fas fa-file-csv text-purple-500 text-xl flex-shrink-0"></i>
                            <div class="flex-1 min-w-0">
                                <p id="fileName" class="text-sm font-semibold text-gray-800 truncate"></p>
                                <p id="fileSize" class="text-xs text-gray-500"></p>
                            </div>
                            <button id="clearFileBtn" class="text-gray-400 hover:text-red-500 transition flex-shrink-0">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div id="parseError" class="hidden mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            <i class="fas fa-exclamation-circle mr-2"></i><span id="parseErrorMsg"></span>
                        </div>
                    </div>

                    <!-- Preview & Import -->
                    <div id="previewSection" class="hidden">
                        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-lg font-bold text-gray-800">
                                    <i class="fas fa-table text-purple-500 mr-2"></i>Preview
                                </h2>
                                <span id="previewBadge" class="text-sm text-gray-500"></span>
                            </div>
                            <div id="validationSummary" class="hidden mb-4"></div>
                            <div class="overflow-x-auto">
                                <table class="text-sm w-full border-collapse">
                                    <thead>
                                        <tr class="bg-gray-50">
                                            <th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold">#</th>
                                            ${ALL_COLS.map((col) => `<th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold whitespace-nowrap">${COL_LABELS[col]}</th>`).join('')}
                                            <th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody id="previewBody"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="flex gap-4 items-center">
                            <button id="importBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] flex items-center gap-2">
                                <i class="fas fa-file-import"></i>
                                <span id="importBtnLabel">Import Students</span>
                            </button>
                            <button id="cancelImportBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white">
                                <i class="fas fa-times mr-2"></i>Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    setupEventListeners(app, user);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function setupEventListeners(app, user) {
    let parsedRows = [];

    const fileInput = document.getElementById('csvFileInput');
    const dropZone = document.getElementById('dropZone');

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        const item = e.dataTransfer.items[0];
        const type = item ? item.type : '';
        // Browsers often return '' for file MIME during dragover (security sandbox).
        // We can only reliably detect "definitely not CSV" when a non-text type is exposed.
        const definitelyWrong = type && type !== 'text/csv' && type !== 'text/plain' && !type.startsWith('text/');
        dropZone.classList.remove('border-purple-400', 'bg-purple-50', 'border-red-400', 'bg-red-50');
        dropZone.classList.add(
            definitelyWrong ? 'border-red-400' : 'border-purple-400',
            definitelyWrong ? 'bg-red-50'      : 'bg-purple-50'
        );
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-purple-400', 'bg-purple-50', 'border-red-400', 'bg-red-50');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-purple-400', 'bg-purple-50', 'border-red-400', 'bg-red-50');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    document.getElementById('clearFileBtn').addEventListener('click', () => {
        fileInput.value = '';
        parsedRows = [];
        showFileInfo(null);
        showParseError(null);
        document.getElementById('previewSection').classList.add('hidden');
    });

    document.getElementById('downloadSampleBtn').addEventListener('click', () => {
        downloadCSV(SAMPLE_CSV, 'avy_student_import_sample.csv');
    });

    document.getElementById('cancelImportBtn').addEventListener('click', () => {
        fileInput.value = '';
        parsedRows = [];
        showFileInfo(null);
        showParseError(null);
        document.getElementById('previewSection').classList.add('hidden');
    });

    document.getElementById('importBtn').addEventListener('click', async () => {
        const validRows = parsedRows.filter((r) => r._errors.length === 0);
        const invalidRows = parsedRows.filter((r) => r._errors.length > 0);
        if (validRows.length === 0) return;

        const btn = document.getElementById('importBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Importing...';

        const results = await mockDataService.bulkImportStudents(validRows);
        results.failed = [
            ...invalidRows.map((row) => ({ row, reason: row._errors.join('; ') })),
            ...results.failed,
        ];
        renderResultsView(app, user, results, parsedRows.length);
    });

    function handleFile(file) {
        const ext = file.name.toLowerCase().split('.').pop();

        if (ext !== 'csv') {
            showParseError(`Invalid file type (.${ext}). Please upload a .csv file.`);
            showFileInfo(null);
            return;
        }

        const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
        if (file.size > MAX_SIZE) {
            showParseError(`File is too large (${formatBytes(file.size)}). Maximum allowed size is 5 MB.`);
            showFileInfo(null);
            return;
        }

        showFileInfo(file);
        showParseError(null);
        document.getElementById('previewSection').classList.add('hidden');

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target.result;
                // Null bytes indicate a binary file renamed to .csv
                if (text.includes('\0')) {
                    throw new Error('This file appears to be binary, not a CSV. Please export your data as a plain .csv file.');
                }
                const existingUsers = await mockDataService.getAllUsers();
                const existingEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));
                parsedRows = parseCSV(text, existingEmails);
                renderPreview(parsedRows);
            } catch (err) {
                showParseError(err.message);
                showFileInfo(null);
                parsedRows = [];
                document.getElementById('previewSection').classList.add('hidden');
            }
        };
        reader.readAsText(file, 'UTF-8');
    }
}

function parseCSV(text, existingEmails = new Set()) {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV file must contain a header row and at least one data row.');
    }

    const headers = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase());

    const missingCols = REQUIRED_COLS.filter((c) => !headers.includes(c));
    if (missingCols.length > 0) {
        throw new Error(`Missing required columns: ${missingCols.join(', ')}`);
    }

    const seenEmails = new Set();

    return lines
        .slice(1)
        .filter((l) => l.trim())
        .map((line, i) => {
            const values = splitCSVLine(line);
            const row = { _rowNum: i + 2, _errors: [] };

            headers.forEach((h, idx) => {
                row[h] = (values[idx] || '').trim();
            });

            if (!row.name) row._errors.push('Name is required');

            if (!row.email) {
                row._errors.push('Email is required');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
                row._errors.push('Invalid email format');
            } else if (existingEmails.has(row.email.toLowerCase())) {
                row._errors.push('Email already registered in the system');
            } else if (seenEmails.has(row.email.toLowerCase())) {
                row._errors.push('Duplicate email within this file');
            } else {
                seenEmails.add(row.email.toLowerCase());
            }

            return row;
        });
}

// RFC 4180-compatible CSV field splitter
function splitCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

function renderPreview(rows) {
    const validCount = rows.filter((r) => r._errors.length === 0).length;
    const invalidCount = rows.length - validCount;

    document.getElementById('previewBadge').textContent =
        `${rows.length} row${rows.length !== 1 ? 's' : ''} parsed`;

    const summary = document.getElementById('validationSummary');
    if (invalidCount > 0) {
        summary.innerHTML = `
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <strong>${invalidCount} row${invalidCount !== 1 ? 's' : ''}</strong>
                ${invalidCount !== 1 ? 'have' : 'has'} validation errors and will be skipped.
                ${
                    validCount > 0
                        ? `<strong>${validCount} valid row${validCount !== 1 ? 's' : ''}</strong> will be imported.`
                        : '<strong>No rows</strong> can be imported.'
                }
            </div>`;
        summary.classList.remove('hidden');
    } else {
        summary.classList.add('hidden');
    }

    document.getElementById('previewBody').innerHTML = rows
        .map((row) => {
            const hasError = row._errors.length > 0;
            const cells = ALL_COLS.map((col) => {
                const val = row[col] || '';
                return `<td class="border border-gray-200 px-3 py-2 text-gray-700 max-w-xs truncate" title="${escapeHtml(val)}">${escapeHtml(val)}</td>`;
            }).join('');
            const statusCell = hasError
                ? `<td class="border border-gray-200 px-3 py-2 min-w-32">
                   <span class="text-xs font-medium text-red-700"><i class="fas fa-times-circle mr-1"></i>Error</span>
                   <p class="text-xs text-red-500 mt-0.5">${escapeHtml(row._errors.join('; '))}</p>
               </td>`
                : `<td class="border border-gray-200 px-3 py-2">
                   <span class="text-xs font-medium text-emerald-700"><i class="fas fa-check-circle mr-1"></i>Ready</span>
               </td>`;

            return `<tr class="${hasError ? 'bg-red-50' : 'bg-white'}">
            <td class="border border-gray-200 px-3 py-2 text-gray-400 text-xs">${row._rowNum}</td>
            ${cells}
            ${statusCell}
        </tr>`;
        })
        .join('');

    const importBtn = document.getElementById('importBtn');
    document.getElementById('importBtnLabel').textContent =
        validCount > 0
            ? `Import ${validCount} Student${validCount !== 1 ? 's' : ''}`
            : 'Import Students';
    importBtn.disabled = validCount === 0;
    importBtn.classList.toggle('opacity-50', validCount === 0);
    importBtn.classList.toggle('cursor-not-allowed', validCount === 0);

    document.getElementById('previewSection').classList.remove('hidden');
}

function renderResultsView(app, user, results, totalParsed) {
    const { created, failed } = results;

    app.innerHTML = `
        ${renderAppHeader(user, '/admin/students')}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">

                    <div class="mb-7">
                        <h1 class="text-3xl font-bold text-gray-800 mb-1">
                            <i class="fas fa-file-import text-purple-600 mr-3"></i>Import Complete
                        </h1>
                        <p class="text-gray-500 text-sm">Summary of the bulk import operation.</p>
                    </div>

                    <div class="grid md:grid-cols-3 gap-4 mb-6">
                        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center">
                            <div class="text-3xl font-bold text-gray-700 mb-1">${totalParsed}</div>
                            <p class="text-sm text-gray-500">Rows in CSV</p>
                        </div>
                        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center" style="border-left: 4px solid #10b981;">
                            <div class="text-3xl font-bold text-emerald-600 mb-1">${created.length}</div>
                            <p class="text-sm text-gray-500">Accounts created</p>
                        </div>
                        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center" style="border-left: 4px solid ${failed.length > 0 ? '#ef4444' : '#e5e7eb'};">
                            <div class="text-3xl font-bold ${failed.length > 0 ? 'text-red-500' : 'text-gray-400'} mb-1">${failed.length}</div>
                            <p class="text-sm text-gray-500">Skipped / failed</p>
                        </div>
                    </div>

                    ${
                        created.length > 0
                            ? `
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">
                            <i class="fas fa-check-circle text-emerald-500 mr-2"></i>Successfully Created (${created.length})
                        </h2>
                        <div class="overflow-x-auto">
                            <table class="text-sm w-full border-collapse">
                                <thead>
                                    <tr class="bg-gray-50">
                                        <th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold">Name</th>
                                        <th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold">Email</th>
                                        <th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold">Account</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${created
                                        .map(
                                            (s) => `
                                    <tr class="bg-white">
                                        <td class="border border-gray-200 px-3 py-2">
                                            <a href="/admin/students/${s.id}" data-link
                                               class="text-purple-600 hover:text-purple-800 font-medium">${escapeHtml(s.name)}</a>
                                        </td>
                                        <td class="border border-gray-200 px-3 py-2 text-gray-600">${escapeHtml(s.email)}</td>
                                        <td class="border border-gray-200 px-3 py-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                                <i class="fas fa-check-circle mr-1"></i>Active
                                            </span>
                                        </td>
                                    </tr>`
                                        )
                                        .join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`
                            : ''
                    }

                    ${
                        failed.length > 0
                            ? `
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">
                            <i class="fas fa-times-circle text-red-500 mr-2"></i>Skipped Rows (${failed.length})
                        </h2>
                        <div class="overflow-x-auto">
                            <table class="text-sm w-full border-collapse">
                                <thead>
                                    <tr class="bg-gray-50">
                                        <th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold">Name</th>
                                        <th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold">Email</th>
                                        <th class="border border-gray-200 px-3 py-2 text-left text-gray-600 font-semibold">Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${failed
                                        .map(
                                            (f) => `
                                    <tr class="bg-red-50">
                                        <td class="border border-gray-200 px-3 py-2 text-gray-700">${escapeHtml(f.row.name || '—')}</td>
                                        <td class="border border-gray-200 px-3 py-2 text-gray-700">${escapeHtml(f.row.email || '—')}</td>
                                        <td class="border border-gray-200 px-3 py-2 text-red-600 text-xs">${escapeHtml(f.reason)}</td>
                                    </tr>`
                                        )
                                        .join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`
                            : ''
                    }

                    <div class="flex flex-wrap gap-4">
                        <a href="/admin/students" data-link class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)]">
                            <i class="fas fa-users mr-2"></i>View Student Directory
                        </a>
                        <a href="/admin/students/import" data-link class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white">
                            <i class="fas fa-file-import mr-2"></i>Import Another File
                        </a>
                    </div>

                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function showFileInfo(file) {
    const info = document.getElementById('fileInfo');
    if (!file) {
        info.classList.add('hidden');
        return;
    }
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatBytes(file.size);
    info.classList.remove('hidden');
}

function showParseError(msg) {
    const el = document.getElementById('parseError');
    if (!msg) {
        el.classList.add('hidden');
        return;
    }
    document.getElementById('parseErrorMsg').textContent = msg;
    el.classList.remove('hidden');
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
