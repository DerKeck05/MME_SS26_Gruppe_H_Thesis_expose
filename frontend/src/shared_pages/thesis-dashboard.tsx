import {
    useEffect,
    useState
} from "react";

import CalendarPreview
    from "../student_pages/student_dashboard/cards/calendar-preview.tsx";

import TimeCard
    from "../student_pages/student_dashboard/cards/time-card.tsx";

import UpNextCard, {
    type UpNextEvents
} from "../student_pages/student_dashboard/cards/up-next-card.tsx";

import type {
    CalendarEvent
} from "../student_pages/calendar_pages/calendar-component.tsx";

import {
    type CalendarEntry,
    getCalendarEntries
} from "../apis/calendar-api.ts";

import {
    useError
} from "../globals/error-provider.tsx";


/*
The shared dashboard needs:
- the thesis ID
- the thesis deadline
Student and professor can therefore
use the same dashboard component.
*/
type ThesisDashboardProps = {
    thesisId: number | null;
    deadline: CalendarEvent | null;
};


function ThesisDashboard({
    thesisId,
    deadline
}: ThesisDashboardProps) {

    /*
    Stores all calendar events
    that are shown in the calendar preview.
    The thesis deadline is also added
    to this list if it exists.
    */
    const [
        events,
        setEvents
    ] = useState<CalendarEvent[]>([]);


    /*
    Stores a maximum of three
    upcoming events for the UpNextCard.
    */
    const [
        upNextEvents,
        setUpNextEvents
    ] = useState<UpNextEvents[]>([]);


    /*
    showError displays errors
    using the shared error provider.
    */
    const {
        showError
    } = useError();


    /*
    Whenever the thesis ID
    or deadline changes,
    the calendar data is loaded again.
    */
    useEffect(() => {

        async function loadEvents() {

            /*
            Without a thesis ID
            no calendar entries can be loaded.
            Old data is cleared
            so nothing from another thesis
            remains visible.
            */
            if (
                thesisId == null
            ) {

                setEvents(
                    []
                );

                setUpNextEvents(
                    []
                );

                return;
            }


            try {

                /*
                Load the calendar entries
                of the current thesis
                from the backend.
                */
                const entries: CalendarEntry[] =
                    await getCalendarEntries(
                        thesisId
                    );


                /*
                The API returns dates as strings.
                CalendarEvent needs real Date objects,
                therefore startDate and endDate
                are converted here.
                */
                const calendarEvents: CalendarEvent[] =
                    [];


                for (const entry of entries) {

                    const calendarEvent: CalendarEvent = {
                        id:
                            entry.id,

                        title:
                            entry.title,

                        start:
                            new Date(
                                entry.startDate
                            ),

                        end:
                            new Date(
                                entry.endDate
                            ),

                        allDay:
                            entry.allDay,

                        type:
                            entry.allDay
                                ? "allDay"
                                : "normal"
                    };


                    calendarEvents.push(
                        calendarEvent
                    );
                }


                /*
                The deadline is not a normal
                calendar entry from the database.
                It is added separately
                so it is also visible
                inside the calendar.
                */
                if (
                    deadline != null
                ) {

                    calendarEvents.push(
                        deadline
                    );
                }


                /*
                Only events that start now
                or in the future
                are relevant for Up Next.
                */
                const futureEvents: CalendarEvent[] =
                    [];

                const now =
                    new Date();


                for (const event of calendarEvents) {

                    if (
                        event.start >= now
                    ) {

                        futureEvents.push(
                            event
                        );
                    }
                }


                /*
                The earliest upcoming event
                should be shown first.
                */
                futureEvents.sort(
                    (a, b) =>
                        a.start.getTime()
                        -
                        b.start.getTime()
                );


                /*
                Only the first three future events
                are needed for the UpNextCard.
                The dates are also formatted
                for the German UI.
                */
                const upcomingEvents: UpNextEvents[] =
                    [];


                for (const event of futureEvents) {

                    /*
                    Stop after three events.
                    */
                    if (
                        upcomingEvents.length >= 3
                    ) {

                        break;
                    }


                    let formattedDate =
                        event.start.toLocaleDateString(
                            "de-DE"
                        );


                    /*
                    All-day events only show the date.
                    Normal events additionally show
                    the start time.
                    */
                    if (
                        event.allDay == false
                    ) {

                        const formattedTime =
                            event.start.toLocaleTimeString(
                                "de-DE",
                                {
                                    hour:
                                        "2-digit",

                                    minute:
                                        "2-digit"
                                }
                            );


                        formattedDate =
                            formattedDate
                            +
                            " "
                            +
                            formattedTime;
                    }


                    upcomingEvents.push({
                        title:
                            event.title,

                        date:
                            formattedDate
                    });
                }


                /*
                The complete event list
                is used by CalendarPreview.
                The three upcoming events
                are used by UpNextCard.
                */
                setEvents(
                    calendarEvents
                );


                setUpNextEvents(
                    upcomingEvents
                );


            } catch (error) {

                console.error(
                    "Fehler beim Laden der Kalendereinträge:",
                    error
                );


                /*
                If a normal Error exists,
                its message is shown.
                Otherwise a general
                error message is used.
                */
                if (
                    error instanceof Error
                ) {

                    showError(
                        error.message
                    );

                } else {

                    showError(
                        "Fehler beim Laden der Kalendereinträge!"
                    );
                }
            }
        }


        loadEvents();

    }, [
        thesisId,
        deadline,
        showError
    ]);


    /*
    The dashboard contains:
    - calendar preview
    - next three events
    - thesis time / deadline card
    */
    return (

        <div className="dashboard-content">

            <CalendarPreview
                events={
                    events
                }
            />


            <div className="dashboard-card-row">

                <UpNextCard
                    upNextEvents={
                        upNextEvents
                    }
                />


                <TimeCard
                    deadline={
                        deadline
                    }
                />

            </div>

        </div>
    );
}


export default ThesisDashboard;