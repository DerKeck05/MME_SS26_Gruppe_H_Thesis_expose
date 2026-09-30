import {useEffect, useState} from "react";
import {getStudent,updateStudent as updateStudentAPI} from "../../apis/student-api.ts";
import Loading from "../../globals/loading.tsx";
import EditStudentModal from "../modals/student-modals/edit-student-modal.tsx";
import {useError} from "../../globals/error-provider.tsx";
import "../student_waiting.css";

/*
This type contains the student information
that is needed on the waiting page
nd inside the edit modal.
The type is exported because
EditStudentModal also uses it.
*/
export interface UIStudent {
    name: string;
    email: string;
    course: string;
}


/*
The page needs the ID
of the currently logged in student.
*/
type StudentLandingPageProps = {
    studentId: number;
};


function StudentLandingPage({
    studentId
}: StudentLandingPageProps) {

    /*
    Stores the student information
    loaded from the backend.
    null means that no student
    has been loaded yet.
    */
    const [
        student,
        setStudent
    ] = useState<UIStudent | null>(null);


    /*
    While the student data is loading,
    the Loading component is shown.
    */
    const [
        isLoading,
        setIsLoading
    ] = useState(true);


    /*
    Stores if the modal
    for editing student data
    is currently open.
    */
    const [
        showEditModal,
        setShowEditModal
    ] = useState(false);


    /*
    showError displays errors
    using the global error provider.
    */
    const {
        showError
    } = useError();


    /*
    Whenever the student ID changes,
    the current student information
    is loaded from the backend.
    */
    useEffect(() => {

        async function loadStudent() {

            try {

                const studentData =
                    await getStudent(
                        studentId
                    );


                /*
                If no student was returned,
                there is nothing to display.
                */
                if (
                    studentData == null
                ) {

                    return;
                }


                /*
                Only the information
                needed by this page
                is stored in the UI state.
                */
                setStudent({
                    name:
                        studentData.name,

                    email:
                        studentData.email,

                    course:
                        studentData.course
                });


                /*
                Close the edit modal
                if a different student
                was loaded.
                */
                setShowEditModal(
                    false
                );


            } catch (error) {

                console.error(
                    "Student konnte nicht geladen werden:",
                    error
                );


                if (
                    error instanceof Error
                ) {

                    showError(
                        error.message
                    );

                } else {

                    showError(
                        "Student konnte nicht geladen werden!"
                    );
                }


            } finally {

                /*
                Loading is finished
                whether the request
                was successful or not.
                */
                setIsLoading(
                    false
                );
            }
        }


        loadStudent();

    }, [
        studentId
    ]);


    /*
    Receives the edited information
    from EditStudentModal
    and sends it to the backend.
    All fields are always sent,
    including values that were not changed.
    */
    async function handleUpdateStudent(
        data: UIStudent
    ) {

        try {

            const updatedStudent =
                await updateStudentAPI({
                    id:
                        studentId,

                    name:
                        data.name,

                    email:
                        data.email,

                    course:
                        data.course
                });


            /*
            Replace the local student information
            with the updated data
            returned by the backend.
            */
            setStudent({
                name:
                    updatedStudent.name,

                email:
                    updatedStudent.email,

                course:
                    updatedStudent.course
            });


            /*
            Close the modal
            after the update was successful.
            */
            setShowEditModal(
                false
            );


        } catch (error) {

            console.error(
                "Student konnte nicht aktualisiert werden:",
                error
            );


            if (
                error instanceof Error
            ) {

                showError(
                    error.message
                );

            } else {

                showError(
                    "Student konnte nicht aktualisiert werden!"
                );
            }
        }
    }


    /*
    The normal page is not shown
    before the student request is finished.
    */
    if (
        isLoading
    ) {

        return (
            <Loading />
        );
    }


    /*
    This message is shown
    if no student data could be loaded.
    */
    if (
        student == null
    ) {

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
        /*
        This page is shown
        while the professor has not created
        a thesis for the student yet.
        */
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


                {/*
                Shows the current information
                stored for the student.
                */}
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


                {/* DATEN BEARBEITEN */}

                <button
                    className="student-waiting-edit-button"
                    onClick={() => {

                        setShowEditModal(
                            true
                        );

                    }}
                >
                    Daten bearbeiten
                </button>

            </div>


            {/*
            The modal is only rendered
            while showEditModal is true.
            */}
            {
                showEditModal == true && (

                    <EditStudentModal
                        onCancel={() => {

                            setShowEditModal(
                                false
                            );

                        }}
                        onSubmit={
                            handleUpdateStudent
                        }
                        student={
                            student
                        }
                    />
                )
            }

        </main>
    );
}

export default StudentLandingPage;