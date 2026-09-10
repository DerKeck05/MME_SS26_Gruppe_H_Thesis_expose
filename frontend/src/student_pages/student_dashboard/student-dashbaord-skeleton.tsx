import "../student-dashboard-stylesheet.css";
import Sidebar from "../sidebar/sidebar.tsx";
import CalendarPreview from "../cards/calendar-preview.tsx";
import "lucide-react";
import TimeCard from "../cards/time-card.tsx";

function StudentDashbaordSkeleton() {
    return (
        <div className="student-dashboard">

            <header className="student-dashboard-header">
                <div className={"logo"}></div>
                <h1>Student Dashboard</h1>
                <div className={"profile-button"}>
                </div>
            </header>

            <div className="student-dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <CalendarPreview />
                    <div className={"card-row"}>
                        <div className={"placeholder"}><p>Placeholder</p></div>
                        <TimeCard />
                    </div>
                </main>
            </div>

        </div>
    );
}

export default StudentDashbaordSkeleton;