/**
 * Profile/CV Controller
 * CV Form for students and alumni based on Avy User Requirements
 */
import authService from '../services/authService.js';
import mockDataService from '../services/mockDataService.js';

export default async function profileController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user) {
        window.router.navigate('/login');
        return;
    }
    
    const cvProfile = await mockDataService.getCVProfile(user.id);
    
    app.innerHTML = `
        ${renderHeader(user)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">
                    <!-- Page Header -->
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-user-circle text-purple-600 mr-3"></i>
                            My Profile & CV
                        </h1>
                        <p class="text-gray-600">Manage your professional profile</p>
                    </div>
                    
                    <!-- Profile Information Card -->
                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-id-card mr-2"></i>
                                Personal Information
                            </h2>
                            <button id="editPersonalInfoBtn" class="btn btn-secondary text-sm">
                                <i class="fas fa-edit mr-1"></i> Edit
                            </button>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- Photo Upload -->
                            <div class="md:col-span-2 flex items-center gap-4">
                                <img src="${user.avatar}" alt="${user.name}" class="w-24 h-24 rounded-full border-4 border-purple-200" />
                                <div>
                                    <input type="file" id="photoUpload" class="hidden" accept="image/*" />
                                    <label for="photoUpload" class="btn btn-secondary text-sm cursor-pointer">
                                        <i class="fas fa-camera mr-1"></i> Change Photo
                                    </label>
                                    <p class="text-xs text-gray-500 mt-1">Optional</p>
                                </div>
                            </div>
                            
                            <div>
                                <label class="form-label">Full Name *</label>
                                <input type="text" id="name" class="form-input" value="${user.name}" />
                            </div>
                            
                            <div>
                                <label class="form-label">Educational Degree *</label>
                                <input type="text" id="educationDegree" class="form-input" value="${user.educationDegree || ''}" />
                            </div>
                            
                            <div>
                                <label class="form-label">Current Position *</label>
                                <input type="text" id="currentPosition" class="form-input" value="${user.currentPosition || ''}" />
                            </div>
                            
                            <div>
                                <label class="form-label">Email *</label>
                                <input type="email" id="email" class="form-input" value="${user.email}" readonly />
                            </div>
                            
                            <div>
                                <label class="form-label">Phone Number</label>
                                <input type="tel" id="phone" class="form-input" value="${user.phone || ''}" />
                            </div>
                            
                            <div>
                                <label class="form-label">Date of Birth *</label>
                                <input type="date" id="dateOfBirth" class="form-input" value="${user.dateOfBirth || ''}" />
                            </div>
                            
                            <div>
                                <label class="form-label">Citizenship</label>
                                <input type="text" id="citizenship" class="form-input" value="${user.citizenship || ''}" />
                            </div>
                            
                            <div>
                                <label class="form-label">LinkedIn Profile</label>
                                <input type="url" id="linkedIn" class="form-input" value="${user.linkedIn || ''}" placeholder="https://linkedin.com/in/yourprofile" />
                            </div>
                            
                            <div>
                                <label class="form-label">Portfolio Link</label>
                                <input type="url" id="portfolio" class="form-input" value="${user.portfolio || ''}" placeholder="https://yourportfolio.com" />
                            </div>
                            
                            <div>
                                <label class="form-label">Profile Visibility</label>
                                <select id="profileVisibility" class="form-input">
                                    <option value="public" ${user.profileVisibility === 'public' ? 'selected' : ''}>Public</option>
                                    <option value="private" ${user.profileVisibility === 'private' ? 'selected' : ''}>Private (Companies need approval)</option>
                                </select>
                            </div>
                        </div>
                        
                        <button id="savePersonalInfoBtn" class="btn btn-primary mt-6">
                            <i class="fas fa-save mr-2"></i> Save Personal Information
                        </button>
                    </div>
                    
                    <!-- Work Experience -->
                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-briefcase mr-2"></i>
                                Work Experience / Volunteering
                            </h2>
                            <button id="addWorkExpBtn" class="btn btn-secondary text-sm">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div id="workExperienceList">
                            ${renderWorkExperienceList(cvProfile.workExperience)}
                        </div>
                    </div>
                    
                    <!-- Education -->
                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-graduation-cap mr-2"></i>
                                Education *
                            </h2>
                            <button id="addEducationBtn" class="btn btn-secondary text-sm">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div id="educationList">
                            ${renderEducationList(cvProfile.education)}
                        </div>
                    </div>
                    
                    <!-- Academy Attendance -->
                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-school mr-2"></i>
                                Avenga Academy Attendance *
                            </h2>
                            <button id="addAcademyBtn" class="btn btn-secondary text-sm">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div id="academyList">
                            ${renderAcademyList(cvProfile.academyAttendance)}
                        </div>
                    </div>
                    
                    <!-- Skills -->
                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-code mr-2"></i>
                                Key Skills & Knowledge *
                            </h2>
                        </div>
                        
                        <div class="mb-4">
                            <div class="flex gap-2 mb-3">
                                <input type="text" id="skillInput" class="form-input" placeholder="Add a skill..." />
                                <button id="addSkillBtn" class="btn btn-secondary">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            
                            <div id="skillsList" class="flex flex-wrap gap-2">
                                ${renderSkillsList(cvProfile.skills)}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Languages -->
                    <div class="card mb-6">
                        <div class="flex justify-between items-start mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-language mr-2"></i>
                                Language Knowledge
                            </h2>
                            <button id="addLanguageBtn" class="btn btn-secondary text-sm">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>
                        
                        <div id="languagesList">
                            ${renderLanguagesList(cvProfile.languages)}
                        </div>
                    </div>
                    
                    <!-- Save All -->
                    <div class="card bg-purple-50 border-2 border-purple-200">
                        <div class="text-center">
                            <p class="text-purple-900 font-semibold mb-4">
                                <i class="fas fa-info-circle mr-2"></i>
                                Fields marked with * are required and visible to employers
                            </p>
                            <button id="saveCVBtn" class="btn btn-primary text-lg px-8">
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

function renderHeader(user) {
    return `
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Avy
                    </div>
                    <div class="flex items-center space-x-6">
                        <a href="/dashboard" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-home mr-1"></i> Dashboard
                        </a>
                        <a href="/jobs" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-briefcase mr-1"></i> Jobs
                        </a>
                        <a href="/companies" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-building mr-1"></i> Companies
                        </a>
                        <a href="/profile" data-link class="text-purple-600 font-semibold">
                            <i class="fas fa-user mr-1"></i> Profile
                        </a>
                        <div class="flex items-center space-x-3">
                            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full border-2 border-purple-600" />
                            <button id="logoutBtn" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;
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
    // Save Personal Info
    document.getElementById('savePersonalInfoBtn').addEventListener('click', async () => {
        const btn = document.getElementById('savePersonalInfoBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
        
        // Collect data and save (mock)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        btn.innerHTML = '<i class="fas fa-check mr-2"></i> Saved!';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Personal Information';
        }, 2000);
    });
    
    // Add Skill
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
    
    // Global functions for removing items (attach to window)
    window.removeSkill = (skill) => {
        cvProfile.skills = cvProfile.skills.filter(s => s !== skill);
        document.getElementById('skillsList').innerHTML = renderSkillsList(cvProfile.skills);
    };
    
    // Save Complete CV
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
