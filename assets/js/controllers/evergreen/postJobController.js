/**
 * Post Job Controller (Employer)
 * Job announcement form based on Avy User Requirements
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function postJobController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    const company = await mockDataService.getCompanyById(user.companyId);
    if (!company) {
        window.router.navigate('/dashboard');
        return;
    }
    const activeJobs = (
        await mockDataService.getAllJobs({ companyId: company.id, status: 'active' })
    ).length;

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-plus-circle text-purple-600 mr-3"></i>
                            Post a New Job
                        </h1>
                        <p class="text-gray-600">
                            ${company.name} | Active Jobs: ${activeJobs} / ${company.jobPostingLimit}
                        </p>
                    </div>
                    
                    ${
                        activeJobs >= company.jobPostingLimit
                            ? `
                        <div class="card no-hover bg-red-50 border-2 border-red-300 mb-6">
                            <div class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-600 text-3xl mr-4"></i>
                                <div>
                                    <h3 class="text-xl font-bold text-red-900 mb-1">Job Posting Limit Reached</h3>
                                    <p class="text-red-700">
                                        You've reached your subscription limit of ${company.jobPostingLimit} active job postings.
                                        Please upgrade your plan or deactivate an existing job to post a new one.
                                    </p>
                                    <button class="btn btn-primary mt-3">
                                        <i class="fas fa-crown mr-2"></i> Upgrade Subscription
                                    </button>
                                </div>
                            </div>
                        </div>
                    `
                            : ''
                    }
                    
                    <form id="jobPostForm" ${activeJobs >= company.jobPostingLimit ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                        <div class="card no-hover mb-6">
                            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                                <i class="fas fa-info-circle mr-2"></i>
                                Basic Information
                            </h2>
                            
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="md:col-span-2">
                                    <label class="form-label">Job Title *</label>
                                    <input type="text" id="jobTitle" required class="form-input" placeholder="e.g., Senior Frontend Developer" />
                                </div>
                                <div>
                                    <label class="form-label">Employment Type *</label>
                                    <select id="employmentType" required class="form-input">
                                        <option value="">Select type...</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="internship">Internship</option>
                                        <option value="freelance">Freelance</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Work Mode *</label>
                                    <select id="workMode" required class="form-input">
                                        <option value="">Select mode...</option>
                                        <option value="onsite">On-site</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Location *</label>
                                    <input type="text" id="location" required class="form-input" placeholder="e.g., Skopje, Macedonia" />
                                </div>
                                <div>
                                    <label class="form-label">Experience Level *</label>
                                    <select id="experienceLevel" required class="form-input">
                                        <option value="">Select level...</option>
                                        <option value="entry">Entry Level (0-2 years)</option>
                                        <option value="mid">Mid Level (2-5 years)</option>
                                        <option value="senior">Senior (5+ years)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card no-hover mb-6">
                            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                                <i class="fas fa-file-alt mr-2"></i>
                                Job Description
                            </h2>
                            <div class="mb-6">
                                <label class="form-label">Description *</label>
                                <textarea id="description" required rows="5" class="form-input" placeholder="Provide a detailed description of the role..."></textarea>
                            </div>
                            <div class="mb-6">
                                <label class="form-label">Responsibilities *</label>
                                <textarea id="responsibilities" required rows="4" class="form-input" placeholder="List key responsibilities (one per line)..."></textarea>
                                <p class="text-xs text-gray-500 mt-1">Separate each responsibility with a new line</p>
                            </div>
                            <div class="mb-6">
                                <label class="form-label">Qualifications *</label>
                                <textarea id="qualifications" required rows="4" class="form-input" placeholder="List required qualifications (one per line)..."></textarea>
                                <p class="text-xs text-gray-500 mt-1">Separate each qualification with a new line</p>
                            </div>
                            <div>
                                <label class="form-label">Benefits</label>
                                <textarea id="benefits" rows="3" class="form-input" placeholder="List benefits and perks (one per line)..."></textarea>
                            </div>
                        </div>
                        
                        <div class="card no-hover mb-6">
                            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                                <i class="fas fa-code mr-2"></i>
                                Required Skills
                            </h2>
                            <div class="mb-6">
                                <label class="form-label">Required Skills *</label>
                                <div class="flex gap-2 mb-3">
                                    <input type="text" id="requiredSkillInput" class="form-input" placeholder="Add a required skill..." />
                                    <button type="button" id="addRequiredSkillBtn" class="btn btn-secondary"><i class="fas fa-plus"></i></button>
                                </div>
                                <div id="requiredSkillsList" class="flex flex-wrap gap-2 min-h-[2rem]"></div>
                            </div>
                            <div>
                                <label class="form-label">Nice-to-Have Skills</label>
                                <div class="flex gap-2 mb-3">
                                    <input type="text" id="niceToHaveSkillInput" class="form-input" placeholder="Add a nice-to-have skill..." />
                                    <button type="button" id="addNiceToHaveSkillBtn" class="btn btn-secondary"><i class="fas fa-plus"></i></button>
                                </div>
                                <div id="niceToHaveSkillsList" class="flex flex-wrap gap-2 min-h-[2rem]"></div>
                            </div>
                        </div>
                        
                        <div class="card no-hover mb-6">
                            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                                <i class="fas fa-dollar-sign mr-2"></i>
                                Compensation & Timeline
                            </h2>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div><label class="form-label">Minimum Salary (EUR)</label><input type="number" id="salaryMin" class="form-input" min="0" /></div>
                                <div><label class="form-label">Maximum Salary (EUR)</label><input type="number" id="salaryMax" class="form-input" min="0" /></div>
                                <div><label class="form-label">Application Deadline *</label><input type="date" id="deadline" required class="form-input" min="${new Date().toISOString().split('T')[0]}" /></div>
                                <div><label class="form-label">Priority (for Featured badge)</label><select id="priority" class="form-input"><option value="normal">Normal</option><option value="high">High (Featured)</option></select></div>
                            </div>
                        </div>

                        <div class="card no-hover mb-6">
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">
                                <i class="fas fa-file-signature mr-2"></i>
                                Application method
                            </h2>
                            <div class="space-y-3">
                                <label class="flex items-start gap-3 cursor-pointer">
                                    <input type="radio" name="applicationMode" value="easy_apply" checked class="mt-1" />
                                    <span><strong>Easy Apply</strong> - quick apply using the candidate profile on the platform</span>
                                </label>
                                <label class="flex items-start gap-3 cursor-pointer">
                                    <input type="radio" name="applicationMode" value="cv_required" class="mt-1" />
                                    <span><strong>CV required</strong> - candidates must upload a CV document</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="card no-hover bg-purple-50 border-2 border-purple-200">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-purple-900 font-semibold"><i class="fas fa-info-circle mr-2"></i>Fields marked with * are required</p>
                                </div>
                                <div class="flex gap-3">
                                    <button type="button" class="btn btn-secondary" onclick="window.router.navigate('/employer/jobs')">Cancel</button>
                                    <button type="submit" class="btn btn-primary text-lg px-8">Post Job</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    setupEventListeners(company);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function setupEventListeners(company) {
    const requiredSkills = [];
    const niceToHaveSkills = [];
    const requiredSkillInput = document.getElementById('requiredSkillInput');
    const addRequiredSkillBtn = document.getElementById('addRequiredSkillBtn');
    const requiredSkillsList = document.getElementById('requiredSkillsList');
    const niceToHaveSkillInput = document.getElementById('niceToHaveSkillInput');
    const addNiceToHaveSkillBtn = document.getElementById('addNiceToHaveSkillBtn');
    const niceToHaveSkillsList = document.getElementById('niceToHaveSkillsList');

    function renderSkills(container, skills, type) {
        container.innerHTML =
            skills.length === 0
                ? '<p class="text-gray-500 text-sm">No skills added yet</p>'
                : skills
                      .map(
                          (skill) => `
                <span class="px-3 py-2 ${type === 'required' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'} rounded-lg font-semibold">
                    ${skill}
                    <button type="button" onclick="removeSkill_${type}('${skill}')" class="ml-2 hover:opacity-75">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `
                      )
                      .join('');
    }

    addRequiredSkillBtn.addEventListener('click', () => {
        const skill = requiredSkillInput.value.trim();
        if (skill && !requiredSkills.includes(skill)) {
            requiredSkills.push(skill);
            renderSkills(requiredSkillsList, requiredSkills, 'required');
            requiredSkillInput.value = '';
        }
    });
    addNiceToHaveSkillBtn.addEventListener('click', () => {
        const skill = niceToHaveSkillInput.value.trim();
        if (skill && !niceToHaveSkills.includes(skill)) {
            niceToHaveSkills.push(skill);
            renderSkills(niceToHaveSkillsList, niceToHaveSkills, 'niceToHave');
            niceToHaveSkillInput.value = '';
        }
    });
    requiredSkillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addRequiredSkillBtn.click();
        }
    });
    niceToHaveSkillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNiceToHaveSkillBtn.click();
        }
    });
    window.removeSkill_required = (skill) => {
        const index = requiredSkills.indexOf(skill);
        if (index > -1) {
            requiredSkills.splice(index, 1);
            renderSkills(requiredSkillsList, requiredSkills, 'required');
        }
    };
    window.removeSkill_niceToHave = (skill) => {
        const index = niceToHaveSkills.indexOf(skill);
        if (index > -1) {
            niceToHaveSkills.splice(index, 1);
            renderSkills(niceToHaveSkillsList, niceToHaveSkills, 'niceToHave');
        }
    };

    document.getElementById('jobPostForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (requiredSkills.length === 0) {
            alert('Please add at least one required skill');
            return;
        }
        const formData = {
            title: document.getElementById('jobTitle').value,
            description: document.getElementById('description').value,
            responsibilities: document
                .getElementById('responsibilities')
                .value.split('\n')
                .filter((r) => r.trim()),
            qualifications: document
                .getElementById('qualifications')
                .value.split('\n')
                .filter((q) => q.trim()),
            benefits: document
                .getElementById('benefits')
                .value.split('\n')
                .filter((b) => b.trim()),
            employmentType: document.getElementById('employmentType').value,
            location: document.getElementById('location').value,
            workMode: document.getElementById('workMode').value,
            experienceLevel: document.getElementById('experienceLevel').value,
            requiredSkills,
            niceToHaveSkills,
            salaryMin: parseInt(document.getElementById('salaryMin').value) || null,
            salaryMax: parseInt(document.getElementById('salaryMax').value) || null,
            deadline: document.getElementById('deadline').value,
            priority: document.getElementById('priority').value,
            companyId: company.id,
            status: 'active',
            postedDate: new Date().toISOString().split('T')[0],
            applicationMode: document.querySelector('input[name="applicationMode"]:checked').value,
        };
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        try {
            await mockDataService.createJob(formData);
            alert('Job posted successfully!');
            window.router.navigate('/employer/jobs');
        } catch {
            alert('Failed to post job. Please try again.');
            submitBtn.disabled = false;
        }
    });
}
