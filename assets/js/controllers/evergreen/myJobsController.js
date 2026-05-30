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
import languageService from '../../services/languageService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function myJobsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    const t = (key) => languageService.translate(key);

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
            <div class="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                ${jobs
                    .map(
                        (job) => `
                        <div class="card no-hover bg-white hover:shadow-lg transition-shadow duration-200" data-job-id="${job.id}">
                            <!-- Header: Title and Status -->
                            <div class="flex justify-between items-start mb-4">
                                <div class="flex-1">
                                    <h3 class="text-xl font-bold text-gray-800 mb-1">${job.title}</h3>
                                    <div class="flex items-center text-gray-600 text-sm">
                                        <i class="fas fa-map-marker-alt mr-2 text-purple-600"></i>
                                        ${job.location || 'No location specified'}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="job-status-badge inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                        job.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : job.status === 'paused'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                    }">
                                        <i class="fas ${
                                            job.status === 'active'
                                                ? 'fa-circle'
                                                : job.status === 'paused'
                                                  ? 'fa-pause-circle'
                                                  : 'fa-times-circle'
                                        } mr-1"></i>
                                        ${job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <!-- Job Details Grid -->
                            <div class="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200">
                                <div class="flex items-center">
                                    <i class="fas fa-briefcase text-purple-600 mr-2 w-4"></i>
                                    <span class="text-sm text-gray-700">${job.employmentType}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-globe text-purple-600 mr-2 w-4"></i>
                                    <span class="text-sm text-gray-700">${getWorkModeLabel(job.workMode)}</span>
                                </div>
                                ${
                                    job.experienceLevel
                                        ? `
                                    <div class="flex items-center">
                                        <i class="fas fa-chart-line text-purple-600 mr-2 w-4"></i>
                                        <span class="text-sm text-gray-700">${job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}</span>
                                    </div>
                                `
                                        : ''
                                }
                                <div class="flex items-center">
                                    <i class="fas fa-eye text-purple-600 mr-2 w-4"></i>
                                    <span class="text-sm text-gray-700">${job.views || 0} views</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-users text-purple-600 mr-2 w-4"></i>
                                    <span class="text-sm text-gray-700">${job.applications || 0} applicants</span>
                                </div>
                            </div>

                            <!-- Salary Section -->
                            ${
                                job.salaryMin && job.salaryMax
                                    ? `
                                <div class="mb-4 pb-4 border-b border-gray-200">
                                    <div class="flex items-center">
                                        <i class="fas fa-euro-sign text-purple-600 mr-2 text-lg"></i>
                                        <span class="text-base font-bold text-gray-800">€${job.salaryMin.toLocaleString()} - €${job.salaryMax.toLocaleString()}</span>
                                        <span class="text-xs text-gray-500 ml-2">/year</span>
                                    </div>
                                </div>
                            `
                                    : ''
                            }

                            <!-- Description Section -->
                            ${
                                job.description
                                    ? `
                                <div class="mb-4 pb-4 border-b border-gray-200">
                                    <h4 class="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                        <i class="fas fa-file-alt text-purple-600 mr-2"></i>
                                        Description
                                    </h4>
                                    <p class="text-sm text-gray-700 line-clamp-3">${job.description}</p>
                                </div>
                            `
                                    : ''
                            }

                            <!-- Qualifications Section -->
                            ${
                                job.qualifications
                                    ? `
                                <div class="mb-4 pb-4 border-b border-gray-200">
                                    <h4 class="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                        <i class="fas fa-tasks text-purple-600 mr-2"></i>
                                        Qualifications
                                    </h4>
                                    <ul class="text-sm text-gray-700 space-y-1">
                                        ${(() => {
                                            // Handle both string and array formats
                                            const qualsList = Array.isArray(job.qualifications)
                                                ? job.qualifications.filter((q) => q && q.trim())
                                                : job.qualifications
                                                      .split('\n')
                                                      .filter((q) => q.trim());

                                            return qualsList
                                                .slice(0, 3)
                                                .map(
                                                    (q) =>
                                                        `<li class="flex items-start"><i class="fas fa-check text-green-600 mr-2 mt-0.5 text-xs"></i><span>${typeof q === 'string' ? q.trim() : q}</span></li>`
                                                )
                                                .join('');
                                        })()}
                                        ${(() => {
                                            const qualsList = Array.isArray(job.qualifications)
                                                ? job.qualifications.filter((q) => q && q.trim())
                                                : job.qualifications
                                                      .split('\n')
                                                      .filter((q) => q.trim());
                                            return qualsList.length > 3
                                                ? '<li class="text-purple-600 font-semibold text-xs">+ more...</li>'
                                                : '';
                                        })()}
                                    </ul>
                                </div>
                            `
                                    : ''
                            }

                            <!-- Status Control -->
                            <div class="mb-4">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Job Visibility</label>
                                <select class="status-select form-input w-full py-2 px-3 text-sm" data-job-id="${job.id}">
                                    <option value="active" ${job.status === 'active' ? 'selected' : ''}>
                                        <i class="fas fa-circle mr-1"></i> ${t('jobs.statusActive')}
                                    </option>
                                    <option value="paused" ${job.status === 'paused' ? 'selected' : ''}>
                                        <i class="fas fa-pause-circle mr-1"></i> ${t('jobs.statusPaused')}
                                    </option>
                                    <option value="closed" ${job.status === 'closed' ? 'selected' : ''}>
                                        <i class="fas fa-times-circle mr-1"></i> ${t('jobs.statusClosed')}
                                    </option>
                                </select>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex gap-3">
                                <a href="/employer/jobs/${job.id}/applicants" data-link class="flex-1 btn btn-primary text-center text-sm">
                                    <i class="fas fa-users mr-2"></i>View Applicants
                                </a>
                                <button class="flex-1 btn btn-outline edit-job-btn text-sm" data-job-id="${job.id}">
                                    <i class="fas fa-edit mr-2"></i>Edit
                                </button>
                            </div>
                        </div>
                    `
                    )
                    .join('')}
            </div>
        `;
    };

    // Render edit form
    const renderEditForm = (job) => {
        return `
            <div class="card no-hover bg-white">
                <div class="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-800 mb-1">
                            <i class="fas fa-edit text-purple-600 mr-2"></i>
                            Edit Job Posting
                        </h2>
                        <p class="text-gray-600">Update job details and publish changes instantly</p>
                    </div>
                    <button type="button" class="btn btn-secondary cancel-edit-btn">
                        <i class="fas fa-times mr-2"></i> Cancel
                    </button>
                </div>

                <form id="editJobForm" class="space-y-8">
                    <input type="hidden" id="editJobId" value="${job.id}" />

                    <!-- Basic Information Section -->
                    <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-info-circle text-purple-600 mr-2"></i>
                            Basic Information
                        </h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="md:col-span-2">
                                <label class="form-label">Job Title *</label>
                                <input type="text" id="editJobTitle" required class="form-input text-lg" value="${job.title}" placeholder="e.g., Senior Developer" />
                            </div>

                            <div>
                                <label class="form-label">Employment Type *</label>
                                <select id="editEmploymentType" required class="form-input">
                                    <option value="">Select type...</option>
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
                                    <option value="">Select mode...</option>
                                    <option value="onsite" ${job.workMode === 'onsite' ? 'selected' : ''}>On-site</option>
                                    <option value="remote" ${job.workMode === 'remote' ? 'selected' : ''}>Remote</option>
                                    <option value="hybrid" ${job.workMode === 'hybrid' ? 'selected' : ''}>Hybrid</option>
                                </select>
                            </div>

                            <div>
                                <label class="form-label">Location *</label>
                                <input type="text" id="editLocation" required class="form-input" value="${job.location || ''}" placeholder="e.g., Skopje, Macedonia" />
                            </div>

                            <div>
                                <label class="form-label">Experience Level</label>
                                <select id="editExperienceLevel" class="form-input">
                                    <option value="">Select level...</option>
                                    <option value="entry" ${job.experienceLevel === 'entry' ? 'selected' : ''}>Entry Level (0-2 years)</option>
                                    <option value="mid" ${job.experienceLevel === 'mid' ? 'selected' : ''}>Mid Level (2-5 years)</option>
                                    <option value="senior" ${job.experienceLevel === 'senior' ? 'selected' : ''}>Senior (5+ years)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Job Description Section -->
                    <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-file-alt text-purple-600 mr-2"></i>
                            Job Description
                        </h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="md:col-span-2">
                                <label class="form-label">Description *</label>
                                <textarea id="editDescription" required class="form-input" rows="5" placeholder="Provide a detailed description of the role...">${job.description || ''}</textarea>
                            </div>

                            <div class="md:col-span-2">
                                <label class="form-label">Responsibilities</label>
                                <textarea id="editResponsibilities" class="form-input" rows="4" placeholder="List key responsibilities (one per line)...">${job.responsibilities || ''}</textarea>
                                <p class="text-xs text-gray-600 mt-1">💡 Separate each responsibility with a new line</p>
                            </div>

                            <div class="md:col-span-2">
                                <label class="form-label">Required Qualifications</label>
                                <textarea id="editQualifications" class="form-input" rows="4" placeholder="List required qualifications (one per line)...">${job.qualifications || ''}</textarea>
                                <p class="text-xs text-gray-600 mt-1">💡 Separate each qualification with a new line</p>
                            </div>
                        </div>
                    </div>

                    <!-- Compensation Section -->
                    <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-euro-sign text-purple-600 mr-2"></i>
                            Compensation & Details
                        </h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="form-label">Minimum Salary (EUR)</label>
                                <input type="number" id="editSalaryMin" class="form-input" value="${job.salaryMin || ''}" min="0" placeholder="e.g. 1500" />
                            </div>

                            <div>
                                <label class="form-label">Maximum Salary (EUR)</label>
                                <input type="number" id="editSalaryMax" class="form-input" value="${job.salaryMax || ''}" min="0" placeholder="e.g. 3000" />
                            </div>
                        </div>
                    </div>

                    <!-- Job Visibility Section -->
                    <div class="border border-gray-200 rounded-lg p-6 bg-blue-50 border-blue-300">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-eye text-purple-600 mr-2"></i>
                            Job Visibility
                        </h3>
                        <div class="mb-4">
                            <label class="form-label">Current Status *</label>
                            <select id="editJobStatus" required class="form-input text-base">
                                <option value="active" ${job.status === 'active' ? 'selected' : ''}>
                                    <i class="fas fa-circle mr-1"></i> ${t('jobs.statusActive')}
                                </option>
                                <option value="paused" ${job.status === 'paused' ? 'selected' : ''}>
                                    <i class="fas fa-pause-circle mr-1"></i> ${t('jobs.statusPaused')}
                                </option>
                                <option value="closed" ${job.status === 'closed' ? 'selected' : ''}>
                                    <i class="fas fa-times-circle mr-1"></i> ${t('jobs.statusClosed')}
                                </option>
                            </select>
                            <div class="mt-3 p-3 bg-white rounded border border-gray-200 text-sm text-gray-700">
                                <p><strong>${t('jobs.statusActive').split(' - ')[0]}:</strong> ${t('jobs.descriptionActive')}</p>
                                <p><strong>${t('jobs.statusPaused').split(' - ')[0]}:</strong> ${t('jobs.descriptionPaused')}</p>
                                <p><strong>${t('jobs.statusClosed').split(' - ')[0]}:</strong> ${t('jobs.descriptionClosed')}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button type="button" class="btn btn-secondary cancel-edit-btn">
                            <i class="fas fa-times mr-2"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary px-8 text-lg">
                            <i class="fas fa-save mr-2"></i> Save Changes Instantly
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
                const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
                const statusBadge = jobCard.querySelector('.job-status-badge');

                try {
                    await mockDataService.updateJob(jobId, { status: newStatus });

                    // Update status badge styling
                    const statusColors = {
                        active: {
                            classes: 'bg-green-100 text-green-800',
                            icon: 'fa-circle',
                            text: 'Active',
                        },
                        paused: {
                            classes: 'bg-yellow-100 text-yellow-800',
                            icon: 'fa-pause-circle',
                            text: 'Paused',
                        },
                        closed: {
                            classes: 'bg-red-100 text-red-800',
                            icon: 'fa-times-circle',
                            text: 'Closed',
                        },
                    };

                    const statusConfig = statusColors[newStatus];
                    statusBadge.className = `job-status-badge inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.classes}`;
                    statusBadge.innerHTML = `<i class="fas ${statusConfig.icon} mr-1"></i>${statusConfig.text}`;

                    // Update the job object
                    const job = jobs.find((j) => j.id === jobId);
                    if (job) {
                        job.status = newStatus;
                    }

                    // Show success notification
                    const statusLabels = {
                        active: 'Active - Now accepting applications',
                        paused: 'Paused - Temporarily hidden from candidates',
                        closed: 'Closed - Position has been filled',
                    };

                    const notification = document.createElement('div');
                    notification.className =
                        'fixed top-4 right-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 fade-in flex items-center gap-3';
                    notification.innerHTML = `<i class="fas fa-check-circle text-xl"></i> <span><strong>Job visibility updated!</strong> ${statusLabels[newStatus]}</span>`;
                    document.body.appendChild(notification);

                    setTimeout(() => notification.remove(), 4000);
                } catch (error) {
                    console.error('Error updating job status:', error);
                    const errorNotification = document.createElement('div');
                    errorNotification.className =
                        'fixed top-4 right-4 bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 fade-in flex items-center gap-3';
                    errorNotification.innerHTML =
                        '<i class="fas fa-exclamation-circle text-xl"></i> <span><strong>Error!</strong> Failed to update job status.</span>';
                    document.body.appendChild(errorNotification);

                    setTimeout(() => errorNotification.remove(), 4000);
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
                    salaryMin: document.getElementById('editSalaryMin').value
                        ? parseInt(document.getElementById('editSalaryMin').value)
                        : null,
                    salaryMax: document.getElementById('editSalaryMax').value
                        ? parseInt(document.getElementById('editSalaryMax').value)
                        : null,
                    status: document.getElementById('editJobStatus').value,
                    updatedAt: new Date().toISOString(),
                };

                try {
                    await mockDataService.updateJob(jobId, updatedJob);

                    // Show success notification
                    const notification = document.createElement('div');
                    notification.className =
                        'fixed top-4 right-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 fade-in flex items-center gap-3';
                    notification.innerHTML =
                        '<i class="fas fa-check-circle text-xl"></i> <span><strong>Success!</strong> Job posting updated and published instantly.</span>';
                    document.body.appendChild(notification);

                    setTimeout(() => notification.remove(), 4000);

                    // Go back to jobs list without full page reload
                    document.getElementById('jobsList').innerHTML = renderJobsList();
                    attachJobsListHandlers();
                } catch (error) {
                    console.error('Error updating job:', error);
                    const errorNotification = document.createElement('div');
                    errorNotification.className =
                        'fixed top-4 right-4 bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 fade-in flex items-center gap-3';
                    errorNotification.innerHTML =
                        '<i class="fas fa-exclamation-circle text-xl"></i> <span><strong>Error!</strong> Failed to update job. Please try again.</span>';
                    document.body.appendChild(errorNotification);

                    setTimeout(() => errorNotification.remove(), 4000);
                }
            });
        }
    };
}
