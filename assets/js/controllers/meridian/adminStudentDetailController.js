import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

export default async function adminStudentDetailController(params = {}) {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const studentId = params.id;
    const [student, cv] = await Promise.all([
        mockDataService.getUserById(studentId),
        mockDataService.getCVProfile(studentId)
    ]);

    if (!student || student.role !== 'student') {
        window.router.navigate('/404');
        return;
    }

    const completeness = computeCompleteness(student, cv);

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="fade-in">

                    <div class="mb-6">
                        <a href="/admin/students" data-link class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition">
                            <i class="fas fa-arrow-left mr-2"></i> Back to Student Directory
                        </a>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-6">

                        <!-- Left column -->
                        <div class="lg:col-span-1 space-y-6">
                            ${renderAdminActionsCard(student, cv)}
                            ${renderAccountStatusCard(student)}
                            ${renderHeroCard(student, cv)}
                            ${renderCompletenessCard(completeness)}
                            ${renderContactCard(student)}
                        </div>

                        <!-- Right column -->
                        <div class="lg:col-span-2 space-y-6">
                            ${renderAcademyCard(cv)}
                            ${renderEducationCard(cv)}
                            ${renderWorkExperienceCard(cv)}
                            ${renderSkillsCard(cv)}
                            ${renderLanguagesCard(cv)}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());

    setupAdminActions(studentId, student.profileStatus, student.accountStatus || 'active');
}

function setupAdminActions(studentId, currentProfileStatus, currentAccountStatus) {
    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');

    if (approveBtn) {
        approveBtn.addEventListener('click', async () => {
            approveBtn.disabled = true;
            approveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Approving...';
            await mockDataService.updateProfileStatus(studentId, 'approved');
            window.router.navigate('/admin/students/' + studentId);
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => showRejectModal(studentId));
    }

    const suspendBtn = document.getElementById('suspendBtn');
    const deactivateBtn = document.getElementById('deactivateBtn');
    const reactivateBtn = document.getElementById('reactivateBtn');

    if (suspendBtn) {
        suspendBtn.addEventListener('click', () => showSuspendModal(studentId));
    }
    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', () => showDeactivateModal(studentId));
    }
    if (reactivateBtn) {
        reactivateBtn.addEventListener('click', () => showReactivateModal(studentId, currentAccountStatus));
    }
}

