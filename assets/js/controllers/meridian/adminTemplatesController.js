/**
 * Admin Templates Controller
 * Manage in-app and email templates.
 */
import mockDataService from '../../services/mockDataService.js';
import {
    bindAdminLogout,
    escapeAttribute,
    escapeHtml,
    formatTimestamp,
    renderAdminSettingsLayout,
    renderSettingsActionLink,
    requireAdminUser,
} from './adminSettingsShared.js';

export default async function adminTemplatesController() {
    const app = document.getElementById('app');
    const user = requireAdminUser();

    if (!user) {
        return;
    }

    const state = {
        modal: null,
        notificationTemplates: [],
        emailTemplates: [],
    };

    await loadData();
    render();

    async function loadData() {
        const [notificationTemplates, emailTemplates] = await Promise.all([
            mockDataService.getNotificationTemplates(),
            mockDataService.getEmailTemplates(),
        ]);

        state.notificationTemplates = notificationTemplates;
        state.emailTemplates = emailTemplates;
    }

    function render() {
        app.innerHTML = renderAdminSettingsLayout({
            user,
            currentPath: window.location.pathname,
            title: 'Template Library',
            description:
                'Maintain system-generated in-app notifications and outbound email templates in one place.',
            headerActions: renderSettingsActionLink(
                '/admin/settings',
                'Settings Overview',
                'fa-arrow-left'
            ),
            summaryCards: [
                {
                    label: 'Notification Templates',
                    value: state.notificationTemplates.length,
                    valueClass: 'text-orange-500',
                },
                {
                    label: 'Email Templates',
                    value: state.emailTemplates.length,
                    valueClass: 'text-indigo-600',
                },
            ],
            content: `
                <div class="grid xl:grid-cols-2 gap-8">
                    <div class="card">
                        <div class="mb-4">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-bell text-orange-500 mr-2"></i>
                                In-App Notification Templates
                            </h2>
                            <p class="text-gray-500 text-sm">Edit system-generated notification copy for key user events.</p>
                        </div>
                        <div class="space-y-4">
                            ${renderNotificationTemplateCards(state.notificationTemplates)}
                        </div>
                    </div>

                    <div class="card">
                        <div class="mb-4">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-envelope text-indigo-500 mr-2"></i>
                                Email Templates
                            </h2>
                            <p class="text-gray-500 text-sm">Maintain outbound email subjects, preview text, and body content.</p>
                        </div>
                        <div class="space-y-4">
                            ${renderEmailTemplateCards(state.emailTemplates)}
                        </div>
                    </div>
                </div>
                ${renderTemplateModal(state)}
            `,
        });

        bindEvents();
    }

    function bindEvents() {
        bindAdminLogout();

        document.querySelectorAll('[data-template-action="notification"]').forEach((button) => {
            button.addEventListener('click', (event) => {
                state.modal = {
                    type: 'notification',
                    id: event.currentTarget.getAttribute('data-template-id'),
                };
                render();
            });
        });

        document.querySelectorAll('[data-template-action="email"]').forEach((button) => {
            button.addEventListener('click', (event) => {
                state.modal = {
                    type: 'email',
                    id: event.currentTarget.getAttribute('data-template-id'),
                };
                render();
            });
        });

        document.querySelectorAll('[data-close-template-modal]').forEach((button) => {
            button.addEventListener('click', () => {
                state.modal = null;
                render();
            });
        });

        const templateForm = document.getElementById('templateEditForm');
        if (templateForm) {
            templateForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                if (!state.modal) {
                    return;
                }

                const formData = new FormData(event.currentTarget);

                if (state.modal.type === 'notification') {
                    await mockDataService.updateNotificationTemplate(state.modal.id, {
                        name: String(formData.get('name') || '').trim(),
                        audience: String(formData.get('audience') || '').trim(),
                        trigger: String(formData.get('trigger') || '').trim(),
                        title: String(formData.get('title') || '').trim(),
                        body: String(formData.get('body') || '').trim(),
                    });
                } else {
                    await mockDataService.updateEmailTemplate(state.modal.id, {
                        name: String(formData.get('name') || '').trim(),
                        audience: String(formData.get('audience') || '').trim(),
                        subject: String(formData.get('subject') || '').trim(),
                        previewText: String(formData.get('previewText') || '').trim(),
                        body: String(formData.get('body') || '').trim(),
                    });
                }

                state.modal = null;
                await loadData();
                render();
            });
        }
    }
}

