/**
 * Candidates Search Controller (Employer)
 * Browse and search students/alumni for recruitment
 *
 * User story: "As an employer, I want to filter candidates
 * so that I can quickly find suitable applicants"
 *
 * Acceptance criteria:
 *  - Filter by skills, experience level, or status
 *  - Sort by relevance or application date
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const EXPERIENCE_LEVELS = [
    { value: '', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level (0-2 yrs)' },
    { value: 'mid', label: 'Mid Level (2-5 yrs)' },
    { value: 'senior', label: 'Senior (5+ yrs)' },
    { value: 'intern', label: 'Intern' },
];

const CANDIDATE_STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'open', label: 'Open to Offers' },
    { value: 'not_looking', label: 'Not Looking' },
];

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Sort by Relevance' },
    { value: 'name_asc', label: 'Name (A → Z)' },
    { value: 'name_desc', label: 'Name (Z → A)' },
    { value: 'applied_desc', label: 'Application Date (Newest)' },
    { value: 'applied_asc', label: 'Application Date (Oldest)' },
    { value: 'students', label: 'Students First' },
    { value: 'alumni', label: 'Alumni First' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Enrich mock users with extra fields (experience level, status, applied date,
 * skills) that the mockDataService doesn't return yet. In Phase 2 these will
 * come directly from the API.
 */
function enrichCandidates(candidates) {
    const levels = ['intern', 'entry', 'mid', 'senior'];
    const statuses = ['available', 'open', 'not_looking'];
    const skillPool = [
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
        'HTML',
        'CSS',
        'Git',
        'REST API',
        'GraphQL',
        'Tailwind CSS',
    ];

    return candidates.map((c, i) => {
        // Stable but varied values based on index so the UI looks realistic
        const seed = i + 1;
        const candidateSkills = skillPool
            .filter((_, si) => (si + seed) % 3 === 0)
            .slice(0, 4 + (seed % 3));
        return {
            ...c,
            skills: c.skills?.length ? c.skills : candidateSkills,
            experienceLevel: c.experienceLevel || levels[seed % levels.length],
            jobStatus: c.jobStatus || statuses[seed % statuses.length],
            // Simulate applied-at timestamps spread over the last 60 days
            appliedAt:
                c.appliedAt || new Date(Date.now() - seed * 5 * 24 * 60 * 60 * 1000).toISOString(),
            // Fake relevance score (0–100) – Phase 2 will come from backend
            relevanceScore: c.relevanceScore ?? Math.max(20, 100 - seed * 7),
        };
    });
}

// ─── Skills chip autocomplete pool ───────────────────────────────────────────
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
    'HTML',
    'CSS',
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
 * Alias map — when user types a canonical skill, also match these variants
 * in the candidate's CV (and vice versa). Keys and values are all lowercase.
 */
const SKILL_ALIASES = {
    html5: ['html'],
    html: ['html5'],
    css3: ['css'],
    css: ['css3'],
};

/** Helper — true if token or any of its aliases appears in the candidate's skill list */
function skillMatches(token, candidateSkillsLower) {
    if (candidateSkillsLower.includes(token)) return true;
    const aliases = SKILL_ALIASES[token] || [];
    return aliases.some((alias) => candidateSkillsLower.includes(alias));
}

/** Returns true when every required skill token (or alias) matches at least one candidate skill. */
function skillsMatch(candidateSkills, requiredTokens) {
    if (!requiredTokens.length) return true;
    const lower = (candidateSkills || []).map((s) => s.toLowerCase());
    return requiredTokens.every((token) => skillMatches(token, lower));
}

/** Returns the number of skill tokens (or aliases) matched (for relevance display). */
function skillMatchCount(candidateSkills, requiredTokens) {
    if (!requiredTokens.length) return 0;
    const lower = (candidateSkills || []).map((s) => s.toLowerCase());
    return requiredTokens.filter((token) => skillMatches(token, lower)).length;
}

// ─── Rendering helpers ────────────────────────────────────────────────────────

