import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../apis/auth-api.ts";
import "./design_css/login.css";


function LoginPage() {

    const navigate = useNavigate();

    const [role, setRole] = useState("student");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");


    async function loginFunction() {

        if (email == "" || password == "") {
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


            if (role == "student") {

                localStorage.setItem(
                    "studentId",
                    data.user.id.toString()
                );

                navigate("/student");
            }


            if (role == "professor") {

                localStorage.setItem(
                    "supervisorId",
                    data.user.id.toString()
                );

                navigate("/professor");
            }


        } catch (error) {

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Login fehlgeschlagen");
            }
        }
    }


    const studentButtonClass =
        role == "student" ? "active-role" : "";

    const professorButtonClass =
        role == "professor" ? "active-role" : "";


    return (
        <div className="auth-page">

            <div className="login-glass">

                <h1>Clevermate</h1>


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


                <label>E-Mail:</label>

                <input
                    type="email"
                    placeholder="Ihre E-Mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />


                <label>Passwort:</label>

                <input
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />


                <button onClick={loginFunction}>
                    Login
                </button>


                <button onClick={() => navigate("/register")}>
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


export default LoginPage;