function showRejectModal(studentId) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[1000] flex items-center justify-center bg-black/50';
    overlay.innerHTML = `
        <div class="max-h-[90vh] w-[90%] overflow-y-auto rounded-xl bg-white p-8 max-w-[500px]">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-gray-800">
                    <i class="fas fa-times-circle text-red-500 mr-2"></i>Reject Profile
                </h2>
                <button id="closeRejectModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="text-sm text-gray-600 mb-4">
                Provide a reason for rejecting this profile submission. This note is for internal admin records only.
            </p>
            <div class="mb-5">
                <label class="mb-2 block font-medium text-slate-700 text-sm">
                    Rejection Reason <span class="text-red-500">*</span>
                </label>
                <textarea
                    id="rejectionNote"
                    class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                    rows="4"
                    placeholder="e.g. Profile information is incomplete or links are unverifiable..."
                ></textarea>
                <p id="noteError" class="text-xs text-red-500 mt-1 hidden">
                    <i class="fas fa-exclamation-circle mr-1"></i>Please provide a rejection reason.
                </p>
            </div>
            <div class="flex gap-3">
                <button id="cancelRejectBtn" class="flex-1 inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white" style="padding: 0.6rem 1rem; font-size: 0.875rem;">
                    Cancel
                </button>
                <button id="confirmRejectBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition">
                    <i class="fas fa-times"></i> Confirm Rejection
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('closeRejectModal').addEventListener('click', close);
    document.getElementById('cancelRejectBtn').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    document.getElementById('confirmRejectBtn').addEventListener('click', async () => {
        const note = document.getElementById('rejectionNote').value.trim();
        const errorEl = document.getElementById('noteError');

        if (!note) {
            errorEl.classList.remove('hidden');
            return;
        }

        errorEl.classList.add('hidden');
        const confirmBtn = document.getElementById('confirmRejectBtn');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Rejecting...';

        await mockDataService.updateProfileStatus(studentId, 'rejected', note);
        close();
        window.router.navigate('/admin/students/' + studentId);
    });
}

function renderAccountStatusCard(student) {
    const configs = {
        active: {
            wrapperCls: 'border border-green-200 bg-green-50',
            badgeCls:   'bg-green-100 text-green-800',
            icon:       'fa-check-circle',
            label:      'Active',
        },
        suspended: {
            wrapperCls: 'border border-orange-200 bg-orange-50',
            badgeCls:   'bg-orange-100 text-orange-800',
            icon:       'fa-pause-circle',
            label:      'Suspended',
        },
        deactivated: {
            wrapperCls: 'border border-red-200 bg-red-50',
            badgeCls:   'bg-red-100 text-red-800',
            icon:       'fa-ban',
            label:      'Deactivated',
        },
    };

    const accountStatus = student.accountStatus || 'active';
    const cfg = configs[accountStatus] || configs.active;

    const updatedAt = student.accountStatusUpdatedAt
        ? new Date(student.accountStatusUpdatedAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric'
          })
        : null;

    const noteBlock = (accountStatus !== 'active' && student.accountStatusNote)
        ? `<div class="mt-3 p-3 bg-white rounded-lg border ${accountStatus === 'suspended' ? 'border-orange-100' : 'border-red-100'}">
               <p class="text-xs font-semibold ${accountStatus === 'suspended' ? 'text-orange-700' : 'text-red-700'} mb-1">
                   <i class="fas fa-sticky-note mr-1"></i>Reason:
               </p>
               <p class="text-xs ${accountStatus === 'suspended' ? 'text-orange-600' : 'text-red-600'} leading-relaxed">${student.accountStatusNote}</p>
           </div>`
        : '';

    let actions = '';
    if (accountStatus === 'active') {
        actions = `
            <div class="flex gap-2 mt-4">
                <button id="suspendBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-orange-600 border border-orange-300 bg-white hover:bg-orange-50 transition">
                    <i class="fas fa-pause-circle"></i> Suspend
                </button>
                <button id="deactivateBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition">
                    <i class="fas fa-ban"></i> Deactivate
                </button>
            </div>`;
    } else if (accountStatus === 'suspended') {
        actions = `
            <div class="flex gap-2 mt-4">
                <button id="reactivateBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition">
                    <i class="fas fa-check-circle"></i> Reactivate
                </button>
                <button id="deactivateBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition">
                    <i class="fas fa-ban"></i> Deactivate
                </button>
            </div>`;
    } else {
        actions = `
            <div class="mt-4">
                <button id="reactivateBtn"
                    class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition">
                    <i class="fas fa-check-circle"></i> Reactivate Account
                </button>
            </div>`;
    }

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] ${cfg.wrapperCls}">
            <h3 class="text-sm font-bold text-gray-700 mb-3">
                <i class="fas fa-user-lock text-purple-500 mr-2"></i>Account Status
            </h3>
            <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badgeCls}">
                    <i class="fas ${cfg.icon} mr-1.5"></i>${cfg.label}
                </span>
                ${updatedAt ? `<span class="text-xs text-gray-400">Since ${updatedAt}</span>` : ''}
            </div>
            ${noteBlock}
            ${actions}
        </div>
    `;
}

