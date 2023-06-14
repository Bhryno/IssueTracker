import { firestore } from 'firebase'

/**
 * The Ticket interface represents a ticket in the application.
 *
 * @property {string} id The unique ID of the ticket.
 * @property {string} projectId The ID of the project that the ticket belongs to.
 * @property {string} projectName The name of the project that the ticket belongs to.
 * @property {string} title The title of the ticket.
 * @property {string} description A description of the ticket.
 * @property {string} imageUrl The URL of an image that is associated with the ticket.
 * @property {string} priority The priority of the ticket.
 * @property {string} status The status of the ticket.
 * @property {string} owner The ID of the user who owns the ticket.
 * @property {string} assignee The ID of the user who is assigned to the ticket.
 * @property {string} createdAt The date and time that the ticket was created.
 * @property {Array<Log>} logs An array of logs that track changes to the ticket.
 * @property {Array<Comment>} comments An array of comments that have been made on the ticket.
 */
export interface Ticket {
    id: string
    project: {
        projectId: string
        projectName: string
    }
    title: string
    description: string
    imageUrl: string
    priority: string
    status: string
    owner: {
        displayName: string
        email: string
        id: string
    }
    assignee: {
        displayName: string
        email: string
        id: string
    }
    createdAt: string
    logs: Array<{
        personName: string
        personRole: string
        timestamp: firestore.Timestamp
        statusChangedTo: string
    }>
    comments: Array<{
        personName: string
        personRole: string
        timestamp: firestore.Timestamp
        comment: string
    }>
}
