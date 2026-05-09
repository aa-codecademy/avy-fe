/**
 * My Jobs Controller (Employer)
 * List of company's job postings with status and applicant counts.
 *
 * User stories:
 *  - "3.2 Edit Job Listing"
 *  - "3.3 Manage Job Status"
 *  - "4.1 View Applicants" (entry point per job)
 *
 * Available mock service methods:
 *  - mockDataService.getAllJobs({ companyId })
 *  - mockDataService.updateJob(id, jobData)
 *  - mockDataService.deleteJob(id)
 *  - mockDataService.getApplicationsByJobId(jobId)
 */
import authService from '../../services/authService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function myJobsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    // TODO (student task): list company's jobs, allow edit/close, link to applicants
    // const jobs = await mockDataService.getAllJobs({ companyId: user.companyId });

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8 flex justify-between items-center">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                <i class="fas fa-briefcase text-purple-600 mr-3"></i>
                                My Jobs
                            </h1>
                            <p class="text-gray-600">Manage your active job postings</p>
                        </div>
                        <a href="/employer/post-job" data-link class="btn btn-primary">
                            <i class="fas fa-plus-circle mr-2"></i> Post New Job
                        </a>
                    </div>
                    <div class="card text-center py-16">
                        <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">TODO: Jobs management</h3>
                        <p class="text-gray-500">Implement job list, edit/close actions, and link to applicants.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
