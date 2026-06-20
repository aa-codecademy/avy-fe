import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminStudentEditController(params = {}) {
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

    const editedSkills = [...(cv.skills || [])];
    const editedAcademy = (cv.academyAttendance || []).map(a => ({ ...a }));

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">

                    <div class="mb-6">
                        <a href="/admin/students/${studentId}" data-link
                            class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Student Profile
                        </a>
                    </div>

                    <div class="mb-7">
                        <h1 class="text-3xl font-bold text-gray-800 mb-1">
                            <i class="fas fa-user-edit text-purple-600 mr-3"></i>Edit Student Record
                        </h1>
                        <p class="text-sm text-gray-500">
                            Editing profile for
                            <span class="font-medium text-gray-700">${student.name}</span>
                        </p>
                    </div>

                    <div id="formError" class="hidden mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        <i class="fas fa-exclamation-circle mr-2"></i><span id="formErrorMsg"></span>
                    </div>

                    <!-- Account Details -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-5">
                            <i class="fas fa-id-card text-purple-500 mr-2"></i>Account Details
                        </h2>
                        <div class="grid md:grid-cols-2 gap-5">
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Full Name <span class="text-red-500">*</span></label>
                                <input type="text" id="editName" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${student.name}" placeholder="Full name" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Email Address <span class="text-red-500">*</span></label>
                                <input type="email" id="editEmail" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${student.email}" placeholder="email@example.com" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Phone Number</label>
                                <input type="tel" id="editPhone" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${student.phone || ''}" placeholder="+389 70 000 000" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Date of Birth</label>
                                <input type="date" id="editDateOfBirth" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${student.dateOfBirth || ''}" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Citizenship</label>
                                <input type="text" id="editCitizenship" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${student.citizenship || ''}" placeholder="e.g. Macedonian" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Current Position</label>
                                <input type="text" id="editCurrentPosition" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${student.currentPosition || ''}" placeholder="e.g. Frontend Developer Intern" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">LinkedIn Profile</label>
                                <input type="url" id="editLinkedIn" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${student.linkedIn || ''}" placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Portfolio / Website</label>
                                <input type="url" id="editPortfolio" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${student.portfolio || ''}" placeholder="https://yourportfolio.com" />
                            </div>
                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Profile Visibility</label>
                                <select id="editProfileVisibility" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                    <option value="public" ${student.profileVisibility === 'public' ? 'selected' : ''}>Public</option>
                                    <option value="private" ${student.profileVisibility === 'private' ? 'selected' : ''}>Private</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Programme Assignment -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex justify-between items-start mb-5">
                            <h2 class="text-xl font-bold text-gray-800">
                                <i class="fas fa-university text-purple-500 mr-2"></i>Programme Assignment
                            </h2>
                            <button id="addAcademyEntryBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm">
                                <i class="fas fa-plus mr-1"></i> Add Entry
                            </button>
                        </div>
                        <div id="academyEntriesList">
                            ${renderAcademyEntriesList(editedAcademy)}
                        </div>
                    </div>

                    <!-- Skills -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-5">
                            <i class="fas fa-code text-purple-500 mr-2"></i>Skills
                        </h2>
                        <div class="flex gap-2 mb-3">
                            <input type="text" id="editSkillInput" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" placeholder="Type a skill and press Enter..." />
                            <button id="addEditSkillBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white whitespace-nowrap">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        <div id="editSkillsList" class="flex flex-wrap gap-2">
                            ${renderEditSkillsList(editedSkills)}
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex items-center justify-end gap-3 pb-8">
                        <a href="/admin/students/${studentId}" data-link
                            class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white">
                            <i class="fas fa-times mr-1"></i> Cancel
                        </a>
                        <button id="saveChangesBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)]">
                            <i class="fas fa-save mr-2"></i> Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    setupEditListeners(studentId, cv, editedSkills, editedAcademy);
}

