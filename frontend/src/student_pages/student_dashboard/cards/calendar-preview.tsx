import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../calendar_pages/calendar-styling.css";
import {useEffect, useState} from "react";
import {type CalendarEvent} from "../../calendar_pages/calendar-component.tsx";
import {useNavigate} from "react-router-dom";
import {
    type CalendarEntry,
    getCalendarEntries
} from "../../../apis/calendar-api.ts";
import {useStudent} from "../../route_handling/student-provider.tsx";

const localizer = momentLocalizer(moment);

function CalendarPreview() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const navigate = useNavigate();

    const {thesisId, deadline} = useStudent();

    useEffect(() => {
        async function loadEvents() {
            try {
                const entries: CalendarEntry[] =
                    await getCalendarEntries(thesisId);

                const calendarEvents: CalendarEvent[] = entries.map(
                    (entry) => ({
                        id: entry.id,
                        title: entry.title,
                        start: new Date(entry.startDate),
                        end: new Date(entry.endDate),
                        type: "normal"
                    })
                );
                if (deadline) {
                    calendarEvents.push(deadline);
                }

                setEvents(calendarEvents);
            } catch (error) {
                console.error(
                    "Fehler beim Laden der Kalendereinträge:",
                    error
                );
            }
        }

        void loadEvents();
    }, [thesisId]);

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
                    style={{height: 440}}

                    eventPropGetter={(e) => {
                        switch (e.type) {
                            case "deadline":
                                return {
                                    className: "deadline",
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

