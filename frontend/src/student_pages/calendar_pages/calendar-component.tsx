import {Calendar, momentLocalizer, type View} from "react-big-calendar";
import moment from "moment";
declare module "moment/locale/de";
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
                    allDayAccessor={"allDay"}
                    selected={selectedEvent}
                    onNavigate={onNavigate}
                    onSelectEvent={onSelectEvent}
                    onSelectSlot={onSelectSlot}
                    eventPropGetter={(event) => {
                        if (event.type === "deadline") {
                            return {
                                className: "deadline",
                            };
                        } else if (event.type === "allDay") {
                            return {
                                className: "allDay",
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