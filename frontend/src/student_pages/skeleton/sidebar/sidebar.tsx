import {Link} from "react-router-dom";

import "../../student-dashboard-stylesheet.css";

function Sidebar() {
    return (
        <aside className="sidebar">


            <Link to="/">Homepage</Link>
            <Link to="/outline">Kapitel</Link>
            { /*
                <Link to="/theses">Thesen</NavLink>
                <Link to="/calendar">Kalender</NavLink>
                <Link to="/faq">FAQ</NavLink>


            */}
            {/*}
            <div className={"sidebar-content"}>
                <p>Homepage</p>
                <p>Thesen</p>
                <p>Kalender</p>
                <p>FAQ</p>
            </div>
            */}
        </aside>
    );
}

export default Sidebar;