/*
This allows the frontend to use the backend
without writing the server address directly
into every API request.
*/
const API_URL =
    import.meta.env.VITE_API_URL;


/*
This interface describes the thesis information
that can be returned together with a student.
The dates arrive from the backend as strings
because they are transferred as JSON.
*/
export interface StudentThesis {

    id: number;

    title: string;

    description: string;

    startDate: string;

    endDate: string;
}


/*
This interface describes the student information
that the frontend receives from the backend.
supervisorId can be null if no professor
is assigned to the student.
thesis can also be null if the student
does not have a thesis yet.
*/
export interface StudentData {

    id: number;

    name: string;

    email: string;

    course: string;

    supervisorId:
        number | null;

    thesis:
        StudentThesis | null;
}


/*
This function loads one student
from the backend.
The studentId is added to the URL
so the backend knows which student
should be returned.
The function returns StudentData.
*/
export async function getStudent(
    studentId: number
): Promise<StudentData> {

    /*
    Send a GET request to the backend.
    GET is the default method of fetch,
    so it does not have to be written manually.
    */
    const response =
        await fetch(
            `${API_URL}/api/student/${studentId}`
        );


    /*
    Convert the JSON response
    into a JavaScript object.
    */
    const data =
        await response.json();


    /*
    If the backend returns an error status,
    stop the function and throw an error.
    If the backend sends its own message,
    this message is used.
    Otherwise a general error message is used.
    */
    if (response.ok == false) {

        throw new Error(

            data.message ||
            "Student konnte nicht geladen werden"
        );
    }


    /*
    Return the student data
    to the frontend.
    */
    return data;
}


/*
This interface describes the information
that is needed when a student is updated.
The complete name, email and course
are always sent again.
Because of this, none of these values
have to be optional.
*/
interface UpdateStudentData {

    id: number;

    name: string;

    email: string;

    course: string;
}


/*
This function updates the information
of an existing student.
The other values are sent
inside the request body.
*/
export async function updateStudent(
    props: UpdateStudentData
): Promise<StudentData> {

    /*
    PUT is used because an existing student
    is updated.
    The student ID is added to the URL.
    */
    const response =
        await fetch(
            `${API_URL}/api/student/${props.id}`,
            {

                method:
                    "PUT",

                /*
                The request body contains JSON.
                */
                headers: {

                    "Content-Type":
                        "application/json"
                },

                /*
                The student information is converted
                into JSON before it is sent.
                The ID is not needed inside the body
                because it is already part of the URL.
                */
                body:
                    JSON.stringify({

                        name: props.name,

                        email: props.email,

                        course: props.course
                    })
            }
        );


    /*
    Convert the backend response
    into a JavaScript object.
    */
    const data =
        await response.json();


    /*
    If updating the student failed,
    an error is thrown.
    */
    if (response.ok == false) {

        throw new Error(
            "Student konnte nicht aktualisiert werden"
        );
    }


    /*
    Return the updated student data.
    */
    return data;
}