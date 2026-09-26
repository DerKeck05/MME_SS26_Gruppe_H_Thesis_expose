import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../calendar_pages/calendar-styling.css";
import {type CalendarEvent} from "../../calendar_pages/calendar-component.tsx";
import {useNavigate} from "react-router-dom";


const localizer = momentLocalizer(moment);

interface CalendarPreviewProps {
    events: CalendarEvent[];
}

function CalendarPreview({events}: CalendarPreviewProps) {
    const navigate = useNavigate();

    return (
        <div className="calendar-preview" onClick={() => {
            navigate("/student/calendar");
        }}>
            <h2 className="calendar-header">Kalender</h2>

            <div className="mini-calendar">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view="week"
                    style={{height: 400}}
                    allDayAccessor={"allDay"}

                    eventPropGetter={(e) => {
                        switch (e.type) {
                            case "deadline":
                                return {
                                    className: "deadline",
                                };
                            case "allDay":
                                return {
                                    className: "allDay",
                                };
                            default:
                                return {};
                        }
                    }}

                    toolbar={false}
                    selectable={false}
                />
            </div>
        </div>
    );
}

export default CalendarPreview;

