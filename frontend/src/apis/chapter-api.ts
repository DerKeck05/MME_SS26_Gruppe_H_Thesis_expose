import type {Chapter, ChapterInput, ChapterUpdateInput} from "../utils/outline-utils.ts";

const API_URL = import.meta.env.VITE_API_URL;

export async function getChapters(thesisId: number): Promise<Chapter[]> {
    const response = await fetch(
        `${API_URL}/api/chapter/thesis/${thesisId}`
    );

    if(!response.ok) {
        throw new Error("Kapitel konnten nicht geladen werden.");
    } else {
        console.log("Received API response");
    }

    return response.json();
}

export async function addChapter(thesisId: number, chapter: ChapterInput): Promise<Chapter> {
    const response = await fetch(
        `${API_URL}/api/chapter/thesis/${thesisId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chapter),
        }
    );

    if(!response.ok) {
        throw new Error("Kapitel konnte nicht erstellt werden.");
    } else {
        console.log("Received API response");
    }

    return response.json();
}

export async function updateChapter(
    chapterId: number,
    chapter: ChapterUpdateInput
): Promise<Chapter> {
    const response = await fetch(
        `${API_URL}/api/chapter/${chapterId}`,
        {
            method: "PUT",
            body: JSON.stringify(chapter),
            headers: {
                "Content-Type": "application/json"
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            "Kapitel konnte nicht aktualisiert werden."
        );
    }

    console.log("Received API response");

    return response.json();
}

export async function deleteChapter(chapterId: number): Promise<void> {
    const response = await fetch(
        `${API_URL}/api/chapter/${chapterId}`,
        {
            method: "DELETE",
        }
    );

    if(!response.ok) {
        throw new Error("Kapitel konnte nicht gelöscht werden.");
    }

    console.log("Chapter deleted");
}

export async function exportPdf(thesisId: number): Promise<void> {
    const response = await fetch(
        `${API_URL}/api/chapter/thesis/${thesisId}/pdf`,
        {
            method: "GET",
        }
    );

    if (!response.ok) {
        throw new Error("PDF konnte nicht erstellt werden.");
    }

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "gliederung.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    console.log("PDF erstellt!");
}