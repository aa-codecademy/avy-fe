import authService from '../../services/authService.js';
import resourceService from '../../services/adminContentService/resourceService.js';
import modalService from '../../services/adminContentService/modalService.js';
import { renderAppHeader } from '../../views/appHeader.js';

const RESOURCE_PROGRAMMES = [
    { value: 'full-stack-web-developement', label: 'Full Stack Web Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'quality-assurance', label: 'Quality Assurance' },
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'qa', label: 'QA Engineering' },
    { value: 'software-engineering', label: 'Software Engineering' },
    { value: 'graphic-design', label: 'Graphic Design' },
];

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
            <div class="bg-gray-50 min-h-screen py-8">
                <div class="container mx-auto px-4">
                    <div class="fade-in">
                    <div class="relative bg-white shadow-md rounded-2xl mb-6">
                        <div class="max-w-full px-4 py-6 sm:px-6 lg:px-8">
                            <div class="flex flex-col gap-4">
                                <div>
                                    <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                        <i class="fas fa-newspaper text-purple-600 mr-3"></i>Platform Resource Management
                                    </h1>
                                    <p class="text-gray-600">Manage platform resources for learners and employers.</p>
                                </div>
                                <button id="create-resource-button" class="inline-flex w-full items-center justify-center gap-2 self-start bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-md sm:w-auto">
                                    <i class="fas fa-plus-circle text-lg"></i>
                                    Post Resource
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="resource-analytics-container" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8"></div>

                    <div id="resource-usage-analytics" class="bg-white shadow-md rounded-2xl p-5 mb-8"></div>

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
                            <span class="text-xs font-semibold rounded-full px-2 py-0.5 bg-slate-100 text-slate-700">
                                <i class="fas fa-users mr-1"></i>${formatResourceAudience(resource)}
                            </span>
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

                <div class="flex items-start gap-2 text-sm text-gray-700">
                    <i class="fas fa-users text-purple-500 w-4 mt-0.5"></i>
                    <span>${formatResourceAudience(resource)}</span>
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
            const renderAudienceField = () => {
                const selectedPrograms = update?.programs || [];
                const isGlobal = update ? update.isGlobal !== false : true;

                return `
                <div class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700">Audience</label>
                        <p class="text-xs text-gray-500 mt-1">Choose whether this resource is visible to all students or specific academy programmes.</p>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2">
                        <label class="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer transition hover:border-purple-300">
                            <input type="radio" name="resource-audience" value="global" class="mt-1 h-4 w-4 text-purple-600 border-gray-300" ${isGlobal ? 'checked' : ''} />
                            <div>
                                <p class="text-sm font-semibold text-gray-800">All Students</p>
                                <p class="text-xs text-gray-500 mt-1">Visible to every learner regardless of programme.</p>
                            </div>
                        </label>
                        <label class="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer transition hover:border-purple-300">
                            <input type="radio" name="resource-audience" value="programmes" class="mt-1 h-4 w-4 text-purple-600 border-gray-300" ${!isGlobal ? 'checked' : ''} />
                            <div>
                                <p class="text-sm font-semibold text-gray-800">Specific Programmes</p>
                                <p class="text-xs text-gray-500 mt-1">Only show this resource to selected academy tracks.</p>
                            </div>
                        </label>
                    </div>

                    <div id="resource-programmes-panel" class="${isGlobal ? 'hidden ' : ''}grid gap-2 sm:grid-cols-2">
                        ${RESOURCE_PROGRAMMES.map(
                            (programme) => `
                            <label class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 cursor-pointer transition hover:border-purple-300">
                                <input type="checkbox" name="resource-programme" value="${programme.value}" class="h-4 w-4 rounded border-gray-300 text-purple-600" ${selectedPrograms.includes(programme.value) ? 'checked' : ''} />
                                <span class="text-sm text-gray-700">${programme.label}</span>
                            </label>
                        `
                        ).join('')}
                    </div>

                    <p id="resource-programmes-error" class="hidden text-xs text-red-500"></p>
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
                ${renderAudienceField()}
                <hr class="border-gray-100">
                ${renderFormActions()}
            </form>
            `;

            document.getElementById('cancel-modal-button').addEventListener('click', () => {
                modalService.closeModal();
            });

            setupAudienceSelection();

            document.getElementById('resource-form').addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!ResourceManager.validation.validateForm()) return;

                const isGlobal =
                    document.querySelector('input[name="resource-audience"]:checked')?.value !==
                    'programmes';
                const programs = isGlobal ? [] : getSelectedResourceProgrammes();

                const data = {
                    title: document.getElementById('resource-title').value,
                    description: document.getElementById('resource-description').value,
                    type: document.getElementById('resource-type').value,
                    contentBody: document.getElementById('resource-content').value,
                    externalUrl: document.getElementById('resource-url').value,
                    isGlobal,
                    programs,
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
            const usageContainer = document.getElementById('resource-usage-analytics');
            const usageAnalytics = getResourceUsageAnalytics(ResourceManager.resources);

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
                    <p class="text-sm text-gray-500">Total Views</p>
                    <p class="text-2xl font-bold text-gray-800" id="resource-total-views">${usageAnalytics.totalViews}</p>
                </div>
            </div>
            <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 w-full">
                <div class="bg-blue-100 rounded-xl p-3">
                    <i class="fas fa-users text-2xl text-blue-600"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Unique Learners</p>
                    <p class="text-2xl font-bold text-gray-800" id="resource-unique-learners">${usageAnalytics.totalUniqueStudents}</p>
                </div>
            </div>
            <div class="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 w-full">
                <div class="bg-yellow-100 rounded-xl p-3">
                    <i class="fas fa-box-archive text-2xl text-yellow-600"></i>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Active Resources</p>
                    <p class="text-2xl font-bold text-gray-800" id="resource-active">${ResourceManager.resources.filter((r) => r.status === 'active').length}</p>
                </div>
            </div>
            `;

            usageContainer.innerHTML = `
                <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">Resource Usage Analytics</h2>
                        <p class="text-sm text-gray-500">Track views, estimated unique learners, and programme engagement for each resource.</p>
                    </div>
                    <span class="inline-flex w-fit rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700">${usageAnalytics.rows.length} tracked resources</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full data-table-min text-left">
                        <thead>
                            <tr class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                <th class="py-3 pr-4 font-semibold">Resource</th>
                                <th class="px-4 py-3 font-semibold">Views</th>
                                <th class="px-4 py-3 font-semibold">Unique Students</th>
                                <th class="py-3 pl-4 font-semibold">Programme Breakdown</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${usageAnalytics.rows
                                .map(
                                    (resource) => `
                                <tr class="align-top text-sm text-gray-700">
                                    <td class="py-4 pr-4">
                                        <p class="font-semibold text-gray-900">${resource.title}</p>
                                        <p class="mt-1 text-xs text-gray-500">${resource.typeLabel}</p>
                                    </td>
                                    <td class="px-4 py-4 font-semibold text-gray-900">${resource.viewCount}</td>
                                    <td class="px-4 py-4 font-semibold text-blue-700">${resource.uniqueStudentCount}</td>
                                    <td class="py-4 pl-4">
                                        <div class="flex flex-wrap gap-2">
                                            ${resource.programmeBreakdown
                                                .map(
                                                    (programme) => `
                                                <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">${programme.label}: ${programme.count}</span>
                                            `
                                                )
                                                .join('')}
                                        </div>
                                    </td>
                                </tr>
                            `
                                )
                                .join('')}
                        </tbody>
                    </table>
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
            const selectedAudience = document.querySelector(
                'input[name="resource-audience"]:checked'
            );
            const programmesError = document.getElementById('resource-programmes-error');

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

            if (selectedAudience?.value === 'programmes') {
                const programmes = getSelectedResourceProgrammes();
                if (!programmes.length) {
                    programmesError.textContent =
                        'Select at least one programme for a targeted resource.';
                    programmesError.classList.remove('hidden');
                    valid = false;
                } else {
                    programmesError.textContent = '';
                    programmesError.classList.add('hidden');
                }
            } else if (programmesError) {
                programmesError.textContent = '';
                programmesError.classList.add('hidden');
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

function setupAudienceSelection() {
    const audienceRadios = document.querySelectorAll('input[name="resource-audience"]');
    const programmesPanel = document.getElementById('resource-programmes-panel');
    const programmesError = document.getElementById('resource-programmes-error');

    const updateVisibility = () => {
        const showProgrammes =
            document.querySelector('input[name="resource-audience"]:checked')?.value ===
            'programmes';

        programmesPanel.classList.toggle('hidden', !showProgrammes);
        if (!showProgrammes) {
            programmesError.textContent = '';
            programmesError.classList.add('hidden');
        }
    };

    audienceRadios.forEach((radio) => {
        radio.addEventListener('change', updateVisibility);
    });

    updateVisibility();
}

function getSelectedResourceProgrammes() {
    return Array.from(document.querySelectorAll('input[name="resource-programme"]:checked')).map(
        (input) => input.value
    );
}

function getResourceUsageAnalytics(resources) {
    const rows = resources.map((resource) => {
        const uniqueStudentCount = Math.max(
            1,
            Math.min(resource.viewCount, Math.round(resource.viewCount * 0.62))
        );
        const programmeBreakdown = buildProgrammeBreakdown(resource, uniqueStudentCount);

        return {
            title: resource.title,
            viewCount: resource.viewCount,
            uniqueStudentCount,
            typeLabel: ResourceManager.uiElements.typePreset(resource.type)?.label || 'Resource',
            programmeBreakdown,
        };
    });

    return {
        totalViews: rows.reduce((sum, row) => sum + row.viewCount, 0),
        totalUniqueStudents: rows.reduce((sum, row) => sum + row.uniqueStudentCount, 0),
        rows,
    };
}

function buildProgrammeBreakdown(resource, totalUniqueStudents) {
    const defaultProgrammes =
        resource.isGlobal || !resource.programs?.length
            ? ['full-stack-web-developement', 'data-science', 'quality-assurance']
            : resource.programs;
    const labels = defaultProgrammes.map(formatProgrammeLabel);
    const weights = labels.map((_, index) => labels.length - index);
    const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
    let allocated = 0;

    return labels.map((label, index) => {
        const remaining = totalUniqueStudents - allocated;
        const isLast = index === labels.length - 1;
        const count = isLast
            ? remaining
            : Math.max(1, Math.round((totalUniqueStudents * weights[index]) / weightTotal));

        allocated += count;

        return {
            label,
            count: isLast ? Math.max(1, remaining) : count,
        };
    });
}

function formatProgrammeLabel(programme) {
    const presetLabels = {
        'full-stack-web-developement': 'Full Stack',
        'data-science': 'Data Science',
        'quality-assurance': 'Quality Assurance',
        frontend: 'Frontend Development',
        backend: 'Backend Development',
        qa: 'QA Engineering',
        'software-engineering': 'Software Engineering',
        'graphic-design': 'Graphic Design',
    };

    if (presetLabels[programme]) {
        return presetLabels[programme];
    }

    return String(programme || 'General')
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatResourceAudience(resource) {
    if (resource.isGlobal || !resource.programs?.length) {
        return 'All Students';
    }

    return resource.programs.map(formatProgrammeLabel).join(', ');
}
