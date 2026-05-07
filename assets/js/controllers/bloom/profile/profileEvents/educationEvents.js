import { editingState, setDateRangeSelectors, getDateFromSelectors } from '../profileHelpers.js';
import { renderEducationList } from '../profileRenderer.js';
import { showConfirmModal } from '../profileModals.js';
import { handleCurrentCheckboxToggle, updateAndSave, showToast } from './shared.js';

export function setupEducationEvents(cvProfile) {
    const modal = document.getElementById('educationModal');
    const form = document.getElementById('educationForm');

    document.getElementById('addEducationBtn').addEventListener('click', () => {
        editingState.globalEditingId = null;
        form.reset();
        document.getElementById('educationId').value = '';
        const currentCheckbox = document.getElementById('eduCurrent');
        if (currentCheckbox) currentCheckbox.checked = false;
        if (document.getElementById('eduEndMonth')) document.getElementById('eduEndMonth').disabled = false;
        if (document.getElementById('eduEndYear')) document.getElementById('eduEndYear').disabled = false;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });

    document.getElementById('closeEducationModal').addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    handleCurrentCheckboxToggle('edu');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isCurrent = document.getElementById('eduCurrent')?.checked || false;
        const startDate = getDateFromSelectors('edu', true);
        const endDate = getDateFromSelectors('edu', false, isCurrent);

        const education = {
            id: document.getElementById('educationId').value || Date.now().toString(),
            degree: document.getElementById('eduDegree').value,
            fieldOfStudy: document.getElementById('eduField').value,
            institution: document.getElementById('eduInstitution').value,
            startDate: startDate,
            endDate: endDate,
            grade: document.getElementById('eduGrade').value,
        };

        if (editingState.globalEditingId) {
            const index = cvProfile.education.findIndex((edu) => edu.id === editingState.globalEditingId);
            if (index !== -1) {
                cvProfile.education[index] = education;
            }
            editingState.globalEditingId = null;
            showToast('Education updated successfully!');
        } else {
            cvProfile.education.push(education);
            showToast('Education added successfully!');
        }

        document.getElementById('educationList').innerHTML = renderEducationList(cvProfile.education);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        updateAndSave(cvProfile);
        attachEducationEvents(cvProfile);
    });

    attachEducationEvents(cvProfile);
}

function attachEducationEvents(cvProfile) {
    document.querySelectorAll('.edit-education').forEach((btn) => {
        btn.removeEventListener('click', btn._listener);
        const handler = () => {
            const id = btn.dataset.id;
            const education = cvProfile.education.find((edu) => edu.id === id);
            if (education) {
                editingState.globalEditingId = id;
                document.getElementById('educationId').value = education.id;
                document.getElementById('eduDegree').value = education.degree;
                document.getElementById('eduField').value = education.fieldOfStudy;
                document.getElementById('eduInstitution').value = education.institution;
                const isPresent = education.endDate === 'Present';
                setDateRangeSelectors('edu', education.startDate, education.endDate, isPresent);
                document.getElementById('eduGrade').value = education.grade || '';

                const modal = document.getElementById('educationModal');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        };
        btn._listener = handler;
        btn.addEventListener('click', handler);
    });

    document.querySelectorAll('.delete-education').forEach((btn) => {
        btn.removeEventListener('click', btn._deleteListener);
        const handler = () => {
            const id = btn.dataset.id;
            const education = cvProfile.education.find((edu) => edu.id === id);
            if (education) {
                showConfirmModal(`Delete "${education.degree}" from ${education.institution}?`, () => {
                    cvProfile.education = cvProfile.education.filter((edu) => edu.id !== id);
                    document.getElementById('educationList').innerHTML = renderEducationList(cvProfile.education);
                    updateAndSave(cvProfile);
                    attachEducationEvents(cvProfile);
                    showToast('Education deleted successfully!');
                });
            }
        };
        btn._deleteListener = handler;
        btn.addEventListener('click', handler);
    });
}
