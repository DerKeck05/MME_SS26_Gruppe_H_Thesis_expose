import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { getCalendarEntries } from "../apis/calendar-api";

const localizer = momentLocalizer(moment);

// TODO: Hier später die tatsächliche aktuelle ThesisID verwenden
const thesisID = 1;

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
}

function CalendarComponent() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

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
    }, []);

    return (
        <div className="calendar-component">
            <h2>Kalender</h2>

            <div className="calendar-div">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>

            <div className={"calendar-add-buttons"}>
                <button />
            </div>
        </div>
    );
}

export default CalendarComponent;