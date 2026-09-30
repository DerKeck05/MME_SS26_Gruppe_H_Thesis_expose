import {
    Link,
    useLocation
} from "react-router-dom";

import "../student-dashboard-stylesheet.css";

function Sidebar() {
    const location = useLocation();
    function getLinkClass(
        path: string
    ) {

        if (
            location.pathname === path
        ) {

            return "sidebar-link sidebar-link-active";
        }


        return "sidebar-link";
    }
    return (

        <aside className="sidebar glass-panel">

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