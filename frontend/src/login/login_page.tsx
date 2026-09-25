import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../apis/auth-api.ts";
import "./design_css/login.css";

function LoginPage() {
    const navigate = useNavigate();

    /* speichert welche Rolle gerade ausgewählt ist */
    const [role, setRole] = useState("student");

    /* speichert die eingegebene Email */
    const [email, setEmail] = useState("");

    /* speichert das eingegebene Passwort */
    const [password, setPassword] = useState("");

    /* speichert eine mögliche Fehlermeldung */
    const [errorMessage, setErrorMessage] = useState("");


    async function loginFunction() {

        /* Prüfung ob Email oder Passwort leer ist */
        if (email === "" || password === "") {
            setErrorMessage("Bitte E-Mail und Passwort eingeben");
            return;
        }


        try {

            const data = await login(
                email,
                password,
                role as "student" | "professor"
            );

            console.log("Login erfolgreich");
            console.log(data);


            if (role === "student") {
                localStorage.setItem("studentId", String(data.user.id));
                navigate("/student");
            }


            if (role === "professor") {
                // später:
                // navigate("/professor");
            }


        } catch (error) {

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Login fehlgeschlagen");
            }
        }
    }


    /* CSS-Klasse für den aktiven Rollen-Button */
    const studentButtonClass =
        role === "student" ? "active-role" : "";

    const professorButtonClass =
        role === "professor" ? "active-role" : "";


    return (
        <div className="auth-page">

            <div className="login-glass">

                <h1>Clevermate</h1>


                {/* Rollen-Auswahl */}
                <div className="role-buttons">

                    <button
                        className={professorButtonClass}
                        onClick={() => setRole("professor")}
                    >
                        Professor
                    </button>


                    <button
                        className={studentButtonClass}
                        onClick={() => setRole("student")}
                    >
                        Student
                    </button>

                </div>


                {/* E-Mail */}
                <label>E-Mail:</label>

                <input
                    type="email"
                    placeholder="Ihre E-Mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />


                {/* Passwort */}
                <label>Passwort:</label>

                <input
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />


                {/* Login */}
                <button onClick={loginFunction}>
                    Login
                </button>


                {/* Registrierung */}
                <button onClick={() => navigate("/register")}>
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


export default LoginPage;