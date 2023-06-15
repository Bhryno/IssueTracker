import React, { useContext, useEffect, useState } from 'react'
import CurrentUserContext from '../../providers/current-user/current-user.provider'
import { CurrentUser } from '../../typescript-interfaces/current-user.interface'
import { v4 } from 'uuid'
import { firestore as db, storage } from '../../firebase/firebase.utils'
import firebase, { firestore } from 'firebase/app'
import './defect-form.styles.scss'
import { useParams } from 'react-router-dom'

const DefectForm = () => {
    // Defaults reducer states for the defect form.
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [defectImage, setDefectImage] = useState<File>()
    const [priority, setPriority] = useState('')
    const [projectName, setProjectName] = useState('')

    const { projectId } = useParams<{ projectId: string }>()
    // Gets the current user.
    const currentUser: CurrentUser = useContext(CurrentUserContext)

    useEffect(() => {
        // Get the project name from Firestore.
        db.collection('projects')
            .doc(projectId)
            .get()
            .then((doc: firestore.DocumentData) => {
                // Set the project name state.
                setProjectName(doc.data().name)
            })
            .catch(error => {
                // Log an error if the project name couldn't be fetched.
                console.error("Couldn't fetch project name: ", error)
            })
    }, [projectId]) // This dependency array ensures that the array ensures that the effect is only run when the projectId state variable changes.

    /**
     * Handles changes to an input element.
     *
     * @param event The event object that was triggered by the change.
     */
    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        // Gets the name and value of the event listener.
        const { name, value } = event.target

        // Switch case minimises boilerplate code.
        switch (name) {
            case 'title':
                setTitle(value)
                break

            case 'description':
                setDescription(value)
                break

            case 'priority':
                setPriority(value)
                break

            default:
                break
        }
    }

    /**
     * Handles changes to the defect image input element.
     *
     * @param event The event object that was triggered by the change.
     */
    const handleDefectImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        // Checks if the file size is less than 3MB.
        if (event.target.files && event.target.files[0].size <= 3145728) {
            // Sets the defectImage state variable to the file object.
            setDefectImage(
                event.target.files ? event.target.files[0] : undefined
            )
            console.log(defectImage)
        } else {
            alert('The maximum image size allowed is 3MB')
            setDefectImage(undefined)
        }
    }

    /**
     * Handles the submission of a form.
     *
     * @param event The event object that was triggered by the submit.
     */
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        const uid = v4()
        const createdAt = new Date()
        let imageUrl = ''

        if (defectImage) {
            var storageRef = storage.ref()

            var metadata = {
                contentType: 'image/jpeg'
            }

            var uploadTask = storageRef
                .child('images/' + uid)
                .put(defectImage, metadata)

            // Listen for changes to the upload task state.
            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                function (snapshot: firebase.storage.UploadTaskSnapshot) {
                    // If the task is in the "success" state, the file has been uploaded.
                    var progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('Upload is ' + progress + '% done')
                    switch (snapshot.state) {
                        // Do something with the file (i.e. update database/display a message).
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused')
                            break
                        // File uploaded failed.
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running')
                            break
                    }
                },
                (error: Error) => {
                    console.error("Couldn't upload image: ", error)
                },
                () => {
                    uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then(function (downloadURL: string) {
                            console.log('File available at', downloadURL)
                            imageUrl = downloadURL
                        })
                        .then(() => {
                            db.collection('tickets')
                                .doc(uid)
                                .set({
                                    owner: {
                                        id: currentUser.id,
                                        displayName: currentUser.displayName,
                                        email: currentUser.email
                                    },
                                    project: {
                                        projectId,
                                        projectName
                                    },
                                    title,
                                    description,
                                    imageUrl,
                                    priority,
                                    createdAt,
                                    status: 'unassigned',
                                    assignee: {
                                        id: '',
                                        displayName: '',
                                        email: ''
                                    },
                                    logs: [
                                        {
                                            personName: currentUser.displayName,
                                            personRole: currentUser.role,
                                            timestamp: createdAt,
                                            statusChangedTo: 'created'
                                        }
                                    ],
                                    comments: []
                                })
                                .then(() => {
                                    console.log(
                                        'Ticket submitted successfully!'
                                    )
                                })
                                .then(() => {
                                    setTitle('')
                                    setDescription('')
                                    setPriority('')
                                    setDefectImage(undefined)
                                })
                                .catch(function (error) {
                                    console.error(
                                        'Error creating ticket: ',
                                        error
                                    )
                                })
                        })
                }
            )
        } else {
            db.collection('tickets')
                .doc(uid)
                .set({
                    owner: {
                        id: currentUser.id,
                        displayName: currentUser.displayName,
                        email: currentUser.email
                    },
                    project: {
                        projectId,
                        projectName
                    },
                    title,
                    description,
                    imageUrl,
                    priority,
                    createdAt,
                    status: 'unassigned',
                    assignee: {
                        id: '',
                        displayName: '',
                        email: ''
                    },
                    logs: [
                        {
                            personName: currentUser.displayName,
                            personRole: currentUser.role,
                            timestamp: createdAt,
                            statusChangedTo: 'created'
                        }
                    ],
                    comments: []
                })
                .then(() => {
                    console.log('Ticket submitted successfully!')
                })
                .then(() => {
                    setTitle('')
                    setDescription('')
                    setPriority('')
                    setDefectImage(undefined)
                })
                .catch(function (error) {
                    console.error('Error creating ticket: ', error)
                })
        }

        db.collection('users')
            .doc(currentUser.id)
            .set(
                {
                    myTickets: [...currentUser.myTickets, uid]
                },
                { merge: true }
            )
    }

    return (
        <div
            className={'pt-3 pl-2 pr-2 mt-5 mr-3 ml-3'}
            style={{ minHeight: '86vh' }}
        >
            <h1 className={'text-center'}>
                Raising a new defect for: {projectName}
            </h1>
            <form className={'mb-5'} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="defectTitle">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        id="defectTitle"
                        placeholder="Issue title here..."
                        value={title}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="defectDescription">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        id="defectDescription"
                        placeholder="Write a detailed description of the issue here..."
                        rows={3}
                        value={description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="defectImage">Defect Image</label>
                    <input
                        type="file"
                        name="defectImage"
                        className="form-control-file"
                        onChange={handleDefectImageChange}
                        id="defectImage"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="defectPriority">Priority Level</label>
                    <select
                        className="form-control"
                        name="priority"
                        id="defectPriority"
                        value={priority}
                        onChange={handleChange}
                    >
                        <option>--Select--</option>
                        <option>Severe</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                        <option>Feature request</option>
                    </select>
                </div>
                <button type={'submit'} className={'btn btn-dark'}>
                    Submit Defect
                </button>
            </form>
        </div>
    )
}

export default DefectForm
