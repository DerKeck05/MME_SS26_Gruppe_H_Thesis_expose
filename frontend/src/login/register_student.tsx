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



type University = {

    id: number;

    name: string;
};


type Course = {

    id: number;

    name: string;

    universityId: number;
};


type Supervisor = {

    id: number;

    name: string;

    chair: string;
};



function RegisterStudentPage() {

    const navigate =
        useNavigate();


    const [
        name,
        setName
    ] = useState("");


    const [
        email,
        setEmail
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        universities,
        setUniversities
    ] = useState<University[]>([]);


    const [
        universityId,
        setUniversityId
    ] = useState("");


    const [
        courses,
        setCourses
    ] = useState<Course[]>([]);


    const [
        courseId,
        setCourseId
    ] = useState("");


    const [
        supervisors,
        setSupervisors
    ] = useState<Supervisor[]>([]);


    const [
        supervisorId,
        setSupervisorId
    ] = useState("");


    const [
        errorMessage,
        setErrorMessage
    ] = useState("");



    /* =========================
       HOCHSCHULEN LADEN
       ========================= */

    useEffect(() => {

        async function loadUniversities() {

            try {

                setErrorMessage("");


                const response =
                    await fetch(

                        `${API_URL}/api/universities`

                    );


                if (!response.ok) {

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

                console.error(
                    error
                );


                setErrorMessage(
                    "Hochschulen konnten nicht geladen werden"
                );
            }
        }


        loadUniversities();

    }, []);



    /* =========================
       STUDIENGÄNGE LADEN
       ========================= */

    useEffect(() => {

        async function loadCourses() {

            setCourses([]);

            setCourseId("");

            setSupervisors([]);

            setSupervisorId("");


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


                if (!response.ok) {

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

                console.error(
                    error
                );


                setErrorMessage(
                    "Studiengänge konnten nicht geladen werden"
                );
            }
        }


        loadCourses();

    }, [
        universityId
    ]);



    /* =========================
       PROFESSOREN LADEN
       ========================= */

    useEffect(() => {

        async function loadSupervisors() {

            setSupervisors([]);

            setSupervisorId("");


            if (
                universityId == "" ||
                courseId == ""
            ) {

                return;
            }


            try {

                setErrorMessage("");


                /*
                 * Nur Professoren laden,
                 * die genau diesen Studiengang
                 * an dieser Hochschule betreuen.
                 */
                const response =
                    await fetch(

                        `${API_URL}/api/universities/${universityId}/courses/${courseId}/supervisors`

                    );


                if (!response.ok) {

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

                console.error(
                    error
                );


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



    /* =========================
       REGISTRIERUNG
       ========================= */

    async function registerFunction(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();


        setErrorMessage("");


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

            const data =
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


            console.log(
                LOGIN_MESSAGES.REGISTER_SUCCESS
            );


            console.log(
                data
            );


            navigate("/");


        } catch (error) {

            console.error(
                error
            );


            if (
                error instanceof Error
            ) {

                setErrorMessage(
                    error.message
                );

            } else {

                setErrorMessage(
                    "Registrierung fehlgeschlagen"
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

                        value={
                            name
                        }

                        onChange={
                            (event) =>
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

                        value={
                            email
                        }

                        onChange={
                            (event) =>
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

                        value={
                            password
                        }

                        onChange={
                            (event) =>
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

                        value={
                            universityId
                        }

                        onChange={
                            (event) =>
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

                                        key={
                                            university.id
                                        }

                                        value={
                                            university.id
                                        }

                                    >

                                        {
                                            university.name
                                        }

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

                        value={
                            courseId
                        }

                        onChange={
                            (event) =>
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

                                        key={
                                            course.id
                                        }

                                        value={
                                            course.id
                                        }

                                    >

                                        {
                                            course.name
                                        }

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

                        value={
                            supervisorId
                        }

                        onChange={
                            (event) =>
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

                                        key={
                                            supervisor.id
                                        }

                                        value={
                                            supervisor.id
                                        }

                                    >

                                        {
                                            supervisor.name
                                        }

                                        {" – "}

                                        {
                                            supervisor.chair
                                        }

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

                        {
                            errorMessage
                        }

                    </div>
                )
            }


        </div>
    );
}


export default RegisterStudentPage;