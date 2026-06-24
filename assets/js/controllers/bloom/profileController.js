import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';
import {
    saveUserToLocalStorage,
    saveCVToLocalStorage,
} from '../../controllers/bloom/profile/profileStorage.js';
import {
    renderWorkExperienceList,
    renderEducationList,
    renderAcademyList,
    renderAdditionalEducationList,
    renderSkillsList,
    renderLanguagesList,
} from '../../controllers/bloom/profile/profileRenderer.js';
import { addModalHTML, showConfirmModal } from '../../controllers/bloom/profile/profileModals.js';
import {
    setupWorkExperienceEvents,
    setupEducationEvents,
    setupAcademyEvents,
    setupAdditionalEducationEvents,
    setupSkillsEvents,
    setupLanguageEvents,
    showToast,
} from '../../controllers/bloom/profile/profileEvents/index.js';
import {
    renderSingleDateSelectors,
    getFullDateFromSelectors,
    resetGlobalEditingIds,
    escapeHtml,
} from '../../controllers/bloom/profile/profileHelpers.js';

export default async function profileController() {
    const app = document.getElementById('app');
    let user = authService.getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    let cvProfile = await mockDataService.getCVProfile(user.id);

    cvProfile.workExperience = cvProfile.workExperience || [];
    cvProfile.education = cvProfile.education || [];
    cvProfile.academyAttendance = cvProfile.academyAttendance || [];
    cvProfile.additionalEducation = cvProfile.additionalEducation || [];
    cvProfile.skills = cvProfile.skills || [];
    cvProfile.languages = cvProfile.languages || [];

    resetGlobalEditingIds();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">
                    <div class="mb-8 flex justify-between items-center">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                <i class="fas fa-user-circle text-purple-600 mr-3"></i>
                                My Profile & CV
                            </h1>
                            <p class="text-gray-600">Manage your professional profile</p>
                        </div>
                        <button id="settingsBtn" class="btn btn-secondary">
                            <i class="fas fa-cog mr-2"></i> Settings
                        </button>
                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-id-card mr-2"></i>
                                Personal Information
                            </h2>
                            <button id="editPersonalInfoBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm">
                                <i class="fas fa-edit mr-1"></i> Edit
                            </button>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="md:col-span-2 flex items-center gap-4">
                                <img src="${user.avatar}" alt="${user.name}" class="w-24 h-24 rounded-full border-4 border-purple-200" />
                                <div>
                                    <input type="file" id="photoUpload" class="hidden" accept="image/*" />
                                    <label for="photoUpload" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm cursor-pointer">
                                        <i class="fas fa-camera mr-1"></i> Change Photo
                                    </label>
                                    <p class="text-xs text-gray-500 mt-1">Optional</p>
                                </div>
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Full Name *</label>
                                <input type="text" id="name" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.name}" />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Educational Degree *</label>
                                <input type="text" id="educationDegree" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.educationDegree || ''}" />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Current Position *</label>
                                <input type="text" id="currentPosition" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.currentPosition || ''}" />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Email *</label>
                                <input type="email" id="email" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.email}" readonly />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Phone Number</label>
                                <input type="tel" id="phone" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.phone || ''}" />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Date of Birth *</label>
                                <input type="date" id="dateOfBirth" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.dateOfBirth || ''}" />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Citizenship</label>
                                <input type="text" id="citizenship" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.citizenship || ''}" />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">LinkedIn Profile</label>
                                <input type="url" id="linkedIn" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.linkedIn || ''}" placeholder="https://linkedin.com/in/yourprofile" />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Portfolio Link</label>
                                <input type="url" id="portfolio" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" value="${user.portfolio || ''}" placeholder="https://yourportfolio.com" />
                            </div>

                            <div>
                                <label class="mb-2 block font-medium text-slate-700">Profile Visibility</label>
                                <select id="profileVisibility" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                    <option value="public" ${user.profileVisibility === 'public' ? 'selected' : ''}>Public</option>
                                    <option value="private" ${user.profileVisibility === 'private' ? 'selected' : ''}>Private (Companies need approval)</option>
                                </select>
                            </div>

                    <div id="settingsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                        <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                            <h3 class="text-2xl font-bold mb-4">Profile Settings</h3>
                            <div class="mb-4">
                                <label class="form-label">Profile Visibility</label>
                                <select id="modalProfileVisibility" class="form-input">
                                    <option value="public" ${user.profileVisibility === 'public' ? 'selected' : ''}>Public</option>
                                    <option value="private" ${user.profileVisibility === 'private' ? 'selected' : ''}>Private</option>
                                </select>
                                <p class="text-xs text-gray-500 mt-1">If profile is private, only required fields (*) are visible to companies</p>
                            </div>
                            <div class="flex justify-end gap-3">
                                <button id="closeSettingsModal" class="btn btn-secondary">Cancel</button>
                                <button id="saveSettingsBtn" class="btn btn-primary">Save Settings</button>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-id-card mr-2"></i>Personal Information</h2>
                            <button id="editProfileBtn" class="btn btn-secondary text-sm"><i class="fas fa-edit mr-1"></i> Edit</button>
                        </div>
                        <div id="personalInfoSection">
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="md:col-span-2 flex items-center gap-4">
                                    <img id="profileImage" src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=8b5cf6&color=fff'}" alt="${user.name}" class="w-24 h-24 rounded-full border-4 border-purple-200" />
                                    <div>
                                        <input type="file" id="photoUpload" class="hidden" accept="image/*" />
                                        <label id="photoUploadLabel" for="photoUpload" class="btn btn-secondary text-sm cursor-pointer hidden"><i class="fas fa-camera mr-1"></i> Change Photo</label>
                                        <p class="text-xs text-gray-500 mt-1">Optional</p>
                                    </div>
                                </div>
                            <div><label class="form-label">Full Name *</label><input type="text" id="name" class="form-input" value="${escapeHtml(user.name || '')}"/></div>
                            <div><label class="form-label">Educational Degree *</label><input type="text" id="educationDegree" class="form-input" value="${escapeHtml(user.educationDegree || '')}"/></div>
                            <div><label class="form-label">Current Position *</label><input type="text" id="currentPosition" class="form-input" value="${escapeHtml(user.currentPosition || '')}"/></div>
                            <div><label class="form-label">Email *</label><input type="email" id="email" class="form-input bg-gray-100" value="${escapeHtml(user.email)}" readonly /></div>
                            <div><label class="form-label">Phone Number</label><input type="tel" id="phone" class="form-input" value="${escapeHtml(user.phone || '')}" /></div>
                            <div><label class="form-label">Date of Birth *</label>${renderSingleDateSelectors('birth', user.dateOfBirth || '')}</div>
                            <div><label class="form-label">Citizenship</label><input type="text" id="citizenship" class="form-input" value="${escapeHtml(user.citizenship || '')}"/></div>
                            <div><label class="form-label">Address</label><input type="text" id="address" class="form-input" value="${escapeHtml(user.address || '')}"/></div>
                            <div><label class="form-label">LinkedIn Profile</label><input type="url" id="linkedIn" class="form-input" value="${escapeHtml(user.linkedIn || '')}" /></div>
                            <div><label class="form-label">Portfolio Link</label><input type="url" id="portfolio" class="form-input" value="${escapeHtml(user.portfolio || '')}"/></div>
                        </div>

                <div id="personalInfoActions" class="hidden mt-6 mb-10 flex justify-between items-center flex-wrap gap-3">
                    <div>
                        <button id="savePersonalInfoBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)]">
                            <i class="fas fa-save mr-2"></i> Save Personal Information
                        </button>
                    </div>

                    <div>
                        <button id="togglePasswordFormBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white">
                            <i class="fas fa-lock mr-2"></i> Change Password
                        </button>
                    </div>
                </div>

                <div id="changePasswordSection" class="hidden mt-4 p-4 bg-gray-50 rounded-lg">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="mb-2 block font-medium text-slate-700">Current Password *</label>
                            <input type="password" id="currentPassword" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" />
                        </div>

                        <div>
                            <label class="mb-2 block font-medium text-slate-700">New Password *</label>
                            <input type="password" id="newPassword" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" />
                        </div>

                        <div>
                            <label class="mb-2 block font-medium text-slate-700">Confirm New Password *</label>
                            <input type="password" id="confirmNewPassword" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" />
                        </div>
                    </div>

                    <button id="savePasswordBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] mt-4">
                        <i class="fas fa-check mr-2"></i> Update Password
                    </button>
                    <p id="passwordMessage" class="hidden mt-3 text-sm font-medium" aria-live="polite"></p>
                </div>

                    </div>

                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-briefcase mr-2"></i>Work Experience / Volunteering</h2>
                            <button id="addWorkExpBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> Add Work Experience</button>
                        </div>
                        <div id="workExperienceList">${renderWorkExperienceList(cvProfile.workExperience)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-graduation-cap mr-2"></i>Education *</h2>
                            <button id="addEducationBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> Add Education</button>
                        </div>
                        <div id="educationList">${renderEducationList(cvProfile.education)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-school mr-2"></i>Avenga Academy Attendance *</h2>
                            <button id="addAcademyBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> Add Academy Program</button>
                        </div>
                        <div id="academyList">${renderAcademyList(cvProfile.academyAttendance)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-plus-circle mr-2"></i>Additional Education / Training</h2>
                            <button id="addAdditionalEduBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> Add Training</button>
                        </div>
                        <div id="additionalEducationList">${renderAdditionalEducationList(cvProfile.additionalEducation)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-code mr-2"></i>Key Skills & Knowledge *</h2>
                            <button id="addSkillBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> Add Skill</button>
                        </div>
                        <div id="skillsList">${renderSkillsList(cvProfile.skills)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-language mr-2"></i>Language Knowledge</h2>
                            <button id="addLanguageBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> Add Language</button>
                        </div>
                        <div id="languagesList">${renderLanguagesList(cvProfile.languages)}</div>
                    </div>

                    <div class="card bg-gray-50 border border-gray-200">
                        <div class="text-center">
                            <p class="text-gray-700 font-semibold mb-4"><i class="fas fa-info-circle mr-2 text-purple-600"></i>Fields marked with * are required and visible to employers</p>
                            <button id="saveCVBtn" class="btn btn-primary text-lg px-8"><i class="fas fa-save mr-2"></i> Save Complete CV</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    addModalHTML();
    setupEventListeners(user, cvProfile);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function setupEventListeners(user, cvProfile) {
    const photoInput = document.getElementById('photoUpload');
    const profileImage = document.getElementById('profileImage');
    if (photoInput && profileImage) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profileImage.src = event.target.result;
                    user.avatar = event.target.result;
                    saveUserToLocalStorage(user);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            const visibilitySelect = document.getElementById('modalProfileVisibility');
            if (visibilitySelect) visibilitySelect.value = user.profileVisibility || 'public';
            settingsModal.classList.remove('hidden');
            settingsModal.classList.add('flex');
        });
        document.getElementById('closeSettingsModal')?.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
            settingsModal.classList.remove('flex');
        });
        document.getElementById('saveSettingsBtn')?.addEventListener('click', async () => {
            const newVisibility = document.getElementById('modalProfileVisibility').value;
            user.profileVisibility = newVisibility;
            saveUserToLocalStorage(user);
            settingsModal.classList.add('hidden');
            settingsModal.classList.remove('flex');
        });
    }

    const editProfileBtn = document.getElementById('editProfileBtn');
    const personalInfoSection = document.getElementById('personalInfoSection');
    let personalInfoEditing = false;

    function setPersonalInfoEditing(enabled) {
        personalInfoEditing = enabled;
        if (!personalInfoSection) return;

        personalInfoSection.querySelectorAll('input, select').forEach((field) => {
            if (field.id === 'email' || field.id === 'savePersonalInfoBtn') return;
            field.disabled = !enabled;
        });

        const photoUploadLabel = document.getElementById('photoUploadLabel');
        const personalInfoActions = document.getElementById('personalInfoActions');
        const changePasswordSection = document.getElementById('changePasswordSection');

        if (photoUploadLabel) {
            photoUploadLabel.classList.toggle('hidden', !enabled);
        }

        if (personalInfoActions) {
            personalInfoActions.classList.toggle('hidden', !enabled);
        }

        if (changePasswordSection && !enabled) {
            changePasswordSection.classList.add('hidden');
        }

        if (editProfileBtn) {
            editProfileBtn.innerHTML = enabled
                ? '<i class="fas fa-times mr-1"></i> Cancel'
                : '<i class="fas fa-edit mr-1"></i> Edit';
        }
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () =>
            setPersonalInfoEditing(!personalInfoEditing)
        );
    }

    setPersonalInfoEditing(false);

    document.getElementById('savePersonalInfoBtn').addEventListener('click', async () => {
        const btn = document.getElementById('savePersonalInfoBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
        const formattedBirthDate = getFullDateFromSelectors('birth');
        user.name = document.getElementById('name').value;
        user.educationDegree = document.getElementById('educationDegree').value;
        user.currentPosition = document.getElementById('currentPosition').value;
        user.phone = document.getElementById('phone').value;
        user.dateOfBirth = formattedBirthDate;
        user.citizenship = document.getElementById('citizenship').value;
        user.address = document.getElementById('address').value;
        user.linkedIn = document.getElementById('linkedIn').value;
        user.portfolio = document.getElementById('portfolio').value;
        saveUserToLocalStorage(user);
        btn.innerHTML = '<i class="fas fa-check mr-2"></i> Saved!';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Personal Information';
        }, 2000);
    });

    setupWorkExperienceEvents(cvProfile);
    setupEducationEvents(cvProfile);
    setupAcademyEvents(cvProfile);
    setupAdditionalEducationEvents(cvProfile);
    setupSkillsEvents(cvProfile);
    setupLanguageEvents(cvProfile);
    const passwordMessage = document.getElementById('passwordMessage');

    function showPasswordMessage(message, type = 'error') {
        passwordMessage.textContent = message;
        passwordMessage.className = 'mt-3 text-sm font-medium';

        if (type === 'success') {
            passwordMessage.classList.add('text-green-600');
        } else {
            passwordMessage.classList.add('text-red-600');
        }
    }

    function clearPasswordMessage() {
        passwordMessage.textContent = '';
        passwordMessage.className = 'hidden mt-3 text-sm font-medium';
    }

    const togglePasswordFormBtn = document.getElementById('togglePasswordFormBtn');
    const changePasswordSection = document.getElementById('changePasswordSection');
    if (togglePasswordFormBtn && changePasswordSection) {
        togglePasswordFormBtn.addEventListener('click', () => {
            changePasswordSection.classList.toggle('hidden');
            clearPasswordMessage();
        });
    }

    document.getElementById('savePasswordBtn').addEventListener('click', async () => {
        const currentPassword = document.getElementById('currentPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();
        const btn = document.getElementById('savePasswordBtn');

        clearPasswordMessage();

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showPasswordMessage('Please fill in all password fields.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showPasswordMessage('New passwords do not match.');
            return;
        }

        if (currentPassword === newPassword) {
            showPasswordMessage('New password must be different from current password.');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Updating...';

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            showPasswordMessage('Password updated successfully.', 'success');

            btn.innerHTML = '<i class="fas fa-check mr-2"></i> Password Updated!';
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-check mr-2"></i> Update Password';
                document.getElementById('changePasswordSection').classList.add('hidden');
                clearPasswordMessage();
            }, 2000);
        } catch (error) {
            showPasswordMessage('Failed to update password. Please try again.');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check mr-2"></i> Update Password';
        }
    });

    window.removeSkill = (skill) => {
        cvProfile.skills = cvProfile.skills.filter((s) => s !== skill);
        document.getElementById('skillsList').innerHTML = renderSkillsList(cvProfile.skills);
    };

    document.getElementById('saveCVBtn').addEventListener('click', async () => {
        const btn = document.getElementById('saveCVBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving CV...';
        try {
            saveCVToLocalStorage(user.id, cvProfile);
            btn.innerHTML = '<i class="fas fa-check mr-2"></i> CV Saved Successfully!';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Complete CV';
            }, 2000);
        } catch (error) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Complete CV';
        }
    });
}
