import { editingState } from '../profileHelpers.js';
import { renderSkillsList } from '../profileRenderer.js';
import { showConfirmModal } from '../profileModals.js';
import { updateAndSave, showToast } from './shared.js';

export function setupSkillsEvents(cvProfile) {
    const modal = document.getElementById('skillsModal');
    const form = document.getElementById('skillsForm');

    document.getElementById('addSkillBtn').addEventListener('click', () => {
        editingState.globalSkillEditingIndex = -1;
        form.reset();
        document.getElementById('skillName').value = '';
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });

    document.getElementById('closeSkillsModal').addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const skillName = document.getElementById('skillName').value.trim();

        if (skillName === '') {
            showToast('Please enter a skill name', 'error');
            return;
        }

        if (editingState.globalSkillEditingIndex >= 0) {
            cvProfile.skills[editingState.globalSkillEditingIndex] = skillName;
            editingState.globalSkillEditingIndex = -1;
            showToast('Skill updated successfully!');
        } else {
            if (!cvProfile.skills.includes(skillName)) {
                cvProfile.skills.push(skillName);
                showToast('Skill added successfully!');
            } else {
                showToast('This skill already exists!', 'error');
                return;
            }
        }

        document.getElementById('skillsList').innerHTML = renderSkillsList(cvProfile.skills);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('skillName').value = '';
        updateAndSave(cvProfile);
        attachSkillsEvents(cvProfile);
    });

    attachSkillsEvents(cvProfile);
}

function attachSkillsEvents(cvProfile) {
    document.querySelectorAll('.edit-skill').forEach((btn) => {
        btn.removeEventListener('click', btn._listener);
        const handler = () => {
            const index = parseInt(btn.dataset.index);
            const skill = cvProfile.skills[index];
            if (skill) {
                editingState.globalSkillEditingIndex = index;
                document.getElementById('skillName').value = skill;
                const modal = document.getElementById('skillsModal');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        };
        btn._listener = handler;
        btn.addEventListener('click', handler);
    });

    document.querySelectorAll('.delete-skill').forEach((btn) => {
        btn.removeEventListener('click', btn._deleteListener);
        const handler = () => {
            const index = parseInt(btn.dataset.index);
            const skillName = cvProfile.skills[index];
            showConfirmModal(`Delete "${skillName}"?`, () => {
                cvProfile.skills.splice(index, 1);
                document.getElementById('skillsList').innerHTML = renderSkillsList(cvProfile.skills);
                updateAndSave(cvProfile);
                attachSkillsEvents(cvProfile);
                showToast('Skill deleted successfully!');
            });
        };
        btn._deleteListener = handler;
        btn.addEventListener('click', handler);
    });
}
