import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./prof_startpage.css";
type Student = {
    id: number;
    name: string;
    email: string;
    course: string;
    supervisorId: number | null;
    theses: {
        id: number;
        title: string;
        endDate: string;
    }[];
};

function ProfStartpage() {
    const navigate = useNavigate();
    const [showThesisModal, setShowThesisModal] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [thesisTitle, setThesisTitle] = useState("");
    const [deadline, setDeadline] = useState("");
    const [startDate, setStartDate] = useState("");
    const supervisorId = localStorage.getItem("supervisorId");

    let thesisModal = null;

    function loadStudents() {
        const currentSupervisorId = localStorage.getItem("supervisorId");

        if (currentSupervisorId == null) {
            return;
        }

        fetch("http://localhost:3000/api/students/supervisor/" + currentSupervisorId)
            .then((response) => response.json())
            .then((data) => {
                console.log("Geladene Studenten:", data);
                setStudents(data);
            });
    }
    useEffect(() => {
        loadStudents();
    }, []);

    function assignThesis(student: Student) {
        setSelectedStudent(student);
        setShowThesisModal(true);
    }

    function thesisButton(student: Student) {
        if (student.theses && student.theses.length > 0) {
            return (
                <button onClick={() => navigate("/professor/thesis/" + student.theses[0].id)}>
                    {student.theses[0].title}
                </button>
            );
        } else {
            return (
                <button onClick={() => assignThesis(student)}>
                    Thesis Zuordnen
                </button>
            );
        }
    }
    async function createThesis() {
        console.log("BUTTON GEKLICKT");
        console.log("Student:", selectedStudent);
        console.log("Supervisor:", supervisorId);
        console.log("Titel:", thesisTitle);
        console.log("Start:", startDate);
        console.log("Ende:", deadline);

        if (selectedStudent == null) {
            return;
        }

        if (supervisorId == null) {
            return;
        }

        const supervisorIdNumber = Number(supervisorId);

        const response = await fetch("http://localhost:3000/api/thesis", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentId: selectedStudent.id,
                supervisorId: supervisorIdNumber,
                title: thesisTitle,
                startDate: startDate,
                deadline: deadline
            })
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            setShowThesisModal(false);
            setThesisTitle("");
            setStartDate("");
            setDeadline("");
            loadStudents();
            setSelectedStudent(null);
        }
    }

    if (showThesisModal == true && selectedStudent != null) {
        thesisModal = (
            <div>
                <h2>Thesis erstellen</h2>
                <p>Student: {selectedStudent.name}</p>
                <label>Thema</label>
                <input
                    type="text"
                    value={thesisTitle}
                    onChange={(event) => setThesisTitle(event.target.value)}
                />

                <label>Startdatum</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                />

                <label>Abgabedatum</label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                />

                <button onClick={createThesis}>
                    Thesis erstellen
                </button>
            </div>
        );
    }

    return (
        <main className="prof-page">
            {thesisModal}
            <div className="prof-table-glass">
                <h1>Professor Dashboard</h1>
                <table className="prof-student-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>E-Mail</th>
                            <th>Kurs</th>
                            <th>Thesis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.course}</td>
                                <td>{thesisButton(student)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default ProfStartpage;