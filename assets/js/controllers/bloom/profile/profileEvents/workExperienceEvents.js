import { editingState, setDateRangeSelectors, getDateFromSelectors } from '../profileHelpers.js';
import { renderWorkExperienceList } from '../profileRenderer.js';
import { showConfirmModal } from '../profileModals.js';
import { handleCurrentCheckboxToggle, updateAndSave, showToast } from './shared.js';

export function setupWorkExperienceEvents(cvProfile) {
    const modal = document.getElementById('workExpModal');
    const form = document.getElementById('workExpForm');

    document.getElementById('addWorkExpBtn').addEventListener('click', () => {
        editingState.globalEditingId = null;
        form.reset();
        document.getElementById('workExpId').value = '';
        const currentCheckbox = document.getElementById('workCurrent');
        if (currentCheckbox) currentCheckbox.checked = false;
        if (document.getElementById('workEndMonth')) document.getElementById('workEndMonth').disabled = false;
        if (document.getElementById('workEndYear')) document.getElementById('workEndYear').disabled = false;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });

    document.getElementById('closeWorkExpModal').addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    handleCurrentCheckboxToggle('work');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isCurrent = document.getElementById('workCurrent')?.checked || false;
        const startDate = getDateFromSelectors('work', true);
        const endDate = getDateFromSelectors('work', false, isCurrent);

        const workExp = {
            id: document.getElementById('workExpId').value || Date.now().toString(),
            position: document.getElementById('workPosition').value,
            company: document.getElementById('workCompany').value,
            startDate: startDate,
            endDate: endDate,
            description: document.getElementById('workDescription').value,
            isVolunteering: document.getElementById('workIsVolunteering').checked,
        };

        if (editingState.globalEditingId) {
            const index = cvProfile.workExperience.findIndex((exp) => exp.id === editingState.globalEditingId);
            if (index !== -1) {
                cvProfile.workExperience[index] = workExp;
            }
            editingState.globalEditingId = null;
            showToast('Work experience updated successfully!');
        } else {
            cvProfile.workExperience.push(workExp);
            showToast('Work experience added successfully!');
        }

        document.getElementById('workExperienceList').innerHTML = renderWorkExperienceList(cvProfile.workExperience);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        updateAndSave(cvProfile);
        attachWorkExpEvents(cvProfile);
    });

    attachWorkExpEvents(cvProfile);
}

function attachWorkExpEvents(cvProfile) {
    document.querySelectorAll('.edit-work-exp').forEach((btn) => {
        btn.removeEventListener('click', btn._listener);
        const handler = () => {
            const id = btn.dataset.id;
            const workExp = cvProfile.workExperience.find((exp) => exp.id === id);
            if (workExp) {
                editingState.globalEditingId = id;
                document.getElementById('workExpId').value = workExp.id;
                document.getElementById('workPosition').value = workExp.position;
                document.getElementById('workCompany').value = workExp.company;
                const isPresent = workExp.endDate === 'Present';
                setDateRangeSelectors('work', workExp.startDate, workExp.endDate, isPresent);
                document.getElementById('workDescription').value = workExp.description || '';
                document.getElementById('workIsVolunteering').checked = workExp.isVolunteering || false;

                const modal = document.getElementById('workExpModal');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        };
        btn._listener = handler;
        btn.addEventListener('click', handler);
    });

    document.querySelectorAll('.delete-work-exp').forEach((btn) => {
        btn.removeEventListener('click', btn._deleteListener);
        const handler = () => {
            const id = btn.dataset.id;
            const workExp = cvProfile.workExperience.find((exp) => exp.id === id);
            if (workExp) {
                showConfirmModal(`Delete "${workExp.position}" at ${workExp.company}?`, () => {
                    cvProfile.workExperience = cvProfile.workExperience.filter((exp) => exp.id !== id);
                    document.getElementById('workExperienceList').innerHTML = renderWorkExperienceList(cvProfile.workExperience);
                    updateAndSave(cvProfile);
                    attachWorkExpEvents(cvProfile);
                    showToast('Work experience deleted successfully!');
                });
            }
        };
        btn._deleteListener = handler;
        btn.addEventListener('click', handler);
    });
}
