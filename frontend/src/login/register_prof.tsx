import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    registerProfessor
} from "../apis/auth-api.ts";

import {
    LOGIN_MESSAGES
} from "./login_fails";

import "./design_css/login.css";


const API_URL =
    import.meta.env.VITE_API_URL;



type University = {

    id: number;

    name: string;
};


type Chair = {

    id: number;

    name: string;

    universityId: number;
};


type Course = {

    id: number;

    name: string;

    universityId: number;
};



function RegisterProfessorPage() {

    const navigate =
        useNavigate();


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    const [
        universities,
        setUniversities
    ] = useState<University[]>([]);


    const [
        universityId,
        setUniversityId
    ] = useState("");


    const [
        chairs,
        setChairs
    ] = useState<Chair[]>([]);


    const [
        chairId,
        setChairId
    ] = useState("");


    const [
        courses,
        setCourses
    ] = useState<Course[]>([]);


    const [
        selectedCourseIds,
        setSelectedCourseIds
    ] = useState<number[]>([]);


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


                setUniversities(data);


            } catch (error) {

                setErrorMessage(
                    "Hochschulen konnten nicht geladen werden"
                );
            }
        }


        loadUniversities();

    }, []);



    /* =========================
       LEHRSTÜHLE LADEN
       ========================= */

    useEffect(() => {

        async function loadChairs() {

            /*
             * Alte Auswahl zurücksetzen,
             * wenn eine andere Hochschule
             * gewählt wird.
             */
            setChairs([]);

            setChairId("");

            setCourses([]);

            setSelectedCourseIds([]);


            if (universityId == "") {

                return;
            }


            try {

                const response =
                    await fetch(

                        `${API_URL}/api/universities/${universityId}/chairs`

                    );


                if (!response.ok) {

                    throw new Error(
                        "Lehrstühle konnten nicht geladen werden"
                    );
                }


                const data =
                    await response.json();


                setChairs(data);


            } catch (error) {

                setErrorMessage(
                    "Lehrstühle konnten nicht geladen werden"
                );
            }
        }


        loadChairs();

    }, [universityId]);



    /* =========================
       STUDIENGÄNGE LADEN
       ========================= */

    useEffect(() => {

        async function loadCourses() {

            setCourses([]);

            setSelectedCourseIds([]);


            if (
                universityId == "" ||
                chairId == ""
            ) {

                return;
            }


            try {

                const response =
                    await fetch(

                        `${API_URL}/api/universities/${universityId}/chairs/${chairId}/courses`

                    );


                if (!response.ok) {

                    throw new Error(
                        "Studiengänge konnten nicht geladen werden"
                    );
                }


                const data =
                    await response.json();


                setCourses(data);


            } catch (error) {

                setErrorMessage(
                    "Studiengänge konnten nicht geladen werden"
                );
            }
        }


        loadCourses();

    }, [
        universityId,
        chairId
    ]);



    /* =========================
       STUDIENGANG AUSWÄHLEN
       ========================= */

    function toggleCourse(
        courseId: number
    ) {

        if (
            selectedCourseIds.includes(
                courseId
            )
        ) {

            setSelectedCourseIds(

                selectedCourseIds.filter(
                    (id) =>
                        id != courseId
                )
            );

        } else {

            setSelectedCourseIds([

                ...selectedCourseIds,

                courseId
            ]);
        }
    }



    /* =========================
       TEXT IM DROPDOWN
       ========================= */

    function getSelectedCourseText() {

        if (
            selectedCourseIds.length == 0
        ) {

            return "Studiengänge auswählen";
        }


        if (
            selectedCourseIds.length == 1
        ) {

            const selectedCourse =
                courses.find(
                    (course) =>
                        course.id ==
                        selectedCourseIds[0]
                );


            if (selectedCourse) {

                return selectedCourse.name;
            }
        }


        return (
            `${selectedCourseIds.length} Studiengänge ausgewählt`
        );
    }



    /* =========================
       REGISTRIEREN
       ========================= */

    async function RegisterFunction() {

        setErrorMessage("");


        if (
            name == "" ||
            email == "" ||
            password == "" ||
            universityId == "" ||
            chairId == "" ||
            selectedCourseIds.length == 0
        ) {

            setErrorMessage(
                "Bitte alle Felder ausfüllen und mindestens einen Studiengang auswählen"
            );

            return;
        }


        try {

            const data =
                await registerProfessor(

                    name,

                    email,

                    password,

                    Number(universityId),

                    Number(chairId),

                    selectedCourseIds
                );


            console.log(
                LOGIN_MESSAGES.REGISTER_SUCCESS
            );


            console.log(data);


            navigate("/");


        } catch (error) {

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


            <div className="login-glass">


                <h2
                    className="
                        register-title
                        professor-title
                    "
                >

                    Registrieren als Professor

                </h2>



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



                <label>
                    Hochschule:
                </label>


                <select

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



                {
                    universityId != "" && (

                        <>

                            <label>
                                Lehrstuhl / Professur:
                            </label>


                            <select

                                value={chairId}

                                onChange={(event) =>
                                    setChairId(
                                        event.target.value
                                    )
                                }

                            >

                                <option value="">
                                    Lehrstuhl auswählen
                                </option>


                                {
                                    chairs.map(
                                        (chair) => (

                                            <option

                                                key={
                                                    chair.id
                                                }

                                                value={
                                                    chair.id
                                                }

                                            >

                                                {
                                                    chair.name
                                                }

                                            </option>

                                        )
                                    )
                                }

                            </select>

                        </>
                    )
                }



                {
                    chairId != "" && (

                        <>

                            <label>
                                Studiengänge:
                            </label>


                            <details>


                                <summary

                                    style={{

                                        background:
                                            "rgba(255, 255, 255, 0.75)",

                                        borderRadius:
                                            "12px",

                                        padding:
                                            "14px",

                                        cursor:
                                            "pointer",

                                        marginBottom:
                                            "8px"
                                    }}

                                >

                                    {
                                        getSelectedCourseText()
                                    }

                                </summary>



                                <div

                                    style={{

                                        maxHeight:
                                            "170px",

                                        overflowY:
                                            "auto",

                                        background:
                                            "rgba(255, 255, 255, 0.9)",

                                        borderRadius:
                                            "12px",

                                        padding:
                                            "10px"
                                    }}

                                >


                                    {
                                        courses.length == 0 && (

                                            <p>

                                                Keine Studiengänge
                                                für diesen Lehrstuhl
                                                vorhanden

                                            </p>
                                        )
                                    }


                                    {
                                        courses.map(
                                            (course) => (

                                                <label

                                                    key={
                                                        course.id
                                                    }

                                                    style={{

                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        gap:
                                                            "10px",

                                                        padding:
                                                            "8px",

                                                        cursor:
                                                            "pointer"
                                                    }}

                                                >


                                                    <input

                                                        type="checkbox"

                                                        checked={
                                                            selectedCourseIds.includes(
                                                                course.id
                                                            )
                                                        }

                                                        onChange={() =>
                                                            toggleCourse(
                                                                course.id
                                                            )
                                                        }

                                                        style={{

                                                            width:
                                                                "auto",

                                                            margin:
                                                                "0"
                                                        }}

                                                    />


                                                    <span>

                                                        {
                                                            course.name
                                                        }

                                                    </span>


                                                </label>

                                            )
                                        )
                                    }


                                </div>


                            </details>

                        </>
                    )
                }



                <button
                    onClick={
                        RegisterFunction
                    }
                >

                    Registrieren

                </button>


            </div>



            {
                errorMessage != "" && (

                    <div className="error-box">

                        {
                            errorMessage
                        }

                    </div>
                )
            }


        </div>
    );
}


export default RegisterProfessorPage;