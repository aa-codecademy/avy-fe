/**
 * Language Selector Controller
 * Renders and handles language selection dropdown in the header
 */

import languageService from '../../services/languageService.js';
import authService from '../../services/authService.js';
import { renderAppHeader } from '../../views/appHeader.js';

/**
 * Render language selector button with dropdown
 * Shows current language and allows selection of other languages
 */
export function renderLanguageSelector() {
    const currentLang = languageService.getCurrentLanguage();
    const currentLangName = languageService.getLanguageName(currentLang);
    const supportedLanguages = languageService.getSupportedLanguages();
    const otherLanguages = supportedLanguages.filter((lang) => lang.code !== currentLang);

    const languageFlags = {
        en: '🇺🇸',
        mk: '🇲🇰',
        sq: '🇦🇱',
    };

    const dropdownItems = otherLanguages
        .map(
            (lang) => `
        <button 
            class="language-option w-full text-left px-4 py-2 hover:bg-purple-100 transition text-sm" 
            data-lang-code="${lang.code}"
            title="${lang.name}">
            <span class="text-xl mr-2">${languageFlags[lang.code]}</span>
            ${lang.name}
        </button>
    `
        )
        .join('');

    return `
        <div class="relative group">
            <button 
                id="languageBtn" 
                class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-700 hover:text-purple-600"
                title="${currentLangName}">
                <span class="text-xl">${languageFlags[currentLang]}</span>
                <span class="text-sm font-medium hidden sm:inline">${currentLangName}</span>
                <i class="fas fa-chevron-down text-xs"></i>
            </button>
            
            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="p-2">
                    <div class="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        ${languageService.translate('common.language')}
                    </div>
                    <div class="border-t border-gray-200 my-1"></div>
                    ${dropdownItems}
                </div>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to language selector
 */
export function attachLanguageSelectorEvents() {
    const languageOptions = document.querySelectorAll('.language-option');

    languageOptions.forEach((option) => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const langCode = option.getAttribute('data-lang-code');
            changeLanguage(langCode);
        });
    });
}

/**
 * Change application language and update UI
 */
function changeLanguage(langCode) {
    if (!languageService.setLanguage(langCode)) {
        console.error(`Failed to set language to ${langCode}`);
        return;
    }

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));

    // Reload the entire page to apply translations everywhere
    setTimeout(() => {
        // Get current path
        const currentPath = window.location.pathname;
        // Navigate to same path to trigger full re-render
        window.router.navigate(currentPath);
    }, 300);
}


/**
 * Language controller - renders language selector UI
 */
export default async function languageController() {
    // This controller is mainly for demo purposes
    // The language selector is integrated into the header
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="container mx-auto px-4 py-8">
            <div class="bg-white rounded-lg shadow-md p-8 max-w-2xl">
                <h1 class="text-3xl font-bold text-gray-800 mb-4">
                    ${languageService.translate('common.language')}
                </h1>
                <p class="text-gray-600 mb-6">
                    ${languageService.translate('common.currentLanguage')}: <strong>${languageService.getLanguageName(languageService.getCurrentLanguage())}</strong>
                </p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${languageService
                        .getSupportedLanguages()
                        .map(
                            (lang) => `
                        <button 
                            class="language-card p-6 rounded-lg border-2 transition-all hover:shadow-lg ${languageService.getCurrentLanguage() === lang.code ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}"
                            data-lang-code="${lang.code}">
                            <div class="text-5xl mb-3">
                                ${['en', 'mk', 'sq'].includes(lang.code) ? ['🇺🇸', '🇲🇰', '🇦🇱'][['en', 'mk', 'sq'].indexOf(lang.code)] : ''}
                            </div>
                            <div class="text-lg font-semibold text-gray-800">${lang.name}</div>
                            ${languageService.getCurrentLanguage() === lang.code ? '<div class="text-purple-600 text-sm mt-2">✓ Selected</div>' : ''}
                        </button>
                    `
                        )
                        .join('')}
                </div>
            </div>
        </div>
    `;

    // Attach events
    document.querySelectorAll('.language-card').forEach((card) => {
        card.addEventListener('click', () => {
            const langCode = card.getAttribute('data-lang-code');
            changeLanguage(langCode);
            // Reload the page to reflect changes
            setTimeout(() => window.location.reload(), 300);
        });
    });
}
