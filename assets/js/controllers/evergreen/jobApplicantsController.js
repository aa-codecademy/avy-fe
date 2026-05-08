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
 *  - mockDataService.getApplicationsByJobId(jobId)
 *  - mockDataService.updateApplicationStatus(id, status, notes)
 *  - mockDataService.getJobById(id)
 *
 * @param {object} params - Route params, includes :id (job id)
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function jobApplicantsController(params = {}) {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    const jobId = params.id;

    // Fetch job and applicants data
    const job = await mockDataService.getJobById(jobId);
    const applicants = await mockDataService.getApplicationsByJobId(jobId);

    // Helper functions for filtering and sorting

    // Calculate experience level (in years) from CV
    const calculateExperience = async (userId) => {
        const cvProfile = await mockDataService.getCVProfile(userId);
        if (!cvProfile.workExperience || cvProfile.workExperience.length === 0) return 0;

        let totalMonths = 0;
        cvProfile.workExperience.forEach((exp) => {
            if (exp.startDate && exp.endDate) {
                const start = new Date(exp.startDate);
                const end = new Date(exp.endDate);
                totalMonths += (end - start) / (1000 * 60 * 60 * 24 * 30);
            }
        });
        return Math.floor(totalMonths / 12);
    };

    // Get all unique skills from applicants
    const getAllApplicantSkills = async () => {
        const skillsSet = new Set();
        for (const applicant of applicants) {
            const cvProfile = await mockDataService.getCVProfile(applicant.userId);
            if (cvProfile.skills) {
                cvProfile.skills.forEach((skill) => skillsSet.add(skill));
            }
        }
        return Array.from(skillsSet).sort();
    };

    // Get job required and nice-to-have skills
    const getJobSkills = () => {
        const skills = new Set();
        if (job?.requiredSkills) job.requiredSkills.forEach((s) => skills.add(s));
        if (job?.niceToHaveSkills) job.niceToHaveSkills.forEach((s) => skills.add(s));
        return Array.from(skills).sort();
    };

    // Get applicant skills with CV data
    const getApplicantSkillsMap = async () => {
        const skillsMap = {};
        for (const applicant of applicants) {
            const cvProfile = await mockDataService.getCVProfile(applicant.userId);
            skillsMap[applicant.userId] = cvProfile.skills || [];
        }
        return skillsMap;
    };

    // Get applicant experience years
    const getApplicantExperienceMap = async () => {
        const experienceMap = {};
        for (const applicant of applicants) {
            experienceMap[applicant.userId] = await calculateExperience(applicant.userId);
        }
        return experienceMap;
    };

    // Get all skills (job + applicant)
    const allSkills = getJobSkills();
    const applicantSkillsMap = await getApplicantSkillsMap();
    const applicantExperienceMap = await getApplicantExperienceMap();

    // Group applicants by status
    const groupedApplicants = {
        pending: applicants.filter((a) => a.status === 'pending'),
        under_review: applicants.filter((a) => a.status === 'under_review'),
        interview: applicants.filter((a) => a.status === 'interview'),
        rejected: applicants.filter((a) => a.status === 'rejected'),
        hired: applicants.filter((a) => a.status === 'hired'),
    };

    // Render profile details section
    const renderProfileSection = (cvProfile) => {
        let html = '';

        // Skills section
        if (cvProfile.skills && cvProfile.skills.length > 0) {
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

        // Work Experience section
        if (cvProfile.workExperience && cvProfile.workExperience.length > 0) {
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

        // Education section
        if (cvProfile.education && cvProfile.education.length > 0) {
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

        // Languages section
        if (cvProfile.languages && cvProfile.languages.length > 0) {
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

    // Render applicant card
    const renderApplicantCard = (applicant) => {
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
            interview: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800',
            hired: 'bg-green-100 text-green-800',
        };

        return `
            <div class="card mb-4 p-4">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-start gap-3">
                        <img src="${applicantAvatar}" alt="${applicantName}" class="w-12 h-12 rounded-full">
                        <div>
                            <h3 class="font-semibold text-gray-800">${applicantName}</h3>
                            <p class="text-sm text-gray-600">${applicantEmail}</p>
                            <p class="text-xs text-gray-500 mt-1">Applied: ${appliedDate}</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColor[applicant.status]}">
                        ${applicant.status.replace('_', ' ').charAt(0).toUpperCase() + applicant.status.slice(1).replace('_', ' ')}
                    </span>
                </div>
                ${applicant.coverLetter ? `<p class="text-sm text-gray-700 mb-3 italic">\"${applicant.coverLetter.substring(0, 100)}...\"</p>` : ''}
                <div class="flex gap-2 mt-3">
                    <button class="btn-primary text-xs px-2 py-1 view-profile-btn" data-id="${applicant.id}" data-user-id="${applicant.userId}">
                        <i class="fas fa-user-circle mr-1"></i> View Profile
                    </button>
                    <button class="btn-secondary text-xs px-2 py-1 status-btn" data-id="${applicant.id}" data-status="interview">
                        <i class="fas fa-calendar-check mr-1"></i> Interview
                    </button>
                    <button class="btn-danger text-xs px-2 py-1 status-btn" data-id="${applicant.id}" data-status="rejected">
                        <i class="fas fa-times mr-1"></i> Reject
                    </button>
                    <button class="btn-success text-xs px-2 py-1 status-btn" data-id="${applicant.id}" data-status="hired">
                        <i class="fas fa-check mr-1"></i> Hire
                    </button>
                </div>
            </div>
        `;
    };

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <a href="/employer/jobs" data-link class="text-purple-600 hover:text-purple-800 mb-2 inline-block">
                            <i class="fas fa-arrow-left mr-1"></i> Back to My Jobs
                        </a>
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-users text-purple-600 mr-3"></i>
                            Applicants for ${job?.title || 'Job'}
                        </h1>
                        <p class="text-gray-600">Total applicants: <strong>${applicants.length}</strong></p>
                    </div>

                    <div class="grid lg:grid-cols-4 gap-6">
                        <!-- Filter Sidebar -->
                        <div class="lg:col-span-1">
                            <div class="card sticky top-4">
                                <h3 class="text-lg font-bold text-gray-800 mb-4">
                                    <i class="fas fa-filter mr-2"></i> Filters
                                </h3>
                                <div class="space-y-4">
                                    <!-- Status Filter -->
                                    <div>
                                        <label class="form-label">Status</label>
                                        <select id="statusFilter" class="form-input">
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="under_review">Under Review</option>
                                            <option value="interview">Interview</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="hired">Hired</option>
                                        </select>
                                    </div>

                                    <!-- Skills Filter -->
                                    <div>
                                        <label class="form-label">Skills</label>
                                        <select id="skillsFilter" class="form-input">
                                            <option value="">All Skills</option>
                                            ${allSkills.map((skill) => `<option value="${skill}">${skill}</option>`).join('')}
                                        </select>
                                    </div>

                                    <!-- Experience Filter -->
                                    <div>
                                        <label class="form-label">Min Experience</label>
                                        <select id="experienceFilter" class="form-input">
                                            <option value="">Any</option>
                                            <option value="0">0+ years</option>
                                            <option value="1">1+ years</option>
                                            <option value="2">2+ years</option>
                                            <option value="3">3+ years</option>
                                            <option value="5">5+ years</option>
                                        </select>
                                    </div>

                                    <!-- Sort -->
                                    <div>
                                        <label class="form-label">Sort By</label>
                                        <select id="sortFilter" class="form-input">
                                            <option value="applied_desc">Newest First</option>
                                            <option value="applied_asc">Oldest First</option>
                                            <option value="relevance">Relevance</option>
                                        </select>
                                    </div>

                                    <button id="clearFiltersBtn" class="btn btn-secondary w-full">Clear Filters</button>
                                </div>
                            </div>
                        </div>

                        <!-- Main Content -->
                        <div class="lg:col-span-3">
                            <!-- Applicants Summary -->
                            <div class="grid grid-cols-5 gap-3 mb-6">
                                <div class="card text-center p-3">
                                    <div class="text-2xl font-bold text-gray-800">${groupedApplicants.pending.length}</div>
                                    <div class="text-xs text-gray-600">Pending</div>
                                </div>
                                <div class="card text-center p-3">
                                    <div class="text-2xl font-bold text-blue-600">${groupedApplicants.under_review.length}</div>
                                    <div class="text-xs text-gray-600">Under Review</div>
                                </div>
                                <div class="card text-center p-3">
                                    <div class="text-2xl font-bold text-yellow-600">${groupedApplicants.interview.length}</div>
                                    <div class="text-xs text-gray-600">Interview</div>
                                </div>
                                <div class="card text-center p-3">
                                    <div class="text-2xl font-bold text-red-600">${groupedApplicants.rejected.length}</div>
                                    <div class="text-xs text-gray-600">Rejected</div>
                                </div>
                                <div class="card text-center p-3">
                                    <div class="text-2xl font-bold text-green-600">${groupedApplicants.hired.length}</div>
                                    <div class="text-xs text-gray-600">Hired</div>
                                </div>
                            </div>

                            <!-- Applicants List -->
                            <h2 class="text-xl font-bold text-gray-800 mb-4">Applicants</h2>
                            ${applicants.length > 0 ? `<div id="applicants-container">${applicants.map(renderApplicantCard).join('')}</div>` : '<div class="card text-center py-8"><p class="text-gray-500">No applicants yet</p></div>'}
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
                <div id="profileContent" class="p-6">
                    <!-- Profile content will be inserted here -->
                </div>
            </div>
        </div>
    `;

    // Event listeners
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    // Function to apply filters and sort
    const applyFiltersAndSort = () => {
        const statusFilter = document.getElementById('statusFilter').value;
        const skillsFilter = document.getElementById('skillsFilter').value;
        const experienceFilter = parseInt(document.getElementById('experienceFilter').value) || 0;
        const sortFilter = document.getElementById('sortFilter').value;

        let filtered = [...applicants];

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter((a) => a.status === statusFilter);
        }

        // Apply skills filter
        if (skillsFilter) {
            filtered = filtered.filter((a) => {
                const skills = applicantSkillsMap[a.userId] || [];
                return skills.some((s) => s.toLowerCase().includes(skillsFilter.toLowerCase()));
            });
        }

        // Apply experience filter
        if (experienceFilter) {
            filtered = filtered.filter((a) => {
                const experience = applicantExperienceMap[a.userId] || 0;
                return experience >= experienceFilter;
            });
        }

        // Apply sorting
        if (sortFilter === 'applied_desc') {
            filtered.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        } else if (sortFilter === 'applied_asc') {
            filtered.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
        } else if (sortFilter === 'relevance') {
            // Sort by skill match count
            filtered.sort((a, b) => {
                const skillsA = applicantSkillsMap[a.userId] || [];
                const skillsB = applicantSkillsMap[b.userId] || [];
                const jobSkills = job?.requiredSkills || [];

                const matchA = skillsA.filter((s) =>
                    jobSkills.some((js) => js.toLowerCase().includes(s.toLowerCase()))
                ).length;
                const matchB = skillsB.filter((s) =>
                    jobSkills.some((js) => js.toLowerCase().includes(s.toLowerCase()))
                ).length;

                return matchB - matchA;
            });
        }

        // Re-render with filtered results
        const container = document.getElementById('applicants-container');
        if (filtered.length > 0) {
            container.innerHTML = filtered.map(renderApplicantCard).join('');
        } else {
            container.innerHTML =
                '<div class="card text-center py-8"><p class="text-gray-500">No applicants match your filters</p></div>';
        }

        // Re-attach event listeners
        attachEventListeners();
    };

    // Function to attach all event listeners
    const attachEventListeners = () => {
        // View Profile buttons
        const viewProfileBtns = document.querySelectorAll('.view-profile-btn');
        viewProfileBtns.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const applicationId = btn.dataset.id;
                const userId = btn.dataset.userId;

                // Find the applicant to get their info
                const applicant = applicants.find((a) => a.id === applicationId);

                if (!applicant) return;

                // Fetch CV profile
                const cvProfile = await mockDataService.getCVProfile(userId);
                const applicantName = applicant.applicant?.name || 'Unknown';
                const applicantEmail = applicant.applicant?.email || '';
                const applicantAvatar =
                    applicant.applicant?.avatar || 'https://ui-avatars.com/api/?name=Unknown';

                // Build profile HTML
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

                // Add cover letter if available
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

                // Add profile information
                profileHtml += renderProfileSection(cvProfile);

                // Add documents if available
                if (
                    applicant.cvDocument ||
                    (applicant.additionalDocuments && applicant.additionalDocuments.length > 0)
                ) {
                    profileHtml += `
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                                <i class="fas fa-file-pdf text-red-600 mr-2"></i> Documents
                            </h4>
                            <div class="space-y-2">
                                ${applicant.cvDocument ? `<a href="${applicant.cvDocument}" target="_blank" class="flex items-center text-purple-600 hover:text-purple-800"><i class="fas fa-download mr-2"></i> Download Resume/CV</a>` : ''}
                                ${applicant.additionalDocuments?.map((doc, idx) => `<a href="${doc}" target="_blank" class="flex items-center text-purple-600 hover:text-purple-800"><i class="fas fa-download mr-2"></i> Additional Document ${idx + 1}</a>`).join('')}
                            </div>
                        </div>
                    `;
                }

                profileContent.innerHTML = profileHtml;
                profileModal.classList.remove('hidden');
            });
        });

        // Status update buttons
        const statusBtns = document.querySelectorAll('.status-btn');
        statusBtns.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const applicationId = btn.dataset.id;
                const newStatus = btn.dataset.status;

                await mockDataService.updateApplicationStatus(applicationId, newStatus);

                // Refresh the page to show updated status
                await jobApplicantsController(params);
            });
        });
    };

    // Profile modal handlers
    const profileModal = document.getElementById('profileModal');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const profileContent = document.getElementById('profileContent');

    closeProfileModal.addEventListener('click', () => {
        profileModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.add('hidden');
        }
    });

    // Filter and sort event listeners
    const statusFilter = document.getElementById('statusFilter');
    const skillsFilter = document.getElementById('skillsFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    [statusFilter, skillsFilter, experienceFilter, sortFilter].forEach((filter) => {
        filter.addEventListener('change', applyFiltersAndSort);
    });

    clearFiltersBtn.addEventListener('click', () => {
        statusFilter.value = '';
        skillsFilter.value = '';
        experienceFilter.value = '';
        sortFilter.value = 'applied_desc';
        applyFiltersAndSort();
    });

    // Attach initial event listeners
    attachEventListeners();
}
