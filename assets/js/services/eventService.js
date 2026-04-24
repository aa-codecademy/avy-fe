/**
 * Event Service
 * Provides CRUD methods for events
 * Methods will be chnaged to make API calls in Phase 2
 */

import apiService from './apiService.js';
import mockDataService from './mockDataService.js';
import { Event } from '../models/DataModels.js';

class EventService {
    /* Event Methods */
    /**
     * Retrieves all events.
     * @returns {Promise<Event[]>} List of events
     */
    async getEvents() {
        //return await apiService.get('/events'); // For Phase 2
        await mockDataService.simulateDelay();

        return mockDataService.events;
    }

    /**
     * Retrieves an event by its ID.
     * @param {string} id - The ID of the event
     * @returns {Promise<Event>} The event object
     * @throws {Error} If no event with the given ID is found
     */
    async getEventById(id) {
        // return await apiService.get('/events/:id'); // For Phase 2
        await mockDataService.simulateDelay();

        const events = await this.getEvents();
        const event = events.find((event) => event.id === id);
        if (!event) throw new Error(`No event with id of '${id}' was found`);
        return event;
    }

    /**
     * Creates a new event.
     * @param {Object} data - Event data used to create the event
     * @returns {Promise<Event>} The created event object
     */
    async createEvent(data) {
        //return await apiService.post('/events', data); // For Phase 2
        await mockDataService.simulateDelay();

        const newEvent = new Event({
            type: 'career-day',
            ...data,
            id: this.generateId('e_'),
            status: 'upcoming',
        });
        this.events.push(newEvent);
        return newEvent;
    }

    /**
     * Updates an existing event with new values.
     * @param {string} id - The ID of the event to update
     * @param {Object} updatePackage - Key-value pairs of fields to update
     * @returns {Promise<void>}
     * @throws {Error} If no event with the given ID is found
     */
    async updateEvent(id, updatePackage) {
        //return await apiService.put('/events/:id', updatePackage); // For Phase 2
        await mockDataService.simulateDelay();

        const events = await this.getEvents();
        const event = events.find((event) => event.id === id);
        if (!event) throw new Error(`No event with id of '${id}' was found`);

        Object.entries(updatePackage).forEach(([key, value]) => {
            if (key === id) return;
            event[key] = isNaN(value) ? value : Number(value);
        });
    }

    /**
     * Deletes an event by its ID.
     * @param {string} id - The ID of the event to delete
     * @returns {Promise<void>}
     * @throws {Error} If no event with the given ID is found
     */
    async deleteEvent(id) {
        //return await apiService.delete('/events/:id'); // For Phase 2
        await mockDataService.simulateDelay();

        const events = await this.getEvents();
        const event = events.find((event) => event.id === id);
        if (!event) throw new Error(`No event with id of '${id}' was found`);

        const index = events.findIndex((event) => event.id === id);
        events.splice(index, 1);
    }

    /**
     * Updates the status of an event.
     * @param {string} id - The ID of the event
     * @param {string} updatedStatus - The new status to set
     * @returns {Promise<void>}
     * @throws {Error} If no event with the given ID is found
     */
    async updateEventStatus(id, updatedStatus) {
        //return await apiService.put('/events/:id', updatedStatus); // For Phase 2
        await mockDataService.simulateDelay();

        const events = await this.getEvents();
        const event = events.find((event) => event.id === id);
        if (!event) throw new Error(`No event with id of '${id}' was found`);

        event.status = updatedStatus;
    }

    /* Utility */
    /**
     * Generates a unique ID using a prefix.
     * @param {string} prefix - The prefix 'e_' for events
     * @returns {string} The generated unique ID
     */
    generateId(prefix) {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2, 4);
    }
}

export default new EventService();
