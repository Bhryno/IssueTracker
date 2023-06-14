import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import DefectForm from './components/defect-form/defect-form.component'
import EditDefect from './components/edit-defect/edit-defect.component'
import Footer from './components/footer/footer.component'
import Navbar from './components/navbar/navbar.component'
import ViewTickets from './components/view-tickets/view-tickets.component'
import { auth, createUserProfileDocument } from './firebase/firebase.utils'
import Homepage from './pages/homepage/homepage.component'
import ProjectForm from './pages/project-form/project-form.component'
import ProjectDetails from './pages/projects-details/projects-details.component'
import Projects from './pages/projects/projects.component'
import RegisterAndLogin from './pages/register-and-login/register-and-login.component'
import TicketDetailsPage from './pages/ticket-details/ticket-details.component'
import CurrentUserContext from './providers/current-user/current-user.provider'
import { CurrentUser } from './typescript-interfaces/current-user.interface'

const Routes = () => {
    /**
     * Creates a state variable for the current user.
     *
     * @param {CurrentUser} initialState The initial value of the state variable.
     * @returns {[CurrentUser, Function]} A tuple of the state variable and a function to set the state variable.
     */
    const [currentUser, setCurrentUser] = useState<CurrentUser>({
        id: '',
        email: '',
        displayName: '',
        role: '',
        myTickets: [],
        projects: []
    })

    useEffect(() => {
        const unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                // Creates a new user profile document.
                const userRef = await createUserProfileDocument(
                    userAuth,
                    undefined
                )

                // Listen for changes to the user profile doocument.
                userRef?.onSnapshot(snapShot => {
                    // Update the current user with the new data.
                    setCurrentUser({
                        id: snapShot.id,
                        email: snapShot.data()?.email,
                        displayName: snapShot.data()?.displayName,
                        role: snapShot.data()?.role,
                        myTickets: snapShot.data()?.myTickets,
                        projects: snapShot.data()?.projects
                    })
                })
            }
        })
        // Unsubscribe from the auth state changes and user profile snapshot when the component unmounts.
        return () => {
            unsubscribeFromAuth()
        }
    }, [])

    return (
        <div>
            <CurrentUserContext.Provider value={currentUser}>
                <BrowserRouter>
                    <Navbar />
                    <Switch>
                        {/* Initialises separate page routes. */}
                        <Route
                            exact
                            path={'/bugtrail-v3'}
                            component={Homepage}
                        />
                        <Route
                            exact
                            path={'/bugtrail-v3/register-and-login'}
                            component={RegisterAndLogin}
                        />
                        <Route
                            exact
                            path={'/bugtrail-v3/new-defect/:projectId'}
                            component={DefectForm}
                        />
                        <Route
                            exact
                            path={'/bugtrail-v3/new-project'}
                            component={ProjectForm}
                        />
                        <Route
                            path={'/bugtrail-v3/view-tickets'}
                            component={ViewTickets}
                        />
                        <Route
                            exact
                            path={'/bugtrail-v3/ticket-details/:ticketId'}
                            component={TicketDetailsPage}
                        />
                        <Route
                            exact
                            path={'/bugtrail-v3/projects'}
                            component={Projects}
                        />
                        <Route
                            exact
                            path={'/bugtrail-v3/project-details/:projectId'}
                            component={ProjectDetails}
                        />
                        <Route
                            exact
                            path={'/bugtrail-v3/edit-defect/:defectId'}
                            component={EditDefect}
                        />
                    </Switch>
                </BrowserRouter>
            </CurrentUserContext.Provider>
            <Footer />
        </div>
    )
}

export default Routes
