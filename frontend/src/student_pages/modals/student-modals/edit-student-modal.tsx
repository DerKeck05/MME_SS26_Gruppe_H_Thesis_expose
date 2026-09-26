import {Check, X} from "lucide-react";
import {useState} from "react";
import type {UIStudent} from "../../route_handling/student-landing-page.tsx";

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

function EditStudentModal({onCancel, onSubmit, student}: EditStudentModalProps) {
    const [studName, setStudName] = useState<string>(student.name);
    const [studEmail, setStudEmail] = useState<string>(student.email);
    const [studCourse, setStudCourse] = useState<string>(student.course);


    const isNameValid = studName.trim().length > 0 && studName.trim().length <= 50;
    const isEmailValid =
        studEmail.trim().length > 0 &&
        studEmail.includes("@");
    const isCourseValid = studCourse.trim().length > 0 && studCourse.trim().length <= 50;
    const isFormValid = isNameValid && isCourseValid && isEmailValid;

    return (
        <div className={"modal-backdrop"} onClick={onCancel}>
            <div
                className={"modal"}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Daten bearbeiten</h3>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="modal-close"
                        aria-label="Modal schließen"
                    >
                        <X/>
                    </button>
                </div>

                <div className={"modal-body flex flex-col items-center gap-2 justify-evenly"}>
                    <input type="text"
                           placeholder="Dein Name"
                           value={studName}
                           onChange={(event) =>
                               setStudName(event.target.value)
                           }
                           required={true}
                           maxLength={50}
                    />
                    <input type="email"
                           placeholder="Deine E-Mail"
                           value={studEmail}
                           onChange={(event) =>
                               setStudEmail(event.target.value)
                           }
                           required={true}
                           maxLength={50}
                    />
                    <input type="text"
                           placeholder="Dein Kurs"
                           value={studCourse}
                           onChange={(event) =>
                               setStudCourse(event.target.value)
                           }
                           required={true}
                           maxLength={50}
                    />

                </div>
                <button
                    className="squared-button modal-submit-button"
                    type="button"
                    disabled={!isFormValid}
                    onClick={() =>
                        onSubmit(
                            {
                                name: studName.trim(),
                                email: studEmail.trim(),
                                course: studCourse.trim()
                            }
                        )
                    }
                >
                    <Check/>
                </button>
            </div>
        </div>
    );
}

export default EditStudentModal;