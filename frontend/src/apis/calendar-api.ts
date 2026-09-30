//
// Calendar API to fetch the Backend Data for the Calendar Entries
//

const API_URL = import.meta.env.VITE_API_URL;


export interface CalendarEntry {
    id: number;
    title: string;
    description: string | null;
    startDate: string;
    endDate: string;
    allDay: boolean;
    thesisId: number;
}

// CRUD -------------------------------------------------------------------------
// Always fetches the data over the input URL, checks if the data is okay or throws an Error and
// finally returns the response as a JSON (except Delete, theres nothing to return)

export async function getCalendarEntries(
    thesisId: number
): Promise<CalendarEntry[]> {
    const response = await fetch(
        `${API_URL}/api/calendar/thesis/${thesisId}`
    );

    if (!response.ok) {
        throw new Error("Kalendereinträge konnten nicht geladen werden.");
    } else {
        console.log("Received API response");
    }

    return response.json();
}

export async function addCalendarEntry(
    thesisId: number,
    entry: {
        title: string;
        description: string | null;
        startDate: string;
        endDate: string;
        allDay: boolean;
    }
): Promise<CalendarEntry> {
    const response = await fetch(
        `${API_URL}/api/calendar/thesis/${thesisId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entry),
        }
    );

    if (!response.ok) {
        throw new Error("Kalendereintrag konnte nicht erstellt werden.");
    } else {
        console.log("Received API response");
    }

    return response.json();
}

export async function updateCalendarEntry(entryId: number, entry: {
    title: string;
    description: string | null;
    startDate: string;
    endDate: string;
    allDay: boolean;
}) {
    const response = await fetch(
        `${API_URL}/api/calendar/${entryId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entry),
        }
    );

    if (!response.ok) {
        throw new Error("Kalendereintrag konnte nicht aktualisiert werden.");

    } else {
        console.log("Received API response");
    }

    return response.json();
}

export async function deleteCalendarEntry(
    entryId: number
): Promise<void> {
    const response = await fetch(
        `${API_URL}/api/calendar/${entryId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Kalendereintrag konnte nicht gelöscht werden."
        );
    }

    console.log("Calendar entry deleted");
}