import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";


type Thesis = {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    studentId: number;
    supervisorId: number;
};

function ThesisDetail() {
    const { id } = useParams();
    const [thesis, setThesis] = useState<Thesis | null>(null);
    useEffect(() => {
        fetch("http://localhost:3000/api/thesis/" + id)
            .then((response) => response.json())
            .then((data) => {
                setThesis(data);
            });
    }, [id]);

    console.log(id);
    console.log(thesis);
    if (thesis == null) {
        return (
            <main>
                <p>Thesis wird geladen...</p>
            </main>
        );
    }
    return (
        <main>
            <h1>Thesis Details</h1>
        </main>
    );
}

export default ThesisDetail;