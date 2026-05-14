import { getYearOptions, getMonthOptions, renderDateRangeSelectors } from './profileHelpers.js';

export function addModalHTML() {
    if (document.getElementById('workExpModal')) return;

    const modalHTML = `
        <div id="settingsModalContainer" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                <h3 class="text-2xl font-bold mb-4">Profile Settings</h3>
                <div class="mb-4">
                    <label class="form-label">Profile Visibility</label>
                    <select id="settingsProfileVisibility" class="form-input">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div class="flex justify-end gap-3">
                    <button id="closeSettingsModalBtn" class="btn btn-secondary">Cancel</button>
                    <button id="saveSettingsModalBtn" class="btn btn-primary">Save Settings</button>
                </div>
            </div>
        </div>

        <div id="workExpModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <h3 class="text-2xl font-bold mb-4">Add Work Experience</h3>
                <form id="workExpForm">
                    <input type="hidden" id="workExpId">
                    <div class="mb-4"><label class="form-label">Position *</label><input type="text" id="workPosition" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Company/Organization *</label><input type="text" id="workCompany" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Period *</label>${renderDateRangeSelectors('work', '', '', true, false, true)}</div>
                    <div class="mb-4"><label class="form-label">Description</label><textarea id="workDescription" rows="3" class="form-input"></textarea></div>
                    <div class="mb-4"><label class="inline-flex items-center"><input type="checkbox" id="workIsVolunteering" class="mr-2"> This is volunteering work</label></div>
                    <div class="flex justify-end gap-3"><button type="button" id="closeWorkExpModal" class="btn btn-secondary">Cancel</button><button type="submit" class="btn btn-primary">Save Work Experience</button></div>
                </form>
            </div>
        </div>

        <div id="educationModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <h3 class="text-2xl font-bold mb-4">Add Education</h3>
                <form id="educationForm">
                    <input type="hidden" id="educationId">
                    <div class="mb-4"><label class="form-label">Degree *</label><input type="text" id="eduDegree" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Field of Study *</label><input type="text" id="eduField" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Institution *</label><input type="text" id="eduInstitution" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Period *</label>${renderDateRangeSelectors('edu', '', '', true, false, true)}</div>
                    <div class="mb-4"><label class="form-label">Grade/GPA</label><input type="text" id="eduGrade" class="form-input"></div>
                    <div class="flex justify-end gap-3"><button type="button" id="closeEducationModal" class="btn btn-secondary">Cancel</button><button type="submit" class="btn btn-primary">Save Education</button></div>
                </form>
            </div>
        </div>

        <div id="academyModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <h3 class="text-2xl font-bold mb-4">Add Avenga Academy Program</h3>
                <form id="academyForm">
                    <input type="hidden" id="academyId">
                    <div class="mb-4"><label class="form-label">Academy Name *</label><input type="text" id="academyName" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Track/Program *</label><input type="text" id="academyTrack" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Period *</label>${renderDateRangeSelectors('academy', '', '', true, false, true)}</div>
                    <div class="flex justify-end gap-3"><button type="button" id="closeAcademyModal" class="btn btn-secondary">Cancel</button><button type="submit" class="btn btn-primary">Save Academy Program</button></div>
                </form>
            </div>
        </div>

        <div id="additionalEduModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <h3 class="text-2xl font-bold mb-4">Add Additional Education / Training</h3>
                <form id="additionalEduForm">
                    <input type="hidden" id="additionalEduId">
                    <div class="mb-4"><label class="form-label">Course / Training Name *</label><input type="text" id="additionalCourseName" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Institution / Provider</label><input type="text" id="additionalInstitution" class="form-input"></div>
                    <div class="mb-4"><label class="form-label">Period *</label>${renderDateRangeSelectors('additional', '', '', true, false, true)}</div>
                    <div class="mb-4"><label class="form-label">Description</label><textarea id="additionalDescription" rows="3" class="form-input"></textarea></div>
                    <div class="mb-4"><label class="form-label">Certificate URL</label><input type="url" id="additionalCertificateUrl" class="form-input"></div>
                    <div class="flex justify-end gap-3"><button type="button" id="closeAdditionalEduModal" class="btn btn-secondary">Cancel</button><button type="submit" class="btn btn-primary">Save Training</button></div>
                </form>
            </div>
        </div>

        <div id="skillsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                <h3 class="text-2xl font-bold mb-4">Add Skill</h3>
                <form id="skillsForm">
                    <div class="mb-4"><label class="form-label">Skill Name *</label><input type="text" id="skillName" class="form-input" required></div>
                    <div class="flex justify-end gap-3"><button type="button" id="closeSkillsModal" class="btn btn-secondary">Cancel</button><button type="submit" class="btn btn-primary">Save Skill</button></div>
                </form>
            </div>
        </div>

        <div id="languageModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                <h3 class="text-2xl font-bold mb-4">Add Language</h3>
                <form id="languageForm">
                    <div class="mb-4"><label class="form-label">Language *</label><input type="text" id="languageName" class="form-input" required></div>
                    <div class="mb-4"><label class="form-label">Proficiency Level *</label>
                        <select id="languageLevel" class="form-input" required>
                            <option value="">Select level</option>
                            <option value="A1 (Beginner)">A1 (Beginner)</option>
                            <option value="A2 (Elementary)">A2 (Elementary)</option>
                            <option value="B1 (Intermediate)">B1 (Intermediate)</option>
                            <option value="B2 (Upper Intermediate)">B2 (Upper Intermediate)</option>
                            <option value="C1 (Advanced)">C1 (Advanced)</option>
                            <option value="C2 (Proficient)">C2 (Proficient)</option>
                            <option value="Native">Native</option>
                        </select>
                    </div>
                    <div class="flex justify-end gap-3"><button type="button" id="closeLanguageModal" class="btn btn-secondary">Cancel</button><button type="submit" class="btn btn-primary">Save Language</button></div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

export function showConfirmModal(message, onConfirm) {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modalDiv.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex justify-end gap-3">
                <button id="cancelDeleteBtn" class="btn btn-secondary">Cancel</button>
                <button id="confirmDeleteBtn" class="btn btn-danger bg-red-600 hover:bg-red-700">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => modalDiv.remove());
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => { modalDiv.remove(); onConfirm(); });
}
