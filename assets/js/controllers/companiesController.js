/**
 * Companies Controller
 * Browse and search companies
 */
import authService from '../services/authService.js';
import mockDataService from '../services/mockDataService.js';

export default async function companiesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user) {
        window.router.navigate('/login');
        return;
    }
    
    const companies = await mockDataService.getAllCompanies();
    
    app.innerHTML = `
        ${renderHeader(user)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <!-- Page Header -->
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-building text-purple-600 mr-3"></i>
                            Companies
                        </h1>
                        <p class="text-gray-600">Discover companies hiring Avy talent</p>
                    </div>
                    
                    <!-- Search -->
                    <div class="mb-6">
                        <input 
                            type="text" 
                            id="searchInput" 
                            class="form-input w-full max-w-2xl" 
                            placeholder="Search companies by name or industry..."
                        />
                    </div>
                    
                    <!-- Companies Grid -->
                    <div id="companiesGrid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${renderCompaniesGrid(companies)}
                    </div>
                    
                    <!-- Empty State -->
                    <div id="emptyState" class="hidden text-center py-20">
                        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">No companies found</h3>
                        <p class="text-gray-500">Try a different search term</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = companies.filter(c => 
            c.name.toLowerCase().includes(searchTerm) ||
            c.industry.toLowerCase().includes(searchTerm) ||
            c.description.toLowerCase().includes(searchTerm)
        );
        
        const grid = document.getElementById('companiesGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (filtered.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
        } else {
            grid.innerHTML = renderCompaniesGrid(filtered);
            emptyState.classList.add('hidden');
        }
    });
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

function renderHeader(user) {
    return `
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Avy
                    </div>
                    <div class="flex items-center space-x-6">
                        <a href="/dashboard" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-home mr-1"></i> Dashboard
                        </a>
                        <a href="/jobs" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-briefcase mr-1"></i> Jobs
                        </a>
                        <a href="/companies" data-link class="text-purple-600 font-semibold">
                            <i class="fas fa-building mr-1"></i> Companies
                        </a>
                        <a href="/profile" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-user mr-1"></i> Profile
                        </a>
                        <div class="flex items-center space-x-3">
                            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full border-2 border-purple-600" />
                            <button id="logoutBtn" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;
}

function renderCompaniesGrid(companies) {
    return companies.map(company => `
        <div class="card hover:shadow-xl transition">
            <div class="text-center mb-4">
                <img src="${company.logo}" alt="${company.name}" class="w-24 h-24 mx-auto rounded-lg mb-3" />
                <h3 class="text-xl font-bold text-gray-800 mb-1">${company.name}</h3>
                <p class="text-sm text-gray-600">${company.industry}</p>
            </div>
            
            <p class="text-gray-700 text-sm mb-4 line-clamp-3">${company.description}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
                ${company.locations.slice(0, 3).map(loc => `
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        <i class="fas fa-map-marker-alt mr-1"></i>${loc}
                    </span>
                `).join('')}
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span><i class="fas fa-users mr-1"></i> ${company.size}</span>
                <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-semibold">
                    ${company.jobPostingsUsed} Open Jobs
                </span>
            </div>
            
            <div class="flex gap-2">
                <button onclick="window.router.navigate('/jobs?company=${company.id}')" class="btn btn-primary flex-1 text-sm">
                    <i class="fas fa-briefcase mr-1"></i> View Jobs
                </button>
                ${company.website ? `
                    <a href="${company.website}" target="_blank" class="btn btn-secondary text-sm">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}
