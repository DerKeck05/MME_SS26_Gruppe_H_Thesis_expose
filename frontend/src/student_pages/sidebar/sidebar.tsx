{/*
    import {NavLink} from "react-router-dom";
*/
}
import "../student-dashboard-stylesheet.css";

function Sidebar() {
    return (
        <aside className="sidebar">
            { /* <nav>

                <NavLink to="/Homepage">Homepage</NavLink>
                <NavLink to="/theses">Thesen</NavLink>
                <NavLink to="/calendar">Kalender</NavLink>
                <NavLink to="/faq">FAQ</NavLink>


            </nav>*/}
            <div className={"sidebar-content"}>
                <p>Homepage</p>
                <p>Thesen</p>
                <p>Kalender</p>
                <p>FAQ</p>
            </div>
        </aside>
    );
}

export default Sidebar;