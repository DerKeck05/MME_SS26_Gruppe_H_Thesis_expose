import {Pencil} from "lucide-react";
import {type CalendarEntry} from "../../../apis/calendar-api.ts";
import CloseModalButton from "../../../globals/close-modal-button.tsx";

interface EntryDetailModalProps {
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => Promise<void>;
    entry: CalendarEntry;
}

function EntryDetailModal({
                              onClose,
                              onEdit,
                              onDelete,
                              entry
                          }: EntryDetailModalProps) {

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
                        <div className="detail-description">
                            <p>
                                {entry.description}
                            </p>
                        </div>
                    )}

                </div>

                <div className="spacer"/>

                <button
                    className="modal-submit-button"
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