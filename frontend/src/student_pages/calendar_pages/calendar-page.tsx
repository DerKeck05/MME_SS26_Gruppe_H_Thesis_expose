import CalendarComponent from "./calendar-component";
import "../calendar_pages/calendar-stylesheet.css";
import {Plus} from "lucide-react";
import {useState} from "react";
import AddEntryModal from "./modals/add-entry-modal.tsx";

const thesisId = 1;

function CalendarPage() {
    const [showModal, setShowModal] = useState(false);


    return (
        <div className="calendar-page-main">
            <CalendarComponent /* thesisId = {thesisId}*//>
            <div className={"calendar-add-buttons"}>
                <button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    title="Neues Ereignis erstellen"
                >
                    <Plus size={30} strokeWidth={2.5}/>
                </button>
                {showModal && (
                    <AddEntryModal
                        onClose={() => setShowModal(false)}
                        thesisId={ thesisId }
                    />
                )}

            </div>
        </div>
    );
}

export default CalendarPage;