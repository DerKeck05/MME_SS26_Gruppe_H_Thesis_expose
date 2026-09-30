import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import ThesisDashboard from "../shared_pages/thesis-dashboard.tsx";
import type {CalendarEvent}
    from "../student_pages/calendar_pages/calendar-component.tsx";
import {getThesisDeadline} from "../utils/thesis-utils.ts";

function ThesisDetail() {
    const {id} = useParams();

    const [deadline, setDeadline] =
        useState<CalendarEvent | null>(null);

    const thesisId = id ? Number(id) : null;

    useEffect(() => {
        async function loadDeadline() {
            if (thesisId == null) {
                return;
            }

            const loadedDeadline =
                await getThesisDeadline(thesisId);

            setDeadline(loadedDeadline);
        }

        void loadDeadline();
    }, [thesisId]);

    return (
        <ThesisDashboard
            thesisId={thesisId}
            deadline={deadline}
        />
    );
}

export default ThesisDetail;