function showSuspendModal(studentId) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[1000] flex items-center justify-center bg-black/50';
    overlay.innerHTML = `
        <div class="max-h-[90vh] w-[90%] overflow-y-auto rounded-xl bg-white p-8 max-w-[500px]">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-gray-800">
                    <i class="fas fa-pause-circle text-orange-500 mr-2"></i>Suspend Account
                </h2>
                <button id="closeSuspendModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="text-sm text-gray-600 mb-4">
                The student will lose access to the platform while suspended. You can reactivate the account at any time.
            </p>
            <div class="mb-5">
                <label class="mb-2 block font-medium text-slate-700 text-sm">
                    Suspension Reason <span class="text-red-500">*</span>
                </label>
                <textarea
                    id="suspendNote"
                    class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                    rows="4"
                    placeholder="e.g. Policy violation, pending investigation..."
                ></textarea>
                <p id="suspendNoteError" class="text-xs text-red-500 mt-1 hidden">
                    <i class="fas fa-exclamation-circle mr-1"></i>Please provide a suspension reason.
                </p>
            </div>
            <div class="flex gap-3">
                <button id="cancelSuspendBtn" class="flex-1 inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white" style="padding: 0.6rem 1rem; font-size: 0.875rem;">
                    Cancel
                </button>
                <button id="confirmSuspendBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition">
                    <i class="fas fa-pause-circle"></i> Suspend Account
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('closeSuspendModal').addEventListener('click', close);
    document.getElementById('cancelSuspendBtn').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    document.getElementById('confirmSuspendBtn').addEventListener('click', async () => {
        const note = document.getElementById('suspendNote').value.trim();
        const errorEl = document.getElementById('suspendNoteError');

        if (!note) {
            errorEl.classList.remove('hidden');
            return;
        }

        errorEl.classList.add('hidden');
        const confirmBtn = document.getElementById('confirmSuspendBtn');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Suspending...';

        await mockDataService.updateAccountStatus(studentId, 'suspended', note);
        close();
        window.router.navigate('/admin/students/' + studentId);
    });
}

function showDeactivateModal(studentId) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[1000] flex items-center justify-center bg-black/50';
    overlay.innerHTML = `
        <div class="max-h-[90vh] w-[90%] overflow-y-auto rounded-xl bg-white p-8 max-w-[500px]">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-gray-800">
                    <i class="fas fa-ban text-red-500 mr-2"></i>Permanently Deactivate Account
                </h2>
                <button id="closeDeactivateModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-700 font-semibold">
                    <i class="fas fa-exclamation-triangle mr-1"></i> This action is permanent.
                </p>
                <p class="text-sm text-red-600 mt-1">
                    The student's account will be permanently deactivated and they will lose all platform access. Reserve this for serious policy violations.
                </p>
            </div>
            <div class="mb-5">
                <label class="mb-2 block font-medium text-slate-700 text-sm">
                    Deactivation Reason <span class="text-red-500">*</span>
                </label>
                <textarea
                    id="deactivateNote"
                    class="w-full rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-800 transition focus:border-[#dd2c00] focus:outline-none focus:ring-4 focus:ring-[rgba(221,44,0,0.1)]"
                    rows="4"
                    placeholder="e.g. Repeated violations of platform terms of service..."
                ></textarea>
                <p id="deactivateNoteError" class="text-xs text-red-500 mt-1 hidden">
                    <i class="fas fa-exclamation-circle mr-1"></i>Please provide a deactivation reason.
                </p>
            </div>
            <div class="flex gap-3">
                <button id="cancelDeactivateBtn" class="flex-1 inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white" style="padding: 0.6rem 1rem; font-size: 0.875rem;">
                    Cancel
                </button>
                <button id="confirmDeactivateBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition">
                    <i class="fas fa-ban"></i> Deactivate Account
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('closeDeactivateModal').addEventListener('click', close);
    document.getElementById('cancelDeactivateBtn').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    document.getElementById('confirmDeactivateBtn').addEventListener('click', async () => {
        const note = document.getElementById('deactivateNote').value.trim();
        const errorEl = document.getElementById('deactivateNoteError');

        if (!note) {
            errorEl.classList.remove('hidden');
            return;
        }

        errorEl.classList.add('hidden');
        const confirmBtn = document.getElementById('confirmDeactivateBtn');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Deactivating...';

        await mockDataService.updateAccountStatus(studentId, 'deactivated', note);
        close();
        window.router.navigate('/admin/students/' + studentId);
    });
}

