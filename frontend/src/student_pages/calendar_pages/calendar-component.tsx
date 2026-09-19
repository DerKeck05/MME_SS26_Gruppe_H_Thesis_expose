import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styling.css";
import { /*useEffect,*/ useState} from "react";
import {type CalendarEntry, getCalendarEntry} from "../apis/calendar-api.ts";
import EntryDetailModal from "./modals/entry-detail-modal.tsx";
//import { getCalendarEntries } from "../apis/calendar-api";

const localizer = momentLocalizer(moment);

//TODO: Dummy Data entfernen und stattdessen echte Daten laden
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
    },
    {
        id: 4,
        title: "Mehrtägiges",
        start: new Date(2026, 8, 27, 11, 0),
        end: new Date(2026, 8, 29, 10, 0),
    }
];

const dummyEntries: CalendarEntry[] = [
    {
        id: 1,
        title: "Exposé abgeben",
        description: "Das ist eine Beschreibung",
        startDate: new Date(2026, 8, 18, 10, 0).toISOString(),
        endDate: new Date(2026, 8, 18, 11, 0).toISOString(),
        thesisId: 1
    },
    {
        id: 2,
        title: "Besprechung mit Betreuer",
        description: "",
        startDate: new Date(2026, 8, 21, 14, 0).toISOString(),
        endDate: new Date(2026, 8, 21, 15, 30).toISOString(),
        thesisId: 1
    },
    {
        id: 3,
        title: "Kapitel 1 fertigstellen",
        description: null,
        startDate: new Date(2026, 8, 25, 9, 0).toISOString(),
        endDate: new Date(2026, 8, 25, 12, 0).toISOString(),
        thesisId: 1
    },
    {
        id: 4,
        title: "Mehrtägiges",
        description: "Das ist ein mehrtägiges Event",
        startDate: new Date(2026, 8, 27, 11, 0).toISOString(),
        endDate: new Date(2026, 8, 29, 10, 0).toISOString(),
        thesisId: 1
    }
]

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
}

function CalendarComponent(/*thesisId: number*/) {
    const [entries/*, setEntries*/] = useState<CalendarEntry[]>(dummyEntries);
    const [events/*, setEvents*/] = useState<CalendarEvent[]>(dummyEvents);
    const [date, setDate] = useState(new Date());
    const [showDetail, setShowDetail] = useState(false);
    const [detailEntry, setDetailEntry] = useState<CalendarEntry | null>(null);



    /*
    useEffect(() => {
        async function loadEvents() {
            try {
                const entries = await getCalendarEntries(thesisId);

                setEntries(entries);

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
                    date={date}
                    onNavigate={(newDate) => {
                        setDate(newDate);
                    }}
                    onSelectEvent={(e) => {
                        const selectedEntry = getCalendarEntry(
                            e.id,
                            entries
                        );

                        setDetailEntry(selectedEntry)
                        setShowDetail(true);
                    }}
                />
            </div>

            {showDetail && detailEntry && (
                <EntryDetailModal onClose={() => {
                    setShowDetail(false);
                    setDetailEntry(null);
                }} entry={detailEntry}/>
            )}
        </div>
    );
}

export default CalendarComponent;