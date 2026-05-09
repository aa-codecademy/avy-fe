class ModalService {
    renderModal(title) {
        const modal = document.createElement('div');
        modal.id = 'modal-body';
        modal.className = 'fixed inset-0 bg-black/50 z-40 flex items-center justify-center fade-in';

        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl z-50 w-full max-w-2xl mx-4 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between">
                    <div id="modal-title" class="text-xl font-bold text-gray-800">${title}</div>
                    <button id="modal-close-button" class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"><i class="fas fa-xmark text-xl"></i></button>
                </div>

                <div id="modal-content"></div>
            </div>
        `;

        const closeButton = modal.querySelector('#modal-close-button');
        closeButton.addEventListener('click', () => this.closeModal());

        return modal;
    }

    closeModal() {
        const modal = document.getElementById('modal-body');
        if (modal) modal.remove();
    }
}

export default new ModalService();
