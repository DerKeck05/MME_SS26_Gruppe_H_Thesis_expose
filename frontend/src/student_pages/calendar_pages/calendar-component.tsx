import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment); // or globalizeLocalizer


function CalendarComponent() {
    return (
        <div className="calendar-component">
            <h2>Kalender</h2>
            <div className={"calendar-div"}>
                <Calendar
                    localizer={localizer}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        </div>
    );
}

export default CalendarComponent;