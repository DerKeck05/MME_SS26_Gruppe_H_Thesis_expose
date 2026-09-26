import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CalendarPreview from "../student_pages/student_dashboard/cards/calendar-preview.tsx";
import TimeCard from "../student_pages/student_dashboard/cards/time-card.tsx";

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

    if (thesis == null) {
        return (
            <div className="dashboard-content">
                <p>Thesis wird geladen...</p>
            </div>
        );
    }
   return (
    <div className="dashboard-content">
        <h2>{thesis.title}</h2>

        <CalendarPreview events={[]} />

        <div className="card-row">
            <div className="placeholder">
                <p>Fortschritt</p>
            </div>

            <TimeCard />
        </div>
    </div>
);
}

export default ThesisDetail;