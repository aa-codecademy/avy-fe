/**
 * Job Applicants Controller (Employer)
 * View, filter, sort, and manage applicants for a specific job.
 *
 * User stories:
 *  - "4.1 View Applicants"
 *  - "4.2 Filter & Sort Candidates"
 *  - "4.3 Candidate Evaluation" (status updates: shortlisted/rejected/hired)
 *  - "5.1 Track Hiring Pipeline"
 *  - "5.2 Internal Notes"
 *
 * Available mock service methods:
 *  - mockDataService.getApplications({ jobId })
 *  - mockDataService.updateApplicationStatus(id, status, notes)
 *  - mockDataService.getJobById(id)
 *  - mockDataService.getCVProfile(userId)
 *  - mockDataService.getUserById(userId)
 *  - mockDataService.updateApplicationNotes(id, notes)
 *
 * @param {object} params - Route params, includes :id (job id)
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const EXPERIENCE_LEVELS = [
    { value: '', label: 'All Levels' },
    { value: 'intern', label: 'Intern' },
    { value: 'entry', label: 'Entry Level (0-2 yrs)' },
    { value: 'mid', label: 'Mid Level (2-5 yrs)' },
    { value: 'senior', label: 'Senior (5+ yrs)' },
];

const APPLICATION_STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview', label: 'Interview' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
];

const SORT_OPTIONS = [
    { value: 'applied_desc', label: 'Application Date (Newest)' },
    { value: 'applied_asc', label: 'Application Date (Oldest)' },
    { value: 'name_asc', label: 'Name (A → Z)' },
    { value: 'name_desc', label: 'Name (Z → A)' },
    { value: 'skill_match', label: 'Skill Match' },
];

const SKILL_POOL = [
    'JavaScript',
    'TypeScript',
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'Python',
    'SQL',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'AWS',
    'HTML5',
    'CSS3',
    'Git',
    'REST API',
    'GraphQL',
    'Tailwind CSS',
    'Java',
    'C#',
    '.NET',
    'PHP',
    'Ruby',
    'Go',
    'Rust',
    'Swift',
    'Kotlin',
    'Flutter',
    'React Native',
    'Redux',
    'Next.js',
    'Nuxt.js',
    'Express.js',
    'Django',
    'Flask',
    'Spring Boot',
    'MySQL',
    'Redis',
    'Elasticsearch',
    'Kubernetes',
    'Azure',
    'GCP',
    'CI/CD',
    'Jest',
    'Cypress',
    'Selenium',
    'Figma',
];

/**
 * Alias map — when user selects a canonical skill, also match these variants
 * in the candidate's CV (and vice versa). Keys and values are all lowercase.
 */
