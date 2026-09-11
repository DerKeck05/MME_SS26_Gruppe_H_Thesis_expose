import "../student-dashboard-stylesheet.css";
import Sidebar from "./sidebar.tsx";
import "lucide-react";
import { Outlet } from "react-router-dom";

function StudentDashboardSkeleton() {
    return (
        <div className="student-dashboard">

            <header className="student-dashboard-header">
                <div className={"logo"}></div>
                <h1>Student Dashboard</h1>
                <div className={"profile-button"}>
                </div>
            </header>

            <div className="student-dashboard-body">
                <Sidebar/>

                <main>
                    <Outlet />
                </main>
            </div>

        </div>
    );
}

export default StudentDashboardSkeleton;