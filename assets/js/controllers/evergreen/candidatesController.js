/**
 * Candidates Search Controller (Employer)
 * Browse and search students/alumni for recruitment
 */
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

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
        ${renderAppHeader(user, window.location.pathname)}

        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-users text-purple-600 mr-3"></i>
                            Candidate Search
                        </h1>
                        <p class="text-gray-600">Browse students and alumni from Avenga Academy</p>
                    </div>

                    <div class="grid lg:grid-cols-4 gap-6">
                        <div class="lg:col-span-1">
                            <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] sticky top-4">
                                <h3 class="text-lg font-bold text-gray-800 mb-4">
                                    <i class="fas fa-filter mr-2"></i>
                                    Filters
                                </h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="mb-2 block font-medium text-slate-700">Search</label>
                                        <input type="text" id="searchCandidates" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" placeholder="Name, position, degree..." />
                                    </div>
                                    <div>
                                        <label class="mb-2 block font-medium text-slate-700">Type</label>
                                        <select id="filterType" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                            <option value="">All</option>
                                            <option value="student">Students Only</option>
                                            <option value="alumni">Alumni Only</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="mb-2 block font-medium text-slate-700">Skills</label>
                                        <input type="text" id="filterSkills" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" placeholder="React, Node.js..." />
                                    </div>
                                    <div>
                                        <label class="mb-2 block font-medium text-slate-700">Profile Visibility</label>
                                        <select id="filterVisibility" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]">
                                            <option value="">All</option>
                                            <option value="public">Public Only</option>
                                        </select>
                                    </div>
                                    <button id="applyFiltersBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] w-full">Apply Filters</button>
                                    <button id="clearFiltersBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white w-full">Clear</button>
                                </div>
                            </div>
                        </div>

                        <div class="lg:col-span-3">
                            <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] mb-6">
                                <div class="flex justify-between items-center">
                                    <h3 class="text-xl font-bold text-gray-800">
                                        <span id="candidateCount">${allCandidates.length}</span> Candidates Found
                                    </h3>
                                    <select id="sortCandidates" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] w-48">
                                        <option value="name">Sort by Name</option>
                                        <option value="students">Students First</option>
                                        <option value="alumni">Alumni First</option>
                                    </select>
                                </div>
                            </div>

                            <div id="candidatesGrid" class="space-y-4">
                                ${renderCandidatesGrid(allCandidates)}
                            </div>

                            ${renderContactModal()}

                            <div id="noCandidates" class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center py-12 hidden">
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
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
}

function renderCandidatesGrid(candidates) {
    if (candidates.length === 0) return '';
    return candidates
        .map((candidate) => {
            const isPrivate = candidate.profileVisibility === 'private';
            return `
            <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-xl transition duration-300">
                <div class="flex gap-6">
                    <div class="flex-shrink-0">
                        <img src="${candidate.avatar}" alt="${candidate.name}" class="w-24 h-24 rounded-full border-4 border-purple-200" />
                    </div>
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
                        <div class="flex gap-3">
                            <button class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)] text-sm" onclick="viewCandidateProfile('${candidate.id}')">View Profile</button>
                            <button class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm" onclick="saveCandidate('${candidate.id}')">Save</button>
                            ${
                                isPrivate
                                    ? `<button class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm" onclick="requestAccess('${candidate.id}')">Request Access</button>`
                                    : `<button class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white text-sm" onclick="contactCandidate('${candidate.id}')">Contact</button>`
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
        })
        .join('');
}

