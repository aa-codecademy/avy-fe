/**
 * Event Service
 * Provides CRUD methods for events
 * Methods will be chnaged to make API calls in Phase 2
 */

import apiService from '../apiService.js';
import { User, Event, EventNotification } from '../../models/DataModels.js';

// Generating Mock Events
const generateEvents = () => {
    const date1 = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const date2 = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
    const date3 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const eventArray = [
        new Event({
            id: generateId('e'),
            title: 'Career Day 2026',
            description: 'Meet top employers and explore career opportunities.',
            type: 'career-day',
            date: date1.toISOString().split('T')[0],
            time: '10:00',
            location: 'Avenga Academy - Skopje',
            isOnline: false,
            maxParticipants: 7,
            registeredUsers: [
                new User({
                    id: 'u1',
                    name: 'Test User 1',
                    role: 'student',
                    email: 'testuser1@gmail.com',
                }),
                new User({
                    id: 'u2',
                    name: 'Test User 2',
                    role: 'alumni',
                    email: 'testuser2@gmail.com',
                }),
                new User({
                    id: 'u3',
                    name: 'Test User 3',
                    role: 'student',
                    email: 'testuser3@gmail.com',
                }),
            ],
        }),
        new Event({
            id: generateId('e'),
            title: 'Web Development Workshop',
            description: 'Hands-on workshop on modern web development practices.',
            type: 'workshop',
            date: date2.toISOString().split('T')[0],
            time: '14:00',
            location: 'Online',
            isOnline: true,
            maxParticipants: 3,
            registeredUsers: [
                new User({
                    id: 'u4',
                    name: 'Test User 4',
                    role: 'alumni',
                    email: 'testuser4@gmail.com',
                }),
                new User({
                    id: 'u5',
                    name: 'Test User 5',
                    role: 'alumni',
                    email: 'testuser5@gmail.com',
                }),
            ],
        }),
        new Event({
            id: generateId('e'),
            title: 'Netwroking Day',
            description: 'Meet up with other students and establish networks.',
            type: 'networking',
            date: date3.toISOString().split('T')[0],
            time: '02:00',
            location: 'Avenga Academy - Skopje',
            isOnline: false,
            maxParticipants: 4,
            registeredUsers: [
                new User({
                    id: 'u6',
                    name: 'Test User 6',
                    role: 'student',
                    email: 'testuser6@gmail.com',
                }),
                new User({
                    id: 'u7',
                    name: 'Test User 7',
                    role: 'alumni',
                    email: 'testuser7@gmail.com',
                }),
                new User({
                    id: 'u8',
                    name: 'Test User8',
                    role: 'student',
                    email: 'testuser8@gmail.com',
                }),
                new User({
                    id: 'u9',
                    name: 'Test User 9',
                    role: 'student',
                    email: 'testuser9@gmail.com',
                }),
            ],
        }),
    ];

    return eventArray;
};

const generateId = (prefix) => {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
};

class EventService {
    constructor() {
        this.events = generateEvents();
    }

    /**
     * Retrieves all events.
     * @returns {Promise<Event[]>} List of events
     */
    async getEvents() {
        //return await apiService.get('/events'); // For Phase 2

        return this.events;
    }

    /**
     * Retrieves an event by its ID.
     * @param {string} id - The ID of the event
     * @returns {Promise<Event>} The event object
     * @throws {Error} If no event with the given ID is found
     */
    async getEventById(id) {
        //return await apiService.get('/events/:id'); // For Phase 2

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

        const newEvent = new Event({
            ...data,
            id: generateId('e'),
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

        const events = await this.getEvents();
        const event = events.find((event) => event.id === id);
        if (!event) throw new Error(`No event with id of '${id}' was found`);

        Object.entries(updatePackage).forEach(([key, value]) => {
            if (key === 'id') return;
            event[key] = value !== '' && !isNaN(value) ? Number(value) : value;
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

        const events = await this.getEvents();
        const event = events.find((event) => event.id === id);
        if (!event) throw new Error(`No event with id of '${id}' was found`);

        event.status = updatedStatus;
    }

    /**
     * Creates a new event notification.
     * @param {Object} data - Notification data used to create the event notification
     */
    async createNotification(data) {
        //return await apiService.post('/events/notifications', data); // For Phase 2

        //Simulation for backend logic
        const notification = new EventNotification({
            id: generateId('en'),
            eventId: data.eventId,
            message: data.message,
        });
        console.log('%c Notification sent successfully!', 'color: #56fc03', notification);
    }
}
export default new EventService();