function renderAcademyEntriesList(entries) {
    if (entries.length === 0) {
        return `
            <p class="text-sm text-gray-400 italic py-2">
                No academy attendance recorded. Use "Add Entry" to assign a programme.
            </p>`;
    }

    const tracks = [
        'Frontend Development',
        'Backend Development',
        'QA Engineering',
        'Data Analytics',
        'UX/UI Design',
    ];

    return entries.map((a, idx) => `
        <div class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-semibold text-purple-700">
                    <i class="fas fa-university mr-1.5"></i>Entry ${idx + 1}
                </span>
                <button type="button"
                    class="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
                    onclick="removeEditAcademy(${idx})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="mb-2 block font-medium text-slate-700">Academy Name</label>
                    <input type="text" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] academy-name" data-idx="${idx}"
                        value="${a.academyName}" placeholder="e.g. Avenga Academy" />
                </div>
                <div>
                    <label class="mb-2 block font-medium text-slate-700">Track</label>
                    <select class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] academy-track" data-idx="${idx}">
                        ${tracks.map(t => `<option value="${t}" ${a.track === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="mb-2 block font-medium text-slate-700">Start Date</label>
                    <input type="date" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] academy-start" data-idx="${idx}" value="${a.startDate}" />
                </div>
                <div>
                    <label class="mb-2 block font-medium text-slate-700">End Date</label>
                    <input type="date" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] academy-end" data-idx="${idx}" value="${a.endDate}" />
                </div>
                <div>
                    <label class="mb-2 block font-medium text-slate-700">Status</label>
                    <select class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] academy-status" data-idx="${idx}">
                        <option value="active" ${a.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

function renderEditSkillsList(skills) {
    if (skills.length === 0) {
        return '<p class="text-sm text-gray-400 italic">No skills added yet.</p>';
    }
    return skills.map(skill => `
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm font-medium">
            ${skill}
            <button type="button" onclick="removeEditSkill('${skill}')"
                class="text-purple-400 hover:text-purple-700 transition leading-none">
                <i class="fas fa-times text-xs"></i>
            </button>
        </span>
    `).join('');
}

function collectAcademyFromDOM(editedAcademy) {
    for (let i = 0; i < editedAcademy.length; i++) {
        const nameEl = document.querySelector(`.academy-name[data-idx="${i}"]`);
        if (!nameEl) break;
        editedAcademy[i].academyName = nameEl.value;
        editedAcademy[i].track = document.querySelector(`.academy-track[data-idx="${i}"]`).value;
        editedAcademy[i].startDate = document.querySelector(`.academy-start[data-idx="${i}"]`).value;
        editedAcademy[i].endDate = document.querySelector(`.academy-end[data-idx="${i}"]`).value;
        editedAcademy[i].status = document.querySelector(`.academy-status[data-idx="${i}"]`).value;
    }
}

function showFormError(message) {
    const el = document.getElementById('formError');
    document.getElementById('formErrorMsg').textContent = message;
    el.classList.remove('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setupEditListeners(studentId, originalCV, editedSkills, editedAcademy) {
    // Skills — add
    const skillInput = document.getElementById('editSkillInput');
    document.getElementById('addEditSkillBtn').addEventListener('click', () => {
        const skill = skillInput.value.trim();
        if (skill && !editedSkills.includes(skill)) {
            editedSkills.push(skill);
            document.getElementById('editSkillsList').innerHTML = renderEditSkillsList(editedSkills);
            skillInput.value = '';
        }
    });
    skillInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('addEditSkillBtn').click();
        }
    });

    // Skills — remove (global for inline onclick)
    window.removeEditSkill = skill => {
        const idx = editedSkills.indexOf(skill);
        if (idx > -1) editedSkills.splice(idx, 1);
        document.getElementById('editSkillsList').innerHTML = renderEditSkillsList(editedSkills);
    };

    // Academy — add entry
    document.getElementById('addAcademyEntryBtn').addEventListener('click', () => {
        collectAcademyFromDOM(editedAcademy);
        editedAcademy.push({
            id: 'aa_new_' + Date.now(),
            academyName: 'Avenga Academy',
            track: 'Frontend Development',
            startDate: '',
            endDate: '',
            status: 'active',
        });
        document.getElementById('academyEntriesList').innerHTML = renderAcademyEntriesList(editedAcademy);
    });

    // Academy — remove entry (global for inline onclick)
    window.removeEditAcademy = idx => {
        collectAcademyFromDOM(editedAcademy);
        editedAcademy.splice(idx, 1);
        document.getElementById('academyEntriesList').innerHTML = renderAcademyEntriesList(editedAcademy);
    };

    // Save
    document.getElementById('saveChangesBtn').addEventListener('click', async () => {
        const name = document.getElementById('editName').value.trim();
        const email = document.getElementById('editEmail').value.trim();

        if (!name) {
            showFormError('Full name is required.');
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFormError('A valid email address is required.');
            return;
        }

        document.getElementById('formError').classList.add('hidden');

        // Capture latest DOM values for academy entries before saving
        collectAcademyFromDOM(editedAcademy);

        const btn = document.getElementById('saveChangesBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        await mockDataService.updateStudentProfile(studentId, {
            name,
            email,
            phone: document.getElementById('editPhone').value.trim(),
            dateOfBirth: document.getElementById('editDateOfBirth').value,
            citizenship: document.getElementById('editCitizenship').value.trim(),
            currentPosition: document.getElementById('editCurrentPosition').value.trim(),
            linkedIn: document.getElementById('editLinkedIn').value.trim(),
            portfolio: document.getElementById('editPortfolio').value.trim(),
            profileVisibility: document.getElementById('editProfileVisibility').value,
        });

        await mockDataService.updateCVProfile(studentId, {
            ...originalCV,
            skills: editedSkills,
            academyAttendance: editedAcademy,
        });

        window.router.navigate('/admin/students/' + studentId);
    });
}
