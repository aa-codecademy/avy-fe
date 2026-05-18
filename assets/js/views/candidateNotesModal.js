export function addCandidateNotesModal() {
    if (document.getElementById('candidateNotesModal')) return;

    const modalHTML = `
    <div id="candidateNotesModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 id="candidateNotesModalTitle" class="text-2xl font-bold mb-4">Candidate Notes</h3>
            <div id="candidateNotesMeta" class="text-sm text-gray-600 mb-3"></div>
            <div class="mb-4">
                <textarea id="candidateNotesTextarea" rows="8" class="form-input w-full" placeholder="Add internal notes visible to your company team only"></textarea>
            </div>
            <div class="flex justify-end gap-3">
                <button type="button" id="closeCandidateNotesModal" class="btn btn-secondary">Cancel</button>
                <button type="button" id="saveCandidateNotesBtn" class="btn btn-primary">Save Note</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const closeBtn = document.getElementById('closeCandidateNotesModal');
    closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('candidateNotesModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    });
}

export function openCandidateNotesModal(application = {}, canEdit = false, onSave = null) {
    addCandidateNotesModal();
    const modal = document.getElementById('candidateNotesModal');
    const textarea = document.getElementById('candidateNotesTextarea');
    const metaDiv = document.getElementById('candidateNotesMeta');
    const saveBtn = document.getElementById('saveCandidateNotesBtn');

    textarea.value = application.notes || '';
    const author = application.notesAuthorName || '';
    const updatedAt = application.notesUpdatedAt
        ? new Date(application.notesUpdatedAt).toLocaleString()
        : '';
    metaDiv.textContent = author
        ? `Last edited by ${author}${updatedAt ? ' • ' + updatedAt : ''}`
        : updatedAt
          ? `Last updated ${updatedAt}`
          : 'No notes yet';

    saveBtn.disabled = !canEdit;
    if (!canEdit) {
        saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
        saveBtn.setAttribute('aria-disabled', 'true');
    } else {
        saveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        saveBtn.removeAttribute('aria-disabled');
    }

    saveBtn.onclick = async (e) => {
        e.preventDefault();
        if (!canEdit) return;
        const noteText = textarea.value || '';
        if (onSave && typeof onSave === 'function') {
            await onSave(noteText);
        }
        modal.classList.add('hidden');
        modal.style.display = 'none';
    };

    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
