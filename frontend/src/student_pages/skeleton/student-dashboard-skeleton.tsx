import "../student-dashboard-stylesheet.css";
import "../../app_theme/modal-stylesheet.css";
import Sidebar from "./sidebar.tsx";
import {
    Outlet,
    useLocation
} from "react-router-dom";


function StudentDashboardSkeleton() {
    const location = useLocation();

    let pageTitle = "Student Dashboard";


    if (
        location.pathname === "/student" ||
        location.pathname === "/student/homepage"
    ) {
        pageTitle = "Student Dashboard";
    }


    if (
        location.pathname === "/student/calendar"
    ) {
        pageTitle = "Kalender";
    }


    if (
        location.pathname === "/student/outline"
    ) {
        pageTitle = "Gliederung";
    }


    if (
        location.pathname === "/student/faq"
    ) {
        pageTitle = "FAQ";
    }

    return (
        <div className="student-dashboard">

            <header className="app-bar glass-panel">

                <div className="logo">
                </div>


                <h1>
                    {pageTitle}
                </h1>


                <div className="profile-button">
                </div>
            </header>

            <div className="student-dashboard-body">
                <Sidebar/>


                <main className="student-main-content">

                    <Outlet/>

                </main>
            </div>

        </div>
    );
} 

export default StudentDashboardSkeleton;