# Language Selection Feature Guide

## Overview

The Avy-Fe application now supports multi-language selection with **English**, **Macedonian**, and **Albanian**. The language preference is saved to localStorage and persists across sessions.

## Files Created

### 1. **Language Service** (`assets/js/services/languageService.js`)

- Manages language state and preferences
- Handles translation lookups
- Persists language preference to localStorage
- Notifies components when language changes

### 2. **Translations Data** (`assets/js/data/translations.js`)

- Contains all text translations for the three languages
- Organized by sections (common, nav, buttons, messages)
- Easily extensible for new translations

### 3. **Language Controller** (`assets/js/controllers/bloom/languageController.js`)

- Renders language selector UI with flag logos
- Handles language change interactions
- Includes a dedicated language settings page

### 4. **Updated App Header** (`assets/js/views/appHeader.js`)

- Integrated language selector dropdown button
- Shows current language with flag emoji
- Positioned in the top navigation bar

### 5. **Main App Entry** (`assets/js/main.js`)

- Language service imported and made globally available
- Added `/language` route for language settings page

## Features

### 🌐 Language Selection Button

- **Location**: Top navigation bar, next to user profile
- **Display**: Flag emoji with language name
- **Interaction**: Click dropdown to see other language options
- **Visual Feedback**: Hover effects and active state indicators

### 🔄 Language Switching

- Click any language option to instantly change the app language
- Changes persist automatically via localStorage
- No page reload required for header/UI translations

### 🎯 Current Language Display

- Language button shows the current selected language with corresponding flag
- Dropdown shows only alternative languages (not the current one)
- Logo shows current language preference

### 🗂️ Supported Languages

| Language   | Code | Flag | Translation Status |
| ---------- | ---- | ---- | ------------------ |
| English    | `en` | 🇺🇸   | Complete           |
| Macedonian | `mk` | 🇲🇰   | Complete           |
| Albanian   | `sq` | 🇦🇱   | Complete           |

## How to Use

### For Users

1. Look for the **language selector button** in the top navigation bar
2. **Click the flag icon** to see available languages
3. **Select a language** to switch the UI immediately
4. Your selection is **automatically saved** and will be remembered next time you visit

### For Developers

#### Adding New Translations

1. Open `assets/js/data/translations.js`
2. Add your new text key to all three languages:

```javascript
const translations = {
    en: {
        // ... existing translations
        myNewSection: {
            myNewKey: 'Hello World',
        },
    },
    mk: {
        // ... existing translations
        myNewSection: {
            myNewKey: 'Здраво свету',
        },
    },
    sq: {
        // ... existing translations
        myNewSection: {
            myNewKey: 'Përshëndetje Botë',
        },
    },
};
```

#### Using Translations in Code

```javascript
import languageService from './services/languageService.js';

// Simple translation
const greeting = languageService.translate('common.welcome');

// Translation with parameters
const message = languageService.translateWithParams('messages.hello', { name: 'John' });

// Get current language code
const lang = languageService.getCurrentLanguage();

// Get current language name
const langName = languageService.getLanguageName(lang);
```

#### Listening to Language Changes

```javascript
import languageService from './services/languageService.js';

// Subscribe to language changes
languageService.onLanguageChange((newLanguage) => {
    console.log('Language changed to:', newLanguage);
    // Update your UI accordingly
});

// Or use the custom event
window.addEventListener('languageChanged', (e) => {
    console.log('New language:', e.detail.language);
});
```

#### Programmatically Set Language

```javascript
import languageService from './services/languageService.js';

// Change language
languageService.setLanguage('mk'); // Switch to Macedonian
languageService.setLanguage('sq'); // Switch to Albanian
languageService.setLanguage('en'); // Switch to English
```

## Translation File Structure

The translations are organized in a nested object structure for easy management:

```javascript
translations = {
    [languageCode]: {
        [sectionName]: {
            [translationKey]: 'Text in language',
        },
    },
};
```

### Current Sections:

- **common**: General UI terms (language, app name, etc.)
- **nav**: Navigation menu items
- **buttons**: Button labels
- **messages**: System messages and notifications

## Extending the Language System

### Adding a New Language

1. Add a new entry in `assets/js/data/translations.js`:

```javascript
translations.it = {
    // Italian
    common: {
        /* ... */
    },
    nav: {
        /* ... */
    },
    buttons: {
        /* ... */
    },
    messages: {
        /* ... */
    },
};
```

2. Update language service to recognize it (optional UI changes):

```javascript
// In languageService.js
const names = {
    en: 'English',
    mk: 'Македонски',
    sq: 'Shqip',
    it: 'Italiano', // Add new language
};
```

3. Add flag emoji support in `languageController.js`:

```javascript
const languageFlags = {
    en: '🇺🇸',
    mk: '🇲🇰',
    sq: '🇦🇱',
    it: '🇮🇹', // Add new flag
};
```

### Dynamic Translation Updates

If you need to reload translations dynamically (e.g., from an API):

```javascript
import languageService from './services/languageService.js';

// Update translations
languageService.translations = newTranslationsObject;

// Notify all listeners
languageService.notifyListeners();
```

## Debugging

### Check Current Language

```javascript
console.log(window.languageService.getCurrentLanguage());
```

### Check Available Languages

```javascript
console.log(window.languageService.getSupportedLanguages());
```

### Test Translation Lookup

```javascript
console.log(window.languageService.translate('nav.dashboard'));
```

### Check Stored Preference

```javascript
console.log(localStorage.getItem('appLanguage'));
```

## Best Practices

1. **Use dot notation for nested keys**: `languageService.translate('nav.dashboard')`
2. **Always provide a default value**: `languageService.translate('key', 'Default Text')`
3. **Keep translations organized by section** for maintainability
4. **Test all languages** when adding new features with text
5. **Use the language selector** for user preferences, not hardcoded values
6. **Listen to language changes** in components that need to update dynamically

## Troubleshooting

### Language not changing

- Check browser console for errors
- Verify localStorage is enabled
- Ensure language code is valid ('en', 'mk', 'sq')

### Translation key not found

- Check spelling in both code and translations file
- Verify the key path is correct (e.g., 'common.welcome' not 'common-welcome')
- Add missing key to all three language sections

### Language resets after refresh

- Check if localStorage is being cleared
- Verify the appLanguage value in localStorage
- Check browser privacy settings

## Future Enhancements

- [ ] Add language auto-detection based on browser locale
- [ ] Support for RTL languages (Arabic, Hebrew)
- [ ] Integration with translation APIs for dynamic loading
- [ ] Language-specific date/time formatting
- [ ] Pluralization support
- [ ] Translation management dashboard

---

**Created**: May 2026  
**Location**: `/assets/js/services/languageService.js`, `/assets/js/data/translations.js`, `/assets/js/controllers/bloom/languageController.js`
