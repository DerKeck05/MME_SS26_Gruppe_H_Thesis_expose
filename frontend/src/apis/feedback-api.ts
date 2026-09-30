const API_URL = import.meta.env.VITE_API_URL;

export interface FeedbackEntry {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    chapterId: number;
}


export async function getFeedbackEntries(
    chapterId: number
): Promise<FeedbackEntry[]> {

    const response = await fetch(
        `${API_URL}/api/feedback/chapter/${chapterId}`
    );

    if (!response.ok) {
        throw new Error(
            "Kommentare konnten nicht geladen werden"
        );
    }

    return await response.json();
}


export async function addFeedbackEntry(
    chapterId: number,
    content: string
): Promise<FeedbackEntry> {

    const response = await fetch(
        `${API_URL}/api/feedback/chapter/${chapterId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Kommentar konnte nicht erstellt werden"
        );
    }

    return data;
}


export async function updateFeedbackEntry(
    feedbackId: number,
    content: string
): Promise<FeedbackEntry> {

    const response = await fetch(
        `${API_URL}/api/feedback/${feedbackId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Kommentar konnte nicht geändert werden"
        );
    }

    return data;
}


export async function deleteFeedbackEntry(
    feedbackId: number
): Promise<void> {

    const response = await fetch(
        `${API_URL}/api/feedback/${feedbackId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Kommentar konnte nicht gelöscht werden"
        );
    }
}