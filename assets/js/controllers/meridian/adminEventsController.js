import authService from '../../services/authService.js';
import eventService from '../../services/eventService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminEventsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.location.navigate('/dashboard');
        return;
    }

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        Events Controller
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}
