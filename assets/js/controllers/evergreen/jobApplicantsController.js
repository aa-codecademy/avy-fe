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

    // Group applicants by status
    const groupedApplicants = {
        pending: applicants.filter((a) => a.status === 'pending'),
        under_review: applicants.filter((a) => a.status === 'under_review'),
        shortlisted: applicants.filter((a) => a.status === 'shortlisted'),
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
            shortlisted: 'bg-indigo-100 text-indigo-800',
            interview: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800',
            hired: 'bg-green-100 text-green-800',
        };

        return `
            <div class="card mb-4 p-4 w-full">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-start gap-3">
                        <img src="${applicantAvatar}" alt="${applicantName}" class="w-14 h-14 rounded-full">
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
                <div class="flex gap-2 mt-3 flex-wrap">
                    <button class="btn btn-primary text-xs px-2 py-1 rounded view-profile-btn" data-id="${applicant.id}" data-user-id="${applicant.userId}">
                        <i class="fas fa-user-circle mr-1"></i> View Profile
                    </button>
                    <button class="btn btn-shortlist text-xs px-2 py-1 rounded status-btn" data-id="${applicant.id}" data-status="shortlisted">
                        <i class="fas fa-star mr-1"></i> Shortlist
                    </button>
                    <button class="btn btn-secondary text-xs px-2 py-1 rounded status-btn" data-id="${applicant.id}" data-status="interview">
                        <i class="fas fa-calendar-check mr-1"></i> Interview
                    </button>
                    <button class="btn btn-secondary border-0 text-xs px-2 py-1 rounded status-btn" data-id="${applicant.id}" data-status="rejected">
                        <i class="fas fa-times mr-1"></i> Reject
                    </button>
                    <button class="btn text-green-600 hover:bg-green-600 hover:text-white border-0 text-xs px-2 py-1 rounded status-btn" data-id="${applicant.id}" data-status="hired">
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

                    <!-- Pipeline Board -->
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6" id="pipelineBoard">
                        <div class="card  p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Applied</h3>
                            <div class="space-y-3 overflow-hidden flex-1" data-status-column="applied" id="col-applied">
                                <!-- Applied cards here -->
                            </div>
                        </div>
                        <div class="card  p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Shortlisted</h3>
                            <div class="space-y-3 overflow-hidden flex-1" data-status-column="shortlisted" id="col-shortlisted">
                                <!-- Shortlisted cards here -->
                            </div>
                        </div>
                        <div class="card  p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Interview</h3>
                            <div class="space-y-3 overflow-hidden flex-1" data-status-column="interview" id="col-interview">
                                <!-- Interview cards here -->
                            </div>
                        </div>
                        <div class="card  p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Hired</h3>
                            <div class="space-y-3 overflow-hidden flex-1" data-status-column="hired" id="col-hired">
                                <!-- Hired cards here -->
                            </div>
                        </div>
                        <div class="card  p-4 flex flex-col">
                            <h3 class="font-semibold mb-3 flex-shrink-0">Rejected</h3>
                            <div class="space-y-3 overflow-hidden flex-1" data-status-column="rejected" id="col-rejected">
                                <!-- Rejected cards here -->
                            </div>
                        </div>
                    </div>

                    <!-- Summary / quick stats -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-6">
                        <div class="card text-center p-2">
                            <div class="text-xl font-bold text-gray-800" id="summaryAppliedCount">${groupedApplicants.pending.length + groupedApplicants.under_review.length}</div>
                            <div class="text-xs text-gray-700">Applied</div>
                        </div>
                        <div class="card text-center p-2">
                            <div class="text-xl font-bold text-indigo-600" id="summaryShortlistedCount">${groupedApplicants.shortlisted.length}</div>
                            <div class="text-xs text-gray-700">Shortlisted</div>
                        </div>
                        <div class="card text-center p-2">
                            <div class="text-xl font-bold text-yellow-600" id="summaryInterviewCount">${groupedApplicants.interview.length}</div>
                            <div class="text-xs text-gray-700">Interview</div>
                        </div>
                        <div class="card text-center p-2">
                            <div class="text-xl font-bold text-green-600" id="summaryHiredCount">${groupedApplicants.hired.length}</div>
                            <div class="text-xs text-gray-700">Hired</div>
                        </div>
                        <div class="card text-center p-2">
                            <div class="text-xl font-bold text-red-600" id="summaryRejectedCount">${groupedApplicants.rejected.length}</div>
                            <div class="text-xs text-gray-700">Rejected</div>
                        </div>
                        <div class=" card p-2 text-center">
                            <div class="text-sm text-gray-600">Job: <strong>${job?.title || ''}</strong></div>
                            <div class="text-sm text-gray-600">Company: <strong>${(job && (this.companies || []).find ? '' : '')}</strong></div>
                        </div>
                    </div>

                    <h2 class="text-xl font-bold text-gray-800 mb-4">Applicants</h2>
                    ${applicants.length > 0 ? `<div id="applicants-list" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">${applicants.map(renderApplicantCard).join('')}</div>` : '<div class="card text-center py-8"><p class="text-gray-500">No applicants yet</p></div>'}

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

    // Event listeners
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    // Helper: map raw status to pipeline column
    const statusToColumn = (status) => {
        if (status === 'applied') return 'applied';
        if (status === 'shortlisted') return 'shortlisted';
        if (status === 'interview') return 'interview';
        if (status === 'hired') return 'hired';
        if (status === 'rejected') return 'rejected';
        // treat pending/under_review as applied
        return 'applied';
    };

    // Render a compact pipeline card
    const renderPipelineCard = (appItem) => {
        const name = appItem.applicant?.name || 'Unknown';
        const avatar = appItem.applicant?.avatar || 'https://ui-avatars.com/api/?name=Unknown';
        const notesIcon = `<button class="open-notes-btn text-sm text-gray-500 hover:text-gray-700" data-id="${appItem.id}" title="Internal notes"><i class="fas fa-sticky-note"></i></button>`;

        return `
            <div class="pipeline-card bg-white p-3 rounded shadow-sm cursor-move w-full" draggable="true" data-id="${appItem.id}">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                        <img src="${avatar}" class="w-10 h-10 rounded-full" alt="${name}">
                        <div>
                            <div class="font-medium text-gray-800 text-sm">${name}</div>
                            <div class="text-xs text-gray-500">${appItem.applicant?.currentPosition || ''}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="view-profile-btn text-xs text-gray-600" data-id="${appItem.id}" data-user-id="${appItem.userId}">Profile</button>
                        ${notesIcon}
                    </div>
                </div>
                <div class="mt-3 flex flex-wrap gap-2 text-xs">
                    <button class="btn btn-shortlist status-btn px-2 py-1 rounded" data-id="${appItem.id}" data-status="shortlisted">Shortlist</button>
                    <button class="btn btn-secondary status-btn px-2 py-1 rounded" data-id="${appItem.id}" data-status="interview">Interview</button>
                    <button class="btn btn-secondary status-btn px-2 py-1 rounded" data-id="${appItem.id}" data-status="rejected">Reject</button>
                    <button class="btn text-green-600 hover:bg-green-600 hover:text-white border-0 status-btn px-2 py-1 rounded" data-id="${appItem.id}" data-status="hired">Hire</button>
                </div>
            </div>
        `;
    };

    const renderApplicantList = () => {
        const listContainer = document.getElementById('applicants-list');
        if (!listContainer) return;
        listContainer.innerHTML = applicants.length > 0
            ? applicants.map(renderApplicantCard).join('')
            : '<div class="card text-center py-8"><p class="text-gray-500">No applicants yet</p></div>';
    };

    const renderPipeline = () => {
        const cols = {
            applied: document.getElementById('col-applied'),
            shortlisted: document.getElementById('col-shortlisted'),
            interview: document.getElementById('col-interview'),
            hired: document.getElementById('col-hired'),
            rejected: document.getElementById('col-rejected'),
        };

        // Clear columns
        Object.values(cols).forEach((c) => (c.innerHTML = ''));


            applicants.forEach((a) => {
    const col = statusToColumn(a.status);
    if (cols[col]) {
        // Create a clear parsing container element
        const cardContainer = document.createElement('div');
        cardContainer.className = 'w-full';
        cardContainer.innerHTML = renderPipelineCard(a).trim();

        // Grab the direct child card block safely
        const actualCardEl = cardContainer.firstElementChild;
        if (actualCardEl) {
            cols[col].appendChild(actualCardEl);
        }
    }
}
);

        renderApplicantList();
        updateSummaryCounts();
    };
    const updateSummaryCounts = () => {
    const appliedCount = applicants.filter((a) =>
        ['pending', 'under_review'].includes(a.status)
    ).length;
    const shortlistedCount = applicants.filter((a) => a.status === 'shortlisted').length;
    const interviewCount = applicants.filter((a) => a.status === 'interview').length;
    const hiredCount = applicants.filter((a) => a.status === 'hired').length;
    const rejectedCount = applicants.filter((a) => a.status === 'rejected').length;

    document.getElementById('summaryAppliedCount').textContent = appliedCount;
    document.getElementById('summaryShortlistedCount').textContent = shortlistedCount;
    document.getElementById('summaryInterviewCount').textContent = interviewCount;
    document.getElementById('summaryHiredCount').textContent = hiredCount;
    document.getElementById('summaryRejectedCount').textContent = rejectedCount;
};

    const updateApplicantStatus = async (applicationId, newStatus) => {
        await mockDataService.updateApplicationStatus(applicationId, newStatus, "");

        // FIX 2: Use loose type check (==) to accurately update localized list data objects
        const idx = applicants.findIndex((item) => item.id == applicationId);
        if (idx !== -1) {
            applicants[idx].status = newStatus;
            applicants[idx].updatedAt = new Date().toISOString();
        }

        renderPipeline();
    };
    const openApplicantProfile = async (applicationId, userId) => {
            const applicant = applicants.find((a) => a.id === applicationId);
            if (!applicant) return;

            const cvProfile = await mockDataService.getCVProfile(userId);

            let profileHtml = `
                <div class="mb-6 pb-6 border-b border-gray-200">
                    <div class="flex items-start gap-4">
                        <img src="${applicant.applicant?.avatar || 'https://ui-avatars.com/api/?name=Unknown'}"
                             class="w-20 h-20 rounded-full">
                        <div class="flex-1">
                            <h3 class="text-2xl font-bold text-gray-800">
                                ${applicant.applicant?.name || 'Unknown'}
                            </h3>
                            <p class="text-gray-600">
                                ${applicant.applicant?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>
            `;

            profileHtml += renderProfileSection(cvProfile);
            profileContent.innerHTML = profileHtml;
            profileModal.classList.remove('hidden');
        };



       const attachPipelineListeners = () => {
    const pipelineBoard = document.getElementById('pipelineBoard');
    if (!pipelineBoard) return;

    const highlightColumn = (column, active) => {
        if (!column) return;
        column.classList.toggle('bg-blue-50', active);
        column.classList.toggle('border-2', active);
        column.classList.toggle('border-blue-400', active);
    };

    // DRAGSTART
    pipelineBoard.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.pipeline-card');
        if (card) {
            e.dataTransfer.setData('text/plain', card.dataset.id);
            card.classList.add('opacity-40');
        }
    });

    // DRAGEND
    pipelineBoard.addEventListener('dragend', (e) => {
        const card = e.target.closest('.pipeline-card');
        if (card) card.classList.remove('opacity-40');
    });

    // === MOST IMPORTANT FIXES HERE ===
    pipelineBoard.addEventListener('dragover', (e) => {
        e.preventDefault();                    // MUST be called
        const column = e.target.closest('[data-status-column]');
        if (column) {
            highlightColumn(column, true);
        }
    });

    pipelineBoard.addEventListener('dragleave', (e) => {
        const column = e.target.closest('[data-status-column]');
        if (column) {
            highlightColumn(column, false);
        }
    });

    // DROP
    pipelineBoard.addEventListener('drop', async (e) => {
        e.preventDefault();

        // Clear highlights
        document.querySelectorAll('[data-status-column]').forEach(col => {
            highlightColumn(col, false);
        });

        const column = e.target.closest('[data-status-column]');
        if (!column) return;

        const appId = e.dataTransfer.getData('text/plain');
        if (!appId) return;

        const targetKey = column.getAttribute('data-status-column');

        const statusMap = {
            applied: 'under_review',
            shortlisted: 'shortlisted',
            interview: 'interview',
            hired: 'hired',
            rejected: 'rejected'
        };

        const newStatus = statusMap[targetKey] || 'under_review';

        await updateApplicantStatus(appId, newStatus);
    });

    // Click handlers (keep as before)
    pipelineBoard.addEventListener('click', async (e) => {
        const viewBtn = e.target.closest('.view-profile-btn');
        const statusBtn = e.target.closest('.status-btn');
        const notesBtn = e.target.closest('.open-notes-btn');

        if (viewBtn) {
            e.preventDefault();
            await openApplicantProfile(viewBtn.dataset.id, viewBtn.dataset.userId);
        } else if (notesBtn) {
            e.preventDefault();
            openNotesModal(notesBtn.dataset.id);
        } else if (statusBtn) {
            e.preventDefault();
            await updateApplicantStatus(statusBtn.dataset.id, statusBtn.dataset.status);
        }
    });

    // List click handlers (unchanged)
    const applicantsList = document.getElementById('applicants-list');
    if (applicantsList) {
        applicantsList.addEventListener('click', async (e) => {
            const viewBtn = e.target.closest('.view-profile-btn');
            const statusBtn = e.target.closest('.status-btn');

            if (viewBtn) {
                e.preventDefault();
                await openApplicantProfile(viewBtn.dataset.id, viewBtn.dataset.userId);
            } else if (statusBtn) {
                e.preventDefault();
                await updateApplicantStatus(statusBtn.dataset.id, statusBtn.dataset.status);
            }
        });
    }
};
// Added required styles for drag & drop
const addDragDropStyles = () => {
    if (document.getElementById('dragdrop-styles')) return; // prevent duplicates

    const style = document.createElement('style');
    style.id = 'dragdrop-styles';
    style.textContent = `
        [data-status-column] {
            min-height: 320px !important;
            padding: 16px;
            transition: background-color 0.2s ease;
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
            [data-status-column] {
    min-height: 280px;
    max-height: 330px;           /* ← This is the key */
    overflow-y: auto;            /* Makes it scrollable */
    padding: 12px;
    background-color: #f9fafb;
    border-radius: 8px;
    transition: background-color 0.2s;
}

/* Optional: Nice scrollbar */
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
    `;
    document.head.appendChild(style);
};

