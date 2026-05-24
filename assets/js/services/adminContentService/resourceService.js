/**
 * Resource Service
 * Provides CRUD methods for resources
 * Methods will be chnaged to make API calls in Phase 2
 */

import apiService from '../apiService.js';
import { Resource } from '../../models/DataModels.js';

// Generating Mock Resources
const generateResources = () => {
    const resourceArray = [
        new Resource({
            id: generateId('r'),
            title: 'How to Write a Winning CV',
            description:
                'A comprehensive guide covering structure, tone, and the most common mistakes students make. Includes a downloadable template.',
            type: 'cv-guide',
            contentBody: 'Your CV is often the first impression you make on an employer...',
            externalUrl: 'https://www.themuse.com/advice/the-35-best-cv-tips-ever',
            isGlobal: true,
            programs: [],
            status: 'active',
            viewCount: 142,
            organizerId: '',
            createdAt: new Date().toISOString(),
        }),
        new Resource({
            id: generateId('r'),
            title: 'Acing Your First Interview',
            description:
                'Tips and techniques from industry professionals on how to prepare, present yourself, and follow up after an interview.',
            type: 'interview-prep',
            contentBody: 'Preparation is the key to interview success...',
            externalUrl: '',
            isGlobal: true,
            programs: [],
            status: 'active',
            viewCount: 98,
            organizerId: '',
            createdAt: new Date().toISOString(),
        }),
        new Resource({
            id: generateId('r'),
            title: 'Summer Internships 2026',
            description:
                'A curated list of open internship positions across tech, finance, and media sectors available to students this summer.',
            type: 'article',
            contentBody:
                'The following companies are currently accepting internship applications...',
            externalUrl: '',
            isGlobal: false,
            programs: ['full-stack-web-developement', 'data-science'],
            status: 'active',
            viewCount: 76,
            organizerId: '',
            createdAt: new Date().toISOString(),
        }),
        new Resource({
            id: generateId('r'),
            title: 'Portfolio Template – Creative Track',
            description:
                'A ready-to-use portfolio template designed for students in design and creative programs.',
            type: 'portfolio-template',
            contentBody: 'Download the template and follow the setup instructions...',
            externalUrl: 'https://www.figma.com',
            isGlobal: false,
            programs: ['quality-assurance'],
            status: 'active',
            viewCount: 33,
            organizerId: '',
            createdAt: new Date().toISOString(),
        }),
    ];
    return resourceArray;
};

const generateId = (prefix) => {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
};

class ResourceService {
    constructor() {
        this.resources = generateResources();
    }

    /**
     * Retrieves all resources.
     * @returns {Promise<Resource[]>} List of resources
     */
    async getResources() {
        //return await apiService.get('/resources'); // For Phase 2

        return this.resources;
    }

    /**
     * Retrieves an resource by its ID.
     * @param {string} id - The ID of the resource
     * @returns {Promise<Resource>} The resource object
     * @throws {Error} If no resource with the given ID is found
     */
    async getResourceById(id) {
        //return await apiService.get('/resources/:id'); // For Phase 2

        const resources = await this.getResources();
        const resource = resources.find((resource) => resource.id === id);
        if (!resource) throw new Error(`No resource with id of '${id}' was found`);
        return resource;
    }

    /**
     * Creates a new resource.
     * @param {Object} data - Resource data used to create the resource
     * @returns {Promise<Resource>} The created resource object
     */
    async createResource(data) {
        //return await apiService.post('/resources', data); // For Phase 2

        const newResource = new Resource({
            ...data,
            id: generateId('r'),
            status: 'active',
        });
        this.resources.push(newResource);
        return newResource;
    }

    /**
     * Updates an existing resource with new values.
     * @param {string} id - The ID of the resource to update
     * @param {Object} updatePackage - Key-value pairs of fields to update
     * @returns {Promise<void>}
     * @throws {Error} If no resource with the given ID is found
     */
    async updateResource(id, updatePackage) {
        //return await apiService.put('/resources/:id', updatePackage); // For Phase 2

        const resources = await this.getResources();
        const resource = resources.find((resource) => resource.id === id);
        if (!resource) throw new Error(`No resource with id of '${id}' was found`);

        Object.entries(updatePackage).forEach(([key, value]) => {
            if (key === id) return;
            resource[key] = isNaN(value) ? value : Number(value);
        });
    }

    /**
     * Deletes a resource by its ID.
     * @param {string} id - The ID of the resource to delete
     * @returns {Promise<void>}
     * @throws {Error} If no resource with the given ID is found
     */
    async deleteResource(id) {
        //return await apiService.delete('/resources/:id'); // For Phase 2

        const resources = await this.getResources();
        const resource = resources.find((resource) => resource.id === id);
        if (!resource) throw new Error(`No resource with id of '${id}' was found`);

        const index = resources.findIndex((resource) => resource.id === id);
        resources.splice(index, 1);
    }

    /**
     * Updates the status of a resource.
     * @param {string} id - The ID of the resource
     * @param {string} updatedStatus - The new status to set
     * @returns {Promise<void>}
     * @throws {Error} If no event with the given ID is found
     */
    async updateResourceStatus(id, updatedStatus) {
        //return await apiService.put('/resources/:id', updatedStatus); // For Phase 2

        const resources = await this.getResources();
        const resource = resources.find((resource) => resource.id === id);
        if (!resource) throw new Error(`No resource with id of '${id}' was found`);

        resource.status = updatedStatus;
    }
}
export default new ResourceService();
