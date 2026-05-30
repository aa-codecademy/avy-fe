/**
 * Job Detail Controller
 * Shows job details and application form
 */
import authService from '../../services/authService.js';
import languageService from '../../services/languageService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';
import { formatDate } from '../../components/applications/applicationsHelpers.js';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const t = (key) => languageService.translate(key);

const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default async function jobDetailController(params = {}) {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    const jobId = params.id;

    const [job, company, userApplications] = await Promise.all([
        mockDataService.getJobById(jobId),
        mockDataService.getCompanyById(
            jobId ? (await mockDataService.getJobById(jobId))?.companyId : null
        ),
        mockDataService.getApplications({ userId: user.id }),
    ]);

    if (!job) {
        window.router.navigate('/404');
        return;
    }

    const hasApplied = userApplications.some((app) => app.jobId === job.id);
    const daysUntilDeadline = Math.ceil(
        (new Date(job.applicationDeadline) - new Date()) / (24 * 60 * 60 * 1000)
    );

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <button onclick="window.router.navigate('/jobs')" class="mb-6 text-gray-600 hover:text-purple-600 transition">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to Jobs
                    </button>
                    
                    <div class="grid lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <div class="card mb-6">
                                <div class="flex items-start gap-4 mb-6">
                                    <img src="${company.logo}" alt="${company.name}" class="w-20 h-20 rounded-lg" />
                                    <div class="flex-1">
                                        <h1 class="text-3xl font-bold text-gray-800 mb-2">${job.title}</h1>
                                        <p class="text-xl text-gray-600 mb-3">${company.name}</p>
                                        <div class="flex flex-wrap gap-2">
                                            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                                <i class="fas fa-briefcase mr-1"></i> ${job.employmentType}
                                            </span>
                                            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                <i class="fas fa-map-marker-alt mr-1"></i> ${job.location}
                                            </span>
                                            <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                <i class="fas fa-laptop-house mr-1"></i> ${job.workMode}
                                            </span>
                                            <span class="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                                                <i class="fas fa-chart-line mr-1"></i> ${job.experienceLevel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                ${
                                    job.salaryRange.min && job.salaryRange.max
                                        ? `
                                    <div class="mb-6 p-4 bg-green-50 rounded-lg">
                                        <p class="text-green-800 font-semibold">
                                            <i class="fas fa-money-bill-wave mr-2"></i>
                                            ${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency} per month
                                        </p>
                                    </div>
                                `
                                        : ''
                                }
                                
                                <div class="mb-6">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-3">About the Job</h2>
                                    <p class="text-gray-700 leading-relaxed">${job.description}</p>
                                </div>
                                
                                <div class="mb-6">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-3">Responsibilities</h2>
                                    <div class="text-gray-700 leading-relaxed whitespace-pre-line">${job.responsibilities}</div>
                                </div>
                                
                                <div class="mb-6">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-3">Required Qualifications</h2>
                                    <div class="text-gray-700 leading-relaxed whitespace-pre-line">${job.qualifications}</div>
                                </div>
                                
                                <div class="mb-6">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-3">Required Skills</h2>
                                    <div class="flex flex-wrap gap-2">
                                        ${job.requiredSkills
                                            .map(
                                                (skill) => `
                                            <span class="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold">
                                                ${skill}
                                            </span>
                                        `
                                            )
                                            .join('')}
                                    </div>
                                </div>
                                
                                ${
                                    job.niceToHaveSkills.length > 0
                                        ? `
                                    <div class="mb-6">
                                        <h2 class="text-2xl font-bold text-gray-800 mb-3">Nice to Have</h2>
                                        <div class="flex flex-wrap gap-2">
                                            ${job.niceToHaveSkills
                                                .map(
                                                    (skill) => `
                                                <span class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                                                    ${skill}
                                                </span>
                                            `
                                                )
                                                .join('')}
                                        </div>
                                    </div>
                                `
                                        : ''
                                }
                                
                                ${
                                    job.benefits
                                        ? `
                                    <div class="mb-6">
                                        <h2 class="text-2xl font-bold text-gray-800 mb-3">Benefits</h2>
                                        <div class="text-gray-700 leading-relaxed whitespace-pre-line">${job.benefits}</div>
                                    </div>
                                `
                                        : ''
                                }
                            </div>
                            
                            ${
                                user.role !== 'employer' && !hasApplied
                                    ? `
                                <div class="card">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                                        <i class="fas fa-paper-plane mr-2"></i>
                                        Apply for this Position
                                    </h2>
                                    
                                    <form id="applicationForm" class="space-y-4">
                                        <div class="p-4 bg-blue-50 rounded-lg">
                                            <p class="text-blue-900 text-sm">
                                                <i class="fas fa-info-circle mr-2"></i>
                                                Your profile information will be automatically shared with the employer
                                            </p>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label class="form-label">Cover Letter (Optional)</label>
                                            <textarea 
                                                id="coverLetter" 
                                                class="form-input" 
                                                rows="6" 
                                                placeholder="Tell us why you're interested in this position..."
                                            ></textarea>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label class="form-label">Comment (Optional)</label>
                                            <textarea 
                                                id="comment" 
                                                class="form-input" 
                                                rows="4" 
                                                placeholder="Add any additional comments..."
                                            ></textarea>
                                        </div>

                                        <div class="form-group">
                                            <div class="bg-white border border-gray-200 rounded-3xl pt-6 px-6 pb-0 shadow-sm">
                                                <div class="flex items-start gap-4 mb-6">
                                                    <div class="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                                                        <i class="far fa-file-alt text-3xl text-purple-600"></i>
                                                    </div>

                                                    <div>
                                                        <div class="flex items-center gap-3 mb-1">
                                                            <h3 class="text-2xl font-bold text-gray-800">
                                                                Upload CV / Documents
                                                            </h3>

                                                            <span class="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold flex items-center gap-1">
                                                                <span class="italic">*</span>
                                                                <span>Required</span>
                                                            </span>
                                                        </div>

                                                        <p class="text-gray-500">
                                                            Upload one or more files. You can add and remove documents anytime.
                                                        </p>
                                                    </div>
                                                </div>

                                                <input
                                                    type="file"
                                                    id="cvUpload"
                                                    class="hidden"
                                                    multiple
                                                    accept=".pdf,.doc,.docx"
                                                />

                                                <label
                                                    for="cvUpload"
                                                    id="uploadDropZone"
                                                    class="block border-2 border-dashed border-purple-400 rounded-2xl p-10 text-center cursor-pointer hover:bg-purple-50 transition"
                                                >
                                                    <i class="fas fa-cloud-upload-alt text-5xl text-purple-600 mb-4"></i>

                                                    <p class="text-lg font-semibold text-gray-800">
                                                        Drag and drop files here
                                                    </p>

                                                    <p class="text-gray-500 my-2">or</p>

                                                    <div class="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                                                        Choose Files
                                                    </div>
                                                </label>

                                                <p class="text-gray-500 mt-4">
                                                    <i class="fas fa-info-circle text-purple-600 mr-2"></i>
                                                    You can upload multiple files (PDF, DOC, DOCX) up to 5MB each.
                                                </p>

                                                <div class="flex justify-between items-center mt-7 mb-4">
                                                    <h4 id="uploadedDocumentsTitle" class="text-xl font-bold text-gray-800 hidden">
                                                        Uploaded Documents
                                                    </h4>

                                                    <p id="uploadedDocumentsSize" class="text-gray-500 hidden">
                                                        Total size: 0 MB
                                                    </p>
                                                </div>

                                                <div id="uploadedDocumentsList" class="space-y-2"></div>
                                            </div>
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary w-full text-lg">
                                            <i class="fas fa-paper-plane mr-2"></i>
                                            Submit Application
                                        </button>
                                    </form>
                                </div>
                            `
                                    : hasApplied
                                      ? `
                                <div class="card bg-green-50 border-2 border-green-200">
                                    <div class="text-center">
                                        <i class="fas fa-check-circle text-6xl text-green-600 mb-4"></i>
                                        <h3 class="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h3>
                                        <p class="text-green-700">You have already applied for this position.</p>
                                        <a href="/dashboard" data-link class="btn btn-primary mt-4">
                                            View Your Applications
                                        </a>
                                    </div>
                                </div>
                            `
                                      : ''
                            }
                        </div>
                        
                        <div class="lg:col-span-1">
                            <div class="card mb-6 sticky top-4">
                                <h3 class="text-xl font-bold text-gray-800 mb-4">Job Information</h3>
                                
                                <div class="space-y-3 text-sm">
                                    <div class="flex items-center text-gray-700">
                                        <i class="fas fa-calendar-alt w-6 text-purple-600"></i>
                                        <div>
                                            <p class="font-semibold">Posted</p>
                                            <p>${formatDate(job.createdAt)}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center text-gray-700">
                                        <i class="fas fa-clock w-6 text-purple-600"></i>
                                        <div>
                                            <p class="font-semibold">Deadline</p>
                                            <p>${formatDate(job.applicationDeadline)} (${daysUntilDeadline} days)</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center text-gray-700">
                                        <i class="fas fa-users w-6 text-purple-600"></i>
                                        <div>
                                            <p class="font-semibold">Applicants</p>
                                            <p>${job.applications} applied</p>
                                        </div>
                                    </div>

                                    <div class="flex items-center text-gray-700">
                                        <i class="fas ${(job.applicationMode || 'easy_apply') === 'cv_required' ? 'fa-file-upload' : 'fa-bolt'} w-6 text-purple-600"></i>
                                        <div>
                                            <p class="font-semibold">Application type</p>
                                            <p>${(job.applicationMode || 'easy_apply') === 'cv_required' ? 'CV upload required' : 'Easy Apply'}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center text-gray-700">
                                        <i class="fas fa-eye w-6 text-purple-600"></i>
                                        <div>
                                            <p class="font-semibold">Views</p>
                                            <p>${job.views} views</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr class="my-4" />
                                
                                <h3 class="text-xl font-bold text-gray-800 mb-3">About ${company.name}</h3>
                                <p class="text-gray-700 text-sm mb-3">${company.description}</p>
                                <a href="/companies/${company.id}" data-link class="text-purple-600 hover:text-purple-800 text-sm font-semibold">
                                    View Company Profile <i class="fas fa-arrow-right ml-1"></i>
                                </a>
                                
                                ${
                                    company.website
                                        ? `
                                    <div class="mt-3">
                                        <a href="${company.website}" target="_blank" class="text-gray-600 hover:text-purple-600 text-sm">
                                            <i class="fas fa-globe mr-1"></i> ${company.website}
                                        </a>
                                    </div>
                                `
                                        : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const applicationForm = document.getElementById('applicationForm');

    const cvUpload = document.getElementById('cvUpload');
    const uploadDropZone = document.getElementById('uploadDropZone');
    const uploadedDocumentsList = document.getElementById('uploadedDocumentsList');
    const uploadedDocumentsTitle = document.getElementById('uploadedDocumentsTitle');
    const uploadedDocumentsSize = document.getElementById('uploadedDocumentsSize');

    const submitBtn = applicationForm?.querySelector('button[type="submit"]');

    let selectedFiles = [];
    const requiresCv = true;

    function updateSubmitState() {
        if (!submitBtn) return;

        const isValid = !requiresCv || selectedFiles.length > 0;

        submitBtn.disabled = !isValid;
        submitBtn.classList.toggle('opacity-50', !isValid);
        submitBtn.classList.toggle('cursor-not-allowed', !isValid);
    }

    function showToast(message, type = 'success') {
        const oldToast = document.getElementById('appToast');
        if (oldToast) oldToast.remove();

        const toastStyles = {
            success: {
                icon: 'fa-check-circle',
                title: 'Success',
                classes: 'border-green-200 bg-green-50 text-green-800',
                iconColor: 'text-green-600',
            },
            error: {
                icon: 'fa-times-circle',
                title: 'Error',
                classes: 'border-red-200 bg-red-50 text-red-800',
                iconColor: 'text-red-600',
            },
            warning: {
                icon: 'fa-exclamation-circle',
                title: 'Warning',
                classes: 'border-yellow-200 bg-yellow-50 text-yellow-800',
                iconColor: 'text-yellow-600',
            },
        };

        const config = toastStyles[type] || toastStyles.success;

        const toast = document.createElement('div');
        toast.id = 'appToast';
        toast.className = `
        fixed top-6 right-6 z-[9999] w-[360px] max-w-[calc(100%-32px)]
        ${config.classes}
        border rounded-2xl shadow-xl p-4 flex items-start gap-3
        transition-all duration-300
    `;

        toast.innerHTML = `
        <i class="fas ${config.icon} ${config.iconColor} text-2xl mt-1"></i>

        <div class="flex-1">
            <p class="font-bold mb-1">${config.title}</p>
            <p class="text-sm leading-relaxed">${message}</p>
        </div>

        <button type="button" class="text-gray-400 hover:text-gray-700 transition">
            <i class="fas fa-times"></i>
        </button>
    `;

        toast.querySelector('button').addEventListener('click', () => {
            toast.remove();
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3500);
    }

    function renderUploadedDocuments() {
        if (!uploadedDocumentsList) return;

        if (selectedFiles.length === 0) {
            uploadedDocumentsList.innerHTML = '';
            uploadedDocumentsTitle.classList.add('hidden');
            uploadedDocumentsSize.classList.add('hidden');
            return;
        }

        const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

        uploadedDocumentsTitle.textContent = `Uploaded Documents (${selectedFiles.length}/${MAX_FILES})`;
        uploadedDocumentsSize.textContent = `Total size: ${formatFileSize(totalSize)}`;

        uploadedDocumentsTitle.classList.remove('hidden');
        uploadedDocumentsSize.classList.remove('hidden');

        uploadedDocumentsList.innerHTML = selectedFiles
            .map(
                (file, index) => `
            <div class="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
                <div class="flex items-center gap-4 min-w-0">
                    <div class="w-12 h-14 rounded-lg ${getFileBadgeClass(file.name)} flex items-center justify-center text-white font-bold text-xs shrink-0">
                        ${getFileExtension(file.name)}
                    </div>

                    <div class="min-w-0">
                        <p class="font-bold text-gray-800 truncate">${file.name}</p>
                        <p class="text-gray-500 text-sm">${formatFileSize(file.size)}</p>
                    </div>
                </div>

                <button
                    type="button"
                    class="remove-uploaded-file w-10 h-10 border border-gray-200 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0"
                    data-index="${index}"
                >
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `
            )
            .join('');

        document.querySelectorAll('.remove-uploaded-file').forEach((btn) => {
            btn.addEventListener('click', () => {
                selectedFiles.splice(Number(btn.dataset.index), 1);
                renderUploadedDocuments();
                updateSubmitState();
            });
        });
    }

    function addSelectedFiles(files) {
        const validFiles = [];

        files.forEach((file) => {
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                showToast(
                    `${file.name} is not allowed. Only PDF, DOC and DOCX files are accepted.`,
                    'error'
                );
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                showToast(`${file.name} is too large. Maximum file size is 5MB.`, 'error');
                return;
            }

            const alreadyAdded = selectedFiles.some(
                (selectedFile) => selectedFile.name === file.name && selectedFile.size === file.size
            );

            if (alreadyAdded) {
                showToast(`${file.name} is already added.`, 'warning');
                return;
            }

            validFiles.push(file);
        });

        const availableSlots = MAX_FILES - selectedFiles.length;

        if (availableSlots <= 0) {
            showToast(`You can upload maximum ${MAX_FILES} files.`, 'warning');
            return;
        }

        if (validFiles.length > availableSlots) {
            showToast(`You can upload maximum ${MAX_FILES} files.`, 'warning');
        }

        selectedFiles = [...selectedFiles, ...validFiles.slice(0, availableSlots)];
        renderUploadedDocuments();
        updateSubmitState();
    }

    if (cvUpload) {
        cvUpload.addEventListener('change', () => {
            const files = Array.from(cvUpload.files);
            addSelectedFiles(files);
            cvUpload.value = '';
        });
    }

    if (uploadDropZone) {
        uploadDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDropZone.classList.add('bg-purple-50', 'border-purple-600');
        });

        uploadDropZone.addEventListener('dragleave', () => {
            uploadDropZone.classList.remove('bg-purple-50', 'border-purple-600');
        });

        uploadDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDropZone.classList.remove('bg-purple-50', 'border-purple-600');

            const files = Array.from(e.dataTransfer.files);
            addSelectedFiles(files);
        });
    }

    if (applicationForm && user.role !== 'employer') {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const coverLetter = document.getElementById('coverLetter').value;
            const comment = document.getElementById('comment').value;

            if (requiresCv && selectedFiles.length === 0) {
                showToast('You must upload a CV before submitting this application.', 'warning');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

            try {
                await mockDataService.createApplication({
                    jobId: job.id,
                    userId: user.id,
                    coverLetter: coverLetter,
                    comment: comment,
                });

                showToast('Application submitted successfully!', 'success');

                setTimeout(() => {
                    window.location.reload();
                }, 1200);
            } catch (error) {
                showToast('Failed to submit application. Please try again.', 'error');
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Application';
                updateSubmitState();
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
    updateSubmitState();
}

function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 1024)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getFileExtension(fileName) {
    return fileName.split('.').pop().toUpperCase();
}

function getFileBadgeClass(fileName) {
    const extension = getFileExtension(fileName).toLowerCase();

    if (extension === 'pdf') return 'bg-red-500';
    if (extension === 'doc' || extension === 'docx') return 'bg-blue-500';

    return 'bg-green-500';
}
