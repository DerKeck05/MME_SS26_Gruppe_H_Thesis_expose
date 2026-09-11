import CalendarPreview from "./cards/calendar-preview.tsx";
import TimeCard from "./cards/time-card.tsx";

function StudentDashboard() {
    return (
        <div className="dashboard-content">
            <CalendarPreview/>
            <div className={"card-row"}>
                <div className={"placeholder"}><p>Placeholder</p></div>
                <TimeCard/>
            </div>
        </div>
    );
}

export default StudentDashboard;