function showReactivateModal(studentId, currentAccountStatus) {
    const fromSuspended = currentAccountStatus === 'suspended';
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[1000] flex items-center justify-center bg-black/50';
    overlay.innerHTML = `
        <div class="max-h-[90vh] w-[90%] overflow-y-auto rounded-xl bg-white p-8 max-w-[500px]">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-gray-800">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>Reactivate Account
                </h2>
                <button id="closeReactivateModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="text-sm text-gray-600 mb-6">
                ${fromSuspended
                    ? 'The suspension will be lifted and the student will regain full access to the platform.'
                    : 'This account was permanently deactivated. Reactivating it will restore the student\'s full access to the platform.'}
            </p>
            <div class="flex gap-3">
                <button id="cancelReactivateBtn" class="flex-1 inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-2 border-[#dd2c00] bg-white text-[#dd2c00] hover:bg-[#dd2c00] hover:text-white" style="padding: 0.6rem 1rem; font-size: 0.875rem;">
                    Cancel
                </button>
                <button id="confirmReactivateBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition">
                    <i class="fas fa-check-circle"></i> Reactivate Account
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('closeReactivateModal').addEventListener('click', close);
    document.getElementById('cancelReactivateBtn').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    document.getElementById('confirmReactivateBtn').addEventListener('click', async () => {
        const confirmBtn = document.getElementById('confirmReactivateBtn');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Reactivating...';

        await mockDataService.updateAccountStatus(studentId, 'active', '');
        close();
        window.router.navigate('/admin/students/' + studentId);
    });
}

function computeCompleteness(student, cv) {
    const checks = [
        { label: 'Phone number',       done: !!student.phone },
        { label: 'Date of birth',      done: !!student.dateOfBirth },
        { label: 'Citizenship',        done: !!student.citizenship },
        { label: 'LinkedIn profile',   done: !!student.linkedIn },
        { label: 'Portfolio link',     done: !!student.portfolio },
        { label: 'Current position',   done: !!student.currentPosition },
        { label: 'Work experience',    done: (cv.workExperience || []).length > 0 },
        { label: 'Education',          done: (cv.education || []).length > 0 },
        { label: 'Skills',             done: (cv.skills || []).length > 0 },
        { label: 'Languages',          done: (cv.languages || []).length > 0 },
        { label: 'Academy attendance', done: (cv.academyAttendance || []).length > 0 },
    ];
    const done = checks.filter(c => c.done).length;
    return { checks, done, total: checks.length, percent: Math.round((done / checks.length) * 100) };
}

function renderAdminActionsCard(student, cv) {
    const hasProgramme = (cv.academyAttendance || []).length > 0;
    const programmeBtnLabel = hasProgramme ? 'Change Programme' : 'Assign Programme';
    const configs = {
        pending: {
            wrapperCls: 'border border-amber-200 bg-amber-50',
            badgeCls:   'bg-amber-100 text-amber-800',
            icon:       'fa-clock',
            label:      'Pending Review',
        },
        approved: {
            wrapperCls: 'border border-emerald-200 bg-emerald-50',
            badgeCls:   'bg-emerald-100 text-emerald-800',
            icon:       'fa-check-circle',
            label:      'Approved',
        },
        rejected: {
            wrapperCls: 'border border-red-200 bg-red-50',
            badgeCls:   'bg-red-100 text-red-800',
            icon:       'fa-times-circle',
            label:      'Rejected',
        },
    };

    const cfg = configs[student.profileStatus] || configs.pending;

    const updatedAt = student.profileStatusUpdatedAt
        ? new Date(student.profileStatusUpdatedAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric'
          })
        : null;

    const noteBlock = student.profileStatus === 'rejected' && student.profileStatusNote
        ? `<div class="mt-3 p-3 bg-white rounded-lg border border-red-100">
               <p class="text-xs font-semibold text-red-700 mb-1">
                   <i class="fas fa-sticky-note mr-1"></i>Rejection note:
               </p>
               <p class="text-xs text-red-600 leading-relaxed">${student.profileStatusNote}</p>
           </div>`
        : '';

    let actions = '';
    if (student.profileStatus === 'pending') {
        actions = `
            <div class="flex gap-2 mt-4">
                <button id="approveBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button id="rejectBtn"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>`;
    } else if (student.profileStatus === 'approved') {
        actions = `
            <div class="mt-4">
                <button id="rejectBtn"
                    class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-300 bg-white hover:bg-red-50 transition">
                    <i class="fas fa-times"></i> Reject Profile
                </button>
            </div>`;
    } else {
        actions = `
            <div class="mt-4">
                <button id="approveBtn"
                    class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition">
                    <i class="fas fa-check"></i> Approve Profile
                </button>
            </div>`;
    }

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] ${cfg.wrapperCls}">
            <h3 class="text-sm font-bold text-gray-700 mb-3">
                <i class="fas fa-shield-alt text-purple-500 mr-2"></i>Admin Review
            </h3>
            <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badgeCls}">
                    <i class="fas ${cfg.icon} mr-1.5"></i>${cfg.label}
                </span>
                ${updatedAt ? `<span class="text-xs text-gray-400">${updatedAt}</span>` : ''}
            </div>
            ${noteBlock}
            ${actions}
            <div class="mt-3 pt-3 border-t border-gray-200 space-y-2">
                <a href="/admin/students/${student.id}/edit" data-link
                    class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-purple-600 border border-purple-300 bg-white hover:bg-purple-50 transition">
                    <i class="fas fa-user-edit"></i> Edit Student Record
                </a>
                <a href="/admin/students/${student.id}/programme" data-link
                    class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 border border-indigo-300 bg-white hover:bg-indigo-50 transition">
                    <i class="fas fa-graduation-cap"></i> ${programmeBtnLabel}
                </a>
                <a href="/admin/students/${student.id}/privacy-log" data-link
                    class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-teal-600 border border-teal-300 bg-white hover:bg-teal-50 transition">
                    <i class="fas fa-eye"></i> View Privacy Log
                </a>
            </div>
        </div>
    `;
}

const trackColors = {
    'Frontend Development': 'bg-blue-100 text-blue-800',
    'Backend Development':  'bg-green-100 text-green-800',
    'QA Engineering':       'bg-yellow-100 text-yellow-800',
    'Data Analytics':       'bg-orange-100 text-orange-800',
    'UX/UI Design':         'bg-pink-100 text-pink-800',
};

function renderHeroCard(student, cv) {
    const attendance = (cv.academyAttendance || [])[0];
    const isPrivate = student.profileVisibility === 'private';

    const visibilityBadge = isPrivate
        ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
               <i class="fas fa-lock mr-1"></i> Private
           </span>`
        : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
               <i class="fas fa-eye mr-1"></i> Public
           </span>`;

    const trackBadge = attendance
        ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trackColors[attendance.track] || 'bg-purple-100 text-purple-800'}">
               <i class="fas fa-graduation-cap mr-1"></i>${attendance.track}
           </span>`
        : '';

    const joinedDate = new Date(student.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center">
            <img src="${student.avatar}" alt="${student.name}"
                 class="w-24 h-24 rounded-full border-4 border-purple-200 mx-auto mb-4" />
            <h2 class="text-xl font-bold text-gray-800 mb-1">${student.name}</h2>
            <p class="text-sm text-gray-500 mb-3">${student.email}</p>
            ${student.currentPosition
                ? `<p class="text-sm text-gray-600 font-medium mb-3">
                       <i class="fas fa-briefcase text-gray-400 mr-1"></i>${student.currentPosition}
                   </p>`
                : ''}
            <div class="flex flex-wrap justify-center gap-2 mb-4">
                ${trackBadge}
                ${visibilityBadge}
            </div>
            <p class="text-xs text-gray-400">
                <i class="fas fa-calendar-alt mr-1"></i> Member since ${joinedDate}
            </p>
        </div>
    `;
}

function renderCompletenessCard(completeness) {
    const barColor = completeness.percent >= 80
        ? 'bg-green-500'
        : completeness.percent >= 50
            ? 'bg-yellow-400'
            : 'bg-red-400';

    const missing = completeness.checks.filter(c => !c.done);

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            <h3 class="text-sm font-bold text-gray-700 mb-3">
                <i class="fas fa-chart-pie text-purple-500 mr-2"></i>Profile Completeness
            </h3>
            <div class="flex items-center justify-between mb-1">
                <span class="text-2xl font-bold text-gray-800">${completeness.percent}%</span>
                <span class="text-xs text-gray-400">${completeness.done} / ${completeness.total} fields</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div class="${barColor} h-2 rounded-full transition-all" style="width: ${completeness.percent}%"></div>
            </div>
            ${missing.length > 0 ? `
                <p class="text-xs font-semibold text-gray-500 mb-2">Missing:</p>
                <ul class="space-y-1">
                    ${missing.map(c => `
                        <li class="text-xs text-gray-400 flex items-center gap-1.5">
                            <i class="fas fa-circle text-gray-200" style="font-size:6px"></i>${c.label}
                        </li>
                    `).join('')}
                </ul>
            ` : `
                <p class="text-xs text-green-600 font-medium">
                    <i class="fas fa-check-circle mr-1"></i>Profile fully complete
                </p>
            `}
        </div>
    `;
}

