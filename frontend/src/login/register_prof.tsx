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


function RegisterProfessorPage() {

    const navigate = useNavigate();


    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [chair, setChair] = useState("");


    const [universities, setUniversities] =
        useState<University[]>([]);

    const [universityId, setUniversityId] =
        useState("");

    const [courses, setCourses] =
        useState<Course[]>([]);

    const [selectedCourseIds, setSelectedCourseIds] =
        useState<number[]>([]);


    const [errorMessage, setErrorMessage] =
        useState("");


    /* Hochschulen beim Laden der Seite holen */
    useEffect(() => {

        fetch(`${API_URL}/api/universities`)
            .then((response) => response.json())
            .then((data) => {
                setUniversities(data);
            })
            .catch(() => {
                setErrorMessage(
                    "Hochschulen konnten nicht geladen werden"
                );
            });

    }, []);


    /* Studiengänge laden, sobald Hochschule gewählt wurde */
    useEffect(() => {

        if (universityId == "") {
            setCourses([]);
            setSelectedCourseIds([]);
            return;
        }


        fetch(
            `${API_URL}/api/universities/${universityId}/courses`
        )
            .then((response) => response.json())
            .then((data) => {
                setCourses(data);
                setSelectedCourseIds([]);
            })
            .catch(() => {
                setErrorMessage(
                    "Studiengänge konnten nicht geladen werden"
                );
            });

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


    async function RegisterFunction() {

        if (
            name == "" ||
            email == "" ||
            password == "" ||
            chair == "" ||
            universityId == "" ||
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


                <label>Lehrstuhl:</label>

                <input
                    type="text"
                    value={chair}
                    onChange={(event) =>
                        setChair(event.target.value)
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


                <label>Studiengänge:</label>

                <details className="course-dropdown">

                    <summary>
                        Studiengänge auswählen (
                        {selectedCourseIds.length} ausgewählt)
                    </summary>


                    <div className="course-dropdown-content">

                        {courses.map((course) => (

                            <label
                                key={course.id}
                                className="course-option"
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

                                {course.name}

                            </label>
                        ))}

                    </div>

                </details>


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