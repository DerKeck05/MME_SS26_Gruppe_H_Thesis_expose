import "../student_pages/student-dashboard-stylesheet.css";
import "../app_theme/modal-stylesheet.css";
import ProfSidebar from "./prof-sidebar.tsx";
import { Outlet, useLocation } from "react-router-dom";

function ProfDashboardSkeleton() {
    const location = useLocation();

    let pageTitle = "Professor Dashboard";

    if (location.pathname === "/professor") {
        pageTitle = "Professor Dashboard";
    }

    if (location.pathname.includes("/thesis/")) {
        pageTitle = "Thesis Details";
    }

    return (
        <div className="student-dashboard">

            <header className="student-dashboard-header">
                <div className="logo"></div>

                <h1>{pageTitle}</h1>

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