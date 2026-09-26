import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerProfessor } from "../apis/auth-api.ts";
import { LOGIN_MESSAGES } from "./login_fails";
import "./design_css/login.css";

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

    /* Wird benutzt, um nach erfolgreicher Registrierung
       auf eine andere Seite zu wechseln */
    const navigate = useNavigate();


    /* Speichert den eingegebenen Namen */
    const [name, setName] = useState("");


    /* Speichert die eingegebene E-Mail */
    const [email, setEmail] = useState("");


    /* Speichert das eingegebene Passwort */
    const [password, setPassword] = useState("");


    /* Speichert eine mögliche Fehlermeldung */
    const [errorMessage, setErrorMessage] = useState("");

    const [universities, setUniversities] = useState<University[]>([]);
    const [universityId, setUniversityId] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);

    useEffect(() => {
        if (universityId === "") {
            setCourses([]);
            return;
        }

        fetch("http://localhost:3000/api/universities/" + universityId + "/courses")
            .then((response) => response.json())
            .then((data) => {
                setCourses(data);
            });
    }, [universityId]);

    useEffect(() => {
        fetch("http://localhost:3000/api/universities")
            .then((response) => response.json())
            .then((data) => {
                setUniversities(data);
            });
    },
        []);

    function toggleCourse(courseId: number) {
        if (selectedCourseIds.includes(courseId)) {
            setSelectedCourseIds(
                selectedCourseIds.filter((id) => id != courseId)
            );
        } else {
            setSelectedCourseIds([
                ...selectedCourseIds,
                courseId
            ]);
        }
    }
    async function RegisterFunction() {

        /* Prüft zuerst, ob irgendein Feld leer ist */
        if (
            name == "" ||
            email == "" ||
            password == "" ||
            universityId == ""
        ) {

            /* Fehlermeldung anzeigen */
            setErrorMessage(
                "Bitte alle Felder ausfüllen"
            );

            return;
        }


        try {

            /* Professor über unsere API registrieren */
            const data = await registerProfessor(
                name,
                email,
                password,
                "nicht verwendet",
                Number(universityId),
                selectedCourseIds
            );


            /* Erfolg in der Konsole ausgeben */
            console.log(LOGIN_MESSAGES.REGISTER_SUCCESS);
            console.log(data);


            /* Nach erfolgreicher Registrierung
               zurück zum Login */
            navigate("/");


        } catch (error) {

            /* Fehlermeldung aus der API anzeigen */
            if (error instanceof Error) {

                setErrorMessage(error.message);

            } else {

                setErrorMessage(
                    "Registrierung fehlgeschlagen"
                );
            }
        }
    }


    return (
        <div className="auth-page">

            {/* Unser Liquid-Glass-Container */}
            <div className="login-glass">


                {/* Überschrift der Professor-Registrierung */}
                <h2 className="register-title professor-title">
                    Registrieren als Professor
                </h2>


                {/* Name */}
                <label>Name:</label>

                <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                />


                {/* E-Mail */}
                <label>E-Mail:</label>

                <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />


                {/* Passwort */}
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
                    onChange={(event) => setUniversityId(event.target.value)}
                >
                    <option value="">Hochschule auswählen</option>

                    {universities.map((university) => (
                        <option
                            key={university.id}
                            value={university.id}
                        >
                            {university.name}
                        </option>
                    ))}
                </select>
                <label>Kurse:</label>

                <details className="course-dropdown">
                    <summary>
                        Kurse auswählen ({selectedCourseIds.length} ausgewählt)
                    </summary>

                    <div className="course-dropdown-content">
                        {courses.map((course) => (
                            <label key={course.id} className="course-option">
                                <input
                                    type="checkbox"
                                    checked={selectedCourseIds.includes(course.id)}
                                    onChange={() => toggleCourse(course.id)}
                                />

                                {course.name}
                            </label>
                        ))}
                    </div>
                </details>

                {/* Registrierung */}
                <button onClick={RegisterFunction}>
                    Registrieren
                </button>

            </div>


            {/* Fehlermeldung */}
            {errorMessage !== "" && (
                <div className="error-box">
                    {errorMessage}
                </div>
            )}

        </div>
    );
}


/* Dadurch können wir die Seite in App.tsx importieren */
export default RegisterProfessorPage;