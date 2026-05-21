/**
 * Notification Service
 * Handles three delivery channels for real-time alerts:
 *   1. In-app toasts
 *   2. Desktop (Web Notifications API)
 *   3. Email (EmailJS – configure constants below)
 */

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 – TOAST NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

const TOAST_DURATION_MS = 5000;

const TOAST_COLORS = {
    info:    'bg-indigo-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error:   'bg-red-600',
};

const TOAST_ICONS = {
    info:    'fa-bell',
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error:   'fa-times-circle',
};

function ensureToastContainer() {
    let el = document.getElementById('avy-toast-container');
    if (!el) {
        el = document.createElement('div');
        el.id = 'avy-toast-container';
        el.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(el);
    }
    return el;
}

/**
 * Show a toast notification.
 * @param {string} title
 * @param {string} [message]
 * @param {'info'|'success'|'warning'|'error'} [type='info']
 * @param {string|null} [link] - Optional SPA route to navigate to when the toast is clicked
 */
export function showToast(title, message = '', type = 'info', link = null) {
    const container = ensureToastContainer();
    const color = TOAST_COLORS[type] ?? TOAST_COLORS.info;
    const icon  = TOAST_ICONS[type]  ?? TOAST_ICONS.info;

    const toast = document.createElement('div');
    toast.className = [
        'pointer-events-auto flex items-start gap-3',
        color,
        'text-white rounded-xl shadow-2xl px-4 py-3 max-w-sm w-full',
        'translate-x-full opacity-0 transition-all duration-300 ease-out',
    ].join(' ');

    toast.innerHTML = `
        <i class="fas ${icon} mt-0.5 shrink-0 text-base"></i>
        <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm leading-tight">${title}</p>
            ${message ? `<p class="text-xs opacity-90 mt-0.5 leading-snug">${message}</p>` : ''}
            ${link ? `<p class="text-xs opacity-75 mt-1 font-medium underline underline-offset-2">View &rarr;</p>` : ''}
        </div>
        <button class="toast-close shrink-0 opacity-75 hover:opacity-100 ml-1 leading-none">
            <i class="fas fa-times text-xs"></i>
        </button>
    `;

    if (link) toast.style.cursor = 'pointer';

    container.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }));

    const dismiss = () => {
        toast.classList.add('translate-x-full', 'opacity-0');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    };

    const timer = setTimeout(dismiss, TOAST_DURATION_MS);

    toast.querySelector('.toast-close').addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(timer);
        dismiss();
    });

    if (link) {
        toast.addEventListener('click', (e) => {
            if (e.target.closest('.toast-close')) return;
            clearTimeout(timer);
            dismiss();
            window.router?.navigate(link);
        });
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 – DESKTOP (WEB) NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Request permission to show desktop notifications.
 * Requires HTTPS or localhost — plain HTTP on a LAN IP will silently fail.
 * @returns {Promise<'granted'|'denied'|'default'|'unsupported'>}
 */
export async function requestDesktopPermission() {
    if (!('Notification' in window)) {
        console.warn('[NotificationService] Desktop notifications not supported in this browser.');
        return 'unsupported';
    }
    if (!window.isSecureContext) {
        console.warn(
            '[NotificationService] Desktop notifications require HTTPS or localhost.\n' +
            `Current origin "${location.origin}" is not secure.\n` +
            'Fix: open the app at http://localhost:PORT, or enable the flag at\n' +
            'chrome://flags/#unsafely-treat-insecure-origin-as-secure'
        );
        return 'unsupported';
    }
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    return Notification.requestPermission();
}

/**
 * Show a native desktop notification.
 * @param {string} title
 * @param {string} body
 */
export function showDesktopNotification(title, body) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const n = new Notification(title, {
        body,
        icon: '/assets/img/favicon.svg',
        badge: '/assets/img/favicon.svg',
    });
    // Auto-close after 6 seconds
    setTimeout(() => n.close(), 6000);
}


// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 – EMAIL NOTIFICATIONS (EmailJS)
// ─────────────────────────────────────────────────────────────────────────────
//
// Setup instructions:
//   1. Create a free account at https://www.emailjs.com/
//   2. Add an Email Service (Gmail, Outlook, etc.) → copy its Service ID
//   3. Create an Email Template with variables:
//        {{to_name}}, {{to_email}}, {{subject}}, {{message}}
//      → copy the Template ID
//   4. Go to Account → API Keys → copy your Public Key
//   5. Replace the three constants below with your real values.
//
// The CDN script must be present in index.html:
//   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>

const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';    // e.g. 'user_abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';    // e.g. 'service_xxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';   // e.g. 'template_xxxx'

let _emailJSReady = false;

/**
 * Initialize EmailJS. Called once at app startup from main.js.
 */
export function initEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.warn(
            '[NotificationService] EmailJS not loaded — add the CDN <script> to index.html.\n' +
            'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
        );
        return;
    }
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.info('[NotificationService] EmailJS CDN loaded but not configured yet (placeholder keys). Emails will be skipped.');
        return;
    }
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    _emailJSReady = true;
    console.info('[NotificationService] EmailJS ready.');
}

/**
 * Send a notification email via EmailJS.
 * Silently skips if EmailJS is not configured.
 * @param {string} toEmail
 * @param {string} toName
 * @param {string} subject
 * @param {string} message
 */
export async function sendNotificationEmail(toEmail, toName, subject, message) {
    if (!_emailJSReady || typeof emailjs === 'undefined') {
        console.info('[NotificationService] Email skipped (not configured):', { toEmail, subject, message });
        return;
    }
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: toEmail,
            to_name:  toName,
            subject,
            message,
        });
        console.info('[NotificationService] Email sent to', toEmail);
    } catch (err) {
        console.warn('[NotificationService] Email send failed:', err);
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// COMBINED DISPATCH
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Deliver a new notification across all three channels.
 * @param {{ title: string, message: string }} notification
 * @param {{ id: string, email?: string, name?: string }} user
 */
export async function dispatchNewNotification(notification, user) {
    // 1. Toast (clicking navigates to the notification's link)
    showToast(notification.title, notification.message, 'info', notification.link || null);

    // 2. Desktop push
    showDesktopNotification(notification.title, notification.message);

    // 3. Email
    if (user?.email) {
        await sendNotificationEmail(
            user.email,
            user.name || 'User',
            `[Avy] ${notification.title}`,
            notification.message
        );
    }
}
