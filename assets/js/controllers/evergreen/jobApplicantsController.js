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

    // Render the pipeline

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
