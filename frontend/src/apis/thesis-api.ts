const API_URL = import.meta.env.VITE_API_URL;

interface Thesis {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export async function getThesis(thesisId: number): Promise<Thesis> {
    const response = await fetch(
        `${API_URL}/api/thesis/${thesisId}`,
    );

    const data = await response.json();

    if(!response.ok) {
        throw new Error(
            data.message || "Thesis konnte nicht geladen werden (API)"
        );
    }

    return data;
}