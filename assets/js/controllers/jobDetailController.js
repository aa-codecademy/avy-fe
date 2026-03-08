/**
 * Job Detail Controller
 * Shows job details and application form
 */
import authService from '../services/authService.js';
import mockDataService from '../services/mockDataService.js';

export default async function jobDetailController(params = {}) {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user) {
        window.router.navigate('/login');
        return;
    }
    
    // Get jobId from params
    const jobId = params.id;
    
    // Load data
    const [job, company, userApplications] = await Promise.all([
        mockDataService.getJobById(jobId),
        mockDataService.getCompanyById(jobId ? (await mockDataService.getJobById(jobId))?.companyId : null),
        mockDataService.getApplications({ userId: user.id })
    ]);
    
    if (!job) {
        window.router.navigate('/404');
        return;
    }
    
    const hasApplied = userApplications.some(app => app.jobId === job.id);
    const daysUntilDeadline = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (24 * 60 * 60 * 1000));
    
    app.innerHTML = `
        ${renderHeader(user)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <!-- Back Button -->
                    <button onclick="window.router.navigate('/jobs')" class="mb-6 text-gray-600 hover:text-purple-600 transition">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to Jobs
                    </button>
                    
                    <div class="grid lg:grid-cols-3 gap-6">
                        <!-- Main Content -->
                        <div class="lg:col-span-2">
                            <div class="card mb-6">
                                <!-- Job Header -->
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
                                
                                <!-- Salary -->
                                ${job.salaryRange.min && job.salaryRange.max ? `
                                    <div class="mb-6 p-4 bg-green-50 rounded-lg">
                                        <p class="text-green-800 font-semibold">
                                            <i class="fas fa-money-bill-wave mr-2"></i>
                                            ${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency} per month
                                        </p>
                                    </div>
                                ` : ''}
                                
                                <!-- Description -->
                                <div class="mb-6">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-3">About the Job</h2>
                                    <p class="text-gray-700 leading-relaxed">${job.description}</p>
                                </div>
                                
                                <!-- Responsibilities -->
                                <div class="mb-6">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-3">Responsibilities</h2>
                                    <div class="text-gray-700 leading-relaxed whitespace-pre-line">${job.responsibilities}</div>
                                </div>
                                
                                <!-- Qualifications -->
                                <div class="mb-6">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-3">Required Qualifications</h2>
                                    <div class="text-gray-700 leading-relaxed whitespace-pre-line">${job.qualifications}</div>
                                </div>
                                
                                <!-- Required Skills -->
                                <div class="mb-6">
                                    <h2 class="text-2xl font-bold text-gray-800 mb-3">Required Skills</h2>
                                    <div class="flex flex-wrap gap-2">
                                        ${job.requiredSkills.map(skill => `
                                            <span class="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold">
                                                ${skill}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <!-- Nice to Have Skills -->
                                ${job.niceToHaveSkills.length > 0 ? `
                                    <div class="mb-6">
                                        <h2 class="text-2xl font-bold text-gray-800 mb-3">Nice to Have</h2>
                                        <div class="flex flex-wrap gap-2">
                                            ${job.niceToHaveSkills.map(skill => `
                                                <span class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                                                    ${skill}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <!-- Benefits -->
                                ${job.benefits ? `
                                    <div class="mb-6">
                                        <h2 class="text-2xl font-bold text-gray-800 mb-3">Benefits</h2>
                                        <div class="text-gray-700 leading-relaxed whitespace-pre-line">${job.benefits}</div>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <!-- Application Form -->
                            ${user.role !== 'employer' && !hasApplied ? `
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
                                            <label class="form-label">Upload CV/Documents (Optional)</label>
                                            <input type="file" id="cvUpload" class="form-input" multiple accept=".pdf,.doc,.docx" />
                                            <p class="text-xs text-gray-500 mt-1">You can upload PDF or Word documents</p>
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary w-full text-lg">
                                            <i class="fas fa-paper-plane mr-2"></i>
                                            Submit Application
                                        </button>
                                    </form>
                                </div>
                            ` : hasApplied ? `
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
                            ` : ''}
                        </div>
                        
                        <!-- Sidebar -->
                        <div class="lg:col-span-1">
                            <!-- Job Info -->
                            <div class="card mb-6 sticky top-4">
                                <h3 class="text-xl font-bold text-gray-800 mb-4">Job Information</h3>
                                
                                <div class="space-y-3 text-sm">
                                    <div class="flex items-center text-gray-700">
                                        <i class="fas fa-calendar-alt w-6 text-purple-600"></i>
                                        <div>
                                            <p class="font-semibold">Posted</p>
                                            <p>${new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center text-gray-700">
                                        <i class="fas fa-clock w-6 text-purple-600"></i>
                                        <div>
                                            <p class="font-semibold">Deadline</p>
                                            <p>${new Date(job.applicationDeadline).toLocaleDateString()} (${daysUntilDeadline} days)</p>
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
                                        <i class="fas fa-eye w-6 text-purple-600"></i>
                                        <div>
                                            <p class="font-semibold">Views</p>
                                            <p>${job.views} views</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr class="my-4" />
                                
                                <!-- Company Info -->
                                <h3 class="text-xl font-bold text-gray-800 mb-3">About ${company.name}</h3>
                                <p class="text-gray-700 text-sm mb-3">${company.description}</p>
                                <a href="/companies/${company.id}" data-link class="text-purple-600 hover:text-purple-800 text-sm font-semibold">
                                    View Company Profile <i class="fas fa-arrow-right ml-1"></i>
                                </a>
                                
                                ${company.website ? `
                                    <div class="mt-3">
                                        <a href="${company.website}" target="_blank" class="text-gray-600 hover:text-purple-600 text-sm">
                                            <i class="fas fa-globe mr-1"></i> ${company.website}
                                        </a>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Event listeners
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm && user.role !== 'employer') {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const coverLetter = document.getElementById('coverLetter').value;
            const submitBtn = applicationForm.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
            
            try {
                await mockDataService.createApplication({
                    jobId: job.id,
                    userId: user.id,
                    coverLetter: coverLetter
                });
                
                // Show success and reload
                alert('Application submitted successfully!');
                window.location.reload();
            } catch (error) {
                alert('Failed to submit application. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Application';
            }
        });
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

function renderHeader(user) {
    return `
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Avy
                    </div>
                    <div class="flex items-center space-x-6">
                        <a href="/dashboard" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-home mr-1"></i> Dashboard
                        </a>
                        <a href="/jobs" data-link class="text-purple-600 font-semibold">
                            <i class="fas fa-briefcase mr-1"></i> Jobs
                        </a>
                        <a href="/companies" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-building mr-1"></i> Companies
                        </a>
                        <a href="/profile" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-user mr-1"></i> Profile
                        </a>
                        <div class="flex items-center space-x-3">
                            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full border-2 border-purple-600" />
                            <button id="logoutBtn" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;
}
