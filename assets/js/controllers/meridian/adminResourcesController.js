import authService from '../../services/authService.js';
import resourceService from '../../services/adminContentService/resourceService.js';
import modalService from '../../services/adminContentService/modalService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminResourcesController() {
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    await ResourceManager.initialize(user);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

const ResourceManager = {
    resources: [],
    user: null,
    formState: {
        update: null,
    },

    async initialize(user) {
        ResourceManager.user = user;
        ResourceManager.resources = await resourceService.getResources();
        ResourceManager.render.page();
        ResourceManager.render.cards();
        ResourceManager.render.resourceAnalytics();
        ResourceManager.listeners.atachAll();
    },

    render: {
        page() {
            const app = document.getElementById('app');
            app.innerHTML = `
            ${renderAppHeader(ResourceManager.user, window.location.pathname)}
            <div class="container mx-auto px-4 py-8">
                <div class="fade-in">
                    <div class="relative bg-white shadow-md rounded-2xl mb-6">
                        <div class="max-w-full px-4 py-6 sm:px-6 lg:px-8">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                        <i class="fas fa-newspaper text-purple-600 mr-3"></i>Platform Resource Management
                                    </h1>
                                    <p class="text-gray-600">Manage platform resources for learners and employers.</p>
                                </div>
                                <button id="create-resource-button" class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-md">
                                    <i class="fas fa-plus-circle text-lg"></i>
                                    Post Resource
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="resource-analytics-container" class="grid md:grid-cols-3 gap-6 mb-8"></div>

                    <div class="bg-white shadow-md rounded-2xl p-5">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">All Resources</h2>
                        <div class="flex flex-col gap-3" id="resource-card-container"></div>
                    </div>
                </div>
            </div>
            `;
        },
        cards() {
            const container = document.getElementById('resource-card-container');

            if (!ResourceManager.resources.length) {
                container.innerHTML = `
                    <div class="text-center text-gray-400 py-10">
                        <i class="fas fa-folder-open text-4xl mb-3"></i>
                        <p class="text-sm">No resources found.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = ``;
            ResourceManager.resources.forEach((resource) => {
                const resourceCard = document.createElement('div');
                resourceCard.className = `flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 rounded-xl px-5 py-4 hover:shadow-sm transition-all duration-300`;
                resourceCard.dataset.resourceId = resource.id;

                const type =
                    ResourceManager.uiElements.typePreset(resource.type) ||
                    ResourceManager.uiElements.typePreset('article');
                const status =
                    ResourceManager.uiElements.statusPreset(resource.status) ||
                    ResourceManager.uiElements.statusPreset('active');

                resourceCard.innerHTML = `
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
                    <button ${resource.status === 'archived' ? 'disabled' : ''} class="resource-archive-btn text-sm text-yellow-500 font-semibold px-3 py-1.5 rounded-lg ${resource.status === 'archived' ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100 cursor-pointer'}">
                        <i class="fas fa-${resource.status === 'archived' ? 'box-open' : 'archive'} mr-1"></i>${resource.status === 'archived' ? 'Archived' : 'Archive'}
                    </button>
                    <button class="resource-delete-btn text-sm text-red-400 hover:text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-300">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
                `;

                resourceCard.querySelector('.resource-view-btn').addEventListener('click', () => {
                    ResourceManager.render.detailModal(resource);
                });

                resourceCard.querySelector('.resource-edit-btn').addEventListener('click', () => {
                    ResourceManager.render.formModal(resource);
                });

                resourceCard
                    .querySelector('.resource-archive-btn')
                    .addEventListener('click', async () => {
                        const confirmed = await modalService.confirmationModal(
                            'Archive Resource',
                            'Are you sure you want to archive this resource?',
                            'Archive',
                            'text-yellow-600 bg-yellow-50'
                        );

                        if (confirmed) {
                            await resourceService.updateResourceStatus(
                                resourceCard.dataset.resourceId,
                                'archived'
                            );
                            ResourceManager.render.resourceAnalytics();
                            ResourceManager.render.cards();
                        }
                    });

                resourceCard
                    .querySelector('.resource-delete-btn')
                    .addEventListener('click', async () => {
                        const confirmed = await modalService.confirmationModal(
                            'Delete Resource',
                            'Are you sure you want to delete this resource? This action cannot be undone.',
                            'Delete',
                            'text-red-600 bg-red-50'
                        );

                        if (confirmed) {
                            await resourceService.deleteResource(resourceCard.dataset.resourceId);
                            ResourceManager.render.resourceAnalytics();
                            ResourceManager.render.cards();
                        }
                    });

                container.appendChild(resourceCard);
            });
        },
        detailModal(resource) {
            const modal = modalService.formModal('Resource Details');
            document.body.appendChild(modal);

            const content = modal.querySelector('#modal-content');
            content.className = `flex flex-col gap-6`;

            const renderReosurceTitle = (resource) => {
                return `
                <div class="flex items-center gap-3">
                    <h2 class="text-xl font-semibold text-gray-800">${resource.title}</h2>
                </div>
                `;
            };
            const renderResourceInfo = (resource) => {
                return `
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
                `;
            };
            const renderResoruceBody = (resource) => {
                return `
                <div class="flex flex-col gap-3">
                    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Content Body</h3>
                    <p class="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">${resource.contentBody || 'No content body provided.'}</p>
                </div>
                `;
            };

            content.innerHTML = `
            <div class="flex flex-col gap-3">
                ${renderReosurceTitle(resource)}
                ${renderResourceInfo(resource)}
            </div>
            <hr class="border-gray-100">
                ${renderResoruceBody(resource)}
            `;
        },
        formModal(update) {
            const modal = modalService.formModal(
                update ? 'Update Resource Details' : 'Create a Resource'
            );
            document.body.appendChild(modal);

            const content = modal.querySelector('#modal-content');
            content.className = `flex flex-col gap-6`;

            const renderTitleField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
                    <input type="text" id="resource-title" value="${update?.title ?? ''}" placeholder="Enter resource title" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderDescriptionField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Description</label>
                    <textarea id="resource-description" rows="3" placeholder="Enter resource description" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none">${update?.description ?? ''}</textarea>
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderTypeField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Type <span class="text-red-500">*</span></label>
                    <select id="resource-type" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400">
                        <option value="" disabled ${!update ? 'selected' : ''}>Select resource type</option>
                        <option value="article" ${update?.type === 'article' ? 'selected' : ''}>Article</option>
                        <option value="cv-guide" ${update?.type === 'cv-guide' ? 'selected' : ''}>CV Guide</option>
                        <option value="interview-prep" ${update?.type === 'interview-prep' ? 'selected' : ''}>Interview Prep</option>
                        <option value="portfolio-template" ${update?.type === 'portfolio-template' ? 'selected' : ''}>Portfolio Template</option>
                    </select>
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderContentField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">Content Body</label>
                    <textarea id="resource-content" rows="4" placeholder="Enter the main content of the resource..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none">${update?.contentBody ?? ''}</textarea>
                </div>
                `;
            };
            const renderUrlField = () => {
                return `
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700">External URL</label>
                    <input type="url" id="resource-url" value="${update?.externalUrl ?? ''}" placeholder="https://..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <span class="error-msg hidden text-xs text-red-500 mt-1"></span>
                </div>
                `;
            };
            const renderFormActions = () => {
                return `
                <div class="flex gap-3">
                    <button type="button" id="cancel-modal-button" class="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-lg cursor-pointer">Cancel</button>
                    <button type="submit" class="flex-1 px-4 py-2 text-sm font-medium text-white ${update ? 'bg-purple-500 hover:bg-purple-600' : 'bg-green-500 hover:bg-green-600'} transition-colors duration-200 rounded-lg cursor-pointer">
                        <i class="fas ${update ? 'fa-save' : 'fa-plus-circle'} mr-2"></i>
                        ${update ? 'Update Resource' : 'Post Resource'}
                    </button>
                </div>
                `;
            };

            content.innerHTML = `
            <form id="resource-form" class="flex flex-col gap-4" novalidate>
                ${renderTitleField()}
                ${renderDescriptionField()}
                ${renderTypeField()}
                ${renderContentField()}
                ${renderUrlField()}
                <hr class="border-gray-100">
                ${renderFormActions()}
            </form>
            `;

            document.getElementById('cancel-modal-button').addEventListener('click', () => {
                modalService.closeModal();
            });

            document.getElementById('resource-form').addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!ResourceManager.validation.validateForm()) return;

                const data = {
                    title: document.getElementById('resource-title').value,
                    description: document.getElementById('resource-description').value,
                    type: document.getElementById('resource-type').value,
                    contentBody: document.getElementById('resource-content').value,
                    externalUrl: document.getElementById('resource-url').value,
                };

                if (update) {
                    await resourceService.updateResource(update.id, data);
                } else {
                    await resourceService.createResource(data);
                }

                modalService.closeModal();
                ResourceManager.render.resourceAnalytics();
                ResourceManager.render.cards();
            });
        },
        resourceAnalytics() {
            const container = document.getElementById('resource-analytics-container');

            container.innerHTML = `
            <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 w-full">
                <div class="bg-purple-100 rounded-xl p-3">
                    <i class="fas fa-layer-group text-2xl text-purple-600"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Total Resources</p>
                    <p class="text-2xl font-bold text-gray-800" id="resource-total">${ResourceManager.resources.length}</p>
                </div>
            </div>
            <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 w-full">
                <div class="bg-green-100 rounded-xl p-3">
                    <i class="fas fa-eye text-2xl text-green-600"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Active</p>
                    <p class="text-2xl font-bold text-gray-800" id="resource-active">${ResourceManager.resources.filter((r) => r.status === 'active').map((r) => r.title).length}</p>
                </div>
            </div>
            <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 w-full">
                <div class="bg-yellow-100 rounded-xl p-3">
                    <i class="fas fa-box-archive text-2xl text-yellow-600"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Archived</p>
                    <p class="text-2xl font-bold text-gray-800" id="resource-archived">${ResourceManager.resources.filter((r) => r.status === 'archived').map((r) => r.title).length}</p>
                </div>
            </div>
            `;
        },
    },

    uiElements: {
        typePreset(type) {
            if (type === 'article')
                return {
                    label: 'Article',
                    icon: 'fa-newspaper',
                    color: 'bg-blue-100 text-blue-600',
                };

            if (type === 'cv-guide')
                return {
                    label: 'CV Guide',
                    icon: 'fa-file-alt',
                    color: 'bg-purple-100 text-purple-600',
                };

            if (type === 'interview-prep')
                return {
                    label: 'Interview Prep',
                    icon: 'fa-comments',
                    color: 'bg-green-100 text-green-600',
                };

            if (type === 'portfolio-template')
                return {
                    label: 'Portfolio Template',
                    icon: 'fa-briefcase',
                    color: 'bg-yellow-100 text-yellow-600',
                };
        },

        statusPreset(status) {
            if (status === 'active')
                return { label: 'Active', color: 'bg-green-100 text-green-600' };

            if (status === 'archived')
                return { label: 'Archived', color: 'bg-gray-100 text-gray-500' };
        },
    },

    validation: {
        validateForm() {
            let valid = true;

            const title = document.getElementById('resource-title');
            const type = document.getElementById('resource-type');
            const url = document.getElementById('resource-url');

            if (!title.value.trim()) {
                ResourceManager.validation.showError(title, 'Title is required.');
                valid = false;
            } else {
                ResourceManager.validation.clearError(title);
            }

            if (!type.value) {
                ResourceManager.validation.showError(type, 'Please select a resource type.');
                valid = false;
            } else {
                ResourceManager.validation.clearError(type);
            }

            if (url.value && !url.value.startsWith('http')) {
                ResourceManager.validation.showError(
                    url,
                    'Please enter a valid URL starting with http:// or https://'
                );
                valid = false;
            } else {
                ResourceManager.validation.clearError(url);
            }

            return valid;
        },
        showError(input, message) {
            const errorSpan = input.closest('.flex-col').querySelector('.error-msg');
            if (!errorSpan) return;
            errorSpan.textContent = message;
            errorSpan.classList.remove('hidden');
            input.classList.add('border-red-400');
            input.classList.remove('border-gray-200');
        },
        clearError(input) {
            const errorSpan = input.closest('.flex-col').querySelector('.error-msg');
            if (!errorSpan) return;
            errorSpan.textContent = '';
            errorSpan.classList.add('hidden');
            input.classList.remove('border-red-400');
            input.classList.add('border-gray-200');
        },
    },

    listeners: {
        atachAll() {
            document.getElementById('create-resource-button').addEventListener('click', () => {
                ResourceManager.render.formModal(null);
            });
        },
    },
};