function renderContactCard(student) {
    const age = student.dateOfBirth
        ? Math.floor((Date.now() - new Date(student.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
        : null;

    const dob = student.dateOfBirth
        ? new Date(student.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    const rows = [
        student.phone
            ? `<div class="flex items-start gap-3">
                   <i class="fas fa-phone text-gray-400 mt-0.5 w-4 text-center"></i>
                   <span class="text-sm text-gray-700">${student.phone}</span>
               </div>`
            : '',
        dob
            ? `<div class="flex items-start gap-3">
                   <i class="fas fa-birthday-cake text-gray-400 mt-0.5 w-4 text-center"></i>
                   <span class="text-sm text-gray-700">${dob}${age !== null ? ` <span class="text-gray-400">(${age} yrs)</span>` : ''}</span>
               </div>`
            : '',
        student.citizenship
            ? `<div class="flex items-start gap-3">
                   <i class="fas fa-flag text-gray-400 mt-0.5 w-4 text-center"></i>
                   <span class="text-sm text-gray-700">${student.citizenship}</span>
               </div>`
            : '',
        student.linkedIn
            ? `<div class="flex items-start gap-3">
                   <i class="fab fa-linkedin text-blue-600 mt-0.5 w-4 text-center"></i>
                   <a href="${student.linkedIn}" target="_blank" rel="noopener noreferrer"
                      class="text-sm text-blue-600 hover:underline truncate">LinkedIn Profile</a>
               </div>`
            : '',
        student.portfolio
            ? `<div class="flex items-start gap-3">
                   <i class="fas fa-globe text-purple-500 mt-0.5 w-4 text-center"></i>
                   <a href="${student.portfolio}" target="_blank" rel="noopener noreferrer"
                      class="text-sm text-purple-600 hover:underline truncate">Portfolio / Website</a>
               </div>`
            : '',
    ].filter(Boolean);

    if (rows.length === 0) {
        return `
            <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                <h3 class="text-sm font-bold text-gray-700 mb-3">
                    <i class="fas fa-address-card text-purple-500 mr-2"></i>Contact & Personal
                </h3>
                <p class="text-sm text-gray-400 italic">No contact information provided.</p>
            </div>
        `;
    }

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            <h3 class="text-sm font-bold text-gray-700 mb-4">
                <i class="fas fa-address-card text-purple-500 mr-2"></i>Contact & Personal
            </h3>
            <div class="space-y-3">
                ${rows.join('')}
            </div>
        </div>
    `;
}

function renderAcademyCard(cv) {
    const entries = cv.academyAttendance || [];

    const statusBadge = status => status === 'active'
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
               <i class="fas fa-circle text-blue-400 mr-1" style="font-size:6px"></i>Active
           </span>`
        : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
               <i class="fas fa-check-circle mr-1"></i>Completed
           </span>`;

    const formatDate = d => d
        ? new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
        : 'Present';

    const content = entries.length === 0
        ? `<p class="text-sm text-gray-400 italic">No academy attendance recorded.</p>`
        : entries.map(a => `
            <div class="border-l-4 border-purple-300 pl-4">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <p class="font-semibold text-gray-800 text-sm">${a.academyName}</p>
                    ${statusBadge(a.status)}
                </div>
                <p class="text-sm text-gray-600 mb-1">
                    <span class="inline-block px-2 py-0.5 rounded text-xs font-medium ${trackColors[a.track] || 'bg-purple-100 text-purple-800'}">
                        ${a.track}
                    </span>
                </p>
                <p class="text-xs text-gray-400">
                    <i class="fas fa-calendar mr-1"></i>${formatDate(a.startDate)} – ${formatDate(a.endDate)}
                </p>
            </div>
        `).join('');

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            <h3 class="text-base font-bold text-gray-800 mb-4">
                <i class="fas fa-university text-purple-500 mr-2"></i>Academy Attendance
            </h3>
            <div class="space-y-4">${content}</div>
        </div>
    `;
}

function renderEducationCard(cv) {
    const entries = cv.education || [];

    const formatDate = d => d
        ? new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
        : 'Present';

    const content = entries.length === 0
        ? `<p class="text-sm text-gray-400 italic">No education records found.</p>`
        : entries.map(e => `
            <div class="border-l-4 border-blue-200 pl-4">
                <p class="font-semibold text-gray-800 text-sm mb-0.5">${e.institution}</p>
                <p class="text-sm text-gray-600 mb-1">${e.degree} in ${e.fieldOfStudy}</p>
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span><i class="fas fa-calendar mr-1"></i>${formatDate(e.startDate)} – ${formatDate(e.endDate)}</span>
                    ${e.grade ? `<span><i class="fas fa-star mr-1 text-yellow-400"></i>${e.grade}</span>` : ''}
                </div>
            </div>
        `).join('');

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            <h3 class="text-base font-bold text-gray-800 mb-4">
                <i class="fas fa-graduation-cap text-blue-500 mr-2"></i>Education
            </h3>
            <div class="space-y-4">${content}</div>
        </div>
    `;
}

function renderWorkExperienceCard(cv) {
    const entries = cv.workExperience || [];

    const formatDate = d => d
        ? new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
        : 'Present';

    const content = entries.length === 0
        ? `<p class="text-sm text-gray-400 italic">No work experience listed.</p>`
        : entries.map(w => `
            <div class="border-l-4 border-green-200 pl-4">
                <p class="font-semibold text-gray-800 text-sm mb-0.5">${w.position}</p>
                <p class="text-sm text-gray-600 mb-1">${w.company}</p>
                <p class="text-xs text-gray-400 mb-2">
                    <i class="fas fa-calendar mr-1"></i>${formatDate(w.startDate)} – ${formatDate(w.endDate)}
                </p>
                ${w.description ? `<p class="text-sm text-gray-600 leading-relaxed">${w.description}</p>` : ''}
            </div>
        `).join('');

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            <h3 class="text-base font-bold text-gray-800 mb-4">
                <i class="fas fa-briefcase text-green-500 mr-2"></i>Work Experience
            </h3>
            <div class="space-y-4">${content}</div>
        </div>
    `;
}

function renderSkillsCard(cv) {
    const skills = cv.skills || [];

    const content = skills.length === 0
        ? `<p class="text-sm text-gray-400 italic">No skills listed.</p>`
        : `<div class="flex flex-wrap gap-2">
               ${skills.map(s => `
                   <span class="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm font-medium">
                       ${s}
                   </span>
               `).join('')}
           </div>`;

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            <h3 class="text-base font-bold text-gray-800 mb-4">
                <i class="fas fa-code text-purple-500 mr-2"></i>Skills
                ${skills.length > 0 ? `<span class="ml-2 text-sm font-normal text-gray-400">(${skills.length})</span>` : ''}
            </h3>
            ${content}
        </div>
    `;
}

function renderLanguagesCard(cv) {
    const languages = cv.languages || [];

    const levelColor = level => {
        if (level.startsWith('C')) return 'bg-green-100 text-green-800 border border-green-200';
        if (level.startsWith('B')) return 'bg-blue-100 text-blue-800 border border-blue-200';
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    };

    const content = languages.length === 0
        ? `<p class="text-sm text-gray-400 italic">No languages listed.</p>`
        : `<div class="space-y-2">
               ${languages.map(l => `
                   <div class="flex items-center justify-between">
                       <span class="text-sm text-gray-700 font-medium">${l.language}</span>
                       <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${levelColor(l.level)}">${l.level}</span>
                   </div>
               `).join('')}
           </div>`;

    return `
        <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            <h3 class="text-base font-bold text-gray-800 mb-4">
                <i class="fas fa-language text-indigo-500 mr-2"></i>Languages
            </h3>
            ${content}
        </div>
    `;
}
