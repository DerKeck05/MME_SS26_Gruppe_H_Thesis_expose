import {X} from "lucide-react";
import {type CalendarEntry, deleteCalendarEntry} from "../../apis/calendar-api.ts";
import "./modal-stylesheet.css";

function EntryDetailModal({onClose, entry}: { onClose: () => void, entry: CalendarEntry }) {
    async function deleteEntry(): Promise<boolean> {
        try {
            await deleteCalendarEntry(entry.id);

            return true;
        } catch (error) {
            //TODO error handling
            console.error(error);
            return false;
        }
    }

    function formatDate(startDate: string, endDate: string): string {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start.toDateString() === end.toDateString()) {
            return `${start.toLocaleDateString("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })}, ${start.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit"
            })} - ${end.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit"
            })}`;
        }

        return `Von ${start.toLocaleDateString("de-DE", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })} \nBis ${end.toLocaleDateString("de-DE", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })}`;
    }

    return (
        <div className={"modal-backdrop"} onClick={onClose}>
            <div className={"modal"} onClick={(event) => event.stopPropagation()}>
                <div className={"modal-header"}>
                    <h3>
                        {entry.title}
                    </h3>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                        }}
                        className="modal-close"
                        aria-label="Modal schließen"
                    >
                        <X/>
                    </button>
                </div>

                <div className={"modal-body"} id={"detail-modal"}>
                    {entry.description && <div className={"detail-description"}>
                        <p>
                            {entry.description}
                        </p>
                    </div>}

                    <div className={"date-cells"}>
                        <p>
                            {formatDate(entry.startDate, entry.endDate)}
                        </p>
                    </div>
                </div>

                <div className={"spacer"}/>

                <button className={"modal-submit-button"} id={"entry-delete-button"} type={"button"}
                        onClick={async () => {
                            const result = await deleteEntry();
                            if (result) onClose();
                        }}>
                    Ereignis löschen
                </button>
            </div>
        </div>
    );
}

export default EntryDetailModal;