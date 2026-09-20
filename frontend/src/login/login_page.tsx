import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_MESSAGES } from "./login_fails";
import "./design_css/login.css";

function LoginPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let studentButtonClass = "";
    let professorButtonClass = "";
    const [errorMessage, setErrorMessage] = useState("");
    let errorBox = null;


 async function LoginFunction() {
        if (email == "" || password == "") {
        setErrorMessage("Bitte E-Mail und Passwort eingeben");
        return;
        }
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
            role
        })
    });

    const data = await response.json();

    if (response.ok) {
        console.log("Login erfolgreich");
        console.log(data);
        if (role =="student"){
            navigate("/student")
        }
          if (role == "professor") {
        // TODO: Später Weiterleitung zum Professor-Dashboard einfügen
        // navigate("/professor");
        }
    } else {
        setErrorMessage(data.message);
    }
   } 
 
    if (role == "student") {
    studentButtonClass = "active-role";
    }

    if (role == "professor") {
    professorButtonClass = "active-role";
    }
    if (errorMessage != "") {
    errorBox = (
        <div className="error-box">
            {errorMessage}
        </div>
    );
   }

  return (
    <div className="auth-page">

        <div className="login-glass">
            

            <h1>Clevermate</h1>

           <div className="role-buttons">
            <button className={professorButtonClass} onClick={() => setRole("professor")}
                  >Professor</button>
               <button
                   className={studentButtonClass} onClick={() => setRole("student")}
                   >Student  </button>
                  </div>

            <label>E-Mail: </label>
            <input
                type="email"
                placeholder="Ihre E-Mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <label>Passwort: </label>
            <input
                type="password"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button onClick={LoginFunction}>
                Login
            </button>

            <button onClick={() => navigate("/register")}>
                Registrieren
            </button>

        </div>
        {errorBox}

    </div>
);


}

export default LoginPage;