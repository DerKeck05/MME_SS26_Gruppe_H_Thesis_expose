import "../student-dashboard-stylesheet.css";
import Sidebar from "./sidebar.tsx";
import "lucide-react";
import { Outlet, useLocation } from "react-router-dom";



function StudentDashboardSkeleton() {
    const location = useLocation();

    let pageTitle = "Student Dashboard";

    if(location.pathname === "/") {
        pageTitle = "Student Dashboard";
    } else if (location.pathname === "/calendar") {
        pageTitle = "Kalender";
    } else if (location.pathname === "/outline") {
        pageTitle = "Gliederung"
    }

    return (
        <div className="student-dashboard">

            <header className="student-dashboard-header">
                <div className={"logo"}></div>
                <h1>{pageTitle}</h1>
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