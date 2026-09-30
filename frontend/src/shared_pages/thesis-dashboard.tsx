import CalendarPreview
    from "../student_pages/student_dashboard/cards/calendar-preview.tsx";
import TimeCard
    from "../student_pages/student_dashboard/cards/time-card.tsx";
import UpNextCard, {
    type UpNextEvents
} from "../student_pages/student_dashboard/cards/up-next-card.tsx";

import { useEffect, useState } from "react";

import type { CalendarEvent }
    from "../student_pages/calendar_pages/calendar-component.tsx";

import {
    type CalendarEntry,
    getCalendarEntries
} from "../apis/calendar-api.ts";

import { useError } from "../globals/error-provider.tsx";

type ThesisDashboardProps = {
    thesisId: number | null;
    deadline: CalendarEvent | null;
};

function ThesisDashboard({
    thesisId,
    deadline
}: ThesisDashboardProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [upNextEvents, setUpNextEvents] = useState<UpNextEvents[]>([]);
    const { showError } = useError();
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

                showError(
                    error instanceof Error
                        ? error.message
                        : "Fehler beim Laden der Kalendereinträge!"
                );
            }
        }

        void loadEvents();
    }, [thesisId, deadline, showError]);

    return (
        <div className="dashboard-content">
            <CalendarPreview events={events} />
            <div className={"card-row flex flex-row justify-evenly gap-(--spacing-large) mt-(--spacing-large) min-h-[30vh]"}>
                <UpNextCard upNextEvents={upNextEvents} />
                <TimeCard deadline={deadline} />
            </div>
        </div>
    );
}

export default ThesisDashboard;