function renderNotificationTemplateCards(templates) {
    return templates
        .map(
            (template) => `
                <div class="border border-gray-200 rounded-xl p-4">
                    <div class="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800">${template.name}</h3>
                            <p class="text-sm text-gray-500">${template.audience} · ${template.trigger}</p>
                        </div>
                        <button type="button" data-template-action="notification" data-template-id="${template.id}" class="text-purple-600 hover:text-purple-800 font-semibold">Edit</button>
                    </div>
                    <p class="font-semibold text-gray-700 mb-1">${template.title}</p>
                    <p class="text-sm text-gray-600 mb-3">${template.body}</p>
                    <p class="text-xs text-gray-400">Updated ${formatTimestamp(template.updatedAt)} by ${template.updatedBy}</p>
                </div>
            `
        )
        .join('');
}

function renderEmailTemplateCards(templates) {
    return templates
        .map(
            (template) => `
                <div class="border border-gray-200 rounded-xl p-4">
                    <div class="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <h3 class="font-bold text-gray-800">${template.name}</h3>
                            <p class="text-sm text-gray-500">${template.audience}</p>
                        </div>
                        <button type="button" data-template-action="email" data-template-id="${template.id}" class="text-purple-600 hover:text-purple-800 font-semibold">Edit</button>
                    </div>
                    <p class="font-semibold text-gray-700 mb-1">${template.subject}</p>
                    <p class="text-sm text-gray-600 mb-3">${template.previewText}</p>
                    <p class="text-xs text-gray-400">Updated ${formatTimestamp(template.updatedAt)} by ${template.updatedBy}</p>
                </div>
            `
        )
        .join('');
}

function renderTemplateModal(state) {
    if (!state.modal) {
        return '';
    }

    const isNotification = state.modal.type === 'notification';
    const template = isNotification
        ? state.notificationTemplates.find((item) => item.id === state.modal.id)
        : state.emailTemplates.find((item) => item.id === state.modal.id);

    if (!template) {
        return '';
    }

    return `
        <div class="modal-overlay px-4">
            <div class="modal-content modal-content-wide">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">Edit ${isNotification ? 'Notification' : 'Email'} Template</h2>
                        <p class="text-gray-500 text-sm mt-1">Update the content and save your changes.</p>
                    </div>
                    <button type="button" data-close-template-modal class="text-gray-400 hover:text-gray-700 text-xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="templateEditForm">
                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="form-label">Template name</label>
                            <input type="text" name="name" class="form-input" value="${escapeAttribute(template.name)}" />
                        </div>
                        <div>
                            <label class="form-label">Audience</label>
                            <input type="text" name="audience" class="form-input" value="${escapeAttribute(template.audience)}" />
                        </div>
                        ${
                            isNotification
                                ? `
                            <div>
                                <label class="form-label">Trigger</label>
                                <input type="text" name="trigger" class="form-input" value="${escapeAttribute(template.trigger)}" />
                            </div>
                            <div>
                                <label class="form-label">Title</label>
                                <input type="text" name="title" class="form-input" value="${escapeAttribute(template.title)}" />
                            </div>
                        `
                                : `
                            <div>
                                <label class="form-label">Subject</label>
                                <input type="text" name="subject" class="form-input" value="${escapeAttribute(template.subject)}" />
                            </div>
                            <div>
                                <label class="form-label">Preview text</label>
                                <input type="text" name="previewText" class="form-input" value="${escapeAttribute(template.previewText)}" />
                            </div>
                        `
                        }
                        <div>
                            <label class="form-label">Body</label>
                            <textarea name="body" rows="6" class="form-input">${escapeHtml(template.body)}</textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" data-close-template-modal class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Template</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}
