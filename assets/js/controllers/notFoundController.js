/**
 * 404 Not Found Controller
 */
export default async function notFoundController() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(135deg,#dd2c00_0%,#b02400_100%)]">
            <div class="text-center text-white fade-in">
                <div class="text-9xl font-bold mb-4">404</div>
                <h1 class="text-4xl font-bold mb-4">Page Not Found</h1>
                <p class="text-xl mb-8 opacity-90">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <a href="/" data-link class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-white hover:bg-gray-100 text-[#dd2c00]">
                    <i class="fas fa-home mr-2"></i>
                    Go Back Home
                </a>
            </div>
        </div>
    `;
}
