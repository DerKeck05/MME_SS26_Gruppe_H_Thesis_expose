import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./prof_startpage.css";
import "./prof_thesis_modal.css";


type Student = {
    id: number;
    name: string;
    email: string;
    course: string;
    supervisorId: number | null;
    thesis: {
        id: number;
        title: string;
        startDate: string;
        endDate: string;
    } | null;
};


function ProfStartpage() {

    const navigate = useNavigate();

    const [showThesisModal, setShowThesisModal] =
        useState(false);

    const [students, setStudents] =
        useState<Student[]>([]);

    const [selectedStudent, setSelectedStudent] =
        useState<Student | null>(null);

    const [thesisTitle, setThesisTitle] =
        useState("");

    const [deadline, setDeadline] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const supervisorId =
        localStorage.getItem("supervisorId");


    function loadStudents() {

        const currentSupervisorId =
            localStorage.getItem("supervisorId");


        if (currentSupervisorId == null) {
            return;
        }


        fetch(
            "http://localhost:3000/api/students/supervisor/" +
            currentSupervisorId
        )
            .then(
                (response) => response.json()
            )
            .then(
                (data) => {

                    console.log(
                        "Geladene Studenten:",
                        data
                    );

                    setStudents(data);
                }
            );
    }


    useEffect(() => {

        loadStudents();

    }, []);


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


    function thesisButton(
        student: Student
    ) {

        if (
            student.thesis != null
        ) {

            return (

                <button
                    onClick={() =>
                        navigate(
                            "/professor/thesis/" +
                            student.thesis!.id
                        )
                    }
                >
                    {student.thesis.title}
                </button>
            );
        }


        return (

            <button
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


        const response =
            await fetch(
                "http://localhost:3000/api/thesis",
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


        const data =
            await response.json();


        console.log(data);


        if (
            response.ok
        ) {

            closeThesisModal();

            loadStudents();
        }
    }


    return (

        <main className="prof-page">


            {
                showThesisModal == true &&
                selectedStudent != null && (

                    <div
                        className="thesis-modal-overlay"
                        onClick={
                            closeThesisModal
                        }
                    >

                        <div
                            className="thesis-modal-glass"
                            onClick={
                                (event) =>
                                    event.stopPropagation()
                            }
                        >


                            <button
                                className="thesis-modal-close"
                                onClick={
                                    closeThesisModal
                                }
                            >
                                ×
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
                                    className="thesis-cancel-button"
                                    onClick={
                                        closeThesisModal
                                    }
                                >
                                    Abbrechen
                                </button>


                                <button
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