/**
 * Company Profile Controller (Employer)
 * Manage and update company information
 */
import authService from '../../services/authService.js';
import languageService from '../../services/languageService.js';
import mockDataService from '../../services/mockDataService.js';
import apiService from '../../services/apiService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function companyProfileController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    const t = (key) => languageService.translate(key);

    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }

    // Fetch company data
    const company = await apiService.get(`/companies/${user.companyId}`);
    if (!company) {
        app.innerHTML = '<p>Company not found</p>';
        return;
    }

    // Fetch company's job postings
    const jobs = await mockDataService.getAllJobs({ companyId: company.id });

    // Render the view
    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}

        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-building text-purple-600 mr-3"></i>
                            Company Profile
                        </h1>
                        <p class="text-gray-600">Welcome, ${user.name}! Manage your company profile and job postings</p>
                    </div>

                    <div class="grid gap-8">
                        <!-- Company Info Section -->
                        <div class="card">
                            <div class="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                                <div class="flex flex-col items-center">
                                    <img id="companyLogo" src="${company.logo}" alt="${company.name}" class="w-32 h-32 rounded-lg object-cover border-4 border-purple-200 mb-3">
                                    <input type="file" id="logoInput" accept="image/*" style="display:none;">
                                    <button type="button" class="btn btn-xs btn-secondary px-2 py-1 text-xs" id="changeLogo" title="Change logo">
                                        <i class="fas fa-camera mr-1"></i>Change Logo
                                    </button>
                                </div>
                                <div class="flex-1">
                                    <h2 class="text-3xl font-bold text-gray-800 mb-2">${company.name}</h2>
                                    <div class="space-y-2 text-gray-700">
                                        <p><strong>Industry:</strong> <span class="text-purple-600">${company.industry || 'N/A'}</span></p>
                                        <p><strong>Company Size:</strong> ${company.size || 'N/A'}</p>
                                        <p><strong>Contact Email:</strong> <a href="mailto:${company.contactEmail}" class="text-purple-600 hover:underline">${company.contactEmail || 'N/A'}</a></p>
                                        <p><strong>Contact Person:</strong> ${company.contactPerson || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <form id="companyEditForm" class="space-y-6">
                                <div>
                                    <label for="description" class="form-label">Company Description</label>
                                    <textarea id="description" name="description" rows="5" class="form-input">${company.description || ''}</textarea>
                                </div>

                                <div>
                                    <label for="website" class="form-label">Website</label>
                                    <input type="url" id="website" name="website" class="form-input" value="${company.website || ''}" placeholder="https://example.com">
                                </div>

                                <button type="submit" class="btn btn-primary w-full">
                                    <i class="fas fa-save mr-2"></i>${t('modals.save')}
                                </button>
                            </form>
                        </div>

                        <!-- Job Postings Section -->
                        <div>
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold text-gray-800">
                                    <i class="fas fa-briefcase text-purple-600 mr-2"></i>
                                    Your Job Postings <span class="text-purple-600">(${jobs.length})</span>
                                </h2>
                                <button type="button" class="btn btn-primary" id="newJobBtn">
                                    <i class="fas fa-plus-circle mr-2"></i>New Job Posting
                                </button>
                            </div>

                            ${
                                jobs.length > 0
                                    ? `
                                <div class="space-y-4">
                                    ${jobs
                                        .map(
                                            (job) => `
                                        <div class="card hover:shadow-xl transition duration-300">
                                            <div class="flex justify-between items-start mb-4">
                                                <div class="flex-1">
                                                    <h3 class="text-xl font-bold text-gray-800 mb-1">${job.title}</h3>
                                                    <p class="text-gray-600 mb-3">
                                                        <i class="fas fa-map-marker-alt text-purple-600 mr-2"></i>
                                                        ${job.location || 'Remote'}
                                                    </p>
                                                    <div class="flex gap-2 mb-3">
                                                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">${job.employmentType}</span>
                                                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">${job.workMode}</span>
                                                        <span class="px-3 py-1 ${job.status === 'active' ? 'bg-emerald-100 text-emerald-800' : job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} rounded-full text-sm font-semibold">${job.status}</span>
                                                    </div>
                                                    <p class="text-gray-700 mb-4">${job.description.substring(0, 150)}...</p>
                                                </div>
                                            </div>
                                            <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <div class="flex gap-4 text-sm text-gray-600">
                                                    <span><i class="fas fa-eye text-purple-600 mr-1"></i>${job.views} views</span>
                                                    <span><i class="fas fa-file-alt text-purple-600 mr-1"></i>${job.applications} applications</span>
                                                </div>
                                                <div class="flex gap-2">
                                                    <button type="button" class="btn btn-secondary btn-sm" data-job-id="${job.id}">
                                                        <i class="fas fa-edit mr-1"></i>${t('modals.edit')}
                                                    </button>
                                                    <button type="button" class="btn btn-danger btn-sm" data-job-id="${job.id}">
                                                        <i class="fas fa-trash mr-1"></i>${t('modals.deleteConfirm')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `
                                        )
                                        .join('')}
                                </div>
                            `
                                    : `
                                <div class="card text-center py-12">
                                    <i class="fas fa-briefcase text-gray-300 text-6xl mb-4"></i>
                                    <p class="text-gray-500 text-lg mb-2">${t('dashboard.noJobPostings')}</p>
                                    <p class="text-gray-400 mb-6">Create your first job posting to start hiring talent!</p>
                                    <button type="button" class="btn btn-primary" id="newJobBtnEmpty">
                                        <i class="fas fa-plus-circle mr-2"></i>Create First Job Post
                                    </button>
                                </div>
                            `
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Handle logo change
    const logoInput = document.getElementById('logoInput');
    const changeLogo = document.getElementById('changeLogo');
    const companyLogo = document.getElementById('companyLogo');

    if (changeLogo) {
        changeLogo.addEventListener('click', () => {
            logoInput.click();
        });

        logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    companyLogo.src = event.target.result;
                    // In a real app, upload to server here
                    console.log('Logo changed:', file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle form submission
    const form = document.getElementById('companyEditForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedCompany = {
                ...company,
                description: document.getElementById('description').value,
                website: document.getElementById('website').value,
            };

            try {
                const saved = await apiService.put(`/companies/${company.id}`, updatedCompany);

                console.log('Saved company:', saved);
                alert('Company profile updated successfully!');
            } catch (error) {
                console.error('Error saving company profile:', error);
                alert('Error saving company profile');
            }
        });
    }

    // Handle new job button
    const newJobBtn = document.getElementById('newJobBtn');
    const newJobBtnEmpty = document.getElementById('newJobBtnEmpty');

    if (newJobBtn) {
        newJobBtn.addEventListener('click', () => {
            window.router.navigate('/employer/post-job');
        });
    }

    if (newJobBtnEmpty) {
        newJobBtnEmpty.addEventListener('click', () => {
            window.router.navigate('/employer/post-job');
        });
    }

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}
