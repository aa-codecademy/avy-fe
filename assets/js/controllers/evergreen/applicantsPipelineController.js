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
import { renderAppHeader } from '../../views/appHeader.js';
import mockDataService from '../../services/mockDataService.js';

let currentJobId = null;
let currentApplications = [];

export default async function applicantsPipelineController(params = {}) {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    currentJobId = params.id;

    // Fetch job and applicants
    const job = await mockDataService.getJobById(currentJobId);
    currentApplications = await mockDataService.getApplicationsByJobId(currentJobId);

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
                            Applicants Pipeline
                        </h1>
                        <p class="text-gray-600">
                            <strong>${job?.title || 'Job'}</strong>
                            <span class="ml-2 text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">${currentApplications.length} applicants</span>
                        </p>
                    </div>

                    <!-- Pipeline Container -->
                    <div id="pipeline-container" class="mb-8">
                        <!-- Pipeline will be rendered here -->
                    </div>
                </div>
            </div>
        </div>
    `;

    // Render the pipeline
    renderPipelineView(currentApplications);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

/**
 * Render the hiring pipeline with four stages
 */
function renderPipelineView(applications) {
    const container = document.getElementById('pipeline-container');

    const pipelineStages = [
        { status: 'pending', label: 'Applied', icon: 'fa-file-alt', color: 'blue' },
        { status: 'under_review', label: 'Shortlisted', icon: 'fa-star', color: 'yellow' },
        { status: 'interview', label: 'Interview', icon: 'fa-handshake', color: 'purple' },
        { status: 'hired', label: 'Hired', icon: 'fa-check-circle', color: 'green' },
    ];

    const colorMap = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            badge: 'bg-blue-100 text-blue-800',
            header: 'bg-blue-100',
        },
        yellow: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            badge: 'bg-yellow-100 text-yellow-800',
            header: 'bg-yellow-100',
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            badge: 'bg-purple-100 text-purple-800',
            header: 'bg-purple-100',
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            badge: 'bg-green-100 text-green-800',
            header: 'bg-green-100',
        },
    };

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${pipelineStages
                .map((stage) => {
                    const colors = colorMap[stage.color];
                    const stageApplicants = applications.filter(
                        (app) => app.status === stage.status
                    );

                    return `
                    <div class="${colors.bg} border-2 ${colors.border} rounded-lg p-4 min-h-96">
                        <!-- Stage Header -->
                        <div class="${colors.header} rounded-lg p-3 mb-4">
                            <h3 class="text-lg font-bold text-gray-800 flex items-center">
                                <i class="fas ${stage.icon} mr-2"></i>
                                ${stage.label}
                            </h3>
                            <p class="text-sm text-gray-600 mt-1">${stageApplicants.length} candidate(s)</p>
                        </div>

                        <!-- Candidates List -->
                        <div class="space-y-3">
                            ${
                                stageApplicants.length > 0
                                    ? stageApplicants
                                          .map(
                                              (app) => `
                                    <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-move"
                                         draggable="true"
                                         data-app-id="${app.id}"
                                         data-stage="${stage.status}">
                                        <div class="flex items-start justify-between">
                                            <div class="flex-1">
                                                <p class="font-semibold text-gray-800 text-sm">${app.applicant?.name || 'Unknown'}</p>
                                                <p class="text-xs text-gray-500 truncate">${app.applicant?.email || ''}</p>
                                                <p class="text-xs text-gray-400 mt-1">Applied: ${new Date(app.appliedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div class="ml-2">
                                                <button class="text-gray-400 hover:text-gray-600 transition-colors btn-view-details"
                                                        data-app-id="${app.id}"
                                                        title="View details">
                                                    <i class="fas fa-chevron-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <!-- Status dropdown -->
                                        <div class="mt-2">
                                            <select class="w-full text-xs p-1 border border-gray-300 rounded cursor-pointer status-select"
                                                    data-app-id="${app.id}">
                                                <option value="">Move to...</option>
                                                ${pipelineStages
                                                    .filter((s) => s.status !== stage.status)
                                                    .map(
                                                        (s) => `
                                                    <option value="${s.status}">${s.label}</option>
                                                `
                                                    )
                                                    .join('')}
                                            </select>
                                        </div>
                                    </div>
                                `
                                          )
                                          .join('')
                                    : `<p class="text-gray-500 text-center py-8 text-sm">No candidates in this stage</p>`
                            }
                        </div>
                    </div>
                `;
                })
                .join('')}
        </div>
    `;

    // Add event listeners for status changes
    document.querySelectorAll('.status-select').forEach((select) => {
        select.addEventListener('change', async (e) => {
            const appId = e.target.dataset.appId;
            const newStatus = e.target.value;
            if (newStatus) {
                await handleStatusChange(appId, newStatus);
            }
        });
    });

    // Add event listeners for view details
    document.querySelectorAll('.btn-view-details').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const appId = e.currentTarget.dataset.appId;
            showApplicationDetails(appId);
        });
    });
}

/**
 * Handle status change when candidate is moved to a new stage
 */
async function handleStatusChange(applicationId, newStatus) {
    try {
        await mockDataService.updateApplicationStatus(applicationId, newStatus);
        // Refresh applicants and re-render pipeline
        currentApplications = await mockDataService.getApplicationsByJobId(currentJobId);
        renderPipelineView(currentApplications);
        console.log(`Application ${applicationId} moved to ${newStatus}`);
    } catch (error) {
        console.error('Failed to update application status:', error);
        alert('Failed to update application status. Please try again.');
    }
}

/**
 * Show application details modal
 */
