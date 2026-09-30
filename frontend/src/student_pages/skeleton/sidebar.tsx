import {Link} from "react-router-dom";

import "../student-dashboard-stylesheet.css";

// Builds the Sidebar of the Dashboard with Links to the different pages with some styling
function Sidebar() {
    return (
        <aside
            className="
                flex
                w-62.5
                min-h-[calc(100vh-80px)]
                shrink-0
                flex-col
                items-start
                justify-start
                gap-(--spacing-small)
                bg-(--white)
                pt-(--spacing-small)
                pl-(--spacing-large)
                pr-(--spacing-small)
            "
        >
            <Link
                to="/student/homepage"
                className="
                    flex
                    w-full
                    m-0
                    items-center
                    rounded-(--border-radius)
                    py-(--spacing-small)
                    text-left
                    text-[22px]
                    font-semibold
                    text-(--night-blue)
                    hover:bg-(--night-blue)
                    hover:text-(--white)
                    pl-2
                "
            >
                Homepage
            </Link>

            <Link
                to="/student/outline"
                className="
                    flex
                    w-full
                    m-0
                    items-center
                    rounded-(--border-radius)
                    py-(--spacing-small)
                    text-left
                    text-[22px]
                    font-semibold
                    text-(--night-blue)
                    hover:bg-(--night-blue)
                    hover:text-(--white)
                    pl-2
                "
            >
                Kapitel
            </Link>

            <Link
                to="/student/calendar"
                className="
                    flex
                    w-full
                    m-0
                    items-center
                    rounded-(--border-radius)
                    py-(--spacing-small)
                    text-left
                    text-[22px]
                    font-semibold
                    text-(--night-blue)
                    hover:bg-(--night-blue)
                    hover:text-(--white)
                    pl-2
                "
            >
                Kalender
            </Link>
        </aside>
    );
}

export default Sidebar;