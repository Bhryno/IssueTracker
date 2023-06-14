import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

/**
 * Creates a configuration object for Firebase.
 *
 * @param {string} apiKey The API key for your Firebase project.
 * @param {string} authDomain The auth domain for your Firebase project.
 * @param {string} databaseURL The database URL for your Firebase project.
 * @param {string} projectId The project ID for your Firebase project.
 * @param {string} storageBucket The storage bucket for your Firebase project.
 * @param {string} messagingSenderId The messaging sender ID for your Firebase project.
 * @param {string} appId The app ID for your Firebase project.
 * @param {string} measurementId The measurement ID for your Firebase project.
 * @returns {object} The configuration object.
 */
const config = {
    apiKey: 'AIzaSyBcSu1C4Qdud_a52NOWikVSOj0njkwODpc',
    authDomain: 'bugtrail-v2.firebaseapp.com',
    databaseURL: 'https://bugtrail-v2.firebaseio.com',
    projectId: 'bugtrail-v2',
    storageBucket: 'bugtrail-v2.appspot.com',
    messagingSenderId: '723885045033',
    appId: '1:723885045033:web:4eeef384d51bf7c025b338',
    measurementId: 'G-VH49TBGZ9N'
}

firebase.initializeApp(config)

/**
 * Creates a Firebase document for a user profile.
 *
 * @param {firebase.User} userAuth The user authentication object, or null if the user is not authenticated.
 * @param {any} additionalData Any additional data to be added to the document.
 * @returns {Promise<firebase.DocumentSnapshot>} A promise that resolves to the document snapshot.
 */
export const createUserProfileDocument = async (
    userAuth: firebase.User | null,
    additionalData: any
) => {
    if (!userAuth) return

    // Gets user ID
    const userRef = firestore.doc(`users/${userAuth.uid}`)
    // Gets user properties
    const snapShot = await userRef.get()

    // Assigns new user snapshot to any new account.
    if (!snapShot.exists) {
        const { displayName, email } = userAuth
        const createdAt = new Date()
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                myTickets: [''],
                ...additionalData
            })
        } catch (error: any) {
            console.log('error creating user', error)
        }
    }

    return userRef
}

/**
 * Gets the current user from Firebase Authentication.
 *
 * @returns A Promise that resolves with the current user, or rejects with an error.
 */
export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe()
            resolve(userAuth)
        }, reject)
    })
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()

export const googleProvider = new firebase.auth.GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider)

export default firebase