function showApplicationDetails(applicationId) {
    const app = currentApplications.find((a) => a.id === applicationId);
    if (!app) return;

    const modalHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" id="detailsModal">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
                <div class="bg-purple-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
                    <h2 class="text-xl font-bold">${app.applicant?.name || 'Unknown'}</h2>
                    <button class="text-2xl leading-none hover:text-gray-200" onclick="document.getElementById('detailsModal')?.remove()">×</button>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p class="text-sm text-gray-500">Email</p>
                            <p class="font-semibold">${app.applicant?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Status</p>
                            <p class="font-semibold">${app.status.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Applied</p>
                            <p class="font-semibold">${new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Last Updated</p>
                            <p class="font-semibold">${new Date(app.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    ${
                        app.coverLetter
                            ? `
                        <div class="mb-6">
                            <p class="text-sm font-semibold text-gray-700 mb-2">Cover Letter</p>
                            <p class="text-gray-600 text-sm bg-gray-50 p-3 rounded">${app.coverLetter}</p>
                        </div>
                    `
                            : ''
                    }
                    ${
                        app.notes
                            ? `
                        <div id="notes-section">
                            <div class="flex justify-between items-center mb-2">
                                <p class="text-sm font-semibold text-gray-700">Internal Notes</p>
                                <button class="text-purple-600 hover:text-purple-800 text-sm" id="edit-notes-btn">
                                    <i class="fas fa-edit mr-1"></i>Edit
                                </button>
                            </div>
                            <p class="text-gray-600 text-sm bg-gray-50 p-3 rounded" id="notes-display">${app.notes}</p>
                        </div>
                    `
                            : `
                        <div id="notes-section">
                            <div class="flex justify-between items-center mb-2">
                                <p class="text-sm font-semibold text-gray-700">Internal Notes</p>
                                <button class="text-purple-600 hover:text-purple-800 text-sm" id="add-notes-btn">
                                    <i class="fas fa-plus mr-1"></i>Add Notes
                                </button>
                            </div>
                            <p class="text-gray-400 text-sm italic" id="notes-display">No notes added yet.</p>
                        </div>
                    `
                    }
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners for notes editing
    const editNotesBtn = document.getElementById('edit-notes-btn');
    const addNotesBtn = document.getElementById('add-notes-btn');
    if (editNotesBtn) {
        editNotesBtn.addEventListener('click', () => showNotesEditor(app.id, app.notes));
    }
    if (addNotesBtn) {
        addNotesBtn.addEventListener('click', () => showNotesEditor(app.id, ''));
    }
}

/**
 * Show notes editor for adding/editing notes
 */
function showNotesEditor(applicationId, currentNotes) {
    const notesSection = document.getElementById('notes-section');
    const notesDisplay = document.getElementById('notes-display');

    // Replace the display with an editor
    notesSection.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <p class="text-sm font-semibold text-gray-700">Internal Notes</p>
            <div class="space-x-2">
                <button class="text-green-600 hover:text-green-800 text-sm" id="save-notes-btn">
                    <i class="fas fa-save mr-1"></i>Save
                </button>
                <button class="text-gray-600 hover:text-gray-800 text-sm" id="cancel-notes-btn">
                    <i class="fas fa-times mr-1"></i>Cancel
                </button>
            </div>
        </div>
        <textarea class="w-full p-3 border border-gray-300 rounded text-sm" rows="4" id="notes-editor">${currentNotes}</textarea>
    `;

    // Add event listeners for save and cancel
    document
        .getElementById('save-notes-btn')
        .addEventListener('click', () => saveNotes(applicationId));
    document
        .getElementById('cancel-notes-btn')
        .addEventListener('click', () => cancelNotesEdit(applicationId, currentNotes));
}

/**
 * Save notes for an application
 */
async function saveNotes(applicationId) {
    const notesEditor = document.getElementById('notes-editor');
    const newNotes = notesEditor.value.trim();

    try {
        await mockDataService.updateApplicationNotes(applicationId, newNotes);
        // Refresh the applications data
        currentApplications = await mockDataService.getApplicationsByJobId(currentJobId);
        // Close the modal and re-render pipeline
        document.getElementById('detailsModal')?.remove();
        renderPipelineView(currentApplications);
        console.log(`Notes updated for application ${applicationId}`);
    } catch (error) {
        console.error('Failed to update notes:', error);
        alert('Failed to update notes. Please try again.');
    }
}

/**
 * Cancel notes editing and revert to display mode
 */
function cancelNotesEdit(applicationId, originalNotes) {
    const app = currentApplications.find((a) => a.id === applicationId);
    if (!app) return;

    const notesSection = document.getElementById('notes-section');

    // Revert to display mode
    notesSection.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <p class="text-sm font-semibold text-gray-700">Internal Notes</p>
            <button class="text-purple-600 hover:text-purple-800 text-sm" id="edit-notes-btn">
                <i class="fas fa-edit mr-1"></i>Edit
            </button>
        </div>
        <p class="text-gray-600 text-sm bg-gray-50 p-3 rounded" id="notes-display">${originalNotes || 'No notes added yet.'}</p>
    `;

    // Re-add event listener
    document
        .getElementById('edit-notes-btn')
        .addEventListener('click', () => showNotesEditor(applicationId, originalNotes));
}

// Add event listeners for notes editing
const editNotesBtn = document.getElementById('edit-notes-btn');
const addNotesBtn = document.getElementById('add-notes-btn');
if (editNotesBtn) {
    editNotesBtn.addEventListener('click', () => showNotesEditor(app.id, app.notes));
}
if (addNotesBtn) {
    addNotesBtn.addEventListener('click', () => showNotesEditor(app.id, ''));
}
