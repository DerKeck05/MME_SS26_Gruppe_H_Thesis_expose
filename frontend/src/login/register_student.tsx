import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "../apis/auth-api.ts";
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
type Supervisor = {
    id: number;
    name: string;
    chair: string;
};

function RegisterStudentPage() {

    /* Wird benutzt, um nach erfolgreicher Registrierung
       wieder auf eine andere Seite zu wechseln */
    const navigate = useNavigate();


    /* Speichert den eingegebenen Namen */
    const [name, setName] = useState("");


    /* Speichert die eingegebene E-Mail */
    const [email, setEmail] = useState("");


    /* Speichert das eingegebene Passwort */
    const [password, setPassword] = useState("");


    /* Speichert den eingegebenen Studiengang/Kurs */
    const [courseId, setCourseId] = useState("");
    const [universities, setUniversities] = useState<University[]>([]);
    const [universityId, setUniversityId] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
    const [supervisorId, setSupervisorId] = useState("");


    /* Speichert eine mögliche Fehlermeldung */
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        fetch("http://localhost:3000/api/universities")
            .then((response) => response.json())
            .then((data) => {
                setUniversities(data);
            });
    }, []);

    useEffect(() => {
        if (universityId == "") {
            setCourses([]);
            setCourseId("");
            return;
        }

        fetch("http://localhost:3000/api/universities/" + universityId + "/courses")
            .then((response) => response.json())
            .then((data) => {
                setCourses(data);
            });
    }, [universityId]);
    useEffect(() => {
        if (universityId == "" || courseId == "") {
            setSupervisors([]);
            setSupervisorId("");
            return;
        }

        fetch(
            "http://localhost:3000/api/universities/" +
            universityId +
            "/courses/" +
            courseId +
            "/supervisors"
        )
            .then((response) => response.json())
            .then((data) => {
                setSupervisors(data);
            });
    }, [universityId, courseId]);

    async function RegisterFunction() {

        /* Prüft zuerst, ob irgendein Feld leer ist */
        if (
            name == "" ||
            email == "" ||
            password == "" ||
            universityId == "" ||
            courseId == "" ||
            supervisorId == ""

        ) {

            /* Fehlermeldung anzeigen */
            setErrorMessage(
                LOGIN_MESSAGES.REGISTER_FIELDS_MISSING
            );

            return;
        }


        try {

            /* Student über unsere API registrieren */
            const data = await registerStudent(
                name,
                email,
                password,
                Number(universityId),
                Number(courseId),
                Number(supervisorId)
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

                console.log(error.message);
                console.log(error.stack);

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


                {/* Überschrift der Student-Registrierung */}
                <h2 className="register-title">
                    Registrieren als Student
                </h2>


                {/* Eingabe für den Namen */}
                <label>Name:</label>

                <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                />


                {/* Eingabe für die E-Mail */}
                <label>E-Mail:</label>

                <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />


                {/* Eingabe für das Passwort */}
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
                        <option key={university.id} value={university.id}>
                            {university.name}
                        </option>
                    ))}
                </select>


                <label>Kurs:</label>

                <select
                    value={courseId}
                    onChange={(event) => setCourseId(event.target.value)}
                >
                    <option value="">Kurs auswählen</option>

                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
                <label>Professor:</label>

                <select
                    value={supervisorId}
                    onChange={(event) => setSupervisorId(event.target.value)}
                >
                    <option value="">Professor auswählen</option>

                    {supervisors.map((supervisor) => (
                        <option
                            key={supervisor.id}
                            value={supervisor.id}
                        >
                            {supervisor.name} - {supervisor.chair}
                        </option>
                    ))}
                </select>


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


export default RegisterStudentPage;