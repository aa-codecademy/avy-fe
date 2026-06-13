import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminStudentsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const students = await mockDataService.getStudentsWithProfiles();

    const allTracks = [...new Set(students.map(s => s.academyTrack).filter(Boolean))].sort();
    const pendingCount = students.filter(s => s.profileStatus === 'pending').length;

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                <i class="fas fa-user-graduate text-purple-600 mr-3"></i>
                                Student Directory
                            </h1>
                            <p class="text-gray-600">Search and filter all registered students</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 flex-shrink-0">
                            <a href="/admin/students/export" data-link
                                class="btn btn-secondary flex items-center gap-2">
                                <i class="fas fa-file-export"></i>Export
                            </a>
                            <a href="/admin/students/import" data-link
                                class="btn btn-primary flex items-center gap-2">
                                <i class="fas fa-file-import"></i>Import CSV
                            </a>
                        </div>
                    </div>

                    ${pendingCount > 0 ? `
                    <div class="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <i class="fas fa-clock text-amber-500 text-lg"></i>
                        <p class="text-sm text-amber-800 font-medium">
                            <span class="font-bold">${pendingCount} profile${pendingCount !== 1 ? 's' : ''}</span> awaiting review
                        </p>
                        <button
                            onclick="document.getElementById('filterStatus').value='pending'; document.getElementById('filterStatus').dispatchEvent(new Event('change'))"
                            class="ml-auto text-xs font-semibold text-amber-700 hover:text-amber-900 underline">
                            View pending
                        </button>
                    </div>` : ''}

                    <div class="grid lg:grid-cols-4 gap-6">
                        <!-- Filters sidebar -->
                        <div class="lg:col-span-1">
                            <div class="card sticky top-4">
                                <h3 class="text-lg font-bold text-gray-800 mb-4">
                                    <i class="fas fa-filter mr-2"></i>Filters
                                </h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="form-label">Search</label>
                                        <input
                                            type="text"
                                            id="searchStudents"
                                            class="form-input"
                                            placeholder="Name, email, skill..."
                                            autocomplete="off"
                                        />
                                    </div>
                                    <div>
                                        <label class="form-label">Academy Track</label>
                                        <select id="filterTrack" class="form-input">
                                            <option value="">All Tracks</option>
                                            ${allTracks.map(t => `<option value="${t}">${t}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label">Profile Visibility</label>
                                        <select id="filterVisibility" class="form-input">
                                            <option value="">All</option>
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label">Submission Status</label>
                                        <select id="filterStatus" class="form-input">
                                            <option value="">All</option>
                                            <option value="pending">Pending Review</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label">Account Status</label>
                                        <select id="filterAccountStatus" class="form-input">
                                            <option value="">All</option>
                                            <option value="active">Active</option>
                                            <option value="suspended">Suspended</option>
                                            <option value="deactivated">Deactivated</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label">Sort By</label>
                                        <select id="sortStudents" class="form-input">
                                            <option value="name">Name (A–Z)</option>
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                        </select>
                                    </div>
                                    <button id="clearFiltersBtn" class="btn btn-secondary w-full">
                                        <i class="fas fa-times mr-1"></i> Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Results panel -->
                        <div class="lg:col-span-3">
                            <div class="card mb-4">
                                <p class="text-gray-700 font-semibold">
                                    Showing <span id="studentCount">${students.length}</span> of ${students.length} students
                                </p>
                            </div>

                            <div id="studentsGrid" class="space-y-4">
                                ${renderStudentsGrid(students)}
                            </div>

                            <div id="noStudents" class="card text-center py-16 hidden">
                                <i class="fas fa-user-slash text-gray-300 text-6xl mb-4"></i>
                                <p class="text-gray-500 text-lg font-semibold">No students match your filters</p>
                                <p class="text-gray-400 text-sm mt-1">Try adjusting your search or clearing the filters</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupEventListeners(students);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function renderStudentsGrid(students) {
    if (students.length === 0) return '';
    return students.map(renderStudentCard).join('');
}

function renderStudentCard(student) {
    const isPrivate = student.profileVisibility === 'private';

    const visibilityBadge = isPrivate
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
               <i class="fas fa-lock mr-1"></i> Private
           </span>`
        : `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
               <i class="fas fa-eye mr-1"></i> Public
           </span>`;

    const statusBadgeConfig = {
        pending:  { icon: 'fa-clock',        cls: 'bg-amber-100 text-amber-700', label: 'Pending' },
        approved: { icon: 'fa-check-circle',  cls: 'bg-emerald-100 text-emerald-700', label: 'Approved' },
        rejected: { icon: 'fa-times-circle',  cls: 'bg-red-100 text-red-700',    label: 'Rejected' },
    };
    const statusCfg = statusBadgeConfig[student.profileStatus] || statusBadgeConfig.pending;
    const statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusCfg.cls}">
                             <i class="fas ${statusCfg.icon} mr-1"></i>${statusCfg.label}
                         </span>`;

    const accountStatusConfig = {
        active:      { icon: 'fa-check-circle', cls: 'bg-green-100 text-green-700',   label: 'Active' },
        suspended:   { icon: 'fa-pause-circle', cls: 'bg-orange-100 text-orange-700', label: 'Suspended' },
        deactivated: { icon: 'fa-ban',          cls: 'bg-red-100 text-red-700',        label: 'Deactivated' },
    };
    const acctStatus = student.accountStatus || 'active';
    const acctCfg = accountStatusConfig[acctStatus] || accountStatusConfig.active;
    const accountStatusBadge = acctStatus !== 'active'
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${acctCfg.cls}">
               <i class="fas ${acctCfg.icon} mr-1"></i>${acctCfg.label}
           </span>`
        : '';

    const trackColors = {
        'Frontend Development': 'bg-blue-100 text-blue-800',
        'Backend Development': 'bg-green-100 text-green-800',
        'QA Engineering': 'bg-yellow-100 text-yellow-800',
        'Data Analytics': 'bg-orange-100 text-orange-800',
        'UX/UI Design': 'bg-pink-100 text-pink-800',
    };
    const trackBadge = student.academyTrack
        ? `<span class="px-2 py-0.5 rounded-full text-xs font-semibold ${trackColors[student.academyTrack] || 'bg-purple-100 text-purple-800'}">
               <i class="fas fa-graduation-cap mr-1"></i>${student.academyTrack}
           </span>`
        : '';

    const skillChips = (student.skills || []).slice(0, 5).map(
        s => `<span class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">${s}</span>`
    ).join('');
    const extraSkills = (student.skills || []).length > 5
        ? `<span class="px-2 py-0.5 text-gray-400 text-xs">+${student.skills.length - 5} more</span>`
        : '';

    const joinedDate = new Date(student.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    const cardOpacity = acctStatus === 'deactivated' ? 'opacity-60' : '';

    return `
        <div class="card hover:shadow-xl transition duration-300 cursor-pointer ${cardOpacity}"
             onclick="window.router.navigate('/admin/students/${student.id}')">
            <div class="flex gap-5">
                <div class="flex-shrink-0">
                    <img src="${student.avatar}" alt="${student.name}"
                         class="w-16 h-16 rounded-full border-2 border-purple-200" />
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${student.name}</h3>
                            <p class="text-sm text-gray-500">${student.email}</p>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap">
                            ${trackBadge}
                            ${visibilityBadge}
                            ${statusBadge}
                            ${accountStatusBadge}
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">
                        <i class="fas fa-graduation-cap text-gray-400 mr-1"></i>
                        ${student.educationLabel || student.educationDegree || 'No degree listed'}
                    </p>
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${skillChips}${extraSkills}
                    </div>
                    <div class="flex items-center justify-between">
                        <p class="text-xs text-gray-400">
                            <i class="fas fa-calendar-alt mr-1"></i> Joined ${joinedDate}
                        </p>
                        <span class="text-xs text-purple-600 font-medium">
                            View Profile <i class="fas fa-arrow-right ml-1"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupEventListeners(allStudents) {
    let filtered = [...allStudents];
    const totalCount = allStudents.length;

    const updateDisplay = () => {
        const grid = document.getElementById('studentsGrid');
        const noResults = document.getElementById('noStudents');
        const count = document.getElementById('studentCount');

        count.textContent = filtered.length;

        if (filtered.length === 0) {
            grid.classList.add('hidden');
            noResults.classList.remove('hidden');
        } else {
            grid.classList.remove('hidden');
            noResults.classList.add('hidden');
            grid.innerHTML = renderStudentsGrid(filtered);
        }
    };

    const applyFilters = () => {
        const search = document.getElementById('searchStudents').value.toLowerCase().trim();
        const track = document.getElementById('filterTrack').value;
        const visibility = document.getElementById('filterVisibility').value;
        const status = document.getElementById('filterStatus').value;
        const accountStatus = document.getElementById('filterAccountStatus').value;
        const sort = document.getElementById('sortStudents').value;

        filtered = allStudents.filter(s => {
            const matchSearch = !search ||
                s.name.toLowerCase().includes(search) ||
                s.email.toLowerCase().includes(search) ||
                (s.skills || []).some(sk => sk.toLowerCase().includes(search)) ||
                (s.academyTrack || '').toLowerCase().includes(search) ||
                (s.educationLabel || '').toLowerCase().includes(search);

            const matchTrack = !track || s.academyTrack === track;
            const matchVisibility = !visibility || s.profileVisibility === visibility;
            const matchStatus = !status || s.profileStatus === status;
            const matchAccountStatus = !accountStatus || (s.accountStatus || 'active') === accountStatus;

            return matchSearch && matchTrack && matchVisibility && matchStatus && matchAccountStatus;
        });

        if (sort === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sort === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        updateDisplay();
    };

    let debounceTimer;
    document.getElementById('searchStudents').addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 250);
    });

    document.getElementById('filterTrack').addEventListener('change', applyFilters);
    document.getElementById('filterVisibility').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterAccountStatus').addEventListener('change', applyFilters);
    document.getElementById('sortStudents').addEventListener('change', applyFilters);

    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        document.getElementById('searchStudents').value = '';
        document.getElementById('filterTrack').value = '';
        document.getElementById('filterVisibility').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterAccountStatus').value = '';
        document.getElementById('sortStudents').value = 'name';
        filtered = [...allStudents];
        updateDisplay();
    });

    applyFilters();
}
