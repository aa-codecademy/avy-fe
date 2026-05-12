import { editingState, setDateRangeSelectors, getDateFromSelectors } from '../profileHelpers.js';
import { renderAcademyList } from '../profileRenderer.js';
import { showConfirmModal } from '../profileModals.js';
import { handleCurrentCheckboxToggle, updateAndSave, showToast } from './shared.js';

export function setupAcademyEvents(cvProfile) {
    const modal = document.getElementById('academyModal');
    const form = document.getElementById('academyForm');

    document.getElementById('addAcademyBtn').addEventListener('click', () => {
        editingState.globalEditingId = null;
        form.reset();
        document.getElementById('academyId').value = '';
        const currentCheckbox = document.getElementById('academyCurrent');
        if (currentCheckbox) currentCheckbox.checked = false;
        if (document.getElementById('academyEndMonth')) document.getElementById('academyEndMonth').disabled = false;
        if (document.getElementById('academyEndYear')) document.getElementById('academyEndYear').disabled = false;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });

    document.getElementById('closeAcademyModal').addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    handleCurrentCheckboxToggle('academy');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isCurrent = document.getElementById('academyCurrent')?.checked || false;
        const startDate = getDateFromSelectors('academy', true, false);
        const endDate = isCurrent ? 'Present' : getDateFromSelectors('academy', false, false);

        const academy = {
            id: document.getElementById('academyId').value || Date.now().toString(),
            academyName: document.getElementById('academyName').value,
            track: document.getElementById('academyTrack').value,
            startDate: startDate,
            endDate: endDate,
            status: isCurrent ? 'In Progress' : 'Completed',
        };

        if (editingState.globalEditingId) {
            const index = cvProfile.academyAttendance.findIndex((acc) => acc.id === editingState.globalEditingId);
            if (index !== -1) {
                cvProfile.academyAttendance[index] = academy;
            }
            editingState.globalEditingId = null;
            showToast('Academy program updated successfully!');
        } else {
            cvProfile.academyAttendance.push(academy);
            showToast('Academy program added successfully!');
        }

        document.getElementById('academyList').innerHTML = renderAcademyList(cvProfile.academyAttendance);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        updateAndSave(cvProfile);
        attachAcademyEvents(cvProfile);
    });

    attachAcademyEvents(cvProfile);
}

function attachAcademyEvents(cvProfile) {
    document.querySelectorAll('.edit-academy').forEach((btn) => {
        btn.removeEventListener('click', btn._listener);
        const handler = () => {
            const id = btn.dataset.id;
            const academy = cvProfile.academyAttendance.find((acc) => acc.id === id);
            if (academy) {
                editingState.globalEditingId = id;
                document.getElementById('academyId').value = academy.id;
                document.getElementById('academyName').value = academy.academyName;
                document.getElementById('academyTrack').value = academy.track;
                const isPresent = academy.endDate === 'Present';
                setDateRangeSelectors('academy', academy.startDate, academy.endDate, isPresent);
                const modal = document.getElementById('academyModal');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        };
        btn._listener = handler;
        btn.addEventListener('click', handler);
    });

    document.querySelectorAll('.delete-academy').forEach((btn) => {
        btn.removeEventListener('click', btn._deleteListener);
        const handler = () => {
            const id = btn.dataset.id;
            const academy = cvProfile.academyAttendance.find((acc) => acc.id === id);
            if (academy) {
                showConfirmModal(`Delete "${academy.academyName}" - ${academy.track}?`, () => {
                    cvProfile.academyAttendance = cvProfile.academyAttendance.filter((acc) => acc.id !== id);
                    document.getElementById('academyList').innerHTML = renderAcademyList(cvProfile.academyAttendance);
                    updateAndSave(cvProfile);
                    attachAcademyEvents(cvProfile);
                    showToast('Academy program deleted successfully!');
                });
            }
        };
        btn._deleteListener = handler;
        btn.addEventListener('click', handler);
    });
}
