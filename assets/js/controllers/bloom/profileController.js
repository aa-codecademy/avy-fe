/**
 * Profile/CV Controller
 * CV Form for students and alumni based on Avy User Requirements
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function profileController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    const cvProfile = await mockDataService.getCVProfile(user.id);

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-user-circle text-purple-600 mr-3"></i>
                            My Profile & CV
                        </h1>
                        <p class="text-gray-600">Manage your professional profile</p>
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
                        </div>
                        
                <div class="mt-6 flex justify-between items-center flex-wrap gap-3">
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
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-briefcase mr-2"></i>
                                Work Experience / Volunteering
                            </h2>
                            <button id="addWorkExpBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div id="workExperienceList">
                            ${renderWorkExperienceList(cvProfile.workExperience)}
                        </div>
                    </div>
                    
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-graduation-cap mr-2"></i>
                                Education *
                            </h2>
                            <button id="addEducationBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div id="educationList">
                            ${renderEducationList(cvProfile.education)}
                        </div>
                    </div>
                    
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-school mr-2"></i>
                                Avenga Academy Attendance *
                            </h2>
                            <button id="addAcademyBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div id="academyList">
                            ${renderAcademyList(cvProfile.academyAttendance)}
                        </div>
                    </div>
                    
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-code mr-2"></i>
                                Key Skills & Knowledge *
                            </h2>
                        </div>
                        
                        <div class="mb-4">
                            <div class="flex gap-2 mb-3">
                                <input type="text" id="skillInput" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" placeholder="Add a skill..." />
                                <button id="addSkillBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            
                            <div id="skillsList" class="flex flex-wrap gap-2">
                                ${renderSkillsList(cvProfile.skills)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-language mr-2"></i>
                                Language Knowledge
                            </h2>
                            <button id="addLanguageBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div id="languagesList">
                            ${renderLanguagesList(cvProfile.languages)}
                        </div>
                    </div>
                    
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] bg-purple-50 border-2 border-purple-200">
                        <div class="text-center">
                            <p class="text-purple-900 font-semibold mb-4">
                                <i class="fas fa-info-circle mr-2"></i>
                                Fields marked with * are required and visible to employers
                            </p>
                            <button id="saveCVBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] text-lg px-8">
                                <i class="fas fa-save mr-2"></i> Save Complete CV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupEventListeners(user, cvProfile);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

function renderWorkExperienceList(workExp) {
    if (workExp.length === 0) {
        return '<p class="text-gray-500 text-center py-4">No work experience added yet</p>';
    }

    return workExp.map(exp => `
        <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800">${exp.position}</h3>
                    <p class="text-gray-600">${exp.company}</p>
                    <p class="text-sm text-gray-500">${exp.startDate} - ${exp.endDate || 'Present'}</p>
                    ${exp.description ? `<p class="text-gray-700 mt-2">${exp.description}</p>` : ''}
                    ${exp.isVolunteering ? '<span class="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Volunteering</span>' : ''}
                </div>
                <button class="text-red-600 hover:text-red-800" onclick="removeWorkExp('${exp.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderEducationList(education) {
    if (education.length === 0) {
        return '<p class="text-gray-500 text-center py-4">No education added yet</p>';
    }

    return education.map(edu => `
        <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800">${edu.degree} in ${edu.fieldOfStudy}</h3>
                    <p class="text-gray-600">${edu.institution}</p>
                    <p class="text-sm text-gray-500">${edu.startDate} - ${edu.endDate}</p>
                    ${edu.grade ? `<p class="text-sm text-gray-600 mt-1">Grade: ${edu.grade}</p>` : ''}
                </div>
                <button class="text-red-600 hover:text-red-800" onclick="removeEducation('${edu.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderAcademyList(academies) {
    if (academies.length === 0) {
        return '<p class="text-gray-500 text-center py-4">No academy attendance added yet</p>';
    }

    return academies.map(academy => `
        <div class="mb-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-purple-900">${academy.academyName}</h3>
                    <p class="text-purple-700">Track: ${academy.track}</p>
                    <p class="text-sm text-purple-600">${academy.startDate} - ${academy.endDate}</p>
                    <span class="inline-block mt-2 px-2 py-1 bg-purple-200 text-purple-900 text-xs rounded font-semibold">${academy.status}</span>
                </div>
                <button class="text-red-600 hover:text-red-800" onclick="removeAcademy('${academy.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderSkillsList(skills) {
    if (skills.length === 0) {
        return '<p class="text-gray-500 text-sm">No skills added yet</p>';
    }

    return skills.map(skill => `
        <span class="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold">
            ${skill}
            <button onclick="removeSkill('${skill}')" class="ml-2 text-purple-600 hover:text-purple-900">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `).join('');
}

function renderLanguagesList(languages) {
    if (languages.length === 0) {
        return '<p class="text-gray-500 text-center py-4">No languages added yet</p>';
    }

    return languages.map((lang, index) => `
        <div class="mb-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
                <span class="font-semibold text-gray-800">${lang.language}</span>
                <span class="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${lang.level}</span>
            </div>
            <button class="text-red-600 hover:text-red-800" onclick="removeLanguage(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function setupEventListeners(user, cvProfile) {
    document.getElementById('savePersonalInfoBtn').addEventListener('click', async () => {
        const btn = document.getElementById('savePersonalInfoBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        await new Promise(resolve => setTimeout(resolve, 500));

        btn.innerHTML = '<i class="fas fa-check mr-2"></i> Saved!';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Personal Information';
        }, 2000);
    });

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


    document.getElementById('togglePasswordFormBtn').addEventListener('click', () => {
        document.getElementById('changePasswordSection').classList.toggle('hidden');
        clearPasswordMessage();
    });

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
            await new Promise(resolve => setTimeout(resolve, 2000));

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

    const skillInput = document.getElementById('skillInput');
    document.getElementById('addSkillBtn').addEventListener('click', () => {
        const skill = skillInput.value.trim();
        if (skill && !cvProfile.skills.includes(skill)) {
            cvProfile.skills.push(skill);
            document.getElementById('skillsList').innerHTML = renderSkillsList(cvProfile.skills);
            skillInput.value = '';
        }
    });

    skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('addSkillBtn').click();
        }
    });

    window.removeSkill = (skill) => {
        cvProfile.skills = cvProfile.skills.filter(s => s !== skill);
        document.getElementById('skillsList').innerHTML = renderSkillsList(cvProfile.skills);
    };

    document.getElementById('saveCVBtn').addEventListener('click', async () => {
        const btn = document.getElementById('saveCVBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving CV...';

        try {
            await mockDataService.updateCVProfile(user.id, cvProfile);
            btn.innerHTML = '<i class="fas fa-check mr-2"></i> CV Saved Successfully!';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Complete CV';
            }, 2000);
        } catch (error) {
            alert('Failed to save CV. Please try again.');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Complete CV';
        }
    });
}
