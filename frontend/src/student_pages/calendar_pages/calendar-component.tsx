import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styling.css";
import { /*useEffect,*/ useState } from "react";
//import { getCalendarEntries } from "../apis/calendar-api";

const localizer = momentLocalizer(moment);

// TODO: Hier später die tatsächliche aktuelle ThesisID verwenden
//const thesisID = 1;

const dummyEvents: CalendarEvent[] = [
    {
        id: 1,
        title: "Exposé abgeben",
        start: new Date(2026, 8, 18, 10, 0),
        end: new Date(2026, 8, 18, 11, 0)
    },
    {
        id: 2,
        title: "Besprechung mit Betreuer",
        start: new Date(2026, 8, 21, 14, 0),
        end: new Date(2026, 8, 21, 15, 30)
    },
    {
        id: 3,
        title: "Kapitel 1 fertigstellen",
        start: new Date(2026, 8, 25, 9, 0),
        end: new Date(2026, 8, 25, 12, 0)
    }
];

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
}

function CalendarComponent() {
    const [events/*, setEvents*/] = useState<CalendarEvent[]>(dummyEvents);

    /*
    useEffect(() => {
        async function loadEvents() {
            try {
                const entries = await getCalendarEntries(thesisID);

                const calendarEvents: CalendarEvent[] = entries.map(entry => ({
                    id: entry.id,
                    title: entry.title,
                    start: new Date(entry.startDate),
                    end: new Date(entry.endDate)
                }));

                setEvents(calendarEvents);

            } catch (error) {
                console.error(
                    "Fehler beim Laden der Kalendereinträge:",
                    error
                );
            }
        }

        loadEvents();
    }, []);*/

    return (
        <div className="calendar-component">
            <div className="calendar-div">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        </div>
    );
}

export default CalendarComponent;