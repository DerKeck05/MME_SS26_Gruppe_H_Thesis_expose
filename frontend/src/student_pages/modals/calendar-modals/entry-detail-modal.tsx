import {Pencil} from "lucide-react";
import {type CalendarEntry} from "../../../apis/calendar-api.ts";
import CloseModalButton from "../../../globals/close-modal-button.tsx";

interface EntryDetailModalProps {
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => Promise<void>;
    entry: CalendarEntry;
}

// Modal that shows the information of the Entry and holds an Edit & Delete Button
function EntryDetailModal({
                              onClose,
                              onEdit,
                              onDelete,
                              entry
                          }: EntryDetailModalProps) {

    // formats the Date String in different ways, depending on the mode of the Entry
    function formatDate(
        startDate: string,
        endDate: string
    ): string {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (entry.allDay) {
            return `${start.toLocaleDateString("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })}`
        }

        if (start.toDateString() === end.toDateString()) {
            return `${start.toLocaleDateString("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })} \n${start.toLocaleTimeString("de-DE", {
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
        <div
            className="modal-backdrop"
            onClick={onClose}
        >
            <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header with close button, title and edit button that opens edit modal */}
                <div className="modal-header">

                    <CloseModalButton onClick={onClose}/>

                    <h3>
                        {entry.title}
                    </h3>

                    <button
                        type="button"
                        onClick={onEdit}
                        className="edit-calendar-entry"
                        aria-label="Eintrag bearbeiten"
                    >
                        <Pencil/>
                    </button>

                </div>

                {/* Body with Formatted Date and description if the entry has one */}
                <div className="modal-body" id="detail-modal">

                    <div className="date-cells">
                        <p>
                            {formatDate(
                                entry.startDate,
                                entry.endDate
                            )}
                        </p>
                    </div>

                    {entry.description && (
                        <div className="detail-description overflow-y-auto whitespace-normal wrap-break-word">
                            <p className="min-w-0">
                                {entry.description}
                            </p>
                        </div>
                    )}

                </div>

                <div className="spacer"/>

                {/* Delete Button */}
                <button
                    className="squared-button modal-submit-button"
                    id="entry-delete-button"
                    type="button"
                    onClick={() => void onDelete()}
                >
                    Ereignis löschen
                </button>

            </div>
        </div>
    );
}

export default EntryDetailModal;