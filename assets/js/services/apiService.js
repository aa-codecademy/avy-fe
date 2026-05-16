/**
 * API Service
 * Handles HTTP requests to backend API
 */
import authService from './authService.js';
import mockDataService from './mockDataService.js';

class ApiService {
    constructor() {
        this.baseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
    }

    /**
     * Make HTTP request
     * @private
     */
    async request(endpoint, options = {}) {
        const useMock = true; // toggle this

        if (useMock) {
            return this.handleMockRequest(endpoint, options);
        }

        //Real API request
        const token = authService.getToken();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * Handle mock requests (for development without backend)
     * @param {*} endpoint
     * @param {*} options
     * @returns
     */
    async handleMockRequest(endpoint, options) {
        const method = options.method || 'GET';

        // simulate delay
        await new Promise((res) => setTimeout(res, 300));

        // COMPANIES
        if (endpoint === '/companies' && method === 'GET') {
            return await mockDataService.getAllCompanies();
        }

        if (endpoint.startsWith('/companies/') && method === 'GET') {
            const id = endpoint.split('/')[2];
            return await mockDataService.getCompanyById(id);
        }

        if (endpoint.startsWith('/companies/') && method === 'PUT') {
            const id = endpoint.split('/')[2];
            const data = JSON.parse(options.body);
            return await mockDataService.updateCompany(id, data);
        }

        throw new Error(`Mock route not implemented: ${method} ${endpoint}`);
    }
}

export default new ApiService();
