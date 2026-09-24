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
    type: "normal" | "deadline";
}

interface CalendarComponentProps {
    events: CalendarEvent[];
    selectedEvent: CalendarEvent | null;
    date: Date;
    onNavigate: (date: Date) => void;
    onSelectEvent: (event: CalendarEvent) => void;
    onSelectSlot: () => void;
}

function CalendarComponent({
                               events,
                               selectedEvent,
                               date,
                               onNavigate,
                               onSelectEvent,
                               onSelectSlot,
                           }: CalendarComponentProps) {
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
                    selected={selectedEvent}
                    onNavigate={onNavigate}
                    onSelectEvent={onSelectEvent}
                    onSelectSlot={onSelectSlot}
                    eventPropGetter={(event) => {
                        if (event.type === "deadline") {
                            return {
                                className: "deadline",
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