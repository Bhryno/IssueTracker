/**
 * The CurrentUser interface represents the current user in the application.
 *
 * @property {string} id The unique ID of the user.
 * @property {string} email The email address of the user.
 * @property {string} displayName The display name of the user.
 * @property {string} role The role of the user.
 * @property {Array<string>} myTickets An array of the IDs of the tickets that the user owns.
 * @property {Array<string>} projects An array of the IDs of the projects that the user is a member of.
 */
export interface CurrentUser {
    id: string
    email: string
    displayName: string
    role: string
    myTickets: Array<string>
    projects: Array<string>
}
