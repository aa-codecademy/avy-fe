import authService from '../../services/authService.js';
import languageService from '../../services/languageService.js';
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
    const t = (key) => languageService.translate(key);

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
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">
                    <div class="mb-8 flex justify-between items-center">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                <i class="fas fa-user-circle text-purple-600 mr-3"></i>
                                ${t('profile.title')}
                            </h1>
                            <p class="text-gray-600">${t('profile.personalInfo')}</p>
                        </div>
                        <button id="settingsBtn" class="btn btn-secondary">
                            <i class="fas fa-cog mr-2"></i> ${t('buttons.settings')}
                        </button>
                    </div>

                    <div id="settingsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                        <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                            <h3 class="text-2xl font-bold mb-4">${t('profile.title')} ${t('buttons.settings')}</h3>
                            <div class="mb-4">
                                <label class="form-label">${t('profile.profileVisibility')}</label>
                                <select id="modalProfileVisibility" class="form-input">
                                    <option value="public" ${user.profileVisibility === 'public' ? 'selected' : ''}>${t('profile.public')}</option>
                                    <option value="private" ${user.profileVisibility === 'private' ? 'selected' : ''}>${t('profile.private')}</option>
                                </select>
                                <p class="text-xs text-gray-500 mt-1">${t('profile.visibilityNote')}</p>
                            </div>
                            <div class="flex justify-end gap-3">
                                <button id="closeSettingsModal" class="btn btn-secondary">${t('buttons.cancel')}</button>
                                <button id="saveSettingsBtn" class="btn btn-primary">${t('buttons.save')}</button>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-id-card mr-2"></i>${t('profile.personalInfo')}</h2>
                            <button id="editProfileBtn" class="btn btn-secondary text-sm"><i class="fas fa-edit mr-1"></i> ${t('buttons.edit')}</button>
                        </div>
                        <div id="personalInfoSection">
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="md:col-span-2 flex items-center gap-4">
                                    <img id="profileImage" src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=8b5cf6&color=fff'}" alt="${user.name}" class="w-24 h-24 rounded-full border-4 border-purple-200" />
                                    <div>
                                        <input type="file" id="photoUpload" class="hidden" accept="image/*" />
                                        <label id="photoUploadLabel" for="photoUpload" class="btn btn-secondary text-sm cursor-pointer hidden"><i class="fas fa-camera mr-1"></i> ${t('profile.changePhoto')}</label>
                                        <p class="text-xs text-gray-500 mt-1">Optional</p>
                                    </div>
                                </div>
                            <div><label class="form-label">${t('profile.firstName')} ${t('profile.lastName')} *</label><input type="text" id="name" class="form-input" value="${escapeHtml(user.name || '')}"/></div>
                            <div><label class="form-label">${t('profile.degree')} *</label><input type="text" id="educationDegree" class="form-input" value="${escapeHtml(user.educationDegree || '')}"/></div>
                            <div><label class="form-label">${t('profile.position')} *</label><input type="text" id="currentPosition" class="form-input" value="${escapeHtml(user.currentPosition || '')}"/></div>
                            <div><label class="form-label">${t('profile.email')} *</label><input type="email" id="email" class="form-input bg-gray-100" value="${escapeHtml(user.email)}" readonly /></div>
                            <div><label class="form-label">${t('profile.phone')}</label><input type="tel" id="phone" class="form-input" value="${escapeHtml(user.phone || '')}" /></div>
                            <div><label class="form-label">${t('profile.dateOfBirth')} *</label>${renderSingleDateSelectors('birth', user.dateOfBirth || '')}</div>
                            <div><label class="form-label">${t('profile.citizenship')}</label><input type="text" id="citizenship" class="form-input" value="${escapeHtml(user.citizenship || '')}"/></div>
                            <div><label class="form-label">${t('profile.location')}</label><input type="text" id="address" class="form-input" value="${escapeHtml(user.address || '')}"/></div>
                            <div><label class="form-label">${t('profile.linkedin')}</label><input type="url" id="linkedIn" class="form-input" value="${escapeHtml(user.linkedIn || '')}" /></div>
                            <div><label class="form-label">${t('profile.portfolio')}</label><input type="url" id="portfolio" class="form-input" value="${escapeHtml(user.portfolio || '')}"/></div>
                        </div>
                        
                <div id="personalInfoActions" class="hidden mt-6 mb-10 flex justify-between items-center flex-wrap gap-3">
                    <div>
                        <button id="savePersonalInfoBtn" class="btn btn-primary">
                            <i class="fas fa-save mr-2"></i> ${t('buttons.save')} ${t('profile.personalInfo')}
                        </button>
                    </div>

                    <div>
                        <button id="togglePasswordFormBtn" class="btn btn-secondary">
                            <i class="fas fa-lock mr-2"></i> ${t('buttons.changePassword')}
                        </button>
                    </div>
                </div>

                <div id="changePasswordSection" class="hidden mt-4 p-4 bg-gray-50 rounded-lg">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="form-label">${t('profile.currentPassword')} *</label>
                            <input type="password" id="currentPassword" class="form-input" />
                        </div>

                        <div>
                            <label class="form-label">${t('profile.newPassword')} *</label>
                            <input type="password" id="newPassword" class="form-input" />
                        </div>

                        <div>
                            <label class="form-label">${t('profile.confirmPassword')} *</label>
                            <input type="password" id="confirmNewPassword" class="form-input" />
                        </div>
                    </div>

                    <button id="savePasswordBtn" class="btn btn-primary mt-4">
                        <i class="fas fa-check mr-2"></i> ${t('buttons.updatePassword')}
                    </button>
                    <p id="passwordMessage" class="hidden mt-3 text-sm font-medium" aria-live="polite"></p>
                </div>
                        
                    </div>
                    
                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-briefcase mr-2"></i>${t('profile.experience')} / ${t('profile.volunteering')}</h2>
                            <button id="addWorkExpBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> ${t('buttons.add')}</button>
                        </div>
                        <div id="workExperienceList">${renderWorkExperienceList(cvProfile.workExperience, t)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-graduation-cap mr-2"></i>${t('profile.education')} *</h2>
                            <button id="addEducationBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> ${t('buttons.add')}</button>
                        </div>
                        <div id="educationList">${renderEducationList(cvProfile.education, t)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-school mr-2"></i>${t('profile.academy')} *</h2>
                            <button id="addAcademyBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> ${t('buttons.add')}</button>
                        </div>
                        <div id="academyList">${renderAcademyList(cvProfile.academyAttendance, t)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-plus-circle mr-2"></i>${t('profile.additionalEducation')}</h2>
                            <button id="addAdditionalEduBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> ${t('buttons.add')}</button>
                        </div>
                        <div id="additionalEducationList">${renderAdditionalEducationList(cvProfile.additionalEducation, t)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-code mr-2"></i>${t('profile.skills')} *</h2>
                            <button id="addSkillBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> ${t('buttons.add')}</button>
                        </div>
                        <div id="skillsList">${renderSkillsList(cvProfile.skills, t)}</div>
                    </div>

                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800"><i class="fas fa-language mr-2"></i>${t('profile.languages')}</h2>
                            <button id="addLanguageBtn" class="btn btn-secondary text-sm"><i class="fas fa-plus mr-1"></i> ${t('buttons.add')}</button>
                        </div>
                        <div id="languagesList">${renderLanguagesList(cvProfile.languages, t)}</div>
                    </div>

                    <div class="card bg-gray-50 border border-gray-200">
                        <div class="text-center">
                            <p class="text-gray-700 font-semibold mb-4"><i class="fas fa-info-circle mr-2 text-purple-600"></i>${t('profile.requiredFieldsNote')}</p>
                            <button id="saveCVBtn" class="btn btn-primary text-lg px-8"><i class="fas fa-save mr-2"></i> ${t('buttons.save')} CV</button>
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
        document.getElementById('skillsList').innerHTML = renderSkillsList(cvProfile.skills, t);
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
