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
        const errorData = await response.json();

        throw new Error(
            errorData.error ?? "Kalendereinträge konnten nicht geladen werden."
        );
    }

    console.log("Received API response");

    return response.json();
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
        `${API_URL}calendar/thesis/${thesisId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entry),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.error ?? "Kalendereintrag konnte nicht erstellt werden."
        );
    }

    console.log("Received API response");

    return response.json();
}
