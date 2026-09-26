import CalendarPreview from "./cards/calendar-preview.tsx";
import TimeCard from "./cards/time-card.tsx";
import {useEffect, useState} from "react";
import type {CalendarEvent} from "../calendar_pages/calendar-component.tsx";
import {useStudent} from "../route_handling/student-provider.tsx";
import {type CalendarEntry, getCalendarEntries} from "../../apis/calendar-api.ts";
import UpNextCard, {type UpNextEvents} from "./cards/up-next-card.tsx";

function StudentDashboard() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [upNextEvents, setUpNextEvents] = useState<UpNextEvents[]>([]);

    const {thesisId, deadline} = useStudent();

    useEffect(() => {
        async function loadEvents() {
            if (thesisId == null) {
                return;
            }

            try {
                const entries: CalendarEntry[] =
                    await getCalendarEntries(thesisId);

                const calendarEvents: CalendarEvent[] = entries.map(
                    (entry) => ({
                        id: entry.id,
                        title: entry.title,
                        start: new Date(entry.startDate),
                        end: new Date(entry.endDate),
                        allDay: entry.allDay,
                        type: entry.allDay ? "allDay" : "normal"
                    })
                );

                if (deadline) {
                    calendarEvents.push(deadline);
                }

                const uNEvents: UpNextEvents[] = calendarEvents
                    .filter(event => event.start >= new Date())
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .slice(0, 3)
                    .map(
                        (event) => ({
                            title: event.title,
                            date: event.allDay
                                ? event.start.toLocaleDateString("de-DE")
                                : `${event.start.toLocaleDateString("de-DE")} ${event.start.toLocaleTimeString("de-DE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}`,
                        })
                    );

                setEvents(calendarEvents);
                setUpNextEvents(uNEvents);
            } catch (error) {
                console.error(
                    "Fehler beim Laden der Kalendereinträge:",
                    error
                );
            }
        }

        void loadEvents();
    }, [thesisId, deadline]);

    return (
        <div className="dashboard-content">
            <CalendarPreview events={events}/>
            <div className={"card-row"}>
                <div className={"placeholder"}>
                    <UpNextCard upNextEvents={upNextEvents}/>
                </div>
                <TimeCard/>
            </div>
        </div>
    );
}

export default StudentDashboard;