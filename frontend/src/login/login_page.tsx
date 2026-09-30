import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../apis/auth-api.ts";
import "./design_css/login.css";

function LoginPage() {

    /*
    useNavigate is used to change
    to another page after the login.
    */
    const navigate =
        useNavigate();


    /*
    The role can only be
    "student" or "professor".
    The default role is student.
    */
    const [role, setRole] =
        useState<"student" | "professor">(
            "student"
        );


    /*
    Stores the email
    entered by the user.
    */
    const [email, setEmail] =
        useState("");


    /*
    Stores the password
    entered by the user.
    */
    const [password, setPassword] =
        useState("");


    /*
    Stores an error message
    that can be shown below the login.
    */
    const [errorMessage, setErrorMessage] =
        useState("");


    /*
    This function is called
    when the user clicks the login button.
    First the input fields are checked.
    After that the login data
    is sent to the backend.
    */
    async function loginFunction() {

        /*
        Both email and password are required.
        If one field is empty,
        the login is stopped.
        */
        if (
            email == "" ||
            password == ""
        ) {

            setErrorMessage(
                "Bitte E-Mail und Passwort eingeben"
            );

            return;
        }


        try {

            /*
            Send email, password and role
            to the login API.
            Because role already has the correct type,
            no additional type conversion is needed.
            */
            const data =
                await login(
                    email,
                    password,
                    role
                );


            /*
            After a successful student login,
            the student ID is stored
            in the local storage
            The user is then sent
            to the student area.
            */
            if (role == "student") {

                localStorage.setItem(
                    "studentId",
                    String(data.user.id)
                );

                navigate(
                    "/student"
                );
            }


            /*
            The professor ID is also stored
            in the local storage.
            The user is then sent
            to the professor area.
            */
            if (role == "professor") {

                localStorage.setItem(
                    "supervisorId",
                    String(data.user.id)
                );

                navigate(
                    "/professor"
                );
            }


        } catch (error) {

            /*
            If the API returned a normal Error,
            its message is shown.
            Otherwise a general login
            error message is used.
            */
            if (error instanceof Error) {

                setErrorMessage(
                    error.message
                );

            } else {

                setErrorMessage(
                    "Login fehlgeschlagen"
                );
            }
        }
    }


    /*
    The selected role gets
    the CSS class "active-role".
    This visually shows the user
    which role is currently selected.
    */
    const studentButtonClass =
        role == "student"
            ? "active-role"
            : "";


    const professorButtonClass =
        role == "professor"
            ? "active-role"
            : "";


    return (
        <div className="auth-page">

            <div className="login-glass">

                <h1>
                    Clevermate
                </h1>

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
                <label>
                    E-Mail:
                </label>

                <input
                    type="email"
                    placeholder="Ihre E-Mail"
                    value={email}
                    onChange={(event) =>
                        setEmail(
                            event.target.value
                        )
                    }
                />

                <label>
                    Passwort:
                </label>

                <input
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(event) =>
                        setPassword(
                            event.target.value
                        )
                    }
                />
                <button
                    onClick={loginFunction}
                >
                    Login
                </button>

                <button
                    onClick={() =>
                        navigate("/register")
                    }
                >
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