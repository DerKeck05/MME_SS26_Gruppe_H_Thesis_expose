import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    registerStudent
} from "../apis/auth-api.ts";

import {
    LOGIN_MESSAGES
} from "./login_fails";

import "./design_css/login.css";
import "./design_css/register-prof.css";


const API_URL =
    import.meta.env.VITE_API_URL;


/*
This type describes one university
that comes from the backend.
*/
type University = {
    id: number;
    name: string;
};


/*
This type describes one course
that can be selected by the student.
*/
type Course = {
    id: number;
    name: string;
};


/*
This type describes one professor.
The chair is also stored
because it is shown together
with the professor name.
*/
type Supervisor = {
    id: number;
    name: string;
    chair: string;
};


function RegisterStudentPage() {

    /*
    useNavigate is used to change
    to another page after registration.
    */
    const navigate =
        useNavigate();


    /*
    These states store
    the information entered by the student.
    */
    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    /*

    universities contains all universities
    loaded from the backend.
    universityId stores
    the currently selected university.
    HTML select fields return strings,
    therefore the ID is stored as a string.
    */
    const [universities, setUniversities] =
        useState<University[]>([]);

    const [universityId, setUniversityId] =
        useState("");


    /*
    courses contains all courses
    of the selected university.
    coureId stores
    the currently selected course.
    */
    const [courses, setCourses] =
        useState<Course[]>([]);

    const [courseId, setCourseId] =
        useState("");


    /*
    supervisors contains the professors
    that supervise the selected course.
    supervisorId stores
    the selected professor.
    */
    const [supervisors, setSupervisors] =
        useState<Supervisor[]>([]);

    const [supervisorId, setSupervisorId] =
        useState("");


    /*
    Stores an error message
    that can be shown to the user.
    */
    const [errorMessage, setErrorMessage] =
        useState("");


    /*
    This effect runs once
    when the registration page is opened.
    It loads all universities
    from the backend.
    */
    useEffect(() => {

        async function loadUniversities() {

            try {

                setErrorMessage("");


                const response =
                    await fetch(
                        `${API_URL}/api/universities`
                    );


                if (response.ok == false) {

                    throw new Error(
                        "Hochschulen konnten nicht geladen werden"
                    );
                }


                const data =
                    await response.json();


                setUniversities(
                    data
                );


            } catch (error) {

                console.error(error);


                setErrorMessage(
                    "Hochschulen konnten nicht geladen werden"
                );
            }
        }


        loadUniversities();

    }, []);


    /*
    This effect runs whenever
    the selected university changes.
    Old course and professor selections
    are removed first.
    After that the courses
    of the university are loaded.
    */
    useEffect(() => {

        async function loadCourses() {

            /*
            Remove selections
            from the previous university.
            */
            setCourses([]);

            setCourseId("");

            setSupervisors([]);

            setSupervisorId("");


            /*
            If no university was selected,
            no courses have to be loaded.
            */
            if (
                universityId == ""
            ) {

                return;
            }


            try {

                setErrorMessage("");


                const response =
                    await fetch(
                        `${API_URL}/api/universities/${universityId}/courses`
                    );


                if (response.ok == false) {

                    throw new Error(
                        "Studiengänge konnten nicht geladen werden"
                    );
                }


                const data =
                    await response.json();


                setCourses(
                    data
                );


            } catch (error) {

                console.error(error);


                setErrorMessage(
                    "Studiengänge konnten nicht geladen werden"
                );
            }
        }


        loadCourses();

    }, [
        universityId
    ]);


    /*
    This effect runs whenever
    the university or course changes.
    Only professors that supervise
    the selected course at the selected
    university are loaded.
    */
    useEffect(() => {

        async function loadSupervisors() {

            /*
            Remove the previous
            professor selection.
            */
            setSupervisors([]);

            setSupervisorId("");


            /*
            University and course
            have to be selected first.
            */
            if (
                universityId == "" ||
                courseId == ""
            ) {

                return;
            }


            try {

                setErrorMessage("");


                const response =
                    await fetch(
                        `${API_URL}/api/universities/${universityId}/courses/${courseId}/supervisors`
                    );


                if (response.ok == false) {

                    throw new Error(
                        "Professoren konnten nicht geladen werden"
                    );
                }


                const data =
                    await response.json();


                setSupervisors(
                    data
                );


            } catch (error) {

                console.error(error);


                setErrorMessage(
                    "Professoren konnten nicht geladen werden"
                );
            }
        }


        loadSupervisors();

    }, [
        universityId,
        courseId
    ]);


    /*
    This function runs
    when the registration form is submitted.
    First all required fields are checked.
    After that the registration data
    is sent to the backend.
    */
    async function registerFunction(
        event: React.FormEvent<HTMLFormElement>
    ) {

        /*
        Prevent the browser
        from reloading the page.
        */
        event.preventDefault();


        setErrorMessage("");


        /*
        Every field is required.

        The registration stops
        if one value is missing.
        */
        if (
            name.trim() == "" ||
            email.trim() == "" ||
            password.trim() == "" ||
            universityId == "" ||
            courseId == "" ||
            supervisorId == ""
        ) {

            setErrorMessage(
                LOGIN_MESSAGES.REGISTER_FIELDS_MISSING
            );

            return;
        }


        try {

            /*
            Send all registration data
            to the backend.
            The IDs come from HTML select fields
            as strings and are converted
            into numbers before sending them.
            */
            await registerStudent(

                name.trim(),

                email.trim(),

                password,

                Number(
                    universityId
                ),

                Number(
                    courseId
                ),

                Number(
                    supervisorId
                )
            );


            /*
            After successful registration
            the user is sent
            back to the login page.
            */
            navigate("/");


        } catch (error) {

            console.error(error);


            /*
            If the API returned a normal Error,
            its message is shown.
            Otherwise a general registration
            error message is used.
            */
            if (
                error instanceof Error
            ) {

                setErrorMessage(
                    error.message
                );

            } else {

                setErrorMessage(
                    LOGIN_MESSAGES.REGISTER_FAILED
                );
            }
        }
    }


    return (

        <div className="auth-page">

            <form
                className="login-glass register-prof-glass"
                onSubmit={
                    registerFunction
                }
            >

                <h2
                    className="register-title"
                >
                    Registrieren als Student
                </h2>

                <div className="auth-field-group">

                    <label>
                        Name:
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                    />

                </div>

                <div className="auth-field-group">

                    <label>
                        E-Mail:
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                    />

                </div>

                <div className="auth-field-group">

                    <label>
                        Passwort:
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                    />

                </div>

                <div className="auth-field-group">

                    <label>
                        Hochschule:
                    </label>

                    <select
                        className="styled-auth-select"
                        value={universityId}
                        onChange={(event) =>
                            setUniversityId(
                                event.target.value
                            )
                        }
                    >

                        <option value="">
                            Hochschule auswählen
                        </option>


                        {
                            universities.map(
                                (university) => (

                                    <option
                                        key={university.id}
                                        value={university.id}
                                    >
                                        {university.name}
                                    </option>
                                )
                            )
                        }

                    </select>

                </div>

                <div className="auth-field-group">

                    <label>
                        Studiengang:
                    </label>

                    <select
                        className="styled-auth-select"
                        value={courseId}
                        onChange={(event) =>
                            setCourseId(
                                event.target.value
                            )
                        }
                        disabled={
                            universityId == ""
                        }
                    >

                        <option value="">
                            Studiengang auswählen
                        </option>


                        {
                            courses.map(
                                (course) => (

                                    <option
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.name}
                                    </option>
                                )
                            )
                        }

                    </select>

                </div>

                <div className="auth-field-group">

                    <label>
                        Professor:
                    </label>

                    <select
                        className="styled-auth-select"
                        value={supervisorId}
                        onChange={(event) =>
                            setSupervisorId(
                                event.target.value
                            )
                        }
                        disabled={
                            courseId == "" ||
                            supervisors.length == 0
                        }
                    >

                        <option value="">
                            Professor auswählen
                        </option>


                        {
                            supervisors.map(
                                (supervisor) => (

                                    <option
                                        key={supervisor.id}
                                        value={supervisor.id}
                                    >
                                        {supervisor.name}
                                        {" – "}
                                        {supervisor.chair}
                                    </option>
                                )
                            )
                        }

                    </select>


                    {
                        courseId != "" &&
                        supervisors.length == 0 && (

                            <div
                                className="multi-select-empty"
                            >
                                Für diesen Studiengang
                                ist noch kein Professor
                                registriert.
                            </div>
                        )
                    }

                </div>

                <button
                    type="submit"
                >
                    Registrieren
                </button>

            </form>

            {
                errorMessage != "" && (

                    <div
                        className="error-box"
                    >
                        {errorMessage}
                    </div>
                )
            }

        </div>
    );
}


export default RegisterStudentPage;