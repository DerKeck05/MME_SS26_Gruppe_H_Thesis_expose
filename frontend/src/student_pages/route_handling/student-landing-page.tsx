import {useEffect, useState} from "react";
import {getStudent, updateStudent as updateStudentAPI} from "../../apis/student-api.ts";
import Loading from "../../globals/loading.tsx";
import EditStudentModal from "../modals/student-modals/edit-student-modal.tsx";

export interface UIStudent {
    name: string;
    email: string;
    course: string;
}

function StudentLandingPage({studentId}: { studentId: number }) {
    const [student, setStudent] = useState<UIStudent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        async function loadStudent() {
            try {
                const student = await getStudent(studentId);

                if (!student) return;

                setStudent({
                    name: student.name,
                    email: student.email,
                    course: student.course,
                });

                setShowEditModal(false);
            } catch (e) {
                console.error("Student konnte nicht geladen werden", e);
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
                course: data.course,
            });

            setStudent({
                name: updatedStudent.name,
                email: updatedStudent.email,
                course: updatedStudent.course,
            });

            setShowEditModal(false);

            console.log("Student geupdated:", updatedStudent);
        } catch (e) {
            console.error(
                "Student konnte nicht aktualisiert werden:",
                e
            );
        }
    }

    if (isLoading) {
        return <Loading/>;
    }

    if (!student) {
        return <div>Student konnte nicht geladen werden.</div>;
    }

    return (
        <div className="bg-(--background-grey) flex flex-col min-h-screen">
            <header className="app-bar">
                <div className="logo"></div>
                <h1>{student.name}</h1>
            </header>

            <div className="landing-page-body flex-1 flex justify-center p-(--spacing-large)">
                <div
                    className="
                        w-fit
                        max-w-[80%]
                        h-120
                        rounded-(--border-radius)
                        bg-white
                        flex
                        flex-col
                        items-center
                        justify-evenly
                        p-(--spacing-medium)
                    "
                >
                    <h2 className="text-(--dark-blue)">
                        Dir wurde noch keine Abschlussarbeit zugewiesen!
                    </h2>

                    <h3 className="text-(--dark-blue)">
                        Sobald dies geschehen ist, bekommst du vollen Zugriff.
                    </h3>

                    <div className={"flex flex-col items-center gap-2"}>
                        <div
                            className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 border-2 border-(--dark-blue) p-(--spacing-large) rounded-(--border-radius)">
                            <span className="font-semibold">Name:</span>
                            <span className="text-center">{student.name}</span>

                            <span className="font-semibold">Email:</span>
                            <span className="text-center">{student.email}</span>

                            <span className="font-semibold">Kurs:</span>
                            <span className="text-center">{student.course}</span>
                        </div>

                        <button
                            className={"bg-(--night-blue)! text-(--white)! p-(--spacing-small) rounded-(--border-radius)"}
                            onClick={() => {
                                setShowEditModal(true);
                            }}
                        >
                            Daten Bearbeiten
                        </button>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditStudentModal onCancel={() => {
                    setShowEditModal(false);
                }} onSubmit={handleUpdateStudent}
                student={student}/>
            )}
        </div>
    );
}

export default StudentLandingPage;