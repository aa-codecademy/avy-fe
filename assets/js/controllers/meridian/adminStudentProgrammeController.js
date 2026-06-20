import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

const TRACKS = [
    'Frontend Development',
    'Backend Development',
    'QA Engineering',
    'Data Analytics',
    'UX/UI Design',
];

const trackColors = {
    'Frontend Development': 'bg-blue-100 text-blue-800',
    'Backend Development':  'bg-green-100 text-green-800',
    'QA Engineering':       'bg-yellow-100 text-yellow-800',
    'Data Analytics':       'bg-orange-100 text-orange-800',
    'UX/UI Design':         'bg-pink-100 text-pink-800',
};

export default async function adminStudentProgrammeController(params = {}) {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const studentId = params.id;
    const [student, cv] = await Promise.all([
        mockDataService.getUserById(studentId),
        mockDataService.getCVProfile(studentId)
    ]);

    if (!student || student.role !== 'student') {
        window.router.navigate('/404');
        return;
    }

    const primaryProgramme = (cv.academyAttendance || [])[0] || null;
    const hasProgramme = !!primaryProgramme;

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="max-w-3xl mx-auto fade-in">

                    <div class="mb-6">
                        <a href="/admin/students/${studentId}" data-link
                            class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Student Profile
                        </a>
                    </div>

                    <div class="mb-7">
                        <h1 class="text-3xl font-bold text-gray-800 mb-1">
                            <i class="fas fa-graduation-cap text-purple-600 mr-3"></i>${hasProgramme ? 'Change' : 'Assign'} Academy Programme
                        </h1>
                        <p class="text-sm text-gray-500">
                            ${hasProgramme ? 'Updating' : 'Assigning'} programme for
                            <span class="font-medium text-gray-700">${student.name}</span>
                        </p>
                    </div>

                    <div id="formError" class="hidden mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        <i class="fas fa-exclamation-circle mr-2"></i><span id="formErrorMsg"></span>
                    </div>

                    <!-- Student Info Banner -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex items-center gap-4">
                            <img src="${student.avatar}" alt="${student.name}"
                                 class="w-14 h-14 rounded-full border-2 border-purple-200 flex-shrink-0" />
                            <div class="flex-1 min-w-0">
                                <p class="font-bold text-gray-800">${student.name}</p>
                                <p class="text-sm text-gray-500 truncate">${student.email}</p>
                            </div>
                            ${hasProgramme
                                ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${trackColors[primaryProgramme.track] || 'bg-purple-100 text-purple-800'} flex-shrink-0">
                                       <i class="fas fa-graduation-cap mr-1.5"></i>${primaryProgramme.track}
                                   </span>`
                                : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 flex-shrink-0">
                                       <i class="fas fa-question-circle mr-1.5"></i>No Programme
                                   </span>`
                            }
                        </div>
                    </div>

                    ${hasProgramme ? renderCurrentProgrammeCard(primaryProgramme) : ''}

                    <!-- Assignment Form -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-5">
                            <i class="fas fa-university text-purple-500 mr-2"></i>${hasProgramme ? 'Change Programme' : 'Assign Programme'}
                        </h2>
                        ${hasProgramme
                            ? `<div class="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                   <i class="fas fa-info-circle mr-2"></i>
                                   This will update the student's primary programme. The change will be reflected in their dashboard content, resource recommendations, and employer matching.
                               </div>`
                            : `<div class="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                                   <i class="fas fa-info-circle mr-2"></i>
                                   Assigning a programme will personalise this student's dashboard content, resource recommendations, and employer matching.
                               </div>`
                        }
                        <div class="grid md:grid-cols-2 gap-5">
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Academy Name <span class="text-red-500">*</span></label>
                                <input type="text" id="progAcademyName" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                                    value="${hasProgramme ? primaryProgramme.academyName : 'Avenga Academy'}"
                                    placeholder="e.g. Avenga Academy" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Track <span class="text-red-500">*</span></label>
                                <select id="progTrack" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                    ${TRACKS.map(t => `<option value="${t}" ${hasProgramme && primaryProgramme.track === t ? 'selected' : ''}>${t}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Start Date</label>
                                <input type="date" id="progStartDate" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                                    value="${hasProgramme ? primaryProgramme.startDate : ''}" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">
                                    End Date
                                    <span class="text-gray-400 font-normal text-xs">(leave blank if active)</span>
                                </label>
                                <input type="date" id="progEndDate" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                                    value="${hasProgramme ? primaryProgramme.endDate : ''}" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Status</label>
                                <select id="progStatus" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                    <option value="active" ${!hasProgramme || primaryProgramme.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="completed" ${hasProgramme && primaryProgramme.status === 'completed' ? 'selected' : ''}>Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex items-center justify-end gap-3 pb-8">
                        <a href="/admin/students/${studentId}" data-link
                            class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white">
                            <i class="fas fa-times mr-1"></i> Cancel
                        </a>
                        <button id="saveProgrammeBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)]">
                            <i class="fas fa-save mr-2"></i>${hasProgramme ? 'Save Changes' : 'Assign Programme'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    setupProgrammeListeners(studentId, primaryProgramme);
}

function renderCurrentProgrammeCard(programme) {
    const formatDate = d => d
        ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Present';

    const statusBadge = programme.status === 'active'
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
               <i class="fas fa-circle text-blue-400 mr-1" style="font-size:6px"></i>Active
           </span>`
        : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
               <i class="fas fa-check-circle mr-1"></i>Completed
           </span>`;

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6 border border-purple-200 bg-purple-50">
            <h3 class="text-sm font-bold text-gray-700 mb-3">
                <i class="fas fa-graduation-cap text-purple-500 mr-2"></i>Current Programme
            </h3>
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p class="font-semibold text-gray-800">${programme.academyName}</p>
                    <p class="text-sm text-gray-600 mt-1">
                        <span class="inline-block px-2 py-0.5 rounded text-xs font-medium ${trackColors[programme.track] || 'bg-purple-100 text-purple-800'}">
                            ${programme.track}
                        </span>
                    </p>
                    <p class="text-xs text-gray-400 mt-1.5">
                        <i class="fas fa-calendar mr-1"></i>${formatDate(programme.startDate)} – ${formatDate(programme.endDate)}
                    </p>
                </div>
                ${statusBadge}
            </div>
        </div>
    `;
}

function showFormError(message) {
    const el = document.getElementById('formError');
    document.getElementById('formErrorMsg').textContent = message;
    el.classList.remove('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setupProgrammeListeners(studentId, existingProgramme) {
    document.getElementById('saveProgrammeBtn').addEventListener('click', async () => {
        const academyName = document.getElementById('progAcademyName').value.trim();

        if (!academyName) {
            showFormError('Academy name is required.');
            return;
        }

        document.getElementById('formError').classList.add('hidden');

        const btn = document.getElementById('saveProgrammeBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        await mockDataService.assignStudentProgramme(studentId, {
            id: existingProgramme?.id || 'aa_prog_' + Date.now(),
            academyName,
            track: document.getElementById('progTrack').value,
            startDate: document.getElementById('progStartDate').value,
            endDate: document.getElementById('progEndDate').value,
            status: document.getElementById('progStatus').value,
        });

        window.router.navigate('/admin/students/' + studentId);
    });
}
