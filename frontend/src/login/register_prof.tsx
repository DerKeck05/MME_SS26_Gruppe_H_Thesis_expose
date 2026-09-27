import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {registerProfessor} from "../apis/auth-api.ts";
import {LOGIN_MESSAGES} from "./login_fails";
import "./design_css/login.css";

const API_URL = import.meta.env.VITE_API_URL;


type University = {
    id: number;
    name: string;
};


type Course = {
    id: number;
    name: string;
    universityId: number;
};

const chairOptions = [
    "Lehrstuhl für Medieninformatik",
    "Anderer Lehrstuhl"
];


function RegisterProfessorPage() {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [universities, setUniversities] =
        useState<University[]>([]);
    const [universityId, setUniversityId] =
        useState("");
    const [chairSelection, setChairSelection] =
        useState("");
    const [customChair, setCustomChair] =
        useState("");
    const [courses, setCourses] =
        useState<Course[]>([]);
    const [selectedCourseIds, setSelectedCourseIds] =
        useState<number[]>([]);
    const [errorMessage, setErrorMessage] =
        useState("");


    /* Hochschulen laden */
    useEffect(() => {

        async function loadUniversities() {

            try {

                const response = await fetch(
                    `${API_URL}/api/universities`
                );


                if (!response.ok) {
                    throw new Error(
                        "Hochschulen konnten nicht geladen werden"
                    );
                }


                const data = await response.json();

                setUniversities(data);


            } catch (error) {

                setErrorMessage(
                    "Hochschulen konnten nicht geladen werden"
                );
            }
        }


        loadUniversities();

    }, []);


    /* Studiengänge laden */
    useEffect(() => {

        async function loadCourses() {

            setCourses([]);
            setSelectedCourseIds([]);
            setChairSelection("");
            setCustomChair("");


            if (universityId == "") {
                return;
            }


            try {

                const response = await fetch(
                    `${API_URL}/api/universities/${universityId}/courses`
                );


                if (!response.ok) {
                    throw new Error(
                        "Studiengänge konnten nicht geladen werden"
                    );
                }


                const data = await response.json();

                setCourses(data);


            } catch (error) {

                setErrorMessage(
                    "Studiengänge konnten nicht geladen werden"
                );
            }
        }


        loadCourses();

    }, [universityId]);


    function toggleCourse(courseId: number) {

        if (selectedCourseIds.includes(courseId)) {

            setSelectedCourseIds(
                selectedCourseIds.filter(
                    (id) => id != courseId
                )
            );

        } else {

            setSelectedCourseIds([
                ...selectedCourseIds,
                courseId
            ]);
        }
    }

    function getChair() {
        if (chairSelection == "other") {
            return customChair;
        }
        return chairSelection;
    }

    function getSelectedCourseText() {

        if (selectedCourseIds.length == 0) {
            return "Studiengänge auswählen";
        }

        if (selectedCourseIds.length == 1) {

            const selectedCourse = courses.find(
                (course) =>
                    course.id == selectedCourseIds[0]
            );


            if (selectedCourse) {
                return selectedCourse.name;
            }
        }

        return `${selectedCourseIds.length} Studiengänge ausgewählt`;
    }

    async function RegisterFunction() {
        setErrorMessage("");
        const chair = getChair();

        if (
            name == "" ||
            email == "" ||
            password == "" ||
            universityId == "" ||
            chair == "" ||
            selectedCourseIds.length == 0
        ) {

            setErrorMessage(
                "Bitte alle Felder ausfüllen und mindestens einen Studiengang auswählen"
            );

            return;
        }


        try {

            const data = await registerProfessor(
                name,
                email,
                password,
                chair,
                Number(universityId),
                selectedCourseIds
            );


            console.log(
                LOGIN_MESSAGES.REGISTER_SUCCESS
            );

            console.log(data);


            navigate("/");


        } catch (error) {

            if (error instanceof Error) {

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

                <h2 className="register-title professor-title">
                    Registrieren als Professor
                </h2>


                <label>Name:</label>

                <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                />


                <label>E-Mail:</label>

                <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />


                <label>Passwort:</label>

                <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                />


                <label>Hochschule:</label>

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


                    {universities.map(
                        (university) => (

                            <option
                                key={university.id}
                                value={university.id}
                            >
                                {university.name}
                            </option>

                        )
                    )}

                </select>


                {universityId != "" && (

                    <>

                        <label>
                            Lehrstuhl:
                        </label>


                        <select
                            value={chairSelection}
                            onChange={(event) =>
                                setChairSelection(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Lehrstuhl auswählen
                            </option>


                            {chairOptions.map(
                                (chair) => {

                                    if (chair == "Anderer Lehrstuhl") {

                                        return (
                                            <option
                                                key={chair}
                                                value="other"
                                            >
                                                {chair}
                                            </option>
                                        );
                                    }


                                    return (
                                        <option
                                            key={chair}
                                            value={chair}
                                        >
                                            {chair}
                                        </option>
                                    );
                                }
                            )}

                        </select>


                        {chairSelection == "other" && (

                            <input
                                type="text"
                                placeholder="Lehrstuhl eingeben"
                                value={customChair}
                                onChange={(event) =>
                                    setCustomChair(
                                        event.target.value
                                    )
                                }
                            />

                        )}


                        <label>
                            Studiengänge:
                        </label>


                        <details>

                            <summary
                                style={{
                                    background: "rgba(255, 255, 255, 0.75)",
                                    borderRadius: "12px",
                                    padding: "14px",
                                    cursor: "pointer",
                                    marginBottom: "8px"
                                }}
                            >
                                {getSelectedCourseText()}
                            </summary>


                            <div
                                style={{
                                    maxHeight: "160px",
                                    overflowY: "auto",
                                    background: "rgba(255, 255, 255, 0.9)",
                                    borderRadius: "12px",
                                    padding: "10px"
                                }}
                            >

                                {courses.length == 0 && (

                                    <p>
                                        Keine Studiengänge vorhanden
                                    </p>

                                )}


                                {courses.map((course) => (

                                    <label
                                        key={course.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "8px",
                                            cursor: "pointer"
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
                                                width: "auto",
                                                margin: "0"
                                            }}
                                        />


                                        <span>
                                            {course.name}
                                        </span>

                                    </label>

                                ))}

                            </div>

                        </details>
                    </>
                )}

                <button onClick={RegisterFunction}>
                    Registrieren
                </button>

            </div>


            {errorMessage != "" && (
                <div className="error-box">
                    {errorMessage}
                </div>
            )}

        </div>
    );
}


export default RegisterProfessorPage;