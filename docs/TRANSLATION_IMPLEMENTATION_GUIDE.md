# Multi-Language Translation Implementation Guide

## Overview

This guide explains how to implement full website translation using the language service. The website supports **English**, **Macedonian**, and **Albanian**.

## Quick Start - How to Translate Your Page

### Step 1: Import Language Service

```javascript
import languageService from '../../services/languageService.js';

// Create translator function
const t = (key) => languageService.translate(key);
```

### Step 2: Replace All Hardcoded Text

```javascript
// ❌ BEFORE (Hardcoded English)
<h1>My Applications</h1>
<button>View All</button>

// ✅ AFTER (Using translations)
<h1>${t('nav.applications')}</h1>
<button>${t('buttons.save')}</button>
```

### Step 3: Add Missing Translations

If you need a translation that doesn't exist, add it to `assets/js/data/translations.js`:

```javascript
// In translations.js - Add to all 3 language objects
const translations = {
    en: {
        mySection: {
            myLabel: 'My Label Text',
        },
    },
    mk: {
        mySection: {
            myLabel: 'Мој текст на етикета',
        },
    },
    sq: {
        mySection: {
            myLabel: 'Teksti i etiketës sime',
        },
    },
};
```

## File Structure

```
assets/js/
├── services/
│   └── languageService.js          # Core language service
├── data/
│   └── translations.js             # All translations (EN, MK, SQ)
├── utils/
│   └── translationUtils.js         # Helper functions
├── controllers/
│   └── bloom/
│       └── languageController.js   # Language selector & switching
└── views/
    └── appHeader.js                # Uses translations
```

## Translation Keys Structure

All translations are organized by feature/page:

```javascript
{
    common: { /* General UI terms */ },
    nav: { /* Navigation menu items */ },
    buttons: { /* Button labels */ },
    messages: { /* System messages */ },
    applications: { /* Applications page */ },
    jobs: { /* Jobs page */ },
    companies: { /* Companies page */ },
    profile: { /* Profile page */ },
    events: { /* Events page */ },
    notifications: { /* Notifications page */ }
}
```

## How Language Switching Works

1. **User clicks language button** → Dropdown appears with flag options
2. **User selects language** → `changeLanguage(langCode)` is called
3. **Language is saved** → localStorage stores preference
4. **Page reloads** → `window.router.navigate(currentPath)` re-renders page
5. **Entire page updates** → All translations applied via language service

## Controllers That Need Translation Updates

### Priority 1 - Main Pages (Most Important)

- [ ] `dashboardController.js` - Dashboard welcome & stats
- [ ] `jobBoardController.js` - Job listings & search
- [ ] `companiesController.js` - Company listings
- [ ] `eventsController.js` - Events page
- [ ] `profileController.js` - User profile page

### Priority 2 - Secondary Pages

- [ ] `applicantsPipelineController.js`
- [ ] `candidatesController.js`
- [ ] `companyProfileController.js`
- [ ] `jobApplicantsController.js`
- [ ] `myJobsController.js`

### Priority 3 - Components

- [ ] `applicationsGrid.js`
- [ ] `applicationsFilters.js`
- [ ] `applicationsStats.js`
- [ ] Any other component rendering text

## Example: Updating a Controller

### Original Code

```javascript
export default async function dashboardController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    app.innerHTML = `
        ${renderAppHeader(user)}
        <div class="container">
            <h1>Welcome, ${user.name}!</h1>
            <p>Dashboard Overview</p>
            <button>View Applications</button>
        </div>
    `;
}
```

### Updated Code with Translations

```javascript
import languageService from '../../services/languageService.js';

export default async function dashboardController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    const t = (key) => languageService.translate(key);

    app.innerHTML = `
        ${renderAppHeader(user)}
        <div class="container">
            <h1>${t('messages.welcome')}, ${user.name}!</h1>
            <p>${t('dashboard.overview')}</p>
            <button>${t('nav.applications')}</button>
        </div>
    `;
}
```

## Using Translation Utilities

```javascript
// Import utilities
import {
    getTranslator,
    translateObject,
    getStatusLabel,
    getEmploymentTypeLabel,
    formatLocalizedDate,
    onLanguageChange,
} from '../../utils/translationUtils.js';

// Use translator
const t = getTranslator();
console.log(t('nav.dashboard')); // "Dashboard"

// Translate multiple keys
const labels = translateObject({
    title: 'nav.jobs',
    filter: 'nav.filter',
    search: 'jobs.search',
});

// Status labels with translation
const status = getStatusLabel('pending'); // "Pending"

// Employment type
const type = getEmploymentTypeLabel('full-time'); // "Full Time"

// Formatted date with locale
const date = formatLocalizedDate(new Date()); // "15/5/2026" (mk), "5/15/2026" (en), etc.

// Listen to language changes
onLanguageChange(() => {
    console.log('Language changed!');
    // Re-render if needed
});
```

## Available Translation Keys

### Common Keys

