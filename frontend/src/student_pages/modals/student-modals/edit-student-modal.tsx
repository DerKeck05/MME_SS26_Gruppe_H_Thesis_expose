import {useState} from "react";
import {X} from "lucide-react";
import type {UIStudent} from "../../route_handling/student-landing-page.tsx";
import "./edit-student-modal.css";

interface EditStudentModalProps {
    onCancel: () => void;
    onSubmit: (fields: EditStudentFields) => void;
    student: UIStudent;
}

interface EditStudentFields {
    name: string;
    email: string;
    course: string;
}

//TODO kommentieren?

function EditStudentModal({
    onCancel,
    onSubmit,
    student
}: EditStudentModalProps) {

    const [studName, setStudName] = useState(student.name);
    const [studEmail, setStudEmail] = useState(student.email);
    const [studCourse, setStudCourse] = useState(student.course);


    const isNameValid =
        studName.trim().length > 0 &&
        studName.trim().length <= 50;


    const isEmailValid =
        studEmail.trim().length > 0 &&
        studEmail.includes("@");


    const isCourseValid =
        studCourse.trim().length > 0 &&
        studCourse.trim().length <= 50;


    const isFormValid =
        isNameValid &&
        isEmailValid &&
        isCourseValid;


    function saveStudent() {

        if (!isFormValid) {
            return;
        }

        onSubmit({
            name: studName.trim(),
            email: studEmail.trim(),
            course: studCourse.trim()
        });
    }


    return (
        <div
            className="student-edit-backdrop"
            onClick={onCancel}
        >

            <div
                className="student-edit-glass"
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >

                <div className="student-edit-header">

                    <h2>
                        Daten bearbeiten
                    </h2>

                    <button
                        type="button"
                        className="student-edit-close"
                        onClick={onCancel}
                        aria-label="Fenster schließen"
                    >
                        <X size={22}/>
                    </button>

                </div>


                <div className="student-edit-form">

                    <label htmlFor="student-name">
                        Name:
                    </label>

                    <input
                        id="student-name"
                        type="text"
                        value={studName}
                        onChange={(event) => {
                            setStudName(event.target.value);
                        }}
                        maxLength={50}
                    />


                    <label htmlFor="student-email">
                        E-Mail:
                    </label>

                    <input
                        id="student-email"
                        type="email"
                        value={studEmail}
                        onChange={(event) => {
                            setStudEmail(event.target.value);
                        }}
                        maxLength={50}
                    />


                    <label htmlFor="student-course">
                        Studiengang:
                    </label>

                    <input
                        id="student-course"
                        type="text"
                        value={studCourse}
                        onChange={(event) => {
                            setStudCourse(event.target.value);
                        }}
                        maxLength={50}
                    />


                    <div className="student-edit-actions">

                        <button
                            type="button"
                            className="student-edit-cancel"
                            onClick={onCancel}
                        >
                            Abbrechen
                        </button>


                        <button
                            type="button"
                            className="student-edit-save"
                            disabled={!isFormValid}
                            onClick={saveStudent}
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