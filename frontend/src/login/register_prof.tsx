import {
    useEffect,
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


/*
This type describes one university
that comes from the backend.
*/
type University = {
    id: number;
    name: string;
};


/*
This type describes one chair.
The universityId shows
which university the chair belongs to.
*/
type Chair = {
    id: number;
    name: string;
    universityId: number;
};


/*
This type describes one course.
The universityId shows
which university the course belongs to.
*/
type Course = {
    id: number;
    name: string;
    universityId: number;
};


function RegisterProfessorPage() {

    /*
    useNavigate is used to change
    to another page after registration.
    */
    const navigate =
        useNavigate();


    /*
    These states store the information
    entered by the professor.
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
    universityId stores the university
    currently selected by the user.
    The ID is stored as a string
    because HTML select fields return strings.
    */
    const [universities, setUniversities] =
        useState<University[]>([]);

    const [universityId, setUniversityId] =
        useState("");


    /*
    chairs contains the chairs
    of the selected university.
    chairId stores the currently
    selected chair.
    */
    const [chairs, setChairs] =
        useState<Chair[]>([]);

    const [chairId, setChairId] =
        useState("");


    /*
    courses contains the courses
    that belong to the selected chair.
    selectedCourseIds contains the IDs
    of all courses selected by the professor.
    */
    const [courses, setCourses] =
        useState<Course[]>([]);

    const [selectedCourseIds, setSelectedCourseIds] =
        useState<number[]>([]);


    /*
    Stores an error message
    that can be shown to the user.
    */
    const [errorMessage, setErrorMessage] =
        useState("");


    /*
    Stores if the custom course dropdown
    is currently open or closed.
    */
    const [
        isCourseDropdownOpen,
        setIsCourseDropdownOpen
    ] = useState(false);


    /*
    Reference to the course dropdown.
    This is needed to detect clicks
    outside of the dropdown.
    */
    const courseDropdownRef =
        useRef<HTMLDivElement | null>(null);


    /*
    This effect runs once
    when the page is opened.
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
    Old chair and course selections
    are cleared first.
    After that all chairs belonging
    to the university are loaded.
    */
    useEffect(() => {

        async function loadChairs() {

            /*
            Old selections are removed
            because they belong
            to the previously selected university.
            */
            setChairs([]);

            setChairId("");

            setCourses([]);

            setSelectedCourseIds([]);

            setIsCourseDropdownOpen(false);


            /*
            If no university was selected yet,
            no chairs have to be loaded.
            */
            if (universityId == "") {
                return;
            }


            try {

                setErrorMessage("");


                const response =
                    await fetch(
                        `${API_URL}/api/universities/${universityId}/chairs`
                    );


                if (response.ok == false) {

                    throw new Error(
                        "Lehrstühle konnten nicht geladen werden"
                    );
                }


                const data =
                    await response.json();


                setChairs(
                    data
                );


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
    This effect runs whenever
    the university or chair changes.
    Only courses that belong
    to the selected chair are loaded.
    */
    useEffect(() => {

        async function loadCourses() {

            /*
            Remove courses from
            the previous chair.
            */
            setCourses([]);

            setSelectedCourseIds([]);

            setIsCourseDropdownOpen(false);


            /*
            University and chair
            have to be selected first.
            */
            if (
                universityId == "" ||
                chairId == ""
            ) {

                return;
            }


            try {

                setErrorMessage("");


                /*
                University and chair are both
                part of the URL because the backend
                checks this combination.
                */
                const response =
                    await fetch(
                        `${API_URL}/api/universities/${universityId}/chairs/${chairId}/courses`
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
        universityId,
        chairId
    ]);


    /*
    This effect adds a click listener
    to the complete document.
    If the user clicks somewhere outside
    of the course dropdown,
    the dropdown is closed.
    */
    useEffect(() => {

        function handleOutsideClick(
            event: MouseEvent
        ) {

            /*
            event.target can theoretically
            contain another type.
            For contains() I need a Node.
            */
            const target =
                event.target;


            if (!(target instanceof Node)) {
                return;
            }


            if (
                courseDropdownRef.current != null &&
                courseDropdownRef.current.contains(target) == false
            ) {

                setIsCourseDropdownOpen(
                    false
                );
            }
        }


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        /*
        The listener is removed
        when the component is closed.
        This prevents unused listeners
        from remaining in the browser.
        */
        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };

    }, []);


    /*
    This function is called
    when one course checkbox is clicked.
    If the course is already selected,
    it is removed.
    Otherwise it is added.
    */
    function toggleCourse(
        courseId: number
    ) {

        /*
        Course is already selected.
        */
        if (
            selectedCourseIds.includes(
                courseId
            )
        ) {

            const newCourseIds: number[] =
                [];


            /*
            Copy every ID except
            the one that should be removed.
            */
            for (const id of selectedCourseIds) {

                if (id != courseId) {

                    newCourseIds.push(
                        id
                    );
                }
            }


            setSelectedCourseIds(
                newCourseIds
            );

            return;
        }


        /*
        Course was not selected yet.
        Copy the existing IDs
        and add the new course.
        */
        const newCourseIds =
            [...selectedCourseIds];


        newCourseIds.push(
            courseId
        );


        setSelectedCourseIds(
            newCourseIds
        );
    }


    /*
    This function creates the text
    shown inside the multi select button.
    */
    function getSelectedCourseText() {

        if (
            selectedCourseIds.length == 0
        ) {

            return "Studiengänge auswählen";
        }


        /*
        Store the names
        of all selected courses.
        */
        const selectedNames: string[] =
            [];


        for (const course of courses) {

            if (
                selectedCourseIds.includes(
                    course.id
                )
            ) {

                selectedNames.push(
                    course.name
                );
            }
        }


        if (
            selectedNames.length == 1
        ) {

            return selectedNames[0];
        }


        if (
            selectedNames.length == 2
        ) {

            return selectedNames.join(
                ", "
            );
        }


        return (
            `${selectedNames.length} Studiengänge ausgewählt`
        );
    }


    /*
    The text is calculated
    for the current selection.
    */
    const selectedCourseText =
        getSelectedCourseText();


    /*
    This function runs
    when the registration form is submitted.
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
        Check if all required fields
        were filled in.
        At least one course
        has to be selected.
        */
        if (
            name.trim() == "" ||
            email.trim() == "" ||
            password.trim() == "" ||
            universityId == "" ||
            chairId == "" ||
            selectedCourseIds.length == 0
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
            universityId and chairId are strings
            inside the select fields
            and are converted into numbers here.
            */
            await registerProfessor(

                name.trim(),

                email.trim(),

                password,

                Number(universityId),

                Number(chairId),

                selectedCourseIds
            );


            /*
            After successful registration
            the user is sent back
            to the login page.
            */
            navigate("/");


        } catch (error) {

            console.error(error);


            /*
            If the API returned a normal Error,
            its message is shown.
            Otherwise the general
            registration error is used.
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


    /*
    STUDIENGANG DROPDOWN ÖFFNEN / SCHLIESSEN
    If no courses were loaded,
    the dropdown cannot be opened.
    */
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
                            className={
                                isCourseDropdownOpen
                                    ? "multi-select-trigger open"
                                    : "multi-select-trigger"
                            }
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
                                className={
                                    isCourseDropdownOpen
                                        ? "multi-select-arrow rotate"
                                        : "multi-select-arrow"
                                }
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