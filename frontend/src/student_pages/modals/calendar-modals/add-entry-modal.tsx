import {useState} from "react";
import CloseModalButton from "../../../globals/close-modal-button.tsx";

interface AddEntry {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

interface AddEntryModalProps {
    onClose: () => void;
    onSubmit: (entry: AddEntry) => Promise<void>;
}

function AddEntryModal({
                           onClose,
                           onSubmit
                       }: AddEntryModalProps) {

    const [entryTitle, setEntryTitle] = useState("");
    const [entryDescription, setEntryDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const isFormValid =
        entryTitle.trim() !== "" &&
        entryTitle.trim().length <= 50 &&
        startDate !== "" &&
        endDate !== "" &&
        new Date(endDate) > new Date(startDate);

    async function submitEntry() {
        if (!entryTitle.trim()) {
            console.log("Titel fehlt");
            return;
        }

        if (!startDate || !endDate) {
            console.error("Start- oder Enddatum fehlt");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            console.log("Ende muss später als der Start liegen");
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
            onClick={onClose}
        >
            <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Ereignis hinzufügen</h3>

                    <CloseModalButton onClick={onClose}/>
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
                        value={entryDescription}
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
                    className="modal-submit-button"
                    type="button"
                    disabled={!isFormValid}
                    onClick={() => void submitEntry()}
                >
                    Ereignis erstellen
                </button>
            </div>
        </div>
    );
}

export default AddEntryModal;