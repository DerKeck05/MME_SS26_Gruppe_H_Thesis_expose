import CalendarComponent, {
    type CalendarEvent
} from "./calendar-component";
import "../calendar_pages/calendar-stylesheet.css";
import {Plus} from "lucide-react";
import {useEffect, useState} from "react";
import AddEntryModal from "../modals/calendar-modals/add-entry-modal.tsx";
import EntryDetailModal from "../modals/calendar-modals/entry-detail-modal.tsx";
import EditEntryModal from "../modals/calendar-modals/edit-entry-modal.tsx";
import {
    type CalendarEntry,
    addCalendarEntry,
    deleteCalendarEntry,
    getCalendarEntries,
    updateCalendarEntry
} from "../../apis/calendar-api.ts";
import {useStudent} from "../route_handling/student-provider.tsx";
import Loading from "../../globals/loading.tsx";

export function calcLeftDays(deadline: CalendarEvent): string {
    const deadlineDate = deadline.end.getTime();
    const currentDate = Date.now();

    const difference = deadlineDate - currentDate;

    return Math.ceil(difference / (1000 * 60 * 60 * 24)).toString();
}

function CalendarPage() {
    const {thesisId, deadline} = useStudent();

    const [entries, setEntries] = useState<CalendarEntry[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [detailEntry, setDetailEntry] = useState<CalendarEntry | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [daysLeft, setDaysLeft] = useState<string>("--");

    async function loadEvents() {
        try {
            const calendarEntries = await getCalendarEntries(thesisId);

            setEntries(calendarEntries);

            const calendarEvents: CalendarEvent[] = calendarEntries.map(entry => ({
                id: entry.id,
                title: entry.title,
                start: new Date(entry.startDate),
                end: new Date(entry.endDate),
                allDay: entry.allDay,
                type: entry.allDay ? "allDay" : "normal",
            }));

            if (deadline) {
                calendarEvents.push(deadline);
                setDaysLeft(calcLeftDays(deadline));
            }

            setEvents(calendarEvents);
            setIsLoading(false);
        } catch (error) {
            console.error(
                "Fehler beim Laden der Kalendereinträge:",
                error
            );
        }
    }

    useEffect(() => {
        void loadEvents();
    }, [thesisId]);

    async function handleAddEntry(entry: {
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        allDay: boolean;
    }) {
        try {
            await addCalendarEntry(thesisId, entry);

            await loadEvents();

            setShowAddModal(false);
        } catch (error) {
            console.error(
                "Fehler beim Erstellen des Kalendereintrags:",
                error
            );
        }
    }

    async function handleUpdateEntry(updatedEntry: {
        title: string;
        description: string | null;
        startDate: string;
        endDate: string;
        allDay: boolean;
    }) {
        if (!detailEntry) {
            return;
        }

        try {
            const updated = await updateCalendarEntry(
                detailEntry.id,
                updatedEntry
            );

            await loadEvents();

            setDetailEntry(updated);
            setShowEditModal(false);
            setShowDetailModal(true);
        } catch (error) {
            console.error(
                "Fehler beim Aktualisieren des Kalendereintrags:",
                error
            );
        }
    }

    async function handleDeleteEntry() {
        if (!detailEntry) {
            return;
        }

        try {
            await deleteCalendarEntry(detailEntry.id);

            await loadEvents();

            setDetailEntry(null);
            setSelectedEvent(null);
            setShowDetailModal(false);
        } catch (error) {
            console.error(
                "Fehler beim Löschen des Kalendereintrags:",
                error
            );
        }
    }

    function handleSelectEvent(event: CalendarEvent) {
        if (event.type === "deadline") {
            return;
        }

        const entry = entries.find(entry => entry.id === event.id);

        if (!entry) {
            return;
        }

        setSelectedEvent(event);
        setDetailEntry(entry);
        setShowDetailModal(true);
    }

    if (isLoading) {
        return (<Loading/>);
    }

    return (
        <div className="calendar-page-main">

            <div
                className="flex flex-col justify-center items-center gap-4 bg-(--tertiary) text-(--secondary) p-2 rounded-(--border-radius) mb-(--spacing-medium)">
                <p className={" text-2xl"}>
                    Tage bis zur Abgabe:
                </p>
                <h3 className={" font-semibold text-4xl"}>
                    {daysLeft} Tage
                </h3>
            </div>

            <CalendarComponent
                events={events}
                selectedEvent={selectedEvent}
                date={date}
                onNavigate={setDate}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={() => {
                    setSelectedEvent(null);
                }}
            />

            <div className="calendar-add-buttons">
                <button
                    className={"squared-button"}
                    onClick={() => setShowAddModal(true)}
                    title="Neues Ereignis erstellen"
                >
                    <Plus size={30} strokeWidth={2.5}/>
                </button>
            </div>

            {showAddModal && (
                <AddEntryModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddEntry}
                />
            )}

            {showDetailModal && detailEntry && (
                <EntryDetailModal
                    entry={detailEntry}
                    onClose={() => {
                        setShowDetailModal(false);
                        setDetailEntry(null);
                        setSelectedEvent(null);
                    }}
                    onEdit={() => {
                        setShowDetailModal(false);
                        setShowEditModal(true);
                    }}
                    onDelete={handleDeleteEntry}
                />
            )}

            {showEditModal && detailEntry && (
                <EditEntryModal
                    entry={detailEntry}
                    onCancel={() => {
                        setShowEditModal(false);
                        setShowDetailModal(true);
                    }}
                    onSubmit={handleUpdateEntry}
                />
            )}

        </div>
    );
}

export default CalendarPage;