import { useState} from "react";
import {  X} from "lucide-react";
import type {  UIStudent} from "../../route_handling/student-landing-page.tsx";
import "./edit-student-modal.css";

/*
These properties are passed
to the edit student modal.
onCancel closes the modal.
onSubmit sends the changed
student information back
to the parent component.
student contains the current
student information.
*/
interface EditStudentModalProps {
    onCancel: () => void;
    onSubmit: (fields: EditStudentFields) => void;
    student: UIStudent;
}


/*
This type describes the fields
that can be changed in the modal.
*/
interface EditStudentFields {
    name: string;
    email: string;
    course: string;
}


function EditStudentModal({
    onCancel,
    onSubmit,
    student
}: EditStudentModalProps) {

    /*
    The input fields start
    with the current student information.
    Changes made by the user
    are stored in these states.
    */
    const [
        studName,
        setStudName
    ] = useState(
        student.name
    );

    const [
        studEmail,
        setStudEmail
    ] = useState(
        student.email
    );

    const [
        studCourse,
        setStudCourse
    ] = useState(
        student.course
    );


    /*
    The name must contain text
    and cannot be longer than 50 characters.
    */
    const isNameValid =
        studName.trim().length > 0 &&
        studName.trim().length <= 50;


    /*
    The email must contain text
    and must contain an @ character.
    */
    const isEmailValid =
        studEmail.trim().length > 0 &&
        studEmail.includes("@");


    /*
    The course must contain text
    and cannot be longer than 50 characters.
    */
    const isCourseValid =
        studCourse.trim().length > 0 &&
        studCourse.trim().length <= 50;


    /*
    The form is only valid
    if all three fields are valid.
    */
    const isFormValid =
        isNameValid &&
        isEmailValid &&
        isCourseValid;


    /*
    Invalid data is not submitted.
    Before sending the values,
    unnecessary spaces at the beginning
    and end are removed.
    */
    function saveStudent() {

        if (
            isFormValid == false
        ) {

            return;
      }


        onSubmit({
            name:
                studName.trim(),

            email:
                studEmail.trim(),

            course:
                studCourse.trim()
        });
    }


    return (

        /*
        Clicking on the dark background
        closes the modal.
        */
        <div
            className="student-edit-backdrop"
            onClick={
                onCancel
            }
        >

            {/*
            stopPropagation prevents
            a click inside the modal
            from also triggering
            the backdrop click.
            */}
            <div
                className="student-edit-glass"
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >

                {/* MODAL HEADER */}

                <div className="student-edit-header">

                    <h2>
                        Daten bearbeiten
                    </h2>

                    {/*
                    The X icon closes
                    the modal without saving.
                    */}
                    <button
                        type="button"
                        className="student-edit-close"
                        onClick={
                            onCancel
                        }
                        aria-label="Fenster schließen"
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* FORMULAR */}

                <div className="student-edit-form">


                    {/* NAME */}

                    <label htmlFor="student-name">
                        Name:
                    </label>

                    <input
                        id="student-name"
                        type="text"
                        value={
                            studName
                        }
                        onChange={(event) => {
                            setStudName(
                                event.target.value
                            );
                        }}
                        maxLength={50}
                    />


                    {/* E-MAIL */}

                    <label htmlFor="student-email">
                        E-Mail:
                    </label>

                    <input
                        id="student-email"
                        type="email"
                        value={
                            studEmail
                        }
                        onChange={(event) => {
                            setStudEmail(
                                event.target.value
                            );
                        }}
                        maxLength={50}
                    />


                    {/* STUDIENGANG */}

                    <label htmlFor="student-course">
                        Studiengang:
                    </label>

                    <input
                        id="student-course"
                        type="text"
                        value={
                            studCourse
                        }
                        onChange={(event) => {
                            setStudCourse(
                                event.target.value
                            );
                        }}
                        maxLength={50}
                    />


                    {/* FORMULAR BUTTONS */}

                    <div className="student-edit-actions">

                        <button
                            type="button"
                            className="student-edit-cancel"
                            onClick={
                                onCancel
                            }
                        >
                            Abbrechen
                        </button>


                        <button
                            type="button"
                            className="student-edit-save"
                            disabled={
                                isFormValid == false
                            }
                            onClick={
                                saveStudent
                            }
                        >
                            Speichern
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default EditStudentModal;