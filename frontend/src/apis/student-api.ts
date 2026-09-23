const API_URL = import.meta.env.VITE_API_URL;

export interface StudentThesis {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface StudentData {
    id: number;
    name: string;
    email: string;
    course: string;
    supervisorId: number | null;
    thesis: StudentThesis | null;
}


export async function getStudent(
    studentId: number
): Promise<StudentData> {

    const response = await fetch(
        `${API_URL}/api/student/${studentId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Student konnte nicht geladen werden"
        );
    }

    return data;
}

interface UpdateStudentData {
    id: number;
    name: string;
    email: string;
    course: string;
}

export async function updateStudent(props: UpdateStudentData):Promise<StudentData> {
    const response = await fetch(
        `${API_URL}/api/student/${props.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: props.name,
                email: props.email,
                course: props.course
            })
        }
    );

    const data = await response.json();

    if(!response.ok) {
        throw new Error(
            "Student konnte nicht aktualisiert werden"
        );
    }
    console.log(data);

    return data;
}