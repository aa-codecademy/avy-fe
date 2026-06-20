const BACK_TO_TOP_THRESHOLD = 280;
const HIDDEN_CLASSES = ['opacity-0', 'translate-y-4', 'pointer-events-none'];
const VISIBLE_CLASSES = ['opacity-100', 'translate-y-0', 'pointer-events-auto'];

let backToTopBound = false;
let backToTopButton = null;

function setBackToTopVisibility(isVisible) {
    if (!backToTopButton) {
        return;
    }

    HIDDEN_CLASSES.forEach((className) => {
        backToTopButton.classList.toggle(className, !isVisible);
    });
    VISIBLE_CLASSES.forEach((className) => {
        backToTopButton.classList.toggle(className, isVisible);
    });

    backToTopButton.setAttribute('aria-hidden', String(!isVisible));
}

function updateBackToTopVisibility() {
    setBackToTopVisibility(window.scrollY > BACK_TO_TOP_THRESHOLD);
}

function ensureBackToTopButton() {
    backToTopButton = document.getElementById('backToTopBtn');
    if (backToTopButton) {
        updateBackToTopVisibility();
        return backToTopButton;
    }

    backToTopButton = document.createElement('button');
    backToTopButton.id = 'backToTopBtn';
    backToTopButton.type = 'button';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('aria-hidden', 'true');
    backToTopButton.className =
        'fixed bottom-4 right-4 z-[1100] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 sm:bottom-6 sm:right-6 sm:px-5 opacity-0 translate-y-4 pointer-events-none';
    backToTopButton.innerHTML = `
        <i class="fas fa-arrow-up text-sm"></i>
        <span class="hidden sm:inline">Back to top</span>
    `;
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(backToTopButton);
    updateBackToTopVisibility();

    return backToTopButton;
}

export function initAppBackToTop() {
    if (backToTopBound || typeof document === 'undefined') {
        return;
    }

    if (!document.body) {
        document.addEventListener('DOMContentLoaded', initAppBackToTop, { once: true });
        return;
    }

    backToTopBound = true;
    ensureBackToTopButton();
    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
}
