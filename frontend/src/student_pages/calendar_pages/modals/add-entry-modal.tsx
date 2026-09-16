import {X} from "lucide-react";

function AddEntryModal() {
    return (
        <div className={"modal-Backdrop"} onClick={() => {}}
        >
            <div className={"modal"} onClick={(event) => event.stopPropagation()}>
                <h3>Ereignis hinzufügen</h3>

                <div className="modal-header">
                    <h2>Neues Event</h2>

                    <button
                        type="button"
                        onClick={() => {
                        }}
                        className="modal-close"
                        aria-label="Modal schließen"
                    >
                        <X/>
                    </button>
                </div>

                <input type={"text"} placeholder={"Neues Ereignis"}/>
                <input type={"text"} placeholder={"Beschreibung"}/>

                <label>
                    Start:
                    <input type="datetime-local"/>
                </label>
                <label>
                    Ende:
                    <input type="datetime-local"/>
                </label>


                <button type={"submit"} onClick={() => {
                }}>
                    Ereignis erstellen
                </button>
            </div>
        </div>
    )
}

export default AddEntryModal;