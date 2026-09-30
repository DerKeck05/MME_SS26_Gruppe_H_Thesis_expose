import { useEffect, useState} from "react";
import { useParams} from "react-router-dom";
import CalendarPage from "../student_pages/calendar_pages/calendar-page.tsx";
import type {CalendarEvent} from "../student_pages/calendar_pages/calendar-component.tsx";
import { getThesisDeadline} from "../utils/thesis-utils.ts";


function ProfCalendarPage() {

    /*
    useParams gets the thesis ID
    from the current URL.
    */
    const { id } =
        useParams();


    /*
    Route parameters are strings.
    If an ID exists,
    it is converted into a number.
    */
    let thesisId: number | null =
        null;


    if (
        id != null
    ) {

        const parsedId =
            Number(id);


        /*
        Only use the ID
        if it is a valid number.
        */
        if (
            Number.isNaN(parsedId) == false
        ) {

            thesisId =
                parsedId;
        }
    }


    /*
    Stores the thesis deadline
    as a calendar event.
    At the beginning
    no deadline is loaded.
    */
    const [
        deadline,
        setDeadline
    ] = useState<CalendarEvent | null>(null);


    /*
    Whenever the thesis ID changes,
    the deadline of this thesis
    is loaded again.
    */
    useEffect(() => {

        async function loadDeadline() {

            /*
            Without a valid thesis ID
            no deadline can be loaded.
            */
            if (
                thesisId == null
            ) {

                setDeadline(
                    null
                );

                return;
            }

            const loadedDeadline =
                await getThesisDeadline(
                    thesisId
                );


            setDeadline(
                loadedDeadline
            );
        }


        loadDeadline();

    }, [thesisId]);

    /*
    The professor uses the same calendar page
    as the student.
    The thesis ID and deadline
    are passed to the shared component.
    */
    return (

        <CalendarPage
            thesisId={thesisId}
            deadline={deadline}
        />
    );
}

export default ProfCalendarPage;