import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./prof_startpage.css";
import "./prof_thesis_modal.css";


const API_URL =
    import.meta.env.VITE_API_URL;


/*
This type contains the student information
that is needed on the professor start page.
A student can already have a thesis
or can have no thesis yet.
*/
type Student = {
    id: number;
    name: string;
    email: string;
    course: string;

    thesis: {
        id: number;
        title: string;
    } | null;
};


function ProfStartpage() {

    /*
    useNavigate is used
    to open the thesis page
    of a student.
    */
    const navigate =
        useNavigate();


    /*
    Stores if the modal
    for creating a thesis is open.
    */
    const [
        showThesisModal,
        setShowThesisModal
    ] = useState(false);


    /*
    Stores all students
    assigned to the logged in professor.
    */
    const [
        students,
        setStudents
    ] = useState<Student[]>([]);


    /*
    Stores the student
    for whom a new thesis should be created.
    */
    const [
        selectedStudent,
        setSelectedStudent
    ] = useState<Student | null>(null);


    /*
    These states store the information
    entered in the thesis modal.
    */
    const [
        thesisTitle,
        setThesisTitle
    ] = useState("");

    const [
        deadline,
        setDeadline
    ] = useState("");

    const [
        startDate,
        setStartDate
    ] = useState("");


    /*
    The ID was stored in localStorage
    after the professor logged in.
    */
    const supervisorId =
        localStorage.getItem(
            "supervisorId"
        );


    /*
    Loads all students
    assigned to the logged in professor.
    */
    async function loadStudents() {

        const currentSupervisorId =
            localStorage.getItem(
                "supervisorId"
            );


        /*
        Without a professor ID
        no students can be loaded.
        */
        if (
            currentSupervisorId == null
        ) {

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/students/supervisor/${currentSupervisorId}`
                );


            if (
                response.ok == false
            ) {

                throw new Error(
                    "Studenten konnten nicht geladen werden"
                );
            }


            const data: Student[] =
                await response.json();


            setStudents(
                data
            );


        } catch (error) {

            /*
            Loading errors are written
            to the developer console.
            The page itself can still remain open.
            */
            console.error(
                "Fehler beim Laden der Studenten:",
                error
            );
        }
    }


    /*
    This effect runs once
    when the page is opened.
    */
    useEffect(() => {

        loadStudents();

    }, []);


    /*
    Stores the selected student
    and clears old form values
    before opening the modal.
    */
    function assignThesis(
        student: Student
    ) {

        setSelectedStudent(
            student
        );

        setThesisTitle("");

        setStartDate("");

        setDeadline("");

        setShowThesisModal(
            true
        );
    }


    /*
    Closes the modal
    and removes all old values.
    */
    function closeThesisModal() {

        setShowThesisModal(
            false
        );

        setSelectedStudent(
            null
        );

        setThesisTitle("");

        setStartDate("");

        setDeadline("");
    }


    /*
    If the student already has a thesis,
    the thesis title is shown as a button.
    Clicking it opens the thesis page.
    If the student has no thesis yet,
    a button for creating one is shown.
    */
    function thesisButton(
        student: Student
    ) {

        if (
            student.thesis != null
        ) {

            /*
            Store the thesis locally
            so TypeScript knows that it exists.
            */
            const thesis =
                student.thesis;


            return (

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/professor/thesis/" +
                            thesis.id
                        )
                    }
                >
                    {thesis.title}
                </button>
            );
        }


        return (

            <button
                type="button"
                onClick={() =>
                    assignThesis(
                        student
                    )
                }
            >
                Thesis Zuordnen
            </button>
        );
    }


    /*
    Creates a new thesis
    for the selected student.
    Student, professor, title
    and both dates are required.
    */
    async function createThesis() {

        if (
            selectedStudent == null
        ) {

            return;
        }


        if (
            supervisorId == null
        ) {

            return;
        }


        if (
            thesisTitle == "" ||
            startDate == "" ||
            deadline == ""
        ) {

            return;
        }


        const supervisorIdNumber =
            Number(
                supervisorId
            );


        /*
        Make sure that the professor ID
        is a valid number.
        */
        if (
            Number.isNaN(
                supervisorIdNumber
            )
        ) {

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/thesis`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                studentId:
                                    selectedStudent.id,

                                supervisorId:
                                    supervisorIdNumber,

                                title:
                                    thesisTitle,

                                startDate:
                                    startDate,

                                deadline:
                                    deadline
                            })
                    }
                );


            if (
                response.ok == false
            ) {

                throw new Error(
                    "Thesis konnte nicht erstellt werden"
                );
            }


            /*
            Close the modal after
            successful creation.
            */
            closeThesisModal();


            /*
            Reload the students
            so the newly created thesis
            is immediately displayed.
            */
            await loadStudents();


        } catch (error) {

            console.error(
                "Fehler beim Erstellen der Thesis:",
                error
            );
        }
    }


    return (

        <main className="prof-page">


            {/*
            THESIS MODAL
            The modal is only shown
            if it was opened
            and a student was selected.
            */}
            {
                showThesisModal == true &&
                selectedStudent != null && (

                    <div
                        className="thesis-modal-overlay"
                        onClick={
                            closeThesisModal
                        }
                    >

                        {/*
                        stopPropagation prevents
                        a click inside the modal
                        from closing it.
                        */}
                        <div
                            className="thesis-modal-glass"
                            onClick={
                                (event) =>
                                    event.stopPropagation()
                            }
                        >



                            <button
                                type="button"
                                className="thesis-modal-close"
                                onClick={
                                    closeThesisModal
                                }
                            >
                                schließen 
                            </button>

                            <div
                                className="thesis-modal-header"
                            >

                                <span
                                    className="thesis-modal-label"
                                >
                                    Neue Thesis
                                </span>


                                <h2>
                                    Thesis erstellen
                                </h2>


                                <p>
                                    Lege Thema und Zeitraum
                                    für die Thesis fest.
                                </p>

                            </div>

                            <div
                                className="thesis-student-info"
                            >

                                <div
                                    className="thesis-student-avatar"
                                >
                                    {
                                        selectedStudent
                                            .name
                                            .charAt(0)
                                            .toUpperCase()
                                    }
                                </div>


                                <div>

                                    <span>
                                        Student
                                    </span>

                                    <strong>
                                        {selectedStudent.name}
                                    </strong>

                                </div>

                            </div>



                            <div
                                className="thesis-modal-field"
                            >

                                <label>
                                    Thema
                                </label>

                                <input
                                    type="text"
                                    placeholder="Thema der Thesis"
                                    value={
                                        thesisTitle
                                    }
                                    onChange={
                                        (event) =>
                                            setThesisTitle(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>
                            <div
                                className="thesis-date-row"
                            >

                                <div
                                    className="thesis-modal-field"
                                >

                                    <label>
                                        Startdatum
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            startDate
                                        }
                                        onChange={
                                            (event) =>
                                                setStartDate(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>


                                <div
                                    className="thesis-modal-field"
                                >

                                    <label>
                                        Abgabedatum
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            deadline
                                        }
                                        onChange={
                                            (event) =>
                                                setDeadline(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>

                            </div>


                            <div
                                className="thesis-modal-actions"
                            >

                                <button
                                    type="button"
                                    className="thesis-cancel-button"
                                    onClick={
                                        closeThesisModal
                                    }
                                >
                                    Abbrechen
                                </button>


                                <button
                                    type="button"
                                    className="thesis-create-button"
                                    onClick={
                                        createThesis
                                    }
                                >
                                    Thesis erstellen
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }


            {/*
            STUDENTEN ABELLE
            Shows every student
            assigned to the professor.
            */}
            <div
                className="prof-table-glass"
            >

                <h1>
                    Professor Dashboard
                </h1>


                <table
                    className="prof-student-table"
                >

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>E-Mail</th>

                            <th>Kurs</th>

                            <th>Thesis</th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            students.map(
                                (student) => (

                                    <tr
                                        key={
                                            student.id
                                        }
                                    >

                                        <td>
                                            {student.name}
                                        </td>

                                        <td>
                                            {student.email}
                                        </td>

                                        <td>
                                            {student.course}
                                        </td>

                                        <td>
                                            {
                                                thesisButton(
                                                    student
                                                )
                                            }
                                        </td>

                                    </tr>
                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

        </main>
    );
}


export default ProfStartpage;