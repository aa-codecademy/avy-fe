import mockDataService from '../services/mockDataService.js';
import { showToast } from '../components/applications/applicationsHelpers.js';
import languageService from '../services/languageService.js';

function showWithdrawConfirmModal(application, onConfirm) {
    const t = (key) => languageService.translate(key);
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText =
        'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';

    modalOverlay.innerHTML = `
        <div style="background: white; border-radius: 0.75rem; padding: 2rem; max-width: 450px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="width: 60px; height: 60px; background: #FEE2E2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #DD2C00;"></i>
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #2d3748; margin-bottom: 0.5rem;">${t('modals.cancelApplicationTitle')}</h3>
                <p style="color: #718096;">
                    ${t('modals.cancelApplicationQuestion')}<br>
                    <strong style="color: #DD2C00;">${escapeHtml(application.jobTitle)}</strong><br>
                    at <strong>${escapeHtml(application.companyName)}</strong>?
                </p>
                <p style="font-size: 0.875rem; color: #DD2C00; margin-top: 0.75rem;">
                    <i class="fas fa-info-circle"></i> ${t('modals.cancelApplicationWarning')}
                </p>
            </div>
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                <button class="modal-cancel-btn" style="background: white; color: #DD2C00; border: 2px solid #DD2C00; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">${t('modals.noKeepIt')}</button>
                <button class="modal-confirm-btn" style="background: #DD2C00; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">${t('modals.yesCancelApplication')}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeModal = () => modalOverlay.remove();

    modalOverlay.querySelector('.modal-cancel-btn').addEventListener('click', () => {
        closeModal();
    });

    modalOverlay.querySelector('.modal-confirm-btn').addEventListener('click', async () => {
        closeModal();
        await onConfirm();
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

export async function handleWithdraw(application, user, companyEmail, refreshCallback) {
    showWithdrawConfirmModal(application, async () => {
        try {
            await mockDataService.updateApplicationStatus(
                application.id,
                'declined',
                'Application cancelled by student'
            );
            await mockDataService.withdrawApplication(application.id);

            await mockDataService.sendNotification(
                user.email,
                'Student',
                'Application Cancelled',
                `You have successfully cancelled your application for ${application.jobTitle} at ${application.companyName}. The status has been updated to "Declined" on your profile.`
            );

            await mockDataService.sendNotification(
                companyEmail || application.companyEmail,
                'Company',
                'Candidate Cancelled Application',
                `The student ${user.name || user.email} has cancelled their application for the position "${application.jobTitle}".`
            );

            application.status = 'declined';

            showToast(`Application for "${application.jobTitle}" has been cancelled`, 'success');

            if (refreshCallback) refreshCallback();
        } catch (error) {
            console.error('Withdraw failed:', error);
            showToast(`Failed to cancel application for "${application.jobTitle}"`, 'error');
        }
    });
}
