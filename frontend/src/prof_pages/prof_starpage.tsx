import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


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
    const supervisorId = sessionStorage.getItem("supervisorId");

    console.log(supervisorId);
    let thesisModal = null;


    useEffect(() => {
        fetch("http://localhost:3000/api/students")
            .then((response) => response.json())
            .then((data) => {
                setStudents(data);
            });
    }, []);

    function assignThesis(student: Student) {
        setSelectedStudent(student);
        setShowThesisModal(true);
    }
    function thesisButton(student: Student) {

        if (student.theses.length > 0) {
            return (
                <button onClick={() => navigate("/thesis/" + student.theses[0].id)}>
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
                deadline: deadline
            })
        });

        const data = await response.json();

        console.log(data);
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
                <label>Abgabedatum</label>

                <input
                    type="date"
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                />
                <button
                    onClick={createThesis}>
                    Thesis erstellen
                </button>
            </div>
        );

    }

    return (
        <main>
            {thesisModal}
            <div>
                <h1>Professor Dashboard</h1>
                <table>
                    <thead>
                        <tr>
                            <th> Name</th>
                            <th> E-Mail</th>
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
                                <td>
                                  {thesisButton(student)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default ProfStartpage;