function renderContactModal() {
    return `
        <div id="contactModal" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 hidden">
            <div class="max-h-[90vh] w-[90%] overflow-y-auto rounded-xl bg-white p-8 max-w-[500px]">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-1">Contact Candidate</h2>
                        <p class="text-gray-600 text-sm" id="contactModalCandidateName"></p>
                    </div>
                    <button type="button" id="closeContactModal" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white px-3 py-2 text-sm">&times;</button>
                </div>
                <form id="contactForm" class="space-y-4">
                    <input type="hidden" id="contactCandidateId" />
                    <div>
                        <label class="mb-2 block font-medium text-slate-700" for="contactSubject">Subject</label>
                        <input type="text" id="contactSubject" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]" required placeholder="Subject" />
                    </div>
                    <div>
                        <label class="mb-2 block font-medium text-slate-700" for="contactMessage">Message</label>
                        <textarea id="contactMessage" class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)] h-32" required placeholder="Write your message..."></textarea>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button type="button" id="cancelContactBtn" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white">Cancel</button>
                        <button type="submit" class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)]">Send message</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function setupEventListeners(allCandidates) {
    let filteredCandidates = [...allCandidates];
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
    const applyFilters = () => {
        const search = document.getElementById('searchCandidates').value.toLowerCase();
        const type = document.getElementById('filterType').value;
        const visibility = document.getElementById('filterVisibility').value;
        filteredCandidates = allCandidates.filter((candidate) => {
            const searchMatch =
                !search ||
                candidate.name.toLowerCase().includes(search) ||
                candidate.currentPosition?.toLowerCase().includes(search) ||
                candidate.educationDegree?.toLowerCase().includes(search);
            return (
                searchMatch &&
                (!type || candidate.role === type) &&
                (!visibility || candidate.profileVisibility === visibility)
            );
        });
        updateCandidatesDisplay();
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
    document.getElementById('sortCandidates').addEventListener('change', (e) => {
        const sortBy = e.target.value;
        if (sortBy === 'name') filteredCandidates.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === 'students')
            filteredCandidates.sort((a, b) => (a.role === 'student' ? -1 : 1));
        if (sortBy === 'alumni') filteredCandidates.sort((a, b) => (a.role === 'alumni' ? -1 : 1));
        updateCandidatesDisplay();
    });

    const candidateMap = allCandidates.reduce((map, candidate) => {
        map[candidate.id] = candidate;
        return map;
    }, {});

    const contactModal = document.getElementById('contactModal');
    const contactForm = document.getElementById('contactForm');
    const closeContactModal = document.getElementById('closeContactModal');
    const cancelContactBtn = document.getElementById('cancelContactBtn');

    const closeModal = () => {
        contactModal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    const openModal = (candidate) => {
        document.getElementById('contactCandidateId').value = candidate.id;
        document.getElementById('contactModalCandidateName').textContent = candidate.name;
        document.getElementById('contactSubject').value =
            `Opportunity from ${candidate.currentPosition || 'your team'}`;
        document.getElementById('contactMessage').value =
            `Hi ${candidate.name.split(' ')[0] || candidate.name},\n\nI would like to discuss a possible opportunity with you. Please let me know when you are available for a short conversation.\n\nBest regards,`;
        contactModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const candidateId = document.getElementById('contactCandidateId').value;
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const candidate = candidateMap[candidateId];

        if (!candidate) {
            alert('Candidate not found.');
            return;
        }

        if (!subject || !message) {
            alert('Please add a subject and message.');
            return;
        }

        // Replace this with a real API call when available
        console.log('Contact candidate', {
            candidateId,
            candidateEmail: candidate.email,
            subject,
            message,
        });

        alert(`Message sent to ${candidate.name}!`);
        closeModal();
    });

    closeContactModal.addEventListener('click', closeModal);
    cancelContactBtn.addEventListener('click', closeModal);
    contactModal.addEventListener('click', (event) => {
        if (event.target === contactModal) closeModal();
    });

    window.viewCandidateProfile = (candidateId) =>
        alert(`View profile for candidate ${candidateId} (to be implemented)`);
    window.saveCandidate = (candidateId) =>
        alert(`Candidate ${candidateId} saved to your shortlist`);
    window.requestAccess = (candidateId) =>
        alert(`Access request sent to candidate ${candidateId}`);
    window.contactCandidate = (candidateId) => {
        const candidate = candidateMap[candidateId];
        if (candidate) {
            openModal(candidate);
        }
    };
}
