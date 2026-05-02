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
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function myJobsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    // Fetch company's jobs
    const jobs = await mockDataService.getAllJobs({ companyId: user.companyId });
    const company = await mockDataService.getCompanyById(user.companyId);

    // Helper function to get work mode label
    const getWorkModeLabel = (workMode) => {
        const labels = {
            onsite: 'On-site',
            remote: 'Remote',
            hybrid: 'Hybrid',
        };
        return labels[workMode] || workMode;
    };

    // Render jobs list
    const renderJobsList = () => {
        if (jobs.length === 0) {
            return `
                <div class="card text-center py-16">
                    <i class="fas fa-briefcase text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-2xl font-bold text-gray-600 mb-2">No Jobs Posted Yet</h3>
                    <p class="text-gray-500 mb-4">Start by posting your first job opening.</p>
                    <a href="/employer/post-job" data-link class="btn btn-primary">
                        <i class="fas fa-plus-circle mr-2"></i> Post New Job
                    </a>
                </div>
            `;
        }

        return `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-200">
                            <th class="text-left py-4 px-4 font-semibold text-gray-600">Job Title</th>
                            <th class="text-left py-4 px-4 font-semibold text-gray-600">Type</th>
                            <th class="text-left py-4 px-4 font-semibold text-gray-600">Work Mode</th>
                            <th class="text-left py-4 px-4 font-semibold text-gray-600">Status</th>
                            <th class="text-center py-4 px-4 font-semibold text-gray-600">Views</th>
                            <th class="text-center py-4 px-4 font-semibold text-gray-600">Applicants</th>
                            <th class="text-right py-4 px-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${jobs
                            .map(
                                (job) => `
                            <tr class="border-b border-gray-100" data-job-id="${job.id}">
                                <td class="py-4 px-4">
                                    <div class="font-semibold text-gray-800">${job.title}</div>
                                    <div class="text-sm text-gray-500">${job.location || 'No location'}</div>
                                </td>
                                <td class="py-4 px-4">
                                    <span class="text-gray-600">${job.employmentType}</span>
                                </td>
                                <td class="py-4 px-4">
                                    <span class="text-gray-600">${getWorkModeLabel(job.workMode)}</span>
                                </td>
                                <td class="py-4 px-4">
                                    <select class="status-select form-input py-1 px-2 text-sm w-auto" data-job-id="${job.id}">
                                        <option value="active" ${job.status === 'active' ? 'selected' : ''}>Active</option>
                                        <option value="paused" ${job.status === 'paused' ? 'selected' : ''}>Paused</option>
                                        <option value="closed" ${job.status === 'closed' ? 'selected' : ''}>Closed</option>
                                    </select>
                                </td>
                                <td class="py-4 px-4 text-center">
                                    <span class="text-gray-600">${job.views || 0}</span>
                                </td>
                                <td class="py-4 px-4 text-center">
                                    <a href="/employer/jobs/${job.id}/applicants" data-link class="text-purple-600 hover:text-purple-800 font-medium">
                                        ${job.applications || 0} <i class="fas fa-chevron-right ml-1 text-xs"></i>
                                    </a>
                                </td>
                                <td class="py-4 px-4 text-right">
                                    <button class="btn btn-sm btn-outline edit-job-btn" data-job-id="${job.id}">
                                        <i class="fas fa-edit mr-1"></i> Edit
                                    </button>
                                </td>
                            </tr>
                        `
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    // Render edit form
    const renderEditForm = (job) => {
        return `
            <div class="card no-hover mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-edit mr-2"></i>
                        Edit Job: ${job.title}
                    </h2>
                    <button class="btn btn-outline cancel-edit-btn">
                        <i class="fas fa-times mr-2"></i> Cancel
                    </button>
                </div>
                
                <form id="editJobForm" class="space-y-6">
                    <input type="hidden" id="editJobId" value="${job.id}" />
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="form-label">Job Title *</label>
                            <input type="text" id="editJobTitle" required class="form-input" value="${job.title}" />
                        </div>
                        
                        <div>
                            <label class="form-label">Employment Type *</label>
                            <select id="editEmploymentType" required class="form-input">
                                <option value="full-time" ${job.employmentType === 'full-time' ? 'selected' : ''}>Full-time</option>
                                <option value="part-time" ${job.employmentType === 'part-time' ? 'selected' : ''}>Part-time</option>
                                <option value="internship" ${job.employmentType === 'internship' ? 'selected' : ''}>Internship</option>
                                <option value="freelance" ${job.employmentType === 'freelance' ? 'selected' : ''}>Freelance</option>
                                <option value="contract" ${job.employmentType === 'contract' ? 'selected' : ''}>Contract</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="form-label">Work Mode *</label>
                            <select id="editWorkMode" required class="form-input">
                                <option value="onsite" ${job.workMode === 'onsite' ? 'selected' : ''}>On-site</option>
                                <option value="remote" ${job.workMode === 'remote' ? 'selected' : ''}>Remote</option>
                                <option value="hybrid" ${job.workMode === 'hybrid' ? 'selected' : ''}>Hybrid</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="form-label">Location</label>
                            <input type="text" id="editLocation" class="form-input" value="${job.location || ''}" placeholder="e.g., Skopje, Macedonia" />
                        </div>
                        
                        <div>
                            <label class="form-label">Experience Level</label>
                            <select id="editExperienceLevel" class="form-input">
                                <option value="intern" ${job.experienceLevel === 'intern' ? 'selected' : ''}>Intern</option>
                                <option value="junior" ${job.experienceLevel === 'junior' ? 'selected' : ''}>Junior</option>
                                <option value="mid" ${job.experienceLevel === 'mid' ? 'selected' : ''}>Mid</option>
                                <option value="senior" ${job.experienceLevel === 'senior' ? 'selected' : ''}>Senior</option>
                            </select>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="form-label">Description *</label>
                            <textarea id="editDescription" required class="form-input" rows="4" placeholder="Job description...">${job.description || ''}</textarea>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="form-label">Responsibilities</label>
                            <textarea id="editResponsibilities" class="form-input" rows="3" placeholder="Key responsibilities...">${job.responsibilities || ''}</textarea>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="form-label">Qualifications</label>
                            <textarea id="editQualifications" class="form-input" rows="3" placeholder="Required qualifications...">${job.qualifications || ''}</textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" class="btn btn-outline cancel-edit-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save mr-2"></i> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;
    };

    // Main render
    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in" id="jobsContainer">
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
                    
                    <div id="jobsList">
                        ${renderJobsList()}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Attach event handlers for the jobs list
    const attachJobsListHandlers = () => {
        // Handle status change
        document.querySelectorAll('.status-select').forEach((select) => {
            select.addEventListener('change', async (e) => {
                const jobId = e.target.dataset.jobId;
                const newStatus = e.target.value;

                try {
                    await mockDataService.updateJob(jobId, { status: newStatus });

                    // Show success notification
                    const notification = document.createElement('div');
                    notification.className =
                        'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in';
                    notification.innerHTML =
                        '<i class="fas fa-check-circle mr-2"></i> Job status updated!';
                    document.body.appendChild(notification);

                    setTimeout(() => notification.remove(), 3000);
                } catch (error) {
                    console.error('Error updating job status:', error);
                    alert('Failed to update job status. Please try again.');
                }
            });
        });

        // Handle edit button click
        document.querySelectorAll('.edit-job-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.closest('.edit-job-btn').dataset.jobId;
                const job = jobs.find((j) => j.id === jobId);

                if (job) {
                    document.getElementById('jobsList').innerHTML = renderEditForm(job);
                    attachEditFormHandlers(job);
                }
            });
        });
    };

    // Event handlers
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    // Attach jobs list handlers
    attachJobsListHandlers();

    // Attach edit form handlers
    const attachEditFormHandlers = (job) => {
        // Cancel button
        document.querySelectorAll('.cancel-edit-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                // Go back to jobs list without full page reload
                document.getElementById('jobsList').innerHTML = renderJobsList();
                attachJobsListHandlers();
            });
        });

        // Form submit
        const editForm = document.getElementById('editJobForm');
        if (editForm) {
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const jobId = document.getElementById('editJobId').value;
                const updatedJob = {
                    title: document.getElementById('editJobTitle').value,
                    employmentType: document.getElementById('editEmploymentType').value,
                    workMode: document.getElementById('editWorkMode').value,
                    location: document.getElementById('editLocation').value,
                    experienceLevel: document.getElementById('editExperienceLevel').value,
                    description: document.getElementById('editDescription').value,
                    responsibilities: document.getElementById('editResponsibilities').value,
                    qualifications: document.getElementById('editQualifications').value,
                    updatedAt: new Date().toISOString(),
                };

                try {
                    await mockDataService.updateJob(jobId, updatedJob);

                    // Show success notification
                    const notification = document.createElement('div');
                    notification.className =
                        'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in';
                    notification.innerHTML =
                        '<i class="fas fa-check-circle mr-2"></i> Job updated successfully!';
                    document.body.appendChild(notification);

                    setTimeout(() => notification.remove(), 3000);

                    // Go back to jobs list without full page reload
                    document.getElementById('jobsList').innerHTML = renderJobsList();
                    attachJobsListHandlers();
                } catch (error) {
                    console.error('Error updating job:', error);
                    alert('Failed to update job. Please try again.');
                }
            });
        }
    };
}
 
