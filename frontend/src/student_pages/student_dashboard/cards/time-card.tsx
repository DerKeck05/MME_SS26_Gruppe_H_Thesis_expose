import {useStudent} from "../../route_handling/student-provider.tsx";
import {calcLeftDays} from "../../calendar_pages/calendar-page.tsx";

function TimeCard() {
    const {deadline} = useStudent();

    const daysLeft = deadline
        ? calcLeftDays(deadline)
        : "--";

    return (
        <div className="card" id="time-card">
            <h3 className="card-header">Days left</h3>
            <p className="card-content">{daysLeft} Tage</p>
        </div>
    );
}

export default TimeCard;