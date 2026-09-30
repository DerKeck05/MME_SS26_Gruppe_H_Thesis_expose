import {useStudent} from "../route_handling/student-provider.tsx";
import ThesisDashboard from "../../shared_pages/thesis-dashboard.tsx";

// Dashboard Homepage with Widgets that show different information
function StudentDashboard() {
    // List of Events for Mini-Calendar and the "Up-Next"-Widget
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [upNextEvents, setUpNextEvents] = useState<UpNextEvents[]>([]);

    // Provider calls
    const {thesisId, deadline} = useStudent();
    const {showError} = useError();

    // initial loading of all the Data from the backend
    useEffect(() => {
        async function loadEvents() {
            if (thesisId == null) {
                return;
            }

            try {
                // loads List of Calendar Entries of the current Thesis from Backend
                const entries: CalendarEntry[] =
                    await getCalendarEntries(thesisId);

                // maps the Entries into Calendar Events which the React-Big-Calendar can read and use
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

                // If there's a deadline in the provider this one gets added to the List of Events
                if (deadline) {
                    calendarEvents.push(deadline);
                }

                // Takes the next 3 Events from the List and takes the important information for the UI
                const uNEvents: UpNextEvents[] = calendarEvents
                    .filter(event => event.start >= new Date())
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .slice(0, 3)
                    .map(
                        (event) => ({
                            title: event.title,
                            // this puts the dates into a formatted Date string for the UI
                            date: event.allDay
                                ? event.start.toLocaleDateString("de-DE")
                                : `${event.start.toLocaleDateString("de-DE")} ${event.start.toLocaleTimeString("de-DE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}`,
                        })
                    );

                // loads the data into the Lists
                setEvents(calendarEvents);
                setUpNextEvents(uNEvents);
            } catch (error) {
                console.error(
                    "Fehler beim Laden der Kalendereinträge:",
                    error
                );

                // this shows the Error into the UI
                showError(
                    error instanceof Error
                        ? error.message
                        : "Fehler beim Laden der Kalendereinträge!"
                );
            }
        }

        void loadEvents();
    },
        // Dependency List, that tells the useEffect when to reload
        [thesisId, deadline, showError]);

    // Arranges the 3 Widgets [ CalendarPreview, UpNextCard, TimeCard ]
    return (
        <ThesisDashboard
            thesisId={thesisId}
            deadline={deadline}
        />
    );
}

export default StudentDashboard;