/**
 * Notifications Controller (Student/Alumni/Employer/Admin)
 * In-app notifications list.
 *
 * User story: "Personalized notifications"
 *
 * Available mock service methods:
 *  - mockDataService.getNotifications(userId, { unreadOnly })
 *  - mockDataService.getUnreadCount(userId)
 *  - mockDataService.markNotificationAsRead(id)
 *  - mockDataService.markAllAsRead(userId)
 */
import authService from '../../services/authService.js';
import { renderAppHeader } from '../../views/appHeader.js';
import mockDataService from '../../services/mockDataService.js';

const NOTIFICATION_CATEGORIES = [
  { key: 'messages', label: 'Messages' },
  { key: 'interviewInvites', label: 'Interview invites' },
  { key: 'applicationStatus', label: 'Application status' },
  { key: 'successfulApplication', label: 'Successful application' },
  { key: 'passwordChange', label: 'Password change' },
];

export default async function notificationsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user) {
        window.router.navigate('/login');
        return;
    }

  // load saved preferences (service must provide this)
  const preferences = await mockDataService.getNotificationPreferences(user.id);
  // work on a local draft so modal doesn't autosave
  const draft = structuredClone(preferences);

    // TODO (student task): list notifications, support mark-as-read and filter by type
    // const notifications = await mockDataService.getNotifications(user.id);

     app.innerHTML = `
    ${renderAppHeader(user, window.location.pathname)}
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4">
        <div class="fade-in">
          <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-4xl font-bold text-gray-800 mb-2">
                <i class="fas fa-bell text-purple-600 mr-3"></i>
                Notifications
              </h1>
              <p class="text-gray-600">Stay up to date on your activity</p>
            </div>

            <button id="openNotificationSettings" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-purple-400 hover:text-purple-600 transition">
              <i class="fas fa-sliders-h mr-2"></i> Notification settings
            </button>
          </div>

          <div class="card text-center py-16">
            <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-600 mb-2">TODO: Notifications list</h3>
            <p class="text-gray-500">Implement notification feed, mark-as-read, and filtering.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal (hidden by default) -->
    <div id="notificationSettingsModal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">Notification settings</h2>
            <p class="text-gray-600 text-sm">Choose what notifications you receive and where you receive them.</p>
          </div>
          <button id="closeNotificationSettings" class="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"><i class="fas fa-times"></i></button>
        </div>

        <div class="p-6">
          <div class="hidden md:grid md:grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-semibold text-gray-500">
            <div class="col-span-4">What</div>
            <div class="col-span-2">Receive</div>
            <div class="col-span-6">Where</div>
          </div>

          <div class="divide-y divide-gray-100">
            ${NOTIFICATION_CATEGORIES.map(({ key, label }) => {
              const v = preferences[key] || { enabled: true, channel: 'browser' };
              return `
                <div class="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start md:items-center">
                  <div class="md:col-span-4"><p class="font-medium text-gray-800">${label}</p></div>
                  <div class="md:col-span-2">
                    <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" class="pref-enabled accent-purple-600" data-key="${key}" ${v.enabled ? 'checked' : ''}/>
                      On
                    </label>
                  </div>
                  <div class="md:col-span-6">
                    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6">
                      <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input type="radio" name="channel-${key}" value="browser" class="pref-channel accent-purple-600" data-key="${key}" ${v.channel === 'browser' ? 'checked' : ''} ${!v.enabled ? 'disabled' : ''}/> Browser
                      </label>
                      <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input type="radio" name="channel-${key}" value="email" class="pref-channel accent-purple-600" data-key="${key}" ${v.channel === 'email' ? 'checked' : ''} ${!v.enabled ? 'disabled' : ''}/> Email
                      </label>
                      <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input type="radio" name="channel-${key}" value="both" class="pref-channel accent-purple-600" data-key="${key}" ${v.channel === 'both' ? 'checked' : ''} ${!v.enabled ? 'disabled' : ''}/> Both
                      </label>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- footer actions -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button id="cancelNotificationSettings" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</button>
          <button id="saveNotificationSettings" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Save changes</button>
        </div>
      </div>
    </div>
  `;

  // logout handling
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

  // modal controls
  const modal = document.getElementById('notificationSettingsModal');
  const openBtn = document.getElementById('openNotificationSettings');
  const closeBtn = document.getElementById('closeNotificationSettings');
  const cancelBtn = document.getElementById('cancelNotificationSettings');
  const saveBtn = document.getElementById('saveNotificationSettings');

  function openModal() { modal.classList.remove('hidden'); modal.classList.add('flex'); }
  function closeModal() { modal.classList.add('hidden'); modal.classList.remove('flex'); }

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  // draft is already defined above; update it on input changes but do not save yet
  document.querySelectorAll('.pref-enabled').forEach((input) => {
    input.addEventListener('change', (e) => {
      const k = e.target.dataset.key;
      draft[k].enabled = !!e.target.checked;
      // enable/disable radios visually
      document.querySelectorAll(`input[name="channel-${k}"]`).forEach(r => r.disabled = !draft[k].enabled);
    });
  });

  document.querySelectorAll('.pref-channel').forEach((input) => {
    input.addEventListener('change', (e) => {
      const k = e.target.dataset.key;
      draft[k].channel = e.target.value;
    });
  });

  // save only when user presses Save
  saveBtn?.addEventListener('click', async () => {
    await mockDataService.updateNotificationPreferences(user.id, draft);
    closeModal();
  });
}