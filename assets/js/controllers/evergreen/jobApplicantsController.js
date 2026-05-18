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
import {
    addCandidateNotesModal,
    openCandidateNotesModal,
} from '../../views/candidateNotesModal.js';
import mockDataService from '../../services/mockDataService.js';

let currentJobId = null;
let currentApplications = [];

export default async function jobApplicantsController(params = {}) {
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

    // Ensure notes modal HTML exists
    addCandidateNotesModal();

    // Define pipeline stages and their corresponding application statuses
    const PIPELINE_STAGES = [
        { id: 'applied', title: 'Applied', status: 'pending' },
        { id: 'shortlisted', title: 'Shortlisted', status: 'under_review' },
        { id: 'interview', title: 'Interview', status: 'interview' },
        { id: 'hired', title: 'Hired', status: 'hired' },
    ];

    // Render the pipeline
    renderPipeline(currentApplications, PIPELINE_STAGES);

    /**
     * Renders the hiring pipeline UI.
     * @param {Array} applications - The list of applications.
     * @param {Array} stages - The defined pipeline stages.
     */
    function renderPipeline(applications, stages) {
        const pipelineContainer = document.getElementById('pipeline-container');
        if (!pipelineContainer) return;

        // Group applications by status
        const applicationsByStage = stages.reduce((acc, stage) => {
            acc[stage.status] = applications.filter((app) => app.status === stage.status);
            return acc;
        }, {});

        pipelineContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${stages
                    .map(
                        (stage) => `
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">${stage.title}</h2>
                        <div id="pipeline-column-${stage.id}" class="space-y-4 min-h-[100px] bg-gray-100 p-2 rounded-md">
                            ${applicationsByStage[stage.status]
                                .map(
                                    (app) => `
                                <div
                                    class="candidate-card bg-gray-50 p-3 rounded-md shadow-sm border border-gray-200 cursor-grab"
                                    draggable="true"
                                    data-application-id="${app.id}"
                                    data-current-status="${app.status}"
                                >
                                    <p class="font-medium text-gray-900">${app.applicant ? app.applicant.name : 'Candidate'}</p>
                                    <p class="text-sm text-gray-600">Applied on: ${new Date(app.appliedAt).toLocaleDateString()}</p>
                                    <div class="mt-2 flex items-center justify-between">
                                        <div class="text-sm text-gray-600">${app.notes ? (app.notes.length > 80 ? app.notes.slice(0, 77) + '...' : app.notes) : '<span class="text-gray-400">No notes</span>'}</div>
                                        ${job && user && job.companyId === user.companyId ? `<button class="open-notes-btn text-purple-600 hover:text-purple-800" data-application-id="${app.id}"><i class="fas fa-sticky-note"></i></button>` : ''}
                                    </div>
                                </div>
                            `
                                )
                                .join('')}
                        </div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;

        // Add drag and drop event listeners
        addDragAndDropListeners();
        // Add note button click listeners
        addNoteButtonListeners();
    }

    /**
     * Adds click listeners to note buttons in the pipeline.
     */
    function addDragAndDropListeners() {
        const candidateCards = document.querySelectorAll('.candidate-card');
        const pipelineColumns = document.querySelectorAll('[id^="pipeline-column-"]');

        candidateCards.forEach((card) => {
            card.addEventListener('dragstart', handleDragStart);
        });

        pipelineColumns.forEach((column) => {
            column.addEventListener('dragover', handleDragOver);
            column.addEventListener('drop', handleDrop);
            column.addEventListener('dragleave', handleDragLeave);
            column.addEventListener('dragenter', handleDragEnter);
        });
    }

    function addNoteButtonListeners() {
        const noteButtons = document.querySelectorAll('.open-notes-btn');
        noteButtons.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const applicationId = btn.dataset.applicationId;
                const application = currentApplications.find((a) => a.id === applicationId);
                if (!application) return;

                const currentUser = authService.getCurrentUser();
                const canEdit = await mockDataService.canViewOrEditNotes(
                    currentUser,
                    application.id
                );

                openCandidateNotesModal(application, canEdit, async (noteText) => {
                    try {
                        await mockDataService.updateApplicationNotes(
                            application.id,
                            noteText,
                            currentUser
                        );
                        currentApplications =
                            await mockDataService.getApplicationsByJobId(currentJobId);
                        renderPipeline(currentApplications, PIPELINE_STAGES);
                    } catch (err) {
                        console.error('Failed to save notes', err);
                    }
                });
            });
        });
    }

    /**
     * Handles the start of a drag operation.
     * @param {Event} e - The drag event.
     */
    function handleDragStart(e) {
        e.dataTransfer.setData(
            'application/json',
            JSON.stringify({
                id: e.target.dataset.applicationId,
                currentStatus: e.target.dataset.currentStatus,
            })
        );
        e.target.classList.add('opacity-50');
    }

    /**
     * Handles the dragover event.
     * @param {Event} e - The drag event.
     */
    function handleDragOver(e) {
        e.preventDefault(); // Allow drop
        e.currentTarget.classList.add('bg-purple-50');
    }

    /**
     * Handles the dragleave event.
     * @param {Event} e - The drag event.
     */
    function handleDragLeave(e) {
        e.currentTarget.classList.remove('bg-purple-50');
    }

    /**
     * Handles the dragenter event.
     * @param {Event} e - The drag event.
     */
    function handleDragEnter(e) {
        e.preventDefault();
    }

    /**
     * Handles the drop event.
     * @param {Event} e - The drag event.
     */
    async function handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-purple-50');

        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const applicationId = data.id;
        const oldStatus = data.currentStatus;
        const newColumnId = e.currentTarget.id;
        const newStage = PIPELINE_STAGES.find(
            (stage) => `pipeline-column-${stage.id}` === newColumnId
        );

        if (!newStage) {
            console.error('Target pipeline stage not found.');
            return;
        }

        const newStatus = newStage.status;

        if (oldStatus === newStatus) {
            // No status change, just revert card opacity
            const draggedCard = document.querySelector(`[data-application-id="${applicationId}"]`);
            if (draggedCard) draggedCard.classList.remove('opacity-50');
            return;
        }

        // Optimistically update UI
        const draggedCard = document.querySelector(`[data-application-id="${applicationId}"]`);
        if (draggedCard) {
            draggedCard.remove();
            e.currentTarget.appendChild(draggedCard);
            draggedCard.dataset.currentStatus = newStatus; // Update data attribute
            draggedCard.classList.remove('opacity-50');
        }

        // Update application status via mock service
        try {
            const updatedApp = await mockDataService.updateApplicationStatus(
                applicationId,
                newStatus
            );
            console.log('Application status updated:', updatedApp);
            // Re-render pipeline to ensure data consistency and full update
            // A more sophisticated approach might only update the specific card or column
            currentApplications = await mockDataService.getApplicationsByJobId(currentJobId); // Re-fetch all applications
            renderPipeline(currentApplications, PIPELINE_STAGES);
        } catch (error) {
            console.error('Failed to update application status:', error);
            // Revert UI if API call fails
            currentApplications = await mockDataService.getApplicationsByJobId(currentJobId); // Re-fetch to revert UI
            renderPipeline(currentApplications, PIPELINE_STAGES);
        }
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
