/**
 * Language Service - Manages application language preferences and translations
 * Supports: Macedonian, English, Albanian
 */

import translations from '../data/translations.js';

class LanguageService {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.translations = translations;
        this.listeners = [];
    }

    /**
     * Get stored language preference from localStorage
     */
    getStoredLanguage() {
        return localStorage.getItem('appLanguage') || 'en';
    }

    /**
     * Set language and persist to localStorage
     */
    setLanguage(languageCode) {
        if (!this.translations[languageCode]) {
            console.warn(`Language ${languageCode} not supported`);
            return false;
        }
        this.currentLanguage = languageCode;
        localStorage.setItem('appLanguage', languageCode);
        this.notifyListeners();
        return true;
    }

    /**
     * Get current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get language name
     */
    getLanguageName(languageCode) {
        const names = {
            en: 'English',
            mk: 'Македонски',
            sq: 'Shqip',
        };
        return names[languageCode] || languageCode;
    }

    /**
     * Get all supported languages
     */
    getSupportedLanguages() {
        return [
            { code: 'en', name: 'English' },
            { code: 'mk', name: 'Македонски' },
            { code: 'sq', name: 'Shqip' },
        ];
    }

    /**
     * Translate a key - supports nested keys with dot notation
     * Example: translate('dashboard.welcome') → "Welcome to Dashboard"
     */
    translate(key, defaultValue = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue || key;
            }
        }

        return typeof value === 'string' ? value : defaultValue || key;
    }

    /**
     * Translate with parameters (e.g., {{name}})
     */
    translateWithParams(key, params = {}) {
        let text = this.translate(key);
        Object.keys(params).forEach((param) => {
            text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
        });
        return text;
    }

    /**
     * Subscribe to language changes
     */
    onLanguageChange(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notify all listeners of language change
     */
    notifyListeners() {
        this.listeners.forEach((callback) => callback(this.currentLanguage));
    }

    /**
     * Remove listener
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter((cb) => cb !== callback);
    }

    /**
     * Get all translations for current language
     */
    getAllTranslations() {
        return this.translations[this.currentLanguage];
    }
}

export default new LanguageService();
