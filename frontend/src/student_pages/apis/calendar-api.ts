const API_URL = import.meta.env.VITE_API_URL;


export interface CalendarEntry {
    id: number;
    title: string;
    description: string | null;
    startDate: string;
    endDate: string;
    thesisId: number;
}

export async function getCalendarEntries(
    thesisId: number
): Promise<CalendarEntry[]> {
    const response = await fetch(
        `${API_URL}calendar/thesis/${thesisId}`
    );

    if (!response.ok) {
        throw new Error("Kalendereinträge konnten nicht geladen werden.");
    } else {
        console.log("Received API response");
    }

    return response.json();
}