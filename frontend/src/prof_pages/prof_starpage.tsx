import { useState, useEffect } from "react";


type Student = {
    id: number;
    name: string;
    email: string;
    course: string;
    supervisorId: number | null;
};

function ProfStartpage() {

    const [showThesisModal, setShowThesisModal] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);


    useEffect(() => {
        fetch("http://localhost:3000/api/students")
            .then((response) => response.json())
            .then((data) => {
                setStudents(data);
            });
    }, []);

    function assignThesis() {
        setShowThesisModal(true);
    }

    console.log(showThesisModal);
    let thesisModal = null;

    if (showThesisModal == true) {
        thesisModal = (
            <div className="modal-background">
                <div className="modal-box">
                    Thesis Popup
                </div>
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
                                    <button onClick={assignThesis}>
                                        Thesis Zuordnen
                                    </button>
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