/**
 * Resource Service
 * Provides CRUD methods for resources
 * Methods will be chnaged to make API calls in Phase 2
 */

import apiService from '../apiService.js';
import mockDataService from '../mockDataService.js';
import { Resource } from '../../models/DataModels.js';

class ResourceService {
    /* Resource Methods */
    /**
     * Retrieves all resources.
     * @returns {Promise<Resource[]>} List of resources
     */
    async getResources() {
        //return await apiService.get('/resources'); // For Phase 2
        //await mockDataService.simulateDelay();

        return mockDataService.resources;
    }

    /**
     * Retrieves an resource by its ID.
     * @param {string} id - The ID of the resource
     * @returns {Promise<Resource>} The resource object
     * @throws {Error} If no resource with the given ID is found
     */
    async getResourceById(id) {
        //return await apiService.get('/resources/:id'); // For Phase 2
        await mockDataService.simulateDelay();

        const resources = await this.getResources();
        const resource = resources.find((resource) => resource.id === id);
        if (!resource) throw new Error(`No resource with id of '${id}' was found`);
        return resource;
    }

    async getResourcetById(id) {
        return this.getResourceById(id);
    }

    /**
     * Creates a new resource.
     * @param {Object} data - Resource data used to create the resource
     * @returns {Promise<Resource>} The created resource object
     */
    async createResource(data) {
        //return await apiService.post('/resources', data); // For Phase 2
        await mockDataService.simulateDelay();

        const newResource = new Resource({
            ...data,
            id: mockDataService.generateId('r_'),
            status: 'active',
        });
        mockDataService.resources.push(newResource);
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
        await mockDataService.simulateDelay();

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
        await mockDataService.simulateDelay();

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
        await mockDataService.simulateDelay();

        const resources = await this.getResources();
        const resource = resources.find((resource) => resource.id === id);
        if (!resource) throw new Error(`No resource with id of '${id}' was found`);

        resource.status = updatedStatus;
    }
}
export default new ResourceService();
