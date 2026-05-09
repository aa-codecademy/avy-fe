/**
 * Admin Role Permissions Controller
 * Manage admin roles and permission assignments.
 */
import mockDataService from '../../services/mockDataService.js';
import {
    bindAdminLogout,
    renderAdminSettingsLayout,
    renderSettingsActionLink,
    requireAdminUser,
} from './adminSettingsShared.js';

export default async function adminRolePermissionsController() {
    const app = document.getElementById('app');
    const user = requireAdminUser();

    if (!user) {
        return;
    }

    const state = {
        selectedRoleId: '',
        adminRoles: [],
        permissionCatalog: [],
    };

    await loadData();
    render();

    async function loadData() {
        const [adminRoles, permissionCatalog] = await Promise.all([
            mockDataService.getAdminRoles(),
            mockDataService.getPermissionCatalog(),
        ]);

        state.adminRoles = adminRoles;
        state.permissionCatalog = permissionCatalog;

        if (!state.selectedRoleId && adminRoles.length > 0) {
            state.selectedRoleId = adminRoles[0].id;
        }
    }

    function render() {
        const selectedRole =
            state.adminRoles.find((role) => role.id === state.selectedRoleId) ||
            state.adminRoles[0];
        const enabledPermissionCount = selectedRole?.permissions.length || 0;

        app.innerHTML = renderAdminSettingsLayout({
            user,
            currentPath: window.location.pathname,
            title: 'Role and Permission Configuration',
            description: 'Choose an admin role and adjust the actions it can perform.',
            headerActions: renderSettingsActionLink(
                '/admin/users',
                'Manage Admins',
                'fa-users-cog'
            ),
            summaryCards: [
                {
                    label: 'Admin Roles',
                    value: state.adminRoles.length,
                },
                {
                    label: 'Selected Role Permissions',
                    value: enabledPermissionCount,
                    valueClass: 'text-purple-600',
                    helperText: selectedRole?.name || 'No role selected',
                },
            ],
            content: `
                <div class="card">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">Permission Matrix</h2>
                            <p class="text-gray-500 text-sm">Changes take effect across the admin area immediately.</p>
                        </div>
                        <select id="selectedRoleId" class="form-input lg:w-72">
                            ${state.adminRoles.map((role) => `<option value="${role.id}" ${role.id === selectedRole?.id ? 'selected' : ''}>${role.name}</option>`).join('')}
                        </select>
                    </div>

                    <form id="rolePermissionsForm">
                        <div class="grid lg:grid-cols-2 gap-6 mb-6">
                            ${renderPermissionGroups(state.permissionCatalog, selectedRole)}
                        </div>
                        <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <p class="font-semibold text-purple-900">${selectedRole?.name || 'Selected role'}</p>
                                <p class="text-sm text-purple-800">${selectedRole?.description || ''}</p>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save mr-2"></i> Save Permissions
                            </button>
                        </div>
                    </form>
                </div>
            `,
        });

        bindEvents();
    }

    function bindEvents() {
        bindAdminLogout();

        const selectedRoleInput = document.getElementById('selectedRoleId');
        if (selectedRoleInput) {
            selectedRoleInput.addEventListener('change', (event) => {
                state.selectedRoleId = event.target.value;
                render();
            });
        }

        const rolePermissionsForm = document.getElementById('rolePermissionsForm');
        if (rolePermissionsForm) {
            rolePermissionsForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);
                const permissions = formData.getAll('permissionIds').map((value) => String(value));

                await mockDataService.updateAdminRolePermissions(state.selectedRoleId, permissions);
                await loadData();
                render();
            });
        }
    }
}

function renderPermissionGroups(permissionCatalog, selectedRole) {
    const groupedPermissions = permissionCatalog.reduce((groups, permission) => {
        if (!groups[permission.group]) {
            groups[permission.group] = [];
        }

        groups[permission.group].push(permission);
        return groups;
    }, {});

    return Object.entries(groupedPermissions)
        .map(
            ([groupName, permissions]) => `
                <div class="border border-gray-200 rounded-xl p-5">
                    <h3 class="text-lg font-bold text-gray-800 mb-3">${groupName}</h3>
                    <div class="space-y-3">
                        ${permissions
                            .map(
                                (permission) => `
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" name="permissionIds" value="${permission.id}" class="mt-1" ${selectedRole?.permissions.includes(permission.id) ? 'checked' : ''} />
                                <span>
                                    <span class="block font-medium text-gray-800">${permission.label}</span>
                                    <span class="block text-sm text-gray-500">${permission.id}</span>
                                </span>
                            </label>
                        `
                            )
                            .join('')}
                    </div>
                </div>
            `
        )
        .join('');
}
