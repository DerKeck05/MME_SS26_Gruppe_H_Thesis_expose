import {getThesis} from "../apis/thesis-api.ts";
import type {CalendarEvent} from "../student_pages/calendar_pages/calendar-component.tsx";

// Returns the Deadline Event from a thesis
export async function getThesisDeadline(thesisId: number):Promise<CalendarEvent> {
    const thesis = await getThesis(thesisId);

    // Takes start and end Date of te thesis and creates 2 new Dates with the same days as start/end
    // And sets the hours of them so that the whole day will be used
    const start = new Date(thesis.endDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(thesis.endDate);
    end.setHours(23, 59, 59, 999);

    // Returns the dates together with the UI Information as CalendarEvent
    // id = -1 so that the logic with clicking on the events does not get messed up
    return {
        id: -1,
        title: "Abgabe Thesis",
        start: start,
        end: end,
        allDay: true,
        type: "deadline"
    }
}