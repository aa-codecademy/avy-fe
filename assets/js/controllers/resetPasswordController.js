/**
 * Reset Password Page Controller
 *
 * @author Ognen Manevski
 * Task: Forgot Password — Step 2 of the reset flow.
 * The user lands here after clicking "Open Reset Page" in the forgot password modal.
 * Phase 1: Token is read from localStorage (set by authService.requestPasswordReset).
 * Phase 2: Token will arrive as a URL query param from a real email link (?token=...).
 */

// feature/forgot-password-at-login [Ognen]
import authService from '../services/authService.js';

export default async function resetPasswordController() {
    const app = document.getElementById('app');

    // Phase 1: read token from localStorage
    // Phase 2: read from URL — const token = new URLSearchParams(window.location.search).get('token');
    const token = localStorage.getItem('avy_reset_token');
    const email = localStorage.getItem('avy_reset_email');

    app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center px-4 bg-brand-gradient">
            <div class="card max-w-md w-full fade-in">

                <!-- Logo -->
                <div class="text-center mb-8">
                    <a href="/" data-link class="inline-block">
                        <h1 class="text-4xl font-bold mb-2 text-brand-primary hover:opacity-90">
                            Avy
                        </h1>
                    </a>
                    <p class="text-gray-600">Reset your password</p>
                </div>

                ${!token ? `
                <!-- No valid token found -->
                <div class="text-center py-6">
                    <i class="fas fa-link-slash text-5xl text-red-400 mb-4"></i>
                    <h2 class="text-xl font-bold text-gray-800 mb-2">Invalid or expired link</h2>
                    <p class="text-sm text-gray-600 mb-6">
                        This reset link is no longer valid. Please request a new one.
                    </p>
                    <a href="/login" data-link class="btn btn-secondary w-full">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to Sign In
                    </a>
                </div>
                ` : `
                <!-- Reset form -->
                <div id="resetFormSection">
                    ${email ? `<p class="text-sm text-gray-500 text-center mb-6">Resetting password for <strong>${email}</strong></p>` : ''}
                    <form id="resetPasswordForm" class="space-y-5">
                        <div class="form-group">
                            <label for="newPassword" class="form-label">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                class="form-input"
                                placeholder="Choose a strong password"
                                minlength="6"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword" class="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                class="form-input"
                                placeholder="Repeat your new password"
                                minlength="6"
                                required
                            />
                        </div>
                        <div id="resetErrorMessage" class="hidden text-red-600 text-sm p-3 bg-red-50 rounded"></div>
                        <button type="submit" class="btn btn-primary w-full">
                            <span id="resetBtnText">Set New Password</span>
                            <i id="resetSpinner" class="fas fa-spinner fa-spin ml-2 hidden"></i>
                        </button>
                    </form>
                </div>

                <!-- Success state (hidden initially) -->
                <div id="resetSuccessSection" class="hidden text-center py-6">
                    <i class="fas fa-circle-check text-5xl text-green-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-gray-800 mb-2">Password updated!</h2>
                    <p class="text-sm text-gray-600 mb-6">
                        Your password has been reset successfully. You can now sign in.
                    </p>
                    <a href="/login" data-link class="btn btn-primary w-full">
                        <i class="fas fa-sign-in-alt mr-2"></i>
                        Go to Sign In
                    </a>
                </div>
                `}

                <!-- Back to Sign In -->
                <div class="mt-6 text-center">
                    <a href="/login" data-link class="text-gray-500 hover:text-gray-700 text-sm">
                        <i class="fas fa-arrow-left mr-1"></i>
                        Back to Sign In
                    </a>
                </div>
            </div>
        </div>
    `;

    // If no token, nothing more to wire up
    if (!token) return;

    const form = document.getElementById('resetPasswordForm');
    const errorMsg = document.getElementById('resetErrorMessage');
    const btnText = document.getElementById('resetBtnText');
    const spinner = document.getElementById('resetSpinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        errorMsg.classList.add('hidden');

        if (newPassword !== confirmPassword) {
            errorMsg.textContent = 'Passwords do not match.';
            errorMsg.classList.remove('hidden');
            return;
        }

        btnText.textContent = 'Updating...';
        spinner.classList.remove('hidden');
        form.querySelector('button[type="submit"]').disabled = true;

        try {
            await authService.confirmPasswordReset(token, newPassword);
            // Show success state
            document.getElementById('resetFormSection').classList.add('hidden');
            document.getElementById('resetSuccessSection').classList.remove('hidden');
        } catch (error) {
            errorMsg.textContent = error.message || 'Failed to reset password. Please try again.';
            errorMsg.classList.remove('hidden');
            btnText.textContent = 'Set New Password';
            spinner.classList.add('hidden');
            form.querySelector('button[type="submit"]').disabled = false;
        }
    });
}
// END Ognen Manevski