const SKILL_ALIASES = {
    html5: ['html'],
    html: ['html5'],
    css3: ['css'],
    css: ['css3'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Enrich applicants with CV skills and experience level from CV profiles */
async function enrichApplicants(applicants) {
    return Promise.all(
        applicants.map(async (applicant) => {
            const cvProfile = applicant.userId
                ? await mockDataService.getCVProfile(applicant.userId)
                : null;
            const user = applicant.userId
                ? await mockDataService.getUserById(applicant.userId)
                : null;
            return {
                ...applicant,
                applicant: user,
                _skills: cvProfile?.skills || [],
                _experienceLevel: cvProfile?.experienceLevel || '',
                _cvProfile: cvProfile,
            };
        })
    );
}

/** Helper — true if token or any of its aliases appears in the applicant's skill list */
function skillMatches(token, applicantSkillsLower) {
    if (applicantSkillsLower.includes(token)) return true;
    const aliases = SKILL_ALIASES[token] || [];
    return aliases.some((alias) => applicantSkillsLower.includes(alias));
}

/** Returns true when every required skill token (or alias) matches at least one applicant skill */
function skillsMatch(applicantSkills, requiredTokens) {
    if (!requiredTokens.length) return true;
    const lower = (applicantSkills || []).map((s) => s.toLowerCase());
    return requiredTokens.every((token) => skillMatches(token, lower));
}

/** Returns the number of skill tokens (or aliases) matched */
function skillMatchCount(applicantSkills, requiredTokens) {
    if (!requiredTokens.length) return 0;
    const lower = (applicantSkills || []).map((s) => s.toLowerCase());
    return requiredTokens.filter((token) => skillMatches(token, lower)).length;
}

function renderSkillTags(skills, matchedTokens = []) {
    if (!skills?.length) return '<span class="text-gray-400 text-xs">No skills listed</span>';
    return skills
        .map((skill) => {
            const skillLower = skill.toLowerCase();
            const matched =
                matchedTokens.includes(skillLower) ||
                (SKILL_ALIASES[skillLower] || []).some((alias) => matchedTokens.includes(alias));
            return `<span class="px-2 py-0.5 rounded text-xs font-medium ${
                matched
                    ? 'bg-transparent text-red-600 ring-1 ring-red-500'
                    : 'bg-gray-100 text-gray-700'
            }">${skill}</span>`;
        })
        .join('');
}

function renderActiveFilters(filters) {
    const tags = [];
    if (filters.search) tags.push({ key: 'search', label: `"${filters.search}"` });
    if (filters.skills) {
        filters.skills.split(',').forEach((skill) => {
            const trimmed = skill.trim();
            if (trimmed) tags.push({ key: `skill:${trimmed}`, label: trimmed });
        });
    }
    if (filters.experienceLevel) {
        const lbl = EXPERIENCE_LEVELS.find((e) => e.value === filters.experienceLevel)?.label;
        tags.push({ key: 'experienceLevel', label: lbl });
    }
    if (filters.status) {
        const lbl = APPLICATION_STATUSES.find((s) => s.value === filters.status)?.label;
        tags.push({ key: 'status', label: lbl });
    }
    if (!tags.length) return '';
    return `
        <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="text-xs text-gray-500 font-medium">Active filters:</span>
            ${tags
                .map(
                    (t) => `
                <span class="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                    ${t.label}
                    <button type="button" class="remove-filter-tag hover:text-purple-600" data-key="${t.key}" aria-label="Remove filter">
                        <i class="fas fa-times text-[10px]"></i>
                    </button>
                </span>
            `
                )
                .join('')}
            <button id="clearAllFilters" class="text-xs text-red-500 hover:text-red-700 font-semibold ml-1">Clear all</button>
        </div>
    `;
}

function statusToColumn(status) {
    if (['pending', 'under_review', 'applied'].includes(status)) return 'under_review';
    if (status === 'shortlisted') return 'shortlisted';
    if (status === 'interview') return 'interview';
    if (status === 'hired') return 'hired';
    if (status === 'rejected') return 'rejected';
    return 'under_review';
}

function getGroupedApplicants(applicants) {
    return {
        under_review: applicants.filter((a) =>
            ['applied', 'pending', 'under_review'].includes(a.status)
        ),
        shortlisted: applicants.filter((a) => a.status === 'shortlisted'),
        interview: applicants.filter((a) => a.status === 'interview'),
        rejected: applicants.filter((a) => a.status === 'rejected'),
        hired: applicants.filter((a) => a.status === 'hired'),
    };
}

function addDragDropStyles() {
    if (document.getElementById('dragdrop-styles')) return;

    const style = document.createElement('style');
    style.id = 'dragdrop-styles';
    style.textContent = `
        [data-status-column] {
            min-height: 280px;
            max-height: 330px;
            overflow-y: auto;
            padding: 12px;
            background-color: #f9fafb;
            border-radius: 8px;
            transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        [data-status-column]::-webkit-scrollbar {
            width: 6px;
        }

        [data-status-column]::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
        }

        [data-status-column]::-webkit-scrollbar-thumb:hover {
            background-color: #94a3b8;
        }

        .pipeline-card {
            transition: all 0.2s ease;
            cursor: grab;
            user-select: none;
        }

        .pipeline-card:active {
            cursor: grabbing;
            transform: scale(0.97);
        }

        .pipeline-card * {
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);
}

// ─── Profile section renderer ─────────────────────────────────────────────────

const renderProfileSection = (cvProfile) => {
    let html = '';

    if (cvProfile?.skills?.length) {
        html += `
            <div class="mb-6">
                <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <i class="fas fa-star text-purple-600 mr-2"></i> Skills
                </h4>
                <div class="flex flex-wrap gap-2">
                    ${cvProfile.skills.map((skill) => `<span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (cvProfile?.workExperience?.length) {
        html += `
            <div class="mb-6">
                <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <i class="fas fa-briefcase text-blue-600 mr-2"></i> Work Experience
                </h4>
                ${cvProfile.workExperience
                    .map(
                        (exp) => `
                    <div class="mb-3 pb-3 border-b border-gray-200">
                        <div class="font-medium text-gray-800">${exp.position} at ${exp.company}</div>
                        <div class="text-sm text-gray-600">
                            ${exp.startDate} - ${exp.endDate || 'Present'}
                            ${exp.isVolunteering ? '<span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Volunteering</span>' : ''}
                        </div>
                        ${exp.description ? `<div class="text-sm text-gray-700 mt-1">${exp.description}</div>` : ''}
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;
    }

    if (cvProfile?.education?.length) {
        html += `
            <div class="mb-6">
                <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <i class="fas fa-graduation-cap text-green-600 mr-2"></i> Education
                </h4>
                ${cvProfile.education
                    .map(
                        (edu) => `
                    <div class="mb-3 pb-3 border-b border-gray-200">
                        <div class="font-medium text-gray-800">${edu.degree} in ${edu.fieldOfStudy}</div>
                        <div class="text-sm text-gray-600">${edu.institution}</div>
                        <div class="text-xs text-gray-500">${edu.startDate} - ${edu.endDate}</div>
                        ${edu.grade ? `<div class="text-sm text-gray-700 mt-1">Grade: ${edu.grade}</div>` : ''}
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;
    }

    if (cvProfile?.languages?.length) {
        html += `
            <div class="mb-6">
                <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <i class="fas fa-globe text-orange-600 mr-2"></i> Languages
                </h4>
                <div class="space-y-2">
                    ${cvProfile.languages
                        .map(
                            (lang) => `
                        <div class="flex text-sm">
                            <span class="w-32 text-gray-800">${lang.language || 'Unknown'}</span>
                            <span class="text-gray-600 capitalize">${lang.level || 'Unknown'}</span>
                        </div>
                    `
                        )
                        .join('')}
                </div>
            </div>
        `;
    }

    return html || '<p class="text-gray-500 text-sm">No profile information available</p>';
};

// ─── Applicant card renderer ──────────────────────────────────────────────────

const renderApplicantCard = (applicant, matchedTokens = []) => {
    const applicantName = applicant.applicant?.name || 'Unknown Applicant';
    const applicantEmail = applicant.applicant?.email || '';
    const applicantAvatar =
        applicant.applicant?.avatar || 'https://ui-avatars.com/api/?name=Unknown';
    const appliedDate = new Date(applicant.appliedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const statusBadgeColor = {
        pending: 'bg-gray-100 text-gray-800',
        under_review: 'bg-blue-100 text-blue-800',
        shortlisted: 'bg-indigo-100 text-indigo-800',
        interview: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
        hired: 'bg-green-100 text-green-800',
    };

    const skills = applicant._skills || [];
    const matchCount = skillMatchCount(skills, matchedTokens);
    const totalRequired = matchedTokens.length;
    const showMatchBar = totalRequired > 0;
    const expLabel =
        EXPERIENCE_LEVELS.find((e) => e.value === applicant._experienceLevel)?.label || '';

    return `
        <div class="card mb-4 p-4">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-start gap-3">
                    <img src="${applicantAvatar}" alt="${applicantName}" class="w-14 h-14 rounded-full">
                    <div>
                        <h3 class="font-semibold text-gray-800">${applicantName}</h3>
                        <p class="text-sm text-gray-600">${applicantEmail}</p>
                        ${expLabel ? `<p class="text-xs text-purple-600 font-medium mt-0.5"><i class="fas fa-layer-group mr-1"></i>${expLabel}</p>` : ''}
                        <p class="text-xs text-gray-500 mt-1">Applied: ${appliedDate}</p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColor[applicant.status] || 'bg-gray-100 text-gray-800'}">
                    ${(applicant.status || 'pending').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
            </div>

            ${
                skills.length > 0
                    ? `
                <div class="flex flex-wrap gap-1.5 mb-3">
                    ${renderSkillTags(skills, matchedTokens)}
                </div>
            `
                    : ''
            }

            ${
                showMatchBar
                    ? `
                <div class="mb-3">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-xs text-gray-500 font-medium">Skill match</span>
                        <span class="text-xs font-bold ${matchCount === totalRequired ? 'text-purple-600' : 'text-purple-400'}">
                            ${matchCount}/${totalRequired} skills
                        </span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-1.5">
                        <div class="h-1.5 rounded-full transition-all duration-500 ${matchCount === totalRequired ? 'bg-purple-600' : 'bg-purple-300'}"
                             style="width: ${totalRequired ? Math.round((matchCount / totalRequired) * 100) : 0}%"></div>
                    </div>
                </div>
            `
                    : ''
            }

            ${applicant.coverLetter ? `<p class="text-sm text-gray-700 mb-3 italic">"${applicant.coverLetter.substring(0, 100)}..."</p>` : ''}

            <div class="flex gap-2 mt-3 flex-wrap">
                <button class="btn btn-primary text-xs px-2 py-1 rounded view-profile-btn"
                        data-id="${applicant.id}"
                        data-user-id="${applicant.userId}">
                    <i class="fas fa-user-circle mr-1"></i> View Profile
                </button>

                <button class="btn btn-secondary text-xs px-2 py-1 rounded open-notes-btn"
                        data-id="${applicant.id}">
                    <i class="fas fa-sticky-note mr-1"></i> Notes
                </button>

                <div class="relative status-dropdown">
                    <button
                        class="btn btn-status w-full text-left text-xs px-2 py-1 rounded flex items-center gap-1 status-toggle"
                        type="button">
                        Status
                        <i class="fas fa-chevron-down text-[10px]"></i>
                    </button>

                    <div class="hidden absolute -right-19 mt-1 w-28 bg-white border rounded shadow-lg z-50 status-menu">
                        <button class="btn btn-shortlist w-full text-left text-xs px-3 py-2 rounded-none status-btn"
                                data-id="${applicant.id}"
                                data-status="shortlisted">
                            <i class="fas fa-star mr-1"></i> Shortlist
                        </button>

                        <button class="btn text-yellow-600 hover:bg-yellow-600 hover:text-white border-0 w-full text-left text-xs px-3 py-2 rounded-none status-btn"
                                data-id="${applicant.id}"
                                data-status="interview">
                            <i class="fas fa-calendar-check mr-1"></i> Interview
                        </button>

                        <button class="btn text-red-600 hover:bg-red-600 hover:text-white border-0 w-full text-left text-xs px-3 py-2 rounded-none status-btn"
                                data-id="${applicant.id}"
                                data-status="rejected">
                            <i class="fas fa-times mr-1"></i> Reject
                        </button>

                        <button class="btn text-green-600 hover:bg-green-600 hover:text-white border-0 w-full text-left text-xs px-3 py-2 rounded-none status-btn"
                                data-id="${applicant.id}"
                                data-status="hired">
                            <i class="fas fa-check mr-1"></i> Hire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

function renderPipelineCard(appItem) {
    const name = appItem.applicant?.name || 'Unknown';
    const avatar = appItem.applicant?.avatar || 'https://ui-avatars.com/api/?name=Unknown';

    return `
        <div class="pipeline-card bg-white p-3 rounded shadow-sm cursor-move w-full" draggable="true" data-id="${appItem.id}">
            <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3 min-w-0">
                    <img src="${avatar}" class="w-10 h-10 rounded-full" alt="${name}">
                    <div class="min-w-0">
                        <div class="font-medium text-gray-800 text-sm truncate">${name}</div>
                        <div class="text-xs text-gray-500 truncate">${appItem.applicant?.currentPosition || appItem.applicant?.email || ''}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button class="view-profile-btn text-xs text-gray-600 hover:text-purple-700" data-id="${appItem.id}" data-user-id="${appItem.userId}">Profile</button>
                    <button class="open-notes-btn text-sm text-gray-500 hover:text-gray-700" data-id="${appItem.id}" title="Internal notes"><i class="fas fa-sticky-note"></i></button>
                </div>
            </div>
        </div>
    `;
}

// ─── Controller ───────────────────────────────────────────────────────────────
export default async function jobApplicantsController(params = {}) {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    const jobId = params.id;

    const job = await mockDataService.getJobById(jobId);
    const rawApplicants = await mockDataService.getApplications({ jobId });
    let allApplicants = await enrichApplicants(rawApplicants);
    let filteredApplicants = [...allApplicants];
    let selectedSkills = [];
    let activeNotesApplicationId = null;

    const groupedApplicants = getGroupedApplicants(allApplicants);

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">

                    <!-- Page header -->
                    <div class="mb-8">
                        <a href="/employer/jobs" data-link class="text-purple-600 hover:text-purple-800 mb-2 inline-block">
                            <i class="fas fa-arrow-left mr-1"></i> Back to My Jobs
                        </a>
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-users text-purple-600 mr-3"></i>
                            Applicants for ${job?.title || 'Job'}
                        </h1>
                        <p class="text-gray-600">Total applicants: <strong>${allApplicants.length}</strong></p>
                    </div>

                    <!-- Pipeline Board -->
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6" id="pipelineBoard">
                        <div class="card p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Under Review</h3>
                            <div class="space-y-2 overflow-hidden flex-1" data-status-column="under_review" id="col-under_review"></div>
                        </div>
                        <div class="card p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Shortlisted</h3>
                            <div class="space-y-2 overflow-hidden flex-1" data-status-column="shortlisted" id="col-shortlisted"></div>
                        </div>
                        <div class="card p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Interview</h3>
                            <div class="space-y-2 overflow-hidden flex-1" data-status-column="interview" id="col-interview"></div>
                        </div>
                        <div class="card p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Hired</h3>
                            <div class="space-y-2 overflow-hidden flex-1" data-status-column="hired" id="col-hired"></div>
                        </div>
                        <div class="card p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Rejected</h3>
                            <div class="space-y-2 overflow-hidden flex-1" data-status-column="rejected" id="col-rejected"></div>
                        </div>
                    </div>

                    <!-- Summary / quick stats -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mb-6">
                        <div class="card text-center p-2 no-hover">
                            <div class="text-xl font-bold text-gray-800" id="summaryUnderReviewCount">${groupedApplicants.under_review.length}</div>
                            <div class="text-xs text-gray-700">Under Review</div>
                        </div>
                        <div class="card text-center p-2 no-hover">
                            <div class="text-xl font-bold text-indigo-600" id="summaryShortlistedCount">${groupedApplicants.shortlisted.length}</div>
                            <div class="text-xs text-gray-700">Shortlisted</div>
                        </div>
                        <div class="card text-center p-2 no-hover">
                            <div class="text-xl font-bold text-yellow-600" id="summaryInterviewCount">${groupedApplicants.interview.length}</div>
                            <div class="text-xs text-gray-700">Interview</div>
                        </div>
                        <div class="card text-center p-2 no-hover">
                            <div class="text-xl font-bold text-green-600" id="summaryHiredCount">${groupedApplicants.hired.length}</div>
                            <div class="text-xs text-gray-700">Hired</div>
                        </div>
                        <div class="card text-center p-2 no-hover">
                            <div class="text-xl font-bold text-red-600" id="summaryRejectedCount">${groupedApplicants.rejected.length}</div>
                            <div class="text-xs text-gray-700">Rejected</div>
                        </div>
                    </div>

                    <!-- Main content: filter sidebar + applicants list -->
                    <div class="grid lg:grid-cols-4 gap-6">

                        <!-- Filters sidebar -->
                        <div class="lg:col-span-1">
                            <div class="card sticky top-4 no-hover">
                                <h3 class="text-lg font-bold text-gray-800 mb-5">
                                    <i class="fa-solid fa-filter mr-2 text-purple-600"></i>Filters
                                </h3>

                                <div class="space-y-5">
                                    <div>
                                        <label class="form-label">Keyword</label>
                                        <div class="relative">
                                            <input type="text" id="searchApplicants"
                                                   class="form-input pr-9"
                                                   placeholder="Name, email…" />
                                            <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="form-label">Application Status</label>
                                        <select id="filterStatus" class="form-input">
                                            ${APPLICATION_STATUSES.map((s) => `<option value="${s.value}">${s.label}</option>`).join('')}
                                        </select>
                                    </div>

                                    <div>
                                        <label class="form-label">Skills</label>
                                        <div id="skillChipsWrapper"
                                             class="form-input flex flex-wrap gap-1.5 min-h-[42px] cursor-text p-1.5"
                                             style="height:auto">
                                            <input id="skillChipInput" type="text"
                                                   class="flex-1 min-w-[80px] border-none outline-none text-sm bg-transparent py-0.5 px-1"
                                                   placeholder="Type a skill…" autocomplete="off" />
                                        </div>
                                        <div id="skillAutocomplete"
                                             class="hidden bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-44 overflow-y-auto z-50 relative">
                                        </div>
                                    </div>

                                    <div>
                                        <label class="form-label">Experience Level</label>
                                        <select id="filterExperienceLevel" class="form-input">
                                            ${EXPERIENCE_LEVELS.map((e) => `<option value="${e.value}">${e.label}</option>`).join('')}
                                        </select>
                                    </div>

                                    <div class="pt-1">
                                        <button id="clearFiltersBtn" class="btn btn-secondary w-full">
                                            <i class="fas fa-undo mr-2"></i>Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Results panel -->
                        <div class="lg:col-span-3">
                            <div class="card mb-4 no-hover">
                                <div class="flex flex-wrap justify-between items-center gap-3">
                                    <h3 class="text-xl font-bold text-gray-800">
                                        <span id="applicantCount">${allApplicants.length}</span>
                                        <span class="font-normal text-gray-500 text-base"> applicants found</span>
                                    </h3>
                                    <select id="sortApplicants" class="form-input w-60">
                                        ${SORT_OPTIONS.map((o) => `<option value="${o.value}">${o.label}</option>`).join('')}
                                    </select>
                                </div>
                            </div>

                            <div id="activeFiltersBar"></div>

                            <div id="applicantsContainer" class="space-y-4">
                                ${allApplicants.map((a) => renderApplicantCard(a)).join('')}
                            </div>

                            <div id="noApplicants" class="card text-center py-16 hidden">
                                <i class="fas fa-user-slash text-gray-200 text-6xl mb-4"></i>
                                <p class="text-gray-500 text-lg font-medium mb-1">No applicants match your filters</p>
                                <p class="text-gray-400 text-sm">Try adjusting or clearing your filters</p>
                                <button id="emptyStateClear" class="btn btn-secondary mt-4">Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Profile Modal -->
        <div id="profileModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Candidate Profile</h2>
                    <button id="closeProfileModal" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div id="profileContent" class="p-6"></div>
            </div>
        </div>

        <!-- Notes Modal (internal notes, company-only edit) -->
        <div id="notesModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-xl w-full mx-4">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 id="notesModalTitle" class="text-lg font-semibold">Internal Notes</h3>
                    <button id="closeNotesModal" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times text-xl"></i></button>
                </div>
                <div class="p-6">
                    <div id="notesMeta" class="text-xs text-gray-500 mb-2"></div>
                    <textarea id="notesTextarea" class="w-full border rounded p-3 h-40" placeholder="Add internal notes about this candidate"></textarea>
                    <div class="mt-4 flex justify-end gap-2">
                        <button id="cancelNotesBtn" class="btn btn-secondary px-3 py-1">Cancel</button>
                        <button id="saveNotesBtn" class="btn btn-primary px-3 py-1">Save Notes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    addDragDropStyles();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    const profileModal = document.getElementById('profileModal');
    const profileContent = document.getElementById('profileContent');
    const notesModal = document.getElementById('notesModal');
    const notesTextarea = document.getElementById('notesTextarea');
    const notesMeta = document.getElementById('notesMeta');
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    const closeNotesBtn = document.getElementById('closeNotesModal');
    const cancelNotesBtn = document.getElementById('cancelNotesBtn');

    const getApplicantById = (id) => allApplicants.find((a) => String(a.id) === String(id));

    const canEditNotes = () => {
        if (!user || user.role !== 'employer') return false;
        if (!job?.companyId) return true;
        return user.companyId === job.companyId;
    };

    const updateSummaryCounts = () => {
        document.getElementById('summaryUnderReviewCount').textContent = allApplicants.filter((a) =>
            ['pending', 'under_review', 'applied'].includes(a.status)
        ).length;
        document.getElementById('summaryShortlistedCount').textContent = allApplicants.filter(
            (a) => a.status === 'shortlisted'
        ).length;
        document.getElementById('summaryInterviewCount').textContent = allApplicants.filter(
            (a) => a.status === 'interview'
        ).length;
        document.getElementById('summaryHiredCount').textContent = allApplicants.filter(
            (a) => a.status === 'hired'
        ).length;
        document.getElementById('summaryRejectedCount').textContent = allApplicants.filter(
            (a) => a.status === 'rejected'
        ).length;
    };

    const renderPipeline = () => {
        const cols = {
            under_review: document.getElementById('col-under_review'),
            shortlisted: document.getElementById('col-shortlisted'),
            interview: document.getElementById('col-interview'),
            hired: document.getElementById('col-hired'),
            rejected: document.getElementById('col-rejected'),
        };

        Object.values(cols).forEach((column) => {
            if (column) column.innerHTML = '';
        });

        allApplicants.forEach((applicant) => {
            const columnKey = statusToColumn(applicant.status);
            const column = cols[columnKey];
            if (!column) return;

            const wrapper = document.createElement('div');
            wrapper.innerHTML = renderPipelineCard(applicant).trim();
            const card = wrapper.firstElementChild;
            if (card) column.appendChild(card);
        });

        updateSummaryCounts();
    };

    const readFilters = () => ({
        search: document.getElementById('searchApplicants').value.trim(),
        status: document.getElementById('filterStatus').value,
        skills: selectedSkills.join(','),
        experienceLevel: document.getElementById('filterExperienceLevel').value,
    });

    const applySort = (skillTokens = []) => {
        const sort = document.getElementById('sortApplicants').value;
        filteredApplicants.sort((a, b) => {
            switch (sort) {
                case 'name_asc':
                    return (a.applicant?.name || '').localeCompare(b.applicant?.name || '');
                case 'name_desc':
                    return (b.applicant?.name || '').localeCompare(a.applicant?.name || '');
                case 'applied_asc':
                    return new Date(a.appliedAt) - new Date(b.appliedAt);
                case 'skill_match':
                    return (
                        skillMatchCount(b._skills, skillTokens) -
                        skillMatchCount(a._skills, skillTokens)
                    );
                case 'applied_desc':
                default:
                    return new Date(b.appliedAt) - new Date(a.appliedAt);
            }
        });
    };

    const clearAll = () => {
        document.getElementById('searchApplicants').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterExperienceLevel').value = '';
        selectedSkills = [];
        renderChips();
        const chipInput = document.getElementById('skillChipInput');
        const autocompleteEl = document.getElementById('skillAutocomplete');
        chipInput.value = '';
        autocompleteEl.classList.add('hidden');
        filteredApplicants = [...allApplicants];
        applySort([]);
        updateDisplay([], {});
    };

    const updateDisplay = (skillTokens = [], filters = {}) => {
        const container = document.getElementById('applicantsContainer');
        const noRes = document.getElementById('noApplicants');
        const count = document.getElementById('applicantCount');
        const tagsBar = document.getElementById('activeFiltersBar');

        count.textContent = filteredApplicants.length;
        tagsBar.innerHTML = renderActiveFilters(filters);

        if (filteredApplicants.length === 0) {
            container.classList.add('hidden');
            noRes.classList.remove('hidden');
        } else {
            container.classList.remove('hidden');
            noRes.classList.add('hidden');
            container.innerHTML = filteredApplicants
                .map((a) => renderApplicantCard(a, skillTokens))
                .join('');
        }

        tagsBar.querySelectorAll('.remove-filter-tag').forEach((btn) => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                if (key.startsWith('skill:')) {
                    const skillToRemove = key.slice(6);
                    selectedSkills = selectedSkills.filter((s) => s !== skillToRemove);
                    renderChips();
                } else {
                    const fieldMap = {
                        search: 'searchApplicants',
                        status: 'filterStatus',
                        experienceLevel: 'filterExperienceLevel',
                    };
                    const el = document.getElementById(fieldMap[key]);
                    if (el) el.value = '';
                }
                applyFilters();
            });
        });

        const clearAllBtn = document.getElementById('clearAllFilters');
        if (clearAllBtn) clearAllBtn.addEventListener('click', clearAll);
    };

    const applyFilters = () => {
        const f = readFilters();
        const skillTokens = selectedSkills.map((s) => s.toLowerCase());

        filteredApplicants = allApplicants.filter((a) => {
            const name = a.applicant?.name || '';
            const email = a.applicant?.email || '';
            const searchMatch =
                !f.search ||
                name.toLowerCase().includes(f.search.toLowerCase()) ||
                email.toLowerCase().includes(f.search.toLowerCase());

            const statusMatch = !f.status || a.status === f.status;
            const skillsOk = skillsMatch(a._skills, skillTokens);
            const expMatch = !f.experienceLevel || a._experienceLevel === f.experienceLevel;

            return searchMatch && statusMatch && skillsOk && expMatch;
        });

        applySort(skillTokens);
        updateDisplay(skillTokens, f);
    };

    const renderChips = () => {
        const wrapper = document.getElementById('skillChipsWrapper');
        const input = document.getElementById('skillChipInput');
        wrapper.querySelectorAll('.skill-chip').forEach((el) => el.remove());
        selectedSkills.forEach((skill) => {
            const chip = document.createElement('span');
            chip.className =
                'skill-chip inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-400 rounded px-2 py-0.5 text-xs font-semibold';
            chip.innerHTML = `${skill}<button type="button" class="remove-chip ml-1 hover:text-red-900" data-skill="${skill}" aria-label="Remove">&times;</button>`;
            wrapper.insertBefore(chip, input);
        });
        wrapper.querySelectorAll('.remove-chip').forEach((btn) => {
            btn.addEventListener('click', () => {
                selectedSkills = selectedSkills.filter((s) => s !== btn.dataset.skill);
                renderChips();
                applyFilters();
            });
        });
    };

    const addSkillChip = (skill) => {
        const trimmed = skill.trim();
        if (!trimmed) return;
        if (selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
        const canonical =
            SKILL_POOL.find((p) => p.toLowerCase() === trimmed.toLowerCase()) || trimmed;
        selectedSkills.push(canonical);
        renderChips();
        applyFilters();
    };

    const updateApplicantStatus = async (applicationId, newStatus) => {
        await mockDataService.updateApplicationStatus(applicationId, newStatus);

        const applicant = getApplicantById(applicationId);
        if (applicant) {
            applicant.status = newStatus;
            applicant.updatedAt = new Date().toISOString();
        }

        renderPipeline();
        applyFilters();
    };

    const openApplicantProfile = async (applicationId, userId) => {
        const applicant = getApplicantById(applicationId);
        if (!applicant) return;

        const cvProfile = await mockDataService.getCVProfile(userId);
        const applicantName = applicant.applicant?.name || 'Unknown';
        const applicantEmail = applicant.applicant?.email || '';
        const applicantAvatar =
            applicant.applicant?.avatar || 'https://ui-avatars.com/api/?name=Unknown';

        let profileHtml = `
            <div class="mb-6 pb-6 border-b border-gray-200">
                <div class="flex items-start gap-4">
                    <img src="${applicantAvatar}" alt="${applicantName}" class="w-20 h-20 rounded-full">
                    <div class="flex-1">
                        <h3 class="text-2xl font-bold text-gray-800">${applicantName}</h3>
                        <p class="text-gray-600">${applicantEmail}</p>
                        ${applicant.applicant?.currentPosition ? `<p class="text-sm text-gray-600 mt-1"><i class="fas fa-briefcase mr-1"></i> ${applicant.applicant.currentPosition}</p>` : ''}
                    </div>
                </div>
            </div>
        `;

        if (applicant.coverLetter) {
            profileHtml += `
                <div class="mb-6 pb-6 border-b border-gray-200">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-envelope text-indigo-600 mr-2"></i> Cover Letter
                    </h4>
                    <p class="text-gray-700 italic">${applicant.coverLetter}</p>
                </div>
            `;
        }

        profileHtml += renderProfileSection(cvProfile);
        profileContent.innerHTML = profileHtml;
        profileModal.classList.remove('hidden');
    };

    const openNotesModal = (applicationId) => {
        const appItem = getApplicantById(applicationId);
        if (!appItem) return;

        activeNotesApplicationId = applicationId;
        notesTextarea.value = appItem.notes || '';
        notesMeta.textContent = appItem.updatedAt
            ? `Last updated: ${new Date(appItem.updatedAt).toLocaleString()}`
            : 'No notes yet';

        if (!canEditNotes()) {
            notesTextarea.setAttribute('readonly', 'true');
            saveNotesBtn.setAttribute('disabled', 'true');
            saveNotesBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            notesTextarea.removeAttribute('readonly');
            saveNotesBtn.removeAttribute('disabled');
            saveNotesBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        notesModal.classList.remove('hidden');
        notesModal.classList.add('flex');
    };

    const closeNotesModal = () => {
        activeNotesApplicationId = null;
        notesModal.classList.add('hidden');
        notesModal.classList.remove('flex');
    };

    const highlightColumn = (column, active) => {
        if (!column) return;
        column.classList.toggle('bg-blue-50', active);
        column.classList.toggle('border-2', active);
        column.classList.toggle('border-blue-400', active);
    };

    // ─── Modal event handlers ────────────────────────────────────────────────
    document
        .getElementById('closeProfileModal')
        .addEventListener('click', () => profileModal.classList.add('hidden'));

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.classList.add('hidden');
    });

    saveNotesBtn.addEventListener('click', async () => {
        if (!activeNotesApplicationId || !canEditNotes()) return;

        const value = notesTextarea.value;
        await mockDataService.updateApplicationNotes(activeNotesApplicationId, value);

        const applicant = getApplicantById(activeNotesApplicationId);
        if (applicant) {
            applicant.notes = value;
            applicant.updatedAt = new Date().toISOString();
        }

        renderPipeline();
        applyFilters();
        closeNotesModal();
    });

    closeNotesBtn.addEventListener('click', closeNotesModal);
    cancelNotesBtn.addEventListener('click', closeNotesModal);
    notesModal.addEventListener('click', (e) => {
        if (e.target === notesModal) closeNotesModal();
    });

    // ─── Filter and skill-chip event handlers ────────────────────────────────
    const chipInput = document.getElementById('skillChipInput');
    const autocompleteEl = document.getElementById('skillAutocomplete');
    const chipsWrapper = document.getElementById('skillChipsWrapper');

    chipsWrapper.addEventListener('click', () => chipInput.focus());

    const showAutocomplete = (suggestions) => {
        if (!suggestions.length) {
            autocompleteEl.classList.add('hidden');
            return;
        }
        autocompleteEl.innerHTML = suggestions
            .map(
                (s) =>
                    `<div class="autocomplete-item px-3 py-2 text-sm cursor-pointer hover:bg-red-50 hover:text-red-700 font-medium" data-skill="${s}">${s}</div>`
            )
            .join('');
        autocompleteEl.classList.remove('hidden');
        autocompleteEl.querySelectorAll('.autocomplete-item').forEach((item) => {
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                addSkillChip(item.dataset.skill);
                chipInput.value = '';
                autocompleteEl.classList.add('hidden');
                chipInput.focus();
            });
        });
    };

    chipInput.addEventListener('input', () => {
        const val = chipInput.value.trim().toLowerCase();
        if (!val) {
            autocompleteEl.classList.add('hidden');
            return;
        }
        const suggestions = SKILL_POOL.filter(
            (s) =>
                s.toLowerCase().includes(val) &&
                !selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
        ).slice(0, 8);
        showAutocomplete(suggestions);
    });

    chipInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = chipInput.value.trim().replace(/,$/, '');
            if (val) {
                addSkillChip(val);
                chipInput.value = '';
            }
            autocompleteEl.classList.add('hidden');
        } else if (e.key === 'Backspace' && !chipInput.value && selectedSkills.length) {
            selectedSkills.pop();
            renderChips();
            applyFilters();
        } else if (e.key === 'Escape') {
            autocompleteEl.classList.add('hidden');
        }
    });

    chipInput.addEventListener('blur', () => {
        setTimeout(() => autocompleteEl.classList.add('hidden'), 150);
    });

    document.getElementById('searchApplicants').addEventListener('input', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterExperienceLevel').addEventListener('change', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearAll);
    document.getElementById('sortApplicants').addEventListener('change', () => {
        const skillTokens = selectedSkills.map((s) => s.toLowerCase());
        applySort(skillTokens);
        updateDisplay(skillTokens, readFilters());
    });
    document.getElementById('noApplicants').addEventListener('click', (e) => {
        if (e.target.closest('#emptyStateClear')) clearAll();
    });

    // ─── Delegated card/list/pipeline actions ────────────────────────────────
    const closeAllStatusMenus = () => {
        document.querySelectorAll('.status-menu').forEach((menu) => {
            menu.classList.add('hidden');
        });
    };

    const handleActionClick = async (e) => {
        const viewBtn = e.target.closest('.view-profile-btn');
        const statusBtn = e.target.closest('.status-btn');
        const notesBtn = e.target.closest('.open-notes-btn');

        if (viewBtn) {
            e.preventDefault();
            e.stopPropagation();
            await openApplicantProfile(viewBtn.dataset.id, viewBtn.dataset.userId);
        } else if (notesBtn) {
            e.preventDefault();
            e.stopPropagation();
            openNotesModal(notesBtn.dataset.id);
        } else if (statusBtn) {
            e.preventDefault();
            e.stopPropagation();
            closeAllStatusMenus();
            await updateApplicantStatus(statusBtn.dataset.id, statusBtn.dataset.status);
        }
    };

    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.status-toggle');
        if (toggle) {
            e.stopPropagation();
            const menu = toggle.parentElement.querySelector('.status-menu');
            if (menu) {
                closeAllStatusMenus();
                menu.classList.toggle('hidden');
            }
            return;
        }

        closeAllStatusMenus();
    });

    document.getElementById('applicantsContainer').addEventListener('click', handleActionClick);

    const pipelineBoard = document.getElementById('pipelineBoard');
    pipelineBoard.addEventListener('click', handleActionClick);

    pipelineBoard.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.pipeline-card');
        if (!card) return;
        e.dataTransfer.setData('text/plain', card.dataset.id);
        card.classList.add('opacity-40');
    });

    pipelineBoard.addEventListener('dragend', (e) => {
        const card = e.target.closest('.pipeline-card');
        if (card) card.classList.remove('opacity-40');
        document
            .querySelectorAll('[data-status-column]')
            .forEach((column) => highlightColumn(column, false));
    });

    pipelineBoard.addEventListener('dragover', (e) => {
        const column = e.target.closest('[data-status-column]');
        if (!column) return;
        e.preventDefault();
        highlightColumn(column, true);
    });

    pipelineBoard.addEventListener('dragleave', (e) => {
        const column = e.target.closest('[data-status-column]');
        if (column && !column.contains(e.relatedTarget)) {
            highlightColumn(column, false);
        }
    });

    pipelineBoard.addEventListener('drop', async (e) => {
        e.preventDefault();
        document
            .querySelectorAll('[data-status-column]')
            .forEach((column) => highlightColumn(column, false));

        const column = e.target.closest('[data-status-column]');
        if (!column) return;

        const appId = e.dataTransfer.getData('text/plain');
        if (!appId) return;

        const targetKey = column.getAttribute('data-status-column');
        const statusMap = {
            under_review: 'under_review',
            shortlisted: 'shortlisted',
            interview: 'interview',
            hired: 'hired',
            rejected: 'rejected',
        };

        await updateApplicantStatus(appId, statusMap[targetKey] || 'under_review');
    });

    // Initial render
    renderPipeline();
    applyFilters();
}
