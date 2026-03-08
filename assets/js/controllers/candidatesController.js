/**
 * Candidates Search Controller (Employer)
 * Browse and search students/alumni for recruitment
 */
import authService from '../services/authService.js';
import mockDataService from '../services/mockDataService.js';

export default async function candidatesController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();
    
    if (!user || user.role !== 'employer') {
        window.router.navigate('/dashboard');
        return;
    }
    
    const students = await mockDataService.getUsersByRole('student');
    const alumni = await mockDataService.getUsersByRole('alumni');
    const allCandidates = [...students, ...alumni];
    
    app.innerHTML = `
        ${renderHeader(user)}
        
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <!-- Page Header -->
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-users text-purple-600 mr-3"></i>
                            Candidate Search
                        </h1>
                        <p class="text-gray-600">Browse students and alumni from Avenga Academy</p>
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
                                        <input type="text" id="searchCandidates" class="form-input" 
                                               placeholder="Name, position, degree..." />
                                    </div>
                                    
                                    <div>
                                        <label class="form-label">Type</label>
                                        <select id="filterType" class="form-input">
                                            <option value="">All</option>
                                            <option value="student">Students Only</option>
                                            <option value="alumni">Alumni Only</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="form-label">Skills</label>
                                        <input type="text" id="filterSkills" class="form-input" 
                                               placeholder="React, Node.js..." />
                                        <p class="text-xs text-gray-500 mt-1">Comma-separated</p>
                                    </div>
                                    
                                    <div>
                                        <label class="form-label">Profile Visibility</label>
                                        <select id="filterVisibility" class="form-input">
                                            <option value="">All</option>
                                            <option value="public">Public Only</option>
                                        </select>
                                    </div>
                                    
                                    <button id="applyFiltersBtn" class="btn btn-primary w-full">
                                        <i class="fas fa-check mr-2"></i> Apply Filters
                                    </button>
                                    
                                    <button id="clearFiltersBtn" class="btn btn-secondary w-full">
                                        <i class="fas fa-times mr-2"></i> Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Candidates Grid -->
                        <div class="lg:col-span-3">
                            <div class="card mb-6">
                                <div class="flex justify-between items-center">
                                    <h3 class="text-xl font-bold text-gray-800">
                                        <span id="candidateCount">${allCandidates.length}</span> Candidates Found
                                    </h3>
                                    <select id="sortCandidates" class="form-input w-48">
                                        <option value="name">Sort by Name</option>
                                        <option value="recent">Recently Updated</option>
                                        <option value="students">Students First</option>
                                        <option value="alumni">Alumni First</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div id="candidatesGrid" class="space-y-4">
                                ${renderCandidatesGrid(allCandidates)}
                            </div>
                            
                            <div id="noCandidates" class="card text-center py-12 hidden">
                                <i class="fas fa-user-slash text-gray-300 text-6xl mb-4"></i>
                                <p class="text-gray-500 text-lg">No candidates match your filters</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setupEventListeners(allCandidates);
    
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
                        <a href="/employer/jobs" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-briefcase mr-1"></i> My Jobs
                        </a>
                        <a href="/employer/post-job" data-link class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-plus-circle mr-1"></i> Post Job
                        </a>
                        <a href="/employer/candidates" data-link class="text-purple-600 font-semibold">
                            <i class="fas fa-users mr-1"></i> Candidates
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

function renderCandidatesGrid(candidates) {
    if (candidates.length === 0) {
        return '';
    }
    
    return candidates.map(candidate => {
        const isPrivate = candidate.profileVisibility === 'private';
        // Note: In real implementation, CV profile would be loaded separately
        // For now, we'll show basic user info only
        const skills = []; // Will be loaded from CV profile in Phase 2
        
        return `
            <div class="card hover:shadow-xl transition duration-300">
                <div class="flex gap-6">
                    <!-- Avatar -->
                    <div class="flex-shrink-0">
                        <img src="${candidate.avatar}" alt="${candidate.name}" 
                             class="w-24 h-24 rounded-full border-4 border-purple-200" />
                    </div>
                    
                    <!-- Candidate Info -->
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-1">
                                    ${candidate.name}
                                    ${isPrivate ? '<i class="fas fa-lock text-gray-400 text-sm ml-2"></i>' : ''}
                                </h3>
                                <p class="text-purple-600 font-semibold">${candidate.currentPosition || 'Student'}</p>
                                <p class="text-gray-600 text-sm">${candidate.educationDegree || 'Degree not specified'}</p>
                            </div>
                            
                            <span class="px-3 py-1 ${candidate.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} rounded-full text-sm font-semibold">
                                ${candidate.role === 'student' ? 'Student' : 'Alumni'}
                            </span>
                        </div>
                        
                        <!-- Note about skills loading -->
                        <div class="bg-gray-50 p-3 rounded-lg mb-3">
                            <p class="text-gray-500 text-sm">
                                <i class="fas fa-code mr-2"></i>
                                Skills will be loaded from CV profile
                            </p>
                        </div>
                        
                        <!-- Contact Icons -->
                        <div class="flex gap-4 text-gray-500 text-sm mb-4">
                            ${candidate.email ? `
                                <div class="flex items-center">
                                    <i class="fas fa-envelope mr-2"></i>
                                    ${isPrivate ? 'Hidden' : candidate.email}
                                </div>
                            ` : ''}
                            ${candidate.phone ? `
                                <div class="flex items-center">
                                    <i class="fas fa-phone mr-2"></i>
                                    ${isPrivate ? 'Hidden' : candidate.phone}
                                </div>
                            ` : ''}
                            ${candidate.linkedIn ? `
                                <a href="${candidate.linkedIn}" target="_blank" class="flex items-center hover:text-purple-600">
                                    <i class="fab fa-linkedin mr-2"></i>
                                    LinkedIn
                                </a>
                            ` : ''}
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex gap-3">
                            <button class="btn btn-primary text-sm" onclick="viewCandidateProfile('${candidate.id}')">
                                <i class="fas fa-eye mr-1"></i> View Profile
                            </button>
                            <button class="btn btn-secondary text-sm" onclick="saveCandidate('${candidate.id}')">
                                <i class="fas fa-bookmark mr-1"></i> Save
                            </button>
                            ${isPrivate ? `
                                <button class="btn btn-secondary text-sm" onclick="requestAccess('${candidate.id}')">
                                    <i class="fas fa-unlock mr-1"></i> Request Access
                                </button>
                            ` : `
                                <button class="btn btn-secondary text-sm" onclick="contactCandidate('${candidate.id}')">
                                    <i class="fas fa-envelope mr-1"></i> Contact
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupEventListeners(allCandidates) {
    let filteredCandidates = [...allCandidates];
    
    const applyFilters = () => {
        const search = document.getElementById('searchCandidates').value.toLowerCase();
        const type = document.getElementById('filterType').value;
        const skillsInput = document.getElementById('filterSkills').value.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
        const visibility = document.getElementById('filterVisibility').value;
        
        filteredCandidates = allCandidates.filter(candidate => {
            // Search filter
            if (search) {
                const searchMatch = candidate.name.toLowerCase().includes(search) ||
                                  (candidate.currentPosition?.toLowerCase().includes(search)) ||
                                  (candidate.educationDegree?.toLowerCase().includes(search));
                if (!searchMatch) return false;
            }
            
            // Type filter
            if (type && candidate.role !== type) return false;
            
            // Skills filter - Note: Will be implemented properly in Phase 2 with CV profile data
            // For now we just pass through
            if (skillsInput.length > 0) {
                // Placeholder: In Phase 2, load CV profiles and filter by skills
                // For now, we'll just pass through to show basic filtering UI
            }
            
            // Visibility filter
            if (visibility && candidate.profileVisibility !== visibility) return false;
            
            return true;
        });
        
        updateCandidatesDisplay();
    };
    
    const updateCandidatesDisplay = () => {
        const grid = document.getElementById('candidatesGrid');
        const noResults = document.getElementById('noCandidates');
        const count = document.getElementById('candidateCount');
        
        count.textContent = filteredCandidates.length;
        
        if (filteredCandidates.length === 0) {
            grid.classList.add('hidden');
            noResults.classList.remove('hidden');
        } else {
            grid.classList.remove('hidden');
            noResults.classList.add('hidden');
            grid.innerHTML = renderCandidatesGrid(filteredCandidates);
        }
    };
    
    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        document.getElementById('searchCandidates').value = '';
        document.getElementById('filterType').value = '';
        document.getElementById('filterSkills').value = '';
        document.getElementById('filterVisibility').value = '';
        filteredCandidates = [...allCandidates];
        updateCandidatesDisplay();
    });
    
    // Sort
    document.getElementById('sortCandidates').addEventListener('change', (e) => {
        const sortBy = e.target.value;
        
        if (sortBy === 'name') {
            filteredCandidates.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'students') {
            filteredCandidates.sort((a, b) => a.role === 'student' ? -1 : 1);
        } else if (sortBy === 'alumni') {
            filteredCandidates.sort((a, b) => a.role === 'alumni' ? -1 : 1);
        }
        
        updateCandidatesDisplay();
    });
    
    // Global action functions
    window.viewCandidateProfile = (candidateId) => {
        alert(`View profile for candidate ${candidateId} (to be implemented)`);
    };
    
    window.saveCandidate = (candidateId) => {
        alert(`Candidate ${candidateId} saved to your shortlist`);
    };
    
    window.requestAccess = (candidateId) => {
        alert(`Access request sent to candidate ${candidateId}`);
    };
    
    window.contactCandidate = (candidateId) => {
        alert(`Contact form for candidate ${candidateId} (to be implemented)`);
    };
}
