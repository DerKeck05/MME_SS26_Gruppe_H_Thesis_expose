const API_URL = import.meta.env.VITE_API_URL;


/* LOGIN */

export interface LoginData {
    email: string;
    password: string;
    role: "student" | "professor";
}

export interface LoginUser {
    id: number;
    name: string;
    email: string;
}

export interface LoginResponse {
    message: string;
    role: "student" | "professor";
    user: LoginUser;
}


export async function login(
    email: string,
    password: string,
    role: "student" | "professor"
): Promise<LoginResponse> {

    const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password,
                role
            })
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(
            data.message || "Login fehlgeschlagen"
        );
    }


    return data;
}



/* STUDENT REG */

export async function registerStudent(
    name: string,
    email: string,
    password: string,
    universityId: number,
    courseId: number,
    supervisorId: number
) {
    const response = await fetch(
        `${API_URL}/api/auth/register/student`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password,
                universityId,
                courseId,
                supervisorId
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registrierung fehlgeschlagen"
        );
    }

    return data;
}


/* PROF REG */

export async function registerProfessor(
    name: string,
    email: string,
    password: string,
    chair: string,
    universityId: number,
    courseIds: number[]
) {

    const response = await fetch(
        `${API_URL}/api/auth/register/professor`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password,
                chair,
                universityId,
                courseIds
            })
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(
            data.message || "Registrierung fehlgeschlagen"
        );
    }


    return data;
}