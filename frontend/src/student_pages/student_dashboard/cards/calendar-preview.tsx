import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../calendar_pages/calendar-styling.css";

import {
    type CalendarEvent
} from "../../calendar_pages/calendar-component.tsx";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

// Date localizer for the Calendar
const localizer = momentLocalizer(moment);


interface CalendarPreviewProps {
    events: CalendarEvent[];
}

function CalendarPreview({events}: CalendarPreviewProps) {
    // for the Navigation to the Calendar Page
    const navigate = useNavigate();
    const location = useLocation();


    function openCalendar() {

        if (
            location.pathname.startsWith(
                "/professor/thesis/"
            )
        ) {

            const parts =
                location.pathname.split("/");

            const thesisId =
                parts[3];

            navigate(
                "/professor/thesis/" +
                thesisId +
                "/calendar"
            );

            return;
        }

        navigate(
            "/student/calendar"
        );
    }


    return (

        <div
            className="calendar-preview"

            onClick={
                openCalendar
            }
        >

            <h2 className="calendar-header">
                Kalender
            </h2>


            {/* Builds the mini Calendar with Week View, without additional functionality and without toolbar */}
            <div className="mini-calendar">

                <Calendar
                    localizer={
                        localizer
                    }

                    events={
                        events
                    }

                    startAccessor="start"

                    endAccessor="end"

                    view="week"

                    style={{
                        height: 400
                    }}

                    allDayAccessor={
                        "allDay"
                    }

                    // returns different css-classes for the Event Types for different styling
                    eventPropGetter={(e) => {

                        switch (e.type) {

                            case "deadline":

                                return {
                                    className:
                                        "deadline"
                                };

                            case "allDay":

                                return {
                                    className:
                                        "allDay"
                                };

                            default:

                                return {};
                        }
                    }}

                    toolbar={
                        false
                    }

                    selectable={
                        false
                    }
                />

            </div>

        </div>
    );
}


export default CalendarPreview;