import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerProfessor } from "../apis/auth-api.ts";
import { LOGIN_MESSAGES } from "./login_fails";
import "./design_css/login.css";


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


    /* Speichert den eingegebenen Lehrstuhl */
    const [chair, setChair] = useState("");


    /* Speichert eine mögliche Fehlermeldung */
    const [errorMessage, setErrorMessage] = useState("");


    async function RegisterFunction() {

        /* Prüft zuerst, ob irgendein Feld leer ist */
        if (
            name === "" ||
            email === "" ||
            password === "" ||
            chair === ""
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
                chair
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


                {/* Lehrstuhl */}
                <label>Lehrstuhl:</label>

                <input
                    type="text"
                    value={chair}
                    onChange={(event) =>
                        setChair(event.target.value)
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


/* Dadurch können wir die Seite in App.tsx importieren */
export default RegisterProfessorPage;