import { editingState, setDateRangeSelectors, getDateFromSelectors } from '../profileHelpers.js';
import { renderAdditionalEducationList } from '../profileRenderer.js';
import { showConfirmModal } from '../profileModals.js';
import { handleCurrentCheckboxToggle, updateAndSave, showToast } from './shared.js';

export function setupAdditionalEducationEvents(cvProfile) {
    const modal = document.getElementById('additionalEduModal');
    const form = document.getElementById('additionalEduForm');

    document.getElementById('addAdditionalEduBtn').addEventListener('click', () => {
        editingState.globalEditingId = null;
        form.reset();
        document.getElementById('additionalEduId').value = '';
        const currentCheckbox = document.getElementById('additionalCurrent');
        if (currentCheckbox) currentCheckbox.checked = false;
        if (document.getElementById('additionalEndMonth')) document.getElementById('additionalEndMonth').disabled = false;
        if (document.getElementById('additionalEndYear')) document.getElementById('additionalEndYear').disabled = false;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });

    document.getElementById('closeAdditionalEduModal').addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    handleCurrentCheckboxToggle('additional');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isCurrent = document.getElementById('additionalCurrent')?.checked || false;
        const startDate = getDateFromSelectors('additional', true, false);
        const endDate = isCurrent ? 'Present' : getDateFromSelectors('additional', false, false);

        const additionalEdu = {
            id: document.getElementById('additionalEduId').value || Date.now().toString(),
            courseName: document.getElementById('additionalCourseName').value,
            institution: document.getElementById('additionalInstitution').value,
            startDate: startDate,
            endDate: endDate,
            description: document.getElementById('additionalDescription').value,
            certificateUrl: document.getElementById('additionalCertificateUrl').value,
        };

        if (editingState.globalEditingId) {
            const index = cvProfile.additionalEducation.findIndex((edu) => edu.id === editingState.globalEditingId);
            if (index !== -1) {
                cvProfile.additionalEducation[index] = additionalEdu;
            }
            editingState.globalEditingId = null;
            showToast('Additional education updated successfully!');
        } else {
            cvProfile.additionalEducation.push(additionalEdu);
            showToast('Additional education added successfully!');
        }

        document.getElementById('additionalEducationList').innerHTML = renderAdditionalEducationList(cvProfile.additionalEducation);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        updateAndSave(cvProfile);
        attachAdditionalEducationEvents(cvProfile);
    });

    attachAdditionalEducationEvents(cvProfile);
}

function attachAdditionalEducationEvents(cvProfile) {
    document.querySelectorAll('.edit-additional-edu').forEach((btn) => {
        btn.removeEventListener('click', btn._listener);
        const handler = () => {
            const id = btn.dataset.id;
            const edu = cvProfile.additionalEducation.find((e) => e.id === id);
            if (edu) {
                editingState.globalEditingId = id;
                document.getElementById('additionalEduId').value = edu.id;
                document.getElementById('additionalCourseName').value = edu.courseName;
                document.getElementById('additionalInstitution').value = edu.institution || '';
                const isPresent = edu.endDate === 'Present';
                setDateRangeSelectors('additional', edu.startDate, edu.endDate, isPresent);
                document.getElementById('additionalDescription').value = edu.description || '';
                document.getElementById('additionalCertificateUrl').value = edu.certificateUrl || '';

                const modal = document.getElementById('additionalEduModal');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        };
        btn._listener = handler;
        btn.addEventListener('click', handler);
    });

    document.querySelectorAll('.delete-additional-edu').forEach((btn) => {
        btn.removeEventListener('click', btn._deleteListener);
        const handler = () => {
            const id = btn.dataset.id;
            const edu = cvProfile.additionalEducation.find((e) => e.id === id);
            if (edu) {
                showConfirmModal(`Delete "${edu.courseName}"?`, () => {
                    cvProfile.additionalEducation = cvProfile.additionalEducation.filter((e) => e.id !== id);
                    document.getElementById('additionalEducationList').innerHTML = renderAdditionalEducationList(cvProfile.additionalEducation);
                    updateAndSave(cvProfile);
                    attachAdditionalEducationEvents(cvProfile);
                    showToast('Additional education deleted successfully!');
                });
            }
        };
        btn._deleteListener = handler;
        btn.addEventListener('click', handler);
    });
}
