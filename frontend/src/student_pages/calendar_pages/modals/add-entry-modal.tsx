import {X} from "lucide-react";
import "./modal-stylesheet.css";

function AddEntryModal({onClose}: { onClose: () => void }) {
    return (
        <div className={"modal-Backdrop"} onClick={() => {
            onClose();
        }}
        >
            <div className={"modal"} onClick={(event) => event.stopPropagation()}>
                <h3>Ereignis hinzufügen</h3>

                <div className="modal-header">
                    <h2>Neues Event</h2>

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

                    onClose();
                }}>
                    Ereignis erstellen
                </button>
            </div>
        </div>
    )
}

export default AddEntryModal;