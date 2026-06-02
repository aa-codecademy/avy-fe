/**
 * Admin Platform Settings Controller
 * Manage privacy and localisation preferences.
 */
import mockDataService from '../../services/mockDataService.js';
import {
    bindAdminLogout,
    escapeAttribute,
    renderAdminSettingsLayout,
    renderSettingsActionLink,
    requireAdminUser,
} from './adminSettingsShared.js';

export default async function adminPlatformSettingsController() {
    const app = document.getElementById('app');
    const user = requireAdminUser();

    if (!user) {
        return;
    }

    const state = {
        platformSettings: null,
    };

    await loadData();
    render();

    async function loadData() {
        state.platformSettings = await mockDataService.getPlatformSettings();
    }

    function render() {
        const enabledLanguages = state.platformSettings.localisation.supportedLanguages.filter(
            (language) => language.enabled
        ).length;

        app.innerHTML = renderAdminSettingsLayout({
            user,
            currentPath: window.location.pathname,
            title: 'Platform Configuration',
            description:
                'Update privacy defaults, language availability, and localisation behavior.',
            headerActions: renderSettingsActionLink(
                '/admin/settings',
                'Settings Overview',
                'fa-arrow-left'
            ),
            summaryCards: [
                {
                    label: 'Default Visibility',
                    value: state.platformSettings.privacy.defaultProfileVisibility,
                    valueClass: 'text-red-500 uppercase',
                },
                {
                    label: 'Enabled Languages',
                    value: enabledLanguages,
                    valueClass: 'text-green-600',
                },
            ],
            content: `
                <div class="grid xl:grid-cols-2 gap-8">
                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-user-shield text-red-500 mr-2"></i>
                            Privacy Policy Settings
                        </h2>
                        <form id="privacySettingsForm">
                            <div class="grid md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label class="form-label">Default profile visibility</label>
                                    <select name="defaultProfileVisibility" class="form-input">
                                        <option value="public" ${state.platformSettings.privacy.defaultProfileVisibility === 'public' ? 'selected' : ''}>Public</option>
                                        <option value="private" ${state.platformSettings.privacy.defaultProfileVisibility === 'private' ? 'selected' : ''}>Private</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Access request expiry (days)</label>
                                    <input type="number" min="1" name="employerAccessRequestExpiryDays" class="form-input" value="${state.platformSettings.privacy.employerAccessRequestExpiryDays}" />
                                </div>
                                <div>
                                    <label class="form-label">Consent log retention (days)</label>
                                    <input type="number" min="30" name="consentLogRetentionDays" class="form-input" value="${state.platformSettings.privacy.consentLogRetentionDays}" />
                                </div>
                                <div>
                                    <label class="form-label">DSAR response window (days)</label>
                                    <input type="number" min="1" name="dsarResponseWindowDays" class="form-input" value="${state.platformSettings.privacy.dsarResponseWindowDays}" />
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save mr-2"></i> Save Privacy Settings
                            </button>
                        </form>
                    </div>

                    <div class="card">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-language text-green-600 mr-2"></i>
                            Language and Localisation
                        </h2>
                        <form id="localisationSettingsForm">
                            <div class="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="form-label">Default language</label>
                                    <select name="defaultLanguage" class="form-input">
                                        ${state.platformSettings.localisation.supportedLanguages.map((language) => `<option value="${language.code}" ${language.code === state.platformSettings.localisation.defaultLanguage ? 'selected' : ''}>${language.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Timezone</label>
                                    <input type="text" name="timezone" class="form-input" value="${escapeAttribute(state.platformSettings.localisation.timezone)}" />
                                </div>
                                <div class="md:col-span-2">
                                    <label class="form-label">Date format</label>
                                    <select name="dateFormat" class="form-input">
                                        ${['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map((format) => `<option value="${format}" ${format === state.platformSettings.localisation.dateFormat ? 'selected' : ''}>${format}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="mb-6">
                                <p class="form-label">Supported languages</p>
                                <div class="grid sm:grid-cols-2 gap-3">
                                    ${state.platformSettings.localisation.supportedLanguages
                                        .map(
                                            (language) => `
                                        <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300">
                                            <input type="checkbox" name="supportedLanguage" value="${language.code}" ${language.enabled ? 'checked' : ''} />
                                            <span class="font-medium text-gray-700">${language.name}</span>
                                        </label>
                                    `
                                        )
                                        .join('')}
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save mr-2"></i> Save Localisation
                            </button>
                        </form>
                    </div>
                </div>
            `,
        });

        bindEvents();
    }

    function bindEvents() {
        bindAdminLogout();

        const privacySettingsForm = document.getElementById('privacySettingsForm');
        if (privacySettingsForm) {
            privacySettingsForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);
                await mockDataService.updatePlatformSettings({
                    privacy: {
                        defaultProfileVisibility: String(
                            formData.get('defaultProfileVisibility') || 'private'
                        ),
                        employerAccessRequestExpiryDays: Number(
                            formData.get('employerAccessRequestExpiryDays') || 7
                        ),
                        consentLogRetentionDays: Number(
                            formData.get('consentLogRetentionDays') || 365
                        ),
                        dsarResponseWindowDays: Number(
                            formData.get('dsarResponseWindowDays') || 30
                        ),
                    },
                });

                await loadData();
                render();
            });
        }

        const localisationSettingsForm = document.getElementById('localisationSettingsForm');
        if (localisationSettingsForm) {
            localisationSettingsForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);
                const enabledLanguageCodes = new Set(
                    formData.getAll('supportedLanguage').map((value) => String(value))
                );
                const supportedLanguages =
                    state.platformSettings.localisation.supportedLanguages.map((language) => ({
                        ...language,
                        enabled: enabledLanguageCodes.has(language.code),
                    }));

                await mockDataService.updatePlatformSettings({
                    localisation: {
                        defaultLanguage: String(formData.get('defaultLanguage') || 'en'),
                        timezone: String(formData.get('timezone') || '').trim(),
                        dateFormat: String(formData.get('dateFormat') || 'DD/MM/YYYY'),
                        supportedLanguages,
                    },
                });

                await loadData();
                render();
            });
        }
    }
}
