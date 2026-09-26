import {useState} from "react";
import {type CalendarEntry} from "../../../apis/calendar-api.ts";
import CloseModalButton from "../../../globals/close-modal-button.tsx";

function formatDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

interface EditEntryModalProps {
    entry: CalendarEntry;
    onCancel: () => void;
    onSubmit: (entry: {
        title: string;
        description: string | null;
        startDate: string;
        endDate: string;
    }) => Promise<void>;
}

function EditEntryModal({
                            onCancel,
                            onSubmit,
                            entry
                        }: EditEntryModalProps) {

    const [entryTitle, setEntryTitle] = useState(entry.title);
    const [entryDescription, setEntryDescription] = useState(entry.description);
    const [startDate, setStartDate] = useState(
        formatDateTimeLocal(entry.startDate)
    );
    const [endDate, setEndDate] = useState(
        formatDateTimeLocal(entry.endDate)
    );

    const isFormValid =
        entryTitle.trim() !== "" &&
        entryTitle.trim().length <= 50 &&
        startDate !== "" &&
        endDate !== "" &&
        new Date(endDate) > new Date(startDate);

    async function submitEdit() {
        if (!isFormValid) {
            return;
        }

        await onSubmit({
            title: entryTitle,
            description: entryDescription,
            startDate,
            endDate,
        });
    }

    return (
        <div
            className="modal-backdrop"
            onClick={onCancel}
        >
            <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Ereignis bearbeiten</h3>

                    <CloseModalButton onClick={onCancel}/>
                </div>

                <div className="modal-body" id="calendar-modal">

                    <input
                        type="text"
                        placeholder="Neues Ereignis"
                        value={entryTitle}
                        onChange={(e) => setEntryTitle(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Beschreibung"
                        value={entryDescription ?? ""}
                        onChange={(e) => setEntryDescription(e.target.value)}
                    />

                    <div className="date-row">
                        <label>
                            Start:
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </label>

                        <label>
                            Ende:
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </label>
                    </div>

                </div>

                <div className="spacer"/>

                <button
                    className="squared-button modal-submit-button"
                    type="button"
                    disabled={!isFormValid}
                    onClick={() => void submitEdit()}
                >
                    Ereignis speichern
                </button>
            </div>
        </div>
    );
}

export default EditEntryModal;