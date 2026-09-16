import CalendarComponent from "./calendar-component";
import "../calendar_pages/calendar-stylesheet.css";
import {Plus} from "lucide-react";


function CalendarPage() {
    return (
        <div className="calendar-page-main">
            <CalendarComponent/>
            <div className={"calendar-add-buttons"}>
                <button onClick={() => {
                    console.log("clicked");
                    // Hier dann Ereignis Erstellen Window aufrufen
                }} title="Neues Ereignis erstellen">
                    <Plus size={30} strokeWidth={2.5}/>
                </button>
            </div>
        </div>
    );
}

export default CalendarPage;