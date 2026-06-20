/**
 * Companies Controller
 * Browse and search companies
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function companiesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user) {
        window.router.navigate('/login');
        return;
    }
    
    const companies = await mockDataService.getAllCompanies();
    const activeCompanies = companies.filter((c) => !c.suspended);
    
    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-building text-purple-600 mr-3"></i>
                            Companies
                        </h1>
                        <p class="text-gray-600">Discover companies hiring Avy talent</p>
                    </div>
                    
                    <div class="mb-6">
                        <input 
                            type="text" 
                            id="searchInput" 
                            class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] w-full max-w-2xl" 
                            placeholder="Search companies by name or industry..."
                        />
                    </div>
                    
                    <div id="companiesGrid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${renderCompaniesGrid(activeCompanies)}
                    </div>
                    
                    <div id="emptyState" class="hidden text-center py-20">
                        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">No companies found</h3>
                        <p class="text-gray-500">Try a different search term</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = activeCompanies.filter(c => 
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

function renderCompaniesGrid(companies) {
    return companies.map(company => `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-xl transition">
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
                <button onclick="window.router.navigate('/jobs?company=${company.id}')" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] flex-1 text-sm">
                    <i class="fas fa-briefcase mr-1"></i> View Jobs
                </button>
                ${company.website ? `
                    <a href="${company.website}" target="_blank" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}
