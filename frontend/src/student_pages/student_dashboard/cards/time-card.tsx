import type {CalendarEvent}
    from "../../calendar_pages/calendar-component.tsx";

import {calcLeftDays}
    from "../../calendar_pages/calendar-page.tsx";


type TimeCardProps = {
    deadline: CalendarEvent | null;
};


function TimeCard({
    deadline
}: TimeCardProps) {

    const daysLeft =
        deadline
            ? calcLeftDays(deadline)
            : "--";

    return (

        <div className="time-card glass-card">

            <p className="time-card-title">
                Days left
            </p>


            <div className="time-card-number">

                {daysLeft}

            </div>


            <p className="time-card-text">
                Tage
            </p>

        </div>
    );
}

export default TimeCard;