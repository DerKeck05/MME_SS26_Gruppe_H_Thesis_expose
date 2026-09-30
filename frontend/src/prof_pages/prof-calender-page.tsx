import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import CalendarPage
    from "../student_pages/calendar_pages/calendar-page.tsx";

import type {CalendarEvent}
    from "../student_pages/calendar_pages/calendar-component.tsx";

import {getThesisDeadline}
    from "../utils/thesis-utils.ts";

function ProfCalendarPage() {
    const {id} = useParams();

    const thesisId = id
        ? Number(id)
        : null;

    const [deadline, setDeadline] =
        useState<CalendarEvent | null>(null);

    useEffect(() => {
        async function loadDeadline() {
            if (thesisId === null) {
                return;
            }

            const loadedDeadline =
                await getThesisDeadline(thesisId);

            setDeadline(loadedDeadline);
        }

        void loadDeadline();
    }, [thesisId]);

    return (
        <CalendarPage
            thesisId={thesisId}
            deadline={deadline}
        />
    );
}

export default ProfCalendarPage;
