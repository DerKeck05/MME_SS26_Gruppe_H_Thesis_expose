import {getThesis} from "../apis/thesis-api.ts";
import type {CalendarEvent} from "../student_pages/calendar_pages/calendar-component.tsx";


export async function getThesisDeadline(thesisId: number):Promise<CalendarEvent> {
    const thesis = await getThesis(thesisId);

    const start = new Date(thesis.endDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(thesis.endDate);
    end.setHours(23, 59, 59, 999);

    return {
        id: -1,
        title: "Abgabe Thesis",
        start: start,
        end: end,
        type: "deadline"
    }
}