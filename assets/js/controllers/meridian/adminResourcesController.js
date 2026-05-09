import authService from '../../services/authService.js';
import resourceService from '../../services/adminContentService/resourceService.js';
import { renderAppHeader } from '../../views/appHeader.js';
import modalService from '../../services/adminContentService/modalService.js';
import mockDataService from '../../services/mockDataService.js';

export default async function adminResourcesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    const analytics = await mockDataService.getAnalytics();

    if (!user || user.role !== 'admin') {
        window.location.navigate('/dashboard');
        return;
    }

    document.innerHTML = `<div class="spinner"></div>`;
    setTimeout(300);
    document.innerHTML = ``;

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="container mx-auto px-4 py-8">
            <div class="fade-in">

                <div class="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div>
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-newspaper text-purple-600 mr-3"></i>
                            Platform Resource Management
                        </h1>
                        <p class="text-gray-600">Meridian-Resource Management</p>
                    </div>

                    <button id="create-resource-button" class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-md">
                        <i class="fas fa-plus-circle text-lg"></i>
                        Post Resource
                    </button>
                </div>

                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 w-full">
                        <div class="bg-purple-100 rounded-xl p-3">
                            <i class="fas fa-layer-group text-2xl text-purple-600"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Total Resources</p>
                            <p class="text-2xl font-bold text-gray-800" id="resource-total">—</p>
                        </div>
                    </div>
                    <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 w-full">
                        <div class="bg-green-100 rounded-xl p-3">
                            <i class="fas fa-eye text-2xl text-green-600"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Active</p>
                            <p class="text-2xl font-bold text-gray-800" id="resource-active">—</p>
                        </div>
                    </div>
                    <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 w-full">
                        <div class="bg-yellow-100 rounded-xl p-3">
                            <i class="fas fa-box-archive text-2xl text-yellow-600"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Archived</p>
                            <p class="text-2xl font-bold text-gray-800" id="resource-archived">—</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white shadow-md rounded-2xl p-5">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">All Resources</h2>
                    <div class="flex flex-col gap-3" id="resource-card-container"></div>
                </div>
            </div>
        </div>
    `;

    const controller = new AdminResourcesController();
    await controller.initializePage();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

class AdminResourcesController {
    constructor() {
        this.resourceService = resourceService;
        this.modalService = modalService;
    }

    async initializePage() {
        document.getElementById('create-resource-button').addEventListener('click', () => {
            this.displayForm();
        });
        this.displayResourceCards();
    }

    async displayResourceCards() {
        const container = document.getElementById('resource-card-container');
        try {
            const resources = await this.resourceService.getResources();

            document.getElementById('resource-total').textContent = resources.length;
            document.getElementById('resource-active').textContent = resources.filter(
                (resource) => resource.status === 'active'
            ).length;
            document.getElementById('resource-archived').textContent = resources.filter(
                (resource) => resource.status === 'archived'
            ).length;

            if (!resources.length) {
                container.innerHTML = `
                    <div class="text-center text-gray-400 py-10">
                        <i class="fas fa-folder-open text-4xl mb-3"></i>
                        <p class="text-sm">No resources found.</p>
                    </div>
                `;
                return;
            }
            container.innerHTML = '';
            resources.forEach((resource) =>
                container.appendChild(this.buildResourceCard(resource))
            );
        } catch (error) {
            console.error('Failed to load resources:', error);
            container.innerHTML = `<p class="text-red-500 text-sm">Failed to load resources.</p>`;
        }
    }

    buildResourceCard(resource) {
        const card = document.createElement('div');
        card.classList.add(
            'flex',
            'flex-col', // stack vertically on mobile
            'md:flex-row', // side by side on md+
            'md:items-center',
            'md:justify-between',
            'gap-4',
            'bg-gray-50',
            'rounded-xl',
            'px-5',
            'py-4',
            'hover:shadow-sm',
            'transition-all',
            'duration-300'
        );
        card.dataset.resourceId = resource.id;

        const typeConfig = {
            article: { label: 'Article', icon: 'fa-newspaper', color: 'bg-blue-100 text-blue-600' },
            'cv-guide': {
                label: 'CV Guide',
                icon: 'fa-file-alt',
                color: 'bg-purple-100 text-purple-600',
            },
            'interview-prep': {
                label: 'Interview Prep',
                icon: 'fa-comments',
                color: 'bg-green-100 text-green-600',
            },
            'portfolio-template': {
                label: 'Portfolio Template',
                icon: 'fa-briefcase',
                color: 'bg-yellow-100 text-yellow-600',
            },
        };

        const statusConfig = {
            active: { label: 'Active', color: 'bg-green-100 text-green-600' },
            archived: { label: 'Archived', color: 'bg-gray-100 text-gray-500' },
        };

        const type = typeConfig[resource.type] || typeConfig['article'];
        const status = statusConfig[resource.status] || statusConfig['active'];

        card.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="bg-purple-100 rounded-xl p-3 shrink-0">
                    <i class="fas ${type.icon} text-purple-600 text-xl"></i>
                </div>
                <div class="flex flex-col gap-1 min-w-0">
                    <p class="font-semibold text-gray-800">${resource.title}</p>
                    <p class="text-xs text-gray-400 line-clamp-1">${resource.description}</p>
                    <div class="flex flex-wrap items-center gap-2 mt-0.5">
                        <span class="text-xs font-semibold rounded-full px-2 py-0.5 ${status.color}">${status.label}</span>
                        <span class="text-xs font-semibold rounded-full px-2 py-0.5 ${type.color}"><i class="fas fa-tag mr-1"></i>${type.label}</span>
                        <span class="text-xs text-gray-400"><i class="fas fa-eye mr-1"></i>${resource.viewCount} views</span>
                        ${resource.externalUrl ? `<span class="text-xs text-gray-400"><i class="fas fa-link mr-1"></i>Has external link</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-1 shrink-0 flex-wrap">
                <button class="resource-view-btn text-sm text-gray-500 hover:text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all duration-300">
                    <i class="fas fa-info-circle mr-1"></i>More
                </button>
                <button class="resource-edit-btn text-sm text-blue-500 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-300">
                    <i class="fas fa-edit mr-1"></i>Edit
                </button>
                <button class="resource-archive-btn text-sm text-yellow-500 hover:text-yellow-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-50 transition-all duration-300">
                    <i class="fas fa-${resource.status === 'archived' ? 'box-open' : 'archive'} mr-1"></i>${resource.status === 'archived' ? 'Unarchive' : 'Archive'}
                </button>
                <button class="resource-delete-btn text-sm text-red-400 hover:text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-300">
                    <i class="fas fa-trash mr-1"></i>Delete
                </button>
            </div>
        `;

        card.querySelector('.resource-view-btn').addEventListener('click', () => {
            this.displayResourceOverview(resource);
        });

        card.querySelector('.resource-edit-btn').addEventListener('click', () => {
            this.displayForm(resource);
        });

        card.querySelector('.resource-archive-btn').addEventListener('click', async () => {
            const newStatus = resource.status === 'archived' ? 'active' : 'archived';
            await resourceService.updateResourceStatus(resource.id, newStatus);
            await this.displayResourceCards();
        });

        card.querySelector('.resource-delete-btn').addEventListener('click', async () => {
            await resourceService.deleteResource(resource.id);
            await this.displayResourceCards();
        });

        return card;
    }

    displayResourceOverview(resource) {
        const content = document.createElement('div');
        content.classList.add('flex', 'flex-col', 'gap-6');

        content.innerHTML = `
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <h2 class="text-xl font-semibold text-gray-800">${resource.title}</h2>
                    <button id="copy-id-button" class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
                        <i class="fas fa-fingerprint"></i>
                        <span id="copy-id-label">${resource.id}</span>
                    </button>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">${resource.description}</p>

                <div class="flex items-center gap-2 text-sm text-gray-700">
                    <i class="fas fa-eye text-purple-500 w-4"></i>
                    <span>${resource.viewCount} views</span>
                </div>

                ${
                    resource.externalUrl
                        ? `<div class="flex items-center gap-2 text-sm text-gray-700">
                    <i class="fas fa-link text-purple-500 w-4"></i>
                    <a href="${resource.externalUrl}" target="_blank" class="text-purple-500 hover:underline">${resource.externalUrl}</a>
                </div>`
                        : ''
                }
            </div>

            <hr class="border-gray-100">

            <div class="flex flex-col gap-3">
                <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Content Body</h3>
                <p class="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">${resource.contentBody || 'No content body provided.'}</p>
            </div>
        `;

        content.querySelector('#copy-id-button').addEventListener('click', async () => {
            await navigator.clipboard.writeText(resource.id);
            const label = content.querySelector('#copy-id-label');
            label.textContent = 'Copied!';
            setTimeout(() => (label.textContent = resource.id), 1000);
        });

        const modal = modalService.renderModal('Resource Details');
        document.body.appendChild(modal);
        document.getElementById('modal-content').appendChild(content);
    }

    displayForm(updateForm = null) {
        const content = document.createElement('div');
        content.classList.add('flex', 'flex-col', 'gap-6');

        content.innerHTML = `
            <form id="resource-form" class="flex flex-col gap-4" novalidate>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
                    <input type="text" id="resource-title" value="${updateForm?.title ?? ''}" placeholder="Enter resource title" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Description</label>
                    <textarea id="resource-description" rows="3" placeholder="Enter resource description" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none">${updateForm?.description ?? ''}</textarea>
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Type <span class="text-red-500">*</span></label>
                    <select id="resource-type" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400">
                        <option value="" disabled ${!updateForm ? 'selected' : ''}>Select resource type</option>
                        <option value="article" ${updateForm?.type === 'article' ? 'selected' : ''}>Article</option>
                        <option value="cv-guide" updateForm?.type === 'cv-guide' ? 'selected' : ''}>CV Guide</option>
                        <option value="interview-prep" ${updateForm?.type === 'interview-prep' ? 'selected' : ''}>Interview Prep</option>
                        <option value="portfolio-template" ${updateForm?.type === 'portfolio-template' ? 'selected' : ''}>Portfolio Template</option>
                    </select>
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Content Body</label>
                    <textarea id="resource-content" rows="4" placeholder="Enter the main content of the resource..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none">${updateForm?.contentBody ?? ''}</textarea>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">External URL</label>
                    <input type="url" id="resource-url" value="${updateForm?.externalUrl ?? ''}" placeholder="https://..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>

                <hr class="border-gray-100">

                <div class="flex gap-3">
                    <button type="button" id="cancel-modal-button" class="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-lg cursor-pointer">Cancel</button>
                    <button type="submit" class="flex-1 px-4 py-2 text-sm font-medium text-white ${updateForm ? 'bg-purple-500 hover:bg-purple-600' : 'bg-green-500 hover:bg-green-600'} transition-colors duration-200 rounded-lg cursor-pointer">
                        <i class="fas ${updateForm ? 'fa-save' : 'fa-plus-circle'} mr-2"></i>
                        ${updateForm ? 'Update Resource' : 'Post Resource'}
                    </button>
                </div>

            </form>
        `;

        const modal = modalService.renderModal(updateForm ? 'Update Resource' : 'Post Resource');
        document.body.appendChild(modal);
        document.getElementById('modal-content').appendChild(content);

        const showError = (input, message) => {
            const errorSpan = input.closest('.flex-col').querySelector('.error-msg');
            if (!errorSpan) return;
            errorSpan.textContent = message;
            errorSpan.classList.remove('hidden');
            input.classList.add('border-red-400');
            input.classList.remove('border-gray-200');
        };

        const clearError = (input) => {
            const errorSpan = input.closest('.flex-col').querySelector('.error-msg');
            if (!errorSpan) return;
            errorSpan.textContent = '';
            errorSpan.classList.add('hidden');
            input.classList.remove('border-red-400');
            input.classList.add('border-gray-200');
        };

        const validateForm = () => {
            let valid = true;

            const title = document.getElementById('resource-title');
            const type = document.getElementById('resource-type');
            const url = document.getElementById('resource-url');

            if (!title.value.trim()) {
                showError(title, 'Title is required.');
                valid = false;
            } else {
                clearError(title);
            }

            if (!type.value) {
                showError(type, 'Please select a resource type.');
                valid = false;
            } else {
                clearError(type);
            }

            if (url.value && !url.value.startsWith('http')) {
                showError(url, 'Please enter a valid URL starting with http:// or https://');
                valid = false;
            } else {
                clearError(url);
            }

            return valid;
        };

        document.getElementById('cancel-modal-button').addEventListener('click', () => {
            modalService.closeModal();
        });

        document.getElementById('resource-form').onsubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            const data = {
                title: document.getElementById('resource-title').value,
                description: document.getElementById('resource-description').value,
                type: document.getElementById('resource-type').value,
                contentBody: document.getElementById('resource-content').value,
                externalUrl: document.getElementById('resource-url').value,
            };

            if (updateForm) {
                await resourceService.updateResource(updateForm.id, data);
            } else {
                await resourceService.createResource(data);
            }

            modalService.closeModal();
            await this.displayResourceCards();
        };
    }
}
