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
        `${API_URL}/api/calendar/thesis/${thesisId}`
    );

    if (!response.ok) {
        throw new Error("Kalendereinträge konnten nicht geladen werden.");
    } else {
        console.log("Received API response");
    }

    return response.json();
}

export function getCalendarEntry(entryId: number, entries: CalendarEntry[]): CalendarEntry {
    const entry = entries.find((entry) => entry.id === entryId);

    if (!entry) {
        throw new Error("Eintrag wurde nicht gefunden oder konnte nicht geladen werden");

    }

    return entry;
}

export async function addCalendarEntry(
    thesisId: number,
    entry: {
        title: string;
        description: string | null;
        startDate: string;
        endDate: string;
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