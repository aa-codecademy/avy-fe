/**
 * 404 Not Found Controller
 */
export default async function notFoundController() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center px-4 bg-brand-gradient">
            <div class="text-center text-white fade-in">
                <div class="text-9xl font-bold mb-4">404</div>
                <h1 class="text-4xl font-bold mb-4">Page Not Found</h1>
                <p class="text-xl mb-8 opacity-90">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <a href="/" data-link class="btn bg-white hover:bg-gray-100 text-brand-primary">
                    <i class="fas fa-home mr-2"></i>
                    Go Back Home
                </a>
            </div>
        </div>
    `;
}
