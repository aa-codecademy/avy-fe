import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

const EXPORT_COLUMNS = [
    // Account Info
    { key: 'name', label: 'Name', group: 'Account Info', checked: true },
    { key: 'email', label: 'Email', group: 'Account Info', checked: true },
    { key: 'phone', label: 'Phone', group: 'Account Info', checked: false },
    { key: 'dateOfBirth', label: 'Date of Birth', group: 'Account Info', checked: false },
    { key: 'citizenship', label: 'Citizenship', group: 'Account Info', checked: false },
    { key: 'accountStatus', label: 'Account Status', group: 'Account Info', checked: true },
    { key: 'profileStatus', label: 'Profile Status', group: 'Account Info', checked: true },
    { key: 'profileVisibility', label: 'Visibility', group: 'Account Info', checked: false },
    { key: 'currentPosition', label: 'Current Position', group: 'Account Info', checked: false },
    { key: 'linkedIn', label: 'LinkedIn', group: 'Account Info', checked: false },
    { key: 'portfolio', label: 'Portfolio', group: 'Account Info', checked: false },
    { key: 'createdAt', label: 'Joined Date', group: 'Account Info', checked: true },
    // Academy Programme
    { key: 'academyTrack', label: 'Academy Track', group: 'Academy Programme', checked: true },
    { key: 'academyName', label: 'Academy Name', group: 'Academy Programme', checked: false },
    { key: 'academyStartDate', label: 'Start Date', group: 'Academy Programme', checked: false },
    { key: 'academyEndDate', label: 'End Date', group: 'Academy Programme', checked: false },
    { key: 'academyStatus', label: 'Programme Status', group: 'Academy Programme', checked: false },
    // Education
    { key: 'educationDegree', label: 'Education Degree', group: 'Education', checked: true },
    { key: 'educationInstitution', label: 'Institution', group: 'Education', checked: false },
    { key: 'educationGrade', label: 'Grade', group: 'Education', checked: false },
    // Skills & Languages
    { key: 'skills', label: 'Skills', group: 'Skills & Languages', checked: true },
    { key: 'languages', label: 'Languages', group: 'Skills & Languages', checked: false },
];

const COL_GROUPS = [...new Set(EXPORT_COLUMNS.map((c) => c.group))];

export default async function adminStudentExportController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const allStudents = await mockDataService.getStudentsForExport();

    renderExportPage(app, user, allStudents);
}

