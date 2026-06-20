/**
 * Admin Users Controller
 * Admin account management plus a platform user overview.
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminUsersController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const allUsers = await mockDataService.getAllUsers();
    const analytics = await mockDataService.getAnalytics();

    const state = {
        adminFilter: 'all',
        modalMode: null,
        editingAdminId: null,
        adminAccounts: [],
        adminRoles: [],
        allUsers: [],
        analytics: null,
    };

    await loadData();
    render();

    async function loadData() {
        const [adminAccounts, adminRoles, allUsers, analytics] = await Promise.all([
            mockDataService.getAdminAccounts(),
            mockDataService.getAdminRoles(),
            mockDataService.getAllUsers(),
            mockDataService.getAnalytics(),
        ]);

        state.adminAccounts = adminAccounts;
        state.adminRoles = adminRoles;
        state.allUsers = allUsers;
        state.analytics = analytics;
    }

    function render() {
        const roleMap = Object.fromEntries(state.adminRoles.map((role) => [role.id, role]));
        const visibleAdmins = state.adminAccounts.filter((admin) => {
            return state.adminFilter === 'all' || admin.status === state.adminFilter;
        });
        const activeAdmins = state.adminAccounts.filter(
            (admin) => admin.status === 'active'
        ).length;
        const invitedAdmins = state.adminAccounts.filter(
            (admin) => admin.status === 'invited'
        ).length;
        const deactivatedAdmins = state.adminAccounts.filter(
            (admin) => admin.status === 'deactivated'
        ).length;

        app.innerHTML = `
            ${renderAppHeader(user, window.location.pathname)}

            <div class="bg-gray-50 min-h-screen py-8">
                <div class="container mx-auto px-4">
                    <div class="fade-in">
                        <div class="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                            <div>
                                <h1 class="text-4xl font-bold text-gray-800 mb-2">
                                    <i class="fas fa-users-cog text-purple-600 mr-3"></i>
                                    Manage Admins
                                </h1>
                                <p class="text-gray-600">Create, edit, and manage admin access.</p>
                            </div>
                            <button type="button" id="openAdminModalBtn" class="btn btn-primary">
                                <i class="fas fa-user-plus mr-2"></i> Add Admin
                            </button>
                        </div>

                        <div class="grid md:grid-cols-4 gap-6 mb-8">
                            <div class="card bg-white">
                                <p class="text-sm text-gray-500 mb-1">Total Admins</p>
                                <p class="text-3xl font-bold text-gray-800">${state.adminAccounts.length}</p>
                            </div>
                            <div class="card bg-white">
                                <p class="text-sm text-gray-500 mb-1">Active Admins</p>
                                <p class="text-3xl font-bold text-green-600">${activeAdmins}</p>
                            </div>
                            <div class="card bg-white">
                                <p class="text-sm text-gray-500 mb-1">Pending Invites</p>
                                <p class="text-3xl font-bold text-yellow-600">${invitedAdmins}</p>
                            </div>
                            <div class="card bg-white">
                                <p class="text-sm text-gray-500 mb-1">Deactivated</p>
                                <p class="text-3xl font-bold text-red-600">${deactivatedAdmins}</p>
                            </div>
                        </div>

                        <div class="card mb-8">
                            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-800">Access Management</h2>
                                    <p class="text-gray-500 text-sm">Filter the current admin roster and update access state in place.</p>
                                </div>
                                <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
                                    <select id="adminStatusFilter" class="form-input sm:w-56">
                                        <option value="all" ${state.adminFilter === 'all' ? 'selected' : ''}>All statuses</option>
                                        <option value="active" ${state.adminFilter === 'active' ? 'selected' : ''}>Active</option>
                                        <option value="invited" ${state.adminFilter === 'invited' ? 'selected' : ''}>Invited</option>
                                        <option value="deactivated" ${state.adminFilter === 'deactivated' ? 'selected' : ''}>Deactivated</option>
                                    </select>
                                    <a href="/admin/settings/roles" data-link class="btn btn-secondary text-center">
                                        <i class="fas fa-shield-alt mr-2"></i> Roles & Permissions
                                    </a>
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table class="w-full data-table-min">
                                    <thead class="bg-gray-100 border-b-2 border-gray-300">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Admin</th>
                                            <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Role</th>
                                            <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                                            <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Last Login</th>
                                            <th class="px-4 py-3 text-right text-sm font-bold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${renderAdminTableRows(visibleAdmins, roleMap)}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="grid xl:grid-cols-5 gap-8 items-start">
                            <div class="xl:col-span-2 min-w-0 card">
                                <h2 class="text-2xl font-bold text-gray-800 mb-4">
                                    <i class="fas fa-key text-purple-600 mr-2"></i>
                                    Role Distribution
                                </h2>
                                <div class="space-y-3">
                                    ${renderRoleCards(state.adminRoles)}
                                </div>
                            </div>

                            <div class="xl:col-span-3 min-w-0 card">
                                <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 class="text-2xl font-bold text-gray-800">
                                            <i class="fas fa-table text-indigo-600 mr-2"></i>
                                            Platform User Overview
                                        </h2>
                                        <p class="text-gray-500 text-sm">Overview of all user accounts on the platform.</p>
                                    </div>
                                    <span class="text-sm text-gray-500">Total users: ${state.analytics.totalUsers}</span>
                                </div>
                                <div class="overflow-x-auto">
                                    <table class="w-full data-table-min">
                                        <thead class="bg-gray-100 border-b-2 border-gray-300">
                                            <tr>
                                                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">User</th>
                                                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Email</th>
                                                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Role</th>
                                                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${renderUsersTable(state.allUsers)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${renderAdminModal(state, state.adminRoles)}
        `;

        bindEvents();
    }

    function bindEvents() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => authService.logout());
        }

        const filter = document.getElementById('adminStatusFilter');
        if (filter) {
            filter.addEventListener('change', (event) => {
                state.adminFilter = event.target.value;
                render();
            });
        }

        const openAdminModalBtn = document.getElementById('openAdminModalBtn');
        if (openAdminModalBtn) {
            openAdminModalBtn.addEventListener('click', () => {
                state.modalMode = 'create';
                state.editingAdminId = null;
                render();
            });
        }

        const modalCloseButtons = document.querySelectorAll('[data-close-admin-modal]');
        modalCloseButtons.forEach((button) => {
            button.addEventListener('click', () => {
                state.modalMode = null;
                state.editingAdminId = null;
                render();
            });
        });

        const adminForm = document.getElementById('adminAccountForm');
        if (adminForm) {
            adminForm.addEventListener('submit', handleAdminSubmit);
        }

        document.querySelectorAll('[data-admin-action]').forEach((button) => {
            button.addEventListener('click', async (event) => {
                const action = event.currentTarget.getAttribute('data-admin-action');
                const adminId = event.currentTarget.getAttribute('data-admin-id');
                await handleAdminAction(action, adminId);
            });
        });
    }

    async function handleAdminSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            name: String(formData.get('name') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            adminRoleId: String(formData.get('adminRoleId') || 'operations_admin'),
            status: String(formData.get('status') || 'invited'),
            phone: String(formData.get('phone') || '').trim(),
            currentPosition: String(formData.get('currentPosition') || '').trim(),
        };

        if (state.modalMode === 'edit' && state.editingAdminId) {
            await mockDataService.updateAdminAccount(state.editingAdminId, payload);
        } else {
            await mockDataService.createAdminAccount(payload);
        }

        state.modalMode = null;
        state.editingAdminId = null;
        await loadData();
        render();
    }

    async function handleAdminAction(action, adminId) {
        if (action === 'edit') {
            state.modalMode = 'edit';
            state.editingAdminId = adminId;
            render();
            return;
        }

        if (action === 'deactivate') {
            await mockDataService.deactivateAdminAccount(adminId);
        }

        if (action === 'reactivate') {
            await mockDataService.reactivateAdminAccount(adminId);
        }

        await loadData();
        render();
    }
}

function renderAdminTableRows(admins, roleMap) {
    if (admins.length === 0) {
        return `
            <tr>
                <td colspan="5" class="px-4 py-10 text-center text-gray-500">No admins match the current filter.</td>
            </tr>
        `;
    }

    return admins
        .map((admin) => {
            const role = roleMap[admin.adminRoleId];
            const statusClass = getStatusClass(admin.status);
            const actionButton =
                admin.status === 'deactivated'
                    ? `<button type="button" data-admin-action="reactivate" data-admin-id="${admin.id}" class="text-green-600 hover:text-green-800 font-semibold">Reactivate</button>`
                    : `<button type="button" data-admin-action="deactivate" data-admin-id="${admin.id}" class="text-red-600 hover:text-red-800 font-semibold">Deactivate</button>`;

            return `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="px-4 py-4">
                        <div class="flex items-center gap-3">
                            <img src="${admin.avatar}" alt="${admin.name}" class="w-10 h-10 rounded-full border-2 border-gray-200" />
                            <div>
                                <p class="font-semibold text-gray-800">${admin.name}</p>
                                <p class="text-sm text-gray-500">${admin.email}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-4">
                        <p class="font-semibold text-gray-800">${role?.name || 'Admin'}</p>
                        <p class="text-sm text-gray-500">${admin.currentPosition || role?.description || 'Platform administrator'}</p>
                    </td>
                    <td class="px-4 py-4">
                        <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusClass}">
                            ${capitalize(admin.status)}
                        </span>
                    </td>
                    <td class="px-4 py-4 text-gray-600 text-sm">${formatTimestamp(admin.lastLoginAt)}</td>
                    <td class="px-4 py-4 text-right">
                        <div class="flex justify-end gap-4">
                            <button type="button" data-admin-action="edit" data-admin-id="${admin.id}" class="text-purple-600 hover:text-purple-800 font-semibold">Edit</button>
                            ${actionButton}
                        </div>
                    </td>
                </tr>
            `;
        })
        .join('');
}

function renderRoleCards(roles) {
    return roles
        .map(
            (role) => `
            <div class="border border-gray-200 rounded-xl p-4">
                <div class="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 class="font-bold text-gray-800">${role.name}</h3>
                        <p class="text-sm text-gray-500">${role.description}</p>
                    </div>
                    <span class="inline-flex w-fit flex-none self-start whitespace-nowrap px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">${role.memberCount} assigned</span>
                </div>
                <p class="text-xs uppercase tracking-wide text-gray-400 mb-2">Permissions</p>
                <p class="text-sm text-gray-600">${role.permissions.length} permissions enabled</p>
            </div>
        `
        )
        .join('');
}

function renderUsersTable(users) {
    const roleColors = {
        student: 'bg-blue-100 text-blue-800',
        alumni: 'bg-green-100 text-green-800',
        employer: 'bg-orange-100 text-orange-800',
        admin: 'bg-purple-100 text-purple-800',
    };

    return users
        .map(
            (entry) => `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                <td class="px-4 py-4">
                    <div class="flex items-center gap-3">
                        <img src="${entry.avatar}" alt="${entry.name}" class="w-10 h-10 rounded-full border-2 border-gray-200" />
                        <div>
                            <p class="font-semibold text-gray-800">${entry.name}</p>
                            ${entry.currentPosition ? `<p class="text-sm text-gray-500">${entry.currentPosition}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 text-gray-700">${entry.email}</td>
                <td class="px-4 py-4">
                    <span class="px-3 py-1 ${roleColors[entry.role] || 'bg-gray-100 text-gray-800'} rounded-full text-sm font-semibold capitalize">
                        ${entry.role}
                    </span>
                </td>
                <td class="px-4 py-4">
                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(entry.status || 'active')}">
                        ${capitalize(entry.status || 'active')}
                    </span>
                </td>
            </tr>
        `
        )
        .join('');
}

function renderAdminModal(state, roles) {
    if (!state.modalMode) {
        return '';
    }

    const editingAdmin = state.adminAccounts.find((admin) => admin.id === state.editingAdminId);
    const modalTitle = state.modalMode === 'edit' ? 'Edit Admin' : 'Invite Admin';
    const submitLabel = state.modalMode === 'edit' ? 'Save Changes' : 'Create Admin';

    return `
        <div class="modal-overlay px-4">
            <div class="modal-content modal-content-wide w-full">
                <div class="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">${modalTitle}</h2>
                        <p class="text-gray-500 text-sm mt-1">Update admin details and access settings.</p>
                    </div>
                    <button type="button" data-close-admin-modal class="text-gray-400 hover:text-gray-700 text-xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="adminAccountForm">
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="form-label">Full Name *</label>
                            <input type="text" name="name" required class="form-input" value="${escapeAttribute(editingAdmin?.name || '')}" />
                        </div>
                        <div>
                            <label class="form-label">Email *</label>
                            <input type="email" name="email" required class="form-input" value="${escapeAttribute(editingAdmin?.email || '')}" />
                        </div>
                        <div>
                            <label class="form-label">Admin Role *</label>
                            <select name="adminRoleId" class="form-input">
                                ${roles.map((role) => `<option value="${role.id}" ${editingAdmin?.adminRoleId === role.id ? 'selected' : ''}>${role.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Status *</label>
                            <select name="status" class="form-input">
                                <option value="invited" ${(editingAdmin?.status || 'invited') === 'invited' ? 'selected' : ''}>Invited</option>
                                <option value="active" ${(editingAdmin?.status || '') === 'active' ? 'selected' : ''}>Active</option>
                                <option value="deactivated" ${(editingAdmin?.status || '') === 'deactivated' ? 'selected' : ''}>Deactivated</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label class="form-label">Phone</label>
                            <input type="text" name="phone" class="form-input" value="${escapeAttribute(editingAdmin?.phone || '')}" />
                        </div>
                        <div>
                            <label class="form-label">Title</label>
                            <input type="text" name="currentPosition" class="form-input" value="${escapeAttribute(editingAdmin?.currentPosition || '')}" placeholder="e.g. Operations Admin" />
                        </div>
                    </div>

                    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button type="button" data-close-admin-modal class="btn btn-secondary text-center">Cancel</button>
                        <button type="submit" class="btn btn-primary text-center">${submitLabel}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function getStatusClass(status) {
    if (status === 'active') {
        return 'bg-green-100 text-green-800';
    }
    if (status === 'invited') {
        return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-red-100 text-red-800';
}

function formatTimestamp(value) {
    if (!value) {
        return 'Never signed in';
    }

    return new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function capitalize(value) {
    return (
        String(value || '')
            .charAt(0)
            .toUpperCase() + String(value || '').slice(1)
    );
}

function escapeAttribute(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
