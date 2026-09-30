import type {CalendarEvent} from "../../calendar_pages/calendar-component.tsx";
import {calcLeftDays} from "../../calendar_pages/calendar-page.tsx";

type TimeCardProps = {
    deadline: CalendarEvent | null;
};
function TimeCard({deadline}: TimeCardProps) {

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