/**
 * Shared helpers for admin settings pages.
 */
import authService from '../../services/authService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export function requireAdminUser() {
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return null;
    }

    return user;
}

export function bindAdminLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

export function renderAdminSettingsLayout({
    user,
    currentPath,
    title,
    description,
    headerActions = '',
    summaryCards = [],
    content,
}) {
    return `
        ${renderAppHeader(user, currentPath)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                <i class="fas fa-sliders-h text-purple-600 mr-3"></i>
                                ${title}
                            </h1>
                            <p class="text-gray-600">${description}</p>
                        </div>
                        ${headerActions}
                    </div>

                    ${renderSummaryCards(summaryCards)}
                    ${content}
                </div>
            </div>
        </div>
    `;
}

function renderSummaryCards(summaryCards) {
    if (!summaryCards || summaryCards.length === 0) {
        return '';
    }

    return `
        <div class="grid md:grid-cols-2 xl:grid-cols-${Math.min(summaryCards.length, 4)} gap-6 mb-8">
            ${summaryCards
                .map(
                    (card) => `
                <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                    <p class="text-sm text-gray-500 mb-1">${card.label}</p>
                    <p class="text-3xl font-bold ${card.valueClass || 'text-gray-800'}">${card.value}</p>
                    ${card.helperText ? `<p class="text-sm text-gray-500 mt-2">${card.helperText}</p>` : ''}
                </div>
            `
                )
                .join('')}
        </div>
    `;
}

export function renderSettingsActionLink(href, label, icon = 'fa-arrow-right') {
    return `
        <a href="${href}" data-link class="inline-flex items-center justify-center rounded-lg border-2 border-[#dd2c00] bg-white px-6 py-3 text-base font-semibold text-[#dd2c00] transition-all duration-200 hover:bg-[#dd2c00] hover:text-white text-center">
            <i class="fas ${icon} mr-2"></i>${label}
        </a>
    `;
}

export function formatTimestamp(value, fallback = 'Never') {
    if (!value) {
        return fallback;
    }

    return new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function capitalize(value) {
    return (
        String(value || '')
            .charAt(0)
            .toUpperCase() + String(value || '').slice(1)
    );
}

export function escapeAttribute(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function downloadGeneratedFile(fileName, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}
