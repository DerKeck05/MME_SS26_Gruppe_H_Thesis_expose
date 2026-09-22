import {useState} from "react";
import {type CalendarEntry, updateCalendarEntry} from "../../../apis/calendar-api.ts";
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

function EditEntryModal({onCancel, onSubmit, entry}: {onCancel: () => void, onSubmit: (updatedEntry: CalendarEntry) => void, entry: CalendarEntry}) {
    const [entryTitle, setEntryTitle] = useState(entry.title);
    const [entryDescription, setEntryDescription] = useState(entry.description);
    const [startDate, setStartDate] = useState(formatDateTimeLocal(entry.startDate));
    const [endDate, setEndDate] = useState(formatDateTimeLocal(entry.endDate));

    let updatedEntry: CalendarEntry | null = null;

    const isFormValid =
        entryTitle.trim() !== "" &&
        entryTitle.trim().length <= 50 &&
        startDate !== "" &&
        endDate !== "" &&
        new Date(endDate) > new Date(startDate);

    async function editEntry(): Promise<boolean> {
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

            updatedEntry = await updateCalendarEntry(entry.id, {
                title: entryTitle,
                description: entryDescription,
                startDate: startDate,
                endDate: endDate,
            });

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
            onCancel();
        }}
        >
            <div className={"modal"} onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h3>Ereignis bearbeiten</h3>

                    <CloseModalButton onClick={onCancel}/>
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
                        const success = await editEntry();
                        if (success && updatedEntry) onSubmit(updatedEntry);
                    }}
                >
                    Ereignis erstellen
                </button>
            </div>
        </div>
    )
}

export default EditEntryModal;