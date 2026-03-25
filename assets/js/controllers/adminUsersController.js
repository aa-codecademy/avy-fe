/**
 * Admin Users Controller
 * User management dashboard for administrators
 */
import authService from '../services/authService.js';
import mockDataService from '../services/mockDataService.js';
import { renderAppHeader } from '../views/appHeader.js';

export default async function adminUsersController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }
    
    const allUsers = await mockDataService.getAllUsers();
    const analytics = await mockDataService.getAnalytics();
    
    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <!-- Page Header -->
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-users-cog text-purple-600 mr-3"></i>
                            User Management
                        </h1>
                        <p class="text-gray-600">Manage all platform users</p>
                    </div>
                    
                    <!-- Stats Cards -->
                    <div class="grid md:grid-cols-4 gap-6 mb-8">
                        <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-blue-100 mb-1">Total Users</p>
                                    <h3 class="text-3xl font-bold">${analytics.totalUsers}</h3>
                                </div>
                                <i class="fas fa-users text-4xl text-blue-200"></i>
                            </div>
                        </div>
                        
                        <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-green-100 mb-1">Students</p>
                                    <h3 class="text-3xl font-bold">${allUsers.filter(u => u.role === 'student').length}</h3>
                                </div>
                                <i class="fas fa-user-graduate text-4xl text-green-200"></i>
                            </div>
                        </div>
                        
                        <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-purple-100 mb-1">Alumni</p>
                                    <h3 class="text-3xl font-bold">${allUsers.filter(u => u.role === 'alumni').length}</h3>
                                </div>
                                <i class="fas fa-graduation-cap text-4xl text-purple-200"></i>
                            </div>
                        </div>
                        
                        <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-orange-100 mb-1">Companies</p>
                                    <h3 class="text-3xl font-bold">${analytics.totalCompanies}</h3>
                                </div>
                                <i class="fas fa-building text-4xl text-orange-200"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid lg:grid-cols-4 gap-6">
                        <!-- Filters Sidebar -->
                        <div class="lg:col-span-1">
                            <div class="card sticky top-4">
                                <h3 class="text-lg font-bold text-gray-800 mb-4">
                                    <i class="fas fa-filter mr-2"></i>
                                    Filters
                                </h3>
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="form-label">Search</label>
                                        <input type="text" id="searchUsers" class="form-input" 
                                               placeholder="Name or email..." />
                                    </div>
                                    
                                    <div>
                                        <label class="form-label">Role</label>
                                        <select id="filterRole" class="form-input">
                                            <option value="">All Roles</option>
                                            <option value="student">Student</option>
                                            <option value="alumni">Alumni</option>
                                            <option value="employer">Employer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="form-label">Profile Visibility</label>
                                        <select id="filterVisibility" class="form-input">
                                            <option value="">All</option>
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>
                                    
                                    <button id="applyFiltersBtn" class="btn btn-primary w-full">
                                        <i class="fas fa-check mr-2"></i> Apply
                                    </button>
                                    
                                    <button id="clearFiltersBtn" class="btn btn-secondary w-full">
                                        <i class="fas fa-times mr-2"></i> Clear
                                    </button>
                                </div>
                                
                                <hr class="my-6" />
                                
                                <button class="btn btn-primary w-full">
                                    <i class="fas fa-user-plus mr-2"></i> Add User
                                </button>
                            </div>
                        </div>
                        
                        <!-- Users Table -->
                        <div class="lg:col-span-3">
                            <div class="card">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-xl font-bold text-gray-800">
                                        <span id="userCount">${allUsers.length}</span> Users
                                    </h3>
                                    <select id="sortUsers" class="form-input w-48">
                                        <option value="name">Sort by Name</option>
                                        <option value="email">Sort by Email</option>
                                        <option value="role">Sort by Role</option>
                                        <option value="recent">Recently Added</option>
                                    </select>
                                </div>
                                
                                <div class="overflow-x-auto">
                                    <table id="usersTable" class="w-full">
                                        <thead class="bg-gray-100 border-b-2 border-gray-300">
                                            <tr>
                                                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">User</th>
                                                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Email</th>
                                                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Role</th>
                                                <th class="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                                                <th class="px-4 py-3 text-center text-sm font-bold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="usersTableBody">
                                            ${renderUsersTable(allUsers)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div id="noUsers" class="card text-center py-12 hidden">
                                <i class="fas fa-user-slash text-gray-300 text-6xl mb-4"></i>
                                <p class="text-gray-500 text-lg">No users match your filters</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setupEventListeners(allUsers);
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

function renderUsersTable(users) {
    if (users.length === 0) {
        return '';
    }
    
    return users.map(user => {
        const roleColors = {
            student: 'bg-blue-100 text-blue-800',
            alumni: 'bg-green-100 text-green-800',
            employer: 'bg-orange-100 text-orange-800',
            admin: 'bg-purple-100 text-purple-800'
        };
        
        const roleColor = roleColors[user.role] || 'bg-gray-100 text-gray-800';
        
        return `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                <td class="px-4 py-4">
                    <div class="flex items-center">
                        <img src="${user.avatar}" alt="${user.name}" 
                             class="w-10 h-10 rounded-full mr-3 border-2 border-gray-200" />
                        <div>
                            <p class="font-semibold text-gray-800">${user.name}</p>
                            ${user.currentPosition ? `<p class="text-sm text-gray-500">${user.currentPosition}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 text-gray-700">${user.email}</td>
                <td class="px-4 py-4">
                    <span class="px-3 py-1 ${roleColor} rounded-full text-sm font-semibold capitalize">
                        ${user.role}
                    </span>
                </td>
                <td class="px-4 py-4">
                    ${user.profileVisibility === 'public' ? 
                        '<span class="text-green-600"><i class="fas fa-eye mr-1"></i> Public</span>' :
                        '<span class="text-gray-600"><i class="fas fa-lock mr-1"></i> Private</span>'}
                </td>
                <td class="px-4 py-4">
                    <div class="flex justify-center gap-2">
                        <button class="text-blue-600 hover:text-blue-800" onclick="viewUser('${user.id}')" 
                                title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-green-600 hover:text-green-800" onclick="editUser('${user.id}')" 
                                title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${user.role !== 'admin' ? `
                            <button class="text-red-600 hover:text-red-800" onclick="deleteUser('${user.id}')" 
                                    title="Delete User">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function setupEventListeners(allUsers) {
    let filteredUsers = [...allUsers];
    
    const applyFilters = () => {
        const search = document.getElementById('searchUsers').value.toLowerCase();
        const role = document.getElementById('filterRole').value;
        const visibility = document.getElementById('filterVisibility').value;
        
        filteredUsers = allUsers.filter(user => {
            // Search filter
            if (search) {
                const searchMatch = user.name.toLowerCase().includes(search) ||
                                  user.email.toLowerCase().includes(search);
                if (!searchMatch) return false;
            }
            
            // Role filter
            if (role && user.role !== role) return false;
            
            // Visibility filter
            if (visibility && user.profileVisibility !== visibility) return false;
            
            return true;
        });
        
        updateUsersDisplay();
    };
    
    const updateUsersDisplay = () => {
        const tableBody = document.getElementById('usersTableBody');
        const noResults = document.getElementById('noUsers');
        const count = document.getElementById('userCount');
        const table = document.getElementById('usersTable').closest('.card');
        
        count.textContent = filteredUsers.length;
        
        if (filteredUsers.length === 0) {
            table.classList.add('hidden');
            noResults.classList.remove('hidden');
        } else {
            table.classList.remove('hidden');
            noResults.classList.add('hidden');
            tableBody.innerHTML = renderUsersTable(filteredUsers);
        }
    };
    
    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        document.getElementById('searchUsers').value = '';
        document.getElementById('filterRole').value = '';
        document.getElementById('filterVisibility').value = '';
        filteredUsers = [...allUsers];
        updateUsersDisplay();
    });
    
    // Sort
    document.getElementById('sortUsers').addEventListener('change', (e) => {
        const sortBy = e.target.value;
        
        if (sortBy === 'name') {
            filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'email') {
            filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
        } else if (sortBy === 'role') {
            filteredUsers.sort((a, b) => a.role.localeCompare(b.role));
        }
        
        updateUsersDisplay();
    });
    
    // Global action functions
    window.viewUser = (userId) => {
        alert(`View details for user ${userId} (to be implemented)`);
    };
    
    window.editUser = (userId) => {
        alert(`Edit user ${userId} (to be implemented)`);
    };
    
    window.deleteUser = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            alert(`User ${userId} deleted (to be implemented)`);
            // In real implementation: await mockDataService.deleteUser(userId);
        }
    };
}
