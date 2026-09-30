import "../student_pages/student-dashboard-stylesheet.css";
import "../app_theme/modal-stylesheet.css";
import ProfSidebar from "./prof-sidebar.tsx";

import {useEffect, useState} from "react";
import {
    Outlet,
    useNavigate,
    useParams
} from "react-router-dom";

type ThesisInfo = {
    studentName: string;
    thesisTitle: string;
};

function ProfDashboardSkeleton() {
    const navigate = useNavigate();
    const {id} = useParams();

    const [thesisInfo, setThesisInfo] =
        useState<ThesisInfo | null>(null);

    useEffect(() => {
        async function loadThesisInfo() {
            const supervisorId =
                localStorage.getItem("supervisorId");

            if (!supervisorId || !id) {
                return;
            }

            const response = await fetch(
                `http://localhost:3000/api/students/supervisor/${supervisorId}`
            );

            const students = await response.json();

            const student = students.find(
                (student: any) =>
                    student.thesis?.id === Number(id)
            );

            if (!student || !student.thesis) {
                return;
            }

            setThesisInfo({
                studentName: student.name,
                thesisTitle: student.thesis.title
            });
        }

        void loadThesisInfo();
    }, [id]);

    return (
        <div className="student-dashboard">

            <header className="student-dashboard-header">
                <div className="logo"></div>
                <button
                    onClick={() => navigate("/professor")}
                    className="
                        rounded-(--border-radius)
                        px-4
                        py-2
                        font-semibold
                        text-(--night-blue)
                    "
                >
                     Zurück
                </button>

                <div>
                    <h1>
                        {thesisInfo?.thesisTitle ?? "Thesis Details"}
                    </h1>

                    {thesisInfo && (
                        <p>
                            {thesisInfo.studentName}
                        </p>
                    )}
                </div>

                <div className="profile-button"></div>
            </header>

            <div className="student-dashboard-body">
                <ProfSidebar />

                <main>
                    <Outlet />
                </main>
        </div>

        </div>
    );
}

export default ProfDashboardSkeleton;