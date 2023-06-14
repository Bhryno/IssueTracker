import { createContext } from 'react'
import { CurrentUser } from '../../typescript-interfaces/current-user.interface'

/**
 * Creates a context for the current user.
 *
 * @param {CurrentUser} defaultCurrentUser The default value for the current user.
 * @returns {Context} The context object.
 */
const CurrentUserContext = createContext<CurrentUser>({
    id: '',
    email: '',
    displayName: '',
    role: '',
    myTickets: [],
    projects: []
})

export default CurrentUserContext