function experienceLabel(level) {
    return EXPERIENCE_LEVELS.find((e) => e.value === level)?.label || level || '—';
}

function statusBadge(status) {
    const map = {
        available: 'bg-red-100 text-red-800',
        open: 'bg-blue-100 text-blue-800',
        not_looking: 'bg-gray-100 text-gray-600',
    };
    const labelMap = {
        available: 'Available',
        open: 'Open to Offers',
        not_looking: 'Not Looking',
    };
    const cls = map[status] || 'bg-gray-100 text-gray-500';
    return `<span class="px-2 py-0.5 rounded-full text-xs font-semibold ${cls}">${labelMap[status] || status}</span>`;
}

function roleBadge(role) {
    const cls = role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-700';
    return `<span class="px-2 py-0.5 rounded-full text-xs font-semibold ${cls}">${role === 'student' ? 'Student' : 'Alumni'}</span>`;
}

function formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
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
    if (filters.type)
        tags.push({
            key: 'type',
            label: filters.type === 'student' ? 'Students only' : 'Alumni only',
        });
    if (filters.skills) {
        filters.skills.split(',').forEach((skill) => {
            tags.push({ key: `skill:${skill.trim()}`, label: skill.trim() });
        });
    }
    if (filters.experienceLevel) {
        const lbl = EXPERIENCE_LEVELS.find((e) => e.value === filters.experienceLevel)?.label;
        tags.push({ key: 'experienceLevel', label: lbl });
    }
    if (filters.jobStatus) {
        const lbl = CANDIDATE_STATUSES.find((s) => s.value === filters.jobStatus)?.label;
        tags.push({ key: 'jobStatus', label: lbl });
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

function renderCandidateCard(candidate, matchedTokens = []) {
    const isPrivate = candidate.profileVisibility === 'private';
    const matchCount = skillMatchCount(candidate.skills, matchedTokens);
    const totalRequired = matchedTokens.length;
    const showMatchBar = totalRequired > 0;

    return `
        <div class="candidate-card card hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-100"
             data-id="${candidate.id}">
            <div class="flex gap-5">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                    <img src="${candidate.avatar}" alt="${candidate.name}"
                         class="w-20 h-20 rounded-2xl object-cover border-2 border-purple-100 shadow-sm" />
                </div>

                <!-- Main info -->
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap justify-between items-start gap-2 mb-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="text-lg font-bold text-gray-800">
                                ${candidate.name}
                                ${isPrivate ? '<i class="fas fa-lock text-gray-400 text-xs ml-1"></i>' : ''}
                            </h3>
                            ${roleBadge(candidate.role)}
                            ${statusBadge(candidate.jobStatus)}
                        </div>
                        <span class="text-xs text-gray-400 whitespace-nowrap">
                            Applied ${formatDate(candidate.appliedAt)}
                        </span>
                    </div>

                    <p class="text-purple-700 font-semibold text-sm mb-0.5">${candidate.currentPosition || 'Candidate'}</p>
                    <p class="text-gray-500 text-sm mb-1">${candidate.educationDegree || 'Degree not specified'}</p>

                    <div class="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <i class="fas fa-layer-group text-gray-400"></i>
                        <span>${experienceLabel(candidate.experienceLevel)}</span>
                    </div>

                    <!-- Skill tags -->
                    <div class="flex flex-wrap gap-1.5 mb-3">
                        ${renderSkillTags(candidate.skills, matchedTokens)}
                    </div>

                    <!-- Skill match bar -->
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

                    <!-- Actions -->
                    <div class="flex flex-wrap gap-2">
                        <button class="btn btn-primary text-xs py-1.5 px-4"
                                onclick="viewCandidateProfile('${candidate.id}')">
                            <i class="fas fa-user mr-1.5"></i>View Profile
                        </button>
                        <button class="btn btn-secondary text-xs py-1.5 px-4"
                                onclick="saveCandidate('${candidate.id}')">
                            <i class="fas fa-bookmark mr-1.5"></i>Save
                        </button>
                        ${
                            isPrivate
                                ? `<button class="btn btn-secondary text-xs py-1.5 px-4"
                                       onclick="requestAccess('${candidate.id}')">
                                   <i class="fas fa-unlock-alt mr-1.5"></i>Request Access
                               </button>`
                                : `<button class="btn btn-secondary text-xs py-1.5 px-4 contact-btn"
                                       data-id="${candidate.id}">
                                   <i class="fas fa-envelope mr-1.5"></i>Contact
                               </button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCandidatesGrid(candidates, matchedTokens = []) {
    if (!candidates.length) return '';
    return candidates.map((c) => renderCandidateCard(c, matchedTokens)).join('');
}

function renderContactModal() {
    return `
        <div id="contactModal" class="modal-overlay hidden">
            <div class="modal-content">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-1">Contact Candidate</h2>
                        <p class="text-gray-600 text-sm" id="contactModalCandidateName"></p>
                    </div>
                    <button type="button" id="closeContactModal" class="btn btn-secondary btn-sm">&times;</button>
                </div>
                <div class="space-y-4">
                    <input type="hidden" id="contactCandidateId" />
                    <div>
                        <label class="form-label" for="contactSubject">Subject</label>
                        <input type="text" id="contactSubject" class="form-input" required placeholder="Subject" />
                    </div>
                    <div>
                        <label class="form-label" for="contactMessage">Message</label>
                        <textarea id="contactMessage" class="form-input h-32" required placeholder="Write your message..."></textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button type="button" id="cancelContactBtn" class="btn btn-secondary">Cancel</button>
                        <button id="sendContactBtn" class="btn btn-primary">Send message</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ─── Controller ───────────────────────────────────────────────────────────────

export default async function candidatesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    const students = await mockDataService.getUsersByRole('student');
    const alumni = await mockDataService.getUsersByRole('alumni');
    const combined = [...students, ...alumni];

    // Fetch CV for each candidate and merge the real skills from the user's CV.
    // getCVProfile() returns an empty CVProfile if no CV exists — in that case,
    // enrichCandidates() will generate fallback synthetic skills.
    const cvProfiles = await Promise.all(combined.map((c) => mockDataService.getCVProfile(c.id)));
    const withCvSkills = combined.map((c, i) => ({
        ...c,
        skills: cvProfiles[i]?.skills?.length ? cvProfiles[i].skills : undefined,
    }));

    const allCandidates = enrichCandidates(withCvSkills);

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}

        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">

                    <!-- Page header -->
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-users text-purple-600 mr-3"></i>
                            Candidate Search
                        </h1>
                        <p class="text-gray-600">Browse students and alumni from Avenga Academy</p>
                    </div>

                    <div class="grid lg:grid-cols-4 gap-6">

                        <!-- ── Filters sidebar ── -->
                        <div class="lg:col-span-1">
                            <div class="card sticky top-4">
                                <h3 class="text-lg font-bold text-gray-800 mb-5">
                                    <i class="fa-solid fa-filter mr-2 text-purple-600"></i>Filters
                                </h3>

                                <div class="space-y-5">

                                    <!-- Keyword search -->
                                    <div>
                                        <label class="form-label">Keyword</label>
                                        <div class="relative">
                                            <input type="text" id="searchCandidates"
                                                   class="form-input pr-9"
                                                   placeholder="Name, position, degree…" />
                                            <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                                        </div>
                                    </div>

                                    <!-- Type -->
                                    <div>
                                        <label class="form-label">Type</label>
                                        <select id="filterType" class="form-input">
                                            <option value="">All</option>
                                            <option value="student">Students Only</option>
                                            <option value="alumni">Alumni Only</option>
                                        </select>
                                    </div>

                                    <!-- Skills chip input -->
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

                                    <!-- Experience level -->
                                    <div>
                                        <label class="form-label">Experience Level</label>
                                        <select id="filterExperienceLevel" class="form-input">
                                            ${EXPERIENCE_LEVELS.map(
                                                (e) =>
                                                    `<option value="${e.value}">${e.label}</option>`
                                            ).join('')}
                                        </select>
                                    </div>

                                    <!-- Candidate status -->
                                    <div>
                                        <label class="form-label">Availability Status</label>
                                        <select id="filterJobStatus" class="form-input">
                                            ${CANDIDATE_STATUSES.map(
                                                (s) =>
                                                    `<option value="${s.value}">${s.label}</option>`
                                            ).join('')}
                                        </select>
                                    </div>

                                    <!-- Profile visibility -->
                                    <div>
                                        <label class="form-label">Profile Visibility</label>
                                        <select id="filterVisibility" class="form-input">
                                            <option value="">All</option>
                                            <option value="public">Public Only</option>
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

                        <!-- ── Results panel ── -->
                        <div class="lg:col-span-3">

                            <!-- Toolbar -->
                            <div class="card mb-4">
                                <div class="flex flex-wrap justify-between items-center gap-3">
                                    <h3 class="text-xl font-bold text-gray-800">
                                        <span id="candidateCount">${allCandidates.length}</span>
                                        <span class="font-normal text-gray-500 text-base"> candidates found</span>
                                    </h3>
                                    <select id="sortCandidates" class="form-input w-56">
                                        ${SORT_OPTIONS.map(
                                            (o) => `<option value="${o.value}">${o.label}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                            </div>

                            <!-- Active filter tags -->
                            <div id="activeFiltersBar"></div>

                            <!-- Grid -->
                            <div id="candidatesGrid" class="space-y-4">
                                ${renderCandidatesGrid(allCandidates)}
                            </div>

                            <!-- Empty state -->
                            <div id="noCandidates" class="card text-center py-16 hidden">
                                <i class="fas fa-user-slash text-red-200 text-6xl mb-4"></i>
                                <p class="text-gray-500 text-lg font-medium mb-1">No candidates match your filters</p>
                                <p class="text-gray-400 text-sm">Try adjusting or clearing your filters</p>
                                <button id="emptyStateClear" class="btn btn-secondary mt-4">Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        ${renderContactModal()}
    `;

    setupEventListeners(allCandidates);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

// ─── Event listeners & filter logic ──────────────────────────────────────────

function setupEventListeners(allCandidates) {
    let filteredCandidates = [...allCandidates];
    let currentSort = 'relevance';

    // ── Skills chips state ─────────────────────────────────────────────────
    let selectedSkills = []; // array of display-name strings e.g. ['React', 'Node.js']

    const renderChips = () => {
        const wrapper = document.getElementById('skillChipsWrapper');
        const input = document.getElementById('skillChipInput');
        // Remove existing chips (keep the input)
        wrapper.querySelectorAll('.skill-chip').forEach((el) => el.remove());
        // Prepend chips before the input
        selectedSkills.forEach((skill) => {
            const chip = document.createElement('span');
            chip.className =
                'skill-chip inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-400 rounded px-2 py-0.5 text-xs font-semibold';
            chip.innerHTML = `${skill}<button type="button" class="remove-chip ml-1 hover:text-red-900" data-skill="${skill}" aria-label="Remove">&times;</button>`;
            wrapper.insertBefore(chip, input);
        });
        // Remove chip click
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
        // Case-insensitive duplicate check
        if (selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
        // Prefer canonical name from pool, else use as-typed
        const canonical =
            SKILL_POOL.find((p) => p.toLowerCase() === trimmed.toLowerCase()) || trimmed;
        selectedSkills.push(canonical);
        renderChips();
        applyFilters();
    };

    // ── Read current filter values ──────────────────────────────────────────
    const readFilters = () => ({
        search: document.getElementById('searchCandidates').value.trim(),
        type: document.getElementById('filterType').value,
        skills: selectedSkills.join(','),
        experienceLevel: document.getElementById('filterExperienceLevel').value,
        jobStatus: document.getElementById('filterJobStatus').value,
        visibility: document.getElementById('filterVisibility').value,
    });

    // ── Apply filter logic ──────────────────────────────────────────────────
    const applyFilters = () => {
        const f = readFilters();
        const skillTokens = selectedSkills.map((s) => s.toLowerCase());

        filteredCandidates = allCandidates.filter((c) => {
            const searchMatch =
                !f.search ||
                [c.name, c.currentPosition, c.educationDegree].some((v) =>
                    v?.toLowerCase().includes(f.search.toLowerCase())
                );

            const typeMatch = !f.type || c.role === f.type;
            const skillsOk = skillsMatch(c.skills, skillTokens);
            const expMatch = !f.experienceLevel || c.experienceLevel === f.experienceLevel;
            const statusMatch = !f.jobStatus || c.jobStatus === f.jobStatus;
            const visibilityMatch = !f.visibility || c.profileVisibility === f.visibility;

            return (
                searchMatch && typeMatch && skillsOk && expMatch && statusMatch && visibilityMatch
            );
        });

        applySort();
        updateDisplay(skillTokens, f);
    };

    // ── Sort ────────────────────────────────────────────────────────────────
    const applySort = () => {
        const sort = document.getElementById('sortCandidates').value;
        currentSort = sort;

        filteredCandidates.sort((a, b) => {
            switch (sort) {
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    return b.name.localeCompare(a.name);
                case 'applied_desc':
                    return new Date(b.appliedAt) - new Date(a.appliedAt);
                case 'applied_asc':
                    return new Date(a.appliedAt) - new Date(b.appliedAt);
                case 'students':
                    return a.role === 'student' ? -1 : 1;
                case 'alumni':
                    return a.role === 'alumni' ? -1 : 1;
                case 'relevance':
                default:
                    return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
            }
        });
    };

    // ── Update DOM ──────────────────────────────────────────────────────────
    const updateDisplay = (skillTokens = [], filters = {}) => {
        const grid = document.getElementById('candidatesGrid');
        const noRes = document.getElementById('noCandidates');
        const count = document.getElementById('candidateCount');
        const tagsBar = document.getElementById('activeFiltersBar');

        count.textContent = filteredCandidates.length;
        tagsBar.innerHTML = renderActiveFilters(filters);

        if (filteredCandidates.length === 0) {
            grid.classList.add('hidden');
            noRes.classList.remove('hidden');
        } else {
            grid.classList.remove('hidden');
            noRes.classList.add('hidden');
            grid.innerHTML = renderCandidatesGrid(filteredCandidates, skillTokens);
            // Re-attach contact buttons after re-render
            attachContactButtons();
        }

        // Remove-filter tag buttons
        tagsBar.querySelectorAll('.remove-filter-tag').forEach((btn) => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                if (key.startsWith('skill:')) {
                    const skillToRemove = key.slice(6);
                    selectedSkills = selectedSkills.filter((s) => s !== skillToRemove);
                    renderChips();
                } else {
                    const fieldMap = {
                        search: 'searchCandidates',
                        type: 'filterType',
                        experienceLevel: 'filterExperienceLevel',
                        jobStatus: 'filterJobStatus',
                        visibility: 'filterVisibility',
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

    // ── Clear all ───────────────────────────────────────────────────────────
    const clearAll = () => {
        [
            'searchCandidates',
            'filterType',
            'filterExperienceLevel',
            'filterJobStatus',
            'filterVisibility',
        ].forEach((id) => {
            document.getElementById(id).value = '';
        });
        selectedSkills = [];
        renderChips();
        document.getElementById('skillChipInput').value = '';
        document.getElementById('skillAutocomplete').classList.add('hidden');
        filteredCandidates = [...allCandidates];
        applySort();
        updateDisplay([], {});
    };

    // ── Live filtering — се применува веднаш при секоја промена ────────────
    ['filterType', 'filterExperienceLevel', 'filterJobStatus', 'filterVisibility'].forEach((id) => {
        document.getElementById(id).addEventListener('change', applyFilters);
    });
    document.getElementById('searchCandidates').addEventListener('input', applyFilters);

    // ── Chips + autocomplete setup ──────────────────────────────────────────
    const chipInput = document.getElementById('skillChipInput');
    const autocompleteEl = document.getElementById('skillAutocomplete');
    const chipsWrapper = document.getElementById('skillChipsWrapper');

    // Focus the input when clicking anywhere on the wrapper
    chipsWrapper.addEventListener('click', () => chipInput.focus());

    const showAutocomplete = (suggestions) => {
        if (!suggestions.length) {
            autocompleteEl.classList.add('hidden');
            return;
        }
        autocompleteEl.innerHTML = suggestions
            .map(
                (s) => `
            <div class="autocomplete-item px-3 py-2 text-sm cursor-pointer hover:bg-red-50 hover:text-red-700 font-medium"
                 data-skill="${s}">${s}</div>
        `
            )
            .join('');
        autocompleteEl.classList.remove('hidden');
        autocompleteEl.querySelectorAll('.autocomplete-item').forEach((item) => {
            item.addEventListener('mousedown', (e) => {
                e.preventDefault(); // prevent blur before click
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
        // Small delay so mousedown on autocomplete fires first
        setTimeout(() => autocompleteEl.classList.add('hidden'), 150);
    });
    document.getElementById('clearFiltersBtn').addEventListener('click', clearAll);
    document.getElementById('sortCandidates').addEventListener('change', () => {
        applySort();
        const skillTokens = selectedSkills.map((s) => s.toLowerCase());
        updateDisplay(skillTokens, readFilters());
    });

    // Empty-state clear button
    document.getElementById('noCandidates').addEventListener('click', (e) => {
        if (e.target.closest('#emptyStateClear')) clearAll();
    });

    // ── Contact modal ───────────────────────────────────────────────────────
    const candidateMap = allCandidates.reduce((m, c) => {
        m[c.id] = c;
        return m;
    }, {});
    const contactModal = document.getElementById('contactModal');

    const closeModal = () => {
        contactModal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    const openModal = (candidate) => {
        document.getElementById('contactCandidateId').value = candidate.id;
        document.getElementById('contactModalCandidateName').textContent = candidate.name;
        document.getElementById('contactSubject').value =
            `Opportunity from our team at Avenga Academy`;
        document.getElementById('contactMessage').value =
            `Hi ${candidate.name.split(' ')[0]},\n\nI came across your profile and would love to discuss a potential opportunity.\n\nWould you be available for a short conversation?\n\nBest regards,`;
        contactModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const attachContactButtons = () => {
        document.querySelectorAll('.contact-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const candidate = candidateMap[btn.dataset.id];
                if (candidate) openModal(candidate);
            });
        });
    };

    // Initial attach
    attachContactButtons();

    document.getElementById('closeContactModal').addEventListener('click', closeModal);
    document.getElementById('cancelContactBtn').addEventListener('click', closeModal);
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });

    document.getElementById('sendContactBtn').addEventListener('click', () => {
        const candidateId = document.getElementById('contactCandidateId').value;
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const candidate = candidateMap[candidateId];

        if (!candidate) {
            alert('Candidate not found.');
            return;
        }
        if (!subject || !message) {
            alert('Please add a subject and message.');
            return;
        }

        // Phase 2: replace with real API call via apiService
        console.log('Contact candidate', {
            candidateId,
            candidateEmail: candidate.email,
            subject,
            message,
        });
        alert(`Message sent to ${candidate.name}!`);
        closeModal();
    });

    // ── Global action stubs ─────────────────────────────────────────────────
    window.viewCandidateProfile = (id) =>
        alert(`View profile for candidate ${id} (to be implemented)`);
    window.saveCandidate = (id) => alert(`Candidate ${id} saved to your shortlist`);
    window.requestAccess = (id) => alert(`Access request sent to candidate ${id}`);
    window.contactCandidate = (id) => {
        const c = candidateMap[id];
        if (c) openModal(c);
    };
}