// Call it at the end
addDragDropStyles();

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

    // Notes modal elements
    const notesModal = document.getElementById('notesModal');
    const notesTextarea = document.getElementById('notesTextarea');
    const notesMeta = document.getElementById('notesMeta');
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    const closeNotesBtn = document.getElementById('closeNotesModal');
    const cancelNotesBtn = document.getElementById('cancelNotesBtn');

    let activeNotesApplicationId = null;

    const canEditNotes = () => {
        return user && user.role === 'employer' && job && job.companyId && user.companyId === job.companyId;
    };

    const openNotesModal = (applicationId) => {
        activeNotesApplicationId = applicationId;
        const appItem = applicants.find((a) => a.id === applicationId);
        if (!appItem) return;
        notesTextarea.value = appItem.notes || '';
        notesMeta.textContent = appItem.updatedAt ? `Last updated: ${new Date(appItem.updatedAt).toLocaleString()}` : 'No notes yet';
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

    saveNotesBtn.addEventListener('click', async () => {
        if (!activeNotesApplicationId) return;
        if (!canEditNotes()) return;
        const value = notesTextarea.value;
        await mockDataService.updateApplicationNotes(activeNotesApplicationId, value);
        const idx = applicants.findIndex((a) => a.id === activeNotesApplicationId);
        if (idx !== -1) {
            applicants[idx].notes = value;
            applicants[idx].updatedAt = new Date().toISOString();
        }
        renderPipeline();
        closeNotesModal();
    });

    closeNotesBtn.addEventListener('click', closeNotesModal);
    cancelNotesBtn.addEventListener('click', closeNotesModal);

    // Initialize pipeline and listeners (one time only)
    renderPipeline();
    attachPipelineListeners();

        // === TEMPORARY: Expose for console testing ===
    window.currentApplicants = applicants;
    window.renderPipeline = renderPipeline;
    window.updateSummaryCounts = updateSummaryCounts;
    window.renderPipelineCard = renderPipelineCard;   // important for manual render
    window.statusToColumn = statusToColumn;

    console.log("✅ Testing variables exposed to window. You can now use console.");
}
