import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "../apis/auth-api.ts";
import { LOGIN_MESSAGES } from "./login_fails";
import "./design_css/login.css";


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
    const [course, setCourse] = useState("");


    /* Speichert eine mögliche Fehlermeldung */
    const [errorMessage, setErrorMessage] = useState("");


    async function RegisterFunction() {

        /* Prüft zuerst, ob irgendein Feld leer ist */
        if (
            name === "" ||
            email === "" ||
            password === "" ||
            course === ""
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
                course
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


                {/* Eingabe für den Kurs */}
                <label>Kurs:</label>

                <input
                    type="text"
                    value={course}
                    onChange={(event) =>
                        setCourse(event.target.value)
                    }
                />


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