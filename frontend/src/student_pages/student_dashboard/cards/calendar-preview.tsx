import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {/* useEffect, */useState } from "react";
import {dummyEvents} from "../../calendar_pages/calendar-component.tsx";
import {useNavigate} from "react-router-dom";
/*import {
    type CalendarEntry,
    getCalendarEntries
} from "../../apis/calendar-api.ts";
*/
const localizer = momentLocalizer(moment);

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
}

function CalendarPreview(/*{ thesisId }: { thesisId: number }*/) {
    const [events/*, setEvents*/] = useState<CalendarEvent[]>(dummyEvents);
    const navigate = useNavigate();

    /*
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
                        end: new Date(entry.endDate)
                    })
                );

                setEvents(calendarEvents);
            } catch (error) {
                console.error(
                    "Fehler beim Laden der Kalendereinträge:",
                    error
                );
            }
        }

        void loadEvents();
    }, [thesisId]);*/

    return (
        <div className="calendar-preview" onClick={() => {
            navigate("/calendar");
        }}>
            <h2 className="calendar-header">Kalender</h2>

            <div className="mini-calendar">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view="week"
                    style={{ height: 440}}

                    min={new Date(1970, 0, 1, 8, 0)}
                    max={new Date(1970, 0, 1, 20, 0)}

                    toolbar={false}
                    selectable={false}
                />
            </div>
        </div>
    );
}

export default CalendarPreview;

