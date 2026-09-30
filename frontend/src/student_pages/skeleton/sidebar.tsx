import {
    Link,
    useLocation
} from "react-router-dom";

import "../student-dashboard-stylesheet.css";


/*
The sidebar contains links
to the different student pages.
The currently opened page
gets an additional CSS class
so it can be highlighted.
*/
function Sidebar() {

    /*
    useLocation gives access
    to the current browser path.
    */
    const location =
        useLocation();


    /*
    This function checks
    if the given path is currently open.
    The active page receives
    the additional class
    "sidebar-link-active".
    */
    function getLinkClass(
        path: string
    ) {

        if (
            location.pathname === path
        ) {

            return (
                "sidebar-link sidebar-link-active"
            );
        }


        return (
            "sidebar-link"
        );
    }
    return (

        /*
        glass-panel adds
        the shared glass design.
        */
        <aside className="sidebar glass-panel">


            {/* HOMEPAGE */}

            <Link
                to="/student/homepage"
                className={
                    getLinkClass(
                        "/student/homepage"
                    )
                }
            >
                Homepage
            </Link>


            {/* KAPITEL */}

            <Link
                to="/student/outline"
                className={
                    getLinkClass(
                        "/student/outline"
                    )
                }
            >
                Kapitel
            </Link>


            {/* KALENDER */}

            <Link
                to="/student/calendar"
                className={
                    getLinkClass(
                        "/student/calendar"
                    )
                }
            >
                Kalender
            </Link>


            {/* FAQ */}

            <Link
                to="/student/faq"
                className={
                    getLinkClass(
                        "/student/faq"
                    )
                }
            >
                FAQ
            </Link>
    </aside>
    );
}
export default Sidebar;