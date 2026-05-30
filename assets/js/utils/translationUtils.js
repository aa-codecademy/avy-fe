/**
 * Translation Utilities Helper
 * Provides easy access to translation function and common translation patterns
 */

import languageService from '../services/languageService.js';

/**
 * Get translation function bound to current language
 * Usage: const t = getTranslator(); t('nav.dashboard')
 */
export function getTranslator() {
    return (key, defaultValue = '') => languageService.translate(key, defaultValue);
}

/**
 * Translate all keys in an object
 * Usage: translateObject({ label: 'nav.dashboard', value: 'nav.jobs' })
 * Returns: { label: 'Dashboard', value: 'Jobs' }
 */
export function translateObject(keys) {
    const result = {};
    const t = getTranslator();
    
    Object.entries(keys).forEach(([key, translationKey]) => {
        result[key] = t(translationKey);
    });
    
    return result;
}

/**
 * Translate an array of keys
 * Usage: translateArray(['nav.dashboard', 'nav.jobs'])
 * Returns: ['Dashboard', 'Jobs']
 */
export function translateArray(keys) {
    const t = getTranslator();
    return keys.map(key => t(key));
}

/**
 * Create status label with translation
 * Usage: getStatusLabel('pending') => 'Pending'
 */
export function getStatusLabel(status) {
    const t = getTranslator();
    const statusMap = {
        pending: 'Pending',
        under_review: 'Under Review',
        interview: 'Interview',
        accepted: 'Accepted',
        rejected: 'Rejected',
        declined: 'Declined'
    };
    
    return statusMap[status] || status;
}

/**
 * Get employment type label
 * Usage: getEmploymentTypeLabel('full-time') => 'Full Time'
 */
export function getEmploymentTypeLabel(type) {
    const t = getTranslator();
    const typeMap = {
        'full-time': t('applications.fullTime'),
        'part-time': t('applications.partTime'),
        contract: t('applications.contract'),
        internship: t('applications.internship')
    };
    
    return typeMap[type] || type;
}

/**
 * Format date with locale awareness
 * Usage: formatLocalizedDate(new Date())
 */
export function formatLocalizedDate(date) {
    const lang = languageService.getCurrentLanguage();
    const dateObj = new Date(date);
    
    return dateObj.toLocaleDateString(lang === 'mk' ? 'mk-MK' : lang === 'sq' ? 'sq-AL' : 'en-US');
}

/**
 * Listen to language changes and execute callback
 * Usage: onLanguageChange(() => { /* re-render page */ })
 */
export function onLanguageChange(callback) {
    languageService.onLanguageChange(callback);
}

/**
 * Create a translator with caching for performance
 */
export class CachedTranslator {
    constructor() {
        this.cache = new Map();
        this.setupListener();
    }
    
    translate(key, defaultValue = '') {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        const result = languageService.translate(key, defaultValue);
        this.cache.set(key, result);
        return result;
    }
    
    setupListener() {
        languageService.onLanguageChange(() => {
            this.cache.clear();
        });
    }
}

export default getTranslator;
