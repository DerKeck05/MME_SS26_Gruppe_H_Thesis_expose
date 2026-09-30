import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import ThesisDashboard
    from "../shared_pages/thesis-dashboard.tsx";

import type {
    CalendarEvent
} from "../student_pages/calendar_pages/calendar-component.tsx";

import {
    getThesisDeadline
} from "../utils/thesis-utils.ts";


function ThesisDetail() {

    /*
    useParams gets the thesis ID
    from the current route.
    */
    const { id } =
        useParams();


    /*
    Route parameters are strings.
    The value is converted into a number
    only if it is a valid thesis ID.
    */
    let thesisId: number | null =
        null;


    if (
        id != null
    ) {

        const parsedId =
            Number(id);


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
    the deadline of the thesis
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
    Student and professor use
    the same dashboard component.
    This page only provides
    the thesis ID and deadline.
    */
    return (

        <ThesisDashboard
            thesisId={thesisId}
            deadline={deadline}
        />
    );
}


export default ThesisDetail;