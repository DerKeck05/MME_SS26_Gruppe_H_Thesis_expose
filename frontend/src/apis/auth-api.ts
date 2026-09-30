/*
The API URL comes from the environment variables.
For example during local development
the value can be:
http://localhost:3000
This way the URL does not have to be
written directly into every fetch request.
*/
const API_URL =
    import.meta.env.VITE_API_URL;


/*
This interface describes the user information
that the backend returns after a successful login.
*/
export interface LoginUser {

    id: number;

    name: string;

    email: string;
}


/*
This interface describes the complete response
that is expected from the backend after login.
The user contains the information
defined inside LoginUser.
*/
export interface LoginResponse {

    message: string;

    role:
        "student" |
        "professor";

    user:
        LoginUser;
}


/*
This function sends the login information
from the frontend to the backend.
The function returns a LoginResponse
if the login was successful.
*/
export async function login(
    email: string,
    password: string,
    role: "student" | "professor"
): Promise<LoginResponse> {

    /*
    fetch sends an HTTP request
    to the login route of the backend.
    */
    const response =
        await fetch(

            `${API_URL}/api/auth/login`,

            {

                /*
                POST is used because login data
                is sent to the backend.
                */
                method:
                    "POST",

                /*
                This tells the backend
                that the request body contains JSON.
                */
                headers: {

                    "Content-Type":
                        "application/json"
                },

                /*
                JSON.stringify converts the JavaScript object
                into JSON before it is sent.
                */
                body:
                    JSON.stringify({

                        email: email,

                        password: password,

                        role: role
                    })
            }
        );


    /*
    The JSON response from the backend
    is converted back into a JavaScript object.
    */
    const data =
        await response.json();


    /*
    response.ok is false if the backend
    returned an error status.

    For example:
    400
    401
    500
    */
    if (response.ok == false) {

        /*
        If the backend returned its own error message,
        this message is used.

        Otherwise a general login error is shown.
        */
        throw new Error(

            data.message ||
            "Login fehlgeschlagen"
        );
    }


    /*
    If the request was successful,
    the login information is returned
    to the part of the frontend that called this function.
    */
    return data;
}


/*
This function sends the registration data
of a new student to the backend.
*/
export async function registerStudent(
    name: string,
    email: string,
    password: string,
    universityId: number,
    courseId: number,
    supervisorId: number
) {

    const response =
        await fetch(

            `${API_URL}/api/auth/register/student`,

            {

                /*
                POST is used because
                a new student account is created.
                */
                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"
                },

                /*
                All registration information
                is converted into JSON
                and sent to the backend.
                */
                body:
                    JSON.stringify({

                        name: name,

                        email: email,

                        password: password,

                        universityId: universityId,

                        courseId: courseId,

                        supervisorId: supervisorId
                    })
            }
        );


    /*
    Convert the backend response
    from JSON into a JavaScript object.
    */
    const data =
        await response.json();


    /*
    If the registration failed,
    an error is thrown.
    The error can later be shown
    inside the registration page.
    */
    if (response.ok == false) {

        throw new Error(

            data.message ||
            "Registrierung fehlgeschlagen"
        );
    }


    /*
    Return the successful backend response.
    */
    return data;
}


/*
This function sends the registration data
of a new professor to the backend.
Because more than one course can be selected,
courseIds is an array of numbers.
*/
export async function registerProfessor(
    name: string,
    email: string,
    password: string,
    universityId: number,
    chairId: number,
    courseIds: number[]
) {

    const response =
        await fetch(

            `${API_URL}/api/auth/register/professor`,

            {

                /*
                POST is used because
                a new professor account is created.
                */
                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"
                },

                /*
                Convert all registration information
                into JSON before sending it.
                */
                body:
                    JSON.stringify({

                        name: name,

                        email: email,

                        password: password,

                        universityId: universityId,

                        chairId: chairId,

                        courseIds: courseIds
                    })
            }
        );


    const data =
        await response.json();


    /*
    If the backend returns an error,
    stop the registration and throw an error.
    The backend message is used if available.
    */
    if (response.ok == false) {

        throw new Error(

            data.message ||
            "Registrierung fehlgeschlagen"
        );
    }


    return data;
}