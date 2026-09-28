import {
    useEffect,
    useMemo,
    useRef,
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
import "./design_css/register-prof.css";


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


    const [
        isCourseDropdownOpen,
        setIsCourseDropdownOpen
    ] = useState(false);


    const courseDropdownRef =
        useRef<HTMLDivElement | null>(null);



    /*
     * Hochschulen laden
     */
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


                setUniversities(data);


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
     * Lehrstühle laden
     */
    useEffect(() => {

        async function loadChairs() {

            setChairs([]);

            setChairId("");

            setCourses([]);

            setSelectedCourseIds([]);

            setIsCourseDropdownOpen(false);


            if (universityId == "") {

                return;
            }


            try {

                setErrorMessage("");


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

                console.error(error);


                setErrorMessage(
                    "Lehrstühle konnten nicht geladen werden"
                );
            }
        }


        loadChairs();

    }, [universityId]);



    /*
     * Studiengänge laden
     */
    useEffect(() => {

        async function loadCourses() {

            setCourses([]);

            setSelectedCourseIds([]);

            setIsCourseDropdownOpen(false);


            if (
                universityId == "" ||
                chairId == ""
            ) {

                return;
            }


            try {

                setErrorMessage("");


                /*
                 * WICHTIG:
                 * Hochschule + Lehrstuhl müssen
                 * beide in der URL stehen.
                 */
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

                console.error(error);


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



    /*
     * Dropdown schließen,
     * wenn außerhalb geklickt wird
     */
    useEffect(() => {

        function handleOutsideClick(
            event: MouseEvent
        ) {

            if (
                courseDropdownRef.current &&
                !courseDropdownRef.current.contains(
                    event.target as Node
                )
            ) {

                setIsCourseDropdownOpen(false);
            }
        }


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };

    }, []);



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


            return;
        }


        setSelectedCourseIds([

            ...selectedCourseIds,

            courseId
        ]);
    }



    const selectedCourseText =
        useMemo(() => {

            if (
                selectedCourseIds.length == 0
            ) {

                return "Studiengänge auswählen";
            }


            const selectedNames =
                courses
                    .filter(
                        (course) =>
                            selectedCourseIds.includes(
                                course.id
                            )
                    )
                    .map(
                        (course) =>
                            course.name
                    );


            if (
                selectedNames.length == 1
            ) {

                return selectedNames[0];
            }


            if (
                selectedNames.length == 2
            ) {

                return selectedNames.join(", ");
            }


            return (
                `${selectedNames.length} Studiengänge ausgewählt`
            );

        }, [
            courses,
            selectedCourseIds
        ]);



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
            chairId == "" ||
            selectedCourseIds.length == 0
        ) {

            setErrorMessage(
                "Bitte alle Felder ausfüllen"
            );


            return;
        }


        try {

            const data =
                await registerProfessor(

                    name.trim(),

                    email.trim(),

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

            console.error(error);


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



    function toggleCourseDropdown() {

        if (
            courses.length == 0
        ) {

            return;
        }


        setIsCourseDropdownOpen(
            !isCourseDropdownOpen
        );
    }



    return (

        <div className="auth-page">


            <form
                className="login-glass register-prof-glass"
                onSubmit={registerFunction}
            >


                <h2
                    className="register-title professor-title"
                >

                    Registrieren als Professor

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
                        Lehrstuhl / Professur:
                    </label>


                    <select
                        className="styled-auth-select"
                        value={chairId}
                        onChange={(event) =>
                            setChairId(
                                event.target.value
                            )
                        }
                        disabled={
                            universityId == ""
                        }
                    >

                        <option value="">
                            Lehrstuhl auswählen
                        </option>


                        {
                            chairs.map(
                                (chair) => (

                                    <option
                                        key={chair.id}
                                        value={chair.id}
                                    >

                                        {chair.name}

                                    </option>
                                )
                            )
                        }

                    </select>

                </div>



                <div className="auth-field-group">

                    <label>
                        Studiengänge:
                    </label>


                    <div
                        className="custom-multi-select"
                        ref={courseDropdownRef}
                    >


                        <button
                            type="button"
                            className="multi-select-trigger"
                            onClick={
                                toggleCourseDropdown
                            }
                            disabled={
                                chairId == ""
                            }
                        >

                            <span
                                className="multi-select-trigger-text"
                            >

                                {
                                    chairId == ""
                                        ? "Zuerst Lehrstuhl auswählen"
                                        : selectedCourseText
                                }

                            </span>


                            <span
                                className="multi-select-arrow"
                            >

                                ▼

                            </span>

                        </button>



                        {
                            isCourseDropdownOpen &&
                            courses.length > 0 && (

                                <div
                                    className="multi-select-dropdown"
                                >

                                    {
                                        courses.map(
                                            (course) => (

                                                <label
                                                    key={course.id}
                                                    className="multi-select-option"
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
                                                    />


                                                    <span>

                                                        {course.name}

                                                    </span>

                                                </label>

                                            )
                                        )
                                    }

                                </div>
                            )
                        }



                        {
                            chairId != "" &&
                            courses.length == 0 && (

                                <div
                                    className="multi-select-empty"
                                >

                                    Keine Studiengänge vorhanden

                                </div>
                            )
                        }

                    </div>

                </div>



                <button type="submit">

                    Registrieren

                </button>


            </form>



            {
                errorMessage != "" && (

                    <div className="error-box">

                        {errorMessage}

                    </div>
                )
            }


        </div>
    );
}


export default RegisterProfessorPage;