```javascript
t('common.language'); // "Language" / "Јазик" / "Gjuha"
t('common.avy'); // "Avy"
t('common.byAvengaAcademy'); // "by Avenga Academy"
```

### Navigation Keys

```javascript
t('nav.dashboard'); // Dashboard
t('nav.jobs'); // Jobs
t('nav.applications'); // Applications
t('nav.profile'); // Profile
t('nav.myJobs'); // My Jobs
t('nav.postJob'); // Post Job
// ... and more
```

### Button Keys

```javascript
t('buttons.logout'); // Logout
t('buttons.save'); // Save
t('buttons.cancel'); // Cancel
t('buttons.delete'); // Delete
t('buttons.apply'); // Apply
// ... and more
```

### Page-Specific Keys

```javascript
// Applications
t('applications.title'); // My Applications
t('applications.status'); // Status
t('applications.noApplications'); // No applications

// Jobs
t('jobs.title'); // Job Board
t('jobs.search'); // Search jobs...
t('jobs.applyNow'); // Apply Now

// Profile
t('profile.title'); // My Profile
t('profile.personalInfo'); // Personal Information
// ... and more
```

## Testing Translations

### 1. Check Language Storage

```javascript
console.log(localStorage.getItem('appLanguage')); // 'en', 'mk', or 'sq'
```

### 2. Get Current Language

```javascript
console.log(languageService.getCurrentLanguage()); // 'en'
```

### 3. Test Translation

```javascript
console.log(languageService.translate('nav.dashboard')); // "Dashboard"
languageService.setLanguage('mk');
console.log(languageService.translate('nav.dashboard')); // "Контролна табла"
```

### 4. Change Language Programmatically

```javascript
languageService.setLanguage('sq'); // Switch to Albanian
// Page will reload and display Albanian UI
```

## Adding New Pages with Translation Support

1. **Import language service**

    ```javascript
    import languageService from '../../services/languageService.js';
    ```

2. **Create translator**

    ```javascript
    const t = (key) => languageService.translate(key);
    ```

3. **Add translation keys to translations.js**

    ```javascript
    myNewPage: {
        title: 'My New Page',
        description: 'Page description'
    }
    ```

4. **Use translations in HTML**
    ```javascript
    <h1>${t('myNewPage.title')}</h1>
    <p>${t('myNewPage.description')}</p>
    ```

## Translation Key Naming Conventions

- **Use camelCase**: `myKeyName` ✅ (not `my-key-name` ❌)
- **Group related keys**: `profile.firstName`, `profile.lastName`
- **Use dot notation**: Access nested keys with dots
- **Keep keys short but descriptive**: `nav.jobs` (not `navigation_items_jobs`)

## Troubleshooting

### Issue: Translation not appearing

**Solution**: Check that the key exists in all 3 language objects in translations.js

### Issue: Page not switching language

**Solution**: Check that:

1. Language button is clicked successfully
2. `languageService.setLanguage(code)` returns true
3. Router is navigating to current path

### Issue: Old translation appears after switching

**Solution**: The page needs to re-render. Language switching automatically calls `window.router.navigate()` to reload the page.

### Issue: Some text not translating

**Solution**: Make sure the text uses `${t('key')}` syntax inside template strings. Check that you're not accidentally using single quotes or hardcoded strings.

## Best Practices

1. ✅ **Always use translation keys** for user-facing text
2. ✅ **Add all 3 languages** when adding new translations
3. ✅ **Use dot notation** for organized structure
4. ✅ **Keep translations in separate file** - Don't hardcode in components
5. ✅ **Test all languages** before deploying
6. ✅ **Use consistent key names** across similar features
7. ✅ **Document new translation sections** in comments

## Performance Optimization

The translation system is optimized for performance:

- Translations are cached in memory
- Language switching is instant (no API calls)
- localStorage is used for persistence
- No re-renders unless language changes

For bulk translations, use the CachedTranslator:

```javascript
import { CachedTranslator } from '../../utils/translationUtils.js';

const translator = new CachedTranslator();
console.log(translator.translate('nav.jobs')); // Cached
```

## Migration Checklist

Use this checklist to migrate existing pages:

- [ ] Import `languageService`
- [ ] Create `t = (key) => languageService.translate(key)`
- [ ] Replace page title with `t('page.title')`
- [ ] Replace all button labels with `t('buttons.*')`
- [ ] Replace all labels with appropriate `t('section.label')`
- [ ] Replace error messages with `t('messages.*')`
- [ ] Add missing translation keys to translations.js
- [ ] Test page in all 3 languages
- [ ] Verify language switching works

---

## Summary

The translation system is now fully integrated into your Avy-Fe application. To fully translate the entire website:

1. Update each controller to import and use `languageService`
2. Add missing translation keys to `translations.js`
3. Test language switching works on all pages
4. Deploy with confidence that your app supports 3 languages!

For support, refer to:

- `languageService.js` - Core translation logic
- `translations.js` - All translation strings
- `translationUtils.js` - Helper functions
