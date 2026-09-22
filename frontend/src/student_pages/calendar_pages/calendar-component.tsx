import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styling.css";
import { /*useEffect,*/ useState} from "react";
import {type CalendarEntry, getCalendarEntry} from "../../apis/calendar-api.ts";
import EntryDetailModal from "./modals/entry-detail-modal.tsx";
import EditEntryModal from "./modals/edit-entry-modal.tsx";
//import { getCalendarEntries } from "../apis/calendar-api";

const localizer = momentLocalizer(moment);

//TODO: Dummy Data entfernen und stattdessen echte Daten laden
export const dummyEvents: CalendarEvent[] = [
    {
        id: 1,
        title: "Exposé abgeben",
        start: new Date(2026, 8, 18, 10, 0),
        end: new Date(2026, 8, 18, 11, 0),
        type: "normal"
    },
    {
        id: 2,
        title: "Besprechung mit Betreuer",
        start: new Date(2026, 8, 21, 14, 0),
        end: new Date(2026, 8, 21, 15, 30),
        type: "normal"
    },
    {
        id: 3,
        title: "Kapitel 1 fertigstellen",
        start: new Date(2026, 8, 25, 9, 0),
        end: new Date(2026, 8, 25, 12, 0),
        type: "normal"
    },
    {
        id: 4,
        title: "Mehrtägiges",
        start: new Date(2026, 8, 27, 11, 0),
        end: new Date(2026, 8, 29, 10, 0),
        type: "normal",
    },
    {
        id: 5,
        title: "ABGABE",
        start: new Date(2026, 8, 30, 0, 1),
        end: new Date(2026, 8, 30, 23, 59),
        type: "deadline"
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
    },
    {
        id: 5,
        title: "ABGABE",
        description: "",
        startDate: new Date(2026, 8, 30, 0, 1).toISOString(),
        endDate: new Date(2026, 8, 30, 23, 59).toISOString(),
        thesisId: 1,
    }
]

export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    type: "normal" | "deadline";
}

function CalendarComponent(/*thesisId: number*/) {
    const [entries/*, setEntries*/] = useState<CalendarEntry[]>(dummyEntries);
    const [events/*, setEvents*/] = useState<CalendarEvent[]>(dummyEvents);
    const [date, setDate] = useState(new Date());
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [detailEntry, setDetailEntry] = useState<CalendarEntry | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    //TODO Abgabe Datum aus Database ziehen und einbauen

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
                    selected={selectedEvent}
                    onNavigate={(newDate) => {
                        setDate(newDate);
                    }}
                    onSelectEvent={(e) => {
                        setSelectedEvent(e);

                        const selectedEntry = getCalendarEntry(
                            e.id,
                            entries
                        );

                        setDetailEntry(selectedEntry)
                        setShowDetailModal(true);
                    }}
                    onSelectSlot={() => {
                        setSelectedEvent(null);
                    }}
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

                    selectable={true}
                />
            </div>

            {showDetailModal && detailEntry && (
                <EntryDetailModal
                    onClose={() => {
                        setShowDetailModal(false);
                        setDetailEntry(null);
                        setSelectedEvent(null);
                    }}
                    onEdit={() => {
                        setShowEditModal(true);
                        setShowDetailModal(false);
                    }}
                    entry={detailEntry}
                />
            )}

            {showEditModal && detailEntry && (
                <EditEntryModal
                    onCancel={() => {
                        setShowEditModal(false);
                        setShowDetailModal(true);
                    }}
                    onSubmit={(updatedEntry) => {
                        setDetailEntry(updatedEntry);
                        setShowEditModal(false);
                        setShowDetailModal(true);
                    }}
                    entry={detailEntry}
                />
            )}
        </div>
    );
}

export default CalendarComponent;