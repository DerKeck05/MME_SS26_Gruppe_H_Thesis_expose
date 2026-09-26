import { Link } from "react-router-dom";

import "../student_pages/student-dashboard-stylesheet.css";

function ProfSidebar() {
    return (
        <aside className="sidebar">
            <Link to="/professor">Homepage</Link>
        </aside>
    );
}

export default ProfSidebar;