import {useEffect, useState} from "react";
import {getStudent, updateStudent as updateStudentAPI} from "../../apis/student-api.ts";
import Loading from "../../globals/loading.tsx";
import EditStudentModal from "../modals/student-modals/edit-student-modal.tsx";
import {useError} from "../../globals/error-provider.tsx";
import "../student_waiting.css";

export interface UIStudent {
    name: string;
    email: string;
    course: string;
}

function StudentLandingPage({studentId}: { studentId: number }) {
    const [student, setStudent] = useState<UIStudent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    const {showError} = useError();

    useEffect(() => {
        async function loadStudent() {
            try {

                const studentData = await getStudent(studentId);

                if (!studentData) {
                    return;
                }

                setStudent({
                    name: studentData.name,
                    email: studentData.email,
                    course: studentData.course
                });

                setShowEditModal(false);

            } catch (error) {

                console.error(
                    "Student konnte nicht geladen werden",
                    error
                );

                if (error instanceof Error) {
                    showError(error.message);
                } else {
                    showError("Student konnte nicht geladen werden!");
                }

            } finally {
                setIsLoading(false);
            }
        }

        void loadStudent();
    }, [studentId]);


    async function handleUpdateStudent(data: UIStudent) {
        try {
            const updatedStudent = await updateStudentAPI({
                id: studentId,
                name: data.name,
                email: data.email,
                course: data.course
            });

            setStudent({
                name: updatedStudent.name,
                email: updatedStudent.email,
                course: updatedStudent.course
            });
            setShowEditModal(false);

            console.log(
                "Student geupdated:",
                updatedStudent
            );

        } catch (error) {

            console.error(
                "Student konnte nicht aktualisiert werden:",
                error
            );

            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError("Student konnte nicht aktualisiert werden!");
            }
        }
    }
    if (isLoading) {
        return <Loading/>;
    }
    if (!student) {
        return (
            <main className="student-waiting-page">

                <div className="student-waiting-glass">

                    <h1>
                        Student konnte nicht geladen werden
                    </h1>

                </div>

            </main>
        );
    }

    return (
        <main className="student-waiting-page">

            <div className="student-waiting-glass">

                <h1>
                    Noch keine Thesis zugeordnet
                </h1>


                <p>
                    Dein Professor hat für dich noch keine Thesis angelegt.
                </p>


                <p>
                    Sobald deine Thesis erstellt wurde,
                    wird dein Dashboard automatisch freigeschaltet.
                </p>


                <div className="student-waiting-info">

                    <div className="student-waiting-info-row">

                        <span>
                            Name
                        </span>

                        <strong>
                            {student.name}
                        </strong>

                    </div>


                    <div className="student-waiting-info-row">

                        <span>
                            E-Mail
                        </span>

                        <strong>
                            {student.email}
                        </strong>

                    </div>


                    <div className="student-waiting-info-row">

                        <span>
                            Studiengang
                        </span>

                        <strong>
                            {student.course}
                        </strong>

                    </div>

                </div>


                <button
                    className="student-waiting-edit-button"
                    onClick={() => {
                        setShowEditModal(true);
                    }}
                >
                    Daten bearbeiten
                </button>

            </div>

            {showEditModal && (

                <EditStudentModal

                    onCancel={() => {
                        setShowEditModal(false);
                    }}

                    onSubmit={handleUpdateStudent}

                    student={student}
                />

            )}

        </main>
    );
}

export default StudentLandingPage;