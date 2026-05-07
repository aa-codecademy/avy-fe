import { saveCVToLocalStorage } from '../profileStorage.js';

export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

export function handleCurrentCheckboxToggle(prefix) {
    const checkbox = document.getElementById(`${prefix}Current`);
    if (!checkbox) return;
    checkbox.addEventListener('change', (e) => {
        const endMonth = document.getElementById(`${prefix}EndMonth`);
        const endYear = document.getElementById(`${prefix}EndYear`);
        const isChecked = e.target.checked;
        [endMonth, endYear].forEach(el => {
            if (el) {
                el.disabled = isChecked;
                if (isChecked) el.value = '';
            }
        });
    });
}

export function updateAndSave(cvProfile) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        saveCVToLocalStorage(currentUser.id, cvProfile);
    }
}
