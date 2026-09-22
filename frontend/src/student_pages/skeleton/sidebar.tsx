import {Link} from "react-router-dom";

import "../student-dashboard-stylesheet.css";

function Sidebar() {
    return (
        <aside className="sidebar">
            <Link to="/student/homepage">Homepage</Link>
            <Link to="/student/outline">Kapitel</Link>
            <Link to="/student/calendar">Kalender</Link>
        </aside>
    );
}

export default Sidebar;