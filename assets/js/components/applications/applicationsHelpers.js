import languageService from '../../services/languageService.js';

export function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const lang = languageService.getCurrentLanguage();
    const localeMap = {
        en: 'en-US',
        mk: 'mk-MK',
        sq: 'sq-AL',
    };
    const locale = localeMap[lang] || 'en-US';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getProgressByStatus(status) {
    const progressMap = {
        pending: 25,
        under_review: 50,
        interview: 75,
        accepted: 100,
        rejected: 100,
        declined: 100,
        withdrawn: 100,
    };
    return progressMap[status] || 25;
}

export function renderStatusBadge(status, t) {
    const statusConfig = {
        pending: {
            label: t ? t('applications.pending') : 'Pending',
            class: 'bg-yellow-100 text-yellow-800',
            icon: 'fa-clock',
        },
        under_review: {
            label: t ? t('applications.underReview') : 'Under Review',
            class: 'bg-blue-100 text-blue-800',
            icon: 'fa-eye',
        },
        interview: {
            label: t ? t('applications.interview') : 'Interview',
            class: 'bg-purple-100 text-purple-800',
            icon: 'fa-comments',
        },
        accepted: {
            label: t ? t('applications.accepted') : 'Accepted!',
            class: 'bg-green-100 text-green-800',
            icon: 'fa-check-circle',
        },
        rejected: {
            label: t ? t('applications.rejected') : 'Rejected',
            class: 'bg-red-100 text-red-800',
            icon: 'fa-times-circle',
        },
        declined: {
            label: t ? t('applications.declined') : 'Cancelled',
            class: 'bg-gray-100 text-gray-700',
            icon: 'fa-user-slash',
        },
        withdrawn: {
            label: t ? t('applications.declined') : 'Withdrawn',
            class: 'bg-gray-100 text-gray-700',
            icon: 'fa-user-slash',
        },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}">
            <i class="fas ${config.icon} mr-1 text-xs"></i> ${config.label}
        </span>
    `;
}

export function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className =
        'custom-toast fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium fade-in';
    toast.style.backgroundColor =
        type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1';
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
