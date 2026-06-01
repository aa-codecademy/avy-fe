/**
 * Simple SPA Router for Avy Web Application
 */
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.appContainer = document.getElementById('app');
        this.basePath = this.detectBasePath();

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.navigate(this.normalizePath(window.location.pathname), false);
        });

        // Handle initial load
        window.addEventListener('DOMContentLoaded', () => {
            this.navigate(this.normalizePath(window.location.pathname), false);
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
    }

    detectBasePath() {
        if (window.location.protocol === 'file:') {
            return '';
        }

        if (window.location.hostname.endsWith('github.io')) {
            const segments = window.location.pathname.split('/').filter(Boolean);
            if (segments.length > 0 && !segments[0].includes('.')) {
                return `/${segments[0]}`;
            }
        }

        return '';
    }

    normalizePath(path) {
        if (!path) return '/';

        let normalized = path;

        if (window.location.protocol === 'file:') {
            if (normalized.endsWith('/index.html') || normalized.endsWith('index.html')) {
                return '/';
            }
        }

        if (this.basePath && normalized.startsWith(this.basePath)) {
            normalized = normalized.slice(this.basePath.length) || '/';
        }

        if (normalized === '/index.html') {
            return '/';
        }

        if (!normalized.startsWith('/')) {
            normalized = `/${normalized}`;
        }

        return normalized;
    }

    withBasePath(path) {
        if (!this.basePath) return path;
        if (path === '/') return `${this.basePath}/`;
        return `${this.basePath}${path}`;
    }

    resolveAssetPath(path) {
        const normalized = path.startsWith('/') ? path : `/${path}`;
        return this.withBasePath(normalized);
    }

    /**
     * Register a route
     * @param {string} path - Route path (e.g., '/', '/login', '/dashboard')
     * @param {Function} controller - Controller function to handle the route
     * @param {boolean} requiresAuth - Whether this route requires authentication
     * @param {Array<string>} allowedRoles - Roles allowed to access this route
     */
    addRoute(path, controller, requiresAuth = false, allowedRoles = []) {
        this.routes[path] = {
            controller,
            requiresAuth,
            allowedRoles
        };
    }

    /**
     * Navigate to a route
     * @param {string} path - Path to navigate to
     * @param {boolean} addToHistory - Whether to add to browser history
     */
    async navigate(path, addToHistory = true) {
        path = this.normalizePath(path);

        // Try exact match first
        let route = this.routes[path];
        let params = {};

        // If no exact match, try pattern matching for dynamic routes
        if (!route) {
            for (const [pattern, routeConfig] of Object.entries(this.routes)) {
                const matchResult = this.matchRoute(pattern, path);
                if (matchResult) {
                    route = routeConfig;
                    params = matchResult.params;
                    break;
                }
            }
        }

        // Fall back to 404
        if (!route) {
            route = this.routes['/404'];
        }

        if (!route) {
            console.error(`No route found for path: ${path}`);
            return;
        }

        // Check authentication
        if (route.requiresAuth) {
            const isAuthenticated = window.authService.isAuthenticated();

            if (!isAuthenticated) {
                this.navigate('/login', true);
                return;
            }

            // Check role-based access
            if (route.allowedRoles.length > 0) {
                const user = window.authService.getCurrentUser();
                if (!user || !route.allowedRoles.includes(user.role)) {
                    this.navigate('/404', true);
                    return;
                }
            }
        }

        // Update browser history
        if (addToHistory && path !== this.normalizePath(window.location.pathname)) {
            window.history.pushState({}, '', this.withBasePath(path));
        }

        // Update current route
        this.currentRoute = path;

        // Clear app container
        this.appContainer.innerHTML = '<div class="spinner"></div>';

        // Execute controller with params
        try {
            // Pass params to controller if they exist
            if (Object.keys(params).length > 0) {
                await route.controller(params);
            } else {
                await route.controller();
            }
            // Refresh header badges after every successful navigation
            const user = window.authService?.getCurrentUser();
            if (user?.id) {
                if (typeof window.refreshHeaderBadge === 'function') window.refreshHeaderBadge(user.id);
                if (typeof window.refreshMessagesHeaderBadge === 'function') window.refreshMessagesHeaderBadge(user.id);
            }
        } catch (error) {
            console.error('Error loading route:', error);
            this.appContainer.innerHTML = `
                <div class="container mx-auto px-4 py-20 text-center">
                    <h1 class="text-4xl font-bold text-red-600 mb-4">Error</h1>
                    <p class="text-gray-600">Failed to load page. Please try again.</p>
                </div>
            `;
        }
    }

    /**
     * Match a route pattern with dynamic segments
     * @param {string} pattern - Route pattern (e.g., '/jobs/:id')
     * @param {string} path - Actual path (e.g., '/jobs/123')
     * @returns {object|null} - Match result with params or null
     */
    matchRoute(pattern, path) {
        // Convert pattern to regex
        const paramNames = [];
        const regexPattern = pattern.replace(/:([^\/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^\/]+)';
        });

        const regex = new RegExp(`^${regexPattern}$`);
        const match = path.match(regex);

        if (!match) {
            return null;
        }

        // Extract params
        const params = {};
        paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
        });

        return { params };
    }

    /**
     * Get current route path
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Export router instance
export default new Router();