function renderExportPage(app, user, allStudents) {
    const allTracks = [...new Set(allStudents.map((s) => s.academyTrack).filter(Boolean))].sort();

    app.innerHTML = `
        ${renderAppHeader(user, '/admin/students')}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">

                    <div class="mb-6">
                        <a href="/admin/students" data-link
                            class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Student Directory
                        </a>
                    </div>

                    <div class="mb-7">
                        <h1 class="text-3xl font-bold text-gray-800 mb-1">
                            <i class="fas fa-file-export text-purple-600 mr-3"></i>Export Student Data
                        </h1>
                        <p class="text-gray-500 text-sm">Download a filtered snapshot of the student directory as CSV or Excel.</p>
                    </div>

                    <!-- Filters -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">
                            <i class="fas fa-filter text-purple-500 mr-2"></i>Filter Students
                        </h2>
                        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Search</label>
                                <input type="text" id="exportSearch" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                                    placeholder="Name or email…" autocomplete="off" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Academy Track</label>
                                <select id="exportTrack" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                    <option value="">All Tracks</option>
                                    ${allTracks.map((t) => `<option value="${t}">${t}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Profile Visibility</label>
                                <select id="exportVisibility" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                    <option value="">All</option>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Submission Status</label>
                                <select id="exportStatus" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Account Status</label>
                                <select id="exportAccountStatus" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                    <option value="">All</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="deactivated">Deactivated</option>
                                </select>
                            </div>
                        </div>
                        <div class="mt-4 flex items-center gap-3">
                            <div id="exportMatchBadge" class="text-sm font-medium"></div>
                            <button id="clearExportFiltersBtn"
                                class="ml-auto text-xs font-semibold text-gray-500 hover:text-gray-700 transition">
                                <i class="fas fa-times mr-1"></i>Clear filters
                            </button>
                        </div>
                    </div>

                    <!-- Column Selection -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-gray-800">
                                <i class="fas fa-columns text-purple-500 mr-2"></i>Columns to Export
                            </h2>
                            <div class="flex items-center gap-3 text-xs font-semibold">
                                <button id="selectAllColsBtn"
                                    class="text-purple-600 hover:text-purple-800 transition">Select all</button>
                                <span class="text-gray-300">|</span>
                                <button id="clearAllColsBtn"
                                    class="text-gray-400 hover:text-gray-600 transition">Clear all</button>
                            </div>
                        </div>
                        <div class="space-y-5">
                            ${COL_GROUPS.map((group) => {
                                const cols = EXPORT_COLUMNS.filter((c) => c.group === group);
                                return `
                                <div>
                                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        ${group}
                                    </p>
                                    <div class="flex flex-wrap gap-2">
                                        ${cols
                                            .map(
                                                (col) => `
                                        <label
                                            id="colLabel-${col.key}"
                                            class="export-col-label inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition select-none ${col.checked ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}">
                                            <input
                                                type="checkbox"
                                                class="export-col-checkbox accent-purple-600"
                                                data-key="${col.key}"
                                                ${col.checked ? 'checked' : ''} />
                                            <span class="text-sm text-gray-700">${col.label}</span>
                                        </label>`
                                            )
                                            .join('')}
                                    </div>
                                </div>`;
                            }).join('')}
                        </div>
                        <div id="noColsWarning"
                            class="hidden mt-4 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                            <i class="fas fa-exclamation-triangle flex-shrink-0"></i>
                            Select at least one column to export.
                        </div>
                    </div>

                    <!-- Export Format -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">
                            <i class="fas fa-download text-purple-500 mr-2"></i>Export Format
                        </h2>
                        <div class="flex flex-wrap gap-4">
                            <label id="fmtLabel-csv"
                                class="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-purple-400 bg-purple-50 cursor-pointer transition">
                                <input type="radio" name="exportFormat" value="csv" checked
                                    class="accent-purple-600 w-4 h-4" />
                                <div>
                                    <p class="font-semibold text-gray-800 text-sm">
                                        <i class="fas fa-file-csv text-green-600 mr-1.5"></i>CSV
                                    </p>
                                    <p class="text-xs text-gray-500">UTF-8 encoded, works everywhere</p>
                                </div>
                            </label>
                            <label id="fmtLabel-excel"
                                class="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-gray-200 cursor-pointer transition hover:border-purple-200">
                                <input type="radio" name="exportFormat" value="excel"
                                    class="accent-purple-600 w-4 h-4" />
                                <div>
                                    <p class="font-semibold text-gray-800 text-sm">
                                        <i class="fas fa-file-excel text-emerald-600 mr-1.5"></i>Excel (.xls)
                                    </p>
                                    <p class="text-xs text-gray-500">Opens in Microsoft Excel &amp; LibreOffice</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- No-match warning -->
                    <div id="exportNoStudents"
                        class="hidden mb-6 flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <i class="fas fa-exclamation-triangle text-amber-500 flex-shrink-0"></i>
                        <p class="text-sm text-amber-800">
                            No students match your current filters. Adjust the filters to export data.
                        </p>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-wrap gap-4 items-center">
                        <button id="exportBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] flex items-center gap-2">
                            <i class="fas fa-download"></i>
                            <span id="exportBtnLabel">Export Students</span>
                        </button>
                        <a href="/admin/students" data-link class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white">
                            <i class="fas fa-times mr-2"></i>Cancel
                        </a>
                    </div>

                </div>
            </div>
        </div>
    `;

    setupEventListeners(allStudents);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function setupEventListeners(allStudents) {
    let filtered = [...allStudents];

    // ── Helpers ──────────────────────────────────────────────────────────────

    const getSelectedColumns = () =>
        EXPORT_COLUMNS.filter(
            (col) => document.querySelector(`.export-col-checkbox[data-key="${col.key}"]`)?.checked
        );

    const syncColLabel = (checkbox) => {
        const label = document.getElementById(`colLabel-${checkbox.dataset.key}`);
        if (!label) return;
        if (checkbox.checked) {
            label.classList.add('border-purple-400', 'bg-purple-50');
            label.classList.remove('border-gray-200');
        } else {
            label.classList.remove('border-purple-400', 'bg-purple-50');
            label.classList.add('border-gray-200');
        }
    };

    const syncFormatLabels = () => {
        document.querySelectorAll('input[name="exportFormat"]').forEach((radio) => {
            const label = document.getElementById(`fmtLabel-${radio.value}`);
            if (!label) return;
            if (radio.checked) {
                label.classList.add('border-purple-400', 'bg-purple-50');
                label.classList.remove('border-gray-200');
            } else {
                label.classList.remove('border-purple-400', 'bg-purple-50');
                label.classList.add('border-gray-200');
            }
        });
    };

    const updateUI = () => {
        const badge = document.getElementById('exportMatchBadge');
        const noStudents = document.getElementById('exportNoStudents');
        const noColsWarn = document.getElementById('noColsWarning');
        const exportBtn = document.getElementById('exportBtn');
        const btnLabel = document.getElementById('exportBtnLabel');
        const selectedCols = getSelectedColumns();
        const hasStudents = filtered.length > 0;
        const hasCols = selectedCols.length > 0;

        // Match badge
        if (hasStudents) {
            badge.innerHTML = `<span class="text-emerald-700">
                <i class="fas fa-users mr-1"></i>
                <strong>${filtered.length}</strong>
                student${filtered.length !== 1 ? 's' : ''} will be exported
            </span>`;
            noStudents.classList.add('hidden');
        } else {
            badge.innerHTML = `<span class="text-amber-600">
                <i class="fas fa-exclamation-triangle mr-1"></i>No students match
            </span>`;
            noStudents.classList.remove('hidden');
        }

        // Column warning
        noColsWarn.classList.toggle('hidden', hasCols);

        // Export button
        const canExport = hasStudents && hasCols;
        exportBtn.disabled = !canExport;
        exportBtn.classList.toggle('opacity-50', !canExport);
        exportBtn.classList.toggle('cursor-not-allowed', !canExport);

        btnLabel.textContent = hasStudents
            ? `Export ${filtered.length} Student${filtered.length !== 1 ? 's' : ''}`
            : 'Export Students';
    };

    // ── Filters ───────────────────────────────────────────────────────────────

    const applyFilters = () => {
        const search = document.getElementById('exportSearch').value.toLowerCase().trim();
        const track = document.getElementById('exportTrack').value;
        const visibility = document.getElementById('exportVisibility').value;
        const status = document.getElementById('exportStatus').value;
        const accountStatus = document.getElementById('exportAccountStatus').value;

        filtered = allStudents.filter((s) => {
            const matchSearch =
                !search ||
                s.name.toLowerCase().includes(search) ||
                s.email.toLowerCase().includes(search);
            const matchTrack = !track || s.academyTrack === track;
            const matchVisibility = !visibility || s.profileVisibility === visibility;
            const matchStatus = !status || s.profileStatus === status;
            const matchAccountStatus =
                !accountStatus || (s.accountStatus || 'active') === accountStatus;
            return (
                matchSearch && matchTrack && matchVisibility && matchStatus && matchAccountStatus
            );
        });

        updateUI();
    };

    let debounceTimer;
    document.getElementById('exportSearch').addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 250);
    });
    document.getElementById('exportTrack').addEventListener('change', applyFilters);
    document.getElementById('exportVisibility').addEventListener('change', applyFilters);
    document.getElementById('exportStatus').addEventListener('change', applyFilters);
    document.getElementById('exportAccountStatus').addEventListener('change', applyFilters);

    document.getElementById('clearExportFiltersBtn').addEventListener('click', () => {
        document.getElementById('exportSearch').value = '';
        document.getElementById('exportTrack').value = '';
        document.getElementById('exportVisibility').value = '';
        document.getElementById('exportStatus').value = '';
        document.getElementById('exportAccountStatus').value = '';
        filtered = [...allStudents];
        updateUI();
    });

    // ── Column checkboxes ────────────────────────────────────────────────────

    document.querySelectorAll('.export-col-checkbox').forEach((cb) => {
        cb.addEventListener('change', () => {
            syncColLabel(cb);
            updateUI();
        });
    });

    document.getElementById('selectAllColsBtn').addEventListener('click', () => {
        document.querySelectorAll('.export-col-checkbox').forEach((cb) => {
            cb.checked = true;
            syncColLabel(cb);
        });
        updateUI();
    });

    document.getElementById('clearAllColsBtn').addEventListener('click', () => {
        document.querySelectorAll('.export-col-checkbox').forEach((cb) => {
            cb.checked = false;
            syncColLabel(cb);
        });
        updateUI();
    });

    // ── Format radios ─────────────────────────────────────────────────────────

    document.querySelectorAll('input[name="exportFormat"]').forEach((radio) => {
        radio.addEventListener('change', syncFormatLabels);
    });

    // ── Export ───────────────────────────────────────────────────────────────

    document.getElementById('exportBtn').addEventListener('click', async () => {
        if (filtered.length === 0) return;
        const selectedCols = getSelectedColumns();
        if (selectedCols.length === 0) return;

        const btn = document.getElementById('exportBtn');
        const label = document.getElementById('exportBtnLabel');
        const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'csv';

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Exporting…';

        // Yield to browser paint before doing synchronous work
        await new Promise((r) => setTimeout(r, 30));

        try {
            const filename = `avy_students_${formatDateForFilename(new Date())}`;

            if (format === 'csv') {
                const csv = buildCSV(filtered, selectedCols);
                downloadBlob(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
            } else {
                const xls = buildXLS(filtered, selectedCols);
                downloadBlob(xls, `${filename}.xls`, 'application/vnd.ms-excel');
            }

            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Exported!';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = `<i class="fas fa-download mr-2"></i><span id="exportBtnLabel">${label?.textContent || 'Export Students'}</span>`;
                updateUI();
            }, 2000);
        } catch {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Export failed';
            setTimeout(() => {
                btn.innerHTML = `<i class="fas fa-download mr-2"></i><span id="exportBtnLabel"></span>`;
                updateUI();
            }, 2500);
        }
    });

    // ── Init ─────────────────────────────────────────────────────────────────
    updateUI();
}

// ── CSV / XLS generators ───────────────────────────────────────────────────────

function buildCSV(students, columns) {
    const BOM = '﻿'; // UTF-8 BOM so Excel opens it correctly
    const header = columns.map((c) => csvEscape(c.label)).join(',');
    const rows = students.map((s) => columns.map((c) => csvEscape(formatCell(s[c.key]))).join(','));
    return BOM + [header, ...rows].join('\r\n');
}

function buildXLS(students, columns) {
    // SpreadsheetML (Office 2003 XML) — natively opened by Excel and LibreOffice
    const headerRow = `<Row>
        ${columns.map((c) => `<Cell ss:StyleID="header"><Data ss:Type="String">${xmlEscape(c.label)}</Data></Cell>`).join('')}
    </Row>`;
    const dataRows = students
        .map(
            (s) =>
                `<Row>${columns.map((c) => `<Cell><Data ss:Type="String">${xmlEscape(formatCell(s[c.key]))}</Data></Cell>`).join('')}</Row>`
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Students">
    <Table>
      ${headerRow}
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;
}

// ── Value / escaping helpers ───────────────────────────────────────────────────

function formatCell(value) {
    if (value === null || value === undefined) return '';
    const str = String(value).trim();
    // Format ISO date strings to readable dates
    if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(str)) {
        const d = new Date(str);
        if (!isNaN(d))
            return d.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
    }
    return str;
}

function csvEscape(value) {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function xmlEscape(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ── Download helper ────────────────────────────────────────────────────────────

function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function formatDateForFilename(date) {
    return date.toISOString().slice(0, 10);
}
