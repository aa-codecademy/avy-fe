class LanguageService {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.listeners = [];
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setLanguage(language) {
        if (['en', 'mk', 'sq'].includes(language)) {
            this.currentLanguage = language;
            localStorage.setItem('preferredLanguage', language);
            this.notifyListeners();
        }
    }

    onLanguageChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentLanguage));
    }
}

const languageService = new LanguageService();
export default languageService;
