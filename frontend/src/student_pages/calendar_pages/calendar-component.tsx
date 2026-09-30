import {Calendar, momentLocalizer, type View} from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styling.css";
import {useState} from "react";

const localizer = momentLocalizer(moment);

export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    type: "normal" | "deadline" | "allDay";
}

interface CalendarComponentProps {
    events: CalendarEvent[];
    selectedEvent: CalendarEvent | null;
    date: Date;
    onNavigate: (date: Date) => void;
    onSelectEvent: (event: CalendarEvent) => void;
    onSelectSlot: () => void;
}

// Handles everything related to React-Big-Calendar (here now only called calendar)
function CalendarComponent({
                               events,
                               selectedEvent,
                               date,
                               onNavigate,
                               onSelectEvent,
                               onSelectSlot,
                           }: CalendarComponentProps) {
    // for handling which view is currently shown of the calendar [month, week, day, agenda]
    const [view, setView] = useState<View>("month");

    return (
        <div className="calendar-component">
            <div className="calendar-div">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    date={date}
                    view={view}
                    onView={setView}
                    allDayAccessor={"allDay"}
                    selected={selectedEvent}
                    onNavigate={onNavigate}
                    onSelectEvent={onSelectEvent}
                    onSelectSlot={onSelectSlot}

                    // for Styling the different Event Types
                    eventPropGetter={(event) => {
                        if (event.type === "deadline") {
                            return {
                                className: "deadline",
                            };
                        } else if (event.type === "allDay") {
                            return {
                                style: {
                                    backgroundColor: "var(--secondary)",
                                    color: "var(--dark-blue)",
                                },
                            };
                        }

                        return {};
                    }}
                    selectable={true}
                />
            </div>
        </div>
    );
}

export default CalendarComponent;