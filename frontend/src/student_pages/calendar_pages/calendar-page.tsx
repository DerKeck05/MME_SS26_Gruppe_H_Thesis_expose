import CalendarComponent from "./calendar-component";
import "../calendar_pages/calendar-stylesheet.css";

function CalendarPage() {
    return (
        <div className="calendar-page-main">
            <h1>Calendar Page</h1>
            <CalendarComponent/>
        </div>
    );
}

export default CalendarPage;