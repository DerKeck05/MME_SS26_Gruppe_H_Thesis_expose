import {X} from "lucide-react";
import "./modal-stylesheet.css";
import {useState} from "react";
import {addCalendarEntry} from "../../apis/calendar-api.ts";

function AddEntryModal({onClose, thesisId}: { onClose: () => void, thesisId: number }) {
    const [entryTitle, setEntryTitle] = useState("");
    const [entryDescription, setEntryDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const isFormValid =
        entryTitle.trim() !== "" &&
        startDate !== "" &&
        endDate !== "" &&
        new Date(endDate) > new Date(startDate);

    async function submitEntry(): Promise<boolean> {
        try {
            if (!entryTitle.trim()) {
                console.log("Titel fehlt");
                return false;
            }

            if (!startDate || !endDate) {
                console.error("Start- oder Enddatum fehlt");
                return false;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                console.log("Ende muss später als der Start liegen");
                return false;
            }

            await addCalendarEntry(
                thesisId,
                {
                    title: entryTitle,
                    description: entryDescription,
                    startDate: startDate,
                    endDate: endDate,
                }
            );

            console.log("Submitting entry:");
            console.log("Titel: ", entryTitle, "Desc: ", entryDescription);
            console.log("Start: ", startDate, "End", endDate);
            console.log("Submission Time: ", new Date());

            return true;
        } catch (error) {
            console.error(
                //TODO Hier später UI Error Handling einbauen
                "Fehler beim erstellen des Kalendereintrags",
                error
            );

            return false;
        }
    }

    return (
        <div className={"modal-backdrop"} onClick={() => {
            onClose();
        }}
        >
            <div className={"modal"} onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h3>Ereignis hinzufügen</h3>

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

                <div className={"modal-body"} id={"calendar-modal"}>
                    <input type={"text"} placeholder={"Neues Ereignis"} value={entryTitle}
                           onChange={(e) => setEntryTitle(e.target.value)}/>
                    <input type={"text"} placeholder={"Beschreibung"} value={entryDescription}
                           onChange={(e) => setEntryDescription(e.target.value)}/>

                    <div className={"date-row"}>
                        <label>
                            Start:
                            <input type="datetime-local" value={startDate}
                                   onChange={(e) => setStartDate(e.target.value)}/>
                        </label>
                        <label>
                            Ende:
                            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                        </label>
                    </div>
                </div>

                <div className={"spacer"}/>


                <button
                    className={"modal-submit-button"}
                    type={"button"}
                    disabled={!isFormValid}
                    onClick={async () => {
                        const success = await submitEntry();
                        if (success) onClose();
                    }}
                >
                    Ereignis erstellen
                </button>
            </div>
        </div>
    )
}

export default AddEntryModal;