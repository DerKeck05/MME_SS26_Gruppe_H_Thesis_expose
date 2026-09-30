import "../student_pages/student-dashboard-stylesheet.css";
import "../app_theme/modal-stylesheet.css";
import "./prof-dashboard-stylesheet.css";

import ProfSidebar from "./prof-sidebar.tsx";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type ThesisInfo = {
    studentName: string;
    thesisTitle: string;
};

function ProfDashboardSkeleton() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [thesisInfo, setThesisInfo] = useState<ThesisInfo | null>(null);

    useEffect(() => {
        async function loadThesisInfo() {
            const supervisorId = localStorage.getItem("supervisorId");

            if (!supervisorId || !id) {
                return;
            }

            const response = await fetch(
                `http://localhost:3000/api/students/supervisor/${supervisorId}`
            );

            const students = await response.json();

            const student = students.find(
                (student: any) => student.thesis && student.thesis.id === Number(id)
            );

            if (!student || !student.thesis) {
                return;
            }

            setThesisInfo({
                studentName: student.name,
                thesisTitle: student.thesis.title
            });
        }

        loadThesisInfo();
    }, [id]);

    let pageTitle = "Professor Dashboard";

    if (location.pathname.includes("/thesis/")) {
        if (thesisInfo && thesisInfo.thesisTitle) {
            pageTitle = thesisInfo.thesisTitle;
        } else {
            pageTitle = "Thesis Details";
        }
    }

    return (
        <div className="student-dashboard professor-dashboard">
            <header className="student-dashboard-header professor-dashboard-header">
                <button
                    type="button"
                    className="prof-back-button"
                    onClick={() => navigate(-1)}
                >
                    Zurück
                </button>

                <div className="dashboard-title-block">
                    <h1>{pageTitle}</h1>

                    {thesisInfo && (
                        <p className="dashboard-subtitle">
                            {thesisInfo.studentName}
                        </p>
                    )}
                </div>

                <div className="profile-button"></div>
            </header>

            <div className="student-dashboard-body">
                <ProfSidebar />

                <main className="professor-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default ProfDashboardSkeleton;