import {Outlet,useLocation} from "react-router-dom";
import Sidebar from "./sidebar.tsx";
import "../student-dashboard-stylesheet.css";
import "../../app_theme/modal-stylesheet.css";


/*
This component creates
the general layout of the student dashboard.
It contains:
- the top header
- the sidebar
- the main content area
Outlet displays the student page
that belongs to the current route.
*/
function StudentDashboardSkeleton() {

    /*
    useLocation gives access
    to the current browser path.
    The path is used
    to choose the title
    displayed in the dashboard header.
    */
    const location =
        useLocation();


    /*
    Student Dashboard is used
    as the default title.
    */
    let pageTitle =
        "Student Dashboard";


    /*
    DASHBOARD HOMEPAGE
    */
    if (
        location.pathname === "/student" ||
        location.pathname === "/student/homepage"
    ) {

        pageTitle =
            "Student Dashboard";
    }


    /*
    KALENDER
    */
    if (
        location.pathname === "/student/calendar"
    ) {

        pageTitle =
            "Kalender";
    }


    /*
    GLIEDERUNG
    */
    if (
        location.pathname === "/student/outline"
    ) {

        pageTitle =
            "Gliederung";
    }


    /*
    FAQ
    */
    if (
        location.pathname === "/student/faq"
    ) {

        pageTitle =
            "FAQ";
    }


    return (

        /*
        This container holds
        the complete dashboard.
        */
        <div className="student-dashboard">


            {/*
            The header contains:
            - the Clevermate logo
            - the current page title
            - the profile element
            */}
            <header className="app-bar glass-panel">


                {/* CLEVERMATE LOGO */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <div
                        className="
                            relative
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-(--dark-blue)
                            text-lg
                            font-bold
                            text-white
                        "
                    >
                        C

                        <span
                            className="
                                absolute
                                -right-1
                                -top-1
                                text-xs
                                text-(--secondary)
                            "
                        >
                            ✦
                        </span>
                    </div>


                    <span
                        className="
                            text-lg
                            font-semibold
                            tracking-tight
                            text-(--dark-blue)
                        "
                    >
                        Clever

                        <span className="text-(--primary)">
                            mate
                        </span>
                    </span>
                </div>
                {/* AKTUELLER SEITENTITEL */}

                <h1>
                    {pageTitle}
                </h1>


                {/*
                This element is styled
                through the dashboard stylesheet.
                It also helps keep
                the header layout balanced.
                */}
                <div className="profile-button">
                </div>

            </header>


            {/*
            The sidebar is shown on the left.
            The selected student page
            is shown on the right.
            */}
            <div className="student-dashboard-body">

                <Sidebar />


                <main className="student-main-content">

                    <Outlet />

                </main>
            </div>

        </div>
    );
}

export default StudentDashboardSkeleton;