/**
 * Companies Controller
 * Browse and search companies
 */
import authService from '../../services/authService.js';
import languageService from '../../services/languageService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function companiesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    const t = (key) => languageService.translate(key);

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    const companies = await mockDataService.getAllCompanies();

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-building text-purple-600 mr-3"></i>
                            ${t('companies.title')}
                        </h1>
                        <p class="text-gray-600">${t('companies.about')}</p>
                    </div>
                    
                    <div class="mb-6">
                        <input 
                            type="text" 
                            id="searchInput" 
                            class="form-input w-full max-w-2xl" 
                            placeholder="${t('companies.search')}"
                        />
                    </div>
                    
                    <div id="companiesGrid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${renderCompaniesGrid(companies, t)}
                    </div>
                    
                    <div id="emptyState" class="hidden text-center py-20">
                        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-2xl font-bold text-gray-600 mb-2">${t('companies.noCompanies')}</h3>
                        <p class="text-gray-500">${t('messages.noData')}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = companies.filter(
            (c) =>
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
            grid.innerHTML = renderCompaniesGrid(filtered, t);
            emptyState.classList.add('hidden');
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

function renderCompaniesGrid(companies, t) {
    return companies
        .map(
            (company) => `
        <div class="card hover:shadow-xl transition">
            <div class="text-center mb-4">
                <img src="${company.logo}" alt="${company.name}" class="w-24 h-24 mx-auto rounded-lg mb-3" />
                <h3 class="text-xl font-bold text-gray-800 mb-1">${company.name}</h3>
                <p class="text-sm text-gray-600">${company.industry}</p>
            </div>
            
            <p class="text-gray-700 text-sm mb-4 line-clamp-3">${company.description}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
                ${company.locations
                    .slice(0, 3)
                    .map(
                        (loc) => `
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        <i class="fas fa-map-marker-alt mr-1"></i>${loc}
                    </span>
                `
                    )
                    .join('')}
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span><i class="fas fa-users mr-1"></i> ${company.size}</span>
                <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-semibold">
                    ${company.jobPostingsUsed} ${t('nav.postJob')}
                </span>
            </div>
            
            <div class="flex gap-2">
                <button onclick="window.router.navigate('/jobs?company=${company.id}')" class="btn btn-primary flex-1 text-sm">
                    <i class="fas fa-briefcase mr-1"></i> ${t('nav.jobs')}
                </button>
                ${
                    company.website
                        ? `
                    <a href="${company.website}" target="_blank" class="btn btn-secondary text-sm">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                `
                        : ''
                }
            </div>
        </div>
    `
        )
        .join('');
}
