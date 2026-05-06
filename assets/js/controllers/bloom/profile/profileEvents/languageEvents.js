import { editingState } from '../profileHelpers.js';
import { renderLanguagesList } from '../profileRenderer.js';
import { showConfirmModal } from '../profileModals.js';
import { updateAndSave, showToast } from './shared.js';

export function setupLanguageEvents(cvProfile) {
    const modal = document.getElementById('languageModal');
    const form = document.getElementById('languageForm');

    document.getElementById('addLanguageBtn').addEventListener('click', () => {
        editingState.globalLanguageEditingIndex = -1;
        form.reset();
        document.getElementById('languageName').value = '';
        document.getElementById('languageLevel').value = '';
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });

    document.getElementById('closeLanguageModal').addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const languageName = document.getElementById('languageName').value.trim();
        const languageLevel = document.getElementById('languageLevel').value;

        if (languageName === '' || languageLevel === '') {
            showToast('Please fill in both language and level', 'error');
            return;
        }

        const language = {
            language: languageName,
            level: languageLevel,
        };

        if (editingState.globalLanguageEditingIndex >= 0) {
            cvProfile.languages[editingState.globalLanguageEditingIndex] = language;
            editingState.globalLanguageEditingIndex = -1;
            showToast('Language updated successfully!');
        } else {
            cvProfile.languages.push(language);
            showToast('Language added successfully!');
        }

        document.getElementById('languagesList').innerHTML = renderLanguagesList(cvProfile.languages);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        form.reset();
        updateAndSave(cvProfile);
        attachLanguageEvents(cvProfile);
    });

    attachLanguageEvents(cvProfile);
}

function attachLanguageEvents(cvProfile) {
    document.querySelectorAll('.edit-language').forEach((btn) => {
        btn.removeEventListener('click', btn._listener);
        const handler = () => {
            const index = parseInt(btn.dataset.index);
            const language = cvProfile.languages[index];
            if (language) {
                editingState.globalLanguageEditingIndex = index;
                document.getElementById('languageName').value = language.language;
                document.getElementById('languageLevel').value = language.level;
                const modal = document.getElementById('languageModal');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        };
        btn._listener = handler;
        btn.addEventListener('click', handler);
    });

    document.querySelectorAll('.delete-language').forEach((btn) => {
        btn.removeEventListener('click', btn._deleteListener);
        const handler = () => {
            const index = parseInt(btn.dataset.index);
            const languageName = cvProfile.languages[index].language;
            showConfirmModal(`Delete "${languageName}"?`, () => {
                cvProfile.languages.splice(index, 1);
                document.getElementById('languagesList').innerHTML = renderLanguagesList(cvProfile.languages);
                updateAndSave(cvProfile);
                attachLanguageEvents(cvProfile);
                showToast('Language deleted successfully!');
            });
        };
        btn._deleteListener = handler;
        btn.addEventListener('click', handler);
    });
}
